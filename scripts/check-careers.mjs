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

// ---- built pages (npm run build first) ----
const read = (p) => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const h1Of = (html) => textOf(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').trim();
const ldOf = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1]));
const indexHtml = read('dist/careers/index.html');
check('built: /careers/', indexHtml.length > 0);
check('/careers/: heading', h1Of(indexHtml) === 'Join our team in Phnom Penh.', h1Of(indexHtml));
check('/careers/: a row per role', SLUGS.every((s) => indexHtml.includes(`href="/careers/${s}/"`)));
check('/careers/: row facts on each row', textOf(indexHtml).split('Phnom Penh · Full-time · From US$600 a month').length === 4);
check('/careers/: people@ link', indexHtml.includes('href="mailto:people@mesquaredagency.com"'));
check('/careers/: no JobPosting', !ldOf(indexHtml).some((x) => x['@type'] === 'JobPosting'));
for (const r of [pm, accounts, marketing]) {
  const html = read(`dist/careers/${r.slug}/index.html`);
  const text = textOf(html);
  check(`${r.slug}: built`, html.length > 0);
  check(`${r.slug}: heading is the full job title`, h1Of(html).replace(' ,', ',') === `${careers.role.kicker}, ${r.area}`, h1Of(html));
  check(`${r.slug}: facts`, text.includes('Starting at US$600 per month, depending on experience') && text.includes('44 hours per week') && text.includes('Phnom Penh, Cambodia'));
  check(`${r.slug}: section headings are h2`, r.sections.every((s) => decode(html).includes(`>${s.h}</h2>`)));
  check(`${r.slug}: LinkedIn link only where the role is on LinkedIn`, r.linkedinUrl ? html.includes(`href="${r.linkedinUrl}"`) && text.includes('Apply on LinkedIn') : !html.includes('linkedin.com/jobs') && !text.includes('Apply on LinkedIn'));
  check(`${r.slug}: APN link where the post has it`, html.includes('href="https://apnre.com.au/"') === (r.slug !== accounts.slug));
  const form = html.match(/<form[^>]*data-application[^>]*>/)?.[0] ?? '';
  check(`${r.slug}: form posts multipart to /api/applications`, /method="post"/.test(form) && /action="\/api\/applications"/.test(form) && /enctype="multipart\/form-data"/.test(form), form);
  check(`${r.slug}: form sits in #apply`, /id="apply"/.test(html));
  const names = [...html.matchAll(/<(?:input|textarea|select)[^>]*\bname="([^"]+)"/g)].map((m) => m[1]);
  const want = ['role', 'name', 'email', 'phone', 'location', 'cv', 'linkedin', 'why', 'website', 'started', ...(r.needsWorkLinks ? ['workLinks'] : [])];
  check(`${r.slug}: form fields`, want.every((n) => names.includes(n)) && names.length === want.length, names.join(','));
  check(`${r.slug}: role field carries the slug`, new RegExp(`name="role"[^>]*value="${r.slug}"|value="${r.slug}"[^>]*name="role"`).test(html));
  const cvInput = html.match(/<input[^>]*name="cv"[^>]*>/)?.[0] ?? '';
  check(`${r.slug}: CV input`, /type="file"/.test(cvInput) && /required/.test(cvInput) && cvInput.includes('accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"'), cvInput);
  if (r.needsWorkLinks) check(`${r.slug}: work links required`, /<textarea[^>]*name="workLinks"[^>]*required|<textarea[^>]*required[^>]*name="workLinks"/.test(html));
  const labels = [...html.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)].map((m) => textOf(m[1])).join(' | ');
  check(`${r.slug}: no fields for birth, photo, gender, nationality or salary`, !/birth|photo|gender|nationality|salary/i.test(names.join(' ') + labels), labels);
  const job = ldOf(html).find((x) => x['@type'] === 'JobPosting');
  check(`${r.slug}: JobPosting`, job && job.title === r.title && job.datePosted === '2026-10-16' && job.employmentType === 'FULL_TIME' && job.directApply === true, JSON.stringify(job)?.slice(0, 200));
  check(`${r.slug}: JobPosting organisation`, job?.hiringOrganization?.name === 'Me²' && job.hiringOrganization.sameAs?.includes('https://www.linkedin.com/company/mesquaredagency'));
  check(`${r.slug}: JobPosting place`, job?.jobLocation?.address?.addressLocality === 'Phnom Penh' && job.jobLocation.address.addressCountry === 'KH');
  check(`${r.slug}: JobPosting salary`, job?.baseSalary?.currency === 'USD' && job.baseSalary.value?.minValue === 600 && job.baseSalary.value.unitText === 'MONTH');
  check(`${r.slug}: JobPosting description`, job?.description?.includes(r.sections[2].groups[0].items[0]));
}
const thanksHtml = read('dist/careers/thanks/index.html');
const notSentHtml = read('dist/careers/not-sent/index.html');
check('thanks: built, noindex', thanksHtml.includes('<meta name="robots" content="noindex"') && h1Of(thanksHtml) === 'Application sent.');
check('not-sent: built, noindex, people@ link', notSentHtml.includes('<meta name="robots" content="noindex"') && notSentHtml.includes('href="mailto:people@mesquaredagency.com"'));
check('home: footer links to careers', /<a href="\/careers\/"[^>]*>Careers<\/a>/.test(read('dist/index.html')));
const sitemap = read('dist/sitemap.xml');
check('sitemap: careers pages in', ['/careers/', ...SLUGS.map((s) => `/careers/${s}/`)].every((p) => sitemap.includes(`https://mesquaredagency.com${p}<`)));
check('sitemap: thanks and not-sent out', !sitemap.includes('/careers/thanks/') && !sitemap.includes('/careers/not-sent/'));
check('llms.txt: careers line', read('dist/llms.txt').includes('[Careers](https://mesquaredagency.com/careers/)'));
const privacyText = textOf(read('dist/privacy/index.html'));
check('privacy: job applications section', privacyText.includes('Job applications') && privacyText.includes('12 months') && privacyText.includes('people@mesquaredagency.com'));
// ---- end built pages ----

// ---- careers switched off (a fixture build with showCareers false) ----
if (args.has('--flag-off')) {
  const { execSync } = await import('node:child_process');
  const { existsSync } = await import('node:fs');
  const dir = '.verify/careers-off/dist';
  execSync(`node scripts/build-fixture.mjs ${dir} "{\\"showCareers\\":false}"`, { stdio: 'ignore' });
  check('flag off: no careers pages', existsSync(`${dir}/index.html`) && !existsSync(`${dir}/careers`));
  check('flag off: no footer link', !read(`${dir}/index.html`).includes('href="/careers/"'));
  check('flag off: not in llms.txt', !read(`${dir}/llms.txt`).includes('/careers/'));
  check('flag off: not in sitemap', !read(`${dir}/sitemap.xml`).includes('/careers/'));
}
// ---- end careers switched off ----

if (!args.has('--static')) {
  const { createServer } = await import('node:http');
  const { extname, join } = await import('node:path');
  const { chromium } = await import('@playwright/test');
  const { AxeBuilder } = await import('@axe-core/playwright');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const body = readFileSync(join('dist', p));
      res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const site = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
  const open = async (path, width, opts = {}) => {
    const { height = 900, ...rest } = opts;
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', ...rest });
    const page = await ctx.newPage();
    await page.goto(`${site}${path}`, { waitUntil: 'networkidle' });
    if (rest.javaScriptEnabled !== false) await page.evaluate(() => document.fonts.ready);
    return page;
  };
  const axe = async (page) => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations.map((v) => `${v.id} (${v.nodes.length})`);
  const PM_PATH = `/careers/${SLUGS[0]}/`;
  const MK_PATH = `/careers/${SLUGS[2]}/`;

  for (const width of [375, 1280]) {
    for (const path of ['/careers/', PM_PATH]) {
      const page = await open(path, width);
      const v = await axe(page);
      check(`axe clean: ${path} at ${width}px`, v.length === 0, v.join(', '));
      await page.context().close();
    }
    const page = await open(MK_PATH, width);
    await page.click('[data-application] button[type="submit"]');
    const v = await axe(page);
    check(`axe clean: Marketing form showing its errors at ${width}px`, v.length === 0, v.join(', '));
    await page.context().close();
  }
  for (const [width, height] of [[375, 812], [768, 1024], [820, 1180], [1024, 768], [1280, 900], [1830, 915]]) {
    for (const path of ['/careers/', MK_PATH]) {
      const page = await open(path, width, { height });
      const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
      check(`no sideways scroll: ${path} at ${width}×${height}`, sw <= iw, `${sw}/${iw}`);
      await page.context().close();
    }
  }
  {
    const page = await open(MK_PATH, 1280);
    await page.click('[data-application] button[type="submit"]');
    check('empty submit: focus goes to the name', await page.evaluate(() => document.activeElement?.id === 'app-name'));
    const f = careers.form;
    const errs = await page.$$eval('[data-application] .err', (els) => els.map((e) => e.textContent.trim()).filter(Boolean));
    check('empty submit: every required field says what is missing', [f.requiredName, f.requiredEmail, f.requiredLocation, f.requiredCv, f.requiredWorkLinks, f.requiredWhy].every((t) => errs.includes(t)), errs.join(' | '));
    await page.setInputFiles('#app-cv', { name: 'cv.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await page.click('[data-application] button[type="submit"]');
    check('a text file is refused as a CV', (await page.textContent('#app-cv-err'))?.trim() === f.cvType);
    await page.context().close();
  }
  const fill = async (page) => {
    await page.fill('#app-name', 'Test Person');
    await page.fill('#app-email', 'test@example.com');
    await page.fill('#app-location', 'Phnom Penh, Cambodia');
    await page.setInputFiles('#app-cv', { name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test file') });
    await page.fill('#app-why', 'Because I like tidy rent rolls.');
    await page.waitForTimeout(2600); // the form's bot check: real people take longer than 2.5 seconds
  };
  {
    const page = await open(PM_PATH, 1280);
    let sent = null;
    await page.route('**/api/applications', async (route) => {
      const r = route.request();
      sent = { type: r.headers()['content-type'] ?? '', accept: r.headers().accept ?? '', body: r.postDataBuffer()?.toString('latin1') ?? '' };
      await route.fulfill({ json: { ok: true } });
    });
    await fill(page);
    await page.click('[data-application] button[type="submit"]');
    await page.waitForSelector('[data-application].is-sent');
    check('sent: the thanks shows in place', (await page.textContent('[data-application] [data-status]'))?.includes('Application sent.'));
    // The same multipart form the browser would post without JavaScript, the CV as a file (not inflated by base64).
    check('sent: posted as multipart with the CV file, answered as JSON', sent?.type.startsWith('multipart/form-data') && sent.accept.includes('application/json') &&
      sent.body.includes('filename="cv.pdf"') && sent.body.includes('%PDF-1.4 test file') && new RegExp(`name="role"\\r\\n\\r\\n${SLUGS[0]}`).test(sent.body), JSON.stringify(sent)?.slice(0, 200));
    await page.context().close();
  }
  {
    const page = await open(PM_PATH, 1280);
    await page.route('**/api/applications', (route) => route.fulfill({ status: 502, json: { ok: false } }));
    await fill(page);
    await page.click('[data-application] button[type="submit"]');
    await page.waitForSelector('[data-application] [data-status] a[href^="mailto:people@"]');
    check('not sent: says so, with the people@ link', (await page.textContent('[data-application] [data-status]'))?.includes("Your application didn't send."));
    check('not sent: what they typed is still there', (await page.inputValue('#app-name')) === 'Test Person' && (await page.$eval('#app-cv', (i) => i.files.length)) === 1);
    check('not sent: the message takes focus, so screen readers say it', await page.evaluate(() => document.activeElement?.matches('[data-application] [data-status]')));
    await page.context().close();
  }
  {
    // The Worker refused the CV itself (e.g. a ".doc" that is really a web page): say so under the CV field.
    const page = await open(PM_PATH, 1280);
    await page.route('**/api/applications', (route) => route.fulfill({ status: 400, json: { ok: false, field: 'cv' } }));
    await fill(page);
    await page.click('[data-application] button[type="submit"]');
    await page.waitForFunction(() => document.querySelector('#app-cv-err')?.textContent.trim(), null, { timeout: 5000 }).catch(() => {});
    check('CV refused by the server: said under the CV field, focus on it', (await page.textContent('#app-cv-err'))?.trim() === careers.form.cvType && await page.evaluate(() => document.activeElement?.id === 'app-cv'));
    check('CV refused by the server: no "try again" message', !(await page.textContent('[data-application] [data-status]'))?.includes("didn't send"));
    await page.context().close();
  }
  {
    const page = await open(PM_PATH, 375, { javaScriptEnabled: false });
    const ok = await page.$$eval('[data-application] input:not([type="hidden"]), [data-application] textarea, [data-application] button', (els) => els.length > 0 && els.filter((e) => e.name !== 'website').every((e) => !e.disabled && e.getClientRects().length > 0));
    check('no JavaScript: the form is there and usable', ok);
    await page.context().close();
  }
  await browser.close();
  server.close();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
