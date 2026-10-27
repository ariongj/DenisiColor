// "Provo ngjyrën" — interactive colour studio. Paint a facade or a living room with the curated fan-deck,
// compare with the bare state, keep favourites and send the combination to the shop as an enquiry.
// No paint SKUs or prices: the shop answers with products and a price (honesty rules).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Bookmark, Building2, Columns2, Home, Info, RotateCcw, Sofa, Trash2, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/brand/Social';
import { PageHero } from '@/site/components/SectionHeading';
import { waHref } from '@/site/components/quote';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { useDict, useL, useLang } from '@/i18n';
import { useSettings } from '@/store/hooks';
import { cn } from '@/lib/utils';
import { CS } from '@/site/components/color/dict';
import { FacadeScene } from '@/site/components/color/FacadeScene';
import { InteriorScene } from '@/site/components/color/InteriorScene';
import { PalettePanel } from '@/site/components/color/Palette';
import { CompareSlider } from '@/site/components/color/CompareSlider';
import { EnquiryModal, useColorLines, useWhatsAppText } from '@/site/components/color/EnquiryModal';
import { DEFAULT_SCHEME, EXISTING, SCHEMES, SURFACES, SWATCHES, inkOn, paintName, type Paint, type Paints, type SceneId } from '@/site/components/color/palette';

interface Fav {
  id: string;
  scene: SceneId;
  paints: Paints;
  at: string;
}

const FAV_KEY = 'denisi-color-studio';
const MAX_FAVS = 3;

function loadFavs(): Fav[] {
  try {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((f) => f && (f.scene === 'facade' || f.scene === 'interior') && f.paints).slice(0, MAX_FAVS) : [];
  } catch {
    return [];
  }
}
function storeFavs(list: Fav[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch {
    /* private mode / storage full — favourites just won't persist */
  }
}

/** Phone-width check for the tighter facade framing. */
function useIsPhone() {
  const q = '(max-width: 639px)';
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return m;
}

const samePaints = (a: Paints, b: Paints) => Object.keys(b).every((k) => a[k]?.hex.toUpperCase() === b[k].hex.toUpperCase());
const clone = (p: Paints): Paints => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { ...v }]));

export default function ColorStudio() {
  const t = useDict(CS);
  const l = useL();
  const lang = useLang();
  const settings = useSettings();
  const phone = useIsPhone();
  const colorLines = useColorLines();
  const waText = useWhatsAppText();
  usePageTitle(t('title'));

  const [scene, setScene] = useState<SceneId>('facade');
  const [paints, setPaints] = useState<Record<SceneId, Paints>>(() => ({ facade: clone(DEFAULT_SCHEME.paints.facade), interior: clone(DEFAULT_SCHEME.paints.interior) }));
  const [selected, setSelected] = useState<Record<SceneId, string>>({ facade: 'walls', interior: 'walls' });
  const [history, setHistory] = useState<Record<SceneId, Paints[]>>({ facade: [], interior: [] });
  const [compare, setCompare] = useState(false);
  const [favs, setFavs] = useState<Fav[]>(loadFavs);
  const [enquiry, setEnquiry] = useState(false);
  const lastPush = useRef({ at: 0, key: '' });

  const surfaces = SURFACES[scene];
  const current = paints[scene];
  const sel = selected[scene];
  const selDef = surfaces.find((s) => s.id === sel)!;
  const labels = useMemo(() => Object.fromEntries(SURFACES[scene].map((s) => [s.id, l(s.name)])), [scene, l]);
  const activeScheme = SCHEMES.find((s) => samePaints(current, s.paints[scene]));
  const sceneName = (s: SceneId) => t(s === 'facade' ? 'sceneFacade' : 'sceneInterior');

  const pushHistory = () => setHistory((h) => ({ ...h, [scene]: [...h[scene].slice(-29), clone(current)] }));

  /** Paint the selected surface. `coalesce` merges rapid colour-picker drags into one undo step. */
  const paint = (p: Paint, coalesce?: boolean) => {
    const key = `${scene}:${sel}`;
    const now = Date.now();
    const merge = coalesce && lastPush.current.key === key && now - lastPush.current.at < 1500;
    if (!merge) pushHistory();
    lastPush.current = { at: now, key: coalesce ? key : '' };
    setPaints((ps) => ({ ...ps, [scene]: { ...ps[scene], [sel]: p } }));
  };
  const applyAll = (next: Paints) => {
    if (samePaints(current, next)) return;
    pushHistory();
    setPaints((ps) => ({ ...ps, [scene]: clone(next) }));
  };
  const undo = () => {
    const stack = history[scene];
    if (!stack.length) return;
    setPaints((ps) => ({ ...ps, [scene]: stack[stack.length - 1] }));
    setHistory((h) => ({ ...h, [scene]: stack.slice(0, -1) }));
  };

  const saveFav = () => {
    if (favs.some((f) => f.scene === scene && samePaints(f.paints, current))) {
      toast.success(t('saved'));
      return;
    }
    const replaced = favs.length >= MAX_FAVS;
    const next = [{ id: `f${Date.now().toString(36)}`, scene, paints: clone(current), at: new Date().toISOString() }, ...favs].slice(0, MAX_FAVS);
    setFavs(next);
    storeFavs(next);
    toast.success(t(replaced ? 'savedReplaced' : 'saved'));
  };
  const deleteFav = (id: string) => {
    const next = favs.filter((f) => f.id !== id);
    setFavs(next);
    storeFavs(next);
  };
  const openFav = (f: Fav) => {
    setCompare(false);
    setScene(f.scene);
    if (!samePaints(paints[f.scene], f.paints)) {
      setHistory((h) => ({ ...h, [f.scene]: [...h[f.scene].slice(-29), clone(paints[f.scene])] }));
      setPaints((ps) => ({ ...ps, [f.scene]: clone(f.paints) }));
    }
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sceneProps = { selected: sel, onSelect: (id: string) => setSelected((s) => ({ ...s, [scene]: id })), labels, compact: phone, title: t('canvas', { scene: sceneName(scene) }), className: 'block h-auto w-full' };
  const renderScene = (ps: Paints, still?: boolean) =>
    scene === 'facade' ? <FacadeScene paints={ps} still={still} {...sceneProps} /> : <InteriorScene paints={ps} still={still} {...sceneProps} />;

  const lines = colorLines(scene, current);
  const toolBtn = 'inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:pointer-events-none disabled:opacity-35 xl:px-3';

  return (
    <>
      <PageHero image="/images/misc/ngjyra.webp" eyebrow={t('eyebrow')} title={t('heroTitle')} subtitle={t('heroText')} crumbs={[{ label: t('title') }]}>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {[t('b1'), t('b2', { n: SWATCHES.length }), t('b3')].map((b) => (
            <span key={b} className="rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-semibold text-white/90 backdrop-blur-sm">
              {b}
            </span>
          ))}
          <a href="#studio" className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-amber-400 px-4 text-[13.5px] font-bold text-ink transition-colors hover:bg-amber-300">
            {t('start')}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </PageHero>

      <section id="studio" className="container-x scroll-mt-[76px] pb-12 pt-4 sm:pt-10 lg:pb-16">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-7 lg:gap-y-6">
          {/* ---------- canvas (sticky on phones so the house stays in view while picking) ---------- */}
          <div className="z-20 max-lg:sticky max-lg:top-[76px] max-lg:-mx-4 max-lg:bg-paper/95 max-lg:px-4 max-lg:pb-2 max-lg:pt-2 max-lg:backdrop-blur-md lg:col-start-1 lg:row-start-1">
            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-40px_rgb(19_36_59/0.45)] ring-1 ring-line">
              {/* toolbar */}
              <div className="flex items-center justify-between gap-2 border-b border-line px-2 py-1.5 sm:px-3 sm:py-2">
                <div className="inline-flex rounded-full bg-sand p-1" role="tablist" aria-label={t('scenes')}>
                  {(['facade', 'interior'] as SceneId[]).map((s) => {
                    const Icon = s === 'facade' ? Building2 : Sofa;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="tab"
                        aria-selected={scene === s}
                        onClick={() => setScene(s)}
                        className={cn(
                          'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold transition-all sm:px-4',
                          scene === s ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {sceneName(s)}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center">
                  <button type="button" className={toolBtn} onClick={undo} disabled={!history[scene].length} aria-label={t('undo')} title={t('undo')}>
                    <Undo2 className="h-4 w-4" />
                    <span className="hidden xl:inline">{t('undo')}</span>
                  </button>
                  <button type="button" className={toolBtn} onClick={() => applyAll(DEFAULT_SCHEME.paints[scene])} disabled={samePaints(current, DEFAULT_SCHEME.paints[scene])} aria-label={t('reset')} title={t('reset')}>
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden xl:inline">{t('reset')}</span>
                  </button>
                  <button type="button" className={cn(toolBtn, compare && 'bg-ink! text-white!')} onClick={() => setCompare((c) => !c)} aria-pressed={compare} aria-label={compare ? t('compareOff') : t('compare')} title={compare ? t('compareOff') : t('compare')}>
                    <Columns2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('compare')}</span>
                  </button>
                  <button type="button" className={toolBtn} onClick={saveFav} aria-label={t('save')} title={t('save')}>
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden xl:inline">{t('save')}</span>
                  </button>
                </div>
              </div>

              {/* scene */}
              <div key={scene} className="relative animate-fade-in bg-sand">
                {compare ? (
                  <CompareSlider before={renderScene(EXISTING[scene], true)} after={renderScene(current, true)} labelBefore={t('before')} labelAfter={t('after')} hint={t('dragHint')} />
                ) : (
                  renderScene(current)
                )}
              </div>

              {/* surfaces */}
              <div className="flex items-center gap-2 border-t border-line px-2 py-2 sm:px-3">
                <span className="hidden shrink-0 pl-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted md:block">{t('surfaces')}</span>
                <div className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto" role="radiogroup" aria-label={t('surfaces')}>
                  {surfaces.map((s) => {
                    const on = s.id === sel;
                    const p = current[s.id];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setSelected((x) => ({ ...x, [scene]: s.id }))}
                        className={cn(
                          'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border pl-1 pr-3.5 text-[13px] font-semibold transition-colors',
                          on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft hover:border-ink/30 hover:text-ink',
                        )}
                      >
                        <span className="h-7 w-7 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] transition-colors duration-500" style={{ background: p.hex }} />
                        <span className="sm:hidden">{l(s.short)}</span>
                        <span className="hidden sm:inline">{l(s.name)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-2 hidden items-center gap-1.5 text-[13px] text-muted lg:flex">
              <Info className="h-3.5 w-3.5 shrink-0" />
              {compare ? t('dragHint') : t('pickHint')}
            </p>
          </div>

          {/* ---------- palette ---------- */}
          <aside className="rounded-[22px] bg-white p-4 ring-1 ring-line sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <h2 className="display whitespace-nowrap text-[17px] text-ink sm:text-[19px]">{t('palette')}</h2>
              <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-sand/70 py-1 pl-1 pr-3 text-[12px]">
                <span className="h-5 w-5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] transition-colors duration-500" style={{ background: current[sel].hex }} />
                <span className="truncate">
                  <span className="text-muted max-sm:hidden">{t('painting')}: </span>
                  <b className="font-bold text-ink">{l(selDef.short)}</b>
                </span>
              </span>
            </div>
            <PalettePanel current={current[sel]} onPick={paint} />
          </aside>

          {/* ---------- schemes ---------- */}
          <div className="lg:col-start-1 lg:row-start-2">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="display text-[17px] text-ink sm:text-[19px]">{t('schemes')}</h2>
              <span className="text-[13px] text-muted max-sm:hidden">{t('schemesHint')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SCHEMES.map((s) => {
                const on = activeScheme?.id === s.id;
                const ps = s.paints[scene];
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => applyAll(ps)}
                    aria-pressed={on}
                    className={cn(
                      'group rounded-2xl bg-white p-2 text-left ring-1 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-22px_rgb(19_36_59/0.5)]',
                      on ? 'ring-2 ring-ink' : 'ring-line hover:ring-ink/20',
                    )}
                  >
                    <span className="flex h-14 overflow-hidden rounded-xl">
                      {SURFACES[scene].map((x, i) => (
                        <span key={x.id} className={cn('h-full', i === 0 ? 'flex-[2.2]' : 'flex-1')} style={{ background: ps[x.id].hex }} />
                      ))}
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 px-1 pb-0.5">
                      <span className="text-[13.5px] font-bold text-ink">{l(s.name)}</span>
                      {on && <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{t('active')}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------- summary + enquiry ---------- */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-7">
          <div className="relative overflow-hidden rounded-[26px] bg-brand-900 p-5 text-white sm:p-7">
            <div className="bg-stripes pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="eyebrow text-amber-400!">{sceneName(scene)}</div>
                  <h2 className="display mt-1.5 text-[28px] leading-tight sm:text-[34px]">{t('summary')}</h2>
                  <p className="mt-1 text-[14.5px] text-white/65">{t('summaryText')}</p>
                </div>
                <span className="text-[13px] font-semibold text-white/55">{t('colorsCount', { n: lines.length })}</span>
              </div>
              <div className={cn('mt-5 grid gap-2.5', lines.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')}>
                {surfaces.map((s, i) => {
                  const p = current[s.id];
                  const ink = inkOn(p.hex);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelected((x) => ({ ...x, [scene]: s.id }));
                        document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="flex min-h-[124px] flex-col justify-between rounded-2xl p-3.5 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] transition-[background,transform] duration-500 hover:-translate-y-0.5 sm:min-h-[140px]"
                      style={{ background: p.hex, color: ink }}
                    >
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-70">{lines[i].surface}</span>
                      <span>
                        <span className="block text-[15px] font-bold leading-tight">{paintName(p, lang, t('customLabel'))}</span>
                        <span className="mt-1 block font-mono text-[11.5px] opacity-70">
                          {p.code ? `${p.code} · ` : ''}
                          {p.hex.toUpperCase()}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button size="lg" className="bg-amber-400! text-ink! shadow-none! hover:bg-amber-300!" onClick={() => setEnquiry(true)} iconRight={<ArrowRight className="h-4 w-4" />}>
                  {t('quote')}
                </Button>
                <a
                  href={waHref(settings, waText(scene, current))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#1f9d55] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#178246]"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  {t('whatsapp')}
                </a>
              </div>
              <p className="mt-5 flex gap-2 text-[12.5px] leading-relaxed text-white/60">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t('fine')}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* favourites */}
            <div className="rounded-[22px] bg-white p-5 ring-1 ring-line">
              <div className="flex items-center justify-between gap-3">
                <h2 className="display text-[19px] text-ink">{t('favs')}</h2>
                <span className="text-[12px] font-semibold text-muted">
                  {favs.length}/{MAX_FAVS}
                </span>
              </div>
              {favs.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-5 text-center text-[13.5px] text-muted">{t('favsEmpty')}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {favs.map((f) => (
                    <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-sand/50 p-2">
                      <button type="button" onClick={() => openFav(f)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`${t('favOpen')}: ${sceneName(f.scene)}`}>
                        <span className="flex h-11 w-16 shrink-0 overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]">
                          {SURFACES[f.scene].map((x, i) => (
                            <span key={x.id} className={i === 0 ? 'flex-[2]' : 'flex-1'} style={{ background: f.paints[x.id]?.hex }} />
                          ))}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
                            {f.scene === 'facade' ? <Home className="h-3.5 w-3.5" /> : <Sofa className="h-3.5 w-3.5" />}
                            {sceneName(f.scene)}
                          </span>
                          <span className="block truncate text-[12px] text-muted">{paintName(f.paints.walls, lang, t('customLabel'))}</span>
                        </span>
                      </button>
                      <Button size="xs" variant="outline" onClick={() => openFav(f)}>
                        {t('favOpen')}
                      </Button>
                      <button type="button" onClick={() => deleteFav(f.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label={t('favDelete')} title={t('favDelete')}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="outline" size="sm" className="mt-3 w-full" icon={<Bookmark className="h-4 w-4" />} onClick={saveFav}>
                {t('save')}
              </Button>
            </div>

            {/* about paints (CMS page) */}
            <Link to="/faqe/ngjyra-fasada" className="group relative flex min-h-[132px] items-end overflow-hidden rounded-[22px] bg-brand-50 p-5 ring-1 ring-line">
              <img src="/images/misc/ngjyra.webp" alt="" className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-90 transition-transform duration-500 [mask-image:linear-gradient(to_right,transparent,black_45%)] group-hover:scale-105" />
              <span className="relative inline-flex items-center gap-2 text-[15px] font-bold text-ink">
                {t('more')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} scene={scene} paints={paints} />
    </>
  );
}
