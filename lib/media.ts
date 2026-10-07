/**
 * Registrul de imagini.
 *
 * `brand`    → imaginea de identitate primită de la client (public/brand). Este o randare 3D
 *              a firmei, NU o fotografie a showroom-ului: nu o folosim ca `image` în schema LocalBusiness.
 * `unsplash` → placeholder-e vizuale (licență Unsplash, uz comercial gratuit) până la ședința foto Cesarini.
 *              Fiecare ID a fost verificat că există (25.09.2026). Nu intră în JSON-LD: nu sunt produsele reale.
 */

export type Media = { src: string; alt: string; credit?: string; focal?: string };

export const unsplashLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
  `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 78}`;

const u = (id: string) => `https://images.unsplash.com/${id}`;

export const media = {
  brand: {
    maison: {
      src: '/brand/cesarini-maison-2400.webp',
      alt: 'Emblema Cesarini în aur, cu coroană și lauri, pe un perete de marmură neagră, iluminat cald',
      focal: '49% 42%',
    },
  },
  editorial: {
    /** Cardul din dreapta al hero-ului. Alternative verificate (există pe Unsplash):
     *  photo-1539025828301-b314ca222fa9 (bărbat în smoking negru, Viespire)
     *  photo-1742319690297-eaa312e20d77 (croitori care iau măsura taliei, Alireza heidarpour) */
    heroTuxedo: {
      src: u('photo-1745270019379-ddd8da719f55'),
      alt: 'Bărbat în smoking își ajustează papionul înaintea unui eveniment de gală',
      credit: 'Pablo Lancaster Jones / Unsplash',
      focal: '50% 30%',
    },
  },
  products: {
    ceremonySuit: { src: u('photo-1618886614638-80e3c103d31a'), alt: 'Bărbat în costum negru, croială structurată, fotografiat în lumină naturală', credit: 'Mohamad Khosravi / Unsplash', focal: '50% 30%' },
    businessSuit: { src: u('photo-1617137984095-74e4e5e3613f'), alt: 'Bărbat în costum albastru, croială modernă', credit: 'Mohamad Khosravi / Unsplash', focal: '50% 30%' },
    shirtTable: { src: u('photo-1602810318383-e386cc2a3ccf'), alt: 'Cămașă albă cu nasturi, așezată pe o masă de lemn', credit: 'Nimble Made / Unsplash', focal: '50% 50%' },
    shirtHanger: { src: u('photo-1603252109303-2751441dd157'), alt: 'Cămașă albă pe umeraș', credit: 'Nimble Made / Unsplash', focal: '50% 40%' },
    oxfordShoes: { src: u('photo-1552422554-0d5af0c79fc6'), alt: 'Pereche de pantofi Oxford din piele neagră, cu șiret, pe o suprafață de lemn', credit: 'Jordan Whitfield / Unsplash', focal: '50% 55%' },
    blueJacket: { src: u('photo-1594938298603-c8148c4dae35'), alt: 'Sacou albastru, detaliu de croială', credit: 'Benjamin R. / Unsplash', focal: '50% 35%' },
  },
  atelier: {
    tailorAtWork: { src: u('photo-1633655442356-ab2dbc69c772'), alt: 'Croitor lucrând la o bucată de stofă', credit: 'Yasamine June / Unsplash', focal: '50% 45%' },
    suitOnMannequin: { src: u('photo-1633655442168-c6ef0ed2f984'), alt: 'Costum și cravată pe manechin, în atelier', credit: 'Yasamine June / Unsplash', focal: '50% 35%' },
    fabricSwatches: { src: u('photo-1705412877691-70f6913aaa1e'), alt: 'Mostre de stofă pentru costume, în mai multe culori', credit: 'Victor Volkov / Unsplash', focal: '50% 50%' },
    cuttingFabric: { src: u('photo-1718184021018-d2158af6b321'), alt: 'Foarfecă de croitorie tăind stofa', credit: 'SIL Group / Unsplash', focal: '50% 50%' },
    rack: { src: u('photo-1633655442432-620aa55d7ac1'), alt: 'Rastel cu haine în atelierul de croitorie', credit: 'Yasamine June / Unsplash', focal: '50% 50%' },
    boutique: { src: u('photo-1764779169349-a5adca68947c'), alt: 'Interiorul luminat al unui magazin de haine bărbătești', credit: 'atelierbyvineeth / Unsplash', focal: '50% 50%' },
    ties: { src: u('photo-1788715532502-7031292e7f51'), alt: 'Colecție de cravate în diverse modele, pe un suport', credit: 'Yiğit Efe Kuyu / Unsplash', focal: '50% 50%' },
  },
} as const;
