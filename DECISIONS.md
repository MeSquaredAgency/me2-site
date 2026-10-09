# Decisions log

Judgement calls made during the build, newest last.

| Date | Decision | Why |
|---|---|---|
| 9 Oct 2026 | Brief upgraded to v0.7 from the 5 Oct v0.6; all Appendix A copy kept word for word | v0.6 already held EC's and Patrick's decisions; v0.7 adds the premium build standard (design proof, routes file, llms.txt, headers, docs) |
| 9 Oct 2026 | Colour tokens taken from the me² logo EC supplied on 7 Oct (navy #1B3853, coral #E7785C) instead of v0.6's provisional ink #14202E / coral #FF5F3C | v0.6 said to swap tokens when brand material arrived; the site now matches the logo. Contrast recomputed for every pair (BRIEF §5) |
| 9 Oct 2026 | Teal from v0.6 dropped; step circles use coral on ink and navy on paper | The supplied logo has no teal; fewer colours keeps the accent meaningful |
| 9 Oct 2026 | Header and footer use the supplied PNG logo (recoloured light for dark backgrounds) rather than a typed wordmark | A real logo file exists. It is small (427×328), so `public/logo.png` is upscaled and soft; a vector master is requested in docs/supplied-assets.md |
| 9 Oct 2026 | The hero's big coral figure is a "2" digit in Instrument Sans, not the "²" character | The superscript glyph is drawn small and high inside its box; the full-size digit is what the logo's coral 2 actually looks like |
| 9 Oct 2026 | Hyphenated words in the hero H1 are kept on one line (`white-space: nowrap`) | On phones "back-office" split as "back- / office"; the words are unchanged |
| 9 Oct 2026 | Screenshots use the installed Microsoft Edge through Playwright (`channel: 'msedge'`) | Avoids downloading another browser; set `PW_CHANNEL=` to use Playwright's Chromium |
| 9 Oct 2026 | Sitemap written by `scripts/postbuild.mjs` from the routes file instead of `@astrojs/sitemap` | One page; keeps the routes file the single source and one fewer dependency |
| 9 Oct 2026 | No deploy | `wrangler whoami` shows the APN Real Estate account, not `tech@mesquaredagency.com` (BRIEF §1) |
| 9 Oct 2026 | First design proof rejected by EC ("atrocious"); redesigned in the spirit of intelligentoffice.com. Brief bumped to v0.8 | Owner's direction. The v0.6 bans on eyebrow labels, emphasised words and decoration are withdrawn |
| 9 Oct 2026 | New palette: ink/deep/navy/steel/pale/mist with coral only as tiny accents; Outfit (light + bold) for headings, Instrument Sans for body. Added `@fontsource-variable/outfit` | Matches the reference's steel-navy, grey-section register while staying on the logo's navy |
| 9 Oct 2026 | No stock photos yet; richness comes from drawn icon bubbles and a card-stack illustration | No Me² photos exist, and downloading stock needs EC's OK. Photos can drop in later for atmosphere |
| 9 Oct 2026 | Pillars band uses words, not numbers | The reference's "50+ locations" style stats would be invented for Me² |
| 9 Oct 2026 | Renamed the hero's `ring` class to `halo` | `ring` is a Tailwind utility and drew a bright white outline |
| 9 Oct 2026 | Logo rebuilt as a vector by tracing the supplied PNG (potrace, run once outside the repo; 0.6% area difference from the original), not by retyping it in a similar font | The closest fonts (Lexend, Poppins) differed in weight and the "e" terminal; tracing keeps the designer's letterforms. EC asked not to forget the logo |
| 9 Oct 2026 | Four Unsplash photos added (hero, both offer cards, real estate) | EC approved stock photos. Chosen without identifiable faces; credited in docs/media.md; footer notes they're illustrative |
| 9 Oct 2026 | Privacy page is a dynamic route `src/pages/[page].astro` | `getStaticPaths` is ignored on static routes, so the old `privacy.astro` was built even with `showPrivacyPage` off |
| 9 Oct 2026 | Scripts import `site.config.ts` and `flags.ts` directly (Node 22+ runs TypeScript) instead of reading them with regexes | A regex lost its backslash in a template string and the sitemap said `https://undefined/` |
| 9 Oct 2026 | Hero bubbles keep their gentle float with `will-change: transform` | Without it the float cost about 10 mobile Lighthouse points; with it mobile scores 91–98 |
| 9 Oct 2026 | Lighthouse runs through its Node API against Edge launched by Playwright; mobile takes the median of 3 runs | The CLI couldn't attach to Edge; single mobile runs swung 82–94 with PC load |
| 9 Oct 2026 | Dev dependencies added: `@axe-core/playwright`, `lighthouse`, `linkinator` (all allowed by BRIEF §3) | `npm run verify` |
| 9 Oct 2026 | Hero headline is now "AI does the volume. People own the outcome.", left-aligned with the bubbles on the right and no photo, like the link-preview image; the old H1 heads How it works. `hero-office.jpg` removed | EC: "I prefer your AI does the volume, people own the outcome hero". Swapping the two approved lines needed no new copy |
