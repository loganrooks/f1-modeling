# Deliberation: Educational Pedagogy and Learning Path Design

**Date:** 2026-03-26
**Status:** concluded
**Trigger:** Gap analysis found that requirements say "educational platform" and "learning engineers" but the pedagogy is still implicit. Without a deliberate learning model, educational views risk becoming disconnected dashboards. The user specifically asked about teaching "someone looking to onboard as different F1 racing engineers."
**Affects:** Phase 4, Phase 5, Phase 7; requirements EDU-03, STRA-04, DESN-02; educational view architecture, role-based navigation, concept module design
**Related:**
- `.planning/deliberations/full-system-scope-and-educational-platform.md`
- `.planning/deliberations/visualization-and-simulation-learning-surface.md`
- `.planning/deliberations/estimation-and-control-stack.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- informal conversation observation; no formal signal created

## Situation

The project is explicitly framed as an educational platform for full-system F1 coverage (per the full-system-scope deliberation). The visualization deliberation established a progressive learning surface. The estimation-and-control-stack deliberation established the layered technical architecture. Requirements EDU-03 ("learning paths relevant to different F1 engineering disciplines") and STRA-04 ("driver-engineer interaction modeling") now exist. However, no deliberation has yet addressed *how* the platform teaches: what pedagogical structure connects a learner to the material, how the different F1 engineering roles map to views and exercises, or how someone with the user's specific background (philosophy PhD, robotics engineering) should enter the system.

The risk is that educational views become a flat collection of dashboards, each showing data but none building understanding. The user's question about onboarding as different F1 engineers signals that role-based perspective-taking is a core learning mechanism, not a cosmetic feature.

### Evidence Base

| Source | What it shows | Corroborated? | Signal ID |
|--------|--------------|---------------|-----------|
| User conversation | User explicitly asked about learning F1 from the perspective of different engineering roles: "someone looking to onboard as different F1 racing engineers" | Yes, direct user statement | informal |
| User background | Philosophy PhD student with robotics engineering background; already knows dynamics, control, estimation, data pipelines; needs F1 context and domain vocabulary | Yes, from project context | informal |
| `.planning/REQUIREMENTS.md` (EDU-03) | "Learning paths relevant to different F1 engineering disciplines" is a stated requirement with no implementation design yet | Yes, read from planning docs | informal |
| `.planning/REQUIREMENTS.md` (STRA-04) | "Driver-engineer interaction modeling" implies the race engineer role is in scope as a perspective, not just a data source | Yes, read from planning docs | informal |
| full-system-scope deliberation | Established that the platform covers all major F1 systems eventually, staged through milestones | Yes, deliberation concluded | informal |
| visualization deliberation | Established progressive visual learning surface with layered disclosure | Yes, deliberation concluded | informal |
| estimation-and-control-stack deliberation | Established the layered architecture: estimation feeds control feeds strategy | Yes, deliberation concluded | informal |

## Framing

The real question is not whether the platform should teach. That was settled. The question is what pedagogical structure organizes the teaching: by role, by concept, by system, or by some hybrid. Each choice shapes navigation, view design, exercise structure, and the order in which complexity is disclosed.

**Core question:** Should the educational experience be organized around F1 engineering roles, around technical concepts, or around a hybrid that uses roles as entry points and concepts as shared depth?

**Adjacent questions:**
- Which F1 engineering role is the natural first perspective for a learner with a robotics/control background?
- Should role perspectives be explicit navigational structures (a "role selector") or implicit (good defaults that reveal role-relevant information)?
- When in the roadmap should role-based views begin appearing?
- How do role perspectives relate to the existing layered architecture (estimation, control, strategy)?

## F1 Engineering Role Analysis

Before evaluating options, each target role must be characterized by what it focuses on, what data it consumes, and what decisions it makes. This analysis grounds the pedagogical design in real engineering practice.

### Race Engineer

The race engineer is the driver's primary technical interface during sessions. They synthesize information from every other engineering discipline into actionable calls.

- **Focus:** Real-time car state, driver feedback, session management, mode changes, tire life, fuel state, weather response
- **Data consumed:** Tire degradation curves, driver lap-time deltas, sector times, radio communications, weather radar, competitor positions, strategy team recommendations
- **Decisions:** When to change engine modes, how to communicate strategy changes to the driver, whether to adjust front wing or diff settings mid-stint, how to manage tire life through driving instruction
- **Architecture mapping:** Consumes outputs from all layers; operates at the interface between strategy decisions and driver execution
- **Pedagogical value:** Highest integration role; forces the learner to synthesize across subsystems; best "capstone" perspective

### Strategy Engineer

The strategy engineer owns pit-stop timing, compound selection, and race-interrupt response. Their work is probabilistic and game-theoretic.

- **Focus:** Pit windows, tire compound degradation curves, undercut/overcut timing, safety car probability, weather probability, competitor strategy inference
- **Data consumed:** Tire degradation models, gap analysis, track position, pit-loss calculations, weather forecasts, historical safety-car data, Monte Carlo simulations of race outcomes
- **Decisions:** When to pit, which compound to fit, whether to respond to competitor stops, how to handle VSC/SC/red flag, multi-stop versus single-stop scenarios
- **Architecture mapping:** Maps directly to the strategy layer; consumes estimation outputs (tire state, fuel state) as inputs to optimization
- **Pedagogical value:** Strong for someone with optimization and probabilistic modeling background; directly exercises the strategy layer

### Performance Engineer

The performance engineer owns lap-time accounting: understanding where time is gained or lost, decomposing performance into contributing factors, and tracking trends across sessions.

- **Focus:** Lap-time breakdown by sector and corner, speed trace analysis, aero balance assessment, setup sensitivity, session-over-session trends, correlation between simulation and track
- **Data consumed:** Telemetry (speed, throttle, brake, steering, g-forces), lap-time deltas, setup sheets, tire performance data, aero maps, wind tunnel / CFD correlation data
- **Decisions:** Which setup changes yield the most lap time, where the car is losing time relative to theoretical best, what balance changes to recommend, how to prioritize limited practice time
- **Architecture mapping:** Operates across estimation and control layers; synthesizes vehicle state estimates into performance assessments
- **Pedagogical value:** Excellent entry point; performance decomposition teaches the learner to read telemetry and understand what each subsystem contributes to overall pace

### Vehicle Dynamics Engineer

The vehicle dynamics engineer owns the mechanical behavior of the car: how forces flow through tires, suspension, and chassis, and how the car responds to driver inputs.

- **Focus:** Tire forces (lateral, longitudinal, combined), load transfer, suspension kinematics and compliance, mechanical balance, handling characteristics, tire operating windows
- **Data consumed:** Tire model outputs (Pacejka or equivalent), suspension travel, ride heights, accelerometer data, damper velocities, spring rates, anti-roll bar settings, weight distribution
- **Decisions:** Spring and damper settings, anti-roll bar stiffness, ride height targets, mechanical balance tuning, tire pressure targets, camber and toe adjustments
- **Architecture mapping:** Maps directly to the estimation layer; tire and vehicle state estimation is the foundation of dynamics understanding
- **Pedagogical value:** Highest alignment with robotics/control background; the physics of tire-road interaction, load transfer, and force balance are directly analogous to robotic dynamics

### Power Unit Engineer

The power unit engineer manages the hybrid powertrain: internal combustion engine, MGU-K, MGU-H, energy store, and turbo. Their domain is energy management under thermal and regulatory constraints.

- **Focus:** Energy deployment and harvesting strategy, thermal management of all PU components, engine mode selection, fuel flow optimization, reliability margins, energy store state-of-charge management
- **Data consumed:** Battery SOC, MGU-K/H power flows, ICE temperatures (oil, water, exhaust), turbo speed, fuel flow, energy deployed per lap, thermal model predictions, FIA energy regulations
- **Decisions:** Deployment strategy per lap and per stint, engine mode selection, harvesting targets, thermal limit management, when to sacrifice pace for reliability, qualifying versus race modes
- **Architecture mapping:** Maps to estimation (thermal state, energy state) and control (deployment optimization); the ERS control problem is a constrained optimal control problem
- **Pedagogical value:** Strong for someone with control systems background; energy management is a classic constrained optimization problem with real-time state estimation

### Aerodynamicist (lighter v1 coverage)

The aerodynamicist owns the interaction between the car's shape and the airflow around it, which determines downforce, drag, and cooling.

- **Focus:** Downforce/drag tradeoff, active aero (DRS) effects, wake interactions in traffic, cooling flow management, aero balance (front-to-rear downforce distribution)
- **Data consumed:** Aero maps (downforce and drag as functions of ride height, yaw, roll), DRS delta, wind tunnel and CFD data, track-specific aero configurations, following-car performance loss models
- **Decisions:** Wing level selection, cooling aperture configuration, DRS usage strategy, aero balance targets, car-following strategy implications
- **Architecture mapping:** Provides parameters to the estimation and dynamics layers; aero loads are inputs to the vehicle dynamics model
- **Pedagogical value:** Important for complete understanding but less directly exercised by the current estimation-focused architecture; better as a later addition

## Analysis

### Option A: Free Exploration Only

- **Claim:** Do not impose any pedagogical structure. Let the workspace's natural organization (subsystem modules, layered architecture, progressive disclosure) serve as the teaching structure.
- **Grounds:** The user is a capable engineer. Good tools teach by being well-structured. Adding explicit pedagogy risks being patronizing or rigid.
- **Warrant:** Many engineers learn best by exploring systems they can interrogate directly.
- **Rebuttal:** This works for someone who already knows F1 engineering. The user explicitly asked about learning F1 *as* different engineers, which requires contextual framing that raw data views do not provide. Without role context, the user sees numbers but does not know which numbers matter to whom or why.
- **Qualifier:** Insufficient. Exploration is necessary but not sufficient.

### Option B: Role-Based Learning Paths

- **Claim:** Organize the educational experience entirely around F1 engineering roles. Each role gets a dedicated view, a curated data surface, and structured exercises progressing from observation to decision-making.
- **Grounds:** The user asked about onboarding as different engineers. Roles are how F1 teams actually organize their engineering work. Role-based paths give the learner a coherent identity and decision context.
- **Warrant:** Role-based organization mirrors real practice, which is the stated learning goal.
- **Rebuttal:** Roles share significant conceptual substrate. A tire degradation model matters to the vehicle dynamics engineer, the strategy engineer, the race engineer, and the performance engineer. Pure role-based paths either duplicate this shared content or fragment it into disconnected presentations. Additionally, rigid role paths may not fit the user's background, which cuts across multiple roles (dynamics from robotics, control from engineering, estimation from both).
- **Qualifier:** Strong motivation but structurally fragile if roles are treated as silos.

### Option C: Concept-Based Learning Paths

- **Claim:** Organize the educational experience around technical concepts (forces, energy, optimization, estimation, uncertainty) rather than roles. Map each concept to where it appears across the F1 engineering landscape.
- **Grounds:** The user has a strong technical background. Concepts transfer across roles. A concept-first approach leverages existing knowledge (the user already understands state estimation; they need to see it applied to tire degradation, energy management, and strategy uncertainty).
- **Warrant:** Concept-based organization aligns with how engineers actually transfer knowledge between domains.
- **Rebuttal:** Pure concept-based paths lose the role context that makes the learning goal meaningful. Understanding tire forces is different from understanding *why the vehicle dynamics engineer cares about tire forces in this way at this moment*. The user's question was not "teach me dynamics" but "teach me to think like a vehicle dynamics engineer." The role provides the decision context that gives concepts meaning.
- **Qualifier:** Strong for depth but weak for motivation and contextualization.

### Option D: Hybrid -- Role Entry Points with Shared Concept Modules

- **Claim:** Use F1 engineering roles as navigational entry points and perspective frames, but decompose the actual learning content into shared concept modules that multiple roles reference. A learner enters through a role, which provides decision context and relevance framing, then engages with concept modules (tire modeling, energy management, lap-time decomposition) that are shared infrastructure. Each role surfaces the same concept module with different emphasis, different default views, and different guiding questions.
- **Grounds:** This mirrors how F1 engineering actually works: roles are perspectives on shared physical systems. The tire is the same tire whether the dynamics engineer, strategy engineer, or race engineer is looking at it, but each looks at different aspects with different questions. The user's robotics background means they already have the concept-level knowledge; what they need is the role-level framing that tells them *which* concepts matter *when* and *why* from each engineering perspective.
- **Warrant:** Hybrid structure avoids duplication (concepts are authored once), preserves role context (roles frame the same data differently), and matches the user's learning need (they know dynamics; they need to learn to be a dynamics *engineer* in F1 context).
- **Rebuttal:** More complex to design than pure role or pure concept paths. Requires a clear mapping between roles and concept modules, plus role-specific framing overlays. Risk of the framing feeling artificial if not grounded in real engineering practice.
- **Qualifier:** Strong. The additional design complexity is justified by the structural advantages.

## Role-to-Concept Mapping (Option D Detail)

If Option D is adopted, the following mapping establishes which concept modules each role engages with, and in what capacity.

| Concept Module | Vehicle Dynamics | Performance | Strategy | Race Engineer | Power Unit | Aero |
|---------------|-----------------|-------------|----------|---------------|------------|------|
| Tire modeling | Primary owner | Heavy consumer | Consumer (degradation) | Consumer (life mgmt) | Light | Light |
| Load transfer & balance | Primary owner | Heavy consumer | Light | Consumer | Light | Consumer |
| Lap-time decomposition | Consumer | Primary owner | Consumer | Consumer | Consumer | Consumer |
| Energy management | Light | Consumer | Consumer (deployment vs pace) | Consumer | Primary owner | Light |
| Pit strategy & game theory | Light | Light | Primary owner | Heavy consumer | Light | Light |
| State estimation | Heavy consumer | Consumer | Consumer | Consumer | Heavy consumer | Light |
| Optimal control | Consumer | Light | Consumer | Light | Primary owner | Light |
| Aero forces & wake | Consumer | Consumer | Light | Light | Light | Primary owner |
| Weather & uncertainty | Light | Light | Heavy consumer | Heavy consumer | Light | Consumer |

"Primary owner" means the role that most deeply engages with the concept's internals. "Heavy consumer" means the role uses the concept's outputs extensively. "Consumer" means the role needs awareness. "Light" means peripheral relevance.

## Entry Point Analysis

The user's robotics background provides strong priors in dynamics, control, and state estimation. The question is which role best leverages these priors while introducing F1-specific context.

| Role | Background alignment | F1 novelty | Recommended order |
|------|---------------------|------------|-------------------|
| Vehicle dynamics engineer | Very high (tire forces, load transfer, suspension are direct analogs to robotic dynamics) | Medium (F1-specific tire models, aero coupling, regulation constraints) | 1st or 2nd |
| Performance engineer | High (telemetry analysis, system decomposition) | High (F1-specific performance accounting, session workflow) | 1st or 2nd |
| Power unit engineer | High (optimal control, energy management, thermal modeling) | High (F1 hybrid PU specifics, FIA regulations) | 3rd |
| Strategy engineer | Medium (optimization, probability) | Very high (F1-specific pit strategy, game theory under race conditions) | 4th |
| Race engineer | Medium (systems integration) | Very high (F1 operational workflow, driver management, real-time synthesis) | 5th (capstone) |
| Aerodynamicist | Low-medium (fluid dynamics less central to robotics) | Very high | 6th (later phase) |

**Recommended first role:** Performance engineer or vehicle dynamics engineer. Both leverage existing technical knowledge while introducing F1-specific framing. The performance engineer perspective offers a broader initial view of the car as a system (where is time gained and lost?), while the vehicle dynamics perspective offers deeper physical intuition about the car's fundamental behavior. Either is a valid entry point; the performance engineer may be slightly better as a *first* exposure because it provides the "big picture" before diving into subsystem physics.

**Recommended progression:** Performance engineer (overview, telemetry literacy) -> Vehicle dynamics engineer (physical foundations) -> Power unit engineer (energy and control) -> Strategy engineer (optimization and game theory) -> Race engineer (integration and real-time synthesis).

## Pedagogical Model

The platform should adopt an implicit pedagogy: structure that teaches by design rather than by explicit curriculum. This means:

1. **Role selector as navigation, not coursework.** Choosing a role changes default views, highlighted metrics, and guiding questions -- it does not lock the user into a linear sequence of lessons. The user can switch roles at any time.

2. **Progressive disclosure per role.** Each role starts with high-level views (what does this engineer see first?) and allows drilling into detail. The vehicle dynamics engineer starts with a balance overview; drilling in reveals tire force plots, then the underlying Pacejka model, then the estimation pipeline feeding it.

3. **Guiding questions, not instructions.** Each role view includes contextual questions that frame what the engineer would be asking: "Is the car understeering on entry or exit?" (dynamics), "Where is the biggest lap-time delta to theoretical best?" (performance), "What is the optimal pit window given current degradation?" (strategy). These questions teach the user to think in the role's terms.

4. **Cross-role links.** When a concept appears in one role's view, links to other roles' perspectives on the same concept are available. The tire degradation curve in the strategy view links to the same data in the dynamics view, showing how the same physical reality serves different decision-making purposes.

5. **The user's background is an asset, not a deficit.** The platform should not explain what state estimation is. It should show *what F1 engineers estimate, why, and how the estimates feed decisions.* Concept modules assume technical literacy and provide domain context.

## Phasing

Role-based perspectives should begin appearing in Phase 4, when educational views are scheduled. They do not require all subsystems to exist; a role view over incomplete data is still valuable because it teaches the learner what questions to ask even before all answers are computable.

| Phase | Educational capability |
|-------|----------------------|
| Phase 3 | Subsystem models exist but views are developer-oriented; no role framing yet |
| Phase 4 | First role perspectives appear: performance engineer and vehicle dynamics engineer views over existing tire and vehicle models; concept modules for tire modeling, load transfer, lap-time decomposition |
| Phase 5 | Strategy engineer and power unit engineer perspectives added as strategy layer and energy models mature; race engineer perspective as integration view |
| Phase 7+ | Aerodynamicist perspective; cross-role exercises; comparative scenario analysis from multiple role viewpoints simultaneously |

## Tensions

- Role-based entry points and concept-based depth are complementary but create design complexity at the interface between them.
- The user's technical strength means the platform must avoid being condescending about engineering fundamentals while still being thorough about F1-specific context.
- Starting role views in Phase 4 means some views will be data-sparse initially; this is acceptable if the framing is honest about what is and is not yet modeled.
- The race engineer role is the most integrative and therefore the most compelling, but it requires the most subsystems to be meaningful; it should be late in the progression despite being the most "F1-feeling" role.
- Implicit pedagogy (teaching by structure) is harder to design than explicit pedagogy (lessons and quizzes) but better matches the user's self-directed learning style and engineering background.

## Recommendation

Adopt Option D: Hybrid role entry points with shared concept modules.

**Specific recommendations:**

1. Implement role perspectives as navigational overlays on shared data surfaces, not as separate applications or siloed dashboards.
2. Organize concept modules (tire modeling, energy management, lap-time decomposition, state estimation, pit strategy) as shared components that multiple role views compose differently.
3. Start with performance engineer and vehicle dynamics engineer perspectives in Phase 4, as these best leverage the user's robotics background.
4. Use the recommended progression (performance -> dynamics -> PU -> strategy -> race engineer) as a suggested but non-enforced path.
5. Frame each role view with guiding questions drawn from real engineering practice.
6. Assume technical literacy; provide F1 domain context rather than engineering fundamentals.
7. The race engineer role is the capstone perspective; it should appear last because it requires synthesizing all other roles' concerns.

## Predictions

**If adopted, we predict:**

| ID | Prediction | Observable by | Falsified if |
|----|-----------|---------------|-------------|
| P1 | Phase 4 educational views will include at least performance engineer and vehicle dynamics engineer role perspectives, each showing the same underlying data through different lenses with different guiding questions | Phase 4 plan review and implementation | Phase 4 views are role-agnostic dashboards with no perspective framing |
| P2 | Concept modules (tire modeling, lap-time decomposition) will be authored once and composed into multiple role views, avoiding content duplication | Phase 4-5 implementation review | Each role has its own independent implementation of shared concepts |
| P3 | The user will find vehicle dynamics or performance engineering the most natural entry point, given robotics background, and will progress to strategy and race engineer perspectives as those subsystems mature | User feedback during Phase 4-5 | User finds a different role more natural, or finds role framing unhelpful |
| P4 | Role perspectives on incomplete data will still be pedagogically valuable because the guiding questions teach what to look for even before all data sources exist | Phase 4 user interaction | Users find sparse role views confusing rather than instructive |

## Decision Record

**Decision:** Adopt hybrid pedagogical structure with role-based entry points and shared concept modules. Performance engineer and vehicle dynamics engineer as first two role perspectives, beginning in Phase 4. Implicit pedagogy through structure and guiding questions rather than explicit curriculum. Assume technical literacy; teach F1 domain context.
**Decided:** 2026-03-26
**Implemented via:** To be implemented in Phase 4 planning; informs educational view architecture, navigation design, and concept module structure
**Signals addressed:** informal conversation observation; requirements EDU-03, STRA-04

## Evaluation

**Evaluated:** Not yet evaluated
**Evaluation method:** Compare Phase 4-5 implementation against predictions P1-P4; gather user feedback on role entry points and concept module structure

| Prediction | Outcome | Match? | Explanation |
|-----------|---------|--------|-------------|
| P1: Phase 4 views include role perspectives | Not yet evaluated | - | Pending Phase 4 implementation |
| P2: Concept modules shared across roles | Not yet evaluated | - | Pending Phase 4-5 implementation |
| P3: Vehicle dynamics / performance engineer as natural entry | Not yet evaluated | - | Pending user feedback |
| P4: Sparse role views still pedagogically valuable | Not yet evaluated | - | Pending Phase 4 user interaction |

**Was this progressive or degenerating?** (Lakatos)
Not yet evaluated.

**Lessons for future deliberations:**
When an educational platform's user asks "teach me to be X," the pedagogical structure must provide the decision context of X, not just the data that X uses. Roles are perspectives with purposes, not dashboard layouts.

## Supersession

**Superseded by:** Not superseded
**Reason:** N/A.

---

## Amendment 2026-05-15: Implicit primary + explicit optional puzzle layer

**Not a supersession.** The original implicit-pedagogy choice still holds for the **primary** mode of the platform. This amendment adds a layered optional explicit mode without changing that choice.

### What changed

The original deliberation framed implicit vs. explicit pedagogy as a binary trade-off (line 209: *"Implicit pedagogy (teaching by structure) is harder to design than explicit pedagogy (lessons and quizzes) but better matches the user's self-directed learning style and engineering background."*) and chose implicit.

The 2026-05-15 vision expansion (`.planning/VISION.md` § Skill Practice & Puzzle Mode) reframes this as **implicit primary + explicit optional**:

- **Implicit primary** — the simulator and its visualizations remain the main teaching surface. A learner who never opens puzzle mode still learns by structure. The original deliberation's Recommendation §§1-7 are unchanged.
- **Explicit optional layer** — for learners who want drill, and for educators who want a checkpoint before a lesson advances, a chess.com-style puzzle/practice mode adds structured-practice that consumes the same artifacts the implicit pedagogy already produces.

### Why this isn't a contradiction

The original deliberation's argument for implicit pedagogy rested on the user's self-directed learning style and engineering background. That argument is intact: implicit pedagogy remains the right primary mode. The argument *against* explicit pedagogy was its higher design cost and weaker fit for the user — not a categorical rejection. Adding an explicit layer that:

1. Consumes the same artifacts (no parallel data path),
2. Sits beside, not in place of, the structural learning surface,
3. Targets pattern-recognition skill (where drill *does* help even for engineers — chess players are engineers too),

does not contradict the implicit-primary choice. It complements it.

### Architectural consequence

Puzzle mode is not a Phase-4+ surface-only feature. It has real implications for the 3.2 → 3.3 → 3.4 corridor (artifact-envelope masking slots, scoring artifact roles, lesson-schema puzzle-body variant, visualization-substrate hide-and-reveal interaction). The corridor must **preserve these seams** without delivering puzzle mode itself. See:

- `.planning/LONG-ARC.md` § Protected Seams (added 2026-05-15)
- `.planning/initiatives/seeds/puzzle-mode-pedagogy.md` (seed; not an active initiative)

### Revisit triggers

Puzzle-mode delivery becomes an active initiative when one of the revisit triggers in the seed file fires. Until then: design for it, don't build it.

