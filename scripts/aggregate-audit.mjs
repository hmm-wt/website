#!/usr/bin/env node
// Aggregate per-device, per-route audit JSON reports into a unified
// findings.md + reports.json. Run after `npm run audit:mobile`.
//   node scripts/aggregate-audit.mjs [YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';

function main() {
  const runDate = process.argv[2] || new Date().toISOString().slice(0, 10);
  const root = path.join(process.cwd(), '_mobile-audit', runDate);
  if (!fs.existsSync(root)) {
    console.error(`No audit dir at ${root}`);
    process.exit(1);
  }

  const reports = [];
  const devices = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const device of devices) {
    const deviceDir = path.join(root, device);
    const routes = fs
      .readdirSync(deviceDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const route of routes) {
      const reportPath = path.join(deviceDir, route.name, 'report.json');
      if (!fs.existsSync(reportPath)) continue;
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        reports.push(report);
      } catch (err) {
        console.warn(`Skipping ${reportPath}: ${err.message}`);
      }
    }
  }

  const byDevice = new Map();
  for (const r of reports) {
    if (!byDevice.has(r.device)) byDevice.set(r.device, []);
    byDevice.get(r.device).push(r);
  }
  const allRoutes = Array.from(new Set(reports.map((r) => r.route))).sort();
  const allDevices = Array.from(byDevice.keys()).sort();

  const lines = [];
  lines.push(`# Mobile Audit — ${runDate}`);
  lines.push('');
  lines.push(`**Coverage:** ${allDevices.length} devices × ${allRoutes.length} routes = ${reports.length} runs`);
  lines.push('');
  lines.push(`**Devices:** ${allDevices.join(', ')}`);
  lines.push('');

  const totalOverflows = reports.filter((r) => r.overflow.overflows).length;
  const totalTapFailures = reports.reduce((acc, r) => acc + r.tapFailures.length, 0);
  const totalConsoleErrors = reports.reduce((acc, r) => acc + r.consoleErrors.length, 0);
  const totalLcpFails = reports.filter((r) => (r.vitals.lcp ?? 0) > 2500).length;
  const totalClsFails = reports.filter((r) => (r.vitals.cls ?? 0) > 0.1).length;

  lines.push('## Severity ranking');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|---|---|');
  lines.push(`| Horizontal-scroll violations | ${totalOverflows} / ${reports.length} |`);
  lines.push(`| Tap-target failures (<44px) | ${totalTapFailures} total findings |`);
  lines.push(`| Console errors | ${totalConsoleErrors} total |`);
  lines.push(`| LCP > 2.5s | ${totalLcpFails} / ${reports.length} |`);
  lines.push(`| CLS > 0.1 | ${totalClsFails} / ${reports.length} |`);
  lines.push('');

  const tapAgg = new Map();
  for (const r of reports) {
    for (const t of r.tapFailures) {
      const key = t.selector;
      const cur = tapAgg.get(key);
      if (cur) {
        cur.count++;
        cur.minWidth = Math.min(cur.minWidth, t.width);
        cur.minHeight = Math.min(cur.minHeight, t.height);
        cur.devices.add(r.device);
        cur.routes.add(r.route);
      } else {
        tapAgg.set(key, {
          count: 1,
          minWidth: t.width,
          minHeight: t.height,
          sample: t.text || t.tag,
          devices: new Set([r.device]),
          routes: new Set([r.route]),
        });
      }
    }
  }
  const tapRanked = Array.from(tapAgg.entries()).sort((a, b) => b[1].count - a[1].count);
  if (tapRanked.length) {
    lines.push('## Top tap-target offenders (cross-device)');
    lines.push('');
    lines.push('| Selector | Min size (px) | Hits | Devices | Routes | Sample |');
    lines.push('|---|---|---|---|---|---|');
    for (const [sel, agg] of tapRanked.slice(0, 30)) {
      lines.push(
        `| \`${sel}\` | ${agg.minWidth}×${agg.minHeight} | ${agg.count} | ${agg.devices.size} | ${agg.routes.size} | ${(agg.sample || '').slice(0, 40)} |`,
      );
    }
    lines.push('');
  }

  const overflows = reports.filter((r) => r.overflow.overflows);
  if (overflows.length) {
    lines.push('## Horizontal-scroll violations');
    lines.push('');
    lines.push('| Device | Route | Scroll / Viewport | Worst offender |');
    lines.push('|---|---|---|---|');
    for (const r of overflows) {
      const worst = r.overflow.worstOffender
        ? `\`${r.overflow.worstOffender.selector}\` (${r.overflow.worstOffender.width}px)`
        : '—';
      lines.push(`| ${r.device} | \`${r.route}\` | ${r.overflow.scrollWidth} / ${r.overflow.innerWidth} | ${worst} |`);
    }
    lines.push('');
  }

  const errored = reports.filter((r) => r.consoleErrors.length > 0);
  if (errored.length) {
    lines.push('## Console errors');
    lines.push('');
    for (const r of errored) {
      lines.push(`### ${r.device} · \`${r.route}\``);
      for (const e of r.consoleErrors) lines.push(`- ${e}`);
      lines.push('');
    }
  }

  lines.push('## Route × device matrix (tap failures · overflow)');
  lines.push('');
  lines.push(`| Route | ${allDevices.join(' | ')} |`);
  lines.push(`|---${allDevices.map(() => '|---').join('')}|`);
  for (const route of allRoutes) {
    const cells = allDevices.map((d) => {
      const r = reports.find((x) => x.device === d && x.route === route);
      if (!r) return '—';
      const tap = r.tapFailures.length;
      const over = r.overflow.overflows ? '⚠' : '·';
      return `${tap} ${over}`;
    });
    lines.push(`| \`${route}\` | ${cells.join(' | ')} |`);
  }
  lines.push('');

  lines.push('## Web vitals — LCP (ms)');
  lines.push('');
  lines.push(`| Route | ${allDevices.join(' | ')} |`);
  lines.push(`|---${allDevices.map(() => '|---').join('')}|`);
  for (const route of allRoutes) {
    const cells = allDevices.map((d) => {
      const r = reports.find((x) => x.device === d && x.route === route);
      if (!r) return '—';
      return r.vitals.lcp != null ? `${r.vitals.lcp}` : 'n/a';
    });
    lines.push(`| \`${route}\` | ${cells.join(' | ')} |`);
  }
  lines.push('');

  fs.writeFileSync(path.join(root, 'findings.md'), lines.join('\n'));
  fs.writeFileSync(path.join(root, 'reports.json'), JSON.stringify(reports, null, 2));

  console.log(
    `Aggregated ${reports.length} reports across ${allDevices.length} devices × ${allRoutes.length} routes`,
  );
  console.log(`→ ${path.join(root, 'findings.md')}`);
}

main();
