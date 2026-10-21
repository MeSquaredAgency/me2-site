// Checks that the hero's links take a mouse click at every width, with motion on and off: Talk to us and See where to start,
// with the sample conversation playing beside or below them. Also checks the hero line's words still take the pointer (so they stay selectable).
// Bugs it guards: an earlier hero's full-width h1 sat over its buttons from 1024px up and swallowed the click; Talk to us took no clicks at all.
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
    // Let the entrance finish (the conversation keeps playing; the links must take clicks while it does).
    await page.waitForTimeout(4000);

    const words = await hitAt(page, '#hero-title .line:first-child .text');
    check(`hero words still take the pointer (${tag})`, words.ok, `topmost element there: ${words.on}`);

    const see = '.hero .actions > a.see';
    await page.$eval(see, (a) => a.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);
    const seeHit = await hitAt(page, see);
    check(`hero See where to start takes the pointer (${tag})`, seeHit.ok, `topmost element there: ${seeHit.on}`);

    // Talk to us comes from a child component (EnquireLink or EmailLink), so it misses Hero's scoped styles.
    const cta = '.hero .actions > :first-child';
    await page.$eval(cta, (a) => a.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);
    const ctaHit = await hitAt(page, cta);
    check(`hero Talk to us takes the pointer (${tag})`, ctaHit.ok, `topmost element there: ${ctaHit.on}`);
    if (await page.$eval(cta, (a) => a.hasAttribute('data-enquire'))) {
      await page.mouse.click(ctaHit.x, ctaHit.y);
      const opened = await page.waitForSelector('dialog[open]', { timeout: 2000 }).then(() => true, () => false);
      check(`hero Talk to us opens the enquiry form on a mouse click (${tag})`, opened);
    }
    await ctx.close();
  }
}

await browser.close();
server.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exitCode = failed ? 1 : 0;
