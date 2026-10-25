import { config, fill, siteUrl } from '../config';
import { content } from '../content/site';
import { visibleFaq } from './faq';

/** JSON-LD for the home page: Organization, one Service per offer, and the visible FAQ. */
export function homeSchema() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: config.SITE_NAME,
    alternateName: config.SITE_NAME_PLAIN,
    url: `${siteUrl}/`,
    email: config.CONTACT_EMAIL,
    logo: `${siteUrl}/logo.png`,
    areaServed: { '@type': 'Country', name: 'Australia' },
  };
  const services = content.offers.cards.map((card) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: card.name,
    description: card.body,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: 'AU',
  }));
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visibleFaq().map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: fill(item.a) },
    })),
  };
  return [org, ...services, faq];
}
