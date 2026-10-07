import { NextResponse } from 'next/server';

/**
 * Abonare la newsletter-ul Privé. DE CONECTAT înainte de lansare (Mailchimp / Brevo / Resend Audiences),
 * cu double opt-in (email de confirmare) — cerință GDPR pentru dovada consimțământului.
 * Până atunci: validează și scrie în log.
 */
export async function POST(req: Request) {
  let body: { email?: unknown; consent?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || body.consent !== true) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }
  console.info('[newsletter]', { email, consentAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
