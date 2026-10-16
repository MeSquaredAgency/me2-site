/**
 * Careers: the copy of record for /careers/, each role page and the application form
 * (spec: docs/superpowers/specs/2026-10-16-careers-design.md, approved by EC 16 Oct 2026).
 * Role copy is EC's LinkedIn posts (Property Management: linkedin.com/jobs/view/4479323026; Accounting and
 * Marketing: the text EC sent on 16 Oct 2026), with the tidy-ups listed in the spec's Appendix A.
 * Pure data: the Worker imports this file too, so it imports nothing. {CAREERS_EMAIL} is filled by `fill()`.
 * To add, unlist or close a role, see docs/careers.md (each role also needs its entry in src/data/routes.json).
 */

export interface RoleSection {
  h: string;
  paras?: string[];
  groups?: { h?: string; items: string[] }[];
  after?: string[];
  link?: { before: string; text: string; href: string };
}

export interface Role {
  slug: string;
  title: string;
  /** The page's H1, under "Operations Executive". */
  area: string;
  /** One line for the list on /careers/ and the search description. */
  summary: string;
  /** Off: no page, not on /careers/, not in the sitemap, and the Worker refuses applications for it. */
  listed: boolean;
  linkedinUrl?: string;
  datePosted: string;
  facts: { location: string; type: string; hours: string; salary: string; salaryFrom: number; currency: 'USD' };
  /** Marketing asks for links to two or three examples of published work. */
  needsWorkLinks: boolean;
  sections: RoleSection[];
}

const COMMON_FACTS = {
  location: 'Phnom Penh, Cambodia',
  type: 'Full-time',
  hours: '44 hours per week, with a 6:00 AM start where required to align with Australian business hours.',
  salary: 'Starting at US$600 per month, depending on experience',
  salaryFrom: 600,
  currency: 'USD' as const,
};

const employment: RoleSection = {
  h: 'Employment details',
  groups: [{ items: [`Location: ${COMMON_FACTS.location}`, `Salary: ${COMMON_FACTS.salary}`, `Working hours: ${COMMON_FACTS.hours}`] }],
};

const offer = (field: string): RoleSection => ({
  h: 'What we offer',
  groups: [{
    items: [
      'Early-stage ownership: help shape the systems and processes of a growing operations team.',
      'Practical training in our workflows, technology and AI tools.',
      `Exposure to ${field}, business operations and process improvement.`,
      'Opportunities to develop and take on greater responsibility as the business grows.',
      'Potential opportunities to spend time working with our Australian team, subject to eligibility and final arrangements.',
    ],
  }],
});

const howWeWork = (experience: string, apn: boolean): RoleSection => ({
  h: 'How we work',
  paras: [
    'We value accountability, clear communication, accuracy and continuous improvement.',
    'We aim to provide clear expectations, practical support and opportunities for people to develop their skills and responsibilities as the business grows.',
    `If you have ${experience} experience and want to work at the intersection of operations, technology and AI, we'd like to hear from you.`,
  ],
  ...(apn ? { link: { before: 'Learn more about our initial client: ', text: 'APN Real Estate', href: 'https://apnre.com.au/' } } : {}),
});

export const roles: Role[] = [
  {
    slug: 'operations-executive-property-management',
    title: 'Operations Executive (Property Management)',
    area: 'Property Management',
    summary: 'Property management administration for APN Real Estate, an Australian agency with multiple offices.',
    listed: true,
    linkedinUrl: 'https://www.linkedin.com/jobs/view/4479323026/',
    datePosted: '2026-10-16',
    facts: COMMON_FACTS,
    needsWorkLinks: false,
    sections: [
      {
        h: 'About Me²',
        paras: [
          'Me² builds AI-enabled back-office teams for businesses, combining skilled people, effective processes and practical AI tools to help businesses run more efficiently.',
          "We're building our first Command Centre in Phnom Penh: a team of Remote Operators who take ownership of operational work, use technology intelligently and deliver reliable outcomes for our clients.",
          'Joining at this early stage means contributing to how the business operates while developing skills across property management, business operations and AI-enabled workflows.',
        ],
      },
      {
        h: 'The role',
        paras: [
          'Your primary focus will be supporting APN Real Estate, an Australian real estate business with multiple offices.',
          "You'll work across property management administration, documentation, maintenance coordination, reporting and client communications. You'll also contribute to improving processes and using AI tools to make routine work more efficient.",
          "This isn't simply a data-entry role. We're looking for someone who understands the purpose behind their work, takes responsibility for accuracy and identifies opportunities to improve how things are done.",
        ],
      },
      {
        h: 'Key responsibilities',
        groups: [
          {
            h: 'Property management',
            items: [
              'Track rental arrears, maintain follow-up schedules and prepare notices for agent review.',
              'Prepare lease documentation, renewals and rent review paperwork.',
              'Coordinate maintenance requests and liaise with tradespeople, owners and tenants.',
              'Schedule inspections and check reports for completeness and accuracy.',
              'Monitor shared inboxes, prioritise enquiries and prepare professional responses.',
            ],
          },
          {
            h: 'Operations & AI',
            items: [
              'Review AI-generated documents, reports and correspondence for accuracy.',
              'Maintain records, prepare reports and support client onboarding.',
              'Document processes and identify opportunities to improve efficiency.',
              'Support colleagues across the Command Centre as priorities evolve.',
            ],
          },
        ],
        after: ["All work will be completed within agreed procedures and approval limits. Tasks requiring an authorised agent's approval will remain subject to that approval."],
      },
      {
        h: "What we're looking for",
        groups: [{
          items: [
            'At least two years of experience in property management or real estate administration; Australian experience preferred.',
            'Familiarity with platforms such as PropertyMe, Console Cloud or PropertyTree.',
            'Fluent in written English and professional communication skills.',
            'Excellent attention to detail, organisation and numerical accuracy.',
            'The ability to manage competing priorities and follow tasks through to completion.',
            'An interest in AI tools and the judgement to verify their output.',
            'Reliable internet access and backup power.',
          ],
        }],
        after: ["You don't need to be an AI specialist. We're looking for someone who can learn new systems, think critically and take ownership of their work."],
      },
      offer('property management'),
      employment,
      howWeWork('property management', true),
    ],
  },
  {
    slug: 'operations-executive-accounting',
    title: 'Operations Executive (Accounting & Bookkeeping)',
    area: 'Accounting & Bookkeeping',
    summary: "Bookkeeping and accounting for Australian businesses, and the financial administration of Me²'s Cambodian operations.",
    listed: true,
    datePosted: '2026-10-16',
    facts: COMMON_FACTS,
    needsWorkLinks: false,
    sections: [
      {
        h: 'About Me²',
        paras: [
          'Me² builds AI-enabled back-office teams for businesses. We combine skilled people, effective processes and practical AI tools to help businesses run more efficiently.',
          "We're building our first Command Centre in Phnom Penh, bringing together operators who take ownership of their work, maintain high standards and help improve how businesses operate.",
          "This is an opportunity to join at an early stage and contribute to both our clients' financial operations and the development of Me² itself.",
        ],
      },
      {
        h: 'The role',
        paras: [
          'Your primary responsibility will be bookkeeping and accounting support for Australian businesses, with an initial focus on accounts payable, accounts receivable, reconciliations and month-end reporting.',
          "You'll also support the wider Command Centre and help manage the financial administration of Me²'s own Cambodian operations, including bookkeeping, tax documentation and compliance coordination.",
          "We're looking for someone who understands the importance of accurate financial records, can work independently within agreed procedures and knows when to investigate, ask questions or escalate an issue. AI tools will support parts of the workflow, but you'll remain responsible for checking the accuracy and completeness of your work.",
        ],
      },
      {
        h: 'Key responsibilities',
        groups: [
          {
            h: 'Accounting & bookkeeping',
            items: [
              'Process supplier bills, code transactions and prepare payment runs for approval.',
              'Maintain accounts payable and receivable records and follow up outstanding invoices.',
              'Complete monthly bank and credit card reconciliations.',
              'Prepare month-end reports, supporting schedules and plain-English variance explanations.',
              'Review AI-coded transactions and correct errors before finalisation.',
              'Prepare Australian GST and BAS workpapers for review and lodgement by an appropriately authorised professional where required.',
            ],
          },
          {
            h: 'Me² financial administration',
            items: [
              'Maintain accurate records of income, expenditure, invoices and supporting documentation.',
              'Prepare monthly financial summaries and maintain a calendar of tax and filing deadlines.',
              'Assist with Cambodian tax administration, including preparing records, schedules and draft declarations for review.',
              'Coordinate with external accountants or tax advisers on Cambodian tax filings and regulatory requirements.',
              'Help maintain clear, documented financial processes as the business grows.',
            ],
          },
          {
            h: 'Wider Command Centre',
            items: [
              'Support client onboarding, document collection and expense follow-up.',
              'Prepare internal reports and maintain operational records.',
              'Assist colleagues with administrative work when priorities require it.',
            ],
          },
        ],
      },
      {
        h: "What we're looking for",
        groups: [{
          items: [
            'An accounting degree, diploma or equivalent qualification.',
            'At least two years of professional bookkeeping or accounting experience.',
            'Practical experience with Xero, MYOB or QuickBooks Online.',
            'An understanding of Australian GST and BAS processes, or the ability to develop this knowledge through structured training.',
            'Strong reconciliation skills and attention to detail.',
            'Professional written English and the ability to explain financial issues clearly.',
            'Discretion when handling confidential financial information.',
            'The ability to work independently, meet deadlines and escalate discrepancies appropriately.',
            'Experience with Cambodian accounting, taxation or statutory reporting would be an advantage.',
          ],
        }],
      },
      offer('accounting'),
      employment,
      howWeWork('bookkeeping or accounting', false),
    ],
  },
  {
    slug: 'operations-executive-marketing',
    title: 'Operations Executive (Marketing)',
    area: 'Marketing',
    summary: "Me²'s first dedicated marketing hire: content, campaigns and reporting, for Me² and its clients.",
    listed: true,
    datePosted: '2026-10-16',
    facts: COMMON_FACTS,
    needsWorkLinks: true,
    sections: [
      {
        h: 'About Me²',
        paras: [
          "Me² builds AI-enabled back-office teams for businesses. We combine skilled people, effective processes and practical AI tools to help businesses operate more efficiently. We're creating our first Command Centre in Phnom Penh, bringing together operators who take ownership of their work, use technology intelligently and deliver reliable outcomes.",
          "This is our first dedicated marketing hire. You'll help establish how Me² presents itself to the market while supporting marketing activities for our clients.",
        ],
      },
      {
        h: 'The role',
        paras: [
          "Your primary responsibility will be marketing: creating content, supporting campaigns, maintaining our digital presence and helping generate qualified business enquiries. You'll work closely with the team to turn ideas into practical marketing activity, using AI tools to accelerate research and drafting while applying your own judgement to messaging, accuracy and quality.",
          "As an early member of the team, you'll also support lead follow-up, website updates, client communications and other operational tasks when needed. We're looking for someone who can move from brief to execution to reporting without needing every step prescribed.",
        ],
      },
      {
        h: 'Key responsibilities',
        groups: [
          {
            h: 'Content & communications',
            items: [
              'Write and edit LinkedIn posts, website copy, email campaigns, newsletters and marketing explainers.',
              'Maintain a content calendar and coordinate publication schedules.',
              'Adapt messaging for different audiences, businesses and communication channels.',
              'Use AI tools to support research, drafting and content development, then edit and fact-check the output before publication.',
            ],
          },
          {
            h: 'Campaigns & lead generation',
            items: [
              'Build targeted prospect lists and support outbound email and LinkedIn campaigns.',
              'Prepare campaign sequences and track follow-ups in the CRM.',
              'Maintain accurate lead records and coordinate with the team on enquiries and next steps.',
              'Support marketing activities designed to generate qualified leads for Me² and its clients.',
            ],
          },
          {
            h: 'Digital marketing & reporting',
            items: [
              'Maintain and update website content and landing pages.',
              'Monitor relevant metrics, including website traffic, engagement, enquiries and campaign performance.',
              'Prepare weekly reports identifying what is working, what is not and what should change.',
              'Support the development and execution of marketing plans for client businesses.',
            ],
          },
          {
            h: 'Wider Command Centre',
            items: [
              'Follow up leads and maintain CRM records.',
              'Support client communications and onboarding.',
              'Document marketing processes and create repeatable workflows.',
              'Assist with operational work during busy periods.',
            ],
          },
        ],
      },
      {
        h: "What we're looking for",
        groups: [{
          items: [
            'At least two years of experience in B2B marketing, services marketing or a similar role.',
            'Two or three examples of published work or campaigns you have contributed to.',
            'Strong written English and the ability to communicate clearly without unnecessary jargon.',
            'Experience with a CRM, an email marketing platform and Canva or similar design tools.',
            'Familiarity with LinkedIn marketing and website content management.',
            'Basic analytics skills, including interpreting campaign and website performance.',
            'The ability to organise your workload, meet deadlines and manage a campaign from brief to report.',
            'An interest in AI tools and the ability to use them critically rather than relying on unedited output.',
          ],
        }],
        after: ["We're interested in evidence of your work and your ability to explain the decisions behind it, not just a list of software you've used."],
      },
      offer('marketing'),
      employment,
      howWeWork('marketing', true),
    ],
  },
];

/** Where every role is based, for Google's job search (JobPosting). */
export const jobPlace = { locality: 'Phnom Penh', country: 'KH' };

export const listedRoles = (): Role[] => roles.filter((r) => r.listed);
export const findRole = (slug: string): Role | undefined => listedRoles().find((r) => r.slug === slug);

export const careers = {
  index: {
    h1: 'Join the Command Centre.',
    intro: "We're building our first Command Centre in Phnom Penh: trained people who own the back-office work of businesses in Australia, with AI tools doing the drafting and the volume. We're hiring our first operators.",
    rolesHeading: 'Open roles',
    rowFacts: 'Phnom Penh · Full-time · From US$600 a month',
    applying: "Apply on the role's page with your CV, or on LinkedIn where the role is listed there. Questions about a role? Email {CAREERS_EMAIL}.",
    none: "There are no open roles right now. You're welcome to email your CV to {CAREERS_EMAIL}.",
  },
  role: {
    kicker: 'Operations Executive',
    crumb: 'All roles',
    factLabels: { location: 'Location', type: 'Type', hours: 'Hours', salary: 'Salary' },
    hoursShort: '44 hours per week',
    apply: 'Apply now',
    linkedin: 'Apply on LinkedIn',
    back: 'Back to all roles',
  },
  form: {
    heading: 'Apply for this role',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone or Telegram (optional)',
    location: 'Where are you based?',
    locationHint: 'City and country',
    cv: 'Your CV',
    cvHint: "PDF or Word, up to 4 MB. You don't need to include a photo or your date of birth.",
    linkedin: 'LinkedIn profile (optional)',
    workLinks: 'Links to two or three examples of your work',
    why: 'Why this role?',
    whyHint: 'A few lines is plenty.',
    submit: 'Send application',
    sending: 'Sending…',
    success: "Application sent. Thanks for applying. If you're shortlisted, we'll email you about the next step.",
    failure: "Your application didn't send. What you entered is still here: try again, or email your CV to {CAREERS_EMAIL} with the role in the subject.",
    privacy: 'We use these details only to consider your application. See our privacy policy.',
    privacyLink: 'privacy policy',
    requiredName: 'Enter your name.',
    requiredEmail: 'Enter your email address.',
    emailError: 'Enter an email address like name@example.com.',
    requiredLocation: "Tell us where you're based.",
    requiredCv: 'Choose your CV to upload.',
    cvType: 'Your CV needs to be a PDF or Word file.',
    cvSize: 'Your CV needs to be 4 MB or smaller.',
    requiredWorkLinks: 'Add links to two or three examples of your work.',
    requiredWhy: 'Tell us a little about why you want this role.',
    tooLong: 'Keep this to 1,000 characters or fewer.',
    noForm: 'To apply, email your CV to {CAREERS_EMAIL} with the role in the subject.',
  },
  thanks: {
    h1: 'Application sent.',
    body: "Thanks for applying. If you're shortlisted, we'll email you about the next step.",
    button: 'See all roles',
  },
  notSent: {
    h1: 'Not sent.',
    body: "Your application didn't send. Email your CV to {CAREERS_EMAIL} with the role in the subject, or go back and try again.",
    button: 'Back to the roles',
  },
};
