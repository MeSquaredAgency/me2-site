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

const llms = `# ${name}

> ${name} (also known as ${plain}) sets up AI roles for repetitive back-office work, with trained human operators who run them and check the output before it counts. For Australian businesses; real estate agencies are the first market.

## Services
- AI Roles: one AI role for one job, set up around how a team already works. The client's team reviews the output.
- Effective Business Units: a trained Command Centre operator runs a set of AI roles as a managed service, checks the work, handles exceptions and reports back.

## First market
- Real estate, especially property management: inspection report drafts, rent arrears tracking and reminders, inbox sorting, leasing enquiry replies, maintenance follow-up, owner and landlord reports.

## Key pages
- [Home](${base}/): what ${name} does, how it works, the two services and common questions
- [How it works](${base}/#how): AI roles do the first pass, a person checks every output
- [Services](${base}/#offers): AI Roles and Effective Business Units
- [Real estate](${base}/#real-estate): the roles ${name} sets up for agencies

## Contact
- [Email ${email}](mailto:${email})
`;
writeFileSync(`${outDir}/llms.txt`, llms);

for (const f of ['index.html', '404.html']) {
  if (!existsSync(`${outDir}/${f}`)) console.warn(`[postbuild] missing ${outDir}/${f}`);
}
console.log(`[postbuild] ${outDir}: sitemap (${indexable.length} url), robots.txt, llms.txt`);
