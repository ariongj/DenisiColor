import { useMemo, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowRight, ArrowUpRight, Award, Check, ChevronLeft, ChevronRight, Clock, Copy, Hammer, Home as HomeIcon, Leaf, Phone,
  Ruler, ShieldCheck, Sparkles, Star, Truck, Wrench, MessageCircle, Lightbulb, Zap, Flame, Package, Building2, Paintbrush, HardHat, Tag,
} from 'lucide-react';
import type { HomeSection, Product } from '@/lib/types';
import { Accent, Accordion, Img, Reveal, useCountdown } from '@/components/ui/misc';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/brand/Social';
import { Stripes } from '@/site/components/Stripes';
import { AdImage } from '@/site/components/AdImage';
import { waHref } from '@/site/components/quote';
import { SectionHeading } from '@/site/components/SectionHeading';
import { ProductCard } from '@/site/components/ProductCard';
import { MeasureForm } from '@/site/components/MeasureForm';
import { defineDict, useDict, useL, useLang } from '@/i18n';
import { site } from '@/i18n/site';
import { common } from '@/i18n/common';
import { useDb } from '@/store/db';
import { useActiveProducts, useCategories, useSettings } from '@/store/hooks';
import { isOnSale } from '@/lib/pricing';
import { siteDate } from '@/site/components/dates';
import { cn } from '@/lib/utils';

type DataOf<T extends HomeSection['type']> = Extract<HomeSection, { type: T }>['data'];

const H = defineDict({
  me: {
    days: 'dana',
    hours: 'sati',
    minutes: 'min',
    seconds: 'sek',
    endsIn: 'Akcija ističe za',
    useCode: 'Kod za dodatni popust',
    copied: 'Kod je kopiran',
    allProducts: 'Svi proizvodi',
    productsCount: '{n} proizvoda',
    tab_bestsellers: 'Najprodavanije',
    tab_sale: 'Na akciji',
    tab_new: 'Novo',
    tab_manual: 'Izdvojeno',
    allProjects: 'Sve realizacije',
    readMore: 'Pročitaj',
    minRead: '{n} min čitanja',
    allPosts: 'Svi saveti',
    helpTitle: 'Niste pronašli odgovor?',
    helpText: 'Pozovite nas ili pišite na WhatsApp — odgovaramo u toku radnog vremena.',
    follow: 'Zapratite nas',
    benefit1: 'Odgovor u toku radnog vremena',
    benefit2: 'Ponude za firme i izvođače',
    benefit3: 'Dostava širom Kosova',
    learnMore: 'Kako radimo',
    paintsTitle: 'Boje, lakovi i fasade',
    paintsText: 'Pitajte nas za nijanse, količine i cene.',
    askOffer: 'Zatražite ponudu',
    followFb: 'Pratite nas na Facebook-u',
    priced: 'Sa cenom',
    step: 'Korak',
  },
  sq: {
    days: 'ditë',
    hours: 'orë',
    minutes: 'min',
    seconds: 'sek',
    endsIn: 'Oferta përfundon për',
    useCode: 'Kodi për zbritje shtesë',
    copied: 'Kodi u kopjua',
    allProducts: 'Të gjitha produktet',
    productsCount: '{n} produkte',
    tab_bestsellers: 'Më të shiturat',
    tab_sale: 'Në ofertë',
    tab_new: 'Të reja',
    tab_manual: 'Të veçuara',
    allProjects: 'Të gjitha realizimet',
    readMore: 'Lexo',
    minRead: '{n} min lexim',
    allPosts: 'Të gjitha këshillat',
    helpTitle: 'Nuk e gjetët përgjigjen?',
    helpText: 'Na telefononi ose na shkruani në WhatsApp — përgjigjemi gjatë orarit të punës.',
    follow: 'Na ndiqni',
    benefit1: 'Përgjigje gjatë orarit të punës',
    benefit2: 'Oferta për kompani dhe kontraktorë',
    benefit3: 'Dërgesë në të gjithë Kosovën',
    learnMore: 'Si punojmë',
    paintsTitle: 'Ngjyra, llaqe dhe fasada',
    paintsText: 'Na pyesni për nuancat, sasitë dhe çmimet.',
    askOffer: 'Kërko ofertë',
    followFb: 'Na ndiqni në Facebook',
    priced: 'Me çmim',
    step: 'Hapi',
  },
  en: {
    days: 'days',
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
    endsIn: 'Sale ends in',
    useCode: 'Code for an extra discount',
    copied: 'Code copied',
    allProducts: 'All products',
    productsCount: '{n} products',
    tab_bestsellers: 'Bestsellers',
    tab_sale: 'On sale',
    tab_new: 'New in',
    tab_manual: 'Featured',
    allProjects: 'All projects',
    readMore: 'Read',
    minRead: '{n} min read',
    allPosts: 'All advice',
    helpTitle: 'Didn’t find your answer?',
    helpText: 'Call us or message us on WhatsApp — we reply during opening hours.',
    follow: 'Follow us',
    benefit1: 'A reply during opening hours',
    benefit2: 'Offers for companies and contractors',
    benefit3: 'Delivery across Kosovo',
    learnMore: 'How we work',
    paintsTitle: 'Paints, varnishes & facades',
    paintsText: 'Ask us about shades, quantities and prices.',
    askOffer: 'Request an offer',
    followFb: 'Follow us on Facebook',
    priced: 'Priced',
    step: 'Step',
  },
});

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Ruler, Hammer, ShieldCheck, Truck, Clock, Award, Sparkles, Leaf, Wrench, Home: HomeIcon, Star, Phone,
  MessageCircle, Lightbulb, Zap, Flame, Package, Building2, Paintbrush, HardHat, Tag,
};

/* ------------------------------------------------------------------ */
export function TrustSection({ data, overlap }: { data: DataOf<'trust'>; overlap: boolean }) {
  const l = useL();
  return (
    <section className={cn('relative z-10', overlap ? '-mt-[64px]' : 'pt-14')}>
      <div className="container-x">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-line shadow-[0_30px_70px_-35px_rgba(19,36,59,0.45)] ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? Sparkles;
            return (
              <div key={i} className="flex items-start gap-4 bg-white px-5 py-5 sm:px-6 sm:py-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[15px] font-bold text-ink">{l(it.title)}</div>
                  <div className="mt-0.5 text-[13.5px] leading-snug text-muted">{l(it.text)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function CategoriesSection({ data }: { data: DataOf<'categories'> }) {
  const l = useL();
  const h = useDict(H);
  const cats = useCategories();
  const products = useActiveProducts();
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={l(data.eyebrow)}
            title={l(data.title)}
            subtitle={l(data.subtitle)}
            action={
              <ButtonLink to="/proizvodi" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                {h('allProducts')}
              </ButtonLink>
            }
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {cats.map((c, i) => {
            const n = products.filter((p) => p.categoryId === c.id).length;
            return (
              <Reveal key={c.id} delay={(i % 4) * 70}>
                <Link to={`/proizvodi/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(19,36,59,0.45)]">
                  {/* Square ad crops: shown whole, never covered with text */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Img src={c.image} small alt={l(c.name)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]" />
                    <span className="absolute left-3 top-3 rounded-md bg-brand-900/85 px-2 py-0.5 text-[10.5px] font-extrabold tracking-[0.16em] text-white backdrop-blur">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="relative flex flex-1 items-end justify-between gap-3 border-t-[3px] border-brand-600 p-4 transition-colors group-hover:border-amber-400 sm:p-5">
                    <div className="min-w-0">
                      <h3 className="font-display text-[17px] font-extrabold leading-tight text-ink sm:text-xl">{l(c.name)}</h3>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted sm:text-[13.5px]">{l(c.tagline)}</p>
                      <p className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-600">{h('productsCount', { n })}</p>
                    </div>
                    <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:grid">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
          {/* Paints & facades: part of the business, no SKUs online → enquiry tile */}
          <Reveal delay={(cats.length % 4) * 70}>
            <Link to="/faqe/ngjyra-fasada" className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl bg-brand-900 p-4 text-white sm:p-5">
              <Img src="/images/misc/ngjyra.webp" small alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/55 to-brand-900/5" />
              <div className="relative">
                <span className="inline-block rounded-md bg-amber-400 px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-brand-900">{h('askOffer')}</span>
                <h3 className="mt-2 font-display text-[17px] font-extrabold leading-tight sm:text-xl">{h('paintsTitle')}</h3>
                <p className="mt-1 text-[12.5px] leading-snug text-white/75 sm:text-[13.5px]">{h('paintsText')}</p>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
type FeatMode = DataOf<'featured'>['mode'];

function pickProducts(products: Product[], mode: FeatMode, ids: string[]) {
  switch (mode) {
    case 'sale':
      return products.filter(isOnSale).sort((a, b) => b.sold - a.sold);
    case 'new':
      return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'manual':
      return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
    default:
      return [...products].sort((a, b) => b.sold - a.sold);
  }
}

export function Scroller({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useDict(common);
  const by = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className={cn('relative', className)}>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:gap-6 lg:px-0">
        {children}
      </div>
      <div className="pointer-events-none absolute -top-[76px] right-0 hidden gap-2 lg:flex">
        <button onClick={() => by(-1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-ink hover:bg-ink hover:text-white" aria-label={tc('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => by(1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-ink hover:bg-ink hover:text-white" aria-label={tc('next')}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function FeaturedSection({ data }: { data: DataOf<'featured'> }) {
  const l = useL();
  const h = useDict(H);
  const products = useActiveProducts();
  const [mode, setMode] = useState<FeatMode>(data.mode);
  // Only tabs that have products (Denisi rarely runs sales → no empty "On sale" tab)
  const tabs = useMemo(
    () => (data.mode === 'manual' ? (['manual', 'bestsellers', 'sale', 'new'] as FeatMode[]) : (['bestsellers', 'sale', 'new'] as FeatMode[])).filter((m) => m === data.mode || pickProducts(products, m, data.productIds).length > 0),
    [data.mode, data.productIds, products],
  );
  const list = useMemo(() => pickProducts(products, mode, data.productIds).slice(0, 10), [products, mode, data.productIds]);
  return (
    <section className="pb-24 sm:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow mb-3">{l(data.eyebrow)}</div>
              <h2 className="display text-[34px] leading-[1.05] sm:text-5xl">
                <Accent text={l(data.title)} />
              </h2>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className={cn('flex gap-1 rounded-full bg-white p-1 ring-1 ring-line', tabs.length < 2 && 'hidden')}>
              {tabs.map((m) => (
                <button key={m} onClick={() => setMode(m)} className={cn('rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors', mode === m ? 'bg-brand-600 text-white' : 'text-ink-soft hover:text-ink')}>
                  {h(`tab_${m}`)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Scroller className={tabs.length < 2 ? 'mt-10 lg:mt-24' : 'mt-8 lg:mt-24'}>
          {list.map((p, i) => (
            <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-72px)/4)]">
              <ProductCard product={p} priority={i < 4} />
            </div>
          ))}
        </Scroller>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function PromoSection({ data }: { data: DataOf<'promo'> }) {
  const l = useL();
  const h = useDict(H);
  const cd = useCountdown(data.endsAt);
  const countdown = !!data.endsAt && !Number.isNaN(new Date(data.endsAt).getTime()) && !cd.done;
  const cells: [number, string][] = [
    [cd.days, h('days')],
    [cd.hours, h('hours')],
    [cd.minutes, h('minutes')],
    [cd.seconds, h('seconds')],
  ];
  const href = data.cta.href.trim() || '/proizvodi';
  const external = /^(?:https?:|mailto:|tel:)/i.test(href);
  return (
    <section className="pb-24 sm:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-[28px] bg-brand-900 lg:grid-cols-2">
            <div className="bg-stripes pointer-events-none absolute inset-0" />
            {/* Product ads are square → framed, not stretched */}
            <div className="relative grid place-items-center p-6 sm:p-10 lg:order-2 lg:p-12">
              <Stripes className="absolute -right-8 top-0 h-full w-72 opacity-90" />
              <div className="relative w-full max-w-[420px] -rotate-2 overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.7)]">
                <AdImage src={data.image} className="aspect-square w-full rounded-[16px]" />
              </div>
            </div>
            <div className="relative flex flex-col justify-center p-8 pt-2 sm:p-12 lg:p-16">
              <div className="eyebrow text-amber-400">{l(data.eyebrow)}</div>
              <h2 className="display mt-4 text-[36px] leading-[1.04] text-white sm:text-[50px]">
                <Accent text={l(data.title)} accentClassName="text-amber-400!" />
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-paper/70">{l(data.text)}</p>
              {countdown && (
                <div className="mt-8">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-paper/45">{h('endsIn')}</div>
                  <div className="mt-3 flex gap-2 sm:gap-3">
                    {cells.map(([v, label]) => (
                      <div key={label} className="w-[68px] rounded-2xl bg-white/[0.07] py-3 text-center ring-1 ring-white/10 sm:w-20">
                        <div className="display text-3xl tabular-nums text-white sm:text-4xl">{String(v).padStart(2, '0')}</div>
                        <div className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-paper/45">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {external ? (
                  <a href={href} target="_blank" rel="noreferrer" className={buttonClass({ size: 'lg', className: 'bg-amber-400! text-brand-900! hover:bg-amber-300!' })}>
                    {/wa\.me/.test(href) && <WhatsAppIcon className="h-[18px] w-[18px]" />}
                    {l(data.cta.label)} <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link to={href} className={buttonClass({ size: 'lg', className: 'bg-amber-400! text-brand-900! hover:bg-amber-300!' })}>
                    {l(data.cta.label)} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {data.code && (
                  <button
                    onClick={() => {
                      void navigator.clipboard?.writeText(data.code);
                      toast.success(h('copied'), { description: data.code });
                    }}
                    className="group inline-flex h-13 items-center gap-3 rounded-full border border-dashed border-white/35 px-5 text-left text-white transition hover:border-white"
                    title={h('useCode')}
                  >
                    <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-paper/55">{h('useCode')}</span>
                    <span className="font-mono text-[15px] font-bold tracking-wider">{data.code}</span>
                    <Copy className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function ProcessSection({ data }: { data: DataOf<'process'> }) {
  const l = useL();
  const h = useDict(H);
  return (
    <section className="bg-sand/60 py-24 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow={l(data.eyebrow)} title={l(data.title)} align="center" />
        </Reveal>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="pointer-events-none absolute left-0 right-0 top-[27px] hidden border-t border-dashed border-ink/20 lg:block" />
          {data.steps.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 110} className="relative">
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-paper text-brand-700 ring-1 ring-line">
                <span className="display text-xl">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                {h('step')} {i + 1}
              </div>
              <h3 className="mt-2 text-xl font-bold text-ink">{l(s.title)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{l(s.text)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function ServicesSection({ data }: { data: DataOf<'services'> }) {
  const l = useL();
  const h = useDict(H);
  const [active, setActive] = useState(0);
  const items = data.items;
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={l(data.eyebrow)}
            title={l(data.title)}
            subtitle={l(data.subtitle)}
            action={
              <ButtonLink to="/usluge" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                {h('learnMore')}
              </ButtonLink>
            }
          />
        </Reveal>

        {/* Desktop: hover list with image reveal */}
        <div className="mt-14 hidden gap-12 lg:grid lg:grid-cols-[1.05fr_1fr]">
          <ul className="border-t border-line">
            {items.map((it, i) => (
              <li key={i}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-start gap-6 border-b border-line py-7 text-left"
                >
                  <span className={cn('display mt-1 w-10 text-lg tabular-nums transition-colors', active === i ? 'text-brand-600' : 'text-muted/60')}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">
                    <span className={cn('display block text-[30px] leading-tight transition-colors', active === i ? 'text-ink' : 'text-ink/45 group-hover:text-ink/75')}>{l(it.title)}</span>
                    <span className={cn('grid transition-all duration-500', active === i ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                      <span className="overflow-hidden text-[15px] leading-relaxed text-muted">{l(it.text)}</span>
                    </span>
                  </span>
                  <ArrowUpRight className={cn('mt-2 h-6 w-6 transition-all', active === i ? 'text-brand-600' : 'text-ink/25')} />
                </button>
              </li>
            ))}
          </ul>
          <div className="relative">
            <div className="sticky top-28 aspect-square overflow-hidden rounded-[28px] bg-white ring-1 ring-line">
              {items.map((it, i) => (
                <Img key={i} src={it.image} alt={l(it.title)} className={cn('absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700', active === i ? 'scale-100 opacity-100!' : 'scale-105 opacity-0!')} />
              ))}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur-md">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
                <div className="mt-1 font-semibold text-ink">{l(items[active]?.title)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet: cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:hidden">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 2) * 80} className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              <div className="aspect-square overflow-hidden bg-white">
                <Img src={it.image} small alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="display text-sm text-brand-600">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-1 text-lg font-bold">{l(it.title)}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{l(it.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/** Denisi Color has no project gallery (the /projekti route redirects) — the section renders nothing. */
export function ProjectsSection(_props: { data: DataOf<'projects'> }) {
  return null;
}

/* ------------------------------------------------------------------ */
export function StatsSection({ data }: { data: DataOf<'stats'> }) {
  const l = useL();
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="aspect-square overflow-hidden rounded-[28px] bg-white ring-1 ring-line">
            <Img src={data.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 left-6 right-6 rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(19,36,59,0.45)] ring-1 ring-line sm:left-auto sm:right-[-24px] sm:w-[380px]">
            <MessageCircle className="h-6 w-6 text-brand-600" />
            <p className="display mt-3 text-[22px] leading-snug text-ink">„{l(data.quote)}“</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-10 lg:pt-0">
          {data.items.map((s, i) => (
            <Reveal key={i} delay={i * 90} className="border-t border-ink/15 pt-6">
              <div className="display text-[56px] leading-none text-ink sm:text-7xl">{s.value}</div>
              <p className="mt-3 max-w-[16ch] text-[15px] leading-snug text-muted">{l(s.label)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function BlogSection({ data }: { data: DataOf<'blog'> }) {
  const l = useL();
  const lang = useLang();
  const h = useDict(H);
  const all = useDb((s) => s.posts);
  const posts = useMemo(() => all.filter((p) => p.published).slice(0, 3), [all]);
  if (!posts.length) return null;
  return (
    <section className="bg-sand/50 py-24 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={l(data.eyebrow)}
            title={l(data.title)}
            action={
              <ButtonLink to="/savjeti" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                {h('allPosts')}
              </ButtonLink>
            }
          />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Link to={`/savjeti/${p.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
                  <AdImage src={p.cover} small className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-center gap-3 text-[12px] font-semibold text-muted">
                  <span className="rounded-full bg-white px-2.5 py-1 text-ink ring-1 ring-line">{l(p.tag)}</span>
                  <span>{siteDate(p.publishedAt, lang, { short: true })}</span>
                  <span>·</span>
                  <span>{h('minRead', { n: p.readMinutes })}</span>
                </div>
                <h3 className="display mt-3 text-[26px] leading-tight text-ink group-hover:text-brand-700">{l(p.title)}</h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{l(p.excerpt)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {h('readMore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function FaqSection({ data }: { data: DataOf<'faq'> }) {
  const l = useL();
  const h = useDict(H);
  const t = useDict(site);
  const settings = useSettings();
  return (
    <section className="py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow={l(data.eyebrow)} title={l(data.title)} />
          <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-line">
            <h3 className="text-lg font-bold">{h('helpTitle')}</h3>
            <p className="mt-1.5 text-[15px] text-muted">{h('helpText')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
              {settings.whatsapp && (
                <a href={waHref(settings, t('waGeneral'))} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1f9d55] px-5 text-sm font-semibold text-white hover:bg-[#178246]">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              )}
              <ButtonLink to="/kontakt" variant="outline">
                {t('nav_contact')}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Accordion items={data.items.map((it) => ({ title: l(it.q), content: l(it.a) }))} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function InstagramSection({ data }: { data: DataOf<'instagram'> }) {
  const l = useL();
  const h = useDict(H);
  const settings = useSettings();
  // Instagram when the shop has one, otherwise their Facebook page (Denisi Color is on Facebook only)
  const ig = settings.instagram.trim();
  const url = ig ? `https://www.instagram.com/${ig}/` : settings.facebook?.trim() ?? '';
  const images = data.images.filter(Boolean);
  if (!url || !images.length) return null;
  const Icon = ig ? InstagramIcon : FacebookIcon;
  return (
    <section className="pb-24 sm:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <a href={url} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-2">
                <Icon className="h-4 w-4" /> {ig ? `@${ig}` : settings.companyName}
              </a>
              <h2 className="display mt-3 text-[34px] leading-tight sm:text-[44px]">{l(data.title)}</h2>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 sm:self-auto',
                ig ? 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]' : 'bg-[#1877f2]',
              )}
            >
              <Icon className="h-4 w-4" /> {ig ? h('follow') : h('followFb')}
            </a>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {images.map((src, i) => (
            <Reveal key={i} delay={i * 60}>
              <a href={url} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                <Img src={src} small alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-brand-900/0 text-white opacity-0 transition group-hover:bg-brand-900/40 group-hover:opacity-100">
                  <Icon className="h-7 w-7" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function CtaSection({ data }: { data: DataOf<'cta'> }) {
  const l = useL();
  const h = useDict(H);
  return (
    <section id="kerkesa" className="scroll-mt-28 pb-8">
      {/* Old in-page anchor (#mjerenje) kept working for links saved in the CMS */}
      <span id="mjerenje" className="block scroll-mt-28" />
      <div className="container-x">
        <Reveal>
          <div className="grid gap-4 rounded-[32px] bg-sand/80 p-3 sm:p-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[24px] bg-brand-900">
              <Img src={data.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
              <div className="bg-stripes absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-brand-900/30" />
              <Stripes className="absolute -right-6 top-0 h-40 w-56" />
              <div className="relative flex h-full flex-col justify-end p-7 sm:p-10">
                <div className="eyebrow text-amber-400">{l(data.eyebrow)}</div>
                <h2 className="display mt-3 text-[34px] leading-[1.04] text-white sm:text-5xl">
                  <Accent text={l(data.title)} accentClassName="text-amber-400!" />
                </h2>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-paper/75">{l(data.text)}</p>
                <ul className="mt-6 space-y-2.5">
                  {[h('benefit1'), h('benefit2'), h('benefit3')].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] font-medium text-white">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-brand-900">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <MeasureForm type="quote" className="shadow-none ring-0 lg:p-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
