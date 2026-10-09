// Full-page screenshots at the given widths, plus a horizontal-scroll check.
// Usage: node scripts/screenshots.mjs <url> <outDir> [widths...]
import { chromium } from '@playwright/test';
const [url = 'http://localhost:4321/', out = 'screenshots', ...w] = process.argv.slice(2);
const widths = w.length ? w.map(Number) : [375, 768, 1280];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' }); // Edge ships with Windows; set PW_CHANNEL= to use Playwright's Chromium
let ok = true;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 812 : 900 }, reducedMotion: 'reduce' }) // final state, no mid-animation frames;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Scroll through once so lazy-loaded photos are in the full-page shot.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // let the one load animation finish
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  const pass = sw <= iw;
  ok &&= pass;
  await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: true });
  await page.screenshot({ path: `${out}/home-${width}-fold.png` });
  console.log(`${width}px: scrollWidth ${sw} / innerWidth ${iw} ${pass ? 'PASS' : 'FAIL'}`);
  await page.close();
}
await browser.close();
process.exit(ok ? 0 : 1);
