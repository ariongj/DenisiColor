import { Link, useParams } from 'react-router';
import { ArrowRight, Banknote, Copy, CreditCard, Home, Landmark, LayoutDashboard, PackageSearch, MessageCircle, PhoneCall, ShieldCheck, Store, Truck, Wrench } from 'lucide-react';
import type { ComponentType } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Accent, Badge, Img } from '@/components/ui/misc';
import { defineDict, useDict, useLang } from '@/i18n';
import { common } from '@/i18n/common';
import { useDb } from '@/store/db';
import { useSettings } from '@/store/hooks';
import { zoneForCity } from '@/lib/pricing';
import { money, num, unitLabel } from '@/lib/format';
import { siteDate } from '@/site/components/dates';
import type { Order, OrderLine } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { CheckoutSteps, TotalsRows, useCopy, useDiscountRows, useItemsLabel } from '@/site/components/checkout/parts';
import { Confetti, SuccessCheck } from '@/site/components/checkout/Celebrate';
import { ck } from '@/site/components/checkout/dict';

const T = defineDict({
  me: {
    pageTitle: 'Porudžbina primljena',
    eyebrow: 'Porudžbina je primljena',
    thanks: 'Hvala, *{name}*!',
    lead: 'Vaša porudžbina je uspešno primljena. Potvrdu smo poslali na {email}, a uskoro vas zovemo radi potvrde.',
    orderNo: 'Broj porudžbine',
    placedAt: 'Naručeno {date}',
    nextTitle: 'Šta *sledi*',
    n1: 'Poziv za potvrdu',
    n1when: 'u toku radnog vremena',
    n1text: 'Zovemo vas na {phone} da potvrdimo porudžbinu, veličine/opcije i dostavu.',
    n2delivery: 'Dostava na adresu',
    n2deliveryText: 'Dostavljamo na {address}, bilo gde na Kosovu.',
    n2measure: 'Dostava',
    n2measureText: 'Dostavljamo na {address}.',
    n2pickup: 'Preuzimanje u prodavnici',
    n2pickupText: 'Porudžbina vas čeka u prodavnici: {address}. Javićemo vam kada bude spremna.',
    n2when: '{days} radna dana',
    n2whenPickup: 'kada bude spremno',
    n3: 'Montaža',
    n3when: 'pon–sub 07–19h',
    n3text: 'Detalje montaže dogovaramo telefonom.',
    n3opt: 'Pitanja o porudžbini?',
    n3optText: 'Pozovite nas ili pišite na WhatsApp na {phone} — rado pomažemo.',
    bankTitle: 'Podaci za uplatu',
    bankText: 'Porudžbinu šaljemo u pripremu čim uplata bude evidentirana. Obavezno navedite poziv na broj. (Podaci za uplatu su primer.)',
    recipient: 'Primalac',
    bank: 'Banka',
    account: 'Broj računa',
    amount: 'Iznos',
    reference: 'Poziv na broj',
    purpose: 'Svrha uplate',
    purposeText: 'Uplata po narudžbi {n}',
    codNote: 'Pripremite {amount} — plaćate kuriru gotovinom.',
    codNotePickup: 'Pripremite {amount} — plaćate u prodavnici.',
    cardNote: 'Plaćanje karticom je odobreno (demo simulacija) — iznos {amount}.',
    deliveryTo: 'Dostava',
    payment: 'Plaćanje',
    contact: 'Kontakt',
    summary: 'Pregled porudžbine',
    continue: 'Nastavi kupovinu',
    home: 'Početna',
    demo: 'Demo:',
    demoText: 'porudžbina se upravo pojavila u CMS-u.',
    demoLink: 'Pogledaj porudžbinu u CMS-u',
    nfTitle: 'Porudžbina nije pronađena',
    nfText: 'Proverite link iz potvrde ili nas kontaktirajte — rado ćemo pomoći.',
    contactUs: 'Kontaktirajte nas',
  },
  sq: {
    pageTitle: 'Porosia u pranua',
    eyebrow: 'Porosia u pranua',
    thanks: 'Faleminderit, *{name}*!',
    lead: 'Porosia juaj u pranua me sukses. Konfirmimin e dërguam në {email}, dhe së shpejti ju telefonojmë për ta konfirmuar.',
    orderNo: 'Numri i porosisë',
    placedAt: 'Porositur më {date}',
    nextTitle: 'Çfarë *vijon*',
    n1: 'Thirrje konfirmimi',
    n1when: 'gjatë orarit të punës',
    n1text: 'Ju telefonojmë në {phone} për të konfirmuar porosinë, madhësitë/opsionet dhe dërgesën.',
    n2delivery: 'Dërgesë në adresë',
    n2deliveryText: 'Dërgojmë në {address}, kudo në Kosovë.',
    n2measure: 'Dërgesa',
    n2measureText: 'Dërgojmë në {address}.',
    n2pickup: 'Marrje në dyqan',
    n2pickupText: 'Porosia ju pret në dyqan: {address}. Do t’ju njoftojmë kur të jetë gati.',
    n2when: '{days} ditë pune',
    n2whenPickup: 'kur të jetë gati',
    n3: 'Montimi',
    n3when: 'hën–sht 07:00–19:00',
    n3text: 'Detajet e montimit i merremi vesh me telefon.',
    n3opt: 'Pyetje për porosinë?',
    n3optText: 'Na telefononi ose na shkruani në WhatsApp në {phone} — ju ndihmojmë me kënaqësi.',
    bankTitle: 'Të dhënat për pagesë',
    bankText: 'Porosinë e dërgojmë në përgatitje sapo të regjistrohet pagesa. Patjetër shënoni referencën. (Të dhënat bankare janë shembull.)',
    recipient: 'Përfituesi',
    bank: 'Banka',
    account: 'Llogaria',
    amount: 'Shuma',
    reference: 'Referenca',
    purpose: 'Qëllimi i pagesës',
    purposeText: 'Pagesë për porosinë {n}',
    codNote: 'Përgatitni {amount} — paguani korrierit me para në dorë.',
    codNotePickup: 'Përgatitni {amount} — paguani në dyqan.',
    cardNote: 'Pagesa me kartelë u miratua (simulim demo) — shuma {amount}.',
    deliveryTo: 'Dërgesa',
    payment: 'Pagesa',
    contact: 'Kontakti',
    summary: 'Përmbledhja e porosisë',
    continue: 'Vazhdo blerjen',
    home: 'Ballina',
    demo: 'Demo:',
    demoText: 'porosia sapo u shfaq në CMS.',
    demoLink: 'Shiko porosinë në CMS',
    nfTitle: 'Porosia nuk u gjet',
    nfText: 'Kontrolloni linkun nga konfirmimi ose na kontaktoni — me kënaqësi ju ndihmojmë.',
    contactUs: 'Na kontaktoni',
  },
  en: {
    pageTitle: 'Order received',
    eyebrow: 'Order received',
    thanks: 'Thank you, *{name}*!',
    lead: 'Your order has been received. We’ve sent the confirmation to {email} and will call you shortly to confirm it.',
    orderNo: 'Order number',
    placedAt: 'Placed {date}',
    nextTitle: 'What happens *next*',
    n1: 'Confirmation call',
    n1when: 'during opening hours',
    n1text: 'We call you on {phone} to confirm the order, sizes/options and delivery.',
    n2delivery: 'Home delivery',
    n2deliveryText: 'We deliver to {address}, anywhere in Kosovo.',
    n2measure: 'Delivery',
    n2measureText: 'We deliver to {address}.',
    n2pickup: 'In-store pickup',
    n2pickupText: 'Your order will be waiting at our shop: {address}. We’ll let you know when it’s ready.',
    n2when: '{days} working days',
    n2whenPickup: 'when ready',
    n3: 'Installation',
    n3when: 'Mon–Sat 7am–7pm',
    n3text: 'We agree the installation details by phone.',
    n3opt: 'Questions about your order?',
    n3optText: 'Call or WhatsApp us on {phone} — we’re happy to help.',
    bankTitle: 'Bank transfer details',
    bankText: 'We start preparing your order once the payment is registered. Please quote the reference. (Bank details are an example.)',
    recipient: 'Recipient',
    bank: 'Bank',
    account: 'Account number',
    amount: 'Amount',
    reference: 'Reference',
    purpose: 'Payment description',
    purposeText: 'Payment for order {n}',
    codNote: 'Please have {amount} ready — pay the courier in cash.',
    codNotePickup: 'Please have {amount} ready — pay in the shop.',
    cardNote: 'Card payment approved (demo simulation) — {amount}.',
    deliveryTo: 'Delivery',
    payment: 'Payment',
    contact: 'Contact',
    summary: 'Order summary',
    continue: 'Continue shopping',
    home: 'Home',
    demo: 'Demo:',
    demoText: 'the order has just landed in the CMS.',
    demoLink: 'View the order in the CMS',
    nfTitle: 'Order not found',
    nfText: 'Please check the link from your confirmation or get in touch — we’re happy to help.',
    contactUs: 'Contact us',
  },
});

const units = (it: OrderLine) => (it.unit === 'm2' && it.packSize ? Math.round(it.qty * it.packSize * 100) / 100 : it.qty);

function NotFoundState() {
  const t = useDict(T);
  usePageTitle(t('nfTitle'));
  return (
    <div className="container-x py-16 sm:py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-line">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sand text-ink-soft">
          <PackageSearch className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="display mt-6 text-[34px] leading-tight text-ink sm:text-[42px]">{t('nfTitle')}</h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{t('nfText')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" icon={<Home className="h-4 w-4" />}>
            {t('home')}
          </ButtonLink>
          <ButtonLink to="/kontakt" variant="outline">
            {t('contactUs')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, when, text, first, last }: { icon: ComponentType<{ className?: string }>; title: string; when: string; text: string; first?: boolean; last?: boolean }) {
  return (
    <li className={cn('relative flex gap-4', !last && 'pb-7')}>
      {!last && <span aria-hidden className="absolute bottom-0 left-5 top-11 w-px bg-line" />}
      <span className={cn('relative grid h-10 w-10 shrink-0 place-items-center rounded-full', first ? 'bg-brand-600 text-white shadow-[0_8px_20px_-10px_var(--color-brand-700)]' : 'bg-sand text-ink-soft')}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 pt-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-[15.5px] font-semibold text-ink">{title}</h3>
          <Badge tone={first ? 'brand' : 'sand'}>{when}</Badge>
        </div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{text}</p>
      </div>
    </li>
  );
}

function BankBox({ order }: { order: Order }) {
  const t = useDict(T);
  const tk = useDict(ck);
  const lang = useLang();
  const settings = useSettings();
  const copy = useCopy();
  const rows: { label: string; value: string; copy?: boolean; strong?: boolean }[] = [
    { label: t('recipient'), value: settings.legalName },
    { label: t('bank'), value: settings.bankName },
    { label: t('account'), value: settings.bankAccount, copy: true, strong: true },
    { label: t('amount'), value: money(order.total, lang), strong: true },
    { label: t('reference'), value: order.number, copy: true, strong: true },
    { label: t('purpose'), value: t('purposeText', { n: order.number }) },
  ];
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-900 p-6 text-paper sm:p-8">
      <div className="bg-stripes pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-amber-400">
            <Landmark className="h-5 w-5" />
          </span>
          <h2 className="font-display text-[26px] leading-tight text-white">{t('bankTitle')}</h2>
        </div>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-paper/65">{t('bankText')}</p>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 bg-ink/80 px-4 py-3.5">
              <div className="min-w-0">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-paper/50">{r.label}</dt>
                <dd className={cn('mt-0.5 break-words text-[14.5px] tabular-nums', r.strong ? 'font-bold text-white' : 'font-medium text-paper/85')}>{r.value}</dd>
              </div>
              {r.copy && (
                <button
                  type="button"
                  onClick={() => copy(r.value)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-paper/80 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label={`${tk('copy')}: ${r.label}`}
                  title={tk('copy')}
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useDb((s) => s.orders.find((o) => o.id === id || o.number === id));
  if (!order) return <NotFoundState />;
  return <Success order={order} />;
}

function Success({ order }: { order: Order }) {
  const t = useDict(T);
  const tk = useDict(ck);
  const tc = useDict(common);
  const lang = useLang();
  const settings = useSettings();
  const items = useItemsLabel();
  const copy = useCopy();
  const discountRows = useDiscountRows(order.discounts);
  usePageTitle(t('pageTitle'));

  const c = order.customer;
  const name = c.firstName.replace(/\*/g, '').trim() || c.lastName;
  const pickup = order.delivery.method === 'pickup';
  const hasInstall = order.items.some((i) => i.installation);
  const zone = zoneForCity(settings, c.city);
  const fullAddress = [c.address, c.city].filter(Boolean).join(', ');
  const count = order.items.reduce((s, i) => s + (i.unit === 'kom' || i.unit === 'set' ? i.qty : 1), 0);

  const steps = [
    { icon: PhoneCall, title: t('n1'), when: t('n1when'), text: t('n1text', { phone: c.phone }) },
    pickup
      ? { icon: Store, title: t('n2pickup'), when: t('n2whenPickup'), text: t('n2pickupText', { address: settings.pickupAddress }) }
      : hasInstall
        ? { icon: Truck, title: t('n2measure'), when: t('n2when', { days: zone?.days ?? '2–4' }), text: t('n2measureText', { address: fullAddress }) }
        : { icon: Truck, title: t('n2delivery'), when: t('n2when', { days: zone?.days ?? '2–4' }), text: t('n2deliveryText', { address: fullAddress }) },
    hasInstall
      ? { icon: Wrench, title: t('n3'), when: t('n3when'), text: t('n3text') }
      : { icon: MessageCircle, title: t('n3opt'), when: t('n3when'), text: t('n3optText', { phone: settings.whatsapp || settings.phone }) },
  ];

  const PayIcon = { cod: Banknote, bank: Landmark, card: CreditCard }[order.payment.method];
  const payNote =
    order.payment.method === 'card'
      ? t('cardNote', { amount: money(order.total, lang) })
      : order.payment.method === 'cod'
        ? t(pickup ? 'codNotePickup' : 'codNote', { amount: money(order.total, lang) })
        : null;

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white/80 to-paper">
        <Confetti />
        <div className="container-x relative flex flex-col items-center pb-14 pt-8 text-center sm:pb-16 sm:pt-10">
          <CheckoutSteps current={4} className="mb-10 sm:mb-12" />
          <SuccessCheck />
          <div className="eyebrow mt-7 animate-fade-up [animation-delay:250ms]">{t('eyebrow')}</div>
          <h1 className="display mt-3 animate-fade-up text-[42px] leading-[1.02] text-ink [animation-delay:320ms] sm:text-[64px]">
            <Accent text={t('thanks', { name })} />
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up text-[16px] leading-relaxed text-muted [animation-delay:400ms] sm:text-[17px]">
            {t('lead')
              .split('{email}')
              .flatMap((part, i) => (i === 0 ? [part] : [<strong key={i} className="font-semibold text-ink">{c.email}</strong>, part]))}
          </p>
          <div className="mt-7 inline-flex animate-fade-up items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-[0_10px_30px_-18px_rgba(19,36,59,0.45)] ring-1 ring-line [animation-delay:480ms]">
            <span className="text-[13px] text-muted">{t('orderNo')}</span>
            <span className="text-[17px] font-bold tracking-wide text-ink">{order.number}</span>
            <button type="button" onClick={() => copy(order.number)} className="grid h-9 w-9 place-items-center rounded-full bg-sand text-ink-soft transition-colors hover:bg-ink hover:text-paper" aria-label={tk('copy')} title={tk('copy')}>
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 animate-fade-up text-[12.5px] text-muted [animation-delay:520ms]">{t('placedAt', { date: `${siteDate(order.createdAt, lang)}, ${new Date(order.createdAt).toTimeString().slice(0, 5)}` })}</p>
        </div>
      </section>

      <div className="container-x grid items-start gap-8 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:gap-16">
        <div className="min-w-0 space-y-6">
          {order.payment.method === 'bank' && <BankBox order={order} />}

          {/* What happens next */}
          <section className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
            <h2 className="display text-[30px] leading-tight text-ink">
              <Accent text={t('nextTitle')} />
            </h2>
            <ol className="mt-7">
              {steps.map((s, i) => (
                <Step key={i} {...s} first={i === 0} last={i === steps.length - 1} />
              ))}
            </ol>
          </section>

          {/* Delivery · payment · contact */}
          <section className="grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-3">
            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                {pickup ? <Store className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                {t('deliveryTo')}
              </div>
              <p className="mt-2 text-[14px] font-semibold text-ink">{tc(`delivery_${order.delivery.method}`)}</p>
              <p className="mt-1 text-[13.5px] leading-snug text-muted">{pickup ? settings.pickupAddress : fullAddress}</p>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                <PayIcon className="h-3.5 w-3.5" />
                {t('payment')}
              </div>
              <p className="mt-2 text-[14px] font-semibold text-ink">{tc(`pay_${order.payment.method}`)}</p>
              <Badge tone={order.payment.status === 'paid' ? 'green' : order.payment.status === 'refunded' ? 'gray' : 'amber'} dot className="mt-2">
                {tc(`paystatus_${order.payment.status}`)}
              </Badge>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                <PhoneCall className="h-3.5 w-3.5" />
                {t('contact')}
              </div>
              <p className="mt-2 text-[14px] font-semibold text-ink">
                {c.firstName} {c.lastName}
              </p>
              <p className="mt-1 break-words text-[13.5px] leading-snug text-muted">
                {c.phone}
                <br />
                {c.email}
                {c.company && (
                  <>
                    <br />
                    {c.company}
                    {c.pib ? ` · PIB ${c.pib}` : ''}
                  </>
                )}
              </p>
            </div>
          </section>

          {payNote && (
            <p className={cn('flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-[13.5px] leading-snug ring-1 ring-inset', order.payment.method === 'card' ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/15' : 'bg-white text-ink-soft ring-line')}>
              {order.payment.method === 'card' ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />}
              {payNote}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink to="/proizvodi" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t('continue')}
            </ButtonLink>
            <ButtonLink to="/" size="lg" variant="outline" icon={<Home className="h-4 w-4" />}>
              {t('home')}
            </ButtonLink>
          </div>

          <Link
            to={`/admin/narudzbe/${order.id}`}
            className="group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-dashed border-ink/20 px-4 py-3.5 text-[13px] text-muted transition-colors hover:border-ink/40 hover:bg-white/60"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-paper">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-semibold text-ink-soft">{t('demo')}</span> {t('demoText')}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-ink group-hover:text-brand-700">
              {t('demoLink')} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-[100px]">
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
              <h2 className="text-[15px] font-bold text-ink">
                {t('summary')} <span className="font-medium text-muted">· {items(count)}</span>
              </h2>
              <span className="text-[13px] font-semibold text-muted">{order.number}</span>
            </div>
            <ul className="divide-y divide-line px-6">
              {order.items.map((it, i) => {
                const u = units(it);
                const inst = it.installation ? Math.round(it.installationPrice * u * 100) / 100 : 0;
                return (
                  <li key={i} className="flex gap-3.5 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand ring-1 ring-line">
                      {it.image && <Img src={it.image} small alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink">{it.name}</p>
                        <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink">{money(it.lineTotal, lang)}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {it.unit === 'm2' && it.packSize ? tk('packsArea', { packs: it.qty, area: num(u, lang) }) : `${it.qty} ${unitLabel(it.unit, lang)}`}
                        {it.options && <span className="block truncate">{it.options}</span>}
                      </p>
                      {inst > 0 && (
                        <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11.5px] font-semibold text-brand-700">
                          <Wrench className="h-3 w-3" />
                          {tk('plusInstallation', { amount: money(inst, lang) })}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line bg-paper/60 px-6 py-5">
              <TotalsRows
                big
                v={{
                  subtotal: order.subtotal,
                  installationTotal: order.installationTotal,
                  discount: order.discount,
                  couponCode: order.coupon?.code,
                  discounts: discountRows,
                  shipping: order.shipping,
                  shippingFree: order.shipping === 0,
                  shippingLabel: pickup ? tc('delivery_pickup') : tc('shipping'),
                  total: order.total,
                  vat: order.vat,
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
