// Local preview that matches the deployed site: serves the repo as static files and builds posts.json on every
// request, so the index loads one small file and each .md is fetched only when opened. Edits show on reload.
// Usage: npm run dev [-- port]   (default 8000)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { buildPosts } from './build-posts.mjs';

const port = +process.argv[2] || 8000;
const TYPES = { '.html': 'text/html', '.json': 'application/json', '.md': 'text/markdown', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html');
  const send = (code, body, type = 'text/plain') => { res.writeHead(code, { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'no-store' }); res.end(body); };
  try {
    if (path === '/posts.json') return send(200, JSON.stringify(buildPosts()), TYPES['.json']);
    const file = normalize(join('.', path));
    if (file.startsWith('..') || file.split(/[\\/]/).some(p => p.startsWith('.') || p === 'node_modules')) return send(404, 'not found');
    send(200, await readFile(file), TYPES[extname(file)] || 'application/octet-stream');
  } catch (err) {
    err.code === 'ENOENT' ? send(404, 'not found') : send(500, String(err.message));
  }
}).listen(port, () => console.log(`golden-convo preview: http://localhost:${port}`));
