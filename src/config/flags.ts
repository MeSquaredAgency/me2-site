/**
 * Feature flags (BRIEF §7). The site must build and look complete with all of them false.
 * Flipping a flag never needs a code change.
 */
export const flags = {
  /** Price lines in Start here and the pricing question. EC set the basis on 9 Oct 2026: AI role from $2,000 + GST to set up; EBU from $3,000 + GST a month. */
  showPricing: true,
  /** Real estate proof block. On with the client's written permission and approved copy (EC). */
  showProof: false,
  /** Hero location line and the "Where is the team based?" FAQ item (Patrick). */
  showLocations: false,
  /** Footer entity and registration line, once the contracting entity is confirmed (Patrick + lawyer). */
  showLegalEntity: false,
  /** /privacy/ page and footer link. v0.15: on in the preview with a DRAFT policy; it must be reviewed (EC, Patrick, ideally a lawyer) before this reaches main. */
  showPrivacyPage: true,
  /** The enquiry form (final section, and a dialog from every "Talk to us"). Needs showPrivacyPage, and the domain onboarded to Cloudflare Email Sending (DEPLOY.md). */
  enableContactForm: true,
  /** "Book a call" button. Needs BOOKING_URL and showPrivacyPage (EC). */
  enableBooking: false,
  /** Any analytics beyond Cloudflare Web Analytics. Needs showPrivacyPage (EC). */
  enableTracking: false,
};

export type Flags = typeof flags;
