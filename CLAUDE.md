# F1 Modeling Lab

Local-first interactive environment for learning Formula 1 car design, race strategy, and subsystem dynamics through inspectable reduced-order models and visual explanations.

## Quick Reference

```bash
npm install                    # install all workspace dependencies
npm run dev                    # start web + API (localhost by default)
HOST=0.0.0.0 npm run dev      # start with remote access (for Tailscale)
npm run build                  # build all workspaces
npm run test                   # run all workspace tests
npm run typecheck              # typecheck all workspaces
```

## Architecture

TypeScript monorepo (npm workspaces):

- `apps/web` — Vite + React browser workbench (port 5173)
- `apps/local-api` — Fastify file-backed API (port 8787)
- `packages/domain` — Scenario schema, preset contracts, run records (Zod-validated)
- `packages/sim-core` — Simulation harness contracts and model interfaces
- `packages/visuals` — Reusable React visual primitives (MetricTracePanel, RunComparisonCard, AssumptionPanel, TrackContextPlaceholder, WorkbenchShell)
- `presets/` — Regulation, weather, and other preset JSON files
- `workspace-data/` — Local run artifacts (git-ignored, human-inspectable JSON)

## Development Setup

Developer SSHes from apollo (MacBook Air) to dionysus (dev server) over Tailscale.
Browser runs on apollo; all processes run on dionysus.

- **Remote access:** `HOST=0.0.0.0 npm run dev`, then open `http://100.93.212.44:5173` on apollo
- **Fallback:** SSH tunnel `ssh -L 5173:127.0.0.1:5173 -L 8787:127.0.0.1:8787 dionysus`
- Vite proxy forwards `/api` requests to the Fastify API (always via localhost internally)

## Key Conventions

- **Honesty constraints:** Never imply model fidelity the current phase doesn't support. Label placeholder outputs explicitly.
- **Visible fidelity labeling:** If an artifact exposes fidelity, validation, or cross-era comparability/applicability state, the UI must surface it visibly. Metadata-only honesty labeling is not sufficient.
- **Browser-safe boundary:** `packages/domain` must stay browser-safe. Filesystem operations go in `packages/domain/node/` subpath.
- **Preset snapshots:** Run records carry both stable preset references and resolved snapshots for reproducibility.
- **Progressive visualization:** Visual components grow with model complexity. Don't build ahead of what the model justifies. For Phase 4+, use the accepted renderer-neutral substrate and migration discipline from the Vision Alignment Initiative instead of inventing one-off panel paths.
- **Accessibility is architectural:** New visualization substrate work must preserve WCAG AA minimum, keyboard traversal, accessible labels for anchors, and non-visual fallbacks where a renderer cannot expose native semantics.
- **Thin-client baseline:** Apollo-over-Tailscale responsiveness is the reference client path. Hover, brush, scrub, and panel focus behavior must stay client-local once artifacts are fetched.
- **Legacy renderer freeze:** Do not add new features to legacy hand-rolled SVG panels. Only bug fixes are allowed until shared primitive migration lands.
- **Phase 4 contract completion:** No D2 substrate implementation work closes without concrete `AccessibleChartContract` and `AnchorRegistry` definitions.
- **Strict TypeScript:** `noUncheckedIndexedAccess` enabled. Use `firstPreset<T>()` helper for safe indexed access in tests.
- **Future Awareness:** Each phase CONTEXT.md must include a "Future Awareness" section documenting architectural constraints imposed by future phases and v2 ambitions. This is not a deferred-features list -- it captures constraints that shape current implementation choices (e.g., "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs").
- **Vision alignment checkpoint:** Each phase CONTEXT.md and PLAN.md must answer: "Does this serve the long-horizon vision, or only the immediate milestone?" If the answer is milestone-only, record why the work is still justified.

## Quality Gates

Every plan execution must pass ALL of these before completion:

1. **`npm run typecheck`** — must pass across all workspaces
2. **`npm test` at project root** — must pass (not per-workspace, root catches cross-workspace regressions)
3. **`npm run build`** — must pass
4. **Phase verification** (gsdr-verifier) — must pass all success criteria
5. **Cross-phase regression** — after modifying shared browser/API code, verify prior phase tests still pass
6. **Benchmark evidence when applicable** — any plan that changes visualization substrate, linked interaction behavior, or async execution cadence must attach benchmark output against the accepted envelope and note regressions explicitly.

At phase completion:
- **Cross-model audit** — run `codex exec review` for independent Codex assessment (prompts saved to `.planning/audits/`)
- **Audit response** — document dispositions in `.planning/audits/audit-response-{date}.md`
- **Registry update when triggers fire** — if a known rewrite trigger or benchmark threshold fires, update the tech-debt registry entry in the same change set rather than leaving the trigger implicit in prose.

## Planning

All planning lives in `.planning/`:

- `PROJECT.md` — Core value, requirements summary, key decisions, open questions
- `REQUIREMENTS.md` — 42 v1 requirements mapped to roadmap phases
- `ROADMAP.md` — staged milestone path with success criteria and plan listings
- `STATE.md` — Current position, accumulated decisions, blockers
- `TECH-DEBT.md` — living registry of deferred work, rewrite triggers, and severity
- `deliberations/` — original concluded design deliberations before the Vision Alignment Initiative
- `initiatives/vision-alignment-2026-04/deliberations/` — D1/D2/D3/D5/D4 decision records and anchors from the Vision Alignment Initiative
- `phases/` — Per-phase context, plans, and summaries
- `gap-analysis-2026-03-26.md` — Comprehensive gap review

## Phase Planning Expectations

Future phase `CONTEXT.md` and `PLAN.md` work should include, in addition to `Future Awareness`, the following sections when relevant:

- `Vision Impact` — what long-horizon capability the phase protects or unlocks, and what milestone-only temptation it is resisting
- `Honesty Surface` — which artifacts or panels must show fidelity, validation, and comparability state visibly
- `Accessibility and Thin-Client` — keyboard interactions, accessible labels or summaries, and Apollo-over-Tailscale responsiveness assumptions
- `Performance Budget` — relevant envelope targets, the benchmark or measurement path, and what counts as a trigger to revisit architecture
- `Migration Discipline` — whether the plan touches legacy SVG, adds shared primitive coverage, or intentionally defers a registry item
- `Phase-4 Contract Completion` — when relevant, explicitly define `AccessibleChartContract` and `AnchorRegistry` before substrate code lands against D2 contracts

## Current Status

Phases 1-3.1 are complete. Phase 4 planning is paused pending the pre-Phase-4 foundation insertions from the Vision Alignment Initiative. Next planned work is Phase 3.2: Backend Execution, Job Artifacts, and Regulation Execution Flow.
