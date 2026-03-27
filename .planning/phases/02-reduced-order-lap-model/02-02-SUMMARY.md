---
phase: 02-reduced-order-lap-model
plan: 02
model: claude-opus-4-6
context_used_pct: 52
subsystem: local-api, web, domain
tags: [api-wiring, circuit-selector, vehicle-params, lap-model-integration, run-routing]
requires:
  - phase: 02-reduced-order-lap-model
    provides: "QSS lap solver, circuit presets, VehicleParams, DEFAULT_VEHICLE_PARAMS, CircuitDocument schema, circuit catalog loader"
provides:
  - "GET /api/circuits endpoint returning available circuit documents"
  - "createLapModelRun API service that loads circuit, runs QSS solver, persists run record"
  - "POST /api/runs harnessId-based routing between lap model and Phase 1 placeholder"
  - "vehicleParamsSchema on scenario document (optional, backward compatible)"
  - "Browser circuit selector dropdown populated from API"
  - "Browser vehicle parameter editor with number inputs and provenance labels"
  - "Browser createRun auto-routing between lap model and placeholder based on scenario state"
affects: [02-03, apps/web, apps/local-api]
tech-stack:
  added: []
  patterns: [harness-id-routing, fallback-run-strategy, circuit-catalog-api, vehicle-param-editor]
key-files:
  created:
    - apps/local-api/src/routes/circuits.ts
  modified:
    - packages/domain/src/scenario/schema.ts
    - packages/domain/src/scenario/defaultScenario.ts
    - packages/domain/src/index.ts
    - apps/local-api/src/app.ts
    - apps/local-api/src/routes/runs.ts
    - apps/local-api/src/services/runService.ts
    - apps/local-api/src/__tests__/workspaceRoutes.test.ts
    - apps/web/src/features/workspace/api.ts
    - apps/web/src/app/useWorkspace.ts
    - apps/web/src/features/scenario/ScenarioEditor.tsx
    - apps/web/src/app/App.tsx
key-decisions:
  - "Default scenario circuit changed from silverstone-gp to monza to match available circuit presets"
  - "Run route uses harnessId-based explicit routing with fallback: no harnessId tries lap model then falls back to placeholder on RunDependencyError"
  - "Speed profile stored sampled (every 10th point) in summaryMetrics, full profile in artifact data"
  - "createPlaceholderRun API call now explicitly passes harnessId: phase1-placeholder for clarity"
patterns-established:
  - "HarnessId routing: POST /api/runs accepts optional harnessId to select run strategy"
  - "Fallback run strategy: when no harnessId, attempt lap model; fall back to placeholder if circuit not found"
  - "Circuit catalog API: GET /api/circuits loads validated CircuitDocument[] from presets/circuits/"
  - "Vehicle param editor: number inputs with step/min constraints and provenance labels"
duration: 9min
completed: 2026-03-27
---

# Phase 02 Plan 02: API and Browser Wiring Summary

**End-to-end QSS lap model integration: circuit selector, vehicle parameter editor, run routing, and API wiring connecting the solver to the browser workspace**

## Performance
- **Duration:** 9min
- **Tasks:** 2/2
- **Files modified:** 12

## Accomplishments
- Extended scenario schema with optional vehicleParams field (backward compatible with Phase 1 scenarios)
- Created GET /api/circuits endpoint that serves validated circuit documents from disk
- Built createLapModelRun service that loads circuit, resolves vehicle params, calls solveLap, stores sampled speed profile in summaryMetrics and full profile in artifact
- Updated POST /api/runs route with harnessId-based routing: explicit "qss-lap-model" or "phase1-placeholder", plus fallback logic for unspecified harnessId
- Added browser circuit selector dropdown populated from the circuits API, replacing free-text circuit inputs
- Added vehicle parameter number input grid with labeled fields, step constraints, and 2026 FIA baseline provenance labels
- Updated useWorkspace createRun to auto-detect lap model eligibility (has vehicleParams + matching circuitId in catalog)
- Added "Add vehicle parameters (use 2026 defaults)" button for Phase 1 scenarios without vehicleParams
- All 54 tests pass across domain (20), sim-core (27), and local-api (7) workspaces
- Web workspace typechecks and builds cleanly

## Task Commits
1. **Task 1: Extend domain schemas and API to support the lap model** - `eb07711`
2. **Task 2: Extend the browser workspace with circuit selection and vehicle parameter editing** - `38c411d`

## Files Created/Modified
- `apps/local-api/src/routes/circuits.ts` - New GET /api/circuits endpoint serving circuit catalog
- `packages/domain/src/scenario/schema.ts` - Added vehicleParamsSchema as optional field on scenarioDocumentSchema
- `packages/domain/src/scenario/defaultScenario.ts` - Default scenario now includes vehicleParams and uses monza circuitId
- `packages/domain/src/index.ts` - Exports vehicleParamsSchema and VehicleParamsInput type
- `apps/local-api/src/app.ts` - Registers circuit route handler
- `apps/local-api/src/routes/runs.ts` - HarnessId-based run routing with fallback
- `apps/local-api/src/services/runService.ts` - createLapModelRun function with circuit loading, solver call, artifact creation
- `apps/local-api/src/__tests__/workspaceRoutes.test.ts` - Added circuit listing, placeholder run, and lap model run test cases
- `apps/web/src/features/workspace/api.ts` - fetchCircuitCatalog and createLapModelRun API functions
- `apps/web/src/app/useWorkspace.ts` - Circuit catalog state, lap model run auto-detection, circuitCatalog in return
- `apps/web/src/features/scenario/ScenarioEditor.tsx` - Circuit dropdown selector, vehicle parameter editor grid
- `apps/web/src/app/App.tsx` - Passes circuitCatalog prop, updated model labels for QSS runs

## Decisions & Deviations

### Decisions Made
- **Default circuit changed to monza:** The Phase 1 default used "silverstone-gp" but circuit presets use "silverstone". Changed default to "monza" as the plan specified, ensuring the default scenario has a valid circuit for the lap model.
- **HarnessId-based routing with fallback:** When POST /api/runs receives no harnessId, the route attempts the lap model first. If it fails with RunDependencyError (e.g., circuit not found), it falls back to Phase 1 placeholder. This ensures backward compatibility for scenarios with non-catalog circuit IDs.
- **Explicit placeholder harnessId in browser:** Updated createPlaceholderRun to explicitly send `harnessId: "phase1-placeholder"` instead of relying on server defaults, making the intent unambiguous.
- **Sampled speed profile in summaryMetrics:** Every 10th point plus the last point stored in summaryMetrics for quick display; full profile stored in the artifact data field.

### Deviations from Plan

**1. [Rule 1 - Bug] Default scenario circuitId mismatch**
- **Found during:** Task 1
- **Issue:** Default scenario used circuitId "silverstone-gp" but circuit presets use "silverstone" without the "-gp" suffix, which would cause RunDependencyError for all default scenarios
- **Fix:** Changed default circuitId to "monza" as specified in the plan, and used the fallback routing strategy so legacy scenarios with non-catalog IDs still produce placeholder runs
- **Files modified:** packages/domain/src/scenario/defaultScenario.ts, apps/local-api/src/routes/runs.ts
- **Commit:** eb07711

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- End-to-end flow complete: edit vehicle params, select circuit, create run, receive lap model result
- Speed profile data available in run records for visualization (plan 02-03)
- Sector results available for display in run summary panels
- Circuit selector and vehicle param editor ready for progressive enhancement
- Phase 1 backward compatibility preserved: old scenarios still produce placeholder runs

## Self-Check: PASSED
- All 13 key files verified present on disk
- Both task commits (eb07711, 38c411d) verified in git log
