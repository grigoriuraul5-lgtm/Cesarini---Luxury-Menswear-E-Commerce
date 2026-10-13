'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { faqs, verified } from '@/lib/brand';
import { EXPO, Reveal } from './ui/Reveal';

/**
 * „Întrebări Frecvente & Ghidul Atelierului”.
 * Răspunsurile rămân MEREU în HTML (se pliază vizual cu grid-rows, nu se demontează),
 * ca motoarele de căutare și AI-urile să le citească și când sunt închise. Textul = FAQPage JSON-LD.
 */
export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <section id="intrebari" aria-labelledby="faq-title" className="relative border-t border-gold-400/20 py-section">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-gold-400" />
                Răspunsuri de la croitori
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="faq-title" className="mt-8 max-w-[12ch] font-display text-display-sm font-normal text-ivory">
                Întrebări frecvente <em className="text-gold-400">&amp; ghidul atelierului</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lead mt-8 max-w-[30rem]">
                Ce costă, cât durează și cum te măsori de acasă. Pentru restul, sună-ne:{' '}
                <a href={`tel:${verified.phoneE164}`} className="whitespace-nowrap text-gold-300 underline-offset-4 hover:underline">{verified.phoneDisplay}</a>.
              </p>
              <Link href="/journal/ghid-black-tie" className="group mt-8 inline-flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-300">
                Citește ghidul Black Tie
                <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                  <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </header>

        <div className="lg:col-span-7">
          <ul className="border-t border-gold-400/20">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const panelId = `${uid}-p${i}`;
              const btnId = `${uid}-b${i}`;
              return (
                <li key={f.q} className="border-b border-gold-400/20">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex min-h-[4.5rem] w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className={`font-display text-[clamp(1.25rem,1.05rem+0.7vw,1.7rem)] leading-snug transition-colors duration-500 ${isOpen ? 'text-gold-100' : 'text-ivory group-hover:text-gold-100'}`}>
                        {f.q}
                      </span>
                      <span aria-hidden className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${isOpen ? 'border-gold-400 bg-gold-400 text-obsidian' : 'border-gold-400/30 text-gold-300 group-hover:border-gold-400'}`}>
                        <span className="absolute h-px w-3.5 bg-current" />
                        <motion.span
                          className="absolute h-3.5 w-px bg-current"
                          animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                          transition={{ duration: reduce ? 0 : 0.5, ease: EXPO }}
                        />
                      </span>
                    </button>
                  </h3>
                  {/* grid-rows 0fr → 1fr: înălțime fluidă fără a anima `height`; conținutul rămâne în DOM */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`grid transition-[grid-template-rows] duration-700 ease-expo motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <motion.p
                        initial={false}
                        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
                        transition={{ duration: reduce ? 0 : 0.6, ease: EXPO, delay: isOpen && !reduce ? 0.1 : 0 }}
                        className="max-w-prose pb-8 pr-14 leading-relaxed text-silk/85"
                      >
                        {f.a}
                      </motion.p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
