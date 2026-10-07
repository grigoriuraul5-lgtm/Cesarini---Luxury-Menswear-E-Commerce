/**
 * Trimiterea notificărilor către atelier. DOAR pe server (folosește variabile de mediu secrete).
 * Fiecare canal e opțional: dacă lipsesc cheile, canalul e marcat „skipped” și comanda merge mai departe.
 * Vezi `.env.example` pentru variabile.
 */
import { ATELIER_EMAIL_DEFAULT, toEmail, toTelegram, toWhatsApp, type OrderPayload } from './order';

export type ChannelResult = 'sent' | 'skipped' | 'failed';
export type DispatchResult = { webhook: ChannelResult; whatsapp: ChannelResult; telegram: ChannelResult; email: ChannelResult };

const env = (k: string) => process.env[k]?.trim() || undefined;

async function post(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${url.split('/')[2]} ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export async function dispatchOrder(o: OrderPayload): Promise<DispatchResult> {
  const jobs: Record<keyof DispatchResult, (() => Promise<void>) | null> = {
    // Webhook generic (Make / Zapier / n8n / CRM): primește payload-ul complet, semnat cu un secret comun
    webhook: env('ORDER_WEBHOOK_URL')
      ? () => post(env('ORDER_WEBHOOK_URL')!, o, env('ORDER_WEBHOOK_SECRET') ? { 'X-Cesarini-Secret': env('ORDER_WEBHOOK_SECRET')! } : {})
      : null,
    whatsapp:
      env('WHATSAPP_TOKEN') && env('WHATSAPP_PHONE_NUMBER_ID') && env('WHATSAPP_TO')
        ? () =>
            post(
              `https://graph.facebook.com/${env('WHATSAPP_API_VERSION') ?? 'v21.0'}/${env('WHATSAPP_PHONE_NUMBER_ID')}/messages`,
              toWhatsApp(o, env('WHATSAPP_TO')!, env('WHATSAPP_TEMPLATE')),
              { Authorization: `Bearer ${env('WHATSAPP_TOKEN')}` },
            )
        : null,
    telegram:
      env('TELEGRAM_BOT_TOKEN') && env('TELEGRAM_CHAT_ID')
        ? () => post(`https://api.telegram.org/bot${env('TELEGRAM_BOT_TOKEN')}/sendMessage`, toTelegram(o, env('TELEGRAM_CHAT_ID')!))
        : null,
    email: env('RESEND_API_KEY')
      ? () =>
          post('https://api.resend.com/emails', toEmail(o, env('ORDER_EMAIL_TO') ?? ATELIER_EMAIL_DEFAULT, env('ORDER_EMAIL_FROM')), {
            Authorization: `Bearer ${env('RESEND_API_KEY')}`,
          })
      : null,
  };

  const keys = Object.keys(jobs) as (keyof DispatchResult)[];
  const settled = await Promise.allSettled(keys.map((k) => (jobs[k] ? jobs[k]!() : Promise.resolve('skip'))));
  const out = {} as DispatchResult;
  settled.forEach((r, i) => {
    const k = keys[i];
    if (!jobs[k]) out[k] = 'skipped';
    else if (r.status === 'fulfilled') out[k] = 'sent';
    else {
      out[k] = 'failed';
      console.error(`[comanda ${o.orderId}] ${k}:`, r.reason);
    }
  });
  return out;
}
