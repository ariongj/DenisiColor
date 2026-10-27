// Home: the three online tools that set Denisi Color's shop apart — colour studio, lighting planner and
// the multi-product quote list. Rendered by Home.tsx right after the category grid (not a CMS section).
import { Link } from 'react-router';
import { ArrowUpRight, ClipboardList, Lightbulb, Palette } from 'lucide-react';
import type { ReactNode } from 'react';
import { defineDict, useDict } from '@/i18n';
import { Accent, Reveal } from '@/components/ui/misc';
import { cn } from '@/lib/utils';

const T = defineDict({
  me: {
    eyebrow: 'Alati online',
    title: 'Isplanirajte *pre nego što dođete*',
    subtitle: 'Probajte boje na fasadi, izračunajte rasvetu za ceo stan i pošaljite nam jedan spisak — mi vraćamo ponudu sa cenama.',
    studio: 'Probajte boju',
    studioText: 'Obojte fasadu kuće ili dnevnu sobu iz lepeze od 74 nijanse i pošaljite nam kombinaciju.',
    studioCta: 'Otvori studio',
    planner: 'Koliko svetla mi treba?',
    plannerText: 'Dodajte prostorije i površinu — predlažemo svetiljke iz naše ponude, i za više stanova odjednom.',
    plannerCta: 'Planiraj rasvetu',
    list: 'Lista za ponudu',
    listText: 'Skupite više proizvoda sa količinama i pošaljite jedan zahtev — formom ili na WhatsApp.',
    listCta: 'Otvori listu',
    room: 'Dnevna soba',
    kitchen: 'Kuhinja',
    yard: 'Dvorište',
    pieces: 'kom',
    lx: 'lx',
  },
  sq: {
    eyebrow: 'Mjete online',
    title: 'Planifikoni *para se të vini*',
    subtitle: 'Provoni ngjyrat në fasadë, llogaritni ndriçimin për gjithë banesën dhe na dërgoni një listë të vetme — ne ju kthejmë ofertë me çmime.',
    studio: 'Provo ngjyrën',
    studioText: 'Lyeni fasadën e shtëpisë ose dhomën e ndenjjes nga një paletë me 74 nuanca dhe na e dërgoni kombinimin.',
    studioCta: 'Hap studion',
    planner: 'Sa drita më duhen?',
    plannerText: 'Shtoni hapësirat dhe sipërfaqen — ju propozojmë ndriçuesit nga gama jonë, edhe për disa banesa njëherësh.',
    plannerCta: 'Planifiko ndriçimin',
    list: 'Lista e ofertës',
    listText: 'Mblidhni disa produkte me sasi dhe dërgoni një kërkesë të vetme — me formular ose në WhatsApp.',
    listCta: 'Hap listën',
    room: 'Dhomë ndenjjeje',
    kitchen: 'Kuzhinë',
    yard: 'Oborr',
    pieces: 'copë',
    lx: 'lx',
  },
  en: {
    eyebrow: 'Online tools',
    title: 'Plan it *before you visit*',
    subtitle: 'Try colours on a facade, work out the lighting for a whole flat and send us one list — we reply with a priced quote.',
    studio: 'Try a colour',
    studioText: 'Paint a house facade or a living room from a 74-shade fan deck and send us the combination.',
    studioCta: 'Open the studio',
    planner: 'How much light do I need?',
    plannerText: 'Add your rooms and their size — we suggest fittings from our range, even for several flats at once.',
    plannerCta: 'Plan your lighting',
    list: 'Quote list',
    listText: 'Collect several products with quantities and send one request — by form or on WhatsApp.',
    listCta: 'Open the list',
    room: 'Living room',
    kitchen: 'Kitchen',
    yard: 'Yard',
    pieces: 'pcs',
    lx: 'lx',
  },
});

const FAN = ['#e8d3b0', '#c9d6e3', '#264a78', '#eab4a2', '#bfd3b6', '#f7c948', '#cfc3e0', '#a8a8a8', '#5fb8b8'];

function ToolCard({ to, icon, title, text, cta, visual, tone = 'light' }: { to: string; icon: ReactNode; title: string; text: string; cta: string; visual: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <Link
      to={to}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 ring-1 transition-all duration-300 hover:-translate-y-1 sm:p-7',
        dark ? 'bg-brand-900 text-white ring-brand-800 hover:shadow-[0_30px_60px_-30px_rgba(19,36,59,0.8)]' : 'bg-white text-ink ring-line hover:shadow-[0_30px_60px_-34px_rgba(19,36,59,0.45)]',
      )}
    >
      <div className={cn('relative h-44 overflow-hidden rounded-2xl', dark ? 'bg-white/5' : 'bg-paper')}>{visual}</div>
      <div className="mt-6 flex items-center gap-3">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', dark ? 'bg-amber-400 text-brand-900' : 'bg-brand-50 text-brand-700')}>{icon}</span>
        <h3 className="display text-[22px] leading-tight">{title}</h3>
      </div>
      <p className={cn('mt-3 flex-1 text-[15px] leading-relaxed', dark ? 'text-white/70' : 'text-muted')}>{text}</p>
      <span className={cn('mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold', dark ? 'text-amber-400' : 'text-brand-700')}>
        {cta}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function ToolsShowcase() {
  const t = useDict(T);
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t('eyebrow')}</div>
            <h2 className="display mt-3 text-[34px] leading-[1.08] sm:text-[44px]">
              <Accent text={t('title')} />
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">{t('subtitle')}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal>
            <ToolCard
              to="/ngjyra"
              tone="dark"
              icon={<Palette className="h-5 w-5" />}
              title={t('studio')}
              text={t('studioText')}
              cta={t('studioCta')}
              visual={
                <div className="absolute inset-x-0 bottom-[-46px] flex justify-center">
                  {FAN.map((c, i) => (
                    <span
                      key={c}
                      className="absolute bottom-0 h-40 w-9 origin-bottom rounded-lg border-[3px] border-white shadow-lg transition-transform duration-500 group-hover:scale-105"
                      style={{ background: c, transform: `rotate(${(i - (FAN.length - 1) / 2) * 13}deg)` }}
                    />
                  ))}
                </div>
              }
            />
          </Reveal>
          <Reveal delay={80}>
            <ToolCard
              to="/ndricimi"
              icon={<Lightbulb className="h-5 w-5" />}
              title={t('planner')}
              text={t('plannerText')}
              cta={t('plannerCta')}
              visual={
                <div className="grid h-full grid-cols-3 gap-2 p-3">
                  {[
                    { label: t('room'), k: '3000K', lux: 150, glow: 'rgba(255,196,120,0.75)' },
                    { label: t('kitchen'), k: '4000K', lux: 300, glow: 'rgba(255,240,215,0.85)' },
                    { label: t('yard'), k: '6500K', lux: 30, glow: 'rgba(205,225,255,0.85)' },
                  ].map((r) => (
                    <div key={r.k} className="relative flex flex-col justify-end overflow-hidden rounded-xl bg-brand-900 p-2.5 text-white">
                      <span className="absolute left-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/90" />
                      <span className="absolute inset-x-0 top-4 h-28" style={{ background: `radial-gradient(60% 80% at 50% 0%, ${r.glow}, transparent 70%)` }} />
                      <span className="relative text-[11px] font-bold">{r.k}</span>
                      <span className="relative text-[10.5px] text-white/70">{r.label}</span>
                      <span className="relative text-[10.5px] tabular-nums text-amber-300">{r.lux} {t('lx')}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </Reveal>
          <Reveal delay={160}>
            <ToolCard
              to="/lista-ofertes"
              icon={<ClipboardList className="h-5 w-5" />}
              title={t('list')}
              text={t('listText')}
              cta={t('listCta')}
              visual={
                <div className="flex h-full flex-col justify-center gap-2 p-4">
                  {[
                    { img: '/images/p/ndricues-tavani-36w-1-sm.webp', name: 'LED 36W', qty: 40 },
                    { img: '/images/p/ndricues-senzor-18w-1-sm.webp', name: 'LED 18W sensor', qty: 24 },
                    { img: '/images/p/bombol-abc-1-sm.webp', name: 'ABC 5 kg', qty: 12 },
                  ].map((r, i) => (
                    <div
                      key={r.name}
                      className="flex items-center gap-3 rounded-xl bg-white p-2 pr-3 shadow-sm ring-1 ring-line transition-transform duration-500 group-hover:translate-x-1"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <img src={r.img} alt="" className="h-9 w-9 rounded-lg object-cover" loading="lazy" />
                      <span className="flex-1 truncate text-[13px] font-semibold">{r.name}</span>
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[12px] font-bold tabular-nums text-brand-700">
                        {r.qty} {t('pieces')}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
