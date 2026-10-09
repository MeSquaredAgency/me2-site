# Photos, logo and link previews

## The rule
Real photos of Me² (the Command Centre, the team, real client work) always beat stock. Until those exist, the site uses a few licensed stock photos **for atmosphere only**. They are never captioned or described as Me²'s office, team or clients, and the footer says "Photos are illustrative stock images." Never use stock or AI-generated people as staff or testimonials.

## Stock photos in use
All from Unsplash under the [Unsplash License](https://unsplash.com/license): free for commercial use, no permission needed, credit appreciated but not required.

| File (`src/assets/photos/`) | Where it shows | Photographer | Source |
| --- | --- | --- | --- |
| `offer-ai-roles.jpg` | AI Roles card | Mikey Harris | https://unsplash.com/photos/kw0z6RyvC0s |
| `offer-ebu.jpg` | Effective Business Units card | Compagnons | https://unsplash.com/photos/Fa9b57hffnM |
| `real-estate-keys.jpg` | "Starting with real estate" photo card | Maria Ziegler | https://unsplash.com/photos/jJnZg7vBfMs |

The originals were downloaded at 2400px wide and saved with their metadata stripped. Astro makes resized AVIF/WebP copies at build time, so the page only loads the size each screen needs. They load as you scroll. The hero has no photo (EC preferred the plain navy version on 9 Oct).

**Swapping a photo:** save the new photo over the file with the same name (landscape, at least 2000px wide), rebuild, and update this table.

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
