import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { verified } from '@/lib/brand';
import { webPageGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { AtelierPage } from '@/components/atelier/AtelierPage';

const description = `Showroom Cesarini, ${verified.street}, Cluj: costume Made to Measure, ajustări gratuite pentru ținuta din showroom și consultanță. Programări: ${verified.phoneDisplay}.`;

export const metadata: Metadata = {
  title: 'Showroom și atelier de croitorie în Cluj-Napoca',
  description,
  alternates: { canonical: '/atelier' },
  ...social({ title: 'Atelierul și showroom-ul Cesarini, Cluj-Napoca', description, path: '/atelier' }),
};

export default function Atelier() {
  return (
    <>
      <SiteNav />
      <main id="continut">
        <AtelierPage />
      </main>
      <SiteFooter />
      <JsonLd
        data={webPageGraph({
          path: '/atelier',
          name: 'Atelierul și showroom-ul Cesarini din Cluj-Napoca',
          description,
          type: 'ContactPage',
          breadcrumb: [{ name: 'Acasă', path: '/' }, { name: 'Atelier', path: '/atelier' }],
        })}
      />
    </>
  );
}
