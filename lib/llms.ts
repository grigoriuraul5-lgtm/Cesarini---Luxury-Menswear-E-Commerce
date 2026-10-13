/**
 * Conținutul pentru /llms.txt (rezumat cu linkuri, formatul llmstxt.org) și /llms-full.txt (textul complet).
 * Generat din aceleași date ca site-ul și JSON-LD-ul, ca să nu existe două versiuni ale faptelor.
 */
import { SITE_URL, faqs, formatRON, verified } from './brand';
import { CATEGORIES, OCCASIONS, commerceProducts, isMtm } from './commerce/catalog';
import { articles } from './journal';

const hours = verified.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join('; ');
const byRank = [...commerceProducts].sort((a, b) => a.rank - b.rank);
const fromPrice = (key: string) => Math.min(...commerceProducts.filter((p) => p.categoryKey === key).map((p) => p.price));

export function llmsTxt() {
  return [
    `# ${verified.name}`,
    '',
    `> ${verified.entitySentence}`,
    '',
    `- Adresă: ${verified.street}, ${verified.postalCode} ${verified.city}, jud. ${verified.region}, România`,
    `- Program: ${hours}; duminică închis. ${verified.appointmentNote}`,
    `- Telefon: ${verified.phoneDisplay} (${verified.phoneE164}) · Email: ${verified.email}`,
    `- Activ din: ${verified.foundingYear}`,
    `- Livrare: ${verified.delivery}`,
    `- Ajustări: ${verified.freeAlterations}`,
    '- Croit pe măsură online: pentru costume și cămăși, clientul introduce măsurile pe site; un consultant le verifică la telefon înainte de croire.',
    '',
    '## Pagini',
    '',
    `- [Atelier & showroom Cluj-Napoca](${SITE_URL}/atelier): adresa, programul, programările și serviciile atelierului (ajustări gratuite pentru ținuta cumpărată din showroom, cămăși pe măsură, ținute de ceremonie).`,
    `- [Community](${SITE_URL}/comunitate): canalele oficiale Cesarini: Instagram ${verified.social.instagram}, TikTok ${verified.social.tiktok}, Facebook ${verified.social.facebook}.`,
    `- [The Cesarini Journal](${SITE_URL}/journal): ghiduri de stil cu răspunsuri directe (black tie, stofa costumului de mire, eticheta cămășii și a smokingului).`,
    '',
    '## Colecții',
    '',
    `- [Toate colecțiile](${SITE_URL}/colectii): ${commerceProducts.length} produse, de la ${formatRON(Math.min(...byRank.map((p) => p.price)))} la ${formatRON(Math.max(...byRank.map((p) => p.price)))}`,
    ...CATEGORIES.map((c) => `- [${c.title}](${SITE_URL}/colectii/${c.key}): de la ${formatRON(fromPrice(c.key))}. ${c.intro}`),
    '',
    '## Produse',
    '',
    ...byRank.map(
      (p) =>
        `- [${p.name}](${SITE_URL}/produs/${p.slug}): ${formatRON(p.price)}. ${p.lead}${isMtm(p.garment) ? ' Se poate croi și pe măsură.' : ''} Ocazii: ${OCCASIONS.filter((o) => p.occasions.includes(o.key)).map((o) => o.label).join(', ')}.`,
    ),
    '',
    '## Ghiduri de stil',
    '',
    ...articles.map((a) => `- [${a.title}](${SITE_URL}/journal/${a.slug}): ${a.shortAnswer}`),
    '',
    '## Întrebări frecvente',
    '',
    ...faqs.map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Optional',
    '',
    `- [Textul complet pentru modele AI](${SITE_URL}/llms-full.txt)`,
    `- [Instagram](${verified.social.instagram})`,
    `- [Facebook](${verified.social.facebook})`,
    `- [TikTok](${verified.social.tiktok})`,
    '',
  ].join('\n');
}

export function llmsFullTxt() {
  const parts = [llmsTxt(), '---', ''];
  for (const a of articles) {
    parts.push(`# ${a.title}`, '', `Sursa: ${SITE_URL}/journal/${a.slug} · actualizat ${a.updated}`, '', `> ${a.shortAnswer}`, '');
    for (const s of a.sections) {
      parts.push(`## ${s.question}`, '', s.answer, '');
      for (const b of s.blocks) {
        if (b.type === 'p' || b.type === 'note') parts.push(b.text, '');
        if (b.type === 'list') parts.push(...b.items.map((i) => `- ${i}`), '');
        if (b.type === 'qa') parts.push(`### ${b.q}`, '', b.a, '');
        if (b.type === 'table') parts.push(`| ${b.head.join(' | ')} |`, '| --- | --- | --- |', ...b.rows.map((r) => `| ${r.join(' | ')} |`), '');
      }
    }
    parts.push('## Întrebări frecvente', '', ...a.faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']));
  }
  return parts.join('\n');
}
