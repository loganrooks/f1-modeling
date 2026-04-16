# Spec: Transcript Residual Miss Audit

## Objective

Run a final transcript-focused audit after the three extract packs exist so likely omissions, skewed coverage, and high-risk false negatives are surfaced before higher-level debrief synthesis hardens them into conclusions.

## Output

- `../../artifacts/transcript-nlp/residual-miss-audit.md`

## Required Inputs

- `../../NEGLECT-REVIEW.md`
- `../../artifacts/transcript-nlp/lanes/claude-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/neglect-report.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/neglect-report.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/neglect-report.json`
- `../../extracts/claude-chat-extract.md`
- `../../extracts/codex-chat-extract.md`
- `../../extracts/cross-model-and-agent-usage-extract.md`
- `../../runs/2026-04-16-llm-sweep/RUN-MANIFEST.md`

Escalation-only local artifacts:

- local `candidate-hits.jsonl`
- local `excerpt-windows.jsonl`
- local `normalized/manifest.json`
- local `normalized/turns.jsonl`

These are reproducible intermediates, not canonical retained outputs. Only consult them if the compact neglect and coverage artifacts do not suffice to disposition a suspected miss.

## Context Budget

Target:

- preferred working total: `<=50K` estimated tokens

Method:

- Compare the final extract rows against the top unresolved issues in `NEGLECT-REVIEW.md` and the per-lane `neglect-report.json` files.
- Use coverage, query, and neglect reports first; only reopen local candidate/window artifacts or raw sessions when a suspected omission looks material and cannot be dispositioned from the compact artifacts.
- Keep this audit narrow and patch-oriented rather than exploratory.

## Audit Checks

- family coverage skew
- provider skew
- actor skew
- stage/date coverage gaps
- duplicate-fingerprint clusters that may hide recurring omitted evidence classes
- agent-usage evidence omitted despite high lane counts
- initiative-log evidence omitted where it materially changes attribution
- blind spots or neglect findings declared by a lane but not carried forward to synthesis

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
  - `patch interaction review`
  - `carry into H adversarial pass`
  - `accept as documented blind spot`
  - `not material`
- Do not rewrite the three extract packs wholesale.
- Do not convert this audit into a second interaction review.
- Treat the output as a compact bridge into `NEGLECT-AND-COUNTEREVIDENCE.md`, not as a competing top-level doctrine file.

## Success Condition

The audit is complete only when every suspected miss is dispositioned as one of:

- patched into a named extract
- accepted as a documented blind spot
- rejected as non-material with a reason
