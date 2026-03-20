---
phase: 01-foundations-and-scenario-schema
verified: 2026-03-20T03:53:01Z
status: gaps_found
score: 4/5 must-haves verified
gaps:
  - truth: "The repository foundation validates cleanly through shared root scripts so later phases inherit a stable home."
    status: failed
    reason: "The root validation surface is broken: `npm run typecheck` and `npm run build` both fail in `@f1-modeling/domain` because `packages/domain/src/__tests__/documents.test.ts` passes possibly undefined preset entries into `createRunRecord(...)` under `noUncheckedIndexedAccess`."
    artifacts:
      - path: "packages/domain/src/__tests__/documents.test.ts"
        issue: "Unchecked array indexing at lines 222-224 and 275-277 triggers TS2719 errors during root typecheck/build."
      - path: "packages/domain/tsconfig.json"
        issue: "The package compiles `src/**/*`, so the broken test file blocks both workspace and root validation commands."
      - path: "package.json"
        issue: "The shared `typecheck` and `build` scripts transitively fail because the domain workspace does not compile cleanly."
    missing:
      - "Narrow or assert preset fixture lookups safely in `packages/domain/src/__tests__/documents.test.ts` before passing them into `createRunRecord(...)`."
      - "Re-run `npm run typecheck` and `npm run build` from the repository root and ensure they both pass."
---

# Phase 1: Foundations and Scenario Schema Verification Report

**Phase Goal:** Establish a local-first application skeleton, scenario schema, regulation presets, and run-history tracking so later models have a stable home.
**Verified:** 2026-03-20T03:53:01Z
**Status:** gaps_found
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | User can start a local-first browser/API workspace and reach an initial interactive workbench. | ✓ VERIFIED | Root scripts define the browser+API workflow in `package.json`; the web app proxies `/api` to `127.0.0.1:8787`; the integrated workspace loads presets, scenarios, and runs in `apps/web/src/app/useWorkspace.ts`; browser tests render the full workbench and exercise save/run flows in `apps/web/src/app/App.test.tsx`. |
| 2 | User can define a scenario with circuit, session type, regulation preset, weather preset, and driver placeholder fields, then save or reload it locally. | ✓ VERIFIED | `packages/domain/src/scenario/schema.ts` defines the contract; `packages/domain/src/scenario/defaultScenario.ts` seeds a canonical scenario; `apps/web/src/features/scenario/ScenarioEditor.tsx` and `apps/web/src/features/presets/PresetSelectors.tsx` expose the editable fields; `apps/local-api/src/routes/scenarios.ts` persists and reloads documents; API tests round-trip saved scenarios. |
| 3 | Each run stores reproducible comparison metadata and immutable scenario/preset snapshots. | ✓ VERIFIED | `packages/domain/src/runs/schema.ts` and `packages/domain/src/runs/createRunRecord.ts` require scenario snapshots, preset references, preset snapshots, model/app version, seed, artifacts, and assumption notes; `apps/local-api/src/services/runService.ts` routes run creation through the placeholder harness and shared run-record helper; route tests verify append-only persisted run history. |
| 4 | The workspace and package layout leave room for later subsystem views and reusable learning surfaces. | ✓ VERIFIED | The repo is split into `apps/web`, `apps/local-api`, `packages/domain`, `packages/sim-core`, and `packages/visuals`; scenario documents keep explicit observer/controller/import placeholders; `packages/visuals/src/index.ts` exports shared workbench, comparison, trace, provenance, and track-context primitives that the app consumes. |
| 5 | The shared repository validation surface is stable enough for later phases to build on directly. | ✗ FAILED | `npm test` passes, but `npm run typecheck` and `npm run build` both fail from the root in `@f1-modeling/domain`, so the supposed shared engineering baseline is not actually clean. |

**Score:** 4/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `package.json` | Root monorepo workspaces and shared scripts | ✓ VERIFIED | Declares `apps/*` and `packages/*` workspaces plus shared `dev`, `build`, `test`, and `typecheck` scripts. |
| `workspace-data/scenarios/.gitkeep` | Canonical tracked scenario storage target | ✓ VERIFIED | The directory exists on disk and matches the Phase 1 local-persistence contract. |
| `workspace-data/runs/.gitkeep` | Canonical tracked run-history storage target | ✓ VERIFIED | The directory exists on disk and matches the append-only run-history contract. |
| `packages/domain/src/scenario/schema.ts` | Versioned scenario document schema | ✓ VERIFIED | Strict Zod contract includes circuit, preset references, driver placeholder, seed, notes, and explicit future extension placeholders. |
| `packages/domain/src/runs/createRunRecord.ts` | Snapshot-aware immutable run-record construction | ✓ VERIFIED | Validates scenario/preset alignment, embeds snapshots and references, and deep-freezes the final record. |
| `apps/local-api/src/routes/scenarios.ts` | Validated scenario save/list/load routes | ✓ VERIFIED | Reads and writes file-backed scenario documents using shared domain validation. |
| `apps/local-api/src/services/runService.ts` | Append-only run orchestration using shared seams | ✓ VERIFIED | Loads saved scenarios, resolves presets, runs the deterministic placeholder harness, and persists run records. |
| `apps/web/src/app/useWorkspace.ts` | Browser orchestration for presets, scenarios, and run history | ✓ VERIFIED | Bootstraps workspace state, saves and reloads scenarios, creates placeholder runs, and refreshes collections through the API. |
| `apps/web/src/app/App.tsx` | Integrated Phase 1 workbench | ✓ VERIFIED | Composes the editor, run history, comparison, provenance, and track-honesty surfaces into the first interactive workspace. |
| `packages/visuals/src/index.ts` | Reusable shared visual primitive entrypoint | ✓ VERIFIED | Re-exports stable workbench, comparison, trace, provenance, and track-context components for downstream reuse. |
| `apps/local-api/src/__tests__/workspaceRoutes.test.ts` | End-to-end API coverage for presets, scenarios, and runs | ✓ VERIFIED | Covers preset listing, scenario round-trip, append-only run creation, and persisted JSON shape. |
| `packages/domain/src/__tests__/documents.test.ts` | Domain contract coverage without breaking the shared toolchain | ✗ FAILED VALIDATION | Runtime tests pass, but TypeScript rejects unresolved array-indexed preset fixtures, which breaks root `typecheck` and `build`. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `apps/web/vite.config.ts` | `apps/local-api/src/server.ts` | Browser `/api` proxy targets the pinned API port | WIRED | Vite proxies `/api` to `http://127.0.0.1:8787` and the API listens on `127.0.0.1:8787`. |
| `apps/web/src/app/useWorkspace.ts` | `apps/web/src/features/workspace/api.ts` | Browser workspace boot/save/run flow is centralized in one client API layer | WIRED | The workspace hook calls `fetchPresetCatalog`, `listScenarioDocuments`, `loadScenarioDocument`, `saveScenarioDocument`, `listRunHistory`, and `createPlaceholderRun`. |
| `apps/web/src/features/workspace/api.ts` | `apps/local-api/src/routes/scenarios.ts` | Scenario save/load/list travels through `/api/scenarios` | WIRED | The client fetch layer issues `GET /api/scenarios`, `GET /api/scenarios/:id`, and `POST /api/scenarios`; the Fastify route module serves those endpoints. |
| `apps/web/src/features/workspace/api.ts` | `apps/local-api/src/routes/runs.ts` | Run creation and run-history listing travel through `/api/runs` | WIRED | The client fetch layer issues `GET /api/runs` and `POST /api/runs`; the Fastify route module serves those endpoints. |
| `apps/local-api/src/services/runService.ts` | `packages/domain/src/runs/createRunRecord.ts` | API run creation uses the shared append-only run helper | WIRED | `createPhase1Run(...)` imports and calls `createRunRecord(...)` before persisting the run JSON. |
| `apps/local-api/src/services/runService.ts` | `packages/sim-core/src/phase1Placeholder.ts` | API run creation uses the deterministic placeholder harness | WIRED | `createPhase1Run(...)` imports and calls `runPhase1PlaceholderScenario(...)`. |
| `apps/web/src/app/App.tsx` and `apps/web/src/features/runs/RunSummaryPanel.tsx` | `packages/visuals/src/index.ts` | Final workspace composition reuses shared visuals instead of page-local stand-ins | WIRED | The app imports `WorkbenchShell`, `AssumptionPanel`, and `TrackContextPlaceholder`; the run summary imports `RunComparisonCard` and `MetricTracePanel`. |

Note: the original Plan 01-02 summary claimed direct browser polling of `/api/health`. The current web app no longer imports or calls that route; instead, the integrated workspace surfaces stack status through the real presets/scenarios/runs flows and explicit localhost status copy. That does not block the Phase 1 goal, but it is a divergence from the earlier scaffold summary.

### Requirements Coverage

| Requirement | Status | Blocking Issue |
| --- | --- | --- |
| PLAT-01 | ? NEEDS HUMAN | Automated evidence is strong, but the actual browser launch and live localhost user flow were not exercised in this verification. |
| PLAT-03 | ✓ SATISFIED | Scenarios and runs are persisted as local JSON and can be reloaded through the API and browser workspace. |
| VAL-02 | ✓ SATISFIED | Run records include model version, app version, seed, scenario snapshot, preset references, preset snapshots, artifacts, and assumption notes. |
| DESN-02 | ✓ SATISFIED | The codebase is separated into shared domain, sim-core, visuals, and app shells with explicit future extension points. |
| VISU-01 | ✓ SATISFIED | Shared workbench, comparison, trace, provenance, and track-context primitives are exported from `@f1-modeling/visuals` and reused by the integrated app. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `packages/domain/src/__tests__/documents.test.ts` | 222-224 | Unchecked array indexing for preset fixtures | 🛑 Blocker | Breaks `npm run typecheck` and `npm run build` because `catalog.regulation[0]`, `catalog.session[0]`, and `catalog.weather[0]` are treated as possibly undefined. |
| `packages/domain/src/__tests__/documents.test.ts` | 275-277 | Unchecked array indexing for mismatch fixture construction | 🛑 Blocker | Extends the same TypeScript failure path into the negative-path test, keeping the shared foundation red. |
| `packages/domain/tsconfig.json` | 9-11 | Build/typecheck include the failing test source | 🛑 Blocker | The broken domain test file is part of the compiled source set, so the root validation scripts cannot go green. |

No TODO/FIXME/HACK placeholder stubs were found in the implementation files reviewed. The many `placeholder` strings are intentional and consistent with Phase 1's honesty constraints, not unfinished UI or API stubs.

### Human Verification Required After Gap Closure

### 1. Local Browser Boot

**Test:** Run `npm run dev`, open `http://127.0.0.1:5173`, and let the workspace boot against the local API.  
**Expected:** The Phase 1 workbench loads, shows saved scenarios/run history, and surfaces an actionable success or error notice.  
**Why human:** This verification did not launch the real browser or exercise the cross-process localhost workflow directly.

### 2. Real Save/Load/Create-Run Flow

**Test:** Edit the scenario fields, save the scenario, reload a saved scenario, then create a placeholder run and inspect the run history.  
**Expected:** The UI updates coherently, files appear under `workspace-data/`, and the selected run shows snapshot/provenance data without implying lap-model fidelity.  
**Why human:** End-to-end interaction timing, browser rendering, and experience clarity require a human pass.

### 3. Visual Honesty and Layout

**Test:** Inspect the workbench on desktop and a narrow viewport.  
**Expected:** Placeholder outputs, provenance badges, and track-context guardrails remain clear; the layout stays readable without suggesting unsupported racing-line or telemetry precision.  
**Why human:** Visual semantics and responsive layout quality cannot be verified reliably from static code inspection.

### Gaps Summary

Phase 1 is substantively implemented. The monorepo structure, browser shell, local API, domain schemas, preset catalog, run-history construction, shared visuals, tracked workspace-data directories, and automated runtime tests are all present and wired. The summaries are mostly borne out by the code, and all 15 documented plan commit hashes resolve in git.

The blocker is that the supposed shared engineering baseline is not actually clean. The repository-level `npm run typecheck` and `npm run build` commands both fail in `@f1-modeling/domain`, caused by unresolved array-indexed preset fixtures in `packages/domain/src/__tests__/documents.test.ts` being compiled under the workspace `tsconfig`. That failure directly undermines the "stable home" part of the phase goal, so the phase cannot be marked passed yet.

---

_Verified: 2026-03-20T03:53:01Z_  
_Verifier: Claude (gsdr-verifier)_
