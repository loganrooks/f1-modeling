---
phase: 03-tire-electrical-weather-environment-and-energy-dynamics
verified: 2026-04-03T05:29:02Z
status: gaps_found
score: 6/7 must-haves verified
gaps:
  - truth: "The user can compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation) and see their effect on lap time and energy state evolution"
    status: failed
    reason: "The web UI has no way to invoke a stint model run at all. apps/web/src/features/workspace/api.ts contains no createStintModelRun function, and no button or UI control in App.tsx triggers the stint-model harnessId. The SoCTrace component supports comparison overlays (comparisonData prop), but the user cannot reach a stint run through the browser. The API endpoint works and the model is correct, but the interactive user path is absent."
    artifacts:
      - path: "apps/web/src/features/workspace/api.ts"
        issue: "No createStintModelRun or equivalent function; only createLapModelRun and createPlaceholderRun exist"
      - path: "apps/web/src/app/App.tsx"
        issue: "No UI button or control to invoke stint-model harnessId; no policy selection UI"
    missing:
      - "A createStintModelRun API function in apps/web/src/features/workspace/api.ts that POSTs with harnessId: 'stint-model'"
      - "A UI control (button or scenario form field) in App.tsx or the ScenarioPanel to trigger a stint model run"
      - "A policy selection UI element (dropdown or toggle) so the user can choose aggressive vs conservative and compare results by running two stints"
---

# Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics — Verification Report

**Phase Goal:** Add the main non-ideal dynamics, reduced-order electrical subsystem behavior, and explicit car-environment coupling that shape stint evolution and regulation-era tradeoffs.
**Verified:** 2026-04-03T05:29:02Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Tire models include at least three dry compounds and one wet compound with distinct degradation curves, thermal operating windows, and cliff-effect behavior. Tire wear and temperature evolve over laps and affect pace. | VERIFIED | Four compound presets (soft-c5, medium-c3, hard-c1, intermediate-wet) with distinct peakGrip, baseWearRate, cliffThreshold, cliffSeverity, optimalTempLow/High parameters. tireModel.ts implements linear pre-cliff and quadratic post-cliff degradation with 0.3 floor. Thermal window parabolic factor with 0.5 floor. 12 unit tests in tireModel.test.ts all pass. 26 integration tests confirm compound comparison shows observable pace differences. |
| 2 | Electrical energy, harvesting, deployment, and limiting logic affect performance and can be inspected as subsystem states. The user can compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation) and see their effect on lap time and energy state evolution. | FAILED | The model and API are correct: two policies (DEFAULT_AGGRESSIVE_POLICY, DEFAULT_CONSERVATIVE_POLICY) exist, stintRunner wires electrical SoC per lap, SoCTrace renders it, and API tests confirm the endpoint works. But the web UI has no createStintModelRun API function, no button to trigger a stint-model run, and no policy selection control. A user at the browser cannot run the model or compare policies. |
| 3 | Weather and grip conditions evolve over time within a session — including transitions between dry and wet, track temperature changes, and surface rubber evolution — and affect strategy decisions dynamically rather than only as static initial conditions. | VERIFIED | environmentModel.ts implements interpolateWeatherAtLap (linear interpolation), surfaceGripFactor (1.0 - 0.45 * wetness, floor 0.55), rubberEvolutionFactor (buildup toward 1.05, rain washout above 0.3 wetness). Three weather presets with weatherTimeline arrays: dry-baseline (2 events), light-rain-placeholder (3 events), rain-transition (7 events). StintRunner replaces environment stub with real updateEnvironmentState. 16 environment unit tests pass. |
| 4 | Electrical state is visibly linked to strategy windows and policy constraints rather than treated as a hidden scalar. | VERIFIED | SoCTrace.tsx is a hand-rolled SVG line chart exported from @f1-modeling/visuals. RunSummaryPanel.tsx renders SoCTrace for stint-model runs from the electrical-state-trace artifact. The chart shows SoC in MJ per lap with hover tooltips showing deployed/harvested kJ. comparisonData prop supports policy overlay. The API produces electrical-state-trace artifacts with per-lap stateOfCharge, deployed, harvested fields. |
| 5 | Environment interaction is modeled as a coupling that influences multiple subsystems, not just as static scenario metadata. | VERIFIED | Environment state couples to tire grip via gripModifier (surfaceGripFactor * rubberEvolution multiplied into effectiveGrip in resolveEffectiveVehicle). Environment state also couples to electrical harvesting: updateElectricalState receives state.environmentState as 5th argument in stintRunner.ts line 213, activating the 1 - 0.2 * surfaceWetness penalty. Unit test in electricalModel.test.ts confirms wet harvest is approximately 86% of dry harvest at 0.7 wetness. Integration tests confirm both subsystems see different behavior under wet vs dry conditions. |
| 6 | Where regulation presets define aero-mode switching (e.g., DRS or 2026 active-aero states), the model reflects the discrete aero-state effect on drag and downforce rather than using a single static coefficient. | VERIFIED | aeroModel.ts implements resolveAeroPerPoint (per-point zone assignment) and computeAverageAeroFactors (distance-weighted average). fia-2026-baseline.json replaced qualitative placeholders with quantitative values: 55% drag reduction, 30% downforce reduction in Straight Mode. stintRunner.ts pre-computes aero points before the lap loop and applies average drag/downforce factors via resolveEffectiveVehicle. createStintModelRun uses findStraightZones heuristic to define active-aero zones from circuit curvature. |
| 7 | The model exposes at least basic lateral force balance and load transfer effects so that corner speed depends on more than a single grip scalar. | VERIFIED | loadTransfer.ts implements computeLoadSensitivityFactor (2-axle, exponent 0.85) and computeAverageLoadFactor (distance-weighted over speed profile). StintRunner calls computeAverageLoadFactor on the previous lap's speed profile and multiplies the result into effectiveGrip (line 99-100). At zero lateral G the factor returns 1.0; during cornering it returns < 1.0, reducing effective grip. grip composition is peakGrip * wearFactor * thermalFactor * envModifier * loadFactor. |

**Score:** 6/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/sim-core/src/stintModel/types.ts` | All Phase 3 stint types | VERIFIED | 258 lines. Exports TireCompoundParams, TireState, ElectricalState, ElectricalPolicy, EnvironmentState, WeatherTimeline, AeroModeConfig, LoadTransferParams, StintState, StintConfig, LapTrace, StintResult, DEFAULT_LOAD_TRANSFER_PARAMS |
| `packages/sim-core/src/stintModel/tireModel.ts` | Tire degradation, thermal window, cliff behavior | VERIFIED | Exports initializeTireState, tireWearGripFactor, tireThermalFactor, updateTireState. Cliff behavior implemented with quadratic post-cliff formula. Floor at 0.3. |
| `packages/sim-core/src/stintModel/loadTransfer.ts` | 2-axle weight transfer and load sensitivity | VERIFIED | Exports computeLoadSensitivityFactor (exponent 0.85), computeAverageLoadFactor, re-exports DEFAULT_LOAD_TRANSFER_PARAMS |
| `packages/sim-core/src/stintModel/stintRunner.ts` | Multi-lap iteration loop wrapping solveLap() | VERIFIED | runStint iterates N laps, calls solveLap, updates tire/electrical/environment/fuel state. Environment passed to electrical update. All stubs replaced. |
| `packages/sim-core/src/stintModel/electricalModel.ts` | Energy balance with SoC tracking, environment-aware harvesting | VERIFIED | Exports initializeElectricalState, estimateBrakingEnergy, updateElectricalState (optional EnvironmentState), computeElectricalPowerModifier, DEFAULT_AGGRESSIVE_POLICY, DEFAULT_CONSERVATIVE_POLICY |
| `packages/sim-core/src/stintModel/aeroModel.ts` | Per-point aero mode resolution | VERIFIED | Exports resolveAeroPerPoint, computeAverageAeroFactors, AeroResolvedPoint type |
| `packages/sim-core/src/stintModel/environmentModel.ts` | Weather evolution, surface grip, rubber buildup | VERIFIED | Exports interpolateWeatherAtLap, surfaceGripFactor, rubberEvolutionFactor, initializeEnvironmentState, updateEnvironmentState |
| `packages/sim-core/src/contracts.ts` | StintModelSummary in discriminated union | VERIFIED | StintModelSummary interface with harnessId: "stint-model". Union is LapModelSummary | Phase1PlaceholderSummary | StintModelSummary |
| `presets/tires/soft-c5.json` | Soft tire compound parameters | VERIFIED | peakGrip 1.85, cliffThreshold 0.70, distinct from medium/hard |
| `presets/tires/medium-c3.json` | Medium tire compound parameters | VERIFIED | peakGrip 1.70, cliffThreshold 0.80 |
| `presets/tires/hard-c1.json` | Hard tire compound parameters | VERIFIED | peakGrip 1.55, cliffThreshold 0.90 |
| `presets/tires/intermediate-wet.json` | Wet compound parameters | VERIFIED | peakGrip 1.40, optimalTempLow 50, wide low-temperature window |
| `presets/weather/rain-transition.json` | Dry-to-wet weather timeline | VERIFIED | 7 timeline events: dry start, rain onset at lap 15, full wet by lap 20, drying from lap 45 |
| `packages/domain/src/scenario/schema.ts` | Optional stintConfig field | VERIFIED | stintConfigSchema exported; stintConfig: stintConfigSchema.optional() added to scenarioDocumentSchema. Backward compatible. |
| `packages/visuals/src/traces/SoCTrace.tsx` | Hand-rolled SVG SoC-over-laps chart | VERIFIED | Substantive implementation. Primary line, gradient fill, comparison overlay (dashed), hover tooltip, legend. Matches SpeedProfileTrace styling. Exported from packages/visuals/src/index.ts. |
| `apps/local-api/src/services/runService.ts` | createStintModelRun service function | VERIFIED | Exports createStintModelRun. Loads tire compound presets, extracts weather timelines, resolves electrical policies, builds aero config from regulation preset, calls runStint, persists 4 artifact types. |
| `apps/local-api/src/routes/runs.ts` | stint-model harnessId dispatch | VERIFIED | harnessId enum includes "stint-model". Dispatch case routes to createStintModelRun. |
| `apps/web/src/features/workspace/api.ts` | createStintModelRun API function | MISSING | File contains only createLapModelRun and createPlaceholderRun. No stint model API function exists. |
| `apps/web/src/app/App.tsx` | UI trigger for stint model runs | MISSING | No button, dropdown, or control invokes the stint-model harnessId from the browser UI. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `stintRunner.ts` | `lapModel/lapSolver.ts` | solveLap() call per iteration | WIRED | Line 196: `const lapOutput: LapModelOutput = solveLap(config.circuit, effectiveVehicle)` |
| `stintRunner.ts` | `tireModel.ts` | updateTireState() per lap | WIRED | Lines 199-204 |
| `stintRunner.ts` | `loadTransfer.ts` | computeAverageLoadFactor() in resolveEffectiveVehicle | WIRED | Lines 98-100 |
| `stintRunner.ts` | `electricalModel.ts` | updateElectricalState() replaces stub | WIRED | Lines 208-214; passes state.environmentState as 5th arg |
| `stintRunner.ts` | `aeroModel.ts` | resolveAeroPerPoint() / computeAverageAeroFactors() | WIRED | Lines 172-178 (pre-computed before loop), applied via aeroFactors in resolveEffectiveVehicle |
| `stintRunner.ts` | `environmentModel.ts` | updateEnvironmentState() replaces stub | WIRED | Lines 217-221 |
| `updateElectricalState()` | EnvironmentState wetness penalty | state.environmentState passed as 5th arg | WIRED | Line 213 in stintRunner confirms environment coupling active |
| `RunSummaryPanel.tsx` | `SoCTrace.tsx` | SoCTrace rendered from electrical-state-trace artifact | WIRED | Line 854: `<SoCTrace data={socData} maxCapacity={4_000_000} label="Energy State of Charge" />` |
| `runService.ts` | `stintRunner.ts` | runStint() called from createStintModelRun | WIRED | Line 479: `const stintResult = runStint(stintRunConfig)` |
| `routes/runs.ts` | `runService.ts` | stint-model dispatch to createStintModelRun | WIRED | Lines 50-51: `else if (body.harnessId === "stint-model") { runRecord = await createStintModelRun(paths, body); }` |
| `apps/web/src/features/workspace/api.ts` | API POST /runs with stint-model | createStintModelRun client function | NOT_WIRED | No such function exists in the web API client |
| `App.tsx` or ScenarioPanel | createStintModelRun API function | UI button to run stint model | NOT_WIRED | No UI control triggers the stint-model harnessId from the browser |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| MODL-02: Tire wear and temperature state across laps and stints | SATISFIED | Tire model fully implemented with four compounds, degradation, thermal window, cliff behavior |
| MODL-03: Reduced-order electrical energy state, harvesting, deployment, limiting logic | SATISFIED | Electrical model fully implemented with SoC tracking, harvest cap, policy-driven deployment |
| MODL-04: Non-ideal conditions including dynamic weather evolution within a session | SATISFIED | Weather timeline model with interpolation, surface grip, rubber evolution |
| ENVR-01: Car-environment interaction explicitly modeled — grip evolution, surface state, ambient effects | SATISFIED | gripModifier couples environment to tire grip multiplicatively across multiple subsystems |
| ENVR-02: Environment coupled into subsystem behavior, not isolated presets | SATISFIED | Environment state passed to updateElectricalState (harvest penalty) and to updateTireState (thermal equilibrium) |
| ELEC-01: Electrical subsystem state variables as inspectable outputs | SATISFIED | SoCTrace renders SoC, deployed, harvested per lap; electrical-state-trace artifact carries full per-lap data |
| ELEC-02: Electrical state linked to strategy choices and driver-policy constraints | BLOCKED | The model links electrical state to policy correctly, but the user cannot reach this through the browser (no UI trigger for stint runs) |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `apps/web/src/features/workspace/api.ts` | — | Missing createStintModelRun function | BLOCKER | User cannot invoke the stint model from the browser at all |
| `apps/web/src/app/App.tsx` | — | No button/control for stint-model harnessId | BLOCKER | User cannot reach the SoCTrace visualization or policy comparison without writing API calls directly |
| `stintModel/types.ts` | 68, 87, 106 | Comment stubs say "filled by Plan 02/03" but Plans 02/03 have run | INFO | The stub comments are outdated but code is correct |

### Human Verification Required

No items require human verification for the automated checks. The gap (missing UI trigger) is fully verifiable in code and confirmed absent.

### Gaps Summary

Phase 3 implemented all seven required subsystems correctly at the model and API layer: tire compound differentiation with cliff behavior, electrical SoC tracking with policy-driven deployment, weather evolution with grip coupling, environment-to-electrical cross-subsystem coupling, aero-mode switching from regulation presets, and load transfer. 93 sim-core tests pass. 11 local-api tests pass. The typecheck is clean across all workspaces.

The single gap is at the user interface layer: success criterion 2 requires the user to "compare at least two energy-deployment policies and see their effect on lap time and energy state evolution." This is a user-observable requirement, not just a model requirement. The model supports it correctly, and the SoCTrace component even has a `comparisonData` prop for policy overlays. But there is no way for the user to invoke a stint model run from the browser. The web API client (`apps/web/src/features/workspace/api.ts`) has no `createStintModelRun` function. No button in the UI triggers the `stint-model` harnessId. The user cannot see SoCTrace, cannot select a policy, and cannot compare runs.

The fix is straightforward: add a `createStintModelRun` function to the web API client and add a UI control to invoke it. A minimal fix would be a "Run Stint Model" button alongside the existing "Run Lap Model" button, optionally with a policy dropdown. This is a UI wiring gap, not a model deficiency.

---

_Verified: 2026-04-03T05:29:02Z_
_Verifier: Claude (gsdr-verifier)_
