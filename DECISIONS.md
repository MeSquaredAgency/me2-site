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
