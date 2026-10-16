# The enquiry form

## What it asks for
Three things, and nothing else: **your name**, **email** (any address; owners of smaller businesses often use a personal one), and **what you need a hand with** (up to 2,000 characters). The hint under the message box asks people not to include client or customer details. Never add fields for financial, health or identity information (BRIEF data rule).

Two things are added automatically so leads arrive labelled:
- **Topic**: what the person clicked, e.g. "Whole back office", "Extra set of hands", "Website or digital product", "Something else", or "General enquiry". They can remove it in the form.
- **Source**: which part of the page they clicked it in (header, hero, start-here, questions, contact).

## Where it goes
`/api/enquiry` in `worker/index.ts` checks the enquiry and emails it through Resend to `hello@mesquaredagency.com` from `website@mesquaredagency.com`, subject "Website enquiry: {topic} ({name})", with the sender's address as Reply-To, so pressing Reply answers them. Both addresses come from `src/config/site.config.ts` (`FORM_TO_EMAIL`, `FORM_FROM_EMAIL`). Setup: [DEPLOY.md](../DEPLOY.md#enquiry-form-email).

## How it behaves
| Situation | What the visitor sees |
| --- | --- |
| A "Talk to us" or "Ask about…" button anywhere on the page | The form opens in place (a dialog), with the topic shown at the top |
| A field missing or the email not an email address | The message under that field, naming the field ("Enter your name.", "Enter your email address.", "Tell us a little about what you need."), and the cursor goes to it |
| Sent | "Enquiry sent. We'll reply to the email you gave us within 2 hours." (EC's reply time, 16 Oct 2026; the no-JavaScript /thanks/ page says the same) |
| Couldn't send (not set up yet, Cloudflare error, no connection) | "Your enquiry didn't send. What you wrote is still here: try again, or email us at hello@….", with the address as a link; what they typed stays in the form |
| No JavaScript | The buttons jump to the form at the foot of the page; it posts normally and lands on `/thanks/` or `/not-sent/` |
| A bot (fills the hidden field, or submits within 2.5 seconds) | Told it worked; nothing is sent |

## Changing the wording
All the form's words are in `form` (and `thanks`) in `src/content/site.ts`.

## Testing it
Locally: `npm run build`, then `npx wrangler dev --local --local-protocol https`. Without a `RESEND_API_KEY` the form reports "didn't send" (by design); to send real test emails locally, put the key in a git-ignored `.dev.vars` file as `RESEND_API_KEY=…`. On a preview link or the live site, once the secret is set in Cloudflare, real emails arrive in hello@.
