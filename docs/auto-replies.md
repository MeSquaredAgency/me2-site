# Automatic first replies

Every enquiry gets an instant automatic reply that works like a receptionist: it says it's automatic, asks for the few details needed to arrange a call back, and says a person will get back to them, usually within 2 hours. EC or Patrick then follows up. Nothing automatic answers questions, quotes, or pretends to be a person (EC, 20 Oct 2026; plan: [docs/superpowers/specs/2026-10-19-reply-bots.md](superpowers/specs/2026-10-19-reply-bots.md)).

| Channel | What sends the reply | Where it's set up | Cost |
| --- | --- | --- | --- |
| Site form | The website (`/api/enquiry`), through Resend | In the code: [forms.md](forms.md#the-automatic-confirmation-since-20-oct-2026) | Free (Resend's free plan) |
| WhatsApp, +855 69 713 244 | The WhatsApp Business app's greeting message | On the phone (below) | Free |
| Email to hello@ | The hello@ Google Group's auto-reply | In Google Groups (below) | Free |

**If the reply time changes**, change it in all four places: the FAQ, form and `/thanks/` wording in `src/content/site.ts` (plus the `/thanks/` description in `src/data/routes.json`), the confirmation email (`enquiryConfirmation`, same file), the WhatsApp greeting, and the group auto-reply.

## WhatsApp greeting (set up by EC, on the phone)

1. On the phone that holds +855 69 713 244, install **WhatsApp Business**. If the number is on ordinary WhatsApp now, WhatsApp Business can take it over on the same phone and keep the chats.
2. **Business profile:** name Me², a one-line description, website https://mesquaredagency.com, email hello@mesquaredagency.com.
3. **Business tools → Greeting message:** on, recipients "Everyone", with this text:

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

   WhatsApp sends it on someone's first message, and again if they write after 14 days of quiet.
4. **Away message:** leave off (the reply time is "usually within 2 hours", not fixed hours).
5. **Quick replies** for answering: for example, a thank-you that confirms the call-back time, how quotes work, and the privacy link.
6. **Labels:** New, Call back booked, Waiting on them, Done.
7. **Linked devices** (Settings → Linked devices): link WhatsApp on EC's and Patrick's computers so either can answer without the phone.
8. Test from another phone: the greeting arrives once, and not again on the next message.

## hello@ group auto-reply (set up by EC, in Google Groups)

1. groups.google.com → hello@ → **Group settings → Email options → Auto replies** (needs the Owner or Manager role).
2. Turn on the reply for **people outside the organisation**. Leave replies to people inside Me² off: form enquiries arrive from website@mesquaredagency.com, and the visitor already gets the form's own confirmation.
3. Paste this text and save. **It starts replying to real people as soon as it's saved.**

   > Thanks for your email to Me². This is an automatic reply to confirm it reached us. A person from our team will reply, usually within 2 hours.
   >
   > If you're asking about our services, it helps to include your name, your business, what you'd like a hand with, and a good time and number to call you. We'll arrange a call back.
   >
   > Me²
   > https://mesquaredagency.com

4. Test from a personal address: one auto-reply arrives.
5. Once the form confirmation is live, send a test enquiry through the site from your own address and check you get **exactly one** confirmation. If a second reply arrives from the group, the group counts website@ as outside: tell me and we'll change how the form sends.

**Worth knowing:**
- Google Groups doesn't accept incoming emails marked as auto-replies, so two autoresponders can't answer each other in a loop.
- The group replies to everything from outside, including newsletters and sales emails. That's harmless.
- When someone replies to the form's confirmation (say, with a call-back time), their reply reaches hello@ from outside, so the group's auto-reply may answer it as well. If that gets annoying, the group's reply can be turned off and the form's confirmation alone kept.
