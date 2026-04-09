# Phase 4: Strategy, Race Simulation, and Explanation Surfaces - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 04-strategy-race-simulation-and-explanation-surfaces
**Mode:** Auto (exploratory, --auto)
**Areas synthesized:** race simulation architecture, strategy comparison UX, explanation surface depth, engineer-role learning paths, qualifying/sprint modes, in-race intervention model, visualization library choice, sensitivity workflows

---

## Race Simulation Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Build on Phase 3.1 race-state engine | Orchestrate strategy comparison using 3.1's engine | Derived constraint |
| Build race engine in Phase 4 | Duplicate 3.1 scope | Rejected (scope violation) |

**Auto synthesis:** Phase 3.1 provides race-state engine, multi-stint plans, pit events, interruptions. Phase 4 builds comparison and explanation ON these outputs.

---

## Strategy Comparison UX

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline overlay with drill-down | High-level race timelines + stint-level detail | Working assumption |
| Tabular comparison only | Side-by-side tables | Insufficient for STRA-02 |
| Separate views per strategy | One view per strategy, manual switching | Poor for comparison |

**Auto synthesis:** Open question for research — how to present multi-strategy comparison at both overview and detail levels.

---

## Explanation Surface Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Stint-level factor decomposition | Pit loss + degradation + energy + weather per stint | Working assumption |
| Event-level attribution | Per-event causal chain | Deferred to research evaluation |
| Total delta only | Just show final time difference | Insufficient for STRA-02 |

**Auto synthesis:** Stint-level is the likely minimum; research determines whether event-level adds educational value.

---

## Engineer-Role Learning Paths

| Option | Description | Selected |
|--------|-------------|----------|
| Filtered projections (lens model) | Same data, role-specific emphasis | Working assumption |
| Separate role dashboards | Distinct views per role | More complex, deferred to research |
| No role differentiation | Generic views | Insufficient for EDU-03 |

**Auto synthesis:** Pedagogy deliberation identified strategy, race, performance engineers. Research must determine if filtered projections are sufficient.

---

## Qualifying/Sprint Modes

| Option | Description | Selected |
|--------|-------------|----------|
| Qualifying as race-engine variant | Stints = sessions, pits = compound changes | Open question for research |
| Qualifying as separate harness | Dedicated push-lap optimizer | Open question for research |
| Sprint as short race config | Same engine, shorter distance | Working assumption |

**Auto synthesis:** Sprint is likely a configuration variant. Qualifying is structurally different — research must evaluate.

---

## In-Race Intervention Model

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline events creating branch points | Interventions injected as events, produce forks | Working assumption |
| Conditional rules | If-then rules evaluated during simulation | More complex, deferred |
| Post-hoc comparison only | Run variants separately, no mid-race injection | Insufficient for STRA-04 |

**Auto synthesis:** Branch points from interventions align with Phase 3.1's run lineage. Research must evaluate interaction patterns.

---

## Visualization Library Choice

| Option | Description | Selected |
|--------|-------------|----------|
| d3 + React bindings | Maximum flexibility, steep learning curve | Open question for research |
| visx (Airbnb) | React-native d3 primitives, composable | Open question for research |
| observable Plot | Declarative, fast, less React integration | Open question for research |
| Canvas for dense traces | Performance-oriented, manual interaction | Open question for research |
| Keep hand-rolled SVG | No migration cost | Rejected by audit |

**Auto synthesis:** Audit mandates library adoption. Deliberation is a gating prerequisite. Research must evaluate candidates.

---

## Sensitivity Workflows

| Option | Description | Selected |
|--------|-------------|----------|
| Batch perturbation with overlay | Run variants, compare visually | Working assumption |
| Interactive parameter sliders | Real-time rerun on change | Deferred (race-distance runs may be slow) |

**Auto synthesis:** Batch is the practical approach at race distance. Research should evaluate which parameters are most useful to perturb.

---

## Claude's Discretion

- Internal architecture of strategy comparison data flow
- Exact component structure for explanation views
- Whether to wrap or rebuild existing hand-rolled SVG components during migration
- Naming conventions for new harness types and artifact types
- How many strategies can be compared simultaneously (2? 6? unlimited?)

## Deferred Ideas

- Observer layer and synthetic sensing (Phase 4.1)
- Driver-style parameterization (Phase 5)
- MPC and optimal trajectory (Phase 5)
- Monte Carlo ensemble analysis (v2)
- Full opponent modeling (v2)
