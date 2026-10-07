'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { cartReducer, cartTotals, initialCart, type CartItem, type FitChoice, type Monogram } from '@/lib/commerce/cart';
import type { GarmentType } from '@/lib/commerce/catalog';
import type { Measurements } from '@/lib/commerce/measurements';
import { CartDrawer } from './CartDrawer';

type CartApi = {
  items: CartItem[];
  isOpen: boolean;
  totals: ReturnType<typeof cartTotals>;
  add: (slug: string, fit: FitChoice) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setMonogram: (id: string, m?: Monogram) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  /** Ultimele măsuri salvate, pe tip de piesă: reluate în PDP și în catalog. */
  measureProfile: Partial<Record<GarmentType, Measurements>>;
  saveMeasureProfile: (g: GarmentType, m: Measurements) => void;
};

const Ctx = createContext<CartApi | null>(null);
const KEY = 'cesarini.cart.v1';
const PROFILE_KEY = 'cesarini.measures.v1';

/** Coșul pentru tot site-ul. Se păstrează în browserul clientului (localStorage), dacă e disponibil. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const hydrated = useRef(false);
  const [measureProfile, setProfile] = useState<CartApi['measureProfile']>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* fără stocare: profilul trăiește doar în sesiune */
    }
  }, []);

  const saveMeasureProfile = useCallback((g: GarmentType, m: Measurements) => {
    setProfile((prev) => {
      const next = { ...prev, [g]: m };
      try {
        window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      } catch {
        /* ignorăm */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) dispatch({ type: 'hydrate', items: JSON.parse(raw) });
    } catch {
      /* stocare indisponibilă (fereastră privată, previzualizare): coșul trăiește doar în sesiune */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* ignorăm */
    }
  }, [state.items]);

  const api = useMemo<CartApi>(
    () => ({
      items: state.items,
      isOpen: state.open,
      totals: cartTotals(state.items),
      add: (slug, fit) => dispatch({ type: 'add', item: { slug, fit } }),
      remove: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      setMonogram: (id, monogram) => dispatch({ type: 'setMonogram', id, monogram }),
      clear: () => dispatch({ type: 'clear' }),
      open: () => dispatch({ type: 'open' }),
      close: () => dispatch({ type: 'close' }),
      measureProfile,
      saveMeasureProfile,
    }),
    [state, measureProfile, saveMeasureProfile],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart trebuie folosit în interiorul <CartProvider>');
  return ctx;
}
