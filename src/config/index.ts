import { siteConfig as realConfig, type SiteConfig } from './site.config';
import { flags as realFlags, type Flags } from './flags';

/**
 * The fixture build (BRIEF §6b) overrides config and flags from the git-ignored
 * `.verify/fixture/overrides.ts`, selected with SITE_FIXTURE=1. It is never deployed.
 */
const fixtureModules = import.meta.glob<{
  config?: Partial<SiteConfig>;
  flags?: Partial<Flags>;
  content?: { price?: string; proof?: string; privacy?: string };
}>(
  '../../.verify/fixture/overrides.ts',
  { eager: true },
);
export const isFixture = process.env.SITE_FIXTURE === '1';
const fixture = isFixture ? Object.values(fixtureModules)[0] : undefined;
if (isFixture && !fixture) throw new Error('SITE_FIXTURE=1 but .verify/fixture/overrides.ts is missing');

export const config: SiteConfig = { ...realConfig, ...fixture?.config };
/** Fixture-only stand-ins for copy that is still [[TBC]]; empty in the real build. */
export const fixtureText = fixture?.content ?? {};

// FIXTURE_FLAGS (JSON) picks the flags for one fixture variant, e.g. {"showPricing":true}.
const variantFlags: Partial<Flags> = isFixture && process.env.FIXTURE_FLAGS ? JSON.parse(process.env.FIXTURE_FLAGS) : {};
const merged: Flags = { ...realFlags, ...fixture?.flags, ...variantFlags };
// Anything that collects personal information needs the privacy page live first.
for (const key of ['enableContactForm', 'enableBooking', 'enableTracking'] as const) {
  if (merged[key] && !merged.showPrivacyPage) {
    console.warn(`[flags] ${key} needs showPrivacyPage; leaving it off.`);
    merged[key] = false;
  }
}
if (merged.enableBooking && !config.BOOKING_URL) merged.enableBooking = false;
export const flags: Flags = merged;

/** Copy items that name a flag (e.g. a menu link to a hidden section) are kept only while that flag is on. */
export function shown<T extends object>(items: readonly T[]): T[] {
  return items.filter((item) => !('flag' in item) || flags[(item as { flag: string }).flag as keyof Flags]);
}

/** Fills {SITE_NAME}-style placeholders in copy from the config. */
export function fill(text: string): string {
  return text
    .replaceAll('{SITE_NAME_PLAIN}', config.SITE_NAME_PLAIN)
    .replaceAll('{SITE_NAME}', config.SITE_NAME)
    .replaceAll('{CONTACT_EMAIL}', config.CONTACT_EMAIL)
    .replaceAll('{PRIVACY_EMAIL}', config.PRIVACY_EMAIL)
    .replaceAll('{YEAR}', String(new Date().getFullYear()));
}

export const siteUrl = `https://${config.SITE_DOMAIN}`;
