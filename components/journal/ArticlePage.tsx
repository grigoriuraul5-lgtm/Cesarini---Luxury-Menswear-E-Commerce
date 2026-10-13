'use client';

import Link from 'next/link';
import { formatRON, verified } from '@/lib/brand';
import { getProduct, productHref } from '@/lib/commerce/catalog';
import { formatDateRo, type Article, type Block } from '@/lib/journal';
import { LuxImage } from '../ui/LuxImage';
import { BookingButton, GoldButton } from '../ui/GoldButton';
import { Reveal } from '../ui/Reveal';

/**
 * Șablonul de articol al Journal-ului, construit pentru răspunsuri directe:
 * răspunsul scurt primul (bonul de croitor), apoi întrebări ca titluri, fiecare deschisă de răspunsul ei într-o frază.
 */
export function ArticlePage({ a }: { a: Article }) {
  return (
    <article className="relative pb-section pt-32">
      <header className="container-site">
        <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-wide2 text-stone-500">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <li><Link href="/" className="inline-flex min-h-10 items-center transition-colors hover:text-gold-300">Acasă</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/journal" className="inline-flex min-h-10 items-center transition-colors hover:text-gold-300">Journal</Link></li>
          </ol>
        </nav>
        <p className="eyebrow mt-10 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold-400" />
          <span><span className="hidden sm:inline">The Cesarini Journal · </span>{a.kicker}</span>
        </p>
        <h1 className="mt-8 max-w-[20ch] text-balance font-display text-display-md font-normal text-ivory">{a.title}</h1>
        <p className="lead mt-8 max-w-[40rem]">{a.dek}</p>
        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] uppercase tracking-wide2 text-stone-500">
          <span>Atelierul Cesarini</span>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-gold-500/60" />
          <span>Actualizat <time dateTime={a.updated}>{formatDateRo(a.updated)}</time></span>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-gold-500/60" />
          <span>{a.readingMinutes} minute</span>
        </p>
      </header>

      <div className="container-site mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Cuprins */}
        <aside className="lg:col-span-3" aria-label="Cuprins">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">În acest ghid</p>
            <ol className="mt-5 space-y-1 border-l border-gold-400/20">
              {a.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-2.5 pl-4 text-sm leading-snug text-stone-400 transition-colors hover:border-gold-400 hover:text-ivory">
                    {s.question}
                  </a>
                </li>
              ))}
              <li>
                <a href="#intrebari" className="-ml-px block border-l border-transparent py-2 pl-4 text-sm text-stone-400 transition-colors hover:border-gold-400 hover:text-ivory">Întrebări frecvente</a>
              </li>
            </ol>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8 lg:col-start-5">
          {/* Răspunsul scurt: bonul croitorului */}
          <section aria-labelledby="raspuns" className="relative border border-gold-400/40 bg-charcoal/70 p-8 shadow-gold-inset backdrop-blur-md sm:p-10">
            <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold-400/70" />
            <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold-400/70" />
            <h2 id="raspuns" className="eyebrow">Răspunsul scurt</h2>
            <p className="mt-5 font-display text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] leading-[1.55] text-ivory">{a.shortAnswer}</p>
          </section>

          {a.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 pt-16">
              <h2 id={`${s.id}-h`} className="text-balance font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] font-normal leading-tight text-ivory">{s.question}</h2>
              <p className="mt-5 max-w-prose text-lg font-medium leading-relaxed text-gold-100">{s.answer}</p>
              <div className="mt-5 space-y-5">{s.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
            </section>
          ))}

          {/* Produse din ghid */}
          <section aria-labelledby="din-ghid" className="pt-20">
            <h2 id="din-ghid" className="eyebrow">Din ghid, în colecție</h2>
            <ul className="mt-6 grid gap-px border border-gold-400/20 bg-gold-400/20 sm:grid-cols-2">
              {a.relatedProducts.map((slug) => {
                const p = getProduct(slug);
                if (!p) return null;
                return (
                  <li key={slug}>
                    <Link href={productHref(slug)} className="group flex h-full items-center gap-5 bg-obsidian/80 p-4 transition-colors duration-500 hover:bg-graphite">
                      <LuxImage media={p.gallery[0]} sizes="80px" zoom={false} className="h-24 w-20 shrink-0 border border-gold-400/20" />
                      <span className="min-w-0">
                        <span className="block font-display text-lg leading-snug text-ivory group-hover:text-gold-100">{p.name}</span>
                        <span className="mt-1 block text-sm tabular-nums text-gold-400">{formatRON(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Întrebări frecvente (același text ca în FAQPage JSON-LD) */}
          <section id="intrebari" aria-labelledby="intrebari-h" className="scroll-mt-28 pt-20">
            <h2 id="intrebari-h" className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] font-normal text-ivory">Întrebări frecvente</h2>
            <div className="mt-6 border-t border-gold-400/20">
              {a.faqs.map((f) => (
                <details key={f.q} className="group border-b border-gold-400/20">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl text-ivory [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0 text-gold-300 transition-transform duration-500 ease-expo group-open:rotate-45">
                      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </summary>
                  <p className="max-w-prose pb-6 leading-relaxed text-silk/85">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <Reveal className="mt-20 border border-gold-400/20 p-8 sm:p-12">
            <p className="eyebrow">Showroom · {verified.city}</p>
            <p className="mt-5 max-w-[24ch] font-display text-display-sm font-normal text-ivory">
              Probează ținuta, <em className="text-gold-400">fără grabă.</em>
            </p>
            <p className="mt-5 max-w-prose text-stone-400">{verified.street}, {verified.city} · {verified.phoneDisplay}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookingButton variant="solid" occasion={a.occasion} />
              <GoldButton href="/colectii" variant="ghost">Vezi colecția</GoldButton>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'p':
      return <p className="max-w-prose leading-relaxed text-silk/85">{b.text}</p>;
    case 'qa':
      return (
        <div className="max-w-prose border-t border-gold-400/15 pt-5">
          <h3 className="font-display text-[1.4rem] font-normal leading-snug text-ivory">{b.q}</h3>
          <p className="mt-2 leading-relaxed text-silk/85">{b.a}</p>
        </div>
      );
    case 'note':
      return <p className="max-w-prose border border-gold-400/25 bg-gold-400/[0.04] px-5 py-4 text-[0.95rem] leading-relaxed text-gold-100">{b.text}</p>;
    case 'list':
      return (
        <ul className="max-w-prose space-y-3">
          {b.items.map((t) => (
            <li key={t} className="flex gap-4 leading-relaxed text-silk/85">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
              {t}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
            <caption className="sr-only">{b.caption}</caption>
            <thead>
              <tr className="border-b border-gold-400/40">
                {b.head.map((h) => <th key={h} scope="col" className="py-3 pr-6 text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]} className="border-b border-gold-400/15 align-top">
                  <th scope="row" className="py-4 pr-6 font-display text-lg font-normal text-ivory">{r[0]}</th>
                  <td className="py-4 pr-6 leading-relaxed text-silk/85">{r[1]}</td>
                  <td className="py-4 leading-relaxed text-gold-200/90">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
