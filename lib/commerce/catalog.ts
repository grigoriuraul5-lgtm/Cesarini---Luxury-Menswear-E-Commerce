/**
 * CESARINI — catalogul magazinului online (PLP, PDP, coș, checkout).
 *
 * Numele și prețurile vin din `lib/brand.ts` → `verified` (confirmate pe cesarini.ro).
 * Ocaziile (`occasions`) sunt etichete editoriale pentru filtre: ajută clientul să aleagă, NU sunt fapte în JSON-LD.
 * `commerceConfig` conține deciziile comerciale NOI, încă NECONFIRMATE de client.
 */
import { verified, formatRON } from '@/lib/brand';
import { media, type Media } from '@/lib/media';
import { GALLERY } from './gallery';
import { GALLERY_NOV, BELT_GUIDE } from './gallery-noiembrie';

export type GarmentType = 'suit' | 'shirt' | 'shoes' | 'belt' | 'socks';
export type CategoryKey = 'costume-ceremonie' | 'costume-business-casual' | 'camasi' | 'pantofi' | 'accesorii';
/** Ocaziile din pagina Colecții (19.11.2026, textul clientului): 3 în loc de 4. */
export type OccasionKey = 'mire' | 'ceremonii' | 'business';

/** Un bloc din descrierea lungă a produsului (textul clientului), cu titlu opțional. */
export type Section = { title?: string; paragraphs: string[] };

export type CommerceProduct = {
  slug: string;
  name: string;
  /** eticheta de categorie afișată (mai fină decât `categoryKey`) */
  category: string;
  categoryKey: CategoryKey;
  garment: GarmentType;
  price: number;
  lead: string;
  /** descrierea completă din fișa clientului, afișată pe pagina produsului */
  description?: Section[];
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

export type ColorFamily = 'negru' | 'alb' | 'bleumarin' | 'gri' | 'bej-crem' | 'verde' | 'bordo-maro' | 'albastru-deschis';
export const COLOR_FAMILIES: { key: ColorFamily; label: string }[] = [
  { key: 'negru', label: 'Negru' },
  { key: 'alb', label: 'Alb' },
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
  { key: 'camasi', label: 'Cămăși', title: 'Cămăși', intro: 'Cămăși albe și negre din 100% bumbac, Slim Fit, cu nasturi ascunși: pentru papion, cravată sau butoni. Pe mărime de guler sau croite pe măsurile tale.', legacyUrl: 'https://www.cesarini.ro/camasi-barbati-ceremonie/' },
  { key: 'pantofi', label: 'Pantofi', title: 'Pantofi Oxford', intro: 'Oxford din piele naturală de bovină, cu talpă din neolit și toc de 2,5 cm: negru mat sau semilucios, cu medalion ori pictați manual, și pe calapod lat.', legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/' },
  { key: 'accesorii', label: 'Accesorii', title: 'Accesorii', intro: 'Curele din piele naturală, reglabile între 105 și 135 cm, și șosete din bambus. Cravatele, papioanele și butonii îi găsești în showroom.', legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/' },
];

export const OCCASIONS: { key: OccasionKey; label: string; short: string; note: string }[] = [
  { key: 'mire', label: 'Mire / Naș', short: 'Mire și naș', note: 'Costume elegante pentru miri și nași, create pentru cele mai importante momente.' },
  { key: 'ceremonii', label: 'Ceremonii / Evenimente', short: 'Ceremonii și evenimente', note: 'Costume pentru invitați la nunți, botezuri, gale și alte evenimente speciale.' },
  { key: 'business', label: 'Business / Casual', short: 'Business și casual', note: 'Costume pentru birou, întâlniri de afaceri și ținute elegante pentru fiecare zi.' },
];

const SHIRT_COLLARS = ['38', '39', '40', '41', '42', '43', '44', '45'];


/* ——— Produsele reale (fișele și pozele primite de la client, 18.10.2026) ——— */

const SUIT_SIZES_REAL = ['46', '48', '50', '52', '54', '56', '58'];
/** 38–45 apare în fișele pantofilor; la „negru mat” și „pictați manual” mărimile lipsesc din fișă (de confirmat) */
const SHOE_SIZES_REAL = ['38', '39', '40', '41', '42', '43', '44', '45'];
const ADDED = '2026-10-18';

const pics = (slug: string, alt: string, focal = '50% 28%'): Media[] =>
  (GALLERY[slug] ?? GALLERY_NOV[slug] ?? []).map((g, i) => ({ src: g.src, alt: i === 0 ? alt : `${alt}, fotografia ${i + 1}`, focal }));

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
    occasions: ceremony ? ['mire', 'ceremonii'] : ['business', 'ceremonii'],
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

type ShoeRow = { slug: string; name: string; color: string; colorFamily: ColorFamily; extra?: string[]; occasions: OccasionKey[]; pending?: string[]; lead?: string; addedAt?: string };
const SHOES: ShoeRow[] = [
  { slug: 'pantofi-oxford-negru-semilucios', name: 'Pantofi Oxford negru semilucios', color: 'negru', colorFamily: 'negru', occasions: ['mire', 'ceremonii'] },
  { slug: 'pantofi-oxford-negru-mat', name: 'Pantofi Oxford negru mat', color: 'negru', colorFamily: 'negru', occasions: ['mire', 'ceremonii', 'business'], pending: ['mărimile lipsesc din fișă (am pus 38–45, ca la ceilalți)', 'titlul din fișă spune „pictați manual … megru mat”'] },
  { slug: 'pantofi-oxford-medalion-negru', name: 'Pantofi Oxford cu medalion, negru', color: 'negru', colorFamily: 'negru', occasions: ['business', 'ceremonii'] },
  { slug: 'pantofi-oxford-medalion-bordo', name: 'Pantofi Oxford cu medalion, bordo', color: 'bordo', colorFamily: 'bordo-maro', occasions: ['business', 'ceremonii'] },
  { slug: 'pantofi-oxford-bordo-pictati-manual', name: 'Pantofi Oxford bordo, pictați manual', color: 'bordo', colorFamily: 'bordo-maro', extra: ['Pictați manual'], occasions: ['mire', 'ceremonii'], pending: ['mărimile lipsesc din fișă (am pus 38–45, ca la ceilalți)'] },
  // Calapod lat (19.11.2026): fișa e goală → prețul, mărimile și specificațiile sunt cele ale Oxford-ului standard (de confirmat)
  { slug: 'pantofi-oxford-negru-semilucios-calapod-lat', name: 'Pantofi Oxford negru semilucios, calapod lat', color: 'negru', colorFamily: 'negru', extra: ['Calapod lat'], occasions: ['mire', 'ceremonii'], addedAt: '2026-11-19',
    lead: 'Pantofi eleganți Oxford pe calapod lat, din piele naturală de bovină, căptușiți tot cu piele, cu finisaj semilucios. Calapodul lat lasă mai mult loc în lățime, pentru confort pe tot parcursul evenimentului.',
    pending: ['fișa lipsește: preț, mărimi și specificații preluate de la Oxford-ul standard'] },
  { slug: 'pantofi-oxford-negru-mat-calapod-lat', name: 'Pantofi Oxford negru mat, calapod lat', color: 'negru', colorFamily: 'negru', extra: ['Calapod lat'], occasions: ['mire', 'ceremonii', 'business'], addedAt: '2026-11-19',
    lead: 'Pantofi eleganți Oxford pe calapod lat, din piele naturală de bovină, căptușiți tot cu piele, cu finisaj mat. Calapodul lat lasă mai mult loc în lățime, pentru confort pe tot parcursul zilei.',
    pending: ['fișa lipsește: preț, mărimi și specificații preluate de la Oxford-ul standard'] },
];

function shoe(r: ShoeRow, rank: number): CommerceProduct {
  return {
    slug: r.slug,
    name: r.name,
    category: 'Pantofi Oxford',
    categoryKey: 'pantofi',
    garment: 'shoes',
    price: verified.prices.oxfordShoes,
    lead: r.lead ?? 'Pantofi eleganți Oxford din piele naturală de bovină, căptușiți tot cu piele. Talpa din neolit oferă confort sporit. Potriviți evenimentelor formale.',
    details: ['Material: piele naturală 100%', 'Căptușeală din piele', 'Talpă: neolit', 'Model: Oxford', ...(r.extra ?? []), 'Toc: 2,5 cm', `Culoare: ${r.color}`, 'Mărimi 38 – 45'],
    occasions: r.occasions,
    sizes: SHOE_SIZES_REAL,
    sizeSystem: 'EU',
    gallery: pics(r.slug, `${r.name}, piele naturală, Cesarini`, '50% 50%'),
    legacyUrl: 'https://www.cesarini.ro/pantofi-barbati/',
    rank,
    addedAt: r.addedAt ?? ADDED,
    color: r.color,
    colorFamily: r.colorFamily,
    composition: 'piele naturală 100%',
    pending: r.pending,
  };
}

/* ——— Cămăși, curele și șosete: fișele și pozele clientului (19.11.2026) ——— */

const ADDED_NOV = '2026-11-19';
/** Mărimile cămășilor lipsesc din fișe: păstrăm gulerul 38–45 (de confirmat). */
const SHIRT_SIZES_PENDING = 'mărimile lipsesc din fișă (am păstrat gulerul 38–45)';


type AccessoryRow = {
  slug: string; name: string; category: string; categoryKey: CategoryKey; garment: GarmentType;
  price: number; color: string; colorFamily: ColorFamily; composition?: string;
  lead: string; description: Section[]; details: string[];
  occasions: OccasionKey[]; sizes: string[]; sizeSystem: CommerceProduct['sizeSystem'];
  legacyUrl: string; alt: string; withBeltGuide?: boolean; pending?: string[];
};

function accessory(r: AccessoryRow, rank: number): CommerceProduct {
  const gallery = pics(r.slug, r.alt, '50% 50%');
  if (r.withBeltGuide) gallery.push({ src: BELT_GUIDE.src, alt: 'Ghid mărimi curea Cesarini: lungimea se măsoară de la capătul cataramei până la vârful curelei, 105 – 135 cm', focal: '50% 50%' });
  return {
    slug: r.slug, name: r.name, category: r.category, categoryKey: r.categoryKey, garment: r.garment,
    price: r.price, lead: r.lead, description: r.description, details: r.details, occasions: r.occasions,
    sizes: r.sizes, sizeSystem: r.sizeSystem, gallery, legacyUrl: r.legacyUrl, rank, addedAt: ADDED_NOV,
    color: r.color, colorFamily: r.colorFamily, composition: r.composition, pending: r.pending,
  };
}

const SHIRT_URL = 'https://www.cesarini.ro/camasi-barbati-ceremonie/';

const SHIRTS: AccessoryRow[] = [
  {
    slug: 'camasa-alba-nasturi-ascunsi',
    name: 'Cămașă albă Slim Fit cu nasturi ascunși',
    category: 'Cămăși de ceremonie', categoryKey: 'camasi', garment: 'shirt',
    price: verified.prices.ceremonyShirt, color: 'alb', colorFamily: 'alb', composition: '100% bumbac',
    lead: 'Cămașă bărbătească elegantă Cesarini, realizată din 100% bumbac, ideală pentru ținutele de ceremonie, evenimente speciale și ocazii formale. Culoarea albă și designul rafinat o transformă într-o piesă esențială în garderoba masculină, fiind ușor de asortat cu un costum elegant sau un smoking.',
    description: [{ paragraphs: [
      'Modelul este prevăzut cu un guler clasic elegant, potrivit pentru purtarea cu cravată sau fără accesorii, în funcție de stilul dorit. Închiderea cu nasturi ascunși oferă un aspect curat și sofisticat, evidențiind linia minimalistă a cămășii. Manșetele pentru butoni completează designul elegant și sunt ideale pentru ținutele formale, în care atenția la detalii face diferența.',
      'Croiala Slim Fit oferă o siluetă modernă și bine definită, iar materialul din bumbac natural asigură confort la purtare. Această cămașă albă Cesarini este alegerea potrivită pentru bărbații care apreciază eleganța clasică și un stil impecabil.',
      'Cesarini – eleganță și rafinament pentru momentele care contează.',
    ] }],
    details: ['Brand: Cesarini', 'Culoare: alb', 'Material: 100% bumbac', 'Croială: Slim Fit', 'Guler: clasic', 'Închidere: nasturi ascunși', 'Manșete: pentru butoni', 'Întreținere: spălare la 30°C'],
    occasions: ['mire', 'ceremonii'], sizes: SHIRT_COLLARS, sizeSystem: 'guler', legacyUrl: SHIRT_URL,
    alt: 'Cămașă albă Cesarini Slim Fit cu nasturi ascunși și manșete pentru butoni',
    pending: [SHIRT_SIZES_PENDING, 'poza cu modelul (modificată cu AI) e pusă deoparte până confirmă Mihai'],
  },
  {
    slug: 'camasa-alba-papion',
    name: 'Cămașă albă pentru papion, Slim Fit',
    category: 'Cămăși de ceremonie', categoryKey: 'camasi', garment: 'shirt',
    price: verified.prices.ceremonyShirt, color: 'alb', colorFamily: 'alb', composition: '100% bumbac',
    lead: 'Cămașă bărbătească elegantă Cesarini, realizată din 100% bumbac, ideală pentru ținutele de ceremonie și evenimentele speciale. Culoarea albă și designul rafinat o transformă într-o alegere excelentă pentru miri, nași și bărbații care își doresc o apariție impecabilă la nunți, gale sau alte ocazii elegante.',
    description: [{ paragraphs: [
      'Modelul este prevăzut cu un guler pentru papion, conceput pentru a completa armonios ținutele formale, în special cele purtate cu smoking. Închiderea cu nasturi ascunși oferă un aspect curat și sofisticat, iar manșetele pentru butoni adaugă un plus de eleganță și rafinament.',
      'Croiala Slim Fit evidențiază silueta și oferă un aspect modern, bine definit. Materialul din bumbac natural asigură confort la purtare, fiind potrivit pentru evenimentele în care eleganța și atenția la detalii sunt esențiale.',
      'Această cămașă albă Cesarini, cu guler pentru papion, este alegerea ideală pentru completarea unei ținute de mire sau a unui outfit elegant cu smoking, oferind un echilibru între stilul clasic și rafinamentul contemporan.',
      'Cesarini – eleganță și rafinament pentru momentele care contează.',
    ] }],
    details: ['Brand: Cesarini', 'Culoare: alb', 'Material: 100% bumbac', 'Croială: Slim Fit', 'Guler: pentru papion', 'Închidere: nasturi ascunși', 'Manșete: pentru butoni', 'Întreținere: spălare la 30°C'],
    occasions: ['mire', 'ceremonii'], sizes: SHIRT_COLLARS, sizeSystem: 'guler', legacyUrl: SHIRT_URL,
    alt: 'Cămașă albă Cesarini pentru papion, Slim Fit, cu manșete pentru butoni',
    pending: [SHIRT_SIZES_PENDING],
  },
  {
    slug: 'camasa-neagra-butoni',
    name: 'Cămașă neagră elegantă Slim Fit, manșete pentru butoni',
    category: 'Cămăși elegante', categoryKey: 'camasi', garment: 'shirt',
    price: verified.prices.ceremonyShirt, color: 'negru', colorFamily: 'negru', composition: '100% bumbac',
    lead: 'Cămașă bărbătească elegantă Cesarini, realizată din 100% bumbac, ideală pentru ținutele de ceremonie, evenimente speciale și ocazii formale. Culoarea neagră și designul rafinat o transformă într-o piesă esențială în garderoba masculină, fiind ușor de asortat cu un costum elegant sau un smoking.',
    description: [{ paragraphs: [
      'Modelul este prevăzut cu un guler clasic elegant, potrivit pentru purtarea cu cravată sau fără accesorii, în funcție de stilul dorit. Închiderea cu nasturi ascunși oferă un aspect curat și sofisticat, evidențiind linia minimalistă a cămășii. Manșetele pentru butoni completează designul elegant și sunt ideale pentru ținutele formale, în care atenția la detalii face diferența.',
      'Croiala Slim Fit oferă o siluetă modernă și bine definită, iar materialul din bumbac natural asigură confort la purtare. Această cămașă neagră Cesarini este alegerea potrivită pentru bărbații care apreciază eleganța clasică și un stil impecabil.',
      'Cesarini – eleganță și rafinament pentru momentele care contează.',
    ] }],
    details: ['Brand: Cesarini', 'Culoare: negru', 'Material: 100% bumbac', 'Croială: Slim Fit', 'Guler: clasic', 'Închidere: nasturi ascunși', 'Manșete: pentru butoni', 'Întreținere: spălare la 30°C'],
    occasions: ['ceremonii', 'business'], sizes: SHIRT_COLLARS, sizeSystem: 'guler', legacyUrl: SHIRT_URL,
    alt: 'Cămașă neagră Cesarini Slim Fit cu nasturi ascunși și manșete pentru butoni',
    pending: [SHIRT_SIZES_PENDING, 'folderele „Camsa neagra” și „Cămașă Neagră Elegantă” aveau același titlu, preț și descriere: le-am unit într-un singur produs', 'poza cu modelul (modificată cu AI) e pusă deoparte până confirmă Mihai'],
  },
  {
    slug: 'camasa-neagra-cravata',
    name: 'Cămașă neagră Slim Fit, guler pentru cravată',
    category: 'Cămăși elegante', categoryKey: 'camasi', garment: 'shirt',
    price: verified.prices.blackShirtTie, color: 'negru', colorFamily: 'negru', composition: '100% bumbac',
    lead: 'Cămașă bărbătească elegantă Cesarini, într-o nuanță clasică de negru, ideală pentru ținutele elegante, evenimentele speciale și ocaziile formale. Designul rafinat și culoarea versatilă o transformă într-o piesă ușor de asortat cu un costum elegant, fiind potrivită atât pentru evenimente de seară, cât și pentru întâlniri de afaceri sau alte ocazii speciale.',
    description: [{ paragraphs: [
      'Modelul este prevăzut cu un guler pentru cravată, care completează armonios ținutele elegante și permite accesorizarea cu o cravată în nuanțe clasice sau contrastante. Închiderea cu nasturi ascunși oferă un aspect uniform și sofisticat, evidențiind designul minimalist al cămășii.',
      'Croiala Slim Fit oferă o siluetă modernă și bine definită, iar cămașa neagră Cesarini este alegerea potrivită pentru bărbații care apreciază eleganța, stilul contemporan și atenția la detalii.',
      'Cesarini – eleganță și rafinament pentru fiecare apariție.',
    ] }],
    details: ['Brand: Cesarini', 'Culoare: negru', 'Material: 100% bumbac', 'Croială: Slim Fit', 'Guler: pentru cravată', 'Închidere: nasturi ascunși', 'Manșete: cu nasturi', 'Întreținere: spălare la 30°C'],
    occasions: ['ceremonii', 'business'], sizes: SHIRT_COLLARS, sizeSystem: 'guler', legacyUrl: SHIRT_URL,
    alt: 'Cămașă neagră Cesarini Slim Fit cu guler pentru cravată și manșete cu nasturi',
    pending: [SHIRT_SIZES_PENDING],
  },
];

/** Textul comun al curelelor (fișele clientului diferă doar prin culoare și recomandarea de purtare). */
const BELT_LENGTH: Section = {
  title: 'Cum alegi lungimea potrivită?',
  paragraphs: [
    'Lungimea curelei se măsoară în centimetri, de la capătul cataramei până la vârful curelei, fără a include catarama în măsurătoare.',
    'Alege lungimea potrivită taliei tale. Cureaua poate fi scurtată prin îndepărtarea cataramei, ajustarea lungimii și remontarea acesteia. Astfel, poți obține o potrivire adaptată nevoilor tale, în intervalul de lungimi disponibil, de la 105 cm la 135 cm.',
  ],
};
const beltDetails = (color: string) => ['Brand: Cesarini', 'Material: piele naturală', `Culoare: ${color}`, 'Cataramă: metalică, cu închidere clasică cu pin', 'Lățime: 3,5 cm', 'Lungime: 105 – 135 cm, se scurtează pe talia ta', 'Ajustare: cureaua poate fi scurtată pentru a se potrivi taliei', 'Stil: elegant și smart-casual'];
const BELT_URL = 'https://www.cesarini.ro/accesorii-barbati/';
/** O singură lungime, reglabilă: cureaua se scurtează pe talie (fișele clientului). */
const BELT_SIZES = ['105–135'];

type BeltRow = {
  slug: string; name: string; color: string; nuance: string; colorFamily: ColorFamily; intro2: string; wear: string[]; occasions: OccasionKey[];
  /** formulările proprii din fișa bordo (diferă puțin de celelalte trei) */
  own?: { finish?: string; adjust?: string; length2?: string };
};
const BELTS: BeltRow[] = [
  {
    slug: 'curea-piele-neagra', name: 'Curea din piele naturală neagră', color: 'negru', nuance: 'neagră', colorFamily: 'negru',
    intro2: 'Nuanța neagră oferă un aspect rafinat și versatil, fiind ușor de asortat atât cu pantalonii eleganți, cât și cu ținutele smart-casual.',
    wear: ['Cureaua neagră Cesarini poate fi asortată cu pantaloni eleganți, costume în nuanțe de negru, bleumarin sau gri și pantofi negri din piele, pentru o apariție armonioasă și rafinată. Este un accesoriu potrivit pentru evenimente speciale, întâlniri de afaceri și ținute smart-casual în care detaliile fac diferența.', 'Alege cureaua bărbătească Cesarini din piele naturală, în culoarea neagră, pentru un plus de stil și eleganță în fiecare zi.'],
    occasions: ['business', 'ceremonii', 'mire'],
  },
  {
    slug: 'curea-piele-negru-semilucios', name: 'Curea din piele naturală negru semilucios', color: 'negru semilucios', nuance: 'negru semilucios', colorFamily: 'negru',
    intro2: 'Finisajul semilucios oferă un aspect rafinat și discret, fiind ușor de asortat atât cu pantalonii eleganți, cât și cu ținutele smart-casual.',
    wear: ['Cureaua negru semilucios Cesarini poate fi asortată cu pantaloni eleganți, costume în nuanțe de negru, bleumarin sau gri și pantofi negri din piele. Finisajul semilucios completează armonios ținutele formale și oferă un plus de rafinament aparițiilor masculine. Este un accesoriu potrivit pentru evenimente speciale, întâlniri de afaceri și ținute smart-casual în care detaliile fac diferența.', 'Alege cureaua bărbătească Cesarini din piele naturală, în nuanța negru semilucios, pentru un plus de stil și eleganță în fiecare zi.'],
    occasions: ['mire', 'ceremonii'],
  },
  {
    slug: 'curea-piele-bordo', name: 'Curea din piele naturală bordo', color: 'bordo', nuance: 'bordo', colorFamily: 'bordo-maro',
    intro2: 'Nuanța bordo oferă un plus de personalitate ținutelor masculine și se asortează cu ușurință atât cu pantaloni eleganți, cât și cu ținute smart-casual.',
    wear: ['Cureaua bordo Cesarini poate fi asortată cu pantaloni eleganți, costume în nuanțe de bleumarin sau gri și pantofi în tonuri complementare. Este un accesoriu potrivit pentru evenimente speciale, întâlniri de afaceri și ținute smart-casual în care detaliile fac diferența.', 'Alege cureaua bărbătească Cesarini din piele naturală, în culoarea bordo, pentru un plus de stil și eleganță în fiecare zi.'],
    occasions: ['ceremonii', 'business'],
    own: {
      finish: 'aspectul său rafinat',
      adjust: 'Un avantaj practic este posibilitatea de scurtare a curelei, astfel încât lungimea să poată fi adaptată în funcție de talie, pentru o potrivire confortabilă.',
      length2: 'Alege lungimea potrivită taliei tale. Cureaua poate fi scurtată prin îndepărtarea cataramei, ajustarea lungimii și remontarea acesteia. Lungimea poate fi adaptată în intervalul de 105–135 cm, în funcție de dimensiunea inițială a curelei.',
    },
  },
  {
    slug: 'curea-piele-gri', name: 'Curea din piele naturală gri', color: 'gri', nuance: 'gri', colorFamily: 'gri',
    intro2: 'Nuanța gri oferă un aspect modern și rafinat, fiind ușor de asortat atât cu pantalonii eleganți, cât și cu ținutele smart-casual.',
    wear: ['Cureaua gri Cesarini poate fi asortată cu pantaloni eleganți, costume în nuanțe de negru, bleumarin sau gri și pantofi din piele în tonuri complementare. Este un accesoriu potrivit pentru evenimente speciale, întâlniri de afaceri și ținute smart-casual în care detaliile fac diferența.', 'Alege cureaua bărbătească Cesarini din piele naturală, în culoarea gri, pentru un plus de stil și eleganță în fiecare zi.'],
    occasions: ['business', 'ceremonii'],
  },
];

const beltRow = (b: BeltRow): AccessoryRow => ({
  slug: b.slug, name: b.name, category: 'Curele', categoryKey: 'accesorii', garment: 'belt',
  price: verified.prices.leatherBelt, color: b.color, colorFamily: b.colorFamily, composition: 'piele naturală',
  lead: `Completează-ți ținutele cu o curea bărbătească Cesarini din piele naturală, în culoarea ${b.nuance}, un accesoriu elegant care îmbină stilul clasic cu funcționalitatea. ${b.intro2}`,
  description: [
    { paragraphs: [
      `Realizată din piele naturală, cureaua se remarcă prin ${b.own?.finish ?? (b.slug === 'curea-piele-negru-semilucios' ? 'finisajul său semilucios' : 'aspectul rafinat')} și catarama metalică elegantă, cu închidere clasică cu pin. Cu o lățime de 3,5 cm, completează armonios pantalonii de costum și alte piese vestimentare din garderoba bărbatului modern.`,
      b.own?.adjust ?? 'Un avantaj practic este posibilitatea de scurtare a curelei, care permite ajustarea lungimii în funcție de talie, pentru o potrivire confortabilă.',
    ] },
    b.own?.length2 ? { title: BELT_LENGTH.title, paragraphs: [BELT_LENGTH.paragraphs[0], b.own.length2] } : BELT_LENGTH,
    { title: 'Recomandare de purtare', paragraphs: b.wear },
  ],
  details: beltDetails(b.color),
  occasions: b.occasions, sizes: BELT_SIZES, sizeSystem: 'lungime', legacyUrl: BELT_URL,
  alt: `${b.name}, cataramă metalică, lățime 3,5 cm, Cesarini`, withBeltGuide: true,
});

type SockRow = { slug: string; name: string; color: string; nuance: string; colorFamily: ColorFamily; wear: string };
const SOCKS: SockRow[] = [
  { slug: 'sosete-bambus-negre', name: 'Șosete din bambus negre, 41–44', color: 'negru', nuance: 'neagră', colorFamily: 'negru',
    wear: 'Potrivite pentru costume elegante, ținute office și combinații casual, șosetele negre Cesarini completează discret garderoba oricărui bărbat. Culoarea neagră este o alegere clasică și versatilă, ușor de asortat cu costume negre, gri sau bleumarin, fiind ideală pentru evenimente formale, întâlniri de afaceri și purtarea zilnică.' },
  { slug: 'sosete-bambus-bleumarin', name: 'Șosete din bambus bleumarin, 41–44', color: 'bleumarin', nuance: 'bleumarin', colorFamily: 'bleumarin',
    wear: 'Potrivite pentru costume elegante, ținute office și combinații casual, șosetele bleumarin Cesarini completează discret garderoba oricărui bărbat. Nuanța bleumarin se asortează ușor cu costumele în tonuri de albastru, gri sau bleumarin, fiind o alegere versatilă pentru ținutele business și de ceremonie.' },
];

const sockRow = (r: SockRow): AccessoryRow => ({
  slug: r.slug, name: r.name, category: 'Șosete', categoryKey: 'accesorii', garment: 'socks',
  price: verified.prices.bambooSocks, color: r.color, colorFamily: r.colorFamily, composition: '85% bambus, 13% poliamidă, 2% elastan',
  lead: `Completează-ți ținutele cu șosetele bărbătești Cesarini din bambus, în culoarea ${r.nuance}, concepute pentru confortul de zi cu zi și un aspect îngrijit. Materialul moale și plăcut la atingere, împreună cu detaliile atent realizate, le transformă într-un accesoriu practic, potrivit atât pentru ținutele elegante, cât și pentru cele casual.`,
  description: [
    { paragraphs: ['Datorită conținutului ridicat de fibră de bambus, șosetele oferă o senzație plăcută la purtare. Banda elastică confortabilă asigură o fixare optimă, fără presiune excesivă, iar călcâiul întărit și zonele supuse uzurii beneficiază de întăriri suplimentare pentru rezistență sporită. Vârful este finisat cu o cusătură plată, pentru un plus de confort.'] },
    { title: 'Recomandare de purtare', paragraphs: [r.wear, `Alege șosetele Cesarini din bambus, în culoarea ${r.nuance}, pentru un plus de confort și atenție la detalii, în fiecare zi.`] },
  ],
  details: ['Material: 85% bambus, 13% poliamidă, 2% elastan', `Culoare: ${r.color}`, 'Mărime: 41–44', 'Confort: bandă elastică confortabilă', 'Rezistență: călcâi și zone de uzură întărite', 'Finisaj: vârf cu cusătură plată', 'Întreținere: spălare la 30°C'],
  occasions: ['business', 'ceremonii'], sizes: ['41–44'], sizeSystem: 'EU', legacyUrl: 'https://www.cesarini.ro/accesorii-barbati/',
  alt: `Șosete bărbătești Cesarini din bambus, ${r.color}, mărimea 41–44, în ambalajul original`,
});

export const commerceProducts: CommerceProduct[] = [
  ...CEREMONY.map((r, i) => suit('ceremonie', r, 100 + i)),
  ...BUSINESS.map((r, i) => suit('business', r, 200 + i)),
  ...SHIRTS.map((r, i) => accessory(r, 300 + i)),
  ...SHOES.map((r, i) => shoe(r, 400 + i)),
  ...BELTS.map((b, i) => accessory(beltRow(b), 500 + i)),
  ...SOCKS.map((r, i) => accessory(sockRow(r), 520 + i)),
];

export const getProduct = (slug: string) => commerceProducts.find((p) => p.slug === slug);
export const getCategory = (key: string) => CATEGORIES.find((c) => c.key === key);
export const productHref = (slug: string) => `/produs/${slug}`;
export const categoryHref = (key: CategoryKey) => `/colectii/${key}`;
export const sizeLabel = (p: Pick<CommerceProduct, 'sizeSystem'>, size: string) =>
  p.sizeSystem === 'guler' ? `Guler ${size}` : p.sizeSystem === 'lungime' ? `Lungime ${size} cm` : `Mărime ${size}`;
export const sizeHeading = (p: Pick<CommerceProduct, 'sizeSystem'>) =>
  p.sizeSystem === 'guler' ? 'Mărimea gulerului (cm)' : p.sizeSystem === 'lungime' ? 'Lungime (cm)' : 'Mărime (EU)';
