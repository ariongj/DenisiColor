import { Link } from 'react-router';
import { toast } from 'sonner';
import { Heart, Plus, ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/misc';
import { AdImage } from './AdImage';
import { Price } from './Price';
import { needsQuote, useWhatsApp } from './quote';
import { WhatsAppIcon } from '@/components/brand/Social';
import { useDict, useL } from '@/i18n';
import { site } from '@/i18n/site';
import { common } from '@/i18n/common';
import { useUi } from '@/store/ui';
import { useDb } from '@/store/db';
import { defaultOptions, discountPct } from '@/lib/pricing';
import { cn } from '@/lib/utils';

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const tc = useDict(common);
  const pct = discountPct(product);
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {pct > 0 && <Badge tone="brand">−{pct}%</Badge>}
      {product.badges.includes('new') && <Badge tone="dark">{tc('badge_new')}</Badge>}
      {product.badges.includes('bestseller') && <Badge tone="light">{tc('badge_bestseller')}</Badge>}
      {product.badges.includes('premium') && !product.badges.includes('new') && <Badge tone="light">{tc('badge_premium')}</Badge>}
    </div>
  );
}

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const t = useDict(site);
  const l = useL();
  const wa = useWhatsApp();
  const category = useDb((s) => s.categories.find((c) => c.id === product.categoryId));
  const wish = useUi((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useUi((s) => s.toggleWishlist);
  const addToCart = useUi((s) => s.addToCart);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const href = `/proizvod/${product.slug}`;
  const quote = needsQuote(product);
  const simple = !quote && product.options.length === 0 && product.unit !== 'm2' && product.unit !== 'm';
  const swatches = product.options.find((o) => o.type === 'swatch');

  const quickAdd = () => {
    addToCart({ productId: product.id, qty: 1, options: defaultOptions(product), installation: false });
    toast.success(t('added'), { description: l(product.name), action: { label: t('viewCart'), onClick: () => setCartOpen(true) } });
  };

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-line/70">
        <Link to={href} aria-label={l(product.name)} className="absolute inset-0">
          <AdImage src={product.images[0]} small eager={priority} alt={l(product.name)} className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
          {product.images[1] && <AdImage src={product.images[1]} small className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
        </Link>
        <ProductBadges product={product} className="pointer-events-none absolute left-3 top-3" />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={t('wishlist')}
          aria-pressed={wish}
          className={cn(
            'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-105',
            wish ? 'text-brand-600' : 'text-ink/70 hover:text-ink',
          )}
        >
          <Heart className={cn('h-4 w-4', wish && 'fill-current')} />
        </button>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          {simple ? (
            <button type="button" onClick={quickAdd} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/95 text-sm font-semibold text-ink shadow-lg backdrop-blur hover:bg-ink hover:text-white">
              <Plus className="h-4 w-4" /> {t('addToCart')}
            </button>
          ) : (
            <Link to={href} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/95 text-sm font-semibold text-ink shadow-lg backdrop-blur hover:bg-ink hover:text-white">
              {quote ? <MessageCircle className="h-4 w-4" /> : null}
              {quote ? t('requestQuote') : t('chooseOptions')} {!quote && <ArrowUpRight className="h-4 w-4" />}
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{category ? l(category.name) : ''}</span>
          {swatches && (
            <span className="flex -space-x-1">
              {swatches.values.slice(0, 4).map((v) => (
                <span key={v.id} title={l(v.label)} className="h-3.5 w-3.5 rounded-full border-2 border-paper ring-1 ring-ink/10" style={{ background: v.swatch }} />
              ))}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 text-[15.5px] font-semibold leading-snug text-ink">
          <Link to={href} className="link-u">
            {l(product.name)}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <Price product={product} size="sm" />
          {quote && wa.enabled && (
            <a
              href={wa.product(product)}
              target="_blank"
              rel="noreferrer"
              aria-label={t('askWhatsapp')}
              title={t('askWhatsapp')}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1f9d55]/10 text-[#178246] transition-colors hover:bg-[#1f9d55] hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
