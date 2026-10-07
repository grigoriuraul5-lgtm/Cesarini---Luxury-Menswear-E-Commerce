'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { BookingDrawer } from './BookingDrawer';

type BookingContext = { open: (occasion?: string) => void; close: () => void };
const Ctx = createContext<BookingContext | null>(null);

/** Un singur panou de programare pentru tot site-ul; orice CTA îl deschide cu `useBooking().open()`. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [occasion, setOccasion] = useState<string | undefined>();

  const open = useCallback((o?: string) => {
    setOccasion(o);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <BookingDrawer isOpen={isOpen} onClose={close} initialOccasion={occasion} />
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBooking trebuie folosit în interiorul <BookingProvider>');
  return ctx;
}
