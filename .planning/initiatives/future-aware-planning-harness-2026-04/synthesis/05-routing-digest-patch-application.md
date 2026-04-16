# Wave 3C Application: Routing Digest Patch

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `3C`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-3C-apply-routing-digest-patch.md`
- Status: applied
- Scope: routing-focused overlay extension and live state digest uplift only
- Runtime target: `$HOME/.codex/get-shit-done-reflect`
- Materialization result: succeeded
- Install receipt: `$HOME/.codex/get-shit-done-reflect/.f1-modeling-future-aware-harness/install-receipt.json`
- Applied at: `2026-04-16T18:56:33Z`
- Backup dir: `$HOME/.codex/get-shit-done-reflect/.f1-modeling-future-aware-harness/backups/20260416T185633Z`
- Verification result: `./scripts/verify-future-aware-harness.sh` passed after materialization, and the restore path was exercised successfully after review follow-through

## 2. Files Created Or Updated

- `tooling/future-aware-harness/README.md`
- `tooling/future-aware-harness/manifest.json`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/progress.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/resume-project.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/state.md`
- `scripts/setup-future-aware-harness.sh`
- `.planning/STATE.md`
- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/05-routing-digest-patch-application.md`

## 3. Routing Surfaces Actually Materialized

Wave `3C` extended the existing `3B` manifest and installer path rather than creating a second patch mechanism.

The active runtime now materializes these newly managed routing files:

- `$HOME/.codex/get-shit-done-reflect/workflows/progress.md`
- `$HOME/.codex/get-shit-done-reflect/workflows/resume-project.md`
- `$HOME/.codex/get-shit-done-reflect/templates/state.md`

The bootstrap contract was also tightened during review follow-through: restore now resolves missing target backups from the recorded receipt history instead of assuming the latest backup tree contains every manifest target.

The previously patched `3B` steering-chain files were left intact and re-verified as already materialized:

- `workflows/discuss-phase.md`
- `workflows/research-phase.md`
- `workflows/plan-phase.md`
- `templates/context.md`
- `templates/phase-prompt.md`

## 4. What `STATE`, `progress`, And `resume` Now Do Differently

### `STATE.md`

- `STATE.md` now uses a compact `Routing Digest` section rather than a long mixed archive.
- the digest keeps only:
  - active doctrine refs
  - active tech-debt ids
  - active carry-forward
  - reduced-guarantee status
- the file is now pointer-heavy and routing-oriented instead of duplicating large portions of roadmap or decision history.

### `progress`

- `progress` now treats the `Routing Digest` in `STATE.md` as the load-bearing state summary when it exists.
- it surfaces active doctrine refs, active tech-debt ids, carry-forward, and reduced-guarantee status before offering the next action.
- if reduced-guarantee planning is active, it stops silent execute-next routing and points back to `$gsdr-discuss-phase` or a full-context `$gsdr-plan-phase`.
- it does not widen into direct `CONTEXT.md` parsing; routing remains state-driven in this wave.

### `resume`

- `resume` now extracts and presents the same routing digest from `STATE.md`.
- reduced-guarantee planning now outranks normal execute-next routing when choosing the primary next action.
- the workflow keeps incomplete work and interrupted-agent detection, but no longer lets reduced-guarantee planning disappear behind a default resume-to-execute path.
- reconstruction guidance now restores a minimal routing digest from doctrine and debt inputs when `STATE.md` is missing.

## 5. Current Live Digest Values Applied To `.planning/STATE.md`

### Active doctrine refs

- `.planning/LONG-ARC.md` — preserve the `3.2 -> 3.4` corridor, transport-neutral execution boundary, typed artifacts, and regulation-family-aware execution.
- `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md` — Phase `3.2` is the D1 execution-boundary follow-through.
- `.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md` — regulation execution must stay compatible with the D5 semantic direction.

### Active tech-debt ids

- `VA-TD-01` — `runService.ts` split while landing the backend boundary.
- `VA-TD-02` — canonical regulation semantics compiled into execution snapshots.
- `VA-TD-03` — synchronous `SimulationHarness` replacement with async job/progress/artifact semantics.

### Active carry-forward

- Phase `3.2` planning should clear the D1 execution-boundary corridor before Phases `3.3` and `3.4` consume it.

### Reduced-guarantee status

- `None active. The next valid path is full-context 03.2 discuss/plan work.`

## 6. What Remains Intentionally Deferred After This Wave

- `verify-phase.md`
- `validate-phase.md`
- signal automation or reflection redesign
- audit request/response redesign
- deliberation or decision-anchor schema changes
- a dedicated research-disposition mechanism
- broader subsystem work outside the approved routing surfaces

## 7. Risks And Unresolved Edges After Application

- reduced-guarantee routing still depends on `STATE.md` staying truthful; this wave did not add machine enforcement beyond the visible digest and routing prompts
- current phase directories for `3.2`, `3.3`, and `3.4` still need scaffolding before all automatic routing paths feel fully clean
- `progress` and `resume` remain prompt-driven consumers of the digest, not a structured parser backed by new schema work; that was an intentional narrowing
- the active runtime is still home-scoped; this wave preserved the repo-tracked overlay plus bootstrap model rather than redesigning runtime precedence
