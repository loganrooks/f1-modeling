# F1 Modeling Lab

F1 Modeling Lab is a local-first engineering workbench for understanding Formula 1 design and race strategy through inspectable models, editable scenarios, and visual explanations of why a result changed.

Phase 1 establishes the monorepo, shared contracts, and local persistence shape that later plans will build on. This repository is intentionally being set up as a browser workspace plus a local API, not as a hosted product and not as a notebook-only prototype.

## Phase 1 Foundation

The root repository is an npm-workspaces monorepo with two future application slots and shared package space:

- `apps/web` for the local browser workbench
- `apps/local-api` for file-backed local persistence and run logging
- `packages/*` for shared domain, visual, and simulation contracts
- `workspace-data/` for local JSON artifacts that stay inspectable on disk

This local-first shape keeps saved scenarios and run records human-readable and diffable instead of hiding the canonical state inside browser-managed storage.

## Bootstrap

Install the root toolchain from the repository root:

```bash
npm install
```

Shared root scripts are defined now so later workspaces plug into a stable command surface:

- `npm run dev` starts the web app and local API together once those workspaces exist
- `npm run build` runs workspace builds
- `npm run test` runs workspace tests
- `npm run typecheck` runs workspace type checks

The command surface is fixed in this plan even though the actual app shells arrive in later Phase 1 plans.

## Tooling Baseline

Phase 1 starts with a TypeScript-first toolchain for a local web workbench and local API:

- React and Vite for the browser workspace
- Fastify for the local API
- Zod for shared runtime-validated contracts
- Vitest and Testing Library for shared test infrastructure
- `tsconfig.base.json` as the compiler baseline that later workspaces extend

## Scope Boundary

This phase is foundations only. It does not implement:

- lap or stint models
- telemetry ingestion
- observer methods
- MPC or other control solvers
- RL environments or policy training

Those capabilities are deferred to later phases after the local-first workspace, schemas, reproducibility, and reusable visual foundations are in place.
