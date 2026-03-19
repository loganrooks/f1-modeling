# F1 Modeling Lab

Local-first project for understanding Formula 1 car behavior, regulation tradeoffs, and race strategy through interactive models instead of opaque black boxes.

The initial goal is not to recreate team-grade CFD or proprietary telemetry analysis. The goal is to build an explainable learning environment that lets one technically literate user explore reduced-order vehicle dynamics, tire and energy management, driver-style differences, and race strategy under non-ideal conditions, then calibrate those models against imported session data later.

## Recommended Direction

- Start with a local web app for interaction and visualization.
- Keep the simulation core numerical and inspectable, with equations, assumptions, and uncertainty exposed.
- Treat regulation logic as configurable presets so 2026-era changes can be modeled without hard-coding one brittle interpretation.
- Build telemetry ingestion behind adapters, because official subscription features may expose timing/telemetry views without offering a stable export API.

## Suggested Architecture

- Browser UI: scenario builder, track/session controls, charts, comparisons, explanation panels
- Simulation core: reduced-order lap, stint, tire, weather, and energy models
- Strategy engine: pit windows, compound choices, safety-car and rain perturbations, sensitivity analysis
- Driver/control layer: style parameters plus explainable policy logic for braking, traction, and energy deployment
- Data adapters: CSV/JSON/parquet imports first, F1 TV Premium-compatible workflows later
- Calibration layer: compare imported data against simulated outputs and record confidence/fit quality

## First Principle

Build an interactive understanding tool first. Increase fidelity only when the added complexity improves explanation, calibration, or decision quality.

