import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { verified } from '@/lib/brand';
import { webPageGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { AtelierPage } from '@/components/atelier/AtelierPage';

const description = `Showroom-ul Cesarini din Cluj-Napoca, ${verified.street}: ajustări gratuite pentru ținuta cumpărată din showroom, cămăși pe măsură și ținute de ceremonie. Program L–V 11:00–19:00, S 11:00–14:00. Programări la ${verified.phoneDisplay}.`;

export const metadata: Metadata = {
  title: 'Atelier & showroom Cluj-Napoca: program, adresă, programări',
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
