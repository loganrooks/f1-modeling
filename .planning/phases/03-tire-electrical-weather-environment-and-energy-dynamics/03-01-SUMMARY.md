---
phase: 03-tire-electrical-weather-environment-and-energy-dynamics
plan: 01
model: claude-opus-4-6
context_used_pct: 32
subsystem: sim-core/stintModel
tags: [tire-model, load-transfer, stint-runner, multi-lap-simulation, tire-presets]
requires:
  - phase: 02-reduced-order-lap-model
    provides: QSS solveLap() single-lap solver, VehicleParams, LapModelOutput, SimulationRunSummary union
provides:
  - StintRunner multi-lap simulation loop wrapping solveLap()
  - Phenomenological tire degradation model with compound-specific curves and cliff behavior
  - Tire thermal window model with parabolic grip penalty outside optimal range
  - 2-axle load transfer model with tire load sensitivity (exponent 0.85)
  - Four tire compound presets (soft/medium/hard/intermediate) with provenance labels
  - StintModelSummary harness type in discriminated union
  - Typed stubs for electrical and environment subsystems (Plans 02/03)
affects: [sim-core, contracts, presets]
tech-stack:
  added: []
  patterns: [lap-wise-discretization, multiplicative-grip-composition, pure-state-machine-subsystems, 10pct-grip-clamp, 0.4-grip-floor]
key-files:
  created:
    - packages/sim-core/src/stintModel/types.ts
    - packages/sim-core/src/stintModel/tireModel.ts
    - packages/sim-core/src/stintModel/loadTransfer.ts
    - packages/sim-core/src/stintModel/stintRunner.ts
    - packages/sim-core/src/stintModel/index.ts
    - presets/tires/soft-c5.json
    - presets/tires/medium-c3.json
    - presets/tires/hard-c1.json
    - presets/tires/intermediate-wet.json
  modified:
    - packages/sim-core/src/contracts.ts
    - packages/sim-core/src/index.ts
key-decisions:
  - "Tire wear uses linear pre-cliff + quadratic post-cliff degradation with 0.3 grip floor to prevent solver collapse"
  - "Load transfer computed as distance-weighted average over previous lap profile rather than per-point during solve"
  - "10% per-lap grip clamp enforced in resolveEffectiveVehicle, not in tire model, to preserve model purity"
  - "Fuel mass reduction modeled at 1.5 kg/lap with 95% minimum mass floor"
patterns-established:
  - "Lap-wise discretization: StintRunner wraps QSS solver in N-lap loop with state updates at lap boundaries"
  - "Multiplicative grip composition: peakGrip * wearFactor * thermalFactor * envModifier * loadFactor"
  - "Pure state machine subsystems: each model is (prevState, lapResult) => newState with no side effects"
  - "Stub-then-fill: electrical and environment slots typed and stubbed with identity functions for parallel plan development"
duration: 5min
completed: 2026-04-03
---

# Phase 3 Plan 01: Stint Model Foundation Summary

**Multi-lap StintRunner with phenomenological tire degradation, thermal window, cliff behavior, 2-axle load transfer, and four compound presets**

## Performance
- **Duration:** 5min
- **Tasks:** 2/2 completed
- **Files created:** 9
- **Files modified:** 2

## Accomplishments
- Built the core stint simulation spine: StintRunner iterates N laps calling the existing QSS solveLap() with evolving vehicle parameters
- Implemented phenomenological tire model with compound-specific wear curves (linear pre-cliff, quadratic post-cliff), thermal window (parabolic grip penalty), and cliff behavior
- Added 2-axle load transfer model computing distance-weighted average grip penalty from tire load sensitivity
- Created four tire compound presets (soft C5, medium C3, hard C1, intermediate wet) with engineering-inference provenance and preset document envelope
- Extended SimulationRunSummary discriminated union with StintModelSummary (harnessId: "stint-model")
- Typed electrical and environment state slots for Plans 02 and 03 to fill independently
- All 34 existing tests pass (27 sim-core, 7 local-api); full monorepo typecheck clean

## Task Commits
1. **Task 1: Create stint model types, tire model, load transfer, and tire compound presets** - `f141081`
2. **Task 2: Create StintRunner loop, extend contracts, and wire exports** - `b47f39b`

## Files Created/Modified
- `packages/sim-core/src/stintModel/types.ts` - All Phase 3 stint types: TireState, ElectricalState, EnvironmentState, StintState, StintConfig, StintResult, LapTrace, compound/aero/load types
- `packages/sim-core/src/stintModel/tireModel.ts` - Pure functions: initializeTireState, tireWearGripFactor, tireThermalFactor, updateTireState
- `packages/sim-core/src/stintModel/loadTransfer.ts` - computeLoadSensitivityFactor (per-point) and computeAverageLoadFactor (lap-level)
- `packages/sim-core/src/stintModel/stintRunner.ts` - initializeStintState, resolveEffectiveVehicle, runStint (main loop)
- `packages/sim-core/src/stintModel/index.ts` - Barrel exports for all stint model types and functions
- `presets/tires/soft-c5.json` - Soft compound: peakGrip 1.85, cliff at 70% wear
- `presets/tires/medium-c3.json` - Medium compound: peakGrip 1.70, cliff at 80% wear
- `presets/tires/hard-c1.json` - Hard compound: peakGrip 1.55, cliff at 90% wear
- `presets/tires/intermediate-wet.json` - Intermediate: peakGrip 1.40, wide low-temp thermal window
- `packages/sim-core/src/contracts.ts` - Added StintModelSummary to discriminated union
- `packages/sim-core/src/index.ts` - Re-exports all stint model types and functions

## Decisions & Deviations

### Decisions Made
1. **Grip clamp location:** The 10% per-lap grip change clamp is enforced in `resolveEffectiveVehicle` rather than inside the tire model, preserving model purity (tire model reports actual physical state; runner applies solver-stability constraints)
2. **Load factor averaging:** Load transfer computed as distance-weighted average over the *previous* lap's speed profile (no profile available for first lap, uses 1.0)
3. **Fuel model simplicity:** 1.5 kg/lap constant consumption with 95% minimum mass floor; adequate for Phase 3 educational scope
4. **Pre-existing web test failures:** 2 tests in apps/web fail identically on clean HEAD (API mock issues); not caused by this plan

### Deviations from Plan
None - plan executed exactly as written.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- StintRunner is ready for Plan 02 (electrical/aero subsystems) to replace the identity stubs with real `updateElectricalState()` and aero mode logic
- Environment state stub is ready for Plan 03 (weather coupling) to replace with `updateEnvironmentState()`
- Types for all subsystems are defined and exported; Plans 02-04 can import and use them immediately
- All four tire compound presets are loadable via the existing preset catalog infrastructure

## Self-Check: PASSED
- All 11 files verified present on disk
- Both task commits (f141081, b47f39b) verified in git log
