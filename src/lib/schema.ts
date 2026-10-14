import { config, fill, flags, siteUrl } from '../config';
import { content } from '../content/site';
import { visibleFaq } from './faq';

/** JSON-LD for the home page: Organization, one Service per offer (AI Roles, Effective Business Units, websites), and the visible FAQ. */
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
  };
  // One Service per offer. Prices only when showPricing is on (an AI role's setup fee; an EBU's monthly fee; both + GST).
  const o = content.offer;
  const provider = { '@id': `${siteUrl}/#organization` };
  // The figure comes from the price line in site.ts ("From $2,000 + GST to set up" → 2000), so it can't drift.
  const offerFrom = (description: string) => {
    const min = Number(description.match(/\$([\d,]+)/)?.[1].replaceAll(',', ''));
    return flags.showPricing && min ? { offers: { '@type': 'Offer', priceCurrency: 'AUD', description, priceSpecification: { '@type': 'PriceSpecification', minPrice: min, priceCurrency: 'AUD', valueAddedTaxIncluded: false } } } : {};
  };
  const services = [
    { name: o.office.name, description: fill(o.office.body), ...offerFrom(o.office.price) },
    { name: o.one.name, description: o.one.body, ...offerFrom(o.one.price) },
    { name: o.web.name, description: o.web.body },
  ].map((s) => ({ '@context': 'https://schema.org', '@type': 'Service', ...s, provider, areaServed: 'AU' }));
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visibleFaq().map((item) => ({
      '@type': 'Question',
      name: fill(item.q),
      acceptedAnswer: { '@type': 'Answer', text: fill(item.a) },
    })),
  };
  return [org, ...services, faq];
}
