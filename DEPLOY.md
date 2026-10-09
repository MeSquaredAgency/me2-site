# Putting the site online (Cloudflare Pages)

Nothing has been deployed yet. Wrangler on the build PC is signed in to the APN Real Estate Cloudflare account, which is the wrong account for Me², so the site was built and checked locally only. Do these steps signed in as **tech@mesquaredagency.com** (the business's own account, not a personal or agency one).

## 1. One-off setup
Sign out of the APN Real Estate account first, then sign in as tech@mesquaredagency.com:

```bash
npx wrangler logout
```

```bash
npx wrangler login
```

```bash
npx wrangler whoami
```

Check `whoami` shows tech@mesquaredagency.com, then create the Pages project:

```bash
npx wrangler pages project create mesquared --production-branch main
```

## 2. Preview deploy (safe, not the live address)
```bash
npm run build
```

```bash
npx wrangler pages deploy dist --project-name mesquared --branch preview
```

Wrangler prints a `preview.mesquared.pages.dev` address. Check it on a phone and a laptop.

## 3. Production deploy
Only after EC has approved the preview:

```bash
npx wrangler pages deploy dist --project-name mesquared --branch main
```

Later, connect the GitHub repo in the Cloudflare dashboard (Pages → mesquared → Settings → Builds) with build command `npm run build` and output directory `dist`. After that, merging to `main` deploys automatically, so changes go through branches and pull requests.

## 4. The domain
In the Cloudflare dashboard: Pages → mesquared → Custom domains → add `mesquaredagency.com` and `www.mesquaredagency.com`, then add a redirect rule sending `www` to the bare domain (301).

- Cloudflare Pages can only serve the bare domain when the domain's DNS is on Cloudflare. mesquaredagency.com already answers through Cloudflare, so first check which Cloudflare account the zone is in. If it isn't tech@mesquaredagency.com, move it there.
- **Email first.** The domain runs Google Workspace email. Before changing nameservers or deleting any records, copy every existing DNS record: MX, SPF (TXT `v=spf1…`), DKIM (`google._domainkey`), DMARC (`_dmarc`) and any verification TXT records. Keep exactly one SPF record. Straight after any DNS change, send an email to hello@ from an outside address and reply to it.
- Do the switch at a quiet time. The parking page at VentraIP goes away when the domain points to Pages.

## 5. Cloudflare settings to check
- **Scrape Shield → Email Address Obfuscation: Off.** Otherwise Cloudflare rewrites the email links into `/cdn-cgi/l/email-protection` links that search engines report as broken.
- **Rocket Loader: Off.**
- **Web Analytics:** turn it on for the site (no code needed). The security headers allow only the site's own scripts. If the dashboard's automatic setup injects its beacon, add `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` in `public/_headers`.
- SSL/TLS mode: **Full (strict)**. The current 525 error on https://mesquaredagency.com is the old parking setup failing its SSL handshake, and it goes away when the domain points to Pages.

## 6. After going live
```bash
npm run indexnow
```

Then submit `https://mesquaredagency.com/sitemap.xml` in Google Search Console (as a domain property) and check the coverage report about a week later.

## Phase 2 (the enquiry form): what will be needed
- A Resend account with mesquaredagency.com verified. Add its SPF include to the existing SPF record (one merged record) and its DKIM records, and set DMARC.
- Cloudflare Turnstile site and secret keys.
- A Cloudflare rate-limiting rule on `/api/enquiry`: 5 requests per minute per IP.
