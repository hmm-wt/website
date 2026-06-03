#!/usr/bin/env node
/**
 * cwv-audit — Core Web Vitals + resource-weight capture for hmm-site.
 *
 * Ported from gstack /benchmark, scoped to this Astro site. Builds nothing on
 * its own; it measures a running server (default http://localhost:4321, i.e.
 * `npm run preview`). Captures LCP, CLS, FCP, TTFB, DOMContentLoaded, full load,
 * total transfer weight and a per-type resource breakdown for each route, writes
 * a timestamped JSON, and prints a table. Pass --baseline <file.json> to diff
 * against a prior run (the before/after the skill asks for).
 *
 * INP is interaction-driven and not captured in this load-only pass — noted in
 * the output rather than faked.
 *
 * Usage:
 *   npm run build && npm run preview &      # serve the production build on :4321
 *   node scripts/cwv-audit.mjs              # capture
 *   node scripts/cwv-audit.mjs --baseline _cwv-audit/<earlier>.json   # diff
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:4321';
const ROUTES = ['/', '/thesis', '/necessities', '/markets', '/about',
                '/research', '/references', '/contact'];
const OUT_DIR = '_cwv-audit';

const args = process.argv.slice(2);
const baselinePath = args.includes('--baseline')
  ? args[args.indexOf('--baseline') + 1] : null;

// Injected BEFORE navigation so the observers catch LCP/CLS as they fire.
// getEntriesByType('largest-contentful-paint') is unreliable after the fact;
// a buffered PerformanceObserver is the correct capture.
function installVitalObservers() {
  window.__lcp = 0;
  window.__cls = 0;
  try {
    new PerformanceObserver((list) => {
      const es = list.getEntries();
      const last = es[es.length - 1];
      if (last) window.__lcp = last.renderTime || last.startTime || window.__lcp;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) { /* observer unsupported; values stay 0 */ }
}

// Runs in the page after load; reads the observed vitals + timing entries.
function collectVitals() {
  return new Promise((resolve) => {
    const cls = window.__cls || 0;
    const lcp = window.__lcp || null;
    const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime ?? null;
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const res = performance.getEntriesByType('resource');
    const byType = {};
    let transfer = nav.transferSize || 0;
    for (const r of res) {
      const t = r.initiatorType || 'other';
      byType[t] = (byType[t] || 0) + (r.transferSize || 0);
      transfer += r.transferSize || 0;
    }
    resolve({
      lcp_ms: lcp, fcp_ms: fcp,
      ttfb_ms: nav.responseStart ?? null,
      dcl_ms: nav.domContentLoadedEventEnd ?? null,
      load_ms: nav.loadEventEnd ?? null,
      cls,
      transfer_kb: Math.round(transfer / 1024),
      resource_count: res.length,
      transfer_by_type_kb: Object.fromEntries(
        Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])),
    });
  });
}

const round = (v) => (v == null ? null : Math.round(v));

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.addInitScript(installVitalObservers); // applies to every navigation
  const results = {};
  for (const route of ROUTES) {
    const url = BASE + route;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(500); // let late layout shifts settle
      const v = await page.evaluate(collectVitals);
      results[route] = {
        lcp_ms: round(v.lcp_ms), fcp_ms: round(v.fcp_ms),
        ttfb_ms: round(v.ttfb_ms), load_ms: round(v.load_ms),
        cls: Math.round(v.cls * 1000) / 1000,
        transfer_kb: v.transfer_kb, resource_count: v.resource_count,
        transfer_by_type_kb: v.transfer_by_type_kb,
      };
    } catch (e) {
      results[route] = { error: String(e).split('\n')[0] };
    }
  }
  await browser.close();

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outFile = `${OUT_DIR}/cwv-${stamp}.json`;
  writeFileSync(outFile, JSON.stringify({ base: BASE, captured: stamp, results }, null, 2));

  // Print table (+ diff vs baseline if given).
  const baseline = baselinePath ? JSON.parse(readFileSync(baselinePath, 'utf8')).results : null;
  const budgets = { lcp_ms: 2500, cls: 0.1, transfer_kb: 500 }; // "good" CWV thresholds
  console.log(`\nCore Web Vitals — ${BASE}  (INP not captured: load-only pass)\n`);
  console.log('route'.padEnd(15), 'LCP'.padStart(7), 'CLS'.padStart(7),
              'TTFB'.padStart(7), 'KB'.padStart(7), baseline ? '  ΔLCP ΔKB' : '');
  for (const route of ROUTES) {
    const r = results[route];
    if (r.error) { console.log(route.padEnd(15), ' ERROR', r.error); continue; }
    const flag = (r.lcp_ms > budgets.lcp_ms || r.cls > budgets.cls || r.transfer_kb > budgets.transfer_kb) ? ' !' : '  ';
    let diff = '';
    if (baseline && baseline[route] && !baseline[route].error) {
      const dl = r.lcp_ms - baseline[route].lcp_ms;
      const dk = r.transfer_kb - baseline[route].transfer_kb;
      diff = `  ${dl >= 0 ? '+' : ''}${dl}  ${dk >= 0 ? '+' : ''}${dk}`;
    }
    console.log(route.padEnd(15), String(r.lcp_ms).padStart(7), String(r.cls).padStart(7),
                String(r.ttfb_ms).padStart(7), String(r.transfer_kb).padStart(7), flag + diff);
  }
  console.log(`\nBudgets: LCP<=${budgets.lcp_ms}ms, CLS<=${budgets.cls}, transfer<=${budgets.transfer_kb}KB. ! = over budget.`);
  console.log(`Saved: ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
