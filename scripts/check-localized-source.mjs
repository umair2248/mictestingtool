// Checks source rendering via Vite's dev SSR loader. Does not build or write dist.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { locales, englishTool, languageVersions, getPageLanguage, toolKeys } from '../src/data/locales.js';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  assert.equal(locales.length, 8);
  assert.equal(new Set(languageVersions.map(item => item.path)).size, languageVersions.length);
  assert.equal(new Set(languageVersions.map(item => item.code)).size, languageVersions.length);
  for (const locale of locales) {
    assert.match(locale.path, /^\/[a-z]{2}\/[a-z0-9-]+$/);
    assert.ok(routes().includes(locale.path));
    assert.ok(sitemapRoutes().some(item => item.path === locale.path));
    assert.equal(getPageLanguage(locale.path), locale.code);
    assert.deepEqual(Object.keys(locale.tool), toolKeys);
    assert.ok(Object.values(locale.tool).every(value => typeof value === 'string' && value.length > 0));
    assert.notEqual(locale.tool.start, englishTool.start);
    assert.ok(locale.steps.length >= 4 && locale.fixes.length >= 4 && locale.faqs.length >= 3);
    const seo = getSEO(locale.path);
    assert.equal(seo.canonical, `https://mictestingtool.com${locale.path}`);
    assert.equal(seo.noindex, undefined);
    assert.equal(getSchemas(seo).find(schema => schema['@type'] === 'WebApplication').inLanguage, locale.code);
  }
  for (const item of languageVersions) {
    const html = await render(item.path);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${item.path}: one H1`);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.ok(html.includes('rel="canonical"'));
    const alternateTags = [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].map(match => match[0]);
    assert.equal(alternateTags.length, languageVersions.length + 1, `${item.path}: hreflang count`);
    for (const version of [...languageVersions, { code: 'x-default', path: '/' }]) {
      assert.ok(alternateTags.some(tag => new RegExp(`hreflang="${version.code}"`, 'i').test(tag) && tag.includes(`href="https://mictestingtool.com${version.path}"`)), `${item.path}: reciprocal ${version.code}`);
    }
    assert.ok(html.includes('<noscript>'));
    if (item.code !== 'en') {
      assert.ok(html.includes(item.h1) && html.includes(item.tool.start));
      assert.ok(!html.includes('Start Free Microphone Test'));
      assert.ok(!html.includes('noindex'));
    }
  }
  assert.equal(getSEO('/xx/fake-test').noindex, true);
  assert.equal(getSEO('/fr/not-a-translation').noindex, true);
  const prerender = await readFile(new URL('./prerender.mjs', import.meta.url), 'utf8');
  assert.ok(prerender.includes('getPageLanguage(path)') && prerender.includes("'LocalizedMicPage.jsx'"));
  console.log(`Localized source checks passed: ${locales.length} translations, recording labels, reciprocal hreflang, self-canonicals, schema and prerender registration. No production build was run.`);
} finally { await server.close(); }
