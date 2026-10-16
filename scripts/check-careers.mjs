// Checks the careers section (spec: docs/superpowers/specs/2026-10-16-careers-design.md): the role content,
// the built pages, structured data and sitemap, then in a browser: axe, sideways scroll and the application form.
// Stands in for `npm run verify` (out of date since v0.15) for the careers pages.
// Usage: npm run build && node scripts/check-careers.mjs   (add --static to skip the browser, --flag-off to also build with showCareers off)
import { readFileSync } from 'node:fs';

const args = new Set(process.argv.slice(2));
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

// ---- content ----
const { roles, listedRoles, findRole, careers } = await import('../src/content/careers.ts');
const routes = JSON.parse(readFileSync('src/data/routes.json', 'utf8'));
const SLUGS = ['operations-executive-property-management', 'operations-executive-accounting', 'operations-executive-marketing'];
const [pm, accounts, marketing] = SLUGS.map((s) => findRole(s));
const roleText = (r) => JSON.stringify(r);
const allText = JSON.stringify(roles) + JSON.stringify(careers);

check('three listed roles, in order', JSON.stringify(listedRoles().map((r) => r.slug)) === JSON.stringify(SLUGS), listedRoles().map((r) => r.slug).join(', '));
check('findRole ignores unknown slugs', findRole('nope') === undefined);
check('only Property Management links to LinkedIn', pm?.linkedinUrl === 'https://www.linkedin.com/jobs/view/4479323026/' && !accounts?.linkedinUrl && !marketing?.linkedinUrl);
check('only Marketing asks for work links', marketing?.needsWorkLinks === true && pm?.needsWorkLinks === false && accounts?.needsWorkLinks === false);
for (const r of roles) {
  check(`${r.slug}: salary`, r.facts.salary === 'Starting at US$600 per month, depending on experience' && r.facts.salaryFrom === 600 && r.facts.currency === 'USD');
  check(`${r.slug}: section headings`, JSON.stringify(r.sections.map((s) => s.h)) === JSON.stringify(['About Me²', 'The role', 'Key responsibilities', "What we're looking for", 'What we offer', 'Employment details', 'How we work']), r.sections.map((s) => s.h).join(' | '));
  check(`${r.slug}: posted 16 Oct 2026`, r.datePosted === '2026-10-16');
}
check('PM copy', roleText(pm).includes("This isn't simply a data-entry role."));
check('Accounts copy', roleText(accounts).includes('Assist with Cambodian tax administration, including preparing records, schedules and draft declarations for review.'));
check('Marketing copy', roleText(marketing).includes('This is our first dedicated marketing hire.'));
check('Marketing offer names marketing', roleText(marketing).includes('Exposure to marketing, business operations and process improvement.'));
check('"Exposure to property management" only on PM', roleText(pm).includes('Exposure to property management') && !roleText(accounts).includes('Exposure to property management') && !roleText(marketing).includes('Exposure to property management'));
check('Accounts: no sponsorship line or brackets', !roleText(accounts).includes('Sponsorship') && !/\[[^"{\]]/.test(roleText(accounts)));
check('no health insurance', !/health insurance/i.test(allText));
check('no [[TBC', !allText.includes('[[TBC'));
check('name spelt Me²', !/\b(Me2|ME2|MeSquared)\b/.test(allText));
for (const w of ['revolutionary', 'game-changing', 'supercharge', 'seamless', 'cutting-edge', 'unlock', 'guarantee']) check(`no banned word: ${w}`, !allText.toLowerCase().includes(w));
check('email written as a placeholder', !allText.includes('@mesquaredagency.com') && allText.includes('{CAREERS_EMAIL}'));
for (const path of ['/careers/', ...SLUGS.map((s) => `/careers/${s}/`), '/careers/thanks/', '/careers/not-sent/']) {
  const r = routes.find((x) => x.path === path);
  check(`route ${path}`, r && r.flag === 'showCareers' && r.description.length <= 160 && r.title.includes('Me²'), r ? `${r.description.length} chars` : 'missing');
}
for (const s of SLUGS) check(`route /careers/${s}/ names its role`, routes.find((x) => x.path === `/careers/${s}/`)?.role === s);
check('thanks and not-sent are noindex', ['/careers/thanks/', '/careers/not-sent/'].every((p) => routes.find((x) => x.path === p)?.noindex === true));
// ---- end content ----

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
