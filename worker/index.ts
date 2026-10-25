// Edge entry point for the Me² site (Cloudflare Workers static assets).
// Everything is a static file from dist/. This only makes sure every visitor ends up on
// https:// and the bare domain (no www), in a single 301, so search engines see one address.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isWww = url.hostname.startsWith('www.');
    // workers.dev and local previews are left alone; only real domains are redirected.
    const isRealDomain = !url.hostname.endsWith('.workers.dev') && url.hostname !== 'localhost';
    if (isRealDomain && (isWww || url.protocol === 'http:')) {
      url.protocol = 'https:';
      if (isWww) url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    // One canonical URL per page: /privacy -> /privacy/ as a permanent 301 (the asset handler's own redirect is a 307).
    const last = url.pathname.split('/').pop() ?? '';
    if ((request.method === 'GET' || request.method === 'HEAD') && last && !last.includes('.')) {
      const slashed = new URL(url);
      slashed.pathname += '/';
      const probe = await env.ASSETS.fetch(new Request(slashed, { method: 'HEAD' }));
      if (probe.ok) return Response.redirect(slashed.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
