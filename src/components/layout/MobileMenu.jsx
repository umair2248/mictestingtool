import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import '../../styles/mobile-menu.css';
import LanguageLinks from '../LanguageLinks';
export default function MobileMenu({ open, onClose, locale, items = navigation }) {
 const panel = useRef(null);
 useEffect(() => {
  if (!open) return;
  const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; panel.current.querySelector('button').focus();
  const key = event => {
   if (event.key === 'Escape') { event.preventDefault(); onClose(); }
   if (event.key === 'Tab') { const items = [...panel.current.querySelectorAll('button, a[href]')]; const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
   }
  };
  document.addEventListener('keydown', key); return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', key); };
 }, [open, onClose]);
 if (!open) return null;
 return <div id="mobile-menu" className="mobile-menu"><div ref={panel} className="mobile-menu__dialog" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
 <div className="mobile-menu__header"><p id="mobile-menu-title">{locale?.navigation || 'Navigation'}</p><button type="button" onClick={onClose}>{locale?.close || 'Close menu'}</button></div>
 <nav aria-label={locale?.navigation || 'Mobile navigation'}><ul>{items.map(item => <li key={item.to}><NavLink to={item.to} end onClick={onClose} lang={item.lang}>{item.label}</NavLink></li>)}</ul></nav>
 <div onClick={event => { if (event.target.closest('a')) onClose(); }}><LanguageLinks /></div>
 <Link to={locale?.path || '/'} onClick={onClose} className="mobile-menu__cta">{locale?.tool.title || 'Test your microphone'}</Link></div><div className="mobile-menu__backdrop" aria-hidden="true" onClick={onClose}/></div>;
}
