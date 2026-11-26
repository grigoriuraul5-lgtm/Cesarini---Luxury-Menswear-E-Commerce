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
import type { Metadata } from 'next';
import { social } from '@/lib/seo';

/** Prima pagină: titlu ≤ 60 și descriere ≤ 160 caractere, cu ce caută clientul (mire, ceremonie, preț, Cluj, livrare). */
const description = 'Costume de ceremonie și de mire de la 2.299 lei, costume business, cămăși, pantofi și accesorii. Showroom în Cluj-Napoca și livrare în toată țara.';
export const metadata: Metadata = {
  title: { absolute: 'Costume de mire și ceremonie în Cluj-Napoca | Cesarini' },
  description,
  alternates: { canonical: '/' },
  ...social({ title: 'Cesarini · Costume de mire și ceremonie, Cluj-Napoca', description, path: '/' }),
};

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
