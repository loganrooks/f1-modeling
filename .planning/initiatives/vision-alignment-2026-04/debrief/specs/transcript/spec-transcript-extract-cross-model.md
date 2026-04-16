# Spec: Transcript Extract Cross-Model And Agent Usage

## Objective

Extract the interaction evidence needed to judge cross-model division of labor, review quality, catch-and-correct behavior, and the usefulness or failure modes of agent usage.

## Output

- `../../extracts/cross-model-and-agent-usage-extract.md`

## Required Inputs

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/normalized/turns.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/coverage-report.json`
- `../../extracts/claude-chat-extract.md`
- `../../extracts/codex-chat-extract.md`
- `../../runs/2026-04-16-llm-sweep/RUN-MANIFEST.md`

## Context Budget

Target:

- preferred working total: `<=85K` estimated tokens
- soft cap: `<=95K`

Method:

- Start with the cross-model lane bundle and the completed Claude/Codex extracts.
- Use handoffs, reviews, audits, and initiative logs only when they directly clarify who did what or who caught what.
- Reopen raw transcript windows only when the extract packs disagree or leave attribution ambiguous.

## Selection Rules

- Select at most `10` moments unless a larger set is justified.
- Include at least one moment for each of these categories when evidence exists:
  - role shift or delegation change
  - review or audit catch
  - productive collaboration
  - agent or subagent usage pattern
- Identify whether each row is direct evidence or a careful inference from multiple sources.
- Prefer moments that explain downstream effects visible in the run-manifest report lanes.

Primary family set:

- `positive_collaboration`
- `frustration_pushback`
- `authorization_delegation`
- `audit_protocol`
- `review_gate_restructure`
- `model_role_shift`
- `agent_usage`

## Output Constraints

- Start with a short query manifest summary:
  - providers touched
  - files and session ids touched
  - family set used
  - number of windows reviewed
- Keep each extracted row to `1-2` sentences plus evidence pointer.
- State clearly who acted, who reviewed, and what changed.
- Note blind spots explicitly at the end.
- Do not collapse the extract into a final verdict about which model was "better."

## Include

- shifts in primary orchestration responsibility
- moments where one model caught the other's gap or corrected a weak proposal
- explicit discussion of Codex vs Claude role fit
- agent/subagent usage patterns and whether they improved or degraded outcomes
- moments where review-gate structure prevented or failed to prevent drift
