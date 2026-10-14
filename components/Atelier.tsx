'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { atelierServices, verified, formatRON } from '@/lib/brand';
import { Reveal, EXPO } from './ui/Reveal';
import { LuxImage } from './ui/LuxImage';
import { BookingButton } from './ui/GoldButton';
import { media } from '@/lib/media';

/* Mozaicul atelierului: trei momente ale procesului Made-to-Measure. */
const PROCESS = [
  { m: media.atelier.fabricSwatches, step: 'Stofa', text: 'Alegi țesătura și culoarea, cu mostrele în mână.' },
  { m: media.atelier.tailorAtWork, step: 'Croiala', text: 'Croitorii casei ajustează fiecare piesă pe măsurile tale.' },
  { m: media.atelier.cuttingFabric, step: 'Finisajul', text: 'Tiv, talie, mâneci: detaliile care fac costumul al tău.' },
];

/* Lista de prețuri „de croitor”: rânduri cu puncte de legătură, ca pe un bon de atelier.
   Toate valorile vin din `verified` (prețuri reale de pe cesarini.ro). */
const PRICE_LIST = [
  { item: 'Costum de ceremonie', note: '3 piese · 100% lână', price: formatRON(verified.prices.ceremonySuit) },
  { item: 'Costum business & casual', note: 'mărimi 46 – 58', price: formatRON(verified.prices.businessSuit) },
  { item: 'Cămașă de ceremonie', note: 'clasică · nasturi ascunși · nasturi negri', price: formatRON(verified.prices.ceremonyShirt) },
  { item: 'Cămașă Oxford', note: 'business & casual', price: formatRON(verified.prices.businessShirt) },
  { item: 'Pantofi Oxford', note: 'lucios · mat · medalion', price: formatRON(verified.prices.oxfordShoes) },
  { item: 'Ajustări de croitorie', note: 'pentru întreaga ținută din showroom', price: 'Gratuit', highlight: true },
];


export function Atelier() {
  return (
    <section id="atelier" aria-labelledby="atelier-title" className="relative pb-[clamp(3rem,7vw,6rem)] pt-section">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* ——— Coloana de titlu, lipită la scroll ——— */}
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-gold-400" />
                The Craftsmanship &amp; Atelier
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="atelier-title" className="mt-8 font-display text-display-md font-normal text-ivory">
                Croit
                <br />
                <em className="font-normal text-gold-400">pentru tine.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              {/* Paragraful-entitate: fraza pe care o citează AI-urile */}
              <p className="lead mt-10 max-w-prose">
                În showroom-ul de pe Ștefan Octavian Iosif, fiecare costum Cesarini trece prin mâinile
                croitorilor casei înainte să plece. Ajustările sunt gratuite pentru întreaga ținută: costum, cămașă și pantaloni.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <Link href="/atelier" className="group mt-8 inline-flex min-h-11 items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-wide2 text-gold-200 transition-colors duration-500 hover:text-gold-100">
                <span className="border-b border-gold-400/40 pb-1 transition-colors duration-500 group-hover:border-gold-200">Despre atelier, prețuri și program</span>
                <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1">
                  <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </header>

        {/* ——— Serviciile, ca pagini de registru ——— */}
        <div className="lg:col-span-7">
          <ol className="border-t border-gold-400/20">
            {atelierServices.map((s, i) => (
              <li key={s.numeral} className="border-b border-gold-400/20">
                <Reveal delay={i * 0.08}>
                  <Link
                    href={s.href}
                    className="group relative grid grid-cols-[4.5rem_1fr] gap-x-6 py-10 sm:grid-cols-[6rem_1fr_auto] sm:gap-x-10 sm:py-12"
                  >
                    {/* hairline aurie care se desfășoară la hover */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-700 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                    <span
                      aria-hidden
                      className="font-display text-5xl leading-none text-gold-500/70 transition-all duration-700 ease-expo group-hover:translate-x-1 group-hover:text-gold-300 sm:text-6xl"
                    >
                      {s.numeral}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl font-normal text-ivory transition-colors duration-500 group-hover:text-gold-100 sm:text-4xl">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-base font-medium text-gold-200/90">{s.lead}</p>
                      <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-stone-400">{s.body}</p>
                    </div>
                    <span
                      aria-hidden
                      className="col-start-2 mt-6 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-300 sm:col-start-3 sm:mt-2 sm:self-start"
                    >
                      <span className="hidden sm:inline">Detalii</span>
                      <svg viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                        <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ——— Showroom Experience: banda cinematică cu programare ——— */}
      <div className="container-site mt-section">
        <Reveal>
          <div className="group relative overflow-hidden border border-gold-400/20">
            <LuxImage media={media.atelier.suitOnMannequin} grade="none" sizes="100vw" className="aspect-[2/3] sm:aspect-[16/9] lg:aspect-[21/9]" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.3)_0%,rgba(10,10,10,.82)_38%,rgba(10,10,10,.95)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,10,10,.94)_0%,rgba(10,10,10,.75)_45%,rgba(10,10,10,.25)_100%)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:justify-center lg:p-16">
              <p className="eyebrow">Showroom<span className="hidden sm:inline"> Experience</span> · Cluj-Napoca</p>
              <h3 className="mt-6 max-w-[16ch] font-display text-display-sm font-normal text-ivory">
                O probă privată, <em className="text-gold-400">fără grabă.</em>
              </h3>
              <p className="mt-6 max-w-[36rem] text-[0.95rem] leading-relaxed text-silk/85">
                {verified.appointmentNote} {verified.street}, {verified.city}.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <BookingButton variant="solid" />
                <a href={`tel:${verified.phoneE164}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-silk/80 transition-colors hover:text-gold-300">
                  sau sună: <span className="text-ivory">{verified.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

    </section>
  );
}


/** Procesul Made-to-Measure, în imagini (pe pagina /atelier). */
export function AtelierProcess() {
  return (
    <section aria-label="Procesul Made-to-Measure" className="relative">
      {/* ——— Mozaic „Made-to-Measure”: procesul, în imagini ——— */}
      <div className="container-site">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Made-to-Measure</p>
            <h3 className="mt-6 max-w-[18ch] font-display text-display-sm font-normal text-ivory">
              De la mostră la <em className="text-gold-400">ultima cusătură</em>
            </h3>
          </div>
          <p className="max-w-[26rem] text-[0.95rem] leading-relaxed text-stone-400">{verified.freeAlterations}</p>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,1fr))] md:gap-6">
          {PROCESS.map((p, i) => (
            <li
              key={p.step}
              className={
                i === 0
                  ? 'md:col-span-7 md:row-span-2'
                  : i === 1
                    ? 'md:col-span-5 md:col-start-8 md:row-start-1'
                    : 'md:col-span-5 md:col-start-8 md:row-start-2'
              }
            >
              <Reveal delay={i * 0.1} className="h-full">
                <figure className="group relative h-full overflow-hidden border border-gold-400/20 transition-shadow duration-700 ease-expo hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <LuxImage
                    media={p.m}
                    grade="deep"
                    sizes={i === 0 ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 40vw, 100vw'}
                    className={i === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full md:min-h-[38rem]' : 'aspect-[16/10] md:aspect-auto md:h-full md:min-h-[18rem]'}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
                    <div>
                      <span className="font-display text-sm text-gold-300">0{i + 1}</span>
                      <p className="mt-1 font-display text-2xl text-ivory sm:text-3xl">{p.step}</p>
                      <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-silk/80">{p.text}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}

/** Lista de prețuri, toate din `verified` (pe pagina /atelier). */
export function AtelierPriceList() {
  const reduce = useReducedMotion();
  return (
        <Reveal>
          <div className="relative border border-gold-400/20 bg-charcoal/60 p-8 shadow-gold-inset backdrop-blur-md transition-shadow duration-700 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] sm:p-12">
            {/* colțuri de passe-partout */}
            <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold-500/60" />
            <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold-500/60" />

            <div className="flex items-baseline justify-between gap-6">
              <h3 className="font-display text-3xl font-normal text-ivory">Pricing Transparency</h3>
              <span className="hidden text-[0.65rem] uppercase tracking-wide2 text-stone-500 sm:inline">Prețuri în lei</span>
            </div>
            <p className="mt-3 text-sm text-stone-400">Prețuri fixe, afișate. Ajustările din showroom sunt incluse.</p>

            <ul className="mt-10 space-y-6">
              {PRICE_LIST.map((row, i) => (
                <motion.li
                  key={row.item}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.9, ease: EXPO, delay: 0.15 + i * 0.07 }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`font-display text-lg sm:text-xl ${row.highlight ? 'text-gold-300' : 'text-ivory'}`}>{row.item}</span>
                    <span aria-hidden className="mb-1 hidden min-w-6 flex-1 border-b border-dotted border-gold-500/35 sm:block" />
                    <span className={`whitespace-nowrap font-sans text-sm font-semibold tabular-nums tracking-wide ${row.highlight ? 'text-gold-300' : 'text-silk'}`}>
                      {row.price}
                    </span>
                  </div>
                  <span className="mt-1 block text-[0.8rem] text-stone-500">{row.note}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>
  );
}
