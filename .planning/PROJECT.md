# F1 Modeling Lab

## What This Is

F1 Modeling Lab is a local-first interactive environment for learning how Formula 1 car design, race strategy, regulations, driver behavior, and the major interacting subsystems of the car and race environment fit together. It is being built for a technically strong solo user who wants to understand the models themselves, experiment with non-ideal conditions, and later calibrate those models against imported session data and telemetry-like data.

## Core Value

Make F1 design and strategy legible by coupling editable models with visual explanations of why a result changed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Explore lap, stint, and race behavior with interactive reduced-order models instead of opaque outputs.
- [ ] Understand how tire state, weather, energy deployment, and regulation constraints change the optimal strategy.
- [ ] Compare driver-style and control-policy assumptions in a way that is explainable and inspectable.
- [ ] Treat every major subsystem involved in F1 design and race strategy as eventual in-scope platform coverage, even though delivery will be staged.
- [ ] Model early subsystems, including electrical-dynamical behavior and control constraints, as teachable parts of the simulator rather than hidden parameters.
- [ ] Explicitly model car-environment interaction as a coupled system, not just as fixed background presets.
- [ ] Prepare for future import of F1 TV Premium session data or other structured racing data through adapters.
- [ ] Preserve a path to higher fidelity without forcing CFD-grade complexity into the first release.
- [ ] Preserve a path to model-based control baselines such as MPC before learned policies become central.
- [ ] Leave a clean path for later RL-based driver-policy experiments once the simulation environment is trustworthy enough.
- [ ] Make the product an educational platform for learning engineers by exposing subsystem states, couplings, assumptions, and controller intent.

### Out of Scope

- Full CFD or wind-tunnel-grade aerodynamic simulation — far too expensive and not required to build intuition first.
- Exact replication of proprietary team performance — unavailable without private telemetry, setup, and simulation data.
- Multi-user cloud platform or shared collaboration features — local-first single-user workflow is the right initial scope.
- End-to-end autonomous racecraft AI against the full field — defer until simpler strategy and control models are validated.

## Context

The project starts greenfield. The intended user is new to Formula 1 engineering analysis but has a robotics engineering background, which makes numerical modeling, control, state estimation, and data pipelines natural entry points. The desired learning loop is:

1. Form a model of car, tire, weather, energy, and strategy behavior.
2. Visualize why the model predicts a given outcome.
3. Perturb assumptions and compare policies.
4. Import real-world session data later and calibrate or challenge the model.

The scope is intentionally broader than a race-strategy calculator. It needs to connect, and eventually cover in more depth:

- aerodynamic behavior, drag, downforce, and active-aero effects
- mechanical and handling abstractions such as mass, load transfer, braking, and setup-sensitive behavior
- tire, thermal, environmental, and surface-interaction states
- electrical and power-unit behavior, energy storage, harvesting, deployment, and limiting logic
- track and environmental conditions such as ambient temperature, track temperature, rain, grip evolution, surface wetness, and other external constraints on car behavior
- strategy decisions such as compound selection, pit timing, race interruptions, and energy deployment
- race-operation effects such as traffic, pit loss, safety-car states, and multi-car interactions
- driver-style differences such as braking aggression, traction usage, tire preservation, and deployment choices
- educational interfaces that reveal subsystem states, couplings, and controller intent
- model-based control workflows such as constrained optimal control or MPC before learned policies
- future policy-learning workflows such as RL once environment fidelity and calibration justify them
- validation workflows once outside data becomes available

Official context captured during initialization:

- FIA's published 2026 Formula 1 direction emphasizes active aerodynamics and a much larger electrical-energy contribution, which makes aero-mode switching and deployment strategy first-class modeling concerns.
- Formula 1's official F1 TV product advertises live timing with telemetry and tyre usage views, but no official export API was identified during initialization research, so future import should assume file-based or adapter-based ingestion rather than direct platform coupling.

## Constraints

- **Product scope**: Local-first and single-user — the first release should run on one machine without cloud dependencies.
- **Modeling strategy**: Start with reduced-order and explainable models — useful insight matters more than false precision.
- **Computation**: Must remain practical on consumer hardware — heavy simulations should be approximated, cached, or deferred.
- **Data access**: Assume only public data or personally accessible subscription views at first — do not depend on proprietary team telemetry.
- **Tooling**: Project planning is being run under Codex — quality profile intent must be made explicit because shared GSD defaults are still Claude-labeled.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with a local-first web application backed by a numerical simulation core | Gives interactive visualization while keeping heavier modeling logic in a maintainable compute layer | — Pending |
| Use reduced-order, explainable models before any high-fidelity aero or full-vehicle simulation | Faster path to understanding, iteration, and calibration | — Pending |
| Treat regulation logic as configurable presets instead of hard-coded constants | New-rule exploration is central to the project and regulations evolve | — Pending |
| Build telemetry ingestion behind adapters | Official platform capabilities may change and stable export paths may be limited | — Pending |
| Interpret `quality` for this repo as a Codex-native GPT-5.4 profile | Shared GSD tooling still uses Claude-era labels, but the intended planning quality here is explicit | — Pending |
| Use model-based control baselines, ideally MPC where tractable, before relying on RL for driver policy optimization | MPC is explainable, constraint-aware, and a better intermediate baseline for this educational platform | — Pending |
| Defer RL policy optimization until after explainable control baselines and simulator calibration exist | RL without a credible environment will optimize simulator artifacts instead of useful driving behavior | — Pending |
| Eventual platform scope is comprehensive across major F1 design and strategy systems, but delivery is staged by subsystem family | We need architecture and roadmap decisions that preserve the long-horizon end-state without trying to build everything immediately | — Pending |

## Open Questions

| Question | Why It Matters | Criticality | Status |
|----------|----------------|-------------|--------|
| What data format(s) will be realistically obtainable from F1 TV Premium or companion tooling? | Determines ingestion interfaces, legal boundaries, and calibration workflow | Critical | Pending |
| Which modeling stack should own the simulation core first: Python service, shared library, or in-browser compute? | Affects developer velocity, numerical tooling, and future performance work | Medium | Pending |
| What is the first acceptable fidelity target for lap-time and stint modeling? | Prevents overbuilding before there is a usable learning loop | Critical | Pending |
| What reduced-order electrical state set belongs in v1? | Determines whether electrical modelling is meaningful without exploding scope | Critical | Pending |
| What environment-interaction abstractions belong in v1 beyond simple weather presets? | Determines whether the simulator captures real car-environment coupling instead of treating the environment as static scenery | Critical | Pending |
| What reduced-order plant model and solver stack are sufficient for an initial MPC baseline? | Determines whether the control layer can be both educational and computationally practical | Critical | Pending |
| How should subsystem families be sequenced across milestones after the initial roadmap? | Keeps the project broad in ambition without losing focus in execution | Critical | Pending |
| How should driver style be parameterized before introducing learned policies? | Shapes the control layer and determines whether outputs remain interpretable | Medium | Pending |
| What state, action, reward, and safety-constraint interfaces would an eventual RL environment need? | Determines whether early simulator architecture can support later policy optimization without major rewrites | Medium | Pending |
| Which educational surfaces matter most in v1: state-flow views, controller explanations, or equation/assumption panels? | Prevents the educational goal from staying vague and underbuilt | Medium | Pending |
| Which circuits and sessions should serve as the first calibration baseline? | Needed for model validation once data import starts | Medium | Pending |

---
*Last updated: 2026-03-19 after incorporating MPC as the preferred control baseline before RL*
