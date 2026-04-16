# Wave 4A Synthesis: GSDR Subsystem Adaptation Policy

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `4A`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-4A-synthesis-gsdr-subsystem-adaptation-policy.md`
- Output: `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/06-gsdr-subsystem-adaptation-policy.md`
- Status: proposed
- Stage 3 posture consumed: accepted input after Wave `3C` application, review, and recheck
- Stage 4 decision summary: keep three remaining Reflect-only lanes at governance/doctrine level for now; reserve a narrow `4B` only for formal audit and review-gate preflight if Gate `4` still wants one application wave

## 2. Inputs Consumed

- Initiative framing:
  - `README.md`
  - `PLAN.md`
  - `RESEARCH-PRINCIPLES.md`
  - `SPEC-INDEX.md`
- Prior research and review chain:
  - `research/01-mechanism-comparison-and-patch-surface-inventory.md`
  - `research/02-gsdr-subsystem-adaptation-inventory.md`
  - `reviews/review-wave-1-mechanism-and-adaptation-decisions.md`
  - `synthesis/01-doctrine-and-governance-package.md`
  - `synthesis/03-harness-patch-plan.md`
  - `reviews/review-wave-3-harness-patch-decisions.md`
  - `reviews/review-wave-3B-core-harness-patch.md`
  - `reviews/review-wave-3C-routing-digest-patch.md`
  - `reviews/recheck-wave-3C-routing-digest-patch.md`
  - `synthesis/05-routing-digest-patch-application.md`
- Live doctrine and governance shell:
  - `.planning/LONG-ARC.md`
  - `.planning/AGENTS.md`
  - `WORKFLOW.md`
  - `.planning/ARTIFACT-GOVERNANCE.md`
  - `.planning/STATE.md`
  - `.planning/TECH-DEBT.md`
- Deliberation and anchor surfaces inspected:
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`
  - `$HOME/.codex/get-shit-done-reflect/templates/deliberation.md`
- Audit and review surfaces inspected:
  - `.planning/initiatives/vision-alignment-2026-04/audit/README.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`
  - `$HOME/.codex/skills/gsdr-audit/SKILL.md`
- Signals, knowledge-store, and reflection surfaces inspected:
  - `.planning/knowledge/index.md`
  - `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md`
  - `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-long-horizon-roadmap-and-tech-debt.md`
  - `$HOME/.codex/skills/gsdr-signal/SKILL.md`
  - `$HOME/.codex/get-shit-done-reflect/workflows/signal.md`
  - `$HOME/.codex/skills/gsdr-reflect/SKILL.md`
  - `$HOME/.codex/get-shit-done-reflect/workflows/reflect.md`
- Initiative, debrief, and carry-forward scaffolding inspected:
  - `.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md`
  - `.planning/initiatives/vision-alignment-2026-04/debrief/CARRY-FORWARD-LEDGER.md`
  - `.planning/initiatives/vision-alignment-2026-04/debrief/CHANGES-BEFORE-NEXT-INITIATIVE.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`
  - `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`

## 3. Stage 4 Framing

Stage `4` should not reopen what Stage `2` and Stage `3` already settled. The doctrine shell, steering-chain patch, routing digest, and tech-debt/state consumption rules are accepted inputs. The remaining question is narrower: how the still-unpatched Reflect-only lanes should consume that accepted doctrine without turning every artifact into a second `PLAN.md`.

The coherent Stage `4` policy package is:

- enforce only where the lane can certify, route, or materially erase future-aware obligations
- keep other lanes on citation, destination, and carry-forward discipline rather than schema cloning
- reject any move that turns deliberations, audits, signals, and debriefs into five parallel future-awareness schemas

That yields one narrow application criterion: a lane is `application-worthy now` only if a live current surface can authorize high-stakes planning or governance change today and does not yet reliably consume `.planning/LONG-ARC.md`, `.planning/TECH-DEBT.md`, `.planning/STATE.md`, and relevant decision anchors. By that standard, only the formal audit and review-gate lane still justifies a possible `4B`.

Cross-cutting rejection remains binding:

- no full artifact symmetry across Reflect surfaces
- no Stage `4` substitute for the deferred research-disposition system
- no spillover into `verify-phase`, `validate-phase`, signal automation, or the `3.2` proving-ground application

## 4. Subsystem Adaptation Matrix

| Lane | Why the lane matters to future-aware planning | Current carrier or surface | Decision and rationale | Required doctrine inputs | `4B` touch? | Failure mode if left untreated | Main overreach risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deliberations and decision anchors | They hold accepted architectural memory that later phases and audits depend on. If they become ambient prose, the repo re-litigates or silently ignores binding decisions. | Vision Alignment decision anchors already express downstream constraints in natural language; generic runtime support is still the broad `deliberation.md` template. | `governance/doctrine only for now` because the current gap is citation discipline, not missing runtime authority. The repo already has anchor-style artifacts that say what they constrain; Stage `4` should require consumption, not invent a second anchor schema. | `.planning/LONG-ARC.md`; `.planning/AGENTS.md`; `WORKFLOW.md` section `Decision Anchor Consumption`; `.planning/ARTIFACT-GOVERNANCE.md` rules for anchors and deliberations | `No` | Plans or audits may cite doctrine generally while skipping the specific accepted anchor that actually shaped the corridor. | Forcing plan-style `Future Awareness` buckets or `future_preservation` into every deliberation or creating a premature dedicated anchor template. |
| Audits and cross-model review requests | This is the one remaining Reflect lane that can certify planning-system or protected-seam changes. A doctrine-blind gate can approve locally correct work that still violates long-arc posture or ignores rewrite-trigger pressure. | `WORKFLOW.md` already requires formal audit preflight, but the live runtime lane is split between repo-local `audit/` and `reviews/` readmes and the generic `gsdr-audit` command, which does not currently load future-aware preflight inputs by default. | `application-worthy now` because there is still a behavior gap between the accepted doctrine rule and the live generic gate-dispatch surface. This is the narrowest remaining lane where Stage `4` can still add real leverage without widening into multiple policy systems. | `.planning/LONG-ARC.md`; `.planning/TECH-DEBT.md`; `.planning/STATE.md`; current `CONTEXT.md` and `PLAN.md` when a phase gate exists; relevant decision anchors named by the current work | `Yes` | High-stakes audits or review requests can remain manually correct only when the operator remembers doctrine/debt preflight, which is exactly the kind of drift this initiative is trying to remove. | Redesigning audit request or response formats, forcing casual reviews into full formal ceremony, or treating experimental cross-model dispatch as the enforcement mechanism itself. |
| Signals, knowledge-store, and reflection | This is the repo's durable memory loop for repeated drift, preservation misses, and workflow consequences. If future-aware failures never become durable signals, the self-correction loop never engages. | Project KB index and existing workflow-gap signals are live; `gsdr-signal` already persists manual signals; `reflect.md` already clusters patterns, triages signals, and writes remediation suggestions. | `governance/doctrine only for now` because the capture and reflection loop already exists. The immediate need is topic and destination discipline for future-aware drift, not a new schema or automation lane. | `WORKFLOW.md` section `Signals And Reflection`; `.planning/ARTIFACT-GOVERNANCE.md` governance-interface rules; `.planning/STATE.md` and `.planning/TECH-DEBT.md` only as downstream destinations, not new signal payload requirements | `No` | Future-aware misses stay buried in reviews or chat memory, so reflection does not route them into workflow, guardrail, or tech-debt follow-through. | Adding new mandatory signal frontmatter, new reflection doctrine outputs, or signal and reflection automation that the spec explicitly forbids in this stage. |
| Initiative, debrief, and carry-forward scaffolding | Strategic initiatives are already how this repo changes live planning doctrine, routing, and guardrails. If these lanes are weak, accepted lessons die in debrief folders and the harness does not improve. | Vision Alignment already has an `APPLICATION-LEDGER`, `CARRY-FORWARD-LEDGER`, and `CHANGES-BEFORE-NEXT-INITIATIVE`; the current initiative also already has dedicated `audit/` and `reviews/` workspaces. | `governance/doctrine only for now` because the repo already has a working destination-based ledger pattern for strategic initiatives. Stage `4` should preserve and cite that pattern, not widen into generic runtime support or mandatory scaffolding for ordinary work. | `WORKFLOW.md` section `Initiative Carry-Forward`; `.planning/ARTIFACT-GOVERNANCE.md` governance-interface rules; current initiative `README.md` and `PLAN.md` when strategic carry-forward exists | `No` | Strategic findings become historically legible but operationally inert; later initiatives repeat the same harness mistakes because accepted consequences never reach a destination. | Turning ordinary initiatives or phase work into mandatory ledger bureaucracy, or building a generic runtime scaffold before the pattern has proved it needs one. |
| Full schema symmetry across Reflect surfaces | This is the coherence guardrail for Stage `4`. Without it, every lane starts to demand its own cloned preservation schema and the initiative becomes governance bulk. | `.planning/AGENTS.md` and `.planning/ARTIFACT-GOVERNANCE.md` already reject symmetry; Stage `1`, `2`, and `3` reviews carried the same rejection forward. | `reject` because symmetry would recreate exactly the sprawl this initiative has worked to avoid. Stage `4` must preserve artifact-appropriate shapes and enforce at transmission and certification boundaries only. | `.planning/AGENTS.md`; `.planning/ARTIFACT-GOVERNANCE.md`; `synthesis/01-doctrine-and-governance-package.md`; `reviews/review-wave-1-mechanism-and-adaptation-decisions.md` | `No` | The harness accumulates duplicated truth, ritualized fields with no consumers, and maintenance weight that exceeds leverage. | Treating "consistency" as a reason to clone fields everywhere instead of asking whether the lane actually needs a behavior change. |

## 5. Candidate `4B` Subset

Stage `4` does not justify a broad application wave. The narrowest coherent `4B`, if Gate `4` still wants one, is:

- one formal-gate doctrine-preflight hardening wave

Exact lanes in scope:

- formal audits that can certify planning-system, roadmap, or protected-seam changes
- explicit review-gate request generation for the same high-stakes cases
- launch-time injection of required doctrine, debt, state, and anchor reads into those gate surfaces

Exact lanes out of scope:

- deliberation or decision-anchor artifact shape
- audit response shape
- ad hoc low-stakes reviews
- signals, knowledge-store schema, and reflection behavior
- initiative and debrief ledgers
- `verify-phase.md` and `validate-phase.md`
- any mutation of `.planning/STATE.md`, progress/resume, `.planning/TECH-DEBT.md`, Stage `2` doctrine files, or Stage `3` steering and routing overlays

Likely file or patch surfaces to inspect later:

- `$HOME/.codex/skills/gsdr-audit/SKILL.md`
- current `.planning/audits/` task-spec generation path, if the repo wants the preflight embedded in generated task specs rather than only in operator practice
- `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`
- equivalent future initiative `audit/` and `reviews/` workspace readmes, but only to align required-reading expectations

Why this still reads as one harness adaptation wave rather than a scattered governance patch:

- it hardens one certification boundary instead of touching every memory lane
- it consumes the already-accepted doctrine and routing shell rather than reopening it
- it does not invent a new artifact schema; it only makes formal gates read the sources they were already supposed to honor

Gate `4` fallback rule:

- if review decides that touching the live audit dispatch path is too global or too weakly justified, Stage `4` should end with doctrine/governance only rather than broadening `4B` into weaker lanes just to keep an application wave alive

## 6. Explicit Not-Now List

- no plan-style `Future Awareness` or `future_preservation` clone in deliberations or decision anchors
- no dedicated decision-anchor template or frontmatter system in this wave
- no audit request or response format redesign
- no cross-model dispatch reliability redesign as part of Stage `4`
- no signal schema expansion beyond disciplined use of existing tags, bodies, and remediation destinations
- no signal automation or reflection automation
- no reflection report promotion into canonical doctrine or debt sources
- no generic runtime support for initiative or debrief ledgers
- no mandatory carry-forward bureaucracy for ordinary initiatives or phase work
- no `verify-phase.md` or `validate-phase.md` redesign
- no new research-disposition system
- no reopening of `.planning/LONG-ARC.md`, `.planning/AGENTS.md`, `WORKFLOW.md`, `.planning/ARTIFACT-GOVERNANCE.md`, `.planning/STATE.md`, `.planning/TECH-DEBT.md`, or the Stage `3` overlay as part of Stage `4` policy work

## 7. Gate `4` Review Questions

1. Is the formal audit and review-gate lane the only remaining live surface that can still certify high-stakes change without guaranteed doctrine, debt, state, and anchor consumption?
2. For deliberations and anchors, signals and reflection, and initiative carry-forward, is the real remaining gap citation or destination discipline rather than a missing runtime behavior surface?
3. Does the proposed `4B` stay strictly inside launch-time gate preflight, without redesigning audit outputs or pulling in `verify-phase`, `validate-phase`, signal automation, or initiative template systems?
4. If `gsdr-audit` is touched, is the change limited to required-reading and preflight injection for high-stakes gates while leaving ad hoc audits flexible?
5. Does the proposed `4B` consume Stage `2` doctrine and Stage `3` routing outputs as accepted inputs rather than reopening those files or redefining their contracts?
6. What concrete repeated failure remains if `4B` is skipped, and is that failure more serious than the governance weight and blast radius added by the patch?
7. Does the candidate `4B` still read as one formal-gate doctrine-preflight wave rather than a bundle of unrelated adjustments from multiple subsystem lanes?
8. If the answer to any of the questions above is no, should Gate `4` decline application entirely and close Stage `4` at doctrine and governance level only?

## 8. Risks / Unresolved Edges

- The audit lane is split between repo-local initiative practices and the home-scoped `gsdr-audit` command. Gate `4` has to decide where the real enforcement point lives before any `4B` starts.
- Decision anchors currently express downstream constraints in prose rather than a small standardized block. The governance-only choice depends on planners and auditors actually citing them when relevant.
- The current KB and reflection loop can already capture future-aware drift, but if tagging and remediation routing stay inconsistent, the governance-only choice may prove too light later.
- Initiative ledgers work well for strategic initiatives because humans are already motivated to keep them accurate. That does not prove the pattern should expand beyond that scope.
- If a future `4B` touches only initiative-local readmes and not the live audit dispatch path, it may not close the real behavior gap. If it touches the live audit path, the blast radius extends beyond this repo's current tracked overlay.

Wave 4A complete.
- synthesis/06-gsdr-subsystem-adaptation-policy.md (166 lines)
