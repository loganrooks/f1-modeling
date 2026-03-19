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

### Modeling

- [ ] **MODL-01**: Application provides a reduced-order lap and stint model with explicit inputs for mass, drag, downforce proxy, tire grip, and power-unit behavior.
  - *Motivation:* `user: wants to understand the model and the modeling process itself`
- [ ] **MODL-02**: Application models tire wear and tire temperature state across laps and stints.
  - *Motivation:* `user: explicitly wants to experiment with tire wear and tire temperature`
- [ ] **MODL-03**: Application models energy state and deployment choices that affect lap time and straight-line performance.
  - *Motivation:* `user: wants to study battery deployment policy under the new regulations`
- [ ] **MODL-04**: Application models non-ideal conditions including ambient temperature, track temperature, rain or wetness, and traffic or safety-car penalties.
  - *Motivation:* `user: wants to study non-ideal conditions rather than perfect-lap assumptions`

### Strategy

- [ ] **STRA-01**: User can compare race strategies across compounds, stint lengths, and pit-stop timing over a full race distance.
  - *Motivation:* `user: wants to understand optimal racing strategy`
- [ ] **STRA-02**: Strategy outputs explain why one strategy outperforms another, including pit loss, degradation, thermal effects, and energy state.
  - *Motivation:* `user: wants reasons behind optimal strategy, not just rankings`
- [ ] **STRA-03**: User can run sensitivity analyses by perturbing weather, wear, incidents, or policy assumptions and comparing outcomes.
  - *Motivation:* `user: wants to experiment under changing non-ideal conditions`

### Driver and Control

- [ ] **CTRL-01**: User can define driver-style parameters that influence braking, throttle application, tire usage, traction usage, and energy spending tendencies.
  - *Motivation:* `user: wants to compare different driver styles such as Verstappen and Hamilton`
- [ ] **CTRL-02**: User can compare at least two driver profiles under the same scenario and inspect where and why their outcomes diverge.
  - *Motivation:* `user: wants to understand style-specific differences`
- [ ] **CTRL-03**: Initial driving policy logic is explainable, using heuristics or optimal-control style methods before any black-box learning approach.
  - *Motivation:* `user: wants to understand modeling and control, not just consume an opaque result`

### Data

- [ ] **DATA-01**: User can import structured lap or session data from local files.
  - *Motivation:* `user: wants future telemetry and session-data integration`
- [ ] **DATA-02**: Telemetry ingestion is adapter-based so F1 TV Premium-compatible workflows can be added later without rewriting core simulation logic.
  - *Motivation:* `user: expects future subscription-backed data access`
- [ ] **DATA-03**: Imported data can be aligned with circuit, session, lap, and scenario metadata and compared against simulation outputs.
  - *Motivation:* `user: wants data to be integrated usefully rather than merely displayed`

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

### Product Expansion

- **PROD-01**: Add collaborative scenario sharing or hosted deployment.
- **PROD-02**: Add richer telemetry connectors if a stable import workflow becomes available.
- **PROD-03**: Add learned driver-policy experiments once explainable baselines are in place.

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
| PLAT-02 | Phase 2 | Pending |
| MODL-01 | Phase 2 | Pending |
| MODL-02 | Phase 3 | Pending |
| MODL-03 | Phase 3 | Pending |
| MODL-04 | Phase 3 | Pending |
| STRA-01 | Phase 4 | Pending |
| STRA-02 | Phase 4 | Pending |
| STRA-03 | Phase 4 | Pending |
| CTRL-01 | Phase 5 | Pending |
| CTRL-02 | Phase 5 | Pending |
| CTRL-03 | Phase 5 | Pending |
| DATA-01 | Phase 6 | Pending |
| DATA-02 | Phase 6 | Pending |
| DATA-03 | Phase 6 | Pending |
| VAL-01 | Phase 7 | Pending |
| DESN-01 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after initial definition*

