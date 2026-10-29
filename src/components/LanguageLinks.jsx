import { Link, useLocation } from 'react-router-dom';
import { getLocale, languageVersions } from '../data/locales';
import { useEffect, useRef } from 'react';

export default function LanguageLinks({ compact = false }) {
  const { pathname } = useLocation();
  const locale = getLocale(pathname);
  const picker = useRef(null);
  useEffect(() => {
    if (!compact) return;
    const close = event => {
      if (picker.current && (event.key === 'Escape' || !picker.current.contains(event.target))) {
        const restoreFocus = event.key === 'Escape' && picker.current.open;
        picker.current.open = false;
        if (restoreFocus) picker.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [compact]);
  const links = <ul className="language-links">{languageVersions.map(item => <li key={item.code}><Link to={item.path} lang={item.code} hrefLang={item.code} aria-current={pathname === item.path ? 'page' : undefined}>{item.label}</Link></li>)}</ul>;
  if (compact) return <details ref={picker} className="language-picker" key={pathname}><summary>{locale?.language || 'Language'}: {locale?.label || 'English'}</summary>{links}</details>;
  return <nav className="language-directory" aria-label={locale?.language || 'Languages'}><p>{locale?.language || 'Languages'}</p>{links}</nav>;
}
