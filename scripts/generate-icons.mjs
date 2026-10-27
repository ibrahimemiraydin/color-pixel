import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, 'public/icon');
const source = await readFile(resolve(directory, 'color-pixel.svg'));
await mkdir(directory, { recursive: true });
for (const size of [16, 32, 48, 128, 512]) {
  await sharp(source, { density: 384 }).resize(size, size).png().toFile(resolve(directory, `${size}.png`));
}

// A review sheet showing the same artwork at its actual toolbar and listing sizes.
const svg = source.toString().replace(/<\?xml[^>]*>/g, '').replace(/<svg[^>]*>/, '<svg x="0" y="0" width="128" height="128" viewBox="0 0 64 64">');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="580" viewBox="0 0 960 580">
  <rect width="960" height="580" fill="#101315"/>
  <text x="48" y="58" fill="#F4F4F5" font-family="Segoe UI, sans-serif" font-size="24" font-weight="600">Color Pixel</text>
  <text x="48" y="86" fill="#929BA2" font-family="Segoe UI, sans-serif" font-size="14">Pixel C + color sample · lime / mint / charcoal</text>
  <g transform="translate(48 124) scale(2.5)">${svg}</g>
  <rect x="416" y="124" width="496" height="152" rx="18" fill="#F0F2F3"/>
  <rect x="416" y="292" width="496" height="152" rx="18" fill="#21272C"/>
  ${[124, 292].map((y, row) => [16,32,48,128].map((size,i) => `<image x="${444+i*112}" y="${y+16+(128-size)/2}" width="${size}" height="${size}" href="data:image/png;base64,${''}"/>`).join('')).join('')}
  <text x="48" y="510" fill="#C7CFD5" font-family="Segoe UI, sans-serif" font-size="14">Vector master + transparent PNG exports</text>
  <text x="48" y="538" fill="#929BA2" font-family="Segoe UI, sans-serif" font-size="13">16 / 32 / 48 / 128 / 512 px</text>
</svg>`;
let review = sheet;
for (const size of [16,32,48,128]) {
  const png = (await readFile(resolve(directory, `${size}.png`))).toString('base64');
  review = review.replaceAll(`width="${size}" height="${size}" href="data:image/png;base64,"`, `width="${size}" height="${size}" href="data:image/png;base64,${png}"`);
}
await mkdir(resolve(root, 'test-results'), { recursive: true });
await writeFile(resolve(root, 'test-results/icon-preview.svg'), review);
await sharp(Buffer.from(review)).png().toFile(resolve(root, 'test-results/icon-preview.png'));
console.log('Generated Color Pixel icons: 16, 32, 48, 128, 512 px and review sheet.');
