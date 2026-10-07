# Cesarini — site Next.js

## Pornire locală (localhost:3000)
1. Instalează Node.js LTS de pe https://nodejs.org (o singură dată).
2. Dezarhivează proiectul și pornește:
   - **Windows:** dublu-click pe `porneste-windows.bat`
   - **Mac:** dublu-click pe `porneste-mac.command` (prima dată: click dreapta → Open)
3. Browserul se deschide singur pe http://localhost:3000. Modificările în cod apar live.

Manual: `npm install` apoi `npm run dev`.

## Structură
- `tailwind.config.js` — design system Dark & Gold
- `lib/brand.ts` — toate datele (verificate vs. editoriale) · `lib/schema.ts` — JSON-LD
- `components/` — SiteNav, LanguageSwitcher, Hero, Atelier, FeaturedCollections, ui/*
- `.impeccable.md` — contextul de design al brandului
- `preview/` — build-ul pentru previzualizarea găzduită (nu e necesar pentru site)

## Magazin online (pasul E-commerce, 6 oct 2026)
- Pagini: `/produs/[slug]` (PDP cu Mărime standard / Croit pe măsură) și `/checkout` (Checkout VIP).
- Date: `lib/commerce/` — `catalog.ts` (produse + `commerceConfig`), `measurements.ts`, `cart.ts` (reducer), `order.ts` (payload + WhatsApp/Telegram/email), `dispatch.ts` (trimitere, doar server).
- API: `POST /api/comanda` recalculează prețurile din catalog, construiește payload-ul și îl trimite pe canalele configurate în `.env.local` (vezi `.env.example`). Fără chei, canalele sunt sărite.
- Plata e în **mod demo** (`commerceConfig.paymentMode = 'demo'`): nu se încarcă niciun card.
  Pentru live: Stripe Payment Element (datele cardului rămân la Stripe) sau redirect NETOPIA; statusul „achitată” vine DOAR din webhook-ul providerului, verificat cu semnătura.
- De confirmat cu clientul înainte de lansare: costul livrării, suplimentul pentru croit pe măsură, monograma gratuită, termenul pentru piesele pe măsură.

## Publicare: GitHub + Vercel (previzualizare)
1. Pe github.com: **New repository** → nume `cesarini` → Private → Create.
2. **uploading an existing file** → trage în pagină TOT conținutul folderului `cesarini` (nu folderul în sine) → Commit changes.
3. Pe vercel.com: **Add New → Project** → Import repository `cesarini` → Framework: Next.js (detectat singur) → **Deploy**.
4. Linkul `*.vercel.app` e previzualizarea. Indexarea Google e oprită până setezi `ALLOW_INDEXING=true` în Vercel → Settings → Environment Variables (doar la lansare, pe domeniul final).
5. Opțional, notificările de comenzi: aceleași variabile ca în `.env.example`, puse în Vercel → Environment Variables.
