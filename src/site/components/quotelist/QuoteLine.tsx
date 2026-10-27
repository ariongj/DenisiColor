import { useState } from 'react';
import { Link } from 'react-router';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { QtyStepper } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { needsQuote } from '@/site/components/quote';
import { useDict, useL, useLang } from '@/i18n';
import { useUi } from '@/store/ui';
import { basePrice, optionsLabel } from '@/lib/pricing';
import { money, unitLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { QL } from './dict';
import { MAX_QTY, type QuoteLineView } from './shared';

/** One product in the quote list: thumbnail, name, options, quantity, an optional note and remove. */
export function QuoteLine({ line, size = 'drawer', onNavigate }: { line: QuoteLineView; size?: 'drawer' | 'page'; onNavigate?: () => void }) {
  const t = useDict(QL);
  const l = useL();
  const lang = useLang();
  const setQty = useUi((s) => s.setQuoteQty);
  const setNote = useUi((s) => s.setQuoteNote);
  const remove = useUi((s) => s.removeFromQuote);
  const { item, product: p } = line;
  const [noteOpen, setNoteOpen] = useState(!!item.note);
  const opts = optionsLabel(p, item.options, lang);
  const href = `/proizvod/${p.slug}`;
  const big = size === 'page';

  return (
    <div className={cn('flex gap-4', big ? 'py-5 sm:gap-5' : 'py-4')}>
      <Link to={href} onClick={onNavigate} className={cn('shrink-0 overflow-hidden rounded-xl ring-1 ring-line', big ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-[72px] w-[72px]')}>
        <AdImage src={p.images[0]} small alt={l(p.name)} className="h-full w-full" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={href} onClick={onNavigate} className={cn('line-clamp-2 font-semibold leading-snug text-ink hover:text-brand-700', big ? 'text-[15.5px]' : 'text-[14.5px]')}>
              {l(p.name)}
            </Link>
            {opts && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{opts}</p>}
            <p className={cn('mt-1 text-[12px] font-semibold', needsQuote(p) ? 'text-brand-700' : 'text-ink-soft')}>
              {needsQuote(p) ? t('priceOnRequest') : t('catalogPrice', { price: money(basePrice(p), lang) })}
            </p>
          </div>
          <button type="button" onClick={() => remove(item.key)} className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink" aria-label={t('remove')} title={t('remove')}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <QtyStepper size="sm" value={item.qty} max={MAX_QTY} onChange={(v) => setQty(item.key, v)} />
            <span className="text-[12.5px] text-muted">{unitLabel(p.unit, lang)}</span>
          </div>
          {!noteOpen && (
            <button type="button" onClick={() => setNoteOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink">
              <MessageSquarePlus className="h-3.5 w-3.5" /> {t('addNote')}
            </button>
          )}
        </div>
        {noteOpen && (
          <label className="mt-2.5 block">
            <span className="sr-only">{t('note')}</span>
            <input
              value={item.note ?? ''}
              onChange={(e) => setNote(item.key, e.target.value)}
              onBlur={(e) => !e.target.value.trim() && setNoteOpen(false)}
              autoFocus={!item.note}
              maxLength={200}
              placeholder={t('notePh')}
              className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-muted/80 focus:border-ink/40 focus:ring-4 focus:ring-ink/5"
            />
          </label>
        )}
      </div>
    </div>
  );
}
