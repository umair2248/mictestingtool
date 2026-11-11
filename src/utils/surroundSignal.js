// Channel order follows the usual WAVE/Windows layout: FL, FR, C, LFE, then the
// surrounds. 7.1 puts the rear pair before the side pair, as Windows does.
export const surroundLayouts = {
  '5.1': [
    { id: 'fl', label: 'Front left', short: 'FL' },
    { id: 'fr', label: 'Front right', short: 'FR' },
    { id: 'c', label: 'Center', short: 'C' },
    { id: 'lfe', label: 'Subwoofer (LFE)', short: 'LFE' },
    { id: 'sl', label: 'Surround left', short: 'SL' },
    { id: 'sr', label: 'Surround right', short: 'SR' },
  ],
  '7.1': [
    { id: 'fl', label: 'Front left', short: 'FL' },
    { id: 'fr', label: 'Front right', short: 'FR' },
    { id: 'c', label: 'Center', short: 'C' },
    { id: 'lfe', label: 'Subwoofer (LFE)', short: 'LFE' },
    { id: 'rl', label: 'Rear left', short: 'RL' },
    { id: 'rr', label: 'Rear right', short: 'RR' },
    { id: 'sl', label: 'Side left', short: 'SL' },
    { id: 'sr', label: 'Side right', short: 'SR' },
  ],
};

export const SEGMENT = 2;
const TONE = 440;
const LFE_TONE = 60;

// One channel (by index) or 'sequence', which walks through every channel in order.
// Silent channels hold real zeros so nothing leaks into the wrong speaker.
export function createSurroundSignal(context, layout, target) {
  const channels = surroundLayouts[layout];
  if (!channels) throw new Error('Unknown surround layout');
  const sequence = target === 'sequence';
  if (!sequence && !(Number.isInteger(target) && target >= 0 && target < channels.length)) throw new Error('Unknown surround channel');
  const duration = sequence ? SEGMENT * channels.length : SEGMENT;
  const buffer = context.createBuffer(channels.length, Math.ceil(context.sampleRate * duration), context.sampleRate);
  for (let channel = 0; channel < channels.length; channel++) {
    const data = buffer.getChannelData(channel);
    const frequency = channels[channel].id === 'lfe' ? LFE_TONE : TONE;
    for (let i = 0; i < data.length; i++) {
      const time = i / context.sampleRate;
      const active = sequence ? Math.floor(time / SEGMENT) === channel : target === channel;
      if (!active) { data[i] = 0; continue; }
      const segmentTime = time % SEGMENT;
      // Short fades and a gap at each boundary so speakers don't click.
      const envelope = Math.max(0, Math.min(1, (segmentTime - .08) / .02, (SEGMENT - .08 - segmentTime) / .02));
      data[i] = .5 * envelope * Math.sin(2 * Math.PI * frequency * time);
    }
  }
  return buffer;
}
