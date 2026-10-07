/**
 * Starea coșului: tipuri + reducer pur (fără React), ca să poată fi testat și refolosit pe server.
 */
import { commerceConfig, getProduct } from './catalog';
import type { Measurements } from './measurements';

export type FitChoice =
  | { type: 'standard'; size: string }
  | { type: 'custom'; measurements: Measurements };

export type MonogramThread = 'auriu' | 'ivory' | 'ton-pe-ton';
export type Monogram = { text: string; thread: MonogramThread };

export type CartItem = {
  /** cheie stabilă: același produs cu aceeași croială se cumulează */
  id: string;
  slug: string;
  qty: number;
  fit: FitChoice;
  monogram?: Monogram;
};

export type CartState = { items: CartItem[]; open: boolean };

export type CartAction =
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'add'; item: Omit<CartItem, 'id' | 'qty'> & { qty?: number } }
  | { type: 'remove'; id: string }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'setMonogram'; id: string; monogram?: Monogram }
  | { type: 'updateFit'; id: string; fit: FitChoice }
  | { type: 'clear' }
  | { type: 'open' }
  | { type: 'close' };

export const initialCart: CartState = { items: [], open: false };

const clampQty = (n: number) => Math.max(1, Math.min(commerceConfig.maxQty, Math.round(n) || 1));

export function itemId(slug: string, fit: FitChoice) {
  if (fit.type === 'standard') return `${slug}|std-${fit.size}`;
  const sig = Object.entries(fit.measurements)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}${v}`)
    .join('');
  return `${slug}|mtm-${sig}`;
}

export function cartReducer(state: CartState, a: CartAction): CartState {
  switch (a.type) {
    case 'hydrate':
      return { ...state, items: a.items.filter((i) => getProduct(i.slug)) };
    case 'add': {
      const id = itemId(a.item.slug, a.item.fit);
      const existing = state.items.find((i) => i.id === id);
      const items = existing
        ? state.items.map((i) => (i.id === id ? { ...i, qty: clampQty(i.qty + (a.item.qty ?? 1)) } : i))
        : [...state.items, { ...a.item, id, qty: clampQty(a.item.qty ?? 1) }];
      return { items, open: true };
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== a.id) };
    case 'setQty':
      return { ...state, items: state.items.map((i) => (i.id === a.id ? { ...i, qty: clampQty(a.qty) } : i)) };
    case 'setMonogram':
      return { ...state, items: state.items.map((i) => (i.id === a.id ? { ...i, monogram: a.monogram } : i)) };
    case 'updateFit':
      return { ...state, items: state.items.map((i) => (i.id === a.id ? { ...i, fit: a.fit, id: itemId(i.slug, a.fit) } : i)) };
    case 'clear':
      return { ...state, items: [] };
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
  }
}

export function unitPrice(item: Pick<CartItem, 'slug' | 'fit'>) {
  const p = getProduct(item.slug);
  if (!p) return 0;
  return p.price + (item.fit.type === 'custom' ? commerceConfig.customFitSurcharge : 0);
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + unitPrice(i) * i.qty, 0);
  const shipping = items.length ? commerceConfig.shippingFee : 0;
  return { subtotal, shipping, total: subtotal + shipping, count: items.reduce((s, i) => s + i.qty, 0) };
}

/** Monogramă: inițiale și puncte, max. 4 caractere (ex. „A.P.”, „RGC”). */
export const sanitizeMonogram = (s: string) =>
  s.toLocaleUpperCase('ro-RO').replace(/[^A-ZĂÂÎȘȚ.]/g, '').slice(0, 4);
