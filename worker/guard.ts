// Abuse controls shared by the form, careers, assessment and chat routes (security audit, 2 Nov 2026).
// None of this stops a determined script on its own; together they stop the cheap ways to make the site send
// email or spend the Anthropic key: another site posting into ours, one address sending hundreds of requests,
// and posts that skip the page's own fill timer.

/** A Workers rate limiting binding (wrangler.jsonc `ratelimits`). Optional, so local checks run without one. */
export interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Who is asking, for rate limits: the IPv4 address, or the first four groups (/64) of an IPv6 address, since one
 * home or server is usually given a whole /64 and can rotate through it freely.
 */
export function clientKey(request: Request): string {
  const ip = (request.headers.get('CF-Connecting-IP') ?? '').trim();
  if (!ip.includes(':')) return ip || 'unknown';
  // Expand "::" so the first four groups are real groups, then keep them.
  const [head, tail = ''] = ip.toLowerCase().split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = ip.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
  return `${groups.slice(0, 4).map((g) => g || '0').join(':')}::/64`;
}

/** True when the binding allows one more request from this client on this route (or there is no binding). */
export async function allowed(limit: RateLimit | undefined, route: string, request: Request): Promise<boolean> {
  if (!limit) return true;
  return (await limit.limit({ key: `${route}:${clientKey(request)}` })).success;
}

/**
 * True when the request came from one of this site's own pages. Browsers send Origin on every POST, including a
 * plain form post without JavaScript; an older browser may leave it out but still sends a Referer from our page.
 */
export function fromOurPage(request: Request): boolean {
  const origin = new URL(request.url).origin;
  const sent = request.headers.get('Origin');
  if (sent) return sent === origin;
  const referer = request.headers.get('Referer');
  return !!referer && referer.startsWith(`${origin}/`);
}

// Real people take longer than this to fill in a form; most form bots don't.
export const MIN_FILL_MS = 2500;
// A form left open longer than this is stale (or the number was made up).
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

/**
 * The page's fill timer: 'ok', 'bot' (filled too fast, or a made-up time), or 'missing'. The page script sets it,
 * so it is only ever missing when JavaScript didn't run: a real visitor's plain form post, or a script.
 */
export function fillTime(started: string | undefined, now = Date.now()): 'ok' | 'bot' | 'missing' {
  if (!started) return 'missing';
  const at = Number(started);
  if (!Number.isFinite(at)) return 'bot';
  const took = now - at;
  return took >= MIN_FILL_MS && took <= MAX_FILL_MS ? 'ok' : 'bot';
}

/** A short label (a topic or source) as it may appear in an email subject and the logs: words and simple punctuation only. */
export function label(value: string | undefined, max: number): string {
  return (value ?? '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{N} ²&'’(),.:/-]/gu, ' ')
    .replace(/https?:|www\./gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

/** Signs and checks the assistant's replies in the chat, so a script can't put words in its mouth. */
export async function signer(secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(`me2-chat-reply:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  return {
    sign: async (text: string) => hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text.trim()))),
    check: async (text: string, sig: unknown) => {
      if (typeof sig !== 'string' || !/^[0-9a-f]{64}$/.test(sig)) return false;
      const bytes = new Uint8Array(sig.match(/../g)!.map((h) => parseInt(h, 16)));
      return crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(text.trim()));
    },
  };
}

/** Reads a request body, giving up once it passes `max` bytes whatever Content-Length said (a chunked upload has none). */
export async function readCapped(request: Request, max: number): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    parts.push(value);
  }
  const out = new Uint8Array(size);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.byteLength;
  }
  return out;
}
