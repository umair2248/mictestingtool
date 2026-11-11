import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { createSurroundSignal, surroundLayouts, SEGMENT } from '../src/utils/surroundSignal.js';

const context = { sampleRate: 8000, createBuffer(channels, length, rate) { const data = Array.from({ length: channels }, () => new Float32Array(length)); return { length, sampleRate: rate, numberOfChannels: channels, getChannelData: index => data[index] }; } };
const energy = data => data.reduce((sum, value) => sum + value * value, 0);
const segment = SEGMENT * context.sampleRate;

for (const [layout, channels] of Object.entries(surroundLayouts)) {
  assert.equal(channels.length, layout === '5.1' ? 6 : 8);
  assert.deepEqual(channels.slice(0, 4).map(item => item.id), ['fl', 'fr', 'c', 'lfe']);
  // Each single-channel test puts sound in that channel and true silence everywhere else.
  for (let target = 0; target < channels.length; target++) {
    const buffer = createSurroundSignal(context, layout, target);
    assert.equal(buffer.numberOfChannels, channels.length);
    assert.equal(buffer.length, segment);
    for (let channel = 0; channel < channels.length; channel++) {
      const data = buffer.getChannelData(channel);
      assert.ok(data.every(value => Number.isFinite(value) && Math.abs(value) <= .5));
      if (channel === target) assert.ok(energy(data) > 0, `${layout} channel ${channel} has sound`);
      else assert.equal(energy(data), 0, `${layout} channel ${channel} silent while testing ${target}`);
      assert.equal(Math.abs(data[0]), 0); assert.equal(Math.abs(data.at(-1)), 0);
    }
  }
  // The sequence walks the channels in order, one segment each.
  const sequence = createSurroundSignal(context, layout, 'sequence');
  assert.equal(sequence.length, segment * channels.length);
  for (let channel = 0; channel < channels.length; channel++) {
    const data = sequence.getChannelData(channel);
    for (let slot = 0; slot < channels.length; slot++) {
      const part = data.slice(slot * segment, (slot + 1) * segment);
      if (slot === channel) assert.ok(energy(part) > 0); else assert.equal(energy(part), 0);
    }
  }
  // The LFE channel uses a low tone: far fewer zero crossings than a 440 Hz channel.
  const crossings = data => data.reduce((count, value, i) => count + (i && Math.sign(value) !== Math.sign(data[i - 1]) && value !== 0 && data[i - 1] !== 0 ? 1 : 0), 0);
  assert.ok(crossings(createSurroundSignal(context, layout, 3).getChannelData(3)) * 4 < crossings(createSurroundSignal(context, layout, 0).getChannelData(0)));
}
assert.throws(() => createSurroundSignal(context, '9.1', 0));
assert.throws(() => createSurroundSignal(context, '5.1', 6));
assert.throws(() => createSurroundSignal(context, '5.1', 'left'));

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const route = '/surround-sound-test';
  assert.ok(routes().includes(route) && sitemapRoutes().some(item => item.path === route));
  const seo = getSEO(route);
  assert.equal(seo.canonical, 'https://mictestingtool.com/surround-sound-test');
  assert.ok(!seo.noindex && !seo.isTool);
  assert.ok(existsSync(`public${seo.image}`), 'Cover image');
  const schemas = getSchemas(seo);
  assert.ok(schemas.some(item => item['@type'] === 'WebApplication' && item.url === seo.canonical));
  assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList'));
  const html = await render(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].length, 0);
  assert.ok(html.includes('<noscript>') && html.includes('Play all channels in order') && html.includes('Subwoofer (LFE)') && html.includes('Rear left'));
  for (const match of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Local fragment ${match[1]}`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(match[1]), match[1]);
  for (const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"]+)"[^>]*>/g)) { assert.ok(existsSync(`public${match[1]}`), match[1]); assert.ok(/\balt="[^"]+"/.test(match[0])); }
  assert.ok((await render('/speaker-test')).includes('href="/surround-sound-test"'), 'Speaker test links to the surround test');
  console.log('Surround source checks passed: 5.1/7.1 channel isolation, sequence order, LFE tone, metadata/schema, static rendering, links, images and sitemap registration. No production build.');
} finally { await server.close(); }
