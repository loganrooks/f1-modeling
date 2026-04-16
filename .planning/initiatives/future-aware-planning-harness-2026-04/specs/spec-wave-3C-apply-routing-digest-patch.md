# Wave 3C: Apply Routing Digest Patch

**Wave:** 3C
**Model:** gpt-5.4
**Reasoning effort:** xhigh
**Mode:** routing-focused overlay extension and live state uplift

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
8. `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/04-core-harness-patch-application.md`

Then read the doctrine shell and current routing surfaces:

9. `.planning/LONG-ARC.md`
10. `.planning/AGENTS.md`
11. `WORKFLOW.md`
12. `.planning/ARTIFACT-GOVERNANCE.md`
13. `.planning/STATE.md`
14. `.planning/TECH-DEBT.md`

Then inspect the current tracked overlay/runtime surfaces for the routing wave:

15. `tooling/future-aware-harness/manifest.json`
16. `scripts/setup-future-aware-harness.sh`
17. `scripts/verify-future-aware-harness.sh`
18. `$HOME/.codex/get-shit-done-reflect/workflows/progress.md`
19. `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md`
20. `$HOME/.codex/get-shit-done-reflect/templates/state.md`

---

## Application question

What routing-focused overlay and live-state changes should be applied now so future-aware doctrine, active tech-debt posture, and reduced-guarantee status become visible in `STATE`, `progress`, and `resume`, without widening into later subsystem or enforcement work?

This is an application wave, not a synthesis wave.

---

## Binding constraints

This wave must:

- extend the existing overlay rather than invent a second patch mechanism
- patch only the routing-focused surfaces approved by the Stage 3 review chain
- update the live `.planning/STATE.md` to the new digest shape for the current project posture
- re-materialize and re-verify the active runtime after adding the routing targets

This wave must **not**:

- patch `verify-phase.md`
- patch `validate-phase.md`
- redesign signal or reflection behavior
- redesign audit request/response flows
- broaden into deliberation or decision-anchor schema changes
- create a new research-disposition mechanism

---

## Required outputs

Create or update these repo-tracked files:

- `tooling/future-aware-harness/README.md`
- `tooling/future-aware-harness/manifest.json`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/progress.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/resume-project.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/state.md`
- `.planning/STATE.md`

Reuse the existing bootstrap/verify path by updating the overlay/manifest as needed.

Then write an application summary to:

- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/05-routing-digest-patch-application.md`

---

## Required application tasks

### Task 3C.1 — Extend the overlay manifest

Update the tracked overlay metadata so the routing files become first-class managed targets:

- `workflows/progress.md`
- `workflows/resume-project.md`
- `templates/state.md`

Keep the existing manifest/bootstrap model intact.

### Task 3C.2 — Apply the routing overlay patch

Patch the overlay copies of:

- `workflows/progress.md`
- `workflows/resume-project.md`
- `templates/state.md`

Implement:

- compact `STATE.md` digest expectations
- surfacing of active doctrine refs
- surfacing of active tech-debt ids
- surfacing of reduced-guarantee status
- progress/resume presentation that points back to `discuss-phase` or replan when reduced-guarantee planning is active

Keep the digest pointer-heavy. Do not turn routing into a second doctrine file.

### Task 3C.3 — Uplift the live `.planning/STATE.md`

Update the current live `.planning/STATE.md` so it conforms to the new digest expectations for the current project state.

The digest should reflect the current truth, including:

- active doctrine refs
- active relevant tech-debt ids
- reduced-guarantee status, if any

Do not rewrite the whole state file unnecessarily.

### Task 3C.4 — Re-materialize and verify

Use the existing setup and verify path to materialize the added routing targets into the active home runtime.

If re-materialization or verification fails, document it explicitly in the application summary rather than claiming the patch is live.

### Task 3C.5 — Record application summary

Write `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/05-routing-digest-patch-application.md`.

It must include:

1. Metadata
2. Files created or updated
3. Routing surfaces actually materialized
4. What `STATE`, `progress`, and `resume` now do differently
5. Current live digest values applied to `.planning/STATE.md`
6. What remains intentionally deferred after this wave
7. Risks or unresolved edges after application

---

## Review focus for the orchestrator

When this wave comes back, review for:

- whether the routing digest stayed compact and pointer-heavy
- whether `.planning/STATE.md` was updated truthfully rather than ceremonially
- whether reduced-guarantee status is surfaced clearly
- whether the manifest/bootstrap/verify flow still works cleanly with the added targets
- whether the wave stayed out of later subsystem and enforcement work

---

## Completion signal

At the end, print:

```text
Wave 3C complete.
- tooling/future-aware-harness/README.md
- tooling/future-aware-harness/manifest.json
- tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/progress.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/resume-project.md
- tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/state.md
- .planning/STATE.md
- synthesis/05-routing-digest-patch-application.md (XXX lines)
```
