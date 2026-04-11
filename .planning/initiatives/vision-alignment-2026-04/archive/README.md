# Archive — Superseded Initiative Artifacts

This directory holds earlier drafts of initiative prompt files that were replaced during methodological revision. They are retained for traceability and reflection on how the initiative itself evolved.

## Files

### `codex-stage-1-research.superseded.md`
**Date superseded:** 2026-04-10
**Reason:** First-draft monolithic prompt covering all 5 research tasks in a single Codex call. Superseded when the plan was restructured to use 3 parallel calls (1A/1B/1C) based on dependency analysis and context-size safety (staying under 250K per call). Also lacked the research-principles methodological framework that was later added.

### `codex-stage-2-deliberations.superseded.md`
**Date superseded:** 2026-04-10
**Reason:** First-draft monolithic prompt covering all 4 deliberations in a single Codex call. Superseded when:
1. Dependency analysis showed D2 and D3 needed iterative drafting (not batching) to honor their bidirectional coupling
2. The plan was restructured into wave 2a (D1) → wave 2b-i (D2) → wave 2b-ii (D3) → wave 2c (D4) with review gates
3. Deliberation framing shifted from "pick a side, do not hedge" to permitting deferral and reframing as valid outcomes (per RESEARCH-PRINCIPLES.md)

### `codex-stage-3-synthesis.superseded.md`
**Date superseded:** 2026-04-10
**Reason:** First-draft monolithic prompt covering all synthesis outputs in a single Codex call. Superseded when the plan was restructured into 3A (roadmap + phase insertions) and 3B (guardrails + tech debt + summary) as serial calls, and when the methodological framework was added.

## What changed

The key methodological shift between these superseded drafts and the current initiative structure:

1. **From solution-evaluation framing to terrain-mapping framing.** Old prompts pushed toward recommendations. New prompts distinguish research modes and permit non-closure.

2. **From rigid stage structure to iterative-by-default structure.** Old prompts assumed research → deliberation → synthesis as a one-way pipeline. New plan supports loopbacks at every review gate.

3. **From pre-committed deliberation count to scaffolding-not-execution-plan.** Old prompts fixed at 4 deliberations on 4 specific questions. New plan treats the deliberation structure as revisable at review gates.

4. **From ad-hoc quality instructions to RESEARCH-PRINCIPLES.md.** Old prompts had quality instructions inline. New initiative has a canonical methodological document every Codex call must read first.

5. **From batched D2+D3 to iterative D2 → D3 (Option B).** Old prompts batched coupled deliberations into one call. New plan honors bidirectional coupling through sequential drafting with cross-references.

6. **From no gray-area framework to explicit three-response decision framework.** Old prompts had "scope expansion" as a bullet point. New principles document has a full decision framework (defer / follow-and-mark / revisit-later).

These changes reflect lessons critically inherited from the Prix Guesser project's research methodology, adapted for F1 Modeling Lab's context.

---

*These files should not be used for execution. They are kept for historical reference and methodological reflection.*
