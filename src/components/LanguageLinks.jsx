import { Link, useLocation } from 'react-router-dom';
import { getLocale, languageVersions } from '../data/locales';
import { useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import Flag from './Flag';

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
  const links = <ul className="language-links">{languageVersions.map(item => {
    const current = pathname === item.path;
    return <li key={item.code}><Link to={item.path} lang={item.code} hrefLang={item.code} aria-current={current ? 'page' : undefined}><Flag code={item.code}/><span>{item.label}</span>{compact && current && <Check className="language-links__check" size={18} aria-hidden="true"/>}</Link></li>;
  })}</ul>;
  if (compact) {
    const code = locale?.code || 'en';
    return <details ref={picker} className="language-picker" key={pathname}>
      <summary aria-label={`${locale?.language || 'Language'}: ${locale?.label || 'English'}`}><Flag code={code}/><span>{code.split('-')[0].toUpperCase()}</span><ChevronDown className="language-picker__caret" size={16} aria-hidden="true"/></summary>
      {links}
    </details>;
  }
  return <nav className="language-directory" aria-label={locale?.language || 'Languages'}><p>{locale?.language || 'Languages'}</p>{links}</nav>;
}
