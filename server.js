// Minimal static server for hosting (Railway sets PORT). No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.png': 'image/png', '.svg': 'image/svg+xml' };
const PUBLIC = new Set(['/index.html', '/PROMPT.md', '/README.md', '/LICENSE']);

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/' || p === '') p = '/index.html';
  if (p === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  if (!PUBLIC.has(p)) { res.writeHead(302, { location: '/' }); return res.end(); }
  fs.readFile(path.join(ROOT, p), (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(p)] || 'text/plain; charset=utf-8',
      'cache-control': p === '/index.html' ? 'no-cache' : 'public, max-age=3600',
      'x-content-type-options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`Rain on Glass listening on :${PORT}`));
