# Future-Aware Harness

This directory is the repo-tracked source of truth for the narrowed Wave 3B planning harness patch.

It does not fork the full GSD Reflect runtime. It tracks only the five reviewed steering-chain surfaces that this wave is allowed to patch:

- `workflows/discuss-phase.md`
- `workflows/research-phase.md`
- `workflows/plan-phase.md`
- `templates/context.md`
- `templates/phase-prompt.md`

## What This Wave Changes

- `CONTEXT.md` production now carries normalized `Future Awareness` plus explicit `Canonical References`.
- `.planning/LONG-ARC.md` is seeded into canonical refs as the default doctrine carrier when it exists.
- research and planning consume canonical refs before spawning downstream agents.
- planning requires context by default, with `--allow-no-context` as the explicit reduced-guarantee bypass.
- `PLAN.md` gains `planning_posture`, structured `future_preservation`, and structured `tech_debt_disposition`.

## What This Wave Intentionally Does Not Change

- `progress.md`
- `resume-project.md`
- `templates/state.md`
- `templates/research.md`
- `verify-phase.md`
- `validate-phase.md`
- Codex `gsdr-*` skill wrappers
- signal automation, reflection behavior, or audit subsystem design

## Source Of Truth And Materialization Model

- Repo source of truth: this directory
- Active runtime target: `$HOME/.codex/get-shit-done-reflect`
- Drift trace path: `$HOME/.codex/get-shit-done-reflect/.f1-modeling-future-aware-harness`

The home runtime is a materialization target, not the canonical source.

## Usage

Install or re-apply the overlay:

```bash
./scripts/setup-future-aware-harness.sh
```

Restore the last backed-up upstream files:

```bash
./scripts/setup-future-aware-harness.sh --restore
```

Verify that the active runtime still matches the repo overlay:

```bash
./scripts/verify-future-aware-harness.sh
```

## Safety Model

- Installation is signature-locked against the reviewed upstream file hashes recorded in `manifest.json`.
- If a runtime file has drifted away from both the reviewed upstream hash and the tracked overlay hash, install fails loudly instead of overwriting it.
- Before patching, the setup script copies the reviewed upstream files into a timestamped backup tree.
- Each install writes `install-receipt.json` plus a timestamped receipt under the active runtime drift-trace directory.
