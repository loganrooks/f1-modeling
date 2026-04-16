# Wave 3B Application: Core Harness Patch

## 1. Metadata

- Date: 2026-04-16
- Initiative: `future-aware-planning-harness-2026-04`
- Wave: `3B`
- Spec: `.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-3B-apply-core-harness-patch.md`
- Status: applied
- Scope: narrowed repo-local overlay/bootstrap and core steering-chain patch only
- Runtime target: `$HOME/.codex/get-shit-done-reflect`
- Materialization result: succeeded
- First signature-locked install: `2026-04-16T18:40:17Z`
- Latest install receipt: `$HOME/.codex/get-shit-done-reflect/.f1-modeling-future-aware-harness/install-receipt.json`
- Backup dir: `$HOME/.codex/get-shit-done-reflect/.f1-modeling-future-aware-harness/backups/20260416T184017Z`
- Verification result: `./scripts/verify-future-aware-harness.sh` passed after materialization

## 2. Files Created Or Updated

- `tooling/future-aware-harness/README.md`
- `tooling/future-aware-harness/manifest.json`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/discuss-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/research-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/workflows/plan-phase.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/context.md`
- `tooling/future-aware-harness/overlay/get-shit-done-reflect/templates/phase-prompt.md`
- `scripts/setup-future-aware-harness.sh`
- `scripts/verify-future-aware-harness.sh`
- `.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/04-core-harness-patch-application.md`

## 3. Runtime Surfaces Actually Materialized

The repo-local overlay was copied into these active home-runtime files after the setup script verified the reviewed upstream signatures from `manifest.json`:

- `$HOME/.codex/get-shit-done-reflect/workflows/discuss-phase.md`
- `$HOME/.codex/get-shit-done-reflect/workflows/research-phase.md`
- `$HOME/.codex/get-shit-done-reflect/workflows/plan-phase.md`
- `$HOME/.codex/get-shit-done-reflect/templates/context.md`
- `$HOME/.codex/get-shit-done-reflect/templates/phase-prompt.md`

The active runtime now has:

- timestamped backup copies of the reviewed upstream files
- a stable install receipt
- timestamped install receipts for drift tracing and restore support

The repo overlay remains the source of truth. The home runtime is the materialized execution target.

## 4. Steering-Chain Behavior Changed

### `CONTEXT.md` production

- `discuss-phase.md` now treats `Future Awareness` as a first-class steering section alongside `Canonical References`.
- `.planning/LONG-ARC.md` is seeded as the default doctrine ref when it exists and materially constrains the phase.
- the normalized future-aware buckets are:
  - `Protected Seams`
  - `Explicit Non-Decisions`
  - `Current Posture`
  - `Future Shape Notes`
- the existing mode-specific steering sections stayed intact:
  - exploratory mode still uses working model, constraints, guardrails, questions, dependencies
  - discuss mode still uses implementation decisions and open questions
- debt disposition and research-disposition bookkeeping were intentionally not added to `CONTEXT.md`

### `RESEARCH.md` consumption

- `research-phase.md` now resolves `Canonical References` from `CONTEXT.md` before spawning the researcher
- resolved canonical-ref contents are treated as required reading when present
- future-aware constraints are passed into research explicitly
- `RESEARCH.md` still uses `Genuine Gaps` and `Still Open`
- `templates/research.md` and spike-routing semantics were left unchanged

### `PLAN.md` production and checking

- `plan-phase.md` now requires `CONTEXT.md` by default
- `--allow-no-context` is the only explicit reduced-guarantee bypass
- normalized contexts trigger canonical-ref resolution for planner and checker reads
- `.planning/TECH-DEBT.md` is now an explicit planner/checker input
- plans now carry:
  - `planning_posture`
  - structured `future_preservation`
  - structured `tech_debt_disposition`
- checker guidance now fails:
  - dropped or generic future-preservation entries when future-awareness is material
  - omitted relevant debt ids
  - generic debt notes that are not auditable

## 5. Compatibility Behavior For Legacy Contexts And Plans

- `full_context` means normalized `Canonical References` plus `Future Awareness`
- `legacy_context` means a context file exists but predates the normalized structure
- `reduced_guarantee_no_context` is allowed only when `--allow-no-context` is supplied
- missing canonical refs are tolerated in legacy contexts
- missing or unreadable canonical-ref paths are hard errors in normalized full-context runs
- existing historical `CONTEXT.md`, `RESEARCH.md`, and `PLAN.md` artifacts were not retrofitted in place
- new checker expectations apply to plans created or revised through the patched path

## 6. Intentionally Deferred To The Later Routing-Focused Wave

- `progress.md`
- `resume-project.md`
- `templates/state.md`
- routing-digest surfacing of reduced-guarantee status
- routing-digest surfacing of active doctrine refs and active tech-debt ids
- `verify-phase.md` and `validate-phase.md`
- signal automation and reflection behavior
- audit subsystem redesign
- Codex `gsdr-*` skill wrapper changes

## 7. Risks And Unresolved Edges After Application

- debt-id enforcement is strongest once the later routing wave adds an explicit `STATE.md` digest for active tech-debt ids; until then, the planner/checker fall back to context, research, canonical refs, and `.planning/TECH-DEBT.md` inference
- the active runtime is still home-scoped; this wave made it reviewable and reproducible, but it did not create repo-local runtime precedence
- the restore path exists and is backed by the saved upstream copies, but this wave did not exercise a full restore/reinstall cycle against the home runtime
- canonical-ref extraction still relies on the reviewed Markdown bullet convention rather than a new machine schema; that was an intentional first-pass narrowing
