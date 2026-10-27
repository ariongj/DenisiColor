# DENISI COLOR demo — shared brief for parallel agents

Project root: `/home/user/denisi-color` (Linux). It is a copy of the **SELCA** demo (live: https://ariongj.github.io/Selca/ — a
Montenegrin home-improvement shop) being re-branded into an e-commerce + CMS **sales demo for a new client, Denisi Color**.
It will be shown to the client in a meeting, so it must look **polished and premium** and feel like THEIR shop — no trace of
SELCA, Montenegro, doors/windows/flooring/kitchens, "free measurement & installation" or Montenegrin cities may remain visible.
Everything runs client-side (data persisted to localStorage).

## The client (verified from their public Facebook page, 27.10.2026)
- **Denisi Color**, Rr. Komandant Kumanova, **Shtime, Kosovë 72000**. Facebook page category: Tools/Equipment.
- Phone & WhatsApp **+383 45 648 117** · e-mail **denisicolor21@gmail.com** · Facebook https://www.facebook.com/profile.php?id=100037567517631
- Hours: **Mon–Sat 07:00–19:00, Sunday closed**. No website, no Instagram found.
- They take orders **by message** and **deliver across all of Kosovo** (fee/lead time not published → demo placeholders in Settings).
- Range seen in their posts: **workwear** (softshell jackets €26, Kapriol work top €35, work sweatshirts €16 — the only published prices),
  **Bosch tools & accessories** (EXPERT Sandwich Panel blade), **Bosch garden tools** (ISIO shears, ART 23 SL trimmer), **LED lighting**
  (ceiling 18W sensor / 36W, wall 24W IP54, street 50W IP65, Novaled), **LED strips & aluminium profiles**, **PARKSIDE folding hand truck**,
  **wood-burning stoves**, **ABC powder fire extinguishers** (2/3/5/8 kg). Brands visible: Bosch, Kapriol, PARKSIDE, Novaled.
- The name and branding also cover **paints, varnishes and facades** ("Ngjyra, llaqe, fasada") but we have NO verified paint products —
  present paints only as a category of the business with a "request an offer / ask us" call to action. **Never invent paint SKUs or prices.**
- Logo: thin open "D" monogram with two short posts + hairline divider + stacked bold **DENISI / COLOR** wordmark, dark navy on white
  (re-drawn in `src/components/brand/Logo.tsx`). Their social ads: navy/white, diagonal stripes, amber-yellow highlights.

## Honesty rules (the client must be able to trust the demo)
- Unknown prices are **"Kërko çmimin" / "Request a price"** (product `quoteOnly: true`, `price: 0`) — never show "0 €" or "from 0 €".
- Don't state certifications, warranties, safety guarantees, return policies or delivery fees as facts. Where the UI needs them, use
  neutral wording or clearly marked placeholders ("shembull", "për t'u konfirmuar"). Demo orders/customers/inquiries are fictional.
- The wood-stove photo is marked "AI content" on Facebook → it is described as illustrative.
- Images: only the shop's own photos exist (`public/images/p/*`, category crops `public/images/cat/*`), plus generated graphics:
  `/images/hero/navy.webp` (navy with diagonal stripes), `/images/hero/light.webp` (light with a navy diagonal), `/images/misc/ngjyra.webp`
  (paint fan-deck — use for the paints/facade category or promo), `/images/misc/koleksioni.webp` (2×2 product collage). Every Selca image
  (hero/living, cat/vrata, s/*, projects/*, misc/about, p/vrata-…) has been DELETED — any remaining reference is a broken image to fix.
  No external image hosts are reachable (Unsplash is blocked); product photos are square social-media ad graphics with text baked in,
  so prefer `object-contain` on white/light backgrounds or tasteful crops; don't put long overlay text on top of them.

## Catalogue (src/data/catalog.ts — already written, ids are final)
Categories: `cat-veshje` (veshje-pune), `cat-vegla` (vegla), `cat-kopshti` (kopshti), `cat-ndricim` (ndricim), `cat-led` (led-shirita),
`cat-ngrohje` (ngrohje), `cat-zjarri` (kunder-zjarrit).
Sellable (priced): `p-jakne-softshell` €26 (colour grey/black/white), `p-duks-kapriol` €35, `p-duks-pune` €16 (4 colours).
Request-a-price (quoteOnly): `p-disk-bosch-sandwich`, `p-karroce-parkside`, `p-bosch-isio`, `p-bosch-art23`, `p-ndricues-senzor-18w`,
`p-ndricues-tavani-36w`, `p-ndricues-muri-24w`, `p-ndricues-rrugor-50w`, `p-ndricues-novaled-50w`, `p-led-shirit`, `p-profil-alumini-led`,
`p-kamina-dru`, `p-bombol-abc`. Vendors set in catalog: Kapriol, Bosch, PARKSIDE, Novaled. No product uses m², installation or packs.
Settings (`DEFAULT_SETTINGS` in src/data/content.ts) are already Denisi's: order prefix `DC-`, VAT 18 %, Kosovo shipping zones
(Shtime e rrethina / Prishtina e qendra / Pjesa tjetër e Kosovës), one location "Dyqani Shtime", timezone Europe/Belgrade,
markets Kosovo active (+ Albania / North Macedonia drafts). Kosovo IDs: NUI (business number), TVSH (VAT) — placeholders contain X.
CMS demo login: `admin@denisicolor.com` / `denisi2026`.

## Kosovo context for demo data
Cities: Shtime, Prishtinë, Ferizaj, Lipjan, Prizren, Pejë, Gjakovë, Mitrovicë, Gjilan, Vushtrri, Suharekë, Fushë Kosovë, Podujevë, Drenas,
Rahovec, Malishevë, Kaçanik. Phone format `+383 4x xxx xxx`. Names: mostly Albanian (Arben, Blerta, Driton, Fatjona, Kushtrim, Liridona,
Valon, Arta, Besart, Egzona, Granit, Mimoza, Shpend, Teuta, Ilir, Vjosa; surnames Krasniqi, Berisha, Gashi, Hoxha, Shala, Morina,
Bytyqi, Kryeziu, Rexhepi, Avdiu, Hasani, Mustafa, Zeka, Sadiku, Musliu, Ramadani), a few Serbian/Bosniak/Turkish names are fine.
Typical customers: contractors and construction firms (B2B — LED for a new building, workwear for a crew, fire extinguishers for an office),
electricians, households. Use e-mails `@example.com`.

## Stack
Vite 8, React 19, TypeScript (strict, `noUnusedLocals`), Tailwind CSS v4 (CSS-first config in `src/index.css`; important
modifier goes at the END: `opacity-0!`), react-router 7 (`import { Link, useNavigate, useParams, useSearchParams } from 'react-router'`),
zustand 5, motion 12 (`import { motion, AnimatePresence } from 'motion/react'`), lucide-react 0.577 icons, recharts 3, sonner (`toast`).
Path alias `@/` → `src/`. Page components use **default export**.

## Design tokens (src/index.css)
Colours: `brand-50…900` (Denisi navy, 600 = #264a78, overridable at runtime), `ink` (#121a24 text), `ink-soft`, `muted`,
`paper` (#f4f6f9 page bg), `sand` / `sand-2` (cool light greys — names kept from Selca), `line` (borders), `oak` (now an amber accent #b26b00), `sage`, `canvas` (admin bg).
Fonts: `font-sans` = Manrope (UI), `font-display` = Montserrat (bold geometric sans, like the Denisi wordmark) — `.display` is extrabold.
Utilities/classes: `container-x`, `eyebrow`, `card`, `link-u`, `prose-cms`, `no-scrollbar`, `bg-grain`, `skeleton`,
animations `animate-fade-up`, `animate-fade-in`, `animate-pop`.
Storefront style: cool light-grey/white backgrounds, ink text, navy accents, generous whitespace, rounded-2xl/3xl images, bold
Montserrat display headings with *accent* words in navy (no longer italic serif). Denisi's own ads use navy + white with diagonal stripes
and an amber/yellow highlight — that is the visual language to echo. Admin style: `bg-canvas`, white `Card`s, compact tables, `shape="rounded"` buttons.

## Reusable components (read the source before use)
- `@/components/ui/Button`: `Button`, `ButtonLink` (props: variant primary|dark|light|outline|outlineLight|ghost|danger|soft, size xs|sm|md|lg|icon|iconSm, shape pill|rounded, icon, iconRight, loading), `buttonClass()`.
- `@/components/ui/Field`: `Input` (label, hint, error, leading, trailing), `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioCard`, `Label`, `Hint`.
- `@/components/ui/Overlay`: `Drawer` (side, title, footer, width), `Modal` (title, description, footer, size sm|md|lg|xl|full).
- `@/components/ui/misc`: `Badge` (tones brand|dark|light|sand|green|amber|blue|violet|red|gray|outline, dot), `Img` (fade-in; `small` uses the 640px `-sm.webp` variant), `Reveal` (scroll fade-up, `delay`), `QtyStepper`, `Accordion`, `Tabs`, `EmptyState`, `Accent` (renders `*word*` in brand navy), `plain()`, `useCountdown()`.
- `@/components/ui/Markdown`: `<Markdown source=... />` (## headings, lists, > quotes, **bold**, [links](/x)).
- `@/components/brand/Logo` (`Logo`, `LogoMark`, tone dark|light), `@/components/brand/Social` (Instagram/Facebook/WhatsApp/Viber icons), `@/components/LangSwitcher`.
- Storefront: `@/site/components/ProductCard` (`ProductCard`, `ProductBadges`), `@/site/components/Price` (`Price`, `hasPriceRange`), `@/site/components/SectionHeading` (`SectionHeading`, `Breadcrumbs`, `PageHero`), `@/site/components/MeasureForm` (`MeasureForm` type measurement|quote|contact → creates an inquiry in the CMS), `usePageTitle(title)` from `@/site/layout/SiteLayout`.
- Admin kit `@/admin/components/kit`: `PageHeader` (title, description, actions, back, badge, **breadcrumbs** — see "CMS v2 shell"), `Card` (title, description, actions, padded, bodyClassName), `Table`/`Th`/`Td`/`Tr`, `SearchInput`, `FilterPills`, `OrderStatusBadge`, `PaymentStatusBadge`, `InquiryStatusBadge`, `ORDER_STATUS_TONE`, `SaveBar` (dirty, onSave, onDiscard), `confirmDialog({title,text,confirmLabel,danger})` → Promise<boolean>, `KV`, `Thumb`.
- `@/admin/components/L10nInput`: `L10nInput` (label, value: L10n, onChange, multiline, rows, hint) — one field with ME/SQ/EN tabs.
- `@/admin/components/media`: `ImageField` (single image: media library + upload), `GalleryField` (multi, drag reorder, first = cover), `MediaPicker`, `Dropzone`, `useUploader()`, `compressImage()`.

## Data
- Types: `src/lib/types.ts` (Product, Category, Order, Inquiry, Coupon, CmsPage, Post, Project, MediaItem, HomeSection union, Settings, L10n, Lang…).
- Store `useDb` (`src/store/db.ts`) — data + actions: updateSettings, upsertProduct, deleteProduct, duplicateProduct, upsertCategory, deleteCategory, moveCategory, placeOrder, updateOrder, setOrderStatus(id,status,note?), addOrderNote, markOrderSeen, markAllOrdersSeen, deleteOrder, addInquiry, updateInquiry, deleteInquiry, upsertCoupon, deleteCoupon, upsertPage, deletePage, upsertPost, deletePost, upsertProject, deleteProject, addMedia, updateMedia, deleteMedia, updateHomeSection, setHome, resetDemo, importDb.
- Store `useUi` (`src/store/ui.ts`): lang, adminLang, cart, wishlist, coupon, recentlyViewed, adminAuthed + actions.
- Hooks `src/store/hooks.ts`: useSettings, useCategories (sorted), useActiveProducts, useProduct(idOrSlug), useCategory, useCart, useAdminBadges.
- **zustand v5 rule:** a selector must return a stable reference. NEVER `useDb(s => s.orders.filter(...))` or `useDb(s => ({...}))` — that causes an infinite render loop. Select raw slices (`useDb(s => s.orders)`) and derive with `useMemo`, or use `useShallow` from `zustand/react/shallow`.
- Helpers: `src/lib/format.ts` (money(v, lang), moneyCompact, num, date, dateTime, timeAgo, unitLabel, perUnit), `src/lib/pricing.ts` (basePrice, isOnSale, discountPct, unitPrice, priceCart, packsForArea, allCities, zoneForCity, validateCoupon…), `src/lib/utils.ts` (cn, uid, slugify, thumb, download, initials, round2), `src/lib/search.ts` (fold, searchProducts).
- Order numbers look like `DC-1042`; units: `kom` (piece), `m2`, `m`, `set` (Denisi only uses `kom`). Prices are EUR incl. 18% VAT (Kosovo; to be confirmed by the shop).

## i18n (mandatory)
Every visible string in ME / SQ / EN. **Albanian (sq) is now the default** for both the storefront and the CMS; English second.
The `me` key is kept in the code but is now labelled **"Srpski" (SR)** — Kosovo's other official language — and is disabled on the storefront by
default (Settings → Languages). For NEW or REWRITTEN strings write `me` in Serbian Latin, **ekavian** ("merenje", "cena", "bela", "vreme", "porudžbina").
Existing Montenegrin `me` UI strings may stay as they are unless you are rewriting that string anyway. Never leave `me` empty: `lt()` falls back to `me`.
- Local dictionary at the top of each page: `const T = defineDict({ me: {...}, sq: {...}, en: {...} })` from `@/i18n`, then `const t = useDict(T, 'admin')` (admin pages) or `useDict(T)` (storefront). TypeScript enforces identical keys.
- Localized data values (`L10n`): `const l = useL('admin')` / `useL()` → `l(product.name)`. Current language: `useLang('admin')` / `useLang()`.
- Shared dicts you may use: `common` (`@/i18n/common`: status_*, pay_*, paystatus_*, delivery_*, inq_*, inqstatus_*, badge_*, subtotal, total…), `adm` (`@/admin/i18n`: admin chrome — save, cancel, delete, edit, add, status, date, published, draft, active…), `site` (`@/i18n/site`).


## Rules
1. Only edit the files you OWN (listed in your task). Shared files you don't own: if you need something there, write a local helper in
   your own files and mention it in your final report. Another agent may be editing other files at the same time — never revert,
   reformat or "fix" files you don't own.
2. Routes are wired in `src/App.tsx` (Montenegrin URL slugs like `/proizvodi`, `/proizvod/:slug`, `/kontakt` stay as they are).
3. Type-check: `cd /home/user/denisi-color && npx tsc --noEmit` — no errors in YOUR files (ignore transient errors in files another agent
   owns unless they block you; mention them in your report).
4. Visual QA (required). The dev server already runs at http://localhost:5173 with HMR — do NOT start another one, do NOT run `vite build`.
   Screenshot tool:

       cd /tmp/claude-0/-home-user/8be4ab5d-52ba-5446-b0cf-0b08ecb95c03/scratchpad/qa && NODE_PATH=$(npm root -g) node shot.cjs <path> <name> [width=1440] [height=900] [viewport|full] [--pre "<js>"] [--post "<js>"] [--wait ms]

   → writes `/tmp/claude-0/-home-user/8be4ab5d-52ba-5446-b0cf-0b08ecb95c03/scratchpad/qa/shots/<name>.png` (prefix the name with your agent letter, e.g. `C-home`), prints page errors. Open it with Read.
   `--pre` runs JS on a blank page of the same origin BEFORE navigating (seed localStorage), `--post` after load (click, open a drawer…).
   localStorage keys: data store `denisi-db` (seeded automatically on first load; `localStorage.removeItem('denisi-db')` forces a re-seed
   after you change seed data), ui store `denisi-ui`, shape `{state:{lang,adminLang,cart,wishlist,coupon,codes,recentlyViewed,adminAuthed,adminRole},version:2}`.
   Admin logged in, Albanian: `--pre "localStorage.setItem('denisi-ui', JSON.stringify({state:{lang:'sq',adminLang:'sq',cart:[],wishlist:[],coupon:null,codes:[],recentlyViewed:[],adminAuthed:true,adminRole:'owner'},version:2}))"`.
   Check desktop 1440×900 AND mobile 390×844, Albanian first, plus English.
5. Quality bar: real-client sales demo. Real data from the store, no lorem ipsum, consistent spacing, hover/empty states, responsive to 390px.
   Match the surrounding code style (comment density, naming, idioms).
6. Final report (≤ 300 words): files changed, notable decisions, anything left that still mentions SELCA/Montenegro or home-improvement
   in files you don't own, anything incomplete.

---

## CMS v2 design rules (from the PDF, p.07) — the admin is NEUTRAL: black, grey, white
- Top bar `#1A1A1A` with "CMS", global search ("Kërko produkte, porosi ose klientë…") and the store/account on the right.
- Sidebar light grey `#EBEBEB`; active item = white pill. Work background `#F1F1F1`; white cards, radius 10–12 px (`rounded-xl`),
  thin grey border, very light shadow. On narrow screens the sidebar opens as a drawer.
- Primary button BLACK with white text; secondary buttons white with a border. **No decorative blue, and no SELCA red inside the
  admin** (the shell remaps the `brand-*` colours to neutral greys/black under /admin, so `Button variant="primary"` renders black).
- Base text 13–14 px, screen titles 22–28 px, compact tables, tabs, filters, status badges, action menus, dialogs.
- Forms in small labelled groups; an unsaved-changes bar with "Ruaj / Hidh poshtë" (Save / Discard) — use `SaveBar`.
- Empty, loading, error and success states. **Statuses use text + a symbol (dot/icon), never colour alone.**
- Screen layout: breadcrumb (e.g. "Produktet / Të gjitha"), title + actions on the right, then cards/tables.
- The CMS is presented to an Albanian-speaking client: the admin defaults to **Albanian (sq)**; keep ME and EN complete too.
  Use the PDF's Albanian terminology (Përmbledhje, Porositë, Produktet, Koleksionet, Inventari, Klientët, Rritja, Ofertat, Zbritjet,
  Përmbajtja, Tregjet, Analitika, Kontaktet, Terminet, Online Store, Integrime, Konfigurimet, Çmimi referues, Kosto / copë, …).


## Raw URLs and the GitHub Pages build
The app is also deployed under a sub-path (live: `https://ariongj.github.io/DenisiColor/`). Never hard-code absolute URLs in raw `<a href>`,
`<iframe src>`, `window.open()` or `location.href` — use `href(/admin/…)` from `@/lib/paths` (react-router `<Link>`/`navigate`
already handle the base). Image paths like `/images/...` inside data are rewritten automatically at build time; in JSX use them as-is.

    import { href, asset, appPath } from @/lib/paths;
    <a href={href(`/proizvod/${p.slug}`)} target="_blank" rel="noreferrer">…</a>   // → /DenisiColor/proizvod/… on Pages, /proizvod/… at root
    window.open(href(`/admin/faktura/${order.id}`), _blank, noopener);
    <iframe src={href(/?preview=1)} />                                         // homepage draft preview
    asset(/favicon.svg)            // public-folder file outside the /images/ rewrite
    appPath(location.pathname)       // strip the base from a raw pathname

- Build: `vite.config.ts` reads `BASE_PATH` (default `/`); the `denisi-base-images` (vite.config.ts) plugin prefixes every `/images/…` string literal
  in `src/**/*.ts(x)` with the base at build time (also `startsWith(/images/)` checks, so they keep matching).
  Router basename = `BASENAME` from `@/lib/paths` (`import.meta.env.BASE_URL` without the trailing slash).
- Deploy: `.github/workflows/pages.yml` builds on push to `main` with `BASE_PATH=/DenisiColor/`, copies `dist/index.html` → `dist/404.html`
  (SPA deep links) + `.nojekyll`, deploys with `actions/deploy-pages`. Root deployments keep `vercel.json` / `public/_redirects`.
- A CSS selector that matches a link must not assume the root: `a[href$="/admin"]`, not `a[href="/admin"]`.

---


# CMS v2 API (foundation — data, store, discount engine)

**Types** (`src/lib/types.ts`, all additive): `Product` + `status 'active'|'draft'|'archived'`, `cost`, `vendor`, `tags`, `barcode`,
`incoming`, `unavailable`, `template 'standard'|'quote'`, `channels ('online'|'pos')[]` (all optional except status).
`Order` + `discounts: AppliedDiscount[]` {id,title,kind,code?,amount}, `shippingBeforeDiscount`, `refunds`, `fulfillment`
{shippedAt,deliveredAt,carrier,tracking,partial}, `tags`, `draftId`; `payment.refunded|authorized|failed`; `OrderLine.discount` +
`allocations` + `custom`. `Inquiry` + `assignee` (staff id), `source`, `tags`, `company`, `followUpAt`.
New: `Collection`, `Discount`, `Offer`, `Placement`, `Staff`/`RoleId`, `Service`, `Booking`, `Segment`, `InventoryMovement`,
`PurchaseOrder`, `DraftOrder`, `ReturnRequest`, `Quote`, `Menu`/`MenuItem`, `ContentModel`, `AuditEntry`, `HomeVersion`.
`Settings` + `timezone`, `orderPrefix`, `locations`, `notifications`, `integrations`, `markets`, `checkout`, `privacy`.
`Db` + `collections discounts offers placements staff services bookings segments movements purchaseOrders drafts returns quotes
menus contentModels audit homeDraft homeHistory` (`coupons` kept for the old Coupons screen; pricing uses `discounts`).

**Store `useDb`** (`src/store/db.ts`, DB_VERSION 5 → every browser re-seeds):
- Generic: `upsert(key, item)` / `remove(key, id)` for every list above (`CollectionKey`), audited for business objects.
  Upserting a discount normalises its code; the active automatic shipping rule keeps `settings.freeShippingThreshold` in sync (both ways).
- Orders: `placeOrder({customer, items, delivery, payment, codes?, couponCode?, lang})` (stores applied discounts + line allocations,
  increments `uses` and the linked offer's metrics, writes `sale` movements), `setOrderStatus` (cancel of an open order releases stock),
  `fulfillOrder(id, {carrier?, tracking?, partial?})`, `refundOrder(id, amount, lineIds?, note?)`.
- `convertDraft(id) → Order` (same path as placeOrder, custom lines appended, status confirmed), `createReturn({orderId, lines, reason,
  restock?})` (refund = net paid amount of the lines), `setReturnStatus(id, status)` (`received` restocks once; `refunded` calls refundOrder).
- Inventory: `adjustStock(productId, delta, reason, note?, ref?)`, `receivePurchaseOrder(id, [{productId, received, rejected?}])` —
  quantities are CUMULATIVE totals, so the same receipt twice adds nothing.
- Home: `saveHomeDraft(sections)`, `publishHome()` (old live → `homeHistory`, max 10), `discardHomeDraft()`, `restoreHomeVersion(i)` (into the draft).
  `setHome`/`updateHomeSection` still write the live home directly.
- Contacts/calendar: `assignInquiry(id, staffId)`, `addBooking(input) → {ok, booking} | {ok:false, reason}` (`staffBusy|capacity|staff|service|invalid`),
  `rescheduleBooking(id, start, staffId?)`, `setBookingStatus(id, status)`. `logAudit({action, object, objectId, detail?})`.
- `DATA_KEYS` is exported (use it for export/backup — the Settings "Demo data" export still lists only the v1 keys).

**Store `useUi`** (v2, migrates v1 keeping cart/wishlist): `codes` + `addCode/removeCode/clearCodes` (`coupon`/`setCoupon` = alias of
`codes[0]`), `adminRole: RoleId` (default `'owner'`) + `setAdminRole`, `adminLang` default `'sq'`. Presets in imgtools now write version 2.

**Hooks** (`src/store/hooks.ts`): `useCart()` (auto discounts + `ui.codes`), `usePlacements(position)`, `useCollection(idOrSlug)`,
`useCan()` → `(module, action?) => boolean`, `useCurrentStaff()`, `useAdminBadges()` (+ openReturns, pendingBookings, openDrafts).

**Helpers**
- `lib/discounts.ts` — `applyDiscounts({lines, discounts, codes, shipping, shippingZoneId, customer, now})` → `{lines (with allocations),
  subtotal, productDiscount, orderDiscount, shippingDiscount, discountTotal, shipping, total, applied, rejected[{code,id,reason,missing?,
  conflictsWith?,auto}]}`; `discountState(d, now)` (active|draft|paused|scheduled|expired), `canCombine`, `discountClass`,
  `normalizeCode`, `isDuplicateCode`, `allocateCents`, `discountValueLabel`. Reasons: notfound inactive scheduled expired minimum
  notCombinable notEligible usageLimit audience. Check: `node --experimental-strip-types src/lib/__tests__/discounts.check.ts`.
- `lib/pricing.ts` — `priceCart(cart, products, settings, {lang, codes, discounts, collections, delivery, city, now?, customer?})`.
  `Totals` adds `applied, rejected, codes, productDiscount, orderDiscount, shippingDiscount, shippingBeforeDiscount,
  freeShippingThreshold (null = no live rule), couponMinimum`; `PricedLine` adds `discount, allocations`; `activeShippingRule()`.
- `lib/orders.ts` — `fulfillmentOf(o)`, `paymentOf(o)`, `refundedOf`, `orderLineNet`, `refundForLines`, `isOpenOrder`.
- `lib/permissions.ts` — `can(role, module, action)`, `modulesFor(role)`, `actionsFor`, `MODULES`, `ACTIONS`, `ROLES`, `ROLE_META` (ME/SQ/EN names).
  Marketing can prepare offers/discounts but not `publish`; reception sees overview/customers/contacts/quotes/appointments.
- `lib/collections.ts` — `collectionProducts(c, products, {publicOnly})`, `inCollection`, `matchesRule`, `collectionIdsFor`, `membershipIndex`.
- `lib/offers.ts` — `offerState`, `placementState(p, now, offer)` (inherits the offer's window / pause), `activePlacements(list, position, offers)`, `offerRates`.
- `lib/inventory.ts` — `stockLevels(p, committedByProduct(orders))` → onHand/committed/unavailable/available/incoming, `incomingByProduct`, `purchaseOrderTotals`.
- `lib/bookings.ts` — `checkBooking`, `overlaps`, `bookingEnd`, `bookingsOnDay`. `lib/crm.ts` — `inquiryKind`, `segmentSubjects(orders)`, `matchesSegment`, `segmentMembers`, `segmentIdsFor`.

**Seeded ids** — staff `st-gent` (owner), `st-arta` (manager), `st-drita` (marketing), `st-milica` (reception), `st-blerim`
(orders/installer), `st-ana` (editor). Services `sv-mjerenje`, `sv-konsultacija`, `sv-montaza`; bookings `bk-101…116` (this + next week).
Collections `col-podovi-akcija` & `col-premium-kupatilo` (smart), `col-jesenja-akcija`, `col-bestseleri`, `col-novi-stan` (manual, unpublished).
Discounts `d-selca10` (SELCA10, order −10% ≥ €100), `d-podovi15` (auto −15% on col-podovi-akcija), `d-vrata-kvaka` (auto BXGY 3 doors →
handle free), `d-dostava300` (auto free shipping ≥ €300), `d-jesen25` (JESEN25), `d-bf-vrata` (scheduled), `d-ljeto15` (expired LJETO15),
`d-vip50` (draft, segment). Offers `of-jesen`, `of-dobrodoslica` (active), `of-kupatilo` (draft), `of-blackfriday` (scheduled).
Placements `pl-s1…s3` (live hero), `pl-s4` (scheduled), `pl-s5` (draft), `pl-b1`, `pl-b2` (catalog), `pl-a1…a4` (bar).
Segments `seg-vip`, `seg-povratni`, `seg-primorje`, `seg-shqip`. POs `po-014` (partial), `po-015` (sent). Drafts `dr-1001`, `dr-1002`.
Returns `rt-1001` (refunded), `rt-1002` (requested). Quotes `q-031` (sent, from inquiry `inq_120`), `q-032` (draft). Menus `menu-main`,
`menu-footer`. Content models `cm-projekti`, `cm-faq`, `cm-usluge`, `cm-lokacije`. Locations `loc-pg`, `loc-tz`. Archived product `p-statuario`.

---

# CMS v2 shell (foundation part 2 — layout, routes, theme)

**Shell** (`src/admin/layout/*`, PDF p.07/08/12): fixed dark top bar `#1A1A1A`, 56 px (`CMS` + SELCA mark · global search →
command palette `Ctrl/⌘+K` · "Shiko si: …" chip when the role is not owner · store label → site · ME/SQ/EN · notifications ·
account menu with the role switcher + logout); light sidebar `#EBEBEB`, **240 px**, white-pill active item, sub-items expand under the
active parent, badges = unseen orders / new contacts / pending bookings; drawer under `lg`. Work area `#F1F1F1`, content
`max-w-[1320px] px-4 sm:px-6 lg:px-8`, top padding already applied — a page starts directly with `<PageHeader>`.
- Files: `AdminLayout.tsx` (shell), `Sidebar.tsx`, `nav.ts` (**single source of truth**: sidebar, palette screens, tab title —
  add a screen here + in `App.tsx`), `CommandPalette.tsx`, `Notifications.tsx` (+ `useNewOrderToasts`), `AccountMenu.tsx`,
  `AdminLangToggle.tsx`, `RequirePerm.tsx` + `NoAccess.tsx`, `popover.ts` (`useDismiss`, `useScrollLock`, `MOD_KEY`, `DROPDOWN`).
- Neutral theme: `setAdminTheme(on)` (`src/lib/color.ts`) runs from `Root` in `App.tsx` for every path starting with `/admin`
  (login + invoice included). It sets `html[data-admin]`, remaps `brand-50…900` to greys (600 `#1A1A1A`, 700 `#000`) and the warm tokens
  (`ink`, `muted`, `paper`, `sand`, `line`, `canvas #F1F1F1`) to neutral ones; leaving `/admin` restores the SELCA brand. So in the CMS
  `bg-brand-600`, `Button variant="primary"`, `Badge tone="brand"` are black/grey automatically — **never** hard-code SELCA red there.
  Need the storefront red inside the CMS (a storefront preview card)? `style={brandVars(settings.brandColor)}` on the wrapper.
- `cn()` is plain `clsx` (no tailwind-merge): a `className` you pass does NOT override a conflicting class inside a component
  (`h-11` + `h-8` → undefined winner). Wrap the component or give it a prop instead.
- Admin type scale: body 14 px; tables 13.5 px; screen titles 22–26 px (PageHeader); cards `rounded-xl` (Card does it).
- `SaveBar` is a dark bar with a white "Ruaj" button, centred on the work area (`lg:left-[calc(50%+120px)]`).

**PageHeader breadcrumbs** (PDF p.12 "Produktet / Të gjitha"). All old props keep working.

    import { PageHeader, type Crumb } from '@/admin/components/kit';
    const ta = useDict(adm, 'admin');
    <PageHeader breadcrumbs={[ta('nav_products'), ta('all')]} title={ta('nav_products')} actions={<Button …/>} />
    // a crumb can link back:  { label: ta('nav_offers'), to: '/admin/ponude' }
    <PageHeader back="/admin/ponude" breadcrumbs={[{ label: ta('nav_offers'), to: '/admin/ponude' }, l(offer.name)]} title={l(offer.name)} badge={<Badge …/>} />

With `breadcrumbs`, `back` renders as a small ← icon in front of the trail; without them it is the old "← Kthehu" link. Use the `nav_*`
keys of the `adm` dict for module names so the trail matches the sidebar.

**Roles & permissions for page builders** (PDF p.42). Routes are already wrapped in `<RequirePerm module=…>` (view) — a role without
access sees "Nuk keni leje". Inside a page, gate actions with the hook (re-renders when the role switcher changes):

    const can = useCan();                                   // from '@/store/hooks'
    {can('discounts', 'publish') ? <Button>Aktivizo</Button> : <Badge tone="amber" dot>Pret miratimin</Badge>}
    {can('products', 'viewCost') && <Input label="Kosto / copë" … />}
    <Button disabled={!can('orders', 'refund')}>Rimburso</Button>
    // inside a route element: <RequirePerm module="settings" action="edit">…</RequirePerm>

Actions: `view edit publish archive delete import export viewCost refund cancel`. The demo role lives in `useUi().adminRole`
(switcher in the account menu; `useCurrentStaff()` = the staff member acting). Hide what a role can't do rather than erroring;
marketing *prepares* offers/discounts (edit) but cannot `publish`.

**Route map** (`src/App.tsx`, all under `RequireAuth` + `AdminLayout` + `RequirePerm`; pages are lazy, default export).
Stub = one-line placeholder file waiting for its builder.

| URL | Page file (`src/admin/pages/`) | module |
|---|---|---|
| `/admin` | Dashboard | overview |
| `/admin/narudzbe`, `/admin/narudzbe/:id` | Orders, OrderDetail | orders |
| `/admin/nacrti`, `/admin/nacrti/:id` (`novi` = new) | DraftOrders (stub), DraftOrderEdit (stub) | drafts |
| `/admin/povrati` | Returns (stub) | returns |
| `/admin/proizvodi`, `/admin/proizvodi/novi`, `/admin/proizvodi/:id` | Products, ProductEdit | products |
| `/admin/kolekcije`, `/admin/kolekcije/:id` (`novi`) | Collections (stub), CollectionEdit (stub) | collections |
| `/admin/kategorije` | Categories | products |
| `/admin/inventar` | Inventory (stub) | inventory |
| `/admin/nabavke` | PurchaseOrders (stub) | purchasing |
| `/admin/kupci` (`?c=<customer key>`, `?q=`) | Customers | customers |
| `/admin/segmenti` | Segments (stub) | segments |
| `/admin/ponude`, `/admin/ponude/:id` | Offers (stub), OfferEdit (stub) | offers |
| `/admin/popusti`, `/admin/popusti/:id` | Discounts (stub), DiscountEdit (stub) | discounts |
| `/admin/stranice[/:id]`, `/admin/savjeti[/:id]`, `/admin/projekti` | Pages, PageEdit, Posts, PostEdit, ProjectsAdmin | content |
| `/admin/meniji`, `/admin/modeli`, `/admin/mediji` | Menus (stub), ContentModels (stub), Media | content |
| `/admin/trzista` | Markets (stub) | markets |
| `/admin/analitika` | Analytics (stub) | analytics |
| `/admin/kontakti` (`?id=<inquiry>`) | Inquiries (contacts inbox) | contacts |
| `/admin/kontakti/ponude` | Quotes (stub) | quotes |
| `/admin/termini` (`?id=<booking>`), `/admin/termini/usluge` | Appointments (stub), AppointmentServices (stub) | appointments |
| `/admin/prodavnica` | OnlineStore (stub — "Tema") | onlineStore |
| `/admin/prodavnica/editor` | ContentEditor (homepage builder) | onlineStore |
| `/admin/prodavnica/slajdovi`, `/admin/prodavnica/slajdovi/:id` | Slides (stub), SlideEdit (stub) | onlineStore |
| `/admin/integracije` | Integrations (stub) | integrations |
| `/admin/konfiguracija`, `/admin/konfiguracija/:section` | SettingsPage (read `useParams().section`) | settings |
| `/admin/moduli` | ModuleMap (stub) | — (everyone) |
| `/admin/faktura/:id` | Invoice — outside the shell (print) | — |

Redirects (query kept): `/admin/upiti → /admin/kontakti`, `/admin/sadrzaj → /admin/prodavnica/editor`, `/admin/kuponi → /admin/popusti`,
`/admin/postavke → /admin/konfiguracija`; any other `/admin/*` → `/admin`. Storefront additions: `/kolekcija/:slug` (CollectionPage, stub)
and `/oferta/:slug` (OfferPage, stub) in `src/site/pages/`. Homepage `/?preview=1` renders `homeDraft ?? home` (builder iframe);
the published home otherwise.

Deep links other screens may rely on: notifications/palette open `/admin/narudzbe/:id`, `/admin/kontakti?id=…`, `/admin/termini?id=…`,
`/admin/ponude/:id`, `/admin/kolekcije/:id`, `/admin/kupci?c=…` — keep those params working when you build the page.
