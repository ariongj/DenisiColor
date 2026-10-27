// CMS v2 demo data — collections, discounts, offers, placements, staff, appointments, segments,
// inventory, purchasing, drafts, returns, quotes, menus, content models and the audit log.
// Everything is relative to `now` so the demo always looks current, and coherent with the
// Denisi Color catalogue (workwear, Bosch tools, LED lighting, stoves, fire extinguishers) in Shtime, Kosovo.
// People, companies, orders and quotes are fictional; prices on request-a-price products appear only
// inside internal records (B2B quotes, purchase costs), never on the storefront.
import type {
  AuditEntry, Booking, Collection, ContentModel, Discount, DraftOrder, HomeSection, HomeVersion, Inquiry, InventoryMovement, L10n,
  Menu, Offer, Order, Placement, Product, Project, PurchaseOrder, Quote, ReturnRequest, Segment, Service, Staff,
} from '@/lib/types';
import { defaultOptions } from '@/lib/pricing';
import { refundForLines } from '@/lib/orders';
import { round2, slugify } from '@/lib/utils';

const T = (me: string, sq: string, en: string): L10n => ({ me, sq, en });
const E = (): L10n => ({ me: '', sq: '', en: '' });
const DAY = 86400000;
const iso = (now: Date, days: number, hours = 0) => new Date(now.getTime() + days * DAY + hours * 3600000).toISOString();
const plain = (s: string) => s.replace(/\*/g, '');

/* ================================================================== */
/* Products — tags, vendors, costs, barcodes, incoming                 */
/* ================================================================== */
/** Purchase cost as a share of the selling price, per category (demo margins). */
const COST_FACTOR: Record<string, number> = {
  'cat-veshje': 0.62,
  'cat-vegla': 0.7,
  'cat-kopshti': 0.72,
  'cat-ndricim': 0.6,
  'cat-led': 0.56,
  'cat-ngrohje': 0.68,
  'cat-zjarri': 0.62,
};

/**
 * Internal reference price (EUR incl. VAT) for request-a-price products — what the demo B2B quotes are
 * built from. Never shown on the storefront, which keeps "Kërko çmimin".
 */
const QUOTE_REF: Record<string, number> = {
  'p-disk-bosch-sandwich': 92,
  'p-karroce-parkside': 39,
  'p-bosch-isio': 69,
  'p-bosch-art23': 59,
  'p-ndricues-senzor-18w': 8.9,
  'p-ndricues-tavani-36w': 11.5,
  'p-ndricues-muri-24w': 13.9,
  'p-ndricues-rrugor-50w': 29,
  'p-ndricues-novaled-50w': 39,
  'p-led-shirit': 9.5,
  'p-profil-alumini-led': 4.8,
  'p-kamina-dru': 255,
  'p-bombol-abc': 24,
};

const EXTRAS: Record<string, { tags: string[]; vendor?: string; incoming?: number; unavailable?: number; channels?: ('online' | 'pos')[] }> = {
  'p-jakne-softshell': { tags: ['veshje-pune', 'softshell', 'dimer', 'e-re'], vendor: 'WorkWear Balkan', incoming: 40 },
  'p-duks-kapriol': { tags: ['veshje-pune', 'kapriol', 'premium'], incoming: 20 },
  'p-duks-pune': { tags: ['veshje-pune', 'me-e-shitura', 'ekipe'], vendor: 'WorkWear Balkan', incoming: 60 },
  'p-disk-bosch-sandwich': { tags: ['bosch', 'disk', 'panel-sandwich', 'kantier'] },
  'p-karroce-parkside': { tags: ['parkside', 'transport', 'depo'] },
  'p-bosch-isio': { tags: ['bosch', 'kopsht', 'me-bateri'] },
  'p-bosch-art23': { tags: ['bosch', 'kopsht', 'trimer'] },
  'p-ndricues-senzor-18w': { tags: ['led', 'tavan', 'sensor', 'shkallë'], vendor: 'Elektro Import' },
  'p-ndricues-tavani-36w': { tags: ['led', 'tavan', 'banesë'], vendor: 'Elektro Import', incoming: 20 },
  'p-ndricues-muri-24w': { tags: ['led', 'mur', 'ip54', 'jashtë'], vendor: 'Elektro Import' },
  'p-ndricues-rrugor-50w': { tags: ['led', 'rrugor', 'ip65', 'oborr'], vendor: 'Elektro Import' },
  'p-ndricues-novaled-50w': { tags: ['led', 'rrugor', 'novaled', 'ip65'] },
  'p-led-shirit': { tags: ['led', 'shirit', 'kuzhinë', 'rgb'], vendor: 'Elektro Import' },
  'p-profil-alumini-led': { tags: ['led', 'profil', 'alumin'], vendor: 'Elektro Import' },
  'p-kamina-dru': { tags: ['ngrohje', 'dru', 'dimer'], vendor: 'Termo Import' },
  'p-bombol-abc': { tags: ['zjarri', 'abc', 'zyrë', 'automjet'], vendor: 'FireSafe Distribucion', unavailable: 1 },
};

/**
 * EAN-13 demo barcode with a valid check digit. Kosovo has no GS1 prefix of its own in common use, so the
 * "200" in-store range (restricted circulation) is used — real codes come from the supplier's packaging.
 */
function ean13(n: number) {
  const body = `200${String(100000000 + n * 7919).slice(-9)}`;
  const sum = body.split('').reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
  return body + ((10 - (sum % 10)) % 10);
}

/** Adds CMS v2 fields to the catalogue (cost, vendor, tags, barcode, incoming, channels, template). */
export function enrichProducts(products: Product[]): Product[] {
  return products.map((p, i): Product => {
    const x = EXTRAS[p.id];
    const reference = p.quoteOnly ? (QUOTE_REF[p.id] ?? 0) : p.price;
    return {
      ...p,
      cost: reference ? round2(reference * (COST_FACTOR[p.categoryId] ?? 0.65)) : undefined,
      vendor: x?.vendor ?? p.vendor,
      tags: x?.tags ?? [],
      barcode: ean13(i + 1),
      incoming: x?.incoming ?? 0,
      unavailable: x?.unavailable ?? 0,
      template: p.quoteOnly ? 'quote' : 'standard',
      channels: x?.channels ?? ['online', 'pos'],
    };
  });
}

/**
 * Discontinued product to archive in the seed. Every Denisi product is a current line from the shop's
 * own posts, so nothing is archived (the Archived filter shows its empty state).
 */
export const ARCHIVED_PRODUCT: string | null = null;

/* ================================================================== */
/* Collections                                                         */
/* ================================================================== */
export function buildCollections(now: Date): Collection[] {
  return [
    {
      id: 'col-veshje-pune',
      slug: 'veshje-pune',
      title: T('Radna odeća', 'Veshje pune', 'Workwear'),
      description: T(
        'Softshell jakne, Kapriol i radni duksevi — od 3 komada popust od 10% se obračunava automatski u korpi.',
        'Jakne softshell, duksa Kapriol dhe duksa pune — nga 3 copë zbritja 10% llogaritet automatikisht në shportë.',
        'Softshell jackets, Kapriol tops and work sweatshirts — from 3 pieces the 10% discount is applied automatically in the cart.',
      ),
      image: '/images/cat/veshje-pune.webp',
      kind: 'smart',
      productIds: [],
      match: 'all',
      rules: [{ field: 'category', op: 'eq', value: 'cat-veshje' }],
      sort: 'bestselling',
      published: true,
      seo: { title: 'Veshje pune — Denisi Color, Shtime', description: 'Jakne softshell, duksa Kapriol dhe duksa pune. Dërgesë në të gjithë Kosovën.' },
      createdAt: iso(now, -21),
    },
    {
      id: 'col-ndricim-led',
      slug: 'ndricim-led',
      title: T('LED rasveta', 'Ndriçim LED', 'LED lighting'),
      description: T(
        'Plafonjere, zidne i ulične LED svetiljke, LED trake i aluminijumski profili — cene na upit, i za veće količine.',
        'Ndriçues tavani, muri dhe rrugorë LED, LED shirita dhe profile alumini — çmimi sipas kërkesës, edhe për sasi të mëdha.',
        'Ceiling, wall and street LED lights, LED strips and aluminium profiles — prices on request, also for larger quantities.',
      ),
      image: '/images/cat/ndricim.webp',
      kind: 'smart',
      productIds: [],
      match: 'any',
      rules: [
        { field: 'category', op: 'eq', value: 'cat-ndricim' },
        { field: 'category', op: 'eq', value: 'cat-led' },
      ],
      sort: 'manual',
      published: true,
      createdAt: iso(now, -60),
    },
    {
      id: 'col-bosch',
      slug: 'bosch',
      title: T('Bosch', 'Bosch', 'Bosch'),
      description: T(
        'Bosch alat i pribor za gradilište i baštu — pitajte za cenu i dostupnost.',
        'Vegla dhe aksesorë Bosch për kantier dhe kopsht — pyetni për çmimin dhe disponueshmërinë.',
        'Bosch tools and accessories for the site and the garden — ask for price and availability.',
      ),
      image: '/images/cat/kopshti.webp',
      kind: 'smart',
      productIds: [],
      match: 'all',
      rules: [{ field: 'vendor', op: 'eq', value: 'Bosch' }],
      sort: 'manual',
      published: true,
      createdAt: iso(now, -45),
    },
    {
      id: 'col-kantier',
      slug: 'per-kantier',
      title: T('Za gradilište', 'Për kantier', 'For the building site'),
      description: T(
        'Sve što ekipa traži na gradilištu: radna odeća, Bosch disk za sendvič panele, sklopiva kolica, rasveta i aparati za gašenje požara.',
        'Gjithçka që ekipi kërkon në kantier: veshje pune, disk Bosch për panele sandwich, karrocë e palosshme, ndriçim dhe bombola zjarri.',
        'Everything a crew needs on site: workwear, a Bosch sandwich-panel blade, a folding hand truck, lighting and fire extinguishers.',
      ),
      image: '/images/cat/vegla.webp',
      kind: 'manual',
      productIds: ['p-duks-pune', 'p-jakne-softshell', 'p-duks-kapriol', 'p-disk-bosch-sandwich', 'p-karroce-parkside', 'p-ndricues-rrugor-50w', 'p-bombol-abc'],
      match: 'all',
      rules: [],
      sort: 'manual',
      published: true,
      createdAt: iso(now, -30),
    },
    {
      id: 'col-dimri',
      slug: 'sezoni-i-dimrit',
      title: T('Zimska sezona', 'Sezoni i dimrit', 'Winter season'),
      description: T(
        'Peći na drva i aparati za gašenje požara za dom — uz softshell jaknu za hladne dane.',
        'Kamina me dru dhe bombola zjarri për shtëpi — me jakne softshell për ditët e ftohta.',
        'Wood-burning stoves and fire extinguishers for the home — with a softshell jacket for cold days.',
      ),
      image: '/images/cat/ngrohje.webp',
      kind: 'manual',
      productIds: ['p-kamina-dru', 'p-bombol-abc', 'p-jakne-softshell'],
      match: 'all',
      rules: [],
      sort: 'manual',
      published: true,
      createdAt: iso(now, -6),
    },
    {
      id: 'col-banesa-re',
      slug: 'per-banesen-e-re',
      title: T('Za novi stan', 'Për banesën e re', 'For your new apartment'),
      description: T(
        'Rasveta za ceo stan — plafonjere, svetiljke sa senzorom, zidne svetiljke i LED trake — i aparat za gašenje požara.',
        'Ndriçim për gjithë banesën — ndriçues tavani, me sensor, muri dhe LED shirita — dhe një bombol zjarri.',
        'Lighting for the whole apartment — ceiling, sensor and wall lights plus LED strips — and a fire extinguisher.',
      ),
      image: '/images/misc/koleksioni.webp',
      kind: 'manual',
      productIds: ['p-ndricues-tavani-36w', 'p-ndricues-senzor-18w', 'p-ndricues-muri-24w', 'p-led-shirit', 'p-profil-alumini-led', 'p-bombol-abc'],
      match: 'all',
      rules: [],
      sort: 'manual',
      published: false,
      createdAt: iso(now, -2),
    },
  ];
}

/* ================================================================== */
/* Discounts — only on priced products (workwear) and shipping;       */
/* request-a-price products are negotiated in B2B quotes instead.      */
/* ================================================================== */
const ALL_LINES = { scope: 'all' as const, ids: [] };
const NO_MIN = { type: 'none' as const, value: 0 };
const EVERYONE = { type: 'all' as const };

/** End of the autumn workwear offer — same moment as the homepage promo countdown. */
export const autumnSaleEnd = (now: Date) => new Date(now.getTime() + 12 * DAY + 5 * 3600000).toISOString();

export function buildDiscounts(now: Date): Discount[] {
  return [
    {
      id: 'd-veshje10',
      title: 'Vjeshtë — veshje pune −10% nga 3 copë (automatike)',
      publicTitle: T('Radna odeća −10% od 3 komada', 'Veshje pune −10% nga 3 copë', 'Workwear −10% from 3 pieces'),
      kind: 'products',
      method: 'auto',
      valueType: 'percent',
      value: 10,
      appliesTo: { scope: 'collections', ids: ['col-veshje-pune'] },
      minimum: { type: 'qty', value: 3 },
      audience: EVERYONE,
      combines: { products: true, order: true, shipping: true },
      startsAt: iso(now, -21),
      endsAt: autumnSaleEnd(now),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -22),
      tags: ['vjeshte', 'veshje-pune'],
    },
    {
      id: 'd-dostava50',
      title: 'Transport falas mbi 50 €',
      publicTitle: T('Besplatna dostava preko 50 €', 'Transport falas mbi 50 €', 'Free delivery over €50'),
      kind: 'shipping',
      method: 'auto',
      valueType: 'percent',
      value: 100,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 50 },
      shipping: { zoneIds: [] },
      audience: EVERYONE,
      combines: { products: true, order: true, shipping: false },
      startsAt: iso(now, -200),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -200),
    },
    {
      id: 'd-kantier',
      title: 'B2B — kontraktorë KANTIER',
      publicTitle: T('Za izvođače −8%', 'Për kontraktorë −8%', 'Contractors −8%'),
      kind: 'order',
      method: 'code',
      code: 'KANTIER',
      valueType: 'percent',
      value: 8,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 150 },
      audience: EVERYONE,
      combines: { products: true, order: false, shipping: true },
      startsAt: iso(now, -150),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -150),
      tags: ['b2b', 'kontraktore'],
    },
    {
      id: 'd-mireseardhje',
      title: 'Mirë se vini — MIRESEVINI10 (porosia e parë)',
      publicTitle: T('Dobrodošlica −10%', 'Mirë se vini −10%', 'Welcome −10%'),
      kind: 'order',
      method: 'code',
      code: 'MIRESEVINI10',
      valueType: 'percent',
      value: 10,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 30 },
      audience: EVERYONE,
      combines: { products: true, order: false, shipping: true },
      oncePerCustomer: true,
      startsAt: iso(now, -90),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -90),
      tags: ['mireseardhje'],
    },
    {
      id: 'd-dimri5',
      title: 'Oferta e dimrit — DIMRI5',
      publicTitle: T('Zimski popust 5 €', 'Zbritje dimri 5 €', 'Winter €5 off'),
      kind: 'order',
      method: 'code',
      code: 'DIMRI5',
      valueType: 'fixed',
      value: 5,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 40 },
      audience: EVERYONE,
      combines: { products: true, order: false, shipping: true },
      startsAt: iso(now, -10),
      endsAt: iso(now, 30),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -11),
      tags: ['dimer'],
    },
    {
      id: 'd-ekipi15',
      title: 'Veshje pune për ekipe — EKIPI15 (joaktiv)',
      publicTitle: T('Radna odeća za ekipe −15%', 'Veshje pune për ekipe −15%', 'Workwear for crews −15%'),
      kind: 'order',
      method: 'code',
      code: 'EKIPI15',
      valueType: 'percent',
      value: 15,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 250 },
      audience: EVERYONE,
      combines: { products: false, order: false, shipping: true },
      startsAt: iso(now, -70),
      status: 'paused',
      uses: 0,
      createdAt: iso(now, -70),
      tags: ['ekipe', 'veshje-pune'],
    },
    {
      id: 'd-dimri15',
      title: 'Dimri — jakne softshell −15%',
      publicTitle: T('Zima: softshell jakna −15%', 'Dimri: jakne softshell −15%', 'Winter: softshell jacket −15%'),
      kind: 'products',
      method: 'auto',
      valueType: 'percent',
      value: 15,
      appliesTo: { scope: 'products', ids: ['p-jakne-softshell'] },
      minimum: NO_MIN,
      audience: EVERYONE,
      combines: { products: true, order: true, shipping: true },
      startsAt: autumnSaleEnd(now),
      endsAt: iso(now, 60),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -2),
      tags: ['dimer', 'veshje-pune'],
    },
    {
      id: 'd-shtator10',
      title: 'Fillimi i sezonit — SHTATOR10',
      publicTitle: T('Početak sezone −10%', 'Fillimi i sezonit −10%', 'Start of the season −10%'),
      kind: 'order',
      method: 'code',
      code: 'SHTATOR10',
      valueType: 'percent',
      value: 10,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 30 },
      audience: EVERYONE,
      combines: { products: true, order: false, shipping: true },
      startsAt: iso(now, -62),
      endsAt: iso(now, -27),
      status: 'active',
      uses: 0,
      createdAt: iso(now, -63),
      tags: ['shtator'],
    },
    {
      id: 'd-duks-11',
      title: 'Bli 10 duksa pune — 1 falas',
      publicTitle: T('10 radnih dukseva + 1 gratis', '10 duksa pune + 1 falas', '10 work sweatshirts + 1 free'),
      kind: 'bxgy',
      method: 'auto',
      valueType: 'percent',
      value: 100,
      appliesTo: ALL_LINES,
      minimum: NO_MIN,
      bxgy: { buyIds: ['p-duks-pune'], buyScope: 'products', buyQty: 10, getIds: ['p-duks-pune'], getScope: 'products', getQty: 1, getType: 'free', getValue: 100, maxUses: 2 },
      audience: EVERYONE,
      combines: { products: false, order: true, shipping: true },
      startsAt: iso(now, -45),
      status: 'paused',
      uses: 0,
      createdAt: iso(now, -46),
      tags: ['ekipe', 'veshje-pune'],
    },
    {
      id: 'd-vip20',
      title: 'Klientë të mëdhenj — 20 € mbi 300 €',
      publicTitle: T('Popust za stalne kupce 20 €', 'Zbritje për klientë besnikë 20 €', 'Loyal customer €20 off'),
      kind: 'order',
      method: 'code',
      code: 'BESNIK20',
      valueType: 'fixed',
      value: 20,
      appliesTo: ALL_LINES,
      minimum: { type: 'amount', value: 300 },
      audience: { type: 'segment', segmentId: 'seg-vip' },
      combines: { products: true, order: false, shipping: true },
      oncePerCustomer: true,
      startsAt: iso(now, 0),
      status: 'draft',
      uses: 0,
      createdAt: iso(now, -1),
      tags: ['vip'],
    },
  ];
}

/** Recount uses from the generated orders (cancelled orders excluded). */
export function countDiscountUses(discounts: Discount[], orders: Order[]): Discount[] {
  const uses = new Map<string, number>();
  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    for (const a of o.discounts ?? []) uses.set(a.id, (uses.get(a.id) ?? 0) + 1);
  }
  return discounts.map((d) => ({ ...d, uses: uses.get(d.id) ?? 0 }));
}

/* ================================================================== */
/* Offers (p.30 mock-up: active / active / draft / scheduled)          */
/* ================================================================== */
const ZERO = { visits: 0, ctaClicks: 0, codeUses: 0, orders: 0, revenue: 0, discountTotal: 0 };

export function buildOffers(now: Date, discounts: Discount[], orders: Order[]): Offer[] {
  const d = (id: string) => discounts.find((x) => x.id === id)!;
  const metrics = (discountId: string, visitsPerOrder: number, baseVisits: number) => {
    const list = orders.filter((o) => o.status !== 'cancelled' && o.discounts?.some((a) => a.id === discountId));
    const discountTotal = round2(list.reduce((s, o) => s + (o.discounts?.find((a) => a.id === discountId)?.amount ?? 0), 0));
    const visits = baseVisits + list.length * visitsPerOrder;
    return {
      visits,
      ctaClicks: Math.round(visits * 0.17),
      codeUses: list.filter((o) => o.discounts?.some((a) => a.id === discountId && a.code)).length,
      orders: list.length,
      revenue: round2(list.reduce((s, o) => s + o.total, 0)),
      discountTotal,
    };
  };
  return [
    {
      id: 'of-veshje',
      slug: 'veshje-pune-per-ekipe',
      name: T('Radna odeća za ekipe', 'Veshje pune për ekipe', 'Workwear for crews'),
      description: T(
        'Automatski −10% na radnu odeću od 3 komada. Prikazuje se u baneru kataloga, traci obaveštenja i promo bloku početne.',
        'Automatikisht −10% për veshje pune nga 3 copë. Shfaqet në banerin e katalogut, shiritin e njoftimeve dhe bllokun promo të ballinës.',
        'Automatic −10% on workwear from 3 pieces. Shown in the catalogue banner, announcement bar and homepage promo block.',
      ),
      status: 'active',
      startsAt: d('d-veshje10').startsAt,
      endsAt: d('d-veshje10').endsAt,
      discountId: 'd-veshje10',
      collectionId: 'col-veshje-pune',
      productIds: [],
      badge: T('−10% od 3 kom', '−10% nga 3 copë', '−10% from 3 pcs'),
      image: '/images/cat/veshje-pune.webp',
      landing: {
        title: T('Opremite *ekipu* pre zime', 'Vishni *ekipën* para dimrit', 'Kit out your *crew* before winter'),
        text: T(
          'Od 3 komada radne odeće — softshell jakne, Kapriol ili radni duksevi — popust od 10% vidite odmah u korpi, bez koda.',
          'Nga 3 copë veshje pune — jakne softshell, duksa Kapriol ose duksa pune — zbritjen 10% e shihni menjëherë në shportë, pa kod.',
          'From 3 pieces of workwear — softshell jackets, Kapriol tops or work sweatshirts — you see the 10% discount straight away in the cart, no code needed.',
        ),
      },
      placements: ['banner', 'announcement', 'home-block'],
      owner: 'st-drita',
      utm: 'utm_source=denisi&utm_medium=banner&utm_campaign=veshje-ekipe',
      metrics: metrics('d-veshje10', 34, 210),
      createdAt: iso(now, -22),
    },
    {
      id: 'of-kantier',
      slug: 'kontraktore-kantier',
      name: T('Za izvođače — KANTIER', 'Për kontraktorë — KANTIER', 'For contractors — KANTIER'),
      description: T(
        'Kod KANTIER daje 8% na porudžbine od 150 € (posle popusta na proizvode). Za LED, Bosch i protivpožarnu opremu u količini šaljemo B2B ponudu.',
        'Kodi KANTIER jep 8% për porosi nga 150 € (pas zbritjeve të produkteve). Për LED, Bosch dhe bombola zjarri në sasi dërgojmë ofertë B2B.',
        'Code KANTIER gives 8% on orders from €150 (after product discounts). For LED, Bosch and fire-safety gear in quantity we send a B2B quote.',
      ),
      status: 'active',
      startsAt: d('d-kantier').startsAt,
      discountId: 'd-kantier',
      collectionId: 'col-kantier',
      productIds: [],
      badge: T('−8% uz KANTIER', '−8% me KANTIER', '−8% with KANTIER'),
      image: '/images/cat/vegla.webp',
      landing: {
        title: T('Za *izvođače* i ekipe', 'Për *kontraktorë* dhe ekipe', 'For *contractors* and crews'),
        text: T(
          'Sa kodom KANTIER ostvarujete 8% na porudžbine od 150 €. Za rasvetu, Bosch alat i aparate za gašenje požara u većim količinama zatražite ponudu.',
          'Me kodin KANTIER përfitoni 8% për porositë nga 150 €. Për ndriçim, vegla Bosch dhe bombola zjarri në sasi më të mëdha kërkoni ofertë.',
          'With code KANTIER you get 8% on orders from €150. For lighting, Bosch tools and fire extinguishers in larger quantities, request a quote.',
        ),
      },
      placements: ['banner'],
      owner: 'st-arta',
      utm: 'utm_source=denisi&utm_medium=landing&utm_campaign=kantier',
      metrics: metrics('d-kantier', 28, 340),
      createdAt: iso(now, -150),
    },
    {
      id: 'of-banesa',
      slug: 'ndricim-per-banesen-e-re',
      name: T('Rasveta za novi stan', 'Ndriçim për banesën e re', 'Lighting for a new apartment'),
      description: T(
        'Editorijalna kampanja bez popusta: rasveta i LED trake za ceo stan, sa pozivom na ponudu.',
        'Fushatë editoriale pa zbritje: ndriçim dhe LED shirita për gjithë banesën, me ftesë për ofertë.',
        'Editorial campaign without a discount: lighting and LED strips for the whole apartment, with a request-a-quote call to action.',
      ),
      status: 'draft',
      startsAt: iso(now, 7),
      collectionId: 'col-banesa-re',
      productIds: [],
      badge: T('Novo', 'E re', 'New'),
      image: '/images/cat/ndricim.webp',
      landing: {
        title: T('Svetlo za *novi stan*', 'Dritë për *banesën e re*', 'Light for your *new apartment*'),
        text: T(
          'Plafonjere, svetiljke sa senzorom i zidne svetiljke, LED trake i profili — pošaljite nam spisak prostorija i šaljemo ponudu za ceo stan.',
          'Ndriçues tavani, me sensor dhe muri, LED shirita e profile — na dërgoni listën e dhomave dhe ju dërgojmë ofertë për gjithë banesën.',
          'Ceiling, sensor and wall lights, LED strips and profiles — send us your list of rooms and we will quote the whole apartment.',
        ),
      },
      placements: ['hero', 'home-block'],
      owner: 'st-ana',
      utm: 'utm_source=denisi&utm_medium=hero&utm_campaign=banesa-e-re',
      metrics: { ...ZERO },
      createdAt: iso(now, -1),
    },
    {
      id: 'of-dimri',
      slug: 'sezoni-i-dimrit',
      name: T('Zimska sezona', 'Sezoni i dimrit', 'Winter season'),
      description: T(
        'Planirano: softshell jakna −15% od kraja jesenje akcije, uz peći na drva i aparate za gašenje požara (cena na upit). Slajd i traka se uključuju sami.',
        'E planifikuar: jakne softshell −15% pas ofertës së vjeshtës, me kamina me dru dhe bombola zjarri (çmimi sipas kërkesës). Slide-i dhe shiriti aktivizohen vetë.',
        'Scheduled: softshell jacket −15% after the autumn offer ends, alongside wood stoves and fire extinguishers (price on request). The slide and bar switch on by themselves.',
      ),
      status: 'active',
      startsAt: d('d-dimri15').startsAt,
      endsAt: d('d-dimri15').endsAt,
      discountId: 'd-dimri15',
      collectionId: 'col-dimri',
      productIds: [],
      badge: T('Zima −15%', 'Dimër −15%', 'Winter −15%'),
      image: '/images/cat/ngrohje.webp',
      landing: {
        title: T('Spremni za *zimu*', 'Gati për *dimër*', 'Ready for *winter*'),
        text: T(
          'Softshell jakna −15%, a za peći na drva i aparate za gašenje požara pitajte za cenu — dostavljamo širom Kosova.',
          'Jakne softshell −15%, ndërsa për kaminat me dru dhe bombolat e zjarrit pyetni për çmimin — dërgojmë në të gjithë Kosovën.',
          'Softshell jacket −15%; for wood stoves and fire extinguishers ask for a price — we deliver across Kosovo.',
        ),
      },
      placements: ['hero', 'announcement'],
      owner: 'st-drita',
      utm: 'utm_source=denisi&utm_medium=hero&utm_campaign=dimri',
      metrics: { ...ZERO },
      createdAt: iso(now, -2),
    },
  ];
}

/* ================================================================== */
/* Placements — hero slides, catalogue banners, announcement bar       */
/* ================================================================== */
export function buildPlacements(home: HomeSection[]): Placement[] {
  const hero = home.find((h) => h.type === 'hero');
  const slides = hero && hero.type === 'hero' ? hero.data.slides : [];
  const base = { textAlign: 'left' as const, status: 'active' as const };
  const fromHero: Placement[] = slides.map((s, i) => ({
    ...base,
    id: `pl-${s.id}`,
    kind: 'slide',
    position: 'home-hero',
    name: `Hero — ${plain(s.title.sq).replace(/\.$/, '').slice(0, 40) || i + 1}`,
    eyebrow: s.eyebrow,
    title: s.title,
    subtitle: s.subtitle,
    cta: s.primary,
    secondary: s.secondary,
    image: s.image,
    alt: T(plain(s.title.me), plain(s.title.sq), plain(s.title.en)),
    overlay: 35,
    order: i + 1,
  }));
  const ann = (id: string, order: number, title: L10n, offerId?: string, href = ''): Placement => ({
    ...base,
    id,
    kind: 'announcement',
    position: 'bar',
    name: `Shiriti — ${title.sq.slice(0, 32)}`,
    eyebrow: E(),
    title,
    subtitle: E(),
    cta: { label: E(), href },
    image: '',
    alt: E(),
    overlay: 0,
    order,
    ...(offerId ? { offerId } : {}),
  });
  return [
    ...fromHero,
    {
      ...base,
      id: 'pl-s4',
      kind: 'slide',
      position: 'home-hero',
      name: 'Hero — Sezoni i dimrit',
      eyebrow: T('Zimska sezona', 'Sezoni i dimrit', 'Winter season'),
      title: T('Spremni za *zimu*.', 'Gati për *dimër*.', 'Ready for *winter*.'),
      subtitle: T(
        'Softshell jakna −15%, peći na drva i aparati za gašenje požara — sve za hladnu sezonu.',
        'Jakne softshell −15%, kamina me dru dhe bombola zjarri — gjithçka për stinën e ftohtë.',
        'Softshell jacket −15%, wood stoves and fire extinguishers — everything for the cold season.',
      ),
      cta: { label: T('Pogledajte kolekciju', 'Shikoni koleksionin', 'See the collection'), href: '/kolekcija/sezoni-i-dimrit' },
      secondary: { label: T('Zatražite ponudu', 'Kërkoni ofertë', 'Request a quote'), href: '/kontakt' },
      image: '/images/hero/navy.webp',
      alt: T('Teget pozadina sa dijagonalnim linijama', 'Sfond blu i errët me vija diagonale', 'Navy background with diagonal stripes'),
      overlay: 20,
      offerId: 'of-dimri',
      order: 4,
    },
    {
      ...base,
      id: 'pl-s5',
      kind: 'slide',
      position: 'home-hero',
      status: 'draft',
      name: 'Hero — ndriçim për banesën e re (draft)',
      eyebrow: T('Za novi stan', 'Për banesën e re', 'For your new apartment'),
      title: T('Svetlo za *svaku sobu*.', 'Dritë për *çdo dhomë*.', 'Light for *every room*.'),
      subtitle: T(
        'Plafonjere, svetiljke sa senzorom i LED trake — pošaljite spisak prostorija, šaljemo ponudu.',
        'Ndriçues tavani, me sensor dhe LED shirita — na dërgoni listën e dhomave, ju dërgojmë ofertë.',
        'Ceiling lights, sensor lights and LED strips — send your list of rooms and we will send a quote.',
      ),
      cta: { label: T('Pogledajte rasvetu', 'Shikoni ndriçimin', 'See lighting'), href: '/proizvodi/ndricim' },
      image: '/images/cat/ndricim.webp',
      alt: T('LED plafonjere i zidne svetiljke', 'Ndriçues LED tavani dhe muri', 'LED ceiling and wall lights'),
      textAlign: 'center',
      overlay: 40,
      offerId: 'of-banesa',
      order: 5,
    },
    {
      ...base,
      id: 'pl-b1',
      kind: 'banner',
      position: 'catalog',
      name: 'Katalogu — veshje pune për ekipe',
      eyebrow: T('Jesenja akcija', 'Oferta e vjeshtës', 'Autumn offer'),
      title: T('Radna odeća *−10%* od 3 komada', 'Veshje pune *−10%* nga 3 copë', 'Workwear *−10%* from 3 pieces'),
      subtitle: T('Popust se obračunava automatski u korpi — bez koda.', 'Zbritja llogaritet automatikisht në shportë — pa kod.', 'The discount is applied automatically in the cart — no code needed.'),
      cta: { label: T('Pogledajte radnu odeću', 'Shikoni veshjet e punës', 'Shop workwear'), href: '/proizvodi/veshje-pune' },
      image: '/images/cat/veshje-pune.webp',
      alt: T('Radne jakne i duksevi', 'Jakne dhe duksa pune', 'Work jackets and sweatshirts'),
      overlay: 30,
      offerId: 'of-veshje',
      order: 1,
    },
    {
      ...base,
      id: 'pl-b2',
      kind: 'banner',
      position: 'catalog',
      name: 'Katalogu — KANTIER për kontraktorë',
      eyebrow: T('Za izvođače', 'Për kontraktorë', 'For contractors'),
      title: T('−8% uz kod *KANTIER*', '−8% me kodin *KANTIER*', '−8% with code *KANTIER*'),
      subtitle: T('Za porudžbine od 150 € — za veće količine pošaljite upit.', 'Për porosi nga 150 € — për sasi më të mëdha na shkruani.', 'On orders from €150 — for larger quantities, send us an enquiry.'),
      cta: { label: T('Za gradilište', 'Për kantier', 'For the site'), href: '/kolekcija/per-kantier' },
      image: '/images/cat/vegla.webp',
      alt: T('Bosch alat i pribor', 'Vegla dhe aksesorë Bosch', 'Bosch tools and accessories'),
      overlay: 40,
      offerId: 'of-kantier',
      order: 2,
    },
    ann('pl-a1', 1, T('Dostava širom Kosova — poručite online ili porukom', 'Dërgesë në të gjithë Kosovën — porositni online ose me mesazh', 'Delivery across Kosovo — order online or by message'), undefined, '/kontakt'),
    ann('pl-a2', 2, T('Radna odeća: −10% od 3 komada, automatski u korpi', 'Veshje pune: −10% nga 3 copë, automatikisht në shportë', 'Workwear: −10% from 3 pieces, applied in the cart'), 'of-veshje', '/proizvodi/veshje-pune'),
    ann('pl-a3', 3, T('Zatražite cenu za LED, Bosch alat i aparate za gašenje požara', 'Kërkoni çmimin për LED, vegla Bosch dhe bombola zjarri', 'Ask for a price on LED, Bosch tools and fire extinguishers'), undefined, '/kontakt'),
    ann('pl-a4', 4, T('Zimska sezona: softshell jakna −15%', 'Sezoni i dimrit: jakne softshell −15%', 'Winter season: softshell jacket −15%'), 'of-dimri', '/kolekcija/sezoni-i-dimrit'),
  ];
}

/* ================================================================== */
/* Staff, services, bookings                                           */
/* ================================================================== */
/** Fictional team (placeholder names). Ids are stable — other screens reference them. */
export const STAFF: Staff[] = [
  { id: 'st-gent', name: 'Gent Berisha', email: 'gent@denisicolor.com', role: 'owner', color: '#1a1a1a', active: true, phone: '+383 44 210 334', title: T('Vlasnik', 'Pronar', 'Owner') },
  { id: 'st-arta', name: 'Arta Krasniqi', email: 'arta@denisicolor.com', role: 'manager', color: '#264a78', active: true, phone: '+383 45 318 207', title: T('Menadžerka prodaje i B2B', 'Menaxhere e shitjes & B2B', 'Sales & B2B manager') },
  { id: 'st-milica', name: 'Mimoza Gashi', email: 'shitja@denisicolor.com', role: 'reception', color: '#2f7d6d', active: true, phone: '+383 44 506 912', title: T('Prodavačica u radnji', 'Shitëse në dyqan', 'Shop sales assistant') },
  { id: 'st-blerim', name: 'Blerim Hasani', email: 'blerim@denisicolor.com', role: 'orders', color: '#b26b00', active: true, phone: '+383 49 330 118', title: T('Magacin i dostava', 'Depo & dërgesa', 'Warehouse & delivery') },
  { id: 'st-drita', name: 'Drita Morina', email: 'marketing@denisicolor.com', role: 'marketing', color: '#6b5b95', active: true, title: T('Marketing i društvene mreže (spoljna saradnica)', 'Marketing & rrjete sociale (bashkëpunëtore e jashtme)', 'Marketing & social media (external)') },
  { id: 'st-ana', name: 'Ana Zeka', email: 'ana@denisicolor.com', role: 'editor', color: '#9c6644', active: true, title: T('Sajt i sadržaj (pola radnog vremena)', 'Uebfaqja & përmbajtja (gjysmë orari)', 'Website & content (part-time)') },
];

export const SERVICES: Service[] = [
  {
    id: 'sv-mjerenje',
    name: T('Konsultacija za LED rasvetu', 'Konsultë për ndriçim LED', 'LED lighting consultation'),
    description: T(
      'Dolazimo na objekat — dvorište, radionica ili novi stan — i predlažemo svetiljke i količine za ponudu.',
      'Vijmë në objekt — oborr, punëtori ose banesë e re — dhe propozojmë ndriçuesit dhe sasitë për ofertë.',
      'We visit the site — yard, workshop or new apartment — and suggest the lights and quantities for a quote.',
    ),
    durationMin: 60,
    capacity: 1,
    color: '#264a78',
    staffIds: ['st-blerim', 'st-gent'],
    location: 'onsite',
  },
  {
    id: 'sv-konsultacija',
    name: T('Konsultacija za boje i fasade', 'Konsultë për ngjyra & fasada', 'Paint & facade consultation'),
    description: T(
      'U radnji: izbor nijansi sa karte boja, lakovi i fasadni materijali — sa procenom količine.',
      'Në dyqan: zgjedhja e nuancave nga paleta e ngjyrave, llaqet dhe materialet e fasadës — me vlerësim të sasisë.',
      'In the shop: choosing shades from the colour fan, varnishes and facade materials — with a quantity estimate.',
    ),
    durationMin: 45,
    capacity: 2,
    color: '#2f7d6d',
    staffIds: ['st-arta', 'st-milica', 'st-gent'],
    location: 'loc-shtime',
  },
  {
    id: 'sv-pickup',
    name: T('Preuzimanje u radnji', 'Marrje në dyqan', 'In-store pickup'),
    description: T(
      'Termin za preuzimanje pripremljene porudžbine u Štimlju.',
      'Termin për të marrë porosinë e përgatitur në dyqanin në Shtime.',
      'A slot to collect your prepared order at the shop in Shtime.',
    ),
    durationMin: 15,
    capacity: 3,
    color: '#b26b00',
    staffIds: ['st-milica', 'st-blerim'],
    location: 'loc-shtime',
  },
  {
    id: 'sv-b2b',
    name: T('Sastanak za B2B ponudu', 'Takim për oferta B2B', 'B2B quote meeting'),
    description: T(
      'Za izvođače i firme: količine, rokovi i ponuda za rasvetu, Bosch alat, radnu odeću i protivpožarnu opremu.',
      'Për kontraktorë dhe kompani: sasitë, afatet dhe oferta për ndriçim, vegla Bosch, veshje pune dhe bombola zjarri.',
      'For contractors and companies: quantities, lead times and a quote for lighting, Bosch tools, workwear and fire-safety gear.',
    ),
    durationMin: 45,
    capacity: 1,
    color: '#6b5b95',
    staffIds: ['st-gent', 'st-arta'],
    location: 'loc-shtime',
  },
];

const BOOKING_PEOPLE: [string, string, string][] = [
  ['Liridona Shala', '+383 44 441 902', 'Shtime'],
  ['Shpend Bytyqi', '+383 45 220 517', 'Lipjan'],
  ['Valon Kryeziu', '+383 49 715 330', 'Shtime'],
  ['Besart Rexhepi', '+383 44 908 114', 'Ferizaj'],
  ['Teuta Avdiu', '+383 45 510 276', 'Prishtinë'],
  ['Egzona Hasani', '+383 49 304 681', 'Ferizaj'],
  ['Driton Mustafa', '+383 44 655 209', 'Suharekë'],
  ['Mimoza Sadiku', '+383 45 147 993', 'Shtime'],
  ['Kushtrim Zeka', '+383 49 822 460', 'Fushë Kosovë'],
  ['Granit Musliu', '+383 44 390 845', 'Lipjan'],
  ['Fatjona Ramadani', '+383 45 674 152', 'Prishtinë'],
  ['Ilir Morina', '+383 49 251 738', 'Kaçanik'],
  ['Vjosa Hoxha', '+383 44 118 506', 'Prishtinë'],
  ['Arben Gashi', '+383 45 963 027', 'Shtime'],
  ['Blerta Krasniqi', '+383 49 437 615', 'Ferizaj'],
  ['Nikola Petrović', '+383 44 582 394', 'Graçanicë'],
];

const ONSITE_STREETS = ['Rr. Adem Jashari', 'Rr. Dëshmorët e Kombit', 'Rr. Skënderbeu', 'Rr. Nëna Terezë'];

/** [day offset from this Monday, hour, minute, service, staff, note] — Mon–Sat, no overlaps per staff member. */
const SLOTS: [number, number, number, string, string, string][] = [
  [0, 9, 0, 'sv-konsultacija', 'st-arta', 'Ngjyra për fasadën e shtëpisë — rreth 180 m²'],
  [0, 11, 0, 'sv-mjerenje', 'st-blerim', 'Ndriçim oborri — 6 ndriçues rrugorë 50W'],
  [1, 10, 0, 'sv-b2b', 'st-gent', 'LED për ndërtesë banimi — Ferizaj'],
  [1, 14, 0, 'sv-mjerenje', 'st-blerim', 'Ndriçim LED për punëtori 200 m²'],
  [2, 9, 0, 'sv-konsultacija', 'st-milica', 'Lyerje e brendshme — banesë 90 m²'],
  [2, 9, 30, 'sv-konsultacija', 'st-arta', 'Llaqe për dritare e dyer druri'],
  [3, 8, 0, 'sv-pickup', 'st-blerim', 'Marrje: 12 duksa pune për ekipë'],
  [3, 12, 0, 'sv-mjerenje', 'st-gent', 'Ndriçues muri IP54 për fasadë'],
  [4, 9, 0, 'sv-b2b', 'st-arta', 'Veshje pune për ekipë me 15 punëtorë'],
  [4, 15, 0, 'sv-konsultacija', 'st-gent', 'Fasadë termoizoluese — zgjedhja e nuancës'],
  [7, 9, 0, 'sv-mjerenje', 'st-blerim', 'LED shirita dhe profile për lokal'],
  [7, 11, 0, 'sv-b2b', 'st-gent', 'Bombola zjarri për objekt afarist'],
  [8, 10, 0, 'sv-konsultacija', 'st-milica', 'Ngjyra për dhomat e fëmijëve'],
  [9, 12, 0, 'sv-pickup', 'st-milica', 'Marrje: kaminë me dru'],
  [10, 9, 0, 'sv-b2b', 'st-arta', 'Disqe Bosch për montues panelesh'],
  [12, 10, 0, 'sv-konsultacija', 'st-arta', 'Ngjyra për shtëpi të re — Lipjan'],
];

function mondayOf(now: Date) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d;
}

/** Which service a scheduled enquiry is booked into. */
function serviceForInquiry(q: Inquiry) {
  if (q.type === 'quote') return 'sv-b2b';
  if (q.service && /fasad|ngjyr|boj|paint/i.test(q.service)) return 'sv-konsultacija';
  return q.type === 'measurement' ? 'sv-mjerenje' : 'sv-konsultacija';
}

/**
 * Bookings for this and next week. Scheduled inquiries are linked to future bookings of the matching
 * service (LED visit, paint & facade consultation or B2B meeting) and get the same date.
 */
export function buildBookings(now: Date, inquiries: Inquiry[]): { bookings: Booking[]; inquiries: Inquiry[] } {
  const monday = mondayOf(now);
  const bookings: Booking[] = SLOTS.map(([day, h, m, serviceId, staffId, note], i) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() + day);
    start.setHours(h, m, 0, 0);
    const service = SERVICES.find((s) => s.id === serviceId)!;
    const end = start.getTime() + service.durationMin * 60000;
    const [customerName, phone, city] = BOOKING_PEOPLE[i % BOOKING_PEOPLE.length];
    const past = end < now.getTime();
    const status: Booking['status'] = past ? (i === 4 ? 'noshow' : i === 5 ? 'cancelled' : 'done') : i === 13 || i === 14 ? 'pending' : 'confirmed';
    return {
      id: `bk-${101 + i}`,
      serviceId,
      staffId,
      customerName,
      phone,
      city,
      start: start.toISOString(),
      durationMin: service.durationMin,
      status,
      note,
      location: service.location ?? 'loc-shtime',
      ...(service.location === 'onsite' ? { address: `${ONSITE_STREETS[i % ONSITE_STREETS.length]} ${12 + i * 3}` } : {}),
      createdAt: new Date(start.getTime() - (3 + (i % 5)) * DAY).toISOString(),
    };
  });

  const out = inquiries.map((q) => ({ ...q }));
  const free = (svc: string) => bookings.filter((b) => b.serviceId === svc && !b.inquiryId && new Date(b.start).getTime() > now.getTime() && b.status !== 'cancelled');
  for (const q of out.sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    if (q.status !== 'scheduled') continue;
    const slot = free(serviceForInquiry(q))[0];
    if (!slot) {
      q.status = 'contacted';
      q.scheduledAt = undefined;
      continue;
    }
    slot.inquiryId = q.id;
    slot.customerName = q.name;
    slot.phone = q.phone;
    slot.email = q.email;
    slot.city = q.city;
    slot.status = 'confirmed';
    q.scheduledAt = slot.start;
  }
  return { bookings, inquiries: out.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
}

/* ================================================================== */
/* Inquiries — CMS v2 fields + B2B leads behind the quotes             */
/* ================================================================== */
export function enrichInquiries(now: Date, inquiries: Inquiry[]): Inquiry[] {
  const out: Inquiry[] = inquiries.map((q, i) => ({
    ...q,
    source: q.type === 'measurement' ? 'measurement' : q.type === 'quote' ? 'quote' : i % 3 === 0 ? 'phone' : 'web-form',
    assignee: q.status === 'new' ? undefined : serviceForInquiry(q) === 'sv-konsultacija' ? 'st-arta' : q.type === 'measurement' ? (i % 2 ? 'st-gent' : 'st-blerim') : q.type === 'quote' ? 'st-arta' : 'st-milica',
    tags: [q.service ? slugify(q.service) : 'pyetje', ...(q.type === 'quote' ? ['kerkese-cmimi'] : [])],
  }));
  out.push(
    {
      id: 'inq_120',
      createdAt: iso(now, -4, -3),
      type: 'quote',
      name: 'Besart Rexhepi',
      company: 'Rexhepi Ndërtim sh.p.k.',
      phone: '+383 44 908 114',
      email: 'zyra.rexhepi@example.com',
      city: 'Ferizaj',
      service: 'Ndriçim LED',
      productId: 'p-ndricues-tavani-36w',
      message:
        'Ofertë për 40 ndriçues tavani LED 36W për banesat dhe 24 ndriçues me sensor 18W për shkallët e një ndërtese banimi të re në Ferizaj (P+6). Na duhet edhe afati i dërgesës.',
      status: 'contacted',
      seen: true,
      source: 'phone',
      assignee: 'st-arta',
      tags: ['b2b', 'ndricim-led', 'ndertese'],
      followUpAt: iso(now, 2),
    },
    {
      id: 'inq_121',
      createdAt: iso(now, 0, -5),
      type: 'contact',
      name: 'Ardit Kastrati',
      phone: '+383 45 419 207',
      email: 'ardit.kastrati@example.com',
      city: 'Dragash',
      message: 'A dërgoni edhe në Dragash? Sa ditë zgjat dërgesa për 3 jakne softshell të zeza?',
      status: 'new',
      seen: false,
      source: 'web-form',
      tags: ['dergesa'],
    },
    {
      id: 'inq_122',
      createdAt: iso(now, -9, -2),
      type: 'quote',
      name: 'Vjosa Hoxha',
      company: 'Hoxha Consulting sh.p.k.',
      phone: '+383 44 118 506',
      email: 'vjosa.hoxha@example.com',
      city: 'Prishtinë',
      service: 'Kundër zjarrit',
      productId: 'p-bombol-abc',
      message: 'Na duhen 12 bombola zjarri ABC për zyrat tona në Prishtinë (dy kate) — 8 copë 5 kg dhe 4 copë 2 kg. Ju lutem dërgoni ofertë me faturë.',
      status: 'done',
      seen: true,
      source: 'web-form',
      assignee: 'st-arta',
      tags: ['b2b', 'kunder-zjarrit', 'zyre'],
    },
    {
      id: 'inq_123',
      createdAt: iso(now, -1, -6),
      type: 'quote',
      name: 'Granit Musliu',
      company: 'Musliu Panel Montim',
      phone: '+383 44 390 845',
      email: 'granit.musliu@example.com',
      city: 'Lipjan',
      service: 'Vegla Bosch',
      productId: 'p-disk-bosch-sandwich',
      message: 'Montojmë panele sandwich për hale. Sa kushtojnë disqet Bosch EXPERT 270 mm dhe 350 mm nëse marrim 8 copë? A i keni në stok?',
      status: 'contacted',
      seen: true,
      source: 'phone',
      assignee: 'st-gent',
      tags: ['b2b', 'vegla-bosch'],
      followUpAt: iso(now, 1),
    },
  );
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ================================================================== */
/* Segments                                                            */
/* ================================================================== */
export const SEGMENTS: Segment[] = [
  {
    id: 'seg-vip',
    name: T('Veliki kupci', 'Klientë të mëdhenj', 'Top customers'),
    description: T('Potrošili više od 500 € — uglavnom ekipe i firme.', 'Kanë shpenzuar mbi 500 € — kryesisht ekipe dhe kompani.', 'Spent more than €500 — mostly crews and companies.'),
    match: 'all',
    rules: [{ field: 'spent', op: 'gt', value: '500' }],
  },
  {
    id: 'seg-povratni',
    name: T('Povratni kupci', 'Klientë që kthehen', 'Returning customers'),
    description: T('Više od jedne porudžbine.', 'Më shumë se një porosi.', 'More than one order.'),
    match: 'all',
    rules: [{ field: 'orders', op: 'gt', value: '1' }],
  },
  {
    id: 'seg-rajoni',
    name: T('Štimlje i okolina', 'Shtime dhe rrethina', 'Shtime and surroundings'),
    description: T('Kupci iz zone dostave 1 — idealni za preuzimanje u radnji.', 'Klientë nga zona 1 e dërgesës — idealë për marrje në dyqan.', 'Customers in delivery zone 1 — ideal for in-store pickup.'),
    match: 'any',
    rules: ['Shtime', 'Lipjan', 'Ferizaj', 'Suharekë'].map((c) => ({ field: 'city' as const, op: 'eq' as const, value: c })),
  },
  {
    id: 'seg-diaspora',
    name: T('Kupci na engleskom', 'Klientë në anglisht', 'English-speaking customers'),
    description: T('Poručivali na engleskom — često dijaspora koja naručuje za porodicu.', 'Kanë porositur në anglisht — shpesh diaspora që porosit për familjen.', 'Ordered in English — often diaspora ordering for family.'),
    match: 'all',
    rules: [{ field: 'lang', op: 'eq', value: 'en' }],
  },
];

/* ================================================================== */
/* Purchasing & inventory movements                                    */
/* ================================================================== */
export function buildPurchaseOrders(now: Date): PurchaseOrder[] {
  return [
    {
      id: 'po-014',
      number: 'PO-2026-014',
      supplier: 'Elektro Import sh.p.k.',
      location: 'loc-shtime',
      status: 'partial',
      lines: [
        { productId: 'p-ndricues-tavani-36w', ordered: 60, received: 40, rejected: 0, cost: 6.9 },
        { productId: 'p-ndricues-senzor-18w', ordered: 40, received: 40, rejected: 0, cost: 5.35 },
        { productId: 'p-ndricues-muri-24w', ordered: 20, received: 18, rejected: 2, cost: 8.35 },
      ],
      reference: 'EI-55721',
      note: 'Pjesa tjetër e ndriçuesve 36W vjen me kamionin e dytë (për ofertën Q-2026-031). 2 ndriçues muri u refuzuan — xham i plasaritur.',
      expectedAt: iso(now, 3),
      createdAt: iso(now, -12),
    },
    {
      id: 'po-015',
      number: 'PO-2026-015',
      supplier: 'WorkWear Balkan sh.p.k.',
      location: 'loc-shtime',
      status: 'sent',
      lines: [
        { productId: 'p-jakne-softshell', ordered: 40, received: 0, rejected: 0, cost: 16.1 },
        { productId: 'p-duks-pune', ordered: 60, received: 0, rejected: 0, cost: 9.9 },
        { productId: 'p-duks-kapriol', ordered: 20, received: 0, rejected: 0, cost: 21.7 },
      ],
      reference: 'WB-2026/0932',
      note: 'Për sezonin e dimrit — madhësitë M–XXL, ngjyrat sipas listës së bashkëngjitur.',
      expectedAt: iso(now, 9),
      createdAt: iso(now, -3),
    },
    {
      id: 'po-016',
      number: 'PO-2026-016',
      supplier: 'Vegla Pro Distribucion sh.p.k.',
      location: 'loc-shtime',
      status: 'draft',
      lines: [
        { productId: 'p-disk-bosch-sandwich', ordered: 8, received: 0, rejected: 0, cost: 64.4 },
        { productId: 'p-bosch-isio', ordered: 4, received: 0, rejected: 0, cost: 49.7 },
        { productId: 'p-bosch-art23', ordered: 3, received: 0, rejected: 0, cost: 42.5 },
      ],
      note: 'Para dërgimit: konfirmo me Musliu Panel Montim sa disqe 270 / 350 mm i duhen.',
      expectedAt: iso(now, 14),
      createdAt: iso(now, -1),
    },
  ];
}

export function buildMovements(now: Date, orders: Order[], returns: ReturnRequest[]): InventoryMovement[] {
  const mv = (id: string, productId: string, delta: number, reason: InventoryMovement['reason'], days: number, by: string, note?: string, ref?: string): InventoryMovement => ({
    id,
    productId,
    delta,
    reason,
    at: iso(now, days),
    by,
    ...(note ? { note } : {}),
    ...(ref ? { ref } : {}),
  });
  const list: InventoryMovement[] = [
    mv('mv-1', 'p-profil-alumini-led', -2, 'damaged', -2, 'st-blerim', 'Profile të përkulura gjatë shkarkimit — të shlyera'),
    mv('mv-2', 'p-bombol-abc', -1, 'damaged', -4, 'st-blerim', 'Manometri në zonën e kuqe — kthehet te furnitori'),
    mv('mv-3', 'p-ndricues-tavani-36w', 40, 'received', -5, 'st-arta', 'Elektro Import sh.p.k.', 'PO-2026-014'),
    mv('mv-4', 'p-ndricues-senzor-18w', 40, 'received', -5, 'st-arta', 'Elektro Import sh.p.k.', 'PO-2026-014'),
    mv('mv-5', 'p-ndricues-muri-24w', 18, 'received', -5, 'st-arta', 'Elektro Import sh.p.k. — 2 copë të refuzuara', 'PO-2026-014'),
    mv('mv-6', 'p-led-shirit', -3, 'count', -7, 'st-arta', 'Inventarizim — diferencë në raft'),
    mv('mv-7', 'p-duks-pune', 2, 'count', -7, 'st-arta', 'Inventarizim — u gjetën 2 copë në depo'),
    mv('mv-9', 'p-kamina-dru', -1, 'correction', -11, 'st-gent', 'Kamina e ekspozuar te hyrja e dyqanit'),
  ];
  // restocked returns
  for (const r of returns) {
    if (!r.restocked) continue;
    const rec = r.timeline.find((t) => t.status === 'received');
    for (const l of r.lines) list.push({ id: `mv-${r.id}-${l.productId}`, productId: l.productId, delta: l.qty, reason: 'return', at: rec?.at ?? r.createdAt, by: rec?.by ?? 'st-blerim', note: 'U kthye e padëmtuar, me etiketë', ref: r.number });
  }
  // the most recent web orders as 'sale' movements
  let n = 10;
  for (const o of orders.slice(0, 6)) {
    for (const l of o.items) {
      if (!l.productId) continue;
      const days = (new Date(o.createdAt).getTime() - now.getTime()) / DAY;
      list.push({ id: `mv-${n++}`, productId: l.productId, delta: -l.qty, reason: 'sale', at: iso(now, days), by: 'web', ref: o.number });
    }
  }
  return list.sort((a, b) => b.at.localeCompare(a.at));
}

/* ================================================================== */
/* Draft orders, returns, quotes                                       */
/* ================================================================== */
export function buildDrafts(now: Date, products: Product[]): DraftOrder[] {
  const opts = (id: string, pickValue?: string) => {
    const p = products.find((x) => x.id === id);
    const o: Record<string, string> = p ? defaultOptions(p) : {};
    if (p && pickValue) for (const opt of p.options) if (opt.values.some((v) => v.id === pickValue)) o[opt.id] = pickValue;
    return o;
  };
  const key = (id: string, o: Record<string, string>, inst: boolean) =>
    `${id}|${Object.keys(o)
      .sort()
      .map((k) => `${k}=${o[k]}`)
      .join('&')}|${inst ? 'i' : ''}`;
  const jacket = opts('p-jakne-softshell', 'grey');
  const sweat = opts('p-duks-pune', 'darkgrey');
  const kapriol = opts('p-duks-kapriol');
  return [
    {
      id: 'dr-1001',
      number: 'D-1001',
      createdAt: iso(now, -1, -2),
      customer: { firstName: 'Agron', lastName: 'Shala', company: 'Shala Ndërtim sh.p.k.', pib: '81XXXXXXX', email: 'agron.shala@example.com', phone: '+383 44 412 778', city: 'Lipjan', address: 'Rr. Skënderbeu 14' },
      items: [
        { key: key('p-jakne-softshell', jacket, false), productId: 'p-jakne-softshell', qty: 15, options: jacket, installation: false },
        { key: key('p-duks-pune', sweat, false), productId: 'p-duks-pune', qty: 15, options: sweat, installation: false },
      ],
      customLines: [{ title: 'Ndriçues LED rrugor 50W — sipas ofertës', price: 27.5, qty: 4 }],
      discountCodes: ['KANTIER'],
      delivery: 'delivery',
      payment: 'bank',
      note: 'Ekipi i ri për kantierin në Lipjan — madhësitë: 5 × L, 7 × XL, 3 × XXL. Pagesa me faturë paraprake.',
      tags: ['b2b', 'lipjan'],
      status: 'open',
      createdBy: 'st-arta',
      lang: 'sq',
    },
    {
      id: 'dr-1002',
      number: 'D-1002',
      createdAt: iso(now, -4, -1),
      customer: { firstName: 'Driton', lastName: 'Gashi', email: 'driton.gashi@example.com', phone: '+383 45 220 517', city: 'Prishtinë', address: 'Rr. Fehmi Agani 41' },
      items: [{ key: key('p-duks-kapriol', kapriol, false), productId: 'p-duks-kapriol', qty: 4, options: kapriol, installation: false }],
      customLines: [],
      discountCodes: [],
      delivery: 'pickup',
      payment: 'bank',
      note: 'Fatura paraprake u dërgua me e-mail. Klienti i merr në dyqan të shtunën.',
      tags: ['veshje-pune'],
      status: 'invoice_sent',
      createdBy: 'st-gent',
      lang: 'sq',
    },
  ];
}

/** Two returns from real generated orders; the refunded one is also recorded on its order. */
export function buildReturns(now: Date, orders: Order[]): { returns: ReturnRequest[]; orders: Order[] } {
  const age = (o: Order) => (now.getTime() - new Date(o.createdAt).getTime()) / DAY;
  const pieceLine = (o: Order) => o.items.find((l) => l.unit === 'kom' || l.unit === 'set');
  const old = orders.find((o) => o.status === 'completed' && age(o) > 20 && pieceLine(o));
  const recent = orders.find((o) => o !== old && (o.status === 'shipped' || o.status === 'completed') && age(o) < 15 && pieceLine(o));
  const returns: ReturnRequest[] = [];
  let out = orders;
  if (old) {
    const line = pieceLine(old)!;
    const lines = [{ productId: line.productId, qty: 1 }];
    const amount = refundForLines(old, lines);
    const t0 = new Date(Math.min(now.getTime() - 12 * DAY, new Date(old.createdAt).getTime() + 6 * DAY));
    const at = (h: number) => new Date(t0.getTime() + h * 3600000).toISOString();
    returns.push({
      id: 'rt-1001',
      number: 'RT-1001',
      orderId: old.id,
      lines,
      reason: 'Madhësia e gabuar — klienti kërkon kthimin e parave',
      status: 'refunded',
      refundAmount: amount,
      restock: true,
      restocked: true,
      createdAt: at(0),
      timeline: [
        { at: at(0), status: 'requested', by: 'st-milica', note: 'Lajmërim me telefon' },
        { at: at(5), status: 'approved', by: 'st-arta' },
        { at: at(50), status: 'received', by: 'st-blerim', note: 'U mor në adresë, u kthye në stok' },
        { at: at(54), status: 'refunded', by: 'st-arta' },
      ],
    });
    out = out.map((o) =>
      o.id === old.id
        ? {
            ...o,
            refunds: [{ id: 'rf-1001', at: at(54), amount, lineIds: [String(o.items.indexOf(line))], note: 'RT-1001', by: 'st-arta' }],
            payment: { ...o.payment, status: 'paid', refunded: amount },
            timeline: [...o.timeline, { at: at(54), status: 'payment', note: `Rimbursim ${amount.toFixed(2)} € (RT-1001)`, by: 'admin' }],
          }
        : o,
    );
  }
  if (recent) {
    const line = pieceLine(recent)!;
    const lines = [{ productId: line.productId, qty: 1 }];
    const at = iso(now, 0, -20);
    returns.push({
      id: 'rt-1002',
      number: 'RT-1002',
      orderId: recent.id,
      lines,
      reason: 'Ngjyra ndryshon nga fotoja — klienti dëshiron ndërrim ose kthim',
      status: 'requested',
      refundAmount: refundForLines(recent, lines),
      restock: true,
      createdAt: at,
      timeline: [{ at, status: 'requested', by: 'web', note: 'Kërkesë me e-mail me numrin e porosisë' }],
    });
  }
  return { returns, orders: out };
}

export function buildQuotes(now: Date): Quote[] {
  const terms = T(
    'Cene uključuju PDV 18%. Ponuda važi do navedenog datuma; rok isporuke potvrđujemo pri porudžbini. Plaćanje po predračunu.',
    'Çmimet përfshijnë TVSH 18%. Oferta vlen deri në datën e shënuar; afati i dërgesës konfirmohet me porosinë. Pagesa me faturë paraprake.',
    'Prices include 18% VAT. The quote is valid until the date shown; delivery time is confirmed with the order. Payment against a pro-forma invoice.',
  );
  const ref = (id: string, share = 1) => round2((QUOTE_REF[id] ?? 0) * share);
  return [
    {
      id: 'q-031',
      number: 'Q-2026-031',
      inquiryId: 'inq_120',
      customer: { name: 'Besart Rexhepi', company: 'Rexhepi Ndërtim sh.p.k.', email: 'zyra.rexhepi@example.com', phone: '+383 44 908 114' },
      lines: [
        { productId: 'p-ndricues-tavani-36w', title: 'Ndriçues tavani LED 36W — i bardhë, 3 ngjyra drite', qty: 40, price: ref('p-ndricues-tavani-36w', 0.92) },
        { productId: 'p-ndricues-senzor-18w', title: 'Ndriçues tavani me sensor 18W — për shkallë', qty: 24, price: ref('p-ndricues-senzor-18w', 0.92) },
      ],
      validUntil: iso(now, 14),
      terms,
      version: 2,
      status: 'sent',
      createdAt: iso(now, -3),
      owner: 'st-arta',
    },
    {
      id: 'q-032',
      number: 'Q-2026-032',
      inquiryId: 'inq_123',
      customer: { name: 'Granit Musliu', company: 'Musliu Panel Montim', email: 'granit.musliu@example.com', phone: '+383 44 390 845' },
      lines: [
        { productId: 'p-disk-bosch-sandwich', title: 'Disk Bosch EXPERT Sandwich Panel — 270 mm', qty: 6, price: ref('p-disk-bosch-sandwich', 0.94) },
        { productId: 'p-disk-bosch-sandwich', title: 'Disk Bosch EXPERT Sandwich Panel — 350 mm', qty: 2, price: ref('p-disk-bosch-sandwich', 1.28) },
      ],
      validUntil: iso(now, 21),
      terms,
      version: 1,
      status: 'draft',
      createdAt: iso(now, -1),
      owner: 'st-gent',
    },
    {
      id: 'q-033',
      number: 'Q-2026-033',
      inquiryId: 'inq_122',
      customer: { name: 'Vjosa Hoxha', company: 'Hoxha Consulting sh.p.k.', email: 'vjosa.hoxha@example.com', phone: '+383 44 118 506' },
      lines: [
        { productId: 'p-bombol-abc', title: 'Bombol zjarri me pluhur ABC — 5 kg', qty: 8, price: ref('p-bombol-abc', 1.1) },
        { productId: 'p-bombol-abc', title: 'Bombol zjarri me pluhur ABC — 2 kg', qty: 4, price: ref('p-bombol-abc', 0.66) },
      ],
      validUntil: iso(now, 6),
      terms,
      version: 1,
      status: 'accepted',
      createdAt: iso(now, -8),
      owner: 'st-arta',
    },
    {
      id: 'q-034',
      number: 'Q-2026-034',
      customer: { name: 'Kushtrim Bytyqi', company: 'Auto Servis Bytyqi', email: 'kushtrim.bytyqi@example.com', phone: '+383 45 220 914' },
      lines: [
        { productId: 'p-ndricues-rrugor-50w', title: 'Ndriçues LED rrugor 50W IP65 — oborri i servisit', qty: 6, price: ref('p-ndricues-rrugor-50w', 0.95) },
        { productId: 'p-ndricues-novaled-50w', title: 'Ndriçues LED rrugor Novaled 50W — hyrja', qty: 2, price: ref('p-ndricues-novaled-50w', 0.95) },
        { productId: 'p-ndricues-muri-24w', title: 'Ndriçues muri 24W IP54 — fasada', qty: 4, price: ref('p-ndricues-muri-24w') },
      ],
      validUntil: iso(now, 10),
      terms,
      version: 1,
      status: 'sent',
      createdAt: iso(now, -5),
      owner: 'st-gent',
    },
    {
      id: 'q-035',
      number: 'Q-2026-035',
      customer: { name: 'Teuta Avdiu', company: 'Kafe Restorant Avdiu', email: 'teuta.avdiu@example.com', phone: '+383 45 510 276' },
      lines: [
        { productId: 'p-kamina-dru', title: 'Kamina me dru — Modeli 2', qty: 2, price: ref('p-kamina-dru') },
        { productId: 'p-bombol-abc', title: 'Bombol zjarri me pluhur ABC — 3 kg', qty: 2, price: ref('p-bombol-abc', 0.8) },
      ],
      validUntil: iso(now, -3),
      terms,
      version: 1,
      status: 'declined',
      createdAt: iso(now, -17),
      owner: 'st-arta',
    },
  ];
}

/* ================================================================== */
/* Menus & content models                                              */
/* ================================================================== */
export function buildMenus(): Menu[] {
  const cat = (prefix: string, id: string, label: L10n) => ({ id: `mi-${prefix}${id}`, label, type: 'category' as const, target: id });
  const url = (id: string, label: L10n, target: string, children?: Menu['items']) => ({ id, label, type: 'url' as const, target, ...(children ? { children } : {}) });
  const page = (id: string, label: L10n, target = id) => ({ id, label, type: 'page' as const, target });
  const categories = (prefix: string) => [
    cat(prefix, 'cat-veshje', T('Radna odeća', 'Veshje pune', 'Workwear')),
    cat(prefix, 'cat-vegla', T('Alati i pribor', 'Vegla & aksesorë', 'Tools & accessories')),
    cat(prefix, 'cat-kopshti', T('Bašta', 'Kopshti', 'Garden')),
    cat(prefix, 'cat-ndricim', T('Rasveta', 'Ndriçim', 'Lighting')),
    cat(prefix, 'cat-led', T('LED trake i profili', 'LED shirita & profile', 'LED strips & profiles')),
    cat(prefix, 'cat-ngrohje', T('Grejanje', 'Ngrohje', 'Heating')),
    cat(prefix, 'cat-zjarri', T('Protivpožarna oprema', 'Kundër zjarrit', 'Fire safety')),
  ];
  // Pages are linked by id — a missing or draft page is simply hidden from the storefront menu.
  const paints = T('Boje i fasade', 'Ngjyra & fasada', 'Paints & facades');
  return [
    {
      id: 'menu-main',
      handle: 'main',
      title: 'Menyja kryesore',
      items: [
        url('mi-products', T('Proizvodi', 'Produktet', 'Products'), '/proizvodi', [
          ...categories(''),
          { id: 'mi-offer', label: T('Akcija', 'Ofertë', 'Offer'), type: 'offer' as const, target: 'of-veshje' },
        ]),
        page('mi-paints', paints, 'pg-ngjyra'),
        url('mi-services', T('Kako radimo', 'Si punojmë', 'How we work'), '/usluge'),
        url('mi-blog', T('Saveti', 'Këshilla', 'Advice'), '/savjeti'),
        url('mi-about', T('O nama', 'Rreth nesh', 'About'), '/o-nama'),
        url('mi-contact', T('Kontakt', 'Kontakt', 'Contact'), '/kontakt'),
      ],
    },
    {
      id: 'menu-footer',
      handle: 'footer',
      title: 'Fundi i faqes',
      items: [
        url('mi-f-shop', T('Kupovina', 'Blerja', 'Shop'), '/proizvodi', categories('f-')),
        url('mi-f-company', T('Denisi Color', 'Denisi Color', 'Denisi Color'), '/o-nama', [
          url('mi-f-about', T('O nama', 'Rreth nesh', 'About'), '/o-nama'),
          page('mi-f-paints', paints, 'pg-ngjyra'),
          url('mi-f-services', T('Kako radimo', 'Si punojmë', 'How we work'), '/usluge'),
          url('mi-f-blog', T('Saveti', 'Këshilla', 'Advice'), '/savjeti'),
          url('mi-f-contact', T('Kontakt', 'Kontakt', 'Contact'), '/kontakt'),
        ]),
        url('mi-f-help', T('Kupcima', 'Për klientët', 'Customer care'), '', [
          page('mi-pg-dostava', T('Dostava', 'Dërgesa', 'Delivery'), 'pg-dostava'),
          page('mi-pg-placanje', T('Plaćanje', 'Pagesa', 'Payment'), 'pg-placanje'),
          page('mi-pg-reklamacije', T('Povraćaj i garancija', 'Kthimi & garancia', 'Returns & warranty'), 'pg-reklamacije'),
          page('mi-pg-pitanja', T('Česta pitanja', 'Pyetje të shpeshta', 'FAQ'), 'pg-pitanja'),
          page('mi-pg-uslovi', T('Uslovi kupovine', 'Kushtet e blerjes', 'Terms of purchase'), 'pg-uslovi'),
          page('mi-pg-privatnost', T('Politika privatnosti', 'Politika e privatësisë', 'Privacy policy'), 'pg-privatnost'),
        ]),
      ],
    },
  ];
}

export function buildContentModels(projects: Project[], home: HomeSection[], locations: number): ContentModel[] {
  const faq = home.find((h) => h.type === 'faq');
  const services = home.find((h) => h.type === 'services');
  return [
    {
      id: 'cm-projekti',
      name: T('Projekti', 'Projektet', 'Projects'),
      source: 'projects',
      fields: [
        { key: 'title', label: T('Naziv', 'Titulli', 'Title'), type: 'text' },
        { key: 'location', label: T('Lokacija', 'Vendndodhja', 'Location'), type: 'text' },
        { key: 'year', label: T('Godina', 'Viti', 'Year'), type: 'number' },
        { key: 'tags', label: T('Kategorije', 'Kategoritë', 'Categories'), type: 'choice' },
        { key: 'summary', label: T('Opis', 'Përshkrimi', 'Summary'), type: 'text' },
        { key: 'image', label: T('Fotografija', 'Fotografia', 'Photo'), type: 'image' },
        { key: 'featured', label: T('Izdvojeno', 'E veçuar', 'Featured'), type: 'boolean' },
      ],
      entries: projects.length,
    },
    {
      id: 'cm-faq',
      name: T('Česta pitanja', 'Pyetje të shpeshta', 'FAQ'),
      source: 'home.faq',
      fields: [
        { key: 'q', label: T('Pitanje', 'Pyetja', 'Question'), type: 'text' },
        { key: 'a', label: T('Odgovor', 'Përgjigjja', 'Answer'), type: 'text' },
      ],
      entries: faq && faq.type === 'faq' ? faq.data.items.length : 0,
    },
    {
      id: 'cm-usluge',
      name: T('Usluge', 'Shërbimet', 'Services'),
      source: 'home.services',
      fields: [
        { key: 'image', label: T('Fotografija', 'Fotografia', 'Photo'), type: 'image' },
        { key: 'title', label: T('Naziv', 'Titulli', 'Title'), type: 'text' },
        { key: 'text', label: T('Opis', 'Përshkrimi', 'Description'), type: 'text' },
        { key: 'service', label: T('Termin (usluga)', 'Termini (shërbimi)', 'Booking service'), type: 'reference' },
      ],
      entries: services && services.type === 'services' ? services.data.items.length : 0,
    },
    {
      id: 'cm-lokacije',
      name: T('Lokacije', 'Lokacionet', 'Locations'),
      source: 'settings.locations',
      fields: [
        { key: 'name', label: T('Naziv', 'Emri', 'Name'), type: 'text' },
        { key: 'address', label: T('Adresa', 'Adresa', 'Address'), type: 'text' },
        { key: 'city', label: T('Grad', 'Qyteti', 'City'), type: 'text' },
        { key: 'pickup', label: T('Preuzimanje', 'Marrje në vend', 'Pickup'), type: 'boolean' },
        { key: 'map', label: T('Mapa', 'Harta', 'Map'), type: 'link' },
      ],
      entries: locations,
    },
  ];
}

/* ================================================================== */
/* Homepage history & audit log                                        */
/* ================================================================== */
export function buildHomeHistory(now: Date, home: HomeSection[]): HomeVersion[] {
  const v1 = structuredClone(home).map((s) => (s.type === 'instagram' ? { ...s, enabled: false } : s));
  const v2 = structuredClone(home)
    .filter((s) => s.type !== 'promo')
    .map((s) => (s.type === 'blog' ? { ...s, enabled: false } : s));
  return [
    { at: iso(now, -6, -4), by: 'st-ana', sections: v1 },
    { at: iso(now, -21, -2), by: 'st-drita', sections: v2 },
  ];
}

export function buildAudit(now: Date, orders: Order[]): AuditEntry[] {
  const o = (i: number) => orders[Math.min(i, orders.length - 1)];
  const a = (id: number, hours: number, actor: string, action: AuditEntry['action'], object: AuditEntry['object'], objectId: string, detail?: string): AuditEntry => ({
    id: `au-${id}`,
    at: new Date(now.getTime() - hours * 3600000).toISOString(),
    actor,
    action,
    object,
    objectId,
    ...(detail ? { detail } : {}),
  });
  const list: AuditEntry[] = [
    a(1, 0.4, 'st-gent', 'login', 'staff', 'st-gent', 'Hyrje në CMS'),
    a(2, 1.2, 'st-arta', 'status', 'order', o(3).id, `${o(3).number}: new → confirmed`),
    a(3, 3, 'st-milica', 'assign', 'inquiry', 'inq_120', 'Besart Rexhepi → Arta Krasniqi'),
    a(4, 20, 'st-arta', 'create', 'draft', 'dr-1001', 'D-1001 — Shala Ndërtim'),
    a(5, 26, 'st-blerim', 'fulfil', 'order', o(8).id, o(8).number),
    a(6, 30, 'st-gent', 'create', 'quote', 'q-032', 'Q-2026-032 — Musliu Panel Montim'),
    a(7, 47, 'st-drita', 'create', 'offer', 'of-dimri', 'Sezoni i dimrit'),
    a(8, 48, 'st-drita', 'create', 'discount', 'd-dimri15', 'Dimri — jakne softshell −15%'),
    a(9, 50, 'st-drita', 'create', 'placement', 'pl-s4', 'Hero — Sezoni i dimrit'),
    a(10, 70, 'st-milica', 'create', 'booking', 'bk-103', 'Takim B2B — e martë 10:00'),
    a(11, 74, 'st-arta', 'send', 'quote', 'q-031', 'Q-2026-031 v2'),
    a(12, 96, 'st-blerim', 'adjust', 'inventory', 'p-bombol-abc', 'DC-KZ-701 −1 (damaged)'),
    a(13, 98, 'st-gent', 'send', 'draft', 'dr-1002', 'D-1002 — faturë paraprake'),
    a(14, 120, 'st-arta', 'receive', 'purchaseOrder', 'po-014', 'PO-2026-014: +98'),
    a(15, 146, 'st-ana', 'publish', 'home', 'home', 'Ballina — blloku promo i vjeshtës'),
    a(16, 150, 'st-ana', 'update', 'page', 'pg-dostava', 'Dërgesa'),
    a(17, 170, 'st-arta', 'status', 'quote', 'q-033', 'Q-2026-033: sent → accepted'),
    a(18, 200, 'st-gent', 'update', 'settings', 'settings', 'shippingZones'),
    a(19, 230, 'st-arta', 'refund', 'return', 'rt-1001', 'RT-1001'),
    a(20, 505, 'st-gent', 'publish', 'offer', 'of-veshje', 'Veshje pune për ekipe'),
    a(21, 508, 'st-drita', 'create', 'discount', 'd-veshje10', 'Vjeshtë — veshje pune −10% nga 3 copë (automatike)'),
    a(22, 510, 'st-drita', 'create', 'collection', 'col-veshje-pune', 'Veshje pune'),
  ];
  return list;
}
