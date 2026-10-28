/**
 * Simple Zero-Dependency Static File Server for Testing & Development
 * Powered by Node.js built-in modules
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle stats API endpoint
  if (pathname === '/api/stats.php' || pathname === '/api/stats') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const statsFile = path.join(ROOT, 'data', 'stats.json');
    const DEFAULT_BASELINE = 372;
    let stats = { visits: DEFAULT_BASELINE, lastUpdated: new Date().toISOString() };

    try {
      if (fs.existsSync(statsFile)) {
        const parsed = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
        stats.visits = (parsed.visits || DEFAULT_BASELINE) + (parsed.clicks || 0);
        stats.lastUpdated = parsed.lastUpdated || stats.lastUpdated;
      }
    } catch (e) {}

    if (stats.visits < DEFAULT_BASELINE) {
      stats.visits = DEFAULT_BASELINE;
    }

    const action = parsedUrl.searchParams.get('action');
    const minTotal = parseInt(parsedUrl.searchParams.get('minTotal') || '0', 10);

    if (action === 'visit') {
      stats.visits += 1;
      if (minTotal > 0 && stats.visits < minTotal) {
        stats.visits = minTotal;
      }
      stats.lastUpdated = new Date().toISOString();
    } else if (action === 'reset') {
      stats.visits = DEFAULT_BASELINE;
      stats.lastUpdated = new Date().toISOString();
    }

    if (action === 'visit' || action === 'reset' || !fs.existsSync(statsFile)) {
      try {
        const dataDir = path.join(ROOT, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');
      } catch (e) {}
    }

    res.end(JSON.stringify({
      success: true,
      totalVisits: stats.visits,
      visits: stats.visits,
      lastUpdated: stats.lastUpdated
    }));
    return;
  }

  // Parse clean URL path
  let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + safePath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Portal Kantor Pertanahan ATR/BPN Bone Bolango aktif!`);
  console.log(`Akses lokal: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
