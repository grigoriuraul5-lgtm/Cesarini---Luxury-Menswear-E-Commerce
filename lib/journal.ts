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
  | { type: 'note'; text: string }
  /** sub-întrebare cu răspuns (H3): pentru căutările conversaționale, ca „Mai mare înseamnă mai bun?” */
  | { type: 'qa'; q: string; a: string };

export type Section = { id: string; question: string; answer: string; blocks: Block[] };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  /** subiectul articolului (schema Article.about) */
  about: string;
  /** ocazia preselectată când cititorul programează o probă din articol */
  occasion: string;
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
    about: 'Black tie (cod vestimentar)',
    occasion: 'Gală / Black tie',
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
          { type: 'p', text: 'Pe invitații apare ca „black tie”, „ținută de gală” sau, simplu, „smoking”. Se poartă la gale, baluri, premieri și nunți care încep seara.' },
          { type: 'qa', q: 'Care e diferența față de white tie?', a: 'White tie cere frac, vestă și papion albe și este cel mai formal cod vestimentar de seară. Black tie e mai simplu și mult mai des întâlnit.' },
          { type: 'qa', q: 'Ce înseamnă „black tie optional”?', a: 'Smokingul e binevenit, dar nu obligatoriu: un costum închis la culoare, bine croit, cu cămașă albă și papion negru este la fel de corect.' },
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
              ['Pantofii', 'Oxford negru lucios sau pantofi de seară din lac.', `Pantofi Oxford negru semilucios · ${formatRON(p.oxfordShoes)}`],
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
          { type: 'p', text: `Un costum negru sau bleumarin închis, cu cămașă albă și papion negru, e alegerea corectă când invitația lasă loc. Costumul de ceremonie Cesarini vine în ${verified.ceremonySuitSpec.piecesRange}, e din ${verified.ceremonySuitSpec.fabric}, vine în mărimile ${verified.ceremonySuitSpec.sizes} și costă ${formatRON(p.ceremonySuit)}.` },
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
      { q: 'Cât costă un costum de ceremonie Cesarini?', a: `Costumul de ceremonie Cesarini costă ${formatRON(p.ceremonySuit)}. Vine în ${verified.ceremonySuitSpec.piecesRange}, este din ${verified.ceremonySuitSpec.fabric} și vine în mărimile ${verified.ceremonySuitSpec.sizes}.` },
    ],
    relatedProducts: ['camasa-ceremonie-nasturi-ascunsi', 'pantofi-oxford-negru-semilucios', 'costum-ceremonie-negru-c03', 'camasa-ceremonie-nasturi-negri'],
  },
  {
    slug: 'stofa-costum-de-mire',
    title: 'Cum alegi stofa perfectă pentru un costum de mire: Lână Merino Super 130s vs. Mătase',
    kicker: 'Stofe & croială',
    about: 'Stofe pentru costumul de mire',
    occasion: 'Nuntă — mire',
    dek: 'Ce înseamnă numerele „Super” de pe etichetă, când are sens mătasea și ce greutate de stofă alegi pentru o nuntă de vară sau de iarnă.',
    shortAnswer: `Pentru un costum de mire, lâna merino fină (în jur de Super 110s – 130s) este alegerea cea mai sigură: drapează frumos, respiră o zi întreagă și își revine după șifonare. Mătasea pură se folosește rar la un costum întreg; o găsești în amestec cu lâna, pentru luciu, sau la reverele smokingului, la papion și la batistă. La Cesarini (${addr}), costumul de ceremonie este din ${verified.ceremonySuitSpec.fabric}, în două sau trei piese, la ${formatRON(p.ceremonySuit)}.`,
    published: '2026-10-13',
    updated: '2026-10-13',
    readingMinutes: 8,
    keywords: ['stofă costum de mire', 'lână merino', 'Super 130s', 'costum din mătase', 'lână și mătase', 'costum de mire Cluj-Napoca'],
    sections: [
      {
        id: 'super-130s',
        question: 'Ce înseamnă „Super 130s” pe eticheta unei stofe?',
        answer: 'Este un indicator al fineții fibrei de lână: cu cât numărul e mai mare, cu atât fibra e mai subțire, iar stofa mai fină la atingere.',
        blocks: [
          { type: 'p', text: 'Numerele „Super” sunt definite de standardul internațional al industriei lânii (IWTO) după diametrul maxim al fibrei, măsurat în microni. Super 130s înseamnă fibre de cel mult 17,25 microni; fiecare treaptă în plus (140s, 150s) scade diametrul cu încă o jumătate de micron.' },
          {
            type: 'table',
            caption: 'Treptele Super, pe scurt',
            head: ['Eticheta', 'Cum se simte', 'Pentru cine'],
            rows: [
              ['Super 100s – 110s', 'Fermă, rezistentă, se șifonează greu.', 'Costumul purtat des, la birou și la evenimente.'],
              ['Super 120s – 130s', 'Fină, cu cădere moale și luciu discret.', 'Costumul de mire și de ceremonie: echilibrul cel mai bun.'],
              ['Super 150s și peste', 'Foarte fină, aproape mătăsoasă.', 'Ocazii rare; cere grijă la purtare și la călcat.'],
            ],
          },
          { type: 'qa', q: 'Un număr mai mare înseamnă un costum mai bun?', a: 'Nu neapărat. Peste Super 150s stofa devine mai delicată: se lucește mai repede la coate și la genunchi și se șifonează mai ușor. Pentru o zi de nuntă, cu ceremonie, fotografii și dans, o lână Super 110s – 130s ține forma mai bine.' },
          { type: 'qa', q: 'Ce e lâna merino?', a: 'Lâna oilor merino, cu fibre naturale fine și ondulate. Respiră, reglează temperatura și își recapătă forma după ce o atârni pe umeraș peste noapte.' },
        ],
      },
      {
        id: 'lana-sau-matase',
        question: 'Lână merino sau mătase pentru costumul de mire?',
        answer: 'Lâna merino pentru costumul întreg; mătasea ca accent: în amestec cu lâna, la reverele smokingului, la papion sau la batistă.',
        blocks: [
          {
            type: 'table',
            caption: 'Lână merino și mătase, comparate pentru o zi de nuntă',
            head: ['Criteriul', 'Lână merino', 'Mătase'],
            rows: [
              ['Respirabilitate', 'Foarte bună: absoarbe umezeala și o eliberează treptat.', 'Bună, dar urmele de transpirație se văd ușor.'],
              ['Șifonare', 'Își revine singură după câteva ore pe umeraș.', 'Se șifonează și păstrează cutele.'],
              ['Luciu', 'Discret, mat-satinat.', 'Natural strălucitor, vizibil în fotografii.'],
              ['Rezistență', 'Ține forma sacoului o zi întreagă.', 'Fibră puternică, dar suprafața se marchează ușor.'],
              ['Unde se folosește', 'Costumul întreg, vesta, pantalonii.', 'Reverele smokingului, papionul, cravata, batista.'],
            ],
          },
          { type: 'qa', q: 'Există costume din mătase pură?', a: 'Da, mai ales în țesături texturate de vară, dar sunt rare și pretențioase la purtare. Pentru mire, efectul de luciu se obține mai sigur cu o lână fină sau cu un amestec lână – mătase.' },
        ],
      },
      {
        id: 'amestecuri',
        question: 'Ce aduce un amestec de lână și mătase?',
        answer: 'Un luciu discret și o atingere mai fină, păstrând structura și rezistența lânii.',
        blocks: [
          { type: 'p', text: 'În amestec, lâna rămâne fibra de bază și ține forma costumului, iar un procent mic de mătase adaugă lumină stofei. Rezultatul arată elegant sub lumina caldă a unei săli de evenimente și în fotografii, fără să pară lucios.' },
          { type: 'note', text: 'Compoziția exactă a stofei e scrisă pe eticheta din interiorul sacoului. Citește-o înainte de cumpărare și întreabă cum se întreține.' },
        ],
      },
      {
        id: 'anotimp',
        question: 'Ce greutate de stofă alegi în funcție de anotimp?',
        answer: 'Vara, stofe ușoare și țesături aerisite; iarna, stofe mai grele; pentru tot anul, o greutate medie.',
        blocks: [
          {
            type: 'list',
            items: [
              'Vara: stofe ușoare, în jur de 230 – 260 de grame pe metru, cu țesătură aerisită și căptușeală parțială.',
              'Primăvara și toamna: o greutate medie, în jur de 260 – 300 de grame pe metru, bună pentru tot anul.',
              'Iarna: 300 de grame pe metru sau mai mult, eventual cu o textură ușor periată.',
            ],
          },
          { type: 'qa', q: 'Ce porți la o nuntă în august?', a: 'O lână ușoară, cu țesătură deschisă, într-o culoare care nu absoarbe căldura, cum ar fi un bleumarin sau un gri mediu. Vesta poate rămâne pentru ceremonie și fotografii, iar seara o lași deoparte.' },
        ],
      },
      {
        id: 'culoarea',
        question: 'Ce culoare alegi pentru costumul de mire?',
        answer: 'Bleumarin, gri cărbune sau negru, după ora ceremoniei și stilul nunții.',
        blocks: [
          { type: 'p', text: 'Bleumarinul e cea mai versatilă alegere: arată bine ziua și seara și se potrivește cu aproape orice paletă de flori. Griul cărbune e sobru și elegant. Negrul e culoarea serii; la o nuntă care începe după-amiaza și se termină noaptea, rămâne corect.' },
          { type: 'qa', q: 'Trebuie să difere costumul mirelui de al nașului?', a: 'Nu e o regulă, dar ajută: mirele poate purta o culoare sau o textură diferită, sau o vestă, ca să se distingă în fotografii.' },
        ],
      },
      {
        id: 'la-cesarini',
        question: 'Cum îți alegi costumul de mire la Cesarini, în Cluj-Napoca?',
        answer: `Costumul de ceremonie Cesarini este din ${verified.ceremonySuitSpec.fabric}, în două sau trei piese, și costă ${formatRON(p.ceremonySuit)}; restul detaliilor despre stofă le discuți cu un consultant în showroom.`,
        blocks: [
          {
            type: 'list',
            items: [
              `Două sau trei piese (vesta apare la modelele în trei piese), mărimile ${verified.ceremonySuitSpec.sizes}.`,
              `În showroom (${addr}): ${verified.freeAlterations}`,
              'Online: alegi „Croit pe măsură” pe pagina costumului și introduci măsurile; un consultant te sună să le verifice înainte de croire.',
              `Program: ${hours}. ${verified.appointmentNote}`,
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: 'Ce înseamnă Super 130s la un costum?', a: 'Super 130s arată finețea lânii: fibre de cel mult 17,25 microni. Stofa e fină, cu cădere moale, dar destul de rezistentă pentru o zi întreagă, motiv pentru care e o alegere bună pentru costumul de mire.' },
      { q: 'Este mătasea potrivită pentru un costum de mire?', a: 'Ca accent, da: în amestec cu lâna, la reverele smokingului, la papion sau la batistă. Un costum întreg din mătase pură se șifonează ușor și arată urmele de transpirație, așa că pentru o zi lungă lâna merino e mai sigură.' },
      { q: 'Ce stofă alegi pentru o nuntă vara?', a: 'O lână ușoară, în jur de 230 – 260 de grame pe metru, cu țesătură aerisită și căptușeală parțială, într-o culoare ca bleumarinul sau griul mediu.' },
      { q: 'Din ce stofă e costumul de ceremonie Cesarini?', a: `Costumul de ceremonie Cesarini este din ${verified.ceremonySuitSpec.fabric} și vine în ${verified.ceremonySuitSpec.piecesRange}, în mărimile ${verified.ceremonySuitSpec.sizes}. Costă ${formatRON(p.ceremonySuit)}.` },
      { q: 'Unde pot proba un costum de mire în Cluj-Napoca?', a: `La showroom-ul Cesarini, ${verified.street}, ${verified.postalCode} ${verified.city}. Program: ${hours}. Programări la ${verified.phoneDisplay}.` },
    ],
    relatedProducts: ['costum-ceremonie-negru-c03', 'camasa-ceremonie-nasturi-ascunsi', 'pantofi-oxford-negru-semilucios', 'curea-piele-naturala'],
  },
  {
    slug: 'eticheta-camasa-smoking',
    title: 'Eticheta masculină la evenimente formale: Regulile nescrise ale cămășii și smokingului',
    kicker: 'Etichetă',
    about: 'Etichetă vestimentară masculină la evenimente formale',
    occasion: 'Gală / Black tie',
    dek: 'Gulerul, manșeta, nasturii și papionul: detaliile pe care nu le scrie nimeni pe invitație, dar pe care le observă toată lumea.',
    shortAnswer: `La un eveniment formal, cămașa e albă, cu guler care stă drept sub reverele sacoului și o manșetă vizibilă cam un centimetru din mâneca sacoului. Smokingul se poartă cu papion negru, niciodată cu cravată, cu pantofi negri lucioși și fără curea. Sacoul se încheie când stai în picioare și se descheie când te așezi. La Cesarini (${addr}) găsești cămăși de ceremonie de la ${formatRON(p.ceremonyShirt)} și pantofi Oxford negri lucioși la ${formatRON(p.oxfordShoes)}.`,
    published: '2026-10-13',
    updated: '2026-10-13',
    readingMinutes: 7,
    keywords: ['etichetă vestimentară bărbați', 'cămașă de ceremonie', 'reguli smoking', 'manșetă cămașă', 'papion', 'cămașă ceremonie Cluj'],
    sections: [
      {
        id: 'camasa',
        question: 'Ce cămașă porți la un eveniment formal?',
        answer: 'O cămașă albă de ceremonie, cu guler care stă drept sub reverele sacoului și cu manșete curate, fără nasturi la colțurile gulerului.',
        blocks: [
          { type: 'p', text: 'Albul e regula pentru seară și pentru ceremonie. Gulerul trebuie să atingă ușor gâtul fără să-l strângă: dacă încape un deget între guler și gât, mărimea e potrivită. Gulerul cu nasturi la colțuri (button-down) ține de ținuta casual și nu se poartă la evenimente formale.' },
          { type: 'qa', q: 'Ce guler merge cu papionul?', a: 'Gulerul clasic, cu colțuri drepte sau ușor depărtate, e alegerea sigură la smoking. Gulerul cu colțurile îndoite (wing collar) ține de tradiția fracului, la evenimentele white tie.' },
          { type: 'qa', q: 'Nasturi ascunși sau nasturi la vedere?', a: 'La smoking, o cămașă cu nasturi ascunși păstrează pieptul curat sub papion. Nasturii negri amintesc de butonii de plastron ai cămășilor de seară și se potrivesc cu papionul negru.' },
        ],
      },
      {
        id: 'manseta',
        question: 'Cât trebuie să se vadă manșeta cămășii din mâneca sacoului?',
        answer: 'În jur de un centimetru, cu brațele lăsate pe lângă corp.',
        blocks: [
          { type: 'p', text: 'Manșeta vizibilă face legătura între cămașă și sacou și arată că ținuta e potrivită pe tine. Dacă mâneca sacoului acoperă complet manșeta, sacoul are mâneca prea lungă; dacă se vede mult mai mult, cămașa are mâneca prea lungă sau sacoul are mâneca prea scurtă.' },
          { type: 'qa', q: 'Manșetă dublă sau simplă?', a: 'Manșeta dublă, întoarsă și prinsă cu butoni, este varianta cea mai formală. Manșeta simplă, cu nasture, e corectă la costumul de zi și la majoritatea evenimentelor.' },
        ],
      },
      {
        id: 'smoking',
        question: 'Care sunt regulile nescrise ale smokingului?',
        answer: 'Papion negru, pantofi negri lucioși, bretele în loc de curea și accesorii puține.',
        blocks: [
          {
            type: 'list',
            items: [
              'Papionul e negru și are, ideal, aceeași textură ca reverele.',
              'Pantalonii de smoking nu au găici de curea; se poartă cu bretele sau cu talie ajustabilă.',
              'Talia cămășii nu se vede: o acoperă brâul (cummerbund) sau vesta joasă.',
              'Pantofii sunt negri și lucioși: Oxford din piele lăcuită sau foarte bine lustruită.',
              'Șosetele sunt negre, subțiri și destul de lungi încât să nu se vadă pielea când stai jos.',
            ],
          },
        ],
      },
      {
        id: 'nasturi',
        question: 'Când închei și când descheii sacoul?',
        answer: 'Îl închei când stai în picioare și îl descheii când te așezi; la sacourile cu doi sau trei nasturi, cel de jos rămâne mereu descheiat.',
        blocks: [
          { type: 'p', text: 'Regula ține de croială: sacoul e croit să cadă drept în picioare și să se deschidă când stai jos. Smokingul are, de regulă, un singur nasture, care se încheie de fiecare dată când te ridici.' },
          { type: 'qa', q: 'Și vesta?', a: 'La vestă, nasturele de jos rămâne descheiat. Vesta nu se descheie când te așezi: e croită să stea închisă.' },
        ],
      },
      {
        id: 'accesorii',
        question: 'Ce accesorii sunt potrivite la un eveniment formal?',
        answer: 'Puține și discrete: butoni, un ceas subțire pe curea de piele și o batistă albă la buzunarul de la piept.',
        blocks: [
          { type: 'qa', q: 'Batista trebuie să fie asortată cu papionul?', a: 'Nu identică. Batista albă, de in sau de bumbac, e alegerea sigură la seară; o batistă din aceeași stofă ca papionul arată ca un set cumpărat împreună.' },
          { type: 'qa', q: 'Ce ceas porți la smoking?', a: 'Unul subțire, pe curea de piele, care intră sub manșetă. Ceasurile sport, voluminoase, se lasă acasă.' },
        ],
      },
      {
        id: 'greseli',
        question: 'Ce greșeli de etichetă se văd imediat?',
        answer: 'Cravata la smoking, cureaua vizibilă și mânecile de lungimi greșite sunt primele pe care le observă ceilalți.',
        blocks: [
          {
            type: 'list',
            items: [
              'Cravată în loc de papion la un eveniment black tie.',
              'Curea la pantalonii de smoking.',
              'Gulerul cu nasturi la colțuri (button-down) sub un sacou de ceremonie.',
              'Sacoul încheiat când stai la masă sau nasturele de jos încheiat.',
              'Pantofi maro sau mați la un eveniment de seară.',
            ],
          },
          { type: 'note', text: 'Cele mai multe greșeli se rezolvă la probă: lungimea mânecii, talia pantalonului și gulerul se ajustează înainte de eveniment.' },
        ],
      },
    ],
    faqs: [
      { q: 'Cât trebuie să se vadă manșeta cămășii?', a: 'În jur de un centimetru din mâneca sacoului, cu brațele lăsate pe lângă corp.' },
      { q: 'Se poartă curea la smoking?', a: 'Nu. Pantalonii de smoking nu au găici de curea și se poartă cu bretele sau cu talie ajustabilă.' },
      { q: 'Ce nasture al sacoului rămâne descheiat?', a: 'La sacourile cu doi sau trei nasturi, cel de jos rămâne mereu descheiat. Sacoul se încheie în picioare și se descheie când te așezi.' },
      { q: 'Ce cămașă porți cu papionul?', a: 'O cămașă albă de ceremonie, cu guler clasic, cu nasturi ascunși sau cu nasturi negri, și, ideal, cu manșetă dublă pentru butoni.' },
      { q: 'Unde găsesc cămașă de ceremonie în Cluj-Napoca?', a: `La Cesarini, ${verified.street}, ${verified.postalCode} ${verified.city}: cămăși de ceremonie clasice, cu nasturi ascunși sau cu nasturi negri, la ${formatRON(p.ceremonyShirt)}, și pantofi Oxford negri lucioși la ${formatRON(p.oxfordShoes)}. Program: ${hours}. Programări la ${verified.phoneDisplay}.` },
    ],
    relatedProducts: ['camasa-ceremonie-nasturi-ascunsi', 'camasa-ceremonie-nasturi-negri', 'camasa-ceremonie-clasica', 'pantofi-oxford-negru-semilucios'],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Ghiduri anunțate, fără pagină încă (apar în Journal ca „În pregătire”, fără link). Gol = nu se afișează. */
export const upcoming: string[] = [];

export const formatDateRo = (iso: string) =>
  new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00Z`));
