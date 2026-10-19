# Automatic first replies on WhatsApp and email: plan

19 October 2026. Branch `reply-bots-plan` (from `origin/main` c3d81c3). Status: **plan for EC; nothing built, nothing sent, no accounts made.**

## Why

EC, 19 Oct 2026: "We will also add bots to reply to whatsapp & initial emails (note I will need your help with this)". Since PR #18 the site promises a reply "within 2 hours of your enquiry, day or night, weekends included". An instant automatic first reply tells people their message arrived and sets that expectation. It doesn't replace the person who answers them.

## Rules every option keeps

- **A Me² person owns every conversation.** The bot acknowledges, and at most (step 3, if EC agrees) answers simple questions from an approved fact sheet. A person, named by role, then takes the conversation over.
- **Every automatic message says it is automatic** and that a person will reply within 2 hours. It never uses a person's name, never writes as if it were a person, and never claims a person has read the message.
- **The bot never** quotes prices or figures (everything is quoted), promises a start date or scope beyond the FAQ, accepts or turns down work, gives legal, tax or financial advice, or names staff or clients.
- **Data rule:** it asks for contact details and a short description only, and reminds people not to send client or customer details.
- **Logs** hold no names, numbers, addresses or message text (as `/api/enquiry` does today).
- Nothing emails or messages real people, and nothing goes live, without EC's yes.

## Recommendation

Do it in three steps, and let real enquiries show whether step 3 is worth paying for.

| Step | What | Running cost | Work |
| --- | --- | --- | --- |
| **1. Acknowledge (no AI)** | WhatsApp: the free WhatsApp Business app on a dedicated Me² number, with a greeting message. Site form: an automatic acknowledgement email sent by `/api/enquiry`. Direct email to hello@: a small Google Apps Script that acknowledges new outside emails once per conversation, and alerts the escalation contact when nobody has replied after 90 minutes. | About A$0 a month, plus the phone number | About a day, after EC's answers |
| **2. AI drafts, a person sends** | Claude drafts a suggested reply to every enquiry: inside the enquiry email for form enquiries, and as a Gmail draft in the thread for direct emails. The person on shift edits it and sends it. Nothing AI-written goes out unchecked. | About US$0.04 a draft on Claude Opus 5.5, or about US$0.001 on Claude Haiku 5.5 (EC's choice) | About two days |
| **3. WhatsApp automation** (only if WhatsApp volume justifies it) | WhatsApp Business Platform with "coexistence", so the team keeps answering in the app while a webhook on the existing Cloudflare Worker sends the acknowledgement, emails an AI draft to the person on shift, and goes quiet as soon as a person replies. | Roughly €49+ a month for a partner, plus Meta's per-message fees after 1,000 free replies a month, plus AI drafts | Three to five days, plus Meta's verification wait |

Not recommended for now: **Meta Business Agent** (Meta's own AI, now built into the WhatsApp Business app). It needs no code, but its answers aren't written or checked by us, messages are processed by Meta's AI, and the FAQ promises "Your data is never used to train AI models", which we can't check against Meta's terms for it yet. Revisit once Meta publishes clear controls and data terms.

---

## 1. WhatsApp

**Correction to the brief:** Meta stopped charging per conversation on 1 July 2025 and now charges per delivered message. Replies inside the 24-hour window after a customer writes ("service messages") were free until 30 Sep 2026. **From 1 Oct 2026 they are free for the first 1,000 a month per number**, then charged (a third-party list puts Australian recipients at about A$0.0148 each; check Meta's AUD rate card). Messages customers send to Me² are never charged.

| | (a) WhatsApp Business app | (b) WhatsApp Business Platform (Cloud API) | (c) Meta Business Agent |
| --- | --- | --- | --- |
| What sends the first reply | The app's greeting message (fixed text) | Our webhook on the Cloudflare Worker (fixed text, plus an AI draft for the person) | Meta's AI, set up in the app |
| Where people answer | In the app on the Command Centre phone, and on linked computers (WhatsApp Web or desktop) | With coexistence: in the same app. Without it: a partner's paid inbox, or a tool we'd have to build (out of scope) | In the app |
| Set-up | An hour, no code | Meta Business verification, a partner or Tech Provider status, webhook code, secrets, testing | An hour, no code |
| Running cost | Free (plus the number) | Partner fee + Meta fees above 1,000 replies a month + AI drafts + possibly Workers Paid (US$5 a month) | Meta's price list shows US$2 per million tokens (about 4–5 US cents a message); how it's billed to small businesses on the app (WhatsApp Business Premium tiers) isn't clear yet |
| AI | None | Ours, with our rules and our fact sheet | Meta's, with Meta's controls |
| Hand-over | The person simply replies | The person replies in the app; the Worker sees it (`smb_message_echoes`) and stops | Meta's hand-over rules |
| Main risk | Greeting fires only on a first message (and again after 14 days of quiet), so later messages get no automatic reply | Cost and set-up effort; Meta verification needs the legal entity (BRIEF open decision 4) | We don't control or check what it says |

### (a) Set-up steps (no code)

1. EC picks the number (question 1). A dedicated Me² number on a phone the Command Centre keeps, never a personal phone. A landline can verify by voice call.
2. Install **WhatsApp Business**, register the number, and fill in the profile: name Me², category, description from the site's opening line, website, email hello@, hours "Always open" (matching the 24/7 promise).
3. **Greeting message:** on, to everyone. Draft wording in section 3.
4. **Away message:** off while the team is on 24/7 (it would repeat itself on every message). If the team isn't really on all hours, the site's promise has to change first (question 3).
5. **Quick replies** for the people answering: how quotes work, the privacy link, "send us your email and we'll follow up there".
6. **Labels** for ownership: New, Owner: [role], Waiting on client, Done.
7. **Linked devices:** link WhatsApp Web or desktop on the Command Centre computers so whoever is on shift can answer.
8. Test from a team member's own phone.

### (b) Set-up steps (Cloud API with coexistence)

1. **Meta Business portfolio** owned by Me², not a person (the Facebook page suggests one may exist; question 8), and **business verification**. Meta asks for the legal business name and documents that match the website and domain. **This is blocked until the contracting entity is confirmed** (BRIEF open decision 4, Patrick + lawyer).
2. **Route.** Coexistence (one number on both the app and the API) can only be set up by a Meta Solution Partner or Tech Provider. Options:
   - **a partner** such as 360dialog (third-party sources list about €49 a month per number), connected with the app number through Meta's Embedded Signup; the partner forwards webhooks to our Worker. *Recommended if we do (b).*
   - **Me² becomes a Tech Provider** itself: no partner fee, but Meta's app review and more set-up.
   - **API only, no app:** a new number not on the app. The team then needs an inbox to reply in, which means a paid partner inbox or building one (needs sign-in and a database, out of scope). Not recommended.
3. Display name approval, and a WhatsApp profile with support contact details (Meta's policy requires this, and requires a "prompt, clear and direct" escalation path from any automation: here, a person in the same chat, and hello@).
4. **Webhook** `/api/whatsapp` on the existing Worker (`worker/index.ts`), sketched:
   - `GET`: answers Meta's verification challenge with a verify token.
   - `POST`: checks the `X-Hub-Signature-256` HMAC over the raw body with the app secret (reject anything that fails), replies 200 at once, and does the rest in `ctx.waitUntil` (Meta retries slow webhooks).
   - **Customer message:** skip if seen before (Meta's message ID). If no person has replied in this chat and the bot hasn't sent an acknowledgement in the last 24 hours, send the acknowledgement (a free service message). In step 2 and later, ask Claude for a suggested reply and email the message, the number and the suggestion to hello@ for the person on shift.
   - **`smb_message_echoes`** (a person replied from the app): mark the chat as taken over; the bot stays silent in that chat for, say, 14 days.
   - Never log the number or the message.
5. **Secrets** (EC sets them with `npx wrangler versions secret put`, never in code or chat): Meta system-user token, app secret, verify token, `ANTHROPIC_API_KEY` (step 2), partner API key if a partner is used.
6. **State:** a small table in the existing D1 database (message IDs, a hash of the number, when the bot last wrote, when a person took over; no message text). BRIEF lists "database" as out of scope for the site; D1 is already used for assessments, so this needs EC's OK and a DECISIONS.md line (question 9).
7. **Fit on Workers Free (10 ms CPU):** checking the signature and parsing a small JSON body fit; time spent waiting for Meta or Claude isn't CPU time; `waitUntil` allows 30 seconds after the reply. If the logs show CPU-limit errors, move to Workers Paid (US$5 a month).
8. **Testing:** Meta's test number first, then EC's own phone. No real customers until EC says yes.

### Running costs for (b), per month

| Item | Cost |
| --- | --- |
| Partner (if used) | About €49 per number (360dialog's lowest tier, third-party figure) |
| Meta | Free up to 1,000 service replies per number; then about A$0.0148 each to Australian numbers. A template (needed only to message someone more than 24 hours after their last message) is about A$0.0148 (utility) or A$0.1095 (marketing) |
| AI drafts | About US$0.04 each on Claude Opus 5.5, about US$0.001 on Claude Haiku 5.5 |
| Cloudflare | Free plan probably enough; US$5 if not |

---

## 2. Email (hello@mesquaredagency.com, Google Workspace)

### 2.1 Acknowledgement for site-form enquiries (`/api/enquiry`)

After the enquiry email to hello@ is sent successfully, the Worker sends a second email through Resend to the address the visitor typed.

- **From** `Me Squared <hello@mesquaredagency.com>` (the plain spelling in the sender name, as the enquiry email does today), **Reply-To** hello@, header **`Auto-Submitted: auto-replied`** so other autoresponders don't answer it and start a loop. Resend can already send as any address on the verified domain.
- **Fixed text only. It never repeats the visitor's name, message or topic.** Anyone can type someone else's address into the form; if we echoed what they typed, the form would become a free way to send spam or abuse from Me²'s domain. With fixed text the worst case is a stranger receiving one polite, clearly automatic "we got your enquiry".
- **Only on the live site.** Preview links run the same Worker; on previews, skip the acknowledgement (as `/api/assessments` already restricts itself to the live host).
- **Never for dropped bots** (hidden field or too fast), which already get a pretend success.
- **One request:** send both emails in one call to Resend's batch endpoint, or send the acknowledgement only after the hello@ email succeeds. A failed acknowledgement must not turn a delivered enquiry into "didn't send".
- **Limits:** each enquiry now uses two of Resend's free 100 emails a day (shared with job applications). Fine at today's volume; the rate-limiting rule in DEPLOY.md matters more now.
- **Copy:** the form's success message and `/thanks/` could add "We've emailed you a confirmation." (a suggestion for EC; the copy of record is `src/content/site.ts`). The acknowledgement's words would live in `site.ts` too.
- Docs to update with it: docs/forms.md, DEPLOY.md, README checklist, DECISIONS.md.

Step 2 adds the AI draft here: the Worker asks Claude for a suggested reply (with a timeout, say 8 seconds) and puts it at the foot of the enquiry email to hello@, clearly marked "Suggested reply, written by AI: check before sending". If Claude is slow or fails, the enquiry email goes without it.

### 2.2 First replies to direct emails

| Option | How | For | Against |
| --- | --- | --- | --- |
| **Built-in auto-reply** | If hello@ is a Google Group: Group settings → Email options → Auto replies (separate text for people outside Me²). If it's a user mailbox: Gmail's vacation responder | No code; Google runs it | Can't skip newsletters, cold sales emails or no-reply senders. The vacation responder is likely to answer the form notifications too (from website@, Reply-To the visitor), so the visitor could get two acknowledgements: test before relying on it. It answers each sender only once every few days. No AI step later |
| **Gmail filter + template** | A filter on `to:hello@` with the "Send template" action | No code | Replies to *every* matching email, with no once-per-sender limit, so two autoresponders can answer each other in a loop until Gmail's daily sending limit stops hello@ altogether. Not recommended |
| **Google Apps Script** *(recommended)* | A script on the hello@ mailbox, run every 5 minutes, acknowledges the first email of each new conversation from outside Me² | Full control over who gets a reply; free (Workspace allows 1,500 recipients a day); the same script later saves AI drafts and runs the 90-minute alert; mail never leaves Google for the acknowledgement | Runs under one Google account (it should be the hello@ account, not a person's); up to 5 minutes' delay; the script lives in Google, so a copy is kept in this repo for review |
| **Cloudflare Worker** | Cloudflare Email Routing to a Worker | Same code base as the site | Needs hello@'s MX records moved off Google, which would break Workspace mail. Not possible under the project rules |

**Apps Script, sketched** (a copy kept in the repo, e.g. `ops/hello-auto-reply/`):

- Look at new inbox threads addressed to hello@ from outside `mesquaredagency.com`. Skipping our own domain also skips the form notifications from website@, so form enquiries get only the Worker's acknowledgement.
- Skip anything automatic or bulk: `Auto-Submitted` other than `no`, `Precedence: bulk/list/junk`, `List-Id` or `List-Unsubscribe` headers, and no-reply, mailer-daemon and postmaster senders.
- Skip threads a person has already replied in, and senders acknowledged in the last 7 days.
- Reply in the thread from hello@ with the fixed text (section 3), with `Auto-Submitted: auto-replied` (needs the Gmail advanced service, since the plain one can't set headers), and label the thread "Acknowledged".
- **90-minute alert:** any outside thread with no reply from a Me² address after 90 minutes triggers an email to the escalation contact (question 5). This is what actually protects the 2-hour promise.
- Step 2: for each new thread, call Claude and save a suggested reply as a **Gmail draft** in the thread for the person on shift. Apps Script has no Anthropic SDK, so it calls the API over HTTPS; the API key sits in the script's properties, set by EC.

---

## 3. How a person keeps ownership

| Channel | First reply | Who is told | Who replies | How the bot knows to stop | Safety net |
| --- | --- | --- | --- | --- | --- |
| WhatsApp, step 1 | App greeting (first message, or after 14 days of quiet) | The phone and linked computers ring | The person on shift, in the app | It only ever sends the greeting | Labels; a shift check of unread chats |
| WhatsApp, step 3 | Webhook acknowledgement | Email to hello@ with the message and an AI draft | The person on shift, in the app | A person's reply arrives as `smb_message_echoes`; the bot goes silent in that chat | The 90-minute alert covers WhatsApp too if the webhook logs unanswered chats |
| Site form | Worker acknowledgement email | The enquiry email in hello@ (step 2: with a suggested reply) | The person on shift, replying to the enquiry email | It sends once per enquiry | 90-minute alert |
| Direct email | Apps Script acknowledgement | The thread in hello@ (step 2: with a draft) | The person on shift | Once per thread; never after a person has replied | 90-minute alert |

**Wording (drafts for EC; Australian English, no banned words, Me² as the visible name):**

WhatsApp greeting:
> Thanks for messaging Me². This is an automatic reply: a person from our team will reply here within 2 hours, day or night, weekends included. To help them, tell us a little about the work you'd like a hand with. Please don't send details about your clients or customers. How we handle your details: mesquaredagency.com/privacy/

Form acknowledgement (subject "We've received your enquiry"):
> Thanks for getting in touch with Me².
>
> This is an automatic reply to confirm your enquiry reached us. A person from our team will reply to this email address within 2 hours, day or night, weekends included.
>
> If you'd like to add anything, reply to this email.
>
> Me²
> https://mesquaredagency.com

Direct-email acknowledgement: the same, starting "Thanks for your email to Me²."

**If EC later wants AI replies sent without a person (step 3 only):** limit them to an approved list of question types (what Me² does, how quotes work, where the team is based, reply times, the terms in the FAQ), built only from the site's own copy in `src/content/site.ts`. Each starts "Automatic reply from Me²:" and ends with "A person from our team will pick this up within 2 hours." Anything else gets the plain acknowledgement and goes to a person. Review the first 50 drafts with EC before switching any automatic sending on.

---

## 4. Privacy policy and site changes

The privacy policy (`privacy` in `src/content/site.ts`, reviewed by EC on 16 Oct 2026) describes what the site does today: the form, email, Cloudflare, Resend and Google. It needs, in the same change as each step:

- **Step 1 (WhatsApp, email acknowledgements):** a "If you message us on WhatsApp" paragraph: we collect your number, profile name and messages; WhatsApp is provided by Meta; chats are kept on the Command Centre's phone and linked computers. A line that the first reply may be automatic and says so. Meta added to the list of providers that may process information outside Australia (APP 8).
- **Step 2 (AI drafts):** a paragraph saying we use an AI service (Anthropic's Claude) to help draft replies; a Me² person checks every reply before it's sent; the provider processes the message in the United States and doesn't use it to train its models; Anthropic added to the overseas providers. Before this goes live, confirm Anthropic's current commercial and data-retention terms (its privacy centre says API inputs and outputs are deleted within 30 days) still match the FAQ's "never used to train AI models".
- **Step 3:** the partner (e.g. 360dialog) and Meta's Cloud API added as providers; how long WhatsApp records are kept.
- Change "Last updated". From 10 Dec 2026 Australian privacy law also requires disclosing automated decisions that significantly affect people; a reply bot that never decides anything about a person stays outside that, which is one more reason the bot never accepts or turns down work. BRIEF open decision 6 says the policy needs Patrick and a lawyer; EC decides whether they see these changes.

**Site:**
- If the WhatsApp number is published: `WHATSAPP_NUMBER` in `src/config/site.config.ts` (the only place identity lives; empty hides it), a plain "Message us on WhatsApp" link (`https://wa.me/<number>`) beside the email line in the contact section and footer, optionally in the structured data and `llms.txt`. A link only: **chat widgets are out of scope for the website** (BRIEF §3), and a link adds no third-party script and needs no CSP change.
- The FAQ "How quickly will you reply?" could add "on WhatsApp and email". Suggestion only.
- The form's success line and `/thanks/` (2.1).
- docs/forms.md, DEPLOY.md (new secrets, Resend usage), docs/flags.md if a flag is added, DECISIONS.md, the README checklist. If `@anthropic-ai/sdk` is used in the Worker for step 2, it's a new dependency and needs a DECISIONS.md line (CLAUDE.md lists allowed ones).

---

## 5. Questions for EC (my suggested answer after each)

1. **Which WhatsApp number?** A new dedicated Me² number, or one already in use? Australian (+61) or Cambodian (+855)? Who holds the phone? Will it go on the website? *Suggest: a new dedicated number held by the Command Centre, shown on the site once step 1 is running.*
2. **Budget?** A monthly ceiling for all of it. *Suggest: A$0 for step 1; up to about A$30 a month for step 2; decide on step 3 (about A$100+ a month) after four weeks of real volume.*
3. **Hours: is a person really on shift at all hours, every day?** The site promises a reply within 2 hours, day or night, weekends included. A bot can acknowledge at 3 am but can't keep that promise. *If not 24/7, change the promise on the site before any bot goes live.*
4. **What may the bot say?** Approve the rules and the three drafts in section 3. AI drafts for a person to send (step 2), or also AI replies sent automatically (step 3)? *Suggest: acknowledgements only, AI drafts for people, no automatic AI answers until EC has reviewed 50 drafts.*
5. **Who picks up the hand-over?** Which role is on shift, how shifts hand over, and who gets the 90-minute alert (email, phone or Telegram)? *Suggest: the Command Centre person on shift owns new enquiries; EC gets the alert.*
6. **What is hello@ in Google Workspace?** A user mailbox, a Google Group, or an alias on someone's mailbox, and who can read it? *Suggest: a mailbox or collaborative-inbox group that isn't a person's own, so the script never runs in someone's personal mail.*
7. **AI provider and model?** OK to send enquiry text to Anthropic (processed in the US) for drafts? Claude Opus 5.5 (the default, about US$0.04 a draft) or Claude Haiku 5.5 (about US$0.001)? *EC's choice.*
8. **Meta account:** does Me² have a Meta Business portfolio (the Facebook page suggests so), owned by the business, and is the legal entity settled enough for business verification? *Step 3 waits on this.*
9. **Storage:** OK to keep minimal WhatsApp chat state (no message text) in the existing Cloudflare D1 database? *Only needed for step 3.*
10. **Privacy policy:** who signs off the changes in section 4: EC alone, or Patrick and a lawyer (BRIEF open decision 6)?

---

## Sources (checked 19 Oct 2026)

- Meta, [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing): per-message pricing since 1 Jul 2025; service messages charged after 1,000 free per number per month from 1 Oct 2026; utility templates inside the window charged from 1 Oct 2026; AUD rate card available.
- Superbench, [WhatsApp Business pricing changes 2026](https://superbench.ai/whatsapp-business-pricing-changes-2026/): Australian rates A$0.0148 (service, utility) and A$0.1095 (marketing). Third-party; confirm on Meta's rate card.
- Meta, [Onboard WhatsApp Business app users (coexistence)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/): Solution Partners and Tech Providers only; app 2.24.17+; app messages stay free; `smb_message_echoes`; features turned off in the app.
- WhatsApp, [Business Messaging Policy](https://whatsappbusiness.com/policy/): automation allowed in the 24-hour window with prompt, clear and direct escalation paths; profile with support contact details.
- TechCrunch, [WhatsApp bars general-purpose chatbots](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/) (from 15 Jan 2026): business customer-service bots are still allowed.
- TechCrunch, [Meta's AI agent for WhatsApp Business is now available globally](https://techcrunch.com/2026/06/03/metas-ai-agent-for-whatsapp-business-is-now-available-globally/) (3 Jun 2026); its US$2 per million tokens rate is on Meta's pricing page above.
- 360dialog, [prices and plans](https://docs.360dialog.com/docs/360dialog/prices-plans-and-payment-options); tier amounts from third-party summaries.
- Google, [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas) (Workspace: 1,500 email recipients a day); [Google Groups auto replies](https://support.google.com/a/users/answer/4399701).
- Anthropic, [how long API data is kept](https://privacy.claude.com/en/articles/7996866-how-long-does-anthropic-store-my-organizations-data); Claude prices from Anthropic's current model list (Opus 5.5 US$4 / US$20, Haiku 5.5 US$0.10 / US$0.50 per million input / output tokens). Draft estimates assume about 4,000 tokens in and 1,000 out.
- Resend's free plan (3,000 emails a month, 100 a day) and Workers Free limits: DEPLOY.md.
