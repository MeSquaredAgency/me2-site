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

> ${name} (also known as ${plain}) is one team for the digital side of an established business. It designs websites and digital products, builds AI systems that take repetitive work off a team, and runs back-office work as a managed service, where AI drafts and trained operators in the ${name} Command Centre check every detail.

## Services
- Design: websites and digital products. Websites and landing pages, interface design for portals and apps, copy and content structure, search and performance foundations.
- Build: AI systems that do real work. AI roles that draft, sort and summarise; automations between the tools a business already uses; dashboards and internal tools; testing against the client's own data.
- Run: the back office, checked by people. Invoices, bills and debtors; inbox and customer replies; weekly reports and data entry; client intake and follow-ups. AI does the first draft and a trained operator checks it before it goes back to the client.

## Start here
- AI Roles: one AI role for one job, set up around how a team already works; the team reviews the output.${price('From $2,000 + GST to set up.')} Roles include inbox triage, debtor follow-up, bill coding, weekly reporting, client intake and quote follow-up.
- Effective Business Units: a trained Command Centre operator runs a set of AI roles as a managed service, checks the work and reports back.${price('From $3,000 + GST a month.')}
- Websites and digital products:${flagOn('showPricing') ? ' quoted per project.' : ' designed and built to brief.'}

## Key pages
- [Home](${base}/): what ${name} does, selected work, the offer and common questions
- [Work](${base}/#work): projects ${name} has designed, built and run
- [Start here](${base}/#services): AI Roles, Effective Business Units and websites, with prices
- [How we work](${base}/#how): one accountable team; a person checks the AI's work
${flagOn('showPrivacyPage') ? `- [Privacy](${base}/privacy/): how enquiries are handled\n` : ''}
## Contact
- [Email ${email}](mailto:${email})
`;
writeFileSync(`${outDir}/llms.txt`, llms);

for (const f of ['index.html', '404.html']) {
  if (!existsSync(`${outDir}/${f}`)) console.warn(`[postbuild] missing ${outDir}/${f}`);
}
console.log(`[postbuild] ${outDir}: sitemap (${indexable.length} url), robots.txt, llms.txt`);
