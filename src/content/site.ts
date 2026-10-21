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
      { scene: 'run', label: 'Run by your own person' },
      { scene: 'design', label: 'Websites and digital products' },
      { scene: 'build', label: 'AI agents that draft, people who check' },
    ],
    scenesLabel: 'Show',
    subhead:
      /** EC, 21 Oct 2026: one person is assigned to each business and works on its back office alone. */
      '{SITE_NAME} gives your business its own trained person, who runs your admin, accounts, customer service and marketing, and works for nobody else. AI agents take the heavy lifting off their hands. We design and build the website out front, too.',
    primary: 'Talk to us',
    /** The hero's second link: to the work, or (while showProof is off) to Start here. */
    secondary: 'See our work',
    secondaryStart: 'See where to start',
    markSummary:
      'Illustration: the {SITE_NAME} mark, a dark glass square with a small coral square glowing at its corner. The glass is a screen that shows the work: the Command Centre board of back-office tasks being checked, a web page being designed, and an AI agent drafting for a person to check.',
    /** showLocations. EC, 19 Oct 2026: "Based in Phnom Penh". */
    location: 'Our Command Centre team is based in Phnom Penh, Cambodia.',
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

  /**
   * The Run scene: a live board of one business's sample back-office tasks (illustration, never a client).
   * One business, not many (EC, 21 Oct 2026): its own person works on it alone.
   */
  board: {
    title: 'Your back office',
    live: 'Live',
    stages: {
      queued: 'Assigned',
      drafting: 'Agent drafting',
      checking: 'Your person checking',
      caught: 'Error caught',
      done: 'Checked, done',
      fixed: 'Corrected, done',
    },
    tasks: [
      { task: 'Supplier bills coded', for: 'Finance', fix: true },
      { task: 'Overdue invoice reminders', for: 'Finance', fix: false },
      { task: 'Customer email replies', for: 'Customer service', fix: false },
      { task: 'New client intake', for: 'Operations', fix: false },
      { task: 'Weekly sales report', for: 'Finance', fix: true },
      { task: 'Social posts for approval', for: 'Social media', fix: false },
      { task: 'Quote follow-ups', for: 'Operations', fix: false },
      { task: 'Timesheets for payroll', for: 'Admin', fix: false },
    ],
    note: 'Illustration with sample tasks.',
    srSummary:
      "Illustration: a board of one business's sample back-office tasks, from finance to customer service. Each task is drafted by an AI agent and checked by the business's own person before it is marked done. Now and then the check catches an error, and it is corrected before the task is done.",
  },

  /** Where your week goes: five pains, each picked up by Me² as it settles on screen (EC, 14 Oct 2026: "a penny drop, oh shit moment"). */
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
        cost: 'The people who should be selling and looking after customers are stuck in spreadsheets instead.',
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
      {
        /** Copy review, 16 Oct 2026: the offer leads with customer service, which the first four rows didn't cover. Weekends are worked (EC, 16 Oct 2026). */
        line: 'That Saturday enquiry got a reply on Tuesday.',
        cost: "By then they'd booked someone else.",
        stamp: 'Customer service · owned by {SITE_NAME}',
      },
    ],
    /** Not the hero line again: say each idea once. */
    turn: '{SITE_NAME} takes all of it off your hands.',
    turnBody: "So you, your sales team and your front line can do what you're best at.",
    link: 'See where to start',
  },

  work: {
    kicker: 'Selected work',
    /** "designed and built", not "and run": the only project (APN Real Estate) is Design and Build. */
    h2: 'Work we have designed and built.',
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

  /** Start here: the whole back office (people backed by AI, one monthly price), an extra set of hands, or a website. EC, 14 Oct 2026. */
  offer: {
    kicker: 'Start here',
    h2: 'Your back office, handled.',
    intro: 'One team for everything behind your front line. Hand over the lot, or start with an extra set of hands.',
    office: {
      name: 'The whole back office',
      /** showPricing. EC, 16 Oct 2026: "prices should be provided upon quotation depending on the clients requirements". One monthly fee (EC, 14 Oct). */
      price: 'Quoted for your business',
      body: 'Your own {SITE_NAME} person owns the work and works for nobody else, backed by AI agents built around how you do things. They check everything before it goes out, deal with anything unusual and report back to you.',
      /**
       * Everything behind the front line (EC, 14 Oct 2026: "it's everything"). Only what Me² can take on today;
       * the examples for operations, finance, marketing and social media come from the confirmed jobs, the rest are new (EC to confirm).
       */
      areas: [
        { name: 'Business operations', example: 'Client intake, quote follow-up and the processes that hold it together.' },
        { name: 'Admin', example: 'Data entry, scheduling, filing and the inbox.' },
        { name: 'Customer service and support', example: 'Customer emails and messages answered in your voice.' },
        { name: 'Finance and accounting', example: 'Debtor follow-up, bill coding and weekly reporting.' },
        { name: 'Marketing', example: 'Newsletters, website updates, enquiry follow-up and a monthly report.' },
        { name: 'Social media', example: 'Posts drafted on schedule in your voice, for you to approve.' },
        { name: 'Paid ads', example: 'Campaigns set up, watched and reported on.' },
      ],
      /** EC: "eventually legal, tech dev, consulting, strategy". */
      coming: 'Coming next: legal, tech development, consulting and strategy.',
      process: 'Every repeat task is written down as a process, so nothing stops if your person is ever away.',
      button: 'Talk to us about your back office',
      topic: 'Whole back office',
    },
    /** EC: "Not in need of a full team, just an extra set of hands to do the admin". A Me² person owns the work; never AI on its own. */
    one: {
      name: 'An extra set of hands',
      /** showPricing. Quoted, like the whole back office (EC, 16 Oct 2026). */
      price: 'Quoted per job',
      body: "Don't need a whole team? A {SITE_NAME} person takes one job off your plate, like the inbox, the invoices or the data entry, backed by an AI agent set up around how you already work. They report back to you, and you stay in control.",
      button: 'Ask about an extra set of hands',
      topic: 'Extra set of hands',
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

  /**
   * The trust section (EC, 21 Oct 2026: "It takes a lot of trust for someone to allow us to run the backend of their business").
   * Each promise rests on terms EC has confirmed: one dedicated person (21 Oct), mistakes fixed at no charge,
   * no lock-in and the client keeps everything (16 Oct). "One team" is said by the pain section; software by the FAQ.
   */
  how: {
    kicker: 'How we work',
    h2: 'Handing over your back office takes trust.',
    intro: "You built this business, and you know what one wrong invoice or one missed customer can cost. So we don't hand you software and a support line. We give you a person.",
    items: [
      {
        title: 'You know who’s looking after you.',
        body: "One {SITE_NAME} person is assigned to your business and works for nobody else. They learn how you like things done, and they're the one you message when something comes up.",
      },
      {
        title: 'A person owns every task.',
        body: 'AI agents do the drafting. Your {SITE_NAME} person checks every name, date and number against the source before anything leaves.',
      },
      {
        title: 'If we get it wrong, we own it.',
        body: "You hear it from us, not your customers. We put it right at no charge and change the process so it doesn't happen again.",
      },
      {
        title: 'Your business stays yours.',
        body: "Your data, your logins and every process we write down belong to you. There's no lock-in, so we only keep your work by doing it well.",
      },
    ],
    /** showFounderNote. Patrick's own words, signed (EC, 21 Oct 2026); never written for him. Shown only once `note` is filled in. */
    founder: {
      label: 'A note from our founder',
      note: '' as string,
      name: '' as string,
      role: '' as string,
    },
  },

  faq: {
    kicker: 'Questions',
    h2: 'Common questions.',
    aside: 'Something else on your mind? Ask us directly.',
    asideButton: 'Talk to us',
    items: [
      {
        q: 'What does {SITE_NAME} actually do?',
        a: 'We run the back office of established businesses: admin, operations, customer service, finance, marketing, social media and paid ads, done by trained people backed by AI agents built for your business. We also design and build websites. You can start with an extra set of hands and add the rest later.',
      },
      {
        q: 'What does it cost?',
        a: "Every quote is built around what your business needs. The whole back office is one monthly fee, billed in advance. An extra set of hands is quoted per job. Websites are quoted per project: half to start, half at launch. You'll know the price before anything starts.",
        flag: 'showPricing',
      },
      /** The terms EC agreed on 16 Oct 2026 ("Yes, all good terms"). */
      {
        q: 'How soon can you start?',
        a: 'Within 2 weeks of you saying yes.',
      },
      {
        q: 'Is there a lock-in contract?',
        a: "No. Our back-office work runs month to month, and either of us can stop with 30 days' notice. Set-up is part of your quote and paid up front. If you leave, you keep everything: your data, your logins and the written processes we built for you. A website and its domain are yours once it's paid for.",
      },
      {
        q: 'Do we have to change the software we use?',
        a: "Usually not. We set the work up around the tools you already use, like your accounting software, inbox and CRM. If anything would need to change, we'll say so before we start.",
      },
      {
        q: 'Is it people or AI doing the work?',
        a: "People, backed by AI. Your business gets its own trained {SITE_NAME} person, who owns every task. AI agents set up for your business do the drafting and the volume, and your person checks it before it reaches you. We don't sell AI on its own.",
      },
      {
        q: 'What if your team gets something wrong?',
        a: "We fix it at no charge, tell you what happened, and update the written process so it doesn't happen again.",
      },
      {
        q: 'What happens to our data, and who can see it?',
        a: 'Only the {SITE_NAME} people doing your work. Each has their own login, only to the systems their job needs, and we remove it when the work ends. Your data is never used to train AI models.',
      },
      {
        q: 'Where is the team based?',
        a: 'In Phnom Penh, Cambodia, at our Command Centre.',
        flag: 'showLocations',
      },
      /** EC, 20 Oct 2026: nobody is on shift overnight ("No - but we are often awake"), so "usually", not "day or night". */
      {
        q: 'How quickly will you reply?',
        a: 'Usually within 2 hours, evenings and weekends included.',
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
    /** Shown while WHATSAPP_NUMBER is set in site.config.ts (EC, 20 Oct 2026). A plain link, never a chat widget. */
    whatsappLine: 'Or message us on WhatsApp: {WHATSAPP_NUMBER}',
    /** Shown instead of the form when enableContactForm is off. */
    button: 'Talk to us',
  },

  /** The enquiry form: contact details and a short message only (BRIEF data rule). */
  form: {
    title: 'Tell us what you need',
    about: 'About',
    clearAbout: 'Remove topic',
    generalTopic: 'General enquiry',
    name: 'Your name',
    email: 'Email',
    message: 'What do you need a hand with?',
    hint: "A sentence or two is plenty. Please don't include client or customer details.",
    submit: 'Send enquiry',
    sending: 'Sending…',
    /** One per field: say which field, and what to do. */
    requiredName: 'Enter your name.',
    requiredEmail: 'Enter your email address.',
    requiredMessage: 'Tell us a little about what you need.',
    emailError: 'Enter an email address like name@business.com.au.',
    tooLong: 'Keep this under 2,000 characters.',
    /** EC, 16 Oct 2026: "Within 2 hours."; 20 Oct 2026: "usually", since nobody is on shift overnight. */
    success: "Enquiry sent. We'll reply to the email you gave us, usually within 2 hours.",
    /** The form keeps what they typed when sending fails, so say so. */
    failure: "Your enquiry didn't send. What you wrote is still here: try again, or email us at {CONTACT_EMAIL}.",
    privacy: "We use these details to reply to you, and we won't add you to a mailing list. See our privacy policy.",
    privacyLink: 'privacy policy',
    close: 'Close form',
  },

  /** The page the form lands on without JavaScript. */
  thanks: {
    h1: 'Enquiry sent.',
    body: "We'll reply to the email you gave us, usually within 2 hours.",
    failH1: "Your enquiry didn't send.",
    failBody: 'Email us at {CONTACT_EMAIL} instead.',
    button: 'Back to the home page',
  },

  /**
   * The automatic confirmation /api/enquiry emails to the visitor once their enquiry reaches hello@ (live site only).
   * EC, 20 Oct 2026: a receptionist that gathers the basics and arranges a call back from a person.
   * Fixed text only: it never repeats what the visitor typed, because anyone can type someone else's address.
   */
  enquiryConfirmation: {
    subject: "We've received your enquiry",
    paragraphs: [
      'Thanks for getting in touch with {SITE_NAME}.',
      'This is an automatic reply to confirm your enquiry reached us. A person from our team will reply to this email, usually within 2 hours.',
      "If you'd rather talk, reply with a good time and the number to call, and we'll ring you then.",
    ],
  },

  footer: {
    contactHeading: 'Contact',
    /** Shown while WHATSAPP_NUMBER is set in site.config.ts. */
    whatsapp: 'WhatsApp',
    /** Shown only for the pages whose address is set in site.config.ts. */
    social: [
      { label: 'Facebook', key: 'FACEBOOK_URL' },
      { label: 'LinkedIn', key: 'LINKEDIN_URL' },
    ],
    navHeading: 'On this page',
    copyright: '© {YEAR} {SITE_NAME}',
    /** showCareers */
    careers: 'Careers',
    /** showPrivacyPage */
    privacy: 'Privacy',
  },

  notFound: {
    h1: 'Page not found',
    body: "This page doesn't exist or has moved.",
    button: 'Go to the home page',
  },

  /**
   * Privacy policy, reviewed by EC on 16 Oct 2026 ("Policy is fine."). Change "updated" whenever the text changes.
   * It describes what the site actually does: one enquiry form, no cookies of its own, hosting on Cloudflare,
   * form emails delivered by Resend, email in Google Workspace, and a team in Phnom Penh (overseas disclosure, APP 8).
   * EC, 19 Oct 2026: "the Me² team is only in Phnom Penh", so Adelaide was taken out.
   * EC, 20 Oct 2026: WhatsApp, call backs and automatic first replies added (EC signs off privacy changes).
   */
  privacy: {
    h1: 'Privacy',
    updated: 'Last updated 20 October 2026',
    sections: [
      {
        h: 'Who we are',
        p: ['{SITE_NAME} ({SITE_NAME_PLAIN}) designs and builds websites and AI systems and runs back-office work for businesses. This policy explains how we handle personal information we collect through this website. "We" means {SITE_NAME}.'],
      },
      {
        h: 'What we collect',
        p: [
          'When you send an enquiry through the form on this site, we collect your name, your email address, what you write in your message and which part of the site you sent it from. Please don\'t include details about your clients or customers.',
          'If you email us, we collect your email address and whatever your email contains.',
          'If you message us on WhatsApp, we collect your phone number, your WhatsApp profile name and what you send us.',
          'If you ask us to call you back, we collect the number and the time you give us, and use them only to call you about your enquiry.',
          'Our hosting provider, Cloudflare, processes technical information such as your IP address and browser type to deliver this site and protect it from abuse. This site doesn\'t set cookies of its own and doesn\'t use advertising or tracking tools.',
        ],
      },
      {
        h: 'How we use it',
        p: [
          'We use your details to reply to your enquiry, to discuss and provide our services if you go ahead, and to keep a record of our correspondence.',
          'When you send an enquiry through the form, we email you an automatic confirmation. The first reply to a WhatsApp message or an email may also be automatic, and it says so. A person from our team then follows up.',
          'We don\'t sell personal information and we don\'t add you to a mailing list.',
        ],
      },
      {
        /** EC, 16 Oct 2026: the careers form takes a CV; applications are kept for 12 months. */
        h: 'Job applications',
        p: [
          'When you apply for a role through our careers pages, we collect your name, your email address, your phone or Telegram number if you give one, where you\'re based, your LinkedIn profile and links to your work if you give them, your CV, and what you tell us about why you want the role. You don\'t need to include a photo or your date of birth.',
          'We use your application only to consider you for the role you applied for. Resend emails it to the {SITE_NAME} people hiring for that role at {CAREERS_EMAIL}, and it is kept in our business email system, which is provided by Google.',
          'We keep applications for 12 months, then delete them. Email {PRIVACY_EMAIL} and we\'ll delete yours sooner.',
        ],
      },
      {
        h: 'Where it is kept and who can see it',
        p: [
          'Enquiries are emailed to our team by Resend, an email delivery service, and kept in our business email system, which is provided by Google.',
          'WhatsApp messages are kept in WhatsApp, which is provided by Meta, and on the phone and computers our team uses to reply.',
          'Our team works from Phnom Penh, Cambodia, so your enquiry is read and answered by people in Cambodia. Our service providers, Cloudflare, Resend, Google and Meta (for WhatsApp), may store or process information on servers outside Australia.',
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
