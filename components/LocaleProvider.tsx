'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Limba etichetelor de navigare (meniu, butonul de programare, legăturile din footer).
 * Cererea clientului (19.11.2026): cu româna selectată, meniul e COLECȚII · DESPRE NOI · JURNAL · ATELIER,
 * iar butonul „Book Private Fitting” devine „Programează o întâlnire”.
 * Conținutul paginilor rămâne în română; o traducere completă (rute /en, /it + hreflang) e un pas separat.
 */
export const LOCALES = [
  { code: 'ro', label: 'Română', short: 'RO' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];
export type NavKey = 'colectii' | 'despre' | 'jurnal' | 'atelier';

type Dictionary = {
  nav: Record<NavKey, string>;
  /** butonul care deschide formularul de programare */
  book: string;
  /** eticheta din bara de sus (desktop) */
  bookShort: string;
  /** varianta compactă a etichetei, pentru ecranele de 1024–1279 px, unde bara e plină */
  bookCompact: string;
  /** butonul principal din hero */
  explore: string;
};

const DICT: Record<Locale, Dictionary> = {
  ro: {
    nav: { colectii: 'Colecții', despre: 'Despre noi', jurnal: 'Jurnal', atelier: 'Atelier' },
    book: 'Programează o întâlnire',
    bookShort: 'Programează o întâlnire',
    bookCompact: 'Programează',
    explore: 'Descoperă colecția',
  },
  en: {
    nav: { colectii: 'Collections', despre: 'About us', jurnal: 'Journal', atelier: 'Atelier' },
    book: 'Book Private Fitting',
    bookShort: 'Private Fitting',
    bookCompact: 'Private Fitting',
    explore: 'Explore Collection',
  },
  it: {
    nav: { colectii: 'Collezioni', despre: 'Chi siamo', jurnal: 'Journal', atelier: 'Atelier' },
    book: 'Prenota un appuntamento',
    bookShort: 'Prenota',
    bookCompact: 'Prenota',
    explore: 'Scopri la collezione',
  },
};

const STORAGE_KEY = 'cesarini-lang';

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dictionary };
const LocaleContext = createContext<Ctx>({ locale: 'ro', setLocale: () => {}, t: DICT.ro });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ro');

  // limba aleasă se păstrează între pagini (doar în browserul vizitatorului)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved in DICT) setLocaleState(saved as Locale);
    } catch {
      /* stocarea poate fi blocată: rămâne româna */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* fără stocare: alegerea ține până la reîncărcare */
    }
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale, t: DICT[locale] }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
