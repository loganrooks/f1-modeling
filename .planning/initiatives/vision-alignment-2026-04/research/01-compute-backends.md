# Computational Backend Options

## 1. Metadata

- Date: 2026-04-10
- Mode: Terrain mapping
- Scope: Task R1, written in coupled investigation with `04-streaming-architectures.md`
- Confidence: Medium

## 2. Executive Summary

The current computational core is a synchronous TypeScript library with a single `run(request) -> summary` contract and no native notion of async jobs, partial artifacts, cancellation, or transport neutrality (`packages/sim-core/src/contracts.ts:6`, `packages/sim-core/src/contracts.ts:117`, `packages/sim-core/src/contracts.ts:123`). The HTTP layer mirrors that assumption: `POST /runs` resolves presets, executes compute, persists artifacts, and returns only when the full run record exists (`apps/local-api/src/routes/runs.ts:20`, `apps/local-api/src/routes/runs.ts:50`, `apps/local-api/src/services/runService.ts:151`, `apps/local-api/src/services/runService.ts:460`, `apps/local-api/src/services/runService.ts:672`).

That matters because the future roadmap is not just "more math." Phase 4.1 needs observer Jacobians and temporal replay, Phase 5 needs constrained optimization, Phase 7 needs repeated parameter fitting, and the vision explicitly preserves local, remote, and cloud compute modes. The research question therefore widens from "which language has the best numerical packages?" to "which backend shapes preserve optionality once compute is no longer a synchronous in-process call?"

Serious long-horizon options do exist. They fall into three families:

- Stay in TypeScript longer, but mostly as a bridge while introducing an async `SimulationBackend` boundary first.
- Move the numerical core to a scientific stack with established solver/autodiff tooling, most plausibly Python, Julia, C++, or a hybrid around them.
- Move the numerical core to a systems stack such as Rust or C++ and treat WebAssembly as a packaging target or deployment mode rather than as the primary scientific authoring environment.

No single option dominates every axis. Python has the broadest scientific and optimization ecosystem. Rust offers strong systems properties and decent lower-level numerics but a thinner nonlinear-control stack. C++ remains the deepest native-performance ecosystem but raises implementation and maintenance cost. Julia offers unusually strong numerical expressiveness but introduces adoption and deployment risk. WebAssembly is most credible as a distribution/runtime boundary, not as the primary place to author MPC- and calibration-grade numerics.

## 3. Question as Received

The F1 Modeling Lab's computational core is currently in TypeScript. The vision includes Phase 4.1 EKF observers, Phase 5 MPC-based control, Phase 7 parameter calibration, and eventual real-time strategy analysis. TypeScript's numerical ecosystem is weak for these. What are the serious long-term options for the computational backend, and what does migration look like?

## 4. Reframing

The original framing asks for backend language options. The load-bearing question appears one level lower:

- What boundary should own simulation execution, artifacts, and progress so the project can postpone language commitment where evidence is still incomplete?
- Which candidate backends are natural once that boundary exists, and which ones fight the current synchronous contract?
- Which migration shapes let the project keep TypeScript for UI/domain/API work without forcing TypeScript to remain the long-term numerical core?

This reframing does not replace the language question. It changes the unit of analysis from "single-language replacement" to "backend shape plus migration path."

## 5. Assumptions Surfaced

- Load-bearing: "The current TypeScript compute core must eventually be replaced wholesale." Not necessarily. A smaller outcome is possible where TypeScript remains orchestration, schema, and lightweight simulation glue while heavier numerical routines move out of process.
- Load-bearing: "Language choice is the primary blocker." Partly true, but the present blocker is equally the contract shape. A Python or Rust backend cannot express its strengths cleanly through today's synchronous `run()` API.
- "Real-time strategy" means hard real-time guarantees. The vision more often implies interactive or bounded-latency analysis than strict real-time scheduling.
- Load-bearing: "Determinism is a language property." It is also a protocol, persistence, and runtime property: seeded execution, artifact versioning, numeric library choice, and replay semantics matter as much as raw language.
- "WebAssembly is a compute language option." It is more accurately a deployment target/runtime boundary that depends on some source language and inherits that language's ecosystem strengths and gaps.
- Load-bearing: "A single backend must satisfy local, remote, cloud, educational, calibration, and control workloads equally well." Hybrid arrangements may be more durable than forcing one language/runtime to dominate all workloads.

## 6. Option Space

### Option A: Stay in TypeScript

- Current fit: Highest near-term continuity. The current non-test `sim-core` surface is still only about 3,220 LOC, and it already encodes lap, stint, and race orchestration in TypeScript (`packages/sim-core/package.json:1`; local measurement on 2026-04-10).
- Ecosystem maturity: Adequate for bespoke scalar math and moderate linear algebra, thin for serious scientific computing. `@tensorflow/tfjs`, `ml-matrix`, `ml-levenberg-marquardt`, and `optimization-js` exist, but they do not collectively match the breadth of NumPy/SciPy/CasADi/JuMP or mature native solver ecosystems.
- Optimization/autodiff: Weakest of the mapped options for MPC-grade constrained optimization. There is no obvious Node-native analogue to CasADi plus mature NLP/QP solver stacks.
- Performance/determinism: Good enough for current reduced-order models; weak evidence for repeated solve-heavy workloads, calibration loops, or denser real-time batch exploration.
- Tooling: Strong app/tooling ergonomics in the current repo. Scientific debugging, notebook-style exploration, and solver introspection are comparatively weak.
- Natural streaming pair: In-process async or worker-thread execution is the least-disruptive pairing. See `04-streaming-architectures.md`.

### Option B: Python Backend

- Ecosystem maturity: Broadest overall scientific stack in the field being mapped here. NumPy and SciPy provide dense numerics and optimization foundations; CasADi brings algorithmic differentiation and nonlinear optimization tooling; JAX supplies autodiff and accelerator-oriented array programming; Numba and Cython offer hot-path escape hatches.
- Optimization/autodiff: Strong. This is the only option in the set where the specific Phase 5 and Phase 7 needs already line up with widely used solver/autodiff tooling rather than requiring custom assembly.
- Performance/determinism: Python itself is not the performance story; the numerical kernels underneath it are. Determinism is achievable but depends on solver settings, BLAS/runtime choices, and backend selection.
- Tooling: Strongest scientific workflow support of the mapped options, especially for exploratory model iteration, calibration experimentation, and telemetry-facing analysis.
- Migration shape: Most naturally a sidecar or remote backend, not an in-process embed inside the current Fastify runtime.
- Natural streaming pair: Separate worker process or service with explicit job protocol. Python subprocess IPC can work, but HTTP/gRPC or message-bus boundaries fit the long-horizon vision better.

### Option C: Rust Backend

- Ecosystem maturity: Strong at systems engineering, growing but less complete in scientific optimization. `nalgebra`, `faer`, `ndarray`, `good_lp`, `argmin`, `candle`, and `wasmtime` cover linear algebra, optimization, tensors, and WASM embedding, but the nonlinear-control/autodiff story is less turnkey than Python/Julia/C++.
- Optimization/autodiff: Mixed. Convex and generic optimization options exist; the stack is thinner for MPC-oriented symbolic modeling and solver composition.
- Performance/determinism: Strong candidate where predictable memory behavior, native binaries, and controlled concurrency matter. Useful if the project wants a serious remote/local deployable compute service with tight operational control.
- Tooling: Strong compiler/runtime ergonomics for production services, weaker than Python/Julia for exploratory scientific workflows.
- Migration shape: Separate process, sidecar, or native library boundary. Rust also keeps open a later WASM packaging path more naturally than Python.
- Natural streaming pair: Sidecar process or dedicated service with typed event protocol. Rust plus WebSocket/NATS/gRPC pairings are natural.

### Option D: C++ Backend

- Ecosystem maturity: Deepest legacy scientific and optimization ecosystem in the set. Eigen, IPOPT, Ceres Solver, and CasADi's C++ interface map directly onto control, estimation, and fitting needs.
- Optimization/autodiff: Very strong, especially when the problem shapes are solver-heavy and performance-sensitive.
- Performance/determinism: Strongest raw-native-performance ceiling of the mapped options, with the usual caveat that determinism still depends on solver and threading choices.
- Tooling: Excellent library depth, high implementation and maintenance complexity. The downside is not capability but engineering cost and integration burden.
- Migration shape: Best treated as a sidecar or compiled core surfaced through a narrow API. Direct Node native-addon integration would tighten coupling in ways the vision is trying to avoid.
- Natural streaming pair: Separate process or remote service. C++ is a poor fit for the current in-process Fastify model unless a substantial FFI layer is introduced.

### Option E: Julia Backend

- Ecosystem maturity: Unusually strong for mathematical modeling. JuMP, DifferentialEquations.jl, and ModelingToolkit.jl directly target the kinds of optimization, simulation, and symbolic workflows the roadmap implies.
- Optimization/autodiff: Strong on paper, especially for symbolic model construction and optimization-friendly authoring.
- Performance/determinism: Can be very strong once compiled, but runtime and deployment ergonomics are a more significant adoption question than with Python or Rust.
- Tooling: Highly attractive for scientific authorship; materially riskier for a TypeScript-first application team with no established Julia footprint.
- Migration shape: Sidecar or service boundary. It is not a realistic in-process extension of the current Node app.
- Natural streaming pair: Similar to Python: async jobs over service/process boundaries rather than embedding.

### Option F: WebAssembly-Centered Backend

- Ecosystem maturity: Depends heavily on source language. Rust-to-WASM and C++ via Emscripten are credible; AssemblyScript keeps language continuity but inherits the weaker TypeScript scientific ecosystem.
- Optimization/autodiff: Better thought of as "portable execution of a backend written elsewhere" than as a primary scientific stack. The hard part remains authoring and maintaining the solver/modeling layer.
- Performance/determinism: Attractive for packaging, sandboxing, and browser/local portability. Less attractive as the sole answer for heavy nonlinear optimization or rich scientific tooling.
- Tooling: Good runtime packaging story, weaker debugging and scientific iteration story than native Python/C++/Julia workflows.
- Migration shape: Useful as a deployment target for selected kernels or for future browser-side execution experiments, not obviously the single long-term home for all compute.
- Natural streaming pair: Often still needs a host process for jobs, artifacts, persistence, and progress. WASM reduces deployment friction more than architectural complexity.

### Option G: Hybrid Configurations

- TypeScript orchestration + Python numerical backend: Natural if solver availability, calibration tooling, and telemetry-facing workflows dominate.
- TypeScript orchestration + Rust service: Natural if the project values operational simplicity, native binaries, and a future WASM path more than notebook-centric research workflows.
- TypeScript orchestration + C++ kernels or service: Natural if Phase 5/7 workloads become heavy enough that solver/library depth outweighs implementation cost.
- Python authoring + Rust/C++ hot paths: Natural if initial research velocity matters, then selected kernels need hardening.
- TypeScript plus WASM kernels: Natural for keeping selected numerics close to the UI, but weaker as a full-platform answer.

The hybrid family appears structurally important because it separates two concerns the original question partially conflates:

- The best language for UI/domain/API/product integration.
- The best language for scientific computing, optimization, and repeated numerical solves.

## 7. Trajectory Analysis

### Stay in TypeScript

- 1-year trajectory: Lowest disruption. Good fit for Phase 4 groundwork if the first move is boundary work rather than solver-heavy control.
- 3-year trajectory: Risk of accumulating bespoke numerics and weak solver options around EKF/MPC/calibration.
- 5-year trajectory: Likely constraining unless most advanced workloads are offloaded anyway.
- Doors opened: Maximum continuity, simpler onboarding, in-process local compute.
- Doors closed: Stronger scientific ecosystems remain harder to adopt later if the sync TypeScript contract deepens.

### Python Backend

- 1-year trajectory: Good fit for rapid research on estimation, control, and fitting once an async backend contract exists.
- 3-year trajectory: Strong path into telemetry alignment, calibration, and optimizer-rich workflows.
- 5-year trajectory: Still viable if operational boundaries are disciplined. Risk concentrates in deployment/ops complexity rather than math capability.
- Doors opened: Scientific ecosystem breadth, notebooks, calibration experimentation, telemetry-adjacent tooling.
- Doors closed: Single-language simplicity; some packaging and service-management ease.

### Rust Backend

- 1-year trajectory: More upfront engineering than Python, less immediate solver richness.
- 3-year trajectory: Strong service/runtime foundation if the project wants reproducible local/remote/cloud binaries.
- 5-year trajectory: Attractive if the platform becomes a serious distributed engineering tool with strict operational needs.
- Doors opened: Native service performance, controlled concurrency, WASM-adjacent deployment paths.
- Doors closed: Some scientific iteration speed and solver convenience.

### C++ Backend

- 1-year trajectory: Highest integration cost unless introduced narrowly.
- 3-year trajectory: Strong if specific solver-heavy workloads dominate and justify the investment.
- 5-year trajectory: Remains credible for a mature engineering platform, but only if the team is willing to carry native-complexity costs.
- Doors opened: Best-in-class solver/library depth and high-performance kernels.
- Doors closed: Rapid iteration and simpler polyglot operations.

### Julia Backend

- 1-year trajectory: High upside for model authoring, but adoption uncertainty is real.
- 3-year trajectory: Could become an elegant scientific core if the team commits and the deployment model proves manageable.
- 5-year trajectory: Either a differentiated strength or a maintenance island, depending on adoption.
- Doors opened: Symbolic modeling and optimization-centric workflows with high expressiveness.
- Doors closed: Mainstream hiring/community familiarity and some deployment confidence.

### WASM-Centered Backend

- 1-year trajectory: Best as selected-kernel packaging, not a full migration.
- 3-year trajectory: Good for portable modules or browser-adjacent execution.
- 5-year trajectory: Still likely complementary rather than exclusive.
- Doors opened: Portability, sandboxing, local/browser distribution patterns.
- Doors closed: Rich scientific authoring if treated as the primary environment.

### Hybrid Family

- 1-year trajectory: Highest optionality if the first milestone is transport/job separation rather than language commitment.
- 3-year trajectory: Lets the project learn which workloads actually need native or scientific stacks.
- 5-year trajectory: Most resilient to roadmap surprises because different workload families can settle into different runtimes.
- Doors opened: Progressive migration, heterogeneous workload placement, transport-neutral remote/local/cloud compute.
- Doors closed: Some architectural simplicity; higher protocol and observability demands.

## 8. Precedent Analysis

- Current-code precedent: The repo already follows the TUMFTM-style pattern of solving laps inside a higher-level stint/race orchestration loop rather than embedding all dynamics in one monolith (`packages/sim-core/src/stintModel/stintRunner.ts:1`, `packages/sim-core/src/raceModel/raceRunner.ts:1`). That favors a future where backend migration can happen at subsystem or orchestration seams rather than by complete rewrite.
- FastF1: A named motorsport-adjacent precedent for Python as a practical home for telemetry/session analysis. It does not prove Python is the answer here, but it does show that the ecosystem around racing data and engineering exploration is already Python-heavy.
- Ceres Solver: A named precedent for C++ as a long-lived production optimization stack. It demonstrates that native solver ecosystems remain the reference point when problems become nonlinear, repeated, and performance-sensitive.
- JAX ecosystem projects such as Brax: A precedent that differentiable simulation/control-adjacent workflows cluster around Python plus JAX rather than TypeScript.
- Jupyter kernels and the Language Server Protocol: Both are named precedents for keeping a UI/client in one environment while authoritative compute or analysis lives behind a process/message boundary. They matter here because they show a polyglot platform does not require the UI language and compute language to collapse into one.

## 9. Gray Areas Encountered

- Revisit later: Exact MPC solver choice. This research surfaced that "Python vs Rust vs C++" is partly downstream of whether the project wants SQP/NLP-heavy MPC, QP-based linear MPC, or something approximate. That is load-bearing for backend choice, but too specific to resolve in this terrain-mapping round. A later focused question should be: "What optimization problem classes does Phase 5 actually need to solve, at what cadence, and with what explanation surfaces?"
- Defer: GPU acceleration strategy. JAX and some Rust/C++ stacks make GPU use possible, but the current roadmap does not yet specify workloads that clearly require GPU acceleration.
- Follow and mark: Transport neutrality. This began as language research, but the current sync contract made backend-boundary analysis load-bearing enough that it was pursued here and cross-referenced to `04-streaming-architectures.md`.

## 10. Scope Expansion Notes

**Scope expansion encountered.**
Original framing: Long-term compute backend language options and migration.
Expansion observed: Execution-contract design and job boundary shape.
Response: Follow-and-mark.
Justification: Ignoring the boundary question would make the language mapping misleading, because several serious options are only natural once compute is no longer modeled as a synchronous in-process call.

## 11. Path of Inquiry

- Started with the received language list and the audit findings about optimization and compute-boundary gaps.
- Read the current code to test whether the repo already had async compute seams. It does not; the seam is still synchronous and summary-returning.
- Branched into "authoring ecosystem" versus "deployment/runtime" because WebAssembly and some Rust/C++ paths looked stronger as runtime targets than as scientific authoring environments.
- Reframed around migration shape after observing that `runService.ts` still compiles requests, resolves presets, executes simulation, and persists artifacts in one layer.
- Abandoned a narrower "compare numerical libraries only" path because it ignored the coupling to job lifecycle and remote/local/cloud compute modes.

## 12. Dependencies and Relations

- R4 Streaming Architectures: Tightest dependency. Backend language choice strongly constrains natural job, IPC, and progress-streaming patterns. See `04-streaming-architectures.md`.
- R2 Visualization at Scale: Moderate dependency. Dense live visualization changes the latency/update budgets that the backend must satisfy.
- R3 Educational Content Architectures: Moderate dependency. Educational replay, annotations, and observer comparisons increase demand for stable artifact schemas and time-indexed outputs more than for raw solver speed alone.
- R5 Multi-Regulation Typing: Moderate dependency. Stronger typed regulation families affect where scenario compilation ends and backend execution begins.

## 13. Provisional Position

- Known: The current TypeScript compute boundary is too narrow for the long-horizon vision because it only models synchronous completion.
- Likely: The serious long-term option space is not "TypeScript or one replacement language." It is "establish an async transport-neutral backend contract, then keep multiple backend languages viable behind it."
- Likely: Python, Rust, C++, Julia, and hybrid combinations all remain serious; a pure stay-in-TypeScript path looks weakest once MPC, calibration, and richer observer tooling become central.
- Plausible: WebAssembly becomes important later, but mainly as packaging/deployment support for selected kernels or native backends.

Confidence in that provisional position is medium because the project still lacks explicit performance budgets and a Phase 5 optimization-problem statement.

## 14. Confidence Ledger

- High confidence: The current repo boundary is synchronous and transport-specific.
- High confidence: The current Node/TypeScript dependency graph does not yet include serious job or scientific-computing infrastructure (`package.json:1`, `apps/local-api/package.json:1`, `packages/sim-core/package.json:1`).
- Medium confidence: Python is the strongest ecosystem match for Phase 4.1/5/7 research needs.
- Medium confidence: Rust is stronger as a service/runtime foundation than as the shortest path to solver-rich control research.
- Medium confidence: Julia is technically strong but adoption riskier in this project's current context.
- Low-to-medium confidence: WebAssembly will matter as a primary execution target for heavy control/calibration workloads rather than as a secondary packaging path.

## 15. Unresolved Questions

- What exact optimization problem classes must Phase 5 solve: QP, NLP, SQP, direct collocation, something simpler?
- How much of Phase 4.1 Jacobian work needs symbolic/autodiff support versus finite-difference baselines?
- What deterministic replay guarantees are required for run records across local and remote compute?
- Is notebook-style research velocity a first-class need for this project, or is service/runtime rigor more important than exploratory ergonomics?
- Which workloads, if any, must stay embeddable on the same machine as the UI versus move naturally to remote/cloud execution?

## 16. References

- Local code and project files:
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `packages/sim-core/src/contracts.ts:6`
  - `packages/sim-core/src/contracts.ts:123`
  - `packages/sim-core/src/stintModel/stintRunner.ts:1`
  - `packages/sim-core/src/raceModel/raceRunner.ts:1`
  - `apps/local-api/src/app.ts:54`
  - `apps/local-api/src/routes/runs.ts:20`
  - `apps/local-api/src/routes/runs.ts:50`
  - `apps/local-api/src/services/runService.ts:151`
  - `apps/local-api/src/services/runService.ts:460`
  - `apps/local-api/src/services/runService.ts:672`
  - `package.json:1`
  - `apps/local-api/package.json:1`
  - `packages/sim-core/package.json:1`
- npm metadata checked 2026-04-10:
  - `npm view @tensorflow/tfjs version description --json` -> `4.22.0`
  - `npm view ml-matrix version description --json` -> `6.12.1`
  - `npm view ml-levenberg-marquardt version description dependencies --json` -> `5.0.0`
  - `npm view optimization-js version description dependencies --json` -> `1.5.0`
- External references:
  - NumPy docs: <https://numpy.org/doc/stable/user/whatisnumpy.html>
  - SciPy optimize docs: <https://docs.scipy.org/doc/scipy/reference/optimize.html>
  - CasADi docs: <https://web.casadi.org/docs/>
  - JAX docs: <https://docs.jax.dev/en/latest/>
  - Numba docs: <https://numba.readthedocs.io/en/stable/user/5minguide.html>
  - Cython docs: <https://cython.readthedocs.io/en/latest/src/quickstart/overview.html>
  - OSQP docs: <https://osqp.org/docs/>
  - nalgebra docs: <https://docs.rs/nalgebra/latest/nalgebra/>
  - faer docs: <https://docs.rs/faer/latest/faer/>
  - good_lp docs: <https://docs.rs/good_lp/latest/good_lp/>
  - argmin docs: <https://docs.rs/argmin/latest/argmin/>
  - ndarray docs: <https://docs.rs/ndarray/latest/ndarray/>
  - Candle docs: <https://docs.rs/candle-core/latest/candle_core/>
  - Wasmtime docs: <https://docs.wasmtime.dev/>
  - Eigen docs: <https://eigen.tuxfamily.org/index.php?title=Main_Page>
  - IPOPT docs: <https://coin-or.github.io/Ipopt/>
  - Ceres Solver docs: <https://ceres-solver.readthedocs.io/latest/>
  - JuMP docs: <https://jump.dev/JuMP.jl/stable/>
  - DifferentialEquations.jl docs: <https://docs.sciml.ai/DiffEqDocs/stable/>
  - ModelingToolkit.jl docs: <https://docs.sciml.ai/ModelingToolkit/stable/>
  - Emscripten docs: <https://emscripten.org/docs/index.html>
  - TensorFlow.js API: <https://js.tensorflow.org/api/latest/>
  - FastF1 docs: <https://docs.fastf1.dev/>
  - Brax docs: <https://github.com/google/brax>
  - Language Server Protocol: <https://microsoft.github.io/language-server-protocol/>
  - Jupyter messaging docs: <https://jupyter-client.readthedocs.io/en/stable/messaging.html>
