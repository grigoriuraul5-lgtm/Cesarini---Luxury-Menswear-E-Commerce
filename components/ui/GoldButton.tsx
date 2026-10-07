'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useBooking } from '../booking/BookingProvider';

type Variant = 'solid' | 'ghost';

/**
 * CTA-ul casei: bordură aur de 1px, reflex de lumină care traversează butonul la hover,
 * glow auriu discret. Înălțime min. 48px (touch target).
 */
export const goldButtonClass = (variant: Variant = 'solid', extra = '') =>
  [
    'group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-8 py-4',
    'font-sans text-[0.72rem] font-semibold uppercase tracking-wide2 transition-all duration-500 ease-expo',
    'cursor-pointer active:scale-[0.98]',
    variant === 'solid'
      ? 'bg-gold-brushed bg-[length:200%_100%] bg-left text-obsidian shadow-gold-sm hover:bg-right hover:shadow-gold-soft'
      : 'border border-gold-400/40 bg-obsidian/30 text-gold-200 backdrop-blur-md hover:border-gold-300 hover:text-gold-100 hover:shadow-gold-soft',
    extra,
  ].join(' ');

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 ease-expo group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
      <svg aria-hidden viewBox="0 0 24 8" className="relative h-2 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1">
        <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </>
  );
}

export function GoldButton({ href, children, variant = 'solid', className = '', ariaLabel }: { href: string; children: ReactNode; variant?: Variant; className?: string; ariaLabel?: string }) {
  return (
    <Link href={href} aria-label={ariaLabel} className={goldButtonClass(variant, className)}>
      <Inner>{children}</Inner>
    </Link>
  );
}

/** Deschide panoul „Book Private Fitting”. */
export function BookingButton({ children = 'Book Private Fitting', variant = 'ghost', className = '', occasion }: { children?: ReactNode; variant?: Variant; className?: string; occasion?: string }) {
  const { open } = useBooking();
  return (
    <button type="button" onClick={() => open(occasion)} aria-haspopup="dialog" className={goldButtonClass(variant, className)}>
      <Inner>{children}</Inner>
    </button>
  );
}
