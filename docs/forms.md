# The enquiry form

## What it asks for
Three things, and nothing else: **your name**, **email** (any address; owners of smaller businesses often use a personal one), and **what you need a hand with** (up to 2,000 characters). The hint under the message box asks people not to include client or customer details. Never add fields for financial, health or identity information (BRIEF data rule).

Two things are added automatically so leads arrive labelled:
- **Topic**: what the person clicked, e.g. "Whole back office", "Extra set of hands", "Website or digital product", "Something else", or "General enquiry". They can remove it in the form.
- **Source**: which part of the page they clicked it in (header, hero, start-here, questions, contact).

## Where it goes
`/api/enquiry` in `worker/index.ts` checks the enquiry and emails it through Resend to `hello@mesquaredagency.com` from `website@mesquaredagency.com`, subject "Website enquiry: {topic} ({name})", with the sender's address as Reply-To, so pressing Reply answers them. Both addresses come from `src/config/site.config.ts` (`FORM_TO_EMAIL`, `FORM_FROM_EMAIL`). Setup: [DEPLOY.md](../DEPLOY.md#enquiry-form-email).

## The automatic confirmation (since 20 Oct 2026)
Once the enquiry has reached hello@, the live site emails the visitor a confirmation through Resend: from "Me Squared" <hello@mesquaredagency.com>, Reply-To hello@, subject "We've received your enquiry". It says it's an automatic reply, that a person will reply, usually within 2 hours, and that they can reply with a good time and number for a call back (EC, 20 Oct 2026: the first reply is a receptionist; EC or Patrick follows up).

- **Fixed text only.** It never repeats the visitor's name, message or topic: anyone can type someone else's address into the form, and echoing what they typed would let strangers send their words from Me²'s domain.
- **Live site only.** Preview links and local runs send the enquiry to hello@ as before, but no confirmation.
- It's sent after the visitor is told "Enquiry sent", so a failed confirmation never makes a delivered enquiry look failed. The logs show `enquiry-confirmation` `sent` or `send-failed`, never who.
- It carries `Auto-Submitted: auto-replied`, so well-behaved autoresponders don't answer it.
- When the visitor replies, the reply reaches hello@, where the Google Group's own auto-reply may answer it too (see [auto-replies.md](auto-replies.md)).
- Each enquiry now uses two of Resend's free 100 emails a day (shared with job applications).
- Switch: `sendEnquiryConfirmation` in `src/config/flags.ts`. Words: `enquiryConfirmation` in `src/content/site.ts`. Checks: `node scripts/check-enquiry.mjs` (no network; Resend is stubbed).

## How it behaves
| Situation | What the visitor sees |
| --- | --- |
| A "Talk to us" or "Ask about…" button anywhere on the page | The form opens in place (a dialog), with the topic shown at the top |
| A field missing or the email not an email address | The message under that field, naming the field ("Enter your name.", "Enter your email address.", "Tell us a little about what you need."), and the cursor goes to it |
| Sent | The page goes to `/thanks/` (with or without JavaScript): "Enquiry sent. We'll reply to the email you gave us, usually within 2 hours." (EC, 20 Oct 2026: "usually", since nobody is on shift overnight), then an animated "What happens next" in three steps (EC, 27 Oct 2026; words in `thanks` in `src/content/site.ts`). `/thanks/` is noindex and only reached by sending, so it is the Google Ads "contact received" page and a GA4 page view. On the live site, the automatic confirmation email follows |
| Couldn't send (not set up yet, Cloudflare error, no connection) | "Your enquiry didn't send. What you wrote is still here: try again, or email us at hello@….", with the address as a link; what they typed stays in the form |
| No JavaScript | The buttons jump to the form at the foot of the page; it posts normally and lands on `/thanks/` or `/not-sent/` |
| A bot (fills the hidden field, or submits within 2.5 seconds) | Told it worked; nothing is sent |

## Changing the wording
All the form's words are in `form` (and `thanks`, and `enquiryConfirmation` for the confirmation email) in `src/content/site.ts`.

## Testing it
Locally: `npm run build`, then `npx wrangler dev --local --local-protocol https`. Without a `RESEND_API_KEY` the form reports "didn't send" (by design); to send real test emails locally, put the key in a git-ignored `.dev.vars` file as `RESEND_API_KEY=…`. On a preview link or the live site, once the secret is set in Cloudflare, real emails arrive in hello@. The confirmation to the visitor only goes from the live site, so test it there, from your own address, after the change is live.

## Sender names and the footer

Every email the site sends names Me² as the sender: "Me²" for the visitor's confirmation, "Me² website" for enquiries and chat hand-overs to hello@, "Me² careers" for applications to people@ (EC, 23 Oct 2026; the name goes out as an RFC 2047 encoded-word so the ² survives every mail program). The confirmation is the one email that leaves Me², so it carries the same compliance footer Google Workspace adds to the team's mail, with the logo (`worker/email.ts`; wording in `content.emailFooter`). Google can't add its own footer here: these emails go out through Resend, never through Gmail.
