# Stage 1: Research — Vision Alignment Initiative

**Model:** gpt-5.4 (high reasoning, 1M context)
**Purpose:** Produce 5 focused research reports that will inform the deliberations in Stage 2.

---

You are executing the Research stage of a Vision Alignment initiative for the F1 Modeling Lab project at `/home/rookslog/workspace/projects/f1-modeling/`. This is a TypeScript monorepo building a serious F1 engineering and education platform. Phases 1-3.1 are complete. Before Phase 4 can be safely planned, the project needs research on several domains to inform architectural deliberations.

## Context files to read first (in order)

1. `.planning/VISION.md` — the long-term platform vision
2. `.planning/PROJECT.md` — current project definition, decisions, open questions
3. `.planning/ROADMAP.md` — 11-phase milestone with plans
4. `.planning/REQUIREMENTS.md` — 42 v1 requirements
5. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — the consolidated audit response with 15 findings
6. `.planning/initiatives/vision-alignment-2026-04/README.md` — this initiative's overview
7. `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — the master plan

## Supporting reads (as needed per research task)

- Current code: `packages/sim-core/src/contracts.ts`, `packages/sim-core/src/stintModel/stintRunner.ts`, `packages/sim-core/src/raceModel/raceRunner.ts`
- API: `apps/local-api/src/app.ts`, `apps/local-api/src/services/runService.ts`
- Visuals: `packages/visuals/src/` (list files, read 2-3 representative)
- Domain: `packages/domain/src/presets/schema.ts`, `packages/domain/src/scenario/schema.ts`, `packages/domain/src/runs/schema.ts`
- Config: `package.json`, workspace `package.json` files

## Research tasks

Produce 5 research reports. Each should cite external sources (documentation, GitHub repos, authoritative articles) via URLs and/or npm metadata. You may use shell commands for `npm view`, `curl` to fetch docs, or direct file reading.

---

### Task 1: Computational Backend Options

**Output file:** `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`

**Research question:** The F1 Modeling Lab's computational core is currently in TypeScript. The vision includes Phase 4.1 EKF observers, Phase 5 MPC-based control, Phase 7 parameter calibration, and eventual real-time strategy analysis. TypeScript's numerical ecosystem is weak for these. What are the serious long-term options for the computational backend, and what does migration look like?

**Cover:**

1. **Language candidates** (with concrete ecosystem analysis):
   - **Python**: NumPy, SciPy, CasADi (optimization), JAX (autodiff + GPU), numba/cython for hot paths, scipy.optimize, OSQP
   - **Rust**: nalgebra, faer, good-lp, argmin, ndarray, candle, wasmtime for WASM targeting
   - **C++**: Eigen, IPOPT, ALGLIB, ceres-solver, casadi-cpp
   - **Julia**: JuMP, DifferentialEquations.jl, ModelingToolkit.jl
   - **WebAssembly**: AssemblyScript, Rust→WASM, C++→WASM (Emscripten), performance ceiling
   - **Stay in TypeScript**: tensorflow.js numerics, ml-matrix, ml-levenberg-marquardt, optimization-js

2. **IPC boundary options** between TypeScript orchestration and compute backend:
   - JSON-RPC (simplicity, overhead)
   - gRPC / protobuf (schemas, performance)
   - stdio / pipes (simplicity, Python subprocess pattern)
   - Shared memory / memory-mapped files
   - WebSocket with binary frames
   - FFI via napi-rs / node-addon-api (in-process binding)

3. **Deployment models** (aligned with VISION.md flexible compute):
   - Local in-process (current)
   - Local sidecar process (Python subprocess, Rust binary subprocess)
   - Remote via SSH tunnel (dionysus-as-backend pattern already partially used)
   - Remote via HTTP API (any machine)
   - Cloud queue (BullMQ + worker, AWS Lambda, Cloud Run)
   - WASM in-browser (for light compute, preserves local-first)

4. **Migration cost assessment**: Given the current `packages/sim-core` TypeScript implementation (~2000 LOC of stint/race/tire/electrical/weather models), what would porting look like for each language? Which is easiest to start, which scales furthest?

5. **F1-specific considerations**: MPC solver quality (IPOPT, OSQP, CasADi all have different strengths), autodiff availability for observer Jacobians, real-time performance requirements, determinism for reproducibility.

**Recommendation format:** Not a single answer — a decision matrix with 2-3 candidate paths and their tradeoffs. The deliberation in Stage 2 picks the path.

---

### Task 2: Visualization at Scale

**Output file:** `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md`

**Research question:** The Phase 4 research recommended visx as the visualization foundation. The three audits pushed back, citing:
- React 19 compatibility issues with `@visx/xychart` via `@react-spring/web`
- SVG rendering ceiling for production density (6 strategies × 4 linked panels × per-lap state)
- No Canvas/WebGL escape hatch
- No performance budget defined

**Cover:**

1. **visx technical reality check**:
   - Run `npm view @visx/xychart version peerDependencies time --json` to verify current stable vs alpha state
   - Run `npm view @visx/xychart@3.13.2-alpha.0 dependencies --json` and follow the react-spring chain
   - Identify which visx packages have no react-spring dependency
   - Determine the minimum viable visx package set for linked views without `@visx/xychart`

2. **Rendering crossover analysis**:
   - At what DOM-element count does SVG performance degrade noticeably? (React reconciliation + browser layout)
   - Canvas performance characteristics (browser paint, composite, interaction handling)
   - WebGL: overkill for most, great for dense timeseries
   - Hybrid strategies: SVG for interactive semantic elements + Canvas for dense traces (how projects like TradingView, Grafana, Observable Plot handle this)

3. **Alternative and complementary libraries**:
   - **uPlot**: minimal, extremely fast for dense timeseries, poor for semantic/annotated charts
   - **Plotly.js**: scientific/engineering focused, built-in linked views, large bundle, React 19 compatibility via `react-plotly.js`
   - **deck.gl**: WebGL-based, great for spatial/geographic, overkill for timeseries
   - **Nivo**: higher-level than visx, built on d3, React 19 support
   - **Apache ECharts**: comprehensive, performant, less React-native
   - **Custom Canvas**: full control, maximum effort

4. **Performance budget methodology**:
   - How do production-grade visualization platforms define and enforce performance budgets?
   - Metrics that matter: first-paint, brush latency, hover latency, frame rate during drag, memory per chart
   - How to benchmark a "worst plausible view" in React + visx

5. **Recommendation**: What does a hybrid visualization strategy look like for F1 Modeling Lab? Which library serves which use case? Where does the renderer boundary sit in `packages/visuals`?

---

### Task 3: Educational Content Architectures

**Output file:** `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md`

**Research question:** VISION.md describes structured lessons, tutorials, and progressive learning paths with interactive visualizations of increasing complexity. The current roadmap treats educational requirements (EDU-01/02/03) as "learning views" — a UI concern. How do serious interactive learning platforms structure content as a first-class concern?

**Cover:**

1. **Reference platforms**:
   - **Observable notebooks** — how do they structure reactive cells and inter-notebook links?
   - **Jupyter Book / MyST** — Markdown + directives + cross-references, prerequisite graphs
   - **Brilliant** — lesson architecture, progressive challenge, interactive widgets
   - **Khan Academy** — skill trees, mastery tracking, prerequisite dependencies
   - **3Blue1Brown / Explorable Explanations** — Bret Victor-style inline interactives
   - **Distill.pub** — research-as-essay with embedded interactivity
   - **The Racing Line (F1 specific)** — if any dedicated F1 engineering learning resources exist

2. **Content schema patterns**:
   - `LessonUnit` shape: concept ID, prerequisites, learning objectives, associated interactive scenario, guiding questions, assessment hooks
   - Prerequisite graph representation (DAG, with what metadata?)
   - Role tags (strategy engineer, performance engineer, race engineer, etc.)
   - Difficulty/depth levels
   - Lesson-to-simulation-artifact binding (how does a lesson reference a specific simulation state or run?)

3. **Content-as-code vs content-as-data**:
   - Markdown + frontmatter (MDX, Contentlayer)
   - Structured JSON/YAML
   - TypeScript modules with typed lesson objects
   - Notebook-style (Observable-inspired)
   - Tradeoffs: authoring ergonomics vs type safety vs versioning

4. **Integration with engineering visualization**:
   - How should a lesson "attach" to a simulation artifact or chart state?
   - Annotation anchor patterns (think: Figma-style comments, Jupyter outputs)
   - Guided tour patterns (Shepherd.js, driver.js)
   - Composable overlays over existing charts

5. **Authoring workflow**:
   - Who writes lessons (the developer, a content author, AI-assisted)?
   - Version control and review
   - Preview and hot-reload during authoring
   - Content validation (prerequisites exist, scenarios resolve, etc.)

6. **Minimum viable content layer for F1 Modeling Lab Phase 4**:
   - What's the smallest content architecture that satisfies EDU-01 and EDU-03 without being a hand-wave?
   - How does it evolve to full vision scope?

---

### Task 4: Streaming and Job Architectures

**Output file:** `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`

**Research question:** All three audits identified the lack of streaming/job/progress infrastructure as critical. The vision requires live-updating strategy views, multi-strategy batch progress, eventual real-time telemetry alignment, and Phase 4.1 temporal exploration. What are the serious options for adding this to the current Fastify-based stack?

**Cover:**

1. **Transport options**:
   - **WebSocket** via `@fastify/websocket`: bidirectional, stateful, protocol overhead
   - **Server-Sent Events (SSE)**: unidirectional server→client, HTTP-native, simpler
   - **Long polling**: fallback, not ideal
   - **gRPC streams** (bidirectional, binary, requires codegen)
   - **Direct HTTP with chunked responses**

2. **Job lifecycle models**:
   - In-process async (Promise-based, simplest, local only)
   - BullMQ + Redis (mature Node.js job queue, requires Redis)
   - pg-boss (Postgres-backed, no Redis needed)
   - Temporal.io (workflow engine, overkill for this stage)
   - Custom in-memory queue with worker threads

3. **Progress reporting patterns**:
   - Event types: `started`, `progress`, `artifact_ready`, `completed`, `failed`, `cancelled`
   - Partial result delivery (stream stint artifacts as they complete)
   - Backpressure handling
   - Reconnection / replay semantics

4. **Protocol design for simulation progress**:
   - Event shape: `{ jobId, eventType, timestamp, payload }`
   - Payload typing via discriminated unions
   - Client subscription model
   - How to integrate with the current `SimulationHarness` synchronous contract

5. **Worker/compute separation**:
   - Fastify main process handles HTTP/WS + job dispatch
   - Worker threads or separate processes handle compute
   - How this enables the computational backend separation from Task 1

6. **Cancellation semantics**:
   - User cancels a run mid-simulation — what happens to partial results?
   - AbortSignal in Node.js
   - Cooperative cancellation in sim-core functions

7. **Minimum viable streaming infrastructure for Phase 4**:
   - Smallest addition that unblocks multi-strategy progress feedback
   - How it extends to Phase 4.1 temporal exploration
   - How it extends to eventual real-time vision

---

### Task 5: Multi-Regulation Typing Strategies

**Output file:** `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`

**Research question:** `packages/domain/src/presets/schema.ts` currently uses `values: z.record(z.string(), z.unknown())` for regulation presets. This worked for 2026 but will not scale to historical regulation eras (2022-2025 ground effect, 2017-2021 high downforce, V8 era, etc.) that the vision promises. How should multi-era regulation typing actually work?

**Cover:**

1. **Typing approaches**:
   - Discriminated unions in TypeScript + Zod: how to structure era-specific fields
   - Generic base + era-specific extensions
   - Versioned schemas (schema v1, v2, v3 with migrations)
   - Tagged unions with `regulationEra` discriminator
   - Branded types for compile-time era safety

2. **Schema evolution patterns**:
   - How to add a new era without breaking existing presets
   - Migration scripts from older preset formats
   - Zod's `.transform()` and `.preprocess()` for migration
   - Backward compatibility guarantees

3. **Preset inheritance and overrides**:
   - Base regulation + team-specific overrides
   - Regulation diff visualization (show what changed between eras)
   - Partial override patterns

4. **Regulation comparison data shapes**:
   - If a user wants to run "same scenario under 2022 vs 2026 regulations," what does the data model look like?
   - Cross-regulation equivalence (what's comparable, what isn't)
   - Era-specific subsystem presence (active aero exists in 2026, not in 2022)

5. **Reference domain-modeling projects**:
   - How do sports analytics projects handle rule versioning?
   - How do tax software / legal-compliance projects handle regulation versioning?
   - How do game engines handle version-dependent physics (e.g., chess variant rules)?

6. **Recommendation for F1 Modeling Lab**:
   - Specific proposed Zod schema shape
   - Migration path from current `values: record<string, unknown>` to typed families
   - What needs to happen in Phase 4 vs. later phases

---

## Output constraints

For each research file:

1. **Use cat heredoc** to write the file:
   ```bash
   cat > .planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md <<'RESEARCH_EOF'
   [content]
   RESEARCH_EOF
   ```

2. **Structure every file** with these sections:
   - `# Title`
   - `**Researched:** 2026-04-10`
   - `**Confidence:** HIGH/MEDIUM/LOW`
   - `## Executive Summary` (3-5 sentences)
   - `## Question`
   - `## Options and Analysis` (detailed, with citations)
   - `## Comparison Table` (explicit tradeoffs)
   - `## Recommendation` (grounded in the analysis)
   - `## Risks and Unknowns`
   - `## References` (URLs, package metadata, source citations)

3. **Cite sources concretely** — npm package metadata, GitHub URLs, documentation URLs, file paths with line numbers for repo references.

4. **Ground recommendations in evidence** — don't speculate without citation.

5. **Respect the vision constraints** — VISION.md is the ground truth for what this platform is trying to become.

## Execution order

1. Read all context files first (VISION.md, PROJECT.md, ROADMAP.md, REQUIREMENTS.md, audit-response)
2. Execute research tasks in any order — they are independent
3. Write each output file with cat heredoc
4. After all 5 files are written, print a brief summary of completion status and any files that could not be produced

## Completion signal

At the end, print a summary of exactly which files were written and their line counts:

```
Stage 1 complete.
- research/01-compute-backends.md (XXX lines)
- research/02-visualization-at-scale.md (XXX lines)
- research/03-educational-content-architectures.md (XXX lines)
- research/04-streaming-architectures.md (XXX lines)
- research/05-multi-regulation-typing.md (XXX lines)
```

Do not attempt to run deliberations or synthesis in this stage. Those are Stages 2 and 3.
