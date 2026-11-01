import { Link } from 'react-router-dom';
import { Camera, Video, Mic, Square, Download, RotateCcw, FlipHorizontal, ShieldCheck, Check, Monitor, Gauge, Image } from 'lucide-react';
import { useState } from 'react';
import useWebcamTest, { CLIP_SECONDS } from '../hooks/useWebcamTest';
import '../styles/home.css';
import '../styles/webcam-test.css';

const steps = [
  ['Connect and choose your webcam', 'Plug in a USB webcam or use your laptop’s built-in camera. If you have more than one camera or microphone, choose it from the lists — names appear after you allow access once.'],
  ['Start the webcam and mic test', 'Press Start webcam test and allow both camera and microphone access in the browser prompt. Your live video appears in the preview, mirrored like a mirror by default.'],
  ['Check picture, resolution and frame rate', 'Look at sharpness, colour and lighting. The overlay shows the resolution and frame rate your browser receives from the camera, for example 1280×720 at 30 fps.'],
  ['Speak and watch the microphone meter', 'Talk at a normal volume. The green bar should move with your voice. If it stays flat, the wrong microphone is selected or the mic is muted.'],
  ['Record a 10-second clip and play it back', 'Record a short clip with sound and watch it back. This is the best way to check that video and audio work together, exactly as others would see and hear you on a call.'],
];

const checks = [
  { icon: Video, title: 'Live camera preview', text: 'Confirms that the browser can open your webcam and shows a real-time picture so you can check framing, focus, lighting and colour.' },
  { icon: Monitor, title: 'Resolution and frame rate', text: 'Shows the video resolution and frames per second reported by the camera track, such as 640×480, 1280×720 (HD) or 1920×1080 (Full HD).' },
  { icon: Mic, title: 'Webcam microphone level', text: 'A live input meter shows whether your webcam mic, headset or USB microphone is picking up your voice while the camera runs.' },
  { icon: Video, title: 'Video and audio recording', text: `Record a ${CLIP_SECONDS}-second clip with sound, play it back and download it to confirm that picture and audio stay in sync.` },
  { icon: Image, title: 'Snapshot', text: 'Take a still photo from the camera at full resolution to inspect sharpness or save it to your device.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Video and audio stay in your browser. The webcam test does not upload, store or share your camera feed or recordings.' },
];

const fixes = [
  ['The browser blocked the camera', 'Click the camera icon beside the address bar and allow camera and microphone access, then reload the page. On Windows, also check Settings → Privacy & security → Camera; on Mac, System Settings → Privacy & Security → Camera.'],
  ['Another app is using the webcam', 'Most webcams work in only one app at a time. Close Zoom, Microsoft Teams, Skype, OBS, Discord or another browser tab using the camera, then start the test again.'],
  ['Black screen or no picture', 'Check for a physical privacy shutter or a camera on/off key on your keyboard. Unplug and reconnect a USB webcam, try another USB port, and make sure the correct camera is selected.'],
  ['The picture is dark, blurry or grainy', 'Face a window or lamp so light falls on your face, clean the lens, and avoid a bright window behind you. Low light forces the camera to lower its frame rate and add noise.'],
  ['The microphone meter does not move', 'Choose the right microphone from the list. A webcam mic, headset mic and laptop mic are separate inputs. Check mute switches and your system input volume.'],
  ['The camera does not appear in the list', 'Reconnect the camera, then reload this page. In Windows Device Manager or Mac System Information, check that the camera is detected. Update the camera driver if needed.'],
];

const devices = [
  ['Windows 10 and 11', 'Open Settings → Privacy & security → Camera and turn on camera access for desktop apps and your browser. The Windows Camera app is a quick second check if the browser cannot open the webcam.'],
  ['Mac', 'Allow your browser in System Settings → Privacy & Security → Camera and Microphone. Quit and reopen the browser after changing the permission.'],
  ['Chromebook', 'Allow camera and microphone for this site from the address bar. If an external webcam is not listed, reconnect it and check the Camera app.'],
  ['Android, iPhone and iPad', 'Use a current browser and allow camera and microphone access when prompted. Phones usually offer the front and back cameras as separate choices in the camera list.'],
];

const faqs = [
  ['How do I test my webcam and microphone at the same time?', 'Press Start webcam test and allow camera and microphone access. The preview shows your webcam and the meter shows your microphone level together. Record a 10-second clip and play it back to hear and see both.'],
  ['Is this webcam test free and private?', 'Yes. The test is free, needs no sign-up or download, and runs entirely in your browser. Your camera feed and recordings are not uploaded to any server.'],
  ['How do I test my webcam microphone?', 'Start the test and choose your webcam’s microphone in the microphone list — it usually carries the camera’s name. Speak and watch the meter, then record a clip to hear how it sounds.'],
  ['What resolution is my webcam?', 'After the camera starts, the overlay shows the resolution and frame rate your browser receives, such as 1280×720 at 30 fps. The tester asks for up to 1920×1080; your camera, cable and browser decide the final value.'],
  ['Why does my webcam image look mirrored?', 'Previews are mirrored by default so movement feels natural, like a mirror. Other people on a call usually see you un-mirrored. Use the Mirror button to switch views.'],
  ['Why does my webcam work here but not in Zoom or Teams?', 'Each app has its own camera and microphone selection. Open the app’s video and audio settings and select the same devices you tested here, and close other apps that may be holding the camera.'],
  ['Can I test an external USB webcam or a phone camera?', 'Yes. Any camera your operating system exposes to the browser appears in the camera list, including USB webcams, built-in laptop cameras, capture cards and phone front or back cameras.'],
];

export default function WebcamTest() {
  const cam = useWebcamTest();
  const [mirrored, setMirrored] = useState(true);
  const live = cam.state === 'live' || cam.state === 'recording';
  const recording = cam.state === 'recording';
  const fill = Math.min(100, Math.round(Math.sqrt(cam.level / 100) * 100));

  return <div className="mic-home webcam-page">
    <section className="home-hero" aria-labelledby="webcam-title"><div className="home-container webcam-hero">
      <div className="webcam-intro">
        <nav className="speaker-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>Webcam and Microphone Test</span></nav>
        <span className="home-eyebrow">Free online webcam &amp; mic test</span>
        <h1 id="webcam-title">Webcam and Microphone Test</h1>
        <p className="home-lead">Test your webcam and microphone online in one step. See your live camera, check resolution and frame rate, watch your mic level, and record a short clip with sound. No download or sign-up.</p>
        <ul className="home-trust"><li><Check size={16} aria-hidden="true" />Camera + mic together</li><li><ShieldCheck size={16} aria-hidden="true" />Nothing is uploaded</li><li><Gauge size={16} aria-hidden="true" />Resolution &amp; FPS</li></ul>
      </div>

      <div className="home-tool webcam-tool" id="webcam-test" aria-labelledby="webcam-tool-title">
        <h2 id="webcam-tool-title">Test your webcam and mic</h2>
        <div className="webcam-stage">
          <video ref={cam.videoRef} className={`webcam-video ${mirrored ? 'is-mirrored' : ''}`} autoPlay playsInline muted hidden={!live} aria-label="Live webcam preview" />
          {!live && <div className="webcam-placeholder"><span className="home-placeholder-icon"><Camera size={28} aria-hidden="true" /></span><span>{cam.state === 'starting' ? 'Waiting for camera and microphone access…' : 'Press start to see your camera. Access is requested only after you click.'}</span></div>}
          {live && cam.info?.width && <span className="webcam-badge webcam-badge--res">{cam.info.width}×{cam.info.height}{cam.info.frameRate ? ` · ${cam.info.frameRate} fps` : ''}</span>}
          {recording && <span className="webcam-badge webcam-badge--rec" role="status">REC · {cam.countdown}s</span>}
        </div>

        {live && <div className="webcam-mic">
          <Mic size={16} aria-hidden="true" />
          <div className="viz-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={cam.level} aria-label="Microphone input level"><span style={{ width: `${fill}%`, '--meter-track': `${fill ? 10000 / fill : 100}%` }} /></div>
          <strong>{cam.info?.mic ? `${cam.level}%` : 'No mic'}</strong>
        </div>}

        {cam.error && <p className="home-error" role="alert">{cam.error}</p>}
        {cam.notice && <p className="home-note webcam-notice" role="status">{cam.notice}</p>}

        {!live && <button type="button" className="home-button home-primary-start" onClick={cam.start} disabled={cam.state === 'starting'}><Camera size={18} aria-hidden="true" />{cam.state === 'starting' ? 'Starting camera…' : 'Start webcam test'}</button>}
        {live && <div className="home-controls">
          {recording ? <button type="button" className="home-button home-button-stop" onClick={cam.stopClip}><Square size={16} aria-hidden="true" />Stop clip</button>
            : <button type="button" className="home-button" onClick={cam.recordClip}><Video size={17} aria-hidden="true" />Record {CLIP_SECONDS}s clip</button>}
          <button type="button" className="home-button home-button-secondary" onClick={cam.takeSnapshot} disabled={recording}><Camera size={17} aria-hidden="true" />Snapshot</button>
          <button type="button" className="home-button home-button-secondary" onClick={() => setMirrored(value => !value)} aria-pressed={mirrored}><FlipHorizontal size={17} aria-hidden="true" />Mirror</button>
          <button type="button" className="home-button home-button-secondary" onClick={cam.stop}>Stop camera</button>
        </div>}

        <div className="webcam-selects">
          <div><label htmlFor="camera-input">Camera</label><select id="camera-input" value={cam.selectedCamera} onChange={event => cam.chooseCamera(event.target.value)} disabled={recording || cam.state === 'starting'}><option value="">Default camera</option>{cam.cameras.map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>)}</select></div>
          <div><label htmlFor="webcam-mic-input">Microphone</label><select id="webcam-mic-input" value={cam.selectedMic} onChange={event => cam.chooseMic(event.target.value)} disabled={recording || cam.state === 'starting'}><option value="">Default microphone</option>{cam.mics.map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>)}</select></div>
        </div>

        {live && cam.info && <div className="home-device-info"><span>Camera: {cam.info.camera}</span>{cam.info.mic && <span>Mic: {cam.info.mic}</span>}</div>}

        {cam.clip && <div className="webcam-result">
          <label htmlFor="webcam-playback">Watch your test clip</label>
          <video id="webcam-playback" src={cam.clip.url} controls playsInline preload="metadata" />
          <a className="home-button home-button-secondary" href={cam.clip.url} download={`webcam-test.${cam.clip.extension}`}><Download size={16} aria-hidden="true" />Download clip (.{cam.clip.extension})</a>
        </div>}
        {cam.snapshot && <div className="webcam-result">
          <p className="webcam-result__label">Snapshot</p>
          <img src={cam.snapshot} alt="Snapshot from your webcam" />
          <div className="home-controls"><a className="home-button home-button-secondary" href={cam.snapshot} download="webcam-snapshot.png"><Download size={16} aria-hidden="true" />Download PNG</a><button type="button" className="home-button home-button-secondary" onClick={cam.clearSnapshot}><RotateCcw size={16} aria-hidden="true" />Discard</button></div>
        </div>}

        <p className="home-note">Video and audio are processed in your browser and never uploaded. <Link to="/privacy">Privacy policy</Link>.</p>
        <noscript><p className="home-error">JavaScript is required to open your camera and microphone. The guide below remains readable without it.</p></noscript>
      </div>
    </div></section>

    <nav className="home-container home-jump-links" aria-label="Webcam test guide"><a href="#how-to-test-webcam">How to test</a><a href="#webcam-checks">What it checks</a><a href="#webcam-not-working">Webcam not working</a><a href="#webcam-mic-test">Webcam mic test</a><a href="#webcam-faq">Questions</a></nav>

    <section className="home-section" id="how-to-test-webcam"><div className="home-container">
      <div className="home-section-intro"><h2>How to test your webcam and microphone online</h2><p>A webcam and mic test takes about 30 seconds. Use the same camera, microphone and lighting you plan to use on your next call so the result reflects real conditions.</p></div><figure className="home-figure"><img src="/images/webcam-test/camera-mic-check.svg" alt="How to test your webcam and microphone online: allow camera and mic access, check the live picture, then speak and watch the mic level" width="1200" height="675" loading="lazy" decoding="async" /><figcaption>Allow access, check the picture, then speak and watch the mic level.</figcaption></figure>
      <ol className="home-steps">{steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
      <a className="home-button" href="#webcam-test"><Camera size={18} aria-hidden="true" />Start the webcam test</a>
    </div></section>

    <section className="home-section home-section-alt" id="webcam-checks"><div className="home-container">
      <div className="home-section-intro"><h2>What this webcam and mic test checks</h2><p>One page answers the two questions that matter before a video call: can people see me, and can they hear me?</p></div>
      <div className="home-grid home-grid-three">{checks.map(({ icon: Icon, title, text }) => <div className="home-card" key={title}><Icon className="home-card-icon" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div>
      <p className="home-note home-more">Limits: resolution and frame rate are the values reported by the browser, not a certified camera benchmark. The microphone meter shows relative input, not calibrated decibels. Frame rate can drop in low light.</p>
    </div></section>

    <section className="home-section" id="webcam-not-working"><div className="home-container">
      <div className="home-section-intro"><h2>Webcam not working? Try these fixes</h2><p>Most webcam problems come from permissions, another app holding the camera, or the wrong device being selected — not a broken camera.</p></div>
      <div className="home-grid">{fixes.map(([title, text]) => <div className="home-card" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
    </div></section>

    <section className="home-section home-section-alt" id="webcam-mic-test"><div className="home-container home-columns">
      <div>
        <h2>Webcam mic test: is your camera’s microphone working?</h2>
        <p>Many webcams have a built-in microphone, but your computer may still use the laptop mic or a headset by default. To test the webcam microphone, start the test, open the microphone list and choose the entry with your webcam’s name, then speak and watch the meter.</p>
        <p>Record a short clip and play it back. A webcam mic is usually further from your mouth than a headset, so it picks up more room echo and keyboard noise. If you sound distant, move closer or switch to a headset.</p>
        <p>For a longer audio-only check with live monitoring and audio download, use the <Link to="/#microphone-test">online microphone test</Link>. To check that you can hear others, run the <Link to="/speaker-test">speaker and headphone test</Link>.</p>
      </div>
      <div>
        <h2>Test your webcam on any device</h2>
        <ul className="home-help-list">{devices.map(([title, text]) => <li key={title}><strong>{title}:</strong> {text}</li>)}</ul>
      </div>
    </div></section>

    <section className="home-section" id="webcam-privacy"><div className="home-container home-columns">
      <div>
        <h2>Your camera feed stays on your device</h2>
        <p>The webcam test uses standard browser APIs to show your camera and measure your microphone locally. No video, audio or snapshot is sent to our server. Camera access starts only when you press Start, and Stop camera turns the camera light off immediately.</p>
        <p>Clips and snapshots exist only in this tab until you download them. Closing or refreshing the page removes them.</p>
      </div>
      <div>
        <h2>Before your next video call</h2>
        <ul className="home-help-list"><li>Place the camera at eye level and sit about an arm’s length away.</li><li>Put the main light in front of you, not behind you.</li><li>Select the same camera and microphone inside Zoom, Teams, Google Meet or Discord.</li><li>Use headphones to stop your speakers from echoing into the microphone.</li><li>Record a test clip and listen for clear speech before you join.</li></ul>
      </div>
    </div></section>

    <section className="home-section home-section-alt" id="webcam-faq"><div className="home-container">
      <div className="home-section-intro"><h2>Webcam and mic test: frequently asked questions</h2></div>
      <div className="home-faq-list">{faqs.map(([q, a]) => <details className="home-faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      <p className="home-more">More help: <Link to="/blog/microphone-not-working">microphone not working fixes</Link>, <Link to="/blog/how-to-test-your-microphone">how to test your microphone</Link>, <Link to="/blog/how-to-connect-set-up-microphone">set up a microphone on PC or Mac</Link>, or the <Link to="/faq">troubleshooting FAQ</Link>.</p>
    </div></section>

    <section className="home-section"><div className="home-container"><div className="home-bottom">
      <h2>Check your camera and mic before you go live</h2>
      <p>Run the free webcam and microphone test, record a short clip, and join your next call knowing people can see and hear you.</p>
      <a className="home-button" href="#webcam-test"><Camera size={18} aria-hidden="true" />Back to webcam test</a>
    </div></div></section>
  </div>;
}
