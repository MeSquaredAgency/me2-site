# Me² — Build Brief v0.12 ("Squared", live since 9 Oct 2026)
Owner: Elliot Crabb (EC) · Decision-maker: Patrick · Date: 9 Oct 2026 · Mode: New build

v0.12 (9 Oct 2026, branch `redesign-wow`, published 9 Oct on EC's "publish"): EC: "more refined. More class. More streamlined. Think of Philippe Starck… the underlying point of the business still needs to come across… make it special… unique. Me²." The proof keeps every section and the message, re-expressed as the "Squared" system in §5: near-black and ivory, hairlines, an elegant serif with italic emphasis, and the ² as the organising idea (the hero square of tasks, superscript section numbers, small coral squares as the only accent).

v0.11 (9 Oct 2026, branch `redesign-wow`, NOT live): EC: "It needs bulking out massively… look to awwwards.com business/corporate… show how capable we are. It needs to wow every visitor." Proof adds a live canvas hero (task particles pass a "human check" gate; coral errors are caught), a scrolling work band, a scroll-lit "Admin grows faster than headcount" statement, an interactive demo (an AI Role drafts an arrears summary; the operator check catches $1,200 vs the ledger's $1,020, corrects it and signs off; labelled as made-up sample data), the four-part operating model and eight-step workflow, and a "typical VA service vs Me²" comparison. New copy is drawn from the Me² Company Handbook (Draft v0.1, 3 Oct 2026); statements EC must confirm before launch are listed in DECISIONS.md. Next (after approval): redesign services, real estate, FAQ and CTA in the same style and add pages (How we work, Services, Real estate, Security & data, Contact).

v0.10 (9 Oct 2026): EC preferred the "AI does the volume. People own the outcome." hero from the link-preview image. The hero is now that headline, left-aligned, with the icon bubbles grouped on the right and no photo; "The back-office work that buries your team, handled." moves to head How it works.

v0.9 (9 Oct 2026): EC approved the v0.8 direction ("yeah sure"), approved licensed stock photos, and asked that the logo not be forgotten. Adds four Unsplash photos (§5 Imagery), a vector logo traced from the supplied PNG and used in the header, footer, favicon, OG image and `/logo.png`, and copy for the remaining sections (Appendix A: offers, real estate, FAQ, footer).

v0.8 (9 Oct 2026): EC rejected the first design proof (minimal ink/paper type with a giant coral "2") and asked for inspiration from intelligentoffice.com. §5 and §6.1–6.4 now describe the richer direction; the v0.6 rules against eyebrow labels, emphasised words and decoration are withdrawn. New copy for the nav, pillars band, eyebrows and the problem illustration is in Appendix A.

Changes from v0.6 (5 Oct 2026): rebuilt to the premium build standard. Adds a design-proof stop (Phase 1a), a routes file, `llms.txt`, IndexNow, security headers, FAQ schema, the owner `docs/` set and git working rules. Colour tokens now come from the me² logo file EC supplied on 7 Oct (navy `#1B3853`, coral `#E7785C`) instead of the provisional values. All copy in Appendix A is unchanged from v0.6.

## 0. Read this first
- You are building a single-page sales site for Me² (pronounced "Me Squared"). Me² sets up AI roles for repetitive back-office work and pairs them with trained human operators who run them and check the output. Buyers are Australian business owners and managers. Real estate agencies are the first market, but the brand is industry-agnostic: real estate appears in one section only, never as the identity.
- Primary goal: the visitor clicks **Talk to us**, which in v1 opens an email to `CONTACT_EMAIL`.
- Work in phases (§10). There are two stops: after Phase 1a (design proof) and after Phase 1b (full site). At each stop, report back and wait.
- Between stops, if something here is ambiguous, pick the simpler option, log it in `DECISIONS.md`, and keep going. Don't stop to ask.
- All visible text comes from Appendix A. Do not write, rewrite or "improve" copy. If a block has no copy, hide it.
- Never invent names, testimonials, statistics, results, awards, logos or prices. Never name individual people anywhere on the site.
- Use git from the first commit. Work on branches; never push to `main` once it's connected to the host (it deploys the live site). Commit messages say in plain English what changed for the visitor, and why.

## 0b. Project variables
Single source of truth. Build these into `src/config/site.config.ts` (public values) and `.env` / Cloudflare env vars (secrets). Never type these values anywhere else in the code.

| Variable | Value | Used for |
|---|---|---|
| `SITE_NAME` | `Me²` | titles, schema `name`, footer |
| `SITE_NAME_PLAIN` | `Me Squared` | mailto subjects, schema `alternateName`, aria-labels where "²" may be read badly |
| `SITE_DOMAIN` | `mesquaredagency.com` | canonical, sitemap, OG URLs, Astro `site` |
| `CONTACT_EMAIL` | `hello@mesquaredagency.com` | every mailto, visible email text, schema |
| `PRIVACY_EMAIL` | `privacy@mesquaredagency.com` | privacy page (Phase 2) |
| `FORM_FROM_EMAIL` | `website@mesquaredagency.com` (provisional, §13 #11) | form notifications (Phase 2) |
| `FORM_TO_EMAIL` | `hello@mesquaredagency.com` | form notifications (Phase 2) |
| `BOOKING_URL` | `""` (empty until EC supplies the Cal.com or Calendly link; empty means booking stays hidden) | booking button (Phase 2) |
| `HOST_ACCOUNT` | `tech@mesquaredagency.com` (Cloudflare) | §1 pre-flight only |
| `HOST_PROJECT` | `mesquared` (Cloudflare Pages) | §1 pre-flight, DEPLOY.md |
| `LOCALE` | `en-AU` | `<html lang>`, date and currency formatting |

Copy in Appendix A writes `{SITE_NAME}`, `{SITE_NAME_PLAIN}`, `{CONTACT_EMAIL}`, `{PRIVACY_EMAIL}` and `{YEAR}`. Render these from the config (`{YEAR}` = current year at build time), never as literal text.

## 1. Pre-flight (do this before writing code)
- Check for hosting credentials: `npx wrangler whoami`.
- Deploy only if ALL are true: you're logged in; the account is `HOST_ACCOUNT`; the Pages project `HOST_PROJECT` already exists (`npx wrangler pages project list`); and you deploy to a non-production preview (`npx wrangler pages deploy dist --project-name mesquared --branch preview`). Never create projects, never deploy to production, never use a different account.
- Otherwise: build and preview locally, and write `DEPLOY.md` with the exact commands the owner runs (log in, create project, deploy). Don't retry blocked commands.
- The domain currently shows the registrar's (VentraIP) parking page. There is no existing site, so there are no URLs to keep.
- Package versions: current stable versions that work together. If an allowed package is deprecated or incompatible, use its official replacement and log it in `DECISIONS.md`.
- Node: 22 or later (this PC runs 26). Package manager: npm. Add `"engines": { "node": ">=22" }` to `package.json`.
- Skills: if `frontend-design` is installed, use it for build craft (hierarchy, spacing, responsive behaviour, polish). This brief overrides any skill: never change the tokens in §5, the copy in Appendix A, the section order or the dependency list because a skill suggests it. Log any conflict in `DECISIONS.md`.

## 2. Audience and message
- Audience: owners, principals and operations managers of Australian small and mid-size businesses whose teams are stretched by repetitive admin (inbox, reporting, chasing, data entry). First market: real estate agencies, especially property management teams.
- What they need to believe to click:
  - This takes work off my team; it isn't another tool for them to learn and manage.
  - A person checks what the AI produces, so mistakes don't reach my clients.
  - I can start small (one job) before handing over more.
  - These people are straight with me: no hype, no inflated claims.
- Tone and spelling: plain-spoken, practical, confident, outcome-focused. Australian English (organise, colour, enquiry). Sentence case for headings and buttons.
- Brand rules:
  - Visible name is always `Me²` (capital M, superscript two). "Me Squared" only in `alternateName`, aria-labels and mailto subjects. Never "ME2", "Me2", "MeSquared" or "Me Squared Agency" in visible copy.
  - Banned words (rendered text, case-insensitive, whole word): revolutionary, game-changing, supercharge, seamless, cutting-edge, unlock, guarantee, guaranteed.
- Competitors: none named. Never copy another AI-services or offshore-staffing site's wording, imagery or programmes.

## 3. Stack and hosting
- Astro + TypeScript, static output. Tailwind CSS v4 via `@tailwindcss/vite` (not the deprecated `@astrojs/tailwind`). No UI framework: interactive bits use native HTML (`<details>`/`<summary>` for the FAQ) or small inline vanilla JS.
- Host: Cloudflare Workers static assets ("Pages, now part of Workers"), project `mesquared` in the Me² Cloudflare account, live at https://mesquaredagency.com since 9 Oct 2026 (see DEPLOY.md). Build command: `npm run build`. Output dir: `dist`. Phase 2 form handler: Pages Function at `functions/api/enquiry.ts`.
- Allowed dependencies: `astro`, `typescript`, `@astrojs/check`, `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/instrument-sans`, `@fontsource-variable/outfit`, `sharp` (logo and OG image generation at build time). Dev only: `@playwright/test`, `@axe-core/playwright`, `lighthouse`, `linkinator`, `wrangler`. Phase 2 only: `resend`. Any other dependency needs a one-line justification in `DECISIONS.md`.
- The sitemap is written by a small build step reading the routes file (one page; no `@astrojs/sitemap` needed).
- Out of scope: CMS, auth, database, client-side routing, Preact/React/Vue, animation libraries, icon libraries, carousels, chat widgets, cookie banners, newsletter signup, Google Fonts CDN links, any third-party script in Phase 1.

## 4. Repo structure
```
/
├── BRIEF.md · CLAUDE.md · DECISIONS.md · DEPLOY.md · README.md
├── astro.config.mjs          # site: from site.config; fixture mode via SITE_FIXTURE
├── package.json
├── .gitignore                # .verify/, .env, node_modules, dist
├── docs/                     # owner docs (§14)
├── functions/api/enquiry.ts  # Phase 2 only
├── public/
│   ├── _headers              # security headers
│   ├── robots.txt · llms.txt · favicon.svg
│   ├── <indexnow-key>.txt
│   └── logo.png              # ≥1200px wide, fixed public URL (generated)
├── scripts/
│   ├── brand-assets.mjs      # logo variants + OG image from src/assets/brand
│   ├── verify.mjs            # every Phase 1 check, both builds
│   └── indexnow.mjs
├── screenshots/              # design-proof and Phase 1b screenshots (committed)
├── src/
│   ├── assets/brand/         # supplied logo file(s)
│   ├── config/site.config.ts # §0b values
│   ├── config/flags.ts       # §7 flags
│   ├── content/site.ts       # all Appendix A copy, section order
│   ├── data/routes.json      # path, title, description, noindex, og image
│   ├── components/           # Header, Hero, Problem, HowItWorks, Offers, RealEstate, Faq, FinalCta, Footer, Logo, EmailLink, Section
│   ├── layouts/Base.astro
│   ├── pages/index.astro · 404.astro · privacy.astro (only when showPrivacyPage)
│   └── styles/tokens.css     # §5 tokens via Tailwind @theme
└── .verify/fixture/          # git-ignored fixture config (§6b)
```

## 5. Design direction and tokens ("Squared", v0.12)
- Idea: **Me² = me, squared** — a team's capacity multiplied, with nothing lost in quality. Every visual decision comes from that: squares, superscripts, restraint.
- Hero signature: a square of 12 × 12 small squares, one per task. AI outlines them quickly (the volume); a hairline "human check" sweeps across and each square it passes turns solid ivory (checked, owned). Coral squares are errors, caught at the line and corrected. When the square is complete, a small coral square settles at its top-right corner: the "²". A legend under it says the same in words. Static final frame for reduced motion; pauses off-screen.
- Section labels carry superscript numbers ("The problem¹", "See it in action²"…) with a hairline to the edge. The closing headline ends with a small coral square as an exponent.
- Colours (tokens in `src/styles/tokens.css`): `ink` #0D1116 · `ink-2` #161B22 · `ivory` #F3EFE7 · `bone` #E7E1D5 · `text` #111418 · `muted` #585D64 · `on-dark` #ECE7DE · `muted-dark` #9DA2A8 · `coral` #E7785C (² motif and caught errors only; text only on ink) · `coral-deep` #A6412A (coral as text on ivory) · `sage` #7FB59A ("checked", always with a word) · `navy` #1B3853 (logo only).
- Allowed pairs (computed): text on ivory 16.10 · text on bone 14.18 · muted on ivory 5.79 · muted on bone 5.10 · on-dark on ink 15.38 · muted-dark on ink 7.37 · on-dark on ink-2 14.05 · muted-dark on ink-2 6.73 · coral on ink 6.53 · coral on ink-2 5.96 · coral-deep on ivory 5.37 · sage on ink-2 7.40 · ink on ivory 16.51 · ink on on-dark (light buttons) 15.38.
- Type: headlines in Instrument Serif 400 (OFL, `@fontsource/instrument-serif`, normal + italic), the emphasised part (`**…**` in the copy) set in italic, not bold. Everything else Instrument Sans Variable. Labels: 0.74rem, 600, letter-spacing 0.2em, uppercase.
- Layout: editorial grid, generous space (160px section padding on desktop), hairline rules instead of cards, pills or chips. Sections alternate ink / ivory / bone so two same colours only touch across a hairline.
- Buttons: quiet pills. Solid (ivory on ink, ink on ivory) for the main action; hairline outline for secondary; text links with a hairline underline that draws back on hover.
- Imagery: one photograph, the real estate keys, shown in black and white (colour returns on hover). No other stock.
- Motion: slow and fine. The hero square; a slowly drifting italic band of the work we take on; the problem headline coming into focus word by word; the demo; 1s scroll-in reveals. All respect reduced motion.
- Logo: the traced vector me² (light version on ink). OG image: ink, the serif headline and the squared mark.

## 6. Page structure
Section order below. Backgrounds alternate ink/paper from the sections actually rendered, starting with header + hero on ink, so two same-colour sections never touch whatever the flags. Exceptions: the final CTA is always coral; the footer is always ink with a 1px `line-dark` top border. The section before the final CTA may be either colour.

### 6.1 Header
- Purpose: identity, a way round the page, and a way to act. Copy: A.1
- Layout: sits over the hero. Skip link, light logo left, in-page nav (How it works, Services, Real estate, Questions) and a "Talk to us" primary button right. Nav hidden under 900px (the page is short; the button stays). Not sticky. Flag: none.

### 6.2 Hero
- Purpose: say what Me² does in one breath and get the click. Copy: A.2
- Layout: left-aligned H1 (two lines, bold line in pale), subhead (on-dark, max 52ch), primary button + white-outline "See how it works" (anchors to `#how`), location line below. Decorative bubbles and ring on the right per §5.
- Flag: `showLocations` controls the location line. If off: not rendered.

### 6.2b Pillars band
- Purpose: the promise in four glances. Copy: A.2b
- Layout: white band, four items (two by two on phones) with a big navy word and a small muted line, divided by hairlines. Flag: none. Never numbers or statistics unless substantiated and approved.

### 6.3 Problem (dark feature panel)
- Purpose: name the pain in the buyer's words. Copy: A.3
- Layout: on white, a rounded ink panel with a glow. Left: a circle with an orbit ring holding a slightly fanned stack of white cards (Inbox, Weekly reports, Overdue reminders, Data entry), each with an icon and a coral "Waiting" dot (decorative, `aria-hidden`). Right: eyebrow, H2, two paragraphs. Stacked on phones (illustration first). Flag: none.

### 6.4 How it works (`id="how"`)
- Purpose: show AI plus a person, in order. Copy: A.4
- Layout: mist section, centred head (eyebrow, H2, intro), three white cards with a navy icon well, a "Step n" label, title and body, then a centred "Talk to us" button. Flag: none.

### 6.5 Offers (`id="offers"`)
- Purpose: show the two ways to buy. Copy: A.5
- Layout: white section, centred head (eyebrow, H2, intro), two equal cards side by side (stacked on phones): 16:9 photo on top, then name (H3), body, feature chips, "Best for" line, price line, navy-outline button. "Best for", price and button sit at the bottom so both cards line up. Buttons are mailtos with the card's subject (A.ui).
- Flag: `showPricing` controls both price lines. If off: not rendered, cards stay equal height, no "$" anywhere on the page.

### 6.6 Starting with real estate (`id="real-estate"`)
- Purpose: show the first market without making the brand real-estate-only. Copy: A.6
- Layout: mist section, centred head (eyebrow, H2, body). Left: rounded photo card (keys) with a navy gradient, the title "Property management" and four glass chips. Right: the list intro and six white rows, each with a navy icon well. Then the closing line centred, and the proof block.
- Flag: `showProof` controls the proof block (ink rounded card). If off: not rendered.

### 6.7 FAQ (`id="faq"`)
- Purpose: answer the questions that stop a click. Copy: A.7
- Layout: white section. Left (sticky on desktop): eyebrow, H2, and a grey card with a short prompt and a "Talk to us" button. Right: native `<details>`/`<summary>` items as white rounded rows; a round "+" that turns to "−" when open. All closed by default; visible keyboard focus.
- Flag: the "Where is the team based?" item is controlled by `showLocations` (also left out of the FAQ schema).

### 6.8 Final CTA
- Purpose: last, clearest ask. Copy: A.8
- Layout: soft blue `band` section with two faint circles, centred H2 (bold part navy), body, primary "Talk to us", the email line with the address as a navy link.
- Flags: `enableBooking` adds a navy-outline "Book a call" button to `BOOKING_URL` (new tab, `rel="noopener"`); off or no URL → only "Talk to us". `enableContactForm` (Phase 2) replaces the body + email line with the form; the mailto stays as a fallback link.

### 6.9 Footer
- Copy: A.9. Layout: ink. Logo; a "Contact" column with the email; an "On this page" column repeating the nav. Bottom row: copyright, entity line and privacy link where flagged, and "Photos are illustrative stock images." on the right.
- Flags: `showLegalEntity` controls the entity line; `showPrivacyPage` controls the privacy link. If off: not rendered.

### 6.10 404 page
- Copy: A.10. Layout: header, centred H1 + body + button back to `/`, footer. Ink background. `noindex`.

### Data rule (applies to every form and every future change)
- Forms ask for contact details and a short task description only. The hint tells people not to include client, customer or tenant personal details. Never add fields for financial, health or identity information. Write this rule into `CLAUDE.md`.

## 6b. Fixture build (for testing only)
- A second build config in git-ignored `.verify/fixture/` that overrides `site.config.ts` and `flags.ts` and fills every `[[TBC]]` with reserved fake values. Select it with `SITE_FIXTURE=1`, output to `.verify/fixture/dist`. It must never be deployed, carries `noindex`, and is exempt from the Lighthouse SEO score.
- Reserved values: email `test@example.com`; domain `example.com`; booking URL `https://example.com/book`; entity line `Test Entity Pty Ltd, ABN 00 000 000 000`; prices `From $1 AUD per test`; proof `Test Customer said this is a test.`; privacy body `Test privacy policy.`
- Run every Phase 1b check against both builds. Real build serves on 4321, fixture on 4322. A check that can only pass with real values passes on the fixture and is reported "blocked by TBC" on the real build, not as a fail.

## 7. Feature flags
All flags live in `src/config/flags.ts`. The site must build and look complete with all flags false. Flipping a flag never needs a code change.

| Flag | Default | Controls | Turn on when | Owner |
|---|---|---|---|---|
| `showPricing` | false | price lines on both offer cards | billing basis and GST wording confirmed, price copy filled in | Patrick |
| `showProof` | false | real estate proof block | written permission from the named client and copy approved; any numbers substantiated | EC |
| `showLocations` | false | hero location line, "Where is the team based?" FAQ item | disclosure approved and privacy policy names offshore handling | Patrick |
| `showLegalEntity` | false | footer entity + registration line | contracting entity confirmed | Patrick + lawyer |
| `showPrivacyPage` | false | `/privacy/` page and footer link | lawyer-reviewed policy text supplied | Patrick + lawyer |
| `enableContactForm` | false | enquiry form in final CTA | privacy page live, Resend domain verified, Turnstile keys set | EC |
| `enableBooking` | false | "Book a call" button | `BOOKING_URL` set and privacy page live | EC |
| `enableTracking` | false | any analytics script beyond Cloudflare Web Analytics | privacy page live and tool chosen | EC |

`enableContactForm`, `enableBooking` and `enableTracking` also require `showPrivacyPage`; if it's false they stay off and the build logs a warning.

## 8. Integrations
- Email CTA (Phase 1): `mailto:{CONTACT_EMAIL}?subject=...` using subjects in A.ui, URL-encoded, through one `EmailLink` component.
- Analytics: Cloudflare Web Analytics, enabled by the owner in the dashboard; no code. Nothing else unless `enableTracking`. No conversion events in v1 (the CTA is a mailto); `docs/gtm-events.md` is N/A until a form or booking ships.
- Booking (Phase 2): plain link to `BOOKING_URL`, no embed. Missing value → hidden.
- Form (Phase 2): one form, source name `Website enquiry`. Pages Function `functions/api/enquiry.ts`. Env vars: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, public `TURNSTILE_SITE_KEY`, plus `FORM_FROM_EMAIL` / `FORM_TO_EMAIL` from config. Protections: hidden honeypot (silently drop), Turnstile verified server-side, server-side validation (required fields, email format, max 2,000 characters for the task), and a Cloudflare rate-limiting rule documented in `DEPLOY.md`. Without JS (Turnstile can't run) the visible fallback is the email link. Missing env var → form not rendered, mailto shows.
- Lead destination: email only to `FORM_TO_EMAIL` (low volume; a sheet or CRM is a later decision).
  | Source | Inbox |
  |---|---|
  | Website enquiry | `FORM_TO_EMAIL` |
- Funnels, feeds: N/A for v1.

## 9. SEO, performance, accessibility
- `src/data/routes.json` holds every page's path, title, description, noindex flag and OG image; `<head>`, the sitemap and any links read from it. Values: A.meta.
- Pre-rendered HTML; one H1 per page; canonical on every page (`https://{SITE_DOMAIN}/`); trailing slashes consistent; custom 404 (noindex).
- Schema.org JSON-LD: `Organization` (`name`, `alternateName`, `url`, `email`, `logo` → `/logo.png`), one `Service` per offer (name + description; no `offers`/price unless `showPricing`), `FAQPage` matching the visible FAQ items exactly (respecting `showLocations`). No address, no `LocalBusiness`.
- `robots.txt` allows all and points to `/sitemap.xml`, written at the end of the build from the routes file (indexable pages only). Fixture build: `noindex` + `Disallow: /`.
- OG/Twitter tags with `/og-image.png`. `llms.txt`: what Me² is, the two offers, first market, contact email, key URL, also-known-as "Me Squared". IndexNow key file plus `npm run indexnow`.
- Performance: no images apart from the logo (served as WebP/PNG with width/height); fonts self-hosted and preloaded; zero third-party requests; inline critical CSS is fine. Targets: Lighthouse ≥ 90 / 95 / 95 / 95, CLS < 0.1.
- `public/_headers`: HSTS (`max-age=31536000`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, and a CSP of `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self' mailto:` (Phase 2 adds Turnstile and Cloudflare Analytics hosts). Turn off Cloudflare Email Obfuscation for the zone (it rewrites the mailtos into `/cdn-cgi/l/email-protection` links).
- WCAG 2.1 AA: only §5 pairs, visible focus everywhere, one H1, logical heading order, skip link, `<html lang="en-AU">`, reduced motion respected, tap targets ≥ 44px.

## 10. Phases and acceptance criteria
Every check names how to run it. Put Phase 1b checks in `npm run verify` (`scripts/verify.mjs`) and report pass/fail per check, per build.

### Phase 0 — Skeleton
- [ ] Scaffolded; `npm run build` passes; `npm run preview` serves (or preview deploy if §1 allows)
- [ ] `src/content/site.ts`, `src/config/flags.ts`, `src/config/site.config.ts`, `src/data/routes.json`, `src/styles/tokens.css`, `CLAUDE.md`, `DECISIONS.md` exist
- [ ] Git initialised; brief and skeleton committed

### Phase 1a — Design proof (STOP for owner approval)
- [ ] Header, hero and the Problem + How it works sections built with the §5 tokens and real Appendix A copy
- [ ] Screenshots at 375 and 1280px in `screenshots/design-proof/`; no horizontal scroll; the hero "²" never sits under text at full strength
- [ ] Report: the screenshots, the tokens used, and any §5 value you had to fall back on. Wait for a yes before Phase 1b. If changes are asked for, update §5 and the proof, not the rest of the site.

### Phase 1b — Full site, flags off
- [ ] Every §6 section renders its Appendix A copy word for word (Playwright: compare each section's text to `site.ts` values)
- [ ] `grep -rn "\[\[TBC" dist/` returns nothing on the real build
- [ ] No price text (`$`) in `dist/index.html` while `showPricing` is false (ignoring scripts/JSON-LD)
- [ ] Playwright screenshots at 375, 768 and 1280px, real build and fixture build with all flags on, in `screenshots/`; `document.documentElement.scrollWidth <= innerWidth` at each size
- [ ] Lighthouse desktop and mobile on the real build: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] `npx linkinator http://localhost:4321 --recurse --skip "mesquaredagency.com" --skip "^mailto:"`: no broken internal links; `#how` resolves
- [ ] Every "Talk to us" and offer button is a `mailto:` to `CONTACT_EMAIL` with the A.ui subject
- [ ] No hardcoded identity: `grep -rn "mesquaredagency\|hello@" src/ functions/ public/ scripts/` matches only `src/config/site.config.ts` (generated `llms.txt` excepted if built from config)
- [ ] No third-party requests on load (Playwright network log: all same-origin)
- [ ] Layout checks (section alternation, no two same-colour sections touching, equal card heights, no empty gaps) with all flags off, all on, and each of `showPricing`, `showProof`, `showLocations`, `enableContactForm` on alone
- [ ] Banned-words and brand-naming checks on rendered text, titles, alt text and aria labels (case-insensitive, whole word)
- [ ] Head check over `dist/`: unique title and description within length limits, one H1, canonical; sitemap lists only indexable pages
- [ ] JSON-LD parses; FAQPage matches visible questions; `llms.txt`, `robots.txt`, `_headers`, `og-image.png`, `logo.png` exist
- [ ] `@axe-core/playwright`: zero violations on both builds, flags off and on; keyboard-only pass of header, FAQ and buttons
- [ ] `/404` renders A.10; `/privacy/` absent from `dist/` while `showPrivacyPage` is false
- [ ] `docs/` files from §14 exist and describe what was built

### Phase 2 — Flagged features (only after owner review)
- [ ] Each flag on → feature works; off → §6 fallback renders
- [ ] Form: one test submission arrives at `FORM_TO_EMAIL` (EC's go-ahead first); honeypot submission silently dropped; failed Turnstile rejected; missing env var → mailto fallback
- [ ] Booking button opens `BOOKING_URL` in a new tab

## 11. Redirects and SEO preservation
N/A — new build; the domain only shows a parking page.

## 12. CLAUDE.md (write in the repo root in Phase 0)
- One-page sales site for Me²; primary goal: visitor clicks "Talk to us" (mailto to `CONTACT_EMAIL`).
- Client identity lives only in `src/config/site.config.ts`; copy and section order only in `src/content/site.ts`; titles/descriptions only in `src/data/routes.json`; tokens only in `src/styles/tokens.css`; flags only in `src/config/flags.ts`. Never hardcode; never remove a fallback; the site must look complete with all flags off.
- Brand rules (§2): visible name `Me²`; banned words; Australian English; sentence case. Grep before committing copy.
- Never invent names, testimonials, statistics, results, logos or prices. Never name individuals. Real estate appears only in its own section.
- Forms collect contact details and a short task description only; never fields for financial, health or identity information.
- Design: keep the approved identity (§5). Refine within it; mock up one page and get a yes before any wider restyle.
- Allowed dependencies and out-of-scope list: BRIEF §3, in full.
- Git: branch + PR for every change; run `git branch --show-current` right before every commit and push; never push to `main` once connected to Cloudflare; plain-English commit messages.
- Ask EC before merging, deploying to production, DNS changes, or anything that emails real people.
- When behaviour changes, update the matching `docs/` file and the README launch checklist in the same change.
- Verify with `npm run verify` plus a look at 375 and 1280px. Deploy: see `DEPLOY.md`.

## 13. Open decisions
| # | Decision | Options | Recommended | Owner | Blocks |
|---|---|---|---|---|---|
| 1 | Launch domain and CTA inbox | `mesquaredagency.com` or `mesquared.co.uk`; confirm `hello@` receives mail | `mesquaredagency.com`; send a test email to `hello@` before launch | EC | Launch (one-file change if switched) |
| 2 | Service claims | Keep or cut each of the six example roles and the "a person checks it" line | Keep only what can be delivered within 30 days of signing | EC | Launch |
| 3 | Billing basis and GST wording | One-off, monthly, setup + monthly; "+ GST" or not | Setup + monthly for AI Roles; monthly with a minimum term for EBUs. GST depends on which entity invoices | Patrick + accountant | `showPricing` |
| 4 | Contracting entity | Australian, Cambodian, other | Needs Australian and Cambodian legal advice | Patrick + lawyer | `showLegalEntity` |
| 5 | Disclose Phnom Penh team | Show or don't | Show it; the privacy policy must disclose offshore handling (APP 8) anyway | Patrick | `showLocations` |
| 6 | Privacy policy | Lawyer-reviewed text covering the APPs incl. APP 8 | Review before any form, booking or tracking goes live | Patrick + lawyer | `showPrivacyPage`, form, booking, tracking |
| 7 | Named proof (first client) | Named case study, anonymised, none | Anonymised until written permission; numbers substantiated and reviewed under the ACL | EC | `showProof` |
| 8 | Agent-licensing boundary | — | Lawyer check that the real estate roles read as admin support, not work needing an agent's registration (e.g. SA Land Agents Act 1994) | Patrick + lawyer | A.6 copy at launch |
| 9 | Brand finals | Vector logo, final palette, tagline ("from me to we." is in the designer's concept, not approved) | Build on the supplied logo now; swap `tokens.css` and the logo file when the designer delivers | Patrick + designer | Nothing |
| 10 | Trademark and font licence | IP Australia search; Instrument Sans is OFL | Run the search before paid marketing | EC | Nothing |
| 11 | Booking tool and sending address | Cal.com or Calendly; `website@` | Cal.com; `website@` as a send-only alias | EC | `enableBooking`, form |

Needs professional review (never resolved by this brief): #3 GST, #4, #6, #7 numbers, #8.

## 14. Deliverables back from the agent
- Local run steps + `DEPLOY.md` (incl. the rate-limiting rule and Email Obfuscation note); preview URL if §1 allows
- Phase check report (pass/fail per item, both builds, command used) with `screenshots/`
- `README.md`: what the site is, pages table, run locally, edit copy, flip each flag, swap tokens and logo, launch checklist ticked only when verified
- `docs/`: `supplied-assets.md` (What / Where it goes / Until then), `media.md` (logo source, OG image, no stock), `flags.md` (each flag, what it shows, who signs off), and in Phase 2 `forms.md` and `lead-notifications.md`
- `DECISIONS.md`: every judgement call
- Remaining `[[TBC]]` list across the repo, with the file for each

## 15. After launch (owner's checklist)
- Create the Cloudflare account under `tech@mesquaredagency.com` (if not done) and the `mesquared` Pages project; connect `mesquaredagency.com` and a `www` → apex redirect; confirm HTTPS.
- Cloudflare Pages can only serve the apex (`mesquaredagency.com`, not just `www`) when the domain's DNS is on Cloudflare. The domain already answers through Cloudflare, so check the zone is in the `tech@` account; if it isn't, move it there. Before any nameserver change, copy every Google Workspace record (MX, SPF, DKIM, DMARC, verification TXT), keep one merged SPF record, and send and receive a test email straight after.
- Turn off Email Obfuscation (Scrape Shield) for the zone; enable Cloudflare Web Analytics.
- Before the form goes live: verify the sending domain in Resend; add its SPF/DKIM alongside Google's (one SPF record); set DMARC.
- Hosting, domain and analytics accounts owned by the business, not a person.
- Submit the sitemap in Google Search Console; run `npm run indexnow`.

---

## Appendix A — Copy

### A.meta
- Title: `Me²: AI roles and trained operators for back-office work`
- Description: `Me² sets up AI roles for repetitive back-office work, with trained operators to run them and check the output. Starting with real estate.`
- OG title: `AI does the volume. People own the outcome.`
- OG image text: logo + `AI does the volume. People own the outcome.`
- 404 title: `Page not found | Me²` · 404 description: `This page doesn't exist or has moved. Go back to the Me² home page.`
- Privacy title: `Privacy | Me²` · Privacy description: `How Me² collects, uses and protects personal information sent through this website, and who to contact with a privacy question.`

### A.1 Header
- Logo (links home, aria-label `{SITE_NAME_PLAIN} home`)
- Nav (aria-label `Sections`): `How it works` → `#how` · `Services` → `#offers` · `Real estate` → `#real-estate` · `Questions` → `#faq`
- Button: `Talk to us`

### A.2 Hero
- H1: `AI does the volume. **People own the outcome.**`
- Subhead: `{SITE_NAME} sets up AI roles for the repetitive work, and trained operators to run them and check what they produce. You get the work done without hiring for it or babysitting another tool.`
- Primary button: `Talk to us`
- Secondary link: `See how it works`
- Location line (`showLocations`): `Command Centre teams in Adelaide and Phnom Penh.`

### A.2b Pillars
- `AI` — `does the first pass`
- `People` — `check every output`
- `One job` — `is enough to start`
- `Your tools` — `are where we start`

### A.3 Problem
- Eyebrow: `The problem`
- H2: `Admin grows faster than **headcount.**`
- Illustration cards (decorative): `Inbox`, `Weekly reports`, `Overdue reminders`, `Data entry`, each with status `Waiting`
- Paragraph 1: `Every new client brings more inbox, more reports and more chasing. Hiring to keep up is slow and expensive, and the work still lands on your best people.`
- Paragraph 2: `AI tools on their own don't fix it. Someone still has to set them up, check what they produce and fix what they get wrong. That someone is usually you.`

### A.4 How it works
- Eyebrow: `How it works`
- H2: `The back-office work that buries your team, **handled.**`
- Step labels: `Step 1`, `Step 2`, `Step 3`
- Button after the steps: `Talk to us`
- Intro: `We don't hand you software and walk away. We take on the work.`
- Step 1 title: `We map the work`
- Step 1 body: `We start with the tasks that eat the most hours and get done the same way every time.`
- Step 2 title: `AI roles do the first pass`
- Step 2 body: `Each AI role handles one job: drafting a report, sorting an inbox, working out what's owed, preparing a summary.`
- Step 3 title: `A person checks it`
- Step 3 body: `Every output gets checked before it counts, by your team or by a trained {SITE_NAME} operator. AI drafts, people decide.`

### A.5 Offers
- Eyebrow: `Services`
- H2: `Two ways to **start**`
- Intro: `Start with one job, or hand over a whole workload.`
- Card 1 name: `AI Roles`
- Card 1 body: `One AI role for one job, set up around how your team already works. Your team reviews the output and stays in control.`
- Card 1 best for: `Best for teams that know exactly which task is eating their week.`
- Card 1 price (`showPricing`): `From $2,000 AUD [[TBC: billing basis and GST wording — Patrick]]`
- Card 1 chips: `One job` · `Your team reviews` · `Built around your tools`
- Card 1 photo alt: `A laptop open on a desk by a window`
- Card 1 button: `Ask about AI Roles`
- Card 2 name: `Effective Business Units`
- Card 2 body: `A trained Command Centre operator runs a set of AI roles for you as a managed service. They check the work, handle the exceptions and report back to you.`
- Card 2 best for: `Best for businesses that want a whole workload off their plate.`
- Card 2 price (`showPricing`): `From $3,000 AUD [[TBC: billing basis and GST wording — Patrick]]`
- Card 2 chips: `Managed service` · `Trained operator` · `Exceptions handled` · `Reports back to you`
- Card 2 photo alt: `People working at computer screens in an office`
- Card 2 button: `Ask about Effective Business Units`

### A.6 Starting with real estate
- Eyebrow: `First market`
- H2: `Starting with **real estate**`
- Photo card title: `Property management` · chips: `Inspections` · `Arrears` · `Maintenance` · `Owner reports`
- Photo alt: `A hand holding a set of house keys beside a front door`
- Body: `Real estate is our first market. Property management runs on high-volume, repeatable admin, which is exactly the kind of work AI roles and trained operators are built for.`
- List intro: `Roles we set up for agencies include:`
- List items:
  - `Drafting routine inspection reports for review`
  - `Tracking rent arrears and preparing reminders`
  - `Sorting and routing the property management inbox`
  - `Drafting replies to leasing enquiries`
  - `Logging and following up maintenance requests`
  - `Preparing owner and landlord reports`
- Closing line: `Not in real estate? If your team has repeatable back-office work, we'd like to hear about it.`
- Proof block (`showProof`): `[[TBC: client case study, approved in writing by the client — EC]]`

### A.7 FAQ
- Eyebrow: `Questions`
- H2: `Common **questions**`
- Side card: `Something else on your mind? Ask us directly.` · button `Talk to us`
- Q: `Do we have to change the software we use?`
  A: `We start from the tools and processes you already use and set each AI role up around them. If something would need to change, we'll tell you before we start.`
- Q: `Who checks the AI's work?`
  A: `With an AI Role, your team reviews the output. With an Effective Business Unit, a trained {SITE_NAME} operator checks it before it reaches you. Either way, a person signs off.`
- Q: `What's the difference between the two options?`
  A: `An AI Role is one tool for one job that your team runs. An Effective Business Unit is a managed service: a {SITE_NAME} operator runs several AI roles for you and owns the result.`
- Q: `Is this only for real estate?`
  A: `No. Real estate is where we started. The same approach suits any business with repeatable back-office work.`
- Q (`showLocations`): `Where is the team based?`
  A: `Our Command Centre runs across Adelaide and Phnom Penh, Cambodia.`
- Q: `How do we get started?`
  A: `Email us about the task that takes up the most time. We'll tell you whether it's a fit, and what an AI Role or Effective Business Unit for it would look like.`

### A.8 Final CTA
- H2: `Tell us which task is **eating your week.**`
- Body: `Send a short email about the work you'd like off your plate. We'll tell you straight whether we can help.`
- Button: `Talk to us`
- Booking button (`enableBooking`): `Book a call`
- Email line: `Or email us at {CONTACT_EMAIL}`

### A.9 Footer
- Logo (no link)
- Column headings: `Contact` · `On this page` (links repeat the A.1 nav)
- Imagery note: `Photos are illustrative stock images.`
- Email link text: `{CONTACT_EMAIL}`
- Copyright: `© {YEAR} {SITE_NAME}`
- Entity line (`showLegalEntity`): `[[TBC: legal entity name and registration number — Patrick + lawyer]]`
- Privacy link (`showPrivacyPage`): `Privacy`

### A.10 404 page
- H1: `Page not found`
- Body: `This page doesn't exist or has moved.`
- Button: `Go to the home page`

### A.privacy (`showPrivacyPage`)
- H1: `Privacy`
- Body: `[[TBC: lawyer-reviewed privacy policy text, including offshore disclosure — Patrick + lawyer]]`
- Contact line: `Questions about privacy: {PRIVACY_EMAIL}`

### A.ui
- Skip link: `Skip to content`
- Mailto subjects: header, hero and final CTA use `Website enquiry`; AI Roles card uses `AI Roles enquiry`; Effective Business Units card uses `Effective Business Units enquiry`
- Logo alt / aria-label: `{SITE_NAME_PLAIN}` (header link: `{SITE_NAME_PLAIN} home`)
- Hero "²" graphic: decorative, `aria-hidden="true"`, no alt
- FAQ toggle: the native `<summary>`; no extra label
- Form (`enableContactForm`):
  - Heading: none (sits under the A.8 H2)
  - Name label: `Your name`
  - Email label: `Work email`
  - Business label: `Business name`
  - Task label: `What work would you like off your plate?`
  - Task hint: `A sentence or two is plenty. Please don't include client, customer or tenant details.`
  - Submit button: `Send enquiry`
  - Sending state: `Sending…`
  - Required error: `Please fill in this field.`
  - Email error: `Enter an email address like name@business.com.au.`
  - Too long error: `Keep this under 2,000 characters.`
  - Success: `Enquiry sent. We'll reply to the email you gave us.`
  - Failure: `Your enquiry didn't send. Email us at {CONTACT_EMAIL} instead.`
  - Turnstile failure: `We couldn't confirm you're not a bot. Try again, or email us at {CONTACT_EMAIL}.`
- Fallback link under the form: `Prefer email? Write to {CONTACT_EMAIL}`
