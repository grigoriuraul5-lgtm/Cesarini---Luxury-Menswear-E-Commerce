import type { Metadata, Viewport } from 'next';
/* Fonturi self-hosted (Fontsource): zero request-uri către terți, fără FOUT, conform GDPR.
   Bodoni Moda cu axa „opsz”: contrastul fin de revistă crește automat la dimensiuni mari. */
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource-variable/manrope/wght.css';
import './globals.css';
import { SITE_URL, verified } from '@/lib/brand';
import { organizationGraph, productGraph, featuredProductGraph } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { BrandBackdrop } from '@/components/BrandBackdrop';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cesarini — Croitorie Made-to-Measure & costume de ceremonie în Cluj-Napoca',
    template: '%s | Cesarini',
  },
  description: verified.entitySentence,
  alternates: { canonical: '/', types: { 'text/plain': '/llms.txt' } },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Cesarini',
    url: SITE_URL,
    title: 'Cesarini — Eleganța nu se poartă. Se croiește.',
    description: verified.entitySentence,
    images: [{ url: '/og/cesarini-home.jpg', width: 1200, height: 630, alt: 'Cesarini — Maison de Croitorie, Cluj-Napoca' }],
  },
  twitter: { card: 'summary_large_image' },
  // Indexarea e oprită până la lansare (previzualizări Vercel, demo). Pe domeniul final: ALLOW_INDEXING=true.
  robots: (process.env.ALLOW_INDEXING === 'true'
    ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
    : { index: false, follow: false }) as Metadata['robots'],
};

export const viewport: Viewport = { themeColor: '#0A0A0A', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="grain">
        <BrandBackdrop />
        <a href="#continut" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-obsidian">
          Sari la conținut
        </a>
        <Providers>{children}</Providers>
        {/* Graf entitate (Organization, Brand, WebSite, ClothingStore/LocalBusiness, Service, Product). FAQPage e pe homepage (app/page.tsx), lângă acordeonul vizibil. */}
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [...organizationGraph(), ...productGraph(), ...featuredProductGraph()] }} />
      </body>
    </html>
  );
}
