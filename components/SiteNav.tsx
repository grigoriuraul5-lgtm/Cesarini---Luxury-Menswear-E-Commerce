'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, verified } from '@/lib/brand';
import { EXPO } from './ui/Reveal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useBooking } from './booking/BookingProvider';
import { useCart } from './commerce/CartProvider';

/**
 * Bară transparentă peste hero → frosted glass cu hairline aurie după scroll.
 * „Selector VIP”: indicator auriu care alunecă între secțiuni (layoutId).
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const booking = useBooking();
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-expo ${
        scrolled ? 'bg-obsidian/60 backdrop-blur-md backdrop-saturate-150' : 'bg-gradient-to-b from-obsidian/70 to-transparent'
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Cesarini — acasă" className="group flex items-baseline gap-3">
          <span className="font-display text-[1.35rem] uppercase tracking-[0.42em] text-ivory transition-colors duration-500 group-hover:text-gold-300">
            Cesarini
          </span>
          <span className="hidden font-serif text-sm italic text-gold-500/80 xl:inline">Cluj · 2015</span>
        </Link>

        {/* Selector VIP */}
        <nav aria-label="Navigare principală" className="hidden lg:block">
          <ul
            className="relative flex items-center rounded-full border border-gold-400/20 bg-obsidian/40 p-1 shadow-gold-inset backdrop-blur-md"
            onMouseLeave={() => setHovered(null)}
          >
            {nav.map((item) => (
              <li key={item.label} className="relative">
                <Link
                  href={item.href}
                  onMouseEnter={() => setHovered(item.label)}
                  onFocus={() => setHovered(item.label)}
                  className="relative z-10 block px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-wide2 text-silk transition-colors duration-300 hover:text-obsidian focus-visible:text-obsidian"
                >
                  {item.label}
                </Link>
                {hovered === item.label && (
                  <motion.span
                    layoutId="vip-pill"
                    className="absolute inset-0 rounded-full bg-gold-brushed"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => booking.open()}
            aria-haspopup="dialog"
            className="group relative hidden min-h-11 cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-gold-500/60 px-5 text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-200 transition-all duration-500 ease-expo hover:border-gold-300 hover:text-obsidian hover:shadow-gold-md md:inline-flex"
          >
            <span aria-hidden className="absolute inset-0 translate-y-full bg-gold-brushed transition-transform duration-500 ease-expo group-hover:translate-y-0" />
            <span aria-hidden className="relative h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_2px_rgba(212,175,55,.6)] group-hover:bg-obsidian group-hover:shadow-none" />
            <span className="relative">Private Fitting</span>
          </button>
          <button
            type="button"
            onClick={cart.open}
            aria-haspopup="dialog"
            aria-label={`Coșul tău${cart.totals.count ? `, ${cart.totals.count} ${cart.totals.count === 1 ? 'piesă' : 'piese'}` : ', gol'}`}
            className="relative grid h-12 w-12 cursor-pointer place-items-center text-silk transition-colors duration-300 hover:text-gold-300"
          >
            <svg aria-hidden viewBox="0 0 20 22" className="h-5 w-5">
              <path d="M3.5 7h13l-1 13.5h-11z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M7 9.5V5.5a3 3 0 016 0v4" fill="none" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            {cart.totals.count > 0 && (
              <span className="absolute right-1 top-1.5 grid h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-gold-400 px-1 text-[0.6rem] font-semibold tabular-nums text-obsidian">
                {cart.totals.count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
            className="relative grid h-12 w-12 cursor-pointer place-items-center lg:hidden"
          >
            <span className={`absolute h-px w-6 bg-ivory transition-all duration-500 ease-expo ${open ? 'rotate-45' : '-translate-y-1'}`} />
            <span className={`absolute h-px w-6 bg-gold-400 transition-all duration-500 ease-expo ${open ? '-rotate-45' : 'translate-y-1'}`} />
          </button>
        </div>
      </div>
      <div className={`hairline transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EXPO }}
            className="fixed inset-0 top-20 z-40 bg-obsidian/[0.97] backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Navigare mobil" className="container-site flex h-full flex-col justify-between pb-12 pt-10">
              <ul className="space-y-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.8, ease: EXPO }}
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-2 font-display text-5xl text-ivory">
                      <span className="font-sans text-xs text-gold-500">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="space-y-6 border-t border-gold-400/20 pt-6">
                <address className="font-serif text-lg not-italic leading-relaxed text-stone-400">
                  <span className="italic">{verified.street}, {verified.city}</span>
                  <br />
                  <span className="text-base">{verified.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(' · ')}</span>
                  <br />
                  <a href={`tel:${verified.phoneE164}`} className="text-base text-gold-300">{verified.phoneDisplay}</a>
                </address>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setOpen(false);
                    booking.open();
                  }}
                  className="inline-flex min-h-12 cursor-pointer items-center bg-gold-brushed px-8 text-[0.72rem] font-semibold uppercase tracking-wide2 text-obsidian"
                >
                  Book Private Fitting
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
