// BAZ Refocus — zero-dependency server.
// Serves the static site AND the permission-asset API (/api/subscribe).
// Run:  node server.js   →   http://localhost:4173
// No npm install. Uses only Node built-ins.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data', 'subscribers.json');
const PORT = process.env.PORT || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function readSubs() {
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); }
  catch { return []; }
}
function writeSubs(list) {
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, JSON.stringify(list, null, 2));
}
function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

const server = http.createServer((req, res) => {
  // --- API: permission asset (Part 6) ---
  if (req.method === 'POST' && req.url === '/api/subscribe') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      let parsed;
      try { parsed = JSON.parse(body); } catch { parsed = {}; }
      const name = (parsed.name || '').trim();
      const email = (parsed.email || '').trim().toLowerCase();
      const source = parsed.source || 'unknown';

      if (!email || !validEmail(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'A real email, please.' }));
      }

      const list = readSubs();
      const existing = list.find((s) => s.email === email);
      if (existing) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, status: 'already', count: list.length }));
      }

      list.push({ name, email, source, at: new Date().toISOString() });
      writeSubs(list);
      console.log(`[subscribe] ${email} (${source}) — total ${list.length}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, status: 'new', count: list.length }));
    });
    return;
  }

  if (req.url === '/api/subscribers' && req.method === 'GET') {
    const list = readSubs();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ count: list.length, subscribers: list }));
  }

  // --- Static files ---
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`BAZ refocus site running → http://localhost:${PORT}`);
  console.log(`Permission asset API → POST /api/subscribe`);
});
