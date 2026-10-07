/**
 * THE CESARINI JOURNAL — conținut editorial structurat pentru răspunsuri directe (AEO / GEO).
 *
 * Fiecare articol are:
 *  - `shortAnswer`: răspunsul în 2–3 propoziții, primul lucru de pe pagină (ce citează ChatGPT / Perplexity);
 *  - secțiuni cu titluri formulate ca ÎNTREBĂRI, fiecare deschisă de un răspuns direct (`answer`);
 *  - `faqs`: afișate pe pagină ȘI în FAQPage JSON-LD, text identic.
 * Faptele despre Cesarini vin din `verified`. Regulile de stil sunt cunoștințe generale de croitorie.
 */
import { formatRON, verified } from './brand';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; head: [string, string, string]; rows: [string, string, string][] }
  | { type: 'note'; text: string };

export type Section = { id: string; question: string; answer: string; blocks: Block[] };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  shortAnswer: string;
  published: string;
  updated: string;
  readingMinutes: number;
  keywords: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  relatedProducts: string[];
};

const addr = `${verified.street}, ${verified.city}`;
const hours = verified.hours.map((h) => `${h.label.toLowerCase()} ${h.opens} – ${h.closes}`).join(', ');
const p = verified.prices;

export const articles: Article[] = [
  {
    slug: 'ghid-black-tie',
    title: 'Ghidul Definitiv Black Tie & Made-to-Measure în Cluj-Napoca',
    kicker: 'Ghid de stil',
    dek: 'Ce înseamnă „black tie” pe o invitație, din ce piese se compune ținuta și cum o croiești pe măsurile tale, fără grabă.',
    shortAnswer: `Black tie înseamnă smoking: sacou negru sau bleumarin foarte închis, cu reverele îmbrăcate în satin, pantaloni asortați cu o dungă de satin pe lateral, cămașă albă de ceremonie, papion negru, brâu sau vestă joasă și pantofi negri lucioși. În Cluj-Napoca, la Cesarini (${addr}), găsești cămăși de ceremonie de la ${formatRON(p.ceremonyShirt)}, pantofi Oxford negri lucioși la ${formatRON(p.oxfordShoes)}, papioane și butoni.`,
    published: '2026-10-06',
    updated: '2026-10-06',
    readingMinutes: 7,
    keywords: ['black tie', 'smoking', 'ținută de gală', 'papion', 'costum de ceremonie Cluj', 'croit pe măsură Cluj-Napoca'],
    sections: [
      {
        id: 'ce-inseamna',
        question: 'Ce înseamnă dress code-ul black tie?',
        answer: 'Black tie este codul vestimentar de seară imediat sub white tie: smoking cu papion negru.',
        blocks: [
          { type: 'p', text: 'Pe invitații apare ca „black tie”, „ținută de gală” sau, simplu, „smoking”. Se poartă la gale, baluri, premieri și nunți care încep seara. Dacă invitația spune „black tie optional”, smokingul e binevenit, dar un costum închis la culoare, bine croit, e acceptat.' },
          { type: 'p', text: 'Diferența față de white tie: white tie cere frac, vestă și papion albe. Black tie e mai simplu și mult mai des întâlnit.' },
        ],
      },
      {
        id: 'piesele',
        question: 'Din ce piese se compune o ținută black tie?',
        answer: 'Șapte piese: sacou de smoking, pantaloni asortați, brâu sau vestă, cămașă albă de ceremonie, papion negru, pantofi negri lucioși și câteva accesorii discrete.',
        blocks: [
          {
            type: 'table',
            caption: 'Ținuta black tie, piesă cu piesă',
            head: ['Piesa', 'Regula clasică', 'La Cesarini'],
            rows: [
              ['Sacoul', 'Smoking negru sau bleumarin foarte închis, la un nasture, cu revere cu colț sau șal îmbrăcate în satin.', 'Întreabă consultantul ce smokinguri sunt în showroom.'],
              ['Pantalonii', 'Din aceeași stofă, cu dungă de satin pe lateral, fără manșetă. Se poartă cu bretele, nu cu curea.', 'Ajustați gratuit în showroom, odată cu ținuta.'],
              ['Talia', 'Brâu (cummerbund) sau vestă joasă, ca talia cămășii să nu se vadă.', '—'],
              ['Cămașa', 'Albă, de ceremonie, cu plastron sau cu nasturi ascunși.', `Cămașă de ceremonie cu nasturi ascunși · ${formatRON(p.ceremonyShirt)}`],
              ['Papionul', 'Negru, cu aceeași textură ca reverele. Ideal, cu nod legat de mână.', 'Papioane în showroom.'],
              ['Pantofii', 'Oxford negru lucios sau pantofi de seară din lac.', `Pantofi Oxford negru lucios · ${formatRON(p.oxfordShoes)}`],
              ['Accesoriile', 'Butoni discreți, șosete negre subțiri, batistă albă la buzunarul de la piept.', 'Butoni în showroom.'],
            ],
          },
        ],
      },
      {
        id: 'costum-negru',
        question: 'Pot purta un costum negru în loc de smoking?',
        answer: 'La „black tie optional”, da. La „black tie” strict, gazdele se așteaptă la smoking.',
        blocks: [
          { type: 'p', text: `Un costum negru sau bleumarin închis, cu cămașă albă și papion negru, e alegerea corectă când invitația lasă loc. Costumul de ceremonie Cesarini are trei piese (${verified.ceremonySuitSpec.pieces}), e din ${verified.ceremonySuitSpec.fabric}, vine în mărimile ${verified.ceremonySuitSpec.sizes} și costă ${formatRON(p.ceremonySuit)}.` },
          { type: 'note', text: 'Cu un costum în loc de smoking, păstrează restul regulilor: papion, nu cravată; pantofi negri lucioși; fără curea vizibilă sub vestă.' },
        ],
      },
      {
        id: 'culoare',
        question: 'Negru sau bleumarin foarte închis?',
        answer: 'Amândouă sunt corecte. Bleumarinul foarte închis (midnight blue) pare chiar mai adânc decât negrul sub lumina artificială.',
        blocks: [{ type: 'p', text: 'Negrul e alegerea sigură. Bleumarinul foarte închis e alegerea celui care cunoaște regulile. Papionul, pantofii și șosetele rămân negre în ambele cazuri.' }],
      },
      {
        id: 'pe-masura',
        question: 'Cum îți croiești ținuta pe măsură în Cluj-Napoca?',
        answer: 'Online, alegi „Croit pe măsură” pe pagina costumului sau a cămășii și introduci măsurile; în showroom, croitorii casei ajustează gratuit ținuta cumpărată acolo.',
        blocks: [
          { type: 'list', items: [
            'Măsurile cerute pentru costum: înălțime, greutate, piept, talie, șold, lățimea umerilor, biceps, lungimea mânecii și lungimea pantalonului pe interior.',
            'Fiecare măsură are un ghid ilustrat: unde pui centimetrul și cum îl ții.',
            'După comandă, un consultant te sună să verifice măsurile înainte de croire.',
            `În showroom (${addr}): ${verified.freeAlterations}`,
          ] },
          { type: 'p', text: `Program: ${hours}. ${verified.appointmentNote}` },
        ],
      },
      {
        id: 'cand',
        question: 'Cu cât timp înainte de eveniment să te ocupi de ținută?',
        answer: 'Cu câteva săptămâni înainte, ca să ai timp de probă și ajustări. Pentru o nuntă, începe și mai devreme.',
        blocks: [{ type: 'p', text: 'Piesele din stoc se livrează în 1 – 2 zile lucrătoare, dar ajustările și o a doua probă au nevoie de timp. Termenul pentru piesele croite pe măsură ți-l confirmă consultantul la telefon.' }],
      },
      {
        id: 'greseli',
        question: 'Care sunt cele mai frecvente greșeli la black tie?',
        answer: 'Cravata în loc de papion și pantofii nepotriviți sunt primele două.',
        blocks: [
          { type: 'list', items: [
            'Cravată în loc de papion.',
            'Curea la pantalonii de smoking (se poartă bretele).',
            'Pantofi maro sau mați la un eveniment de seară.',
            'Mâneca sacoului prea lungă: din manșeta cămășii trebuie să se vadă în jur de un centimetru.',
            'Un ceas sport voluminos în locul unuia subțire, pe curea de piele.',
          ] },
        ],
      },
    ],
    faqs: [
      { q: 'Ce înseamnă black tie pe o invitație?', a: 'Black tie înseamnă smoking: sacou negru sau bleumarin foarte închis cu revere de satin, pantaloni asortați cu dungă de satin, cămașă albă de ceremonie, papion negru și pantofi negri lucioși.' },
      { q: 'Pot purta cravată la un eveniment black tie?', a: 'Nu. Black tie înseamnă papion negru. Cravata ține de ținuta business sau de costumul de zi.' },
      {
        q: 'Unde găsesc ținută de gală în Cluj-Napoca?',
        a: `La Cesarini, ${verified.street}, ${verified.postalCode} ${verified.city}: cămăși de ceremonie de la ${formatRON(p.ceremonyShirt)}, pantofi Oxford negri lucioși la ${formatRON(p.oxfordShoes)}, costume de ceremonie la ${formatRON(p.ceremonySuit)}, papioane și butoni. Program: ${hours}. Programări la ${verified.phoneDisplay}.`,
      },
      { q: 'Pot comanda online un costum croit pe măsură de la Cesarini?', a: 'Da. Pe pagina costumului sau a cămășii alegi „Croit pe măsură”, introduci măsurile cu ajutorul ghidului ilustrat, iar un consultant Cesarini te sună să le verifice înainte de croire.' },
      { q: 'Cât costă un costum de ceremonie Cesarini?', a: `Costumul de ceremonie Cesarini costă ${formatRON(p.ceremonySuit)}. Are trei piese (${verified.ceremonySuitSpec.pieces}), este din ${verified.ceremonySuitSpec.fabric} și vine în mărimile ${verified.ceremonySuitSpec.sizes}.` },
    ],
    relatedProducts: ['camasa-ceremonie-nasturi-ascunsi', 'pantofi-oxford-negru-lucios', 'costum-ceremonie', 'camasa-ceremonie-nasturi-negri'],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Ghiduri anunțate, fără pagină încă (apar în Journal ca „În pregătire”, fără link). */
export const upcoming = [
  'Costumul de mire: calendarul probelor',
  'Lungimea corectă a manșetei',
  'Cum asortezi cravata cu costumul',
];

export const formatDateRo = (iso: string) =>
  new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00Z`));
