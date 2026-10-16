# Still to supply

Drop each file or value where shown and the site picks it up on the next build. Nothing here blocks launch: until it arrives, the site shows the "Until then" version.

| What | Where it goes | Until then |
| --- | --- | --- |
| Logo master as SVG from the designer (navy "me", coral "2", no reflection) | Replace `src/assets/brand/me2-logo.svg` and `me2-logo-light.svg`, then run `npm run brand` | A vector traced from the 427×328 PNG supplied on 7 Oct. Crisp at web sizes, slightly soft when printed very large |
| Real photos of Me² (Command Centre, team at work, with their permission) | `src/assets/photos/` (see docs/media.md) | No photos on the page since v0.13; the hero board and type carry it |
| Final brand palette and fonts from the designer | `src/styles/tokens.css` | Ink, ivory and the logo coral; Instrument Serif + Instrument Sans |
| Booking link (Cal.com or Calendly) | `BOOKING_URL` in `src/config/site.config.ts`, then `enableBooking` | No "Book a call" button |
| Me²'s Facebook page and LinkedIn company page addresses | `FACEBOOK_URL` and `LINKEDIN_URL` in `src/config/site.config.ts` | No social links in the footer, the structured data (`sameAs`) or llms.txt |
| Legal entity name and registration number | `LEGAL_ENTITY` in `src/config/site.config.ts`, then `showLegalEntity` | No entity line in the footer |
| Lawyer-reviewed privacy policy text | `privacy.body` in `src/content/site.ts`, then `showPrivacyPage` | No privacy page; no form, booking or tracking |
| Billing basis and GST wording for prices | `offers.cards[].price` in `src/content/site.ts`, then `showPricing` | No prices shown |
| Portfolio projects (name, URL, what Me² did, year, the client's OK) | `work.items` in `src/content/site.ts` and screenshots in `src/assets/work/`, then `showProof` | No Selected work section |
