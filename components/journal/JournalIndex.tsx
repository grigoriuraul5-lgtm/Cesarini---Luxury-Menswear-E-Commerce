'use client';

import Link from 'next/link';
import { articles, formatDateRo, upcoming } from '@/lib/journal';

/** Indexul Journal-ului: articolele publicate ca intrări de cuprins de revistă, ghidurile în pregătire fără link. */
export function JournalIndex() {
  return (
    <div className="relative pb-section pt-32">
      <header className="container-site">
        <p className="eyebrow flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold-500" />
          Ghiduri de stil · Întrebări cu răspuns
        </p>
        <h1 className="mt-8 font-display text-display-md font-normal text-ivory">
          The Cesarini <em className="text-gold-400">Journal</em>
        </h1>
        <p className="mt-8 max-w-[38rem] font-serif text-xl leading-relaxed text-silk/85">
          Regulile ținutei de ceremonie, explicate de croitori: ce porți, când și cum se potrivește.
        </p>
      </header>

      <div className="container-site mt-16">
        <ol className="border-t border-gold-400/20">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-gold-400/20">
              <Link href={`/journal/${a.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:gap-10">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-500 md:col-span-2 md:pt-3">{a.kicker}</span>
                <span className="md:col-span-7">
                  <span className="block text-balance font-display text-display-sm font-normal text-ivory transition-colors duration-500 group-hover:text-gold-100">{a.title}</span>
                  <span className="mt-4 block max-w-prose leading-relaxed text-stone-400">{a.dek}</span>
                </span>
                <span className="text-sm text-stone-500 md:col-span-3 md:pt-3 md:text-right">
                  {formatDateRo(a.updated)} · {a.readingMinutes} min
                </span>
              </Link>
            </li>
          ))}
          {upcoming.map((t) => (
            <li key={t} className="grid gap-4 border-b border-gold-400/20 py-8 md:grid-cols-12 md:gap-10">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-stone-600 md:col-span-2 md:pt-2">În pregătire</span>
              <span className="font-display text-2xl text-silk/50 md:col-span-7">{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
