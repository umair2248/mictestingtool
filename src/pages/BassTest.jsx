import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AudioWaveform, Square, TriangleAlert } from 'lucide-react';
import useBassTest from '../hooks/useBassTest';
import { BASS_MAX, BASS_MIN, BASS_TONES, MAX_LEVEL, describeMark, describeRange } from '../utils/bassSignal';
import '../styles/home.css';
import '../styles/speaker-test.css';
import '../styles/bass-test.css';

const questions = [
  ['What is a good bass test frequency for a subwoofer?', 'Start at 40-60 Hz. Almost every subwoofer plays that range cleanly, so it tells you the sub is on and wired. Then go lower with 30 and 25 Hz to see where yours gives up, and try 80-120 Hz to check how it blends with your main speakers around the crossover.'],
  ['Why can’t I hear 20 Hz?', 'That’s normal. 20 Hz sits at the bottom edge of human hearing, and most home subwoofers drop off somewhere between 25 and 35 Hz. Laptop and phone speakers usually can’t go below 100-150 Hz at all. If you feel pressure or see the cone move without hearing a note, that counts as working.'],
  ['My subwoofer is silent during the test. What should I check?', 'Check it has power and its own volume knob is up, then the cable from the receiver’s SUB or LFE out. In the receiver, the subwoofer must be set to Yes and your main speakers set to Small, or the bass stays in them. On a PC, a 2.1 system usually handles this itself; a 5.1 system may need the subwoofer channel test in the surround test.'],
  ['Something buzzes or rattles at certain frequencies. Is that my speaker?', 'Often it’s the room, not the speaker. Windows, picture frames, shelves and loose panels all vibrate at their own frequency. Play the tone that causes it, walk around and touch things until it stops. If the buzz comes from the speaker itself even at low volume, the cone or surround may be damaged.'],
  ['Can a bass test damage my speakers?', 'At sensible volume, no. Damage comes from playing very low tones loudly through speakers that can’t reproduce them, because the cone moves further than it’s built for. That’s why this tool caps the signal at 30% and starts at 10%. If you hear distortion, a flapping sound or a hard knock, turn it down right away.'],
  ['Does this work with headphones?', 'Yes, and it’s a good way to see how deep a pair goes. Keep the volume low, since sine tones feel quieter than they are and low notes can mislead you about how loud the overall level is.'],
];

export default function BassTest() {
  const audio = useBassTest();
  const [custom, setCustom] = useState(45);
  const busy = audio.state !== 'idle';
  const sweeping = audio.mode?.startsWith('sweep');
  const shown = audio.frequency ?? audio.marked?.hz;
  const progress = audio.frequency ? Math.log(audio.frequency / 20) / Math.log(10) * 100 : 0;
  return <div className="mic-home speaker-page bass-page">
    <section className="home-hero"><div className="home-container home-hero-grid">
      <div><nav className="speaker-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>Bass Test</span></nav><span className="home-eyebrow">Subwoofer and low-frequency check</span><h1>Bass Test: Subwoofer Frequency Sweep (20-200 Hz)</h1><p className="home-lead">Play single bass tones or a slow sweep from 20 to 200 Hz. Find the lowest note your subwoofer, speakers or headphones can really play, and catch rattles before a movie does.</p><p>Runs in your browser. No download, no sign-up and no microphone.</p></div>
      <div className="home-tool" id="bass-test" aria-labelledby="bass-tool-title">
        <AudioWaveform aria-hidden="true" className="home-card-icon"/><h2 id="bass-tool-title">Bass and subwoofer test</h2>
        <div className="bass-warning" role="note"><TriangleAlert size={20} aria-hidden="true"/><p><strong>Turn your volume down first.</strong> Low tones can sound quiet but move a lot of air. Loud sub-bass can damage small speakers and is tiring on your ears. Start low and raise it slowly.</p></div>
        <label htmlFor="speaker-volume">Test signal level: {audio.volume}% <span className="bass-cap">(max {MAX_LEVEL}%)</span></label>
        <input id="speaker-volume" type="range" min="0" max={MAX_LEVEL} step="1" value={audio.volume} onChange={event => audio.setVolume(Number(event.target.value))}/>
        <div className={`bass-readout${busy ? ' is-playing' : ''}`} aria-hidden="true"><span className="bass-hz">{shown ? Math.round(shown) : '--'}</span><span className="bass-unit">Hz</span></div>
        {sweeping && <div className="bass-progress" aria-hidden="true"><span style={{ width: `${progress}%` }}/></div>}
        <p className="home-note bass-range">{shown ? describeRange(shown) : 'Pick a tone below or run a sweep.'}</p>
        <div className="bass-tones" role="group" aria-label="Bass test tones">
          {BASS_TONES.map(hz => <button key={hz} type="button" className={`home-button home-button-secondary${audio.mode === 'tone' && audio.frequency === hz ? ' is-selected' : ''}`} onClick={() => audio.playTone(hz)} disabled={sweeping || audio.state === 'starting'}>{hz} Hz</button>)}
        </div>
        <div className="bass-custom">
          <label htmlFor="bass-custom">Any frequency: {custom} Hz</label>
          <input id="bass-custom" type="range" min={BASS_MIN} max={BASS_MAX} step="1" value={custom} onChange={event => { const hz = Number(event.target.value); setCustom(hz); if (audio.mode === 'tone') audio.playTone(hz); }}/>
          <button type="button" className="home-button home-button-secondary" onClick={() => audio.playTone(custom)} disabled={sweeping || audio.state === 'starting'}>Play {custom} Hz</button>
        </div>
        <div className="bass-sweeps">
          <button type="button" className="home-button" onClick={() => audio.sweep('up')} disabled={busy}>Sweep up 20 → 200 Hz</button>
          <button type="button" className="home-button home-button-secondary" onClick={() => audio.sweep('down')} disabled={busy}>Sweep down 200 → 20 Hz</button>
        </div>
        {sweeping && <button type="button" className="home-button bass-mark" onClick={audio.mark}>{audio.mode === 'sweep-down' ? 'It’s gone' : 'I can hear it'}</button>}
        <p role="status" aria-live="polite" className="home-status">{audio.message}</p>
        <button className="home-button home-button-stop" onClick={audio.stop} disabled={!busy}><Square size={16} aria-hidden="true"/>Stop sound</button>
        {audio.error && <p className="home-error" role="alert">{audio.error}</p>}
        {audio.marked && <p className="home-note bass-result">{audio.marked.direction === 'up' ? 'Bass became audible at' : 'Bass faded out at'} <strong>{audio.marked.hz} Hz</strong>. {describeMark(audio.marked.hz)}</p>}
        <p className="home-note speaker-output-note">Single tones keep playing until you press Stop. The sweep takes 30 seconds. Sound goes to your device’s current output.</p>
        <noscript><p className="home-error">Enable JavaScript to generate the bass tones. The guide below still works without it.</p></noscript>
      </div>
    </div></section>

    <nav className="home-container home-jump-links" aria-label="Bass test guide"><a href="#how-to-run-a-bass-test">How to test</a><a href="#bass-frequency-chart">Frequency chart</a><a href="#subwoofer-setup">Subwoofer setup</a><a href="#bass-faq">Questions</a></nav>

    <section className="home-section" id="how-to-run-a-bass-test"><div className="home-container"><h2>How to run a bass test on your subwoofer</h2>
      <ol className="home-steps">
        <li><h3>Turn the volume down</h3><p>Set your system volume to about a quarter and leave the signal level here at 10%. A pure sine tone at 30 Hz can push a woofer much harder than music at the same volume, and you won’t always hear it coming.</p></li>
        <li><h3>Start at 50 Hz</h3><p>Press <strong>50 Hz</strong>. Almost any subwoofer plays this, so if you hear a steady hum the sub is powered, connected and getting signal. Silence here means a setup problem, not a frequency limit. Skip to the <a href="#subwoofer-setup">setup checks</a>.</p></li>
        <li><h3>Run the sweep up</h3><p>Press <strong>Sweep up 20 → 200 Hz</strong> and listen from your normal seat. The moment a clear note appears, press <strong>I can hear it</strong>. That number is roughly how low your system goes in your room.</p></li>
        <li><h3>Listen for rattles and dips</h3><p>Play the sweep again and pay attention to anything that buzzes, or spots where the bass suddenly gets much quieter or louder. Those are usually room effects. Click single tones near that frequency to pin it down.</p></li>
        <li><h3>Check the crossover</h3><p>Play 60, 80, 100 and 120 Hz. The bass should sound about even across them. A big jump or hole between the sub and your main speakers means the crossover or phase setting needs a tweak.</p></li>
      </ol><a href="#bass-test">Back to the bass test</a></div></section>

    <section className="home-section home-section-alt" id="bass-frequency-chart"><div className="home-container"><h2>Bass frequency chart: what each range should sound like</h2>
      <figure className="home-figure"><img src="/images/bass-test/frequency-ranges.svg" alt="Bass frequency chart from 20 to 200 Hz showing sub-bass, deep bass, bass and upper bass, and where laptops, bookshelf speakers and subwoofers usually reach" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>Where common speakers usually stop. Your room can shift these by a lot.</figcaption></figure>
      <div className="home-grid">
        <div className="home-card"><h3>20-40 Hz: sub-bass</h3><p>Felt more than heard. Explosions, organ pedals, deep synth notes. Only real subwoofers get here, and even then the bottom 5-10 Hz often fades out.</p></div>
        <div className="home-card"><h3>40-60 Hz: deep bass</h3><p>Kick drums, bass guitar low notes and most movie rumble. This is the range people mean when they say a sub “hits”.</p></div>
        <div className="home-card"><h3>60-120 Hz: bass</h3><p>Warmth and punch. Bookshelf speakers usually start somewhere in here, and the usual crossover to a subwoofer is 80 Hz.</p></div>
        <div className="home-card"><h3>120-200 Hz: upper bass</h3><p>Where laptop and phone speakers begin. If you only hear the sweep after 150 Hz, the bass you hear in music on that device is mostly an illusion your brain fills in.</p></div>
      </div>
    </div></section>

    <section className="home-section" id="subwoofer-setup"><div className="home-container"><h2>No bass, weak bass or boomy bass? Check these</h2><div className="home-grid">
      <div className="home-card"><h3>Sub is silent</h3><p>Power switch and auto-standby first. Then the LFE cable, the sub’s own volume knob, and the receiver’s speaker setup: subwoofer set to <strong>Yes</strong>. On a 5.1 PC setup, run the <Link to="/surround-sound-test">surround sound test</Link> and check the subwoofer channel on its own.</p></div>
      <div className="home-card"><h3>Bass is thin</h3><p>Set the main speakers to <strong>Small</strong> in the receiver so bass gets sent to the sub. Try the crossover at 80 Hz. On Windows, turn off “Bass Boost” or other enhancements and test again so you hear what the hardware really does.</p></div>
      <div className="home-card"><h3>One note booms</h3><p>Room modes. Your room boosts some frequencies and cancels others. Moving the sub even half a meter, or out of a corner, changes it more than any setting will.</p></div>
      <div className="home-card"><h3>Gap around 80-100 Hz</h3><p>Flip the sub’s phase switch (0° / 180°) and play 80 Hz from your seat. Keep whichever setting sounds louder. Then nudge the crossover up or down.</p></div>
    </div></div></section>

    <section className="home-section home-section-alt"><div className="home-container"><h2>What this bass test can’t tell you</h2><p>The tool plays clean sine waves from 20 to 200 Hz in your browser. It helps you hear where your bass starts, where it fades and where the room gets in the way. It isn’t a measurement. Your ears are less sensitive to low notes, so 30 Hz needs much more energy than 100 Hz to sound equally loud, and the browser can’t tell what reached your seat. For a real frequency response graph you need a measurement microphone and room software.</p><p>Checking the rest of your system? The <Link to="/speaker-test">speaker and headphone test</Link> checks left and right, and the <Link to="/surround-sound-test">surround sound test</Link> plays each 5.1 or 7.1 channel. If there’s no sound at all, see <Link to="/blog/headphones-not-working">headphones not working on PC</Link>.</p></div></section>

    <section className="home-section" id="bass-faq"><div className="home-container"><h2>Bass and subwoofer test questions</h2>{questions.map(([q, a]) => <details className="home-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}<p>Still stuck? <Link to="/contact">Contact us</Link> with your speakers or subwoofer model and the frequency where the bass dropped out.</p></div></section>
  </div>;
}
