# Me² website

One-page sales site for Me² ("Me Squared"), which sets up AI roles for repetitive back-office work and pairs them with trained operators who run them and check the output. It's for Australian business owners and managers; real estate agencies are the first market. The page has one job: get the visitor to click **Talk to us**, which opens an email to the contact address.

Built with Astro + TypeScript and Tailwind CSS v4, as a static site for Cloudflare Pages. No CMS, database or third-party scripts. Full spec: [BRIEF.md](BRIEF.md). Standing rules for future changes: [CLAUDE.md](CLAUDE.md).

**Look:** an established business-services style (EC's reference was intelligentoffice.com): a navy hero headed "AI does the volume. People own the outcome." with floating icons, light-and-bold headings, white cards on soft grey, steel-blue buttons. The me² logo's navy and coral run through it.

**Content rules:** real claims only (no invented numbers, testimonials or clients). Stock photos are illustrative and credited in [docs/media.md](docs/media.md). Never copy competitors.

## Pages
| Path | What it is |
| --- | --- |
| `/` | The sales page: hero, four-point band, the problem, how it works, two services, real estate, questions, call to action |
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

Every change goes on a branch with a pull request. Check the branch with `git branch --show-current` before committing. Once `main` is connected to Cloudflare, merging to it deploys the live site.

## Launch checklist
Tick only what has been checked.

- [x] Site builds; `npm run verify` passes on the real and test versions (see `.verify/report.md`)
- [x] Design approved by EC (9 Oct 2026, round 2)
- [ ] Cloudflare account under tech@mesquaredagency.com and the `mesquared` Pages project created ([DEPLOY.md](DEPLOY.md))
- [ ] Preview deploy checked on a phone and a laptop
- [ ] Test email sent to hello@mesquaredagency.com and answered (the only way in until the form ships)
- [ ] Six real estate roles and the "a person checks it" promise confirmed deliverable (BRIEF §13 #2)
- [ ] Lawyer check that the real estate roles read as admin support (BRIEF §13 #8)
- [ ] Domain connected, `www` redirects to the bare domain, HTTPS works, email still works afterwards
- [ ] Cloudflare Email Obfuscation and Rocket Loader off; Web Analytics on
- [ ] Sitemap submitted in Google Search Console; `npm run indexnow` run
- [ ] Vector logo master from the designer swapped in (optional; the traced one works)
