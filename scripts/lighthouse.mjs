// Lighthouse on the built site (dist/), mobile or desktop, using the installed Edge.
// Usage: node scripts/lighthouse.mjs [mobile|desktop] [runs]
// Prints the median of the runs; verify.mjs runs the same audit as part of npm run verify.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const preset = process.argv[2] ?? 'mobile';
const runs = Number(process.argv[3] ?? 3);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let f = join('dist', decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end(readFileSync('dist/404.html')); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(4399);

const { default: lighthouse } = await import('lighthouse');
const config = preset === 'desktop' ? (await import('lighthouse/core/config/desktop-config.js')).default : undefined;
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge', args: ['--remote-debugging-port=9334'] });
const scores = [];
for (let i = 0; i < runs; i++) {
  const { lhr } = await lighthouse('http://localhost:4399/', { port: 9334, logLevel: 'error' }, config);
  scores.push({
    perf: Math.round(lhr.categories.performance.score * 100),
    tbt: Math.round(lhr.audits['total-blocking-time'].numericValue),
    lcp: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
    cls: lhr.audits['cumulative-layout-shift'].numericValue,
    style: Math.round(lhr.audits['mainthread-work-breakdown'].details.items.find((x) => x.group === 'styleLayout')?.duration ?? 0),
  });
}
await browser.close();
server.close();
scores.sort((a, b) => a.perf - b.perf);
console.log(JSON.stringify(scores));
console.log(`${preset} median: perf ${scores[Math.floor(runs / 2)].perf}, TBT ${scores[Math.floor(runs / 2)].tbt}ms`);
