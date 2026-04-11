# Vision Alignment Audit

**Date:** 2026-04-08
**Reviewer:** Codex / GPT-5.4
**Scope:** Vision alignment of current architecture, roadmap, and the Phase 4 visualization recommendation

## 1. Executive Summary

The project is well-positioned to build a strong **local-first strategy analysis workbench**, but it is not yet fully aligned with the broader vision of a **serious engineering platform**. The current Phase 4 research treats `visx` as if it resolves the long-horizon visualization problem, when in reality it only resolves the near-term SVG interaction problem and does so with a real React 19 version risk. The monorepo shape is good, and Phase 3.1 created the right race-state and artifact foundation, but the current architecture still lacks a transport-neutral simulation boundary, a job/streaming model, and a first-class educational content layer. If those gaps are addressed now, Phase 4 can serve the vision; if not, the project risks building an impressive local dashboard that still falls short of the platform described in `.planning/VISION.md:11-17`, `.planning/VISION.md:37-45`, and `.planning/VISION.md:62-69`.

## 2. Visualization Assessment

### Verdict

`visx` is a defensible **Phase 4 tactical choice**, but it is not the right thing to anoint as the **platform visualization foundation** without qualification.

### What the codebase says now

The current visuals package is still entirely hand-rolled SVG. `packages/visuals/package.json:1-17` has no visualization dependencies at all, and the representative components all implement their own scales, geometry transforms, hover logic, and SVG primitives directly:

- `packages/visuals/src/traces/SoCTrace.tsx:145-255`
- `packages/visuals/src/inspectors/SensitivityWaterfall.tsx:138-320`
- `packages/visuals/src/workspace/TrackMap.tsx:124-252`

The shell checks confirm the state of the package:

- `find packages/visuals/src -name '*.tsx' -o -name '*.ts' | head -20` returned 10 current source files
- `grep -rn 'svg\|SVG\|<rect\|<line\|<path\|<circle' packages/visuals/src/ --include='*.tsx' | wc -l` returned `43`
- `wc -l packages/visuals/src/**/*.tsx packages/visuals/src/**/*.ts` returned `2736 total`

That is actually good news: the migration surface is still small enough to change direction deliberately.

### Where the visx recommendation is right

The research correctly identifies that Phase 4 needs linked views, shared cursors, brushing, and better chart composition than hand-rolled SVG can comfortably support (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:16`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:41-42`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:45-51`). For the specific Phase 4 scope, `visx` can handle:

- multi-strategy timelines
- waterfall attribution views
- linked lap/time traces
- annotated SVG-based explanation surfaces

For 50-70 lap traces and 2-6 strategies in a static or lightly interactive view, `visx` is likely sufficient.

### Where the research overreaches

The vision is not asking only for Phase 4 charts. It asks for:

- live-updating strategy views during simulation (`.planning/VISION.md:40`)
- linked brushing across panels (`.planning/VISION.md:40`)
- production-density strategy comparison with branch divergence and event markers (`.planning/VISION.md:42`)
- eventual real-time telemetry alignment (`.planning/VISION.md:39`)

The research resolves the question at the level of "replace hand-rolled SVG with visx" (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:49-51`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:517-529`). That is too narrow. `visx` is still SVG-first. SVG is excellent for semantic, annotated, inspectable views. It is weaker as the sole answer for:

- annotation-heavy multi-panel dashboards with synchronized hover/brush state
- branch-rich race timelines with overlays and educational callouts
- eventual live-updating engineering views
- future imported telemetry overlays if update frequency or point density climbs

The immediate point count is not the problem. A 70-lap race trace is small. The real problem is **interactive density**: 6 strategies x 4 panels x annotations x branch overlays x live hover/brush synchronization. That is exactly where a pure-SVG worldview starts to become the wrong architectural commitment.

### React 19 risk is real

This repo is on React 19.2.4 (`package.json:18-36`; `npm ls react` also reported `react@19.2.4`). The research correctly notes that stable `@visx/xychart` does **not** support React 19 in peer deps (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:91-95`), but it dismisses the issue too casually by recommending alpha packages or `--legacy-peer-deps` (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:95`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:303-307`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:536`).

The shell checks make this concrete:

- `npm view @visx/xychart version peerDependencies --json` returned stable `3.12.0` with `react: "^16.8.0 || ^17.0.0 || ^18.0.0"`
- `npm view @visx/xychart@3.13.2-alpha.0 peerDependencies --json` returned React `^19.0.0-0`

For a project expected to keep evolving for 6+ months, depending on an alpha line or peer-dep bypass is acceptable only if `visx` is treated as a **replaceable tactical dependency**, not as a foundational platform bet.

### Alternatives the research dismissed too quickly

The alternatives table in the research is too shallow (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:78-84`). It compares `visx` mostly to ordinary charting choices, not to rendering strategies. The missing alternative is not "use Recharts." The missing alternative is:

- use `visx` or d3-scale for semantic inspector views
- keep an explicit path to Canvas/WebGL for dense or live panels
- define renderer-agnostic chart contracts now

That hybrid approach is more aligned with the vision than a visx-only worldview. If I were planning this phase, I would not reject `visx`; I would reject the claim that `visx` is the final architectural answer.

### Recommendation

Adopt `visx` only as a **Phase 4 SVG interaction toolkit**. Pair that with two guardrails:

1. Define a renderer boundary now: chart data model, scales, interaction state, and annotations should not depend on `visx` types.
2. Benchmark one "worst plausible" view early: 6 strategy timelines, 4 linked panels, event markers, branch markers, shared brushing, and tooltip sync.

If that benchmark is comfortable, proceed. If not, the project already has a defined escape hatch.

## 3. Architecture Alignment

### What is aligned

The monorepo shape is good. `package.json:8-16` cleanly separates `apps/*` and `packages/*`. The project already has meaningful package seams:

- domain contracts and schemas
- a simulation core
- reusable visuals
- browser and local API apps

That is the correct overall direction for a platform that wants to grow.

Phase 3.1 also added the right conceptual foundation: race plans, lineage, typed race artifacts, and race simulation outputs (`.planning/ROADMAP.md:92-109`). That is a real asset for Phase 4.

### Where the boundary is still wrong

The clean separation between "simulation API" and "UI client" does **not** exist yet in the way the vision asks for (`.planning/VISION.md:87`).

The browser client is a thin fetch wrapper that assumes synchronous request/response JSON endpoints returning full records:

- `apps/web/src/features/workspace/api.ts:79-182`

The workspace state layer then orchestrates a save, a run creation, and a full reload cycle:

- `apps/web/src/app/useWorkspace.ts:59-68`
- `apps/web/src/app/useWorkspace.ts:112-121`
- `apps/web/src/app/useWorkspace.ts:169-214`

On the server side, the route layer directly dispatches to local service functions:

- `apps/local-api/src/routes/runs.ts:48-79`

And the run service owns all of the following at once:

- scenario file loading (`apps/local-api/src/services/runService.ts:151-163`)
- preset resolution (`apps/local-api/src/services/runService.ts:173-181`, `.ts:687-695`)
- circuit loading from disk (`apps/local-api/src/services/runService.ts:697-705`)
- regulation/weather value extraction via loose casts (`apps/local-api/src/services/runService.ts:514-527`, `.ts:758-768`)
- direct in-process simulation execution (`apps/local-api/src/services/runService.ts:559`, `.ts:806`)
- artifact persistence to local disk (`apps/local-api/src/services/runService.ts:645`, `.ts:917`)

That is not a compute abstraction. That is a local adapter doing everything.

### Vite + React + Fastify

For the current local-first workbench, this stack is fine. For the vision's real-time question, it is not enough by itself. `.planning/VISION.md:85` explicitly asks whether the current stack needs WebSocket/streaming architecture. The current app is entirely request/response:

- Fastify route registration only: `apps/local-api/src/app.ts:54-68`
- no job system
- no push channel
- no progress model
- no cancellation
- no partial artifact delivery

This means the current architecture serves:

- local synchronous runs
- persisted historical analysis

It does **not** yet serve:

- remote/cloud execution
- live strategy updates
- temporal streaming surfaces
- multi-run batch progress

### Flexible backends

The vision is explicit about local, remote SSH, and cloud compute modes (`.planning/VISION.md:62-69`). The current codebase is only partially ready.

What is ready:

- the browser does not call sim-core directly
- the API is already a separate process boundary
- repo-local paths are centralized in `LocalApiPaths` (`apps/local-api/src/app.ts:20-25`)

What is not ready:

- there is no `SimulationBackend` abstraction
- there is no async job contract
- there is no artifact streaming or subscription protocol
- there is no backend-agnostic client API

The current local API is therefore both a **help** and a **hindrance**:

- Help: it is the right first adapter and keeps browser code honest
- Hindrance: it currently bakes local persistence and in-process execution into the same boundary

## 4. Educational Gap Analysis

The educational dimension is under-architected relative to the vision.

The vision explicitly promises:

- structured lessons and tutorials (`.planning/VISION.md:14`, `.planning/VISION.md:22`)
- role-based learning paths (`.planning/VISION.md:24`)
- educational scaffolding as a first-class concern (`.planning/VISION.md:33`, `.planning/VISION.md:84`)

But the current requirements only define:

- subsystem explanations (`.planning/REQUIREMENTS.md:101-102`)
- controller-intent explanations (`.planning/REQUIREMENTS.md:103-104`)
- role-specific learning paths in the abstract (`.planning/REQUIREMENTS.md:105-106`)

And the roadmap assigns those to visualization-focused plans:

- Phase 4 explanation views and engineer-role learning paths (`.planning/ROADMAP.md:111-149`)
- Phase 5 controller explanations (`.planning/ROADMAP.md:151-171`)

The Phase 4 research narrows this further by treating role views as filtered projections over shared data (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:38-42`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:51`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:282`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:525`).

That is a UI answer, not a content answer.

### What is missing

There is no evidence of:

- a lesson/tutorial schema
- a content directory or authoring model
- prerequisite sequencing between concepts
- a way to attach guided questions to artifacts or chart states
- a distinction between "inspect the data" and "learn the concept"

### What should happen

Interactive educational content should sit **on top of** the engineering visualization layer, not inside it and not outside it.

The right relationship is:

1. The simulation produces canonical artifacts.
2. The visualization layer renders those artifacts faithfully.
3. The education layer attaches guided prompts, annotations, checkpoints, and role-specific narratives to the same artifacts.

That implies at least a small content architecture now, not in a distant phase:

- `LessonUnit`
- `LearningOverlay`
- `GuidedQuestion`
- artifact references
- prerequisite tags / role tags

Without that, the best Phase 4 can deliver is a good analytical UI with better labeling. That does not satisfy the full educational vision.

## 5. Visualization-Model Co-evolution

The high-level principle is right: visualizations should grow with model complexity (`.planning/VISION.md:39`, `.planning/VISION.md:73-74`; `.planning/PROJECT.md:20`, `.planning/PROJECT.md:88`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:16`, `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:181-185`).

The migration strategy, however, is only half-sound.

The research proposes:

- build new Phase 4 views in visx
- wrap existing Phase 1-3 SVG views
- migrate incrementally later

See:

- `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:122-127`
- `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:284`
- `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:327-331`

That is acceptable as a short bridge. It is dangerous as a medium-term steady state.

### Risks of running both approaches

- duplicated interaction systems
- inconsistent scale math and hover behavior
- inconsistent annotations and accessibility semantics
- hard-to-debug shared-cursor behavior between legacy and new views
- permanent "temporary" wrappers

There is also a safety issue: `packages/visuals/package.json:12-15` defines no visual test harness beyond `vitest run --passWithNoTests`, and the root `npm test` tail ended with the visuals workspace reporting `No test files found`. That means the migration has very little protection against rendering regressions.

### Recommendation

Treat mixed rendering as a time-boxed migration mode, not as a permanent architecture. Specifically:

1. Freeze new feature growth in legacy raw-SVG components.
2. Introduce shared chart primitives immediately.
3. Migrate the interaction-critical legacy views before Phase 4.1, especially the ones that must participate in linked temporal exploration.
4. Add renderer-agnostic visual contract tests before the migration expands.

## 6. Compute Architecture

There is effectively no concrete planning for backend flexibility beyond the vision statement.

The vision wants local, remote SSH, and cloud modes (`.planning/VISION.md:62-69`). The roadmap does not currently carry that into a dedicated phase or explicit plan item. The closest relevant architecture questions are still open in `.planning/VISION.md:85-87` and `.planning/PROJECT.md:102`.

### What would need to change

To support remote/cloud execution without rewriting the product later, the architecture needs:

1. A backend-neutral simulation service interface.
2. Async job contracts instead of synchronous "return full run record now."
3. Progress and subscription semantics.
4. Artifact retrieval separate from run submission.
5. Cancellation and retry semantics for long or batched runs.

Conceptually:

```ts
submitSimulation(request) -> { jobId }
getJob(jobId) -> { status, progress, summary? }
subscribeToJob(jobId) -> stream of progress/artifact events
fetchArtifact(jobId, artifactId) -> typed artifact payload
cancelJob(jobId) -> acknowledgement
```

The current `SimulationHarness` contract is synchronous (`packages/sim-core/src/contracts.ts:123-126`), and the current race API stores the run only after the simulation is complete (`apps/local-api/src/services/runService.ts:806-919`). That is a clean local implementation detail. It is not a long-horizon compute contract.

### Bottom line

The current local API is a good first backend implementation. It should not be mistaken for the backend architecture the vision ultimately needs.

## 7. Blind Spots

### 1. Multi-regulation readiness is weaker than the planning language suggests

The project says regulation logic should be configurable, not hardcoded (`.planning/PROJECT.md:85`; `.planning/VISION.md:49-56`). But the actual preset schema still exposes `values` as `z.record(z.string(), z.unknown())` (`packages/domain/src/presets/schema.ts:12-23`), and the run service reaches into regulation payloads with loose casts and 2026-specific aero assumptions (`apps/local-api/src/services/runService.ts:523-543`, `.ts:764-785`).

That is not yet the architecture for multi-era regulation support. It is a 2026-capable preset envelope with good intentions.

### 2. Validation and calibration are still too late

The vision includes telemetry comparison and calibration against real data (`.planning/VISION.md:29-30`), but the roadmap still pushes import to Phase 6 and calibration to Phase 7 (`.planning/ROADMAP.md:176-207`). That is late for a platform making educational and engineering claims. The project risks teaching simulator artifacts for several phases before it has any disciplined reality check.

### 3. Strategy realism is still mostly single-car

The current race-model provenance explicitly says "Single-car model without opponent field" (`apps/local-api/src/services/runService.ts:654-659`). STRA-08 adds low-fidelity traffic penalties (`.planning/REQUIREMENTS.md:74-75`), and the research sensibly avoids full opponent simulation (`.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:333-337`). But there is still a missing middle layer: a benchmark or reference-competitor abstraction that makes strategy feel like engineering under competition rather than isolated optimization.

### 4. No explicit performance budget

The vision makes a production-density claim (`.planning/VISION.md:42`). The research chooses a rendering toolkit but never defines measurable budgets:

- max strategies on screen
- max linked panels
- acceptable brush latency
- acceptable hover latency
- acceptable live-update cadence

That omission will make library debates philosophical instead of empirical.

## 8. Findings Table

| # | Finding | Severity | Evidence | Recommendation |
|---|---------|----------|----------|----------------|
| 1 | `visx` is a good tactical Phase 4 library, but not a sufficient long-term rendering strategy on its own. | High | `.planning/VISION.md:39-45`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:49-51`, `:78-84`, `:517-529`; raw SVG-heavy current package confirmed by `packages/visuals/package.json:1-17`, `packages/visuals/src/traces/SoCTrace.tsx:145-255`, `packages/visuals/src/workspace/TrackMap.tsx:124-252`, and shell count `43` raw SVG hits. | Adopt `visx` for Phase 4 inspector/timeline work, but define a renderer boundary and keep a Canvas/WebGL escape hatch for dense/live panels. |
| 2 | The React 19 compatibility risk is real, not hypothetical. | High | `package.json:18-36`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:91-95`, `:303-307`, `:536`; shell checks showed stable `@visx/xychart` `3.12.0` peers React 16-18, while React 19 support is on `3.13.2-alpha.0`. | Do not treat visx as a deep platform dependency until a stable React 19 line is available or a POC proves the stack is operationally safe. |
| 3 | The architecture lacks a transport-neutral simulation boundary. | Critical | `.planning/VISION.md:62-69`, `:87`; `apps/web/src/features/workspace/api.ts:79-182`; `apps/web/src/app/useWorkspace.ts:59-68`, `:169-214`; `apps/local-api/src/routes/runs.ts:48-79`; `apps/local-api/src/services/runService.ts:151-163`, `:697-706`, `:806-919`; `packages/sim-core/src/contracts.ts:123-126`. | Introduce a `SimulationBackend` / async job interface before remote/cloud support is attempted. Make the current local API the first backend implementation, not the final abstraction. |
| 4 | There is no job/progress/streaming model for live or batched strategy workflows. | High | `.planning/VISION.md:40`, `:85`; `apps/local-api/src/app.ts:54-68`; `apps/local-api/src/routes/runs.ts:50-79`; `apps/local-api/src/services/runService.ts:806-919`; `packages/sim-core/src/contracts.ts:123-126`. | Add SSE or WebSocket progress and a job lifecycle before Phase 4.1; Phase 4 batch strategy comparison would benefit from it immediately. |
| 5 | The educational vision still has no first-class content architecture. | High | `.planning/VISION.md:14`, `:22-25`, `:33`, `:84`; `.planning/REQUIREMENTS.md:101-106`; `.planning/ROADMAP.md:111-149`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:38-42`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:51`, `:282`, `:525`. | Define lesson/tutorial/content schemas and artifact-linked learning overlays in Phase 4, even if only as a small proof of concept. |
| 6 | Multi-regulation support is not yet architecturally prepared beyond 2026. | High | `.planning/VISION.md:47-56`; `.planning/PROJECT.md:85`; `packages/domain/src/presets/schema.ts:12-23`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md:92-93`; `apps/local-api/src/services/runService.ts:523-543`, `:764-785`. | Replace `values: record<string, unknown>` with typed preset families and move regulation-specific interpretation out of ad hoc service casts. |
| 7 | The planned mixed-renderer migration is risky, and the visuals package has almost no safety net. | Medium | `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-RESEARCH.md:122-127`, `:284`, `:327-331`; `packages/visuals/package.json:12-15`; root `npm test` tail ended with visuals reporting `No test files found`. | Time-box dual rendering, add renderer-agnostic tests, and migrate the interaction-critical legacy views before linked temporal exploration expands. |
| 8 | Data import and calibration are sequenced too late for the seriousness of the vision. | Medium | `.planning/VISION.md:29-30`; `.planning/PROJECT.md:27-31`, `:44-47`; `.planning/ROADMAP.md:176-207`. | Pull at least a thin validation/reference-data workflow earlier, or explicitly downgrade engineering-confidence claims until Phase 6-7 land. |

## 9. Overall Assessment

Current planning does **not** fail the vision, but it does not yet fully serve it either.

The good news is that the project already has several of the hard foundations:

- a sane monorepo structure
- strong domain typing instincts
- a real race-state and artifact bridge from Phase 3.1
- a local API seam between browser and simulator
- a clear philosophical commitment to honest, model-coupled visuals

The problem is that the current Phase 4 research answers the wrong-sized question. It answers "what charting toolkit should replace our current raw SVG?" The vision is asking "what architecture lets this become a serious engineering and education platform over time?"

My conclusion is:

- `visx` is acceptable if framed as a **near-term rendering choice**
- it is not acceptable if framed as the **whole visualization foundation**
- the bigger risks are actually architectural, not graphical

If the team adds four things now, the roadmap can genuinely serve the vision:

1. a backend-neutral simulation/job boundary
2. a streaming/progress model
3. typed multi-regulation preset architecture
4. a first-class educational content layer

Without those, the project is still pointed at a strong local explanatory lab, not yet at the full platform described in `.planning/VISION.md`.
