import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';

/** Până la lansare (ALLOW_INDEXING lipsă) site-ul nu se indexează: previzualizările nu concurează cu cesarini.ro. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING !== 'true') return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/api/'] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
