# Still to supply

Drop each file or value where shown and the site picks it up on the next build. Nothing here blocks launch: until it arrives, the site shows the "Until then" version.

| What | Where it goes | Until then |
| --- | --- | --- |
| Logo master as SVG from the designer (navy "me", coral "2", no reflection) | Replace `src/assets/brand/me2-logo.svg` and `me2-logo-light.svg`, then run `npm run brand` | A vector traced from the 427×328 PNG supplied on 7 Oct. Crisp at web sizes, slightly soft when printed very large |
| Real photos of Me² (Command Centre, team at work, with their permission) | `src/assets/photos/` (same file names to swap a stock photo, see docs/media.md) | Three licensed Unsplash photos, used as atmosphere only |
| Final brand palette and fonts from the designer | `src/styles/tokens.css` | Navy and coral taken from the logo; Outfit + Instrument Sans |
| Booking link (Cal.com or Calendly) | `BOOKING_URL` in `src/config/site.config.ts`, then `enableBooking` | No "Book a call" button |
| Legal entity name and registration number | `LEGAL_ENTITY` in `src/config/site.config.ts`, then `showLegalEntity` | No entity line in the footer |
| Lawyer-reviewed privacy policy text | `privacy.body` in `src/content/site.ts`, then `showPrivacyPage` | No privacy page; no form, booking or tracking |
| Billing basis and GST wording for prices | `offers.cards[].price` in `src/content/site.ts`, then `showPricing` | No prices shown |
| First client case study, with the client's written permission | `realEstate.proof` in `src/content/site.ts`, then `showProof` | No proof block |
