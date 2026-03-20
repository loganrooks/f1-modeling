# Phase 1: Foundations and Scenario Schema - Research

**Researched:** 2026-03-19
**Domain:** Local-first application foundation, versioned scenario/run contracts, and progressive learning workspace architecture
**Confidence:** HIGH

## Summary

Phase 1 should establish a local-first web workbench, but it should not be a browser-only toy and it should not jump prematurely to a heavyweight distributed architecture. The best fit is a TypeScript-first local workspace with a React + Vite frontend, an npm-workspaces monorepo, shared domain packages for schemas and UI primitives, and a small local Node API for file-backed persistence. This gives the project an interactive browser workspace immediately while preserving inspectable JSON documents on disk, a clean path to heavier numerical backends later, and a stable place to encode versioned scenario, preset, and run-record contracts.

The decisive constraint is not rendering or compute. It is epistemic and architectural honesty. Phase 1 must make saved assumptions, presets, scenario definitions, and run outputs explicit enough that later model layers can plug in without a rewrite and without the UI implying fidelity that does not exist yet. That argues against a browser-only IndexedDB-first design as the primary persistence path, because IndexedDB is useful for structured local storage but hides core artifacts inside browser-managed storage and makes diff-friendly workflow awkward. It also argues against jumping to a desktop shell or a Python microservice this early, because those add packaging or IPC complexity before the project has even validated its basic workbench model.

**Primary recommendation:** build a local web workspace with:
- `apps/web`: React + Vite + TypeScript interactive workbench
- `apps/local-api`: small Node API for local JSON persistence and run logging
- `packages/domain`: versioned schemas, preset registry contracts, and shared types
- `packages/visuals`: reusable view primitives for cards, traces, inspectors, and comparison surfaces
- `packages/sim-core`: placeholder simulation interfaces and deterministic run harness, even if Phase 1 does not yet implement real lap dynamics

This is enough structure to support Phase 1 cleanly without overcommitting the future modeling stack.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Phase 1 scope is foundations only: local-first shell, schemas, run history, and reusable visualization primitives
- Product shape should be a local-first browser workspace, not a notebook-only or CLI-only tool
- The first UX should feel like an interactive engineering workbench, not a generic dashboard
- Visualization is a first-class learning surface and must remain honest to current model support
- Scenario, preset, and run-record concerns must be separated cleanly
- Schemas must leave room for later subsystem expansion, observer/control layering, and imported-data alignment
- Regulation logic should live in configurable presets, not scattered constants
- Prefer explicit assumptions and reversible decisions; avoid premature false precision
- Do not let Phase 1 expand into lap modeling, telemetry ingestion, EKF, MPC, or RL implementation

### Claude's Discretion
- Exact frontend and app-shell libraries
- Exact styling system
- Exact local persistence mechanism, so long as artifacts remain inspectable and reproducible
- Exact module names and internal layout

### Deferred Ideas (OUT OF SCOPE)
- Lap-time and stint models
- Tire, electrical, weather, and environment-coupling dynamics
- Observer methods
- MPC and driver-policy control
- RL policy optimization
- Telemetry ingestion and calibration
- Rich racing-line and controller-introspection views
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PLAT-01 | User can run the application locally and open an interactive browser workspace | Stack choice, local dev workflow, app shell recommendation |
| PLAT-03 | User can save and reload scenario configurations and simulation runs locally | Persistence model, file format, run logging contract |
| VAL-02 | Every saved run records model version, parameters, and context needed for later comparison | Run-record schema design, provenance fields, snapshot strategy |
| DESN-02 | Core model modules are separable so higher-fidelity submodels can replace reduced-order versions later | Package boundaries, domain model separation, simulation interface guidance |
| VISU-01 | Application provides a reusable visual workspace that can host progressively richer learning views as model fidelity grows | Visualization primitive set, workspace layout, honesty constraints |
</phase_requirements>

## Local Environment Snapshot

Observed in the current workspace:
- Node.js `v22.22.1`
- npm `10.9.4`
- `pnpm` not installed
- Python `3.13.5`
- clean git working tree before planning

Planning implication:
- prefer `npm workspaces` over `pnpm` for Phase 1 scaffolding because npm is available already and has official workspace support
- avoid assuming a Python backend in Phase 1, because the immediate product need is the browser workbench and file-backed local persistence, not scientific stack optimization yet

## Architecture Options

### Option A: Browser-only SPA with IndexedDB persistence

**Shape**
- React/Vite frontend only
- persistence in IndexedDB or localStorage
- all Phase 1 logic runs in-browser

**Strengths**
- fastest initial scaffolding
- no local API process
- keeps everything in one deployable web app

**Weaknesses**
- core artifacts are stored inside browser-managed storage instead of normal files
- diff-friendly, human-inspectable scenario and run records become awkward
- later import/export and shared domain tooling must be added after the fact
- browser APIs for user-file writes require consent-driven flows and are unevenly ergonomic

**Verdict**
- viable for a toy foundation
- wrong for this project because inspectable local artifacts and future numerical/runtime flexibility matter more than shaving off the local API

### Option B: Local web app plus minimal local API

**Shape**
- React/Vite frontend for the workbench
- small local Node service for workspace persistence and run logging
- shared TypeScript packages for schemas and UI contracts

**Strengths**
- still local-first and browser-hosted
- JSON artifacts live on disk where they are inspectable and diffable
- clean seam for later heavier compute or Python subprocess integration
- easy to keep domain models shared between frontend and backend
- avoids browser-storage opacity as the canonical persistence path

**Weaknesses**
- slightly more setup than browser-only
- introduces an application boundary earlier

**Verdict**
- best balance for Phase 1
- recommended architecture

### Option C: Desktop shell first (Electron or Tauri)

**Shape**
- desktop app wrapper around web UI
- direct filesystem access from app shell

**Strengths**
- good long-term local product ergonomics
- direct local file management possible

**Weaknesses**
- adds packaging/distribution decisions too early
- distracts from the domain and workbench questions
- Phase 1 does not need native-shell concerns yet

**Verdict**
- defer
- could be a later packaging decision once the web workbench proves itself

## Recommendation: TypeScript Workbench with Local File-Backed API

### Why this is the right cut now

1. **It matches the product shape already decided.**
   The user wants a locally hostable interactive webpage or similar. A React/Vite workbench served locally fits directly.

2. **It satisfies inspectability better than browser-only persistence.**
   Scenario and run documents can live as ordinary JSON files in a local workspace directory instead of only inside IndexedDB.

3. **It preserves a path to future compute escalation.**
   Later phases can keep the frontend stable while changing the simulation implementation behind a local service boundary, or by attaching Python workers where justified.

4. **It supports a shared schema story.**
   Shared TypeScript packages let the UI, persistence layer, and future simulation orchestration agree on exact document shapes.

5. **It keeps the first milestone honest.**
   Phase 1 does not need distributed systems, cloud infra, or desktop packaging. It needs a good local engineering workbench.

## Standard Stack

### Recommended for Phase 1

| Area | Recommendation | Why |
|------|----------------|-----|
| Package manager | npm workspaces | Already installed locally; officially supported; enough for this repo size |
| Frontend | React + TypeScript | Strong fit for interactive inspector-style UI and progressive educational surfaces |
| Build/dev server | Vite | Officially supported React-from-scratch path; fast local dev; monorepo-friendly |
| Local API | Fastify + TypeScript | Simple local JSON endpoints, native JSON handling, good schema-oriented ergonomics |
| Schema layer | TypeScript-first runtime-validated schemas | Need single source of truth for scenario/preset/run contracts and migrations |
| Testing | Vitest for shared packages and frontend logic | Keeps test story aligned with Vite/TypeScript stack |
| Styling | Plain CSS modules or scoped CSS with design tokens | Enough for an intentional workbench UI without overcommitting to a component framework |

### Why not heavier choices yet

| Instead of | Could use | Why not in Phase 1 |
|------------|-----------|--------------------|
| npm workspaces | pnpm, Turborepo, Nx | Extra tooling is not justified yet; pnpm is not installed locally |
| Fastify local API | Python/FastAPI service | Premature split before real numerical needs emerge |
| Desktop shell | Electron/Tauri | Packaging concern arrives before the workbench contract is validated |
| Full-stack React framework | Next, Remix, TanStack Start | Useful later, but Phase 1 does not need SSR or hosted deployment concerns |

## Package and Repository Layout

### Recommended structure

```text
apps/
  web/
    src/
      app/
      pages/
      components/
      features/
      styles/
  local-api/
    src/
      routes/
      persistence/
      services/

packages/
  domain/
    src/
      scenario/
      presets/
      runs/
      versions/
  visuals/
    src/
      workspace/
      cards/
      traces/
      inspectors/
  sim-core/
    src/
      contracts/
      harness/
      placeholders/

presets/
  regulations/
  weather/
  sessions/

workspace-data/
  scenarios/
  runs/
```

### Package responsibilities

#### `packages/domain`
- canonical domain contracts
- versioned scenario, preset, and run-record document shapes
- migration hooks and compatibility metadata
- no framework-specific UI code

#### `packages/visuals`
- reusable workbench primitives:
  - inspector panes
  - metric cards
  - comparison tables
  - trace panels
  - assumption/provenance panels
  - track-context placeholder surface

#### `packages/sim-core`
- Phase 1 only needs interfaces and a deterministic run harness
- no real lap model yet
- should establish where model version, seeds, and run execution metadata come from

#### `apps/local-api`
- file-backed load/save for scenarios and runs
- preset discovery and listing
- run-record write path
- no heavy business logic

#### `apps/web`
- workbench layout
- scenario editor
- preset selectors
- run history and comparison views
- visualization primitives integration

## Domain Contract Design

### Separate document families

Do **not** collapse everything into one giant workspace blob. Phase 1 should define at least these contract families:

1. **Scenario document**
   - what the user intends to run
   - references selected presets
   - contains placeholders for future driver, controller, observer, and imported-data alignment settings

2. **Preset documents**
   - regulation preset
   - session preset
   - weather/environment preset
   - possibly driver placeholder preset later

3. **Run record**
   - immutable snapshot of what actually ran
   - includes scenario snapshot or resolved references
   - model version, timestamp, deterministic seed, execution metadata, and key outputs

### Recommended run-record rule

Every run record should include both:
- stable references to the named presets/scenario it came from
- an embedded resolved snapshot of the effective inputs at execution time

That avoids future confusion when presets evolve after a run was recorded.

### Minimum Phase 1 fields

#### Scenario
- `schemaVersion`
- `scenarioId`
- `name`
- `circuit`
- `sessionType`
- `regulationPresetId`
- `weatherPresetId`
- `driverProfilePlaceholder`
- `notes`

#### Preset metadata
- `schemaVersion`
- `presetId`
- `presetType`
- `name`
- `source`
- `sourceType` (`documented-fact` | `engineering-inference` | `placeholder`)
- `description`

#### Run record
- `schemaVersion`
- `runId`
- `createdAt`
- `scenarioId`
- `scenarioSnapshot`
- `presetSnapshots`
- `modelVersion`
- `appVersion`
- `seed`
- `status`
- `summaryMetrics`
- `artifacts`
- `assumptionNotes`

## Visualization Guidance

### Phase 1 primitives to build now

1. **Workbench shell**
   - left-side configuration area
   - central results or workspace area
   - right-side inspector or assumptions pane

2. **Comparison card**
   - displays scenario/run metadata in a compact, reusable form

3. **Trace or metrics panel**
   - even if populated with placeholder or stubbed outputs initially
   - should establish how future timeseries and subsystem traces will appear

4. **Assumption and provenance panel**
   - makes documented fact vs inference vs placeholder visible

5. **Track-context placeholder**
   - a deliberately modest visual zone for future circuit geometry or trajectory overlays
   - should not imply racing-line fidelity yet

### Visual anti-patterns

- fake racing lines before Phase 2 can justify them
- animated policy overlays with no real policy semantics
- dense dashboards without editable cause/effect mapping
- hiding assumptions in tooltips or modal dead-ends

## Persistence Model

### Recommended Phase 1 persistence path

- canonical storage in `workspace-data/` JSON documents via local API
- browser state can cache currently open work, but it should not be the only persistence path
- export/import should reuse the same JSON document families rather than inventing separate formats later

### Why not IndexedDB as canonical storage

IndexedDB is useful for large structured client-side storage and offline behavior, but for this project it is better treated as an implementation detail or cache than as the canonical record. The user wants inspectable model artifacts and disciplined iteration. File-backed JSON fits that better.

## Architecture Patterns

### Pattern 1: Shared domain contracts first

**What:** define versioned scenario/preset/run schemas in a shared package before wiring the UI or persistence heavily around ad hoc objects.

**Why:** schema drift is one of the hardest Phase 1 mistakes to unwind.

### Pattern 2: Immutable run records

**What:** treat runs as append-only records rather than mutable workspace blobs.

**Why:** comparison, provenance, and calibration later all depend on trustworthy historical records.

### Pattern 3: Honest placeholder seams

**What:** create empty but explicit slots for future model layers such as observer config, controller config, and richer environment state.

**Why:** better than pretending those layers do not exist or hard-coding around their absence.

### Pattern 4: Visualization primitives as reusable modules

**What:** create cards, inspectors, trace containers, and comparison surfaces as reusable modules rather than custom one-off page markup.

**Why:** later subsystem views should plug into a stable visual language.

## Anti-Patterns to Avoid

- **One giant app-state object:** makes migrations, persistence, and future subsystem layering harder
- **Browser-only opaque persistence:** conflicts with inspectable local artifact goals
- **Hard-coded regulation constants in UI code:** guarantees rework when regulation presets expand
- **Premature Python or multi-process compute architecture:** unnecessary before Phase 2 actually needs it
- **UI-first visuals with fake fidelity:** undermines the educational aim
- **Schema definitions trapped in frontend components:** prevents backend and persistence reuse
- **Using Phase 1 to sneak in a real simulator:** blurs milestone boundaries and creates weak foundations

## Planning Guidance

### Plan 01-01 should own
- npm workspaces monorepo scaffold
- `apps/web`, `apps/local-api`, `packages/domain`, `packages/visuals`, `packages/sim-core`
- baseline TypeScript toolchain and dev scripts
- one command to run the local workbench stack

### Plan 01-02 should own
- versioned document contracts for scenario, presets, and run records
- preset registry/loading contract
- resolved-snapshot rule for run records
- schema validation and seed/model-version provenance fields

### Plan 01-03 should own
- first workbench layout
- scenario editor and preset selection surface
- run history list or comparison card surface
- local save/load roundtrip through the local API
- reusable visual primitives and assumption/provenance panel

## Recommended Planning Checks

- Does every Phase 1 plan improve local usability, schema stability, reproducibility, extensibility, or educational legibility?
- Are scenario, presets, and run records all represented explicitly?
- Can the planner show where future observer/control/model layers will attach without implementing them?
- Does any visual element imply fidelity the current foundation does not support?
- Does the persistence path produce inspectable artifacts on disk?

### Genuine Gaps

No genuine gaps currently require a spike before Phase 1 planning.

The remaining uncertainties are normal planning choices, not blockers:
- exact schema-validation library
- exact CSS/styling approach
- exact Fastify route structure
- exact visual component naming

These should remain planner discretion within the constraints above.

## Final Recommendation

Plan Phase 1 around a **TypeScript npm-workspaces local workbench** with:
- React + Vite in `apps/web`
- a minimal Fastify local API in `apps/local-api`
- shared versioned contracts in `packages/domain`
- reusable educational UI primitives in `packages/visuals`
- a placeholder simulation contract package in `packages/sim-core`
- canonical JSON artifacts on disk in `workspace-data/`

This is the cleanest way to satisfy Phase 1 while preserving honest extensibility for the rest of the roadmap.
