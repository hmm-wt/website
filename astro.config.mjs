// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hmm.ventures',
  // @astrojs/sitemap (3.7.2) breaks on this Astro version. Static
  // sitemap.xml served from public/ instead — see public/sitemap.xml
  // and public/sitemap-index.xml.
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
