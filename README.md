# F1 Modeling Lab

Local-first project for understanding Formula 1 car behavior, subsystem interactions, regulation tradeoffs, and race strategy through interactive models instead of opaque black boxes.

The initial goal is not to recreate team-grade CFD or proprietary telemetry analysis. The goal is to build an explainable learning environment that lets one technically literate user explore reduced-order vehicle dynamics, electrical and energy-management behavior, driver-style differences, control-system interactions, and race strategy under non-ideal conditions, then calibrate those models against imported session data later. Over time, the platform should expand to cover the major interacting domains in F1 design and racing strategy rather than stopping at a narrow subsystem slice.

## Recommended Direction

- Start with a local web app for interaction and visualization.
- Keep the simulation core numerical and inspectable, with equations, assumptions, and uncertainty exposed.
- Treat regulation logic as configurable presets so 2026-era changes can be modeled without hard-coding one brittle interpretation.
- Build telemetry ingestion behind adapters, because official subscription features may expose timing/telemetry views without offering a stable export API.

## Suggested Architecture

- Browser UI: scenario builder, track/session controls, charts, comparisons, explanation panels, and educational subsystem views
- Simulation core: reduced-order lap, stint, tire, aerodynamic, thermal, electrical, mechanical, environment-interaction, weather, and race-operations models, introduced incrementally
- Strategy engine: pit windows, compound choices, safety-car and rain perturbations, sensitivity analysis
- Driver/control layer: style parameters plus explainable policy logic for braking, traction, energy deployment, and mode switching, with a model-based control baseline such as MPC before a later path to RL-ready policy environments
- Data adapters: CSV/JSON/parquet imports first, F1 TV Premium-compatible workflows later
- Calibration layer: compare imported data against simulated outputs and record confidence/fit quality

## First Principle

Build an interactive understanding tool first. Increase fidelity only when the added complexity improves explanation, calibration, or decision quality.

## Scope Shape

The end-state scope is broad: this platform should eventually cover the major technical and operational layers involved in F1 car design and racing strategy. The sequencing is deliberate, not comprehensive from day one. Each milestone should deepen one slice while preserving a path toward a fuller multi-domain system.

Environment interaction is part of that scope. This means more than choosing weather presets: the platform should eventually model how the car and strategy interact with ambient conditions, track evolution, grip state, surface wetness, airflow context, and other external constraints that change the problem over time.

## RL Direction

Reinforcement learning is a sensible later-stage extension, but only after the simulator is good enough to support policy learning without teaching the agent the wrong physics. The practical sequence is:

- start with explainable heuristics and parameterized driver styles
- add a model-based or optimal-control baseline, ideally MPC where the reduced-order model and compute budget support it
- add an RL-compatible environment API once state, action, reward, and constraint definitions are stable
- use RL only after calibration and domain randomization are credible enough to limit simulator overfitting

## MPC Direction

Model Predictive Control is a strong intermediate target for this project because it forces clarity about:

- state definitions
- control inputs
- constraints
- objective functions
- prediction-horizon tradeoffs

That matches the educational goals better than jumping directly to black-box learning. It also gives us a serious baseline against which future RL policies can be compared.
