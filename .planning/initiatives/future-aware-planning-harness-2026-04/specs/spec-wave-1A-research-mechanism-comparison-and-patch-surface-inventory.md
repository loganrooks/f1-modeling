# Wave 1A: Mechanism Comparison And Patch-Surface Inventory

**Wave:** 1
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** comparative mechanism research

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`

Then read these `f1-modeling` canon files:

4. `.planning/VISION.md`
5. `.planning/PROJECT.md`
6. `.planning/ROADMAP.md`
7. `.planning/STATE.md`
8. `.planning/TECH-DEBT.md`
9. `AGENTS.md`
10. `CLAUDE.md`

Then inspect the **current active GSDR runtime surfaces** this repo is actually sitting on top of:

11. `$HOME/.codex/get-shit-done-reflect/templates/context.md`
12. `$HOME/.codex/get-shit-done-reflect/templates/deliberation.md`
13. `$HOME/.codex/get-shit-done-reflect/templates/research.md`
14. `$HOME/.codex/get-shit-done-reflect/templates/state.md`
15. `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
16. `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md`
17. `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md`
18. `$HOME/.codex/get-shit-done-reflect/workflows/progress.md`
19. `$HOME/.codex/get-shit-done-reflect/workflows/signal.md`
20. `$HOME/.codex/get-shit-done-reflect/workflows/reflect.md`
21. `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md`
22. `$HOME/.codex/get-shit-done-reflect/workflows/verify-phase.md`
23. `$HOME/.codex/get-shit-done-reflect/workflows/validate-phase.md`

Then read these `prix-guesser` comparison files:

24. `/home/rookslog/workspace/projects/prix-guesser/AGENTS.md`
25. `/home/rookslog/workspace/projects/prix-guesser/WORKFLOW.md`
26. `/home/rookslog/workspace/projects/prix-guesser/.planning/LONG-ARC.md`
27. `/home/rookslog/workspace/projects/prix-guesser/.planning/deliberations/2026-04-10-future-awareness-harness-patch.md`
28. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/context.md`
29. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md`
30. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md`
31. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/research-phase.md`
32. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml`
33. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml`

---

## Research question

Which future-aware planning mechanisms in `prix-guesser` are actual behavioral levers, and what are the concrete patch surfaces in `f1-modeling` if we want analogous behavior here without pretending that prose-only guidance is enough?

This is not a product-doctrine comparison. This is a planning-harness mechanism audit.

Because `f1-modeling` runs on top of **GSD Reflect**, not plain GSD, the audit must distinguish carefully between:

- doctrine-only improvements
- Codex-visible repo-local guidance
- actual home-level GSDR behavior surfaces
- repo-local patch surfaces that could override or adapt that behavior

---

## Tasks

### Task A1 — Mechanism extraction

Identify the concrete mechanisms in `prix-guesser` that matter most, including:

- normalized `Future Awareness` buckets in context artifacts
- hard or semi-hard context gating
- `canonical_refs` propagation into downstream reads
- `future_preservation` in plans
- planner mapping rules for future-aware items
- checker failures for missing/generic preservation
- research disposition handling
- repo-local bootstrap / overlay behavior that makes the above durable

### Task A2 — Current-surface mapping in `f1-modeling`

For each mechanism above, identify the nearest active surface in `f1-modeling`, including where relevant:

- repo-local docs that Codex already reads
- current artifact conventions in `.planning/`
- home-level GSDR workflows/templates/prompts that currently govern behavior
- repo-local scripts/config/bootstrap surfaces
- validation / enforcement surfaces

For each identified surface, classify it as one of:

- documentary surface
- prompt-only surface
- active workflow behavior surface
- validation / enforcement surface
- missing surface

### Task A3 — Patch-surface inventory

Name the real patch target in `f1-modeling` for each mechanism.

The answer must not stop at “update docs.” For each mechanism, say whether the nearest meaningful patch target is:

- repo-local doctrine/governance file
- repo-local template or artifact convention
- home-level GSDR workflow/template that would need local shadowing or adaptation
- repo-local bootstrap/install/overlay surface
- checker/verification surface
- no viable target yet

### Task A4 — Borrowability judgment

For each mechanism, classify it as one of:

- `borrow now`
- `adapt now`
- `borrow later`
- `reject`

and explain why.

You must explicitly distinguish:

- mechanisms that are behavior-changing enough to matter now
- doctrine patterns that are useful but not sufficient on their own
- mechanisms that look portable in plain GSD but become misleading on GSDR

---

## Required output

Write to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surfaces.md`

The file must include:

1. Metadata
2. Executive Summary
3. Mechanisms extracted from `prix-guesser`
4. Current `f1-modeling` surfaces
5. Current home-level GSDR surfaces that materially matter
6. Behavior-changing vs doctrine-only classification
7. Mechanism-by-mechanism mapping table
8. Real patch surfaces in `f1-modeling`
9. GSDR-specific consequence of adopting each mechanism
10. `borrow now / adapt now / borrow later / reject` decisions
11. Risks of superficial adoption
12. Unresolved questions
13. References with concrete file paths

The mapping table must include, at minimum, these columns:

- mechanism
- implemented where in `prix-guesser`
- nearest current surface in `f1-modeling`
- nearest current surface in active GSDR runtime
- patch target here
- classification (`behavior-changing` / `doctrine-only` / `mixed`)
- recommendation

## Completion signal

At the end, print:

```text
Wave 1A complete.
- research/01-mechanism-comparison-and-patch-surfaces.md (XXX lines)
```
