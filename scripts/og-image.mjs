// Renders public/og-image.png (1200×630), the picture shown when the site is shared,
// in the site's style (warm paper, the hero headline and its sample conversation) using the site's own font, logo, copy and OG title.
// Run with `npm run og` (uses the installed Microsoft Edge through Playwright).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
const title = routes.find((r) => r.path === '/').ogTitle;
// "We run the back office. You run the business." → each sentence on two lines (first two words, then the rest),
// the first a shade back, as in the hero.
const lines = title.split(/(?<=\.)\s+/).map((sentence, i) => {
  const w = sentence.split(' ');
  return `<span class="s${i}">${w.slice(0, 2).join(' ')}<br>${w.slice(2).join(' ')}</span>`;
}).join('');
const logo = readFileSync('src/assets/brand/me2-logo.svg', 'utf8');
const { siteConfig } = await import('../src/config/site.config.ts');
const { content } = await import('../src/content/site.ts');
const domain = siteConfig.SITE_DOMAIN;
const font = (p) => pathToFileURL(resolve('node_modules', p)).href;
const esc = (t) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
// The hero's sample conversation (the same messages, labelled as an illustration, as on the page).
const chat = content.hero.chat;
const fillName = (t) => t.replaceAll('{SITE_NAME}', siteConfig.SITE_NAME);
const msgs = chat.messages.slice(1, 5)
  .map((m) => `<div class="msg ${m.from}"><span>${esc(m.text)}</span></div>`).join('');

// v0.15 "Lit" (2 Nov 2026): warm paper, the headline as in the hero, and the conversation that shows the business
// (it replaced the dark glass mark, which EC said reads as "entirely AI / computer based").
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:ISans;src:url(${font('@fontsource-variable/instrument-sans/files/instrument-sans-latin-standard-normal.woff2')}) format('woff2');font-weight:400 700;font-stretch:75% 100%}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#f7f2ea;color:#1b232c;font-family:ISans,sans-serif;position:relative}
.logo svg{height:46px;width:auto;display:block}
.wrap{position:absolute;left:80px;top:64px}
h1{font-weight:520;font-stretch:88%;font-size:80px;line-height:.92;letter-spacing:-.045em;margin:56px 0 0}
h1 span{display:block}
h1 .s0{color:#5b5650}
.url{position:absolute;left:80px;bottom:54px;font-size:22px;font-weight:500;color:#5b5650}
.card{position:absolute;right:72px;top:48px;width:410px;background:#fdfaf5;border-radius:30px;padding:22px 20px 18px;
  box-shadow:0 1px 0 rgba(27,35,44,.06),0 30px 80px -20px rgba(70,52,30,.28)}
.top{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid #e6ddd0}
.av{width:40px;height:40px;border-radius:50%;background:#1b3853;display:grid;place-items:center}
.av i{width:12px;height:12px;border-radius:2px;background:#e7785c}
.who b{display:block;font-size:17px;font-weight:600}
.who small{font-size:14px;color:#5b5650}
.msg{display:flex;margin-top:12px}
.msg span{max-width:82%;padding:11px 15px;border-radius:19px 19px 19px 6px;background:#eee6da;font-size:16px;line-height:1.4}
.msg.you{justify-content:flex-end}
.msg.you span{background:#1b3853;color:#fffdf9;border-radius:19px 19px 6px 19px}
.note{position:absolute;right:72px;width:450px;text-align:center;top:452px;font-size:14px;color:#5b5650}
</style></head><body>
<div class="wrap"><div class="logo">${logo}</div><h1>${lines}</h1></div>
<div class="card"><div class="top"><span class="av"><i></i></span><span class="who"><b>${esc(fillName(chat.who))}</b><small>${esc(chat.role)}</small></span></div>${msgs}</div>
<div class="note">${esc(chat.note)}</div>
<div class="url">${domain}</div>
</body></html>`;

// PW_EXECUTABLE: a browser binary to use instead of the installed Edge (e.g. a cloud container's Chromium).
const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : { channel: process.env.PW_CHANNEL ?? 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Load from a file so the local font files are allowed to load.
mkdirSync('.verify', { recursive: true });
writeFileSync('.verify/og.html', html);
await page.goto(pathToFileURL(resolve('.verify/og.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('public/og-image.png 1200×630');
