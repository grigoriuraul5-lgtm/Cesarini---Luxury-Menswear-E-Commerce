'use client';

import type { ReactNode } from 'react';
import { BookingProvider } from './booking/BookingProvider';
import { CartProvider } from './commerce/CartProvider';

/** Stările globale ale site-ului: coșul și panoul de programare. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <BookingProvider>{children}</BookingProvider>
    </CartProvider>
  );
}
