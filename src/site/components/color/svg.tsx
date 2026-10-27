// Shared building blocks for the colour-studio SVG scenes: paintable surface groups, the selection
// outline, a plaster-grain texture and small path helpers.
import { useId, type KeyboardEvent, type ReactNode } from 'react';
import type { Paints } from './palette';

export type Pt = [number, number];

export interface SceneProps {
  paints: Paints;
  selected?: string | null;
  onSelect?: (id: string) => void;
  /** Surface id → accessible label */
  labels?: Record<string, string>;
  /** Tighter framing for phones */
  compact?: boolean;
  /** Non-interactive copy (compare slider "before" layer) */
  still?: boolean;
  title?: string;
  className?: string;
}

/** Unique, url()-safe id prefix — two copies of a scene can live on one page (compare mode). */
export function useSvgIds() {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (name: string) => `dc${raw}-${name}`;
}

export const rectD = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
export const polyD = (pts: Pt[]) => `M${pts.map((p) => `${round(p[0])} ${round(p[1])}`).join('L')}Z`;
/** A frame: outer rect minus inner rect (use with fill-rule evenodd). */
export const frameD = (o: [number, number, number, number], i: [number, number, number, number]) => rectD(...o) + rectD(...i);
const round = (n: number) => Math.round(n * 10) / 10;

/** Plaster grain: grey fractal noise rasterised once as an image tile (cheap to repaint under colour transitions). */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="220" height="220" patternUnits="userSpaceOnUse">
      <image href={NOISE} width="220" height="220" />
    </pattern>
  );
}

/** Scoped CSS for the surfaces — transitions, hover, keyboard focus, marching-ants outline. */
export function SceneStyle() {
  return (
    <style>{`
      .dc-surf{cursor:pointer;outline:none}
      .dc-surf path{transition:fill .6s cubic-bezier(.4,0,.2,1),filter .2s}
      .dc-still .dc-surf{cursor:default}
      .dc-surf:hover path{filter:brightness(1.035)}
      .dc-surf:focus-visible path{stroke:#f5b100;stroke-width:3px;vector-effect:non-scaling-stroke}
      .dc-ants{animation:dc-ants 1.1s linear infinite}
      @keyframes dc-ants{to{stroke-dashoffset:-20}}
      @media (prefers-reduced-motion: reduce){.dc-surf path{transition:none}.dc-ants{animation:none}}
    `}</style>
  );
}

/** A paintable surface: one or more paths sharing a colour; clickable + keyboard-selectable. */
export function Surface({ id, d, hex, props }: { id: string; d: string[]; hex: string; props: SceneProps }) {
  const interactive = !props.still && !!props.onSelect;
  const select = () => props.onSelect?.(id);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select();
    }
  };
  return (
    <g
      className="dc-surf"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? props.labels?.[id] : undefined}
      aria-pressed={interactive ? props.selected === id : undefined}
      onClick={interactive ? select : undefined}
      onKeyDown={interactive ? onKey : undefined}
    >
      {d.map((p, i) => (
        <path key={i} d={p} fillRule="evenodd" style={{ fill: hex }} />
      ))}
    </g>
  );
}

/** Dashed outline drawn above everything for the selected surface. */
export function Outline({ d }: { d: string[] }) {
  return (
    <g pointerEvents="none" fill="none" fillRule="evenodd">
      {d.map((p, i) => (
        <path key={`b${i}`} d={p} stroke="#13243b" strokeOpacity={0.55} strokeWidth={4} vectorEffect="non-scaling-stroke" />
      ))}
      {d.map((p, i) => (
        <path key={`w${i}`} d={p} className="dc-ants" stroke="#fff" strokeWidth={2} strokeDasharray="7 3" vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}

/** Wrapper <svg> shared by both scenes. */
export function SceneSvg({ viewBox, title, className, still, children }: { viewBox: string; title?: string; className?: string; still?: boolean; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className ? `${className}${still ? ' dc-still' : ''}` : still ? 'dc-still' : undefined} role={still ? 'img' : 'group'} aria-label={title} preserveAspectRatio="xMidYMid slice">
      <SceneStyle />
      {children}
    </svg>
  );
}
