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
- **Browser-safe boundary:** `packages/domain` must stay browser-safe. Filesystem operations go in `packages/domain/node/` subpath.
- **Preset snapshots:** Run records carry both stable preset references and resolved snapshots for reproducibility.
- **Progressive visualization:** Visual components grow with model complexity. Don't build ahead of what the model justifies. Adopt a proper visualization library for Phase 4+ (deliberation pending).
- **Strict TypeScript:** `noUncheckedIndexedAccess` enabled. Use `firstPreset<T>()` helper for safe indexed access in tests.
- **Future Awareness:** Each phase CONTEXT.md must include a "Future Awareness" section documenting architectural constraints imposed by future phases and v2 ambitions. This is not a deferred-features list -- it captures constraints that shape current implementation choices (e.g., "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs").

## Quality Gates

Every plan execution must pass ALL of these before completion:

1. **`npm run typecheck`** — must pass across all workspaces
2. **`npm test` at project root** — must pass (not per-workspace, root catches cross-workspace regressions)
3. **`npm run build`** — must pass
4. **Phase verification** (gsdr-verifier) — must pass all success criteria
5. **Cross-phase regression** — after modifying shared browser/API code, verify prior phase tests still pass

At phase completion:
- **Cross-model audit** — run `codex exec review` for independent Codex assessment (prompts saved to `.planning/audits/`)
- **Audit response** — document dispositions in `.planning/audits/audit-response-{date}.md`

## Planning

All planning lives in `.planning/`:

- `PROJECT.md` — Core value, requirements summary, key decisions, open questions
- `REQUIREMENTS.md` — 42 v1 requirements mapped to 8 phases
- `ROADMAP.md` — 8-phase milestone with success criteria and plan listings
- `STATE.md` — Current position, accumulated decisions, blockers
- `deliberations/` — 6 concluded design deliberations (scope, control stack, visualization, dev architecture, pedagogy, data sources)
- `phases/` — Per-phase context, plans, and summaries
- `gap-analysis-2026-03-26.md` — Comprehensive gap review

## Current Status

Phases 1-3 complete. Phase 3.1 next: Race State, Typed Artifacts, and Branchable Runs.
