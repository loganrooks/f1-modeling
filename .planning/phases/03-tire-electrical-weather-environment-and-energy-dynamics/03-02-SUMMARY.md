---
phase: 03-tire-electrical-weather-environment-and-energy-dynamics
plan: 02
model: claude-opus-4-6
context_used_pct: 28
subsystem: sim-core/stintModel
tags: [electrical-model, aero-mode, soc-tracking, energy-balance, deployment-policy, 2026-regulations]
requires:
  - phase: 03-01
    provides: StintRunner loop with tire model, typed stubs for electrical and aero subsystems
provides:
  - Reduced-order electrical energy balance model (SoC tracking, harvesting, deployment, power limiting)
  - Environment-aware harvest scaling via optional EnvironmentState parameter
  - Two default deployment policies (aggressive/conservative)
  - Per-point aero-mode resolution (2026 Straight Mode / Corner Mode)
  - Distance-weighted average aero factors for lap-level solver
  - Quantitative 2026 regulation preset (electrical limits, aero mode deltas, minimum weight)
affects: [sim-core, presets]
tech-stack:
  added: []
  patterns: [environment-aware-harvest-scaling, aero-zone-pre-processing, distance-weighted-averaging, policy-driven-deployment]
key-files:
  created:
    - packages/sim-core/src/stintModel/electricalModel.ts
    - packages/sim-core/src/stintModel/aeroModel.ts
  modified:
    - packages/sim-core/src/stintModel/stintRunner.ts
    - packages/sim-core/src/stintModel/index.ts
    - presets/regulations/fia-2026-baseline.json
key-decisions:
  - "Electrical power modifier scales proportionally with deployFraction * SoC/maxCapacity, capped at basePower + maxDeployPower"
  - "Wet harvest penalty uses linear 20% scaling factor per unit surfaceWetness"
  - "Aero factors pre-computed once before lap loop (zones are static per stint)"
  - "Circuit points extracted directly from CircuitDocument.points (not curvatureProfile)"
patterns-established:
  - "Environment-aware harvest scaling: optional EnvironmentState parameter with wetness penalty factor"
  - "Aero zone pre-processing: resolveAeroPerPoint once, computeAverageAeroFactors for solver input"
  - "Policy-driven deployment: aggressive (0.7 fraction) vs conservative (0.35 fraction) with identical harvest efficiency"
duration: 4min
completed: 2026-04-03
---

# Phase 3 Plan 02: Electrical Energy & Aero-Mode Switching Summary

**Reduced-order electrical SoC model with harvesting from braking energy, policy-driven deployment, environment-aware harvest scaling, and 2026 aero-mode switching with quantitative regulation values**

## Performance
- **Duration:** 4min
- **Tasks:** 2/2 completed
- **Files created:** 2
- **Files modified:** 3

## Accomplishments
- Implemented electrical energy balance model with SoC tracking: harvesting from estimated braking energy (capped at 8.5 MJ/lap) and deployment via configurable policy fraction
- Added optional EnvironmentState parameter on updateElectricalState for wetness-scaled harvest efficiency (1 - 0.2 * surfaceWetness penalty), ready for Plan 03 weather coupling
- Created two default deployment policies: aggressive (0.7 deploy fraction, higher power early, risks depletion) and conservative (0.35 deploy fraction, more consistent power across stint)
- Implemented aero-mode pre-processing: resolveAeroPerPoint maps circuit points to Straight Mode / Corner Mode based on zone definitions, computeAverageAeroFactors produces distance-weighted factors for the solver
- Wired electrical and aero models into StintRunner: SoC evolves per lap, deployment power scales effective peak power, aero factors modify drag/downforce
- Replaced qualitative regulation preset placeholders with quantitative 2026 values (350 kW MGU-K, 8.5 MJ harvest, 4 MJ delta SoC, 400 kW ICE, 55% drag reduction in Straight Mode)
- All 34 passing tests still pass (27 sim-core, 7 local-api); full monorepo typecheck clean

## Task Commits
1. **Task 1: Implement electrical energy model and aero-mode switching** - `c7fc7d5`
2. **Task 2: Wire electrical and aero into StintRunner, update regulation preset and exports** - `05b3510`

## Files Created/Modified
- `packages/sim-core/src/stintModel/electricalModel.ts` - Energy balance model: initializeElectricalState, estimateBrakingEnergy, updateElectricalState (with optional EnvironmentState), computeElectricalPowerModifier, DEFAULT_AGGRESSIVE_POLICY, DEFAULT_CONSERVATIVE_POLICY
- `packages/sim-core/src/stintModel/aeroModel.ts` - Aero-mode resolution: resolveAeroPerPoint (per-circuit-point mode assignment), computeAverageAeroFactors (distance-weighted averaging), AeroResolvedPoint type
- `packages/sim-core/src/stintModel/stintRunner.ts` - Replaced electrical identity stub with updateElectricalState, replaced power stub with computeElectricalPowerModifier, added aero pre-computation before lap loop, updated assumptions
- `packages/sim-core/src/stintModel/index.ts` - Added re-exports for electricalModel and aeroModel functions and types
- `presets/regulations/fia-2026-baseline.json` - Quantitative 2026 values: electrical (350kW MGU-K, 8.5MJ harvest, 4MJ delta SoC), aero (55% drag reduction, 30% downforce reduction), 798kg minimum weight

## Decisions & Deviations

### Decisions Made
1. **Power modifier proportionality:** Effective peak power = basePower + deployFraction * (SoC / maxCapacity) * maxDeployPower, capped at basePower + maxDeployPower. At full SoC with aggressive deploy, full electrical boost; at empty SoC, ICE only.
2. **Wet harvest penalty:** Linear 20% reduction per unit surfaceWetness: effectiveEfficiency = harvestEfficiency * (1 - 0.2 * surfaceWetness). Models reduced brake thermal transfer in wet conditions.
3. **Aero factor pre-computation:** Aero-resolved points computed once before the lap loop since zones are static per stint. Average factors fed to solver as single VehicleParams per lap.

### Deviations from Plan

**1. [Rule 1 - Bug] Fixed circuit point extraction for aero resolution**
- **Found during:** Task 2 (typecheck)
- **Issue:** Initial implementation used `config.circuit.data.curvatureProfile` which does not exist on CircuitDocument type. The actual structure is `config.circuit.points` with `{distance, curvature}` objects.
- **Fix:** Changed to `config.circuit.points.map(pt => ({distance: pt.distance, curvature: pt.curvature}))`.
- **Files modified:** packages/sim-core/src/stintModel/stintRunner.ts
- **Commit:** 05b3510

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 03 (environment/weather model) can wire environmentState as 5th argument to updateElectricalState for weather->electrical coupling. The comment marking the wiring point is in stintRunner.ts line 223.
- All electrical and aero exports are available via the barrel export in index.ts
- Regulation preset has quantitative values consumable by future plans
- Pre-existing web test failures (2 tests in apps/web) remain unchanged and are not caused by this plan

## Self-Check: PASSED
- All 5 files verified present on disk
- Both task commits (c7fc7d5, 05b3510) verified in git log
