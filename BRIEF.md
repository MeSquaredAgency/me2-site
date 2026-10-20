# Me² — Build Brief v0.14 ("Squared": the squares story and the coral glow) · v0.15 "Lit" LIVE since 10 Oct 2026

Owner: Elliot Crabb (EC) · Decision-maker: Patrick · Date: 9 Oct 2026 · Mode: New build

v0.15 (9–10 Oct 2026, branch `agency-redesign`; LIVE since 10 Oct 2026, see below): EC: "It is not good enough. It's clunky. It's not good to read… It needs a redesign… visually jaw dropping and impressive - but it also needs to do it's function (explain the business and acquire clients)." Me² is repositioned as a full-service agency for established businesses: it designs websites and digital products, builds AI systems, and runs the back office (EC's answers in Q&A: "Both: full-service agency", "One partner, three services", a portfolio of 2–5 projects). EC asked me to pick the most impressive of three directions and redo it if the vibe is wrong. The homepage mock-up: hero "We design it. / We build it. / We run it." with the Me² mark as a live 3D object (dark glass square, glowing coral ² square); "why one partner" statement that lights up as you scroll; selected work (APN Real Estate, pending EC's confirmation); services Design / Build / Run with a live illustration each; how we work; questions; close "Your business, squared." Colours from the logo (deep navy, coral as light, cool paper); one typeface (Instrument Sans). Copy is a draft for approval; see DECISIONS.md. §5, §6 and Appendix A below still describe v0.14 and will be rewritten once EC approves v0.15. Round 2 (EC: "It's getting there" and a priority list): the mark's glass face shows the work, scene by scene with the headline; a priced "Start here" offer (six named AI roles from $2,000 + GST to set up, EBUs from $3,000 + GST a month, websites quoted per project); a three-field enquiry form emailed through Cloudflare Email Sending instead of the mailto; work as a case study; a draft privacy page. See DECISIONS.md and docs/forms.md. Round 3 (10 Oct): EC preferred the hero "AI does the volume. People own the outcome." (approved v0.10 copy) over "We design it. We build it. We run it."; the screen keeps cycling through the three services. Selected work hidden (`showProof`) until projects are cleared; form email via Resend. **Went live on 10 Oct 2026** by accident when the Resend key was saved in the Cloudflare dashboard (it published the newest preview); EC chose to keep it live and `main` was brought into line. Still to confirm: privacy draft (incl. the Phnom Penh mention), the six roles, GST wording. EC then made the site private behind Cloudflare Access (10 Oct) until those are confirmed; `main` matches live (PR #1). The live form was tested: the enquiry reached hello@'s inbox.

v0.14 (9 Oct 2026, branch `hero-balance`, NOT live): EC sent five sites he likes (cognichip.ai, weevolveit.com, creativeans.com, hitit.com, inflect.co.uk) and asked what could inspire Me². From the plan EC chose two ideas, made in Me²'s own terms rather than copied: (1) a "living squares" story, one pinned canvas carrying four chapters as you scroll (Cognichip's idea of one object that changes as the story moves on): tasks pile up, AI drafts them, a person checks them, they become the Me² mark; it replaces the problem section and the "AI does the volume" statement; (2) a warm coral glow, the ² as a light source, behind the hero board, the story's last chapter and the final call to action. Also: the hero rebalanced into two columns after EC's "you think that looks good?"; sections below the first screens skip layout until near the screen (faster phones).

v0.13 (9 Oct 2026, branch `hero-says-what-we-do`, published 9 Oct on EC's "Just push it live" as Worker version a32d4082): EC: "it doesn't tell me what the business does / is from the first sight… You should know the minute you land on the page." and "we don't want to have Real Estate down as a specific industry that we work with - we would want to have use case examples… The website has to be much much better." (apnre.com.au was named as the bar for craft only: "Don't copy APNRE site… I just wanted you to see how highly you are capable of performing.") The hero now says it plainly ("We run the back office. You run the business.", kicker "Managed back-office services") over a live Command Centre board of sample tasks; the real estate section and photo are replaced by six use-case examples across kinds of business; "AI does the volume. People own the outcome." becomes a full-width statement; the demo uses overdue invoices instead of rent arrears; the marquee is removed; the footer ends with a tonal me² wordmark.

v0.12 (9 Oct 2026, branch `redesign-wow`, published 9 Oct on EC's "publish"): EC: "more refined. More class. More streamlined. Think of Philippe Starck… the underlying point of the business still needs to come across… make it special… unique. Me²." The proof keeps every section and the message, re-expressed as the "Squared" system in §5: near-black and ivory, hairlines, an elegant serif with italic emphasis, and the ² as the organising idea (the hero square of tasks, superscript section numbers, small coral squares as the only accent).

v0.11 (9 Oct 2026, branch `redesign-wow`, NOT live): EC: "It needs bulking out massively… look to awwwards.com business/corporate… show how capable we are. It needs to wow every visitor." Proof adds a live canvas hero (task particles pass a "human check" gate; coral errors are caught), a scrolling work band, a scroll-lit "Admin grows faster than headcount" statement, an interactive demo (an AI Role drafts an arrears summary; the operator check catches $1,200 vs the ledger's $1,020, corrects it and signs off; labelled as made-up sample data), the four-part operating model and eight-step workflow, and a "typical VA service vs Me²" comparison. New copy is drawn from the Me² Company Handbook (Draft v0.1, 3 Oct 2026); statements EC must confirm before launch are listed in DECISIONS.md. Next (after approval): redesign services, real estate, FAQ and CTA in the same style and add pages (How we work, Services, Real estate, Security & data, Contact).

v0.10 (9 Oct 2026): EC preferred the "AI does the volume. People own the outcome." hero from the link-preview image. The hero is now that headline, left-aligned, with the icon bubbles grouped on the right and no photo; "The back-office work that buries your team, handled." moves to head How it works.

v0.9 (9 Oct 2026): EC approved the v0.8 direction ("yeah sure"), approved licensed stock photos, and asked that the logo not be forgotten. Adds four Unsplash photos (§5 Imagery), a vector logo traced from the supplied PNG and used in the header, footer, favicon, OG image and `/logo.png`, and copy for the remaining sections (Appendix A: offers, real estate, FAQ, footer).

v0.8 (9 Oct 2026): EC rejected the first design proof (minimal ink/paper type with a giant coral "2") and asked for inspiration from intelligentoffice.com. §5 and §6.1–6.4 now describe the richer direction; the v0.6 rules against eyebrow labels, emphasised words and decoration are withdrawn. New copy for the nav, pillars band, eyebrows and the problem illustration is in Appendix A.

Changes from v0.6 (5 Oct 2026): rebuilt to the premium build standard. Adds a design-proof stop (Phase 1a), a routes file, `llms.txt`, IndexNow, security headers, FAQ schema, the owner `docs/` set and git working rules. Colour tokens now come from the me² logo file EC supplied on 7 Oct (navy `#1B3853`, coral `#E7785C`) instead of the provisional values. All copy in Appendix A is unchanged from v0.6.

## 0. Read this first
- You are building a single-page sales site for Me² (pronounced "Me Squared"). Me² sets up AI roles for repetitive back-office work and pairs them with trained human operators who run them and check the output. Buyers are Australian business owners and managers. The brand is industry-agnostic: no industry is named as the market; kinds of business appear only as use-case examples (§6.6).
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
- Audience: owners, principals and operations managers of Australian small and mid-size businesses whose teams are stretched by repetitive admin (inbox, reporting, chasing, data entry). Industry-agnostic: no industry is named as a market. Kinds of business appear only as examples of the work (§6.6).
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

## 5. Design direction and tokens ("Squared", v0.14)
- Idea: **Me² = me, squared** — a team's capacity multiplied, with nothing lost in quality. Every visual decision comes from that: squares, superscripts, restraint.
- Hero signature (v0.13): the Command Centre board. Sample tasks from different kinds of business arrive at the top and move through four stages: in queue, AI drafting (a hairline fills under the row), operator checking (a bright line sweeps across) and checked, done. Some are caught (the row flashes coral, "Error caught") and end "Corrected, done" with a coral square. Squares mark the stage: dashed outline (queued), outline (drafted by AI), half-filled (being checked), solid (checked), coral (caught and corrected); a legend says the same in words, with "Illustration with sample tasks." Faint squared paper behind it. Static mixed-stage board for reduced motion and without JavaScript; pauses off-screen. The final CTA headline ends with the coral ² square, set tight to the full stop.
- The squares story (v0.14), straight after the hero: one canvas pinned for four screens while four chapters scroll past. Every square is a task. (1) "Admin grows faster than headcount": squares tumble onto an uneven pile, with the "Work waiting on someone" list beside it. (2) "AI does the volume": the pile snaps into a grid of outlines. (3) "People own the outcome": a fine check line sweeps across; squares turn solid; a few flash coral and stay marked as corrected. (4) "Your team, squared": the grid closes into the Me² mark, a big solid square with the small coral ² square at its top right, glowing. The counts are Pythagorean triples (25² = 24² + 7² on wide screens, 13² = 12² + 5² on phones), so the grid becomes exactly one big square and one small one. Wide screens: words left, squares right; phones: squares in the top of the screen, words rising from below on a translucent shade. Reduced motion: one still frame per chapter, no tweening. The canvas is decorative (sr-only summary) and never takes clicks.
- Section labels carry superscript numbers ("The problem¹", "See it in action²"…) with a hairline to the edge. The closing headline ends with a small coral square as an exponent.
- Colours (tokens in `src/styles/tokens.css`): `ink` #0D1116 · `ink-2` #161B22 · `ivory` #F3EFE7 · `bone` #E7E1D5 · `text` #111418 · `muted` #585D64 · `on-dark` #ECE7DE · `muted-dark` #9DA2A8 · `coral` #E7785C (² motif, caught errors, and since v0.14 a soft glow of light on ink via `--glow`; text only on ink, never on ivory) · `coral-deep` #A6412A (coral as text on ivory) · `sage` #7FB59A ("checked", always with a word) · `navy` #1B3853 (logo only).
- Allowed pairs (computed): text on ivory 16.10 · text on bone 14.18 · muted on ivory 5.79 · muted on bone 5.10 · on-dark on ink 15.38 · muted-dark on ink 7.37 · on-dark on ink-2 14.05 · muted-dark on ink-2 6.73 · coral on ink 6.53 · coral on ink-2 5.96 · coral-deep on ivory 5.37 · sage on ink-2 7.40 · ink on ivory 16.51 · ink on on-dark (light buttons) 15.38.
- Type: headlines in Instrument Serif 400 (OFL, `@fontsource/instrument-serif`, normal + italic), the emphasised part (`**…**` in the copy) set in italic, not bold. Everything else Instrument Sans Variable. Labels: 0.74rem, 600, letter-spacing 0.2em, uppercase.
- Layout: editorial grid, generous space (160px section padding on desktop), hairline rules instead of cards, pills or chips. Sections alternate ink / ivory / bone so two same colours only touch across a hairline.
- Buttons: quiet pills. Solid (ivory on ink, ink on ivory) for the main action; hairline outline for secondary; text links with a hairline underline that draws back on hover.
- Imagery: none since v0.13 (the real estate keys photo was removed with its section). The board, the demo and type carry the page.
- Motion: slow and fine. The hero board; the hero glow drifting (transform only, about 26s); the squares story, driven by scroll; the use-case panels easing in when a tab changes; the demo; 1s scroll-in reveals. All respect reduced motion. Animations start only after the page has loaded and gone quiet, and pause off-screen.
- Performance: sections below the first screens carry `.render-later` (`content-visibility: auto`), so phones only lay out what is near the screen; any in-page jump first lays everything out (Base.astro) so it lands exactly. The use-cases section is excluded (Lighthouse misreads its text colours while it is skipped). The logo's traced paths are inlined once and reused with `<use>`.
- Logo: the traced vector me² (light version on ink). OG image: ink, the serif headline and the squared mark.

## 6. Page structure
Section order (v0.14): header, hero (ink), the squares story with the problem¹ (ink, hairline top border), what we take on² (bone), see it in action³ (ink), how we work⁴ (bone), why Me²⁵ (ivory), services⁶ (bone), questions⁷ (ivory), final CTA (ink), footer (ink, hairline top border). Two same-colour sections never touch without a hairline.

### 6.1 Header
- Copy: A.1. Fixed over the hero; solid ink with a hairline once scrolled. Light logo left; nav (What we take on, How it works, Services, Questions; hidden under 1000px) and a "Talk to us" outline pill right.

### 6.2 Hero
- Purpose: anyone landing knows what Me² is and does within one glance, and can act. Copy: A.2
- Layout: two columns from 1100px, both above the fold. Left: kicker with a coral square, the H1 ("We run the back office." / italic "You run the business.", no coral square after it), the subhead (what we take off your plate and how: AI drafts, an operator checks, it comes back done) and the actions ("Talk to us" + "See what we take on" → `#use-cases`). Right: the Command Centre board (§5), plain hairlines with no panel behind it. Narrower screens stack them.
- Flag: `showLocations` adds the location line under the actions.

### 6.3 The squares story, with the problem (`id="problem"`)
- Copy: A.3 (chapter 1) and `story` in `site.ts` (chapters 2 to 4). Ink. See §5 for the canvas. Replaces the v0.13 problem section and the v0.13 statement (§6.5).

### 6.4 See it in action (`id="demo"`)
- Copy: A.demo (in `site.ts`). Ink. One task start to finish: an AI Role drafts an overdue-invoices summary; the operator check finds $1,200 against the ledger's $1,020, corrects it and signs off. Labelled as made-up sample data.

### 6.6 What we take on (`id="use-cases"`)
- Purpose: show the range of work without naming an industry as a market. Copy: `useCases` in `site.ts`.
- Six examples by kind of business (accounting practices, trades and construction, online retail, professional services, property management, any growing business). Each shows the work, what the AI Role drafts, what the operator checks and what you get, joined by a hairline with the board's squares (outline, half, solid).
- Wide screens: an index of the six on the left works as tabs (arrow keys, Home/End); the chosen example on the right. Phones and no JavaScript: all six in turn.
- Always labelled "Examples of the kind of work we take on, not client case studies." Never present them as clients.
- Flag: `showProof` adds the proof block under the examples.

### 6.7 How we work (`id="how"`), Why Me², Services (`id="offers"`)
- Copy: A.model, A.compare, A.5. The four parts and eight steps; the "typical VA service vs Me²" table; the two offers side by side, divided by a hairline.
- Flag: `showPricing` controls both price lines. If off: not rendered, no "$" price wording anywhere.

### 6.8 FAQ (`id="faq"`)
- Copy: A.7. Native `<details>` rows; the "Where is the team based?" item is controlled by `showLocations` (also left out of the FAQ schema).

### 6.8b Final CTA
- Copy: A.8. Ink; large serif ask ending with the coral ² square; "Talk to us" and the email line.
- Flags: `enableBooking` adds "Book a call" (needs `BOOKING_URL`); `enableContactForm` (Phase 2) replaces the email line with the form.

### 6.9 Footer
- Copy: A.9. Ink. Logo; "Contact" with the email; "On this page" repeating the nav; copyright, plus the entity line and privacy link where flagged. Ends with a large tonal me² wordmark (decorative, `aria-hidden`).
- Flags: `showLegalEntity`, `showPrivacyPage`.

### 6.10 404 page
- Copy: A.10. Layout: header, centred H1 + body + button back to `/`, footer. Ink background. `noindex`.

### Data rule (applies to every form and every future change)
- Sales forms ask for contact details and a short task description only. The hint tells people not to include client, customer or tenant personal details. The careers form (job applications) also takes a CV, work links and a short note (EC, 16 Oct 2026). Never add fields for financial, health or identity information. Write this rule into `CLAUDE.md`.

## 6b. Fixture build (for testing only)
- A second build config in git-ignored `.verify/fixture/` that overrides `site.config.ts` and `flags.ts` and fills every `[[TBC]]` with reserved fake values. Select it with `SITE_FIXTURE=1`, output to `.verify/fixture/dist`. It must never be deployed, carries `noindex`, and is exempt from the Lighthouse SEO score.
- Reserved values: email `test@example.com`; domain `example.com`; booking URL `https://example.com/book`; entity line `Test Entity Pty Ltd, ABN 00 000 000 000`; prices `From $1 AUD per test`; proof `Test Customer said this is a test.`; privacy body `Test privacy policy.`
- Run every Phase 1b check against both builds. Real build serves on 4321, fixture on 4322. A check that can only pass with real values passes on the fixture and is reported "blocked by TBC" on the real build, not as a fail.

## 7. Feature flags
All flags live in `src/config/flags.ts`. The site must build and look complete with all flags false. Flipping a flag never needs a code change.

| Flag | Default | Controls | Turn on when | Owner |
|---|---|---|---|---|
| `showPricing` | false | price lines on both offer cards | billing basis and GST wording confirmed, price copy filled in | Patrick |
| `showProof` | false | proof block under the use-case examples | written permission from the named client and copy approved; any numbers substantiated | EC |
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
- `robots.txt` allows all, declares Content Signals (`search=yes, ai-input=yes, ai-train=yes`, EC 20 Oct 2026) and points to `/sitemap.xml`, written at the end of the build from the routes file (indexable pages only). Fixture build: `noindex` + `Disallow: /`.
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
- Never invent names, testimonials, statistics, results, logos or prices. Never name individuals. No industry is presented as "our market" or a client list; kinds of business appear only as clearly labelled use-case examples.
- Sales forms collect contact details and a short task description only. The careers form also takes a CV, work links and a short note (EC, 16 Oct 2026). No form ever has fields for financial, health or identity information.
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
| 2 | Service claims | Keep or cut each of the six use-case examples (§6.6), the sample tasks on the hero board, and the "a person checks it" line | Keep only work Me² can deliver within 30 days of signing | EC | Launch |
| 3 | Billing basis and GST wording | One-off, monthly, setup + monthly; "+ GST" or not | **Settled 16 Oct 2026 (EC):** every offer is quoted to the client's requirements; the page shows how each is quoted, no figures. GST wording now belongs in quotes | Patrick + accountant | `showPricing` |
| 4 | Contracting entity | Australian, Cambodian, other | Needs Australian and Cambodian legal advice | Patrick + lawyer | `showLegalEntity` |
| 5 | Disclose Phnom Penh team | Show or don't | Show it; the privacy policy must disclose offshore handling (APP 8) anyway | Patrick | `showLocations` |
| 6 | Privacy policy | Lawyer-reviewed text covering the APPs incl. APP 8 | Review before any form, booking or tracking goes live | Patrick + lawyer | `showPrivacyPage`, form, booking, tracking |
| 7 | Named proof (first client) | Named case study, anonymised, none | Anonymised until written permission; numbers substantiated and reviewed under the ACL | EC | `showProof` |
| 8 | Licensing boundaries | — | Lawyer check that the property management and law-firm examples read as admin support, not work needing an agent's registration (e.g. SA Land Agents Act 1994) or a legal practitioner | Patrick + lawyer | §6.6 copy at launch |
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
- Title: `Me²: managed back-office services, checked by people`
- Description: `Me² takes repetitive admin off your team. AI drafts invoices, reports and replies; trained operators check every detail, and the work comes back done.`
- OG title: `We run the back office. You run the business.`
- OG image text: logo + `We run the back office. You run the business.`
- 404 title: `Page not found | Me²` · 404 description: `This page doesn't exist or has moved. Go back to the Me² home page.`
- Privacy title: `Privacy | Me²` · Privacy description: `How Me² collects, uses and protects personal information sent through this website, and who to contact with a privacy question.`

### A.1 Header
- Logo (links home, aria-label `{SITE_NAME_PLAIN} home`)
- Nav (aria-label `Sections`): `What we take on` → `#use-cases` · `How it works` → `#how` · `Services` → `#offers` · `Questions` → `#faq`
- Button: `Talk to us`

### A.2 Hero
- Kicker: `Managed back-office services`
- H1: `We run the back office. **You run the business.**`
- Subhead: `{SITE_NAME} takes the repetitive admin off your team: invoices, inboxes, reports, data entry and follow-ups. AI does the first draft, a trained operator checks every detail, and the work comes back done.`
- Primary button: `Talk to us`
- Secondary link: `See what we take on`
- Board, legend and sample tasks: `hero.board` in `src/content/site.ts` (illustration; kinds of business, never clients)
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

### A.5b The squares story, chapters 2 to 4 (v0.14)
Chapter 1 is A.3. The words live in `story` in `src/content/site.ts`.
- `Drafted by AI` · H2 `AI does **the volume.**` · `Drafts reports, sorts inboxes, extracts and summarises. It does the first pass, fast.`
- `Checked by a person` · H2 `People own **the outcome.**` · `A trained operator checks every name, date and number against the source before anything leaves.`
- `Done` · H2 `Your team, **squared.**` · `You get the work done without hiring for it or babysitting another tool.`

### A.6 What we take on (v0.13; replaces "Starting with real estate")
The words live in `useCases` and `interlude` in `src/content/site.ts`; that file is the copy of record for these sections.
- Eyebrow: `What we take on` · H2: `Different businesses. **The same back office.**`
- Intro: `Every business has admin that is repetitive and still has to be right. These are examples of the work an AI Role drafts and an operator checks.`
- Six examples, each with `The work`, `AI Role drafts`, `Operator checks`, `You get`: accounting practices (supplier bills and receipts), trades and construction (quotes, job sheets and invoices), online retail (the customer inbox), professional services (client intake and onboarding), property management (arrears and inspection reports), any growing business (debtors and weekly reporting).
- Note: `Examples of the kind of work we take on, not client case studies.`
- Closing: `Don't see your business here? If the work is repeatable, tell us about it.` + `Talk to us`
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
- Q: `What kinds of business do you work with?`
  A: `Any business with back-office work that is repetitive and has to be right: practices, trades, retailers, property managers and more. If the work gets done the same way every week, it's worth a conversation.`
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
