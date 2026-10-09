// Renders public/og-image.png (1200×630), the picture shown when the site is shared,
// in the site's style (ink, serif headline, the squared mark) using the site's own fonts, logo and OG title.
// Run with `npm run og` (uses the installed Microsoft Edge through Playwright).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
const title = routes.find((r) => r.path === '/').ogTitle;
// "AI does the volume. People own the outcome." → second sentence emphasised, as on the page.
const [first, ...rest] = title.split('. ');
const titleHtml = rest.length ? `${first}. <strong>${rest.join('. ')}</strong>` : title;
const logo = readFileSync('src/assets/brand/me2-logo-light.svg', 'utf8');
const { siteConfig } = await import('../src/config/site.config.ts');
const domain = siteConfig.SITE_DOMAIN;
const font = (p) => pathToFileURL(resolve('node_modules', p)).href;

// The squared mark: a 10 x 10 square of ivory tasks with the coral "²" at its corner.
const N = 10, cell = 30, gap = 6, gx = 1200 - 84 - (N * cell + (N - 1) * gap) - 40, gy = 150;
const cells = Array.from({ length: N * N }, (_, i) => `<i style="left:${gx + (i % N) * (cell + gap)}px;top:${gy + Math.floor(i / N) * (cell + gap)}px"></i>`).join('');
const sq = `<b style="left:${gx + N * (cell + gap) + 6}px;top:${gy - 34 - 6}px"></b>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:ISerif;src:url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}) format('woff2');font-style:normal}
@font-face{font-family:ISerif;src:url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}) format('woff2');font-style:italic}
@font-face{font-family:ISans;src:url(${font('@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2')}) format('woff2');font-weight:400 700}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#0d1116;color:#ece7de;font-family:ISans,sans-serif;position:relative}
.logo svg{height:54px;width:auto;display:block}
.wrap{position:absolute;left:84px;top:72px;width:560px}
h1{font-family:ISerif;font-weight:400;font-size:78px;line-height:.98;letter-spacing:-.015em;margin:70px 0 0}
h1 strong{font-weight:400;font-style:italic;color:#fff;display:block}
.url{position:absolute;left:84px;bottom:60px;font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:#9da2a8}
i{position:absolute;width:${cell}px;height:${cell}px;background:#ece7de}
b{position:absolute;width:34px;height:34px;background:#e7785c}
</style></head><body>
${cells}${sq}
<div class="wrap"><div class="logo">${logo}</div><h1>${titleHtml}</h1></div>
<div class="url">${domain}</div>
</body></html>`;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Load from a file so the local font files are allowed to load.
mkdirSync('.verify', { recursive: true });
writeFileSync('.verify/og.html', html);
await page.goto(pathToFileURL(resolve('.verify/og.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('public/og-image.png 1200×630');
