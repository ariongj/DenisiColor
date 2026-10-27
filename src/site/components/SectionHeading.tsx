import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Accent, Img } from '@/components/ui/misc';
import { useDict } from '@/i18n';
import { site } from '@/i18n/site';
import { common } from '@/i18n/common';
import { cn } from '@/lib/utils';

/** Eyebrow + bold display title (supports *accent*) + optional subtitle and action. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = 'left',
  className,
  tone = 'dark',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className={cn('flex flex-col gap-6', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <div className={cn('eyebrow mb-3', tone === 'light' && 'text-amber-400!')}>{eyebrow}</div>}
        <h2 className={cn('display text-[34px] leading-[1.05] sm:text-5xl', tone === 'light' ? 'text-white' : 'text-ink')}>
          <Accent text={title} accentClassName={tone === 'light' ? 'text-amber-400!' : undefined} />
        </h2>
        {subtitle && <p className={cn('mt-4 text-[16px] leading-relaxed', tone === 'light' ? 'text-paper/70' : 'text-muted')}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Breadcrumbs({ items, tone = 'dark' }: { items: { label: string; to?: string }[]; tone?: 'dark' | 'light' }) {
  const t = useDict(site);
  const tc = useDict(common);
  const all = [{ label: t('home'), to: '/' }, ...items];
  return (
    <nav aria-label={tc('breadcrumb')} className={cn('flex flex-wrap items-center gap-1 text-[13px]', tone === 'light' ? 'text-white/70' : 'text-muted')}>
      {all.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
          {it.to && i < all.length - 1 ? (
            <Link to={it.to} className={cn('hover:underline', tone === 'light' ? 'hover:text-white' : 'hover:text-ink')}>
              {it.label}
            </Link>
          ) : (
            <span className={tone === 'light' ? 'text-white' : 'text-ink'}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Top-of-page hero for secondary pages. With `image` it renders a navy header with the stripe motif:
 * a backdrop graphic (/images/hero/…) fills it, any other picture (square product ads) sits in a
 * framed card on the right. Without an image, a calm paper header.
 */
export function PageHero({ eyebrow, title, subtitle, image, crumbs, children }: { eyebrow?: string; title: string; subtitle?: string; image?: string; crumbs?: { label: string; to?: string }[]; children?: ReactNode }) {
  if (image) {
    const backdrop = image.includes('/images/hero/');
    return (
      <section className="relative isolate overflow-hidden bg-brand-900">
        <Img src={backdrop ? image : '/images/hero/navy.webp'} eager alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="bg-stripes absolute inset-0 -z-10 opacity-70" />
        <div className="container-x grid items-center gap-10 pb-14 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[1fr_auto]">
          <div>
            {crumbs && <Breadcrumbs items={crumbs} tone="light" />}
            {eyebrow && <div className="eyebrow mb-3 mt-8 text-amber-400!">{eyebrow}</div>}
            <h1 className={cn('display max-w-3xl text-[40px] leading-[1.04] text-white sm:text-[56px]', !eyebrow && 'mt-8')}>
              <Accent text={title} accentClassName="text-amber-400!" />
            </h1>
            <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
            {subtitle && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-paper/75">{subtitle}</p>}
            {children}
          </div>
          {!backdrop && (
            <div className="relative hidden w-[300px] lg:block xl:w-[340px]">
              <div className="absolute -inset-3 -z-10 rotate-6 rounded-[26px] bg-amber-400/90" />
              <div className="-rotate-2 overflow-hidden rounded-[20px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.7)]">
                <Img src={image} eager alt="" className="aspect-square w-full rounded-[14px] object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
    <section className="bg-stripes-ink border-b border-line bg-paper">
      <div className="container-x pb-12 pt-10 sm:pb-16 sm:pt-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <div className="eyebrow mb-3 mt-8">{eyebrow}</div>}
        <h1 className={cn('display max-w-3xl text-[40px] leading-[1.04] text-ink sm:text-[56px]', !eyebrow && 'mt-8')}>
          <Accent text={title} />
        </h1>
        <div className="mt-5 h-1 w-16 rounded-full bg-amber-400" />
        {subtitle && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
