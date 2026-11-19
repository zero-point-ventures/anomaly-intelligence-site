import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT ?? 4173);
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    try { if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html'); }
    catch { if (!extname(path)) path = resolve(path, 'index.html'); }
    const content = await readFile(path);
    response.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
    response.end(content);
  } catch { response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
