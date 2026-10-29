import { Link } from 'react-router-dom';
import { Mic, ShieldCheck, Activity, ListFilter, Headphones, Gauge, Download, Globe, Check, X, Camera } from 'lucide-react';
import '../styles/pages.css';

const features = [
  { icon: Mic, title: 'Record and play back', text: 'Record a short sample and listen back to judge speech clarity, background noise, echo and distortion — the most reliable check of how you actually sound.' },
  { icon: Activity, title: 'Live frequency bars and input meter', text: 'Watch the frequency bars and relative input meter react as you speak, so you can confirm the browser is receiving a signal before you stop recording.' },
  { icon: ListFilter, title: 'Choose any available input', text: 'Switch between a built-in laptop mic, webcam, USB microphone, headset or audio interface — any input your browser and operating system expose.' },
  { icon: Headphones, title: 'Optional live monitoring', text: 'Hear your microphone in real time while recording. Wear headphones to avoid feedback; monitoring delay depends on your device and is not measured.' },
  { icon: Download, title: 'Download your clip', text: 'Save the recording to compare setups later. The browser picks a supported format (commonly WebM or M4A) and the button shows the extension before you save.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Audio is captured and processed in your browser with standard Web Audio and MediaRecorder APIs. The tester does not upload your recordings to a server.' },
  { icon: Gauge, title: 'Browser audio details', text: 'See the audio context sample rate and channel count reported by the browser — helpful context when comparing devices or troubleshooting.' },
  { icon: Globe, title: 'Works in your language', text: 'The microphone test is available in English and eight translated versions, including Spanish, French, German, Turkish and Indonesian.' },
];

const can = ['Confirm the browser receives input from the selected microphone', 'Let you hear your voice exactly as it was recorded', 'Compare two inputs or settings with the same sentence', 'Show the browser sample rate and input channel count', 'Check left/right playback on the separate speaker test'];
const cannot = ['Measure calibrated sound pressure in decibels (dB SPL)', 'Measure end-to-end latency or monitoring delay', 'Certify hardware or give an automatic quality score', 'Change the microphone selected inside Zoom, Teams or Discord', 'Repair drivers or operating system audio settings'];

export default function FeaturesPage() {
  return <div className="page">
    <header className="page-hero">
      <div className="container">
        <span className="eyebrow">Features</span>
        <h1>Everything you need to <span className="text-gradient">check a microphone</span> in your browser</h1>
        <p className="lead">Record, listen back, watch the input level and download a clip — free, with no sign-up or installation. Here is what the tester does, and what it deliberately does not claim to measure.</p>
        <div className="btn-row page-hero__actions"><Link to="/#microphone-test" className="btn btn-primary btn-lg"><Mic size={18} aria-hidden="true" />Start the mic test</Link><Link to="/webcam-test" className="btn btn-ghost btn-lg"><Camera size={18} aria-hidden="true" />Webcam test</Link><Link to="/speaker-test" className="btn btn-ghost btn-lg"><Headphones size={18} aria-hidden="true" />Speaker test</Link></div>
      </div>
    </header>

    <section className="section section--tight-top">
      <div className="container">
        <div className="section-head"><h2>Microphone tester features</h2><p>Each tool answers a practical question: is my microphone working, and does my voice sound clear?</p></div>
        <div className="grid grid-3 feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="card" key={title}><span className="icon-chip"><Icon size={20} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="section section--alt">
      <div className="container">
        <div className="section-head"><h2>What the online mic test can and cannot tell you</h2><p>Honest limits make results easier to trust. A browser test checks capture and playback; it is not laboratory measurement equipment.</p></div>
        <div className="grid grid-2">
          <div className="card compare compare--yes"><h3>What it checks</h3><ul>{can.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
          <div className="card compare compare--no"><h3>What it does not measure</h3><ul>{cannot.map(item => <li key={item}><X size={16} aria-hidden="true" />{item}</li>)}</ul></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container split">
        <div>
          <h2>How the tester works</h2>
          <div className="prose">
            <p>When you press <strong>Start</strong>, your browser asks for microphone permission. After you allow it, the page opens an audio stream from the selected input and passes it to two places: an analyser that drives the frequency bars and level meter, and a recorder that stores the clip in memory.</p>
            <p>When you stop, the stream is released and the recording becomes available for playback and download. Nothing is sent to our server. Refreshing or closing the page discards an unsaved clip.</p>
            <p>Want step-by-step instructions? Read <Link to="/blog/how-to-test-your-microphone">how to test your microphone</Link> or the <Link to="/blog/how-to-connect-set-up-microphone">PC and Mac microphone setup guide</Link>.</p>
          </div>
        </div>
        <div className="card spec-card">
          <p className="spec-card__label">Typical browser information</p>
          <dl>
            <div><dt>Sample rate</dt><dd>44.1 or 48 kHz</dd></div>
            <div><dt>Recording format</dt><dd>WebM / M4A</dd></div>
            <div><dt>Upload</dt><dd>None</dd></div>
            <div><dt>Latency</dt><dd>Not measured</dd></div>
          </dl>
          <p className="muted spec-card__note">Values depend on your browser, operating system and device.</p>
        </div>
      </div>
    </section>

    <section className="section section--tight-top">
      <div className="container">
        <div className="cta-band"><h2>Ready to test your microphone?</h2><p>It takes about 15 seconds: choose an input, speak, stop and listen back.</p><div className="btn-row"><Link to="/#microphone-test" className="btn btn-primary btn-lg"><Mic size={18} aria-hidden="true" />Start free mic test</Link><Link to="/faq" className="btn btn-ghost btn-lg">Troubleshooting help</Link></div></div>
      </div>
    </section>
  </div>;
}
