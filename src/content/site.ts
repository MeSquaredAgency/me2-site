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
      { label: 'What we take on', href: '#use-cases' },
      { label: 'How it works', href: '#how' },
      { label: 'Services', href: '#offers' },
      { label: 'Questions', href: '#faq' },
    ],
    navLabel: 'Sections',
  },

  hero: {
    h1: 'We run the back office. **You run the business.**',
    subhead:
      '{SITE_NAME} takes the repetitive admin off your team: invoices, inboxes, reports, data entry and follow-ups. AI does the first draft, a trained operator checks every detail, and the work comes back done.',
    kicker: 'Managed back-office services',
    primary: 'Talk to us',
    secondary: 'See what we take on',
    /** The live board in the hero: sample work moving through the Command Centre. */
    board: {
      title: 'Command Centre',
      live: 'Live',
      colTask: 'Task',
      colStage: 'Stage',
      stages: {
        queued: 'In queue',
        drafting: 'AI drafting',
        checking: 'Operator checking',
        caught: 'Error caught',
        done: 'Checked, done',
        fixed: 'Corrected, done',
      },
      /** Illustration only: kinds of work and kinds of business, not clients. */
      tasks: [
        { task: 'Supplier bills coded', for: 'Accounting practice', fix: true },
        { task: 'Overdue invoice reminders', for: 'Trades business', fix: false },
        { task: 'Customer email replies', for: 'Online store', fix: false },
        { task: 'New client intake', for: 'Law firm', fix: false },
        { task: 'Weekly sales report', for: 'Wholesaler', fix: true },
        { task: 'Rent arrears summary', for: 'Property manager', fix: false },
        { task: 'Quote follow-ups', for: 'Builder', fix: false },
        { task: 'Timesheets for payroll', for: 'Cleaning company', fix: false },
        { task: 'Meeting notes and actions', for: 'Consultancy', fix: true },
        { task: 'Purchase orders matched', for: 'Distributor', fix: false },
      ],
      note: 'Illustration with sample tasks.',
      srSummary:
        'Illustration: a board of sample tasks from different kinds of business, such as supplier bills for an accounting practice and customer email replies for an online store. Each task is drafted by AI, checked by an operator and marked done. Now and then the check catches an error, and it is corrected before the task is done.',
    },
    /** Key under the board: what the three kinds of square mean */
    legendLabel: 'How to read the board',
    legend: ['Drafted by AI', 'Checked by a person', 'Caught and corrected'],
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
    srSummary: 'Illustration: an AI Role drafts a weekly summary of overdue invoices. An operator checks it against the accounts ledger, finds that the draft shows $1,200 owing on invoice 1042 when the ledger shows $1,020, corrects it, completes the remaining checks and signs it off for you to approve.',
    windowTitle: 'Overdue invoices · sample business',
    roleLabel: 'AI Role · Overdue invoices',
    operatorLabel: 'Operator check',
    draftTitle: 'Overdue invoices this week',
    lines: [
      { unit: 'Invoice 1042', days: '16 days overdue', amount: '$1,200', amountFixed: '$1,020' },
      { unit: 'Invoice 1057', days: '4 days overdue', amount: '$640', amountFixed: '' },
    ],
    suggestion: 'Suggested next step: send the standard reminder for invoice 1042.',
    ledgerTitle: 'Source: accounts ledger',
    ledger: [
      { unit: 'Invoice 1042', days: '16 days', amount: '$1,020' },
      { unit: 'Invoice 1057', days: '4 days', amount: '$640' },
    ],
    checks: [
      'Invoices match the records',
      'Days overdue match the ledger',
      'Amounts match the ledger',
      'Your template and tone',
    ],
    failIndex: 2,
    failNote: 'Invoice 1042: draft said $1,200, ledger says $1,020. Corrected.',
    signoff: 'Checked and signed off. Ready for you to approve.',
    status: {
      drafting: 'AI Role drafting…',
      checking: 'Operator checking against the ledger…',
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

  /**
   * The squares story under the hero. Chapter 1 is the `problem` copy above; these are chapters 2 to 4.
   * Each square on the canvas is a task: piled up, drafted by AI, checked by a person, then the Me² mark.
   */
  story: {
    chapters: [
      {
        label: 'Drafted by AI',
        h2: 'AI does **the volume.**',
        body: 'Drafts reports, sorts inboxes, extracts and summarises. It does the first pass, fast.',
      },
      {
        label: 'Checked by a person',
        h2: 'People own **the outcome.**',
        body: 'A trained operator checks every name, date and number against the source before anything leaves.',
      },
      {
        label: 'Done',
        h2: 'Your team, **squared.**',
        body: 'You get the work done without hiring for it or babysitting another tool.',
      },
    ],
    srSummary:
      'Illustration: small squares, one for each task, pile up unevenly. As the page scrolls they line up as outlines while AI drafts them, turn solid as a person checks each one, with a few caught and corrected, and finally come together as the {SITE_NAME} mark: a large square with a small coral square at its corner.',
  },

  useCases: {
    eyebrow: 'What we take on',
    h2: 'Different businesses. **The same back office.**',
    intro:
      'Every business has admin that is repetitive and still has to be right. These are examples of the work an AI Role drafts and an operator checks.',
    listLabel: 'Examples by kind of business',
    labels: { work: 'The work', ai: 'AI Role drafts', check: 'Operator checks', result: 'You get' },
    /** Examples of the kind of work, not clients or case studies. */
    items: [
      {
        key: 'accounting',
        for: 'Accounting practices',
        work: 'Supplier bills and receipts',
        ai: 'Reads each bill, codes it and prepares it for entry.',
        check: 'Amounts, GST and supplier details against the original.',
        result: 'Bills entered and ready for you to approve.',
      },
      {
        key: 'trades',
        for: 'Trades and construction',
        work: 'Quotes, job sheets and invoices',
        ai: 'Turns job notes into quotes and invoices, and drafts follow-ups for quotes with no reply.',
        check: 'Prices against your rate card and the job notes.',
        result: 'Quotes and invoices ready to send, in your templates.',
      },
      {
        key: 'retail',
        for: 'Online retail',
        work: 'The customer inbox',
        ai: 'Sorts every email and drafts replies about orders, returns and delivery.',
        check: 'Order details, refund amounts and tone.',
        result: 'Replies ready to send, with anything unusual flagged to you.',
      },
      {
        key: 'professional',
        for: 'Professional services',
        work: 'Client intake and onboarding',
        ai: 'Pulls the details from each enquiry into your intake forms and drafts the welcome pack.',
        check: 'Names, dates and contact details against the enquiry.',
        result: 'New client files ready for your team to review.',
      },
      {
        key: 'property',
        for: 'Property management',
        work: 'Arrears and inspection reports',
        ai: 'Works out who is behind on rent, drafts the reminders and writes up inspection notes.',
        check: 'Every amount and date against the ledger and the notes.',
        result: 'Reminders and reports ready for the property manager to approve.',
      },
      {
        key: 'any',
        for: 'Any growing business',
        work: 'Debtors and weekly reporting',
        ai: 'Builds the weekly numbers and drafts reminders for overdue invoices.',
        check: 'Every figure against your accounting system.',
        result: 'A report you can rely on, and reminders ready to send.',
      },
    ],
    note: 'Examples of the kind of work we take on, not client case studies.',
    closing: "Don't see your business here? If the work is repeatable, tell us about it.",
    closingButton: 'Talk to us',
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
        q: 'What kinds of business do you work with?',
        a: "Any business with back-office work that is repetitive and has to be right: practices, trades, retailers, property managers and more. If the work gets done the same way every week, it's worth a conversation.",
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
