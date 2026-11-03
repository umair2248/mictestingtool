// Dev SSR checks only. No production build, dist files or upload ZIPs are created.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { levelZone, rmsDb, smoothLevel, toLevel } from '../src/utils/noiseLevel.js';

assert.equal(rmsDb(new Float32Array(64)), -Infinity);
assert.equal(toLevel(-Infinity), 0);
assert.ok(Math.abs(rmsDb(new Float32Array(64).fill(1))) < 1e-9);
assert.ok(Math.abs(rmsDb(new Float32Array(64).fill(.1)) + 20) < 1e-6);
assert.equal(toLevel(-40), 60);
assert.equal(toLevel(-40, 10), 70);
assert.equal(toLevel(-200), 0);
assert.equal(toLevel(10), 100);
assert.ok(smoothLevel(0, 80, 1 / 60) > 0 && smoothLevel(0, 80, 1 / 60) < 80);
assert.ok(80 - smoothLevel(80, 0, 1 / 60) < 80 - (80 - smoothLevel(0, 80, 1 / 60)), 'Falls slower than it rises');
assert.equal(smoothLevel(50, 50, .1), 50);
assert.ok(Math.abs(smoothLevel(0, 80, 5) - 80) < 1, 'Settles on long gaps');
assert.equal(levelZone(80, 75), 'loud');
assert.equal(levelZone(75, 75), 'loud');
assert.equal(levelZone(66, 75), 'warn');
assert.equal(levelZone(64, 75), 'quiet');

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const route = '/noise-meter';
  assert.ok(routes().includes(route) && sitemapRoutes().some(item => item.path === route));
  const seo = getSEO(route);
  assert.equal(seo.canonical, 'https://mictestingtool.com/noise-meter');
  assert.ok(!seo.noindex && !seo.isTool && seo.isNoise);
  assert.ok(seo.title.length <= 60 && seo.description.length <= 160, 'Title and description length');
  assert.ok(existsSync(`public${seo.image}`), 'Social image');
  const schemas = getSchemas(seo);
  assert.ok(schemas.some(item => item['@type'] === 'WebApplication' && item.url === seo.canonical && item.featureList.length));
  assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList'));
  const html = await render(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].length, 0);
  assert.ok(html.includes('<noscript>') && html.includes('Start noise meter') && html.includes('Classroom mode') && html.includes('not a calibrated'));
  for (const match of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Local fragment ${match[1]}`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(match[1]), match[1]);
  for (const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"]+)"[^>]*>/g)) {
    assert.ok(existsSync(`public${match[1]}`), `Image file: ${match[1]}`);
    assert.ok(/\balt="[^"]+"/.test(match[0]), `Image alt text: ${match[1]}`);
  }
  assert.ok((await render('/')).includes('href="/noise-meter"'), 'Linked from the home page');
  console.log('Noise meter source checks passed: level maths, zones, smoothing, metadata/schema, static rendering, images, links and sitemap registration. No production build.');
} finally { await server.close(); }
