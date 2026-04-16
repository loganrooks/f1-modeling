# Spec: Validation A - Coverage And Neglect

## Objective

Measure what the debrief actually reviewed, sampled, and omitted so coverage claims stay proportional to demonstrated evidence rather than drifting into blind-spot boilerplate.

## Debrief Traceability

This spec operationalizes:

- the traceability and context-budget discipline in `../../DEBRIEF-PLAN.md`
- the debrief output-ownership model in `../../SPEC-INDEX.md`
- the H-lane warning that the current debrief is strongest on documented failures, but risks coverage-confidence inflation when windowed extracts are described too cleanly

It validates the evidence posture behind:

- `../../EVIDENCE-INDEX.md`
- `../../TIMELINE.md`
- `../../FINDINGS.md`
- `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../../INTERACTION-REVIEW.md`

## Required Inputs

- `../../DEBRIEF-PLAN.md`
- `../../SPEC-INDEX.md`
- `../../EVIDENCE-INDEX.md`
- `../../TIMELINE.md`
- `../../FINDINGS.md`
- `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../../INTERACTION-REVIEW.md`
- `../../extracts/claude-chat-extract.md`
- `../../extracts/codex-chat-extract.md`
- `../../extracts/cross-model-and-agent-usage-extract.md`
- `../../artifacts/transcript-nlp/lanes/claude-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/query-manifest.json`

## Context Budget

Target:

- soft target: `<=70K` estimated tokens

Recommended core pack:

- the three extract files
- the six transcript-lane coverage and query manifests
- `../../EVIDENCE-INDEX.md`
- `../../TIMELINE.md`
- the debrief outputs that make broad coverage or "no major blind spots" claims

Escalation rule:

- Return to raw transcript stores only if a report claim cannot be validated from manifests plus extracts.
- Do not reopen whole session archives just to create a stronger feeling of completeness.

## Questions To Answer

1. What is the universe of evidence classes relevant to the current debrief?
2. Which classes were read directly, sampled through extracts, or left unreviewed?
3. Where does debrief prose imply stronger coverage than the manifests and extracts prove?
4. Which exact claims need to be softened, qualified, or reopened?
5. Which missing evidence classes matter enough to threaten the debrief's current conclusions?

## Output Contract

Write only to `./report-validation-A-coverage-and-neglect.md`.

## Required Sections

- `Coverage Inventory`
- `Overclaimed Coverage`
- `Unreviewed Or Under-Reviewed Evidence Classes`
- `Claim Dispositions`
- `Reopen Recommendations`
- `Confidence And Limits`

## Standards

- Count total sessions, files, windows, or evidence units when the manifests make that possible.
- Use the labels `reviewed`, `sampled`, `unreviewed`, or `not available` for every material evidence class you name.
- Do not accept generic phrasing such as "no major blind spots" unless the reviewed universe is actually near-exhaustive.
- Treat a deterministic sampling pipeline as auditable selection, not automatically exhaustive selection.
- Distinguish absence of reviewed evidence from evidence that something did not happen.
- If a gap is only a wording issue, mark it `soften`; if it could change judgment, mark it `reopen`.

## Delegation Guidance

This is a strong bounded validation task. Keep it evidence-accounting-first and avoid drifting into a second interaction synthesis.
