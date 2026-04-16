# Wave 1B Research: GSDR Subsystem Adaptation Inventory

## Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `1B`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-1B-research-gsdr-subsystem-adaptation-inventory.md`
- Output: `.planning/initiatives/future-aware-planning-harness-2026-04/research/02-gsdr-subsystem-adaptation-inventory.md`
- Scope: Reflect-specific subsystem consequences of adopting a future-aware planning harness on top of `f1-modeling`
- Comparison baseline: `prix-guesser` portable-GSD future-awareness patch and doctrine stack
- Note: repo-root `AGENTS.md` instructions were supplied in the task context; no on-disk `/home/rookslog/workspace/projects/f1-modeling/AGENTS.md` file was present at read time

## Executive Summary

The plain-GSD mechanisms from `prix-guesser` are only the first layer here. `f1-modeling` already relies on Reflect-only carriers that sit outside the normal `CONTEXT -> RESEARCH -> PLAN -> execute` loop: decision anchors, formal audits, signals and reflection, state/resume routing, initiative debrief ledgers, and a living tech-debt registry. If the harness patches only phase-planning artifacts, those other carriers will keep future-aware doctrine optional and drift will re-enter through side doors.

The immediate hard-enforcement lanes are narrower than "patch everything." The harness should enforce future-aware structure now in:

- phase steering artifacts and their downstream planner/checker path
- progress/resume/state routing
- tech-debt and rewrite-trigger governance
- formal audit preflight at high-stakes application or acceptance points

Other Reflect lanes need integration, but mostly as doctrine and governance rather than identical schema enforcement:

- deliberations and decision anchors
- signals, knowledge-store entries, and reflection outputs
- initiative/debrief carry-forward ledgers

The overreach to reject is full artifact symmetry. Deliberations, audits, debriefs, signals, and reflection reports should not all be forced into the same `Future Awareness` or `future_preservation` shape. The right pattern is bounded interface discipline: enforce future-aware transmission at consumption boundaries, not by turning every Reflect artifact into a plan artifact.

## Subsystem Inventory

| Subsystem | Why it matters in GSDR | Core future-aware question |
| --- | --- | --- |
| Phase steering artifacts (`CONTEXT`, `RESEARCH`, `PLAN`) | This is the normal planning chain and the place where plain-GSD mechanisms already proved leverage. | How do long-arc seams survive from doctrine into executable plans? |
| Phase verification and validation | Reflect splits planning-time checking, execution-time verification, and retroactive Nyquist validation. | Which future-aware obligations must be proven now versus only preserved for later? |
| Deliberations and decision anchors | `f1-modeling` uses deliberation and anchor artifacts as real architectural memory, not just notes. | How do accepted long-arc decisions remain load-bearing without duplicating plan schema? |
| Audits and cross-model review requests | Reflect has formal review/audit surfaces that can clear or block high-stakes changes. | Which audits must read doctrine and debt posture before they certify local correctness? |
| Signals, knowledge store, and reflection | Reflect turns observations into triaged signals and later planning inputs. | How do future-aware drift and preservation failures become durable, remediable observations? |
| Progress, resume, and state routing | Reflect's routing layer determines what the next session does by default. | How does future-aware posture survive session boundaries and avoid phase-local myopia? |
| Initiatives, debriefs, and carry-forward ledgers | `f1-modeling` already uses strategic initiatives that alter live planning files. | How do initiative findings become future harness changes instead of archived retrospectives? |
| Tech-debt and rewrite-trigger governance | This repo already has a live rewrite-trigger registry, but core GSDR does not know about it. | How are accepted transitional seams surfaced as planning-time obligations rather than prose reminders? |
| Cross-cutting symmetry policy | Reflect has many artifact types; indiscriminate patching would create governance bulk fast. | Where should future-aware enforcement stop? |

## Current Carrier Surface For Each Subsystem

| Subsystem | Current carrier in `f1-modeling` | Current carrier in active GSDR runtime |
| --- | --- | --- |
| Phase steering artifacts | `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-CONTEXT.md`; `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/04-CONTEXT.md`; `CLAUDE.md`; `.planning/ROADMAP.md`; `.planning/STATE.md` | `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md`; `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md`; `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md`; `$HOME/.codex/get-shit-done-reflect/templates/context.md`; `$HOME/.codex/get-shit-done-reflect/templates/research.md` |
| Phase verification and validation | phase `*-VERIFICATION.md` files; `CLAUDE.md` quality gates | `$HOME/.codex/get-shit-done-reflect/workflows/verify-phase.md`; `$HOME/.codex/get-shit-done-reflect/workflows/validate-phase.md` |
| Deliberations and decision anchors | `.planning/deliberations/`; `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`; `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`; `.planning/initiatives/vision-alignment-2026-04/debrief/PATTERNS-TO-KEEP.md` | `$HOME/.codex/get-shit-done-reflect/templates/deliberation.md` |
| Audits and cross-model review requests | `.planning/audits/`; `.planning/initiatives/vision-alignment-2026-04/audit/README.md`; `.planning/initiatives/future-aware-planning-harness-2026-04/audit/README.md`; `.planning/initiatives/future-aware-planning-harness-2026-04/reviews/README.md`; `CLAUDE.md` | `$HOME/.codex/skills/gsdr-audit/SKILL.md`; `$HOME/.codex/get-shit-done-reflect/workflows/validate-phase.md` |
| Signals, knowledge store, and reflection | `.planning/knowledge/index.md`; `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md`; `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-long-horizon-roadmap-and-tech-debt.md`; `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md` | `$HOME/.codex/skills/gsdr-signal/SKILL.md`; `$HOME/.codex/get-shit-done-reflect/workflows/reflect.md`; `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md` |
| Progress, resume, and state routing | `.planning/STATE.md`; `.planning/PROJECT.md` | `$HOME/.codex/get-shit-done-reflect/workflows/progress.md`; `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md`; `$HOME/.codex/get-shit-done-reflect/templates/state.md`; `$HOME/.codex/skills/gsdr-progress/SKILL.md`; `$HOME/.codex/skills/gsdr-resume-work/SKILL.md` |
| Initiatives, debriefs, and carry-forward ledgers | `.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md`; `.planning/initiatives/vision-alignment-2026-04/debrief/CARRY-FORWARD-LEDGER.md`; `.planning/initiatives/vision-alignment-2026-04/debrief/CHANGES-BEFORE-NEXT-INITIATIVE.md`; `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`; `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md` | No core runtime carrier; this is currently repo-local practice rather than built-in Reflect workflow behavior |
| Tech-debt and rewrite-trigger governance | `.planning/TECH-DEBT.md`; `CLAUDE.md`; `.planning/STATE.md`; `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-long-horizon-roadmap-and-tech-debt.md` | No dedicated runtime carrier; current GSDR workflows do not auto-load or route through a tech-debt registry |
| Cross-cutting symmetry policy | repo-local doctrine only; no dedicated file yet | No runtime carrier; this is a review-gate and governance decision |

## Adaptation Matrix

| subsystem | decision | current carrier in `f1-modeling` | current carrier in active GSDR runtime | recommended future-aware treatment | enforcement level | nearest patch surface | timing | failure mode if omitted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Phase steering artifacts (`CONTEXT` / `RESEARCH` / `PLAN`) | `borrow now` | phase contexts already carry ad hoc `Future Awareness`; `CLAUDE.md` requires it | discuss/research/plan workflows and context/research templates | Borrow the `prix-guesser` planning-chain mechanisms: durable doctrine file, normalized future-aware buckets, mandatory downstream reads, explicit reduced-guarantee no-context path, and structured `future_preservation` in plans. Adapt names to `f1-modeling` doctrine rather than copy wording. | `enforced` | repo-local harness overlay for discuss/research/plan/check plus `.planning/LONG-ARC.md` and `.planning/ARTIFACT-GOVERNANCE.md` | `now` | Phase plans stay locally coherent but drop long-arc seams, non-decisions, and rewrite pressures before execution starts. |
| Phase verification and validation | `later` | `*-VERIFICATION.md` and quality-gate expectations exist, but future-awareness is implicit | `verify-phase.md`; `validate-phase.md` | Keep immediate enforcement upstream in planner/checker. Later, add a light check that preserved seams or registry-trigger acknowledgements claimed in plans are actually evidenced. Do not create a second full future-awareness schema in verifier artifacts now. | `advisory` | plan-checker now; `verify-phase.md` and `validate-phase.md` later if gaps remain | `later` | Code can satisfy milestone-local success while leaving preserved seams or rewrite-trigger obligations unproven, but premature verifier patching would mostly duplicate plan-time checks. |
| Deliberations and decision anchors | `adapt now` | decision anchors and deliberations already carry accepted architecture that later phases depend on | deliberation template only; no automatic planner consumption | Add governance that decision anchors must name downstream constraints and carry-forward destinations, and require planning/audit artifacts to cite the relevant anchor when a phase or initiative depends on it. Do not force plan-style `Future Awareness` buckets into every deliberation. | `advisory` | repo-local decision-anchor conventions; `.planning/ARTIFACT-GOVERNANCE.md`; initiative specs | `now` | Accepted architecture remains stranded in deliberation prose; later planning re-litigates or silently ignores binding decisions. |
| Audits and cross-model review requests | `adapt now` | formal audit/readme split and review workspaces already exist; `CLAUDE.md` requires cross-model audit at phase completion | `gsdr-audit` skill; `validate-phase.md` for audit-like validation | Require high-stakes audits and review-gate requests to read long-arc doctrine, tech-debt posture, and relevant decision anchors before certifying outcomes. Keep ad hoc audits flexible. Do not rely on experimental cross-model dispatch as the future-aware mechanism. | `enforced` for formal gates, `advisory` otherwise | repo-local audit request templates plus `gsdr-audit` wrapper conventions | `now` | Formal reviews can approve locally correct artifacts that still violate long-horizon doctrine or ignore rewrite-trigger consequences. |
| Signals, knowledge store, and reflection | `adapt now` | workflow-gap and architecture-gap signals already exist; KB is live | `gsdr-signal` skill; `reflect.md`; `plan-phase.md` triaged-signal loading | Introduce future-aware drift and preservation-failure guidance as first-class signal topics, and let reflection cluster them into guardrail or workflow remediation suggestions. Keep planner consumption gated on triage. | `advisory` for capture, `enforced` once triaged | signal schema guidance; `reflect.md`; plan-phase signal interpretation; repo-local KB conventions | `now` | Future-aware misses stay trapped in audits or chat logs, so the planner never sees them as remediable context and the same drift recurs. |
| Progress, resume, and state routing | `adapt now` | `STATE.md` already tracks current phase, concerns, and Vision Alignment consequences | `progress.md`; `resume-project.md`; `state.md` template | Surface a compact future-aware digest in state/routing: active doctrine file(s), relevant tech-debt entries, current initiative carry-forward obligations, and any reduced-guarantee/no-context status. This is a routing problem, not just a documentation problem. | `enforced` | `templates/state.md`; `progress.md`; `resume-project.md`; repo-local state update rules | `now` | Each new session routes from the easiest local next step and quietly forgets long-arc doctrine, carry-forward obligations, or rewrite-trigger pressure. |
| Initiatives, debriefs, and carry-forward ledgers | `adapt now` | application ledger and carry-forward scaffolds already exist, but are initiative-local and only partly populated | no core runtime carrier | Keep this as governance, not broad runtime symmetry. Strategic initiatives should use destination-based carry-forward ledgers (`signal`, `guardrail`, `workflow`, `tech-debt`, `template`, `none`) plus application ledgers when live files change. Ordinary phases do not need this machinery. | `advisory` for ordinary initiatives, `enforced` for planning-system or roadmap-reset initiatives | initiative README/spec templates; `WORKFLOW.md`; `.planning/ARTIFACT-GOVERNANCE.md` | `now` | Strategic lessons die in debrief folders and the harness never improves even when an initiative clearly discovered a planning-system gap. |
| Tech-debt and rewrite-trigger governance | `adapt now` | `.planning/TECH-DEBT.md` is live and `CLAUDE.md` already says trigger updates belong in the same change set | no native tech-debt routing in core workflows | Make relevant tech-debt entries a normal planning input for touching phases, and require explicit plan disposition: trigger fired, debt retired, debt intentionally deferred, or not applicable. Surface relevant entries in progress/resume and formal audits. | `enforced` | discuss/plan/check prompts; progress/resume state digest; `.planning/LONG-ARC.md`; `.planning/ARTIFACT-GOVERNANCE.md` | `now` | Rewrite triggers remain background prose, transitional architecture lingers unchallenged, and future-aware planning stops exactly where it matters most. |
| Cross-cutting symmetry mandate ("make every Reflect artifact look like a plan artifact") | `reject` | no current carrier; this is an architectural temptation created by the initiative | all workflows/templates are patchable, which makes overreach easy | Reject full symmetry. Enforce future-awareness at transmission points and high-stakes interfaces, but let deliberations, audits, signals, debriefs, and reflection reports keep artifact-appropriate shapes. | `none` | review-gate doctrine; `.planning/ARTIFACT-GOVERNANCE.md` | `reject` | If this rejection is omitted, the harness becomes governance bulk: duplicated truth, ritualized fields without consumers, and higher maintenance than leverage. |

## Enforcement-vs-Advisory Recommendations

### Harness enforcement now

- Phase steering artifacts and planner/checker flow should be the strongest enforcement lane because this is where future-aware doctrine becomes executable work.
- Progress/resume/state routing should be enforced because Reflect's default routing behavior determines whether doctrine survives session boundaries.
- Tech-debt and rewrite-trigger governance should be enforced because rewrite triggers are only useful if they become planning-time obligations.
- Formal audits and application-readiness reviews should be enforced to read doctrine, debt, and relevant anchors before certifying changes.

### Governance or doctrine now

- Deliberations and decision anchors need a consumption rule, not a cloned plan schema.
- Signals and reflection need taxonomy and routing guidance so future-aware misses become durable observations without turning every signal into a strategic memo.
- Initiative/debrief carry-forward needs destination discipline and application ledgers, but only for strategic initiatives that change planning behavior or roadmap shape.

### Where forcing symmetry is overreach

- Do not require every deliberation to contain a `Future Awareness` block identical to phase context.
- Do not turn every audit into a fixed future-awareness checklist; audit orientation and subject still need room to matter.
- Do not make reflection reports or lesson candidates canonical doctrine carriers; they are analytical memory, not the source of truth.
- Do not require manual signal creation for every future-aware miss; capture and triage should stay selective.
- Do not patch every core GSDR workflow globally when repo-local governance and a bounded overlay cover the actual risk surfaces.

## GSDR-Specific Consequences Of Getting The Subsystem Wrong

- A plain-GSD patch can harden phase planning while Reflect-side routing still leaks future-aware doctrine through `progress`, `resume`, and `STATE`.
- Decision anchors can become architecturally binding in practice even though the core phase workflows do not automatically read them; leaving that interface ambient means the harness hardens the wrong memory layer.
- Formal audits can authorize live planning/governance changes. If audit requests are doctrine-blind, the repo gains false confidence rather than independent scrutiny.
- Signals only affect planning after triage and planner loading. If future-aware drift never enters that path, Reflect's self-correction loop simply does not engage.
- The initiative/debrief/application ledger pattern is already how `f1-modeling` changed live planning files in April 2026. Ignoring that lane would repeat the exact "documents changed, but the harness did not learn" problem this initiative exists to solve.
- The tech-debt registry is not generic backlog. It encodes rewrite triggers and accepted bridge architecture. If planning does not read it, future-aware governance fails exactly at the moment of architectural commitment.
- `validate-phase` is about Nyquist coverage, not strategic direction. Forcing full future-aware symmetry there would create compliance theater rather than leverage.

## Interactions Between Subsystems

- Doctrine and anchors feed phase steering. A future-aware `LONG-ARC` layer or decision anchor only matters if `discuss-phase` and `plan-phase` actually load it through canonical refs and planner/checker prompts.
- Audits, signals, and tech debt form one loop. Audit findings should become either signals, tech-debt entries, or explicit rejections; otherwise they die as standalone review prose.
- Reflection only matters because planning consumes triaged signals. If the future-aware harness strengthens signal taxonomy but not plan-phase signal use, the loop still breaks.
- Progress/resume/state routing is the persistence layer for everything else. It is where doctrine, debt, and carry-forward items re-enter the active session.
- Initiative carry-forward is how governance evolves. The future-aware harness itself is a planning-system initiative, so its debrief destination rules are part of the product, not just project management.
- Verification and validation should stay downstream consumers, not second doctrine sources. Their job is to prove or challenge claims made upstream, not to invent a parallel strategy memory layer.

## Immediate Versus Deferred Subsystem Changes

### Immediate (`now`)

- Add the future-aware doctrine stack and artifact-governance layer that phase steering can cite directly.
- Patch the steering chain so future-aware structure is normalized and carried into plan/check outputs.
- Surface doctrine, debt, and carry-forward posture in `STATE`, `progress`, and `resume`.
- Add formal audit required-reading rules for doctrine, debt, and relevant decision anchors.
- Define future-aware drift as a recognizable signal/reflection topic.
- Require explicit tech-debt disposition in plans that touch registered seams.

### Deferred (`later`)

- Extend `verify-phase` and `validate-phase` only after the steering-chain enforcement has proven insufficient.
- Add automated signal synthesis or stronger reflection heuristics for future-aware drift only if manual and review-gate capture proves too sparse.
- Build dedicated tech-debt CRUD commands only if manual registry management becomes the actual bottleneck.
- Generalize initiative carry-forward scaffolding into reusable workflow support only after one or two more strategic initiatives confirm the pattern.

### Rejected

- Full schema symmetry across deliberations, audits, debriefs, reflection reports, and signals.
- Treating reflection reports as canonical doctrine or debt sources.
- Treating experimental cross-model dispatch as the main way to enforce future-aware audit behavior.

## Risks Of Over-Patching Versus Under-Patching

| Risk type | What it looks like here | Consequence |
| --- | --- | --- |
| Over-patching | Every Reflect artifact gets a copied `Future Awareness` block or new mandatory frontmatter | High maintenance, duplicated truth, easy ceremonial compliance, lower signal quality |
| Over-patching | Future-aware governance moves into global GSDR instead of repo-local doctrine and overlay surfaces | Wider blast radius, harder upgrades, weaker repo-specific fit |
| Over-patching | Verification, validation, audit, and reflection all become second planners | Too many competing carriers; no clear source of truth |
| Under-patching | Only `CONTEXT`/`PLAN` are patched and Reflect-side routing stays unchanged | Future-aware doctrine still gets dropped between sessions and review cycles |
| Under-patching | Decision anchors, audits, signals, and debriefs stay ambient | Strategic corrections remain one-off initiative memory instead of durable harness behavior |
| Under-patching | TECH-DEBT remains a living document in name only | Rewrite triggers fire late or not at all, and bridge architecture calcifies |

## Unresolved Questions

- Should `.planning/LONG-ARC.md` become the single durable doctrine file, or should `VISION.md` and `PROJECT.md` keep part of that load-bearing role?
- What is the minimum future-aware digest that `STATE`, `progress`, and `resume` should show before the file/report becomes too noisy to use?
- Which formal audit classes should be required to read doctrine and tech debt by default: all high-stakes audits, only application/acceptance audits, or also milestone audits?
- Should decision anchors get a repo-local template distinct from the generic deliberation template, or is a doctrine rule plus canonical-ref discipline enough?
- Should future-aware drift use a dedicated signal taxonomy, or is consistent tagging and remediation guidance sufficient?
- When should missing tech-debt disposition become a hard checker failure versus a warning?
- Should initiative carry-forward ledgers be mandatory only for planning-system and roadmap-reset initiatives, or for any initiative that changes live planning files?

## References With Concrete File Paths

### Initiative and repo planning artifacts

- `.planning/initiatives/future-aware-planning-harness-2026-04/README.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/RESEARCH-PRINCIPLES.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-1B-research-gsdr-subsystem-adaptation-inventory.md`
- `.planning/VISION.md`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/TECH-DEBT.md`
- `CLAUDE.md`

### Vision Alignment initiative carriers

- `.planning/initiatives/vision-alignment-2026-04/README.md`
- `.planning/initiatives/vision-alignment-2026-04/SUMMARY.md`
- `.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md`
- `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
- `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`
- `.planning/initiatives/vision-alignment-2026-04/audit/README.md`
- `.planning/initiatives/vision-alignment-2026-04/debrief/PATTERNS-TO-KEEP.md`
- `.planning/initiatives/vision-alignment-2026-04/debrief/CARRY-FORWARD-LEDGER.md`
- `.planning/initiatives/vision-alignment-2026-04/debrief/CHANGES-BEFORE-NEXT-INITIATIVE.md`

### Knowledge-store and signal carriers

- `.planning/knowledge/index.md`
- `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-vision-alignment-guardrails.md`
- `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-long-horizon-roadmap-and-tech-debt.md`
- `.planning/knowledge/signals/f1-modeling/2026-04-11-d2-underspecified-interface-types.md`

### Active GSDR runtime surfaces

- `/home/rookslog/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/research-phase.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/plan-phase.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/progress.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/resume-project.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/signal.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/reflect.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/verify-phase.md`
- `/home/rookslog/.codex/get-shit-done-reflect/workflows/validate-phase.md`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/context.md`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/research.md`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/deliberation.md`
- `/home/rookslog/.codex/get-shit-done-reflect/templates/state.md`

### Material skill surfaces

- `/home/rookslog/.codex/skills/gsdr-discuss-phase/SKILL.md`
- `/home/rookslog/.codex/skills/gsdr-plan-phase/SKILL.md`
- `/home/rookslog/.codex/skills/gsdr-progress/SKILL.md`
- `/home/rookslog/.codex/skills/gsdr-resume-work/SKILL.md`
- `/home/rookslog/.codex/skills/gsdr-signal/SKILL.md`
- `/home/rookslog/.codex/skills/gsdr-audit/SKILL.md`

### Plain-GSD comparison sources

- `/home/rookslog/workspace/projects/prix-guesser/.planning/LONG-ARC.md`
- `/home/rookslog/workspace/projects/prix-guesser/.planning/deliberations/2026-04-10-future-awareness-harness-patch.md`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/discuss-phase.md`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/workflows/plan-phase.md`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/context.md`
- `/home/rookslog/workspace/projects/prix-guesser/tooling/portable-gsd/overlay/get-shit-done/templates/research.md`
