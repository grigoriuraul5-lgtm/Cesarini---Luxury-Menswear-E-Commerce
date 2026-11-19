'use client';

import Link from 'next/link';
import { atelierServices, verified } from '@/lib/brand';
import { Reveal } from './ui/Reveal';
import { LuxImage } from './ui/LuxImage';
import { BookingButton } from './ui/GoldButton';
import { media } from '@/lib/media';

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
                <span className="border-b border-gold-400/40 pb-1 transition-colors duration-500 group-hover:border-gold-200">Despre atelier, servicii și program</span>
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
                      {/* pe prima pagină: titlul și subtitlul; textul complet e pe /atelier */}
                      <p className="mt-3 text-base font-medium text-gold-200/90">{s.lead}</p>
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
