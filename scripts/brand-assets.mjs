// Makes the logo variants the site uses from the me² logo file EC supplied
// (src/assets/brand/me2-logo-supplied.png: navy "me", coral "2" on white).
// Run with `npm run brand` whenever the supplied file changes. Outputs are committed.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'src/assets/brand/me2-logo-supplied.png';
const OUT = 'src/assets/brand';
// The logo's own colours (sampled from the supplied file).
const NAVY = [27, 56, 83];
const CORAL = [231, 120, 92];
const PAPER = [246, 242, 234];

mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });

/** Rebuild the mark on a transparent background, recolouring "me" to `meColour`. */
async function variant(meColour) {
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += info.channels, q += 4) {
    const [r, g, b] = [data[p], data[p + 1], data[p + 2]];
    // Coral pixels are much redder than they are blue; navy pixels are bluer.
    const isCoral = r - b > 40;
    const ref = isCoral ? CORAL : NAVY;
    // Opacity from how far the pixel is from white towards the ink colour.
    const ch = isCoral ? 2 : 0;
    const a = Math.max(0, Math.min(1, (255 - [r, g, b][ch]) / (255 - ref[ch])));
    const c = isCoral ? CORAL : meColour;
    out[q] = c[0]; out[q + 1] = c[1]; out[q + 2] = c[2]; out[q + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
    .then((b) => sharp(b).trim({ threshold: 1 }).png().toBuffer());
}

const onLight = await variant(NAVY);
const onDark = await variant(PAPER);
await sharp(onLight).toFile(`${OUT}/me2-logo-navy.png`);
await sharp(onDark).toFile(`${OUT}/me2-logo-light.png`);

// Fixed public URL for email signatures, partners and schema: ≥1200px wide on white.
// The supplied file is small, so this is upscaled; a vector master is listed in docs/supplied-assets.md.
const meta = await sharp(onLight).metadata();
const w = 1000, h = Math.round((meta.height / meta.width) * w);
const big = await sharp(onLight).resize({ width: w, kernel: 'lanczos3' }).toBuffer();
await sharp({ create: { width: 1200, height: h + 200, channels: 4, background: '#ffffff' } })
  .composite([{ input: big, left: 100, top: 100 }]).png().toFile('public/logo.png');

console.log(`logo variants: ${meta.width}×${meta.height} trimmed; public/logo.png 1200×${h + 200}`);
