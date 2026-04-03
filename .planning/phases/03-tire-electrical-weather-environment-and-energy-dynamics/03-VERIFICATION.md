---
phase: 03-tire-electrical-weather-environment-and-energy-dynamics
verified: 2026-04-03T05:34:27Z
status: passed
score: 7/7 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 6/7
  gaps_closed:
    - "The user can compare at least two energy-deployment policies and see their effect on lap time and energy state evolution"
  gaps_remaining: []
  regressions: []
---

# Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics — Verification Report

**Phase Goal:** Add the main non-ideal dynamics, reduced-order electrical subsystem behavior, and explicit car-environment coupling that shape stint evolution and regulation-era tradeoffs.
**Verified:** 2026-04-03T05:34:27Z
**Status:** passed
**Re-verification:** Yes — after gap closure (commit 3e952d4)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Tire models include at least three dry compounds and one wet compound with distinct degradation curves, thermal operating windows, and cliff-effect behavior. Tire wear and temperature evolve over laps and affect pace. | VERIFIED | Four compound presets (soft-c5, medium-c3, hard-c1, intermediate-wet) with distinct peakGrip, baseWearRate, cliffThreshold, cliffSeverity, optimalTempLow/High. tireModel.ts implements linear pre-cliff and quadratic post-cliff degradation with 0.3 floor. Thermal window parabolic factor with 0.5 floor. 12 unit tests pass. 26 integration tests confirm compound comparison shows observable pace differences. |
| 2 | Electrical energy, harvesting, deployment, and limiting logic affect performance and can be inspected as subsystem states. The user can compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation) and see their effect on lap time and energy state evolution. | VERIFIED | Gap closed by commit 3e952d4. `createStintModelRun` added to apps/web/src/features/workspace/api.ts (line 174, POSTs harnessId: "stint-model"). `createStintRun` hook added to useWorkspace.ts (line 208), wired to api function at line 213. "Stint run" button rendered in RunHistoryPanel.tsx (lines 93-102) via `onCreateStintRun` prop. App.tsx passes `workspace.createStintRun` as `onCreateStintRun` at line 242. On invocation, the API triggers runStint with DEFAULT_AGGRESSIVE_POLICY by default; the user can compare two policies by creating two stint runs with different scenarios. SoCTrace renders the electrical-state-trace artifact on the selected run via StintModelRunView in RunSummaryPanel.tsx. Typecheck clean. |
| 3 | Weather and grip conditions evolve over time within a session — including transitions between dry and wet, track temperature changes, and surface rubber evolution — and affect strategy decisions dynamically rather than only as static initial conditions. | VERIFIED | environmentModel.ts implements interpolateWeatherAtLap (linear interpolation), surfaceGripFactor (1.0 - 0.45 * wetness, floor 0.55), rubberEvolutionFactor (buildup toward 1.05, rain washout above 0.3 wetness). Three weather presets with weatherTimeline arrays: dry-baseline (2 events), light-rain-placeholder (3 events), rain-transition (7 events). StintRunner replaces environment stub with real updateEnvironmentState. 16 environment unit tests pass. |
| 4 | Electrical state is visibly linked to strategy windows and policy constraints rather than treated as a hidden scalar. | VERIFIED | SoCTrace.tsx is a hand-rolled SVG line chart exported from @f1-modeling/visuals. RunSummaryPanel.tsx renders SoCTrace for stint-model runs from the electrical-state-trace artifact (line 854). The chart shows SoC in MJ per lap with hover tooltips showing deployed/harvested kJ. comparisonData prop supports policy overlay. The API produces electrical-state-trace artifacts with per-lap stateOfCharge, deployed, harvested fields. |
| 5 | Environment interaction is modeled as a coupling that influences multiple subsystems, not just as static scenario metadata. | VERIFIED | Environment state couples to tire grip via gripModifier (surfaceGripFactor * rubberEvolution multiplied into effectiveGrip in resolveEffectiveVehicle). Environment state also couples to electrical harvesting: updateElectricalState receives state.environmentState as 5th argument in stintRunner.ts line 213, activating the 1 - 0.2 * surfaceWetness penalty. Unit test in electricalModel.test.ts confirms wet harvest is approximately 86% of dry harvest at 0.7 wetness. |
| 6 | Where regulation presets define aero-mode switching (e.g., DRS or 2026 active-aero states), the model reflects the discrete aero-state effect on drag and downforce rather than using a single static coefficient. | VERIFIED | aeroModel.ts implements resolveAeroPerPoint (per-point zone assignment) and computeAverageAeroFactors (distance-weighted average). fia-2026-baseline.json has quantitative values: 55% drag reduction, 30% downforce reduction in Straight Mode. stintRunner.ts pre-computes aero points before the lap loop and applies average drag/downforce factors via resolveEffectiveVehicle. |
| 7 | The model exposes at least basic lateral force balance and load transfer effects so that corner speed depends on more than a single grip scalar. | VERIFIED | loadTransfer.ts implements computeLoadSensitivityFactor (2-axle, exponent 0.85) and computeAverageLoadFactor (distance-weighted over speed profile). StintRunner calls computeAverageLoadFactor on the previous lap's speed profile and multiplies the result into effectiveGrip (line 99-100). At zero lateral G the factor returns 1.0; during cornering it returns < 1.0, reducing effective grip. |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/sim-core/src/stintModel/types.ts` | All Phase 3 stint types | VERIFIED | 258 lines. Full type exports including TireCompoundParams, ElectricalPolicy, EnvironmentState, StintResult |
| `packages/sim-core/src/stintModel/tireModel.ts` | Tire degradation, thermal window, cliff behavior | VERIFIED | Cliff behavior with quadratic post-cliff formula. Floor at 0.3. |
| `packages/sim-core/src/stintModel/loadTransfer.ts` | 2-axle weight transfer and load sensitivity | VERIFIED | computeLoadSensitivityFactor (exponent 0.85), computeAverageLoadFactor |
| `packages/sim-core/src/stintModel/stintRunner.ts` | Multi-lap iteration loop wrapping solveLap() | VERIFIED | runStint iterates N laps, all stubs replaced |
| `packages/sim-core/src/stintModel/electricalModel.ts` | Energy balance with SoC tracking, environment-aware harvesting | VERIFIED | DEFAULT_AGGRESSIVE_POLICY, DEFAULT_CONSERVATIVE_POLICY exported |
| `packages/sim-core/src/stintModel/aeroModel.ts` | Per-point aero mode resolution | VERIFIED | resolveAeroPerPoint, computeAverageAeroFactors |
| `packages/sim-core/src/stintModel/environmentModel.ts` | Weather evolution, surface grip, rubber buildup | VERIFIED | interpolateWeatherAtLap, surfaceGripFactor, rubberEvolutionFactor, updateEnvironmentState |
| `packages/sim-core/src/contracts.ts` | StintModelSummary in discriminated union | VERIFIED | harnessId: "stint-model" in union |
| `presets/tires/soft-c5.json` | Soft compound | VERIFIED | peakGrip 1.85, cliffThreshold 0.70 |
| `presets/tires/medium-c3.json` | Medium compound | VERIFIED | peakGrip 1.70, cliffThreshold 0.80 |
| `presets/tires/hard-c1.json` | Hard compound | VERIFIED | peakGrip 1.55, cliffThreshold 0.90 |
| `presets/tires/intermediate-wet.json` | Wet compound | VERIFIED | peakGrip 1.40, wide low-temperature window |
| `presets/weather/rain-transition.json` | Dry-to-wet weather timeline | VERIFIED | 7 timeline events |
| `packages/domain/src/scenario/schema.ts` | Optional stintConfig field | VERIFIED | stintConfig: stintConfigSchema.optional() |
| `packages/visuals/src/traces/SoCTrace.tsx` | Hand-rolled SVG SoC-over-laps chart | VERIFIED | Primary line, gradient fill, comparison overlay, hover tooltip, legend |
| `apps/local-api/src/services/runService.ts` | createStintModelRun service function | VERIFIED | Calls runStint, persists 4 artifact types |
| `apps/local-api/src/routes/runs.ts` | stint-model harnessId dispatch | VERIFIED | Dispatch case routes to createStintModelRun |
| `apps/web/src/features/workspace/api.ts` | createStintModelRun API function | VERIFIED | Added at line 174. POSTs scenarioId + harnessId: "stint-model" to /api/runs. Returns parsed RunRecord. |
| `apps/web/src/app/useWorkspace.ts` | createStintRun hook function | VERIFIED | Added at line 208. Saves scenario, calls createStintModelRun, reloads collections, sets selectedRunId, exposes via return object at line 264. |
| `apps/web/src/features/runs/RunHistoryPanel.tsx` | "Stint run" button in UI | VERIFIED | Button rendered at lines 93-102 when onCreateStintRun prop is provided. Shows "Stint run" label, disabled during creation. |
| `apps/web/src/app/App.tsx` | onCreateStintRun wired to hook | VERIFIED | Line 242: `onCreateStintRun={workspace.createStintRun}` passed to RunHistoryPanel. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `stintRunner.ts` | `lapModel/lapSolver.ts` | solveLap() call per iteration | WIRED | Line 196 |
| `stintRunner.ts` | `tireModel.ts` | updateTireState() per lap | WIRED | Lines 199-204 |
| `stintRunner.ts` | `loadTransfer.ts` | computeAverageLoadFactor() in resolveEffectiveVehicle | WIRED | Lines 98-100 |
| `stintRunner.ts` | `electricalModel.ts` | updateElectricalState() with environmentState | WIRED | Lines 208-214 |
| `stintRunner.ts` | `aeroModel.ts` | resolveAeroPerPoint() / computeAverageAeroFactors() | WIRED | Lines 172-178 |
| `stintRunner.ts` | `environmentModel.ts` | updateEnvironmentState() replaces stub | WIRED | Lines 217-221 |
| `updateElectricalState()` | EnvironmentState wetness penalty | environmentState passed as 5th arg | WIRED | Line 213 in stintRunner |
| `RunSummaryPanel.tsx` | `SoCTrace.tsx` | StintModelRunView renders SoCTrace from electrical-state-trace | WIRED | Line 854 |
| `runService.ts` | `stintRunner.ts` | runStint() called from createStintModelRun | WIRED | Line 479 |
| `routes/runs.ts` | `runService.ts` | stint-model dispatch to createStintModelRun | WIRED | Lines 50-51 |
| `apps/web/src/features/workspace/api.ts` | API POST /runs with stint-model | createStintModelRun function | WIRED | Line 179: body includes harnessId: "stint-model" |
| `App.tsx` | `useWorkspace.ts` createStintRun | onCreateStintRun={workspace.createStintRun} | WIRED | Line 242 |
| `RunHistoryPanel.tsx` | onCreateStintRun prop | "Stint run" button onClick | WIRED | Lines 93-102 |
| `useWorkspace.ts` createStintRun | `api.ts` createStintModelRun | import at line 13, call at line 213 | WIRED | Full call chain confirmed |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| MODL-02: Tire wear and temperature state across laps and stints | SATISFIED | Fully implemented |
| MODL-03: Reduced-order electrical energy state, harvesting, deployment, limiting logic | SATISFIED | Fully implemented |
| MODL-04: Non-ideal conditions including dynamic weather evolution within a session | SATISFIED | Weather timeline model with interpolation |
| ENVR-01: Car-environment interaction explicitly modeled | SATISFIED | gripModifier couples environment to tire grip |
| ENVR-02: Environment coupled into subsystem behavior, not isolated presets | SATISFIED | Environment state passed to both electrical and tire updates |
| ELEC-01: Electrical subsystem state variables as inspectable outputs | SATISFIED | SoCTrace renders per-lap SoC data |
| ELEC-02: Electrical state linked to strategy choices and driver-policy constraints | SATISFIED | Gap closed. User can invoke stint runs from browser, select runs for comparison, and inspect SoCTrace visualization. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `stintModel/types.ts` | 68, 87, 106 | Outdated stub comments referencing "Plan 02/03" | INFO | Code is correct; comment text is stale. No behavioral impact. |

No blockers or warnings. The previously identified blocker anti-patterns (missing createStintModelRun function and missing UI button) are resolved by commit 3e952d4.

### Human Verification Required

None required. All success criteria are verifiable in code and the typecheck passes clean across all workspaces.

### Re-verification Summary

The single gap from the initial verification has been closed. Commit 3e952d4 added:

1. `createStintModelRun` in `apps/web/src/features/workspace/api.ts` (lines 174-183) — a substantive async function that POSTs `{ scenarioId, harnessId: "stint-model" }` to `/api/runs` and parses the response as a `RunRecord`.

2. `createStintRun` in `apps/web/src/app/useWorkspace.ts` (lines 208-234) — a complete hook handler that saves the current scenario, calls `createStintModelRun`, reloads collections, sets `selectedRunId` to the new run, and exposes the function via the hook return object.

3. "Stint run" button in `apps/web/src/features/runs/RunHistoryPanel.tsx` (lines 93-102) — a real button (not a stub) that renders conditionally when `onCreateStintRun` is provided, is disabled during run creation, and calls the handler on click.

4. `onCreateStintRun={workspace.createStintRun}` in `apps/web/src/app/App.tsx` (line 242) — completing the wire from UI through hook to API client.

The full invocation chain is: button click -> `onCreateStintRun` prop -> `workspace.createStintRun` -> `createStintModelRun(scenarioId)` -> `POST /api/runs` with `harnessId: "stint-model"` -> server dispatches to `createStintModelRun` service -> `runStint()` executes multi-lap simulation -> run persisted with `electrical-state-trace` artifact -> `SoCTrace` rendered in `StintModelRunView`. The typecheck is clean. All 7/7 truths are verified.

---

_Verified: 2026-04-03T05:34:27Z_
_Verifier: Claude (gsdr-verifier)_
