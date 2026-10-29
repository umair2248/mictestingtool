export const speakerModes = {
  left: { label: 'Left channel', duration: 2 },
  right: { label: 'Right channel', duration: 2 },
  both: { label: 'Both channels', duration: 2 },
  sequence: { label: 'Left → right → both', duration: 6 },
};

// Two discrete PCM channels: the silent side contains actual zeros.
export function createSpeakerSignal(context, mode) {
  if (!speakerModes[mode]) throw new Error('Unknown speaker test');
  const duration = speakerModes[mode].duration;
  const buffer = context.createBuffer(2, Math.ceil(context.sampleRate * duration), context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      const time = i / context.sampleRate;
      const phase = mode === 'sequence' ? Math.floor(time / 2) : 0;
      const active = mode === 'both' || mode === 'left' && channel === 0 || mode === 'right' && channel === 1 || mode === 'sequence' && (phase === 2 || phase === channel);
      const segmentTime = time % 2;
      // Short fades and a pause at each boundary avoid abrupt clicks.
      const envelope = Math.max(0, Math.min(1, (segmentTime - .08) / .02, (1.92 - segmentTime) / .02));
      data[i] = active ? .5 * envelope * Math.sin(2 * Math.PI * 440 * time) : 0;
    }
  }
  return buffer;
}
