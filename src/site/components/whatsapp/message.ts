// Ready-made WhatsApp messages for Denisi Color's "order by message" flow. Everything is plain text
// (WhatsApp shows it as typed), built from the same totals the cart / checkout / order page show.
import { useCallback } from 'react';
import { useDict, useL, useLang } from '@/i18n';
import { common } from '@/i18n/common';
import { useSettings } from '@/store/hooks';
import { money as fmtMoney } from '@/lib/format';
import { zoneForCity, type Totals } from '@/lib/pricing';
import type { DeliveryMethod, Lang, Order, PaymentMethod, Settings } from '@/lib/types';
import { siteDate } from '@/site/components/dates';
import { useDiscountLabel } from '@/site/components/checkout/parts';
import { WA } from './dict';

/** money() with normal spaces — Intl's narrow/no-break spaces look odd once URL-encoded into a chat. */
const money = (v: number, lang: Lang) => fmtMoney(v, lang).replace(/[  ]/g, ' ');

/** Customer details typed into the checkout form (all optional — blanks become "Name: " placeholders). */
export interface WaCustomer {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
  company?: string;
  note?: string;
  delivery?: DeliveryMethod;
  payment?: PaymentMethod;
}

/* ------------------------------------------------------------------ */
/* Opening hours → "online" hint                                        */
/* ------------------------------------------------------------------ */
/** "Hën–Sht 07:00–19:00 · E diel mbyllur" → "Hën–Sht 07–19" (first part, whole hours shortened). */
export function shortHours(text: string) {
  return (text.split('·')[0] ?? '').trim().replace(/(\d{1,2}):00\b/g, '$1').replace(/\s*h\b/, '');
}

/**
 * Is the shop open right now (shop timezone)? Hours come from Settings (first "HH–HH" range in the
 * text); days are Mon–Sat as published on the shop's page.
 */
export function isOpenNow(settings: Pick<Settings, 'hours'> & { timezone?: string }, now = new Date()) {
  const m = /(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/.exec(settings.hours.sq || settings.hours.me || settings.hours.en || '');
  const from = m ? +m[1] * 60 + +(m[2] ?? 0) : 7 * 60;
  let to = m ? +m[3] * 60 + +(m[4] ?? 0) : 19 * 60;
  if (to <= from) to += 12 * 60; // "7am–7pm" style
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: settings.timezone || 'Europe/Belgrade', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    if (get('weekday') === 'Sun') return false;
    const mins = +get('hour') * 60 + +get('minute');
    return mins >= from && mins < to;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Message builders                                                     */
/* ------------------------------------------------------------------ */
/** Builds the cart / checkout order message: numbered lines, discounts, delivery, total, customer block. */
export function useCartMessage() {
  const t = useDict(WA);
  const tc = useDict(common);
  const l = useL();
  const lang = useLang();
  const settings = useSettings();
  const discountLabel = useDiscountLabel();

  return useCallback(
    (totals: Totals, customer?: WaCustomer) => {
      const out: string[] = [t('mGreeting'), ''];
      totals.lines.forEach((line, i) => {
        const name = l(line.product.name) + (line.optionsLabel ? ` (${line.optionsLabel})` : '');
        out.push(`${i + 1}. ${name}`);
        out.push(`   ${line.item.qty} × ${money(line.unitPrice, lang)} = ${money(line.lineTotal, lang)}`);
        if (line.installationTotal > 0) out.push(`   + ${tc('installation')}: ${money(line.installationTotal, lang)}`);
      });
      out.push('');
      for (const a of totals.applied) {
        if (a.kind === 'shipping' || a.amount <= 0) continue;
        out.push(`${t('mDiscount')} – ${discountLabel(a)}${a.code ? ` (${a.code})` : ''}: −${money(a.amount, lang)}`);
      }

      // delivery: pickup · free · exact zone (city known) · range of the zones (estimate)
      const zone = zoneForCity(settings, customer?.city);
      const fees = settings.shippingZones.map((z) => z.fee);
      let ship: string;
      if (totals.freeShippingReason === 'pickup') ship = t('mPickup', { address: settings.pickupAddress });
      else if (totals.freeShippingReason || totals.shipping === 0) ship = `${t('mShipping')}: ${t('mShipFree')}`;
      else if (zone) ship = `${t('mShipping')}: ${t('mShipZone', { fee: money(totals.shipping, lang), zone: zone.name, days: zone.days })}`;
      else if (fees.length > 1 && Math.min(...fees) !== Math.max(...fees))
        ship = `${t('mShipping')}: ${t('mShipRange', { min: money(Math.min(...fees), lang), max: money(Math.max(...fees), lang) })}`;
      else ship = `${t('mShipping')}: ${money(totals.shipping, lang)}`;
      out.push(ship);
      out.push(`*${totals.shippingEstimate ? t('mTotalEst') : t('mTotal')}: ${money(totals.total, lang)}*`);
      out.push(t('mVat', { rate: settings.vatRate }));
      out.push('');

      // customer block — filled from the checkout form, otherwise blank placeholders to complete in the chat
      const c = customer ?? {};
      const name = [c.firstName, c.lastName].map((s) => s?.trim()).filter(Boolean).join(' ');
      out.push(t('mFill'));
      out.push(`${t('mName')}: ${name}`);
      if (c.company?.trim()) out.push(`${t('mCompany')}: ${c.company.trim()}`);
      if (c.phone?.trim()) out.push(`${t('mPhone')}: ${c.phone.trim()}`);
      out.push(`${t('mCity')}: ${c.city ?? ''}`);
      if (c.delivery !== 'pickup') out.push(`${t('mAddress')}: ${c.address?.trim() ?? ''}`);
      if (c.delivery) out.push(`${t('mDelivery')}: ${tc(`delivery_${c.delivery}`)}`);
      if (c.payment) out.push(`${t('mPayment')}: ${tc(`pay_${c.payment}`)}`);
      if (c.note?.trim()) out.push(`${t('mNote')}: ${c.note.trim()}`);
      out.push('');
      out.push(t('mConfirm'));
      return out.join('\n');
    },
    [t, tc, l, lang, settings, discountLabel],
  );
}

/** Message about a placed order: number + date, the lines, total, delivery/payment, then "My question: ". */
export function useOrderMessage() {
  const t = useDict(WA);
  const tc = useDict(common);
  const lang = useLang();
  const settings = useSettings();

  return useCallback(
    (order: Order) => {
      const out: string[] = [t('oGreeting', { n: order.number, date: siteDate(order.createdAt, lang) }), ''];
      order.items.forEach((it, i) => {
        out.push(`${i + 1}. ${it.name}${it.options ? ` (${it.options})` : ''}`);
        out.push(`   ${it.qty} × ${money(it.unitPrice, lang)} = ${money(it.lineTotal, lang)}`);
      });
      out.push('');
      if (order.discount > 0) out.push(`${t('mDiscount')}: −${money(order.discount, lang)}`);
      out.push(
        order.delivery.method === 'pickup'
          ? t('mPickup', { address: settings.pickupAddress })
          : `${t('mShipping')}: ${order.shipping === 0 ? t('mShipFree') : money(order.shipping, lang)}`,
      );
      out.push(`*${t('mTotal')}: ${money(order.total, lang)}*`);
      out.push(`${t('mPayment')}: ${tc(`pay_${order.payment.method}`)}`);
      out.push('');
      const c = order.customer;
      out.push(`${t('mName')}: ${[c.firstName, c.lastName].filter(Boolean).join(' ')}`);
      if (order.delivery.method !== 'pickup') out.push(`${t('mAddress')}: ${[c.address, c.city].filter(Boolean).join(', ')}`);
      out.push('');
      out.push(t('oQuestion'));
      return out.join('\n');
    },
    [t, tc, lang, settings],
  );
}
