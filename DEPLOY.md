# Publishing the site (Cloudflare)

**Live at https://mesquaredagency.com since 9 Oct 2026.** The v0.15 "Lit" redesign has been live since 10 Oct 2026. **Since 10 Oct 2026 the site is private behind Cloudflare Access** (see below): only people on the allow list can open it.

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

## Private behind Cloudflare Access (since 10 Oct 2026)
EC put the site behind **Cloudflare Access** (Zero Trust → Access controls → Applications) while the privacy page, the six roles and the GST wording are confirmed. The Access application covers `mesquaredagency.com`, `www.mesquaredagency.com`, `mesquared.co.uk` and `www.mesquared.co.uk`, plus the `mesquared` Worker's production and preview URLs (so preview links are private too). Sign-in is by **One-time PIN**: allowed people type their email and get a code.

- Email (Google Workspace) and the GitHub deploys are unaffected; the enquiry form still works for people who are signed in.
- While it's on, search engines can't crawl the site and shared links show no preview image.
- Tools and sessions without a sign-in (including Claude) get a redirect to the sign-in page, so checks run locally (`npm run build`, `npm run preview`) or need a short-lived Access service token.
- **To open the site to everyone:** disable or delete the Access application. No code change or deploy is needed.

## Cloudflare settings worth knowing
- **Email Address Obfuscation:** currently not rewriting the site's email links (checked 9 Oct: the live page has 9 normal `mailto:` links and no `/cdn-cgi/l/email-protection` links). If someone turns Scrape Shield on later, turn this off again.
- **Always Use HTTPS:** off in the zone, but the site redirects itself, so it doesn't matter. Turning it on is harmless.
- **Web Analytics:** not yet on. Turn it on in the dashboard (Analytics & Logs → Web Analytics → add mesquaredagency.com). The security headers in `public/_headers` allow only the site's own scripts. If Cloudflare injects its beacon automatically, add `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` there.
- The DNS records for `mesquaredagency.com` and `www` are now managed by the Workers project. Don't edit or delete them in the DNS page; change domains in `wrangler.jsonc` instead.

## Enquiry form email
The enquiry form posts to `/api/enquiry` (in `worker/index.ts`), which emails each enquiry to `hello@mesquaredagency.com` through **Resend**, from `website@mesquaredagency.com`, with the visitor's address as Reply-To. Resend's free plan allows 3,000 emails a month (100 a day), far more than the form needs. (Cloudflare's own Email Sending needs the Workers Paid plan, so it isn't used.) Until the steps below are done, the form shows "Your enquiry didn't send. Email us at hello@… instead." with the address as a link, so nobody is left stuck.

One-time setup:

1. **Create a Resend account** at resend.com (the free plan), ideally signed up with a business address such as tech@ so it isn't tied to one person.
2. **Resend → Domains → Add domain → `mesquaredagency.com`.** Resend lists the DNS records to add: a DKIM record (`resend._domainkey`) and, for bounces, an MX and an SPF record on the `send` subdomain. None of them touch the bare domain's MX or SPF, so Google Workspace mail is unaffected. **The domain already has a DMARC record** (`_dmarc`, `p=none`): if Resend suggests one, keep the existing record and don't add a second.
3. **Add those records in Cloudflare** (Me² account → Domains → mesquaredagency.com → DNS → Records → Add record), copying each name and value exactly; leave proxying off ("DNS only"). Back in Resend, press **Verify**; it usually turns green within minutes.
4. **Resend → API Keys → Create API key**: permission **Sending access**, domain **mesquaredagency.com**. Copy it (Resend shows it once).
5. **Give the key to the site as a secret**, not in the code. Safest, in a terminal in this folder: `npx wrangler versions secret put RESEND_API_KEY` (paste the key when asked). That adds the secret without publishing anything; the next push to `main` goes live with it. Secrets stay in place across future deploys. **See the warning below before using the dashboard.**
6. **Test:** send an enquiry on the site. It should arrive in hello@ within a minute, subject "Website enquiry: …"; replying should go to the sender. Then send and receive an ordinary email at hello@ to confirm Google mail still works.
7. **Rate limit:** Cloudflare → Security → WAF → **Rate limiting rules** → create: URI path equals `/api/enquiry`, 5 requests per 10 minutes per IP, action Block. (The form also drops obvious bots itself: a hidden field and a minimum time to fill.)

**Seeing enquiries come in:** Workers & Pages → `mesquared` → Logs (one line per enquiry: `sent`, `dropped` for a bot, `send-failed` with Resend's reason, or `not-configured`, plus its topic; never names, emails or messages). Resend's dashboard also lists every email it delivered.

**Changing the key:** create a new key in Resend, replace the secret with `npx wrangler versions secret put RESEND_API_KEY` and push `main` (or follow the warning below), then delete the old key in Resend.

### Warning: saving a secret in the dashboard publishes the newest preview
Saving a secret (or variable) in the Cloudflare dashboard with **Deploy** makes a new version from the **latest uploaded** version, which is often a branch preview, and puts it **live**. That's how the v0.15 redesign went live on 10 Oct 2026 when the Resend key was saved. Before touching secrets in the dashboard, check that nothing newer than live has been uploaded (`npx wrangler versions list` against `npx wrangler deployments list`). Otherwise use `npx wrangler versions secret put` (adds it without deploying), or `npx wrangler secret put` once `main` is the latest version (it refuses if a newer preview exists).

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
