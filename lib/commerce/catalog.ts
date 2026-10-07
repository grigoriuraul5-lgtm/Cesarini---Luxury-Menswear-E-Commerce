/**
 * CESARINI — catalogul magazinului online (PLP, PDP, coș, checkout).
 *
 * Numele și prețurile vin din `lib/brand.ts` → `verified` (confirmate pe cesarini.ro).
 * Ocaziile (`occasions`) sunt etichete editoriale pentru filtre: ajută clientul să aleagă, NU sunt fapte în JSON-LD.
 * `commerceConfig` conține deciziile comerciale NOI, încă NECONFIRMATE de client.
 */
import { verified, featuredProducts } from '@/lib/brand';
import { media, type Media } from '@/lib/media';

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
};

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
  { key: 'costume-ceremonie', label: 'Costume ceremonie', title: 'Costume de ceremonie', intro: `Trei piese din ${verified.ceremonySuitSpec.fabric}, pentru mire, naș și seri de gală.`, legacyUrl: 'https://www.cesarini.ro/costume-barbati-ceremonie/' },
  { key: 'costume-business-casual', label: 'Costume business', title: 'Costume business & casual', intro: 'Croială modernă, pentru birou, întâlniri și evenimente de zi.', legacyUrl: 'https://www.cesarini.ro/costume-business-casual/' },
  { key: 'camasi', label: 'Cămăși', title: 'Cămăși', intro: 'Cămăși de ceremonie și Oxford, pe mărime de guler sau croite pe măsurile tale.', legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/' },
  { key: 'pantofi', label: 'Pantofi', title: 'Pantofi Oxford', intro: 'Oxford lucios, mat sau cu medalion: pantoful care închide ținuta.', legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/' },
  { key: 'accesorii', label: 'Accesorii', title: 'Accesorii', intro: 'Curele din piele naturală. Cravatele, papioanele și butonii îi găsești în showroom.', legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/' },
];

export const OCCASIONS: { key: OccasionKey; label: string; short: string }[] = [
  { key: 'mire', label: 'Mire / Nuntă', short: 'Mire' },
  { key: 'nas', label: 'Naș & invitat VIP', short: 'Naș' },
  { key: 'gala', label: 'Gală / Black tie', short: 'Gală' },
  { key: 'business', label: 'Business', short: 'Business' },
];

const SUIT_SIZES = ['46', '48', '50', '52', '54', '56'];
const SHIRT_COLLARS = ['38', '39', '40', '41', '42', '43', '44', '45'];
/** NECONFIRMAT: mărimile de pantofi și lungimile de curea disponibile */
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44', '45', '46'];
const BELT_LENGTHS = ['90', '95', '100', '105', '110', '115', '120'];
const LAUNCH = '2026-10-06';

const fp = (slug: string) => {
  const p = featuredProducts.find((x) => x.slug === slug);
  if (!p) throw new Error(`Produs lipsă în brand.ts: ${slug}`);
  return p;
};

export const commerceProducts: CommerceProduct[] = [
  {
    slug: 'costum-ceremonie',
    name: fp('costum-ceremonie').name,
    category: 'Costume de ceremonie',
    categoryKey: 'costume-ceremonie',
    garment: 'suit',
    price: verified.prices.ceremonySuit,
    lead: `Costum din trei piese (${verified.ceremonySuitSpec.pieces}), din ${verified.ceremonySuitSpec.fabric}. Pentru mire, naș și seri de gală.`,
    details: [`Trei piese: ${verified.ceremonySuitSpec.pieces}`, verified.ceremonySuitSpec.fabric, `Mărimi ${verified.ceremonySuitSpec.sizes}`, 'Ajustări gratuite în showroom'],
    occasions: ['mire', 'nas', 'gala'],
    sizes: [...SUIT_SIZES, '58'],
    sizeSystem: 'EU',
    gallery: [media.products.ceremonySuit, media.atelier.suitOnMannequin, media.atelier.fabricSwatches, media.atelier.tailorAtWork],
    legacyUrl: fp('costum-ceremonie').legacyUrl,
    rank: 1,
    addedAt: LAUNCH,
  },
  {
    slug: 'costum-business-casual',
    name: fp('costum-business-casual').name,
    category: 'Business & Casual',
    categoryKey: 'costume-business-casual',
    garment: 'suit',
    price: verified.prices.businessSuit,
    lead: 'Croială modernă, pentru birou, întâlniri și evenimente de zi.',
    details: ['Sacou și pantaloni', 'Croială modernă', 'Ajustări gratuite în showroom'],
    occasions: ['business', 'nas'],
    sizes: SUIT_SIZES,
    sizeSystem: 'EU',
    gallery: [media.products.businessSuit, media.products.blueJacket, media.atelier.fabricSwatches, media.atelier.cuttingFabric],
    legacyUrl: fp('costum-business-casual').legacyUrl,
    rank: 2,
    addedAt: LAUNCH,
  },
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
    rank: 3,
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
    rank: 6,
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
    rank: 7,
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
    rank: 4,
    addedAt: LAUNCH,
  },
  {
    slug: 'pantofi-oxford-negru-lucios',
    name: fp('pantofi-oxford-negru-lucios').name,
    category: 'Pantofi de ceremonie',
    categoryKey: 'pantofi',
    garment: 'shoes',
    price: verified.prices.oxfordShoes,
    lead: 'Oxford negru lucios: pantoful de ceremonie și de black tie.',
    details: ['Oxford, cu șiret', 'Finisaj lucios', 'Pentru ceremonie și gală'],
    occasions: ['mire', 'nas', 'gala'],
    sizes: SHOE_SIZES,
    sizeSystem: 'EU',
    gallery: [media.products.oxfordShoes, media.atelier.boutique],
    legacyUrl: fp('pantofi-oxford-negru-lucios').legacyUrl,
    rank: 5,
    addedAt: LAUNCH,
  },
  {
    slug: 'pantofi-oxford-mat',
    name: 'Pantofi Oxford mat',
    category: 'Pantofi',
    categoryKey: 'pantofi',
    garment: 'shoes',
    price: verified.prices.oxfordShoes,
    lead: 'Oxford cu finisaj mat, pentru costumele de zi și de business.',
    details: ['Oxford, cu șiret', 'Finisaj mat'],
    occasions: ['business', 'nas'],
    sizes: SHOE_SIZES,
    sizeSystem: 'EU',
    gallery: [media.products.oxfordShoes, media.atelier.boutique],
    legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/',
    rank: 8,
    addedAt: LAUNCH,
  },
  {
    slug: 'pantofi-oxford-medalion',
    name: 'Pantofi Oxford cu medalion',
    category: 'Pantofi',
    categoryKey: 'pantofi',
    garment: 'shoes',
    price: verified.prices.oxfordShoes,
    lead: 'Oxford cu medalion perforat pe vârf: un detaliu clasic pentru ținutele de zi.',
    details: ['Oxford, cu șiret', 'Medalion pe vârf'],
    occasions: ['business'],
    sizes: SHOE_SIZES,
    sizeSystem: 'EU',
    gallery: [media.products.oxfordShoes, media.atelier.boutique],
    legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/',
    rank: 9,
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
    rank: 10,
    addedAt: LAUNCH,
  },
];

export const getProduct = (slug: string) => commerceProducts.find((p) => p.slug === slug);
export const getCategory = (key: string) => CATEGORIES.find((c) => c.key === key);
export const productHref = (slug: string) => `/produs/${slug}`;
export const categoryHref = (key: CategoryKey) => `/colectii/${key}`;
export const sizeLabel = (p: Pick<CommerceProduct, 'sizeSystem'>, size: string) =>
  p.sizeSystem === 'guler' ? `Guler ${size}` : p.sizeSystem === 'lungime' ? `Lungime ${size} cm` : `Mărime ${size}`;
export const sizeHeading = (p: Pick<CommerceProduct, 'sizeSystem'>) =>
  p.sizeSystem === 'guler' ? 'Mărimea gulerului (cm)' : p.sizeSystem === 'lungime' ? 'Lungime (cm)' : 'Mărime (EU)';
