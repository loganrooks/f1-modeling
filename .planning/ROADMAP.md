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
- [ ] **Phase 4: Strategy, Estimation, Explanations, and Learning Views** - Compare stints, compounds, and pit timing with explainable subsystem-oriented output and initial observer methods.
- [ ] **Phase 5: Driver Style and Control Systems** - Model driver tendencies and explainable control-system tradeoffs.
- [ ] **Phase 6: Data Import and Telemetry Alignment** - Ingest structured session data and compare it to simulation results.
- [ ] **Phase 7: Calibration and Validation Workbench** - Measure confidence, calibrate parameters, and surface model limits.
- [ ] **Phase 8: Regulation and Design Exploration** - Turn the system into a real sandbox for regulation and design trade studies.

## Phase Details

### Phase 1: Foundations and Scenario Schema
**Goal**: Establish a local-first application skeleton, scenario schema, regulation presets, and run-history tracking so later models have a stable home.
**Depends on**: Nothing (first phase)
**Requirements**: [PLAT-01, PLAT-03, VAL-02, DESN-02]
**Success Criteria** (what must be TRUE):
  1. User can start the application locally and reach an initial interactive workspace.
  2. User can define a scenario with circuit, session type, regulation preset, weather preset, and driver profile placeholders.
  3. Each run stores enough metadata to reproduce or compare it later, and the architecture leaves room for educational subsystem views and later subsystem-family expansion.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Scaffold the local-first app architecture and repository layout
- [ ] 01-02: Define scenario, regulation, and run-record schemas
- [ ] 01-03: Build the first workspace and local persistence path

### Phase 2: Reduced-Order Lap Model
**Goal**: Deliver the first transparent lap model with editable vehicle and circuit parameters.
**Depends on**: Phase 1
**Requirements**: [PLAT-02, MODL-01]
**Success Criteria** (what must be TRUE):
  1. User can choose a circuit, regulation preset, and baseline car parameters before a run.
  2. The system produces a lap estimate with visible intermediate factors rather than only a final score.
  3. Parameter changes show which parts of the model caused the output shift.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Implement baseline vehicle and circuit abstractions
- [ ] 02-02: Build the reduced-order lap-time model and intermediate state outputs
- [ ] 02-03: Visualize sensitivities and parameter impacts

### Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics
**Goal**: Add the main non-ideal dynamics, reduced-order electrical subsystem behavior, and explicit car-environment coupling that shape stint evolution and regulation-era tradeoffs.
**Depends on**: Phase 2
**Requirements**: [MODL-02, MODL-03, MODL-04, ELEC-01, ELEC-02, ENVR-01, ENVR-02]
**Success Criteria** (what must be TRUE):
  1. Tire wear and temperature evolve over laps and affect pace.
  2. Electrical energy, harvesting, deployment, and limiting logic affect performance and can be inspected as subsystem states.
  3. Weather and grip conditions can degrade or improve performance in scenario-dependent ways.
  4. Electrical state is visibly linked to strategy windows and policy constraints rather than treated as a hidden scalar.
  5. Environment interaction is modeled as a coupling that influences multiple subsystems, not just as static scenario metadata.
**Plans**: 4 plans

Plans:
- [ ] 03-01: Implement tire state and degradation models
- [ ] 03-02: Implement reduced-order electrical state, harvesting, and deployment effects
- [ ] 03-03: Add weather, track temperature, surface, and environment-coupling dynamics
- [ ] 03-04: Validate cross-subsystem interactions inside the simulation pipeline

### Phase 4: Strategy, Estimation, Explanations, and Learning Views
**Goal**: Turn the simulation into a race-strategy analysis tool that explains outcomes, introduces observer methods, and teaches subsystem interactions.
**Depends on**: Phase 3
**Requirements**: [STRA-01, STRA-02, STRA-03, EDU-01, ESTM-01, ESTM-02, ESTM-03]
**Success Criteria** (what must be TRUE):
  1. User can compare multiple pit and compound strategies across a race distance.
  2. Outputs explain why a strategy wins or loses with stint-level and event-level detail.
  3. User can inspect subsystem-level views showing how tires, electrical state, weather, and policy interact.
  4. User can enable an observer layer and inspect true, measured, and estimated state for selected subsystems.
  5. User can perturb assumptions and rerun sensitivity studies quickly.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Implement race-distance and pit-strategy simulation
- [ ] 04-02: Build explanation views for stint deltas and pit-window logic
- [ ] 04-03: Add observer-aware learning views and sensitivity-analysis workflows

### Phase 5: Driver Style and Control Systems
**Goal**: Model how different driving tendencies and control choices alter performance and degradation, establish a model-based control baseline, and make the control logic legible to learners.
**Depends on**: Phase 4
**Requirements**: [CTRL-01, CTRL-02, CTRL-03, CTRL-04, EDU-02]
**Success Criteria** (what must be TRUE):
  1. User can define at least two driver-style profiles with meaningful behavioral differences.
  2. The same scenario can be rerun under different profiles and compared directly.
  3. The policy logic remains explainable and inspectable.
  4. The system includes a model-based control baseline, ideally MPC where tractable, with visible state, constraint, and objective structure.
  5. The system can surface controller intent and constraint activation in a way that helps a learning engineer understand the control problem.
**Plans**: 4 plans

Plans:
- [ ] 05-01: Define driver-style parameterization
- [ ] 05-02: Connect style parameters to tire, pace, and energy behavior
- [ ] 05-03: Implement an explainable model-based control baseline, ideally MPC where tractable
- [ ] 05-04: Build comparative driver-style and control-intent visualizations

Future extension from this phase:
- Once the control interface is stable and the simulator is calibrated, this phase becomes the launch point for RL to be compared against a serious model-based baseline rather than a dead-end heuristic layer.

### Phase 6: Data Import and Telemetry Alignment
**Goal**: Bring outside session data into the loop so simulation can be compared against reality.
**Depends on**: Phase 5
**Requirements**: [DATA-01, DATA-02, DATA-03]
**Success Criteria** (what must be TRUE):
  1. User can import structured local data files into a stable session schema.
  2. Import logic is adapter-based and does not contaminate core simulation code.
  3. Imported and simulated data can be overlaid and compared in the same workspace.
**Plans**: 4 plans

Plans:
- [ ] 06-01: Define the data-ingestion contract and adapter interface
- [ ] 06-02: Implement baseline CSV or JSON importers
- [ ] 06-03: Align imported data with scenario and circuit metadata
- [ ] 06-04: Build comparison overlays between imported and simulated outputs

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
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundations and Scenario Schema | 0/3 | Not started | - |
| 2. Reduced-Order Lap Model | 0/3 | Not started | - |
| 3. Tire, Electrical, Weather, Environment, and Energy Dynamics | 0/4 | Not started | - |
| 4. Strategy, Estimation, Explanations, and Learning Views | 0/3 | Not started | - |
| 5. Driver Style and Control Systems | 0/4 | Not started | - |
| 6. Data Import and Telemetry Alignment | 0/4 | Not started | - |
| 7. Calibration and Validation Workbench | 0/3 | Not started | - |
| 8. Regulation and Design Exploration | 0/3 | Not started | - |
