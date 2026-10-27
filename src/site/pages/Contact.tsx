import type { ComponentType, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import type { HomeSection } from '@/lib/types';
import { Accent, Accordion, Reveal } from '@/components/ui/misc';
import { ButtonLink } from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/brand/Social';
import { waHref } from '@/site/components/quote';
import { site } from '@/i18n/site';
import { PageHero, SectionHeading } from '@/site/components/SectionHeading';
import { MeasureForm } from '@/site/components/MeasureForm';
import { MapCard } from '@/site/components/content/MapCard';
import { telHref } from '@/site/components/content/posts';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { defineDict, useDict, useL } from '@/i18n';
import { useDb } from '@/store/db';
import { useSettings } from '@/store/hooks';
import { cn } from '@/lib/utils';

const T = defineDict({
  me: {
    title: 'Kontakt',
    eyebrow: 'Kontakt',
    heroTitle: 'Pišite nam, pozovite ili *svratite*',
    heroText: 'Porudžbine primamo porukom, telefonom i online. Za cene na upit, veće količine i ponude za firme — javite se, odgovaramo u toku radnog vremena.',
    replyBadge: 'WhatsApp · Facebook · telefon',
    measureBadge: 'Dostava širom Kosova',
    phone: 'Telefon i WhatsApp',
    phoneHint: 'Pozovite ili pošaljite poruku',
    email: 'E-mail',
    emailHint: 'Za ponude, liste materijala i fotografije',
    address: 'Prodavnica',
    addressHint: 'Prikaži na mapi',
    hours: 'Radno vreme',
    hoursHint: 'Poruke možete slati i van radnog vremena',
    socialTitle: 'Pratite nas na *Facebook-u*',
    socialText: 'Nova roba, cene i ponude — prvo ih objavljujemo na našoj stranici.',
    facebook: 'Facebook',
    whatsapp: 'WhatsApp',
    formEyebrow: 'Upit ili ponuda',
    formTitle: 'Pošaljite *upit*',
    formText: 'Napišite šta vam treba — proizvod, količinu i grad za dostavu. Javljamo se sa cenom i rokom.',
    faqHelpTitle: 'Niste pronašli odgovor?',
    faqHelpText: 'Pozovite nas ili pišite na WhatsApp — tu smo pon–sub od 07 do 19h.',
    bookMeasure: 'Zatražite ponudu',
  },
  sq: {
    title: 'Kontakt',
    eyebrow: 'Kontakt',
    heroTitle: 'Na shkruani, na telefononi ose *ejani*',
    heroText: 'Porositë i pranojmë me mesazh, telefon dhe online. Për „Kërko çmimin”, sasi më të mëdha dhe oferta për biznese — na kontaktoni, përgjigjemi gjatë orarit të punës.',
    replyBadge: 'WhatsApp · Facebook · telefon',
    measureBadge: 'Dërgesë në të gjithë Kosovën',
    phone: 'Telefoni dhe WhatsApp',
    phoneHint: 'Na telefononi ose na dërgoni mesazh',
    email: 'E-mail',
    emailHint: 'Për oferta, lista materialesh dhe foto',
    address: 'Dyqani',
    addressHint: 'Shfaq në hartë',
    hours: 'Orari i punës',
    hoursHint: 'Mesazhe mund të dërgoni edhe jashtë orarit',
    socialTitle: 'Na ndiqni në *Facebook*',
    socialText: 'Mall i ri, çmime dhe oferta — i publikojmë së pari në faqen tonë.',
    facebook: 'Facebook',
    whatsapp: 'WhatsApp',
    formEyebrow: 'Kërkesë ose ofertë',
    formTitle: 'Dërgoni një *kërkesë*',
    formText: 'Shkruani çfarë ju duhet — produktin, sasinë dhe qytetin për dërgesë. Ju kthehemi me çmimin dhe afatin.',
    faqHelpTitle: 'Nuk e gjetët përgjigjen?',
    faqHelpText: 'Na telefononi ose na shkruani në WhatsApp — jemi këtu hën–sht nga 07:00 deri 19:00.',
    bookMeasure: 'Kërko ofertë',
  },
  en: {
    title: 'Contact',
    eyebrow: 'Contact',
    heroTitle: 'Message us, call or *drop by*',
    heroText: 'We take orders by message, phone and online. For request-a-price items, larger quantities and business offers — get in touch, we reply during opening hours.',
    replyBadge: 'WhatsApp · Facebook · phone',
    measureBadge: 'Delivery across Kosovo',
    phone: 'Phone & WhatsApp',
    phoneHint: 'Call or send a message',
    email: 'E-mail',
    emailHint: 'For offers, material lists and photos',
    address: 'The shop',
    addressHint: 'Show on map',
    hours: 'Opening hours',
    hoursHint: 'You can message us outside opening hours too',
    socialTitle: 'Follow us on *Facebook*',
    socialText: 'New stock, prices and offers — we post them on our page first.',
    facebook: 'Facebook',
    whatsapp: 'WhatsApp',
    formEyebrow: 'Enquiry or offer',
    formTitle: 'Send an *enquiry*',
    formText: 'Tell us what you need — the product, quantity and delivery town. We’ll come back with the price and timing.',
    faqHelpTitle: 'Didn’t find your answer?',
    faqHelpText: 'Call or WhatsApp us — we’re here Mon–Sat, 7am to 7pm.',
    bookMeasure: 'Request an offer',
  },
});

type FaqData = Extract<HomeSection, { type: 'faq' }>;

/** Contact tile — compact icon-left row on phones, tall card with the icon on top from `sm` up. */
function ContactCard({ icon: Icon, label, hint, href, external, children }: { icon: ComponentType<{ className?: string }>; label: string; hint?: string; href?: string; external?: boolean; children: ReactNode }) {
  const inner = (
    <>
      <div className="flex flex-1 gap-4 sm:flex-col sm:gap-0">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <div className={cn('flex min-w-0 flex-1 flex-col sm:mt-7 sm:pr-0', href && 'pr-6')}>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{label}</div>
          <div className="mt-1.5 break-words text-[17px] font-semibold leading-snug text-ink sm:mt-2 sm:text-[19px]">{children}</div>
          {hint && <div className={cn('mt-auto pt-2.5 text-[13.5px] leading-snug text-muted sm:pt-4', href && 'transition-colors group-hover:text-ink')}>{hint}</div>}
        </div>
      </div>
      {href && <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-ink/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 sm:right-7 sm:top-7" />}
    </>
  );
  const cls = 'group relative flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-line sm:p-7';
  if (!href) return <div className={cls}>{inner}</div>;
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={cn(cls, 'transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(19,36,59,0.5)] hover:ring-ink/15')}
    >
      {inner}
    </a>
  );
}

export default function Contact() {
  const t = useDict(T);
  const l = useL();
  const settings = useSettings();
  const faq = useDb((s) => s.home.find((h): h is FaqData => h.type === 'faq'));
  usePageTitle(t('title'));

  // Tolerate "@handle" or a pasted profile URL in the CMS settings.
  const igHandle = (settings.instagram ?? '')
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '');
  const instagram = `https://www.instagram.com/${igHandle}/`;
  const waDigits = (settings.whatsapp ?? '').replace(/\D/g, '');
  const fb = settings.facebook?.trim() ?? '';
  const ts = useDict(site);
  const hours = l(settings.hours)
    .split(/\s*·\s*/)
    .filter(Boolean);

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('heroTitle')} subtitle={t('heroText')} crumbs={[{ label: t('title') }]}>
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-ink ring-1 ring-line">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t('replyBadge')}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-ink ring-1 ring-line">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            {t('measureBadge')}
          </span>
        </div>
      </PageHero>

      {/* Contact cards */}
      <section className="pb-20 pt-12 sm:pb-24 sm:pt-16">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <Reveal className="h-full">
              <ContactCard icon={Phone} label={t('phone')} hint={t('phoneHint')} href={telHref(settings.phone)}>
                {settings.phone}
                {settings.phone2 ? <span className="block text-[15px] font-medium text-muted">{settings.phone2}</span> : null}
              </ContactCard>
            </Reveal>
            <Reveal delay={70} className="h-full">
              <ContactCard icon={Mail} label={t('email')} hint={t('emailHint')} href={`mailto:${settings.email}`}>
                {settings.email}
              </ContactCard>
            </Reveal>
            <Reveal delay={140} className="h-full">
              <ContactCard icon={MapPin} label={t('address')} hint={t('addressHint')} href={settings.mapUrl} external>
                {settings.address}
                <span className="block text-[15px] font-medium text-muted">{settings.city}</span>
              </ContactCard>
            </Reveal>
            <Reveal delay={210} className="h-full">
              <ContactCard icon={Clock} label={t('hours')} hint={t('hoursHint')}>
                {hours.map((h) => (
                  <span key={h} className="block">
                    {h}
                  </span>
                ))}
              </ContactCard>
            </Reveal>
          </div>

          {/* Social strip — Facebook (Denisi's main channel) + WhatsApp; Instagram only when set */}
          {(fb || igHandle || waDigits) && (
            <Reveal className="mt-5">
              <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-brand-900 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="bg-stripes pointer-events-none absolute inset-0" />
                <div className="relative flex items-center gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#1877f2] text-white shadow-lg">
                    <FacebookIcon className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="display text-[24px] leading-tight sm:text-[28px]">
                      <Accent text={t('socialTitle')} accentClassName="text-amber-400!" />
                    </h2>
                    <p className="mt-1 text-[14.5px] text-paper/65">{t('socialText')}</p>
                  </div>
                </div>
                <div className="relative flex flex-wrap gap-2">
                  {fb && (
                    <a href={fb} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:bg-sand">
                      <FacebookIcon className="h-4 w-4 text-[#1877f2]" />
                      {t('facebook')}
                    </a>
                  )}
                  {igHandle && (
                    <a href={instagram} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
                      <InstagramIcon className="h-4 w-4" />@{igHandle}
                    </a>
                  )}
                  {waDigits && (
                    <a href={waHref(settings, ts('waGeneral'))} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1f9d55] px-5 text-sm font-semibold text-white transition hover:bg-[#178246]">
                      <WhatsAppIcon className="h-4 w-4" />
                      {t('whatsapp')}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Form + map */}
      <section id="kerkesa" className="scroll-mt-24 bg-sand/60 py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <Reveal>
            <SectionHeading eyebrow={t('formEyebrow')} title={t('formTitle')} subtitle={t('formText')} />
            <MeasureForm type="quote" className="mt-10 shadow-[0_30px_60px_-45px_rgba(19,36,59,0.45)] lg:p-9" />
          </Reveal>
          <Reveal delay={120} className="h-full">
            <MapCard className="h-full shadow-[0_30px_60px_-45px_rgba(19,36,59,0.45)]" />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      {faq && faq.data.items.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
            <Reveal>
              <SectionHeading eyebrow={l(faq.data.eyebrow)} title={l(faq.data.title)} />
              <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-line sm:p-7">
                <h3 className="text-lg font-bold text-ink">{t('faqHelpTitle')}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{t('faqHelpText')}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={telHref(settings.phone)} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700">
                    <Phone className="h-4 w-4" /> {settings.phone}
                  </a>
                  <ButtonLink to="/kontakt#kerkesa" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                    {t('bookMeasure')}
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <Accordion items={faq.data.items.map((it) => ({ title: l(it.q), content: l(it.a) }))} />
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
