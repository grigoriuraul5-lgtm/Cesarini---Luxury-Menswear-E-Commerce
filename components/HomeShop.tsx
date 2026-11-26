'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CATEGORIES, commerceProducts, getProduct, type CategoryKey, type CommerceProduct } from '@/lib/commerce/catalog';
import { ProductTile } from './commerce/ProductTiles';
import { MeasurementsPanel } from './commerce/MeasurementsPanel';
import { useCart } from './commerce/CartProvider';
import { goldButtonClass } from './ui/GoldButton';
import { Reveal, EXPO } from './ui/Reveal';

/**
 * Vitrina magazinului pe prima pagină (24.11.2026): produsele de vânzare apar direct sub hero,
 * cu prețuri, file pe categorii și adăugare în coș (croit pe măsură). „Vezi toate” duce în catalog.
 */
const PER_VIEW = 8;

/** „Toate”: o selecție amestecată, ca prima privire să arate toată gama casei. */
/** Fără piesele deja aflate în vitrina hero-ului (HERO_PICKS), ca prima pagină să nu se repete. */
const CURATED = [
  'costum-ceremonie-alb-crem-c10',
  'costum-business-caramiziu-b15',
  'camasa-alba-papion',
  'pantofi-oxford-medalion-bordo',
  'costum-ceremonie-verde-inchis-c07',
  'costum-business-gri-dungi-b03',
  'curea-piele-neagra',
  'costum-ceremonie-bleumarin-c13',
];

type Tab = 'toate' | CategoryKey;

export function HomeShop() {
  const [tab, setTab] = useState<Tab>('toate');
  const [customizing, setCustomizing] = useState<CommerceProduct | null>(null);
  const cart = useCart();
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<string, number> = { toate: commerceProducts.length };
    for (const p of commerceProducts) c[p.categoryKey] = (c[p.categoryKey] ?? 0) + 1;
    return c;
  }, []);

  const shown = useMemo(() => {
    if (tab === 'toate') return CURATED.map((s) => getProduct(s)).filter(Boolean) as CommerceProduct[];
    return commerceProducts
      .filter((p) => p.categoryKey === tab)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, PER_VIEW);
  }, [tab]);

  const tabs: { key: Tab; label: string }[] = [{ key: 'toate', label: 'Toate' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label }))];
  const total = counts[tab] ?? 0;
  const allHref = tab === 'toate' ? '/colectii' : `/colectii/${tab}`;

  return (
    <section id="magazin" aria-labelledby="magazin-title" className="relative scroll-mt-20 border-t border-gold-400/20 pb-[clamp(3rem,7vw,6rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">
      <div className="container-site">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-gold-400" />
              Magazin online · {counts.toate} de piese
            </p>
            <h2 id="magazin-title" className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-normal leading-tight text-ivory">
              Alege-ți ținuta, <span className="text-gold-400">direct de aici.</span>
            </h2>
          </div>
          <p className="hidden max-w-[26rem] text-[0.95rem] leading-relaxed text-stone-400 sm:block lg:pb-1 lg:text-right">
            Prețurile sunt la vedere. Costumele și cămășile se pot croi și pe măsurile tale.
          </p>
        </Reveal>

        {/* File pe categorii: pe telefon un rând care se derulează lateral */}
        <div role="group" aria-label="Alege categoria" className="no-scrollbar -mx-gutter mt-5 flex gap-2 overflow-x-auto px-gutter pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((t) => {
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={on}
                onClick={() => setTab(t.key)}
                className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-[0.68rem] font-semibold uppercase tracking-wide2 transition-all duration-500 ease-expo ${
                  on ? 'border-gold-400 bg-gold-400 text-obsidian' : 'border-gold-400/25 text-silk/85 hover:border-gold-400/60 hover:text-ivory'
                }`}
              >
                {t.label}
                <span className={`tabular-nums ${on ? 'text-obsidian/70' : 'text-stone-500'}`}>{counts[t.key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EXPO }}
            className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14"
          >
            {shown.map((p) => (
              <li key={p.slug}>
                <ProductTile p={p} onCustomize={setCustomizing} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-gold-400/15 pt-10 text-center">
          <Link href={allHref} className={goldButtonClass('solid')}>
            <span className="relative">
              Vezi toate cele {total} {total === 1 ? 'piesă' : 'piese'}
            </span>
          </Link>
          <p className="text-sm text-stone-500">În showroom te așteaptă mult mai multe modele.</p>
        </div>
      </div>

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
    </section>
  );
}

/** Grilă simplă de produse (cu „Personalizează măsurile”), refolosită pe paginile de ocazie, de ex. /costume-de-mire. */
export function ProductGrid({ products }: { products: CommerceProduct[] }) {
  const [customizing, setCustomizing] = useState<CommerceProduct | null>(null);
  const cart = useCart();
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductTile p={p} onCustomize={setCustomizing} />
          </li>
        ))}
      </ul>
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
    </>
  );
}
