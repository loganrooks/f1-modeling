# Wave 4A: Synthesis GSDR Subsystem Adaptation Policy

**Wave:** 4A
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** synthesis and classification only

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surface-inventory.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md`
7. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-1-mechanism-and-adaptation-decisions.md`
8. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/01-doctrine-and-governance-package.md`
9. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`
10. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3-harness-patch-decisions.md`
11. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3B-core-harness-patch.md`
12. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3C-routing-digest-patch.md`
13. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/recheck-wave-3C-routing-digest-patch.md`
14. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/05-routing-digest-patch-application.md`

Then read the live doctrine/governance shell that now constrains Stage 4:

15. `.planning/LONG-ARC.md`
16. `.planning/AGENTS.md`
17. `WORKFLOW.md`
18. `.planning/ARTIFACT-GOVERNANCE.md`
19. `.planning/STATE.md`
20. `.planning/TECH-DEBT.md`

Then inspect the current relevant GSDR / repo surfaces for the remaining subsystem lanes. At minimum, inspect the current local/runtime forms of the files that materially govern:

- deliberations and decision-anchor handling
- formal audit request/response handling
- signals / knowledge-store / reflection handling
- initiative / debrief / carry-forward scaffolding

Only inspect enough current surfaces to ground real adaptation decisions. Do not widen into speculative inventory beyond the Stage 4 lanes.

---

## Synthesis question

What single coherent Stage 4 policy package should govern the remaining GSDR-specific subsystem lanes so future-aware doctrine is carried through Reflect-only surfaces without turning the harness into five unrelated policy systems or widening into later enforcement/application work too early?

This is a synthesis wave, not an application wave.

---

## Binding constraints

This wave must:

- treat Stage `3` as accepted input rather than reopening steering-chain or routing work
- produce one coherent adaptation matrix across these lanes:
  - deliberations and decision anchors
  - audits and cross-model review requests
  - signals / knowledge-store / reflection
  - initiative / debrief / carry-forward scaffolding
- classify each lane clearly as one of:
  - application-worthy now
  - governance/doctrine only for now
  - later
  - reject
- identify candidate `4B` patch surfaces only for the lanes that are truly application-worthy now
- treat `STATE.md`, `progress/resume`, and `.planning/TECH-DEBT.md` as already-landed consumed inputs, not new mutation targets

This wave must **not**:

- patch any live repo or runtime files
- redesign `verify-phase.md` or `validate-phase.md`
- redesign audit request/response formats
- propose signal automation or reflection automation
- create a new research-disposition system
- fold the `3.2` phase proving-ground into Stage `4`
- reopen Stage `2` doctrine files or Stage `3` overlay surfaces

---

## Required output

Write:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/06-gsdr-subsystem-adaptation-policy.md`

---

## Required synthesis tasks

### Task 4A.1 — Build the subsystem lane matrix

For each Stage `4` lane, capture:

- why the lane matters to future-aware planning
- what the current carrier/surface is
- whether the lane needs enforcement now, governance now, later treatment, or rejection
- the concrete failure mode if left untreated
- the main overreach risk if treated too aggressively

### Task 4A.2 — Produce the Stage 4 policy decision package

The synthesis must make explicit decisions for each lane, not just analysis notes.

For each lane, state:

- decision classification
- rationale
- required doctrine inputs
- whether a `4B` application wave should touch it

### Task 4A.3 — Shape the candidate 4B application subset

If any lanes are application-worthy now, define the narrowest coherent `4B` subset:

- exact lanes in scope
- exact lanes out of scope
- likely file or patch surfaces to inspect later
- why this still reads as one harness adaptation wave rather than a scattered governance patch

If no lanes are application-worthy now, say so explicitly.

### Task 4A.4 — Define Gate 4 questions

End with the exact review questions the orchestrator should use before any `4B` application wave is launched.

These questions should force decisions on:

- doctrine-only vs application-worthy now
- coherence vs policy sprawl
- usefulness vs governance weight
- whether any proposed `4B` is still narrow enough

---

## Required structure for the output

The synthesis output must contain:

1. Metadata
2. Inputs consumed
3. Stage 4 framing
4. Subsystem adaptation matrix
5. Candidate `4B` subset
6. Explicit not-now list
7. Gate `4` review questions
8. Risks / unresolved edges

---

## Review focus for the orchestrator

When this wave comes back, review for:

- whether it stayed at policy/classification level
- whether it resisted schema-cloning across every subsystem
- whether the application-worthy subset is genuinely narrow
- whether it preserved Stage `3` as accepted input
- whether the Stage `4` package still reads as one harness adaptation path

---

## Completion signal

At the end, print:

```text
Wave 4A complete.
- synthesis/06-gsdr-subsystem-adaptation-policy.md (XXX lines)
```
