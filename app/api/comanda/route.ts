import { NextResponse } from 'next/server';
import { buildOrderPayload, newOrderId, validateDraft, type OrderDraft } from '@/lib/commerce/order';
import { commerceConfig } from '@/lib/commerce/catalog';
import { dispatchOrder } from '@/lib/commerce/dispatch';

/**
 * POST /api/comanda — primește comanda din checkout, recalculează prețurile din catalog,
 * construiește payload-ul și anunță atelierul (webhook, WhatsApp, Telegram, email).
 *
 * MOD DEMO (commerceConfig.paymentMode = 'demo'): statusul plății vine din checkout-ul simulat.
 * MOD LIVE: NU ne bazăm pe statusul trimis de browser. Comanda se salvează ca „pending”, iar
 * notificarea „achitată” pleacă din webhook-ul providerului (Stripe `payment_intent.succeeded`,
 * NETOPIA IPN), după verificarea semnăturii. Vezi notițele din README.
 */
export async function POST(req: Request) {
  let draft: OrderDraft;
  try {
    draft = (await req.json()) as OrderDraft;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const errors = validateDraft(draft);
  if (errors.length) return NextResponse.json({ ok: false, error: 'validation', fields: errors }, { status: 422 });

  if (commerceConfig.paymentMode === 'live') draft.payment = { ...draft.payment, status: 'pending', mode: 'live' };
  else draft.payment = { ...draft.payment, mode: 'demo' };

  const createdAt = new Date().toISOString();
  const payload = buildOrderPayload(draft, { orderId: newOrderId(), createdAt });
  const notifications = await dispatchOrder(payload);

  // TODO la lansare: salvează comanda (bază de date / Shopify / CRM) înainte de notificări.
  console.info('[comanda]', payload.orderId, payload.totals.total, notifications);
  return NextResponse.json({ ok: true, orderId: payload.orderId, payload, notifications });
}
