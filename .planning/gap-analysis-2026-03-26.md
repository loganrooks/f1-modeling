# Roadmap & Requirements Gap Analysis

**Date:** 2026-03-26
**Context:** Comprehensive review of PROJECT.md, REQUIREMENTS.md, ROADMAP.md, all three deliberations, STATE.md, Phase 2 context, and current codebase structure against the following concerns: complex modelling, weather modelling, car dynamics, energy management, optimal race path policy, tire management, F1 racing strategy and car design principles, driver–engineering team interaction, simulated data collection, telemetry ingestion, visualization and interactivity for teaching F1 engineering roles, and remote development accessibility.

## Documents Reviewed

| Document | Summary |
|----------|---------|
| PROJECT.md | Core value, requirements, constraints, decisions, open questions |
| REQUIREMENTS.md | 34 v1 requirements mapped to 8 phases, plus v2 requirements |
| ROADMAP.md | 8-phase milestone with plan counts and success criteria |
| STATE.md | Phase 1 complete (9/9), Phase 2 next, decisions and blockers |
| 02-CONTEXT.md | Phase 2 discussion: reduced-order lap model, circuit format, visualization honesty |
| estimation-and-control-stack.md | Deliberation: EKF → MPC → RL layered architecture |
| full-system-scope-and-educational-platform.md | Deliberation: eventual full-system F1 coverage, staged delivery |
| visualization-and-simulation-learning-surface.md | Deliberation: visualization as progressive educational surface |
| Codebase | Monorepo with apps/web (Vite+React), apps/local-api (Fastify), packages/{domain,sim-core,visuals} |

---

## Part 1: Immediate — Remote Development Access

### Problem

Both servers are bound to `127.0.0.1`:

- **Vite dev server**: `apps/web/vite.config.ts` → `host: '127.0.0.1', port: 5173`
- **Fastify API**: `apps/local-api/src/server.ts` → `HOST = '127.0.0.1', PORT = 8787`

The user develops by SSHing from apollo (MacBook Air) to dionysus (this machine) over Tailscale. The browser UI is inaccessible from apollo.

### Options

| Option | Change | Pros | Cons |
|--------|--------|------|------|
| **A: SSH tunnel** | None (run `ssh -L 5173:127.0.0.1:5173 -L 8787:127.0.0.1:8787 dionysus`) | Zero code changes, works today | Must remember to set up tunnel; Vite HMR websocket may need `--host` anyway for reliable HMR over tunnel |
| **B: Bind to Tailscale IP** | Change `host` to `'0.0.0.0'` in both configs | Works automatically from any Tailscale peer; HMR reliable | Exposes ports on all interfaces (mitigated by firewall/Tailscale ACLs) |
| **C: Env-var toggle** | Read `HOST` from `process.env.HOST ?? '127.0.0.1'` | Flexible: localhost by default, `HOST=0.0.0.0` for remote | Slightly more config to remember |
| **D: Tailscale serve** | `tailscale serve --bg 5173` | HTTPS, Tailscale handles routing | Adds Tailscale dependency to dev workflow; need separate serve for API |

### Recommendation

**Option C (env-var toggle)** for both Vite and Fastify. This keeps localhost as the safe default while allowing `HOST=0.0.0.0 npm run dev` for remote access. Document the pattern in README.md.

For Vite specifically, the `--host` CLI flag already does this (`vite --host`), so the web app may only need a script alias.

### What's Missing from Planning Docs

No requirement, constraint, or decision captures the remote-development access pattern. This should be added as a constraint in PROJECT.md or a decision in the Key Decisions table, since it affects every phase going forward.

---

## Part 2: Structural Gaps — Missing Requirements

These are areas not present in the current requirements at all.

### Gap S1: Optimal Trajectory / Racing Line Computation

**Current state:** VISU-02 mentions *visualizing* racing lines. CTRL-03/CTRL-04 cover control systems. But no requirement addresses *computing* optimal paths.

**Why it matters:** The racing line problem (minimize lap time subject to track boundaries, grip, aero, and power constraints) is one of the most educational problems in motorsport engineering. It connects vehicle dynamics, tire grip, aerodynamics, and control into a single optimization. It's also where MPC (Phase 5) naturally produces trajectory output, but a simplified version could appear earlier.

**Proposed requirement:**

> **CTRL-05**: Application can compute or approximate an optimal trajectory for the current model and circuit, and show how parameter changes (grip, downforce, power, regulation constraints) alter the racing line.
> *Motivation:* `user: wants to visualize optimal policy and racing lines; wants to understand the control systems involved`

**Phase placement:** Phase 5 (alongside MPC, which naturally produces trajectory output). A simplified minimum-curvature or maximum-velocity path could appear in Phase 2 as a stretch goal if the circuit representation supports spatial coordinates.

---

### Gap S2: Driver–Engineer Operational Interaction

**Current state:** The driver is modeled as a parameterized style profile (CTRL-01, CTRL-02). No requirement addresses the operational side of racing: race engineer communication, mid-race strategy interventions, engine mode changes, or the information asymmetry between driver, engineer, and strategist.

**Why it matters:** In real F1, races are won and lost on pit-wall decisions: when to pit, when to switch to inters, when to tell the driver to push or manage tires. These mid-race interventions are a distinct simulation and learning domain from pre-race strategy optimization.

**Proposed requirement:**

> **STRA-04**: User can simulate in-race strategy interventions (mode changes, pit timing responses to rivals, tire management instructions) and see how intervention timing and information state alter race outcomes.
> *Motivation:* `user: wants to understand interactions between drivers and the engineering team`

> **EDU-03**: The educational surface presents what information is available to different F1 roles (driver, race engineer, strategist, performance engineer, vehicle dynamics engineer) and how decisions propagate through the system.
> *Motivation:* `user: wants to teach someone looking to onboard as different F1 racing engineers`

**Phase placement:** STRA-04 fits Phase 4 (strategy simulation). EDU-03 is cross-cutting but should land primarily in Phase 4 alongside the explanation views.

---

### Gap S3: Race Interruption Modeling

**Current state:** MODL-04 mentions "safety-car penalties" as one non-ideal condition. Phase 4 strategy comparison doesn't explicitly include race interruptions as strategic inflection points.

**Why it matters:** VSC timing, safety car periods, red flag stops, and formation lap tire strategy are often the decisive factors in race outcomes. A strategy simulator that can't model "what if the safety car comes out on lap 20?" misses the highest-leverage strategy question in modern F1.

**Proposed requirement:**

> **STRA-05**: User can inject race interruptions (virtual safety car, full safety car, red flag) at specified or probabilistic points in a race simulation and see how they alter optimal strategy.
> *Motivation:* `user: wants to study general F1 racing strategy under non-ideal conditions`

**Phase placement:** Phase 4 (strategy simulation), as an extension of STRA-01/STRA-03.

---

### Gap S4: Qualifying and Sprint Session Modes

**Current state:** The scenario schema includes session type, but the entire roadmap is implicitly race-focused. No requirement addresses qualifying strategy (tire allocation across Q1/Q2/Q3, push lap timing, traffic management) or sprint format (shorter race with distinct strategy constraints).

**Why it matters:** Qualifying is a fundamentally different optimization problem from race strategy — you're optimizing single-lap performance under tire allocation constraints, not stint management. Sprint races add a third format with its own strategy logic.

**Proposed requirement:**

> **PLAT-04**: User can simulate qualifying sessions (Q1/Q2/Q3 with compound allocation and push-lap timing) and sprint races as distinct session modes with format-specific strategy constraints.
> *Motivation:* `user: wants comprehensive F1 racing strategy coverage`

**Phase placement:** Phase 4 (strategy), possibly as an additional plan. Qualifying depends on having a reliable single-lap model (Phase 2) and tire compound differentiation (Phase 3).

---

### Gap S5: Synthetic Sensor / Measurement Model

**Current state:** The estimation-and-control-stack deliberation defines layer 1 as "plant and sensor model." ESTM-01 through ESTM-03 require observer/estimator functionality. But no requirement specifies that the simulator should produce realistic noisy measurements.

**Why it matters:** The observer can't estimate hidden state if there's nothing to estimate from. A sensor model (with realistic noise, sampling rates, and dropout characteristics) is the prerequisite for the entire estimation layer. It also creates a self-contained learning path before real telemetry is available.

**Proposed requirement:**

> **ESTM-04**: The simulator generates noisy measurement channels that mimic realistic sensor outputs (speed, acceleration, temperatures, pressures), enabling observer comparison of true state vs. measured state vs. estimated state.
> *Motivation:* `user: wants to understand the mathematics behind EKF in context; prerequisite for ESTM-01 through ESTM-03`

**Phase placement:** Phase 4 (alongside observer work). The sensor model should be defined when the observer layer is built, not earlier, since sensor characteristics depend on what subsystem states exist.

---

### Gap S6: Interactive Simulation Playback and Branching

**Current state:** Requirements describe static comparison (VISU-04: side-by-side overlays). No requirement addresses temporal interaction with simulation output.

**Why it matters:** A learning engineer needs to scrub through a race, pause at lap 20, inspect all subsystem states, and ask "what if I changed strategy here?" This is the difference between a report viewer and an interactive learning environment.

**Proposed requirement:**

> **VISU-05**: User can scrub through simulation time, inspect subsystem state at any point, and branch simulations from intermediate states to explore alternative decisions.
> *Motivation:* `user: wants proper visualizations and interactivity to help teach someone looking to onboard as different F1 racing engineers`

**Phase placement:** Phase 4 (alongside strategy and explanation views). The temporal dimension becomes meaningful when multi-lap simulations exist.

---

### Gap S7: Specific Data Source Strategy

**Current state:** PROJECT.md has an open question about F1 TV Premium data formats. Phase 6 defines adapter-based ingestion (DATA-01 through DATA-03). No specific external data source is named.

**Why it matters:** The adapter architecture should be informed by what data is actually available. There are well-known external resources:

- **FastF1** (Python library): Accesses F1 timing and telemetry data. Provides lap times, car telemetry (speed, throttle, brake, gear, DRS), position data, weather data. Most practical import path. Active community.
- **OpenF1 API**: Community REST API providing real-time and historical F1 data including car telemetry, driver info, intervals, pit stops, and weather.
- **Ergast API**: Deprecated but historical race results, standings, and schedule data remains available.
- **F1 TV Premium**: No official export API identified during project initialization, but provides visual telemetry overlays during live timing.

**Proposed requirement:**

> **DATA-04**: Application supports import from at least one established F1 data source (such as FastF1 or OpenF1 API) as the primary real-data integration path, with adapter architecture that can accommodate additional sources.
> *Motivation:* `user: wants ingestion of real telemetry and simulated data collection`

**Phase placement:** Phase 6 (data import). However, circuit position data from FastF1 could inform Phase 2 circuit representations.

**Action:** Resolve the open question in PROJECT.md about data source strategy. FastF1 is the strongest candidate for the primary adapter target.

---

## Part 3: Depth Gaps — Underspecified Requirements

These are areas present in requirements but lacking sufficient detail.

### Gap D1: Vehicle Dynamics Beyond Point-Mass in v1

**Current state:** MODL-01 specifies "explicit inputs for mass, drag, downforce proxy, tire grip, and power-unit behavior." Phase 2 context assumes a pure longitudinal model (point-mass or quasi-steady-state).

**Gap:** There is no intermediate step between "point-mass with drag/downforce" and the v2 mechanical subsystem (SYSC-03: braking, chassis, suspension, setup-sensitive handling). A learning engineer would want to understand lateral load transfer, cornering stiffness, brake balance, and how corner speed emerges from the interaction of grip, downforce, and mass distribution.

**Proposed refinement:** Extend MODL-01 or add success criteria to Phase 2/3:

> MODL-01 refinement: "...with explicit inputs for mass, drag, downforce proxy, tire grip, power-unit behavior, **and basic lateral/longitudinal force balance that shows how corner speed, braking distance, and acceleration emerge from these inputs**."

Or add to Phase 3 success criteria: "The model exposes at least basic lateral force balance and load transfer effects so that corner speed depends on more than a single grip scalar."

**Phase placement:** Lightweight lateral dynamics fit Phase 3 (alongside tire dynamics, since tires generate the forces). Full suspension/chassis dynamics remain v2.

---

### Gap D2: 2026-Specific Active Aero Mode Switching

**Current state:** PROJECT.md notes that "FIA's published 2026 Formula 1 direction emphasizes active aerodynamics and a much larger electrical-energy contribution." The regulation preset `fia-2026-baseline.json` exists with qualitative placeholders. v2 has SYSC-01 (active-aero subsystem).

**Gap:** Active aero mode switching (low-drag vs. high-downforce states) is arguably v1-critical since the regulation presets already reference 2026 and it fundamentally changes straight-line vs. cornering tradeoffs. It doesn't require full aerodynamic modeling — just a discrete state that switches drag/downforce coefficients.

**Proposed refinement:** Add to Phase 3 (or late Phase 2):

> Phase 3 success criteria addition: "Where regulation presets define aero-mode switching (e.g., DRS or active-aero states), the model reflects the discrete aero-state effect on drag and downforce rather than using a single static coefficient."

**Phase placement:** Phase 3, plan 03-03 or a new plan within Phase 3. It's a natural extension of the regulation preset system.

---

### Gap D3: Dynamic Weather Evolution During Sessions

**Current state:** Phase 3 success criterion 3: "Weather and grip conditions can degrade or improve performance in scenario-dependent ways." ENVR-01: "grip evolution, surface state, ambient effects."

**Gap:** The criterion doesn't distinguish between static weather presets (it's raining the whole race) and dynamic weather changes (rain starts on lap 15, track dries by lap 30). Dynamic weather transitions are the most strategically consequential weather events in F1.

**Proposed refinement:**

> Phase 3 success criterion 3 (revised): "Weather and grip conditions **evolve over time within a session** — including transitions between dry and wet, track temperature changes, and surface rubber evolution — and affect strategy decisions dynamically rather than only as static initial conditions."

**Phase placement:** Phase 3, plan 03-03 (already scoped for weather dynamics).

---

### Gap D4: Energy Deployment as Optimizable Policy

**Current state:** MODL-03 and ELEC-01/ELEC-02 treat electrical energy as a modeling and inspection concern (Phase 3). Energy deployment optimization is implicitly deferred to Phase 5 (control systems).

**Gap:** Energy deployment across a lap (when to harvest vs. deploy on straights, through corners, under braking) is itself a rich optimization problem. Treating it purely as an inspectable state in Phase 3 and deferring all optimization to Phase 5 misses an opportunity: by Phase 4 (strategy), the user should be able to compare energy-deployment strategies as part of race strategy, not just inspect energy state passively.

**Proposed refinement:**

> Phase 3 success criterion addition: "The user can compare at least two energy-deployment policies (e.g., aggressive deploy vs. conservation) and see their effect on lap time and energy state evolution."

> Phase 4 success criterion addition: "Strategy comparison includes energy-deployment policy as a strategic variable alongside compound choice, pit timing, and driver mode."

**Phase placement:** Simple policy comparison in Phase 3. Integration into strategy in Phase 4.

---

### Gap D5: Tire Compound Differentiation and Cliff Effects

**Current state:** MODL-02: "tire wear and tire temperature state across laps and stints." Phase 3 plan 03-01: "Implement tire state and degradation models."

**Gap:** The requirements don't explicitly specify:
- Different compounds (soft/medium/hard/intermediate/wet) with distinct degradation curves, thermal windows, and grip envelopes.
- Tire cliff effects (sudden performance drop when exceeding thermal or wear thresholds).
- The educational value of seeing *why* a tire falls off a cliff, not just that it does.

**Proposed refinement:**

> Phase 3 success criterion addition: "Tire models include at least three dry compounds and one wet compound with distinct degradation curves, thermal operating windows, and cliff-effect behavior. The user can see how compound choice and driving style interact with degradation."

**Phase placement:** Phase 3, plan 03-01 (already scoped for tire state).

---

## Part 4: Phase and Roadmap Adjustments

Most gaps fit within existing phases as additional plans or expanded success criteria. No new phases are needed.

### Summary of Phase-Level Changes

| Phase | New/Changed Requirements | Impact |
|-------|--------------------------|--------|
| **Phase 2** | MODL-01 refinement (basic force balance); optional simplified racing line if circuit format supports it | Minor expansion: may add success criteria but no new plans needed |
| **Phase 3** | Active aero modes (D2); dynamic weather (D3); energy deployment policy comparison (D4); tire compound/cliff detail (D5); basic lateral dynamics (D1) | Moderate expansion: Phase 3 is already the largest phase (4 plans). May need a 5th plan for active aero + basic dynamics, or absorb into existing plans. |
| **Phase 4** | STRA-04 (in-race interventions); STRA-05 (race interruptions); PLAT-04 (qualifying/sprint modes); EDU-03 (engineer-role views); VISU-05 (timeline scrubbing); ESTM-04 (sensor model); energy-deployment in strategy | Significant expansion: Phase 4 currently has 3 plans. Will likely need 2–3 additional plans. This is the biggest change. |
| **Phase 5** | CTRL-05 (optimal trajectory / racing line computation) | Minor expansion: trajectory optimization is a natural output of MPC. One additional plan or expanded scope for existing plan 05-03. |
| **Phase 6** | DATA-04 (specific data source: FastF1/OpenF1) | Minor: informs adapter architecture but doesn't add structural complexity. |

### Phase 3 Concern

Phase 3 is already dense: tire dynamics, electrical subsystem, weather/environment coupling, and cross-subsystem validation across 4 plans. Adding active aero modes, basic lateral dynamics, and energy-deployment policy comparison increases the load.

**Options:**
- **A: Absorb into existing plans.** Active aero goes into 03-03 (environment/weather). Basic lateral dynamics goes into 03-01 (tire, since tires generate lateral force). Energy-deployment policy goes into 03-02 (electrical).
- **B: Split Phase 3.** Separate tire/mechanical dynamics from electrical/energy/environment. This gives more focused phases but increases phase count.
- **C: Add a Phase 3 plan.** Keep 4 plans but expand scope, or add a 5th plan for cross-subsystem policy comparison.

**Recommendation:** Option A (absorb into existing plans) for now. These are depth additions to already-scoped concerns, not new architectural directions. Revisit if Phase 3 planning reveals the scope is too large for 4 plans.

### Phase 4 Concern

Phase 4 currently has 3 plans covering strategy simulation, explanation views, and observer/learning views. The new requirements add:
- In-race interventions (STRA-04)
- Race interruptions (STRA-05)
- Qualifying/sprint modes (PLAT-04)
- Engineer-role views (EDU-03)
- Timeline scrubbing (VISU-05)
- Sensor model (ESTM-04)

This is substantial. Phase 4 will likely need 5–6 plans total.

**Recommendation:** Expand Phase 4 plan count during planning. The current 3 plans were preliminary roadmap estimates. Regroup as:
1. Race-distance and pit-strategy simulation (existing 04-01, now including interruptions and intervention modeling)
2. Qualifying and sprint session simulation (new)
3. Explanation views and engineer-role learning paths (existing 04-02, expanded with role-specific views)
4. Sensor model and observer layer (new, prerequisite for 04-05)
5. Observer-aware learning views, timeline interaction, and sensitivity workflows (existing 04-03, expanded)

---

## Part 5: Deliberation Recommendations

Three areas need deeper thinking before they can be properly specified as requirements or plans.

### Deliberation 1: Development and Deployment Architecture

**Core question:** Given that the user develops remotely via SSH/Tailscale from apollo (MacBook Air) and potentially orpheus (iPhone), what is the right development and runtime architecture for the interactive browser application?

**Adjacent questions:**
- Should the dev server bind to Tailscale by default or require explicit opt-in?
- Is Vite HMR reliable over Tailscale, or should the architecture support a production-like build mode for remote viewing?
- Should the application eventually support mobile access from orpheus for monitoring or light interaction?
- Does the local-first constraint conflict with the remote-development reality?

**Why it matters:** Every future phase assumes the user can see and interact with the browser UI. If the access pattern isn't reliable, nothing else works.

### Deliberation 2: Educational Pedagogy and Learning Path Design

**Core question:** What does "teach F1 engineering" actually mean for this platform, and what learning progressions should the educational surface support?

**Adjacent questions:**
- Which F1 engineering roles should the platform explicitly address (race engineer, performance engineer, strategy engineer, vehicle dynamics engineer, power unit engineer)?
- What concepts should a user with a robotics/control background encounter first vs. later?
- How should the platform scaffold from "I understand dynamics and control but not F1" toward "I understand how all F1 systems interact"?
- Should there be a structured curriculum or is free exploration sufficient?
- How do the educational views relate to the layered estimation → control → strategy architecture?

**Why it matters:** The requirements say "educational platform" but the pedagogy is still implicit. Without a deliberate learning model, the educational views risk becoming disconnected dashboards rather than a coherent teaching tool.

### Deliberation 3: Data Source Strategy and Import Feasibility

**Core question:** Which external F1 data sources are realistic for this project, what are their capabilities and limitations, and how should that shape the import architecture?

**Known sources to evaluate:**
- **FastF1** (Python library): Lap times, car telemetry, position data, weather data. Active community, well-documented.
- **OpenF1 API**: REST API for real-time and historical data. Car telemetry, intervals, pit stops, weather.
- **Ergast API**: Deprecated but historical results available.
- **F1 TV Premium**: Visual telemetry overlays in live timing. No official export API.
- **Community scraping/recording tools**: Various tools capture F1 TV data streams.

**Adjacent questions:**
- Can FastF1 data seed circuit representations for Phase 2?
- What is the latency and reliability of these sources?
- Are there legal/ToS concerns?
- Should the Python data layer be a separate service, a sidecar, or integrated into the Node.js stack via child processes?

**Why it matters:** The answer shapes Phase 6 adapter architecture and may provide useful data for earlier phases (circuit geometry, reference lap times for calibration).

---

## Part 6: Summary Action Matrix

### Immediate Actions

| # | Action | Type | Effort |
|---|--------|------|--------|
| 1 | Fix remote access: env-var toggle for HOST in Vite and Fastify configs | Code change | Small |
| 2 | Add remote-development constraint to PROJECT.md Key Decisions | Doc update | Trivial |

### Requirements to Add

| # | ID | Description | Phase |
|---|----|-------------|-------|
| 3 | CTRL-05 | Optimal trajectory / racing line computation | 5 |
| 4 | STRA-04 | In-race strategy interventions and driver–engineer interaction | 4 |
| 5 | EDU-03 | Engineer-role-specific learning paths | 4 |
| 6 | STRA-05 | Race interruption modeling (VSC, SC, red flag) | 4 |
| 7 | PLAT-04 | Qualifying and sprint session simulation modes | 4 |
| 8 | ESTM-04 | Synthetic sensor / measurement model | 4 |
| 9 | VISU-05 | Interactive timeline scrubbing and simulation branching | 4 |
| 10 | DATA-04 | Specific data source integration (FastF1, OpenF1) | 6 |

### Requirements to Refine

| # | ID | Refinement | Phase |
|---|----|-----------|-------|
| 11 | MODL-01 | Add basic lateral/longitudinal force balance | 2–3 |
| 12 | Phase 3 SC | Active aero mode switching from regulation presets | 3 |
| 13 | Phase 3 SC | Dynamic weather evolution, not just static presets | 3 |
| 14 | Phase 3 SC | Energy deployment as optimizable policy, not just inspectable state | 3–4 |
| 15 | Phase 3 SC | Tire compound differentiation and cliff effects | 3 |

### Deliberations to Conduct

| # | Topic | Priority |
|---|-------|----------|
| 16 | Development and deployment architecture for remote access | High (blocks workflow) |
| 17 | Educational pedagogy and learning path design | Medium (shapes Phase 4+) |
| 18 | Data source strategy and import feasibility | Medium (shapes Phase 6, informs Phase 2 circuit data) |

### Roadmap Adjustments

| # | Change | Priority |
|---|--------|----------|
| 19 | Expand Phase 4 plan count from 3 to 5–6 | When Phase 4 is planned |
| 20 | Add Phase 5 plan for trajectory optimization alongside MPC | When Phase 5 is planned |
| 21 | Absorb Phase 3 depth additions into existing plans or add one plan | When Phase 3 is planned |

---

*Analysis by: Claude (Opus 4.6)*
*Reviewed: Pending user review*
