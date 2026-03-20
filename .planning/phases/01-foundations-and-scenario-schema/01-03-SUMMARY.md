---
phase: 01-foundations-and-scenario-schema
plan: 03
model: gpt-5.4
context_used_pct: 37
subsystem: shared-packages
tags: [typescript, npm-workspaces, shared-packages, sim-core, workspace-data]
requires:
  - phase: 01-01
    provides: root npm workspaces, shared TypeScript baseline, and repo-level verification scripts
provides:
  - Independent domain, visuals, and sim-core workspace shells
  - Deterministic Phase 1 placeholder simulation seam
  - Tracked local directories for saved scenarios and runs
affects: [phase-01, shared-packages, sim-core, local-persistence]
tech-stack:
  added: [none]
  patterns: [independent workspace packages, deterministic placeholder harness, inspectable local persistence directories]
key-files:
  created:
    - packages/domain/package.json
    - packages/domain/src/index.ts
    - packages/visuals/package.json
    - packages/visuals/src/index.ts
    - packages/sim-core/package.json
    - packages/sim-core/src/index.ts
    - workspace-data/scenarios/.gitkeep
    - workspace-data/runs/.gitkeep
  modified:
    - packages/sim-core/src/contracts.ts
    - packages/sim-core/src/phase1Placeholder.ts
key-decisions:
  - "Keep packages/domain and packages/visuals as explicit Phase 1 placeholders until schema and primitive plans land."
  - "Use clearly labeled non-physical placeholder metrics in sim-core so wiring can progress without implying unsupported model fidelity."
patterns-established:
  - "Shared package seams: domain, visuals, and sim-core typecheck independently under the root workspace contract."
  - "Honest placeholder simulation: deterministic summary and trace output is safe for wiring while real models remain deferred."
duration: 4min
completed: 2026-03-20
---

# Phase 1 Plan 03: Shared Package Seams and Placeholder Harness Summary

**Independent domain, visuals, and sim-core workspaces plus an honest deterministic placeholder harness and tracked local data directories.**

## Performance
- **Duration:** 4min
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Scaffolded `@f1-modeling/domain`, `@f1-modeling/visuals`, and `@f1-modeling/sim-core` as standalone TypeScript workspaces with local `build`, `test`, and `typecheck` scripts.
- Reserved placeholder package entrypoints for future schema exports and reusable visual primitives without pulling that later work into this plan.
- Defined a narrow Phase 1 sim-core request and summary contract, then implemented a deterministic placeholder harness that emits clearly non-physical metrics and trace data for workspace wiring only.
- Added tracked `workspace-data/scenarios/` and `workspace-data/runs/` directories so later persistence work has inspectable on-disk targets immediately.

## Task Commits
1. **Task 1: Create the shared workspace package shells** - `4b6fd9f`
2. **Task 2: Define the deterministic Phase 1 simulation seam and local data directories** - `91bb06b`

## Files Created/Modified
- `packages/domain/package.json` - Domain workspace manifest and local verification scripts
- `packages/domain/src/index.ts` - Placeholder domain package entrypoint for later schema exports
- `packages/visuals/package.json` - Visual primitives workspace manifest and local verification scripts
- `packages/visuals/src/index.ts` - Placeholder visuals entrypoint for later reusable UI exports
- `packages/sim-core/src/contracts.ts` - Narrow Phase 1 simulation request, summary, and harness contracts
- `packages/sim-core/src/phase1Placeholder.ts` - Deterministic placeholder runner with honest non-physical output
- `workspace-data/scenarios/.gitkeep` - Tracked scenario storage directory placeholder
- `workspace-data/runs/.gitkeep` - Tracked run storage directory placeholder

## Decisions & Deviations
Key decisions:
- Keep the domain and visuals packages as package-boundary placeholders only, so later schema and visual-primitive work can land behind stable names without premature implementation.
- Keep the placeholder simulation seam deterministic and explicitly non-physical, using generic metrics and trace points for UI wiring instead of fake lap-model outputs.

Deviations from plan:
None - plan executed exactly as written.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
The shared package seams, deterministic sim-core placeholder, and inspectable local data directories are ready for subsequent schema, persistence, and workspace assembly plans.

## Self-Check: PASSED
- Verified the summary and claimed key files exist on disk.
- Verified task commits `4b6fd9f` and `91bb06b` exist in git history.
