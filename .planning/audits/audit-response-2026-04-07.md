# Audit Response — 2026-04-07

**Audits reviewed:**
- `.planning/audits/conformance-audit-2026-04-07.md` (Codex gpt-5.4, high reasoning)
- `.planning/audits/strategic-gap-audit-2026-04-07.md` (Codex gpt-5.4, high reasoning)
- `.planning/audits/conformance-prompt.md` (traceable input)
- `.planning/audits/strategic-gap-prompt.md` (traceable input)

**Reviewed by:** Claude Opus 4.6 + user (Logan Rooks)

---

## Disposition Summary

| # | Finding | Source | Disposition | Action |
|---|---------|--------|-------------|--------|
| 1 | Root test suite is red (App.test.tsx stale) | Conformance | **Accept** | Fix immediately |
| 2 | MODL-04/ENVR-01 over-claimed (ambient temp, traffic/SC) | Conformance | **Partial accept** | Refine MODL-04 wording for Phase 3 vs 4+ scope; wire ambientTemperatureC into tire thermal model |
| 3 | Verification artifacts stale after cross-phase changes | Conformance | **Accept** | Add root-level `npm test` as mandatory gate in every plan execution |
| 4 | Preset decoding uses unchecked casts | Conformance | **Accept, defer** | Type preset values when Phase 4 planning begins |
| 5 | Validation/data sequenced too late | Strategic | **Accept** | Add lightweight reference-data import as Phase 3.x or early Phase 4 plan |
| 6 | No race-state engine between stint model and strategy | Strategic | **Accept** | Insert Phase 3.1: Race State, Typed Artifacts, Branchable Runs |
| 7 | Scenario/run schemas not ready for Phase 4+ | Strategic | **Accept** | Address in Phase 3.1 |
| 8 | Electrical model too coarse for strategy/control | Strategic | **Partial accept** | Lap-level SoC adequate for Phase 4 strategy; add deploy-plan semantics in Phase 4; per-zone deployment in Phase 5 |
| 9 | Visualization stack approaching local maximum | Strategic | **Accept** | Adopt a proper visualization library; deliberate during Phase 4 planning |
| 10 | Phase 4 overloaded (strategy + observers + explanations) | Strategic | **Accept** | Split: Phase 4 = strategy + race simulation; observers/explanations move later |
| 11 | Phase 5 needs control-ready plant interface | Strategic | **Accept** | Add dedicated plant-interface plan to Phase 5 |
| 12 | Requirements too capability-shaped, not workflow-shaped | Strategic | **Partial accept** | Add pit-lane, tire inventory, traffic requirements for Phase 4; defer Monte Carlo/opponent to v2 |
| 13 | Racing line visualization timing | Strategic | **Accept** | Racing lines arrive only after control/trajectory backend (Phase 5+); future: model sensor error as probability distribution on optimal line |
| 14 | Quality gates insufficient | Both | **Accept** | Integrate cross-model reviews (Codex audits) as phase-completion gate; add root `npm test` to every execution |

## Detailed Decisions

### Immediate fixes (this session)

1. **Fix App.test.tsx** — update mocks for `/api/circuits`, align assertions with Phase 2/3 UI
2. **Wire ambientTemperatureC** — consume in tire thermal model (cooling rate affected by ambient temp)
3. **Refine MODL-04** — split requirement text into Phase 3 scope (weather/surface dynamics) and Phase 4+ scope (traffic, safety car, race interruptions)
4. **Add root `npm test` gate** — document as mandatory execution gate in CLAUDE.md

### Roadmap amendments (this session)

1. **Insert Phase 3.1** — Race State, Typed Artifacts, and Branchable Runs (4 plans)
2. **Add requirements** — pit-lane loss model, tire-set inventory, minimal traffic/rejoin abstraction, typed observer/controller configs, deploy-plan semantics, run lineage/branching
3. **Add Phase 5 plan** — control-ready plant interface (segment/time-step state transition API)
4. **Note Phase 4 scope adjustment** — focus on strategy + race simulation; observer work sequenced after

### Visualization strategy (deliberation needed)

**Decision: Adopt a proper visualization library.** Hand-rolled SVG served Phases 1-3 well but won't scale to strategy timelines, linked views, branch comparisons, and observer overlays.

Deliberation needed during Phase 4 planning:
- Library candidates: d3 + React bindings, visx (Airbnb), observable Plot, or lightweight canvas for dense traces
- Interaction patterns: linked brushing, shared cursors, time scrubbing, overlay composition
- Migration strategy: wrap existing SVG components or rebuild on new foundation

### Racing lines and optimal trajectories

**Decision: Racing lines are Phase 5+ only.** The current solver produces a speed envelope, not an optimal path. Racing lines require:
1. Control-ready plant interface (Phase 5 prerequisite)
2. Trajectory optimization (MPC or direct collocation)
3. Then visualization of the optimal path on track geometry

**Future ambition (noted for v2):** Model sensor error and estimation uncertainty as probability distributions on the optimal racing line. This connects observer/estimation work (Phase 4+) with trajectory visualization (Phase 5) to show how imperfect information affects optimal control — a powerful educational surface.

### Optimization strategy

**Decision: Take optimization seriously from Phase 5 onward.** This means:
- Phase 5 gets a proper constrained optimization formulation, not a heuristic wrapper
- MPC with explicit state/control/constraint definitions
- Path toward direct collocation or similar for trajectory optimization
- Clean interfaces so RL can be compared against MPC later

### Quality gates

**Decision: Multi-layer quality gates at every phase.**

Current gates (keep):
- `npm run typecheck` — must pass
- `npm test` — must pass at ROOT level (not per-workspace)
- `npm run build` — must pass
- Phase verification (gsdr-verifier) — must pass

New gates (add):
- **Cross-model audit** — run Codex review (`codex exec review`) at phase completion for independent assessment
- **Root test regression check** — `npm test` at project root, not just per-workspace, as mandatory gate in every plan execution
- **Cross-phase regression** — after any plan that modifies shared browser/API code, re-verify that prior phase tests still pass

Document in CLAUDE.md and enforce in execution workflow.

### Items deferred to v2

- Monte Carlo race evolution and ensemble analysis
- Full opponent/benchmark competitor model
- Power-unit thermal and cooling constraints
- Full brake thermal model
- Probabilistic sensor error distributions on racing lines
- Multi-car racecraft and overtaking logic

---

*Response authored: 2026-04-07*
*Next action: Implement immediate fixes, update roadmap, update requirements*
