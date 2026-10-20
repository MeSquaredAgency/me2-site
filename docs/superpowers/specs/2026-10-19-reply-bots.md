# Automatic first replies on WhatsApp and email: plan

19 October 2026, revised 20 October 2026 with EC's answers. Branch `reply-bots-plan` (from `origin/main` c3d81c3). Status: **step 1 built on branch `reply-bots` (20 Oct 2026), not merged.** EC chose option A for the reply time ("usually within 2 hours, evenings and weekends included") and said to build step 1. The WhatsApp greeting and the hello@ group auto-reply are EC's to set up by hand: [docs/auto-replies.md](../../auto-replies.md).

## Why

EC, 19 Oct 2026: "We will also add bots to reply to whatsapp & initial emails (note I will need your help with this)". Since PR #18 the site promises a reply "within 2 hours of your enquiry, day or night, weekends included". An instant automatic first reply tells people their message arrived. It doesn't replace the person who answers them.

## EC's answers (20 Oct 2026)

| # | Question | EC's answer | What it means for the plan |
| --- | --- | --- | --- |
| 1 | WhatsApp number | +855 69 713 244 | The WhatsApp Business app runs on this number. The site can link to it (`https://wa.me/85569713244`) |
| 2 | Budget | "As low as possible - ideally should be 0" | Step 1 costs nothing. Anything that costs money waits until it's needed |
| 3 | Is a person on shift at all hours? | "No - but we are often awake" | **The site's promise "within 2 hours, day or night, weekends included" isn't backed by cover.** It should change before any bot repeats it (see "Reply-time promise") |
| 4 | What the bot may say | "Should just be a receptionist. Gather basic info and arrange a call back/follow up from a human." | Every automatic reply asks for the same few details and says a person will follow up. No answers to questions, no AI replies |
| 5 | Who takes over | "Myself or Patrick" | EC and Patrick own every new conversation (internal docs only; the site never names people) |
| 6 | What hello@ is | "It is a group" | Google Groups has its own auto-reply, so direct emails need no code |
| 7 | AI provider and model | "Yes if needed. Haiku is probably fine." | Not needed for a receptionist. Kept as an optional later step (Claude Haiku 5.5, a fraction of a cent per draft) |
| 8 | Meta business portfolio | "Yes it does" | WhatsApp automation (step 3) is possible later without new Meta set-up |
| 9 | Storing WhatsApp chat state in D1 | "Yes it can" | Only needed for step 3 |
| 10 | Who signs off privacy changes | "Me" | EC approves the privacy policy wording |

## Recommendation: step 1 now, at A$0

| Channel | First reply | Cost | Who sets it up |
| --- | --- | --- | --- |
| **WhatsApp** (+855 69 713 244) | The free WhatsApp Business app's **greeting message**, written as a receptionist: asks for name, business, what they need, and the best time and number for a call back | A$0 | EC, on the phone (steps below; about 30 minutes) |
| **Site form** | `/api/enquiry` sends a **confirmation email** through Resend (free plan) right after the enquiry reaches hello@: fixed text, offers a call back | A$0 | Me (code on a branch; EC's yes to merge) |
| **Direct email to hello@** | The **Google Group's auto-reply** for people outside Me², with the same receptionist wording | A$0 | EC, in Google Groups (steps below; 5 minutes) |
| **The site** | A plain "Message us on WhatsApp" link next to the email line, the reply-time wording EC picks, and the privacy policy additions | A$0 | Me, in the same branch as the confirmation email |

**Later, only if needed:**
- **AI-drafted replies for EC and Patrick** (Claude Haiku 5.5, about US$0.001 a draft, so cents a month): a suggested reply at the foot of each form enquiry email. Needs an Anthropic account with a payment method, made by EC. Not needed for a receptionist.
- **A WhatsApp receptionist that asks follow-up questions** (several messages back and forth). The free app can't do this; it needs the WhatsApp Business Platform. To keep it at about A$0 a month, Me² would register as a Meta Tech Provider (no partner fee, but Meta's app review); Meta's fees stay at zero below 1,000 replies a month per number. Worth it only if the single greeting isn't collecting what's needed.
- **A booking link** so people can pick their own call-back time: Google Calendar's appointment schedule may already be included in Me²'s Workspace (check the plan); the site already has a `BOOKING_URL` setting and a hidden "Book a call" button (`enableBooking`).
- **A "nobody has replied yet" alert** (a free Google Apps Script) if replies start slipping past the promised time.

Not recommended: **Meta Business Agent** (Meta's own AI in the WhatsApp Business app). We wouldn't write or check what it says, and it does more than a receptionist should.

## Reply-time promise (decision needed)

The site says "within 2 hours" in four places: the FAQ answer ("Within 2 hours of your enquiry, day or night, weekends included."), which also feeds the FAQ structured data and `llms.txt`; the form's success line; the `/thanks/` page; and the `/thanks/` page description in `src/data/routes.json`. `scripts/check-home.mjs` checks two of them word for word.

EC's answer to question 3 means the "day or night" promise can be broken overnight, and the bots would repeat it to every enquirer. Two honest ways to say it (both are suggestions; `site.ts` is the copy of record):

- **A. "Usually within 2 hours" (recommended).** FAQ: "Usually within 2 hours, evenings and weekends included." Form and `/thanks/`: "We'll reply to the email you gave us, usually within 2 hours." The bots say "usually within 2 hours". True without fixing hours.
- **B. Fixed hours.** FAQ: "Within 2 hours, [7 am to 11 pm] [Adelaide] time, every day. Outside those hours, first thing the next morning." Needs EC to set hours that he and Patrick can always cover, and a WhatsApp away message for the rest.

The wording below uses A.

## Wording (Australian English, no banned words, Me² as the visible name)

Every automatic message says it's automatic, asks only for contact details and a short description (BRIEF data rule), and never writes as if a person sent it.

**WhatsApp greeting** (sent on someone's first message, and again after 14 days of quiet):
> Thanks for messaging Me². This is an automatic reply.
>
> So we can arrange a call back, please send us:
> 1. Your name and your business
> 2. What you'd like a hand with
> 3. The best time and number to call you, or an email address
>
> A person from our team will get back to you, usually within 2 hours. Please don't send details about your clients or customers.
>
> How we handle your details: mesquaredagency.com/privacy/

**Form confirmation email** (subject "We've received your enquiry"):
> Thanks for getting in touch with Me².
>
> This is an automatic reply to confirm your enquiry reached us. A person from our team will reply to this email, usually within 2 hours.
>
> If you'd rather talk, reply with a good time and the number to call, and we'll ring you then.
>
> Me²
> https://mesquaredagency.com

**hello@ group auto-reply** (people outside Me² only):
> Thanks for your email to Me². This is an automatic reply to confirm it reached us. A person from our team will reply, usually within 2 hours.
>
> If you're asking about our services, it helps to include your name, your business, what you'd like a hand with, and a good time and number to call you. We'll arrange a call back.
>
> Me²
> https://mesquaredagency.com

---

## Step 1 in detail

### WhatsApp Business app on +855 69 713 244 (EC, no code)

1. On the phone that holds the number, install **WhatsApp Business**. If the number is on ordinary WhatsApp now, WhatsApp Business can take it over on the same phone and keep the chats.
2. **Business profile:** name Me², a one-line description from the site, website https://mesquaredagency.com, email hello@mesquaredagency.com, hours as EC decides (option A: leave hours unset or "Always open"; option B: the fixed hours).
3. **Business tools → Greeting message:** on, recipients "Everyone", the greeting above.
4. **Away message:** off with option A. With option B, on for "Outside of business hours", saying when a person will be back.
5. **Quick replies** for EC and Patrick: thanks-we'll-call-you, how quotes work, the privacy link.
6. **Labels:** New, Call back booked, Waiting on them, Done.
7. **Linked devices:** link WhatsApp on Patrick's and EC's computers (Settings → Linked devices) so either can answer without the phone.
8. Test from another phone: the greeting arrives once, then not again on the next message.

### hello@ group auto-reply (EC, no code)

1. groups.google.com → hello@ → **Group settings → Email options → Auto replies.**
2. Turn on the reply for **people outside the organisation**; leave replies to people inside Me² off. Form enquiries arrive from website@mesquaredagency.com (inside Me²), so they shouldn't get the group's reply as well as the form confirmation.
3. Paste the wording above and save. It sends to real people as soon as it's saved.
4. Test from a personal address: one auto-reply arrives. Then send a test enquiry through the site (once the form confirmation is live) and check the visitor gets **exactly one** confirmation.

Google Groups doesn't accept incoming emails that are marked as auto-replies, so two autoresponders can't answer each other in a loop. The group can't skip newsletters or cold sales emails sent to hello@: they'll get the reply too, which is harmless.

### Form confirmation email (code, on a branch)

After the enquiry email to hello@ is sent, `/api/enquiry` (in `worker/index.ts`) sends the confirmation through Resend to the address the visitor typed.

- **From** `Me Squared <hello@mesquaredagency.com>` (the plain spelling in the sender name, as the enquiry email uses), **Reply-To** hello@, header `Auto-Submitted: auto-replied`.
- **Fixed text only. It never repeats the visitor's name, message or topic.** Anyone can type someone else's address into the form; if we echoed what they typed, the form could be used to send spam from Me²'s domain. With fixed text the worst case is a stranger receiving one polite, clearly automatic confirmation.
- **Live site only.** Preview links run the same Worker, so previews skip it (as `/api/assessments` already restricts itself to the live host). Bots that the form drops get nothing.
- A failed confirmation never turns a delivered enquiry into "didn't send".
- Each enquiry now uses two of Resend's free 100 emails a day (shared with job applications). Fine at today's volume; the rate-limiting rule in DEPLOY.md matters more now.
- The words live in `src/content/site.ts`. docs/forms.md, DEPLOY.md, DECISIONS.md and the README checklist change in the same branch.
- Testing: on EC's say-so, one test enquiry from EC's own address on the live site after merge (previews don't send it).

### Site changes (same branch)

- `WHATSAPP_NUMBER: '+85569713244'` in `src/config/site.config.ts` (the only place identity lives; empty hides the link).
- "Message us on WhatsApp" as a plain link beside the email line in the contact section and the footer. **A link, not a chat widget** (chat widgets are out of scope, BRIEF §3); it adds no third-party script and needs no security-header change. Optionally in `llms.txt`.
- The reply-time wording EC picks, in `site.ts`, `routes.json` and `check-home.mjs`.
- The privacy policy additions below, with a new "Last updated" date.

### Privacy policy additions (EC approves)

- **WhatsApp:** "If you message us on WhatsApp, we collect your phone number, your WhatsApp profile name and what you send us, so we can reply and arrange a call back. WhatsApp is provided by Meta. Our first reply is automatic, and says so."
- **Call backs:** the phone number someone gives for a call back, and that we use it only to call them about their enquiry.
- **Form confirmation:** "When you send an enquiry, we email you an automatic confirmation."
- **Overseas providers:** add Meta to Cloudflare, Resend and Google (APP 8).
- If AI drafting is added later: a paragraph that an AI service (Anthropic's Claude) helps draft replies, a Me² person checks every reply before it's sent, and the provider processes messages in the United States without training its models on them. Check Anthropic's current data terms first (its privacy centre says API inputs and outputs are deleted within 30 days) so the FAQ's "never used to train AI models" stays true.

---

## Background: the options compared

### WhatsApp

Meta stopped charging per conversation on 1 July 2025 and now charges per delivered message. Replies within 24 hours of a customer's message ("service messages") were free until 30 Sep 2026; **from 1 Oct 2026 the first 1,000 a month per number are free**, then about A$0.0148 each to Australian numbers (third-party figure; check Meta's AUD rate card). Messages customers send are never charged. None of this applies to the free WhatsApp Business app.

| | (a) WhatsApp Business app | (b) WhatsApp Business Platform (Cloud API) | (c) Meta Business Agent |
| --- | --- | --- | --- |
| First reply | The greeting message (fixed text) | A webhook on our Cloudflare Worker; can ask follow-up questions | Meta's AI |
| Where people answer | The app, plus linked computers | With "coexistence": the same app. Without it: a paid partner inbox, or one we'd build (out of scope) | The app |
| Set-up | 30 minutes, no code | Business verification, Tech Provider status or a partner, webhook code, secrets | No code |
| Running cost | A$0 | A$0 as a Tech Provider below 1,000 replies a month; a partner costs about €49 a month per number (360dialog's lowest tier, third-party figure) | Meta lists US$2 per million tokens (about 4–5 US cents a message); app billing unclear |
| Hand-over | The person replies | The person replies in the app; the Worker sees it (`smb_message_echoes`) and stops | Meta's rules |
| Limits | Greeting only on a first message or after 14 days of quiet | Meta's policy needs a clear escalation path to a person; coexistence turns off broadcast lists, disappearing messages and view once in the app | We don't control what it says |

If (b) is ever built: `GET/POST /api/whatsapp` on the Worker; check Meta's `X-Hub-Signature-256` signature; reply 200 at once and do the work in `waitUntil` (fits Workers Free's 10 ms CPU, since waiting on Meta or Claude isn't CPU time); ask the receptionist questions one at a time with fixed text or Claude Haiku 5.5; email the collected details to hello@; go silent in a chat once EC or Patrick replies from the app. State (message IDs, a hash of the number, who has taken over; no message text) in the existing D1 database, which EC has OK'd. Secrets set by EC with `npx wrangler versions secret put`. Never log numbers or messages.

### Email (hello@ is a Google Group)

| Option | For | Against |
| --- | --- | --- |
| **Group auto-reply** *(recommended)* | No code, free, separate replies for inside and outside Me², loop-safe | Answers newsletters and sales emails too; no AI later |
| Gmail filter + "Send template" | No code | Replies to every matching email, so two autoresponders can loop until Gmail's sending limit stops hello@ |
| Google Apps Script | Full control; can save AI drafts and run a "no reply yet" alert | Runs in a member's mailbox and needs a send-as alias for hello@; more to maintain. Keep for later |
| Cloudflare Worker | Same code base | Needs hello@'s MX records moved off Google, which breaks Workspace mail. Not possible |

## Still open

1. **Reply-time wording:** A ("usually within 2 hours", recommended) or B (fixed hours, which ones)?
2. **Go-ahead to build** the form confirmation email, the WhatsApp link and the copy and privacy changes on a branch (no merge without EC's yes).
3. Optional, any time: a booking link for call backs.

---

## Sources (checked 19 Oct 2026)

- Meta, [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing): per-message pricing since 1 Jul 2025; service messages charged after 1,000 free per number per month from 1 Oct 2026; Meta Business Agent at US$2 per million tokens; AUD rate card available.
- Superbench, [WhatsApp Business pricing changes 2026](https://superbench.ai/whatsapp-business-pricing-changes-2026/): Australian rates A$0.0148 (service, utility) and A$0.1095 (marketing). Third-party; confirm on Meta's rate card.
- Meta, [Onboard WhatsApp Business app users (coexistence)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/): Solution Partners and Tech Providers only; app 2.24.17+; app messages stay free; `smb_message_echoes`; features turned off in the app.
- WhatsApp, [Business Messaging Policy](https://whatsappbusiness.com/policy/): automation allowed within the 24-hour window with prompt, clear and direct escalation paths; profile with support contact details.
- TechCrunch, [WhatsApp bars general-purpose chatbots](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/) (from 15 Jan 2026): business customer-service bots still allowed. [Meta's AI agent for WhatsApp Business is now available globally](https://techcrunch.com/2026/06/03/metas-ai-agent-for-whatsapp-business-is-now-available-globally/) (3 Jun 2026).
- WhatsApp Business app greeting (first message, and after 14 days of quiet) and away messages: help-centre summaries, e.g. [Rasayel](https://learn.rasayel.io/en/books/whatsapp/whatsapp-business-app/greeting-and-away-messages).
- 360dialog, [prices and plans](https://docs.360dialog.com/docs/360dialog/prices-plans-and-payment-options); tier amounts from third-party summaries.
- Google, [Google Groups auto replies](https://support.google.com/a/users/answer/4399701) (Owner or Manager; Group settings → Email options; separate replies inside and outside the organisation); [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas).
- Anthropic, [how long API data is kept](https://privacy.claude.com/en/articles/7996866-how-long-does-anthropic-store-my-organizations-data); Claude Haiku 5.5 at US$0.10 / US$0.50 per million input / output tokens (Anthropic's current model list).
- Resend's free plan (3,000 emails a month, 100 a day) and Workers Free limits: DEPLOY.md.
