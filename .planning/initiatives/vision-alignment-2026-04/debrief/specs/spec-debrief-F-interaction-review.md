# Spec: Debrief F - Interaction Review

## Objective

Turn extracted chat/session evidence into a debrief-quality analysis of how the initiative actually unfolded as a collaboration process between user, Codex, Claude, and subagents.

## Original Initiative Traceability

This spec evaluates the interaction layer around:

- initiative review gates
- handoff moments
- audit requests and recoveries
- model-role shifts between Claude and Codex
- agent usage during research, orchestration, and debrief work

## Required Inputs

- `../extracts/claude-chat-extract.md`
- `../extracts/codex-chat-extract.md`
- `../extracts/cross-model-and-agent-usage-extract.md`
- `../TIMELINE.md`
- `../FINDINGS.md`
- `../EPISTEMIC-AND-CONTRACT-REVIEW.md`
- `../handoffs/`
- `../reports/report-wave-1-orchestrator-execution.md`

## Context Budget

Target:

- soft target: `<=100K` estimated tokens

Budget rule:

- This lane should consume extracted evidence packs rather than raw transcript stores.
- Only return to raw session files to verify a disputed or ambiguous interaction point.

## Questions To Answer

1. Which interaction moments improved initiative quality materially?
2. Which interaction moments revealed frustration, ambiguity, or process weakness?
3. Where did authorization language or delegation assumptions create avoidable confusion?
4. What do the chats reveal about Codex vs Claude strengths, weaknesses, and appropriate roles?
5. What do the chats reveal about subagent usage quality?

## Output Contract

Produce:

- `../INTERACTION-REVIEW.md`

## Standards

- Include positive interaction moments, not only failures.
- Distinguish frustration caused by real process flaws from frustration caused by necessary rigor.
- Separate raw interaction evidence from retrospective judgment.
