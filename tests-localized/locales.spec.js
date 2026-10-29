import { test, expect } from '@playwright/test';
import { locales, languageVersions } from '../src/data/locales.js';

test('all translated pages have localized metadata, controls, language and responsive layouts', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const locale of locales) {
    await page.goto(locale.path);
    await expect(page.locator('h1')).toHaveText(locale.h1);
    await expect(page).toHaveTitle(locale.title);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', `https://mictestingtool.com${locale.path}`);
    await expect(page.locator('head > link[rel=alternate]')).toHaveCount(languageVersions.length + 1);
    await expect(page.getByRole('button', { name: locale.tool.start, exact: true })).toBeVisible();
    await expect(page.locator('#mic-faq details')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), locale.code).toBe(true);
    await page.getByRole('button', { name: locale.menu, exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: locale.close, exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `desktop ${locale.code}`).toBe(true);
    await expect(page.locator('.site-nav')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
  }
  expect(errors).toEqual([]);
});

test('real language links update content and restore English on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('.language-picker summary').click();
  await page.locator('.language-picker').getByRole('link', { name: 'Français', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/test-microphone$/);
  await expect(page.locator('h1')).toHaveText(locales.find(item => item.code === 'fr').h1);
  await expect(page.locator('.language-picker')).not.toHaveAttribute('open', '');
  await page.locator('.language-picker summary').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.language-picker')).not.toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: '简体中文', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await page.locator('.localized-mic .language-directory').getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'Start Free Microphone Test', exact: true })).toBeVisible();
});

test('each language records, plays back, downloads and reports localized permission errors', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0;
    navigator.mediaDevices.getUserMedia = async () => {
      if (++calls === 1) throw new DOMException('Denied', 'NotAllowedError');
      const context = new AudioContext();
      const tone = context.createOscillator();
      const destination = context.createMediaStreamDestination();
      tone.frequency.value = 440;
      tone.connect(destination); tone.start(); await context.resume();
      return destination.stream;
    };
  });
  for (const locale of locales) {
    await page.goto(locale.path);
    const start = page.getByRole('button', { name: locale.tool.start, exact: true });
    await start.click();
    await expect(page.getByRole('alert')).toHaveText(locale.tool.denied);
    await start.click();
    await expect(page.getByRole('meter', { name: locale.tool.level, exact: true })).toBeVisible();
    await expect.poll(() => page.locator('[role=meter]').getAttribute('aria-valuenow')).not.toBe('0');
    await page.getByRole('button', { name: locale.tool.stop, exact: true }).click();
    await expect(page.locator('audio')).toHaveAttribute('src', /^blob:/);
    await expect.poll(() => page.locator('audio').evaluate(audio => audio.readyState)).toBeGreaterThan(0);
    const event = page.waitForEvent('download');
    await page.getByRole('link', { name: new RegExp(locale.tool.download) }).click();
    expect((await event).suggestedFilename()).toMatch(/^microphone-test\.(webm|m4a|ogg|wav)$/);
    await page.getByRole('button', { name: locale.tool.discard, exact: true }).click();
    await expect(start).toBeVisible();
  }
});

test('changing language releases an active recording and starts a fresh tool', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext(); const destination = context.createMediaStreamDestination();
      window.localeTestTrack = destination.stream.getAudioTracks()[0]; return destination.stream;
    };
  });
  await page.goto('/es/prueba-microfono');
  await page.getByRole('button', { name: locales.find(item => item.code === 'es').tool.start, exact: true }).click();
  await expect(page.locator('[role=meter]')).toBeVisible();
  await page.locator('.localized-mic .language-directory').getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/mikrofon-test$/);
  await expect.poll(() => page.evaluate(() => window.localeTestTrack.readyState)).toBe('ended');
  await expect(page.locator('[role=meter]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: locales.find(item => item.code === 'de').tool.start, exact: true })).toBeVisible();
});
