import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const RUN_DATE = new Date().toISOString().slice(0, 10);
const OUT_ROOT = path.join(process.cwd(), '_mobile-audit', RUN_DATE);

type RouteSpec = { slug: string; path: string };

const ROUTES: RouteSpec[] = [
  { slug: 'home', path: '/' },
  { slug: 'necessities', path: '/necessities/' },
  { slug: 'necessities-heal', path: '/necessities/heal/' },
  { slug: 'necessities-power', path: '/necessities/power/' },
  { slug: 'necessities-move', path: '/necessities/move/' },
  { slug: 'necessities-supply', path: '/necessities/supply/' },
  { slug: 'necessities-eat', path: '/necessities/eat/' },
  { slug: 'markets', path: '/markets/' },
  { slug: 'thesis-japan', path: '/thesis/japan/' },
  { slug: 'thesis-australia', path: '/thesis/australia/' },
  { slug: 'thesis-new-zealand', path: '/thesis/new-zealand/' },
  { slug: 'thesis-singapore', path: '/thesis/singapore/' },
  { slug: 'research', path: '/research/' },
  { slug: 'research-results', path: '/research/results/' },
  { slug: 'data-calendar', path: '/data/calendar/' },
  { slug: 'data-necessity-index', path: '/data/necessity-index/' },
  { slug: 'data-necessity-index-methodology', path: '/data/necessity-index/methodology/' },
  { slug: 'data-scoreboard', path: '/data/scoreboard/' },
  { slug: 'about', path: '/about/' },
  { slug: 'contact', path: '/contact/' },
  { slug: 'references', path: '/references/' },
  { slug: 'not-found', path: '/this-page-does-not-exist/' },
];

type TapTarget = {
  tag: string;
  text: string;
  selector: string;
  width: number;
  height: number;
  visible: boolean;
};

type OverflowReport = {
  scrollWidth: number;
  innerWidth: number;
  overflows: boolean;
  worstOffender: { selector: string; width: number; x: number } | null;
};

type Vitals = {
  lcp: number | null;
  cls: number | null;
  fcp: number | null;
};

type RouteReport = {
  device: string;
  route: string;
  url: string;
  overflow: OverflowReport;
  tapFailures: TapTarget[];
  consoleErrors: string[];
  vitals: Vitals;
  hasMobileNav: boolean;
  durationMs: number;
};

const TAP_MIN = 44;

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function measureTapTargets(page: Page): Promise<TapTarget[]> {
  return page.evaluate((min) => {
    const selectors = 'a, button, [role="button"], input[type="submit"], input[type="button"]';
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors));
    const failures: TapTarget[] = [];
    for (const el of nodes) {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const visible =
        rect.width > 0 &&
        rect.height > 0 &&
        cs.visibility !== 'hidden' &&
        cs.display !== 'none' &&
        cs.opacity !== '0';
      if (!visible) continue;
      if (rect.width >= min && rect.height >= min) continue;
      // skip inline links inside paragraphs (text links are exempt from 44x44 per WCAG 2.5.5)
      const inProse = el.tagName === 'A' && !!el.closest('p, dd, dt, blockquote, h1, h2, h3, h4, h5, h6, figcaption');
      if (inProse) continue;
      // skip visually-hidden patterns (skip-link, sr-only) — they expand to 44+ on focus
      const isVisuallyHidden = rect.width <= 4 && rect.height <= 4;
      if (isVisuallyHidden) continue;
      const buildSelector = (node: HTMLElement) => {
        if (node.id) return `#${node.id}`;
        const cls = (node.className || '').toString().trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
        return cls ? `${node.tagName.toLowerCase()}.${cls}` : node.tagName.toLowerCase();
      };
      failures.push({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 80).replace(/\s+/g, ' ').trim(),
        selector: buildSelector(el),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        visible: true,
      });
    }
    return failures;
  }, TAP_MIN);
}

async function measureOverflow(page: Page): Promise<OverflowReport> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const scrollWidth = doc.scrollWidth;
    const innerWidth = window.innerWidth;
    let worst: { selector: string; width: number; x: number } | null = null;
    if (scrollWidth > innerWidth + 1) {
      const all = document.body.querySelectorAll<HTMLElement>('*');
      for (const el of Array.from(all)) {
        const r = el.getBoundingClientRect();
        if (r.right > innerWidth + 1) {
          const sel = el.id
            ? `#${el.id}`
            : `${el.tagName.toLowerCase()}${el.className ? '.' + (el.className.toString().split(/\s+/)[0] || '') : ''}`;
          if (!worst || r.right > worst.x + worst.width) {
            worst = { selector: sel, width: Math.round(r.width), x: Math.round(r.left) };
          }
        }
      }
    }
    return {
      scrollWidth,
      innerWidth,
      overflows: scrollWidth > innerWidth + 1,
      worstOffender: worst,
    };
  });
}

async function captureVitals(page: Page): Promise<Vitals> {
  // Lightweight inline collector. Not as precise as web-vitals lib but no extra dep.
  return page.evaluate(
    () =>
      new Promise<Vitals>((resolve) => {
        const out: Vitals = { lcp: null, cls: null, fcp: null };
        let cls = 0;
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as PerformanceEntry[]) {
              const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
              if (!e.hadRecentInput && typeof e.value === 'number') cls += e.value;
            }
            out.cls = +cls.toFixed(4);
          }).observe({ type: 'layout-shift', buffered: true });

          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) out.lcp = Math.round(last.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const e of entries) {
              if (e.name === 'first-contentful-paint') out.fcp = Math.round(e.startTime);
            }
          }).observe({ type: 'paint', buffered: true });
        } catch {
          // PerformanceObserver might not exist in some engines
        }
        setTimeout(() => resolve(out), 1800);
      }),
  );
}

const reports: RouteReport[] = [];

for (const route of ROUTES) {
  test(`audit ${route.slug}`, async ({ page, browserName }, testInfo) => {
    const deviceName = testInfo.project.name;
    const outDir = path.join(OUT_ROOT, deviceName, route.slug);
    await ensureDir(outDir);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 240));
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`.slice(0, 240)));

    const start = Date.now();
    const resp = await page.goto(route.path, { waitUntil: 'networkidle' });
    // Allow lazy images / late layout to settle
    await page.waitForTimeout(800);

    const overflow = await measureOverflow(page);
    const tapFailures = await measureTapTargets(page);
    const vitals = await captureVitals(page);
    const hasMobileNav = await page.locator('.nav__hamburger, [data-mobile-nav]').first().isVisible().catch(() => false);

    // Fold-only screenshot
    await page.screenshot({ path: path.join(outDir, 'fold.png'), fullPage: false });
    // Full-page screenshot
    await page.screenshot({ path: path.join(outDir, 'full.png'), fullPage: true });

    const report: RouteReport = {
      device: deviceName,
      route: route.path,
      url: resp?.url() ?? route.path,
      overflow,
      tapFailures,
      consoleErrors,
      vitals,
      hasMobileNav,
      durationMs: Date.now() - start,
    };
    reports.push(report);

    await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

    // Don't fail the test on findings — this is an audit, not a gate.
    expect(resp?.ok() || resp?.status() === 404).toBeTruthy();
  });
}

test.afterAll(async () => {
  await ensureDir(OUT_ROOT);
  // Aggregate findings.md
  const byDevice = new Map<string, RouteReport[]>();
  for (const r of reports) {
    if (!byDevice.has(r.device)) byDevice.set(r.device, []);
    byDevice.get(r.device)!.push(r);
  }

  const totalRoutes = ROUTES.length;
  const totalDevices = byDevice.size;

  const lines: string[] = [];
  lines.push(`# Mobile Audit — ${RUN_DATE}`);
  lines.push('');
  lines.push(`**Coverage:** ${totalDevices} devices × ${totalRoutes} routes = ${reports.length} runs`);
  lines.push('');
  lines.push('## Severity ranking');
  lines.push('');

  const totalOverflows = reports.filter((r) => r.overflow.overflows).length;
  const totalTapFailures = reports.reduce((acc, r) => acc + r.tapFailures.length, 0);
  const totalConsoleErrors = reports.reduce((acc, r) => acc + r.consoleErrors.length, 0);
  const totalLcpFails = reports.filter((r) => (r.vitals.lcp ?? 0) > 2500).length;
  const totalClsFails = reports.filter((r) => (r.vitals.cls ?? 0) > 0.1).length;

  lines.push(`| Severity | Count |`);
  lines.push(`|---|---|`);
  lines.push(`| Horizontal-scroll violations | ${totalOverflows} / ${reports.length} |`);
  lines.push(`| Tap-target failures (<44px) | ${totalTapFailures} total findings |`);
  lines.push(`| Console errors | ${totalConsoleErrors} total |`);
  lines.push(`| LCP > 2.5s | ${totalLcpFails} / ${reports.length} |`);
  lines.push(`| CLS > 0.1 | ${totalClsFails} / ${reports.length} |`);
  lines.push('');

  // Top tap-target offenders by selector
  const tapAgg = new Map<string, { count: number; minWidth: number; minHeight: number; sample: string }>();
  for (const r of reports) {
    for (const t of r.tapFailures) {
      const key = t.selector;
      const cur = tapAgg.get(key);
      if (cur) {
        cur.count++;
        cur.minWidth = Math.min(cur.minWidth, t.width);
        cur.minHeight = Math.min(cur.minHeight, t.height);
      } else {
        tapAgg.set(key, { count: 1, minWidth: t.width, minHeight: t.height, sample: t.text || t.tag });
      }
    }
  }
  const tapRanked = Array.from(tapAgg.entries()).sort((a, b) => b[1].count - a[1].count);
  if (tapRanked.length) {
    lines.push('## Top tap-target offenders');
    lines.push('');
    lines.push('| Selector | Min size (px) | Occurrences | Sample text |');
    lines.push('|---|---|---|---|');
    for (const [sel, agg] of tapRanked.slice(0, 25)) {
      lines.push(`| \`${sel}\` | ${agg.minWidth}×${agg.minHeight} | ${agg.count} | ${agg.sample} |`);
    }
    lines.push('');
  }

  // Per-route × device matrix (overflow + tap counts)
  lines.push('## Route × device matrix (tap failures · overflow)');
  lines.push('');
  const devices = Array.from(byDevice.keys());
  lines.push(`| Route | ${devices.join(' | ')} |`);
  lines.push(`|---${devices.map(() => '|---').join('')}|`);
  for (const route of ROUTES) {
    const cells = devices.map((d) => {
      const r = reports.find((x) => x.device === d && x.route === route.path);
      if (!r) return '—';
      const tap = r.tapFailures.length;
      const over = r.overflow.overflows ? '⚠' : '·';
      return `${tap} ${over}`;
    });
    lines.push(`| \`${route.path}\` | ${cells.join(' | ')} |`);
  }
  lines.push('');

  // Per-route detail
  lines.push('## Per-route detail');
  lines.push('');
  for (const route of ROUTES) {
    lines.push(`### \`${route.path}\``);
    lines.push('');
    for (const d of devices) {
      const r = reports.find((x) => x.device === d && x.route === route.path);
      if (!r) continue;
      const lcp = r.vitals.lcp != null ? `${r.vitals.lcp}ms` : 'n/a';
      const cls = r.vitals.cls != null ? r.vitals.cls.toFixed(3) : 'n/a';
      lines.push(
        `- **${d}** — tap-fails: ${r.tapFailures.length}, overflow: ${r.overflow.overflows ? `yes (${r.overflow.scrollWidth}>${r.overflow.innerWidth})` : 'no'}, console: ${r.consoleErrors.length}, LCP ${lcp}, CLS ${cls}`,
      );
    }
    lines.push('');
  }

  await fs.writeFile(path.join(OUT_ROOT, 'findings.md'), lines.join('\n'));
  await fs.writeFile(path.join(OUT_ROOT, 'reports.json'), JSON.stringify(reports, null, 2));
});
