# Spec: Transcript Prep And Index

## Objective

Prepare the canonical normalized transcript substrate and per-lane retrieval bundle so the extraction lanes start from indexed evidence, not ad hoc session browsing.

## Outputs

- `../../artifacts/transcript-nlp/normalized/manifest.json`
- `../../artifacts/transcript-nlp/normalized/turns.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/claude-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/claude-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/codex-chat/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/codex-chat/coverage-report.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/query-manifest.json`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/candidate-hits.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/excerpt-windows.jsonl`
- `../../artifacts/transcript-nlp/lanes/cross-model-and-agent-usage/coverage-report.json`

## Context Budget

Target:

- preferred model usage: `none` or minimal
- if a model is used for validation or blind-spot review, soft target `<=40K` estimated tokens

Method:

- Prefer deterministic tooling for normalization, family matching, scoring, and window selection.
- Use a model only for validating family coverage, stage tagging, or suspicious blind spots that deterministic rules cannot resolve cleanly.
- Do not spend model budget on reading raw session stores end-to-end.

## Canonical Substrate Rules

Normalize every retained turn with stable provenance:

- `provider`
- `sourceId`
- `sessionId`
- `turnId`
- `timestamp`
- `actor`
- `model`
- `agentId`
- `cwd`
- `eventType`
- `text`
- `stageId`
- `sourcePath`
- `sourceLine`
- `metadata`
- `textLength`
- `noise`
- `noiseReasons`

Normalization rules:

- Preserve raw text exactly as captured in the transcript substrate.
- Mark noise explicitly instead of deleting it from the corpus.
- Compute `usableTurns` separately so later lanes can reason about recall.
- Keep parent sessions and subagent sessions as distinct `sessionId` values.
- Allow `stageId: null` when no deterministic stage mapping exists.
- Do not invent summaries in `turns.jsonl`; summaries belong in lane artifacts, not the canonical corpus.

## Lane Definitions

`claude-chat` families:

- `positive_collaboration`
- `frustration_pushback`
- `clarification_ambiguity`
- `authorization_delegation`
- `audit_protocol`
- `review_gate_restructure`
- `model_role_shift`

`codex-chat` families:

- all `claude-chat` families
- `agent_usage`

`cross-model-and-agent-usage` families:

- `positive_collaboration`
- `frustration_pushback`
- `authorization_delegation`
- `audit_protocol`
- `review_gate_restructure`
- `model_role_shift`
- `agent_usage`

Lane provider scope:

- `claude-chat`: `claude`
- `codex-chat`: `codex`
- `cross-model-and-agent-usage`: `claude`, `codex`, and initiative-local logs when they directly clarify attribution or orchestration

## Required Lane Artifact Shape

`query-manifest.json` must record:

- `configId`
- `laneId`
- `generatedAt`
- `providers`
- `families`
- `sessionIds`
- `sourcePaths`
- `totalWindows`
- `totalWindowTokens`

Each `candidate-hits.jsonl` row should retain:

- `id`
- `laneId`
- `provider`
- `sessionId`
- `turnId`
- `timestamp`
- `actor`
- `stageId`
- `sourcePath`
- `sourceLine`
- `score`
- `matchedFamilies`
- `matchedAnchors`
- `textPreview`
- `whyMatched`

Each `coverage-report.json` must include:

- `totalTurns`
- `usableTurns`
- `candidateHits`
- `selectedWindows`
- `selectedMoments`
- `totalWindowTokens`
- `countsByFamily`
- `countsByProvider`
- `countsByActor`
- `missingFamilies`
- `missingProviders`
- `blindSpots`

## Windowing Rules

- Build candidate hit lists before opening broader excerpts.
- Use excerpt windows to group nearby turns around scored hits.
- Keep windows small enough that extract lanes can review multiple moments without reading full sessions.
- Prefer more windows over fewer giant windows when recall is the concern.
- Re-score or merge windows only when the same interaction moment appears duplicated across adjacent turns.

## Completion Bar

Prep/index is incomplete if any of these are missing:

- normalized manifest
- normalized turns corpus
- query manifest for every lane
- coverage report for every lane
- source pointers that let an extractor reopen the raw evidence when needed
