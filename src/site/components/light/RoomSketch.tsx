import { cn } from '@/lib/utils';
import { LIGHT_RGB, type Cct } from './model';

/**
 * A tiny CSS-only room sketch lit in the chosen light colour (3000K warm / 4000K neutral / 6500K cool).
 * `ceiling` = ceiling light in a room, `wall` = wall light, `pole` = street light over a yard at night.
 */
export function RoomSketch({ cct, mount, outdoor, className }: { cct: Cct; mount: 'ceiling' | 'wall' | 'pole'; outdoor?: boolean; className?: string }) {
  const c = LIGHT_RGB[cct];
  const rgb = (a: number) => `rgb(${c} / ${a})`;

  if (mount === 'pole') {
    return (
      <div className={cn('relative overflow-hidden', className)} style={{ background: 'linear-gradient(#0c1626, #1a2a41 70%)' }} aria-hidden>
        {/* stars */}
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(1px 1px at 20% 18%, #fff, transparent), radial-gradient(1px 1px at 72% 12%, #fff, transparent), radial-gradient(1px 1px at 88% 30%, #fff, transparent), radial-gradient(1px 1px at 46% 8%, #fff, transparent)' }} />
        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 h-[28%]" style={{ background: 'linear-gradient(#222e3d, #151d28)' }} />
        {/* light pool on the ground */}
        <div className="absolute bottom-0 left-[8%] h-[34%] w-[64%] transition-[background] duration-500" style={{ background: `radial-gradient(ellipse 50% 60% at 50% 70%, ${rgb(0.75)}, ${rgb(0.18)} 60%, transparent 80%)` }} />
        {/* light cone */}
        <div className="absolute left-[16%] top-[24%] h-[62%] w-[48%] transition-[background] duration-500" style={{ clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)', background: `linear-gradient(${rgb(0.55)}, ${rgb(0.06)})` }} />
        {/* pole + head */}
        <div className="absolute bottom-[14%] left-[66%] top-[20%] w-[3px] rounded-full bg-[#5b6878]" />
        <div className="absolute left-[38%] top-[20%] h-[3px] w-[29%] rounded-full bg-[#5b6878]" />
        <div className="absolute left-[33%] top-[19%] h-[7px] w-[13%] rounded-full shadow-[0_0_14px_4px]" style={{ background: rgb(1), color: rgb(0.8) }} />
      </div>
    );
  }

  const base = outdoor ? '#16202d' : '#273140';
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: outdoor ? 'linear-gradient(#0c1626, #1a2a41)' : base }} aria-hidden>
      {/* back wall */}
      <div
        className="absolute left-[16%] right-[16%] top-0 h-[70%] transition-[background] duration-500"
        style={{ background: outdoor ? '#2b3646' : `linear-gradient(${rgb(0.5)}, ${rgb(0.22)}), ${base}` }}
      />
      {/* floor */}
      <div
        className="absolute inset-0 transition-[background] duration-500"
        style={{ clipPath: 'polygon(0 100%, 16% 70%, 84% 70%, 100% 100%)', background: `linear-gradient(${rgb(outdoor ? 0.18 : 0.32)}, ${rgb(0.06)}), #1b232f` }}
      />
      {/* side walls tint */}
      {!outdoor && <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${rgb(0.16)}, transparent 16%, transparent 84%, ${rgb(0.16)})` }} />}
      {mount === 'ceiling' ? (
        <>
          <div className="absolute inset-0 mix-blend-screen transition-[background] duration-500" style={{ background: `radial-gradient(ellipse 46% 85% at 50% 0%, ${rgb(0.9)}, ${rgb(0.28)} 50%, transparent 78%)` }} />
          <div className="absolute left-1/2 top-0 h-[6px] w-[26%] -translate-x-1/2 rounded-b-full" style={{ background: rgb(1), boxShadow: `0 0 18px 6px ${rgb(0.7)}` }} />
        </>
      ) : (
        <>
          <div className="absolute inset-0 mix-blend-screen transition-[background] duration-500" style={{ background: `radial-gradient(ellipse 34% 60% at 50% 30%, ${rgb(0.85)}, ${rgb(0.22)} 55%, transparent 80%)` }} />
          <div className="absolute left-1/2 top-[24%] h-[16%] w-[12%] -translate-x-1/2 rounded-full" style={{ background: rgb(1), boxShadow: `0 0 16px 6px ${rgb(0.7)}` }} />
        </>
      )}
    </div>
  );
}
