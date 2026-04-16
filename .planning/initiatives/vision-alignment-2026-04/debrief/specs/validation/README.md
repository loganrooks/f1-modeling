# Debrief Validation Spec Layer

This directory defines the canonical late-pass validation sublayer for the debrief system.

The primary debrief specs in `../` answer what happened, what mattered, and what should change. The validation sublayer exists to challenge whether those debrief outputs are as well-supported as they claim to be before final closeout hardens them into durable record.

The design is grounded by:

- `../../DEBRIEF-PLAN.md` traceability and context-budget rules
- `../../SPEC-INDEX.md` output ownership and sequencing
- `../../runs/2026-04-16-llm-sweep/reports/H-neglect-and-counterevidence.md`, which identified four recurring miss classes that should become permanent validation checks rather than one-off adversarial commentary

## What This Layer Validates

The validation specs focus on four failure modes that can survive a competent debrief:

1. coverage-confidence inflation
2. synthesis flattening that turns nuanced upstream claims into cleaner but stronger summary prose
3. skipped branches and non-events that were recorded but never evaluated for consequence
4. application claims that rely on ledgers or summaries without direct reread or diff-grade proof in live files

## Position In The Debrief System

These specs are not replacements for Specs A-F. They are late-cycle challenge passes.

Recommended order:

1. Run the primary debrief specs that generate `TIMELINE.md`, `FINDINGS.md`, `EPISTEMIC-AND-CONTRACT-REVIEW.md`, `INTERACTION-REVIEW.md`, and draft summary/change outputs.
2. Run Validation A and Validation C once timeline and extract-backed outputs exist.
3. Run Validation B once summary prose and high-level findings are drafted.
4. Run Validation D before final debrief closeout or any claim that the initiative's outcomes were applied to live planning files.
5. Promote accepted corrections into the top-level debrief files only after reviewing the validation reports locally.

## Common Contract

By default, each validation spec writes a compact report beside the spec in this directory. Those reports are evidence drafts for the synthesis owner, not automatic edits to the canonical debrief outputs.

Common disposition tags:

- `verified`: the current claim is supported as written
- `soften`: directionally right, but the wording outruns the evidence
- `reopen`: the gap is material enough that upstream debrief synthesis should be revisited
- `unverified`: the claim may be true, but the current debrief does not prove it

Common rules:

- Name the exact claim being validated.
- Distinguish `reviewed`, `sampled`, `unreviewed`, and `not available` evidence classes.
- Separate outcome claims from causal claims.
- Treat ledger entries and summaries as pointers, not proof.
- Prefer rereads of canonical files and upstream detailed reviews over downstream summary phrasing.
- If a validation pass cannot finish inside its context budget, record the reason instead of silently widening scope.

## Spec Map

| Validation spec | Purpose | Best run point | Default report |
| --- | --- | --- | --- |
| `spec-validation-A-coverage-and-neglect.md` | Measure actual evidence coverage and force explicit blind-spot accounting | After extracts and core debrief outputs exist | `report-validation-A-coverage-and-neglect.md` |
| `spec-validation-B-synthesis-flattening-checks.md` | Compare nuanced upstream claims against later summary prose and detect over-compression | After findings and summary prose are drafted | `report-validation-B-synthesis-flattening-checks.md` |
| `spec-validation-C-skipped-branches-and-non-events.md` | Evaluate whether planned-but-unexecuted branches matter to the debrief's conclusions | After `TIMELINE.md` exists | `report-validation-C-skipped-branches-and-non-events.md` |
| `spec-validation-D-live-file-application-verification.md` | Verify that claimed live-file applications are proven by direct reread or diff evidence | Before final closeout | `report-validation-D-live-file-application-verification.md` |

## Delegation Posture

Validation specs are good bounded review tasks, but their outputs should stay provisional until the local owner checks the cited evidence and decides what to promote into the canonical debrief record.
