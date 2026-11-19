import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import QRCode from 'qrcode';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const storeUrl = 'https://apps.apple.com/app/id6824892757';
await mkdir(resolve(root, 'assets'), { recursive: true });
const qr = await QRCode.toString(storeUrl, { type: 'svg', errorCorrectionLevel: 'M', margin: 4, color: { dark: '#080303', light: '#ffffff' } });
await writeFile(resolve(root, 'assets/app-store-qr.svg'), qr);
await mkdir(output, { recursive: true });
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
await cp(resolve(root, 'index.html'), resolve(output, 'index.html'));
const layout = await readFile(resolve(root, '_layouts/policy.html'), 'utf8');
for (const slug of ['support', 'privacy']) {
  const markdown = await readFile(resolve(root, `${slug}.md`), 'utf8');
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) throw new Error(`Missing frontmatter: ${slug}`);
  const title = frontmatter[1].match(/^title: (.+)$/m)[1].trim();
  const body = markdown.slice(frontmatter[0].length);
  const content = marked.parse(body).replaceAll('href="privacy"', 'href="/privacy/"').replaceAll('href="support"', 'href="/support/"');
  const html = layout.replaceAll('{{ page.title }}', title).replace(/{{ content[^}]*}}/, content);
  await mkdir(resolve(output, slug), { recursive: true });
  await writeFile(resolve(output, slug, 'index.html'), html);
}
console.log('Built landing page, support, privacy and App Store QR code.');
