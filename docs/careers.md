# Careers

`/careers/` lists the open roles; each role has its own page at `/careers/<role>/` with the full posting and an application form. Applications are emailed, CV attached, to `people@mesquaredagency.com`. There's no database: the inbox is the record. Design: [the careers spec](superpowers/specs/2026-10-16-careers-design.md).

## Where things live
- **Role copy, the careers page wording and the form wording:** `src/content/careers.ts`. It's pure data, because the Worker reads it too.
- **Page titles and search descriptions:** `src/data/routes.json`. Every role has an entry with `"role": "<slug>"`.
- **The inbox:** `CAREERS_EMAIL` in `src/config/site.config.ts`.
- **The switch:** `showCareers` in `src/config/flags.ts`. Off means no careers pages, no footer link, no sitemap or llms.txt lines, and `/api/applications` answers 404. The form also needs `showPrivacyPage`; without it, each role page says to email a CV instead.

## Adding, changing or closing a role
- **Change a role's wording:** edit its entry in `careers.ts`, keeping each section's heading.
- **Add a role:** copy an entry in `careers.ts` and give it a new `slug`. Then add a `routes.json` entry for `/careers/<slug>/` with a title, a description of 160 characters or fewer, `"flag": "showCareers"` and `"role": "<slug>"`. Its page, its place on `/careers/`, its Google job markup and the sitemap all follow.
- **Take a role down for a while:** set `listed: false`. Its page, its row and its sitemap entry go, and the Worker refuses applications for it. Its `routes.json` entry can stay.
- **Close a role for good:** delete its entry from `careers.ts` and from `routes.json`.
- **Once a role is public on LinkedIn:** set its `linkedinUrl`, and its page gets an "Apply on LinkedIn" button.
- **When it's posted:** set `datePosted`, which Google's job search reads.

After any change, run `npm run build && node scripts/check-careers.mjs`. The check still expects the three roles of 16 Oct 2026, so update its `SLUGS` list when the roles change.

## What the form asks for
- **Required:** full name, email, where they're based, a CV (PDF or Word, up to 4 MB), and why this role.
- **Optional:** phone or Telegram, and a LinkedIn profile.
- **Marketing only, required:** links to two or three examples of their work.

It never asks for date of birth, a photo, gender, nationality, ID or salary history; the CV hint says a photo and date of birth aren't needed. The privacy policy's "Job applications" section says what's collected and that applications are kept for 12 months (EC, 16 Oct 2026).

## Where applications go
`/api/applications` (`worker/applications.ts`) checks each application:
- the role is open
- the required fields are filled in
- the CV is PDF or Word: its name and its first bytes have to agree
- the CV is 4 MB or under
- bots are dropped (a hidden field, and a form filled in under 2.5 seconds)

It then emails the application through Resend, from "Me Squared careers" `<website@…>` to people@. Reply-To is the applicant, so pressing Reply answers them, and the subject is `Application: <role> (<name>)`. Applications sent from a preview link have `[Preview] ` at the start of the subject. The Worker's logs record only the outcome and the role, never who applied.

| Situation | What the applicant sees |
| --- | --- |
| A field missing or wrong | The message under that field, and the cursor goes to it |
| Sent | "Application sent. Thanks for applying. If you're shortlisted, we'll email you about the next step." |
| The CV itself refused by the Worker (its name and contents don't agree, e.g. a ".doc" that is really a web page) | "Your CV needs to be a PDF or Word file." under the CV field, and the cursor goes there |
| Couldn't send (Resend refused, no key, no connection) | "Your application didn't send…", with people@ as a link; what they typed and the file stay in the form |
| No JavaScript | A normal form post, then `/careers/thanks/` or `/careers/not-sent/` |

## Limits to watch
- **Resend's free plan:** 100 emails a day and 3,000 a month, shared with the enquiry form. If applications get near that, move to a paid Resend plan; once the limit is reached, both forms say "didn't send".
- **Rate limiting:** Cloudflare's free plan allows one rate-limiting rule. Make it cover every path that starts with `/api/` (DEPLOY.md).
- **CPU:** the Me² Cloudflare account is on Workers Free, which allows 10 ms of CPU per request. The form is always posted as multipart (by the page's script, or by the browser without JavaScript), and the Worker encodes the CV with the built-in `toBase64()`, which takes about 1 ms for 4 MB. `check-applications.mjs` times a 4 MB CV both ways. After a change to the route, send a near-4 MB CV from a preview and read the CPU time in Workers Logs.

## Testing
- `node scripts/check-applications.mjs`: the route, with Resend stubbed. It covers every refusal, bots, size limits, previews, no-JavaScript posts and logs. Workers and Node 25+ (builds use 26, `.node-version`) have the `toBase64()` the route uses built in; on Node 22 or 24 the script fills it in with `Buffer` for the test.
- `npm run build && node scripts/check-careers.mjs`: the content, the built pages, JobPosting, the sitemap and llms.txt, and in Edge: axe, sideways scroll at six sizes, and the form's errors, success and failure. Add `--static` to skip the browser, and `--flag-off` to also build with careers switched off.
- **End to end:** push the branch, open the preview, and apply with a real PDF. It arrives in people@ with "[Preview]" in the subject. Ask EC first: it lands in a real inbox.
