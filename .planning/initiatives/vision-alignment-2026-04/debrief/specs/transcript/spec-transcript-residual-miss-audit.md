# Spec: Transcript Residual Miss Audit

## Objective

Run a final transcript-focused audit after the three extract packs exist so likely omissions, skewed coverage, and high-risk false negatives are surfaced before higher-level debrief synthesis hardens them into conclusions.

## Output

- `../../artifacts/transcript-nlp/residual-miss-audit.md`

## Required Inputs

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/candidate-hits.jsonl`
- `../../extracts/claude-chat-extract.md`
- `../../extracts/codex-chat-extract.md`
- `../../extracts/cross-model-and-agent-usage-extract.md`
- `../../runs/2026-04-16-llm-sweep/RUN-MANIFEST.md`

## Context Budget

Target:

- preferred working total: `<=50K` estimated tokens

Method:

- Compare the final extract rows against the top unselected or unrepresented candidate hits.
- Use coverage reports first; only reopen excerpt windows or raw sessions when a suspected omission looks material.
- Keep this audit narrow and patch-oriented rather than exploratory.

## Audit Checks

- family coverage skew
- provider skew
- actor skew
- stage/date coverage gaps
- repeated high-score candidates absent from all extracts
- agent-usage evidence omitted despite high lane counts
- initiative-log evidence omitted where it materially changes attribution
- blind spots declared by a lane but not carried forward to synthesis

## Output Constraints

- Report at most `10` residual items unless a larger set is clearly necessary.
- For each residual item, record:
  - what may be missing
  - why it matters
  - evidence pointer
  - recommended disposition
- Allowed dispositions:
  - `patch claude extract`
  - `patch codex extract`
  - `patch cross-model extract`
  - `accept as documented blind spot`
  - `not material`
- Do not rewrite the three extract packs wholesale.
- Do not convert this audit into a second interaction review.

## Success Condition

The audit is complete only when every suspected miss is dispositioned as one of:

- patched into a named extract
- accepted as a documented blind spot
- rejected as non-material with a reason
