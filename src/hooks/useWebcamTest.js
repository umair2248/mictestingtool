import { useState, useEffect, useRef, useCallback } from 'react';

export const CLIP_SECONDS = 10;

export const webcamMessages = {
  unsupported: 'Camera access is unavailable. Open this page over HTTPS in a current browser that supports camera and microphone capture.',
  denied: 'Camera or microphone access was denied. Allow both in your browser site settings (the camera icon beside the address bar), then try again.',
  notFound: 'No camera was found. Connect a webcam, close other apps that may be using it, and try again.',
  busy: 'The camera could not be started. Another app (Zoom, Teams, OBS) may be using it — close that app and try again.',
  noMic: 'Camera started, but no microphone was found. The video test works; connect a microphone to test audio too.',
  recordFailed: 'Recording is not supported in this browser. The live preview and microphone meter still work.',
};

const label = (track, fallback) => track?.label || fallback;

export default function useWebcamTest() {
  const [state, setState] = useState('idle'); // idle | starting | live | recording | stopping
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cameras, setCameras] = useState([]);
  const [mics, setMics] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [info, setInfo] = useState(null);
  const [level, setLevel] = useState(0);
  const [clip, setClip] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const recorderRef = useRef(null);
  const frameRef = useRef(0);
  const timerRef = useRef(0);
  const sessionRef = useRef(0);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      setCameras(all.filter(device => device.kind === 'videoinput' && device.deviceId));
      setMics(all.filter(device => device.kind === 'audioinput' && device.deviceId));
    } catch { /* Labels can be unavailable before permission. */ }
  }, []);

  const release = useCallback(() => {
    sessionRef.current += 1;
    cancelAnimationFrame(frameRef.current);
    clearInterval(timerRef.current);
    if (recorderRef.current?.state === 'recording') { recorderRef.current.onstop = null; recorderRef.current.stop(); }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    audioCtxRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLevel(0);
    setCountdown(0);
  }, []);

  useEffect(() => { refreshDevices(); return release; }, [refreshDevices, release]);
  useEffect(() => () => { if (clip) URL.revokeObjectURL(clip.url); }, [clip]);

  const watchLevel = (stream, session) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!stream.getAudioTracks().length || !AudioContextClass) return;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    ctx.resume?.();
    const samples = new Uint8Array(analyser.fftSize);
    let last = 0;
    const tick = time => {
      if (session !== sessionRef.current) return;
      if (time - last > 80) {
        last = time;
        analyser.getByteTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length);
        setLevel(Math.min(100, Math.round(rms * 100)));
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const start = async () => {
    setError(''); setNotice('');
    if (!navigator.mediaDevices?.getUserMedia) { setError(webcamMessages.unsupported); return; }
    release();
    const session = sessionRef.current;
    setState('starting');
    const video = { width: { ideal: 1920 }, height: { ideal: 1080 }, ...(selectedCamera ? { deviceId: { exact: selectedCamera } } : {}) };
    const audio = selectedMic ? { deviceId: { exact: selectedMic } } : true;
    let stream;
    try {
      try { stream = await navigator.mediaDevices.getUserMedia({ video, audio }); }
      catch (err) {
        // A missing microphone should not block the camera test.
        if (err.name !== 'NotFoundError' && err.name !== 'OverconstrainedError') throw err;
        stream = await navigator.mediaDevices.getUserMedia({ video });
        setNotice(webcamMessages.noMic);
      }
    } catch (err) {
      if (session !== sessionRef.current) return;
      setState('idle');
      setError(err.name === 'NotAllowedError' || err.name === 'SecurityError' ? webcamMessages.denied : err.name === 'NotFoundError' ? webcamMessages.notFound : err.name === 'NotReadableError' ? webcamMessages.busy : webcamMessages.unsupported);
      return;
    }
    if (session !== sessionRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
    streamRef.current = stream;
    if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play?.().catch(() => {}); }
    const [videoTrack] = stream.getVideoTracks();
    const [audioTrack] = stream.getAudioTracks();
    const settings = videoTrack?.getSettings() || {};
    setInfo({
      camera: label(videoTrack, 'Default camera'),
      mic: audioTrack ? label(audioTrack, 'Default microphone') : null,
      width: settings.width || null,
      height: settings.height || null,
      frameRate: settings.frameRate ? Math.round(settings.frameRate) : null,
      sampleRate: audioTrack?.getSettings().sampleRate || null,
    });
    watchLevel(stream, session);
    await refreshDevices();
    setState('live');
  };

  const stop = () => { release(); setState('idle'); setInfo(null); };

  // Switching devices during a live test restarts capture with the new input.
  const restartRef = useRef(false);
  useEffect(() => {
    if (!restartRef.current) return;
    restartRef.current = false;
    if (streamRef.current) start();
  }, [selectedCamera, selectedMic]); // eslint-disable-line react-hooks/exhaustive-deps
  const chooseCamera = id => { restartRef.current = true; setSelectedCamera(id); };
  const chooseMic = id => { restartRef.current = true; setSelectedMic(id); };

  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL('image/png'));
  };

  const recordClip = () => {
    const stream = streamRef.current;
    if (!stream || state !== 'live') return;
    if (!window.MediaRecorder) { setNotice(webcamMessages.recordFailed); return; }
    const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(type => MediaRecorder.isTypeSupported(type));
    let recorder;
    try { recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined); }
    catch { setNotice(webcamMessages.recordFailed); return; }
    const session = sessionRef.current;
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
    recorder.onstop = () => {
      clearInterval(timerRef.current);
      if (session !== sessionRef.current) return;
      setCountdown(0);
      setState('live');
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      if (!blob.size) { setNotice(webcamMessages.recordFailed); return; }
      setClip({ url: URL.createObjectURL(blob), extension: blob.type.includes('mp4') ? 'mp4' : 'webm' });
    };
    recorderRef.current = recorder;
    setClip(null);
    recorder.start(250);
    setState('recording');
    setCountdown(CLIP_SECONDS);
    const started = Date.now();
    timerRef.current = setInterval(() => {
      const left = CLIP_SECONDS - Math.floor((Date.now() - started) / 1000);
      setCountdown(Math.max(0, left));
      if (left <= 0 && recorder.state === 'recording') recorder.stop();
    }, 250);
  };

  const stopClip = () => { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); };

  return { state, error, notice, cameras, mics, selectedCamera, chooseCamera, selectedMic, chooseMic, info, level, clip, snapshot, countdown, videoRef, start, stop, takeSnapshot, recordClip, stopClip, clearSnapshot: () => setSnapshot(null) };
}
