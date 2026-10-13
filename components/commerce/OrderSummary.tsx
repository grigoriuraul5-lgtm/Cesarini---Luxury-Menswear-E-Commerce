'use client';

import { formatRON } from '@/lib/brand';
import { commerceConfig, getProduct } from '@/lib/commerce/catalog';
import { sanitizeMonogram, unitPrice, type MonogramThread } from '@/lib/commerce/cart';
import { useCart } from './CartProvider';
import { ItemThumb, fitLine } from './parts';

const THREADS: { id: MonogramThread; label: string; color: string }[] = [
  { id: 'auriu', label: 'Fir auriu', color: '#D4AF37' },
  { id: 'ivory', label: 'Fir ivory', color: '#F5F5F0' },
  { id: 'ton-pe-ton', label: 'Ton pe ton', color: '#6E6B64' },
];

/**
 * Sumarul comenzii, cu monograma pe căptușeală pentru fiecare piesă.
 * Previzualizarea monogramei e brodată pe o bucată de căptușeală (CSS), în fontul casei.
 */
export function OrderSummary({ idPrefix, locked = false }: { idPrefix: string; locked?: boolean }) {
  const cart = useCart();
  const t = cart.totals;

  return (
    <div>
      <ul className="divide-y divide-gold-400/15">
        {cart.items.map((i) => {
          const p = getProduct(i.slug);
          if (!p) return null;
          const mono = i.monogram;
          const thread = THREADS.find((x) => x.id === (mono?.thread ?? 'auriu'))!;
          return (
            <li key={i.id} className="py-6 first:pt-0">
              <div className="flex gap-4">
                <div className="relative">
                  <ItemThumb slug={i.slug} className="h-20 w-16" />
                  {i.qty > 1 && (
                    <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] font-semibold tabular-nums text-obsidian">
                      {i.qty}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-lg leading-snug text-ivory">{p.name}</p>
                    <p className="whitespace-nowrap text-sm tabular-nums text-silk">{formatRON(unitPrice(i) * i.qty)}</p>
                  </div>
                  <p className="mt-1 text-[0.8rem] text-stone-400">{fitLine(i)}{i.qty > 1 ? ` · ${i.qty} buc.` : ''}</p>
                </div>
              </div>

              {/* Monogramă */}
              {(!locked || mono) && (
                <div className="mt-4 pl-20">
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-silk/85">
                    <input
                      type="checkbox"
                      checked={!!mono}
                      disabled={locked}
                      onChange={(e) => cart.setMonogram(i.id, e.target.checked ? { text: '', thread: 'auriu' } : undefined)}
                      className="h-4 w-4 cursor-pointer accent-gold-400"
                    />
                    Monogramă pe căptușeală
                    <span className="text-xs uppercase tracking-wide2 text-gold-300">{commerceConfig.monogramFree ? 'gratuit' : ''}</span>
                  </label>
                  {mono && (
                    <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-4">
                      {/* căptușeala cu broderia */}
                      <div aria-hidden className="fabric-silk relative grid h-20 w-20 place-items-center border border-gold-400/20">
                        <span className="font-display text-2xl tracking-[0.12em]" style={{ color: thread.color }}>
                          {mono.text || 'A.P.'}
                        </span>
                        <span className="absolute inset-1.5 border border-dashed border-gold-400/15" />
                      </div>
                      <div className="min-w-0 space-y-3">
                        <div>
                          <label htmlFor={`${idPrefix}-mono-${i.id}`} className="sr-only">Inițiale pentru {p.name}</label>
                          <input
                            id={`${idPrefix}-mono-${i.id}`}
                            value={mono.text}
                            disabled={locked}
                            onChange={(e) => cart.setMonogram(i.id, { ...mono, text: sanitizeMonogram(e.target.value) })}
                            placeholder="Inițiale, ex. A.P."
                            autoComplete="off"
                            className="min-h-11 w-full border border-gold-400/20 bg-obsidian/60 px-3 font-display text-lg uppercase tracking-wide text-ivory placeholder:font-sans placeholder:text-sm placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-600 focus:border-gold-400 focus:outline-none"
                          />
                        </div>
                        <div role="radiogroup" aria-label="Culoarea firului" className="flex flex-wrap gap-2">
                          {THREADS.map((th) => (
                            <button
                              key={th.id}
                              type="button"
                              role="radio"
                              aria-checked={mono.thread === th.id}
                              disabled={locked}
                              onClick={() => cart.setMonogram(i.id, { ...mono, thread: th.id })}
                              className={`inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs transition-colors ${
                                mono.thread === th.id ? 'border-gold-400 text-ivory' : 'border-gold-400/20 text-stone-400 hover:border-gold-400/50'
                              }`}
                            >
                              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: th.color }} />
                              {th.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <dl className="mt-2 space-y-3 border-t border-gold-400/20 pt-6 text-sm">
        <Row k="Subtotal" v={formatRON(t.subtotal)} />
        <Row k="Livrare prin curier · 1 – 2 zile lucrătoare" v={t.shipping ? formatRON(t.shipping) : 'Gratuită'} />
        {cart.items.some((i) => i.monogram) && <Row k="Monogramă" v={commerceConfig.monogramFree ? 'Gratuită' : '—'} />}
        <div className="flex items-baseline justify-between border-t border-gold-400/20 pt-4">
          <dt className="font-display text-xl text-ivory">Total</dt>
          <dd className="font-display text-3xl tabular-nums text-gold-300">{formatRON(t.total)}</dd>
        </div>
        <p className="text-xs text-stone-500">Prețuri în lei, cu TVA inclus.</p>
      </dl>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-4 text-stone-400">
    <dt>{k}</dt>
    <dd className="whitespace-nowrap tabular-nums text-silk">{v}</dd>
  </div>
);
