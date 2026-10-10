# Photos, logo and link previews

## The rule
Real photos of Me² (the Command Centre, the team, real client work) always beat stock. Any stock photo is **atmosphere only**: never captioned or described as Me²'s office, team or clients, and when one is used the footer must say "Photos are illustrative stock images." Never use stock or AI-generated people as staff or testimonials.

## Photos in use
None. Since v0.13 (9 Oct 2026) the page uses no photographs: the real estate keys photo (Unsplash, Maria Ziegler) was removed with the real estate section, and the footer's stock-photo note with it. The hero's Command Centre board, the demo and the type carry the page.

## Portfolio images (v0.15 proposal)
Screenshots of real Me² projects, in `src/assets/work/<image>.png`, named by the project's `image` key in `content.work.items` (`src/content/site.ts`). Astro resizes them to AVIF and WebP at build time.

| File | What it is | Status |
| --- | --- | --- |
| `src/assets/work/apnre.png` | The home page of apnre.com.au at 1600×1000, captured 9 Oct 2026 (hero only; no staff photos) | Waiting on EC: confirm APN Real Estate is a Me² project and the client is happy to be shown |

Never use a screenshot that shows or names an individual person (team pages, agent profiles, reviews). A project without an image is not shown.

**Adding a photo:** put it in `src/assets/photos/` (landscape, at least 2000px wide, metadata stripped), show it with Astro's `<Image>` so it is resized at build time, add a row here with the photographer and source, and put the footer note back (`footer.imagery` in `src/content/site.ts`).

## Logo
| File | What it is |
| --- | --- |
| `src/assets/brand/me2-logo-supplied.png` | The me² logo EC supplied on 7 Oct 2026 (427×328 PNG) |
| `src/assets/brand/me2-logo.svg` | Vector version traced from that PNG (navy "me", coral "2"). Used on light backgrounds |
| `src/assets/brand/me2-logo-light.svg` | The same with a white "me", for the header, footer and dark backgrounds |
| `public/logo.png` | 1200px-wide PNG at a fixed address (`/logo.png`) for email signatures, partners and search engines |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons |

The SVGs were traced from the small PNG, so at very large sizes the edges are slightly soft. When the designer supplies a master SVG, replace both SVGs (keep the `viewBox`, `role="img"` and `aria-label` attributes) and run `npm run brand`. That regenerates `logo.png`, the favicons and the link-preview image.

## Link previews (OG image)
`public/og-image.png` (1200×630) is what shows when someone shares the site on LinkedIn, Facebook, iMessage or Slack. `npm run og` (also part of `npm run brand`) draws it from the logo, the OG title in `src/data/routes.json` and the site's own fonts, using Microsoft Edge. Rerun it whenever the logo or the OG title changes, then commit the PNG.
