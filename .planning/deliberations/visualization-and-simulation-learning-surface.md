# Deliberation: Visualization and Simulation Learning Surface

**Date:** 2026-03-19
**Status:** concluded
**Trigger:** User asked whether the recent discussion about interactive visualization, racing lines, optimal-policy visualization, and an intuition-building simulator was actually captured, and clarified that visualization capabilities should grow in step with modeling complexity rather than requiring a fully fledged visualizer immediately.
**Affects:** Phase 1, Phase 2, Phase 4, Phase 5, future milestones; requirements PLAT-01, EDU-01, EDU-02, ESTM-03, future visualization requirements
**Related:**
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/deliberations/full-system-scope-and-educational-platform.md`
- `.planning/deliberations/estimation-and-control-stack.md`
- informal conversation observation; no formal signal created

## Situation

The project docs already say the product should be interactive, visual, and educational. They mention a local web app, charts, explanation panels, educational subsystem views, sensitivity visualizations, and comparative views. What is still missing is an explicit design conclusion that the visualization layer is not a thin UI wrapper around the simulator. It is the main learning surface through which the user understands the models, sees how subsystem dynamics relate to policy, and develops intuition over time.

The user also clarified an important scoping constraint: the visualizer does not need to arrive fully formed in the first milestone. It should mature alongside the simulator. Early visualizations can be simple if they are tightly coupled to the current model and clearly explain what that model does. Later visualizations can become richer as the simulation grows to support racing-line, policy, and multi-domain interaction views.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| Conversation trigger | User wants an interactive visualizer that helps build intuition about models, dynamics, design choices, racing lines, and optimal policy, and wants it to evolve with model complexity | Yes, direct user request | informal |
| `rg` search across docs for visualization-related terms | Current docs mention interaction, charts, explanation panels, learning views, racing-strategy views, and sensitivity visualizations | Yes, searched current project docs directly | informal |
| Current roadmap structure | Visual features are distributed across several phases, but no explicit rule states that visualization is a first-class learning surface co-developed with the simulator | Yes, direct file read | informal |
| Existing deliberations | Scope and control architecture are recorded, but the visualization strategy itself is not captured as a design decision | Yes, direct file read | informal |

## Framing

The question is not whether the project has visualizations at all. It does. The real question is whether visualization should be treated as a progressive, model-coupled learning surface that grows with simulation complexity, or whether it should remain a loose collection of dashboards added wherever convenient.

**Core question:** Should F1 Modeling Lab explicitly treat visualization as a progressive educational surface that co-evolves with the simulator and exposes model, state, and policy structure as complexity grows?

**Adjacent questions:**
- Which visual primitives belong in the first milestone?
- When should racing-line and track-map views appear relative to the lap model?
- How do we keep visuals explanatory instead of merely decorative?

## Analysis

### Option A: Keep Visualization Implicit

- **Claim:** Leave visualization as whatever naturally emerges from each phase.
- **Grounds:** The roadmap already mentions charts, explanation views, and comparative visualizations.
- **Warrant:** This avoids premature UI planning before the models exist.
- **Rebuttal:** It risks producing disconnected dashboards with no coherent learning progression. The user explicitly wants intuition-building visuals, not generic outputs.
- **Qualifier:** Weak.

### Option B: Treat Visualization as a Progressive Learning Surface

- **Claim:** Explicitly define the visualizer as a core learning interface that should grow in fidelity and richness alongside the underlying simulator.
- **Grounds:** The user asked for exactly this; the educational goal depends on visuals that reveal model structure and policy consequences; the roadmap already has enough hooks to support staged growth.
- **Warrant:** A simulator that cannot make its internal structure legible will not satisfy the learning goal, even if the models are good.
- **Rebuttal:** This fails if it becomes a mandate to build a massive polished visualization suite before the models justify it.
- **Qualifier:** Strong.

### Option C: Build a Full Visualizer Up Front

- **Claim:** Front-load a rich track visualizer, racing-line renderer, and policy animation framework immediately.
- **Grounds:** A polished visual layer could make the project feel coherent early.
- **Warrant:** UI-first products sometimes benefit from early visual integration.
- **Rebuttal:** It would force speculative UI design before the model abstractions are stable and likely create rework.
- **Qualifier:** Wrong for this stage.

## Tensions

- Good educational visuals require stable model semantics, but waiting too long makes the simulator opaque.
- Racing-line and policy visualization are highly valuable, but they depend on model outputs that may not exist in the earliest phases.
- A progressive visualizer supports learning, but only if every visual element is tied to current model truth rather than imagined future fidelity.
- The visual surface should feel coherent across milestones without requiring the first milestone to solve the entire UI language.

## Recommendation

Adopt Option B.

**Current leaning:** Treat visualization as a first-class educational surface that co-evolves with simulation complexity. Phase 1 should establish reusable visual primitives and a coherent workspace. Phase 2 should add lap-model visualizations such as sensitivities, trajectories, and racing-line views where the model supports them. Later phases should add subsystem overlays, estimator/controller introspection, and policy-comparison views as those model layers become real.

**Open questions blocking conclusion:**
1. What are the minimum visual primitives for Phase 1: track map, timeseries, parameter panel, comparison card, state inspector, or some subset?
2. Which outputs are stable enough in Phase 2 to justify racing-line visualization without faking precision?

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Phase 1 planning will include explicit visualization primitives and UI architecture, not just a generic app shell | When `\$gsdr-plan-phase 1` is written | Phase 1 planning treats the frontend as a thin wrapper with no learning-oriented visual design |
| P2 | Phase 2 planning will include model-coupled visualizations such as sensitivity views, trajectories, or racing-line views where justified by model outputs | When Phase 2 is planned | Phase 2 planning contains only numeric outputs with no dedicated visual learning layer |
| P3 | Later phase plans will attach new visual views to estimator, controller, and strategy outputs as those subsystems are built | When Phases 4 and 5 are planned | New model layers appear without corresponding introspection and explanation views |

## Decision Record

**Decision:** Capture visualization as a progressive, model-coupled learning surface that should be developed in step with simulation complexity rather than as a one-shot fully fledged visualizer.
**Decided:** 2026-03-19
**Implemented via:** Deliberation record plus updates to project context, requirements, roadmap, and state
**Signals addressed:** informal conversation observation

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare phase plans and resulting UI concepts against predictions P1-P3

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Phase 1 includes visualization primitives | Not yet evaluated | - | Pending Phase 1 planning |
| P2: Phase 2 includes model-coupled trajectory or racing-line views | Not yet evaluated | - | Pending Phase 2 planning |
| P3: Later layers get matching introspection views | Not yet evaluated | - | Pending later phase planning |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When a project is explicitly about understanding, visualization strategy is architecture, not polish.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A

