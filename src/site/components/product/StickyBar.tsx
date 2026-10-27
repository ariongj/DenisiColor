import { AnimatePresence, motion } from 'motion/react';
import { FileText, ShoppingBag } from 'lucide-react';
import { Img } from '@/components/ui/misc';
import { useDict, useL, useLang } from '@/i18n';
import { optionsLabel } from '@/lib/pricing';
import { num, unitLabel } from '@/lib/format';
import { WhatsAppIcon } from '@/components/brand/Social';
import { needsQuote, useWhatsApp } from '@/site/components/quote';
import { PD, eur, packWord } from './dict';
import { useTweenedNumber, type Configurator } from './useConfigurator';
import { WishButton } from './BuyBox';

/** Bottom add-to-cart bar: always handy on mobile, on desktop once the buy box is out of view. */
export function StickyBar({ cfg, visible, onAdd, onQuote }: { cfg: Configurator; visible: boolean; onAdd: () => void; onQuote: () => void }) {
  const t = useDict(PD);
  const l = useL();
  const lang = useLang();
  const p = cfg.product;
  const total = useTweenedNumber(cfg.total);
  const opts = optionsLabel(p, cfg.options, lang);
  const quote = needsQuote(p);
  const wa = useWhatsApp();
  const qtyText =
    p.unit === 'm2' && p.packSize
      ? `${cfg.qty} ${packWord(cfg.qty, lang, t('pack_one'), t('pack_many'))} · ${num(cfg.units, lang)} m²`
      : `${num(cfg.qty, lang)} ${unitLabel(p.unit, lang)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-20px_40px_-24px_rgba(19,36,59,0.35)] backdrop-blur-xl"
        >
          <div className="container-x flex h-[76px] items-center gap-3 sm:gap-4">
            <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand sm:block">
              <Img src={p.images[0]} small alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="hidden truncate text-[14.5px] font-semibold text-ink sm:block">{l(p.name)}</div>
              {quote ? (
                <>
                  <div className="truncate text-[13px] font-semibold text-ink sm:hidden">{l(p.name)}</div>
                  <div className="truncate font-display text-[13px] font-extrabold text-brand-700">{t('quoteOnly')}</div>
                </>
              ) : (
                <>
                  <div className="text-[18px] font-bold leading-tight tabular-nums text-ink sm:hidden">{eur(total, lang, cfg.total)}</div>
                  <div className="truncate text-[12.5px] text-muted">
                    {qtyText}
                    {opts && <span className="hidden md:inline"> · {opts}</span>}
                    {cfg.installation && ` · ${t('installation')}`}
                  </div>
                </>
              )}
            </div>
            {!quote && <div className="hidden shrink-0 text-right text-[22px] font-bold tabular-nums text-ink sm:block">{eur(total, lang, cfg.total)}</div>}
            <WishButton productId={p.id} tone="light" className="h-12! w-12! max-md:hidden!" />
            {quote && wa.enabled && (
              <a href={wa.product(p)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1f9d55] text-white transition-colors hover:bg-[#178246]">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}
            <button
              type="button"
              onClick={quote ? onQuote : onAdd}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-[14.5px] font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_10px_24px_-14px_var(--color-brand-700)] transition-[background,transform] hover:bg-brand-700 active:scale-[0.98] sm:px-7"
            >
              {quote ? <FileText className="h-[18px] w-[18px]" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
              {quote ? t('requestQuote') : t('addToCart')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
