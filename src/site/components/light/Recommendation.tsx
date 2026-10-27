import { Link } from 'react-router';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { useDict, useL, useLang } from '@/i18n';
import { num } from '@/lib/format';
import { LT } from './dict';
import { KELVIN, LIGHT_RGB, P, type RoomPlan } from './model';
import { ROOM_ICON, useLightProducts } from './parts';

const COLS = 'lg:grid-cols-[1.25fr_0.8fr_1fr_1.45fr_0.75fr_0.5fr]';

/** Step 2: what each room needs (lux → lumens → fixtures), with the working shown. */
export function Recommendation({ plans, labels }: { plans: RoomPlan[]; labels: Record<string, string> }) {
  const t = useDict(LT);
  const l = useL();
  const lang = useLang();
  const products = useLightProducts();
  const n = (v: number, d = 0) => num(v, lang, d);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-start gap-2.5 border-b border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-900 sm:px-5">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {t('estimate')}
      </div>
      <div className={`hidden gap-4 border-b border-line bg-paper px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted lg:grid ${COLS}`}>
        <span>{t('room')}</span>
        <span>{t('light')}</span>
        <span>≈ lm</span>
        <span>{t('fixture')}</span>
        <span className="text-right">{t('qty')}</span>
        <span className="text-right">{t('ledCol')}</span>
      </div>
      <ul className="divide-y divide-line">
        {plans.map((pl) => {
          const { room, preset: p } = pl;
          const Icon = ROOM_ICON[room.type];
          const product = products[pl.fixture];
          const total = pl.qty * pl.mult;
          return (
            <li key={room.id} className={`grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:px-5 lg:items-center ${COLS}`}>
              {/* Space */}
              <div className="col-span-2 flex items-center gap-3 lg:col-span-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-bold text-ink">{labels[room.id]}</div>
                  <div className="text-[12px] text-muted">
                    {n(room.area)} m²{!p.outdoor && ` · ${n(room.height, 1)} m`}
                    {pl.mult > 1 && (
                      <Badge tone="brand" className="ml-2 px-2! py-0.5!">
                        × {pl.mult}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* Light */}
              <div className="text-[13px]">
                <div className="inline-flex items-center gap-1.5 font-semibold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: `rgb(${LIGHT_RGB[room.cct]})` }} />
                  {pl.fixture === P.wall24 ? t(room.cct === 'warm' ? 'cctWarm' : room.cct === 'neutral' ? 'cctNeutral' : 'cctCool') : KELVIN[room.cct]}
                </div>
                <div className="text-[12px] text-muted">
                  {t('target')} {p.luxCalc} lx
                </div>
              </div>
              {/* Working */}
              <div className="text-[13px]">
                {pl.lumens != null ? (
                  <>
                    <div className="font-semibold tabular-nums text-ink">{t('needLm', { lm: n(Math.round(pl.lumens / 10) * 10) })}</div>
                    <div className="text-[11.5px] tabular-nums text-muted">{t('formula', { lux: p.luxCalc, area: n(room.area), uf: n(pl.uf, 2) })}</div>
                  </>
                ) : (
                  <div className="font-semibold text-ink">{t('yardRule', { m: room.spacing })}</div>
                )}
              </div>
              {/* Fixture */}
              <div className="col-span-2 flex items-center gap-3 lg:col-span-1">
                <AdImage src={product?.images[0]} small alt="" className="h-12 w-12 shrink-0 rounded-lg ring-1 ring-line" />
                <div className="min-w-0">
                  {product ? (
                    <Link to={`/proizvod/${product.slug}`} className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-brand-700">
                      {l(product.name)}
                    </Link>
                  ) : (
                    <span className="text-[13px] text-muted">—</span>
                  )}
                  {pl.perFixtureLm && <div className="text-[11.5px] tabular-nums text-muted">{t('perFix', { lm: n(pl.perFixtureLm) })}</div>}
                </div>
              </div>
              {/* Qty */}
              <div className="text-[13px] lg:text-right">
                <div className="font-display text-[20px] font-extrabold tabular-nums leading-none text-ink">{n(total)}</div>
                <div className="mt-1 text-[11.5px] tabular-nums text-muted">{pl.mult > 1 ? `${n(pl.qty)} × ${pl.mult}` : t('unitKom')}</div>
              </div>
              {/* LED */}
              <div className="text-right text-[13px] lg:text-right">
                {pl.stripM ? (
                  <>
                    <div className="font-semibold tabular-nums text-ink">{n(pl.stripM * pl.mult)} m</div>
                    <div className="text-[11.5px] text-muted">{room.strip === 'rgb' ? 'RGB' : room.strip === '3000k' ? '3000K' : '6500K COB'}</div>
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
