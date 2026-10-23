// Job applications (POST /api/applications): checks an application from a careers page and emails it, CV attached,
// to CAREERS_EMAIL through Resend. Spec: docs/superpowers/specs/2026-10-16-careers-design.md; docs/careers.md.
// The form is always posted as multipart: by the page's script (with Accept: application/json, answered with
// { ok, field? }), or by the browser itself without JavaScript (answered with a redirect to /careers/thanks/ or
// /careers/not-sent/). The CV is encoded with the built-in toBase64(), which keeps a 4 MB CV well inside
// Workers Free's 10 ms of CPU. Logs say what happened and for which role, never who.
import { findRole } from '../src/content/careers.ts';
import { siteConfig } from '../src/config/site.config.ts';
import { flags } from '../src/config/flags.ts';
import { sender } from './email.ts';

export interface ApplicationEnv {
  /** Resend API key (a Worker secret, never in the code). See DEPLOY.md. */
  RESEND_API_KEY?: string;
}

export const MAX_CV_BYTES = 4 * 1024 * 1024;
// Real people take longer than this to fill in a form; most form bots don't.
const MIN_FILL_MS = 2500;
const MAX_BODY = 6_000_000;
const LIMITS = { name: 100, email: 254, phone: 60, location: 160, linkedin: 300, workLinks: 1000, why: 1000 };
// The first bytes of each kind of file we accept: PDF, Word (.docx, a zip), and old Word (.doc).
const SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  docx: [0x50, 0x4b, 0x03, 0x04],
  doc: [0xd0, 0xcf, 0x11, 0xe0],
};

type Fields = Record<string, string>;
interface Cv { name: string; base64: string; size: number; head: Uint8Array }

export function applicationWith(on: { showCareers: boolean; showPrivacyPage: boolean }) {
  return async (request: Request, env: ApplicationEnv): Promise<Response> => {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    if (!on.showCareers || !on.showPrivacyPage) return new Response('Not found', { status: 404 });

    const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
    // field: 'cv' when the CV itself was refused, so the page can say so under the CV field.
    const done = (ok: boolean, status = ok ? 200 : 400, field?: 'cv') =>
      wantsJson
        ? Response.json(field ? { ok, field } : { ok }, { status, headers: { 'Cache-Control': 'no-store' } })
        : Response.redirect(new URL(ok ? '/careers/thanks/' : '/careers/not-sent/', request.url).toString(), 303);
    const log = (result: string, role: string, extra: Record<string, string> = {}) =>
      console.log(JSON.stringify({ event: 'application', result, role, ...extra }));

    if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return done(false, 413);

    let data: Fields;
    let cv: Cv | null;
    try {
      ({ data, cv } = await fromForm(await request.formData()));
    } catch {
      log('invalid', 'unknown');
      return done(false);
    }

    const role = findRole(data.role ?? '');
    const roleSlug = role?.slug ?? 'unknown';
    // Bots: a hidden field people never see, and a form filled faster than anyone can type. Pretend it worked.
    const startedAt = Number(data.started);
    if (data.website || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
      log('dropped', roleSlug);
      return done(true);
    }

    const name = clean(data.name, LIMITS.name);
    const email = clean(data.email, LIMITS.email);
    const phone = clean(data.phone, LIMITS.phone);
    const location = clean(data.location, LIMITS.location);
    const linkedin = clean(data.linkedin, LIMITS.linkedin);
    // Browsers send each line break as two characters; the box counted it as one.
    const workLinks = (data.workLinks ?? '').replace(/\r\n?/g, '\n').trim();
    const why = (data.why ?? '').replace(/\r\n?/g, '\n').trim();
    const valid = role && name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && location &&
      why && why.length <= LIMITS.why && workLinks.length <= LIMITS.workLinks && (!role.needsWorkLinks || workLinks);
    if (!valid) {
      log('invalid', roleSlug);
      return done(false);
    }

    const ext = cvKind(cv);
    if (!cv || !ext) {
      log('invalid', roleSlug, { code: 'cv' });
      return done(false, 400, 'cv');
    }
    if (cv.size > MAX_CV_BYTES) {
      log('invalid', roleSlug, { code: 'cv-too-large' });
      return done(false, 413, 'cv');
    }

    if (!env.RESEND_API_KEY) {
      log('not-configured', roleSlug);
      return done(false, 503);
    }

    const host = new URL(request.url).hostname;
    const preview = host !== siteConfig.SITE_DOMAIN;
    const filename = `${`CV ${name}`.replace(/[^A-Za-z0-9 ._-]/g, '').replace(/\s+/g, ' ').trim() || 'CV'}.${ext}`;
    const rows: [string, string][] = [
      ['Name', name],
      ['Email', email],
      ['Phone or Telegram', phone || 'Not given'],
      ['Based in', location],
      ['LinkedIn', linkedin || 'Not given'],
      ...(role.needsWorkLinks || workLinks ? [['Work links', workLinks] as [string, string]] : []),
    ];
    const text = [role.title, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', 'Why this role?', why, '', '—',
      `CV attached: ${filename} (${Math.ceil(cv.size / 1024)} KB)`, `Sent from: the careers page on ${host}`].join('\n');
    const html = `<p><strong>${esc(role.title)}</strong></p><p>${rows.map(([k, v]) => `${esc(k)}: ${esc(v)}`).join('<br>')}</p>` +
      `<p><strong>Why this role?</strong></p><p style="white-space:pre-wrap">${esc(why)}</p><hr>` +
      `<p>CV attached: ${esc(filename)} (${Math.ceil(cv.size / 1024)} KB)<br>Sent from: the careers page on ${esc(host)}</p>` +
      `<p style="color:#666">Reply to this email to answer them directly.</p>`;

    // Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email). Reply-To is the applicant's checked address.
    let failed = '';
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: sender(`${siteConfig.SITE_NAME} careers`, siteConfig.FORM_FROM_EMAIL),
          to: [siteConfig.CAREERS_EMAIL],
          reply_to: email,
          subject: `${preview ? '[Preview] ' : ''}Application: ${role.title} (${name})`,
          text,
          html,
          attachments: [{ filename, content: cv.base64 }],
        }),
      });
      if (!res.ok) failed = `http-${res.status} ${((await res.json().catch(() => ({}))) as { name?: string }).name ?? ''}`.trim();
    } catch (e) {
      failed = String(e);
    }
    if (failed) {
      log('send-failed', roleSlug, { code: failed });
      return done(false, 502);
    }
    log('sent', roleSlug);
    return done(true);
  };
}

export const application = applicationWith(flags);

/** The posted form: every field as a string, and the CV file base64-encoded (only when it's within the size limit). */
async function fromForm(form: FormData): Promise<{ data: Fields; cv: Cv | null }> {
  const data: Fields = {};
  let cv: Cv | null = null;
  for (const [k, v] of form.entries()) {
    if (typeof v === 'string') data[k] = v;
    else if (k === 'cv' && v.size > 0) {
      const head = new Uint8Array(await v.slice(0, 8).arrayBuffer());
      cv = { name: v.name, base64: v.size > MAX_CV_BYTES ? '' : new Uint8Array(await v.arrayBuffer()).toBase64(), size: v.size, head };
    }
  }
  return { data, cv };
}

/** The CV's kind (its extension), when the name and the file's first bytes agree on PDF, DOCX or DOC. */
function cvKind(cv: Cv | null): string | null {
  if (!cv || cv.size === 0) return null;
  const ext = cv.name.toLowerCase().match(/\.(pdf|docx|doc)$/)?.[1];
  if (!ext) return null;
  return SIGNATURES[ext].every((b, i) => cv.head[i] === b) ? ext : null;
}

function clean(v: string | undefined, max: number) {
  return (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
