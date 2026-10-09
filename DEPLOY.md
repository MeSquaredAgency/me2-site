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
| Code | GitHub **MeSquaredAgency/me2-site** (private). A GitHub Actions workflow builds and publishes it (below) |
| Node | Builds use Node 24 (`.node-version`, read by the workflow). The build imports `.ts` config files directly, which needs Node 23.6 or later |

**Never publish from the APN Real Estate Cloudflare account.** `account_id` in `wrangler.jsonc` pins every command to the Me² account.

## Publishing a change (from GitHub)
A GitHub Actions workflow (`.github/workflows/publish.yml`) publishes every push to the Me² Cloudflare account:

| Push to | The workflow runs | Result |
| --- | --- | --- |
| `main` | `npm ci`, `npm run build`, then `npx wrangler deploy` | **Live on mesquaredagency.com** a couple of minutes after the push |
| any other branch | `npm ci`, `npm run build`, then `npx wrangler versions upload` | A **preview URL** (not live), shown in the run's summary (GitHub → Actions → the run) |

So `main` is always exactly what's live. Every change goes on a branch first. Then:

1. Check the build and run every check locally:

   ```bash
   npm run verify
   ```

2. Push the branch. In GitHub → **Actions**, open the run for that push; its summary has the preview link. Check it on a phone and a laptop.

3. **With EC's go-ahead only**, merge the branch into `main` (a pull request, then merge) and push. That publishes it. Then check https://mesquaredagency.com shows the change.

**If a run fails**, the live site stays as it was. The log is in GitHub → Actions → the failed run.

**Rolling back:** fastest is `npx wrangler rollback` (puts the previous version back live in seconds; `npx wrangler deployments list` shows the history). Then revert the commit on `main` too, or the next push will publish it again.

### Why GitHub Actions and not Cloudflare's own Git builds
Cloudflare's Git builds (Workers Builds) work through the "Cloudflare Workers and Pages" GitHub app, and a GitHub account or organisation can only point to one Cloudflare account. The **MeSquaredAgency** organisation is already linked to the **APN** Cloudflare account, whose Pages project `apnre-flagship-site` builds from MeSquaredAgency/APNRE-Agency-Site (checked 9 Oct 2026). Linking the organisation to the Me² account instead would likely stop the APNRE site deploying. GitHub Actions needs no GitHub app link, just a Cloudflare API token.

### The token (one-time setup)
1. In Cloudflare, signed in to the **Me²** account: My Profile → **API Tokens** → **Create Token** → template **Edit Cloudflare Workers**.
   - Account Resources: **Include → Me²** (not the APN account).
   - Zone Resources: **Include → Specific zone → mesquaredagency.com**.
   - Create it and copy the token (Cloudflare shows it once).
2. In GitHub → MeSquaredAgency/me2-site → **Settings → Secrets and variables → Actions → New repository secret**: name `CLOUDFLARE_API_TOKEN`, paste the token, save.
3. Re-run the latest workflow run (Actions → the run → Re-run jobs), or push a commit. Until the secret exists, runs finish with a warning and publish nothing.

To replace the token: create a new one the same way, update the secret, then delete the old token in Cloudflare.

### Publishing by hand (fallback)
If GitHub is unavailable: `npm run build` on the right branch, then `npx wrangler versions upload` for a preview, or, **with EC's go-ahead only**, `npx wrangler deploy` (live immediately; uploads whatever is in `dist/`). Push the same commit to `main` afterwards so the repo still matches the live site.

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
