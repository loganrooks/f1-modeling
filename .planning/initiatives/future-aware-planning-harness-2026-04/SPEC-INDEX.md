# Spec Index

The files in `specs/` are the initiative's canonical executable task contracts. They are the specs that should drive the research, synthesis, and application work for this initiative.

## Spec Map

| Spec | Scope | Primary outputs | Status |
| --- | --- | --- | --- |
| `specs/spec-wave-1A-research-mechanism-comparison-and-patch-surface-inventory.md` | Compare `prix-guesser`'s portable-GSD future-awareness mechanisms to current `f1-modeling` harness surfaces | adoption memo; mechanism comparison table; patch-surface inventory | Proposed |
| `specs/spec-wave-1B-research-gsdr-subsystem-adaptation-inventory.md` | Inventory and evaluate Reflect-only subsystem adaptation needs | GSDR subsystem inventory; adaptation matrix; borrow-now / borrow-later / reject table | Proposed |
| `specs/spec-wave-1-review-gate-mechanism-and-adaptation-decisions.md` | Human/orchestrator review gate after Wave 1 | review decisions on borrow/adapt/defer/reject before synthesis begins | Proposed |
| `specs/spec-wave-2A-synthesis-doctrine-and-governance-package.md` | Draft the doctrine/governance package for `f1-modeling` | `.planning/LONG-ARC.md`, `.planning/AGENTS.md`, `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md` drafts or proposals | Proposed |
| `specs/spec-wave-2B-apply-doctrine-and-governance-package.md` | Apply the reviewed doctrine/governance package to live repo files | live doctrine/governance files plus application summary | Proposed |
| `specs/spec-wave-3A-synthesis-harness-patch-plan.md` | Design the repo-local harness/bootstrap and steering-chain patch plan | repo-local patch plan, bootstrap strategy, patch-surface map, compatibility strategy | Proposed |
| `specs/spec-wave-3-review-gate-harness-patch-decisions.md` | Human/orchestrator review gate after Wave 3A | review decisions on patch scope, overlay strategy, compatibility, and proceed/narrow/split outcome | Proposed |
| `specs/spec-wave-3B-apply-core-harness-patch.md` | Apply the narrowed repo-local overlay/bootstrap and core steering-chain patch | tracked overlay, bootstrap/verify scripts, core steering-chain patch, application summary | Proposed |
| `specs/spec-wave-3C-apply-routing-digest-patch.md` | Apply the routing-focused overlay extension and live state digest uplift | routing overlay targets, updated STATE.md, application summary | Proposed |

## Current expectation

This initiative is still in scaffold form. The first useful execution step is not implementation patching; it is a narrow research wave that answers:

1. Which future-aware planning mechanisms from `prix-guesser` are actually worth borrowing here?
2. Which additional GSDR-only subsystems in `f1-modeling` need explicit future-aware treatment?
3. Which patch surfaces in this repo are real behavior levers rather than documentation-only surfaces?
