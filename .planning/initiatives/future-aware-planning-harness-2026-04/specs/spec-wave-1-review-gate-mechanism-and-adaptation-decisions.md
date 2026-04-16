# Wave 1 Review Gate: Mechanism And Adaptation Decisions

**Gate:** 1
**Status:** Proposed scaffold
**Mode:** Human/orchestrator review gate

## Purpose

This gate exists between the research wave and the first synthesis wave.

It should prevent the initiative from drifting from:
- mechanism comparison
- GSDR adaptation inventory

directly into doctrine/harness proposals without first deciding what is actually worth carrying forward.

## Inputs to review

Expected inputs:

- `research/01-mechanism-comparison-and-patch-surfaces.md`
- `research/02-gsdr-subsystem-adaptation-inventory.md`
- `PLAN.md`
- `RESEARCH-PRINCIPLES.md`

## Questions this gate must answer

1. Which `prix-guesser` mechanisms are genuinely behavior-changing and worth adopting here?
2. Which mechanisms should be adapted rather than copied because `f1-modeling` is on GSDR, not plain GSD?
3. Which GSDR-only subsystems need explicit treatment in this initiative now?
4. Which GSDR-only subsystems should be left advisory or deferred?
5. Is the doctrine/governance package still the right next synthesis target, or should the initiative be restructured first?
6. Is the current initiative still appropriately scoped, or is it becoming too broad for one pass?

## Valid outcomes

- Proceed to Wave 2A as planned
- Narrow the initiative before Wave 2A
- Expand the initiative because a missing subsystem lane must be added now
- Split the initiative into doctrine/harness and Reflect-subsystem follow-on initiatives
- Stop and reframe if the patch surfaces are too weak or too broad to justify the effort

## Decision record expectation

The review outcome should explicitly classify findings as:

- `borrow now`
- `adapt now`
- `borrow later`
- `reject`

and should record any initiative-structure changes before Wave 2A begins.
