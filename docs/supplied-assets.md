# Still to supply

Drop each file or value at the place shown and the site picks it up on the next build. Nothing here blocks the build: until it arrives, the site shows the "Until then" version.

| What | Where it goes | Until then |
| --- | --- | --- |
| Logo master as SVG (or a PNG at least 2000px wide): navy "me", coral "2", no reflection | Replace `src/assets/brand/me2-logo-supplied.png` (or add `src/assets/brand/me2-logo.svg` and ask for it to be wired in), then run `npm run brand` | The 427×328 PNG supplied on 7 Oct, recoloured light for dark backgrounds. Sharp in the header; `public/logo.png` (for email signatures and partners) is soft |
| Final brand palette and fonts from the designer | `src/styles/tokens.css` | Navy and coral sampled from the logo; Instrument Sans |
| Booking link (Cal.com or Calendly) | `BOOKING_URL` in `src/config/site.config.ts`, then `enableBooking` | No "Book a call" button |
| Legal entity name and registration number | `LEGAL_ENTITY` in `src/config/site.config.ts`, then `showLegalEntity` | No entity line in the footer |
| Lawyer-reviewed privacy policy text | `content.privacy.body` in `src/content/site.ts`, then `showPrivacyPage` | No privacy page; no form, booking or tracking |
| Billing basis and GST wording for prices | `content.offers.cards[].price` in `src/content/site.ts`, then `showPricing` | No prices shown |
| First client case study, with the client's written permission | `content.realEstate.proof` in `src/content/site.ts`, then `showProof` | No proof block |
