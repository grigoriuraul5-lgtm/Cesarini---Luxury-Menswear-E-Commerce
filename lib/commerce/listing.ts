/**
 * Filtrare, fațete și sortare pentru catalog (PLP). Funcții pure: aceleași pe server și în browser.
 * Starea filtrelor se oglindește în URL (?categorie=…&ocazie=…&croiala=…&sort=…) ca să poată fi trimisă ca link.
 */
import { CATEGORIES, COLOR_FAMILIES, OCCASIONS, commerceProducts, isMtm, type CategoryKey, type ColorFamily, type CommerceProduct, type OccasionKey } from './catalog';

export type FitKey = 'mtm' | 'standard';
export type SortKey = 'recomandate' | 'noutati' | 'pret-asc' | 'pret-desc';
export type PiecesKey = '2-piese' | '3-piese';
export type Filters = { categorie: CategoryKey[]; ocazie: OccasionKey[]; croiala: FitKey[]; culoare: ColorFamily[]; piese: PiecesKey[] };

export const EMPTY_FILTERS: Filters = { categorie: [], ocazie: [], croiala: [], culoare: [], piese: [] };

export const PIECES_OPTIONS: { key: PiecesKey; label: string; n: 2 | 3 }[] = [
  { key: '3-piese', label: 'Trei piese (cu vestă)', n: 3 },
  { key: '2-piese', label: 'Două piese', n: 2 },
];

export const FIT_OPTIONS: { key: FitKey; label: string }[] = [
  { key: 'mtm', label: 'Croit pe măsură disponibil' },
  { key: 'standard', label: 'Mărime standard' },
];

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recomandate', label: 'Recomandate' },
  { key: 'noutati', label: 'Noutăți' },
  { key: 'pret-asc', label: 'Preț crescător' },
  { key: 'pret-desc', label: 'Preț descrescător' },
];

/** Toate produsele se vând pe mărimi standard; costumele și cămășile și pe măsură. */
const fitsOf = (p: CommerceProduct): FitKey[] => (isMtm(p.garment) ? ['mtm', 'standard'] : ['standard']);

const match = (p: CommerceProduct, f: Filters, skip?: keyof Filters) =>
  (skip === 'categorie' || !f.categorie.length || f.categorie.includes(p.categoryKey)) &&
  (skip === 'ocazie' || !f.ocazie.length || f.ocazie.some((o) => p.occasions.includes(o))) &&
  (skip === 'croiala' || !f.croiala.length || f.croiala.every((c) => fitsOf(p).includes(c))) &&
  (skip === 'culoare' || !f.culoare.length || (!!p.colorFamily && f.culoare.includes(p.colorFamily))) &&
  (skip === 'piese' || !f.piese.length || f.piese.some((k) => PIECES_OPTIONS.find((o) => o.key === k)?.n === p.pieces));

export function applyFilters(f: Filters, sort: SortKey, products = commerceProducts) {
  const list = products.filter((p) => match(p, f));
  const by: Record<SortKey, (a: CommerceProduct, b: CommerceProduct) => number> = {
    recomandate: (a, b) => a.rank - b.rank,
    noutati: (a, b) => b.addedAt.localeCompare(a.addedAt) || a.rank - b.rank,
    'pret-asc': (a, b) => a.price - b.price || a.rank - b.rank,
    'pret-desc': (a, b) => b.price - a.price || a.rank - b.rank,
  };
  return [...list].sort(by[sort]);
}

/** Câte produse ar rămâne dacă bifezi opțiunea (ținând cont de celelalte grupuri de filtre). */
export function facetCounts(f: Filters, products = commerceProducts) {
  const count = <K extends keyof Filters>(group: K, test: (p: CommerceProduct) => boolean) =>
    products.filter((p) => match(p, f, group) && test(p)).length;
  return {
    categorie: Object.fromEntries(CATEGORIES.map((c) => [c.key, count('categorie', (p) => p.categoryKey === c.key)])) as Record<CategoryKey, number>,
    ocazie: Object.fromEntries(OCCASIONS.map((o) => [o.key, count('ocazie', (p) => p.occasions.includes(o.key))])) as Record<OccasionKey, number>,
    croiala: Object.fromEntries(FIT_OPTIONS.map((o) => [o.key, count('croiala', (p) => fitsOf(p).includes(o.key))])) as Record<FitKey, number>,
    culoare: Object.fromEntries(COLOR_FAMILIES.map((o) => [o.key, count('culoare', (p) => p.colorFamily === o.key)])) as Record<ColorFamily, number>,
    piese: Object.fromEntries(PIECES_OPTIONS.map((o) => [o.key, count('piese', (p) => p.pieces === o.n)])) as Record<PiecesKey, number>,
  };
}

export const activeCount = (f: Filters) => f.categorie.length + f.ocazie.length + f.croiala.length + f.culoare.length + f.piese.length;

/* ——— URL ——— */
const pick = <T extends string>(raw: string | null, allowed: readonly T[]) =>
  (raw ?? '').split(',').filter((x): x is T => (allowed as readonly string[]).includes(x));

export function parseQuery(search: string, base?: Partial<Filters>): { filters: Filters; sort: SortKey } {
  const q = new URLSearchParams(search);
  const sort = SORT_OPTIONS.some((s) => s.key === q.get('sort')) ? (q.get('sort') as SortKey) : 'recomandate';
  return {
    sort,
    filters: {
      categorie: q.has('categorie') ? pick(q.get('categorie'), CATEGORIES.map((c) => c.key)) : base?.categorie ?? [],
      ocazie: pick(q.get('ocazie'), OCCASIONS.map((o) => o.key)),
      croiala: pick(q.get('croiala'), FIT_OPTIONS.map((o) => o.key)),
      culoare: pick(q.get('culoare'), COLOR_FAMILIES.map((o) => o.key)),
      piese: pick(q.get('piese'), PIECES_OPTIONS.map((o) => o.key)),
    },
  };
}

export function toQuery(f: Filters, sort: SortKey) {
  const q = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => f[k].length && q.set(k, f[k].join(',')));
  if (sort !== 'recomandate') q.set('sort', sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}
