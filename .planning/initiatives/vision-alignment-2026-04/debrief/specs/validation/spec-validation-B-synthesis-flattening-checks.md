# Spec: Validation B - Synthesis Flattening Checks

## Objective

Detect places where nuanced upstream review or debrief claims were compressed into later summary wording that is cleaner, broader, or more causal than the evidence supports.

## Debrief Traceability

This spec operationalizes:

- `../../DEBRIEF-PLAN.md` requirements that every material claim stay source-cited and traceable
- the debrief handoff from detailed evidence lanes into summary and carry-forward synthesis
- the H-lane warning that later synthesis can flatten important distinctions, especially when nuanced review findings are restated as neat convergence or success narratives

It validates the relationship between detailed upstream material and later summary-facing outputs.

## Required Inputs

- `../../DEBRIEF-PLAN.md`
- `../../SPEC-INDEX.md`
- `../../TIMELINE.md`
- `../../FINDINGS.md`
- `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../../PATTERNS-TO-KEEP.md`
- `../../CHANGES-BEFORE-NEXT-INITIATIVE.md` when present
- `../../DEBRIEF-SUMMARY.md` when present
- `../../../SUMMARY.md`
- `../../../reviews/review-wave-2-structure-decisions.md`

## Context Budget

Target:

- soft target: `<=60K` estimated tokens

Recommended core pack:

- `../../../reviews/review-wave-2-structure-decisions.md`
- `../../FINDINGS.md`
- `../../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../../../SUMMARY.md`
- `../../DEBRIEF-SUMMARY.md` when drafted

Escalation rule:

- Pull deeper initiative review or audit files only when a later claim cannot be validated or softened from the core pack.

## Questions To Answer

1. Which later claims are stronger than the upstream evidence they summarize?
2. Which material distinctions were dropped during summary compression?
3. Where were outcome claims silently upgraded into causal claims?
4. Which lines are merely compressed but still acceptable, and which require correction?
5. What is the strongest accurate phrasing that survives the upstream evidence?

## Output Contract

Write only to `./report-validation-B-synthesis-flattening-checks.md`.

## Required Sections

- `Flattened Claims`
- `Dropped Distinctions`
- `Outcome Vs Causal Claim Drift`
- `Recommended Wording Corrections`
- `Residual Uncertainty`

## Standards

- Pair each challenged later claim with the upstream file that supports, weakens, or contradicts it.
- Classify each checked claim as `verified`, `soften`, `reopen`, or `unverified`.
- Prefer the least overstated accurate wording, not the most rhetorically satisfying wording.
- Do not label a claim contradictory when the real problem is loss of nuance.
- Treat summary neatness as a risk factor when the upstream record is uneven, conditional, or recovery-shaped.
- Name the exact distinction that was lost, for example heterogeneity across review items, confidence bounds, or dependence on later forcing mechanisms.

## Delegation Guidance

Good bounded review task after the summary-facing files exist. Keep the work claim-pairing-first rather than turning it into another broad substantive audit.
