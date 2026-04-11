# Vision Alignment Audit

Date: 2026-04-08
Project: F1 Modeling Lab
Auditor: Codex / gpt-5.4

## 1. Executive Summary

The project is directionally strong, but current planning still serves the next milestone better than it serves the full vision in `.planning/VISION.md:11-17` and `.planning/VISION.md:35-45`. The biggest mistake in the current Phase 4 research is treating a visualization package choice as if it resolves the broader product-surface problem; it does not. `visx` is a defensible near-term rendering layer for Phase 4, but it is not yet a comfortable long-term foundation for a React 19 engineering platform unless it is wrapped behind internal primitives, because the current stable line still does not declare React 19 support and the repo still lacks a transport-neutral simulation boundary, real-time delivery model, and first-class educational content architecture. In short: the current plan can ship a credible Phase 4, but it does not yet fully serve the long-term vision of a serious engineering-and-education platform without additional architectural work.

## 2. Visualization Library Assessment

### Bottom line

`visx` is a reasonable Phase 4 implementation choice, but it is too strong to call it “the visualization foundation” for the long-term vision without qualification.

### What the research got right

The current visualization layer is already showing strain. The repo has only 9 visual source files, but they contain 2,736 lines of TSX/TS (`wc -l packages/visuals/src/**/*.tsx packages/visuals/src/**/*.ts`) and 43 raw SVG matches (`grep -rn 'svg\|SVG\|<rect\|<line\|<path\|<circle' packages/visuals/src/ --include='*.tsx' | wc -l`). Representative components are manually doing their own scale math, axes, hover logic, and SVG rendering:

- `packages/visuals/src/traces/SpeedProfileTrace.tsx:156-225` computes scales, segments, ticks, and hover hit-testing itself.
- `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:138-218` computes cumulative waterfall layout and axes itself.
- `packages/visuals/src/workspace/TrackMap.tsx:124-216` computes bounds, aspect-fit scaling, sector markers, and color mapping itself.

That is acceptable for Phase 2/3. It is not a good place to enter linked strategy timelines, branch comparison, shared cursors, or observer overlays. On this point, the research is correct: the hand-rolled SVG approach is nearing a local maximum.

### Where the research overreaches

The research states that the gating question is resolved and recommends `visx` as the foundation (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:49-51`, `:78-85`, `:91-96`). That is too confident for two reasons.

First, the React 19 situation is materially riskier than the research presents. This repo is on React `19.2.4` (`npm ls react 2>/dev/null | head -5`). As of 2026-04-08, live package metadata shows:

- `npm view @visx/xychart version peerDependencies --json` => stable latest is `3.12.0`, with peer deps `react: ^16.8.0 || ^17.0.0 || ^18.0.0`.
- `npm view @visx/xychart@3.13.2-alpha.0 peerDependencies --json` => React 19 support exists only on alpha builds.
- `npm view @visx/xychart time --json` => stable `3.12.0` was published 2024-11-07; the React-19-compatible `3.13.x` line is still alpha.

That makes the research note “stable release is expected imminently” (`04-RESEARCH.md:93-96`) stale or at least unjustified. By April 2026, React 19 is not the experimental party here; `visx` stable support is what is lagging. For a core platform surface expected to evolve for 6+ months, adopting an alpha-only compatibility path is acceptable only if the dependency is heavily encapsulated.

Second, the long-term vision in `.planning/VISION.md:39-45` is not just “render custom SVG in React.” It explicitly includes live-updating strategy views, linked multi-panel exploration, branch comparison, observer overlays, educational annotations, and production-density panels. `visx` can support much of the near-term SVG composition and interaction work. It does not, by itself, answer the harder long-term questions of rendering density, shared state architecture, live transport, or annotation semantics.

### Performance judgment

For the Phase 4 density described today, `visx` is performant enough. The vision calls for 50-70 lap traces and 6+ strategies (`.planning/VISION.md:39-43`), and the Phase 4 context calls for linked views, shared cursors, and time-axis brushing (`04-CONTEXT.md:41-43`, `:117-123`). That is still modest data volume. The bottleneck is not raw rendering throughput yet; it is interaction architecture and maintainability.

Where I would push back is on the phrase “eventually support real-time strategy visualization in actual engineering workflows.” For that horizon, `visx` alone is not the full answer. When the platform reaches live telemetry-style overlays, denser imported data, or continuously updating traces in Phase 6+, at least some panels may want a canvas/WebGL or `uPlot`-style dense timeseries path. The research dismissed canvas too quickly (`04-RESEARCH.md:81-85`). The correct long-term answer is likely hybrid: visx/SVG for semantic charts and annotations, denser renderer for high-frequency timeseries.

### Alternatives the research missed or underweighted

The research compared `visx` mostly against raw d3, Observable Plot, Recharts, and canvas generically (`04-RESEARCH.md:78-85`). That is too shallow. The more serious alternatives are:

- A hybrid abstraction: internal chart primitives with `visx` as the initial SVG implementation, leaving room for a dense timeseries backend later.
- A split stack: `visx` for semantic panels and `uPlot`/canvas for live telemetry-like traces.
- Raw d3 math under internal primitives, if maximum control over custom strategy views becomes more important than React-native ergonomics.

I would not recommend Recharts or Observable Plot here. I would recommend not elevating `visx` itself to architectural law.

### Recommendation

Adopt `visx` only as an implementation detail behind internal primitives in `packages/visuals`, not as the product foundation. The foundation should be:

1. a typed visual artifact contract,
2. a shared interaction model,
3. a renderer-agnostic chart primitive layer,
4. and a migration path to hybrid rendering for denser live data.

## 3. Architecture Alignment

### What is aligned

The repo has some healthy structural seams already:

- Shared domain contracts exist in `packages/domain/`.
- Shared simulation logic exists in `packages/sim-core/`.
- Shared visuals exist in `packages/visuals/`.
- The web app and API app are physically separated in the monorepo (`package.json:8-17`).

That is enough to support continued local-first development and makes future extraction possible.

### What is not aligned with the full vision

The current runtime boundary is still local-adapter-centric, not compute-backend-centric.

The vision explicitly wants local, remote SSH, and cloud compute modes (`.planning/VISION.md:58-69`). The current local API is still built around local filesystem roots and direct in-process execution:

- `apps/local-api/src/app.ts:33-51` resolves `workspaceRoot`, `presetsRoot`, `scenariosDir`, and `runsDir` directly from local paths.
- `apps/local-api/src/services/runService.ts:677-807` loads scenarios, presets, circuits, and then executes the sim in-process.
- `apps/local-api/src/services/runService.ts:886-917` builds the run record and persists it directly to local JSON files.

That is a useful local adapter. It is not yet a clean “simulation API.” It conflates compute orchestration, preset resolution, persistence, and transport in one service.

The web client is similarly coupled to a local request/response workflow:

- `apps/web/src/features/workspace/api.ts:79-97` is a thin `fetch()` wrapper against `/api/*`.
- `apps/web/src/app/useWorkspace.ts:59-67` bootstraps by fetching presets, circuits, scenarios, and runs in one local workspace pass.
- `apps/web/src/app/useWorkspace.ts:169-265` creates runs synchronously and refreshes collections after completion.

There is no notion of async simulation jobs, streaming progress, partial artifacts, cancellation, or subscription-driven updates. That is the real architectural gap relative to the vision’s “real-time strategy analysis” question in `.planning/VISION.md:84-87`.

### Clean separation between simulation API and UI client

Today, that separation is only partial.

There is a nominal harness abstraction in `packages/sim-core/src/contracts.ts:123-126`, but it is too weak for the future vision. `SimulationHarness.run()` is synchronous and returns a completed summary immediately. It has no async lifecycle, progress channel, artifact stream, or remote execution semantics. Worse, the local API mostly bypasses that abstraction and assembles run records itself in `runService.ts`.

The persistent run contract is also still too generic in ways that will matter later:

- `packages/domain/src/runs/schema.ts:72-77` stores `summaryMetrics` as `z.record(z.string(), z.unknown())` and artifacts as generic `data: z.unknown()`.

That flexibility helped early phases move quickly. It is not where I would want to be before remote execution, live updates, or richer cross-phase overlays become first-class.

### Multi-regulation readiness

The vision is explicit that the preset system must be architected for multi-regulation support from the start (`.planning/VISION.md:47-57`). The current project definition agrees (`.planning/PROJECT.md:83-86`). But the implementation is still under-typed and partly 2026-shaped:

- `packages/domain/src/presets/schema.ts:12-22` keeps `values` as `z.record(z.string(), z.unknown())`.
- `apps/local-api/src/services/runService.ts:763-783` casts regulation values to a generic record and reaches into an assumed `aero` structure.

That means the current architecture preserves storage flexibility, but not semantic clarity. It will slow down or destabilize multi-era support because “regulation” is not yet a typed family of behaviors; it is an untyped blob interpreted ad hoc by the local run service.

### Recommendation

The stack is good enough for Phase 4 local-first work, but not yet aligned with the full vision. Before Phase 6, the project should introduce:

- a transport-neutral simulation service contract,
- an async job model,
- typed artifact/event schemas,
- and typed regulation families with versioned decoding.

## 4. Educational Gap Analysis

This is the biggest vision gap after compute architecture.

The vision is explicit that the platform should teach F1 engineering through structured lessons, tutorials, progressive disclosure, and role-based learning paths (`.planning/VISION.md:13-15`, `.planning/VISION.md:21-33`). The current roadmap and requirements only partially reflect that.

What exists:

- `EDU-01`, `EDU-02`, and `EDU-03` require subsystem explanations, controller-intent explanations, and engineer-role learning paths (`.planning/REQUIREMENTS.md:99-106`).
- Phase 4 success criteria require engineer-role views and subsystem-level inspection (`.planning/ROADMAP.md:115-123`).
- Phase 4 plans include “Explanation views, engineer-role learning paths, and stint-delta analysis” (`.planning/ROADMAP.md:129-133`).

What is missing:

- no lesson or tutorial content model,
- no authored progression framework,
- no mechanism for guided exercises or checkpoints,
- no distinction between “view with role filter” and “actual pedagogical sequence,”
- no roadmap item that treats educational content as first-class product work rather than a UI property.

The project is still largely planning “learning views,” not “learning content.” That does not satisfy the long-term vision in `.planning/VISION.md:13-17` and `.planning/VISION.md:21-25`.

### How the educational layer should relate to engineering visualization

The vision says these are not separate products (`.planning/VISION.md:33`). That is correct. The right relationship is:

- one engineering artifact layer,
- one visualization primitive layer,
- one annotation/guidance layer that can be toggled or sequenced.

In other words, educational visualizations should not be a separate chart stack. They should be the same strategy and subsystem views with added scaffolding: annotations, prompts, provenance cues, assumption callouts, staged reveals, and role-guided questions. But that still requires a first-class content architecture. Right now there is no sign of one.

### Recommendation

Add an explicit educational-content slice no later than Phase 4.x or 5, with:

- a lesson/tutorial schema,
- role-specific guided flows,
- annotation anchors into real artifacts,
- and a rule that educational surfaces compose over the same underlying engineering views.

## 5. Visualization-Model Co-evolution

### Principle: correct

The project is right to insist that visualizations develop alongside model complexity rather than ahead of it (`.planning/VISION.md:73-76`, `.planning/PROJECT.md:88-89`). The current artifacts and run history system support that principle reasonably well.

### Current migration strategy: only conditionally sound

The research recommends building new Phase 4 views in `visx` and keeping old views as-is initially (`04-RESEARCH.md:122-126`, `:284-285`). That is sound only as a short-lived bridge. If it becomes the normal operating mode, it will create real drag.

Risks of running hand-rolled SVG and `visx` simultaneously:

- duplicated scale and axis logic,
- duplicated hover and selection behavior,
- inconsistent linked-view semantics,
- styling divergence,
- more fragile migration of existing panels into shared cursors or brushing later,
- and more cognitive overhead for future contributors.

Those risks are amplified because the current “legacy” components are not trivial. `SpeedProfileTrace.tsx`, `SoCTrace.tsx`, `SensitivityWaterfall.tsx`, and `TrackMap.tsx` are each 300-400 lines (`wc -l ...`). This is not a tiny tail of legacy code.

### What actually works

The co-evolution plan works if Phase 4 treats `packages/visuals` as the place where the abstraction changes, not just the library choice.

That means:

1. Freeze legacy SVG components except for bug fixes.
2. Build new Phase 4 strategy panels only on shared primitives.
3. Migrate only the old panels that must participate in shared interactions.
4. Do not let Phase 4 create a permanent “old traces vs new traces” split.

### Recommendation

The real migration milestone is not “use visx for new charts.” It is “establish shared primitives for scales, linked state, tooltip semantics, annotations, and artifact mapping.” If that does not happen, the project will just have two rendering approaches instead of one better architecture.

## 6. Compute Architecture

### Current readiness

The vision wants flexible compute backends (`.planning/VISION.md:58-69`). The current codebase is only partially ready.

The good news:

- `packages/sim-core/` is already a reusable package boundary.
- `apps/local-api/` is at least conceptually an adapter around it.
- The local API host toggle for remote access exists as a project decision (`.planning/PROJECT.md:94`) and `apps/local-api/src/server.ts:1-18` supports binding to `0.0.0.0`.

The bad news:

- There is no backend-agnostic execution contract.
- There is no remote job queue or worker interface.
- There is no artifact streaming or live update protocol.
- There is no separation between compute orchestration and local persistence.
- The UI is hard-wired to the local HTTP shape in `apps/web/src/features/workspace/api.ts:99-182`.

### What needs to change for remote/cloud backends

Architecturally, the project needs to split today’s `runService` into at least three concerns:

- simulation request compilation,
- simulation execution,
- run/artifact persistence.

Then it needs a real job contract, something like:

- `SimulationJobRequest`
- `SimulationJobStatus`
- `SimulationArtifactEnvelope`
- `subscribeToJob(jobId)` via SSE/WebSocket
- `cancelJob(jobId)`

Without that, the project can still be “remote accessed,” but it is not actually backend-flexible in the sense the vision describes.

### Is Fastify local-api a help or hindrance?

Both.

It is a help because it already establishes an app boundary and HTTP surface. It is a hindrance because the current implementation is not really an API facade over a backend service; it is the backend service, local file adapter, and artifact writer all at once (`apps/local-api/src/app.ts:54-68`, `apps/local-api/src/services/runService.ts:672-919`).

The right move is not to replace Fastify. It is to demote `apps/local-api` into a local adapter over a backend-neutral service layer.

## 7. Previous Audit Comparison

The 2026-04-07 audit’s finding #9 was that the visualization stack was approaching a local maximum (`.planning/audits/audit-response-2026-04-07.md:25`, `:48-56`; `.planning/audits/strategic-gap-audit-2026-04-07.md:14-17`, `:163-186`).

### What has improved

The Phase 4 research did respond directly to that finding:

- it evaluated alternatives,
- it recommended a library,
- it proposed a migration path,
- and it explicitly framed linked views, brushing, and shared cursors as first-class needs (`04-CONTEXT.md:16-17`, `:41-43`, `:117-123`; `04-RESEARCH.md:49-51`, `:148-176`).

That is real progress.

### What remains unresolved

The deeper issue from the previous audit was not just “pick a library.” It was “design a scalable interaction and visualization architecture.” That is still unresolved.

Three major gaps remain:

1. The research overstates the maturity of the `visx` + React 19 path.
2. The repo still has no internal primitive layer that would let `visx` remain replaceable.
3. The visualization audit intersects with two older gaps that still matter: validation is still sequenced late (`strategic-gap-audit-2026-04-07.md:9-18`, `:31-50`), and the educational surface is still under-specified relative to the platform vision.

So the delta from 2026-04-07 is: the team has answered the library question more concretely, but has not yet fully answered the architectural question behind it.

## 8. Findings Table

| # | Finding | Severity | Evidence | Recommendation |
|---|---------|----------|----------|----------------|
| 1 | `visx` is a defensible Phase 4 renderer, but not yet a safe long-term foundation to standardize on directly. | High | `04-RESEARCH.md:49-51`, `:91-96`; `npm ls react`; `npm view @visx/xychart version peerDependencies --json`; `npm view @visx/xychart@3.13.2-alpha.0 peerDependencies --json` | Adopt `visx` only behind internal visual primitives; do not couple domain/UI architecture directly to `@visx/*` APIs. |
| 2 | The React 19 risk is understated: stable `visx` still does not declare React 19 support, so the research’s “stable imminent” note is not solid planning input. | High | `04-RESEARCH.md:91-96`; live npm metadata on 2026-04-08 shows stable `3.12.0` with React 16-18 peers only, React 19 only on alpha `3.13.x`. | Treat React 19 support as an explicit adoption risk. Either wait for stable support or isolate `visx` behind a narrow adapter layer. |
| 3 | The current architecture lacks a transport-neutral simulation boundary and real-time job model. | Critical | `.planning/VISION.md:62-69`, `:84-87`; `apps/web/src/features/workspace/api.ts:79-182`; `apps/web/src/app/useWorkspace.ts:59-67`, `:169-265`; `packages/sim-core/src/contracts.ts:123-126` | Introduce async simulation job contracts, progress/streaming semantics, and a backend-neutral client/service layer before Phase 6. |
| 4 | `apps/local-api` currently mixes compute orchestration, preset/circuit loading, and persistence, which will hinder remote/cloud execution. | High | `apps/local-api/src/app.ts:33-51`, `:54-68`; `apps/local-api/src/services/runService.ts:672-919` | Split run compilation, execution, and persistence into separate layers; keep Fastify as an adapter, not the whole backend. |
| 5 | Multi-regulation support is still architecturally underprepared because preset values remain untyped and are interpreted through ad hoc casts. | High | `.planning/VISION.md:47-57`; `packages/domain/src/presets/schema.ts:12-22`; `apps/local-api/src/services/runService.ts:763-783` | Create typed regulation family schemas and versioned adapters before multiple eras are added. |
| 6 | The educational vision is only partially represented in the roadmap; “learning views” exist, but structured lessons/tutorials do not. | High | `.planning/VISION.md:13-15`, `:21-25`; `.planning/ROADMAP.md:111-133`; `.planning/REQUIREMENTS.md:99-106` | Add a first-class educational content layer with lesson/tutorial contracts and annotation anchors over real engineering artifacts. |
| 7 | Running hand-rolled SVG and `visx` in parallel is a temporary bridge, not a stable migration strategy. | Medium | `04-RESEARCH.md:122-126`, `:284-285`; `packages/visuals/src/traces/SpeedProfileTrace.tsx:156-225`; `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:138-218`; `packages/visuals/src/workspace/TrackMap.tsx:124-216` | Freeze old panels except for fixes, build all new Phase 4 strategy surfaces on shared primitives, and migrate only reused panels into the linked-interaction system. |
| 8 | The current visualization package has very little testing despite becoming increasingly load-bearing. | Medium | `cat packages/visuals/package.json`; `npm test 2>&1 | tail -15` => visuals package reports “No test files found”; visuals currently contain 2,736 LOC. | Add focused visual/unit tests around shared primitives and artifact-to-view transformations as the new visualization layer is introduced. |
| 9 | Validation and calibration are still too late relative to the project’s claim of educational honesty. | High | `.planning/audits/strategic-gap-audit-2026-04-07.md:9-18`, `:31-50`; `.planning/ROADMAP.md:176-207` | Pull a lightweight validation/data slice earlier, or make Phase 4/5 explicitly provisional with strong honesty constraints in the UI. |
| 10 | The current web app structure is still Phase 2/3 sized and will strain under Phase 4 role-specific surfaces. | Medium | `find apps/web/src -type f | sort`; `apps/web/src/features/runs/RunSummaryPanel.tsx:1-17`; `apps/web/src/app/useWorkspace.ts:41-57` | Split Phase 4 UI into dedicated feature modules for strategy comparison, role views, and session modes instead of continuing to centralize in `RunSummaryPanel`. |

## 9. Overall Assessment

The current planning is good enough to build a strong Phase 4, but not yet good enough to claim strong alignment with the broader long-term vision. The repo is still optimized for a local-first single-user modeling workbench with static request/response runs, not for a serious real-time engineering platform with flexible compute backends and first-class educational scaffolding.

If the team makes one framing correction now, it should be this: `visx` is not the architecture. It is a near-term rendering choice inside a broader architecture that still needs typed regulation models, a real simulation service boundary, a streaming/job model, and a first-class educational content layer. If those pieces are added, the roadmap can genuinely serve the vision. If not, the project risks shipping an impressive Phase 4 while still missing the platform-level shape described in `.planning/VISION.md`.
