---
phase: 02-reduced-order-lap-model
verified: 2026-03-27T06:58:38Z
status: passed
score: 4/4 must-haves verified
re_verification: false
human_verification:
  - test: "Track map circuit outline shape recognition"
    expected: "Circuit outlines recognizable as Monza, Monaco, Silverstone when hand-authored x/y replaced with real data in Phase 2.1"
    why_human: "Known acknowledged gap: x/y coordinates are hand-authored and do not resemble real circuit shapes. The TrackMap component renders correctly with whatever data it receives, but the input data is geometrically wrong. Visual correctness of track shapes cannot be verified programmatically."
---

# Phase 02: Reduced-Order Lap Model Verification Report

**Phase Goal:** Deliver the first transparent lap model with editable vehicle and circuit parameters.
**Verified:** 2026-03-27T06:58:38Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can choose a circuit, regulation preset, and baseline car parameters before a run | VERIFIED | ScenarioEditor.tsx has circuit dropdown (line 177), PresetSelectors component (line 257), vehicle param grid (line 272); useWorkspace loads circuitCatalog from GET /api/circuits |
| 2 | System produces a lap estimate with visible intermediate factors rather than only a final score | VERIFIED | RunSummaryPanel.tsx renders SectorTable with per-sector times and limitingFactor labels (line 291–349), SpeedProfileTrace with regime coloring (line 615), AssumptionPanel (line 672); solveLap produces assumptions[] array (lapSolver.ts line 114) |
| 3 | Parameter changes show which parts of the model caused the output shift | VERIFIED | SensitivityWaterfall rendered in RunSummaryPanel.tsx (line 660) when comparisonRun is set; speed profile comparison overlay via comparisonProfile prop; waterfall decomposes per-sector time deltas with limitingFactor attribution |
| 4 | Where justified by the model, the system can visualize trajectories, track-map context, or racing-line style outputs without implying unsupported fidelity | VERIFIED (with known gap) | TrackMap.tsx renders SVG track outline with speed-colored hsl gradient (313 lines); provenance label always rendered (line 308); noSpatialData fallback to TrackContextPlaceholder (line ~130); known gap: x/y coordinates are hand-authored approximations (acknowledged, Phase 2.1 planned) |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Min Lines | Actual Lines | Status |
|----------|----------|-----------|--------------|--------|
| `packages/sim-core/src/lapModel/forwardBackward.ts` | Two-pass speed profile solver | 80 | 221 | VERIFIED |
| `packages/sim-core/src/lapModel/frictionEllipse.ts` | Grip/power/aero constraint computation | 40 | 114 | VERIFIED |
| `packages/sim-core/src/lapModel/lapSolver.ts` | Circuit + vehicle -> LapModelOutput orchestrator | 50 | 129 | VERIFIED |
| `packages/sim-core/src/lapModel/types.ts` | VehicleParams, CircuitLayout, LapModelOutput, SpeedProfilePoint, SectorResult | — | 101 | VERIFIED — all 5 types exported |
| `packages/sim-core/src/contracts.ts` | Discriminated union on harnessId supporting Phase 1 + Phase 2 | — | 69 | VERIFIED — Phase1PlaceholderSummary | LapModelSummary union |
| `packages/domain/src/circuits/schema.ts` | CircuitDocument Zod schema with curvature array, sectors, corners, provenance | — | exists | VERIFIED |
| `presets/circuits/monza.json` | Monza circuit preset with curvature array and x/y spatial coordinates | — | exists | VERIFIED |
| `presets/circuits/monaco.json` | Monaco circuit preset | — | exists | VERIFIED |
| `presets/circuits/silverstone.json` | Silverstone circuit preset | — | exists | VERIFIED |
| `apps/local-api/src/routes/circuits.ts` | GET /api/circuits endpoint | 15 | 21 | VERIFIED |
| `apps/local-api/src/services/runService.ts` | createLapModelRun with circuit loading, solver call, artifact creation | 60 | 258 | VERIFIED |
| `packages/domain/src/scenario/schema.ts` | Extended scenario schema with optional vehicleParams | — | exists | VERIFIED |
| `apps/web/src/features/scenario/ScenarioEditor.tsx` | Circuit selector and vehicle parameter inputs | 80 | 478 | VERIFIED |
| `packages/visuals/src/traces/SpeedProfileTrace.tsx` | SVG speed-vs-distance trace with regime coloring | 100 | 415 | VERIFIED |
| `packages/visuals/src/inspectors/SensitivityWaterfall.tsx` | SVG waterfall chart for per-sector time delta | 80 | 394 | VERIFIED |
| `packages/visuals/src/workspace/TrackMap.tsx` | SVG track outline with speed-colored overlay | 80 | 313 | VERIFIED |
| `apps/web/src/features/runs/RunSummaryPanel.tsx` | Run summary rendering lap model or placeholder output | 60 | 738 | VERIFIED |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `lapSolver.ts` | `forwardBackward.ts` | `import and call solveSpeedProfile` | WIRED | Line 9: import; line 69: call `solveSpeedProfile(layoutPoints, vehicle)` |
| `forwardBackward.ts` | `frictionEllipse.ts` | `computeCorneringSpeedLimit, maxAcceleration, maxDeceleration` | WIRED | Lines 15-17: import; lines 50, 80, 118: used in solver passes |
| `contracts.ts` | `phase1Placeholder.ts` | `phase1-placeholder harnessId still assignable` | WIRED | Phase1PlaceholderSummary type with `harnessId: "phase1-placeholder"` preserved at line 19 |
| `circuitCatalog.ts` | `circuits/schema.ts` | `validates loaded JSON against circuitDocumentSchema` | WIRED | Line 5: imports `circuitDocumentSchema`; line 27: `circuitDocumentSchema.safeParse(rawDocument)` |
| `runService.ts` | `lapSolver.ts` | `import solveLap, call with circuit + vehicle params` | WIRED | Line 17: import; line 203: `solveLap(circuit, vehicleParams)` |
| `runService.ts` | `circuitCatalog.ts` | `loadCircuitCatalogFromDisk to resolve circuit presets` | WIRED | Line 13: import; line 183: call to load circuits |
| `useWorkspace.ts` | `api.ts` | `createLapModelRun call` | WIRED | Line 11: import; line 181: `createLapModelRun(savedScenario.scenarioId)` |
| `ScenarioEditor.tsx` | `useWorkspace.ts` | `updateScenario with vehicleParams` | WIRED | Lines 296-302: `onScenarioChange` with `vehicleParams` spread |
| `RunSummaryPanel.tsx` | `SpeedProfileTrace.tsx` | `renders SpeedProfileTrace with speed profile data` | WIRED | Line 8: import; line 615: `<SpeedProfileTrace>` with profile data |
| `RunSummaryPanel.tsx` | `TrackMap.tsx` | `renders TrackMap when circuit has spatial coordinates` | WIRED | Line 9: import; lines 631, 646: `<TrackMap>` rendered |
| `RunSummaryPanel.tsx` | `SensitivityWaterfall.tsx` | `renders waterfall when comparison run selected` | WIRED | Line 7: import; line 660: `<SensitivityWaterfall>` under `comparisonRun && ...` guard |

Note: The plan key_link listed `App.tsx -> SensitivityWaterfall` but the actual implementation correctly placed this in `RunSummaryPanel.tsx`. This is a better architectural choice — the wiring to the goal is satisfied.

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| PLAT-02: User can choose circuit, regulation preset, weather preset, and session scenario | SATISFIED | Circuit selector populated from API; PresetSelectors component retained for regulation/weather/session presets |
| MODL-01: Reduced-order lap model with explicit inputs for mass, drag, downforce, tire grip, power-unit behavior, showing how corner speed, braking distance, acceleration emerge | SATISFIED (longitudinal) | QSS point-mass with friction ellipse; all 5 vehicle params exposed; sector times, speed profile, limiting factors shown. Lateral dynamics deferred to Phase 3 per plan |
| VISU-02: Trajectories or track-map views when model supports them without implying unsupported precision | SATISFIED | TrackMap with speed overlay; provenance label always rendered; known x/y geometry gap acknowledged and labeled |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|---------|--------|
| None | — | — | — |

No TODO/FIXME/placeholder comments in any Phase 2 files. No empty implementations. No stub handlers. No console.log-only implementations.

### Human Verification Required

#### 1. Track Map Circuit Shape Recognition

**Test:** After Phase 2.1 delivers real circuit geometry (TUMFTM or constrained-fit coordinates), verify that Monza, Monaco, and Silverstone outlines are visually recognizable when rendered by `TrackMap.tsx`.

**Expected:** Monza shows long straights with Parabolica and chicane shapes; Monaco shows the tight hairpin and tunnel; Silverstone shows the Maggotts/Becketts/Chapel complex and Hangar Straight.

**Why human:** The x/y coordinates in the current circuit presets are hand-authored approximations that do not produce recognizable track shapes (known gap documented in 02-03-SUMMARY.md). This cannot be resolved programmatically until Phase 2.1 provides real geometric data. The TrackMap component code is correct; the input data is geometrically wrong.

### Gaps Summary

No gaps blocking goal achievement. All four phase success criteria are satisfied by the codebase. The track map geometry issue is a data quality limitation (not a missing feature), is documented with an honest provenance label, and has a concrete resolution path (Phase 2.1 circuit geometry pipeline). This aligns with the phase guardrail: "No trajectory or racing-line display without spatial model support" — the current behavior shows the track outline with an honesty label rather than implying GPS accuracy.

---

## Test Results

All automated tests pass:
- `@f1-modeling/sim-core`: 27/27 tests (lap model end-to-end, sensitivity, backward compatibility, friction ellipse)
- `@f1-modeling/domain`: 20/20 tests
- `@f1-modeling/local-api`: 7/7 tests (circuit listing, placeholder run, lap model run)
- Typecheck: 0 errors across all 5 workspaces (sim-core, domain, local-api, web, visuals)

## Lap Time Accuracy

| Circuit | Model | Real | Error |
|---------|-------|------|-------|
| Monza | 86.1s | ~81s | +6.3% |
| Monaco | 80.0s | ~73s | +9.6% |
| Silverstone | 97.6s | ~89s | +9.7% |

All within the specified 5-15% QSS model error range for Phase 2.

---

_Verified: 2026-03-27T06:58:38Z_
_Verifier: Claude (gsdr-verifier)_
