# Vision Alignment Audit -- Phase 4 Planning Direction

**Auditor:** Claude Opus 4.6 (independent)
**Date:** 2026-04-08
**Scope:** Visualization library choice, architecture alignment with vision, educational gap analysis, compute architecture readiness, and comparison with 2026-04-07 audit findings

---

## 1. Executive Summary

The Phase 4 research document is competent and thorough on its chosen scope, but it resolves the visualization library question too narrowly and too quickly. visx is a defensible choice for the immediate Phase 4 deliverables, but it is not the right *long-term foundation* for a platform whose vision explicitly includes real-time strategy analysis, live-updating views during simulation, and production-density trace rendering. The research evaluates visx against Phase 4 requirements rather than against the full vision articulated in VISION.md. Additionally, the project has a significant unaddressed gap in educational content architecture -- the educational dimension is treated as a UI concern rather than a content system -- and the compute architecture lacks any concrete abstraction boundary for the flexible backend vision. The Fastify local-API and request-response pattern will need WebSocket or streaming extensions before Phase 4.1, and that architectural change is not acknowledged anywhere in the current planning.

---

## 2. Visualization Library Assessment

### 2.1 What the Research Gets Right

The research correctly identifies that hand-rolled SVG has reached its practical limit. The existing components (`SpeedProfileTrace.tsx`, `SoCTrace.tsx`, `SensitivityWaterfall.tsx`, `TrackMap.tsx`) duplicate scale math, hover logic, margin constants, and styling across every file. Each component reimplements `scaleX`/`scaleY`, `handleMouseMove`, tooltip positioning, and axis tick generation from scratch. This is unsustainable for Phase 4's multi-panel strategy views.

The identification of visx's strengths is accurate: React-native rendering (no d3 DOM conflict), modular package structure, `DataProvider`/`EventEmitterProvider` for linked views, and the migration path from hand-rolled SVG to visx primitives is genuinely natural.

### 2.2 Where the Research Falls Short

**The evaluation horizon is too narrow.** The research evaluates visualization libraries against Phase 4 success criteria. But VISION.md (`/home/rookslog/workspace/projects/f1-modeling/.planning/VISION.md`, lines 37-45) states the visualization layer must:

- "Handle real-time strategy visualization -- not just static post-hoc analysis"
- "Scale to production density -- 50-70 lap race traces, multi-strategy comparison (6+ strategies)"
- Support "linked brushing across 4+ panels"
- Eventually support "live-updating strategy views during simulation"

The research's alternatives table (`04-RESEARCH.md`, lines 80-84) dismisses canvas-based approaches because they are "unnecessary for 50-70 lap race traces." That is wrong. 50-70 laps times 6+ strategies times 4+ linked panels with per-lap subsystem state (tire, energy, weather, grip) is 1,680+ data series rendering simultaneously. SVG performance degrades noticeably past ~1,000 DOM elements; linked brushing with React re-renders at that density will be sluggish on consumer hardware (the project's constraint, per `PROJECT.md` line 76).

**React 19 risk is understated.** The research notes visx 3.12.0 stable does not support React 19, and recommends using `3.13.0-alpha.0` or `--legacy-peer-deps`. Checking npm today:

- `@visx/xychart@3.12.0` stable: peer dependency `react: ^16.8.0 || ^17.0.0 || ^18.0.0` -- **no React 19**
- `@visx/xychart@3.13.2-alpha.0`: peer dependency `react: ^16.8.0-0 || ^17.0.0-0 || ^18.0.0-0 || ^19.0.0-0` -- React 19 supported, but depends on `@react-spring/web: ^9.4.5` which **does not support React 19**
- `@visx/xychart@4.0.1-alpha.0`: peer dependency includes React 19, and depends on `@react-spring/web: ^9.7.5 || ^10.0.0` -- React 19 support via react-spring 10.x

This means the research's recommended version (3.13.0-alpha.0) has a **transitive React 19 incompatibility** through react-spring. The actually working path is either:
1. visx 4.0.x-alpha.0 (entirely alpha, major version bump, potential API changes)
2. Skip `@visx/xychart` entirely and use only the lower-level packages (`@visx/shape`, `@visx/scale`, `@visx/axis`) which do not depend on react-spring

Neither option is acknowledged in the research.

**Alternatives dismissed too quickly:**

| Alternative | Research Dismissal | Counter-evidence |
|-------------|-------------------|------------------|
| Canvas-based | "unnecessary for 50-70 lap race traces" | Multi-strategy comparison at 6+ strategies with 4 linked panels creates thousands of rendered elements. SVG will strain. |
| Observable Plot | "stale React wrapper" | Fair critique. |
| Recharts | "insufficient customization" | Fair for Gantt timelines. |
| **Plotly.js** | Not mentioned | React-native (`react-plotly.js`), supports React 19 (`react: >0.13.0`), built-in linked views via `plotly_relayout` events, built-in range sliders, trace overlay, 3D support for future spatial viz. Bundle size is large (~3.5MB) but can be tree-shaken with `plotly.js-dist-min`. Scientific visualization is its core competency. |
| **Nivo** | Not mentioned | React 19 support (`^19.0`), version 0.99.0, built on d3 like visx but higher-level API. Gantt and waterfall would need custom work. Less control than visx but faster to build standard charts. |
| **Hybrid: visx primitives + Canvas for dense traces** | Not evaluated | Use visx for custom semantic charts (waterfall, Gantt, explanation panels) and Canvas/WebGL for performance-critical dense trace overlays. This is how serious data visualization platforms (Observable, Grafana, TradingView) handle the density problem. |

### 2.3 Recommendation

**Do not commit to visx as the sole visualization foundation.** Instead:

1. **Adopt visx lower-level packages** (`@visx/shape`, `@visx/scale`, `@visx/axis`, `@visx/group`, `@visx/brush`, `@visx/tooltip`, `@visx/responsive`) for custom semantic charts (strategy waterfall, Gantt timeline, explanation panels). These packages do NOT depend on react-spring and work with React 19 today.

2. **Do NOT adopt `@visx/xychart`** as a high-level chart component. Its react-spring dependency creates a React 19 compatibility trap. Build linked-view coordination using a custom React context (the DataProvider/EventEmitterProvider pattern is not complex; it is a shared cursor position in context).

3. **Evaluate Canvas fallback for dense trace rendering.** When Phase 4+ requires 6-strategy overlays with per-lap subsystem traces across linked panels, SVG will not perform. Prototype a Canvas-based trace renderer for the dense overlay case. This does not need to be Phase 4 scope, but the architecture should not preclude it.

4. **Consider Plotly.js as a complementary tool** for scientific/engineering trace visualization in Phase 6+ (telemetry alignment, calibration views). Plotly's built-in range sliders, trace comparison, and scientific axis formatting are purpose-built for the calibration workbench vision.

**Risk if ignored:** The project locks into a React 19-incompatible transitive dependency (react-spring via xychart) or an entirely-alpha major version (visx 4.x), and later discovers SVG performance is inadequate for production-density strategy comparison. Migration at that point is expensive.

---

## 3. Architecture Alignment

### 3.1 Vite + React + Fastify Stack

The current stack is adequate for Phases 4-5 but architecturally incomplete for the full vision.

**What works:**
- Vite dev server with proxy to Fastify API handles the current development model well
- TypeScript monorepo with clean workspace boundaries
- Zod-validated domain schemas maintain type safety across the boundary
- The `buildApp()` pattern in `apps/local-api/src/app.ts` (lines 54-69) is cleanly testable

**What will strain:**

1. **No streaming or push architecture.** The current API is entirely request-response. Every simulation creates a run synchronously (`runService.ts` dispatches to harnesses that return results). VISION.md (line 41) calls for "live-updating strategy views during simulation." Even the Phase 4 sensitivity workflow (run N perturbation variants) would benefit from streaming partial results rather than blocking until all complete. Fastify supports WebSocket via `@fastify/websocket`, but there is zero infrastructure for it.

2. **No simulation progress feedback.** A 70-lap race simulation currently runs synchronously on the API thread. For multi-strategy comparison (running 6+ race simulations sequentially or in parallel), the browser has no progress visibility. The `useWorkspace.ts` hook (line 169-206) shows the pattern: set `isCreatingRun`, call API, set result. There is no intermediate state.

3. **Browser workspace is monolithic.** `App.tsx` (lines 139-383) renders a single three-zone workbench. Phase 4 adds strategy comparison views, engineer-role views, qualifying views, and race timeline views. The current `zones` array is hardcoded to three slots. The workspace needs a routing or panel-management layer.

### 3.2 Monorepo Readiness for Flexible Compute

**Good:**
- `packages/sim-core` is browser-safe (pure TypeScript, no Node dependencies in the core)
- `packages/domain` has explicit `node/` subpath for filesystem operations
- The `SimulationHarness` interface (`contracts.ts`, lines 123-127) provides a clean dispatch boundary

**Problematic:**
- There is no abstraction between "call the harness" and "call the API endpoint." The Fastify routes directly invoke sim-core functions. For remote compute, there needs to be a `SimulationBackend` abstraction that can target local in-process, HTTP to a remote machine, or a cloud queue.
- The `workspace-data/` persistence model (JSON files on local disk) is coupled to the API server's filesystem. Remote compute would need the API to either proxy results or share storage.

### 3.3 Multi-Regulation Preparation

**Currently adequate.** The regulation preset system (`presets/regulations/fia-2026-baseline.json`) is file-based and catalog-resolved. Adding historical regulation presets (2022-2025, 2017-2021, etc.) is architecturally straightforward. The `values` field being `z.record(string, unknown)` is the main type-safety gap (acknowledged in audit finding #4), but structurally the system handles multiple regulation eras.

---

## 4. Educational Gap Analysis

### 4.1 The Core Problem

VISION.md (lines 20-25) describes:
- "Lessons and tutorials teaching basic and advanced F1 engineering and strategy principles"
- "Role-based learning paths (strategy engineer, performance engineer, race engineer, etc.)"
- "Progressive disclosure: each concept builds on the previous"

The ROADMAP.md assigns educational requirements to Phase 4 (EDU-01, EDU-03) and Phase 5 (EDU-02). But there is **no content architecture** anywhere in the project for lessons, tutorials, or progressive learning sequences. The research document treats education entirely as a UI concern: "engineer-role views as filtered projections over shared data surfaces."

This conflates two very different things:
1. **Role-specific data presentation** -- showing a strategy engineer the compound windows and pit timing from a simulation run
2. **Structured educational content** -- teaching someone what compound windows are, why pit timing matters, what a strategy engineer considers, what questions they ask, what mental models they use

The project has good infrastructure for #1. It has zero infrastructure for #2.

### 4.2 What is Missing

- **Content schema:** No schema for lessons, tutorials, guided explorations, or concept progressions. Where do learning units live? How are they versioned? What connects them to simulation outputs?
- **Prerequisite graph:** No model for which concepts depend on which others. A learner should not see the interruption-response explanation before understanding basic stint strategy.
- **Guided questions:** The Phase 4 research mentions "guiding questions drawn from real engineering practice" for role views (line 525), which is the right instinct, but there is no schema or content system for delivering these questions.
- **Assessment or self-check:** No mechanism for a learner to verify their understanding. Even simple "run this scenario and predict whether Strategy A or B will win, then see why" interactions would be valuable.

### 4.3 VISION.md Question Already Asks This

VISION.md (line 84) explicitly asks: "When does 'educational scaffolding' become first-class content vs. just good UI?" The answer so far has been: not yet. But Phase 4 is where educational requirements first appear (EDU-01, EDU-03), and without a content system, the best Phase 4 can deliver is well-organized data views with tooltips.

### 4.4 Recommendation

Add a Phase 4 plan (or a 4.x insertion) that defines:
1. A `LessonUnit` schema: concept ID, prerequisites, associated simulation scenario, guiding questions, key insights, role associations
2. A content directory (e.g., `content/lessons/`) with structured lesson files
3. A lesson-aware view mode that overlays guided questions and concept explanations on simulation output
4. Start with 3-5 lessons for the strategy engineer role as proof of concept

This does not need to be the full educational platform from the vision. But it needs to exist as architecture, not just as "the explanation view has nice labels."

---

## 5. Visualization-Model Co-evolution

### 5.1 The Migration Strategy: Sound but Incomplete

The research recommends: "Build new Phase 4 views in visx. Wrap existing Phase 1-3 views in visx-compatible containers. Migrate existing views incrementally."

This is practical and avoids the big-bang rewrite anti-pattern. The existing components already follow a pattern (panel container, SVG chart, legend, tooltip) that maps to visx equivalents.

### 5.2 Risk: Two Rendering Approaches Simultaneously

Running hand-rolled SVG alongside visx creates:
- **Style divergence:** The existing components use inline `CSSProperties` objects with specific color values, border radii, and font stacks. visx components will use visx theming. Without a shared style system, old and new charts will look different.
- **Interaction inconsistency:** Existing tooltips use manual `onMouseMove` with absolute positioning. visx tooltips use `@visx/tooltip` with portal rendering. Users will notice the difference.
- **Maintenance burden:** Bug fixes or style changes must be applied to both rendering approaches until migration completes.

**Mitigation:** Define a shared chart theme (colors, fonts, spacing, tooltip style) as a TypeScript constant consumed by both old-style components and visx-based components. This normalizes appearance even before full migration.

### 5.3 Risk: Visualization Advancing Faster Than Model

Phase 4's planned views (Gantt timeline, strategy comparison, factor waterfall, pit window overlay) are sophisticated visualization infrastructure. But the model behind them is still a reduced-order lap solver wrapped in a stint loop wrapped in a race orchestrator. The risk is building beautiful strategy comparison views that present reduced-order-model output with the visual density of a professional strategy tool, which could violate the project's honesty constraint.

**Evidence:** CLAUDE.md (line 23) states "Never imply model fidelity the current phase doesn't support. Label placeholder outputs explicitly." VISION.md (line 44) states "Architecturally honest -- never imply fidelity the model doesn't support."

The research appropriately addresses this with its Gantt timeline and factor decomposition approach. But the research also proposes traffic/rejoin penalties (`04-RESEARCH.md`, lines 436-453) as a per-lap time penalty function. While appropriately low-fidelity, the visualization of "undercut/overcut windows" will *look* like track position analysis when it is actually a scalar penalty estimate. The honesty constraint must be surfaced prominently in these views.

---

## 6. Compute Architecture

### 6.1 Current State

The compute architecture is entirely local and synchronous:
- Fastify API runs on the same machine as the browser
- Simulation harnesses execute in-process on the API thread
- Results are written to local filesystem (`workspace-data/`)
- No queuing, no worker threads, no streaming, no remote dispatch

### 6.2 What the Vision Requires

VISION.md (lines 58-69) describes:
1. Local compute (current)
2. Remote compute via SSH
3. Cloud compute
4. Clear onboarding for each mode

### 6.3 What is Missing

**No `SimulationBackend` abstraction.** The Fastify routes directly call `runRace()`, `runStint()`, etc. For compute flexibility, there should be an interface:

```typescript
interface SimulationBackend {
  submit(request: SimulationRunRequest): Promise<RunHandle>;
  status(handle: RunHandle): Promise<RunStatus>;
  result(handle: RunHandle): Promise<SimulationRunSummary>;
}
```

This interface would have implementations for local (in-process), remote (HTTP/SSH), and cloud (queue-based). The current code bakes in the local assumption everywhere.

**No streaming or progress reporting.** Even for local compute, multi-strategy comparison (6+ race simulations) could take several seconds. The browser currently has no progress feedback beyond "creating run..." The architecture needs either:
- WebSocket-based progress updates (Fastify -> browser)
- Server-Sent Events for unidirectional progress
- Polling with intermediate state in the run record

This is not a Phase 8 concern. Phase 4's multi-strategy comparison workflow is where users first need progress feedback, and Phase 4.1's temporal exploration needs streaming-capable infrastructure.

### 6.4 Recommendation

1. Add a `SimulationBackend` interface to `packages/sim-core` (or a new `packages/compute` workspace) before Phase 4 planning finalizes. Even if only the local implementation exists in Phase 4, the abstraction preserves the vision.
2. Add `@fastify/websocket` infrastructure in Phase 4 plan 04-01 for progress reporting during multi-run comparison.
3. Document the compute abstraction boundary in `PROJECT.md` as a key decision.

---

## 7. Previous Audit Comparison (Delta from 2026-04-07)

### 7.1 Findings Addressed

| 2026-04-07 Finding | Status in Current Planning |
|---------------------|---------------------------|
| #1: Root test suite red | **Resolved.** Tests pass: `npm test` completes across all workspaces. |
| #6: No race-state engine | **Resolved.** Phase 3.1 complete; `raceRunner.ts` sequences stints with pit events, interruptions, and typed timeline. |
| #7: Schemas not ready for Phase 4+ | **Resolved.** `raceSchema.ts` adds `RacePlan`, `StintSpec`, `InterruptionSpec`, `TireInventory`, `BranchPoint`. Run records carry `parentRunId`, `branchPoint`, `experimentTag`. |
| #9: Visualization stack approaching local maximum | **Partially addressed.** Research recommends visx, but the recommendation has React 19 compatibility issues and does not evaluate against the full vision scope. See Section 2. |
| #10: Phase 4 overloaded | **Resolved.** Observers moved to Phase 4.1. Phase 4 scope narrowed to strategy + race simulation + explanation surfaces. |
| #11: Phase 5 needs control-ready plant | **Resolved.** ROADMAP.md Phase 5 plan 05-01 added: "Define control-ready plant interface." |

### 7.2 Findings Still Open

| 2026-04-07 Finding | Current Gap |
|---------------------|-------------|
| #4: Preset decoding uses unchecked casts | Research notes "type preset values" as a Phase 4 task but no specific plan. |
| #5: Validation/data sequenced too late | No change. Data import is still Phase 6. No earlier validation slice has been added. |
| #8: Electrical model too coarse for strategy | Research proposes `DeployPlan` schema with stint-phased policies -- good. But the underlying electrical model still uses lap-level deploy (`electricalModel.ts:162-166`). The `DeployPlan` would be consumed by the race engine, not by the electrical model. Gap between plan expressiveness and model consumption remains. |
| #12: Requirements too capability-shaped | STRA-06/07/08 added for pit-lane, tire inventory, traffic. Good progress but still no workflow-shaped requirements per engineer role. |

### 7.3 New Gaps Not in Previous Audit

1. **Educational content architecture** -- not identified in 2026-04-07 audit, still absent.
2. **Streaming/WebSocket infrastructure** -- needed before Phase 4.1 timeline scrubbing but not planned.
3. **visx React 19 transitive dependency problem** -- new finding from this audit.
4. **Canvas/WebGL fallback path for dense rendering** -- not identified previously.
5. **Workspace routing/panel management** -- `App.tsx` hardcoded three-zone layout cannot accommodate Phase 4 view expansion.
6. **Compute backend abstraction** -- VISION.md describes flexible compute, but no interface exists.

---

## 8. Findings Table

| # | Finding | Severity | Evidence | Recommendation |
|---|---------|----------|----------|----------------|
| 1 | visx `@visx/xychart` has transitive React 19 incompatibility via `@react-spring/web ^9.4.5` in 3.13.x-alpha | **HIGH** | `npm view @visx/xychart@3.13.2-alpha.0 dependencies` shows `@react-spring/web: ^9.4.5`; react-spring 9.x does not support React 19; v4.0.x-alpha requires react-spring 10.x which is also recent | Use visx lower-level packages only (`@visx/shape`, `@visx/scale`, `@visx/axis`, etc.) which have no react-spring dependency. Avoid `@visx/xychart` until stable React 19 support ships. |
| 2 | Visualization evaluation scoped to Phase 4, not to platform vision | **HIGH** | Research alternatives table (`04-RESEARCH.md:80-84`) evaluates against "50-70 lap race traces" only. VISION.md lines 37-45 require real-time updating, production density, 6+ strategy overlay, 4+ linked panels | Re-evaluate with full vision scope. Add Canvas fallback path for dense rendering. Consider Plotly.js for Phase 6+ scientific visualization. |
| 3 | No educational content architecture | **HIGH** | VISION.md lines 20-25 describe lessons, tutorials, role-based learning paths. EDU-01 and EDU-03 are Phase 4 requirements. No content schema, lesson format, or prerequisite graph exists in any planning document. | Define `LessonUnit` schema and content directory. Start with 3-5 strategy engineer lessons as Phase 4 proof of concept. |
| 4 | No streaming/WebSocket infrastructure for progress or live updates | **MEDIUM** | Current API is entirely request-response (`app.ts` lines 54-69). VISION.md line 41: "live-updating strategy views." Phase 4 multi-strategy comparison needs progress feedback. | Add `@fastify/websocket` in Phase 4 plan 04-01. Define streaming protocol for simulation progress. |
| 5 | No compute backend abstraction | **MEDIUM** | VISION.md lines 58-69 describe local/remote/cloud compute. Fastify routes call `runRace()` directly. No `SimulationBackend` interface. | Add `SimulationBackend` interface to sim-core or new compute package. Implement local backend first. |
| 6 | Browser workspace has hardcoded three-zone layout | **MEDIUM** | `App.tsx` lines 185-302: `zones` is a fixed `[Zone, Zone, Zone]` tuple. Phase 4 adds strategy views, engineer-role views, qualifying views, race timeline. | Add workspace routing or panel management layer. Phase 4 plan 04-03 or 04-04 should address this. |
| 7 | Data validation still sequenced too late (Phase 6) | **MEDIUM** | Strategic gap audit finding #5 recommended pulling reference-data import forward. No 3.x or early Phase 4 plan added. | Add a lightweight reference-data plan (Phase 4.x or early Phase 5) for FastF1/OpenF1 baseline comparison. |
| 8 | Deploy-plan expressiveness exceeds model consumption | **LOW** | Research proposes `DeployPlan` with per-stint `DeployPhase` (fromLap/toLap/deployFraction/harvestEfficiency). But `electricalModel.ts:162-166` consumes only `deployFraction` as a lap-level scalar. Plan semantics outrun model capability. | Acceptable for Phase 4 if the model is extended to consume stint-phased policies. Document the gap. |
| 9 | Duplicated styling across existing visualization components | **LOW** | `SpeedProfileTrace.tsx`, `SoCTrace.tsx`, `SensitivityWaterfall.tsx`, `TrackMap.tsx` all define identical `panelStyle`, `eyebrowStyle`, `titleStyle`, `chartFrameStyle`, `axisTextStyle` objects | Extract shared chart theme before or during visx migration. Prevents style divergence between old and new components. |
| 10 | Workspace UI text references Phase 1/2 despite Phase 3.1 completion | **LOW** | `App.tsx` line 309: "Phase 2 scenario workbench". `useWorkspace.ts` line 96: "placeholder runs" messaging. | Update UI labels as part of Phase 4 workspace integration plan. |

---

## 9. Overall Assessment

The project is at a genuine inflection point. Phases 1-3.1 have built a solid foundation: clean TypeScript monorepo, well-typed domain schemas with provenance, a working race-state engine with typed timeline artifacts, and honest visualization components. The Phase 3.1 insertion was the right architectural move and it was executed well. The project is healthy -- tests pass, types check, the race engine sequences stints with pit events and interruptions.

The Phase 4 research document is thorough on its F1 domain knowledge (qualifying rules, pit-stop timing, traffic penalties, deploy-plan semantics) and on its strategy-comparison architecture (factor decomposition, multi-run analysis, intervention branching). These are the right engineering patterns.

**Where the planning falls short is in evaluating its own choices against the long-term vision rather than the immediate milestone.** The visualization library recommendation resolves the Phase 4 problem but creates a React 19 trap and a density ceiling. The educational dimension is scoped as "explanation views" rather than as the structured content system the vision demands. The compute architecture has no abstraction boundary for the flexible-backend vision. The streaming infrastructure needed for temporal exploration (Phase 4.1) and live updates (vision) is not acknowledged.

The risk is not that Phase 4 will fail. With visx lower-level packages and the existing race engine, Phase 4 can deliver strategy comparison, factor attribution, qualifying modes, and engineer-role views. The risk is that Phase 4 makes architectural commitments (visx xychart dependency, request-response-only API, no content system, no compute abstraction) that constrain Phases 5-8 and the broader vision.

**The project should:**
1. Adopt visx lower-level packages, not `@visx/xychart`, to avoid the React 19/react-spring trap
2. Add educational content architecture as a Phase 4 deliverable, not a Phase 8 afterthought
3. Add WebSocket infrastructure for simulation progress in Phase 4 plan 04-01
4. Define a `SimulationBackend` interface before finalizing Phase 4 plans
5. Acknowledge the SVG density ceiling and plan a Canvas fallback path for Phase 5+
6. Address the workspace layout rigidity before Phase 4 view expansion

The foundation is strong. The next step needs to build toward the vision, not just the milestone.

---

*Audit completed: 2026-04-08*
*Auditor: Claude Opus 4.6 (independent, no prior involvement in Phase 4 research)*
