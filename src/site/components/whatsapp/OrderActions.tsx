// "Order by message" entry points: cart (drawer + page), checkout alternative, order-success follow-up.
// Denisi Color already sells by WhatsApp — these turn the cart / order into a ready-made message.
import type { ReactNode } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { useDict } from '@/i18n';
import { useSettings } from '@/store/hooks';
import type { Totals } from '@/lib/pricing';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/brand/Social';
import { waDigits, waHref } from '@/site/components/quote';
import { WA } from './dict';
import { useCartMessage, useOrderMessage, type WaCustomer } from './message';

const GREEN = 'bg-[#1f9d55] text-white shadow-[0_10px_24px_-14px_#1f9d55] hover:bg-[#178246]';

/** Anchor styled like the shop's WhatsApp buttons (opens wa.me in a new tab). */
export function WaAnchor({ href, children, variant = 'green', size = 'md', className }: { href: string; children: ReactNode; variant?: 'green' | 'outline'; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-9 px-4 text-[13px] gap-1.5', md: 'h-11 px-5 text-sm gap-2', lg: 'h-13 px-7 text-[15px] gap-2.5' };
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-semibold transition-[background,color,border,transform] duration-200 active:scale-[0.98]',
        variant === 'green' ? GREEN : 'border border-[#1f9d55]/35 bg-white text-[#14773f] hover:border-[#1f9d55] hover:bg-[#1f9d55]/[0.06]',
        sizes[size],
        className,
      )}
    >
      <WhatsAppIcon className={cn('shrink-0', size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]')} />
      {children}
    </a>
  );
}

/** Secondary "Porosit me WhatsApp" under "Vazhdo te pagesa" (cart drawer + cart page). */
export function CartWhatsApp({ totals, className }: { totals: Totals; className?: string }) {
  const t = useDict(WA);
  const settings = useSettings();
  const message = useCartMessage();
  if (!waDigits(settings) || !totals.lines.length) return null;
  return (
    <div className={className}>
      <WaAnchor href={waHref(settings, message(totals))} variant="outline" className="w-full">
        {t('cartBtn')}
      </WaAnchor>
      <p className="mt-2 text-center text-[11.5px] leading-snug text-muted">{t('cartNote')}</p>
    </div>
  );
}

/** Checkout: slim "Prefer by message?" link (top) or the fuller block next to the place-order button. */
export function CheckoutWhatsApp({ totals, customer, variant, className }: { totals: Totals; customer: WaCustomer; variant: 'link' | 'block'; className?: string }) {
  const t = useDict(WA);
  const settings = useSettings();
  const message = useCartMessage();
  if (!waDigits(settings) || !totals.lines.length) return null;
  const href = waHref(settings, message(totals, customer));

  if (variant === 'link') {
    return (
      <p className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-muted', className)}>
        <MessageCircle className="h-4 w-4 shrink-0 text-[#1f9d55]" />
        {t('ckTitle')}
        <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-0.5 font-semibold text-[#14773f] underline decoration-[#1f9d55]/30 underline-offset-[3px] hover:decoration-[#1f9d55]">
          {t('ckLink')}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      </p>
    );
  }

  const filled = !!(customer.firstName?.trim() && customer.city);
  return (
    <div className={className}>
      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        <span className="h-px flex-1 bg-line" />
        {t('or')}
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-[#1f9d55]/[0.06] p-4 ring-1 ring-inset ring-[#1f9d55]/15 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">{t('ckTitle')}</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
            {filled ? t('ckFilled') : t('ckEmpty')} {t('ckNote')}
          </p>
        </div>
        <WaAnchor href={href} size="sm" variant="outline" className="self-start sm:self-center">
          {t('ckBtn')}
        </WaAnchor>
      </div>
    </div>
  );
}

/** Order success: "Na dërgoni një mesazh për këtë porosi" with the number + summary prefilled. */
export function OrderWhatsApp({ order, className }: { order: Order; className?: string }) {
  const t = useDict(WA);
  const settings = useSettings();
  const message = useOrderMessage();
  if (!waDigits(settings)) return null;
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <WaAnchor href={waHref(settings, message(order))}>{t('osBtn')}</WaAnchor>
      <p className="mt-2 text-[12px] text-muted">{t('osText', { n: order.number })}</p>
    </div>
  );
}
