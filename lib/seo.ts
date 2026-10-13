import type { Metadata } from 'next';

/**
 * Open Graph + Twitter pentru fiecare pagină. În Next, un `openGraph` definit pe pagină ÎNLOCUIEȘTE complet
 * pe cel din layout (inclusiv imaginea și URL-ul), deci fiecare pagină își declară setul complet prin acest helper.
 */
const IMAGE = { url: '/opengraph-image.jpg', width: 1200, height: 630, alt: 'Cesarini — logoul casei de croitorie din Cluj-Napoca, auriu pe catifea neagră' };

export function social(opts: { title: string; description: string; path: string; type?: 'website' | 'article'; published?: string; modified?: string }): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: opts.type ?? 'website',
      locale: 'ro_RO',
      siteName: 'Cesarini',
      url: opts.path,
      title: opts.title,
      description: opts.description,
      images: [IMAGE],
      ...(opts.type === 'article' && { publishedTime: opts.published, modifiedTime: opts.modified }),
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: [IMAGE.url] },
  };
}
