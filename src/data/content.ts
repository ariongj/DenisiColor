import type { CmsPage, Coupon, HomeSection, L10n, Post, Project, Settings } from '@/lib/types';

const T = (me: string, sq: string, en: string): L10n => ({ me, sq, en });

/* ------------------------------------------------------------------ */
/* Settings (placeholders marked in Admin → Postavke)                  */
/* ------------------------------------------------------------------ */
export const DEFAULT_SETTINGS: Settings = {
  companyName: 'Denisi Color',
  legalName: 'Denisi Color',
  tagline: T('Alati, rasveta i radna odeća', 'Vegla, ndriçim dhe veshje pune', 'Tools, lighting & workwear'),
  about: T(
    'Denisi Color je prodavnica iz Štimlja za alat, rasvetu, LED opremu, radnu odeću, grejanje i protivpožarnu opremu — uz boje, lakove i fasade. Porudžbine primamo porukom, telefonom i online, a dostavljamo širom Kosova.',
    'Denisi Color është dyqan në Shtime për vegla, ndriçim, pajisje LED, veshje pune, ngrohje dhe pajisje kundër zjarrit — si dhe ngjyra, llaqe e fasada. Porositë i pranojmë me mesazh, telefon dhe online, dhe dërgojmë në të gjithë Kosovën.',
    'Denisi Color is a shop in Shtime for tools, lighting, LED supplies, workwear, heating and fire-safety equipment — plus paints, varnishes and facade products. We take orders by message, phone and online, and deliver across Kosovo.',
  ),
  email: 'denisicolor21@gmail.com',
  phone: '+383 45 648 117',
  phone2: '',
  whatsapp: '+383 45 648 117',
  address: 'Rr. Komandant Kumanova',
  city: 'Shtime',
  mapUrl: 'https://maps.google.com/?q=Komandant+Kumanova,+Shtime,+Kosovo',
  hours: T('Pon–Sub 07–19h · Ned zatvoreno', 'Hën–Sht 07:00–19:00 · E diel mbyllur', 'Mon–Sat 7am–7pm · Sun closed'),
  pib: 'NUI 81XXXXXXX',
  pdv: 'TVSH 33XXXXXX',
  bankName: 'Banka (shembull)',
  bankAccount: '1110-XXXX-XXXX-XXXX',
  instagram: '',
  facebook: 'https://www.facebook.com/profile.php?id=100037567517631',
  currency: 'EUR',
  vatRate: 18,
  freeShippingThreshold: 50,
  shippingZones: [
    { id: 'z1', name: 'Shtime dhe rrethina', cities: ['Shtime', 'Lipjan', 'Ferizaj', 'Suharekë'], fee: 2, days: '1' },
    { id: 'z2', name: 'Prishtina dhe qendra', cities: ['Prishtinë', 'Fushë Kosovë', 'Obiliq', 'Drenas', 'Podujevë', 'Graçanicë'], fee: 3, days: '1–2' },
    {
      id: 'z3',
      name: 'Pjesa tjetër e Kosovës',
      cities: ['Prizren', 'Pejë', 'Gjakovë', 'Mitrovicë', 'Gjilan', 'Vushtrri', 'Rahovec', 'Malishevë', 'Skenderaj', 'Kamenicë', 'Viti', 'Deçan', 'Istog', 'Klinë', 'Kaçanik', 'Dragash'],
      fee: 4,
      days: '1–3',
    },
  ],
  pickupAddress: 'Rr. Komandant Kumanova, Shtime',
  payments: { cod: true, bank: true, card: true },
  languages: { me: false, sq: true, en: true },
  announcements: [
    T('Dostava širom Kosova — poručite online ili porukom', 'Dërgesë në të gjithë Kosovën — porositni online ose me mesazh', 'Delivery across Kosovo — order online or by message'),
    T('Nove softshell jakne — 26 €', 'Jakne të reja Softshell — 26 €', 'New softshell jackets — €26'),
    T('Pon–Sub 07–19h · +383 45 648 117', 'Hën–Sht 07:00–19:00 · +383 45 648 117', 'Mon–Sat 7am–7pm · +383 45 648 117'),
  ],
  brandColor: '#264a78',
  demoBanner: true,
  seo: {
    title: 'Denisi Color — Vegla, ndriçim dhe veshje pune në Shtime',
    description: 'Denisi Color, Shtime: vegla Bosch, ndriçim LED, LED shirita, veshje pune, kamina me dru dhe bombola zjarri. Porosi online dhe dërgesë në të gjithë Kosovën.',
  },
  adminEmail: 'admin@denisicolor.com',

  /* ---- CMS v2 ---- */
  timezone: 'Europe/Belgrade',
  orderPrefix: 'DC-',
  locations: [
    { id: 'loc-shtime', name: 'Dyqani Shtime', address: 'Rr. Komandant Kumanova', city: 'Shtime', pickup: true, isDefault: true },
  ],
  notifications: [
    { id: 'nt-order', event: 'order_placed', enabled: true, recipients: 'customer', subject: T('Primili smo vašu porudžbinu {number}', 'E morëm porosinë tuaj {number}', 'We received your order {number}') },
    { id: 'nt-confirm', event: 'order_confirmed', enabled: true, recipients: 'customer', subject: T('Porudžbina {number} je potvrđena', 'Porosia {number} u konfirmua', 'Order {number} is confirmed') },
    { id: 'nt-payment', event: 'payment_received', enabled: true, recipients: 'customer', subject: T('Uplata za porudžbinu {number} je evidentirana', 'Pagesa për porosinë {number} u regjistrua', 'Payment for order {number} received') },
    { id: 'nt-shipped', event: 'order_shipped', enabled: true, recipients: 'customer', subject: T('Porudžbina {number} je na putu', 'Porosia {number} është në rrugë', 'Order {number} is on its way') },
    { id: 'nt-return', event: 'return_requested', enabled: true, recipients: 'staff', subject: T('Novi zahtev za povraćaj {number}', 'Kërkesë e re për kthim {number}', 'New return request {number}') },
    { id: 'nt-refund', event: 'return_refunded', enabled: true, recipients: 'customer', subject: T('Povraćaj novca za {number}', 'Rimbursimi për {number}', 'Refund for {number}') },
    { id: 'nt-contact', event: 'contact_received', enabled: true, recipients: 'customer', subject: T('Hvala — javićemo vam se danas', 'Faleminderit — do t’ju kontaktojmë sot', 'Thank you — we’ll get back to you today') },
    { id: 'nt-booking', event: 'booking_confirmed', enabled: true, recipients: 'customer', subject: T('Termin {date} je potvrđen', 'Termini {date} u konfirmua', 'Your appointment on {date} is confirmed') },
    { id: 'nt-reminder', event: 'booking_reminder', enabled: false, recipients: 'customer', subject: T('Podsetnik: termin sutra u {time}', 'Kujtesë: termini nesër në {time}', 'Reminder: appointment tomorrow at {time}') },
    { id: 'nt-staff-order', event: 'staff_new_order', enabled: true, recipients: 'staff', subject: T('Nova porudžbina {number} — {total}', 'Porosi e re {number} — {total}', 'New order {number} — {total}') },
    { id: 'nt-staff-inquiry', event: 'staff_new_inquiry', enabled: true, recipients: 'staff', subject: T('Novi upit: {name}', 'Kërkesë e re: {name}', 'New enquiry: {name}') },
  ],
  integrations: [
    { id: 'int-payment', kind: 'payment', name: 'Pagesa me kartelë (payment gateway)', status: 'test', note: 'Mënyrë testimi — kartelat nuk ngarkohen. Çelësat e prodhimit pas marrëveshjes me bankën.' },
    { id: 'int-courier', kind: 'courier', name: 'Shërbimi postar / kurier', status: 'disconnected', note: 'Dërgesa në të gjithë Kosovën; API e kurierit sipas partnerit të zgjedhur.' },
    { id: 'int-email', kind: 'email', name: 'E-mail transaksional (SMTP)', status: 'connected', note: 'Konfirmimet e porosive dërgohen nga adresa e dyqanit.' },
    { id: 'int-fiscal', kind: 'fiscal', name: 'Fiskalizimi (ATK)', status: 'disconnected', note: 'Lidhja me sistemin e fiskalizimit të ATK-së — e planifikuar për fazën 2.' },
    { id: 'int-analytics', kind: 'analytics', name: 'Google Analytics 4', status: 'test', note: 'Matja e vizitave dhe konvertimeve në property testi.' },
  ],
  markets: [
    { id: 'mk-xk', name: T('Kosovo', 'Kosova', 'Kosovo'), countries: ['XK'], currency: 'EUR', languages: ['sq', 'en', 'me'], status: 'active' },
    { id: 'mk-al', name: T('Albanija', 'Shqipëria', 'Albania'), countries: ['AL'], currency: 'ALL', languages: ['sq', 'en'], status: 'draft' },
    { id: 'mk-mk', name: T('Severna Makedonija', 'Maqedonia e Veriut', 'North Macedonia'), countries: ['MK'], currency: 'MKD', languages: ['sq', 'en'], status: 'draft' },
  ],
  checkout: { guest: true, phoneRequired: true, companyField: 'optional', marketingOptIn: false },
  privacy: { cookieBanner: true },
};


/* ------------------------------------------------------------------ */
/* Homepage sections                                                   */
/* ------------------------------------------------------------------ */
// Only facts from the shop's public page (range, brands, hours, delivery across Kosovo, the three
// workwear prices). Sections that don't fit Denisi (portfolio, Instagram) stay in the list for the
// homepage builder but are switched off; `services`, `process`, `stats` and `faq` also feed /usluge and /o-nama.
export function buildHome(_now = new Date()): HomeSection[] {
  return [
    {
      id: 'hero',
      type: 'hero',
      enabled: true,
      data: {
        autoplay: true,
        slides: [
          {
            id: 's1',
            image: '/images/hero/navy.webp',
            eyebrow: T('Denisi Color · Štimlje', 'Denisi Color · Shtime', 'Denisi Color · Shtime'),
            title: T('Alat, rasveta i *radna odeća*.', 'Vegla, ndriçim dhe *veshje pune*.', 'Tools, lighting & *workwear*.'),
            subtitle: T(
              'U Štimlju i širom Kosova — poručite online, porukom na WhatsApp ili telefonom, a mi dostavljamo do vaših vrata.',
              'Në Shtime dhe në gjithë Kosovën — porositni online, me mesazh në WhatsApp ose në telefon, dhe ne jua dërgojmë deri te dera.',
              'In Shtime and across Kosovo — order online, by WhatsApp message or by phone, and we deliver to your door.',
            ),
            primary: { label: T('Pogledajte proizvode', 'Shikoni produktet', 'Browse products'), href: '/proizvodi' },
            secondary: { label: T('Pišite nam', 'Na shkruani', 'Message us'), href: '/kontakt' },
          },
          {
            id: 's2',
            image: '/images/hero/light.webp',
            eyebrow: T('Radna odeća', 'Veshje pune', 'Workwear'),
            title: T('Softshell jakne — *26 €*.', 'Jakne Softshell — *26 €*.', 'Softshell jackets — *€26*.'),
            subtitle: T(
              'Radni duksevi od 16 € u četiri boje i Kapriol duks za 35 € — veličine potvrđujemo pri porudžbini.',
              'Duksa pune nga 16 € në katër ngjyra dhe duksi Kapriol 35 € — madhësitë i konfirmojmë me porosinë.',
              'Work sweatshirts from €16 in four colours and the Kapriol top at €35 — sizes confirmed with your order.',
            ),
            primary: { label: T('Radna odeća', 'Shikoni veshjet', 'Shop workwear'), href: '/proizvodi/veshje-pune' },
            secondary: { label: T('Softshell jakna', 'Jakne Softshell', 'Softshell jacket'), href: '/proizvod/jakne-pune-softshell' },
          },
          {
            id: 's3',
            image: '/images/hero/navy.webp',
            eyebrow: T('Rasveta i LED', 'Ndriçim & LED', 'Lighting & LED'),
            title: T('Pravo svetlo za *svaki prostor*.', 'Drita e duhur për *çdo hapësirë*.', 'The right light for *every space*.'),
            subtitle: T(
              'Plafonjere sa senzorom, zidne svetiljke IP54, ulične svetiljke IP65 i LED trake sa aluminijumskim profilima.',
              'Plafonierë me sensor, ndriçues muri IP54, ndriçues rrugorë IP65 dhe LED shirita me profile alumini.',
              'Sensor ceiling lights, IP54 wall lights, IP65 street lights and LED strips with aluminium profiles.',
            ),
            primary: { label: T('Rasveta', 'Shikoni ndriçimin', 'Shop lighting'), href: '/proizvodi/ndricim' },
            secondary: { label: T('LED trake i profili', 'LED shirita & profile', 'LED strips & profiles'), href: '/proizvodi/led-shirita' },
          },
        ],
      },
    },
    {
      id: 'trust',
      type: 'trust',
      enabled: true,
      data: {
        items: [
          { icon: 'Truck', title: T('Dostava širom Kosova', 'Dërgesë në gjithë Kosovën', 'Delivery across Kosovo'), text: T('Ili preuzmite porudžbinu u Štimlju', 'Ose merreni porosinë në dyqan në Shtime', 'Or collect your order in Shtime') },
          { icon: 'Phone', title: T('Porudžbina porukom', 'Porosi me mesazh', 'Order by message'), text: T('WhatsApp, Facebook, telefon ili online', 'WhatsApp, Facebook, telefon ose online', 'WhatsApp, Facebook, phone or online') },
          { icon: 'Award', title: T('Poznati brendovi', 'Marka të njohura', 'Trusted brands'), text: T('Bosch, Kapriol, PARKSIDE, Novaled', 'Bosch, Kapriol, PARKSIDE, Novaled', 'Bosch, Kapriol, PARKSIDE, Novaled') },
          { icon: 'Clock', title: T('Pon–Sub 07–19h', 'Hën–Sht 07:00–19:00', 'Mon–Sat 7am–7pm'), text: T('Rr. Komandant Kumanova, Štimlje', 'Rr. Komandant Kumanova, Shtime', 'Rr. Komandant Kumanova, Shtime') },
        ],
      },
    },
    {
      id: 'categories',
      type: 'categories',
      enabled: true,
      data: {
        eyebrow: T('Asortiman', 'Asortimenti', 'Our range'),
        title: T('Šta vam je potrebno *danas*?', 'Çfarë ju duhet *sot*?', 'What do you need *today*?'),
        subtitle: T(
          'Sedam kategorija — od radne odeće i Bosch alata do LED rasvete, peći na drva i aparata za gašenje požara.',
          'Shtatë kategori — nga veshjet e punës dhe veglat Bosch te ndriçimi LED, kaminat me dru dhe bombolat e zjarrit.',
          'Seven categories — from workwear and Bosch tools to LED lighting, wood stoves and fire extinguishers.',
        ),
      },
    },
    {
      id: 'featured',
      type: 'featured',
      enabled: true,
      data: {
        eyebrow: T('Izdvajamo', 'Të veçuara', 'Featured'),
        title: T('Naš izbor za *ovu sezonu*', 'Zgjedhjet tona për *këtë sezon*', 'Our picks for *this season*'),
        mode: 'manual',
        productIds: [
          'p-jakne-softshell', 'p-duks-pune', 'p-duks-kapriol', 'p-ndricues-tavani-36w', 'p-ndricues-senzor-18w',
          'p-led-shirit', 'p-kamina-dru', 'p-bombol-abc', 'p-bosch-isio', 'p-karroce-parkside',
        ],
      },
    },
    {
      id: 'promo',
      type: 'promo',
      enabled: true,
      data: {
        eyebrow: T('Boje, lakovi i fasade', 'Ngjyra, llaqe & fasada', 'Paints, varnishes & facades'),
        title: T('Boje za *dom i fasadu*', 'Ngjyra për *shtëpinë dhe fasadën*', 'Paint for *home and facade*'),
        text: T(
          'Pored alata i rasvete, radimo i sa bojama, lakovima i materijalom za fasade. Obojte fasadu ili sobu online, izaberite nijanse i pošaljite nam ih — poslaćemo vam ponudu.',
          'Përveç veglave dhe ndriçimit, punojmë edhe me ngjyra, llaqe dhe materiale për fasada. Lyeni fasadën ose dhomën online, zgjidhni nuancat dhe na i dërgoni — ju kthejmë ofertë.',
          'Alongside tools and lighting we also supply paints, varnishes and facade materials. Paint a facade or a room online, pick your shades and send them to us — we’ll reply with a quote.',
        ),
        image: '/images/misc/ngjyra.webp',
        cta: { label: T('Probajte boju online', 'Provo ngjyrën online', 'Try colours online'), href: '/ngjyra' },
        // No campaign behind this block: no end date, no code.
        endsAt: '',
        code: '',
      },
    },
    {
      id: 'process',
      type: 'process',
      enabled: true,
      data: {
        eyebrow: T('Kako poručiti', 'Si të porositni', 'How to order'),
        title: T('Porudžbina u *četiri koraka*', 'Porosia në *katër hapa*', 'Ordering in *four steps*'),
        steps: [
          {
            title: T('Izaberite', 'Zgjidhni', 'Choose'),
            text: T(
              'Pregledajte katalog ili nam pošaljite fotografiju ili naziv proizvoda koji tražite.',
              'Shfletoni katalogun ose na dërgoni një foto apo emrin e produktit që kërkoni.',
              'Browse the catalogue, or send us a photo or the name of the product you need.',
            ),
          },
          {
            title: T('Poručite ili pišite', 'Porositni ose na shkruani', 'Order or message us'),
            text: T(
              'Dodajte u korpu ili nam pišite na WhatsApp, Facebook ili pozovite +383 45 648 117.',
              'Shtojeni në shportë, ose na shkruani në WhatsApp, Facebook apo na telefononi në +383 45 648 117.',
              'Add it to the cart, or message us on WhatsApp or Facebook, or call +383 45 648 117.',
            ),
          },
          {
            title: T('Potvrđujemo', 'Konfirmojmë', 'We confirm'),
            text: T(
              'Javljamo vam cenu, dostupnost i rok dostave — za proizvode „Zatražite cenu“ pre nego što bilo šta platite.',
              'Ju tregojmë çmimin, disponueshmërinë dhe afatin e dërgesës — për produktet „Kërko çmimin“ para se të paguani diçka.',
              'We confirm price, availability and delivery time — for “Request a price” items before you pay anything.',
            ),
          },
          {
            title: T('Dostava ili preuzimanje', 'Dërgesa ose marrja', 'Delivery or pickup'),
            text: T(
              'Dostavljamo širom Kosova ili porudžbinu preuzimate u radnji u Štimlju.',
              'Dërgojmë në të gjithë Kosovën, ose porosinë e merrni në dyqanin tonë në Shtime.',
              'We deliver across Kosovo, or you collect your order from our shop in Shtime.',
            ),
          },
        ],
      },
    },
    {
      id: 'services',
      type: 'services',
      enabled: false,
      data: {
        eyebrow: T('Kako pomažemo', 'Si ju ndihmojmë', 'How we help'),
        title: T('Više od police — *savet pre kupovine*', 'Më shumë se një raft — *këshillë para blerjes*', 'More than a shelf — *advice before you buy*'),
        subtitle: T(
          'Poručivanje porukom, ponude za firme i gradilišta i dostava širom Kosova.',
          'Porosi me mesazh, oferta për biznese dhe kantiere, dhe dërgesë në të gjithë Kosovën.',
          'Ordering by message, quotes for businesses and sites, and delivery across Kosovo.',
        ),
        items: [
          {
            image: '/images/misc/koleksioni.webp',
            title: T('Porudžbina porukom', 'Porosi me mesazh', 'Order by message'),
            text: T(
              'Pošaljite nam fotografiju ili spisak na WhatsApp ili Facebook — mi potvrđujemo cenu, dostupnost i dostavu.',
              'Na dërgoni foto ose listën në WhatsApp apo Facebook — ne ju konfirmojmë çmimin, disponueshmërinë dhe dërgesën.',
              'Send us a photo or a list on WhatsApp or Facebook — we confirm price, availability and delivery.',
            ),
          },
          {
            image: '/images/cat/ndricim.webp',
            title: T('Savet za rasvetu i LED', 'Këshillë për ndriçim & LED', 'Lighting & LED advice'),
            text: T(
              'Pomažemo da izaberete snagu, boju svetla i zaštitu IP — za stan, radionicu, dvorište ili ulicu.',
              'Ju ndihmojmë të zgjidhni fuqinë, ngjyrën e dritës dhe mbrojtjen IP — për shtëpi, punëtori, oborr ose rrugë.',
              'We help you pick the wattage, light colour and IP rating — for the home, workshop, yard or street.',
            ),
          },
          {
            image: '/images/cat/veshje-pune.webp',
            title: T('Radna odeća za ekipe', 'Veshje pune për ekipe', 'Workwear for crews'),
            text: T(
              'Jakne i duksevi za celu ekipu — veličine i količine potvrđujemo pri porudžbini.',
              'Jakne dhe duksa për gjithë ekipën — madhësitë dhe sasitë i konfirmojmë me porosinë.',
              'Jackets and sweatshirts for the whole crew — sizes and quantities confirmed with your order.',
            ),
          },
          {
            image: '/images/cat/vegla.webp',
            title: T('Ponude za firme i gradilišta', 'Oferta për biznese & kantiere', 'Quotes for businesses & sites'),
            text: T(
              'Za veće količine rasvete, alata ili protivpožarne opreme pripremamo posebnu ponudu.',
              'Për sasi më të mëdha ndriçimi, veglash ose pajisjesh kundër zjarrit përgatisim ofertë të veçantë.',
              'For larger quantities of lighting, tools or fire-safety equipment we prepare a dedicated quote.',
            ),
          },
          {
            image: '/images/misc/ngjyra.webp',
            title: T('Boje, lakovi i fasade', 'Ngjyra, llaqe & fasada', 'Paints, varnishes & facades'),
            text: T(
              'Recite nam površinu, podlogu i nijansu — šaljemo ponudu za boje i materijal za fasadu.',
              'Na tregoni sipërfaqen, bazën dhe nuancën — ju dërgojmë ofertë për ngjyra dhe materiale fasade.',
              'Tell us the area, the surface and the shade — we send a quote for paints and facade materials.',
            ),
          },
          {
            image: '/images/p/karroce-parkside-1.webp',
            title: T('Dostava širom Kosova', 'Dërgesë në gjithë Kosovën', 'Delivery across Kosovo'),
            text: T(
              'Šaljemo u svaku opštinu ili porudžbinu preuzimate u radnji u Štimlju, Pon–Sub 07–19h.',
              'Dërgojmë në çdo komunë, ose porosinë e merrni në dyqan në Shtime, Hën–Sht 07:00–19:00.',
              'We ship to every municipality, or you collect from our Shtime shop, Mon–Sat 7am–7pm.',
            ),
          },
        ],
      },
    },
    {
      id: 'projects',
      type: 'projects',
      enabled: false,
      data: {
        eyebrow: T('Inspiracija', 'Inspirime', 'Inspiration'),
        title: T('Ideje sa *našim proizvodima*', 'Ide me *produktet tona*', 'Ideas with *our products*'),
        subtitle: T(
          'Ilustrativni primeri sa fotografijama proizvoda — ne izvedeni projekti.',
          'Shembuj ilustrues me foto produktesh — jo projekte të realizuara.',
          'Illustrative examples using product photos — not completed projects.',
        ),
      },
    },
    {
      id: 'stats',
      type: 'stats',
      enabled: true,
      data: {
        image: '/images/misc/koleksioni.webp',
        quote: T(
          'Pišite nam šta vam treba — mi vam odgovaramo sa cenom i rokom dostave.',
          'Na shkruani çfarë ju duhet — ne ju kthejmë përgjigje me çmimin dhe afatin e dërgesës.',
          'Tell us what you need — we’ll reply with the price and the delivery time.',
        ),
        items: [
          { value: '7', label: T('kategorija proizvoda', 'kategori produktesh', 'product categories') },
          { value: '4', label: T('poznata brenda: Bosch, Kapriol, PARKSIDE, Novaled', 'marka të njohura: Bosch, Kapriol, PARKSIDE, Novaled', 'known brands: Bosch, Kapriol, PARKSIDE, Novaled') },
          { value: '6', label: T('dana u nedelji otvoreno, 07–19h', 'ditë në javë të hapur, 07:00–19:00', 'days a week open, 7am–7pm') },
          { value: '3', label: T('načina poručivanja: online, porukom, telefonom', 'mënyra porosie: online, mesazh, telefon', 'ways to order: online, message, phone') },
        ],
      },
    },
    {
      id: 'blog',
      type: 'blog',
      enabled: true,
      data: {
        eyebrow: T('Saveti', 'Këshilla', 'Advice'),
        title: T('Saveti iz *radnje*', 'Këshilla nga *dyqani*', 'Advice from *the shop*'),
      },
    },
    {
      id: 'faq',
      type: 'faq',
      enabled: true,
      data: {
        eyebrow: T('Pitanja', 'Pyetje', 'FAQ'),
        title: T('Česta pitanja', 'Pyetje të shpeshta', 'Frequently asked questions'),
        items: [
          {
            q: T('Kako da poručim porukom?', 'Si të porosis me mesazh?', 'How do I order by message?'),
            a: T(
              'Pošaljite nam na WhatsApp ili Facebook naziv ili fotografiju proizvoda, količinu i grad za dostavu. Potvrđujemo cenu i rok, a porudžbina je potvrđena tek kada se dogovorimo.',
              'Na dërgoni në WhatsApp ose Facebook emrin ose foton e produktit, sasinë dhe qytetin për dërgesë. Ne ju konfirmojmë çmimin dhe afatin, dhe porosia konfirmohet vetëm pasi të merremi vesh.',
              'Send us the product name or a photo, the quantity and your town on WhatsApp or Facebook. We confirm the price and timing, and the order is only confirmed once we agree.',
            ),
          },
          {
            q: T('Šta znači „Zatražite cenu“?', 'Çfarë do të thotë „Kërko çmimin“?', 'What does “Request a price” mean?'),
            a: T(
              'Za neke proizvode (rasveta, Bosch alat, peći, aparati za gašenje) cena zavisi od modela i količine. Pošaljite upit i javićemo vam tačnu cenu — bez obaveze kupovine.',
              'Për disa produkte (ndriçim, vegla Bosch, kamina, bombola zjarri) çmimi varet nga modeli dhe sasia. Dërgoni kërkesë dhe ju tregojmë çmimin e saktë — pa detyrim blerjeje.',
              'For some products (lighting, Bosch tools, stoves, extinguishers) the price depends on the model and quantity. Send an enquiry and we’ll tell you the exact price — no obligation.',
            ),
          },
          {
            q: T('Da li dostavljate širom Kosova?', 'A dërgoni në gjithë Kosovën?', 'Do you deliver across Kosovo?'),
            a: T(
              'Da. Cena i rok dostave zavise od grada i prikazuju se u korpi; tačne iznose potvrđujemo pri porudžbini. Porudžbinu možete i preuzeti u radnji u Štimlju.',
              'Po. Çmimi dhe afati i dërgesës varen nga qyteti dhe shfaqen në shportë; shumat e sakta i konfirmojmë me porosinë. Porosinë mund ta merrni edhe në dyqan në Shtime.',
              'Yes. Delivery cost and time depend on your town and are shown in the cart; we confirm the exact amounts with your order. You can also collect from our shop in Shtime.',
            ),
          },
          {
            q: T('Koje je radno vreme?', 'Cili është orari i punës?', 'What are your opening hours?'),
            a: T(
              'Od ponedeljka do subote od 07:00 do 19:00, nedeljom zatvoreno. Poruke primamo i van radnog vremena i odgovaramo prvog radnog dana.',
              'Nga e hëna deri të shtunën 07:00–19:00, të dielën mbyllur. Mesazhet i pranojmë edhe jashtë orarit dhe përgjigjemi ditën e parë të punës.',
              'Monday to Saturday 7am–7pm, closed on Sunday. You can message us any time — we reply on the next working day.',
            ),
          },
          {
            q: T('Da li imate ponude za firme i gradilišta?', 'A keni oferta për biznese dhe kantiere?', 'Do you offer quotes for businesses and sites?'),
            a: T(
              'Da — za veće količine radne odeće, rasvete ili aparata za gašenje požara pripremamo posebnu ponudu. Pošaljite nam spisak preko kontakt forme ili na WhatsApp.',
              'Po — për sasi më të mëdha veshjesh pune, ndriçimi ose bombolash zjarri përgatisim ofertë të veçantë. Na dërgoni listën përmes formularit të kontaktit ose në WhatsApp.',
              'Yes — for larger quantities of workwear, lighting or extinguishers we prepare a dedicated quote. Send us your list via the contact form or WhatsApp.',
            ),
          },
          {
            q: T('Kako da izaberem veličinu radne odeće?', 'Si ta zgjedh madhësinë e veshjeve të punës?', 'How do I choose a workwear size?'),
            a: T(
              'Veličine su po upitu. Napišite nam veličinu koju obično nosite (ili visinu i težinu), a mi potvrđujemo dostupnost pre slanja.',
              'Madhësitë janë sipas kërkesës. Na shkruani madhësinë që mbani zakonisht (ose gjatësinë dhe peshën), dhe ne ua konfirmojmë disponueshmërinë para dërgesës.',
              'Sizes are on request. Tell us the size you usually wear (or your height and weight) and we confirm availability before shipping.',
            ),
          },
        ],
      },
    },
    {
      id: 'instagram',
      type: 'instagram',
      enabled: false,
      data: {
        title: T('Novo u radnji', 'Të reja në dyqan', 'New in the shop'),
        images: [
          '/images/p/jakne-softshell-1.webp',
          '/images/p/ndricues-tavani-36w-1.webp',
          '/images/p/led-shirit-1.webp',
          '/images/p/duks-kapriol-1.webp',
          '/images/p/bombol-abc-1.webp',
          '/images/p/prerese-bosch-isio-1.webp',
        ],
      },
    },
    {
      id: 'cta',
      type: 'cta',
      enabled: true,
      data: {
        eyebrow: T('Zatražite ponudu', 'Kërkoni ofertë', 'Request a quote'),
        title: T('Recite nam *šta vam treba*', 'Na tregoni *çfarë ju duhet*', 'Tell us *what you need*'),
        text: T(
          'Spisak materijala, količine ili fotografija — odgovaramo sa cenom i rokom dostave. Za firme i gradilišta pripremamo posebnu ponudu.',
          'Lista e materialeve, sasitë ose një foto — ju kthejmë përgjigje me çmimin dhe afatin e dërgesës. Për biznese dhe kantiere përgatisim ofertë të veçantë.',
          'A materials list, quantities or a photo — we reply with the price and delivery time. For businesses and building sites we prepare a dedicated quote.',
        ),
        image: '/images/hero/navy.webp',
      },
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Projects / "Inspirime"                                              */
/* ------------------------------------------------------------------ */
// Denisi has no published project portfolio. The admin module and /projekti stay, filled with a few
// clearly labelled examples built from the shop's own product photos — never presented as completed jobs.
const TAG = {
  lighting: T('Rasveta', 'Ndriçim', 'Lighting'),
  led: T('LED trake', 'LED shirita', 'LED strips'),
  workwear: T('Radna odeća', 'Veshje pune', 'Workwear'),
  fire: T('Protivpožarna oprema', 'Kundër zjarrit', 'Fire safety'),
  outdoor: T('Spoljašnji prostor', 'Ambient i jashtëm', 'Outdoor'),
};
const EXAMPLE = 'Shembull (demo)';

export const PROJECTS: Project[] = [
  {
    id: 'pr-1',
    title: T('Primer: rasveta dvorišta i parkinga', 'Shembull: ndriçim oborri dhe parkingu', 'Example: yard & car-park lighting'),
    location: EXAMPLE,
    year: 2026,
    tags: [TAG.lighting, TAG.outdoor],
    summary: T(
      'Ilustrativni primer sa fotografijom proizvoda: LED ulične svetiljke 50W IP65 za dvorište firme ili parking. Nije izveden projekat.',
      'Shembull ilustrues me foto produkti: ndriçues LED rrugorë 50W IP65 për oborrin e një biznesi ose parking. Nuk është projekt i realizuar.',
      'Illustrative example using a product photo: 50W IP65 LED street lights for a business yard or car park. Not a completed project.',
    ),
    image: '/images/p/ndricues-rrugor-50w-1.webp',
    featured: true,
  },
  {
    id: 'pr-2',
    title: T('Primer: linija svetla u gips-kartonu', 'Shembull: linjë drite në rigips', 'Example: light line in plasterboard'),
    location: EXAMPLE,
    year: 2026,
    tags: [TAG.led],
    summary: T(
      'Ilustrativni primer: LED traka u aluminijumskom profilu za indirektno svetlo u hodniku ili dnevnoj sobi. Nije izveden projekat.',
      'Shembull ilustrues: LED shirit në profil alumini për dritë indirekte në korridor ose dhomë ndenjjeje. Nuk është projekt i realizuar.',
      'Illustrative example: an LED strip in an aluminium profile for indirect light in a hallway or living room. Not a completed project.',
    ),
    image: '/images/p/profil-alumini-led-1.webp',
    featured: true,
  },
  {
    id: 'pr-3',
    title: T('Primer: oprema za građevinsku ekipu', 'Shembull: pajisje për ekipën e kantierit', 'Example: kit for a building crew'),
    location: EXAMPLE,
    year: 2026,
    tags: [TAG.workwear],
    summary: T(
      'Ilustrativni primer: softshell jakne i radni duksevi za ekipu od nekoliko ljudi, veličine po upitu. Nije izveden projekat.',
      'Shembull ilustrues: jakne softshell dhe duksa pune për një ekip disa vetësh, madhësitë sipas kërkesës. Nuk është projekt i realizuar.',
      'Illustrative example: softshell jackets and work sweatshirts for a small crew, sizes on request. Not a completed project.',
    ),
    image: '/images/p/jakne-softshell-2.webp',
    featured: false,
  },
  {
    id: 'pr-4',
    title: T('Primer: aparati za gašenje za kancelariju', 'Shembull: bombola zjarri për zyrë', 'Example: extinguishers for an office'),
    location: EXAMPLE,
    year: 2026,
    tags: [TAG.fire],
    summary: T(
      'Ilustrativni primer: aparati ABC prah za kancelariju i radionicu. Broj i veličinu određuju lokalni propisi. Nije izveden projekat.',
      'Shembull ilustrues: bombola me pluhur ABC për zyrë dhe punëtori. Numrin dhe madhësinë i përcaktojnë rregullat lokale. Nuk është projekt i realizuar.',
      'Illustrative example: ABC powder extinguishers for an office and workshop. Local rules set the number and size. Not a completed project.',
    ),
    image: '/images/p/bombol-abc-1.webp',
    featured: false,
  },
];

/* ------------------------------------------------------------------ */
/* CMS pages                                                           */
/* ------------------------------------------------------------------ */
// Fees, lead times, return and warranty terms are not published by the shop: every such figure is
// marked as an example to be confirmed. Ids are stable (menus, Settings → Privacy link to them);
// `uslovi-kupovine` keeps its slug because checkout links to it.
export function buildPages(now = new Date()): CmsPage[] {
  const at = now.toISOString();
  const wa = 'https://wa.me/38345648117';
  return [
    {
      id: 'pg-dostava',
      slug: 'dergesa',
      title: T('Dostava', 'Dërgesa', 'Delivery'),
      body: T(
        `Dostavljamo širom Kosova. Poručite online, porukom na WhatsApp ili Facebook ili telefonom — a porudžbinu možete preuzeti i u našoj radnji u Štimlju.

> Cene i rokovi ispod su primeri za ovaj demo i potvrđuje ih Denisi Color.

## Zone i cene dostave (primer)
- **Štimlje i okolina** (Lipljan, Uroševac, Suva Reka): 2 € · obično 1 radni dan
- **Priština i centralni deo** (Kosovo Polje, Obilić, Glogovac, Podujevo, Gračanica): 3 € · 1–2 radna dana
- **Ostatak Kosova**: 4 € · 1–3 radna dana
- Porudžbine preko 50 €: besplatna dostava (primer, potvrđuje se)

## Preuzimanje u radnji
Rr. Komandant Kumanova, Štimlje · Pon–Sub 07:00–19:00, nedeljom zatvoreno. Javljamo vam kada je porudžbina spremna.

## Proizvodi „Zatražite cenu“
Za proizvode bez objavljene cene (rasveta, Bosch alat, peći, aparati za gašenje) šaljemo vam cenu i rok dostave pre nego što potvrdite porudžbinu.

## Veće porudžbine i gradilišta
Za firme i veće količine dostavu i rok dogovaramo posebno. [Zatražite ponudu](/kontakt) ili nam pišite na [WhatsApp](${wa}).`,
        `Dërgojmë në të gjithë Kosovën. Porositni online, me mesazh në WhatsApp ose Facebook, ose në telefon — porosinë mund ta merrni edhe në dyqanin tonë në Shtime.

> Tarifat dhe afatet më poshtë janë shembuj për këtë demo dhe do t'i konfirmojë Denisi Color.

## Zonat dhe tarifat (shembull)
- **Shtime dhe rrethina** (Lipjan, Ferizaj, Suharekë): 2 € · zakonisht 1 ditë pune
- **Prishtina dhe qendra** (Fushë Kosovë, Obiliq, Drenas, Podujevë, Graçanicë): 3 € · 1–2 ditë pune
- **Pjesa tjetër e Kosovës**: 4 € · 1–3 ditë pune
- Porositë mbi 50 €: dërgesë falas (shembull, për t'u konfirmuar)

## Marrja në dyqan
Rr. Komandant Kumanova, Shtime · Hën–Sht 07:00–19:00, e diel mbyllur. Ju njoftojmë kur porosia të jetë gati.

## Produktet „Kërko çmimin“
Për produktet pa çmim të publikuar (ndriçim, vegla Bosch, kamina, bombola zjarri) ju dërgojmë çmimin dhe afatin e dërgesës para se ta konfirmoni porosinë.

## Porosi të mëdha dhe kantiere
Për biznese dhe sasi më të mëdha, dërgesën dhe afatin i caktojmë me marrëveshje. [Kërkoni ofertë](/kontakt) ose na shkruani në [WhatsApp](${wa}).`,
        `We deliver across Kosovo. Order online, by message on WhatsApp or Facebook, or by phone — or collect your order from our shop in Shtime.

> The fees and lead times below are examples for this demo and will be confirmed by Denisi Color.

## Zones and fees (example)
- **Shtime and surroundings** (Lipjan, Ferizaj, Suharekë): €2 · usually 1 working day
- **Prishtina and central Kosovo** (Fushë Kosovë, Obiliq, Drenas, Podujevë, Graçanicë): €3 · 1–2 working days
- **Rest of Kosovo**: €4 · 1–3 working days
- Orders over €50: free delivery (example, to be confirmed)

## Collect in store
Rr. Komandant Kumanova, Shtime · Mon–Sat 7am–7pm, closed Sunday. We let you know when your order is ready.

## “Request a price” products
For products without a published price (lighting, Bosch tools, stoves, extinguishers) we send you the price and delivery time before you confirm the order.

## Large orders and building sites
For businesses and larger quantities, delivery and timing are agreed individually. [Request a quote](/kontakt) or message us on [WhatsApp](${wa}).`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
    {
      id: 'pg-placanje',
      slug: 'pagesa',
      title: T('Plaćanje', 'Pagesa', 'Payment'),
      body: T(
        `Cene su u evrima i uključuju PDV 18% (potvrđuje radnja). Za proizvode „Zatražite cenu“ plaćate tek kada vam potvrdimo cenu.

## Načini plaćanja
- **Pouzećem** — gotovinom kuriru pri preuzimanju porudžbine
- **Uplatom na račun** — posle potvrde šaljemo vam podatke za uplatu ili predračun; podaci o banci su za sada primer
- **Karticom online** — u ovom demou plaćanje karticom je simulirano i nijedna kartica se ne tereti
- **U radnji** — pri preuzimanju u Štimlju (dostupni načini plaćanja se potvrđuju)

## Firme
Za firme izdajemo račun na naziv firme — upišite naziv firme i NUI pri porudžbini ili nam ih pošaljite porukom.

> Sve navedeno je predlog za demo; konačne uslove plaćanja potvrđuje Denisi Color.`,
        `Çmimet janë në euro dhe përfshijnë TVSH 18% (për t'u konfirmuar nga dyqani). Për produktet „Kërko çmimin“ paguani vetëm pasi t'jua konfirmojmë çmimin.

## Mënyrat e pagesës
- **Para në dorë në dorëzim** — i paguani korrierit kur e merrni porosinë
- **Transfertë bankare** — pas konfirmimit ju dërgojmë të dhënat për pagesë ose parafaturën; të dhënat bankare janë për momentin shembull
- **Kartelë online** — në këtë demo pagesa me kartelë është e simuluar dhe asnjë kartelë nuk ngarkohet
- **Në dyqan** — kur e merrni porosinë në Shtime (mënyrat e pagesës në dyqan konfirmohen)

## Biznese
Për biznese lëshojmë faturë në emër të biznesit — shkruani emrin e biznesit dhe NUI-n gjatë porosisë ose na i dërgoni me mesazh.

> Gjithçka këtu është propozim për demo; kushtet përfundimtare të pagesës i konfirmon Denisi Color.`,
        `Prices are in euros and include 18% VAT (to be confirmed by the shop). For “Request a price” items you only pay once we have confirmed the price.

## Payment methods
- **Cash on delivery** — pay the courier when you receive your order
- **Bank transfer** — after confirmation we send you payment details or a pro-forma invoice; the bank details are an example for now
- **Card online** — in this demo card payment is simulated and no card is charged
- **In store** — when you collect in Shtime (in-store payment methods to be confirmed)

## Businesses
We invoice businesses in the company's name — enter the company name and NUI (business number) at checkout or send them to us by message.

> Everything here is a proposal for the demo; final payment terms will be confirmed by Denisi Color.`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
    {
      id: 'pg-reklamacije',
      slug: 'kthimi-garancia',
      title: T('Povraćaj i garancija', 'Kthimi & garancia', 'Returns & warranty'),
      body: T(
        `Ako nešto nije u redu sa porudžbinom, javite nam se — rešavamo zajedno.

> Ovo je primer politike za demo. Konačne uslove povraćaja i garancije potvrđuje Denisi Color.

## Kako prijaviti problem
1. Pošaljite nam poruku ili e-mail sa brojem porudžbine (npr. DC-1042) i fotografijom
2. Javljamo vam se sa rešenjem — zamena, popravka ili povraćaj
3. Po potrebi proizvod donosite u radnju u Štimlju ili ga preuzimamo

## Povraćaj (primer)
- Nekorišćeni proizvodi u originalnom pakovanju — rok za povraćaj se potvrđuje
- Radna odeća: zamena veličine po dogovoru, ako odeća nije nošena
- Isečene LED trake i korišćeni aparati za gašenje ne mogu se vratiti (primer)

## Garancija
Za brendirane proizvode (npr. Bosch) važi garancija proizvođača prema njegovim uslovima; trajanje zavisi od proizvoda. Sačuvajte račun.`,
        `Nëse diçka nuk është në rregull me porosinë, na kontaktoni — e zgjidhim bashkë.

> Kjo është politikë shembull për demo. Kushtet përfundimtare të kthimit dhe garancisë i konfirmon Denisi Color.

## Si ta paraqisni problemin
1. Na dërgoni mesazh ose e-mail me numrin e porosisë (p.sh. DC-1042) dhe një foto
2. Ju kthejmë përgjigje me zgjidhjen — ndërrim, riparim ose kthim
3. Sipas nevojës, produktin e sillni në dyqan në Shtime ose e marrim ne

## Kthimi (shembull)
- Produktet e papërdorura në paketimin origjinal — afati i kthimit për t'u konfirmuar
- Veshjet e punës: ndërrim madhësie me marrëveshje, nëse nuk janë veshur
- LED shiritat e prerë dhe bombolat e përdorura nuk kthehen (shembull)

## Garancia
Për produktet e markave (p.sh. Bosch) vlen garancia e prodhuesit sipas kushteve të tij; kohëzgjatja varet nga produkti. Ruajeni faturën.`,
        `If something isn't right with your order, get in touch — we'll sort it out together.

> This is an example policy for the demo. Final return and warranty terms will be confirmed by Denisi Color.

## How to report a problem
1. Send us a message or e-mail with your order number (e.g. DC-1042) and a photo
2. We reply with a solution — exchange, repair or refund
3. If needed, bring the product to our Shtime shop or we collect it

## Returns (example)
- Unused products in original packaging — return period to be confirmed
- Workwear: size exchanges by arrangement, if the garment hasn't been worn
- Cut LED strips and used extinguishers cannot be returned (example)

## Warranty
Branded products (e.g. Bosch) carry the manufacturer's warranty under its own terms; the length depends on the product. Keep your receipt.`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
    {
      id: 'pg-pitanja',
      slug: 'pyetje-te-shpeshta',
      title: T('Česta pitanja', 'Pyetje të shpeshta', 'FAQ'),
      body: T(
        `Najčešća pitanja kupaca. Niste pronašli odgovor? Pozovite +383 45 648 117 ili nam pišite na [WhatsApp](${wa}).

## Kako da poručim porukom?
Pošaljite na WhatsApp ili Facebook naziv ili fotografiju proizvoda, količinu i grad. Potvrđujemo cenu i rok dostave — porudžbina važi kada se dogovorimo.

## Mogu li da poručim online?
Da. Proizvode sa cenom dodajete u korpu i završavate porudžbinu; za proizvode „Zatražite cenu“ šaljete upit.

## Šta znači „Zatražite cenu“?
Cena zavisi od modela, veličine ili količine. Pošaljite upit i javljamo vam tačnu cenu — bez obaveze kupovine.

## Koliko košta dostava i koliko traje?
Zavisi od grada — pogledajte stranicu [Dostava](/stranica/dergesa). Iznosi u ovom demou su primeri.

## Koje je radno vreme?
Pon–Sub 07:00–19:00, nedeljom zatvoreno. Rr. Komandant Kumanova, Štimlje.

## Da li imate ponude za firme?
Da — za gradilišta, električare i firme pripremamo ponudu za veće količine rasvete, radne odeće i protivpožarne opreme. [Pošaljite spisak](/kontakt).

## Kako da izaberem veličinu radne odeće?
Veličine su po upitu: napišite veličinu koju obično nosite (ili visinu i težinu) i potvrđujemo dostupnost pre slanja.

## Da li prodajete boje i fasade?
Da, radimo sa bojama, lakovima i materijalom za fasade po upitu — pogledajte [Boje i fasade](/faqe/ngjyra-fasada).

## Kako mogu da platim?
Pouzećem, uplatom na račun ili karticom online — detalji na stranici [Plaćanje](/stranica/pagesa).`,
        `Pyetjet më të shpeshta të klientëve. Nuk e gjetët përgjigjen? Na telefononi në +383 45 648 117 ose na shkruani në [WhatsApp](${wa}).

## Si të porosis me mesazh?
Na dërgoni në WhatsApp ose Facebook emrin ose foton e produktit, sasinë dhe qytetin. Ju konfirmojmë çmimin dhe afatin e dërgesës — porosia vlen pasi të merremi vesh.

## A mund të porosis online?
Po. Produktet me çmim i shtoni në shportë dhe e përfundoni porosinë; për produktet „Kërko çmimin“ dërgoni kërkesë.

## Çfarë do të thotë „Kërko çmimin“?
Çmimi varet nga modeli, madhësia ose sasia. Dërgoni kërkesë dhe ju tregojmë çmimin e saktë — pa detyrim blerjeje.

## Sa kushton dërgesa dhe sa zgjat?
Varet nga qyteti — shihni faqen [Dërgesa](/stranica/dergesa). Shumat në këtë demo janë shembuj.

## Cili është orari?
Hën–Sht 07:00–19:00, e diel mbyllur. Rr. Komandant Kumanova, Shtime.

## A keni oferta për biznese?
Po — për kantiere, elektricistë dhe biznese përgatisim ofertë për sasi më të mëdha ndriçimi, veshjesh pune dhe pajisjesh kundër zjarrit. [Na dërgoni listën](/kontakt).

## Si ta zgjedh madhësinë e veshjeve të punës?
Madhësitë janë sipas kërkesës: na shkruani madhësinë që mbani zakonisht (ose gjatësinë dhe peshën) dhe ua konfirmojmë disponueshmërinë para dërgesës.

## A shitni ngjyra dhe fasada?
Po, punojmë me ngjyra, llaqe dhe materiale për fasada sipas kërkesës — shihni [Ngjyra & fasada](/faqe/ngjyra-fasada).

## Si mund të paguaj?
Me para në dorë në dorëzim, me transfertë bankare ose me kartelë online — detajet te faqja [Pagesa](/stranica/pagesa).`,
        `Our customers' most common questions. Didn't find your answer? Call +383 45 648 117 or message us on [WhatsApp](${wa}).

## How do I order by message?
Send the product name or a photo, the quantity and your town on WhatsApp or Facebook. We confirm the price and delivery time — the order stands once we agree.

## Can I order online?
Yes. Add priced products to the cart and check out; for “Request a price” products, send an enquiry.

## What does “Request a price” mean?
The price depends on the model, size or quantity. Send an enquiry and we'll tell you the exact price — no obligation.

## How much is delivery and how long does it take?
It depends on your town — see the [Delivery](/stranica/dergesa) page. The amounts in this demo are examples.

## What are your opening hours?
Mon–Sat 7am–7pm, closed Sunday. Rr. Komandant Kumanova, Shtime.

## Do you offer business quotes?
Yes — for building sites, electricians and companies we quote larger quantities of lighting, workwear and fire-safety equipment. [Send us your list](/kontakt).

## How do I choose a workwear size?
Sizes are on request: tell us the size you usually wear (or your height and weight) and we confirm availability before shipping.

## Do you sell paints and facade products?
Yes, we supply paints, varnishes and facade materials on request — see [Paints & facades](/faqe/ngjyra-fasada).

## How can I pay?
Cash on delivery, bank transfer or card online — details on the [Payment](/stranica/pagesa) page.`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
    {
      id: 'pg-ngjyra',
      slug: 'ngjyra-fasada',
      title: T('Boje, lakovi i fasade', 'Ngjyra, llaqe & fasada', 'Paints, varnishes & facades'),
      body: T(
        `Kao što i ime kaže, Denisi Color ne prodaje samo alat i rasvetu — radimo i sa bojama za zidove, lakovima i materijalom za fasade.

> Asortiman i cene boja još nisu u online prodavnici. Recite nam šta vam treba i pripremićemo ponudu.

## Šta možete da nas pitate
- Boje za unutrašnje i spoljašnje zidove
- Lakove i zaštitu za drvo i metal
- Materijal za fasade
- Savet koliko materijala vam treba za vašu površinu

## Šta da nam pošaljete za ponudu
- Približnu površinu u m² i vrstu podloge (malter, gips-karton, drvo, metal)
- Da li je unutra ili spolja
- Nijansu ili fotografiju boje koja vam se dopada
- Grad za dostavu i kada vam je potrebno

## Kako do ponude
- Pišite nam na [WhatsApp](${wa}) ili pozovite +383 45 648 117
- Popunite [kontakt formu](/kontakt)
- Ili svratite u radnju: Rr. Komandant Kumanova, Štimlje · Pon–Sub 07:00–19:00`,
        `Siç e tregon edhe emri, Denisi Color nuk shet vetëm vegla dhe ndriçim — punojmë edhe me ngjyra për mure, llaqe dhe materiale për fasada.

> Gama dhe çmimet e ngjyrave nuk janë ende në dyqanin online. Na tregoni çfarë ju duhet dhe ju përgatisim ofertë.

## Çfarë mund të na kërkoni
- Ngjyra për mure të brendshme dhe të jashtme
- Llaqe dhe mbrojtës për dru dhe metal
- Materiale për fasada
- Këshillë sa material ju duhet për sipërfaqen tuaj

## Çfarë të na dërgoni për ofertë
- Sipërfaqen e përafërt në m² dhe llojin e bazës (suva, rigips, dru, metal)
- Brenda apo jashtë
- Nuancën ose një foto të ngjyrës që ju pëlqen
- Qytetin për dërgesë dhe kur ju duhet

## Si ta merrni ofertën
- Na shkruani në [WhatsApp](${wa}) ose na telefononi në +383 45 648 117
- Plotësoni [formularin e kontaktit](/kontakt)
- Ose ejani në dyqan: Rr. Komandant Kumanova, Shtime · Hën–Sht 07:00–19:00`,
        `As the name suggests, Denisi Color doesn't only sell tools and lighting — we also supply wall paints, varnishes and facade materials.

> The paint range and prices aren't in the online shop yet. Tell us what you need and we'll prepare a quote.

## What you can ask us for
- Paints for interior and exterior walls
- Varnishes and protection for wood and metal
- Facade materials
- Advice on how much material your surface needs

## What to send us for a quote
- The approximate area in m² and the surface type (render, plasterboard, wood, metal)
- Inside or outside
- The shade, or a photo of a colour you like
- Your town for delivery and when you need it

## How to get a quote
- Message us on [WhatsApp](${wa}) or call +383 45 648 117
- Fill in the [contact form](/kontakt)
- Or visit the shop: Rr. Komandant Kumanova, Shtime · Mon–Sat 7am–7pm`,
      ),
      published: true,
      showInFooter: false,
      updatedAt: at,
    },
    {
      id: 'pg-uslovi',
      slug: 'uslovi-kupovine',
      title: T('Uslovi kupovine', 'Kushtet e blerjes', 'Terms of purchase'),
      body: T(
        `Ovi uslovi važe za kupovinu u online prodavnici Denisi Color, Rr. Komandant Kumanova, Štimlje, Kosovo.

> Tekst je primer za demo i biće usklađen sa radnjom pre objavljivanja.

## Porudžbina
Porudžbina je potvrđena kada od nas dobijete potvrdu e-mailom, porukom ili telefonom. Za proizvode „Zatražite cenu“ prvo vam šaljemo cenu, a porudžbina važi tek kada je prihvatite.

## Cene
Cene su u evrima i uključuju PDV 18% (potvrđuje radnja). Za potvrđene porudžbine važi cena iz potvrde.

## Plaćanje i dostava
Načini plaćanja opisani su na stranici [Plaćanje](/stranica/pagesa), a zone i rokovi na stranici [Dostava](/stranica/dergesa).

## Povraćaj i garancija
Pogledajte [Povraćaj i garancija](/stranica/kthimi-garancia).

## Kontakt
denisicolor21@gmail.com · +383 45 648 117`,
        `Këto kushte vlejnë për blerjet në dyqanin online të Denisi Color, Rr. Komandant Kumanova, Shtime, Kosovë.

> Teksti është shembull për demo dhe do të përshtatet me dyqanin para publikimit.

## Porosia
Porosia konfirmohet kur merrni konfirmimin tonë me e-mail, mesazh ose telefon. Për produktet „Kërko çmimin“ fillimisht ju dërgojmë çmimin, dhe porosia vlen vetëm pasi ta pranoni.

## Çmimet
Çmimet janë në euro dhe përfshijnë TVSH 18% (për t'u konfirmuar nga dyqani). Për porositë e konfirmuara vlen çmimi nga konfirmimi.

## Pagesa dhe dërgesa
Mënyrat e pagesës janë te faqja [Pagesa](/stranica/pagesa), ndërsa zonat dhe afatet te faqja [Dërgesa](/stranica/dergesa).

## Kthimi dhe garancia
Shihni [Kthimi & garancia](/stranica/kthimi-garancia).

## Kontakt
denisicolor21@gmail.com · +383 45 648 117`,
        `These terms apply to purchases from the Denisi Color online shop, Rr. Komandant Kumanova, Shtime, Kosovo.

> This text is an example for the demo and will be aligned with the shop before publishing.

## Orders
An order is confirmed once you receive our confirmation by e-mail, message or phone. For “Request a price” products we send you the price first, and the order stands only once you accept it.

## Prices
Prices are in euros and include 18% VAT (to be confirmed by the shop). Confirmed orders keep the confirmed price.

## Payment and delivery
Payment methods are on the [Payment](/stranica/pagesa) page; zones and lead times on the [Delivery](/stranica/dergesa) page.

## Returns and warranty
See [Returns & warranty](/stranica/kthimi-garancia).

## Contact
denisicolor21@gmail.com · +383 45 648 117`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
    {
      id: 'pg-privatnost',
      slug: 'privatesia',
      title: T('Politika privatnosti', 'Politika e privatësisë', 'Privacy policy'),
      body: T(
        `Vaše podatke koristimo samo da bismo obradili porudžbinu ili upit i kontaktirali vas u vezi sa njima.

> Tekst je primer za demo i biće pregledan pre objavljivanja.

## Koje podatke prikupljamo
- Ime i prezime, telefon i e-mail
- Adresu i grad za dostavu
- Naziv firme i NUI, ako poručujete za firmu
- Istoriju porudžbina i upita

## Šta ne radimo
Ne prodajemo vaše podatke i ne šaljemo reklamne poruke bez vaše saglasnosti.

## Kolačići i lokalno skladište
Sajt u pregledaču čuva korpu, listu želja i izabrani jezik kako bi radio ispravno.

## Vaša prava
Možete zatražiti uvid, ispravku ili brisanje svojih podataka na denisicolor21@gmail.com.`,
        `Të dhënat tuaja i përdorim vetëm për të përpunuar porosinë ose kërkesën dhe për t'ju kontaktuar lidhur me to.

> Teksti është shembull për demo dhe do të rishikohet para publikimit.

## Çfarë të dhënash mbledhim
- Emrin dhe mbiemrin, telefonin dhe e-mailin
- Adresën dhe qytetin për dërgesë
- Emrin e biznesit dhe NUI-n, nëse porositni për biznes
- Historinë e porosive dhe kërkesave

## Çfarë nuk bëjmë
Nuk i shesim të dhënat tuaja dhe nuk dërgojmë mesazhe reklamuese pa pëlqimin tuaj.

## Cookies dhe ruajtja lokale
Faqja ruan në shfletues shportën, listën e dëshirave dhe gjuhën e zgjedhur, që të funksionojë si duhet.

## Të drejtat tuaja
Mund të kërkoni qasje, korrigjim ose fshirje të të dhënave tuaja në denisicolor21@gmail.com.`,
        `We use your data only to process your order or enquiry and to contact you about it.

> This text is an example for the demo and will be reviewed before publishing.

## What we collect
- Name, phone and e-mail
- Delivery address and town
- Company name and NUI, if you order for a business
- Order and enquiry history

## What we don't do
We don't sell your data and we don't send marketing messages without your consent.

## Cookies and local storage
The site stores your cart, wishlist and chosen language in your browser so it works properly.

## Your rights
You can request access to, correction or deletion of your data at denisicolor21@gmail.com.`,
      ),
      published: true,
      showInFooter: true,
      updatedAt: at,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Blog — "Këshilla"                                                   */
/* ------------------------------------------------------------------ */
// General buying advice around the shop's own range. Safety-related posts give general guidance
// only and point to local rules and qualified professionals.
const AUTHOR = 'Ekipi Denisi Color';

export function buildPosts(now = new Date()): Post[] {
  const d = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();
  return [
    {
      id: 'post-temperatura-led',
      slug: 'temperatura-e-drites-led-3000k-4000k-6500k',
      title: T(
        '3000K, 4000K ili 6500K? Kako izabrati boju LED svetla',
        '3000K, 4000K apo 6500K? Si ta zgjidhni ngjyrën e dritës LED',
        '3000K, 4000K or 6500K? How to choose LED light colour',
      ),
      excerpt: T(
        'Toplo, neutralno ili hladno belo — koja boja svetla odgovara dnevnoj sobi, kuhinji, radionici ili dvorištu.',
        'E bardhë e ngrohtë, neutrale apo e ftohtë — cila dritë i përshtatet dhomës së ndenjjes, kuzhinës, punëtorisë apo oborrit.',
        'Warm, neutral or cool white — which light suits the living room, kitchen, workshop or yard.',
      ),
      body: T(
        `Broj sa slovom K (kelvin) na pakovanju LED svetiljke govori kakve je boje svetlo — ne koliko je jako. Isti prostor izgleda potpuno drugačije pod toplim i pod hladnim svetlom.

## 3000K — toplo belo
Žućkasto, opuštajuće svetlo, slično klasičnoj sijalici. Za dnevnu sobu, spavaću sobu i indirektno svetlo LED trakom.

## 4000K — neutralno belo
Čisto, prirodno svetlo bez žute ili plave nijanse. Za kuhinju, kupatilo, kancelariju i hodnik.

## 6500K — hladno belo
Svetlo plavičaste nijanse koje deluje veoma jasno. Za garažu, radionicu, magacin, stepenište i spoljašnji prostor.

## Jedna svetiljka, tri boje
Naša plafonjera od 36W ima sve tri temperature (3000K, 4000K i 6500K), pa boju birate posle ugradnje.

> Savet: u istoj prostoriji koristite istu temperaturu svetla — mešanje toplog i hladnog izgleda neuredno.`,
        `Numri me shkronjën K (kelvin) në paketimin e ndriçuesit LED tregon ngjyrën e dritës — jo sa e fortë është. E njëjta hapësirë duket krejt ndryshe nën dritë të ngrohtë dhe nën dritë të ftohtë.

## 3000K — e bardhë e ngrohtë
Dritë e verdhë dhe qetësuese, e ngjashme me llambën klasike. Për dhomën e ndenjjes, dhomën e gjumit dhe ndriçimin indirekt me LED shirit.

## 4000K — e bardhë neutrale
Dritë e pastër dhe natyrale, pa nuancë të verdhë ose blu. Për kuzhinë, banjo, zyrë dhe korridor.

## 6500K — e bardhë e ftohtë
Dritë me nuancë të kaltër që duket shumë e qartë. Për garazh, punëtori, magazinë, shkallë dhe ambiente të jashtme.

## Një ndriçues, tri ngjyra
Plafonieri ynë 36W i ka të tria temperaturat (3000K, 4000K dhe 6500K), kështu që ngjyrën e zgjidhni pas montimit.

> Këshillë: në të njëjtën dhomë përdorni të njëjtën temperaturë drite — përzierja e dritës së ngrohtë me të ftohtën duket e çrregullt.`,
        `The number with a K (kelvin) on an LED light's box tells you the colour of the light — not how bright it is. The same room looks completely different under warm and cool light.

## 3000K — warm white
Yellowish, relaxing light, similar to a classic bulb. For living rooms, bedrooms and indirect LED strip lighting.

## 4000K — neutral white
Clean, natural light with no yellow or blue tint. For kitchens, bathrooms, offices and hallways.

## 6500K — cool white
Light with a bluish tint that feels very crisp. For garages, workshops, warehouses, stairwells and outdoor areas.

## One light, three colours
Our 36W ceiling light offers all three temperatures (3000K, 4000K and 6500K), so you choose the colour after fitting.

> Tip: use the same colour temperature throughout a room — mixing warm and cool light looks untidy.`,
      ),
      cover: '/images/p/ndricues-tavani-36w-1.webp',
      tag: T('Rasveta', 'Ndriçim', 'Lighting'),
      author: AUTHOR,
      readMinutes: 3,
      publishedAt: d(4),
      published: true,
    },
    {
      id: 'post-ip',
      slug: 'cfare-do-te-thote-ip20-ip54-ip65',
      title: T(
        'Šta znače IP20, IP54 i IP65 na svetiljkama?',
        'Çfarë do të thonë IP20, IP54 dhe IP65 te ndriçuesit?',
        'What do IP20, IP54 and IP65 mean on lights?',
      ),
      excerpt: T(
        'Dve cifre koje govore gde svetiljka sme da stoji — unutra, pod nadstrešnicom ili na kiši.',
        'Dy shifra që tregojnë ku mund të vendoset ndriçuesi — brenda, nën strehë apo në shi.',
        'Two digits that tell you where a light can go — indoors, under cover or out in the rain.',
      ),
      body: T(
        `Oznaka IP pokazuje koliko je kućište zaštićeno. Prva cifra se odnosi na prašinu i čvrste delove, druga na vodu — što je broj veći, zaštita je bolja.

## IP20 — samo unutra
Zaštita od dodira prstima, ali ne i od vode. Za suve prostorije: sobe, hodnike, kancelarije. Takve su naše plafonjere od 18W i 36W.

## IP54 — vlaga i prskanje
Zaštićena od prašine i od vode koja prska iz svih pravaca. Za terasu pod nadstrešnicom, ulaz ili vlažnije prostorije. Primer: zidna svetiljka 24W IP54.

## IP65 — spolja
Potpuno zaštićena od prašine i od mlaza vode. Za dvorišta, parkinge, magacine i ulice — kao naše ulične svetiljke od 50W.

## Pre ugradnje
- Proverite oznaku IP za mesto gde svetiljka ide
- Za kupatila postoje posebna pravila zona — pitajte električara
- Povezivanje na mrežu prepustite kvalifikovanom električaru

> Niste sigurni koja vam treba? Pošaljite nam fotografiju mesta i pomoći ćemo vam da izaberete.`,
        `Shenja IP tregon sa i mbrojtur është trupi i ndriçuesit. Shifra e parë ka të bëjë me pluhurin dhe trupat e ngurtë, e dyta me ujin — sa më i madh numri, aq më e mirë mbrojtja.

## IP20 — vetëm brenda
Mbrojtje nga prekja me gisht, por jo nga uji. Për ambiente të thata: dhoma, korridore, zyra. Të tillë janë plafonierët tanë 18W dhe 36W.

## IP54 — lagështi dhe spërkatje
I mbrojtur nga pluhuri dhe nga uji që spërkat nga çdo drejtim. Për tarracë nën strehë, hyrje ose ambiente më të lagështa. Shembull: ndriçuesi i murit 24W IP54.

## IP65 — jashtë
Plotësisht i mbrojtur nga pluhuri dhe nga rrjedha e ujit. Për oborre, parkingje, magazina dhe rrugë — si ndriçuesit tanë rrugorë 50W.

## Para montimit
- Kontrolloni shenjën IP për vendin ku shkon ndriçuesi
- Për banjot ka rregulla të veçanta zonash — pyesni elektricistin
- Lidhjen në rrjet lëreni në duart e një elektricisti të kualifikuar

> Nuk jeni të sigurt cili ju duhet? Na dërgoni një foto të vendit dhe ju ndihmojmë ta zgjidhni.`,
        `The IP rating shows how well the housing is protected. The first digit covers dust and solid objects, the second covers water — the higher the number, the better the protection.

## IP20 — indoors only
Protected against fingers, but not against water. For dry rooms: bedrooms, hallways, offices. Our 18W and 36W ceiling lights are IP20.

## IP54 — damp and splashes
Protected against dust and water splashing from any direction. For a covered terrace, an entrance or damper rooms. Example: the 24W IP54 wall light.

## IP65 — outdoors
Fully dust-tight and protected against water jets. For yards, car parks, warehouses and streets — like our 50W street lights.

## Before fitting
- Check the IP rating for the spot where the light will go
- Bathrooms have their own zone rules — ask an electrician
- Leave the mains connection to a qualified electrician

> Not sure which one you need? Send us a photo of the spot and we'll help you choose.`,
      ),
      cover: '/images/p/ndricues-muri-24w-1.webp',
      tag: T('Rasveta', 'Ndriçim', 'Lighting'),
      author: AUTHOR,
      readMinutes: 3,
      publishedAt: d(11),
      published: true,
    },
    {
      id: 'post-led-profil',
      slug: 'led-shirit-dhe-profil-alumini',
      title: T(
        'LED traka i aluminijumski profil: osnove za čistu liniju svetla',
        'LED shirit dhe profil alumini: bazat për një linjë drite të pastër',
        'LED strip and aluminium profile: the basics of a clean light line',
      ),
      excerpt: T(
        'Koju traku izabrati, zašto profil i šta sve treba da poručite da bi sve radilo iz prve.',
        'Cilin shirit të zgjidhni, pse profili dhe çfarë duhet të porosisni që gjithçka të funksionojë që herën e parë.',
        'Which strip to pick, why use a profile and what to order so it all works first time.',
      ),
      body: T(
        `LED traka u profilu daje ravnu, modernu liniju svetla — u plafonu od gips-kartona, ispod kuhinjskih elemenata ili na stepeništu.

## 1. Izaberite traku
- **3000K** — toplo belo, za dnevnu sobu i spavaću sobu
- **6500K COB** — hladno belo u neprekidnoj liniji, bez vidljivih tačaka
- **RGB** — svetlo u boji, uz kontroler

## 2. Zašto profil?
Aluminijumski profil skriva traku, ravnomerno raspoređuje svetlo kroz difuzor i odvodi toplotu, pa traka duže traje. Postoje profili za nadgradnju i za ugradnju u gips-karton.

## 3. Šta još treba
- Napajanje odgovarajuće snage, sa rezervom
- Kontroler ili dimer, ako želite RGB ili prigušivanje
- Završne kapice i nosači za profil

## 4. Merenje
Izmerite dužinu svake linije. Traka se seče samo na označenim mestima.

> Pošaljite nam dužine i mesto ugradnje — pripremićemo spisak: traka, profil i napajanje.`,
        `LED shiriti në profil jep një linjë drite të drejtë dhe moderne — në tavan rigipsi, nën elementet e kuzhinës ose në shkallë.

## 1. Zgjidhni shiritin
- **3000K** — e bardhë e ngrohtë, për dhomën e ndenjjes dhe të gjumit
- **6500K COB** — e bardhë e ftohtë në linjë të vazhdueshme, pa pika të dukshme
- **RGB** — dritë me ngjyra, me kontrollues

## 2. Pse profili?
Profili i aluminit e fsheh shiritin, e shpërndan dritën në mënyrë të njëtrajtshme përmes difuzorit dhe e largon nxehtësinë, kështu shiriti zgjat më shumë. Ka profile për montim sipërfaqësor dhe për futje në rigips.

## 3. Çfarë tjetër ju duhet
- Ushqyes me fuqi të përshtatshme, me rezervë
- Kontrollues ose dimer, nëse doni RGB ose rregullim të dritës
- Kapakë fundorë dhe mbajtës për profilin

## 4. Matja
Matni gjatësinë e çdo linje. Shiriti pritet vetëm në vendet e shënuara.

> Na dërgoni gjatësitë dhe vendin e montimit — ju përgatisim listën: shirit, profil dhe ushqyes.`,
        `An LED strip in a profile gives a straight, modern line of light — in a plasterboard ceiling, under kitchen units or on a staircase.

## 1. Choose the strip
- **3000K** — warm white, for living rooms and bedrooms
- **6500K COB** — cool white in a continuous line, with no visible dots
- **RGB** — coloured light, with a controller

## 2. Why a profile?
An aluminium profile hides the strip, spreads the light evenly through a diffuser and draws away heat, so the strip lasts longer. There are surface-mounted profiles and recessed ones for plasterboard.

## 3. What else you need
- A power supply of the right wattage, with headroom
- A controller or dimmer, if you want RGB or dimming
- End caps and mounting clips for the profile

## 4. Measuring
Measure the length of each run. Strips can only be cut at the marked points.

> Send us the lengths and where it's going — we'll put together the list: strip, profile and power supply.`,
      ),
      cover: '/images/p/profil-alumini-led-1.webp',
      tag: T('LED trake', 'LED shirita', 'LED strips'),
      author: AUTHOR,
      readMinutes: 4,
      publishedAt: d(19),
      published: true,
    },
    {
      id: 'post-bombola',
      slug: 'si-ta-zgjidhni-bombolen-e-zjarrit-abc',
      title: T(
        'Aparat za gašenje ABC: koja veličina za dom, vozilo ili radionicu?',
        'Bombola zjarri ABC: cila madhësi për shtëpi, automjet apo punëtori?',
        'ABC fire extinguisher: which size for the home, car or workshop?',
      ),
      excerpt: T(
        'Opšte smernice za izbor između 2, 3, 5 i 8 kg — i zašto uvek treba proveriti lokalne propise.',
        'Udhëzime të përgjithshme për zgjedhjen mes 2, 3, 5 dhe 8 kg — dhe pse duhet t’i kontrolloni gjithmonë rregullat lokale.',
        'General guidance for choosing between 2, 3, 5 and 8 kg — and why you should always check local rules.',
      ),
      body: T(
        `Aparat sa ABC prahom je najčešći izbor za dom, vozilo i radionicu jer je namenjen za tri klase požara: A (čvrsti materijali — drvo, papir, tekstil), B (zapaljive tečnosti) i C (gasovi).

> Ovo su opšte smernice, a ne bezbednosni savet. Broj, vrstu i veličinu aparata za firme i objekte određuju važeći propisi i nadležni organi — proverite ih pre kupovine.

## Orijentacione veličine
- **2 kg** — automobil, manji prostor
- **3 kg** — stan, manja kancelarija
- **5 kg** — kuća, radnja, kancelarija
- **8 kg** — radionica, magacin, gradilište

## Na šta da pazite
- Aparat držite vidljivo, blizu izlaza i lako dostupnim
- Redovno proveravajte manometar i datum servisa
- Pročitajte nalepnicu: za električne uređaje i ulje za prženje važe posebna uputstva
- Prah ostavlja trag — posle upotrebe prostor treba očistiti

> Pišite nam za koji prostor ili vozilo vam treba aparat i pomoći ćemo vam da izaberete veličinu.`,
        `Bombola me pluhur ABC është zgjedhja më e zakonshme për shtëpi, automjet dhe punëtori, sepse është menduar për tri klasa zjarri: A (materiale të ngurta — dru, letër, tekstil), B (lëngje të djegshme) dhe C (gazra).

> Këto janë udhëzime të përgjithshme, jo këshillë sigurie. Numrin, llojin dhe madhësinë e bombolave për biznese dhe objekte i përcaktojnë rregullat në fuqi dhe autoritetet përkatëse — kontrollojini para blerjes.

## Madhësi orientuese
- **2 kg** — veturë, hapësirë e vogël
- **3 kg** — banesë, zyrë e vogël
- **5 kg** — shtëpi, dyqan, zyrë
- **8 kg** — punëtori, magazinë, kantier

## Çfarë të keni parasysh
- Mbajeni bombolën në vend të dukshëm, afër daljes dhe lehtë të arritshme
- Kontrolloni rregullisht manometrin dhe datën e servisimit
- Lexoni etiketën: për pajisje elektrike dhe vaj gatimi vlejnë udhëzime të veçanta
- Pluhuri lë gjurmë — pas përdorimit hapësira duhet pastruar

> Na shkruani për cilën hapësirë apo automjet ju duhet bombola dhe ju ndihmojmë ta zgjidhni madhësinë.`,
        `An ABC powder extinguisher is the most common choice for homes, cars and workshops because it is designed for three classes of fire: A (solids — wood, paper, textiles), B (flammable liquids) and C (gases).

> This is general guidance, not safety advice. The number, type and size of extinguishers for businesses and buildings are set by the rules in force and the competent authorities — check them before you buy.

## Indicative sizes
- **2 kg** — car, small space
- **3 kg** — flat, small office
- **5 kg** — house, shop, office
- **8 kg** — workshop, warehouse, building site

## Things to keep in mind
- Keep the extinguisher visible, near an exit and easy to reach
- Check the pressure gauge and service date regularly
- Read the label: electrical equipment and cooking oil have specific instructions
- Powder leaves residue — the area needs cleaning after use

> Tell us what space or vehicle the extinguisher is for and we'll help you pick a size.`,
      ),
      cover: '/images/p/bombol-abc-1.webp',
      tag: T('Protivpožarna oprema', 'Kundër zjarrit', 'Fire safety'),
      author: AUTHOR,
      readMinutes: 4,
      publishedAt: d(27),
      published: true,
    },
    {
      id: 'post-shtresat',
      slug: 'softshell-apo-duks-veshja-ne-shtresa',
      title: T(
        'Softshell ili duks? Oblačenje u slojevima za zimski rad',
        'Softshell apo duks? Veshja në shtresa për punën në dimër',
        'Softshell or sweatshirt? Layering for winter work',
      ),
      excerpt: T(
        'Kako da kombinujete duks i softshell jaknu da vam bude toplo ujutru, a da se ne pregrejete u podne.',
        'Si ta kombinoni duksin me jaknën softshell që të jeni ngrohtë në mëngjes pa u nxehur në mesditë.',
        'How to combine a sweatshirt and a softshell so you’re warm in the morning without overheating at noon.',
      ),
      body: T(
        `Na gradilištu ili u radionici zimi se temperatura menja tokom dana. Više tanjih slojeva je praktičnije od jedne debele jakne — skidate i dodajete po potrebi.

## Sloj 1 — majica
Pamučna ili tehnička majica uz telo.

## Sloj 2 — radni duks (16 €)
Topao duks sa rajsferšlusom i visokom kragnom. Lako se skida kada vam postane toplo. Imamo ga u svetlosivoj, tamnosivoj, crnoj i beloj.

## Sloj 3 — softshell jakna (26 €)
Softshell štiti od vetra i ne sputava pokrete. Za jaku kišu dodajte kabanicu. Boje: siva, crna, bela.

## Za teže uslove — Kapriol (35 €)
Kapriol radni duks sa ojačanim ramenima i džepovima za sitnice, za one koji rade ceo dan napolju.

## Veličine
Veličine su po upitu — napišite koju obično nosite. Za ekipe pripremamo ponudu za više komada.

> Saveti važe za uobičajene radne uslove; za specifične zahteve zaštite na radu pitajte svog poslodavca.`,
        `Në kantier ose në punëtori, në dimër temperatura ndryshon gjatë ditës. Disa shtresa më të holla janë më praktike se një jakne e trashë — i hiqni dhe i shtoni sipas nevojës.

## Shtresa 1 — bluza
Bluzë pambuku ose teknike afër trupit.

## Shtresa 2 — duksi i punës (16 €)
Duks i ngrohtë me zinxhir dhe jakë të lartë. Hiqet lehtë kur ju bëhet ngrohtë. E kemi në hiri të çelët, hiri të errët, të zezë dhe të bardhë.

## Shtresa 3 — jakne softshell (26 €)
Softshell-i mbron nga era dhe nuk i pengon lëvizjet. Për shi të fortë shtoni një mushama. Ngjyrat: hiri, e zezë, e bardhë.

## Për kushte më të rënda — Kapriol (35 €)
Duksi i punës Kapriol me supe të përforcuara dhe xhepa për gjërat e vogla, për ata që punojnë gjithë ditën jashtë.

## Madhësitë
Madhësitë janë sipas kërkesës — na shkruani cilën mbani zakonisht. Për ekipe përgatisim ofertë për më shumë copë.

> Këshillat vlejnë për kushte të zakonshme pune; për kërkesa specifike të sigurisë në punë pyesni punëdhënësin tuaj.`,
        `On a building site or in a workshop, winter temperatures change through the day. Several thinner layers are more practical than one thick jacket — take them off and add them as needed.

## Layer 1 — T-shirt
A cotton or technical T-shirt next to the skin.

## Layer 2 — work sweatshirt (€16)
A warm full-zip sweatshirt with a high collar. Easy to take off when you warm up. Available in light grey, dark grey, black and white.

## Layer 3 — softshell jacket (€26)
Softshell blocks the wind and moves with you. For heavy rain, add a rain jacket. Colours: grey, black, white.

## For tougher conditions — Kapriol (€35)
The Kapriol work top with reinforced shoulders and pockets for small items, for those who work outside all day.

## Sizes
Sizes are on request — tell us the size you usually wear. For crews we prepare a quote for multiple pieces.

> This advice is for ordinary working conditions; for specific workplace-safety requirements, ask your employer.`,
      ),
      cover: '/images/p/jakne-softshell-1.webp',
      tag: T('Radna odeća', 'Veshje pune', 'Workwear'),
      author: AUTHOR,
      readMinutes: 3,
      publishedAt: d(36),
      published: true,
    },
    {
      id: 'post-kopshti',
      slug: 'kopshti-me-bosch-isio-dhe-art-23',
      title: T(
        'Uredna bašta sa Bosch ISIO i ART 23 SL',
        'Kopsht i rregullt me Bosch ISIO dhe ART 23 SL',
        'A tidy garden with the Bosch ISIO and ART 23 SL',
      ),
      excerpt: T(
        'Ivice travnjaka, staze i niska živa ograda — koji alat za šta i kako da ga sačuvate preko zime.',
        'Anët e lëndinës, shtigjet dhe gardhet e ulëta — cila vegël për çfarë dhe si ta ruani gjatë dimrit.',
        'Lawn edges, paths and low hedges — which tool does what and how to store it over winter.',
      ),
      body: T(
        `Kosilica odradi veći deo posla, ali uredna bašta se vidi po ivicama. Za to su dovoljna dva laka Bosch alata.

## Bosch ART 23 SL — trimer
Lagani električni trimer za ivice duž staza, zidova i leja i za manje travnjake. Radi na kabl, pa nema punjenja baterije.

## Bosch ISIO — makaze
Akumulatorske makaze za oblikovanje ivica travnjaka i tankog žbunja. Litijum-jonska baterija i ergonomska drška.

## Jesen: poslednje sređivanje
- Poslednji put skratite ivice pre prvih mrazeva
- Uklonite lišće sa travnjaka
- Očistite noževe i nit od trave i zemlje

## Čuvanje preko zime
- Alat čuvajte na suvom mestu
- Bateriju ISIO-a čuvajte delimično napunjenu, na sobnoj temperaturi
- Proverite kabl trimera pre prve upotrebe na proleće

> Pre upotrebe pročitajte uputstvo proizvođača. Za cenu i dostupnost pošaljite upit.`,
        `Kositësja e bën pjesën më të madhe të punës, por kopshti i rregullt dallohet nga anët. Për këtë mjaftojnë dy vegla të lehta Bosch.

## Bosch ART 23 SL — trimeri
Trimer elektrik i lehtë për anët përgjatë shtigjeve, mureve dhe lulishteve dhe për lëndina të vogla. Punon me kabllo, pa nevojë për karikim baterie.

## Bosch ISIO — prerësja
Prerëse me bateri për formimin e anëve të lëndinës dhe të shkurreve të holla. Bateri litium-jon dhe dorezë ergonomike.

## Vjeshta: rregullimi i fundit
- Shkurtoni anët për herë të fundit para ngricave të para
- Hiqni gjethet nga lëndina
- Pastroni thikat dhe fijen nga bari dhe dheu

## Ruajtja gjatë dimrit
- Ruajini veglat në vend të thatë
- Baterinë e ISIO-s ruajeni pjesërisht të karikuar, në temperaturë dhome
- Kontrolloni kabllon e trimerit para përdorimit të parë në pranverë

> Para përdorimit lexoni udhëzimet e prodhuesit. Për çmimin dhe disponueshmërinë dërgoni kërkesë.`,
        `The mower does most of the work, but a tidy garden shows in its edges. Two light Bosch tools are all you need.

## Bosch ART 23 SL — trimmer
A light electric trimmer for edges along paths, walls and beds, and for small lawns. It's corded, so there's no battery to charge.

## Bosch ISIO — shears
Cordless shears for shaping lawn edges and thin shrubs. Lithium-ion battery and an ergonomic handle.

## Autumn: the last tidy-up
- Trim the edges one last time before the first frosts
- Clear leaves from the lawn
- Clean grass and soil off the blades and line

## Winter storage
- Keep the tools somewhere dry
- Store the ISIO battery partly charged, at room temperature
- Check the trimmer cable before the first spring use

> Read the manufacturer's instructions before use. For price and availability, send an enquiry.`,
      ),
      cover: '/images/p/prerese-bosch-isio-1.webp',
      tag: T('Bašta', 'Kopshti', 'Garden'),
      author: AUTHOR,
      readMinutes: 3,
      publishedAt: d(48),
      published: true,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Coupons (legacy screen — checkout pricing uses `discounts`)         */
/* ------------------------------------------------------------------ */
export function buildCoupons(now = new Date()): Coupon[] {
  return [
    { id: 'cp-1', code: 'MIRESEVINI10', type: 'percent', value: 10, minTotal: 30, active: true, uses: 14, description: 'Mirë se vini — 10% për porosinë e parë mbi 30 €' },
    { id: 'cp-2', code: 'KANTIER', type: 'percent', value: 8, minTotal: 150, active: true, uses: 6, description: 'Për kontraktorë dhe kantiere — 8% për porosi mbi 150 €' },
    { id: 'cp-3', code: 'DIMRI5', type: 'fixed', value: 5, minTotal: 40, active: true, uses: 9, expiresAt: new Date(now.getTime() + 30 * 86400000).toISOString(), description: 'Oferta e dimrit — 5 € zbritje për porosi mbi 40 €' },
    { id: 'cp-4', code: 'EKIPI15', type: 'percent', value: 15, minTotal: 250, active: false, uses: 2, description: 'Veshje pune për ekipe — 15% mbi 250 € (joaktiv)' },
  ];
}
