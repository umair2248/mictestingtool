// Bass test signal helpers: tone presets, the exponential 20-200 Hz sweep and a plain-language range description.
export const BASS_MIN = 20;
export const BASS_MAX = 200;
export const SWEEP_SECONDS = 30;
export const MAX_LEVEL = 30;
export const BASS_TONES = [20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200];

// Frequency at a point in the sweep. Exponential, so each octave gets the same time.
export function sweepFrequency(seconds, direction = 'up') {
  const progress = Math.min(1, Math.max(0, seconds / SWEEP_SECONDS));
  const from = direction === 'down' ? BASS_MAX : BASS_MIN;
  const to = direction === 'down' ? BASS_MIN : BASS_MAX;
  return from * (to / from) ** progress;
}

export function clampFrequency(value) {
  if (!Number.isFinite(value)) throw new Error('Frequency must be a number');
  return Math.min(BASS_MAX, Math.max(BASS_MIN, Math.round(value)));
}

export function describeRange(hz) {
  if (hz < 40) return 'Sub-bass. More felt than heard. Many subwoofers roll off down here.';
  if (hz < 60) return 'Deep bass. Where kick drums and movie rumble sit.';
  if (hz < 100) return 'Bass. Most small speakers start to reach this range.';
  if (hz < 150) return 'Upper bass. Laptops and phone speakers usually start around here.';
  return 'Low midrange. Common subwoofer crossover point (80-120 Hz) is below this.';
}

export function describeMark(hz) {
  if (hz <= 35) return 'That’s deep. A proper subwoofer is doing its job.';
  if (hz <= 60) return 'Solid. Typical for a decent subwoofer or large floor speakers.';
  if (hz <= 100) return 'Typical for bookshelf speakers or a small sub.';
  return 'Typical for laptop, phone or small desktop speakers.';
}
