/**
 * All visible copy, in section order (BRIEF Appendix A, v0.15 "Lit").
 * v0.15 copy is a DRAFT for EC's approval: the agency positioning (design, build, run), the six named
 * AI roles and the privacy policy are new; lines reused from the approved v0.14 copy are marked "approved".
 * Prices are EC's (9 Oct 2026): an AI role from $2,000 + GST to set up; an EBU from $3,000 + GST a month.
 * Placeholders like {SITE_NAME} are filled from the config by `fill()`; never type them out.
 * Don't rewrite copy here unless EC asks.
 */
export const content = {
  ui: {
    skipLink: 'Skip to content',
    logoLabel: '{SITE_NAME_PLAIN}',
    logoHomeLabel: '{SITE_NAME_PLAIN} home',
    /** Mailto subjects, for the plain email links that remain (and when the form is switched off). */
    subjects: { general: 'Website enquiry' },
    viewProject: 'View',
  },

  header: {
    button: 'Talk to us',
    nav: [
      { label: 'Work', href: '#work' },
      { label: 'Start here', href: '#services' },
      { label: 'How we work', href: '#how' },
      { label: 'Questions', href: '#faq' },
    ],
    navLabel: 'Sections',
  },

  hero: {
    /** approved (v0.10, EC's preferred hero, again on 10 Oct 2026). Two sentences, each set on two lines. */
    h1: 'AI does the volume. People own the outcome.',
    /** The screen in the mark cycles through the three services, each with its caption. */
    scenes: [
      { scene: 'design', label: 'Websites and digital products' },
      { scene: 'build', label: 'AI systems that do real work' },
      { scene: 'run', label: 'Your back office, checked by people' },
    ],
    scenesLabel: 'Show',
    subhead:
      '{SITE_NAME} is one team for the digital side of an established business. We design your website, build the AI systems behind it and run the back-office work that keeps it all moving.',
    primary: 'Talk to us',
    secondary: 'See our work',
    markSummary:
      'Illustration: the {SITE_NAME} mark, a dark glass square with a small coral square glowing at its corner. The glass is a screen that shows the work: a web page being designed, an AI role drafting, and the Command Centre board of back-office tasks being checked.',
    /** showLocations (approved) */
    location: 'Command Centre teams in Adelaide and Phnom Penh.',
  },

  /** Illustrations on the hero screen (decorative; described for screen readers). */
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

  /** The Run scene: a live board of sample back-office tasks (illustration; kinds of business, never clients). */
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
     * and must be confirmed or removed before launch. Never use screenshots that show or name individual people.
     */
    items: [
      {
        key: 'apnre',
        name: 'APN Real Estate',
        what: 'A new website for a South Australian real estate agency with offices in Adelaide and Mount Gambier: sales, leasing and property management, with an appraisal request a tap away on every page.',
        services: ['Design', 'Build'],
        year: '2026',
        url: 'https://apnre.com.au/',
        linkText: 'Visit apnre.com.au',
        /** src/assets/work/<file>.png; "phone" shots sit in a phone frame. */
        shots: [
          { file: 'apnre', kind: 'wide' },
          { file: 'apnre-phone', kind: 'phone' },
          { file: 'apnre-phone-2', kind: 'phone' },
          { file: 'apnre-explore', kind: 'wide' },
        ],
        confirmed: false,
      },
    ],
    note: 'More projects are being added.',
  },

  /** Start here: the offer, named and priced. */
  offer: {
    kicker: 'Start here',
    h2: 'Start with one job.',
    intro:
      "Pick one AI role for one job, hand over a whole workload, or bring us a website. We'll tell you straight whether it's a fit.",
    roles: {
      name: 'AI Roles',
      /** showPricing */
      price: 'From $2,000 + GST to set up',
      /** approved (v0.14 offers) */
      body: 'One AI role for one job, set up around how your team already works. Your team reviews the output and stays in control.',
      bestFor: 'Best for teams that know exactly which task is eating their week.',
      listLabel: 'AI roles you can start with',
      /** Six named roles, drawn from the v0.13 use-case examples. EC to confirm each is deliverable. */
      items: [
        { name: 'Inbox triage', outcome: 'Every incoming email sorted, and a reply drafted in your tone for you to approve.' },
        { name: 'Debtor follow-up', outcome: 'Overdue invoices chased on schedule, with every amount matched to your accounts.' },
        { name: 'Bill coding', outcome: 'Supplier bills read, coded and prepared for entry, ready for you to approve.' },
        { name: 'Weekly reporting', outcome: 'The numbers you check every week, pulled together and written up for you.' },
        { name: 'Client intake', outcome: 'New enquiries turned into client files, with a welcome pack drafted.' },
        { name: 'Quote follow-up', outcome: 'Every quote without a reply gets a follow-up, drafted from the job notes.' },
      ],
      button: 'Ask about this role',
      also: 'Need something these don\'t cover, like an automation between your tools or a dashboard? Tell us the job.',
    },
    ebu: {
      name: 'Effective Business Units',
      /** showPricing */
      price: 'From $3,000 + GST a month',
      /** approved (v0.14 offers) */
      body: 'A trained Command Centre operator runs a set of AI roles for you as a managed service. They check the work, handle the exceptions and report back to you.',
      bestFor: 'Best for businesses that want a whole workload off their plate.',
      includes: ['A trained operator who owns the work', 'Every output checked before it reaches you', 'Exceptions handled and reported back', 'A written process for every repeat task'],
      button: 'Ask about an Effective Business Unit',
      topic: 'Effective Business Unit',
    },
    web: {
      name: 'Websites and digital products',
      /** showPricing */
      price: 'Quoted per project',
      body: 'Sites and products that make an established business look like what it is: clear to read, quick to load and built to win the enquiry.',
      includes: ['Websites and landing pages', 'Interface design for portals and apps', 'Copy and content structure', 'Search and performance foundations'],
      button: 'Ask about a website',
      topic: 'Website or digital product',
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
        q: 'What does it cost?',
        a: 'An AI role starts from $2,000 + GST to set up. An Effective Business Unit starts from $3,000 + GST a month. Websites and other builds are quoted per project once we understand the job.',
        flag: 'showPricing',
      },
      {
        q: 'Do we have to change the software we use?',
        a: "We start from the tools and processes you already use and set each AI role up around them. If something would need to change, we'll tell you before we start.",
      },
      {
        q: "Who checks the AI's work?",
        a: 'A person, every time. With an AI role, your team reviews the output and stays in control. With an Effective Business Unit, a trained {SITE_NAME} operator checks it before it reaches you.',
      },
      {
        q: 'Where is the team based?',
        a: 'Our Command Centre runs across Adelaide and Phnom Penh, Cambodia.',
        flag: 'showLocations',
      },
      {
        q: 'How do we get started?',
        a: "Send us a short note about what you're working on. We'll tell you whether it's a fit, and what the first step would look like.",
      },
    ],
  },

  /** The close, with the enquiry form. */
  contact: {
    h2: 'Your business, squared.',
    body: "Tell us what you're working on: a new site, a system that should exist, or the work that's eating your team's week. We'll tell you straight whether we can help.",
    /** enableBooking */
    booking: 'Book a call',
    emailLine: 'Prefer email? Write to {CONTACT_EMAIL}',
    /** Shown instead of the form when enableContactForm is off. */
    button: 'Talk to us',
  },

  /** The enquiry form: contact details and a short message only (BRIEF data rule). */
  form: {
    title: 'Tell us what you need',
    about: 'About',
    clearAbout: 'Remove',
    generalTopic: 'General enquiry',
    name: 'Your name',
    email: 'Work email',
    message: 'What would you like to talk about?',
    hint: "A sentence or two is plenty. Please don't include client, customer or tenant details.",
    submit: 'Send enquiry',
    sending: 'Sending…',
    required: 'Please fill in this field.',
    emailError: 'Enter an email address like name@business.com.au.',
    tooLong: 'Keep this under 2,000 characters.',
    success: "Enquiry sent. We'll reply to the email you gave us.",
    failure: "Your enquiry didn't send. Email us at {CONTACT_EMAIL} instead.",
    privacy: 'We use these details only to reply to you. See our privacy policy.',
    privacyLink: 'privacy policy',
    close: 'Close',
  },

  /** The page the form lands on without JavaScript. */
  thanks: {
    h1: 'Enquiry sent.',
    body: "We'll reply to the email you gave us.",
    failH1: "Your enquiry didn't send.",
    failBody: 'Email us at {CONTACT_EMAIL} instead.',
    button: 'Back to the home page',
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

  /**
   * DRAFT privacy policy (v0.15) for EC, Patrick and ideally a lawyer to review before it goes live.
   * It describes what the site actually does: one enquiry form, no cookies of its own, hosting on Cloudflare,
   * email in Google Workspace, and a team in Adelaide and Phnom Penh (overseas disclosure, APP 8).
   */
  privacy: {
    h1: 'Privacy',
    updated: 'Last updated 9 October 2026',
    sections: [
      {
        h: 'Who we are',
        p: ['{SITE_NAME} ({SITE_NAME_PLAIN}) designs and builds websites and AI systems and runs back-office work for businesses. This policy explains how we handle personal information we collect through this website. "We" means {SITE_NAME}.'],
      },
      {
        h: 'What we collect',
        p: [
          'When you send an enquiry through the form on this site, we collect your name, your work email address, what you write in your message and which part of the site you sent it from. Please don\'t include details about your clients, customers or tenants.',
          'If you email us, we collect your email address and whatever your email contains.',
          'Our hosting provider, Cloudflare, processes technical information such as your IP address and browser type to deliver this site and protect it from abuse. This site doesn\'t set cookies of its own and doesn\'t use advertising or tracking tools.',
        ],
      },
      {
        h: 'How we use it',
        p: [
          'We use your details to reply to your enquiry, to discuss and provide our services if you go ahead, and to keep a record of our correspondence.',
          'We don\'t sell personal information and we don\'t add you to a mailing list.',
        ],
      },
      {
        h: 'Where it is kept and who can see it',
        p: [
          'Enquiries are emailed to our team and kept in our business email system, which is provided by Google.',
          'Our team works from Adelaide and from Phnom Penh, Cambodia, so people in Cambodia may see your enquiry when they help us respond. Our service providers, Cloudflare and Google, may store or process information on servers outside Australia.',
        ],
      },
      {
        h: 'Keeping it safe',
        p: ['We take reasonable steps to protect personal information from misuse, loss and unauthorised access, and we delete enquiries we no longer need.'],
      },
      {
        h: 'Seeing or correcting your information',
        p: ['You can ask to see or correct the personal information we hold about you by emailing {PRIVACY_EMAIL}. We\'ll respond within 30 days.'],
      },
      {
        h: 'Questions and complaints',
        p: ['If you have a question or a concern about how we have handled your information, email {PRIVACY_EMAIL}. If you are not satisfied with our response, you can contact the Office of the Australian Information Commissioner at oaic.gov.au.'],
      },
      {
        h: 'Changes',
        p: ['We may update this policy from time to time. The current version is always on this page.'],
      },
    ],
  },
} as const;
