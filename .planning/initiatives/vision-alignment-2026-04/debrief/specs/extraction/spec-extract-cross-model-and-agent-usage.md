# Spec: Extract Cross-Model And Agent-Usage Evidence

## Objective

Extract the evidence needed to analyze model-role differences, cross-model review quality, and the usefulness or failure modes of subagent usage.

## Output

- `../extracts/cross-model-and-agent-usage-extract.md`

## Context Budget

Target:

- soft target: `<=90K` estimated tokens

Method:

- Start with handoffs, reviews, audits, initiative logs, and the two extracted chat evidence packs if available.
- Focus on interaction moments that reveal who did what, who caught what, and how agents were used.

Recommended model:

- `gpt-5.4-mini` with `high` reasoning
- escalate to `gpt-5.4` only if the cross-model evidence remains ambiguous

Typical input shape:

- handoffs, reviews, audits, initiative logs: `~30K-55K`
- extracted Claude/Codex evidence packs: `~5K-15K` each when kept compact
- targeted raw transcript checks only when needed: `~5K-15K`

Expected working total:

- usually `~45K-90K`

Output constraints:

- max `10` extracted moments unless a larger set is justified
- each row should be brief: `1-2` sentences plus evidence pointer
- include a short query manifest at top listing files touched and selection logic used
- target extract output: `<=1.5K` tokens
- explicitly note blind spots or evidence not covered

## Include

- shifts in primary orchestration responsibility
- moments where one model caught the other's gaps
- explicit discussion of Codex vs Claude fit
- agent/subagent usage patterns and whether they helped
