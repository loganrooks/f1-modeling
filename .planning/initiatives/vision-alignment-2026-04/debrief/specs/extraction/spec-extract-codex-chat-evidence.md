# Spec: Extract Codex Chat Evidence

## Objective

Extract the Codex-side interaction moments most relevant to the initiative debrief from Codex session history, initiative logs, and related records.

## Output

- `../extracts/codex-chat-extract.md`

## Context Budget

Target:

- soft target: `<=90K` estimated tokens

Method:

- Use initiative-local logs, Codex history search, and targeted session selection first.
- Build a candidate hit list first; do not read raw Codex sessions broadly.
- Prefer filtered excerpts over raw-session reading.
- Do not read the entire Codex history store.

Recommended model:

- `gpt-5.4-mini` with `high` reasoning

Typical input shape:

- filtered hits from `.codex/history.jsonl` and initiative-local logs: `~10K-25K`
- targeted excerpts from selected `.codex/sessions/...jsonl` files: `~20K-40K`
- grounding docs when needed: `~10K-20K`

Expected working total:

- usually `~40K-85K`

Output constraints:

- max `12` extracted moments unless a larger set is justified
- each row should be brief: `1-2` sentences plus evidence pointer
- include a short query manifest at top listing date range, session files touched, and search families used
- target extract output: `<=1.5K` tokens
- explicitly note blind spots or evidence not covered

## Include

- frustration or repeated clarification
- positive collaboration turns
- scope/authorization clarifications
- moments where Codex proposals were accepted, revised, or challenged
- evidence about how Codex handled orchestration and review-gate work
