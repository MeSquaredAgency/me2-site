// Makes the logo files the site serves from the vector me² logo in src/assets/brand/.
// me2-logo.svg was traced once from the small PNG EC supplied (me2-logo-supplied.png);
// replace both SVGs when the designer delivers a master, then run `npm run brand`.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const navy = readFileSync('src/assets/brand/me2-logo.svg', 'utf8');
const light = readFileSync('src/assets/brand/me2-logo-light.svg', 'utf8');
const [vx, vy, vw, vh] = navy.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const inner = (svg) => svg.replace(/^[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '');
const INK = '#0D1116';

// 1. Fixed public URL for email signatures, partners and schema: 1200px wide, on white.
const logoW = 1000;
const mark = await sharp(Buffer.from(navy), { density: 72 * (logoW / vw) * 10 }).resize({ width: logoW }).png().toBuffer();
const mh = (await sharp(mark).metadata()).height;
await sharp({ create: { width: 1200, height: mh + 200, channels: 4, background: '#ffffff' } })
  .composite([{ input: mark, left: 100, top: 100 }]).png().toFile('public/logo.png');

// 2. Favicon: the light mark on an ink rounded square.
const pad = vw * 0.16, side = vw + pad * 2;
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx - pad} ${vy - (side - vh) / 2} ${side} ${side}"><rect x="${vx - pad}" y="${vy - (side - vh) / 2}" width="${side}" height="${side}" rx="${side * 0.22}" fill="${INK}"/>${inner(light)}</svg>\n`;
writeFileSync('public/favicon.svg', fav);
await sharp(Buffer.from(fav), { density: 300 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(fav), { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');

console.log(`public/logo.png 1200×${mh + 200}, favicon.svg, apple-touch-icon.png, favicon-32.png`);
