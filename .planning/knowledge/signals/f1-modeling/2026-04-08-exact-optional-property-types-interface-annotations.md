---
id: sig-2026-04-08-exact-optional-property-types-interface-annotations
type: signal
project: f1-modeling
tags: [typescript, exactOptionalPropertyTypes, strict-mode, interfaces]
created: 2026-04-08T00:00:00Z
updated: 2026-04-08T00:00:00Z
durability: convention
status: active
severity: minor
signal_type: struggle
signal_category: negative
polarity: negative
phase: "03.1"
plan: 3
source: auto
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by gsdr-signal-synthesizer at 2026-04-08T00:00:00Z"
evidence:
  supporting:
    - "Plan 03 SUMMARY auto-fix: TypeScript strict mode with exactOptionalPropertyTypes requires optional interface fields to explicitly include | undefined."
    - "Fix required adding | undefined to all optional fields in CreateRaceSimulationRunInput, TireUsageEntryInput, and TireUsageEntry interfaces"
  counter:
    - "Known TypeScript strict mode behavior, not a novel discovery"
    - "The fix is mechanical and straightforward"
confidence: high
confidence_basis: "Directly documented in Plan 03 SUMMARY auto-fix section."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.1+dev"
---

# exactOptionalPropertyTypes strict mode caused TS errors in Plan 03 interfaces requiring | undefined annotations

## What Happened

Plan 03 TypeScript compilation failed due to `exactOptionalPropertyTypes` strict mode requiring that optional interface fields explicitly include `| undefined`. Three interfaces required fixes: `CreateRaceSimulationRunInput`, `TireUsageEntryInput`, and `TireUsageEntry`. The fixes were mechanical -- adding `| undefined` to all optional property declarations.

## Context

- Phase: 03.1, Plan 03 (Tire Inventory)
- Source file: `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-03-SUMMARY.md`
- The project has `noUncheckedIndexedAccess` enabled per CLAUDE.md; `exactOptionalPropertyTypes` is an additional strict-mode constraint
- This manifests specifically when new interfaces are defined without accounting for the strict requirement

## Potential Cause

New interfaces written without awareness of `exactOptionalPropertyTypes` default to omitting `| undefined` on optional fields, which compiles cleanly under standard TypeScript but fails under this strict mode. The pattern will likely recur whenever new interfaces are added in future plans if developers are not consciously applying the strict rule.
