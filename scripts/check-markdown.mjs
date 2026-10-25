// Checks the markdown versions of the pages for AI agents (docs/search-and-ai.md): the build made one for every page
// in the sitemap, each reads cleanly, and the Worker (worker/index.ts) serves it only to requests that ask for
// text/markdown, while browsers keep getting the HTML. Runs the Worker in Node, with dist/ standing in for its static
// assets, so no server or network is needed.
// Usage: npm run build && node scripts/check-markdown.mjs
import { existsSync, readFileSync, statSync } from 'node:fs';

const { default: worker, prefersMarkdown } = await import('../worker/index.ts');
const { siteConfig } = await import('../src/config/site.config.ts');
const { content } = await import('../src/content/site.ts');

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

// dist/ as the ASSETS binding: files by path, a directory's index.html, the 404 page for anything else.
const file = (pathname) => `dist${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`;
const ASSETS = {
  async fetch(request) {
    const path = file(new URL(request.url).pathname);
    if (!existsSync(path) || !statSync(path).isFile()) {
      return new Response(readFileSync('dist/404.html'), { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    const type = path.endsWith('.html') ? 'text/html; charset=utf-8' : path.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'application/octet-stream';
    return new Response(readFileSync(path), { headers: { 'content-type': type, 'strict-transport-security': 'max-age=31536000' } });
  },
};
const origin = `https://${siteConfig.SITE_DOMAIN}`;
const get = (path, accept, method = 'GET') =>
  worker.fetch(new Request(`${origin}${path}`, { method, headers: accept ? { accept } : {} }), { ASSETS }, { waitUntil() {} });

// Which requests count as asking for markdown.
const BROWSER = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
for (const [accept, want] of [
  ['text/markdown', true],
  ['text/markdown, text/html;q=0.9, */*;q=0.8', true],
  ['text/x-markdown', true],
  [BROWSER, false],
  ['*/*', false],
  [null, false],
  ['text/html, text/markdown;q=0.5', false],
  ['text/markdown;q=0', false],
]) check(`Accept ${JSON.stringify(accept)} ${want ? 'gets' : "doesn't get"} markdown`, prefersMarkdown(accept) === want);

// Every page in the sitemap: a markdown file that reads cleanly, served to agents and not to browsers.
const pages = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
check('the sitemap lists pages', pages.length > 0);
for (const path of pages) {
  const md = `dist${path}index.html.md`;
  if (!existsSync(md)) { check(`${path}: markdown built`, false, md); continue; }
  const text = readFileSync(md, 'utf8');
  const problems = [
    !text.startsWith('---\ntitle: ') && 'no front matter',
    !/^# \S/m.test(text) && 'no top heading',
    /<\/?[a-z][^>]*>/i.test(text) && 'HTML tags left in',
    /\]\((?!https?:|mailto:|tel:)/.test(text) && 'a relative link',
    /Illustration/.test(text) && 'an illustration summary',
    /\{[A-Z_]+\}|undefined|\[object /.test(text) && 'an unfilled placeholder',
    /\n{3,}/.test(text) && 'extra blank lines',
  ].filter(Boolean);
  check(`${path}: markdown reads cleanly`, problems.length === 0, problems.join(', '));

  const res = await get(path, 'text/markdown');
  const body = await res.text();
  check(`${path}: served as markdown to agents`,
    res.status === 200 && res.headers.get('content-type') === 'text/markdown; charset=utf-8' && body === text,
    `${res.status} ${res.headers.get('content-type')}`);
  check(`${path}: markdown headers (Vary, token estimate, canonical, Content Signals, security)`,
    res.headers.get('vary') === 'Accept' && Number(res.headers.get('x-markdown-tokens')) === Math.ceil(text.length / 4) &&
      res.headers.get('link') === `<${origin}${path}>; rel="canonical"` &&
      res.headers.get('content-signal') === 'search=yes, ai-input=yes, ai-train=yes' && res.headers.has('strict-transport-security'),
    [...res.headers].map((h) => h.join(': ')).join('; '));

  const html = await get(path, BROWSER);
  check(`${path}: browsers still get HTML, marked Vary: Accept`,
    html.status === 200 && html.headers.get('content-type').startsWith('text/html') && /Accept/.test(html.headers.get('vary') ?? ''));
}

// The home page says what the visitor's page says.
const home = readFileSync('dist/index.html.md', 'utf8');
check('home: hero line as the top heading', home.includes(`\n# ${content.hero.h1}\n`));
check('home: services listed with their examples', /^- (\[Admin\]\([^)]+\)|Admin): \S/m.test(home));
check('home: FAQ answers included', home.includes('Usually within 2 hours, evenings and weekends included.'));
check('home: the contact email linked', home.includes(`(mailto:${siteConfig.CONTACT_EMAIL})`));
check('careers: each role links to its page', (readFileSync('dist/careers/index.html.md', 'utf8').match(/^\s*### \[[^\]]+\]\(https:/gm) ?? []).length >= 1);

// Everything else is unchanged.
const head = await get('/', 'text/markdown', 'HEAD');
check('HEAD with Accept: text/markdown: markdown headers, no body', head.headers.get('content-type')?.startsWith('text/markdown') && (await head.text()) === '');
const missing = await get('/no-such-page/', 'text/markdown');
check('a missing page still gets the HTML 404', missing.status === 404 && missing.headers.get('content-type').startsWith('text/html'));
const noMd = await get('/thanks/', 'text/markdown');
check('a page without a markdown version gets its HTML', noMd.status === 200 && noMd.headers.get('content-type').startsWith('text/html'));
const direct = await get('/index.html.md', BROWSER);
check('the markdown file at its own address is served as markdown', direct.headers.get('content-type') === 'text/markdown; charset=utf-8');

console.log(failed ? `\n${failed} failed` : '\nAll passed');
process.exit(failed ? 1 : 0);
