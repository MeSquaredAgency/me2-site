import { config, fill, flags, siteUrl } from '../config';
import { content } from '../content/site';
import { visibleFaq } from './faq';
import { jobPlace, type Role } from '../content/careers';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** JSON-LD for a role page: one JobPosting, so the role can show in Google's job search. The description is the posting as simple HTML. */
export function jobPostingSchema(role: Role) {
  const sameAs = [config.FACEBOOK_URL, config.LINKEDIN_URL].filter(Boolean);
  const description = role.sections.map((s) => [
    `<p><strong>${esc(s.h)}</strong></p>`,
    ...(s.paras ?? []).map((p) => `<p>${esc(p)}</p>`),
    ...(s.groups ?? []).map((g) => `${g.h ? `<p>${esc(g.h)}</p>` : ''}<ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`),
    ...(s.after ?? []).map((p) => `<p>${esc(p)}</p>`),
    s.link ? `<p>${esc(s.link.before)}<a href="${s.link.href}">${esc(s.link.text)}</a></p>` : '',
  ].join('')).join('');
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description,
    datePosted: role.datePosted,
    employmentType: 'FULL_TIME',
    directApply: true,
    url: `${siteUrl}/careers/${role.slug}/`,
    hiringOrganization: { '@type': 'Organization', name: config.SITE_NAME, logo: `${siteUrl}/logo.png`, ...(sameAs.length ? { sameAs } : {}) },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: jobPlace.locality, addressCountry: jobPlace.country } },
    baseSalary: { '@type': 'MonetaryAmount', currency: role.facts.currency, value: { '@type': 'QuantitativeValue', minValue: role.facts.salaryFrom, unitText: 'MONTH' } },
  };
}

/** JSON-LD breadcrumbs for the careers pages: Home › Careers, and › the role on a role page. */
export function careersBreadcrumbSchema(role?: Role) {
  const items = [
    { name: config.SITE_NAME, item: `${siteUrl}/` },
    { name: content.footer.careers, item: `${siteUrl}/careers/` },
    ...(role ? [{ name: role.title, item: `${siteUrl}/careers/${role.slug}/` }] : []),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })),
  };
}

/** JSON-LD for the home page: Organization, WebSite, one Service per offer (the whole back office, one job, websites), and the visible FAQ. */
export function homeSchema() {
  // Me²'s own social pages, when set in site.config.ts.
  const sameAs = [config.FACEBOOK_URL, config.LINKEDIN_URL].filter(Boolean);
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: config.SITE_NAME,
    alternateName: config.SITE_NAME_PLAIN,
    url: `${siteUrl}/`,
    description: fill(content.hero.subhead),
    email: config.CONTACT_EMAIL,
    // The WhatsApp Business number is Me²'s published phone number (site.config.ts); left out while it's empty.
    ...(config.WHATSAPP_NUMBER ? { telephone: config.WHATSAPP_NUMBER.replace(/\s+/g, '') } : {}),
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: config.CONTACT_EMAIL, availableLanguage: 'English', areaServed: 'AU', ...(config.WHATSAPP_NUMBER ? { telephone: config.WHATSAPP_NUMBER.replace(/\s+/g, '') } : {}) },
    // Me² serves Australian businesses (the same areaServed as each Service below).
    areaServed: { '@type': 'Country', name: 'Australia', identifier: 'AU' },
    // Only once EC supplies them (site.config.ts); never guessed.
    ...(config.FOUNDER_NAME ? { founder: { '@type': 'Person', name: config.FOUNDER_NAME } } : {}),
    ...(config.FOUNDING_DATE ? { foundingDate: config.FOUNDING_DATE } : {}),
    logo: `${siteUrl}/logo.png`,
    // Where the team is, only while the page says so (showLocations): the same city as the job postings.
    ...(flags.showLocations ? { address: { '@type': 'PostalAddress', addressLocality: jobPlace.locality, addressCountry: jobPlace.country } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
  // The site itself, so search engines show "Me²" as the site name rather than the domain (and know "Me Squared" is the same site).
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: config.SITE_NAME,
    alternateName: config.SITE_NAME_PLAIN,
    url: `${siteUrl}/`,
    inLanguage: config.LOCALE,
    publisher: { '@id': `${siteUrl}/#organization` },
  };
  // One Service per offer. An Offer with a price only when showPricing is on and the price line has a figure (since 16 Oct 2026 every offer is quoted, so none do).
  const o = content.offer;
  const provider = { '@id': `${siteUrl}/#organization` };
  // The figure comes from the price line in site.ts ("From $2,000 + GST to set up" → 2000), so it can't drift.
  const offerFrom = (description: string) => {
    const min = Number(description.match(/\$([\d,]+)/)?.[1].replaceAll(',', ''));
    return flags.showPricing && min ? { offers: { '@type': 'Offer', priceCurrency: 'AUD', description, priceSpecification: { '@type': 'PriceSpecification', minPrice: min, priceCurrency: 'AUD', valueAddedTaxIncluded: false } } } : {};
  };
  // serviceType is the plain category a search engine files each offer under; url is the offer on the page (SEO audit, 25 Oct 2026).
  const services = [
    { name: o.office.name, serviceType: 'Outsourced back office', description: fill(o.office.body), ...offerFrom(o.office.price) },
    { name: o.one.name, serviceType: 'Outsourced administrative support', description: fill(o.one.body), ...offerFrom(o.one.price) },
    { name: o.web.name, serviceType: 'Website design and development', description: o.web.body },
  ].map((s) => ({ '@context': 'https://schema.org', '@type': 'Service', ...s, url: `${siteUrl}/#services`, provider, areaServed: 'AU' }));
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visibleFaq().map((item) => ({
      '@type': 'Question',
      name: fill(item.q),
      acceptedAnswer: { '@type': 'Answer', text: fill(item.a) },
    })),
  };
  return [org, website, ...services, faq];
}
