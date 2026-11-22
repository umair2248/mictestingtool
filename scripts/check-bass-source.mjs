// Dev SSR checks only. No production build, dist files or upload ZIPs are created.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { BASS_TONES, clampFrequency, describeRange, sweepFrequency } from '../src/utils/bassSignal.js';

assert.equal(Math.round(sweepFrequency(0, 'up')), 20);
assert.equal(Math.round(sweepFrequency(30, 'up')), 200);
assert.equal(Math.round(sweepFrequency(0, 'down')), 200);
assert.equal(Math.round(sweepFrequency(30, 'down')), 20);
assert.ok(Math.abs(sweepFrequency(15, 'up') - Math.sqrt(20 * 200)) < 1e-9, 'Exponential sweep: halfway is the geometric mean');
assert.equal(Math.round(sweepFrequency(99, 'up')), 200, 'Clamped past the end');
assert.equal(clampFrequency(5), 20);
assert.equal(clampFrequency(999), 200);
assert.equal(clampFrequency(44.6), 45);
assert.throws(() => clampFrequency(NaN));
assert.ok(BASS_TONES.every(hz => hz >= 20 && hz <= 200));
assert.ok(describeRange(30).startsWith('Sub-bass') && describeRange(80).startsWith('Bass'));

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const route = '/bass-test';
  assert.ok(routes().includes(route) && sitemapRoutes().some(item => item.path === route));
  const seo = getSEO(route);
  assert.equal(seo.canonical, 'https://mictestingtool.com/bass-test');
  assert.ok(!seo.noindex && seo.isBass);
  assert.ok(existsSync(`public${seo.image}`), 'Social image');
  assert.ok(getSchemas(seo).some(item => item['@type'] === 'WebApplication' && item.url === seo.canonical));
  const html = await render(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.ok(html.includes('<noscript>') && html.includes('Sweep up 20 → 200 Hz') && html.includes('Turn your volume down first.'));
  for (const match of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Local fragment ${match[1]}`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(match[1]), match[1]);
  for (const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"]+)"[^>]*>/g)) assert.ok(existsSync(`public${match[1]}`), `Image file: ${match[1]}`);
  assert.ok((await render('/speaker-test')).includes('href="/bass-test"'), 'Linked from the speaker test');
  assert.ok((await render('/surround-sound-test')).includes('href="/bass-test"'), 'Linked from the surround test');
  const home = await render('/');
  for (const path of ['/bass-test', '/double-click-test', '/noise-meter', '/surround-sound-test']) assert.ok(home.includes(`href="${path}"`), `Tools menu or footer: ${path}`);
  console.log('Bass test source checks passed: sweep maths, clamping, metadata/schema, static rendering, images, links, tools menu and sitemap registration. No production build.');
} finally { await server.close(); }
