# Analytics

Since 22 Oct 2026 the site carries **Google Analytics 4** (EC: "We seriously require that"). Nothing else tracks visitors: no Meta pixel, no tag manager, no heat maps. Cloudflare Web Analytics (cookieless, in the Cloudflare dashboard) is not turned on; it can be, without a code change beyond the two CSP hosts DEPLOY.md names.

## What is on the page
- **The tag:** Google's gtag snippet, rendered in the `<head>` of every page by `src/layouts/Base.astro`. It is behind the `enableTracking` flag (`src/config/flags.ts`) and the measurement ID lives in `GA4_MEASUREMENT_ID` in `src/config/site.config.ts`, the only place it is typed. An empty ID turns tracking off, and so does `showPrivacyPage` being off.
- **Live domain only:** the snippet checks `location.hostname` against `SITE_DOMAIN` before it loads Google's script, so preview links (`*.workers.dev`), the fixture builds and the local checks send Google nothing. Google's own snippet loads the script with a plain `<script async src>`; ours creates that element after the check. Same script, same `gtag('config', …)` call.
- **Security headers:** `public/_headers` allows `https://*.googletagmanager.com` in `script-src`, `https://*.google-analytics.com`, `https://*.analytics.google.com` and `https://*.googletagmanager.com` in `connect-src`, and the first and last of those in `img-src`, which is the set Google documents for GA4 without Google signals. If Google signals or ads linking are turned on in the GA4 property, Google adds `*.g.doubleclick.net` and `*.google.com`; the browser console will show CSP errors until they are added there too.
- **Privacy policy:** "What we collect" says we use Google Analytics, what it sends Google (IP address, browser and device type, pages viewed), that it sets cookies, that it doesn't identify the visitor, and how to block it. "Where it is kept" names Google Analytics among the providers that may process information outside Australia. If the flag ever goes off, remove that paragraph too.
- **No cookie banner:** out of scope (BRIEF §3). Australian privacy law asks for disclosure, which the policy gives; it doesn't require consent for analytics cookies.
- **No events** beyond Google's enhanced measurement defaults (page views, scrolls, outbound clicks, file downloads). Enquiry sends, chat hand-overs and job applications are not reported as conversions; that needs a decision on what to measure and a line in the policy.

## Checking it
- `npm run build && npm run check:home` checks that the tag with the configured ID is on the home and privacy pages, that it is guarded to the live domain, that the three CSP directives allow Google's hosts, and that the privacy policy has the Google Analytics paragraph. With the flag off it checks the opposite.
- On the live site: GA4 → Reports → Realtime should show your own visit within a minute. In the browser, the Network tab shows one request to `www.googletagmanager.com/gtag/js` and `collect` requests to `google-analytics.com`; the console shows no CSP errors.
- The `npm run verify` "no third-party requests" check still passes because it runs on localhost, where the tag doesn't load.

## Turning it off
Set `enableTracking: false` in `src/config/flags.ts`, remove the Google Analytics paragraph from `privacy.sections` in `src/content/site.ts` (and the "(for email and Google Analytics)" words), and update the date. The CSP hosts can stay or go.
