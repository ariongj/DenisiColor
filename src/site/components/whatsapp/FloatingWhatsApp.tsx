// Site-wide floating WhatsApp button (bottom-right) with a small popover of quick intents that prefill
// the message. Denisi Color takes most orders by message — this keeps that channel one tap away.
import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, FileText, MessageCircleQuestion, Phone, ShoppingBag, X } from 'lucide-react';
import { useDict, useL, useLang } from '@/i18n';
import { useUi } from '@/store/ui';
import { useCart, useProduct, useSettings } from '@/store/hooks';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/brand/Social';
import { waDigits, waHref } from '@/site/components/quote';
import { useItemsLabel } from '@/site/components/checkout/parts';
import { WA } from './dict';
import { isOpenNow, shortHours, useCartMessage } from './message';

/** Pages that carry their own WhatsApp actions (cart summary, checkout alternative, order follow-up). */
const HIDDEN = /^\/(korpa|placanje|narudzba\/)/;

/**
 * Height of any full-width bar pinned to the bottom of the viewport (the product page's sticky
 * add-to-cart bar, a cookie banner…) so the button can float above it instead of covering it.
 * Re-measured (once per frame at most) whenever the DOM changes or the page scrolls/resizes.
 */
function useBottomBarOffset(enabled: boolean, self: RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      let max = 0;
      document.querySelectorAll<HTMLElement>('.fixed.bottom-0').forEach((el) => {
        if (self.current?.contains(el)) return;
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.width >= window.innerWidth * 0.9 && r.top < vh && r.bottom >= vh - 2) max = Math.max(max, vh - r.top);
      });
      setOffset(Math.round(max));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => {
      mo.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, self]);
  return offset;
}

export function FloatingWhatsApp() {
  const t = useDict(WA);
  const l = useL();
  const lang = useLang();
  const settings = useSettings();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const cartOpen = useUi((s) => s.cartOpen);
  const totals = useCart();
  const cartMessage = useCartMessage();
  const items = useItemsLabel();
  const [open, setOpen] = useState(false);
  const [openNow, setOpenNow] = useState(() => isOpenNow(settings));
  const ref = useRef<HTMLDivElement>(null);
  const popId = useId();

  // product page → the first intent asks about that product
  const slug = /^\/proizvod\/([^/]+)/.exec(pathname)?.[1];
  const product = useProduct(slug);

  // the builder's preview iframe (/?preview=1) and framed embeds never show it
  const framed = typeof window !== 'undefined' && window.self !== window.top;
  const hidden = params.get('preview') === '1' || framed || HIDDEN.test(pathname) || !waDigits(settings);
  const lift = useBottomBarOffset(!hidden, ref);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (cartOpen) setOpen(false);
  }, [cartOpen]);
  // refresh the open/closed dot once a minute
  useEffect(() => {
    setOpenNow(isOpenNow(settings));
    const id = window.setInterval(() => setOpenNow(isOpenNow(settings)), 60_000);
    return () => window.clearInterval(id);
  }, [settings]);
  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (hidden) return null;

  const hours = shortHours(l(settings.hours));
  const hasCart = totals.lines.length > 0;
  const intents = [
    {
      icon: MessageCircleQuestion,
      title: product ? t('intentProductHere') : t('intentProduct'),
      text: product ? l(product.name) : t('intentProductText'),
      msg: product ? t('msgProductHere', { name: l(product.name), url: window.location.href.split('#')[0] }) : t('msgProduct'),
    },
    { icon: FileText, title: t('intentQuote'), text: t('intentQuoteText'), msg: t('msgQuote') },
    hasCart
      ? { icon: ShoppingBag, title: t('intentOrderCart'), text: t('intentOrderCartText', { items: items(totals.count), total: money(totals.total, lang) }), msg: cartMessage(totals) }
      : { icon: ShoppingBag, title: t('intentOrder'), text: t('intentOrderText'), msg: t('msgOrder') },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        'fixed bottom-4 right-4 z-30 flex flex-col items-end transition-[opacity,transform] duration-300 ease-out sm:bottom-6 sm:right-6',
        cartOpen && 'pointer-events-none opacity-0',
      )}
      // float above the product page's sticky add-to-cart bar (or any other bottom bar)
      style={{ transform: `translateY(${cartOpen ? 8 : lift ? -(lift - 4) : 0}px)` }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id={popId}
            role="dialog"
            aria-label={t('popTitle')}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="mb-3 w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(19,36,59,0.45)] ring-1 ring-line"
          >
            <div className="relative bg-brand-900 px-4 pb-4 pt-3.5 text-paper">
              <div className="bg-stripes pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1f9d55] text-white">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[14px] font-bold leading-tight text-white">{t('popTitle')}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[12px] text-paper/70">
                    <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', openNow ? 'bg-[#3ddc84]' : 'bg-paper/40')} />
                    {openNow ? t('popOpen') : t('popClosed')}
                  </p>
                  <p className="mt-0.5 pl-3 text-[11.5px] font-semibold text-paper/50">{hours}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="-mr-1.5 -mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-paper/70 transition-colors hover:bg-white/10 hover:text-white" aria-label={t('close')}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="px-4 pt-3 text-[12px] leading-snug text-muted">{t('popHint')}</p>
            <ul className="p-2">
              {intents.map(({ icon: Icon, title, text, msg }) => (
                <li key={title}>
                  <a
                    href={waHref(settings, msg)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-paper"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sand text-brand-700 transition-colors group-hover:bg-[#1f9d55] group-hover:text-white">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold leading-tight text-ink">{title}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted">{text}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                  </a>
                </li>
              ))}
            </ul>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[12.5px] text-muted transition-colors hover:bg-paper hover:text-ink">
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                {t('orCall')}
              </span>
              <span className="font-semibold tabular-nums text-ink">{settings.phone}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-label={t('fabAria')}
        className={cn(
          'group flex h-14 items-center gap-3 rounded-full bg-[#1f9d55] text-white shadow-[0_14px_34px_-12px_rgba(20,119,63,0.75)] ring-1 ring-black/5 transition-[background,transform,padding] duration-200 hover:bg-[#178246] active:scale-[0.97]',
          'w-14 justify-center sm:w-auto sm:justify-start sm:py-2 sm:pl-2 sm:pr-5',
        )}
      >
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full sm:bg-white/15">
          {open ? <X className="h-6 w-6 sm:h-5 sm:w-5" /> : <WhatsAppIcon className="h-7 w-7 sm:h-[22px] sm:w-[22px]" />}
          {/* open/closed dot */}
          <span className={cn('absolute right-0 top-0 h-3 w-3 rounded-full ring-2 ring-[#1f9d55] sm:right-0.5 sm:top-0.5 sm:h-2.5 sm:w-2.5', openNow ? 'bg-[#3ddc84]' : 'bg-white/60')} />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[14px] font-bold leading-tight">{t('fabLabel')}</span>
          <span className="block text-[11px] font-medium leading-tight text-white/80">
            {openNow ? `${t('online')} · ` : ''}
            {hours}
          </span>
        </span>
      </button>
    </div>
  );
}
