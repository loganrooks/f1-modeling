# Wave 3A: Harness Patch Plan Synthesis

**Wave:** 3A
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** synthesis and implementation-planning

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-1-mechanism-and-adaptation-decisions.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/01-doctrine-and-governance-package.md`
7. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/02-doctrine-and-governance-application.md`
8. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-2B-doctrine-and-governance-application.md`
9. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/recheck-wave-2B-doctrine-and-governance-application.md`

Then read the live doctrine/governance shell that Stage 3 must target:

10. `.planning/LONG-ARC.md`
11. `.planning/AGENTS.md`
12. `WORKFLOW.md`
13. `.planning/ARTIFACT-GOVERNANCE.md`
14. `AGENTS.md`
15. `.planning/STATE.md`
16. `.planning/TECH-DEBT.md`

Then inspect the current active GSDR runtime surfaces that would actually need patching or shadowing for Stage 3:

17. the current home-level phase steering workflows and templates under `$HOME/.codex/get-shit-done-reflect/`
18. the current relevant Codex skill surfaces under `$HOME/.codex/skills/gsdr-*`

Focus especially on:

- discuss / research / plan / progress / resume routing
- steering templates for context and plan artifacts
- checker or review surfaces that could later consume preservation and debt disposition

---

## Synthesis question

What exact repo-local harness/bootstrap and steering-chain patch plan should `f1-modeling` adopt now so the Stage 2 doctrine shell becomes real workflow behavior without overreaching into later subsystem or enforcement waves?

This is a patch-plan synthesis pass, not an application pass.

The result should be specific enough to apply in a later wave with minimal reinterpretation.

---

## Binding constraints

The synthesis must preserve the accepted Wave 1 and Wave 2 decisions:

- keep the doctrine shell narrow and load-bearing
- keep Stage 3 focused on active steering-chain behavior and repo-local reproducibility
- keep Stage 4 for Reflect-subsystem adaptation beyond the steering chain
- reject full artifact symmetry across Reflect surfaces
- do not add a dedicated first-pass research-disposition mechanism unless it is explicitly harmonized with `Genuine Gaps` and spike routing
- do not silently broaden into signal automation, verify/validate uplift, or full subsystem redesign

This synthesis must also stay honest about the difference between:

- repo-local doctrine files
- repo-local overlay/bootstrap behavior
- home-level GSDR runtime surfaces
- later-wave enforcement or subsystem work

---

## Required output

Write to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`

The file must include:

1. Metadata
2. Executive summary
3. Current active patch-surface map
4. Recommended repo-local overlay/bootstrap strategy
5. Recommended target file tree for repo-local harness surfaces
6. Steering-chain patch plan
7. Canonical-reference propagation plan
8. Compatibility and migration strategy
9. Explicit defer/reject decisions for items that belong to later waves
10. Risks and open review-gate decisions

---

## Required synthesis tasks

### Task 3A.1 — Patch-surface map

Identify the exact current active surfaces that matter for Stage 3:

- home-level GSDR workflow files
- home-level templates
- relevant `gsdr-*` skill surfaces
- any existing repo-local files that should become the shadow/overlay target

For each surface, classify whether it is:

- behavior-changing now
- doctrine-adjacent but not behavior-changing
- required only as a reference input

### Task 3A.2 — Repo-local overlay/bootstrap strategy

Recommend the exact repo-local strategy for making the harness patch durable and reviewable.

Answer concretely:

- should `f1-modeling` introduce a tracked repo-local overlay path
- where should that overlay live
- what bootstrap/setup surface should activate it
- how should it coexist with the home-level GSDR install
- what is the minimal viable Stage 3 path that is reviewable and reversible

### Task 3A.3 — Steering-chain patch plan

Design the Stage 3 steering-chain patch plan for:

- normalized `Future Awareness` buckets in context artifacts
- structured `future_preservation` in plans
- debt disposition expectations
- reduced-guarantee no-context signaling

The plan must stay specific about which artifact carries which responsibility.

Do not blur:

- `CONTEXT.md`
- `RESEARCH.md`
- `PLAN.md`
- state/resume routing
- later verification or validation surfaces

### Task 3A.4 — Canonical-reference propagation plan

Design the concrete mechanism by which context-level canonical references should flow into downstream reads.

The output should name:

- the carrier surface
- the downstream consumer surfaces
- the compatibility story for older phase artifacts
- the narrowest viable first-pass implementation path

### Task 3A.5 — Compatibility and migration

Specify:

- what happens to old phase artifacts
- what remains backward-compatible
- when reduced-guarantee handling must be used
- what the first proving-ground `3.2` planning path would need from the Stage 3 patch

### Task 3A.6 — Explicit defer/reject boundaries

State clearly what Stage 3 still does **not** include.

This should explicitly classify at least:

- research-disposition follow-on
- deliberation/anchor schema changes
- audit subsystem expansion beyond steering-chain preflight
- signal automation
- verify/validate uplift
- broader initiative/debrief changes

---

## Review focus for the orchestrator

When this wave comes back, review for:

- whether the patch plan is truly repo-local and reproducible
- whether it names real behavior levers rather than only writing better prose
- whether the steering-chain responsibilities stay cleanly separated
- whether canonical-ref propagation is concrete enough to implement
- whether the migration and override story is explicit
- whether anything has silently drifted into Stage 4 or Stage 5 scope

---

## Completion signal

At the end, print:

```text
Wave 3A complete.
- synthesis/03-harness-patch-plan.md (XXX lines)
```
