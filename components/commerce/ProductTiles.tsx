'use client';

import Link from 'next/link';
import { formatRON } from '@/lib/brand';
import { OCCASIONS, isMtm, productHref, type CommerceProduct } from '@/lib/commerce/catalog';
import { LuxImage } from '../ui/LuxImage';
import { goldButtonClass } from '../ui/GoldButton';
import { ArrowRight } from './parts';

const tagBase = 'border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-wide2 backdrop-blur-md';

function Tags({ p }: { p: CommerceProduct }) {
  return (
    <span className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
      {isMtm(p.garment) && <span className={`${tagBase} border-gold-400/60 bg-obsidian/55 text-gold-200`}>Croit pe măsură</span>}
      <span className={`${tagBase} border-gold-400/20 bg-obsidian/40 text-silk/90`}>Showroom Cluj</span>
    </span>
  );
}

/** A doua fotografie apare la hover (doar pe dispozitive cu mouse); pe touch rămâne prima. */
function DualImage({ p, sizes, className }: { p: CommerceProduct; sizes: string; className: string }) {
  return (
    <span className="relative block">
      <LuxImage media={p.gallery[0]} sizes={sizes} className={className} />
      {p.gallery[1] && (
        <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-expo [@media(hover:hover)]:group-hover:opacity-100">
          <LuxImage media={p.gallery[1]} sizes={sizes} className="h-full w-full" />
        </span>
      )}
    </span>
  );
}

const occasionLine = (p: CommerceProduct) =>
  OCCASIONS.filter((o) => p.occasions.includes(o.key)).map((o) => o.short).join(' · ');

/** Card de catalog (vizualizarea grilă). */
export function ProductTile({ p, onCustomize }: { p: CommerceProduct; onCustomize: (p: CommerceProduct) => void }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={productHref(p.slug)} tabIndex={-1} aria-hidden className="relative block overflow-hidden border border-gold-400/20 transition-shadow duration-700 ease-expo hover:shadow-gold-soft">
        <DualImage p={p} sizes="(min-width: 1280px) 24vw, (min-width: 640px) 40vw, 92vw" className="aspect-[3/4]" />
        <Tags p={p} />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-wide2 text-stone-500">{p.category}</p>
        <h3 className="mt-2 font-display text-[1.4rem] font-normal leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-100">
          <Link href={productHref(p.slug)} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-300">{p.name}</Link>
        </h3>
        <p className="mt-1 text-[0.8rem] text-stone-400">Pentru {occasionLine(p).toLowerCase()}</p>
        <p className="mt-3 font-display text-2xl tabular-nums text-gold-400">{formatRON(p.price)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-5">
          {isMtm(p.garment) && (
            <button
              type="button"
              onClick={() => onCustomize(p)}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 cursor-pointer items-center border border-gold-400/40 px-4 text-[0.62rem] font-semibold uppercase tracking-wide2 text-gold-200 transition-all duration-500 ease-expo hover:border-gold-300 hover:bg-gold-400 hover:text-obsidian"
            >
              Personalizează măsurile
            </button>
          )}
          <Link href={productHref(p.slug)} className="group/link inline-flex min-h-11 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-wide2 text-silk transition-colors hover:text-gold-300">
            Vezi produs
            <ArrowRight className="h-2 w-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Rând de revistă (vizualizarea editorială): fotografie mare, text ca într-un lookbook. */
export function ProductSpread({ p, flip, onCustomize }: { p: CommerceProduct; flip: boolean; onCustomize: (p: CommerceProduct) => void }) {
  return (
    <article className="group grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <Link href={productHref(p.slug)} tabIndex={-1} aria-hidden className={`relative block overflow-hidden border border-gold-400/20 md:col-span-7 ${flip ? 'md:order-last' : ''}`}>
        <DualImage p={p} sizes="(min-width: 768px) 52vw, 92vw" className="aspect-[4/5] md:aspect-[5/6]" />
        <Tags p={p} />
      </Link>
      <div className="md:col-span-5">
        <p className="eyebrow flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold-500" />
          {p.category}
        </p>
        <h3 className="mt-6 text-balance font-display text-display-sm font-normal text-ivory">
          <Link href={productHref(p.slug)} className="transition-colors hover:text-gold-100">{p.name}</Link>
        </h3>
        <p className="mt-6 max-w-prose font-serif text-lg leading-relaxed text-silk/85">{p.lead}</p>
        <ul className="mt-6 space-y-1.5 text-sm text-stone-400">
          {p.details.map((d) => (
            <li key={d} className="flex gap-3"><span aria-hidden className="text-gold-500">—</span>{d}</li>
          ))}
          <li className="flex gap-3"><span aria-hidden className="text-gold-500">—</span>Pentru {occasionLine(p).toLowerCase()}</li>
        </ul>
        <p className="mt-8 font-display text-3xl tabular-nums text-gold-400">{formatRON(p.price)}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={productHref(p.slug)} className={goldButtonClass('solid')}>
            <span className="relative">Vezi produs</span>
            <ArrowRight className="relative h-2 w-6" />
          </Link>
          {isMtm(p.garment) && (
            <button type="button" onClick={() => onCustomize(p)} aria-haspopup="dialog" className={goldButtonClass('ghost')}>
              <span className="relative">Personalizează măsurile</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
