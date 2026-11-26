import { merchantFeed } from '@/lib/merchantFeed';

export const dynamic = 'force-static';

/** Feed-ul pentru Google Merchant Center (listări gratuite în Google Shopping). */
export function GET() {
  return new Response(merchantFeed(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
