// Checks the enquiry route (POST /api/enquiry in worker/index.ts) without a network: Resend is stubbed, and each
// case builds the request a browser would send. Covers the automatic confirmation emailed to the visitor
// (spec: docs/superpowers/specs/2026-10-19-reply-bots.md; docs/forms.md).
// Usage: node scripts/check-enquiry.mjs
const { enquiry } = await import('../worker/index.ts');
const { content } = await import('../src/content/site.ts');

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

// Resend stub: records each call and answers with the next status in the list (200 when the list runs out).
let calls = [];
let statuses = [];
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), body: JSON.parse(init.body) });
  const status = statuses.shift() ?? 200;
  return new Response(JSON.stringify(status === 200 ? { id: 'test' } : { name: 'rate_limit_exceeded' }), { status });
};
// Everything the handler logs, to prove no personal details reach the logs.
const logged = [];
const realLog = console.log;

const LIVE = 'https://mesquaredagency.com/api/enquiry';
const PREVIEW = 'https://abc123-mesquared.mesquared-site.workers.dev/api/enquiry';
// Distinctive values, so the checks can prove the confirmation never repeats what the visitor typed.
const base = (over = {}) => ({
  name: 'Zelda Visitor', email: 'zelda@example.com', message: 'Please chase our overdue invoices XYZZY.',
  topic: 'Extra set of hands', source: 'hero', website: '', started: String(Date.now() - 10_000), ...over,
});
const post = (payload, url = LIVE, { js = true } = {}) =>
  js
    ? new Request(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(payload) })
    : new Request(url, { method: 'POST', body: new URLSearchParams(payload) });
// Runs the handler as the Worker would, then waits for anything it handed to waitUntil (the confirmation).
const run = async (req, statusList = []) => {
  calls = [];
  statuses = [...statusList];
  const waits = [];
  console.log = (...m) => logged.push(m.join(' '));
  try {
    const res = await enquiry(req, { RESEND_API_KEY: 'test' }, { waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
    return { res, body: res.headers.get('content-type')?.includes('json') ? await res.json() : null };
  } finally {
    console.log = realLog;
  }
};

const conf = content.enquiryConfirmation;

// A valid enquiry from the live site: the enquiry to hello@, then the confirmation to the visitor.
{
  const { res, body } = await run(post(base()));
  check('valid enquiry: 200 ok', res.status === 200 && body?.ok === true, `${res.status} ${JSON.stringify(body)}`);
  check('two Resend calls: the enquiry, then the confirmation', calls.length === 2 && calls.every((c) => c.url === 'https://api.resend.com/emails'), String(calls.length));
  const e = calls[0]?.body ?? {};
  check('enquiry still goes to hello@, Reply-To the visitor', JSON.stringify(e.to) === JSON.stringify(['hello@mesquaredagency.com']) && e.reply_to === 'zelda@example.com');
  const c = calls[1]?.body ?? {};
  check('confirmation to the visitor only', JSON.stringify(c.to) === JSON.stringify(['zelda@example.com']), JSON.stringify(c.to));
  check('confirmation from Me Squared <hello@>, Reply-To hello@', c.from === 'Me Squared <hello@mesquaredagency.com>' && c.reply_to === 'hello@mesquaredagency.com', `${c.from} / ${c.reply_to}`);
  check('confirmation subject', c.subject === conf.subject, c.subject);
  check('confirmation marked as an automatic reply', c.headers?.['Auto-Submitted'] === 'auto-replied' && c.headers?.['X-Auto-Response-Suppress'] === 'All', JSON.stringify(c.headers));
  check('confirmation says it is automatic, a person will reply usually within 2 hours, and offers a call back',
    ['This is an automatic reply', 'A person from our team will reply to this email, usually within 2 hours.', "If you'd rather talk"].every((t) => c.text?.includes(t)));
  check('confirmation signs off as Me² with the site address', c.text?.includes('Me²\nhttps://mesquaredagency.com') && !c.text?.includes('{SITE_NAME}') && c.html?.includes('https://mesquaredagency.com'));
  // Anyone can type someone else's address, so the confirmation is fixed text: nothing the visitor typed goes back out.
  check('confirmation never repeats the name, message or topic', ['Zelda', 'XYZZY', 'overdue invoices', 'Extra set of hands'].every((t) => !JSON.stringify(c).includes(t)));
}
// Without JavaScript the browser posts the form and lands on /thanks/; the confirmation still goes.
{
  const { res } = await run(post(base(), LIVE, { js: false }));
  check('no JavaScript: 303 to /thanks/, confirmation sent', res.status === 303 && res.headers.get('location')?.endsWith('/thanks/') && calls.length === 2 && calls[1].body.to[0] === 'zelda@example.com');
}
// Preview links run the same Worker: the enquiry reaches hello@ as today, but nobody gets a confirmation.
{
  const { res } = await run(post(base(), PREVIEW));
  check('preview link: enquiry sent, no confirmation', res.status === 200 && calls.length === 1 && calls[0].body.to[0] === 'hello@mesquaredagency.com', String(calls.length));
}
// Bots are told it worked, and nothing is sent at all.
for (const [name, over] of [['honeypot filled', { website: 'x' }], ['filled in 1 second', { started: String(Date.now() - 1000) }]]) {
  const { res, body } = await run(post(base(over)));
  check(`bot (${name}): ok, nothing sent, no confirmation`, res.status === 200 && body?.ok === true && calls.length === 0);
}
// Refused enquiries send nothing.
check('bad email: refused, nothing sent', (await run(post(base({ email: 'not-an-email' })))).res.status === 400 && calls.length === 0);
// The enquiry didn't reach hello@: the visitor is told it didn't send, and gets no confirmation.
{
  const { res, body } = await run(post(base()), [429]);
  check('enquiry fails: not ok, no confirmation', res.status === 502 && body?.ok === false && calls.length === 1, `${res.status} ${calls.length}`);
}
// The confirmation fails: the enquiry did reach hello@, so the visitor still sees "sent".
{
  const { res, body } = await run(post(base()), [200, 500]);
  check('confirmation fails: still 200 ok', res.status === 200 && body?.ok === true && calls.length === 2, `${res.status}`);
  check('confirmation failure logged without personal details', logged.some((l) => l.includes('"event":"enquiry-confirmation"') && l.includes('"result":"send-failed"')));
}
check('logs never hold the name, email or message', logged.length > 0 && logged.every((l) => !/Zelda|zelda@example\.com|XYZZY/.test(l)), logged.find((l) => /Zelda|zelda@|XYZZY/.test(l)));

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
