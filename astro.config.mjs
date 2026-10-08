// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

// The domain comes from site.config.ts (the only place it's typed).
const domain = readFileSync('./src/config/site.config.ts', 'utf8').match(/SITE_DOMAIN:\s*'([^']+)'/)?.[1];
const fixture = process.env.SITE_FIXTURE === '1';

export default defineConfig({
  site: fixture ? 'https://example.com' : `https://${domain}`,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
