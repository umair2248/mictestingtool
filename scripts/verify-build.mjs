import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes, sitemapRoutes } from '../dist-ssr/entry-server.js';
import { getLocale, getPageLanguage, languageVersions } from '../src/data/locales.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const titles = new Set();
for (const route of [...routes(), '/404']) {
  const file = route === '/404' ? resolve(root, '404.html') : resolve(root, route.slice(1), 'index.html');
  const html = await readFile(file, 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  const title = head.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert.ok(title && title !== 'mic-testing-tool', `${route}: meaningful title in head`);
  assert.ok(!titles.has(title), `${route}: unique title`);
  titles.add(title);
  assert.equal((head.match(/<title>/g) || []).length, 1, `${route}: exactly one title`);
  assert.equal((head.match(/name="description"/g) || []).length, 1, `${route}: exactly one description`);
  assert.ok(head.includes('rel="canonical"'), `${route}: canonical`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: one H1`);
  assert.ok(html.includes(`<html lang="${getPageLanguage(route)}"`), `${route}: correct static document language`);
  const locale = getLocale(route);
  const alternates = [...head.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].map(match => match[0]);
  if (route === '/' || locale) {
    assert.equal(alternates.length, languageVersions.length + 1, `${route}: complete language cluster plus x-default`);
    for (const item of [...languageVersions, { code: 'x-default', path: '/' }]) {
      assert.ok(alternates.some(tag => new RegExp(`hreflang="${item.code}"`, 'i').test(tag) && tag.includes(`href="https://mictestingtool.com${item.path}"`)), `${route}: alternate ${item.code}`);
    }
    assert.ok(head.includes(`href="https://mictestingtool.com${route}"`), `${route}: self-canonical`);
    assert.ok(html.includes('WebApplication'), `${route}: tool schema`);
    if (locale) { assert.ok(html.includes(locale.h1), `${route}: translated H1`); assert.ok(html.includes(locale.tool.start), `${route}: translated tool`); }
  } else assert.equal(alternates.length, 0, `${route}: no invented translations of other pages`);
  assert.ok(!html.includes('data:text/markdown') && !html.includes('Untitled Post'), `${route}: real content`);
  assert.ok(!html.includes('FAQ #') && !html.includes('1000 AUTOMATED'), `${route}: no generated FAQ spam`);
  for (const match of html.matchAll(/href="(\/[^"?#]*)[^"]*"/g)) {
    const path = decodeURIComponent(match[1]);
    const target = resolve(root, path.slice(1));
    let exists = false;
    try { exists = (await stat(target)).isFile() || (await stat(resolve(target, 'index.html'))).isFile(); } catch { /* Report broken links below. */ }
    assert.ok(exists, `${route}: internal link resolves: ${path}`);
  }
  if (route.startsWith('/blog/')) assert.ok(html.includes('BlogPosting') && html.includes('<article'), `${route}: article content/schema`);
  if (['/login', '/signup', '/admin/editor', '/404'].includes(route)) assert.ok(head.includes('noindex, follow'), `${route}: excluded from indexing`);
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
}
const xml = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
assert.equal((xml.match(/<url>/g) || []).length, sitemapRoutes().length);
for (const { path } of sitemapRoutes()) assert.ok(xml.includes(`https://mictestingtool.com${path}</loc>`), `Sitemap includes ${path}`);
for (const path of ['/login', '/signup', '/admin', '/404', '/blogs-list', '/test']) assert.ok(!xml.includes(`<loc>https://mictestingtool.com${path}</loc>`));
assert.ok((await readFile(resolve(root, 'robots.txt'), 'utf8')).startsWith('User-agent:'));
const rules = await readFile(resolve(root, '.htaccess'), 'utf8');
assert.ok(rules.includes('ErrorDocument 404 /404.html') && !rules.includes('RewriteRule . /index.html'));
const manifest = JSON.parse(await readFile(resolve(root, '.vite/manifest.json'), 'utf8'));
const entry = manifest['index.html'];
const size = (await stat(resolve(root, entry.file))).size;
assert.ok(size < 600_000, `Initial entry JS must remain below 600 KB (actual ${size})`);
assert.ok(Object.keys(manifest).some(key => key.endsWith('AdminBlogEditor.jsx') && manifest[key].isDynamicEntry), 'Editor is a separate dynamic entry');
console.log(`SEO verification passed for ${routes().length + 1} HTML pages. Entry JavaScript: ${(size / 1024).toFixed(1)} KiB.`);
