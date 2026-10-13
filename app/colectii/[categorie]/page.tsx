import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { formatRON } from '@/lib/brand';
import { CATEGORIES, commerceProducts, getCategory } from '@/lib/commerce/catalog';
import { catalogGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { Catalog } from '@/components/commerce/Catalog';

type Params = { params: Promise<{ categorie: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ categorie: c.key }));

const productsOf = (key: string) => commerceProducts.filter((p) => p.categoryKey === key).sort((a, b) => a.rank - b.rank);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCategory((await params).categorie);
  if (!c) return {};
  const from = Math.min(...productsOf(c.key).map((p) => p.price));
  const title = `${c.title} · de la ${formatRON(from)}`;
  const description = `${c.intro} De la ${formatRON(from)}. Cesarini, Cluj-Napoca.`;
  return {
    title,
    description,
    alternates: { canonical: `/colectii/${c.key}` },
    ...social({ title: `${title} | Cesarini`, description, path: `/colectii/${c.key}` }),
  };
}

export default async function CategoryPage({ params }: Params) {
  const c = getCategory((await params).categorie);
  if (!c) notFound();
  return (
    <>
      <SiteNav />
      <main id="continut">
        <Catalog category={c.key} />
      </main>
      <SiteFooter />
      <JsonLd
        data={catalogGraph({
          path: `/colectii/${c.key}`,
          name: `${c.title} — Cesarini`,
          description: c.intro,
          products: productsOf(c.key),
          breadcrumb: [
            { name: 'Acasă', path: '/' },
            { name: 'Colecții', path: '/colectii' },
            { name: c.title, path: `/colectii/${c.key}` },
          ],
        })}
      />
    </>
  );
}
