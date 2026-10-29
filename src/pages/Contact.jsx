import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, LifeBuoy, ShieldCheck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import '../styles/pages.css';

// Live Formspree form that delivers messages to the support inbox.
const FORMSPREE_ID = 'xlgqebow';
const emptyForm = { name: '', email: '', subject: 'Microphone setup help', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyForm);
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ Name: formData.name, Email: formData.email, Category: formData.subject, Message: formData.message }),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      setFormStatus('success');
      setFormData(emptyForm);
    } catch {
      setFormStatus('error');
    }
  };

  return <div className="page">
    <header className="page-hero">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h1>Contact Mic Testing Tool support</h1>
        <p className="lead">Questions about a microphone test, browser permissions or something on the website? Send us a message and we will reply by email.</p>
      </div>
    </header>

    <section className="section section--tight-top">
      <div className="container contact-grid">
        <aside className="contact-aside">
          <div className="card"><span className="icon-chip"><Mail size={20} aria-hidden="true" /></span><h2 className="h3">Email</h2><p><a href="mailto:support@mictestingtool.com">support@mictestingtool.com</a></p><p>Write to us directly, or use the form — both reach the same inbox.</p></div>
          <div className="card"><span className="icon-chip"><LifeBuoy size={20} aria-hidden="true" /></span><h2 className="h3">Include these details</h2><p>Your browser and version, operating system, microphone model, and what happened when you started the test.</p></div>
          <div className="card"><span className="icon-chip"><ShieldCheck size={20} aria-hidden="true" /></span><h2 className="h3">Keep it private</h2><p>Never send passwords or private recordings. Many problems are solved faster with the <Link to="/faq">troubleshooting answers</Link>.</p></div>
        </aside>

        <div className="contact-form">
          {formStatus === 'success' ? <div className="form-state" role="status">
            <CheckCircle size={48} color="#34d399" aria-hidden="true" />
            <h2>Message sent</h2>
            <p>Thank you for getting in touch. Your message has reached our support inbox and we will reply by email.</p>
            <button type="button" className="btn btn-ghost" onClick={() => setFormStatus('idle')}>Send another message</button>
          </div> : formStatus === 'error' ? <div className="form-state" role="alert">
            <AlertCircle size={48} color="#f87171" aria-hidden="true" />
            <h2>Message not sent</h2>
            <p>Something went wrong while sending your message. Check your connection and try again, or email support@mictestingtool.com directly.</p>
            <button type="button" className="btn btn-primary" onClick={() => setFormStatus('idle')}>Try again</button>
          </div> : <form onSubmit={handleFormSubmit}>
            <h2>Send a message</h2>
            <div className="field-row">
              <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" className="input" type="text" name="name" autoComplete="name" required value={formData.name} onChange={handleInputChange} placeholder="Your name" /></div>
              <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" className="input" type="email" name="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} placeholder="name@example.com" /></div>
            </div>
            <div className="field"><label htmlFor="contact-subject">Topic</label><select id="contact-subject" className="input" name="subject" value={formData.subject} onChange={handleInputChange}>
              <option value="Microphone setup help">Microphone setup help</option>
              <option value="Hardware or connection problem">Hardware or connection problem</option>
              <option value="Website feedback">Website feedback or feature request</option>
            </select></div>
            <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" className="input" name="message" rows="5" required value={formData.message} onChange={handleInputChange} placeholder="Describe the problem, your browser and your device." /></div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? 'Sending…' : 'Send message'}<ArrowRight size={16} aria-hidden="true" /></button>
          </form>}
        </div>
      </div>
    </section>
  </div>;
}
