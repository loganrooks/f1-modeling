# Spec: Validation D - Live-File Application Verification

## Objective

Verify that claims about applied initiative consequences are proven by direct reread or diff-grade evidence in live files, not only by ledgers, summaries, or self-referential closeout prose.

## Debrief Traceability

This spec operationalizes:

- the debrief requirement that carry-forward claims end in durable operational consequence
- the synthesis responsibilities of Spec D in `../../SPEC-INDEX.md`
- the H-lane warning that current application evidence is ledger-based more than direct-file-based

It validates whether the debrief has actually demonstrated live application of the initiative's accepted outcomes.

## Required Inputs

- `../../DEBRIEF-PLAN.md`
- `../../SPEC-INDEX.md`
- `../../TIMELINE.md`
- `../../CHANGES-BEFORE-NEXT-INITIATIVE.md` when present
- `../../CARRY-FORWARD-LEDGER.md`
- `../../../APPLICATION-LEDGER.md`
- `../../../SUMMARY.md`
- `.planning/LONG-ARC.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/TECH-DEBT.md`
- `.planning/PROJECT.md`
- `.planning/AGENTS.md` when guardrail or routing changes are claimed
- `CLAUDE.md` when workflow or guardrail changes are claimed

## Context Budget

Target:

- soft target: `<=50K` estimated tokens

Recommended core pack:

- `../../../APPLICATION-LEDGER.md`
- `../../TIMELINE.md`
- `../../../SUMMARY.md`
- the live planning files that the initiative claims to have changed

Escalation rule:

- If git history or commit evidence is available and needed, use it to strengthen or date a claim.
- If direct diffs are unavailable, state that the result is a current-state reread verification, not original-application proof.

## Questions To Answer

1. Which debrief claims assert that the initiative changed live planning files?
2. Which current files directly show those claimed consequences?
3. For each claim, is the proof a direct reread, a diff/commit anchor, or only a ledger/summary assertion?
4. Which claims are verified, partially verified, or still unverified?
5. What corrections are needed before final debrief closeout can describe the initiative as applied?

## Output Contract

Write only to `./report-validation-D-live-file-application-verification.md`.

## Required Sections

- `Claimed Applications`
- `Direct File Verification`
- `Proof Class And Gaps`
- `Verification Dispositions`
- `Closeout Corrections`

## Standards

- Do not mark a claim `verified` from ledger evidence alone.
- Separate `current file reflects the change` from `the debrief proved when and how the change was applied`.
- Use the proof classes `current-state reread`, `diff or commit anchor`, `ledger only`, or `unclear`.
- If a live file has evolved since application, note whether the current reread proves persistence but not the original application event.
- A summary may point to a live consequence, but it is never sufficient as the only proof of application.
- When the debrief says the initiative changed governance, make the verifying file path explicit.

## Delegation Guidance

This can be delegated as a bounded verification task, but the synthesis owner should review the final dispositions locally because they directly affect closeout credibility.
