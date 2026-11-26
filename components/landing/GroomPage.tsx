import Link from 'next/link';
import { formatRON, verified } from '@/lib/brand';
import { commerceProducts } from '@/lib/commerce/catalog';
import { ProductGrid } from '../HomeShop';
import { LookBuilder } from '../LookBuilder';
import { BookingButton } from '../ui/GoldButton';

/**
 * /costume-de-mire: pagina pentru cea mai valoroasă căutare din domeniu („costume de mire Cluj”, „costum de mire”).
 * Doar fapte verificate (prețuri, material, mărimi, livrare, showroom); întrebările vizibile = FAQPage din schema.
 */
export const groomSuits = commerceProducts.filter((p) => p.categoryKey === 'costume-ceremonie').sort((a, b) => a.rank - b.rank);

const colors = Array.from(new Set(groomSuits.map((p) => p.color).filter(Boolean))) as string[];
const p = verified.prices;
const spec = verified.ceremonySuitSpec;
const hours = verified.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(', ');

export const groomFaqs = [
  {
    q: 'Cât costă un costum de mire la Cesarini?',
    a: `Un costum de mire Cesarini costă ${formatRON(p.ceremonySuit)}, în ${spec.piecesRange}, din ${spec.fabric}, în mărimile ${spec.sizes}. Ținuta completă, cu cămașă (de la ${formatRON(p.ceremonyShirt)}), pantofi Oxford (${formatRON(p.oxfordShoes)}) și curea (${formatRON(p.leatherBelt)}), pornește de la ${formatRON(p.ceremonySuit + p.ceremonyShirt + p.oxfordShoes + p.leatherBelt)}.`,
  },
  {
    q: 'Cu cât timp înainte de nuntă ar trebui să comand costumul?',
    a: 'Piesele din stoc, în mărime standard, se livrează între 15-30 de zile, în funcție de volumul de lucru din perioada respectivă. Ca să ai timp și de probă și de ajustări, începe cu câteva săptămâni mai devreme. Pentru un costum croit pe măsură, termenul ți-l confirmă consultantul la telefon. Dacă nunta e la o dată apropiată, spune-ne de la început.',
  },
  {
    q: 'Pot proba costumul de mire înainte să-l cumpăr?',
    a: `Da. Te așteptăm în showroom-ul Cesarini din ${verified.street}, ${verified.city} (${hours}). Programează o întâlnire ca să ai consultantul doar pentru tine.`,
  },
  {
    q: 'Ajustările costumului de mire sunt gratuite?',
    a: `${verified.freeAlterations} Croitorii noștri ajustează talia, lungimea pantalonilor, mânecile și sacoul, în funcție de ce are nevoie ținuta.`,
  },
  {
    q: 'În ce culori găsesc costume de mire?',
    a: `Online găsești acum costume de mire în ${colors.length} nuanțe: ${colors.join(', ')}. În showroom te așteaptă mult mai multe modele.`,
  },
  {
    q: 'Pot comanda costumul de mire online, dacă nu sunt din Cluj?',
    a: 'Da. Alegi mărimea standard sau „Croit pe măsură” și introduci măsurile tale, iar costumul se livrează prin curier în toată țara. Un consultant te sună pentru confirmarea mărimii.',
  },
];

export function GroomPage() {
  return (
    <>
      <header className="container-site pt-32 sm:pt-36">
        <nav aria-label="Breadcrumb" className="text-[0.68rem] uppercase tracking-wide2 text-stone-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="inline-flex min-h-11 items-center hover:text-gold-300">Acasă</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/colectii/costume-ceremonie" className="inline-flex min-h-11 items-center hover:text-gold-300">Costume ceremonie</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-silk/70">Costume de mire</li>
          </ol>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-gold-400" />
              Mire · Cluj-Napoca
            </p>
            <h1 className="mt-6 max-w-[16ch] font-display text-display-md font-normal text-ivory">
              Costume de mire <span className="text-gold-400">în Cluj-Napoca</span>
            </h1>
          </div>
          {/* Răspunsul scurt, primul (citat de Google și de AI) */}
          <div className="lg:col-span-5">
            <p className="lead">
              Costumele de mire Cesarini costă {formatRON(p.ceremonySuit)}, în două sau trei piese, din {spec.fabric}. Le probezi în showroom-ul din centrul Clujului, cu ajustări gratuite, sau le comanzi online, în mărime standard ori croite pe măsura ta.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <BookingButton variant="solid" occasion="Nuntă – Mire" />
              <a href={`tel:${verified.phoneE164}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-silk/80 hover:text-gold-300">
                sau sună: <span className="text-ivory">{verified.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="modele" className="container-site mt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gold-400/20 pb-5">
          <h2 id="modele" className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-normal text-ivory">
            {groomSuits.length} costume de mire, <span className="text-gold-400">toate la {formatRON(p.ceremonySuit)}</span>
          </h2>
          <Link href="/colectii/costume-ceremonie" className="inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-wide2 text-gold-200 hover:text-gold-100">
            Filtrează după culoare și piese →
          </Link>
        </div>
        <ProductGrid products={groomSuits} />
      </section>

      <LookBuilder initialPreset="mire" />

      <section aria-labelledby="intrebari-mire" className="container-site pb-[clamp(3.5rem,8vw,7rem)]">
        <h2 id="intrebari-mire" className="font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-normal text-ivory">
          Întrebări despre <span className="text-gold-400">costumul de mire</span>
        </h2>
        <dl className="mt-8 divide-y divide-gold-400/15 border-y border-gold-400/15">
          {groomFaqs.map((f) => (
            <div key={f.q} className="grid gap-3 py-7 lg:grid-cols-12 lg:gap-10">
              <dt className="font-display text-xl leading-snug text-ivory lg:col-span-5">{f.q}</dt>
              <dd className="max-w-prose text-[0.98rem] leading-relaxed text-silk/85 lg:col-span-7">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-stone-400">
          Mai multe despre stofă:{' '}
          <Link href="/journal/stofa-costum-de-mire" className="text-gold-200 underline decoration-gold-400/40 underline-offset-4 hover:text-gold-100">
            cum alegi stofa pentru costumul de mire
          </Link>
          . Pentru o nuntă black tie:{' '}
          <Link href="/journal/ghid-black-tie" className="text-gold-200 underline decoration-gold-400/40 underline-offset-4 hover:text-gold-100">
            ghidul black tie
          </Link>
          .
        </p>
      </section>
    </>
  );
}
