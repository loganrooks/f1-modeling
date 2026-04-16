# Wave 5A Synthesis: Stage 5 Enforcement Reassessment

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `5A`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-5A-synthesis-enforcement-reassessment.md`
- Output: `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/08-stage-5-enforcement-reassessment.md`
- Status: proposed
- Stage `3` posture consumed: accepted after Wave `3B`, Wave `3C`, and the `3C` recheck
- Stage `4` posture consumed: accepted after Wave `4A`, Gate `4`, and Wave `4B`
- Reassessment result: no residual lane currently earns `worth application now`; recommended default is to close Stage `5` without a `5B` and route to Stage `6`

## 2. Inputs Consumed

- Initiative framing and execution map:
  - `README.md`
  - `PLAN.md`
  - `RESEARCH-PRINCIPLES.md`
  - `SPEC-INDEX.md`
  - `specs/spec-wave-5-review-gate-enforcement-decisions.md`
- Stage `3` synthesis and review chain:
  - `synthesis/03-harness-patch-plan.md`
  - `reviews/review-wave-3-harness-patch-decisions.md`
  - `reviews/review-wave-3B-core-harness-patch.md`
  - `reviews/review-wave-3C-routing-digest-patch.md`
  - `reviews/recheck-wave-3C-routing-digest-patch.md`
- Stage `4` synthesis and review chain:
  - `synthesis/06-gsdr-subsystem-adaptation-policy.md`
  - `reviews/review-wave-4-gsdr-subsystem-adaptation-decisions.md`
  - `synthesis/07-formal-gate-preflight-application.md`
  - `reviews/review-wave-4B-formal-gate-preflight-package.md`
- Live doctrine and governance shell:
  - `.planning/LONG-ARC.md`
  - `.planning/AGENTS.md`
  - `WORKFLOW.md`
  - `.planning/ARTIFACT-GOVERNANCE.md`
  - `.planning/STATE.md`
  - `.planning/TECH-DEBT.md`
- Live landed enforcement-relevant surfaces:
  - `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/plan-phase.md`
  - `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/phase-prompt.md`
  - `.planning/audits/README.md`
  - `.planning/audits/templates/audit-request-template.md`
  - `.planning/audits/templates/audit-response-template.md`
  - `.planning/reviews/README.md`

## 3. Stage 5 Framing

Stage `5` is a reassessment stage, not a standing permission slip to add more enforcement because earlier planning named an enforcement workstream. The accepted Stage `3` and Stage `4` outputs already changed real behavior in the two places that mattered most:

- phase planning now has actual planner/checker enforcement for `future_preservation`, `tech_debt_disposition`, canonical-ref propagation, and explicit reduced-guarantee handling
- formal-gate work now has a shared repo-level audit package that distinguishes certification from advisory review and forces explicit preflight when the templates are used

The remaining question is narrower: is there still one concrete pre-`3.2` gap whose leverage is high enough to justify another application wave before the proving ground produces evidence?

Evaluation rule for this reassessment:

- prefer landed behavior over plan intent
- treat calibration gaps differently from missing-surface gaps
- require a concrete repeated failure or a clearly unsafe certification hole before recommending `5B`
- reject any candidate that only adds governance weight, duplicate launch paths, or global-skill blast radius without new evidence

Result of this pass: no candidate lane currently clears the bar for `worth application now`.

## 4. Residual Enforcement Matrix

| Lane | Current landed posture | Residual gap | Classification | Rationale | Risk of doing more now | Risk of deferring until after `3.2` |
| --- | --- | --- | --- | --- | --- | --- |
| Planner/checker enforcement around `future_preservation` and `tech_debt_disposition` | The Stage `3` `plan-phase` overlay now requires context by default, resolves canonical refs, loads `.planning/TECH-DEBT.md` plus active debt ids, requires `planning_posture`, `future_preservation`, and `tech_debt_disposition`, and makes the checker fail missing or generic preservation or debt handling. The phase-prompt template also encodes those fields directly. | The remaining uncertainty is not missing enforcement. It is calibration: how noisy or sharp the new checks feel on the first real `3.2` package. Execute-time verification was explicitly deferred and is still out of scope here. | `already landed / sufficient` | This lane already has real workflow enforcement, not just prose. What is missing now is proving-ground evidence about fit, not another new rule surface. | Extra checker or prompt rules now would likely harden speculative edge cases, add ceremony, and start leaking Stage `5` into `verify-phase` or `validate-phase` work that the initiative already deferred. | Low. The current harness is strong enough to expose dropped seams or debt omissions during `3.2` planning. The proving ground is the intended place to learn whether the thresholds need tuning. |
| Reduced-guarantee handling after the routing patch | The landed flow now blocks no-context planning unless `--allow-no-context` is passed, records `planning_posture.context_mode: reduced_guarantee_no_context`, surfaces the caution in routing/state flows, and `WORKFLOW.md` tells formal audits to treat reduced-guarantee planning as a caution flag rather than normal mode. | The remaining gap is only that this is still a visible caution path rather than a broader policy engine. There is no evidence yet that a stronger exception system is needed. | `already landed / sufficient` | Silent bypass is already removed. The repo now has an explicit override path, a visible state surface, and a formal-gate caution rule. That is enough to test in `3.2`. | More work now would likely create unnecessary exception bureaucracy, persistent toggles, or heavier routing machinery without proving the existing caution path is inadequate. | Low. The `3.2` proving ground can verify whether the reduced-guarantee signal is actually visible and actionable in real planning flow. |
| Launch-truth capture for high-stakes work | Planner and checker launches already receive a real bundle of context, canonical refs, doctrine, and debt data through the Stage `3` overlay. The shared audit package defines what a truthful high-stakes request and response must record when the repo templates are used. | There is still no repo-tracked launch surface that guarantees every high-stakes audit or review request is born from that preflight bundle or records exactly what the spawned worker actually saw at launch time. | `defer until after 3.2` | This is a real residual idea, but it is not yet a proven pre-`3.2` blocker. The unresolved design question is where the right launch-truth hook lives: repo-level scaffold, repo-level wrapper, later global skill patch, or nowhere if the current template-started path proves sufficient. | Patching now risks inventing a second entrypoint, choosing the wrong enforcement point, or widening prematurely into home-level `gsdr-audit` work before the proving ground shows whether the current package actually leaks. | Moderate but acceptable for one cycle. The first `3.2` gate will still rely on operator discipline to start from the shared template, so artifact truth may remain slightly uneven if the process is used carelessly. |
| Formal-gate enforcement after the shared audit package | `.planning/audits/README.md`, the request/response templates, and `.planning/reviews/README.md` now define the repo's formal-gate boundary, required preflight reads, expected response shape, and advisory-review boundary. Initiative-local workspaces were re-pointed to this shared package in `4B`. | The boundary is still enforced by workspace discipline rather than dispatch behavior. Advisory reviews can still be socially misused, and formal audits still depend on someone actually starting from the shared template. | `defer until after 3.2` | The package is already strong enough to run one proving-ground gate honestly. The missing enforcement is real, but it is still unproven whether it deserves a dedicated launch patch before the repo has exercised the shared package on a live `3.2` planning gate. | Doing more now would likely create governance bulk, duplicate gate workflows, or pressure to patch global tooling even though the repo has not yet shown the template-based package failing in practice. | Moderate but acceptable. A sloppy `3.2` gate could require a rerun through the formal package, but that is still cheaper than preemptively hardening the wrong enforcement surface. |
| Stage `5` widening into `verify-phase`, `validate-phase`, signal automation, or global skill patching | These expansions were explicitly deferred or rejected in the Stage `3` and Stage `4` chain, and nothing in the landed evidence changes that. | No concrete residual gap was found here that is worth solving before `3.2`. | `reject` | This is governance bulk, not residual leverage. It would reopen accepted scope boundaries without new evidence. | Very high. It would delay the proving ground, increase blast radius, and blur the initiative's artifact and subsystem boundaries. | None worth acting on now. These are intentional later questions or explicit non-goals for this stage. |

Net result:

- `already landed / sufficient`: planner/checker enforcement; reduced-guarantee handling
- `defer until after 3.2`: launch-truth capture for high-stakes work; formal-gate dispatch enforcement
- `reject`: widening Stage `5` into additional subsystem or verifier lanes
- `worth application now`: none

## 5. Candidate `5B` Subset Or Close-Stage Recommendation

### Recommended outcome

Do not launch `5B` by default.

Close Stage `5` without an application wave and route to Stage `6`, where the upgraded harness is exercised on the real `3.2` planning package and its associated gate work.

### Why no `5B` is justified yet

- The strongest Stage `5` candidates are no longer missing surfaces; they are unproven launch-discipline gaps.
- The current repo can already run the `3.2` proving ground honestly using the landed Stage `3` planner/checker path and the shared Stage `4` audit package.
- The main missing evidence is empirical:
  - whether checker strictness is appropriately calibrated on a real architecture-setting phase
  - whether reduced-guarantee visibility actually changes operator behavior
  - whether the shared audit package is enough in practice or whether operators keep leaking back into freeform review habits

That evidence is exactly what Stage `6` is supposed to generate.

### Only plausible future `5B`, if Gate `5` refuses to close Stage `5`

If Gate `5` still insists that one pre-`3.2` patch is necessary, the narrowest coherent subset is:

- a repo-tracked high-stakes formal-gate launch scaffold
- limited to generating or enforcing audit-request preflight from the shared `.planning/audits/` package
- explicitly not a global `gsdr-audit` rewrite
- explicitly not a planner/checker schema expansion

Likely surfaces for that later subset:

- `.planning/audits/README.md`
- `.planning/audits/templates/audit-request-template.md`
- a new repo-local audit-request bootstrap surface, if and only if Gate `5` decides one is needed

That should remain a contingent fallback, not the default recommendation.

## 6. Explicit Not-Now List

- no `verify-phase.md` or `validate-phase.md` future-aware uplift
- no global `gsdr-audit` skill patch
- no repo-wide wrapper proliferation across advisory review and audit surfaces
- no signal or reflection automation
- no `quick.md` or other generic skill patching before the `3.2` proving ground produces evidence
- no extra planner/checker schema beyond the landed `planning_posture`, `future_preservation`, and `tech_debt_disposition`
- no new reduced-guarantee policy engine, persistent bypass toggle, or exception registry
- no cloned future-awareness schema inside audits, reviews, anchors, or initiative ledgers
- no attempt to turn the `3.2` proving-ground application itself into a disguised Stage `5` enforcement wave

## 7. Gate `5` Review Questions

1. For planner/checker enforcement, is there any concrete failure still visible before `3.2`, or is the remaining need only calibration through real use?
2. Does any accepted planning entry path still permit silent no-context planning, or is reduced-guarantee mode already explicit enough to test in the proving ground?
3. For formal gates, do we have concrete evidence that template-started audit preflight is insufficient before one live `3.2` cycle, or is the missing launch-truth still hypothetical?
4. If a `5B` is proposed, can it stay narrower than a global skill patch and target exactly one repo-tracked formal-gate launch surface?
5. What evidence about checker noise, debt-disposition burden, reduced-guarantee visibility, and audit-start discipline can only be learned by running the `3.2` proving ground?
6. Would the proposed `5B` strengthen behavior more than it adds ceremony for legitimate exceptions and one-off high-stakes cases?
7. Absent new concrete failure evidence, should Stage `5` close without application and route directly to Stage `6`?

## 8. Risks / Unresolved Edges

- The `3.2` proving ground may show that the new planner/checker rules are either too strict or too permissive in ways that were impossible to calibrate from synthesis alone.
- Formal-gate discipline still relies on humans starting from the shared repo templates until or unless a later launch surface is introduced.
- The repo has not yet measured whether the reduced-guarantee caution is actually visible enough in practice to change operator behavior.
- If a future launch-truth patch becomes necessary, the correct enforcement point is still unresolved: repo-local scaffold, repo-local wrapper, later global skill patch, or continued template discipline.
- Historical audits and reviews remain uneven because the shared package is new and older artifacts do not inherit its fields retroactively.

Wave 5A complete.
- synthesis/08-stage-5-enforcement-reassessment.md (151 lines)
