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
    '/founders/': '/#founders',
    // Necessities promoted to top-level routes.
    '/research/necessities': '/necessities/',
    '/research/necessities/': '/necessities/',
    // Data hub promoted to top-level routes 2026-05-18.
    '/research/data/calendar': '/data/calendar/',
    '/research/data/calendar/': '/data/calendar/',
    '/research/data/necessity-index': '/data/necessity-index/',
    '/research/data/necessity-index/': '/data/necessity-index/',
    '/research/data/necessity-index/methodology': '/data/necessity-index/methodology/',
    '/research/data/necessity-index/methodology/': '/data/necessity-index/methodology/',
    '/research/data/scoreboard': '/data/scoreboard/',
    '/research/data/scoreboard/': '/data/scoreboard/',
    // 13 research articles consolidated into 3 long-form pages.
    '/research/five-necessities-primer': '/necessities/',
    '/research/five-necessities-primer/': '/necessities/',
    '/research/why-now-explainer': '/necessities/',
    '/research/why-now-explainer/': '/necessities/',
    '/research/t1-vs-t2-binary': '/research/method/',
    '/research/t1-vs-t2-binary/': '/research/method/',
    '/research/how-we-read-regulatory-exposure': '/research/method/',
    '/research/how-we-read-regulatory-exposure/': '/research/method/',
    '/research/classifier-walkthrough': '/research/method/',
    '/research/classifier-walkthrough/': '/research/method/',
    '/research/methodology-classified-universe': '/research/method/',
    '/research/methodology-classified-universe/': '/research/method/',
    '/research/country-corridor-snapshot': '/research/method/',
    '/research/country-corridor-snapshot/': '/research/method/',
    '/research/compliance-cycle-clock': '/research/method/',
    '/research/compliance-cycle-clock/': '/research/method/',
    '/research/regulatory-landscape': '/research/method/',
    '/research/regulatory-landscape/': '/research/method/',
    '/research/crystallisation-window-2024-2030': '/data/calendar/',
    '/research/crystallisation-window-2024-2030/': '/data/calendar/',
    '/research/t1-graduation-rates': '/research/results/',
    '/research/t1-graduation-rates/': '/research/results/',
    '/research/what-we-fund-pre-product': '/#founders',
    '/research/what-we-fund-pre-product/': '/#founders'
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
