/**
 * Feature flags (BRIEF §7). The site must build and look complete with all of them false.
 * Flipping a flag never needs a code change.
 */
export const flags = {
  /** Price lines in Start here and the pricing question. EC, 16 Oct 2026: every offer is quoted to the client's requirements, so the lines say how each is quoted, with no figures. */
  showPricing: true,
  /**
   * Selected work: the portfolio case studies (and the "Work" link in the menu and footer).
   * Off since 10 Oct 2026 (EC: "get rid of the proof section for now"). On once each project is confirmed with the client's OK.
   */
  showProof: false,
  /** Hero location line, the "Where is the team based?" FAQ item and the city in the structured data. On since 19 Oct 2026 (EC: "Based in Phnom Penh"). */
  showLocations: true,
  /** Footer entity and registration line, once the contracting entity is confirmed (Patrick + lawyer). */
  showLegalEntity: false,
  /** /privacy/ page and footer link. The policy was reviewed by EC on 16 Oct 2026 ("Policy is fine."). */
  showPrivacyPage: true,
  /** The enquiry form (final section, and a dialog from every "Talk to us"). Needs showPrivacyPage, and Resend set up with its key stored as a Worker secret (DEPLOY.md). */
  enableContactForm: true,
  /**
   * The automatic confirmation email /api/enquiry sends to the visitor once their enquiry reaches hello@ (live site only, fixed text).
   * On since 20 Oct 2026 (EC: the first reply is a receptionist; a person follows up). Off: enquiries still reach hello@, with no confirmation.
   */
  sendEnquiryConfirmation: true,
  /**
   * The website chat: an AI receptionist (Claude Haiku) that answers questions from the site's copy and passes the visitor's
   * details to hello@ (worker/chat.ts, docs/chat.md). Its button appears once the hero is scrolled past. Needs showPrivacyPage,
   * and the ANTHROPIC_API_KEY secret set in Cloudflare (DEPLOY.md). EC, 21 Oct 2026: "AI receptionist (Claude Haiku)".
   */
  enableChat: true,
  /** "Book a call" button. Needs BOOKING_URL and showPrivacyPage (EC). */
  enableBooking: false,
  /** Any analytics beyond Cloudflare Web Analytics. Needs showPrivacyPage (EC). */
  enableTracking: false,
  /**
   * Careers: /careers/, a page per listed role (src/content/careers.ts), the footer link, and the /api/applications route.
   * The application form also needs showPrivacyPage; without it each role page says to email a CV instead. On since 16 Oct 2026 (EC).
   */
  showCareers: true,
  /** Patrick's founder note at the end of How we work (content.how.founder). Off until his words are in (EC, 21 Oct 2026). */
  showFounderNote: false,
};

export type Flags = typeof flags;
