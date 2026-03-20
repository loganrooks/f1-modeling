---
phase: 01-foundations-and-scenario-schema
verified: 2026-03-20T04:27:50Z
status: passed
score: 5/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 4/5
  gaps_closed:
    - "The shared repository validation surface is stable enough for later phases to build on directly."
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Run `npm run dev`, open http://127.0.0.1:5173, and let the workspace boot against the local API."
    expected: "The Phase 1 workbench loads, shows saved scenarios/run history, and surfaces an actionable success or error notice."
    why_human: "This verification did not launch the real browser or exercise the cross-process localhost workflow directly."
  - test: "Edit scenario fields, save, reload a saved scenario, then create a placeholder run and inspect run history."
    expected: "The UI updates coherently, files appear under workspace-data/, and the selected run shows snapshot/provenance data without implying lap-model fidelity."
    why_human: "End-to-end interaction timing, browser rendering, and experience clarity require a human pass."
  - test: "Inspect the workbench on desktop and a narrow viewport."
    expected: "Placeholder outputs, provenance badges, and track-context guardrails remain clear; the layout stays readable without suggesting unsupported racing-line or telemetry precision."
    why_human: "Visual semantics and responsive layout quality cannot be verified reliably from static code inspection."
---

# Phase 1: Foundations and Scenario Schema Verification Report

**Phase Goal:** Establish a local-first application skeleton, scenario schema, regulation presets, and run-history tracking so later models have a stable home.
**Verified:** 2026-03-20T04:27:50Z
**Status:** passed
**Re-verification:** Yes -- after gap closure (Plan 01-09)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | User can start a local-first browser/API workspace and reach an initial interactive workbench. | ✓ VERIFIED | Root scripts define the browser+API workflow in `package.json`; the web app proxies `/api` to `127.0.0.1:8787`; the integrated workspace loads presets, scenarios, and runs in `apps/web/src/app/useWorkspace.ts`; browser tests render the full workbench and exercise save/run flows in `apps/web/src/app/App.test.tsx`. Regression check: only `documents.test.ts` changed in fe83c5b -- this wiring is unaffected. |
| 2 | User can define a scenario with circuit, session type, regulation preset, weather preset, and driver placeholder fields, then save or reload it locally. | ✓ VERIFIED | `packages/domain/src/scenario/schema.ts` defines the contract; `packages/domain/src/scenario/defaultScenario.ts` seeds a canonical scenario; `apps/web/src/features/scenario/ScenarioEditor.tsx` and `apps/web/src/features/presets/PresetSelectors.tsx` expose the editable fields; `apps/local-api/src/routes/scenarios.ts` persists and reloads documents; API tests round-trip saved scenarios. Regression check: unaffected by gap-closure commit. |
| 3 | Each run stores reproducible comparison metadata and immutable scenario/preset snapshots. | ✓ VERIFIED | `packages/domain/src/runs/schema.ts` and `packages/domain/src/runs/createRunRecord.ts` require scenario snapshots, preset references, preset snapshots, model/app version, seed, artifacts, and assumption notes; `apps/local-api/src/services/runService.ts` routes run creation through the placeholder harness and shared run-record helper; route tests verify append-only persisted run history. Regression check: unaffected by gap-closure commit. |
| 4 | The workspace and package layout leave room for later subsystem views and reusable learning surfaces. | ✓ VERIFIED | The repo is split into `apps/web`, `apps/local-api`, `packages/domain`, `packages/sim-core`, and `packages/visuals`; scenario documents keep explicit observer/controller/import placeholders; `packages/visuals/src/index.ts` exports shared workbench, comparison, trace, provenance, and track-context primitives that the app consumes. Regression check: unaffected by gap-closure commit. |
| 5 | The shared repository validation surface is stable enough for later phases to build on directly. | ✓ VERIFIED | `npm run typecheck` exits 0 across all five workspaces. `npm run build` exits 0 (vite build outputs 307.84 kB web bundle; all TS packages compile). `npm test` exits 0 with 26 tests passing across 5 test files. `noUncheckedIndexedAccess` remains enabled in `tsconfig.base.json` -- TypeScript strictness was not weakened. |

**Score:** 5/5 truths verified

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
| `packages/domain/src/__tests__/documents.test.ts` | Domain contract coverage without breaking the shared toolchain | ✓ VERIFIED | Generic `firstPreset<T>` helper at line 18 narrows all array lookups before passing into `createRunRecord(...)`; explicit `if (mismatchedSession === undefined)` guard covers the `catalog.session[1]` negative-path case; 20 domain tests pass; root `typecheck` and `build` pass. |

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
| `packages/domain/src/__tests__/documents.test.ts` | `packages/domain/src/runs/createRunRecord.ts` | resolvedPresets argument to createRunRecord | WIRED | `firstPreset<T>` helper narrows `catalog.regulation[0]`, `catalog.session[0]`, and `catalog.weather[0]` before passing as `resolvedPresets`; `createRunRecord` is called at lines 225 and 284. |

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

No anti-patterns found. The three blocker anti-patterns reported in the initial verification (unchecked array indexing at lines 222-224 and 275-277 in `documents.test.ts`) are resolved by the gap-closure commit fe83c5b. The `firstPreset<T>` helper replaces direct indexing, and the `catalog.session[1]` case is guarded with an explicit undefined check. No new anti-patterns were introduced.

No TODO/FIXME/HACK placeholder stubs were found in the implementation files. The `placeholder` strings throughout the codebase are intentional and consistent with Phase 1's honesty constraints.

### Human Verification Required

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

### Gaps Summary (Re-verification)

All five truths now verified. The single gap from the initial verification -- unchecked array indexing breaking the shared typecheck/build surface -- is closed by commit fe83c5b (Plan 01-09). The fix adds a generic `firstPreset<T>` narrowing helper to `packages/domain/src/__tests__/documents.test.ts` and applies it at all relevant call sites, satisfying `noUncheckedIndexedAccess` without weakening TypeScript strictness or changing test behavior.

Re-verification confirms:
- `npm run typecheck` exits 0 across all five workspaces (was: failing in @f1-modeling/domain with 6 TS2719 errors)
- `npm run build` exits 0, producing a 307.84 kB web bundle and clean TS compilation for all packages (was: failing)
- `npm test` exits 0 with 26 tests passing across 5 test files (was: passing at 26 tests; regression check confirms no change)
- `noUncheckedIndexedAccess` remains enabled in `tsconfig.base.json` -- no strictness regression
- Only one file changed in the gap-closure commit -- no regression risk to Truths 1-4

Phase 1 goal is fully achieved. The local-first application skeleton, scenario schema, regulation presets, and run-history tracking are present, wired, tested, and now compile cleanly. Later phases have a stable home.

---

_Initial verification: 2026-03-20T03:53:01Z_
_Re-verification: 2026-03-20T04:27:50Z_
_Verifier: Claude (gsdr-verifier)_
