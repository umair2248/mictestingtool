import { useCallback, useEffect, useRef, useState } from 'react';
import { createSurroundSignal, surroundLayouts, SEGMENT } from '../utils/surroundSignal';

const AudioContextClass = () => typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);

export default function useSurroundTest() {
  const [layout, setLayoutState] = useState('7.1');
  const [state, setState] = useState('idle');
  const [active, setActive] = useState(-1);
  const [volume, setVolume] = useState(8);
  const [outputChannels, setOutputChannels] = useState(null);
  const [message, setMessage] = useState('Ready. Lower your volume, then play a channel.');
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
    release(); setState('idle'); setActive(-1); setMessage('Playback stopped.');
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

  const setLayout = next => { if (surroundLayouts[next]) { stop(); setLayoutState(next); setMessage(`${next} layout selected.`); } };

  const play = async target => {
    const id = ++generation.current;
    const channels = surroundLayouts[layout];
    release(); setError(''); setActive(-1); setState('starting'); setMessage('Preparing the surround test…');
    try {
      const Ctx = AudioContextClass();
      if (!Ctx) throw new Error('unsupported');
      const context = new Ctx();
      resources.current = { context };
      await context.resume();
      if (id !== generation.current) return;
      if (context.state !== 'running') throw new Error('blocked');
      const available = context.destination.maxChannelCount || 2;
      setOutputChannels(available);
      // With enough channels, send each one straight to its speaker. Otherwise the
      // browser downmixes, and the status message says so.
      if (available >= channels.length) {
        context.destination.channelCount = channels.length;
        context.destination.channelCountMode = 'explicit';
        context.destination.channelInterpretation = 'discrete';
      }
      const source = context.createBufferSource();
      const gain = context.createGain();
      gain.channelCount = channels.length;
      gain.channelCountMode = 'explicit';
      gain.channelInterpretation = 'discrete';
      source.buffer = createSurroundSignal(context, layout, target);
      gain.gain.setValueAtTime(volume / 100, context.currentTime);
      source.connect(gain).connect(context.destination);
      const started = context.currentTime;
      const update = () => setActive(target === 'sequence' ? Math.min(channels.length - 1, Math.floor((context.currentTime - started) / SEGMENT)) : target);
      resources.current = { context, source, gain, timer: setInterval(update, 100) };
      source.onended = () => { if (id !== generation.current) return; release(); setState('idle'); setActive(-1); setMessage('Test finished. Did each tone come from the speaker that lit up?'); };
      context.onstatechange = () => { if (id === generation.current && context.state !== 'running') stop(); };
      source.start(); update(); setState('playing');
      setMessage(available >= channels.length
        ? `Playing through ${channels.length} separate output channels.`
        : `Your browser reports only ${available} output channels, so the surround channels are mixed down. Set your device to ${layout} first (see the steps below).`);
    } catch {
      if (id !== generation.current) return;
      release(); setState('idle'); setActive(-1); setError('Sound could not start. Use a browser with Web Audio support, allow sound for this site, and try again.');
    }
  };

  return { layout, setLayout, channels: surroundLayouts[layout], state, active, volume, setVolume, outputChannels, message, error, play, stop };
}
