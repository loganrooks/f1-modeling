---
phase: "01"
name: "Foundations and Scenario Schema"
created: 2026-03-19
---

# Phase 1: Foundations and Scenario Schema - Context

**Gathered:** 2026-03-19
**Status:** Ready for research and planning
**Mode:** Auto-generated from prior project discussion and deliberations

<domain>
## Phase Boundary

Establish the first local-first application shell, scenario schema, regulation preset structure, run-record contract, and reusable visualization primitives for the learning workspace.

This phase is about foundations, not fidelity. It must create a stable home for later lap models, subsystem dynamics, estimation, control, telemetry import, calibration, and regulation/design exploration without pretending those capabilities already exist.

Within this phase, the discussion clarifies how the foundation should be shaped so later modeling and educational work can succeed. It does not expand scope into lap modeling, MPC, EKF, RL, telemetry ingestion, or high-fidelity subsystem simulation.

</domain>

<decisions>
## Implementation Decisions

### Product shape for Phase 1
- Build a local-first browser workspace backed by a numerical simulation-oriented core rather than a notebook-only or CLI-only tool.
- The first user experience should feel like an interactive engineering workbench, not a static dashboard and not a polished marketing UI.
- Phase 1 should optimize for inspectability, schema clarity, and extensibility rather than visual completeness or model fidelity.

### Scenario and run-record boundary
- The phase must separate at least three concepts cleanly:
  - scenario definition
  - regulation preset and environment preset selection
  - run record and reproducibility metadata
- Scenario schema must already leave room for later subsystem-family expansion, including driver profiles, model assumptions, stochastic seeds, observer/controller settings, and imported-data alignment metadata.
- Run records must be versioned and explicit enough that a future user can understand what was run, under which assumptions, and with which model version.
- Local persistence should be human-inspectable and easy to diff; the architecture should not hide core scenario or run metadata behind opaque storage.

### Visualization and workspace principles
- Visualization is a first-class learning surface, not later polish and not a thin wrapper over the simulator.
- Phase 1 should establish reusable primitives and layout patterns that later models can plug into without redesigning the whole workspace.
- Visuals must remain honest to model support. Phase 1 should not imply trajectory fidelity, racing-line fidelity, or controller fidelity that does not yet exist.
- The initial workspace should support side-by-side comparison and inspection patterns early, even if the first views are simple.

### Architectural stance for later modeling
- The foundation must preserve a clear path to the layered stack already discussed:
  - plant and sensor model
  - observer/state estimation
  - model-based control baseline
  - later RL comparison or extension
- Phase 1 does not need to implement those layers, but it should avoid a flat architecture that would make them awkward later.
- Scenario and run schemas should leave room to distinguish true state, measured state, estimated state, and policy/controller configuration later.

### Regulation and extensibility stance
- Regulation logic should be represented through configurable presets, not scattered hard-coded constants.
- The foundation should assume regulations evolve and model assumptions will be revised, so preset structures need explicit provenance and versionability.
- Module boundaries should support later replacement of reduced-order submodels with richer ones without rewriting the whole application.

### Epistemic rigor and design-process guardrails
- Prefer explicit assumptions over implied precision.
- Separate documented fact, engineering inference, and placeholder assumption whenever a model or preset is defined.
- Do not build UI views that imply confidence the underlying model does not justify.
- Do not overfit early architecture to unknown telemetry workflows or speculative F1 TV access patterns.
- Preserve calibration hooks and assumption traceability from the start, even before real data import exists.
- Favor reversible decisions in Phase 1. Lock interfaces and contracts only where later phases clearly depend on them.

### Research and planning focus
- Research should prioritize decisions that reduce future rework rather than decisions that merely optimize the first demo.
- Planning should produce a foundation that is friendly to:
  - numerical modeling iteration
  - reusable educational visual surfaces
  - local persistence and reproducibility
  - later subsystem expansion
  - later estimator and controller integration
- Research and planning should explicitly examine where honesty constraints matter, especially for track, trajectory, racing-line, and policy-oriented views.

### Claude's Discretion
- Exact frontend framework and app-shell library choices, as long as they support a local-first interactive workspace cleanly.
- Exact styling language, typography, and component structure, as long as the result feels like an engineering workbench and not generic dashboard boilerplate.
- Exact local persistence mechanism, as long as saved scenarios and run records remain inspectable and reproducible.
- Exact internal naming and module layout, as long as scenario definition, presets, run records, visualization primitives, and future model layers stay separable.

</decisions>

<specifics>
## Specific Ideas

- The first workspace should make it obvious what is editable, what is assumed, what is saved, and what was produced by a run.
- Good early primitives likely include some subset of:
  - structured scenario editor
  - preset selector
  - comparison card or run summary panel
  - state or parameter inspector
  - time-series or scalar-trace visualization surface
  - assumption or equation panel
  - track-context placeholder surface that can mature later
- The initial product should feel comfortable to a robotics or controls-minded learner: explicit state, explicit assumptions, explicit outputs.
- The UI should support learning by comparison, not only single-run inspection.

</specifics>

<research_questions>
## Research Questions for Downstream Agents

### Foundation architecture
- What application architecture best supports a local-first interactive workbench with a numerical core that can grow in complexity without forcing an early client/server split?
- Which module boundaries should be established now so later lap models, subsystem models, observer methods, controller logic, and data adapters can plug in cleanly?

### Scenario and persistence contracts
- What is the minimum scenario schema that satisfies Phase 1 while leaving clean extension points for later subsystem families and control-estimation layers?
- What run-record metadata is mandatory for reproducibility, comparison, and later calibration?
- Should scenarios, presets, and run records share one schema family or several related documents?

### Visualization primitives
- Which reusable visual primitives belong in Phase 1 versus later phases?
- What is the minimum honest track-context or geometry surface that helps later visualization work without faking racing-line support?
- How should the workspace support side-by-side comparison from the start?

### Educational and epistemic UX
- How should the UI surface assumptions, uncertainty, provenance, and model-version information without becoming cluttered?
- What patterns best distinguish editable inputs, observed outputs, and later estimated or controlled state?
- How should Phase 1 communicate "foundation only" without feeling empty or unfinished?

### Regulation and preset modeling
- How should regulation presets be structured so 2026-style rule changes and future reinterpretations are manageable?
- Which preset categories belong in Phase 1: regulation, session, weather/environment, driver placeholder, or some other decomposition?

### Risk reduction
- Which choices made in Phase 1 are hardest to undo later and therefore deserve explicit research before planning locks them?
- Which tempting abstractions should be avoided because they are too speculative before Phase 2 and Phase 3 models exist?

</research_questions>

<planning_guardrails>
## Planning Guardrails

- Keep the phase focused on foundations. Do not smuggle lap modeling, estimation algorithms, control solvers, telemetry pipelines, or RL environments into Phase 1 execution.
- Require each plan in this phase to improve one of the following: local usability, schema stability, reproducibility, extensibility, or educational legibility.
- Favor plan outputs that create durable interfaces and reusable primitives rather than one-off demos.
- Any visual surface introduced in this phase should be reusable by at least one later phase.
- Any schema introduced in this phase should be easy to version and migrate.
- If a design choice depends on unavailable telemetry details or future subsystem equations, choose the most honest placeholder contract and document the assumption explicitly.

</planning_guardrails>

<deferred>
## Deferred Ideas

- Actual lap-time and stint modeling belong to Phase 2 and later.
- Tire, electrical, weather, and environment-coupling dynamics belong to Phase 3.
- Observer methods including EKF-style estimation belong to Phase 4.
- MPC and other control-policy work belong to Phase 5.
- RL policy optimization is a later extension after control baselines and simulator credibility exist.
- Telemetry ingestion, session-data alignment, and calibration work belong to Phases 6 and 7.
- Rich racing-line, policy animation, and controller-introspection visualizations should arrive only when the model semantics justify them.

</deferred>

---

*Phase: 01-foundations-and-scenario-schema*
*Context gathered: 2026-03-19*
