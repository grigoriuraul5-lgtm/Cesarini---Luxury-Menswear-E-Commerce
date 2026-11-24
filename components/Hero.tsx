'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { verified, formatRON } from '@/lib/brand';
import { GoldButton } from './ui/GoldButton';
import { useBooking } from './booking/BookingProvider';
import { useLocale } from './LocaleProvider';
import { EXPO } from './ui/Reveal';
import { introDelay } from './IntroCurtain';

/* Titlul editorial, rând cu rând: fiecare rând urcă dintr-o mască (tehnică de revistă). */
const LINES = [
  { text: 'Eleganța nu se poartă.', className: 'text-ivory' },
  { text: 'Se croiește.', className: 'text-gold-400' },
];

/* Faptele-cheie (GEO): propoziții scurte, vizibile, identice cu datele structurate. */
const FACTS = [
  'Showroom în centrul Clujului',
  `${verified.googleRating.value} din 5 · ${verified.googleRating.count} recenzii Google`,
  'Ajustări gratuite pentru toată ținuta',
  `Costum de ceremonie · ${formatRON(verified.prices.ceremonySuit)}`,
];

/**
 * Hero compact (24.11.2026): titlul, textul și butoanele încap într-o bandă scundă,
 * ca vitrina magazinului (components/HomeShop.tsx) să apară în primul ecran.
 * Fotografia de stoc din dreapta și cardul foto de pe telefon au fost scoase: vitrina arată produsele reale.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const booking = useBooking();
  const { t } = useLocale();

  // Dacă rulează intro-ul cu logoul (prima vizită în sesiune), coregrafia hero-ului pornește după el
  const D = introDelay();
  const line = (i: number) => ({
    initial: reduce ? false : { y: '110%' },
    animate: { y: '0%' },
    transition: { duration: 1.3, ease: EXPO, delay: D + 0.25 + i * 0.12 },
  });
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EXPO, delay: D + delay },
  });

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex flex-col overflow-hidden pt-20">
      {/* Lumina aurie a hero-ului (fundalul cu emblema e global: components/BrandBackdrop.tsx) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[10%] top-[8%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,.09),transparent)]" />
      </div>

      <div className="container-site grid items-end gap-5 pb-6 pt-[clamp(1rem,3svh,2rem)] lg:grid-cols-12 lg:gap-10 lg:pb-8 lg:pt-8">
        {/* ——— Titlul ——— */}
        <div className="min-w-0 lg:col-span-6">
          <motion.p {...fadeUp(0.1)} className="eyebrow flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-gold-400" />
            <span><span className="hidden sm:inline">Maison de Croitorie · </span>Cluj-Napoca · Est. {verified.foundingYear}</span>
          </motion.p>

          <h1 id="hero-title" className="mt-[clamp(0.9rem,2.5svh,1.75rem)] font-display text-[clamp(2.45rem,10vw,3rem)] font-normal leading-[0.98] tracking-[-0.015em] sm:text-display-sm lg:text-[clamp(3.4rem,1.2rem+3.2vw,5.25rem)]">
            {LINES.map((l, i) => (
              <span key={l.text} className="-mx-[0.08em] -mb-[0.12em] block overflow-hidden px-[0.08em] pb-[0.2em]">
                <motion.span {...line(i)} className={`block ${l.className}`}>
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* ——— Textul și butoanele ——— */}
        <motion.div {...fadeUp(0.6)} className="min-w-0 lg:col-span-6 lg:pb-2">
          <p className="lead max-w-[36rem] max-lg:text-[1rem] max-lg:leading-[1.6]">
            Costume de ceremonie din lână, cămăși pe măsură și accesorii,{' '}
            <strong className="font-medium text-ivory">ajustate gratuit</strong> de croitorii casei în showroom-ul din centrul Clujului.
          </p>

          {/* Un singur buton; programarea e un link text cu săgeată, nu un al doilea bloc */}
          <div className="mt-[clamp(1rem,2.5svh,1.5rem)] flex flex-wrap items-center gap-x-8 gap-y-2 xl:gap-10">
            <GoldButton href="#magazin">{t.explore}</GoldButton>
            <button
              type="button"
              onClick={() => booking.open()}
              aria-haspopup="dialog"
              className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-wide2 text-gold-200 transition-colors duration-500 hover:text-gold-100"
            >
              <span className="border-b border-gold-400/40 pb-1 transition-colors duration-500 group-hover:border-gold-200">{t.book}</span>
              <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1">
                <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Banda de fapte (GEO): propoziții scurte, vizibile, identice cu datele structurate.
 * Din 24.11.2026 stă sub vitrina magazinului, ca produsele să apară în primul ecran.
 * Pe telefon e un singur rând care se derulează lateral.
 */
export function FactsBand() {
  return (
    <div className="relative border-y border-gold-400/20 bg-obsidian/50 backdrop-blur-md">
      <ul className="no-scrollbar container-site flex items-center gap-x-8 overflow-x-auto whitespace-nowrap py-4 sm:flex-wrap sm:justify-between sm:gap-y-3 sm:overflow-visible sm:whitespace-normal sm:py-5">
        {FACTS.map((f, i) => (
          <li key={f} className="flex shrink-0 items-center gap-8 text-[0.7rem] uppercase tracking-wide2 text-silk/90">
            {i > 0 && <span aria-hidden className="h-1 w-1 rotate-45 bg-gold-400" />}
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
