// The chat's relay to Anthropic (Worker "mesquared-chat-relay"). The site Worker runs at the visitor's nearest
// Cloudflare data centre, and the Anthropic API refuses calls from some of them (Hong Kong: 403), so worker/chat.ts
// sends its API calls here through a service binding, and this Worker, pinned to US East (relay/wrangler.jsonc),
// passes them on. EC, 5 Nov 2026: keeps the pages at the edge and only the chat's calls in the US.
// It has no public URL; only the site Worker can reach it. It forwards the Messages API and nothing else.
const UPSTREAM = 'https://api.anthropic.com';
const ALLOWED = new Set(['/v1/messages']);

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== 'POST' || !ALLOWED.has(url.pathname)) return new Response('Not found', { status: 404 });
    return fetch(new Request(UPSTREAM + url.pathname + url.search, request));
  },
};
