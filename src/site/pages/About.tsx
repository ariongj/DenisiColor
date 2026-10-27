import { ArrowRight, ArrowUpRight, BadgeCheck, Clock, Lightbulb, Mail, MapPin, MessageCircle, Phone, Truck } from 'lucide-react';
import { Accent, Reveal } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { Stripes } from '@/site/components/Stripes';
import { WhatsAppLink } from '@/site/components/quote';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { Breadcrumbs, SectionHeading } from '@/site/components/SectionHeading';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { CtaBand, ProcessSteps, StatsBand } from '@/site/components/company/Blocks';
import { pad2, telHref, useHomeData } from '@/site/components/company/data';
import { defineDict, useDict, useL } from '@/i18n';
import { site } from '@/i18n/site';
import { useSettings } from '@/store/hooks';
import { cn } from '@/lib/utils';

const T = defineDict({
  me: {
    eyebrow: 'O nama',
    title: 'Prodavnica iz Štimlja — *za celo Kosovo*.',
    ourWork: 'Pogledaj proizvode',
    country: 'Kosovo',
    floatSub: 'Prodaja · Dostava · Savet',
    valuesEyebrow: 'Kako radimo',
    valuesTitle: 'Ono na šta *možete računati*',
    valuesText: 'Mala prodavnica, direktan kontakt: pišete nam, mi odgovaramo i šaljemo.',
    v1t: 'Poznati brendovi',
    v1: 'Bosch, Kapriol, PARKSIDE, Novaled — alat, radna odeća i rasveta koje i sami prodajemo svaki dan.',
    v2t: 'Porudžbina kako vam odgovara',
    v2: 'Online, porukom na WhatsApp-u ili Facebook-u, telefonom ili u prodavnici — kako vam je lakše.',
    v3t: 'Dostava širom Kosova',
    v3: 'Šaljemo u svaki grad na Kosovu; u Štimlju možete i lično preuzeti porudžbinu.',
    v4t: 'Iskren savet',
    v4: 'Pomažemo da izaberete pravu rasvetu, LED traku, alat ili boju — i kada vam treba manje nego što ste mislili.',
    allServices: 'Kako radimo',
    showEyebrow: 'Prodavnica',
    showTitle: 'Posetite nas u *Štimlju*',
    showText: 'Svratite u prodavnicu u ulici Komandant Kumanova — pogledajte robu, pitajte za cene i preuzmite porudžbinu.',
    address: 'Adresa',
    phone: 'Telefon i WhatsApp',
    email: 'E-mail',
    openMap: 'Otvori mapu',
  },
  sq: {
    eyebrow: 'Rreth nesh',
    title: 'Dyqan nga Shtimja — *për gjithë Kosovën*.',
    ourWork: 'Shiko produktet',
    country: 'Kosovë',
    floatSub: 'Shitje · Dërgesë · Këshillë',
    valuesEyebrow: 'Si punojmë',
    valuesTitle: 'Ajo për të cilën *mund të llogaritni*',
    valuesText: 'Dyqan i vogël, kontakt i drejtpërdrejtë: na shkruani, ne përgjigjemi dhe e dërgojmë.',
    v1t: 'Marka të njohura',
    v1: 'Bosch, Kapriol, PARKSIDE, Novaled — vegla, veshje pune dhe ndriçim që i shesim çdo ditë.',
    v2t: 'Porosi si t’ju përshtatet',
    v2: 'Online, me mesazh në WhatsApp ose Facebook, me telefon ose në dyqan — si e keni më lehtë.',
    v3t: 'Dërgesë në të gjithë Kosovën',
    v3: 'Dërgojmë në çdo qytet të Kosovës; në Shtime mund ta merrni porosinë edhe vetë.',
    v4t: 'Këshillë e sinqertë',
    v4: 'Ju ndihmojmë të zgjidhni ndriçimin, LED shiritin, veglën ose ngjyrën e duhur — edhe kur ju duhet më pak se sa menduat.',
    allServices: 'Si punojmë',
    showEyebrow: 'Dyqani',
    showTitle: 'Na vizitoni në *Shtime*',
    showText: 'Ejani në dyqan në rrugën Komandant Kumanova — shikoni mallin, pyetni për çmimet dhe merrni porosinë tuaj.',
    address: 'Adresa',
    phone: 'Telefoni dhe WhatsApp',
    email: 'E-mail',
    openMap: 'Hap hartën',
  },
  en: {
    eyebrow: 'About us',
    title: 'A shop from Shtime — *for all of Kosovo*.',
    ourWork: 'Browse products',
    country: 'Kosovo',
    floatSub: 'Sales · Delivery · Advice',
    valuesEyebrow: 'How we work',
    valuesTitle: 'What you can *count on*',
    valuesText: 'A small shop with direct contact: you message us, we reply and ship.',
    v1t: 'Known brands',
    v1: 'Bosch, Kapriol, PARKSIDE, Novaled — tools, workwear and lighting we sell every day.',
    v2t: 'Order the way you like',
    v2: 'Online, by WhatsApp or Facebook message, by phone or in the shop — whatever is easiest.',
    v3t: 'Delivery across Kosovo',
    v3: 'We ship to every town in Kosovo; in Shtime you can also pick up your order yourself.',
    v4t: 'Honest advice',
    v4: 'We help you pick the right light, LED strip, tool or paint — even when you need less than you thought.',
    allServices: 'How we work',
    showEyebrow: 'The shop',
    showTitle: 'Visit us in *Shtime*',
    showText: 'Drop by the shop on Komandant Kumanova street — see the stock, ask about prices and pick up your order.',
    address: 'Address',
    phone: 'Phone & WhatsApp',
    email: 'E-mail',
    openMap: 'Open map',
  },
});

const VALUES = [
  { icon: BadgeCheck, title: 'v1t', text: 'v1' },
  { icon: MessageCircle, title: 'v2t', text: 'v2' },
  { icon: Truck, title: 'v3t', text: 'v3' },
  { icon: Lightbulb, title: 'v4t', text: 'v4' },
] as const;

export default function About() {
  const ts = useDict(site);
  const t = useDict(T);
  const l = useL();
  const settings = useSettings();
  const stats = useHomeData('stats');
  const process = useHomeData('process');
  usePageTitle(ts('nav_about'));

  const hours = l(settings.hours)
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  const contactRows = [
    { icon: MapPin, label: t('address'), value: [settings.address, settings.city].filter(Boolean).join(', '), href: settings.mapUrl, external: true },
    { icon: Clock, label: ts('hours'), value: hours, href: undefined, external: false },
    { icon: Phone, label: t('phone'), value: settings.phone, href: telHref(settings.phone), external: false },
    { icon: Mail, label: t('email'), value: settings.email, href: `mailto:${settings.email}`, external: false },
  ];

  return (
    <>
      {/* Split hero */}
      <section className="overflow-hidden border-b border-line bg-paper">
        <div className="container-x grid items-center gap-14 pb-20 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-24">
          <div className="animate-fade-up">
            <Breadcrumbs items={[{ label: ts('nav_about') }]} />
            <div className="eyebrow mb-4 mt-10">{t('eyebrow')}</div>
            <h1 className="display max-w-xl text-[40px] leading-[1.04] text-ink sm:text-[56px]">
              <Accent text={t('title')} />
            </h1>
            <p className="mt-7 max-w-xl text-[17.5px] leading-[1.7] text-ink-soft">{l(settings.about)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/proizvodi" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t('ourWork')}
              </ButtonLink>
              <ButtonLink to="/kontakt" variant="outline" size="lg">
                {ts('nav_contact')}
              </ButtonLink>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-line pt-6 text-[13px] text-muted">
              <MapPin className="h-4 w-4 text-brand-600" />
              <span>
                <span className="font-semibold text-ink">{settings.legalName}</span> · {settings.city}, {t('country')}
              </span>
            </div>
          </div>
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -right-4 -top-4 h-[70%] w-[70%] rotate-3 rounded-[32px] bg-brand-900" />
            <Stripes className="absolute -right-6 top-0 h-40 w-56" />
            <div className="relative overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_40px_80px_-40px_rgba(19,36,59,0.55)] ring-1 ring-line">
              <AdImage src="/images/misc/koleksioni.webp" eager alt={settings.companyName} className="aspect-square w-full rounded-[22px]" />
            </div>
            <div className="absolute -bottom-8 left-4 right-4 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(19,36,59,0.45)] ring-1 ring-line sm:left-auto sm:right-8 sm:w-[340px] lg:-left-10 lg:right-auto">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-paper ring-1 ring-line">
                <LogoMark className="h-7" />
              </span>
              <div className="min-w-0">
                <div className="font-display text-[19px] font-extrabold leading-tight text-ink">{l(settings.tagline)}</div>
                <div className="mt-0.5 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-700">{t('floatSub')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow={t('valuesEyebrow')} title={t('valuesTitle')} subtitle={t('valuesText')} />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              const tone = i === 1 || i === 2;
              return (
                <Reveal key={v.title} delay={(i % 2) * 110} className="h-full">
                  <div className={cn('h-full', i % 2 === 1 && 'sm:translate-y-12')}>
                    <div className={cn('group flex h-full flex-col rounded-3xl p-7 ring-1 transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-34px_rgba(19,36,59,0.4)] sm:p-8', tone ? 'bg-sand/70 ring-sand-2' : 'bg-white ring-line')}>
                      <div className="flex items-center justify-between">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white transition-transform duration-500 group-hover:-rotate-6">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="display text-[15px] text-muted">{pad2(i + 1)}</span>
                      </div>
                      <h3 className="display mt-10 text-[24px] leading-tight text-ink">{t(v.title)}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">{t(v.text)}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {stats && <StatsBand data={stats} />}

      {process && (
        <ProcessSteps
          data={process}
          action={
            <ButtonLink to="/usluge" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t('allServices')}
            </ButtonLink>
          }
        />
      )}

      {/* Showroom */}
      <section className="pt-24 sm:pt-28">
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-[36px] bg-white ring-1 ring-line lg:grid-cols-[1.05fr_1fr]">
              {/* No shop photo yet → brand panel with the logo instead of a stock image */}
              <div className="relative grid min-h-[300px] place-items-center overflow-hidden bg-brand-900 p-10 sm:min-h-[380px] lg:min-h-[600px]">
                <div className="bg-stripes absolute inset-0" />
                <Stripes className="absolute -right-6 bottom-0 h-56 w-72" />
                <Logo tone="light" className="relative h-20 sm:h-24" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-bold text-ink shadow-sm backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-brand-600" /> {settings.city}, {t('country')}
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <div className="eyebrow">{t('showEyebrow')}</div>
                <h2 className="display mt-3 text-[36px] leading-[1.05] text-ink sm:text-[48px]">
                  <Accent text={t('showTitle')} />
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{t('showText')}</p>
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {contactRows.map((r) => {
                    const Icon = r.icon;
                    const body = Array.isArray(r.value) ? (
                      r.value.map((line) => <span key={line} className="block">{line}</span>)
                    ) : (
                      r.value
                    );
                    return (
                      <li key={r.label} className="flex items-start gap-4 py-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{r.label}</div>
                          {r.href ? (
                            <a
                              href={r.href}
                              {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                              className="link-u mt-0.5 inline-block break-words text-[15.5px] font-semibold text-ink"
                            >
                              {body}
                            </a>
                          ) : (
                            <div className="mt-0.5 text-[15.5px] font-semibold text-ink">{body}</div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={settings.mapUrl} target="_blank" rel="noreferrer" className={buttonClass({ variant: 'dark', size: 'lg' })}>
                    {t('openMap')} <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a href={telHref(settings.phone)} className={buttonClass({ variant: 'outline', size: 'lg' })}>
                    <Phone className="h-4 w-4" /> {ts('callUs')}
                  </a>
                  <WhatsAppLink size="lg" label="WhatsApp" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand image="/images/misc/ngjyra.webp" />
    </>
  );
}
