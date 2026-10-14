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
      { label: 'Work', href: '#work', flag: 'showProof' },
      { label: 'Start here', href: '#services' },
      { label: 'How we work', href: '#how' },
      { label: 'Questions', href: '#faq' },
    ],
    navLabel: 'Sections',
  },

  hero: {
    /** EC's choice (14 Oct 2026): the approved v0.13 hero, people first. Two sentences, each set on two lines. */
    h1: 'We run the back office. You run the business.',
    /** The screen in the mark cycles through the three services, each with its caption. */
    scenes: [
      { scene: 'design', label: 'Websites and digital products' },
      { scene: 'build', label: 'AI agents trained on your business' },
      { scene: 'run', label: 'Your back office, run by people' },
    ],
    scenesLabel: 'Show',
    subhead:
      '{SITE_NAME} is the team behind your business. Our people run your finance, operations and marketing, backed by AI agents trained on how you work, and we design and build the website out front.',
    primary: 'Talk to us',
    /** The hero's second link: to the work, or (while showProof is off) to Start here. */
    secondary: 'See our work',
    secondaryStart: 'See where to start',
    markSummary:
      'Illustration: the {SITE_NAME} mark, a dark glass square with a small coral square glowing at its corner. The glass is a screen that shows the work: a web page being designed, an AI agent drafting for a person to check, and the Command Centre board of back-office tasks being checked.',
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
      srSummary: 'Illustration: emails, invoices and forms flow into an AI agent, are checked by a person, and go out to your accounts, your CRM and your reports.',
      inputs: ['Emails', 'Invoices', 'Forms'],
      core: 'AI agent',
      check: 'Checked',
      outputs: ['Accounts', 'CRM', 'Reports'],
    },
  },

  /** The Run scene: a live board of sample back-office tasks (illustration; kinds of business, never clients). */
  board: {
    title: 'Command Centre',
    live: 'Live',
    stages: {
      queued: 'Assigned',
      drafting: 'Agent drafting',
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
      'Illustration: a board of sample back-office tasks from different kinds of business. Each task is assigned to an operator, drafted by an AI agent and checked by the operator before it is marked done. Now and then the check catches an error, and it is corrected before the task is done.',
  },

  /** Where your week goes: four pains, each picked up by Me² as it settles on screen (EC, 14 Oct 2026: "a penny drop, oh shit moment"). */
  pain: {
    label: 'Where your week goes',
    rows: [
      {
        line: 'The invoice nobody chased is still sitting there.',
        cost: "Work you've already done, waiting to be paid for, because nobody had the hour to follow it up.",
        stamp: 'Finance · owned by {SITE_NAME}',
      },
      {
        line: 'Your best person spent Friday building a report.',
        cost: 'The people who should be selling and looking after customers are doing data entry instead.',
        stamp: 'Operations · owned by {SITE_NAME}',
      },
      {
        line: 'You hired for it. They left, and took the process with them.',
        cost: 'Every new hire starts from scratch, and the backlog is back the week they go.',
        stamp: 'Every process written down · owned by {SITE_NAME}',
      },
      {
        line: 'Three suppliers, and nobody owns the whole picture.',
        cost: 'An agency for the site, a developer for the systems, a bookkeeper for the rest. When something breaks, everyone points somewhere else.',
        stamp: 'One team · owned by {SITE_NAME}',
      },
    ],
    /** Not the hero line again: say each idea once. */
    turn: '{SITE_NAME} is the team behind all of it.',
    turnBody: 'Finance, operations and marketing, owned by people and backed by AI agents trained on your business.',
    link: 'See where to start',
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

  /** Start here: the whole back office (people backed by AI, one monthly price), one job, or a website. EC, 14 Oct 2026. */
  offer: {
    kicker: 'Start here',
    h2: 'Your back office, handled.',
    intro: "One team runs your finance, operations and marketing, so you, your sales team and your front line can do what you're best at.",
    office: {
      name: 'The whole back office',
      /** showPricing. EC: "$3,000 per month for your entire business's backend covered"; a guideline for now. */
      price: 'From $3,000 + GST a month',
      body: 'Trained {SITE_NAME} people own the work, backed by AI agents built around your business. They check every output, handle the exceptions and report back to you.',
      /** Jobs: finance and operations from the v0.15 roles; marketing confirmed by EC on 14 Oct 2026. */
      units: [
        {
          key: 'finance',
          name: 'Finance',
          jobs: [
            { name: 'Debtor follow-up', outcome: 'Overdue invoices chased on schedule, with every amount matched to your accounts.' },
            { name: 'Bill coding', outcome: 'Supplier bills read, coded and prepared for entry, ready for you to approve.' },
            { name: 'Weekly reporting', outcome: 'The numbers you check every week, pulled together and written up for you.' },
          ],
        },
        {
          key: 'operations',
          name: 'Operations',
          jobs: [
            { name: 'Inbox triage', outcome: 'Every incoming email sorted, and a reply drafted in your tone for you to approve.' },
            { name: 'Client intake', outcome: 'New enquiries turned into client files, with a welcome pack drafted.' },
            { name: 'Quote follow-up', outcome: 'Every quote without a reply gets a follow-up, drafted from the job notes.' },
          ],
        },
        {
          key: 'marketing',
          name: 'Marketing',
          jobs: [
            { name: 'Social posts and newsletters', outcome: 'Drafted on schedule in your voice, for you to approve.' },
            { name: 'Enquiry follow-up', outcome: 'Every new enquiry gets a reply and a follow-up.' },
            { name: 'Website updates', outcome: 'New pages, offers and news kept current.' },
            { name: 'Monthly marketing report', outcome: "What ran, what worked and what's next, written up for you." },
          ],
        },
      ],
      process: 'A written process for every repeat task, so the work never depends on one person.',
      button: 'Talk to us about your back office',
      topic: 'Whole back office',
    },
    one: {
      name: 'Start with one job',
      /** showPricing */
      price: 'From $2,000 + GST to set up',
      body: "Not ready to hand over the whole back office? We'll set up one AI agent for one job, built around how your team already works. Your team reviews the output and stays in control.",
      button: 'Ask about one job',
      topic: 'One job',
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
    also: "Need something these don't cover, like an automation between your tools or a dashboard? Tell us the job.",
  },

  how: {
    kicker: 'How we work',
    h2: 'What you can count on.',
    items: [
      {
        title: 'A person owns every task.',
        body: 'Every task has a trained {SITE_NAME} person responsible for it. AI agents do the drafting; that person checks every name, date and number against the source before anything leaves.',
      },
      {
        title: 'One team, answerable for all of it.',
        body: 'The people who design your site are the people who build and run what sits behind it. When something needs fixing, there is one team to ask.',
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
        a: 'We run the back office of established businesses: finance, operations and marketing, done by trained people backed by AI agents built for your business. We also design and build websites. You can start with one job and add the rest later.',
      },
      {
        q: 'What does it cost?',
        a: 'The whole back office starts from $3,000 + GST a month. One job starts from $2,000 + GST to set up. Websites are quoted per project once we understand the job.',
        flag: 'showPricing',
      },
      {
        q: 'Do we have to change the software we use?',
        a: "We start from the tools and processes you already use and set each AI role up around them. If something would need to change, we'll tell you before we start.",
      },
      {
        q: 'Is it people or AI doing the work?',
        a: 'People, backed by AI. Every task is owned by a trained {SITE_NAME} person. AI agents trained on your business do the drafting and the volume, and that person checks it before it reaches you. If you start with one job, your own team reviews the output.',
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
    body: "Tell us what's eating your week: the back-office work you want off your plate, or the website you need. We'll tell you straight whether we can help.",
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
   * form emails delivered by Resend, email in Google Workspace, and a team in Adelaide and Phnom Penh (overseas disclosure, APP 8).
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
          'Enquiries are emailed to our team by Resend, an email delivery service, and kept in our business email system, which is provided by Google.',
          'Our team works from Adelaide and from Phnom Penh, Cambodia, so people in Cambodia may see your enquiry when they help us respond. Our service providers, Cloudflare, Resend and Google, may store or process information on servers outside Australia.',
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
