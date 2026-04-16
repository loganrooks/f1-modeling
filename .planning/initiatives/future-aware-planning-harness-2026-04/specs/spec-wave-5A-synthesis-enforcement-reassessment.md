# Wave 5A: Synthesis Enforcement Reassessment

**Wave:** 5A
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** synthesis and residual-gap reassessment

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3-harness-patch-decisions.md`
7. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3B-core-harness-patch.md`
8. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3C-routing-digest-patch.md`
9. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/recheck-wave-3C-routing-digest-patch.md`
10. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/06-gsdr-subsystem-adaptation-policy.md`
11. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-4-gsdr-subsystem-adaptation-decisions.md`
12. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-4B-formal-gate-preflight-package.md`

Then read the live doctrine and landed enforcement-relevant surfaces:

13. `.planning/LONG-ARC.md`
14. `.planning/AGENTS.md`
15. `WORKFLOW.md`
16. `.planning/ARTIFACT-GOVERNANCE.md`
17. `.planning/STATE.md`
18. `.planning/TECH-DEBT.md`
19. `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/plan-phase.md`
20. `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/phase-prompt.md`
21. `.planning/audits/README.md`
22. `.planning/audits/templates/audit-request-template.md`
23. `.planning/audits/templates/audit-response-template.md`

Only inspect additional files if they are necessary to judge whether a real residual enforcement gap still exists.

---

## Reassessment question

After the landed Stage `3` routing/steering work and Stage `4` formal-gate package, what concrete enforcement or launch-truth gaps still remain that are worth solving before the `3.2` proving-ground application, and which ones should instead be deferred until after that proving ground produces evidence?

This is a reassessment wave, not an application wave.

---

## Binding constraints

This wave must:

- treat Stages `3` and `4` as accepted input
- explicitly classify each candidate enforcement lane as one of:
  - already landed / sufficient
  - worth application now
  - defer until after `3.2`
  - reject
- resist inventing enforcement just because Stage `5` exists in the old plan
- identify a `5B` only if one narrow remaining patch still has real leverage

This wave must **not**:

- patch any live files
- reopen Stage `3` or Stage `4`
- widen into `verify-phase.md` or `validate-phase.md`
- widen into signal automation or global skill patching
- turn the `3.2` proving-ground itself into a Stage `5` substitute

---

## Required output

Write:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/08-stage-5-enforcement-reassessment.md`

---

## Required synthesis tasks

### Task 5A.1 — Enumerate candidate residual enforcement lanes

At minimum, evaluate:

- planner/checker enforcement around `future_preservation` and `tech_debt_disposition`
- launch-truth capture for high-stakes work
- reduced-guarantee handling after the current routing patch
- formal-gate enforcement after the shared audit package

### Task 5A.2 — Classify each lane

For each candidate lane, state:

- current landed posture
- residual gap, if any
- classification
- rationale
- risk of doing more now
- risk of deferring until after `3.2`

### Task 5A.3 — Decide whether `5B` exists

If a `5B` still makes sense, define the narrowest coherent remaining application subset and likely patch surfaces.

If not, say Stage `5` should close without an application wave and route to Stage `6`.

### Task 5A.4 — Define Gate `5` questions

End with the exact questions the orchestrator should use to decide whether to launch a `5B` or skip directly to the `3.2` proving-ground application.

---

## Required structure for the output

The synthesis output must contain:

1. Metadata
2. Inputs consumed
3. Stage 5 framing
4. Residual enforcement matrix
5. Candidate `5B` subset or close-stage recommendation
6. Explicit not-now list
7. Gate `5` review questions
8. Risks / unresolved edges

---

## Completion signal

At the end, print:

```text
Wave 5A complete.
- synthesis/08-stage-5-enforcement-reassessment.md (XXX lines)
```
