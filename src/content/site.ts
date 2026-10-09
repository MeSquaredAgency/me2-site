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
    h1: 'AI does the volume. **People own the outcome.**',
    subhead:
      '{SITE_NAME} sets up AI roles for the repetitive work, and trained operators to run them and check what they produce. You get the work done without hiring for it or babysitting another tool.',
    kicker: 'Back-office work, handled',
    primary: 'Talk to us',
    secondary: 'See it in action',
    /** Label on the checkpoint in the hero animation */
    gateLabel: 'Human check',
    /** Hero square: what the three kinds of square mean */
    legendLabel: 'How to read the square',
    legend: ['Drafted by AI', 'Checked by a person', 'Caught and corrected'],
    scrollLabel: 'Scroll to the next section',
    /** showLocations */
    location: 'Command Centre teams in Adelaide and Phnom Penh.',
  },

  marquee: {
    label: 'Work we take on',
    items: [
      'Inspection reports',
      'Rent arrears reminders',
      'Inbox sorting',
      'Leasing enquiry replies',
      'Maintenance follow-ups',
      'Owner and landlord reports',
      'Data entry',
      'Weekly reporting',
    ],
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
    pileLabel: 'Work waiting on someone',
    paragraphs: [
      'Every new client brings more inbox, more reports and more chasing. Hiring to keep up is slow and expensive, and the work still lands on your best people.',
      "AI tools on their own don't fix it. Someone still has to set them up, check what they produce and fix what they get wrong. That someone is usually you.",
    ],
  },

  demo: {
    eyebrow: 'See it in action',
    h2: 'One task, **start to finish.**',
    intro: 'An AI Role drafts the work. A trained operator checks every name, date and number against the source before anything leaves. This is what that looks like.',
    srSummary: 'Illustration: an AI Role drafts a weekly arrears summary. An operator checks it against the rent ledger, finds that the draft shows $1,200 owing for Unit 3 when the ledger shows $1,020, corrects it, completes the remaining checks and signs it off for the property manager to approve.',
    windowTitle: 'Weekly arrears summary · sample agency',
    roleLabel: 'AI Role · Arrears summary',
    operatorLabel: 'Operator check',
    draftTitle: 'Weekly arrears summary',
    lines: [
      { unit: 'Unit 3', days: '16 days overdue', amount: '$1,200', amountFixed: '$1,020' },
      { unit: 'Unit 9', days: '4 days overdue', amount: '$640', amountFixed: '' },
    ],
    suggestion: 'Suggested next step: send the standard reminder to Unit 3.',
    ledgerTitle: 'Source: rent ledger',
    ledger: [
      { unit: 'Unit 3', days: '16 days', amount: '$1,020' },
      { unit: 'Unit 9', days: '4 days', amount: '$640' },
    ],
    checks: [
      'Tenancies match the records',
      'Days overdue match the ledger',
      'Amounts match the ledger',
      'Agency template and tone',
    ],
    failIndex: 2,
    failNote: 'Unit 3: draft said $1,200, ledger says $1,020. Corrected.',
    signoff: 'Checked and signed off. Ready for the property manager to approve.',
    status: {
      drafting: 'AI Role drafting…',
      checking: 'Operator checking against the rent ledger…',
      done: 'Checked and signed off',
    },
    note: 'Illustration with made-up sample data.',
    replay: 'Replay the demo',
  },

  model: {
    eyebrow: 'How we work',
    h2: 'Every task runs on **four parts.**',
    intro: "AI on its own makes confident mistakes. People on their own are slow and expensive. We use both, with written processes and checking, on every piece of work.",
    parts: [
      { title: 'AI', body: 'Drafts reports, sorts inboxes, extracts and summarises. It does the first pass, fast.' },
      { title: 'Human judgement', body: 'A trained operator asks the question AI can\'t: does this make sense for this client, today?' },
      { title: 'Written processes', body: 'Every repeat task has a written, approved way of doing it. If it happens more than twice a month, it gets one.' },
      { title: 'Quality checks', body: 'Every task is checked before it goes out. A sample is checked again by someone else, and work involving money or legal notices gets a second person.' },
    ],
    rule: 'AI drafts. **People decide.**',
    stepsTitle: 'The eight steps behind every task',
    steps: [
      { title: 'Understand the task', body: 'What is being asked, by whom and by when.' },
      { title: 'Follow the process', body: 'The written process for the task. No process yet? We check before we start.' },
      { title: 'Use approved AI', body: 'Only business AI tools we have approved, where the process allows.' },
      { title: 'Review the output', body: 'Read every word. Check every number against the source.' },
      { title: 'Apply judgement', body: 'Does this make sense for this client, today?' },
      { title: 'Quality check', body: 'A self-check every time, plus a second check where the work needs one.' },
      { title: 'Deliver', body: 'Through the channel you agreed, in your templates and tone.' },
      { title: 'Record and flag', body: 'Log the work and raise anything unusual with you straight away.' },
    ],
  },

  compare: {
    eyebrow: 'Why Me²',
    h2: 'Not an assistant to manage. **A result we own.**',
    intro: "Most outsourcing gives you a person and leaves the managing to you. We take on the work itself, and we're responsible for getting it right.",
    tableLabel: 'How Me² compares with a typical virtual assistant service',
    colTopic: 'Topic',
    colThem: 'Typical VA service',
    colUs: 'Me²',
    rows: [
      { topic: 'Who manages the work', them: 'You manage the assistant', us: 'We manage the work and the people doing it' },
      { topic: 'Where quality comes from', them: 'Whoever you happen to get', us: 'Written processes, AI and quality checks' },
      { topic: 'When someone leaves', them: 'Their know-how leaves with them', us: 'It stays in our processes and handover notes' },
      { topic: 'How AI is used', them: 'Informally, if at all', us: 'Built into every suitable task, with clear rules' },
      { topic: 'What you pay for', them: 'Hours', us: 'A defined role or outcome' },
    ],
  },

  how: {
    eyebrow: 'How it works',
    h2: 'The back-office work that buries your team, **handled.**',
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
    eyebrow: 'Services',
    h2: 'Two ways to **start**',
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
    eyebrow: 'First market',
    h2: 'Starting with **real estate**',
    imageAlt: 'A hand holding a set of house keys beside a front door',
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
    eyebrow: 'Questions',
    h2: 'Common **questions**',
    aside: 'Something else on your mind? Ask us directly.',
    asideButton: 'Talk to us',
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
    h2: 'Tell us which task is **eating your week.**',
    body: "Send a short email about the work you'd like off your plate. We'll tell you straight whether we can help.",
    button: 'Talk to us',
    /** enableBooking */
    booking: 'Book a call',
    emailLine: 'Or email us at {CONTACT_EMAIL}',
  },

  footer: {
    contactHeading: 'Contact',
    navHeading: 'On this page',
    imagery: 'Photos are illustrative stock images.',
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
