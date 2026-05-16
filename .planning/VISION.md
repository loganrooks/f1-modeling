# F1 Modeling Lab — Long-Term Vision

**Author:** Logan Rooks
**Captured:** 2026-04-08
**Status:** Living document — refine as the platform evolves

---

## Platform Identity

F1 Modeling Lab is not just a learning toy or a simulation sandbox. The long-term vision is a **serious platform that up-and-coming racing engineers would use** to:

1. **Get a feel for racing strategy and design** — understand how tire compounds, energy deployment, weather, pit timing, and regulation constraints interact to shape race outcomes.
2. **Learn F1 engineering principles** — through structured lessons, tutorials, and interactive visualizations of increasing complexity, covering basic through advanced topics across multiple engineering disciplines.
3. **Enable real engineering workflows** — including real-time strategy analysis capabilities that could be used in actual race-engineering contexts, not just post-hoc educational exploration.

The platform should serve someone who wants to *understand* F1 engineering at the level of a practicing engineer, and eventually provide tools that a practicing engineer would actually use.

## Dual Purpose: Education + Engineering Tool

### Educational Platform
- Lessons and tutorials teaching basic and advanced F1 engineering and strategy principles
- Interactive visualizations of increasing complexity — start simple, build toward full race-strategy visualization
- Role-based learning paths (strategy engineer, performance engineer, race engineer, etc.)
- Progressive disclosure: each concept builds on the previous, with the simulation growing alongside the learner

### Practical Engineering Tool
- Real-time strategy analysis and decision support
- Design exploration and regulation impact assessment
- Telemetry comparison and model calibration against real data
- The kind of tool an engineer would have open during a race weekend

These aren't separate products — they're the same platform with educational scaffolding that can be toggled.

## Skill Practice & Puzzle Mode

Added 2026-05-15. The platform should support a **chess.com-style structured-practice layer** on top of (not instead of) the implicit pedagogy of "teaching by structure." Lessons and tutorials remain primary; puzzles are an **optional explicit layer** that uses the same simulation artifacts to test recognition, recall, judgment, and pattern fluency under controlled conditions.

### Why this belongs in the vision

- The simulator already generates the ground truth that good F1 puzzles need: deterministic stints under known parameters, real telemetry once Phase 6 ingest lands, race scenarios with known optimal answers.
- F1 engineering, like chess, has a large body of **pattern-recognition skill** that benefits from drill more than from passive exposure: reading a degradation curve, recognizing a deployment strategy, identifying a circuit from telemetry, spotting a missed apex from a speed trace.
- Skill practice is one of the strongest learning surfaces a serious platform can offer — and one that distinguishes a "lab" from a "calculator." It is also one of the strongest competitive moats against generic F1 strategy tools that stop at pace prediction.
- Both/and, not either/or: the 2026-04-08 educational-pedagogy deliberation chose implicit > explicit pedagogy. That choice still holds for the **primary** mode — structure-driven learning through inspectable simulation. Puzzle/practice mode is an **optional** explicit layer that depends on, not replaces, the structural pedagogy. See `.planning/deliberations/educational-pedagogy-and-learning-paths.md` § Amendment 2026-05-15.

### Mechanic families (illustrative, not exhaustive)

- **Recognition** — "which circuit is this telemetry from?" / "which compound started this stint?" / "which weather state matches this grip evolution?"
- **Judgment** — "given this race state, when should the next pit stop happen?" / "this deployment policy or that one — which wins?" / "which setup change caused this lap-time delta?"
- **Spot-the-difference** — "where in this stint could the driver have saved time?" / "this stint and that stint differ by one parameter — which one?"
- **Reconstruction** — "you see the lap-time outcome; rebuild the deployment policy that produced it" (small inverse problem against the simulator).
- **Match-the-strategy** — "this race ended with these gaps to leader; match the strategy to the team" (post-race forensics shape).

### Difficulty progression

- **Beginner:** small candidate set (3-4 options), high-contrast distinguishing features, fully labeled context.
- **Intermediate:** larger candidate set, partially masked context, time pressure optional.
- **Advanced:** near-twin candidates (same era, similar circuits), heavily masked context, no labels, scoring includes confidence calibration.
- **Daily / ranked:** spaced-repetition rotation; per-mechanic skill rating; optional persistent ranking once the simulator and calibration baseline are credible enough that the ground truth deserves a leaderboard.

### Scope boundaries

- **Single-player.** No synchronous multiplayer. Async ranked / shared-position-of-the-day is acceptable but not in early scope.
- **Built on existing artifacts.** Puzzles consume the same `ArtifactEnvelope` shapes that lessons and analysis views consume; they are not a parallel data path. The simulator generates puzzle scenarios deterministically from regulation/scenario parameters.
- **Educational primary.** Puzzles are a teaching tool first, a game second. Scoring exists to drive spaced repetition and skill progression, not to displace the simulation/lesson surface.

## Visualization Vision

Visualization is **the product surface**, not decoration. The visualization layer must:

1. **Grow alongside model complexity** — from simple speed profiles (Phase 2) through multi-stint strategy timelines, linked subsystem views, branch comparison, observer overlays, and eventually real-time telemetry alignment.
2. **Handle real-time strategy visualization** — not just static post-hoc analysis. Eventually: live-updating strategy views during simulation, interactive temporal exploration, linked brushing across panels.
3. **Support educational interactivity** — annotated visualizations, guided exploration, assumption panels, "what if" perturbation with instant visual feedback.
4. **Scale to production density** — 50-70 lap race traces, multi-strategy comparison (6+ strategies), per-lap subsystem state, event markers, pit windows, branch divergence points.
5. **Be architecturally honest** — never imply fidelity the model doesn't support. Progressive visualization means showing what the model actually computes, with provenance.

The choice of visualization foundation is load-bearing. It must serve the platform through all phases and into production use.

## Multi-Regulation Scope

The platform starts with **2026 regulations** (active aero, larger electrical contribution, ground effect), but the vision extends to:

- **Historical regulations**: 2022-2025 ground-effect era, 2017-2021 high-downforce era, V8 era, etc.
- **Regulation comparison**: side-by-side analysis of how the same strategy plays out under different regulation regimes
- **Design exploration**: "what if" regulation parameter sweeps
- **Future regulations**: as FIA announces changes, the platform should be able to model them quickly

The regulation preset system must be architected for this from the start — not hardcoded to 2026.

## Compute Architecture Vision

Currently: local-only on a single dev server (dionysus, Xeon W-2125 + GTX 1080 Ti), developed via SSH from a MacBook Air.

The vision includes flexible compute backends:

1. **Local compute** — current mode, runs on the developer's machine
2. **Remote compute via SSH** — run the simulation backend on a powerful remote machine, UI on a thin client (already partially the development model)
3. **Cloud compute** — deploy simulation backend to cloud infrastructure for heavier workloads or multi-user scenarios
4. **Onboarding** — clear setup paths for each deployment mode

This doesn't need to be built immediately, but architecture decisions (especially the simulation core boundary) should preserve this flexibility rather than baking in assumptions about where compute happens.

## Development Philosophy

- **Visualizations develop alongside models** — don't build visualization infrastructure ahead of what the model justifies, but don't treat it as an afterthought either. Each model advancement should have a corresponding visualization surface.
- **Progressive complexity** — both in what the platform teaches and in how it's built. Simple models → complex models, simple visualizations → rich interactive views, single-machine → distributed compute.
- **Honest about limitations** — label placeholders, show confidence levels, don't imply precision the model can't support.
- **Modular and expandable** — subsystem families, regulation eras, compute backends, data sources should all be pluggable.

## Open Vision Questions

These are not immediate blockers but should be revisited as the platform matures:

| Question | Why It Matters |
|----------|----------------|
| When does "educational scaffolding" become first-class content vs. just good UI? | Determines whether lessons/tutorials are a separate content layer or embedded in the visualization UX |
| What does "real-time strategy" actually require architecturally? | Determines whether the current Vite+Fastify stack can serve this or needs WebSocket/streaming architecture |
| How should multi-regulation presets be versioned and organized? | Current preset system works for 2026; multi-era needs thought |
| What's the right abstraction boundary for compute backend flexibility? | Determines where the "simulation API" cleanly separates from the "UI client" |
| Should the platform eventually support collaborative/multi-user scenarios? | Currently scoped as single-user, but the vision hints at broader use |
| When does puzzle/practice mode justify dedicated implementation work vs. remaining a deferred future? | The 3.2/3.3/3.4 corridor should preserve seams (artifact masking, scoring artifact role, difficulty metadata) but full puzzle delivery likely waits until after Phase 4 lessons land and Phase 6 telemetry import gives a credible ground-truth source. The seed file at `.planning/initiatives/seeds/puzzle-mode-pedagogy.md` tracks the revisit triggers. |
| Should puzzle skill ratings be persistent across sessions, and if so, where do they live? | Persistence implies a per-user store the platform doesn't currently have. Could initially be local-disk only; a multi-user back end would only matter once the platform itself goes multi-user. |

---
*This document captures the broader vision beyond the current v1 milestone. It should inform roadmap decisions, architectural choices, and audit evaluations.*
