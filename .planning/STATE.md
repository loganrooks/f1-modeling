# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-19)

**Core value:** Make F1 design and strategy legible by coupling editable models with visual explanations of why a result changed.
**Current focus:** Phase 1 - Foundations and Scenario Schema

## Current Position

Phase: 1 of 8 (Foundations and Scenario Schema)
Plan: 1 of 8 complete

**Current Phase:** 01
**Current Phase Name:** Foundations and Scenario Schema
**Total Phases:** 8
**Current Plan:** 5
**Total Plans in Phase:** 8
**Status:** Ready to execute
**Last Activity:** 2026-03-20
**Progress:** [██████░░░░] 63%

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 5 min
- Total execution time: 0.08 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 01 | 1/8 | 5min | 5min |

**Recent Trend:**
- Last 5 plans: 5min
- Trend: Baseline established
| Phase 01 P01 | 5min | 1 tasks | 5 files |
| Phase 01 P02 | 6min | 2 tasks | 13 files |
| Phase 01 P03 | 4min | 2 tasks | 13 files |
| Phase 01 P07 | 4min | 2 tasks | 6 files |
| Phase 01 P04 | 6min | 2 tasks | 7 files |

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

### Pending Todos

None yet.

### Blockers/Concerns

- Shared GSD tooling still resolves quality profiles to Claude-era labels; project-level Codex intent is documented but global tooling may still need adaptation later.
- Realistic telemetry import path is still unknown until actual subscription data workflow is tested.
- The minimum viable electrical state set and educational UX surface for v1 remain deferred to later roadmap phases and should not leak into Phase 1 execution.
- The minimum viable environment-interaction model for v1 remains deferred to later roadmap phases and should not leak into Phase 1 execution.
- The first observer targets and whether EKF is the right initial estimator for them remain deferred to Phase 4 planning.
- The minimum viable plant model, horizon, and solver strategy for an initial MPC baseline remain deferred to Phase 5 planning.
- The first reusable visualization primitives are now planned for Phase 1, but the threshold for honest racing-line visualization remains deferred to Phase 2.
- Future milestone sequencing for non-electrical subsystem families is still undefined and should be made explicit as the roadmap evolves.
- Shared GSD roadmap parsing currently depends on `.planning/phases/` directories; Phase 1 is now scaffolded there, and future phases should follow that convention so phase workflows resolve cleanly.

## Session Continuity

**Last session:** 2026-03-20T02:45:32.226Z
**Stopped At:** Completed 01-07-PLAN.md
**Resume File:** None
