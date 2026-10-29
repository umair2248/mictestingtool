import { test, expect } from '@playwright/test';
import { stat } from 'node:fs/promises';
import { locales, languageVersions } from '../src/data/locales.js';

test('built translations contain readable content and reciprocal language tags without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const locale of locales) {
    const response = await page.goto(`http://localhost:4173${locale.path}`);
    expect(response.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('h1')).toHaveText(locale.h1);
    await expect(page).toHaveTitle(locale.title);
    await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', `https://mictestingtool.com${locale.path}`);
    await expect(page.locator('head > link[rel=alternate]')).toHaveCount(languageVersions.length + 1);
    await expect(page.locator('head > meta[name=robots]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
    await expect(page.getByRole('button', { name: locale.tool.start, exact: true })).toBeVisible();
  }
  await context.close();
});

test('public pages have content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ['/', '/speaker-test', '/webcam-test', '/features', '/blog', '/blog/how-to-test-your-microphone', '/blog/how-to-connect-set-up-microphone', '/faq', '/contact', '/privacy', '/terms', '/security']) {
    const response = await page.goto(`http://localhost:4173${route}`);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('head > title')).toHaveCount(1);
    await expect(page.locator('head > meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('head > link[rel="canonical"]')).toHaveAttribute('href', `https://mictestingtool.com${route}`);
  }
  await page.goto('http://localhost:4173/blog/how-to-test-your-microphone');
  await expect(page.locator('article')).toContainText('How to test a mic on a Windows PC');
  await context.close();
});

test('hydration, client navigation, metadata, FAQ search, and article links work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|Minified React error/.test(message.text())) errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /start free microphone test/i })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('footer').getByRole('link', { name: 'All Guides', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page).toHaveTitle('Microphone Testing Guides | Mic Testing Tool');
  await expect(page.locator('head > title')).toHaveCount(1);
  await expect(page.locator('head > meta[name="description"]')).toHaveCount(1);
  await page.getByRole('link', { name: 'How to Test Your Microphone: A Step-by-Step Guide', exact: true }).first().click();
  await expect(page.locator('h1')).toHaveText('How to Test Your Microphone: A Step-by-Step Guide');
  await expect(page.locator('head > link[rel="canonical"]')).toHaveAttribute('href', 'https://mictestingtool.com/blog/how-to-test-your-microphone');
  await page.goto('/faq');
  await page.getByRole('searchbox').fill('latency');
  await expect(page.locator('main details')).toHaveCount(1);
  await page.locator('main summary').click();
  await expect(page.getByText('No. It shows the audio context', { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('missing pages, robots, sitemap, redirects, and private routes', async ({ request, page }) => {
  expect((await request.get('/does-not-exist')).status()).toBe(404);
  expect((await request.get('/blog/no-such-article')).status()).toBe(404);
  const robots = await request.get('/robots.txt');
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toContain('Sitemap: https://mictestingtool.com/sitemap.xml');
  expect((await request.get('/sitemap.xml')).headers()['content-type']).toContain('application/xml');
  expect((await request.get('/blogs-list', { maxRedirects: 0 })).status()).toBe(301);
  for (const route of ['/login', '/signup', '/admin/editor']) {
    await page.goto(route);
    await expect(page.locator('head > meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  }
  await expect(page.getByRole('heading', { name: 'Publish a Markdown article' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Article' })).toHaveCount(0);
});

test('microphone recording and playback work with a synthetic audio device', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Chromium's default fake capture is silent on this platform. Feed a known
  // tone through real Web Audio and MediaRecorder APIs, without hardware access.
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const tone = context.createOscillator();
      const gain = context.createGain();
      const destination = context.createMediaStreamDestination();
      tone.frequency.value = 440;
      gain.gain.value = 0.2;
      tone.connect(gain).connect(destination);
      await context.resume();
      tone.start();
      return destination.stream;
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /start free microphone test/i }).click();
  await expect(page.getByRole('meter', { name: 'Relative microphone input level' })).toBeVisible();
  await expect(page.getByText('This is not a calibrated decibel or latency measurement.')).toBeVisible();
  await expect.poll(() => page.locator('[role=meter]').getAttribute('aria-valuenow')).not.toBe('0');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await expect(page.locator('audio')).toHaveAttribute('src', /^blob:/);
  await expect.poll(() => page.locator('audio').evaluate(audio => audio.readyState)).toBeGreaterThan(0);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: /Download recording/ }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/^microphone-test\.(webm|m4a|ogg|wav)$/);
  expect((await stat(await download.path())).size).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Discard recording' }).click();
  await expect(page.getByRole('button', { name: /start free microphone test/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('homepage explains the complete test flow without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto('http://localhost:4173/');
  await expect(page).toHaveTitle('Mic Test - Free Online Microphone Test & Recorder');
  for (const name of ['How to test your microphone online', 'What do your microphone test results mean?', 'Why is my microphone not working?', 'Your microphone recording stays local', 'Online mic test: frequently asked questions']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('#how-to-test li')).toHaveCount(5);
  await expect(page.locator('#mic-faq details')).toHaveCount(8);
  expect(await response.text()).toContain('<noscript><p class="home-error">JavaScript is required');
  await context.close();
});

test('permission denial is recoverable and cancellation ignores a late microphone stream', async ({ page }) => {
  await page.addInitScript(() => {
    let attempt = 0;
    navigator.mediaDevices.getUserMedia = async () => {
      if (++attempt === 1) throw new DOMException('Permission denied', 'NotAllowedError');
      return new Promise(resolve => { window.resolveTestStream = resolve; });
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /start free microphone test/i }).click();
  await expect(page.getByRole('alert')).toContainText('Microphone access was denied');
  await page.getByRole('button', { name: /start free microphone test/i }).click();
  await page.getByRole('button', { name: 'Cancel test' }).click();
  await page.evaluate(() => {
    window.lateStreamStopped = false;
    window.resolveTestStream({ getTracks: () => [{ stop() { window.lateStreamStopped = true; } }] });
  });
  await expect.poll(() => page.evaluate(() => window.lateStreamStopped)).toBe(true);
  await expect(page.getByRole('button', { name: /start free microphone test/i })).toBeVisible();
  await expect(page.locator('[role=meter]')).toHaveCount(0);
});

test('public pages fit a mobile viewport and preserve the nested-route logo', async ({ page }) => {
  for (const route of ['/', '/speaker-test', '/webcam-test', '/features', '/blog', '/blog/how-to-test-your-microphone', '/blog/how-to-connect-set-up-microphone', '/faq', '/contact', '/privacy', '/terms', '/security']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBeTruthy();
    expect(await page.locator('.brand-mark__logo').evaluate(image => image.complete && image.naturalWidth > 0), route).toBeTruthy();
  }
  await page.goto('/');
  await expect(page.getByRole('button', { name: /start free microphone test/i })).toBeInViewport();
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/home-mobile-top.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'test-results/home-desktop-top.png' });
});

 test('mobile and tablet menu works, traps focus, closes, and restores scrolling', async ({ page }) => {
 for (const width of [320, 390, 768, 900]) {
  await page.setViewportSize({ width, height: 844 }); await page.goto('/blog');
  const trigger = page.getByRole('button', { name: 'Open mobile menu' });
  await trigger.click(); await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('link', { name: 'Test your microphone', exact: true })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(trigger).toBeFocused();
  await trigger.click(); await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'FAQ', exact: true }).click();
  await expect(page).toHaveURL(/\/faq$/); await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await trigger.click(); await page.setViewportSize({ width: 1200, height: 844 });
  await expect(page.getByRole('dialog')).toHaveCount(0); expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
 }
 });
 test('article migration, spacing and header are correct', async ({ page, request }) => {
  const res = await request.get('/blog/sample-post', { maxRedirects: 0 }); expect(res.status()).toBe(301); expect(res.headers().location).toBe('/blog/how-to-test-your-microphone');
  for (const width of [390, 900, 1440]) {
   await page.setViewportSize({ width, height: 1000 });
   for (const route of ['/blog', '/blog/how-to-test-your-microphone', '/privacy']) {
    await page.goto(route); const header=await page.locator('.site-header').boundingBox(); const h1=await page.locator('h1').boundingBox(); expect(h1.y).toBeGreaterThanOrEqual(header.y+header.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('main').getByText('English', { exact: true })).toHaveCount(0);
   }
  }
  await page.screenshot({ path: 'test-results/privacy-desktop.png' });
  await page.goto('/blog/how-to-test-your-microphone'); await page.screenshot({ path: 'test-results/article-desktop.png' });
  await page.setViewportSize({width:390,height:844}); await page.goto('/blog'); await page.screenshot({path:'test-results/blog-mobile.png'});
  await page.getByRole('button',{name:'Open mobile menu'}).click(); await page.screenshot({path:'test-results/menu-mobile.png'});
 });
