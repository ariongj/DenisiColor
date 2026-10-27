// Before/after split: the "before" copy is clipped to the left of the handle. A full-size transparent
// range input drives it, so mouse, touch and keyboard (arrow keys) all work without extra code.
import { useState, type ReactNode } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export function CompareSlider({ before, after, labelBefore, labelAfter, hint }: { before: ReactNode; after: ReactNode; labelBefore: string; labelAfter: string; hint: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative select-none">
      {after}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      {/* handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_0_1px_rgb(19_36_59/0.25),0_0_18px_rgb(0_0_0/0.25)]" />
        <div className="absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-[0_8px_24px_-6px_rgb(19_36_59/0.5)] ring-1 ring-black/5">
          <ChevronsLeftRight className="h-5 w-5" />
        </div>
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">{labelBefore}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur-sm">{labelAfter}</span>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={hint}
        className="peer absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
