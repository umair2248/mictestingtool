import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MousePointerClick, RotateCcw } from 'lucide-react';
import useDoubleClickTest from '../hooks/useDoubleClickTest';
import { BUTTONS, MAX_THRESHOLD, MIN_THRESHOLD, summarize } from '../utils/clickAnalysis';
import '../styles/home.css';
import '../styles/speaker-test.css';
import '../styles/double-click-test.css';

const questions = [
  ['How do I test if my mouse is double clicking?', 'Click slowly and normally inside the test box above, one click at a time, 20 to 30 times. If the tool flags a double click when you only pressed once, the mouse sent two clicks for one press. Try it with the left button first, since that is the one that wears out most.'],
  ['What threshold should I use?', 'Leave it at 80 ms. A person double clicking on purpose almost never gets two clicks closer than about 100 ms, while a failing switch usually sends its second click 5 to 50 ms after the first. If you are a very fast clicker and get flagged on purpose double clicks, lower it to 50 or 60 ms.'],
  ['Can this test tell if it is the mouse or Windows?', 'Partly. The test sees the clicks exactly as the browser receives them. If it flags double clicks here, the extra click is coming from the mouse or its driver, not from a Windows setting like double-click speed. To be sure it is the hardware, run the test with the same mouse on another computer.'],
  ['Why does a single click sometimes drop what I am dragging?', 'That is the same fault in reverse. While you hold the button, the worn switch briefly lets go and presses again. The test catches this too: hold the left button for a second, then release. If it shows a press a few milliseconds after a release you did not make, the switch is bouncing.'],
  ['Does this work for the right, middle and side buttons?', 'Yes. Right click, the scroll wheel button and the back and forward side buttons are all counted separately, and the page blocks the context menu and back navigation while your pointer is inside the box. The scroll wheel is counted up and down too, so you can check for a wheel that jumps.'],
  ['Does it work on a laptop touchpad or a phone?', 'A touchpad tap counts as a left click, so you can test it, but touchpad problems are usually settings rather than worn switches. On phones and tablets, a tap is reported as a click with a delay, so the timing is not precise enough to judge hardware. Use a computer with the mouse plugged in.'],
  ['Is anything recorded or sent anywhere?', 'No. The clicks are counted in your browser and are cleared when you press Reset or leave the page. The test does not use the camera or microphone.'],
];

const fmt = value => value === null ? '–' : `${Math.round(value)} ms`;

export default function DoubleClickTest() {
  const test = useDoubleClickTest();
  const [flash, setFlash] = useState(false);
  const summary = summarize(test.stats);
  const latest = test.log[0];
  const latestId = latest?.id;
  const latestBad = !!latest?.suspicious;

  useEffect(() => {
    if (!latestBad) return undefined;
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(timer);
  }, [latestId, latestBad]);

  const buttonClass = key => `dc-btn-${key}${test.pressed[key] ? (latestBad && latest?.key === key ? ' is-bad' : ' is-down') : ''}`;

  return <div className="mic-home speaker-page dc-page">
    <section className="home-hero"><div className="home-container home-hero-grid">
      <div><nav className="speaker-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>Mouse Double Click Test</span></nav><span className="home-eyebrow">Free double clicking mouse test</span><h1>Mouse Double Click Test</h1><p className="home-lead">Click inside the box like you normally would. If your mouse turns one click into two, the test catches it, measures the gap in milliseconds and tells you which button is failing.</p><p>Works with left, right, middle and side buttons and the scroll wheel. Runs in your browser, nothing to install.</p></div>
      <div className="home-tool" id="double-click-test" aria-labelledby="dc-tool-title">
        <MousePointerClick aria-hidden="true" className="home-card-icon"/><h2 id="dc-tool-title">Click test area</h2>
        <div ref={test.areaRef} className={`dc-area${flash ? ' is-flash' : ''}`} tabIndex={0} aria-describedby="dc-summary" {...test.handlers}>
          <div className="dc-mouse" aria-hidden="true">
            <span className={buttonClass('left')}/><span className={buttonClass('right')}/><span className={buttonClass('middle')}/><span className={buttonClass('forward')}/><span className={buttonClass('back')}/>
          </div>
          <p className="dc-area-hint">Click here, one slow click at a time</p>
        </div>
        <p id="dc-summary" role="status" aria-live="polite" className={`dc-summary dc-summary--${summary.tone}`}>{summary.text}</p>
        <table className="dc-table">
          <caption className="dc-sr">Clicks per mouse button</caption>
          <thead><tr><th scope="col">Button</th><th scope="col">Clicks</th><th scope="col">Double clicks</th><th scope="col">Fastest gap</th></tr></thead>
          <tbody>{BUTTONS.map(button => { const row = test.stats[button.key]; return <tr key={button.key} className={row.doubles ? 'is-bad' : ''}><th scope="row">{button.label}</th><td><strong>{row.clicks}</strong></td><td><strong>{row.doubles}</strong></td><td>{fmt(row.fastest)}</td></tr>; })}</tbody>
        </table>
        <p className="dc-wheel">Scroll wheel: <strong>{test.wheel.up}</strong> up · <strong>{test.wheel.down}</strong> down</p>
        <label htmlFor="dc-threshold">Double click threshold: {test.threshold} ms</label>
        <input id="dc-threshold" className="dc-range" type="range" min={MIN_THRESHOLD} max={MAX_THRESHOLD} step="10" value={test.threshold} onChange={event => test.setThreshold(Number(event.target.value))}/>
        <p className="home-note">Two presses of the same button closer than this are counted as an accidental double click. 80 ms suits most people.</p>
        <h3 className="home-note">Last clicks</h3>
        {test.log.length ? <ol className="dc-log" aria-label="Last clicks">{test.log.map(item => <li key={item.id} className={item.suspicious ? 'is-bad' : ''}><span>{item.label}</span><span>{item.interval === null ? 'first click' : `${Math.round(item.interval)} ms after the last`}{item.suspicious && <em> · double click</em>}</span></li>)}</ol> : <p className="dc-log-empty">Your clicks will show up here with the time since the previous one.</p>}
        <button type="button" className="dc-reset" onClick={test.reset}><RotateCcw size={14} aria-hidden="true"/>Reset test</button>
        <noscript><p className="home-error">Enable JavaScript to run the double click test. The guide below still works without it.</p></noscript>
      </div>
    </div></section>

    <nav className="home-container home-jump-links" aria-label="Double click test guide"><a href="#how-to-test">How to test</a><a href="#how-it-works">How it works</a><a href="#results">Results</a><a href="#fix-double-clicking">Fixes</a><a href="#dc-faq">Questions</a></nav>

    <section className="home-section" id="how-to-test"><div className="home-container"><h2>How to test your mouse for double clicking</h2>
      <ol className="home-steps">
        <li><h3>Click slowly inside the box</h3><p>Use the <strong>left button</strong> first. Give 20 to 30 single clicks, about one per second, the way you click on a file or a link. Don’t try to click fast. You want to see what the mouse does with one normal press.</p></li>
        <li><h3>Watch for a red flash</h3><p>Each click shows up in the list with the time since the one before. A normal single click is hundreds of milliseconds after the last one. If a click appears just <strong>5 to 50 ms</strong> after the previous one, the box flashes red and it’s counted as a double click.</p></li>
        <li><h3>Hold and release</h3><p>Press the left button, hold it for a second, and let go. Do it ten times. A worn switch often bounces when you release it, which is why drag-and-drop suddenly drops files. The test catches that bounce too.</p></li>
        <li><h3>Test the other buttons</h3><p>Repeat with right click, the wheel button and the side buttons. Scroll the wheel up and down slowly: if the counter jumps the wrong way, the wheel encoder is dirty or worn.</p></li>
      </ol><a href="#double-click-test">Back to the double click test</a></div></section>

    <section className="home-section home-section-alt" id="how-it-works"><div className="home-container"><h2>How the double click test works</h2>
      <figure className="home-figure"><img src="/images/double-click-test/click-timing.svg" alt="Mouse double click test timing: a normal click compared with a faulty click where one press sends two clicks a few milliseconds apart" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>A worn switch sends its second click within a few milliseconds. No human double clicks that fast.</figcaption></figure>
      <p>Inside every mouse button is a tiny metal spring switch. When it’s new, one press closes the contact once. Over time the metal tires or the contact surface gets dirty, and on a single press the contact <strong>bounces</strong>: it closes, opens for a moment, and closes again. The computer sees two clicks.</p>
      <p>The tool records the exact time of every press using your browser’s high-resolution timer. When two presses of the same button arrive closer together than the threshold (80 ms by default), it marks the second one as an accidental double click. It also flags a press that comes less than 25 ms after a release, which is how a bouncing switch breaks a drag.</p>
      <p>On purpose, even fast double clickers rarely get below about 100 ms between clicks. So if you clicked once and see a gap of 8 or 20 ms, that wasn’t you.</p>
    </div></section>

    <section className="home-section" id="results"><div className="home-container"><h2>What your double click test results mean</h2><div className="home-grid">
      <div className="home-card"><h3>No double clicks after 30 clicks</h3><p>The switch is fine. If you still get double clicks in Windows, check the double-click speed and the <strong>ClickLock</strong> setting, and update the mouse software. Our <Link to="/blog/mouse-double-clicking">mouse double clicking fix guide</Link> covers those settings.</p></div>
      <div className="home-card"><h3>A few double clicks, gaps of 5–50 ms</h3><p>Classic worn or dirty switch. It usually gets worse over weeks. Try the cleaning steps below. If you’re still under warranty, this is a known fault, so claim it.</p></div>
      <div className="home-card"><h3>Double clicks only when you hold and release</h3><p>The switch bounces on release. You’ll notice it as dropped drags and text selections that stop halfway. Same fix as above.</p></div>
      <div className="home-card"><h3>Gaps between 60 and 100 ms</h3><p>Borderline. You may just be clicking fast. Click slower and test again. If they keep showing up on slow clicks, treat it as a failing switch.</p></div>
    </div></div></section>

    <section className="home-section home-section-alt" id="fix-double-clicking"><div className="home-container"><h2>Mouse failed the test? What to do next</h2>
      <ol className="home-steps">
        <li><h3>Try it on another computer</h3><p>If it double clicks there too, it’s the mouse. If it’s clean on the other computer, look at drivers, mouse software and settings on yours.</p></li>
        <li><h3>Blow out the switch</h3><p>Unplug the mouse, press and hold the faulty button, and give it short blasts of compressed air around the edge of the button. Click it fast 50 to 100 times. Dust is a common cause and this sometimes fixes it for months.</p></li>
        <li><h3>Check warranty first</h3><p>Many mice come with two years or more of warranty, and double clicking is a known fault on several models. Contact the maker before opening anything up.</p></li>
        <li><h3>Replace the switch or the mouse</h3><p>If you’re comfortable with a soldering iron, the switch is a cheap part. Otherwise a new mouse is the reliable fix. For step-by-step settings and cleaning, read our <Link to="/blog/mouse-double-clicking">guide to fixing a mouse that double clicks</Link>.</p></li>
      </ol>
      <p>Setting up the rest of your desk? Check your mic with the <Link to="/#microphone-test">online microphone test</Link>, your audio with the <Link to="/speaker-test">speaker and headphone test</Link>, and your camera with the <Link to="/webcam-test">webcam test</Link>.</p>
    </div></section>

    <section className="home-section" id="dc-faq"><div className="home-container"><h2>Mouse double click test questions</h2>{questions.map(([q, a]) => <details className="home-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}<p>Still unsure? <Link to="/contact">Contact us</Link> with your mouse model and what the test showed.</p></div></section>
  </div>;
}
