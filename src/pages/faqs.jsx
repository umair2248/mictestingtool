import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqs } from '../data/faqs';
export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const filtered = faqs.filter(item => (category === 'all' || item.category === category) && (item.q + ' ' + item.a).toLowerCase().includes(search.toLowerCase()));
  return <div className="page">
    <header className="page-hero"><div className="container">
      <span className="eyebrow">Help center</span>
      <h1>Microphone test help and troubleshooting</h1>
      <p className="lead">Practical answers about browser permissions, audio input, background noise and recording privacy.</p>
    </div></header>
    <section className="content-page">
      <div className="toolbar">
        <div className="field"><label htmlFor="faq-search">Search answers</label><input id="faq-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="e.g. permission, noise, latency" /></div>
        <div className="field"><label htmlFor="faq-category">Category</label><select id="faq-category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All questions</option><option value="general">Getting started</option><option value="browser">Browser permissions</option><option value="hardware">Microphones</option><option value="advanced">Measurements and calls</option></select></div>
      </div>
      {filtered.map(item => <details className="help-answer" key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      {!filtered.length && <p className="empty-state">No answers match. Try another search or <Link to="/contact">contact support</Link>.</p>}
      <div className="page-links"><Link to="/" className="btn btn-primary">Open the microphone tester</Link><Link to="/blog/microphone-not-working" className="btn btn-ghost">Mic not working? Full fix guide</Link><Link to="/blog" className="btn btn-ghost">Read the guides</Link><Link to="/contact" className="btn btn-ghost">Contact support</Link></div>
    </section>
  </div>;
}
