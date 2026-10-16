# Careers section: design

16 October 2026. Branch `careers` (from `origin/main` 515180f). Status: approved by EC, 16 Oct 2026.

## Why

EC: "create a fully functioning careers section of the site". Me² is hiring its first three Command Centre operators in Phnom Penh. The roles are written and going up on LinkedIn: Property Management is public (https://www.linkedin.com/jobs/view/4479323026/), while Accounting & Bookkeeping and Marketing aren't public yet. Right now the only hiring page on the domain is the hidden work-sample assessment at `/cco/assessment/`.

The site needs a place where a candidate can read a role and apply in a few minutes with a CV. Me² then isn't dependent on LinkedIn alone, it can link to its own careers page from Facebook, Telegram groups and job boards, and the domain looks like a real employer.

**Success:** someone arrives from LinkedIn, Facebook, a Google job listing or a friend; understands the role and the pay; applies with a CV; and the application lands in the people@ inbox with the CV attached, ready to reply to. The section can be switched off in one place when Me² isn't hiring.

## Goals

- `/careers/`: a short introduction, the open roles, and how to apply.
- One page per role, built from one content file, so adding or closing a role is a content change.
- A working application form on each role page that emails the application, with the CV attached, to the people inbox.
- An "or apply on LinkedIn" link on any role that's public on LinkedIn.
- Each role marked up as a job posting so Google can show it in job search.
- A privacy section covering applications, added to the existing draft privacy policy.

## Non-goals

- No applicant tracking: no database of applications, no candidate accounts, no status pages. Applications arrive by email, like enquiries (my call).
- No general "send us your CV" application for roles that aren't listed (my call; easy to add later).
- The `/cco/assessment/` page stays as it is: hidden, and sent by hand to shortlisted people. The careers pages don't link to it.
- No change to the sales page apart from one footer link. No restyle.

## Anti-goals (failure even if it works)

- Promising anything that isn't confirmed: private health insurance (Patrick: "keep it up our sleeve"), visa sponsorship, anything still in [TBC] brackets in the Google Doc.
- Asking for date of birth, a photo, gender, marital status, nationality, ID numbers, bank details or salary history.
- Careers pulling attention from "Talk to us" on the home page.
- Looking like a generic job board: card grids, chips, icon wells, gradient text.
- Applicant details in logs, or applications from preview links landing in the real inbox without EC knowing.

## What's settled, and by whom

| Decision | Source |
| --- | --- |
| The three roles and their wording | EC: LinkedIn post 4479323026 (Property Management); the Marketing and Accounts texts EC pasted on 16 Oct 2026. Appendix A has the copy of record. |
| APN Real Estate is named on the Property Management and Marketing roles, with a link to apnre.com.au | EC: it's in the public LinkedIn post. Careers pages only; the sales page doesn't change. |
| Phnom Penh is shown as the job location | EC: in every LinkedIn post. The sales page keeps `showLocations` off (Patrick's decision). |
| Salary "Starting at US$600 per month, depending on experience" for all three | EC: in all three posts. |
| No health insurance; time in Australia only as "Potential opportunities…, subject to eligibility and final arrangements" | EC's LinkedIn wording; Patrick's comment on the Google Doc. |
| Apply on the site **and** link to LinkedIn where the role is public | My call. EC didn't pick between "both" and "LinkedIn only". |
| Applications by email only, no database | My call. |
| Careers linked from the footer only, not the header | My call (the page's one goal stays "Talk to us"). |
| Phone or Telegram is optional; work links are required for Marketing only | My call. |
| Tidy-ups to the posted copy (Appendix A, "Changes") | My calls, each listed. |
| Careers intro, thank-you and not-sent wording | My draft (Appendix B), for EC's yes. |

## Pages

All pages use the site's existing layout (`Base.astro`, `Header`, `Footer`) and the v0.15 "Lit" look: a dark (`abyss`) head with the large narrow display heading, as on `/privacy/` and `/thanks/`, then paper sections. One typeface, sentence case, no all-caps labels. Coral only as light and the small square motif already used on `/thanks/`.

### `/careers/`
- Dark head: H1 and the two-sentence intro (Appendix B).
- Paper section: "Open roles" as a hairline list, one row per role. Each row shows the role (large), a one-line summary, and "Phnom Penh · Full-time · From US$600 a month", and the whole row links to the role page. No cards.
- A short "Applying" note: apply on the role's page or on LinkedIn; questions go to people@ (as a link).
- If there are no open roles (the list is empty), the page says so and gives the people@ address. It never shows an empty list.

### `/careers/<role>/`
Slugs: `operations-executive-property-management`, `operations-executive-accounting`, `operations-executive-marketing`.
- Dark head: "Operations Executive" with the role's area as the H1 (e.g. "Property Management"), then the facts line: location, full-time, hours, salary. Two buttons: "Apply now" (jumps to the form) and, if the role has a LinkedIn link, "Apply on LinkedIn".
- Paper body: the sections from Appendix A, read top to bottom, text no wider than about 68 characters. On wide screens a narrow column alongside the body holds the facts and the "Apply now" button, and stays in view while reading (sticky). On phones it's not shown, because the head already has both.
- Dark foot section `#apply`: the application form, styled like the enquiry form.
- A "Back to all roles" link.

### `/careers/thanks/` and `/careers/not-sent/`
Where the form lands without JavaScript (noindex), following `/thanks/` and `/not-sent/`. Wording in Appendix B.

## The application form

| Field | Required | Limits and notes |
| --- | --- | --- |
| Full name | yes | 100 characters |
| Email | yes | 254 characters, checked as an email address |
| Phone or Telegram | no | 60 characters |
| Where are you based? | yes | 160 characters, hint "City and country" |
| CV | yes | PDF, DOC or DOCX, up to 4 MB. Hint: "You don't need to include a photo or your date of birth." |
| LinkedIn profile | no | a web address |
| Links to two or three examples of your work | Marketing only, required | up to 1,000 characters |
| Why this role? | yes | up to 1,000 characters, hint "A few lines is plenty." |

Plus hidden fields: the role's slug, a start time, and the honeypot field, as on the enquiry form. A privacy line under the button links to `/privacy/`.

**Behaviour:** it matches the enquiry form (docs/forms.md). Each field gets its own error message and focus moves to the first problem. "Sending…" shows on the button, then success or failure appears in place. On failure, whatever the applicant typed and the chosen file stay put, and the message gives people@ as a link. Without JavaScript, the browser posts the form normally (multipart) and lands on `/careers/thanks/` or `/careers/not-sent/`. The CV's type and size are checked in the browser before sending and again in the Worker.

## Where applications go

- **New Worker route:** `POST /api/applications` in `worker/index.ts`, beside `/api/enquiry`.
- **Checks:**
  - Bots are dropped silently (honeypot field, or a form filled in under 2.5 seconds).
  - The role must be one of the open roles.
  - Same field limits as the form.
  - The CV must be at most 4 MB and pass both checks: extension `.pdf`/`.doc`/`.docx`, and a file signature of `%PDF`, `PK`, or `D0 CF 11 E0`.
  - Anything else is rejected and sent to the not-sent outcome.
- **The email**, sent through Resend with the existing `RESEND_API_KEY`:
  - To: `CAREERS_EMAIL`, new in `site.config.ts` as `people@mesquaredagency.com`.
  - From: `FORM_FROM_EMAIL`, named "Me Squared careers".
  - Reply-To: the applicant.
  - Subject: `Application: Operations Executive (Property Management) (Name)`.
  - Body: every field in plain text and simple HTML, escaped.
  - Attachment: the CV, with its file name made safe.
- **Logs:** one line per application, giving the role and the outcome only. No names, emails or file names.
- **Sending limits:** Resend's free plan allows 100 emails a day and 3,000 a month, shared with the enquiry form. There's no counter in the Worker, because it would need storage (my call). If Resend refuses a send for any reason, the applicant gets the not-sent message with people@ to email instead, so nothing is lost silently, and the log line records the failure code. `docs/careers.md` tells EC to:
  - widen the one Cloudflare rate-limiting rule (still to be added, per the README checklist) so it covers every `/api/` path;
  - watch Resend usage while the roles are fresh, and move to a paid Resend plan if applications get near the limit.
- **Previews:** previews share the Worker and the Resend key, so a preview would email the real inbox. Allow sending from previews (needed to test end to end), but put "[Preview]" in the subject when the host isn't `mesquaredagency.com`.
- **CPU limit:** the Me² Cloudflare account is on Workers Free (10 ms CPU per request). The builder keeps the Worker's work on the CV light and measures it:
  - With JavaScript, the browser base64-encodes the CV and posts JSON, so the Worker only checks the first bytes and passes the string through.
  - Without JavaScript, the Worker parses the multipart form and encodes the file itself.
  - Before calling it done, send the largest allowed CV from a preview and read the CPU time in Workers Logs. If it doesn't fit, stop and tell EC. The options are a smaller cap, Workers Paid, or R2.

## Google job search (JobPosting)

Each role page carries JobPosting JSON-LD, built in `src/lib/schema.ts`:
- title, and description (the role's copy as HTML)
- `datePosted` from the content file
- `employmentType: FULL_TIME`
- `hiringOrganization`: Me², with `sameAs` set to the LinkedIn and Facebook pages and the logo
- `jobLocation`: Phnom Penh, `addressCountry: KH`
- `baseSalary`: USD, `minValue: 600`, `unitText: MONTH`
- `directApply: true`

There's no `validThrough`. Closing a role removes the page and its markup. `/careers/` gets a plain page with no JobPosting markup.

## Where things live

- **`src/content/careers.ts`:** new, the copy of record for careers. It holds the page wording (Appendix B) and a `roles` array. Each role has: slug, area, title, summary, `linkedinUrl` (optional), `datePosted`, facts, `sections` (heading, optional intro paragraphs, bullet groups with optional subheadings, optional closing paragraphs), `needsWorkLinks`, and `listed`. An unlisted role builds no page. It's also left out of `/careers/`, the sitemap, llms.txt and the JobPosting markup, and the Worker refuses applications for it. That way a role can sit ready in the content file until EC wants it public.
- **`src/data/routes.json`:**
  - `/careers/` and one entry per role, indexable, with `flag: "showCareers"` and titles and descriptions written for each role.
  - `/careers/thanks/` and `/careers/not-sent/`, noindex.
  - Adding a role means a `careers.ts` entry plus a `routes.json` entry. `docs/careers.md` says so.
- **`src/config/flags.ts`:** `showCareers` (on in this branch). With it off: no careers pages, no footer link, no sitemap or llms.txt lines. With the form off (it needs `showPrivacyPage`, like every form), each role page shows "Email your CV to people@…" in place of the form. Nothing looks broken either way.
- **`src/config/site.config.ts`:** `CAREERS_EMAIL`. The assessment page's own hard-coded people@ is EC's supplied file and stays untouched.
- **Footer:** a "Careers" link beside "Privacy" in the bottom row, while `showCareers` is on.
- **`scripts/postbuild.mjs`:** a Careers line in llms.txt while the flag is on. The sitemap picks the pages up from `routes.json` already, but postbuild also reads `careers.ts` and leaves out any role that isn't `listed`.
- **Privacy draft (`content.privacy`):** a new "Job applications" section covering:
  - what's collected
  - why it's collected
  - who sees it (the Me² hiring team)
  - how it travels (email, through Resend)
  - how long it's kept: the period EC sets (open question 3), written as plain text; no `[[TBC]]` marker, because `verify` fails any real build that contains one
  - how to ask for deletion (PRIVACY_EMAIL)

## Docs to update in the same change

- **New `docs/careers.md`:** how to add, change or close a role; where applications go; how to test.
- **`README.md`:** the pages table and the launch checklist.
- **`DECISIONS.md`:**
  - the careers form collects a CV, which goes beyond the enquiry form's data rule, and why
  - APN and Phnom Penh appear on careers pages
  - the calls listed above
- **`CLAUDE.md`:** "Where things live" gets `src/content/careers.ts`.

## Checks before it's shown to EC

`npm run build` and `npm run check:home` must pass. Then check by hand, as CLAUDE.md asks while `npm run verify` is out of date:
- **axe** at 375 and 1280 on `/careers/` and a role page, with errors showing on the form.
- **No sideways scroll** at 375, 768, 820, 1024×768, 1280 and 1830.
- **Keyboard:** the form works by keyboard alone.
- **Lighthouse** on `/careers/` and one role page.
- **JobPosting JSON-LD** parses, and has every required property.
- **Brand rules:** "Me²" spelt right, none of the banned words, Australian English.
- **End to end:** an application from the preview, using a 4 MB PDF, arrives in people@ with the attachment. Ask EC before sending it, and say what to look for.

## Still open for EC

**Answered 16 Oct 2026.** EC approved the design and all three suggestions ("you are good to go"): the form collects CVs and the data rule is reworded; all three roles are listed now; applications are kept for 12 months, then deleted, or sooner on request.

Questions that change what gets built (asked 16 Oct 2026):
1. **CVs:** may the careers form collect a CV and work links? That goes past the standing data rule ("contact details and a short task description only", BRIEF.md and CLAUDE.md). If yes, the rule is reworded so it covers sales forms, and the careers form gets its own line: contact details, a CV, work links and a short note, and never fields for financial, health or identity information. If no, the form takes contact details and links only.
2. **Which roles go up first:** all three now, or Property Management only until the other two are public on LinkedIn? The answer sets `listed` for Accounting and Marketing.
3. **Retention:** how long applications are kept before they're deleted (suggested: 12 months, then deleted, sooner on request). This goes in the privacy section.

For EC to check while reading (my calls):
- The intro, thank-you and not-sent wording in Appendix B.
- The copy changes in Appendix A. In particular, the Marketing "Exposure to property management" line looks copied from the Property Management post; if EC agrees, it needs the same fix on LinkedIn.
- people@mesquaredagency.com is the applications inbox (the assessment already gives it out). The end-to-end test confirms it receives mail.

---

## Appendix A: role copy of record

Headings are in sentence case (the site doesn't use all-caps labels). Bullets are as posted unless listed under "Changes".

### A1. Operations Executive (Property Management)
Source: LinkedIn 4479323026 (public). LinkedIn link: https://www.linkedin.com/jobs/view/4479323026/
Summary line (mine): "Property management administration for APN Real Estate, an Australian agency with multiple offices."

**About Me²**
Me² builds AI-enabled back-office teams for businesses, combining skilled people, effective processes and practical AI tools to help businesses run more efficiently.
We're building our first Command Centre in Phnom Penh: a team of Remote Operators who take ownership of operational work, use technology intelligently and deliver reliable outcomes for our clients.
Joining at this early stage means contributing to how the business operates while developing skills across property management, business operations and AI-enabled workflows.

**The role**
Your primary focus will be supporting APN Real Estate, an Australian real estate business with multiple offices.
You'll work across property management administration, documentation, maintenance coordination, reporting and client communications. You'll also contribute to improving processes and using AI tools to make routine work more efficient.
This isn't simply a data-entry role. We're looking for someone who understands the purpose behind their work, takes responsibility for accuracy and identifies opportunities to improve how things are done.

**Key responsibilities**
*Property management*
- Track rental arrears, maintain follow-up schedules and prepare notices for agent review.
- Prepare lease documentation, renewals and rent review paperwork.
- Coordinate maintenance requests and liaise with tradespeople, owners and tenants.
- Schedule inspections and check reports for completeness and accuracy.
- Monitor shared inboxes, prioritise enquiries and prepare professional responses.

*Operations & AI*
- Review AI-generated documents, reports and correspondence for accuracy.
- Maintain records, prepare reports and support client onboarding.
- Document processes and identify opportunities to improve efficiency.
- Support colleagues across the Command Centre as priorities evolve.

All work will be completed within agreed procedures and approval limits. Tasks requiring an authorised agent's approval will remain subject to that approval.

**What we're looking for**
- At least two years of experience in property management or real estate administration; Australian experience preferred.
- Familiarity with platforms such as PropertyMe, Console Cloud or PropertyTree.
- Fluent in written English and professional communication skills.
- Excellent attention to detail, organisation and numerical accuracy.
- The ability to manage competing priorities and follow tasks through to completion.
- An interest in AI tools and the judgement to verify their output.
- Reliable internet access and backup power.

You don't need to be an AI specialist. We're looking for someone who can learn new systems, think critically and take ownership of their work.

**What we offer**
- Early-stage ownership: help shape the systems and processes of a growing operations team.
- Practical training in our workflows, technology and AI tools.
- Exposure to property management, business operations and process improvement.
- Opportunities to develop and take on greater responsibility as the business grows.
- Potential opportunities to spend time working with our Australian team, subject to eligibility and final arrangements.

**Employment details**
- Location: Phnom Penh, Cambodia
- Salary: Starting at US$600 per month, depending on experience
- Working hours: 44 hours per week, with a 6:00 AM start where required to align with Australian business hours.

**How we work**
We value accountability, clear communication, accuracy and continuous improvement.
We aim to provide clear expectations, practical support and opportunities for people to develop their skills and responsibilities as the business grows.
If you have property management experience and want to work at the intersection of operations, technology and AI, we'd like to hear from you.
Learn more about our initial client: APN Real Estate (link to https://apnre.com.au/).

Changes: the first five responsibilities get the subheading "Property management" (LinkedIn leaves them unlabelled above "Operations & AI"). The APN address becomes a link with the name as its text.

### A2. Operations Executive (Accounting & Bookkeeping)
Source: the text EC pasted on 16 Oct 2026 (LinkedIn draft, not yet public). No LinkedIn link until it's public.
Summary line (mine): "Bookkeeping and accounting for Australian businesses, and the financial administration of Me²'s Cambodian operations."

**About Me²**
Me² builds AI-enabled back-office teams for businesses. We combine skilled people, effective processes and practical AI tools to help businesses run more efficiently.
We're building our first Command Centre in Phnom Penh, bringing together operators who take ownership of their work, maintain high standards and help improve how businesses operate.
This is an opportunity to join at an early stage and contribute to both our clients' financial operations and the development of Me² itself.

**The role**
Your primary responsibility will be bookkeeping and accounting support for Australian businesses, with an initial focus on accounts payable, accounts receivable, reconciliations and month-end reporting.
You'll also support the wider Command Centre and help manage the financial administration of Me²'s own Cambodian operations, including bookkeeping, tax documentation and compliance coordination.
We're looking for someone who understands the importance of accurate financial records, can work independently within agreed procedures and knows when to investigate, ask questions or escalate an issue. AI tools will support parts of the workflow, but you'll remain responsible for checking the accuracy and completeness of your work.

**Key responsibilities**
*Accounting & bookkeeping*
- Process supplier bills, code transactions and prepare payment runs for approval.
- Maintain accounts payable and receivable records and follow up outstanding invoices.
- Complete monthly bank and credit card reconciliations.
- Prepare month-end reports, supporting schedules and plain-English variance explanations.
- Review AI-coded transactions and correct errors before finalisation.
- Prepare Australian GST and BAS workpapers for review and lodgement by an appropriately authorised professional where required.

*Me² financial administration*
- Maintain accurate records of income, expenditure, invoices and supporting documentation.
- Prepare monthly financial summaries and maintain a calendar of tax and filing deadlines.
- Assist with Cambodian tax administration, including preparing records, schedules and draft declarations for review.
- Coordinate with external accountants or tax advisers on Cambodian tax filings and regulatory requirements.
- Help maintain clear, documented financial processes as the business grows.

*Wider Command Centre*
- Support client onboarding, document collection and expense follow-up.
- Prepare internal reports and maintain operational records.
- Assist colleagues with administrative work when priorities require it.

**What we're looking for**
- An accounting degree, diploma or equivalent qualification.
- At least two years of professional bookkeeping or accounting experience.
- Practical experience with Xero, MYOB or QuickBooks Online.
- An understanding of Australian GST and BAS processes, or the ability to develop this knowledge through structured training.
- Strong reconciliation skills and attention to detail.
- Professional written English and the ability to explain financial issues clearly.
- Discretion when handling confidential financial information.
- The ability to work independently, meet deadlines and escalate discrepancies appropriately.
- Experience with Cambodian accounting, taxation or statutory reporting would be an advantage.

**What we offer**
- Early-stage ownership: help shape the systems and processes of a growing operations team.
- Practical training in our workflows, technology and AI tools.
- Exposure to accounting, business operations and process improvement.
- Opportunities to develop and take on greater responsibility as the business grows.
- Potential opportunities to spend time working with our Australian team, subject to eligibility and final arrangements.

**Employment details**
- Location: Phnom Penh, Cambodia
- Salary: Starting at US$600 per month, depending on experience
- Working hours: 44 hours per week, with a 6:00 AM start where required to align with Australian business hours.

**How we work**
We value accountability, clear communication, accuracy and continuous improvement.
We aim to provide clear expectations, practical support and opportunities for people to develop their skills and responsibilities as the business grows.
If you have bookkeeping or accounting experience and want to work at the intersection of operations, technology and AI, we'd like to hear from you.

Changes (my calls): The pasted "What we offer" was still the Google Doc draft, so it now matches the other two posts:
- "Sponsorship to spend time in Australia… [TBC]" became the hedged "Potential opportunities…" line.
- "Training on our AI tools and client systems" became the shared training line.
- The "Exposure to…" line names accounting.
- Salary and hours moved to "Employment details", in the same words as the other posts.

"How we work" was added, copied from the other two with "bookkeeping or accounting experience".

### A3. Operations Executive (Marketing)
Source: the text EC pasted on 16 Oct 2026 (LinkedIn draft, not yet public). No LinkedIn link until it's public.
Summary line (mine): "Me²'s first dedicated marketing hire: content, campaigns and reporting, for Me² and its clients."

**About Me²**
Me² builds AI-enabled back-office teams for businesses. We combine skilled people, effective processes and practical AI tools to help businesses operate more efficiently. We're creating our first Command Centre in Phnom Penh, bringing together operators who take ownership of their work, use technology intelligently and deliver reliable outcomes.
This is our first dedicated marketing hire. You'll help establish how Me² presents itself to the market while supporting marketing activities for our clients.

**The role**
Your primary responsibility will be marketing: creating content, supporting campaigns, maintaining our digital presence and helping generate qualified business enquiries. You'll work closely with the team to turn ideas into practical marketing activity, using AI tools to accelerate research and drafting while applying your own judgement to messaging, accuracy and quality.
As an early member of the team, you'll also support lead follow-up, website updates, client communications and other operational tasks when needed. We're looking for someone who can move from brief to execution to reporting without needing every step prescribed.

**Key responsibilities**
*Content & communications*
- Write and edit LinkedIn posts, website copy, email campaigns, newsletters and marketing explainers.
- Maintain a content calendar and coordinate publication schedules.
- Adapt messaging for different audiences, businesses and communication channels.
- Use AI tools to support research, drafting and content development, then edit and fact-check the output before publication.

*Campaigns & lead generation*
- Build targeted prospect lists and support outbound email and LinkedIn campaigns.
- Prepare campaign sequences and track follow-ups in the CRM.
- Maintain accurate lead records and coordinate with the team on enquiries and next steps.
- Support marketing activities designed to generate qualified leads for Me² and its clients.

*Digital marketing & reporting*
- Maintain and update website content and landing pages.
- Monitor relevant metrics, including website traffic, engagement, enquiries and campaign performance.
- Prepare weekly reports identifying what is working, what is not and what should change.
- Support the development and execution of marketing plans for client businesses.

*Wider Command Centre*
- Follow up leads and maintain CRM records.
- Support client communications and onboarding.
- Document marketing processes and create repeatable workflows.
- Assist with operational work during busy periods.

**What we're looking for**
- At least two years of experience in B2B marketing, services marketing or a similar role.
- Two or three examples of published work or campaigns you have contributed to.
- Strong written English and the ability to communicate clearly without unnecessary jargon.
- Experience with a CRM, an email marketing platform and Canva or similar design tools.
- Familiarity with LinkedIn marketing and website content management.
- Basic analytics skills, including interpreting campaign and website performance.
- The ability to organise your workload, meet deadlines and manage a campaign from brief to report.
- An interest in AI tools and the ability to use them critically rather than relying on unedited output.

We're interested in evidence of your work and your ability to explain the decisions behind it, not just a list of software you've used.

**What we offer**
- Early-stage ownership: help shape the systems and processes of a growing operations team.
- Practical training in our workflows, technology and AI tools.
- Exposure to marketing, business operations and process improvement.
- Opportunities to develop and take on greater responsibility as the business grows.
- Potential opportunities to spend time working with our Australian team, subject to eligibility and final arrangements.

**Employment details**
- Location: Phnom Penh, Cambodia
- Salary: Starting at US$600 per month, depending on experience
- Working hours: 44 hours per week, with a 6:00 AM start where required to align with Australian business hours.

**How we work**
We value accountability, clear communication, accuracy and continuous improvement.
We aim to provide clear expectations, practical support and opportunities for people to develop their skills and responsibilities as the business grows.
If you have marketing experience and want to work at the intersection of operations, technology and AI, we'd like to hear from you.
Learn more about our initial client: APN Real Estate (link to https://apnre.com.au/).

Changes (my call): "Exposure to property management, business operations…" became "Exposure to marketing, business operations…", because the posted line looks copied from the Property Management post (open item 4).

## Appendix B: new wording (my draft, for EC's yes)

**`/careers/`**
- H1: "Join the Command Centre."
- Intro: "We're building our first Command Centre in Phnom Penh: trained people who own the back-office work of businesses in Australia, with AI tools doing the drafting and the volume. We're hiring our first operators."
- List heading: "Open roles". Row facts: "Phnom Penh · Full-time · From US$600 a month".
- Applying note: "Apply on the role's page with your CV, or on LinkedIn where the role is listed there. Questions about a role? Email people@mesquaredagency.com."
- No roles open: "There are no open roles right now. You're welcome to email your CV to people@mesquaredagency.com."

**Form**
- Heading: "Apply for this role". Button: "Send application".
- Privacy line: "We use these details only to consider your application. See our privacy policy."
- Sent: "Application sent. Thanks for applying. If you're shortlisted, we'll email you about the next step."
- Not sent: "Your application didn't send. What you entered is still here: try again, or email your CV to people@mesquaredagency.com with the role in the subject."

**`/careers/thanks/`**: H1 "Application sent.", the "Sent" text above, and a button "See all roles".
**`/careers/not-sent/`**: H1 "Not sent.", "Your application didn't send. Email your CV to people@mesquaredagency.com with the role in the subject, or go back and try again.", and a button "Back to the roles".

**Page titles and descriptions (`routes.json`)**
- `/careers/`: "Careers | Me²". "Join Me²'s Command Centre in Phnom Penh. Open roles in property management, accounting and marketing, starting at US$600 a month."
- Each role: "Operations Executive (Property Management) | Me² careers", with a description of about 150 characters drawn from its summary line.
