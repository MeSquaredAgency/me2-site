// What every email the site sends shares: the sender's name, always written Me² (EC, 23 Oct 2026), and, for email
// that leaves Me², the same compliance footer Google Workspace adds to the team's own mail. The site sends through
// Resend, not Gmail, so Workspace never sees these emails and can't add its footer itself; this copies it
// (wording in content.emailFooter, the logo is public/email/me2-logo.png, colours from the logo).
import { siteConfig } from '../src/config/site.config.ts';
import { content } from '../src/content/site.ts';

/**
 * "Me² <hello@…>" as a From header. The name is sent as an RFC 2047 encoded-word, so the ² arrives intact in every
 * mail program whatever Resend or the receiving server does with non-ASCII headers.
 */
export function sender(name: string, address: string): string {
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(name)));
  return `=?UTF-8?B?${b64}?= <${address}>`;
}

const NAVY = '#1b3853';
const CORAL = '#e7785c';
const GREY = '#7b8794';

/** The Workspace footer as plain text, for the text part of an email. */
export function footerText(): string {
  const f = content.emailFooter;
  return ['--', `${siteConfig.SITE_NAME} | ${content.hero.h1}`, '', `${siteConfig.SITE_DOMAIN} • ${siteConfig.CONTACT_EMAIL}`, '', f.disclaimer].join('\n');
}

/** The Workspace footer as HTML: name and line in navy, coral marks, the confidentiality line in small grey, then the logo. */
export function footerHtml(): string {
  const f = content.emailFooter;
  const site = `https://${siteConfig.SITE_DOMAIN}/`;
  const font = 'font-family:Arial,Helvetica,sans-serif';
  return (
    `<div style="${font};color:${NAVY};font-size:13px;margin:24px 0 0"><strong>${esc(siteConfig.SITE_NAME)}</strong> <span style="color:${CORAL}">|</span> ${esc(content.hero.h1)}</div>` +
    `<div style="${font};font-size:13px;margin:0 0 10px"><a href="${site}" style="color:${NAVY}">${esc(siteConfig.SITE_DOMAIN)}</a> <span style="color:${CORAL}">•</span> <a href="mailto:${siteConfig.CONTACT_EMAIL}" style="color:${NAVY}">${esc(siteConfig.CONTACT_EMAIL)}</a></div>` +
    `<div style="${font};font-size:11px;line-height:1.4;color:${GREY};margin:0">${esc(f.disclaimer)}</div>` +
    `<div style="margin:16px 0 0"><img src="${site}email/me2-logo.png" width="110" height="64" alt="${esc(siteConfig.SITE_NAME)}" style="display:block;border:0"></div>`
  );
}

/** A short email from Me² to someone outside it: plain paragraphs in ink on white, then the footer. */
export function brandedHtml(paragraphs: string[]): string {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px">${esc(p)}</p>`).join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#1b232c;max-width:560px">${body}${footerHtml()}</div>`;
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
