import { SITE_URL, verified } from '@/lib/brand';
import { commerceProducts, type CommerceProduct } from '@/lib/commerce/catalog';

/**
 * Feed Google Merchant Center (RSS 2.0 + namespace g:), generat din catalog la fiecare build.
 * Prețul, stocul și pozele sunt exact cele de pe site (altfel Google respinge produsele).
 * Costul livrării NU e în feed: nu e confirmat, se setează în contul Merchant Center.
 * Adresa: /feed/google.xml → Merchant Center → Produse → Surse de date → „Fișier programat”.
 */
const TAXONOMY: Record<string, string> = {
  suit: 'Apparel & Accessories > Clothing > Suits',
  shirt: 'Apparel & Accessories > Clothing > Shirts & Tops',
  shoes: 'Apparel & Accessories > Shoes',
  belt: 'Apparel & Accessories > Clothing Accessories > Belts',
  socks: 'Apparel & Accessories > Clothing > Underwear & Socks > Socks',
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tag = (k: string, v?: string | number | null) => (v === undefined || v === null || v === '' ? '' : `      <g:${k}>${esc(String(v))}</g:${k}>\n`);

function item(p: CommerceProduct) {
  const url = `${SITE_URL}/produs/${p.slug}`;
  const imgs = p.gallery.filter((g) => g.src.startsWith('/produse/')).map((g) => SITE_URL + g.src);
  if (!imgs.length) return '';
  // Titlu: ce caută omul + atributul cheie + brand (max 150 caractere)
  const title = [p.name, p.code && `model ${p.code}`, p.pieces && `${p.pieces} piese`, 'Cesarini'].filter(Boolean).join(', ').slice(0, 150);
  const body = [p.lead, ...(p.description ?? []).flatMap((s) => s.paragraphs), p.details.join('. ')].join('\n\n').slice(0, 4900);
  return `    <item>
${tag('id', p.slug)}${tag('title', title)}${tag('description', body)}${tag('link', url)}${tag('image_link', imgs[0])}${imgs
    .slice(1, 11)
    .map((i) => tag('additional_image_link', i))
    .join('')}${tag('availability', 'in_stock')}${tag('price', `${p.price.toFixed(2)} RON`)}${tag('brand', verified.name)}${tag('condition', 'new')}${tag(
    'identifier_exists',
    'no',
  )}${tag('mpn', p.code)}${tag('google_product_category', TAXONOMY[p.garment])}${tag('product_type', `${p.category}`)}${tag('gender', 'male')}${tag(
    'age_group',
    'adult',
  )}${tag('color', p.color)}${tag('material', p.composition)}${tag('custom_label_0', p.occasions.join(' '))}${tag('custom_label_1', p.categoryKey)}    </item>
`;
}

export function merchantFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(verified.name)} · costume bărbătești, Cluj-Napoca</title>
    <link>${SITE_URL}</link>
    <description>Costume de ceremonie și business, cămăși, pantofi și accesorii ${esc(verified.name)}.</description>
${commerceProducts.map(item).join('')}  </channel>
</rss>
`;
}
