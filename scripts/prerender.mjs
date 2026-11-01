import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { render, routes, sitemapRoutes } from '../dist-ssr/entry-server.js';
import { getLocale, getPageLanguage } from '../src/data/locales.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'dist/.vite/manifest.json'), 'utf8'));
const pageModules = { '/': 'HomePage.jsx', '/speaker-test': 'SpeakerTest.jsx', '/webcam-test': 'WebcamTest.jsx', '/features': 'Features.jsx', '/blog': 'blogs.jsx', '/faq': 'faqs.jsx', '/contact': 'Contact.jsx', '/privacy': 'PrivacyPolicy.tsx', '/login': 'AuthPage.jsx', '/signup': 'AuthPage.jsx', '/admin/editor': 'AdminBlogEditor.jsx' };
function routeAssets(path) {
  const name = getLocale(path) ? 'LocalizedMicPage.jsx' : path.startsWith('/blog/') ? 'BlogPostPage.jsx' : pageModules[path];
  if (!name) return '';
  const seen = new Set();
  const tags = new Set();
  function visit(key) {
    if (seen.has(key) || !manifest[key]) return;
    seen.add(key);
    const chunk = manifest[key];
    if (chunk.file.endsWith('.js')) tags.add(`<link rel="modulepreload" crossorigin href="/${chunk.file}" />`);
    for (const css of chunk.css || []) if (!template.includes(`/${css}`)) tags.add(`<link rel="stylesheet" crossorigin href="/${css}" />`);
    for (const dependency of chunk.imports || []) visit(dependency);
  }
  visit(`src/pages/${name}`);
  return [...tags].join('\n');
}
const paths = [...routes(), '/404'];
for (const path of paths) {
  const markup = await render(path);
  // React 19 hoists metadata during server rendering. Place it in the document
  // head, where hydrateRoot can reuse it on first load and update it on navigation.
  const tags = [];
  const body = markup.replace(/<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>/g, tag => { tags.push(tag); return ''; });
  const html = template.replace(/<html\b[^>]*>/, `<html lang="${getPageLanguage(path)}" dir="ltr">`).replace('<!--seo-head-->', `${tags.join('\n')}\n${routeAssets(path)}`).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${body}</div>`);
  if (!html.includes('<h1') || html.includes('<!--seo-head-->')) throw new Error(`Incomplete prerender: ${path}`);
  const file = path === '/404' ? resolve(root, 'dist/404.html') : resolve(root, 'dist', path.slice(1), 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const xmlEscape = text => text.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]);
const entries = sitemapRoutes().map(({ path, modified, image }) => {
  const lastmod = modified && Number.isFinite(Date.parse(modified)) ? `<lastmod>${new Date(modified).toISOString()}</lastmod>` : '';
  const imageTag = image ? `<image:image><image:loc>${xmlEscape(`https://mictestingtool.com${image}`)}</image:loc></image:image>` : '';
  return `  <url><loc>${xmlEscape(`https://mictestingtool.com${path}`)}</loc>${lastmod}${imageTag}</url>`;
});
await writeFile(resolve(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join('\n')}\n</urlset>\n`);

// Deterministic per-page hashes help reviewers compare builds without fake dates.
const checksums = {};
for (const path of paths) {
  const file = path === '/404' ? resolve(root, 'dist/404.html') : resolve(root, 'dist', path.slice(1), 'index.html');
  checksums[path] = createHash('sha256').update(await readFile(file)).digest('hex');
}
await writeFile(resolve(root, 'dist-ssr/page-checksums.json'), JSON.stringify(checksums, null, 2));
console.log(`Prerendered ${paths.length} pages; generated sitemap.xml.`);
