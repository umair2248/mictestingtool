import { useCallback, useEffect, useRef, useState } from 'react';
import { createSpeakerSignal, speakerModes } from '../utils/speakerSignal';

export default function useSpeakerTest() {
  const [state, setState] = useState('idle');
  const [mode, setMode] = useState(null);
  const [channel, setChannel] = useState('');
  const [volume, setVolume] = useState(8);
  const [message, setMessage] = useState('Ready. Lower your device volume before playing a test.');
  const [error, setError] = useState('');
  const resources = useRef({});
  const generation = useRef(0);

  const release = useCallback(() => {
    const { context, source, gain, timer } = resources.current;
    resources.current = {};
    clearInterval(timer);
    if (source) { source.onended = null; try { source.stop(); } catch { /* Already finished. */ } source.disconnect(); }
    gain?.disconnect();
    if (context) { context.onstatechange = null; if (context.state !== 'closed') context.close().catch(() => {}); }
  }, []);
  const stop = useCallback(() => {
    generation.current++;
    release(); setState('idle'); setMode(null); setChannel(''); setMessage('Playback stopped.');
  }, [release]);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', hide);
    return () => { generation.current++; release(); window.removeEventListener('pagehide', stop); document.removeEventListener('visibilitychange', hide); };
  }, [release, stop]);
  useEffect(() => {
    const { gain, context } = resources.current;
    if (gain && context?.state === 'running') gain.gain.setTargetAtTime(volume / 100, context.currentTime, .02);
  }, [volume]);

  const play = async selected => {
    const id = ++generation.current;
    release(); setError(''); setMode(selected); setChannel(''); setState('starting'); setMessage('Preparing the sound test…');
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('unsupported');
      const context = new AudioContextClass();
      resources.current = { context };
      await context.resume();
      if (id !== generation.current) return;
      if (context.state !== 'running') throw new Error('blocked');
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = createSpeakerSignal(context, selected);
      gain.gain.setValueAtTime(volume / 100, context.currentTime);
      source.connect(gain).connect(context.destination);
      const started = context.currentTime;
      const update = () => setChannel(selected === 'sequence' ? ['Left channel','Right channel','Both channels'][Math.min(2, Math.floor((context.currentTime - started) / 2))] : speakerModes[selected].label);
      resources.current = { context, source, gain, timer: setInterval(update, 100) };
      source.onended = () => { if (id !== generation.current) return; release(); setState('idle'); setMode(null); setChannel(''); setMessage('Test finished. Compare what you heard with the channel labels.'); };
      context.onstatechange = () => { if (id === generation.current && context.state !== 'running') stop(); };
      source.start(); update(); setState('playing'); setMessage('Playing a short 440 Hz tone.');
    } catch {
      if (id !== generation.current) return;
      release(); setState('idle'); setMode(null); setChannel(''); setError('Sound could not start. Use a browser with Web Audio support, allow sound for this site, and try again.');
    }
  };
  return { state, mode, channel, volume, setVolume, message, error, play, stop };
}
