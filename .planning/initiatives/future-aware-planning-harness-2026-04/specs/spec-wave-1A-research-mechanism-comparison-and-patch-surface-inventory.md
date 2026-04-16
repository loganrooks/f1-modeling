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

Then read these `prix-guesser` comparison files:

11. `/home/rookslog/workspace/projects/prix-guesser/AGENTS.md`
12. `/home/rookslog/workspace/projects/prix-guesser/WORKFLOW.md`
13. `/home/rookslog/workspace/projects/prix-guesser/.planning/LONG-ARC.md`
14. `/home/rookslog/workspace/projects/prix-guesser/.planning/deliberations/2026-04-10-future-awareness-harness-patch.md`
15. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/context.md`
16. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md`
17. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md`
18. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-planner.toml`
19. `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/agents/gsd-plan-checker.toml`

---

## Research question

Which future-aware planning mechanisms in `prix-guesser` are actual behavioral levers, and what are the concrete patch surfaces in `f1-modeling` if we want analogous behavior here without pretending that prose-only guidance is enough?

This is not a product-doctrine comparison. This is a planning-harness mechanism audit.

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

### Task A2 — Patch-surface mapping in `f1-modeling`

For each mechanism above, identify the nearest active surface in `f1-modeling`, such as:

- repo-local docs that Codex already reads
- phase artifact templates or conventions
- GSDR workflows or prompts
- repo-local scripts/config/bootstrap surfaces
- planning verification/checker surfaces

Distinguish clearly between:

- documentary surfaces
- prompt-only surfaces
- actual workflow behavior surfaces
- validation / enforcement surfaces

### Task A3 — Borrowability judgment

For each mechanism, classify it as one of:

- `borrow now`
- `adapt now`
- `borrow later`
- `reject`

and explain why.

---

## Required output

Write to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surfaces.md`

The file must include:

1. Metadata
2. Executive Summary
3. Mechanisms extracted from `prix-guesser`
4. Current `f1-modeling` surfaces
5. Mechanism-by-mechanism mapping table
6. Real patch surfaces in `f1-modeling`
7. `borrow now / adapt now / borrow later / reject` decisions
8. Risks of superficial adoption
9. Unresolved questions
10. References with concrete file paths

## Completion signal

At the end, print:

```text
Wave 1A complete.
- research/01-mechanism-comparison-and-patch-surfaces.md (XXX lines)
```
