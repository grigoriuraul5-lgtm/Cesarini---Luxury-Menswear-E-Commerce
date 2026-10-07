import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatRON } from '@/lib/brand';
import { commerceProducts, getProduct } from '@/lib/commerce/catalog';
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
  return {
    title: `${p.name} · ${formatRON(p.price)}`,
    description: `${p.lead} ${formatRON(p.price)}. Mărime standard sau croit pe măsură, de la Cesarini, Cluj-Napoca.`,
    alternates: { canonical: `/produs/${p.slug}` },
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
