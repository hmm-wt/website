// @ts-check
import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hmm.ventures',
  // Sitemap re-enabled but @astrojs/sitemap@3.2.1 throws "Cannot read
  // properties of undefined (reading 'reduce')" on Astro 4.16 multi-route
  // builds. Bump @astrojs/sitemap to ^3.4 (or current) and re-enable below.
  // integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
