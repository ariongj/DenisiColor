import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowRight, Building2, Check, ClipboardList, Lightbulb, MessageCircle, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Accent, QtyStepper } from '@/components/ui/misc';
import { PageHero } from '@/site/components/SectionHeading';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { useDict, useLang } from '@/i18n';
import { num } from '@/lib/format';
import { uid } from '@/lib/utils';
import { LT, type LtKey } from '@/site/components/light/dict';
import { DEFAULT_HOUSING, P, PRESETS, buildLines, newRoom, planRoom, type Housing, type Room, type RoomType } from '@/site/components/light/model';
import { ROOM_ICON, StepHead, roomLabels, useLightProducts } from '@/site/components/light/parts';
import { RoomCard } from '@/site/components/light/RoomCard';
import { Recommendation } from '@/site/components/light/Recommendation';
import { ListPanel } from '@/site/components/light/ListPanel';
import { HowWeEstimate, IpExplainer } from '@/site/components/light/Info';

// "Sa drita më duhen?" (route /ndricimi): rooms → lux/lumen estimate → the shop's own LED range →
// one click into the quote list. The plan is kept in this browser only (per-visitor convenience).

const STORE_KEY = 'denisi-light-plan';

interface Saved {
  rooms: Room[];
  units: number;
  housing: Housing;
  overrides: Record<string, number>;
}

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const s = raw ? (JSON.parse(raw) as Saved) : null;
    return s && Array.isArray(s.rooms) && s.rooms.every((r) => PRESETS.some((p) => p.type === r.type)) ? s : null;
  } catch {
    return null;
  }
}

const EXAMPLE: [RoomType, number][] = [
  ['living', 22],
  ['kitchen', 10],
  ['bedroom', 14],
  ['bedroom', 11],
  ['bathroom', 5],
  ['corridor', 7],
];

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function LightPlanner() {
  const t = useDict(LT);
  const lang = useLang();
  usePageTitle(t('pageTitle'));
  const products = useLightProducts();

  const [saved] = useState(load);
  const [rooms, setRooms] = useState<Room[]>(saved?.rooms ?? []);
  const [units, setUnits] = useState(saved?.units ?? 1);
  const [housing, setHousing] = useState<Housing>(saved?.housing ?? DEFAULT_HOUSING);
  const [overrides, setOverrides] = useState<Record<string, number>>(saved?.overrides ?? {});
  const lastAdded = useRef<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ rooms, units, housing, overrides }));
    } catch {
      /* private mode — the plan simply isn't remembered */
    }
  }, [rooms, units, housing, overrides]);

  // Bring a freshly added room into view (the preset chips sit above the list)
  useEffect(() => {
    const id = lastAdded.current;
    if (!id) return;
    lastAdded.current = null;
    const el = document.getElementById(`room-${id}`);
    if (el && el.getBoundingClientRect().bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [rooms]);

  const plans = useMemo(() => rooms.map((r) => planRoom(r, units)), [rooms, units]);
  const labels = useMemo(() => roomLabels(rooms, t), [rooms, t]);
  const autoLines = useMemo(() => buildLines(plans, housing), [plans, housing]);
  const autoQty = useMemo(() => Object.fromEntries(autoLines.map((x) => [x.key, x.qty])), [autoLines]);
  const lines = useMemo(() => autoLines.map((x) => ({ ...x, qty: overrides[x.key] ?? x.qty })), [autoLines, overrides]);
  const fixtures = lines.filter((x) => x.unit === 'kom' && products[x.productId]).reduce((s, x) => s + x.qty, 0);
  const ledM = lines.filter((x) => x.productId === P.strip).reduce((s, x) => s + x.qty, 0);

  const addRoom = (type: RoomType, area?: number) => {
    const r = newRoom(type, uid('r'));
    if (area) r.area = area;
    lastAdded.current = r.id;
    setRooms((rs) => [...rs, r]);
  };
  const patchRoom = (id: string, patch: Partial<Room>) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const duplicate = (id: string) =>
    setRooms((rs) => {
      const i = rs.findIndex((r) => r.id === id);
      if (i < 0) return rs;
      const copy = { ...rs[i], id: uid('r') };
      lastAdded.current = copy.id;
      return [...rs.slice(0, i + 1), copy, ...rs.slice(i + 1)];
    });
  const remove = (id: string) => setRooms((rs) => rs.filter((r) => r.id !== id));
  const loadExample = () => {
    const rs = EXAMPLE.map(([type, area]) => ({ ...newRoom(type, uid('r')), area }));
    setRooms(rs);
    setOverrides({});
    lastAdded.current = rs[rs.length - 1].id;
  };
  const clearAll = () => {
    setRooms([]);
    setUnits(1);
    setOverrides({});
  };

  const steps: { n: number; key: LtKey; id: string }[] = [
    { n: 1, key: 'step1', id: 'dhomat' },
    { n: 2, key: 'step2', id: 'rekomandimi' },
    { n: 3, key: 'step3', id: 'lista' },
  ];
  const heroImage = products[P.ceiling36]?.images[0] ?? '/images/hero/navy.webp';

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} image={heroImage} crumbs={[{ label: t('crumbLight'), to: '/proizvodi/ndricim' }, { label: t('pageTitle') }]}>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button size="lg" iconRight={<ArrowDown className="h-[18px] w-[18px]" />} onClick={() => scrollToId('dhomat')} className="bg-amber-400! text-brand-900! hover:bg-amber-300!">
            {t('heroStart')}
          </Button>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-paper/80">
            {(['heroF1', 'heroF2', 'heroF3'] as const).map((k) => (
              <li key={k} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-amber-400" />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>
      </PageHero>

      {/* Step flow */}
      <nav aria-label={t('eyebrow')} className="border-b border-line bg-white">
        <ol className="container-x no-scrollbar flex items-center gap-2 overflow-x-auto py-3 sm:gap-3">
          {steps.map((s, i) => (
            <li key={s.n} className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => scrollToId(s.id)} className="group inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 font-display text-[12px] font-extrabold text-white">{s.n}</span>
                {t(s.key)}
              </button>
              {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-line" />}
            </li>
          ))}
        </ol>
      </nav>

      <div className="bg-paper">
        <div className="container-x grid gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0 space-y-14">
            {/* 1 — Rooms */}
            <section id="dhomat" className="scroll-mt-28">
              <StepHead n={1} eyebrow={t('step1')} title={<Accent text={t('roomsTitle')} />}>
                {rooms.length > 0 && (
                  <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={clearAll}>
                    {t('clear')}
                  </Button>
                )}
              </StepHead>
              <p className="mt-3 max-w-2xl text-[15px] text-muted sm:pl-15">{t('roomsText')}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const Icon = ROOM_ICON[p.type];
                  return (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => addRoom(p.type)}
                      className="group inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white pl-2 pr-3.5 text-[13px] font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_10px_22px_-16px_rgb(19_36_59/0.5)] active:translate-y-0"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {t(`t_${p.type}` as LtKey)}
                      <Plus className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand-600" />
                    </button>
                  );
                })}
              </div>

              {rooms.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-12 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <Lightbulb className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{t('emptyTitle')}</h3>
                  <p className="mt-1.5 max-w-sm text-[14px] text-muted">{t('emptyText')}</p>
                  <Button variant="soft" className="mt-5" icon={<Sparkles className="h-4 w-4" />} onClick={loadExample}>
                    {t('example')}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-brand-900 p-4 text-white sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                    <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-400 sm:grid">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="font-display text-[15px] font-bold">{t('unitsTitle')}</div>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-paper/70">{t('unitsText')}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-lg font-extrabold text-amber-400">×</span>
                      <QtyStepper value={units} onChange={setUnits} min={1} max={500} className="text-ink" />
                      <span className="text-[13px] font-semibold text-paper/80">{t('unitsLabel')}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <AnimatePresence initial={false}>
                      {plans.map((pl) => (
                        <motion.div
                          key={pl.room.id}
                          id={`room-${pl.room.id}`}
                          layout
                          initial={{ opacity: 0, y: 14, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <RoomCard plan={pl} label={labels[pl.room.id]} onChange={(patch) => patchRoom(pl.room.id, patch)} onDuplicate={() => duplicate(pl.room.id)} onRemove={() => remove(pl.room.id)} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </section>

            {/* 2 — Recommendation */}
            <section id="rekomandimi" className="scroll-mt-28">
              <StepHead n={2} eyebrow={t('step2')} title={<Accent text={t('recTitle')} />} />
              <div className="mt-6 space-y-4">
                {plans.length > 0 && <Recommendation plans={plans} labels={labels} />}
                <HowWeEstimate />
              </div>
            </section>
          </div>

          {/* 3 — List (sticky on desktop) */}
          <aside id="lista" className="scroll-mt-28 lg:sticky lg:top-[100px] lg:self-start">
            <ListPanel
              lines={lines}
              autoQty={autoQty}
              plans={plans}
              labels={labels}
              units={units}
              housing={housing}
              onQty={(key, qty) => setOverrides((o) => ({ ...o, [key]: qty }))}
              onReset={(key) =>
                setOverrides((o) => {
                  const { [key]: _drop, ...rest } = o;
                  void _drop;
                  return rest;
                })
              }
              onHousing={(productId, v) => setHousing((h) => ({ ...h, [productId]: v }))}
            />
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-[13px] leading-snug text-ink-soft">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <p>
                {t('ask')}{' '}
                <Link to="/kontakt" className="font-semibold text-brand-700 hover:underline">
                  {t('contact')} →
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </div>

      <IpExplainer />

      {/* Mobile: quick jump to the list */}
      {rooms.length > 0 && (
        <div className="fixed inset-x-0 bottom-3 z-30 flex justify-end pl-16 pr-3 lg:hidden">
          <button
            type="button"
            onClick={() => scrollToId('lista')}
            className="flex w-full max-w-sm items-center gap-3 rounded-full bg-brand-900 py-2 pl-4 pr-2 text-left text-white shadow-[0_18px_40px_-14px_rgb(5_14_28/0.7)] ring-1 ring-white/10"
          >
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
              {num(fixtures, lang)} {t('totFixtures')}
              {ledM > 0 && <span className="text-paper/70"> · {num(ledM, lang)} {t('totLed')}</span>}
            </span>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-400 px-4 text-[13px] font-bold text-brand-900">
              <ClipboardList className="h-4 w-4" />
              {t('mobileBar')}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
