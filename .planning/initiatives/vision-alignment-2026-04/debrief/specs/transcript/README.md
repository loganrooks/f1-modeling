# Transcript Specs

This directory is the canonical transcript-processing sublayer for the Vision Alignment debrief.

It governs how transcript evidence is:

- prepared
- indexed
- extracted into compact evidence packs
- audited for residual misses before higher-level synthesis

The older task contracts in `../extraction/` remain useful lane prompts, but this layer owns the substrate, sequencing, lane ids, artifact bundle shape, and residual coverage checks. If the two layers ever disagree, this `transcript/` layer wins on transcript-processing rules.

## Current Substrate

The current normalized transcript corpus already lives in `../../artifacts/transcript-nlp/normalized/`.

Current baseline from `normalized/manifest.json`:

- generated at `2026-04-16T16:42:31.978Z`
- `104` sessions
- `10,054` indexed turns
- `5,787` usable turns

Canonical normalized artifacts:

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/normalized/turns.jsonl`

Canonical lane artifact bundle for each transcript lane:

- `query-manifest.json`
- `candidate-hits.jsonl`
- `excerpt-windows.jsonl`
- `coverage-report.json`

These live under `../../artifacts/transcript-nlp/lanes/<lane-id>/`.

## Lane Map

| Lane id | Purpose | Final extract |
| --- | --- | --- |
| `claude-chat` | Claude-side interaction evidence | `../../extracts/claude-chat-extract.md` |
| `codex-chat` | Codex-side interaction evidence | `../../extracts/codex-chat-extract.md` |
| `cross-model-and-agent-usage` | Cross-model role split, review quality, and agent usage | `../../extracts/cross-model-and-agent-usage-extract.md` |

These extract outputs are then consumed by `RUN-MANIFEST.md` report lanes and by `../spec-debrief-F-interaction-review.md`.

## Recommended Execution Order

1. `spec-transcript-prep-and-index.md`
2. `spec-transcript-extract-claude.md`
3. `spec-transcript-extract-codex.md`
4. `spec-transcript-extract-cross-model.md`
5. `spec-transcript-residual-miss-audit.md`
6. higher-level synthesis such as `../spec-debrief-F-interaction-review.md` or `../../runs/2026-04-16-llm-sweep/RUN-MANIFEST.md`

## Global Rules

- Prefer deterministic prep and indexing before any model reads.
- Do not rewrite raw logs into prose during prep or extraction.
- Every selected moment must preserve a direct evidence pointer.
- Keep lane outputs compact enough that downstream synthesis can read all three extracts together cheaply.
- Record blind spots explicitly instead of padding claims.
- When one family dominates scoring, rebalance selection instead of letting the extract become a monoculture of similar moments.
- Only open raw session files after candidate hits and excerpt windows exist.

## Downstream Fit

This sublayer is intentionally aligned to the current debrief run shape:

- the transcript lanes stay smaller than the report lanes in `RUN-MANIFEST.md`
- the extract outputs remain evidence packs, not final findings
- the residual miss-audit catches omissions before the stronger synthesis step hardens them into debrief conclusions
