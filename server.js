// Zero-dependency static server for Render
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

function send(req, res, file) {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); return res.end('Serverfehler'); }
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    };
    const compressible = /text|javascript|json|svg/.test(headers['Content-Type']);
    if (compressible && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      return res.end(zlib.gzipSync(data));
    }
    res.writeHead(200, headers);
    res.end(data);
  });
}

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/healthz') { res.writeHead(200); return res.end('ok'); }

  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }

  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return send(req, res, file);
    if (!err && st.isDirectory() && fs.existsSync(path.join(file, 'index.html'))) return send(req, res, path.join(file, 'index.html'));
    send(req, res, path.join(ROOT, 'index.html')); // SPA fallback
  });
}).listen(PORT, () => console.log(`Konkurrenz-App läuft auf Port ${PORT}`));
