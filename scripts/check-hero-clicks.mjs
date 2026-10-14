// Checks that the scene tabs at the foot of the hero's glass screen (Design / Build / Run) take a mouse click at every width,
// with the mark moving and still, and that the hero line's words still take the pointer (so they stay selectable).
// Bug it guards: the full-width hero h1 sat over the tabs from 1024px up and swallowed the click.
// Usage: npm run build && node scripts/check-hero-clicks.mjs
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { chromium } from '@playwright/test';

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = readFileSync(join('dist', p));
    res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(4398);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });

// What sits on top at the middle of an element, and whether that is the element (or inside it).
const hitAt = (page, selector) => page.$eval(selector, (el) => {
  const r = el.getBoundingClientRect();
  const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  const name = (e) => e ? `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${e.classList.length ? `.${[...e.classList].join('.')}` : ''}` : 'nothing';
  return { ok: !!top && el.contains(top), on: name(top), x: r.x + r.width / 2, y: r.y + r.height / 2 };
});

for (const [width, height] of [[375, 812], [1024, 768], [1280, 900], [1440, 900], [1920, 1080]]) {
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const tag = `${width}×${height}, motion ${reducedMotion === 'reduce' ? 'off' : 'on'}`;
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4398/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Let the entrance finish and the mark start (it waits for the page to go quiet, longer on phones).
    await page.waitForTimeout(4000);
    const gl = await page.$eval('.hero', (h) => h.classList.contains('is-gl'));

    const tab = '.screen-foot .tabs .tab:nth-child(2)';
    const hit = await hitAt(page, tab);
    // A real mouse click where the tab is drawn: the mark keeps the screen moving, so it is never "stable" for a locator click.
    await page.mouse.click(hit.x, hit.y);
    const pressed = await page.$eval(tab, (t) => t.getAttribute('aria-pressed'));
    check(`second scene tab takes a mouse click (${tag}${gl ? '' : ', no WebGL'})`, pressed === 'true', `aria-pressed=${pressed}; topmost element there: ${hit.on}`);

    const words = await hitAt(page, '#hero-title .line:first-child .text');
    check(`hero words still take the pointer (${tag})`, words.ok, `topmost element there: ${words.on}`);
    await ctx.close();
  }
}

await browser.close();
server.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exitCode = failed ? 1 : 0;
