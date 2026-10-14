import { SiteNav } from '@/components/SiteNav';
import { Hero } from '@/components/Hero';
import { IntroCurtain } from '@/components/IntroCurtain';
import { Atelier } from '@/components/Atelier';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { HomeFaq } from '@/components/HomeFaq';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { faqGraph } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <IntroCurtain />
      <main id="continut">
        <Hero />
        <FeaturedCollections />
        <Atelier />
        <HomeFaq />
      </main>
      <SiteFooter />
      {/* FAQPage: același text ca acordeonul de mai sus, în HTML-ul inițial */}
      <JsonLd data={{ '@context': 'https://schema.org', ...faqGraph() }} />
    </>
  );
}
