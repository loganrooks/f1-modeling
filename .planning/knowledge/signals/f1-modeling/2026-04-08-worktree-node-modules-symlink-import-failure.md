---
id: sig-2026-04-08-worktree-node-modules-symlink-import-failure
type: signal
project: f1-modeling
tags: [worktree, node-modules, import-resolution, typescript, monorepo]
created: 2026-04-08T00:00:00Z
updated: 2026-04-08T00:00:00Z
durability: workaround
status: active
severity: notable
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
    - "Plan 03 SUMMARY auto-fix: Git worktree shares node_modules with main repo via symlink. The sim-core barrel export for validateTireInventory resolves to main repo source which does not have the new export yet."
    - "Fix required creating a local adapter function (localValidateTireInventory) in runService.ts"
    - "VERIFICATION.md Anti-Patterns section calls out the local adapter as a worktree build workaround"
  counter:
    - "The adapter is complete (not a stub) and canonical implementation exists in tireInventory.ts"
    - "The executor documented the workaround with consolidation intent"
confidence: high
confidence_basis: "Directly documented in Plan 03 SUMMARY auto-fix section and confirmed by VERIFICATION.md."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.1+dev"
---

# Worktree node_modules symlink caused validateTireInventory import failure in Plan 03, requiring a duplicated local adapter

## What Happened

During Plan 03 execution, importing `validateTireInventory` from the `sim-core` barrel export failed because the git worktree shares `node_modules` with the main repository via symlink. The barrel export resolved to the main repo source, which did not yet have the new export. The executor created a local adapter function `localValidateTireInventory` in `runService.ts` as a workaround. The VERIFICATION.md anti-patterns section explicitly flags this as a worktree build workaround requiring future consolidation.

## Context

- Phase: 03.1, Plan 03 (Tire Inventory)
- Source file: `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-03-SUMMARY.md`
- The canonical implementation exists in `tireInventory.ts`; the local adapter duplicates its logic
- The worktree pattern is an established dev setup for this project (used for remote dev over Tailscale)

## Potential Cause

Git worktrees symlink `node_modules` from the primary checkout, causing TypeScript module resolution to follow the symlink to main repo source rather than the worktree source. When a new export is added in the worktree but not yet in the main repo, the barrel import fails. The immediate workaround (local adapter) avoids the issue but leaves duplicated logic that should be consolidated after the main repo is updated.
