import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createSpeakerSignal, speakerModes } from '../src/utils/speakerSignal.js';

const context = { sampleRate: 8000, createBuffer(channels, length, rate) { const data = Array.from({ length: channels }, () => new Float32Array(length)); return { length, sampleRate: rate, getChannelData: index => data[index] }; } };
const energy = data => data.reduce((sum, value) => sum + value * value, 0);
for (const mode of Object.keys(speakerModes)) {
  const buffer = createSpeakerSignal(context, mode);
  assert.equal(buffer.length, context.sampleRate * speakerModes[mode].duration);
  const left = buffer.getChannelData(0), right = buffer.getChannelData(1);
  assert.ok(left.every(value => Number.isFinite(value) && Math.abs(value) <= .5));
  assert.ok(right.every(value => Number.isFinite(value) && Math.abs(value) <= .5));
  if (mode === 'left') { assert.ok(energy(left) > 0); assert.equal(energy(right), 0); }
  if (mode === 'right') { assert.equal(energy(left), 0); assert.ok(energy(right) > 0); }
  if (mode === 'both') assert.deepEqual(left, right);
  if (mode === 'sequence') {
    const segment = 2 * context.sampleRate;
    assert.ok(energy(left.slice(0, segment)) > 0); assert.equal(energy(right.slice(0, segment)), 0);
    assert.equal(energy(left.slice(segment, 2 * segment)), 0); assert.ok(energy(right.slice(segment, 2 * segment)) > 0);
    assert.deepEqual(left.slice(2 * segment), right.slice(2 * segment));
    assert.ok(energy(left.slice(2 * segment)) > 0);
  }
  assert.equal(Math.abs(left[0]), 0); assert.equal(Math.abs(right.at(-1)), 0);
}
assert.throws(() => createSpeakerSignal(context, 'invalid'));
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const route = '/speaker-test';
  assert.ok(routes().includes(route) && sitemapRoutes().some(item => item.path === route));
  const seo = getSEO(route);
  assert.equal(seo.canonical, 'https://mictestingtool.com/speaker-test');
  assert.ok(!seo.noindex && !seo.isTool);
  const schemas = getSchemas(seo);
  assert.ok(schemas.some(item => item['@type'] === 'WebApplication' && item.url === seo.canonical));
  assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList'));
  const html = await render(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].length, 0);
  assert.ok(html.includes('<noscript>') && html.includes('Play left channel') && html.includes('Start headset microphone test'));
  for (const match of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`));
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(match[1]), match[1]);
  console.log('Speaker source checks passed: channel isolation, stereo sequence, amplitude/fades, metadata/schema, static rendering, links and sitemap registration. No production build.');
} finally { await server.close(); }
