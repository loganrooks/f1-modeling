# Future-Aware Harness

This directory is the repo-tracked source of truth for the Stage 3 future-aware planning harness patch.

It does not fork the full GSD Reflect runtime. It tracks only the reviewed surfaces that materially change planning behavior in this repo:

- `workflows/discuss-phase.md`
- `workflows/research-phase.md`
- `workflows/plan-phase.md`
- `workflows/progress.md`
- `workflows/resume-project.md`
- `templates/context.md`
- `templates/phase-prompt.md`
- `templates/state.md`

Wave `3B` patched the steering chain. Wave `3C` extends that same overlay and manifest so routing surfaces consume the compact `STATE.md` digest rather than leaving doctrine/debt/reduced-guarantee posture implicit.

## What The Harness Now Changes

- `CONTEXT.md` production carries normalized `Future Awareness` plus explicit `Canonical References`.
- `.planning/LONG-ARC.md` is seeded into canonical refs as the default doctrine carrier when it exists.
- research and planning consume canonical refs before spawning downstream agents.
- planning requires context by default, with `--allow-no-context` as the explicit reduced-guarantee bypass.
- `PLAN.md` carries `planning_posture`, structured `future_preservation`, and structured `tech_debt_disposition`.
- `STATE.md` is now a compact routing digest that keeps active doctrine refs, active tech-debt ids, carry-forward pointers, and reduced-guarantee status visible without duplicating doctrine.
- `progress` and `resume` surface that digest and route back to `discuss-phase` or a full-context replan when reduced-guarantee planning is still active.

## What This Harness Intentionally Does Not Change

- `templates/research.md`
- `verify-phase.md`
- `validate-phase.md`
- Codex `gsdr-*` skill wrappers
- signal automation, reflection behavior, or audit subsystem design
- deliberation or decision-anchor schema shape

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

Restore the recorded upstream files for all managed targets:

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
- Restore resolves per-target backups across the recorded receipt history, so later waves can extend the manifest without losing earlier upstream backups.
- Each install writes `install-receipt.json` plus a timestamped receipt under the active runtime drift-trace directory.
