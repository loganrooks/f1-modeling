# Wave 1B: GSDR Subsystem Adaptation Inventory

**Wave:** 1
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** adaptation inventory research

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`

Then read these `f1-modeling` files and surfaces:

4. `.planning/VISION.md`
5. `.planning/PROJECT.md`
6. `.planning/ROADMAP.md`
7. `.planning/STATE.md`
8. `.planning/TECH-DEBT.md`
9. `AGENTS.md`
10. `CLAUDE.md`
11. `.planning/initiatives/vision-alignment-2026-04/README.md`
12. `.planning/initiatives/vision-alignment-2026-04/SUMMARY.md`
13. `.planning/initiatives/vision-alignment-2026-04/debrief/PATTERNS-TO-KEEP.md`
14. `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md`

Then inspect the **current active GSDR runtime surfaces** relevant to subsystem behavior:

15. `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
16. `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md`
17. `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md`
18. `$HOME/.codex/get-shit-done-reflect/workflows/progress.md`
19. `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md`
20. `$HOME/.codex/get-shit-done-reflect/workflows/signal.md`
21. `$HOME/.codex/get-shit-done-reflect/workflows/reflect.md`
22. `$HOME/.codex/get-shit-done-reflect/workflows/verify-phase.md`
23. `$HOME/.codex/get-shit-done-reflect/workflows/validate-phase.md`
24. `$HOME/.codex/get-shit-done-reflect/templates/context.md`
25. `$HOME/.codex/get-shit-done-reflect/templates/research.md`
26. `$HOME/.codex/get-shit-done-reflect/templates/deliberation.md`
27. `$HOME/.codex/get-shit-done-reflect/templates/state.md`
28. relevant repo-installed skill surfaces under `$HOME/.codex/skills/gsdr-*` where they materially shape orchestration or artifact expectations

---

## Research question

If `f1-modeling` adopts a future-aware planning harness on top of GSDR, which additional Reflect-only subsystems need explicit adaptation, and which ones should remain lightly governed instead of force-fit into the same enforcement model?

This research should prevent a plain-GSD patch from being copied into the wrong architecture.

---

## Tasks

### Task B1 — Subsystem inventory

Create a concrete inventory of the major GSDR-relevant subsystems that could carry future-aware obligations here, including at minimum:

- phase context / research / plan / verification
- deliberations and decision anchors
- audits and cross-model review requests
- signals and knowledge store entries
- progress / resume / state routing
- initiatives / debriefs / carry-forward ledgers
- tech-debt and rewrite-trigger governance

### Task B2 — Adaptation need assessment

For each subsystem above, answer:

- does it need explicit future-aware structure?
- if yes, what kind?
- should that structure be enforced, advisory, or left alone?
- what failure mode would occur if we ignore it?
- what is the nearest current runtime or repo-local patch surface?

### Task B3 — Integration recommendations

Produce a concrete matrix that says, for each subsystem:

- `borrow now`
- `adapt now`
- `later`
- `reject`

and explain the consequence of each choice.

You must explicitly distinguish between:

- subsystem lanes that need actual harness enforcement
- subsystem lanes that only need clearer doctrine/governance
- subsystem lanes where forcing the same structure would be overreach

---

## Required output

Write to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md`

The file must include:

1. Metadata
2. Executive Summary
3. Subsystem inventory
4. Current carrier surface for each subsystem
5. Adaptation matrix
6. Enforcement-vs-advisory recommendations
7. GSDR-specific consequences of getting the subsystem wrong
8. Interactions between subsystems
9. Immediate versus deferred subsystem changes
10. Risks of over-patching versus under-patching
11. Unresolved questions
12. References with concrete file paths

The adaptation matrix must include, at minimum, these columns:

- subsystem
- current carrier in `f1-modeling`
- current carrier in active GSDR runtime
- recommended future-aware treatment
- enforcement level (`enforced` / `advisory` / `none`)
- nearest patch surface
- timing (`now` / `later` / `reject`)
- failure mode if omitted

## Completion signal

At the end, print:

```text
Wave 1B complete.
- research/02-gsdr-subsystem-adaptation-inventory.md (XXX lines)
```
