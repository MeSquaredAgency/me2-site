// Runs every Phase 1b check in BRIEF §10 against the real build and the fixture builds,
// and writes a pass/fail report to .verify/report.md. Usage: npm run verify
//   --skip-build   reuse the existing dist/ and .verify/ builds
//   --quick        skip Lighthouse and the link crawl
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const args = new Set(process.argv.slice(2));
const CHANNEL = process.env.PW_CHANNEL ?? 'msedge';
const { siteConfig } = await import('../src/config/site.config.ts');
const { flags: realFlags } = await import('../src/config/flags.ts');
const { content } = await import('../src/content/site.ts');
const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));

const fill = (t, cfg = siteConfig) => t
  .replaceAll('{SITE_NAME_PLAIN}', cfg.SITE_NAME_PLAIN).replaceAll('{SITE_NAME}', cfg.SITE_NAME)
  .replaceAll('{CONTACT_EMAIL}', cfg.CONTACT_EMAIL).replaceAll('{PRIVACY_EMAIL}', cfg.PRIVACY_EMAIL)
  .replaceAll('{YEAR}', String(new Date().getFullYear())).replaceAll('**', '');
const norm = (t) => t.replace(/\s+/g, ' ').trim();

// ---------- builds ----------
const ALL_ON = Object.fromEntries(Object.keys(realFlags).map((k) => [k, true]));
const variants = [
  { name: 'fixture-all-on', dir: '.verify/fixture/dist', flags: ALL_ON },
  ...['showPricing', 'showProof', 'showLocations', 'enableContactForm'].map((f) => ({
    name: `fixture-${f}`, dir: `.verify/variants/${f}/dist`, flags: { [f]: true },
  })),
];
if (!args.has('--skip-build')) {
  execSync('npm run build', { stdio: 'inherit' });
  for (const v of variants) execSync(`node scripts/build-fixture.mjs "${v.dir}" "${JSON.stringify(v.flags).replaceAll('"', '\\"')}"`, { stdio: 'inherit' });
}

// ---------- tiny static server (serves 404.html for missing paths, like Cloudflare Pages) ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
function serve(dir, port) {
  return new Promise((res) => {
    const server = createServer((req, rsp) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let f = join(dir, p);
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f)) { rsp.writeHead(404, { 'Content-Type': TYPES['.html'] }); return rsp.end(readFileSync(join(dir, '404.html'))); }
      rsp.writeHead(200, { 'Content-Type': TYPES[extname(f)] ?? 'application/octet-stream' });
      rsp.end(readFileSync(f));
    }).listen(port, () => res(server));
  });
}

// ---------- reporting ----------
const results = [];
const record = (build, name, status, detail = '') => {
  results.push({ build, name, status, detail });
  const icon = { PASS: '✔', FAIL: '✘', BLOCKED: '…', INFO: '·' }[status];
  console.log(`${icon} [${build}] ${name}${detail ? ` — ${detail}` : ''}`);
};
const check = (build, name, ok, detail) => record(build, name, ok ? 'PASS' : 'FAIL', detail);

const browser = await chromium.launch({ channel: CHANNEL });

async function pageFor(base, width = 1280, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', ...extra });
  const page = await ctx.newPage();
  page.on('close', () => ctx.close());
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function layoutChecks(build, base) {
  // No sideways scroll; offer cards equal height; no two same-colour sections touching.
  for (const w of [375, 768, 1280]) {
    const page = await pageFor(base, w);
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    check(build, `no horizontal scroll at ${w}px`, sw <= iw, `${sw}/${iw}`);
    if (w === 1280) {
      const hs = await page.$$eval('#offers .card', (els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      check(build, 'offer cards equal height', hs.length === 2 && hs[0] === hs[1], hs.join(' vs '));
      const touching = await page.evaluate(() => {
        const secs = [...document.querySelectorAll('main > section')];
        const bad = [];
        for (let i = 1; i < secs.length; i++) {
          const a = getComputedStyle(secs[i - 1]), b = getComputedStyle(secs[i]);
          if (a.backgroundColor === b.backgroundColor && parseFloat(a.borderBottomWidth) === 0 && parseFloat(b.borderTopWidth) === 0) bad.push(`${secs[i - 1].id || secs[i - 1].className.split(' ')[0]} / ${secs[i].id || secs[i].className.split(' ')[0]}`);
        }
        const tiny = secs.filter((s) => s.getBoundingClientRect().height < 80).map((s) => s.id || s.className);
        return { bad, tiny };
      });
      check(build, 'no two same-colour sections touching', touching.bad.length === 0, touching.bad.join(', '));
      check(build, 'no empty sections', touching.tiny.length === 0, touching.tiny.join(', '));
    }
    await page.close();
  }
}

async function screenshots(build, base) {
  mkdirSync('screenshots', { recursive: true });
  for (const w of [375, 768, 1280]) {
    const page = await pageFor(base, w);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `screenshots/${build}-${w}.png`, fullPage: true });
    await page.close();
  }
  record(build, 'screenshots 375/768/1280', 'PASS', `screenshots/${build}-*.png`);
}

async function axeCheck(build, base) {
  const page = await pageFor(base, 1280);
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  check(build, 'axe: zero WCAG 2.1 AA violations', r.violations.length === 0, r.violations.map((v) => `${v.id} (${v.nodes.length})`).join(', '));
  // Open every FAQ answer and scan again, so hidden text is covered too.
  await page.$$eval('details', (ds) => ds.forEach((d) => (d.open = true)));
  const r2 = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  check(build, 'axe with FAQ answers open', r2.violations.length === 0, r2.violations.map((v) => v.id).join(', '));
  await page.close();
}

async function keyboardCheck(build, base) {
  const page = await pageFor(base, 1280);
  const seen = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 };
    });
    if (info) seen.push(info);
  }
  check(build, 'keyboard: first Tab reaches the skip link', seen[0]?.text === content.ui.skipLink, seen[0]?.text);
  const noRing = seen.filter((s) => !s.outline);
  check(build, 'keyboard: every focused element shows a focus ring', noRing.length === 0, noRing.map((s) => s.text).join(', '));
  const summaries = seen.filter((s) => s.tag === 'SUMMARY').length;
  check(build, 'keyboard: FAQ questions reachable', summaries > 0, `${summaries} reached in 40 tabs`);
  await page.close();
}

async function thirdParty(build, base) {
  const page = await browser.newPage();
  const foreign = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol.startsWith('http')) foreign.push(u.host); });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await page.waitForLoadState('networkidle');
  check(build, 'no third-party requests', foreign.length === 0, [...new Set(foreign)].join(', '));
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.reload({ waitUntil: 'networkidle' });
  check(build, 'no console errors', errors.length === 0, errors.join(' | ').slice(0, 200));
  await page.close();
}

// ---------- real build ----------
const REAL = 'real';
const realServer = await serve('dist', 4321);
const realBase = 'http://localhost:4321';
{
  const page = await pageFor(realBase, 1280);
  const text = norm(await page.evaluate(() => document.body.textContent));
  const visible = norm(await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style').forEach((e) => e.remove()); return c.textContent; }));

  // Copy word for word (everything that should show with all flags off).
  const expected = [];
  const push = (t) => expected.push(fill(t));
  content.header.nav.forEach((n) => push(n.label)); push(content.header.button); push(content.ui.skipLink);
  const h = content.hero; [h.kicker, h.h1, h.subhead, h.primary, h.secondary, ...h.legend, h.board.title, h.board.note, h.board.srSummary].forEach(push);
  const pr = content.problem; [pr.eyebrow, pr.h2, ...pr.paragraphs, ...pr.pile, pr.pileStatus, pr.pileLabel].forEach(push);
  const dm = content.demo; [dm.eyebrow, dm.h2, dm.intro, dm.srSummary, dm.draftTitle, dm.suggestion, dm.failNote, dm.signoff, dm.note, dm.replay, ...dm.checks].forEach(push);
  const st = content.story; [st.srSummary, ...st.chapters.flatMap((c) => [c.label, c.h2, c.body])].forEach(push);
  const md = content.model; [md.eyebrow, md.h2, md.intro, md.stepsTitle, ...md.parts.flatMap((p) => [p.title, p.body]), ...md.steps.flatMap((s) => [s.title, s.body])].forEach(push);
  const cp = content.compare; [cp.eyebrow, cp.h2, cp.intro, cp.colThem, cp.colUs, ...cp.rows.flatMap((r) => [r.topic, r.them, r.us])].forEach(push);
  const o = content.offers; [o.eyebrow, o.h2, o.intro, ...o.cards.flatMap((c) => [c.name, c.body, c.bestFor, c.button])].forEach(push);
  const uc = content.useCases; [uc.eyebrow, uc.h2, uc.intro, uc.note, uc.closing, ...Object.values(uc.labels), ...uc.items.flatMap((i) => [i.for, i.work, i.ai, i.check, i.result])].forEach(push);
  const fq = content.faq; [fq.eyebrow, fq.h2, fq.aside, fq.asideButton, ...fq.items.filter((i) => !i.flag).flatMap((i) => [i.q, i.a])].forEach(push);
  const fc = content.finalCta; [fc.h2, fc.body, fc.button, fc.emailLine].forEach(push);
  const ft = content.footer; [ft.contactHeading, ft.navHeading, ft.copyright].forEach(push);
  const missing = expected.filter((t) => !text.includes(norm(t)));
  check(REAL, 'every section renders its Appendix A copy word for word', missing.length === 0, missing.length ? `missing: ${missing.slice(0, 4).join(' | ')}` : `${expected.length} strings`);

  // Flagged copy must NOT show with flags off.
  const flagged = [h.location, o.cards[0].price, uc.proof, fq.items.find((i) => i.flag).q, fc.booking, siteConfig.LEGAL_ENTITY, content.footer.privacy];
  const leaked = flagged.filter((t) => visible.includes(norm(fill(t))) && t !== content.footer.privacy);
  check(REAL, 'flagged content hidden while flags are off', leaked.length === 0, leaked.join(' | '));
  // The demo's sample amounts use "$", so look for price wording instead.
  check(REAL, 'no price text while showPricing is off', !/\bfrom \$|\bAUD\b/i.test(visible));

  // Mailto links.
  const links = await page.$$eval('a[href^="mailto:"]', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
  const wrongAddr = links.filter((l) => !l.href.startsWith(`mailto:${siteConfig.CONTACT_EMAIL}`));
  check(REAL, 'every mailto goes to CONTACT_EMAIL', wrongAddr.length === 0 && links.length > 0, `${links.length} links`);
  const subj = (l) => decodeURIComponent((l.href.split('subject=')[1] ?? '')).trim();
  const talk = links.filter((l) => l.text === content.header.button);
  check(REAL, `every "${content.header.button}" uses subject "${content.ui.subjects.general}"`, talk.length >= 3 && talk.every((l) => subj(l) === content.ui.subjects.general), `${talk.length} buttons`);
  for (const card of o.cards) {
    const l = links.find((x) => x.text === card.button);
    check(REAL, `"${card.button}" uses subject "${content.ui.subjects[card.key]}"`, l && subj(l) === content.ui.subjects[card.key]);
  }

  // Banned words and brand naming in rendered text, titles, alt text and aria labels.
  const attrs = await page.evaluate(() => [document.title, ...[...document.querySelectorAll('[alt],[aria-label]')].map((e) => e.getAttribute('alt') || e.getAttribute('aria-label'))].join(' '));
  const banned = ['revolutionary', 'game-changing', 'supercharge', 'seamless', 'cutting-edge', 'unlock', 'guarantee', 'guaranteed'];
  const hits = banned.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(visible + ' ' + attrs));
  check(REAL, 'no banned words', hits.length === 0, hits.join(', '));
  const badNames = (visible + ' ' + attrs).match(/\b(ME2|Me2|MeSquared|Me Squared Agency)\b/g) ?? [];
  check(REAL, 'brand name rules (no ME2/Me2/MeSquared)', badNames.length === 0, badNames.join(', '));
  check(REAL, '"Me Squared" not in visible text', !/Me Squared/.test(visible));

  // Head tags, JSON-LD, FAQ schema matches visible FAQ.
  const head = await page.evaluate(() => ({
    title: document.title, desc: document.querySelector('meta[name=description]')?.content ?? '',
    canonical: document.querySelector('link[rel=canonical]')?.href, h1: document.querySelectorAll('h1').length,
    robots: document.querySelector('meta[name=robots]')?.content ?? '',
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    faq: [...document.querySelectorAll('#faq summary .q')].map((e) => e.textContent.trim()),
    og: document.querySelector('meta[property="og:image"]')?.content,
  }));
  check(REAL, 'title 50–60 characters', head.title.length >= 50 && head.title.length <= 60, `${head.title.length}`);
  check(REAL, 'description 120–155 characters', head.desc.length >= 120 && head.desc.length <= 155, `${head.desc.length}`);
  check(REAL, 'one H1', head.h1 === 1, `${head.h1}`);
  check(REAL, 'canonical is the production URL', head.canonical === `https://${siteConfig.SITE_DOMAIN}/`, head.canonical);
  check(REAL, 'indexable (no robots noindex)', !/noindex/.test(head.robots));
  let ld = [];
  try { ld = head.ld.map((t) => JSON.parse(t)); check(REAL, 'JSON-LD parses', true, ld.map((x) => x['@type']).join(', ')); } catch (e) { check(REAL, 'JSON-LD parses', false, e.message); }
  const faqLd = ld.find((x) => x['@type'] === 'FAQPage');
  const ldQs = faqLd?.mainEntity.map((q) => q.name) ?? [];
  check(REAL, 'FAQPage schema matches the visible questions', JSON.stringify(ldQs) === JSON.stringify(head.faq), `${ldQs.length} vs ${head.faq.length}`);
  check(REAL, 'OG image tag points at /og-image.png', head.og?.endsWith('/og-image.png'), head.og);
  await page.close();

  // 404 page.
  const p404 = await browser.newPage();
  const resp = await p404.goto(realBase + '/no-such-page/');
  const t404 = norm(await p404.evaluate(() => document.body.textContent));
  check(REAL, '/404 renders A.10 and is noindex', resp.status() === 404 && t404.includes(content.notFound.h1) && t404.includes(content.notFound.body) && (await p404.$('meta[name=robots][content*=noindex]')) !== null);
  await p404.close();
}

// Static files and grep checks.
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const distFiles = walk('dist');
const tbc = distFiles.filter((f) => /\.(html|txt|xml|json)$/.test(f) && readFileSync(f, 'utf8').includes('[[TBC'));
check(REAL, 'no [[TBC]] left in dist/', tbc.length === 0, tbc.join(', '));
const leftovers = distFiles.filter((f) => f.endsWith('.html') && /\b(lorem|TODO)\b|example\.com/i.test(readFileSync(f, 'utf8')));
check(REAL, 'no lorem/TODO/example.com in dist/', leftovers.length === 0, leftovers.join(', '));
check(REAL, '/privacy/ not built while showPrivacyPage is off', !existsSync('dist/privacy'));
for (const f of ['llms.txt', 'robots.txt', '_headers', 'og-image.png', 'logo.png', 'sitemap.xml', 'favicon.svg', 'apple-touch-icon.png', '404.html']) check(REAL, `dist/${f} exists`, existsSync(`dist/${f}`));
check(REAL, 'IndexNow key file in dist/', readdirSync('dist').some((f) => /^[0-9a-f]{32}\.txt$/.test(f)));
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = routes.filter((r) => !r.noindex && (!r.flag || realFlags[r.flag])).map((r) => `https://${siteConfig.SITE_DOMAIN}${r.path}`);
check(REAL, 'sitemap lists exactly the indexable pages', JSON.stringify(locs) === JSON.stringify(indexable), locs.join(', '));
check(REAL, 'robots.txt points to the sitemap', readFileSync('dist/robots.txt', 'utf8').includes(`https://${siteConfig.SITE_DOMAIN}/sitemap.xml`));
const srcFiles = ['src', 'functions', 'public', 'scripts'].filter(existsSync).flatMap(walk).filter((f) => /\.(ts|astro|mjs|js|css|json|txt|md|html|svg)$/.test(f));
const identity = [siteConfig.SITE_DOMAIN, siteConfig.CONTACT_EMAIL];
const hard = srcFiles.filter((f) => !f.replaceAll('\\', '/').endsWith('src/config/site.config.ts') && identity.some((v) => readFileSync(f, 'utf8').includes(v)));
check(REAL, 'client identity only in src/config/site.config.ts', hard.length === 0, hard.join(', '));
const secrets = distFiles.filter((f) => /\.(js|html)$/.test(f) && /(re_[A-Za-z0-9]{20,}|0x4AAAA|sk_live|AKIA[0-9A-Z]{16})/.test(readFileSync(f, 'utf8')));
check(REAL, 'no secrets in the build', secrets.length === 0, secrets.join(', '));
const headers = readFileSync('dist/_headers', 'utf8');
check(REAL, 'security headers declared', ['Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Content-Security-Policy'].every((h) => headers.includes(h)));
for (const d of ['README.md', 'DEPLOY.md', 'DECISIONS.md', 'CLAUDE.md', 'docs/supplied-assets.md', 'docs/media.md', 'docs/flags.md']) check(REAL, `${d} exists`, existsSync(d));

await layoutChecks(REAL, realBase);
await screenshots(REAL, realBase);
await axeCheck(REAL, realBase);
await keyboardCheck(REAL, realBase);
await thirdParty(REAL, realBase);

// ---------- fixture builds ----------
let port = 4322;
for (const v of variants) {
  const server = await serve(v.dir, port);
  const base = `http://localhost:${port}`;
  const page = await pageFor(base, 1280);
  const robots = await page.$('meta[name=robots][content*=noindex]');
  check(v.name, 'fixture is noindex', robots !== null);
  const visible = norm(await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style').forEach((e) => e.remove()); return c.textContent; }));
  if (v.flags.showPricing) check(v.name, 'prices show with showPricing on', visible.includes('From $1 AUD per test'));
  if (v.flags.showProof) check(v.name, 'proof block shows with showProof on', visible.includes('Test Customer said this is a test.'));
  if (v.flags.showLocations) {
    check(v.name, 'location line shows with showLocations on', visible.includes(content.hero.location));
    check(v.name, 'team-location FAQ shows with showLocations on', visible.includes(content.faq.items.find((i) => i.flag).q));
  }
  if (v.name === 'fixture-all-on') {
    check(v.name, 'entity line shows with showLegalEntity on', visible.includes('Test Entity Pty Ltd'));
    check(v.name, 'privacy link shows with showPrivacyPage on', (await page.$('a[href="/privacy/"]')) !== null);
    check(v.name, '"Book a call" opens BOOKING_URL in a new tab', (await page.$('a[href="https://example.com/book"][target=_blank][rel~=noopener]')) !== null);
    const pv = await browser.newPage(); const r = await pv.goto(base + '/privacy/');
    check(v.name, '/privacy/ builds with showPrivacyPage on', r.status() === 200 && norm(await pv.evaluate(() => document.body.textContent)).includes('Test privacy policy.'));
    await pv.close();
  }
  if (v.name === 'fixture-enableContactForm') check(v.name, 'contact form stays off without the privacy page (falls back to email)', !(await page.$('form')) && visible.includes(fill(content.finalCta.emailLine, { ...siteConfig, CONTACT_EMAIL: 'test@example.com' })));
  await page.close();
  await layoutChecks(v.name, base);
  if (v.name === 'fixture-all-on') { await screenshots(v.name, base); await axeCheck(v.name, base); }
  server.close(); port++;
}

// ---------- Lighthouse and links (real build) ----------
if (!args.has('--quick')) {
  // Lighthouse through its Node API, driving an Edge that Playwright opens with a debugging port.
  // (Everything here is async so the local web server in this process keeps answering.)
  const { default: lighthouse } = await import('lighthouse');
  const lhBrowser = await chromium.launch({ channel: CHANNEL, args: ['--remote-debugging-port=9333'] });
  for (const preset of ['mobile', 'desktop']) {
    try {
      const config = preset === 'desktop' ? (await import('lighthouse/core/config/desktop-config.js')).default : undefined;
      // Mobile scores swing with how busy the PC is, so take the median of three runs.
      const n = preset === 'mobile' ? 3 : 1;
      const runs = [];
      for (let i = 0; i < n; i++) runs.push(await lighthouse(`${realBase}/`, { port: 9333, output: 'json', logLevel: 'error' }, config));
      runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
      const run = runs[Math.floor(n / 2)];
      const lh = run.lhr;
      writeFileSync(`.verify/lighthouse-${preset}.json`, run.report);
      const sc = Object.fromEntries(Object.entries(lh.categories).map(([k, c]) => [k, Math.round(c.score * 100)]));
      const ok = sc.performance >= 90 && sc.accessibility >= 95 && sc['best-practices'] >= 95 && sc.seo >= 95;
      const failing = Object.values(lh.audits).filter((a) => a.score !== null && a.score < 0.9 && ['binary', 'numeric'].includes(a.scoreDisplayMode)).map((a) => a.id);
      check(REAL, `Lighthouse ${preset} ≥ 90/95/95/95`, ok, `perf ${sc.performance}, a11y ${sc.accessibility}, bp ${sc['best-practices']}, seo ${sc.seo}; LCP ${lh.audits['largest-contentful-paint'].displayValue}, CLS ${lh.audits['cumulative-layout-shift'].displayValue}${failing.length ? `; below 90: ${failing.slice(0, 8).join(', ')}` : ''}`);
    } catch (e) { check(REAL, `Lighthouse ${preset}`, false, String(e.message).slice(0, 200)); }
  }
  await lhBrowser.close();

  const { promisify } = await import('node:util');
  const execAsync = promisify((await import('node:child_process')).exec);
  let lkOut = '';
  try { lkOut = (await execAsync(`npx linkinator ${realBase}/ --recurse --skip "${siteConfig.SITE_DOMAIN}" --skip "^mailto:" --format json`, { maxBuffer: 1e7 })).stdout; }
  catch (e) { lkOut = e.stdout ?? ''; }
  try {
    const lk = JSON.parse(lkOut);
    const broken = lk.links.filter((l) => l.state === 'BROKEN');
    check(REAL, 'no broken internal links (linkinator)', broken.length === 0, `${lk.links.length} links checked${broken.length ? `; broken: ${broken.map((b) => `${b.url} (${b.status})`).join(', ')}` : ''}`);
  } catch (e) { check(REAL, 'no broken internal links (linkinator)', false, `could not read linkinator output: ${lkOut.slice(0, 120)}`); }

  // In-page anchors resolve.
  const page = await pageFor(realBase, 1280);
  const anchors = await page.$$eval('a[href^="#"], a[href^="/#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href').replace('/', '')))]);
  const missingAnchors = [];
  for (const a of anchors) if (a !== '#main' && !(await page.$(a))) missingAnchors.push(a);
  check(REAL, 'every in-page link (#how, #offers…) has a target', missingAnchors.length === 0, missingAnchors.join(', '));
  await page.close();
}

await browser.close();
realServer.close();

// ---------- report ----------
const fails = results.filter((r) => r.status === 'FAIL');
const md = `# Verify report\n\n${new Date().toISOString()} · ${results.length} checks · ${fails.length} failed\n\n| Build | Check | Result | Detail |\n|---|---|---|---|\n${results.map((r) => `| ${r.build} | ${r.name} | ${r.status} | ${r.detail.replaceAll('|', '/')} |`).join('\n')}\n`;
mkdirSync('.verify', { recursive: true });
writeFileSync('.verify/report.md', md);
console.log(`\n${results.length} checks, ${fails.length} failed. Report: .verify/report.md`);
process.exit(fails.length ? 1 : 0);
