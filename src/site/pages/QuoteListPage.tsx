import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ClipboardList, Info, MessageSquareText, PackageSearch, RotateCcw, Send, ShieldCheck, Store, Trash2, Truck } from 'lucide-react';
import { Accent } from '@/components/ui/misc';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { WhatsAppIcon } from '@/components/brand/Social';
import { Breadcrumbs } from '@/site/components/SectionHeading';
import { ProductGrid } from '@/site/components/utility/ProductGrid';
import { AdImage } from '@/site/components/AdImage';
import { needsQuote, quoteRef, waDigits, waHref } from '@/site/components/quote';
import { QL } from '@/site/components/quotelist/dict';
import { QuoteLine } from '@/site/components/quotelist/QuoteLine';
import { inquiryLines, listSummary, quoteText, useQuoteLines, type QuoteContact, type QuoteLineView } from '@/site/components/quotelist/shared';
import { usePageTitle } from '@/site/layout/SiteLayout';
import { useDict, useL, useLang } from '@/i18n';
import { site } from '@/i18n/site';
import { useUi } from '@/store/ui';
import { useDb, type InquiryInput } from '@/store/db';
import { useActiveProducts, useSettings } from '@/store/hooks';
import { allCities, optionsLabel } from '@/lib/pricing';
import { num, unitLabel } from '@/lib/format';
import type { Inquiry, Product } from '@/lib/types';
import { cn } from '@/lib/utils';

type Delivery = 'delivery' | 'pickup';
interface Sent {
  ref: string;
  name: string;
  phone: string;
  lines: QuoteLineView[];
  contact: QuoteContact;
}

const EMPTY_FORM = { name: '', phone: '', company: '', email: '', city: '', delivery: 'delivery' as Delivery, neededBy: '', message: '' };

/** /lista-ofertes — the shopper's request-a-price list, sent as ONE enquiry (CMS inbox) or as one WhatsApp message. */
export default function QuoteListPage() {
  const tq = useDict(QL);
  const lang = useLang();
  const lines = useQuoteLines();
  const [sent, setSent] = useState<Sent | null>(null);
  usePageTitle(tq('listTitle'));

  const clearAll = () => {
    const prev = useUi.getState().quoteList;
    useUi.getState().clearQuote();
    toast(tq('cleared'), { action: { label: tq('undo'), onClick: () => useUi.setState({ quoteList: prev }) } });
  };

  const empty = lines.length === 0;

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-x pb-10 pt-8 sm:pb-14 sm:pt-12">
          <Breadcrumbs items={[{ label: tq('listTitle') }]} />
          <div className="mt-8 flex flex-col gap-6 sm:mt-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">{tq('eyebrow')}</div>
              <h1 className="display flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[40px] leading-[1.04] text-ink sm:text-[56px]">
                <Accent text={tq('title')} />
                {!empty && !sent && <span className="translate-y-[-0.35em] rounded-full bg-amber-400 px-3 py-1 font-sans text-[13px] font-bold tracking-normal text-brand-900 sm:text-[14px]">{listSummary(lines, lang)}</span>}
              </h1>
              <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{tq('subtitle')}</p>
            </div>
            {!empty && !sent && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Button variant="ghost" onClick={clearAll} icon={<Trash2 className="h-4 w-4" />} className="text-ink-soft hover:text-brand-700 max-md:-ml-4">
                  {tq('clearAll')}
                </Button>
                <ButtonLink to="/proizvodi" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                  {tq('keepBrowsing')}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-x pb-8 pt-10 sm:pt-14">
        {sent ? (
          <Success sent={sent} onRestore={() => setSent(null)} />
        ) : empty ? (
          <Empty />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <ListCard lines={lines} />
              <p className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-[13.5px] leading-relaxed text-brand-900 ring-1 ring-brand-100">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {tq('honest')}
              </p>
              <HowItWorks className="mt-10 max-lg:hidden" />
            </div>
            <div className="lg:col-span-5 lg:sticky lg:top-[100px]">
              <RequestForm lines={lines} onSent={setSent} />
            </div>
            <HowItWorks className="lg:hidden" />
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
function ListCard({ lines }: { lines: QuoteLineView[] }) {
  const tq = useDict(QL);
  const lang = useLang();
  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-2 text-[16px] font-bold text-ink">
          <ClipboardList className="h-[18px] w-[18px] text-brand-600" /> {tq('itemsTitle')}
        </h2>
        <span className="text-[13px] font-semibold tabular-nums text-muted">{listSummary(lines, lang)}</span>
      </header>
      <div className="divide-y divide-line px-5 sm:px-6">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div key={line.item.key} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <QuoteLine line={line} size="page" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <footer className="border-t border-line bg-paper/60 px-5 py-3.5 sm:px-6">
        <Link to="/proizvodi" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-soft hover:text-ink">
          + {tq('keepBrowsing')}
        </Link>
      </footer>
    </section>
  );
}

function HowItWorks({ className }: { className?: string }) {
  const tq = useDict(QL);
  const steps = [
    { icon: Send, text: tq('how1') },
    { icon: MessageSquareText, text: tq('how2') },
    { icon: CheckCircle2, text: tq('how3') },
  ];
  return (
    <section className={cn('lg:col-span-7', className)}>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted">{tq('howTitle')}</h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="relative rounded-2xl bg-white p-4 ring-1 ring-line">
            <span className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-900 text-amber-400">
                <s.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="font-display text-[22px] font-extrabold tabular-nums text-ink/10">0{i + 1}</span>
            </span>
            <span className="mt-3 block text-[13.5px] font-semibold leading-snug text-ink">{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function RequestForm({ lines, onSent }: { lines: QuoteLineView[]; onSent: (s: Sent) => void }) {
  const tq = useDict(QL);
  const t = useDict(site);
  const lang = useLang();
  const settings = useSettings();
  const addInquiry = useDb((s) => s.addInquiry);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [waOpened, setWaOpened] = useState(false);
  const set = (k: keyof typeof EMPTY_FORM) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);
  const opt = (label: string) => (
    <>
      {label} <span className="font-normal text-muted">({tq('optional')})</span>
    </>
  );

  /** Contact block of the message, in a given language. */
  const contactIn = (l: typeof lang): QuoteContact => ({
    name: form.name,
    company: form.company,
    city: form.city,
    delivery: QL[l][form.delivery === 'pickup' ? 'del_pickup' : 'del_delivery'],
    neededBy: form.neededBy || undefined,
    message: form.message,
  });
  const waText = quoteText(lines, contactIn(lang), lang, { shop: settings.companyName });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = t('f_required');
    if (!form.phone.trim()) err.phone = t('f_required');
    else if (form.phone.replace(/\D/g, '').length < 8) err.phone = t('f_invalidPhone');
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));
    // The shop reads the summary in Albanian; the structured lines drive the CMS table and the B2B quote.
    const sq = contactIn('sq');
    const summary = quoteText(lines, { city: sq.city, delivery: sq.delivery, neededBy: sq.neededBy }, 'sq', { shop: settings.companyName, intro: 'request' });
    const input: InquiryInput & Pick<Inquiry, 'lines' | 'tags'> = {
      type: 'quote',
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      city: form.city || undefined,
      company: form.company.trim() || undefined,
      preferredDate: form.neededBy || undefined,
      message: [form.message.trim(), `${QL.sq.m_request}:\n${summary}`].filter(Boolean).join('\n\n'),
      lines: inquiryLines(lines, 'sq'),
      tags: ['lista-ofertes', form.delivery === 'pickup' ? 'merr-ne-dyqan' : 'dergese'],
    };
    const inq = addInquiry(input);
    const snapshot = lines.map((x) => ({ item: { ...x.item }, product: x.product }));
    useUi.getState().clearQuote();
    setBusy(false);
    onSent({ ref: quoteRef(inq.id), name: form.name.trim().split(' ')[0], phone: form.phone.trim(), lines: snapshot, contact: contactIn(lang) });
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-5 ring-1 ring-line shadow-[0_30px_60px_-40px_rgba(19,36,59,0.35)] sm:p-7">
      <h2 className="display text-[26px] leading-tight text-ink">{tq('formTitle')}</h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{tq('formText')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label={t('f_name')} required value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Input label={t('f_phone')} required type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+383 4_ ___ ___" autoComplete="tel" />
        <Input label={opt(tq('f_company'))} value={form.company} onChange={set('company')} autoComplete="organization" />
        <Input label={opt(t('f_email'))} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        <Select label={t('f_city')} value={form.city} onChange={set('city')}>
          <option value="">{t('f_chooseCity')}</option>
          {allCities(settings).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input label={opt(tq('f_neededBy'))} type="date" min={today} value={form.neededBy} onChange={set('neededBy')} />
        <div className="sm:col-span-2">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{tq('f_delivery')}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            <Choice on={form.delivery === 'delivery'} onClick={() => setForm((f) => ({ ...f, delivery: 'delivery' }))} icon={<Truck className="h-4 w-4" />} title={tq('del_delivery')} text={tq('del_deliveryText')} />
            <Choice on={form.delivery === 'pickup'} onClick={() => setForm((f) => ({ ...f, delivery: 'pickup' }))} icon={<Store className="h-4 w-4" />} title={tq('del_pickup')} text={settings.pickupAddress} />
          </div>
        </div>
        <Textarea label={opt(t('f_message'))} rows={3} value={form.message} onChange={set('message')} placeholder={tq('f_messagePh')} wrapClassName="sm:col-span-2" />
      </div>

      <Button type="submit" size="lg" loading={busy} className="mt-6 w-full" iconRight={<Send className="h-4 w-4" />}>
        {tq('submit')}
      </Button>
      {waDigits(settings) && (
        <>
          <div className="my-3 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="h-px flex-1 bg-line" />
            {tq('or')}
            <span className="h-px flex-1 bg-line" />
          </div>
          <a
            href={waHref(settings, waText)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setWaOpened(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#1f9d55] text-[15px] font-semibold text-white shadow-[0_10px_24px_-14px_#1f9d55] transition-colors hover:bg-[#178246]"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" /> {tq('sendWa')}
          </a>
          <AnimatePresence>
            {waOpened && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-[#1f9d55]/[0.07] p-3 text-[12.5px] leading-snug text-ink-soft ring-1 ring-[#1f9d55]/20">
                  <Info className="mt-px h-4 w-4 shrink-0 text-[#178246]" />
                  <span className="flex-1">{tq('waOpened')}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setWaOpened(false);
                      useUi.getState().clearQuote();
                    }}
                    className="shrink-0 font-semibold text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-ink"
                  >
                    {tq('waClear')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      <ul className="mt-5 space-y-1.5 text-[12px] text-muted">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {tq('free')}
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-600" /> {t('f_privacy')}
        </li>
      </ul>
    </form>
  );
}

function Choice({ on, onClick, icon, title, text }: { on: boolean; onClick: () => void; icon: ReactNode; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all',
        on ? 'border-brand-600 bg-brand-50/70 shadow-[0_0_0_1px_var(--color-brand-600)]' : 'border-line bg-white hover:border-ink/30',
      )}
    >
      <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', on ? 'bg-brand-600 text-white' : 'bg-sand text-ink-soft')}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-bold leading-tight text-ink">{title}</span>
        <span className="mt-0.5 block truncate text-[12px] text-muted">{text}</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
function Success({ sent, onRestore }: { sent: Sent; onRestore: () => void }) {
  const tq = useDict(QL);
  const l = useL();
  const lang = useLang();
  const settings = useSettings();
  const steps = [tq('next1'), tq('next2'), tq('next3')];
  const ref = useRef<HTMLDivElement>(null);

  // Bring the confirmation into view (the form may have been far down the page, especially on phones)
  useEffect(() => {
    const el = ref.current;
    if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96), behavior: 'smooth' });
  }, []);

  const restore = () => {
    const keys = new Set(sent.lines.map((x) => x.item.key));
    useUi.setState((s) => ({ quoteList: [...s.quoteList.filter((q) => !keys.has(q.key)), ...sent.lines.map((x) => x.item)] }));
    toast.success(tq('restored'));
    onRestore();
  };

  return (
    <div ref={ref} className="mx-auto max-w-5xl animate-fade-up">
      <div className="overflow-hidden rounded-[32px] bg-white ring-1 ring-line">
        <div className="bg-stripes relative bg-brand-900 px-6 py-10 text-center text-paper sm:px-10 sm:py-12">
          <span className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-full bg-amber-400 text-brand-900">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="display mt-5 text-[34px] leading-tight sm:text-[44px]">{tq('successTitle', { name: sent.name })}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-paper/75">{tq('successText', { phone: sent.phone })}</p>
          <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-dashed border-amber-400/60 bg-white/[0.06] px-6 py-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">{tq('ref')}</span>
            <span className="mt-1 font-mono text-[24px] font-bold tracking-[0.08em] text-white">{sent.ref}</span>
            <span className="mt-0.5 text-[12px] text-paper/60">{tq('refHint')}</span>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <section>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted">{tq('nextTitle')}</h3>
            <ol className="mt-4 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-900 text-[13px] font-bold tabular-nums text-amber-400">{i + 1}</span>
                  <span className="pt-1 text-[14.5px] font-semibold leading-snug text-ink">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-start gap-2.5 rounded-2xl bg-paper p-3.5 text-[12.5px] leading-relaxed text-muted ring-1 ring-line">
              <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-brand-600" />
              {tq('honest')}
            </p>
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted">{tq('sentCopy')}</h3>
              <span className="text-[12.5px] font-semibold tabular-nums text-ink-soft">{listSummary(sent.lines, lang)}</span>
            </div>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl ring-1 ring-line">
              {sent.lines.map(({ item, product: p }) => {
                const opts = optionsLabel(p, item.options, lang);
                return (
                  <li key={item.key} className="flex items-center gap-3 bg-white px-3.5 py-3">
                    <AdImage src={p.images[0]} small className="h-11 w-11 shrink-0 rounded-lg ring-1 ring-line" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-ink">{l(p.name)}</span>
                      {(opts || item.note) && <span className="block truncate text-[12px] text-muted">{[opts, item.note && `${tq('note')}: ${item.note}`].filter(Boolean).join(' · ')}</span>}
                    </span>
                    <span className="shrink-0 text-[13.5px] font-bold tabular-nums text-ink">
                      {num(item.qty, lang)} <span className="font-medium text-muted">{unitLabel(p.unit, lang)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-line bg-paper/60 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:px-8">
          <ButtonLink to="/proizvodi" iconRight={<ArrowRight className="h-4 w-4" />}>
            {tq('backShop')}
          </ButtonLink>
          {waDigits(settings) && (
            <a
              href={waHref(settings, quoteText(sent.lines, { ...sent.contact, ref: sent.ref }, lang, { shop: settings.companyName }))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#1f9d55]/30 bg-white px-5 text-sm font-semibold text-[#178246] transition-colors hover:bg-[#1f9d55]/[0.06]"
            >
              <WhatsAppIcon className="h-4 w-4" /> {tq('waCopy')}
            </a>
          )}
          <Button variant="ghost" onClick={restore} icon={<RotateCcw className="h-4 w-4" />} className="sm:ml-auto">
            {tq('restore')}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Empty() {
  const tq = useDict(QL);
  const products = useActiveProducts();
  // Featured request-a-price products, one per category first — what contractors ask about most
  const suggestions = useMemo(() => {
    const quote = [...products.filter(needsQuote)].sort((a, b) => Number(b.featured) - Number(a.featured));
    const seen = new Set<string>();
    const first = quote.filter((p) => (seen.has(p.categoryId) ? false : (seen.add(p.categoryId), true)));
    return [...first, ...quote.filter((p) => !first.includes(p))].slice(0, 4) as Product[];
  }, [products]);
  return (
    <>
      <div className="mx-auto flex max-w-xl animate-fade-up flex-col items-center py-6 text-center sm:py-10">
        <span className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 rounded-full bg-amber-100" />
          <span className="absolute inset-3 rounded-full bg-amber-50 ring-1 ring-amber-200" />
          <ClipboardList className="relative h-9 w-9 text-brand-700" strokeWidth={1.6} />
        </span>
        <h2 className="display mt-7 text-[34px] leading-[1.06] text-ink sm:text-[44px]">
          <Accent text={tq('emptyHeading')} />
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">{tq('emptyText')}</p>
        <ButtonLink to="/proizvodi" size="lg" className="mt-8" icon={<PackageSearch className="h-4 w-4" />}>
          {tq('emptyCta')}
        </ButtonLink>
      </div>
      {suggestions.length > 0 && (
        <section className="mt-16 border-t border-line pt-14 sm:mt-20 sm:pt-16">
          <h2 className="display mb-8 text-[30px] leading-[1.05] text-ink sm:text-[40px]">
            <Accent text={tq('popular')} />
          </h2>
          <ProductGrid products={suggestions} />
        </section>
      )}
    </>
  );
}
