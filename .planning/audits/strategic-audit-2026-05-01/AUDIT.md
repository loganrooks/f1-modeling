# F1 Modeling Lab — Strategic Audit

**Date:** 2026-05-01
**Scope:** End-to-end review of where the project is, where it is going, agential development readiness, code quality, gaps, and GSD-Reflect (GSD-2) usage. Synthesis of four parallel discovery passes (planning corpus, codebase, agential setup, GSD-1 vs GSD-2).
**Status:** Strategic review (not a formal phase gate). Companion: `INTERVENTIONS.md`.
**Author:** Orchestrator (Claude Code) with delegated discovery agents.

> Key correction up front: the question framing assumed the repo is on GSD-1 and asked whether to migrate to GSD-2. **The repo is already on GSD-Reflect 1.18.3.** The real choice is (a) whether to upgrade to 1.19.10, and (b) whether to actually use the GSDR primitives that are available but underused (`/gsdr:spike`, `/gsdr:deliberate`, `/gsdr:audit`, `/gsdr:reflect`). See Section E.

---

## Executive summary

The F1 Modeling Lab has **unusually strong planning doctrine** for an engineering codebase — three-tier doctrine hierarchy (`VISION` → `LONG-ARC` → operational canon), the just-completed Vision Alignment Initiative (D1–D5), 11 typed tech-debt entries with rewrite triggers, 21 captured signals, and a typed claim ontology already in use in Phase 3.2 CONTEXT.md.

The codebase itself is **disciplined where it matters most**: strict TypeScript with `noUncheckedIndexedAccess`, a verified browser-safe `packages/domain` boundary, Zod-validated run records with `.strict()` schemas, immutable run records via `deepFreeze`, and provenance/assumption types as first-class citizens. Phase 1–3.1 verified clean (400 tests, 0 failures).

**The biggest gap is doctrine-vs-enforcement.** Almost every guardrail in `CLAUDE.md` (honesty, browser-safe boundary, legacy renderer freeze, fidelity labeling, accessibility-architectural, thin-client baseline, performance budget, vision-alignment checkpoint) is **prose-only**. There is no CI, no pre-commit hooks, no `.claude/settings.json`, no project-local subagents, no ESLint, no benchmark harness, no `axe`-based a11y test, and no automated index for the signals KB. The two phase-completion misses on record (Phase 3.1 had no Codex audit; Stage 2D advisory pattern was used instead of the formal audit then waiting in `audit/`) both happened by simple inattention — there was no mechanical gate to catch them.

**Phase 3.2 is the highest-leverage next step**, but the corridor (3.2 → 3.3 → 3.4) is critically chained: Phase 3.3 cannot start substrate work until `AccessibleChartContract` and `AnchorRegistry` are *defined as code* (not just named in markdown), and a benchmark harness exists. None of those three artifacts exist yet. This is the single biggest planning risk.

**GSD-Reflect verdict: hybrid uplift.** Upgrade 1.18.3 → 1.19.10 immediately (the 1.19.7 Codex enumeration fix directly addresses an active critical signal), then *use* the existing primitives that the project hand-rolls every time:
- `/gsdr:spike` for the two missing contract types (cheaper than another initiative)
- `/gsdr:deliberate` for the next architectural decision (cheaper than the full VAI shape)
- `/gsdr:audit` for the next cross-model audit (replaces hand-rolled prompts)
- `/gsdr:reflect` against the 21 captured signals (none have been distilled into lessons yet)

**Concrete interventions** are catalogued in `INTERVENTIONS.md` and tagged as one of: **Now** (this week, ≤1 day), **Corridor** (within 3.2/3.3/3.4 planning), **v1 close**, or **v2/initiative**.

---

## A. Where we are

### A.1 Phase progression

5 of ~14 phases complete. 21 of 61 v1 plans complete (~34%). Detailed status:

| Phase | Status | Notes |
|---|---|---|
| 1 — Foundations & scenario schema | Complete (2026-03-20) | 9/9 plans |
| 2 — Reduced-order lap model | Complete (2026-03-27) | 3/3 plans |
| 2.1 — Circuit geometry pipeline (inserted) | Complete (2026-04-03) | 1/1 plan |
| 3 — Tire/electrical/weather/environment/energy | Complete (2026-04-03) | 4/4 plans |
| 3.1 — Race state, typed artifacts, branchable runs | Complete (2026-04-08, verified 2026-04-09) | 4/4 plans, 400 tests pass |
| **3.2 — Backend execution, job artifacts, regulation execution flow** | **Active. CONTEXT + 5 PLANs drafted; not yet executed** | This is the live focus |
| 3.3 — Visualization substrate, workspace shell, performance | Not scaffolded | Blocked on 3.2 |
| 3.4 — Educational foundation, minimal regulation semantics | Not scaffolded | Blocked on 3.3 |
| 4 — Strategy workbench (paused) | Paused; pre-VAI CONTEXT/RESEARCH still on disk | Will need replanning post-3.4 |
| 4.1 — Observer & replay workbench | Not started | EKF planning pending |
| 5 / 5.1 — Driver style + control + optimization | Not started | Visible split per D4.B |
| 6 — Data import + telemetry alignment | Not started | FastF1/OpenF1 chosen |
| 7 — Calibration & validation workbench | Not started | |
| 8 — First regulation/design exploration wave | Not started | Narrowed from full multi-era |

### A.2 Vision Alignment Initiative (VAI) — the largest planning event in project history

The VAI ran 2026-04-08 → 2026-04-13 and ratified five decisions:

- **D1 — Backend boundary architecture.** Two-stage compute boundary (`request compilation → backend execution`), transport-neutral `SimulationBackend` with submit/get/cancel/subscribe/listArtifacts/fetchArtifact, typed `ArtifactEnvelope` with separate `artifactId`/`artifactKey` and explicit lineage/provenance, REST+SSE first transport, regulation canonicalization before execution.
- **D2 — Visualization architecture.** Renderer-agnostic surface (`ArtifactEnvelope<TPayload> → ViewAdapter<TPayload, TViewModel> → RenderSurfaceProps<TViewModel>`), shared interaction state, recipe-driven shell replacing the three-zone `App.tsx`, design tokens, **WCAG AA minimum hard commitment**, Apollo-over-Tailscale thin-client baseline. Does **not** pre-commit to visx.
- **D3 — Educational content architecture.** Typed `LessonUnit`/`LearningPath` schemas, lesson bindings via recipe IDs / slot IDs / artifact-relative anchors, body adapter, in-app preview/validation/keyboard-traversal as architectural commitments.
- **D5 — Regulation semantic model.** Family-primary hybrid ontology, canonical runtime shape with stable `familyId`, raw + compiled persistence, comparability vocabulary (`direct`/`derived`/`family-specific`/`non-comparable`).
- **D4 — Long-horizon roadmap.** Phase 4 narrowed to a strategy workbench; three insertions (3.2/3.3/3.4) before Phase 4; v2 = numerical+semantic deepening, **v3 = calibrated comparative engineering lab (the platform-identity threshold)**, v4+ = operational/product expansion.

The VAI also produced 11 tech-debt registry entries (`VA-TD-01` through `VA-TD-11`), the `LONG-ARC.md` doctrine layer, the `CLAUDE.md` guardrails (honesty, accessibility-architectural, thin-client, legacy renderer freeze, vision-alignment checkpoint), and a debrief identifying that the initiative pattern is too expensive to repeat for routine decisions.

### A.3 Future-Aware Planning Harness Initiative — in-flight follow-on

A meta-initiative actively migrating the repo from "Reflect-as-doctrine" to "Reflect-as-enforced-behavior" by SHA-locking GSDR runtime overlays for `discuss-phase.md`, `plan-phase.md`, `research-phase.md`, `progress.md`, `resume-project.md`, plus context/phase-prompt/state templates. Wave 5 enforcement reassessment closed 2026-04-29 (commits `64b4b4b`, `110a72a`). The CLI `packages/future-aware-harness-cli` (commit `05fd2e8`) is the typed reimplementation of the bash overlay scripts.

### A.4 Knowledge base — present but underused

`.planning/knowledge/` carries 21 typed signals with full GSDR frontmatter (lifecycle, polarity, evidence/counter, occurrence_count). **0 reflections, 0 spikes.** The `index.md` is stale (lists 11/21 signals; auto-indexer not wired to refresh). Three of the captured signals are particularly load-bearing for this audit:

- `2026-04-09-codex-audit-14-retry-90-minute-struggle.md` (critical) — 90-min Codex CLI failure mode that 1.19.7 directly fixes.
- `2026-04-11-claude-bypassed-formal-audit-protocol.md` (notable) — Claude ran an advisory pattern when a formal audit request was waiting; structural argument for `/gsdr:audit` adoption.
- `2026-04-11-d2-underspecified-interface-types.md` — the `AccessibleChartContract`/`AnchorRegistry` carry-forward that became `VA-TD-09`/`-10`.

---

## B. Where we are going

The active corridor is the load-bearing structure for the next 3–4 months of development.

### B.1 The 3.2 → 3.3 → 3.4 corridor

`LONG-ARC.md:24-25`: *"The active long-horizon planning corridor is Phase 3.2 → 3.3 → 3.4, because the execution boundary, visualization substrate, and lesson/semantic foundation must land before wider Phase 4 product surfaces."*

| Phase | Mandatory deliverables | Dependencies |
|---|---|---|
| 3.2 | Transport-neutral `SimulationBackend`; compiled-request flow; async jobs with submit/get/cancel/subscribe; typed `ArtifactEnvelope` with lineage/provenance; split `runService.ts`; compile `ExecutionRegulationSnapshot` removing 2026 hardcoded constants; first long-lived local TS worker | `VA-TD-01`, `-02`, `-03` |
| 3.3 | Renderer-neutral substrate; shared interaction state; recipe-driven shell; design tokens; benchmark harness | `VA-TD-04`, `-05` (freeze), `-06`, `-08`, `-09`, `-10`, `-11` |
| 3.4 | `LessonUnit`/`LearningPath` schemas; recipe/anchor lesson bindings; preview/validation tooling; first strategy-engineer learning path; canonical regulation semantics inventory | Consumes 3.2 + 3.3 |

### B.2 Post-corridor

| Phase | Theme |
|---|---|
| 4 | Strategy workbench (consumes corridor; replans Phase 4 CONTEXT/RESEARCH) |
| 4.1 | Observer + replay (EKF, true/measured/estimated, time scrubbing, branch from mid-stint) |
| 5 / 5.1 | Driver style + control-ready plant interface; optimization-backed control + trajectory |
| 6 | FastF1/OpenF1 import + telemetry alignment |
| 7 | Calibration + validation workbench |
| 8 | First regulation/design exploration wave (narrowed) |

### B.3 v2 / v3 / v4+ thematic projection (per D4.C)

- **v2** — numerical + semantic deepening: compute-language reassessment (TS bridge → Rust/Python service if envelopes break), historical regulation expansion (2022-2025 ground-effect natural next), reference-competitor abstractions.
- **v3** — calibrated comparative engineering lab. **The platform-identity threshold.** Same substrate supports calibrated model-vs-reference workflows, multi-family/multi-era comparison with honest relation classes, deeper trade studies, real educational scaffolding.
- **v4+** — operational/product expansion: cloud compute, live race-weekend workflows, collaboration, RL after credible baselines.

### B.4 The vision-trajectory friction

Several vision pillars (`VISION.md:36-69`, `VISION.md:80-89`) do not have v1 delivery paths:

- **Real-time strategy capability** — Phase 4 ships strategy *comparison*, not real-time. Real-time would require WebSocket/streaming infrastructure deferred in D1 C2.
- **"Open during a race weekend"** — Phase 6 telemetry is roughly a year out; calibration is later. Live race-weekend use is explicitly v4+.
- **Cloud compute** — `LONG-ARC.md:43-44` explicitly defers this.

These are honest deferrals, not bugs. But the orchestrator should note the gap between v1 product identity and the full vision is large.

---

## C. Agential development readiness

**TL;DR:** Doctrine is exceptional. Mechanical enforcement is essentially zero. This is the single biggest agential uplift opportunity.

### C.1 What exists

- `.planning/` — extensive doctrine: `VISION.md`, `LONG-ARC.md`, `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `TECH-DEBT.md`, `AGENTS.md`, `ARTIFACT-GOVERNANCE.md`, plus rich `initiatives/`, `audits/` (with templates), `reviews/`, `knowledge/`, `phases/` directories.
- GSD-Reflect 1.18.3 installed (`config.json:106`). Recent CONTEXT.md uses 1.19.3+ typed-claim notation (`[evidenced:cited]`, `[governing:cited]`, `[assumed:reasoned]`).
- `tooling/future-aware-harness/` — repo-tracked SHA-locked overlay for GSDR runtime patches; `scripts/setup-future-aware-harness.sh` and `scripts/verify-future-aware-harness.sh` install/restore/verify.
- `packages/future-aware-harness-cli` — typed CLI reimplementation of the same overlay.
- `scripts/transcript-nlp/` — TypeScript pipeline for analyzing Claude/Codex session transcripts (used in VAI debrief).
- Audit infrastructure: `audits/templates/audit-request-template.md`, `audit-response-template.md`, README distinguishing formal audits from advisory reviews. Three audits on disk (conformance 2026-04-07, strategic-gap 2026-04-07, vision-audit-2026-04-08 with Opus + Codex high + Codex xhigh).
- Project-local memory at `~/.claude/projects/.../memory/` with 7 reference/feedback notes.

### C.2 What is missing (mechanical enforcement)

- **No `.claude/settings.json`** — no permissions allowlist, no hooks (PreToolUse, PostToolUse, Stop, etc.). Every safe Bash invocation triggers a permission prompt; no automated guardrails fire on Edit/Write.
- **No `.claude/agents/`** — no project-local subagents (e.g., honesty-auditor, vision-alignment-auditor, audit-pre-flight).
- **No `.claude/skills/`, no `.claude/commands/`** — no project-local skills.
- **No CI** — `.github/` does not exist. No GitHub Actions, no GitLab CI, no Makefile, no justfile. Every quality gate (typecheck, root `npm test`, build, lint, benchmarks, a11y) is a developer-command-line gate.
- **No pre-commit hooks** — no `.husky/`, no `lint-staged`, no `pre-commit` framework.
- **No ESLint, no Prettier** — verified across all package.json files.
- **No benchmark harness** — `*.bench.ts` absent. `VA-TD-08` says any visualization or async work without benchmark evidence is "an active process failure"; the harness is itself the debt entry.
- **No accessibility test infra** — no `axe`, `@axe-core/*`, `jest-axe`. None of the visuals tests assert WCAG behavior.
- **No `packages/visuals` tests** at all (`VA-TD-06`).
- **Knowledge base index stale** — 11/21 signals indexed; no automation refreshes.
- **Auto-reflect off** — `automation.reflection.fires: 0`; signal-collection has 0 fires / 4 skips (`level-1` skip).
- **No lessons distilled** — 21 signals, 0 lessons in `knowledge/lessons/`.
- **`.claude/worktrees/agent-*`** — 7 stale agent worktrees from late-March operations, disconnected from current `main`, consuming disk and confusing `git worktree list`.

### C.3 Doctrine vs enforcement gap (per CLAUDE.md guardrail)

| Guardrail | Doctrine source | Enforcement | Gap |
|---|---|---|---|
| Honesty constraints | CLAUDE.md, LONG-ARC.md, plan templates | Prose only | **High** |
| Visible fidelity labeling | CLAUDE.md, `VA-TD-11` | Prose; debt registered | **High** |
| Browser-safe domain boundary | CLAUDE.md, ARTIFACT-GOVERNANCE | Bundler default; no lint rule | Medium |
| Preset snapshots in run records | Schema (Zod) | **Mechanically enforced** | None |
| Legacy renderer freeze | CLAUDE.md, `VA-TD-05` | Prose only | **High** |
| Phase 4 contract completion (`AccessibleChartContract`, `AnchorRegistry`) | CLAUDE.md, `VA-TD-09`/`-10` | Plan-gate prose | Medium |
| Strict TypeScript / `noUncheckedIndexedAccess` | tsconfig.base.json | **Mechanically enforced** | None |
| Future Awareness section | CLAUDE.md, AGENTS.md, harness templates | Template-enforced shape; quality not gated | Medium-Low |
| Vision alignment checkpoint | CLAUDE.md (post-VAI) | Prose only; not in templates yet | **High** |
| Quality gates (typecheck, root `npm test`, build, verifier, codex audit) | CLAUDE.md | Manual; verifier agent helps | High |
| Cross-phase regression check | CLAUDE.md | Manual | **High** |
| Benchmark evidence | CLAUDE.md, `VA-TD-08` | Prose only | **Critical** (no harness) |
| Tech-debt registry update on trigger | CLAUDE.md, plan template `tech_debt_disposition` field | Template-enforced | Low-Medium (well-enforced) |

### C.4 Hybrid runtime caveat

`AGENTS.md` says hooks are unavailable because the runtime is Codex. **This is partially out of date.** Codex still has no hooks, but Claude Code is also actively used (this audit is a Claude Code session). Hooks via `.claude/settings.json` would fire during Claude Code sessions and provide partial structural enforcement. CI is the universal solution that covers both runtimes.

---

## D. Code quality review

Strict, mostly clean. Concentrated debt in two god services.

### D.1 What is good

- **TypeScript strictness** — `tsconfig.base.json:19-23` enforces `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. Every workspace extends and only overrides `module`/`moduleResolution`/emit settings. Conformance audit 2026-04-07 confirmed 0 `as any`, 0 `@ts-ignore`.
- **Domain layer (`packages/domain/`)** — Zod 4.x with `.strict()` everywhere, browser-safe boundary verified, provenance/`schemaVersion`/run-record schemas first-class, `createRunRecord` `deepFreeze`s output. `node/` subpath cleanly exposed.
- **Sim-core** — Three sub-models (lap/stint/race) with pure functions, discriminated-union summary contract, careful forward-backward QSS solver with `Float64Array` buffers and explicit assumption documentation, integration tests load real circuit JSON.
- **Local API** — Fastify + Zod boundaries, thin routes delegating to services, shaped error envelopes.
- **Test posture (where it exists)** — 15 test files, ~4,667 lines. Sim-core strong (8 files, ~2.7k lines). API integration tests use `app.inject` against ephemeral `mkdtemp` workspaces.

### D.2 Concentrated debt

- **`apps/local-api/src/services/runService.ts` is 932 lines** — registered as `VA-TD-01`. Contains four create-run functions, three preset loaders, a duplicated `localValidateTireInventory` (with self-admitting "delete after merge" comment at lines 64-72), and `findStraightZones`. Synchronous filesystem reads (`readFileSync`) inside async route handlers (lines 356, 379). Phase 3.2 plans address this.
- **`apps/web/src/features/runs/RunSummaryPanel.tsx` is 932 lines** — the longest source file. Dispatches on `harnessId` strings without a `"race-simulation"` view path; race runs silently fall through to `PlaceholderRunView`.
- **`packages/visuals` has zero tests** (`VA-TD-06`).
- **No keyboard interaction in any visualization** — `grep onKeyDown|onKeyUp|tabIndex` returns nothing across `packages/visuals`. Hover-only tooltips on `SpeedProfileTrace`, `SoCTrace`, `TrackMap`. WCAG AA fails for keyboard users on every chart.
- **No React `<ErrorBoundary>` in `apps/web/src/main.tsx`** — a single corrupted `workspace-data/runs/*.json` file will throw out of `runRecordSchema.parse` and white-screen the app.
- **`apps/local-api/src/persistence/fileStore.ts` writes are not atomic** — direct `writeFile` to target path; concurrent saves race.
- **`apps/local-api/src/routes/health.ts`** hardcodes `host: '127.0.0.1', port: 8787` while server respects `process.env.HOST/PORT`. Honesty smell on the health endpoint itself.
- **`packages/sim-core/src/stintModel/stintRunner.ts`** bakes lap-level discretization into the public API (`StintConfig.totalLaps`, `StintResult.lapTraces`, `LapTrace`). `CLAUDE.md` explicitly warns: "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs." This is a Phase-5 problem; **not currently in the registry.**
- **Discriminated-union `SimulationRunSummary` from sim-core is unused by `apps/web`** — `RunSummaryPanel.tsx` re-implements runtime narrowing on `Record<string, unknown>` shapes.
- **`apps/web/src/features/scenario/ScenarioEditor.tsx`** uses `JSON.stringify` equality for unsaved-change detection without deterministic key order; the API normalizes keys on write but the web does not.
- **Race-simulation harness has API + sim-core support but no web UI** — honesty regression. `apps/web/src/features/workspace/api.ts` has no `createRaceSimulationRun()` either.
- **Visible fidelity labeling is partial.** `AssumptionPanel`, `TrackContextPlaceholder`, and the assumption ledger in `App.tsx` are best-in-class. But chart panels (`MetricTracePanel`, `SpeedProfileTrace`, `SoCTrace`, `SensitivityWaterfall`) carry no fidelity badges. `LapModelRunView` and `StintModelRunView` hard-cast every model assumption to `kind: "engineering-inference", confidence: "medium"` even though the data carries actual provenance source-type. (Captured by `VA-TD-11`.)

### D.3 Architecture-vs-doc drift

CLAUDE.md lists 5 visual primitives. Actual exports total 10 (also `SoCTrace`, `SpeedProfileTrace`, `SensitivityWaterfall`, `TrackMap` from Phase 2/3 deliverables). CLAUDE.md does not mention `packages/future-aware-harness-cli` (added 2026-04-29) or `scripts/transcript-nlp/` (active).

### D.4 Phase 4 readiness

**`AccessibleChartContract` and `AnchorRegistry` are not defined anywhere in code.** Confirmed by `grep -rn "AccessibleChartContract|AnchorRegistry"`: both names appear only in markdown (CLAUDE.md, STATE.md, phases/03.2-*, the D2-underspec signal). No `.ts` file declares either type. Both are correctly logged as `VA-TD-09` and `VA-TD-10` Phase-3.3 planning gates. Both are needed before D2 substrate code lands.

---

## E. GSD-2 / GSD-Reflect verdict

**Premise correction:** The repo is already on GSD-Reflect 1.18.3, not GSD-1. Evidence:
- `.planning/config.json:gsd_reflect_version: "1.18.3"`
- `.planning/STATE.md` resume hint: `$gsdr-discuss-phase 3.2`
- `.planning/knowledge/` exists with 21 GSDR-shaped signals (lifecycle, polarity, evidence/counter, etc.)
- `.planning/audits/README.md` uses the formal-audit / advisory-review distinction GSDR added
- `.planning/initiatives/vision-alignment-2026-04/deliberations/` uses paired deliberation + decision-anchor files (the same pattern `/gsdr:deliberate` produces)
- Phase 3.2 CONTEXT.md uses the 1.19.3+ typed-claim notation
- The harness overlay at `tooling/future-aware-harness/` patches GSDR-specific files

**The honest decision is therefore:**
1. **Run `/gsdr:upgrade-project` to move 1.18.3 → 1.19.10.** Mostly additive; the 1.19.7 Codex enumeration fix directly addresses the active critical signal (90-min Codex retry struggle).
2. **Use existing GSDR primitives** the project hand-rolls every time. Adopt them piecewise.
3. **Keep the bespoke doctrine layer.** `LONG-ARC.md`, the Future-Aware Planning Contract, the initiative pattern for sufficiently-large decisions, the runtime Codex overrides — these are richer than upstream and must not be flattened.

### E.1 What this repo specifically gains by leaning harder on GSDR

- **`/gsdr:spike`** for `AccessibleChartContract` and `AnchorRegistry` shape decisions — the canonical primitive for "we don't know what shape this contract should be." Two spikes linked to Phase 3.3 RESEARCH.md, each with hypothesis + experiment + decision artifact. Currently 0 spikes recorded.
- **`/gsdr:deliberate`** for the next architectural decision (e.g., async-backend acceptance at the close of Phase 3.2). State-machine target: `open` → `concluded` → `adopted` → `evaluated`. Cheaper than a full initiative; closes the VAI-debrief observation that "the value ultimately concentrated in a small set of synthesis artifacts."
- **`/gsdr:audit --delegation cross_model:codex`** for next cross-model audit. Replaces hand-rolled prompts with the 1.19.4 3-axis taxonomy (subject × orientation × delegation) and composed obligations. Directly remediates the bypass-formal-audit-protocol signal.
- **`/gsdr:reflect`** against the 21 captured signals. None have been distilled into lessons. Several signals (codex retries, log-sensor path, audit-protocol bypass) describe the same family and would distill into one or two durable lessons.
- **`/gsdr:collect-signals 03.1`** post-hoc as a sensor-vs-manual comparison. If sensors emit signals manual logging missed, that is the strongest argument for letting the automation fire on future phases.
- **`gsdr-context-checker`** — verifies the 1.19.3+ typed claim ontology that Phase 3.2 CONTEXT.md is already using. Without the upgrade, the typed assertions are decorative.

### E.2 What the repo would not gain

- **Discuss/plan/execute discipline** is already baked in. CONTEXT → RESEARCH → PLAN → SUMMARY per phase is identical under both versions.
- **The bespoke `LONG-ARC.md`/`AGENTS.md`/Future-Aware Planning Contract is richer than upstream.** Migration must not flatten this.
- **TypeScript/build/test gates** are CLAUDE.md-enforced; GSDR's verifier doesn't change that contract.
- **Runtime Codex overrides** are repo-original and must be preserved through `/gsdr:reapply-patches`.
- **The `/gsd-ship`/`/gsd-pr-branch`/`/gsd-code-review`/`/gsd-ui-phase`/`/gsd-ui-review` family** is GSD-1-only and not in the current `gsdr/` set. Not currently used here, so this is unlikely to bite, but it is a real asymmetry.

### E.3 Risks

- **Versioned doctrine drift** — GSDR has shipped 13 minor versions in ~5 weeks.
- **Workflow file token costs** — heavier `/gsdr:audit` and `/gsdr:deliberate` reliance increases context cost.
- **Codex-runtime parity is partial** — the project carries patches manually; upgrade will require `/gsdr:reapply-patches`.
- **Auto-reflection backlog risk** — turning on automation before forming a habit of reviewing signals can produce unread synthesizer output.
- **Loss of habituated workflow** — the VAI debrief explicitly says the bespoke initiative pattern "Worked Well" and should be kept. Replace with `/gsdr:deliberate` only for routine decisions; keep initiatives for cross-cutting strategic refinement.

### E.4 Recommendation

**Hybrid uplift, with a forced minimum upgrade.** Concretely:

1. Run `/gsdr:upgrade-project --auto` immediately after committing the pending `.planning/config.json` modification.
2. Adopt `/gsdr:spike` for the two missing contract types (Phase 3.3 planning gates).
3. Adopt `/gsdr:deliberate` for the next architectural decision (e.g., async-backend acceptance at close of Phase 3.2).
4. Adopt `/gsdr:audit --delegation cross_model:codex` for the next cross-model audit.
5. Run `/gsdr:reflect` and `/gsdr:collect-signals 03.1` manually once each, review output, then decide on automation.
6. Keep the bespoke doctrine layer untouched.

The full step-by-step migration plan is in `INTERVENTIONS.md` Section M.

---

## F. Identified gaps (cross-cutting)

### F.1 Planning gaps

1. **Phase 4 CONTEXT.md and RESEARCH.md are pre-VAI** — they reference the visx assumption D2 explicitly rejected. Phase 4 will need a fresh CONTEXT/RESEARCH after 3.4 lands. No current doctrine forces replanning vs salvage.
2. **Phase 3.3 and 3.4 directories not scaffolded** — `STATE.md:73-77` calls this out. Should happen before automatic phase routing is fully clean.
3. **Multi-regulation is a vision pillar with one family of evidence** (only `fia-2026-baseline.json` exists). D5 canonicalization is being designed on hypothetical second instances. The first non-2026 family is deferred.
4. **TypeScript compute bridge re-evaluation has no scheduled audit gate** — `VA-TD-07` is empirical (Phase 4.1 EKF / Phase 5 solver / Phase 7 calibration thresholds), but the benchmark harness that would *measure* those thresholds is itself Phase 3.3 work (`VA-TD-08`). Risk of cascading slip if Phase 4.1 lands an EKF, runs slowly, and triggers a v2 compute migration mid-v1.
5. **Visible fidelity labeling has architectural contracts but no UI pattern** (`VA-TD-11`). Phase 4 will ship strategy comparison UIs that look confident even when artifacts are honestly placeholder/reduced-order.
6. **Real-time strategy capability** is a vision pillar but has no v1 delivery path. Implicit deferral; should be explicit.

### F.2 Code gaps (not yet in TECH-DEBT.md)

These are real but unregistered. Worth proposing as new entries:

| Candidate | Location | Suggested phase target |
|---|---|---|
| Lap-level discretization in sim-core public API | `packages/sim-core/src/stintModel/{stintRunner.ts, types.ts}` | 5 (R-PLANT) |
| `apps/local-api/src/persistence/fileStore.ts` write atomicity | persistence layer | 3.2 |
| Sync filesystem reads in async handlers | `runService.ts:356, 379`, `routes/circuits.ts:17` | 3.2 |
| No in-memory preset/circuit catalog cache | API services | 3.2 |
| No React error boundary | `apps/web/src/main.tsx` | Now (small fix) |
| No CI / lint / formatter | repo-level | Now (high-leverage) |
| Race-simulation harness API/sim-core support but no web UI | `apps/web/src/features/runs/RunSummaryPanel.tsx`, `apps/web/src/features/workspace/api.ts` | 3.3 (or honest placeholder now) |
| Duplicated `localValidateTireInventory` self-admitting dead canary | `runService.ts:64-133` | 3.2 cleanup |
| `SimulationRunSummary` discriminated-union unused by web | `apps/web/src/features/runs/RunSummaryPanel.tsx` | 3.2-3.3 |
| Chart SVGs lack `<title>`/`<desc>`, keyboard handlers, data-table fallback | `packages/visuals/src/traces/*` | Bug-fix territory; legal under freeze |

### F.3 Agential gaps

1. **Mechanical enforcement of CLAUDE.md guardrails** is essentially zero. Every guardrail relies on agent attention.
2. **Cross-model audit discipline is bypass-able** — Phase 3.1 had no Codex audit despite `CLAUDE.md` requiring it. Documented in signal `2026-04-08-missing-codex-cross-model-audit-phase-31.md`.
3. **Audit-bypass-protocol risk** — Claude itself defaulted to advisory pattern when a formal audit was waiting. Captured in signal but unmitigated.
4. **Knowledge base index stale** (11/21 signals listed).
5. **No lessons distilled** from 21 signals.
6. **Memory references 24 days old with staleness warnings** — `reference_codex_audits.md`, `feedback_future_awareness.md` are load-bearing but live outside the repo's enforcement perimeter.
7. **Dual harness implementations** — `scripts/setup-future-aware-harness.sh` + `verify-future-aware-harness.sh` overlap with `packages/future-aware-harness-cli/`. Future drift trap.

### F.4 Process gaps

1. **`.planning/config.json` is uncommitted** (`git status` shows `M`).
2. **`03.1-CONTEXT.md` is untracked** — phase verified clean but the CONTEXT.md was written after verification and never committed.
3. **`.claude/worktrees/agent-*` has 7 stale entries** — disconnected from current main. Should be pruned via `git worktree remove`.

---

## G. Brainstormed uplift themes

Seven themes emerge from synthesis. Each is expanded into concrete interventions in `INTERVENTIONS.md`.

1. **Mechanical enforcement layer** — convert doctrine to hooks/CI/tests/subagents. Single biggest agential uplift.
2. **Convert signals to lessons; finish GSDR migration** — upgrade 1.18.3→1.19.10, run `/gsdr:reflect`, refresh KB index, adopt `/gsdr:spike`/`/gsdr:deliberate`/`/gsdr:audit`.
3. **Close the corridor's planning gates** — define `AccessibleChartContract`, `AnchorRegistry`, benchmark harness, `VA-TD-11` UI pattern *as code* before Phase 3.3 substrate work.
4. **Code quality cleanup** — atomic writes, async filesystem reads, error boundary, health-endpoint honesty fix, race-simulation web view (or honest placeholder), sim-core lap-discretization registry entry.
5. **Vision-trajectory friction reduction** — plan second regulation family; calibration baseline timeline; v3 platform-identity threshold checkpoint.
6. **F1 domain depth** — real-time strategy architecture readiness; multi-renderer escape hatches; lesson scaffolding tooling; FastF1/OpenF1 calibration sourcing; tire/electrical/control fidelity progression; RL as later comparator.
7. **Process fixes** — commit pending work; reconcile dual harness implementations; refresh AGENTS.md hooks claim; prune stale worktrees; update CLAUDE.md drift (visuals primitive count, new packages).

---

## H. Source materials

### Primary doctrine
- `/home/rookslog/workspace/projects/f1-modeling/.planning/VISION.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/LONG-ARC.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/PROJECT.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/REQUIREMENTS.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/ROADMAP.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/STATE.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/TECH-DEBT.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/AGENTS.md`
- `/home/rookslog/workspace/projects/f1-modeling/.planning/ARTIFACT-GOVERNANCE.md`
- `/home/rookslog/workspace/projects/f1-modeling/CLAUDE.md`

### Decision anchors
- `/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` (D1)
- `.../02-decision-anchor.md` (D2)
- `.../03-decision-anchor.md` (D3)
- `.../04-decision-anchor.md` (D5)
- `.../05-decision-anchor.md` (D4)
- `/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/vision-alignment-2026-04/SUMMARY.md`
- `.../APPLICATION-LEDGER.md`
- `.../BOUNDARY-CONTRACT-MEMO.md`
- `.../RESEARCH-PRINCIPLES.md`

### Active phase
- `/home/rookslog/workspace/projects/f1-modeling/.planning/phases/03.2-backend-execution-job-artifacts-and-regulation-execution-flow/03.2-CONTEXT.md`
- `.../03.2-01-PLAN.md` through `03.2-05-PLAN.md`

### Knowledge base — load-bearing signals
- `/home/rookslog/workspace/projects/f1-modeling/.planning/knowledge/signals/f1-modeling/2026-04-09-codex-audit-14-retry-90-minute-struggle.md`
- `.../2026-04-11-claude-bypassed-formal-audit-protocol.md`
- `.../2026-04-11-d2-underspecified-interface-types.md`
- `.../2026-04-08-missing-codex-cross-model-audit-phase-31.md`

### In-flight initiative
- `/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md`

### Audits cited
- `/home/rookslog/workspace/projects/f1-modeling/.planning/audits/audit-response-2026-04-07.md`
- `.../vision-audit-2026-04-08/audit-response-2026-04-10.md`

---

## I. End notes

This audit was produced by an orchestrator (Claude Code Opus 4.7 at max effort) coordinating four parallel discovery agents:

- Planning + vision audit — `~/.claude/projects/.../tool-results/toolu_01PC9BQpfsqBU2E2GejyDmNp.json` (persisted; output exceeded 53 KB)
- Codebase quality audit — in-thread
- Agential dev setup audit — in-thread
- GSD-2 / GSDR fit and migration sketch — in-thread

The audit is **advisory**, not a formal phase gate. It is filed under `audits/` because the user explicitly requested an "audit", but per the `audits/README.md` distinction it should be treated as a strategic review.

Companion file: `INTERVENTIONS.md` (concrete proposals, milestone-fit tagging, prioritization).
