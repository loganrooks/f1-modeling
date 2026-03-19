# Deliberation: Estimation and Control Stack

**Date:** 2026-03-19
**Status:** concluded
**Trigger:** Conversation expanded from RL and MPC into a deeper question: what estimation and control architecture should this platform teach and implement, and how should that relate to what is publicly known versus inferred about real F1 practice?
**Affects:** Phase 1, Phase 4, Phase 5, future RL work; requirements ESTM-01, ESTM-02, ESTM-03, CTRL-03, CTRL-04, FIDL-04
**Related:**
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/deliberations/full-system-scope-and-educational-platform.md`
- informal conversation observation; no formal signal created

## Situation

The roadmap now explicitly includes observer methods, EKF-style estimation, environment coupling, MPC as the preferred control baseline, and RL as a later extension. What is still missing from the project record is the architectural claim connecting those pieces into a single control-and-learning stack. Without that, the roadmap captures features but not the reasoning that orders them.

The recent discussion also surfaced an important realism constraint: public evidence supports MPC and optimal control in autonomous racing generally, and strongly suggests sophisticated estimation, simulation, and optimization in Formula One, but there is no public basis to assume current F1 race cars are autonomously driven by onboard MPC. For this project, that means the educational control stack should be modeled after plausible engineering structure, not after a fictional fully autonomous F1 race car.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| Current docs after recent updates | Observer work, EKF, MPC, and later RL are all now present in requirements and roadmap | Yes, direct file read and `rg` search | informal |
| Existing deliberation `full-system-scope-and-educational-platform.md` | Current deliberation handles product scope, but not the control/estimation architecture as its own design conclusion | Yes, direct file read | informal |
| Conversation | We discussed EKF as state estimation, MPC as a serious model-based baseline, and RL as later-stage policy learning once the simulator is credible | Yes, direct conversation record | informal |
| Public motorsport/control discussion summarized in conversation | Public evidence supports MPC/optimal control in autonomous racing and strategy/energy optimization, but not a documented claim that modern F1 race cars are autonomously driven using MPC | Yes, grounded in the sources reviewed during discussion; inference clearly separated from public fact | informal |

## Framing

The core question is not "should we include EKF or MPC?" We already have. The real question is whether the platform should explicitly teach a layered estimation-and-control architecture, and whether RL should be framed as a later comparator on top of that architecture rather than as the first serious policy method.

**Core question:** Should F1 Modeling Lab explicitly adopt an estimation-first, model-based-control-second, RL-later architecture for both implementation and pedagogy?

**Adjacent questions:**
- Which hidden states should the first observer estimate?
- Which reduced-order model is good enough for an initial MPC baseline?
- Where does strategy optimization sit relative to observer and control layers?

## Analysis

### Option A: Treat EKF, MPC, and RL as Independent Features

- **Claim:** Keep estimator work, MPC work, and RL work as separate roadmap items without defining a unifying stack.
- **Grounds:** The roadmap already contains all three themes.
- **Warrant:** Avoids premature architectural overcommitment.
- **Rebuttal:** This weakens pedagogy and makes it easier for implementation to become incoherent. The user wants to understand how estimation, control, and policy relate, not just see disconnected modules.
- **Qualifier:** Weak.

### Option B: Adopt an Explicit Layered Stack

- **Claim:** Define the architecture and teaching sequence as: simulator and sensor model -> observer/estimator -> model-based control baseline -> later RL comparator.
- **Grounds:** This matches the recent discussion, keeps the project explainable, and aligns with what is plausible in real motorsport engineering practice.
- **Warrant:** Estimation should precede control when hidden state matters; model-based control should precede RL when we want interpretable engineering baselines.
- **Rebuttal:** This can become rigid if we pretend one estimator or one controller is universally correct. The stack should remain extensible.
- **Qualifier:** Strong.

### Option C: Jump Directly to RL-Centric Policy Design

- **Claim:** Treat RL as the main control architecture and use estimation/model-based control only as optional references.
- **Grounds:** RL is flexible and attractive for complex nonlinear systems.
- **Warrant:** A sufficiently rich simulator could in principle support this.
- **Rebuttal:** It undermines the educational value, removes strong baselines, and risks learning simulator artifacts before the simulator is trustworthy.
- **Qualifier:** Wrong for this project.

## Tensions

- Strong architectural sequencing improves clarity, but too much rigidity could block experimentation.
- Real F1 practice is only partially public, so we must separate documented fact from inference.
- Pedagogical clarity favors EKF -> MPC -> RL, but implementation reality may sometimes justify heuristics before MPC in narrow slices.
- The observer and controller should be explicit enough to teach, but not so heavyweight that Phase 1 collapses under abstraction work.

## Recommendation

Adopt Option B.

**Current leaning:** The platform should explicitly teach and implement a layered stack:

1. plant and sensor model
2. observer/state estimation, with EKF-style estimation as the first teachable baseline where appropriate
3. model-based control baseline, ideally MPC where tractable
4. strategy optimization and supervisory logic above the control layer
5. RL later, as a comparator or extension rather than the first serious policy method

**Open questions blocking conclusion:**
1. Which subsystems should expose estimated hidden state first: tire/grip, electrical state, thermal state, or all of them?
2. Which controller objective and constraints are educationally richest for the first MPC baseline?

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Phase 1 planning will define data structures and interfaces for true state, measured state, and estimated state separately | When `\$gsdr-plan-phase 1` is written | Phase 1 planning treats state as a single flat simulation object with no observer boundary |
| P2 | Phase 5 planning will frame MPC as the primary serious control baseline and RL as later comparison work | When Phase 5 is planned | Phase 5 planning centers RL first or omits a clear model-based baseline |
| P3 | Educational views will show estimator/controller interaction, not just raw performance outputs | During Phase 4 and Phase 5 planning | UI plans focus only on lap time and strategy charts with no observer/control introspection |

## Decision Record

**Decision:** Capture a layered estimation-and-control architecture explicitly in the project record: observer first, model-based control second, RL later.
**Decided:** 2026-03-19
**Implemented via:** Deliberation record plus existing requirements/roadmap updates; future Phase 1 planning should operationalize it
**Signals addressed:** informal conversation observation

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare future phase plans and UI concepts against predictions P1-P3

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Phase 1 separates true/measured/estimated state | Not yet evaluated | - | Pending Phase 1 planning |
| P2: Phase 5 centers MPC before RL | Not yet evaluated | - | Pending Phase 5 planning |
| P3: UI shows estimator/controller interaction | Not yet evaluated | - | Pending Phase 4 and 5 planning |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When roadmap items accumulate around one technical theme, a separate architectural deliberation is useful even if the features are already present. Otherwise the reasoning stays trapped in chat.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A

