# 01 Backend Boundary Architecture

## Metadata

- Date: 2026-04-11
- Mode: Deliberation
- Reasoning effort: xhigh
- Inputs consumed:
  - `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
  - `.planning/VISION.md`
  - `.planning/PROJECT.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/01-compute-backends.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/04-streaming-architectures.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/02-visualization-at-scale.md` sections on demand map, typed artifacts, interaction state, and provisional position
  - `.planning/initiatives/vision-alignment-2026-04/research/03-educational-content-architectures.md` sections on schema dimensions, artifact bindings, view recipes, and provisional position
  - Supporting code reads: `packages/sim-core/src/contracts.ts`, `packages/sim-core/src/raceModel/raceRunner.ts`, `apps/local-api/src/services/runService.ts`, `apps/local-api/src/routes/runs.ts`, `packages/domain/src/runs/schema.ts`, `packages/domain/src/runs/createRunRecord.ts`, `packages/domain/src/presets/schema.ts`, `packages/domain/src/scenario/schema.ts`, `packages/domain/src/scenario/raceSchema.ts`, `packages/sim-core/src/stintModel/electricalModel.ts`
- Performance envelope integration: consumed as a hard input, with special weight given to submit/ack, first-progress, artifact-ready, cancellation, replay, and 0.25-1 Hz UI update cadence constraints

## Question

This deliberation closes four coupled contracts:

1. C1: the compute execution boundary
2. C2: the job/event protocol
3. C3: the artifact/provenance contract
4. C4: the execution-flow slice of regulation handling

The main reframing from research survives contact with the codebase: the durable decision is not "Python vs Rust vs TypeScript" or "WebSocket vs SSE." The durable decision is the contract that separates:

- request compilation from compute execution
- live job events from durable artifacts
- raw regulation documents from the canonical execution snapshot
- artifact identity from renderer- or lesson-specific bindings

The strongest local push-back on the boundary memo is not ownership, but cut line. C1 is not well-framed as "one interface from browser/API to backend" if scenario resolution, preset loading, and regulation canonicalization remain inside the backend. The current `runService.ts` demonstrates why: preset loading, request compilation, synchronous execution, and persistence are currently fused. The contract that actually keeps doors open is a two-stage shape:

- `RunCommand -> CompiledSimulationRequest`
- `CompiledSimulationRequest -> SimulationBackend job lifecycle`

That refinement does not change D1 ownership. It does change what counts as clean closure.

## Stakes

- C1 determines whether the project can preserve local, remote, and cloud compute optionality without rewriting the application surface.
- C2 determines whether "live" means an honest typed execution model or a collection of ad hoc route-specific payloads that later clients cannot replay or trust.
- C3 determines whether D2 and D3 receive a stable object model for charts, annotations, and lessons, or whether each lane re-invents incompatible artifact assumptions.
- C4 determines whether multi-era execution is real or cosmetic. If regulation semantics stay split across preset blobs, API casts, and 2026 sim-core constants, the platform remains effectively single-era even if it stores multiple preset files.
- Downstream dependence is immediate:
  - D2 depends on the artifact envelope, artifact identity, and partial-artifact semantics.
  - D3 depends on stable artifact keys, lineage, and addressable anchor namespaces.
  - D5 depends on the execution-regulation snapshot boundary and the fact that artifacts/provenance reserve room for cross-era applicability states.
  - D4 depends on the migration path, especially package placement, artifact-store evolution, and the local-worker to sidecar to remote-service trajectory.

## Option Space

### C1: Compute execution boundary

Inherited from R1 and R4, the viable options were:

- Keep the current synchronous in-process `SimulationHarness` and postpone true boundary work.
- Introduce an async boundary but keep execution in-process TypeScript for now.
- Introduce a worker-thread or child-process TypeScript backend as the first async implementation.
- Introduce a sidecar or remote service boundary immediately, with Python/Rust/C++/Julia as plausible future runtimes behind it.
- Treat WebAssembly as a deployment target or adjunct, not as the primary long-horizon authoring environment.

### C2: Job/event protocol

Inherited from R4 and constrained by R1.5:

- Event model options: thin progress strings, typed event unions, or state-machine-first event families.
- Transport options: SSE, WebSocket, chunked HTTP, gRPC, or broker-backed internal pub/sub with a separate browser edge transport.
- Subscription options: per-job, broadcast, filtered/run-family, or some staged combination.
- Replay options: no replay, best-effort replay, append-only short-window replay, or fully durable historical event logs.
- Cancellation options: decorative best-effort cancel, or explicit job-state transitions with safe-point semantics.

### C3: Artifact / provenance contract

Inherited from R1, R2, R3, and R4:

- Keep artifacts inline inside the run record, with loosely typed `data`.
- Split live events from durable fetchable artifacts, but keep only run-scoped IDs.
- Introduce a typed artifact envelope with schema version, provenance, and separate fetch interface.
- Use one identifier only, or separate exact-instance identity from logical stable role identity.
- Store raw payload only, canonical migrated payload only, or both with explicit revision rules.

### C4: Regulation execution-flow slice

Inherited from R5 and validated in code:

- Send raw preset documents or `values` blobs across the boundary and let the backend cast them.
- Canonicalize the full regulation document into a typed runtime form before crossing the boundary.
- Canonicalize only an execution-relevant subset before crossing the boundary.
- Snapshot raw regulation source only, canonical execution form only, or both.
- Continue tolerating 2026-specific execution constants in sim-core until D5, or remove them now as part of boundary work.

## Tradeoffs

### C1 tradeoffs

- 1-year: a worker-backed TypeScript implementation preserves delivery speed and Phase 4 continuity, while still forcing request compilation and compute execution apart. Staying synchronous is lower effort but deepens the wrong seam.
- 3-year: a message-based local worker process keeps Python/Rust/C++ sidecars viable without rewriting the browser/API contract. A worker-thread-only design is workable, but less migration-friendly because it normalizes "backend == Node runtime."
- 5-year: a clean `CompiledSimulationRequest -> SimulationBackend` contract keeps remote and cloud execution credible. A synchronous `run(request): summary` interface does not.

### C2 tradeoffs

- 1-year: SSE plus REST is the smallest honest edge binding for 0.25-1 Hz progress and partial-artifact delivery. WebSocket is more flexible but asks the project to pay full-duplex complexity before the envelope evidence demands it.
- 3-year: typed events with sequence numbers keep SSE, WebSocket, and gRPC interchangeable at the edge. Untyped payloads make transport replacement expensive.
- 5-year: short-window replay plus durable artifact fetch is enough for the current local-first horizon; fully durable historical event logs remain a heavier operational commitment than the evidence yet warrants.

### C3 tradeoffs

- 1-year: separating artifact instance identity from logical artifact role identity adds contract complexity now, but it prevents D2 and D3 from binding to unstable run-derived filenames.
- 3-year: manifest-plus-fetch architecture scales to larger artifacts and partial checkpoints. Inline `data` fields in run records are convenient now but become the wrong center for replay, partial availability, and cross-lane bindings.
- 5-year: explicit provenance hashes, fidelity labels, and regulation references keep the platform honest when multiple backends, eras, and fidelity tiers coexist. Skipping them now creates silent ambiguity that is very hard to repair later.

### C4 tradeoffs

- 1-year: canonicalizing an execution-relevant regulation snapshot before backend submission slightly increases upfront design work, but it immediately ends the current API-cast plus sim-core-hardcode split.
- 3-year: storing both raw regulation documents and the compiled execution snapshot costs storage and versioning effort, but preserves reproducibility when canonicalizers evolve.
- 5-year: keeping ontology decisions open in D5 while still fixing the execution flow now is the right split. Sending raw documents across the compute boundary would keep the ontology question entangled with every future backend implementation.

## Gray Areas Still Unresolved

### [FOLLOW-AND-MARK] Pre-boundary request compilation is load-bearing

Research framed C1 as a backend contract. Code inspection shows that a `SimulationBackend` without a distinct request-compiler stage would keep preset resolution, scenario loading, and regulation canonicalization inside the backend. That would re-create the `runService.ts` coupling under a new name. This deliberation follows that expansion and closes the compiler-to-backend seam explicitly.

### [REVISIT-LATER] Batch orchestration shape

R1.5 makes multi-strategy batch makespan load-bearing, but it does not force a single scheduler shape yet. The open question is whether a comparison batch is best modeled as:

- one parent job with checkpoint artifacts
- a job family with child jobs
- one backend-specific hybrid

This does not block C1-C4 closure because the contracts can carry `runFamilyId` and optional child references now.

### [REVISIT-LATER] Exact hashing and ID implementation details

This deliberation closes the need for `scenarioSnapshotHash`, `sourceSnapshotHash`, `executionSnapshotHash`, and `inputDigest`, but not the exact canonical-JSON serializer or ID generator implementation. A stable content-hash method is required; the exact helper can be chosen during implementation.

### [DEFER] Infinite historical event replay

R1.5 supports short-lived replay for active or recently completed jobs. There is not yet evidence for permanent event-log retention as a first-class product requirement. Durable artifacts plus current job status are sufficient for v1.

### [DEFER] Cross-era comparability ontology

This contract must reserve room for `direct`, `derived`, `family-specific`, and `non-comparable` states, but D5 owns the semantics. D1 closes the storage slot and provenance path, not the ontology.

## Closure Analysis

### C1: Compute execution boundary

Can it be closed now: yes.

Evidence:

- The current public contract is still synchronous and summary-returning in `packages/sim-core/src/contracts.ts`.
- `POST /runs` still blocks until the run record is written and returned.
- R1 and R4 already mapped the viable boundary shapes.
- R1.5 supplies enough job-envelope constraints to reject "keep the synchronous call surface and decide later."

What the evidence does not justify is a language winner. What it does justify is the contract and first implementation shape.

### C2: Job/event protocol

Can it be closed now: mostly yes, with a provisional transport binding.

Evidence:

- R4 mapped the protocol design space.
- R1.5 provides concrete envelope targets for ack, first progress, artifact-ready, cancellation, and replay window.
- The current code has no job model, so additive ambiguity is low; the contract can be set before clients depend on ad hoc payloads.

What is not fully closed is whether future bidirectional control beyond cancellation will justify an external WebSocket binding. The protocol can close now; the edge transport should stay revisitable.

### C3: Artifact / provenance contract

Can it be closed now: yes, and it should be.

Evidence:

- R1, R2, R3, and R4 all depend on a typed artifact concept.
- The current run schema is too weak: `artifactType` is just a string, `data` is untyped, and artifact identity is run-derived.
- D2 and D3 need a shared artifact assumption now or they will each invent one.

This is the most warranted closure in the file. The exact payload schemas of each artifact family remain future work, but the envelope, identity model, provenance fields, and fetch contract are ready to close.

### C4: Regulation execution-flow slice

Can it be closed now: yes.

Evidence:

- R5 already established that storage typing alone is insufficient.
- The current code proves the split: `runService.ts` casts only the aero subtree while `electricalModel.ts` keeps 2026 constants and `raceRunner.ts` assumes no refueling.
- D5 can only do useful ontology work if execution no longer depends on raw blobs and implicit 2026 assumptions.

The semantic organizing axis remains open for D5. The execution-flow contract does not need to wait.

## Outcome

### Contract 1 (compute execution boundary)

**Recommendation.**

Close C1 as a two-stage contract:

- Stage A: request compilation resolves scenario references and preset documents into a `CompiledSimulationRequest`
- Stage B: a transport-neutral `SimulationBackend` accepts that compiled request and exposes job/artifact methods

The boundary should live in `packages/domain`, not `packages/sim-core`, because it is a stable cross-package contract rather than one implementation's internal API. Concretely:

- `packages/domain/src/execution/compiledRequest.ts`
- `packages/domain/src/execution/jobs.ts`
- `packages/domain/src/execution/artifacts.ts`
- `packages/domain/src/execution/regulation.ts`

`packages/sim-core` should become one implementation behind that contract. `apps/local-api` should own the first `SimulationRequestCompiler` and the gateway that binds HTTP/SSE to the backend.

Recommended interface shape:

```ts
type FidelityTier =
  | "placeholder"
  | "reduced-order"
  | "benchmarked"
  | "calibrated"
  | "high-fidelity";

interface CompiledSimulationRequest {
  schemaVersion: "compiled-simulation-request/v1";
  requestId: string;
  runFamilyId: string;
  lineage?: {
    parentRunId?: string;
    branchPoint?: BranchPoint;
  };
  execution: {
    harnessId: string;
    checkpointPolicy: "none" | "stint-boundary" | "lap-window";
    fidelityTier: FidelityTier;
  };
  inputs: {
    scenario: {
      scenarioId: string;
      snapshotHash: string;
    };
    circuit: CircuitDocument;
    session: SessionPresetDocument;
    weather: WeatherPresetDocument;
    vehicle: VehicleParams;
    regulation: ExecutionRegulationSnapshot;
  };
}

interface SimulationBackend {
  readonly contractVersion: "simulation-backend/v1";
  readonly backendId: string;
  readonly backendKind: "local-ts-worker" | "sidecar-service" | "remote-service";
  submit(request: CompiledSimulationRequest): Promise<JobReceipt>;
  getJob(jobId: string): Promise<JobSnapshot>;
  cancel(jobId: string, reason?: string): Promise<CancelReceipt>;
  subscribe(subscription: JobSubscription, cursor?: EventCursor): AsyncIterable<JobEvent>;
  listArtifacts(query: ArtifactQuery): Promise<ArtifactManifestEntry[]>;
  fetchArtifact(ref: ArtifactRef): Promise<ArtifactEnvelope>;
}
```

Initial implementation choice:

- `apps/local-api` remains the API gateway and request compiler
- the first backend implementation is a long-lived local TypeScript worker process wrapping current `sim-core`
- `packages/sim-core/src/contracts.ts` should stop being the authoritative public boundary and instead become implementation-facing types or adapters

Migration shape:

- 1-year: local TypeScript worker process, file-backed job/artifact stores, same browser/API contract
- 3-year: optional Python/Rust/C++ sidecars behind the same `CompiledSimulationRequest` and `SimulationBackend` contract
- 5-year: remote/cloud compute service using the same job/artifact protocol, with the gateway free to swap external transport or internal dispatch without changing request compilation or artifact semantics

Warrant:

- This is the smallest move that satisfies the audit findings, the label-trap warning, and the local-first reality while keeping later scientific-runtime migration open.

### Contract 2 (job/event protocol)

**Provisional recommendation.**

Close the protocol semantics now. Bind the initial browser transport provisionally to REST + SSE.

Protocol rules:

- `jobId` and `runId` are distinct. `jobId` tracks execution state. `runId` tracks produced simulation lineage and artifacts.
- The authoritative subscription scope for v1 is per-job.
- Every event carries `eventId`, `jobId`, `sequence`, `occurredAt`, `backendId`, and `eventType`.
- Cancellation is an explicit state machine, not a decorative best-effort call.
- Live events never carry the full artifact payload when a durable artifact reference will do.

Recommended event union:

```ts
type JobState =
  | "queued"
  | "dispatching"
  | "running"
  | "cancelling"
  | "cancelled"
  | "completed"
  | "failed";

type JobEvent =
  | { eventType: "job-accepted"; runId?: string; state: "queued" }
  | { eventType: "job-started"; runId?: string; state: "running" }
  | {
      eventType: "job-progress";
      state: "running";
      phase: string;
      completedUnits?: number;
      totalUnits?: number;
      message?: string;
    }
  | {
      eventType: "artifact-ready";
      state: JobState;
      artifact: ArtifactRef;
      availability: "partial" | "final";
      checkpoint?: CheckpointRef;
    }
  | {
      eventType: "job-cancelling";
      state: "cancelling";
      effectiveAt?: CheckpointRef;
    }
  | { eventType: "job-cancelled"; state: "cancelled"; reason?: string }
  | { eventType: "job-completed"; state: "completed"; finalArtifacts: ArtifactRef[] }
  | { eventType: "job-failed"; state: "failed"; error: JobErrorEnvelope }
  | { eventType: "heartbeat"; state: JobState };
```

Subscription semantics:

- v1: per-job subscriptions only
- future additive extension: filtered `runFamilyId` subscriptions or backend dashboards, without changing the per-job contract

Cancellation semantics:

- immediate `cancel` acknowledgement
- visible transition to `cancelling`
- terminal `cancelled` at the next declared safe point for the current backend
- initial safe-point semantics for the TypeScript worker: stint boundary first, lap-window only if implementation proves it can honor that honestly

Replay and reconnect semantics:

- append-only recent event log keyed by `sequence`
- short-window replay only: target roughly 5-15 minutes or 256-1024 events per job, matching R1.5
- if the replay window has expired, the client reconstructs from `getJob` plus durable artifact fetch, not from unbounded event history

Transport binding:

- initial external binding:
  - `POST /jobs`
  - `GET /jobs/:jobId`
  - `POST /jobs/:jobId/cancel`
  - `GET /jobs/:jobId/events` as SSE with `Last-Event-ID` or `afterSequence`
  - `GET /jobs/:jobId/artifacts`
  - `GET /artifacts/:artifactId`
- internal backend dispatch remains transport-agnostic; the first local worker may use Node IPC, while future sidecars may use gRPC or another service transport

Revisit criteria:

- move the external binding from SSE to WebSocket only if the platform needs full-duplex control beyond cancellation, richer filtered subscriptions, or update cadences that make SSE ergonomics the limiting factor

Warrant:

- R1.5 makes the event cadence and replay window concrete enough to choose a simple edge transport now, but not so concrete that full-duplex control is forced.

### Contract 3 (artifact / provenance contract)

**Recommendation.**

Close C3 on a typed artifact envelope with two identity layers:

- `artifactId`: immutable identifier for one exact artifact instance
- `artifactKey`: stable logical role within a run family, used by views and lessons

This is the key move that keeps D2 and D3 from binding to ephemeral filenames or renderer-specific coordinates.

Recommended envelope:

```ts
interface ArtifactEnvelope<TPayload = unknown> {
  schemaVersion: "artifact-envelope/v1";
  artifactId: string;
  artifactKey: string;
  payloadSchema: string;
  mediaType: "application/json";
  status: "partial" | "final" | "superseded";
  label: string;
  createdAt: string;
  lineage: {
    runId: string;
    runFamilyId: string;
    parentRunId?: string;
    parentArtifactIds: string[];
    branchPoint?: BranchPoint;
    checkpoint?: CheckpointRef;
    revision: number;
  };
  provenance: {
    harnessId: string;
    modelVersion: string;
    appVersion: string;
    backendId: string;
    fidelityTier: FidelityTier;
    validationState:
      | "placeholder"
      | "reduced-order"
      | "benchmarked"
      | "calibrated"
      | "validated";
    scenario: {
      scenarioId: string;
      snapshotHash: string;
    };
    regulation: {
      sourcePresetId: string;
      sourceSchemaVersion: string;
      sourceSnapshotHash: string;
      executionSchemaVersion: string;
      executionSnapshotHash: string;
      familyId: string;
      semanticApplicability?: "direct" | "derived" | "family-specific" | "non-comparable";
    };
    inputDigest: string;
  };
  addressability?: {
    anchorNamespace: string;
    anchorSchema: string;
  };
  payload: TPayload;
}
```

ID semantics:

- `artifactId` must stay stable across sessions because it names one persisted instance
- `artifactKey` must stay stable across revisions within the same run family when the logical artifact role is unchanged, for example:
  - `race.timeline`
  - `stint.0.trace`
  - `stint.0.electrical-state`
- `runFamilyId` groups branch descendants so D2 and D3 can bind to stable artifact roles across branch exploration without pretending unrelated reruns are the same object

Provenance fields that are mandatory:

- parent run and branch point
- run family
- harness id and model version
- backend id
- scenario id and scenario snapshot hash
- regulation source preset id and hash
- regulation execution snapshot schema and hash
- fidelity tier and validation state
- input digest

Evolution rules:

- version the envelope separately from each payload schema
- breaking payload changes require a new `payloadSchema` version, not silent reinterpretation of old data
- a migrated or regenerated artifact that changes meaning must get a new `artifactId`; it may retain the same `artifactKey` with a higher `revision`
- `semanticApplicability` is a reserved contract slot for D5-populated comparability states; D1 closes the slot, not the ontology

Fetch interface:

```ts
interface ArtifactStore {
  list(query: {
    runId?: string;
    runFamilyId?: string;
    artifactKey?: string;
  }): Promise<ArtifactManifestEntry[]>;
  get(ref: ArtifactRef): Promise<ArtifactEnvelope>;
}
```

Storage implications:

- the current `runRecord.artifacts[].data` shape is a transitional carrier, not the future center of the system
- the run record should evolve toward manifest entries plus artifact references
- initial implementation may remain file-backed, but each artifact should be fetchable independently from the live event channel

Why this closes now:

- R2 needs stable artifact identities and addressable namespaces for renderer-agnostic annotations
- R3 needs durable artifact bindings and view recipes
- R1 and R4 need partial-artifact readiness and durable fetch separate from progress events

### Contract 4 (regulation execution-flow slice)

**Recommendation.**

Close C4 on "canonicalize before execute; store both source and compiled forms."

The compute boundary should not receive raw regulation preset blobs or `values: Record<string, unknown>`. It should receive a typed execution snapshot that contains only compute-relevant regulation state, compiled ahead of backend submission.

Recommended execution snapshot:

```ts
interface ExecutionRegulationSnapshot {
  schemaVersion: "execution-regulation/v1";
  compilerVersion: string;
  source: {
    presetId: string;
    presetSchemaVersion: string;
    snapshotHash: string;
  };
  familyId: string;
  capabilities: {
    aero:
      | { kind: "none" }
      | {
          kind: "active-aero";
          dragReduction: number;
          downforceReduction: number;
          zoneStrategy: "track-heuristic" | "preset-authored";
        };
    electrical:
      | { kind: "none" }
      | {
          kind: "single-pool";
          maxDeployPowerW: number;
          maxHarvestPerLapJ: number;
          maxDeltaSoCJ: number;
        };
    refueling:
      | { kind: "disallowed" }
      | { kind: "allowed"; pitFuelRateKgPerS?: number };
  };
}
```

Canonicalization location:

- schema and parser types belong in `packages/domain`
- actual source-document resolution and compilation happen in the request-compiler layer in `apps/local-api`
- `packages/sim-core` should consume the typed `ExecutionRegulationSnapshot`, not raw preset documents

What crosses the backend boundary:

- not the full preset document
- not an untyped `values` map
- a canonicalized execution-relevant snapshot derived from the raw regulation document, plus hashes and family identity

Run snapshot storage:

- store both:
  - the raw regulation preset snapshot already used for document reproducibility
  - the compiled `ExecutionRegulationSnapshot` actually used by compute
- include compiler version and execution snapshot hash in artifact provenance

Sim-core hardcodings that must end:

- `REGULATION_2026.maxMguKPower`
- `REGULATION_2026.maxHarvestPerLap`
- `REGULATION_2026.maxDeltaSoC`
- the implicit "no refueling in 2026" execution rule currently baked into race orchestration comments and state mutation behavior
- the default active-aero reductions currently assembled in `runService.ts` instead of arriving as compiled execution inputs

Migration path:

- first, add the execution snapshot and thread it into `StintConfig` and `RaceConfig`
- second, replace electrical initialization and per-lap limits to read from `regulation.capabilities.electrical`
- third, replace pit/refueling assumptions to read from `regulation.capabilities.refueling`
- fourth, move aero defaults into the regulation compiler so `runService.ts` stops re-casting raw preset subtrees

Constraint handed to D5:

- D5 can still decide the long-horizon semantic axes, override model, and comparability rules, but it must preserve the ability to compile a stable execution snapshot of this shape for compute backends

## Implications if Closed / Implications if Deferred

### If C1 is closed as recommended

- `runService.ts` can be split along a real seam instead of by aesthetic refactor
- Phase 4 planning can target a job-based backend without choosing the long-term numerical language yet
- future Python/Rust/C++ backend work becomes an implementation replacement, not an API rewrite

### If C2 is closed as recommended

- D2 can assume honest partial-artifact arrival rather than a monolithic completion-only run surface
- the browser contract stays simple enough for the current cadence envelope
- future transport changes remain additive because the event union and replay semantics are fixed first

### If C2 transport binding is revisited later

- the trigger should be explicit: richer bidirectional control, filtered multi-job subscriptions, or a measured cadence/latency need that SSE cannot meet cleanly
- a revisit should change the transport only, not the event union or job-state machine

### If C3 is closed as recommended

- D2 can build renderer-agnostic surfaces against manifest entries, `artifactKey`, and `anchorNamespace`
- D3 can bind lessons to stable artifact roles and view recipes instead of URL fragments or pixel coordinates
- provenance can visibly distinguish placeholder, reduced-order, benchmarked, calibrated, and validated outputs

### If C3 were deferred

- D2 and D3 would almost certainly close on incompatible artifact assumptions
- progress events would drift toward carrying oversized payloads because no durable artifact contract would exist
- regulation provenance and cross-era applicability would be under-specified exactly where the vision most needs honesty

### If C4 is closed as recommended

- multi-era execution becomes a backend-input problem instead of a backend-implementation guessing game
- D5 can focus on ontology rather than cleaning up execution leaks
- sim-core stops silently meaning "2026" whenever the preset compiler omitted a field

### If C4 were deferred

- every new backend would inherit the raw-preset-casts plus 2026-hardcode split
- D5 would be forced to reason about ontology while the execution boundary still leaks implementation-specific assumptions
- artifact provenance could not honestly state which regulation form compute actually used

## Dependencies and Relations

- D2 must consume:
  - `ArtifactEnvelope`
  - `artifactKey`
  - `runFamilyId`
  - `addressability.anchorNamespace`
  - partial vs final artifact status
  - fidelity and validation provenance markers
- D3 must consume:
  - `artifactKey`
  - `ArtifactRef`
  - `runFamilyId`
  - `addressability.anchorNamespace`
  - view-recipe references built on top of stable artifact manifests
- D5 must accept as constraints:
  - compute backends do not receive raw regulation blobs
  - `ExecutionRegulationSnapshot` is the execution-facing product of the semantic model
  - artifact provenance must expose both source regulation and compiled execution regulation references
  - comparability states must populate reserved provenance slots rather than invent parallel artifact identity
- D4 should capture:
  - creation of `packages/domain/src/execution`
  - migration from run-record-inline artifacts to manifest-plus-fetch storage
  - adoption of `runFamilyId`, scenario hashes, and execution-snapshot hashes
  - movement from local TypeScript worker to polyglot sidecars and remote compute
  - benchmark harness work that validates the R1.5 envelopes against the chosen contract

Coupling strength:

- C1 <-> C2: tight
- C1 <-> C4: tight
- C2 <-> C3: tight
- C3 <-> D2/D3: tight
- C4 <-> D5: tight
- C2 transport binding <-> D2 cadence needs: moderate

## Path of Deliberation

1. Start from the boundary memo's contract framing and the research principles' warning against label-level closure.
2. Re-read R1, R4, R5, and R1.5, then test them against current code.
3. Confirm that the present system still has only one blocking route-level execution path and a synchronous `SimulationHarness`.
4. Trace where regulation meaning actually enters execution and confirm the split between `runService.ts` and `electricalModel.ts`.
5. Read the visualization and educational research where they explicitly name typed artifacts, stable anchors, and view recipes.
6. Conclude that C3 is not a secondary concern but the central coordination contract for D1, D2, and D3.
7. Push lightly against the memo's phrasing of C1 by making request compilation an explicit pre-backend stage.
8. Use R1.5 to close job-state semantics and the initial external transport binding without pretending the edge transport can never change.
9. Separate what is ready to close now from what belongs to D5 or later benchmark-driven revision.

## Open Sub-questions

- Should comparison batches surface as one parent job, many child jobs, or both?
- What exact canonical-JSON hashing helper should back snapshot hashes and input digests?
- Should `runId` remain user-facing and document-shaped while `jobId` moves to UUIDv7-style opaque IDs, or should both adopt the same generator?
- Which artifact families require explicit `anchorSchema` manifests versus payload-local stable entity IDs only?
- How much checkpoint granularity is honest for the first TypeScript worker: stint only, lap windows, or both?
- What is the first concrete `run-record/v2` migration shape for manifest-only artifacts and compiled regulation snapshots?

## Decision Record (to be filled by user)

### Contract 1 (compute execution boundary)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 2 (job/event protocol)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 3 (artifact/provenance contract)
- Decision:
- Rationale:
- Date:
- Decider:

### Contract 4 (regulation execution-flow slice)
- Decision:
- Rationale:
- Date:
- Decider:
