// Runs after `astro build`: writes sitemap.xml, robots.txt and llms.txt into the
// build output from the routes file, flags and config, so none of them are hand-edited.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const fixture = process.env.SITE_FIXTURE === '1';
const outDir = process.env.OUT_DIR ?? (fixture ? '.verify/fixture/dist' : 'dist');

const { siteConfig } = await import('../src/config/site.config.ts');
const { flags } = await import('../src/config/flags.ts');
const flagOn = (key) => flags[key] === true;

const domain = fixture ? 'example.com' : siteConfig.SITE_DOMAIN;
const email = fixture ? 'test@example.com' : siteConfig.CONTACT_EMAIL;
const name = siteConfig.SITE_NAME;
const plain = siteConfig.SITE_NAME_PLAIN;
const base = `https://${domain}`;

const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
const indexable = routes.filter((r) => !r.noindex && (!r.flag || flagOn(r.flag)) && !fixture);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((r) => `  <url><loc>${base}${r.path}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(`${outDir}/sitemap.xml`, sitemap);

const robots = fixture
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
writeFileSync(`${outDir}/robots.txt`, robots);

const price = (text) => (flagOn('showPricing') ? ` ${text}` : '');
const llms = `# ${name}

> ${name} (also known as ${plain}) runs the back office of established businesses, everything behind the front line from admin and accounts to customer service and marketing, done by trained people backed by AI agents built for each business (never AI on its own), so the owner, the sales team and the front line can do what they're best at. ${name} also designs and builds websites and digital products.

## Services
- The whole back office: trained ${name} people own the work, backed by AI agents built around the business; they check everything before it goes out, deal with anything unusual and report back.${price('Quoted for each business, as one monthly fee.')} Areas: business operations, admin, customer service and support, finance and accounting, marketing, social media, paid ads. Coming next: legal, tech development, consulting and strategy.
- An extra set of hands: a ${name} person takes one job off the team's plate (the inbox, the invoices, the data entry), backed by an AI agent set up around how the business already works.${price('Quoted per job.')}
- Websites and digital products: websites and landing pages, interface design for portals and apps, copy and content structure, search and performance foundations;${flagOn('showPricing') ? ' quoted per project.' : ' designed and built to brief.'}

## Key pages
- [Home](${base}/): what ${name} does, the offer and common questions
${flagOn('showProof') ? `- [Work](${base}/#work): projects ${name} has designed and built\n` : ''}- [Start here](${base}/#services): the whole back office, an extra set of hands and websites, and how each is quoted
- [How we work](${base}/#how): a person owns every task; one accountable team
${flagOn('showPrivacyPage') ? `- [Privacy](${base}/privacy/): how enquiries are handled\n` : ''}
## Contact
- [Email ${email}](mailto:${email})
`;
writeFileSync(`${outDir}/llms.txt`, llms);

for (const f of ['index.html', '404.html']) {
  if (!existsSync(`${outDir}/${f}`)) console.warn(`[postbuild] missing ${outDir}/${f}`);
}
console.log(`[postbuild] ${outDir}: sitemap (${indexable.length} url), robots.txt, llms.txt`);
