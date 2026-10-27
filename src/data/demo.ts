// Realistic demo activity (orders + inquiries) so the CMS dashboard looks alive.
// Deterministic for a given seed, always relative to "now". All people and companies are fictional.
import type { CartItem, Collection, Customer, Discount, Inquiry, Lang, Order, OrderEvent, OrderStatus, PaymentMethod, Product, Settings } from '@/lib/types';
import { priceCart, defaultOptions } from '@/lib/pricing';
import { lt } from '@/i18n';
import { pick, rng, slugify, weighted } from '@/lib/utils';

// Albanian first names (staff names left out so customers never look like the team)
const FIRST = [
  'Arben', 'Blerta', 'Driton', 'Fatjona', 'Kushtrim', 'Liridona', 'Valon', 'Besart', 'Egzona', 'Granit', 'Shpend', 'Teuta', 'Ilir', 'Vjosa',
  'Agron', 'Fitore', 'Labinot', 'Donika', 'Bekim', 'Rinor', 'Albana', 'Leutrim', 'Dafina', 'Florent', 'Edona', 'Dardan', 'Lirie', 'Astrit',
];
const LAST = [
  'Krasniqi', 'Berisha', 'Gashi', 'Hoxha', 'Shala', 'Morina', 'Bytyqi', 'Kryeziu', 'Rexhepi', 'Avdiu', 'Hasani', 'Mustafa', 'Zeka', 'Sadiku',
  'Musliu', 'Ramadani', 'Ahmeti', 'Thaçi', 'Kastrati', 'Halimi', 'Osmani', 'Salihu', 'Kurtishi', 'Islami',
];
/** A few Serbian, Bosniak and Turkish customers — first and last names kept together. */
const OTHER: [string, string][] = [['Nikola', 'Petrović'], ['Jelena', 'Stojanović'], ['Emir', 'Hadžić'], ['Selin', 'Yıldız'], ['Dejan', 'Marković'], ['Amra', 'Mehmeti']];
const SERBIAN = new Set(['Petrović', 'Stojanović', 'Marković']);
const STREETS = [
  'Rr. Adem Jashari', 'Rr. Skënderbeu', 'Rr. Dëshmorët e Kombit', 'Rr. Nëna Terezë', 'Rr. Ismail Qemali', 'Rr. Fehmi Agani', 'Rr. Agim Ramadani',
  'Rr. Isa Boletini', 'Rr. Lidhja e Prizrenit', 'Rr. Ibrahim Rugova', 'Rr. Bajram Curri', 'Rr. Naim Frashëri', 'Rr. Ilir Konushevci', 'Rr. Hasan Prishtina',
];
/** Weighted by distance from the shop — most customers live in delivery zones 1 and 2 (see DEFAULT_SETTINGS). */
const CITIES: (readonly [string, number])[] = [
  ['Shtime', 22], ['Ferizaj', 14], ['Prishtinë', 15], ['Lipjan', 10], ['Suharekë', 4], ['Fushë Kosovë', 5], ['Drenas', 2], ['Podujevë', 2],
  ['Prizren', 5], ['Gjilan', 4], ['Pejë', 3], ['Gjakovë', 3], ['Mitrovicë', 3], ['Vushtrri', 2], ['Kaçanik', 3], ['Malishevë', 2], ['Rahovec', 1],
];
/** Fictional small firms that buy workwear for their crews. */
const COMPANIES = [
  'Shala Ndërtim sh.p.k.', 'Elektro Gashi', 'Berisha Construction', 'Fasada Pro sh.p.k.', 'Termo-Izolim Hoxha', 'Elektro-Instal Morina',
  'Beton Lipjan sh.p.k.', 'Kryeziu Montim', 'Rexhepi Ndërtim sh.p.k.', 'Avdiu Transport', 'Sadiku Gips & Fasada', 'Zeka Metal',
];

function customer(r: () => number, company?: string): Customer {
  const [firstName, lastName] = r() < 0.1 ? pick(OTHER, r) : [pick(FIRST, r), pick(LAST, r)];
  const city = weighted(CITIES, r);
  const digits = () => String(Math.floor(r() * 900) + 100);
  return {
    firstName,
    lastName,
    email: `${slugify(firstName)}.${slugify(lastName)}@example.com`,
    phone: `+383 4${pick(['3', '4', '4', '5', '5', '8', '9'], r)} ${digits()} ${digits()}`,
    city,
    address: `${pick(STREETS, r)} ${Math.floor(r() * 120) + 1}`,
    ...(company ? { company } : {}),
  };
}

/** Crews buy 5–20 pieces of a model (Kapriol fewer — it is the premium top); households 1–2. */
function lineFor(p: Product, crew: boolean, r: () => number): CartItem {
  const options = defaultOptions(p);
  for (const o of p.options) options[o.id] = pick(o.values, r).id;
  let qty: number;
  if (!crew) qty = r() < 0.72 ? 1 : 2;
  else if (p.id === 'p-duks-kapriol') qty = 3 + Math.floor(r() * 6);
  else if (p.id === 'p-duks-pune') qty = 5 + Math.floor(r() * 16);
  else qty = 4 + Math.floor(r() * 10);
  return { key: '', productId: p.id, qty, options, installation: false };
}

function statusFor(ageDays: number, r: () => number): OrderStatus {
  if (ageDays < 0.6) return r() < 0.75 ? 'new' : 'confirmed';
  if (ageDays < 3) return weighted([['confirmed', 4], ['processing', 4], ['new', 1]] as const, r);
  if (ageDays < 9) return weighted([['processing', 3], ['shipped', 5], ['completed', 3], ['cancelled', 0.2]] as const, r);
  if (ageDays < 20) return weighted([['shipped', 2], ['completed', 8], ['cancelled', 0.3]] as const, r);
  return weighted([['completed', 16], ['cancelled', 0.7]] as const, r);
}

/** No installation step for this shop — orders go new → confirmed → processing → shipped → completed. */
const FLOW: OrderStatus[] = ['new', 'confirmed', 'processing', 'shipped', 'completed'];

/**
 * Orders over the last 75 days. Only priced products are sold online (request-a-price products go
 * through enquiries and B2B quotes). Every cart goes through the real pricing + discount engine with
 * the order date as "now", so automatic rules only apply inside their window (e.g. the autumn workwear offer).
 */
export function generateOrders(products: Product[], settings: Settings, discounts: Discount[], collections: Collection[], now = new Date(), seed = 42): Order[] {
  const r = rng(seed);
  const sellable = products.filter((p) => !p.quoteOnly && p.status === 'active');
  const weights = sellable.map((p) => [p, Math.sqrt(p.sold + 5)] as const);
  const orders: Order[] = [];
  const past: Customer[] = [];
  let seq = 1001;
  const DAYS = 75;
  const prefix = settings.orderPrefix || 'DC-';
  if (!sellable.length) return orders;
  for (let day = DAYS; day >= 0; day--) {
    // gentle growth trend (workwear season) + weekly rhythm (shop closed on Sundays, busy Saturdays)
    const date = new Date(now.getTime() - day * 86400000);
    const dow = date.getDay();
    const base = 0.7 + ((DAYS - day) / DAYS) * 0.9;
    const mean = dow === 0 ? base * 0.35 : dow === 6 ? base * 1.15 : base;
    let count = 0;
    const x = r();
    let p = Math.exp(-mean);
    let cdf = p;
    while (x > cdf && count < 5) {
      count++;
      p = (p * mean) / count;
      cdf += p;
    }
    if (day === 0) count = Math.max(count, 3);
    for (let i = 0; i < count; i++) {
      const hour = 7 + Math.floor(r() * 13);
      const created = new Date(date);
      created.setHours(hour, Math.floor(r() * 60), Math.floor(r() * 60), 0);
      if (created > now) created.setTime(now.getTime() - (i + 1) * 47 * 60000);
      const ageDays = (now.getTime() - created.getTime()) / 86400000;

      // about one order in five is a crew / company order
      const crew = r() < 0.22;
      const nLines = crew ? weighted([[1, 3], [2, 4], [3, 1.5]] as const, r) : weighted([[1, 7], [2, 2.5], [3, 0.5]] as const, r);
      const cart: CartItem[] = [];
      const used = new Set<string>();
      for (let k = 0; k < nLines; k++) {
        const prod = weighted(weights, r);
        if (used.has(prod.id)) continue;
        used.add(prod.id);
        cart.push(lineFor(prod, crew, r));
      }
      // shoppers following a live "buy X get Y" promo add the free item themselves (manual mode)
      for (const d of discounts) {
        const b = d.bxgy;
        if (d.kind !== 'bxgy' || !b || d.method !== 'auto' || d.status !== 'active' || b.getScope !== 'products' || new Date(d.startsAt) > created) continue;
        if (d.endsAt && new Date(d.endsAt) <= created) continue;
        const xQty = cart.filter((c) => b.buyScope === 'products' && b.buyIds.includes(c.productId)).reduce((n, c) => n + c.qty, 0);
        const y = products.find((p) => p.id === b.getIds[0]);
        if (y && xQty >= b.buyQty && !cart.some((c) => c.productId === y.id) && r() < 0.7) cart.push({ key: '', productId: y.id, qty: b.getQty * Math.min(b.maxUses || 1, Math.floor(xQty / b.buyQty)), options: defaultOptions(y), installation: false });
      }
      // returning customers: crews re-order, about one household order in eight is a repeat
      const cust = past.length > 4 && r() < (crew ? 0.35 : 0.12) ? { ...pick(past, r) } : customer(r, crew && r() < 0.75 ? pick(COMPANIES, r) : undefined);
      past.push(cust);
      const pickupShare = cust.city === 'Shtime' ? 0.45 : cust.city === 'Lipjan' || cust.city === 'Ferizaj' ? 0.15 : 0.05;
      const delivery = r() < pickupShare ? 'pickup' : 'delivery';
      // Serbian-speaking customers get the Serbian store language; most others shop in Albanian, a few in English
      const roll = r();
      const lang: Lang = SERBIAN.has(cust.lastName) ? 'me' : roll < 0.12 ? 'en' : 'sq';
      // codes people typed: the contractor code on crew orders, the welcome code, and a seasonal code live that day
      const y = r();
      const live = (code: string) => discounts.find((d) => d.code === code && d.status === 'active' && new Date(d.startsAt) <= created && (!d.endsAt || new Date(d.endsAt) > created));
      const seasonal = discounts.find((d) => d.method === 'code' && !['KANTIER', 'MIRESEVINI10'].includes(d.code ?? '') && d.status === 'active' && d.audience.type === 'all' && new Date(d.startsAt) <= created && (!d.endsAt || new Date(d.endsAt) > created));
      const couponCode = crew
        ? y < 0.45 && live('KANTIER') ? 'KANTIER' : null
        : y < 0.1 && live('MIRESEVINI10') ? 'MIRESEVINI10' : y < 0.3 && seasonal ? seasonal.code! : null;
      const totals = priceCart(cart, products, settings, { lang, couponCode, discounts, collections, delivery, city: cust.city, now: created });
      if (!totals.lines.length) continue;
      const payMethod: PaymentMethod = crew ? weighted([['bank', 6], ['cod', 3], ['card', 1]] as const, r) : weighted([['cod', 6.5], ['card', 2], ['bank', 1.5]] as const, r);
      const status = statusFor(ageDays, r);

      const idx = FLOW.indexOf(status);
      const timeline: OrderEvent[] = [{ at: created.toISOString(), status: 'new', by: 'web' }];
      if (status === 'cancelled') {
        timeline.push({ at: new Date(created.getTime() + 5 * 3600000).toISOString(), status: 'cancelled', note: 'Klienti e anuloi me telefon', by: 'admin' });
      } else {
        for (let s = 1; s <= idx; s++) {
          const at = new Date(created.getTime() + s * Math.min(ageDays / (idx + 1), 1.6) * 86400000);
          timeline.push({ at: at.toISOString(), status: FLOW[s], by: 'admin' });
        }
      }
      const paid = payMethod === 'card' ? true : payMethod === 'bank' ? idx >= 1 : status === 'completed';
      orders.push({
        id: `o_${seq}`,
        number: `${prefix}${seq}`,
        createdAt: created.toISOString(),
        status,
        customer: cust,
        items: totals.lines.map((l) => ({
          productId: l.product.id,
          sku: l.product.sku,
          name: lt(l.product.name, lang),
          image: l.product.images[0] ?? '',
          unit: l.product.unit,
          packSize: l.product.packSize,
          qty: l.item.qty,
          options: l.optionsLabel,
          unitPrice: l.unitPrice,
          installation: false,
          installationPrice: 0,
          lineTotal: l.lineTotal,
          discount: l.discount,
          allocations: l.allocations,
        })),
        delivery: { method: delivery, fee: totals.shipping },
        payment: { method: payMethod, status: status === 'cancelled' ? (paid && payMethod === 'card' ? 'refunded' : 'pending') : paid ? 'paid' : 'pending' },
        coupon: totals.coupon ? { code: totals.coupon.code, discount: totals.discount } : null,
        discounts: totals.applied,
        shippingBeforeDiscount: totals.shippingBeforeDiscount,
        subtotal: totals.subtotal,
        installationTotal: 0,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        vat: totals.vat,
        lang,
        timeline,
        seen: ageDays > 0.6,
        demo: true,
        ...(status === 'shipped' || status === 'completed'
          ? { fulfillment: { shippedAt: timeline.find((e) => e.status === 'shipped')?.at ?? created.toISOString(), ...(status === 'completed' ? { deliveredAt: timeline[timeline.length - 1].at } : {}) } }
          : {}),
      });
      seq++;
    }
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Enquiries as they arrive by web form, phone and WhatsApp: price requests for request-a-price products,
 * paint & facade questions, B2B requests — mostly Albanian, some English and Serbian.
 */
const INQ_MSG: { type: Inquiry['type']; service?: string; productId?: string; message: string }[] = [
  { type: 'quote', service: 'Ndriçim LED', productId: 'p-ndricues-tavani-36w', message: 'Përshëndetje, sa kushton ndriçuesi i tavanit 36W? Më duhen 14 copë për shtëpinë e re në Lipjan. A e keni edhe me ngjyrë të zezë?' },
  { type: 'quote', service: 'Kundër zjarrit', productId: 'p-bombol-abc', message: 'Pershendetje! Sa e keni bombolen ABC 2 kg per veture? Edhe nje 5 kg per punetori. Faleminderit' },
  { type: 'measurement', service: 'Ngjyra & fasada', message: 'Po e rregulloj fasadën e shtëpisë, rreth 180 m². Dua një konsultë për ngjyrat dhe materialet e fasadës — a mund të vij në dyqan të shtunën paradite?' },
  { type: 'quote', service: 'Vegla Bosch', productId: 'p-disk-bosch-sandwich', message: 'Disku Bosch për panele sandwich 270 mm — a e keni në stok dhe sa kushton? Na duhen 4 copë për montim në Ferizaj.' },
  { type: 'contact', message: 'A dërgoni në Pejë? Dua 2 duksa pune të zeza, madhësia XL, me pagesë në dorëzim.' },
  { type: 'quote', service: 'Ngrohje', productId: 'p-kamina-dru', message: 'Sa kushton kamina me dru, Modeli 2? A e sillni deri në Malishevë dhe sa kushton transporti?' },
  { type: 'measurement', service: 'Ndriçim LED', message: 'Kemi një oborr rreth 600 m² dhe na duhet ndriçim rrugor LED. A mund të vijë dikush ta shohë vendin dhe të na japë ofertë?' },
  { type: 'quote', service: 'LED shirita', productId: 'p-led-shirit', message: 'Dua LED shirit 3000K për kuzhinë, rreth 6 metra, edhe profile alumini me kapak. Sa del gjithsej?' },
  { type: 'quote', service: 'Kopshti', productId: 'p-bosch-art23', message: 'Dobar dan, da li imate Bosch ART 23 SL trimer na stanju i koja je cena? Hvala.' },
  { type: 'contact', message: 'Hi, do you have the Kapriol work top in XXL? I am ordering for a crew of 8 in Prishtina — is there a discount for 8 pieces?' },
  { type: 'quote', service: 'Vegla', productId: 'p-karroce-parkside', message: 'Sa kushton karroca PARKSIDE e palosshme? E dua për depo, a mban vërtet 100 kg?' },
  { type: 'contact', message: 'A jeni hapur të dielën? Dua të kaloj për jakne softshell.' },
  { type: 'measurement', service: 'Ngjyra & fasada', message: 'Na duhen ngjyra për lyerjen e brendshme të një banese 90 m² në Ferizaj — a mund të na ndihmoni me zgjedhjen e nuancave dhe sasinë e bojës?' },
];

export function generateInquiries(now = new Date(), seed = 7): Inquiry[] {
  const r = rng(seed);
  return INQ_MSG.map((m, i) => {
    const ageHours = i === 0 ? 2.5 : i === 1 ? 9 : Math.floor(14 + r() * 28 * 24);
    const created = new Date(now.getTime() - ageHours * 3600000);
    const c = customer(r);
    const ageDays = ageHours / 24;
    const status: Inquiry['status'] = ageDays < 1 ? 'new' : ageDays < 4 ? (r() < 0.5 ? 'contacted' : 'scheduled') : ageDays < 12 ? (r() < 0.6 ? 'scheduled' : 'done') : 'done';
    const scheduledAt = status === 'scheduled' ? new Date(now.getTime() + (1 + Math.floor(r() * 5)) * 86400000).toISOString() : undefined;
    return {
      id: `inq_${100 + i}`,
      createdAt: created.toISOString(),
      type: m.type,
      name: `${c.firstName} ${c.lastName}`,
      phone: c.phone,
      email: c.email,
      city: c.city,
      service: m.service,
      productId: m.productId,
      message: m.message,
      preferredDate: m.type === 'measurement' ? new Date(now.getTime() + (2 + i) * 86400000).toISOString().slice(0, 10) : undefined,
      status,
      seen: status !== 'new',
      scheduledAt,
    } satisfies Inquiry;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
