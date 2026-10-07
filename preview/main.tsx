import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteNav } from '@/components/SiteNav';
import { Hero } from '@/components/Hero';
import { Atelier } from '@/components/Atelier';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { BrandBackdrop } from '@/components/BrandBackdrop';
import { Providers } from '@/components/Providers';
import { HomeFaq } from '@/components/HomeFaq';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductPage } from '@/components/commerce/ProductPage';
import { Checkout } from '@/components/commerce/Checkout';
import { getCategory, getProduct, type CategoryKey } from '@/lib/commerce/catalog';
import { Catalog } from '@/components/commerce/Catalog';
import { JournalIndex } from '@/components/journal/JournalIndex';
import { ArticlePage } from '@/components/journal/ArticlePage';
import { getArticle } from '@/lib/journal';

/** Mini-router pentru previzualizare: aceleași componente ca pe site, fără Next.js. */
const known = (href: string) =>
  href === '/' || href === '/checkout' || href === '/colectii' || href === '/journal' ||
  (href.startsWith('/produs/') && !!getProduct(href.slice(8))) ||
  (href.startsWith('/colectii/') && !!getCategory(href.slice(10))) ||
  (href.startsWith('/journal/') && !!getArticle(href.slice(9)));

function App() {
  const [route, setRoute] = useState('/');
  useEffect(() => {
    const go = (e: Event) => {
      const full = (e as CustomEvent<string>).detail;
      const href = full.split(/[?#]/)[0] || '/';
      const query = full.includes('?') ? full.slice(full.indexOf('?')).split('#')[0] : '';
      try {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${query}`);
      } catch { /* istoric indisponibil */ }
      if (!known(href)) return;
      setRoute(href);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('preview:navigate', go);
    return () => window.removeEventListener('preview:navigate', go);
  }, []);

  return (
    <Providers>
      <BrandBackdrop />
      {route === '/checkout' ? (
        <Checkout />
      ) : route.startsWith('/colectii') ? (
        <>
          <SiteNav />
          <main id="continut"><Catalog key={route} category={route.length > 10 ? (route.slice(10) as CategoryKey) : undefined} /></main>
        </>
      ) : route === '/journal' ? (
        <>
          <SiteNav />
          <main id="continut"><JournalIndex /></main>
        </>
      ) : route.startsWith('/journal/') ? (
        <>
          <SiteNav />
          <main id="continut"><ArticlePage key={route} a={getArticle(route.slice(9))!} /></main>
        </>
      ) : route.startsWith('/produs/') ? (
        <>
          <SiteNav />
          <main id="continut"><ProductPage key={route} slug={route.slice(8)} /></main>
        </>
      ) : (
        <>
          <SiteNav />
          <main id="continut">
            <Hero />
            <Atelier />
            <FeaturedCollections />
            <HomeFaq />
          </main>
        </>
      )}
      {route !== '/checkout' && <SiteFooter key={`f-${route}`} />}
    </Providers>
  );
}
document.body.classList.add('grain');
createRoot(document.getElementById('root')!).render(<App />);
