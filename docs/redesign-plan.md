# hmm Ventures — Subpage Redesign Plan

From-scratch design plan for every page except the home page, which stays as built.
Charts and components are reconceived, not reused. The IM chart grammar remains the
aesthetic north star; the existing implementations (ChartFrame, IMFigure, DataSection,
the chart components) are reference only and get rebuilt.

---

## 0. North star and guardrails

The site sells the thesis, not the fund. Four tests every page passes:

1. Sell the thesis, not returns. No DPI or IRR anywhere in the argument.
2. Create desire. The LP finishes a page thinking "I want in," not "noted."
3. Show it is unmistakably differentiated.
4. Never read as AI-generated.

The site is one argument: regulation is deterministically rebuilding the five
Necessities across four developed APAC markets, hmm mapped it first and has the
receipts. Every page carries exactly one load-bearing claim. Anything on a page
that does not make that claim land harder is decoration and gets cut.

Brand canon holds: lowercase hmm, zero em-dashes (prose and code comments),
Necessities-first framing, every figure lifted from the IM / sim canon.

---

## 1. The system — shared language every subpage inherits

### 1.1 Organising concept: The Record, indexed by Necessity

The site is one bound evidence record, read or jumped within, whose table of
contents is the five Necessities. Continuous exhibit numbering runs across the
whole site. The design recedes; the evidence is the hero.

### 1.2 Composition

- Centred, composed mastheads with real whitespace (the getriven "centring" move).
- Body alternates full-bleed evergreen argument bands with pearl exhibit plates.
- One column of attention. Max content widths, generous vertical rhythm.
- Asymmetry only where it earns its keep (the four-markets and exits matrices).

### 1.3 Type roles (strict)

- Instrument Serif: the one argument per beat. Headlines only. Never paragraphs.
- IBM Plex Mono: every folio, eyebrow, label, datum, status chip, source line.
- DM Sans: the rare prose paragraph (the human-stakes "need" copy).
- Banned: centred display-serif paragraphs (the primary AI tell).

### 1.4 Colour

- Evergreen field, pearl exhibit plates, mahogany ink on pearl.
- Tomato is the single "look here" per view. Used once, never decoratively.
- Necessity channel tones only where the five must be told apart:
  eat ochre #B8863A, heal tomato #C44539, move teal #7FB8A8,
  power coral #D48C6A, supply sage #5A7A6E.
- Charts authored against the dark page inherit pearl-surface equivalents inside a
  plate (the on-light token remap), so any exhibit reads on paper.

### 1.5 Chrome

- Folio running-head on every page: `The Record · ex-N / total`, mono, top-right.
- Left Contents rail = the five sections, mono, active lit with a tomato folio
  number. This is the navigation; there is no conventional navbar on subpages.
- Breadcrumb as record locator: `§01 The five Necessities → Eat`.
- Footer colophon: dataset provenance, confidential line, "continue the record"
  link to the next movement.

### 1.6 The exhibit (rebuilt)

One plate component, the IM `.fig` grammar rebuilt from scratch:
mahogany double-rule, sci-corner registration brackets, mono eyebrow with the
tomato `EX-N` fignum and a descriptive label, optional serif argument title with
an italic-tomato key term, optional metric strip, the chart, a Source / Basis grid.
Title is optional (pure-illustration exhibits sit under a prose argument).
No expand / zoom affordance. Mobile keeps horizontal scroll for wide charts.

### 1.7 Beat counters and live-state chips (used for proof, not theatre)

- Beat counters thread the sequence: `01 / 04`, `02 / 04` on the section eyebrows.
- Live-state chips render regulatory or exit state as operational readout:
  `before parliament`, `expected 2027`, `● none in force`, `named outcome`,
  `monitoring`. A chip must report a real fact. No animation for its own sake.

### 1.8 Fauna canon (locked)

One flower per market, one component (the rebuilt JurisdictionMark), paths from
`/public/fauna/*.svg`. Never a hand-drawn glyph.

- AU golden wattle · JP chrysanthemum (16 petals, 22.5°) · NZ koru · SG vanda.

### 1.9 Motion

Restrained and archival. Plates reveal on scroll entry. No animating instruments,
no counters ticking for effect. Motion earns its place only when it clarifies
(a stage transition on the home funnel, which is unchanged).

### 1.10 Anti-AI discipline

Real named companies, exact counts, dated regulations. Document-grade asymmetry
where it earns it. The craft a template cannot fake (hand-numbered exhibits,
sci-corners, fauna, Instrument Serif arguments) is the line that keeps the site
from reading as a dashboard.

---

## 2. Information architecture (post-merge page map)

The exit story is broadened and `The four markets` folds into it.

| Section | Pages | Change |
|---|---|---|
| Home | `/` | Unchanged. Keeps funnel, hero, CTAs. |
| 01 The five Necessities | `/necessities/`, `/necessities/{slug}` ×5 | Rebuilt. |
| 02 The exits | `/exits/` (was `/research/results/` + `/markets/`) | Merged + rebuilt. |
| 03 The data | `/data/necessity-index/`, `/data/calendar/`, `/data/scoreboard/` (+ detail) | Rebuilt. |
| 04 The method | `/research/`, `/research/{slug}`, `/references/`, `/references/exits/` | Rebuilt, reframed as the source apparatus. |
| 05 The GP | `/about/` | Rebuilt. |
| — | `/contact/`, `/contact/thanks/`, `/404` | Rebuilt, light. |
| Appendix | `/thesis/{market}` ×4 | Demoted to optional per-market deep reads linked from The exits. Low priority. |

`The four markets` as a standalone page is removed. Its geography becomes the
market axis of The exits. Its regulatory-window content already lives on the home
funnel and each necessity page.

The Contents rail shows five sections: Necessities, Exits, Data, Method, GP.

Note: the home page is kept as-is, with one sanctioned exception already applied —
the funnel terminus now reads "Acquired, listed, or scaled." / "From four markets
to global exits." (the IM three-pathway framing: strategic acquirers, public
markets, late-stage investors), replacing the single-path "bought by global
strategics." This keeps the home consistent with The exits. If the new global
folio + Contents rail is adopted, the home inherits the chrome only; its hero and
funnel otherwise do not change.

---

## 3. Page-by-page plan

Each page: its one job, the beat sequence, the exhibits (redesigned), and what it
must not do.

### 3.1 The five Necessities — `/necessities/`

- Job: scope and human stakes. "Not one bet. Five domains society cannot let fail,
  all being rebuilt at once."
- Sequence: masthead argument (`The systems society cannot allow to fail.`) →
  the five as a single composed index, each a row: mark, name, in-thesis count,
  one-line claim, channel tone → a single line on why now (AI moving into them).
- Exhibit: none heavy. The five-row index IS the exhibit; counts are the proof.
- Must not: become five marketing cards. It is a contents page for the domains.

### 3.2 Necessity detail (template, ×5) — `/necessities/{slug}`

- Job: proof at depth. Answer the skeptic: "is the thesis real and specific here?"
- Sequence (the fixed spine, beat-counted):
  - Masthead: mark watermark, `01 / 05 · Eat`, serif `Food Security Systems`,
    claim. Centred.
  - `01 / 04 The need`: human stakes. DM Sans prose (the contaminated-batch story),
    Tier 1 / Tier 2 examples in mono soft. No chart.
  - `02 / 04 The filter`: the deterministic mechanism. Plate `EX-1`:
    a dated regulation table (market, regulation, tier, status) plus the
    expected-effective-dates window. Live-state chips: `before parliament`,
    `expected 2027`, `● none in force`. The dated table is what lands the proof.
  - `03 / 04 The cohort`: the real population. Plate `EX-2`: unit grid, one mark per
    company, named outcomes highlighted. Count is the proof.
  - `04 / 04 The four markets`: named outcomes per market, each with its canonical
    flower and a live-state chip. Active markets tomato, watchlist dim and honest.
  - Footer: `continue the record → 02 Heal`.
- Must not: animate the proof. A dated table and a named outcome land it; a pulsing
  marker does not.

### 3.3 The exits — `/exits/` (merged: receipts + four markets)

- Job: prove liquidity is broad and proven. Many buyers, many paths, multiple
  markets, already happening. The optionality argument LPs underwrite.
- Truth from the dataset: 5 named exits across 3 paths — 1 strategic acquisition,
  2 public listings, 2 institutional late-stage rounds — across 3 of 4 markets
  (AU 3, JP 1, NZ 1, SG watchlist), 4 necessities, disclosed $345M to $2B.
- Sequence:
  - Masthead argument: the breadth claim. Multiple proven paths to liquidity.
    Not "acquirers are buying" (that is 1 of 5 and undersells).
  - `EX-1` the exit matrix: the core exhibit. Rows = exit path (strategic M&A,
    public listing, institutional late-stage). Columns = market (AU, JP, NZ, SG).
    Cells carry named deals with counterparty and disclosed value. SG empty and
    honest (watchlist). This single matrix carries both the optionality and the
    geography (the four-markets fold-in).
  - `EX-2` the pattern, quantitative: round-size uplift by stage and observed exit
    incidence vs the unregulated cohort. The statistical receipt behind the named one.
  - Forward line: coverage uneven, more as 2026-28 cohorts mature. Ties to the
    scoreboard. Honest, not hyped.
  - Optional: per-market deep reads link out to `/thesis/{market}`.
- Must not: quote fund returns. Every figure here is a third-party named deal or a
  market statistic.

### 3.4 The data — `/data/...`

- Job: credibility through honesty. "They show their work and bet on falsifiable
  predictions. This is not hype."
- `/data/necessity-index/`: the company universe. 19,416 four-market companies
  against the T1 / T2 Necessities, cross-referenced to the regulations. The index
  IS the instrument. One plate, the universe broken down, plus a method link.
- `/data/calendar/`: the crystallisation window. 34 in-flight regulations, dated
  2024-2030, peak 2027, none yet in force. One plate: the window by year with the
  honest "none in force" state. The list below, grouped by year, filterable.
- `/data/scoreboard/`: the standout. Five Structural Certainties as five falsifiable
  predictions on the dataset, each stated as a testable claim with its current
  status. This is the strongest anti-AI, pro-credibility page. Each prediction is a
  card: the claim, what would falsify it, current reading.
- Must not: present the data as marketing. It is the lab notebook, shown openly.

### 3.5 The method / references — `/research/`, `/references/`

- Job: back every number. The source apparatus of the record.
- `/research/`: the classifier method, the T1 / T2 screen, how the cohort is built.
  Plain, rigorous, mono-forward.
- `/references/`, `/references/exits/`: the bibliography. Every cited source and
  dataset behind every figure on the site.
- Must not: oversell. This is the appendix that makes the rest checkable.

### 3.6 The GP — `/about/`

- Job: convert thesis-conviction into person-conviction. "I would back this person."
- Sequence: masthead (`Wahid Tashkandi`, Founding GP) → the posture (the cross-border
  insight, one serif lead then body) → the three operating seats as a record of the
  decade pointed at the Necessities (Paddle, Skalata, GoodFit), each a dated leaf
  with the concrete proof point → the classifier built over four years.
- Must not: read as a CV. It is the credentials leaf of the record, evidence-led.

### 3.7 Contact and minor — `/contact/`, `/contact/thanks/`, `/404`

- Job: the door. Peer, low-key, no hard sell.
- One line, the mailto, the confidential posture. Thanks and 404 inherit the chrome.

---

## 4. The exhibit catalogue (charts, from scratch)

Each chart is designed to land one proof. Forms, not the old components.

| Exhibit | Page | Form | Proof it lands |
|---|---|---|---|
| The cut (funnel) | Home | Unchanged | The deterministic narrowing |
| Dated regulation table | Necessity | Table: market, reg, tier, status | The mechanism is real and dated |
| Crystallisation window | Necessity, Calendar | Bars by year, peak marked, none-in-force state | Timing, inevitability |
| Cohort unit grid | Necessity | One mark per company, outcomes highlighted | A real population |
| Four-market outcomes | Necessity | Four flower cells, live-state chips | Outcomes already happening |
| The exit matrix | Exits | Path × market grid, named cells | Broad, proven liquidity |
| Premium / incidence | Exits | Round-size uplift by stage; incidence multiple | The pattern pays |
| The universe breakdown | Index | Composition of 19,416 vs T1/T2 | The dataset is real and large |
| Falsifiable predictions | Scoreboard | Five claim cards with status | Intellectual honesty |

Every plate carries the IM grammar: sci-corners, mono eyebrow, tomato fignum,
Source / Basis. No expand button.

---

## 5. Build sequence (phases)

- Phase 0 — Foundation. Rebuild tokens as needed, the Record chrome (folio,
  Contents rail, breadcrumb locator), the rebuilt Plate/exhibit component, the
  rebuilt fauna component, the beat-counter and status-chip primitives.
- Phase 1 — Necessity detail (the exemplar, proof at depth). Build the template,
  verify against the four tests, then roll all five.
- Phase 2 — The exits (the merge). The exit matrix is the centrepiece.
- Phase 3 — The five Necessities index, The data (index, calendar, scoreboard),
  The GP, The method, Contact.
- Phase 4 — Integration. Wire the global chrome, retire `/markets/`, redirect to
  `/exits/`. Run wahid-voice, ai-tells-audit (verdict CLEAN), fauna-consistency,
  and safety-officer. Build and verify every route. Nothing committed until you say.

Home is untouched throughout except for inheriting the global chrome if adopted.
