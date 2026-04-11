# Visualization at Scale

## Metadata

- Date: 2026-04-10
- Mode: Terrain mapping
- Confidence: Medium

## Executive Summary

The repo's current visualization layer is a hand-rolled SVG surface with no visualization dependencies in `@f1-modeling/visuals`, 2,736 LOC across nine TSX files, 33 raw SVG hits, and a hardcoded three-zone workspace shell. That is enough evidence to treat "which charting library?" as too narrow: the load-bearing question is what renderer and interaction boundary can support both dense engineering views and educational overlays without locking the product into SVG-only assumptions. Current package state keeps `@visx/xychart` in an unstable position for this repo because stable `3.12.0` still peers against React 18 and the React 19 path remains alpha-only, while low-level visx packages remain a different, less coupled proposition. The option space is best understood as renderer families plus interaction/annotation contracts, not as a single winner-take-all package comparison.

## Question as Received

The Phase 4 research recommended visx as the visualization foundation, but the audits pushed back on four points: React 19 compatibility via `@visx/xychart` and `@react-spring/web`, SVG rendering ceiling for dense race views, lack of a Canvas/WebGL escape hatch, and lack of an explicit performance budget. The task was to map the option space around rendering strategies, alternative libraries, hybrid approaches, and performance-budget methodology for F1-specific visualization demands such as multi-strategy race timelines, linked brushing across 4+ panels, branch divergence, annotation anchors, progressive disclosure, and eventual live updates.

## Reframing

The more accurate question is not "which chart library should Phase 4 adopt?" but "what user-surface substrate keeps renderer choice, linked interaction, and educational overlays decoupled enough to evolve with model density?"

Why this reframing is better:

- The repo already has multiple bespoke charts and a workbench shell, so the immediate problem is migration boundary design, not greenfield library selection.
- The educational research lane imposes annotation, guided-tour, and provenance requirements that materially shape visualization primitives.
- The audit findings explicitly argue against treating visx as architecture instead of implementation detail.
- Live updates depend on streaming cadence and artifact boundaries, so renderer choice alone cannot close the question.

## Assumptions Surfaced

- Load-bearing: a single visualization library should serve every phase from Phase 4 strategy timelines through later telemetry, observer, and control views.
- Load-bearing: the decisive issue is chart component choice rather than renderer boundary, interaction model, and annotation semantics.
- Load-bearing: SVG can be evaluated in the abstract instead of against explicit view budgets such as 6 strategies x 4 linked panels x per-lap state.
- The current hand-rolled SVG components are disposable implementation detail rather than evidence about the shape of the product's primitive layer.
- Educational overlays can be added later without constraining renderer architecture now.
- "Visualization at scale" means only point-count scaling, not simultaneous scaling across event density, interaction latency, update cadence, and panel count.

## Option Space

### Option A: Continue the hand-rolled SVG path

What it is:

- Keep extending current custom SVG components such as `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, and `TrackMap`.
- Add linked cursor, brush, and annotation behavior incrementally inside repo-owned components.

Relevant repo evidence:

- `SpeedProfileTrace` computes scales, segments, ticks, and hover math manually in one component (`packages/visuals/src/traces/SpeedProfileTrace.tsx:127`).
- `SoCTrace` repeats the same frame, scale, axis, and hover pattern (`packages/visuals/src/traces/SoCTrace.tsx:116`).
- `SensitivityWaterfall` repeats chart frame and scale logic again (`packages/visuals/src/inspectors/SensitivityWaterfall.tsx:114`).
- `TrackMap` separately implements aspect-ratio fitting, segment coloring, and marker logic (`packages/visuals/src/workspace/TrackMap.tsx:103`).

Trade-space:

- Known: maximal control over semantics and no external compatibility risk.
- Likely: fastest path for one or two more isolated SVG charts.
- Likely: highest long-term duplication cost because interaction state, scale semantics, theming, and accessibility remain copy-pasted across components.
- Plausible: acceptable for low-density static panels, but weakest at keeping an escape hatch open.

### Option B: React-native primitive layer over low-level visx packages

What it is:

- Use low-level visx packages such as `@visx/shape`, `@visx/scale`, `@visx/axis`, `@visx/brush`, and `@visx/tooltip` behind repo-owned primitives.
- Treat visx as implementation detail, not architecture.
- Explicitly avoid or quarantine `@visx/xychart` until package state stabilizes for React 19.

Current package state:

- Verified on 2026-04-10: `@visx/xychart` stable is `3.12.0` with peer deps `react ^16.8 || ^17 || ^18` and `@react-spring/web ^9.4.5`.
- Verified on 2026-04-10: `@visx/xychart@3.13.2-alpha.0` adds React 19 peer range but still pulls the same `@react-spring/web ^9.4.5` peer.
- Verified on 2026-04-10: `@visx/xychart@4.0.1-alpha.0` moves to `@react-spring/web ^9.7.5 || ^10.0.0`, but remains alpha-only.
- Verified on 2026-04-10: repo root is on `react ^19.2.4` and `react-dom ^19.2.4`, while `@f1-modeling/visuals` currently has no visualization dependencies at all (`package.json:18`, `packages/visuals/package.json:1`).

Trade-space:

- Known: aligns with the audit direction to narrow visx commitment to low-level packages.
- Likely: strong fit for semantic SVG overlays, custom timelines, brush behavior, axes, and annotation affordances.
- Likely: still bounded by SVG/DOM density unless paired with a separate dense-series renderer path.
- Plausible: good migration target for current Phase 2/3 visual seams because the repo already thinks in custom chart components rather than prebuilt dashboards.

### Option C: Canvas-first time-series engine

Representative libraries:

- uPlot
- TradingView Lightweight Charts

What it is:

- Adopt a Canvas-focused engine for dense time-series and linked traces.
- Reserve DOM or SVG only for semantic overlays, axes, annotation callouts, and controls.

Trade-space:

- Known: strongest raw point-density and live-stream performance in this option space.
- Known: best suited to lap-by-lap traces, dense overlays, and shared cursor interactions.
- Likely: weaker fit for highly bespoke F1 timelines unless the timeline is treated as a separate overlay layer.
- Likely: authoring/annotation ergonomics are worse if the product expects every lesson to attach directly to rendered marks.

### Option D: Dual-renderer engine with explicit SVG/Canvas choice

Representative libraries:

- Apache ECharts
- internal adapter layer modeled on ECharts-style renderer choice

What it is:

- Use a charting system that can switch between SVG and Canvas per chart or per view family.
- Standardize chart-data, interaction, and annotation contracts so the renderer becomes a parameter.

Trade-space:

- Known: keeps the escape hatch explicit rather than aspirational.
- Likely: stronger for heterogeneous panel sets than SVG-only or Canvas-only stacks.
- Likely: costs more upfront abstraction work and creates pressure to normalize features across renderers.
- Plausible: can be either a third-party engine choice or an internal architecture pattern using separate render implementations.

### Option E: GPU/layer engine for dense spatial or event-cloud views

Representative libraries:

- deck.gl
- Plotly WebGL traces

What it is:

- Use WebGL or WebGPU-backed rendering for panels where density or spatial layering breaks Canvas or SVG assumptions.
- Most compelling for future telemetry alignment, dense branch comparison, and large event sets rather than current Phase 4 timelines alone.

Trade-space:

- Known: strongest headroom for large data sets and advanced picking/highlighting.
- Known: introduces browser context constraints and heavier conceptual overhead than SVG or Canvas.
- Likely: overpowered for most Phase 4 educational surfaces unless the view becomes truly dense or spatial.
- Plausible: better as a second renderer family than as the first default.

### Option F: High-level all-in-one chart platforms

Representative libraries:

- Plotly.js
- Nivo
- Observable Plot

What it is:

- Use prebuilt chart grammars or component suites to accelerate common chart types.
- Lean on existing interaction, legends, and theming rather than building primitives first.

Trade-space:

- Known: highest initial productivity for common charts.
- Likely: weakest fit for the repo's custom timeline, branch-divergence, provenance, and annotation needs unless heavily wrapped.
- Likely: difficult to keep educational overlays and engineering semantics first-class because the library owns too much of the mark and interaction model.
- Plausible: useful as a narrow adjunct for one chart family, but not sufficient as the conceptual center of the product surface.

### F1-specific demand map

These demands cut across every option and are where the option space meaningfully separates:

- Multi-strategy race timelines: event-rich, Gantt-like, and annotation-heavy.
- Linked brushing across 4+ panels: requires shared interaction state independent of chart family.
- Branch divergence visualization: needs lineage-aware marks and branch anchors, not only numeric traces.
- Annotation anchors for educational overlays: requires stable mark identity and artifact-relative coordinates.
- Progressive disclosure: demands renderer-independent reveal/hide semantics rather than one fixed chart layout.
- Eventual live updates: turns update cadence and partial rerender cost into first-class architecture concerns.

### Performance budget methodology

The audits are correct that "SVG vs Canvas vs WebGL" is underdetermined without a budget. A production-relevant budget for this repo likely needs at least:

- Visible strategies per view set.
- Simultaneously linked panels.
- Max marks or in-view points per panel family.
- Hover-to-tooltip latency.
- Brush-to-linked-panel update latency.
- Steady-state live-update cadence.
- Initial render time after receiving typed artifacts.
- Memory ceiling for long sessions or branch comparisons.
- Degradation policy when a panel exceeds budget: aggregate, decimate, switch renderer, or reduce update frequency.

This is an inference from the cited platform docs plus the repo's stated Phase 4/4.1/6 vision, not a closed recommendation.

## Trajectory Analysis

### Option A: Hand-rolled SVG continuation

- 1-year trajectory: can probably deliver a few more custom panels quickly, especially if density stays modest.
- 3-year trajectory: likely accumulates duplicated scale, interaction, and annotation logic across strategy, observer, and telemetry views.
- 5-year trajectory: weak fit for the platform vision if live updates and dense comparison become normal.
- Doors opened: bespoke semantics, tight control, no third-party dependency surprises.
- Doors closed: easy renderer substitution, shared interaction substrate, and low-cost educational overlays at scale.

### Option B: Low-level visx primitive layer

- 1-year trajectory: plausible bridge from today's hand-rolled SVG to a coherent primitive layer with better reuse.
- 3-year trajectory: stays healthy if paired with a renderer-independent interaction/annotation contract; weakens if mistaken for the whole architecture.
- 5-year trajectory: viable as the semantic/SVG implementation even if dense panels move to Canvas or GPU.
- Doors opened: consistent scales, axes, brush, tooltip, and annotation semantics across current and upcoming views.
- Doors closed: if overcommitted, can trap the product in SVG-first thinking.

### Option C: Canvas-first dense-series engine

- 1-year trajectory: strong if Phase 4 centers dense timeline traces and synchronized cursors.
- 3-year trajectory: remains strong for live time-series and telemetry overlays.
- 5-year trajectory: still useful, but educational overlay complexity may force a separate semantic layer above it.
- Doors opened: explicit dense/live path, lower redraw cost, better headroom for telemetry-like views.
- Doors closed: direct DOM-level mark semantics and some accessibility/annotation ease.

### Option D: Dual-renderer engine or internal adapter pattern

- 1-year trajectory: more setup cost, but most aligned with the audit insistence on an escape hatch.
- 3-year trajectory: likely the most resilient if the product truly spans simple lessons and dense engineering views.
- 5-year trajectory: keeps renderer migration local if model density or live usage changes.
- Doors opened: per-view renderer choice, graceful scaling, cleaner migration from SVG to Canvas/GPU where needed.
- Doors closed: some short-term velocity; feature parity across renderers becomes ongoing work.

### Option E: GPU/layer engine

- 1-year trajectory: probably adjacent rather than central for Phase 4.
- 3-year trajectory: becomes more relevant for telemetry alignment, dense spatial overlays, or many simultaneous event layers.
- 5-year trajectory: strong headroom if the platform becomes truly engineering-grade and data-rich.
- Doors opened: large-data performance, high-density picking, spatial layering.
- Doors closed: simplicity, low setup cost, and easy semantic authoring for educational overlays.

### Option F: High-level all-in-one platforms

- 1-year trajectory: can accelerate one chart family but creates tension with custom engineering semantics.
- 3-year trajectory: wrapper complexity rises as the repo asks for branch lineage, provenance, and lesson anchoring.
- 5-year trajectory: often becomes either a narrow adjunct or a constraint.
- Doors opened: fast initial delivery for commodity charts.
- Doors closed: architecture honesty if the platform's real needs outgrow the library's grammar.

## Precedent Analysis

### Current repo precedent: bespoke SVG everywhere

- `packages/visuals` is 2,736 LOC with zero visualization dependencies and zero tests declared beyond `vitest run --passWithNoTests` (`packages/visuals/package.json:12`).
- `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, and `TrackMap` each independently implement chart math and rendering rather than sharing primitives.
- `App.tsx` still hardcodes a three-zone tuple, which supports the audit concern that the current shell cannot naturally host Phase 4 view growth (`apps/web/src/app/App.tsx:185`).

Outcome:

- Known success: the repo has already proven that custom visuals can preserve model honesty.
- Known failure mode: duplication and fixed layout have already appeared before Phase 4 begins.

### uPlot

- GitHub README describes uPlot as a small, fast, Canvas 2D-based time-series chart with strong zoom/cursor behavior, streaming support, and explicit non-goals such as no built-in animation and no stacked series.
- It publishes concrete performance claims and comparative benchmark tables rather than only ergonomic claims.

Outcome:

- Likely precedent for dense traces and shared-cursor engineering views.
- Likely poor precedent for narrative annotation-heavy educational overlays unless paired with another semantic layer.

### Apache ECharts

- Official handbook explicitly exposes both Canvas and SVG renderers and frames renderer choice as a function of hardware, data volume, and functional requirements.
- The docs name an experience value of greater than roughly 1k elements as a case where Canvas is generally recommended, while also noting SVG memory advantages and virtual-DOM improvements.

Outcome:

- Strong precedent for making renderer choice an architectural parameter instead of a one-time ideological decision.

### Plotly.js

- Official docs distinguish SVG and WebGL traces and warn that browsers typically allow only about 8 to 16 WebGL contexts per page, with practical page limits closer to 4 to 8 Plotly WebGL figures.

Outcome:

- Strong precedent that GPU escape hatches are real but come with page-level budgeting constraints.

### deck.gl

- Official docs position deck.gl as high-performance WebGPU/WebGL2 visualization for large data sets using composable layers and built-in picking/highlighting.

Outcome:

- Strong precedent for future dense spatial views and event clouds.
- Weak precedent for the bulk of current Phase 4 chart needs, which are more timeline and annotation centric than geospatial-layer centric.

### OpenF1 and live-data cadence

- OpenF1 docs expose interval updates around every 4 seconds and weather updates every minute, which is a useful adjacent precedent for eventual live strategy surfaces.

Outcome:

- Renderer decisions should not be isolated from update cadence and streaming architecture, because "live" here is periodic typed artifact refresh, not necessarily every-frame animation.

## Gray Areas Encountered

### [FOLLOW-AND-MARK] Streaming cadence entered the visualization question

Why it is load-bearing:

- The task asked for eventual live-updating views.
- Update cadence determines whether SVG rerendering, Canvas redraw, or GPU persistence matters in practice.

What I did:

- I followed this branch far enough to incorporate live-update budgeting and OpenF1 cadence as part of the performance methodology.

What remains:

- Transport and job-stream protocol belong more fully to R4 and D1.

### [REVISIT-LATER] Exact SVG -> Canvas -> WebGL crossover points for this repo

Why it matters:

- External docs provide heuristics and benchmark claims, but this repo's true threshold depends on its own artifact shapes, browser targets, and panel composition.

Why it cannot close here:

- The repo does not yet have Phase 4 artifacts or a benchmark harness for 6 strategies x 4 linked panels with annotations and brushing.

Future round needed:

- A focused benchmark/prototyping round that measures worst-plausible Phase 4 and 4.1 panels against explicit latency budgets.

### [DEFER] 3D/spatial telemetry canvases as a primary Phase 4 concern

Why deferred:

- deck.gl and similar tools are relevant to long-horizon trajectory and telemetry overlays, but they are not load-bearing for the immediate strategy timeline and educational-overlay question.

Recommended pickup:

- Revisit during telemetry alignment or trajectory/control visualization research.

## Scope Expansion Notes

**Scope expansion encountered.**
Original framing: visualization libraries, renderers, and performance at scale.
Expansion observed: interaction and annotation contracts needed to be discussed explicitly.
Response: follow-and-mark.
Justification: educational overlays and linked brushing are impossible to reason about if renderer choice is discussed without stable mark identity and shared interaction state.

**Scope expansion encountered.**
Original framing: rendering strategies.
Expansion observed: live-update cadence and streaming behavior entered the analysis.
Response: follow-and-mark.
Justification: eventual live-updating views are in the task itself, so omitting cadence and partial-update cost would make the renderer analysis incomplete.

## Path of Inquiry

- Entry point: re-evaluate the earlier visx recommendation against audit objections and the repo's real state.
- Branches considered: package compatibility, renderer families, dense/live precedents, repo migration seams, performance-budget methodology, and educational overlay coupling.
- Branches pursued: package metadata, repo chart implementations, dual-renderer precedents, dense-series precedents, GPU escape-hatch precedents, and live-data cadence.
- Branches abandoned: deep comparison of every React chart library with similar SVG semantics, because the architecture question quickly dominated commodity feature comparisons.
- Unexpected branches: OpenF1 cadence and annotation-anchor semantics both surfaced as more central than generic "charting library" feature lists.
- Dead ends: attempts to treat Nivo, Plotly, and Observable Plot as direct substitutes for the whole product surface were not analytically productive because each collapsed under the repo's custom semantics.
- Reframings: the effective question shifted from library selection to substrate design; the educational coupling made that shift unavoidable.

## Dependencies and Relations

Questions this depends on:

- R1/D1 compute backend strategy, loosely for long-horizon live density and strongly for artifact/stream boundaries.
- R4 streaming architectures, strongly for live updates and partial artifact refresh.

Questions this affects:

- R3 educational content architectures, strongly; annotation anchors and progressive disclosure depend on visualization primitives.
- Future visualization deliberation, strongly; this research is the terrain map for that closure attempt.
- Phase 4 planning, strongly; especially panel management, primitive layer design, and migration strategy.
- Phase 4.1 and Phase 6, loosely to strongly depending on observer and telemetry density.

Adjacent questions:

- Multi-regulation typing, loosely; regulation comparisons affect view combinatorics but not renderer family directly.
- Validation/calibration surfacing, loosely; confidence overlays and provenance notes affect semantic layer design.

Coupling strength:

- Tight with educational architecture.
- Tight with streaming/job cadence.
- Medium with compute language/runtime questions.
- Loose-to-medium with regulation typing.

Cross-reference:

- See `03-educational-content-architectures.md` for the inverse demand map from lesson structure back onto visualization primitives.

## Provisional Position

Likely: the durable move is to define a renderer-agnostic surface made of typed artifacts, shared interaction state, and stable annotation anchors, then allow multiple renderer families under that surface.

Known: `@visx/xychart` itself is not a stable foundation for this repo today because stable is still React 18-peered and the React 19 path is alpha-only. Known: low-level visx packages are a different category and remain plausible as the SVG implementation behind internal primitives.

Likely: the repo should avoid closing on "SVG forever" or "Canvas first everywhere." The option space currently supports a split architecture better than a winner-take-all decision: semantic SVG/DOM overlays and custom timelines on one side, dense-series or future GPU renderers on the other, both sharing interaction and annotation contracts.

Confidence on this provisional position is Medium. The missing piece is not more package marketing material; it is an internal benchmark harness tied to explicit budgets.

## Confidence Ledger

1. Known: the repo currently has 2,736 LOC under `packages/visuals/src`, no visualization dependencies in `@f1-modeling/visuals`, and 33 raw SVG hits.
2. Known: stable `@visx/xychart` still peers against React 18, while the React 19 peer range exists only on alpha releases.
3. Likely: the current repo's main scaling problem is duplicated primitive and interaction logic before it is raw point count alone.
4. Likely: low-level visx is better understood here as an SVG implementation detail than as architecture.
5. Likely: Canvas-first libraries are strongest for dense live traces but weaker for lesson-anchor semantics unless wrapped by a higher-level substrate.
6. Known: ECharts, Plotly, and deck.gl all make renderer constraints explicit rather than pretending one renderer fits every case.
7. Plausible: a dual-renderer or adapter pattern is the cleanest long-horizon fit for the vision, but that still requires internal benchmarking before closure.

## Unresolved Questions

- What exact worst-plausible Phase 4 view should define the first performance budget?
- What typed interaction model should be canonical: shared cursor, brush window, selected branch, pinned annotation, focused lesson step?
- Should timeline/event panels and dense numeric traces share one renderer family or deliberately diverge?
- What accessibility and export requirements need DOM-visible semantics even when dense series move to Canvas?
- How much of the current hand-rolled SVG code is worth migrating versus freezing?

## References

- Repo root package versions, including React 19.2.4: `package.json:18`
- Visual package has no visualization dependencies: `packages/visuals/package.json:1`
- Hardcoded three-zone shell in current app: `apps/web/src/app/App.tsx:185`
- Current workspace state and run-selection model: `apps/web/src/app/useWorkspace.ts:41`
- Hand-rolled speed trace: `packages/visuals/src/traces/SpeedProfileTrace.tsx:127`
- Hand-rolled SoC trace: `packages/visuals/src/traces/SoCTrace.tsx:116`
- Hand-rolled waterfall: `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:114`
- Hand-rolled track map: `packages/visuals/src/workspace/TrackMap.tsx:103`
- Audit finding summary and visx narrowing: `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md:28`
- Vision requirements for dense, linked, educational, live visualization: `.planning/VISION.md:35`
- Relevant requirements VISU-03, VISU-04, VISU-05, EDU-01, EDU-03: `.planning/REQUIREMENTS.md:21`, `.planning/REQUIREMENTS.md:101`
- `@visx/xychart` package metadata, verified via `npm view` on 2026-04-10: https://www.npmjs.com/package/@visx/xychart
- `@react-spring/web` package metadata, verified via `npm view` on 2026-04-10: https://www.npmjs.com/package/@react-spring/web
- uPlot README and benchmark table: https://github.com/leeoniya/uPlot
- Apache ECharts canvas-vs-SVG handbook: https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/
- deck.gl introduction: https://deck.gl/docs
- Plotly.js WebGL vs SVG guidance: https://plotly.com/javascript/webgl-vs-svg/
- TradingView Lightweight Charts docs: https://tradingview.github.io/lightweight-charts/
- OpenF1 API docs: https://openf1.org/docs/
