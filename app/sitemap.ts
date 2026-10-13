import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';
import { CATEGORIES, commerceProducts } from '@/lib/commerce/catalog';
import { articles } from '@/lib/journal';

/** sitemap.xml: paginile publice indexabile (fără checkout, API și paginile legale provizorii). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-10-13');
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly', lastModified = now) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page('/', 1, 'weekly'),
    page('/colectii', 0.9, 'weekly'),
    ...CATEGORIES.map((c) => page(`/colectii/${c.key}`, 0.8, 'weekly')),
    ...commerceProducts.map((p) => page(`/produs/${p.slug}`, 0.7)),
    page('/atelier', 0.8),
    page('/comunitate', 0.5),
    page('/journal', 0.6, 'weekly'),
    ...articles.map((a) => page(`/journal/${a.slug}`, 0.6, 'monthly', new Date(a.updated))),
  ];
}
