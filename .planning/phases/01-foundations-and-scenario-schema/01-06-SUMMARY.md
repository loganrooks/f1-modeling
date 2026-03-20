---
phase: 01-foundations-and-scenario-schema
plan: 06
model: gpt-5.4
context_used_pct: 66
subsystem: apps/local-api
tags: [fastify, workspace-data, zod, vitest, sim-core]
requires:
  - phase: 01-02
    provides: Fastify app shell with reusable app construction and local routing
  - phase: 01-03
    provides: workspace-data directories plus the deterministic Phase 1 placeholder harness
  - phase: 01-05
    provides: preset catalog disk loading and snapshot-aware run-record construction
provides:
  - File-backed preset, scenario, and run history routes in the local API
  - Pretty-printed JSON persistence under workspace-data/ for inspectable Phase 1 artifacts
  - Fastify integration tests covering preset loading, scenario persistence, and append-only run creation
affects: [phase-01, apps/local-api, workspace-data, presets, run-history]
tech-stack:
  added: [none]
  patterns: [pretty-printed json file store, node-only preset loading, append-only run-history routes]
key-files:
  created:
    - apps/local-api/src/persistence/fileStore.ts
    - apps/local-api/src/services/presetService.ts
    - apps/local-api/src/services/runService.ts
    - apps/local-api/src/routes/presets.ts
    - apps/local-api/src/routes/scenarios.ts
    - apps/local-api/src/routes/runs.ts
    - apps/local-api/src/__tests__/workspaceRoutes.test.ts
  modified:
    - apps/local-api/package.json
    - apps/local-api/src/app.ts
    - package-lock.json
    - packages/domain/src/presets/registry.ts
    - packages/sim-core/package.json
key-decisions:
  - "Default local API paths resolve repo-root presets and workspace-data locations, but app construction accepts explicit overrides for tests and alternate roots."
  - "Run creation stays append-only by generating fresh run ids while delegating scenario snapshot and preset snapshot assembly to createRunRecord."
patterns-established:
  - "Local file persistence: scenarios and runs are saved as human-inspectable JSON files under workspace-data/ instead of browser-managed storage."
  - "API run orchestration: the local API loads saved scenarios, resolves preset documents from disk, runs the placeholder harness, and persists immutable run records through the shared domain helper."
duration: 10min
completed: 2026-03-20
---

# Phase 1 Plan 06: Local File Persistence and Phase 1 API Routes Summary

**The local API now lists presets, saves scenarios, and appends immutable Phase 1 run records as pretty-printed JSON under `workspace-data/`.**

## Performance
- **Duration:** 10min
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Added a deterministic JSON file store plus app-level path resolution so the local API can read and write inspectable workspace artifacts on disk.
- Implemented `GET /api/presets`, `GET /api/scenarios`, `GET /api/scenarios/:scenarioId`, and `POST /api/scenarios` with schema validation backed by the shared domain contracts.
- Implemented `GET /api/runs` and `POST /api/runs`, where run creation resolves a saved scenario, loads the referenced preset documents, runs the Phase 1 placeholder harness, and persists the result through `createRunRecord(...)`.
- Added Fastify injection tests using a temp workspace root to prove preset listing, scenario save/load, append-only run creation, run listing, and persisted run snapshots all work end to end.

## Task Commits
1. **Task 1: Implement the file-backed store plus preset and scenario routes** - `82fd8b4`
2. **Task 2: Add append-only run creation routes and API integration tests** - `c541569`

## Files Created/Modified
- `apps/local-api/src/persistence/fileStore.ts` - Canonical pretty-printed JSON read/write/list helpers for Phase 1 workspace artifacts
- `apps/local-api/src/services/presetService.ts` - Node-only preset catalog loading plus scenario-to-preset resolution helpers
- `apps/local-api/src/services/runService.ts` - Append-only run orchestration that resolves scenarios/presets, invokes sim-core, and persists run records
- `apps/local-api/src/routes/presets.ts` - Preset catalog route
- `apps/local-api/src/routes/scenarios.ts` - Scenario list/get/save routes with domain-schema validation
- `apps/local-api/src/routes/runs.ts` - Run list/create routes with append-only semantics
- `apps/local-api/src/__tests__/workspaceRoutes.test.ts` - Route-level integration coverage against a temp workspace root
- `apps/local-api/src/app.ts` - Shared app wiring for the new `/api` routes and workspace path resolution
- `apps/local-api/package.json` - Explicit local API workspace dependencies for domain and sim-core imports
- `packages/domain/src/presets/registry.ts` - Shared preset registry narrowing fix required by downstream typecheck
- `packages/sim-core/package.json` - Workspace-source export fix so Vitest and TypeScript can resolve sim-core directly

## Decisions Made
- Resolve default local API paths from the repository root so saved artifacts always land in the canonical `workspace-data/` tree, while still allowing tests to inject an isolated workspace root.
- Keep run creation append-only and snapshot-based by generating a new run id for each request and storing the shared scenario and resolved preset documents inside the immutable run record.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected generic filtering in the local JSON file store**
- **Found during:** Task 1 verification
- **Issue:** `listJsonFiles<T>` used a generic type predicate that failed the local API TypeScript verification.
- **Fix:** Replaced the predicate filter with explicit accumulation so the helper returns a stable `T[]`.
- **Files modified:** `apps/local-api/src/persistence/fileStore.ts`
- **Verification:** `npm run typecheck --workspace @f1-modeling/local-api`
- **Commit:** `82fd8b4`
- **Knowledge:** KB consulted, no relevant entries.

**2. [Rule 3 - Blocking] Added explicit preset type guards in the shared domain registry**
- **Found during:** Task 1 verification
- **Issue:** Importing the node-only preset loader surfaced a shared narrowing bug in `groupPresetCatalog(...)`, which blocked the local API typecheck.
- **Fix:** Added preset-type guards before assigning documents into the typed regulation, session, and weather arrays.
- **Files modified:** `packages/domain/src/presets/registry.ts`
- **Verification:** `npm run typecheck --workspace @f1-modeling/local-api`
- **Commit:** `82fd8b4`
- **Knowledge:** KB consulted, no relevant entries.

**3. [Rule 3 - Blocking] Exposed the sim-core source entrypoint for workspace test resolution**
- **Found during:** Task 2 verification
- **Issue:** Vitest could not resolve `@f1-modeling/sim-core` because the package manifest only pointed at `dist`.
- **Fix:** Added a workspace-source export in `packages/sim-core/package.json` so the local API can import the placeholder harness without a prebuild step.
- **Files modified:** `packages/sim-core/package.json`
- **Verification:** `npm run test --workspace @f1-modeling/local-api -- --run`
- **Commit:** `c541569`
- **Knowledge:** KB consulted, no relevant entries.

**Total deviations:** 3 auto-fixed (`1` bug, `2` blocking).
**Impact:** Low. All fixes were small workspace-integration corrections discovered by the planned verification commands.

## Authentication Gates
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
Plan `01-08` can now build the interactive workspace against a real local API surface that exposes preset discovery, scenario persistence, and append-only run history through the shared Phase 1 contracts.

## Self-Check: PASSED
- Verified the summary file and claimed key files exist on disk.
- Verified task commits `82fd8b4` and `c541569` exist in git history.
