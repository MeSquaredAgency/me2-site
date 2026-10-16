// Checks the job application route (worker/applications.ts) without a network: Resend is stubbed, and each
// case builds the request a browser would send. Spec: docs/superpowers/specs/2026-10-16-careers-design.md.
// Usage: node scripts/check-applications.mjs
const { application, applicationWith, MAX_CV_BYTES } = await import('../worker/applications.ts');

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

// Resend stub: records each call and answers with the status the case sets.
let calls = [];
let resendStatus = 200;
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), body: JSON.parse(init.body), headers: init.headers });
  return new Response(JSON.stringify(resendStatus === 200 ? { id: 'test' } : { name: 'rate_limit_exceeded' }), { status: resendStatus });
};
// Everything the handler logs, to prove no personal details reach the logs.
const logged = [];
const realLog = console.log;
const capture = (fn) => async (...a) => { console.log = (...m) => logged.push(m.join(' ')); try { return await fn(...a); } finally { console.log = realLog; } };
const send = capture(application);

const LIVE = 'https://mesquaredagency.com/api/applications';
const PM = 'operations-executive-property-management';
const pdf = (size) => { const b = Buffer.alloc(size, 0x20); Buffer.from('%PDF-1.4\n').copy(b); return b; };
const small = pdf(2048);
const env = { RESEND_API_KEY: 'test' };
const base = (over = {}) => ({
  role: PM, name: 'Test Person', email: 'test@example.com', phone: '', location: 'Phnom Penh, Cambodia', linkedin: '',
  workLinks: '', why: 'I have run a rent roll for three years.', website: '', started: String(Date.now() - 10_000),
  cv: { name: 'my cv.pdf', type: 'application/pdf', bytes: small }, ...over,
});
// The page posts the form as multipart with Accept: application/json; without JavaScript the browser posts the same form without it.
const json = (payload, url = LIVE, { js = true } = {}) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (k === 'cv') fd.append('cv', v ? new File([v.bytes], v.name, { type: v.type ?? '' }) : new File([], '', { type: 'application/octet-stream' }));
    else if (v !== undefined) fd.append(k, v);
  }
  return new Request(url, { method: 'POST', headers: js ? { accept: 'application/json' } : {}, body: fd });
};
const run = async (req, e = env) => { calls = []; const res = await send(req, e); return { res, body: res.headers.get('content-type')?.includes('json') ? await res.json() : null }; };

// A valid application from the live site.
{
  const { res, body } = await run(json(base()));
  check('valid application: 200 ok', res.status === 200 && body?.ok === true, `${res.status} ${JSON.stringify(body)}`);
  const c = calls[0]?.body ?? {};
  check('one Resend call', calls.length === 1 && calls[0].url === 'https://api.resend.com/emails');
  check('to people@', JSON.stringify(c.to) === JSON.stringify(['people@mesquaredagency.com']), JSON.stringify(c.to));
  check('from Me Squared careers', c.from === 'Me Squared careers <website@mesquaredagency.com>', c.from);
  check('reply to the applicant', c.reply_to === 'test@example.com');
  check('subject names the role and the applicant', c.subject === 'Application: Operations Executive (Property Management) (Test Person)', c.subject);
  check('CV attached unchanged', c.attachments?.length === 1 && c.attachments[0].content === small.toString('base64'));
  check('attachment name is safe and keeps .pdf', /^[A-Za-z0-9 ._-]+\.pdf$/.test(c.attachments?.[0]?.filename ?? ''), c.attachments?.[0]?.filename);
  check('email text has the answers', ['Phnom Penh, Cambodia', 'I have run a rent roll for three years.', 'Operations Executive (Property Management)'].every((t) => c.text?.includes(t)));
  check('email html escapes what the applicant typed', (await run(json(base({ why: '<b>bold</b> & more' })))).res.status === 200 && calls[0].body.html.includes('&lt;b&gt;bold&lt;/b&gt; &amp; more'));
}
// A preview link marks the subject, so test applications stand out in the inbox.
{
  await run(json(base(), 'https://abc123-mesquared.mesquared-site.workers.dev/api/applications'));
  check('preview subject starts [Preview]', calls[0]?.body.subject.startsWith('[Preview] Application: '), calls[0]?.body.subject);
}
// Bots are told it worked, and nothing is sent.
for (const [name, over] of [['honeypot filled', { website: 'x' }], ['filled in 1 second', { started: String(Date.now() - 1000) }]]) {
  const { res, body } = await run(json(base(over)));
  check(`bot (${name}): ok and nothing sent`, res.status === 200 && body?.ok === true && calls.length === 0);
}
// Refused: 400 and nothing sent.
const refused = [
  ['unknown role', { role: 'chief-everything' }],
  ['missing name', { name: '  ' }],
  ['bad email', { email: 'not-an-email' }],
  ['missing location', { location: '' }],
  ['missing why', { why: '' }],
  ['why over 1,000 characters', { why: 'x'.repeat(1001) }],
  ['Marketing without work links', { role: 'operations-executive-marketing' }],
  ['CV that is really a GIF', { cv: { name: 'cv.pdf', type: 'application/pdf', bytes: Buffer.from('GIF89a......') } }],
  ['Word-named CV with PDF bytes', { cv: { name: 'cv.docx', type: 'application/pdf', bytes: small } }],
  ['0-byte CV', { cv: { name: 'cv.pdf', type: 'application/pdf', bytes: Buffer.alloc(0) } }],
  ['no CV', { cv: undefined }],
  ['CV named .exe', { cv: { name: 'cv.exe', type: 'application/pdf', bytes: small } }],
];
for (const [name, over] of refused) {
  const { res, body } = await run(json(base(over)));
  check(`refused: ${name}`, res.status === 400 && body?.ok === false && calls.length === 0, `${res.status}`);
  // A refused CV is named, so the page can say so under the CV field instead of "try again".
  if (/CV/.test(name)) check(`refused: ${name} says it was the CV`, body?.field === 'cv', JSON.stringify(body));
}
// Marketing with work links goes through; Word files go through.
check('Marketing with work links: ok', (await run(json(base({ role: 'operations-executive-marketing', workLinks: 'https://example.com/a https://example.com/b' })))).res.status === 200 && calls[0]?.body.text.includes('https://example.com/a'));
const docx = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(100)]);
const doc = Buffer.concat([Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), Buffer.alloc(100)]);
check('DOCX CV: ok', (await run(json(base({ cv: { name: 'cv.docx', type: '', bytes: docx } })))).res.status === 200 && calls[0]?.body.attachments[0].filename.endsWith('.docx'));
check('DOC CV: ok', (await run(json(base({ cv: { name: 'CV.DOC', type: '', bytes: doc } })))).res.status === 200 && calls[0]?.body.attachments[0].filename.endsWith('.doc'));
// The size limit: exactly 4 MB is fine, one byte more is not.
check('CV of exactly 4 MB: ok', (await run(json(base({ cv: { name: 'cv.pdf', type: 'application/pdf', bytes: pdf(MAX_CV_BYTES) } })))).res.status === 200);
{
  const { res, body } = await run(json(base({ cv: { name: 'cv.pdf', type: 'application/pdf', bytes: pdf(MAX_CV_BYTES + 1) } })));
  check('CV over 4 MB: 413, nothing sent', res.status === 413 && body?.ok === false && body?.field === 'cv' && calls.length === 0, `${res.status} ${JSON.stringify(body)}`);
}
// Line breaks arrive as two characters (CRLF) but the box counts them as one: 1,000 typed characters still go through.
check('why of 1,000 characters with line breaks: ok', (await run(json(base({ why: 'x'.repeat(495) + '\r\n'.repeat(10) + 'x'.repeat(495) })))).res.status === 200);
// Workers Free allows 10 ms of CPU a request. Handling a 4 MB CV (parsing the form, encoding the file, building the
// email) has to stay well inside that; the slow way (spreading bytes into String.fromCharCode) took ~150 ms.
for (const js of [true, false]) {
  const req = json(base({ cv: { name: 'cv.pdf', type: 'application/pdf', bytes: pdf(MAX_CV_BYTES) } }), LIVE, { js });
  const fd = await req.clone().formData(); // warm the parser so the timing is the handler's own work
  const t = performance.now();
  const { res } = await run(req);
  const ms = performance.now() - t;
  check(`4 MB CV ${js ? 'with' : 'without'} JavaScript: handled in under 40 ms here`, (res.status === 200 || res.status === 303) && ms < 40, `${ms.toFixed(1)} ms, ${res.status}, ${fd.get('cv').size} bytes`);
}
// Resend says no, or isn't set up: the applicant is told it didn't send.
resendStatus = 429;
{
  const { res, body } = await run(json(base()));
  check('Resend refuses: 502 not ok', res.status === 502 && body?.ok === false, `${res.status}`);
}
resendStatus = 200;
{
  const { res, body } = await run(json(base()), {});
  check('no Resend key: 503 not ok, nothing sent', res.status === 503 && body?.ok === false && calls.length === 0, `${res.status}`);
}
check('GET: 405', (await run(new Request(LIVE))).res.status === 405);
// Without JavaScript: a normal multipart post, answered with a redirect.
{
  const fd = new FormData();
  for (const [k, v] of Object.entries(base())) if (k !== 'cv') fd.append(k, v);
  fd.append('cv', new File([small], 'my cv.pdf', { type: 'application/pdf' }));
  const { res } = await run(new Request(LIVE, { method: 'POST', body: fd }));
  check('no JavaScript, valid: 303 to /careers/thanks/', res.status === 303 && res.headers.get('location')?.endsWith('/careers/thanks/'), `${res.status} ${res.headers.get('location')}`);
  check('no JavaScript: CV attached byte for byte', Buffer.from(calls[0]?.body.attachments?.[0]?.content ?? '', 'base64').equals(small));
  const bad = new FormData();
  for (const [k, v] of Object.entries(base({ name: '' }))) if (k !== 'cv') bad.append(k, v);
  bad.append('cv', new File([small], 'cv.pdf', { type: 'application/pdf' }));
  const r2 = await run(new Request(LIVE, { method: 'POST', body: bad }));
  check('no JavaScript, invalid: 303 to /careers/not-sent/', r2.res.status === 303 && r2.res.headers.get('location')?.endsWith('/careers/not-sent/') && calls.length === 0);
}
// With careers switched off, the route doesn't exist.
check('showCareers off: 404', (await capture(applicationWith({ showCareers: false, showPrivacyPage: true }))(json(base()), env)).status === 404);
check('privacy page off: 404', (await capture(applicationWith({ showCareers: true, showPrivacyPage: false }))(json(base()), env)).status === 404);
// Logs: what happened and which role, never who.
const logText = logged.join('\n');
check('logs written', logged.length > 0 && logText.includes('"event":"application"'));
check('no personal details in logs', !logText.includes('test@example.com') && !logText.includes('Test Person') && !logText.includes('my cv'), logText.slice(0, 200));

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
