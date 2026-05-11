# F1 Modeling Lab — Strategic Audit: Concrete Interventions

**Companion to:** `AUDIT.md`
**Date:** 2026-05-01
**Status:** Proposed (orchestrator-authored). Not adopted until reviewed.

This document lists concrete interventions, each tagged with category, lift × cost, milestone fit, and companion dependencies. Use it as the menu the orchestrator and human collaborator can pick from.

**Lift / Cost legend:** S (≤1 hour), M (1 day), L (multi-day). **Lift** is the size of the benefit; **cost** is the size of the work.

**Milestone-fit legend:**
- **Now** — this week, before Phase 3.2 execution
- **3.2** — folded into Phase 3.2 plans (already covered or trivial addition)
- **3.3** — Phase 3.3 planning gate (must close before substrate code lands)
- **3.4** — Phase 3.4 (lesson + regulation semantics)
- **v1-close** — before v1 milestone wraps
- **v2** — v2 initiative seed
- **Vision** — long-horizon strategic seed

---

## A. Now (immediate — this week)

### INT-01: Commit pending planning state
- **Category:** Process
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `.planning/config.json` (modified, uncommitted), `.planning/phases/03.1-race-state-typed-artifacts-and-branchable-runs/03.1-CONTEXT.md` (untracked)
- **Mechanism:** Review the `config.json` diff (likely the future-aware harness initiative wave 5 closeout). Commit both files together with a `chore(planning):` or `docs(planning):` message. The CONTEXT.md was written for a verified-clean phase; committing it preserves the post-hoc context for future reflection runs.
- **Rationale:** A clean baseline is required before `/gsdr:upgrade-project` runs (INT-02), and the untracked CONTEXT.md is invisible to any sensor or reflection tooling until it is committed.

### INT-02: Run `/gsdr:upgrade-project` 1.18.3 → 1.19.10
- **Category:** GSDR command
- **Lift:** M — **Cost:** S — **Phase:** Now
- **Where:** Run from repo root after INT-01.
- **Mechanism:** Run **interactively**, not `--auto`, so any new init prompts (DevOps detection, CI presence, etc.) are visible and can be declined or accepted explicitly. Verify Node ≥22.5.0 first (`node --version`); 1.19.1 BREAKING. After the upgrade, confirm `gsd_reflect_version` updates and `runtime.platform=codex` + `agent_overrides` survive. Run `/gsdr:reapply-patches` to restore any local patches.
- **Rationale:** 1.19.7 directly fixes the Codex enumeration bug behind the active critical signal `2026-04-09-codex-audit-14-retry-90-minute-struggle`. 1.19.4 adds `/gsdr:audit` with `--delegation cross_model:codex` formalizing the existing manual workflow. 1.19.3 adds `gsdr-context-checker` that verifies the typed claim ontology Phase 3.2 CONTEXT.md is already using (without it, the typed assertions are decorative).

### INT-03: Run `/gsdr:reflect` against the 21 captured signals
- **Category:** GSDR command
- **Lift:** L — **Cost:** S — **Phase:** Now
- **Where:** `.planning/knowledge/signals/f1-modeling/`; outputs to `.planning/knowledge/lessons/` (or wherever 1.19.10 writes them).
- **Mechanism:** Run manually. Review the 2-4 distilled lessons before committing. Look specifically for cross-cutting patterns: codex-audit fragility, audit-protocol bypass, mid-milestone strategic refinement need.
- **Rationale:** 21 signals, 0 lessons. The signal corpus is being underutilized as a logbook rather than a corpus. Manual run first preserves human review before considering `auto_reflect: true`.
- **Companion:** Do **not** flip `auto_reflect: true` until at least one manual reflection has been reviewed (INT-09).

### INT-04: Refresh `.planning/knowledge/index.md`
- **Category:** Process / planning
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `.planning/knowledge/index.md`
- **Mechanism:** Re-run whatever indexing tool produced the original `index.md` (likely `/gsdr:health` or a 1.19.10 KB indexer). The current index lists 11/21 signals.
- **Rationale:** A stale index breaks `/gsdr:health-check` density probes and obscures recent signals.

### INT-05: Prune stale agent worktrees
- **Category:** Process
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `.claude/worktrees/agent-{a4ae8d31, ...}` (7 entries)
- **Mechanism:** `git worktree list` to confirm. For each: `git worktree remove .claude/worktrees/<name>` (or `--force` if uncommitted scratch). Then prune any leftover refs.
- **Rationale:** 7 detached agent worktrees from late-March operations remain as live worktrees pointed at custom branches. They consume disk and confuse `git worktree list`.

### INT-06: Add `.claude/settings.json` with permissions allowlist
- **Category:** Settings
- **Lift:** M — **Cost:** S — **Phase:** Now
- **Where:** `.claude/settings.json` (new)
- **Mechanism:** Use the `/fewer-permission-prompts` skill or hand-author. Allow common safe Bash patterns: `git status`, `git diff`, `git log`, `git show`, `npm run typecheck`, `npm run test`, `npm test --workspace=*`, `npm run build`, `ls`, `find`, `grep`, `rg`. Allow Read/Edit/Write within the repo. Disallow destructive Bash (`rm -rf`, `git push --force`) without explicit approval. Document in `.claude/settings.json` itself.
- **Rationale:** Currently no allowlist; every safe Bash invocation triggers a permission prompt. Reducing prompt friction without sacrificing safety is a low-cost ergonomic uplift.

### INT-07: Run `/gsdr:health-check`
- **Category:** GSDR command
- **Lift:** M — **Cost:** S — **Phase:** Now (after INT-02)
- **Where:** Repo root
- **Mechanism:** Run after the upgrade. Review composite score. Fix anything red; expect yellow on signal density (21 signals, 0 reflections is a known density imbalance until INT-03 lands).
- **Rationale:** Establishes the first 1.19.10 baseline for this repo and surfaces probes the team hasn't seen before (rogue files, signal density, automation watchdog, CI freshness — note: CI freshness will fail because no CI exists; that motivates INT-11).

### INT-08: Save key audit findings to memory
- **Category:** Memory
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `~/.claude/projects/-home-rookslog-workspace-projects-f1-modeling/memory/`
- **Mechanism:** Add memory entries for: (a) repo is on GSDR 1.18.3+ (project), (b) three-tier doctrine hierarchy VISION → LONG-ARC → operational canon (project), (c) "label-trap" intellectual move — read decisions at the contract level, not the implementation-label level (feedback), (d) corridor 3.2 → 3.3 → 3.4 is critically chained (project), (e) cross-model audits are mandatory at phase completion and have been bypassed before (feedback).
- **Rationale:** Several load-bearing facts about this project (it's already on GSDR; the doctrine has unusual depth; the corridor structure) are not derivable from a fresh CLAUDE.md read. Persisting them to memory avoids re-discovery cost across sessions.

---

## B. Pre-corridor agential uplifts (before Phase 3.2 execution)

### INT-09: Add `.github/workflows/quality-gate.yml` (CI)
- **Category:** CI
- **Lift:** L — **Cost:** S-M — **Phase:** Now / 3.2
- **Where:** `.github/workflows/quality-gate.yml` (new). Even if not pushed remotely, the file documents the intended gates.
- **Mechanism:** GitHub Actions on push + PR: `npm ci`, `npm run typecheck`, `npm test` at root, `npm run build`. Future-extensible to lint, benchmark sentinel, a11y. Cache `node_modules` keyed on `package-lock.json` hash.
- **Rationale:** The conformance audit 2026-04-07 caught the project not green at root because nothing automated the four-layer gate. CI fixes this in ~50 lines of YAML and turns "root `npm test` was red but only per-workspace tests were checked" into a structural impossibility. Universal across both Codex and Claude Code runtimes.
- **Companion:** Pairs with INT-13 (lint), INT-14 (benchmark), INT-15 (a11y).

### INT-10: Add `.claude/agents/honesty-auditor.md`
- **Category:** Subagent
- **Lift:** L — **Cost:** M — **Phase:** Now / 3.2
- **Where:** `.claude/agents/honesty-auditor.md` (new)
- **Mechanism:** Specialized subagent invocable on PR / diff scope. Reads the diff, then for any change touching artifact schemas, panels, or schemas asserts: (a) fidelity field present where required (D1 C3 contract), (b) panels carry visible fidelity badge or assumption-link if they expose fidelity-bearing data, (c) no metadata-only labeling regression, (d) no implied fidelity beyond current-phase support. Returns a per-finding accept/reject report.
- **Rationale:** `VA-TD-11` and 11 separate places (D2.C, D5.C, D4.D) demand visible labeling. A specialized agent invokable on PR / diff scope is the natural surface for a constraint that crosses many code paths.

### INT-11: Add `.claude/agents/vision-alignment-auditor.md`
- **Category:** Subagent
- **Lift:** M — **Cost:** M — **Phase:** Now / 3.2
- **Where:** `.claude/agents/vision-alignment-auditor.md` (new)
- **Mechanism:** Subagent invokable on every PLAN.md and CONTEXT.md. Asserts the "Vision Impact" / "Future Awareness" sections are non-trivial (e.g., flags <100 chars, matching a stock template, or omitting the milestone-only-justification rule). Cross-references LONG-ARC.md. Emits a structured report.
- **Rationale:** `sig-2026-04-10-workflow-gap-vision-alignment-guardrails` names this exact gap. The vision-audit cycle that *caught* this took three audits over four days; mechanizing it costs ~2 hours per check.

### INT-12: Add `.claude/agents/audit-pre-flight.md`
- **Category:** Subagent
- **Lift:** M — **Cost:** S — **Phase:** Now
- **Where:** `.claude/agents/audit-pre-flight.md` (new)
- **Mechanism:** Subagent that, on any session start, scans `.planning/audits/` and any `initiatives/*/audit/` for pending formal-audit request files (without a paired response). If any are found, surface them prominently before letting Claude pattern-match advisory reviews.
- **Rationale:** Directly addresses signal `2026-04-11-claude-bypassed-formal-audit-protocol`. The remediation proposed in that signal ("Check `audit/` first") has not been encoded anywhere a future Claude session would automatically read.

### INT-13: Add ESLint with browser-safe and legacy-SVG-freeze rules
- **Category:** Lint
- **Lift:** L — **Cost:** M — **Phase:** Now / 3.2
- **Where:** `eslint.config.mjs` (new), per-workspace overrides
- **Mechanism:** Two custom rules:
  1. **Browser-safe boundary:** disallow `node:fs`, `node:path`, `node:os`, `node:process` and bare `process.env` from `packages/domain/src/**` outside `packages/domain/src/node/`. Disallow same imports from `apps/web/src/**` and `packages/visuals/src/**`.
  2. **Legacy SVG freeze:** in `packages/visuals/src/**` (and the legacy SVG components in `apps/web/src/**`), warn on additions of new `<svg>`, `<polyline>`, `<line>`, `<rect>`, `<g>` elements that didn't already exist (this is best-effort; the rule may be a custom predicate that runs `git diff --no-color | grep -E "^\+.*<(polyline|line|rect|g)\b"` per file changed and emits a warning if matched).
- **Rationale:** Browser-safe boundary is currently enforced by bundler default behavior, not by an explicit guard; a stray `import "@f1-modeling/domain/node/preset-catalog"` would explode at bundle time. Legacy SVG freeze (`VA-TD-05`) is the highest-risk drift seam and currently relies entirely on agent attention.

### INT-14: Add benchmark harness contract
- **Category:** Test infrastructure
- **Lift:** L — **Cost:** M — **Phase:** Now → 3.3
- **Where:** `packages/sim-core/__bench__/` and `packages/visuals/__bench__/` (new)
- **Mechanism:** Use Vitest's `bench` API. Define a small benchmark contract: each bench file exports `name`, `setup`, and a benchmark function. CI sentinel checks bench output against an envelope file (`packages/sim-core/__bench__/envelope.json`). Initial envelopes are placeholder; first concrete envelope arrives in Phase 3.3 plan 3.3-05.
- **Rationale:** `VA-TD-08` says any visualization or async work without benchmark evidence is "an active process failure." Stub harness now means Phase 3.2 perf-relevant changes (job-event cadence, artifact fetch latency) can land with measurement.

### INT-15: Add `axe-core` accessibility test infrastructure
- **Category:** Test infrastructure
- **Lift:** L — **Cost:** S-M — **Phase:** Now / 3.3
- **Where:** `packages/visuals/__tests__/` (new), `apps/web/src/app/App.test.tsx` extension
- **Mechanism:** Install `axe-core` + `@axe-core/playwright` (already have Playwright MCP) or `vitest-axe`. Add a single smoke test asserting the rendered app has no AA-level violations. Per-component a11y tests grow as components migrate.
- **Rationale:** `D2.C` is a hard WCAG AA commitment. Currently no a11y test exists. The visuals' `role="img"` + `aria-label` pattern is a start but no automated check enforces it.

### INT-16: Pre-commit doctrine-link check
- **Category:** Hook
- **Lift:** M — **Cost:** S — **Phase:** Now
- **Where:** `.claude/settings.json` PreToolUse or `.husky/pre-commit` (depending on which runtime is active)
- **Mechanism:** When committing a new `*-PLAN.md`, grep-assert it references `LONG-ARC.md`, the relevant tech-debt id(s), and contains a `tech_debt_disposition:` block. Phase 3.2 plans show this is achievable when humans remember; a 5-line `grep -q` script ratifies it.
- **Rationale:** Keeps plans well-shaped without blocking emergency edits (the check is a soft warning, not a hard block, until the team ratifies).

### INT-17: Reconcile dual harness implementations
- **Category:** Process
- **Lift:** M — **Cost:** M — **Phase:** Now / 3.2
- **Where:** `scripts/setup-future-aware-harness.sh`, `scripts/verify-future-aware-harness.sh`, `packages/future-aware-harness-cli/`
- **Mechanism:** Pick one source of truth (the typed CLI is more durable). Document it in `tooling/future-aware-harness/README.md` as authoritative. Mark the bash scripts as legacy or remove them. Update `CLAUDE.md` and any AGENTS.md references.
- **Rationale:** Both currently exist; commit `05fd2e8` introduced the CLI but the bash scripts remain. Future drift between them will be a process trap.

### INT-18: Update `AGENTS.md` hooks claim
- **Category:** Doctrine
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `AGENTS.md` (root)
- **Mechanism:** The current "No hooks support — pre-commit hooks and other lifecycle hooks are unavailable in Codex" is partially out of date. Claude Code is also actively used; `.claude/settings.json` hooks fire during Claude Code sessions. Reword to: "Codex has no hooks support; Claude Code does. CI is the universal solution. Hooks via `.claude/settings.json` provide partial structural enforcement during Claude Code sessions."
- **Rationale:** Accurate doctrine reduces accidental over-deferral of useful enforcement.

### INT-19: Update `CLAUDE.md` for architecture drift
- **Category:** Doctrine
- **Lift:** S — **Cost:** S — **Phase:** Now
- **Where:** `CLAUDE.md` Architecture section
- **Mechanism:** CLAUDE.md lists 5 visual primitives; actual exports are 10 (`MetricTracePanel`, `RunComparisonCard`, `AssumptionPanel`, `TrackContextPlaceholder`, `WorkbenchShell`, `SoCTrace`, `SpeedProfileTrace`, `SensitivityWaterfall`, `TrackMap`). Add `packages/future-aware-harness-cli` and `scripts/transcript-nlp/` to the architecture summary.
- **Rationale:** Keeps onboarding context accurate.

---

## C. Code-quality interventions (small fixes; mostly Now / 3.2)

### INT-20: Add React error boundary to `apps/web/src/main.tsx`
- **Category:** Code
- **Lift:** M — **Cost:** S — **Phase:** Now
- **Where:** `apps/web/src/main.tsx`, new `apps/web/src/app/ErrorBoundary.tsx`
- **Mechanism:** A standard React `ErrorBoundary` component wrapping `<App />`. Logs the error to console with structured fields (boundary, error message, component stack) and renders an honest fallback UI ("Something went wrong loading workspace data; check `workspace-data/` for malformed JSON files").
- **Rationale:** A single corrupted `workspace-data/runs/*.json` will throw out of `runRecordSchema.parse` (`apps/web/src/features/workspace/api.ts:139`) and white-screen the app. 30-line fix.

### INT-21: Atomic file writes in `apps/local-api/src/persistence/fileStore.ts`
- **Category:** Code
- **Lift:** M — **Cost:** S — **Phase:** 3.2
- **Where:** `apps/local-api/src/persistence/fileStore.ts:47`
- **Mechanism:** Replace direct `writeFile` to target path with write-temp-then-rename (`writeFile(target+'.tmp', ...); rename(target+'.tmp', target)`). Optionally fsync.
- **Rationale:** Two concurrent saves to the same scenarioId race; partial-write corruption white-screens the app on next load.

### INT-22: Async filesystem reads in async route handlers
- **Category:** Code
- **Lift:** M — **Cost:** S — **Phase:** 3.2
- **Where:** `apps/local-api/src/services/runService.ts:356, 379`, `apps/local-api/src/routes/circuits.ts:17`
- **Mechanism:** Replace `readFileSync` with `await fs.promises.readFile`. Replace `loadCircuitCatalogFromDisk` (sync) with an async variant cached at app startup. Replace `loadTireCompoundPreset` similarly.
- **Rationale:** Sync FS in async handlers blocks the Fastify event loop. With Phase 3.2 introducing async jobs, this becomes a real responsiveness issue.

### INT-23: In-memory preset / circuit catalog cache
- **Category:** Code
- **Lift:** M — **Cost:** S — **Phase:** 3.2
- **Where:** `apps/local-api/src/services/{presetService.ts, circuitsService.ts}` (or as part of INT-22)
- **Mechanism:** Load catalogs once at app startup; cache. Invalidate on file change (`fs.watch`) or accept eventual-consistency for now.
- **Rationale:** Every `POST /api/runs` re-reads disk. Probably absorbed by `VA-TD-01` scope but should be explicit.

### INT-24: Health endpoint honesty fix
- **Category:** Code
- **Lift:** S — **Cost:** S — **Phase:** Now / 3.2
- **Where:** `apps/local-api/src/routes/health.ts:6-8`
- **Mechanism:** Return the actual `process.env.HOST ?? '127.0.0.1'` and `process.env.PORT ?? '8787'`, not hardcoded values. Or read from the `app.server.address()` once listening.
- **Rationale:** When developer runs `HOST=0.0.0.0 npm run dev`, the health endpoint lies. Honesty smell on the very endpoint that reports honesty.

### INT-25: Race-simulation web view (or honest placeholder)
- **Category:** Code
- **Lift:** M — **Cost:** M — **Phase:** 3.3 (or Now if honest placeholder)
- **Where:** `apps/web/src/features/runs/RunSummaryPanel.tsx:910-931`, `apps/web/src/features/workspace/api.ts`
- **Mechanism:** Two options. (a) Add a `RaceSimulationRunView` and a `createRaceSimulationRun()` API method. (b) Add an explicit honest placeholder ("Race simulation harness available via API; UI coming in Phase 3.3 / 4") that prevents silent fallthrough to `PlaceholderRunView`.
- **Rationale:** Race-simulation harness has full API and sim-core support but the web silently routes it through `PlaceholderRunView`. This is exactly the "implied fidelity" honesty regression the project explicitly forbids.
- **Suggested:** Option (b) Now, then option (a) in Phase 3.3 when substrate is ready.

### INT-26: Register lap-level-discretization debt
- **Category:** Registry
- **Lift:** L — **Cost:** S — **Phase:** Now
- **Where:** `.planning/TECH-DEBT.md` (new entry, e.g., `VA-TD-12`)
- **Mechanism:** Add: "Lap-level discretization in sim-core public API. `StintConfig.totalLaps`, `StintResult.lapTraces`, `LapTrace` types bake lap-level boundaries into the public `runStint`/`runStintFromState` contract. Phase 5 needs a time-step plant interface. Trigger: when Phase 5 control-ready plant interface lands; refactor or rename `lapTraces → stepResults` with an explicit `LapMarker[]` overlay. Severity: high. Phase target: 5 (R-PLANT)."
- **Rationale:** CLAUDE.md's Future Awareness rule names this exactly: "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs." But there is no registered debt entry. Registry-as-backbone is one of the project's strongest disciplines; this entry should exist before Phase 4.1/5 start.

### INT-27: Promote `SimulationRunSummary` discriminated union to web
- **Category:** Code
- **Lift:** M — **Cost:** M — **Phase:** 3.2-3.3
- **Where:** `apps/web/src/features/runs/RunSummaryPanel.tsx:43-46, 209-243, 692-725`; `packages/sim-core/src/contracts.ts:117-121`
- **Mechanism:** Import `SimulationRunSummary` from `packages/sim-core` (or re-export through `packages/domain` if sim-core isn't browser-safe — verify; per the agent's audit, sim-core is pure functions and browser-safe). Replace runtime structural narrowing with type-guard discriminated dispatch.
- **Rationale:** The web does runtime structural narrowing on `Record<string, unknown>` shapes, ignoring the discriminated union sim-core already exports. Type-flow debt.

### INT-28: Deterministic JSON stringify helper for unsaved-change detection
- **Category:** Code
- **Lift:** S — **Cost:** S — **Phase:** 3.2
- **Where:** `apps/web/src/features/scenario/ScenarioEditor.tsx:96-98`, new helper in `packages/domain/src/common/`
- **Mechanism:** Add a `deterministicStringify` helper to `packages/domain` (key-sorting recursively); use it in both web's unsaved-change detection and the API's `fileStore.ts:9-21` normalization path. Keep one source of truth for serialization order.
- **Rationale:** API normalizes keys on write; web doesn't. `JSON.stringify` equality on non-deterministic key order breaks unsaved-change detection unpredictably.

### INT-29: Remove duplicated `localValidateTireInventory`
- **Category:** Code
- **Lift:** S — **Cost:** S — **Phase:** 3.2 (folded into VA-TD-01 split)
- **Where:** `apps/local-api/src/services/runService.ts:73-133`
- **Mechanism:** Delete the duplicate. Use `validateTireInventory` from `packages/sim-core/src/raceModel/tireInventory.ts:71-123`. Keep the comment about why it was duplicated as a regression note (or delete; the registry will track the cleanup).
- **Rationale:** Self-admitting dead canary with a "delete after merge" comment at lines 64-72.

### INT-30: Add basic smoke tests for `packages/visuals` (`VA-TD-06`)
- **Category:** Test
- **Lift:** M — **Cost:** S — **Phase:** Now / 3.3
- **Where:** `packages/visuals/__tests__/` (new)
- **Mechanism:** One smoke test per component rendering with empty / non-empty props, asserting `role="img"` + `aria-label` presence on chart panels, no console errors. Use `vitest-dom` or `@testing-library/react` (already used by `apps/web/src/app/App.test.tsx`).
- **Rationale:** Currently zero tests in the package. Locking the legacy contract before substrate migration is far cheaper than locking it after.

---

## D. Corridor planning gates (3.2 / 3.3 / 3.4)

### INT-31: `/gsdr:spike` for `AccessibleChartContract`
- **Category:** GSDR command
- **Lift:** L — **Cost:** M — **Phase:** 3.3 (planning gate; can start now as a feeder spike)
- **Where:** `.planning/knowledge/spikes/accessible-chart-contract/` (new); links to forthcoming `phases/03.3-*/03.3-RESEARCH.md`
- **Mechanism:** Define hypothesis: "An `AccessibleChartContract` interface can be defined that (a) covers keyboard cursor traversal, (b) carries accessible labels for anchors, (c) supplies non-visual fallbacks where the renderer cannot expose native semantics, and (d) is satisfiable by the existing legacy SVG components without rewriting them." Run experiment: implement a minimum viable contract; instrument one existing trace component (e.g., `MetricTracePanel`) against it. Result artifact: type definition + adoption proof. Closes `VA-TD-09`.
- **Rationale:** CLAUDE.md says no D2 substrate work closes without this defined. Two signals (`2026-04-11-d2-underspecified-interface-types`, `2026-04-11-claude-bypassed-formal-audit-protocol`) name it. `/gsdr:spike` is the canonical primitive for "we don't know what shape this contract should be."

### INT-32: `/gsdr:spike` for `AnchorRegistry`
- **Category:** GSDR command
- **Lift:** L — **Cost:** M — **Phase:** 3.3 (planning gate; pairs with INT-31)
- **Where:** `.planning/knowledge/spikes/anchor-registry/` (new)
- **Mechanism:** Hypothesis: "An `AnchorRegistry` with register/resolve/update/remove/subscribe operations can be defined that (a) supports artifact-relative anchor identity (`runFamilyId + artifactKey + anchorNamespace + anchorPath`), (b) returns typed resolution outcomes (artifact-missing, anchor-missing, filtered-out, not-applicable, renderer-unavailable), and (c) is consumable by both the visualization substrate and the lesson schema." Result artifact: type definition + adoption proof against one chart and one lesson-step skeleton. Closes `VA-TD-10`.
- **Rationale:** D3 lesson bindings depend on this. CLAUDE.md says "Phase 4 contract completion: No D2 substrate implementation work closes without concrete `AccessibleChartContract` and `AnchorRegistry` definitions."

### INT-33: `/gsdr:deliberate` for async-backend acceptance
- **Category:** GSDR command
- **Lift:** L — **Cost:** M — **Phase:** 3.2 close
- **Where:** `.planning/knowledge/deliberations/async-backend-acceptance/` (new)
- **Mechanism:** At Phase 3.2 close, open a deliberation: "Has the async backend boundary delivered on D1's contracts in practice, or are revisions needed?" State-machine target: `open` → `concluded` (3.2 close) → `adopted` (3.3 begins consumption) → `evaluated` (after Phase 4.1 EKF lands or when an envelope-violating workload appears). This deliberation is the *cheapest* way to test the GSDR deliberation lifecycle on the F1 Modeling Lab.
- **Rationale:** The VAI debrief explicitly says full multi-stage initiative is too expensive for routine cross-cutting refinement; `/gsdr:deliberate` is the lower-cost path. Proves the lifecycle on one decision before broader adoption.

### INT-34: `/gsdr:audit` for next cross-model audit
- **Category:** GSDR command
- **Lift:** L — **Cost:** M — **Phase:** 3.2 verification
- **Where:** `.planning/audits/2026-XX-XX-{slug}/` (auto-created by `/gsdr:audit`)
- **Mechanism:** When Phase 3.2 reaches verification, run `/gsdr:audit "<topic>" --delegation cross_model:codex --orientation investigatory`. Compare the auto-emitted task spec against the existing bespoke `audits/templates/`. If GSDR's spec subsumes the local template, retire the local template and adopt the upstream convention; if not, document the gap as a signal.
- **Rationale:** Replaces the hand-rolled Codex prompts with the 1.19.4 3-axis taxonomy. Codifies the workflow that has been a 90-min struggle pattern. Directly remediates `2026-04-11-claude-bypassed-formal-audit-protocol`.

### INT-35: `VA-TD-11` visible-fidelity UI pattern
- **Category:** Code / pattern
- **Lift:** L — **Cost:** M — **Phase:** 3.3
- **Where:** `packages/visuals/src/inspectors/` (new chrome marker pattern); `apps/web/src/features/runs/RunSummaryPanel.tsx:538-544, 752-758` (ledger fix)
- **Mechanism:** Two parts:
  1. Define a chrome-marker UI pattern: a small badge component (`<FidelityBadge kind|confidence|source />`) that any chart panel can wrap or overlay. Store as a primitive in `packages/visuals/src/inspectors/FidelityBadge.tsx`. Add an `AccessibleChartContract` slot for it.
  2. Fix the assumption-ledger hard-cast: `LapModelRunView` and `StintModelRunView` currently hard-cast every model assumption to `kind: "engineering-inference", confidence: "medium"`. Use the actual provenance source-type from the model output instead.
- **Rationale:** Closes the loophole that contract-level honesty is only useful if the UI surfaces it. The hard-cast fix is bug-fix territory legal under the legacy renderer freeze.

### INT-36: Concrete benchmark envelopes for Phase 3.3
- **Category:** Test
- **Lift:** L — **Cost:** M — **Phase:** 3.3
- **Where:** `packages/visuals/__bench__/envelope.json`, `packages/sim-core/__bench__/envelope.json` (new)
- **Mechanism:** Phase 3.3 plan 3.3-05 (or equivalent) defines actual envelope numbers for: visualization initial paint, hover/scrub/brush latency on Apollo-over-Tailscale, sim-core lap-model run time on a 50-lap stint, async job event end-to-end latency. CI enforces envelopes via INT-09's CI workflow.
- **Rationale:** Concrete envelopes turn `VA-TD-08` from a deferred debt into an enforceable gate. The thin-client baseline can only be honored if it is measured.

---

## E. v1-close interventions

### INT-37: Replan Phase 4 CONTEXT.md and RESEARCH.md
- **Category:** Planning
- **Lift:** L — **Cost:** M — **Phase:** v1-close (after 3.4 lands)
- **Where:** `.planning/phases/04-strategy-race-simulation-and-explanation-surfaces/`
- **Mechanism:** Rewrite the Phase 4 CONTEXT.md and RESEARCH.md to consume the corridor's deliverables, removing pre-VAI assumptions (visx-as-foundation, synchronous shell). The new CONTEXT.md should explicitly answer the post-VAI vision-alignment checkpoint and Future Awareness sections.
- **Rationale:** Phase 4 corpus is pre-VAI and references rejected assumptions. There is no current doctrine forcing replan vs salvage; this intervention forces replan.

### INT-38: Schedule v2 compute-bridge re-evaluation gate
- **Category:** Planning / registry
- **Lift:** L — **Cost:** S — **Phase:** v1-close
- **Where:** `.planning/TECH-DEBT.md` `VA-TD-07`, ROADMAP.md
- **Mechanism:** Add a scheduled audit gate: when Phase 4.1 EKF Jacobians, Phase 5 solver demand, or Phase 7 calibration loops first run, automatically open a `/gsdr:deliberate` for the TypeScript-bridge re-evaluation. The empirical envelope (from INT-36) is the trigger condition.
- **Rationale:** `VA-TD-07` is empirically-triggered but with no scheduled audit. Risk of cascading slip if Phase 4.1 lands an EKF, runs slowly, and triggers a v2 compute migration mid-v1.

### INT-39: Audit and seed v2 second regulation family
- **Category:** Planning / initiative seed
- **Lift:** L — **Cost:** M — **Phase:** v1-close → v2
- **Where:** `.planning/initiatives/seeds/second-regulation-family.md` (new — use `/gsdr:plant-seed`)
- **Mechanism:** Plant a seed for "First non-2026 regulation family (likely 2022-2025 ground-effect)." Trigger conditions: v1 milestone close OR a calibration baseline emerges that needs cross-era validation. The seed should reference D5 canonicalization contracts and the comparability vocabulary.
- **Rationale:** Multi-regulation is a vision pillar but D5 is being designed on hypothetical second instances. The first non-2026 family is the first real test of the canonicalization, schema versioning, and comparability work.

---

## F. v2 / future initiative seeds

### INT-40: Seed real-time strategy architecture readiness
- **Category:** Initiative seed
- **Lift:** L — **Cost:** S — **Phase:** v2/v3
- **Where:** `.planning/initiatives/seeds/realtime-strategy-architecture.md` (new — use `/gsdr:plant-seed`)
- **Mechanism:** Plant a seed for "Real-time strategy capability — explicit architectural readiness review when Phase 6 telemetry import lands." Trigger: Phase 6 in active planning. Seed should reference VISION.md:14, 40 and D1 C2 (where richer full-duplex was deferred).
- **Rationale:** Real-time is a load-bearing vision pillar without a v1 delivery path. Without an explicit checkpoint, it stays implicit.

### INT-41: Seed calibration baseline timeline
- **Category:** Initiative seed
- **Lift:** L — **Cost:** S — **Phase:** v1-close → v2
- **Where:** `.planning/initiatives/seeds/calibration-baseline.md` (new — use `/gsdr:plant-seed`)
- **Mechanism:** Plant a seed: "Calibration baseline emerges from FastF1/OpenF1 import (Phase 6). Trigger: Phase 6 plan starts. The seed should pre-frame the question of which session and which circuit form the first calibration baseline (PROJECT.md open question #14)."
- **Rationale:** Phase 7 calibration is anchored to a baseline that doesn't exist yet. The seed forces the question early.

### INT-42: Seed multi-renderer escape hatch
- **Category:** Initiative seed
- **Lift:** L — **Cost:** S — **Phase:** v2
- **Where:** `.planning/initiatives/seeds/multi-renderer-escape-hatch.md` (new)
- **Mechanism:** Plant a seed: "Implement the `dense-canvas` and/or `gpu-layer` ViewFamily when production-density traces (50-70 lap, 6+ strategies) violate the thin-client envelope or when telemetry overlay density exceeds DOM/SVG performance." D2 C4 reserved these as escape hatches. Trigger: benchmark envelope violation OR Phase 6 telemetry overlay landing.
- **Rationale:** Vision says production-density visualization is part of "comes into its own." D2 reserves the escape hatch but does not commit. A seed forces the reassessment when triggers fire.

### INT-43: Seed RL-as-comparator integration
- **Category:** Initiative seed
- **Lift:** L — **Cost:** S — **Phase:** v3
- **Where:** `.planning/initiatives/seeds/rl-comparator.md` (new)
- **Mechanism:** Plant a seed: "RL is introduced as a comparator/extension to model-based control, after the simulator is calibrated. Trigger: Phase 7 calibration baseline accepted. Seed should reference deliberations/estimation-and-control-stack.md and PROJECT.md open question #11."
- **Rationale:** Pedagogically, RL is the *last* thing the project introduces, not the first. The control stack discipline is one of the project's strongest intellectual moves; a seed preserves the sequencing.

### INT-44: Seed observer/replay <-> control unification reassessment
- **Category:** Initiative seed
- **Lift:** L — **Cost:** S — **Phase:** v2
- **Where:** `.planning/initiatives/seeds/observer-control-unification.md` (new)
- **Mechanism:** Plant a seed referencing LONG-ARC.md:43-49's explicit non-decision on telemetry-import ↔ observer ↔ control unification. Trigger: when Phase 4.1 (observer) and Phase 5/5.1 (control) are both in flight; or when Phase 6 telemetry alignment opens the question of unified state representation.
- **Rationale:** A load-bearing non-decision deserves a scheduled reassessment.

---

## G. Vision-level seeds (ambitious)

### INT-45: Educational scaffolding to first-class content threshold
- **Category:** Vision seed
- **Lift:** L — **Cost:** S — **Phase:** v3
- **Where:** `.planning/initiatives/seeds/edu-scaffolding-first-class.md` (new)
- **Mechanism:** Plant a seed for VISION.md open question V1: "When does educational scaffolding become first-class content vs. just good UI?" Trigger: when role-based learning paths from D3 and 3.4 start to require lesson management at scale (multiple roles × multiple regulation families × multiple difficulty levels).
- **Rationale:** A vision-question with no v1 delivery path; preserves it as a seed rather than letting it drift.

### INT-46: Cloud compute migration trigger
- **Category:** Vision seed
- **Lift:** L — **Cost:** S — **Phase:** v4+
- **Where:** `.planning/initiatives/seeds/cloud-compute.md` (new)
- **Mechanism:** Plant a seed for VISION.md:62-65 cloud compute. Trigger: when local-machine simulator / SSH-remote workflow exhausts (specific envelopes TBD; could be solver demand, calibration loop scale, or multi-user concurrency requirements).
- **Rationale:** LONG-ARC explicitly defers; vision says it matters. Seed preserves both.

---

## H. Memory updates (now)

### INT-47: Save audit findings as memory
- **Category:** Memory
- **Lift:** S — **Cost:** S — **Phase:** Now (folded into INT-08)
- **Where:** `~/.claude/projects/-home-rookslog-workspace-projects-f1-modeling/memory/`
- **Mechanism:** New / updated memory entries:
  - **`project_gsdr_status.md` (project)** — Repo on GSDR 1.18.3. Already uses GSDR-shaped artifacts (signals, deliberations, audits). Migration to 1.19.10 pending. Use existing primitives (`/gsdr:spike`, `/gsdr:deliberate`, `/gsdr:audit`, `/gsdr:reflect`) before authoring custom workflows.
  - **`project_doctrine_hierarchy.md` (project)** — Three-tier doctrine: VISION.md (broad identity) → LONG-ARC.md (durable doctrine) → operational canon (PROJECT.md, ROADMAP.md, STATE.md). Read in that order. The tier hierarchy is intentional and resists scope creep at every level.
  - **`feedback_label_trap.md` (feedback)** — Read decisions at the contract level, not the implementation-label level. The visx-vs-canvas decision was the wrong-sized question; the actual decision was the contract shape. Apply this lens whenever facing "which package/library?"-shaped questions.
  - **`project_corridor.md` (project)** — Active long-horizon corridor is Phase 3.2 → 3.3 → 3.4. Critically chained: 3.3 cannot start substrate work until `AccessibleChartContract` and `AnchorRegistry` are defined as code AND a benchmark harness exists. None currently exist.
  - **`feedback_audit_discipline.md` (feedback)** — Cross-model audits are mandatory at phase completion per CLAUDE.md. The discipline has been bypassed before (Phase 3.1 Codex audit miss; Stage 2D advisory pattern instead of formal audit). Both are documented as signals. Always check `.planning/audits/` and any `initiatives/*/audit/` for pending formal-audit request files at session start.
- **Rationale:** Several load-bearing facts are not derivable from a fresh CLAUDE.md read. Persisting them avoids re-discovery cost across sessions.

---

## I. Suggested batching and sequencing

A practical execution order for the next 1-2 weeks, assuming the user wants to absorb interventions piecewise:

### Week 1 — "Stabilize and unblock"
- **Day 1:** INT-01 (commit pending), INT-08/INT-47 (memory), INT-05 (prune worktrees), INT-06 (`.claude/settings.json`).
- **Day 2:** INT-02 (`/gsdr:upgrade-project`), INT-03 (`/gsdr:reflect` manual), INT-04 (refresh KB index), INT-07 (`/gsdr:health-check`).
- **Day 3:** INT-18 (AGENTS.md hooks doctrine), INT-19 (CLAUDE.md drift), INT-09 (CI YAML — even if not pushed), INT-20 (error boundary).

### Week 2 — "Mechanical enforcement layer"
- **Day 4:** INT-13 (ESLint rules), INT-15 (a11y test infra), INT-30 (visuals smoke tests).
- **Day 5:** INT-10 (honesty-auditor subagent), INT-11 (vision-alignment-auditor), INT-12 (audit-pre-flight).
- **Day 6:** INT-16 (pre-commit doctrine-link), INT-14 (benchmark harness contract), INT-17 (reconcile dual harness).
- **Day 7:** INT-26 (register lap-discretization debt), INT-24 (health honesty fix), INT-29 (delete duplicate validator), INT-25 (race-sim placeholder).

### Phase 3.2 execution (folded into existing plans)
- INT-21, INT-22, INT-23, INT-27, INT-28 — alongside the existing 03.2-01 through 03.2-05 plans.
- INT-33 at 3.2 close. INT-34 for verification audit.

### Phase 3.3 planning gates
- INT-31, INT-32, INT-35, INT-36.

### v1-close
- INT-37 (replan Phase 4), INT-38 (compute-bridge gate), INT-39 (regulation family seed).

### Vision seeds
- INT-40 through INT-46.

---

## J. Risk register for these interventions

| Risk | Mitigation |
|---|---|
| Adding hooks/CI in flight slows phase work | Land all enforcement before Phase 3.2 execution begins. Plans are drafted but not executed. Window is now. |
| `/gsdr:upgrade-project` rewrites the runtime overrides | Back up `.planning/config.json`. Verify post-upgrade. Run interactively, not `--auto`. |
| `/gsdr:reflect` produces noisy lessons | Manual review before commit. Skip auto-reflect until at least one manual run is reviewed. |
| Custom subagents (INT-10/11/12) underperform on first iteration | Start with thin definitions; iterate. Each is one markdown file; cost of revision is low. |
| ESLint browser-safe rule false-positives | Allow opt-out via per-file `// eslint-disable-next-line` with a required comment explaining why. |
| Atomic-write fix breaks under Windows | The dev environment is Linux (Ubuntu 24.04 dionysus). Document Windows-incompat as a known limitation if it ever matters. |
| The corridor's planning gates (INT-31/32/35/36) cannot be done in parallel | They can. AccessibleChartContract and AnchorRegistry are independent type definitions with overlapping consumption sites; benchmark envelope is independent of both. |
| INT-37 Phase 4 replan loses prior research value | The pre-VAI 04-RESEARCH.md remains on disk. Treat the replan as additive; cite the original research as historical context. |

---

## K. What this intervention plan does NOT do

To preserve the project's hand-rolled patterns that have already proven valuable:

- It does **not** propose flattening LONG-ARC.md / VISION.md / AGENTS.md / Future-Aware Planning Contract into upstream GSDR templates.
- It does **not** propose retiring the initiative pattern. `/gsdr:deliberate` is for the smaller scope; initiatives remain valid for cross-cutting strategic refinement (the VAI was the right shape for what it covered).
- It does **not** propose enabling `auto_reflect` or `auto signal-collection` until manual runs are reviewed.
- It does **not** propose restructuring TECH-DEBT.md as pure signals. The narrative table stays; recurrence-of pointers are added as columns.
- It does **not** propose merging `/gsd-*` and `/gsdr:*` skill stacks. The migration is one-directional; old `/gsd-*` artifacts stay readable.
- It does **not** propose moving `.planning/` into a separate repo or sub-module. The first-party documentation discipline is the project's strongest agential asset.

---

## L. End notes

These interventions are catalogued, not adopted. The next move is for the orchestrator + human collaborator to:

1. Triage the **Now** items (Section A + relevant Section C/H) and approve or defer each.
2. Decide which corridor interventions (Section D) get `/gsdr:spike` or `/gsdr:deliberate` treatment.
3. Plant the v1-close and v2/v3+ seeds (Sections E/F/G) so they surface at the right moments.

The orchestrator recommends starting with INT-01 → INT-09 today and walking the rest of the **Now** list across Week 1 + 2.
