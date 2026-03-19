# Deliberation: Full-System Scope and Educational Platform

**Date:** 2026-03-19
**Status:** concluded
**Trigger:** User first asked whether the current project plan properly covers electrical-dynamical systems and the educational goal, then clarified that electrical systems are only one part of a broader requirement: the platform should eventually cover everything materially involved in F1 design and racing strategy, even if it gets there gradually.
**Affects:** Phase 1, Phase 3, Phase 4, Phase 5, Phase 7, Phase 8, future milestones; requirements MODL-03, CTRL-03, VAL-01, DESN-02; overall project positioning
**Related:**
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- informal conversation observation; no formal signal created

## Situation

The current project plan already values learning, explainability, and control-oriented thinking. After the previous revision, it also makes electrical-dynamical subsystems and educational/control-system understanding explicit. The user then clarified that this still frames the product too narrowly: electrical systems matter, but they are one subsystem inside a broader ambition to eventually cover the full set of major technical and operational factors in F1 design and racing strategy. The risk is no longer underbuilding electrical systems; it is accidentally making one subsystem look like the product's ultimate identity instead of treating the platform as a staged path toward full-system coverage.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| Conversation trigger | User clarified that electrical systems are important, but the actual scope target is eventual coverage of everything materially involved in F1 design and racing strategy | Yes, direct user clarification | informal |
| Current planning docs after prior update | Electrical systems and educational views are now explicit in the project scope and roadmap | Yes, read file directly | informal |
| `rg` search for `aero`, `suspension`, `brake`, `thermal`, `multi-car`, `setup`, `pit stop`, `environment` across project docs | Broader subsystem coverage exists only partially and in scattered form; environment interaction is present but still easy to treat as passive context rather than active coupling | Yes, searched relevant planning files and found only partial coverage | informal |
| `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `README.md` | The product is still described more as a simulator with emphasized electrical/control learning than as a staged path toward comprehensive F1-system understanding | Yes, corroborated by direct reads | informal |

## Framing

The real question is not whether electrical systems matter. They do. The real question is whether the project should be framed as a staged platform that eventually covers all major F1 design and racing-strategy systems, or whether it should define itself around the current early-focus subsystems.

**Core question:** Should F1 Modeling Lab explicitly declare eventual full-system F1 coverage as product scope, while sequencing delivery through reduced-order, teachable subsystem milestones?

**Adjacent questions:**
- Which subsystems and cross-cutting interactions deserve early emphasis because they offer the highest learning leverage under current regulations?
- How do we sequence subsystem coverage without turning the project into an unbounded science project?
- Which educational surfaces belong in v1 versus later milestones?

## Analysis

### Option A: Keep the Product Broad in Spirit but Unclear in Scope

- **Claim:** Keep the current plan mostly as-is, on the theory that broad eventual scope is already obvious from context.
- **Grounds:** The docs already mention learning, strategy, design exploration, electrical systems, aero, traffic, setup, and extensibility.
- **Warrant:** Avoiding too much future-facing detail can keep the near-term roadmap focused.
- **Rebuttal:** What is only implied will drift. This option invites future planning to optimize locally around the early phases instead of against the real end-state.
- **Qualifier:** Weak.

### Option B: Declare Full-System Scope, Deliver It Gradually

- **Claim:** Explicitly define the platform as eventually covering all major F1 design and racing-strategy systems, while keeping near-term phases reduced-order, modular, and educational.
- **Grounds:** The user stated that "everything involved in F1 design and racing strategy" is in-scope eventually; the current roadmap already assumes modular growth; educational value depends on showing how subsystems couple, not on stopping at a narrow slice.
- **Warrant:** Stating the long-horizon scope now influences architecture and milestone design without forcing full fidelity immediately.
- **Rebuttal:** This fails if "everything" is interpreted as "build everything now" rather than "everything eventually, staged deliberately."
- **Qualifier:** Strong.

### Option C: Try to Model Everything Up Front

- **Claim:** Expand the immediate roadmap so every major subsystem category is planned in detail right away.
- **Grounds:** This would align the near-term plan with the eventual ambition.
- **Warrant:** Full upfront decomposition can reduce later reframing.
- **Rebuttal:** It would destroy focus, bury the learning loop, and produce speculative planning for subsystems whose abstractions are not yet stable.
- **Qualifier:** Wrong for this stage.

## Tensions

- Long-horizon comprehensiveness and near-term tractability pull in opposite directions.
- Early subsystem emphasis is necessary, but it should not redefine the platform's ultimate scope.
- Educational surfaces need to be explicit in scope, but they should explain evolving system models rather than becoming a separate curriculum product.
- RL-readiness benefits from modular state and control interfaces, which aligns with eventual full-system scope, but only if staged growth is preserved.

## Recommendation

Adopt Option B.

**Current leaning:** Explicitly declare that the platform eventually aims to cover all major F1 design and racing-strategy systems, while sequencing delivery through reduced-order, educational, modular milestones. Electrical systems remain important and early, but they are one subsystem among many rather than the platform's terminal identity.

**Open questions blocking conclusion:**
1. Which subsystem groups belong in the first two milestones versus later milestones?
2. What minimum cross-subsystem abstraction standard will let new domains be added without re-architecting the simulator?

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Project docs will explicitly state that full-system F1 coverage is the eventual platform scope, not just an implied aspiration | Immediate planning-doc review after this revision | Docs continue to frame the product as a narrow subsystem-focused simulator |
| P2 | Future phase planning will sequence subsystem families deliberately instead of treating early-phase focus areas as the full endpoint | When `\$gsdr-plan-phase 1` and later roadmap updates are written | Later plans stay anchored only to early subsystem priorities with no broader sequencing model |
| P3 | Educational views will be designed as subsystem-agnostic interfaces that can grow with added domains, not one-off visualizations for a single subsystem | During Phase 1 and Phase 4 planning | Educational UX is tightly coupled to one subsystem and does not generalize |

## Decision Record

**Decision:** Frame the product as an educational, staged platform for eventual full-system F1 design and racing-strategy coverage. Keep electrical/control systems explicit and early, but not as the sole defining scope.
**Decided:** 2026-03-19
**Implemented via:** Planning docs update in `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, and `README.md`
**Signals addressed:** informal conversation observation

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare future requirements and phase plans against predictions P1-P3

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Docs state eventual full-system scope | Not yet evaluated | - | Pending follow-up review after planning updates |
| P2: Phase planning sequences subsystem families deliberately | Not yet evaluated | - | Pending future phase planning |
| P3: Educational views are subsystem-agnostic and extensible | Not yet evaluated | - | Pending Phase 1 and Phase 4 planning |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When a user clarifies "I want everything eventually," treat that as a scope-shaping architectural constraint, not as hand-wavy aspiration.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A.
