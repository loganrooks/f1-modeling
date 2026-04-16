# Spec: Debrief D - Carry-Forward Synthesis And Next-Initiative Changes

## Objective

Convert the debrief from analysis into durable operational changes, with clear dispositions for every material finding.

## Original Initiative Traceability

This spec closes the loop between:

- the debrief outputs created by Specs A-C
- the original initiative's applied consequences in live planning files
- the future workflow and template changes needed before the next strategic initiative

## Required Inputs

- `../TIMELINE.md`
- `../FINDINGS.md`
- `../PATTERNS-TO-KEEP.md`
- `../EVIDENCE-INDEX.md`
- `../APPLICATION-LEDGER.md`
- `../README.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md`

## Questions To Answer

1. Which findings should become immediate live changes?
2. Which findings belong in the carry-forward ledger rather than immediate edits?
3. What must change before the next initiative of this kind starts?
4. Which patterns are worth keeping, but in a simplified form?
5. Which findings should explicitly be rejected, and why?

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
