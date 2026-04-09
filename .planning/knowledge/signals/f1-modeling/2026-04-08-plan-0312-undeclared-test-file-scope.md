---
id: sig-2026-04-08-plan-0312-undeclared-test-file-scope
type: signal
project: f1-modeling
tags: [scope-creep, plan-accuracy]
created: 2026-04-08T00:00:00Z
updated: 2026-04-08T00:00:00Z
durability: convention
status: active
severity: minor
signal_type: deviation
signal_category: negative
polarity: negative
phase: "03.1"
plan: 2
source: auto
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by gsdr-signal-synthesizer at 2026-04-08T00:00:00Z"
evidence:
  supporting:
    - "Plan 03.1-02 declared 7 files but committed 8 (extra: raceModel.test.ts)"
    - "Test file not listed in files_modified frontmatter"
  counter:
    - "Test file aligns with plan's must_have truths"
    - "Same test file re-targeted in plan 03.1-04"
confidence: medium
confidence_basis: "Plan declaration vs git log comparison; 1 extra file."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
gsd_version: "1.19.1+dev"
---

# Plan 03.1-02 committed 1 undeclared test file beyond its files_modified declaration

## What Happened

Plan 03.1-02 declared 7 files in its `files_modified` frontmatter but the git commit included 8 files. The undeclared file is `raceModel.test.ts`, which was created proactively during Plan 02 implementation rather than deferred to Plan 04 as planned.

## Context

- Phase: 03.1, Plan 02 (Race Model Implementation)
- Source: git history vs PLAN.md files_modified comparison
- The extra file is a test file that aligns with the plan's must_have truths
- Plan 04 subsequently listed raceModel.test.ts in its own files_modified (as a file to modify), so the plan sequence assumed this file would be created in Plan 04

## Potential Cause

The executor opted to write tests immediately alongside implementation rather than deferring to the designated test plan. The deviation from the files_modified declaration is minor -- the file is constructive and aligned with plan intent -- but it represents an accuracy gap in plan-versus-actual tracking. Future plan declarations should account for the executor's tendency to create test files opportunistically during implementation plans.
