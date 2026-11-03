import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Expand, Gauge, Mic, RotateCcw, ShieldCheck, Square, X } from 'lucide-react';
import useNoiseMeter from '../hooks/useNoiseMeter';
import { levelZone, zoneLabels } from '../utils/noiseLevel';
import '../styles/home.css';
import '../styles/speaker-test.css';
import '../styles/noise-meter.css';

const questions = [
  ['Is this a real decibel meter?', 'It is a relative noise meter. It turns your microphone signal into a 0–100 reading that rises and falls with the sound in the room, which is ideal for spotting when a class gets louder. It is not a calibrated dB(A) sound level meter, so do not use it for hearing safety, workplace noise or legal measurements.'],
  ['Is the noise meter for classroom use free?', 'Yes. The classroom noise meter is free, needs no account or app, and works in Chrome, Edge, Firefox and Safari on laptops, Chromebooks, tablets and phones.'],
  ['Does the noise meter record my class?', 'No. The microphone signal is analysed in your browser to draw the level. Nothing is recorded, saved or uploaded, and the microphone turns off when you press Stop or close the page.'],
  ['What "too loud" limit should I use?', 'Start the meter during normal, acceptable group work and note the reading. Set the limit about 5 to 10 points above that. Lower it for silent reading and raise it for active work. Every microphone and room reads differently, so set it by ear, not from a chart.'],
  ['Why do the readings differ between devices?', 'Each microphone has its own sensitivity, and laptops, tablets and phones place it in different spots. That is why the reading is relative. Use the Sensitivity slider so a normal class sits in the green, and keep the same device in the same place.'],
  ['Can I use it as a decibel meter on iPhone?', 'Yes, open this page in Safari on your iPhone or iPad, press Start and allow the microphone. The reading is still relative. For a closer estimate of real dB(A) on iPhone, use a dedicated sound level meter app.'],
  ['Why does the meter show a low number or nothing at all?', 'Check that you allowed microphone access, picked the right microphone and that it is not muted. If the level never moves, run the free microphone test linked on this page to check the mic itself.'],
];

export default function NoiseMeter() {
  const meter = useNoiseMeter();
  const [classroom, setClassroom] = useState(false);
  const running = meter.state === 'running';
  const zone = levelZone(meter.level, meter.limit);
  const shown = running ? Math.round(meter.level) : 0;
  const label = !running ? 'Not listening' : meter.alerting ? `${zoneLabels.loud}!` : zoneLabels[zone];

  const openClassroom = () => {
    setClassroom(true);
    if (!running) meter.start();
    document.documentElement.requestFullscreen?.().catch(() => {});
  };
  const closeClassroom = () => {
    setClassroom(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    if (!classroom) return;
    const key = event => { if (event.key === 'Escape') setClassroom(false); };
    const change = () => { if (!document.fullscreenElement) setClassroom(false); };
    window.addEventListener('keydown', key);
    document.addEventListener('fullscreenchange', change);
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('fullscreenchange', change); };
  }, [classroom]);

  const display = big => <div className={`noise-display noise-display--${running ? (meter.alerting ? 'loud' : zone) : 'idle'}${big ? ' noise-display--big' : ''}`}>
    <div className="noise-readout"><strong>{shown}</strong><span>relative dB</span></div>
    <p className="noise-label">{label}</p>
    <div className="noise-bar" role="meter" aria-label="Noise level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown} aria-valuetext={`${shown} of 100, ${label}`}>
      <span className="noise-bar__fill" style={{ width: `${shown}%` }} />
      <span className="noise-bar__limit" style={{ left: `${meter.limit}%` }} aria-hidden="true" />
    </div>
    <p className="noise-limit-caption">Too-loud limit: {meter.limit}</p>
  </div>;

  return <div className="mic-home speaker-page noise-page">
    <section className="home-hero"><div className="home-container home-hero-grid">
      <div>
        <nav className="speaker-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>Online Noise Meter</span></nav>
        <span className="home-eyebrow">Free classroom noise meter</span>
        <h1>Free Online Noise Meter for Classroom</h1>
        <p className="home-lead">A free online noise meter for classroom use. See a live sound level bar, set a “too loud” limit with a visual alert, and switch to fullscreen classroom mode so every student can see it. No app or sign-up.</p>
        <ul className="home-trust"><li><Check size={16} aria-hidden="true" />Works on any device</li><li><ShieldCheck size={16} aria-hidden="true" />Nothing is recorded</li><li><Expand size={16} aria-hidden="true" />Fullscreen class mode</li></ul>
        <p className="home-note">Shows a relative level from your microphone, not a calibrated decibel reading.</p>
      </div>
      <div className="home-tool" id="noise-meter" aria-labelledby="noise-tool-title">
        <Gauge aria-hidden="true" className="home-card-icon" /><h2 id="noise-tool-title">Classroom noise level</h2>
        {display(false)}
        <p className="noise-sr" role="status" aria-live="polite">{running ? (meter.alerting ? 'Too loud. The level is above your limit.' : '') : meter.state === 'starting' ? 'Waiting for microphone access…' : ''}</p>
        <div className="noise-controls">
          {running ? <button className="home-button home-button-stop" onClick={meter.stop}><Square size={16} aria-hidden="true" />Stop</button>
            : <button className="home-button" onClick={() => meter.start()} disabled={meter.state === 'starting'}><Mic size={18} aria-hidden="true" />{meter.state === 'starting' ? 'Starting…' : 'Start noise meter'}</button>}
          <button className="home-button home-button-secondary" onClick={openClassroom}><Expand size={16} aria-hidden="true" />Classroom mode</button>
        </div>
        <label htmlFor="noise-limit">Too-loud limit: {meter.limit}</label>
        <input id="noise-limit" className="noise-range" type="range" min="30" max="95" step="1" value={meter.limit} onChange={event => meter.setLimit(Number(event.target.value))} />
        <label htmlFor="noise-sensitivity">Sensitivity: {meter.sensitivity > 0 ? '+' : ''}{meter.sensitivity}</label>
        <input id="noise-sensitivity" className="noise-range" type="range" min="-20" max="20" step="1" value={meter.sensitivity} onChange={event => meter.setSensitivity(Number(event.target.value))} aria-describedby="noise-sensitivity-help" />
        <p id="noise-sensitivity-help" className="home-note">Adjust so a normal, acceptable class sits in the green.</p>
        {meter.devices.length > 1 && <><label htmlFor="noise-device">Microphone</label><select id="noise-device" value={meter.deviceId} onChange={event => meter.chooseDevice(event.target.value)}>{meter.devices.map((device, index) => <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>)}</select></>}
        <dl className="noise-stats">
          <div><dt>Peak</dt><dd>{Math.round(meter.stats.peak)}</dd></div>
          <div><dt>Average</dt><dd>{Math.round(meter.stats.average)}</dd></div>
          <div><dt>Times too loud</dt><dd>{meter.stats.alerts}</dd></div>
        </dl>
        <button className="noise-reset" onClick={meter.resetStats}><RotateCcw size={14} aria-hidden="true" />Reset stats</button>
        {meter.error && <p className="home-error" role="alert">{meter.error}</p>}
        <noscript><p className="home-error">Enable JavaScript to use the noise meter. The guide below stays readable without it.</p></noscript>
      </div>
    </div></section>

    {classroom && <div className={`noise-classroom noise-classroom--${running ? (meter.alerting ? 'loud' : zone) : 'idle'}`} role="dialog" aria-modal="true" aria-label="Classroom noise meter">
      <button className="noise-classroom__close" onClick={closeClassroom}><X size={20} aria-hidden="true" />Exit classroom mode</button>
      {display(true)}
      <div className="noise-classroom__limit"><button onClick={() => meter.setLimit(Math.max(30, meter.limit - 5))} aria-label="Lower the too-loud limit">−</button><span>Limit {meter.limit}</span><button onClick={() => meter.setLimit(Math.min(95, meter.limit + 5))} aria-label="Raise the too-loud limit">+</button></div>
      {meter.error && <p className="home-error" role="alert">{meter.error}</p>}
    </div>}

    <nav className="home-container home-jump-links" aria-label="Noise meter guide"><a href="#how-to-use">How to use it</a><a href="#noise-levels">What the levels mean</a><a href="#relative-db">Relative vs real dB</a><a href="#decibel-meter-iphone">iPhone</a><a href="#noise-faq">Questions</a></nav>

    <section className="home-section" id="how-to-use"><div className="home-container"><div className="home-section-intro"><h2>How to use the noise meter in your classroom</h2><p>The classroom noise meter takes less than a minute to set up. Put the device where it hears the whole room, not right next to one group of students.</p></div>
      <figure className="home-figure"><img src="/images/noise-meter/classroom-setup.svg" alt="How to use an online noise meter for classroom: start the meter, set the too-loud limit, then switch to fullscreen classroom mode on the projector" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>Start the meter, set your limit, then put it on the big screen.</figcaption></figure>
      <ol className="home-steps">
        <li><h3>Press Start and allow the mic</h3><p>Select <strong>Start noise meter</strong> and allow microphone access when your browser asks. A laptop, Chromebook or tablet mic is fine.</p></li>
        <li><h3>Calibrate to your class</h3><p>During normal, acceptable work, move the <strong>Sensitivity</strong> slider until the bar sits in the green.</p></li>
        <li><h3>Set the too-loud limit</h3><p>Drag <strong>Too-loud limit</strong> to the level you want to stay under. The white line on the bar shows it.</p></li>
        <li><h3>Go fullscreen</h3><p>Select <strong>Classroom mode</strong> to fill the screen or projector. The background turns red when the room stays too loud for a second.</p></li>
      </ol>
      <a className="home-button" href="#noise-meter"><Gauge size={18} aria-hidden="true" />Open the noise meter</a>
    </div></section>

    <section className="home-section home-section-alt" id="noise-levels"><div className="home-container"><h2>What the colours and numbers mean</h2>
      <figure className="home-figure"><img src="/images/noise-meter/noise-levels.svg" alt="Class noise meter levels: green for quiet, amber for getting loud, red for too loud above the limit you set" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>The zones move with your limit: amber starts 10 points below it.</figcaption></figure>
      <div className="home-grid home-grid-three">
        <div className="home-card noise-zone noise-zone--quiet"><h3>Green: quiet</h3><p>More than 10 points below your limit. Good for silent reading, tests and independent work.</p></div>
        <div className="home-card noise-zone noise-zone--warn"><h3>Amber: getting loud</h3><p>Within 10 points of the limit. A cue for the class to bring the volume down before it turns red.</p></div>
        <div className="home-card noise-zone noise-zone--loud"><h3>Red: too loud</h3><p>Above the limit for at least a second. The count of times too loud goes up once per alert.</p></div>
      </div>
      <p>The one-second delay means a single clap, a dropped book or a door does not set off the alert. Only noise that lasts does. <strong>Peak</strong> shows the loudest moment, <strong>Average</strong> the typical level since you started, and <strong>Reset stats</strong> starts a new lesson.</p>
    </div></section>

    <section className="home-section" id="relative-db"><div className="home-container home-columns">
      <div><h2>Relative level, not a calibrated decibel meter</h2><p>This free decibel meter shows a <strong>relative</strong> level. It measures how strong the microphone signal is and places it on a 0–100 scale labelled “relative dB”. Louder sound gives a higher number, and the steps behave like decibels, so it is good for comparing quiet and noisy moments in the same room.</p><p>It is not a calibrated sound level meter. Browsers do not know your microphone's real sensitivity, and devices apply their own processing, so the number is not a true dB(A) or dB SPL value. Do not use it for hearing protection, workplace noise checks or legal disputes. For those, use a calibrated meter.</p></div>
      <div><h2>Getting steady readings</h2><ul className="home-help-list"><li>Keep the same device in the same place each lesson.</li><li>Do not cover the microphone or put the laptop in a bag or drawer.</li><li>Use the built-in mic or one USB mic, not a headset worn by one person.</li><li>Close video-call apps that may turn the mic down or apply noise cancelling.</li><li>Plug in the laptop: classroom mode keeps the screen awake while it runs.</li></ul><p>No signal? Run the <Link to="/#microphone-test">free online mic test</Link> to check the microphone first.</p></div>
    </div></section>

    <section className="home-section home-section-alt" id="decibel-meter-iphone"><div className="home-container home-columns">
      <div><h2>Decibel meter on iPhone, iPad and Chromebook</h2><p>You do not need to install a decibel meter app on iPhone to use this tool. Open this page in Safari, press <strong>Start noise meter</strong> and allow the microphone. It also works on iPad, Android phones, Chromebooks, Windows and Mac.</p><p>Fullscreen depends on the device: on iPhone, Safari may keep its toolbar visible, but classroom mode still fills the page. If you need readings closer to real dB(A) on an iPhone, a dedicated sound level meter app that supports calibration will be more accurate than any website.</p></div>
      <div><h2>Tips for a calmer classroom</h2><ul className="home-help-list"><li>Agree on the limit with the class and show them the green, amber and red zones first.</li><li>Use different limits for different activities: low for reading, higher for group work.</li><li>Praise time spent in the green rather than only reacting to red.</li><li>Check the “times too loud” count at the end of a lesson and set a goal for the next one.</li></ul></div>
    </div></section>

    <section className="home-section"><div className="home-container"><h2>Privacy: nothing is recorded</h2><p>The noise meter only reads the loudness of the microphone signal in your browser. It does not record speech, save audio or send anything to a server. The microphone stops when you press <strong>Stop</strong> or close the tab. Read the <Link to="/privacy">privacy policy</Link> for details.</p><p>Also on Mic Testing Tool: the <Link to="/#microphone-test">online microphone test</Link>, the <Link to="/speaker-test">speaker and headphone test</Link> and the <Link to="/webcam-test">webcam and mic test</Link>. Our guide on <Link to="/blog/how-to-test-your-microphone">how to test your microphone</Link> helps if the meter does not react.</p></div></section>

    <section className="home-section home-section-alt" id="noise-faq"><div className="home-container"><h2>Classroom noise meter questions</h2>{questions.map(([q, a]) => <details className="home-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}<p>Still stuck? <Link to="/contact">Contact support</Link> with your browser, device and what the meter showed.</p></div></section>
  </div>;
}
