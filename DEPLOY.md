# Publishing the site (Cloudflare)

**Live at https://mesquaredagency.com since 9 Oct 2026.**

| | |
| --- | --- |
| Cloudflare account | **Me²** (ID `813537406785f2957804689d03560623`), signed in as elliot.crabb@mesquaredagency.com |
| What it runs on | A Cloudflare **Workers** project called `mesquared`, serving the static files in `dist/` ("Pages, now part of Workers") |
| Config | `wrangler.jsonc` (project, account, domains) and `worker/index.ts` (redirects) |
| Domains | `mesquaredagency.com` (the site) and `www.mesquaredagency.com` (redirects to it). Cloudflare manages their DNS records and HTTPS certificates |
| Redirects | Every `http://` and `www.` address goes to `https://mesquaredagency.com` in one 301 (done in `worker/index.ts`, because the zone's "Always Use HTTPS" setting is off) |
| Email | Google Workspace. MX, SPF, DKIM, DMARC and verification records are separate from the site's records; connecting the site didn't touch them |

**Never publish from the APN Real Estate Cloudflare account.** `account_id` in `wrangler.jsonc` pins every command to the Me² account.

## Publishing a change
Every change goes on a branch first. Then:

1. Check the build and run every check:

   ```bash
   npm run verify
   ```

2. Get a preview link to look at (not live):

   ```bash
   npx wrangler versions upload
   ```

   Wrangler prints a preview URL. Check it on a phone and a laptop.

3. **With EC's go-ahead only**, publish live:

   ```bash
   npx wrangler deploy
   ```

   `deploy` goes live immediately. Then check https://mesquaredagency.com shows the change.

`npx wrangler deploy` uploads whatever is in `dist/`, so always run `npm run build` (or `npm run verify`) on the right branch first.

**Rolling back:** `npx wrangler rollback` puts the previous version back live in seconds. `npx wrangler deployments list` shows the history.

## Signing in on another computer
```bash
npx wrangler login
```

Sign in as elliot.crabb@mesquaredagency.com (or any user in the Me² account), and make sure **Me²** is ticked when Cloudflare asks which accounts to allow. Check with:

```bash
npx wrangler whoami
```

## Cloudflare settings worth knowing
- **Email Address Obfuscation:** currently not rewriting the site's email links (checked 9 Oct: the live page has 9 normal `mailto:` links and no `/cdn-cgi/l/email-protection` links). If someone turns Scrape Shield on later, turn this off again.
- **Always Use HTTPS:** off in the zone, but the site redirects itself, so it doesn't matter. Turning it on is harmless.
- **Web Analytics:** not yet on. Turn it on in the dashboard (Analytics & Logs → Web Analytics → add mesquaredagency.com). The security headers in `public/_headers` allow only the site's own scripts. If Cloudflare injects its beacon automatically, add `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` there.
- The DNS records for `mesquaredagency.com` and `www` are now managed by the Workers project. Don't edit or delete them in the DNS page; change domains in `wrangler.jsonc` instead.

## After launch
- Submit `https://mesquaredagency.com/sitemap.xml` in Google Search Console (add the domain as a property first).
- Tell Bing and others the site exists:

  ```bash
  npm run indexnow
  ```

- Send a test email to hello@mesquaredagency.com from an outside address and reply to it. Until the enquiry form exists, that inbox is the only way in.

## Phase 2 (the enquiry form): what will be needed
- A Resend account with mesquaredagency.com verified. Add its SPF include to the existing SPF record (one merged record) and its DKIM records.
- Cloudflare Turnstile site and secret keys.
- A rate-limiting rule on `/api/enquiry`: 5 requests per minute per IP.
