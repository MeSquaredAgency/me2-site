// Renders public/og-image.png (1200×630), the picture shown when the site is shared,
// in the hero's style using the site's own fonts, logo and OG title from routes.json.
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

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(${font('@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:Instrument;src:url(${font('@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2')}) format('woff2');font-weight:400 700}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:radial-gradient(60% 80% at 88% 8%,rgba(36,82,122,.6),transparent 70%),radial-gradient(50% 60% at 0% 100%,rgba(27,56,83,.8),transparent 70%),#13212E;color:#fff;font-family:Instrument,sans-serif;position:relative}
.logo svg{height:84px;width:auto;display:block}
.wrap{position:absolute;left:84px;top:78px;right:84px}
h1{font-family:Outfit;font-weight:300;font-size:74px;line-height:1.06;letter-spacing:-.02em;margin:64px 0 0;max-width:15ch}
h1 strong{font-weight:600;color:#B9D3E0}
.url{position:absolute;left:84px;bottom:64px;font-size:26px;color:#C3CDD6;font-family:Outfit;font-weight:500}
.b{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 25%,#26445f,#172a3c 70%);box-shadow:0 0 0 1px rgba(185,211,224,.14)}
.r{position:absolute;border-radius:50%;border:1px solid rgba(185,211,224,.14)}
</style></head><body>
<div class="r" style="width:520px;height:520px;right:-180px;top:-120px"></div>
<div class="b" style="width:150px;height:150px;right:120px;top:120px"></div>
<div class="b" style="width:96px;height:96px;right:300px;top:380px"></div>
<div class="b" style="width:60px;height:60px;right:90px;top:430px"></div>
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
