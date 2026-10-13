'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { formatRON, verified } from '@/lib/brand';
import { categoryHref, commerceConfig, getCategory, getProduct, isMtm, sizeHeading, sizeLabel } from '@/lib/commerce/catalog';
import { bodySummary, calibrationSummary, isComplete, type Measurements } from '@/lib/commerce/measurements';
import { LuxImage } from '../ui/LuxImage';
import { EXPO } from '../ui/Reveal';
import { goldButtonClass } from '../ui/GoldButton';
import { useCart } from './CartProvider';
import { MeasurementsPanel } from './MeasurementsPanel';
import { ArrowRight, Diamond } from './parts';

type Fit = 'standard' | 'custom';

/**
 * Pagina de produs (PDP): galerie editorială în stânga, decizia de cumpărare în dreapta (lipită la scroll).
 * Decizia principală e croiala: mărime standard SAU croit pe măsură; restul paginii o susține.
 */
export function ProductPage({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const cart = useCart();
  const reduce = useReducedMotion();
  const uid = useId();

  const [shot, setShot] = useState(0);
  const [fit, setFit] = useState<Fit>('standard');
  const [size, setSize] = useState<string | null>(null);
  const [measures, setMeasures] = useState<Measurements | undefined>(() => cart.measureProfile[p.garment]);
  const [panel, setPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mtm = isMtm(p.garment);
  const profile = cart.measureProfile[p.garment];
  // profilul de măsuri se încarcă din browser după montare: îl preluăm dacă nu ai introdus deja altele
  useEffect(() => {
    if (profile && !measures) setMeasures(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  const price = p.price + (fit === 'custom' ? commerceConfig.customFitSurcharge : 0);
  const customReady = isComplete(p.garment, measures);

  function chooseFit(f: Fit) {
    setFit(f);
    setError(null);
    if (f === 'custom' && !customReady) setPanel(true);
  }

  function addToCart() {
    if (fit === 'standard' && !size) {
      setError(p.sizeSystem === 'guler' ? 'Alege mărimea gulerului.' : p.sizeSystem === 'lungime' ? 'Alege lungimea.' : 'Alege o mărime.');
      document.getElementById(`${uid}-sizes`)?.focus();
      return;
    }
    if (fit === 'custom' && !customReady) {
      setError('Completează măsurile ca să putem croi piesa pentru tine.');
      setPanel(true);
      return;
    }
    setError(null);
    cart.add(p.slug, fit === 'standard' ? { type: 'standard', size: size! } : { type: 'custom', measurements: measures! });
  }

  const ctaLabel = `Adaugă în coș · ${formatRON(price)}`;

  return (
    <article className="relative pb-32 pt-28 lg:pb-section lg:pt-32">
      <div className="container-site">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-wide2 text-stone-500">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <li><Link href="/" className="inline-flex min-h-10 items-center transition-colors hover:text-gold-300">Acasă</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={categoryHref(p.categoryKey)} className="inline-flex min-h-10 items-center transition-colors hover:text-gold-300">{getCategory(p.categoryKey)?.title ?? p.category}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-silk/80">{p.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ——— Galerie ——— */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden border border-gold-400/20">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={shot}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EXPO }}
                >
                  <LuxImage media={p.gallery[shot]} priority={shot === 0} sizes="(min-width: 1024px) 56vw, 100vw" className="aspect-[4/5]" />
                </motion.div>
              </AnimatePresence>
              <span className="pointer-events-none absolute left-4 top-4 border border-gold-400/20 bg-obsidian/40 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wide2 text-silk backdrop-blur-md">
                {p.category}
              </span>
            </div>
            <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Alte fotografii">
              {p.gallery.map((m, i) => (
                <li key={m.src}>
                  <button
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Fotografia ${i + 1}: ${m.alt}`}
                    aria-pressed={shot === i}
                    className={`block w-full cursor-pointer border transition-all duration-500 ease-expo ${shot === i ? 'border-gold-400' : 'border-gold-400/20 opacity-60 hover:opacity-100'}`}
                  >
                    <LuxImage media={m} sizes="12vw" zoom={false} className="aspect-square" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ——— Decizia de cumpărare ——— */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-gold-400" />
                {p.category}
              </p>
              <h1 className="mt-6 text-balance font-display text-[clamp(2.25rem,1.6rem+2vw,3.5rem)] font-normal leading-[1.05] text-ivory">{p.name}</h1>
              <p className="mt-5 font-display text-3xl tabular-nums text-gold-400">{formatRON(price)}</p>
              <p className="lead mt-5 max-w-prose">{p.lead}</p>

              {/* Croiala (doar costume și cămăși) */}
              {mtm && (
              <fieldset className="mt-10">
                <legend className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-400">Cum vrei să fie croit?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <FitOption
                    name={`${uid}-fit`}
                    checked={fit === 'standard'}
                    onSelect={() => chooseFit('standard')}
                    title="Mărime standard"
                    body="Din stoc. Livrare în 1 – 2 zile lucrătoare."
                  />
                  <FitOption
                    name={`${uid}-fit`}
                    checked={fit === 'custom'}
                    onSelect={() => chooseFit('custom')}
                    title="Croit pe măsură"
                    body={commerceConfig.customFitSurcharge ? `Pe măsurile tale · +${formatRON(commerceConfig.customFitSurcharge)}` : 'Pe măsurile tale, fără cost suplimentar.'}
                    accent
                  />
                </div>
              </fieldset>
              )}

              {/* Mărimi sau rezumatul măsurilor */}
              <div className="mt-8 min-h-[9rem]">
                {fit === 'standard' ? (
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p id={`${uid}-size-label`} className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-400">
                        {sizeHeading(p)}
                      </p>
                      {size && <p className="text-sm text-gold-300">{sizeLabel(p, size)}</p>}
                    </div>
                    <div id={`${uid}-sizes`} tabIndex={-1} role="radiogroup" aria-labelledby={`${uid}-size-label`} className="mt-4 grid grid-cols-4 gap-2 focus:outline-none sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7">
                      {p.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={size === s}
                          onClick={() => { setSize(s); setError(null); }}
                          className={`min-h-12 cursor-pointer border font-display text-lg tabular-nums transition-all duration-300 ease-expo ${
                            size === s ? 'border-gold-400 bg-gold-400 text-obsidian' : 'border-gold-400/20 text-silk hover:border-gold-400/60 hover:text-ivory'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-stone-400">
                      Nu ești sigur de mărime? După comandă, un consultant te sună să o confirmăm împreună.
                    </p>
                  </div>
                ) : customReady ? (
                  <div className="border border-gold-400/30 bg-gold-400/[0.04] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <p className="flex items-center gap-3 font-display text-lg text-ivory">
                        <Diamond /> Măsurile tale sunt salvate
                      </p>
                      <button type="button" onClick={() => setPanel(true)} className="min-h-11 cursor-pointer text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-300 underline-offset-4 hover:underline">
                        Editează
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-silk/85">{bodySummary(p.garment, measures!)} cm</p>
                    <p className="mt-1 text-sm text-stone-400">{calibrationSummary(measures!)}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPanel(true)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 border border-dashed border-gold-400/40 p-5 text-left transition-colors duration-500 hover:border-gold-400"
                  >
                    <span>
                      <span className="block font-display text-lg text-ivory">Introdu măsurile</span>
                      <span className="mt-1 block text-sm text-stone-400">Ghid ilustrat pentru fiecare măsură · cam 5 minute</span>
                    </span>
                    <span className="text-gold-300"><ArrowRight /></span>
                  </button>
                )}
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button type="button" onClick={addToCart} className={goldButtonClass('solid', 'mt-6 hidden w-full lg:inline-flex')}>
                <span className="relative">{ctaLabel}</span>
              </button>

              {/* Garanțiile casei: fapte, nu iconițe */}
              <ul className="mt-8 grid gap-3 text-sm text-silk/85 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {(mtm ? ['Ajustări gratuite în showroom', 'Livrare în 1 – 2 zile lucrătoare', 'Consultant la telefon'] : ['Livrare în 1 – 2 zile lucrătoare', 'Consultant la telefon', 'Showroom în Cluj-Napoca']).map((t) => (
                  <li key={t} className="flex items-center gap-3"><Diamond />{t}</li>
                ))}
              </ul>

              {/* Detalii */}
              <div className="mt-10 border-t border-gold-400/20">
                <Disclosure title="Detalii produs" defaultOpen>
                  <ul className="space-y-2">
                    {p.details.map((d) => <li key={d} className="flex gap-3"><span aria-hidden className="text-gold-500">—</span>{d}</li>)}
                  </ul>
                </Disclosure>
                <Disclosure title="Livrare și ajustări">
                  <p>{verified.delivery}</p>
                  <p className="mt-3">{verified.freeAlterations}</p>
                </Disclosure>
                {mtm && (
                <Disclosure title="Cum funcționează croit pe măsură">
                  <ol className="space-y-2">
                    <li>1. Introduci măsurile, cu ghidul ilustrat pentru fiecare.</li>
                    <li>2. Un consultant te sună și le verifică împreună cu tine.</li>
                    <li>3. Croitorii casei pregătesc piesa pe măsurile tale.</li>
                  </ol>
                </Disclosure>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bara de cumpărare pe mobil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-400/20 bg-obsidian/85 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-md lg:hidden">
        <button type="button" onClick={addToCart} className={goldButtonClass('solid', 'w-full')}>
          <span className="relative">{ctaLabel}</span>
        </button>
      </div>

      {mtm && (
      <MeasurementsPanel
        open={panel}
        onClose={() => setPanel(false)}
        garment={p.garment}
        productName={p.name}
        initial={measures}
        onSave={(m) => {
          setMeasures(m);
          cart.saveMeasureProfile(p.garment, m);
          setFit('custom');
          setError(null);
          setPanel(false);
        }}
      />
      )}
    </article>
  );
}

function FitOption({ name, checked, onSelect, title, body, accent }: { name: string; checked: boolean; onSelect: () => void; title: string; body: string; accent?: boolean }) {
  return (
    <label
      className={`relative flex min-h-[7.5rem] cursor-pointer flex-col justify-between border p-5 transition-all duration-500 ease-expo has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-gold-300 ${
        checked ? 'border-gold-400 bg-gold-400/[0.06] shadow-gold-soft' : 'border-gold-400/20 hover:border-gold-400/50'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span className="flex items-start justify-between gap-3">
        <span className={`font-display text-xl ${checked ? 'text-ivory' : 'text-silk'}`}>
          {accent ? <em className="text-gold-300">{title}</em> : title}
        </span>
        <span aria-hidden className={`mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${checked ? 'border-gold-400' : 'border-gold-400/40'}`}>
          {checked && <span className="h-2 w-2 rounded-full bg-gold-400" />}
        </span>
      </span>
      <span className="mt-3 text-sm leading-relaxed text-stone-400">{body}</span>
    </label>
  );
}

function Disclosure({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-gold-400/20">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg text-ivory [&::-webkit-details-marker]:hidden">
        {title}
        <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 text-gold-300 transition-transform duration-500 ease-expo group-open:rotate-45">
          <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </summary>
      <div className="pb-6 text-[0.95rem] leading-relaxed text-stone-400">{children}</div>
    </details>
  );
}
