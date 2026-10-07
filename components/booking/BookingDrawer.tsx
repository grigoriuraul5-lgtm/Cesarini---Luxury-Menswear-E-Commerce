'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { verified } from '@/lib/brand';
import { EXPO } from '../ui/Reveal';

export const OCCASIONS = ['Nuntă — mire', 'Nuntă — naș sau invitat', 'Gală / Black tie', 'Business', 'Absolvire', 'Altă ocazie'] as const;
const SLOTS = ['11:00 – 13:00', '13:00 – 15:00', '15:00 – 17:00', '17:00 – 19:00'] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'phone' | 'date' | 'consent', string>>;

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Panou lateral de programare (nu modal centrat): păstrează contextul paginii vizibil,
 * se închide cu Escape / click pe fundal, blochează scroll-ul, mută focusul și îl readuce la închidere.
 */
export function BookingDrawer({ isOpen, onClose, initialOccasion }: { isOpen: boolean; onClose: () => void; initialOccasion?: string }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('input, select, button')?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // focus trap simplu
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a, button, input, select, textarea');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) { setStatus('idle'); setErrors({}); }
  }, [isOpen]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data.name?.trim()) next.name = 'Scrie-ne numele tău.';
    if (!/^(\+?40|0)7\d{8}$/.test((data.phone || '').replace(/[\s.-]/g, ''))) next.phone = 'Un număr de mobil valid, de exemplu 0723 424 929.';
    if (!data.date) next.date = 'Alege o zi.';
    else if (new Date(data.date).getDay() === 0) next.date = 'Duminica showroom-ul este închis. Alege altă zi.';
    if (!data.consent) next.consent = 'Avem nevoie de acordul tău ca să te putem suna.';
    setErrors(next);
    if (Object.keys(next).length) {
      panelRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/programare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      setFirstName(data.name.trim().split(' ')[0]);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const field = 'mt-2 block w-full min-h-12 border border-gold-400/20 bg-obsidian/60 px-4 text-[0.95rem] text-ivory placeholder:text-stone-600 transition-colors duration-300 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/40 aria-[invalid=true]:border-red-400/70';
  const label = 'text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease: EXPO }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col overflow-y-auto border-l border-gold-400/20 bg-charcoal/95 shadow-noir backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-6 border-b border-gold-400/20 px-8 pb-6 pt-8 sm:px-10">
              <div>
                <p className="eyebrow">Book Private Fitting</p>
                <h2 id={titleId} className="mt-4 font-display text-4xl font-normal leading-tight text-ivory">
                  Programează o <em className="text-gold-400">probă privată</em>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">
                  {verified.street}, {verified.city} · {verified.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(' · ')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Închide programarea"
                className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border border-gold-400/20 text-silk transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" /></svg>
              </button>
            </div>

            {status === 'sent' ? (
              <div className="flex flex-1 flex-col justify-center px-8 py-16 sm:px-10" role="status">
                <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full border border-gold-400/60 text-gold-300">
                  <svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
                <h3 className="mt-8 font-display text-3xl text-ivory">Mulțumim{firstName ? `, ${firstName}` : ''}.</h3>
                <p className="mt-4 max-w-prose leading-relaxed text-stone-400">
                  Am primit cererea ta. Un consultant Cesarini te sună pentru a confirma ziua și ora probei.
                </p>
                <button type="button" onClick={onClose} className="mt-10 self-start border-b border-gold-400/50 pb-1 text-[0.7rem] font-semibold uppercase tracking-wide2 text-gold-300 hover:border-gold-300">
                  Înapoi la site
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col gap-6 px-8 py-8 sm:px-10">
                <fieldset>
                  <legend className={label}>Ocazia</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {OCCASIONS.map((o, i) => (
                      <label key={o} className="cursor-pointer">
                        <input type="radio" name="occasion" value={o} defaultChecked={initialOccasion ? o === initialOccasion : i === 0} className="peer sr-only" />
                        <span className="inline-flex min-h-11 items-center rounded-full border border-gold-400/20 px-4 text-sm text-silk transition-all duration-300 hover:border-gold-400/60 peer-checked:border-gold-400 peer-checked:bg-gold-400 peer-checked:text-obsidian peer-focus-visible:ring-1 peer-focus-visible:ring-gold-300">
                          {o}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-name" className={label}>Nume</label>
                    <input id="bk-name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'bk-name-err' : undefined} />
                    {errors.name && <p id="bk-name-err" className="mt-2 text-xs text-red-300">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className={label}>Telefon</label>
                    <input id="bk-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="07xx xxx xxx" className={field} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'bk-phone-err' : undefined} />
                    {errors.phone && <p id="bk-phone-err" className="mt-2 text-xs text-red-300">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-date" className={label}>Ziua preferată</label>
                    <input id="bk-date" name="date" type="date" min={today()} className={`${field} [color-scheme:dark]`} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'bk-date-err' : undefined} />
                    {errors.date && <p id="bk-date-err" className="mt-2 text-xs text-red-300">{errors.date}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-slot" className={label}>Interval</label>
                    <select id="bk-slot" name="slot" className={`${field} cursor-pointer appearance-none`}>
                      {SLOTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="bk-notes" className={label}>Detalii (opțional)</label>
                  <textarea id="bk-notes" name="notes" rows={3} placeholder="Data evenimentului, culoarea dorită, mărimea obișnuită…" className={`${field} min-h-24 py-3`} />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone-400">
                  <input type="checkbox" name="consent" value="da" className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-gold-400" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'bk-consent-err' : undefined} />
                  <span>
                    Sunt de acord să fiu contactat telefonic de Cesarini pentru confirmarea programării.
                    {errors.consent && <span id="bk-consent-err" className="mt-1 block text-xs text-red-300">{errors.consent}</span>}
                  </span>
                </label>

                {status === 'error' && (
                  <p role="alert" className="border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
                    Cererea nu a putut fi trimisă. Încearcă din nou sau sună-ne la {verified.phoneDisplay}.
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-4 border-t border-gold-400/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <a href={`tel:${verified.phoneE164}`} className="text-sm text-stone-400 transition-colors hover:text-gold-300">
                    Sau sună direct: <span className="text-silk">{verified.phoneDisplay}</span>
                  </a>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 bg-gold-brushed bg-[length:200%_100%] bg-left px-8 text-[0.72rem] font-semibold uppercase tracking-wide2 text-obsidian transition-all duration-500 ease-expo hover:bg-right hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === 'sending' ? 'Se trimite…' : 'Trimite cererea'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
