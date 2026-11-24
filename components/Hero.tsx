'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { verified, formatRON } from '@/lib/brand';
import { getProduct, type CommerceProduct } from '@/lib/commerce/catalog';
import { LuxImage } from './ui/LuxImage';
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

/** Piesele din vitrina hero-ului: câte una din fiecare categorie importantă, toate cu fotografii reale. */
export const HERO_PICKS = [
  'costum-ceremonie-negru-c03',
  'costum-business-bej-b02',
  'camasa-alba-nasturi-ascunsi',
  'pantofi-oxford-negru-semilucios',
] as const;
const ROTATE_MS = 7000;

/**
 * Hero „vitrină” (24.11.2026): în primul ecran stau titlul casei și, alături, o piesă reală mare,
 * cu prețul și drumul spre produs; celelalte trei piese așteaptă în dreapta și se pot aduce în față.
 * Piesele se schimbă singure la 7 s doar cât timp vitrina e pe ecran, fără hover/focus și fără reduced-motion.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const booking = useBooking();
  const { t } = useLocale();
  const picks = HERO_PICKS.map((s) => getProduct(s)).filter(Boolean) as CommerceProduct[];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // rotirea pornește abia după hidratare (pe server `reduce` nu e cunoscut, iar firul de timp ar diferi)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const rotating = mounted && !reduce && !paused && visible;
  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % picks.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [rotating, active, picks.length]);

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

  const p = picks[active];
  const others = picks.map((x, i) => ({ x, i })).filter(({ i }) => i !== active);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-20">
      {/* Lumina aurie a hero-ului (fundalul cu emblema e global: components/BrandBackdrop.tsx) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[10%] top-[8%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,.09),transparent)]" />
      </div>

      <div className="container-site grid gap-5 pb-10 pt-[clamp(1rem,3svh,2rem)] sm:gap-7 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-10 lg:gap-y-0 lg:pb-14 lg:pt-6">
        {/* ——— Titlul casei (pe telefon: titlu → vitrină → text, ca prețul să apară în primul ecran) ——— */}
        <div className="min-w-0 max-lg:order-1 lg:col-span-5 lg:row-start-2 lg:self-end">
          <motion.p {...fadeUp(0.1)} className="eyebrow flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-gold-400" />
            <span><span className="hidden sm:inline lg:hidden xl:inline">Maison de Croitorie · </span>Cluj-Napoca · Est. {verified.foundingYear}</span>
          </motion.p>

          <h1 id="hero-title" className="mt-[clamp(0.9rem,2.5svh,1.75rem)] font-display text-[clamp(2.45rem,10vw,3rem)] font-normal leading-[0.98] tracking-[-0.015em] sm:text-display-sm lg:text-[clamp(3.2rem,1rem+3.1vw,4.9rem)]">
            {LINES.map((l, i) => (
              <span key={l.text} className="-mx-[0.08em] -mb-[0.12em] block overflow-hidden px-[0.08em] pb-[0.2em]">
                <motion.span {...line(i)} className={`block ${l.className}`}>
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className="min-w-0 max-lg:order-3 lg:col-span-5 lg:row-start-3 lg:self-start">
          <motion.div {...fadeUp(0.6)}>
            <p className="lead max-w-[30rem] lg:mt-[clamp(0.9rem,2.5svh,1.5rem)] max-lg:text-[1rem] max-lg:leading-[1.6]">
              Costume de ceremonie din lână, cămăși pe măsură și accesorii,{' '}
              <strong className="font-medium text-ivory">ajustate gratuit</strong> de croitorii casei în showroom-ul din centrul Clujului.
            </p>

            <div className="mt-[clamp(1rem,3svh,2rem)] flex flex-wrap items-center gap-x-8 gap-y-2">
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

        {/* ——— Vitrina: piesa din față + celelalte trei ——— */}
        <motion.div
          {...fadeUp(0.45)}
          ref={stage}
          role="region"
          aria-roledescription="vitrină"
          aria-label="Piese din colecție"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="grid min-w-0 grid-cols-[1fr] gap-3 max-lg:order-2 sm:gap-4 lg:col-span-7 lg:col-start-6 lg:row-span-4 lg:row-start-1 lg:self-center lg:grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,11rem)]"
        >
          {/* Piesa din față */}
          <article className="relative min-w-0 overflow-hidden border border-gold-400/25">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.slug}
                initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 1.1, ease: EXPO }}
              >
                <LuxImage
                  media={p.gallery[0]}
                  grade="none"
                  zoom={false}
                  priority={active === 0}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
                  className="aspect-[5/6] sm:aspect-[5/4] lg:aspect-auto lg:h-[min(calc(100svh-9rem),44rem)] lg:min-h-[30rem]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Eticheta piesei, pe un văl obsidian care urcă de jos */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent px-4 pb-4 pt-20 sm:px-7 sm:pb-7 sm:pt-24">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={p.slug}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.6, ease: EXPO }}
                  className="flex items-end justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-wide2 text-gold-400">
                      {p.category}
                      {p.code && <span className="hidden sm:inline"> · Model {p.code}</span>}
                    </p>
                    <h2 className="mt-1.5 font-display text-[clamp(1.3rem,1rem+1.2vw,2.1rem)] leading-tight text-ivory">{p.name}</h2>
                    <p className="mt-1 font-display text-[1.35rem] tabular-nums text-gold-300">{formatRON(p.price)}</p>
                  </div>
                  <Link
                    href={`/produs/${p.slug}`}
                    className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center gap-3 border border-gold-400/50 bg-obsidian/60 px-4 text-[0.66rem] font-semibold uppercase tracking-wide2 text-gold-200 backdrop-blur-sm transition-colors duration-500 ease-expo hover:border-gold-300 hover:bg-gold-400 hover:text-obsidian sm:px-5"
                  >
                    Vezi piesa
                    <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-5">
                      <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Firul de timp: cât mai stă piesa în față (doar când vitrina se rotește singură) */}
            {rotating && (
              <motion.span
                key={`t-${active}`}
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                className="absolute inset-x-0 top-0 h-px origin-left bg-gold-400/80"
              />
            )}
          </article>

          {/* Celelalte piese: pe telefon un rând de trei, pe desktop o coloană */}
          <ul className="grid min-w-0 grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-1 lg:grid-rows-3">
            {others.map(({ x, i }) => (
              <li key={x.slug} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Adu în față: ${x.name}, ${formatRON(x.price)}`}
                  className="group relative block h-full w-full cursor-pointer overflow-hidden border border-gold-400/15 text-left transition-colors duration-500 ease-expo hover:border-gold-400/60 focus-visible:border-gold-300"
                >
                  <LuxImage
                    media={x.gallery[0]}
                    grade="soft"
                    sizes="(min-width: 1024px) 180px, 33vw"
                    className="aspect-[3/4] lg:aspect-auto lg:h-full"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/95 to-transparent px-2.5 pb-2 pt-8 sm:px-3">
                    <span className="block truncate text-[0.6rem] font-semibold uppercase tracking-wide2 text-silk/80">{x.category}</span>
                    <span className="block font-display text-[0.95rem] tabular-nums text-gold-300">{formatRON(x.price)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
