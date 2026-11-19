import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import QRCode from 'qrcode';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
const storeUrl = 'https://apps.apple.com/app/id6824892757';
const png = PNG.sync.read(await QRCode.toBuffer(storeUrl, { errorCorrectionLevel: 'M', margin: 4, scale: 8 }));
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
assert.equal(decoded?.data, storeUrl, 'QR code must decode to the verified App Store listing');
const expectedSvg = await QRCode.toString(storeUrl, { type: 'svg', errorCorrectionLevel: 'M', margin: 4, color: { dark: '#080303', light: '#ffffff' } });
assert.equal(await readFile('assets/app-store-qr.svg', 'utf8'), expectedSvg, 'Published QR asset must match the verified encoder output');
for (const slug of ['support', 'privacy']) {
  const original = execFileSync('git', ['show', `origin/main:${slug}.md`], { encoding: 'utf8' });
  const current = await readFile(`${slug}.md`, 'utf8');
  const body = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').replaceAll('\r\n', '\n');
  assert.equal(body(current), body(original), `${slug} text must remain unchanged`);
}
for (const page of ['index.html', 'support/index.html', 'privacy/index.html']) {
  const html = await readFile(resolve('dist', page), 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `One main heading: ${page}`);
  assert.ok(html.includes('lang="en"'));
  for (const match of html.matchAll(/(?:src|href)="([^"\s]+)"/g)) {
    if (/^(https?:|mailto:)/.test(match[1])) continue;
    const url = new URL(match[1], `https://anomalyintelligence.app/${page}`);
    let relative = url.pathname;
    if (relative.endsWith('/')) relative += 'index.html';
    else if (!relative.split('/').at(-1).includes('.')) relative += '/index.html';
    assert.ok((await stat(resolve('dist', `.${relative}`))).isFile(), `Missing local link or asset: ${match[1]}`);
  }
  assert.ok(!/https?:\/\/(?:fonts\.googleapis|fonts\.gstatic|api\.qrserver)/.test(html), 'Fonts and QR must be self-hosted');
}
console.log('PASS QR decode, published QR, unchanged support/privacy text, internal links, assets and page headings.');
