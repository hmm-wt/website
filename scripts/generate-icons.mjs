#!/usr/bin/env node
// Generate apple-touch-icon (180×180) + PWA icons (192×192, 512×512) from
// public/favicon.svg. Run once when icons need rebuilding:
//   node scripts/generate-icons.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const FAVICON = path.join(PUBLIC_DIR, 'favicon.svg');

const TARGETS = [
  { out: 'apple-touch-icon.png', size: 180 },
  { out: 'icon-192.png', size: 192 },
  { out: 'icon-512.png', size: 512 },
];

async function main() {
  const svg = await fs.readFile(FAVICON);
  for (const t of TARGETS) {
    const outPath = path.join(PUBLIC_DIR, t.out);
    await sharp(svg, { density: 1024 })
      .resize(t.size, t.size, { fit: 'contain', background: '#042F2A' })
      .png({ quality: 90 })
      .toFile(outPath);
    console.log(`→ ${outPath} (${t.size}×${t.size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
