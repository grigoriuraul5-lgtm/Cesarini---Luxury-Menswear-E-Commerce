import { NextResponse } from 'next/server';

/**
 * Primește cererile de programare din panoul „Book Private Fitting”.
 *
 * DE CONECTAT înainte de lansare (alege una):
 *  - email către contact@cesarini.ro (ex. Resend / SMTP): trimite `booking` ca mesaj;
 *  - CRM / Google Sheets / WhatsApp Business API.
 * Până atunci, cererea e validată și scrisă în log-ul serverului.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '');
  const booking = {
    occasion: str('occasion', 60),
    name: str('name', 120),
    phone: str('phone', 30).replace(/[\s.-]/g, ''),
    date: str('date', 10),
    slot: str('slot', 20),
    notes: str('notes', 1000),
    consent: body.consent === 'da',
    receivedAt: new Date().toISOString(),
  };

  if (!booking.name || !/^(\+?40|0)7\d{8}$/.test(booking.phone) || !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || !booking.consent) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  console.info('[programare]', booking);
  return NextResponse.json({ ok: true });
}
