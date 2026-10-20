// Turns a built page (dist/**/index.html) into the markdown version that AI agents get when they ask for
// text/markdown (worker/index.ts; docs/search-and-ai.md). Called by postbuild.mjs, so the markdown is always the
// page as built, with the same flags and copy. It reads the page the way a screen reader does: what's hidden from
// one (aria-hidden, hidden, scripts, drawings) is left out, and the sr-only summaries of the drawings are kept.
// Only <main> and the footer are kept: the header is navigation, and forms only work in a browser.
// No dependencies: the site's own HTML is simple and well formed, so a small parser covers it.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'textarea', 'title']);
// Left out with everything inside them.
const DROP = new Set(['head', 'script', 'style', 'noscript', 'template', 'svg', 'canvas', 'button', 'form', 'dialog', 'iframe', 'select', 'input', 'textarea', 'video', 'audio', 'object']);
const BLOCK = new Set(['address', 'article', 'aside', 'div', 'figure', 'figcaption', 'footer', 'header', 'main', 'nav', 'section', 'fieldset', 'details', 'body', 'html']);
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…', middot: '·', times: '×', copy: '©', sup2: '²' };

const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d?);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : NAMED[e.toLowerCase()] ?? m);

/** HTML → a tree of { tag, attrs, children } and { text } nodes. */
export function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const text = (t) => t && top().children.push({ text: decode(t) });
  const tagRe = /<([a-zA-Z][^\s/>]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y;
  const attrRe = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) { text(html.slice(i)); break; }
    text(html.slice(i, lt));
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      i = end === -1 ? html.length : end + 3;
    } else if (html[lt + 1] === '!' || html[lt + 1] === '?') {
      i = html.indexOf('>', lt) + 1 || html.length;
    } else if (html[lt + 1] === '/') {
      const end = html.indexOf('>', lt);
      const name = html.slice(lt + 2, end).trim().toLowerCase();
      const at = stack.findLastIndex((n) => n.tag === name);
      if (at > 0) stack.length = at;
      i = end + 1;
    } else {
      tagRe.lastIndex = lt;
      const m = tagRe.exec(html);
      if (!m) { text('<'); i = lt + 1; continue; }
      const tag = m[1].toLowerCase();
      const attrs = {};
      for (const a of m[2].matchAll(attrRe)) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
      const node = { tag, attrs, children: [] };
      top().children.push(node);
      i = tagRe.lastIndex;
      if (RAW.has(tag)) {
        const end = html.toLowerCase().indexOf(`</${tag}`, i);
        const stop = end === -1 ? html.length : end;
        node.children.push({ text: tag === 'title' ? decode(html.slice(i, stop)) : html.slice(i, stop) });
        i = end === -1 ? html.length : html.indexOf('>', end) + 1;
      } else if (!VOID.has(tag) && !m[3]) {
        stack.push(node);
      }
    }
  }
  return root;
}

const find = (node, test) => {
  if (test(node)) return node;
  for (const c of node.children ?? []) {
    const hit = find(c, test);
    if (hit) return hit;
  }
  return null;
};
const textOf = (node) => (node.text ?? node.children.map(textOf).join(''));
// data-markdown="skip" marks something a screen reader needs but an agent doesn't (the hero's illustration summaries).
const hidden = (n) => DROP.has(n.tag) || n.attrs['aria-hidden'] === 'true' || 'hidden' in n.attrs || n.attrs['data-markdown'] === 'skip';

/** Markdown for one page: front matter from its head, then its main content and footer. */
export function htmlToMarkdown(html) {
  const root = parse(html);
  const head = find(root, (n) => n.tag === 'head') ?? root;
  const meta = (name) => find(head, (n) => n.tag === 'meta' && (n.attrs.name === name || n.attrs.property === name))?.attrs.content;
  const canonical = find(head, (n) => n.tag === 'link' && n.attrs.rel === 'canonical')?.attrs.href;
  const base = canonical ?? 'https://example.com/';
  const title = find(head, (n) => n.tag === 'title');

  const front = [
    ['title', title && textOf(title).trim()],
    ['description', meta('description')],
    ['url', canonical],
    ['image', meta('og:image')],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);

  const parts = ['main', 'footer'].map((tag) => find(root, (n) => n.tag === tag)).filter(Boolean);
  const body = tidy(parts.map((n) => render(n, base)).join('\n\n'));
  return `---\n${front.join('\n')}\n---\n\n${body}\n`;
}

const block = (s) => (s.trim() ? `\n\n${s.trim()}\n\n` : '');
// Collapses the blank lines and stray spaces left where blocks meet.
const tidy = (s) =>
  s.split('\n').map((l) => l.replace(/(\S) {2,}/g, '$1 ').replace(/\s+$/, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
const oneLine = (s) => s.replace(/\s+/g, ' ').trim();
// Keeps the spaces around an inline element outside its markers: "a **b** c", never "a** b **c".
const wrap = (s, mark) => {
  if (!s.trim()) return s;
  const [, lead, mid, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
  return `${lead}${mark}${mid}${mark}${trail}`;
};

// Joins an element's children. Two elements the page sets side by side with no space between them in the HTML
// (a service and its example, two buttons) would run together as text, so they get a separator: a space after
// punctuation or around a link, otherwise a colon ("Admin: Data entry, scheduling…").
function join(children, base) {
  let out = '';
  let lastWasElement = false;
  for (const c of children) {
    const s = render(c, base);
    if (!s) continue;
    const isElement = !('text' in c);
    if (isElement && lastWasElement && /[\p{L}0-9.!?:;,)\]]$/u.test(out) && /^[\p{L}0-9[]/u.test(s)) {
      out += /[.!?:;,)\]]$/.test(out) || s.startsWith('[') ? ' ' : ': ';
    }
    out += s;
    lastWasElement = isElement;
  }
  return out;
}

function render(node, base) {
  if ('text' in node) return node.text.replace(/\s+/g, ' ').replace(/([*_`])/g, '\\$1');
  if (hidden(node)) return '';
  const inner = () => join(node.children, base);
  const t = node.tag;
  if (/^h[1-6]$/.test(t)) return block(`${'#'.repeat(Number(t[1]))} ${oneLine(inner())}`);
  switch (t) {
    case 'p':
      return block(inner());
    case 'br':
      return '\n';
    case 'hr':
      return block('---');
    case 'a': {
      const content = inner();
      const href = node.attrs.href && new URL(node.attrs.href, base).href;
      // A link wrapped round a whole card (the careers list): keep the card's lines and link its heading.
      if (href && content.includes('\n')) {
        const lines = tidy(content).split('\n');
        const at = Math.max(0, lines.findIndex((l) => /^#{1,6} /.test(l)));
        lines[at] = lines[at].replace(/^(#{1,6} )?(.*)$/, (_, hashes = '', text) => `${hashes}[${text}](${href})`);
        return block(lines.join('\n'));
      }
      const label = oneLine(content);
      return label && href ? `[${label}](${href})` : label;
    }
    case 'strong':
    case 'b':
      return wrap(inner(), '**');
    case 'em':
    case 'i':
      return wrap(inner(), '_');
    case 'code':
      return wrap(inner(), '`');
    case 'img':
      return node.attrs.alt ? `![${node.attrs.alt}](${new URL(node.attrs.src, base).href})` : '';
    case 'ul':
    case 'ol':
      return list(node, base, t === 'ol');
    case 'dt':
    case 'summary':
      return block(`**${oneLine(inner())}**`);
    case 'dd':
      return block(inner());
    case 'blockquote':
      return block(tidy(inner()).split('\n').map((l) => `> ${l}`).join('\n'));
    default:
      return BLOCK.has(t) || t === 'dl' || t === '#root' ? block(inner()) : inner();
  }
}

function list(node, base, ordered) {
  const items = node.children.filter((c) => c.tag === 'li' && !hidden(c));
  return block(
    items
      .map((li, i) => {
        const marker = ordered ? `${i + 1}. ` : '- ';
        const body = tidy(join(li.children, base)).replace(/\n\n+/g, '\n');
        return marker + body.split('\n').map((l, j) => (j ? ' '.repeat(marker.length) + l : l)).join('\n');
      })
      .filter((l) => l.trim() !== '-' && !/^\d+\.\s*$/.test(l.trim()))
      .join('\n'),
  );
}
