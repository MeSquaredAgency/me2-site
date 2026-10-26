/**
 * Client identity: the ONLY place these values are typed (BRIEF §0b).
 * Everything else reads them from here via `src/config/index.ts`.
 */
export const siteConfig = {
  SITE_NAME: 'Me²',
  SITE_NAME_PLAIN: 'Me Squared',
  SITE_DOMAIN: 'mesquaredagency.com',
  CONTACT_EMAIL: 'hello@mesquaredagency.com',
  PRIVACY_EMAIL: 'privacy@mesquaredagency.com',
  FORM_FROM_EMAIL: 'website@mesquaredagency.com',
  FORM_TO_EMAIL: 'hello@mesquaredagency.com',
  /** Where job applications go (the careers form), and the address the careers pages give out. */
  CAREERS_EMAIL: 'people@mesquaredagency.com',
  /** Empty until EC supplies the Cal.com or Calendly link; empty keeps booking hidden. */
  BOOKING_URL: '',
  /** Me²'s own Facebook page and LinkedIn company page (EC). Empty leaves the link out of the footer, the structured data and llms.txt. */
  FACEBOOK_URL: 'https://www.facebook.com/profile.php?id=61595133354911',
  LINKEDIN_URL: 'https://www.linkedin.com/company/mesquaredagency',
  /** Me²'s WhatsApp Business number (EC, 20 Oct 2026), written as shown on the page; the wa.me link is made from its digits. Empty hides every WhatsApp link. */
  WHATSAPP_NUMBER: '+855 69 713 244',
  /** Google Analytics 4 measurement ID (EC, 22 Oct 2026). Used only with enableTracking, and only on this domain; empty keeps tracking off. */
  GA4_MEASUREMENT_ID: 'G-E2VZ6MW5SF',
  LOCALE: 'en-AU',
  /** The founder named in the Organization structured data, and when Me² was founded (YYYY or YYYY-MM-DD). Empty until EC confirms them; empty leaves them out. */
  FOUNDER_NAME: 'Patrick Nhim',
  FOUNDING_DATE: '',
  /** Footer entity line, shown only with showLegalEntity. */
  LEGAL_ENTITY: '[[TBC: legal entity name and registration number — Patrick + lawyer]]',
};

export type SiteConfig = typeof siteConfig;
