'use client';

import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { verified } from '@/lib/brand';
import { useBooking } from './booking/BookingProvider';
import { LogoLockup, Wordmark } from './brand/Logo';

const linkCls = 'inline-flex min-h-10 items-center text-[0.95rem] text-silk/80 transition-colors duration-300 hover:text-gold-300';
const headCls = 'text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400';

/**
 * Footer-ul casei: patru coloane pe obsidian semi-transparent (catifeaua trece pe sub el),
 * încheiat de semnătura CESARINI pe toată lățimea, ca broderia de pe eticheta unui sacou.
 */
export function SiteFooter() {
  const booking = useBooking();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-section border-t border-gold-400/20 bg-obsidian/60 backdrop-blur-md">
      <div className="container-site grid gap-14 pb-16 pt-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* 1 · Manifest */}
        <div className="lg:col-span-4">
          {/* Logoul complet, vertical, exact ca în fișierul oficial */}
          <Link href="/" aria-label="Cesarini — acasă" className="group inline-block">
            <LogoLockup title="Cesarini — For Him" className="h-auto w-[232px] transition-[filter] duration-700 ease-expo group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]" />
          </Link>
          <p className="mt-8 max-w-[18ch] font-display text-[clamp(1.75rem,1.4rem+1vw,2.4rem)] leading-tight text-ivory">
            Eleganța nu se poartă. <em className="text-gold-400">Se croiește.</em>
          </p>
          <p className="mt-6 text-sm text-stone-400">
            {verified.tagline} {verified.city}, din {verified.foundingYear}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6">
            {([
              ['Instagram', verified.social.instagram],
              ['Facebook', verified.social.facebook],
              ['TikTok', verified.social.tiktok],
            ] as const).map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-[0.65rem] font-semibold uppercase tracking-wide2 text-silk/70 transition-colors hover:text-gold-300">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 · Navigare */}
        <nav aria-labelledby="ft-nav" className="lg:col-span-2">
          <h2 id="ft-nav" className={headCls}>Navigare</h2>
          <ul className="mt-5 space-y-1">
            <li><Link href="/colectii" className={linkCls}>Colecții</Link></li>
            <li><Link href="/colectii?croiala=mtm" className={linkCls}>Croit pe măsură</Link></li>
            <li><Link href="/comunitate" className={linkCls}>Community</Link></li>
            <li><Link href="/journal" className={linkCls}>Journal</Link></li>
            <li><Link href="/atelier" className={linkCls}>Atelier &amp; contact</Link></li>
            <li>
              <button type="button" onClick={() => booking.open()} aria-haspopup="dialog" className={`${linkCls} cursor-pointer`}>
                Private Fitting
              </button>
            </li>
          </ul>
        </nav>

        {/* 3 · Showroom */}
        <div className="lg:col-span-3">
          <h2 className={headCls}>Showroom Cluj</h2>
          <address className="mt-5 space-y-4 text-[0.95rem] not-italic leading-relaxed text-silk/80">
            <a href={verified.mapsUrl} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-gold-300">
              {verified.street}
              <br />
              {verified.postalCode} {verified.city}
            </a>
            <p>
              <a href={`tel:${verified.phoneE164}`} className="inline-flex min-h-11 items-center font-display text-xl text-ivory transition-colors hover:text-gold-300">{verified.phoneDisplay}</a>
              <br />
              <a href={`mailto:${verified.email}`} className="inline-flex min-h-11 items-center transition-colors hover:text-gold-300">{verified.email}</a>
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {verified.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-stone-500">{h.label}</dt>
                  <dd className="tabular-nums">{h.opens} – {h.closes}</dd>
                </div>
              ))}
              <dt className="text-stone-500">Duminică</dt>
              <dd>închis</dd>
            </dl>
          </address>
        </div>

        {/* 4 · Newsletter */}
        <div className="lg:col-span-3">
          <h2 className={headCls}>Privé</h2>
          <p className="mt-5 max-w-[30ch] text-[0.95rem] leading-relaxed text-silk/80">Colecțiile noi și ghidurile de stil, înaintea tuturor. Un email pe lună, cel mult.</p>
          <Newsletter />
        </div>
      </div>

      {/* Semnătura: numele casei, pe toată lățimea */}
      <div aria-hidden className="container-site select-none overflow-hidden">
        {/* Literele din logo, nu text tipărit: semnătura e identică cu emblema */}
        <Wordmark tone="current" className="mx-auto block h-auto w-full max-w-[1320px] translate-y-[18%] text-gold-400/[0.09]" />
      </div>

      <div className="border-t border-gold-400/15">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© {year} {verified.legalHint}. Toate drepturile rezervate.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/termeni" className="inline-flex min-h-11 items-center transition-colors hover:text-gold-300 md:min-h-8">Termeni și condiții</Link></li>
            <li><Link href="/confidentialitate" className="inline-flex min-h-11 items-center transition-colors hover:text-gold-300 md:min-h-8">Politica de confidențialitate (GDPR)</Link></li>
            <li><a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-gold-300 md:min-h-8">ANPC</a></li>
            <li><a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-gold-300 md:min-h-8">Soluționarea alternativă a litigiilor (SAL)</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  const uid = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'preview' | 'error'>('idle');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr('Scrie o adresă de email validă.');
    if (!fd.get('consent')) return setErr('Bifează acordul ca să te putem adăuga pe listă.');
    setErr(null);
    setState('sending');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, consent: true }) });
      if (res.status === 422) { setState('idle'); return setErr('Verifică adresa de email.'); }
      // 404 = nu există server (previzualizare): nu salvăm nimic și o spunem deschis
      setState(res.ok ? 'done' : res.status === 404 ? 'preview' : 'error');
    } catch {
      setState('preview');
    }
  }

  if (state === 'done' || state === 'preview')
    return (
      <p role="status" className="mt-6 border border-gold-400/30 px-4 py-4 text-sm leading-relaxed text-gold-100">
        {state === 'done' ? 'Gata. Ești pe lista Privé.' : 'Previzualizare: pe site-ul real, adresa ar fi fost adăugată pe lista Privé.'}
      </p>
    );

  return (
    <form noValidate onSubmit={submit} className="mt-6">
      <label htmlFor={`${uid}-email`} className="sr-only">Adresa de email</label>
      <div className="flex items-end border-b border-gold-400/50 transition-colors focus-within:border-gold-300">
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="adresa ta de email"
          aria-invalid={!!err}
          aria-describedby={err ? `${uid}-err` : undefined}
          className="min-h-12 w-full min-w-0 bg-transparent pr-3 text-base text-ivory placeholder:text-stone-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="min-h-12 shrink-0 cursor-pointer text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100 disabled:cursor-wait disabled:opacity-60"
        >
          {state === 'sending' ? 'Se trimite…' : 'Abonează-te'}
        </button>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-stone-500">
        <input type="checkbox" name="consent" value="da" className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-gold-400" />
        <span>Sunt de acord să primesc emailuri de la Cesarini. Mă pot dezabona oricând.</span>
      </label>
      {(err || state === 'error') && (
        <p id={`${uid}-err`} role="alert" className="mt-3 text-xs text-red-300">
          {err ?? 'Nu am putut salva adresa. Încearcă din nou.'}
        </p>
      )}
    </form>
  );
}
