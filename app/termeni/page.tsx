import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { LegalPage } from '@/components/LegalPage';

// Text provizoriu până la versiunea juridică finală: nu se indexează.
export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: 'Termenii și condițiile magazinului online Cesarini: comenzi, livrare, retur și contact.',
  alternates: { canonical: '/termeni' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="continut">
        <LegalPage kind="termeni" />
      </main>
      <SiteFooter />
    </>
  );
}
