import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    window.surroundContexts = [];
    window.AudioContext = class extends Native { constructor(...args) { super(...args); window.surroundContexts.push(this); } };
    navigator.mediaDevices.getUserMedia = () => { throw new Error('Surround test must not request microphone access'); };
  });
});

test('metadata, single channels, layout switch and stop work', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/surround-sound-test');
  await expect(page).toHaveTitle('Surround Sound Test — 5.1 & 7.1 Speaker Channel Test');
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/surround-sound-test');
  expect(await page.evaluate(() => window.surroundContexts.length)).toBe(0);

  await expect(page.locator('.surround-controls button')).toHaveCount(8);
  await page.getByRole('button', { name: 'Center', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Center.');
  await expect(page.locator('.surround-spk.is-playing')).toHaveText('C');
  await expect(page.locator('.surround-channels')).toContainText('Output channels your browser can use');
  await expect(page.getByRole('status')).toContainText('Test finished', { timeout: 5000 });
  await expect.poll(() => page.evaluate(() => window.surroundContexts.at(-1).state)).toBe('closed');

  await page.getByRole('button', { name: '5.1 surround' }).click();
  await expect(page.getByRole('button', { name: '5.1 surround' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.surround-controls button')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Rear left', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Play all channels in order' }).click();
  await expect(page.getByRole('status')).toContainText('Front left');
  await expect(page.getByRole('status')).toContainText('Front right', { timeout: 4000 });
  await page.getByRole('button', { name: 'Stop sound', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Playback stopped.');
  await expect.poll(() => page.evaluate(() => window.surroundContexts.at(-1).state)).toBe('closed');
  await expect(page.locator('.surround-spk.is-playing')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('no horizontal scroll on a phone', async ({ page }) => {
  await page.goto('/surround-sound-test');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
