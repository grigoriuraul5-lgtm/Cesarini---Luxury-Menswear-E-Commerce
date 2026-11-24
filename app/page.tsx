import { SiteNav } from '@/components/SiteNav';
import { Hero, FactsBand } from '@/components/Hero';
import { IntroCurtain } from '@/components/IntroCurtain';
import { Atelier } from '@/components/Atelier';
import { HomeShop } from '@/components/HomeShop';
import { LookBuilder } from '@/components/LookBuilder';
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
        {/* Vitrina magazinului, direct sub hero (24.11.2026); înlocuiește caruselul „Garderoba unei seri importante” */}
        <HomeShop />
        <LookBuilder />
        <FactsBand />
        <Atelier />
        <HomeFaq />
      </main>
      <SiteFooter />
      {/* FAQPage: același text ca acordeonul de mai sus, în HTML-ul inițial */}
      <JsonLd data={{ '@context': 'https://schema.org', ...faqGraph() }} />
    </>
  );
}
