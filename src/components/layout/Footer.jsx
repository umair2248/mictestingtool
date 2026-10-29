import { Link } from 'react-router-dom';
import { Mic, Mail } from 'lucide-react';
import { languageVersions } from '../../data/locales';
import '../../styles/footer.css';

const columns = [
  { title: 'Tools', links: [['/', 'Online Mic Test'], ['/webcam-test', 'Webcam & Mic Test'], ['/speaker-test', 'Speaker & Headphone Test'], ['/features', 'Tester Features']] },
  { title: 'Guides', links: [['/blog/how-to-test-your-microphone', 'How to Test a Microphone'], ['/blog/microphone-not-working', 'Mic Not Working? Fixes'], ['/blog/how-to-connect-set-up-microphone', 'Set Up a Mic on PC or Mac'], ['/blog', 'All Guides'], ['/faq', 'Troubleshooting FAQ']] },
  { title: 'Company', links: [['/contact', 'Contact'], ['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use'], ['/security', 'Security']] },
];

export default function Footer() {
  return <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="site-footer__brand">
        <Link to="/" className="brand-mark__link"><img src="/mic-favicon.svg" width="36" height="36" alt="" className="site-footer__logo" loading="lazy" /><span>Mic Testing <b>Tool</b></span></Link>
        <p>A free browser microphone tester. Record, listen back and download a clip — your test audio is processed locally and never uploaded.</p>
        <Link to="/#microphone-test" className="btn btn-primary"><Mic size={17} aria-hidden="true" />Start the mic test</Link>
      </div>
      {columns.map(column => <nav key={column.title} className="site-footer__col" aria-label={column.title}>
        <p className="site-footer__heading">{column.title}</p>
        <ul>{column.links.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
      </nav>)}
    </div>
    <div className="site-footer__langs">
      <p className="site-footer__heading">Microphone test in other languages</p>
      <ul>{languageVersions.filter(item => item.code !== 'en').map(item => <li key={item.code}><Link to={item.path} lang={item.code} hrefLang={item.code}>{item.label}</Link></li>)}</ul>
    </div>
    <div className="site-footer__bottom">
      <p>© {new Date().getFullYear()} Mic Testing Tool. All rights reserved.</p>
      <a href="mailto:support@mictestingtool.com"><Mail size={15} aria-hidden="true" />support@mictestingtool.com</a>
    </div>
  </footer>;
}
