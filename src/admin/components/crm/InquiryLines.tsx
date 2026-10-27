import { useMemo, type ReactNode } from 'react';
import { ClipboardList, FileText, Palette, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Thumb } from '@/admin/components/kit';
import { defineDict, interpolate, useDict, useL, useLang } from '@/i18n';
import { useDb } from '@/store/db';
import { href } from '@/lib/paths';
import { num, unitLabel } from '@/lib/format';
import type { Inquiry, Lang } from '@/lib/types';
import { cn } from '@/lib/utils';
import { quoteRef } from '@/site/components/quote';
import { SectionTitle } from '@/admin/components/contacts/atoms';

/**
 * Multi-product requests from the storefront quote list ("Lista e ofertës", `inquiry.lines`) and colours picked
 * in the colour studio (`inquiry.colors`) — shown in the inquiry drawer, summarised on the inbox rows.
 */
export const IL = defineDict({
  me: {
    products_one: '{n} proizvod',
    products_many: '{n} proizvoda',
    pcs: '{n} kom',
    linesTitle: 'Traženi proizvodi',
    col_product: 'Proizvod',
    col_qty: 'Količina',
    note: 'Napomena',
    removed: 'Proizvod više nije u katalogu',
    createQuote: 'Kreiraj ponudu iz liste',
    createQuoteHint: 'Stavke se prenose u B2B ponudu — cene unosite vi.',
    colorsTitle: 'Izabrane boje',
    surface: 'Površina',
  },
  sq: {
    products_one: '{n} produkt',
    products_many: '{n} produkte',
    pcs: '{n} copë',
    linesTitle: 'Produktet e kërkuara',
    col_product: 'Produkti',
    col_qty: 'Sasia',
    note: 'Shënim',
    removed: 'Produkti nuk është më në katalog',
    createQuote: 'Krijo ofertë nga lista',
    createQuoteHint: 'Linjat kalojnë në ofertën B2B — çmimet i plotësoni ju.',
    colorsTitle: 'Ngjyrat e zgjedhura',
    surface: 'Sipërfaqja',
  },
  en: {
    products_one: '{n} product',
    products_many: '{n} products',
    pcs: '{n} pcs',
    linesTitle: 'Requested products',
    col_product: 'Product',
    col_qty: 'Qty',
    note: 'Note',
    removed: 'Product is no longer in the catalogue',
    createQuote: 'Create quote from list',
    createQuoteHint: 'The lines move into a B2B quote — you fill in the prices.',
    colorsTitle: 'Chosen colours',
    surface: 'Surface',
  },
});

/** "3 produkte · 64 copë" for an inquiry with quote-list lines (null without lines). */
export function linesSummary(q: Pick<Inquiry, 'lines'>, lang: Lang): string | null {
  const lines = q.lines ?? [];
  if (!lines.length) return null;
  const pcs = lines.reduce((s, l) => s + (l.qty || 0), 0);
  const n = lines.length;
  const one = lang === 'me' ? n % 10 === 1 && n % 100 !== 11 : n === 1;
  return `${interpolate(IL[lang][one ? 'products_one' : 'products_many'], { n })} · ${interpolate(IL[lang].pcs, { n: num(pcs, lang) })}`;
}

/** Small inline badge for inbox rows / cards. */
export function LinesBadge({ inquiry: q, className }: { inquiry: Inquiry; className?: string }) {
  const lang = useLang('admin');
  const text = linesSummary(q, lang);
  const colors = q.colors ?? [];
  if (!text && !colors.length) return null;
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft', className)}>
      {text && (
        <span className="inline-flex items-center gap-1 rounded-md bg-ink/[0.06] px-1.5 py-0.5">
          <ClipboardList className="h-3 w-3 shrink-0" /> <span className="truncate">{text}</span>
        </span>
      )}
      {colors.length > 0 && (
        <span className="inline-flex items-center gap-1 rounded-md bg-ink/[0.06] py-0.5 pl-1 pr-1.5">
          <span className="flex -space-x-1">
            {colors.slice(0, 4).map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full ring-1 ring-white" style={{ background: c.hex }} />
            ))}
          </span>
          {colors.length}
        </span>
      )}
    </span>
  );
}

/** Product table of a quote-list inquiry (+ the hand-off to a B2B quote). */
export function InquiryLinesBlock({ inquiry: q, action }: { inquiry: Inquiry; action?: { onClick: () => void; disabled?: boolean; title?: string } | null }) {
  const t = useDict(IL, 'admin');
  const l = useL('admin');
  const lang = useLang('admin');
  const products = useDb((s) => s.products);
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const lines = q.lines ?? [];
  if (!lines.length) return null;
  return (
    <section>
      <SectionTitle icon={<ClipboardList className="h-3.5 w-3.5" />} aside={<span className="rounded-md border border-line bg-white px-1.5 py-0.5 font-mono text-[11.5px] font-semibold text-ink-soft">{quoteRef(q.id)}</span>}>
        {t('linesTitle')}
      </SectionTitle>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_84px] gap-3 border-b border-line bg-canvas/60 px-4 py-2 text-[12px] font-semibold text-muted">
          <span>{t('col_product')}</span>
          <span className="text-right">{t('col_qty')}</span>
        </div>
        <ul className="divide-y divide-line/70">
          {lines.map((x, i) => {
            const p = byId.get(x.productId);
            const inner: ReactNode = (
              <>
                {p ? (
                  <Thumb src={p.images[0]} className="h-10 w-10 rounded-md" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-dashed border-ink/20 text-muted">
                    <PackageX className="h-4 w-4" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-ink group-hover:underline">{p ? l(p.name) : x.productId}</span>
                  <span className="block truncate text-[12px] text-muted">
                    {p ? [p.sku, x.options].filter(Boolean).join(' · ') : t('removed')}
                  </span>
                  {x.note && (
                    <span className="mt-1 block rounded-md bg-amber-50 px-2 py-1 text-[12px] leading-snug text-amber-900 ring-1 ring-inset ring-amber-600/15">
                      <span className="font-semibold">{t('note')}:</span> {x.note}
                    </span>
                  )}
                </span>
                <span className="w-[84px] shrink-0 text-right text-[14px] font-bold tabular-nums text-ink">
                  {num(x.qty, lang)} <span className="text-[12px] font-medium text-muted">{unitLabel(p?.unit ?? 'kom', lang)}</span>
                </span>
              </>
            );
            return (
              <li key={i}>
                {p ? (
                  <a href={href(`/proizvod/${p.slug}`)} target="_blank" rel="noreferrer" className="group flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-canvas/70">
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-start gap-3 px-4 py-2.5">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/40 px-4 py-2.5">
          <span className="text-[13px] font-bold tabular-nums text-ink">{linesSummary(q, lang)}</span>
          {action && (
            <span title={action.title ?? t('createQuoteHint')}>
              <Button variant="primary" shape="rounded" size="xs" icon={<FileText className="h-3.5 w-3.5" />} disabled={action.disabled} onClick={action.onClick}>
                {t('createQuote')}
              </Button>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/** Colours chosen in the storefront colour studio. */
export function InquiryColorsBlock({ inquiry: q }: { inquiry: Inquiry }) {
  const t = useDict(IL, 'admin');
  const colors = q.colors ?? [];
  if (!colors.length) return null;
  return (
    <section>
      <SectionTitle icon={<Palette className="h-3.5 w-3.5" />}>{t('colorsTitle')}</SectionTitle>
      <ul className="grid gap-2 sm:grid-cols-2">
        {colors.map((c, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5">
            <span className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-inset ring-black/10" style={{ background: c.hex }} />
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold text-ink">{c.name}</span>
              <span className="block truncate text-[12px] text-muted">
                <span className="font-mono uppercase">{c.hex}</span>
                {c.surface && ` · ${t('surface')}: ${c.surface}`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
