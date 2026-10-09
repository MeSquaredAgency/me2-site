/**
 * Headings may wrap their bold part in **double asterisks**; `Emph` renders it as <strong>.
 * All visible copy, word for word from BRIEF Appendix A, in section order.
 * Placeholders like {SITE_NAME} are filled from the config by `fill()`; never type them out.
 * Don't rewrite copy here unless EC asks.
 */
export const content = {
  ui: {
    skipLink: 'Skip to content',
    logoLabel: '{SITE_NAME_PLAIN}',
    logoHomeLabel: '{SITE_NAME_PLAIN} home',
    subjects: {
      general: 'Website enquiry',
      aiRoles: 'AI Roles enquiry',
      ebu: 'Effective Business Units enquiry',
    },
    form: {
      name: 'Your name',
      email: 'Work email',
      business: 'Business name',
      task: 'What work would you like off your plate?',
      taskHint: "A sentence or two is plenty. Please don't include client, customer or tenant details.",
      submit: 'Send enquiry',
      sending: 'Sending…',
      required: 'Please fill in this field.',
      emailError: 'Enter an email address like name@business.com.au.',
      tooLong: 'Keep this under 2,000 characters.',
      success: "Enquiry sent. We'll reply to the email you gave us.",
      failure: "Your enquiry didn't send. Email us at {CONTACT_EMAIL} instead.",
      turnstileFailure: "We couldn't confirm you're not a bot. Try again, or email us at {CONTACT_EMAIL}.",
      fallback: 'Prefer email? Write to {CONTACT_EMAIL}',
    },
  },

  header: {
    button: 'Talk to us',
    nav: [
      { label: 'How it works', href: '#how' },
      { label: 'Services', href: '#offers' },
      { label: 'Real estate', href: '#real-estate' },
      { label: 'Questions', href: '#faq' },
    ],
    navLabel: 'Sections',
  },

  hero: {
    h1: 'The back-office work that buries your team, **handled.**',
    subhead:
      '{SITE_NAME} sets up AI roles for the repetitive work, and trained operators to run them and check what they produce. You get the work done without hiring for it or babysitting another tool.',
    primary: 'Talk to us',
    secondary: 'See how it works',
    /** showLocations */
    location: 'Command Centre teams in Adelaide and Phnom Penh.',
  },

  pillars: [
    { big: 'AI', small: 'does the first pass' },
    { big: 'People', small: 'check every output' },
    { big: 'One job', small: 'is enough to start' },
    { big: 'Your tools', small: 'are where we start' },
  ],

  problem: {
    eyebrow: 'The problem',
    h2: 'Admin grows faster than **headcount.**',
    /** Illustration only: the kinds of work that pile up (from the audience description). */
    pile: ['Inbox', 'Weekly reports', 'Overdue reminders', 'Data entry'],
    pileStatus: 'Waiting',
    paragraphs: [
      'Every new client brings more inbox, more reports and more chasing. Hiring to keep up is slow and expensive, and the work still lands on your best people.',
      "AI tools on their own don't fix it. Someone still has to set them up, check what they produce and fix what they get wrong. That someone is usually you.",
    ],
  },

  how: {
    eyebrow: 'How it works',
    h2: 'AI does the volume. **People own the outcome.**',
    stepLabel: 'Step',
    cta: 'Talk to us',
    intro: "We don't hand you software and walk away. We take on the work.",
    steps: [
      {
        title: 'We map the work',
        body: 'We start with the tasks that eat the most hours and get done the same way every time.',
      },
      {
        title: 'AI roles do the first pass',
        body: "Each AI role handles one job: drafting a report, sorting an inbox, working out what's owed, preparing a summary.",
      },
      {
        title: 'A person checks it',
        body: 'Every output gets checked before it counts, by your team or by a trained {SITE_NAME} operator. AI drafts, people decide.',
      },
    ],
  },

  offers: {
    h2: 'Two ways to start',
    intro: 'Start with one job, or hand over a whole workload.',
    cards: [
      {
        key: 'aiRoles',
        name: 'AI Roles',
        body: 'One AI role for one job, set up around how your team already works. Your team reviews the output and stays in control.',
        bestFor: 'Best for teams that know exactly which task is eating their week.',
        /** showPricing */
        price: 'From $2,000 AUD [[TBC: billing basis and GST wording — Patrick]]',
        button: 'Ask about AI Roles',
      },
      {
        key: 'ebu',
        name: 'Effective Business Units',
        body: 'A trained Command Centre operator runs a set of AI roles for you as a managed service. They check the work, handle the exceptions and report back to you.',
        bestFor: 'Best for businesses that want a whole workload off their plate.',
        /** showPricing */
        price: 'From $3,000 AUD [[TBC: billing basis and GST wording — Patrick]]',
        button: 'Ask about Effective Business Units',
      },
    ],
  },

  realEstate: {
    h2: 'Starting with real estate',
    body: 'Real estate is our first market. Property management runs on high-volume, repeatable admin, which is exactly the kind of work AI roles and trained operators are built for.',
    listIntro: 'Roles we set up for agencies include:',
    list: [
      'Drafting routine inspection reports for review',
      'Tracking rent arrears and preparing reminders',
      'Sorting and routing the property management inbox',
      'Drafting replies to leasing enquiries',
      'Logging and following up maintenance requests',
      'Preparing owner and landlord reports',
    ],
    closing: "Not in real estate? If your team has repeatable back-office work, we'd like to hear about it.",
    /** showProof */
    proof: '[[TBC: client case study, approved in writing by the client — EC]]',
  },

  faq: {
    h2: 'Common questions',
    items: [
      {
        q: 'Do we have to change the software we use?',
        a: "We start from the tools and processes you already use and set each AI role up around them. If something would need to change, we'll tell you before we start.",
      },
      {
        q: "Who checks the AI's work?",
        a: 'With an AI Role, your team reviews the output. With an Effective Business Unit, a trained {SITE_NAME} operator checks it before it reaches you. Either way, a person signs off.',
      },
      {
        q: "What's the difference between the two options?",
        a: 'An AI Role is one tool for one job that your team runs. An Effective Business Unit is a managed service: a {SITE_NAME} operator runs several AI roles for you and owns the result.',
      },
      {
        q: 'Is this only for real estate?',
        a: 'No. Real estate is where we started. The same approach suits any business with repeatable back-office work.',
      },
      {
        q: 'Where is the team based?',
        a: 'Our Command Centre runs across Adelaide and Phnom Penh, Cambodia.',
        flag: 'showLocations',
      },
      {
        q: 'How do we get started?',
        a: "Email us about the task that takes up the most time. We'll tell you whether it's a fit, and what an AI Role or Effective Business Unit for it would look like.",
      },
    ],
  },

  finalCta: {
    h2: 'Tell us which task is eating your week.',
    body: "Send a short email about the work you'd like off your plate. We'll tell you straight whether we can help.",
    button: 'Talk to us',
    /** enableBooking */
    booking: 'Book a call',
    emailLine: 'Or email us at {CONTACT_EMAIL}',
  },

  footer: {
    copyright: '© {YEAR} {SITE_NAME}',
    /** showPrivacyPage */
    privacy: 'Privacy',
  },

  notFound: {
    h1: 'Page not found',
    body: "This page doesn't exist or has moved.",
    button: 'Go to the home page',
  },

  privacy: {
    h1: 'Privacy',
    body: '[[TBC: lawyer-reviewed privacy policy text, including offshore disclosure — Patrick + lawyer]]',
    contact: 'Questions about privacy: {PRIVACY_EMAIL}',
  },
} as const;
