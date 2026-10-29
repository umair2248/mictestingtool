import { Link } from 'react-router-dom';
import { Mic, Download, Headphones, RotateCcw } from 'lucide-react';
import useMicrophoneTest from '../hooks/useMicrophoneTest';
import AudioVisualizer from './AudioVisualizer';
import { englishTool } from '../data/locales';

const waveHeights = ['30%', '55%', '80%', '45%', '100%', '65%', '35%', '75%', '50%', '90%', '40%', '60%', '30%'];

export default function MicrophoneTool({ text = englishTool }) {
  const mic = useMicrophoneTest(text);
  const recording = mic.testState === 'testing';
  const busy = ['starting', 'stopping'].includes(mic.testState);
  const preview = mic.testState === 'preview';
  const status = recording ? `${text.testing} · ${mic.elapsedLabel}` : text[mic.testState];
  return <div className="home-tool" id="microphone-test" aria-labelledby="tool-title">
    <h2 id="tool-title">{text.title}</h2>
    <label htmlFor="microphone-input">{text.input}</label>
    <select id="microphone-input" value={mic.selectedMic} onChange={event => mic.setSelectedMic(event.target.value)} disabled={recording || busy}>
      <option value="">{text.defaultInput}</option>
      {mic.devices.filter(device => device.deviceId).map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `${text.mic} ${index + 1}`}</option>)}
    </select>
    <p className={`home-status ${recording ? 'home-recording' : ''}`} role="status" aria-live={recording ? 'off' : 'polite'}>{status}</p>
    {mic.audioError && <p className="home-error" role="alert">{mic.audioError}</p>}
    {recording ? <AudioVisualizer analyserRef={mic.analyserRef} active={recording} sampleRate={mic.audioInfo.sampleRate} text={text} /> : <div className="home-placeholder"><span className="home-placeholder-icon"><Mic size={28} aria-hidden="true" /></span><span className="home-wave" aria-hidden="true">{waveHeights.map((height, index) => <i key={index} style={{ height, animationDelay: `${index * 0.08}s` }} />)}</span><span>{preview ? text.ready : text.speak}</span></div>}
    {mic.audioInfo.sampleRate && <div className="home-device-info"><span>{text.rate}: {(mic.audioInfo.sampleRate / 1000).toFixed(1)} kHz</span>{mic.audioInfo.channels && <span>{text.channels}: {mic.audioInfo.channels}</span>}</div>}
    {!recording && !busy && <button className="home-button home-primary-start" onClick={mic.startAudioTest}><Mic size={17} aria-hidden="true" />{preview ? text.again : text.start}</button>}
    {busy && <button className="home-button home-button-secondary" onClick={mic.flushWorkspaceSystem}>{text.cancel}</button>}
    {recording && <div className="home-controls"><button className="home-button home-button-stop" onClick={mic.stopAudioCaptureProcessing}>{text.stop}</button><button className="home-button home-button-secondary" onClick={mic.toggleFeedbackMonitorState} aria-pressed={mic.isHearBackActive}><Headphones size={17} aria-hidden="true" />{mic.isHearBackActive ? text.monitorOff : text.monitorOn}</button></div>}
    {recording && <p className="home-note">{text.headphones} {mic.elapsedLabel}</p>}
    {preview && mic.recordedUrl && <div>
      <label htmlFor="test-playback">{text.listen}</label>
      <audio id="test-playback" src={mic.recordedUrl} controls preload="metadata" />
      <div className="home-controls"><a className="home-button" href={mic.recordedUrl} download={`microphone-test.${mic.recordingExtension}`}><Download size={17} aria-hidden="true" />{text.download} (.{mic.recordingExtension})</a><button className="home-button home-button-secondary" onClick={mic.flushWorkspaceSystem}><RotateCcw size={17} aria-hidden="true" />{text.discard}</button></div>
      <p className="home-note">{text.save}</p>
    </div>}
    <p className="home-note">{text.privacy} <Link to="/privacy" lang="en">{text.privacyLink} (English)</Link>.</p>
    <noscript><p className="home-error">{text.noscript}</p></noscript>
  </div>;
}
