// Checks the website chat route (POST /api/chat in worker/chat.ts) without a network: the Anthropic API and Resend are
// stubbed, and each case builds the request the chat's page script sends. Spec: docs/chat.md.
// Usage: node scripts/check-chat.mjs
const { chatWith, systemPrompt } = await import('../worker/chat.ts');
const { MAX_TURNS } = await import('../worker/chat-limits.ts');
const { content } = await import('../src/content/site.ts');

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${detail})` : ''}`);
};

// One stub for both services: records each call, and answers Anthropic with the next queued reply.
let calls = [];
let replies = [];
const message = (content, stop_reason = 'end_turn') => ({
  id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-haiku-5-5', content, stop_reason, stop_sequence: null,
  usage: { input_tokens: 10, output_tokens: 10 },
});
const text = (t) => message([{ type: 'text', text: t }]);
const toolCall = (input) => message([{ type: 'tool_use', id: 'toolu_test', name: 'pass_to_team', input }], 'tool_use');
globalThis.fetch = async (url, init) => {
  const u = String(url instanceof Request ? url.url : url);
  const body = init?.body ? JSON.parse(String(init.body)) : null;
  calls.push({ url: u, body, headers: new Headers(init?.headers) });
  if (u.startsWith('https://api.resend.com/')) return Response.json({ id: 'test' });
  const next = replies.shift() ?? text('Hello.');
  if (typeof next === 'number') return Response.json({ type: 'error', error: { type: 'api_error', message: 'boom' } }, { status: next });
  return Response.json(next);
};
const anthropicCalls = () => calls.filter((c) => c.url.startsWith('https://api.anthropic.com/'));
const resendCalls = () => calls.filter((c) => c.url.startsWith('https://api.resend.com/'));

const logged = [];
const realLog = console.log;
const LIVE = 'https://mesquaredagency.com/api/chat';
const PREVIEW = 'https://abc123-mesquared.mesquared-site.workers.dev/api/chat';
const confirmed = [];
const chat = chatWith({ enableChat: true, sendEnquiryConfirmation: true }, async (to) => { confirmed.push(to); });
const env = (over = {}) => ({ ANTHROPIC_API_KEY: 'test-anthropic', RESEND_API_KEY: 'test-resend', ...over });
const turns = (...texts) => texts.map((t, i) => ({ role: i % 2 ? 'assistant' : 'user', content: t }));
const post = (payload, url = LIVE, headers = {}) =>
  new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', origin: new URL(url).origin, 'CF-Connecting-IP': '203.0.113.9', ...headers },
    body: JSON.stringify(payload),
  });
const run = async (req, { handler = chat, e = env(), queue = [] } = {}) => {
  calls = [];
  replies = [...queue];
  confirmed.length = 0;
  const waits = [];
  console.log = (...m) => logged.push(m.join(' '));
  try {
    const res = await handler(req, e, { waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
    return { res, body: await res.json().catch(() => null) };
  } finally {
    console.log = realLog;
  }
};

// A question gets the AI's answer, and the request to Anthropic is the one we mean to send.
{
  const { res, body } = await run(post({ messages: turns('How soon can you start?'), website: '' }), { queue: [text('Within 2 weeks of you saying yes.')] });
  check('question: 200 with the reply', res.status === 200 && body?.ok && body.reply === 'Within 2 weeks of you saying yes.', `${res.status} ${JSON.stringify(body)}`);
  const a = anthropicCalls()[0];
  check('one call to the Messages API with the key as x-api-key', anthropicCalls().length === 1 && a.url.endsWith('/v1/messages') && a.headers.get('x-api-key') === 'test-anthropic');
  check('model is Claude Haiku 5.5, low effort', a?.body.model === 'claude-haiku-5-5' && a.body.output_config?.effort === 'low', JSON.stringify(a?.body.model));
  check('the conversation is sent as given', JSON.stringify(a?.body.messages) === JSON.stringify(turns('How soon can you start?')));
  check('system prompt is cached and built from the page copy', a?.body.system?.[0]?.cache_control?.type === 'ephemeral' && a.body.system[0].text.includes('Within 2 weeks of you saying yes.'));
  const tool = a?.body.tools?.[0];
  check('one strict pass_to_team tool', a?.body.tools?.length === 1 && tool.name === 'pass_to_team' && tool.strict === true && tool.input_schema.additionalProperties === false);
  check('no Resend email for a plain question', resendCalls().length === 0);
}

// The system prompt: says it's an AI, keeps to the facts, and has no placeholders left in it.
{
  const s = systemPrompt();
  check('prompt: says it is an AI, not a person', s.includes('You are an AI, not a person'));
  check('prompt: placeholders filled', !/\{[A-Z_]+\}/.test(s) && s.includes('Me²') && s.includes('hello@mesquaredagency.com'));
  check('prompt: no prices or figures beyond the facts', s.includes('No prices, figures, discounts or promises beyond the facts.'));
  check('prompt: people first, never AI on its own', s.includes('never describe Me² as an AI service, and never offer AI on its own.'));
  check('prompt: a main contact, with specialists doing the work in each field', s.includes('as their main contact') && s.includes("done by Me²'s specialist in it") && s.includes('Never say one person does everything'));
  check('prompt: property management only when asked, never as our market', s.includes('a specialist in property management admin') && s.includes("Don't bring it up yourself"));
  check('prompt: "dedicated", never "working exclusively"', s.includes('as their main contact, dedicated to them') && !/working exclusively/.test(s));
  check('prompt: the data rule', s.includes('Never ask for or accept financial, health or identity information'));
}

// Details confirmed: the AI calls pass_to_team, the details go to hello@, and the page is told it's done.
const details = { name: 'Zelda Visitor', email: 'zelda@example.com', need: 'Chasing overdue invoices XYZZY.', business: 'Zelda Co', phone: '0400 000 000', callback: 'Tuesday morning' };
{
  const { res, body } = await run(post({ messages: turns('Please pass my details on.') }), { queue: [toolCall(details)] });
  check('pass-on: fixed confirmation, done', res.status === 200 && body?.ok && body.done === true && body.reply === content.chat.passedOn, JSON.stringify(body));
  const r = resendCalls();
  check('pass-on: one email to hello@, Reply-To the visitor', r.length === 1 && JSON.stringify(r[0].body.to) === '["hello@mesquaredagency.com"]' && r[0].body.reply_to === 'zelda@example.com', JSON.stringify(r[0]?.body.to));
  check('pass-on: from the website address, subject names the chat', r[0]?.body.from === 'Me Squared website <website@mesquaredagency.com>' && r[0].body.subject === 'Website chat: Zelda Visitor', `${r[0]?.body.from} / ${r[0]?.body.subject}`);
  check('pass-on: every detail in the email', ['Chasing overdue invoices XYZZY.', 'Zelda Co', '0400 000 000', 'Tuesday morning'].every((t) => r[0]?.body.text.includes(t)));
  check('pass-on: the email says only these details are kept', r[0]?.body.text.includes('Only these details are kept, not the conversation.'));
  check('pass-on: live site sends the visitor the usual confirmation', JSON.stringify(confirmed) === '["zelda@example.com"]', JSON.stringify(confirmed));
}
{
  const { body } = await run(post({ messages: turns('Please pass my details on.') }, PREVIEW), { queue: [toolCall(details)] });
  const r = resendCalls();
  check('preview: email marked [Preview], no confirmation to the visitor', body?.done && r[0]?.body.subject === '[Preview] Website chat: Zelda Visitor' && confirmed.length === 0);
}
{
  const { body } = await run(post({ messages: turns('Pass it on.') }), { queue: [toolCall({ ...details, email: 'not-an-email' })] });
  check('pass-on with a bad email: nothing sent, the page says to email instead', body?.ok && !body.done && body.reply.includes('hello@mesquaredagency.com') && resendCalls().length === 0, JSON.stringify(body));
}

// Things that go wrong.
{
  const { res, body } = await run(post({ messages: turns('Hi') }), { queue: [message([], 'refusal')] });
  check('refusal: fixed reply that points to a person', res.status === 200 && body?.reply?.includes('hello@mesquaredagency.com'), JSON.stringify(body));
}
{
  const { res, body } = await run(post({ messages: turns('Hi') }), { queue: [500, 500] });
  check('API error: 502, the page shows its own fallback', res.status === 502 && body?.ok === false, `${res.status} ${JSON.stringify(body)}`);
}
{
  const { res } = await run(post({ messages: turns('Hi') }), { e: env({ ANTHROPIC_API_KEY: undefined }) });
  check('no API key yet: 503, no call made', res.status === 503 && calls.length === 0, String(res.status));
}
{
  const limited = { CHAT_LIMIT: { limit: async () => ({ success: false }) } };
  const { res } = await run(post({ messages: turns('Hi') }), { e: env(limited) });
  check('rate limited: 429, no call made', res.status === 429 && calls.length === 0, String(res.status));
}
{
  const { res } = await run(post({ messages: turns('Hi') }, LIVE, { origin: 'https://example.com' }));
  check('another site: 403, no call made', res.status === 403 && calls.length === 0, String(res.status));
}
{
  const { res } = await run(post({ messages: turns('Hi'), website: 'spam.example' }));
  check('hidden field filled (a bot): 400, no call made', res.status === 400 && calls.length === 0, String(res.status));
}
for (const [name, messages] of [
  ['the assistant first', [{ role: 'assistant', content: 'Hi' }]],
  ['ending on the assistant', turns('Hi', 'Hello')],
  ['an empty message', turns('   ')],
  ['a message over 1,000 characters', turns('x'.repeat(1001))],
  ['too many turns', turns(...Array.from({ length: MAX_TURNS * 2 + 1 }, (_, i) => `m${i}`))],
  ['not a list', 'Hi'],
]) {
  const { res } = await run(post({ messages }));
  check(`refused: ${name}`, res.status === 400 && calls.length === 0, String(res.status));
}
{
  const { res } = await run(new Request(LIVE, { method: 'GET' }));
  check('GET: 405', res.status === 405);
  const off = chatWith({ enableChat: false, sendEnquiryConfirmation: true }, async () => {});
  const { res: r2 } = await run(post({ messages: turns('Hi') }), { handler: off });
  check('enableChat off: 404', r2.status === 404 && calls.length === 0);
}

// The logs say what happened, never what anyone wrote or who they are.
check('logs carry no personal details or messages', logged.length > 0 && !logged.some((l) => /Zelda|zelda@|XYZZY|0400|How soon/.test(l)), logged.find((l) => /Zelda|XYZZY/.test(l)));

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll chat checks passed.');
process.exit(failed ? 1 : 0);
