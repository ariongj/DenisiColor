import { Copy, Trash2 } from 'lucide-react';
import { QtyStepper } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Field';
import { useDict, useLang } from '@/i18n';
import { num } from '@/lib/format';
import { cn } from '@/lib/utils';
import { LT } from './dict';
import { KELVIN, LIGHT_RGB, P, YARD_SPACING, type Cct, type Room, type RoomPlan, type StripType } from './model';
import { ROOM_ICON, Seg, mountOf } from './parts';
import { RoomSketch } from './RoomSketch';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Editor for one room: area (slider + input), ceiling height, how many alike, light colour, LED accent. */
export function RoomCard({ plan, label, onChange, onDuplicate, onRemove }: { plan: RoomPlan; label: string; onChange: (patch: Partial<Room>) => void; onDuplicate: () => void; onRemove: () => void }) {
  const t = useDict(LT);
  const lang = useLang();
  const { room, preset: p } = plan;
  const Icon = ROOM_ICON[room.type];
  const sliderMax = Math.max(p.areaMax, room.area);
  const cctLabel = (c: Cct) => (plan.fixture !== P.wall24 ? KELVIN[c] : t(c === 'warm' ? 'cctWarm' : c === 'neutral' ? 'cctNeutral' : 'cctCool'));

  return (
    <article className="card overflow-hidden transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(19_36_59/0.35)]">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[15px] font-bold text-ink">{label}</h3>
          <p className="text-[12px] text-muted">
            {t('target')} {p.lux[0] === p.lux[1] ? p.lux[0] : `${p.lux[0]}–${p.lux[1]}`} lx
          </p>
        </div>
        <button type="button" onClick={onDuplicate} title={t('duplicate')} aria-label={t('duplicate')} className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink">
          <Copy className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRemove} title={t('remove')} aria-label={t('remove')} className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      <div className="grid gap-5 p-4 sm:grid-cols-[140px_1fr] sm:p-5">
        {/* Light preview */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-stretch">
          <RoomSketch cct={room.cct} mount={mountOf(plan.fixture)} outdoor={p.outdoor} className="h-20 w-28 shrink-0 rounded-xl ring-1 ring-black/5 sm:h-24 sm:w-full" />
          <div className="text-[12px] leading-snug text-muted sm:text-center">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <span className="h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: `rgb(${LIGHT_RGB[room.cct]})` }} />
              {cctLabel(room.cct)}
            </span>
            {plan.fixture !== P.wall24 && <div>{t(room.cct === 'warm' ? 'cctWarm' : room.cct === 'neutral' ? 'cctNeutral' : 'cctCool')}</div>}
          </div>
        </div>

        <div className="grid content-start gap-x-8 gap-y-4 md:grid-cols-2">
          {/* Area */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor={`area-${room.id}`} className="text-[13px] font-semibold text-ink">
                {t('area')}
              </label>
              <div className="relative">
                <input
                  id={`area-${room.id}`}
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={5000}
                  value={room.area}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    if (!Number.isNaN(n)) onChange({ area: clamp(Math.round(n), 1, 5000) });
                  }}
                  className="h-9 w-[92px] rounded-lg border border-line bg-white pl-3 pr-9 text-right text-sm font-semibold tabular-nums text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12px] text-muted">m²</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={sliderMax}
              step={sliderMax > 400 ? 10 : 1}
              value={room.area}
              aria-label={t('area')}
              onChange={(e) => onChange({ area: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer accent-brand-600"
            />
          </div>

          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            {/* Ceiling height (indoor) or street-light density (yard) */}
            {room.type === 'yard' ? (
              <div>
                <div className="mb-1.5 text-[13px] font-semibold text-ink">{t('spacing')}</div>
                <Seg value={room.spacing} onChange={(v) => onChange({ spacing: v })} options={YARD_SPACING.map((m) => ({ id: m, label: t('spacingV', { m }) }))} />
              </div>
            ) : !p.outdoor ? (
              <div>
                <label htmlFor={`h-${room.id}`} className="mb-1.5 block text-[13px] font-semibold text-ink">
                  {t('height')}
                </label>
                <div className="relative w-fit">
                  <input
                    id={`h-${room.id}`}
                    type="number"
                    inputMode="decimal"
                    step={0.1}
                    min={2.2}
                    max={12}
                    value={room.height}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      if (!Number.isNaN(n)) onChange({ height: clamp(Math.round(n * 10) / 10, 2.2, 12) });
                    }}
                    className="h-9 w-[92px] rounded-lg border border-line bg-white pl-3 pr-7 text-right text-sm font-semibold tabular-nums text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12px] text-muted">m</span>
                </div>
              </div>
            ) : null}
            <div>
              <div className="mb-1.5 text-[13px] font-semibold text-ink">{t('count')}</div>
              <QtyStepper size="sm" value={room.count} onChange={(v) => onChange({ count: v })} min={1} max={200} />
            </div>
          </div>

          {/* Light colour */}
          <div className="md:col-span-2">
            <div className="mb-1.5 text-[13px] font-semibold text-ink">{t('cct')}</div>
            {p.cctFixed ? (
              <p className="text-[12.5px] text-muted">{t('cctFixed')}</p>
            ) : (
              <Seg
                value={room.cct}
                onChange={(v) => onChange({ cct: v })}
                options={(['warm', 'neutral', 'cool'] as Cct[]).map((c) => ({
                  id: c,
                  label: (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: `rgb(${LIGHT_RGB[c]})` }} />
                      {cctLabel(c)}
                      {c === p.cct && <span className="text-[10px] font-bold uppercase tracking-wide text-brand-600">· {t('suggested')}</span>}
                    </>
                  ),
                }))}
              />
            )}
          </div>

          {room.type === 'yard' && (
            <div>
              <div className="mb-1.5 text-[13px] font-semibold text-ink">{t('street')}</div>
              <Seg
                value={room.street}
                onChange={(v) => onChange({ street: v })}
                options={[
                  { id: 'std', label: t('streetStd') },
                  { id: 'novaled', label: t('streetNovaled') },
                ]}
              />
            </div>
          )}

          {/* LED strip accent (living room / kitchen) */}
          {!!p.accentShare && (
            <div className={cn('flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed p-3 transition-colors md:col-span-2', room.accent ? 'border-brand-300 bg-brand-50/50' : 'border-line')}>
              <Switch
                size="sm"
                checked={room.accent}
                onChange={(v) => onChange({ accent: v })}
                label={
                  <span>
                    {t('accent')}
                    <span className="ml-1.5 font-normal text-muted">{t('accentHint', { m: num(plan.stripM || Math.max(1, Math.round(4 * Math.sqrt(room.area) * p.accentShare)), lang) })}</span>
                  </span>
                }
              />
              {room.accent && (
                <div>
                  <Seg
                    value={room.strip}
                    onChange={(v: StripType) => onChange({ strip: v })}
                    options={[
                      { id: '3000k', label: '3000K' },
                      { id: '6500k-cob', label: '6500K COB' },
                      { id: 'rgb', label: 'RGB' },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
