import type { Metadata, Viewport } from 'next';
/* Fonturi self-hosted (Fontsource): zero request-uri către terți, fără FOUT, conform GDPR.
   EB Garamond (13 oct 2026): aceeași familie garalde ca literele din logoul oficial, doar drept (fără italic),
   ca titlurile și logoul să vorbească aceeași limbă. */
import '@fontsource-variable/eb-garamond/wght.css';
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
    // Imaginea de distribuire: app/opengraph-image.jpg + app/twitter-image.jpg (logoul pe catifea), moștenite de toate paginile
  },
  twitter: { card: 'summary_large_image', title: 'Cesarini — Eleganța nu se poartă. Se croiește.', description: verified.entitySentence },
  // Indexarea e oprită până la lansare (previzualizări Vercel, demo). Pe domeniul final: ALLOW_INDEXING=true.
  robots: (process.env.ALLOW_INDEXING === 'true'
    ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
    : { index: false, follow: false }) as Metadata['robots'],
};

const INTRO_SCRIPT = "try{if(sessionStorage.getItem('cesarini-intro'))document.documentElement.classList.add('intro-seen')}catch(e){}";

export const viewport: Viewport = { themeColor: '#0A0A0A', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Intro-ul cu logoul rulează o singură dată pe sesiune: marcăm vizitele următoare înainte de primul pixel */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
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
