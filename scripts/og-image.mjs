// Renders public/og-image.png (1200×630), the picture shown when the site is shared,
// in the site's style (the navy night, the three-line headline, the Me² mark in light) using the site's own font, logo and OG title.
// Run with `npm run og` (uses the installed Microsoft Edge through Playwright).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
const title = routes.find((r) => r.path === '/').ogTitle;
// "AI does the volume. People own the outcome." → each sentence on two lines (first two words, then the rest),
// the first a shade back, as in the hero.
const lines = title.split(/(?<=\.)\s+/).map((sentence, i) => {
  const w = sentence.split(' ');
  return `<span class="s${i}">${w.slice(0, 2).join(' ')}<br>${w.slice(2).join(' ')}</span>`;
}).join('');
const logo = readFileSync('src/assets/brand/me2-logo-light.svg', 'utf8');
const { siteConfig } = await import('../src/config/site.config.ts');
const domain = siteConfig.SITE_DOMAIN;
const font = (p) => pathToFileURL(resolve('node_modules', p)).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:ISans;src:url(${font('@fontsource-variable/instrument-sans/files/instrument-sans-latin-standard-normal.woff2')}) format('woff2');font-weight:400 700;font-stretch:75% 100%}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:radial-gradient(60% 80% at 82% 42%,#0e1f2f 0%,#08121c 70%);color:#e8edf1;font-family:ISans,sans-serif;position:relative}
.logo svg{height:46px;width:auto;display:block}
.wrap{position:absolute;left:80px;top:64px}
h1{font-weight:520;font-stretch:88%;font-size:84px;line-height:.92;letter-spacing:-.045em;margin:56px 0 0}
h1 span{display:block}
h1 .s0{color:#93a3b3}
.url{position:absolute;left:80px;bottom:54px;font-size:22px;font-weight:500;color:#93a3b3}
/* The mark: dark glass, lit from its corner by the coral square. */
.big{position:absolute;left:850px;top:214px;width:250px;height:250px;border-radius:10px;transform:perspective(900px) rotateY(-20deg) rotateX(12deg);
  background:linear-gradient(150deg,#1a3046 0%,#0b1824 45%,#070f17 100%);
  box-shadow:inset 0 1px 0 rgba(232,237,241,.22),inset -2px 0 0 rgba(231,120,92,.55),0 50px 120px rgba(0,0,0,.6)}
.small{position:absolute;left:1088px;top:130px;width:70px;height:70px;border-radius:6px;background:#e7785c;
  box-shadow:0 0 50px 10px rgba(231,120,92,.55),0 0 180px 60px rgba(231,120,92,.22)}
</style></head><body>
<div class="big"></div><div class="small"></div>
<div class="wrap"><div class="logo">${logo}</div><h1>${lines}</h1></div>
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
