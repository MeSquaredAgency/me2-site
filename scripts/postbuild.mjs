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

> ${name} (also known as ${plain}) runs the back office of established businesses: finance, operations and marketing, done by trained people backed by AI agents built for each business, so the owner, the sales team and the front line can do what they're best at. ${name} also designs and builds websites and digital products.

## Services
- The whole back office: trained ${name} people own the work, backed by AI agents built around the business; they check every output, handle the exceptions and report back.${price('From $3,000 + GST a month.')} Finance: debtor follow-up, bill coding, weekly reporting. Operations: inbox triage, client intake, quote follow-up. Marketing: social posts and newsletters, enquiry follow-up, website updates, a monthly marketing report.
- Start with one job: one AI agent for one job, set up around how a team already works; the team reviews the output.${price('From $2,000 + GST to set up.')}
- Websites and digital products: websites and landing pages, interface design for portals and apps, copy and content structure, search and performance foundations;${flagOn('showPricing') ? ' quoted per project.' : ' designed and built to brief.'}

## Key pages
- [Home](${base}/): what ${name} does, the offer and common questions
${flagOn('showProof') ? `- [Work](${base}/#work): projects ${name} has designed, built and run\n` : ''}- [Start here](${base}/#services): the whole back office, one job and websites, with prices
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
