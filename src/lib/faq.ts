import { flags } from '../config';
import { content } from '../content/site';

/** FAQ items whose flag is on (or that have none). Used by the page and the FAQ schema, so they always match. */
export function visibleFaq() {
  return content.faq.items.filter((item) => !('flag' in item) || flags[item.flag as keyof typeof flags]);
}
