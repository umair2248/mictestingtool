// Dev SSR checks only. No production build, dist files or upload ZIPs are created.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { getArticleOutline } from '../src/utils/articleOutline.js';

assert.deepEqual(getArticleOutline('## Check\n## Check\n```md\n## Not a heading\n```').map(item => item.id), ['check','check-2']);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, routes, sitemapRoutes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const { getSEO, getSchemas } = await server.ssrLoadModule('/src/components/SEO.jsx');
  const { getBlogPost, parseFrontmatter } = await server.ssrLoadModule('/src/utils/posts.js');
  assert.equal(parseFrontmatter('\uFEFF---\ntitle: "BOM check"\n---\nText').metadata.title, 'BOM check');
  for (const slug of ['how-to-test-your-microphone', 'how-to-connect-set-up-microphone']) {
  const path = `/blog/${slug}`;
  const post = getBlogPost(slug);
  const seo = getSEO(path);
  assert.equal(seo.title, post.seoTitle);
  assert.equal(seo.canonical, `https://mictestingtool.com${path}`);
  assert.ok(!seo.noindex);
  assert.equal(post.modified, '2026-10-26');
  assert.ok(routes().includes(path));
  assert.equal(sitemapRoutes().find(item => item.path === path).modified, post.modified);
  const html = await render(path);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.ok(html.includes('On this page') && html.includes('dateTime="2026-10-26"'));
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
  for (const name of ['support.microsoft.com','support.apple.com', ...(slug === 'how-to-test-your-microphone' ? ['support.google.com'] : ['playstation.com','xbox.com'])]) assert.ok(post.content.includes(name));
  const count = post.content.split(/\s+/).filter(Boolean).length;
  console.log(`${slug}: source checks passed: ${count} whitespace-delimited words, ${getArticleOutline(post.content).filter(item => item.level === 2).length} sections, metadata, anchors, schema and sitemap registration. No production build.`);
  }
} finally { await server.close(); }
