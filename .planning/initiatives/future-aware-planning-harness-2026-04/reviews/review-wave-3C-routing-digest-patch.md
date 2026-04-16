# Wave 3C Review: Routing Digest Patch

**Date:** 2026-04-16
**Wave:** `3C`
**Status:** Reviewed with blocking follow-up
**Reviewer:** Codex primary orchestrator

---

## Inputs Reviewed

- [spec-wave-3C-apply-routing-digest-patch.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/specs/spec-wave-3C-apply-routing-digest-patch.md)
- [README.md](/home/rookslog/workspace/projects/f1-modeling/tooling/future-aware-harness/README.md)
- [manifest.json](/home/rookslog/workspace/projects/f1-modeling/tooling/future-aware-harness/manifest.json)
- [setup-future-aware-harness.sh](/home/rookslog/workspace/projects/f1-modeling/scripts/setup-future-aware-harness.sh)
- overlay files under [tooling/future-aware-harness/overlay/get-shit-done-reflect](/home/rookslog/workspace/projects/f1-modeling/tooling/future-aware-harness/overlay/get-shit-done-reflect)
- [STATE.md](/home/rookslog/workspace/projects/f1-modeling/.planning/STATE.md)
- [05-routing-digest-patch-application.md](/home/rookslog/workspace/projects/f1-modeling/.planning/initiatives/future-aware-planning-harness-2026-04/synthesis/05-routing-digest-patch-application.md)

---

## Outcome

**One blocking issue found during review.**

Wave `3C` landed the routing overlay and the live digest uplift correctly, but the restore path regressed when the manifest grew from the original `3B` steering targets to the combined `3B + 3C` target set.

The routing-specific parts of the wave were sound:

- `progress` now treats the `Routing Digest` as authoritative when it exists
- `resume` now surfaces the same digest and respects reduced-guarantee routing
- `.planning/STATE.md` is compact and pointer-heavy instead of acting like a second archive
- install and verify both passed on first application

But that was not enough to accept the wave as complete.

---

## Blocking Finding

### Restore contract regression

The Wave `3C` manifest now names all managed targets, including the earlier `3B` steering-chain files and the new routing files.

However, the latest install receipt only recorded a backup tree for the newly installed routing targets:

- `workflows/progress.md`
- `workflows/resume-project.md`
- `templates/state.md`

That meant `./scripts/setup-future-aware-harness.sh --restore` failed when it tried to restore:

- `workflows/discuss-phase.md`
- `workflows/research-phase.md`
- `workflows/plan-phase.md`
- `templates/context.md`
- `templates/phase-prompt.md`

from the latest backup directory even though those backups existed in the earlier `3B` backup tree.

This violated the review focus requirement that the manifest/bootstrap/verify path stay clean after the routing targets were added.

---

## Non-Blocking Notes

- [STATE.md](/home/rookslog/workspace/projects/f1-modeling/.planning/STATE.md) had a stale `PROJECT.md` updated date in the project-reference line.
- The digest remains a visible routing surface, not a machine-enforced schema. That is acceptable for this wave and remains later-stage work.

---

## Decision

**Do not accept `3C` yet.**

Required corrective step:

- repair the bootstrap/restore contract without widening scope
- re-run `restore -> install -> verify`
- then record a recheck before accepting the wave
