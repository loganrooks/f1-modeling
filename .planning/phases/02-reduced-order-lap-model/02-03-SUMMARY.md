---
phase: 02-reduced-order-lap-model
plan: 03
model: claude-opus-4-6
context_used_pct: 35
subsystem: visuals, web
tags: [speed-profile-trace, track-map, sensitivity-waterfall, regime-coloring, svg-visualization, comparison-mode]
requires:
  - phase: 02-reduced-order-lap-model
    provides: "QSS lap solver output (SpeedProfilePoint[], SectorResult[], LapModelOutput), circuit presets with x/y coordinates, API endpoints for circuits and runs, browser workspace with circuit selector and vehicle param editor"
provides:
  - "SpeedProfileTrace: SVG speed-vs-distance chart with regime coloring, sector boundaries, comparison overlay, and tooltip"
  - "TrackMap: SVG track outline with speed-colored segments and provenance label (falls back to placeholder)"
  - "SensitivityWaterfall: SVG waterfall/bridge chart for per-sector time delta decomposition"
  - "RunSummaryPanel: lap model view with header, sector table, speed trace, track map, and assumptions"
  - "RunHistoryPanel: lap time formatting, compare button, model type badges"
  - "Comparison mode: overlaid speed profiles and waterfall chart for two-run comparison"
  - "Complete Phase 2 browser experience: circuit selection through result inspection"
affects: [phase-03, apps/web, packages/visuals]
tech-stack:
  added: []
  patterns: [regime-colored-svg-trace, speed-heatmap-track-outline, waterfall-bridge-chart, comparison-overlay-mode, provenance-honesty-label]
key-files:
  created:
    - packages/visuals/src/traces/SpeedProfileTrace.tsx
    - packages/visuals/src/inspectors/SensitivityWaterfall.tsx
    - packages/visuals/src/workspace/TrackMap.tsx
  modified:
    - packages/visuals/src/index.ts
    - apps/web/src/features/runs/RunSummaryPanel.tsx
    - apps/web/src/features/runs/RunHistoryPanel.tsx
    - apps/web/src/app/App.tsx
    - apps/web/src/app/useWorkspace.ts
    - apps/web/package.json
    - package-lock.json
key-decisions:
  - "Hand-rolled SVG for all visualizations (no charting library) consistent with project conventions"
  - "Track map uses hsl color scale (blue-slow to red-fast) for speed overlay"
  - "Provenance label shown on every track map to maintain honesty constraints"
  - "Comparison mode uses comparisonRunId state in useWorkspace, exposed as dropdown in run history"
  - "Speed profile tooltip uses React state hover, not external tooltip library"
patterns-established:
  - "Regime-colored SVG trace: polyline segments colored by driving regime (accelerating/braking/cornering)"
  - "Speed heatmap track outline: x/y circuit points colored by continuous speed scale"
  - "Waterfall bridge chart: cumulative sector deltas with positive/negative coloring"
  - "Comparison overlay: dashed secondary profile on shared axes"
  - "Provenance honesty label: source attribution on spatial visualizations"
known-gaps:
  - "Track map x/y coordinates are hand-authored approximations with large closure gaps (~2km); to be replaced with real geometry from TUMFTM racetrack database or constrained optimization in Phase 2.1"
duration: 28min
completed: 2026-03-27
---

# Phase 02 Plan 03: Lap Model Visualization Summary

**Speed profile traces with regime coloring, track map outlines with speed heatmap, sensitivity waterfall charts, and full comparison mode -- completing the Phase 2 browser experience from circuit selection through result inspection**

## Performance
- **Duration:** 28min (including checkpoint verification)
- **Tasks:** 3/3 (2 auto + 1 human-verify)
- **Files modified:** 10

## Accomplishments
- Built three new SVG visual components: SpeedProfileTrace (regime-colored speed-vs-distance), TrackMap (speed-heatmap circuit outline with provenance label), SensitivityWaterfall (per-sector time delta waterfall)
- All components follow existing patterns: presentation-only, props-driven, no data fetching, hand-rolled SVG with inline styles
- Extended RunSummaryPanel to detect run type (harnessId) and render appropriate Phase 2 lap model view or Phase 1 placeholder view
- Added sector results table with formatted times, min/max speeds, and limiting factor labels
- Added comparison mode: select a second run to see overlaid speed profiles and waterfall chart
- Updated RunHistoryPanel with lap time formatting (M:SS.mmm), compare buttons, and model type badges
- Added comparisonRunId state management to useWorkspace hook
- Assumptions panel displays model limitations alongside every lap model run
- Phase 1 placeholder runs continue to display correctly with existing visualization
- Human verification confirmed all Phase 2 success criteria satisfied

## Phase 2 Success Criteria (All Met)
1. **Circuit selection + parameter editing:** Circuit selector shows Monza, Monaco, Silverstone; vehicle parameter editor shows 2026 defaults
2. **Visible intermediate factors:** Speed profile trace with regime coloring, sector table with limiting factors, assumptions panel
3. **Parameter change attribution:** Sensitivity waterfall chart, overlaid speed profiles in comparison mode
4. **Trajectory visualization:** Track map with speed-colored overlay and provenance honesty label

## Known Gap: Track Map Geometry

The hand-authored x/y coordinates in circuit presets produce track outlines with large closure gaps (~2km) that do not resemble real circuit shapes. This is a geometry data quality issue, not a physics or visualization code issue.

**Impact:** Visual-only. The track map shapes are incorrect but the lap model physics (curvature-based, not x/y-based) remain valid.

**Resolution path:** Phase 2.1 (Circuit Geometry Pipeline) will replace hand-authored coordinates with real data from the TUMFTM racetrack database and/or constrained optimization fitting. A deliberation has been written at `.planning/deliberations/f1-data-landscape-and-circuit-geometry-sources.md` documenting the data source landscape and approach.

**The TrackMap component code is correct** -- it faithfully renders whatever x/y data it receives with speed coloring, provenance labels, and sector markers. The fix is upstream in the circuit preset data.

## Task Commits
1. **Task 1: Create speed profile trace, track map, and sensitivity waterfall visual components** - `4728ecd`
2. **Task 2: Wire visualizations into the browser workspace for lap model runs** - `2a00ae6`
3. **Task 3: Verify complete Phase 2 lap model experience in browser** - Checkpoint approved (no code commit)

## Files Created/Modified
- `packages/visuals/src/traces/SpeedProfileTrace.tsx` - SVG speed-vs-distance chart with regime coloring, sector boundaries, comparison overlay, and hover tooltip
- `packages/visuals/src/inspectors/SensitivityWaterfall.tsx` - SVG waterfall/bridge chart showing per-sector time deltas with cumulative total
- `packages/visuals/src/workspace/TrackMap.tsx` - SVG track outline with speed-colored hsl gradient, provenance label, sector indicators
- `packages/visuals/src/index.ts` - Added exports for SpeedProfileTrace, SensitivityWaterfall, TrackMap with props types
- `apps/web/src/features/runs/RunSummaryPanel.tsx` - Extended to render Phase 2 lap model view (header, sectors, speed trace, track map, assumptions) or Phase 1 placeholder
- `apps/web/src/features/runs/RunHistoryPanel.tsx` - Added lap time formatting, compare buttons, model type badges
- `apps/web/src/app/App.tsx` - Passes comparisonRunId and circuit catalog props through to visualization panels
- `apps/web/src/app/useWorkspace.ts` - Added comparisonRunId state, comparisonRun derived value, selectComparisonRun setter
- `apps/web/package.json` - Added @f1-modeling/visuals dependency
- `package-lock.json` - Updated lockfile

## Decisions & Deviations

### Decisions Made
- **Hand-rolled SVG throughout:** Consistent with project conventions. No external charting library (d3, recharts, etc.) used.
- **HSL color scale for track map:** `hsl(240 - speed/maxSpeed * 240, 80%, 50%)` provides an intuitive blue (slow) to red (fast) gradient.
- **Provenance label always visible:** Every track map shows source attribution at the bottom, maintaining the project's honesty constraints.
- **Comparison via dropdown:** useWorkspace manages comparisonRunId state; RunHistoryPanel shows compare buttons that populate it.
- **React state hover tooltip:** SpeedProfileTrace uses local React state for tooltip positioning rather than an external tooltip library.

### Deviations from Plan
None -- plan executed as written. The known track geometry gap was identified during checkpoint verification and is documented above as a data quality issue, not a code deviation.

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- Phase 2 complete: all three plans (lap solver, API wiring, visualization) delivered and verified
- Complete user experience available: circuit selection -> parameter editing -> model execution -> result inspection -> comparison analysis
- Visual component patterns established for future phases to extend (e.g., additional trace types, richer track maps)
- Known gap (track geometry) scoped to Phase 2.1 with deliberation documenting approach
- Pending todo captured: context-appropriate comparison modes for same-track and cross-track analysis

## Self-Check: PASSED
- All 3 created files verified present on disk
- All 7 modified files verified present on disk
- Both task commits (4728ecd, 2a00ae6) verified in git log
- SUMMARY.md verified present at expected path
- Deliberation file verified present
