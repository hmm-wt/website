/* hmm site - THREE hexagon radar charts (Australia, New Zealand, Japan).
   One panel per market. Six spokes 60 degrees apart, same axis order and rotation
   across all three panels: AI · HARDWARE · REGULATION · STARTUP · EXIT · TRADE.
   Three necessity fills per panel (Power, Eat, Heal). Vertex radius = score/10 of
   the max spoke length. Vanilla SVG (createElementNS), no libraries.
   Renders into an existing #radars container on load; no-ops if it is absent.
   Dark by default (bg #141414) to match the live site; light via prefers-color-scheme
   and [data-theme="light"]. Honours prefers-reduced-motion (disables the dot pulse). */
(function () {
  var SVGNS = "http://www.w3.org/2000/svg";

  var AXES = ["AI", "HARDWARE", "REGULATION", "STARTUP", "EXIT", "TRADE"];

  // Necessity palette (exact hues, matched to the rest of the site).
  var HUES = { Power: "#F0902F", Eat: "#5FB873", Heal: "#4FA3DC" };
  var SERIES = ["Power", "Eat", "Heal"];

  // Scores 0 to 10, order: AI, Hardware, Regulation, Startup, Exit, Trade.
  var MARKETS = [
    {
      name: "AUSTRALIA",
      sub: "resource and materials market",
      series: { Power: [8, 10, 10, 3, 5, 9], Eat: [7, 7, 8, 2, 5, 8], Heal: [8, 9, 8, 10, 5, 8] }
    },
    {
      name: "NEW ZEALAND",
      sub: "standard-setting market",
      series: { Power: [3, 3, 6, 5, 4, 4], Eat: [8, 7, 9, 6, 4, 9], Heal: [5, 8, 7, 10, 4, 7] }
    },
    {
      name: "JAPAN",
      sub: "hardware market under demand stress",
      series: { Power: [6, 10, 8, 1, 8, 6], Eat: [6, 8, 6, 1, 8, 4], Heal: [7, 9, 9, 10, 8, 6] }
    }
  ];

  var CAPTION =
    "Scored 0 to 10 relative to each market's own ceiling. Read down a panel's own axes, " +
    "not across markets: a score is not an absolute quantity that carries between markets. " +
    "Two axes are measured from hmm's in-mandate pipeline (startup depth, exit route); " +
    "four are assessed from market structure (AI, hardware, regulation, trade).";

  // ---- geometry ----
  var VB_W = 320, VB_H = 300;   // per-panel viewBox
  var CX = 160, CY = 148;       // chart centre
  var R = 86;                   // max spoke length (score 10)
  var LBL_R = R + 18;           // axis-label radius
  var RINGS = [2, 4, 6, 8, 10];
  var RING_LABELS = [2, 6, 10];

  // AI at top (-90deg), then clockwise every 60deg.
  function angle(i) { return (-90 + i * 60) * Math.PI / 180; }
  function px(i, radius) { return CX + Math.cos(angle(i)) * radius; }
  function py(i, radius) { return CY + Math.sin(angle(i)) * radius; }

  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function hexPath(radius) {
    var d = "";
    for (var i = 0; i < 6; i++) d += (i === 0 ? "M" : "L") + px(i, radius).toFixed(2) + " " + py(i, radius).toFixed(2);
    return d + "Z";
  }

  function scorePath(scores) {
    var d = "";
    for (var i = 0; i < 6; i++) {
      var rr = (scores[i] / 10) * R;
      d += (i === 0 ? "M" : "L") + px(i, rr).toFixed(2) + " " + py(i, rr).toFixed(2);
    }
    return d + "Z";
  }

  function anchorFor(x) {
    var d = x - CX;
    if (d > 6) return "start";
    if (d < -6) return "end";
    return "middle";
  }

  function css() {
    return [
      "#radars{--rad-surface:#141414;--rad-power:" + HUES.Power + ";--rad-eat:" + HUES.Eat + ";--rad-heal:" + HUES.Heal + ";",
      "  font-family:var(--hmm-font-mono,'Raela Grotesque','Helvetica Neue',sans-serif);color:var(--hmm-pearl,#F2ECC9);position:relative;}",
      "@media (prefers-color-scheme:light){#radars{--rad-surface:#ffffff;}}",
      "#radars[data-theme='light'],:root[data-theme='light'] #radars{--rad-surface:#ffffff;}",
      "#radars[data-theme='dark'],:root[data-theme='dark'] #radars{--rad-surface:#141414;}",
      "#radars .radar-wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;width:100%;max-width:100%;box-sizing:border-box;}",
      "#radars .radar-panel{position:relative;min-width:0;padding:14px 12px 16px;border:1px solid var(--hmm-border,rgba(242,236,201,.12));box-sizing:border-box;}",
      "#radars .radar-corner{position:absolute;width:9px;height:9px;pointer-events:none;}",
      "#radars .radar-corner svg{display:block;overflow:visible;}",
      "#radars .rc-tl{top:5px;left:5px;} #radars .rc-tr{top:5px;right:5px;} #radars .rc-bl{bottom:5px;left:5px;} #radars .rc-br{bottom:5px;right:5px;}",
      "#radars .radar-title{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--hmm-pearl,#F2ECC9);margin:0;}",
      "#radars .radar-sub{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--hmm-text-faint,rgba(242,236,201,.35));margin:3px 0 8px;}",
      "#radars svg.radar-svg{display:block;width:100%;height:auto;overflow:visible;}",
      "#radars .radar-legend{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 10px;margin-top:10px;padding:0;list-style:none;}",
      "#radars .radar-chip{display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--hmm-border,rgba(242,236,201,.12));",
      "  padding:3px 8px;cursor:pointer;font:inherit;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--hmm-text-muted,rgba(242,236,201,.6));}",
      "#radars .radar-chip .swatch{width:9px;height:9px;flex:0 0 auto;border-radius:1px;}",
      "#radars .radar-chip:hover,#radars .radar-chip:focus-visible{color:var(--hmm-pearl,#F2ECC9);border-color:var(--hmm-text-faint,rgba(242,236,201,.35));}",
      "#radars .radar-chip:focus-visible{outline:2px solid var(--hmm-accent,#C44539);outline-offset:2px;}",
      "#radars .radar-panel[data-focus] .series:not(.is-active){opacity:.12;}",
      "#radars .radar-panel[data-focus] .series.is-active .radar-fill{fill-opacity:.24;}",
      "#radars .radar-panel[data-focus] .series.is-active .radar-line{stroke-width:2.6;}",
      "#radars .radar-caption{max-width:70ch;margin:20px auto 0;font-family:var(--hmm-font-mono,'Raela Grotesque','Helvetica Neue',sans-serif);",
      "  font-size:10px;line-height:1.55;letter-spacing:.02em;color:var(--hmm-text-muted,rgba(242,236,201,.6));text-align:center;}",
      "@keyframes radarPulse{0%,100%{r:1.9px;}50%{r:2.4px;}}",
      "#radars .vtx{animation:radarPulse 3.6s ease-in-out infinite;}",
      "@keyframes radarDot{0%,100%{r:1.1px;opacity:.78;}50%{r:1.6px;opacity:1;}}",
      "#radars .radar-dot{animation:radarDot 3.2s ease-in-out infinite;}",
      "@keyframes radarDotLg{0%,100%{r:1.7px;opacity:.9;}50%{r:2.4px;opacity:1;}}",
      "#radars .radar-dot--lg{animation:radarDotLg 3.2s ease-in-out infinite;}",
      "@media (prefers-reduced-motion:reduce){#radars .vtx,#radars .radar-dot,#radars .radar-dot--lg{animation:none;}}",
      "#radars .axis-lbl{cursor:help;transition:fill .15s ease;}",
      "#radars .axis-lbl:hover,#radars .axis-lbl:focus{fill:var(--hmm-pearl,#F2ECC9);outline:none;}",
      "#radars .axis-lbl:focus-visible{outline:2px solid var(--hmm-accent,#C44539);outline-offset:2px;}",
      "#radars .radar-tip{position:fixed;z-index:60;pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .15s ease,transform .15s ease;",
      "  background:#1a1a19;border:1px solid var(--hmm-border,rgba(242,236,201,.18));border-top:2px solid var(--hmm-accent,#C44539);padding:9px 12px;box-sizing:border-box;",
      "  font-family:var(--hmm-font-mono,'Raela Grotesque','Helvetica Neue',sans-serif);font-size:11px;line-height:1.5;color:var(--hmm-text-muted,rgba(242,236,201,.72));max-width:260px;}",
      "#radars .radar-tip.on{opacity:1;transform:none;}",
      "@media (prefers-reduced-motion:reduce){#radars .radar-tip{transition:none;}}",
      "#radars .radar-title--click{cursor:pointer;display:inline-flex;align-items:center;gap:8px;border-bottom:1px solid var(--hmm-accent,#C44539);padding-bottom:3px;transition:color .15s ease;}",
      "#radars .radar-title--click::after{content:'read \\2192';font-family:var(--hmm-font-mono,'Raela Grotesque','Helvetica Neue',sans-serif);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--hmm-accent,#C44539);border:1px solid var(--hmm-accent,#C44539);padding:2px 6px;transition:background .15s ease,color .15s ease;}",
      "#radars .radar-title--click:hover,#radars .radar-title--click:focus-visible{color:var(--hmm-accent,#C44539);outline:none;}",
      "#radars .radar-title--click:hover::after,#radars .radar-title--click:focus-visible::after{background:var(--hmm-accent,#C44539);color:var(--hmm-pearl,#F2ECC9);}",
      "#radars .radar-title--click.is-open{color:var(--hmm-accent,#C44539);}",
      "#radars .radar-title--click.is-open::after{content:'close \\00D7';background:var(--hmm-accent,#C44539);color:var(--hmm-pearl,#F2ECC9);}",
      "#radars .radar-drill{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:22px;box-sizing:border-box;",
      "  background:rgba(10,10,10,.74);opacity:0;visibility:hidden;transition:opacity .25s ease;}",
      "#radars .radar-drill.on{opacity:1;visibility:visible;}",
      "#radars .radar-drill-card{width:100%;max-width:620px;max-height:100%;overflow:auto;box-sizing:border-box;background:var(--rad-surface,#141414);",
      "  border:1px solid var(--hmm-border,rgba(242,236,201,.16));border-top:2px solid var(--c,#C44539);padding:18px 22px;box-shadow:0 24px 64px rgba(0,0,0,.55);",
      "  transform:translateY(8px);transition:transform .25s ease;}",
      "#radars .radar-drill.on .radar-drill-card{transform:none;}",
      "#radars .radar-drill-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}",
      "#radars .radar-drill-name{font-family:var(--hmm-font-mono,'Raela Grotesque','Helvetica Neue',sans-serif);text-transform:uppercase;letter-spacing:.14em;font-size:11px;color:var(--c,#C44539);}",
      "#radars .radar-drill-x{background:none;border:0;color:var(--hmm-text-faint,rgba(242,236,201,.4));font-size:14px;line-height:1;cursor:pointer;padding:2px 6px;}",
      "#radars .radar-drill-x:hover,#radars .radar-drill-x:focus-visible{color:var(--hmm-pearl,#F2ECC9);outline:none;}",
      "#radars .radar-drill p{margin:0;font-size:13.5px;line-height:1.6;color:var(--hmm-text-muted,rgba(242,236,201,.72));}",
      "@media (prefers-reduced-motion:reduce){#radars .radar-drill{transition:none;}}",
      "@media (max-width:860px){#radars .radar-wrap{grid-template-columns:1fr;}}"
    ].join("\n");
  }

  function cornerTick(pos) {
    // small mono corner tick in the accent, drawn as an L into the panel.
    var w = document.createElement("span");
    w.className = "radar-corner rc-" + pos;
    var s = el("svg", { width: "9", height: "9", viewBox: "0 0 9 9" });
    var horiz, vert;
    if (pos === "tl") { horiz = "M0 0 H9"; vert = "M0 0 V9"; }
    else if (pos === "tr") { horiz = "M9 0 H0"; vert = "M9 0 V9"; }
    else if (pos === "bl") { horiz = "M0 9 H9"; vert = "M0 9 V0"; }
    else { horiz = "M9 9 H0"; vert = "M9 9 V0"; }
    [horiz, vert].forEach(function (d) {
      s.appendChild(el("path", { d: d, stroke: "var(--hmm-accent,#C44539)", "stroke-width": "1", fill: "none" }));
    });
    w.appendChild(s);
    return w;
  }

  var COUNTRY_PROSE = {
    "AUSTRALIA": "Australia, the resource and materials market. Mining right-to-operate is one of the deepest regulatory regimes, and the government backs critical minerals directly through a national list and export finance. Autonomous mining scaled here first, giving a real edge in field-autonomy hardware and control. Medical-device and biotech hardware runs global through Cochlear, ResMed and CSL, and imaging AI through Harrison.ai. The venture base is mature, and super funds are beginning to fund it. Exits resolve through trade sale to US acquirers; construction-software Aconex to Oracle is the reference trade sale.",
    "NEW ZEALAND": "New Zealand, the standard-setting market. One house of parliament and top-of-table trust let it move a rule fast, and its food-safety regime is among the strongest. The gene-technology reform reopens the Eat biological-input gate. Hardware runs global at the top end through Fisher and Paykel Healthcare and Rocket Lab, and through Halter in animal agriculture. The venture base is small and global from the first customer. Exits go offshore to Australian and US acquirers.",
    "JAPAN": "Japan, the hardware market under demand stress. It imports roughly 90% of its energy, which makes Power a national-security question, and it holds the world's oldest population, which makes Heal a structural demand. The PMDA is a rigorous medical gate with a fast track for novel devices, and the AI regime is among the most permissive, with copyright law broadly allowing training on protected data. Hardware leads the world in robotics, semiconductor materials, image sensors and batteries. The venture base is thin but rising on a government startup plan, and Tokyo Growth gives it an early IPO exit. Reference names include Preferred Networks, Sakana, Spiber and SmartHR."
  };
  var COUNTRY_ACCENT = { "AUSTRALIA": "#B65C40", "NEW ZEALAND": "#0E93A6", "JAPAN": "#3E6DA6" };

  var AXIS_DEFS = {
    "AI": "AI competence. The market's ability to build and apply modern AI, from research base to deployed product.",
    "HARDWARE": "Hardware competence. Strength in physical innovation: robotics, medical devices, materials, sensors, semiconductors.",
    "REGULATION": "Regulation. The depth and favourability of the necessity gates, the right-to-operate regimes a company must clear.",
    "STARTUP": "Startup depth. How many strong companies the market forms, measured from hmm's pipeline.",
    "EXIT": "Exit route. How readily companies exit, by IPO venue and trade sale. Measured from hmm's pipeline.",
    "TRADE": "Global trade. How naturally the market's companies reach global demand: go-to-market, exports, redomicile."
  };

  function buildSVG(market) {
    var svg = el("svg", { class: "radar-svg", viewBox: "0 0 " + VB_W + " " + VB_H, role: "img" });
    svg.appendChild(el("title", {})).textContent = market.name + " necessity radar";

    // no hexagon frame or spokes: the constellation of dots carries the shape

    // axis labels (text ink, uppercase, letter-spaced)
    for (var a = 0; a < 6; a++) {
      var lx = px(a, LBL_R), ly = py(a, LBL_R);
      var dy = ly < CY - 4 ? 0 : (ly > CY + 4 ? 8 : 3);
      var lab = el("text", {
        "class": "axis-lbl", "data-axis": AXES[a], tabindex: "0",
        x: lx.toFixed(1), y: (ly + dy).toFixed(1),
        "text-anchor": anchorFor(lx),
        "font-size": "9", "letter-spacing": ".14em",
        fill: "var(--hmm-text-muted,rgba(242,236,201,.6))"
      });
      lab.textContent = AXES[a];
      svg.appendChild(lab);
    }

    // necessity polygons, dots, and direct labels
    SERIES.forEach(function (name) {
      var scores = market.series[name];
      var hue = HUES[name];
      var g = el("g", { class: "series series--" + name.toLowerCase() });
      g.setAttribute("data-series", name);

      // invisible fill: no visible wash by default, but the focus state can raise it on legend hover
      g.appendChild(el("path", {
        class: "radar-fill",
        d: scorePath(scores),
        fill: hue, "fill-opacity": "0", stroke: "none"
      }));
      // invisible edge, kept in the DOM only so the morph flock can sample the shape; the dots carry it visually
      g.appendChild(el("path", {
        class: "radar-line",
        d: scorePath(scores),
        fill: "none", stroke: hue, "stroke-width": "1", "stroke-opacity": "0",
        "stroke-linejoin": "round"
      }));

      // content is a dense constellation of breathing dots filling the necessity shape (no border traced)
      var avg = (scores[0] + scores[1] + scores[2] + scores[3] + scores[4] + scores[5]) / 60; // 0..1
      var FILL = Math.round(52 + avg * 96);              // scale count with shape size so density reads even
      for (var q = 0; q < FILL; q++) {
        var seg = Math.random() * 6, si = seg | 0, fr = seg - si;
        var ri = (scores[si] / 10) * R, rj = (scores[(si + 1) % 6] / 10) * R;
        var bnd = ri + (rj - ri) * fr;                    // polygon boundary radius at this angle (approx)
        var th = angle(si) + fr * (Math.PI / 3);
        var rr2 = bnd * Math.sqrt(Math.random()) * 0.96;  // sqrt for area-uniform fill, 0.96 keeps inside the edge
        var big = Math.random() < 0.22;
        g.appendChild(el("circle", {
          class: "radar-dot" + (big ? " radar-dot--lg" : ""),
          cx: (CX + Math.cos(th) * rr2).toFixed(2), cy: (CY + Math.sin(th) * rr2).toFixed(2),
          r: big ? "1.9" : "1.2", fill: hue,
          style: "animation-delay:" + (q * 0.06).toFixed(2) + "s"
        }));
      }

      // vertex dots: the peaks, larger, with a surface-coloured ring so overlaps stay legible
      for (var vv = 0; vv < 6; vv++) {
        var rr = (scores[vv] / 10) * R;
        g.appendChild(el("circle", {
          class: "vtx",
          cx: px(vv, rr).toFixed(2), cy: py(vv, rr).toFixed(2),
          r: "1.9",
          fill: hue,
          stroke: "var(--rad-surface,#141414)", "stroke-width": "1.2",
          style: "animation-delay:" + (vv * 0.16).toFixed(2) + "s"
        }));
      }


      svg.appendChild(g);
    });

    return svg;
  }

  // click-to-explode: clicking a panel scatters its dots outward from the click point,
  // then a spring pulls each back to its home position. Same dot idiom as the rest of the site.
  function attachExplode(svg) {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var nodes = svg.querySelectorAll(".radar-dot, .vtx");
    var dots = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var hx = parseFloat(n.getAttribute("cx")), hy = parseFloat(n.getAttribute("cy"));
      dots.push({ n: n, hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0 });
    }
    if (!dots.length) return;
    var running = false;
    function loop() {
      var active = false;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.vx = (d.vx + (d.hx - d.x) * 0.10) * 0.86;   // spring home + damping
        d.vy = (d.vy + (d.hy - d.y) * 0.10) * 0.86;
        d.x += d.vx; d.y += d.vy;
        d.n.setAttribute("cx", d.x.toFixed(2));
        d.n.setAttribute("cy", d.y.toFixed(2));
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.05 || Math.abs(d.hx - d.x) + Math.abs(d.hy - d.y) > 0.3) active = true;
      }
      if (active) { requestAnimationFrame(loop); }
      else {
        for (var j = 0; j < dots.length; j++) {
          var e = dots[j]; e.n.setAttribute("cx", e.hx.toFixed(2)); e.n.setAttribute("cy", e.hy.toFixed(2));
          e.x = e.hx; e.y = e.hy; e.vx = 0; e.vy = 0;
        }
        running = false;
      }
    }
    svg.style.cursor = "pointer";
    svg.addEventListener("click", function (ev) {
      var loc;
      try { var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; loc = pt.matrixTransform(svg.getScreenCTM().inverse()); }
      catch (err) { loc = { x: CX, y: CY }; }
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var dx = d.x - loc.x, dy = d.y - loc.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = 130 / (dist + 9);                 // closer dots pushed harder
        d.vx += (dx / dist) * force * (0.6 + Math.random() * 0.8) + (Math.random() - 0.5) * 6;
        d.vy += (dy / dist) * force * (0.6 + Math.random() * 0.8) + (Math.random() - 0.5) * 6;
      }
      if (!running) { running = true; requestAnimationFrame(loop); }
    });
  }

  function buildPanel(market) {
    var panel = document.createElement("div");
    panel.className = "radar-panel";

    ["tl", "tr", "bl", "br"].forEach(function (p) { panel.appendChild(cornerTick(p)); });

    var title = document.createElement("h3");
    title.className = "radar-title radar-title--click";
    title.textContent = market.name;
    title.setAttribute("data-market", market.name);
    title.setAttribute("tabindex", "0");
    title.setAttribute("role", "button");
    title.setAttribute("aria-label", "Read about " + market.name);
    panel.appendChild(title);

    var sub = document.createElement("p");
    sub.className = "radar-sub";
    sub.textContent = market.sub;
    panel.appendChild(sub);

    var svg = buildSVG(market);
    panel.appendChild(svg);
    attachExplode(svg);

    // legend chips (identity never rests on colour alone)
    var legend = document.createElement("ul");
    legend.className = "radar-legend";
    SERIES.forEach(function (name) {
      var li = document.createElement("li");
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "radar-chip";
      chip.setAttribute("data-series", name);
      chip.setAttribute("aria-label", "Highlight " + name + " on " + market.name);
      var sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = HUES[name];
      chip.appendChild(sw);
      chip.appendChild(document.createTextNode(name));
      li.appendChild(chip);
      legend.appendChild(li);

      function raise() {
        panel.setAttribute("data-focus", name);
        SERIES.forEach(function (s2) {
          var grp = svg.querySelector('.series[data-series="' + s2 + '"]');
          if (grp) grp.classList.toggle("is-active", s2 === name);
        });
      }
      function restore() {
        panel.removeAttribute("data-focus");
        var groups = svg.querySelectorAll(".series");
        for (var i = 0; i < groups.length; i++) groups[i].classList.remove("is-active");
      }
      chip.addEventListener("mouseenter", raise);
      chip.addEventListener("mouseleave", restore);
      chip.addEventListener("focus", raise);
      chip.addEventListener("blur", restore);
    });
    panel.appendChild(legend);

    return panel;
  }

  function render() {
    var root = document.getElementById("radars");
    if (!root) return;

    var style = document.createElement("style");
    style.textContent = css();
    root.appendChild(style);

    var wrap = document.createElement("div");
    wrap.className = "radar-wrap";
    MARKETS.forEach(function (m) { wrap.appendChild(buildPanel(m)); });
    root.appendChild(wrap);

    // click a market name to open its prose
    var drill = document.createElement("div");
    drill.className = "radar-drill"; drill.setAttribute("aria-live", "polite");
    root.appendChild(drill);
    var open = null;
    function closeDrill() { open = null; drill.classList.remove("on"); root.querySelectorAll(".radar-title--click").forEach(function (t) { t.classList.remove("is-open"); }); }
    function openDrill(name) {
      if (open === name) { closeDrill(); return; }
      open = name;
      drill.style.setProperty("--c", COUNTRY_ACCENT[name] || "#C44539");
      drill.innerHTML = "";
      var card = document.createElement("div"); card.className = "radar-drill-card";
      var hd = document.createElement("div"); hd.className = "radar-drill-hd";
      var nm = document.createElement("span"); nm.className = "radar-drill-name"; nm.textContent = name;
      var x = document.createElement("button"); x.className = "radar-drill-x"; x.setAttribute("aria-label", "Close"); x.textContent = "✕";
      x.addEventListener("click", closeDrill);
      hd.appendChild(nm); hd.appendChild(x);
      var p = document.createElement("p"); p.textContent = COUNTRY_PROSE[name] || "";
      card.appendChild(hd); card.appendChild(p);
      drill.appendChild(card);
      drill.classList.add("on");
      root.querySelectorAll(".radar-title--click").forEach(function (t) { t.classList.toggle("is-open", t.getAttribute("data-market") === name); });
    }
    // click the dimmed backdrop (outside the card) to close
    drill.addEventListener("click", function (e) { if (e.target === drill) closeDrill(); });
    // Escape closes the overlay
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) closeDrill(); });
    root.addEventListener("click", function (e) { var t = e.target && e.target.closest ? e.target.closest(".radar-title--click") : null; if (t) openDrill(t.getAttribute("data-market")); });
    root.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("radar-title--click")) { e.preventDefault(); openDrill(e.target.getAttribute("data-market")); } });

    // axis-definition popups (hover or keyboard-focus an axis label)
    var tip = document.createElement("div");
    tip.className = "radar-tip"; tip.setAttribute("role", "tooltip"); tip.setAttribute("aria-hidden", "true");
    root.appendChild(tip);
    function showTip(node) {
      var name = node.getAttribute("data-axis"), def = AXIS_DEFS[name];
      if (!def) return;
      tip.textContent = def; tip.classList.add("on"); tip.setAttribute("aria-hidden", "false");
      var r = node.getBoundingClientRect(), tr = tip.getBoundingClientRect();
      var x = r.left + r.width / 2 - tr.width / 2;
      x = Math.max(10, Math.min(window.innerWidth - tr.width - 10, x));
      var y = r.top - tr.height - 8; if (y < 10) y = r.bottom + 8;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    }
    function hideTip() { tip.classList.remove("on"); tip.setAttribute("aria-hidden", "true"); }
    function axisFrom(e) { var t = e.target; return (t && t.closest) ? t.closest(".axis-lbl") : null; }
    root.addEventListener("mouseover", function (e) { var a = axisFrom(e); if (a) showTip(a); });
    root.addEventListener("mouseout", function (e) { if (axisFrom(e)) hideTip(); });
    root.addEventListener("focusin", function (e) { var a = axisFrom(e); if (a) showTip(a); });
    root.addEventListener("focusout", function (e) { if (axisFrom(e)) hideTip(); });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    render();
  } else {
    window.addEventListener("load", render);
  }
})();
