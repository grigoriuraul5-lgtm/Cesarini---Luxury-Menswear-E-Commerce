import type { Metadata } from 'next';
import { fitDescription, fitTitle, social } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { formatRON } from '@/lib/brand';
import { commerceProducts, getProduct, isMtm } from '@/lib/commerce/catalog';
import { productPageGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { ProductPage } from '@/components/commerce/ProductPage';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => commerceProducts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  // Titlu unic pe model (codul deosebește costumele cu același nume) și descriere unică, în lungimile afișate de Google
  const named = p.code ? `${p.name} ${p.code}` : p.name;
  const title = fitTitle([`${named} · ${formatRON(p.price)}`, `${named} · ${formatRON(p.price).replace(' lei', '')} lei`, named, p.name]);
  const facts = [p.code && `model ${p.code}`, p.pieces && `${p.pieces} piese`, p.composition].filter(Boolean).join(', ');
  const description = fitDescription(
    `${p.name}${facts ? `, ${facts}` : ''}: ${formatRON(p.price)}.${isMtm(p.garment) ? ' Mărime standard sau croit pe măsura ta.' : ''} Livrare în toată țara sau probă în showroom-ul Cesarini din Cluj.`,
  );
  return {
    title,
    description,
    alternates: { canonical: `/produs/${p.slug}` },
    ...social({ title: `${title} | Cesarini`, description, path: `/produs/${p.slug}` }),
  };
}

export default async function Page({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return (
    <>
      <SiteNav />
      <main id="continut">
        <ProductPage slug={p.slug} />
      </main>
      <SiteFooter />
      <JsonLd data={productPageGraph(p)} />
    </>
  );
}
