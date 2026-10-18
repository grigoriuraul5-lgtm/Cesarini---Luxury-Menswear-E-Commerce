/**
 * CESARINI — catalogul magazinului online (PLP, PDP, coș, checkout).
 *
 * Numele și prețurile vin din `lib/brand.ts` → `verified` (confirmate pe cesarini.ro).
 * Ocaziile (`occasions`) sunt etichete editoriale pentru filtre: ajută clientul să aleagă, NU sunt fapte în JSON-LD.
 * `commerceConfig` conține deciziile comerciale NOI, încă NECONFIRMATE de client.
 */
import { verified, featuredProducts, formatRON } from '@/lib/brand';
import { media, type Media } from '@/lib/media';
import { GALLERY } from './gallery';

export type GarmentType = 'suit' | 'shirt' | 'shoes' | 'belt';
export type CategoryKey = 'costume-ceremonie' | 'costume-business-casual' | 'camasi' | 'pantofi' | 'accesorii';
export type OccasionKey = 'mire' | 'nas' | 'gala' | 'business';

export type CommerceProduct = {
  slug: string;
  name: string;
  /** eticheta de categorie afișată (mai fină decât `categoryKey`) */
  category: string;
  categoryKey: CategoryKey;
  garment: GarmentType;
  price: number;
  lead: string;
  details: string[];
  occasions: OccasionKey[];
  sizes: string[];
  sizeSystem: 'EU' | 'guler' | 'lungime';
  gallery: Media[];
  legacyUrl: string;
  /** ordinea „Recomandate” (mic = primul) */
  rank: number;
  /** data adăugării în magazinul nou, pentru „Noutăți” (ISO) */
  addedAt: string;
  /** codul modelului din folderele clientului (C03, B02…): îl poți spune în showroom */
  code?: string;
  /** culoarea afișată și familia ei (pentru filtrul „Culoare”) */
  color?: string;
  colorFamily?: ColorFamily;
  /** numărul de piese al costumului (2 = sacou + pantaloni, 3 = + vestă) */
  pieces?: 2 | 3;
  /** compoziția materialului, exact ca în fișa clientului */
  composition?: string;
  badge?: 'Stoc limitat';
  /** ce lipsește din fișa clientului (intern, nu se afișează): de confirmat înainte de lansare */
  pending?: string[];
};

export type ColorFamily = 'negru' | 'bleumarin' | 'gri' | 'bej-crem' | 'verde' | 'bordo-maro' | 'albastru-deschis';
export const COLOR_FAMILIES: { key: ColorFamily; label: string }[] = [
  { key: 'negru', label: 'Negru' },
  { key: 'bleumarin', label: 'Bleumarin' },
  { key: 'gri', label: 'Gri' },
  { key: 'bej-crem', label: 'Bej & crem' },
  { key: 'verde', label: 'Verde' },
  { key: 'bordo-maro', label: 'Bordo & maro' },
  { key: 'albastru-deschis', label: 'Bleu' },
];

/** DE CONFIRMAT CU CLIENTUL înainte de lansare. */
export const commerceConfig = {
  currency: 'RON' as const,
  /** Cost livrare (lei). 0 = gratuită. NECONFIRMAT. */
  shippingFee: 0,
  /** Supliment „Croit pe măsură” (lei). NECONFIRMAT pentru comenzi online. */
  customFitSurcharge: 0,
  /** Monogramă brodată pe căptușeală, gratuită. NECONFIRMAT. */
  monogramFree: true,
  maxQty: 5,
  /** 'demo' = plata e simulată. 'live' = Stripe / NETOPIA reale + webhook. */
  paymentMode: 'demo' as 'demo' | 'live',
};

/** Ce piese se pot croi pe măsură online. Pantofii și curelele se vând doar pe mărimi. */
export const isMtm = (g: GarmentType) => g === 'suit' || g === 'shirt';

export const CATEGORIES: { key: CategoryKey; label: string; title: string; intro: string; legacyUrl: string }[] = [
  { key: 'costume-ceremonie', label: 'Costume ceremonie', title: 'Costume de ceremonie', intro: `Costume în două sau trei piese, pentru mire, naș și seri de gală. Toate la ${formatRON(verified.prices.ceremonySuit)}, ajustate gratuit de croitorii casei.`, legacyUrl: 'https://www.cesarini.ro/costume-barbati-ceremonie/' },
  { key: 'costume-business-casual', label: 'Costume business', title: 'Costume business & casual', intro: `Costume în două sau trei piese, din lână sau amestec de lână, pentru birou, întâlniri și evenimente de zi. Toate la ${formatRON(verified.prices.businessSuit)}.`, legacyUrl: 'https://www.cesarini.ro/costume-business-casual/' },
  { key: 'camasi', label: 'Cămăși', title: 'Cămăși', intro: 'Cămăși de ceremonie și Oxford, pe mărime de guler sau croite pe măsurile tale.', legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/' },
  { key: 'pantofi', label: 'Pantofi', title: 'Pantofi Oxford', intro: 'Oxford din piele naturală de bovină, cu talpă din neolit și toc de 2,5 cm: negru mat sau semilucios, cu medalion ori pictați manual.', legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/' },
  { key: 'accesorii', label: 'Accesorii', title: 'Accesorii', intro: 'Curele din piele naturală. Cravatele, papioanele și butonii îi găsești în showroom.', legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/' },
];

export const OCCASIONS: { key: OccasionKey; label: string; short: string }[] = [
  { key: 'mire', label: 'Mire / Nuntă', short: 'Mire' },
  { key: 'nas', label: 'Naș & invitat VIP', short: 'Naș' },
  { key: 'gala', label: 'Gală / Black tie', short: 'Gală' },
  { key: 'business', label: 'Business', short: 'Business' },
];

const SHIRT_COLLARS = ['38', '39', '40', '41', '42', '43', '44', '45'];
/** NECONFIRMAT: lungimile de curea disponibile */
const BELT_LENGTHS = ['90', '95', '100', '105', '110', '115', '120'];
const LAUNCH = '2026-10-06';

const fp = (slug: string) => {
  const p = featuredProducts.find((x) => x.slug === slug);
  if (!p) throw new Error(`Produs lipsă în brand.ts: ${slug}`);
  return p;
};


/* ——— Produsele reale (fișele și pozele primite de la client, 18.10.2026) ——— */

const SUIT_SIZES_REAL = ['46', '48', '50', '52', '54', '56', '58'];
/** 38–45 apare în fișele pantofilor; la „negru mat” și „pictați manual” mărimile lipsesc din fișă (de confirmat) */
const SHOE_SIZES_REAL = ['38', '39', '40', '41', '42', '43', '44', '45'];
const ADDED = '2026-10-18';

const pics = (slug: string, alt: string, focal = '50% 28%'): Media[] =>
  (GALLERY[slug] ?? []).map((g, i) => ({ src: g.src, alt: i === 0 ? alt : `${alt}, fotografia ${i + 1}`, focal }));

type SuitRow = {
  slug: string; code: string; color: string; colorFamily: ColorFamily; pieces?: 2 | 3; composition?: string;
  /** varianta scurtă a culorii, pentru numele produsului (culoarea completă rămâne în detalii) */
  short?: string;
  extra?: string[]; badge?: 'Stoc limitat'; pending?: string[];
};

const PIECES_TXT = { 2: 'două piese: sacou și pantaloni', 3: 'trei piese: sacou, vestă și pantaloni' } as const;

function suit(kind: 'ceremonie' | 'business', r: SuitRow, rank: number): CommerceProduct {
  const ceremony = kind === 'ceremonie';
  const base = ceremony ? 'Costum de ceremonie' : 'Costum business';
  const name = `${base} ${r.short ?? r.color}`;
  const details = [
    r.pieces ? `Costum în ${PIECES_TXT[r.pieces]}` : null,
    r.composition ? `Compoziție: ${r.composition}` : null,
    `Culoare: ${r.color}`,
    ...(r.extra ?? []),
    `Mărimi ${SUIT_SIZES_REAL[0]} – ${SUIT_SIZES_REAL[SUIT_SIZES_REAL.length - 1]}`,
    `Model ${r.code}`,
  ].filter(Boolean) as string[];
  const lead = r.pieces && r.composition
    ? `${base} în ${r.pieces === 3 ? 'trei' : 'două'} piese, ${r.color}, din ${r.composition.toLowerCase()}. Ajustat gratuit de croitorii casei, după măsurile tale.`
    : `${base}, ${r.color}. Îl probezi în showroom-ul din Cluj, iar croitorii casei îl ajustează gratuit după măsurile tale.`;
  return {
    slug: r.slug,
    name,
    category: ceremony ? 'Costume de ceremonie' : 'Business & Casual',
    categoryKey: ceremony ? 'costume-ceremonie' : 'costume-business-casual',
    garment: 'suit',
    price: ceremony ? verified.prices.ceremonySuit : verified.prices.businessSuit,
    lead,
    details,
    occasions: ceremony ? ['mire', 'nas', 'gala'] : ['business', 'nas'],
    sizes: SUIT_SIZES_REAL,
    sizeSystem: 'EU',
    gallery: pics(r.slug, `${name}, model ${r.code}, Cesarini Cluj-Napoca`),
    legacyUrl: ceremony ? 'https://www.cesarini.ro/costume-barbati-ceremonie/' : 'https://www.cesarini.ro/costume-business-casual/',
    rank,
    addedAt: ADDED,
    code: r.code,
    color: r.color,
    colorFamily: r.colorFamily,
    pieces: r.pieces,
    composition: r.composition,
    badge: r.badge,
    pending: r.pending,
  };
}

const L100 = '100% lână';
const DET = 'Reverul sacoului este detașabil: costumul se poate purta și la evenimente care nu cer o ținută formală';
const NO_SHEET = ['fișa lipsește: compoziție, număr de piese', 'culoarea e citită din poze'];

/** Costume de ceremonie: 2.299 lei toate (nota clientului din folder). */
const CEREMONY: SuitRow[] = [
  { slug: 'costum-ceremonie-negru-c03', code: 'C03', color: 'negru', colorFamily: 'negru', pieces: 3, composition: L100 },
  { slug: 'costum-ceremonie-verde-inchis-c07', code: 'C07', color: 'verde închis, cu revere negre și pantalon negru', short: 'verde închis cu revere negre', colorFamily: 'verde', pieces: 3, composition: L100 },
  { slug: 'costum-ceremonie-alb-crem-c10', code: 'C10', color: 'alb-crem', colorFamily: 'bej-crem', pieces: 3, composition: L100, extra: [DET] },
  { slug: 'costum-ceremonie-verde-menta-c09', code: 'C09', color: 'verde pal, cu nuanțe de mentă', short: 'verde mentă', colorFamily: 'verde', pieces: 3, composition: L100, extra: [DET] },
  { slug: 'costum-ceremonie-gri-deschis-c11', code: 'C11', color: 'gri deschis', colorFamily: 'gri', pieces: 3, composition: L100, extra: [DET] },
  { slug: 'costum-ceremonie-gri-negru-c12', code: 'C12', color: 'gri și negru', colorFamily: 'gri', pieces: 3, composition: L100 },
  { slug: 'costum-ceremonie-negru-c04', code: 'C04', color: 'negru', colorFamily: 'negru', pieces: 2, composition: L100 },
  { slug: 'costum-ceremonie-negru-c08', code: 'C08', color: 'negru', colorFamily: 'negru', pieces: 2, composition: L100 },
  { slug: 'costum-ceremonie-bleumarin-c13', code: 'C13', color: 'bleumarin', colorFamily: 'bleumarin', pieces: 2, composition: L100 },
  { slug: 'costum-ceremonie-gri-c14', code: 'C14', color: 'gri', colorFamily: 'gri', pieces: 2, composition: L100, pending: ['doar 2 poze'] },
  { slug: 'costum-ceremonie-negru-c05', code: 'C05', color: 'negru', colorFamily: 'negru', pending: NO_SHEET },
  { slug: 'costum-ceremonie-bleumarin-c06', code: 'C06', color: 'bleumarin', colorFamily: 'bleumarin', pending: NO_SHEET },
  { slug: 'costum-ceremonie-verde-inchis-c15', code: 'C15', color: 'verde închis', colorFamily: 'verde', pending: NO_SHEET },
  { slug: 'costum-ceremonie-bordo-c16', code: 'C16', color: 'bordo, cu revere negre', colorFamily: 'bordo-maro', pending: NO_SHEET },
  { slug: 'costum-ceremonie-gri-c17', code: 'C17', color: 'gri, cu revere negre', colorFamily: 'gri', pending: NO_SHEET },
  { slug: 'costum-ceremonie-negru-c18', code: 'C18', color: 'negru', colorFamily: 'negru', pending: NO_SHEET },
];

/** Costume business & casual: 1.599 lei toate. Modelele 16–18 sunt „momentan indisponibile” (nu apar). */
const BUSINESS: SuitRow[] = [
  { slug: 'costum-business-bej-b02', code: 'B02', color: 'bej', colorFamily: 'bej-crem', pieces: 3, composition: '77% lână, 20% vâscoză, 3% licra' },
  { slug: 'costum-business-caramiziu-b15', code: 'B15', color: 'cărămiziu', colorFamily: 'bordo-maro', pieces: 3, composition: L100, badge: 'Stoc limitat' },
  { slug: 'costum-business-verde-menta-b04', code: 'B04', color: 'verde pal, mentă', short: 'verde mentă', colorFamily: 'verde', pieces: 3, composition: '77% lână, 20% vâscoză, 3% licra' },
  { slug: 'costum-business-gri-deschis-b05', code: 'B05', color: 'gri deschis', colorFamily: 'gri', pieces: 3, composition: '77% lână, 20% vâscoză, 3% licra' },
  { slug: 'costum-business-gri-dungi-b03', code: 'B03', color: 'gri deschis cu dungi fine', short: 'gri cu dungi fine', colorFamily: 'gri', pieces: 2, composition: '80% lână, 20% vâscoză' },
  { slug: 'costum-business-crem-b06', code: 'B06', color: 'crem', colorFamily: 'bej-crem', pieces: 2, composition: L100 },
  { slug: 'costum-business-crem-b07', code: 'B07', color: 'crem, sacou cu două rânduri de nasturi', short: 'crem la două rânduri', colorFamily: 'bej-crem', pieces: 2, composition: '80% lână, 20% vâscoză', pending: ['„două rânduri de nasturi” e citit din poze'] },
  { slug: 'costum-business-bleumarin-b09', code: 'B09', color: 'bleumarin', colorFamily: 'bleumarin', pieces: 2, composition: L100 },
  { slug: 'costum-business-bleumarin-b01', code: 'B01', color: 'bleumarin închis', colorFamily: 'bleumarin', pieces: 2, composition: L100, pending: ['culoarea lipsește din fișă (citită din poze)'] },
  { slug: 'costum-business-dungi-b10', code: 'B10', color: 'închis, cu dungi fine', colorFamily: 'bordo-maro', pieces: 2, composition: L100, pending: ['culoarea lipsește din fișă (pare maro închis în poze)'] },
  { slug: 'costum-business-bleumarin-b15-2', code: 'B15-2', color: 'bleumarin, cu nasturi aurii', colorFamily: 'bleumarin', pieces: 2, composition: L100, pending: ['culoarea lipsește din fișă (citită din poze)', 'clientul ar vrea poze mai noi'] },
  { slug: 'costum-business-bleumarin-b08', code: 'B08', color: 'bleumarin', colorFamily: 'bleumarin', pending: NO_SHEET },
  { slug: 'costum-business-bleu-b19', code: 'B19', color: 'bleu', colorFamily: 'albastru-deschis', badge: 'Stoc limitat', pending: NO_SHEET },
];

type ShoeRow = { slug: string; name: string; color: string; colorFamily: ColorFamily; extra?: string[]; occasions: OccasionKey[]; pending?: string[] };
const SHOES: ShoeRow[] = [
  { slug: 'pantofi-oxford-negru-semilucios', name: 'Pantofi Oxford negru semilucios', color: 'negru', colorFamily: 'negru', occasions: ['mire', 'nas', 'gala'] },
  { slug: 'pantofi-oxford-negru-mat', name: 'Pantofi Oxford negru mat', color: 'negru', colorFamily: 'negru', occasions: ['mire', 'nas', 'business'], pending: ['mărimile lipsesc din fișă (am pus 38–45, ca la ceilalți)', 'titlul din fișă spune „pictați manual … megru mat”'] },
  { slug: 'pantofi-oxford-medalion-negru', name: 'Pantofi Oxford cu medalion, negru', color: 'negru', colorFamily: 'negru', occasions: ['business', 'nas'] },
  { slug: 'pantofi-oxford-medalion-bordo', name: 'Pantofi Oxford cu medalion, bordo', color: 'bordo', colorFamily: 'bordo-maro', occasions: ['business', 'nas'] },
  { slug: 'pantofi-oxford-bordo-pictati-manual', name: 'Pantofi Oxford bordo, pictați manual', color: 'bordo', colorFamily: 'bordo-maro', extra: ['Pictați manual'], occasions: ['mire', 'nas'], pending: ['mărimile lipsesc din fișă (am pus 38–45, ca la ceilalți)'] },
];

function shoe(r: ShoeRow, rank: number): CommerceProduct {
  return {
    slug: r.slug,
    name: r.name,
    category: 'Pantofi Oxford',
    categoryKey: 'pantofi',
    garment: 'shoes',
    price: verified.prices.oxfordShoes,
    lead: 'Pantofi eleganți Oxford din piele naturală de bovină, căptușiți tot cu piele. Talpa din neolit oferă confort sporit. Potriviți evenimentelor formale.',
    details: ['Material: piele naturală 100%', 'Căptușeală din piele', 'Talpă: neolit', 'Model: Oxford', ...(r.extra ?? []), 'Toc: 2,5 cm', `Culoare: ${r.color}`, 'Mărimi 38 – 45'],
    occasions: r.occasions,
    sizes: SHOE_SIZES_REAL,
    sizeSystem: 'EU',
    gallery: pics(r.slug, `${r.name}, piele naturală, Cesarini`, '50% 50%'),
    legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/',
    rank,
    addedAt: ADDED,
    color: r.color,
    colorFamily: r.colorFamily,
    composition: 'piele naturală 100%',
    pending: r.pending,
  };
}

/** Cămășile și cureaua rămân cu pozele de stoc până primim fișele lor. */
const PLACEHOLDERS: CommerceProduct[] = [
  {
    slug: 'camasa-ceremonie-nasturi-ascunsi',
    name: fp('camasa-ceremonie-nasturi-ascunsi').name,
    category: 'Cămăși de ceremonie',
    categoryKey: 'camasi',
    garment: 'shirt',
    price: verified.prices.ceremonyShirt,
    lead: 'Cămașă de ceremonie cu nasturi ascunși sub o bandă: linie curată sub vestă și papion.',
    details: ['Nasturi ascunși', 'Pentru ceremonie și black tie'],
    occasions: ['mire', 'nas', 'gala'],
    sizes: SHIRT_COLLARS,
    sizeSystem: 'guler',
    gallery: [media.products.shirtHanger, media.products.shirtTable, media.atelier.rack],
    legacyUrl: fp('camasa-ceremonie-nasturi-ascunsi').legacyUrl,
    rank: 300,
    addedAt: LAUNCH,
  },
  {
    slug: 'camasa-ceremonie-clasica',
    name: 'Cămașă Ceremonie clasică',
    category: 'Cămăși de ceremonie',
    categoryKey: 'camasi',
    garment: 'shirt',
    price: verified.prices.ceremonyShirt,
    lead: 'Cămașa de ceremonie clasică, cu nasturi la vedere. Merge cu cravată sau papion.',
    details: ['Nasturi la vedere', 'Pentru ceremonie'],
    occasions: ['mire', 'nas'],
    sizes: SHIRT_COLLARS,
    sizeSystem: 'guler',
    gallery: [media.products.shirtTable, media.products.shirtHanger, media.atelier.rack],
    legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/',
    rank: 302,
    addedAt: LAUNCH,
  },
  {
    slug: 'camasa-ceremonie-nasturi-negri',
    name: 'Cămașă Ceremonie cu nasturi negri',
    category: 'Cămăși de ceremonie',
    categoryKey: 'camasi',
    garment: 'shirt',
    price: verified.prices.ceremonyShirt,
    lead: 'Cămașă albă de ceremonie cu nasturi negri: contrast discret sub un smoking sau un costum închis.',
    details: ['Nasturi negri', 'Pentru ceremonie și gală'],
    occasions: ['gala', 'mire'],
    sizes: SHIRT_COLLARS,
    sizeSystem: 'guler',
    gallery: [media.products.shirtHanger, media.atelier.rack, media.products.shirtTable],
    legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/',
    rank: 303,
    addedAt: LAUNCH,
  },
  {
    slug: 'camasa-oxford-white',
    name: fp('camasa-oxford-white').name,
    category: 'Cămăși business',
    categoryKey: 'camasi',
    garment: 'shirt',
    price: verified.prices.businessShirt,
    lead: 'Cămașă albă din bumbac Oxford, pentru business și casual.',
    details: ['Bumbac Oxford', 'Business & casual'],
    occasions: ['business'],
    sizes: SHIRT_COLLARS,
    sizeSystem: 'guler',
    gallery: [media.products.shirtTable, media.products.shirtHanger, media.atelier.rack],
    legacyUrl: fp('camasa-oxford-white').legacyUrl,
    rank: 301,
    addedAt: LAUNCH,
  },
  {
    slug: 'curea-piele-naturala',
    name: 'Curea din piele naturală',
    category: 'Accesorii',
    categoryKey: 'accesorii',
    garment: 'belt',
    price: verified.prices.leatherBelt,
    lead: 'Curea din piele naturală, pentru costum și pantalon de stofă.',
    details: ['Piele naturală'],
    occasions: ['business', 'mire', 'nas'],
    sizes: BELT_LENGTHS,
    sizeSystem: 'lungime',
    gallery: [media.atelier.boutique, media.atelier.ties],
    legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/',
    rank: 500,
    addedAt: LAUNCH,
  },
];

export const commerceProducts: CommerceProduct[] = [
  ...CEREMONY.map((r, i) => suit('ceremonie', r, 100 + i)),
  ...BUSINESS.map((r, i) => suit('business', r, 200 + i)),
  ...PLACEHOLDERS,
  ...SHOES.map((r, i) => shoe(r, 400 + i)),
];

export const getProduct = (slug: string) => commerceProducts.find((p) => p.slug === slug);
export const getCategory = (key: string) => CATEGORIES.find((c) => c.key === key);
export const productHref = (slug: string) => `/produs/${slug}`;
export const categoryHref = (key: CategoryKey) => `/colectii/${key}`;
export const sizeLabel = (p: Pick<CommerceProduct, 'sizeSystem'>, size: string) =>
  p.sizeSystem === 'guler' ? `Guler ${size}` : p.sizeSystem === 'lungime' ? `Lungime ${size} cm` : `Mărime ${size}`;
export const sizeHeading = (p: Pick<CommerceProduct, 'sizeSystem'>) =>
  p.sizeSystem === 'guler' ? 'Mărimea gulerului (cm)' : p.sizeSystem === 'lungime' ? 'Lungime (cm)' : 'Mărime (EU)';
