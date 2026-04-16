# Stage 3A Roadmap Evolution Proposal

## Metadata

- Date: 2026-04-11
- Mode: Synthesis
- Reasoning effort: high
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
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/05-long-horizon-roadmap.md`
  - `.planning/initiatives/vision-alignment-2026-04/audit/2026-04-11-d4-acceptance-response.md`

## Accepted Basis

The binding basis for this proposal is:

- D1 accepted the compiled-request -> `SimulationBackend` boundary, typed job/event protocol, artifact/provenance contract, and regulation execution snapshot handshake.
- D2 accepted the renderer-agnostic visualization surface, shared interaction state, anchor/recipe substrate, recipe-driven shell implications, WCAG AA minimum, and thin-client responsiveness commitments.
- D3 accepted `LessonUnit` / `LearningPath` educational architecture, recipe- and anchor-bound lesson bindings, preview/validation tooling, and visible fidelity-aware lesson behavior.
- D5 accepted a family-primary hybrid regulation ontology, independent schema versioning, explicit comparability/applicability relation classes, and a canonicalization -> execution compilation handshake.
- D4 accepted at scope level that explicit pre-Phase-4 insertions are required, Phase 4 must narrow to strategy workbench delivery, Phase 5 needs split visibility, Phase 8 must narrow, and v2 / v3 / v4+ should be added thematically.
- The D4 acceptance audit carried forward two binding clarifications:
  - use the corrected Phase 4.1 framing: current Phase 4.1 already spans synthetic sensors, observer work, and observer-aware learning/timeline surfaces, but its plans must be rewritten against D1/D2/D3 substrate
  - leave `AccessibleChartContract` and `packages/visuals` zero-tests to explicit Stage 3B reconciliation rather than implying D4 already closed them

## Current-Roadmap Mismatches

After D1-D5, the current roadmap is structurally dishonest in five ways:

- It still jumps directly from Phase 3.1 into a Phase 4 that assumes synchronous execution, ad hoc artifacts, and shell-local visualization growth.
- It treats visualization substrate, workspace shell, and performance enforcement as Phase 4 implementation detail instead of preconditions for Phase 4 planning.
- It treats educational delivery as engineer-role views inside Phase 4 even though D3 accepted lesson graph, preview, validation, and binding tooling as architecture.
- It leaves regulation semantics too late and too vague, even though D1 and D5 now require canonicalization and comparability groundwork before honest lesson and comparison workflows.
- It keeps Phase 5 and Phase 8 broad enough to hide distinct dependency cuts that the accepted decisions now make visible.

## Proposed Structural Changes

This proposal makes six structural changes:

1. Insert three explicit decimal phases between Phase 3.1 and Phase 4.
2. Narrow Phase 4 to strategy workbench and session-workflow delivery on top of already-landed substrate.
3. Keep Phase 4.1 after Phase 4, but rewrite it as an observer and replay workbench that consumes checkpointed artifacts, linked temporal interaction, and guided overlays.
4. Make the current Phase 5 split visible by separating driver-style/control foundations from optimization-backed control and trajectory work.
5. Preserve the Phase 6 -> Phase 7 reality-contact corridor.
6. Narrow Phase 8 to the first semantically grounded regulation/design exploration wave, then project v2 / v3 / v4+ thematically rather than with detailed phase plans.

## Proposed `ROADMAP.md` Diff Guidance

### Pre-Phase-4 insertions

Insert three phases immediately after Phase 3.1 and before Phase 4:

- `Phase 3.2: Backend Execution, Job Artifacts, and Regulation Execution Flow`
  - Purpose: land D1 execution boundary, job protocol, artifact/provenance contract, worker-backed execution, and D5 execution-facing regulation snapshot flow
  - Why here: every later phase now assumes jobs, durable typed artifacts, and regulation provenance

- `Phase 3.3: Visualization Substrate, Workspace Shell, and Performance Foundation`
  - Purpose: land D2 renderer-agnostic view surface, shared interaction state, anchor/recipe substrate, recipe-driven shell, shared visualization tokens, and benchmark harness
  - Why here: Phase 4 and Phase 4.1 must consume this substrate rather than invent it mid-phase

- `Phase 3.4: Educational Foundation and Minimal Regulation Semantics`
  - Purpose: land D3 lesson graph, bindings, preview/validation tooling, initial role/path fixtures, and the minimum D5 canonicalization/comparability/applicability inventory needed for honest lesson and comparison behavior
  - Why here: Phase 4 needs lesson delivery and comparison semantics, not just future promises about them

### Phase 4 rewrite

Rewrite Phase 4 as a narrowed product-delivery phase. Suggested framing:

- Proposed title: `Phase 4: Strategy Workbench and Session Workflows`
- Proposed goal: turn the post-3.4 substrate into a usable strategy workbench for race, qualifying, and sprint workflows, with explanation surfaces and initial engineer-role lesson delivery
- Proposed dependency: `Depends on: Phase 3.4`
- Scope that should remain:
  - multi-strategy race analysis and comparison
  - qualifying and sprint session workflows
  - in-race intervention workflows
  - explanation surfaces tied to typed artifacts, fidelity, and provenance
  - initial engineer-role lesson delivery using the already-landed lesson schema and recipe/anchor substrate
- Scope that should be removed from Phase 4:
  - execution-boundary invention
  - job protocol invention
  - artifact identity/provenance invention
  - workspace shell creation
  - lesson-schema invention
  - first-pass regulation canonicalization

### Phase 4.1 rewrite using the corrected framing

Keep Phase 4.1 directly after Phase 4, but rewrite it against the accepted substrate rather than describing it as a later EKF add-on.

- Proposed title: `Phase 4.1: Observer and Replay Workbench`
- Proposed dependency: `Depends on: Phase 4`
- Correct framing:
  - current Phase 4.1 already spans synthetic sensors, observer work, and observer-aware timeline/learning surfaces
  - the rewrite needed is not "broaden Phase 4.1 from EKF later"
  - the rewrite needed is "make Phase 4.1 consume D1 checkpointed artifacts, D2 linked temporal interaction, and D3 guided overlays"
- Proposed scope emphasis:
  - synthetic sensor and noisy measurement artifacts emitted through the D1 job/artifact pipeline
  - true/measured/estimated comparisons using D2 shared cursor, brush, and anchor behavior
  - observer-aware replay, scrubbing, and branch inspection on top of checkpointed artifacts
  - guided overlays that teach observer behavior without inventing a separate lesson substrate

### Phase 5 split visibility

Make the current Phase 5 split visible rather than leaving it as one undifferentiated control bucket.

- Recommended shape:
  - `Phase 5: Driver Style and Control Foundations`
  - `Phase 5.1: Optimization-Backed Control and Trajectory Analysis`
- Recommended Phase 5 scope:
  - control-ready plant seams
  - driver-style parameterization
  - coupling style to tire, pace, and energy behavior
  - comparison surfaces for explainable policy differences
- Recommended Phase 5.1 scope:
  - optimizer-backed control baseline, preferably MPC where tractable
  - optimal trajectory / racing-line outputs
  - controller-intent and constraint-activation analysis
  - trajectory-aware comparison workflows
- Why formal split visibility is preferred:
  - it makes the optimizer / trajectory work visible as a stronger dependency and performance trigger surface
  - it preserves the D4 instruction to avoid hiding materially different closure criteria behind one label

### Phase 6-7 ordering preservation

Preserve the ordering and corridor logic:

- `Phase 6` stays the import and telemetry-alignment phase
- `Phase 7` stays the calibration and validation workbench phase
- The key roadmap note to add is not a reordering note, but an honesty note:
  - visible fidelity, validation, and comparability labeling start earlier
  - full reality contact still lands in Phases 6 and 7, in that order

### Phase 8 narrowing

Narrow Phase 8 so it stops implying full multi-era breadth at the tail end of v1.

- Proposed title: `Phase 8: First Regulation and Design Exploration Wave`
- Proposed dependency: `Depends on: Phase 7`
- Proposed scope:
  - regulation/design sweeps on top of the canonical semantic model
  - first honest comparison surfaces using D5 relation classes
  - single-family plus minimal cross-family semantic exploration where applicability and comparability are explicit
- Scope that should move out of Phase 8 into later milestones:
  - broad historical family expansion
  - large comparability registries
  - full regulation lab breadth

### v2 / v3 / v4+ milestone additions

Add a new high-level roadmap section after the v1 phase list.

- `v2: Numerical and Semantic Deepening`
  - likely themes: first serious compute escalation if empirical triggers fire, broader regulation-family expansion, richer comparability registries, denser reference/benchmark layers, stronger competitor-reference abstractions

- `v3: Calibrated Comparative Engineering Lab`
  - likely themes: calibrated model-vs-reference workflows, multi-family comparison with honest relation classes, deeper design/control trade studies, educational scaffolding that feels native rather than overlaid
  - this is the clearest "comes into its own" threshold

- `v4+: Operational and Product Expansion Horizon`
  - likely themes: remote/cloud compute maturity, live or near-live race-weekend workflows, broader role coverage, collaboration if scope expands, later RL/policy-learning work

## Dependency Graph and Sequencing Logic

Recommended high-level sequence:

`1 -> 2 -> 2.1 -> 3 -> 3.1 -> 3.2 -> 3.3 -> 3.4 -> 4 -> 4.1 -> 5 -> 5.1 -> 6 -> 7 -> 8 -> v2 -> v3 -> v4+`

The boundary logic is:

- `3.1 -> 3.2`
  - race state and typed timelines already exist, but Phase 4-era product growth now depends on async execution, durable artifacts, and regulation execution snapshots

- `3.2 -> 3.3`
  - D2 substrate should consume D1 artifact/provenance contracts, not invent private panel data paths

- `3.3 -> 3.4`
  - D3 lesson binding and preview depend on recipes, slots, anchors, shared interaction state, and the recipe-driven shell that D2 defines

- `3.4 -> 4`
  - honest Phase 4 delivery needs both lesson architecture and minimal semantic/canonicalization groundwork already landed

- `4 -> 4.1`
  - observer and replay work should be built on actual strategy/session workflows, not on isolated sensor demos

- `4.1 -> 5 -> 5.1`
  - this preserves the educational path from strategy to sensing/estimation to control foundations to heavier optimization/trajectory work

- `5.1 -> 6 -> 7`
  - import before calibration remains the reality-contact corridor, while earlier phases still carry visible honesty labeling

- `7 -> 8`
  - the first regulation/design exploration wave should happen after calibration and validation make the underlying loop more trustworthy

- `8 -> v2 -> v3 -> v4+`
  - v2 deepens compute and semantic breadth
  - v3 is where the calibrated comparative lab identity coheres
  - v4+ is where operational and product expansion can honestly live

## Open Packaging Choices Reserved for User / Later Work

These proposals are intentionally specific but not over-finalized:

- Exact decimal numbering can stay `3.2` / `3.3` / `3.4`, but the user may renumber if another decimal convention fits the roadmap better.
- Insertion 3 is recommended here as a single visible phase, but the user may later split it into two adjacent decimal phases if implementation planning shows lesson foundation and semantic groundwork cannot close together honestly.
- The Phase 5 split is recommended here as `5` / `5.1`; if the user prefers fewer roadmap entries, the same split can be represented as two explicit sub-waves inside Phase 5 so long as the visibility is preserved.
- The milestone labels `v2`, `v3`, and `v4+` should stay thematic; Stage 3A should not fabricate plan counts or exact sub-phase trees for them.

## Application Notes

- Treat this file as diff guidance, not as replacement `ROADMAP.md` text.
- The key application rule is visibility of dependency cost. If a change hides accepted substrate work inside a broader label, it is the wrong edit.
- When updating `ROADMAP.md`, preserve the existing v1 execution-order table style, but update the sequence to include `3.2`, `3.3`, `3.4`, and the recommended `5.1`.
- When rewriting phase descriptions, keep the requirement IDs only where they still fit honestly. Foundation phases will often be enabling phases that map requirements indirectly rather than fully closing them.
- Do not let the v2 / v3 / v4+ additions drift into pseudo-detailed planning. Their purpose is to make future dependency arcs visible, not to invent future implementation certainty.
