// Request-a-price list ("Lista e ofertës") — helpers shared by the product page, cards, header drawer and /lista-ofertes.
import { useMemo } from 'react';
import { create } from 'zustand';
import { toast } from 'sonner';
import type { InquiryLine, Lang, Product, QuoteListItem } from '@/lib/types';
import { interpolate, lt, useDict, useL, useLang } from '@/i18n';
import { useUi } from '@/store/ui';
import { useDb } from '@/store/db';
import { optionsLabel } from '@/lib/pricing';
import { date, num } from '@/lib/format';
import { pluralOne } from '@/site/components/utility/shared';
import { QL } from './dict';

/** Highest quantity per line (the stepper's input is sized for three digits). */
export const MAX_QTY = 999;

/* ------------------------------------------------------------------ */
/* Product-page quantity for the list                                   */
/* ------------------------------------------------------------------ */
/**
 * The quantity a shopper picks for the quote list on a product page, shared by the buy box and the sticky bar.
 * Kept apart from the cart configurator on purpose: a contractor may ask for more pieces than the shop
 * shows in stock — availability is part of the answer, not a limit.
 */
const useDraftStore = create<{ qty: Record<string, number>; set: (id: string, n: number) => void }>()((set) => ({
  qty: {},
  set: (id, n) => set((s) => ({ qty: { ...s.qty, [id]: Math.min(MAX_QTY, Math.max(1, Math.round(n) || 1)) } })),
}));

export function useDraftQty(productId: string): [number, (n: number) => void] {
  const qty = useDraftStore((s) => s.qty[productId] ?? 1);
  const set = useDraftStore((s) => s.set);
  return [qty, (n: number) => set(productId, n)];
}

/* ------------------------------------------------------------------ */
/* Resolved lines                                                       */
/* ------------------------------------------------------------------ */
export interface QuoteLineView {
  item: QuoteListItem;
  product: Product;
}

/** The shopper's list with products resolved (unpublished or deleted products are skipped). */
export function useQuoteLines(): QuoteLineView[] {
  const list = useUi((s) => s.quoteList);
  const products = useDb((s) => s.products);
  return useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return list.flatMap((item) => {
      const product = byId.get(item.productId);
      return product && product.status === 'active' ? [{ item, product }] : [];
    });
  }, [list, products]);
}

/** "3 produkte · 64 copë" */
export function listSummary(lines: { item: { qty: number } }[], lang: Lang) {
  const tr = (k: keyof (typeof QL)['me'], vars?: Record<string, string | number>) => interpolate(QL[lang][k], vars);
  const n = lines.length;
  const pcs = lines.reduce((s, l) => s + l.item.qty, 0);
  return `${tr(pluralOne(n, lang) ? 'products_one' : 'products_many', { n })} · ${tr('pcs', { n: num(pcs, lang) })}`;
}

export function useListSummary(lines: QuoteLineView[]) {
  const lang = useLang();
  return listSummary(lines, lang);
}

/* ------------------------------------------------------------------ */
/* Message text — WhatsApp (shopper's language) and the CMS summary (sq) */
/* ------------------------------------------------------------------ */
export interface QuoteContact {
  name?: string;
  company?: string;
  city?: string;
  /** Delivery / pickup preference, already as text */
  delivery?: string;
  /** yyyy-mm-dd */
  neededBy?: string;
  message?: string;
  ref?: string;
}

/**
 * Numbered, WhatsApp-friendly list:
 *   1. Ndriçues tavani LED 36W — 40 copë
 *      Ngjyra e trupit: E bardhë
 *      Shënim: për korridoret
 */
export function quoteText(lines: QuoteLineView[], contact: QuoteContact, lang: Lang, opts: { shop: string; intro?: 'hello' | 'request' }) {
  const tr = (k: keyof (typeof QL)['me'], vars?: Record<string, string | number>) => interpolate(QL[lang][k], vars);
  const out: string[] = [];
  if (opts.intro !== 'request') out.push(tr('m_hello', { shop: opts.shop }), '');
  lines.forEach(({ item, product }, i) => {
    out.push(`${i + 1}. ${lt(product.name, lang)} — ${tr('pcs', { n: num(item.qty, lang) })}`);
    const o = optionsLabel(product, item.options, lang);
    if (o) out.push(`   ${o}`);
    if (item.note?.trim()) out.push(`   ${tr('note')}: ${item.note.trim()}`);
  });
  out.push('', tr('m_total', { summary: listSummary(lines, lang) }));
  const who = [contact.name?.trim(), contact.company?.trim() && `(${contact.company.trim()})`].filter(Boolean).join(' ');
  if (who) out.push(`${tr('m_name')}: ${who}`);
  const where = [contact.city, contact.delivery].filter(Boolean).join(' · ');
  if (where) out.push(`${tr('m_city')}: ${where}`);
  if (contact.neededBy) out.push(`${tr('m_needed')}: ${date(contact.neededBy, lang)}`);
  if (contact.message?.trim()) out.push('', `${tr('m_message')}: ${contact.message.trim()}`);
  if (contact.ref) out.push('', `${tr('m_ref')} ${contact.ref}`);
  return out.join('\n');
}

/** Lines as stored on the CMS inquiry — option summary in the shop's language (Albanian). */
export function inquiryLines(lines: QuoteLineView[], lang: Lang = 'sq'): InquiryLine[] {
  return lines.map(({ item, product }) => {
    const options = optionsLabel(product, item.options, lang);
    return { productId: product.id, qty: item.qty, ...(options ? { options } : {}), ...(item.note?.trim() ? { note: item.note.trim() } : {}) };
  });
}

/* ------------------------------------------------------------------ */
/* Add to list (+ toast with "Shiko listën")                             */
/* ------------------------------------------------------------------ */
export function useAddToQuote() {
  const t = useDict(QL);
  const l = useL();
  const lang = useLang();
  const add = useUi((s) => s.addToQuote);
  const setOpen = useUi((s) => s.setQuoteOpen);
  return (product: Product, qty: number, options: Record<string, string>) => {
    add({ productId: product.id, qty, options });
    const opts = optionsLabel(product, options, lang);
    toast.success(t('added'), {
      description: [l(product.name), opts, t('pcs', { n: num(qty, lang) })].filter(Boolean).join(' · '),
      action: { label: t('viewList'), onClick: () => setOpen(true) },
    });
  };
}

/** Pieces of this product already in the list (any options). */
export function useQtyInList(productId: string) {
  return useUi((s) => s.quoteList.reduce((n, q) => (q.productId === productId ? n + q.qty : n), 0));
}
