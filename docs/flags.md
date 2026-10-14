# Switching features on and off

Anything waiting on a decision, a lawyer, permission or content is already built and sits behind a switch ("flag"). All the switches are in one file: `src/config/flags.ts`. Change `false` to `true`, rebuild and deploy. No other code changes are needed, and with every switch off the page still looks complete.

| Switch | What it shows | Turn on when | Who signs off | Also needs |
| --- | --- | --- | --- | --- |
| `showPricing` | **On since v0.15.** The prices in Start here ("From $3,000 + GST a month" for the whole back office, "From $2,000 + GST to set up" for one job, websites "Quoted per project"), the "What does it cost?" question, and prices in the page's structured data | EC set the basis on 9 Oct 2026 | EC (Patrick + accountant to check the GST wording) | Prices live in `offer` in `src/content/site.ts` |
| `showProof` | **Selected work** (the portfolio case studies), the "Work" link in the menu and footer, and "See our work" in the hero (off, it says "See where to start"). Off since 10 Oct 2026 | Each project is confirmed as Me² work and the client is happy to be shown | EC | Projects live in `work.items` in `src/content/site.ts`; screenshots in `src/assets/work/` (no pictures of people) |
| `showLocations` | "Command Centre teams in Adelaide and Phnom Penh." under the hero, and the "Where is the team based?" question | Patrick approves, and the privacy policy covers offshore handling | Patrick | — |
| `showLegalEntity` | The legal entity name and registration number in the footer | The contracting entity is confirmed | Patrick + lawyer | Fill `LEGAL_ENTITY` in `src/config/site.config.ts` |
| `showPrivacyPage` | The `/privacy/` page and a footer link to it | **On in the v0.15 preview with a DRAFT policy.** Must be reviewed (EC, Patrick, ideally a lawyer) before it goes live | Patrick + lawyer | The text is `privacy.sections` in `src/content/site.ts` |
| `enableBooking` | A "Book a call" button next to "Talk to us" at the bottom of the page | Booking link exists and the privacy page is live | EC | Fill `BOOKING_URL` in `src/config/site.config.ts` |
| `enableContactForm` | **Built in v0.15 and on in the preview.** The enquiry form at the foot of the page; every "Talk to us" / "Ask about…" opens it in place, tagged with what was clicked. Off: those buttons become email links again | Privacy page live; Resend set up and its key stored as the `RESEND_API_KEY` secret | EC | [DEPLOY.md](../DEPLOY.md#enquiry-form-email), [forms.md](forms.md) |
| `enableTracking` | Analytics beyond Cloudflare Web Analytics | Privacy page live and a tool chosen | EC | Phase 2 build |

**Safety catch:** `enableBooking`, `enableContactForm` and `enableTracking` stay off, with a warning in the build log, until `showPrivacyPage` is on. Anything that collects personal information needs the privacy policy live first.

**Checking a switch before you flip it:** `npm run build:fixture` builds a test version with every switch on and fake values (example.com, "Test Customer"). `npm run verify` builds and checks the site with all switches off, all on, and the layout-changing ones on one at a time. The test version is marked noindex and must never be deployed.
