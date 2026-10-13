import type { Metadata } from 'next';
import { social } from '@/lib/seo';
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
  const title = `${p.name} · ${formatRON(p.price)}`;
  const description = `${p.lead} ${formatRON(p.price)}.${isMtm(p.garment) ? ' Mărime standard sau croit pe măsură.' : ''} Cesarini, Cluj-Napoca.`;
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
