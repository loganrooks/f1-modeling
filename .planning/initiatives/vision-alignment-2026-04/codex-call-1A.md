# Call 1A: Compute Backends + Streaming Architectures Research

**Wave:** 1 (Research Round 1)
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** Terrain mapping (see RESEARCH-PRINCIPLES.md § Research Modes)
**Tasks:** R1 (compute backends) + R4 (streaming architectures) — batched because the compute boundary IS the streaming/job boundary; they are architecturally inseparable.

---

## MANDATORY: Read RESEARCH-PRINCIPLES.md first

Before doing ANY task work, read `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` completely. That document defines:

- The core commitment (non-foreclosure, terrain mapping mode, no premature solution evaluation)
- Research modes (you are in **terrain mapping** mode — do NOT rank or recommend winners)
- Required output sections (assumptions surfaced, trajectory analysis, precedent analysis, gray area handling, path of inquiry, dependencies and relations, confidence ledger)
- The **three-response gray area framework** (defer / follow-and-mark / revisit-later)
- Anti-patterns to avoid (premature closure, authority mimicry, hidden scope drift)
- Tone and conduct

If you find yourself drifting toward recommending a specific language or architecture as "the answer," stop and re-read the document. Your job in this call is to make the option space legible, not to pick.

---

## Context files (read in this order)

1. `.planning/VISION.md` — the long-term platform vision (READ FIRST — anchor for everything)
2. `.planning/PROJECT.md` — current project definition and decisions
3. `.planning/ROADMAP.md` — current 11-phase milestone
4. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — consolidated audit findings (especially Finding #3 simulation boundary, #4 streaming, #15 optimization track)
5. `.planning/initiatives/vision-alignment-2026-04/README.md` — initiative overview
6. `.planning/initiatives/vision-alignment-2026-04/PLAN.md` — master plan

## Code files relevant to this research

Read to understand the current computational core and API boundary:

- `packages/sim-core/src/contracts.ts` — the current `SimulationHarness` contract (synchronous)
- `packages/sim-core/src/stintModel/stintRunner.ts` — stint simulation loop
- `packages/sim-core/src/raceModel/raceRunner.ts` — race orchestration
- `packages/sim-core/src/stintModel/tireModel.ts` — numerical tire model
- `packages/sim-core/src/stintModel/electricalModel.ts` — numerical electrical model
- `apps/local-api/src/app.ts` — Fastify app construction
- `apps/local-api/src/services/runService.ts` — the "god service" that mixes compute orchestration, preset loading, and persistence
- `apps/local-api/src/routes/runs.ts` — HTTP dispatch
- Root `package.json` and workspace `package.json` files for dependencies

Scan `packages/sim-core/src/` structure to understand the full scope of TypeScript compute code that would be involved in any migration.

## Shell commands to run (as needed)

- `wc -l packages/sim-core/src/**/*.ts 2>/dev/null` — measure current compute core size
- `find packages/sim-core/src -name '*.ts' -not -name '*.test.ts' | head -30` — list compute source files
- `npm view <package-name> version peerDependencies --json 2>/dev/null` — check specific package metadata as needed
- `curl -s <url>` — fetch authoritative documentation if needed

## Research tasks

This call addresses TWO coupled research tasks. Treat them as one investigation because the compute boundary is the streaming/job boundary.

---

### Task R1: Computational Backend Options

**Research question (as received):** The F1 Modeling Lab's computational core is currently in TypeScript. The vision includes Phase 4.1 EKF observers, Phase 5 MPC-based control, Phase 7 parameter calibration, and eventual real-time strategy analysis. TypeScript's numerical ecosystem is weak for these. What are the serious long-term options for the computational backend, and what does migration look like?

**Reminder: you are in terrain mapping mode.** Your job is to map the option space with trajectory and precedent analysis, not to pick a winner. Map at least the options below and any others that surface:

**Language candidates** (analyze each with concrete ecosystem evidence):
- **Python** — NumPy, SciPy, CasADi (optimization), JAX (autodiff + GPU), numba/cython for hot paths, scipy.optimize, OSQP
- **Rust** — nalgebra, faer, good-lp, argmin, ndarray, candle, wasmtime
- **C++** — Eigen, IPOPT, ALGLIB, ceres-solver, casadi-cpp
- **Julia** — JuMP, DifferentialEquations.jl, ModelingToolkit.jl
- **WebAssembly** — AssemblyScript, Rust→WASM, C++→WASM (Emscripten)
- **Stay in TypeScript** — tensorflow.js, ml-matrix, ml-levenberg-marquardt, optimization-js
- **Hybrid configurations** — any combinations that deserve mapping

For each language, assess:
- Numerical ecosystem maturity (with citations)
- Optimization solver availability and quality (MPC-grade?)
- Autodiff availability (for EKF Jacobians, parameter fitting)
- Real-time performance characteristics
- Determinism guarantees
- Tooling maturity for scientific development

**Do not rank these.** Map their tradeoffs.

**F1-specific considerations to explore:**
- MPC solver quality differences (IPOPT vs OSQP vs CasADi)
- Autodiff for observer Jacobians
- Real-time scheduling requirements
- Determinism for reproducibility of run records

### Task R4: Streaming and Job Architectures

**Research question (as received):** All three audits identified the lack of streaming/job/progress infrastructure as critical. The vision requires live-updating strategy views, multi-strategy batch progress, eventual real-time telemetry alignment, and Phase 4.1 temporal exploration. What are the serious options for adding this to the current Fastify-based stack?

**Transport options** to map:
- WebSocket via `@fastify/websocket`
- Server-Sent Events (SSE)
- HTTP chunked responses
- gRPC streams
- Direct pub/sub (Redis, NATS)

**Job lifecycle models** to map:
- In-process async (Promise-based)
- BullMQ + Redis
- pg-boss (Postgres-backed)
- Temporal.io
- Custom in-memory queue with worker threads
- Language-native (Rust tokio tasks, Python asyncio, etc.)

**Protocol design space** to map:
- Event shape: `{ jobId, eventType, timestamp, payload }` vs alternatives
- Typed event unions
- Subscription models (per-job, broadcast, filtered)
- Cancellation semantics
- Partial result delivery
- Backpressure handling
- Reconnection/replay

**Worker/compute separation patterns:**
- Fastify main + worker threads
- Fastify main + separate worker process
- Fastify main + sidecar process (Python/Rust binary)
- Fastify main + remote backend (HTTP/gRPC)

### The coupling between R1 and R4

These are not two independent questions. The compute language choice constrains the streaming options (e.g., Python subprocess IPC patterns differ from in-process TypeScript async). The streaming protocol shape constrains the compute boundary (e.g., synchronous returns vs. streaming partial artifacts).

**Part of your job** is to make this coupling legible. Which language/streaming pairs are natural? Which fight each other? Where does the choice of one constrain the other?

---

## Required output

Write to `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md` and `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`.

**Important:** These are two output files but one investigation. Consider writing them with explicit cross-references where the coupling between compute and streaming matters.

**Output file format** — follow RESEARCH-PRINCIPLES.md § Required Output Sections for research files. The mandatory section order is:

1. Metadata (date, mode, confidence)
2. Executive Summary
3. Question as Received
4. Reframing (if any)
5. Assumptions Surfaced (3-5+, flag load-bearing ones)
6. Option Space (map, do NOT rank)
7. Trajectory Analysis (1/3/5-year per option, doors opened, doors closed)
8. Precedent Analysis (specific named cases, not generalities)
9. Gray Areas Encountered (using three-response framework)
10. Scope Expansion Notes
11. Path of Inquiry (branches considered, pursued, abandoned, reframed)
12. Dependencies and Relations (to other initiative questions)
13. Provisional Position (with calibrated confidence)
14. Confidence Ledger
15. Unresolved Questions
16. References (URLs, npm metadata, file:line citations)

**Use cat heredoc** to write each file:

```bash
cat > .planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md <<'R1_EOF'
[content]
R1_EOF
```

## Completion signal

At the end of the call, print:

```
Wave 1A complete.
- research/01-compute-backends.md (XXX lines)
- research/04-streaming-architectures.md (XXX lines)
```

Report any gray areas escalated via the three-response framework. Report any reframings that surfaced during the research. Report any scope expansions.

## Reminders

- **Terrain mapping mode** — do not pick winners. Map the space.
- **Honest uncertainty** — use confidence markers (known / likely / plausible / speculative / unknown)
- **Precedent analysis must cite specific named projects with documented outcomes** — not "industry standard"
- **Gray areas must be handled via the three-response framework** — defer / follow-and-mark / revisit-later, explicitly tagged
- **Path of inquiry must show branching paths** — what you considered, pursued, abandoned, reframed
- **Dependencies must be mapped** — cross-references to R2, R3, R5 where coupling exists
- **If you find yourself writing "the best option is..."** — stop, re-read RESEARCH-PRINCIPLES.md
