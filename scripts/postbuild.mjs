// Runs after `astro build`: writes sitemap.xml, robots.txt and llms.txt into the
// build output from the routes file, flags and config, so none of them are hand-edited.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const fixture = process.env.SITE_FIXTURE === '1';
const outDir = process.env.OUT_DIR ?? (fixture ? '.verify/fixture/dist' : 'dist');

const { siteConfig } = await import('../src/config/site.config.ts');
const { flags } = await import('../src/config/flags.ts');
const { listedRoles } = await import('../src/content/careers.ts');
const { content } = await import('../src/content/site.ts');
// A fixture variant's flags (FIXTURE_FLAGS) apply here too, as they do to the pages (src/config/index.ts).
const variant = fixture && process.env.FIXTURE_FLAGS ? JSON.parse(process.env.FIXTURE_FLAGS) : {};
const flagOn = (key) => ({ ...flags, ...variant })[key] === true;
const listed = new Set(listedRoles().map((r) => r.slug));

const domain = fixture ? 'example.com' : siteConfig.SITE_DOMAIN;
const email = fixture ? 'test@example.com' : siteConfig.CONTACT_EMAIL;
const name = siteConfig.SITE_NAME;
const plain = siteConfig.SITE_NAME_PLAIN;
const base = `https://${domain}`;

const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
// A role page is only built (and only in the sitemap) while its role is listed in src/content/careers.ts.
const indexable = routes.filter((r) => !r.noindex && (!r.flag || flagOn(r.flag)) && (!r.role || listed.has(r.role)) && !fixture);

// <lastmod>: the date of the last commit that changed the files a page is made from, so the date only moves when the
// page really changed (search engines ignore lastmod that moves on every deploy). Needs the git history: the publish
// workflow checks out with fetch-depth 0. Outside a git checkout, today's date.
const shared = ['src/layouts', 'src/styles', 'src/config', 'src/data/routes.json', 'src/components/Header.astro', 'src/components/Footer.astro'];
const sourcesOf = (path) =>
  path === '/' ? [...shared, 'src/pages/index.astro', 'src/content/site.ts', 'src/components', 'src/lib', ':!src/components/careers']
  : path.startsWith('/careers/') ? [...shared, 'src/pages/careers', 'src/content/careers.ts', 'src/components/careers']
  : [...shared, 'src/pages/[page].astro', 'src/content/site.ts'];
const today = new Date().toISOString().slice(0, 10);
const lastmod = (path) => {
  try {
    const args = sourcesOf(path).map((p) => `'${p}'`).join(' ');
    return execSync(`git log -1 --format=%cs -- ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || today;
  } catch { return today; }
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((r) => `  <url><loc>${base}${r.path}</loc><lastmod>${lastmod(r.path)}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(`${outDir}/sitemap.xml`, sitemap);

// Content Signals (contentsignals.org): yes to search, AI answers and AI training (EC, 20 Oct 2026), so assistants can find and recommend the site.
const robots = fixture
  ? 'User-agent: *\nDisallow: /\n'
  : `# Content Signals (https://contentsignals.org/): yes to search, AI answers and AI training.\nUser-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
writeFileSync(`${outDir}/robots.txt`, robots);

const price = (text) => (flagOn('showPricing') ? ` ${text}` : '');
// The FAQ exactly as the page shows it (same flags as src/lib/faq.ts), so assistants can quote the terms without them drifting from the page.
const fillCopy = (text) => text.replaceAll('{SITE_NAME}', name).replaceAll('{CONTACT_EMAIL}', email);
const faq = content.faq.items.filter((item) => !item.flag || flagOn(item.flag)).map((item) => `- ${fillCopy(item.q)} ${fillCopy(item.a)}`).join('\n');
const llms = `# ${name}

> ${name} (also known as ${plain}) runs the back office of established businesses, everything behind the front line from admin and accounts to customer service and marketing, done by trained people backed by AI agents built for each business (never AI on its own), so the owner, the sales team and the front line can do what they're best at. ${name} also designs and builds websites and digital products.

## Services
- The whole back office: trained ${name} people own the work, backed by AI agents built around the business; they check everything before it goes out, deal with anything unusual and report back.${price('Quoted for each business, as one monthly fee.')} Areas: business operations, admin, customer service and support, finance and accounting, marketing, social media, paid ads. Coming next: legal, tech development, consulting and strategy.
- An extra set of hands: a ${name} person takes one job off the team's plate (the inbox, the invoices, the data entry), backed by an AI agent set up around how the business already works.${price('Quoted per job.')}
- Websites and digital products: websites and landing pages, interface design for portals and apps, copy and content structure, search and performance foundations;${flagOn('showPricing') ? ' quoted per project.' : ' designed and built to brief.'}

## Common questions
${faq}

## Key pages
- [Home](${base}/): what ${name} does, the offer and common questions
${flagOn('showProof') ? `- [Work](${base}/#work): projects ${name} has designed and built\n` : ''}- [Start here](${base}/#services): the whole back office, an extra set of hands and websites, and how each is quoted
- [How we work](${base}/#how): a person owns every task; one accountable team
${flagOn('showCareers') && listed.size ? `- [Careers](${base}/careers/): open roles in ${name}'s Command Centre in Phnom Penh, and how to apply\n` : ''}${flagOn('showPrivacyPage') ? `- [Privacy](${base}/privacy/): how enquiries and job applications are handled\n` : ''}
## Contact
- [Email ${email}](mailto:${email})
${fixture || !siteConfig.WHATSAPP_NUMBER ? '' : `- [WhatsApp ${siteConfig.WHATSAPP_NUMBER}](https://wa.me/${siteConfig.WHATSAPP_NUMBER.replace(/\D/g, '')})\n`}${fixture ? '' : [['Facebook', siteConfig.FACEBOOK_URL], ['LinkedIn', siteConfig.LINKEDIN_URL]].filter(([, url]) => url).map(([label, url]) => `- [${name} on ${label}](${url})\n`).join('')}`;
writeFileSync(`${outDir}/llms.txt`, llms);

// A markdown version of each listed page, for AI agents that ask for text/markdown (worker/index.ts serves it in
// place of the HTML). Made from the built page, so it always says what the page says. It sits beside the page as
// index.html.md, the llms.txt convention for a page's markdown copy.
const { htmlToMarkdown } = await import('./markdown.mjs');
const withMarkdown = routes.filter((r) => !r.noindex && (!r.flag || flagOn(r.flag)) && (!r.role || listed.has(r.role)));
let markdownPages = 0;
for (const r of withMarkdown) {
  const page = `${outDir}${r.path}index.html`;
  if (!existsSync(page)) { console.warn(`[postbuild] missing ${page}`); continue; }
  writeFileSync(`${page}.md`, htmlToMarkdown(readFileSync(page, 'utf8')));
  markdownPages++;
}

for (const f of ['index.html', '404.html']) {
  if (!existsSync(`${outDir}/${f}`)) console.warn(`[postbuild] missing ${outDir}/${f}`);
}
console.log(`[postbuild] ${outDir}: sitemap (${indexable.length} url), robots.txt, llms.txt, markdown for ${markdownPages} page(s)`);
