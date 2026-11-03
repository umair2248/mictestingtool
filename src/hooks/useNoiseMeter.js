import { useCallback, useEffect, useRef, useState } from 'react';
import { alertDelay, defaultLimit, rmsDb, smoothLevel, toLevel } from '../utils/noiseLevel';

const emptyStats = () => ({ peak: 0, sum: 0, count: 0, alerts: 0 });

export default function useNoiseMeter() {
  const [state, setState] = useState('idle');
  const [level, setLevel] = useState(0);
  const [stats, setStats] = useState({ peak: 0, average: 0, alerts: 0 });
  const [alerting, setAlerting] = useState(false);
  const [limit, setLimit] = useState(defaultLimit);
  const [sensitivity, setSensitivity] = useState(0);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const resources = useRef({});
  const settings = useRef({ limit: defaultLimit, sensitivity: 0 });
  const totals = useRef(emptyStats());
  const generation = useRef(0);
  useEffect(() => { settings.current = { limit, sensitivity }; }, [limit, sensitivity]);

  const release = useCallback(() => {
    const { stream, context, frame, wakeLock } = resources.current;
    resources.current = {};
    cancelAnimationFrame(frame);
    stream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    wakeLock?.release().catch(() => {});
    if (context && context.state !== 'closed') context.close().catch(() => {});
  }, []);
  const stop = useCallback(() => {
    generation.current++;
    release(); setState('idle'); setLevel(0); setAlerting(false);
  }, [release]);

  // Keep the screen on while the meter runs; browsers drop the lock when the tab is hidden.
  const keepAwake = useCallback(async id => {
    try {
      const lock = await navigator.wakeLock?.request('screen');
      if (lock && id === generation.current && resources.current.context) resources.current.wakeLock = lock;
      else lock?.release();
    } catch { /* Wake Lock is optional. */ }
  }, []);
  useEffect(() => {
    const visible = () => { if (!document.hidden && resources.current.context && (!resources.current.wakeLock || resources.current.wakeLock.released)) keepAwake(generation.current); };
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', visible);
    return () => { generation.current++; release(); window.removeEventListener('pagehide', stop); document.removeEventListener('visibilitychange', visible); };
  }, [keepAwake, release, stop]);

  const start = async (selected = deviceId) => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) { setError('This browser cannot open the microphone. Use a current version of Chrome, Edge, Firefox or Safari over HTTPS.'); return; }
    const id = ++generation.current;
    release(); setState('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { ...(selected ? { deviceId: { exact: selected } } : {}), echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      if (id !== generation.current) { stream.getTracks().forEach(track => track.stop()); return; }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      resources.current = { stream, context };
      await context.resume();
      if (id !== generation.current) return;
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      const track = stream.getAudioTracks()[0];
      setDeviceId(track.getSettings?.().deviceId || selected);
      track.onended = () => { if (id !== generation.current) return; stop(); setError('The microphone was disconnected. Reconnect it and start the meter again.'); };
      navigator.mediaDevices.enumerateDevices?.().then(list => { if (id === generation.current) setDevices(list.filter(device => device.kind === 'audioinput')); }).catch(() => {});

      let smoothed = 0, last = performance.now(), lastUi = 0, overSince = null, alarm = false;
      const tick = now => {
        if (id !== generation.current) return;
        analyser.getFloatTimeDomainData(samples);
        smoothed = smoothLevel(smoothed, toLevel(rmsDb(samples), settings.current.sensitivity), (now - last) / 1000);
        last = now;
        const t = totals.current;
        t.peak = Math.max(t.peak, smoothed); t.sum += smoothed; t.count++;
        if (smoothed >= settings.current.limit) {
          overSince ??= now;
          if (!alarm && now - overSince >= alertDelay) { alarm = true; t.alerts++; }
        } else {
          overSince = null;
          if (smoothed < settings.current.limit - 3) alarm = false;
        }
        if (now - lastUi >= 100) {
          lastUi = now;
          setLevel(smoothed); setAlerting(alarm);
          setStats({ peak: t.peak, average: t.count ? t.sum / t.count : 0, alerts: t.alerts });
        }
        resources.current.frame = requestAnimationFrame(tick);
      };
      resources.current.frame = requestAnimationFrame(tick);
      setState('running');
      keepAwake(id);
    } catch (err) {
      if (id !== generation.current) return;
      release(); setState('idle');
      setError(err?.name === 'NotAllowedError' ? 'Microphone access was blocked. Allow the microphone for this site in your browser settings, then press Start again.' : err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError' ? 'No microphone was found. Connect one, or choose another input, and try again.' : 'The noise meter could not start. Close other apps that use the microphone and try again.');
    }
  };
  const chooseDevice = id => { setDeviceId(id); if (state !== 'idle') start(id); };
  const resetStats = () => { totals.current = emptyStats(); setStats({ peak: 0, average: 0, alerts: 0 }); };

  return { state, level, stats, alerting, limit, setLimit, sensitivity, setSensitivity, devices, deviceId, chooseDevice, error, start, stop, resetStats };
}
