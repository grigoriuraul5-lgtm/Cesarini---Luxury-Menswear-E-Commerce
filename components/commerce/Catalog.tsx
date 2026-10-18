'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { editorial, formatRON, verified } from '@/lib/brand';
import { CATEGORIES, COLOR_FAMILIES, OCCASIONS, commerceProducts, getCategory, type CategoryKey, type CommerceProduct } from '@/lib/commerce/catalog';
import {
  EMPTY_FILTERS, FIT_OPTIONS, PIECES_OPTIONS, SORT_OPTIONS, activeCount, applyFilters, facetCounts, parseQuery, toQuery,
  type Filters, type SortKey,
} from '@/lib/commerce/listing';
import { EXPO } from '../ui/Reveal';
import { SidePanel } from '../ui/SidePanel';
import { goldButtonClass } from '../ui/GoldButton';
import { useCart } from './CartProvider';
import { MeasurementsPanel } from './MeasurementsPanel';
import { ProductSpread, ProductTile } from './ProductTiles';

type View = 'grila' | 'editorial';
const VIEW_KEY = 'cesarini.plp.view';

/**
 * Catalogul (PLP). Semnătura paginii: rândul de ocazii, așezat tipografic sub titlu („Pentru: Mire · Naș · Gală · Business”).
 * Restul filtrelor stau discret în coloana din stânga (pe telefon, într-un panou).
 */
export function Catalog({ category }: { category?: CategoryKey }) {
  const cart = useCart();
  const reduce = useReducedMotion();
  const base: Filters = useMemo(() => ({ ...EMPTY_FILTERS, categorie: category ? [category] : [] }), [category]);
  const [filters, setFilters] = useState<Filters>(base);
  const [sort, setSort] = useState<SortKey>('recomandate');
  const [view, setView] = useState<View>('grila');
  const [sheet, setSheet] = useState(false);
  const [customizing, setCustomizing] = useState<CommerceProduct | null>(null);
  const [ready, setReady] = useState(false);

  // starea inițială din URL și preferința de vizualizare
  useEffect(() => {
    const q = parseQuery(window.location.search, base);
    setFilters(q.filters);
    setSort(q.sort);
    try {
      const v = window.localStorage.getItem(VIEW_KEY);
      if (v === 'grila' || v === 'editorial') setView(v);
    } catch { /* fără stocare */ }
    setReady(true);
  }, [base]);

  // URL-ul reflectă filtrele, ca selecția să poată fi trimisă ca link
  useEffect(() => {
    if (!ready) return;
    const sameAsBase = filters.categorie.join() === base.categorie.join() && !filters.ocazie.length && !filters.croiala.length && !filters.culoare.length && !filters.piese.length;
    const qs = sameAsBase && sort === 'recomandate' ? '' : toQuery(filters, sort);
    try {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs}`);
    } catch { /* previzualizare: istoricul nu e disponibil */ }
  }, [filters, sort, ready, base]);

  const products = useMemo(() => applyFilters(filters, sort), [filters, sort]);
  const counts = useMemo(() => facetCounts(filters), [filters]);
  const nActive = activeCount(filters) - (category && filters.categorie.length === 1 && filters.categorie[0] === category ? 1 : 0);

  const toggle = <K extends keyof Filters>(group: K, key: Filters[K][number]) =>
    setFilters((f) => {
      const list = f[group] as string[];
      return { ...f, [group]: list.includes(key) ? list.filter((x) => x !== key) : [...list, key] };
    });
  const reset = () => setFilters(base);
  const chooseView = (v: View) => {
    setView(v);
    try { window.localStorage.setItem(VIEW_KEY, v); } catch { /* ignorăm */ }
  };

  const cat = category ? getCategory(category) : undefined;
  const prices = commerceProducts.map((p) => p.price);

  const chips = [
    ...filters.categorie.filter((c) => c !== category).map((c) => ({ group: 'categorie' as const, key: c, label: getCategory(c)!.label })),
    ...filters.croiala.map((c) => ({ group: 'croiala' as const, key: c, label: FIT_OPTIONS.find((o) => o.key === c)!.label })),
    ...filters.culoare.map((c) => ({ group: 'culoare' as const, key: c, label: COLOR_FAMILIES.find((o) => o.key === c)!.label })),
    ...filters.piese.map((c) => ({ group: 'piese' as const, key: c, label: PIECES_OPTIONS.find((o) => o.key === c)!.label })),
  ];

  const filterBody = (prefix: string) => (
    <div className="space-y-10">
      <FilterGroup title="Ocazie" className="lg:hidden">
        {OCCASIONS.map((o) => (
          <FilterOption key={o.key} id={`${prefix}-oc-${o.key}`} label={o.label} count={counts.ocazie[o.key]} checked={filters.ocazie.includes(o.key)} onChange={() => toggle('ocazie', o.key)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Categorie">
        {CATEGORIES.map((c) => (
          <FilterOption key={c.key} id={`${prefix}-cat-${c.key}`} label={c.label} count={counts.categorie[c.key]} checked={filters.categorie.includes(c.key)} onChange={() => toggle('categorie', c.key)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Culoare">
        {COLOR_FAMILIES.filter((o) => counts.culoare[o.key] > 0 || filters.culoare.includes(o.key)).map((o) => (
          <FilterOption key={o.key} id={`${prefix}-col-${o.key}`} label={o.label} count={counts.culoare[o.key]} checked={filters.culoare.includes(o.key)} onChange={() => toggle('culoare', o.key)} />
        ))}
      </FilterGroup>
      {(counts.piese['2-piese'] + counts.piese['3-piese'] > 0 || filters.piese.length > 0) && (
        <FilterGroup title="Costum">
          {PIECES_OPTIONS.map((o) => (
            <FilterOption key={o.key} id={`${prefix}-pc-${o.key}`} label={o.label} count={counts.piese[o.key]} checked={filters.piese.includes(o.key)} onChange={() => toggle('piese', o.key)} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Croială">
        {FIT_OPTIONS.map((o) => (
          <FilterOption key={o.key} id={`${prefix}-fit-${o.key}`} label={o.label} count={counts.croiala[o.key]} checked={filters.croiala.includes(o.key)} onChange={() => toggle('croiala', o.key)} />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="relative pb-section pt-32">
      {/* ——— Antet editorial ——— */}
      <header className="container-site">
        <p className="eyebrow flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold-400" />
          {cat ? `Collections · ${cat.label}` : editorial.seasonLabel}
        </p>
        <h1 className="mt-8 max-w-[14ch] text-balance font-display text-display-md font-normal text-ivory">
          {cat ? (
            cat.title
          ) : (
            <>
              Garderoba <em className="text-gold-400">Cesarini</em>
            </>
          )}
        </h1>
        <p className="lead mt-8 max-w-[38rem]">
          {cat
            ? cat.intro
            : `Costume, cămăși, pantofi și accesorii, de la ${formatRON(Math.min(...prices))} la ${formatRON(Math.max(...prices))}. Costumele și cămășile se pot croi pe măsurile tale.`}
        </p>

        {/* Semnătura: ocaziile, ca un rând de invitație */}
        <div role="group" aria-label="Filtrează după ocazie" className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-y sm:gap-x-2 border-gold-400/20 py-6">
          <span className="w-full text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-500 sm:mr-4 sm:w-auto">Pentru</span>
          {OCCASIONS.map((o, i) => {
            const on = filters.ocazie.includes(o.key);
            const disabled = !on && counts.ocazie[o.key] === 0;
            return (
              <span key={o.key} className="flex items-baseline">
                {i > 0 && <span aria-hidden className="mx-5 hidden h-1 w-1 rotate-45 self-center bg-gold-500/60 sm:block" />}
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={disabled}
                  onClick={() => toggle('ocazie', o.key)}
                  className={`relative min-h-11 cursor-pointer font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-none transition-colors duration-500 ease-expo disabled:cursor-not-allowed disabled:opacity-30 ${
                    on ? 'text-gold-300' : 'text-silk/60 hover:text-ivory'
                  }`}
                >
                  {o.label}
                  <span aria-hidden className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-gold-400 transition-transform duration-700 ease-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              </span>
            );
          })}
        </div>
      </header>

      {/* ——— Bara de instrumente ——— */}
      <div className="container-site mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-stone-400" aria-live="polite">
            <span className="font-display text-xl tabular-nums text-ivory">{products.length}</span> {products.length === 1 ? 'piesă' : 'piese'}
          </p>
          {chips.map((c) => (
            <button
              key={`${c.group}-${c.key}`}
              type="button"
              onClick={() => toggle(c.group, c.key as never)}
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-gold-400/30 px-3 text-xs text-silk transition-colors hover:border-gold-400"
              aria-label={`Scoate filtrul ${c.label}`}
            >
              {c.label}
              <svg aria-hidden viewBox="0 0 10 10" className="h-2 w-2"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
          ))}
          {nActive > 0 && (
            <button type="button" onClick={reset} className="min-h-9 cursor-pointer text-xs text-gold-300 underline-offset-4 hover:underline">
              Resetează
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setSheet(true)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-gold-400/30 px-4 text-[0.65rem] font-semibold uppercase tracking-wide2 text-silk lg:hidden"
          >
            Filtre{nActive ? ` (${nActive})` : ''}
          </button>
          <label className="relative flex items-center">
            <span className="sr-only">Sortează</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="min-h-11 cursor-pointer appearance-none border border-gold-400/30 bg-obsidian/60 py-2 pl-4 pr-10 text-sm text-silk focus:border-gold-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-4 h-1.5 w-2.5 text-gold-300"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" /></svg>
          </label>
          <div role="group" aria-label="Mod de afișare" className="hidden border border-gold-400/30 sm:flex">
            <ViewButton active={view === 'grila'} onClick={() => chooseView('grila')} label="Grilă">
              <path d="M1 1h4v4H1zM7 1h4v4H7zM13 1h4v4h-4zM1 7h4v4H1zM7 7h4v4H7zM13 7h4v4h-4zM1 13h4v4H1zM7 13h4v4H7zM13 13h4v4h-4z" />
            </ViewButton>
            <ViewButton active={view === 'editorial'} onClick={() => chooseView('editorial')} label="Editorial">
              <path d="M1 1h9v16H1zM12 3h5M12 6h5M12 9h3" />
            </ViewButton>
          </div>
        </div>
      </div>

      {/* ——— Corp ——— */}
      <div className="container-site mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Filtre">
          <div className="sticky top-28">{filterBody('d')}</div>
        </aside>

        <div className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="border border-gold-400/20 p-10 sm:p-14">
              <p className="font-display text-3xl text-ivory">Nicio piesă nu se potrivește tuturor filtrelor.</p>
              <p className="mt-4 max-w-prose text-stone-400">Scoate unul dintre filtre sau începe din nou. Cravatele, papioanele și butonii îi găsești în showroom.</p>
              <button type="button" onClick={reset} className={goldButtonClass('ghost', 'mt-8')}><span className="relative">Resetează filtrele</span></button>
            </div>
          ) : view === 'grila' ? (
            <motion.ul layout={!reduce} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-14 xl:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {products.map((p) => (
                  <motion.li
                    key={p.slug}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EXPO }}
                  >
                    <ProductTile p={p} onCustomize={setCustomizing} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <ul className="space-y-24 md:space-y-32">
              {products.map((p, i) => (
                <li key={p.slug}>
                  <ProductSpread p={p} flip={i % 2 === 1} onCustomize={setCustomizing} />
                </li>
              ))}
            </ul>
          )}

          {/* Cererea clientului: să se știe că în showroom sunt mult mai multe modele */}
          <aside className="mt-20 grid gap-6 border border-gold-400/20 bg-obsidian/60 p-7 backdrop-blur-md sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow">Showroom {verified.city}</p>
              <p className="mt-4 font-display text-[1.75rem] leading-snug text-ivory">
                În showroom te așteaptă <span className="text-gold-400">mult mai multe modele</span> decât vezi aici.
              </p>
              <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-stone-400">
                Pe site sunt piesele cele mai cerute. Restul colecției, cravatele, papioanele și butonii le probezi pe {verified.street}.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link href="/atelier" className={goldButtonClass('ghost')}><span className="relative">Programează o vizită</span></Link>
              <a href={`tel:${verified.phoneE164}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-silk/80 hover:text-gold-300">sau sună: <span className="text-ivory">{verified.phoneDisplay}</span></a>
            </div>
          </aside>
        </div>
      </div>

      {/* Filtre pe telefon */}
      <SidePanel
        open={sheet}
        onClose={() => setSheet(false)}
        eyebrow="Filtre"
        title="Rafinează"
        closeLabel="Închide filtrele"
        footer={
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={reset} className="min-h-12 cursor-pointer text-[0.68rem] font-semibold uppercase tracking-wide2 text-stone-400 hover:text-gold-300">Resetează</button>
            <button type="button" onClick={() => setSheet(false)} className={goldButtonClass('solid')}>
              <span className="relative">Vezi {products.length} {products.length === 1 ? 'piesă' : 'piese'}</span>
            </button>
          </div>
        }
      >
        <div className="px-6 py-8 sm:px-10">{filterBody('m')}</div>
      </SidePanel>

      {customizing && (
        <MeasurementsPanel
          open={!!customizing}
          onClose={() => setCustomizing(null)}
          garment={customizing.garment}
          productName={customizing.name}
          initial={cart.measureProfile[customizing.garment]}
          onSave={(m) => {
            cart.saveMeasureProfile(customizing.garment, m);
            cart.add(customizing.slug, { type: 'custom', measurements: m });
            setCustomizing(null);
          }}
        />
      )}
    </div>
  );
}

function FilterGroup({ title, className = '', children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <fieldset className={className}>
      <legend className="eyebrow mb-4">{title}</legend>
      <ul className="border-t border-gold-400/15">{children}</ul>
    </fieldset>
  );
}

function FilterOption({ id, label, count, checked, onChange }: { id: string; label: string; count: number; checked: boolean; onChange: () => void }) {
  const disabled = !checked && count === 0;
  return (
    <li className="border-b border-gold-400/15">
      <label htmlFor={id} className={`flex min-h-12 items-center gap-3 text-[0.95rem] transition-colors ${disabled ? 'cursor-not-allowed text-stone-600' : 'cursor-pointer text-silk/85 hover:text-ivory'}`}>
        <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
        <span aria-hidden className={`grid h-4 w-4 shrink-0 place-items-center border transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-gold-300 ${checked ? 'border-gold-400 bg-gold-400 text-obsidian' : 'border-gold-400/40'}`}>
          {checked && <svg viewBox="0 0 12 12" className="h-2.5 w-2.5"><path d="M2.5 6.2l2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}
        </span>
        <span className="flex-1">{label}</span>
        <span className="text-xs tabular-nums text-stone-500">{count}</span>
      </label>
    </li>
  );
}

function ViewButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 cursor-pointer place-items-center transition-colors ${active ? 'bg-gold-400 text-obsidian' : 'text-silk hover:text-gold-300'}`}
    >
      <svg aria-hidden viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1">{children}</svg>
    </button>
  );
}
