import { Img } from '@/components/ui/misc';
import { cn } from '@/lib/utils';

/**
 * Product photos are social-media ad graphics (square or 3:4) with text baked in. To show them whole in a
 * box of any ratio, the picture is `object-contain`ed over a blurred, enlarged copy of itself — no crop
 * of the baked-in text, no empty bars.
 */
export function AdImage({ src, alt = '', small, eager, className, imgClassName }: { src?: string; alt?: string; small?: boolean; eager?: boolean; className?: string; imgClassName?: string }) {
  if (!src) return <div className={cn('bg-sand', className)} />;
  // Generated graphics (/images/misc, /images/hero) have no baked-in text → a plain cover crop is fine
  const cover = /\/images\/(misc|hero)\//.test(src);
  return (
    // cn() has no tailwind-merge: only add `relative` when the caller doesn't position the box itself
    <div className={cn('overflow-hidden bg-sand', !/\b(absolute|fixed|sticky)\b/.test(className ?? '') && 'relative', className)}>
      {!cover && <Img src={src} small alt="" aria-hidden eager={eager} className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70! blur-2xl" />}
      <Img src={src} small={small} eager={eager} alt={alt} className={cn('absolute inset-0 h-full w-full', cover ? 'object-cover' : 'object-contain', imgClassName)} />
    </div>
  );
}
