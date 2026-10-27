import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ClipboardList, ListPlus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Accent, QtyStepper } from '@/components/ui/misc';
import { WhatsAppIcon } from '@/components/brand/Social';
import { AdImage } from '@/site/components/AdImage';
import { waDigits, waHref } from '@/site/components/quote';
import { useDict, useL, useLang } from '@/i18n';
import { useSettings } from '@/store/hooks';
import { cartKey, useUi } from '@/store/ui';
import { num } from '@/lib/format';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LT } from './dict';
import { KELVIN, P, WATTS, type Housing, type Line, type RoomPlan } from './model';
import { useLightProducts } from './parts';

/** Step 3: product totals with editable quantities → quote list / WhatsApp. */
export function ListPanel({
  lines,
  autoQty,
  plans,
  labels,
  units,
  housing,
  onQty,
  onReset,
  onHousing,
}: {
  lines: Line[];
  /** Computed quantity per line key (to flag manual edits) */
  autoQty: Record<string, number>;
  plans: RoomPlan[];
  labels: Record<string, string>;
  units: number;
  housing: Housing;
  onQty: (key: string, qty: number) => void;
  onReset: (key: string) => void;
  onHousing: (productId: string, v: 'white' | 'black') => void;
}) {
  const t = useDict(LT);
  const l = useL();
  const lang = useLang();
  const navigate = useNavigate();
  const settings = useSettings();
  const products = useLightProducts();
  const addToQuote = useUi((s) => s.addToQuote);
  const setQuoteNote = useUi((s) => s.setQuoteNote);
  const setQuoteOpen = useUi((s) => s.setQuoteOpen);
  const n = (v: number, d = 0) => num(v, lang, d);

  const live = lines.filter((x) => x.qty > 0 && products[x.productId]);
  const fixtures = live.filter((x) => x.unit === 'kom').reduce((s, x) => s + x.qty, 0);
  const ledM = live.filter((x) => x.productId === P.strip).reduce((s, x) => s + x.qty, 0);
  const watts = live.reduce((s, x) => s + (WATTS[x.productId] ?? 0) * x.qty, 0);

  const optionLabel = (product: Product, options: Record<string, string>) =>
    Object.entries(options)
      .map(([k, v]) => l(product.options.find((o) => o.id === k)?.values.find((x) => x.id === v)?.label))
      .filter(Boolean)
      .join(', ');

  const planOf = (roomId: string) => plans.find((p) => p.room.id === roomId);
  const cctOf = (pl: RoomPlan) =>
    pl.preset.cctFixed ? '' : pl.fixture === P.wall24 ? t(pl.room.cct === 'warm' ? 'cctWarm' : pl.room.cct === 'neutral' ? 'cctNeutral' : 'cctCool') : KELVIN[pl.room.cct];
  const roomText = (pl: RoomPlan) => [`${labels[pl.room.id]} ${n(pl.room.area)} m²`, cctOf(pl)].filter(Boolean).join(' · ');

  /** "Planifikuesi i ndriçimit — Dhomë ndenjjeje 20 m² · 3000K (2 × 6); Kuzhinë 12 m² · 4000K (2 × 6)" */
  const noteFor = (line: Line) => {
    const parts = line.parts
      .map((part) => {
        const pl = planOf(part.roomId);
        if (!pl) return '';
        const per = part.qty / pl.mult;
        const unit = line.unit === 'm' ? ' m' : '';
        return `${roomText(pl)} (${n(per)}${unit}${pl.mult > 1 ? ` × ${pl.mult}` : ''})`;
      })
      .filter(Boolean)
      .join('; ');
    const head = line.unit === 'm' ? `${t('noteHead')} — ${t('metresNote', { m: n(line.qty) })}` : t('noteHead');
    return `${head}: ${parts}`;
  };

  const addAll = () => {
    for (const line of live) {
      const note = noteFor(line);
      const key = cartKey(line.productId, line.options, false);
      const existing = useUi.getState().quoteList.find((q) => q.key === key);
      addToQuote({ productId: line.productId, qty: line.qty, options: line.options, note });
      // addToQuote keeps the first note when the line already exists — append ours instead of losing it
      if (existing) setQuoteNote(key, existing.note ? `${existing.note} | ${note}` : note);
    }
    setQuoteOpen(true);
    toast.success(t('addedToast'), {
      description: t('addedDesc', { n: live.length }),
      action: { label: t('viewList'), onClick: () => navigate('/lista-ofertes') },
    });
  };

  const waText = () => {
    const rows = live.map((x) => {
      const p = products[x.productId]!;
      const opt = optionLabel(p, x.options);
      return `• ${l(p.name)}${opt ? ` (${opt})` : ''} — ${n(x.qty)} ${x.unit === 'm' ? t('unitM') : t('unitKom')}`;
    });
    const rooms = plans.map((pl) => `– ${roomText(pl)}${pl.room.count > 1 ? ` × ${pl.room.count}` : ''}`);
    return [t('waIntro'), '', ...rows, '', t('waRooms'), ...rooms, ...(units > 1 ? [t('waUnits', { n: units })] : []), '', t('waOutro')].join('\n');
  };

  return (
    <div className="card overflow-hidden shadow-[0_30px_60px_-40px_rgb(19_36_59/0.45)]">
      <div className="relative overflow-hidden bg-brand-900 px-5 py-5 text-white">
        <div className="bg-stripes absolute inset-0" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 font-display text-base font-extrabold text-brand-900">3</span>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">{t('step3')}</div>
            <h2 className="display text-[22px] leading-tight">
              <Accent text={t('listTitle')} accentClassName="text-amber-400!" />
            </h2>
          </div>
        </div>
        {live.length > 0 && (
          <div className="relative mt-4 grid grid-cols-3 divide-x divide-white/15 rounded-xl bg-white/[0.07] py-2.5 text-center ring-1 ring-white/10">
            <div>
              <div className="font-display text-xl font-extrabold tabular-nums">{n(fixtures)}</div>
              <div className="text-[11px] text-paper/70">{t('totFixtures')}</div>
            </div>
            <div>
              <div className="font-display text-xl font-extrabold tabular-nums">{n(ledM)}</div>
              <div className="text-[11px] text-paper/70">{t('totLed')}</div>
            </div>
            <div>
              <div className="font-display text-xl font-extrabold tabular-nums">{n(watts)}</div>
              <div className="text-[11px] text-paper/70">W</div>
            </div>
          </div>
        )}
      </div>

      {live.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper text-muted">
            <ClipboardList className="h-5 w-5" />
          </span>
          <p className="max-w-[240px] text-[13.5px] text-muted">{t('listEmpty')}</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {live.map((x) => {
              const p = products[x.productId]!;
              const edited = autoQty[x.key] !== undefined && autoQty[x.key] !== x.qty;
              const hasHousing = x.productId === P.ceiling36 || x.productId === P.wall24;
              const swatches = p.options.find((o) => o.id === 'color');
              return (
                <li key={x.key} className="flex gap-3 px-4 py-3.5 sm:px-5">
                  <Link to={`/proizvod/${p.slug}`} className="shrink-0">
                    <AdImage src={p.images[0]} small alt={l(p.name)} className="h-14 w-14 rounded-xl ring-1 ring-line" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/proizvod/${p.slug}`} className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-brand-700">
                      {l(p.name)}
                    </Link>
                    {hasHousing && swatches ? (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-muted">
                        {t('housing')}:
                        {swatches.values.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            title={l(v.label)}
                            aria-label={l(v.label)}
                            aria-pressed={housing[x.productId] === v.id}
                            onClick={() => onHousing(x.productId, v.id as 'white' | 'black')}
                            className={cn('h-5 w-5 rounded-full ring-1 ring-black/15 transition-shadow', housing[x.productId] === v.id && 'ring-2 ring-brand-600 ring-offset-2')}
                            style={{ background: v.swatch }}
                          />
                        ))}
                        <span className="ml-0.5 font-medium text-ink-soft">{optionLabel(p, x.options)}</span>
                      </div>
                    ) : (
                      optionLabel(p, x.options) && <div className="mt-1 text-[11.5px] font-medium text-ink-soft">{optionLabel(p, x.options)}</div>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <QtyStepper size="sm" value={x.qty} onChange={(v) => onQty(x.key, v)} min={0} max={9999} />
                      <span className="text-[12px] text-muted">{x.unit === 'm' ? t('unitM') : t('unitKom')}</span>
                      {edited && (
                        <button type="button" onClick={() => onReset(x.key)} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-600/20 hover:bg-amber-100">
                          <RotateCcw className="h-3 w-3" />
                          {t('edited')} · {t('reset')} {n(autoQty[x.key])}
                        </button>
                      )}
                    </div>
                    {x.unit === 'm' && <p className="mt-1.5 text-[11px] leading-snug text-muted">{t('metresNote', { m: n(x.qty) })}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="space-y-2.5 border-t border-line bg-paper/60 p-4 sm:p-5">
            <Button className="w-full" size="lg" icon={<ListPlus className="h-[18px] w-[18px]" />} onClick={addAll}>
              {t('addAll')}
            </Button>
            {waDigits(settings) && (
              <a
                href={waHref(settings, waText())}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1f9d55] text-sm font-semibold text-white shadow-[0_10px_24px_-14px_#1f9d55] transition-colors hover:bg-[#178246]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                {t('sendWa')}
              </a>
            )}
            <p className="pt-1 text-center text-[11.5px] leading-snug text-muted">
              {t('priceNote')}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
