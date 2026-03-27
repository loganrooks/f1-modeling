---
phase: 02-reduced-order-lap-model
plan: 01
model: claude-opus-4-6
context_used_pct: 45
subsystem: sim-core
tags: [qss-lap-model, forward-backward-solver, friction-ellipse, circuit-schema, curvature-array]
requires:
  - phase: 01-foundations-and-scenario-schema
    provides: "sim-core contracts, domain schema patterns, preset system, Zod validation"
provides:
  - "QSS forward-backward speed profile solver with lap closure"
  - "Friction ellipse constraint functions (Lenzo & Rossi 2020)"
  - "CircuitDocument Zod schema with curvature array, sectors, corners"
  - "Three circuit presets: Monza, Monaco, Silverstone"
  - "Generalized SimulationRunSummary discriminated union"
  - "VehicleParams and DEFAULT_VEHICLE_PARAMS"
  - "Circuit catalog disk loader"
affects: [02-02, 02-03, apps/local-api, apps/web]
tech-stack:
  added: []
  patterns: [forward-backward-envelope, friction-ellipse, circuit-curvature-array, discriminated-union-contracts]
key-files:
  created:
    - packages/sim-core/src/lapModel/forwardBackward.ts
    - packages/sim-core/src/lapModel/frictionEllipse.ts
    - packages/sim-core/src/lapModel/lapSolver.ts
    - packages/sim-core/src/lapModel/types.ts
    - packages/sim-core/src/lapModel/index.ts
    - packages/domain/src/circuits/schema.ts
    - packages/domain/src/circuits/registry.ts
    - packages/domain/src/circuits/index.ts
    - packages/domain/src/node/circuitCatalog.ts
    - packages/sim-core/src/__tests__/lapModel.test.ts
    - presets/circuits/monza.json
    - presets/circuits/monaco.json
    - presets/circuits/silverstone.json
    - scripts/generate-circuits.ts
  modified:
    - packages/sim-core/src/contracts.ts
    - packages/sim-core/src/phase1Placeholder.ts
    - packages/sim-core/src/index.ts
    - packages/domain/src/common/schemaVersion.ts
    - packages/domain/src/index.ts
    - packages/domain/package.json
    - packages/sim-core/package.json
    - package-lock.json
key-decisions:
  - "sim-core now depends on @f1-modeling/domain for CircuitDocument type in lapSolver"
  - "Circuit presets generated via TypeScript script with curvature integration for x/y coordinates"
  - "Forward-backward solver uses iterative lap closure (up to 3 iterations) for closed-loop consistency"
patterns-established:
  - "Forward-backward envelope: two-pass global envelope with Float64Array for performance"
  - "Friction ellipse: closed-form speed-dependent grip quadratic (no iteration needed)"
  - "Circuit curvature array: 5m spacing with smooth sine transitions at corner entry/exit"
  - "Contract generalization: discriminated union on harnessId for multi-model support"
duration: 14min
completed: 2026-03-26
---

# Phase 02 Plan 01: Lap Solver Foundation Summary

**QSS forward-backward lap model with friction ellipse constraints, three circuit presets, and generalized sim-core contracts**

## Performance
- **Duration:** 14min
- **Tasks:** 2/2
- **Files modified:** 22

## Accomplishments
- Built complete QSS point-mass lap solver based on Lenzo & Rossi 2020 equations
- Implemented friction ellipse with speed-dependent grip (closed-form quadratic, no iteration)
- Forward-backward solver with iterative lap closure produces plausible speed profiles
- Created CircuitDocument Zod schema with curvature arrays, spatial coordinates, sectors, corners
- Generated three circuit presets with realistic geometry: Monza (5785m, 1157 pts), Monaco (3305m, 661 pts), Silverstone (5840m, 1168 pts)
- Generalized sim-core contracts to discriminated union supporting Phase 1 placeholder + Phase 2 lap model
- All 27 model tests pass including end-to-end, sensitivity, and backward compatibility

## Lap Time Results
| Circuit | Model | Real | Error |
|---------|-------|------|-------|
| Monza | 86.1s | ~81s | +6.3% |
| Monaco | 80.0s | ~73s | +9.6% |
| Silverstone | 97.6s | ~89s | +9.7% |

All within the expected 5-15% QSS model error range.

## Task Commits
1. **Task 1: Circuit schema, vehicle params, and forward-backward lap solver** - `d8d0584`
2. **Task 2: Contract generalization, circuit presets, and model tests** - `934f473`

## Files Created/Modified
- `packages/sim-core/src/lapModel/forwardBackward.ts` - Two-pass speed profile solver with lap closure
- `packages/sim-core/src/lapModel/frictionEllipse.ts` - Cornering speed limit, max acceleration/deceleration
- `packages/sim-core/src/lapModel/lapSolver.ts` - Orchestrator: circuit + vehicle -> LapModelOutput
- `packages/sim-core/src/lapModel/types.ts` - VehicleParams, SpeedProfilePoint, SectorResult, LapModelOutput
- `packages/sim-core/src/contracts.ts` - Generalized discriminated union (Phase1PlaceholderSummary | LapModelSummary)
- `packages/domain/src/circuits/schema.ts` - CircuitDocument Zod schema
- `packages/domain/src/circuits/registry.ts` - Circuit catalog grouping and lookup
- `packages/domain/src/node/circuitCatalog.ts` - Node-only circuit JSON loader
- `presets/circuits/monza.json` - Monza circuit preset (1157 points, 11 corners, 3 sectors)
- `presets/circuits/monaco.json` - Monaco circuit preset (661 points, 15 corners, 3 sectors)
- `presets/circuits/silverstone.json` - Silverstone circuit preset (1168 points, 17 corners, 3 sectors)
- `packages/sim-core/src/__tests__/lapModel.test.ts` - 27 tests covering all solver components
- `scripts/generate-circuits.ts` - Circuit generation script for reproducibility

## Decisions & Deviations

### Decisions Made
- **sim-core -> domain dependency:** Added @f1-modeling/domain as a workspace dependency for sim-core so lapSolver can import CircuitDocument type directly.
- **Circuit generation script:** Created scripts/generate-circuits.ts rather than hand-writing JSON, enabling reproducible circuit updates and consistent x/y coordinate derivation.
- **Iterative lap closure:** Forward-backward solver performs up to 3 iterations to converge start/finish speed consistency (0.1 m/s threshold). In practice, 2 iterations suffice.

### Deviations from Plan

**1. [Rule 3 - Blocking] Added sim-core dependency on @f1-modeling/domain**
- **Found during:** Task 1
- **Issue:** lapSolver.ts imports CircuitDocument from @f1-modeling/domain, but sim-core had no dependency on domain
- **Fix:** Added `"@f1-modeling/domain": "*"` to sim-core/package.json and ran npm install
- **Files modified:** packages/sim-core/package.json, package-lock.json
- **Commit:** d8d0584

**2. [Rule 3 - Blocking] Fixed test path resolution for circuit presets**
- **Found during:** Task 2
- **Issue:** Tests used process.cwd() which resolved to sim-core directory, not repo root where presets live
- **Fix:** Used import.meta.dirname with relative path navigation to locate repo root
- **Files modified:** packages/sim-core/src/__tests__/lapModel.test.ts
- **Commit:** 934f473

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Lap solver produces complete LapModelOutput ready for API integration (plan 02-02)
- SpeedProfilePoint array ready for visualization (plan 02-03)
- Circuit presets loadable from disk for API endpoints
- SectorResult array ready for sector time display
- VehicleParams interface ready for parameter editor UI
- DEFAULT_VEHICLE_PARAMS available for initial defaults
- Generalized contracts support both placeholder and lap model run summaries

## Self-Check: PASSED
- All 14 created files verified present on disk
- Both task commits (d8d0584, 934f473) verified in git log
