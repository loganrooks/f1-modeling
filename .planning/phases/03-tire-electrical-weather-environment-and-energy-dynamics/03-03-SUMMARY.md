---
phase: 03-tire-electrical-weather-environment-and-energy-dynamics
plan: 03
model: claude-opus-4-6
context_used_pct: 45
subsystem: sim-core/stintModel, local-api, web, domain, visuals
tags: [environment-model, weather-evolution, surface-grip, rubber-buildup, weather-electrical-coupling, stint-api, soc-trace, scenario-schema]
requires:
  - phase: 03-01
    provides: StintRunner loop with tire model, typed stubs for environment subsystem
  - phase: 03-02
    provides: Electrical model with optional EnvironmentState parameter, aero-mode switching
provides:
  - Dynamic weather evolution model (interpolation, surface grip, rubber buildup with rain washout)
  - Environment->electrical cross-subsystem coupling (wet harvest penalty active)
  - Stint model API endpoint (POST /api/runs with harnessId stint-model)
  - Optional stintConfig on scenario schema (backward compatible)
  - SoCTrace hand-rolled SVG visualization for electrical state
  - Three weather presets with evolution timelines (dry, light-rain, rain-transition)
  - StintModelRunView in browser workbench
affects: [sim-core, domain, visuals, web, local-api, presets]
tech-stack:
  added: []
  patterns: [deterministic-weather-timeline, multiplicative-grip-composition, cross-subsystem-coupling, hand-rolled-svg-traces]
key-files:
  created:
    - packages/sim-core/src/stintModel/environmentModel.ts
    - packages/visuals/src/traces/SoCTrace.tsx
    - presets/weather/rain-transition.json
  modified:
    - packages/sim-core/src/stintModel/stintRunner.ts
    - packages/sim-core/src/stintModel/index.ts
    - packages/sim-core/src/index.ts
    - packages/domain/src/scenario/schema.ts
    - packages/domain/src/index.ts
    - packages/domain/src/__tests__/documents.test.ts
    - packages/visuals/src/index.ts
    - apps/web/src/features/runs/RunSummaryPanel.tsx
    - apps/local-api/src/services/runService.ts
    - apps/local-api/src/routes/runs.ts
    - presets/weather/dry-baseline.json
    - presets/weather/light-rain-placeholder.json
key-decisions:
  - "Weather timeline uses deterministic linear interpolation between authored events (not stochastic)"
  - "Surface grip factor is piecewise linear: 1.0 - 0.45 * surfaceWetness, floored at 0.55"
  - "Rubber evolution starts at 0.95 (green track) with diminishing buildup toward 1.05 and rain washout above 0.3 wetness"
  - "Environment->electrical coupling passes EnvironmentState to updateElectricalState for wet harvest penalty"
  - "stintConfig on scenario is optional to preserve backward compatibility with all existing scenarios"
  - "Stint API includes four artifact types: stint-trace, tire-degradation-trace, electrical-state-trace, weather-evolution-trace"
  - "Straight-mode zone heuristic finds longest contiguous low-curvature section for aero config"
duration: 9min
completed: 2026-04-03
---

# Phase 3 Plan 03: Environment & Weather Coupling, Stint API, SoC Visualization Summary

**Dynamic weather evolution with grip/rubber/rain-washout coupling, cross-subsystem environment->electrical wiring, stint model API integration, scenario schema extension, and SoC-over-laps trace visualization**

## Performance
- **Duration:** 9min
- **Tasks:** 2/2 completed
- **Files created:** 3
- **Files modified:** 13

## Accomplishments
- Implemented the environment model with five pure functions: interpolateWeatherAtLap (linear between timeline events), surfaceGripFactor (piecewise linear wetness->grip), rubberEvolutionFactor (buildup with rain washout), initializeEnvironmentState, updateEnvironmentState
- Replaced the StintRunner environment identity stub with real per-lap weather evolution: track temperature, surface wetness, rubber buildup, and composite gripModifier all evolve dynamically from the weather timeline
- Wired environment->electrical cross-subsystem coupling: updateElectricalState now receives the real EnvironmentState, activating the wet harvest penalty (1 - 0.2 * surfaceWetness) implemented in Plan 02
- Updated three weather presets with evolution timelines: dry-baseline (slight temperature drop), light-rain-placeholder (increasing then decreasing wetness), rain-transition (dry-to-wet-to-dry scenario with 7 timeline events)
- Extended scenario schema with optional stintConfig (totalLaps, tireCompoundId, electricalPolicyId, weatherPresetOverride) -- fully backward compatible
- Implemented createStintModelRun API service: loads tire compound presets, extracts weather timelines, resolves electrical policies, builds aero config from regulation preset, runs stint model, persists run record with 4 artifact types
- Added stint-model harnessId dispatch to POST /api/runs route
- Created SoCTrace hand-rolled SVG component matching SpeedProfileTrace visual styling (gradient fill, hover tooltip, comparison overlay, legend)
- Added StintModelRunView to RunSummaryPanel: lap times, metadata, SoCTrace, and model assumptions
- All 54 passing tests green (27 sim-core, 20 domain, 7 local-api); full monorepo typecheck clean

## Task Commits
1. **Task 1: Implement environment model, wire into StintRunner with electrical coupling, and create weather presets** - `c2ab077`
2. **Task 2: Extend scenario schema, wire stint model into API, and add SoC trace visualization** - `7ef86a7`

## Files Created/Modified
- `packages/sim-core/src/stintModel/environmentModel.ts` - Five pure functions: interpolateWeatherAtLap, surfaceGripFactor, rubberEvolutionFactor, initializeEnvironmentState, updateEnvironmentState
- `packages/sim-core/src/stintModel/stintRunner.ts` - Environment stub replaced with real weather evolution; environmentState passed to updateElectricalState; assumptions updated
- `packages/sim-core/src/stintModel/index.ts` - Added environment model re-exports
- `packages/sim-core/src/index.ts` - Added environment model and electrical policy exports
- `packages/domain/src/scenario/schema.ts` - Added stintConfigSchema with optional stintConfig on scenarioDocumentSchema
- `packages/domain/src/index.ts` - Re-exports stintConfigSchema and StintConfig type
- `packages/domain/src/__tests__/documents.test.ts` - Updated preset count (5->6) and weather preset list for rain-transition
- `packages/visuals/src/traces/SoCTrace.tsx` - Hand-rolled SVG SoC-over-laps line chart with gradient fill, hover tooltip, comparison overlay
- `packages/visuals/src/index.ts` - Added SoCTrace export
- `apps/web/src/features/runs/RunSummaryPanel.tsx` - Added StintModelRunView with SoCTrace, lap times, metadata, assumptions; harness dispatch for stint-model
- `apps/local-api/src/services/runService.ts` - createStintModelRun: tire compound loading, weather timeline extraction, aero zone heuristics, four artifact types
- `apps/local-api/src/routes/runs.ts` - stint-model harnessId dispatch added to POST /api/runs
- `presets/weather/dry-baseline.json` - Updated with weatherTimeline (2 events, stable dry)
- `presets/weather/light-rain-placeholder.json` - Updated with weatherTimeline (3 events, light rain profile)
- `presets/weather/rain-transition.json` - New: 7-event dry->wet->dry transition scenario

## Decisions & Deviations

### Decisions Made
1. **Weather interpolation:** Deterministic linear interpolation between timeline events. Before first event uses first values; after last uses last values. Handles sub-lap precision per RESEARCH.md Pitfall 4.
2. **Surface grip function:** Piecewise linear 1.0 - 0.45 * surfaceWetness, floored at 0.55. Simple, predictable, and sufficient for educational modeling.
3. **Rubber evolution:** Starts at 0.95 (green track), builds toward 1.05 with diminishing returns, washes out when wetness > 0.3. Clamped [0.90, 1.05].
4. **Scenario backward compatibility:** stintConfig is optional on the scenario schema. All existing scenarios continue to validate without modification.
5. **Stint API artifacts:** Four artifact types provide full inspectability: stint-trace (full state), tire-degradation-trace, electrical-state-trace (feeds SoCTrace), weather-evolution-trace.
6. **Aero zone heuristic:** Finds longest contiguous low-curvature section as a straight-mode zone. Adequate for current phase; circuit-specific zone metadata deferred to future phase.

### Deviations from Plan

**1. [Rule 3 - Blocking] Updated domain test preset counts for rain-transition**
- **Found during:** Task 1 (test verification)
- **Issue:** Adding rain-transition.json caused domain tests to fail: hardcoded preset count (5->6) and weather preset list did not include the new preset.
- **Fix:** Updated `documents.test.ts` to expect 6 presets and include "rain-transition" in the weather preset list.
- **Files modified:** packages/domain/src/__tests__/documents.test.ts
- **Commit:** c2ab077

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 04 (integration tests) can now test the full stint model pipeline: environment evolution, tire degradation, electrical SoC, and weather coupling
- All four artifact types are available for inspection and testing
- The API endpoint is ready to serve stint model runs from the browser
- Weather presets provide three distinct testing scenarios (dry, light rain, rain transition)

## Self-Check: PASSED
