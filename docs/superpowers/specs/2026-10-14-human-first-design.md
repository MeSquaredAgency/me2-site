# Human first: pain, offer and positioning (v0.16 draft)

14 Oct 2026. Branch `human-first`, from `main` 600540b. Homepage only. Nothing reaches `main` without EC's yes.

## Why

EC's notes on the live v0.15 page (screenshots, 14 Oct 2026):

- "Why one partner": "The pain points should be more obvious and prominent… the viewer (target market) needs to have a penny drop, oh shit moment here."
- "Start here": "Why is the formatting here so weird?"; the AI Roles block "needs a lot of work done".
- Overall: "We're making the AI too prominent. They're a human first, with custom trained AI agents to support them. Not the other way around."
- The offer: "The point of the EBU is so that we would be your marketing team, your ops team, finance team, the whole unit." "$3,000 per month for your entire business's backend covered, leaving the business owner / sales team / front line of the business to do what they do best without having to worry about the backend crap."

Decisions from the Q&A: a client buys **people, backed by AI**; the pain is built on all four of the pains below; pain layout is option A (four lines, each "picked up"); the "Effective Business Unit" name is dropped; hero gets drafted options to choose from.

**The page's idea:** you run the front of the business; Me² runs everything behind it (finance, operations, marketing) with trained people who own the work and AI agents built for your business.

## Success

A business owner who lands on the page:

1. Recognises their own week in the pain section before they reach the offer.
2. Understands that Me² is people who take the back end off them, and that the AI is the tools those people use.
3. Sees one clear price for that ($3,000 + GST a month), with a smaller way in and websites as the other door.

## 1. Pain section (replaces "Why one partner")

`Statement.astro` is replaced by a new `Pain.astro` (same place on the page, dark). Copy lives in `content.pain`.

Label: **Where your week goes**

Four rows, one per pain. Each row: a large line (display size, the hero's type), a one-sentence second line in haze, and a stamp.

| # | Line | Second line | Stamp |
|---|------|-------------|-------|
| 1 | The invoice nobody chased is still sitting there. | Work you've already done, waiting to be paid for, because nobody had the hour to follow it up. | Finance · owned by Me² |
| 2 | Your best person spent Friday building a report. | The people who should be selling and looking after customers are doing data entry instead. | Operations · owned by Me² |
| 3 | You hired for it. They left, and took the process with them. | Every new hire starts from scratch, and the backlog is back the week they go. | Every process written down · owned by Me² |
| 4 | Three suppliers, and nobody owns the whole picture. | An agency for the site, a developer for the systems, a bookkeeper for the rest. When something breaks, everyone points somewhere else. | One team · owned by Me² |

The turn, after the four rows, full strength: **You run the front. Me² runs everything behind it.** Under it: "Finance, operations and marketing, owned by people and backed by AI agents trained on your business." Then a link down to Start here.

**Motion.** Each row arrives as it reaches the middle of the screen. Once it's settled, the stamp lands: a small coral square goes outline → half → solid (the board's language), and the stamp text fades in beside it. Rows that have been passed stay fully readable. The coral square is light on ink, which `--glow` allows; stamp text is mist on abyss, never coral text.

**Without motion / without JavaScript.** Everything shown, stamps already landed. The section reads in order to a screen reader: line, second line, stamp.

**Layout.** One row per roughly 70% of the screen height on desktop so each pain gets its own moment; on phones each row is its own block with generous space, no sticky or pinned behaviour.

## 2. Start here (rebuilt)

**Formatting fix.** One left-aligned grid for the whole section. The label, headline, intro and content all start on the same left edge; no 1 : 2.4 offset head. No dashed checkbox squares. No repeated per-item links.

Copy (drafts):

- Label: Start here
- H2: **Hand us the back end.**
- Intro: One team runs your finance, operations and marketing, so you, your sales team and your front line can do what you're best at.

**Main panel (dark glass, the page's big offer).**

- Name: **Your whole back end**
- Price: From $3,000 + GST a month (`showPricing`)
- Body: Trained {SITE_NAME} people own the work, backed by AI agents built around your business. They check every output, handle the exceptions and report back to you.
- Three columns inside the panel, each a unit with the jobs it takes off you (job name, one-line outcome):
  - **Finance:** Debtor follow-up; Bill coding; Weekly reporting (existing outcomes)
  - **Operations:** Inbox triage; Client intake; Quote follow-up (existing outcomes)
  - **Marketing** (NEW, EC to confirm each is deliverable):
    - Social posts and newsletters: drafted on schedule in your voice, for you to approve.
    - Enquiry follow-up: every new enquiry gets a reply and a follow-up.
    - Website updates: new pages, offers and news kept current.
    - Monthly marketing report: what ran, what worked and what's next, written up for you.
- Footer of the panel: "A written process for every repeat task, so the work never depends on one person." and one button: **Talk to us about your back end** (topic "Whole back end").

**Beneath it, two smaller panels side by side.**

- **Start with one job.** From $2,000 + GST to set up. "Not ready to hand over the back end? We'll set up one AI agent for one job, built around how your team already works. Your team reviews the output and stays in control." Button: Ask about one job (topic "One job").
- **Websites and digital products.** Quoted per project. Copy and list unchanged. Button: Ask about a website.

The "anything else" line ("Need something these don't cover…") stays as a quiet line under the two panels.

**Removed:** the AI Roles grid and its pointer light, six "Ask about this role" links, the EBU name everywhere (copy, schema, llms.txt, flags comment).

## 3. Human-first sweep (all draft copy)

| Where | Now | Proposed |
|---|---|---|
| Hero subhead | {SITE_NAME} is one team for the digital side of an established business… | {SITE_NAME} is the team behind your business. Our people run your finance, operations and marketing, backed by AI agents trained on how you work, and we design and build the website out front. |
| Hero screen captions | AI systems that do real work / Your back office, checked by people | AI agents trained on your business / Your back end, run by people |
| Board stages | In queue / AI drafting / Operator checking | Assigned / Agent drafting / Operator checking (done states unchanged) |
| How we work | Item 2 "A person checks the AI's work." | Moves to item 1: **A person owns every task.** Every task has a trained {SITE_NAME} person responsible for it. AI agents do the drafting; that person checks every name, date and number against the source before anything leaves. |
| FAQ | What does {SITE_NAME} actually do? | We run the back end of established businesses: finance, operations and marketing, done by trained people backed by AI agents built for your business. We also design and build websites. You can start with one job and add the rest later. |
| FAQ | What does it cost? | Your whole back end starts from $3,000 + GST a month. One job starts from $2,000 + GST to set up. Websites are quoted per project once we understand the job. |
| FAQ | Who checks the AI's work? | **Is it people or AI doing the work?** People, backed by AI. Every task is owned by a trained {SITE_NAME} person. AI agents trained on your business do the drafting and the volume, and that person checks it before it reaches you. If you start with one job, your own team reviews the output. |
| Contact body | Tell us what you're working on: a new site, a system that should exist, or the work that's eating your team's week… | Tell us what's eating your week: the back-end work you want off your plate, or the website you need. We'll tell you straight whether we can help. |
| Header nav | Start here | unchanged |
| `schema.ts` | Services: AI Roles, EBUs, websites | Services: Your whole back end, Start with one job, Websites |
| `postbuild.mjs` (llms.txt) | Build/Run lines, AI Roles, EBUs | Back end (finance, operations, marketing, people backed by AI), one job, websites |
| `flags.ts` comment | EBU | "whole back end" |

## 4. Hero options (EC to choose)

The H1 is read from `content.hero.h1`. For the preview only, a picker under the hero switches between options client-side (`?hero=1…6` also works, for sharing). The picker sits behind a new flag `showHeroPicker` (off by default, on in this branch); with it off the page shows `h1` alone. Before merge, the chosen line goes into `h1`, the flag goes off and `heroOptions` is deleted.

1. People own the outcome. AI does the volume. (EC's line, flipped)
2. You run the front. We run everything behind it.
3. We run the back office. You run the business. (approved v0.13 hero)
4. Real people run your back end. AI makes them fast.
5. A person who owns the work. AI that does the heavy lifting.
6. Your back end, run by people who own it.

The OG title in `routes.json` follows whichever is chosen.

## Rules this keeps

- Visible name always Me²; Australian English; sentence case. Banned words grepped before commit.
- No invented statistics, names, clients or results: the pain rows are situations, not figures.
- Every flag still has a fallback; with `showPricing` off, prices disappear and the panels still read complete.
- No new dependencies. No card grids, chips, icon wells or gradient text: the units are columns of text inside one panel.
- One bold moment stays the hero mark; the pain section's boldness is type and rhythm, not effects.

## Verification

`npm run verify` is still out of date for v0.15, so by hand: `npm run build`; axe at 375 and 1280 (dialog open, motion on and off); no sideways scroll; readable without JavaScript; `node scripts/lighthouse.mjs`; screenshots at 375 and 1280 looked at. Then push the branch for a preview URL (private behind Cloudflare Access; EC opens it).

## Open items for EC

1. The four marketing jobs: deliverable as written?
2. Which hero line.
3. "Hand us the back end." and "Your whole back end" as the offer's names.
4. The $3,000 covers all three units: is there any limit worth stating (e.g. volume), or leave it to the conversation?

## Out of scope

The CCO assessment pages, the privacy page, `showProof`/portfolio, the `npm run verify` rewrite (tracked separately), DNS, deploys.
