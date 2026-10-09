# Switching features on and off

Anything waiting on a decision, a lawyer, permission or content is already built and sits behind a switch ("flag"). All the switches are in one file: `src/config/flags.ts`. Change `false` to `true`, rebuild and deploy. No other code changes are needed, and with every switch off the page still looks complete.

| Switch | What it shows | Turn on when | Who signs off | Also needs |
| --- | --- | --- | --- | --- |
| `showPricing` | "From $… AUD" on both service cards | Billing basis and GST wording are settled | Patrick + accountant | Replace the `[[TBC]]` in each card's `price` in `src/content/site.ts` |
| `showProof` | A client case study under "What we take on" | The client has approved it in writing; any numbers are substantiated | EC | Write the text into `useCases.proof` in `src/content/site.ts` |
| `showLocations` | "Command Centre teams in Adelaide and Phnom Penh." under the hero, and the "Where is the team based?" question | Patrick approves, and the privacy policy covers offshore handling | Patrick | — |
| `showLegalEntity` | The legal entity name and registration number in the footer | The contracting entity is confirmed | Patrick + lawyer | Fill `LEGAL_ENTITY` in `src/config/site.config.ts` |
| `showPrivacyPage` | The `/privacy/` page and a footer link to it | A lawyer has reviewed the policy | Patrick + lawyer | Paste the text into `privacy.body` in `src/content/site.ts` |
| `enableBooking` | A "Book a call" button next to "Talk to us" at the bottom of the page | Booking link exists and the privacy page is live | EC | Fill `BOOKING_URL` in `src/config/site.config.ts` |
| `enableContactForm` | An enquiry form instead of the email link (Phase 2, not built yet) | Privacy page live, sending domain verified, bot-check keys set | EC | Phase 2 build |
| `enableTracking` | Analytics beyond Cloudflare Web Analytics | Privacy page live and a tool chosen | EC | Phase 2 build |

**Safety catch:** `enableBooking`, `enableContactForm` and `enableTracking` stay off, with a warning in the build log, until `showPrivacyPage` is on. Anything that collects personal information needs the privacy policy live first.

**Checking a switch before you flip it:** `npm run build:fixture` builds a test version with every switch on and fake values (example.com, "Test Customer"). `npm run verify` builds and checks the site with all switches off, all on, and the layout-changing ones on one at a time. The test version is marked noindex and must never be deployed.
