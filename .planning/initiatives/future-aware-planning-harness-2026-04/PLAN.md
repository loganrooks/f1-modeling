# Master Plan: Future-Aware Planning Harness Initiative

**Status:** Proposed scaffold
**Date:** 2026-04-16
**Target runtime:** Codex GPT-5.4

---

## Initiative Goal

Adopt a medium-high leverage future-aware planning harness for `f1-modeling` by moving future-awareness from repo canon into repo-local Codex/GSDR workflow behavior.

This initiative should not stop at recommendations. It should produce concrete planning/governance artifacts, repo-local harness surfaces, and an application path to the next real planning package.

---

## Core framing

This is a **GSDR adaptation initiative**, not a plain-GSD overlay port.

The comparison repo (`prix-guesser`) is valuable because it shows how future-awareness can become structurally enforced through context, planning, and checking surfaces. But `f1-modeling` sits on top of a richer Reflect stack, so this initiative has to answer two levels of question:

1. Which mechanism-level ideas from `portable-gsd` are worth adopting?
2. Which additional GSDR subsystems here also need future-aware transmission, preservation, or governance rules?

Relevant `f1-modeling` subsystems to account for:
- phase discuss / research / planning / verification
- deliberations and decision anchors
- audits and cross-model review requests
- signals and the knowledge store
- progress / resume / state routing
- initiative / debrief / carry-forward scaffolding
- tech-debt and rewrite-trigger governance

---

## Success Criteria

This initiative is successful only if all of the following become true:

1. Codex has repo-local planning/governance files that tell it what artifacts matter and how they relate.
2. The repo has a durable doctrine layer stronger than `VISION.md` alone.
3. New phase context artifacts use a normalized `Future Awareness` structure rather than ad hoc prose.
4. New planning artifacts preserve future-facing seams in a structured, reviewable way.
5. Planner/checker behavior is upgraded enough that dropped or genericized future-aware constraints are visible failures, not silent drift.
6. The initiative explicitly decides how GSDR-specific surfaces such as deliberations, audits, and signals relate to the future-aware harness.
7. The next real planning package (`3.2`) can be produced using the upgraded harness path.

---

## Proposed Scope

### Workstream A — Doctrine and artifact roles

Create the missing doctrine and planning-governance layer so future-aware canon is explicit and load-bearing.

Target outputs:
- root `AGENTS.md` review/update if needed
- new `.planning/AGENTS.md`
- new `.planning/LONG-ARC.md`
- new `WORKFLOW.md`
- new `.planning/ARTIFACT-GOVERNANCE.md`

Key decisions to close:
- What belongs in `LONG-ARC.md` versus `VISION.md`
- Which files are live operational state versus doctrine versus archive
- How much planning/runtime doctrine belongs in root `AGENTS.md` versus `.planning/AGENTS.md`
- Which artifact classes should explicitly carry future-aware obligations

### Workstream B — Repo-local harness/bootstrap path

Make the planning harness reproducible and repo-local rather than implied by home-level installs.

Target outputs:
- repo-local setup/bootstrap script for Codex/GSDR planning harness
- repo-local overlay or equivalent patch surface for workflow/template changes
- package or script entrypoints that make harness setup and verification visible

Key decisions to close:
- whether to adopt a `portable-gsd`-style overlay path directly or a lighter-weight local patch layer
- how much of the current home-level GSDR install should be shadowed repo-locally
- how the repo-local path will coexist with existing Reflect tooling

### Workstream C — Structured future-aware artifact schema

Upgrade planning artifacts so future-aware information is normalized and survives transmission.

Target outputs:
- normalized `Future Awareness` buckets for `CONTEXT.md`
- structured `future_preservation` in `PLAN.md`
- research-stage disposition/preservation section for unresolved seams
- canonical reference propagation rules

Required buckets to evaluate:
- `Protected Seams`
- `Explicit Non-Decisions`
- `Current Posture`
- `Future Shape Notes`

Required preservation outcomes to evaluate:
- preserved seam
- sequencing choice
- validation task
- explicit non-action rationale

### Workstream D — GSDR-specific subsystem integration

Decide how the future-aware harness should affect the Reflect-only subsystems that sit outside the plain phase-planning loop.

Target outputs:
- deliberation/decision-anchor integration notes or rules
- audit request/response integration notes or rules
- signal/knowledge-store integration notes or rules
- progress/resume/state alignment rules
- initiative/debrief carry-forward rules

Key questions:
- Should deliberations have a future-preservation analogue, or is doctrine carried through decision anchors differently?
- Which audit surfaces should be required to read long-arc doctrine or future-aware constraints?
- Should signals record future-aware drift and preservation failures as first-class observations?
- How should initiative/debrief artifacts feed back into future-aware harness changes?

### Workstream E — Planner/checker enforcement

Move from advisory guidance to auditable enforcement.

Target outputs:
- no-context exploratory planning gate or explicit reduced-guarantee path
- planner behavior that requires mapping material future-aware items forward
- checker behavior that fails missing/generic preservation
- possible structural validation hooks for plan shape
- doctrine-sensitive launch-truth capture/preflight for spawned workers where warranted

### Workstream F — Migration and proving ground

Apply the new harness to the first real planning target instead of leaving it theoretical.

Target outputs:
- migration note explaining old-artifact compatibility versus new-artifact expectations
- `3.2` context/planning path prepared to use the upgraded harness
- explicit boundary for what older phase docs will and will not be retrofitted
- explicit boundary for which GSDR subsystem surfaces get immediate upgrades versus later carry-forward

---

## Recommended Stage Sequence

### Stage 1 — Research and adaptation inventory

Purpose:
- map the exact `prix-guesser` mechanisms worth borrowing
- distinguish mechanism from repo-specific doctrine
- inspect current `f1-modeling` GSDR surfaces and identify the real patch points
- identify which Reflect-specific subsystems need treatment in this initiative versus later

Deliverables:
- adoption memo
- source-mechanism comparison table
- GSDR subsystem inventory
- patch-surface inventory for this repo

### Review Gate 1 — Mechanism and adaptation decisions

Purpose:
- review the Wave 1 research before doctrine or harness proposals are drafted
- decide what is `borrow now`, `adapt now`, `later`, or `reject`
- decide whether the initiative should stay unified or split by subsystem scope

Primary review artifact:
- `specs/spec-wave-1-review-gate-mechanism-and-adaptation-decisions.md`

Review gate questions:
- Which borrowed mechanisms are actually behavior-changing enough to justify adoption here?
- Which ones need substantial adaptation because this repo is on GSDR?
- Which Reflect-specific subsystems must be in-scope now?
- Is Wave 2A still the right next step, or should the initiative be narrowed or split first?

### Stage 2 — Doctrine and governance package

Purpose:
- create the repo-local doctrine and planning-governance layer before changing tool behavior

Deliverables:
- `.planning/LONG-ARC.md`
- `.planning/AGENTS.md`
- `WORKFLOW.md`
- `.planning/ARTIFACT-GOVERNANCE.md`
- any required root `AGENTS.md` refinements

Review gate questions:
- Is doctrine cleanly separated from roadmap/state?
- Are artifact roles explicit enough for Codex to navigate?
- Is the package narrow enough to stay maintainable?
- Does it name GSDR-only artifact classes clearly enough?

### Stage 3 — Harness and template patch

Purpose:
- implement repo-local workflow/template changes so future-awareness is structurally carried through discuss/research/plan/check flows

Deliverables:
- local setup/bootstrap path
- local workflow/template patch surface
- normalized `Future Awareness` context shape
- `future_preservation` plan shape
- canonical-ref propagation mechanism
- research disposition mechanism

Review gate questions:
- Is this really repo-local and reproducible?
- Is the patch changing active behavior, not just template prose?
- Are backward-compatibility and override paths explicit?

### Stage 4 — GSDR subsystem adaptation

Purpose:
- adapt the future-aware harness ideas to Reflect-specific subsystems instead of leaving them as phase-planning-only doctrine

Deliverables:
- rules or schema adjustments for deliberations, audits, signals, progress/state, and initiative/debrief carry-forward
- explicit acceptance/rejection decisions for each subsystem lane

Review gate questions:
- Which extra subsystems genuinely need enforcement versus just doctrine?
- Are we adding useful structure or just governance weight?
- Does the adaptation still feel coherent as one harness, not five separate policies?

### Stage 5 — Enforcement and preflight

Purpose:
- make dropped future-aware seams fail loudly enough to matter

Deliverables:
- checker/prompt enforcement
- explicit no-context reduced-guarantee path
- doctrine-sensitive preflight / launch-truth capture design as appropriate

Review gate questions:
- Are failures specific and actionable rather than noisy?
- Does the repo have a realistic override path for legitimate exceptions?
- Is the enforcement stronger than current prose-only guidance?

### Stage 6 — First proving-ground application

Purpose:
- use the upgraded harness on the next real project planning unit rather than leaving the initiative self-referential

Deliverables:
- `3.2` planning entry path under the new harness
- compatibility/migration note
- post-application assessment of what still leaks

Review gate questions:
- Did the harness materially change planning quality for `3.2`?
- Which pieces helped most?
- What remains too expensive or too weak?

---

## Initiative Packaging Recommendation

Yes, this should be treated as a new initiative.

Why:
- it is cross-cutting governance/harness work, not one phase artifact
- it changes planning doctrine, workflow behavior, and artifact schema together
- it must also decide how Reflect-only subsystems participate in future-aware governance
- it needs review gates because it can easily become overbuilt or too repo-specific
- it should produce durable repo infrastructure that later phases inherit

This is closer to a planning-system initiative than to a normal roadmap phase.

---

## Recommended First Wave

If launched now, the first wave should be limited to:

1. compare `prix-guesser` mechanisms to current `f1-modeling` harness behavior
2. inventory the GSDR-specific subsystems that need adaptation, not just the phase-planning loop
3. draft the doctrine/governance package for this repo
4. decide the repo-local bootstrap/overlay strategy before any implementation patching

That first wave is enough to avoid jumping directly into premature harness edits.

---

## Risks To Manage

- Over-copying `prix-guesser` language that belongs to its product, not this one
- Building governance bulk without actual workflow leverage
- Patching templates only while leaving active workflow bodies unchanged
- Breaking backward compatibility for older phase artifacts too early
- Treating GSDR-only subsystems as an afterthought and then having to retrofit them later
- Spending so much effort on harness purity that Phase `3.2` planning is delayed without commensurate value

---

## Default Recommendation

Proceed as a formal initiative, but keep the first pass narrower than Vision Alignment:
- smaller research wave
- faster doctrine decision gate
- immediate focus on repo-local enforcement surfaces
- explicit GSDR-subsystem adaptation pass before rollout is called complete
- proving-ground application on `3.2` as the termination condition
