import { useMemo, type ReactNode } from 'react';
import { Bath, BedDouble, Car, CookingPot, DoorOpen, Footprints, Monitor, Sofa, Warehouse, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useActiveProducts } from '@/store/hooks';
import type { LtKey } from './dict';
import { P, type Room, type RoomType } from './model';

export const ROOM_ICON: Record<RoomType, LucideIcon> = {
  living: Sofa,
  kitchen: CookingPot,
  bedroom: BedDouble,
  bathroom: Bath,
  corridor: Footprints,
  office: Monitor,
  workshop: Warehouse,
  terrace: DoorOpen,
  yard: Car,
};

/** Room names with a running number when a type appears more than once ("Dhomë gjumi 2"). */
export function roomLabels(rooms: Room[], t: (k: LtKey) => string) {
  const total: Record<string, number> = {};
  rooms.forEach((r) => (total[r.type] = (total[r.type] ?? 0) + 1));
  const seen: Record<string, number> = {};
  const out: Record<string, string> = {};
  for (const r of rooms) {
    seen[r.type] = (seen[r.type] ?? 0) + 1;
    const name = t(`t_${r.type}` as LtKey);
    out[r.id] = total[r.type] > 1 ? `${name} ${seen[r.type]}` : name;
  }
  return out;
}

/** The shop's lighting products by id (missing when unpublished in the CMS). */
export function useLightProducts(): Record<string, Product | undefined> {
  const products = useActiveProducts();
  return useMemo(() => {
    const ids = Object.values(P) as string[];
    return Object.fromEntries(products.filter((p) => ids.includes(p.id)).map((p) => [p.id, p]));
  }, [products]);
}

/** How the fixture sits in the room sketch. */
export const mountOf = (productId: string): 'ceiling' | 'wall' | 'pole' =>
  productId === P.wall24 ? 'wall' : productId === P.street50 || productId === P.novaled50 ? 'pole' : 'ceiling';

/** Small segmented control (pills). */
export function Seg<T extends string | number>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { id: T; label: ReactNode; title?: string }[]; className?: string }) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-full bg-paper p-1 ring-1 ring-line', className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          title={o.title}
          onClick={() => onChange(o.id)}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors',
            o.id === value ? 'bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-line' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Numbered step heading (1 Dhomat → 2 Rekomandimi → 3 Lista). */
export function StepHead({ n, eyebrow, title, children }: { n: number; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-600 font-display text-lg font-extrabold text-white shadow-[0_10px_24px_-14px_var(--color-brand-700)]">{n}</span>
        <div>
          <div className="eyebrow mb-1.5">{eyebrow}</div>
          <h2 className="display text-[26px] leading-[1.1] text-ink sm:text-[32px]">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}
