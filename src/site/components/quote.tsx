// "Request a price" helpers. Denisi Color only publishes prices for a few products; the rest are
// `quoteOnly` with price 0 and must never show "0 €" — they show "Kërko çmimin" and offer an
// enquiry (MeasureForm type quote → CMS inquiry) plus a WhatsApp message to the shop.
import type { Product, Settings } from '@/lib/types';
import { basePrice } from '@/lib/pricing';
import { useSettings } from '@/store/hooks';
import { useDict, useL } from '@/i18n';
import { site } from '@/i18n/site';
import { WhatsAppIcon } from '@/components/brand/Social';
import { cn } from '@/lib/utils';

/** Product without a public price → "request a price" everywhere. */
export const needsQuote = (p: Product) => !!p.quoteOnly || basePrice(p) <= 0;

/**
 * Short reference for an enquiry from the quote list ("KO-4F7Q2A"), shown to the shopper on the success
 * screen and next to the request in the CMS. Derived from the inquiry id, so both sides always agree.
 */
export const quoteRef = (inquiryId: string) => `KO-${inquiryId.replace(/^[a-z]+_/i, '').slice(0, 6).toUpperCase()}`;

/** Digits of the shop's WhatsApp number (falls back to the main phone). */
export const waDigits = (s: Pick<Settings, 'whatsapp' | 'phone'>) => (s.whatsapp || s.phone || '').replace(/\D/g, '');

/** https://wa.me/<number>?text=… */
export function waHref(s: Pick<Settings, 'whatsapp' | 'phone'>, text?: string) {
  const n = waDigits(s);
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** WhatsApp link builder bound to the shop settings + a prefilled message for a product. */
export function useWhatsApp() {
  const settings = useSettings();
  const t = useDict(site);
  const l = useL();
  return {
    enabled: !!waDigits(settings),
    general: waHref(settings, t('waGeneral')),
    product: (p: Product) => waHref(settings, t('waProduct', { name: l(p.name) })),
  };
}

/** Green "Ask on WhatsApp" link (product page, cards, contact). */
export function WhatsAppLink({ product, className, size = 'md', label }: { product?: Product; className?: string; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const wa = useWhatsApp();
  const t = useDict(site);
  if (!wa.enabled) return null;
  const sizes = { sm: 'h-9 px-4 text-[13px] gap-1.5', md: 'h-11 px-5 text-sm gap-2', lg: 'h-13 px-7 text-[15px] gap-2.5' };
  return (
    <a
      href={product ? wa.product(product) : wa.general}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#1f9d55] font-semibold text-white shadow-[0_10px_24px_-14px_#1f9d55] transition-colors hover:bg-[#178246] active:scale-[0.98]',
        sizes[size],
        className,
      )}
    >
      <WhatsAppIcon className={size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
      {label ?? t('askWhatsapp')}
    </a>
  );
}
