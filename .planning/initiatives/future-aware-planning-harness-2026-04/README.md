# Future-Aware Planning Harness Initiative

**Status:** Proposed scaffold
**Created:** 2026-04-16
**Primary target:** Move `f1-modeling` from future-aware planning canon to future-aware planning harness behavior.

## What This Is

This is a planning-system initiative, not a product phase. It exists because `f1-modeling` now has strong future-aware canon, but too much of that canon still lives in repo prose and initiative memory instead of repo-local Codex/GSDR behavior.

The aim is to move from:
- future-aware planning as doctrine

to:
- future-aware planning as doctrine plus reproducible harness behavior

## Start Here

- `PLAN.md` — staged adoption roadmap for the initiative
- `SPEC-INDEX.md` — canonical map of executable initiative specs
- `RESEARCH-PRINCIPLES.md` — comparison/adaptation rules for this initiative

## Purpose

The repo already has strong future-oriented canon in `VISION.md`, `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `TECH-DEBT.md`, and the Vision Alignment Initiative outputs. The problem is that this future-awareness mostly lives in project documents and human memory, not in the Codex/GSD operating path.

This initiative exists to close that gap.

The objective is not just to add better prose. The objective is to make future-aware planning structurally harder to bypass by:

- giving Codex explicit repo-local planning doctrine to read
- separating durable long-arc doctrine from shorter-horizon roadmap and state
- making `CONTEXT.md`, research, and `PLAN.md` preserve future-facing seams in a normalized way
- making planner/checker behavior enforce those seams instead of treating them as optional comments
- introducing a repo-local harness/bootstrap path so workflow behavior is reproducible and reviewable

## GSDR-specific adaptation requirement

This repo is not patching plain GSD. It is patching on top of **GSD Reflect**.

That means the initiative cannot stop at phase discuss/research/plan/check mechanics. It also has to think about the additional Reflect subsystems that already influence how planning knowledge moves through the repo, including:

- deliberations and decision anchors
- audits and cross-model review surfaces
- signals and the knowledge store
- progress / resume / state routing
- initiative and debrief scaffolding
- tech-debt and carry-forward integration

So the right question is not only, "what did `prix-guesser` patch in its portable GSD overlay?" The right question is, "how do we adapt the same future-aware transmission and preservation ideas to a richer GSDR stack without breaking the parts we already rely on?"

## Why this is warranted

`f1-modeling` is already paying the cost of architectural and roadmap corrections discovered during the Vision Alignment Initiative. That initiative successfully changed the roadmap and planning policy, but it did so mostly through repo documents and one-off orchestration, not through a repo-local planning harness that Codex will reliably follow later.

Without a follow-through initiative, the likely failure mode is drift:

- future-aware planning remains advisory
- new phases fall back to milestone-local planning
- open seams and explicit non-decisions disappear between discussion, research, and plan artifacts
- Codex sees only generic GSD behavior plus scattered repo prose
- GSDR-specific subsystems such as deliberations, audits, and signals continue to evolve without a clear future-aware contract

## Desired end state

At the end of this initiative, the repo should have:

1. A clear doctrine stack
   - `VISION.md` for broad platform identity
   - `LONG-ARC.md` for durable long-horizon doctrine and protected posture
   - `PROJECT.md` / `REQUIREMENTS.md` / `ROADMAP.md` / `STATE.md` for live operational planning

2. A Codex-visible repo-local planning surface
   - root `AGENTS.md` kept narrow and runtime-facing
   - new `.planning/AGENTS.md`
   - `WORKFLOW.md` and `.planning/ARTIFACT-GOVERNANCE.md` if accepted by the initiative

3. Structured future-aware planning artifacts
   - `CONTEXT.md` with normalized `Future Awareness` buckets
   - research artifacts that preserve unresolved seams and non-decisions explicitly
   - `PLAN.md` artifacts with structured `future_preservation`
   - explicit guidance for how deliberations, audits, and signals should carry long-horizon constraints forward

4. Actual harness enforcement
   - repo-local bootstrap/install path for the planning harness
   - downstream canonical-ref reads derived from context, not only suggested by prose
   - planner/checker behavior that fails dropped or genericized future-aware constraints
   - explicit reduced-guarantee path for no-context planning, rather than silent bypass
   - a clear decision about which Reflect subsystems need future-aware enforcement versus looser integration

5. A migration/application path
   - clear boundary between old artifacts and new artifact expectations
   - a first real proving ground on Phase `3.2` planning rather than abstract policy only
   - explicit carry-forward posture for GSDR-only surfaces like deliberations, audits, and signals

## Out of scope

- Rewriting the whole global GSD / Reflect installation
- Replatforming all past phase artifacts to the new shape
- Product-code changes unrelated to planning harness behavior
- Blindly copying `prix-guesser` doctrine or naming when the product horizon differs

## Primary source of inspiration

The nearest concrete comparison is:

- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay`
- `/home/rookslog/workspace/projects/prix-guesser/.planning/LONG-ARC.md`
- `/home/rookslog/workspace/projects/prix-guesser/.planning/deliberations/2026-04-10-future-awareness-harness-patch.md`

The initiative should borrow mechanisms, not cargo-cult language. It should also explicitly document where the `f1-modeling` GSDR stack needs stronger or different treatment than `prix-guesser`'s plain-GSD stack.
