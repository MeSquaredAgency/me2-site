# Website chat (AI receptionist)

EC, 21 Oct 2026, asked for "an AI chat bot agent" and chose an **AI receptionist on Claude Haiku**, with its button appearing **after the hero**. That overrides two earlier calls on purpose (DECISIONS.md, 21 Oct 2026): chat widgets were out of scope (BRIEF §3), and the 20 Oct reply bots were "no AI replies".

## What the visitor sees
- On the home page only. Once the hero has scrolled away, a dark "Questions? Ask us" button sits bottom right. It steps aside while the contact section or the footer is on screen, where the form and the other ways in already are.
- The chat opens as a warm white card (full screen on phones). The header says **"Automatic assistant (AI). A person follows up."** and the first message, fixed text from the page, says it's an AI.
- The visitor types; the assistant answers in a few sentences. When they want a person, it asks for name, email and a sentence about what they need (business name, phone and a call-back time optional), reads them back, and once the visitor confirms, passes them on. The page then says "Thanks, that's with our team now…" and the chat ends.
- Without JavaScript there is no chat. The form, email and WhatsApp links are all still there.
- The note under the box: "Please don't share client or customer details. See our privacy policy."

## How it works
- `src/components/ChatWidget.astro`: the button, the panel and the script. The page keeps the conversation in memory (never stored, gone on reload) and posts it whole to `/api/chat` each turn.
- `worker/chat.ts`: checks the request (same-origin only, at most 12 visitor messages of up to 1,000 characters, a hidden bot field), applies the rate limit, then calls the Messages API with **`claude-haiku-5-5`** at low effort, through the official `@anthropic-ai/sdk`.
- **What it knows** is built from `src/content/site.ts` at start-up (the subhead, Start here, How we work, the shown FAQ answers, email and WhatsApp), so it can't drift from the page. The rules in the system prompt: say it's an AI; only what the facts say; no prices, figures or promises; never name staff or clients; people first, never AI on its own; no financial, health or identity information or client details; Australian English, the banned words, `Me²`.
- **Passing details on** is a strict tool, `pass_to_team` (name, email, need, business, phone, callback). The Worker checks the email address and emails the details to `FORM_TO_EMAIL` (hello@) through Resend, from website@, Reply-To the visitor, subject "Website chat: <name>" ("[Preview]" first on previews). Only those details are sent, never the conversation. On the live site the visitor then gets the same automatic confirmation as the enquiry form (`sendEnquiryConfirmation`).
- **Fixed replies** (not written by the AI) are in `content.chat`: the intro, passed on, could not pass on, refusal, nothing to say, chat unavailable, too fast, end of chat.
- **Limits:** `CHAT_LIMIT` in `wrangler.jsonc` allows 8 messages a minute from one IP address; the conversation stops after 12 visitor messages (`worker/chat-limits.ts`); replies are capped at 2,000 tokens including thinking.
- **Logs** (Workers Logs): one `chat` line per message with the result (`reply`, `passed-on`, `pass-on-failed`, `refusal`, `api-error`, `rate-limited`, `not-configured`) and the turn count. Never names, emails or what anyone wrote.

## Cost
Claude Haiku 5.5 is US$0.10 per million input tokens and US$0.50 per million output. Each message sends the ~2,000-token prompt plus the conversation and gets a short reply, about **US$0.0005 a message**, so roughly US$0.50 per 1,000 messages. Set a monthly spend limit in the Anthropic Console anyway (DEPLOY.md).

## Setting it up
See [DEPLOY.md](../DEPLOY.md#website-chat-ai). Until `ANTHROPIC_API_KEY` is set, the button still shows and the chat answers "The chat isn't working right now. Email us at hello@… or use the form at the foot of the page." So **set the key before this goes live**, or turn `enableChat` off.

## Switching it off
`enableChat: false` in `src/config/flags.ts` removes the button and makes `/api/chat` answer 404. It also stays off while `showPrivacyPage` is off.

## Checks
`node scripts/check-chat.mjs` runs the route against stubbed Anthropic and Resend APIs: the request sent to Haiku, the prompt's rules, passing details on (live and preview), refusal, API errors, no key, rate limit, other sites, bot field, bad conversations, the flag, and logs free of personal details.
