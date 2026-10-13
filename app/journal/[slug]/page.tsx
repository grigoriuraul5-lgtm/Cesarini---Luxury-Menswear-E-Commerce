import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { articles, getArticle } from '@/lib/journal';
import { articleGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { ArticlePage } from '@/components/journal/ArticlePage';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.shortAnswer.slice(0, 300),
    alternates: { canonical: `/journal/${a.slug}` },
    ...social({ title: a.title, description: a.dek, path: `/journal/${a.slug}`, type: 'article', published: a.published, modified: a.updated }),
  };
}

export default async function JournalArticle({ params }: Params) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <>
      <SiteNav />
      <main id="continut">
        <ArticlePage a={a} />
      </main>
      <SiteFooter />
      <JsonLd data={articleGraph(a)} />
    </>
  );
}
