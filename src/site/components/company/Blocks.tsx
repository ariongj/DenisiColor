import type { ReactNode } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { Accent, Reveal } from '@/components/ui/misc';
import { LogoMark } from '@/components/brand/Logo';
import { AdImage } from '@/site/components/AdImage';
import { Stripes } from '@/site/components/Stripes';
import { WhatsAppLink } from '@/site/components/quote';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/site/components/SectionHeading';
import { defineDict, useDict, useL } from '@/i18n';
import { site } from '@/i18n/site';
import { useSettings } from '@/store/hooks';
import { cn } from '@/lib/utils';
import { pad2, telHref, useMeasureHref, type SectionData } from './data';

/** Strings shared by the company pages (services, projects, about). */
export const C = defineDict({
  me: {
    step: 'Korak',
    inNumbers: 'Denisi Color u brojkama',
    bookFree: 'Zatražite ponudu',
    ctaEyebrow: 'Sledeći korak',
    ctaTitle: 'Recite nam šta vam *treba*.',
    ctaText: 'Pošaljite listu ili fotografiju proizvoda — javljamo se sa cenom i rokom dostave. Za firme i izvođače pripremamo posebnu ponudu.',
  },
  sq: {
    step: 'Hapi',
    inNumbers: 'Denisi Color në shifra',
    bookFree: 'Kërko ofertë',
    ctaEyebrow: 'Hapi i radhës',
    ctaTitle: 'Na tregoni çfarë ju *duhet*.',
    ctaText: 'Na dërgoni listën ose foton e produktit — ju kthehemi me çmimin dhe afatin e dërgesës. Për kompani dhe kontraktorë përgatisim ofertë të veçantë.',
  },
  en: {
    step: 'Step',
    inNumbers: 'Denisi Color in numbers',
    bookFree: 'Request an offer',
    ctaEyebrow: 'Next step',
    ctaTitle: 'Tell us what you *need*.',
    ctaText: 'Send us a list or a photo of the product — we’ll come back with the price and delivery time. Companies and contractors get a dedicated offer.',
  },
});

/* ------------------------------------------------------------------ */
/* Ink band: CMS quote + key numbers                                   */
/* ------------------------------------------------------------------ */
export function StatsBand({ data }: { data: SectionData<'stats'> }) {
  const l = useL();
  const t = useDict(C);
  const settings = useSettings();
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 py-24 text-white sm:py-32">
      <div className="bg-stripes pointer-events-none absolute inset-0 -z-10" />
      <Stripes className="absolute -right-10 top-0 -z-10 h-64 w-80 opacity-80 max-sm:hidden" />
      <div className="container-x">
        <Reveal className="mx-auto max-w-4xl text-center">
          <div className="eyebrow text-amber-400!">{t('inNumbers')}</div>
          <blockquote className="display mt-6 text-[30px] leading-[1.18] text-white sm:text-[44px] lg:text-[50px]">
            <span className="text-amber-400">„</span>
            {l(data.quote)}
            <span className="text-amber-400">“</span>
          </blockquote>
          <div className="mt-9 inline-flex items-center gap-3 text-left">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white ring-2 ring-white/15">
              <LogoMark className="h-7" />
            </span>
            <div>
              <div className="text-[14px] font-bold tracking-wide text-white">{settings.companyName}</div>
              <div className="text-[13px] text-paper/55">{l(settings.tagline)}</div>
            </div>
          </div>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-y-12 border-t border-white/10 pt-12 sm:mt-20 lg:grid-cols-4 lg:gap-y-0">
          {data.items.map((s, i) => (
            <Reveal key={i} delay={i * 90} className={cn('px-3 text-center lg:px-6', i % 2 === 1 && 'border-l border-white/10', i > 0 && 'lg:border-l lg:border-white/10')}>
              <div className="display text-[56px] leading-none text-white sm:text-[76px]">{s.value}</div>
              <p className="mx-auto mt-4 max-w-[19ch] text-[14.5px] leading-snug text-paper/60">{l(s.label)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* "How we work" — the CMS process steps as numbered cards             */
/* ------------------------------------------------------------------ */
export function ProcessSteps({ data, action, className, tone = 'sand' }: { data: SectionData<'process'>; action?: ReactNode; className?: string; tone?: 'sand' | 'plain' }) {
  const l = useL();
  const t = useDict(C);
  const n = data.steps.length;
  return (
    <section className={cn('py-24 sm:py-28', tone === 'sand' && 'bg-sand/60', className)}>
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow={l(data.eyebrow)} title={l(data.title)} action={action} />
        </Reveal>
        <ol className={cn('mt-14 grid gap-4 sm:grid-cols-2 lg:gap-5', n >= 4 ? 'lg:grid-cols-4' : n === 3 && 'lg:grid-cols-3')}>
          {data.steps.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 100}>
              <div className={cn('flex h-full flex-col rounded-3xl p-7 ring-1 ring-line transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-34px_rgba(19,36,59,0.4)]', tone === 'sand' ? 'bg-paper' : 'bg-white')}>
                <div className="flex items-start justify-between gap-4">
                  <span className="display text-[56px] leading-none text-brand-600">{pad2(i + 1)}</span>
                  <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                    {t('step')} {i + 1}/{n}
                  </span>
                </div>
                <h3 className="mt-10 text-xl font-bold text-ink">{l(s.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{l(s.text)}</p>
                <div className="mt-auto pt-8">
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${((i + 1) / n) * 100}%` }} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing call-to-action band                                         */
/* ------------------------------------------------------------------ */
export function CtaBand({ image, className }: { image: string; className?: string }) {
  const t = useDict(C);
  const ts = useDict(site);
  const settings = useSettings();
  const measureHref = useMeasureHref();
  return (
    <section className={cn('pt-24 sm:pt-28', className)}>
      <div className="container-x">
        <Reveal>
          <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[32px] bg-brand-900 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-20">
            <div className="bg-stripes absolute inset-0 -z-10" />
            <Stripes className="absolute -bottom-4 right-[30%] -z-10 h-40 w-56 opacity-70 max-lg:hidden" />
            <div className="max-w-2xl">
              <div className="eyebrow text-amber-400!">{t('ctaEyebrow')}</div>
              <h2 className="display mt-4 text-[40px] leading-[1.03] text-white sm:text-[58px]">
                <Accent text={t('ctaTitle')} accentClassName="text-amber-400!" />
              </h2>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-paper/75">{t('ctaText')}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink to={measureHref} size="lg" iconRight={<ArrowRight className="h-4 w-4" />} className="bg-amber-400! text-brand-900! hover:bg-amber-300!">
                  {t('bookFree')}
                </ButtonLink>
                <WhatsAppLink size="lg" label="WhatsApp" />
              </div>
              <a href={telHref(settings.phone)} className="mt-7 inline-flex items-center gap-2.5 text-[15px] font-semibold text-white/80 transition-colors hover:text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Phone className="h-4 w-4" />
                </span>
                {ts('callUs')}: {settings.phone}
              </a>
            </div>
            <div className="relative mx-auto hidden w-[300px] -rotate-3 overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.7)] sm:block xl:w-[340px]">
              <AdImage src={image} className="aspect-square w-full rounded-[16px]" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
