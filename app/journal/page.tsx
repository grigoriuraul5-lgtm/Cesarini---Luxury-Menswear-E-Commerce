import type { Metadata } from 'next';
import { social } from '@/lib/seo';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { JournalIndex } from '@/components/journal/JournalIndex';

export const metadata: Metadata = {
  title: 'The Cesarini Journal: ghiduri de stil pentru ceremonie și gală',
  description: 'Regulile ținutei de ceremonie, black tie și business, explicate de croitorii Cesarini din Cluj-Napoca.',
  alternates: { canonical: '/journal' },
  ...social({ title: 'The Cesarini Journal', description: 'Regulile ținutei de ceremonie, black tie și business, explicate de croitorii Cesarini din Cluj-Napoca.', path: '/journal' }),
};

export default function JournalPage() {
  return (
    <>
      <SiteNav />
      <main id="continut">
        <JournalIndex />
      </main>
      <SiteFooter />
    </>
  );
}
