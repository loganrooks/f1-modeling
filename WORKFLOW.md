# Workflow

This file defines how future-aware planning moves through the repo and how doctrine is consumed during planning, review, and carry-forward.

## Source-Of-Truth Stack

1. `.planning/LONG-ARC.md` for durable doctrine
2. `.planning/PROJECT.md`, `.planning/ROADMAP.md`, and `.planning/TECH-DEBT.md` for live operational canon
3. `.planning/STATE.md` for routing and session continuity
4. phase artifacts for current steering
5. governance interfaces such as anchors, audits, signals, and initiative ledgers when the active work cites them

## Standard Planning Loop

1. Start from `.planning/STATE.md`, then read `.planning/LONG-ARC.md`, `.planning/ROADMAP.md`, and the relevant `.planning/TECH-DEBT.md` entries.
2. Produce or update the steering context with normalized future-awareness and any canonical references needed for the current planning unit.
3. Research through the current GSDR `Genuine Gaps` and spike-routing conventions; do not invent a separate research-disposition layer in this wave.
4. Produce `PLAN.md` with structured `future_preservation` and debt disposition for touched seams.
5. Execute and verify against both local success criteria and any preserved seams or validation tasks created during planning.
6. Update `.planning/STATE.md`, `.planning/TECH-DEBT.md`, signals, and initiative ledgers when the work changes those surfaces.

## Reduced-Guarantee No-Context Rule

- No-context planning is allowed only as an explicit reduced-guarantee path.
- When used, record it in the planning package and surface it in `.planning/STATE.md`.
- Formal audits should treat reduced-guarantee planning as a caution flag, not as a silent normal mode.

## State Digest Expectations

Keep the `.planning/STATE.md` digest compact and pointer-heavy. The future-aware digest should include:

- active doctrine refs
- active relevant tech-debt ids
- active planning-system or roadmap-reset carry-forward items
- any reduced-guarantee status still in effect

## Formal Audit Preflight

Preflight is required for:

- planning-system initiatives
- roadmap rewrites
- architecture-setting phase plans
- application gates that touch protected seams or rewrite-trigger corridors

Required reads:

- `.planning/LONG-ARC.md`
- `.planning/TECH-DEBT.md`
- `.planning/STATE.md`
- current `CONTEXT.md`
- current `PLAN.md`
- relevant decision anchors

## Decision Anchor Consumption

- When a plan or audit depends on a decision anchor, cite it directly.
- Decision anchors should state the downstream work or artifact classes they constrain.

## Signals And Reflection

- Material future-aware drift, preservation failure, or doctrine-routing misses should become signals when durable enough to matter later.
- Reflection should turn repeated misses into workflow, guardrail, or tech-debt proposals instead of leaving them as ambient memory.

## Initiative Carry-Forward

- Planning-system and roadmap-reset initiatives must keep a carry-forward ledger with explicit destinations and an application ledger once live files change.
- Ordinary initiatives may use the same structure when helpful, but it is not mandatory for every initiative.
