import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { navigation } from '../../data/navigation';
import MobileMenu from './MobileMenu';
import '../../styles/header.css';
import LanguageLinks from '../LanguageLinks';
import { getLocale } from '../../data/locales';
export default function Header() {
 const [ready, setReady] = useState(false);
 const [open, setOpen] = useState(false); const trigger = useRef(null); const location = useLocation();
 const locale = getLocale(location.pathname);
 // Untranslated tool pages keep their short English name, marked with lang="en", so the bar fits.
 const items = navigation.map((item, i) => ({ ...item, label: locale?.nav[i] || item.label, lang: locale && !locale.nav[i] ? 'en' : undefined, to: i === 0 && locale ? locale.path : item.to }));
 const close = useCallback(() => { setOpen(false); trigger.current?.focus(); }, []);
 useEffect(() => { setReady(true); setOpen(false); }, [location.pathname]);
 useEffect(() => { const mq = window.matchMedia('(min-width: 1200px)'); const change = () => { if (mq.matches) setOpen(false); }; mq.addEventListener('change', change); return () => mq.removeEventListener('change', change); }, []);
 return <header className="site-header"><div className="site-header__inner">
 <Link to={locale?.path || '/'} className="brand-mark__link" aria-label="Mic Testing Tool"><img src="/mic-favicon.svg" width="42" height="42" alt="" className="brand-mark__logo"/><span>Mic Testing <b>Tool</b></span></Link>
 <nav className="site-nav" aria-label={locale?.navigation || 'Primary navigation'}><ul>{items.map((item, index) => <li key={item.to}><NavLink to={item.to} end={index === 0} lang={item.lang}>{item.label}</NavLink></li>)}</ul></nav>
 <div className="site-header__actions"><div className="desktop-languages"><LanguageLinks compact /></div><button ref={trigger} disabled={!ready} type="button" className="site-header__menu-toggle" aria-label={locale?.menu || 'Open mobile menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}><Menu aria-hidden="true"/></button></div>
 </div><MobileMenu open={open} onClose={close} locale={locale} items={items}/></header>;
}
