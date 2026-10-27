import { useNavigate } from 'react-router';
import { ArrowRight, ClipboardList, Info } from 'lucide-react';
import { Drawer } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/brand/Social';
import { waDigits, waHref } from '@/site/components/quote';
import { useDict, useLang } from '@/i18n';
import { useUi } from '@/store/ui';
import { useSettings } from '@/store/hooks';
import { QL } from './dict';
import { QuoteLine } from './QuoteLine';
import { quoteText, useListSummary, useQuoteLines } from './shared';

/** Header drawer with the quote list — mounted once from Header.tsx, opened by `useUi().setQuoteOpen(true)`. */
export function QuoteDrawer() {
  const t = useDict(QL);
  const lang = useLang();
  const open = useUi((s) => s.quoteOpen);
  const setOpen = useUi((s) => s.setQuoteOpen);
  const settings = useSettings();
  const navigate = useNavigate();
  const lines = useQuoteLines();
  const summary = useListSummary(lines);
  const empty = lines.length === 0;
  const close = () => setOpen(false);
  const go = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title={
        <span className="flex items-center gap-2.5">
          {t('listTitle')}
          {!empty && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-amber-400 px-1.5 text-xs font-bold text-brand-900">{lines.length}</span>}
        </span>
      }
      footer={
        !empty && (
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium text-muted">{t('itemsTitle')}</span>
              <span className="text-[15px] font-bold tabular-nums text-ink">{summary}</span>
            </div>
            <div className="mt-4 grid gap-2">
              <Button size="lg" className="w-full" iconRight={<ArrowRight className="h-4 w-4" />} onClick={() => go('/lista-ofertes')}>
                {t('continueRequest')}
              </Button>
              {waDigits(settings) && (
                <a
                  href={waHref(settings, quoteText(lines, {}, lang, { shop: settings.companyName }))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1f9d55] text-sm font-semibold text-white transition-colors hover:bg-[#178246]"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" /> {t('sendWa')}
                </a>
              )}
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <span className="relative grid h-20 w-20 place-items-center">
            <span className="absolute inset-0 rounded-full bg-amber-100" />
            <span className="absolute inset-2.5 rounded-full bg-amber-50 ring-1 ring-amber-200" />
            <ClipboardList className="relative h-8 w-8 text-brand-700" strokeWidth={1.7} />
          </span>
          <h3 className="mt-6 text-lg font-bold text-ink">{t('emptyTitle')}</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{t('emptyText')}</p>
          <Button variant="dark" className="mt-7" onClick={() => go('/proizvodi')}>
            {t('emptyCta')}
          </Button>
        </div>
      ) : (
        <div className="px-5 pb-4 pt-4 sm:px-6">
          <p className="flex items-start gap-2.5 rounded-2xl bg-brand-50 px-3.5 py-3 text-[12.5px] leading-snug text-brand-900 ring-1 ring-brand-100">
            <Info className="mt-px h-4 w-4 shrink-0 text-brand-600" />
            {t('drawerIntro')}
          </p>
          <div className="divide-y divide-line">
            {lines.map((line) => (
              <QuoteLine key={line.item.key} line={line} onNavigate={close} />
            ))}
          </div>
          <button type="button" onClick={() => go('/proizvodi')} className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink">
            {t('keepBrowsing')} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </Drawer>
  );
}
