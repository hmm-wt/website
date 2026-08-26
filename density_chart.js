/* Tokens, read at paint time. These figures hardcoded colour because
   nothing handed it to them; reading the custom property also means a theme
   change reaches the canvas, which a frozen hex never could. */
function __T(n, fallback) {
  var v = getComputedStyle(document.documentElement).getPropertyValue(n);
  return (v && v.trim()) || fallback;
}
/* density_chart.js
   Startup formation intensity 2015 to 2026, indexed to 2015 = 100.
   Stacked area, three country bands (bottom to top: JP, AU, NZ),
   reverted-growth trend overlay, click-to-drill panels.

   HARD RULE: no absolute company count is ever rendered, stored in the DOM,
   or placed in a data-* attribute. Only indexed values (2015 = 100) and
   shares/percentages are visible. Counts do not exist in this module.

   Self-contained, vanilla JS, no libraries. Injects its own scoped CSS.
*/
(function () {
  "use strict";

  function init() {
    var root = document.getElementById("densityChart");
    if (!root) return; // guard: do nothing if the container is absent

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var SVGNS = "http://www.w3.org/2000/svg";

    /* ----------------------------------------------------------------
       Data. Values are INDEX points (2015 = 100), not counts.
       ---------------------------------------------------------------- */
    var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

    // Observed (index, 2015 = 100). tot === jp + au + nz.
    var OBS = [
      { jp: 23, au: 68, nz: 9,  tot: 100 },
      { jp: 13, au: 85, nz: 4,  tot: 102 },
      { jp: 23, au: 95, nz: 12, tot: 130 },
      { jp: 23, au: 77, nz: 7,  tot: 107 },
      { jp: 24, au: 101, nz: 9, tot: 134 },
      { jp: 49, au: 135, nz: 19, tot: 203 },
      { jp: 35, au: 133, nz: 24, tot: 192 },
      { jp: 21, au: 61, nz: 15, tot: 97 },
      { jp: 11, au: 100, nz: 7, tot: 118 },
      { jp: 5,  au: 64, nz: 5,  tot: 74 },
      { jp: 7,  au: 52, nz: 9,  tot: 68 },
      { jp: 0,  au: 12, nz: 3,  tot: 15 }
    ];

    // Reverted trend (index, 2015 = 100).
    var TREND = [
      { jp: 16, au: 70, nz: 6,  tot: 92 },
      { jp: 19, au: 78, nz: 7,  tot: 104 },
      { jp: 22, au: 87, nz: 8,  tot: 117 },
      { jp: 26, au: 96, nz: 10, tot: 132 },
      { jp: 30, au: 107, nz: 11, tot: 148 },
      { jp: 36, au: 119, nz: 13, tot: 168 },
      { jp: 42, au: 133, nz: 15, tot: 190 },
      { jp: 49, au: 148, nz: 18, tot: 215 },
      { jp: 58, au: 164, nz: 21, tot: 243 },
      { jp: 68, au: 183, nz: 25, tot: 276 },
      { jp: 80, au: 203, nz: 29, tot: 312 },
      { jp: 94, au: 226, nz: 33, tot: 353 }
    ];

    var RELIABLE_END = 6; // index of 2021 (2015..2021 reliable, full fill)
    var MATURE_START = 7; // index of 2022 (2022..2026 maturing, hatch)

    var BANDS = [
      { key: "jp", code: "JP", name: "Japan" },
      { key: "au", code: "AU", name: "Australia" },
      { key: "nz", code: "NZ", name: "New Zealand" }
    ];

    var COPY = {
      jp: {
        name: "Japan",
        hex: __T("--hmm-mkt-jp-dark", "#687DB8"),
        lines: [
          "Growth 17.5%/yr (2015 to 2020) · strong-tier share 70%, the highest of the three · peak formation 2020 · trend to ~3.5x the 2015 base by 2026",
          "Necessity mix: Heal 85%, Eat 9%, Power 7%. The band is late-forming and overwhelmingly Heal, tracking the world's oldest population and the PMDA medical gate. Power and Eat are present but thin. The exit route on TSE Growth is the real differentiator."
        ]
      },
      au: {
        name: "Australia",
        hex: __T("--hmm-mkt-au-dark", "#A77900"),
        lines: [
          "Growth 11.2%/yr · strong-tier share 44% · peak formation 2020 · the widest band throughout",
          "Necessity mix: Heal 76%, Power 13%, Eat 11%. The volume of the cohort and the widest funnel, which is why its strong-tier share sits lowest. Power carries the critical-minerals and autonomous-mining hardware edge; Eat the field-autonomy layer. Exits resolve offshore through trade sale to global acquirers."
        ]
      },
      nz: {
        name: "New Zealand",
        hex: __T("--hmm-mkt-nz-dark", "#C0C0C0"),
        lines: [
          "Growth 16.7%/yr · strong-tier share 47% · peak formation 2021 · the thinnest, latest band",
          "Necessity mix: Heal 53%, Eat 29%, Power 17%. The most balanced by necessity, with the highest Eat share of the three, reflecting the pastoral and animal base and the gene-technology reform. Companies are global from the first customer, and exits go offshore."
        ]
      }
    };
    var PANEL_FOOTER =
      "hmm in-mandate screen v3 · indexed to 2015 · formation years 2015 to 2026";

    /* ----------------------------------------------------------------
       Geometry
       ---------------------------------------------------------------- */
    var VBW = 900, VBH = 500;
    var M = { top: 22, right: 26, bottom: 40, left: 60 };
    var PW = VBW - M.left - M.right;
    var PH = VBH - M.top - M.bottom;
    var Y_MAX = 380; // headroom above the 353 endpoint
    var Y_TICKS = [100, 200, 300];

    function xAt(i) { return M.left + (i / (YEARS.length - 1)) * PW; }
    function yAt(v) { return M.top + PH - (v / Y_MAX) * PH; }

    // cumulative lower/upper for a stacked band in a table row
    function lower(row, key) {
      if (key === "jp") return 0;
      if (key === "au") return row.jp;
      return row.jp + row.au; // nz
    }
    function upper(row, key) {
      if (key === "jp") return row.jp;
      if (key === "au") return row.jp + row.au;
      return row.tot; // nz
    }

    // polygon points for a stacked band across index range [i0, i1]
    function bandPoints(table, key, i0, i1) {
      var pts = [];
      var i;
      for (i = i0; i <= i1; i++) pts.push(xAt(i) + "," + yAt(upper(table[i], key)));
      for (i = i1; i >= i0; i--) pts.push(xAt(i) + "," + yAt(lower(table[i], key)));
      return pts.join(" ");
    }

    // wash between observed total (lower) and trend total (upper) over a range
    function washPoints(i0, i1) {
      var pts = [];
      var i;
      for (i = i0; i <= i1; i++) pts.push(xAt(i) + "," + yAt(TREND[i].tot));
      for (i = i1; i >= i0; i--) pts.push(xAt(i) + "," + yAt(OBS[i].tot));
      return pts.join(" ");
    }

    function linePoints(table) {
      var pts = [];
      for (var i = 0; i < table.length; i++) pts.push(xAt(i) + "," + yAt(table[i].tot));
      return pts.join(" ");
    }

    /* ----------------------------------------------------------------
       Styles (scoped under #densityChart)
       ---------------------------------------------------------------- */
    if (!document.getElementById("dc-style")) {
      var style = document.createElement("style");
      style.id = "dc-style";
      style.textContent = [
        "#densityChart{",
        "  --dc-jp:var(--hmm-mkt-jp-ink); --dc-au:var(--hmm-mkt-au-ink); --dc-nz:var(--hmm-mkt-nz-ink);",
        "  --dc-surface:var(--hmm-surface-solid);",
        "  --dc-grid:rgba(242,236,201,0.12);",
        "  --dc-wash:rgba(242,236,201,0.07);",
        "  --dc-hatch:rgba(29,29,27,0.55);",
        "  --dc-ink:var(--hmm-pearl);",
        "  --dc-muted:var(--hmm-text-muted);",
        "  --dc-faint:var(--hmm-text-faint);",
        "  --dc-border:var(--hmm-border,rgba(242,236,201,0.16));",
        "  --dc-panel-bg:rgba(242,236,201,0.04);",
        "  color:var(--dc-ink);",
        "  font-family:var(--hmm-font-body,system-ui,-apple-system,'Segoe UI',sans-serif);",
        "}",
        // light via media query
        "@media (prefers-color-scheme: light){#densityChart{",
        "  --dc-jp:var(--hmm-mkt-jp-dark); --dc-au:var(--hmm-mkt-au-dark); --dc-nz:var(--hmm-mkt-nz-dark);",
        "  --dc-surface:var(--hmm-white);",
        "  --dc-grid:rgba(20,20,20,0.12);",
        "  --dc-wash:rgba(20,20,20,0.06);",
        "  --dc-hatch:rgba(247,245,240,0.6);",
        "  --dc-ink:var(--hmm-evergreen);",
        "  --dc-muted:var(--hmm-text-dark-muted-solid);",
        "  --dc-faint:var(--hmm-text-dark-faint-solid);",
        "  --dc-border:rgba(20,20,20,0.16);",
        "  --dc-panel-bg:rgba(20,20,20,0.035);",
        "}}",
        // explicit theme overrides win over the media query
        ":root[data-theme=\"light\"] #densityChart{",
        "  --dc-jp:var(--hmm-mkt-jp-dark); --dc-au:var(--hmm-mkt-au-dark); --dc-nz:var(--hmm-mkt-nz-dark);",
        "  --dc-surface:var(--hmm-white);",
        "  --dc-grid:rgba(20,20,20,0.12);",
        "  --dc-wash:rgba(20,20,20,0.06);",
        "  --dc-hatch:rgba(247,245,240,0.6);",
        "  --dc-ink:var(--hmm-evergreen);",
        "  --dc-muted:var(--hmm-text-dark-muted-solid);",
        "  --dc-faint:var(--hmm-text-dark-faint-solid);",
        "  --dc-border:rgba(20,20,20,0.16);",
        "  --dc-panel-bg:rgba(20,20,20,0.035);",
        "}",
        ":root[data-theme=\"dark\"] #densityChart{",
        "  --dc-jp:var(--hmm-mkt-jp-ink); --dc-au:var(--hmm-mkt-au-ink); --dc-nz:var(--hmm-mkt-nz-ink);",
        "  --dc-surface:var(--hmm-surface-solid);",
        "  --dc-grid:rgba(242,236,201,0.12);",
        "  --dc-wash:rgba(242,236,201,0.07);",
        "  --dc-hatch:rgba(29,29,27,0.55);",
        "  --dc-ink:var(--hmm-pearl);",
        "  --dc-muted:var(--hmm-text-muted);",
        "  --dc-faint:var(--hmm-text-faint);",
        "  --dc-border:var(--hmm-border,rgba(242,236,201,0.16));",
        "  --dc-panel-bg:rgba(242,236,201,0.04);",
        "}",
        "#densityChart *{box-sizing:border-box;}",
        "#densityChart .dc-root{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;width:100%;}",
        "#densityChart .dc-main{flex:1 1 460px;min-width:0;}",
        "#densityChart .dc-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin:0 0 12px 0;padding:0;}",
        "#densityChart .dc-chip{display:inline-flex;align-items:center;gap:7px;background:transparent;border:1px solid var(--dc-border);border-radius:999px;padding:5px 11px;cursor:pointer;color:var(--dc-ink);font-size:12px;line-height:1;font-family:inherit;}",
        "#densityChart .dc-chip:hover{border-color:var(--dc-muted);}",
        "#densityChart .dc-chip:focus-visible{outline:2px solid var(--dc-ink);outline-offset:2px;}",
        "#densityChart .dc-chip[aria-pressed=\"true\"]{border-color:currentColor;}",
        "#densityChart .dc-swatch{width:11px;height:11px;border-radius:3px;flex:none;}",
        "#densityChart .dc-svgwrap{position:relative;width:100%;}",
        "#densityChart svg.dc-svg{display:block;width:100%;height:auto;}",
        "#densityChart .dc-band{cursor:pointer;outline:none;}",
        "#densityChart .dc-band:focus-visible .dc-band-solid{stroke:var(--dc-ink);stroke-width:1.5;}",
        "#densityChart .dc-dim{opacity:0.28;}",
        "#densityChart .dc-lift .dc-band-solid{opacity:1;}",
        "#densityChart text{fill:var(--dc-ink);}",
        "#densityChart .dc-axis{fill:var(--dc-muted);font-size:11px;}",
        "#densityChart .dc-axis-mono{font-family:var(--hmm-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-variant-numeric:tabular-nums;}",
        "#densityChart .dc-ylabel{fill:var(--dc-muted);font-size:11px;}",
        "#densityChart .dc-bandlabel{font-size:12.5px;font-weight:600;paint-order:stroke;stroke:var(--dc-surface);stroke-width:2.5px;}",
        "#densityChart .dc-washlabel{fill:var(--dc-muted);font-size:11px;font-style:italic;}",
        "#densityChart .dc-tooltip{position:absolute;pointer-events:none;z-index:5;background:var(--dc-surface);color:var(--dc-ink);border:1px solid var(--dc-border);border-radius:7px;padding:8px 10px;font-size:12px;line-height:1.45;box-shadow:0 6px 22px rgba(0,0,0,0.28);opacity:0;transition:opacity .12s ease;max-width:230px;}",
        "#densityChart .dc-tooltip .dc-tt-mono{font-family:var(--hmm-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-variant-numeric:tabular-nums;}",
        "#densityChart .dc-tt-yr{font-weight:600;margin-bottom:2px;}",
        "#densityChart .dc-cap{margin-top:14px;color:var(--dc-muted);font-size:11.5px;line-height:1.5;}",
        "#densityChart .dc-honesty{margin-top:6px;color:var(--dc-faint);font-size:11px;line-height:1.5;font-style:italic;}",
        "#densityChart .dc-panel{flex:0 0 320px;max-width:340px;min-width:0;background:var(--dc-panel-bg);border:1px solid var(--dc-border);border-left-width:4px;border-radius:8px;padding:16px 18px;display:none;}",
        "#densityChart .dc-panel.dc-open{display:block;}",
        "#densityChart .dc-panel h3{margin:0 0 4px 0;font-size:16px;font-weight:600;color:var(--dc-ink);}",
        "#densityChart .dc-panel .dc-p-line{margin:10px 0 0 0;font-size:12.5px;line-height:1.55;color:var(--dc-ink);}",
        "#densityChart .dc-panel .dc-p-foot{margin:16px 0 0 0;padding-top:12px;border-top:1px solid var(--dc-border);font-size:10.5px;color:var(--dc-faint);font-family:var(--hmm-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);}",
        "#densityChart .dc-p-head{display:flex;align-items:center;justify-content:space-between;gap:12px;}",
        "#densityChart .dc-close{background:transparent;border:1px solid var(--dc-border);border-radius:6px;color:var(--dc-muted);cursor:pointer;font-size:13px;line-height:1;padding:5px 9px;font-family:inherit;}",
        "#densityChart .dc-close:hover{color:var(--dc-ink);border-color:var(--dc-muted);}",
        "#densityChart .dc-close:focus-visible{outline:2px solid var(--dc-ink);outline-offset:2px;}",
        "@media (max-width:760px){#densityChart .dc-root{flex-direction:column;}#densityChart .dc-panel{flex:1 1 auto;max-width:none;width:100%;}}",
        reduceMotion
          ? "#densityChart .dc-svg,#densityChart .dc-tooltip{transition:none !important;}"
          : "#densityChart .dc-svg{opacity:0;transition:opacity .55s ease;}#densityChart .dc-svg.dc-shown{opacity:1;}"
      ].join("\n");
      document.head.appendChild(style);
    }

    /* ----------------------------------------------------------------
       DOM scaffold
       ---------------------------------------------------------------- */
    root.textContent = "";
    var rootWrap = document.createElement("div");
    rootWrap.className = "dc-root";

    var main = document.createElement("div");
    main.className = "dc-main";

    // legend
    var legend = document.createElement("div");
    legend.className = "dc-legend";
    legend.setAttribute("role", "group");
    legend.setAttribute("aria-label", "Country bands. Activate to open a market panel.");

    var svgWrap = document.createElement("div");
    svgWrap.className = "dc-svgwrap";

    var tooltip = document.createElement("div");
    tooltip.className = "dc-tooltip";
    tooltip.setAttribute("role", "status");
    tooltip.setAttribute("aria-live", "polite");

    main.appendChild(legend);
    main.appendChild(svgWrap);

    // caption + honesty line
    var cap = document.createElement("p");
    cap.className = "dc-cap";
    cap.textContent =
      "Formation intensity indexed to 2015 = 100. Solid = observed (2022 to 2026 still maturing). " +
      "Dashed = trend if 2015 to 2020 growth resumes (JP 17.5%, AU 11.2%, NZ 16.7% per year). 2026 shown on trend.";
    var honesty = document.createElement("p");
    honesty.className = "dc-honesty";
    honesty.textContent =
      "A reversion assumption, not a forecast. It shows the trajectory if the recent dip is censoring " +
      "plus a pause and growth returns to its 2015 to 2020 pace.";
    main.appendChild(cap);
    main.appendChild(honesty);

    // panel
    var panel = document.createElement("div");
    panel.className = "dc-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Market detail");

    rootWrap.appendChild(main);
    rootWrap.appendChild(panel);
    root.appendChild(rootWrap);

    /* ----------------------------------------------------------------
       SVG
       ---------------------------------------------------------------- */
    function el(name, attrs) {
      var n = document.createElementNS(SVGNS, name);
      if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
      return n;
    }
    function cssvar(key) { return "var(--dc-" + key + ")"; }

    var svg = el("svg", {
      class: "dc-svg",
      viewBox: "0 0 " + VBW + " " + VBH,
      preserveAspectRatio: "xMidYMid meet",
      role: "img"
    });
    var title = el("title");
    title.textContent =
      "Startup formation intensity 2015 to 2026, indexed to 2015 = 100, three country bands with reverted-growth trend.";
    svg.appendChild(title);

    // defs: hatch pattern for the maturing zone (surface-coloured grooves over the hue)
    var defs = el("defs");
    var pat = el("pattern", {
      id: "dc-hatch",
      width: "7",
      height: "7",
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(0)"
    });
    // 45-degree lines
    pat.appendChild(el("path", {
      d: "M0,7 L7,0",
      stroke: cssvar("hatch"),
      "stroke-width": "1.3"
    }));
    pat.appendChild(el("path", {
      d: "M-1,1 L1,-1 M6,8 L8,6",
      stroke: cssvar("hatch"),
      "stroke-width": "1.3"
    }));
    defs.appendChild(pat);
    svg.appendChild(defs);

    // --- grid (horizontal only) ---
    var gGrid = el("g");
    Y_TICKS.forEach(function (t) {
      gGrid.appendChild(el("line", {
        x1: M.left, x2: M.left + PW, y1: yAt(t), y2: yAt(t),
        stroke: cssvar("grid"), "stroke-width": "1"
      }));
    });
    svg.appendChild(gGrid);

    /* Layer 1: reverted-trend stacked area (behind everything, ~25% fill) */
    var gTrend = el("g", { opacity: "0.25" });
    BANDS.forEach(function (b) {
      gTrend.appendChild(el("polygon", {
        points: bandPoints(TREND, b.key, 0, YEARS.length - 1),
        fill: cssvar(b.key), stroke: "none"
      }));
    });
    svg.appendChild(gTrend);

    /* Layer 2: below-trend wash (2022 to 2026), neutral ink */
    var gWash = el("g");
    gWash.appendChild(el("polygon", {
      points: washPoints(MATURE_START, YEARS.length - 1),
      fill: cssvar("wash"), stroke: "none"
    }));
    svg.appendChild(gWash);
    // one label, no number
    var washMidI = 9; // ~2024
    var washLabel = el("text", {
      class: "dc-washlabel",
      x: xAt(washMidI),
      y: yAt((OBS[washMidI].tot + TREND[washMidI].tot) / 2),
      "text-anchor": "middle"
    });
    washLabel.textContent = "below trend · cohort not yet surfaced";
    svg.appendChild(washLabel);

    /* Layer 3: observed stacked area (full fill all years, hatch over 2022 to 2026) */
    var bandGroups = {};
    var gObs = el("g");
    BANDS.forEach(function (b) {
      var g = el("g", {
        class: "dc-band",
        tabindex: "0",
        role: "button"
      });
      g.setAttribute("aria-label", "Open " + COPY[b.key].name + " market detail");

      // solid band across the full range
      var solid = el("polygon", {
        class: "dc-band-solid",
        points: bandPoints(OBS, b.key, 0, YEARS.length - 1),
        fill: cssvar(b.key),
        stroke: cssvar("surface"),
        "stroke-width": "2",
        "stroke-linejoin": "round"
      });
      g.appendChild(solid);

      // hatch overlay for the maturing zone (2022 to 2026), same hue underneath
      g.appendChild(el("polygon", {
        points: bandPoints(OBS, b.key, MATURE_START, YEARS.length - 1),
        fill: "url(#dc-hatch)",
        stroke: "none",
        "pointer-events": "none"
      }));

      bandGroups[b.key] = g;
      gObs.appendChild(g);
    });
    svg.appendChild(gObs);

    /* Layer 4: trend TOTAL line, 2px dashed, ends at index 353 in 2026 */
    svg.appendChild(el("polyline", {
      points: linePoints(TREND),
      fill: "none",
      stroke: cssvar("ink"),
      "stroke-width": "2",
      "stroke-dasharray": "6 5",
      opacity: "0.85",
      "pointer-events": "none"
    }));

    /* Layer 5: 2026 markers. Open circle on observed total at index 15. */
    var last = YEARS.length - 1;
    svg.appendChild(el("circle", {
      cx: xAt(last), cy: yAt(OBS[last].tot), r: "4.5",
      fill: cssvar("surface"),
      stroke: cssvar("ink"), "stroke-width": "1.6",
      "pointer-events": "none"
    }));

    // direct band labels at widest point (observed)
    var labelSpots = {
      jp: { i: 5, mid: (lower(OBS[5], "jp") + upper(OBS[5], "jp")) / 2 },
      au: { i: 5, mid: (lower(OBS[5], "au") + upper(OBS[5], "au")) / 2 },
      nz: { i: 6, mid: (lower(OBS[6], "nz") + upper(OBS[6], "nz")) / 2 }
    };
    BANDS.forEach(function (b) {
      var s = labelSpots[b.key];
      var t = el("text", {
        class: "dc-bandlabel",
        x: xAt(s.i),
        y: yAt(s.mid) + 4,
        "text-anchor": "middle",
        fill: cssvar(b.key),
        "pointer-events": "none"
      });
      t.textContent = COPY[b.key].name;
      svg.appendChild(t);
    });

    // --- axes ---
    var gAxis = el("g");
    // y ticks 100 / 200 / 300 only, tabular
    Y_TICKS.forEach(function (t) {
      var lab = el("text", {
        class: "dc-axis dc-axis-mono",
        x: M.left - 10, y: yAt(t) + 3.5, "text-anchor": "end"
      });
      lab.textContent = String(t);
      gAxis.appendChild(lab);
    });
    // y axis title
    var yTitle = el("text", {
      class: "dc-ylabel",
      transform: "rotate(-90 " + (16) + " " + (M.top + PH / 2) + ")",
      x: 16, y: M.top + PH / 2, "text-anchor": "middle"
    });
    yTitle.textContent = "Formation index (2015 = 100)";
    gAxis.appendChild(yTitle);
    // x ticks: one per year
    YEARS.forEach(function (yr, i) {
      var lab = el("text", {
        class: "dc-axis dc-axis-mono",
        x: xAt(i), y: M.top + PH + 22, "text-anchor": "middle"
      });
      lab.textContent = String(yr);
      gAxis.appendChild(lab);
    });
    svg.appendChild(gAxis);

    // --- crosshair (hidden until hover) ---
    var crosshair = el("line", {
      y1: M.top, y2: M.top + PH,
      stroke: cssvar("muted"), "stroke-width": "1",
      "stroke-dasharray": "3 3", opacity: "0", "pointer-events": "none"
    });
    svg.appendChild(crosshair);

    // --- hover capture rect over the plot ---
    var capture = el("rect", {
      x: M.left, y: M.top, width: PW, height: PH,
      fill: "transparent"
    });
    svg.appendChild(capture);

    svgWrap.appendChild(svg);
    svgWrap.appendChild(tooltip);

    /* ----------------------------------------------------------------
       Legend chips
       ---------------------------------------------------------------- */
    BANDS.forEach(function (b) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "dc-chip";
      chip.setAttribute("aria-pressed", "false");
      chip.setAttribute("data-key", b.key);
      var sw = document.createElement("span");
      sw.className = "dc-swatch";
      sw.style.background = cssvar(b.key);
      var tx = document.createElement("span");
      tx.textContent = COPY[b.key].name;
      chip.appendChild(sw);
      chip.appendChild(tx);
      chip.addEventListener("click", function () { toggleMarket(b.key); });
      legend.appendChild(chip);
    });

    /* ----------------------------------------------------------------
       Interaction: hover tooltip + crosshair
       ---------------------------------------------------------------- */
    function nearestIndex(clientX) {
      var rect = svg.getBoundingClientRect();
      var scale = VBW / rect.width;
      var vx = (clientX - rect.left) * scale;
      var frac = (vx - M.left) / PW;
      var i = Math.round(frac * (YEARS.length - 1));
      if (i < 0) i = 0;
      if (i > YEARS.length - 1) i = YEARS.length - 1;
      return i;
    }

    function showTip(i, clientX) {
      var row = OBS[i];
      // shares of that year's total, sorted descending (no counts)
      var parts = [
        { code: "AU", v: row.au },
        { code: "JP", v: row.jp },
        { code: "NZ", v: row.nz }
      ].sort(function (a, c) { return c.v - a.v; }).map(function (p) {
        var pct = row.tot > 0 ? Math.round((p.v / row.tot) * 100) : 0;
        return p.code + " " + pct + "%";
      });

      tooltip.innerHTML = "";
      var head = document.createElement("div");
      head.className = "dc-tt-yr";
      head.textContent = YEARS[i] + " · index " + row.tot;
      var body = document.createElement("div");
      body.className = "dc-tt-mono";
      body.textContent = parts.join(" / ");
      tooltip.appendChild(head);
      tooltip.appendChild(body);

      // position within svgWrap
      var wrapRect = svgWrap.getBoundingClientRect();
      var svgRect = svg.getBoundingClientRect();
      var px = (xAt(i) / VBW) * svgRect.width + (svgRect.left - wrapRect.left);
      tooltip.style.opacity = "1";
      var ttW = tooltip.offsetWidth;
      var left = px - ttW / 2;
      if (left < 0) left = 0;
      if (left + ttW > wrapRect.width) left = wrapRect.width - ttW;
      tooltip.style.left = left + "px";
      tooltip.style.top = "6px";

      crosshair.setAttribute("x1", xAt(i));
      crosshair.setAttribute("x2", xAt(i));
      crosshair.setAttribute("opacity", "1");
    }
    function hideTip() {
      tooltip.style.opacity = "0";
      crosshair.setAttribute("opacity", "0");
    }

    capture.addEventListener("mousemove", function (e) {
      showTip(nearestIndex(e.clientX), e.clientX);
    });
    capture.addEventListener("mouseleave", hideTip);

    /* ----------------------------------------------------------------
       Interaction: drill panel
       ---------------------------------------------------------------- */
    var openKey = null;

    function renderPanel(key) {
      var c = COPY[key];
      panel.innerHTML = "";
      panel.style.borderLeftColor = "var(--dc-" + key + ")";

      var head = document.createElement("div");
      head.className = "dc-p-head";
      var h = document.createElement("h3");
      h.textContent = c.name;
      var close = document.createElement("button");
      close.type = "button";
      close.className = "dc-close";
      close.textContent = "Close";
      close.setAttribute("aria-label", "Close market detail");
      close.addEventListener("click", function () { closeMarket(); });
      head.appendChild(h);
      head.appendChild(close);
      panel.appendChild(head);

      c.lines.forEach(function (ln) {
        var p = document.createElement("p");
        p.className = "dc-p-line";
        p.textContent = ln;
        panel.appendChild(p);
      });

      var foot = document.createElement("p");
      foot.className = "dc-p-foot";
      foot.textContent = PANEL_FOOTER;
      panel.appendChild(foot);
    }

    function applyLift(key) {
      BANDS.forEach(function (b) {
        var g = bandGroups[b.key];
        g.classList.remove("dc-dim", "dc-lift");
        if (key) {
          if (b.key === key) g.classList.add("dc-lift");
          else g.classList.add("dc-dim");
        }
      });
      var chips = legend.querySelectorAll(".dc-chip");
      chips.forEach(function (ch) {
        ch.setAttribute("aria-pressed", ch.getAttribute("data-key") === key ? "true" : "false");
      });
    }

    function openMarket(key) {
      openKey = key;
      renderPanel(key);
      panel.classList.add("dc-open");
      applyLift(key);
    }
    function closeMarket() {
      openKey = null;
      panel.classList.remove("dc-open");
      applyLift(null);
    }
    function toggleMarket(key) {
      if (openKey === key) closeMarket();
      else openMarket(key);
    }

    BANDS.forEach(function (b) {
      var g = bandGroups[b.key];
      g.addEventListener("click", function () { toggleMarket(b.key); });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          toggleMarket(b.key);
        }
      });
    });

    /* ----------------------------------------------------------------
       Reveal
       ---------------------------------------------------------------- */
    if (reduceMotion) {
      svg.classList.add("dc-shown");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { svg.classList.add("dc-shown"); });
      });
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
