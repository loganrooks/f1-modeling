# Wave 3 Review Gate: Harness Patch Decisions

**Date:** 2026-04-16
**Gate:** 3
**Status:** Completed
**Reviewer:** Codex primary orchestrator

---

## Inputs Reviewed

- [PLAN.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md)
- [RESEARCH-PRINCIPLES.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md)
- [03-harness-patch-plan.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md)
- [LONG-ARC.md](/home/rookslog/workspace/projects/f1-modeling/.planning/LONG-ARC.md)
- [AGENTS.md](/home/rookslog/workspace/projects/f1-modeling/.planning/AGENTS.md)
- [WORKFLOW.md](/home/rookslog/workspace/projects/f1-modeling/WORKFLOW.md)
- [ARTIFACT-GOVERNANCE.md](/home/rookslog/workspace/projects/f1-modeling/.planning/ARTIFACT-GOVERNANCE.md)
- the specific current active GSDR runtime surfaces named in the `3A` output

---

## Outcome

**Narrow Stage 3 before Wave `3B`.**

The `3A` patch plan is strong enough to keep and use, but the first application wave should be narrower than the full Stage 3 plan it describes.

The correct split is:

- `3B`: repo-local overlay/bootstrap plus the core steering-chain patch
  - `discuss-phase.md`
  - `research-phase.md`
  - `plan-phase.md`
  - `templates/context.md`
  - `templates/phase-prompt.md`
- later follow-on wave: routing digest patch
  - `progress.md`
  - `resume-project.md`
  - `templates/state.md`

That keeps the next wave behavior-changing and useful without bundling the entire routing layer into the first home-runtime application step.

---

## Gate Answers

### 1. Is the proposed Stage 3 patch truly repo-local, reproducible, and reviewable?

Yes.

The overlay-plus-bootstrap model is concrete, reviewable in git, and honest about the fact that the active behavior still materializes into the home runtime.

### 2. Does it target real behavior surfaces rather than only adding new documentation?

Yes.

The core patch targets are real active behavior levers:

- `discuss-phase.md`
- `research-phase.md`
- `plan-phase.md`
- `templates/context.md`
- `templates/phase-prompt.md`

The routing surfaces are also real behavior levers, but they are the first thing I would narrow out of the initial application wave.

### 3. Is the recommended overlay/bootstrap path acceptably narrow for this repo?

Yes.

The plan avoids:

- a full repo-local GSDR fork
- skill-wrapper rewrites
- full runtime mirroring

That is the right call for this repo today.

### 4. Are `CONTEXT.md`, `RESEARCH.md`, `PLAN.md`, and routing surfaces assigned cleanly separated roles?

Mostly yes.

The separation is good:

- `CONTEXT.md` captures future-aware posture and canonical refs
- `RESEARCH.md` consumes canonical refs but does not grow a new disposition schema
- `PLAN.md` owns `future_preservation` and `tech_debt_disposition`
- routing surfaces stay digest-level, not doctrine-level

The only reason to narrow is not role confusion. It is application size and blast radius.

### 5. Is canonical-reference propagation concrete enough to justify an application wave?

Yes.

The carrier, parsing rule, consumer surfaces, and compatibility modes are all concrete enough to apply.

### 6. Is backward compatibility explicit enough for existing phase artifacts and reduced-guarantee handling?

Yes.

The `full_context` / `legacy_context` / `reduced_guarantee_no_context` distinction is good enough to support an application wave.

### 7. Did the synthesis keep Stage 3 distinct from Stage 4 and Stage 5?

Yes.

It clearly defers:

- deliberation and anchor schema changes
- signal automation
- audit expansion beyond later consumption hooks
- verify/validate uplift
- research-disposition follow-on

That boundary should stay binding in the application wave.

### 8. Is the initiative still coherent as a unified harness adaptation path after the proposed Stage 3 patch?

Yes.

No split of the initiative is needed. Only a narrower first Stage 3 application wave.

---

## Decision Classifications

| Area | Decision | Why |
| --- | --- | --- |
| overlay/bootstrap strategy | `accept` | The repo-local overlay plus bootstrap/verify path is the right durability model for the current home-scoped runtime reality. |
| steering-chain patch shape | `narrow` | Apply the core steering-chain surfaces first; peel off routing digest patches into a later follow-on wave. |
| canonical-ref propagation plan | `accept` | Concrete carrier, consumer, and compatibility story. |
| compatibility/migration plan | `accept` | The proving-ground `3.2` story and legacy-context handling are sufficient. |

---

## Carry-Forward Changes Before Wave `3B`

The next wave should be narrowed to:

- repo-local overlay tree
- manifest and bootstrap/verify scripts
- `discuss-phase.md`
- `research-phase.md`
- `plan-phase.md`
- `templates/context.md`
- `templates/phase-prompt.md`
- application summary for the core patch

The next wave should **not** patch yet:

- `progress.md`
- `resume-project.md`
- `templates/state.md`

Those should wait for a later routing-focused follow-on wave after the core steering patch is reviewed.

---

## Next-Step Decision

**Proceed to a narrowed Wave `3B`.**

The next executable wave should apply:

- repo-local overlay/bootstrap
- the core steering-chain patch

and leave routing digest behavior for the follow-on wave.
