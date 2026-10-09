# Me² website

One-page sales site for Me² ("Me Squared"), which sets up AI roles for repetitive back-office work and pairs them with trained operators who run them and check the output. It's for Australian business owners and managers in any industry with repetitive admin. The page has one job: get the visitor to click **Talk to us**, which opens an email to the contact address.

Built with Astro + TypeScript and Tailwind CSS v4, as a static site. **Live at https://mesquaredagency.com** on Cloudflare Workers (static assets) in the Me² account; how to publish is in [DEPLOY.md](DEPLOY.md). No CMS, database or third-party scripts. Full spec: [BRIEF.md](BRIEF.md). Standing rules for future changes: [CLAUDE.md](CLAUDE.md).

**Look ("Squared", BRIEF §5):** Me² = me, squared. The hero says what Me² does and shows it on a live Command Centre board: sample tasks drafted by AI, checked by a person, some caught and corrected (the coral ² square). Below it, a scroll-driven story of squares (tasks) ends in the Me² mark; a soft coral glow is the ² as light. Near-black and ivory, hairlines, Instrument Serif headlines with italic emphasis, superscript section numbers, coral only for the ² and caught errors.

**Content rules:** real claims only (no invented numbers, testimonials or clients). Stock photos are illustrative and credited in [docs/media.md](docs/media.md). Never copy competitors.

## Pages
| Path | What it is |
| --- | --- |
| `/` | The sales page: hero with the Command Centre board, the squares story (the problem, AI drafts, people check, the Me² mark), what we take on (six use-case examples), the demo, how we work, why Me², two services, questions, call to action |
| `/404.html` | "Page not found" (noindex) |
| `/privacy/` | Privacy policy; only built when `showPrivacyPage` is on |

## Run it
Needs Node 22 or later.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:4321.

| Command | Does |
| --- | --- |
| `npm run build` | Builds the site into `dist/` (plus sitemap, robots.txt, llms.txt) |
| `npm run preview` | Serves `dist/` at http://localhost:4321 |
| `npm run verify` | Builds the real and test versions and runs every check (copy, links, accessibility, speed, search tags). Report in `.verify/report.md`; screenshots in `screenshots/` |
| `npm run build:fixture` | Builds the test-only version with every switch on and fake values (never deploy it) |
| `npm run brand` | Remakes `logo.png`, the favicons and the link-preview image from the logo SVGs |
| `npm run og` | Remakes just the link-preview image |
| `npm run indexnow` | After a live deploy, tells Bing and others the page changed |

## Changing things
- **Words:** all copy is in `src/content/site.ts`, word for word from BRIEF Appendix A. In headings, `**…**` marks the bold part.
- **Page title and description (for Google):** `src/data/routes.json`.
- **Business details** (name, domain, emails, booking link): `src/config/site.config.ts`. That's the only place they're typed.
- **Switches** (pricing, proof, locations, privacy page, booking…): `src/config/flags.ts`. See [docs/flags.md](docs/flags.md).
- **Colours, fonts, spacing:** `src/styles/tokens.css`. Only the colour pairs listed in BRIEF §5 have been checked for readability.
- **Photos and logo:** [docs/media.md](docs/media.md). Files still to come: [docs/supplied-assets.md](docs/supplied-assets.md).
- **Adding a page:** add its path, title and description to `src/data/routes.json`, create `src/pages/<name>.astro` using `Base`, `Header` and `Footer`, and link to it from the footer. The sitemap picks it up automatically.

Every change goes on a branch with a pull request. Check the branch with `git branch --show-current` before committing. Code: https://github.com/MeSquaredAgency/me2-site (private). A GitHub Actions workflow publishes `main` to the live site and gives every other branch a preview link ([DEPLOY.md](DEPLOY.md)).

## Launch checklist
Tick only what has been checked.

- [x] Site builds; `npm run verify` passes on the real and test versions (see `.verify/report.md`)
- [x] Design approved by EC (9 Oct 2026, round 2)
- [x] Published in the Me² Cloudflare account as the `mesquared` Workers project ([DEPLOY.md](DEPLOY.md))
- [x] Checked on the temporary workers.dev address before connecting the domain (9 Oct 2026)
- [ ] Test email sent to hello@mesquaredagency.com and answered (the only way in until the form ships)
- [ ] Six use-case examples, the hero board's sample tasks and the "a person checks it" promise confirmed deliverable (BRIEF §13 #2)
- [ ] Five handbook statements on the live page confirmed by EC (see DECISIONS.md, 9 Oct 2026)
- [ ] Lawyer check that the property management and law-firm examples read as admin support (BRIEF §13 #8)
- [x] mesquaredagency.com connected with HTTPS; `www` and `http://` redirect to https://mesquaredagency.com in one 301 (checked 9 Oct 2026)
- [x] Google email DNS records (MX, SPF, DKIM, DMARC, verification) unchanged after the switch (checked 9 Oct 2026)
- [x] Email links not rewritten by Cloudflare Email Obfuscation (checked on the live page)
- [ ] Cloudflare Web Analytics turned on
- [ ] Sitemap submitted in Google Search Console; `npm run indexnow` run
- [ ] Vector logo master from the designer swapped in (optional; the traced one works)
