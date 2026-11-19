/**
 * CESARINI — sursa unică de adevăr pentru conținut + Schema.org.
 *
 * Surse (25.09.2026): cesarini.ro (pagini Contact, categorii, produs), profilul Google Business,
 * raportul „Cesarini în ChatGPT” (18.09.2026).
 *
 * `verified`  → fapte confirmate din sursele de mai sus. Intră în JSON-LD.
 * `editorial` → formulări de prezentare pentru UI. NU intră în JSON-LD.
 * Regulă: nimic inventat în `verified`. AI-urile citează datele structurate cuvânt cu cuvânt.
 */

export const SITE_URL = 'https://cesarini.ro';

export const verified = {
  name: 'Cesarini',
  legalHint: 'Cesarini România',
  tagline: 'Croit pentru tine.',
  foundingYear: '2015',

  // NAP — identic peste tot (site, Google Business, schema)
  street: 'Str. Ștefan Octavian Iosif nr. 1',
  postalCode: '400104',
  city: 'Cluj-Napoca',
  region: 'Cluj',
  country: 'RO',
  phoneDisplay: '0723 424 929',
  phoneE164: '+40723424929',
  email: 'contact@cesarini.ro',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cesarini%2C%20Str.%20%C8%98tefan%20Octavian%20Iosif%201%2C%20400104%20Cluj-Napoca',

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], label: 'Luni – Vineri', opens: '11:00', closes: '19:00' },
    { days: ['Saturday'], label: 'Sâmbătă', opens: '11:00', closes: '14:00' },
  ],
  appointmentNote: 'Recomandăm programarea: fiecare client primește atenție deplină și timp suficient.',

  // Oferta reală (prețuri de pe cesarini.ro)
  prices: {
    ceremonySuit: 2299,   // 3 piese: sacou, vestă, pantaloni · 100% lână
    businessSuit: 1599,
    ceremonyShirt: 299,   // cămășile albe și cămașa neagră cu manșete pentru butoni (fișele din 19.11.2026)
    blackShirtTie: 249,   // cămașa neagră cu guler pentru cravată (fișa din 19.11.2026)
    oxfordShoes: 599,
    leatherBelt: 199,     // curele din piele naturală, 105 – 135 cm (fișele din 19.11.2026)
    bambooSocks: 29,      // șosete din bambus 41–44 (fișele din 19.11.2026)
  },
  /** Fișele clientului (18.10.2026): modelele de ceremonie sunt în 2 sau 3 piese, toate cele cu fișă sunt 100% lână */
  ceremonySuitSpec: { pieces: 'sacou, vestă și pantaloni', piecesRange: 'două sau trei piese (sacou și pantaloni, plus vestă la modelele în trei piese)', fabric: '100% lână', sizes: '46 – 58' },
  freeAlterations: 'Ajustări gratuite, realizate de croitorii Cesarini, pentru întreaga ținută cumpărată din showroom.',
  delivery: 'Livrare în 1 – 2 zile lucrătoare; un consultant sună pentru confirmarea mărimii.',

  social: {
    instagram: 'https://www.instagram.com/cesarini.romania/',
    facebook: 'https://www.facebook.com/Cesarini.Romania/',
    tiktok: 'https://www.tiktok.com/@cesarini.romania',
  },

  /**
   * Rating Google: afișat în UI ca dovadă socială, dar NU în JSON-LD.
   * Google nu acceptă AggregateRating „self-serving” pe LocalBusiness/Organization pe propriul site.
   */
  googleRating: { value: '5,0', count: 538 },

  /** Fraza-entitate: formulată ca să poată fi citată cuvânt cu cuvânt. */
  entitySentence:
    'Cesarini este un showroom de costume bărbătești din Cluj-Napoca, activ din 2015, pe Str. Ștefan Octavian Iosif nr. 1. Oferă costume de ceremonie și de mire (2.299 lei, în două sau trei piese, 100% lână), costume business și casual (1.599 lei), cămăși pe măsură, pantofi și accesorii, cu ajustări gratuite realizate de croitorii casei pentru întreaga ținută.',
};

export const editorial = {
  /**
   * WhatsApp: același număr ca telefonul verificat. DE CONFIRMAT CU CLIENTUL că numărul are WhatsApp.
   * Stă în `editorial`, nu în `verified`: nu intră în JSON-LD (sameAs / contactPoint) până la confirmare.
   */
  whatsapp: { href: 'https://wa.me/40723424929', display: '0723 424 929', confirmed: false },
  instagramHandle: '@cesarini.romania',
  showroomLabel: 'Showroom Cesarini — Str. Ștefan Octavian Iosif 1, Cluj-Napoca',
  appointmentShort: 'Private Fitting, pe bază de programare',
  seasonLabel: 'Collections · Garderoba completă',
};

export const formatRON = (v: number) => new Intl.NumberFormat('ro-RO').format(v) + ' lei';

export type Collection = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  priceFrom: number;
  /** URL-ul categoriei pe site-ul actual — folosit la migrare și redirect-uri 301 */
  legacyUrl: string;
  fabric: 'herringbone' | 'silk' | 'poplin' | 'wool';
  href: string;
};

export const collections: Collection[] = [
  {
    slug: 'costume-ceremonie',
    index: '01',
    title: 'Costume de Ceremonie',
    kicker: 'Mire · Naș · Gală',
    description: 'Costume în două sau trei piese, din 100% lână, în mărimile 46 – 58, ajustate gratuit în atelier.',
    priceFrom: verified.prices.ceremonySuit,
    legacyUrl: 'https://www.cesarini.ro/costume-barbati-ceremonie/',
    fabric: 'herringbone',
    href: '/colectii/costume-ceremonie',
  },
  {
    slug: 'costume-business-casual',
    index: '02',
    title: 'Business & Casual',
    kicker: 'Birou · Evenimente · Weekend',
    description: 'Costume pentru fiecare zi în care contează cum intri într-o cameră.',
    priceFrom: verified.prices.businessSuit,
    legacyUrl: 'https://www.cesarini.ro/costume-business-casual/',
    fabric: 'wool',
    href: '/colectii/costume-business-casual',
  },
  {
    slug: 'camasi',
    index: '03',
    title: 'Cămăși',
    kicker: 'Ceremonie · Papion · Pe măsură',
    description: 'Cămăși albe și negre din 100% bumbac, Slim Fit, cu nasturi ascunși, și cămăși croite pe măsura ta.',
    priceFrom: verified.prices.blackShirtTie,
    legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/',
    fabric: 'poplin',
    href: '/colectii/camasi',
  },
  {
    slug: 'accesorii',
    index: '04',
    title: 'Pantofi & Accesorii',
    kicker: 'Oxford · Curele · Șosete · Papioane',
    description: 'Pantofi Oxford, curele din piele naturală, șosete din bambus, cravate, papioane și butoni: detaliile care închid ținuta.',
    priceFrom: verified.prices.bambooSocks,
    legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/',
    fabric: 'silk',
    href: '/colectii/accesorii',
  },
];

/** Produse reale de pe cesarini.ro (nume, preț, URL). `media` = cheie în lib/media.ts (placeholder până la foto). */
export type FeaturedProduct = {
  slug: string;
  name: string;
  category: string;
  detail: string;
  price: number;
  media: 'ceremonySuit' | 'businessSuit' | 'shirtHanger' | 'shirtTable' | 'oxfordShoes';
  href: string;
  legacyUrl: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    slug: 'costum-ceremonie-negru-c03',
    name: 'Costum de ceremonie negru',
    category: 'Costume de ceremonie',
    detail: '3 piese · 100% lână · 46 – 58',
    price: verified.prices.ceremonySuit,
    media: 'ceremonySuit',
    href: '/produs/costum-ceremonie-negru-c03',
    legacyUrl: 'https://www.cesarini.ro/costume-barbati-ceremonie/',
  },
  {
    slug: 'costum-business-bej-b02',
    name: 'Costum business bej',
    category: 'Business & Casual',
    detail: '3 piese · 77% lână · 46 – 58',
    price: verified.prices.businessSuit,
    media: 'businessSuit',
    href: '/produs/costum-business-bej-b02',
    legacyUrl: 'https://www.cesarini.ro/costume-business-casual/',
  },
  {
    slug: 'camasa-alba-nasturi-ascunsi',
    name: 'Cămașă albă Slim Fit cu nasturi ascunși',
    category: 'Cămăși de ceremonie',
    detail: '100% bumbac · manșete pentru butoni',
    price: verified.prices.ceremonyShirt,
    media: 'shirtHanger',
    href: '/produs/camasa-alba-nasturi-ascunsi',
    legacyUrl: 'https://www.cesarini.ro/camasa-ceremonie-cu-nasturi-ascunsi/',
  },
  {
    slug: 'curea-piele-neagra',
    name: 'Curea din piele naturală neagră',
    category: 'Curele',
    detail: 'Piele naturală · 3,5 cm · 105 – 135 cm',
    price: verified.prices.leatherBelt,
    media: 'shirtTable',
    href: '/produs/curea-piele-neagra',
    legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/',
  },
  {
    slug: 'pantofi-oxford-negru-semilucios',
    name: 'Pantofi Oxford negru semilucios',
    category: 'Pantofi Oxford',
    detail: 'Piele naturală · talpă neolit · 38 – 45',
    price: verified.prices.oxfordShoes,
    media: 'oxfordShoes',
    href: '/produs/pantofi-oxford-negru-semilucios',
    legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/',
  },
];

/** Serviciile casei: textul clientului (Atelier.DOC, 19.11.2026), cuvânt cu cuvânt. Pe homepage apar titlul și subtitlul. */
export const atelierServices = [
  {
    numeral: 'I',
    id: 'ajustari',
    title: 'Costume Made to Measure & croitorie',
    lead: 'Costume adaptate măsurilor tale, pentru o potrivire impecabilă.',
    body: 'La CESARINI, realizăm costume Made to Measure, adaptate măsurilor și preferințelor tale. Pentru costumele achiziționate din showroom, croitorii noștri se ocupă de ajustările necesare, de la modificarea taliei și a lungimii pantalonilor până la ajustarea mânecilor și a sacoului, precum și alte intervenții de croitorie, în funcție de particularitățile fiecărei ținute.',
    facts: [
      'Consultanță vestimentară și măsurători personalizate.',
      'Ajustări gratuite pentru întreaga ținută achiziționată din showroom.',
      'Servicii de croitorie realizate în atelierul CESARINI din Cluj-Napoca.',
    ],
    href: '/atelier#ajustari',
  },
  {
    numeral: 'II',
    id: 'camasi-pe-masura',
    title: 'Cămăși personalizate',
    lead: 'Croială adaptată măsurilor și conformației tale.',
    body: 'Îți oferim posibilitatea de a personaliza cămășile din colecția CESARINI prin ajustări realizate după tiparul stabilit pe baza măsurătorilor tale. Adaptăm croiala cămășii alese pentru un plus de confort și o potrivire cât mai bună.',
    facts: [
      'Măsurători și configurarea tiparului personalizat.',
      'Ajustarea cămășilor disponibile în colecția CESARINI.',
      'Personalizarea croielii în funcție de conformația ta.',
    ],
    href: '/atelier#camasi-pe-masura',
  },
  {
    numeral: 'III',
    id: 'consultanta',
    title: 'Consultanță vestimentară personalizată',
    lead: 'Alegerea potrivită pentru fiecare stil și fiecare ocazie.',
    body: 'Fie că ești mire, naș, invitat la o nuntă, participi la un eveniment special sau cauți o ținută business ori casual, echipa CESARINI te îndrumă în alegerea ținutei potrivite. Beneficiezi de recomandări personalizate privind croiala, culorile, materialele și accesoriile, pentru o apariție elegantă și armonioasă.',
    facts: [
      'Consultanță vestimentară pentru ținute de ceremonie, business și casual.',
      'Recomandări personalizate pentru costume, cămăși, pantofi și accesorii.',
      'Îndrumare în alegerea și asortarea întregii ținute.',
    ],
    href: '/atelier#consultanta',
  },
] as const;

/**
 * FAQ-ul de pe homepage = FAQPage JSON-LD = llms.txt (text identic, citat cuvânt cu cuvânt de AI-uri).
 * Doar fapte verificate. Termenul pentru croit pe măsură NU e confirmat: răspunsul spune cine îl confirmă, nu inventează zile.
 */
export const faqs = [
  {
    q: 'Cât durează realizarea unui costum Made-to-Measure la Cesarini?',
    a: `Termenul depinde de piesă și de stofă, așa că ți-l confirmă un consultant Cesarini la telefon, după ce verifică măsurile tale. Piesele din stoc, în mărime standard, se livrează în 1 – 2 zile lucrătoare. Dacă ai un eveniment la o dată fixă, spune-ne data de la început.`,
  },
  {
    q: 'Cum funcționează ajustările gratuite în showroom-ul din Cluj-Napoca?',
    a: `Probezi ținuta în showroom-ul de pe ${verified.street}, iar croitorii Cesarini o ajustează pe tine: talia, mânecile, tivul și lungimea sacoului. Ajustările sunt gratuite pentru întreaga ținută cumpărată din showroom: costume, cămăși și pantaloni. Recomandăm programarea la ${verified.phoneDisplay}.`,
  },
  {
    q: 'Care este prețul de pornire pentru un costum de ceremonie sau business?',
    a: `Un costum de ceremonie Cesarini costă ${formatRON(verified.prices.ceremonySuit)}: ${verified.ceremonySuitSpec.piecesRange}, din ${verified.ceremonySuitSpec.fabric}, în mărimile ${verified.ceremonySuitSpec.sizes}. Un costum business sau casual costă ${formatRON(verified.prices.businessSuit)}. Cămășile pornesc de la ${formatRON(verified.prices.blackShirtTie)}.`,
  },
  {
    q: 'Cum pot comanda online dacă nu pot ajunge în showroom?',
    a: 'Pe pagina costumului sau a cămășii alegi „Croit pe măsură” și introduci măsurile: înălțime, greutate, piept, talie, șold, umeri, biceps, lungimea mânecii și, la costume, lungimea pantalonului. Fiecare măsură are un ghid ilustrat. Plătești cu cardul, iar un consultant te sună să verifice măsurile înainte de croire. Poți alege și o mărime standard; atunci consultantul te sună să confirme mărimea.',
  },
  {
    q: 'Unde este situat showroom-ul Cesarini și care este programul?',
    a: `Showroom-ul Cesarini se află pe ${verified.street}, ${verified.postalCode} ${verified.city}. Programul este luni – vineri 11:00 – 19:00 și sâmbătă 11:00 – 14:00; duminică este închis. Recomandăm programarea la ${verified.phoneDisplay}.`,
  },
] as const;

/** Navigația principală. Etichetele vin din `components/LocaleProvider.tsx` (în română: Colecții · Despre noi · Jurnal · Atelier, cererea clientului din 19.11.2026). */
export const nav = [
  { key: 'colectii', href: '/colectii' },
  { key: 'despre', href: '/comunitate' },
  { key: 'jurnal', href: '/journal' },
  { key: 'atelier', href: '/atelier' },
] as const;
