import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { webPageGraph } from '@/lib/schema';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { CommunityPage } from '@/components/community/CommunityPage';

const description = 'Comunitatea Cesarini: ținute de ceremonie, probe în showroom și detalii din atelierul din Cluj-Napoca, pe Instagram (@cesarini.romania), TikTok și Facebook.';

export const metadata: Metadata = {
  title: 'Community: Cesarini pe Instagram, TikTok și Facebook',
  description,
  alternates: { canonical: '/comunitate' },
  ...social({ title: 'Comunitatea Cesarini', description, path: '/comunitate' }),
};

export default function Comunitate() {
  return (
    <>
      <SiteNav />
      <main id="continut">
        <CommunityPage />
      </main>
      <SiteFooter />
      <JsonLd
        data={webPageGraph({
          path: '/comunitate',
          name: 'Comunitatea Cesarini',
          description,
          breadcrumb: [{ name: 'Acasă', path: '/' }, { name: 'Community', path: '/comunitate' }],
        })}
      />
    </>
  );
}
