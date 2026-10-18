'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatRON, verified } from '@/lib/brand';
import { getProduct, productHref, type CommerceProduct } from '@/lib/commerce/catalog';
import { specLine } from './commerce/ProductTiles';
import { media } from '@/lib/media';
import { LuxImage } from './ui/LuxImage';
import { Reveal } from './ui/Reveal';
import { useBooking } from './booking/BookingProvider';

/**
 * „Garderoba unei seri importante”: carusel cu produse reale din catalog (pozele și fișele Cesarini).
 * Selecția amestecă ceremonie, business și pantofi; ordinea de mai jos e cea afișată.
 * Scroll-snap nativ (swipe pe mobil, trackpad pe desktop) + butoane prev/next + indicator de progres.
 * Pe desktop încap 3 carduri și jumătate: al patrulea „iese” din cadru ca invitație la scroll.
 */
const FEATURED = [
  'costum-ceremonie-negru-c03',
  'costum-business-bej-b02',
  'costum-ceremonie-alb-crem-c10',
  'costum-business-caramiziu-b15',
  'costum-ceremonie-verde-inchis-c07',
  'pantofi-oxford-negru-semilucios',
  'costum-ceremonie-bordo-c16',
];
const featured = FEATURED.map((s) => getProduct(s)).filter(Boolean) as CommerceProduct[];

export function FeaturedCollections() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const booking = useBooking();

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    el?.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el?.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('li');
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="collections-title" aria-roledescription="carusel" className="relative border-t border-gold-400/20 pb-[clamp(2.5rem,6vw,5rem)] pt-section">
      <div className="container-site">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-gold-400" />
              Featured Collections
            </p>
            <h2 id="collections-title" className="mt-8 font-display text-display-sm font-normal text-ivory">
              Garderoba unei <em className="text-gold-400">seri importante</em>
            </h2>
            <p className="lead mt-6 max-w-[38rem]">
              De la cămașa Oxford de {formatRON(verified.prices.businessShirt)} la costumul de ceremonie de {formatRON(verified.prices.ceremonySuit)}. Piesele cele mai căutate, cu prețul la vedere.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="flex items-center gap-6">
            <div className="relative hidden h-px w-40 bg-gold-400/20 sm:block" aria-hidden>
              <span className="absolute inset-y-0 left-0 bg-gold-400 transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
            </div>
            <div className="flex gap-2">
              <CarouselButton dir={-1} disabled={edges.start} onClick={() => scrollByCard(-1)} />
              <CarouselButton dir={1} disabled={edges.end} onClick={() => scrollByCard(1)} />
            </div>
          </Reveal>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 pl-gutter pr-gutter [scroll-padding-left:clamp(1.25rem,4vw,3.5rem)] xl:pl-[max(clamp(1.25rem,4vw,3.5rem),calc((100vw-1440px)/2+3.5rem))]"
      >
        {featured.map((p, i) => (
          <li key={p.slug} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[27%]">
            <Reveal delay={Math.min(i, 3) * 0.08} className="h-full">
              <ProductCard p={p} />
            </Reveal>
          </li>
        ))}

        {/* Card final: proba în showroom */}
        <li className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[27%]">
          <button
            type="button"
            onClick={() => booking.open()}
            aria-haspopup="dialog"
            className="group relative flex h-full min-h-[34rem] w-full cursor-pointer flex-col justify-between overflow-hidden border border-gold-400/20 p-8 text-left transition-shadow duration-700 ease-expo hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <LuxImage media={media.atelier.rack} grade="none" sizes="30vw" className="!absolute inset-0 opacity-30" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.7),rgba(10,10,10,.95))]" />
            <span className="eyebrow relative">Private Fitting</span>
            <div className="relative">
              <p className="font-display text-4xl leading-tight text-ivory">
                Probează totul, <em className="text-gold-400">într-o singură vizită.</em>
              </p>
              <p className="mt-6 text-sm text-stone-400">
                {verified.street}, {verified.city}
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-wide2 text-gold-300">
                Programează o probă
                <svg aria-hidden viewBox="0 0 24 8" className="h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                  <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
            </div>
          </button>
        </li>
      </ul>
    </section>
  );
}

/** Card de produs e-commerce: foto cu zoom la hover, categorie, titlu, preț în aur, „Vezi Detalii”. */
function ProductCard({ p }: { p: CommerceProduct }) {
  return (
    <article className="group relative flex h-full flex-col border border-gold-400/20 bg-charcoal/40 backdrop-blur-md transition-all duration-700 ease-expo hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
      <div className="relative">
        <LuxImage media={p.gallery[0]} sizes="(min-width: 1280px) 27vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 80vw" className="aspect-[3/4]" />
        {/* eticheta de categorie, pe sticlă */}
        <span className="absolute left-4 top-4 border border-gold-400/20 bg-obsidian/40 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wide2 text-silk backdrop-blur-md">
          {p.category}
        </span>
        {p.badge && (
          <span className="absolute right-4 top-4 bg-gold-400 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wide2 text-obsidian">{p.badge}</span>
        )}
        {/* „ajustări gratuite” apare la hover — argumentul real al casei */}
        <span className="absolute inset-x-4 bottom-4 translate-y-2 border border-gold-400/20 bg-obsidian/55 px-4 py-2.5 text-center text-[0.65rem] uppercase tracking-wide2 text-gold-200 opacity-0 backdrop-blur-md transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
          Ajustări gratuite în atelier
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.45rem] font-normal leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-100">
          <Link href={productHref(p.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 text-[0.8rem] text-stone-400">{specLine(p)}</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="whitespace-nowrap font-display text-2xl tabular-nums text-gold-400">{formatRON(p.price)}</p>
          <span
            aria-hidden
            className="inline-flex min-h-10 items-center gap-2 border border-gold-400/30 px-4 text-[0.62rem] font-semibold uppercase tracking-wide2 text-silk transition-all duration-500 ease-expo group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-obsidian"
          >
            Vezi Detalii
            <svg viewBox="0 0 24 8" className="h-2 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1">
              <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

function CarouselButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? 'Produsul următor' : 'Produsul anterior'}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold-400/40 text-gold-300 backdrop-blur-md transition-all duration-500 ease-expo hover:border-gold-300 hover:bg-gold-400 hover:text-obsidian disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-300"
    >
      <svg aria-hidden viewBox="0 0 24 8" className={`h-2 w-5 ${dir === -1 ? 'rotate-180' : ''}`}>
        <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </button>
  );
}
