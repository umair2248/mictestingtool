import { Link, useLocation } from 'react-router-dom';
import { getLocale } from '../data/locales';
import MicrophoneTool from '../components/MicrophoneTool';
import LanguageLinks from '../components/LanguageLinks';
import NotFound from './NotFound';
import '../styles/home.css';

export default function LocalizedMicPage() {
  const { pathname } = useLocation();
  const locale = getLocale(pathname);
  if (!locale) return <NotFound />;
  return <div className="mic-home localized-mic" lang={locale.code}>
    <section className="home-hero" aria-labelledby="home-title"><div className="home-container home-hero-grid">
      <div><span className="home-eyebrow">Mic Testing Tool · {locale.label}</span><h1 id="home-title">{locale.h1}</h1><p className="home-lead">{locale.lead}</p></div>
      <MicrophoneTool key={locale.code} text={locale.tool} />
    </div></section>
    <nav className="home-container home-jump-links" aria-label={locale.navigation}><a href="#how-to-test">{locale.stepsTitle}</a><a href="#test-results">{locale.resultsTitle}</a><a href="#mic-faq">{locale.faqTitle}</a></nav>
    <section className="home-section" id="how-to-test"><div className="home-container"><h2>{locale.stepsTitle}</h2><ol className="home-steps">{locale.steps.map(step => <li key={step}><p>{step}</p></li>)}</ol><a className="home-button" href="#microphone-test">{locale.tool.start}</a></div></section>
    <section className="home-section home-section-alt" id="test-results"><div className="home-container"><h2>{locale.resultsTitle}</h2><p>{locale.results}</p></div></section>
    <section className="home-section"><div className="home-container"><h2>{locale.fixTitle}</h2><ul className="home-help-list">{locale.fixes.map(fix => <li key={fix}>{fix}</li>)}</ul></div></section>
    <section className="home-section home-section-alt"><div className="home-container home-columns"><div><h2>{locale.devicesTitle}</h2><p>{locale.devices}</p></div><div><h2>{locale.privacyTitle}</h2><p>{locale.privacyText}</p></div></div></section>
    <section className="home-section" id="mic-faq"><div className="home-container"><h2>{locale.faqTitle}</h2>{locale.faqs.map(([q,a]) => <details key={q} className="home-faq"><summary>{q}</summary><p>{a}</p></details>)}</div></section>
    <section className="home-section home-section-alt"><div className="home-container"><h2>{locale.linksTitle}</h2><ul className="home-help-list">{['/blog/how-to-test-your-microphone','/faq','/privacy','/contact'].map((path, i) => <li key={path}><Link to={path}>{locale.links[i]}</Link></li>)}</ul><LanguageLinks /></div></section>
  </div>;
}
