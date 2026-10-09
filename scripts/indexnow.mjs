// Tells Bing, Yandex and other IndexNow search engines that the site's pages changed.
// Run after a production deploy: `npm run indexnow`. (Google ignores IndexNow; submit the
// sitemap in Search Console instead.) The key file in public/ proves we own the domain.
import { readdirSync, readFileSync } from 'node:fs';

const { siteConfig } = await import('../src/config/site.config.ts');
const domain = siteConfig.SITE_DOMAIN;
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (32 hex characters + .txt) in public/');
const key = keyFile.replace('.txt', '');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: domain, key, keyLocation: `https://${domain}/${keyFile}`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URL(s)`);
