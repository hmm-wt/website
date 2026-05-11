// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hmm.ventures',
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
  // Sitemap integration is re-added once we have multiple routes.
  // See @astrojs/sitemap known issue with single-route builds.
});
