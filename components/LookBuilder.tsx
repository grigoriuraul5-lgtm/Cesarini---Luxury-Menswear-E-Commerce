'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { formatRON } from '@/lib/brand';
import { getProduct, sizeHeading, type CommerceProduct } from '@/lib/commerce/catalog';
import { useCart } from './commerce/CartProvider';
import { LuxImage } from './ui/LuxImage';
import { Reveal, EXPO } from './ui/Reveal';

/**
 * „Compune-ți ținuta” (24.11.2026): patru piese reale (costum, cămașă, pantofi, curea), schimbate pe loc,
 * cu totalul ținutei și adăugare în coș dintr-un singur gest. Trei combinații gata făcute: Mire, Naș, Business.
 */
type SlotKey = 'costum' | 'camasa' | 'pantofi' | 'curea';

const SLOTS: { key: SlotKey; label: string; options: string[] }[] = [
  {
    key: 'costum',
    label: 'Costumul',
    options: ['costum-ceremonie-negru-c03', 'costum-ceremonie-bleumarin-c13', 'costum-ceremonie-alb-crem-c10', 'costum-ceremonie-verde-inchis-c07', 'costum-business-bej-b02', 'costum-business-bleumarin-b09'],
  },
  { key: 'camasa', label: 'Cămașa', options: ['camasa-alba-nasturi-ascunsi', 'camasa-alba-papion', 'camasa-neagra-butoni', 'camasa-neagra-cravata'] },
  { key: 'pantofi', label: 'Pantofii', options: ['pantofi-oxford-negru-semilucios', 'pantofi-oxford-negru-mat', 'pantofi-oxford-medalion-negru', 'pantofi-oxford-medalion-bordo'] },
  { key: 'curea', label: 'Cureaua', options: ['curea-piele-negru-semilucios', 'curea-piele-neagra', 'curea-piele-bordo', 'curea-piele-gri'] },
];

const PRESETS: { key: string; label: string; look: Record<SlotKey, string> }[] = [
  { key: 'mire', label: 'Mire', look: { costum: 'costum-ceremonie-negru-c03', camasa: 'camasa-alba-papion', pantofi: 'pantofi-oxford-negru-semilucios', curea: 'curea-piele-negru-semilucios' } },
  { key: 'nas', label: 'Naș', look: { costum: 'costum-ceremonie-bleumarin-c13', camasa: 'camasa-alba-nasturi-ascunsi', pantofi: 'pantofi-oxford-negru-mat', curea: 'curea-piele-neagra' } },
  { key: 'business', label: 'Business', look: { costum: 'costum-business-bej-b02', camasa: 'camasa-alba-nasturi-ascunsi', pantofi: 'pantofi-oxford-medalion-bordo', curea: 'curea-piele-bordo' } },
];

const prod = (slug: string) => getProduct(slug) as CommerceProduct;

export function LookBuilder({ initialPreset = 'mire' }: { initialPreset?: 'mire' | 'nas' | 'business' } = {}) {
  const reduce = useReducedMotion();
  const cart = useCart();
  const start = PRESETS.find((x) => x.key === initialPreset) ?? PRESETS[0];
  const [look, setLook] = useState<Record<SlotKey, string>>(start.look);
  const [preset, setPreset] = useState<string | null>(start.key);
  const [sizes, setSizes] = useState<Partial<Record<SlotKey, string>>>({});
  const [added, setAdded] = useState(false);
  const [tried, setTried] = useState(false);

  const pieces = useMemo(() => SLOTS.map((s) => ({ slot: s, p: prod(look[s.key]) })), [look]);
  const total = pieces.reduce((sum, { p }) => sum + p.price, 0);
  // mărimea unică (cureaua reglabilă) e aleasă din start
  const sizeOf = (k: SlotKey, p: CommerceProduct) => (p.sizes.length === 1 ? p.sizes[0] : sizes[k]);
  const missing = pieces.filter(({ slot, p }) => !sizeOf(slot.key, p));

  const choose = (k: SlotKey, slug: string) => {
    setLook((l) => ({ ...l, [k]: slug }));
    setSizes((s) => ({ ...s, [k]: undefined }));
    setPreset(null);
    setAdded(false);
  };
  const applyPreset = (key: string) => {
    const pr = PRESETS.find((x) => x.key === key)!;
    setLook(pr.look);
    setPreset(key);
    setSizes({});
    setAdded(false);
    setTried(false);
  };
  const addAll = () => {
    setTried(true);
    if (missing.length) return;
    pieces.forEach(({ slot, p }) => cart.add(p.slug, { type: 'standard', size: sizeOf(slot.key, p)! }));
    setAdded(true);
    cart.open();
  };

  return (
    <section aria-labelledby="tinuta-title" className="relative border-t border-gold-400/20 py-[clamp(3.5rem,8vw,7rem)]">
      <div className="container-site">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-gold-400" />
              Ținuta completă
            </p>
            <h2 id="tinuta-title" className="mt-4 font-display text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] font-normal leading-[1.05] text-ivory">
              Compune-ți ținuta. <span className="text-gold-400">Piesă cu piesă.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[0.95rem] leading-relaxed text-stone-400 lg:text-right">Pornește de la o ținută gata compusă sau schimbă orice piesă. Totalul se actualizează pe loc.</p>
            <div role="group" aria-label="Ținute gata compuse" className="mt-5 flex gap-2 lg:justify-end">
              {PRESETS.map((pr) => {
                const on = preset === pr.key;
                return (
                  <button
                    key={pr.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => applyPreset(pr.key)}
                    className={`min-h-11 cursor-pointer rounded-full border px-5 text-[0.68rem] font-semibold uppercase tracking-wide2 transition-all duration-500 ease-expo ${
                      on ? 'border-gold-400 bg-gold-400 text-obsidian' : 'border-gold-400/25 text-silk/85 hover:border-gold-400/60 hover:text-ivory'
                    }`}
                  >
                    {pr.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Cele patru piese; între ele, semnul „+” al croitorului */}
        <ol className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {pieces.map(({ slot, p }, idx) => {
            const chosen = sizeOf(slot.key, p);
            const warn = tried && !chosen;
            return (
              <li key={slot.key} className="relative min-w-0">
                {idx > 0 && (
                  <span aria-hidden className="absolute -left-[0.95rem] top-[38%] z-10 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-gold-400/40 bg-obsidian font-display text-lg leading-none text-gold-300 lg:flex">
                    +
                  </span>
                )}
                <p className="text-[0.66rem] font-semibold uppercase tracking-wide2 text-gold-400">
                  {String(idx + 1).padStart(2, '0')} · {slot.label}
                </p>

                <Link href={`/produs/${p.slug}`} className="group mt-3 block border border-gold-400/15 transition-colors duration-500 hover:border-gold-400/50">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={p.slug}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.6, ease: EXPO }}
                    >
                      <LuxImage media={p.gallery[0]} grade="soft" sizes="(min-width: 1024px) 22vw, 48vw" className="aspect-[3/4]" />
                    </motion.div>
                  </AnimatePresence>
                </Link>

                {/* Variantele piesei */}
                <div role="group" aria-label={`Alege ${slot.label.toLowerCase()}`} className="mt-3 flex flex-wrap gap-1.5">
                  {slot.options.map((slug) => {
                    const o = prod(slug);
                    const on = slug === p.slug;
                    return (
                      <button
                        key={slug}
                        type="button"
                        aria-pressed={on}
                        aria-label={`${o.name}, ${formatRON(o.price)}`}
                        title={o.name}
                        onClick={() => choose(slot.key, slug)}
                        className={`relative h-11 w-9 shrink-0 cursor-pointer overflow-hidden border transition-all duration-500 ease-expo ${on ? 'border-gold-300' : 'border-gold-400/15 opacity-60 hover:opacity-100'}`}
                      >
                        <LuxImage media={o.gallery[0]} grade="none" zoom={false} sizes="48px" className="h-full w-full" />
                      </button>
                    );
                  })}
                </div>

                <h3 className="mt-3 font-display text-[1.05rem] leading-snug text-ivory sm:text-lg">{p.name}</h3>
                <p className="mt-1 font-display text-lg tabular-nums text-gold-300">{formatRON(p.price)}</p>

                {p.sizes.length > 1 ? (
                  <label className="mt-3 block">
                    <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-wide2 text-silk/60">{sizeHeading(p)}</span>
                    <select
                      value={chosen ?? ''}
                      onChange={(e) => {
                        setSizes((s) => ({ ...s, [slot.key]: e.target.value || undefined }));
                        setAdded(false);
                      }}
                      aria-invalid={warn || undefined}
                      className={`min-h-11 w-full cursor-pointer appearance-none border bg-obsidian/70 px-3 text-sm text-ivory outline-none transition-colors focus-visible:border-gold-300 ${warn ? 'border-[#c9604b]' : 'border-gold-400/25 hover:border-gold-400/50'}`}
                    >
                      <option value="">Alege mărimea</option>
                      {p.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="mt-3">
                    <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-wide2 text-silk/60">{sizeHeading(p)}</span>
                    <p className="flex min-h-11 items-center border border-gold-400/15 px-3 text-sm text-stone-400">Reglabilă · {p.sizes[0]} cm</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Totalul ținutei */}
        <div className="mt-10 flex flex-col gap-5 border-y border-gold-400/20 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-wide2 text-silk/70">Totalul ținutei · 4 piese</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={total}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EXPO }}
                className="mt-1 font-display text-[clamp(2rem,1.6rem+1.6vw,3rem)] tabular-nums leading-none text-gold-300"
              >
                {formatRON(total)}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={addAll}
              className="relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 overflow-hidden bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-8 text-[0.72rem] font-semibold uppercase tracking-wide2 text-obsidian transition-shadow duration-500 ease-expo hover:shadow-gold-soft"
            >
              {added ? 'Ținuta e în coș' : 'Adaugă ținuta în coș'}
            </button>
            <p aria-live="polite" className={`text-sm ${tried && missing.length ? 'text-[#e08a73]' : 'text-stone-500'}`}>
              {tried && missing.length
                ? `Alege mărimea pentru: ${missing.map(({ slot }) => slot.label.toLowerCase()).join(', ')}.`
                : 'Costumul și cămașa se pot croi și pe măsură, din pagina fiecărei piese.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
