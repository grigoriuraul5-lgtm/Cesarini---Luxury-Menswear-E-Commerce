'use client';

import Link from 'next/link';
import { atelierServices, editorial, experienceSteps, formatRON, verified } from '@/lib/brand';
import { media } from '@/lib/media';
import { LuxImage } from '../ui/LuxImage';
import { Reveal } from '../ui/Reveal';
import { BookingButton, goldButtonClass } from '../ui/GoldButton';

const p = verified.prices;

/** Detaliile fiecărui serviciu: doar fapte din `verified` (prețuri și ajustări confirmate). */
const SERVICE_FACTS: Record<string, { id: string; facts: string[] }> = {
  I: {
    id: 'ajustari',
    facts: [
      'Talia, mânecile, tivul și lungimea sacoului, ajustate pe tine la probă.',
      verified.freeAlterations,
      'Se face în showroom, după ce alegi ținuta împreună cu un consultant.',
    ],
  },
  II: {
    id: 'camasi-pe-masura',
    facts: [
      'Gulerul, manșeta și lungimea cămășii, după măsurile tale.',
      `Cămăși de ceremonie de la ${formatRON(p.ceremonyShirt)}; cămăși Oxford business de la ${formatRON(p.businessShirt)}.`,
      'Online: alegi „Croit pe măsură” pe pagina cămășii și introduci măsurile, cu ghid ilustrat pentru fiecare.',
    ],
  },
  III: {
    id: 'ceremonie',
    facts: [
      `Costum de ceremonie în trei piese (${verified.ceremonySuitSpec.pieces}), ${verified.ceremonySuitSpec.fabric}, mărimi ${verified.ceremonySuitSpec.sizes}: ${formatRON(p.ceremonySuit)}.`,
      `Cămașă de ceremonie ${formatRON(p.ceremonyShirt)} · pantofi Oxford ${formatRON(p.oxfordShoes)} · curea din piele naturală ${formatRON(p.leatherBelt)}.`,
      'Cravate, papioane și butoni, aleși în showroom împreună cu ținuta.',
    ],
  },
};

const HOURS = [
  ...verified.hours.map((h) => ({ label: h.label, value: `${h.opens} – ${h.closes}` })),
  { label: 'Duminică', value: 'Închis' },
];

/**
 * Atelier · Showroom Cluj & Contact. Pagina-țintă pentru „Atelier” din meniu și pentru
 * ancorele serviciilor de pe homepage (#ajustari, #camasi-pe-masura, #ceremonie).
 */
export function AtelierPage() {
  return (
    <div className="relative pb-section pt-32">
      {/* ——— Deschiderea ——— */}
      <header className="container-site">
        <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-wide2 text-stone-500">
          <ol className="flex items-center gap-3">
            <li><Link href="/" className="inline-flex min-h-8 items-center transition-colors hover:text-gold-300">Acasă</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-silk/70">Atelier</li>
          </ol>
        </nav>
        <p className="eyebrow mt-10 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold-400" />
          Atelier · Showroom {verified.city}
        </p>
        <h1 className="mt-8 max-w-[16ch] font-display text-display-md font-normal text-ivory">
          Showroom-ul și atelierul <span className="text-gold-400">din Cluj-Napoca</span>
        </h1>
      </header>

      {/* ——— Contact + program, alături de emblema casei ——— */}
      <section aria-labelledby="contact" className="container-site mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <h2 id="contact" className="sr-only">Contact și program</h2>
          <p className="lead max-w-[34rem]">
            {verified.appointmentNote} Probezi fără grabă, iar croitorii casei ajustează ținuta pe tine, în același loc.
          </p>

          <dl className="mt-12 grid gap-px border border-gold-400/20 bg-gold-400/20 sm:grid-cols-2">
            <div className="bg-obsidian/70 p-6 backdrop-blur-md sm:col-span-2">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400">Adresa</dt>
              <dd className="mt-3">
                <a href={verified.mapsUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col">
                  <span className="font-display text-2xl text-ivory transition-colors duration-500 group-hover:text-gold-100">{verified.street}</span>
                  <span className="mt-1 text-sm text-stone-400">
                    {verified.postalCode} {verified.city} · <span className="text-gold-300 underline-offset-4 group-hover:underline">Deschide în Google Maps</span>
                  </span>
                </a>
              </dd>
            </div>
            <div className="bg-obsidian/70 p-6 backdrop-blur-md">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400">Telefon</dt>
              <dd className="mt-3">
                <a href={`tel:${verified.phoneE164}`} className="inline-flex min-h-10 items-center font-display text-2xl text-ivory transition-colors hover:text-gold-100">{verified.phoneDisplay}</a>
              </dd>
            </div>
            <div className="bg-obsidian/70 p-6 backdrop-blur-md">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400">Email</dt>
              <dd className="mt-3">
                <a href={`mailto:${verified.email}`} className="inline-flex min-h-10 items-center break-all text-lg text-ivory transition-colors hover:text-gold-100">{verified.email}</a>
              </dd>
            </div>
            <div className="bg-obsidian/70 p-6 backdrop-blur-md sm:col-span-2">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide2 text-gold-400">Program</dt>
              <dd className="mt-4">
                <table className="w-full max-w-sm text-[0.95rem]">
                  <caption className="sr-only">Programul showroom-ului Cesarini</caption>
                  <tbody>
                    {HOURS.map((h) => (
                      <tr key={h.label} className="border-b border-gold-400/10 last:border-0">
                        <th scope="row" className="py-2 pr-6 text-left font-normal text-stone-400">{h.label}</th>
                        <td className={`py-2 text-right tabular-nums ${h.value === 'Închis' ? 'text-stone-500' : 'text-ivory'}`}>{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <BookingButton variant="solid" />
            <a href={editorial.whatsapp.href} target="_blank" rel="noopener noreferrer" className={goldButtonClass('ghost')}>
              <span className="relative">Scrie-ne pe WhatsApp</span>
            </a>
          </div>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <figure className="group relative overflow-hidden border border-gold-400/20 transition-shadow duration-700 ease-expo hover:shadow-gold-soft">
            <LuxImage media={media.brand.maison} grade="soft" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" />
            <span aria-hidden className="absolute inset-4 border border-gold-400/20" />
          </figure>
        </Reveal>
      </section>

      {/* ——— Serviciile atelierului ——— */}
      <section aria-labelledby="servicii" className="container-site mt-section">
        <Reveal>
          <p className="eyebrow">Serviciile atelierului</p>
          <h2 id="servicii" className="mt-6 max-w-[20ch] font-display text-display-sm font-normal text-ivory">
            Trei feluri în care <span className="text-gold-400">croim pentru tine</span>
          </h2>
        </Reveal>
        <ol className="mt-14 border-t border-gold-400/20">
          {atelierServices.map((s) => {
            const d = SERVICE_FACTS[s.numeral];
            return (
              <li key={s.numeral} id={d.id} className="scroll-mt-28 border-b border-gold-400/20 py-12 sm:py-16">
                <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
                  <span aria-hidden className="font-display text-5xl leading-none text-gold-400/80 md:col-span-2 sm:text-6xl">{s.numeral}</span>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-3xl font-normal text-ivory sm:text-4xl">{s.title}</h3>
                    <p className="mt-3 text-base font-medium text-gold-200/90">{s.lead}</p>
                    <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-stone-400">{s.body}</p>
                  </div>
                  <ul className="space-y-4 md:col-span-5">
                    {d.facts.map((f) => (
                      <li key={f} className="flex gap-4 text-[0.95rem] leading-relaxed text-silk/85">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ——— Vizita, pas cu pas ——— */}
      <section aria-labelledby="vizita" className="container-site mt-section">
        <Reveal>
          <p className="eyebrow">Vizita în showroom</p>
          <h2 id="vizita" className="mt-6 font-display text-display-sm font-normal text-ivory">
            De la programare <span className="text-gold-400">la ținuta completă</span>
          </h2>
        </Reveal>
        <ol className="mt-14 grid gap-px border border-gold-400/20 bg-gold-400/20 sm:grid-cols-2 lg:grid-cols-4">
          {experienceSteps.map((st, i) => (
            <li key={st.n} className="bg-obsidian/70 p-7 backdrop-blur-md transition-colors duration-500 hover:bg-graphite/80 sm:p-8">
              <Reveal delay={i * 0.06}>
                <span className="font-display text-sm tabular-nums text-gold-400">{st.n}</span>
                <h3 className="mt-6 font-display text-2xl font-normal text-ivory">{st.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-stone-400">{st.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-stone-400">
          Ai întrebări înainte de vizită? Răspunsurile frecvente sunt pe{' '}
          <Link href="/#intrebari" className="text-gold-300 underline-offset-4 hover:underline">prima pagină</Link>, iar ghidurile de stil în{' '}
          <Link href="/journal" className="text-gold-300 underline-offset-4 hover:underline">Journal</Link>.
        </p>
      </section>
    </div>
  );
}
