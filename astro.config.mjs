// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hmm.ventures',
  // MDX integration installed but not enabled — acorn parse error on
  // existing markdown content (likely angle-bracket entities inside
  // regulatory-landscape.md). Re-enable when content scrubbed.
  // integrations: [mdx()],
  //
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
