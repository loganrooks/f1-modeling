# Planning Agents

This file governs planning work under `.planning/`. Root `AGENTS.md` should stay narrow and route agents here for the planning contract.

## Read Order

1. `.planning/STATE.md`
2. `.planning/LONG-ARC.md`
3. `.planning/PROJECT.md`
4. `.planning/ROADMAP.md`
5. `.planning/TECH-DEBT.md`
6. the active phase or initiative files
7. relevant decision anchors, audits, signals, or ledgers when they are cited by the active work

Use `.planning/VISION.md` when the question is broad platform identity rather than live planning posture.

## Doctrine Hierarchy

- `.planning/VISION.md` explains broad ambition and eventual shape.
- `.planning/LONG-ARC.md` carries durable planning doctrine.
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and `.planning/TECH-DEBT.md` are the live operational canon.
- `.planning/STATE.md` is the routing digest for current work.
- Phase artifacts are local steering artifacts for one planning unit.
- Deliberations, decision anchors, audits, signals, and initiative ledgers are interface or evidence lanes, not automatically co-equal doctrine.

## Future-Aware Planning Contract

- Every new `CONTEXT.md` should carry `Protected Seams`, `Explicit Non-Decisions`, `Current Posture`, and `Future Shape Notes`.
- Every new `PLAN.md` should map each material future-aware item in `future_preservation` to exactly one of: preserved seam, sequencing choice, validation task, or explicit non-action rationale.
- Every plan that touches a registered seam should disposition the relevant `.planning/TECH-DEBT.md` ids.
- Reduced-guarantee no-context planning must be explicit and must be reflected in `.planning/STATE.md`.

## Enforcement-Now Lanes

- phase steering artifacts
- progress, resume, and state routing
- tech-debt disposition
- formal audit preflight

## Governance-Only Lanes

- decision anchors and deliberations
- signals and reflection
- initiative carry-forward and application ledgers

These lanes need citation and consumption rules now. They do not need plan-schema cloning in this wave.

## Symmetry Rejection

- Do not force every Reflect artifact to look like a phase plan.
- Do not add a dedicated research-disposition requirement in this first pass.
- Preserve artifact-appropriate shapes for anchors, audits, signals, and debriefs.

## Audit Readiness Rule

Formal audits and review gates must read doctrine, debt, state, and relevant anchors before certifying planning or application changes.
