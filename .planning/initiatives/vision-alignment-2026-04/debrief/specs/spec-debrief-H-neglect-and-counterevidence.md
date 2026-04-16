# Spec: Debrief H - Neglect And Counterevidence

## Objective

Run an explicit adversarial pass over the debrief corpus so closeout claims are challenged for blind spots, neglected patterns, missing evidence classes, and overconfident synthesis before carry-forward decisions harden.

## Original Initiative Traceability

This spec stress-tests:

- the factual, process, substantive, epistemic, interaction, and role-split claims produced by Specs A-C and E-G
- the evidence-coverage and reading-order claims in `../EVIDENCE-INDEX.md`
- the original initiative summary and review-gate record that the debrief is claiming to explain
- the closeout and carry-forward implications that will later flow into final synthesis

## Required Inputs

- `../TIMELINE.md`
- `../FINDINGS.md`
- `../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../INTERACTION-REVIEW.md`
- `../PATTERNS-TO-KEEP.md`
- `../EVIDENCE-INDEX.md`
- `../extracts/claude-chat-extract.md`
- `../extracts/codex-chat-extract.md`
- `../extracts/cross-model-and-agent-usage-extract.md`
- `../README.md`
- `../PLAN.md`
- `../SUMMARY.md`
- `../APPLICATION-LEDGER.md`
- `../reviews/review-wave-2-structure-decisions.md`

## Context Budget

Target:

- soft target: `<=100K` estimated tokens
- acceptable stretch: up to about `115K` if a strong debrief claim cannot be tested without live-file or raw-session verification

Recommended core pack:

- `../TIMELINE.md` (`~6K`)
- `../FINDINGS.md` (`~6K`)
- `../EPISTEMIC-AND-CONTRACT-REVIEW.md` (`~9K`)
- `../INTERACTION-REVIEW.md` (`~5K`)
- `../PATTERNS-TO-KEEP.md` (`~2K`)
- `../EVIDENCE-INDEX.md` (`~4K`)
- `../extracts/claude-chat-extract.md` (`~4K`)
- `../extracts/codex-chat-extract.md` (`~4K`)
- `../extracts/cross-model-and-agent-usage-extract.md` (`~4K`)
- `../PLAN.md` (`~4.8K`)
- `../SUMMARY.md` (`~1.4K`)
- `../APPLICATION-LEDGER.md` (`~0.6K`)
- `../reviews/review-wave-2-structure-decisions.md` (`~13.6K`)
- `../README.md` (`~1.2K`)

Core-pack total: about `65K`.

Budget rule:

- Start by challenging the debrief's strongest or most consequential claims rather than scattering effort across low-stakes wording.
- Prefer curated evidence packs and explicit claim-audit passes before widening into raw corpus reads.

Escalation rule:

- Pull raw session stores, audit artifacts, live planning files, or unselected transcript windows only when a strong claim about coverage, application, or skipped branches cannot be tested from the core pack.
- If Spec G has already produced `../MODEL-ROLE-AND-DIVISION-OF-LABOR.md`, use it as an additional control against role-analysis blind spots.

## Questions To Answer

1. Which current debrief claims are under-supported, over-generalized, or stated with more certainty than the evidence warrants?
2. Which evidence classes, transcript windows, review branches, or application-verification steps appear missing or under-read?
3. What plausible counterevidence or alternative interpretation would materially change the current debrief?
4. Which neglected positive or negative patterns are being flattened by the current synthesis?
5. What uncertainty, coverage-limit, or verification language must be added before closeout?
6. Which workflow, template, or verification changes should be carried forward so future debriefs surface these misses earlier?

## Output Contract

Produce:

- `../NEGLECT-AND-COUNTEREVIDENCE.md`
- targeted updates to `../CARRY-FORWARD-LEDGER.md` when the adversarial pass identifies concrete workflow, template, or verification changes that should survive closeout

## Standards

- Prefer challenging high-confidence claims over inventing generic doubt.
- Distinguish missing evidence from true counterevidence.
- Separate "not proven," "probably overstated," and "likely false" rather than collapsing them into one skepticism bucket.
- Include non-events and unexamined branches where their omission materially distorts the story.
- When application claims are made, verify against live files or diffs rather than trusting ledgers alone.
- Do not let the adversarial lane collapse into cynicism; preserve well-supported findings while narrowing overreach.
- If the current debrief already states an honest limitation, do not relabel that honesty as failure.

## Delegation Guidance

This is a good bounded agent task after Specs A-C and E-G have draft outputs. It is best run immediately before final carry-forward synthesis. Final interpretation should still be reviewed locally because this lane can narrow, downgrade, or re-scope closeout claims and workflow changes.
