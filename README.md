# DENISI COLOR — e-commerce + CMS demo

A complete, clickable demo of an online shop for **Denisi Color**, Shtime (Kosovë): *vegla, ndriçim, LED, veshje pune,
ngrohje, kundër zjarrit — dhe ngjyra, llaqe & fasada*. Built on the same platform as the SELCA demo
(https://ariongj.github.io/Selca/), re-branded and re-filled with Denisi Color's own catalogue.

- **Storefront**: home page, catalogue with filters, product pages, cart, checkout (cash on delivery, bank transfer
  or simulated card), order confirmation. There are also pages for paints & facade, how we work, about, contact, the
  blog ("Këshilla"), CMS pages, search and a wishlist.
- **Request-a-price products**: items without a published price show **"Kërko çmimin"** with an enquiry form (it
  lands in the CMS) and a WhatsApp button, never "0 €".
- **CMS** (`/admin`): overview, orders, drafts and returns, products, collections and inventory, customers, discounts
  and offers, the homepage builder, content and menus, markets, analytics, contacts with B2B quotes, appointments,
  and settings with roles. Neutral design, Albanian by default.
- **Languages**: Albanian (default) and English. Serbian is available and can be switched on under Konfigurimet →
  Gjuhët.

Everything runs in the browser (no backend needed for the demo). Data is stored in `localStorage` and every open tab
stays in sync, so an order placed on the storefront appears in the CMS instantly.

## Run it

Requirements: Node.js 20.19+.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The CMS is at http://localhost:5173/admin. **CMS demo login** (pre-filled):
`admin@denisicolor.com` / `denisi2026`.

Production build: `npm run build` (static files in `dist/`), then `npm run preview`.

## Deploy

- **GitHub Pages**: `.github/workflows/pages.yml` builds on every push to `main` with `BASE_PATH=/DenisiColor/` and
  publishes the result to the `gh-pages` branch, which Pages serves at https://ariongj.github.io/DenisiColor/.
- **Vercel / Netlify**: works as is at the root (`vercel.json` / `public/_redirects`).

## What is real and what is placeholder

| Real (from Denisi Color's public Facebook page, 27.10.2026) | Placeholder / to confirm with the shop |
| --- | --- |
| Name, address (Rr. Komandant Kumanova, Shtime), phone & WhatsApp +383 45 648 117, e-mail, hours Mon–Sat 07–19 | NUI / TVSH numbers, bank account (marked "Shembull" in Settings) |
| 16 products in 7 categories, with specs as advertised | Stock levels, SKUs, sold counts, costs |
| Prices: softshell jacket 26 €, Kapriol 35 €, work sweatshirt 16 € | All other prices ("Kërko çmimin"), whether VAT (18 %) is included |
| Delivery across Kosovo, orders by message | Delivery fees (2/3/4 € zones), free-delivery threshold, return & warranty terms |
| Product photos (their own ad graphics) | Rights to use the photos publicly, the original vector logo |
| Paints / varnishes / facade as a business line | Actual paint products (deliberately none invented) |

Orders, customers, enquiries, quotes and staff are generated demo data (fictional names, `@example.com`).
Card payment is simulated.

## Before the meeting (2 minutes)

1. **CMS → Konfigurimet → Të dhënat demo → Rivendos** regenerates the orders and enquiries relative to today.
2. Optional: put the storefront and `/admin` side by side for the "live order" moment.

See `DEMO_SCRIPT.md` for the walkthrough.

## Path to production

| Demo | Production |
| --- | --- |
| `localStorage` data | Hosted database + API |
| Demo login | Real accounts with roles (owner, sales, warehouse) |
| Simulated card payment | A Kosovo bank's e-commerce gateway, plus cash on delivery |
| — | Courier integration, ATK fiscalisation, e-mail/WhatsApp notifications, own domain, SEO prerendering |
| Facebook ad graphics | Clean product photos (white background), full product list with prices and sizes |

## Tech

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router 7 · Zustand · Motion · Recharts · Lucide icons ·
Montserrat + Manrope fonts (self-hosted).

```
src/
  App.tsx              routes (storefront + /admin, CMS is code-split)
  lib/                 types, pricing (VAT, shipping zones, discounts), formatting, search
  i18n/                typed dictionaries (sq / en / sr — the Serbian slot is the `me` key)
  data/                catalogue, homepage sections, pages, posts, CMS demo data, demo-order generator
  store/               zustand stores (db = CMS data, ui = cart/lang/session) + cross-tab sync
  components/          UI kit, logo, icons
  site/                storefront layout, sections, pages
  admin/               CMS layout, components, pages
public/images/         WebP images (+ -sm thumbnails)
```
