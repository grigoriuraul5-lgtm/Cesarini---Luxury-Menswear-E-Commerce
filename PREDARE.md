# START AICI: predare proiect Cesarini (6 oct 2026)

Document pentru orice chat nou din acest proiect. Citește-l primul, apoi `claude/cesarini-cod-sursa.md` (codul complet), `claude/fapte-verificate-cesarini.md` (datele reale) și `claude/decizii-arhitectura-geo.md` (deciziile și motivele lor).

## Ce este
Site nou pentru **Cesarini** (Cluj-Napoca, din 2015): costume de ceremonie, business și casual, cămăși pe măsură, pantofi, accesorii, cu ajustări gratuite. Estetică Dark & Gold de lux (registru Tom Ford / Brunello Cucinelli), optimizat pentru căutarea AI (GEO): ChatGPT, Perplexity, Gemini.
Lucrat cu Raul (grigoriuraul5@gmail.com), care face site-ul pentru client.

## Stack și rulare
- **Next.js 15 (App Router) + React 19 + Tailwind CSS 3.4 + Framer Motion 12**, TypeScript.
- Fonturi self-hosted (Fontsource): **Bodoni Moda** (opsz) pentru titluri și accente editoriale, **Manrope** pentru UI.
- Rulare: `npm install` → `npm run dev` → http://localhost:3000. Pe Windows: dublu-click pe `porneste-windows.bat`, pe Mac: `porneste-mac.command`.
- Arhiva completă (cod + imagini): `cesarini-next-final.zip`. Raul o atașează în chatul nou. Imaginile din `public/brand/` sunt doar în arhivă.

## Structura homepage-ului (ce există)
1. **SiteNav**: transparent → sticlă la scroll; selector VIP (Bespoke / Collections / Journal / Atelier) cu pastilă aurie care alunecă; limbă RO/EN/IT (doar UI, i18n real încă nu); CTA „Private Fitting”; meniu mobil complet cu adresă, program și telefon.
2. **Hero**: titlu „Eleganța nu se poartă. *Se croiește.*”; subtitlu cu oferta reală; CTA „Explore Collection” + „Book Private Fitting”; card dreapta cu fotografie editorială (smoking, Unsplash) în ramă aurie, cu plăcuță de sticlă „Maison Cesarini · 5,0 · 538 recenzii”; bandă de fapte GEO (din 2015 · 5,0/538 Google · ajustări gratuite · costum ceremonie 2.299 lei).
3. **Atelier**: „Croit *pentru tine.*” + 3 servicii (Made-to-Measure Fit, Cămăși pe Măsură, Ceremonie & Mire); mozaic Made-to-Measure (Stofa → Croiala → Finisajul); bandă „Showroom Experience” cu programare; Atelier Details (adresă, program, telefon, livrare); Pricing Transparency (listă de prețuri reale, ajustări „Gratuit”).
4. **Featured Collections** („Garderoba unei seri importante”): carusel cu 5 produse reale (2.299 / 1.599 / 299 / 199 / 599 lei) + card final de programare.
5. **Book Private Fitting**: panou lateral (`components/booking/`), deschis de toate CTA-urile; validare RO, duminica blocată; POST `/api/programare` **încă neconectat** la email/CRM (doar log).
6. **Fundal global fix** (`BrandBackdrop.tsx` + `.brand-backdrop*` în `globals.css`):
   - desktop (`hidden md:block`): `cesarini-velvet-2400` (catifea neagră cu fir auriu și „CESARINI” sus), `cover`, `top center`, opacitate `--backdrop-opacity` = 0.2;
   - mobil (`block md:hidden`): `cesarini-velvet-mobile-1080` (vertical 9:16, fără text), `fixed`, `cover`, `center`, opacitate 0.2;
   - IMPORTANT: negrul stă pe `<html>`, `<body>` e transparent. Altfel fundalul lui body acoperă stratul cu `z-index: -1`.

## Ce NU există încă (Pasul 3 și mai departe)
- The Cesarini Experience, FAQ vizibil + FAQPage (datele sunt în `lib/brand.ts` → `faqs`), Footer cu JSON-LD și linkuri către ghiduri.
- Paginile interne: colecții, produs, atelier, programare, journal (articolul Black Tie există ca HTML static în prima versiune, de portat), pagini de intenție (mire, la comandă, absolvire, slim fit), llms.txt, i18n, redirect-uri 301 de la URL-urile vechi.

## Reguli de lucru stabilite
- **Date:** `lib/brand.ts` → `verified` (fapte confirmate, intră în JSON-LD) vs. `editorial` (doar UI). Nu se inventează fapte în `verified`. Rating-ul Google apare doar în UI, nu în schema (fără review markup self-serving).
- **Imagini:** `lib/media.ts`. Placeholder-ele Unsplash au ID-uri verificate și se înlocuiesc cu fotografii Cesarini înainte de lansare. Randarea emblemei (marmură) nu se folosește ca „poză de showroom” în schema.
- **Design (Impeccable / `.impeccable.md`):** aurul doar ca accent; fără text în degradeu; fără Cormorant/Inter; borduri `border-gold-400/20`; glow la hover `0 0 20px rgba(212,175,55,0.15)`; easing expo; respectă `prefers-reduced-motion`. Auriul nostru (#D4AF37), nu `amber-500`.
- **Lucru pas cu pas, modular**, cu capturi după fiecare pas. Raul trimite capturi clientului pentru feedback.
- **Previzualizare găzduită:** artifact „Cesarini Homepage” (bundle esbuild din `preview/` cu shim-uri pentru next/link și next/image). Din cauza CSP, imaginile Unsplash nu apar acolo, doar pe localhost.

## Limitări de mediu observate
- Din sandbox sunt blocate: cesarini.ro, Unsplash, Google Fonts. Existența ID-urilor Unsplash se verifică cu WebFetch: imaginea reală răspunde „Image content is not supported”, un ID inexistent răspunde 404.

## De confirmat cu clientul
Logo oficial (scutul cu coroană din randare?), fotografii reale, bespoke real vs. MTM, închiriere smoking, materialul cravatelor, unde ajung cererile de programare (email/telefon), site-ul vechi spart (155 articole spam) până la migrare.
