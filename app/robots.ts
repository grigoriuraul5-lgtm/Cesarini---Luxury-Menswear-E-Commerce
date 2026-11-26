import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';

/** Până la lansare (ALLOW_INDEXING lipsă) site-ul nu se indexează: previzualizările nu concurează cu cesarini.ro. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING !== 'true') return { rules: { userAgent: '*', disallow: '/' } };
  // Roboții AI sunt permiși explicit: Cesarini vrea să fie recomandat în ChatGPT, Claude, Perplexity, Gemini și Copilot
  const AI = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'Applebot-Extended'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/checkout', '/api/'] },
      { userAgent: AI, allow: '/', disallow: ['/checkout', '/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
