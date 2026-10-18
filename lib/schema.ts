import { SITE_URL, verified, collections, faqs, atelierServices, featuredProducts } from './brand';

/**
 * Generatoare Schema.org — un singur @graph, noduri legate prin @id stabile,
 * alimentat EXCLUSIV din `verified`.
 */

const id = (frag: string) => `${SITE_URL}/#${frag}`;

const address = {
  '@type': 'PostalAddress',
  streetAddress: verified.street,
  postalCode: verified.postalCode,
  addressLocality: verified.city,
  addressRegion: verified.region,
  addressCountry: verified.country,
};

const sameAs = Object.values(verified.social);

export function organizationGraph() {
  const p = verified.prices;
  return [
    {
      '@type': 'Organization',
      '@id': id('organization'),
      name: verified.name,
      alternateName: verified.legalHint,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/cesarini-logo-512.png`,
      slogan: verified.tagline,
      description: verified.entitySentence,
      foundingDate: verified.foundingYear,
      foundingLocation: { '@type': 'Place', name: `${verified.city}, România` },
      address,
      telephone: verified.phoneE164,
      email: verified.email,
      sameAs,
      brand: { '@id': id('brand') },
      knowsAbout: [
        'costume de ceremonie', 'costume de mire', 'costume business', 'smoking', 'black tie',
        'cămăși pe măsură', 'ajustări costume', 'croitorie masculină', 'cravate și papioane', 'pantofi Oxford',
      ],
    },
    { '@type': 'Brand', '@id': id('brand'), name: verified.name, slogan: verified.tagline },
    {
      '@type': 'WebSite',
      '@id': id('website'),
      url: SITE_URL,
      name: verified.name,
      inLanguage: 'ro-RO',
      publisher: { '@id': id('organization') },
    },
    {
      '@type': ['ClothingStore', 'LocalBusiness'],
      '@id': id('showroom'),
      name: `${verified.name} — Showroom ${verified.city}`,
      url: SITE_URL,
      // Fără fotografie reală a showroom-ului încă: logoul oficial ține locul imaginii. Coordonatele GEO: de confirmat din profilul Google Business.
      image: `${SITE_URL}/brand/cesarini-logo-512.png`,
      logo: `${SITE_URL}/brand/cesarini-logo-512.png`,
      address,
      hasMap: verified.mapsUrl,
      telephone: verified.phoneE164,
      email: verified.email,
      openingHoursSpecification: verified.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
      priceRange: `${p.businessShirt} – ${p.ceremonySuit} RON`,
      currenciesAccepted: 'RON',
      areaServed: { '@type': 'City', name: verified.city },
      sameAs,
      parentOrganization: { '@id': id('organization') },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Colecții Cesarini',
        itemListElement: collections.map((c) => ({ '@type': 'OfferCatalog', name: c.title, url: SITE_URL + c.href })),
      },
    },
    ...atelierServices.map((s) => ({
      '@type': 'Service',
      '@id': id(`service-${s.numeral.toLowerCase()}`),
      name: `${s.title} — ${verified.name} ${verified.city}`,
      serviceType: s.title,
      description: s.lead,
      provider: { '@id': id('showroom') },
      brand: { '@id': id('brand') },
      areaServed: { '@type': 'City', name: verified.city },
      url: SITE_URL + s.href,
      // Ajustările sunt gratuite pentru ținuta cumpărată din showroom (sursa: Google Business Profile)
      ...(s.numeral === 'I' && {
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'RON',
          description: verified.freeAlterations,
        },
      }),
    })),
  ];
}

/** Product (AggregateOffer) pentru fiecare colecție — toate prețurile sunt confirmate pe cesarini.ro. */
export function productGraph() {
  return collections.map((c) => ({
    '@type': 'Product',
    '@id': `${SITE_URL}${c.href}#product`,
    name: `${c.title} — ${verified.name}`,
    description: c.description,
    category: c.title,
    brand: { '@id': id('brand') },
    url: SITE_URL + c.href,
    ...(c.slug === 'costume-ceremonie' && {
      material: verified.ceremonySuitSpec.fabric,
      size: verified.ceremonySuitSpec.sizes,
    }),
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(c.priceFrom),
      priceCurrency: 'RON',
      availability: 'https://schema.org/InStock',
      seller: { '@id': id('showroom') },
    },
  }));
}

/** Produsele recomandate pe homepage — Product + Offer cu preț fix (confirmat pe cesarini.ro). */
export function featuredProductGraph() {
  return [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#featured`,
      name: 'Garderoba unei seri importante — selecția Cesarini',
      itemListElement: featuredProducts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@id': `${SITE_URL}${p.href}#product` } })),
    },
    ...featuredProducts
      .filter((p) => !collections.some((c) => c.href === p.href)) // colecțiile au deja nod Product
      .map((p) => ({
        '@type': 'Product',
        '@id': `${SITE_URL}${p.href}#product`,
        name: p.name,
        description: `${p.category} · ${p.detail}`,
        category: p.category,
        brand: { '@id': id('brand') },
        url: SITE_URL + p.href,
        offers: {
          '@type': 'Offer',
          price: String(p.price),
          priceCurrency: 'RON',
          availability: 'https://schema.org/InStock',
          seller: { '@id': id('showroom') },
        },
      })),
  ];
}

export function faqGraph() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [...organizationGraph(), ...productGraph(), ...featuredProductGraph(), faqGraph()],
  };
}

/** Pagina de produs: Product + Offer (preț verificat) + BreadcrumbList. „Croit pe măsură” nu intră până nu e confirmat. */
export function productPageGraph(p: {
  slug: string; name: string; category: string; categoryKey: string; lead: string; price: number;
  code?: string; color?: string; composition?: string; sizes?: string[]; badge?: string; gallery?: { src: string }[];
}) {
  // Pozele reale Cesarini (din /produse/…) pot intra în schema; placeholder-ele de stoc NU
  const images = (p.gallery ?? []).filter((g) => g.src.startsWith('/produse/')).slice(0, 4).map((g) => `${SITE_URL}${g.src}`);
  const url = `${SITE_URL}/produs/${p.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: p.name,
        description: p.lead,
        category: p.category,
        brand: { '@id': id('brand') },
        url,
        ...(p.code && { sku: p.code }),
        ...(p.color && { color: p.color }),
        ...(p.composition && { material: p.composition }),
        ...(p.sizes?.length && { size: `${p.sizes[0]} – ${p.sizes[p.sizes.length - 1]}` }),
        ...(images.length && { image: images }),
        offers: {
          '@type': 'Offer',
          url,
          price: String(p.price),
          priceCurrency: 'RON',
          availability: p.badge === 'Stoc limitat' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
          seller: { '@id': id('showroom') },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: p.category, item: `${SITE_URL}/colectii/${p.categoryKey}` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
    ],
  };
}

/** Catalog (PLP): CollectionPage + ItemList cu Product/Offer, doar nume și prețuri verificate. */
export function catalogGraph(opts: {
  path: string;
  name: string;
  description: string;
  products: { slug: string; name: string; category: string; price: number }[];
  breadcrumb: { name: string; path: string }[];
}) {
  const url = SITE_URL + opts.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: opts.name,
        description: opts.description,
        inLanguage: 'ro-RO',
        isPartOf: { '@id': id('website') },
        about: { '@id': id('showroom') },
        mainEntity: { '@id': `${url}#list` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#list`,
        name: opts.name,
        numberOfItems: opts.products.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: opts.products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            '@id': `${SITE_URL}/produs/${p.slug}#product`,
            name: p.name,
            category: p.category,
            url: `${SITE_URL}/produs/${p.slug}`,
            brand: { '@id': id('brand') },
            offers: {
              '@type': 'Offer',
              price: String(p.price),
              priceCurrency: 'RON',
              availability: 'https://schema.org/InStock',
              seller: { '@id': id('showroom') },
            },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: opts.breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: SITE_URL + b.path })),
      },
    ],
  };
}

/** Articol din Journal: Article + FAQPage (text identic cu cel afișat) + BreadcrumbList. */
export function articleGraph(a: {
  slug: string; title: string; dek: string; shortAnswer: string; published: string; updated: string;
  keywords: string[]; faqs: { q: string; a: string }[]; relatedProducts: string[]; about: string;
}) {
  const url = `${SITE_URL}/journal/${a.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: a.title,
        description: a.dek,
        abstract: a.shortAnswer,
        url,
        mainEntityOfPage: url,
        inLanguage: 'ro-RO',
        datePublished: a.published,
        dateModified: a.updated,
        keywords: a.keywords.join(', '),
        author: { '@id': id('organization') },
        publisher: { '@id': id('organization') },
        isPartOf: { '@id': id('website') },
        about: { '@type': 'Thing', name: a.about },
        image: `${SITE_URL}/opengraph-image.jpg`,
        mentions: [{ '@id': id('showroom') }, ...a.relatedProducts.map((s) => ({ '@id': `${SITE_URL}/produs/${s}#product` }))],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: a.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
          { '@type': 'ListItem', position: 3, name: a.title, item: url },
        ],
      },
    ],
  };
}

/** Pagină de conținut (Atelier, Community, pagini legale): WebPage legat de showroom + BreadcrumbList. */
export function webPageGraph(opts: {
  path: string;
  name: string;
  description: string;
  type?: 'WebPage' | 'ContactPage' | 'AboutPage';
  breadcrumb: { name: string; path: string }[];
}) {
  const url = SITE_URL + opts.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': opts.type ?? 'WebPage',
        '@id': `${url}#page`,
        url,
        name: opts.name,
        description: opts.description,
        inLanguage: 'ro-RO',
        isPartOf: { '@id': id('website') },
        about: { '@id': id('showroom') },
        publisher: { '@id': id('organization') },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: opts.breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: SITE_URL + b.path })),
      },
    ],
  };
}
