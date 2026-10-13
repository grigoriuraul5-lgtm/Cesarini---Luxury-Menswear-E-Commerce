import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { LegalPage } from '@/components/LegalPage';

// Text provizoriu până la versiunea juridică finală: nu se indexează.
export const metadata: Metadata = {
  title: 'Politica de confidențialitate (GDPR)',
  alternates: { canonical: '/confidentialitate' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="continut">
        <LegalPage kind="confidentialitate" />
      </main>
      <SiteFooter />
    </>
  );
}
