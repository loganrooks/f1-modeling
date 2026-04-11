# 05 Long-Horizon Roadmap Synthesis

## Metadata

- Date: 2026-04-11
- Mode: Deliberation
- Reasoning effort: xhigh
- Inputs consumed:
  - `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`
- Supporting reads for grounding:
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/02-visualization-architecture.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/03-educational-content-architecture.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/04-regulation-semantic-model.md`

## Question

Close D4: what roadmap shape follows from the accepted D1/D2/D3/D5 architecture work, what must happen before Phase 4 planning can honestly resume, how the remaining v1 milestone path should be reshaped, and how far the roadmap should project into v2 / v3 / v4+ without pretending to know implementation-plan detail that belongs to Stage 3.

The question is not "how should the current roadmap labels be tidied?" It is whether the roadmap still tells the truth after the architecture decisions. If the roadmap remains structurally unchanged, then async compute, typed artifacts, shared interaction state, educational content architecture, and regulation canonicalization will have been accepted as architecture but ignored as sequencing.

## Stakes

- If D4 stays vague, Phase 4 planning will resume against the wrong substrate: synchronous execution, a fixed three-zone shell, no first-class lesson graph, and raw regulation semantics still leaking through casts and hardcoded defaults.
- If D4 over-corrects, it can pull too much long-horizon ambition into pre-Phase-4 work and stall the project in foundation churn.
- `VISION.md` explicitly commits to a serious engineering-and-education platform, not a feature pile. D4 is where that commitment either becomes dependency logic or stays rhetorical.
- The accepted D2 and D3 honesty constraints are roadmap commitments. If they disappear into "later polish," the project will ship visually polished but architecturally dishonest surfaces.
- Finding #15 and D1 together mean computational-backend evolution is now an explicit roadmap thread. If D4 leaves it unprojected, Phase 5 and Phase 7 will hit predictable numerical limits with no acknowledged migration path.
- D5 makes Phase 8 impossible to treat as a generic "design exploration" bucket. Regulation family identity, canonicalization, and comparability now have real sequencing cost.

## Option Space

- **Option 1: Resume the current roadmap with only plan-level edits.** This would keep Phase 4 as the next planning target and treat D1-D5 as context for those plans. This is no longer credible. It preserves the label structure at the cost of hiding accepted architectural work.
- **Option 2: Fold all new foundation work into a larger Phase 4 or "Phase 4 foundation wave."** This would acknowledge the gaps, but it would still hide distinct closure criteria inside one label. It recreates the audit's label-trap at roadmap scale.
- **Option 3: Insert explicit pre-Phase-4 foundation work, then narrow Phase 4 to strategy workbench delivery.** This is the strongest candidate because it turns accepted architecture into sequencing and keeps Phase 4 from becoming a disguised infrastructure rewrite.
- **Option 4: Pull the reality-contact corridor forward and move data import / calibration ahead of observer and control.** This improves fidelity honesty sooner, but it conflicts with the accepted choice to keep full data import and calibration later while using visible honesty labeling earlier.
- **Option 5: Stop projection at v1 and leave v2/v3/v4+ as vague milestone labels.** This is methodologically safer than fabricated detail, but it fails the audit-response question "where does the platform come into its own?" and leaves the scientific-compute and multi-regulation trajectories structurally unowned.

The viable center is Option 3 plus a bounded version of Option 5: make real sequencing commitments through v1, then project v2 / v3 / v4+ thematically by dependency rather than by implementation-plan detail.

## Tradeoffs

### Near-term execution vs roadmap honesty

- Separate insertions slow the visible march toward Phase 4 features, but they prevent the larger slowdown of planning Phase 4 against the wrong substrate and then rewriting it mid-phase.
- A monolithic Phase 4 foundation wave looks simpler on paper, but it would blur compute, visualization, educational, and semantic obligations that have different acceptance criteria and different downstream consumers.

### 1-year horizon

- The next honest year of work is about turning the accepted contracts into working product substrate: jobs and artifacts, workspace shell and interaction substrate, lesson graph and preview/validation, and regulation canonicalization good enough that Phase 4 stops inferring meaning from raw preset maps.
- The cost is that some feature desires remain deferred. This is acceptable because D4's job is to separate blockers from aspirations, not to maximize immediate feature count.

### 3-year horizon

- A substrate-first reshaping keeps multiple compute backends, multiple renderer families, and multiple regulation families viable without forcing those migrations immediately.
- The main risk is overinvesting in abstract infrastructure before enough product value exists. The mitigation is that every insertion must terminate in direct Phase 4/4.1/5 consumers, not in generic platform work.

### 5-year horizon

- If the roadmap keeps compute, comparison semantics, and education first-class now, later milestones can become a calibrated comparative engineering platform rather than a pile of additional panels.
- If the roadmap stays feature-labeled and substrate-agnostic, the platform will accumulate local wins but remain trapped in v1-shaped assumptions.

### Sequencing tradeoff: observer/control before full data/calibration

- Keeping Phase 4.1 and Phase 5 ahead of Phases 6-7 preserves the project's explicit learning-path architecture: plant -> sensor model -> observer -> control -> later alignment and calibration.
- The downside is that observer and control work will still be partly simulator-internal when they first ship. The mitigation must therefore be visible fidelity and validation labeling from the earlier foundation waves onward, not only in Phase 7.

### Sequencing tradeoff: regulation semantics now vs historical breadth later

- Minimal canonicalization and comparability groundwork must arrive before Phase 4 because raw preset maps and hardcoded 2026 semantics are already a current architecture bug.
- Full historical family expansion should not arrive before Phase 4. It belongs later, once the canonical semantic pipeline exists and there is something real to compare across families.

## Gray Areas Still Unresolved

### [FOLLOW-AND-MARK] Exact split between educational foundation and regulation semantic groundwork before Phase 4

- Why load-bearing: D3 says learning architecture is not optional garnish, while D5 says semantic canonicalization cannot remain postponed to Phase 8.
- Response here: close the need for explicit pre-Phase-4 groundwork, but not the exact phase-number packaging. Stage 3A should choose whether this is one insertion or two adjacent decimal phases once it writes the actual roadmap diff.
- Constraint preserved: educational schema/preview/validation and minimal regulation canonicalization/comparability groundwork must both exist before Phase 4 planning restarts.

### [REVISIT-LATER] Exact numbering and whether Phase 5 becomes a formal `5.1`

- Why load-bearing: D4 can close structural honesty without pretending to know the final decimal numbering or whether control work needs a formal split.
- Why not closed here: numbering is Stage 3A work, and the control split depends partly on how aggressive the first optimizer-backed baseline is.
- Future closure criterion: Stage 3A should pick the smallest numbering scheme that makes the dependencies visible without inventing false precision.

### [REVISIT-LATER] Exact compute-language cutover beyond D1's first local worker implementation

- Why load-bearing: v2 and later numerical seriousness depend on when TypeScript stops being enough for observer, optimization, and calibration workloads.
- Why not closed here: R1 and R1.5 intentionally left the trigger empirical rather than ideological.
- Future closure criterion: revisit when Phase 4.1 Jacobians, Phase 5 solver needs, or Phase 7 calibration loops exceed the accepted batch, latency, or authoring-workflow thresholds.

### [DEFER] Benchmark/reference-competitor layer and richer multi-car competition semantics

- Why deferred: the audit correctly identified the gap, but v1 already has STRA-08 as a low-fidelity substitute and enough major substrate work is now acknowledged.
- Recommended pickup: v2 planning, once the first honest single-family strategy loop is complete and the project can distinguish isolated optimization from reference-aware engineering comparison with evidence instead of speculation.

### [DEFER] Collaboration, multi-user workflows, and live race-weekend operations

- Why deferred: `PROJECT.md` still keeps multi-user scope out of the first release, and the current local-first vision does not require D4 to make that operational jump now.
- Recommended pickup: v4+ projection and later milestone audits, once remote/cloud compute and calibrated reference workflows are real rather than aspirational.

## Closure Analysis

D4 is ready to close the roadmap shape at the level that matters now, but not at the level of final roadmap text. The evidence is strong enough to close five points.

First, the current roadmap cannot honestly resume at Phase 4 with only note-level edits. D1-D5 created real dependency work between Phase 3.1 and the current Phase 4 boundary.

Second, the current Phase 4 is structurally mis-cut. It mixes strategy workbench delivery with substrate obligations that should already exist before its plans are written.

Third, the remaining v1 milestone path should optimize for an honest single-family engineering-and-education loop, not for maximum breadth of new domains. That means first-class contracts, visible fidelity states, and bounded semantic foundations before historical breadth.

Fourth, the roadmap should project beyond v1 only thematically. D4 can honestly name the next major dependency arcs, but not detailed v2/v3/v4 phase plans.

Fifth, D4 can close deferrals and rewrite triggers clearly enough that Stage 3 has a concrete handoff instead of a vague "update the roadmap later."

What D4 is not ready to close is exact numbering, exact wording of future milestone names, exact control-phase split packaging, exact benchmark numbers, or the final compute-language cutover. Those belong to Stage 3A or later milestone audits. The right commitment level is therefore a **provisional recommendation with several closed scope dispositions inside it**.

## Outcome

D4 closes as a **provisional recommendation**: insert explicit pre-Phase-4 foundation work, narrow Phase 4 to strategy workbench delivery, keep the observer -> control -> data alignment -> calibration sequence broadly intact but make its dependencies more honest, and project v2 / v3 / v4+ thematically around compute depth, semantic breadth, calibration depth, and eventual operational/product expansion.

### D4.A: Pre-Phase-4 gate and foundation insertions

Phase 4 planning should **not** resume directly from Phase 3.1. New roadmap insertions are required. The accepted architecture implies real foundation work between current Phase 3.1 and current Phase 4, and that work is distinct enough that it should not be hidden inside a renamed Phase 4.

The honest shape is **separate insertions**, even if Stage 3 later chooses different decimal labels or naming:

- **Insertion 1: backend execution, job/event, artifact/provenance, and regulation execution-flow foundation.** This is D1 follow-through plus the D5 execution handshake: `SimulationBackend`, typed job protocol, partial artifact delivery, replay window, run-service separation, local worker implementation, and removal of 2026-specific regulation assumptions from the execution path.
- **Insertion 2: visualization substrate, workspace shell, and performance foundation.** This is D2 follow-through: renderer-agnostic view surface, shared interaction state, anchor and recipe plumbing, recipe-driven shell, token layer, accessibility and thin-client commitments, and the benchmark harness needed to enforce the accepted performance envelope.
- **Insertion 3: educational content and semantic groundwork.** This is the minimum D3/D5 pre-Phase-4 foundation: `LessonUnit` graph and body adapter boundary, preview and validation tooling, initial role/path fixtures, and the first regulation canonicalization/comparability/applicability inventory needed so lessons and comparison surfaces stop inferring semantics ad hoc.

These should be **separate insertions rather than one folded Phase 4 foundation wave** because they have different closure criteria and different dependency edges. D1/D5 execution-flow work unblocks D2 and D3. D2 shell and anchor work unblocks D3's binding model. D3 and D5 semantic groundwork then feed a narrowed, honest Phase 4. The exact decimal numbering is deferred; the existence of explicit insertions is not.

### D4.B: Remaining v1 milestone reshaping

The current roadmap phases 4, 4.1, 5, 6, 7, and 8 do **not** all have the right boundaries after D1-D5.

- **Phase 4** is currently too broad and too shallow. After the insertions above, it should narrow to a strategy workbench and session-workflow phase: multi-strategy race analysis, qualifying and sprint modes, in-race interventions, explanation surfaces, and initial engineer-role lesson delivery built on the already-landed substrate. It should no longer carry shell creation, artifact-contract invention, or content-schema invention.
- **Phase 4.1** should remain immediately after Phase 4, but its real identity is broader than "EKF later." It is the observer and time-indexed replay workbench that consumes D1 checkpointed artifacts, D2 linked temporal interaction, and D3 guided overlays. Keeping it before control still matches the project's plant -> sensing -> estimation -> control learning path.
- **Phase 5** is structurally too broad as written. Driver-style parameterization, control-ready plant seams, optimizer-backed control baselines, and trajectory/racing-line outputs should not hide behind one undifferentiated label. Stage 3A should either split Phase 5 into a driver-policy/control-foundation phase plus a follow-on optimization-backed control phase, or make that split explicit inside the phase boundary.
- **Phases 6 and 7** should remain ordered as the reality-contact corridor: import and alignment first, then calibration and validation workbench. D4 does **not** recommend pulling them wholesale earlier. The accepted mitigation is instead that fidelity, provenance, and performance guardrails start earlier, while full reference-data alignment and calibration stay where they can consume a more mature strategy/observer/control stack.
- **Phase 8** is too broad for the end of v1 if it still implies full multi-era expansion. In v1 it should narrow to the first regulation/design exploration wave on top of the canonical semantic model and the calibrated single-family loop. Full historical family expansion, larger comparability registries, and deeper regulation-lab breadth belong to v2.

The remaining v1 milestone path should therefore optimize for **an honest, inspectable, single-family engineering-and-education loop**: strategy workbench, observer/replay, control foundations, reference-data alignment, calibration, and a first semantically grounded regulation/design exploration wave. Education becomes a continuous thread through these phases, not a one-phase garnish. Validation becomes a dedicated phase later, but its honesty obligations begin much earlier.

### D4.C: v2 / v3 / v4+ projection

D4 should project **through v4+ thematically**, but not with v1-style plan detail. That is enough to answer the forward-projection question honestly without pretending to know future phase plans.

- **v2** should be the **numerical and semantic deepening milestone**. This is where the scientific-compute migration story becomes an explicit delivery theme rather than only a tech-debt warning. It should include the first serious compute escalation beyond D1's bridge implementation if the empirical triggers fire, broader historical regulation-family expansion, richer comparability registries, denser reference-data and benchmark layers, and the first stronger reference-competitor abstractions beyond v1's low-fidelity traffic model.
- **v3** should be the **calibrated comparative engineering lab milestone**. This is where the platform most clearly "comes into its own." By this point the same substrate should support calibrated model-vs-reference workflows, multi-family or multi-era comparison with honest relation classes, deeper control and design trade studies, and educational scaffolding that is no longer a thin overlay on a single-regulation sandbox. v2 is still transition; v3 is the first unmistakable platform-identity threshold.
- **v4+** should be the **operational and product-expansion horizon**. This is where remote/cloud compute maturity, live or near-live race-weekend workflows, broader role coverage, collaboration or multi-user capabilities if the scope expands, and later RL or policy-learning experiments can live. These are real doors the accepted architecture keeps open, but they are not honest v1 or early-v2 commitments.

The scientific-compute migration story therefore starts as a v1 rewrite trigger, becomes a likely v2 milestone theme, and only later supports v3/v4+ operational seriousness. Historical regulation expansion begins in v2, matures in v3, and stops being a one-off Phase 8 tail feature. Calibration depth spans late v1 through v3. Competitive/reference layers begin in v2 and become load-bearing in v3. Broader product expansion belongs to v4+.

### D4.D: Deferrals, rewrite triggers, and Stage 3 handoff

Important items should remain deferred even after D4:

- the final long-term compute language/runtime cutover
- the exact SVG-package binding inside the semantic renderer family
- full historical regulation-family cataloging and full metric-derivation registry breadth
- benchmark/reference-competitor modeling beyond the v1 low-fidelity substitute
- learner progress/mastery systems beyond lesson graph plus assessment hooks
- collaboration and multi-user workflows

Triggers that should cause those deferrals to be revisited:

- R1.5 envelopes are violated by observer, control, or calibration workloads
- stable React 19-compatible visualization package paths land or dense scenes exceed SVG/DOM budgets
- a second regulation family is added or Phase 8 planning begins
- Phase 4 strategy outputs need competitor/reference realism beyond STRA-08
- lesson-path usage creates durable progress-state needs
- explicit product scope changes pull collaboration into scope

Rewrite triggers and tech-debt edges Stage 3 should capture explicitly:

- `runService.ts` and the synchronous harness contract must be split/replaced once `SimulationBackend` and job artifacts land
- the current `App.tsx` / three-zone shell must be retired once recipe-driven shell work begins
- legacy bespoke SVG components should be frozen for bug fixes only and migrated behind the shared primitive layer as needed
- regulation execution must stop depending on raw preset casts and 2026 hardcoded electrical defaults
- D2's anchor/recipe substrate needs the minimal registry completion D3 called out
- fidelity / validation / comparability markers must stay visible in the UI, not only in metadata
- benchmark outputs need a durable reporting path and should feed a tech-debt registry rather than living as one-off notes

Stage 3 must now produce four concrete output types:

- **ROADMAP diff and phase insertion proposal set:** exact inserted phases, exact dependency changes, narrowed Phase 4 scope, any Phase 5 split, narrowed Phase 8 scope, and high-level v2/v3/v4+ milestone additions.
- **Guardrail set:** performance-budget enforcement, legacy-SVG freeze, visible fidelity-label rules, phase-gate question "does this serve the vision or only the milestone?", and thin-client/accessibility commitments carried into planning artifacts.
- **Tech-debt registry:** explicit rewrite candidates, triggers, and severity, especially for compute orchestration, workspace shell, renderer migration, and regulation execution semantics.
- **Stage summary artifact:** a concise synthesis that names the pre-Phase-4 gate, the remaining v1 optimization target, and the v3 "comes into its own" threshold.

## Implications if Closed / Implications if Deferred

### Implications if Closed

- Phase 4 planning remains paused until Stage 3A proposes and the user accepts explicit pre-Phase-4 insertions.
- Stage 3A can no longer update the roadmap only by renaming phases. It must alter dependencies and milestone boundaries.
- Stage 3B has a clear mandate to create guardrails and a tech-debt registry rather than leaving rewrite triggers implicit.
- Future roadmap discussion can stop debating whether architecture has roadmap cost; D4 makes that cost visible.

### Implications if Deferred

- The current roadmap will continue to hide accepted architectural costs behind Phase 4 and Phase 8 labels.
- Phase 4 planning will likely recreate the synchronous local-only API, fixed shell, and "learning views without learning architecture" assumptions the initiative just spent Wave 2 correcting.
- Long-horizon compute and regulation questions will re-enter later phases as "surprises" rather than acknowledged dependencies.

## Dependencies and Relations

- **D1 -> D4:** D1 turns compute and artifact architecture into a roadmap thread. Without D1, D4 could have kept Phase 4 near its current shape. With D1, that is no longer honest.
- **D2 -> D4:** D2 turns shell, interaction state, anchor semantics, accessibility, thin-client performance, and fidelity markers into explicit substrate work. Those are pre-Phase-4 costs, not Phase 4 polish.
- **D3 -> D4:** D3 makes educational architecture part of the roadmap shape. Lessons, preview, validation, and guided overlays are now foundation work and ongoing delivery threads, not prose inside engineer-role views.
- **D5 -> D4:** D5 forces regulation work to split into execution compilation, semantic identity, and comparability work. That prevents Phase 8 from remaining a generic bucket.
- **Current roadmap -> D4:** Phases 4 and 8 are the most structurally misaligned labels; Phase 5 is the most likely to need an internal or explicit split.
- **Future milestones -> D4:** v2 depends on whether the compute and regulation-semantic triggers actually fire after the reshaped v1 loop lands; v3 depends on calibration depth plus comparative semantics; v4+ depends on operational/product-scope expansion rather than only more models.

## Path of Deliberation

- I first tested whether the current roadmap could survive with only note-level edits. That branch failed because the accepted D1/D2/D3/D5 work clearly creates pre-Phase-4 substrate obligations.
- I then considered folding everything into a renamed Phase 4 foundation wave. I rejected that because it preserves the label trap and hides different closure criteria under one milestone label.
- I considered moving data import and calibration earlier than observer/control. I rejected that because the accepted architecture and `PROJECT.md` still support the plant -> sensing -> observer -> control -> later alignment/calibration learning path, and because the audit response already chose honesty labeling rather than early telemetry pull-forward as the mitigation.
- I considered front-loading broader historical regulation expansion and compute migration before Phase 4. I rejected that as scope creep. The honest move is minimal canonicalization and explicit migration triggers now, not full breadth now.
- I considered projecting only to v2. I rejected that because the audit response explicitly asks where the platform comes into its own, and a v2-only projection still leaves that answer structurally vague.
- The retained branch is therefore: separate insertions before Phase 4, a narrowed remaining v1 path optimized around one honest loop, and thematic v2 / v3 / v4+ projection with explicit deferrals and rewrite triggers.

## Open Sub-questions

- What exact decimal numbering and names should Stage 3A use for the three pre-Phase-4 insertions?
- Should the Phase 5 split be formal roadmap numbering or an explicit sub-wave structure inside one phase?
- What is the first non-2026 regulation family the project should support once v1 reaches its first semantic exploration wave?
- Which concrete optimization problem classes in Phase 5 are strong enough to trigger the first scientific-compute migration decision?
- At what point does the reference-competitor layer become necessary enough to move from v2 aspiration to milestone-blocking work?
- Is the eventual race-weekend "tool an engineer would have open" threshold a late-v3 or v4+ commitment once live data, compute, and calibration realities are better understood?

## Decision Record

### D4 (long-horizon roadmap synthesis)
- **Decision:** Accept as provisional recommendation
- **Rationale:** D4 is substantive synthesis, not recap — it concludes that the current roadmap is no longer structurally honest after D1/D2/D3/D5, Phase 4 should not resume directly from Phase 3.1, the remaining v1 path needs reshaping, and v2/v3/v4+ should now be projected thematically. D4 produces conclusions no individual D1-D5 deliberation produced: three specific pre-Phase-4 insertions with distinct closure criteria and dependency edges, Phase 4 narrowing to "strategy workbench and session-workflow," Phase 5 structural mis-cut finding, Phase 8 narrowing away from full multi-era expansion, the "single-family engineering-and-education loop" as the v1 organizing principle, and v3 as the "platform comes into its own" threshold. The provisional grade is honest and specific: exact numbering, exact phase labels, and some boundary packaging still belong to Stage 3A rather than D4 itself. D4 protects D1-D5 accepted closures (explicit no-reopening discipline), handles the label-trap in roadmap form (explicit rejection of "fold into renamed Phase 4 foundation wave" as label-trap at roadmap scale), and avoids doing Stage 3's work (specifies what Stage 3 must produce without writing the content). The 5-option analysis is substantive with each rejected option justified, and the retained hybrid (Option 3 + bounded Option 5) is named with rationale. Implementation commitment acknowledged: Phase 4 planning remains paused until Stage 3A proposes and the user accepts the pre-Phase-4 insertions; Stage 3 must produce four concrete output types (ROADMAP diff + phase insertion proposals, guardrail set, tech-debt registry, stage summary artifact); the initiative exits the deliberation stage and enters synthesis.
- **Open question accepted (deferred):** Exact decimal numbering and naming of the three pre-Phase-4 insertions — belongs to Stage 3A roadmap diff work. D4 binds the existence of distinct insertions; Stage 3A binds the specific labels.
- **Open question accepted (deferred):** Whether the Phase 5 control split is formal roadmap numbering or an explicit sub-wave structure inside one phase — Stage 3A picks the smallest scheme that makes dependencies visible without inventing false precision.
- **Open question accepted (deferred):** Exact compute-language cutover beyond D1's bridge implementation — empirical trigger based on Phase 4.1 / 5 / 7 workload thresholds, not an ideological milestone call. Future milestone audits revisit when thresholds fire.
- **Open question accepted (deferred):** First non-2026 regulation family — belongs to Phase 8 planning or a later milestone audit once the canonical semantic pipeline exists.
- **Open question accepted (deferred):** When the reference-competitor layer becomes milestone-blocking — v2 aspiration per current outcome; revisit if Phase 4 strategy outputs need realism beyond STRA-08.
- **Open question accepted (deferred):** Whether the eventual race-weekend "tool an engineer would have open" threshold is a late-v3 or v4+ commitment — deferred until live data, compute, and calibration realities are better understood. D4.C currently projects race-weekend operational use into v4+ but the exact v3-vs-v4+ calibration for a serious race-weekend tool is an empirical question for future milestone audits.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D4.A (pre-Phase-4 gate and foundation insertions)
- **Decision / Scope disposition:** Accept — explicit pre-Phase-4 insertions are required; exact packaging (count, decimal numbering, phase titles) is deferred to Stage 3A.
- **Rationale:** This is the strongest closure in D4 (see `05-long-horizon-roadmap.md:138`). The current Phase 4 still assumes strategy, explanation, and learning surfaces can begin after Phase 3, but D1/D2/D3/D5 made that false — D1 created backend execution / artifact prerequisite work, D2 created visualization substrate / shell prerequisite work, D3 created educational foundation work, and D5 created regulation canonicalization prerequisite work. Those obligations should be made visible before Phase 4 planning resumes rather than hidden inside a renamed Phase 4 (which would recreate the audit's label-trap at roadmap scale). Separate insertions are the right shape because they have different closure criteria and different dependency edges: D1/D5 execution-flow work unblocks D2 and D3; D2 shell and anchor work unblocks D3's binding model; D3 and D5 semantic groundwork then feed a narrowed, honest Phase 4. Keeping them separate makes dependencies visible and lets each insertion close against its own acceptance criteria. Implementation commitment acknowledged: Stage 3A must propose explicit phase insertions (not rename existing phases); each insertion must have explicit acceptance criteria and dependency edges; exact decimal numbering and titles are Stage 3A's call but the existence of distinct insertions is binding.
- **Implication for roadmap diff:** Stage 3A's `ROADMAP.md` diff must include pre-Phase-4 foundation work between current Phase 3.1 and current Phase 4, packaged as multiple decimal phases or equivalent visible sub-waves rather than folded into a vague "Phase 4 foundation" label. Insertion 1 (backend execution + regulation execution-flow) must deliver `SimulationBackend` contract, typed job protocol, partial artifact delivery, replay window, run-service separation, local worker implementation, and removal of 2026-hardcoded regulation assumptions from the execution path. Insertion 2 (visualization substrate + shell + performance foundation) must deliver renderer-agnostic view surface, shared interaction state, anchor / recipe plumbing, recipe-driven shell, token layer, accessibility + thin-client commitments, and the R1.5 benchmark harness. Insertion 3 (educational foundation + minimal semantic groundwork) may be one phase or two adjacent decimal phases per the D4 `[FOLLOW-AND-MARK]` gray area — must deliver `LessonUnit` graph + body adapter boundary, preview / validation tooling, initial role / path fixtures, and the first regulation canonicalization / comparability / applicability inventory. Exact count and decimal numbering is Stage 3A's call.

### D4.B (remaining v1 milestone reshaping)
- **Decision / Commitment level:** Accept as provisional reshaping direction
- **Rationale:** D4 is right that current Phases 4, 5, and 8 are structurally mis-cut (see `05-long-horizon-roadmap.md:150`). Phase 4 is too broad and carries substrate invention that should already exist; Phase 5 likely needs an explicit split or sub-wave to distinguish driver-style parameterization, control-ready plant seams, optimizer-backed control baselines, and trajectory / racing-line outputs; Phase 8 should narrow to the first semantically grounded regulation / design exploration wave rather than full historical breadth. The 4.1 → 5 → 6 → 7 ordering should remain broadly intact because the plant → sensing → observer → control → alignment → calibration learning path is load-bearing for the project's educational architecture, and the mitigation for keeping calibration later is visible fidelity / validation labeling starting from the earlier foundation waves onward rather than only in Phase 7. The v1 organizing principle is an honest, inspectable, single-family engineering-and-education loop — education becomes a continuous thread through these phases, not a one-phase garnish.
- **Milestone implication:** Narrow Phase 4 to strategy workbench and session-workflow delivery (multi-strategy race analysis, qualifying and sprint modes, in-race interventions, explanation surfaces, initial engineer-role lesson delivery built on already-landed substrate). Preserve Phase 4.1 as an observer and time-indexed replay workbench broadened from "EKF later" — consuming D1 checkpointed artifacts, D2 linked temporal interaction, and D3 guided overlays. Make the Phase 5 split visible (formal decimal split or explicit sub-wave structure — Stage 3A's call). Preserve the Phase 6 → Phase 7 reality-contact corridor ordering with earlier honesty labeling as mitigation. Narrow Phase 8 to the first regulation / design exploration wave on the canonical semantic model; full historical family expansion, larger comparability registries, and deeper regulation-lab breadth move to v2+.

### D4.C (v2 / v3 / v4+ projection)
- **Decision / Commitment level:** Accept as provisional thematic projection
- **Rationale:** D4 projects far enough to answer the audit response's "where does the platform come into its own?" question without pretending to know future implementation plans (see `05-long-horizon-roadmap.md:162`). The v2 numerical / semantic deepening theme, v3 calibrated comparative engineering lab threshold, and v4+ operational / product-expansion horizon are the right level of commitment. The strongest part is the claim that **v3, not v2, is where the platform most clearly "comes into its own"** — that is a more disciplined answer than forcing the identity threshold into v2 before calibration depth, comparative semantics, and compute seriousness are mature enough. v2 is still transition (numerical deepening, semantic breadth, first serious compute escalation if empirical triggers fire, broader historical regulation-family expansion, richer comparability registries, first stronger reference-competitor abstractions beyond STRA-08); v3 is the first unmistakable platform-identity threshold (same substrate supporting calibrated model-vs-reference workflows, multi-family comparison with honest relation classes, deeper control / design trade studies, educational scaffolding no longer feeling like a thin overlay on a single-regulation sandbox); v4+ is where remote / cloud compute maturity, live or near-live race-weekend workflows, broader role coverage, collaboration / multi-user capabilities if scope expands, and later RL or policy-learning experiments can honestly live.
- **Horizon note:** Treat v2 / v3 / v4+ as dependency-shaped themes, not detailed phase plans. v3 is the clearest "platform comes into its own" threshold. Future milestone audits should revisit v2 planning once the v1 loop lands and the empirical triggers (compute migration, second regulation family, reference-competitor realism) are real rather than speculative. The v3 threshold claim itself should be re-examined during the v2 → v3 transition to confirm it still reflects the platform's actual differentiation point at that time.

### D4.D (deferrals, rewrite triggers, and Stage 3 handoff)
- **Decision / Commitment level:** Accept
- **Rationale:** D4's deferrals are disciplined rather than evasive (see `05-long-horizon-roadmap.md:172`). The six enumerated deferrals each have a clear reason for being deferred (empirical rather than ideological, scope discipline, bounded by existing substitutes); the six revisit triggers are specific and testable; the seven rewrite triggers are concrete enough for Stage 3B to capture in a tech-debt registry without additional discovery work. The "does this serve the vision or only the milestone?" phase-gate question introduced for the guardrail set is a simple but durable filter for Phase 4+ planning. This is strong handoff material: it tells Stage 3A and 3B what they must produce without doing their work prematurely. Implementation commitment acknowledged: Stage 3 is mandated to produce all four output types (ROADMAP diff + phase insertion proposals, guardrail set, tech-debt registry, stage summary); the tech-debt registry gets formal scoping rather than living as ad hoc notes; the phase-gate question becomes part of planning-template guardrails.
- **Handoff to Stage 3:** Stage 3A should produce `synthesis/roadmap-evolution.md` and `synthesis/phase-insertion-proposals.md` with concrete `ROADMAP.md` diffs for the three pre-Phase-4 insertions, narrowed Phase 4 scope, Phase 5 split visibility, narrowed Phase 8 scope, and high-level v2 / v3 / v4+ milestone additions keyed to D4.C's themes. Stage 3B should produce `synthesis/guardrails-proposal.md`, `synthesis/tech-debt-registry.md`, and `SUMMARY.md` keyed to D4's rewrite triggers and honesty constraints — specifically: performance-budget enforcement from R1.5 envelopes, legacy-SVG freeze, visible fidelity-label rules, the "does this serve the vision or only the milestone?" phase-gate question, thin-client / accessibility commitments carried into planning artifacts, and the seven enumerated rewrite triggers (`runService.ts` + synchronous harness split, `App.tsx` / three-zone shell retirement, legacy SVG freeze + migration, regulation execution dependency cleanup, `AnchorRegistry` completion, visible fidelity / validation / comparability markers, benchmark output reporting path).
