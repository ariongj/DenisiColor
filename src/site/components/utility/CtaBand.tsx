import type { ReactNode } from 'react';
import { Accent } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { cn } from '@/lib/utils';

/** Navy call-to-action band (stripe motif, optional picture) used at the bottom of utility pages. */
export function CtaBand({
  eyebrow,
  title,
  text,
  image,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative grid overflow-hidden rounded-[28px] bg-brand-900 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]', className)}>
      {image && (
        <div className="relative min-h-[220px] overflow-hidden md:min-h-[300px]">
          <AdImage src={image} small className="absolute inset-0" />
        </div>
      )}
      <div className={cn('bg-stripes relative flex flex-col justify-center p-7 sm:p-10 lg:p-14', !image && 'md:col-span-2')}>
        {eyebrow && <div className="eyebrow text-amber-400!">{eyebrow}</div>}
        <h2 className="display mt-3 max-w-xl text-[30px] leading-[1.06] text-white sm:text-[40px]">
          <Accent text={title} accentClassName="text-amber-400!" />
        </h2>
        {text && <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-paper/70">{text}</p>}
        {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>}
      </div>
    </div>
  );
}
