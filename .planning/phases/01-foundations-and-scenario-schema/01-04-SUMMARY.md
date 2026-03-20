---
phase: 01-foundations-and-scenario-schema
plan: 04
model: gpt-5.4
context_used_pct: 44
subsystem: packages/domain
tags: [typescript, zod, domain-schemas, scenario-documents, run-records, provenance]
requires:
  - phase: 01-03
    provides: shared package seams and the deterministic Phase 1 placeholder simulation contract
provides:
  - Versioned scenario document schema with explicit placeholder extension points
  - Shared schema-version and provenance helpers for later document families
  - Deterministic default scenario factory for Phase 1 consumers
  - Base run-record schema and core contract tests for scenario and run documents
affects: [phase-01, packages/domain, local-persistence, reproducibility]
tech-stack:
  added: [none]
  patterns: [versioned shared contracts, explicit placeholder seams, append-only run snapshots]
key-files:
  created:
    - packages/domain/src/common/schemaVersion.ts
    - packages/domain/src/common/provenance.ts
    - packages/domain/src/scenario/schema.ts
    - packages/domain/src/scenario/defaultScenario.ts
    - packages/domain/src/runs/schema.ts
    - packages/domain/src/__tests__/documents.test.ts
  modified:
    - packages/domain/src/index.ts
key-decisions:
  - "Keep scenario documents and run records as separate versioned contracts, with scenario documents referencing presets instead of embedding one opaque workspace blob."
  - "Represent future observer, controller, and imported-data surfaces as explicit placeholder sections with placeholder provenance instead of speculative Phase 1 config."
  - "Make the canonical Phase 1 default scenario deterministic and validated at factory construction time."
patterns-established:
  - "Shared provenance contract: documented fact, engineering inference, and placeholder semantics live in reusable metadata."
  - "Run snapshot contract: run records embed a validated scenario snapshot plus typed preset snapshots for reproducibility."
duration: 6min
completed: 2026-03-20
---

# Phase 1 Plan 04: Core Scenario and Run Schema Foundations Summary

**Versioned scenario and run contracts with shared provenance metadata, explicit placeholder seams, and a deterministic default scenario factory for Phase 1.**

## Performance
- **Duration:** 6min
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Added shared `schemaVersion`, identifier, timestamp, and provenance helpers so later document families can reuse one contract vocabulary.
- Implemented `scenarioDocumentSchema` with explicit session/regulation/weather preset references, driver placeholder data, reproducibility seed, and reserved placeholder sections for observer, controller, and imported-data alignment work.
- Added `createDefaultScenario()` as the canonical deterministic Phase 1 scenario factory instead of leaving consumers to invent UI-local ad hoc objects.
- Defined the base `runRecordSchema` with scenario and preset snapshots plus reproducibility metadata, then added Vitest coverage for valid and invalid scenario/run payloads.

## Task Commits
1. **Task 1: Implement shared schema-version and provenance foundations plus the scenario contract** - `054a1ea`
2. **Task 2: Define the base run-record schema and core domain tests** - `68a5024`

## Files Created/Modified
- `packages/domain/src/common/schemaVersion.ts` - Shared schema-version, identifier, and timestamp helpers
- `packages/domain/src/common/provenance.ts` - Shared source-type, provenance, and assumption-note schemas
- `packages/domain/src/scenario/schema.ts` - Phase 1 scenario document contract and explicit placeholder extension-point schemas
- `packages/domain/src/scenario/defaultScenario.ts` - Deterministic validated default scenario factory
- `packages/domain/src/runs/schema.ts` - Base run-record schema, preset snapshot shapes, and artifact/status contracts
- `packages/domain/src/__tests__/documents.test.ts` - Core domain schema coverage for valid and invalid scenario/run documents
- `packages/domain/src/index.ts` - Browser-safe root exports for the shared domain contract surface

## Decisions Made
- Scenario documents remain separate from run records and reference presets by stable id so later plans can resolve immutable snapshots without reshaping the scenario contract.
- Placeholder future surfaces are explicit fields with placeholder provenance, which keeps Phase 1 honest about missing observer, controller, and import-alignment detail.
- The default scenario factory returns a parsed document, so downstream code starts from a validated contract instead of unchecked literals.

## Deviations from Plan
None - plan logic executed as written.

Execution note:
- Task 1 commit `054a1ea` also carried concurrently staged visual-package files that were already present in the git index. They were left intact to avoid rewriting work outside `packages/domain`.

## Authentication Gates
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
The domain package now exposes stable scenario/run contracts and shared provenance utilities, so Plan `01-05` can add preset documents, disk catalog loading, and snapshot-aware run-record construction on top of an already-tested contract surface.

## Self-Check: PASSED
- Verified the summary and claimed key files exist on disk.
- Verified task commits `054a1ea` and `68a5024` exist in git history.
