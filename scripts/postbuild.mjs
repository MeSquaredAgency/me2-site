// Runs after `astro build`: writes sitemap.xml, robots.txt and llms.txt into the
// build output from the routes file, flags and config, so none of them are hand-edited.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const fixture = process.env.SITE_FIXTURE === '1';
const outDir = fixture ? '.verify/fixture/dist' : 'dist';

const cfgSrc = readFileSync('src/config/site.config.ts', 'utf8');
const flagSrc = readFileSync('src/config/flags.ts', 'utf8');
const get = (src, key) => src.match(new RegExp(`${key}:\s*'([^']*)'`))?.[1];
const flagOn = (key) => new RegExp(`${key}:\s*true`).test(flagSrc);

const domain = fixture ? 'example.com' : get(cfgSrc, 'SITE_DOMAIN');
const email = fixture ? 'test@example.com' : get(cfgSrc, 'CONTACT_EMAIL');
const name = get(cfgSrc, 'SITE_NAME');
const plain = get(cfgSrc, 'SITE_NAME_PLAIN');
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

## Contact
- Email: ${email}
- Website: ${base}/
`;
writeFileSync(`${outDir}/llms.txt`, llms);

for (const f of ['index.html', '404.html']) {
  if (!existsSync(`${outDir}/${f}`)) console.warn(`[postbuild] missing ${outDir}/${f}`);
}
console.log(`[postbuild] ${outDir}: sitemap (${indexable.length} url), robots.txt, llms.txt`);
