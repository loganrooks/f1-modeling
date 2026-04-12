# Roadmap: F1 Modeling Lab

## Overview

The path to a useful F1 modeling product is to build a clear local-first learning loop before chasing high fidelity: define scenarios, run reduced-order models, compare strategies and driver policies, expose subsystem explanations for learning, import real-world data, then calibrate and expand. This roadmap is the first staged milestone path toward broader eventual coverage of the major technical and operational systems involved in F1 design and racing strategy, including explicit coupling between the car and its environment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 3.1, 3.2, 3.3, 3.4, 4.1, 5.1): Inserted dependency-shaping or follow-on phases that keep the roadmap structurally honest

- [ ] **Phase 1: Foundations and Scenario Schema** - Create the local-first shell, domain schema, and reproducible run logging.
- [ ] **Phase 2: Reduced-Order Lap Model** - Build the first transparent car and lap model.
- [x] **Phase 2.1: Circuit Geometry Pipeline (INSERTED)** - Replace hand-authored track geometry with a reproducible GPS-derived circuit pipeline.
- [ ] **Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics** - Add the core non-ideal dynamics, electrical subsystem behavior, and environment coupling that actually drive race behavior.
- [x] **Phase 3.1: Race State, Typed Artifacts, and Branchable Runs** - Build the race-state engine, typed timeline artifacts, and run lineage that later strategy and comparison work require.
- [ ] **Phase 3.2: Backend Execution, Job Artifacts, and Regulation Execution Flow** - Land the D1 execution boundary so later phases consume async jobs, durable typed artifacts, and honest regulation execution snapshots.
- [ ] **Phase 3.3: Visualization Substrate, Workspace Shell, and Performance Foundation** - Land the D2 renderer-neutral substrate, recipe-driven shell, and thin-client benchmark foundation before product views ship.
- [ ] **Phase 3.4: Educational Foundation and Minimal Regulation Semantics** - Land the D3 lesson architecture and D5 semantic groundwork required for honest Phase 4 lesson and comparison delivery.
- [ ] **Phase 4: Strategy Workbench and Session Workflows** - Turn the post-3.4 substrate into a strategy workbench for race, qualifying, and sprint workflows with explanation surfaces and initial engineer-role lesson delivery.
- [ ] **Phase 4.1: Observer and Replay Workbench** - Build observer-aware replay and temporal exploration on top of checkpointed artifacts, linked interaction, and guided overlays.
- [ ] **Phase 5: Driver Style and Control Foundations** - Model driver tendencies and control-ready plant seams with explainable policy differences.
- [ ] **Phase 5.1: Optimization-Backed Control and Trajectory Analysis** - Add optimizer-backed control baselines, trajectory analysis, and constraint-aware comparison workflows.
- [ ] **Phase 6: Data Import and Telemetry Alignment** - Ingest structured session data and compare it to simulation results.
- [ ] **Phase 7: Calibration and Validation Workbench** - Measure confidence, calibrate parameters, and surface model limits.
- [ ] **Phase 8: First Regulation and Design Exploration Wave** - Use the calibrated sandbox and canonical semantic model for the first honest regulation and design trade studies.

## Phase Details

### Phase 1: Foundations and Scenario Schema
**Goal**: Establish a local-first application skeleton, scenario schema, regulation presets, and run-history tracking so later models have a stable home.
**Depends on**: Nothing (first phase)
**Requirements**: [PLAT-01, PLAT-03, VAL-02, DESN-02, VISU-01]
**Success Criteria** (what must be TRUE):
  1. User can start the application locally and reach an initial interactive workspace.
  2. User can define a scenario with circuit, session type, regulation preset, weather preset, and driver profile placeholders.
  3. Each run stores enough metadata to reproduce or compare it later, and the architecture leaves room for educational subsystem views and later subsystem-family expansion.
  4. The workspace includes reusable visual primitives that later models can plug into without redesigning the whole UI.
**Plans**: 9 plans

Plans:
- [ ] 01-01: Define the root workspace and shared toolchain contract
- [ ] 01-02: Scaffold the browser and local API application shells
- [ ] 01-03: Create shared package seams and the deterministic placeholder harness
- [ ] 01-04: Implement core scenario and run schema foundations
- [ ] 01-05: Add preset catalog contracts and snapshot-aware run-record construction
- [ ] 01-06: Build the local file persistence layer and Phase 1 API routes
- [ ] 01-07: Create reusable Phase 1 visual primitives
- [ ] 01-08: Assemble the first interactive workspace on top of the shared contracts
- [ ] 01-09: Fix unchecked array indexing in domain contract tests (gap closure)

### Phase 2: Reduced-Order Lap Model
**Goal**: Deliver the first transparent lap model with editable vehicle and circuit parameters.
**Depends on**: Phase 1
**Requirements**: [PLAT-02, MODL-01]
**Success Criteria** (what must be TRUE):
  1. User can choose a circuit, regulation preset, and baseline car parameters before a run.
  2. The system produces a lap estimate with visible intermediate factors rather than only a final score.
  3. Parameter changes show which parts of the model caused the output shift.
  4. Where justified by the model, the system can visualize trajectories, track-map context, or racing-line style outputs without implying unsupported fidelity.
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Circuit schema, vehicle types, QSS forward-backward solver, and circuit presets
- [ ] 02-02-PLAN.md — API and workspace integration for lap model execution with circuit selection and vehicle parameter editing
- [ ] 02-03-PLAN.md — Speed profile trace, track map, sensitivity waterfall, and run comparison visualization

### Phase 02.1: Circuit Geometry Pipeline (INSERTED)

**Goal:** Replace hand-authored non-closing x/y circuit coordinates with real GPS-derived geometry so track map visualizations resemble actual circuits, and deliver a reproducible pipeline for generating circuit geometry.
**Depends on:** Phase 2
**Plans:** 1 plan

Plans:
- [x] 02.1-01-PLAN.md — Python geometry pipeline (TUMFTM + bacinger data), preset updates, and visual verification

### Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics
**Goal**: Add the main non-ideal dynamics, reduced-order electrical subsystem behavior, and explicit car-environment coupling that shape stint evolution and regulation-era tradeoffs.
**Depends on**: Phase 2
**Requirements**: [MODL-02, MODL-03, MODL-04, ELEC-01, ELEC-02, ENVR-01, ENVR-02]
**Success Criteria** (what must be TRUE):
  1. Tire models include at least three dry compounds and one wet compound with distinct degradation curves, thermal operating windows, and cliff-effect behavior. Tire wear and temperature evolve over laps and affect pace.
  2. Electrical energy, harvesting, deployment, and limiting logic affect performance and can be inspected as subsystem states. The user can compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation) and see their effect on lap time and energy state evolution.
  3. Weather and grip conditions evolve over time within a session — including transitions between dry and wet, track temperature changes, and surface rubber evolution — and affect strategy decisions dynamically rather than only as static initial conditions.
  4. Electrical state is visibly linked to strategy windows and policy constraints rather than treated as a hidden scalar.
  5. Environment interaction is modeled as a coupling that influences multiple subsystems, not just as static scenario metadata.
  6. Where regulation presets define aero-mode switching (e.g., DRS or 2026 active-aero states), the model reflects the discrete aero-state effect on drag and downforce rather than using a single static coefficient.
  7. The model exposes at least basic lateral force balance and load transfer effects so that corner speed depends on more than a single grip scalar.
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — Stint runner foundation, tire model, load transfer, and compound presets (Wave 1)
- [ ] 03-02-PLAN.md — Electrical energy model with environment-aware harvesting, aero-mode switching, and regulation preset upgrade (Wave 2)
- [ ] 03-03-PLAN.md — Weather evolution, environment->electrical coupling, SoC visualization, scenario schema, and API integration (Wave 3)
- [ ] 03-04-PLAN.md — Cross-subsystem validation tests including weather->electrical coupling verification (Wave 4)

### Phase 3.1: Race State, Typed Artifacts, and Branchable Runs
**Goal**: Build the race-state engine, multi-stint scenario contracts, typed timeline artifacts, and run lineage that Phase 4 strategy work requires. This is the architectural bridge between single-stint simulation and race-level analysis.
**Depends on**: Phase 3
**Requirements**: [STRA-01 (partial), STRA-05 (partial), VISU-05 (partial)]
**Success Criteria** (what must be TRUE):
  1. Scenario schema supports multi-stint race plans with per-stint compound, policy, and lap count.
  2. A race-state engine sequences stints with pit events (pit-entry time loss, service time, tire change) and produces a typed race timeline artifact.
  3. Race interruptions (VSC, full SC, red flag) can be injected at specified laps and affect race state (field bunching, pit window, pace delta).
  4. Run records carry parent/branch lineage so a user can fork from mid-race state and compare alternatives.
  5. Tire-set inventory tracks allocated and used sets across a race weekend scenario.
  6. Typed timeline artifacts are structured enough for downstream strategy UI and comparison views.
**Plans**: 4 plans

Plans:
- [x] 03.1-01-PLAN.md — Domain schemas for race plans, pit events, tire inventory, run lineage, and race engine types
- [x] 03.1-02-PLAN.md — Pit-lane loss model, interruption effects, runStintFromState, and race engine orchestration loop
- [x] 03.1-03-PLAN.md — Tire-set inventory validation, API dispatcher for race simulation, and artifact persistence
- [x] 03.1-04-PLAN.md — Integration tests, API tests, and Phase 3.1 success criteria verification

### Phase 3.2: Backend Execution, Job Artifacts, and Regulation Execution Flow
**Goal**: Land the D1 execution boundary and artifact substrate so later phases consume compiled requests, async jobs, durable typed artifacts, and honest regulation execution snapshots instead of synchronous local-only route returns.
**Depends on**: Phase 3.1
**Requirements**: [VISU-03, VISU-04, VISU-05, ESTM-01, ESTM-03, ESTM-04, DATA-01, DATA-02, DATA-03, VAL-01, VAL-02, DESN-01, RACE-02, RACE-03]
**Success Criteria** (what must be TRUE):
  1. A compiled-request flow exists from scenario/preset references to a typed backend-facing execution request.
  2. The active backend is accessed through a transport-neutral `SimulationBackend` interface rather than direct synchronous harness calls from request handlers.
  3. Jobs expose typed lifecycle state, progress updates, cancellation, and artifact-ready events with durable artifact fetch after reconnect.
  4. Durable artifacts carry stable identity, lineage, provenance, fidelity, validation, and regulation snapshot references.
  5. The first worker-backed local execution path is in place and current `runService` responsibilities are split along compilation, execution dispatch, and persistence seams.
  6. Execution no longer depends on hardcoded 2026-only regulation assumptions in the runtime path that later phases consume.
**Plans**: 5 plans

Plans:
- [ ] 3.2-01: Define compiled simulation request types, backend interface, and request-compilation seams
- [ ] 3.2-02: Implement submit/get/cancel/subscribe/fetch semantics and replay-safe progress/artifact events
- [ ] 3.2-03: Implement typed artifact envelopes, lineage, provenance, and durable fetch semantics
- [ ] 3.2-04: Put current local execution behind the new backend boundary and split orchestration responsibilities
- [ ] 3.2-05: Compile canonical regulation data into execution snapshots and remove raw-preset and hardcoded runtime assumptions

### Phase 3.3: Visualization Substrate, Workspace Shell, and Performance Foundation
**Goal**: Land the D2 visualization substrate so Phase 4 and 4.1 can build product views on a recipe-driven shell, shared interaction state, renderer-neutral contracts, and measurable thin-client performance guardrails.
**Depends on**: Phase 3.2
**Requirements**: [VISU-01, VISU-03, VISU-04, VISU-05, EDU-01, EDU-02, EDU-03]
**Success Criteria** (what must be TRUE):
  1. A renderer-agnostic visualization contract exists from artifact payload to view model to render surface.
  2. Shared interaction state supports linked cursor, committed brush, branch selection, pinned anchors, and guided focus without network-round-trip dependence.
  3. View recipes and artifact-relative anchors resolve through typed success and failure states suitable for both engineering panels and lesson bindings.
  4. The hardcoded three-zone shell is replaced or superseded by a recipe-driven shell with named panel slots and responsive collapse behavior.
  5. New substrate-native panels consume shared visualization tokens for axes, overlays, fidelity/comparability states, and panel chrome.
  6. A benchmark harness exists for the accepted thin-client performance envelope and can be used to test worst-plausible linked-view scenarios on the real client path.
**Plans**: 5 plans

Plans:
- [ ] 3.3-01: Define view-family contracts, adapter seams, and the initial semantic-SVG implementation path
- [ ] 3.3-02: Implement shared interaction state and keyboard-driven state transitions
- [ ] 3.3-03: Define anchor resolution, recipe contracts, and the recipe-driven workspace shell
- [ ] 3.3-04: Add shared visualization tokens and accessible substrate components for new D2-era panels
- [ ] 3.3-05: Add the benchmark harness and reporting path for thin-client rendering and interaction responsiveness

### Phase 3.4: Educational Foundation and Minimal Regulation Semantics
**Goal**: Land the minimum D3 lesson architecture and D5 semantic groundwork required for Phase 4 to ship guided engineering workflows and honest comparison behavior on top of the D1/D2 substrate.
**Depends on**: Phase 3.3
**Requirements**: [EDU-01, EDU-02, EDU-03, VISU-03, VISU-04, VISU-05, STRA-02, ESTM-03, DESN-01]
**Success Criteria** (what must be TRUE):
  1. A typed `LessonUnit` and `LearningPath` schema exists with role, difficulty, depth, prerequisite, scenario, and artifact-binding fields.
  2. Lesson content binds through recipe IDs, slot IDs, and artifact-relative anchors, with typed fallback behavior for missing or inapplicable bindings.
  3. In-app preview and validation tooling exists for lesson schema, binding resolution, fidelity/validation mismatches, regulation applicability, and accessibility checks.
  4. Initial role/path fixtures exist for the first strategy-engineer learning flow that Phase 4 will deliver.
  5. A canonical regulation semantics inventory exists for the current family, including family identity, applicability, and the `direct` / `derived` / `family-specific` / `non-comparable` relation vocabulary needed by lessons and comparison surfaces.
  6. Phase 4 can consume this groundwork without inferring semantics ad hoc from raw preset maps or teaching against unlabeled artifact fidelity.
**Plans**: 5 plans

Plans:
- [ ] 3.4-01: Define `LessonUnit`, `LearningPath`, body normalization, and artifact-binding schema
- [ ] 3.4-02: Implement recipe/slot/anchor lesson bindings, preview against canonical artifacts, and initial strategy-role fixtures
- [ ] 3.4-03: Implement schema, binding, fidelity, applicability, and accessibility validation for lesson content
- [ ] 3.4-04: Define the minimum family identity, applicability, and relation-class inventory the current family needs
- [ ] 3.4-05: Connect lesson/runtime surfaces to the minimal semantic model so Phase 4 comparison and education workflows stay honest

### Phase 4: Strategy Workbench and Session Workflows
**Goal**: Turn the post-3.4 substrate into a usable strategy workbench for race, qualifying, and sprint workflows, with explanation surfaces and initial engineer-role lesson delivery.
**Depends on**: Phase 3.4
**Requirements**: [STRA-01, STRA-02, STRA-03, STRA-04, STRA-05, PLAT-04, EDU-01, EDU-03, VISU-03]
**Success Criteria** (what must be TRUE):
  1. User can compare multiple pit and compound strategies across a race distance, including energy-deployment policy as a strategic variable.
  2. Outputs explain why a strategy wins or loses with stint-level and event-level detail tied to typed artifacts and provenance.
  3. User can inject race interruptions (VSC, full safety car, red flag) at specified or probabilistic points and see how they alter optimal strategy.
  4. User can simulate in-race strategy interventions (mode changes, pit timing responses, tire management instructions) and see how intervention timing alters outcomes.
  5. User can simulate qualifying sessions (Q1/Q2/Q3 with compound allocation) and sprint races as distinct session modes.
  6. User can inspect subsystem-level views and initial engineer-role lessons built on the shared lesson schema, recipe-driven shell, and artifact/anchor substrate.
  7. User can perturb assumptions and rerun sensitivity studies quickly.
  8. Explanation and learning surfaces remain tied to typed artifacts, fidelity markers, validation state, and honest regulation semantics instead of becoming disconnected dashboards.
**Plans**: 4 plans

Plans:
- [ ] 04-01: Race-distance, pit-strategy, and race-interruption simulation
- [ ] 04-02: Qualifying and sprint session workflows
- [ ] 04-03: Explanation surfaces and initial engineer-role lesson delivery
- [ ] 04-04: In-race intervention simulation and strategy-response workflows

### Phase 4.1: Observer and Replay Workbench
**Goal**: Build observer-aware replay and temporal exploration on top of checkpointed artifacts, linked temporal interaction, and guided overlays.
**Depends on**: Phase 4
**Requirements**: [ESTM-01, ESTM-02, ESTM-03, ESTM-04, VISU-05]
**Success Criteria** (what must be TRUE):
  1. The simulator generates noisy measurement artifacts through the D1 job/artifact pipeline, enabling observer comparison without bespoke data paths.
  2. User can enable an observer layer and inspect true, measured, and estimated state through linked D2 interaction behaviors.
  3. User can scrub through simulation time, inspect state at any point, and branch simulations from intermediate states using checkpointed artifacts and replay-friendly views.
  4. Observer-aware learning views and guided overlays connect estimation concepts to engineering disciplines without inventing a separate lesson substrate.
**Plans**: 3 plans

Plans:
- [ ] 04.1-01: Synthetic sensor model and noisy measurement artifacts
- [ ] 04.1-02: Observer layer (EKF baseline) with true/measured/estimated comparison
- [ ] 04.1-03: Observer-aware replay, guided overlays, and sensitivity workflows

### Phase 5: Driver Style and Control Foundations
**Goal**: Model how different driving tendencies and control-ready plant assumptions alter performance and degradation, and make the policy logic legible to learners.
**Depends on**: Phase 4.1
**Requirements**: [CTRL-01, CTRL-02, CTRL-03, EDU-02, VISU-04]
**Success Criteria** (what must be TRUE):
  1. User can define at least two driver-style profiles with meaningful behavioral differences.
  2. The same scenario can be rerun under different profiles and compared directly.
  3. The policy logic remains explainable and inspectable.
  4. The system exposes the control-ready plant seams needed for later optimizer-backed baselines without freezing the architecture around a single solver.
  5. Comparative visualizations make driver-style and policy differences intuitive to inspect.
**Plans**: 4 plans

Plans:
- [ ] 05-01: Define control-ready plant interface (segment/time-step state transition API coexisting with envelope solver)
- [ ] 05-02: Define driver-style parameterization
- [ ] 05-03: Connect style parameters to tire, pace, and energy behavior
- [ ] 05-04: Build comparative driver-style and policy visualization workflows

Future extension from this phase:
- Once the control interface is stable and the simulator is calibrated, this phase becomes the launch point for RL to be compared against a serious model-based baseline rather than a dead-end heuristic layer.

### Phase 5.1: Optimization-Backed Control and Trajectory Analysis
**Goal**: Add optimizer-backed control baselines, trajectory analysis, and constraint-aware comparison workflows on top of the control-ready foundations from Phase 5.
**Depends on**: Phase 5
**Requirements**: [CTRL-04, CTRL-05, VISU-04]
**Success Criteria** (what must be TRUE):
  1. The system includes a model-based control baseline, ideally MPC where tractable, with visible state, constraint, and objective structure.
  2. The system can compute or approximate an optimal trajectory for the current model and circuit, and show how parameter changes alter the racing line.
  3. The system can surface controller intent and constraint activation in a way that helps a learning engineer understand the control problem.
  4. Comparative visualizations make optimization, path-choice, and control consequences intuitive to inspect.
**Plans**: 3 plans

Plans:
- [ ] 05.1-01: Implement an explainable model-based control baseline, ideally MPC where tractable
- [ ] 05.1-02: Compute optimal trajectory and racing-line output from the control and optimization layer
- [ ] 05.1-03: Build controller-intent, trajectory-aware, and constraint-activation comparison workflows

### Phase 6: Data Import and Telemetry Alignment
**Goal**: Bring outside session data into the loop so simulation can be compared against reality.
**Depends on**: Phase 5.1
**Requirements**: [DATA-01, DATA-02, DATA-03, DATA-04]
**Success Criteria** (what must be TRUE):
  1. User can import structured local data files into a stable session schema.
  2. Import logic is adapter-based and does not contaminate core simulation code.
  3. At least one established F1 data source (such as FastF1 or OpenF1 API) is supported as a primary import path.
  4. Imported and simulated data can be overlaid and compared in the same workspace.
**Plans**: 5 plans

Plans:
- [ ] 06-01: Define the data-ingestion contract and adapter interface
- [ ] 06-02: Implement baseline CSV or JSON importers
- [ ] 06-03: Implement FastF1 or OpenF1 API adapter for real F1 telemetry data
- [ ] 06-04: Align imported data with scenario and circuit metadata
- [ ] 06-05: Build comparison overlays between imported and simulated outputs

### Phase 7: Calibration and Validation Workbench
**Goal**: Make model confidence explicit and provide a path to disciplined improvement.
**Depends on**: Phase 6
**Requirements**: [VAL-01]
**Success Criteria** (what must be TRUE):
  1. Every major model component exposes assumptions and confidence notes.
  2. Calibration workflows can tune parameters against imported reference sessions.
  3. Users can see where the model is weak, uncertain, or likely wrong.
**Plans**: 3 plans

Plans:
- [ ] 07-01: Define calibration targets and validation metrics
- [ ] 07-02: Implement parameter fitting and confidence reporting
- [ ] 07-03: Surface uncertainty and model limitations in the UI

### Phase 8: First Regulation and Design Exploration Wave
**Goal**: Use the calibrated sandbox and canonical semantic model for the first honest regulation and design trade studies.
**Depends on**: Phase 7
**Requirements**: [DESN-01]
**Success Criteria** (what must be TRUE):
  1. User can compare regulation presets or design parameter changes directly using the canonical semantic model and explicit relation classes.
  2. Downstream effects on pace, degradation, energy usage, and strategy are visible with honest comparability and applicability labeling.
  3. The first exploration wave stays narrow enough to preserve room for broader historical family expansion and richer regulation-lab breadth in later milestones.
**Plans**: 3 plans

Plans:
- [ ] 08-01: Build regulation and design parameter sweep workflows
- [ ] 08-02: Add comparative visualizations for downstream tradeoffs
- [ ] 08-03: Define extension points for higher-fidelity submodels

## Future Milestone Direction

### v2: Numerical and Semantic Deepening

Likely milestone themes:

- first serious compute escalation if empirical workload triggers fire
- broader regulation-family expansion
- richer comparability registries
- denser reference and benchmark layers
- stronger competitor-reference abstractions

### v3: Calibrated Comparative Engineering Lab

Likely milestone themes:

- calibrated model-vs-reference workflows
- multi-family comparison with honest relation classes
- deeper design and control trade studies
- educational scaffolding that feels native rather than overlaid

This is the clearest current answer to where the platform comes into its own.

### v4+: Operational and Product Expansion Horizon

Likely milestone themes:

- remote and cloud compute maturity
- live or near-live race-weekend workflows
- broader role coverage
- collaboration if scope expands
- later RL or policy-learning work
- aerodynamic and active-aero refinement
- thermal and cooling dynamics
- braking, chassis, suspension, and richer setup tradeoffs
- richer environment and surface interaction models
- race-operations and multi-car interaction models
- higher-fidelity subsystem coupling once calibration supports it

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 2.1 -> 3 -> 3.1 -> 3.2 -> 3.3 -> 3.4 -> 4 -> 4.1 -> 5 -> 5.1 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundations and Scenario Schema | 9/9 | Complete | 2026-03-20 |
| 2. Reduced-Order Lap Model | 3/3 | Complete | 2026-03-27 |
| 02.1. Circuit Geometry Pipeline | 1/1 | Complete | 2026-04-03 |
| 3. Tire, Electrical, Weather, Environment, and Energy Dynamics | 4/4 | Complete | 2026-04-03 |
| 3.1. Race State, Typed Artifacts, and Branchable Runs | 4/4 | Complete | 2026-04-08 |
| 3.2. Backend Execution, Job Artifacts, and Regulation Execution Flow | 0/5 | Not started | - |
| 3.3. Visualization Substrate, Workspace Shell, and Performance Foundation | 0/5 | Not started | - |
| 3.4. Educational Foundation and Minimal Regulation Semantics | 0/5 | Not started | - |
| 4. Strategy Workbench and Session Workflows | 0/4 | Not started | - |
| 4.1. Observer and Replay Workbench | 0/3 | Not started | - |
| 5. Driver Style and Control Foundations | 0/4 | Not started | - |
| 5.1. Optimization-Backed Control and Trajectory Analysis | 0/3 | Not started | - |
| 6. Data Import and Telemetry Alignment | 0/5 | Not started | - |
| 7. Calibration and Validation Workbench | 0/3 | Not started | - |
| 8. First Regulation and Design Exploration Wave | 0/3 | Not started | - |
