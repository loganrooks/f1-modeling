---
phase: 01-foundations-and-scenario-schema
plan: 08
model: gpt-5.4
context_used_pct: 74
subsystem: apps/web
tags: [react, vite, workspace, local-api, visuals, testing]
requires:
  - phase: 01-02
    provides: pinned localhost browser shell and Vite proxy to the local API
  - phase: 01-05
    provides: browser-safe domain contracts and preset registry types
  - phase: 01-06
    provides: scenario and run routes plus file-backed Phase 1 persistence
  - phase: 01-07
    provides: shared workbench, comparison, trace, provenance, and track placeholder primitives
provides:
  - Integrated Phase 1 browser workspace for editing, saving, loading, and rerunning local scenarios
  - Shared comparison and provenance surfaces wired to placeholder run history
  - Workspace-level React tests plus deterministic smoke verification against pinned localhost ports
affects: [phase-01, apps/web, workspace-ui, local-api-contracts]
tech-stack:
  added: [none]
  patterns: [centralized browser api layer, workspace orchestration hook, shared visuals composition]
key-files:
  created:
    - apps/web/src/app/useWorkspace.ts
    - apps/web/src/features/workspace/api.ts
    - apps/web/src/features/scenario/ScenarioEditor.tsx
    - apps/web/src/features/presets/PresetSelectors.tsx
    - apps/web/src/features/runs/RunHistoryPanel.tsx
    - apps/web/src/features/runs/RunSummaryPanel.tsx
    - apps/web/src/app/App.test.tsx
  modified:
    - apps/web/package.json
    - apps/web/src/app/App.tsx
    - apps/web/src/styles/global.css
    - apps/web/tsconfig.json
    - apps/web/vite.config.ts
    - package-lock.json
key-decisions:
  - "Centralize all browser-side preset, scenario, and run I/O in features/workspace/api.ts and orchestrate it through useWorkspace."
  - "Compose the Phase 1 workbench from @f1-modeling/visuals primitives so comparison, provenance, and track-context honesty stay shared."
patterns-established:
  - "Workspace orchestration hook: one browser-side hook coordinates initial load, local scenario persistence, and append-only run history refresh."
  - "Honest workbench assembly: the app pairs a schema-backed editor with placeholder run comparison, provenance, and reserved track-context surfaces."
duration: 23min
completed: 2026-03-20
---

# Phase 1 Plan 08: Interactive Workspace Summary

**Integrated Phase 1 browser workbench with scenario editing, local persistence, placeholder run history, and shared comparison/provenance visuals.**

## Performance
- **Duration:** 23min
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Added a browser-side workspace data layer and `useWorkspace` hook that load preset catalog data, manage the current scenario draft, save and reload scenarios, create placeholder runs, and refresh run history through the local API.
- Built schema-backed scenario, preset, and run panels so the browser workspace can edit the Phase 1 scenario contract, inspect preset provenance, and review append-only placeholder run history.
- Replaced the shell placeholder page with an integrated workbench that uses `WorkbenchShell`, `RunComparisonCard`, `MetricTracePanel`, `AssumptionPanel`, and `TrackContextPlaceholder` from `@f1-modeling/visuals`.
- Added workspace-level React Testing Library coverage for initial load plus save/create-run interactions, then verified the real stack by polling `127.0.0.1:8787` and `127.0.0.1:5173` after booting the dev workflow.

## Task Commits
1. **Task 1: Build the browser-side workspace data layer and editing panels** - `b679c16`
2. **Task 2: Assemble the integrated workbench layout, styling, and workspace tests** - `27e82e1`

## Files Created/Modified
- `apps/web/src/app/useWorkspace.ts` - Browser-side orchestration for presets, scenarios, persistence, and placeholder run history.
- `apps/web/src/features/workspace/api.ts` - Centralized fetch layer for `/api/presets`, `/api/scenarios`, and `/api/runs`.
- `apps/web/src/features/scenario/ScenarioEditor.tsx` - Schema-backed Phase 1 editor with circuit, preset, driver placeholder, seed, notes, and save/load controls.
- `apps/web/src/features/presets/PresetSelectors.tsx` - Preset selection and provenance inspection surface for regulation, session, and weather documents.
- `apps/web/src/features/runs/RunHistoryPanel.tsx` - Append-only placeholder run history list with selection and run creation controls.
- `apps/web/src/features/runs/RunSummaryPanel.tsx` - Selected-run summary, shared comparison card, and placeholder trace surface.
- `apps/web/src/app/App.tsx` - Integrated workbench composition using the shared visuals package and the workspace hook.
- `apps/web/src/app/App.test.tsx` - Workspace-level load and save/create-run tests with mocked API responses.
- `apps/web/src/styles/global.css` - Engineering-workbench styling for the browser app’s form, token, and status layers.
- `apps/web/package.json` - Explicit web-workspace dependencies for the browser app and its tests.
- `apps/web/tsconfig.json` - Web-local path alias for shared visuals package resolution during typecheck.
- `apps/web/vite.config.ts` - Matching Vite alias for shared visuals during dev and test runs.
- `package-lock.json` - Lockfile refresh after the web workspace manifest update.

## Decisions Made
- Keep all browser-side API calls centralized in one feature-layer module so the integrated app composes state through one hook instead of per-component fetch logic.
- Keep placeholder output honesty explicit in the integrated UI by labeling run summaries, comparison deltas, traces, and track context as Phase 1 placeholder surfaces.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added web-local shared-visuals alias resolution**
- **Found during:** Task 1 verification
- **Issue:** `npm run typecheck --workspace @f1-modeling/web` could not resolve `@f1-modeling/visuals`, which blocked the first browser workspace verification.
- **Fix:** Added a web-local alias in `apps/web/tsconfig.json` and `apps/web/vite.config.ts` so the app can keep importing the package root name without modifying shared package ownership.
- **Files modified:** `apps/web/tsconfig.json`, `apps/web/vite.config.ts`
- **Verification:** `npm run typecheck --workspace @f1-modeling/web`
- **Commit:** `b679c16`
- **Knowledge:** KB consulted, no relevant entries.

**2. [Rule 1 - Bug] Corrected strict optional typing in the integrated app and test fixtures**
- **Found during:** Task 2 verification
- **Issue:** `exactOptionalPropertyTypes` rejected several `undefined` optional props in `App.tsx` and the initial run fixture setup in `App.test.tsx`.
- **Fix:** Switched the assumption-entry construction to conditional property emission and strengthened the test fixtures with explicit preset snapshots and non-null scenario selection.
- **Files modified:** `apps/web/src/app/App.tsx`, `apps/web/src/app/App.test.tsx`
- **Verification:** `npm run typecheck --workspace @f1-modeling/web`
- **Commit:** `27e82e1`
- **Knowledge:** KB consulted, no relevant entries.

**3. [Rule 1 - Bug] Simplified workspace bootstrapping and tightened editor accessibility for stable tests**
- **Found during:** Task 2 verification
- **Issue:** The initial `useEffectEvent` bootstrap path and ambiguous editor field queries made the workspace tests flaky even though the UI was otherwise correct.
- **Fix:** Replaced the bootstrap with a plain async effect in `useWorkspace`, added explicit field labels in the editor and preset selectors, and hardened the test lifecycle/assertions.
- **Files modified:** `apps/web/src/app/useWorkspace.ts`, `apps/web/src/features/scenario/ScenarioEditor.tsx`, `apps/web/src/features/presets/PresetSelectors.tsx`, `apps/web/src/app/App.test.tsx`
- **Verification:** `npm run test --workspace @f1-modeling/web -- --run`
- **Commit:** `27e82e1`
- **Knowledge:** KB consulted, no relevant entries.

**Total deviations:** 3 auto-fixed (`1` blocking, `2` bug).
**Impact:** Low. All fixes were contained to the web workspace and were discovered during the planned verification commands.

## Authentication Gates
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
Phase 1 now closes with a usable local browser workbench that edits shared scenario contracts, persists them through the API, and exposes comparison/provenance seams. Phase 2 can build the first reduced-order lap model inside an already working workspace instead of scaffolding UI and persistence in parallel.

## Self-Check: PASSED
- Verified the summary file and all claimed key files exist on disk.
- Verified task commits `b679c16` and `27e82e1` exist in git history.
