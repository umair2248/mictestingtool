import { test, expect } from '@playwright/test';

test('noise meter page is indexable and readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto('http://localhost:4173/noise-meter');
  expect(response.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Free Online Noise Meter for Classroom');
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/noise-meter');
  const schemas = JSON.parse(await page.locator('#structured-data').textContent());
  expect(schemas.map(item => item['@type'])).toEqual(expect.arrayContaining(['WebApplication', 'BreadcrumbList']));
  await expect(page.locator('#noise-faq details')).toHaveCount(7);
  await context.close();
});

test('noise meter shows a live level, enters classroom mode and releases the mic', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    // A steady tone instead of Chrome's fake-device beeps, so the level stays above the limit.
    window.noiseTracks = [];
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const output = context.createMediaStreamDestination();
      oscillator.connect(output); oscillator.start();
      window.noiseTracks.push(...output.stream.getTracks());
      return output.stream;
    };
  });
  await page.goto('/noise-meter');
  await page.getByRole('button', { name: 'Start noise meter' }).click();
  const meter = page.getByRole('meter', { name: 'Noise level' }).first();
  await expect.poll(() => meter.getAttribute('aria-valuenow').then(Number)).toBeGreaterThan(0);
  await page.getByLabel(/Too-loud limit/).fill('30');
  await expect(page.locator('.noise-display--loud').first()).toBeVisible();
  await expect.poll(() => page.locator('.noise-stats dd').nth(2).textContent().then(Number)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Classroom mode' }).click();
  await expect(page.getByRole('dialog', { name: 'Classroom noise meter' })).toBeVisible();
  await page.screenshot({ path: 'test-results/noise-classroom-mobile.png' });
  await page.getByRole('button', { name: 'Exit classroom mode' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect.poll(() => page.evaluate(() => window.noiseTracks.every(track => track.readyState === 'ended'))).toBe(true);
  await page.screenshot({ path: 'test-results/noise-mobile.png', fullPage: false });
  expect(errors).toEqual([]);
});
