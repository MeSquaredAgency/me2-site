// Edge entry point for the Me² site (Cloudflare Workers static assets).
// Almost everything is a static file from dist/. The worker:
//  1. sends every visitor to https:// and the bare domain (no www), in a single 301;
//  2. handles the enquiry form (POST /api/enquiry): checks it, drops bots, and emails it to
//     FORM_TO_EMAIL through Resend (its HTTP API; the RESEND_API_KEY secret, set in Cloudflare, see DEPLOY.md).
// Data rule (BRIEF §6): the form takes contact details and a short message only.
import { siteConfig } from '../src/config/site.config';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
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
    if (url.pathname === '/api/enquiry') return enquiry(request, env);
    return env.ASSETS.fetch(request);
  },
};

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
