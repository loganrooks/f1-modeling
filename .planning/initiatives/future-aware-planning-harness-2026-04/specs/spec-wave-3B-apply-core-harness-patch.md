# Wave 3B: Apply Core Harness Patch

**Wave:** 3B
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** repo-local overlay/bootstrap and core steering-chain application

---

## MANDATORY: Read initiative files first

Before doing anything else, read:

1. `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
2. `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
3. `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
4. `.planning/initiatives/future-aware-planning-harness-2026-04/SPEC-INDEX.md`
5. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/03-harness-patch-plan.md`
6. `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/review-wave-3-harness-patch-decisions.md`

Then read the doctrine shell and active repo surfaces this wave must honor:

7. `.planning/LONG-ARC.md`
8. `.planning/AGENTS.md`
9. `WORKFLOW.md`
10. `.planning/ARTIFACT-GOVERNANCE.md`
11. `AGENTS.md`
12. `.planning/STATE.md`
13. `.planning/TECH-DEBT.md`

Then inspect the active runtime surfaces that this wave will patch via the repo-local overlay:

14. `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
15. `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md`
16. `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md`
17. `$HOME/.codex/get-shit-done-reflect/templates/context.md`
18. `$HOME/.codex/get-shit-done-reflect/templates/phase-prompt.md`

Use the Stage 3A patch plan as the source of truth for behavior shape. Use the Wave 3 review gate as the source of truth for scope narrowing.

---

## Application question

What repo-local overlay/bootstrap and core steering-chain changes should be applied now so the doctrine shell becomes real planning behavior, while keeping routing digest changes out of this first Stage 3 application wave?

This is an application wave, not a synthesis wave.

---

## Binding constraints

This wave must:

- create a tracked repo-local overlay as the reviewed source of truth
- create bootstrap/verify surfaces that materialize the overlay into the active home runtime
- patch only the core steering-chain surfaces approved by the Wave 3 review gate
- preserve the Stage 2 doctrine shell
- preserve the rejection of full artifact symmetry
- keep `RESEARCH.md` on `Genuine Gaps` / `Still Open` rather than adding a first-pass research-disposition layer
- keep Codex `gsdr-*` skill wrappers unchanged in this wave

This wave must **not**:

- patch `progress.md`
- patch `resume-project.md`
- patch `templates/state.md`
- patch `verify-phase.md` or `validate-phase.md`
- change signal automation or reflection behavior
- redesign audit subsystems
- create a full repo-local GSDR fork

---

## Required outputs

Create or update these repo-tracked files:

- `tooling/future-aware-harness/README.md`
- `tooling/future-aware-harness/manifest.json`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/discuss-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/research-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/plan-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/context.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/phase-prompt.md`
- `scripts/setup-future-aware-harness.sh`
- `scripts/verify-future-aware-harness.sh`

Materialize the overlay into the active home runtime using the created bootstrap path.

Then write an application summary to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/04-core-harness-patch-application.md`

---

## Required application tasks

### Task 3B.1 — Create the tracked overlay tree

Create the repo-local overlay tree approved by `3A`, but only for the narrowed core surfaces.

The overlay should contain only the files this wave actually patches.

### Task 3B.2 — Create bootstrap and verify scripts

Create:

- `scripts/setup-future-aware-harness.sh`
- `scripts/verify-future-aware-harness.sh`

The setup script should:

- verify the expected upstream GSDR version or file signatures before patching
- back up the targeted home runtime files
- copy overlay files into the matching home runtime paths
- write an install receipt or equivalent drift-trace artifact under the active home runtime

The verify script should:

- compare overlay files against the materialized home runtime files
- detect drift after upstream updates
- fail loudly when the active runtime no longer matches the repo-tracked overlay

### Task 3B.3 — Apply the `CONTEXT.md` producer patch

Patch the overlay copy of:

- `workflows/discuss-phase.md`
- `templates/context.md`

Implement:

- normalized `Future Awareness` buckets
- retention of existing mode-specific steering sections
- `Canonical References` as the carrier for extra authoritative inputs
- automatic seeding of `.planning/LONG-ARC.md` into canonical refs

Do not add debt disposition or research-disposition behavior here.

### Task 3B.4 — Apply the `RESEARCH.md` consumer patch

Patch the overlay copy of:

- `workflows/research-phase.md`

Implement:

- canonical-ref resolution and reading before the researcher prompt
- explicit passage of future-aware constraints into research

Do not patch:

- `templates/research.md`
- `Genuine Gaps`
- `Still Open`
- spike-routing semantics

### Task 3B.5 — Apply the `PLAN.md` core patch

Patch the overlay copy of:

- `workflows/plan-phase.md`
- `templates/phase-prompt.md`

Implement:

- context required by default
- `--allow-no-context` as the explicit reduced-guarantee bypass
- canonical-ref resolution for planner and checker reads
- structured `future_preservation`
- structured `tech_debt_disposition`
- plan-checker failures for missing or generic preservation/debt entries on new plans

Keep legacy artifact compatibility explicit.

### Task 3B.6 — Materialize and verify

Run the created setup and verify path so the active home runtime reflects the repo-tracked overlay for this narrowed wave.

If anything prevents a safe materialization, document it explicitly in the application summary rather than silently claiming the patch is live.

### Task 3B.7 — Record application summary

Write `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/04-core-harness-patch-application.md`.

It must include:

1. Metadata
2. Files created or updated
3. What runtime surfaces were actually materialized
4. What steering-chain behavior changed
5. Compatibility behavior for legacy contexts/plans
6. What was intentionally deferred to the later routing-focused wave
7. Risks or unresolved edges after application

---

## Review focus for the orchestrator

When this wave comes back, review for:

- whether the overlay is the real source of truth rather than a stale copy
- whether the bootstrap/verify path is reversible and trustworthy
- whether the active runtime was actually updated safely
- whether `CONTEXT` / `RESEARCH` / `PLAN` responsibilities stayed cleanly separated
- whether canonical-ref propagation and `future_preservation` are real behavior, not template theater
- whether routing digest work truly stayed out of scope

---

## Completion signal

At the end, print:

```text
Wave 3B complete.
- tooling/future-aware-harness/README.md
- tooling/future-aware-harness/manifest.json
- tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/discuss-phase.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/research-phase.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/plan-phase.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/context.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/phase-prompt.md
- scripts/setup-future-aware-harness.sh
- scripts/verify-future-aware-harness.sh
- synthesis/04-core-harness-patch-application.md (XXX lines)
```
