// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://hmm.ventures',
  // MDX enabled for chapter pages that need to import chart components.
  // .md files keep their existing parser; only renamed .mdx files use MDX.
  // @astrojs/sitemap (3.7.2) breaks on this Astro version. Static
  // sitemap.xml served from public/ instead — see public/sitemap.xml
  // and public/sitemap-index.xml.
  integrations: [mdx()],
  redirects: {
    // Pages collapsed into anchored panels on the home page.
    '/lps': '/#lps',
    '/lps/': '/#lps',
    '/founders': '/#founders',
    '/founders/': '/#founders'
    // Note: /thesis/[market] chapters remain as deep-dive pages linked
    // from the /markets/ comparison view. No redirect needed.
  },
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
