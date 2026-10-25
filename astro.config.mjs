// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/config/site.config.ts';

// The domain comes from site.config.ts (the only place it's typed).
const domain = siteConfig.SITE_DOMAIN;
const fixture = process.env.SITE_FIXTURE === '1';

export default defineConfig({
  site: fixture ? 'https://example.com' : `https://${domain}`,
  // Every page lives at a trailing-slash URL; the worker 301s the slashless form (worker/index.ts).
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
