# Spec Index

The files in `specs/` are the initiative's canonical executable task contracts. They are the specs that should drive the research, synthesis, and application work for this initiative.

## Spec Map

| Spec | Scope | Primary outputs | Status |
| --- | --- | --- | --- |
| `specs/spec-wave-1A-research-mechanism-comparison-and-patch-surface-inventory.md` | Compare `prix-guesser`'s portable-GSD future-awareness mechanisms to current `f1-modeling` harness surfaces | adoption memo; mechanism comparison table; patch-surface inventory | Completed |
| `specs/spec-wave-1B-research-gsdr-subsystem-adaptation-inventory.md` | Inventory and evaluate Reflect-only subsystem adaptation needs | GSDR subsystem inventory; adaptation matrix; borrow-now / borrow-later / reject table | Completed |
| `specs/spec-wave-1-review-gate-mechanism-and-adaptation-decisions.md` | Human/orchestrator review gate after Wave 1 | review decisions on borrow/adapt/defer/reject before synthesis begins | Completed |
| `specs/spec-wave-2A-synthesis-doctrine-and-governance-package.md` | Draft the doctrine/governance package for `f1-modeling` | `.planning/LONG-ARC.md`, `.planning/AGENTS.md`, `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md` drafts or proposals | Completed |
| `specs/spec-wave-2B-apply-doctrine-and-governance-package.md` | Apply the reviewed doctrine/governance package to live repo files | live doctrine/governance files plus application summary | Completed |
| `specs/spec-wave-3A-synthesis-harness-patch-plan.md` | Design the repo-local harness/bootstrap and steering-chain patch plan | repo-local patch plan, bootstrap strategy, patch-surface map, compatibility strategy | Completed |
| `specs/spec-wave-3-review-gate-harness-patch-decisions.md` | Human/orchestrator review gate after Wave 3A | review decisions on patch scope, overlay strategy, compatibility, and proceed/narrow/split outcome | Completed |
| `specs/spec-wave-3B-apply-core-harness-patch.md` | Apply the narrowed repo-local overlay/bootstrap and core steering-chain patch | tracked overlay, bootstrap/verify scripts, core steering-chain patch, application summary | Completed |
| `specs/spec-wave-3C-apply-routing-digest-patch.md` | Apply the routing-focused overlay extension and live state digest uplift | routing overlay targets, updated STATE.md, application summary | Completed |
| `specs/spec-wave-4A-synthesis-gsdr-subsystem-adaptation-policy.md` | Synthesize the Stage 4 policy matrix for remaining GSDR-specific subsystem lanes | subsystem adaptation policy, lane classifications, candidate 4B patch surfaces | Completed |
| `specs/spec-wave-4-review-gate-gsdr-subsystem-adaptation-decisions.md` | Human/orchestrator review gate after Wave 4A | review decisions on doctrine-only versus application-worthy subsystem lanes | Completed |
| `specs/spec-wave-4B-apply-formal-gate-preflight-package.md` | Apply the narrow repo-level formal audit and review-gate preflight package | repo-level audit/review workspace docs, templates, initiative-local pointers, application summary | Completed |

## Current expectation

This initiative has completed Stages `1` through `4` at the repo-tracked level.

The current useful execution step is:

1. reassess whether Stage `5` still needs a narrow synthesis wave after the already-landed reduced-guarantee routing and formal-gate package
2. keep `verify/validate`, signal automation, and global skill patching out of scope unless that reassessment proves them necessary
3. move toward the `3.2` proving-ground application once the remaining enforcement question is honestly resolved
