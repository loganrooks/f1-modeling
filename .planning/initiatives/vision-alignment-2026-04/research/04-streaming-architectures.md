# Streaming And Job Architectures

## 1. Metadata

- Date: 2026-04-10
- Mode: Terrain mapping
- Scope: Task R4, written in coupled investigation with `01-compute-backends.md`
- Confidence: Medium

## 2. Executive Summary

The current stack has no first-class job model. `buildApp()` registers plain HTTP routes, and `POST /runs` executes a requested harness and returns a completed run record or error in one request/response cycle (`apps/local-api/src/app.ts:54`, `apps/local-api/src/routes/runs.ts:44`, `apps/local-api/src/routes/runs.ts:50`). There is no current interface for submit, subscribe, cancel, replay, or fetch-artifact-later semantics. That absence is architectural, not just missing UI polish.

The serious option space therefore starts one layer above transport choice. Before WebSocket versus SSE versus gRPC can be meaningfully evaluated, the project needs an execution contract that separates:

- job submission
- progress and partial artifact emission
- durable artifact retrieval
- cancellation
- replay/reconnection behavior

Once that exists, multiple transport and queue choices remain viable. The options cluster into recognizable families:

- lightweight local-first patterns: in-process async plus SSE or WebSocket
- medium-weight brokered jobs: BullMQ plus Redis, pg-boss plus Postgres, or custom process queues
- durable workflow orchestration: Temporal
- service-oriented compute boundaries: sidecar or remote backend over HTTP/gRPC, optionally backed by pub/sub such as Redis or NATS

No transport is universally best. SSE is simpler for one-way progress streams. WebSocket is more flexible for bidirectional control and richer subscription patterns. HTTP chunking is the lightest but least opinionated. gRPC is strongest when the compute boundary is already a service boundary and typed multi-language contracts matter. Brokered pub/sub is not itself a user-facing transport; it is an internal coordination layer that becomes useful as soon as the compute engine moves out of process.

## 3. Question as Received

All three audits identified the lack of streaming/job/progress infrastructure as critical. The vision requires live-updating strategy views, multi-strategy batch progress, eventual real-time telemetry alignment, and Phase 4.1 temporal exploration. What are the serious options for adding this to the current Fastify-based stack?

## 4. Reframing

The original framing asks about adding streaming to a Fastify stack. The load-bearing question appears to be:

- What execution model should own simulation jobs independent of whether transport is HTTP, WebSocket, SSE, gRPC, or a broker?
- Which transport and queue options are natural for each compute-backend shape?
- What protocol semantics need to exist even if the underlying transport changes later?

This moves the question from "choose a streaming library" to "define a transport-neutral job protocol that Fastify can host first, but not own forever."

## 5. Assumptions Surfaced

- Load-bearing: "Streaming" is only a transport problem. It is equally a job-lifecycle and artifact-model problem.
- Load-bearing: "Fastify should remain the compute runtime." The current app can be the first backend host without being the permanent compute runtime.
- "Real-time" requires bidirectional low-level sockets immediately. Some early requirements may be satisfied by one-way event streams plus explicit REST fetches.
- Load-bearing: "Progress events and result artifacts are the same thing." They are related but distinct. A stable architecture usually treats progress as ephemeral and artifacts as durable fetchable outputs.
- "A queue is only needed for cloud scale." Even a local-first app benefits once compute becomes cancelable, branchable, or multi-strategy.
- Load-bearing: "Subscription shape can be decided later." Reconnection, replay, and event typing become painful to retrofit once clients start depending on ad hoc payloads.

## 6. Option Space

### Transport Options

#### WebSocket via `@fastify/websocket`

- Shape: Persistent bidirectional connection between browser and Fastify-hosted gateway.
- Strengths: Supports progress events, cancellation, filtered subscriptions, command/control traffic, and future interactive sessions without opening multiple channels.
- Weaknesses: Higher state-management burden than SSE. Reconnection and replay semantics must be designed explicitly.
- Best fit: Rich per-job and multi-panel interactive sessions, especially if the client may later send pause/cancel/branch commands over the same channel.
- Natural backend pairings: In-process TypeScript jobs, sidecar services, and broker-backed workers all fit.

#### Server-Sent Events

- Shape: One-way server-to-client event stream over HTTP.
- Strengths: Simpler than WebSocket for progress feeds, browser-native reconnection model, easy mental model for append-only job events.
- Weaknesses: Client-to-server control still needs separate HTTP endpoints. Less natural for interactive bidirectional sessions.
- Best fit: Early local-first progress, artifact-ready notifications, replayable event feeds.
- Natural backend pairings: In-process jobs, worker processes, broker-backed jobs. Especially attractive if the browser mostly needs "tell me what changed" rather than full duplex control.

#### HTTP Chunked Responses

- Shape: Stream chunks from the original request without creating a long-lived subscription abstraction.
- Strengths: Smallest conceptual step from today's synchronous API.
- Weaknesses: Weakest replay/reconnect semantics, awkward for long-lived job observation across tabs or sessions, and poor fit once jobs outlive the originating request.
- Best fit: Transitional experiments and proof-of-concept progress streaming.
- Natural backend pairings: Mostly in-process or tightly coupled worker patterns.

#### gRPC Streams

- Shape: Typed service contracts with streaming RPCs, usually most compelling when there is already a service boundary.
- Strengths: Strong multi-language contracts, natural unary-plus-stream method families, good fit for sidecar or remote compute services.
- Weaknesses: More infrastructure and tooling weight than SSE/WebSocket inside the current local-first Fastify app. Browser access often still needs a gateway layer.
- Best fit: Python/Rust/C++ service boundaries where strongly typed service definitions are worth the cost.
- Natural backend pairings: Sidecar/remote compute, not the smallest move for in-process Fastify jobs.

#### Direct Pub/Sub: Redis or NATS

- Shape: Brokered event distribution between API gateway and worker processes/services.
- Strengths: Decouples producers and consumers, helps when multiple workers or future remote backends emit events.
- Weaknesses: Not sufficient alone for browser delivery. Usually paired with WebSocket/SSE at the edge.
- Best fit: Multi-process or distributed backends, especially when jobs can run outside the Fastify process.
- Natural backend pairings: BullMQ plus Redis, NATS-backed services, remote compute fleets.

### Job Lifecycle Models

#### In-Process Async

- Shape: Promise-based jobs inside the Fastify process.
- Strengths: Smallest incremental step; minimal deployment overhead.
- Weaknesses: Shares fate with the HTTP process, weak durability, cancellation and concurrency isolation are limited, CPU-heavy work still blocks unless moved to threads or subprocesses.
- Best fit: Early Phase 4 local-first groundwork if compute remains TypeScript and job counts stay modest.

#### BullMQ + Redis

- Shape: Redis-backed job queue with explicit workers.
- Strengths: Mature queue semantics, retries, delayed jobs, worker separation, and an existing Node ecosystem footprint.
- Weaknesses: Adds Redis as infrastructure and still leaves progress/event protocol design to the app.
- Best fit: TypeScript-centric systems that want worker separation before adopting heavier workflow orchestration.

#### pg-boss

- Shape: Postgres-backed jobs and scheduling.
- Strengths: Attractive when the project already wants Postgres and wants to avoid Redis as an extra moving part.
- Weaknesses: Less natural than Redis/NATS for high-frequency pub/sub. Still separate from browser delivery concerns.
- Best fit: Durable local/remote job execution in stacks already standardizing on Postgres.

#### Temporal

- Shape: Durable workflow orchestration with explicit workflow/activity semantics.
- Strengths: Strong durability, retries, long-running workflow support, and a serious model for cancellation and state progression.
- Weaknesses: Highest conceptual and operational weight in this option set. May be too large for the current local-first stage unless the project commits early to durable distributed workflows.
- Best fit: Long-running, restart-safe, multi-step workflows where failure semantics and auditability matter as much as raw queueing.

#### Custom In-Memory Queue plus Worker Threads

- Shape: Hand-rolled scheduler in the Node process, offloading CPU work to `worker_threads`.
- Strengths: Fits current stack and local-first constraints; avoids external infra.
- Weaknesses: Durability, replay, and orchestration semantics must be invented locally. The project inherits long-term queue maintenance.
- Best fit: Transitional local architecture when compute remains in TypeScript and throughput demands are moderate.

#### Language-Native Job Models

- Shape: Python `asyncio`, Rust `tokio`, or language-native task systems once compute leaves Node.
- Strengths: Let the compute service use its natural concurrency model.
- Weaknesses: Browser-facing protocol and durable job registry still need a gateway or shared contract.
- Best fit: Sidecar or remote compute services where Fastify becomes a thin gateway.

### Protocol Design Space

#### Event Shape

- Base pattern: `{ jobId, eventType, timestamp, payload }` is a strong minimal spine because it supports logging, replay, and transport-independent framing.
- Alternative shapes: sequence-numbered envelopes, per-artifact topics, or richer metadata envelopes including `runId`, `artifactId`, `attempt`, `progress`, and `causalParent`.
- Load-bearing addition: `sequence` or monotonic index should likely be present if replay and reconnection matter.

#### Typed Event Unions

- Strong candidate: explicit unions such as `job-submitted`, `job-started`, `progress`, `artifact-ready`, `job-completed`, `job-failed`, `job-cancelled`, `heartbeat`.
- Benefit: lets TypeScript clients, other services, and later polyglot backends share the same semantics even if transports differ.
- Risk if skipped: event schemas become transport- and route-specific, which makes later replay and multi-backend work harder.

#### Subscription Models

- Per-job: simplest and most natural starting point.
- Broadcast: useful for queue dashboards or operator views.
- Filtered: needed once there are multi-strategy batches, run families, or engineer-role filtered panels.
- Likely path: start per-job, reserve room for per-run-family and filtered subscriptions.

#### Cancellation Semantics

- Minimum viable: best-effort cancellation request plus explicit terminal event.
- More serious model: state machine with `queued -> running -> cancelling -> cancelled/completed/failed`.
- Coupling: cancellation is easier to model cleanly when jobs are externalized from the request/response path.

#### Partial Result Delivery

- Strong candidate: emit progress events and durable artifact-available events separately.
- Example pattern: event says "`artifact-ready`" with IDs; client then fetches the artifact over REST.
- Benefit: avoids bloating live transport with large payloads while keeping the protocol durable.

#### Backpressure Handling

- Event coalescing for high-frequency progress.
- Snapshot-plus-delta pattern for dense traces.
- Broker buffering only if needed; do not assume every trace point belongs on the live channel.

#### Reconnection and Replay

- SSE gives a built-in reconnection story, but only if event IDs and replay windows exist.
- WebSocket requires explicit replay semantics.
- Load-bearing design decision: whether the protocol is append-only and replayable from durable storage, or only best-effort live telemetry.

### Worker/Compute Separation Patterns

#### Fastify Main plus Worker Threads

- Smallest shift from today.
- Best when compute remains TypeScript and local-first.
- Weak when the project later wants Python/Rust/C++ backends or durable job semantics.

#### Fastify Main plus Separate Worker Process

- Cleanly separates request handling from compute even inside the same host.
- Good middle ground for local-first systems.
- Natural stepping stone before introducing Redis/NATS or remote backends.

#### Fastify Main plus Sidecar Process

- Best fit for Python, Rust, Julia, or C++ compute without turning Fastify into the compute engine.
- Lets Fastify remain the API and browser gateway while the sidecar owns execution.
- Strongly aligned with the vision's local/remote/cloud flexibility.

#### Fastify Main plus Remote Backend

- Most future-oriented option.
- Best once compute becomes heavy, shared, or remotely hosted.
- Needs the cleanest transport-neutral protocol and artifact contracts.

## 7. Trajectory Analysis

### In-Process Async plus SSE/WebSocket

- 1-year trajectory: Best low-friction path to get progress, cancellation hooks, and multi-strategy visibility into Phase 4 work.
- 3-year trajectory: Likely strained by Phase 4.1/5/7 if compute stays CPU-heavy and local-only.
- 5-year trajectory: Becomes a bridge architecture unless compute remains modest.
- Doors opened: Quick learning, minimal deployment complexity, fast delivery.
- Doors closed: Durable remote/local/cloud flexibility if treated as the final shape.

### Worker Process plus SSE/WebSocket

- 1-year trajectory: Strong compromise for local-first evolution.
- 3-year trajectory: Still viable if jobs are moderate and the protocol is stable.
- 5-year trajectory: Can evolve into sidecar or broker-backed topology without throwing away the browser contract.
- Doors opened: Isolation, cancellation, and clearer compute boundary.
- Doors closed: Some simplicity relative to in-process execution.

### Brokered Jobs plus Edge Streaming

- 1-year trajectory: More infrastructure, but strong if multi-strategy workloads and branchable jobs appear quickly.
- 3-year trajectory: Good path to local/remote/cloud portability if the project wants multiple workers.
- 5-year trajectory: Still viable if the product remains a queue-driven engineering workbench rather than a durable workflow platform.
- Doors opened: Decoupled workers, retries, scalable fan-out, remote compute.
- Doors closed: Zero-dependency local-first simplicity.

### Durable Workflow Orchestration

- 1-year trajectory: Probably heavy for current scope unless the project commits early to long-lived, resumable workflows.
- 3-year trajectory: Strong if the platform becomes more like an engineering operations system than a local desktop tool.
- 5-year trajectory: Valuable if auditability, resumption, and distributed execution become first-class.
- Doors opened: Strong cancellation/retry/history semantics.
- Doors closed: Lightweight local-first development ergonomics.

### Sidecar or Remote Service plus Typed Streams

- 1-year trajectory: Slightly more work now, much better coupling to compute-backend optionality.
- 3-year trajectory: Most aligned with hybrid compute paths.
- 5-year trajectory: Strongest support for the vision's local, remote, and cloud compute modes.
- Doors opened: Multi-language backends, typed service contracts, operational separation.
- Doors closed: Some of the simplicity of keeping everything inside Fastify.

## 8. Precedent Analysis

- Jupyter kernels: Named precedent for browser/client surfaces talking to separate compute processes over a message protocol. Relevant because the project's educational UI and numerical engine may reasonably diverge in language/runtime.
- Language Server Protocol: Named precedent for a TypeScript-heavy client/editor world coordinating with many sidecar processes over a stable transport-neutral protocol.
- Temporal: Named precedent for durable workflow orchestration when tasks are long-running, retryable, and stateful rather than simple request/response work.
- NATS: Named precedent for pub/sub and request-reply messaging as infrastructure, especially where multiple services/workers may emit or consume events.
- BullMQ and pg-boss: Named precedents for queue-first job execution in the Node/Postgres ecosystems rather than inventing a local scheduler from scratch.

## 9. Gray Areas Encountered

- Follow and mark: Compute-language coupling. The task was framed as streaming/job architecture, but the natural pairings with Python/Rust/C++ sidecars were load-bearing enough that this research had to couple explicitly to `01-compute-backends.md`.
- Revisit later: Performance budget definition. Streaming architecture is underdetermined without target update rates, concurrent strategy counts, and acceptable completion latencies. The audit already flagged this as a must-have, and it remains unresolved.
- Defer: Multi-user collaboration semantics. Presence, shared sessions, and collaborative cursors are not required to map the current local-first option space.

## 10. Scope Expansion Notes

**Scope expansion encountered.**
Original framing: Streaming transports, job models, and worker separation for the Fastify stack.
Expansion observed: Need to treat protocol shape and compute-backend coupling as first-class.
Response: Follow-and-mark.
Justification: Transport-only analysis would have been misleading because the same transport behaves very differently when jobs are in-process TypeScript versus out-of-process Python/Rust/C++ services.

## 11. Path of Inquiry

- Started from the audit's proposed `submit/get/subscribe/fetch/cancel` outline and tested whether the current code already had any of those seams. It does not.
- Examined the current Fastify app and run route to confirm that the existing API is a completion-only request/response surface.
- Branched into transport choice, then moved upward to job lifecycle after seeing that transport comparisons were too shallow without explicit event and artifact semantics.
- Reframed the comparison around archetypes: local in-process, local isolated worker, broker-backed workers, and sidecar/remote service.
- Abandoned a narrow "pick WebSocket or SSE" path because it would have prematurely collapsed the option space before the compute boundary and replay model were defined.

## 12. Dependencies and Relations

- R1 Compute Backends: Tightest dependency. If compute remains in-process TypeScript, worker threads and SSE/WebSocket are natural. If compute moves to Python/Rust/C++/Julia, sidecar or remote service patterns become more natural.
- R2 Visualization at Scale: High dependency. The renderer and interaction model determine event cadence and partial-artifact needs.
- R3 Educational Content Architectures: Moderate dependency. Annotation, replay, guided branching, and observer comparison all favor durable artifact IDs and replayable event streams over ad hoc live payloads.
- R5 Multi-Regulation Typing: Lower but real dependency. Stronger typed inputs can simplify job submission contracts and downstream artifact provenance.

## 13. Provisional Position

- Known: The current stack does not yet have a job model; it has only synchronous route handlers returning completed run records.
- Likely: The first durable architectural move is not "install WebSocket" but "introduce a transport-neutral job protocol with typed event unions and fetchable artifacts."
- Likely: SSE and WebSocket are the most natural first browser transports, with SSE slightly simpler for append-only progress and WebSocket stronger if cancellation and richer interaction need to share the same channel.
- Likely: BullMQ, pg-boss, sidecar services, and remote backends all become much more coherent once the job protocol exists; choosing among them should follow explicit performance and durability requirements rather than aesthetics.
- Plausible: gRPC becomes attractive only if the compute boundary becomes a serious multi-language service boundary rather than an implementation detail inside Fastify.

Confidence is medium because the repo still lacks explicit budgets for strategy counts, update cadence, queue depth, and acceptable failure/recovery semantics.

## 14. Confidence Ledger

- High confidence: Current Fastify routes are synchronous completion-oriented (`apps/local-api/src/app.ts:54`, `apps/local-api/src/routes/runs.ts:50`).
- High confidence: The protocol needs to separate live events from durable artifacts if replay and partial results matter.
- Medium confidence: SSE is the simplest first streaming transport for the current local-first stage.
- Medium confidence: WebSocket becomes more compelling once bidirectional control and filtered subscriptions are required.
- Medium confidence: Broker-backed jobs are more future-resilient than custom in-memory queues once compute leaves the Fastify process.
- Low-to-medium confidence: Temporal's weight is justified in this initiative's near-term horizon rather than after more modest queue patterns have been tested.

## 15. Unresolved Questions

- What update cadence does "live-updating strategy views" actually require?
- How many concurrent strategies should one job family represent, and should they appear as one batch job or many child jobs?
- Are replay and reconnect first-class requirements for Phase 4.1 temporal exploration, or only a future nice-to-have?
- Should artifact payloads remain file-backed JSON initially, or move behind a typed artifact service earlier?
- Is cancellation allowed at any simulation step, or only at explicit stint/race boundaries in early versions?

## 16. References

- Local code and project files:
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `apps/local-api/src/app.ts:54`
  - `apps/local-api/src/routes/runs.ts:44`
  - `apps/local-api/src/routes/runs.ts:50`
  - `apps/local-api/src/services/runService.ts:151`
  - `apps/local-api/src/services/runService.ts:460`
  - `apps/local-api/src/services/runService.ts:672`
  - `packages/sim-core/src/contracts.ts:123`
- npm metadata checked 2026-04-10:
  - `npm view @fastify/websocket version peerDependencies --json` -> `11.2.0`
  - `npm view bullmq version peerDependencies dependencies --json` -> `5.73.4`
  - `npm view pg-boss version peerDependencies dependencies --json` -> `12.15.0`
  - `npm view @temporalio/client version @temporalio/worker version --json` -> `1.16.0`
  - `npm view @grpc/grpc-js version dependencies --json` -> `1.14.3`
  - `npm view nats version dependencies --json` -> `2.29.3`
- External references:
  - Fastify WebSocket plugin: <https://github.com/fastify/fastify-websocket>
  - MDN SSE guide: <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>
  - MDN WebSocket API: <https://developer.mozilla.org/en-US/docs/Web/API/WebSocket>
  - Node `worker_threads`: <https://nodejs.org/api/worker_threads.html>
  - Node `child_process`: <https://nodejs.org/api/child_process.html>
  - gRPC overview and streaming RPCs: <https://grpc.io/docs/what-is-grpc/core-concepts/>
  - NATS concepts: <https://docs.nats.io/nats-concepts/what-is-nats>
  - Temporal docs: <https://docs.temporal.io/temporal>
  - BullMQ docs: <https://docs.bullmq.io/>
  - pg-boss docs: <https://timgit.github.io/pg-boss/>
  - Python `asyncio`: <https://docs.python.org/3/library/asyncio.html>
  - Tokio docs: <https://docs.rs/tokio/latest/tokio/>
  - Language Server Protocol: <https://microsoft.github.io/language-server-protocol/>
  - Jupyter messaging docs: <https://jupyter-client.readthedocs.io/en/stable/messaging.html>
