import { Link } from 'react-router-dom';
import { Speaker, Square, User } from 'lucide-react';
import useSurroundTest from '../hooks/useSurroundTest';
import '../styles/home.css';
import '../styles/speaker-test.css';
import '../styles/surround-test.css';

// Where each speaker sits in the little room diagram (left %, top %).
const positions = {
  '5.1': { fl: [16, 16], c: [50, 13], fr: [84, 16], lfe: [68, 33], sl: [14, 84], sr: [86, 84] },
  '7.1': { fl: [16, 16], c: [50, 13], fr: [84, 16], lfe: [68, 33], sl: [8, 55], sr: [92, 55], rl: [27, 90], rr: [73, 90] },
};

const questions = [
  ['Why do I only hear the front speakers?', 'Almost always because the output device is set to stereo. In Windows, open Control Panel > Sound, select your speakers or receiver, click Configure and choose 5.1 or 7.1. On a Mac, use Audio MIDI Setup > Configure Speakers. Then reload this page and test again.'],
  ['Can I run a 7.1 surround sound test on headphones?', 'Normal stereo headphones have two drivers, so there is nothing to send the extra channels to. Virtual surround (Windows Sonic, Dolby Atmos for Headphones, DTS Headphone:X or a headset app) fakes the positions with processing. Whether the browser can feed it six or eight channels depends on that software. If the page says it found only 2 channels, you are hearing a downmix.'],
  ['Why is the subwoofer tone so quiet?', 'The LFE test is a 60 Hz tone, and small speakers or laptop speakers can barely play it. With a real subwoofer, check that it is switched on, its own volume knob is up, and the receiver has the subwoofer set to Yes. Some receivers also send bass from small speakers to the sub, so you may hear it during other channels too.'],
  ['The rear and side channels are swapped. Is my system broken?', 'Not necessarily. Windows and most receivers put the rear pair before the side pair in 7.1, which is the order this test uses, but some devices and drivers use a different order. Check the speaker wiring and the receiver setup first, then compare with a known 7.1 test file or game.'],
  ['Does this work on a phone or TV browser?', 'Phones play stereo at most, so you will only hear the front pair. A TV browser or streaming stick usually outputs stereo too. A Windows or Mac computer connected to an AV receiver over HDMI is the most reliable way to test real surround.'],
  ['Is anything recorded or uploaded?', 'No. The tones are generated in your browser and the page never asks for microphone access. Nothing about your speakers is sent anywhere.'],
];

export default function SurroundSoundTest() {
  const audio = useSurroundTest();
  const busy = audio.state !== 'idle';
  const current = audio.channels[audio.active];
  const place = positions[audio.layout];
  return <div className="mic-home speaker-page surround-page">
    <section className="home-hero"><div className="home-container home-hero-grid">
      <div><nav className="speaker-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>Surround Sound Test</span></nav><span className="home-eyebrow">5.1 and 7.1 speaker check</span><h1>Surround Sound Test (5.1 &amp; 7.1)</h1><p className="home-lead">Play a tone through each speaker on its own: front left and right, center, subwoofer, surround and rear. Find out in a minute if every channel is wired and set up right.</p><p>Runs in your browser. No download, no sign-up and no microphone.</p></div>
      <div className="home-tool" id="surround-test" aria-labelledby="surround-tool-title">
        <Speaker aria-hidden="true" className="home-card-icon"/><h2 id="surround-tool-title">Test each surround channel</h2>
        <div className="surround-layout-switch" role="group" aria-label="Speaker layout">
          {Object.keys(positions).map(name => <button key={name} type="button" className={audio.layout === name ? 'is-selected' : ''} aria-pressed={audio.layout === name} onClick={() => audio.setLayout(name)}>{name} surround</button>)}
        </div>
        <p className="speaker-volume-note">Turn the volume down before you start. The subwoofer tone is low and can be loud on a big system.</p>
        <label htmlFor="speaker-volume">Test signal level: {audio.volume}%</label><input id="speaker-volume" type="range" min="0" max="20" step="1" value={audio.volume} onChange={event => audio.setVolume(Number(event.target.value))}/>
        <div className="surround-room" aria-hidden="true">
          <span className="surround-screen"/>
          {audio.channels.map((channel, index) => <span key={channel.id} className={`surround-spk${audio.active === index ? ' is-playing' : ''}${channel.id === 'lfe' ? ' is-lfe' : ''}`} style={{ left: `${place[channel.id][0]}%`, top: `${place[channel.id][1]}%` }}>{channel.short}</span>)}
          <span className="surround-listener"><User size={22}/></span>
        </div>
        <div className="surround-controls">
          {audio.channels.map((channel, index) => <button key={channel.id} className="home-button home-button-secondary" onClick={() => audio.play(index)} disabled={busy}>{channel.label}</button>)}
        </div>
        <button className="home-button surround-all" onClick={() => audio.play('sequence')} disabled={busy}>Play all channels in order</button>
        <p role="status" aria-live="polite" className="home-status">{current ? `${current.label}. ${audio.message}` : audio.message}</p>
        <button className="home-button home-button-stop" onClick={audio.stop} disabled={!busy}><Square size={16} aria-hidden="true"/>Stop sound</button>
        {audio.error && <p className="home-error" role="alert">{audio.error}</p>}
        {audio.outputChannels !== null && <p className={`home-note surround-channels${audio.outputChannels < audio.channels.length ? ' is-low' : ''}`}>Output channels your browser can use: <strong>{audio.outputChannels}</strong>{audio.outputChannels < audio.channels.length ? ` (needs ${audio.channels.length} for ${audio.layout})` : ''}</p>}
        <p className="home-note speaker-output-note">Each channel plays for 2 seconds. The full {audio.layout} run takes {audio.channels.length * 2} seconds. Sound goes to your computer’s current output device.</p>
        <noscript><p className="home-error">Enable JavaScript to generate the test tones. The setup steps below still work without it.</p></noscript>
      </div>
    </div></section>

    <nav className="home-container home-jump-links" aria-label="Surround sound test guide"><a href="#how-to-test-surround-sound">How to test</a><a href="#multichannel-setup">Set up 5.1 / 7.1</a><a href="#surround-results">Results</a><a href="#surround-faq">Questions</a></nav>

    <section className="home-section" id="how-to-test-surround-sound"><div className="home-container"><h2>How to test surround sound</h2>
      <figure className="home-figure"><img src="/images/surround-sound-test/speaker-layout.svg" alt="5.1 and 7.1 surround sound speaker layout: front left, center, front right, subwoofer, side and rear speakers around the listener" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>Where each channel should come from in a 5.1 and a 7.1 setup.</figcaption></figure>
      <ol className="home-steps">
        <li><h3>Set your output to 5.1 or 7.1 first</h3><p>This is the step people miss. If Windows or macOS thinks you have stereo speakers, the browser only gets two channels and the test can’t reach the rest. The <a href="#multichannel-setup">setup steps below</a> take about a minute.</p></li>
        <li><h3>Pick your layout and turn the volume down</h3><p>Choose <strong>5.1 surround</strong> or <strong>7.1 surround</strong> above to match your system. Start low. You can always turn it up, and a 60 Hz subwoofer tone at full volume is not fun.</p></li>
        <li><h3>Play each speaker on its own</h3><p>Press a channel button and listen. Only that one speaker should play, and the matching circle in the diagram lights up. Sit in your normal spot, because from the couch it’s much easier to tell a side speaker from a rear one.</p></li>
        <li><h3>Run the full sequence</h3><p><strong>Play all channels in order</strong> goes front left, front right, center, subwoofer, then the surrounds. It’s the quickest way to hear if the sound moves around the room the way it should.</p></li>
        <li><h3>Check the channel count under the tool</h3><p>After the first tone, the tool shows how many output channels your browser can use. You need 6 for 5.1 and 8 for 7.1. If it says 2, the surround channels are being mixed into the front speakers, and the fix is in your system settings, not your speakers.</p></li>
      </ol><a href="#surround-test">Back to the surround test</a></div></section>

    <section className="home-section home-section-alt" id="multichannel-setup"><div className="home-container"><h2>Your output device must support multichannel audio</h2>
      <p>A surround sound test only works if every link in the chain carries 6 or 8 channels: the browser, the operating system, the cable and the receiver or speakers. Stereo anywhere along the way and you get two channels out the other end.</p>
      <div className="home-grid">
        <div className="home-card"><h3>Windows 11 and 10</h3><p>Open <strong>Control Panel &gt; Hardware and Sound &gt; Sound</strong> (or search “mmsys.cpl”). On the <strong>Playback</strong> tab, select your receiver, HDMI output or sound card, click <strong>Configure</strong>, pick <strong>5.1 Surround</strong> or <strong>7.1 Surround</strong> and finish the wizard. If those options aren’t listed, the device or driver only offers stereo. Then reload this page.</p></div>
        <div className="home-card"><h3>Mac</h3><p>Open <strong>Audio MIDI Setup</strong> (in Applications &gt; Utilities), select your HDMI or USB audio device, click <strong>Configure Speakers</strong>, choose <strong>Multichannel</strong> and pick 5.1 or 7.1. Assign each speaker to the right channel if it asks.</p></div>
        <div className="home-card"><h3>HDMI to an AV receiver</h3><p>HDMI carries 8 channels of normal audio, so a PC to receiver connection is the best way to test real surround. Optical (S/PDIF) can’t carry 6 or 8 uncompressed channels, so over optical you’ll only get stereo here.</p></div>
        <div className="home-card"><h3>Headsets and virtual surround</h3><p>A “7.1 gaming headset” usually has two drivers and uses software to fake the positions. The test still plays, but you’re hearing processing, not separate speakers. If the tool reports 2 channels, the headset app isn’t taking multichannel input from the browser.</p></div>
      </div>
      <p>Chrome, Edge and Firefox on Windows and Mac can all output more than two channels when the system is set up for it. Phones and most TV browsers play stereo only.</p>
    </div></section>

    <section className="home-section" id="surround-results"><div className="home-container"><h2>What your surround sound test results mean</h2><div className="home-grid">
      <div className="home-card"><h3>Every tone comes from the right speaker</h3><p>Your wiring, receiver and system settings agree with each other. If movies still sound flat, check the audio setting inside the app or game, since many default to stereo.</p></div>
      <div className="home-card"><h3>Surround channels play from the front</h3><p>The system is set to stereo, or the connection is optical. Set 5.1 or 7.1 in your sound settings and use HDMI where you can.</p></div>
      <div className="home-card"><h3>Left and right, or side and rear, are swapped</h3><p>Check the speaker wires at the receiver and in your speaker setup. Some drivers order the 7.1 rear and side pairs differently, so compare with the receiver’s own test tones.</p></div>
      <div className="home-card"><h3>One speaker is silent</h3><p>Check its wire, that it’s enabled in the receiver’s speaker setup, and its level. A powered subwoofer needs its own power and volume turned up.</p></div>
    </div></div></section>

    <section className="home-section home-section-alt"><div className="home-container"><h2>What this test can’t tell you</h2><p>The tool sends a 440 Hz tone (60 Hz for the subwoofer) to one channel at a time. It checks routing: is each channel reaching the right speaker? It doesn’t measure frequency response, speaker distance, delay or room acoustics, and it can’t hear the result for you. For calibration, use your receiver’s auto setup with its microphone.</p><p>Only have a pair of speakers or headphones? The <Link to="/speaker-test">speaker and headphone test</Link> checks left and right on their own. Testing a headset? Check its mic too with the <Link to="/#microphone-test">online microphone test</Link>. And if there’s no sound at all, our guide to <Link to="/blog/headphones-not-working">headphones not working on PC</Link> goes through output devices and drivers step by step.</p></div></section>

    <section className="home-section" id="surround-faq"><div className="home-container"><h2>Surround sound test questions</h2>{questions.map(([q, a]) => <details className="home-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}<p>Still stuck? <Link to="/contact">Contact us</Link> with your browser, operating system and the channel count the tool showed.</p></div></section>
  </div>;
}
