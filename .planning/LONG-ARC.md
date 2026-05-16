---
document: LONG-ARC
status: canonical
type: strategy-doctrine
scope: Durable long-arc product, architecture, modeling, compute, and governance doctrine that current planning must preserve without widening active phase scope.
last_updated: 2026-05-15
related_documents:
  - .planning/VISION.md
  - .planning/PROJECT.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/TECH-DEBT.md
  - .planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md
  - .planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md
  - .planning/initiatives/seeds/puzzle-mode-pedagogy.md
  - .planning/deliberations/educational-pedagogy-and-learning-paths.md
---

# Long-Arc Planning Doctrine

This file ratifies the durable planning doctrine that sits between `.planning/VISION.md` and the live operational canon. It is not a second roadmap, a deferred-features list, or a back door for importing later-phase delivery into the current phase.

## Current Product And Planning Posture

- The repo is building a local-first, single-user F1 modeling lab that is both an educational surface and a future engineering workbench.
- Current planning posture is reduced-order, explainable, staged, and explicit about model limits.
- The active long-horizon planning corridor is Phase `3.2 -> 3.3 -> 3.4`, because the execution boundary, visualization substrate, and lesson/semantic foundation must land before wider Phase 4 product surfaces.

## Protected Seams

- Preserve a transport-neutral execution boundary so compute can later move between local, remote, and cloud backends without rewriting the product surface.
- Preserve regulation-family-aware execution and semantics; do not let 2026-specific assumptions harden into the long-lived runtime path.
- Preserve typed artifacts with lineage, provenance, fidelity, validation, and comparability state as first-class product surfaces.
- Preserve the educational coupling between artifacts, anchors, lessons, and visual surfaces; education is not a disconnected presentation layer.
- Preserve artifact-envelope, lesson-schema, and visualization-substrate **slots for puzzle / skill-practice mode** — selective artifact masking, scoring / judgment / reconstruction artifact roles, difficulty metadata, and an explicit-pedagogy lesson-body variant — so the 3.2 → 3.3 → 3.4 corridor design does not force a retrofit when puzzle-mode delivery later begins. Puzzle mode is an optional explicit layer on top of the primary implicit pedagogy; both must coexist (see `.planning/VISION.md` § Skill Practice & Puzzle Mode and `.planning/initiatives/seeds/puzzle-mode-pedagogy.md`).
- Preserve the explicit layered stack of plant and sensor model -> observer -> model-based control -> later RL.
- Preserve honesty labeling, thin-client responsiveness, and accessibility as architectural obligations, not optional polish.

## Current Posture

- Local-first and single-user remain the active operating posture.
- Reduced-order models are the correct current fidelity posture; engineer-grade direction does not justify false precision.
- TypeScript compute remains an acceptable bridge architecture while the rewrite triggers in `.planning/TECH-DEBT.md` stay unmet.
- Visualization is a product surface, not decoration.

## Explicit Non-Decisions

- Do not commit yet to the long-term numerical backend language or deployment topology.
- Do not decide yet whether future remote or cloud compute is self-hosted only, partnered, or fully hosted.
- Do not commit yet to the eventual RL interface or reward structure.
- Do not collapse telemetry import architecture, observer design, and control architecture into one premature implementation choice.

## Future Shape Notes

- Multi-regulation comparison remains a preserved future shape.
- Calibration against imported data remains a preserved future shape.
- Observer-aware replay remains a preserved future shape.
- MPC-ready control seams remain a preserved future shape.
- Later RL work remains a preserved future shape after the simulator and control baselines are credible.
- Puzzle / skill-practice mode (chess.com-shaped, single-player, built on existing artifacts) remains a preserved future shape; the 3.2/3.3/3.4 corridor protects its required slots without delivering them. Revisit triggers are recorded in `.planning/initiatives/seeds/puzzle-mode-pedagogy.md`.

These are future directions that current planning must preserve. They are not immediate scope imports.

## Doctrine Interaction With Tech Debt

`.planning/TECH-DEBT.md` is the live rewrite-trigger registry that operationalizes this doctrine when transitional seams are accepted temporarily.

When a protected seam is intentionally bridged, the relevant debt entry becomes part of the doctrine-carrying surface for that area. Plans should disposition the relevant debt ids rather than leaving the bridge implicit.

## What Current Planning Must Do

- Cite this file when phase sequencing, architectural seams, or rewrite-trigger decisions materially interact with long-arc posture.
- Preserve future seams without padding the current phase into a later one.
- Record explicit non-actions when the correct move is to defer rather than silently decide.
- Escalate to `.planning/VISION.md` only when the question is product identity or eventual platform shape rather than planning doctrine.

## Reopen Conditions

Reopen this file only when one of these changes materially:

- product identity
- compute posture
- regulation-family doctrine
- educational-coupling doctrine
- control-stack doctrine
- the boundary between doctrine and live operational canon
