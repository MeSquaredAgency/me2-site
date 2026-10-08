/**
 * Feature flags (BRIEF §7). The site must build and look complete with all of them false.
 * Flipping a flag never needs a code change.
 */
export const flags = {
  /** Price lines on both offer cards. On when billing basis and GST wording are confirmed (Patrick). */
  showPricing: false,
  /** Real estate proof block. On with the client's written permission and approved copy (EC). */
  showProof: false,
  /** Hero location line and the "Where is the team based?" FAQ item (Patrick). */
  showLocations: false,
  /** Footer entity and registration line, once the contracting entity is confirmed (Patrick + lawyer). */
  showLegalEntity: false,
  /** /privacy/ page and footer link, once lawyer-reviewed text is supplied (Patrick + lawyer). */
  showPrivacyPage: false,
  /** Enquiry form in the final call to action. Needs showPrivacyPage (EC). */
  enableContactForm: false,
  /** "Book a call" button. Needs BOOKING_URL and showPrivacyPage (EC). */
  enableBooking: false,
  /** Any analytics beyond Cloudflare Web Analytics. Needs showPrivacyPage (EC). */
  enableTracking: false,
};

export type Flags = typeof flags;
