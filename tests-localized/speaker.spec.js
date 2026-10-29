import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    window.speakerContexts = [];
    window.AudioContext = class extends Native { constructor(...args) { super(...args); window.speakerContexts.push(this); } };
    navigator.mediaDevices.getUserMedia = () => { throw new Error('Playback test must not request microphone access'); };
  });
});

test('metadata, channel playback, auto-stop, volume and explicit stop work', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/speaker-test');
  await expect(page).toHaveTitle('Free Speaker & Headphone Test — Left/Right Audio Check');
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/speaker-test');
  await expect(page.locator('head > link[rel=alternate]')).toHaveCount(0);
  expect(await page.evaluate(() => window.speakerContexts.length)).toBe(0);
  for (const side of ['left','right','both']) {
    await page.getByRole('button', { name: `Play ${side} channel${side === 'both' ? 's' : ''}`, exact: true }).click();
    await expect(page.getByRole('button', { name: 'Stop sound', exact: true })).toBeEnabled();
    await expect(page.getByRole('status')).toContainText(side === 'both' ? 'Both channels' : `${side[0].toUpperCase()+side.slice(1)} channel`);
    await expect(page.getByRole('status')).toContainText('Test finished', { timeout: 5000 });
    await expect.poll(() => page.evaluate(() => window.speakerContexts.at(-1).state)).toBe('closed');
  }
  await page.getByRole('button', { name: 'Run stereo sequence' }).click();
  await page.getByRole('slider').press('End');
  await expect(page.getByRole('slider')).toHaveValue('20');
  await page.getByRole('button', { name: 'Stop sound', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Playback stopped.');
  await expect.poll(() => page.evaluate(() => window.speakerContexts.at(-1).state)).toBe('closed');
  expect(errors).toEqual([]);
});

test('stereo sequence follows left, right and both and cleans up on navigation', async ({ page }) => {
  await page.goto('/speaker-test');
  await page.getByRole('button', { name: 'Run stereo sequence' }).click();
  await expect(page.getByRole('status')).toContainText('Left channel');
  await expect(page.getByRole('status')).toContainText('Right channel', { timeout: 4000 });
  await expect(page.getByRole('status')).toContainText('Both channels', { timeout: 4000 });
  await expect(page.getByRole('status')).toContainText('Test finished', { timeout: 4000 });
  await page.getByRole('button', { name: 'Run stereo sequence' }).click();
  await page.getByRole('link', { name: 'Start headset microphone test', exact: true }).click();
  await expect(page).toHaveURL(/\/#microphone-test$/);
  await expect.poll(() => page.evaluate(() => window.speakerContexts.every(context => context.state === 'closed'))).toBe(true);
});

test('tool fits mobile and desktop and is linked from the mic homepage', async ({ page }) => {
  for (const width of [320,390,768,1200,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/speaker-test');
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: 'test-results/speaker-desktop.png' });
  await page.setViewportSize({ width:390,height:844 });
  await expect(page.getByRole('button', { name: 'Play left channel', exact: true })).toBeInViewport();
  await page.screenshot({ path: 'test-results/speaker-mobile.png' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Test your speakers and headphones', exact: true }).click();
  await expect(page).toHaveURL(/\/speaker-test$/);
});

test('unavailable Web Audio reports a recoverable error', async ({ page }) => {
  await page.addInitScript(() => { window.AudioContext = undefined; window.webkitAudioContext = undefined; });
  await page.goto('/speaker-test');
  await page.getByRole('button', { name: 'Play left channel', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Sound could not start');
  await expect(page.getByRole('button', { name: 'Play right channel', exact: true })).toBeEnabled();
});

test('cancellation ignores a late audio start and backgrounding stops playback', async ({ page }) => {
  await page.addInitScript(() => {
    const resume = window.AudioContext.prototype.resume;
    window.AudioContext.prototype.resume = function() {
      if (!window.delaySpeakerResume) return resume.call(this);
      return new Promise(resolve => { window.finishSpeakerResume = resolve; });
    };
    window.delaySpeakerResume = true;
  });
  await page.goto('/speaker-test');
  await page.getByRole('button', { name: 'Play left channel', exact: true }).click();
  await page.getByRole('button', { name: 'Stop sound', exact: true }).click();
  await page.evaluate(() => { window.finishSpeakerResume(); window.delaySpeakerResume = false; });
  await expect(page.getByRole('status')).toHaveText('Playback stopped.');
  await expect.poll(() => page.evaluate(() => window.speakerContexts.at(-1).state)).toBe('closed');
  await page.getByRole('button', { name: 'Run stereo sequence' }).click();
  await expect(page.getByRole('status')).toContainText('Left channel');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.getByRole('status')).toHaveText('Playback stopped.');
  await expect.poll(() => page.evaluate(() => window.speakerContexts.at(-1).state)).toBe('closed');
});
