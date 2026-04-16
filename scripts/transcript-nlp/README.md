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

- normalized index: `.planning/.../debrief/artifacts/transcript-nlp/normalized/`
- per-lane artifacts: `.planning/.../debrief/artifacts/transcript-nlp/lanes/<lane-id>/`
- human-facing extracts: `.planning/.../debrief/extracts/`

## Design Notes

- deterministic preprocessing first
- compact evidence packs, not raw transcript rewrites
- provider-specific parsing for Claude and Codex session stores
- token budgeting enforced at the window-selection stage
