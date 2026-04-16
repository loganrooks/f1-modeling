# Spec: Debrief D - Carry-Forward Synthesis And Next-Initiative Changes

## Objective

Convert the debrief from analysis into durable operational changes, with clear dispositions for every material finding.

## Original Initiative Traceability

This spec closes the loop between:

- the debrief outputs created by Specs A-C and E
- the original initiative's applied consequences in live planning files
- the future workflow and template changes needed before the next strategic initiative

## Required Inputs

- `../TIMELINE.md`
- `../FINDINGS.md`
- `../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../PATTERNS-TO-KEEP.md`
- `../EVIDENCE-INDEX.md`
- `../APPLICATION-LEDGER.md`
- `../README.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md`

## Context Budget

Target:

- soft target: `<=100K` estimated tokens

Recommended core pack:

- the completed outputs from Specs A-C and E
- `../APPLICATION-LEDGER.md` (`~0.6K`)
- `../README.md` (`~1.2K`)
- `.planning/ROADMAP.md` (`~6.8K`)
- `.planning/STATE.md` (`~4.0K`)
- `.planning/TECH-DEBT.md` (`~2.2K`)
- `CLAUDE.md` (`~1.8K`)

Budget note:

- This lane should normally stay well under the soft limit because it consumes debrief outputs rather than re-reading the full initiative corpus.

## Questions To Answer

1. Which findings should become immediate live changes?
2. Which findings belong in the carry-forward ledger rather than immediate edits?
3. What must change before the next initiative of this kind starts?
4. Which patterns are worth keeping, but in a simplified form?
5. Which methodological or contract-adherence failures require new guardrails?
6. Which findings should explicitly be rejected, and why?

## Output Contract

Produce:

- `../CHANGES-BEFORE-NEXT-INITIATIVE.md`
- updates to `../CARRY-FORWARD-LEDGER.md`
- `../DEBRIEF-SUMMARY.md`

## Standards

- Every accepted item needs a named destination.
- Every rejected item needs a reason.
- The final summary should separate substantive value from process lessons.
- Do not leave "we should probably" items unattached to an owner, destination, or timing.

## Delegation Guidance

Keep this synthesis local to the main thread unless a very narrow sub-slice is carved out. This step resolves contradictions and turns analysis into repo-governing outcomes.
