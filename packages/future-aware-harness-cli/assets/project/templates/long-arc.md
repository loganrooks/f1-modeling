---
document: LONG-ARC
status: canonical
type: strategy-doctrine
scope: Durable long-arc product, architecture, modeling, compute, and governance doctrine that current planning must preserve without widening active phase scope.
last_updated: {{DATE}}
related_documents:
  - .planning/VISION.md
  - .planning/PROJECT.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/TECH-DEBT.md
---

# Long-Arc Planning Doctrine

This file ratifies the durable planning doctrine that sits between `.planning/VISION.md` and the live operational canon. It is not a second roadmap, a deferred-features list, or a back door for importing later-phase delivery into the current phase.

Use this scaffold to capture the seams, posture, and explicit non-decisions that current planning must preserve for `{{PROJECT_NAME}}`.

## Current Product And Planning Posture

- [Summarize the repo's current product and planning posture in 3-5 bullets.]
- [State the active near-term corridor the roadmap is actually moving through.]

## Protected Seams

- [List the interfaces, abstractions, or authored-shape boundaries that current work must preserve.]
- [These should be durable seams, not immediate task lists.]

## Current Posture

- [State the current trust, visibility, fidelity, service, or architecture stance.]
- [Explain what downstream work must respect right now.]

## Explicit Non-Decisions

- [List the choices that should stay intentionally open rather than being silently fixed.]
- [If something is preserved for later, say so directly.]

## Future Shape Notes

- [Capture bounded future-shape notes that should influence current seams without importing future scope.]
- [Prefer concrete corridor notes over vague ambition.]

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
- domain-family or semantic doctrine
- educational or workflow doctrine
- the boundary between doctrine and live operational canon
