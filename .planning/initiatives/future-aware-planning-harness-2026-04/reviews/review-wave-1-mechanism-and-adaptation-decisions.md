# Wave 1 Review Gate: Mechanism And Adaptation Decisions

**Date:** 2026-04-16
**Gate:** 1
**Status:** Completed
**Initiative:** `future-aware-planning-harness-2026-04`

---

## Inputs Reviewed

- [PLAN.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md)
- [RESEARCH-PRINCIPLES.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md)
- [01-mechanism-comparison-and-patch-surface-inventory.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/research/01-mechanism-comparison-and-patch-surface-inventory.md)
- [02-gsdr-subsystem-adaptation-inventory.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md)

---

## Outcome

**Proceed to Wave 2A as planned.**

The initiative should remain unified. It does not need to split into a doctrine-only initiative and a Reflect-subsystem follow-on. The research converges on one coherent framing:

- phase-steering enforcement is the primary leverage point
- Reflect-only subsystem treatment is still necessary now
- but most non-phase subsystems need bounded governance or interface rules, not cloned plan-schema enforcement

So the right move is:

- keep `2A` as the next synthesis target
- keep the initiative unified
- explicitly reject full artifact symmetry
- narrow a few later-stage expectations so the initiative stays leverage-focused

---

## Gate Answers

### 1. Which `prix-guesser` mechanisms are genuinely behavior-changing and worth adopting here?

These are the mechanisms that change real harness behavior rather than only doctrine:

- hard or semi-hard context gating
- `canonical_refs` propagation into downstream reads
- planner mapping rules for future-aware items
- structured `future_preservation` in plans
- checker failures for missing or generic preservation
- repo-local bootstrap and overlay behavior

### 2. Which mechanisms should be adapted rather than copied because `f1-modeling` is on GSDR, not plain GSD?

Most of the high-leverage mechanisms require adaptation rather than literal copying because `f1-modeling` sits inside the Reflect runtime and already has additional carriers such as `progress`, `resume`, `signal`, `reflect`, `verify-phase`, and `validate-phase`.

The most important `adapt now` items are:

- normalized `Future Awareness` buckets in context artifacts
- hard or semi-hard context gating
- structured `future_preservation`
- planner mapping rules
- checker failure behavior
- repo-local bootstrap and overlay behavior
- decision-anchor consumption rules
- formal audit required-reading rules
- progress, resume, and state digest rules
- tech-debt and rewrite-trigger disposition rules

### 3. Which GSDR-only subsystems need explicit treatment now?

These lanes are in-scope now:

- progress, resume, and state routing
- tech-debt and rewrite-trigger governance
- formal audit and review-gate preflight
- deliberations and decision anchors
- signals and reflection taxonomy/guidance
- initiative and debrief carry-forward rules

The first three need real enforcement in this initiative. The latter three need explicit governance and consumption rules now, but not full artifact-schema symmetry.

### 4. Which GSDR-only subsystems should be left advisory or deferred?

These should stay deferred or lighter-weight in the first pass:

- `verify-phase` and `validate-phase` future-aware uplift
- dedicated research-disposition schema changes
- heavy signal automation or special CRUD tooling for tech-debt
- broad workflow support for initiative carry-forward beyond strategic initiatives

### 5. Is the doctrine and governance package still the right next synthesis target?

Yes.

Wave `2A` is still the correct next step because the research confirms that the repo is missing a durable doctrine and artifact-governance layer. Without that layer, later harness patches would have no stable repo-local source of truth for:

- what doctrine is load-bearing
- which artifact classes matter
- where future-aware obligations should travel
- which subsystem lanes are enforcement versus governance only

### 6. Is the current initiative still appropriately scoped?

Yes, with one concrete narrowing:

- keep the initiative unified
- do not split it yet
- but remove `research disposition mechanism` as a required Stage 3 deliverable until it is reconciled with GSDR `Genuine Gaps` and spike semantics

That is the only structure correction needed now.

---

## Mechanism Decisions

| Mechanism | Decision | Why |
| --- | --- | --- |
| Normalized `Future Awareness` buckets | `adapt now` | Valuable, but must fit `f1-modeling` doctrine and GSDR routing rather than copying `prix-guesser` wording directly. |
| Hard or semi-hard context gating | `adapt now` | High-leverage behavior change, but it must be paired with Reflect-aware reduced-guarantee signaling through state and resume surfaces. |
| `canonical_refs` propagation into downstream reads | `borrow now` | The capture surface already partly exists in active GSDR, so downstream resolution is the clearest direct borrow. |
| Structured `future_preservation` in plans | `adapt now` | Core mechanism, but it must coexist with current plan artifacts, must-haves, and later Reflect verification surfaces. |
| Planner mapping rules for future-aware items | `adapt now` | Necessary to turn doctrine into plan consequences, but they must align with GSDR unresolved-question handling. |
| Checker failures for missing or generic preservation | `adapt now` | This is the main enforcement point, but it should land first in planner/checker flow rather than immediately in all closeout machinery. |
| Research disposition handling | `borrow later` | Useful, but currently overlaps too much with `Genuine Gaps` and spike routing to make it a first-pass requirement. |
| Repo-local bootstrap and overlay behavior | `adapt now` | Required so repo-local harness behavior is durable and reviewable rather than operator-local. |
| Full artifact symmetry across Reflect surfaces | `reject` | This would create governance bulk with weak leverage and duplicate truth across artifacts. |

---

## GSDR Subsystem Decisions

| Subsystem lane | Decision | Enforcement level now | Notes |
| --- | --- | --- | --- |
| Phase steering artifacts (`CONTEXT` / `RESEARCH` / `PLAN`) | `borrow now` | `enforced` | Main leverage lane for the initiative. |
| Progress, resume, and state routing | `adapt now` | `enforced` | Must carry a compact future-aware digest or routing will remain phase-local. |
| Tech-debt and rewrite-trigger governance | `adapt now` | `enforced` | Registry entries must become planning inputs and explicit dispositions. |
| Formal audits and review gates | `adapt now` | `enforced` for high-stakes gates | Require doctrine, debt, and anchor reading at certification points. |
| Deliberations and decision anchors | `adapt now` | `advisory` | Need consumption rules and citation discipline, not cloned plan schema. |
| Signals and reflection | `adapt now` | `advisory` now, stronger later if triaged | Add future-aware drift guidance and remediation routing. |
| Initiative and debrief carry-forward | `adapt now` | `advisory` for ordinary initiatives, `enforced` for planning-system initiatives | Keep destination discipline and application ledgers. |
| Phase verification and validation | `borrow later` | `advisory` | Defer until plan-time enforcement proves insufficient. |
| Cross-cutting symmetry mandate | `reject` | `none` | Keep interface discipline, reject schema cloning. |

---

## Initiative Structure Changes Before Wave 2A

The initiative remains structurally sound, but these carry-forwards are now binding:

1. **Wave `2A` remains the next step.**
   `2A` should draft the doctrine stack and artifact-governance package with explicit treatment of:
   - doctrine hierarchy
   - artifact role map
   - decision-anchor consumption rules
   - audit required-reading rules
   - initiative carry-forward destinations
   - tech-debt and rewrite-trigger role in planning

2. **Stage 3 stays focused on active steering-chain behavior.**
   Stage 3 should remain the place for:
   - repo-local bootstrap and overlay setup
   - discuss, research, plan, and checker patching
   - normalized `Future Awareness`
   - `future_preservation`
   - `canonical_refs` propagation

3. **`research disposition mechanism` is no longer a required Stage 3 deliverable.**
   It is now deferred until the initiative explicitly decides how it should coexist with:
   - `Genuine Gaps`
   - `Still Open`
   - spike routing

4. **Stage 4 should emphasize interface discipline over schema cloning.**
   Its job is to define how Reflect-only subsystem lanes consume doctrine and preservation state, not to force every artifact into the same shape.

5. **The initiative should stay unified.**
   No split is warranted yet because the doctrine package, steering-chain patch, and Reflect-subsystem rules still form one coherent adaptation path.

---

## Next-Step Decision

**Proceed to Wave `2A` as planned, with the structure changes above.**

The right immediate target is still:

- [spec-wave-2A-synthesis-doctrine-and-governance-package.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-2A-synthesis-doctrine-and-governance-package.md)

`2A` should be treated as the doctrine-and-boundary-setting pass that makes later harness changes reviewable and coherent.
