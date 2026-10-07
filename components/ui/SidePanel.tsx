'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EXPO } from './Reveal';

type Props = {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** lățimea maximă a panoului */
  width?: string;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
};

/**
 * Panou lateral comun (coș, măsurători): păstrează pagina vizibilă în spate,
 * Escape / click pe fundal închid, scroll-ul paginii e blocat, focusul intră în panou și revine la închidere.
 */
export function SidePanel({ open, onClose, eyebrow, title, subtitle, width = 'max-w-[34rem]', footer, children, closeLabel = 'Închide' }: Props) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    last.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>('[data-autofocus], input, button, a')?.focus(), 380);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea')).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      last.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-md"
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.7, ease: EXPO }}
            className={`absolute inset-y-0 right-0 flex w-full ${width} flex-col border-l border-gold-400/20 bg-charcoal/[0.97] shadow-noir backdrop-blur-xl`}
          >
            <header className="flex items-start justify-between gap-6 border-b border-gold-400/20 px-6 pb-5 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] sm:px-10 sm:pt-8">
              <div className="min-w-0">
                <p className="eyebrow">{eyebrow}</p>
                <h2 id={titleId} className="mt-3 font-display text-3xl font-normal leading-tight text-ivory sm:text-4xl">
                  {title}
                </h2>
                {subtitle && <div className="mt-2 text-sm leading-relaxed text-stone-400">{subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border border-gold-400/20 text-silk transition-colors duration-300 hover:border-gold-400 hover:text-gold-300"
              >
                <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <footer className="border-t border-gold-400/20 bg-obsidian/40 px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-5 sm:px-10">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
