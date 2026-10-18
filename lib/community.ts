/**
 * MAISON COMMUNITY — canalele sociale și feed-ul curatoriat de pe /comunitate.
 *
 * Canalele vin din `verified.social` (confirmate) + WhatsApp din `editorial` (DE CONFIRMAT cu clientul).
 *
 * Feed-ul: până primim fotografiile și postările reale ale casei, fiecare cadru este o TEMĂ a contului
 * de Instagram (ceremonie, atelier, detalii), ilustrată cu imaginile-placeholder din lib/media.ts și
 * trimisă către profilul oficial. Nu prezentăm fotografii de stoc drept clienți sau drept showroom-ul real.
 * La lansare: înlocuiește `media` cu fotografia postării și `href` cu permalink-ul ei de pe Instagram.
 */
import { editorial, verified } from './brand';
import { media, type Media } from './media';

export type Channel = {
  key: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp';
  name: string;
  handle: string;
  href: string;
  line: string;
  /** false = canal încă neconfirmat de client (nu intră în JSON-LD) */
  confirmed: boolean;
};

export const channels: Channel[] = [
  { key: 'instagram', name: 'Instagram', handle: editorial.instagramHandle, href: verified.social.instagram, line: 'Ținutele zilei, probele și detaliile din atelier.', confirmed: true },
  { key: 'tiktok', name: 'TikTok', handle: '@cesarini.romania', href: verified.social.tiktok, line: 'Scurt, cu umor: momente din showroom.', confirmed: true },
  { key: 'facebook', name: 'Facebook', handle: 'Cesarini.Romania', href: verified.social.facebook, line: 'Noutăți, evenimente și târguri de nunți.', confirmed: true },
  { key: 'whatsapp', name: 'WhatsApp', handle: editorial.whatsapp.display, href: editorial.whatsapp.href, line: 'Întrebări rapide despre mărimi și programări.', confirmed: editorial.whatsapp.confirmed },
];

export type FeedItem = {
  id: string;
  /** tema postării, ca pe un card de lookbook */
  kicker: string;
  title: string;
  media: Media;
  href: string;
  /** dispunerea în grila editorială */
  shape: 'tall' | 'wide' | 'square';
};

const ig = verified.social.instagram;

export const feed: FeedItem[] = [
  { id: 'ceremonie', kicker: 'Ceremonie', title: 'Costumul de mire, croit pentru ziua ta', media: media.products.ceremonySuit, href: ig, shape: 'tall' },
  { id: 'atelier', kicker: 'Din atelier', title: 'Ajustarea, punct cu punct', media: media.atelier.tailorAtWork, href: ig, shape: 'square' },
  { id: 'stofe', kicker: 'Stofe', title: 'Mostrele, înainte de alegere', media: media.atelier.fabricSwatches, href: ig, shape: 'square' },
  { id: 'gala', kicker: 'Seara de gală', title: 'Papion negru, cămașă albă', media: media.editorial.heroTuxedo, href: ig, shape: 'wide' },
  { id: 'detalii', kicker: 'Detalii', title: 'Oxford negru semilucios', media: media.products.oxfordShoes, href: ig, shape: 'square' },
  { id: 'camasi', kicker: 'Cămăși', title: 'Gulerul care stă unde trebuie', media: media.products.shirtHanger, href: ig, shape: 'tall' },
  { id: 'business', kicker: 'Business', title: 'Croiala de zi cu zi', media: media.products.businessSuit, href: ig, shape: 'square' },
  { id: 'croiala', kicker: 'Croitorie', title: 'Foarfeca, stofa, răbdarea', media: media.atelier.cuttingFabric, href: ig, shape: 'wide' },
];
