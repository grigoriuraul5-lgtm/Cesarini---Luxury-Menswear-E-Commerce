'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO } from './ui/Reveal';

const LOCALES = [
  { code: 'ro', label: 'Română', short: 'RO' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
] as const;

type Code = (typeof LOCALES)[number]['code'];

/**
 * Selector de limbă accesibil (listbox): tastatură, Escape, click în afară.
 * La i18n real (next-intl / rute /[locale]), `onSelect` face router.push către ruta localizată
 * și se adaugă <link rel="alternate" hreflang> în metadata.
 */
export function LanguageSwitcher({ initial = 'ro' as Code }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Code>(initial);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = LOCALES.find((l) => l.code === current)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Limbă: ${active.label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-[0.68rem] font-semibold uppercase tracking-wide2 text-silk transition-colors duration-300 hover:text-gold-300"
      >
        {active.short}
        <svg aria-hidden viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-500 ease-expo ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Alege limba"
            initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: EXPO }}
            className="absolute right-0 top-full z-50 mt-3 w-44 border border-line bg-charcoal/95 p-1.5 shadow-noir backdrop-blur-xl"
          >
            {LOCALES.map((l) => {
              const selected = l.code === current;
              return (
                <li key={l.code} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrent(l.code);
                      setOpen(false);
                    }}
                    className={`flex min-h-11 w-full cursor-pointer items-center justify-between px-4 text-left text-sm transition-colors duration-300 ${
                      selected ? 'text-gold-300' : 'text-silk hover:bg-gold-500/10 hover:text-ivory'
                    }`}
                  >
                    <span className="font-serif text-base">{l.label}</span>
                    <span className="text-[0.62rem] tracking-wide2 text-stone-500">{l.short}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
