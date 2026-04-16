# Transcript NLP Pipeline

Layered transcript-analysis tooling for audit-grade debrief work.

## Commands

```bash
npm run transcript:nlp:index -- --config vision-alignment-2026-04
npm run transcript:nlp:candidates -- --config vision-alignment-2026-04 --lane claude-chat
npm run transcript:nlp:windows -- --config vision-alignment-2026-04 --lane claude-chat
npm run transcript:nlp:extract -- --config vision-alignment-2026-04 --lane claude-chat
npm run transcript:nlp:run -- --config vision-alignment-2026-04
```

## Artifact Layout

- reproducible normalized index: `.planning/.../debrief/artifacts/transcript-nlp/normalized/`
- per-lane artifacts: `.planning/.../debrief/artifacts/transcript-nlp/lanes/<lane-id>/`
- human-facing extracts and aggregate neglect review: `.planning/.../debrief/extracts/` and `.planning/.../debrief/NEGLECT-REVIEW.md`

### Tracked vs Reproducible

Tracked outputs should stay lean:

- `coverage-report.json`
- `query-manifest.json`
- `neglect-report.json`
- extract markdown files
- aggregate `NEGLECT-REVIEW.md`

Reproducible but usually untracked outputs:

- `normalized/**`
- `candidate-hits.jsonl`
- `excerpt-windows.jsonl`

## Design Notes

- deterministic preprocessing first
- codex `event_msg` / `response_item` duplicates collapsed before scoring
- compact evidence packs, not raw transcript rewrites
- provider-specific parsing for Claude and Codex session stores
- lane-aware notification and subagent-launch handling
- selected-hit coverage and emitted-extract coverage tracked separately
- explicit neglect reports generated per lane plus an aggregate review
- token budgeting enforced at the window-selection stage
