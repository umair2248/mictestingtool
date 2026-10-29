import { useState, useEffect, useRef } from 'react';
import { englishTool } from '../data/locales';

export default function useMicrophoneTest(messages = englishTool) {
  // ==========================================
  // 1. STATE & CORE CONFIGURATION LAYER
  // ==========================================
  const [testState, setTestState] = useState('idle'); 
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [selectedMic, setSelectedMic] = useState('');
  const [devices, setDevices] = useState([]);
  const [audioError, setAudioError] = useState('');
  const [isHearBackActive, setIsHearBackActive] = useState(false);
  const [audioInfo, setAudioInfo] = useState({ sampleRate: null, channels: null });
  const [recordingExtension, setRecordingExtension] = useState('webm');
  const [elapsed, setElapsed] = useState(0);
  const elapsedLabel = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);
  const chunksRef = useRef([]);
  const captureIdRef = useRef(0);

  const refreshDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try { setDevices((await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'audioinput')); } catch { /* Device labels may be unavailable before permission. */ }
  };
  useEffect(() => { refreshDevices(); return () => shutdownActiveAudioTracks(); }, []);
  useEffect(() => () => { if (recordedUrl) URL.revokeObjectURL(recordedUrl); }, [recordedUrl]);
  useEffect(() => {
    if (testState !== 'testing') return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [testState]);

  const startAudioTest = async () => {
    setAudioError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setAudioError(messages.unsupported); return; }
    if (!['idle', 'preview'].includes(testState)) return;
    const captureId = ++captureIdRef.current;
    setTestState('starting');
    setRecordedUrl(null);
    setElapsed(0);
    setAudioInfo({ sampleRate: null, channels: null });
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { ...(selectedMic ? { deviceId: { exact: selectedMic } } : {}), echoCancellation: false, noiseSuppression: false, autoGainControl: false } 
      });
      if (captureId !== captureIdRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      await refreshDevices();

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      await ctx.resume();
      if (captureId !== captureIdRef.current) return;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256; 
      analyser.smoothingTimeConstant = 0.35; 
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime); 

      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;

      const trackMetaDetails = stream.getAudioTracks()[0].getSettings();
      setAudioInfo({ sampleRate: ctx.sampleRate, channels: trackMetaDetails.channelCount || null });

      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(type => MediaRecorder.isTypeSupported(type));
      const localRecorderInstance = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = localRecorderInstance;
      
      localRecorderInstance.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      localRecorderInstance.onstop = () => {
        if (captureId !== captureIdRef.current) return;
        const finalCompiledBlob = new Blob(chunksRef.current, { type: localRecorderInstance.mimeType || chunksRef.current[0]?.type || 'audio/webm' });
        if (!finalCompiledBlob.size) { setAudioError(messages.empty); setTestState('idle'); return; }
        const type = finalCompiledBlob.type;
        setRecordingExtension(type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : 'webm');
        const localBinaryPlaybackUrl = URL.createObjectURL(finalCompiledBlob);
        setRecordedUrl(localBinaryPlaybackUrl);
        setTestState('preview');
      };
      localRecorderInstance.onerror = () => {
        if (captureId !== captureIdRef.current) return;
        shutdownActiveAudioTracks();
        setAudioError(messages.interrupted);
        setTestState('idle');
      };

      localRecorderInstance.start(100);
      setTestState('testing');
    } catch (err) {
      if (captureId !== captureIdRef.current) return;
      setTestState('idle');
      shutdownActiveAudioTracks();
      setAudioError(err.name === 'NotAllowedError' ? messages.denied : messages.failed);
    }
  };

  const toggleFeedbackMonitorState = () => {
    if (!gainNodeRef.current || !audioCtxRef.current) return;
    if (isHearBackActive) {
      gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    } else {
      gainNodeRef.current.gain.setValueAtTime(1.0, audioCtxRef.current.currentTime);
    }
    setIsHearBackActive(!isHearBackActive);
  };

  const stopAudioCaptureProcessing = () => {
    setTestState('stopping');
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    shutdownActiveAudioTracks({ discard: false });
  };

  const shutdownActiveAudioTracks = ({ discard = true } = {}) => {
    if (discard) captureIdRef.current += 1;
    if (streamRef.current) streamRef.current.getTracks().forEach((trackItem) => trackItem.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    analyserRef.current = null;
    gainNodeRef.current = null;
    streamRef.current = null;
    if (recorderRef.current?.state === 'recording') { recorderRef.current.onstop = null; recorderRef.current.stop(); }
    setIsHearBackActive(false);
  };

  const flushWorkspaceSystem = () => {
    shutdownActiveAudioTracks();
    setRecordedUrl(null);
    setTestState('idle');
    setAudioInfo({ sampleRate: null, channels: null });
    setElapsed(0);
    setAudioError('');
  };



  return { testState, recordedUrl, selectedMic, setSelectedMic, devices, audioError, isHearBackActive, startAudioTest, toggleFeedbackMonitorState, stopAudioCaptureProcessing, flushWorkspaceSystem, analyserRef, audioInfo, elapsedLabel, recordingExtension };
}
