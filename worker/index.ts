// Edge entry point for the Me² site (Cloudflare Workers static assets).
// Almost everything is a static file from dist/. The worker:
//  1. sends every visitor to https:// and the bare domain (no www), in a single 301;
//  2. stores completed assessment submissions in D1 (POST /api/assessments);
//  3. handles the enquiry form (POST /api/enquiry): checks it, drops bots, and emails it to
//     FORM_TO_EMAIL through Resend (its HTTP API; the RESEND_API_KEY secret, set in Cloudflare, see DEPLOY.md); and
//  4. handles job applications (POST /api/applications, ./applications.ts): emails each one, CV attached, to CAREERS_EMAIL.
// Data rule (BRIEF §6): the enquiry form takes contact details and a short message only; the careers form also takes a CV.
import { siteConfig } from '../src/config/site.config';
import { application } from './applications.ts';

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
    if (url.pathname === '/api/applications') return application(request, env);
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

  const receivedAt = new Date().toISOString();
  try {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO assessment_submissions (submission_id, receipt_id, received_at, candidate_name, candidate_email, candidate_location, assessment, completed_at, responses_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(submissionId, submissionId.slice(0, 8).toUpperCase(), receivedAt, name, email, location, assessmentName, completedAt, JSON.stringify(responses)).run();

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
