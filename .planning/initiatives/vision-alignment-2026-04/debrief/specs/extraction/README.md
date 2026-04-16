# Extraction Specs

These specs are lane-level prompts for transcript and interaction evidence extraction only. They remain useful because they optimize for:

- cheap model usage
- deterministic prefiltering before agent reading
- compact output
- high recall without transcript rewrites

Canonical transcript-processing rules now live in `../transcript/`.

That layer owns:

- transcript substrate and indexing rules
- lane ids and artifact bundle shape
- sequencing between extraction and residual miss-audit
- final authority when transcript-processing rules conflict

Use these extraction prompts as subordinate lane guidance, not as the canonical source of transcript doctrine.

## Recommended Execution Order

1. `../transcript/spec-transcript-prep-and-index.md`
2. `../transcript/spec-transcript-extract-claude.md`
3. `../transcript/spec-transcript-extract-codex.md`
4. `../transcript/spec-transcript-extract-cross-model.md`
5. `../transcript/spec-transcript-residual-miss-audit.md`
6. `../spec-debrief-F-interaction-review.md`

## Alternatives Judged

### Option A: Raw project-scoped session reads

Rejected.

Current rough totals:

- relevant Claude project sessions already identified: about `2.25M` estimated tokens
- Codex sessions for `2026-04-10` and `2026-04-11`: about `15.6M` estimated tokens

This is not delegation-sized. It also encourages log rewriting rather than extraction.

### Option B: Global history only

Rejected as the primary method.

Current rough totals:

- `~/.claude/history.jsonl`: about `587K` estimated tokens
- `~/.codex/history.jsonl`: about `117K` estimated tokens

This is cheaper than raw sessions, but too lossy and noisy for an audit-quality interaction review. It loses project-scoped structure and weakens model/agent attribution.

### Option C: Prefilter plus targeted extraction

Viable.

Shape:

- shell search and date filtering first
- targeted excerpt windows second
- compact extraction output third

Expected cost:

- Claude extraction lane: usually `~45K-85K`
- Codex extraction lane: usually `~40K-85K`
- cross-model and agent-usage lane: usually `~45K-90K`

### Option D: Two-stage extraction then stronger synthesis

Preferred.

Shape:

1. cheap extraction lanes on filtered evidence
2. stronger synthesis lane on the compact evidence packs

Why preferred:

- best balance of recall, cost, and auditability
- lets us use cheap models without asking them to judge from raw sprawl
- keeps the later interaction review small enough for a stronger model

## Model Guidance

Default recommendation:

- extraction lanes: `gpt-5.4-mini` with `high` reasoning
- only escalate to `gpt-5.4` if a lane's evidence remains ambiguous after prefiltering

Why:

- these lanes are selecting and compressing evidence, not making the final judgment
- the expensive part is input tokens, so transcript prefiltering matters more than model size
- extraction outputs should be compact enough that a stronger downstream synthesis lane can review them cheaply

## Soft Budget

Per extraction delegation:

- soft cap: `<=100K` estimated tokens
- preferred target: `<=80K`
- preferred output budget: `<=1.5K` tokens per extract file unless a larger set is justified

If a lane needs more, it should explain why its prefilter was insufficient.

## Output Discipline

Extraction outputs must not rewrite logs.

Each extractor should:

- produce a compact query manifest
- select only the moments that matter
- keep each extracted row brief
- avoid long quotations unless a short quote is indispensable
- record blind spots or low-confidence coverage areas

Good extraction:

- concise summary
- evidence pointer
- why it matters

Bad extraction:

- long narrative recap
- copied transcript blocks
- quoting large chunks "just in case"
