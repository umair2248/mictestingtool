// Relative noise level helpers. The readings are not calibrated sound pressure
// levels: they map microphone RMS (dBFS) onto a 0–100 scale for comparison only.
export const defaultLimit = 75;
export const alertDelay = 1000;
export const zoneLabels = { quiet: 'Quiet', warn: 'Getting loud', loud: 'Too loud' };

export function rmsDb(samples) {
  let sum = 0;
  for (const value of samples) sum += value * value;
  const rms = samples.length ? Math.sqrt(sum / samples.length) : 0;
  return rms > 0 ? 20 * Math.log10(rms) : -Infinity;
}

export function toLevel(db, sensitivity = 0) {
  if (!Number.isFinite(db)) return 0;
  return Math.min(100, Math.max(0, db + 100 + sensitivity));
}

// Fast attack, slower release, like the "fast" setting on a sound level meter.
export function smoothLevel(previous, next, seconds) {
  const tau = next > previous ? 0.125 : 0.5;
  return previous + (next - previous) * (1 - Math.exp(-Math.min(1, Math.max(0, seconds)) / tau));
}

export function levelZone(level, limit) {
  return level >= limit ? 'loud' : level >= limit - 10 ? 'warn' : 'quiet';
}
