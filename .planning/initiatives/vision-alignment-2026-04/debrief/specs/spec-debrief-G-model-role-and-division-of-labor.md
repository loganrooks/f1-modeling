# Spec: Debrief G - Model Role And Division Of Labor

## Objective

Turn the debrief's interaction and orchestration evidence into an explicit judgment about role fit: which responsibilities were best handled by the user, Codex, Claude, and bounded subagents; where that division of labor improved quality; and what future role split this evidence supports.

## Original Initiative Traceability

This spec evaluates the initiative's actual role split around:

- wave orchestration and restructuring, especially Review Gate 1 and the Wave 1 execution recovery
- handoff-defined role transfers between user, Codex, and Claude
- formal-audit vs advisory-review responsibilities
- agent usage during research, orchestration, auditing, and debrief work
- user gate ownership and correction/calibration moments

## Required Inputs

- `../TIMELINE.md`
- `../INTERACTION-REVIEW.md`
- `../extracts/claude-chat-extract.md`
- `../extracts/codex-chat-extract.md`
- `../extracts/cross-model-and-agent-usage-extract.md`
- `../README.md`
- `../PLAN.md`
- `../handoffs/`
- `../reports/report-wave-1-orchestrator-execution.md`
- `../audit/2026-04-11-d4-acceptance-response.md`
- `../audit/2026-04-11-stage-3-application-response.md`

## Context Budget

Target:

- soft target: `<=100K` estimated tokens

Recommended core pack:

- `../TIMELINE.md` (`~6K`)
- `../INTERACTION-REVIEW.md` (`~5K`)
- `../extracts/claude-chat-extract.md` (`~4K`)
- `../extracts/codex-chat-extract.md` (`~4K`)
- `../extracts/cross-model-and-agent-usage-extract.md` (`~4K`)
- `../handoffs/handoff-codex-primary-orchestrator.md` (`~12.7K`)
- `../handoffs/handoff-claude-fallback-session.md` (`~12.7K`)
- `../handoffs/handoff-claude-stage-3-formal-audit.md` (`~8.2K`)
- `../reports/report-wave-1-orchestrator-execution.md` (`~1.1K`)
- `../README.md` (`~1.2K`)
- `../audit/2026-04-11-d4-acceptance-response.md` (`~8.2K`)
- `../audit/2026-04-11-stage-3-application-response.md` (`~9.3K`)

Core-pack total: about `76K`.

Budget rule:

- This lane should consume extracted interaction evidence and canonical handoffs rather than raw transcript stores.
- Do not infer role fit from generic model reputation when the initiative's own evidence is available.

Escalation rule:

- Pull specific raw session files or older archive material only when the extracted evidence, handoff stack, and audit record disagree about a role shift, delegation boundary, or accountability assignment.

## Questions To Answer

1. What roles did the user, Codex, Claude, and subagents actually play, and when did those roles change?
2. Which responsibilities was each actor best at in this initiative?
3. Which role assignments improved quality, speed, auditability, or recovery?
4. Which role assignments or ambiguities created avoidable risk, overhead, or trust drag?
5. What future division of labor should be the default for this class of initiative, and what preconditions make that split safe?
6. Which responsibilities should explicitly stay local to the primary thread or gate owner rather than being delegated?

## Output Contract

Produce:

- `../MODEL-ROLE-AND-DIVISION-OF-LABOR.md`

## Standards

- Evaluate roles as actually performed, not as product-marketing assumptions about the models.
- Treat the user as a real operational actor with role obligations, not as passive approval context.
- Distinguish model weakness from orchestration failure, authorization failure, or missing written role contract.
- Name both strengths and failure modes for each actor.
- Make the recommended future split conditional where necessary: explicit role contract, audit preflight, bounded write ownership, extracted evidence pack, or other named prerequisites.
- If the record does not support a strong comparison on some dimension, say so rather than forcing symmetry.

## Delegation Guidance

This is a good bounded agent task after Specs A and F are complete. Final role-policy recommendations should still be reviewed locally because they shape future workflow, audit expectations, and cross-model operating assumptions.
