import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Building2, Check, HardHat, Lightbulb, MessageCircle, Paintbrush, Phone, ShoppingBag, Store, Tag, Truck } from 'lucide-react';
import { Accent, Accordion, Reveal } from '@/components/ui/misc';
import { Button, buttonClass } from '@/components/ui/Button';
import { FacebookIcon, WhatsAppIcon } from '@/components/brand/Social';
import { PageHero, SectionHeading } from '@/site/components/SectionHeading';
import { MeasureForm } from '@/site/components/MeasureForm';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { ProcessSteps } from '@/site/components/company/Blocks';
import { pad2, scrollToId, telHref, useHomeData } from '@/site/components/company/data';
import { waHref } from '@/site/components/quote';
import { Stripes } from '@/site/components/Stripes';
import { defineDict, useDict, useL, useLang } from '@/i18n';
import { site } from '@/i18n/site';
import { useSettings } from '@/store/hooks';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';

// "How we work" (route /usluge): Denisi Color sells and delivers — no installation crews. The page explains
// how to order (message / phone / online / in store), request-a-price and B2B offers, advice and delivery.

const T = defineDict({
  me: {
    eyebrow: 'Kako radimo',
    title: 'Poručite kako vam odgovara — *dostavljamo širom Kosova*',
    subtitle: 'Porudžbine primamo online, porukom i telefonom. Za proizvode bez objavljene cene i veće količine šaljemo ponudu.',
    ctaOffer: 'Zatražite ponudu',
    waysEyebrow: 'Načini poručivanja',
    waysTitle: 'Četiri načina da *poručite*',
    w1t: 'Online prodavnica',
    w1: 'Dodajte proizvode sa cenom u korpu i završite porudžbinu — plaćanje pouzećem, uplatom ili karticom.',
    w2t: 'WhatsApp i Facebook',
    w2: 'Pošaljite naziv ili fotografiju proizvoda, količinu i grad — potvrđujemo cenu i rok.',
    w3t: 'Telefon',
    w3: 'Pozovite nas pon–sub od 07 do 19h i poručite direktno.',
    w4t: 'U prodavnici',
    w4: 'Svratite u Štimlje, Rr. Komandant Kumanova — pogledajte robu i preuzmite porudžbinu.',
    whatEyebrow: 'Šta nudimo',
    whatTitle: 'Više od police — *pomoć pri izboru*',
    s1t: 'Dostava širom Kosova',
    s1: 'Šaljemo u svaki grad; tarife i rokovi po zonama ispod. Preuzimanje u Štimlju je besplatno.',
    s2t: 'Cena na upit',
    s2: 'Za alat, rasvetu, LED opremu, peći i aparate za gašenje cene dajemo na upit — zavisno od modela i količine.',
    s3t: 'Ponude za firme i izvođače',
    s3: 'Rasveta za novu zgradu, radna odeća za ekipu, aparati za gašenje za kancelariju — pripremamo ponudu za količine.',
    s4t: 'Savet za rasvetu i LED',
    s4: 'Pomažemo da izaberete snagu, temperaturu svetla (3000K–6500K), IP zaštitu i profil za LED traku.',
    s5t: 'Boje, lakovi i fasade',
    s5: 'Pitajte nas za nijanse, količine i materijale za fasadu — šaljemo ponudu.',
    s6t: 'Radna odeća za ekipe',
    s6: 'Softshell jakne i duksevi u više boja; veličine potvrđujemo pri porudžbini.',
    more: 'Saznaj više',
    zonesEyebrow: 'Dostava',
    zonesTitle: 'Zone i *rokovi dostave*',
    zonesNote: 'Tarife i rokovi su primer iz demo podešavanja — prodavnica ih potvrđuje.',
    zone: 'Zona',
    fee: 'Cena',
    days: 'Rok',
    daysValue: '{days} radna dana',
    freeOver: 'Besplatna dostava od {amount}',
    pickup: 'Preuzimanje u prodavnici — besplatno',
    faqHelp: 'Imate pitanje koje nije na listi? Pišite nam na WhatsApp ili nas pozovite.',
    formEyebrow: 'Upit ili ponuda',
    formTitle: 'Recite nam šta vam *treba*',
    formText: 'Ostavite kontakt i opišite proizvod, količinu i grad. Javljamo se sa cenom i rokom dostave u toku radnog vremena.',
    f1: 'Bez obaveze kupovine',
    f2: 'Ponude za veće količine',
    f3: 'Odgovor pon–sub 07–19h',
    preferPhone: 'Radije telefonom?',
  },
  sq: {
    eyebrow: 'Si punojmë',
    title: 'Porositni si t’ju përshtatet — *dërgojmë në të gjithë Kosovën*',
    subtitle: 'Porositë i pranojmë online, me mesazh dhe me telefon. Për produktet pa çmim të publikuar dhe për sasi më të mëdha dërgojmë ofertë.',
    ctaOffer: 'Kërko ofertë',
    waysEyebrow: 'Mënyrat e porosisë',
    waysTitle: 'Katër mënyra për të *porositur*',
    w1t: 'Dyqani online',
    w1: 'Shtoni produktet me çmim në shportë dhe përfundoni porosinë — pagesë në dorëzim, me transfer ose me kartelë.',
    w2t: 'WhatsApp dhe Facebook',
    w2: 'Na dërgoni emrin ose foton e produktit, sasinë dhe qytetin — ju konfirmojmë çmimin dhe afatin.',
    w3t: 'Telefon',
    w3: 'Na telefononi hën–sht nga 07:00 deri 19:00 dhe porositni drejtpërdrejt.',
    w4t: 'Në dyqan',
    w4: 'Ejani në Shtime, Rr. Komandant Kumanova — shikoni mallin dhe merrni porosinë.',
    whatEyebrow: 'Çfarë ofrojmë',
    whatTitle: 'Më shumë se një raft — *ndihmë në zgjedhje*',
    s1t: 'Dërgesë në të gjithë Kosovën',
    s1: 'Dërgojmë në çdo qytet; tarifat dhe afatet sipas zonave më poshtë. Marrja në Shtime është falas.',
    s2t: 'Kërko çmimin',
    s2: 'Për vegla, ndriçim, pajisje LED, kamina dhe bombola zjarri çmimin e japim sipas kërkesës — varet nga modeli dhe sasia.',
    s3t: 'Oferta për biznese dhe kontraktorë',
    s3: 'Ndriçim për ndërtesë të re, veshje pune për ekipin, bombola zjarri për zyrën — përgatisim ofertë për sasi.',
    s4t: 'Këshillë për ndriçim dhe LED',
    s4: 'Ju ndihmojmë të zgjidhni fuqinë, temperaturën e dritës (3000K–6500K), mbrojtjen IP dhe profilin për LED shirit.',
    s5t: 'Ngjyra, llaqe dhe fasada',
    s5: 'Na pyesni për nuancat, sasitë dhe materialet për fasadë — ju dërgojmë ofertë.',
    s6t: 'Veshje pune për ekipe',
    s6: 'Jakne softshell dhe duksa në disa ngjyra; madhësitë i konfirmojmë me porosinë.',
    more: 'Mëso më shumë',
    zonesEyebrow: 'Dërgesa',
    zonesTitle: 'Zonat dhe *afatet e dërgesës*',
    zonesNote: 'Tarifat dhe afatet janë shembull nga konfigurimi i demos — konfirmohen nga dyqani.',
    zone: 'Zona',
    fee: 'Çmimi',
    days: 'Afati',
    daysValue: '{days} ditë pune',
    freeOver: 'Dërgesë falas nga {amount}',
    pickup: 'Marrje në dyqan — falas',
    faqHelp: 'Keni një pyetje që nuk është në listë? Na shkruani në WhatsApp ose na telefononi.',
    formEyebrow: 'Kërkesë ose ofertë',
    formTitle: 'Na tregoni çfarë ju *duhet*',
    formText: 'Lini kontaktin dhe përshkruani produktin, sasinë dhe qytetin. Ju kthehemi me çmimin dhe afatin e dërgesës gjatë orarit të punës.',
    f1: 'Pa detyrim blerjeje',
    f2: 'Oferta për sasi më të mëdha',
    f3: 'Përgjigje hën–sht 07–19',
    preferPhone: 'Preferoni telefonin?',
  },
  en: {
    eyebrow: 'How we work',
    title: 'Order the way you like — *we deliver across Kosovo*',
    subtitle: 'We take orders online, by message and by phone. For products without a published price and for larger quantities we send an offer.',
    ctaOffer: 'Request an offer',
    waysEyebrow: 'Ways to order',
    waysTitle: 'Four ways to *order*',
    w1t: 'Online shop',
    w1: 'Add priced products to the cart and check out — cash on delivery, bank transfer or card.',
    w2t: 'WhatsApp & Facebook',
    w2: 'Send us the product name or a photo, the quantity and your town — we confirm price and timing.',
    w3t: 'Phone',
    w3: 'Call us Mon–Sat, 7am to 7pm, and order directly.',
    w4t: 'In the shop',
    w4: 'Drop by in Shtime, Rr. Komandant Kumanova — see the stock and pick up your order.',
    whatEyebrow: 'What we offer',
    whatTitle: 'More than a shelf — *help choosing*',
    s1t: 'Delivery across Kosovo',
    s1: 'We ship to every town; fees and lead times by zone below. Pickup in Shtime is free.',
    s2t: 'Request a price',
    s2: 'Tools, lighting, LED supplies, stoves and extinguishers are priced on request — depending on model and quantity.',
    s3t: 'Offers for companies & contractors',
    s3: 'Lighting for a new building, workwear for a crew, extinguishers for an office — we quote for volumes.',
    s4t: 'Lighting & LED advice',
    s4: 'We help you choose wattage, colour temperature (3000K–6500K), IP rating and the right profile for LED strips.',
    s5t: 'Paints, varnishes & facades',
    s5: 'Ask us about shades, quantities and facade materials — we’ll send an offer.',
    s6t: 'Workwear for crews',
    s6: 'Softshell jackets and sweatshirts in several colours; sizes confirmed with your order.',
    more: 'Learn more',
    zonesEyebrow: 'Delivery',
    zonesTitle: 'Zones and *delivery times*',
    zonesNote: 'Fees and lead times are examples from the demo settings — to be confirmed by the shop.',
    zone: 'Zone',
    fee: 'Price',
    days: 'Time',
    daysValue: '{days} working days',
    freeOver: 'Free delivery from {amount}',
    pickup: 'In-store pickup — free',
    faqHelp: 'Got a question that isn’t listed? Message us on WhatsApp or give us a call.',
    formEyebrow: 'Enquiry or offer',
    formTitle: 'Tell us what you *need*',
    formText: 'Leave your details and describe the product, quantity and town. We’ll come back with the price and delivery time during opening hours.',
    f1: 'No obligation to buy',
    f2: 'Offers for larger quantities',
    f3: 'Replies Mon–Sat 7am–7pm',
    preferPhone: 'Prefer to call?',
  },
});

const SERVICES = [
  { icon: Truck, title: 's1t', text: 's1', to: '#zone' },
  { icon: Tag, title: 's2t', text: 's2', to: '/proizvodi' },
  { icon: Building2, title: 's3t', text: 's3', to: '#kerkesa' },
  { icon: Lightbulb, title: 's4t', text: 's4', to: '/savjeti' },
  { icon: Paintbrush, title: 's5t', text: 's5', to: '/faqe/ngjyra-fasada' },
  { icon: HardHat, title: 's6t', text: 's6', to: '/proizvodi/veshje-pune' },
] as const;

export default function Services() {
  const ts = useDict(site);
  const t = useDict(T);
  const l = useL();
  const lang = useLang();
  const settings = useSettings();
  const process = useHomeData('process');
  const faq = useHomeData('faq');
  usePageTitle(ts('nav_services'));

  const wa = settings.whatsapp?.trim() ? waHref(settings, ts('waGeneral')) : '';
  const ways = [
    { icon: ShoppingBag, title: t('w1t'), text: t('w1'), href: '/proizvodi', external: false },
    { icon: MessageCircle, title: t('w2t'), text: t('w2'), href: wa || settings.facebook || '', external: true },
    { icon: Phone, title: t('w3t'), text: t('w3'), href: telHref(settings.phone), external: true },
    { icon: Store, title: t('w4t'), text: t('w4'), href: settings.mapUrl, external: true },
  ];

  return (
    <>
      <PageHero image="/images/misc/koleksioni.webp" crumbs={[{ label: ts('nav_services') }]} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => scrollToId('kerkesa')} iconRight={<ArrowRight className="h-4 w-4" />} className="bg-amber-400! text-brand-900! hover:bg-amber-300!">
            {t('ctaOffer')}
          </Button>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className={buttonClass({ size: 'lg', className: 'bg-[#1f9d55]! hover:bg-[#178246]!' })}>
              <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp
            </a>
          )}
        </div>
      </PageHero>

      {/* Ways to order */}
      <section className="pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow={t('waysEyebrow')} title={t('waysTitle')} />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {ways.map((w, i) => {
              const Icon = w.icon;
              const body = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white transition-colors group-hover:bg-amber-400 group-hover:text-brand-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="display text-[15px] text-muted">{pad2(i + 1)}</span>
                  </div>
                  <h3 className="mt-8 font-display text-xl font-extrabold text-ink">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{w.text}</p>
                  {w.href && <ArrowUpRight className="absolute bottom-6 right-6 h-5 w-5 text-ink/20 transition-colors group-hover:text-brand-600" />}
                </>
              );
              const cls = 'group relative flex h-full flex-col rounded-3xl bg-white p-6 pb-12 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(19,36,59,0.5)] sm:p-7 sm:pb-14';
              return (
                <Reveal key={w.title} delay={i * 70} className="h-full">
                  {!w.href ? (
                    <div className={cls}>{body}</div>
                  ) : w.external ? (
                    <a href={w.href} target={w.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>
                      {body}
                    </a>
                  ) : (
                    <Link to={w.href} className={cls}>
                      {body}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-sand/60 py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow={t('whatEyebrow')} title={t('whatTitle')} />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const inner = (
                <>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-ink">{t(s.title)}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{t(s.text)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700">
                    {t('more')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </>
              );
              const cls = 'group flex h-full flex-col rounded-3xl bg-paper p-6 ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-32px_rgba(19,36,59,0.45)] sm:p-7';
              return (
                <Reveal key={s.title} delay={(i % 3) * 80} className="h-full">
                  {s.to.startsWith('#') ? (
                    <button type="button" onClick={() => scrollToId(s.to.slice(1))} className={cn(cls, 'w-full text-left')}>
                      {inner}
                    </button>
                  ) : (
                    <Link to={s.to} className={cls}>
                      {inner}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {process && <ProcessSteps data={process} tone="plain" />}

      {/* Delivery zones (from Settings → shipping) */}
      <section id="zone" className="scroll-mt-24 pb-20 sm:pb-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow={t('zonesEyebrow')} title={t('zonesTitle')} subtitle={t('zonesNote')} />
            <ul className="mt-8 space-y-3 text-[15px] font-semibold text-ink">
              {settings.freeShippingThreshold > 0 && (
                <li className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </span>
                  {t('freeOver', { amount: money(settings.freeShippingThreshold, lang, { decimals: false }) })}
                </li>
              )}
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check className="h-4 w-4" />
                </span>
                {t('pickup')}
              </li>
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              {settings.shippingZones.map((z, i) => (
                <div key={z.id} className={cn('flex items-start justify-between gap-4 px-5 py-5 sm:px-7', i > 0 && 'border-t border-line/70')}>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-ink">{z.name}</div>
                    <div className="mt-1 text-[13px] leading-snug text-muted">{z.cities.join(', ')}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[16px] font-bold tabular-nums text-ink">{money(z.fee, lang, { decimals: z.fee % 1 !== 0 })}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted">{t('daysValue', { days: z.days })}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      {faq && faq.items.length > 0 && (
        <section className="border-t border-line py-20 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
            <Reveal>
              <SectionHeading eyebrow={l(faq.eyebrow)} title={l(faq.title)} />
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">{t('faqHelp')}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {wa && (
                  <a href={wa} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1f9d55] px-5 text-sm font-semibold text-white hover:bg-[#178246]">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink hover:border-ink/30">
                    <FacebookIcon className="h-4 w-4 text-[#1877f2]" /> Facebook
                  </a>
                )}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <Accordion items={faq.items.map((it) => ({ title: l(it.q), content: l(it.a) }))} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Enquiry form */}
      <section id="kerkesa" className="scroll-mt-24 pb-8">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-4 rounded-[32px] bg-sand/80 p-3 sm:p-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[24px] bg-brand-900 p-7 text-white sm:p-10">
                <div className="bg-stripes absolute inset-0 -z-10" />
                <Stripes className="absolute -right-6 top-0 -z-10 h-44 w-60" />
                <div className="eyebrow text-amber-400!">{t('formEyebrow')}</div>
                <h2 className="display mt-3 text-[34px] leading-[1.04] sm:text-5xl">
                  <Accent text={t('formTitle')} accentClassName="text-amber-400!" />
                </h2>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-paper/75">{t('formText')}</p>
                <ul className="mt-6 space-y-2.5">
                  {[t('f1'), t('f2'), t('f3')].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] font-medium">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-brand-900">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <a href={telHref(settings.phone)} className="mt-8 inline-flex items-center gap-2.5 self-start text-[15px] font-semibold text-white/85 hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Phone className="h-4 w-4" />
                  </span>
                  {t('preferPhone')} {settings.phone}
                </a>
              </div>
              <MeasureForm type="quote" className="shadow-none ring-0 lg:p-10" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
