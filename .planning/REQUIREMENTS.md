# Requirements: F1 Modeling Lab

**Defined:** 2026-03-19
**Core Value:** Make F1 design and strategy legible by coupling editable models with visual explanations of why a result changed.

## v1 Requirements

### Platform

- [ ] **PLAT-01**: User can run the application locally and open an interactive browser workspace.
  - *Motivation:* `user: wants a locally hostable interactive application`
- [ ] **PLAT-02**: User can choose a circuit, regulation preset, weather preset, and session scenario before running a model.
  - *Motivation:* `user: wants to study strategy under different regulations and non-ideal conditions`
- [ ] **PLAT-03**: User can save and reload scenario configurations and simulation runs locally.
  - *Motivation:* `user: wants to experiment and compare setups over time`
- [ ] **PLAT-04**: User can simulate qualifying sessions (Q1/Q2/Q3 with compound allocation and push-lap timing) and sprint races as distinct session modes with format-specific strategy constraints.
  - *Motivation:* `user: wants comprehensive F1 racing strategy coverage across session formats`

### Visualization

- [ ] **VISU-01**: Application provides a reusable visual workspace that can host progressively richer learning views as model fidelity grows.
  - *Motivation:* `user: wants visualization capabilities to develop in accordance with model complexity`
- [ ] **VISU-02**: User can inspect trajectories, track-map views, or racing-line style outputs when the underlying model supports them without implying unsupported precision.
  - *Motivation:* `user: wants to visualize optimal policy and racing lines`
- [ ] **VISU-03**: Visual views are explicitly tied to model assumptions, uncertainty, and subsystem context rather than presented as decorative dashboards.
  - *Motivation:* `user: wants visuals that help build intuition about models and dynamics`
- [ ] **VISU-04**: User can compare runs, policies, designs, or strategies side by side through interactive visual overlays and linked views.
  - *Motivation:* `user: wants an interactive visualizer that helps relate design and dynamics to optimal policy`
- [ ] **VISU-05**: User can scrub through simulation time, inspect subsystem state at any point, and branch simulations from intermediate states to explore alternative decisions.
  - *Motivation:* `user: wants proper visualizations and interactivity to help teach someone onboarding as different F1 racing engineers`

### Modeling

- [ ] **MODL-01**: Application provides a reduced-order lap and stint model with explicit inputs for mass, drag, downforce proxy, tire grip, power-unit behavior, and basic lateral/longitudinal force balance showing how corner speed, braking distance, and acceleration emerge from these inputs.
  - *Motivation:* `user: wants to understand the model and the modeling process itself`
- [ ] **MODL-02**: Application models tire wear and tire temperature state across laps and stints.
  - *Motivation:* `user: explicitly wants to experiment with tire wear and tire temperature`
- [ ] **MODL-03**: Application models reduced-order electrical energy state, harvesting, deployment, and limiting logic that affect lap time and straight-line performance.
  - *Motivation:* `user: wants to study battery deployment policy under the new regulations`
- [ ] **MODL-04**: Application models non-ideal conditions including ambient temperature, track temperature, rain or wetness, and dynamic weather evolution within a session (e.g., rain onset, drying track, grip buildup over laps).
  - *Motivation:* `user: wants to study non-ideal conditions rather than perfect-lap assumptions`
  - *Note:* Traffic and safety-car penalties are race-operation concerns addressed by STRA-04/STRA-05 in Phase 4, not Phase 3 weather/environment scope.

### Environment Interaction

- [ ] **ENVR-01**: Application models car-environment interaction explicitly, including grip evolution, surface state, ambient effects, and other external conditions that change vehicle and strategy behavior over time.
  - *Motivation:* `user: wants interaction with the environment represented explicitly`
- [ ] **ENVR-02**: Environment interaction is coupled into subsystem behavior rather than treated only as isolated scenario presets.
  - *Motivation:* `user: clarified that environmental interaction should be part of the full-system scope`

### Electrical and Control Systems

- [ ] **ELEC-01**: Application exposes electrical subsystem state variables and limits as inspectable model outputs instead of hiding them behind a single deployment scalar.
  - *Motivation:* `user: wants proper modelling of the electrical-dynamical systems`
- [ ] **ELEC-02**: Application links electrical subsystem state to vehicle behavior, strategy choices, and driver-policy constraints.
  - *Motivation:* `user: wants to understand the control systems involved`

### Strategy

- [ ] **STRA-01**: User can compare race strategies across compounds, stint lengths, and pit-stop timing over a full race distance.
  - *Motivation:* `user: wants to understand optimal racing strategy`
- [ ] **STRA-02**: Strategy outputs explain why one strategy outperforms another, including pit loss, degradation, thermal effects, and energy state.
  - *Motivation:* `user: wants reasons behind optimal strategy, not just rankings`
- [ ] **STRA-03**: User can run sensitivity analyses by perturbing weather, wear, incidents, or policy assumptions and comparing outcomes.
  - *Motivation:* `user: wants to experiment under changing non-ideal conditions`
- [ ] **STRA-04**: User can simulate in-race strategy interventions (mode changes, pit timing responses to rivals, tire management instructions) and see how intervention timing and information state alter race outcomes.
  - *Motivation:* `user: wants to understand interactions between drivers and the engineering team`
- [ ] **STRA-05**: User can inject race interruptions (virtual safety car, full safety car, red flag) at specified or probabilistic points in a race simulation and see how they alter optimal strategy.
  - *Motivation:* `user: wants to study general F1 racing strategy under non-ideal conditions`
- [ ] **STRA-06**: Application models pit-lane time loss including pit-entry delta, stationary service time, and pit-exit rejoin, so pit-stop timing decisions reflect realistic operational costs.
  - *Motivation:* `audit: pit-lane loss is a first-order strategy variable that was missing from requirements`
- [ ] **STRA-07**: Application tracks tire-set inventory and age across a race weekend scenario (qualifying, sprint, race), so compound allocation decisions are constrained by available sets.
  - *Motivation:* `audit: tire inventory management is a core strategy engineering workflow`
- [ ] **STRA-08**: Application models low-fidelity traffic and rejoin penalties so strategy decisions account for track-position risk (undercut/overcut windows, dirty air).
  - *Motivation:* `audit: single-car optimization without traffic is insufficient for strategy education`

### Race State and Branching

- [ ] **RACE-01**: Application supports multi-stint race plans with per-stint compound, policy, and lap count in a single scenario configuration.
  - *Motivation:* `audit: single-stint scenario contract cannot express race-level strategy`
- [ ] **RACE-02**: Run records carry parent/branch lineage so users can fork simulations from intermediate states and compare alternative decisions.
  - *Motivation:* `audit: branchable state is prerequisite for VISU-05 and strategy intervention workflows`
- [ ] **RACE-03**: Application produces typed race timeline artifacts with event-level detail (stint boundaries, pit events, interruptions, mode changes) structured for downstream UI and comparison.
  - *Motivation:* `audit: untyped generic artifacts will not scale to strategy timelines and explanation views`

### Driver and Control

- [ ] **CTRL-01**: User can define driver-style parameters that influence braking, throttle application, tire usage, traction usage, and energy spending tendencies.
  - *Motivation:* `user: wants to compare different driver styles such as Verstappen and Hamilton`
- [ ] **CTRL-02**: User can compare at least two driver profiles under the same scenario and inspect where and why their outcomes diverge.
  - *Motivation:* `user: wants to understand style-specific differences`
- [ ] **CTRL-03**: Initial driving policy logic is explainable, using heuristics or optimal-control style methods before any black-box learning approach.
  - *Motivation:* `user: wants to understand modeling and control, not just consume an opaque result`
- [ ] **CTRL-04**: Application supports a model-based control baseline, preferably MPC where tractable, with explicit state, constraint, and cost-function definitions.
  - *Motivation:* `user: MPC could be interesting and is a sensible baseline before RL`
- [ ] **CTRL-05**: Application can compute or approximate an optimal trajectory for the current model and circuit, and show how parameter changes (grip, downforce, power, regulation constraints) alter the racing line.
  - *Motivation:* `user: wants to visualize optimal policy and racing lines; wants to understand the control systems involved`

### Education and Explainability

- [ ] **EDU-01**: User can inspect subsystem-level explanations showing how mechanical, tire, electrical, aerodynamic, and driver-control states interact.
  - *Motivation:* `user: wants this to be an educational platform`
- [ ] **EDU-02**: User can view controller-intent, assumptions, and equation-level or rule-level explanations aimed at learning engineers.
  - *Motivation:* `user: wants learning engineers to understand the different control systems involved`
- [ ] **EDU-03**: The educational surface presents learning paths relevant to different F1 engineering disciplines (race engineer, strategy engineer, performance engineer, vehicle dynamics engineer, power unit engineer) showing what information each role uses and how decisions propagate through the system.
  - *Motivation:* `user: wants to teach someone looking to onboard as different F1 racing engineers`

### Estimation and Observers

- [ ] **ESTM-01**: Application supports an observer layer for estimating hidden states from noisy or partial measurements.
  - *Motivation:* `user: wants EKF and related mathematics included in the learning roadmap`
- [ ] **ESTM-02**: Application includes an EKF-style estimator as an initial teachable baseline where the modeling assumptions are appropriate.
  - *Motivation:* `user: wants to understand the mathematics behind EKF in context`
- [ ] **ESTM-03**: User can compare true simulated state, measured state, and estimated state when an observer model is enabled.
  - *Motivation:* `user: wants to understand estimation with respect to modeling and control`
- [ ] **ESTM-04**: The simulator generates noisy measurement channels that mimic realistic sensor outputs (speed, acceleration, temperatures, pressures), enabling observer comparison of true state vs. measured state vs. estimated state.
  - *Motivation:* `user: prerequisite for observer layer; creates self-contained estimation learning path before real telemetry is available`

### Data

- [ ] **DATA-01**: User can import structured lap or session data from local files.
  - *Motivation:* `user: wants future telemetry and session-data integration`
- [ ] **DATA-02**: Telemetry ingestion is adapter-based so F1 TV Premium-compatible workflows can be added later without rewriting core simulation logic.
  - *Motivation:* `user: expects future subscription-backed data access`
- [ ] **DATA-03**: Imported data can be aligned with circuit, session, lap, and scenario metadata and compared against simulation outputs.
  - *Motivation:* `user: wants data to be integrated usefully rather than merely displayed`
- [ ] **DATA-04**: Application supports import from at least one established F1 data source (such as FastF1 or OpenF1 API) as the primary real-data integration path, with adapter architecture that can accommodate additional sources.
  - *Motivation:* `user: wants ingestion of real telemetry and simulated data collection`

### Validation

- [ ] **VAL-01**: Every model module exposes assumptions, calibration status, and confidence or uncertainty information.
  - *Motivation:* `user: wants to understand the model itself and its limits`
- [ ] **VAL-02**: Every saved run records model version, parameters, and context needed for later comparison.
  - *Motivation:* `user: wants reproducible experimentation and model development`

### Design and Regulation Exploration

- [ ] **DESN-01**: User can compare regulation or car-design parameter changes and see downstream effects on lap time, tire usage, energy behavior, and strategy windows.
  - *Motivation:* `user: wants to connect car design, regulations, and race strategy`
- [ ] **DESN-02**: Core model modules are separable so higher-fidelity aero, tire, or control submodels can replace reduced-order versions later.
  - *Motivation:* `user: wants a learning system that can grow in fidelity`

## v2 Requirements

### Advanced Fidelity

- **FIDL-01**: Add surrogate aerodynamic models informed by external CFD or literature data.
- **FIDL-02**: Add richer multi-car racecraft, traffic interaction, and overtaking logic.
- **FIDL-03**: Add setup optimization workflows beyond high-level parameter sweeps.
- **FIDL-04**: Add an RL-compatible simulation environment with explicit state, action, reward, and safety-constraint interfaces for driver-policy experiments.

### Comprehensive System Coverage

- **SYSC-01**: Add aerodynamic and active-aero subsystem models that couple directly to balance, drag, downforce, and deployment strategy.
- **SYSC-02**: Add thermal and cooling subsystem models that couple tires, brakes, electrical state, ambient conditions, and pace limits.
- **SYSC-03**: Add mechanical subsystem models for braking, chassis, suspension, and setup-sensitive handling tradeoffs.
- **SYSC-04**: Add race-operations and multi-car interaction models covering traffic, overtaking constraints, pit execution, and field interruptions.
- **SYSC-05**: Add explicit subsystem sequencing and interoperability standards so new domains can be introduced without rewriting the platform core.

### Product Expansion

- **PROD-01**: Add collaborative scenario sharing or hosted deployment.
- **PROD-02**: Add richer telemetry connectors if a stable import workflow becomes available.
- **PROD-03**: Add learned driver-policy experiments once explainable baselines and calibration workflows are in place.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full CFD solver | Too costly and too slow for the first learning-oriented product |
| Exact reproduction of team telemetry pipelines | Depends on unavailable proprietary data and tooling |
| Multiplayer or team collaboration | Not core to the single-user learning loop |
| Production cloud hosting from day one | Local-first reduces complexity while models are still changing rapidly |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 1 | Pending |
| PLAT-03 | Phase 1 | Pending |
| VAL-02 | Phase 1 | Pending |
| DESN-02 | Phase 1 | Pending |
| VISU-01 | Phase 1 | Pending |
| PLAT-02 | Phase 2 | Pending |
| MODL-01 | Phase 2 | Pending |
| VISU-02 | Phase 2 | Pending |
| MODL-02 | Phase 3 | Pending |
| MODL-03 | Phase 3 | Pending |
| MODL-04 | Phase 3 | Pending |
| ENVR-01 | Phase 3 | Pending |
| ENVR-02 | Phase 3 | Pending |
| STRA-01 | Phase 4 | Pending |
| STRA-02 | Phase 4 | Pending |
| STRA-03 | Phase 4 | Pending |
| EDU-01 | Phase 4 | Pending |
| ESTM-01 | Phase 4 | Pending |
| ESTM-02 | Phase 4 | Pending |
| ESTM-03 | Phase 4 | Pending |
| VISU-03 | Phase 4 | Pending |
| CTRL-01 | Phase 5 | Pending |
| CTRL-02 | Phase 5 | Pending |
| CTRL-03 | Phase 5 | Pending |
| CTRL-04 | Phase 5 | Pending |
| EDU-02 | Phase 5 | Pending |
| VISU-04 | Phase 5 | Pending |
| DATA-01 | Phase 6 | Pending |
| DATA-02 | Phase 6 | Pending |
| DATA-03 | Phase 6 | Pending |
| VAL-01 | Phase 7 | Pending |
| DESN-01 | Phase 8 | Pending |
| ELEC-01 | Phase 3 | Pending |
| ELEC-02 | Phase 3 | Pending |
| PLAT-04 | Phase 4 | Pending |
| VISU-05 | Phase 4 | Pending |
| STRA-04 | Phase 4 | Pending |
| STRA-05 | Phase 4 | Pending |
| EDU-03 | Phase 4 | Pending |
| ESTM-04 | Phase 4 | Pending |
| CTRL-05 | Phase 5 | Pending |
| DATA-04 | Phase 6 | Pending |
| STRA-06 | Phase 3.1 | Pending |
| STRA-07 | Phase 3.1 | Pending |
| STRA-08 | Phase 3.1/4 | Pending |
| RACE-01 | Phase 3.1 | Pending |
| RACE-02 | Phase 3.1 | Pending |
| RACE-03 | Phase 3.1 | Pending |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 48
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-04-07 after cross-model audit — added STRA-06/07/08, RACE-01/02/03; refined MODL-04 scope; inserted Phase 3.1; added Phase 5 control-ready plant plan*
