# Human first (v0.16) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage's pain section and Start here offer, and shift every line of copy to "people, backed by AI", with the hero "We run the back office. You run the business."

**Architecture:** Astro static site. All copy lives in `src/content/site.ts`; sections are single-file Astro components with scoped styles and a small inline script. A new dependency-free check script (`scripts/check-home.mjs`) reads the built `dist/` (copy, JSON-LD, llms.txt) and drives Playwright for axe, sideways scroll, the dialog, no-JS and the pain-section motion. Each task adds its assertions to it first (red), then builds (green).

**Tech Stack:** Astro 7, TypeScript, Tailwind 4 (tokens only), Playwright + @axe-core/playwright (already dev dependencies; browser channel `msedge`, override with `PW_CHANNEL`).

**Spec:** `docs/superpowers/specs/2026-10-14-human-first-design.md`

**Work in:** the worktree `C:\Users\ADC-Admin\Me² Site\.worktrees\human-first` (branch `human-first`). Run `npm ci` there once before Task 1. Run `git branch --show-current` (must print `human-first`) before every commit and push.

## Global Constraints

- Visible name always `Me²` (via `{SITE_NAME}` in `site.ts`, filled by `fill()`); never ME2, Me2, MeSquared.
- Australian English, sentence case. Banned words: revolutionary, game-changing, supercharge, seamless, cutting-edge, unlock, guarantee, guaranteed. The phrase "back end" must not appear in visible copy (EC).
- No invented statistics, names, clients or results.
- No new dependencies. No card grids, chips, icon wells or gradient text. No custom class names that are Tailwind utilities (ring, shadow, border, container, hidden, fixed, table…).
- Coral (`--color-coral`) only as light/the ² square on abyss; coral text only on abyss; on paper use `--color-coral-deep`.
- Every flag keeps a fallback: with `showPricing` off, prices vanish and panels still read complete.
- Prices: "From $3,000 + GST a month" (whole back office, a guideline); "From $2,000 + GST to set up" (one job); websites "Quoted per project".
- Nothing pushed to or merged into `main`. Pushing `human-first` makes a private preview; that is allowed.

## Review Focus

1. **Motion on, page loaded at the top:** axe must not see the pain rows' dimmed pre-arrival state (they only dim once the section is near the screen) → axe clean with motion on. Pinned in Task 1's harness (axe runs with motion on and off).
2. **No JavaScript:** every pain line and every stamp fully visible, stamps already "landed" → Task 2 no-JS check.
3. **Reduced motion:** stamps visible at load, no dimmed rows → Task 2 reduced-motion check.
4. **Visitor scrolls through the pain section quickly:** each row ends up lit with its stamp shown and stays that way → Task 2 scroll check.
5. **`showPricing` off:** no "$" left in Start here and no Offer in JSON-LD → Task 4 builds with the flag off once and checks.

---

### Task 1: Check harness and the human-first copy sweep

**Files:**
- Create: `scripts/check-home.mjs`
- Modify: `package.json` (scripts), `src/content/site.ts` (hero, visuals, board, how, faq, contact), `src/components/Hero.astro:9` (comment), `src/components/BuildVisual.astro:4,19` (comments)

**Interfaces:**
- Produces: `scripts/check-home.mjs` with `check(name, ok, detail)`, `has(text)` (visible text of `dist/index.html` contains `text`), `lacks(text)`, `ld` (parsed JSON-LD array), `llms` (dist/llms.txt string), `browserChecks` (array of `async ({ open, check }) => void`; `open(width, contextOptions)` returns a Playwright page at `/`). Later tasks insert lines between the `// ---- task checks ----` and `// ---- end task checks ----` markers, and `browserChecks.push(...)` calls before `// ---- end browser checks ----`.

- [ ] **Step 1: Write the harness with Task 1's assertions**

Create `scripts/check-home.mjs`:

```js
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
check('hero subhead leads with people', has('Me² is the team behind your business. Our people run your finance, operations and marketing, backed by AI agents trained on how you work, and we design and build the website out front.'));
check('hero screen captions', has('AI agents trained on your business') && has('Your back office, run by people'));
check('board stages', has('Agent drafting') && lacks('AI drafting'));
check('how we work leads with a person', /A person owns every task\.[\s\S]*One team, answerable for all of it\./.test(text));
check('old "checks the AI" commitment gone', lacks("A person checks the AI"));
check('FAQ: people or AI', has('Is it people or AI doing the work?') && lacks("Who checks the AI's work?"));
check('contact body', has("Tell us what's eating your week"));
check('no "back end" anywhere visible', lacks('back end') && lacks('back-end'));
for (const w of ['revolutionary', 'game-changing', 'supercharge', 'seamless', 'cutting-edge', 'unlock', 'guarantee']) check(`no banned word: ${w}`, lacks(w));
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
  }).listen(4399);
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
  const open = async (width, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, ...opts });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4399/', { waitUntil: 'networkidle' });
    if (opts.javaScriptEnabled !== false) await page.evaluate(() => document.fonts.ready);
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
  for (const fn of browserChecks) await fn({ open, check });
  // ---- end browser checks ----
  await browser.close();
  server.close();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
```

In `package.json` `scripts`, after `"verify"`, add:

```json
    "check:home": "node scripts/check-home.mjs"
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm run build && npm run check:home -- --static`
Expected: FAIL on `hero line`, `old hero line gone`, `hero subhead…`, `hero screen captions`, `board stages`, `how we work…`, `old "checks the AI"…`, `FAQ: people or AI`, `contact body`. Banned-word and "back end" checks PASS.

- [ ] **Step 3: Change the copy in `src/content/site.ts`**

In `hero`:

```ts
    /** EC's choice (14 Oct 2026): the approved v0.13 hero, people first. Two sentences, each set on two lines. */
    h1: 'We run the back office. You run the business.',
    /** The screen in the mark cycles through the three services, each with its caption. */
    scenes: [
      { scene: 'design', label: 'Websites and digital products' },
      { scene: 'build', label: 'AI agents trained on your business' },
      { scene: 'run', label: 'Your back office, run by people' },
    ],
```

```ts
    subhead:
      '{SITE_NAME} is the team behind your business. Our people run your finance, operations and marketing, backed by AI agents trained on how you work, and we design and build the website out front.',
```

```ts
    markSummary:
      'Illustration: the {SITE_NAME} mark, a dark glass square with a small coral square glowing at its corner. The glass is a screen that shows the work: a web page being designed, an AI agent drafting for a person to check, and the Command Centre board of back-office tasks being checked.',
```

In `visuals.build`:

```ts
      srSummary: 'Illustration: emails, invoices and forms flow into an AI agent, are checked by a person, and go out to your accounts, your CRM and your reports.',
      inputs: ['Emails', 'Invoices', 'Forms'],
      core: 'AI agent',
```

In `board.stages`, change `queued` and `drafting` only:

```ts
      queued: 'Assigned',
      drafting: 'Agent drafting',
```

and `board.srSummary`:

```ts
    srSummary:
      'Illustration: a board of sample back-office tasks from different kinds of business. Each task is assigned to an operator, drafted by an AI agent and checked by the operator before it is marked done. Now and then the check catches an error, and it is corrected before the task is done.',
```

Replace `how.items` with (new first item; old "A person checks the AI's work." removed):

```ts
    items: [
      {
        title: 'A person owns every task.',
        body: 'Every task has a trained {SITE_NAME} person responsible for it. AI agents do the drafting; that person checks every name, date and number against the source before anything leaves.',
      },
      {
        title: 'One team, answerable for all of it.',
        body: 'The people who design your site are the people who build and run what sits behind it. When something needs fixing, there is one team to ask.',
      },
      {
        title: 'Built around how you already work.',
        /** approved (v0.14 FAQ, adapted) */
        body: "We start from the tools and processes you already use. If something would need to change, we'll tell you before we start.",
      },
      {
        title: 'Straight answers.',
        body: "We'll tell you plainly what we can do, what it will take, and when something isn't a fit.",
      },
    ],
```

`How.astro` renders `it.body` directly; change `<p class="body">{it.body}</p>` to `<p class="body">{fill(it.body)}</p>` and its import line to `import { fill } from '../config';` plus the existing content import.

In `faq.items`, replace the first, second and fourth items:

```ts
      {
        q: 'What does {SITE_NAME} actually do?',
        a: 'We run the back office of established businesses: finance, operations and marketing, done by trained people backed by AI agents built for your business. We also design and build websites. You can start with one job and add the rest later.',
      },
      {
        q: 'What does it cost?',
        a: 'The whole back office starts from $3,000 + GST a month. One job starts from $2,000 + GST to set up. Websites are quoted per project once we understand the job.',
        flag: 'showPricing',
      },
```

```ts
      {
        q: 'Is it people or AI doing the work?',
        a: 'People, backed by AI. Every task is owned by a trained {SITE_NAME} person. AI agents trained on your business do the drafting and the volume, and that person checks it before it reaches you. If you start with one job, your own team reviews the output.',
      },
```

In `contact`:

```ts
    body: "Tell us what's eating your week: the back-office work you want off your plate, or the website you need. We'll tell you straight whether we can help.",
```

Comments: in `Hero.astro:9` change the example to `// "We run the back office. You run the business." → each sentence on two lines, its first two words on the first.`; in `BuildVisual.astro` lines 4 and 19 replace "AI role" with "AI agent".

- [ ] **Step 4: Run the checks**

Run: `npm run build && npm run check:home`
Expected: every Task 1 check PASS; axe and sideways-scroll checks PASS at 375 and 1280 with motion on and off, and with the dialog open. (The FAQ's `{SITE_NAME}` is already filled by `visibleFaq`/`Faq.astro`; if "Me²" shows as `{SITE_NAME}` anywhere, wrap that render in `fill()`.)

- [ ] **Step 5: Look at the hero**

Run `preview_start` with name `dev`, view at 1280 and 375. The h1 must read "We run / the back office. / You run / the business." with no orphaned word and the haze/full-strength split intact. If "the back office." wraps badly at 375, leave it to the existing `.lines` styles unless a single word is left alone on a line; then adjust only the split rule in `Hero.astro` (first two words) to keep "the back office." together.

- [ ] **Step 6: Commit**

```bash
git branch --show-current
git add scripts/check-home.mjs package.json src/content/site.ts src/components/Hero.astro src/components/BuildVisual.astro src/components/How.astro
git commit -m "Put people first in the hero, board, FAQ and How we work

The hero is EC's chosen line, \"We run the back office. You run the business.\",
and every line that led with AI now leads with the person who owns the work,
with AI agents as their tools. EC: \"They're a human first, with custom trained
AI agents to support them.\" Adds scripts/check-home.mjs to check the page.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: "Where your week goes" pain section

**Files:**
- Create: `src/components/Pain.astro`
- Delete: `src/components/Statement.astro`
- Modify: `src/content/site.ts` (replace `statement` with `pain`), `src/pages/index.astro`, `scripts/check-home.mjs`

**Interfaces:**
- Consumes: `check`, `has`, `browserChecks`, `open` from Task 1.
- Produces: `content.pain = { label, rows: { line, cost, stamp }[], turn, turnBody, link }`; DOM hooks `[data-pain]` (section), `[data-pain-row]` (each row, gets `.is-on`), `.stamp-text`, `.line`.

- [ ] **Step 1: Add the failing checks**

Insert before `// ---- end task checks ----` in `scripts/check-home.mjs`:

```js
// Task 2: where your week goes
check('pain label', has('Where your week goes'));
for (const t of [
  'The invoice nobody chased is still sitting there.',
  "Work you've already done, waiting to be paid for, because nobody had the hour to follow it up.",
  'Finance · owned by Me²',
  'Your best person spent Friday building a report.',
  'The people who should be selling and looking after customers are doing data entry instead.',
  'Operations · owned by Me²',
  'You hired for it. They left, and took the process with them.',
  'Every new hire starts from scratch, and the backlog is back the week they go.',
  'Every process written down · owned by Me²',
  'Three suppliers, and nobody owns the whole picture.',
  'An agency for the site, a developer for the systems, a bookkeeper for the rest. When something breaks, everyone points somewhere else.',
  'One team · owned by Me²',
  'Me² is the team behind all of it.',
  'Finance, operations and marketing, owned by people and backed by AI agents trained on your business.',
]) check(`pain copy: ${t.slice(0, 40)}…`, has(t));
check('old statement gone', lacks('Most businesses run their digital side through three suppliers'));
check('pain comes straight after the hero', /id="hero-title"[\s\S]*?<\/section>\s*(?:<!--[\s\S]*?-->\s*)?<section[^>]*data-pain/.test(html));
```

Insert before `// ---- end browser checks ----` (after the `for (const fn of browserChecks)` line is fine too, but keep the push above the loop; put these lines directly above `for (const fn of browserChecks)`):

```js
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
    check('pain: every row lit after scrolling through', lit.length === 4 && lit.every(Boolean), lit.join(','));
    check('pain: every stamp shown after scrolling through', await shown(live));
    await live.context().close();
  });
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run build && npm run check:home`
Expected: Task 2 static checks FAIL (copy missing); `pain:` browser checks FAIL (no `[data-pain]`, `shown` returns false).

- [ ] **Step 3: Replace `statement` with `pain` in `src/content/site.ts`**

Delete the whole `statement: { … },` block and put in its place:

```ts
  /** Where your week goes: four pains, each picked up by Me² as it settles on screen (EC, 14 Oct 2026: "a penny drop, oh shit moment"). */
  pain: {
    label: 'Where your week goes',
    rows: [
      {
        line: 'The invoice nobody chased is still sitting there.',
        cost: "Work you've already done, waiting to be paid for, because nobody had the hour to follow it up.",
        stamp: 'Finance · owned by {SITE_NAME}',
      },
      {
        line: 'Your best person spent Friday building a report.',
        cost: 'The people who should be selling and looking after customers are doing data entry instead.',
        stamp: 'Operations · owned by {SITE_NAME}',
      },
      {
        line: 'You hired for it. They left, and took the process with them.',
        cost: 'Every new hire starts from scratch, and the backlog is back the week they go.',
        stamp: 'Every process written down · owned by {SITE_NAME}',
      },
      {
        line: 'Three suppliers, and nobody owns the whole picture.',
        cost: 'An agency for the site, a developer for the systems, a bookkeeper for the rest. When something breaks, everyone points somewhere else.',
        stamp: 'One team · owned by {SITE_NAME}',
      },
    ],
    /** Not the hero line again: say each idea once. */
    turn: '{SITE_NAME} is the team behind all of it.',
    turnBody: 'Finance, operations and marketing, owned by people and backed by AI agents trained on your business.',
    link: 'See where to start',
  },
```

- [ ] **Step 4: Create `src/components/Pain.astro`**

```astro
---
import { fill } from '../config';
import { content } from '../content/site';
const c = content.pain;
---
<!--
  Where your week goes: four pains, one per row. As each row settles on screen it lights up and is
  "picked up": its square goes outline → half → solid coral (the Command Centre board's stages) and the stamp appears.
  Without JavaScript or with reduced motion, everything is shown, stamps already landed.
-->
<section class="pain on-dark" aria-labelledby="pain-title" data-pain>
  <div class="wrap">
    <p id="pain-title" class="kicker">{c.label}</p>
    <ol class="rows">
      {c.rows.map((r) => (
        <li class="row" data-pain-row>
          <p class="line">{r.line}</p>
          <p class="cost">{r.cost}</p>
          <p class="stamp"><span class="sq" aria-hidden="true"></span><span class="stamp-text">{fill(r.stamp)}</span></p>
        </li>
      ))}
    </ol>
    <div class="turn">
      <p class="turn-line">{fill(c.turn)}</p>
      <p class="lede turn-body">{c.turnBody}</p>
      <a href="#services" class="tlink">{c.link}</a>
    </div>
  </div>
</section>

<script>
  // Rows only dim once the section is near the screen, so nobody (and no checker) meets faint text they aren't scrolling to.
  const el = document.querySelector<HTMLElement>('[data-pain]');
  if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rows = [...el.querySelectorAll<HTMLElement>('[data-pain-row]')];
    const lightUp = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-on'); lightUp.unobserve(e.target); }
    }, { rootMargin: '0px 0px -40% 0px' });
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      // Rows already above the fold when the section arrives (e.g. after a jump) are lit straight away.
      rows.forEach((r) => { if (r.getBoundingClientRect().bottom < innerHeight * 0.6) r.classList.add('is-on'); });
      el.classList.add('is-live');
      rows.forEach((r) => lightUp.observe(r));
      near.disconnect();
    }, { rootMargin: '0px 0px 15% 0px' });
    near.observe(el);
  }
</script>

<style>
  .pain { padding-block: clamp(110px, 16vh, 200px) clamp(96px, 14vh, 180px); border-top: 1px solid var(--color-line-dark); }
  .kicker { margin-bottom: clamp(24px, 4vw, 48px); }
  .rows { list-style: none; margin: 0; padding: 0; }
  .row { display: grid; justify-items: start; gap: 18px; padding-block: clamp(44px, 8vh, 88px); border-top: 1px solid var(--color-line-dark); }
  .line {
    font-size: clamp(2.1rem, 5.2vw, 5.4rem); font-weight: 520; font-stretch: 88%;
    letter-spacing: -0.045em; line-height: 1; max-width: 17ch; color: var(--color-mist); text-wrap: balance;
  }
  .cost { max-width: 52ch; font-size: clamp(1.05rem, 1.4vw, 1.3rem); line-height: 1.55; color: var(--color-haze); }
  .stamp { display: inline-flex; align-items: center; gap: 12px; margin-top: 8px; font-weight: 560; color: var(--color-mist); }
  .sq { width: 14px; height: 14px; flex: none; box-sizing: border-box; background: var(--color-coral); box-shadow: 0 0 20px 3px rgb(var(--glow) / 0.5); }
  .turn { display: grid; justify-items: start; gap: 22px; padding-top: clamp(64px, 10vh, 120px); border-top: 1px solid var(--color-line-dark); }
  .turn-line {
    font-size: clamp(2.4rem, 6vw, 6.2rem); font-weight: 540; font-stretch: 88%;
    letter-spacing: -0.05em; line-height: 0.98; max-width: 14ch; color: var(--color-mist); text-wrap: balance;
  }
  .turn-body { max-width: 46ch; }

  @media (min-width: 1000px) {
    .row { min-height: 62vh; align-content: center; }
  }

  /* Motion: a row is faint until it reaches the upper part of the screen, then lights and is picked up. */
  .is-live .line, .is-live .cost { opacity: 0.18; transform: translateY(24px); transition: opacity 700ms var(--ease), transform 900ms var(--ease-out); }
  .is-live .row.is-on .line, .is-live .row.is-on .cost { opacity: 1; transform: none; }
  .is-live .row.is-on .cost { transition-delay: 150ms; }
  .is-live .sq { background: transparent; border: 1.5px dashed rgb(232 237 241 / 0.5); box-shadow: none; }
  .is-live .row.is-on .sq { animation: pick 1000ms var(--ease-out) 500ms forwards; }
  .is-live .stamp-text { opacity: 0; transition: opacity 600ms var(--ease) 1100ms; }
  .is-live .row.is-on .stamp-text { opacity: 1; }
  @keyframes pick {
    45% { border-style: solid; border-color: var(--color-coral); background: linear-gradient(0deg, var(--color-coral) 50%, transparent 50%); }
    100% { border-style: solid; border-color: var(--color-coral); background: var(--color-coral); box-shadow: 0 0 20px 3px rgb(var(--glow) / 0.5); }
  }
</style>
```

- [ ] **Step 5: Swap it into the page and delete Statement**

In `src/pages/index.astro`: replace `import Statement from '../components/Statement.astro';` with `import Pain from '../components/Pain.astro';` and `<Statement />` with `<Pain />`. Then:

```bash
git rm src/components/Statement.astro
```

Check no other file uses `content.statement`: `grep -rn "statement" src scripts` → only unrelated hits (none expected besides CSS words).

- [ ] **Step 6: Run the checks**

Run: `npm run build && npm run check:home`
Expected: all PASS, including the four `pain:` browser checks and axe with motion on (the rows aren't dimmed at page load).

- [ ] **Step 7: Look at it**

With `preview_start` `dev`, scroll the section at 1280 and 375 with motion on. Each row should light as it rises past ~60% of the screen, the square should go dashed → half → solid coral, then the stamp text fades in. The turn line should never leave one word alone. Screenshot 1280 for the record.

- [ ] **Step 8: Commit**

```bash
git branch --show-current
git add -A src/components/Pain.astro src/components/Statement.astro src/content/site.ts src/pages/index.astro scripts/check-home.mjs
git commit -m "Replace \"Why one partner\" with four pains a business owner recognises

Each pain gets its own line, the cost in plain words, and is then stamped as
owned by Me² as it settles on screen; the section ends on \"Me² is the team
behind all of it.\" EC: the pain points should be more obvious and prominent,
\"a penny drop, oh shit moment\". No statistics, only situations.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Start here, rebuilt around the whole back office

**Files:**
- Modify: `src/content/site.ts` (`offer`), `src/components/Offer.astro` (full rewrite), `scripts/check-home.mjs`

**Interfaces:**
- Consumes: Task 1 harness.
- Produces: `content.offer = { kicker, h2, intro, office: { name, price, body, units: { key, name, jobs: { name, outcome }[] }[], process, button, topic }, one: { name, price, body, button, topic }, web: {…unchanged}, also }`. `content.offer.roles` and `content.offer.ebu` no longer exist (Task 4 updates their consumers).

- [ ] **Step 1: Add the failing checks**

Insert before `// ---- end task checks ----`:

```js
// Task 3: Start here
const offerHtml = html.match(/<section id="services"[\s\S]*?<\/section>\s*(?=<!--|<section)/)?.[0] ?? '';
const offerText = decode(offerHtml.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
check('offer headline', offerText.includes('Your back office, handled.'));
check('offer intro', offerText.includes("One team runs your finance, operations and marketing, so you, your sales team and your front line can do what you're best at."));
check('main panel name and price', offerText.includes('The whole back office') && offerText.includes('$3,000') && offerText.includes('a month'));
for (const u of ['Finance', 'Operations', 'Marketing']) check(`unit: ${u}`, new RegExp(`<h4[^>]*>${u}</h4>`).test(offerHtml));
for (const j of ['Debtor follow-up', 'Bill coding', 'Weekly reporting', 'Inbox triage', 'Client intake', 'Quote follow-up', 'Social posts and newsletters', 'Enquiry follow-up', 'Website updates', 'Monthly marketing report']) check(`job: ${j}`, offerText.includes(j));
check('one job panel', offerText.includes('Start with one job') && offerText.includes('$2,000') && offerText.includes('Not ready to hand over the whole back office?'));
check('websites panel kept', offerText.includes('Websites and digital products') && offerText.includes('Quoted per project'));
check('EBU name gone', lacks('Effective Business Unit'));
check('"AI Roles" heading gone', !/AI Roles/.test(offerText) && !offerText.includes('Ask about this role'));
check('no dashed checkbox glyphs', !offerHtml.includes('class="glyph'));
check('one enquiry button for the whole back office', (offerHtml.match(/data-topic="Whole back office"/g) ?? []).length === 1);
```

And above `for (const fn of browserChecks)`:

```js
  // Task 3: Start here's label, headline, intro and main panel share one left edge (EC: "why is the formatting here so weird?").
  browserChecks.push(async ({ open, check }) => {
    for (const width of [375, 1280]) {
      const page = await open(width, { reducedMotion: 'reduce' });
      await page.evaluate(() => document.documentElement.classList.add('render-all'));
      const lefts = await page.$$eval('#services .kicker, #services h2, #services .intro, #services .office', (els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
      check(`Start here: one left edge at ${width}px`, lefts.length === 4 && lefts.every((l) => Math.abs(l - lefts[0]) <= 1), lefts.join(','));
      await page.context().close();
    }
  });
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run build && npm run check:home`
Expected: Task 3 checks FAIL (old offer still rendered). Build itself passes.

- [ ] **Step 3: Replace `offer` in `src/content/site.ts`**

```ts
  /** Start here: the whole back office (people backed by AI, one monthly price), one job, or a website. EC, 14 Oct 2026. */
  offer: {
    kicker: 'Start here',
    h2: 'Your back office, handled.',
    intro: "One team runs your finance, operations and marketing, so you, your sales team and your front line can do what you're best at.",
    office: {
      name: 'The whole back office',
      /** showPricing. EC: "$3,000 per month for your entire business's backend covered"; a guideline for now. */
      price: 'From $3,000 + GST a month',
      body: 'Trained {SITE_NAME} people own the work, backed by AI agents built around your business. They check every output, handle the exceptions and report back to you.',
      /** Jobs: finance and operations from the v0.15 roles; marketing confirmed by EC on 14 Oct 2026. */
      units: [
        {
          key: 'finance',
          name: 'Finance',
          jobs: [
            { name: 'Debtor follow-up', outcome: 'Overdue invoices chased on schedule, with every amount matched to your accounts.' },
            { name: 'Bill coding', outcome: 'Supplier bills read, coded and prepared for entry, ready for you to approve.' },
            { name: 'Weekly reporting', outcome: 'The numbers you check every week, pulled together and written up for you.' },
          ],
        },
        {
          key: 'operations',
          name: 'Operations',
          jobs: [
            { name: 'Inbox triage', outcome: 'Every incoming email sorted, and a reply drafted in your tone for you to approve.' },
            { name: 'Client intake', outcome: 'New enquiries turned into client files, with a welcome pack drafted.' },
            { name: 'Quote follow-up', outcome: 'Every quote without a reply gets a follow-up, drafted from the job notes.' },
          ],
        },
        {
          key: 'marketing',
          name: 'Marketing',
          jobs: [
            { name: 'Social posts and newsletters', outcome: 'Drafted on schedule in your voice, for you to approve.' },
            { name: 'Enquiry follow-up', outcome: 'Every new enquiry gets a reply and a follow-up.' },
            { name: 'Website updates', outcome: 'New pages, offers and news kept current.' },
            { name: 'Monthly marketing report', outcome: "What ran, what worked and what's next, written up for you." },
          ],
        },
      ],
      process: 'A written process for every repeat task, so the work never depends on one person.',
      button: 'Talk to us about your back office',
      topic: 'Whole back office',
    },
    one: {
      name: 'Start with one job',
      /** showPricing */
      price: 'From $2,000 + GST to set up',
      body: "Not ready to hand over the whole back office? We'll set up one AI agent for one job, built around how your team already works. Your team reviews the output and stays in control.",
      button: 'Ask about one job',
      topic: 'One job',
    },
    web: {
      name: 'Websites and digital products',
      /** showPricing */
      price: 'Quoted per project',
      body: 'Sites and products that make an established business look like what it is: clear to read, quick to load and built to win the enquiry.',
      includes: ['Websites and landing pages', 'Interface design for portals and apps', 'Copy and content structure', 'Search and performance foundations'],
      button: 'Ask about a website',
      topic: 'Website or digital product',
    },
    also: "Need something these don't cover, like an automation between your tools or a dashboard? Tell us the job.",
  },
```

- [ ] **Step 4: Rewrite `src/components/Offer.astro`**

```astro
---
import EnquireLink from './EnquireLink.astro';
import { fill, flags } from '../config';
import { content } from '../content/site';
const c = content.offer;
// "From $3,000 + GST a month" → the figure set large, the words around it small.
const price = (text: string) => {
  const m = text.match(/^(.*?)(\$[\d,]+)(.*)$/);
  return m ? { before: m[1].trim(), figure: m[2], after: m[3].trim() } : { before: '', figure: '', after: text };
};
const officePrice = price(c.office.price);
const onePrice = price(c.one.price);
---
<!-- Start here: the whole back office (the big offer), one job, or a website. One left edge for everything. -->
<section id="services" class="offer on-paper render-later" aria-labelledby="offer-title">
  <div class="wrap">
    <div class="head">
      <p class="kicker">{c.kicker}</p>
      <h2 id="offer-title">{c.h2}</h2>
      <p class="lede intro">{c.intro}</p>
    </div>

    <!-- The whole back office: people backed by AI, on dark glass like the mark. -->
    <article class="office on-dark" aria-labelledby="office-title">
      <div class="office-top">
        <div>
          <h3 id="office-title" class="tier">{c.office.name}</h3>
          {flags.showPricing && (
            <p class="price">{officePrice.before} <span class="figure">{officePrice.figure}</span> <span class="after">{officePrice.after}</span></p>
          )}
        </div>
        <p class="body">{fill(c.office.body)}</p>
      </div>
      <div class="units">
        {c.office.units.map((u) => (
          <div class="unit">
            <h4 class="unit-name">{u.name}</h4>
            <ul class="jobs">
              {u.jobs.map((j) => (
                <li><span class="job">{j.name}</span><span class="job-out">{j.outcome}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div class="office-foot">
        <p class="process"><span class="sq" aria-hidden="true"></span>{c.office.process}</p>
        <EnquireLink topic={c.office.topic} source="start-here" class="btn btn-light"><span class="dot" aria-hidden="true"></span>{c.office.button}</EnquireLink>
      </div>
    </article>

    <div class="pair">
      <article class="tier-panel one" aria-labelledby="one-title">
        <h3 id="one-title" class="tier tier-sm">{c.one.name}</h3>
        {flags.showPricing && (
          <p class="price">{onePrice.before} <span class="figure">{onePrice.figure}</span> <span class="after">{onePrice.after}</span></p>
        )}
        <p class="body">{c.one.body}</p>
        <EnquireLink topic={c.one.topic} source="start-here" class="btn btn-dark"><span class="dot" aria-hidden="true"></span>{c.one.button}</EnquireLink>
      </article>

      <article class="tier-panel web" aria-labelledby="web-title">
        <h3 id="web-title" class="tier tier-sm">{c.web.name}</h3>
        {flags.showPricing && <p class="price"><span class="figure figure-words">{c.web.price}</span></p>}
        <p class="body">{c.web.body}</p>
        <ul class="includes">{c.web.includes.map((x) => <li>{x}</li>)}</ul>
        <EnquireLink topic={c.web.topic} source="start-here" class="btn btn-dark"><span class="dot" aria-hidden="true"></span>{c.web.button}</EnquireLink>
      </article>
    </div>

    <p class="also">{c.also} <EnquireLink topic="Something else" source="start-here" class="tlink">{content.header.button}</EnquireLink></p>
  </div>
</section>

<style>
  .offer { padding-block: var(--section-y); }
  .head { display: grid; justify-items: start; gap: 24px; margin-bottom: clamp(48px, 6vw, 88px); }
  .head h2 { max-width: 16ch; }
  .intro { max-width: 52ch; }

  .tier { font-size: clamp(2.2rem, 3.6vw, 3.6rem); font-weight: 520; font-stretch: 88%; letter-spacing: -0.045em; line-height: 0.95; }
  .tier-sm { font-size: clamp(1.8rem, 2.6vw, 2.6rem); }
  .price { margin-top: 18px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 1rem; color: var(--color-slate); }
  .figure { font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 560; font-stretch: 90%; letter-spacing: -0.04em; color: var(--color-ink); font-variant-numeric: tabular-nums; }
  .figure-words { font-size: clamp(1.5rem, 2.2vw, 2rem); }
  .body { margin-top: 18px; max-width: 46ch; font-size: 1.08rem; line-height: 1.6; color: var(--color-slate); }

  /* ---- The whole back office ---- */
  .office {
    position: relative; overflow: hidden; isolation: isolate; border-radius: 18px; padding: clamp(28px, 4vw, 56px);
    background: radial-gradient(70% 60% at 100% 0%, rgb(var(--glow) / 0.2), transparent 70%), linear-gradient(160deg, #10202f, var(--color-abyss) 70%);
    box-shadow: 0 40px 80px -30px rgb(8 18 28 / 0.5);
  }
  .office::after {
    content: ''; position: absolute; top: 28px; right: 28px; width: 14px; height: 14px; background: var(--color-coral);
    box-shadow: 0 0 24px 4px rgb(var(--glow) / 0.55);
  }
  .office .price, .office .body { color: var(--color-haze); }
  .office .figure { color: var(--color-mist); }
  .office .body { margin-top: 0; }
  .office-top { display: grid; gap: 24px; }
  .units { display: grid; margin-top: clamp(36px, 4vw, 56px); border-top: 1px solid var(--color-line-dark); }
  .unit { padding-block: 26px; border-bottom: 1px solid var(--color-line-dark); }
  .unit-name { font-size: 1.35rem; font-weight: 560; letter-spacing: -0.02em; color: var(--color-mist); }
  .jobs { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 16px; }
  .jobs li { display: grid; gap: 4px; }
  .job { font-weight: 560; color: var(--color-mist); }
  .job-out { color: var(--color-haze); line-height: 1.5; max-width: 38ch; }
  .office-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 32px; margin-top: 32px; }
  .process { display: inline-flex; align-items: center; gap: 12px; max-width: 48ch; color: var(--color-haze); line-height: 1.5; }
  .process .sq { width: 8px; height: 8px; flex: none; background: var(--color-coral); }
  .office :focus-visible { outline-color: var(--color-mist); }

  /* ---- One job and websites ---- */
  .pair { display: grid; gap: 24px; margin-top: 24px; }
  .tier-panel { display: grid; align-content: start; justify-items: start; border-radius: 18px; padding: clamp(28px, 3.4vw, 48px); background: var(--color-paper-2); }
  .tier-panel :global(.btn) { margin-top: 32px; }
  .includes { list-style: none; margin: 26px 0 0; padding: 0; width: 100%; max-width: 44ch; border-top: 1px solid var(--color-line); }
  .includes li { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--color-line); font-weight: 500; }
  .includes li::before { content: ''; width: 6px; height: 6px; background: currentColor; flex: none; }
  .also { margin-top: clamp(32px, 4vw, 48px); max-width: 60ch; color: var(--color-slate); line-height: 1.6; }

  @media (min-width: 800px) {
    .units { grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--color-line-dark); }
    .unit { border-bottom: 0; padding: 30px 28px 32px; border-left: 1px solid var(--color-line-dark); }
    .unit:first-child { padding-left: 0; border-left: 0; }
    .pair { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1000px) {
    .office-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: end; column-gap: clamp(40px, 5vw, 96px); }
  }
</style>
```

(The pointer-light script is gone with the roles grid.)

- [ ] **Step 5: Run the checks**

Run: `npm run build && npm run check:home`
Expected: Task 3 checks PASS. The build may FAIL type-checking in `src/lib/schema.ts` (it reads `o.roles`/`o.ebu`). If so, make the minimal Task 4 Step 3 change to `schema.ts` now so the build passes, and note it in the commit. All earlier checks still PASS.

- [ ] **Step 6: Look at it**

`preview_start` `dev` at 1280 and 375: one left edge; the dark panel's three units read as columns of text (not cards); the two small panels are equal-height-ish and aligned; no word orphaned in the headline; the "Talk to us" link in the last line opens the dialog tagged "Something else".

- [ ] **Step 7: Commit**

```bash
git branch --show-current
git add src/content/site.ts src/components/Offer.astro scripts/check-home.mjs src/lib/schema.ts
git commit -m "Rebuild Start here around the whole back office

One clean left-aligned layout. The big offer is now the whole back office,
finance, operations and marketing run by trained people backed by AI agents,
from \$3,000 + GST a month, with the jobs each team takes off you. Underneath:
start with one job, or a website. The checkbox squares, six repeated links and
the \"Effective Business Unit\" name are gone. EC: \"why is the formatting here so
weird?\" and \"we would be your marketing team, your ops team, finance team\".

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Structured data, llms.txt, page meta, OG image, flags note

**Files:**
- Modify: `src/lib/schema.ts`, `scripts/postbuild.mjs:33-53`, `src/data/routes.json` (home entry), `src/config/flags.ts:6`, `public/og-image.png` (regenerated), `scripts/check-home.mjs`

**Interfaces:**
- Consumes: `content.offer.office`, `content.offer.one`, `content.offer.web` (Task 3).

- [ ] **Step 1: Add the failing checks**

Insert before `// ---- end task checks ----`:

```js
// Task 4: what search engines and AI assistants read
const services = ld.filter((x) => x['@type'] === 'Service').map((s) => s.name);
check('JSON-LD services', JSON.stringify(services) === JSON.stringify(['The whole back office', 'Start with one job', 'Websites and digital products']), services.join(' | '));
const officeLd = ld.find((x) => x.name === 'The whole back office');
check('JSON-LD back office price 3000 AUD', officeLd?.offers?.priceSpecification?.minPrice === 3000);
check('JSON-LD description has Me² filled in', !JSON.stringify(ld).includes('{SITE_NAME}'));
check('llms.txt: back office, no EBU or AI Roles', llms.includes('The whole back office') && !llms.includes('Effective Business') && !llms.includes('AI Roles') && !/back end/i.test(llms));
check('llms.txt: people first', llms.includes('trained people') && llms.includes('AI agents'));
check('og:title is the hero', html.includes('<meta property="og:title" content="We run the back office. You run the business."'));
check('page title', /<title>Me²: back-office teams and websites for established businesses<\/title>/.test(html));
```

- [ ] **Step 2: Run to see it fail**

Run: `npm run build && npm run check:home -- --static`
Expected: Task 4 checks FAIL (except possibly the JSON-LD ones if Task 3 Step 5 already touched `schema.ts`).

- [ ] **Step 3: Update `src/lib/schema.ts`**

Line 5 comment → `/** JSON-LD for the home page: Organization, one Service per offer (the whole back office, one job, websites), and the visible FAQ. */`. Line 17 comment → `// One Service per offer. Prices only when showPricing is on (the back office's monthly fee; one job's setup fee; both + GST).`. Replace the `services` array:

```ts
  const services = [
    { name: o.office.name, description: fill(o.office.body), ...offerFrom(o.office.price) },
    { name: o.one.name, description: o.one.body, ...offerFrom(o.one.price) },
    { name: o.web.name, description: o.web.body },
  ].map((s) => ({ '@context': 'https://schema.org', '@type': 'Service', ...s, provider, areaServed: 'AU' }));
```

- [ ] **Step 4: Update llms.txt in `scripts/postbuild.mjs`**

Replace the `llms` template's summary line, `## Services` and `## Start here` blocks and the two Key pages lines that mention the old offer, so the template reads:

```js
const llms = `# ${name}

> ${name} (also known as ${plain}) runs the back office of established businesses: finance, operations and marketing, done by trained people backed by AI agents built for each business, so the owner, the sales team and the front line can do what they're best at. ${name} also designs and builds websites and digital products.

## Services
- The whole back office: trained ${name} people own the work, backed by AI agents built around the business; they check every output, handle the exceptions and report back.${price('From $3,000 + GST a month.')} Finance: debtor follow-up, bill coding, weekly reporting. Operations: inbox triage, client intake, quote follow-up. Marketing: social posts and newsletters, enquiry follow-up, website updates, a monthly marketing report.
- Start with one job: one AI agent for one job, set up around how a team already works; the team reviews the output.${price('From $2,000 + GST to set up.')}
- Websites and digital products: websites and landing pages, interface design for portals and apps, copy and content structure, search and performance foundations;${flagOn('showPricing') ? ' quoted per project.' : ' designed and built to brief.'}

## Key pages
- [Home](${base}/): what ${name} does, the offer and common questions
${flagOn('showProof') ? `- [Work](${base}/#work): projects ${name} has designed, built and run\n` : ''}- [Start here](${base}/#services): the whole back office, one job and websites, with prices
- [How we work](${base}/#how): a person owns every task; one accountable team
${flagOn('showPrivacyPage') ? `- [Privacy](${base}/privacy/): how enquiries are handled\n` : ''}
## Contact
- [Email ${email}](mailto:${email})
`;
```

(Keep the `price` helper and everything around the template unchanged.)

- [ ] **Step 5: Update `src/data/routes.json` (home entry only) and the flags note**

```json
    "title": "Me²: back-office teams and websites for established businesses",
    "description": "Me² runs the back office of established businesses: finance, operations and marketing, done by trained people backed by AI agents. We also design and build websites.",
    "ogTitle": "We run the back office. You run the business.",
```

`src/config/flags.ts:6` comment → `/** Price lines in Start here and the pricing question. EC, 14 Oct 2026: the whole back office from $3,000 + GST a month (a guideline); one job from $2,000 + GST to set up. */`

- [ ] **Step 6: Regenerate the share image**

Run: `npm run og`
Expected: `public/og-image.png 1200×630`. Open `public/og-image.png` and check the headline reads "We run / the back office. / You run / the business." with no clipping. (`og-image.mjs` splits the title the same way as the hero; update its line-11 comment example to the new line.)

- [ ] **Step 7: Check `showPricing` off (Review Focus 5)**

Temporarily set `showPricing: false` in `src/config/flags.ts`, run `npm run build`, then:

```bash
node -e "const h=require('fs').readFileSync('dist/index.html','utf8');const o=h.match(/<section id=\"services\"[\s\S]*?<\/section>/)[0];console.log('dollar in Start here:',o.includes('\$'),'| Offer in JSON-LD:',h.includes('\"@type\":\"Offer\"'))"
```

Expected: `dollar in Start here: false | Offer in JSON-LD: false`. Look at Start here in the dev preview with the flag off: panels still read complete. Set `showPricing: true` again and confirm `git diff src/config/flags.ts` shows only the comment change.

- [ ] **Step 8: Run all checks**

Run: `npm run build && npm run check:home`
Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
git branch --show-current
git add src/lib/schema.ts scripts/postbuild.mjs src/data/routes.json src/config/flags.ts public/og-image.png scripts/og-image.mjs scripts/check-home.mjs
git commit -m "Tell search engines and AI assistants the new story

Structured data, llms.txt, the page title and description, and the share
image now describe the whole back office run by people backed by AI agents,
with the hero \"We run the back office. You run the business.\".

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Docs, full verification, preview

**Files:**
- Modify: `DECISIONS.md` (append rows), `CLAUDE.md` (Design paragraph), `README.md:3,73`, `docs/flags.md:7`, `docs/forms.md:7`

- [ ] **Step 1: Docs**

Append to `DECISIONS.md` (same table format as the existing rows):

```markdown
| 14 Oct 2026 | v0.16 "human first" PROPOSED on branch `human-first` (homepage): hero "We run the back office. You run the business."; "Why one partner" replaced by four pains ("Where your week goes"), each stamped as owned by Me² as it settles; Start here rebuilt around "The whole back office" (finance, operations, marketing) from $3,000 + GST a month, with "Start with one job" ($2,000 setup) and websites beneath; copy across the page leads with people, AI agents as their tools | EC on the live page: pain points "more obvious and prominent… a penny drop, oh shit moment"; Start here "why is the formatting here so weird?"; "we're making the AI too prominent. They're a human first, with custom trained AI agents to support them"; the EBU means "your marketing team, your ops team, finance team, the whole unit" for "$3,000 per month for your entire business's backend". Spec: docs/superpowers/specs/2026-10-14-human-first-design.md |
| 14 Oct 2026 | "Effective Business Unit" name dropped; "back end" not used in copy; the four marketing jobs confirmed by EC; $3,000 is a guideline ("From") | EC: drop the EBU name; "Hand us the back end" "sounds like you want booty"; marketing jobs "yes"; price "just a guideline for the minute" |
| 14 Oct 2026 | `scripts/check-home.mjs` (`npm run check:home`) checks the v0.16 homepage: copy, JSON-LD, llms.txt, axe and sideways scroll at 375/1280 with motion on and off and the dialog open, the pain section without JS / reduced motion / scrolled, Start here's single left edge | `npm run verify` still describes v0.14; this covers the changed sections until it is rewritten |
```

`CLAUDE.md` Design paragraph: replace `Hero line: "AI does the volume. People own the outcome." (EC's choice; don't swap it without asking).` with `Hero line: "We run the back office. You run the business." (EC's choice, 14 Oct 2026; don't swap it without asking). People first: Me² is trained people backed by AI agents, never the other way round; "back end" is not used in copy.` and replace `a priced "Start here" offer (named AI roles, EBUs, websites)` with `a priced "Start here" offer (the whole back office, one job, websites)`. In the Verifying section add after the first sentence: `Until then, \`npm run build && npm run check:home\` covers the v0.16 homepage.`

`README.md:3`: replace the description after "One-page sales site for Me² ("Me Squared"), which" with `runs the back office of established businesses (finance, operations and marketing) with trained people backed by AI agents, and designs and builds websites.` (keep the rest of the line's sentence structure intact; read the full line first). `README.md:73`: `- [ ] The pain lines, the jobs in each team (finance, operations, marketing), the service lists and the "What you can count on" commitments confirmed by EC`.

`docs/flags.md:7`: describe prices as `"From $3,000 + GST a month" for the whole back office, "From $2,000 + GST to set up" for one job`. `docs/forms.md:7`: topics are now e.g. `"Whole back office", "One job", "Website or digital product", "Something else", or "General enquiry"`.

Grep the changed docs and copy for banned words and old names:

```bash
grep -rniE "revolutionary|game-changing|supercharge|seamless|cutting-edge|unlock|guarantee|back end|Effective Business" src scripts/postbuild.mjs README.md docs/flags.md docs/forms.md
```

Expected: no hits (DECISIONS.md and the spec quote EC, so they're excluded).

- [ ] **Step 2: Full verification**

```bash
npm run build && npm run check:home
node scripts/lighthouse.mjs
```

Expected: all checks PASS; Lighthouse mobile ≥ 95 performance and 100 accessibility/best practices/SEO, desktop 100s (v0.15 baseline: mobile 96, desktop 100). If mobile performance drops below 95, check whether the pain section's rows cause layout work at load (they shouldn't: `IntersectionObserver` only) before anything else.

- [ ] **Step 3: Screenshots and a look**

Take full-page screenshots at 375 and 1280 with the dev preview (scroll the page first so the pain rows light), save to `screenshots/human-first-375.png` and `screenshots/human-first-1280.png`, and look at them: hero, pain section, Start here, How we work, FAQ, close.

- [ ] **Step 4: Commit and push the branch for a preview**

```bash
git branch --show-current
git add DECISIONS.md CLAUDE.md README.md docs/flags.md docs/forms.md screenshots/human-first-375.png screenshots/human-first-1280.png
git commit -m "Record the human-first round and how to check it

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git branch --show-current
git push -u origin human-first
```

Pushing `human-first` (never `main`) runs the publish workflow, which uploads a preview version; the preview URL is in the GitHub Actions run summary (`gh run list --branch human-first --limit 1`, then `gh run view <id>`). It is behind Cloudflare Access, so EC opens it. Do not merge, open a PR to `main` only if EC asks, and don't deploy.
