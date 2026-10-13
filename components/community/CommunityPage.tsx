'use client';

import Link from 'next/link';
import { channels, feed, type FeedItem } from '@/lib/community';
import { editorial, verified } from '@/lib/brand';
import { LuxImage } from '../ui/LuxImage';
import { Reveal } from '../ui/Reveal';
import { BookingButton } from '../ui/GoldButton';

const shapeCls: Record<FeedItem['shape'], string> = {
  tall: 'row-span-2 aspect-[4/5] sm:aspect-auto',
  wide: 'sm:col-span-2 aspect-[16/10] sm:aspect-auto',
  square: 'aspect-square sm:aspect-auto',
};

/**
 * Maison Community: canalele casei (registru numerotat, fără iconițe) și un lookbook editorial.
 * Cadrele sunt temele contului de Instagram; fiecare duce la profilul oficial.
 */
export function CommunityPage() {
  return (
    <div className="relative pb-section pt-32">
      <header className="container-site grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-wide2 text-stone-500">
            <ol className="flex items-center gap-3">
              <li><Link href="/" className="inline-flex min-h-8 items-center transition-colors hover:text-gold-300">Acasă</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-silk/70">Community</li>
            </ol>
          </nav>
          <p className="eyebrow mt-10 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-gold-400" />
            Maison Community · Social
          </p>
          <h1 className="mt-8 font-display text-display-md font-normal text-ivory">
            Comunitatea <em className="text-gold-400">Cesarini</em>
          </h1>
        </div>
        <p className="lead max-w-[30rem] lg:col-span-5 lg:pb-3">
          Ținute de ceremonie, probe în showroom și detaliile din atelier, așa cum le arătăm pe canalele casei.
          Alege canalul preferat.
        </p>
      </header>

      {/* ——— Canalele: registru numerotat ——— */}
      <section aria-labelledby="canale" className="container-site mt-20">
        <h2 id="canale" className="sr-only">Canalele oficiale Cesarini</h2>
        <ul className="grid gap-px border border-gold-400/20 bg-gold-400/20 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <li key={c.key} className="bg-obsidian/70 backdrop-blur-md">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col justify-between gap-6 p-7 sm:min-h-[13rem] sm:gap-8 transition-colors duration-500 ease-expo hover:bg-graphite/80 sm:p-8"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-700 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-sm tabular-nums text-gold-400">0{i + 1}</span>
                  <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 text-gold-300 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                    <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
                <span>
                  <span className="block font-display text-3xl text-ivory transition-colors duration-500 group-hover:text-gold-100">{c.name}</span>
                  <span className="mt-2 block text-sm font-medium tracking-wide text-gold-300">{c.handle}</span>
                  <span className="mt-4 block text-[0.95rem] leading-relaxed text-stone-400">{c.line}</span>
                </span>
                <span className="sr-only">(se deschide într-o filă nouă)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— Lookbook ——— */}
      <section aria-labelledby="lookbook" className="container-site mt-section">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Lookbook</p>
            <h2 id="lookbook" className="mt-6 max-w-[20ch] font-display text-display-sm font-normal text-ivory">
              Ce găsești pe <span className="text-gold-400">{editorial.instagramHandle}</span>
            </h2>
          </div>
          <p className="max-w-[26rem] text-[0.95rem] leading-relaxed text-stone-400">
            Temele contului, de la costumul de mire la ultima cusătură. Fiecare cadru te duce pe Instagram.
          </p>
        </Reveal>

        <ul className="mt-14 grid auto-rows-auto gap-4 sm:grid-cols-2 sm:auto-rows-[17rem] sm:gap-5 lg:grid-cols-4 lg:auto-rows-[19rem] [grid-auto-flow:dense]">
          {feed.map((f, i) => (
            <li key={f.id} className={shapeCls[f.shape]}>
              <Reveal delay={(i % 4) * 0.06} className="h-full">
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${f.kicker}: ${f.title}. Vezi pe Instagram (filă nouă)`}
                  className="group relative block h-full overflow-hidden border border-gold-400/20 transition-[box-shadow,border-color] duration-700 ease-expo hover:border-gold-400/50 hover:shadow-gold-soft"
                >
                  <LuxImage media={f.media} grade="deep" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full" />
                  {/* plăcuța de sticlă: tema + titlul; la hover urcă și arată destinația */}
                  <span className="absolute inset-x-3 bottom-3 block border border-gold-400/20 bg-obsidian/55 px-4 py-3.5 backdrop-blur-md transition-transform duration-700 ease-expo sm:inset-x-4 sm:bottom-4 sm:px-5 sm:py-4">
                    <span className="block text-[0.62rem] font-semibold uppercase tracking-wide2 text-gold-400">{f.kicker}</span>
                    <span className="mt-1.5 block font-display text-xl leading-snug text-ivory">{f.title}</span>
                    <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-expo group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                      <span className="overflow-hidden">
                        <span className="flex items-center gap-2 pt-2.5 text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-200">
                          Vezi pe Instagram
                          <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-5"><path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                        </span>
                      </span>
                    </span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— Invitația ——— */}
      <section aria-labelledby="invitatie" className="container-site mt-section">
        <Reveal>
          <div className="relative grid gap-10 border border-gold-400/20 bg-obsidian/60 p-8 backdrop-blur-md sm:p-12 lg:grid-cols-12 lg:items-center lg:p-16">
            <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold-400/60" />
            <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold-400/60" />
            <div className="lg:col-span-7">
              <p className="eyebrow">Seara ta, în ținuta ta</p>
              <h2 id="invitatie" className="mt-6 max-w-[18ch] font-display text-display-sm font-normal text-ivory">
                Porți Cesarini la eveniment? <span className="text-gold-400">Arată-ne.</span>
              </h2>
              <p className="lead mt-6 max-w-[34rem]">
                Etichetează {editorial.instagramHandle} în fotografia de la nuntă, gală sau interviu. Ne bucurăm să vedem fiecare ținută acolo unde contează: în seara ta.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
              <a
                href={verified.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden bg-gold-brushed bg-[length:200%_100%] bg-left px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-wide2 text-obsidian shadow-gold-sm transition-all duration-500 ease-expo hover:bg-right hover:shadow-gold-soft"
              >
                Urmărește pe Instagram
                <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1"><path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
              </a>
              <BookingButton variant="ghost" />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
