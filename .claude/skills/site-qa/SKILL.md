---
name: site-qa
description: QA the hmm.ventures static site. Run the responsive, affordance, dead-CSS and figure guards, measure page weight and layout shift, and turn any bug found into a regression check. Use before a deploy, after a layout, font or asset change, or when checking site performance. Trigger: "audit the site", "site performance", "check mobile", "LCP/CLS", "qa the site".
---

# site-qa: the guards, and how to add one

The site is static HTML, CSS and JS published from the repository root. There is
no build step and no Astro; that site lives on the `astro-legacy` branch. Every
check below runs Playwright against a local server:

```bash
npm run serve            # python http.server on :8791, leave it running
npm run audit:mobile     # 320 to 1280px, touch and pointer: overflow, rail overlap, tap targets, 44 combinations
npm run check:affordances
npm run check:deadcss
npm run check:figures
```

Each guard was written after a defect got past review, and each was verified by
reintroducing the defect and watching it exit 1. Read the header comment of the
script before changing it; it records what the guard exists to catch and the
false positive its first version had.

## Weight and layout shift
There is no committed CWV script. Measure with a short Playwright run that reads
`performance.getEntriesByType('resource')` for transfer and a buffered
`layout-shift` PerformanceObserver for CLS, on a local server. Report structure
(request count, blocking chain, bytes) rather than millisecond timings, which are
meaningless on localhost. Budgets: CLS at or under 0.1 per route; the index page
transfer under 700 KB after the 2026-09-04 font change.

## The loop: bug found, guard written
1. Reproduce it deterministically: route, viewport, pointer type, scroll position.
2. Fix it.
3. Add the assertion to the guard that should have caught it, or write a new
   script under `scripts/` and wire it into `package.json`. A fix without a
   guard is half a fix.
4. Prove the guard: reintroduce the defect, confirm exit 1, restore, confirm 0.

## Notes
- The Google Drive copy of the site is stale. This repo is canonical.
- Brand and design correctness is a separate axis from these checks.
