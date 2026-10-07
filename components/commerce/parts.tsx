'use client';

import { commerceConfig, getProduct, sizeLabel } from '@/lib/commerce/catalog';
import type { CartItem } from '@/lib/commerce/cart';
import { filledCount, fieldsFor } from '@/lib/commerce/measurements';
import { LuxImage } from '../ui/LuxImage';

/** „Mărime 50” / „Croit pe măsură · 9 măsuri” */
export function fitLine(item: Pick<CartItem, 'slug' | 'fit'>) {
  const p = getProduct(item.slug);
  if (!p) return '';
  if (item.fit.type === 'standard') return sizeLabel(p, item.fit.size);
  return `Croit pe măsură · ${filledCount(p.garment, item.fit.measurements)}/${fieldsFor(p.garment).length} măsuri`;
}

export function ItemThumb({ slug, className = 'h-24 w-[4.5rem]' }: { slug: string; className?: string }) {
  const p = getProduct(slug);
  if (!p) return null;
  return <LuxImage media={p.gallery[0]} sizes="96px" grade="soft" zoom={false} className={`shrink-0 border border-gold-400/20 ${className}`} />;
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const btn =
    'grid h-11 w-11 cursor-pointer place-items-center text-silk transition-colors duration-300 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-30';
  return (
    <div role="group" aria-label={`Cantitate pentru ${label}`} className="inline-flex items-center border border-gold-400/20">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Scade cantitatea">
        <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5"><path d="M1 5h8" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
      <span aria-live="polite" className="w-7 text-center text-sm tabular-nums text-ivory">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= commerceConfig.maxQty} aria-label="Crește cantitatea">
        <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5"><path d="M1 5h8M5 1v8" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
    </div>
  );
}

/** Romb auriu mic: marcajul casei pentru liste de garanții (în loc de iconițe). */
export const Diamond = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400 ${className}`} />
);

export const ArrowRight = ({ className = 'h-2 w-6' }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 8" className={`${className} transition-transform duration-500 ease-expo group-hover:translate-x-1`}>
    <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);
