# Spec: Transcript Extract Claude

## Objective

Extract the Claude-side interaction moments most relevant to the initiative debrief from the canonical transcript substrate, with only targeted reopening of raw Claude session files when needed.

## Output

- `../../extracts/claude-chat-extract.md`

## Required Transcript Substrate

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/normalized/turns.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/coverage-report.json`

## Context Budget

Target:

- preferred working total: `<=80K` estimated tokens
- soft cap: `<=95K`

Method:

- Start from `candidate-hits.jsonl` and `excerpt-windows.jsonl`, not raw session stores.
- Reopen raw Claude session files only to resolve ambiguity, pointer drift, or excerpt truncation.
- Use handoffs or review docs only when a moment cannot be interpreted honestly from transcript evidence alone.

## Selection Rules

- Select at most `12` moments unless a larger set is justified.
- Cover at least `4` distinct families when the lane evidence supports it.
- Avoid letting `audit_protocol` or `model_role_shift` crowd out the smaller but important families.
- Include at least one moment with direct user pushback or clarification when such evidence exists.
- Prefer moments that changed downstream behavior, handoff structure, or trust posture.

Primary family set:

- `positive_collaboration`
- `frustration_pushback`
- `clarification_ambiguity`
- `authorization_delegation`
- `audit_protocol`
- `review_gate_restructure`
- `model_role_shift`

## Output Constraints

- Start with a short query manifest summary:
  - date range covered
  - session ids touched
  - family set used
  - number of windows reviewed
- Keep each extracted row to `1-2` sentences plus evidence pointer.
- Preserve direct evidence pointers using session id, turn id, or source path plus line.
- Note blind spots explicitly at the end.
- Avoid long quotations and avoid narrative transcript retellings.

## Include

- moments where Claude corrected itself after user pressure
- positive collaboration turns that materially improved the initiative
- authorization, scope, or delegation clarifications
- review-gate or audit-protocol discussions that shaped later work
- handoff-sensitive turns that affected Codex or cross-model follow-through
- explicit statements about role shift, fallback posture, or orchestration responsibility
