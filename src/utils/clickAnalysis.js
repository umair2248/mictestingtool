// Pure click-timing logic for the mouse double click test, kept free of React so it can be tested directly.
// A worn mouse switch "chatters": one press reaches the computer as two presses a few milliseconds apart.
// Real people can't double click that fast, so two presses of the same button closer than the
// threshold are counted as an accidental double click.

export const BUTTONS = [
  { id: 0, key: 'left', label: 'Left' },
  { id: 1, key: 'middle', label: 'Middle' },
  { id: 2, key: 'right', label: 'Right' },
  { id: 3, key: 'back', label: 'Back' },
  { id: 4, key: 'forward', label: 'Forward' },
];

export const DEFAULT_THRESHOLD = 80;
export const MIN_THRESHOLD = 30;
export const MAX_THRESHOLD = 200;
// A release followed by a new press this quickly is a bounce, even when the press before it was held for a while (a drag that drops).
export const RELEASE_BOUNCE_MS = 25;

export const buttonFor = id => BUTTONS.find(button => button.id === id) || null;

export function createStats() {
  return Object.fromEntries(BUTTONS.map(button => [button.key, { clicks: 0, doubles: 0, lastDown: null, lastUp: null, fastest: null }]));
}

// Returns new stats plus a description of this press. Times are in milliseconds.
export function recordDown(stats, key, time, threshold = DEFAULT_THRESHOLD) {
  const prev = stats[key];
  if (!prev) return { stats, event: null };
  const interval = prev.lastDown === null ? null : Math.max(0, time - prev.lastDown);
  const sinceRelease = prev.lastUp === null || (prev.lastDown !== null && prev.lastUp < prev.lastDown) ? null : Math.max(0, time - prev.lastUp);
  const suspicious = (interval !== null && interval < threshold) || (sinceRelease !== null && sinceRelease < Math.min(RELEASE_BOUNCE_MS, threshold));
  const next = {
    clicks: prev.clicks + 1,
    doubles: prev.doubles + (suspicious ? 1 : 0),
    lastDown: time,
    lastUp: prev.lastUp,
    fastest: interval === null ? prev.fastest : prev.fastest === null ? interval : Math.min(prev.fastest, interval),
  };
  return { stats: { ...stats, [key]: next }, event: { key, interval, sinceRelease, suspicious } };
}

export function recordUp(stats, key, time) {
  if (!stats[key]) return stats;
  return { ...stats, [key]: { ...stats[key], lastUp: time } };
}

export function summarize(stats) {
  const clicks = BUTTONS.reduce((sum, button) => sum + stats[button.key].clicks, 0);
  const faulty = BUTTONS.filter(button => stats[button.key].doubles > 0);
  if (clicks === 0) return { tone: 'idle', text: 'Click inside the box to start the test.' };
  if (faulty.length) {
    const parts = faulty.map(button => `${button.label.toLowerCase()} button ${stats[button.key].doubles}×`);
    return { tone: 'bad', text: `Double clicks detected: ${parts.join(', ')}. One press reached the computer as two, which is the classic sign of a worn switch.` };
  }
  const left = stats.left.clicks;
  if (left < 20) return { tone: 'idle', text: `${clicks} ${clicks === 1 ? 'click' : 'clicks'}, no double clicks so far. Keep going: aim for at least 20 to 30 single clicks.` };
  return { tone: 'good', text: `No double clicks in ${clicks} clicks. Your mouse buttons look fine at this threshold.` };
}
