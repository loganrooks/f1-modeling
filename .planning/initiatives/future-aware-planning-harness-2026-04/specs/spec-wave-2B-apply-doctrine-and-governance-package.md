# Wave 2B: Apply Doctrine And Governance Package

**Wave:** 2B
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** concrete application to live planning files

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-1-mechanism-and-adaptation-decisions.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/01-doctrine-and-governance-package.md`

Then read the current live planning surfaces that this wave will create or update:

7. `.planning/VISION.md`
8. `.planning/PROJECT.md`
9. `.planning/ROADMAP.md`
10. `.planning/STATE.md`
11. `.planning/TECH-DEBT.md`
12. `CLAUDE.md`
13. if present on disk, `AGENTS.md`

---

## Application question

What concrete live planning files should be created or updated now so the Wave 2A doctrine/governance package becomes real in the repo without overreaching into later harness-patch work?

This is an **application pass**, not another synthesis pass.

---

## Required outputs

Create or update these live files:

- `.planning/LONG-ARC.md`
- `.planning/AGENTS.md`
- `WORKFLOW.md`
- `.planning/ARTIFACT-GOVERNANCE.md`
- root `AGENTS.md` as a **narrow companion routing file**, created or updated only in a way that preserves the existing repo-root GSD workflow guidance already active for this repo

Then write an application summary to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/02-doctrine-and-governance-application.md`

---

## Binding constraints

The application must preserve the Wave 1 and Wave 2A decisions:

- keep the doctrine/governance shell narrow
- keep the main shell to the four core files above
- treat root `AGENTS.md` as a narrow visibility/router companion, not a fifth heavy doctrine file
- preserve the existing repo-root GSD workflow guidance when creating or updating `AGENTS.md`; add planning-routing behavior without replacing the current GSD runtime guidance
- reject full artifact symmetry across Reflect surfaces
- do not add a dedicated first-pass research-disposition mechanism
- do not patch harness behavior in this wave; this wave creates doctrine/governance surfaces only

This wave should be concrete and apply-ready, but it must not silently broaden into:

- global GSDR install changes
- planner/checker workflow edits
- signal automation
- verify/validate uplift
- large roadmap or state rewrites beyond the minimal references needed by the new files

---

## Application tasks

### Task 2B.1 — Create the doctrine shell

Create `.planning/LONG-ARC.md` from the Wave 2A recommendation.

The file should:

- sit clearly between `VISION.md` and live operational canon
- define current posture, protected seams, explicit non-decisions, future shape notes, tech-debt interaction, and reopen conditions
- be concise enough to stay live, not become a second roadmap

### Task 2B.2 — Create the planning-agent contract

Create `.planning/AGENTS.md`.

The file should:

- define read order and doctrine hierarchy for planning work
- state the future-aware planning contract
- identify enforcement-now versus governance-only lanes
- state the symmetry rejection cleanly
- make formal audit readiness expectations explicit

### Task 2B.3 — Create the workflow file

Create `WORKFLOW.md`.

The file should:

- define the source-of-truth stack
- define the standard planning loop
- define reduced-guarantee no-context handling
- define the `STATE.md` digest expectations
- define formal audit preflight
- define decision-anchor, signal/reflection, and initiative carry-forward operating rules

### Task 2B.4 — Create the artifact-governance file

Create `.planning/ARTIFACT-GOVERNANCE.md`.

The file should:

- define artifact classes and their authority boundaries
- define steering-artifact rules
- define governance-interface rules
- define status and supersession rules
- make the symmetry rejection and maintenance rule explicit

### Task 2B.5 — Align root `AGENTS.md` narrowly

Create or update root `AGENTS.md` as a narrow companion router.

Important:

- If root `AGENTS.md` exists on disk, preserve its current guidance and integrate the new planning-routing layer narrowly.
- If root `AGENTS.md` does not exist on disk, create one that preserves the current active repo-root GSD workflow guidance already in use for this repo and adds a short planning-routing layer that points to `.planning/AGENTS.md`, `.planning/STATE.md`, `.planning/LONG-ARC.md`, and the active planning files.
- Do not turn root `AGENTS.md` into a duplicate of `.planning/AGENTS.md`.

### Task 2B.6 — Record application summary

Write `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/02-doctrine-and-governance-application.md`.

It should include:

1. Metadata
2. Files created or updated
3. Summary of what was applied from Wave 2A
4. Any narrow deviations from the Wave 2A proposal and why
5. Known follow-ons intentionally left for later waves
6. Risks or unresolved edges after application

---

## Review focus for the orchestrator

When this wave comes back, review for:

- doctrine clarity without duplication
- Codex visibility through root `AGENTS.md`
- correct separation between doctrine/governance and later harness behavior
- no accidental schema cloning across Reflect surfaces
- no accidental overwrite of existing repo-root GSD guidance

---

## Completion signal

At the end, print:

```text
Wave 2B complete.
- .planning/LONG-ARC.md
- .planning/AGENTS.md
- WORKFLOW.md
- .planning/ARTIFACT-GOVERNANCE.md
- AGENTS.md
- synthesis/02-doctrine-and-governance-application.md (XXX lines)
```
