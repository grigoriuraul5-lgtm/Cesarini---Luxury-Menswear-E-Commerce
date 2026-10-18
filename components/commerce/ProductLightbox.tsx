'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Media } from '@/lib/media';
import { EXPO } from '../ui/Reveal';

/**
 * Vizualizarea mărită de pe pagina produsului: fotografia întreagă (fără decupaj), la rezoluția ecranului,
 * cu săgeți, tastatură (← → Esc) și swipe pe telefon. Optimizatorul servește varianta potrivită (până la 2400 px).
 */
export function ProductLightbox({
  open, items, index, onIndex, onClose, title,
}: { open: boolean; items: Media[]; index: number; onIndex: (i: number) => void; onClose: () => void; title: string }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;
  const go = useCallback((d: 1 | -1) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, go, onClose]);

  const m = items[index];
  return (
    <AnimatePresence>
      {open && m && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: fotografia ${index + 1} din ${n}`}
          className="fixed inset-0 z-[80] flex flex-col bg-obsidian/[.97] backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EXPO }}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-4 px-gutter py-4">
            <p className="text-[0.7rem] uppercase tracking-wide2 text-stone-400">
              <span className="tabular-nums text-gold-300">{index + 1} / {n}</span>
              <span className="ml-4 hidden text-silk/70 sm:inline">{title}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Închide fotografia mărită"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-gold-400/40 text-gold-200 transition-colors hover:bg-gold-400 hover:text-obsidian"
            >
              <svg aria-hidden viewBox="0 0 10 10" className="h-3 w-3"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
          </div>

          <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={m.src}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EXPO }}
              >
                <Image src={m.src} alt={m.alt} fill sizes="100vw" quality={92} className="object-contain" />
              </motion.div>
            </AnimatePresence>

            {n > 1 && (
              <>
                <NavButton dir={-1} onClick={() => go(-1)} />
                <NavButton dir={1} onClick={() => go(1)} />
              </>
            )}
          </div>

          {n > 1 && (
            <ul className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-gutter py-4" aria-label="Fotografii">
              {items.map((it, i) => (
                <li key={it.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onIndex(i)}
                    aria-label={`Fotografia ${i + 1}`}
                    aria-current={i === index}
                    className={`relative block h-16 w-12 cursor-pointer overflow-hidden border transition-opacity ${i === index ? 'border-gold-400' : 'border-gold-400/20 opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={it.src} alt="" fill sizes="48px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? 'Fotografia următoare' : 'Fotografia anterioară'}
      className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-gold-400/40 bg-obsidian/60 text-gold-200 backdrop-blur-md transition-colors hover:bg-gold-400 hover:text-obsidian ${dir === 1 ? 'right-3 sm:right-6' : 'left-3 sm:left-6'}`}
    >
      <svg aria-hidden viewBox="0 0 24 8" className={`h-2 w-5 ${dir === -1 ? 'rotate-180' : ''}`}>
        <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </button>
  );
}
