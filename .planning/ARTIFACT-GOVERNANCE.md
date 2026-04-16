# Artifact Governance

This file defines artifact classes, authority boundaries, lifecycle rules, and future-aware obligations for the planning surfaces in this repo.

## Doctrine Hierarchy

- `.planning/VISION.md` is broad vision.
- `.planning/LONG-ARC.md` is durable planning doctrine.
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, and `.planning/STATE.md` are live canon and routing.
- Phase artifacts are local steering artifacts.
- Other artifact classes are interface, evidence, generated, or historical lanes unless explicitly promoted.

## Artifact Classes

| Class | Primary authority | Future-aware obligation | Primary consumers |
| --- | --- | --- | --- |
| Doctrine | `.planning/VISION.md`, `.planning/LONG-ARC.md` | define posture, seams, and non-decisions | planners, auditors, review gates |
| Operational canon | `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md` | translate doctrine into active requirements, sequencing, and debt disposition | planners, implementers, audits |
| Routing memory | `.planning/STATE.md` | keep active refs, debt ids, and reduced-guarantee status visible without duplicating doctrine | progress, resume, active sessions |
| Phase steering artifacts | `CONTEXT.md`, `RESEARCH.md`, `PLAN.md` | preserve future-aware obligations for one planning unit | planning and execution flows |
| Decision anchors and deliberations | deliberation records and decision anchors | declare downstream constraints and citation targets | planners, audits, later initiatives |
| Audits and review gates | audit outputs and gate reviews | certify against doctrine, debt, and local change correctness when acting as gates | humans, acceptance decisions |
| Signals and reflection | knowledge signals and reflections | record durable drift, preservation misses, and workflow consequences when material | future planning, reflection |
| Initiatives, debriefs, and ledgers | initiative folders, carry-forward ledgers, application ledgers | route accepted consequences into concrete destinations | planning-system initiatives, roadmap resets |
| Generated, reference, and archive artifacts | generated outputs, imported references, archived docs | remain clearly non-canonical unless promoted explicitly | humans, audits, historical lookup |

## Steering Artifact Rules

- `CONTEXT.md` carries normalized future-awareness and any canonical refs needed by the planning unit.
- `RESEARCH.md` carries evidence, options, `Genuine Gaps`, and `Still Open`.
- `PLAN.md` carries structured `future_preservation` and tech-debt disposition.

`RESEARCH.md` does not gain a mandatory new research-disposition block in this first pass.
`SUMMARY.md` and verification outputs may remain useful closeout artifacts, but this wave does not promote them to first-pass steering surfaces.

## Governance Interface Rules

- Decision anchors must declare the downstream constraints and likely consumer artifacts they affect.
- Formal audits must cite the doctrine and debt surfaces they read when they are acting as gates.
- Signals should classify future-aware drift when material, but remain lightweight observations rather than doctrine files.
- Initiative carry-forward ledgers should use explicit destinations such as `signal`, `guardrail`, `workflow`, `tech-debt`, `template`, or `none`.

## Status And Supersession

Artifacts that are revisited over time should remain legible as:

- active
- historical
- superseded
- generated or reference
- archived

When an artifact is superseded, point directly to the replacement instead of leaving the older file as ambient truth. Where older files do not yet carry explicit frontmatter status, the supersession note can live in the heading or opening section.

## Symmetry Rejection

- Reject full artifact symmetry across Reflect surfaces.
- Enforce future-aware discipline at transmission points and gate interfaces.
- Preserve artifact-appropriate shapes for deliberations, audits, signals, and debriefs.

## Maintenance Rule

Update this file when:

- a new artifact class becomes common
- a new formal gate is added
- doctrine or routing authority moves to different files
