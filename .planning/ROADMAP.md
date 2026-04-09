# Roadmap: F1 Modeling Lab

## Overview

The path to a useful F1 modeling product is to build a clear local-first learning loop before chasing high fidelity: define scenarios, run reduced-order models, compare strategies and driver policies, expose subsystem explanations for learning, import real-world data, then calibrate and expand. This roadmap is the first staged milestone path toward broader eventual coverage of the major technical and operational systems involved in F1 design and racing strategy, including explicit coupling between the car and its environment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions if needed later

- [ ] **Phase 1: Foundations and Scenario Schema** - Create the local-first shell, domain schema, and reproducible run logging.
- [ ] **Phase 2: Reduced-Order Lap Model** - Build the first transparent car and lap model.
- [ ] **Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics** - Add the core non-ideal dynamics, electrical subsystem behavior, and environment coupling that actually drive race behavior.
- [ ] **Phase 4: Strategy, Race Simulation, and Explanation Surfaces** - Turn the simulation into a race-strategy analysis tool that explains outcomes and teaches subsystem interactions through engineer-role views.
- [ ] **Phase 4.1: Observer Layer and Synthetic Sensing** - Introduce the observer layer with synthetic sensors, enabling true/measured/estimated state comparison and temporal exploration.
- [ ] **Phase 5: Driver Style and Control Systems** - Model driver tendencies and explainable control-system tradeoffs.
- [ ] **Phase 6: Data Import and Telemetry Alignment** - Ingest structured session data and compare it to simulation results.
- [ ] **Phase 7: Calibration and Validation Workbench** - Measure confidence, calibrate parameters, and surface model limits.
- [ ] **Phase 8: Regulation and Design Exploration** - Turn the system into a real sandbox for regulation and design trade studies.

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

### Phase 4: Strategy, Race Simulation, and Explanation Surfaces
**Goal**: Turn the simulation into a race-strategy analysis tool that explains outcomes across session formats, teaches subsystem interactions through engineer-role views, and supports interactive temporal exploration.
**Depends on**: Phase 3
**Requirements**: [STRA-01, STRA-02, STRA-03, STRA-04, STRA-05, PLAT-04, EDU-01, EDU-03, VISU-03]
**Success Criteria** (what must be TRUE):
  1. User can compare multiple pit and compound strategies across a race distance, including energy-deployment policy as a strategic variable.
  2. Outputs explain why a strategy wins or loses with stint-level and event-level detail.
  3. User can inject race interruptions (VSC, full safety car, red flag) at specified or probabilistic points and see how they alter optimal strategy.
  4. User can simulate in-race strategy interventions (mode changes, pit timing responses, tire management instructions) and see how intervention timing alters outcomes.
  5. User can simulate qualifying sessions (Q1/Q2/Q3 with compound allocation) and sprint races as distinct session modes.
  6. User can inspect subsystem-level views showing how tires, electrical state, weather, and policy interact, with learning paths relevant to different F1 engineering disciplines.
  7. User can perturb assumptions and rerun sensitivity studies quickly.
  8. Visual learning views remain tied to model semantics and uncertainty instead of becoming disconnected dashboards.

**Prerequisite:** Visualization architecture deliberation must be completed before Phase 4 planning begins. See audit-response-2026-04-07.md finding #9.

**Plans**: 4 plans

Plans:
- [ ] 04-01: Race-distance, pit-strategy, and race-interruption simulation
- [ ] 04-02: Qualifying and sprint session modes
- [ ] 04-03: Explanation views, engineer-role learning paths, and stint-delta analysis
- [ ] 04-04: In-race intervention simulation and strategy-response workflows

### Phase 4.1: Observer Layer and Synthetic Sensing
**Goal**: Introduce the observer layer with a synthetic sensor model, enabling comparison of true, measured, and estimated state, with observer-aware learning views and temporal exploration.
**Depends on**: Phase 4
**Requirements**: [ESTM-01, ESTM-02, ESTM-03, ESTM-04, VISU-05]
**Success Criteria** (what must be TRUE):
  1. The simulator generates noisy measurement channels that mimic realistic sensor outputs, enabling observer comparison.
  2. User can enable an observer layer and inspect true, measured, and estimated state.
  3. User can scrub through simulation time, inspect state at any point, and branch simulations from intermediate states.
  4. Observer-aware learning views connect estimation concepts to engineering disciplines.
**Plans**: 3 plans

Plans:
- [ ] 04.1-01: Synthetic sensor model and noisy measurement channels
- [ ] 04.1-02: Observer layer (EKF baseline) with true/measured/estimated comparison
- [ ] 04.1-03: Observer-aware learning views, timeline scrubbing, and sensitivity workflows

### Phase 5: Driver Style and Control Systems
**Goal**: Model how different driving tendencies and control choices alter performance and degradation, establish a model-based control baseline, and make the control logic legible to learners.
**Depends on**: Phase 4
**Requirements**: [CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, EDU-02, VISU-04]
**Success Criteria** (what must be TRUE):
  1. User can define at least two driver-style profiles with meaningful behavioral differences.
  2. The same scenario can be rerun under different profiles and compared directly.
  3. The policy logic remains explainable and inspectable.
  4. The system includes a model-based control baseline, ideally MPC where tractable, with visible state, constraint, and objective structure.
  5. The system can compute or approximate an optimal trajectory for the current model and circuit, and show how parameter changes alter the racing line.
  6. The system can surface controller intent and constraint activation in a way that helps a learning engineer understand the control problem.
  7. Comparative visualizations make policy differences, path choices, and control consequences intuitive to inspect.
**Plans**: 6 plans

Plans:
- [ ] 05-01: Define control-ready plant interface (segment/time-step state transition API coexisting with envelope solver)
- [ ] 05-02: Define driver-style parameterization
- [ ] 05-03: Connect style parameters to tire, pace, and energy behavior
- [ ] 05-04: Implement an explainable model-based control baseline, ideally MPC where tractable
- [ ] 05-05: Compute optimal trajectory and racing-line output from the control/optimization layer
- [ ] 05-06: Build comparative driver-style, control-intent, trajectory, and policy visualization workflows

Future extension from this phase:
- Once the control interface is stable and the simulator is calibrated, this phase becomes the launch point for RL to be compared against a serious model-based baseline rather than a dead-end heuristic layer.

### Phase 6: Data Import and Telemetry Alignment
**Goal**: Bring outside session data into the loop so simulation can be compared against reality.
**Depends on**: Phase 5
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

### Phase 8: Regulation and Design Exploration
**Goal**: Turn the validated sandbox into a design and regulation trade-study environment.
**Depends on**: Phase 7
**Requirements**: [DESN-01]
**Success Criteria** (what must be TRUE):
  1. User can compare regulation presets or design parameter changes directly.
  2. Downstream effects on pace, degradation, energy usage, and strategy are visible.
  3. The system remains modular enough to accept higher-fidelity submodels later.
**Plans**: 3 plans

Plans:
- [ ] 08-01: Build regulation and design parameter sweep workflows
- [ ] 08-02: Add comparative visualizations for downstream tradeoffs
- [ ] 08-03: Define extension points for higher-fidelity submodels

## Subsequent Milestone Direction

The current roadmap is not the full endpoint of the platform. Subsequent milestones remain in-scope for the product and should expand subsystem coverage deliberately, likely including:

- aerodynamic and active-aero refinement
- thermal and cooling dynamics
- braking, chassis, suspension, and richer setup tradeoffs
- richer environment and surface interaction models
- race-operations and multi-car interaction models
- higher-fidelity subsystem coupling once calibration supports it

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 2.1 -> 3 -> 3.1 -> 4 -> 4.1 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundations and Scenario Schema | 9/9 | Complete | 2026-03-20 |
| 2. Reduced-Order Lap Model | 3/3 | Complete | 2026-03-27 |
| 02.1. Circuit Geometry Pipeline | 1/1 | Complete | 2026-04-03 |
| 3. Tire, Electrical, Weather, Environment, and Energy Dynamics | 4/4 | Complete | 2026-04-03 |
| 3.1. Race State, Typed Artifacts, and Branchable Runs | 4/4 | Complete | 2026-04-08 |
| 4. Strategy, Race Simulation, and Explanation Surfaces | 0/4 | Not started | - |
| 4.1. Observer Layer and Synthetic Sensing | 0/3 | Not started | - |
| 5. Driver Style and Control Systems | 0/6 | Not started | - |
| 6. Data Import and Telemetry Alignment | 0/5 | Not started | - |
| 7. Calibration and Validation Workbench | 0/3 | Not started | - |
| 8. Regulation and Design Exploration | 0/3 | Not started | - |
