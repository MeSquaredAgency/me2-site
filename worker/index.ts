// Edge entry point for the Me² site (Cloudflare Workers static assets).
// Almost everything is a static file from dist/. The worker:
//  1. sends every visitor to https:// and the bare domain (no www), in a single 301;
//  2. stores completed assessment submissions in D1 (POST /api/assessments); and
//  3. handles the enquiry form (POST /api/enquiry): checks it, drops bots, and emails it to
//     FORM_TO_EMAIL through Resend (its HTTP API; the RESEND_API_KEY secret, set in Cloudflare, see DEPLOY.md).
// Data rule (BRIEF §6): the form takes contact details and a short message only.
import { siteConfig } from '../src/config/site.config';

interface AssessmentPreparedStatement {
  bind(...values: unknown[]): AssessmentPreparedStatement;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface AssessmentDatabase {
  prepare(query: string): AssessmentPreparedStatement;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: AssessmentDatabase;
  /** Resend API key (a Worker secret, never in the code). Missing until it's set in Cloudflare (DEPLOY.md). */
  RESEND_API_KEY?: string;
}

const LIMITS = { name: 100, email: 254, message: 2000, topic: 120, source: 60 };
// Real people take longer than this to type a message; most form bots don't.
const MIN_FILL_MS = 2500;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isWww = url.hostname.startsWith('www.');
    // workers.dev and local previews are left alone; only real domains are redirected.
    const isRealDomain = !url.hostname.endsWith('.workers.dev') && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1';
    if (isRealDomain && (isWww || url.protocol === 'http:')) {
      url.protocol = 'https:';
      if (isWww) url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/assessments') return assessment(request, env);
    if (url.pathname === '/api/enquiry') return enquiry(request, env);
    return env.ASSETS.fetch(request);
  },
};


async function assessment(request: Request, env: Env): Promise<Response> {
  const json = (payload: Record<string, unknown>, status = 200) =>
    Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const url = new URL(request.url);
  // Branch preview deployments share this Worker configuration. Restrict storage to the live site.
  if (url.hostname !== 'mesquaredagency.com' || request.headers.get('Origin') !== url.origin) {
    return json({ ok: false, error: 'origin_not_allowed' }, 403);
  }
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return json({ ok: false, error: 'json_required' }, 415);
  }

  const maxBytes = 48 * 1024;
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maxBytes) return json({ ok: false, error: 'request_too_large' }, 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: 'invalid_request' }, 400);
  }
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return json({ ok: false, error: 'request_too_large' }, 413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ ok: false, error: 'invalid_request' }, 400);
  const data = parsed as Record<string, unknown>;
  const candidate = data.candidate;
  const responses = data.responses;
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) ||
      !responses || typeof responses !== 'object' || Array.isArray(responses)) {
    return json({ ok: false, error: 'invalid_request' }, 400);
  }

  const clean = (value: unknown, max: number) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const submissionId = clean(data.submissionId, 64);
  const candidateData = candidate as Record<string, unknown>;
  const name = clean(candidateData.name, 120);
  const email = clean(candidateData.email, 254).toLowerCase();
  const location = clean(candidateData.location, 160);
  const assessmentName = clean(data.assessment, 160);
  const completedAt = clean(data.completedAt, 40) || null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId) ||
      !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !location || !assessmentName) {
    return json({ ok: false, error: 'invalid_submission' }, 400);
  }
  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);

  const storedResponses = { ...(responses as Record<string, unknown>) };
  // Scores are always recomputed on the server; ignore browser-supplied scoring or reviewer fields.
  delete storedResponses.results;
  delete storedResponses.review;
  storedResponses.results = scoreAssessment(storedResponses);

  const receivedAt = new Date().toISOString();
  try {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO assessment_submissions (submission_id, receipt_id, received_at, candidate_name, candidate_email, candidate_location, assessment, completed_at, responses_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(submissionId, submissionId.slice(0, 8).toUpperCase(), receivedAt, name, email, location, assessmentName, completedAt, JSON.stringify(storedResponses)).run();

    const saved = await env.DB.prepare(
      'SELECT receipt_id, received_at FROM assessment_submissions WHERE submission_id = ?'
    ).bind(submissionId).first<{ receipt_id: string; received_at: string }>();
    if (!saved) throw new Error('submission_readback_missing');

    return json({ ok: true, receiptId: saved.receipt_id, receivedAt: saved.received_at });
  } catch {
    // Never log candidate details or their assessment answers.
    console.log(JSON.stringify({ event: 'assessment_submission', result: 'storage_failed' }));
    return json({ ok: false, error: 'storage_failed' }, 503);
  }
}

function scoreAssessment(answers: Record<string, unknown>) {
  const currentKeys = ['patelAmount', 'taylorAmount', 'doyleAmount', 'rentTotal', 'planAction', 'riskyLines', 'queueOrder', 'quoteMove', 'typingCompleted', 'typingText'];
  if (currentKeys.some((key) => !(key in answers)) || answers.typingCompleted !== true) {
    return { available: false, reason: 'This submission predates the scored work-sample version.' };
  }

  const amountItems: Array<[string, string, number]> = [
    ['Patel rent overdue', 'patelAmount', 160],
    ['Taylor rent overdue', 'taylorAmount', 630],
    ['Doyle rent overdue', 'doyleAmount', 980],
    ['Total rent overdue', 'rentTotal', 1770],
  ];
  const amountDetails = amountItems.map(([label, key, expected]) => {
    const actual = Number(answers[key]);
    const correct = Number.isFinite(actual) && Math.abs(actual - expected) < 0.011;
    return { label, answer: String(answers[key] ?? ''), expected: '
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  // The page's script posts JSON and shows the result in place; without JavaScript the browser posts the form
  // and lands on a thank-you (or not-sent) page.
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const done = (ok: boolean, status = ok ? 200 : 400) =>
    wantsJson
      ? Response.json({ ok }, { status })
      : Response.redirect(new URL(ok ? '/thanks/' : '/not-sent/', request.url).toString(), 303);

  let data: Record<string, string> = {};
  try {
    if ((request.headers.get('content-type') ?? '').includes('application/json')) {
      data = Object.fromEntries(Object.entries((await request.json()) as Record<string, unknown>).map(([k, v]) => [k, String(v ?? '')]));
    } else {
      data = Object.fromEntries([...(await request.formData()).entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
    }
  } catch {
    return done(false);
  }

  // Bots: a hidden field people never see, and a form filled faster than anyone can type. Pretend it worked.
  const startedAt = Number(data.started);
  if (data.website || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    console.log(JSON.stringify({ event: 'enquiry', result: 'dropped' }));
    return done(true);
  }

  const clean = (v: string | undefined, max: number) => (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const message = (data.message ?? '').trim();
  const topic = clean(data.topic, LIMITS.topic) || 'General enquiry';
  const source = clean(data.source, LIMITS.source) || 'unknown';
  const valid = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message && message.length <= LIMITS.message;
  if (!valid) return done(false);

  if (!env.RESEND_API_KEY) {
    console.log(JSON.stringify({ event: 'enquiry', result: 'not-configured', topic, source }));
    return done(false, 503);
  }

  const text = [`${topic}`, '', message, '', '—', `From: ${name} <${email}>`, `Sent from: ${source} on ${new URL(request.url).hostname}`].join('\n');
  const html = `<p><strong>${esc(topic)}</strong></p><p style="white-space:pre-wrap">${esc(message)}</p><hr><p>From: ${esc(name)} &lt;${esc(email)}&gt;<br>Sent from: ${esc(source)} on ${esc(new URL(request.url).hostname)}</p><p style="color:#666">Reply to this email to answer them directly.</p>`;
  // Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email). The sender's name uses the
  // plain spelling, which every mail program shows correctly; Reply-To is the visitor's checked address only.
  let failed = '';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${siteConfig.SITE_NAME_PLAIN} website <${siteConfig.FORM_FROM_EMAIL}>`,
        to: [siteConfig.FORM_TO_EMAIL],
        reply_to: email,
        subject: `Website enquiry: ${topic} (${name})`,
        text,
        html,
      }),
    });
    if (!res.ok) failed = `http-${res.status} ${((await res.json().catch(() => ({}))) as { name?: string }).name ?? ''}`.trim();
  } catch (e) {
    failed = String(e);
  }
  if (failed) {
    // No personal details in logs: just what failed.
    console.log(JSON.stringify({ event: 'enquiry', result: 'send-failed', code: failed, topic, source }));
    return done(false, 502);
  }
  console.log(JSON.stringify({ event: 'enquiry', result: 'sent', topic, source }));
  return done(true);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
 + expected.toFixed(2), correct };
  });
  const numbers = amountDetails.filter((item) => item.correct).length * 5;

  const riskItems: Array<[string, string]> = [
    ['blame', 'Unverified blame and payment responsibility'],
    ['alarm', 'Claim that all alarms passed'],
    ['private', 'Private financial detail'],
    ['maintenance', 'Claim that no maintenance is needed'],
  ];
  const selectedLines = Array.isArray(answers.riskyLines) ? answers.riskyLines.map(String) : [];
  const detailItems = riskItems.map(([key, label]) => ({
    label,
    answer: selectedLines.includes(key) ? 'Flagged' : 'Not flagged',
    expected: 'Flag',
    correct: selectedLines.includes(key),
  }));
  const detail = detailItems.filter((item) => item.correct).length * 5;

  const order = Array.isArray(answers.queueOrder) ? answers.queueOrder.map(String) : [];
  const priorityChecks: Array<[string, string, string]> = [
    ['leak', 'rent', 'Start with the active leak before the 11:00 check-in'],
    ['leak', 'hotwater', 'Start with the active leak before the no-hot-water issue'],
    ['leak', 'report', 'Start with the active leak before the owner report'],
    ['rent', 'report', 'Meet the 11:00 check-in before the owner report due today'],
    ['hotwater', 'report', 'Address the long-running hot-water issue before the owner report'],
  ];
  const priorityDetails = priorityChecks.map(([first, second, label]) => {
    const correct = order.indexOf(first) >= 0 && order.indexOf(second) >= 0 && order.indexOf(first) < order.indexOf(second);
    return { label, answer: correct ? 'In this order' : 'Order differs', expected: 'In this order', correct };
  });
  const prioritization = priorityDetails.filter((item) => item.correct).length * 3;

  const authorityItems = [
    { label: 'Keep the agreed instalment separate from rent arrears', answer: String(answers.planAction ?? ''), expected: 'separate', correct: answers.planAction === 'separate' },
    { label: 'Escalate the $2,400 permanent repair quote', answer: String(answers.quoteMove ?? ''), expected: 'escalate', correct: answers.quoteMove === 'escalate' },
  ];
  const authority = authorityItems.filter((item) => item.correct).length * 5;

  // Recalculate typing metrics from the submitted text rather than trusting browser-provided WPM.
  const passage = 'On busy mornings, I stay calm, check what needs attention first, and communicate clear next steps. I keep accurate notes, protect private information, and follow through on each promise. ';
  const typed = String(answers.typingText ?? '').slice(0, 1000);
  const expected = passage.repeat(Math.ceil(typed.length / passage.length)).slice(0, typed.length);
  const errors = editDistance(typed, expected);
  const correctCharacters = Math.max(0, typed.length - errors);
  const accuracy = typed.length ? correctCharacters / typed.length * 100 : 0;
  const grossWpm = typed.length / 5;
  const netWpm = correctCharacters / 5;
  const typing = Math.min(6, netWpm / 50 * 6) + Math.min(4, accuracy / 98 * 4);
  const typingMetrics = {
    characters: typed.length,
    correctCharacters,
    accuracy: Math.round(accuracy * 10) / 10,
    grossWpm: Math.round(grossWpm * 10) / 10,
    netWpm: Math.round(netWpm * 10) / 10,
  };

  const domains = [
    { key: 'numbers', label: 'Numbers & accuracy', earned: numbers, possible: 20, details: amountDetails },
    { key: 'detail', label: 'Detail & safe judgment', earned: detail, possible: 20, details: detailItems },
    { key: 'prioritization', label: 'Prioritization', earned: prioritization, possible: 15, details: priorityDetails },
    { key: 'authority', label: 'Authority & escalation', earned: authority, possible: 10, details: authorityItems },
    { key: 'typing', label: 'Typing', earned: typing, possible: 10, details: typingMetrics },
  ];
  const earned = Math.round(domains.reduce((sum, domain) => sum + domain.earned, 0) * 10) / 10;
  return {
    available: true,
    version: 'me2-cco-v6',
    earned,
    possible: 75,
    domains,
    note: 'Objective work-sample signals only. Written responses and working-style preferences require human review and are not an automatic pass/fail.',
  };
}

function editDistance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

async function enquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  // The page's script posts JSON and shows the result in place; without JavaScript the browser posts the form
  // and lands on a thank-you (or not-sent) page.
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const done = (ok: boolean, status = ok ? 200 : 400) =>
    wantsJson
      ? Response.json({ ok }, { status })
      : Response.redirect(new URL(ok ? '/thanks/' : '/not-sent/', request.url).toString(), 303);

  let data: Record<string, string> = {};
  try {
    if ((request.headers.get('content-type') ?? '').includes('application/json')) {
      data = Object.fromEntries(Object.entries((await request.json()) as Record<string, unknown>).map(([k, v]) => [k, String(v ?? '')]));
    } else {
      data = Object.fromEntries([...(await request.formData()).entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
    }
  } catch {
    return done(false);
  }

  // Bots: a hidden field people never see, and a form filled faster than anyone can type. Pretend it worked.
  const startedAt = Number(data.started);
  if (data.website || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    console.log(JSON.stringify({ event: 'enquiry', result: 'dropped' }));
    return done(true);
  }

  const clean = (v: string | undefined, max: number) => (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const message = (data.message ?? '').trim();
  const topic = clean(data.topic, LIMITS.topic) || 'General enquiry';
  const source = clean(data.source, LIMITS.source) || 'unknown';
  const valid = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message && message.length <= LIMITS.message;
  if (!valid) return done(false);

  if (!env.RESEND_API_KEY) {
    console.log(JSON.stringify({ event: 'enquiry', result: 'not-configured', topic, source }));
    return done(false, 503);
  }

  const text = [`${topic}`, '', message, '', '—', `From: ${name} <${email}>`, `Sent from: ${source} on ${new URL(request.url).hostname}`].join('\n');
  const html = `<p><strong>${esc(topic)}</strong></p><p style="white-space:pre-wrap">${esc(message)}</p><hr><p>From: ${esc(name)} &lt;${esc(email)}&gt;<br>Sent from: ${esc(source)} on ${esc(new URL(request.url).hostname)}</p><p style="color:#666">Reply to this email to answer them directly.</p>`;
  // Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email). The sender's name uses the
  // plain spelling, which every mail program shows correctly; Reply-To is the visitor's checked address only.
  let failed = '';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${siteConfig.SITE_NAME_PLAIN} website <${siteConfig.FORM_FROM_EMAIL}>`,
        to: [siteConfig.FORM_TO_EMAIL],
        reply_to: email,
        subject: `Website enquiry: ${topic} (${name})`,
        text,
        html,
      }),
    });
    if (!res.ok) failed = `http-${res.status} ${((await res.json().catch(() => ({}))) as { name?: string }).name ?? ''}`.trim();
  } catch (e) {
    failed = String(e);
  }
  if (failed) {
    // No personal details in logs: just what failed.
    console.log(JSON.stringify({ event: 'enquiry', result: 'send-failed', code: failed, topic, source }));
    return done(false, 502);
  }
  console.log(JSON.stringify({ event: 'enquiry', result: 'sent', topic, source }));
  return done(true);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
