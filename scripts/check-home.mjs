// Checks the built home page for the v0.16 "human first" round (spec: docs/superpowers/specs/2026-10-14-human-first-design.md):
// visible copy, structured data and llms.txt, then in a browser: axe and sideways scroll at 375 and 1280 (motion on and off,
// enquiry dialog open), plus the section checks the tasks add. Stands in for `npm run verify` until that is rewritten for v0.15+.
// Usage: npm run build && npm run check:home            (add -- --static to skip the browser)
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const args = new Set(process.argv.slice(2));
const html = readFileSync('dist/index.html', 'utf8');
const llms = readFileSync('dist/llms.txt', 'utf8');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1]));

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};
const has = (t) => text.includes(t);
const lacks = (t) => !text.toLowerCase().includes(t.toLowerCase());
const browserChecks = [];

// ---- task checks ----
// Task 1: human first, hero chosen by EC (14 Oct 2026)
check('hero line', /<h1[^>]*>[\s\S]*<\/h1>/.test(html) && decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim() === 'We run the back office. You run the business.');
check('old hero line gone', lacks('AI does the volume'));
check('hero subhead leads with people', has('Me² is the team behind your business: trained people, backed by AI agents, running your admin, accounts, customer service and marketing. We design and build the website out front, too.'));
check('hero screen opens on the back-office board', /data-scene="run"[^>]*aria-pressed="true"/.test(html) && /data-screen-label[^>]*>Your back office, run by people</.test(html));
check('hero screen captions', html.includes('aria-label="AI agents that draft, people who check"') && html.includes('aria-label="Your back office, run by people"'));
// Copy review, 16 Oct 2026: no "trained on your business" (invites "are you training AI on my data?"), no real-estate "tenant", and one sentence said once.
check('no "trained on your business"', lacks('trained on your business'));
check('no "tenant" anywhere on the page', lacks('tenant'));
check('form labels', has('What do you need a hand with?') && />Email<\/label>/.test(html) && lacks('Work email'));
check('form privacy line matches the policy', has("We use these details to reply to you, and we won't add you to a mailing list.") && lacks('only to reply to you'));
check('FAQ: software answer not the How we work line', has('Usually not. We set the work up around the tools you already use') && text.split('We start from the tools and processes you already use').length === 2);
check('one team, as literally true', has('Your website and your back office sit with one team.') && lacks('The people who design your site are the people who build'));
check('search description fits (≤160 characters)', (html.match(/<meta name="description" content="([^"]*)"/)?.[1].length ?? 999) <= 160);
check('board stages', has('Agent drafting') && lacks('AI drafting'));
check('how we work leads with a person', /A person owns every task\.[\s\S]*One team, answerable for all of it\./.test(text));
check('old "checks the AI" commitment gone', lacks("A person checks the AI"));
check('FAQ: people or AI', has('Is it people or AI doing the work?') && lacks("Who checks the AI's work?"));
check('FAQ: no AI on its own', has("We don't sell AI on its own."));
check('contact body', has("Tell us what's eating your week"));
check('no "back end" anywhere visible', lacks('back end') && lacks('back-end'));
for (const w of ['revolutionary', 'game-changing', 'supercharge', 'seamless', 'cutting-edge', 'unlock', 'guarantee']) check(`no banned word: ${w}`, lacks(w));
// Task 2: where your week goes
check('pain label', has('Where your week goes'));
for (const t of [
  'The invoice nobody chased is still sitting there.',
  "Work you've already done, waiting to be paid for, because nobody had the hour to follow it up.",
  'Finance · owned by Me²',
  'Your best person spent Friday building a report.',
  'The people who should be selling and looking after customers are stuck in spreadsheets instead.',
  'Operations · owned by Me²',
  'You hired for it. They left, and took the process with them.',
  'Every new hire starts from scratch, and the backlog is back the week they go.',
  'Every process written down · owned by Me²',
  'Three suppliers, and nobody owns the whole picture.',
  'An agency for the site, a developer for the systems, a bookkeeper for the rest. When something breaks, everyone points somewhere else.',
  'One team · owned by Me²',
  'That Saturday enquiry got a reply on Tuesday.',
  "By then they'd booked someone else.",
  'Customer service · owned by Me²',
  'Me² takes all of it off your hands.',
  "So you, your sales team and your front line can do what you're best at.",
]) check(`pain copy: ${t.slice(0, 40)}…`, has(t));
check('old statement gone', lacks('Most businesses run their digital side through three suppliers'));
check('pain comes straight after the hero', /id="hero-title"[\s\S]*?<\/section>(?:\s*(?:<script[\s\S]*?<\/script>|<!--[\s\S]*?-->))*\s*<section[^>]*data-pain/.test(html));
// Task 3: Start here
const offerHtml = html.match(/<section id="services"[\s\S]*?<\/section>(?=\s*(?:<script|<!--|<section))/)?.[0] ?? '';
const offerText = decode(offerHtml.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
check('offer headline', offerText.includes('Your back office, handled.'));
check('offer intro', offerText.includes('One team for everything behind your front line. Hand over the lot, or start with an extra set of hands.'));
check('main panel name and price', offerText.includes('The whole back office') && offerText.includes('$3,000') && offerText.includes('a month'));
for (const a of ['Business operations', 'Admin', 'Customer service and support', 'Finance and accounting', 'Marketing', 'Social media', 'Paid ads']) check(`area: ${a}`, new RegExp(`<span class="area"[^>]*>${a}</span>`).test(offerHtml));
check('coming next line', offerText.includes('Coming next: legal, tech development, consulting and strategy.'));
check('extra set of hands panel', offerText.includes('An extra set of hands') && offerText.includes('$2,000') && offerText.includes("Don't need a whole team?") && offerText.includes('Ask about an extra set of hands'));
check('old one-job wording gone', lacks('Start with one job') && lacks('your own team reviews'));
check('websites panel kept', offerText.includes('Websites and digital products') && offerText.includes('Quoted per project'));
check('EBU name gone', lacks('Effective Business Unit'));
check('"AI Roles" heading gone', !/AI Roles/.test(offerText) && !offerText.includes('Ask about this role'));
check('no dashed checkbox glyphs', !offerHtml.includes('class="glyph'));
check('one enquiry button for the whole back office', (offerHtml.match(/data-topic="Whole back office"/g) ?? []).length === 1);
// Task 4: what search engines and AI assistants read
const services = ld.filter((x) => x['@type'] === 'Service').map((s) => s.name);
check('JSON-LD services', JSON.stringify(services) === JSON.stringify(['The whole back office', 'An extra set of hands', 'Websites and digital products']), services.join(' | '));
const officeLd = ld.find((x) => x.name === 'The whole back office');
check('JSON-LD back office price 3000 AUD', officeLd?.offers?.priceSpecification?.minPrice === 3000);
check('JSON-LD description has Me² filled in', !JSON.stringify(ld).includes('{SITE_NAME}'));
check('llms.txt: back office, no EBU or AI Roles', llms.includes('The whole back office') && !llms.includes('Effective Business') && !llms.includes('AI Roles') && !/back end/i.test(llms));
check('llms.txt: people first', llms.includes('trained people') && llms.includes('AI agents'));
check('og:title is the hero', html.includes('<meta property="og:title" content="We run the back office. You run the business."'));
check('page title', /<title>Me²: back-office teams and websites for established businesses<\/title>/.test(html));
// Final review fixes
check('no "AI role" left, visible or in structured data', lacks('AI role') && !JSON.stringify(ld).includes('AI role'));
check('pain section has a heading', /<h2 id="pain-title"/.test(html));
// ---- end task checks ----

if (!args.has('--static')) {
  const { chromium } = await import('@playwright/test');
  const { AxeBuilder } = await import('@axe-core/playwright');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon' };
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const body = readFileSync(join('dist', p));
      res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  }).listen(0); // any free port, so two checkouts can run this at once
  await new Promise((r) => server.once('listening', r));
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
  const open = async (width, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, ...opts });
    const page = await ctx.newPage();
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    if (opts.javaScriptEnabled !== false) await page.evaluate(() => document.fonts.ready);
    // With motion on, let the hero's entrance (it starts after load, later on phones) finish first, so axe judges what a visitor reads, not a fade.
    if (opts.javaScriptEnabled !== false && opts.reducedMotion !== 'reduce') {
      await page.waitForTimeout(4000);
      await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))));
    }
    return page;
  };
  const axe = async (page) => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations.map((v) => `${v.id} (${v.nodes.length})`);

  for (const width of [375, 1280]) {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const tag = `${width}px, motion ${reducedMotion === 'reduce' ? 'off' : 'on'}`;
      const page = await open(width, { reducedMotion });
      const v = await axe(page);
      check(`axe clean (${tag})`, v.length === 0, v.join(', '));
      const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
      check(`no sideways scroll (${tag})`, sw <= iw, `${sw}/${iw}`);
      await page.locator('[data-enquire]').first().click();
      await page.waitForSelector('dialog[open]');
      const vd = await axe(page);
      check(`axe clean, enquiry dialog open (${tag})`, vd.length === 0, vd.join(', '));
      await page.context().close();
    }
  }
  // Task 2: the pain section without JavaScript, with reduced motion, and scrolled through with motion on.
  browserChecks.push(async ({ open, check }) => {
    const shown = (page) => page.$$eval('[data-pain] .line, [data-pain] .stamp-text', (els) => els.length > 0 && els.every((e) => getComputedStyle(e).opacity === '1'));
    const noJs = await open(1280, { javaScriptEnabled: false });
    check('pain: lines and stamps all visible without JavaScript', await shown(noJs));
    await noJs.context().close();
    const still = await open(375, { reducedMotion: 'reduce' });
    check('pain: lines and stamps all visible with reduced motion', await shown(still));
    await still.context().close();
    const live = await open(1280, { reducedMotion: 'no-preference' });
    for (const row of await live.$$('[data-pain-row]')) {
      await row.evaluate((r) => r.scrollIntoView({ block: 'center' }));
      await live.waitForTimeout(300);
    }
    await live.waitForTimeout(2200);
    const lit = await live.$$eval('[data-pain-row]', (rows) => rows.map((r) => r.classList.contains('is-on')));
    check('pain: every row lit after scrolling through', lit.length === 5 && lit.every(Boolean), lit.join(','));
    check('pain: every stamp shown after scrolling through', await shown(live));
    await live.context().close();
  });
  // Task 3: Start here's label, headline, intro and main panel share one left edge (EC: "why is the formatting here so weird?").
  browserChecks.push(async ({ open, check }) => {
    for (const width of [375, 1280]) {
      const how = await open(width, { reducedMotion: 'reduce' });
      await how.evaluate(() => document.documentElement.classList.add('render-all'));
      const hl = await how.$$eval('#how .kicker, #how h2, #how .items', (els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
      check(`How we work: one left edge at ${width}px`, hl.length === 3 && hl.every((l) => Math.abs(l - hl[0]) <= 1), hl.join(','));
      await how.context().close();
    }
    for (const width of [375, 1280]) {
      const page = await open(width, { reducedMotion: 'reduce' });
      await page.evaluate(() => document.documentElement.classList.add('render-all'));
      const lefts = await page.$$eval('#services .kicker, #services h2, #services .intro, #services .office', (els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
      check(`Start here: one left edge at ${width}px`, lefts.length === 4 && lefts.every((l) => Math.abs(l - lefts[0]) <= 1), lefts.join(','));
      await page.context().close();
    }
  });
  // Final review fixes: a pain row lights as its line reaches the middle of the screen (spec), not earlier;
  // "owned by Me²" never breaks on a phone; Start here's two small panels end on the same line.
  browserChecks.push(async ({ open, check }) => {
    const page = await open(1280, { reducedMotion: 'no-preference' });
    await page.mouse.move(640, 300);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(300);
    const at = async (frac) => {
      await page.evaluate((f) => { const l = document.querySelectorAll('[data-pain] .line')[1]; scrollTo(0, l.getBoundingClientRect().top + scrollY - innerHeight * f); }, frac);
      await page.waitForTimeout(500);
      return page.$$eval('[data-pain-row]', (rs) => rs[1].classList.contains('is-on'));
    };
    check('pain: row not lit while its line is low on the screen (72%)', (await at(0.72)) === false);
    check('pain: row lit once its line reaches the middle (45%)', (await at(0.45)) === true);
    await page.context().close();
    const phone = await open(375, { reducedMotion: 'reduce' });
    const broken = await phone.$$eval('[data-pain] .who', (els) => els.filter((e) => e.getClientRects().length !== 1).map((e) => e.closest('.stamp').textContent.trim()));
    check('pain: "owned by Me²" on one line at 375px', broken.length === 0, broken.join(' | '));
    await phone.context().close();
    const desk = await open(1280, { reducedMotion: 'reduce' });
    const looks = await desk.evaluate(() => ['[data-pain] .kicker', '#how .kicker'].map((sel) => { const c = getComputedStyle(document.querySelector(sel)); return [c.fontSize, c.fontWeight, c.fontStretch, c.lineHeight, c.letterSpacing].join(' '); }));
    check('pain: its heading looks like every other section label', looks[0] === looks[1], looks.join(' vs '));
    await desk.evaluate(() => document.documentElement.classList.add('render-all'));
    const tops = await desk.$$eval('#services .pair .btn', (bs) => bs.map((b) => Math.round(b.getBoundingClientRect().top)));
    check("Start here: the two small panels' buttons line up at 1280px", tops.length === 2 && Math.abs(tops[0] - tops[1]) <= 1, tops.join(','));
    await desk.context().close();
  });
  for (const fn of browserChecks) await fn({ open, check });
  // ---- end browser checks ----
  await browser.close();
  server.close();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
