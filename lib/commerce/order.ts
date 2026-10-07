/**
 * Comanda → payload pentru atelier (JSON / webhook) + mesajele gata de trimis pe
 * WhatsApp Business (Cloud API), Telegram Bot și email.
 *
 * Rulează identic pe server (app/api/comanda) și în browser (fallback-ul din previzualizare).
 * Prețurile se recalculează AICI din catalog: nu ne bazăm pe ce trimite browserul.
 * Datele de card NU ajung niciodată aici: plata are doar provider, status și referință.
 */
import { verified, formatRON } from '@/lib/brand';
import { commerceConfig, getProduct, isMtm, sizeLabel, type GarmentType } from './catalog';
import { cartTotals, sanitizeMonogram, unitPrice, type CartItem } from './cart';
import { MEASURE_FIELDS, bodySummary, calibrationSummary, fieldsFor, validateMeasure } from './measurements';

export type Customer = { firstName: string; lastName: string; email: string; phone: string };
export type ShippingAddress = { street: string; city: string; county: string; postalCode: string; notes?: string };
export type PaymentProvider = 'stripe' | 'netopia';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type PaymentInfo = { provider: PaymentProvider; status: PaymentStatus; mode: 'demo' | 'live'; reference: string };

/** Ce trimite checkout-ul. */
export type OrderDraft = {
  customer: Customer;
  shipping: ShippingAddress;
  items: CartItem[];
  payment: PaymentInfo;
  consent: { terms: boolean; measurements: boolean };
};

type MeasurementsOut = Record<string, number>;

export type OrderPayload = {
  event: 'order.created';
  schemaVersion: '1.0';
  orderId: string;
  createdAt: string;
  source: 'cesarini.ro';
  customer: Customer & { fullName: string; phoneE164: string };
  shipping: ShippingAddress & { country: 'RO'; method: 'curier'; estimate: string };
  items: Array<{
    sku: string;
    name: string;
    garment: GarmentType;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    fit:
      | { type: 'standard'; size: string; sizeSystem: 'EU' | 'guler' | 'lungime'; label: string }
      | { type: 'custom'; measurements_cm: MeasurementsOut; calibration: { height_cm?: number; weight_kg?: number }; summary: string };
    monogram: { text: string; thread: string; placement: 'căptușeala interioară' } | null;
  }>;
  totals: { currency: 'RON'; subtotal: number; shipping: number; customFitSurcharge: number; total: number };
  payment: PaymentInfo & { amount: number; currency: 'RON' };
  consent: { terms: boolean; measurementsProcessing: boolean; at: string };
  workshop: { hasCustomFit: boolean; nextStep: string };
};

/* ———————————————————— Validare (server) ———————————————————— */

export const PHONE_RE = /^(\+?40|0)7\d{8}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const POSTAL_RE = /^\d{6}$/;
export const normalizePhone = (s: string) => s.replace(/[\s().-]/g, '');
export const toE164 = (s: string) => {
  const p = normalizePhone(s);
  return p.startsWith('+') ? p : p.startsWith('40') ? `+${p}` : `+4${p}`;
};

export function validateDraft(d: OrderDraft): string[] {
  const e: string[] = [];
  const c = d.customer ?? ({} as Customer);
  const s = d.shipping ?? ({} as ShippingAddress);
  if (!c.firstName?.trim() || !c.lastName?.trim()) e.push('customer.name');
  if (!EMAIL_RE.test(c.email ?? '')) e.push('customer.email');
  if (!PHONE_RE.test(normalizePhone(c.phone ?? ''))) e.push('customer.phone');
  if (!s.street?.trim() || !s.city?.trim() || !s.county?.trim()) e.push('shipping.address');
  if (!POSTAL_RE.test(s.postalCode ?? '')) e.push('shipping.postalCode');
  if (!Array.isArray(d.items) || d.items.length === 0) e.push('items.empty');
  d.items?.forEach((i, n) => {
    const p = getProduct(i.slug);
    if (!p) return e.push(`items.${n}.unknown`);
    if (i.fit?.type === 'standard' && !p.sizes.includes(i.fit.size)) e.push(`items.${n}.size`);
    if (i.fit?.type === 'custom' && !isMtm(p.garment)) return e.push(`items.${n}.fit`);
    if (i.fit?.type === 'custom' && fieldsFor(p.garment).some((f) => validateMeasure(f, i.fit.type === 'custom' ? i.fit.measurements[f.key] : undefined)))
      e.push(`items.${n}.measurements`);
    if (!Number.isInteger(i.qty) || i.qty < 1 || i.qty > commerceConfig.maxQty) e.push(`items.${n}.qty`);
  });
  if (!d.consent?.terms) e.push('consent.terms');
  if (d.items?.some((i) => i.fit?.type === 'custom') && !d.consent?.measurements) e.push('consent.measurements');
  if (!['stripe', 'netopia'].includes(d.payment?.provider)) e.push('payment.provider');
  return e;
}

/* ———————————————————— Payload ———————————————————— */

export function newOrderId(now = new Date()) {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rnd = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
  return `CES-${ymd}-${rnd}`;
}

export function buildOrderPayload(d: OrderDraft, opts: { orderId: string; createdAt: string }): OrderPayload {
  const totals = cartTotals(d.items);
  const items = d.items.map((i) => {
    const p = getProduct(i.slug)!;
    const price = unitPrice(i);
    const fit: OrderPayload['items'][number]['fit'] =
      i.fit.type === 'standard'
        ? { type: 'standard', size: i.fit.size, sizeSystem: p.sizeSystem, label: sizeLabel(p, i.fit.size) }
        : {
            type: 'custom',
            measurements_cm: Object.fromEntries(
              MEASURE_FIELDS.filter((f) => f.group === 'corp' && f.garments.includes(p.garment)).map((f) => [f.key, (i.fit as { measurements: Record<string, number> }).measurements[f.key]]),
            ),
            calibration: { height_cm: i.fit.measurements.height, weight_kg: i.fit.measurements.weight },
            summary: bodySummary(p.garment, i.fit.measurements),
          };
    const mono = i.monogram && sanitizeMonogram(i.monogram.text);
    return {
      sku: p.slug,
      name: p.name,
      garment: p.garment,
      qty: i.qty,
      unitPrice: price,
      lineTotal: price * i.qty,
      fit,
      monogram: mono ? { text: mono, thread: i.monogram!.thread, placement: 'căptușeala interioară' as const } : null,
    };
  });
  const hasCustomFit = items.some((i) => i.fit.type === 'custom');
  const c = d.customer;
  return {
    event: 'order.created',
    schemaVersion: '1.0',
    orderId: opts.orderId,
    createdAt: opts.createdAt,
    source: 'cesarini.ro',
    customer: { ...c, fullName: `${c.firstName.trim()} ${c.lastName.trim()}`, phoneE164: toE164(c.phone) },
    shipping: { ...d.shipping, country: 'RO', method: 'curier', estimate: '1 – 2 zile lucrătoare' },
    items,
    totals: {
      currency: 'RON',
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      customFitSurcharge: d.items.filter((i) => i.fit.type === 'custom').reduce((s, i) => s + commerceConfig.customFitSurcharge * i.qty, 0),
      total: totals.total,
    },
    payment: { ...d.payment, amount: totals.total, currency: 'RON' },
    consent: { terms: d.consent.terms, measurementsProcessing: d.consent.measurements, at: opts.createdAt },
    workshop: {
      hasCustomFit,
      nextStep: hasCustomFit
        ? 'Sună clientul pentru verificarea măsurilor înainte de croire.'
        : 'Sună clientul pentru confirmarea mărimii, apoi expediază.',
    },
  };
}

/* ———————————————————— Text pentru atelier ———————————————————— */

const PAY_STATUS: Record<PaymentStatus, string> = { paid: 'ACHITATĂ', pending: 'ÎN AȘTEPTARE', failed: 'EȘUATĂ' };
const PROVIDER: Record<PaymentProvider, string> = { stripe: 'Stripe', netopia: 'NETOPIA Payments' };

export const paymentLine = (o: OrderPayload) =>
  `Card · ${PROVIDER[o.payment.provider]} · ${PAY_STATUS[o.payment.status]}${o.payment.mode === 'demo' ? ' (demo)' : ''}`;

function itemLines(o: OrderPayload) {
  return o.items.map((i) => {
    const lines = [`${i.qty}× ${i.name} — ${formatRON(i.lineTotal)}`];
    if (i.fit.type === 'standard') lines.push(`   ${i.fit.label}`);
    else {
      lines.push('   CROIT PE MĂSURĂ');
      lines.push(`   ${calibrationSummary({ height: i.fit.calibration.height_cm, weight: i.fit.calibration.weight_kg })}`);
      lines.push(`   ${i.fit.summary} (cm)`);
    }
    if (i.monogram) lines.push(`   Monogramă: „${i.monogram.text}” · fir ${i.monogram.thread} · ${i.monogram.placement}`);
    return lines.join('\n');
  });
}

export function workshopText(o: OrderPayload) {
  const s = o.shipping;
  return [
    `COMANDĂ NOUĂ ${o.orderId}`,
    paymentLine(o),
    `Total: ${formatRON(o.totals.total)}`,
    '',
    `Client: ${o.customer.fullName} · ${o.customer.phoneE164} · ${o.customer.email}`,
    `Livrare: ${s.street}, ${s.city}, jud. ${s.county}, ${s.postalCode}${s.notes ? ` · Obs.: ${s.notes}` : ''}`,
    '',
    ...itemLines(o),
    '',
    `Următorul pas: ${o.workshop.nextStep}`,
  ].join('\n');
}

/* ———————————————————— Canale ———————————————————— */

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Telegram Bot API → POST https://api.telegram.org/bot<TOKEN>/sendMessage */
export function toTelegram(o: OrderPayload, chatId: string) {
  const [title, ...rest] = workshopText(o).split('\n');
  const text = `<b>${escapeHtml(title)}</b>\n${escapeHtml(rest.join('\n'))}`;
  return { chat_id: chatId, parse_mode: 'HTML' as const, disable_web_page_preview: true, text: text.slice(0, 4096) };
}

/**
 * WhatsApp Business Cloud API → POST https://graph.facebook.com/<v>/<PHONE_NUMBER_ID>/messages
 * Mesajele inițiate de firmă cer un TEMPLATE aprobat în Meta (ex. „comanda_noua_atelier”, ro) cu 5 variabile:
 * {{1}} nr. comandă · {{2}} client · {{3}} total · {{4}} produse și măsuri · {{5}} plată.
 * Variabilele nu au voie să conțină rânduri noi sau tab-uri și au maxim 1024 de caractere.
 */
export function toWhatsApp(o: OrderPayload, to: string, template = 'comanda_noua_atelier') {
  const param = (s: string) => ({ type: 'text' as const, text: s.replace(/[\n\t]+/g, ' · ').replace(/ {4,}/g, '   ').slice(0, 1024) });
  const items = o.items
    .map((i) => `${i.qty}× ${i.name} (${i.fit.type === 'standard' ? i.fit.label : `pe măsură: ${i.fit.summary}`}${i.monogram ? `, monogramă ${i.monogram.text}` : ''})`)
    .join('; ');
  return {
    messaging_product: 'whatsapp' as const,
    to: to.replace(/^\+/, ''),
    type: 'template' as const,
    template: {
      name: template,
      language: { code: 'ro' },
      components: [
        {
          type: 'body' as const,
          parameters: [param(o.orderId), param(`${o.customer.fullName}, ${o.customer.phoneE164}`), param(formatRON(o.totals.total)), param(items), param(paymentLine(o))],
        },
      ],
    },
  };
}

/** Email (format Resend: POST https://api.resend.com/emails). Destinatarul poate fi și o adresă Gmail. */
export function toEmail(o: OrderPayload, to: string, from = `Cesarini Comenzi <comenzi@cesarini.ro>`) {
  const text = workshopText(o);
  return {
    from,
    to: [to],
    reply_to: o.customer.email,
    subject: `Comandă nouă ${o.orderId} · ${formatRON(o.totals.total)}${o.workshop.hasCustomFit ? ' · PE MĂSURĂ' : ''}`,
    text,
    html: `<pre style="font:14px/1.6 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
  };
}

export const ATELIER_EMAIL_DEFAULT = verified.email;
