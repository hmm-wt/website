# HMM Ventures Website

Public-surface website for HMM Ventures. The Necessity Doctrine, the Thesis, the Necessity Index, the Crystallisation Window calendar, and the Scoreboard.

## Stack

- **Astro 4** (static site generator)
- Three fonts via Google Fonts: Instrument Serif (display), IBM Plex Mono (UI), DM Sans (body)
- Cloudflare Pages for hosting (recommended)
- Beehiiv for newsletter (subscription embed)
- Plausible for analytics (prod only, on `hmm.ventures` domain)

The site replaces the previous React + Vite implementation. Framework swap rationale and migration notes are in the PR that introduced this branch.

## Setup

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → ./dist
npm run preview  # serve ./dist locally
```

Node version pinned in `.nvmrc` (or follow the version in CI).

## Deploy

This is a static site. `npm run build` writes to `./dist`.

**Cloudflare Pages settings (update from prior React config):**

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or 22 |
| Root directory | `/` |

Other static hosts (Vercel, Netlify) will work with the same build command and output directory.

## Structure

```
src/
  components/       21 reusable components
  layouts/          5 layouts (Base, Doctrine, Essay, Research, Index)
  pages/            13 routes
    doctrine/       /doctrine/, /doctrine/download/
    necessity-index/  /necessity-index/, /methodology/, /embed/
    research/       /research/, /research/[slug]/
  content/
    config.ts       Astro content collections schema
    doctrine/       10 chapters
    research/       1 published report
  data/             5 JSON data files (founding, scoreboard, embargo, necessity-index, crystallisation-window)
  styles/           tokens.css + global.css
public/             static assets
```

## Routes

| URL | Surface |
|---|---|
| `/` | Home: hero + 3 doors + Founding 100 counter |
| `/doctrine/` | The Necessity Doctrine (10 chapters) |
| `/doctrine/download/` | PDF capture, newsletter-gated |
| `/thesis/` | Concise thesis, 7 sections |
| `/research/` | Research index |
| `/research/regulatory-landscape/` | 174-regulation report |
| `/calendar/` | 36 in-flight regulations 2024 to 2030 |
| `/necessity-index/` | Classified universe data product |
| `/necessity-index/methodology/` | Reproducibility paper |
| `/necessity-index/embed/` | iframe-embeddable widget |
| `/scoreboard/` | 5 falsifiable claims |
| `/gp/` | Author |
| `/contact/` | Three lines, single inbox |

## Environment variables

- `BEEHIIV_PUB_ID` (optional, defaults to placeholder) — Beehiiv publication ID for newsletter embeds. Set in the host dashboard.

## Related repos

- [Hmm-Ventures/simulation](https://github.com/Hmm-Ventures/simulation) — Monte Carlo fund simulator (private)
- [Hmm-Ventures/regulation-map](https://github.com/Hmm-Ventures/regulation-map) — Interactive regulation explorer (private)

## Voice + design

Voice rules (no em-dashes, no anti-VC framing, conclusion-first) are codified in `CLAUDE_wahid_voice_memory.md` at the workspace root. Design tokens (six brand colours, three-font stack) live in `src/styles/tokens.css` and trace back to the workspace Design System v2.0.
