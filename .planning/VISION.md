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

---
*This document captures the broader vision beyond the current v1 milestone. It should inform roadmap decisions, architectural choices, and audit evaluations.*
