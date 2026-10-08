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
  /** Empty until EC supplies the Cal.com or Calendly link; empty keeps booking hidden. */
  BOOKING_URL: '',
  LOCALE: 'en-AU',
  /** Footer entity line, shown only with showLegalEntity. */
  LEGAL_ENTITY: '[[TBC: legal entity name and registration number — Patrick + lawyer]]',
};

export type SiteConfig = typeof siteConfig;
