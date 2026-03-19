# Deliberation: Electrical Systems and Educational Scope

**Date:** 2026-03-19
**Status:** concluded
**Trigger:** User asked whether the current project plan properly covers electrical-dynamical systems and whether the product should explicitly be an educational platform for learning engineers who want to understand the control systems involved.
**Affects:** Phase 1, Phase 3, Phase 4, Phase 5, Phase 7; requirements MODL-03, CTRL-03, VAL-01; overall project positioning
**Related:**
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- informal conversation observation; no formal signal created

## Situation

The current project plan already values learning, explainability, and control-oriented thinking, and it does include a requirement for energy state and deployment effects. However, the planning documents do not yet elevate electrical-dynamical subsystems or educational/control-system understanding to first-class scope. That creates a real risk: the product could drift into a generic race-strategy simulator with an energy knob instead of becoming a teachable multi-domain systems platform.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| Conversation trigger | User explicitly wants proper modelling of electrical-dynamical systems and an educational platform for learning engineers | Yes, direct user request | informal |
| `.planning/REQUIREMENTS.md` `MODL-03`, `STRA-02`, `CTRL-03` | Current scope includes energy state, deployment effects, explainable control, and explanation-oriented outputs | Yes, read file directly | informal |
| `rg` search for `electrical`, `battery`, `inverter`, `control system`, `educational` across project docs | There is no explicit requirement for electrical subsystems as teachable modeled entities, and no dedicated educational requirements beyond generic explainability | Yes, searched relevant planning files and found the gap | informal |
| `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `README.md` | Educational intent is present implicitly through "learning," "understanding," and "explainable" language, but not yet formalized as product scope with dedicated requirements and phase coverage | Yes, corroborated by direct reads and targeted search | informal |

## Framing

The real question is not whether electrical systems should exist somewhere in the simulator. The real question is whether the project should explicitly treat electrical-dynamical systems and control-system pedagogy as first-class product scope, or leave them implicit inside generic energy and explanation features.

**Core question:** Should F1 Modeling Lab explicitly model reduced-order electrical-dynamical subsystems and define an educational/control-systems learning layer as core scope?

**Adjacent questions:**
- What electrical fidelity is enough for v1 without dragging the project into high-fidelity rabbit holes?
- Which educational surfaces belong in v1: subsystem diagrams, state traces, controller explanations, or all of them?
- How do we keep the simulator RL-ready and educational without overcomplicating Phase 1?

## Analysis

### Option A: Keep It Implicit

- **Claim:** Keep the current plan mostly as-is and let electrical/control learning remain implied by energy-state and explainability requirements.
- **Grounds:** The current documents already mention energy state, deployment, explainable control, and learning-oriented goals.
- **Warrant:** Early greenfield projects benefit from scope restraint, and the current framing may be enough to start building.
- **Rebuttal:** What is not explicit is easy to underbuild. This option risks collapsing electrical systems into a single tunable scalar and educational value into generic charts.
- **Qualifier:** Plausible, but weak.

### Option B: Make Reduced-Order Electrical Systems and Educational Surfaces First-Class

- **Claim:** Explicitly add reduced-order electrical-dynamical modelling and educational/control-system requirements, while keeping the models intentionally simplified and explainable.
- **Grounds:** The user asked for it directly; 2026-era F1 context makes energy management central; the existing project already values understanding, control, and explanation.
- **Warrant:** Explicit requirements change architecture, UI, and phase planning early enough to preserve the desired product identity without requiring full-fidelity simulation.
- **Rebuttal:** This broadens v1 and will fail if it becomes a demand for full powertrain fidelity or an academic curriculum product on day one.
- **Qualifier:** Probably the right move.

### Option C: Recenter the Whole Product as a Full Control-Systems Teaching Lab

- **Claim:** Treat the product primarily as an educational control-systems platform from day one, with subsystem block diagrams, detailed controllers, and deeper multi-domain plants as the core.
- **Grounds:** Strong match with the user's robotics background and learning goals.
- **Warrant:** If pedagogy is the main point, a teaching-lab architecture could be cleaner than a simulator-first product.
- **Rebuttal:** Too broad for current stage. It would likely delay the first useful simulator and create curriculum-design work before the underlying models are stable.
- **Qualifier:** Not yet.

## Tensions

- A generic simulator is easier to start, but it weakens the educational/control-systems value the user actually wants.
- Richer electrical-system modelling improves insight, but too much fidelity too early will stall delivery.
- Educational surfaces need to be explicit in scope, but they should explain the simulator, not become a separate content-production burden.
- RL-readiness benefits from explicit subsystem states and interfaces, which aligns with educational clarity, but both can be undermined by premature high-fidelity ambition.

## Recommendation

Adopt Option B.

**Current leaning:** Make reduced-order electrical-dynamical systems and educational/control-systems understanding explicit first-class scope, but keep fidelity intentionally bounded. Model the subsystem states, limits, and couplings that matter for understanding and control. Do not attempt full detailed plant modelling in v1.

**Open questions blocking conclusion:**
1. What minimum electrical state set belongs in v1: state-of-charge proxy, harvest/deploy flows, limiting logic, and mode switching, or more?
2. Which educational surfaces are v1-critical: state-flow visualizations, controller-intent explanations, or equation/assumption views?

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Project requirements will explicitly name electrical-dynamical modelling and educational/control-system scope instead of implying them through generic energy and explainability language | Immediate planning-doc review after this deliberation | Requirements remain limited to generic energy deployment and generic explainability |
| P2 | Phase 3 and Phase 5 planning will treat electrical states and control logic as explicit architecture concerns rather than incidental tuning knobs | When `\$gsdr-plan-phase 1` and later phase plans are written | Future plans omit explicit subsystem/state/control interfaces |
| P3 | The first UI and explanation concepts will include subsystem-state or control-intent views aimed at teaching, not only performance charts | During Phase 1 and Phase 4 planning | Educational views are absent and the product remains a pure simulator shell |

## Decision Record

**Decision:** Promote reduced-order electrical-dynamical modelling and educational/control-systems scope to explicit product requirements and roadmap coverage.
**Decided:** 2026-03-19
**Implemented via:** Planning docs update in `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, and `README.md`
**Signals addressed:** informal conversation observation

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare future requirements and phase plans against predictions P1-P3

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Requirements become explicit | Not yet evaluated | - | Pending follow-up review after planning updates |
| P2: Phase plans treat electrical/control logic explicitly | Not yet evaluated | - | Pending future phase planning |
| P3: UI plans include educational subsystem views | Not yet evaluated | - | Pending Phase 1 and Phase 4 planning |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When a user asks "is this really planned?" and the answer is "only implicitly," that is usually a design-scope gap, not a wording nit.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A

