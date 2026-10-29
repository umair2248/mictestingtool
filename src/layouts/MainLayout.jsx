import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LocalizedFooter from '../components/layout/LocalizedFooter';
import { getLocale } from '../data/locales';
import { useEffect } from 'react';

export default function MainLayout() {
  const { pathname, hash } = useLocation();
  const locale = getLocale(pathname);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let target = null;
      try { if (hash) target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { /* Ignore a malformed fragment. */ }
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      {locale ? <LocalizedFooter locale={locale} /> : <Footer />}
    </div>
  );
}
