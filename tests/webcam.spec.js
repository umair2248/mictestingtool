import { test, expect } from '@playwright/test';

test('webcam page is indexable and readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto('http://localhost:4173/webcam-test');
  expect(response.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Webcam and Microphone Test');
  await expect(page).toHaveTitle('Webcam and Mic Test — Test Your Webcam & Microphone Online');
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/webcam-test');
  await expect(page.locator('head > meta[name=robots]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
  const schemas = JSON.parse(await page.locator('#structured-data').textContent());
  expect(schemas.map(item => item['@type'])).toEqual(expect.arrayContaining(['WebApplication', 'BreadcrumbList']));
  await expect(page.locator('#webcam-faq details')).toHaveCount(7);
  await context.close();
});

test('webcam test shows video, mic level, records a clip and releases the camera', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/webcam-test');
  await page.getByRole('button', { name: 'Start webcam test' }).click();
  const video = page.getByLabel('Live webcam preview');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate(element => element.videoWidth)).toBeGreaterThan(0);
  await expect(page.locator('.webcam-badge--res')).toContainText('×');
  await expect(page.getByRole('meter', { name: 'Microphone input level' })).toBeVisible();
  await page.getByRole('button', { name: 'Snapshot' }).click();
  await expect(page.getByAltText('Snapshot from your webcam')).toBeVisible();
  await page.getByRole('button', { name: /Record 10s clip/ }).click();
  await expect(page.getByText(/REC ·/)).toBeVisible();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Stop clip' }).click();
  await expect(page.locator('#webcam-playback')).toBeVisible();
  await expect(page.getByRole('link', { name: /Download clip/ })).toHaveAttribute('download', /webcam-test\.(webm|mp4)/);
  await page.getByRole('button', { name: 'Stop camera' }).click();
  await expect(page.getByRole('button', { name: 'Start webcam test' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('denied camera permission shows a recoverable message', async ({ page }) => {
  await page.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('denied', 'NotAllowedError')); });
  await page.goto('/webcam-test');
  await page.getByRole('button', { name: 'Start webcam test' }).click();
  await expect(page.getByRole('alert')).toContainText('access was denied');
  await expect(page.getByRole('button', { name: 'Start webcam test' })).toBeEnabled();
});
