// Lighting planner model (route /ndricimi): room presets, the lumen estimate and the mapping to the
// shop's own LED range. Everything here is an ORIENTATION estimate — the products publish wattage, not
// lumens, so we assume a typical LED efficacy and the shop confirms model and quantity.

export type RoomType = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'corridor' | 'office' | 'workshop' | 'terrace' | 'yard';
export type Cct = 'warm' | 'neutral' | 'cool';
export type StripType = '3000k' | '6500k-cob' | 'rgb';
export type StreetModel = 'std' | 'novaled';

export const P = {
  sensor18: 'p-ndricues-senzor-18w',
  ceiling36: 'p-ndricues-tavani-36w',
  wall24: 'p-ndricues-muri-24w',
  street50: 'p-ndricues-rrugor-50w',
  novaled50: 'p-ndricues-novaled-50w',
  strip: 'p-led-shirit',
  profile: 'p-profil-alumini-led',
} as const;

/** Typical LED efficacy assumed for the ceiling / wall lights (lm per W). */
export const EFFICACY = 90;
/** Watts of each fixture (from the product specs). */
export const WATTS: Record<string, number> = { [P.sensor18]: 18, [P.ceiling36]: 36, [P.wall24]: 24, [P.street50]: 50, [P.novaled50]: 50 };

export interface Preset {
  type: RoomType;
  /** Target illuminance range in lux (shown) and the value used for the estimate */
  lux: [number, number];
  luxCalc: number;
  area: number;
  areaMax: number;
  height: number;
  fixture: string;
  cct: Cct;
  /** The fixture only comes in one light colour (sensor 18W, street lights are 6500K) */
  cctFixed?: boolean;
  outdoor?: boolean;
  /** LED strip accent: share of the room perimeter (0 = no accent offered) */
  accentShare?: number;
  strip?: StripType;
  /** At least one fixture per N m² (long corridors / stairs) */
  minPerM2?: number;
}

export const PRESETS: Preset[] = [
  { type: 'living', lux: [150, 200], luxCalc: 175, area: 20, areaMax: 80, height: 2.7, fixture: P.ceiling36, cct: 'warm', accentShare: 0.5, strip: '3000k' },
  { type: 'kitchen', lux: [300, 300], luxCalc: 300, area: 12, areaMax: 50, height: 2.7, fixture: P.ceiling36, cct: 'neutral', accentShare: 0.4, strip: '6500k-cob' },
  { type: 'bedroom', lux: [100, 150], luxCalc: 125, area: 14, areaMax: 40, height: 2.7, fixture: P.ceiling36, cct: 'warm' },
  { type: 'bathroom', lux: [200, 200], luxCalc: 200, area: 6, areaMax: 25, height: 2.6, fixture: P.wall24, cct: 'neutral' },
  { type: 'corridor', lux: [100, 100], luxCalc: 100, area: 8, areaMax: 60, height: 2.7, fixture: P.sensor18, cct: 'cool', cctFixed: true, minPerM2: 8 },
  { type: 'office', lux: [400, 500], luxCalc: 450, area: 16, areaMax: 120, height: 2.8, fixture: P.ceiling36, cct: 'neutral' },
  { type: 'workshop', lux: [300, 500], luxCalc: 400, area: 60, areaMax: 400, height: 3.5, fixture: P.ceiling36, cct: 'cool' },
  { type: 'terrace', lux: [50, 50], luxCalc: 50, area: 10, areaMax: 60, height: 2.5, fixture: P.wall24, cct: 'neutral', outdoor: true },
  { type: 'yard', lux: [20, 50], luxCalc: 30, area: 200, areaMax: 3000, height: 6, fixture: P.street50, cct: 'cool', cctFixed: true, outdoor: true },
];

export const preset = (type: RoomType) => PRESETS.find((p) => p.type === type)!;

/** Yard / parking: one street light per N m² (80–120 m², chosen by the user). */
export const YARD_SPACING = [120, 100, 80] as const;

export interface Room {
  id: string;
  type: RoomType;
  area: number;
  height: number;
  /** Identical rooms of this kind (e.g. 2 bedrooms) */
  count: number;
  cct: Cct;
  accent: boolean;
  strip: StripType;
  street: StreetModel;
  spacing: number;
}

export function newRoom(type: RoomType, id: string): Room {
  const p = preset(type);
  return { id, type, area: p.area, height: p.height, count: 1, cct: p.cct, accent: !!p.accentShare, strip: p.strip ?? '3000k', street: 'std', spacing: 100 };
}

/** Utilisation factor: ~0.6 indoors up to 3 m, less for higher ceilings (min 0.4); 0.5 outdoors. */
export function utilisation(room: Room) {
  const p = preset(room.type);
  if (p.outdoor) return 0.5;
  const uf = 0.6 - Math.max(0, room.height - 3) * 0.04;
  return Math.max(0.4, Math.round(uf * 100) / 100);
}

export interface RoomPlan {
  room: Room;
  preset: Preset;
  uf: number;
  /** Required lumens (null for yards — spacing-based) */
  lumens: number | null;
  fixture: string;
  perFixtureLm: number | null;
  /** Fixtures in ONE room of this kind */
  qty: number;
  /** LED strip metres in ONE room (0 = none) */
  stripM: number;
  /** Multiplier applied to the totals: room.count × apartments (yards are shared, not multiplied) */
  mult: number;
}

export function planRoom(room: Room, units: number): RoomPlan {
  const p = preset(room.type);
  const uf = utilisation(room);
  const mult = room.count * (room.type === 'yard' ? 1 : units);
  if (room.type === 'yard') {
    const fixture = room.street === 'novaled' ? P.novaled50 : P.street50;
    return { room, preset: p, uf, lumens: null, fixture, perFixtureLm: null, qty: Math.max(1, Math.ceil(room.area / room.spacing)), stripM: 0, mult };
  }
  const lumens = (p.luxCalc * room.area) / uf;
  const perFixtureLm = WATTS[p.fixture] * EFFICACY;
  // A small tolerance (−10 %) so 2.05 fixtures does not become 3
  let qty = Math.max(1, Math.ceil(lumens / perFixtureLm - 0.1));
  if (p.minPerM2) qty = Math.max(qty, Math.ceil(room.area / p.minPerM2));
  const perimeter = 4 * Math.sqrt(room.area);
  const stripM = p.accentShare && room.accent ? Math.max(1, Math.round(perimeter * p.accentShare)) : 0;
  return { room, preset: p, uf, lumens, fixture: p.fixture, perFixtureLm, qty, stripM, mult };
}

/** One product line of the shopping list (product + chosen option). */
export interface Line {
  key: string;
  productId: string;
  options: Record<string, string>;
  /** 'm' for LED strip / profile (metres), otherwise pieces */
  unit: 'kom' | 'm';
  qty: number;
  /** Per-room breakdown, used for the quote note */
  parts: { roomId: string; qty: number }[];
}

export type Housing = Record<string, 'white' | 'black'>;
export const DEFAULT_HOUSING: Housing = { [P.ceiling36]: 'white', [P.wall24]: 'black' };

export const lineKey = (productId: string, options: Record<string, string>) =>
  `${productId}|${Object.keys(options).sort().map((k) => `${k}=${options[k]}`).join('&')}`;

/** Aggregate room plans into product lines, in a stable product order. */
export function buildLines(plans: RoomPlan[], housing: Housing): Line[] {
  const map = new Map<string, Line>();
  const add = (productId: string, options: Record<string, string>, unit: Line['unit'], qty: number, roomId: string) => {
    if (qty <= 0) return;
    const key = lineKey(productId, options);
    const line = map.get(key) ?? { key, productId, options, unit, qty: 0, parts: [] };
    line.qty += qty;
    line.parts.push({ roomId, qty });
    map.set(key, line);
  };
  for (const pl of plans) {
    const f = pl.fixture;
    const opts: Record<string, string> = f === P.ceiling36 || f === P.wall24 ? { color: housing[f] ?? DEFAULT_HOUSING[f] } : {};
    add(f, opts, 'kom', pl.qty * pl.mult, pl.room.id);
    if (pl.stripM) {
      add(P.strip, { type: pl.room.strip }, 'm', pl.stripM * pl.mult, pl.room.id);
      add(P.profile, {}, 'm', pl.stripM * pl.mult, pl.room.id);
    }
  }
  const order: string[] = [P.ceiling36, P.sensor18, P.wall24, P.street50, P.novaled50, P.strip, P.profile];
  return [...map.values()].sort((a, b) => order.indexOf(a.productId) - order.indexOf(b.productId) || a.key.localeCompare(b.key));
}

/** Kelvin label for a light colour. */
export const KELVIN: Record<Cct, string> = { warm: '3000K', neutral: '4000K', cool: '6500K' };

/** RGB of the light used by the sketch preview. */
export const LIGHT_RGB: Record<Cct, string> = { warm: '255 183 107', neutral: '255 226 190', cool: '214 230 255' };
