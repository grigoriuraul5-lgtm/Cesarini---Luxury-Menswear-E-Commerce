'use client';

import Link from 'next/link';
import { verified } from '@/lib/brand';

/**
 * Pagini legale provizorii. Textele finale (termeni, GDPR) le dă clientul / avocatul: DE CONFIRMAT CU CLIENTUL.
 * Până atunci, pagina nu e goală și nu e 404: spune onest ce date colectează site-ul și cum iei legătura cu casa.
 * Nu se indexează (robots noindex în app/termeni și app/confidentialitate).
 */
const CONTENT = {
  termeni: {
    title: 'Termeni și condiții',
    intro: 'Textul complet al termenilor și condițiilor de vânzare este în curs de redactare și va fi publicat pe această pagină.',
    points: [
      'După fiecare comandă, un consultant Cesarini te sună pentru confirmarea mărimii sau a măsurilor, înainte de croire.',
      `${verified.freeAlterations}`,
    ],
  },
  confidentialitate: {
    title: 'Politica de confidențialitate (GDPR)',
    intro: 'Politica completă de prelucrare a datelor personale este în curs de redactare și va fi publicată pe această pagină. Pe scurt, ce date folosește site-ul:',
    points: [
      'Datele de contact și de livrare din comandă: pentru procesarea și livrarea comenzii.',
      'Măsurile corporale, doar dacă alegi „Croit pe măsură” și îți dai acordul separat: exclusiv pentru croirea comenzii tale.',
      'Adresa de email pentru newsletter-ul Privé, doar cu acordul tău; te poți dezabona oricând.',
      'Coșul și profilul de măsuri se păstrează în browserul tău (localStorage), nu pe un server.',
    ],
  },
} as const;

export function LegalPage({ kind }: { kind: keyof typeof CONTENT }) {
  const c = CONTENT[kind];
  return (
    <div className="container-site relative pb-section pt-32">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-wide2 text-stone-500">
        <ol className="flex items-center gap-3">
          <li><Link href="/" className="inline-flex min-h-8 items-center transition-colors hover:text-gold-300">Acasă</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-silk/70">{c.title}</li>
        </ol>
      </nav>
      <h1 className="mt-10 max-w-[18ch] font-display text-display-sm font-normal text-ivory">{c.title}</h1>
      <p className="lead mt-8 max-w-[40rem]">{c.intro}</p>
      <ul className="mt-10 max-w-prose space-y-4">
        {c.points.map((pt) => (
          <li key={pt} className="flex gap-4 leading-relaxed text-silk/85">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
            {pt}
          </li>
        ))}
      </ul>
      <div className="mt-14 max-w-prose border border-gold-400/20 bg-obsidian/60 p-7 backdrop-blur-md sm:p-8">
        <p className="eyebrow">Întrebări</p>
        <p className="mt-4 leading-relaxed text-silk/85">
          Scrie-ne la{' '}
          <a href={`mailto:${verified.email}`} className="text-gold-300 underline-offset-4 hover:underline">{verified.email}</a> sau sună la{' '}
          <a href={`tel:${verified.phoneE164}`} className="text-gold-300 underline-offset-4 hover:underline">{verified.phoneDisplay}</a>.
        </p>
      </div>
    </div>
  );
}
