'use client';

import Link from 'next/link';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatRON, verified } from '@/lib/brand';
import { commerceConfig } from '@/lib/commerce/catalog';
import { JUDETE } from '@/lib/commerce/judete';
import {
  EMAIL_RE, PHONE_RE, POSTAL_RE, buildOrderPayload, newOrderId, normalizePhone,
  type OrderDraft, type OrderPayload, type PaymentProvider,
} from '@/lib/commerce/order';
import { EXPO } from '../ui/Reveal';
import { goldButtonClass } from '../ui/GoldButton';
import { useCart } from './CartProvider';
import { OrderSummary } from './OrderSummary';
import { Diamond } from './parts';

type Status = 'idle' | 'processing' | 'done' | 'error';
type Errors = Record<string, string>;

const field =
  'mt-2 block w-full min-h-12 border border-gold-400/20 bg-obsidian/60 px-4 text-base text-ivory placeholder:text-stone-600 transition-colors duration-300 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/40 aria-[invalid=true]:border-red-400/70';
const labelCls = 'text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-400';

/* ——— Validare card (doar pentru simularea Stripe; datele NU părăsesc componenta) ——— */
const luhn = (num: string) => {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = Number(num[num.length - 1 - i]);
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};
const formatCard = (s: string) => s.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const formatExp = (s: string) => {
  const d = s.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/**
 * Checkout VIP: o singură pagină în trei pași numerotați (contact → livrare → plată),
 * sumarul lipit în dreapta (pe mobil: pliabil, sus). Validare la ieșirea din câmp; la trimitere,
 * focus pe primul câmp greșit. Plata e simulată (`commerceConfig.paymentMode = 'demo'`).
 */
export function Checkout() {
  const cart = useCart();
  const uid = useId();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [provider, setProvider] = useState<PaymentProvider>('stripe');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });
  const [result, setResult] = useState<{ payload: OrderPayload; firstName: string; delivered: 'server' | 'local' } | null>(null);
  const hasCustom = cart.items.some((i) => i.fit.type === 'custom');

  if (status === 'done' && result) return <Confirmation {...result} />;

  if (cart.items.length === 0)
    return (
      <Shell>
        <div className="container-site py-section">
          <p className="eyebrow">Finalizare comandă</p>
          <h1 className="mt-6 font-display text-display-sm font-normal text-ivory">Coșul e gol.</h1>
          <p className="mt-6 max-w-prose font-serif text-lg text-silk/85">Alege o piesă din colecție și revino aici ca să finalizezi comanda.</p>
          <Link href="/produs/costum-ceremonie" className={goldButtonClass('solid', 'mt-10')}>
            <span className="relative">Vezi costumul de ceremonie</span>
          </Link>
        </div>
      </Shell>
    );

  /* ——— validare ——— */
  function check(name: string, value: string): string | null {
    const v = value.trim();
    switch (name) {
      case 'firstName': return v ? null : 'Scrie prenumele.';
      case 'lastName': return v ? null : 'Scrie numele.';
      case 'email': return EMAIL_RE.test(v) ? null : 'O adresă de email validă, de exemplu nume@gmail.com.';
      case 'phone': return PHONE_RE.test(normalizePhone(v)) ? null : 'Un număr de mobil valid, de exemplu 0723 424 929.';
      case 'street': return v.length >= 5 ? null : 'Strada, numărul și, dacă e cazul, blocul și apartamentul.';
      case 'city': return v ? null : 'Scrie localitatea.';
      case 'county': return v ? null : 'Alege județul.';
      case 'postalCode': return POSTAL_RE.test(v) ? null : 'Codul poștal are 6 cifre, de exemplu 400104.';
      case 'cardNumber': return provider !== 'stripe' || (v.replace(/\s/g, '').length >= 13 && luhn(v.replace(/\s/g, ''))) ? null : 'Numărul cardului nu e valid.';
      case 'cardExp': {
        if (provider !== 'stripe') return null;
        const m = /^(\d{2})\/(\d{2})$/.exec(v);
        if (!m || +m[1] < 1 || +m[1] > 12) return 'Data expirării, în formatul LL/AA.';
        const exp = new Date(2000 + +m[2], +m[1], 0, 23, 59);
        return exp >= new Date() ? null : 'Cardul a expirat.';
      }
      case 'cardCvc': return provider !== 'stripe' || /^\d{3,4}$/.test(v) ? null : 'Codul de 3 cifre de pe spatele cardului.';
      case 'cardName': return provider !== 'stripe' || v ? null : 'Numele, așa cum apare pe card.';
      default: return null;
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const msg = check(e.target.name, e.target.value);
    setErrors((x) => {
      const n = { ...x };
      if (msg) n[e.target.name] = msg; else delete n[e.target.name];
      return n;
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const names = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'county', 'postalCode', 'cardNumber', 'cardExp', 'cardCvc', 'cardName'];
    const next: Errors = {};
    names.forEach((n) => {
      const val = n.startsWith('card') ? card[({ cardNumber: 'number', cardExp: 'exp', cardCvc: 'cvc', cardName: 'name' } as const)[n as 'cardNumber']] : fd[n] ?? '';
      const msg = check(n, val);
      if (msg) next[n] = msg;
    });
    cart.items.forEach((i) => {
      if (i.monogram && !i.monogram.text) next[`mono-${i.id}`] = 'Scrie inițialele pentru monogramă sau debifează opțiunea.';
    });
    if (!fd.terms) next.terms = 'Ca să plasăm comanda, avem nevoie de acordul tău cu termenii.';
    if (hasCustom && !fd.measurementsConsent) next.measurementsConsent = 'Avem nevoie de acordul tău ca să folosim măsurile la croire.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      first?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    setStatus('processing');
    // Simulare de plată: în modul live, aici se confirmă PaymentIntent-ul Stripe (Payment Element)
    // sau se face redirect către pagina NETOPIA. Datele cardului nu ajung niciodată la serverul nostru.
    await new Promise((r) => setTimeout(r, 1400));

    const draft: OrderDraft = {
      customer: { firstName: fd.firstName.trim(), lastName: fd.lastName.trim(), email: fd.email.trim(), phone: fd.phone.trim() },
      shipping: { street: fd.street.trim(), city: fd.city.trim(), county: fd.county, postalCode: fd.postalCode.trim(), notes: fd.notes?.trim() || undefined },
      items: cart.items,
      payment: { provider, status: 'paid', mode: commerceConfig.paymentMode, reference: `${provider === 'stripe' ? 'pi' : 'ntp'}_demo_${Date.now().toString(36)}` },
      consent: { terms: true, measurements: hasCustom ? true : false },
    };

    let payload: OrderPayload;
    let delivered: 'server' | 'local' = 'server';
    try {
      const res = await fetch('/api/comanda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
      if (res.status === 422) throw Object.assign(new Error('validation'), { fatal: true });
      if (!res.ok) throw new Error(String(res.status));
      payload = (await res.json()).payload;
    } catch (err) {
      if ((err as { fatal?: boolean }).fatal) {
        setStatus('error');
        return;
      }
      // Previzualizare / fișier local: nu există server. Construim același payload în browser.
      payload = buildOrderPayload(draft, { orderId: newOrderId(), createdAt: new Date().toISOString() });
      delivered = 'local';
    }
    cart.clear();
    setResult({ payload, firstName: draft.customer.firstName, delivered });
    setStatus('done');
    window.scrollTo({ top: 0 });
  }

  const err = (n: string) => errors[n];
  const inputProps = (n: string) => ({
    id: `${uid}-${n}`,
    name: n,
    onBlur,
    'aria-invalid': !!err(n),
    'aria-describedby': err(n) ? `${uid}-${n}-err` : undefined,
    className: field,
  });
  const Err = ({ n }: { n: string }) => (err(n) ? <p id={`${uid}-${n}-err`} className="mt-2 text-xs text-red-300">{err(n)}</p> : null);

  return (
    <Shell>
      <div className="container-site pb-section pt-10">
        <h1 className="sr-only">Finalizare comandă</h1>

        {/* Sumar pliabil pe mobil */}
        <details className="group mb-10 border border-gold-400/20 bg-charcoal/60 lg:hidden">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 [&::-webkit-details-marker]:hidden">
            <span className="text-sm text-gold-200">
              <span className="group-open:hidden">Vezi sumarul comenzii</span>
              <span className="hidden group-open:inline">Ascunde sumarul</span>
            </span>
            <span className="font-display text-xl tabular-nums text-gold-300">{formatRON(cart.totals.total)}</span>
          </summary>
          <div className="border-t border-gold-400/20 p-5">
            <OrderSummary idPrefix={`${uid}-m`} />
          </div>
        </details>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <form noValidate onSubmit={onSubmit} className="space-y-14 lg:col-span-7">
            <Step n="01" title="Date de contact">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor={`${uid}-firstName`} className={labelCls}>Prenume</label><input {...inputProps('firstName')} autoComplete="given-name" /><Err n="firstName" /></div>
                <div><label htmlFor={`${uid}-lastName`} className={labelCls}>Nume</label><input {...inputProps('lastName')} autoComplete="family-name" /><Err n="lastName" /></div>
                <div><label htmlFor={`${uid}-email`} className={labelCls}>Email</label><input {...inputProps('email')} type="email" autoComplete="email" inputMode="email" /><Err n="email" /></div>
                <div><label htmlFor={`${uid}-phone`} className={labelCls}>Telefon mobil</label><input {...inputProps('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="07xx xxx xxx" /><Err n="phone" /></div>
              </div>
              <p className="mt-4 text-sm text-stone-400">Te sunăm o singură dată, ca să confirmăm mărimea sau măsurile.</p>
            </Step>

            <Step n="02" title="Livrare">
              <div className="grid gap-5 sm:grid-cols-6">
                <div className="sm:col-span-6"><label htmlFor={`${uid}-street`} className={labelCls}>Adresă</label><input {...inputProps('street')} autoComplete="street-address" placeholder="Strada, număr, bloc, apartament" /><Err n="street" /></div>
                <div className="sm:col-span-3"><label htmlFor={`${uid}-city`} className={labelCls}>Localitate</label><input {...inputProps('city')} autoComplete="address-level2" /><Err n="city" /></div>
                <div className="sm:col-span-3">
                  <label htmlFor={`${uid}-county`} className={labelCls}>Județ</label>
                  <select {...inputProps('county')} defaultValue="" autoComplete="address-level1" className={`${field} cursor-pointer appearance-none`}>
                    <option value="" disabled>Alege județul</option>
                    {JUDETE.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <Err n="county" />
                </div>
                <div className="sm:col-span-2"><label htmlFor={`${uid}-postalCode`} className={labelCls}>Cod poștal</label><input {...inputProps('postalCode')} autoComplete="postal-code" inputMode="numeric" maxLength={6} /><Err n="postalCode" /></div>
                <div className="sm:col-span-4"><label htmlFor={`${uid}-notes`} className={labelCls}>Observații pentru curier (opțional)</label><input id={`${uid}-notes`} name="notes" className={field} placeholder="Interfon, interval orar…" /></div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border border-gold-400/20 bg-obsidian/40 px-5 py-4">
                <span className="flex items-center gap-3 text-sm text-silk"><Diamond />Curier · 1 – 2 zile lucrătoare</span>
                <span className="text-sm tabular-nums text-gold-300">{commerceConfig.shippingFee ? formatRON(commerceConfig.shippingFee) : 'Gratuită'}</span>
              </div>
              {hasCustom && <p className="mt-3 text-sm text-stone-400">Pentru piesele croite pe măsură, termenul de livrare îl confirmă consultantul la telefon.</p>}
            </Step>

            <Step n="03" title="Plată">
              <div role="radiogroup" aria-label="Metoda de plată" className="grid gap-3 sm:grid-cols-2">
                {([
                  { id: 'stripe', title: 'Card bancar', sub: 'Visa, Mastercard · procesat de Stripe' },
                  { id: 'netopia', title: 'Card prin NETOPIA', sub: 'Pagină securizată NETOPIA Payments' },
                ] as const).map((o) => (
                  <label key={o.id} className={`flex min-h-[5.5rem] cursor-pointer items-start justify-between gap-4 border p-5 transition-all duration-500 ease-expo has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-gold-300 ${provider === o.id ? 'border-gold-400 bg-gold-400/[0.06]' : 'border-gold-400/20 hover:border-gold-400/50'}`}>
                    <input type="radio" name="provider" value={o.id} checked={provider === o.id} onChange={() => { setProvider(o.id); setErrors({}); }} className="sr-only" />
                    <span>
                      <span className="block font-display text-lg text-ivory">{o.title}</span>
                      <span className="mt-1 block text-xs text-stone-400">{o.sub}</span>
                    </span>
                    <span aria-hidden className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${provider === o.id ? 'border-gold-400' : 'border-gold-400/40'}`}>
                      {provider === o.id && <span className="h-2 w-2 rounded-full bg-gold-400" />}
                    </span>
                  </label>
                ))}
              </div>

              {commerceConfig.paymentMode === 'demo' && (
                <p className="mt-6 border border-gold-400/30 bg-gold-400/[0.05] px-5 py-4 text-sm leading-relaxed text-gold-100">
                  Mod demonstrativ: nu se încarcă niciun card. Nu introduce date reale; folosește cardul de test 4242 4242 4242 4242, orice dată viitoare și orice CVC.
                </p>
              )}

              {provider === 'stripe' ? (
                <div className="mt-6 grid gap-5 border border-gold-400/20 bg-obsidian/40 p-5 sm:grid-cols-6 sm:p-6">
                  {/* autoComplete="off": în demo nu vrem ca browserul să completeze un card real */}
                  <div className="sm:col-span-6">
                    <label htmlFor={`${uid}-cardNumber`} className={labelCls}>Numărul cardului</label>
                    <input {...inputProps('cardNumber')} value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" className={`${field} tabular-nums tracking-wider`} />
                    <Err n="cardNumber" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-cardExp`} className={labelCls}>Expiră</label>
                    <input {...inputProps('cardExp')} value={card.exp} onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })} inputMode="numeric" autoComplete="off" placeholder="LL/AA" className={`${field} tabular-nums`} />
                    <Err n="cardExp" />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor={`${uid}-cardCvc`} className={labelCls}>CVC</label>
                    <input {...inputProps('cardCvc')} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} inputMode="numeric" autoComplete="off" placeholder="123" className={`${field} tabular-nums`} />
                    <Err n="cardCvc" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor={`${uid}-cardName`} className={labelCls}>Nume pe card</label>
                    <input {...inputProps('cardName')} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} autoComplete="off" />
                    <Err n="cardName" />
                  </div>
                </div>
              ) : (
                <p className="mt-6 border border-gold-400/20 bg-obsidian/40 p-5 text-sm leading-relaxed text-silk/85 sm:p-6">
                  După ce apeși „Plătește”, ești redirecționat către pagina securizată NETOPIA Payments, unde introduci datele cardului. Apoi revii aici, la confirmarea comenzii.
                </p>
              )}

              <div className="mt-8 space-y-4">
                <Consent name="terms" uid={uid} error={err('terms')}>
                  Am citit și sunt de acord cu <Link href="/termeni" className="text-gold-300 underline underline-offset-4">termenii și condițiile</Link> și cu <Link href="/confidentialitate" className="text-gold-300 underline underline-offset-4">politica de confidențialitate</Link>.
                </Consent>
                {hasCustom && (
                  <Consent name="measurementsConsent" uid={uid} error={err('measurementsConsent')}>
                    Sunt de acord ca măsurile mele (inclusiv înălțimea și greutatea) să fie folosite de Cesarini doar pentru croirea acestei comenzi.
                  </Consent>
                )}
                {Object.keys(errors).some((k) => k.startsWith('mono-')) && (
                  <p role="alert" className="text-sm text-red-300">Ai bifat monograma, dar n-ai scris inițialele. Completează-le în sumarul comenzii.</p>
                )}
              </div>

              {status === 'error' && (
                <p role="alert" className="mt-6 border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
                  Comanda nu a putut fi trimisă. Verifică datele și încearcă din nou sau sună-ne la {verified.phoneDisplay}.
                </p>
              )}

              <button type="submit" disabled={status === 'processing'} className={goldButtonClass('solid', 'mt-8 w-full disabled:cursor-wait disabled:opacity-80')}>
                <span className="relative flex items-center gap-3">
                  {status === 'processing' && (
                    <motion.span aria-hidden className="h-3.5 w-3.5 rounded-full border border-obsidian/40 border-t-obsidian" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} />
                  )}
                  {status === 'processing' ? 'Se procesează plata…' : `Plătește ${formatRON(cart.totals.total)}`}
                </span>
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                <LockIcon /> Plată criptată. Datele cardului nu sunt stocate de Cesarini.
              </p>
            </Step>
          </form>

          <aside className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-8 border border-gold-400/20 bg-charcoal/60 p-8 shadow-gold-inset backdrop-blur-md xl:p-10">
              <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold-500/60" />
              <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold-500/60" />
              <h2 className="mb-8 font-display text-2xl font-normal text-ivory">Comanda ta</h2>
              <OrderSummary idPrefix={`${uid}-d`} locked={status === 'processing'} />
            </div>
          </aside>
        </div>
      </div>
      <motion.div aria-hidden initial={false} animate={{ opacity: status === 'processing' ? 1 : 0 }} transition={{ duration: 0.5, ease: EXPO }} className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-gold-hairline" />
    </Shell>
  );
}

/* ——— Piese ——— */

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-gold-400/20 bg-obsidian/60 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="Cesarini — acasă" className="font-display text-[1.25rem] uppercase tracking-[0.42em] text-ivory transition-colors hover:text-gold-300">
            Cesarini
          </Link>
          <p className="hidden text-[0.68rem] font-semibold uppercase tracking-wide2 text-stone-400 sm:block">Finalizare comandă</p>
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-300">
            <LockIcon /> Plată securizată
          </p>
        </div>
      </header>
      <main id="continut">{children}</main>
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`}>
      <div className="flex items-baseline gap-5 border-b border-gold-400/20 pb-4">
        <span aria-hidden className="font-display text-2xl text-gold-500/80">{n}</span>
        <h2 id={`step-${n}`} className="font-display text-3xl font-normal text-ivory">{title}</h2>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Consent({ name, uid, error, children }: { name: string; uid: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone-400">
      <input type="checkbox" name={name} value="da" className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-gold-400" aria-invalid={!!error} aria-describedby={error ? `${uid}-${name}-err` : undefined} />
      <span>
        {children}
        {error && <span id={`${uid}-${name}-err`} className="mt-1 block text-xs text-red-300">{error}</span>}
      </span>
    </label>
  );
}

const LockIcon = () => (
  <svg aria-hidden viewBox="0 0 12 14" className="h-3 w-3"><rect x="1" y="6" width="10" height="7" fill="none" stroke="currentColor" /><path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" /></svg>
);

function Confirmation({ payload, firstName, delivered }: { payload: OrderPayload; firstName: string; delivered: 'server' | 'local' }) {
  const custom = payload.workshop.hasCustomFit;
  return (
    <Shell>
      <div className="container-site grid gap-14 py-section lg:grid-cols-12">
        <div className="lg:col-span-7" role="status">
          <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full border border-gold-400/60 text-gold-300">
            <svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </span>
          <p className="eyebrow mt-10">Comanda {payload.orderId}</p>
          <h1 className="mt-5 font-display text-display-sm font-normal text-ivory">
            Mulțumim, <em className="text-gold-400">{firstName}.</em>
          </h1>
          <p className="mt-6 max-w-prose font-serif text-xl leading-relaxed text-silk/85">
            Atelierul a primit comanda{custom ? ' și măsurile tale' : ''}. Păstrează numărul comenzii: <span className="whitespace-nowrap">{payload.orderId}</span>.
          </p>
          <ol className="mt-12 border-t border-gold-400/20">
            {[
              custom ? 'Un consultant te sună să verifice măsurile, apoi croitorii încep lucrul.' : 'Un consultant te sună să confirme mărimea.',
              custom ? 'Termenul de livrare pentru piesele croite pe măsură ți-l spune consultantul.' : 'Livrăm prin curier în 1 – 2 zile lucrătoare.',
              `Pentru orice întrebare: ${verified.phoneDisplay} · ${verified.email}`,
            ].map((t, i) => (
              <li key={t} className="flex gap-6 border-b border-gold-400/20 py-5">
                <span className="font-display text-xl text-gold-500/80">0{i + 1}</span>
                <span className="leading-relaxed text-silk/85">{t}</span>
              </li>
            ))}
          </ol>
          <Link href="/" className={goldButtonClass('ghost', 'mt-12')}><span className="relative">Înapoi la Cesarini</span></Link>
        </div>

        {commerceConfig.paymentMode === 'demo' && (
          <aside className="lg:col-span-5">
            <details className="border border-gold-400/20 bg-charcoal/60" open>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[0.68rem] font-semibold uppercase tracking-wide2 text-gold-300 [&::-webkit-details-marker]:hidden">
                Date trimise atelierului (JSON)
                <span className="text-stone-500">{delivered === 'server' ? 'via /api/comanda' : 'generat local'}</span>
              </summary>
              <pre className="max-h-[32rem] overflow-auto border-t border-gold-400/20 p-5 text-[0.72rem] leading-relaxed text-silk/80">{JSON.stringify(payload, null, 2)}</pre>
            </details>
            <p className="mt-3 text-xs leading-relaxed text-stone-500">Vizibil doar în modul demonstrativ. Același payload pleacă spre WhatsApp, Telegram și email.</p>
          </aside>
        )}
      </div>
    </Shell>
  );
}
