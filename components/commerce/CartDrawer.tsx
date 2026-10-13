'use client';

import Link from 'next/link';
import { formatRON, verified } from '@/lib/brand';
import { commerceConfig, getProduct, productHref } from '@/lib/commerce/catalog';
import { unitPrice } from '@/lib/commerce/cart';
import { SidePanel } from '../ui/SidePanel';
import { goldButtonClass } from '../ui/GoldButton';
import { useCart } from './CartProvider';
import { ArrowRight, Diamond, ItemThumb, QtyStepper, fitLine } from './parts';

export function CartDrawer() {
  const cart = useCart();
  const empty = cart.items.length === 0;

  return (
    <SidePanel
      open={cart.isOpen}
      onClose={cart.close}
      eyebrow="Coșul tău"
      title={empty ? 'Coșul e gol' : <>Garderoba <em className="text-gold-400">ta</em></>}
      subtitle={empty ? undefined : `${cart.totals.count} ${cart.totals.count === 1 ? 'piesă' : 'piese'} · livrare în 1 – 2 zile lucrătoare`}
      closeLabel="Închide coșul"
      footer={
        empty ? undefined : (
          <div className="space-y-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-400">
                <dt>Livrare · 1 – 2 zile lucrătoare</dt>
                <dd className="tabular-nums">{commerceConfig.shippingFee ? formatRON(commerceConfig.shippingFee) : 'Gratuită'}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-display text-xl text-ivory">Total</dt>
                <dd className="font-display text-2xl tabular-nums text-gold-300">{formatRON(cart.totals.total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" onClick={cart.close} className={goldButtonClass('solid', 'w-full')}>
              <span className="relative">Finalizează comanda</span>
              <ArrowRight className="relative h-2 w-6" />
            </Link>
          </div>
        )
      }
    >
      {empty ? (
        <div className="px-6 py-12 sm:px-10">
          <p className="lead max-w-prose">
            Alege o piesă, apoi decide: mărime standard, cu livrare în 1 – 2 zile, sau croită pe măsurile tale.
          </p>
          <ul className="mt-10 space-y-px border border-gold-400/20 bg-gold-400/20">
            {['costum-ceremonie', 'costum-business-casual', 'camasa-oxford-white'].map((slug) => {
              const p = getProduct(slug)!;
              return (
                <li key={slug}>
                  <Link href={productHref(slug)} onClick={cart.close} className="group flex items-center justify-between gap-4 bg-charcoal px-5 py-4 transition-colors hover:bg-graphite">
                    <span className="font-display text-lg text-ivory group-hover:text-gold-100">{p.name}</span>
                    <span className="whitespace-nowrap text-sm tabular-nums text-gold-300">{formatRON(p.price)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <ul className="divide-y divide-gold-400/15 px-6 sm:px-10">
          {cart.items.map((i) => {
            const p = getProduct(i.slug);
            if (!p) return null;
            return (
              <li key={i.id} className="flex gap-5 py-6">
                <ItemThumb slug={i.slug} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={productHref(i.slug)} onClick={cart.close} className="font-display text-lg leading-snug text-ivory transition-colors hover:text-gold-100">
                      {p.name}
                    </Link>
                    <span className="whitespace-nowrap text-sm tabular-nums text-silk">{formatRON(unitPrice(i) * i.qty)}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-[0.8rem] text-stone-400">
                    {i.fit.type === 'custom' && <Diamond />}
                    {fitLine(i)}
                  </p>
                  {i.monogram?.text && <p className="mt-1 text-[0.8rem] text-stone-500">Monogramă „{i.monogram.text}”</p>}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                    <QtyStepper value={i.qty} onChange={(n) => cart.setQty(i.id, n)} label={p.name} />
                    <button
                      type="button"
                      onClick={() => cart.remove(i.id)}
                      className="min-h-11 cursor-pointer text-[0.68rem] font-semibold uppercase tracking-wide2 text-stone-500 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
                    >
                      Elimină
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="py-6 text-sm leading-relaxed text-stone-400">
            {verified.delivery} Monograma pe căptușeală o alegi la finalizarea comenzii.
          </li>
        </ul>
      )}
    </SidePanel>
  );
}
