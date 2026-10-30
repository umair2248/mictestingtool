// Dev SSR checks only. No production build, dist files or upload ZIPs are created.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { getArticleOutline } from '../src/utils/articleOutline.js';

assert.deepEqual(getArticleOutline('## Check\n## Check\n```md\n## Not a heading\n```').map(item => item.id), ['check','check-2']);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const { getBlogPost, parseFrontmatter } = await server.ssrLoadModule('/src/utils/posts.js');
  assert.equal(parseFrontmatter('\uFEFF---\ntitle: "BOM check"\n---\nText').metadata.title, 'BOM check');
  const articles = {
    'how-to-test-your-microphone': { modified: '2026-10-26', sources: ['support.microsoft.com','support.apple.com','support.google.com'] },
    'how-to-connect-set-up-microphone': { modified: '2026-10-26', sources: ['support.microsoft.com','support.apple.com','playstation.com','xbox.com'] },
    'how-to-test-mic-windows-11': { modified: '2026-10-31', sources: ['support.microsoft.com'] },
  };
  for (const [slug, expected] of Object.entries(articles)) {
  const path = `/blog/${slug}`;
  const post = getBlogPost(slug);
  const seo = getSEO(path);
  assert.equal(seo.title, post.seoTitle);
  assert.equal(seo.canonical, `https://mictestingtool.com${path}`);
  assert.ok(!seo.noindex);
  assert.equal(post.modified, expected.modified);
  assert.ok(routes().includes(path));
  assert.equal(sitemapRoutes().find(item => item.path === path).modified, post.modified);
  const html = await render(path);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.ok(html.includes('On this page') && html.includes(`dateTime="${expected.modified}"`));
  for (const item of getArticleOutline(post.content)) {
    assert.ok(html.includes(`id="${item.id}"`), `Heading target: ${item.id}`);
    if (item.level === 2) assert.ok(html.includes(`href="#${item.id}"`), `Contents link: ${item.id}`);
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Local fragment ${match[1]}`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) assert.ok(routes().includes(decodeURIComponent(match[1])), `Registered internal target: ${match[1]}`);
  const article = getSchemas(seo).find(schema => schema['@type'] === 'BlogPosting');
  assert.equal(article.headline, post.title);
  assert.equal(article.datePublished, post.date);
  assert.equal(article.dateModified, post.modified);
  assert.equal(article.inLanguage, 'en');
  assert.equal(article.author.url, `${seo.canonical}#article-author`);
  assert.ok(!getSchemas(seo).some(schema => ['FAQPage','HowTo'].includes(schema['@type'])));
  assert.equal([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].length, 0, 'No nonexistent article translations');
  for (const name of expected.sources) assert.ok(post.content.includes(name), `Source link: ${name}`);
  if (post.image) {
    assert.ok(existsSync(`public${post.image}`), `Cover image: ${post.image}`);
    assert.equal(article.image, `https://mictestingtool.com${post.image}`);
    assert.ok(post.imageAlt && html.includes(`src="${post.image}"`));
  }
  for (const match of html.matchAll(/<img\b[^>]*src="(\/blog\/[^"]+)"[^>]*>/g)) {
    assert.ok(existsSync(`public${match[1]}`), `Image file: ${match[1]}`);
    assert.ok(/\balt="[^"]+"/.test(match[0]), `Image alt text: ${match[1]}`);
  }
  const count = post.content.split(/\s+/).filter(Boolean).length;
  console.log(`${slug}: source checks passed: ${count} whitespace-delimited words, ${getArticleOutline(post.content).filter(item => item.level === 2).length} sections, metadata, anchors, schema and sitemap registration. No production build.`);
  }
} finally { await server.close(); }
