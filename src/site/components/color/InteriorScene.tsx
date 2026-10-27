// Hand-drawn interior scene: a living room in one-point perspective — window on the left wall,
// sofa against the back (accent) wall, oak floor, pendant light. Paintable: main walls, accent wall, ceiling.
import { luminance } from './palette';
import { Outline, polyD, rectD, SceneSvg, Surface, GrainPattern, useSvgIds, type Pt, type SceneProps } from './svg';

/* ---- geometry (viewBox 1200×760) ---- */
const BX0 = 270;
const BX1 = 930;
const BY0 = 110;
const BY1 = 520;
const VP: Pt = [600, 286];
const K1 = (VP[1] - BY0) / (VP[0] - BX0); // slope of the ceiling edges
const K2 = (BY1 - VP[1]) / (VP[0] - BX0); // slope of the floor edges

/** Point on the left wall at image-x `x`, `f` = 0 (ceiling) … 1 (floor). */
const lw = (x: number, f: number): Pt => {
  const top = BY0 - (BX0 - x) * K1;
  const bot = BY1 + (BX0 - x) * K2;
  return [x, top + f * (bot - top)];
};
/** Same on the right wall. */
const rw = (x: number, f: number): Pt => {
  const top = BY0 - (x - BX1) * K1;
  const bot = BY1 + (x - BX1) * K2;
  return [x, top + f * (bot - top)];
};
const lquad = (x0: number, x1: number, f0: number, f1: number) => polyD([lw(x0, f0), lw(x1, f0), lw(x1, f1), lw(x0, f1)]);
const rquad = (x0: number, x1: number, f0: number, f1: number) => polyD([rw(x0, f0), rw(x1, f0), rw(x1, f1), rw(x0, f1)]);

const LEFT = lquad(0, BX0, 0, 1);
const RIGHT = rquad(BX1, 1200, 0, 1);
const CEIL = polyD([lw(0, 0), rw(1200, 0), [BX1, BY0], [BX0, BY0]]);
const BACK = rectD(BX0, BY0, BX1 - BX0, BY1 - BY0);
const FLOOR = polyD([[BX0, BY1], [BX1, BY1], rw(1200, 1), [1200, 760], [0, 760], lw(0, 1)]);

export const INTERIOR_PATHS: Record<string, string[]> = {
  walls: [LEFT, RIGHT],
  accent: [BACK],
  ceiling: [CEIL],
};
const ORDER = ['ceiling', 'walls', 'accent'] as const;

// Window on the left wall
const WX0 = 62;
const WX1 = 200;
const WF0 = 0.22;
const WF1 = 0.7;

/** Deterministic pseudo-random (plank joints). */
const rand = (seed: number) => {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
};

const PLANKS = (() => {
  const lines: string[] = [];
  for (let xf = -900; xf <= 2100; xf += 92) {
    const xb = VP[0] + ((xf - VP[0]) * (BY1 - VP[1])) / (760 - VP[1]);
    lines.push(`M${xb.toFixed(1)} ${BY1}L${xf} 760`);
  }
  // short cross joints between neighbouring plank lines
  const r = rand(7);
  const joints: string[] = [];
  for (let xf = -900; xf < 2100; xf += 92) {
    for (let j = 0; j < 2; j++) {
      const y = BY1 + 8 + r() * (760 - BY1 - 16);
      const t = (y - VP[1]) / (760 - VP[1]);
      const xa = VP[0] + (xf - VP[0]) * t;
      const xc = VP[0] + (xf + 92 - VP[0]) * t;
      joints.push(`M${xa.toFixed(1)} ${y.toFixed(1)}H${xc.toFixed(1)}`);
    }
  }
  return { lines: lines.join(''), joints: joints.join('') };
})();

export function InteriorScene(props: SceneProps) {
  const id = useSvgIds();
  const { paints, selected } = props;
  const hex = (k: string) => paints[k]?.hex ?? '#e5e5e5';
  const glowBack = 0.12 + 0.2 * (1 - luminance(hex('accent')));
  const glowWall = 0.16 + 0.2 * (1 - luminance(hex('walls')));
  const glowCeil = 0.25 + 0.25 * (1 - luminance(hex('ceiling')));
  const url = (n: string) => `url(#${id(n)})`;

  const winTop = (x: number) => lw(x, WF0);
  const winBot = (x: number) => lw(x, WF1);
  const GX1 = WX1 - 15; // glass ends where the far reveal begins
  const glass = polyD([[WX0, winTop(WX0)[1] + 8], [GX1, winTop(GX1)[1] + 8], [GX1, winBot(GX1)[1]], [WX0, winBot(WX0)[1]]]);
  const midX = (WX0 + GX1) / 2;

  return (
    <SceneSvg viewBox="0 0 1200 760" title={props.title} className={props.className} still={props.still}>
      <defs>
        <GrainPattern id={id('grain')} />
        <linearGradient id={id('floor')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b88d63" />
          <stop offset="1" stopColor="#c99f73" />
        </linearGradient>
        <linearGradient id={id('outside')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd5e6" />
          <stop offset="0.62" stopColor="#e6eef0" />
          <stop offset="0.63" stopColor="#a8bf98" />
          <stop offset="1" stopColor="#7f9a6c" />
        </linearGradient>
        <linearGradient id={id('backLight')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffaf0" stopOpacity={glowBack} />
          <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={id('aoDown')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c26" stopOpacity="0.22" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('aoUp')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#141c26" stopOpacity="0.18" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('aoRight')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#141c26" stopOpacity="0.2" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('aoLeft')} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#141c26" stopOpacity="0.22" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('leftShade')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f97a6" />
          <stop offset="1" stopColor="#b4bac4" />
        </linearGradient>
        <linearGradient id={id('rightLight')} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#141c26" stopOpacity="0.08" />
          <stop offset="0.6" stopColor="#fffaf0" stopOpacity={glowWall * 0.6} />
          <stop offset="1" stopColor="#fffaf0" stopOpacity={glowWall * 0.3} />
        </linearGradient>
        <linearGradient id={id('ceilShade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa0ab" />
          <stop offset="1" stopColor="#d4d7dc" />
        </linearGradient>
        <radialGradient id={id('warm')}>
          <stop offset="0" stopColor="#fff2d2" stopOpacity="1" />
          <stop offset="1" stopColor="#fff2d2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('daylight')}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('sofa')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b6778" />
          <stop offset="1" stopColor="#465161" />
        </linearGradient>
        <linearGradient id={id('sofaFront')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5566" />
          <stop offset="1" stopColor="#38424f" />
        </linearGradient>
        <linearGradient id={id('curtain')} x1="0" y1="0" x2="1" y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#e9e4da" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={id('leaf')} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#6f9a5a" />
          <stop offset="1" stopColor="#36593a" />
        </linearGradient>
        <clipPath id={id('cBack')}>
          <path d={BACK} />
        </clipPath>
        <clipPath id={id('cLeft')}>
          <path d={LEFT} />
        </clipPath>
        <clipPath id={id('cRight')}>
          <path d={RIGHT} />
        </clipPath>
        <clipPath id={id('cCeil')}>
          <path d={CEIL} />
        </clipPath>
        <clipPath id={id('cFloor')}>
          <path d={FLOOR} />
        </clipPath>
        <clipPath id={id('cGlass')}>
          <path d={glass} />
        </clipPath>
        <filter id={id('blur')} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={id('blurS')} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ---------- floor ---------- */}
      <path d={FLOOR} fill={url('floor')} />
      <g clipPath={url('cFloor')} pointerEvents="none">
        <path d={PLANKS.lines} stroke="#6b4426" strokeOpacity="0.28" strokeWidth="1.2" />
        <path d={PLANKS.joints} stroke="#6b4426" strokeOpacity="0.22" strokeWidth="1" />
        {/* daylight patch from the window */}
        <path d="M150 640 L330 560 L520 600 L380 720 Z" fill="#fff8e8" opacity="0.32" filter={url('blur')} />
        {/* soft reflection of the back wall */}
        <rect x={BX0} y={BY1} width={BX1 - BX0} height="30" fill="#fff" opacity="0.08" />
      </g>

      {/* ---------- paintable surfaces ---------- */}
      {ORDER.map((k) => (
        <Surface key={k} id={k} d={INTERIOR_PATHS[k]} hex={hex(k)} props={props} />
      ))}

      {/* ---------- light on the planes ---------- */}
      <g clipPath={url('cCeil')} pointerEvents="none">
        <path d={CEIL} fill={url('ceilShade')} style={{ mixBlendMode: 'multiply' }} opacity="0.5" />
        <ellipse cx="600" cy="40" rx="330" ry="90" fill={url('warm')} opacity={glowCeil} />
        <rect x="0" y={BY0 - 16} width="1200" height="16" fill={url('aoUp')} />
      </g>
      <g clipPath={url('cBack')} pointerEvents="none">
        <path d={BACK} fill={url('grain')} style={{ mixBlendMode: 'soft-light' }} opacity="0.22" />
        <path d={BACK} fill={url('backLight')} />
        <rect x={BX0} y={BY0} width={BX1 - BX0} height="46" fill={url('aoDown')} />
        <rect x={BX0} y={BY0} width="34" height={BY1 - BY0} fill={url('aoRight')} />
        <rect x={BX1 - 34} y={BY0} width="34" height={BY1 - BY0} fill={url('aoLeft')} />
        <ellipse cx="600" cy="160" rx="300" ry="120" fill={url('warm')} opacity={glowBack * 1.1} />
        <ellipse cx="880" cy="330" rx="120" ry="110" fill={url('warm')} opacity={glowBack * 1.6} />
        {/* soft shadow of the sofa and frame on the wall */}
        <rect x="380" y="400" width="450" height="130" rx="40" fill="#141c26" opacity="0.18" filter={url('blur')} />
        <rect x="522" y="240" width="170" height="112" fill="#141c26" opacity="0.14" filter={url('blurS')} />
      </g>
      <g clipPath={url('cLeft')} pointerEvents="none">
        <path d={LEFT} fill={url('leftShade')} style={{ mixBlendMode: 'multiply' }} opacity="0.55" />
        <path d={LEFT} fill={url('grain')} style={{ mixBlendMode: 'soft-light' }} opacity="0.22" />
        <ellipse cx={midX + 10} cy={(winTop(midX)[1] + winBot(midX)[1]) / 2} rx="150" ry="240" fill={url('daylight')} opacity={glowWall * 1.4} />
        <rect x={BX0 - 30} y="0" width="30" height="760" fill={url('aoLeft')} />
      </g>
      <g clipPath={url('cRight')} pointerEvents="none">
        <path d={RIGHT} fill={url('rightLight')} />
        <path d={RIGHT} fill={url('grain')} style={{ mixBlendMode: 'soft-light' }} opacity="0.22" />
        <rect x={BX1} y="0" width="30" height="760" fill={url('aoRight')} />
      </g>

      {/* ---------- mouldings ---------- */}
      <g pointerEvents="none">
        <rect x={BX0} y={BY0} width={BX1 - BX0} height="8" fill="#f7f5f0" />
        <rect x={BX0} y={BY0 + 8} width={BX1 - BX0} height="2" fill="#000" opacity="0.08" />
        <path d={lquad(0, BX0, 0, 0.02)} fill="#f2f0eb" />
        <path d={rquad(BX1, 1200, 0, 0.02)} fill="#f2f0eb" />
        <rect x={BX0} y={BY1 - 14} width={BX1 - BX0} height="14" fill="#f4f2ed" />
        <rect x={BX0} y={BY1 - 14} width={BX1 - BX0} height="1.5" fill="#fff" />
        <path d={lquad(0, BX0, 0.966, 1)} fill="#e9e6e0" />
        <path d={rquad(BX1, 1200, 0.966, 1)} fill="#f4f2ed" />
      </g>

      {/* ---------- window on the left wall ---------- */}
      <g pointerEvents="none">
        {/* reveal (painted wall, catching the daylight) */}
        <path d={polyD([winTop(WX0), winTop(WX1), winBot(WX1), winBot(WX0)])} fill="#fff" opacity="0.32" />
        <path d={glass} fill={url('outside')} />
        <g clipPath={url('cGlass')}>
          <path d={`M${WX0} 400 C 100 380 140 395 ${GX1} 372 V 500 H ${WX0} Z`} fill="#6f8e60" opacity="0.6" />
          <circle cx="92" cy="350" r="26" fill="#5f8050" opacity="0.7" />
          <circle cx="160" cy="356" r="20" fill="#6d8f5c" opacity="0.6" />
          <rect x={WX0} y="0" width="140" height="760" fill="#fff" opacity="0.12" />
        </g>
        {/* frame */}
        <path d={glass} fill="none" stroke="#f6f5f1" strokeWidth="7" />
        <path d={`M${midX} ${winTop(midX)[1] + 8}L${midX} ${winBot(midX)[1]}`} stroke="#f6f5f1" strokeWidth="6" />
        <path d={glass} fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="1" />
        {/* sill */}
        <path d={polyD([[WX0 - 10, winBot(WX0)[1] + 2], [WX1 + 6, winBot(WX1)[1] - 1], [WX1 + 12, winBot(WX1)[1] + 6], [WX0 - 16, winBot(WX0)[1] + 14]])} fill="#f7f6f2" />
        <path d={polyD([[WX0 - 16, winBot(WX0)[1] + 14], [WX1 + 12, winBot(WX1)[1] + 6], [WX1 + 12, winBot(WX1)[1] + 10], [WX0 - 16, winBot(WX0)[1] + 19]])} fill="#d8d5ce" />
        {/* curtain rod + sheer curtain on the near side */}
        <path d={`M${lw(18, 0.17).join(' ')}L${lw(222, 0.17).join(' ')}`} stroke="#2d333b" strokeWidth="3" strokeLinecap="round" />
        <path d={polyD([lw(20, 0.175), lw(84, 0.175), [92, lw(92, 0.94)[1]], [10, lw(10, 0.94)[1]]])} fill={url('curtain')} />
        <path d={polyD([lw(196, 0.175), lw(226, 0.175), [232, lw(232, 0.94)[1]], [192, lw(192, 0.94)[1]]])} fill={url('curtain')} opacity="0.9" />
      </g>

      {/* ---------- right wall: framed print + switch ---------- */}
      <g pointerEvents="none">
        <path d={rquad(1004, 1090, 0.3, 0.55)} fill="#141c26" opacity="0.15" filter={url('blurS')} transform="translate(-4 4)" />
        <path d={rquad(1000, 1086, 0.29, 0.54)} fill="#3a2d22" />
        <path d={rquad(1006, 1080, 0.31, 0.52)} fill="#f6f3ec" />
        <path d={rquad(1016, 1070, 0.335, 0.495)} fill="#a8b89b" />
        <path d={polyD([rw(1016, 0.43), rw(1070, 0.39), rw(1070, 0.495), rw(1016, 0.495)])} fill="#5f7a5b" />
        <circle cx="1048" cy={rw(1048, 0.37)[1]} r="8" fill="#f5b100" />
        <path d={rquad(1150, 1166, 0.47, 0.5)} fill="#f4f2ec" stroke="#000" strokeOpacity="0.1" />
      </g>

      {/* ---------- back wall: art, pendant ---------- */}
      <g pointerEvents="none">
        <rect x="515" y="232" width="170" height="112" fill="#23272e" />
        <rect x="522" y="239" width="156" height="98" fill="#f6f3ec" />
        <rect x="536" y="252" width="128" height="72" fill="#264a78" />
        <g>
          <path d="M600 252 L626 252 L590 324 L564 324 Z" fill="#fff" opacity="0.14" />
          <path d="M634 252 L650 252 L614 324 L598 324 Z" fill="#fff" opacity="0.22" />
          <path d="M656 252 L664 252 L664 262 L634 324 L620 324 Z" fill="#f5b100" />
        </g>
        <circle cx="574" cy="296" r="14" fill="#f5b100" opacity="0.9" />
      </g>

      {/* ---------- rug, table, sofa, lamp, plant ---------- */}
      <g pointerEvents="none">
        <path d="M352 582 H848 L948 708 H252 Z" fill="#e6dfd1" />
        <path d="M368 590 H832 L918 700 H282 Z" fill="none" stroke="#c4b69f" strokeWidth="3" />
        <path d="M352 582 H848 L948 708 H252 Z" fill="#000" opacity="0.04" />

        {/* sofa */}
        <ellipse cx="600" cy="574" rx="262" ry="16" fill="#141c26" opacity="0.4" filter={url('blurS')} />
        <rect x="392" y="388" width="416" height="96" rx="20" fill={url('sofa')} />
        <rect x="392" y="388" width="416" height="6" rx="3" fill="#fff" opacity="0.08" />
        <rect x="404" y="464" width="194" height="40" rx="10" fill="#5f6b7d" />
        <rect x="602" y="464" width="194" height="40" rx="10" fill="#5f6b7d" />
        <rect x="386" y="498" width="428" height="62" rx="12" fill={url('sofaFront')} />
        <rect x="400" y="500" width="400" height="3" fill="#fff" opacity="0.07" />
        <rect x="360" y="428" width="56" height="134" rx="22" fill="#525e6f" />
        <rect x="784" y="428" width="56" height="134" rx="22" fill="#4c5768" />
        <rect x="364" y="430" width="48" height="8" rx="4" fill="#fff" opacity="0.08" />
        <rect x="788" y="430" width="48" height="8" rx="4" fill="#fff" opacity="0.08" />
        <rect x="378" y="560" width="10" height="14" rx="2" fill="#2a1f17" />
        <rect x="812" y="560" width="10" height="14" rx="2" fill="#2a1f17" />
        <rect x="430" y="408" width="72" height="66" rx="14" fill="#d9a441" transform="rotate(-8 466 441)" />
        <rect x="430" y="408" width="72" height="12" rx="6" fill="#fff" opacity="0.12" transform="rotate(-8 466 441)" />
        <rect x="700" y="410" width="70" height="64" rx="14" fill="#eee8dc" transform="rotate(7 735 442)" />
        <rect x="625" y="424" width="56" height="50" rx="12" fill="#c7bba8" transform="rotate(4 653 449)" />

        {/* coffee table */}
        <ellipse cx="600" cy="694" rx="96" ry="9" fill="#141c26" opacity="0.25" filter={url('blurS')} />
        <rect x="556" y="636" width="6" height="56" fill="#3a2a1f" />
        <rect x="638" y="636" width="6" height="56" fill="#3a2a1f" />
        <ellipse cx="600" cy="634" rx="104" ry="20" fill="#6e4d34" />
        <ellipse cx="600" cy="630" rx="104" ry="19" fill="#94704f" />
        <ellipse cx="590" cy="626" rx="70" ry="9" fill="#fff" opacity="0.08" />
        <rect x="548" y="614" width="46" height="8" rx="1.5" fill="#264a78" />
        <rect x="552" y="607" width="40" height="7" rx="1.5" fill="#e9e3d6" />
        <path d="M636 624 C 630 610 632 596 640 590 C 648 596 650 610 644 624 Z" fill="#efebe3" />
        <path d="M640 592 C 638 570 628 560 618 552 M640 590 C 644 572 654 562 664 556" stroke="#5c4634" strokeWidth="1.6" fill="none" />

        {/* floor lamp */}
        <ellipse cx="884" cy="602" rx="26" ry="6" fill="#141c26" opacity="0.3" />
        <ellipse cx="884" cy="598" rx="22" ry="5" fill="#23272e" />
        <rect x="882" y="336" width="4" height="262" fill="#23272e" />
        <ellipse cx="884" cy="380" rx="70" ry="60" fill={url('warm')} opacity="0.55" />
        <path d="M856 296 H912 L924 344 H844 Z" fill="#f1e9d9" />
        <path d="M844 344 H924 L922 348 H846 Z" fill="#d9ccb5" />
        <path d="M856 296 H866 L856 344 H844 Z" fill="#fff" opacity="0.35" />

        {/* plant */}
        <g>
          {[
            [318, 470, -40],
            [306, 440, -20],
            [330, 430, 10],
            [342, 460, 35],
            [296, 480, -60],
            [322, 410, -5],
            [350, 488, 55],
          ].map(([cx, cy, r], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="12" ry="40" fill={url('leaf')} transform={`rotate(${r} ${cx} ${cy + 30})`} />
          ))}
          <path d="M296 516 H344 L338 590 H302 Z" fill="#ece8df" />
          <path d="M296 516 H344 L343 524 H297 Z" fill="#d6d1c6" />
          <path d="M330 516 H344 L338 590 H326 Z" fill="#000" opacity="0.07" />
          <ellipse cx="320" cy="592" rx="26" ry="5" fill="#141c26" opacity="0.25" />
        </g>
      </g>

      {/* ---------- pendant light ---------- */}
      <g pointerEvents="none">
        <path d="M600 16 V120" stroke="#23272e" strokeWidth="1.6" />
        <ellipse cx="600" cy="16" rx="12" ry="3" fill="#23272e" />
        <ellipse cx="600" cy="176" rx="150" ry="60" fill={url('warm')} opacity="0.5" />
        <path d="M548 160 C 548 132 570 118 600 118 C 630 118 652 132 652 160 Z" fill="#1f2a3a" />
        <path d="M560 140 C 566 128 580 122 596 121" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="600" cy="160" rx="52" ry="6" fill="#ffe9b8" />
      </g>

      {selected && INTERIOR_PATHS[selected] && !props.still && <Outline d={INTERIOR_PATHS[selected]} />}
    </SceneSvg>
  );
}
