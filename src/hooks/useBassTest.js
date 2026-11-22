import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_LEVEL, SWEEP_SECONDS, clampFrequency, sweepFrequency } from '../utils/bassSignal';

const getAudioContext = () => typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
const FADE = 0.08;

export default function useBassTest() {
  const [state, setState] = useState('idle');
  const [mode, setMode] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [volume, setVolumeState] = useState(10);
  const [marked, setMarked] = useState(null);
  const [message, setMessage] = useState('Ready. Turn your volume down, then pick a tone or start the sweep.');
  const [error, setError] = useState('');
  const audio = useRef({});
  const run = useRef(0);
  const current = useRef(null);

  const teardown = useCallback(() => {
    const { context, osc, gain, timer } = audio.current;
    audio.current = {};
    clearInterval(timer);
    if (osc) { osc.onended = null; try { osc.stop(); } catch { /* already stopped */ } osc.disconnect(); }
    gain?.disconnect();
    if (context) { context.onstatechange = null; if (context.state !== 'closed') context.close().catch(() => {}); }
  }, []);

  const stop = useCallback(() => {
    run.current++;
    teardown();
    current.current = null;
    setState('idle'); setMode(null); setFrequency(null);
    setMessage('Playback stopped.');
  }, [teardown]);

  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', hidden);
    return () => { run.current++; teardown(); window.removeEventListener('pagehide', stop); document.removeEventListener('visibilitychange', hidden); };
  }, [teardown, stop]);

  const setVolume = value => {
    const level = Math.min(MAX_LEVEL, Math.max(0, value));
    setVolumeState(level);
    const { gain, context } = audio.current;
    if (gain && context?.state === 'running') gain.gain.setTargetAtTime(level / 100, context.currentTime, 0.05);
  };

  const start = async (kind, hz) => {
    const id = ++run.current;
    teardown();
    setError('');
    if (kind !== 'tone') setMarked(null);
    setState('starting');
    setMessage('Starting the bass tone…');
    try {
      const Context = getAudioContext();
      if (!Context) throw new Error('unsupported');
      const context = new Context();
      audio.current = { context };
      await context.resume();
      if (id !== run.current) return;
      if (context.state !== 'running') throw new Error('blocked');
      const osc = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume / 100, now + FADE);
      osc.connect(gain).connect(context.destination);
      osc.start(now);
      audio.current = { context, osc, gain };
      if (kind === 'tone') {
        const value = clampFrequency(hz);
        osc.frequency.setValueAtTime(value, now);
        current.current = () => value;
        setFrequency(value);
        setMessage(`Playing ${value} Hz. Press Stop when you’re done.`);
      } else {
        const direction = kind === 'sweep-down' ? 'down' : 'up';
        osc.frequency.setValueAtTime(sweepFrequency(0, direction), now);
        osc.frequency.exponentialRampToValueAtTime(sweepFrequency(SWEEP_SECONDS, direction), now + SWEEP_SECONDS);
        gain.gain.setValueAtTime(volume / 100, now + SWEEP_SECONDS - FADE);
        gain.gain.linearRampToValueAtTime(0, now + SWEEP_SECONDS);
        current.current = () => Math.round(sweepFrequency(context.currentTime - now, direction));
        audio.current.timer = setInterval(() => { if (current.current) setFrequency(current.current()); }, 100);
        osc.stop(now + SWEEP_SECONDS + 0.05);
        osc.onended = () => {
          if (id !== run.current) return;
          teardown(); current.current = null;
          setState('idle'); setMode(null); setFrequency(null);
          setMessage('Sweep finished. Run it again or play single tones to check a spot.');
        };
        setFrequency(sweepFrequency(0, direction));
        setMessage(direction === 'up' ? 'Sweeping up from 20 Hz. Press “I can hear it” as soon as the bass shows up.' : 'Sweeping down from 200 Hz. Press “It’s gone” when the bass fades out.');
      }
      context.onstatechange = () => { if (id === run.current && context.state !== 'running') stop(); };
      setMode(kind);
      setState('playing');
    } catch {
      if (id !== run.current) return;
      teardown(); current.current = null;
      setState('idle'); setMode(null); setFrequency(null);
      setError('Sound could not start. Use a browser with Web Audio support, allow sound for this site, and try again.');
    }
  };

  // Changes the pitch of a tone that is already playing instead of restarting it.
  const retune = hz => {
    const { osc, context } = audio.current;
    if (mode !== 'tone' || !osc || context?.state !== 'running') return false;
    const value = clampFrequency(hz);
    osc.frequency.setTargetAtTime(value, context.currentTime, 0.03);
    current.current = () => value;
    setFrequency(value);
    setMessage(`Playing ${value} Hz. Press Stop when you’re done.`);
    return true;
  };

  const mark = () => {
    if (!current.current || !mode?.startsWith('sweep')) return;
    const hz = current.current();
    run.current++;
    teardown(); current.current = null;
    setMarked({ hz, direction: mode === 'sweep-down' ? 'down' : 'up' });
    setState('idle'); setMode(null); setFrequency(null);
    setMessage(`Marked at ${hz} Hz. Play a single tone near it to double-check.`);
  };

  return {
    state, mode, frequency, volume, setVolume, marked, message, error,
    playTone: hz => retune(hz) || start('tone', hz),
    sweep: direction => start(direction === 'down' ? 'sweep-down' : 'sweep-up'),
    mark, stop,
  };
}
