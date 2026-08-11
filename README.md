# hmm.ventures

The public site for **hmm ventures** — a single-scroll thesis page plus a GP bio and a sources page.

Static HTML/CSS/JS. There is no build step: Netlify publishes the repository root as-is
(see `netlify.toml`). Editing any file and pushing to `main` deploys.

## Pages
- `index.html` — the thesis (single scroll)
- `bio.html` — the GP
- `sources.html` — primary and first-party sources

## Search / crawlers
`robots.txt`, `sitemap.xml`, `llms.txt` and per-page canonical tags live at the root.

## Prior site
This repo previously built a 19-route Astro site. That site is preserved and fully
recoverable:
- branch `astro-legacy`
- tag `astro-site-2026-06-16`
