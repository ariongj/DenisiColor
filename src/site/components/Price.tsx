import type { Product } from '@/lib/types';
import { basePrice, isOnSale } from '@/lib/pricing';
import { money, perUnit } from '@/lib/format';
import { useDict, useLang } from '@/i18n';
import { common } from '@/i18n/common';
import { site } from '@/i18n/site';
import { cn } from '@/lib/utils';
import { needsQuote } from './quote';

/** True when options can push the price above the base price → show "from". */
export function hasPriceRange(p: Product) {
  return !needsQuote(p) && p.options.some((o) => o.values.some((v) => (v.priceDelta ?? 0) > 0));
}

export function Price({ product, size = 'md', className, showUnit = true }: { product: Product; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; showUnit?: boolean }) {
  const lang = useLang();
  const tc = useDict(common);
  const t = useDict(site);
  const sizes = {
    sm: 'text-[15px]',
    md: 'text-[17px]',
    lg: 'text-2xl',
    xl: 'text-[34px] leading-none',
  };
  // No public price: "Kërko çmimin" instead of "0 €"
  if (needsQuote(product)) {
    const q = { sm: 'text-[14px]', md: 'text-[15.5px]', lg: 'text-xl', xl: 'text-[28px] leading-none' };
    return (
      <div className={cn('flex items-baseline', className)}>
        <span className={cn('font-display font-extrabold tracking-tight text-brand-700', q[size])}>{t('requestPrice')}</span>
      </div>
    );
  }
  const sale = isOnSale(product);
  const price = basePrice(product);
  const from = hasPriceRange(product);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      {from && <span className="text-[13px] font-medium text-muted">{tc('from')}</span>}
      <span className={cn('font-bold tracking-tight tabular-nums', sale ? 'text-brand-700' : 'text-ink', sizes[size])}>{money(price, lang, { decimals: price % 1 !== 0 })}</span>
      {showUnit && product.unit !== 'kom' && product.unit !== 'set' && <span className="text-[13px] font-medium text-muted">{perUnit(product.unit, lang)}</span>}
      {sale && <span className="text-[13px] font-medium text-muted line-through tabular-nums">{money(product.price, lang, { decimals: product.price % 1 !== 0 })}</span>}
    </div>
  );
}
