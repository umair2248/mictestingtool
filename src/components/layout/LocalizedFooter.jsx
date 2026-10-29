import { Link } from 'react-router-dom';
import LanguageLinks from '../LanguageLinks';

export default function LocalizedFooter({ locale }) {
  return <footer className="localized-footer" lang={locale.code}>
    <div className="localized-footer__inner"><p className="localized-footer__brand">Mic Testing Tool</p><p>{locale.tool.privacy}</p>
      <nav aria-label={locale.linksTitle}><ul>{['/blog/how-to-test-your-microphone','/faq','/privacy','/contact'].map((path, index) => <li key={path}><Link to={path}>{locale.links[index]}</Link></li>)}</ul></nav>
      <LanguageLinks /><p>© {new Date().getFullYear()} Mic Testing Tool</p>
    </div>
  </footer>;
}
