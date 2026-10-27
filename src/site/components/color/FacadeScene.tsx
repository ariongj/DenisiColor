// Hand-drawn facade scene: a two-storey Kosovo family house with a hip roof, a central entrance bay
// and a balcony, seen slightly from the right so the shaded side wall gives depth.
// Paintable: facade walls (+ chimney), accent (entrance bay + floor band), plinth (cokël), trim.
import { luminance } from './palette';
import { Outline, polyD, rectD, frameD, SceneSvg, Surface, GrainPattern, useSvgIds, type Pt, type SceneProps } from './svg';

/* ---- geometry (viewBox 1200×760) ---- */
const FL = 300; // front wall left
const FR = 840; // front wall right / corner
const WT = 200; // top of the walls (under the eaves)
const G = 640; // ground line at the front corner
const PL = 588; // top of the plinth
const BAND = 412; // floor band
const BAND_H = 16;
const BAY = [500, 640] as const; // entrance bay (accent)
const DEPTH = 130; // foreshortened depth of the side wall
const VP: Pt = [2600, 520]; // vanishing point of the side wall (eye level ≈ y 520)

/** Point on the side wall: d = 0 at the front corner → 1 at the back corner, at front height y. */
const sp = (d: number, y: number): Pt => {
  const dx = d * DEPTH;
  return [FR + dx, y + ((VP[1] - y) * dx) / (VP[0] - FR)];
};
const sideQuad = (d0: number, d1: number, y0: number, y1: number) => polyD([sp(d0, y0), sp(d1, y0), sp(d1, y1), sp(d0, y1)]);

// Front windows: [x, y, w, h] of the opening
const WINDOWS: [number, number, number, number][] = [
  [352, 268, 96, 104],
  [692, 268, 96, 104],
  [352, 458, 96, 102],
  [692, 458, 96, 102],
];
const DOOR: [number, number, number, number] = [538, 440, 64, PL - 440];
const BALCONY_DOOR: [number, number, number, number] = [532, 256, 76, 148];
const SIDE_WINDOWS: [number, number][] = [
  [268, 372],
  [458, 560],
];

// Roof
const EL = 266;
const ER = 874;
const EY = 194;
const RIDGE: [Pt, Pt] = [
  [521, 102],
  [749, 102],
];
const EAVE_BACK = sp(1 + 12 / DEPTH, EY).map((v, i) => (i === 0 ? v + (ER - FR) : v)) as Pt;

/* ---- surfaces ---- */
const surround = ([x, y, w, h]: number[], sill = true) => [
  frameD([x - 10, y - 10, w + 20, h + (sill ? 10 : 10)], [x, y, w, h]),
  ...(sill ? [rectD(x - 16, y + h, w + 32, 9)] : []),
];
const sideSurround = ([y0, y1]: [number, number]) => polyD([sp(0.27, y0 - 9), sp(0.73, y0 - 9), sp(0.73, y1), sp(0.27, y1)]) + polyD([sp(0.31, y0), sp(0.69, y0), sp(0.69, y1), sp(0.31, y1)]);
const sideSill = ([, y1]: [number, number]) => polyD([sp(0.24, y1), sp(0.76, y1), sp(0.76, y1 + 8), sp(0.24, y1 + 8)]);

const CHIMNEY_FRONT = rectD(640, 64, 28, 78);
const CHIMNEY_SIDE = polyD([
  [668, 64],
  [681, 67],
  [681, 136],
  [668, 142],
]);

export const FACADE_PATHS: Record<string, string[]> = {
  walls: [rectD(FL, WT, FR - FL, PL - WT), sideQuad(0, 1, WT, PL), CHIMNEY_FRONT, CHIMNEY_SIDE],
  accent: [rectD(BAY[0], WT, BAY[1] - BAY[0], PL - WT), rectD(FL, BAND, FR - FL, BAND_H), sideQuad(0, 1, BAND, BAND + BAND_H)],
  plinth: [rectD(FL - 4, PL, FR - FL + 4, G - PL), sideQuad(0, 1, PL, G)],
  trim: [...WINDOWS.flatMap((w) => surround(w)), ...surround(DOOR, false), ...surround(BALCONY_DOOR, false), ...SIDE_WINDOWS.flatMap((w) => [sideSurround(w), sideSill(w)])],
};

const ORDER = ['walls', 'accent', 'plinth', 'trim'] as const;

export function FacadeScene(props: SceneProps) {
  const id = useSvgIds();
  const { paints, selected, compact } = props;
  const hex = (k: string) => paints[k]?.hex ?? '#cccccc';
  // Sunlight reads stronger on dark paint, softer on white (avoids a washed-out look)
  const lw = luminance(hex('walls'));
  const sun = 0.08 + 0.14 * (1 - lw);
  const trimClick = props.still ? undefined : () => props.onSelect?.('trim');

  return (
    <SceneSvg viewBox={compact ? '190 40 860 690' : '0 0 1200 760'} title={props.title} className={props.className} still={props.still}>
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c8df" />
          <stop offset="0.55" stopColor="#d3e2ea" />
          <stop offset="1" stopColor="#eef0ea" />
        </linearGradient>
        <radialGradient id={id('sunGlow')} cx="0.12" cy="0.1" r="0.5">
          <stop offset="0" stopColor="#fff8e6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff8e6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('lawn')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8aa26f" />
          <stop offset="1" stopColor="#6f8a58" />
        </linearGradient>
        <linearGradient id={id('roof')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a4630" />
          <stop offset="1" stopColor="#bd6142" />
        </linearGradient>
        <linearGradient id={id('roofSide')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7b3524" />
          <stop offset="1" stopColor="#8f412b" />
        </linearGradient>
        <pattern id={id('tiles')} width="16" height="11" patternUnits="userSpaceOnUse">
          <rect width="16" height="11" fill="none" />
          <path d="M0 10.5h16" stroke="#5a2014" strokeOpacity="0.32" strokeWidth="1.4" />
          <path d="M8 0v11" stroke="#5a2014" strokeOpacity="0.12" strokeWidth="1" />
          <rect x="1" y="1" width="5" height="8" fill="#fff" fillOpacity="0.06" />
        </pattern>
        <pattern id={id('tilesSide')} width="16" height="11" patternUnits="userSpaceOnUse" patternTransform="skewY(10.5)">
          <path d="M0 10.5h16" stroke="#3d140b" strokeOpacity="0.35" strokeWidth="1.4" />
        </pattern>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#d6e4ec" />
          <stop offset="0.45" stopColor="#8aa3b5" />
          <stop offset="1" stopColor="#3f5466" />
        </linearGradient>
        <linearGradient id={id('glassSide')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa6b6" />
          <stop offset="1" stopColor="#2f4050" />
        </linearGradient>
        <linearGradient id={id('wood')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a442b" />
          <stop offset="0.5" stopColor="#80553a" />
          <stop offset="1" stopColor="#5c3a24" />
        </linearGradient>
        <linearGradient id={id('soffit')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d140c" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#1d140c" stopOpacity="0.16" />
          <stop offset="1" stopColor="#1d140c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('sun')} x1="0" y1="0" x2="1" y2="0.9">
          <stop offset="0" stopColor="#fffaf0" stopOpacity={sun} />
          <stop offset="0.55" stopColor="#fffaf0" stopOpacity="0" />
          <stop offset="1" stopColor="#0d1520" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id={id('contact')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={id('down')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f0a06" stopOpacity="0.42" />
          <stop offset="1" stopColor="#0f0a06" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('right')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f0a06" stopOpacity="0.26" />
          <stop offset="1" stopColor="#0f0a06" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('leaf')} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#7d9a5c" />
          <stop offset="1" stopColor="#3f5a33" />
        </linearGradient>
        <linearGradient id={id('leafDark')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#5d7a48" />
          <stop offset="1" stopColor="#2c4227" />
        </linearGradient>
        <GrainPattern id={id('grain')} />
        <clipPath id={id('front')}>
          <rect x={FL - 4} y={WT} width={FR - FL + 4} height={G - WT} />
        </clipPath>
        <clipPath id={id('side')}>
          <path d={sideQuad(0, 1, WT, G)} />
        </clipPath>
        <filter id={id('blur')} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('soft')} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* ---------- sky & landscape ---------- */}
      <rect width="1200" height="760" fill={`url(#${id('sky')})`} />
      <rect width="1200" height="640" fill={`url(#${id('sunGlow')})`} />
      <g fill="#fff" opacity="0.75">
        <ellipse cx="930" cy="96" rx="92" ry="20" />
        <ellipse cx="985" cy="82" rx="58" ry="22" />
        <ellipse cx="880" cy="90" rx="44" ry="15" />
        <ellipse cx="300" cy="64" rx="70" ry="13" opacity="0.7" />
        <ellipse cx="345" cy="55" rx="42" ry="15" opacity="0.7" />
      </g>
      <path d="M0 505 C 160 462 300 492 470 470 S 820 438 980 470 S 1140 476 1200 462 V640 H0 Z" fill="#a9bdb4" opacity="0.75" />
      <path d="M0 548 C 210 520 380 548 600 530 S 960 512 1200 538 V640 H0 Z" fill="#8ea889" />
      {/* hedge row behind the plot */}
      <g fill="#61804f">
        {[40, 110, 175, 1010, 1080, 1150].map((x, i) => (
          <ellipse key={x} cx={x} cy={600 - (i % 2) * 6} rx={52} ry={40} />
        ))}
      </g>
      <rect y="628" width="1200" height="132" fill={`url(#${id('lawn')})`} />
      {/* cast shadow of the house on the lawn (sun from the upper left) */}
      <path d={polyD([sp(0, G), sp(1, G), [1150, 650], [1180, 676], [860, 676]])} fill="#1d2a14" opacity="0.28" filter={`url(#${id('soft')})`} />
      <ellipse cx="620" cy="646" rx="380" ry="12" fill="#1d2a14" opacity="0.3" filter={`url(#${id('blur')})`} />
      {/* path to the door */}
      <path d="M512 640 H628 L700 760 H440 Z" fill="#d6d0c4" />
      <path d="M512 640 H628 L700 760 H440 Z" fill="none" stroke="#b8b1a3" strokeWidth="1.2" />
      <g stroke="#b8b1a3" strokeWidth="1.2">
        <path d="M502 657 H637" />
        <path d="M490 678 H650" />
        <path d="M475 703 H665" />
        <path d="M459 730 H682" />
        <path d="M570 640 V760" />
      </g>

      {/* ---------- roof ---------- */}
      <path d={polyD([[ER, EY], EAVE_BACK, RIDGE[1]])} fill={`url(#${id('roofSide')})`} />
      <path d={polyD([[ER, EY], EAVE_BACK, RIDGE[1]])} fill={`url(#${id('tilesSide')})`} />
      <path d={polyD([[EL, EY], [ER, EY], RIDGE[1], RIDGE[0]])} fill={`url(#${id('roof')})`} />
      <path d={polyD([[EL, EY], [ER, EY], RIDGE[1], RIDGE[0]])} fill={`url(#${id('tiles')})`} />
      {/* hips & ridge caps */}
      <g stroke="#e08a63" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round">
        <path d={`M${EL} ${EY} L${RIDGE[0][0]} ${RIDGE[0][1]}`} />
        <path d={`M${ER} ${EY} L${RIDGE[1][0]} ${RIDGE[1][1]}`} />
      </g>
      <path d={`M${RIDGE[0][0] - 2} ${RIDGE[0][1]} H${RIDGE[1][0] + 2}`} stroke="#7a3220" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${RIDGE[1][0]} ${RIDGE[1][1]} L${EAVE_BACK[0]} ${EAVE_BACK[1]}`} stroke="#6a2a1a" strokeWidth="2.5" strokeOpacity="0.6" />
      {/* chimney shadow on the roof */}
      <path d="M668 142 L700 150 L700 120 L681 112 Z" fill="#3a140a" opacity="0.28" />

      {/* ---------- paintable surfaces ---------- */}
      {ORDER.map((k) => (
        <Surface key={k} id={k} d={FACADE_PATHS[k]} hex={hex(k)} props={props} />
      ))}

      {/* chimney cap + shading */}
      <g pointerEvents="none">
        <path d={CHIMNEY_SIDE} fill="#33405a" opacity="0.35" />
        <rect x="640" y="64" width="28" height="18" fill={`url(#${id('soffit')})`} />
        <path d="M635 58 H684 L687 64 H633 Z" fill="#8d8a84" />
        <rect x="633" y="64" width="54" height="5" fill="#6d6a65" />
        <rect x="640" y="64" width="28" height="78" fill={`url(#${id('grain')})`} style={{ mixBlendMode: 'soft-light' }} opacity="0.45" />
      </g>

      {/* ---------- light & shadow on the front plane ---------- */}
      <g clipPath={`url(#${id('front')})`} pointerEvents="none">
        <rect x={FL - 4} y={WT} width={FR - FL + 4} height={G - WT} fill={`url(#${id('grain')})`} style={{ mixBlendMode: 'soft-light' }} opacity="0.55" />
        <rect x={FL - 4} y={WT} width={FR - FL + 4} height={G - WT} fill={`url(#${id('sun')})`} />
        <rect x={FL - 4} y={WT} width={FR - FL + 4} height="70" fill={`url(#${id('soffit')})`} />
        <rect x={FL - 4} y={G - 26} width={FR - FL + 4} height="26" fill={`url(#${id('contact')})`} />
        {/* projecting entrance bay: lit left edge, shadow to the right */}
        <rect x={BAY[1]} y={WT + 6} width="16" height={PL - WT - 6} fill={`url(#${id('right')})`} />
        <rect x={BAY[0]} y={WT} width="3" height={PL - WT} fill="#fff" opacity="0.28" />
        <rect x={BAY[1] - 2} y={WT} width="2" height={PL - WT} fill="#000" opacity="0.12" />
        {/* band & plinth edges */}
        <rect x={FL} y={BAND + BAND_H} width={FR - FL} height="7" fill={`url(#${id('down')})`} />
        <rect x={FL} y={BAND} width={FR - FL} height="1.5" fill="#fff" opacity="0.35" />
        <rect x={FL - 4} y={PL} width={FR - FL + 4} height="2" fill="#fff" opacity="0.4" />
        <rect x={FL - 4} y={PL + 2} width={FR - FL + 4} height="5" fill="#000" opacity="0.08" />
      </g>

      {/* ---------- side wall: cool shade ---------- */}
      <g clipPath={`url(#${id('side')})`} pointerEvents="none">
        <path d={sideQuad(0, 1, WT, G)} fill="#7f8ca3" style={{ mixBlendMode: 'multiply' }} opacity="0.62" />
        <path d={sideQuad(0, 1, WT, G)} fill={`url(#${id('grain')})`} style={{ mixBlendMode: 'soft-light' }} opacity="0.5" />
        <path d={sideQuad(0, 1, WT, WT + 60)} fill={`url(#${id('soffit')})`} />
        <path d={sideQuad(0, 1, G - 26, G)} fill={`url(#${id('contact')})`} />
        <path d={sideQuad(0, 0.02, WT, G)} fill="#000" opacity="0.08" />
      </g>

      {/* ---------- windows, door, balcony ---------- */}
      {WINDOWS.map((w, i) => (
        <FrontWindow key={i} box={w} id={id} onClick={trimClick} />
      ))}
      {SIDE_WINDOWS.map(([y0, y1], i) => (
        <g key={i} pointerEvents={trimClick ? undefined : 'none'} onClick={trimClick} style={{ cursor: trimClick ? 'pointer' : undefined }}>
          <path d={polyD([sp(0.31, y0), sp(0.69, y0), sp(0.69, y1), sp(0.31, y1)])} fill="#ecebe6" />
          <path d={polyD([sp(0.34, y0 + 14), sp(0.495, y0 + 14), sp(0.495, y1 - 4), sp(0.34, y1 - 4)])} fill={`url(#${id('glassSide')})`} />
          <path d={polyD([sp(0.515, y0 + 14), sp(0.665, y0 + 14), sp(0.665, y1 - 4), sp(0.515, y1 - 4)])} fill={`url(#${id('glassSide')})`} />
          <path d={polyD([sp(0.31, y0), sp(0.69, y0), sp(0.69, y0 + 12), sp(0.31, y0 + 12)])} fill="#d9d7d0" />
          <path d={polyD([sp(0.31, y0), sp(0.69, y0), sp(0.69, y1), sp(0.31, y1)])} fill="#1b2a44" opacity="0.18" />
          <path d={polyD([sp(0.24, y1 + 8), sp(0.76, y1 + 8), sp(0.76, y1 + 18), sp(0.24, y1 + 18)])} fill="#000" opacity="0.12" />
        </g>
      ))}

      {/* balcony door (upper floor) */}
      <Door box={BALCONY_DOOR} id={id} glass onClick={trimClick} />
      {/* entrance door */}
      <Door box={DOOR} id={id} onClick={trimClick} />
      {/* shadow under the balcony slab (falls on the bay and the door) */}
      <g pointerEvents="none">
        <path d={`M486 418 H676 V476 H498 Z`} fill={`url(#${id('down')})`} />
        {/* slab */}
        <rect x="474" y="402" width="192" height="15" fill="#e9e6df" />
        <rect x="474" y="402" width="192" height="3" fill="#fff" opacity="0.8" />
        <rect x="474" y="414" width="192" height="4" fill="#9f9a90" />
        <path d="M666 402 L676 404 V420 L666 417 Z" fill="#b9b4aa" />
        {/* railing */}
        <rect x="474" y="336" width="192" height="5" rx="1.5" fill="#2b3036" />
        <rect x="478" y="392" width="184" height="3" fill="#2b3036" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={481 + i * 11.8} y="341" width="2.6" height="61" fill="#2b3036" />
        ))}
        <rect x="474" y="336" width="192" height="1.5" fill="#fff" opacity="0.35" />
        <path d="M666 336 L676 338 V406 L666 402 Z" fill="#2b3036" opacity="0.85" />
        {/* wall light next to the door */}
        <rect x="514" y="452" width="10" height="16" rx="2" fill="#2b3036" />
        <ellipse cx="519" cy="470" rx="14" ry="5" fill="#ffe7a8" opacity="0.35" />
        {/* house number plate */}
        <rect x="612" y="470" width="18" height="12" rx="2" fill="#f7f5f0" stroke="#2b3036" strokeOpacity="0.5" />
        <text x="621" y="479.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#2b3036" fontFamily="Montserrat, sans-serif">
          7
        </text>
      </g>

      {/* steps */}
      <g pointerEvents="none">
        {[0, 1, 2].map((i) => {
          const w = 116 + i * 18;
          const x = 570 - w / 2;
          const y = PL + i * 17;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height="5" fill="#ddd8ce" />
              <rect x={x} y={y + 5} width={w} height="12" fill="#b9b3a8" />
              <rect x={x} y={y + 15} width={w} height="2" fill="#000" opacity="0.12" />
            </g>
          );
        })}
      </g>

      {/* gutter, fascia, downpipe */}
      <g pointerEvents="none">
        <path d={polyD([[ER, EY], EAVE_BACK, [EAVE_BACK[0], EAVE_BACK[1] + 9], [ER, EY + 9]])} fill="#cfccc4" />
        <rect x={EL} y={EY} width={ER - EL} height="9" fill="#f3f1ec" />
        <rect x={EL - 3} y={EY + 6} width={ER - EL + 6} height="6" rx="3" fill="#e3e0d9" />
        <rect x={EL - 3} y={EY + 6} width={ER - EL + 6} height="1.5" fill="#fff" />
        <rect x={EL} y={EY + 12} width={ER - EL} height="3" fill="#000" opacity="0.18" />
        <rect x="309" y={EY + 12} width="7" height={G - EY - 18} fill="#e5e2db" />
        <rect x="314" y={EY + 12} width="2" height={G - EY - 18} fill="#000" opacity="0.12" />
        <rect x="318" y={EY + 12} width="5" height={G - EY - 18} fill="#000" opacity="0.08" />
        {[260, 400, 520].map((y) => (
          <rect key={y} x="307" y={y} width="11" height="4" fill="#cfcbc3" />
        ))}
        <path d="M304 628 H322 V640 H300 Z" fill="#e5e2db" />
      </g>

      {/* ---------- vegetation (foreground) ---------- */}
      <g pointerEvents="none">
        {/* tree on the left */}
        <path d="M140 640 C 146 590 150 540 146 470 L 158 470 C 156 540 160 590 168 640 Z" fill="#5c4634" />
        <path d="M152 520 L 120 470 M154 500 L 190 455" stroke="#5c4634" strokeWidth="6" strokeLinecap="round" />
        <g>
          <circle cx="152" cy="420" r="78" fill={`url(#${id('leafDark')})`} />
          <circle cx="100" cy="460" r="52" fill={`url(#${id('leafDark')})`} />
          <circle cx="205" cy="452" r="56" fill={`url(#${id('leaf')})`} />
          <circle cx="132" cy="372" r="54" fill={`url(#${id('leaf')})`} />
          <circle cx="190" cy="392" r="48" fill={`url(#${id('leaf')})`} />
          <circle cx="118" cy="368" r="22" fill="#9ab676" opacity="0.6" />
          <circle cx="176" cy="372" r="16" fill="#9ab676" opacity="0.5" />
        </g>
        {/* thuja on the right */}
        <path d="M1062 650 C 1030 600 1036 470 1070 382 C 1102 470 1110 600 1078 650 Z" fill={`url(#${id('leafDark')})`} />
        <path d="M1070 390 C 1060 470 1056 560 1064 640" stroke="#93ad74" strokeOpacity="0.4" strokeWidth="5" fill="none" />
        <ellipse cx="1070" cy="650" rx="34" ry="6" fill="#1d2a14" opacity="0.35" />
        {/* shrubs in front of the plinth */}
        <ellipse cx="420" cy="650" rx="95" ry="9" fill="#1d2a14" opacity="0.3" />
        <ellipse cx="740" cy="650" rx="85" ry="9" fill="#1d2a14" opacity="0.3" />
        {[
          [345, 626, 30],
          [385, 616, 36],
          [430, 630, 28],
          [470, 634, 22],
          [700, 632, 24],
          [740, 618, 34],
          [790, 626, 30],
        ].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${id(i % 2 ? 'leaf' : 'leafDark')})`} />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.35} fill="#a3bd7f" opacity="0.45" />
          </g>
        ))}
        {/* box balls by the steps */}
        <circle cx="495" cy="626" r="15" fill={`url(#${id('leaf')})`} />
        <circle cx="646" cy="626" r="15" fill={`url(#${id('leaf')})`} />
      </g>

      {selected && FACADE_PATHS[selected] && !props.still && <Outline d={FACADE_PATHS[selected]} />}
    </SceneSvg>
  );
}

type IdFn = (n: string) => string;

/** PVC window with a roller-shutter box, two sashes, reflection and reveal shadow. */
function FrontWindow({ box: [x, y, w, h], id, onClick }: { box: number[]; id: IdFn; onClick?: () => void }) {
  const inner = { x: x + 5, y: y + 17, w: w - 10, h: h - 22 };
  const sw = (inner.w - 5) / 2;
  return (
    <g onClick={onClick} pointerEvents={onClick ? undefined : 'none'} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <rect x={x} y={y} width={w} height={h} fill="#f4f3ef" />
      <rect x={x} y={y} width={w} height="14" fill="#e2e0da" />
      {[4, 8, 11].map((d) => (
        <rect key={d} x={x} y={y + d} width={w} height="0.8" fill="#000" opacity="0.1" />
      ))}
      {[0, 1].map((i) => (
        <rect key={i} x={inner.x + i * (sw + 5) + 3} y={inner.y + 3} width={sw - 6} height={inner.h - 6} fill={`url(#${id('glass')})`} />
      ))}
      {/* faint curtain inside one sash */}
      <rect x={inner.x + 3} y={inner.y + 3} width={sw * 0.45} height={inner.h - 6} fill="#f6f1e6" opacity="0.28" />
      <path d={`M${x + 12} ${y + h - 8} L${x + 40} ${inner.y + 3} L${x + 54} ${inner.y + 3} L${x + 26} ${y + h - 8} Z`} fill="#fff" opacity="0.18" />
      <path d={`M${x + w / 2 + 10} ${y + h - 8} L${x + w / 2 + 30} ${inner.y + 3} L${x + w / 2 + 36} ${inner.y + 3} L${x + w / 2 + 16} ${y + h - 8} Z`} fill="#fff" opacity="0.14" />
      {/* reveal shadow: lintel + left jamb (sun from the upper left) */}
      <rect x={x} y={y} width={w} height="7" fill="#000" opacity="0.16" />
      <rect x={x} y={y} width="6" height={h} fill="#000" opacity="0.12" />
      {/* shadow under the sill */}
      <rect x={x - 14} y={y + h + 9} width={w + 30} height="9" fill={`url(#${id('down')})`} />
    </g>
  );
}

/** Wooden entrance door, or a glazed balcony door. */
function Door({ box: [x, y, w, h], id, glass, onClick }: { box: number[]; id: IdFn; glass?: boolean; onClick?: () => void }) {
  return (
    <g onClick={onClick} pointerEvents={onClick ? undefined : 'none'} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <rect x={x} y={y} width={w} height={h} fill="#f4f3ef" />
      {glass ? (
        <>
          <rect x={x} y={y} width={w} height="14" fill="#e2e0da" />
          <rect x={x + 7} y={y + 20} width={w - 14} height={h - 27} fill={`url(#${id('glass')})`} />
          <rect x={x + w / 2 - 2} y={y + 17} width="4" height={h - 20} fill="#f4f3ef" />
          <path d={`M${x + 12} ${y + h - 10} L${x + 30} ${y + 24} L${x + 40} ${y + 24} L${x + 22} ${y + h - 10} Z`} fill="#fff" opacity="0.16" />
        </>
      ) : (
        <>
          <rect x={x + 5} y={y + 5} width={w - 10} height={h - 5} fill={`url(#${id('wood')})`} />
          {[0.3, 0.55].map((f) => (
            <rect key={f} x={x + 5 + (w - 10) * f} y={y + 12} width="1.2" height={h - 22} fill="#000" opacity="0.25" />
          ))}
          <rect x={x + w - 24} y={y + 14} width="10" height={h - 30} fill="#cbd8e0" opacity="0.65" />
          <rect x={x + 12} y={y + h * 0.35} width="3" height={h * 0.32} rx="1.5" fill="#d9dcdf" />
        </>
      )}
      <rect x={x} y={y} width={w} height="7" fill="#000" opacity="0.18" />
      <rect x={x} y={y} width="6" height={h} fill="#000" opacity="0.12" />
    </g>
  );
}
