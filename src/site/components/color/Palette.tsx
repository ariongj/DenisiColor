// The fan-deck panel: search, colour families, swatches and a free colour picker.
// Desktop: a scrollable 4-column grid with family headers. Phone: a two-row horizontal strip.
import { useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, Pipette, Search, X } from 'lucide-react';
import { useDict, useL, useLang } from '@/i18n';
import { cn } from '@/lib/utils';
import { CS } from './dict';
import { FAMILIES, SWATCHES, foldText, inkOn, normalizeHex, type FamilyId, type Paint } from './palette';

export function PalettePanel({ current, onPick, className }: { current?: Paint; onPick: (p: Paint, coalesce?: boolean) => void; className?: string }) {
  const t = useDict(CS);
  const l = useL();
  const lang = useLang();
  const [q, setQ] = useState('');
  const [family, setFamily] = useState<FamilyId | 'all'>('all');
  const [hexDraft, setHexDraft] = useState('');
  const famRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const f = foldText(q.trim()).replace(/^#/, '');
    return SWATCHES.filter((s) => {
      if (family !== 'all' && !f && s.family !== family) return false;
      if (!f) return true;
      return [s.name.sq, s.name.en, s.name.me, s.code, s.code.replace('DC-', ''), s.hex.slice(1)].some((v) => foldText(v).includes(f));
    });
  }, [q, family]);

  const grouped = family === 'all' && !q.trim();
  const draftHex = normalizeHex(hexDraft);
  const currentHex = current?.hex.toUpperCase();

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      {/* search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('search')}
          aria-label={t('search')}
          className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-10 text-[14.5px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink/40 focus:ring-4 focus:ring-ink/5"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label={t('close')} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* families */}
      <div className="relative -mx-4 mt-3 sm:-mx-5">
      <div ref={famRef} className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-4 sm:px-5 sm:pr-14 [mask-image:linear-gradient(to_right,black_85%,transparent)]" role="tablist" aria-label={t('palette')}>
        {[{ id: 'all' as const, name: null }, ...FAMILIES].map((f) => {
          const on = family === f.id && !q.trim();
          const dots = f.id === 'all' ? ['#F3EEDF', '#6E8CA3', '#B96B4C'] : SWATCHES.filter((s) => s.family === f.id).filter((_, i) => i % 3 === 1).slice(0, 3).map((s) => s.hex);
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setFamily(f.id);
                setQ('');
              }}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border pl-1.5 pr-3 text-[12.5px] font-semibold transition-colors',
                on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft hover:border-ink/30 hover:text-ink',
              )}
            >
              <span className="flex -space-x-1.5">
                {dots.map((d) => (
                  <span key={d} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: d }} />
                ))}
              </span>
              {f.name ? l(f.name) : t('all')}
            </button>
          );
        })}
      </div>
        <button type="button" onClick={() => famRef.current?.scrollBy({ left: 180 })} aria-label={t('all')} tabIndex={-1} className="absolute right-3 top-1/2 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow ring-1 ring-line hover:bg-sand sm:grid">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* swatches */}
      {list.length === 0 ? (
        <p className="mt-4 rounded-xl bg-sand/60 px-4 py-6 text-center text-sm text-muted">{t('noResults', { q })}</p>
      ) : (
        <div
          className={cn(
            'no-scrollbar mt-3 grid gap-x-2.5 gap-y-3',
            // phone: two-row horizontal strip
            'max-lg:-mx-4 max-lg:auto-cols-[78px] max-lg:grid-flow-col max-lg:grid-rows-2 max-lg:overflow-x-auto max-lg:px-4 max-lg:pb-1 max-lg:snap-x',
            // desktop: scrollable grid
            'lg:max-h-[468px] lg:grid-cols-4 lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]',
          )}
        >
          {list.map((s, i) => {
            const on = currentHex === s.hex.toUpperCase();
            const header = grouped && (i === 0 || list[i - 1].family !== s.family);
            const fam = FAMILIES.find((f) => f.id === s.family)!;
            return (
              <SwatchItem
                key={s.code}
                header={header ? l(fam.name) : undefined}
                hex={s.hex}
                name={s.name[lang] || s.name.me}
                code={s.code}
                on={on}
                onClick={() => onPick({ hex: s.hex, code: s.code })}
              />
            );
          })}
        </div>
      )}

      {/* free colour */}
      <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-sand/55 p-2.5">
        <label className="relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl ring-1 ring-black/10" style={{ background: 'conic-gradient(from 90deg, #e8504a, #f5b100, #8fc15b, #3fb3c9, #3b5fc4, #b45bc4, #e8504a)' }} title={t('custom')}>
          <Pipette className="h-4 w-4 text-white drop-shadow" />
          <input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={t('custom')}
            value={current && !current.code ? current.hex.toLowerCase() : '#c8a27a'}
            onChange={(e) => {
              setHexDraft(e.target.value.toUpperCase());
              onPick({ hex: e.target.value.toUpperCase() }, true);
            }}
          />
        </label>
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-bold text-ink">{t('custom')}</div>
          <div className="truncate text-[11.5px] text-muted">{t('customHint')}</div>
        </div>
        <form
          className="flex shrink-0 items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (draftHex) onPick({ hex: draftHex });
          }}
        >
          <input
            value={hexDraft}
            onChange={(e) => setHexDraft(e.target.value)}
            placeholder="#C8A27A"
            aria-label="Hex"
            maxLength={7}
            className="h-9 w-[86px] rounded-lg border border-line bg-white px-2.5 font-mono text-[13px] uppercase text-ink outline-none focus:border-ink/40"
          />
          <button type="submit" disabled={!draftHex} className="h-9 rounded-lg bg-ink px-3 text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-35">
            {t('apply')}
          </button>
        </form>
      </div>
      <p className="mt-2.5 text-[11.5px] leading-snug text-muted">{t('codesNote')}</p>
    </div>
  );
}

function SwatchItem({ header, hex, name, code, on, onClick }: { header?: string; hex: string; name: string; code: string; on: boolean; onClick: () => void }) {
  return (
    <>
      {header && <div className="col-span-4 pt-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted first:pt-0 max-lg:hidden">{header}</div>}
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        aria-label={`${name}, ${code}`}
        title={`${name} · ${code} · ${hex}`}
        className="group min-w-0 snap-start rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <span
          className={cn(
            'relative block aspect-[5/4] rounded-[10px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)] transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95',
            on && 'ring-2 ring-ink ring-offset-2',
          )}
          style={{ background: hex }}
        >
          {/* paint-chip sheen */}
          <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/25 via-transparent to-black/[0.06]" />
          {on && <Check className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" style={{ color: inkOn(hex) }} strokeWidth={3} />}
        </span>
        <span className="mt-1.5 block truncate text-[11.5px] font-semibold leading-tight text-ink">{name}</span>
        <span className="block text-[10.5px] leading-tight text-muted">{code}</span>
      </button>
    </>
  );
}
