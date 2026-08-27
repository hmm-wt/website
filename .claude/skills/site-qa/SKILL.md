---
name: site-qa
description: QA the hmm-site Astro build. Capture Core Web Vitals and resource weight, run the mobile responsiveness audit, diff against a baseline, and turn any bug found into a regression test. Ported from gstack /benchmark + /qa, scoped to this site. Use before a deploy, after a layout/asset change, or when checking site performance. Trigger: "audit the site", "core web vitals", "site performance", "is the site fast", "check mobile", "LCP/CLS", "before/after the site change", "qa the site".
---

# site-qa: performance + responsiveness QA

This is the one real frontend codebase in the workspace. gstack's web QA loop
applies as-designed here. Two audits, both Playwright-backed.

## Core Web Vitals + resource weight
```bash
npm run build && npm run preview -- --port 4321 &   # serve the PRODUCTION build
npm run audit:cwv                                    # capture LCP/CLS/TTFB/transfer per route
```
- Captures LCP (buffered PerformanceObserver), CLS, TTFB, full transfer weight,
  and a per-type resource breakdown for every top-level route, into a timestamped
  JSON under `_cwv-audit/` (gitignored).
- Budgets: LCP ≤ 2500ms, CLS ≤ 0.1, transfer ≤ 500KB. Routes over budget get a `!`.
- INP is interaction-driven and not captured in this load-only pass (stated in
  the output, not faked).
- **Before/after a change:** keep the pre-change JSON, then
  `node scripts/cwv-audit.mjs --baseline _cwv-audit/<pre>.json` prints ΔLCP / ΔKB
  per route. Always measure the production build (`preview`), never `dev`. Dev
  ships unminified and inflates every number.

## Mobile responsiveness
```bash
npm run audit:mobile     # Playwright across iPhone SE / 15 Pro / Pixel 8 / Galaxy S24
```
Existing suite at `scripts/mobile-audit.ts`; report in `_mobile-audit/`.

## The /qa loop: bug found → regression test
When an audit (or a manual pass) surfaces a real defect:
1. Reproduce it deterministically (note the route, viewport, and step).
2. Fix it.
3. **Write the regression test** so it can't silently return: a budget assertion
   in a CWV check, or a Playwright assertion in `scripts/mobile-audit.ts` for a
   layout/content bug. A fix without a regression test is half a fix.
4. Re-run the relevant audit to confirm green.

## Notes
- This repo is the canonical site source (`~/Work/hmm-site`); the Google Drive
  copy is stale. Never QA or edit that one (project_hmm_site_canonical_repo).
- Astro preview serves on :4321 (matches `playwright.config.ts` BASE_URL).
- Design/brand correctness is a separate axis. For visual/brand-system review
  use the `figma-designer` skill, not this one.
