# Vision Alignment Audit Response — 2026-04-10

**Audits reviewed:**
- `.planning/audits/vision-audit-2026-04-08/opus-audit.md` (Claude Opus 4.6, independent)
- `.planning/audits/vision-audit-2026-04-08/codex-audit.md` (Codex gpt-5.4, high reasoning)
- `.planning/audits/vision-audit-2026-04-08/codex-xhigh-audit.md` (Codex gpt-5.4, xhigh reasoning)

**Source documents:** `.planning/VISION.md` (new, 2026-04-08), existing `PROJECT.md`, `ROADMAP.md`, `REQUIREMENTS.md`, Phase 4 research artifacts, previous `audit-response-2026-04-07.md`

**Reviewed by:** Claude Opus 4.6 + user (Logan Rooks)

---

## Context: Why This Audit

The Phase 4 research (2026-04-08) recommended adopting visx as the visualization foundation. Before committing, the user articulated a broader platform vision (captured in `VISION.md`) including real-time strategy analysis, educational content as first-class, multi-regulation support, and flexible compute backends. Three independent audits were run in parallel to evaluate whether the current architecture, roadmap, and Phase 4 planning direction actually serve this vision — not just the immediate milestone.

The audits converged on a single core message:

> **The Phase 4 research answers the wrong-sized question.** It resolved "which charting toolkit?" when the vision was asking "what architecture lets this become a serious engineering-and-education platform over time?"

---

## Disposition Summary

Findings consolidated across all three audits. Severity reflects the most critical assessment from any auditor.

| # | Finding | Source | Severity | Disposition |
|---|---------|--------|----------|-------------|
| 1 | visx as tactical Phase 4 library is defensible; visx as architectural foundation is not | All 3 | High | **Accept** |
| 2 | React 19 incompatibility via `@visx/xychart` → `@react-spring/web` transitive dependency | All 3 (Opus most specific) | High | **Accept** |
| 3 | No transport-neutral simulation boundary / `SimulationBackend` abstraction | All 3 | Critical | **Accept** |
| 4 | No streaming/WebSocket/job lifecycle model for progress or live updates | All 3 | High | **Accept** |
| 5 | `apps/local-api` mixes compute orchestration, preset loading, and persistence | Codex ×2 | High | **Accept with modification** |
| 6 | Multi-regulation support is under-typed; presets are `z.record(string, unknown)` | Codex ×2 | High | **Accept** |
| 7 | No educational content architecture; "learning views" ≠ "learning content" | All 3 | High | **Accept** |
| 8 | Dual-rendering migration (legacy SVG + visx) risks becoming permanent | All 3 | Medium | **Accept** |
| 9 | Validation and calibration sequenced too late for vision's honesty claims | Codex ×2 | Medium | **Partial accept** |
| 10 | No explicit performance budget (max strategies, latency targets, update cadence) | xhigh only — **novel** | High | **Accept** |
| 11 | No benchmark/reference-competitor layer; strategy still isolated optimization | xhigh only — **novel** | Medium | **Defer** |
| 12 | `packages/visuals` has 2,736 LOC and zero tests | Codex ×2 | Medium | **Accept** |
| 13 | `App.tsx` hardcoded 3-zone layout cannot accommodate Phase 4 views | Opus only | Medium | **Accept** |
| 14 | Canvas/WebGL fallback path for dense/live rendering is unplanned | All 3 | Medium | **Accept** |
| 15 | **No explicit optimization / computational-efficiency track in the roadmap** | User-raised | High | **Accept** |

---

## Detailed Decisions

### Findings 1-2: visx adoption — narrow the commitment

**Decision: Adopt visx low-level packages only, behind internal primitives.**

Use `@visx/shape`, `@visx/scale`, `@visx/axis`, `@visx/group`, `@visx/brush`, `@visx/tooltip`, `@visx/responsive`, `@visx/grid`, `@visx/gradient`. Do NOT adopt `@visx/xychart` — its transitive `@react-spring/web ^9.4.5` dependency does not support React 19, and the 4.0.x-alpha path is an entirely-alpha major version.

Build linked-view coordination (shared cursor, synchronized tooltips) using a custom React context. It's a shared cursor position in context — not complex infrastructure.

**Rationale:** All three audits independently converged on "visx as implementation detail, not architecture." Opus caught the specific react-spring transitive issue. The Phase 4 research's recommendation to use `--legacy-peer-deps` or alpha packages was too cavalier for a 6+ month development horizon.

**Action:** Update Phase 4 research document with corrected visx package list. Define a renderer boundary before Phase 4 planning (see Finding 14).

---

### Finding 3-4: Compute boundary and streaming

**Decision: Introduce `SimulationBackend` abstraction and async job model before Phase 4 execution.**

The Codex xhigh audit sketched the right shape:

```typescript
submitSimulation(request) -> { jobId }
getJob(jobId) -> { status, progress, summary? }
subscribeToJob(jobId) -> stream of progress/artifact events
fetchArtifact(jobId, artifactId) -> typed artifact payload
cancelJob(jobId) -> acknowledgement
```

Add `@fastify/websocket` (or Server-Sent Events) for progress streaming. The current `apps/local-api` becomes the **first implementation** of `SimulationBackend`, not the backend itself.

**Rationale:** This is the critical finding. Without this boundary, the vision's flexible compute (local/remote/cloud), the real-time strategy ambition, Phase 4's multi-strategy batch workflow, and Phase 4.1's temporal exploration all have nowhere to land. It's the architectural enabler for the vision; postponing it locks in the local-synchronous assumption deeper.

**Action:** Insert a new phase (Phase 3.2 or 4.0 — TBD) that establishes the compute boundary, job model, and streaming protocol BEFORE Phase 4 plans are written.

---

### Finding 5: local-api separation of concerns

**Decision: Accept, but apply gradually.** Split `runService.ts` incrementally — do not big-bang rewrite.

The right end state is three layers:
1. **Request compilation** — resolve presets, circuits, scenarios → typed simulation request
2. **Execution dispatch** — call the active `SimulationBackend` implementation
3. **Artifact persistence** — write results to storage (local disk, or eventually remote)

**Rationale:** The current `runService.ts` (672-919 lines in the xhigh audit citation) is doing everything. But refactoring it without the `SimulationBackend` abstraction first would be premature. The abstraction (Finding 3) forces the split naturally.

**Action:** Split happens as part of Finding 3 implementation, not as standalone work.

---

### Finding 6: Multi-regulation typing

**Decision: Define typed regulation family schemas before v2 multi-era support.**

Replace `values: z.record(z.string(), z.unknown())` with discriminated union of regulation family schemas. Each era (2026-active-aero, 2022-2025-ground-effect, 2017-2021-high-downforce, etc.) gets its own typed preset shape.

**Rationale:** Both Codex audits flagged this as high severity. The current approach preserves storage flexibility but destroys semantic clarity. Multi-regulation support is a vision commitment, and without typed families, each new era becomes ad-hoc cast work in the run service.

**Action:** Deliberate regulation typing strategy during the follow-up deliberation phase. Implement as part of Phase 4 foundation work or insert a typing-focused plan.

---

### Finding 7: Educational content architecture

**Decision: Define lesson/tutorial content architecture as Phase 4 deliverable.**

The project has good infrastructure for role-specific data presentation (showing a strategy engineer the relevant view). It has zero infrastructure for structured pedagogical content (teaching someone what compound windows are, why pit timing matters, what questions a strategy engineer asks).

Minimum viable content layer:
- `LessonUnit` schema: concept ID, prerequisites, associated scenario, guiding questions, key insights, role tags
- `LearningOverlay` that attaches annotations/prompts to existing engineering artifacts
- Content directory (e.g., `content/lessons/`) with structured lesson files
- Initial 3-5 lessons for strategy engineer role as proof of concept

Educational content composes ON TOP of engineering visualization, not as a separate UI stack. Same artifacts, same charts, with added scaffolding.

**Rationale:** All three audits independently identified this as a major gap. VISION.md explicitly commits to lessons/tutorials/progressive learning. The current roadmap treats EDU requirements as "learning views" — a UI concern rather than a content system.

**Action:** Add educational content architecture to Phase 4 scope (as a new plan), OR insert Phase 4.x for it specifically. Decide during deliberation phase.

---

### Finding 8: Dual-rendering migration risk

**Decision: Time-box the migration. Freeze legacy components except for bug fixes.**

Concrete rules:
1. No new features in legacy hand-rolled SVG components
2. Introduce shared chart primitives (theme, scales, interaction state, tooltip semantics) as Phase 4 deliverable
3. Migrate legacy components that must participate in linked interactions (e.g., `SpeedProfileTrace` if it needs shared cursor with strategy views)
4. All new Phase 4 visualization built on shared primitives from day one
5. Add visual contract tests before migration expands

**Rationale:** Both running approaches permanently is the failure mode. The mitigation is architectural clarity, not just migration planning.

**Action:** Include shared primitive layer as explicit Phase 4 plan. Document the migration freeze in CLAUDE.md or phase CONTEXT.

---

### Finding 9: Validation/calibration sequenced too late

**Decision: Partial accept.** Keep current sequencing (Phase 6 data import, Phase 7 calibration) but add explicit honesty constraints.

Adding reference-data import earlier would be scope creep at this stage. The mitigation is to make the placeholder/low-fidelity nature visible in the UI at all times. CLAUDE.md already has the "honesty constraints" convention; extend it to explicit confidence labels on Phase 4 outputs.

**Rationale:** The gap is real but pulling Phase 6 forward destabilizes the current roadmap. The honest-labeling mitigation preserves the sequencing while addressing the "teaching simulator artifacts" concern the xhigh audit raised.

**Action:** Add confidence-labeling requirements to Phase 4 success criteria. Consider adding a lightweight "reference trajectory" concept for Phase 4.1+ that compares against any hand-authored target, without requiring full telemetry import.

---

### Finding 10: Performance budget (novel)

**Decision: Define measurable performance targets before Phase 4 library commitment.**

Specific budgets to define:
- Max strategies simultaneously visible (e.g., 6)
- Max linked panels with shared cursor (e.g., 4)
- Hover-to-tooltip latency budget (e.g., <50ms)
- Brush-to-update latency budget (e.g., <100ms)
- Simulation progress update cadence (e.g., 2Hz during multi-strategy comparison)
- Multi-strategy batch completion (e.g., 6 races in <5s on dionysus hardware)

**Rationale:** The xhigh audit's sharpest observation: without measurable targets, library debates are philosophical. Either visx meets the budget or it doesn't. Either the current synchronous execution meets the budget or it doesn't. The budget IS the architectural forcing function.

**Action:** Add performance budget to VISION.md and/or PROJECT.md as a first-class constraint. Run a "worst plausible view" benchmark during Phase 4 foundation work.

---

### Finding 11: Benchmark/reference-competitor layer (novel)

**Decision: Defer to v2+.** Acknowledge in open questions.

The audit is correct that strategy-as-isolated-optimization differs from strategy-as-engineering-under-competition. A reference-competitor abstraction would bridge this. But v1 is already ambitious, and STRA-08 (low-fidelity traffic penalties) provides a minimal substitute.

**Rationale:** This is vision-worthy but not milestone-blocking. v2 can add a reference-competitor layer once single-car strategy is mature.

**Action:** Add to VISION.md open questions. Add to Phase 4 CONTEXT.md "Future Awareness" section so Phase 4 doesn't preclude it.

---

### Finding 12: Visuals package has zero tests

**Decision: Accept. Add visual contract tests as part of shared primitive layer work.**

2,736 LOC with zero tests is a real safety gap, especially as visualization becomes more load-bearing. But "test everything existing" would be scope creep. The right move is to test the new shared primitive layer thoroughly and add snapshot/contract tests for legacy components as they're migrated.

**Action:** Shared primitive layer (from Finding 8 action) ships with vitest unit tests and visual regression tests (optional: Playwright screenshots).

---

### Finding 13: `App.tsx` 3-zone layout

**Decision: Accept. Refactor workspace shell as Phase 4 foundation work.**

Replace the hardcoded 3-zone tuple with a panel-management layer that can accommodate strategy comparison, engineer-role views, qualifying views, and race timeline views. This is unblocked once Finding 14 (renderer boundary) defines how panels compose.

**Action:** Include as explicit Phase 4 plan deliverable.

---

### Finding 14: Canvas/WebGL fallback path

**Decision: Define the escape hatch architecture. Do not build yet.**

The renderer boundary (chart data model, scales, interaction state, annotations) must be renderer-agnostic. visx will be the initial implementation; Canvas/WebGL will be a second implementation for dense or live panels when the performance budget demands it.

**Rationale:** Vision calls for production density and real-time updating. SVG-only will hit a ceiling. But building Canvas now is premature — the budget from Finding 10 determines when Canvas becomes necessary.

**Action:** Define renderer-agnostic contracts in `packages/visuals` as Phase 4 foundation. No Canvas implementation until performance budget is violated.

---

### Finding 15: Optimization track missing (user-raised)

**Decision: Accept. Start deliberation on computational backend strategy.**

The current roadmap has zero explicit optimization work. This is defensible for Phases 1-3 (correctness before performance, reduced-order models) but becomes increasingly problematic for:

- **Phase 4.1 EKF observer** — matrix operations, Kalman gain computation
- **Phase 5 MPC** — constrained optimization solver, no serious Node.js ecosystem equivalent to scipy.optimize / CasADi / OSQP
- **Phase 7 calibration** — parameter fitting over many simulation runs
- **Vision real-time strategy** — multi-strategy batches fast enough for interactive exploration

TypeScript is right for UI, domain contracts, and API layer. It is likely wrong for the long-term computational core. A hybrid architecture (TypeScript orchestration, Python/Rust/C++ compute) is probably the right answer — but this needs proper deliberation, not a drive-by decision.

**Action:** Full deliberation with research stage. See Follow-Up Plan below.

---

## Consolidated Gaps: The Six Must-Haves

Collapsing the findings into what actually needs to happen:

1. **`SimulationBackend` abstraction** (#3, #4, #5, and enables #15) — transport-neutral boundary + async job model + streaming protocol
2. **Visualization primitive layer** (#1, #8, #13, #14) — renderer-agnostic contracts, visx as first implementation, Canvas as escape hatch, shared chart theme
3. **Typed regulation families** (#6) — discriminated union schemas, era-specific decoders
4. **Educational content architecture** (#7) — lesson schema, learning overlays, content directory
5. **Performance budget** (#10) — measurable targets baked into planning
6. **Computational backend strategy** (#15) — long-term language/compute decisions, tech debt implications

Everything else is derivative of these six.

---

## Follow-Up Plan (Proposed)

### Stage 1: Research (parallel tasks)

Before any roadmap changes, conduct focused research on:

1. **Computational backends** — Python (NumPy/SciPy/CasADi), Rust (nalgebra, faer, good-lp), C++ (Eigen, IPOPT), Julia, WebAssembly. Real-time simulation architectures. Inter-process boundaries (JSON-RPC, gRPC, shared memory, stdio). Deployment models.
2. **Visualization at scale** — visx performance under linked-brushing load, Canvas rendering for dense traces, WebGL approaches, `uPlot`/deck.gl/Plotly for hybrid strategies.
3. **Educational content architectures** — how do other serious interactive learning platforms (e.g., Brilliant, Observable, Jupyter) structure lessons and prerequisite graphs?
4. **Streaming architectures** — Fastify WebSocket vs SSE vs external job queues, for live updates and progress reporting.
5. **Multi-regulation typing strategies** — discriminated unions, versioned schemas, migration paths.

### Stage 2: Deliberations

Structured deliberations (following `.planning/deliberations/` format) on:

1. **Computational backend strategy** — THE big one. Hybrid vs pure TypeScript. Migration path. Tech debt implications. Rewrite-ability of current code. When to cut over.
2. **Visualization architecture** — renderer boundary, primitive layer, visx vs Canvas escape hatch, performance budget definition.
3. **Educational content architecture** — lesson schema, content authoring workflow, integration with engineering visualization.
4. **Long-horizon roadmap** — project the roadmap beyond v1 to v2, v3, etc. Where does the platform "come into its own"?

### Stage 3: Roadmap Evolution

After deliberations resolve:

1. **Insert foundation phases** before Phase 4:
   - Phase 3.2: Compute boundary + streaming (simulation backend abstraction, job model)
   - Phase 3.3: Visualization primitive layer + shared theme (if not folded into Phase 4)
2. **Update Phase 4** to use the new foundations.
3. **Project forward** — add v2, v3+ milestones to ROADMAP.md with high-level themes (e.g., v2: reference-competitor layer, multi-regulation expansion, computational backend migration; v3: calibration workbench + historical regulation coverage; v4: collaborative/multi-user scenarios if vision expands).
4. **Add tech debt registry** — track deferred work, known shortcuts, rewrite candidates.

### Stage 4: Guardrails

Ongoing protections to keep the vision honest:

1. **CLAUDE.md additions**: vision-alignment checkpoint in every phase CONTEXT.md (not just Future Awareness — also Vision Impact).
2. **Performance budget enforcement**: every phase with visualization work must run the worst-plausible-view benchmark.
3. **Phase gate: "does this serve the vision or just the milestone?"** — explicit question in discuss-phase workflow.
4. **Tech debt registry** — living document tracking known shortcuts and their rewrite triggers.
5. **Repo hygiene**: commit convention enforcement, atomic commits per plan, branch protection, cross-model audits at each milestone boundary.
6. **Audit cadence**: schedule a vision-alignment audit at the start of each new milestone (not just at retrospective time).

---

## Tech Debt Registry (Initial)

Things this audit surfaces as deferred work with known future cost:

| Item | Current State | Rewrite Trigger | Severity |
|------|---------------|-----------------|----------|
| `apps/local-api/src/services/runService.ts` mixing concerns | ~900 LOC god-service | When `SimulationBackend` abstraction lands | High |
| `packages/domain/src/presets/schema.ts` `values` as record | Untyped blob | Before 2nd regulation era added | High |
| `packages/sim-core/src/contracts.ts` synchronous `SimulationHarness` | No job/progress semantics | When streaming/async model lands | High |
| `apps/web/src/App.tsx` hardcoded 3-zone layout | Fixed tuple | Phase 4 view expansion | Medium |
| Legacy hand-rolled SVG components (`SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`, `TrackMap`) | No shared primitives | Phase 4 shared primitive layer | Medium |
| `packages/visuals` zero tests | 2,736 LOC unprotected | As shared primitives land | Medium |
| Computational core in TypeScript | Works for reduced-order | Phase 4.1 EKF, Phase 5 MPC | High — deliberation pending |
| No performance instrumentation | No measurements | Before Phase 4 library commitment | High |

---

## Open Questions Arising from This Audit

| Question | Why It Matters | Who Decides |
|----------|----------------|-------------|
| Does the `SimulationBackend` abstraction get its own phase, or fold into Phase 4 foundation work? | Sequencing affects Phase 4 scope | User + plan-phase deliberation |
| Should educational content be Phase 4 scope or a dedicated Phase 4.x? | Affects Phase 4 sizing | User + deliberation |
| Language for long-term computational backend — Python, Rust, C++, Julia, or hybrid? | Determines tech debt path | Full deliberation + research |
| How far out should the roadmap project — v2 only, or v2/v3/v4? | Shapes long-horizon thinking | User preference |
| Should performance budget live in VISION.md or PROJECT.md? | Determines enforceability | User preference |

---

## Next Actions

1. **User review** of this audit response and follow-up plan
2. **Kickoff research stage** — spawn parallel research agents for the five research tasks above
3. **Deliberation sequence** — computational backend first (unblocks several other decisions), then visualization architecture, then educational content, then long-horizon roadmap
4. **Roadmap update** — happens after deliberations resolve
5. **Guardrail implementation** — CLAUDE.md additions + tech debt registry + phase gate updates

---

*Audit response drafted: 2026-04-10*
*Source audits: three parallel independent evaluations (2026-04-08)*
