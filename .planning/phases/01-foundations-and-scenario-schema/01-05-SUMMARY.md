---
phase: 01-foundations-and-scenario-schema
plan: 05
model: gpt-5.4
context_used_pct: 63
subsystem: packages/domain
tags: [typescript, zod, preset-catalog, run-records, provenance]
requires:
  - phase: 01-04
    provides: shared scenario/run contracts and provenance primitives for reproducible document families
provides:
  - Provenance-aware preset document schema family with seeded regulation, session, and weather documents
  - Browser-safe preset registry helpers plus a node-only disk loader exposed through a package subpath
  - Append-only createRunRecord helper that embeds stable references and resolved scenario/preset snapshots
affects: [phase-01, packages/domain, presets, reproducibility]
tech-stack:
  added: [none]
  patterns: [node-only subpath exports, provenance-aware preset documents, append-only snapshot-aware run construction]
key-files:
  created:
    - packages/domain/src/presets/schema.ts
    - packages/domain/src/presets/registry.ts
    - packages/domain/src/node/presetCatalog.ts
    - packages/domain/src/runs/createRunRecord.ts
    - presets/regulations/fia-2026-baseline.json
    - presets/sessions/grand-prix-race.json
    - presets/sessions/qualifying-session.json
    - presets/weather/dry-baseline.json
    - presets/weather/light-rain-placeholder.json
  modified:
    - package-lock.json
    - packages/domain/package.json
    - packages/domain/src/common/schemaVersion.ts
    - packages/domain/src/index.ts
    - packages/domain/src/runs/schema.ts
    - packages/domain/src/__tests__/documents.test.ts
key-decisions:
  - "Keep filesystem preset loading behind @f1-modeling/domain/node/preset-catalog so the package root remains browser-safe."
  - "Run records must carry both stable preset references and resolved preset snapshots so historical runs stay reproducible after preset edits."
patterns-established:
  - "Preset catalog split: pure grouping/lookup helpers live in browser-safe code while disk loading lives in a node-only entrypoint."
  - "Append-only run construction: createRunRecord validates scenario-preset alignment before freezing a reproducible run record."
duration: 8min
completed: 2026-03-20
---

# Phase 1 Plan 05: Preset Catalog Contracts and Snapshot-Aware Run Records Summary

**Provenance-aware preset documents, a node-only preset loader, and an append-only run-record helper now complete the Phase 1 preset/run contract seam.**

## Performance
- **Duration:** 8min
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Added a dedicated preset document family for regulation, session, and weather presets, including explicit provenance and assumption notes for Phase 1 honesty constraints.
- Seeded the first disk-backed preset catalog under `presets/` and exposed browser-safe grouping/lookup helpers alongside a node-only `loadPresetCatalogFromDisk(...)` entrypoint.
- Implemented `createRunRecord(...)` so Phase 1 code now builds immutable run records with stable preset references, embedded scenario/preset snapshots, and validated alignment checks.

## Task Commits
1. **Task 1: Implement the preset schema family and seed the Phase 1 catalog** - `a4a3c72`
2. **Task 2: Implement append-only run-record construction and extend the domain tests** - `776ffe9`

## Files Created/Modified
- `packages/domain/src/presets/schema.ts` - Canonical preset document schema family and typed preset categories
- `packages/domain/src/presets/registry.ts` - Browser-safe catalog grouping and preset lookup helpers
- `packages/domain/src/node/presetCatalog.ts` - Node-only disk loader for the seeded preset catalog
- `packages/domain/src/runs/createRunRecord.ts` - Shared append-only run-record construction helper
- `packages/domain/src/runs/schema.ts` - Run-record contract updated with explicit preset references plus preset snapshots
- `packages/domain/src/__tests__/documents.test.ts` - Extended coverage for seeded presets, node-only loading, immutable run construction, and invalid mismatch paths
- `presets/regulations/fia-2026-baseline.json` - Initial regulation preset with explicit engineering-inference provenance
- `presets/sessions/grand-prix-race.json` - Initial race-session preset document
- `presets/sessions/qualifying-session.json` - Initial qualifying-session preset document
- `presets/weather/dry-baseline.json` - Initial dry-weather baseline preset document
- `presets/weather/light-rain-placeholder.json` - Explicit placeholder light-rain preset document

## Decisions Made
- Preset disk loading stays off the root package surface and is only exposed through `@f1-modeling/domain/node/preset-catalog`.
- Phase 1 run history is centralized behind `createRunRecord(...)` rather than letting UI or API code hand-roll mutable run documents.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Simplified workspace subpath exports for tsx resolution**
- **Found during:** Task 1 verification
- **Issue:** `tsx` could not resolve `@f1-modeling/domain/node/preset-catalog` through the initial conditional export shape and blocked the plan verification command.
- **Fix:** Simplified the domain package `exports` map to direct subpath strings so both resolution paths can see the node-only loader.
- **Files modified:** `packages/domain/package.json`
- **Verification:** `npx tsx --eval "import { loadPresetCatalogFromDisk } from '@f1-modeling/domain/node/preset-catalog'; ..."` succeeded.
- **Commit:** `a4a3c72`
- **Knowledge:** KB consulted, no relevant entries.

**2. [Rule 1 - Bug] Corrected createRunRecord schema-version sourcing**
- **Found during:** Task 2 verification
- **Issue:** `createRunRecord(...)` pulled `runRecordSchemaVersion` from the wrong module, which produced an invalid run-record payload and failed the domain test suite.
- **Fix:** Imported `runRecordSchemaVersion` from the shared schema-version module so helper-generated run records satisfy the run schema literal.
- **Files modified:** `packages/domain/src/runs/createRunRecord.ts`
- **Verification:** `npm run test --workspace @f1-modeling/domain -- --run` passed.
- **Commit:** `776ffe9`
- **Knowledge:** KB consulted, no relevant entries.

**Total deviations:** 2 auto-fixed (`1` blocking, `1` bug).
**Impact:** Low. Both issues were caught during the planned verification commands and fixed inside the same plan without widening scope.

## Authentication Gates
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
Plan `01-06` can now load the seeded preset catalog from disk through a node-only boundary and persist immutable run history through one shared domain helper instead of ad hoc API-local object construction.

## Self-Check: PASSED
- Verified the summary file and all claimed created key files exist on disk.
- Verified task commits `a4a3c72` and `776ffe9` exist in git history.
