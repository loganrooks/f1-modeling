# Spec: Transcript Extract Codex

## Objective

Extract the Codex-side interaction moments most relevant to the initiative debrief from the canonical transcript substrate, emphasizing orchestration behavior, proposal revision, review-gate handling, and agent usage.

## Output

- `../../extracts/codex-chat-extract.md`

## Required Transcript Substrate

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/normalized/turns.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/coverage-report.json`

## Context Budget

Target:

- preferred working total: `<=80K` estimated tokens
- soft cap: `<=95K`

Method:

- Start from the lane bundle first.
- Use initiative-local logs or related docs only when the Codex transcript alone is insufficient for attribution.
- Reopen raw Codex session files only for ambiguous windows or missing context around a selected hit.

## Selection Rules

- Select at most `12` moments unless a larger set is justified.
- Cover both orchestration quality and interaction quality.
- Include `agent_usage` evidence if the lane surfaced it materially.
- Include at least one moment where Codex was challenged, corrected, or asked to tighten the bar.
- Prefer moments that reveal how Codex handled bounded delegation, review gates, audit posture, or plan correction.

Primary family set:

- `positive_collaboration`
- `frustration_pushback`
- `clarification_ambiguity`
- `authorization_delegation`
- `audit_protocol`
- `review_gate_restructure`
- `model_role_shift`
- `agent_usage`

## Output Constraints

- Start with a short query manifest summary:
  - date range covered
  - session ids touched
  - family set used
  - number of windows reviewed
- Keep each extracted row to `1-2` sentences plus evidence pointer.
- Preserve direct evidence pointers using session id, turn id, or source path plus line.
- Note blind spots explicitly at the end.
- Avoid long quotes and avoid replaying raw terminal chatter unless it is the point.

## Include

- positive collaboration moments that materially improved execution
- moments of pushback, revision, or scope tightening
- authorization and delegation clarifications
- evidence about how Codex handled orchestration, review-gate, and audit work
- explicit model-role or responsibility shifts
- subagent or multi-lane usage patterns that helped or created risk
