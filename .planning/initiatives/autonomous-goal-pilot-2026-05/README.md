# Autonomous `/goal` Pilot Initiative — 2026-05

## Initiative Class

**Planning-system initiative.** Not a roadmap phase. Same shape as `vision-alignment-2026-04/` and `future-aware-planning-harness-2026-04/`.

This initiative converts the strategic-audit-2026-05-01 finding (doctrine-without-enforcement is the #1 agential uplift gap) into mechanical enforcement via an autonomous Codex `/goal` loop with a cross-runtime Claude Code audit gate.

## Goal

Stand up a scaffold + first pilot for autonomous `/goal` execution that:

1. Runs unattended on dionysus while the human is on apollo or away from keyboard.
2. Has structural cross-runtime audit independence (Codex executes, Claude Code audits).
3. Enforces the 13-15 hard rules per task via a mechanical audit gate (not prose).
4. Pilots on 8 small INT-driven tasks (INT-01..INT-09 minus the 5 lifted out as human bookends).
5. Coexists with the in-flight Future-Aware-Planning-Harness initiative without collision.
6. Leaves the next pilot (likely Phase 3.2) safer to run.

## Status

| Stage | State | Date | Artifact |
|---|---|---|---|
| Plan drafted | Complete | 2026-05-11 | `PLAN.md` (1828 lines) |
| Plan reviewed by panel | Pending | TBD | will land at `audit/2026-XX-XX-pilot-plan-audit-response.md` |
| Scaffold landed | Pending | TBD | `gsd/auto-goal-pilot-scaffold` branch |
| First pilot executed | Pending | TBD | `gsd/auto-goal-pilot-2026-05` branch |
| Pilot debrief | Pending | TBD | `debrief/` |

## Dependencies

### Hard preconditions (human-attested)

- `/gsdr:upgrade-project` 1.18.3 → 1.19.10 (INT-02). See `PLAN.md` §5.2.
- `bash scripts/verify-future-aware-harness.sh` returns exit 0 (FAPH overlay intact).
- GitHub branch protection on `origin/main` enabled with required status checks (see `PLAN.md` UNCERTAINTY-U2).
- Both `codex` and `claude` binaries on dionysus PATH (probed; present per `PLAN.md` §1.3).

### Coexisting initiatives

- `vision-alignment-2026-04/` (complete): doctrine and decision anchors are tripwire-class per `PLAN.md` §4 R1.
- `future-aware-planning-harness-2026-04/` (Stages 1-5 complete; Stage 6 = Phase 3.2 proving ground): autonomous loop is read-only against `~/.codex/get-shit-done-reflect/` per `PLAN.md` §4 R8.

## Files

```
README.md                  — this file
PLAN.md                    — the design document (1828 lines)
audit/                     — formal-audit requests/responses for the initiative itself
  └── README.md            — audit naming convention reminder
application/               — ledger of repo changes the initiative produces
  └── APPLICATION-LEDGER.md — append-only log; populated as the pilot lands changes
synthesis/                 — post-pilot synthesis artifacts (created during/after pilot)
debrief/                   — post-pilot debrief (created at level-B completion)
```

## Routing

- For design rationale, doctrine references, hard rules, audit-gate mechanism, scaffold layout: read `PLAN.md`.
- For the formal-audit preflight requirements (per `.planning/audits/README.md`): see `PLAN.md` §1.5 (audit input declared) + §14 (panel-addressed responses).
- For panel review: this is the artifact. The plan file at `/home/rookslog/.claude/plans/prompt-design-the-hazy-cocoa.md` is the plan-mode original; this PLAN.md is the canonical repo copy.

## Out of scope

See `PLAN.md` §11. Notably: Phase 3.3 substrate work (`AccessibleChartContract`, `AnchorRegistry`); cloud compute; multi-regulation expansion; future RL; calibration against telemetry imports; iOS/mobile; ESLint integration (deferred to INT-13 Wave 2); axe-core a11y (deferred to INT-15, Phase 3.3 entry).
