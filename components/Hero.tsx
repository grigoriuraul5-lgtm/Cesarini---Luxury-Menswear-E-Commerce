'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { verified, formatRON } from '@/lib/brand';
import { media } from '@/lib/media';
import { GoldButton } from './ui/GoldButton';
import { useBooking } from './booking/BookingProvider';
import { LuxImage } from './ui/LuxImage';
import { EXPO } from './ui/Reveal';

/* Titlul editorial, rând cu rând: fiecare rând urcă dintr-o mască (tehnică de revistă). */
const LINES = [
  { text: 'Eleganța', className: 'text-ivory' },
  { text: 'nu se poartă.', className: 'text-ivory' },
  { text: 'Se croiește.', className: 'text-gold-400' },
];

/* Faptele-cheie (GEO): propoziții scurte, vizibile, identice cu datele structurate. */
const FACTS = [
  'Showroom în centrul Clujului',
  `${verified.googleRating.value} din 5 · ${verified.googleRating.count} recenzii Google`,
  'Ajustări gratuite pentru toată ținuta',
  `Costum de ceremonie · ${formatRON(verified.prices.ceremonySuit)}`,
];

const portrait = media.editorial.heroTuxedo;

export function Hero() {
  const reduce = useReducedMotion();
  const booking = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax: imaginea urcă mai lent decât textul; textul se estompează la ieșire
  const artY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const line = (i: number) => ({
    initial: reduce ? false : { y: '110%' },
    animate: { y: '0%' },
    transition: { duration: 1.3, ease: EXPO, delay: 0.25 + i * 0.12 },
  });
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EXPO, delay },
  });

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-20">
      {/* Lumina aurie a hero-ului (fundalul cu emblema e global: components/BrandBackdrop.tsx) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[10%] top-[8%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,.09),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(10,10,10,.6))]" />
      </div>

      <div className="container-site grid flex-1 items-center gap-14 py-[clamp(1.25rem,4svh,3rem)] lg:grid-cols-12 lg:gap-8 lg:py-16">
        {/* ——— Coloana editorială ——— */}
        <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="lg:col-span-6 xl:col-span-7">
          <motion.p {...fadeUp(0.1)} className="eyebrow flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-gold-400" />
            <span><span className="hidden sm:inline">Maison de Croitorie · </span>Cluj-Napoca · Est. {verified.foundingYear}</span>
          </motion.p>

          <h1 id="hero-title" className="mt-[clamp(1rem,3.5svh,2rem)] font-display text-display-lg font-normal lg:mt-8">
            {LINES.map((l, i) => (
              <span key={l.text} className="-mx-[0.08em] -mb-[0.12em] block overflow-hidden px-[0.08em] pb-[0.2em]">
                <motion.span {...line(i)} className={`block ${l.className}`}>
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...fadeUp(0.75)} className="lead mt-[clamp(0.75rem,3svh,2.5rem)] max-w-[33rem] max-lg:leading-[1.65] lg:mt-10">
            Costume de ceremonie din lână, cămăși pe măsură și accesorii,{' '}
            <strong className="font-medium text-ivory">ajustate gratuit</strong> de croitorii casei în showroom-ul din centrul Clujului.
          </motion.p>

          {/* Un singur buton; programarea e un link text cu săgeată, nu un al doilea bloc */}
          <motion.div {...fadeUp(0.9)} className="mt-[clamp(1.25rem,4svh,3rem)] flex flex-wrap items-center gap-x-8 gap-y-2 lg:mt-12 lg:gap-10">
            <GoldButton href="/colectii">Explore Collection</GoldButton>
            <button
              type="button"
              onClick={() => booking.open()}
              aria-haspopup="dialog"
              className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-wide2 text-gold-200 transition-colors duration-500 hover:text-gold-100"
            >
              <span className="border-b border-gold-400/40 pb-1 transition-colors duration-500 group-hover:border-gold-200">Book Private Fitting</span>
              <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1">
                <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* ——— Cardul media: fotografie editorială (smoking) ——— */}
        <motion.figure
          style={reduce ? undefined : { y: artY }}
          initial={reduce ? false : { opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.8, ease: EXPO, delay: 0.2 }}
          className="relative mx-auto hidden w-full max-w-[30rem] lg:col-span-6 lg:block lg:max-w-none xl:col-span-5"
        >
          <div className="group relative aspect-[4/5] overflow-hidden border border-gold-400/20 shadow-noir transition-shadow duration-700 ease-expo hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            {/* Ken Burns lent: fotografia se așază în cadru la încărcare */}
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
            >
              <LuxImage
                media={portrait}
                priority
                grade="soft"
                sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 48vw, 92vw"
                className="h-full w-full"
                imgClassName="duration-[2000ms] group-hover:scale-[1.04]"
                zoom={false}
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_55%,rgba(10,10,10,.75)_100%)]" />
            {/* passe-partout auriu + colțuri */}
            <div aria-hidden className="absolute inset-4 border border-gold-400/20" />
            {(['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-b border-l', 'bottom-3 right-3 border-b border-r'] as const).map((c) => (
              <span key={c} aria-hidden className={`absolute h-5 w-5 border-gold-400/70 ${c}`} />
            ))}

            {/* Plăcuța de sticlă cu dovada socială */}
            <motion.div
              {...fadeUp(1.4)}
              className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 border border-gold-400/20 bg-obsidian/45 px-5 py-4 backdrop-blur-md"
            >
              <div>
                <p className="font-display text-lg text-ivory">Maison Cesarini</p>
                <p className="text-[0.7rem] uppercase tracking-wide2 text-stone-400">{verified.street.replace('Str. ', '')}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl leading-none text-gold-300">{verified.googleRating.value}</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-wide2 text-stone-400">{verified.googleRating.count} recenzii</p>
              </div>
            </motion.div>
          </div>

        </motion.figure>
      </div>

      {/* Banda de fapte (GEO), pe sticlă */}
      <motion.div {...fadeUp(1.2)} className="relative border-y border-gold-400/20 bg-obsidian/50 backdrop-blur-md">
        <ul className="container-site flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-center sm:justify-between">
          {FACTS.map((f, i) => (
            <li key={f} className="flex items-center gap-8 text-[0.7rem] uppercase tracking-wide2 text-silk/90">
              {i > 0 && <span aria-hidden className="hidden h-1 w-1 rotate-45 bg-gold-400 sm:block" />}
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Indicator de scroll */}
      <motion.a
        href="#atelier"
        aria-label="Coboară la Atelier"
        {...fadeUp(1.5)}
        className="absolute bottom-24 left-1/2 hidden flex-col items-center gap-3 text-stone-500 transition-colors hover:text-gold-300 lg:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-5 bg-gold-400"
            animate={reduce ? undefined : { y: ['-100%', '300%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}
