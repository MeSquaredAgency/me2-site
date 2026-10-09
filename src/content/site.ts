/**
 * All visible copy, in section order (BRIEF Appendix A, v0.15 "Lit").
 * v0.15 copy is a DRAFT for EC's approval: the agency positioning (design, build, run) is new;
 * lines reused from the approved v0.14 copy are marked "approved" below.
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
      design: 'Design enquiry',
      build: 'AI systems enquiry',
      run: 'Back office enquiry',
    },
    form: {
      name: 'Your name',
      email: 'Work email',
      business: 'Business name',
      task: 'What would you like to talk about?',
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
    viewProject: 'View',
  },

  header: {
    button: 'Talk to us',
    nav: [
      { label: 'Work', href: '#work' },
      { label: 'Services', href: '#services' },
      { label: 'How we work', href: '#how' },
      { label: 'Questions', href: '#faq' },
    ],
    navLabel: 'Sections',
  },

  hero: {
    /** Read as one headline; each line carries a short note on wide screens. */
    lines: [
      { text: 'We design it.', note: 'Websites and digital products' },
      { text: 'We build it.', note: 'AI systems that do real work' },
      { text: 'We run it.', note: 'Your back office, checked by people' },
    ],
    subhead:
      '{SITE_NAME} is one team for the digital side of an established business. We design your website, build the AI systems behind it and run the back-office work that keeps it all moving.',
    primary: 'Talk to us',
    secondary: 'See our work',
    markSummary: 'The {SITE_NAME} mark in light: a dark glass square with a small coral square glowing at its corner.',
    /** showLocations (approved) */
    location: 'Command Centre teams in Adelaide and Phnom Penh.',
  },

  /** Read out as one paragraph; the words light up as you scroll. */
  statement: {
    label: 'Why one partner',
    text: 'Most businesses run their digital side through three suppliers: an agency for the website, a developer for the systems and a team buried in the admin they create. Nobody owns the whole picture. We do. One team and one point of accountability, from the first sketch to the thousandth invoice.',
  },

  work: {
    kicker: 'Selected work',
    h2: 'Work we have designed, built and run.',
    /**
     * Real projects only, each with the client's OK (EC). `confirmed: false` items are for the mock-up
     * and must be confirmed or removed before launch. Never use photos that show or name individual people.
     */
    items: [
      {
        key: 'apnre',
        name: 'APN Real Estate',
        what: 'A new website for a South Australian real estate agency with offices in Adelaide and Mount Gambier.',
        services: ['Design', 'Build'],
        year: '2026',
        url: 'https://apnre.com.au/',
        image: 'apnre',
        confirmed: false,
      },
      {
        key: 'project-2',
        name: 'Project to come',
        what: 'Case study in preparation.',
        services: [],
        year: '',
        url: '',
        image: '',
        confirmed: false,
      },
      {
        key: 'project-3',
        name: 'Project to come',
        what: 'Case study in preparation.',
        services: [],
        year: '',
        url: '',
        image: '',
        confirmed: false,
      },
    ],
    note: 'More projects are being added.',
  },

  services: {
    kicker: 'Services',
    h2: 'Three disciplines. One team answerable for all of them.',
    intro: 'Start with one. Add the others when you are ready, and they already fit together.',
    items: [
      {
        key: 'design',
        name: 'Design',
        title: 'Websites and digital products',
        body: 'Sites and products that make an established business look like what it is: clear to read, quick to load and built to win the enquiry.',
        includes: ['Websites and landing pages', 'Interface design for portals and apps', 'Copy and content structure', 'Search and performance foundations'],
        button: 'Ask about design',
        subject: 'design',
      },
      {
        key: 'build',
        name: 'Build',
        title: 'AI systems that do real work',
        body: 'AI roles and automations that take repetitive work off your team, set up around the tools you already use and tested on your own data before they go live.',
        includes: ['AI roles that draft, sort and summarise', 'Automations between the tools you already use', 'Dashboards and internal tools', 'Testing against your own data'],
        button: 'Ask about AI systems',
        subject: 'build',
      },
      {
        key: 'run',
        name: 'Run',
        title: 'Your back office, checked by people',
        /** approved (v0.14 hero and EBU copy, joined) */
        body: 'We take the repetitive admin off your team: invoices, inboxes, reports, data entry and follow-ups. AI does the first draft, a trained operator checks every detail, and the work comes back done.',
        includes: ['Invoices, bills and debtors', 'Inbox and customer replies', 'Weekly reports and data entry', 'Client intake and follow-ups'],
        button: 'Ask about the back office',
        subject: 'run',
      },
    ],
  },

  /** The Run visual: a live board of sample back-office tasks (illustration; kinds of business, never clients). */
  board: {
    title: 'Command Centre',
    live: 'Live',
    stages: {
      queued: 'In queue',
      drafting: 'AI drafting',
      checking: 'Operator checking',
      caught: 'Error caught',
      done: 'Checked, done',
      fixed: 'Corrected, done',
    },
    tasks: [
      { task: 'Supplier bills coded', for: 'Accounting practice', fix: true },
      { task: 'Overdue invoice reminders', for: 'Trades business', fix: false },
      { task: 'Customer email replies', for: 'Online store', fix: false },
      { task: 'New client intake', for: 'Law firm', fix: false },
      { task: 'Weekly sales report', for: 'Wholesaler', fix: true },
      { task: 'Rent arrears summary', for: 'Property manager', fix: false },
      { task: 'Quote follow-ups', for: 'Builder', fix: false },
      { task: 'Timesheets for payroll', for: 'Cleaning company', fix: false },
    ],
    note: 'Illustration with sample tasks.',
    srSummary:
      'Illustration: a board of sample back-office tasks from different kinds of business. Each task is drafted by AI, checked by an operator and marked done. Now and then the check catches an error, and it is corrected before the task is done.',
  },

  /** Illustrations for Design and Build (decorative; described for screen readers). */
  visuals: {
    design: {
      srSummary: 'Illustration: a web page assembling itself, block by block, inside a browser window.',
      url: 'yourbusiness.com.au',
    },
    build: {
      srSummary: 'Illustration: emails, invoices and forms flow into an AI role, are checked by a person, and go out to your accounts, your CRM and your reports.',
      inputs: ['Emails', 'Invoices', 'Forms'],
      core: 'AI role',
      check: 'Checked',
      outputs: ['Accounts', 'CRM', 'Reports'],
    },
  },

  how: {
    kicker: 'How we work',
    h2: 'What you can count on.',
    items: [
      {
        title: 'One team, answerable for all of it.',
        body: 'The people who design your site are the people who build and run what sits behind it. When something needs fixing, there is one team to ask.',
      },
      {
        title: 'A person checks the AI’s work.',
        /** approved (v0.14 story) */
        body: 'A trained operator checks every name, date and number against the source before anything leaves.',
      },
      {
        title: 'Built around how you already work.',
        /** approved (v0.14 FAQ, adapted) */
        body: "We start from the tools and processes you already use. If something would need to change, we'll tell you before we start.",
      },
      {
        title: 'Straight answers.',
        body: "We'll tell you plainly what we can do, what it will take, and when something isn't a fit.",
      },
    ],
  },

  faq: {
    kicker: 'Questions',
    h2: 'Common questions.',
    aside: 'Something else on your mind? Ask us directly.',
    asideButton: 'Talk to us',
    items: [
      {
        q: 'What does {SITE_NAME} actually do?',
        a: 'We design and build websites and digital products, set up AI systems that take on repetitive work, and run back-office work for you as a managed service. You can start with one and add the others later.',
      },
      {
        q: 'Do we have to change the software we use?',
        a: "We start from the tools and processes you already use and set each AI role up around them. If something would need to change, we'll tell you before we start.",
      },
      {
        q: "Who checks the AI's work?",
        a: 'A person, every time. When we run the work for you, a trained {SITE_NAME} operator checks it before it reaches you. When your team runs it, they review the output and stay in control.',
      },
      {
        q: 'Where is the team based?',
        a: 'Our Command Centre runs across Adelaide and Phnom Penh, Cambodia.',
        flag: 'showLocations',
      },
      {
        q: 'How do we get started?',
        a: "Email us about what you're working on. We'll tell you whether it's a fit, and what the first step would look like.",
      },
    ],
  },

  finalCta: {
    h2: 'Your business, squared.',
    body: "Tell us what you're working on: a new site, a system that should exist, or the work that's eating your team's week. We'll tell you straight whether we can help.",
    button: 'Talk to us',
    /** enableBooking */
    booking: 'Book a call',
    emailLine: 'Or email {CONTACT_EMAIL}',
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
