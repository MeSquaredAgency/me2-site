// Limits the chat page (src/components/ChatWidget.astro) and the chat route (./chat.ts) share. No imports, so the
// page's script can use them without pulling in the Worker's code.
/** Visitor messages in one conversation. */
export const MAX_TURNS = 12;
/** Characters in one visitor message. */
export const MAX_MESSAGE = 1000;
