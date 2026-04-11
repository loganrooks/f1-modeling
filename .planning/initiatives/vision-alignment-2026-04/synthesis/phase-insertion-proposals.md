# Stage 3A Pre-Phase-4 Insertion Proposals

This file proposes the explicit pre-Phase-4 insertions that D4.A requires. The recommended numbering is `3.2`, `3.3`, and `3.4`.

## Insertion 1

### 1. Proposed phase number or numbering options

- Recommended: `Phase 3.2`

### 2. Phase name

- `Backend Execution, Job Artifacts, and Regulation Execution Flow`

### 3. Goal statement

- Land the D1 execution boundary and artifact substrate so later phases consume compiled requests, async jobs, durable typed artifacts, and honest regulation execution snapshots instead of synchronous local-only route returns.

### 4. Depends on

- `Phase 3.1`

### 5. Requirements mapping

- Primary enabling support for: `VISU-03`, `VISU-04`, `VISU-05`, `ESTM-01`, `ESTM-03`, `ESTM-04`, `DATA-01`, `DATA-02`, `DATA-03`, `VAL-01`, `DESN-01`
- Direct continuity with existing typed-run and artifact work: `VAL-02`, `RACE-02`, `RACE-03`
- This insertion is mainly substrate-enabling rather than a direct requirement-closure phase

### 6. Success criteria

1. A compiled-request flow exists from scenario/preset references to a typed backend-facing execution request.
2. The active backend is accessed through a transport-neutral `SimulationBackend` interface rather than direct synchronous harness calls from request handlers.
3. Jobs expose typed lifecycle state, progress updates, cancellation, and artifact-ready events with durable artifact fetch after reconnect.
4. Durable artifacts carry stable identity, lineage, provenance, fidelity, validation, and regulation snapshot references.
5. The first worker-backed local execution path is in place and current `runService` responsibilities are split along compilation, execution dispatch, and persistence seams.
6. Execution no longer depends on hardcoded 2026-only regulation assumptions in the runtime path that later phases consume.

### 7. Plan breakdown

- `3.2-01`: compiled request and backend boundary
  - Define compiled simulation request types, backend interface, and request-compilation seams.
- `3.2-02`: job protocol and event streaming
  - Implement submit/get/cancel/subscribe/fetch semantics and replay-safe progress/artifact events.
- `3.2-03`: artifact and provenance store
  - Implement typed artifact envelopes, lineage, provenance, and durable fetch semantics.
- `3.2-04`: local worker implementation and run-service split
  - Put current local execution behind the new backend boundary and split orchestration responsibilities.
- `3.2-05`: regulation execution-flow cleanup
  - Compile canonical regulation data into execution snapshots and remove raw-preset / hardcoded runtime assumptions.

### 8. Why this insertion exists

- Phase 4 cannot honestly begin while execution is still synchronous, artifacts are still ad hoc, and regulation execution semantics still leak through local API code paths.

### 9. What it unblocks

- `Phase 3.3` visualization substrate consuming durable artifacts
- `Phase 3.4` lesson and semantic tooling binding against stable artifact identity
- later Phase 4, 4.1, 6, and 7 work that requires checkpointing, replay, provenance, and backend neutrality

### 10. Why this packaging is the smallest honest shape

- The D1 execution boundary, D1 job protocol, D1 artifact contract, and D5 execution-flow slice are tightly coupled enough to close together and give the rest of the roadmap a stable substrate. Splitting them further would create artificial phase boundaries inside one architectural cut.

## Insertion 2

### 1. Proposed phase number or numbering options

- Recommended: `Phase 3.3`

### 2. Phase name

- `Visualization Substrate, Workspace Shell, and Performance Foundation`

### 3. Goal statement

- Land the D2 visualization substrate so Phase 4 and 4.1 can build product views on a recipe-driven shell, shared interaction state, renderer-neutral contracts, and measurable thin-client performance guardrails.

### 4. Depends on

- `Phase 3.2`

### 5. Requirements mapping

- Primary enabling support for: `VISU-01`, `VISU-03`, `VISU-04`, `VISU-05`, `EDU-01`, `EDU-02`, `EDU-03`
- Supporting infrastructure for later strategy, observer, and comparison workflows that depend on accessible linked views and recipe-driven layout
- This insertion is primarily substrate-enabling rather than a direct end-user feature-closure phase

### 6. Success criteria

1. A renderer-agnostic visualization contract exists from artifact payload to view model to render surface.
2. Shared interaction state supports linked cursor, committed brush, branch selection, pinned anchors, and guided focus without network-round-trip dependence.
3. View recipes and artifact-relative anchors resolve through typed success and failure states suitable for both engineering panels and lesson bindings.
4. The hardcoded three-zone shell is replaced or superseded by a recipe-driven shell with named panel slots and responsive collapse behavior.
5. New substrate-native panels consume shared visualization tokens for axes, overlays, fidelity/comparability states, and panel chrome.
6. A benchmark harness exists for the accepted thin-client performance envelope and can be used to test worst-plausible linked-view scenarios on the real client path.

### 7. Plan breakdown

- `3.3-01`: renderer-neutral contracts and view adapters
  - Define view-family contracts, adapter seams, and initial semantic-SVG implementation path.
- `3.3-02`: shared interaction state
  - Implement the small semantic interaction store and keyboard-driven state transitions.
- `3.3-03`: anchors, recipes, and shell
  - Define anchor resolution, recipe contracts, and the recipe-driven workspace shell.
- `3.3-04`: token layer and accessible substrate primitives
  - Add shared visualization tokens and accessible substrate components for new D2-era panels.
- `3.3-05`: performance harness and enforcement path
  - Add the benchmark harness and reporting path for thin-client rendering and interaction responsiveness.

### 8. Why this insertion exists

- Accepted D2 work made it explicit that Phase 4 should consume a shell and visualization substrate, not invent one while also trying to ship strategy workflows.

### 9. What it unblocks

- `Phase 3.4` lesson binding, preview, and guided overlays
- `Phase 4` strategy workbench views and session workflows
- `Phase 4.1` observer/replay panels built on linked temporal interaction

### 10. Why this packaging is the smallest honest shape

- Renderer contracts, shared interaction state, anchor/recipe plumbing, workspace shell, and benchmark enforcement are one coherent substrate cut. Keeping them together makes the Phase 4 precondition visible without inventing separate micro-phases for tightly coupled infrastructure.

## Insertion 3

### 1. Proposed phase number or numbering options

- Recommended: `Phase 3.4`

### 2. Phase name

- `Educational Foundation and Minimal Regulation Semantics`

### 3. Goal statement

- Land the minimum D3 lesson architecture and D5 semantic groundwork required for Phase 4 to ship guided engineering workflows and honest comparison behavior on top of the D1/D2 substrate.

### 4. Depends on

- `Phase 3.3`

### 5. Requirements mapping

- Primary enabling support for: `EDU-01`, `EDU-02`, `EDU-03`, `VISU-03`, `VISU-04`, `VISU-05`, `STRA-02`, `ESTM-03`, `DESN-01`
- Semantic groundwork that later supports honest regulation/design comparison without claiming full multi-era breadth yet
- This insertion closes foundation architecture needed before substantial Phase 4 lesson and comparison delivery

### 6. Success criteria

1. A typed `LessonUnit` and `LearningPath` schema exists with role, difficulty, depth, prerequisite, scenario, and artifact-binding fields.
2. Lesson content binds through recipe ids, slot ids, and artifact-relative anchors, with typed fallback behavior for missing or inapplicable bindings.
3. In-app preview and validation tooling exists for lesson schema, binding resolution, fidelity/validation mismatches, regulation applicability, and accessibility checks.
4. Initial role/path fixtures exist for the first strategy-engineer learning flow that Phase 4 will deliver.
5. A canonical regulation semantics inventory exists for the current family, including family identity, applicability, and the `direct` / `derived` / `family-specific` / `non-comparable` relation vocabulary needed by lessons and comparison surfaces.
6. Phase 4 can consume this groundwork without inferring semantics ad hoc from raw preset maps or teaching against unlabeled artifact fidelity.

### 7. Plan breakdown

- `3.4-01`: lesson graph and body adapter boundary
  - Define `LessonUnit`, `LearningPath`, body normalization, and artifact-binding schema.
- `3.4-02`: guided bindings, preview, and authoring fixtures
  - Implement recipe/slot/anchor lesson bindings, preview against canonical artifacts, and initial strategy-role fixtures.
- `3.4-03`: lesson validation and accessibility checks
  - Implement schema, binding, fidelity, applicability, and accessibility validation for lesson content.
- `3.4-04`: canonical regulation semantics inventory
  - Define the minimum family identity, applicability, and relation-class inventory the current family needs.
- `3.4-05`: comparison and lesson handshake
  - Connect lesson/runtime surfaces to the minimal semantic model so Phase 4 comparison and education workflows stay honest.

### 8. Why this insertion exists

- D3 and D5 made two things true at once: education is architecture, not garnish; and semantic comparability/applicability cannot remain a vague Phase 8 promise if Phase 4 is going to teach and compare honestly.

### 9. What it unblocks

- `Phase 4` initial engineer-role lesson delivery and explanation surfaces
- honest strategy comparison views that can carry fidelity and comparability context
- later `Phase 4.1` guided observer overlays and `Phase 8` first regulation/design exploration work

### 10. Why this packaging is the smallest honest shape

- The recommended packaging is a single visible phase, not two adjacent decimal phases. Lesson foundation and minimal semantic groundwork are different work lanes, but both depend on the same D2 recipe/anchor substrate and both exist to make the next phase's lesson and comparison delivery honest. Splitting them now would add extra numbering precision without a stronger sequencing payoff, so the smallest honest shape is one phase with explicit plans for both lanes.
