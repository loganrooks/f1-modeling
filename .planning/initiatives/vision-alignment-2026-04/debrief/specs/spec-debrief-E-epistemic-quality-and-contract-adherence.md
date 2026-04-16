# Spec: Debrief E - Epistemic Quality And Contract Adherence

## Objective

Evaluate whether the initiative's research and deliberations met the methodological obligations they were explicitly given, and whether deviations from those obligations were justified or damaging.

## Original Initiative Traceability

This spec evaluates conformance to:

- `../RESEARCH-PRINCIPLES.md`
- `../BOUNDARY-CONTRACT-MEMO.md`
- `../PLAN.md`
- `../handoffs/handoff-codex-primary-orchestrator.md`
- `../handoffs/handoff-claude-fallback-session.md`

It should also inspect whether the initiative's actual specs, research files, deliberations, and synthesis outputs followed those governing documents in substance rather than only in format.

## Required Inputs

- `../RESEARCH-PRINCIPLES.md`
- `../BOUNDARY-CONTRACT-MEMO.md`
- `../PLAN.md`
- `../SPEC-INDEX.md`
- `../specs/`
- `../research/`
- `../deliberations/`
- `../synthesis/`
- `../handoffs/`
- `../audit/`

## Context Budget

Target:

- soft target: `<=100K` estimated tokens
- acceptable stretch: up to about `115K` if the justification is recorded

Recommended core pack:

- `../RESEARCH-PRINCIPLES.md` (`~5.8K`)
- `../BOUNDARY-CONTRACT-MEMO.md` (`~7.4K`)
- `../PLAN.md` (`~4.8K`)
- `../SPEC-INDEX.md` (`~0.8K`)
- all initiative spec files in `../specs/` (`~37.9K` total)
- all Wave 1 / 1.5 research files in `../research/` (`~40.0K` total)
- `../deliberations/01-decision-anchor.md` through `05-decision-anchor.md` (`~6.2K` total)

Core-pack total: about `103K`.

Escalation rule:

- Start with anchors for the deliberation layer.
- Pull a full deliberation file only when a specific compliance or drift question cannot be answered from the decision anchor plus the governing docs.
- Read handoffs selectively for goal-compliance checks rather than defaulting to the full handoff corpus.

## Questions To Answer

1. Did the research outputs satisfy the epistemic and methodological requirements they were given?
2. Did the deliberations remain traceable, contract-shaped, and resistant to premature foreclosure?
3. Did the work honor the contract and ontology ownership assignments, or did it drift across boundaries?
4. Did the work honor the boundary memo's cross-cutting constraints where relevant?
5. Did the initiative meet the original goals of the handoffs?
6. Where did the initiative deviate from its governing docs, and were those deviations justified?
7. Which deviations were productive reframings, and which were process failures?

## Output Contract

Produce:

- `../EPISTEMIC-AND-CONTRACT-REVIEW.md`

## Standards

- Distinguish adherence from incidental success.
- Distinguish justified reframing from unmarked drift.
- Cite concrete evidence for both compliance and deviation.
- Check for the required sections and behaviors named in `RESEARCH-PRINCIPLES.md`, not just for high-level rhetorical alignment.
- Treat handoff goals as real commitments to evaluate, not only contextual prose.

## Delegation Guidance

This is a good bounded agent task. The output should still be reviewed locally because it is judging compliance against repo-governing documents.
