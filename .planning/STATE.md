---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 03
current_phase_name: Tire, Electrical, Weather, Environment, and Energy Dynamics
current_plan: 4
status: verifying
stopped_at: Completed 03-04-PLAN.md
last_updated: "2026-04-03T05:25:12.556Z"
last_activity: 2026-04-03
progress:
  total_phases: 9
  completed_phases: 4
  total_plans: 17
  completed_plans: 17
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-19)

**Core value:** Make F1 design and strategy legible by coupling editable models with visual explanations of why a result changed.
**Current focus:** Phase 3 in progress — Tire, Electrical, Weather, Environment, and Energy Dynamics

## Current Position

Phase: 03 of 8 (Tire, Electrical, Weather, Environment, and Energy Dynamics)
Plan: 1 of 4 complete

**Current Phase:** 03
**Current Phase Name:** Tire, Electrical, Weather, Environment, and Energy Dynamics
**Total Phases:** 8
**Current Plan:** 4
**Total Plans in Phase:** 4
**Status:** Phase complete — ready for verification
**Last Activity:** 2026-04-03
**Progress:** [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 7.6 min
- Total execution time: 1.13 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 01 | 9/9 | 68min | 7.6min |

**Recent Trend:**
- Last 5 plans: 10.2min
- Trend: Up sharply
| Phase 01 P01 | 5min | 1 tasks | 5 files |
| Phase 01 P02 | 6min | 2 tasks | 13 files |
| Phase 01 P03 | 4min | 2 tasks | 13 files |
| Phase 01 P07 | 4min | 2 tasks | 6 files |
| Phase 01 P04 | 6min | 2 tasks | 7 files |
| Phase 01 P05 | 8min | 2 tasks | 15 files |
| Phase 01 P06 | 10min | 2 tasks | 12 files |
| Phase 01 P08 | 23min | 2 tasks | 13 files |
| Phase 01 P09 | 2min | 1 tasks | 1 files |
| Phase 02 P01 | 14min | 2 tasks | 22 files |
| Phase 02 P02 | 9min | 2 tasks | 12 files |
| Phase 02 P03 | 28min | 3 tasks | 10 files |
| Phase 02.1 P01 | 12 | 3 tasks | 7 files |
| Phase 03 P01 | 5min | 2 tasks | 11 files |
| Phase 03 P02 | 4min | 2 tasks | 5 files |
| Phase 03 P03 | 9min | 2 tasks | 16 files |
| Phase 03 P04 | 9min | 2 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Initialization: quality profile intent for this repo is Codex-native GPT-5.4, not Claude-era labels
- Initialization: reduced-order, explainable models come before high-fidelity simulation
- Clarification: MPC is now the preferred serious control baseline before RL
- Clarification: observer methods, including EKF-style estimation, are now explicitly in-scope on the roadmap
- Deliberation: estimation and control should be taught and built as an explicit layered stack from observer to MPC to later RL
- Initialization: RL is a future extension, but only after the simulator is credible enough to support policy learning
- Deliberation: platform scope is eventual full-system F1 coverage with staged subsystem delivery; electrical is early but not the sole defining focus
- Clarification: environment interaction should be treated as explicit system coupling, not only as weather or preset metadata
- Deliberation: visualization should be a progressive, model-coupled learning surface rather than a disconnected later polish layer
- Gap analysis (2026-03-26): added 8 new requirements (PLAT-04, VISU-05, STRA-04, STRA-05, CTRL-05, EDU-03, ESTM-04, DATA-04); refined MODL-01 and MODL-04
- Gap analysis: expanded Phase 4 from 3 to 6 plans, Phase 5 from 4 to 5, Phase 6 from 4 to 5
- Gap analysis: dev servers now support HOST env-var toggle for remote access from apollo over Tailscale
- Gap analysis: FastF1 and OpenF1 API identified as primary data source targets (resolves open question)
- Deliberation: dev/deployment architecture — env-var toggle recommended; SSH tunnel fallback if HMR unreliable
- Deliberation: educational pedagogy — hybrid role-based entry points with concept-based depth modules; performance engineer as natural first role for robotics background
- Deliberation: data source strategy — FastF1 (Python, telemetry-rich) + OpenF1 (REST, Node-native) via adapter interface; Python sidecar for FastF1
- [Phase 01]: Reserve root dev/build/test/typecheck scripts at the repo root so later workspaces inherit a stable command surface.
- [Phase 01]: Keep future workspace-data artifacts as local disk files that are git-ignored by default but still human-inspectable.
- [Phase 01]: Use pinned localhost ports plus a Vite proxy so the browser and API shells can be smoke-tested deterministically.
- [Phase 01]: Keep Fastify app construction separate from process startup so later plans can reuse the app instance cleanly.
- [Phase 01]: Keep packages/domain and packages/visuals as explicit Phase 1 placeholders until schema and primitive plans land.
- [Phase 01]: Use clearly labeled non-physical placeholder metrics in sim-core so wiring can progress without implying unsupported model fidelity.
- [Phase 01]: Keep visuals package APIs presentation-only so later app shells provide data and control flow without deep private imports.
- [Phase 01]: Encode honesty constraints directly in shared primitives, especially for provenance labeling and track-context placeholders.
- [Phase 01]: Keep scenario documents and run records as separate versioned contracts, with scenario documents referencing presets instead of embedding one opaque workspace blob.
- [Phase 01]: Represent future observer, controller, and imported-data surfaces as explicit placeholder sections with placeholder provenance instead of speculative Phase 1 config.
- [Phase 01]: Make the canonical Phase 1 default scenario deterministic and validated at factory construction time.
- [Phase 01]: Keep filesystem preset loading behind @f1-modeling/domain/node/preset-catalog so the package root remains browser-safe.
- [Phase 01]: Run records must carry both stable preset references and resolved preset snapshots so historical runs stay reproducible after preset edits.
- [Phase 01]: Default local API paths resolve repo-root presets and workspace-data locations, but app construction accepts explicit overrides for tests and alternate roots.
- [Phase 01]: Run creation stays append-only by generating fresh run ids while delegating scenario snapshot and preset snapshot assembly to createRunRecord.
- [Phase 01]: Centralize browser-side preset, scenario, and run I/O in a dedicated workspace API layer orchestrated by useWorkspace.
- [Phase 01]: Keep the integrated workbench on shared visuals primitives and label all Phase 1 run outputs as placeholder surfaces.
- [Phase 01]: Use a generic firstPreset<T> helper with runtime assertion rather than non-null assertions or type casts, preserving test safety under noUncheckedIndexedAccess.
- [Phase 02]: sim-core now depends on @f1-modeling/domain for CircuitDocument type in lapSolver
- [Phase 02]: Circuit presets use 5m curvature arrays with sine-ramped transitions and x/y from heading integration
- [Phase 02]: SimulationRunSummary generalized to Phase1PlaceholderSummary | LapModelSummary discriminated union on harnessId
- [Phase 02]: Default scenario circuit changed from silverstone-gp to monza to match available circuit presets
- [Phase 02]: Run route uses harnessId-based routing with fallback: no harnessId tries lap model then falls back to placeholder on RunDependencyError
- [Phase 02]: Speed profile stored sampled (every 10th point) in summaryMetrics, full profile in artifact data
- [Phase 02]: Hand-rolled SVG for all visualizations (no charting library) consistent with project conventions
- [Phase 02]: Track map x/y coordinates were known-inaccurate approximations; resolved in Phase 2.1 with real GPS geometry from TUMFTM and bacinger
- [Phase 02]: Comparison mode uses comparisonRunId state with overlaid speed profiles and waterfall charts
- [Phase 02.1]: Preserve hand-authored curvature arrays rather than re-deriving from GPS (noise produces implausible radii)
- [Phase 02.1]: Cache external source data files in repo for offline reproducibility and data provenance
- [Phase 02.1]: Python sidecar pipeline pattern established for heavyweight scientific computation consumed by TypeScript monorepo
- [Phase 03]: Tire wear uses linear pre-cliff + quadratic post-cliff degradation with 0.3 grip floor to prevent solver collapse
- [Phase 03]: Load transfer computed as distance-weighted average over previous lap profile rather than per-point during solve
- [Phase 03]: 10% per-lap grip clamp enforced in resolveEffectiveVehicle, not in tire model, to preserve model purity
- [Phase 03]: Fuel mass reduction modeled at 1.5 kg/lap with 95% minimum mass floor
- [Phase 03]: Electrical power modifier scales proportionally with deployFraction * SoC/maxCapacity, capped at basePower + maxDeployPower
- [Phase 03]: Wet harvest penalty uses linear 20% scaling factor per unit surfaceWetness
- [Phase 03]: Aero factors pre-computed once before lap loop (zones static per stint)
- [Phase 03]: Weather timeline uses deterministic linear interpolation between authored events (not stochastic)
- [Phase 03]: Surface grip factor is piecewise linear: 1.0 - 0.45 * surfaceWetness, floored at 0.55
- [Phase 03]: Rubber evolution starts at 0.95 (green track) with diminishing buildup toward 1.05 and rain washout above 0.3 wetness
- [Phase 03]: Stint API includes four artifact types: stint-trace, tire-degradation-trace, electrical-state-trace, weather-evolution-trace
- [Phase 03]: stintConfig on scenario is optional to preserve backward compatibility with all existing scenarios
- [Phase 03]: Mock braking energy variants (moderate/heavy) for testing harvest cap vs efficiency differences
- [Phase 03]: Two-tier coupling verification: precise ratio test at unit level + full pipeline wiring test at integration level

### Pending Todos

1. Add context-appropriate comparison modes for same-track and cross-track analysis (MEDIUM, ui)

### Roadmap Evolution

- Phase 02.1 inserted after Phase 2: Circuit Geometry Pipeline (COMPLETE) — real GPS-derived track geometry from TUMFTM and bacinger sources

### Blockers/Concerns

- Shared GSD tooling still resolves quality profiles to Claude-era labels; project-level Codex intent is documented but global tooling may still need adaptation later.
- Telemetry import path now targeted at FastF1 (Python) and OpenF1 API (REST); detailed integration architecture deferred to Phase 6 planning.
- The minimum viable electrical state set and educational UX surface for v1 remain deferred to later roadmap phases and should not leak into Phase 1 execution.
- The minimum viable environment-interaction model for v1 remains deferred to later roadmap phases and should not leak into Phase 1 execution.
- The first observer targets and whether EKF is the right initial estimator for them remain deferred to Phase 4 planning.
- The minimum viable plant model, horizon, and solver strategy for an initial MPC baseline remain deferred to Phase 5 planning.
- The first reusable visualization primitives are now planned for Phase 1, but the threshold for honest racing-line visualization remains deferred to Phase 2.
- Future milestone sequencing for non-electrical subsystem families is still undefined and should be made explicit as the roadmap evolves.
- Shared GSD roadmap parsing currently depends on `.planning/phases/` directories; Phase 1 is now scaffolded there, and future phases should follow that convention so phase workflows resolve cleanly.

## Session Continuity

**Last session:** 2026-04-03T05:25:12.553Z
**Stopped At:** Completed 03-04-PLAN.md
**Resume File:** None
