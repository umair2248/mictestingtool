// Dev SSR checks only. No production build, dist files or upload ZIPs are created.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { createStats, recordDown, recordUp, summarize } from '../src/utils/clickAnalysis.js';

// Click timing: slow clicks pass, a 9 ms second press is a double click.
let stats = createStats();
let result = recordDown(stats, 'left', 1000, 80); stats = recordUp(result.stats, 'left', 1090);
assert.equal(result.event.interval, null);
assert.equal(result.event.suspicious, false);
result = recordDown(stats, 'left', 1700, 80); stats = recordUp(result.stats, 'left', 1790);
assert.equal(result.event.interval, 700);
assert.equal(result.event.suspicious, false);
result = recordDown(stats, 'left', 1709, 80); stats = result.stats;
assert.equal(result.event.suspicious, true, 'Down-to-down 9 ms is flagged');
assert.equal(stats.left.doubles, 1);
assert.equal(stats.left.clicks, 3);
assert.equal(stats.left.fastest, 9);
// Threshold is respected.
assert.equal(recordDown(createStats(), 'right', 0, 80).event.suspicious, false);
let s2 = recordDown(createStats(), 'right', 0, 80).stats;
assert.equal(recordDown(s2, 'right', 79, 80).event.suspicious, true);
assert.equal(recordDown(s2, 'right', 80, 80).event.suspicious, false);
assert.equal(recordDown(s2, 'right', 79, 50).event.suspicious, false);
// Release bounce: long hold, release, re-press 6 ms later.
let s3 = recordDown(createStats(), 'left', 0, 80).stats;
s3 = recordUp(s3, 'left', 900);
assert.equal(recordDown(s3, 'left', 906, 80).event.suspicious, true, 'Release bounce is flagged');
assert.equal(recordDown(s3, 'left', 1100, 80).event.suspicious, false);
// Buttons are independent.
let s4 = recordDown(createStats(), 'left', 0, 80).stats;
assert.equal(recordDown(s4, 'right', 10, 80).event.suspicious, false);
// Summary.
assert.equal(summarize(createStats()).tone, 'idle');
assert.equal(summarize(stats).tone, 'bad');
let clean = createStats();
for (let i = 0; i < 25; i++) { clean = recordDown(clean, 'left', i * 600, 80).stats; clean = recordUp(clean, 'left', i * 600 + 90); }
assert.equal(summarize(clean).tone, 'good');

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const route = '/double-click-test';
  assert.ok(routes().includes(route) && sitemapRoutes().some(item => item.path === route));
  const seo = getSEO(route);
  assert.equal(seo.canonical, 'https://mictestingtool.com/double-click-test');
  assert.ok(!seo.noindex && !seo.isTool && seo.isDoubleClick);
  assert.ok(seo.title.length <= 60 && seo.description.length <= 160, `Title ${seo.title.length} and description ${seo.description.length} length`);
  assert.ok(existsSync(`public${seo.image}`), 'Social image');
  const schemas = getSchemas(seo);
  assert.ok(schemas.some(item => item['@type'] === 'WebApplication' && item.url === seo.canonical && item.featureList.length));
  assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList'));
  const html = await render(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].length, 0);
  assert.ok(html.includes('<noscript>') && html.includes('Mouse Double Click Test') && html.includes('Double click threshold'));
  for (const match of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Local fragment ${match[1]}`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(match[1]), match[1]);
  for (const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"]+)"[^>]*>/g)) {
    assert.ok(existsSync(`public${match[1]}`), `Image file: ${match[1]}`);
    assert.ok(/\balt="[^"]+"/.test(match[0]), `Image alt text: ${match[1]}`);
  }
  assert.ok(html.includes('href="/blog/mouse-double-clicking"'), 'Links to the fix guide');
  assert.ok((await render('/blog/mouse-double-clicking')).includes('href="/double-click-test"'), 'Linked from the fix guide');
  console.log('Double click test source checks passed: click timing, thresholds, release bounce, summary, metadata/schema, static rendering, images, links and sitemap registration. No production build.');
} finally { await server.close(); }
