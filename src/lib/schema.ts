import { config, fill, flags, siteUrl } from '../config';
import { content } from '../content/site';
import { visibleFaq } from './faq';

/** JSON-LD for the home page: Organization, one Service per offer (the whole back office, one job, websites), and the visible FAQ. */
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
  // One Service per offer. An Offer with a price only when showPricing is on and the price line has a figure (since 16 Oct 2026 every offer is quoted, so none do).
  const o = content.offer;
  const provider = { '@id': `${siteUrl}/#organization` };
  // The figure comes from the price line in site.ts ("From $2,000 + GST to set up" → 2000), so it can't drift.
  const offerFrom = (description: string) => {
    const min = Number(description.match(/\$([\d,]+)/)?.[1].replaceAll(',', ''));
    return flags.showPricing && min ? { offers: { '@type': 'Offer', priceCurrency: 'AUD', description, priceSpecification: { '@type': 'PriceSpecification', minPrice: min, priceCurrency: 'AUD', valueAddedTaxIncluded: false } } } : {};
  };
  const services = [
    { name: o.office.name, description: fill(o.office.body), ...offerFrom(o.office.price) },
    { name: o.one.name, description: fill(o.one.body), ...offerFrom(o.one.price) },
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
