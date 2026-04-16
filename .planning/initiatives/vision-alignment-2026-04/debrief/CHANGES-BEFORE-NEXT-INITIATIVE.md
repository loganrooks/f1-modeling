# Changes Before Next Initiative

**Status:** Completed on 2026-04-16 from Spec D synthesis.
**Source spec:** `specs/spec-debrief-D-carry-forward-synthesis-and-next-initiative-changes.md`

## Purpose

Turn the debrief into a short operational change list for the next strategic initiative, so the lessons become prerequisites rather than optional advice.

## Rule

Each change should point back to one or more findings and should name its destination:

- signal
- guardrail
- workflow or skill change
- planning template
- tech debt
- explicit rejection with reason

## Change Table

| ID | Change | Triggering finding(s) | Destination | Timing | Status |
| --- | --- | --- | --- | --- | --- |
| CF-01 | Require one launch per explicit authorization, with named write owner, commit owner, and review-gate owner before every long-running call. | `B-NF-03`, `B-NF-04`, lane C, lane D | `workflow`, `template` | Before the next initiative starts | accepted |
| CF-02 | Require an `audit/` preflight and explicit advisory-vs-formal mode declaration before any scheduled audit review begins. | `B-NF-01`, `B-NF-02`, lane F | `workflow`, `guardrail` | Before the next initiative starts | accepted |
| CF-03 | Ban detached `nohup ... codex exec ...` for strategic initiative orchestration; use bounded Codex-native agents/subagents or foreground sessions instead. | `B-AUD-01`, lane D | `workflow` | Before the next initiative starts | accepted |
| CF-04 | Keep canonical-entrypoint labeling, historical-snapshot banners, and path-alias notes mandatory once an initiative record is reorganized. | `B-RISK-01`, lane A | `template` | Next initiative scaffold | accepted |
| CF-05 | Add explicit transcript-pipeline coverage accounting plus an LLM residual miss-audit over non-selected snippet pools before any strong blind-spot claim is made. | `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-A-coverage-and-neglect.md` | `workflow`, `template` | Before next debrief run | accepted |
| CF-06 | Add deterministic checks for skipped branches, recommendation reversals, artifact lag, and synthesis flattening between nuanced reviews and later summaries. | `TIMELINE.md`; `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-B-synthesis-flattening-checks.md` | `workflow` | Next transcript-pipeline hardening pass | accepted |
| CF-07 | Preserve `AccessibleChartContract` and `AnchorRegistry` as mandatory planning gates before 3.3/3.4 implementation, not optional cleanup. | `EPISTEMIC-AND-CONTRACT-REVIEW.md`; `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-C-skipped-branches-and-non-events.md` | `tech-debt` | Already carried forward; re-verify in 3.3 planning | applied |
| CF-08 | Preserve the R6 benchmark/reporting obligation and do not treat performance-envelope numbers as hard constraints until benchmarked. | `EPISTEMIC-AND-CONTRACT-REVIEW.md` | `tech-debt` | Already carried forward; re-verify in 3.2/3.3 planning | applied |
| CF-09 | Add a final application-verification pass that rereads live files or diffs, not just the application ledger, before declaring initiative closeout. | `NEGLECT-AND-COUNTEREVIDENCE.md`; `specs/validation/report-validation-D-live-file-application-verification.md` | `workflow` | Before next initiative closeout | accepted |
