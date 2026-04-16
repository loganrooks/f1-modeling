# Wave 3 Review Gate: Harness Patch Decisions

**Gate:** 3
**Mode:** Human/orchestrator review gate
**Scope:** review the Stage 3A harness patch plan before live repo-local patching begins

---

## Inputs to review

- `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`
- `.planning/LONG-ARC.md`
- `.planning/AGENTS.md`
- `WORKFLOW.md`
- `.planning/ARTIFACT-GOVERNANCE.md`
- the specific current active GSDR runtime surfaces named in the Wave 3A output

---

## Gate questions

1. Is the proposed Stage 3 patch truly repo-local, reproducible, and reviewable?
2. Does it target real behavior surfaces rather than only adding new documentation?
3. Is the recommended overlay/bootstrap path acceptably narrow for this repo?
4. Are `CONTEXT.md`, `RESEARCH.md`, `PLAN.md`, and routing surfaces assigned cleanly separated roles?
5. Is canonical-reference propagation concrete enough to justify an application wave?
6. Is backward compatibility explicit enough for existing phase artifacts and reduced-guarantee handling?
7. Did the synthesis keep Stage 3 distinct from:
   - Stage 4 Reflect-subsystem adaptation
   - Stage 5 enforcement/preflight hardening
8. Is the initiative still coherent as a unified harness adaptation path after the proposed Stage 3 patch?

---

## Required outcome

The review outcome must explicitly choose one:

- Proceed to Wave `3B` as planned
- Narrow Stage `3` before Wave `3B`
- Split bootstrap/overlay work from steering-chain patching
- Defer specific mechanisms to later waves before applying

The review outcome should also explicitly classify:

- `overlay/bootstrap strategy`: `accept`, `narrow`, or `rework`
- `steering-chain patch shape`: `accept`, `narrow`, or `rework`
- `canonical-ref propagation plan`: `accept`, `narrow`, or `rework`
- `compatibility/migration plan`: `accept`, `narrow`, or `rework`

---

## Output file

Write the review decision to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3-harness-patch-decisions.md`

The file should include:

1. Metadata
2. Inputs reviewed
3. Outcome
4. Gate answers
5. Decision classifications
6. Carry-forward changes before Wave `3B`
7. Next-step decision

---

## Review posture

Be strict about overreach.

The main failure mode at this gate is approving a patch plan that:

- only changes docs
- copies too much of the home-level runtime into the repo
- smuggles in Stage 4 subsystem policy
- blurs artifact responsibilities
- lacks a realistic compatibility story

This gate should keep Stage 3 leverage-focused and implementation-ready.
