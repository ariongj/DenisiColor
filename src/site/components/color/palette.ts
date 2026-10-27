// Colour studio data: the curated fan-deck, ready-made schemes and a few colour helpers.
// The "DC-xxx" codes are ILLUSTRATIVE demo codes for this visualiser — they are not manufacturer
// codes and do not stand for products in stock. The shop confirms real shades, products and prices.
import type { L10n, Lang } from '@/lib/types';

export type SceneId = 'facade' | 'interior';

export interface Swatch {
  code: string;
  hex: string;
  name: L10n;
  family: FamilyId;
}

export type FamilyId = 'white' | 'beige' | 'grey' | 'blue' | 'green' | 'yellow' | 'red' | 'facade';

export const FAMILIES: { id: FamilyId; name: L10n }[] = [
  { id: 'white', name: { sq: 'Të bardha & krem', en: 'Whites & creams', me: 'Bele i krem' } },
  { id: 'beige', name: { sq: 'Bezhë & rërë', en: 'Beiges & sands', me: 'Bež i pesak' } },
  { id: 'grey', name: { sq: 'Gri', en: 'Greys', me: 'Sive' } },
  { id: 'blue', name: { sq: 'Blu', en: 'Blues', me: 'Plave' } },
  { id: 'green', name: { sq: 'Të gjelbra', en: 'Greens', me: 'Zelene' } },
  { id: 'yellow', name: { sq: 'Të verdha & okër', en: 'Yellows & ochres', me: 'Žute i oker' } },
  { id: 'red', name: { sq: 'Terrakota & të kuqe', en: 'Terracotta & reds', me: 'Terakota i crvene' } },
  { id: 'facade', name: { sq: 'Klasike fasade', en: 'Facade classics', me: 'Fasadni klasici' } },
];

// [code, hex, sq, en, me]
type Row = [string, string, string, string, string];
const ROWS: Record<FamilyId, Row[]> = {
  white: [
    ['101', '#FAFAF7', 'E bardhë borë', 'Snow white', 'Snežno bela'],
    ['102', '#F6F3EA', 'Bardhë qumështi', 'Milk white', 'Mlečno bela'],
    ['103', '#F3EEDF', 'Fildish', 'Ivory', 'Slonovača'],
    ['104', '#F1E9D6', 'Krem vanilje', 'Vanilla cream', 'Krem vanila'],
    ['105', '#EFE6D2', 'Lule pambuku', 'Cotton flower', 'Cvet pamuka'],
    ['106', '#ECE7DD', 'Gur i bardhë', 'White stone', 'Beli kamen'],
    ['107', '#F4EFE6', 'Perlë', 'Pearl', 'Biser'],
    ['108', '#EEE9E0', 'Liri', 'Linen', 'Lan'],
    ['109', '#F2EBDD', 'Krem i ngrohtë', 'Warm cream', 'Topla krem'],
    ['110', '#E9E4D8', 'Gur gëlqeror', 'Limestone', 'Krečnjak'],
  ],
  beige: [
    ['201', '#E6D9C2', 'Rërë e lehtë', 'Light sand', 'Svetli pesak'],
    ['202', '#DCCBAE', 'Bezhë klasike', 'Classic beige', 'Klasična bež'],
    ['203', '#D4C2A3', 'Grurë', 'Wheat', 'Pšenica'],
    ['204', '#CDB89A', 'Kapuçino', 'Cappuccino', 'Kapučino'],
    ['205', '#C4AD8C', 'Rërë shkretëtire', 'Desert sand', 'Pustinjski pesak'],
    ['206', '#B9A283', 'Kamel', 'Camel', 'Kamel'],
    ['207', '#E3D5C4', 'Bajame', 'Almond', 'Badem'],
    ['208', '#D8C7B5', 'Mokë e lehtë', 'Light mocha', 'Svetla moka'],
    ['209', '#A89078', 'Arrë e çelët', 'Light walnut', 'Svetli orah'],
    ['210', '#8E7660', 'Lëvore druri', 'Tree bark', 'Kora drveta'],
  ],
  grey: [
    ['301', '#E4E4E0', 'Gri mjegull', 'Mist grey', 'Siva magla'],
    ['302', '#D6D6D1', 'Gri perle', 'Pearl grey', 'Biserno siva'],
    ['303', '#C5C6C2', 'Gri guri', 'Stone grey', 'Kameno siva'],
    ['304', '#B5B4AE', 'Greige', 'Greige', 'Grej-bež'],
    ['305', '#A0A19D', 'Gri betoni', 'Concrete grey', 'Betonsko siva'],
    ['306', '#8A8C8A', 'Gri hekuri', 'Iron grey', 'Gvozdeno siva'],
    ['307', '#707373', 'Grafit i lehtë', 'Light graphite', 'Svetli grafit'],
    ['308', '#5A5E61', 'Gri plumbi', 'Lead grey', 'Olovno siva'],
    ['309', '#44484C', 'Antracit', 'Anthracite', 'Antracit'],
    ['310', '#2F3236', 'Grafit i errët', 'Dark graphite', 'Tamni grafit'],
  ],
  blue: [
    ['401', '#E3EBF0', 'Blu akulli', 'Ice blue', 'Ledeno plava'],
    ['402', '#CFDDE6', 'Blu qielli', 'Sky blue', 'Nebesko plava'],
    ['403', '#B3C8D6', 'Blu mëngjesi', 'Morning blue', 'Jutarnje plava'],
    ['404', '#8FA9BD', 'Blu pëlhure', 'Chambray', 'Šambre plava'],
    ['405', '#6E8CA3', 'Det i qetë', 'Calm sea', 'Mirno more'],
    ['406', '#4D6E8A', 'Blu çeliku', 'Steel blue', 'Čelično plava'],
    ['407', '#2F4E6E', 'Blu e thellë', 'Deep blue', 'Duboko plava'],
    ['408', '#264A78', 'Blu Denisi', 'Denisi navy', 'Denisi teget'],
    ['409', '#1C2B3E', 'Blu e natës', 'Midnight blue', 'Ponoćno plava'],
  ],
  green: [
    ['501', '#E7EDE2', 'Mente e zbehtë', 'Pale mint', 'Bleda menta'],
    ['502', '#D5E0CF', 'Fistik', 'Pistachio', 'Pistać'],
    ['503', '#C3D0B6', 'Sherebelë', 'Sage', 'Žalfija'],
    ['504', '#A9B99A', 'Ulli i lehtë', 'Light olive', 'Svetla maslina'],
    ['505', '#8FA184', 'Eukalipt', 'Eucalyptus', 'Eukaliptus'],
    ['506', '#6F8667', 'Gjelbër pylli', 'Forest green', 'Šumsko zelena'],
    ['507', '#55705F', 'Bredh', 'Fir green', 'Jela'],
    ['508', '#3F5A4C', 'Gjelbër e errët', 'Deep green', 'Tamno zelena'],
    ['509', '#B8C9C0', 'Gjelbër deti', 'Sea green', 'Morsko zelena'],
  ],
  yellow: [
    ['601', '#F6EDC8', 'Verdhë e butë', 'Soft yellow', 'Meka žuta'],
    ['602', '#F3E2A6', 'Vanilje', 'Vanilla', 'Vanila'],
    ['603', '#EFD487', 'Misër', 'Corn', 'Kukuruz'],
    ['604', '#E8C468', 'Mjaltë', 'Honey', 'Med'],
    ['605', '#DDB04F', 'Okër e artë', 'Golden ochre', 'Zlatni oker'],
    ['606', '#C99A3E', 'Okër', 'Ochre', 'Oker'],
    ['607', '#F5B100', 'Verdhë Denisi', 'Denisi amber', 'Denisi ćilibar'],
    ['608', '#B5832F', 'Mustardë', 'Mustard', 'Senf'],
  ],
  red: [
    ['701', '#F1DCCF', 'Pjeshkë e zbehtë', 'Pale peach', 'Bleda breskva'],
    ['702', '#E8C1A8', 'Kajsi', 'Apricot', 'Kajsija'],
    ['703', '#DDA486', 'Salmon', 'Salmon', 'Losos'],
    ['704', '#CF8A69', 'Terrakota e lehtë', 'Light terracotta', 'Svetla terakota'],
    ['705', '#B96B4C', 'Terrakota', 'Terracotta', 'Terakota'],
    ['706', '#A0533A', 'Tullë', 'Brick', 'Cigla'],
    ['707', '#8B3E2F', 'E kuqe vere', 'Wine red', 'Vinsko crvena'],
    ['708', '#6E3229', 'E kuqe e errët', 'Oxblood', 'Tamnocrvena'],
  ],
  facade: [
    ['801', '#F0E2C4', 'Krem fasade', 'Facade cream', 'Fasadna krem'],
    ['802', '#EAD3AC', 'Pjeshkë fasade', 'Facade peach', 'Fasadna breskva'],
    ['803', '#E6C9A0', 'Kajsi e butë', 'Soft apricot', 'Meka kajsija'],
    ['804', '#D9C4A0', 'Gur Prizreni', 'Prizren stone', 'Prizrenski kamen'],
    ['805', '#E8DCC6', 'Bezhë e ngrohtë', 'Warm beige', 'Topla bež'],
    ['806', '#D6D9CF', 'Gri ulliri', 'Olive grey', 'Maslinasto siva'],
    ['807', '#C9B79A', 'Rërë lumi', 'River sand', 'Rečni pesak'],
    ['808', '#B9A48A', 'Kafe me qumësht', 'Milky coffee', 'Bela kafa'],
    ['809', '#DCC8B0', 'Gur Sharri', 'Sharr stone', 'Šarski kamen'],
    ['810', '#9C8670', 'Kafe fasade', 'Facade brown', 'Fasadno braon'],
  ],
};

export const SWATCHES: Swatch[] = (Object.keys(ROWS) as FamilyId[]).flatMap((family) =>
  ROWS[family].map(([code, hex, sq, en, me]) => ({ code: `DC-${code}`, hex, name: { sq, en, me }, family })),
);

const BY_CODE = new Map(SWATCHES.map((s) => [s.code, s]));
export const swatch = (code?: string) => (code ? BY_CODE.get(code) : undefined);

/* ------------------------------------------------------------------ */
/*  Scenes, surfaces, schemes                                          */
/* ------------------------------------------------------------------ */

/** One paintable surface's colour: a fan-deck code, or a custom hex (no code). */
export interface Paint {
  hex: string;
  code?: string;
}
export type Paints = Record<string, Paint>;

export interface SurfaceDef {
  id: string;
  name: L10n;
  /** Short label for chips */
  short: L10n;
}

export const SURFACES: Record<SceneId, SurfaceDef[]> = {
  facade: [
    { id: 'walls', name: { sq: 'Muret e fasadës', en: 'Facade walls', me: 'Zidovi fasade' }, short: { sq: 'Muret', en: 'Walls', me: 'Zidovi' } },
    { id: 'accent', name: { sq: 'Akcenti & brezi', en: 'Accent & band', me: 'Akcenat i traka' }, short: { sq: 'Akcenti', en: 'Accent', me: 'Akcenat' } },
    { id: 'plinth', name: { sq: 'Cokla', en: 'Plinth (base)', me: 'Cokla' }, short: { sq: 'Cokla', en: 'Plinth', me: 'Cokla' } },
    { id: 'trim', name: { sq: 'Kornizat e dritareve & derës', en: 'Window & door trim', me: 'Okviri prozora i vrata' }, short: { sq: 'Kornizat', en: 'Trim', me: 'Okviri' } },
  ],
  interior: [
    { id: 'walls', name: { sq: 'Muret kryesore', en: 'Main walls', me: 'Glavni zidovi' }, short: { sq: 'Muret', en: 'Walls', me: 'Zidovi' } },
    { id: 'accent', name: { sq: 'Muri akcent', en: 'Accent wall', me: 'Akcentni zid' }, short: { sq: 'Akcenti', en: 'Accent', me: 'Akcenat' } },
    { id: 'ceiling', name: { sq: 'Tavani', en: 'Ceiling', me: 'Plafon' }, short: { sq: 'Tavani', en: 'Ceiling', me: 'Plafon' } },
  ],
};

const p = (code: string): Paint => ({ hex: swatch(code)!.hex, code });

/** "Before" state used by the compare slider: bare render / the room as it is today. */
export const EXISTING: Record<SceneId, Paints> = {
  facade: { walls: { hex: '#BCB5A7' }, accent: { hex: '#BCB5A7' }, plinth: { hex: '#8A857B' }, trim: { hex: '#C9C4B9' } },
  interior: { walls: { hex: '#DCD6CA' }, accent: { hex: '#DCD6CA' }, ceiling: { hex: '#E6E2DA' } },
};

export interface Scheme {
  id: string;
  name: L10n;
  paints: Record<SceneId, Paints>;
}

export const SCHEMES: Scheme[] = [
  {
    id: 'classic',
    name: { sq: 'Klasike', en: 'Classic', me: 'Klasična' },
    paints: {
      facade: { walls: p('DC-103'), accent: p('DC-204'), plinth: p('DC-209'), trim: p('DC-101') },
      interior: { walls: p('DC-104'), accent: p('DC-204'), ceiling: p('DC-101') },
    },
  },
  {
    id: 'modern',
    name: { sq: 'Moderne gri', en: 'Modern grey', me: 'Moderna siva' },
    paints: {
      facade: { walls: p('DC-302'), accent: p('DC-309'), plinth: p('DC-310'), trim: p('DC-101') },
      interior: { walls: p('DC-301'), accent: p('DC-308'), ceiling: p('DC-101') },
    },
  },
  {
    id: 'med',
    name: { sq: 'Mesdhetare', en: 'Mediterranean', me: 'Mediteranska' },
    paints: {
      facade: { walls: p('DC-102'), accent: p('DC-405'), plinth: p('DC-705'), trim: p('DC-401') },
      interior: { walls: p('DC-102'), accent: p('DC-405'), ceiling: p('DC-101') },
    },
  },
  {
    id: 'natural',
    name: { sq: 'Natyrale', en: 'Natural', me: 'Prirodna' },
    paints: {
      facade: { walls: p('DC-201'), accent: p('DC-504'), plinth: p('DC-210'), trim: p('DC-103') },
      interior: { walls: p('DC-207'), accent: p('DC-505'), ceiling: p('DC-102') },
    },
  },
];

export const DEFAULT_SCHEME = SCHEMES[0];

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                     */
/* ------------------------------------------------------------------ */

/** "#abc" / "abc" / "#AABBCC" → "#AABBCC", or null when it isn't a hex colour. */
export function normalizeHex(v: string): string | null {
  const s = v.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(s)) return `#${s.split('').map((c) => c + c).join('')}`.toUpperCase();
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s}`.toUpperCase();
  return null;
}

export function rgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex) ?? '#000000';
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

/** WCAG relative luminance 0…1 */
export function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Text colour that reads on top of `hex`. */
export const inkOn = (hex: string) => (luminance(hex) > 0.36 ? '#121a24' : '#ffffff');

/** Mix two hex colours (t = 0 → a, 1 → b). */
export function mix(a: string, b: string, t: number) {
  const A = rgb(a);
  const B = rgb(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

/** Display name of a paint in the given language (custom colours show their hex). */
export function paintName(paint: Paint, lang: Lang, customLabel: string) {
  const s = swatch(paint.code);
  if (s) return s.name[lang] || s.name.me;
  return customLabel;
}

/** Albanian-insensitive fold for search ("ë" → "e", "ç" → "c"). */
export const foldText = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
