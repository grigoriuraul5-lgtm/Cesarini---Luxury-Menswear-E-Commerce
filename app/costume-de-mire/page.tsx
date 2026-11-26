import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { SITE_URL, formatRON, verified } from '@/lib/brand';
import { catalogGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { GroomPage, groomFaqs, groomSuits } from '@/components/landing/GroomPage';

const description = `Costume de mire de ${formatRON(verified.prices.ceremonySuit)}, din 100% lână, în 2 sau 3 piese. Probă și ajustări gratuite în showroom-ul din Cluj sau comandă online, cu livrare în țară.`;

export const metadata: Metadata = {
  title: { absolute: 'Costume de mire în Cluj-Napoca · 2.299 lei | Cesarini' },
  description,
  alternates: { canonical: '/costume-de-mire' },
  ...social({ title: 'Costume de mire în Cluj-Napoca | Cesarini', description, path: '/costume-de-mire' }),
};

export default function Page() {
  const graph = catalogGraph({
    path: '/costume-de-mire',
    name: 'Costume de mire Cesarini, Cluj-Napoca',
    description,
    products: groomSuits,
    breadcrumb: [
      { name: 'Acasă', path: '/' },
      { name: 'Costume de ceremonie', path: '/colectii/costume-ceremonie' },
      { name: 'Costume de mire', path: '/costume-de-mire' },
    ],
  });
  graph['@graph'].push({
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/costume-de-mire#faq`,
    mainEntity: groomFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } as never);
  return (
    <>
      <SiteNav />
      <main id="continut">
        <GroomPage />
      </main>
      <SiteFooter />
      <JsonLd data={graph} />
    </>
  );
}
