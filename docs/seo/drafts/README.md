# SEO content drafts (for EC's review)

Drafted 25 October 2026 in response to the SEO audit: the site is one page, ranks only for "Me²", and has no non-brand Search Console impressions. Competitors (mostly Philippines-based staffing providers) rank with service pages, pricing guides and comparison pages.

**Nothing here is published or approved.** Each file starts with a header block (target keywords, intent, proposed URL, title tag, meta description, H1, facts to confirm). Every `[CONFIRM: ...]` is a fact we couldn't verify from the repo or a public source; fill it in or delete the sentence before publishing. Copy rules from CLAUDE.md apply: Me², Australian English, no banned words, no invented proof or prices, people first.

Publishing these means new routes in `src/data/routes.json`, new pages, sitemap entries and internal links from the home page. That's a site change (branch, check, EC's yes) and isn't part of these drafts.

## The drafts

| File | Proposed URL | Primary keyword targets | Intent |
|---|---|---|---|
| services-finance.md | /services/finance/ | outsourced bookkeeping support, invoice chasing service, debtor follow-up | Commercial |
| services-admin.md | /services/admin/ | outsourced admin support, virtual admin assistant, outsourced data entry | Commercial |
| services-customer-service.md | /services/customer-service/ | outsourced customer service Australia, after-hours customer service | Commercial |
| services-marketing.md | /services/marketing/ | outsourced marketing support, social media management, paid ads management | Commercial |
| use-case-property-management.md | /use-cases/property-management-admin/ | property management admin outsourcing, rent arrears follow-up | Commercial (labelled example) |
| guide-cost-of-offshore-back-office.md | /guides/outsourced-back-office-cost/ | outsourced back office cost, how much does a virtual assistant cost | Informational → commercial |
| guide-cambodia-vs-philippines.md | /guides/cambodia-vs-philippines/ | Cambodia vs Philippines outsourcing, outsourcing to Cambodia | Comparative |
| guide-offshore-data-privacy.md | /guides/offshore-data-privacy/ | is it safe to outsource bookkeeping offshore, APP 8 outsourcing | Informational |
| compare-me2-vs-virtual-assistant-marketplaces.md | /compare/virtual-assistant-marketplaces/ | freelance VA vs managed service, virtual assistant alternative | Comparative |
| compare-notes.md | (internal) | Me² vs Virtual Coworker / Cloudstaff, later | Research only |
| directory-listings.md | (off-site) | brand consistency; referral links from Clutch, GoodFirms, DesignRush, Outsource Accelerator | Brand / links |

## How they map to the audit

- **No non-brand impressions:** the four service pages give Google one page per service to rank for the searches buyers actually make, instead of one home page trying to cover everything.
- **Competitors' pricing guides:** the cost guide answers the same question without Me² figures, using sourced Australian employment costs and a quoting checklist. It is also the page most likely to earn links.
- **Competitors' /compare/ pages:** the marketplace comparison takes a generic category, so it doesn't name anyone. Named comparisons (compare-notes.md) need EC's decision first: BRIEF §2 says competitors aren't named.
- **Cambodia as a differentiator:** the Cambodia vs Philippines guide owns a question no Philippines provider will answer fairly, and the privacy guide answers the main objection to offshore work.
- **Off-site signals:** directory profiles help the name searches (M-Squared, MSquared and Msquare compete for it) and give AI assistants consistent facts.

## Recommended order

1. **directory-listings.md**: no site change needed, quick, and helps brand searches now. Clutch first (docs/search-and-ai.md already suggests it).
2. **services-finance.md** and **services-admin.md**: the two services with confirmed jobs behind them (careers pages), and the clearest commercial intent.
3. **guide-offshore-data-privacy.md**: answers the trust objection that every service page links to. Needs a lawyer's read.
4. **services-customer-service.md** and **services-marketing.md**.
5. **guide-cost-of-offshore-back-office.md**: high search demand; needs the named-competitor decision and a current award rate.
6. **use-case-property-management.md**: needs the client's OK to describe the work, even unnamed.
7. **guide-cambodia-vs-philippines.md**: needs EC's comfort with publishing figures that favour the Philippines (recommended: publish them; the fairness is the point).
8. **compare-me2-vs-virtual-assistant-marketplaces.md**.
9. Named comparison pages only if EC approves, built from compare-notes.md.

Publish a few at a time and re-check Search Console about 30 days later (docs/search-and-ai.md).

## Decisions for EC

- Is it OK to cite a named competitor's published rates (cost guide footnote 5) and to publish named comparison pages at all? BRIEF §2 says competitors aren't named.
- Directory rate fields: "undisclosed", or a band?
- The Cambodia guide includes EF English figures and an Outsource Accelerator assessment that are unfavourable to Cambodia. Keep them?
- BAS/GST wording on the finance page (Tax Practitioners Board rules).
- Phone work: offered or not? Several pages assume written channels only.

## Checks run on these drafts

- Banned words (revolutionary, game-changing, supercharge, seamless, cutting-edge, unlock, guarantee, guaranteed): none found.
- "back end", "exclusive", Me2/ME2/MeSquared: none found in copy.
- Title tags ≤60 characters and meta descriptions ≤158: checked.
