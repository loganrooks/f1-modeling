# Debrief

This directory is for the post-initiative retrospective on Vision Alignment 2026-04.

Its purpose is not to restate the initiative. Its purpose is to answer:

- what went well
- what went wrong
- what almost went wrong
- what should change in future initiatives, audits, and phase planning
- what concrete follow-up should be carried into the live project

## Start Here

- `DEBRIEF-PLAN.md` — the execution plan for running the debrief
- `SPEC-INDEX.md` — traceable map from debrief specs to original initiative waves, gates, and outputs
- `EVIDENCE-INDEX.md` — the curated evidence set for the debrief
- `CARRY-FORWARD-LEDGER.md` — where accepted lessons and actions should be recorded
- `specs/transcript/README.md` — canonical transcript prep, extraction, and residual miss-audit layer
- `specs/validation/README.md` — canonical late-pass challenge layer before closeout
- `specs/runs/README.md` — reusable runbook/meta-spec layer for bounded sweeps
- `runs/2026-04-16-llm-sweep/` — historical xhigh lane execution that informed the canonical spec architecture

## Canonical Structure

This debrief now has five canonical parts:

- top-level debrief outputs in this directory
- core bounded work contracts in `specs/spec-debrief-A` through `specs/spec-debrief-H`
- transcript-processing doctrine in `specs/transcript/`
- late-pass validation doctrine in `specs/validation/`
- reusable run-manifest and orchestration doctrine in `specs/runs/`

The older prompt files in `specs/extraction/` are still useful, but they are subordinate to `specs/transcript/` on transcript-processing rules.

## Expected Outputs

The debrief should eventually produce:

- `TIMELINE.md` — dated factual reconstruction of what happened
- `FINDINGS.md` — evidence-backed wins, failures, near-failures, and overhead
- `EPISTEMIC-AND-CONTRACT-REVIEW.md` — evaluation of research quality, deliberation reliability, traceability, and adherence to governing docs
- `INTERACTION-REVIEW.md` — analysis of user/model interactions, frustration points, productive turns, model-role differences, and agent usage patterns
- `MODEL-ROLE-AND-DIVISION-OF-LABOR.md` — recommended future split of responsibilities grounded in the initiative's actual evidence
- `NEGLECT-AND-COUNTEREVIDENCE.md` — adversarial pass over under-supported claims, skipped branches, and overconfident synthesis
- `PATTERNS-TO-KEEP.md` — good practices worth standardizing
- `CHANGES-BEFORE-NEXT-INITIATIVE.md` — the short operational change list for the next strategic initiative
- `DEBRIEF-SUMMARY.md` — concise retrospective outcome
- updates to `CARRY-FORWARD-LEDGER.md`
- new or updated signals / guardrails / planning docs when findings warrant them

The bounded task contracts for producing those outputs live in `specs/`.
Transcript extraction staging lives in `extracts/`.
Parallel lane-run evidence lives in `runs/`.

## Ground Rule

A debrief point is not complete until it has one of these dispositions:

- applied to a live project/planning file
- recorded as a signal
- added to the carry-forward ledger with a named destination
- explicitly rejected with reason

If it has no disposition, it is commentary, not a lesson.
