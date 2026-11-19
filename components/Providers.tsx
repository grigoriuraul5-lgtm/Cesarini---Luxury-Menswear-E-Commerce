'use client';

import type { ReactNode } from 'react';
import { BookingProvider } from './booking/BookingProvider';
import { CartProvider } from './commerce/CartProvider';
import { LocaleProvider } from './LocaleProvider';

/** Stările globale ale site-ului: limba etichetelor, coșul și panoul de programare. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>
        <BookingProvider>{children}</BookingProvider>
      </CartProvider>
    </LocaleProvider>
  );
}
