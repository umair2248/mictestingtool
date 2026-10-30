import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
// Local test server models the static URL mapping; .htaccess is checked separately.
createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (/^\/blog\/sample-post(?:\/index\.html)?\/?$/.test(pathname)) { res.writeHead(301, { Location: '/blog/how-to-test-your-microphone' }); res.end(); return; }
  if (pathname === '/test' || pathname === '/blogs-list') { res.writeHead(301, { Location: pathname === '/test' ? '/' : '/blog' }); res.end(); return; }
  if (pathname !== '/' && pathname.endsWith('/')) { res.writeHead(301, { Location: pathname.slice(0, -1) }); res.end(); return; }
  let file = resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
  let status = 200;
  try { if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html'); await stat(file); }
  catch { file = resolve(root, '404.html'); status = 404; }
  res.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(4173, 'localhost', () => console.log('Static build test server: http://localhost:4173'));
