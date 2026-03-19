# F1 Modeling Lab

## What This Is

F1 Modeling Lab is a local-first interactive environment for learning how Formula 1 car design, electrical and control systems, race strategy, regulations, and driver behavior interact. It is being built for a technically strong solo user who wants to understand the models themselves, experiment with non-ideal conditions, and later calibrate those models against imported session data and telemetry-like data.

## Core Value

Make F1 design and strategy legible by coupling editable models with visual explanations of why a result changed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Explore lap, stint, and race behavior with interactive reduced-order models instead of opaque outputs.
- [ ] Understand how tire state, weather, energy deployment, and regulation constraints change the optimal strategy.
- [ ] Compare driver-style and control-policy assumptions in a way that is explainable and inspectable.
- [ ] Explicitly model electrical-dynamical subsystems and control constraints as teachable parts of the simulator, not just hidden parameters.
- [ ] Prepare for future import of F1 TV Premium session data or other structured racing data through adapters.
- [ ] Preserve a path to higher fidelity without forcing CFD-grade complexity into the first release.
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

The scope is intentionally broader than a race-strategy calculator. It needs to connect:

- car-design abstractions such as drag, downforce, mass, and power-unit behavior
- track and environmental conditions such as ambient temperature, track temperature, rain, and grip evolution
- strategy decisions such as compound selection, pit timing, and energy deployment
- electrical and control subsystems such as energy storage, harvesting, deployment, mode switching, and limiting logic
- driver-style differences such as braking aggression, traction usage, tire preservation, and deployment choices
- educational interfaces that reveal subsystem states, couplings, and controller intent
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
| Defer RL policy optimization until after explainable control baselines and simulator calibration exist | RL without a credible environment will optimize simulator artifacts instead of useful driving behavior | — Pending |
| Promote electrical-dynamical modelling and educational/control-system understanding to first-class scope | The project should teach subsystem interactions explicitly, not only simulate outputs | — Pending |

## Open Questions

| Question | Why It Matters | Criticality | Status |
|----------|----------------|-------------|--------|
| What data format(s) will be realistically obtainable from F1 TV Premium or companion tooling? | Determines ingestion interfaces, legal boundaries, and calibration workflow | Critical | Pending |
| Which modeling stack should own the simulation core first: Python service, shared library, or in-browser compute? | Affects developer velocity, numerical tooling, and future performance work | Medium | Pending |
| What is the first acceptable fidelity target for lap-time and stint modeling? | Prevents overbuilding before there is a usable learning loop | Critical | Pending |
| What reduced-order electrical state set belongs in v1? | Determines whether electrical modelling is meaningful without exploding scope | Critical | Pending |
| How should driver style be parameterized before introducing learned policies? | Shapes the control layer and determines whether outputs remain interpretable | Medium | Pending |
| What state, action, reward, and safety-constraint interfaces would an eventual RL environment need? | Determines whether early simulator architecture can support later policy optimization without major rewrites | Medium | Pending |
| Which educational surfaces matter most in v1: state-flow views, controller explanations, or equation/assumption panels? | Prevents the educational goal from staying vague and underbuilt | Medium | Pending |
| Which circuits and sessions should serve as the first calibration baseline? | Needed for model validation once data import starts | Medium | Pending |

---
*Last updated: 2026-03-19 after deliberation on electrical systems and educational scope*
