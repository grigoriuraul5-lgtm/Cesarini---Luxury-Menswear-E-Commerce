import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { formatRON } from '@/lib/brand';
import { commerceProducts } from '@/lib/commerce/catalog';
import { catalogGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { Catalog } from '@/components/commerce/Catalog';

const prices = commerceProducts.map((p) => p.price);
const description = `Costume de ceremonie și business, cămăși, pantofi Oxford și accesorii Cesarini, de la ${formatRON(Math.min(...prices))} la ${formatRON(Math.max(...prices))}. Costumele și cămășile se pot croi pe măsură. Showroom în Cluj-Napoca.`;

export const metadata: Metadata = {
  title: 'Colecții: costume, cămăși, pantofi și accesorii',
  description,
  alternates: { canonical: '/colectii' },
  ...social({ title: 'Colecțiile Cesarini: costume, cămăși, pantofi și accesorii', description, path: '/colectii' }),
};

export default function CollectionsPage() {
  const list = [...commerceProducts].sort((a, b) => a.rank - b.rank);
  return (
    <>
      <SiteNav />
      <main id="continut">
        <Catalog />
      </main>
      <SiteFooter />
      <JsonLd
        data={catalogGraph({
          path: '/colectii',
          name: 'Colecțiile Cesarini',
          description,
          products: list,
          breadcrumb: [{ name: 'Acasă', path: '/' }, { name: 'Colecții', path: '/colectii' }],
        })}
      />
    </>
  );
}
