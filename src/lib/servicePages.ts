import type { MarkdownInstance } from 'astro';

/** The service and use-case pages: one markdown file each in src/content/services/ (SEO audit, 25 Oct 2026; EC: "yes" to more than one page). */
export interface ServicePageData {
  slug: string;
  /** 'services' (default) or 'use-cases': the first part of the address. */
  section?: 'services' | 'use-cases';
  order: number;
  kicker: string;
  title: string;
  description: string;
  h1: string;
  serviceType: string;
  /** The enquiry topic the page's "Talk to us" button sends. */
  topic: string;
}

const files = import.meta.glob<MarkdownInstance<ServicePageData>>('../content/services/*.md', { eager: true });

export const servicePages = Object.values(files)
  .map((f) => ({ ...f.frontmatter, section: f.frontmatter.section ?? 'services', Content: f.Content }))
  .sort((a, b) => a.order - b.order);

export const pagePath = (p: { section?: string; slug: string }) => `/${p.section ?? 'services'}/${p.slug}/`;
