---
id: sig-2026-04-08-sim-core-barrel-file-churn-hotspot
type: signal
project: f1-modeling
tags: [file-churn, hotspot, tooling]
created: 2026-04-08T00:00:00Z
updated: 2026-04-08T00:00:00Z
durability: convention
status: active
severity: notable
signal_type: deviation
signal_category: negative
polarity: negative
phase: "03.1"
plan: null
source: auto
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by gsdr-signal-synthesizer at 2026-04-08T00:00:00Z"
evidence:
  supporting:
    - "7 modifications in last 50 commits: packages/sim-core/src/index.ts"
    - "Commits span phases 03.1-01 through 03.1-03 plus prior phases"
  counter:
    - "Barrel file churn is structurally expected in monorepo where each phase adds exports"
    - "Each modification reflects a legitimate new public export"
confidence: medium
confidence_basis: "Statistical frequency analysis; barrel file pattern is a known false-positive source."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
gsd_version: "1.19.1+dev"
---

# packages/sim-core/src/index.ts modified in 7 of last 50 commits -- barrel file churn across phases

## What Happened

The `packages/sim-core/src/index.ts` barrel file was modified 7 times in the last 50 commits, spanning Phase 3.1 plans 01 through 03 and prior phases. This makes it the highest-frequency modification target in the repository by commit count.

## Context

- Phase: 03.1
- Source: git history analysis
- The sim-core package is the central domain model library; its barrel file (`index.ts`) is the public export surface
- Each phase adds new model components (stint runner, race model, tire inventory) requiring new barrel exports

## Potential Cause

The barrel file pattern requires a modification per new exported symbol. As each phase adds domain model components to sim-core, the index.ts accumulates modifications. This is structurally expected for a growing monorepo with active domain model expansion. The churn is not a quality concern but is worth monitoring as a potential indicator that the public API surface is growing faster than anticipated. If sim-core export growth accelerates further, sub-barrel organization may become warranted.
