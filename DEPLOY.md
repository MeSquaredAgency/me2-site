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
| Code | GitHub **MeSquaredAgency/me2-site** (private). Cloudflare builds and publishes from it (Workers Builds, below) |
| Node | Builds use Node 24 (`.node-version`). The build imports `.ts` config files directly, which needs Node 23.6 or later; Cloudflare's default is older |

**Never publish from the APN Real Estate Cloudflare account.** `account_id` in `wrangler.jsonc` pins every command to the Me² account.

## Publishing a change (from GitHub)
The Worker is connected to the repo with **Workers Builds**:

| Push to | Cloudflare runs | Result |
| --- | --- | --- |
| `main` | `npm run build`, then `npx wrangler deploy` | **Live on mesquaredagency.com** within a minute or two |
| any other branch | `npm run build`, then `npx wrangler versions upload` | A **preview URL** (not live), shown on the commit in GitHub and in the Cloudflare dashboard |

So `main` is always exactly what's live. Every change goes on a branch first. Then:

1. Check the build and run every check locally:

   ```bash
   npm run verify
   ```

2. Push the branch. Cloudflare builds it and posts a preview link on the commit (GitHub → the commit's checks, or Cloudflare → Workers → mesquared → Deployments). Check it on a phone and a laptop.

3. **With EC's go-ahead only**, merge the branch into `main` (a pull request, then merge) and push. That publishes it. Then check https://mesquaredagency.com shows the change.

**If a build fails** in Cloudflare, the live site stays as it was. The build log is in Cloudflare → Workers → mesquared → Deployments → the failed build.

**Rolling back:** fastest is `npx wrangler rollback` (puts the previous version back live in seconds; `npx wrangler deployments list` shows the history). Then revert the commit on `main` too, or the next push will publish it again.

### Publishing by hand (fallback)
If GitHub or the build is unavailable: `npm run build` on the right branch, then `npx wrangler versions upload` for a preview, or, **with EC's go-ahead only**, `npx wrangler deploy` (live immediately; uploads whatever is in `dist/`). Push the same commit to `main` afterwards so the repo still matches the live site.

### How the connection was set up (9 Oct 2026)
Cloudflare → Workers & Pages → **mesquared** → Settings → **Build** → Connect → GitHub → MeSquaredAgency/me2-site. Production branch `main`; build command `npm run build`; deploy command `npx wrangler deploy`; non-production branch builds **on**, with `npx wrangler versions upload`; root directory `/`. The Cloudflare GitHub app must be allowed to see `me2-site` (GitHub → MeSquaredAgency → Settings → GitHub Apps → Cloudflare Workers and Pages → Repository access).

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
