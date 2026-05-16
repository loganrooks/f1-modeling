---
document: AUTONOMOUS-GOAL-INIT-PLAN
status: archived
archived_date: 2026-05-15
archived_reason: |
  Structured on Codex-executes / Claude-audits architecture and a hard precondition
  on INT-02 (/gsdr:upgrade-project). The project pivoted to Claude-primary on
  2026-05-15 and the GSDR upgrade command no longer exists locally (runtime is now
  mainline GSD-1 v1.42.2). See README.md ARCHIVED banner and .planning/STATE.md.
  Retained on disk as historical reference; do not execute against this plan as-is.
target_runtime: codex (primary executor), claude-code (primary auditor)
execution_host: dionysus (linux ubuntu 24.04, xeon w-2125, gtx 1080 ti, tailscale 100.93.212.44)
client_host: apollo (macbook air over tailscale; ssh-tunnel fallback)
authored: 2026-05-11
authored_by: claude-opus-4-7 (Claude Code 2.1.139, max effort, plan mode)
reviewed_by: [pending: senior-swe panel, senior-ai-systems-eng panel, f1-engineer panel]
audit_input: .planning/audits/strategic-audit-2026-05-01/AUDIT.md
audit_input_sha256: 6f9cf4bc6fd423a803bdd7e2ef416b439df8ad4c9e8f3f17abdc22c9d5e135ee
interventions_input: .planning/audits/strategic-audit-2026-05-01/INTERVENTIONS.md
interventions_input_sha256: 0aa3aae11eede7d731a55a44e8663d85c4a128926feeb3418a09e612bd5f310d
sibling_reference: VIGIL pattern (lives on apollo; embedded in originating prompt)
final_destination_recommendation: .planning/initiatives/autonomous-goal-pilot-2026-05/PLAN.md
---

# Autonomous `/goal` Initialization Plan — F1 Modeling Lab

## §1 Context

### 1.1 What this document is

This is a **planning document** that specifies the scaffold, hard rules, audit gate, observability, and first-pilot scope for autonomous `/goal` execution on the F1 Modeling Lab. It is designed so that a Sonnet-class executor agent, working from this file alone, can produce the scaffold in one branch and the staging artifacts in another, ending with a single goal-prompt the user pastes once. **It is not the autonomous run itself.** It is the contract under which that run will happen.

The work surface is `/home/rookslog/workspace/projects/f1-modeling/` — a TypeScript monorepo (npm workspaces) building a local-first interactive F1 modeling lab. Runtime planning posture is Codex CLI primary (`runtime.platform: codex` in `.planning/config.json:24`), with Claude Code present as a secondary runtime on the same dev server.

### 1.2 Recommended document location and shape

This plan recommends final placement at `.planning/initiatives/autonomous-goal-pilot-2026-05/PLAN.md`, treating the work as a **planning-system initiative** of the same shape as the in-flight `future-aware-planning-harness-2026-04` — not a roadmap phase.

Rationale, defended explicitly because the panel will check:

- The work crosses planning, governance, runtime, and CI surfaces simultaneously. `.planning/ARTIFACT-GOVERNANCE.md:18` reserves "Initiatives, debriefs, and ledgers" for cross-cutting work that "route accepted consequences into concrete destinations." This fits exactly.
- The repo already has a documented initiative class for exactly this shape: `LONG-ARC.md` and `AGENTS.md` both refer to the VAI initiative as the precedent. Following the precedent reduces structural surprise for any future reader.
- The Future-Aware-Planning-Harness initiative explicitly named its Stage 6 "first proving-ground application" target as Phase 3.2 (`.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md:295-308`). Our pilot is *not* Phase 3.2 (see §5), but it lives adjacent to that initiative and must coordinate. Initiative-class shape gives us the ledger pattern (`APPLICATION-LEDGER.md`, `audit/`, `synthesis/`) to coordinate without collision.

### 1.3 Dionysus environment — probe results (verbatim)

The probe was run at session start. Anchor strings in the panel's verbatim search:

| Probe | Result | Source |
|---|---|---|
| `which codex; codex --version` | `/home/rookslog/.npm-global/bin/codex` → `codex-cli 0.129.0` | bash |
| `which claude; claude --version` | `/home/rookslog/.local/bin/claude` → `2.1.139 (Claude Code)` | bash |
| `which gh; gh --version` | `/usr/bin/gh` → `gh version 2.45.0` | bash |
| `node --version; npm --version` | `v22.22.1`, `npm 10.9.4` | bash |
| `ls ~/.codex/get-shit-done-reflect/` | Present; VERSION file, `workflows/`, `templates/`, `references/` | bash |
| `ls ~/.claude/get-shit-done-reflect/` | Present; CHANGELOG.md + same structure (dual GSDR install) | bash |
| `~/.codex/config.toml [features]` | `goals = true`, `memories = true`, `prevent_idle_sleep = true`, `use_legacy_landlock = true` | toml |
| `[projects."/home/rookslog/workspace/projects/f1-modeling"]` | `trust_level = "trusted"` (already set) | toml |
| `codex_hooks` flag | **NOT set** in `~/.codex/config.toml` (capability-matrix says hooks require this; not on by default) | toml + capability-matrix.md:81 |
| `git remote -v` | `git@github.com:loganrooks/f1-modeling.git` (fetch + push) | bash |
| `git branch -a` | `main` (current), `feat/nlp-log-parser`, 7 × `worktree-agent-*` (the INT-05 stale set), `remotes/origin/main` | bash |
| `.github/workflows/` | **Does not exist** (audit confirmed) | bash |
| `.husky/` | **Does not exist** | bash |
| `.codex/` in repo | **Does not exist** | bash |
| `.claude/` in repo | Exists; only contains `worktrees/` (the 7 stale ones) | bash |
| `node_modules` at root | Exists | bash |
| `.planning/` structure | All canonical doctrine files present | bash |
| `.planning/measurement/` | Untracked (per `git status`) | git |
| AUDIT.md SHA | `6f9cf4bc6fd423a803bdd7e2ef416b439df8ad4c9e8f3f17abdc22c9d5e135ee` | sha256sum |
| INTERVENTIONS.md SHA | `0aa3aae11eede7d731a55a44e8663d85c4a128926feeb3418a09e612bd5f310d` | sha256sum |

Three consequences for this plan:

1. **Cross-model audit can run on dionysus.** Both `codex` and `claude` binaries are present. No SSH back to apollo is required for the audit gate.
2. **The codex `/goal` feature is enabled** (`goals = true` in `~/.codex/config.toml`) and the project is already trusted (`trust_level = "trusted"`). The plan does not need a `staging/apply.sh` to add a project trust block; that step is already done.
3. **Codex hooks are *not* available in this install.** `codex_hooks` is not set; per `~/.codex/get-shit-done-reflect/references/capability-matrix.md:81`, "GSD hook installation to Codex is deferred to Phase 60 — for now, capability detection recognizes Codex hooks but does not install them." Therefore the autonomous loop's observability path **cannot** depend on Codex hooks; it must rely on (a) explicit log writes from inside the goal-prompt and (b) `git log` / file SHAs as evidence of what happened.

### 1.4 The work surface this plan augments — not replaces

Three layers of doctrine are already in place. This plan **augments and enforces** them; it does not write doctrine. Specifically:

- `.planning/VISION.md` (broad identity), `.planning/LONG-ARC.md` (durable doctrine), operational canon (`PROJECT.md`, `ROADMAP.md`, `TECH-DEBT.md`, `STATE.md`).
- The Vision Alignment Initiative's five decision anchors (D1, D2, D3, D5, D4) under `.planning/initiatives/vision-alignment-2026-04/deliberations/`. Tripwire-class.
- Eleven `VA-TD-*` tech-debt entries with explicit rewrite triggers. Three are Phase-3.2 active (`-01`, `-02`, `-03`); two are Phase-3.3 planning gates (`-09 AccessibleChartContract`, `-10 AnchorRegistry`); one is "active process failure" (`-08` benchmark harness).

### 1.5 The audit input

`.planning/audits/strategic-audit-2026-05-01/AUDIT.md` (35 KB, committed 2026-05-11 as `c4d8e25`) is the most recent and most load-bearing input. Its companion `INTERVENTIONS.md` enumerates 47 numbered interventions (INT-01..INT-47) grouped into eight categories with a Section I two-week sequencing plan. The audit identifies the **doctrine-vs-enforcement gap as the #1 agential uplift opportunity**. Every guardrail in `CLAUDE.md` (honesty, browser-safe boundary, legacy renderer freeze, fidelity labeling, accessibility-architectural, thin-client baseline, performance budget, vision-alignment checkpoint) is currently prose-only. There is no CI, no pre-commit hooks, no `.claude/settings.json`, no project-local subagents, no ESLint, no benchmark harness.

This plan treats the audit as the canonical input. Any decision in this document that the audit speaks to is checked against the audit's text. Where this plan diverges (e.g., we wave INT-02 *out* of the autonomous pilot rather than including it as the audit's Day-2 step), the divergence is named explicitly and the rationale recorded.

### 1.6 The in-flight initiative — the future-aware-planning-harness initiative

`.planning/initiatives/future-aware-planning-harness-2026-04/` is in active development. Its `PLAN.md` declares Stage 6 (the first proving-ground application) target as Phase 3.2. The harness owns 8 SHA-locked overlay files at `~/.codex/get-shit-done-reflect/` (workflows + templates) via `tooling/future-aware-harness/manifest.json` and `scripts/setup-future-aware-harness.sh`. A typed CLI reimplementation lives at `packages/future-aware-harness-cli/` (`fa-harness` binary, version 0.1.0).

**Collision risk:** any home-directory mutation by this plan's scaffold could divergently overwrite FAPH-managed state. **Mitigation:** the autonomous loop is read-only against `~/.codex/`, runs `verify-future-aware-harness.sh` as a precondition check at bootstrap, and treats any drift as a HARD STOP. INT-17 (reconcile dual implementation) is logged as future-work but not blocking.

### 1.7 Sibling reference — the VIGIL pattern

A sibling planning effort (VIGIL, a separate macOS Swift/AppKit project) has produced a pattern this plan adapts. The originating prompt embeds the VIGIL summary inline; this plan does not need to fetch any apollo-side artifact. Where the VIGIL pattern fits, it is named explicitly. Where it does not (no remote, Swift/SPM, no Codex/goal feature, no dual runtime, thin doctrine), the deviation is named in §3 and §6.

---

## §2 Outcome State

The plan is structured in three nested completion levels. Each has a verifiable end condition.

### 2.1 Level A — Scaffold complete (after the executor agent runs this plan)

A reviewer can verify level A by running these commands and observing the listed result:

| # | Verification | Expected Result |
|---|---|---|
| A.1 | `git log --oneline -1 origin/main..HEAD` on `gsd/auto-goal-pilot-scaffold` branch | Single commit message `chore(auto-goal): scaffold initial autonomous loop` (or sequence of conventional commits) |
| A.2 | `ls .planning/initiatives/autonomous-goal-pilot-2026-05/` | At minimum: `PLAN.md`, `README.md`, `audit/`, `synthesis/`, `application/` |
| A.3 | `ls .planning/auto-execution/` | `STATE.md`, `GUARDRAILS.md`, `EXECUTION-MODEL.md`, `PLAN-snapshot.md`, `future-work.md`, `agent-events.jsonl`, `phases/`, `checkpoints/`, `escalations/`, `sessions/`, `audits/`, `staging/` |
| A.4 | `cat .codex/config.toml` | Project-level Codex config with `sandbox_mode = "workspace-write"`, `network_access = false`, `approval_policy = "on-request"` |
| A.5 | `cat .claude/settings.json` | Permissions allowlist + denylist; hooks block per INT-06 |
| A.6 | `ls .github/workflows/` | `quality-gate.yml` (typecheck + test + build at minimum) |
| A.7 | `ls .husky/pre-commit` | Exists; runs `npm run typecheck` |
| A.8 | `cat AGENTS.md \| grep -A3 "## Hard Rules"` | Hard-rule block 1-13 present |
| A.9 | `grep -rn "RED-ANCHOR\|RESOLVED-ANCHOR" packages/ apps/ \| wc -l` | 0 (no anchors stranded yet) |
| A.10 | `bash scripts/auto-goal-bootstrap-selfcheck.sh` | Exit 0 + report listing all preconditions green (incl. `verify-future-aware-harness.sh`) |
| A.11 | `cat .planning/auto-execution/staging/GOAL-PROMPT.md \| head -5` | Frontmatter naming the pilot scope = INT-01..09 (waved per §5.2) |
| A.12 | `ls .planning/auto-execution/staging/` | `GOAL-PROMPT.md`, `apply.sh` (idempotent home-dir helpers), `apply-restore.sh` (the inverse) — but apply.sh body is **empty / no-op** for the pilot per §6.7; this directory exists for future pilots. |

### 2.2 Level B — First pilot complete (after the human pastes the goal prompt and the loop runs)

Verifiable by:

| # | Verification | Expected Result |
|---|---|---|
| B.1 | `git log --oneline gsd/auto-goal-pilot-2026-05` | 8 conventional commits, one per pilot task (INT-01, INT-05, INT-06, INT-18, INT-19, INT-24, INT-20, INT-09 — order per §5.3) |
| B.2 | `ls .planning/auto-execution/audits/AUDIT-task-*.md` | 8 audit responses, each with frontmatter `status: pass` |
| B.3 | `ls .planning/auto-execution/escalations/` | 0 unresolved escalations (any present must be paired with a `RESOLVED:` marker) |
| B.4 | `gh pr view --json statusCheckRollup -q .statusCheckRollup` | All required checks (typecheck, test, build) green on the open PR |
| B.5 | `cat .planning/auto-execution/sessions/SESSION-SUMMARY-*.md \| grep "phase: complete"` | At least one summary marks pilot complete |
| B.6 | `cat .planning/auto-execution/STATE.md \| yq .last_completed_task` | `INT-09` (last pilot task) |
| B.7 | `bash scripts/verify-future-aware-harness.sh` | Exit 0 (FAPH overlay still intact) |
| B.8 | Human-side: open `http://100.93.212.44:5173` on apollo over Tailscale | UI renders without white-screen (INT-20 error boundary works); `/api/health` returns the actual `HOST/PORT` (INT-24 honesty fix works) |

### 2.3 Level C — Ongoing autonomous discipline established

Long-running condition, not a step. Level C is true when:

- The next pilot (Phase 3.2 or another bounded scope) is launched using this same scaffold without re-design.
- The audit response files are referenced by `/gsdr:reflect` runs as evidence; lessons are distilled.
- The CI quality gate has caught at least one regression that would have shipped under the prior prose-only regime.
- The `RED-ANCHOR` convention has been used in at least one phase's tests and survived a code review.
- Branch protection on `main` has refused at least one merge whose status checks were red.

Level C is not enforced by this plan. It is named here so the panel can ask "what does success look like in three months?" and have an answer that is not just "the scaffold exists."

### 2.4 Outcomes this plan does not promise

- It does not promise that the eight INT items are *correctly* fixed by the autonomous loop. The audit gate is the check; the gate may pass an incorrect fix. Human spot-check at task 3 and at end-of-pilot is the backstop.
- It does not promise the next pilot (Phase 3.2) will run without further design. The proving-ground purpose is to surface failure modes that this plan cannot foresee.
- It does not promise GSDR upgrade 1.18.3 → 1.19.10 (INT-02). That is a *human precondition* (see §5.2). The plan's audit gate uses the file pattern, not `/gsdr:audit`, until the upgrade runs.

---

## §3 Architecture: Human Gates vs Autonomous Steps

The autonomous run is bracketed by human gates. The bracket is essential: this plan does not let the loop start until a human has reviewed the scaffold, and does not let the loop merge until a human has approved the PR. In between, the loop runs unattended on dionysus while the human can be on apollo or away from the keyboard entirely.

### 3.1 The full loop, gate by gate

```
              [HUMAN GATE 0 — apollo or dionysus; review of THIS plan]
                              ↓
              [executor agent runs this plan; produces scaffold + staging on dionysus]
                              ↓
              [HUMAN GATE 1 — apollo; review of scaffold branch + staging]
                              ↓
              [HUMAN GATE 2 — apollo; review of pilot scope + paste GOAL-PROMPT into codex TUI on dionysus]
                              ↓
                              ┌─────────── AUTONOMOUS LOOP ───────────┐
                              ↓                                       │
              [bootstrap self-check; verify-future-aware-harness.sh]  │
                              ↓                                       │
              [task 1 = INT-01: commit pending state]                 │
                              ↓                                       │
              [audit gate via claude -p; read frontmatter]            │
                              ↓                                       │
              [task 2 = INT-05: prune worktrees]                      │
                              ↓                                       │
              [audit gate]                                            │
                              ↓                                       │
              [task 3 = INT-06: .claude/settings.json]                │
                              ↓                                       │
              [audit gate + HUMAN SPOT-CHECK CHECKPOINT (M=3)]        │
                              ↓                                       │
              [task 4..8 = INT-18/19/24/20/09]                        │
                              ↓                                       │
              [audit after each; ESCALATE on fail]                    │
                              ↓                                       │
              [end-of-pilot SESSION-SUMMARY-pilot-complete.md]        │
                              ↓                                       │
              [autonomous loop pushes branch; opens PR via gh]        │
                              └────────────────────────────────────────┘
                              ↓
              [HUMAN GATE 3 — apollo; review PR + CI; merge]
                              ↓
              [HUMAN POST-CONDITIONS — apollo or dionysus]
              [INT-02 GSDR upgrade interactively, INT-08 memory updates,
               INT-03/04/07 reflect/index/health-check]
```

### 3.2 Human gate locations and what each gate does

| Gate | Location | Action | Halt-here-on-error policy |
|---|---|---|---|
| 0 | apollo (VS Code remote SSH) or dionysus (terminal) | Read this plan; ExitPlanMode if approved; otherwise revise | Plan is the only document; halt = revise this plan |
| 1 | apollo | `git fetch && git checkout gsd/auto-goal-pilot-scaffold && git diff main...HEAD`; review every file the executor created | Halt = the executor agent missed something; manually fix or re-run with addendum |
| 2 | apollo | Open `.planning/auto-execution/staging/GOAL-PROMPT.md`; copy; on dionysus paste into a fresh `codex` TUI session at `cd /home/rookslog/workspace/projects/f1-modeling/` | Halt = goal prompt is wrong; revise GOAL-PROMPT.md and re-paste |
| Spot-check (in-loop, at task 3) | apollo or dionysus | Loop pauses; writes `checkpoints/CHECKPOINT-task-3-{ts}.md`; waits for `git push` of an `APPROVED:` line in that file | Halt = either approve, edit and approve, or `ABORT:` to stop the loop |
| 3 | apollo | `gh pr view <num>`; review CI; `gh pr merge --squash` | Halt = either request changes via `gh pr review --request-changes` (loop sees and pauses) or close the PR |

### 3.3 Where the apollo↔dionysus split bites

The autonomous loop runs entirely on dionysus. The browser-side smoke step in B.8 (open the UI at `http://100.93.212.44:5173`) is a **human action on apollo**, not an autonomous step. The plan's hard rules in §4 forbid the loop from "verifying" UI behavior on a thin client it cannot reach. INT-20 (error boundary) gets a non-UI test in B.4 (the test suite); the UI smoke is the human's responsibility at gate 3.

This is a deviation from the VIGIL pattern, which has no comparable client-side gap. Naming it explicitly because the panel will ask.

### 3.4 Where the loop is allowed to take destructive actions

| Action | Allowed in loop? | Rationale |
|---|---|---|
| `git commit` | Yes | Atomic per task; only after audit pass |
| `git push origin <feature-branch>` | Yes | Only the feature branch; never `main` |
| `git push origin main` | **No** | Hard rule R12 |
| `gh pr create` | Yes (single PR per pilot) | Branch protection forbids merge without checks |
| `gh pr merge` | **No** | Human gate 3; hard rule R13 |
| `git worktree remove .claude/worktrees/<name>` | Yes (only as INT-05 task) | Audit and human spot-check both verify |
| `git push --force` | **No** | Hard rule R14 |
| Edit `~/.codex/`, `~/.claude/`, `~/.gsd/` | **No** | Hard rule R8 (FAPH-collision protection) |
| Run `~/.codex/get-shit-done-reflect/...` overlay tools | Read-only | Only `verify-future-aware-harness.sh`; no setup, no restore |
| Modify tripwire files (§4 list) | **No (HARD STOP)** | Hard rule R1 |
| `rm -rf` anything | **No** | Hard rule R15 |
| `npm install` (modifying lockfile) | **No** | Hard rule R10 (network sandbox) |
| Modify `.planning/config.json` | Conditional — only as a known task with audit cite | Hard rule R6 |
| Modify `.planning/STATE.md` (the GSDR routing digest) | Yes — only the auto-execution-state pointer block per §6.4 | Hard rule R7 |

### 3.5 Branching strategy — moving from `none` to `gsd/auto-goal-{date}-{slug}`

`.planning/config.json:6` currently sets `branching_strategy: "none"`. The plan recommends moving to per-`/goal`-run feature branches for autonomous work specifically. Concrete branch naming:

- Scaffold (executor of this plan, level A): `gsd/auto-goal-pilot-scaffold` (single-shot)
- First pilot run: `gsd/auto-goal-pilot-2026-05` (single PR target)
- Later pilots: `gsd/auto-goal-{slug}-{YYYY-MM}` (one branch, one PR per `/goal` invocation)

This is **not** the same as the existing `gsd/phase-{phase}-{slug}` template (`.planning/config.json:7`). The phase-branch template is reserved for human-led phase work. The autonomous-loop branch carries a distinct prefix so a human reading `git branch -a` can tell which is which at a glance.

**Argument for the change** (the panel will challenge): Per `CLAUDE.md` Branch Hygiene, "trunk-based for solo research" is the right default for human work. Per the audit's #1 finding, the autonomous loop *needs* mechanical enforcement. GitHub branch protection on `main` (required status checks) is the strongest mechanical gate the repo can deploy without changing tooling. A per-loop branch makes that gate an actual filter rather than an after-the-fact check.

**Alternative considered**: trunk-based per-task autonomous commits with no feature branch. Rejected because (a) GitHub branch protection cannot enforce required checks on direct-to-main commits without further setup; (b) revert-on-audit-fail is harder mid-trunk than via branch abandon; (c) the audit's #1 finding is doctrine-without-enforcement — trunk-based here perpetuates that.

**Cost flagged for the next pilot**: Phase 3.2 has 5 plans × 2-3 tasks ≈ 13 commits per `/goal` run. A 13-commit PR is reviewable but unwieldy. The plan's §13 uncertainty list flags this; refinement of the per-`/goal` contract may be needed before the second pilot. For the first pilot (8 small tasks), one branch / one PR is fine.

---

## §4 Hard Rules — AGENTS.md additions

The autonomous loop reads `AGENTS.md` at session start (per the existing AGENTS.md routing). This plan adds a `## Hard Rules` block to the *root* `AGENTS.md`, not to `.planning/AGENTS.md` (which governs planning-lane work and should remain narrow).

The block is **additive**. It does not replace anything in either AGENTS.md. The block is bracketed with explicit anchors so the executor of this plan can place it deterministically:

```markdown
<!-- HARD-RULES:BEGIN (autonomous-goal-pilot-2026-05) -->
## Hard Rules — Autonomous Loop

Read these once at session start; re-read at every audit gate. Each rule applies to any session
running under codex `/goal` or any other autonomous loop. Manual sessions are bound by the same
rules but can be granted explicit human override per call.

…rules R1..R15 below…
<!-- HARD-RULES:END (autonomous-goal-pilot-2026-05) -->
```

**Why this exact placement**: `AGENTS.md` is the narrow runtime entrypoint that the audit and existing GSDR install both treat as the front door. `.planning/AGENTS.md` governs planning-lane writers (i.e. what shape a `CONTEXT.md` carries); it is the wrong file for runtime restrictions. The HARD-RULES block sits next to the existing GSD:BEGIN…GSD:END block to follow the established reservation pattern.

The fifteen rules below are the minimum set the panel will tolerate. Several rules merge concerns the audit names separately, intentionally — the audit lists 47 interventions; we do not need 47 hard rules. We need the small number of rules that, if violated, cause irreversible damage.

### R1. Tripwire files — modification is HARD STOP

**What:** The autonomous loop must not modify any of the tripwire files listed below. On detection of a diff that touches one, the loop halts and writes an `escalations/ESCALATION-tripwire-{ts}.md`.

**Why:** These files carry the project's load-bearing doctrine. Their content was the product of the Vision Alignment Initiative (D1-D5) and the Future-Aware-Planning-Harness initiative; modification by an autonomous agent is a category error. (`.planning/ARTIFACT-GOVERNANCE.md:18`, `.planning/AGENTS.md:18-25`.)

**How to apply:** Bootstrap self-check runs `git diff --name-only main..HEAD -- <tripwires>`. If any path matches, halt before proceeding. The audit gate's `claude -p` invocation also greps `git diff --name-only HEAD~..HEAD -- <tripwires>` and writes `status: fail` if any match.

Tripwires:

```
.planning/VISION.md
.planning/LONG-ARC.md
.planning/ARTIFACT-GOVERNANCE.md
.planning/PROJECT.md
.planning/REQUIREMENTS.md
.planning/TECH-DEBT.md
.planning/AGENTS.md
.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md
.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md
.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md
.planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md
.planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md
.planning/initiatives/vision-alignment-2026-04/SUMMARY.md
.planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md
.planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md
tooling/future-aware-harness/manifest.json
tooling/future-aware-harness/overlay/**
```

Note: `.planning/ROADMAP.md`, `.planning/STATE.md`, and the in-flight phase directories are **not** tripwires — they are operationally mutable. The pilot does not modify them, but the rule does not block normal phase work.

### R2. F1 model fidelity honesty — never imply unsupported precision

**What:** Any code, comment, schema, panel, lesson, or artifact change that touches a fidelity-bearing surface (run records, simulation output, regulation compilation, visualizations) must preserve or strengthen — never weaken — the visible fidelity labeling.

**Why:** `CLAUDE.md` ("Honesty constraints", "Visible fidelity labeling"); `.planning/LONG-ARC.md:34` ("Preserve honesty labeling…as architectural obligations, not optional polish"); audit `D.2` ("LapModelRunView and StintModelRunView hard-cast every model assumption to `kind: \"engineering-inference\", confidence: \"medium\"` even though the data carries actual provenance source-type"); `VA-TD-11` (visible fidelity / validation / comparability marker surfacing). The single F1-engineer-on-the-panel concern: an autonomous agent silently smoothing a placeholder into something that *looks* engineer-grade is the failure mode that disqualifies the platform.

**How to apply:** The audit-gate prompt for any task that touches `apps/web/src/features/runs/`, `apps/web/src/features/scenario/`, `packages/visuals/`, `packages/sim-core/src/`, or `packages/domain/src/presets/` includes the literal sentence "Identify any change that newly implies fidelity, validation, or comparability that the underlying artifact does not actually carry." Audit returns `status: fail` on positive find. The first pilot scope (§5) deliberately avoids these directories.

### R3. Regulation-family-aware execution — no 2026 hardcoding in runtime path

**What:** No hardcoded 2026-specific constants may enter `packages/sim-core/`, `packages/domain/src/execution/` (when it lands in 3.2), or `apps/local-api/src/services/` runtime paths. Regulation parameters must enter through the `ExecutionRegulationSnapshot` pipeline.

**Why:** `LONG-ARC.md:30` ("Preserve regulation-family-aware execution and semantics; do not let 2026-specific assumptions harden into the long-lived runtime path"); D5 decision anchor; `VA-TD-02`. The platform's vision (`VISION.md:48-56`) explicitly extends to 2022-2025 ground-effect, V8 era, and future regulations; the v1 codebase already shows hardcoded 2026 electrical constants per audit `D.2` that Phase 3.2 plan 05 is designed to remove.

**How to apply:** The audit-gate prompt for any task that adds a numeric constant from a regulation domain (mass, energy budget, deployment cap, aero-mode coefficient) checks that the constant came from a preset or from `ExecutionRegulationSnapshot`. The pilot scope does not touch these files; the rule pre-empts a *future* pilot's drift.

### R4. Layered modeling stack ordering

**What:** Plant + sensor model → observer → model-based control → later RL. Do not introduce a higher-stack-layer feature on top of an uncalibrated lower layer. Specifically: no observer (Phase 4.1) work without the plant interface (Phase 5 prerequisite per `audit-response-2026-04-07.md` decision 11); no MPC work without the calibrated baseline (Phase 7); no RL work without MPC + calibration.

**Why:** `LONG-ARC.md:33` ("Preserve the explicit layered stack of plant and sensor model -> observer -> model-based control -> later RL"); `audit-response-2026-04-07.md:31`; `PROJECT.md:91` (key decision: "explicit layered stack").

**How to apply:** Audit-gate prompt for any sim-core or apps/web change includes "Identify any change that introduces a stack layer that does not have its lower-layer prerequisites complete." The pilot does not touch sim-core; the rule pre-empts a *future* pilot's drift.

### R5. Legacy renderer freeze — no new features in hand-rolled SVG

**What:** No new features (charts, panels, interactive elements, tooltips beyond bug fixes) may be added to `packages/visuals/src/traces/`, `packages/visuals/src/inspectors/`, or hand-rolled SVG components in `apps/web/src/features/`. Bug fixes are allowed.

**Why:** `CLAUDE.md` ("Legacy renderer freeze"); `VA-TD-05` ("Freeze immediately for bug fixes only; rewrite or migrate when a panel needs linked interaction, shared tokens, or substrate-native features"). The 932-line `RunSummaryPanel.tsx` (`apps/web/src/features/runs/`) is the visible example.

**How to apply:** Audit-gate prompt counts new `<svg>`, `<polyline>`, `<line>`, `<rect>`, `<g>` JSX elements added to those directories. Non-zero count requires a citation: either "VA-TD-05 explicitly waived for bug fix on row N" or audit returns `status: fail`. Pilot task INT-20 (error boundary) lands in `apps/web/src/main.tsx` — outside the freeze zone.

### R6. `.planning/config.json` — only by explicit cited task

**What:** The autonomous loop must not modify `.planning/config.json` unless the active task description names it explicitly with an audit-cited rationale.

**Why:** `.planning/config.json` carries runtime overrides (model profile, GSDR version, agent overrides) that the audit and the FAPH initiative both treat as load-bearing. `INT-01` is the *only* pilot task that touches it (committing the existing modification).

**How to apply:** Audit-gate checks `git diff --name-only HEAD~..HEAD .planning/config.json`. Non-empty diff requires the task description to contain `config.json`. Else `status: fail`.

### R7. `.planning/STATE.md` — only the auto-execution pointer block

**What:** The autonomous loop may add or update a single block in `.planning/STATE.md` named `<!-- AUTO-LOOP:BEGIN -->` … `<!-- AUTO-LOOP:END -->` that points at `.planning/auto-execution/STATE.md`. No other modification.

**Why:** `.planning/STATE.md` is the GSDR routing digest, owned by the FAPH `templates/state.md` overlay (manifest hash `f4b028e2…`). Drift in this file would cause `verify-future-aware-harness.sh` to fail. The pointer block is delimited so it can be added without changing the FAPH-managed body.

**How to apply:** Audit-gate parses `.planning/STATE.md`, asserts everything outside the AUTO-LOOP markers is byte-equal to the prior commit. The bootstrap self-check runs `verify-future-aware-harness.sh` on the post-modification state.

### R8. Home-directory surfaces — read-only

**What:** The autonomous loop must not write to `~/.codex/`, `~/.claude/`, `~/.gsd/`, or any path outside the repo working tree. Reading is allowed (e.g., reading the capability matrix at `~/.codex/get-shit-done-reflect/references/capability-matrix.md`).

**Why:** Three reasons stack:
1. `~/.codex/get-shit-done-reflect/` is FAPH-managed (manifest.json `runtime_root_default`). Direct writes corrupt the SHA-locked overlay.
2. `~/.claude/settings.json` is the user's global settings and outside the repo's enforcement perimeter; per-project hooks belong in `.claude/settings.json` (in-repo).
3. The `[projects."/home/rookslog/workspace/projects/f1-modeling"] trust_level = "trusted"` block in `~/.codex/config.toml` is already set; nothing in the pilot needs to add it.

**How to apply:** Audit-gate runs `git diff --name-only HEAD~..HEAD` and asserts no path begins with `/home/rookslog/.` (or any home equivalent). The codex sandbox `network_access = false` (R10) and `sandbox_mode = "workspace-write"` further constrain by runtime; this rule provides the doctrinal layer that explains the runtime constraint.

### R9. Audit response files — write only by `claude -p`

**What:** The executor (codex) must not write to `.planning/auto-execution/audits/AUDIT-*.md`. Only the audit subprocess (`claude -p "/gsdr:audit ..."` or, pre-INT-02, the file-pattern equivalent) may create or edit these files.

**Why:** Cross-runtime audit independence depends on the auditor's output being uncontaminated by the executor. Codex CLI lacks `tool_permissions` (capability matrix line 32: "All tools available to all agents"); without this rule, nothing prevents the executor from writing a `status: pass` response itself.

**How to apply:** After every audit invocation, the loop runs `git log --since="<task-start-ts>" --pretty=format:"%an %s" -- .planning/auto-execution/audits/AUDIT-task-N-*.md` and asserts the only commits to that path are by the auditor identity (configured commit author for `claude -p` invocations is `claude-code-auditor <auditor@dionysus.local>`). Mismatch = HARD STOP.

### R10. Network access — disabled in sandbox

**What:** The autonomous loop runs with `network_access = false` in `.codex/config.toml` (project-level). No network operations during execution. This explicitly forbids `npm install`, `npm update`, `git fetch`, `git push` to remote, or any HTTP call.

**Why:** Network access is the primary lateral-movement vector. The executor's task list (§5.3) does not require network; INT-09's CI YAML is *content* not *execution*. `git push origin <branch>` happens at the loop's end-of-pilot stage, which is a *separate* invocation outside the autonomous task-loop sandbox.

**How to apply:** `.codex/config.toml` `network_access = false`. Loop's end-of-pilot push happens in a follow-on script that runs *after* the autonomous loop ends, with sandbox temporarily relaxed by the goal-prompt's exit handler.

### R11. No editing or skipping test failures

**What:** The autonomous loop must not modify a test to make it pass without the underlying code change. It must not bypass test failures via `--no-verify`, `--no-gpg-sign`, `it.skip`, `test.skip`, `.todo`, or removing assertions. RED tests (intentional pre-implementation anchors) are recorded in `.planning/auto-execution/red-anchors.txt`; modification of an anchor is allowed only when the loop is the entity that authored it.

**Why:** Audit `D.1` ("Strict TypeScript / `noUncheckedIndexedAccess`" enforced; "Conformance audit 2026-04-07 confirmed 0 `as any`, 0 `@ts-ignore`"). The repo's posture is honest test execution, not "make the suite green." `CLAUDE.md` Quality Gates 1-3 are non-negotiable.

**How to apply:** Audit-gate checks (a) `git diff` for `*.test.ts` modifications; if present, requires the same task to have produced production-code changes that justify the test change; (b) `grep -n "skip\|todo" $(git diff --name-only HEAD~..HEAD --diff-filter=AM | grep test.ts)` returns 0 new occurrences; (c) `grep -n "no-verify\|no-gpg-sign" .git/COMMIT_EDITMSG` returns 0.

### R12. No force push, no main-direct push

**What:** The autonomous loop never runs `git push --force`, `git push --force-with-lease`, or `git push origin main`. The loop pushes only the per-`/goal` feature branch. Branch protection on `origin/main` enforces this from the server side as well.

**Why:** Both are blast-radius failures. Force-push silently rewrites history; direct push to main bypasses the audit gate's PR-level enforcement. `CLAUDE.md` Branch Hygiene encodes the discipline; this rule encodes the mechanical version for the loop.

**How to apply:** Audit-gate's pre-push hook (in the goal-prompt exit handler) refuses `--force*` flags and any push to `origin main`. GitHub branch protection refuses the same on the remote side.

### R13. Audit response is the merge gate; human is the merge actor

**What:** The autonomous loop never runs `gh pr merge`, `gh pr close`, `git merge`, or `git rebase` against main. The PR is opened by the loop; merged by the human at gate 3.

**Why:** The audit gate is structural for individual tasks; the merge is the *cross-task* gate. One bad task masked by a passing audit is a failure mode the panel will name. The human at gate 3 is the only entity that sees the *whole* PR diff plus all 8 audits plus the CI status simultaneously.

**How to apply:** Goal-prompt explicitly forbids these gh/git commands; bootstrap self-check greps the goal-prompt itself to verify the prohibition is present.

### R14. STATE.md atomic-write — no mid-task partial writes

**What:** Updates to `.planning/auto-execution/STATE.md` must be atomic (write-temp-then-rename) and only at task boundaries (start of task; end of task after audit). No partial-state writes mid-task.

**Why:** A torn write to STATE.md is the worst possible failure: the next session resumes from corrupted state. The VIGIL pattern explicitly encodes this discipline.

**How to apply:** The `EXECUTION-MODEL.md` document specifies the atomic-write recipe; the loop's STATE.md updates go through a `.tmp` file + `mv` (POSIX rename is atomic on the same filesystem). The audit gate rejects any STATE.md change made outside a task-boundary moment (it can detect this by comparing `STATE.md.last_updated` with the current task's start/end timestamps).

### R15. No `rm -rf`, no destructive shell

**What:** The autonomous loop never runs `rm -rf`, `rm -r`, `find … -delete`, `git clean -fd`, `git reset --hard`, `git checkout .`, `git restore .`, `git branch -D`, `git worktree remove --force`, or any equivalent.

**Why:** Defense in depth against the most common autonomous-agent failure mode. The pilot's INT-05 (prune worktrees) uses `git worktree remove <path>` (without `--force`); if a worktree resists removal, the loop escalates rather than forcing.

**How to apply:** Goal-prompt forbids these patterns. Pre-commit hook greps shell scripts and commit messages for the patterns and warns. Audit gate checks `agent-events.jsonl` (the per-loop event log) for any of the patterns and returns `status: fail` if found.

### Summary of rules

15 rules. Earlier drafts had 19. The trim rationale: each rule must be a *check the audit gate can mechanically perform*. Rules that resist mechanical check (e.g., "be honest") are pushed into R2 as a structured grep/diff check. Rules that overlap (e.g., "no destructive shell" + "no rm -rf") are merged into R15.

The panel will ask: "Why not 15 rules-per-domain?" Because rules-per-domain is sprawl; the audit's #1 finding is doctrine without enforcement, and a 30-rule sprawl is doctrine sprawl. Each of these 15 rules has a stated mechanical check (audit-gate prompt step, bootstrap probe, pre-commit grep, CI YAML step, or settings.json deny).

---

## §5 The First `/goal` Pilot

### 5.1 Pilot scope decision — INT-01..INT-09 audit-driven, with INT-02/03/04/07/08 lifted out

**Decision**: Pilot = 8 INT items, executed by the autonomous loop in 8 atomic-commit tasks. The audit's Section A "Now" list contains 9 items (INT-01..INT-09); the pilot adopts a subset of 8, lifting INT-02/03/04/07/08 *out* of the autonomous loop and treating them as **human bookends**.

**Pilot tasks (in order)**:
1. `INT-01` — Commit pending planning state (`.planning/config.json` + untracked `03.1-CONTEXT.md`)
2. `INT-05` — Prune 7 stale agent worktrees in `.claude/worktrees/`
3. `INT-06` — Add `.claude/settings.json` with permissions allowlist
4. `INT-18` — Update `AGENTS.md` hooks doctrine to reflect dual-runtime reality
5. `INT-19` — Update `CLAUDE.md` for architecture drift (visuals primitive count, `packages/future-aware-harness-cli`, `scripts/transcript-nlp/`)
6. `INT-24` — Health endpoint honesty fix (`apps/local-api/src/routes/health.ts`)
7. `INT-20` — React error boundary in `apps/web/src/main.tsx`
8. `INT-09` — `.github/workflows/quality-gate.yml` (typecheck + test + build at minimum)

**Lifted out (human bookends)**:
- `INT-02` (`/gsdr:upgrade-project` 1.18.3 → 1.19.10) — **human precondition** before pilot starts. Done interactively per INT-02 mechanism. Reason: the upgrade rewrites the GSDR workflow files the loop's audit gate depends on; running INT-02 *as a pilot task* is self-modifying-runtime-mid-pilot (Plan-agent objection #3).
- `INT-03` (`/gsdr:reflect`), `INT-04` (refresh KB index), `INT-07` (`/gsdr:health-check`) — **human post-conditions** after pilot. Reason: each requires human review of GSDR output (lessons, density, score) before commit, per `INT-03` mechanism note.
- `INT-08` (memory updates) — **human post-condition**. Reason: writes to `~/.claude/projects/.../memory/` which is outside the repo and forbidden by hard rule R8. Loop instead writes a *staging* memory-additions file in `.planning/auto-execution/staging/memory-additions.md` for the human to apply via apollo.

**Why this scope, not Phase 3.2**:

| Dimension | Phase 3.2 | INT-01..09 (pilot) |
|---|---|---|
| Task count | ~13 (5 plans × 2-3 tasks) | 8 |
| Architectural coupling | Very high (5 plans interact at boundaries) | Independent |
| Backward-compat surface | High (historical runs, web consumers, sim-core) | None |
| Revertability per-task | Cross-workspace cascade | Single file or single config block |
| Touches sim-core / domain / runtime path | Yes | No |
| Touches honesty/fidelity/freeze surfaces | Yes (`runService.ts`, `RunSummaryPanel.tsx` adjacency) | No |
| Failure cost | Phase blocked + cross-phase regression risk | One commit reverted |
| Proves: audit gate works | Marginal | Strong |
| Proves: loop respects hard rules | Strong | Strong |
| Proves: cross-runtime independence | Strong | Strong |

The Phase 3.2 plans are *what the project wants next* and are autonomous-ready in principle (each `gsdr-executor` plan can run unattended). They are *not* ready as a first proving ground because there is no smaller scope inside Phase 3.2 — every plan depends on every other plan. INT-01..09 is the natural smallest scope that exercises every load-bearing piece of the autonomous infrastructure (audit gate, rule enforcement, branching, CI, escalation) without touching the project's most fragile surfaces.

**Why the Plan-agent's wave-the-pilot critique is partly absorbed and partly rejected**:
- Absorbed: INT-02 lifted out as human precondition (was the strongest objection).
- Absorbed: INT-03/04/07 lifted out as human post-conditions.
- Rejected: splitting the remaining 8 into multiple pilots. They share no risk surface; running them in one autonomous loop with audit-after-each-task is the proving ground.

**Generality argument** (the originating prompt asks): the scaffold is general enough to run Phase 3.2 next, with two refinements:
1. The per-`/goal` PR will be larger (~13 commits) — flag in §13 uncertainty list.
2. Hard rules R2-R5 (fidelity, regulation, layered stack, freeze) become *active* checks, not pre-emptive. They are designed to fire during Phase 3.2; they are pre-loaded for the pilot so the audit gate exercises them.

### 5.2 Human preconditions

Before the human pastes the goal prompt, the human runs (manually, on dionysus, in the codex TUI):

1. `/gsdr:upgrade-project --interactive` (INT-02). Verify Node ≥22.5.0 first (`node --version` returns `v22.22.1`, fine). Run interactively, not `--auto`, so any new init prompts (DevOps detection, CI presence) are visible. After upgrade, verify `gsd_reflect_version` in `.planning/config.json` updated; verify `runtime.platform=codex` and `agent_overrides` survived. Run `/gsdr:reapply-patches` to restore local patches.
2. `bash scripts/verify-future-aware-harness.sh` — verifies the FAPH overlay still matches its SHA manifest after the upgrade.
3. Commit any GSDR-upgrade artifacts produced by INT-02 (`.gitignore` permitting). The autonomous loop's bootstrap self-check assumes a clean tree at start.

If INT-02 fails (e.g., reapply-patches conflict), abort the pilot. The pilot is not a recovery path for upgrade failures.

### 5.3 Pilot task table — the executor's worksheet

Each row is one autonomous task. The audit gate fires after each. The goal-prompt's task-state machine progresses NOT_STARTED → IN_PROGRESS → VERIFYING → COMPLETE; ESCALATED on 3 retries.

| # | Task | Files touched | Verification | Audit-gate notes |
|---|---|---|---|---|
| 1 | INT-01 | `.planning/config.json`, `.planning/phases/03.1-…/03.1-CONTEXT.md`, `.planning/measurement/` (untracked dir, decide commit-or-gitignore) | `git status --porcelain` returns empty post-commit; `git log -1` shows `chore(planning):` or `docs(planning):` message naming both files; commit body cites the FAPH wave-5 closeout if config.json diff is harness-related | R1, R6 active; audit verifies the config.json change is *only* the existing modification, not a new edit |
| 2 | INT-05 | None in repo; modifies `.git/worktrees/` and `.claude/worktrees/` | `git worktree list` returns no entries beginning `.claude/worktrees/agent-`; `ls .claude/worktrees/` returns empty; `git for-each-ref refs/heads/worktree-agent-*` returns 0 refs (also clean up the corresponding branches) | R15 (no `--force`); if a worktree refuses removal, escalate |
| 3 | INT-06 | `.claude/settings.json` (new); also adds the `.claude/` to gitignore exception | File exists; valid JSON; `permissions` section includes the safe Bash patterns from INT-06 mechanism; `hooks` section configured per §6.3 | **HUMAN SPOT-CHECK CHECKPOINT** here (M=3); loop pauses and writes `checkpoints/CHECKPOINT-task-3-{ts}.md` |
| 4 | INT-18 | `AGENTS.md` (root) — modify the existing GSD:BEGIN…GSD:END block's "Runtime Capabilities" section per INT-18 mechanism | `grep -A2 "Runtime Capabilities" AGENTS.md` shows the dual-runtime language; commit body cites capability-matrix.md and the strategic audit | R1 — AGENTS.md is *not* a tripwire (it carries operationally-mutable runtime doctrine); audit verifies only the GSD-block contents changed |
| 5 | INT-19 | `CLAUDE.md` (root) — Architecture section | `grep -E "MetricTracePanel\|RunComparisonCard\|AssumptionPanel\|TrackContextPlaceholder\|WorkbenchShell\|SoCTrace\|SpeedProfileTrace\|SensitivityWaterfall\|TrackMap" CLAUDE.md` shows the 9 actual primitives (10 with future-aware-harness-cli); commit body cites the audit's D.3 finding | R1 — CLAUDE.md is *not* a tripwire (operational); audit verifies only the Architecture section changed |
| 6 | INT-24 | `apps/local-api/src/routes/health.ts` | Returns actual `process.env.HOST/PORT` (or `app.server.address()`); `npm test --workspace=apps/local-api` passes; `curl localhost:8787/api/health` returns `127.0.0.1` when `HOST` unset, `0.0.0.0` when set | R2 active (honesty); audit verifies the health endpoint no longer lies about its own listening address |
| 7 | INT-20 | `apps/web/src/main.tsx`, new `apps/web/src/app/ErrorBoundary.tsx`, new `apps/web/src/app/__tests__/ErrorBoundary.test.tsx` | New ErrorBoundary component renders a fallback when child throws; `npm test --workspace=apps/web` passes including the new test; `npm run build` produces no warnings | R5 (legacy renderer freeze) — the boundary is at app root, not inside a frozen panel; audit verifies the boundary is in `main.tsx` not `RunSummaryPanel.tsx` |
| 8 | INT-09 | `.github/workflows/quality-gate.yml` (new); optionally `package-lock.json` if a CI-only dev dep is needed | YAML lints (`yamllint .github/workflows/quality-gate.yml`); workflow cache key uses `package-lock.json` hash; jobs: `typecheck`, `test`, `build` (matrix on Node 22.x); push triggers on `push` and `pull_request` to `main` | R10 (no network) — the workflow file is content, not execution; audit verifies the workflow does not skip any of the 4 mandatory CLAUDE.md gates |

### 5.4 Pilot end-state

After task 8 completes and audits pass:
- `agent-events.jsonl` contains ≥8 task-complete events
- `.planning/auto-execution/STATE.md` `last_completed_task: INT-09`
- `.planning/auto-execution/sessions/SESSION-SUMMARY-pilot-complete-{ts}.md` is written
- The loop runs (one final time, with sandbox temporarily relaxed) `git push origin gsd/auto-goal-pilot-2026-05` and `gh pr create --title "auto-goal pilot 1: INT-01..INT-09 minus 02/03/04/07/08" --body @<(cat .planning/auto-execution/sessions/SESSION-SUMMARY-pilot-complete-*.md)`
- Loop ends. Human gate 3 takes over.

### 5.5 Human post-conditions (after PR merge)

After the human merges at gate 3, the human runs (manually, on dionysus):

1. `/gsdr:reflect` (INT-03) — review distilled lessons before committing.
2. `/gsdr:health-check` (INT-07) — establish first 1.19.10 baseline; expect yellow on signal density (0 reflections is a known density imbalance until INT-03 lands).
3. KB index refresh (INT-04) — re-run whatever indexer 1.19.10 ships.
4. Apply `staging/memory-additions.md` (INT-08) into `~/.claude/projects/.../memory/` per the staging file's recipe.

These four are *not* in the pilot scope but are the natural completion of the audit's Section A "Now" list. They produce the reflection lessons and health-check baseline that inform the *next* pilot's design.

---

## §6 Scaffold Layers

This section specifies what files the executor agent (running this plan) creates, where, and what each contains. Verbatim content for the small files; for larger files, the structure plus the load-bearing sections.

### 6.1 Directory layout (created in commit `gsd/auto-goal-pilot-scaffold`)

```
.planning/initiatives/autonomous-goal-pilot-2026-05/
├── README.md                       # initiative class declaration; collision contract; sequencing
├── PLAN.md                         # this document, copied (after /goal pilot success it can be augmented with retrospective)
├── audit/                          # formal-audit requests/responses for the initiative itself (not per-task)
│   ├── (empty at scaffold; populated if a formal audit is requested for the initiative as a whole)
│   └── README.md                   # initiative-audit naming convention
├── synthesis/                      # post-pilot synthesis artifacts (created during/after pilot)
│   └── (empty at scaffold)
├── application/                    # ledger of what the initiative changed in the repo (created during pilot)
│   └── APPLICATION-LEDGER.md       # template; populated as tasks complete
└── debrief/                        # post-pilot debrief
    └── (empty at scaffold; created at level B completion)

.planning/auto-execution/                      # autonomous-loop runtime state (separate from .planning/STATE.md)
├── STATE.md                                   # machine-parseable; YAML frontmatter
├── GUARDRAILS.md                              # bootstrap self-check + 13 hard rules + stop conditions
├── EXECUTION-MODEL.md                         # driver loop; task state machine; checkpoint protocol; audit gate
├── PLAN-snapshot.md                           # immutable copy of pilot plan (read-only after creation)
├── future-work.md                             # parking lot for scope-creep discoveries during the loop
├── agent-events.jsonl                         # append-only event log
├── red-anchors.txt                            # registry of currently-RED test anchors (start: empty)
├── phases/
│   └── pilot-2026-05.md                       # the per-pilot manifest (8 task descriptions)
├── checkpoints/                               # CHECKPOINT-* files for spot-check pauses
│   └── (empty at scaffold; populated at task 3 if M=3 spot-check fires)
├── escalations/                               # ESCALATION-* files for halt conditions
│   └── (empty at scaffold)
├── sessions/                                  # SESSION-SUMMARY-* per session (codex /goal session)
│   └── (empty at scaffold)
├── audits/                                    # AUDIT-task-N-* per audit invocation
│   └── (empty at scaffold)
├── staging/
│   ├── GOAL-PROMPT.md                         # the prompt the human pastes once
│   ├── memory-additions.md                    # INT-08 deferred content (for human apply)
│   ├── apply.sh                               # currently-empty / no-op; reserved for future pilots
│   └── apply-restore.sh                       # idem
└── design-gates/                              # for visualization phases (Phase 3.3+); empty at scaffold

.codex/                                        # project-local Codex config (new dir)
└── config.toml                                # sandbox + approval policy + (optional) hooks for if codex_hooks is later enabled

.claude/                                       # already exists (worktrees/); add settings.json
├── settings.json                              # permissions + hooks (Claude Code hooks fire here)
└── worktrees/                                 # existing dir; INT-05 will empty it of agent-* worktrees
    └── (post-INT-05: empty)

.github/
└── workflows/
    └── quality-gate.yml                       # CI: typecheck + test + build (INT-09)

.husky/                                        # new; pre-commit hook
├── _/                                         # husky internals
└── pre-commit                                 # runs npm run typecheck

scripts/
├── auto-goal-bootstrap-selfcheck.sh           # the bootstrap probe: tools, FAPH overlay, branch state, tripwires
├── auto-goal-audit-gate.sh                    # the wrapper that invokes claude -p with locked CWD and parses response
└── (existing scripts unchanged)
```

`AGENTS.md` (root) gets the HARD-RULES block (§4) added.
`CLAUDE.md` (root) gets the architecture-drift fix (INT-19) — but this happens *during* the pilot, not at scaffold time.

### 6.2 `.codex/config.toml` (project-level Codex config)

```toml
# Project-level Codex configuration for f1-modeling autonomous /goal loop.
# This file is read by codex when invoked from this repo's working tree.
# Global ~/.codex/config.toml supplies user settings (model, personality, project trust).
# This file supplies sandbox and approval defaults that apply to autonomous loop work.

sandbox_mode = "workspace-write"
network_access = false
approval_policy = "on-request"

# Hooks are conditional in Codex (capability-matrix says: requires codex_hooks = true).
# Currently the user's ~/.codex/config.toml does NOT enable codex_hooks.
# This block is provided as a no-op stub; it activates if and when codex_hooks is enabled.
# Until then, observability lives in the goal-prompt's explicit log writes (see §6.7).

[hooks]
# enabled = false   # enable when ~/.codex/config.toml enables codex_hooks

[[hooks.Stop]]
# command = "bash scripts/auto-goal-stop-hook.sh"   # the corresponding script does not exist yet
# blocking = false

# Project trust is set globally in ~/.codex/config.toml [projects."<repo path>"] trust_level = "trusted".
# That block is already present; do not duplicate here.
```

### 6.3 `.claude/settings.json` (per-project Claude Code config)

Per INT-06. Verifying the audit's claim that hooks fire in Claude Code (the originating prompt asks): yes, they do — `~/.claude/settings.json` and per-project `<repo>/.claude/settings.json` both register hooks that fire during Claude Code sessions. The project-local file overlays the global. This is documented in the Claude Code reference; the user's existing global settings already use the hooks system.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git show:*)",
      "Bash(git branch:*)",
      "Bash(git worktree list:*)",
      "Bash(git for-each-ref:*)",
      "Bash(npm run typecheck:*)",
      "Bash(npm run test:*)",
      "Bash(npm test:*)",
      "Bash(npm run build:*)",
      "Bash(npm run dev:*)",
      "Bash(node --version:*)",
      "Bash(npm --version:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(grep:*)",
      "Bash(rg:*)",
      "Bash(find:*)",
      "Bash(jq:*)",
      "Bash(yq:*)",
      "Bash(yamllint:*)",
      "Bash(sha256sum:*)",
      "Bash(curl http://localhost:*)",
      "Bash(curl http://127.0.0.1:*)",
      "Bash(bash scripts/verify-future-aware-harness.sh:*)",
      "Bash(bash scripts/auto-goal-bootstrap-selfcheck.sh:*)",
      "Bash(bash scripts/auto-goal-audit-gate.sh:*)",
      "Bash(gh pr view:*)",
      "Bash(gh pr list:*)",
      "Bash(gh run view:*)",
      "Bash(gh run list:*)",
      "Read(//home/rookslog/workspace/projects/f1-modeling/**)",
      "Edit(//home/rookslog/workspace/projects/f1-modeling/**)",
      "Write(//home/rookslog/workspace/projects/f1-modeling/**)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(rm -r:*)",
      "Bash(git push --force:*)",
      "Bash(git push --force-with-lease:*)",
      "Bash(git push origin main:*)",
      "Bash(git reset --hard:*)",
      "Bash(git clean -fd:*)",
      "Bash(git checkout .:*)",
      "Bash(git restore .:*)",
      "Bash(git branch -D:*)",
      "Bash(npm install:*)",
      "Bash(npm i:*)",
      "Bash(npm update:*)",
      "Bash(npm audit fix:*)",
      "Edit(//home/rookslog/.codex/**)",
      "Edit(//home/rookslog/.claude/**)",
      "Edit(//home/rookslog/.gsd/**)",
      "Write(//home/rookslog/.codex/**)",
      "Write(//home/rookslog/.claude/**)",
      "Write(//home/rookslog/.gsd/**)"
    ]
  },
  "hooks": {
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/auto-goal-event-emit.sh stop",
            "blocking": false
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/auto-goal-tripwire-check.sh",
            "blocking": true
          }
        ]
      }
    ]
  }
}
```

The PostToolUse tripwire-check is a belt-and-braces enforcement of R1: if Claude Code (a) writes to a tripwire file during an autonomous-loop-adjacent session, the hook blocks the tool call and emits a HARD-STOP escalation. Codex CLI sessions are *not* protected by this hook (Codex hooks are off); for Codex the rule is enforced by the audit gate, the goal-prompt's hard-rule block, and the bootstrap self-check.

### 6.4 `.planning/auto-execution/STATE.md`

```yaml
---
schema_version: 1
loop_id: pilot-2026-05
loop_state: not_started        # not_started | running | paused | escalated | complete
last_updated: <ISO-8601>
last_session_id: null
last_completed_task: null      # null at start; set to INT-N as tasks complete
current_task_index: 0          # 1-indexed; 0 means not started; 9 means done
current_task_state: not_started   # not_started | in_progress | verifying | complete | escalated
git:
  branch: gsd/auto-goal-pilot-2026-05
  base: main
  base_sha_at_loop_start: <sha>      # set by bootstrap self-check
  last_task_commit_sha: null
  last_audit_commit_sha: null        # null until first audit
audit:
  last_audit_status: null            # pass | fail | error
  last_audit_path: null              # .planning/auto-execution/audits/AUDIT-task-N-...
  last_audit_at: null
  human_spot_checks:
    next_at_task: 3
    last_at_task: null
escalations: []                       # list of paths under escalations/
faph_verify:
  last_run: <ISO at bootstrap>
  exit_code: 0
  manifest_sha: <sha-of-tooling/future-aware-harness/manifest.json>
loop_invariants:
  network_access: false
  sandbox_mode: workspace-write
  branch_protection_on_main: true     # human-attested; not loop-checked
---

# Autonomous Loop Runtime State

This file is the **machine-parseable** state of the autonomous loop. The frontmatter is the
canonical record; the prose body is for human reading only.

## Authority and Concerns

This file is **not** the GSDR routing digest. The routing digest at `.planning/STATE.md` is owned
by the FAPH overlay (`tooling/future-aware-harness/manifest.json` `templates/state.md`) and
contains active doctrine refs, active tech-debt ids, and reduced-guarantee status. That file is
read by `/gsdr:resume-project` and human navigators.

This file is read by the autonomous loop driver and the audit-gate wrapper. It is updated atomically
(write-temp-then-rename) at task boundaries only. See `EXECUTION-MODEL.md` for the update recipe.

## Cross-pointer

`.planning/STATE.md` carries an `<!-- AUTO-LOOP:BEGIN --> ... <!-- AUTO-LOOP:END -->` block (added
by INT-01 task or by the scaffold) pointing at this file. That block is the only mutation of
`.planning/STATE.md` the loop is authorized to make (hard rule R7).
```

### 6.5 `.planning/auto-execution/GUARDRAILS.md`

Bootstrap self-check + the 13 hard rules + stop conditions. The hard rules are *literally* copied from §4 above; the scaffold is responsible for keeping `AGENTS.md` and this file in sync (the bootstrap self-check verifies byte-equality of the rule block).

Stop conditions (loop halts and writes an `escalations/ESCALATION-{reason}-{ts}.md` if any of these is true):

```
S1.  Tripwire file modified (R1)
S2.  Audit response file written by non-auditor (R9)
S3.  Audit returned status: fail and 3 retries exhausted
S4.  verify-future-aware-harness.sh returned non-zero
S5.  npm test (root) returned non-zero on latest commit
S6.  Bootstrap self-check returned non-zero
S7.  Human wrote ABORT: in any checkpoint file
S8.  Codex /goal session ended without writing SESSION-SUMMARY (session drift)
S9.  Branch is no longer ahead of origin/main (someone rebased; loop's commits would conflict)
S10. .planning/auto-execution/STATE.md content does not parse as YAML (corruption)
```

Bootstrap self-check (run at the start of every loop session, including resumes):

```
B1.  Confirm cwd is /home/rookslog/workspace/projects/f1-modeling/
B2.  Confirm git branch matches STATE.md.git.branch
B3.  Confirm git base SHA == STATE.md.git.base_sha_at_loop_start (no rebase)
B4.  Run scripts/verify-future-aware-harness.sh; assert exit 0
B5.  git diff --name-only HEAD..main -- <tripwires>; assert empty (no tripwire modified)
B6.  Confirm tools available: codex, claude, gh, node, npm, jq, yq, sha256sum
B7.  Confirm .codex/config.toml has sandbox_mode = "workspace-write" and network_access = false
B8.  Confirm STATE.md parses as YAML
B9.  If STATE.md.loop_state == "paused" or "escalated", refuse to advance without human checkpoint
B10. Echo plan-snapshot SHA: sha256sum .planning/auto-execution/PLAN-snapshot.md
```

### 6.6 `.planning/auto-execution/EXECUTION-MODEL.md`

Driver loop pseudocode + task state machine + checkpoint protocol + audit-gate parse + session-end-on-pressure + session-resume + escalation procedure + done-detection.

```
DRIVER LOOP (codex /goal executes this):

  read GUARDRAILS.md         # pre-task re-read; the 13 hard rules
  read STATE.md              # current state
  if STATE.loop_state in (paused, escalated, complete): halt
  pick next task: T = phases/pilot-2026-05.md[STATE.current_task_index + 1]
  if T not found: write SESSION-SUMMARY pilot-complete; loop_state = complete; halt
  begin task T:
    STATE.current_task_index += 1
    STATE.current_task_state = in_progress
    STATE.last_updated = now
    atomic-write STATE
    emit_event(task_start, T.id)
    [executor performs task work; see per-task TASK-PROMPT.md inside phases/pilot-2026-05.md]
  end task work:
    git add <files-touched>
    git commit -m "<conventional-commit>"
    STATE.git.last_task_commit_sha = git rev-parse HEAD
    STATE.current_task_state = verifying
    atomic-write STATE
    emit_event(task_commit, T.id, sha=...)
  invoke audit gate:
    bash scripts/auto-goal-audit-gate.sh T.id
    [the gate runs claude -p; writes audits/AUDIT-task-N-<ts>.md]
    parse audits/AUDIT-task-N-<ts>.md frontmatter:
      if status == pass:
        STATE.last_completed_task = T.id
        STATE.current_task_state = complete
        STATE.audit.last_audit_status = pass
        STATE.audit.last_audit_path = audits/AUDIT-task-N-<ts>.md
        atomic-write STATE
        emit_event(task_complete, T.id)
        if STATE.audit.human_spot_checks.next_at_task == STATE.current_task_index:
          [HUMAN SPOT-CHECK CHECKPOINT]
          write checkpoints/CHECKPOINT-task-N-<ts>.md
          STATE.loop_state = paused
          atomic-write STATE
          halt; await human action (commit a line APPROVED:, EDIT-AND-APPROVED:, or ABORT:)
        else:
          [advance loop]
          continue
      if status == fail:
        if T.retries < 3:
          T.retries += 1
          STATE.current_task_state = in_progress
          atomic-write STATE
          emit_event(task_retry, T.id, n=retries)
          retry task work
        else:
          escalate(T, audit_response_path)
      if status == error:
        escalate(T, audit_response_path, reason="audit error")

ESCALATION:

  write escalations/ESCALATION-<ts>.md including:
    - task id and state
    - audit response (link)
    - last 50 lines of agent-events.jsonl
    - git status
    - STATE.md snapshot
  STATE.loop_state = escalated
  atomic-write STATE
  emit_event(escalation, T.id, reason=...)
  halt

SESSION-END (codex /goal session terminates from context pressure or quota):

  write sessions/SESSION-SUMMARY-<sid>-<ts>.md including:
    - active task at end
    - subtask boundary reached (per phases/pilot-2026-05.md TASK breakdown)
    - git state SHA at end
    - what's pending
    - what files were partially written (if any)
  STATE.last_session_id = <sid>
  atomic-write STATE
  [session terminates; no additional action — codex /goal will resume from STATE on next launch]

SESSION-RESUME (next codex /goal launch):

  bootstrap self-check (B1..B10)
  read sessions/SESSION-SUMMARY-<last-sid>-<ts>.md
  verify git state SHA matches STATE.git.last_task_commit_sha
  if mismatch: ESCALATE (someone changed git state outside the loop)
  otherwise resume from declared subtask boundary
```

### 6.7 `.planning/auto-execution/staging/GOAL-PROMPT.md`

The prompt the human pastes once into a fresh `codex` TUI on dionysus. It is small and self-contained because the loop reads everything else from disk.

```markdown
# Autonomous /goal pilot — paste-once prompt

You are running an autonomous /goal pilot inside the f1-modeling repo on dionysus.

CWD must be: /home/rookslog/workspace/projects/f1-modeling/

## Bootstrap

Before doing anything else, in this exact order:

1. Read `AGENTS.md` (root) — note the HARD-RULES block, all 13 rules.
2. Read `.planning/auto-execution/GUARDRAILS.md` in full.
3. Read `.planning/auto-execution/EXECUTION-MODEL.md` in full.
4. Read `.planning/auto-execution/PLAN-snapshot.md` in full (this is the immutable pilot plan).
5. Read `.planning/auto-execution/STATE.md`. Note current state.
6. Run `bash scripts/auto-goal-bootstrap-selfcheck.sh`. If exit non-zero, halt and write
   `.planning/auto-execution/escalations/ESCALATION-bootstrap-{timestamp}.md` with the failed
   probe(s).

## Task loop

For each task from `.planning/auto-execution/phases/pilot-2026-05.md` in order:

- Re-read `AGENTS.md` HARD-RULES block before starting.
- Execute the task's TASK-PROMPT (literal, in the phase file).
- After file changes: stage with `git add <specific files>` (never `git add -A`).
- Commit with the conventional-commit message specified in the task description.
- Append a `task_commit` event to `.planning/auto-execution/agent-events.jsonl` (schema in §6.8).
- Invoke the audit gate: `bash scripts/auto-goal-audit-gate.sh <task-id>`.
- Parse the audit response file's YAML frontmatter; act per EXECUTION-MODEL.md.

## Stop conditions

If any of S1..S10 from GUARDRAILS.md fires, halt immediately and write the appropriate escalation
file. Do not retry past 3 attempts on a single task.

## Hard prohibitions (re-stating; full set in AGENTS.md HARD-RULES)

- Never modify a tripwire file (R1).
- Never write to `~/.codex/`, `~/.claude/`, `~/.gsd/` (R8).
- Never run `gh pr merge`, `gh pr close`, `git merge`, `git rebase`, `git push --force`, or push
  to `origin main` (R12, R13).
- Never use `--no-verify`, `--no-gpg-sign`, or any flag that bypasses test/build/audit gates (R11).
- Never run `rm -rf` or any destructive shell idiom from R15.
- Never modify `.planning/auto-execution/audits/AUDIT-*.md` (R9; only the audit subprocess writes
  these).

## Event log schema (agent-events.jsonl, append-only)

Each line is one JSON object with these fields:
- `ts` — ISO-8601 timestamp
- `loop_id` — pilot-2026-05
- `task_id` — INT-NN or "bootstrap" or "session"
- `event` — one of: bootstrap_start, bootstrap_pass, bootstrap_fail, task_start, task_commit,
  task_retry, audit_invoke, audit_pass, audit_fail, task_complete, escalation, checkpoint,
  session_summary, session_end
- `commit_sha` — git rev-parse HEAD at event time (or null if pre-commit)
- `details` — free-form object; for audit events MUST include the audit response path; for
  escalations MUST include the escalation file path

## When you are done

After task 8 (INT-09) completes and audit passes, write
`.planning/auto-execution/sessions/SESSION-SUMMARY-pilot-complete-{timestamp}.md`. Then push
the branch with `git push origin gsd/auto-goal-pilot-2026-05`. Then open a PR with
`gh pr create --title "auto-goal pilot 1: INT-01..INT-09 minus 02/03/04/07/08" --body @<(cat
.planning/auto-execution/sessions/SESSION-SUMMARY-pilot-complete-*.md)`. Then halt; the human
takes over at gate 3.
```

### 6.8 `agent-events.jsonl` schema (event log; append-only)

The event log is the panel's reconstruction substrate. A reader, given only the events file and the git history, must be able to answer: what did the loop do, in what order, with what outcome?

Required events:

```jsonl
{"ts":"2026-05-12T03:00:00Z","loop_id":"pilot-2026-05","task_id":"bootstrap","event":"bootstrap_start","commit_sha":null,"details":{"plan_snapshot_sha":"<sha>","faph_manifest_sha":"<sha>"}}
{"ts":"2026-05-12T03:00:05Z","loop_id":"pilot-2026-05","task_id":"bootstrap","event":"bootstrap_pass","commit_sha":null,"details":{"probes":["B1","B2","B3","B4","B5","B6","B7","B8"]}}
{"ts":"2026-05-12T03:00:10Z","loop_id":"pilot-2026-05","task_id":"INT-01","event":"task_start","commit_sha":"<base-sha>","details":{}}
{"ts":"2026-05-12T03:00:30Z","loop_id":"pilot-2026-05","task_id":"INT-01","event":"task_commit","commit_sha":"<sha>","details":{"files":[".planning/config.json",".planning/phases/03.1-…/03.1-CONTEXT.md"]}}
{"ts":"2026-05-12T03:00:40Z","loop_id":"pilot-2026-05","task_id":"INT-01","event":"audit_invoke","commit_sha":"<sha>","details":{"command":"bash scripts/auto-goal-audit-gate.sh INT-01","auditor":"claude-code"}}
{"ts":"2026-05-12T03:01:30Z","loop_id":"pilot-2026-05","task_id":"INT-01","event":"audit_pass","commit_sha":"<sha>","details":{"audit_response":".planning/auto-execution/audits/AUDIT-task-INT-01-2026-05-12T03-01-25Z.md","audit_response_sha":"<sha>"}}
{"ts":"2026-05-12T03:01:31Z","loop_id":"pilot-2026-05","task_id":"INT-01","event":"task_complete","commit_sha":"<sha>","details":{}}
```

The event-emit hook (`scripts/auto-goal-event-emit.sh`) is the canonical writer. The goal-prompt instructs the executor to call it explicitly because Codex hooks are off. Belt-and-braces: any tool that wants to write events must call the script; the script appends with `flock` to prevent torn writes.

### 6.9 `.husky/pre-commit`

Per INT-08-companion. Fast (must complete in <10s on dionysus to avoid bypass temptation):

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run typecheck only (fast). Test and build run in CI.
npm run typecheck

# RED-ANCHOR check: warn (do not block) if any anchor without RESOLVED companion is in staged files.
staged=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')
if [ -n "$staged" ]; then
  if echo "$staged" | xargs grep -l "RED-ANCHOR" 2>/dev/null | xargs grep -L "RESOLVED-ANCHOR" 2>/dev/null > /dev/null; then
    echo "WARNING: staged files contain RED-ANCHOR without RESOLVED-ANCHOR. Continue with care."
  fi
fi

# Tripwire-check: hard-block if a staged change touches a tripwire file.
tripwires="\.planning/VISION\.md\|\.planning/LONG-ARC\.md\|\.planning/ARTIFACT-GOVERNANCE\.md\|\.planning/PROJECT\.md\|\.planning/REQUIREMENTS\.md\|\.planning/TECH-DEBT\.md\|\.planning/AGENTS\.md\|tooling/future-aware-harness/manifest\.json\|tooling/future-aware-harness/overlay/"
if git diff --cached --name-only | grep -E "$tripwires" > /dev/null; then
  echo "ERROR: staged change touches a tripwire file. See AGENTS.md HARD-RULES R1."
  echo "Tripwire-class doctrine. Edit by hand outside the autonomous loop."
  exit 1
fi
```

The pre-commit hook is fast (typecheck + greps). The `lint-staged` ESLint integration is *not* in the pilot scope; it lands in INT-13 (audit Wave 2) per the audit's sequencing. Pre-commit must not be slow enough to encourage `--no-verify`.

### 6.10 `.github/workflows/quality-gate.yml`

Per INT-09. Minimum viable; future-extensible to lint, axe, benchmark.

```yaml
name: Quality Gate
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'
          cache: 'npm'
      - name: Install dependencies (frozen)
        run: npm ci
      - name: Typecheck (all workspaces)
        run: npm run typecheck
      - name: Test (root, all workspaces)
        run: npm test
      - name: Build (all workspaces)
        run: npm run build
      - name: Verify FAPH overlay (informational; not blocking)
        run: bash scripts/verify-future-aware-harness.sh || echo "FAPH drift detected; non-blocking in CI"
        continue-on-error: true

  audit-evidence:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && startsWith(github.head_ref, 'gsd/auto-goal-')
    steps:
      - uses: actions/checkout@v4
      - name: Verify pilot has audit evidence
        run: |
          # On auto-goal branches, every commit's task must have a corresponding AUDIT file.
          for sha in $(git log --format=%H origin/main..HEAD); do
            msg=$(git log -1 --format=%s $sha)
            task=$(echo "$msg" | grep -oE 'INT-[0-9]+' | head -1)
            if [ -n "$task" ] && ! ls .planning/auto-execution/audits/AUDIT-task-${task}-*.md 2>/dev/null | head -1 > /dev/null; then
              echo "ERROR: commit $sha mentions $task but no audit response exists"
              exit 1
            fi
          done
```

The `audit-evidence` job is the structural enforcement of the audit gate at the merge point. The PR cannot merge unless every auto-goal commit has a paired audit-response file. (Branch protection on `main` requires this job to pass.)

### 6.11 `scripts/auto-goal-audit-gate.sh`

The audit-gate wrapper. Invokes `claude -p` with locked CWD; parses response frontmatter.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Audit-gate wrapper. Invoked from inside the autonomous loop.
# Spawns a fresh claude -p subprocess that reads only the diff and the task spec.

TASK_ID="${1:?task id required (e.g., INT-01)}"
REPO_ROOT="$(git rev-parse --show-toplevel)"
TS="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
AUDIT_PATH="${REPO_ROOT}/.planning/auto-execution/audits/AUDIT-task-${TASK_ID}-${TS}.md"

# Pre-execution: verify the audit path is fresh (not pre-existing).
if [ -e "${AUDIT_PATH}" ]; then
  echo "ERROR: audit response path already exists: ${AUDIT_PATH}"
  exit 2
fi

# Compute the diff range: from the previous task's commit to HEAD.
PREV_COMMIT="$(yq '.git.last_task_commit_sha // .git.base_sha_at_loop_start' "${REPO_ROOT}/.planning/auto-execution/STATE.md")"
DIFF_RANGE="${PREV_COMMIT}..HEAD"

# Build the audit prompt. The prompt structure is negative-find; see §7.
PROMPT_FILE="$(mktemp)"
cat > "${PROMPT_FILE}" <<EOF
You are an independent auditor running under Claude Code (separate runtime from the executor).

Task under audit: ${TASK_ID}
Diff range: ${DIFF_RANGE}
Audit response path: ${AUDIT_PATH}

You MUST:
1. Read the task description from .planning/auto-execution/phases/pilot-2026-05.md (only the
   block for ${TASK_ID}).
2. Read the diff: git diff ${DIFF_RANGE}.
3. Read AGENTS.md HARD-RULES block (the 13 rules).
4. Read .planning/auto-execution/GUARDRAILS.md stop conditions (S1..S10).
5. Identify what is WRONG with the diff. Treat the executor's claim of "task done" as a hypothesis
   to falsify, not a conclusion to confirm. List every concern. If you find no concern,
   explicitly state "no concern found" and explain what specific properties you verified.
6. Write your finding to ${AUDIT_PATH} using the audit-response YAML frontmatter format:

---
audit_target: ${TASK_ID}
auditor: claude-code-${CLAUDE_AUDITOR_MODEL_ID:-default}
auditor_runtime: claude-code
diff_range: ${DIFF_RANGE}
diff_sha: <sha256 of the diff body>
status: pass | fail | needs_change | error
findings:
  blocking: []
  concern: []
  observation: []
hard_rule_violations: []     # list of R-numbers if any rule violated
tripwire_modified: false     # true if any path in tripwire list appears in diff
audit_completed_at: <ISO-8601>
---

# AUDIT — ${TASK_ID}

[Body: prose findings; one section per concern; cite line numbers from the diff.]

You MUST NOT:
- Read .planning/auto-execution/sessions/ (the executor's reasoning trace).
- Read .planning/auto-execution/agent-events.jsonl (the executor's event log).
- Edit any file other than ${AUDIT_PATH}.
- Run npm or git commands that mutate state.

You MAY read .planning/STATE.md, .planning/LONG-ARC.md, .planning/TECH-DEBT.md and any
.planning/initiatives/vision-alignment-2026-04/deliberations/ decision-anchor file to ground
your findings in doctrine. You SHOULD cite at least one such file when assessing whether the
diff respects R2-R5.
EOF

# Invoke claude -p with locked CWD and explicit deny on writing outside the audit path.
# --bare disables auto-memory and CLAUDE.md auto-discovery, ensuring the auditor's context
# is constructed from the prompt and the explicitly-allowed file reads only.
claude -p --bare \
  --add-dir "${REPO_ROOT}" \
  --allowed-tools "Read Bash(git diff:*) Bash(git log:*) Bash(sha256sum:*) Write(${AUDIT_PATH})" \
  --append-system-prompt "You are auditor-only. Independence from executor is required. See ${PROMPT_FILE}." \
  --effort xhigh \
  < "${PROMPT_FILE}"

# Verify the audit response was written.
if [ ! -e "${AUDIT_PATH}" ]; then
  echo "ERROR: claude -p did not write audit response at ${AUDIT_PATH}"
  exit 3
fi

# Parse status from frontmatter.
STATUS="$(yq '.status' "${AUDIT_PATH}")"
echo "AUDIT[${TASK_ID}] status=${STATUS} path=${AUDIT_PATH}"

# Verify no executor-side commits to the audit path during this task.
LAST_TASK_COMMIT="$(yq '.git.last_task_commit_sha' "${REPO_ROOT}/.planning/auto-execution/STATE.md")"
if [ "${LAST_TASK_COMMIT}" != "null" ]; then
  TOUCHED_BY_EXEC="$(git log "${LAST_TASK_COMMIT}..HEAD" --pretty=format:"%an" -- "${AUDIT_PATH}" | grep -v "claude-code-auditor" || true)"
  if [ -n "${TOUCHED_BY_EXEC}" ]; then
    echo "ERROR: audit path was touched by non-auditor: ${TOUCHED_BY_EXEC}"
    echo "HARD-STOP: rule R9 violation"
    exit 4
  fi
fi

case "${STATUS}" in
  pass) exit 0 ;;
  fail|needs_change) exit 10 ;;
  error|*) exit 11 ;;
esac
```

The pre-write check (audit path doesn't exist) plus the post-audit git-log check together enforce R9 mechanically: the audit response cannot have been pre-staged by the executor, and no executor-attributed commit can have touched the path during the task window.

`--bare` strips Claude Code's auto-memory and CLAUDE.md auto-discovery; the auditor's context is constructed from the explicit prompt and the explicit `--add-dir`. This forces structural independence: no auto-loaded user memory bleeds into the audit decision.

### 6.12 `scripts/auto-goal-bootstrap-selfcheck.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "${REPO_ROOT}"

probe() {
  local name="$1"; shift
  if "$@" > /dev/null 2>&1; then
    echo "PASS  $name"
    return 0
  else
    echo "FAIL  $name"
    return 1
  fi
}

failed=0

probe B1_cwd test "$(pwd)" = "/home/rookslog/workspace/projects/f1-modeling" || failed=1

EXPECTED_BRANCH="$(yq '.git.branch' .planning/auto-execution/STATE.md)"
ACTUAL_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
probe B2_branch test "${ACTUAL_BRANCH}" = "${EXPECTED_BRANCH}" || failed=1

EXPECTED_BASE="$(yq '.git.base_sha_at_loop_start' .planning/auto-execution/STATE.md)"
ACTUAL_BASE="$(git merge-base HEAD origin/main)"
probe B3_base_sha test "${EXPECTED_BASE}" = "${ACTUAL_BASE}" || failed=1

probe B4_faph_verify bash scripts/verify-future-aware-harness.sh || failed=1

# B5: tripwire-no-modify
TRIPWIRES=(
  ".planning/VISION.md"
  ".planning/LONG-ARC.md"
  ".planning/ARTIFACT-GOVERNANCE.md"
  ".planning/PROJECT.md"
  ".planning/REQUIREMENTS.md"
  ".planning/TECH-DEBT.md"
  ".planning/AGENTS.md"
  ".planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md"
  ".planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md"
  ".planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md"
  ".planning/initiatives/vision-alignment-2026-04/deliberations/04-decision-anchor.md"
  ".planning/initiatives/vision-alignment-2026-04/deliberations/05-decision-anchor.md"
  ".planning/initiatives/vision-alignment-2026-04/SUMMARY.md"
  ".planning/initiatives/vision-alignment-2026-04/APPLICATION-LEDGER.md"
  ".planning/initiatives/future-aware-planning-harness-2026-04/PLAN.md"
  "tooling/future-aware-harness/manifest.json"
)
TRIPWIRE_DIFF="$(git diff --name-only origin/main..HEAD -- "${TRIPWIRES[@]}" || true)"
probe B5_tripwire_clean test -z "${TRIPWIRE_DIFF}" || { echo "  diff: ${TRIPWIRE_DIFF}"; failed=1; }

probe B6a_codex command -v codex || failed=1
probe B6b_claude command -v claude || failed=1
probe B6c_gh command -v gh || failed=1
probe B6d_node command -v node || failed=1
probe B6e_npm command -v npm || failed=1
probe B6f_jq command -v jq || failed=1
probe B6g_yq command -v yq || failed=1
probe B6h_sha256sum command -v sha256sum || failed=1

# B7: codex sandbox sanity
SANDBOX="$(grep -E '^sandbox_mode' .codex/config.toml | head -1)"
probe B7a_sandbox test "${SANDBOX}" = 'sandbox_mode = "workspace-write"' || failed=1
NETACCESS="$(grep -E '^network_access' .codex/config.toml | head -1)"
probe B7b_network test "${NETACCESS}" = 'network_access = false' || failed=1

# B8: STATE.md parses
probe B8_state_yaml yq '.' .planning/auto-execution/STATE.md || failed=1

# B9: loop_state not paused/escalated
LOOPSTATE="$(yq '.loop_state' .planning/auto-execution/STATE.md)"
probe B9_loop_state test "${LOOPSTATE}" != "paused" -a "${LOOPSTATE}" != "escalated" || failed=1

# B10: plan-snapshot SHA echo (informational)
echo "INFO  plan_snapshot_sha=$(sha256sum .planning/auto-execution/PLAN-snapshot.md | awk '{print $1}')"

if [ ${failed} -ne 0 ]; then
  echo "BOOTSTRAP SELF-CHECK FAILED"
  exit 1
fi
echo "BOOTSTRAP SELF-CHECK PASSED"
```

### 6.13 `scripts/auto-goal-tripwire-check.sh` (Claude Code PostToolUse hook)

```bash
#!/usr/bin/env bash
# PostToolUse hook for Edit/Write. Reads the JSON tool input from stdin per Claude Code hooks API.
# Returns exit 2 to block the tool call if the path matches a tripwire.
set -euo pipefail

INPUT="$(cat)"
PATH_TOUCHED="$(echo "${INPUT}" | jq -r '.tool_input.file_path // empty')"

case "${PATH_TOUCHED}" in
  */VISION.md|*/LONG-ARC.md|*/ARTIFACT-GOVERNANCE.md|*/PROJECT.md|*/REQUIREMENTS.md|*/TECH-DEBT.md)
    echo "TRIPWIRE: ${PATH_TOUCHED} is a doctrine file. Edit outside the autonomous loop." >&2
    exit 2
    ;;
  */vision-alignment-2026-04/deliberations/*-decision-anchor.md)
    echo "TRIPWIRE: ${PATH_TOUCHED} is a decision anchor. Tripwire-class." >&2
    exit 2
    ;;
  */tooling/future-aware-harness/manifest.json|*/tooling/future-aware-harness/overlay/*)
    echo "TRIPWIRE: ${PATH_TOUCHED} is FAPH-managed. Use scripts/setup-future-aware-harness.sh." >&2
    exit 2
    ;;
esac

exit 0
```

### 6.14 `staging/apply.sh` and `staging/apply-restore.sh` — empty for the pilot

The VIGIL pattern uses `staging/apply.sh` to install home-dir artifacts at human gate 1. The f1-modeling pilot does not require any home-dir mutation:

- `~/.codex/config.toml` already has `[projects."<repo path>"] trust_level = "trusted"` (probe confirmed).
- `~/.codex/config.toml` already has `[features] goals = true`.
- `codex_hooks` is *not* enabled and the pilot deliberately does not enable it (see §8).
- All hooks-related work happens via `.claude/settings.json` (in-repo) and `.husky/pre-commit` (in-repo).
- All CI work happens via `.github/workflows/` (in-repo).

`staging/apply.sh` exists as a no-op stub so the directory pattern is established for *future* pilots. Its body is:

```bash
#!/usr/bin/env bash
# Placeholder. Pilot 2026-05 requires no home-dir mutation; ~/.codex/ already has the relevant
# blocks. If a future pilot requires home-dir changes, add them here with a corresponding entry
# in apply-restore.sh.
echo "No home-dir mutations required for this pilot."
exit 0
```

### 6.15 Audit-evidence cross-pointer in `.planning/STATE.md`

The single block added to `.planning/STATE.md` (per R7):

```markdown
<!-- AUTO-LOOP:BEGIN -->
## Autonomous Loop Pointer

The autonomous /goal pilot tracks its runtime state at `.planning/auto-execution/STATE.md`.
Initiative artifact: `.planning/initiatives/autonomous-goal-pilot-2026-05/PLAN.md`.

Pilot scope: INT-01..INT-09 audit-driven, minus INT-02/03/04/07/08 which are human bookends.

A `/gsdr:resume-project` invocation should consult both this routing digest and the
auto-execution state file before deciding next action.
<!-- AUTO-LOOP:END -->
```

The block is delimited so the FAPH overlay's `templates/state.md` shape is undisturbed and `verify-future-aware-harness.sh` continues to pass. The pointer answers Plan-agent objection #3 (STATE-duplication risk by giving humans a single entry point that names the second file).

---

## §7 The Audit Gate

The audit gate is the load-bearing structural mechanism. The plan invests heavily in it because the audit's #1 finding is doctrine without enforcement, and the gate is the enforcement.

### 7.1 Mechanism choice

**Adopted**: `claude -p --bare` with locked allowed-tools, invoked once per task by the autonomous loop, writing to `.planning/auto-execution/audits/AUDIT-task-N-{ts}.md`. After INT-02 lands the GSDR upgrade, *manually* migrate to `claude -p "/gsdr:audit --delegation cross_model:codex --diff <range>"` as the canonical primitive, but the *file pattern* persists as the substrate.

Alternatives considered and rejected:

| Alternative | Why rejected |
|---|---|
| `codex exec "$gsdr-audit phase-X"` (executor self-audits) | No structural independence; same model family, same context |
| GitHub Actions reusable-workflow audit | Too slow per-task (CI run takes minutes); good for the merge gate (B.4) but not the per-task gate |
| Human review per task | Defeats autonomy; pilot becomes a guided session |
| `/gsdr:audit` from the executor's own session | Same runtime; runtime independence collapses |

### 7.2 Independence — structural, not nominal

The independence argument the panel will inspect:

| Dimension | This plan | Trust basis |
|---|---|---|
| Different runtime | Codex (executor) vs Claude Code (auditor) | `which codex` and `which claude` both succeed (probe) |
| Different model family | gpt-5.4/5.5 (codex per `~/.codex/config.toml:2`) vs claude-opus/sonnet (claude default) | `~/.codex/config.toml` `model = "gpt-5.5"` and Claude default |
| Different process tree | `claude -p` is spawned fresh per audit | `auto-goal-audit-gate.sh` spawns subprocess |
| Different input | Auditor reads diff + task spec, *not* executor reasoning trace | Audit prompt explicit "MUST NOT read .planning/auto-execution/sessions/ or agent-events.jsonl" |
| Different tools | Auditor has `--allowed-tools "Read Bash(git diff:*) Bash(git log:*) Bash(sha256sum:*) Write(${AUDIT_PATH})"` only | `--allowed-tools` flag on `claude -p` |
| Different working memory | `--bare` strips auto-memory and CLAUDE.md auto-discovery | `--bare` flag on `claude -p` |
| Output uncontaminated | R9 + git-log post-check verify only auditor wrote the response | `auto-goal-audit-gate.sh` post-execution check |

The panel will press: "What if both models converge on the same wrong answer because their training data overlaps on the obvious case?" Plan-agent objection #2. Three structural mitigations:

1. **Negative-find prompt structure.** Audit prompt asks "Identify what is wrong" not "Approve this." See §6.11. The auditor must enumerate concerns even when finding none, and the audit response must list "what specific properties you verified" — forcing a falsifiable claim, not just a thumbs-up.
2. **Canary injection at task boundary 5 (INT-19).** The autonomous loop's task-5 work product is the CLAUDE.md drift fix. The pilot's task definition for INT-19 includes a deliberate seeded error: a copy-paste duplication that any honest auditor catches. If audit-of-INT-19 returns `pass` without flagging the duplicate, the loop halts: the audit gate is rubber-stamping. The seeded error is removed before merge by a tiny commit the human approves at gate 3. (This is *one* canary in the pilot. Future pilots can add more, but the panel will note that one canary is the minimum.)
3. **Human spot-check at task 3 (M=3).** The loop pauses; human reviews the diff *and* the audit response together; approves or aborts. This is the human's structural backstop on the audit gate.

### 7.3 Audit response shape

```yaml
---
audit_target: <task-id>
auditor: claude-code-<model-id>
auditor_runtime: claude-code
diff_range: <prev-sha>..<head-sha>
diff_sha: <sha256 of the diff body — for forensic replay>
status: pass | fail | needs_change | error
findings:
  blocking: [<list of blocking findings>]
  concern: [<list of non-blocking concerns>]
  observation: [<list of neutral observations>]
hard_rule_violations: [<list of R-numbers; empty if none>]
tripwire_modified: false
audit_completed_at: <ISO-8601>
---

# AUDIT — <task-id>

(prose body; one section per finding; cite diff line numbers)
```

The frontmatter is the machine-readable contract. The driver loop parses `status` and `hard_rule_violations` only. The prose body is for the human at the merge gate (gate 3). The `diff_sha` field is the forensic-replay anchor: a future reader can verify what diff the auditor saw.

### 7.4 What "fail" means

`status: fail` halts the loop on the third retry (per §6.6 driver). Prior to retry 3, the loop re-runs the task — the executor reads the audit response body, attempts a remediation, recommits, re-audits. After retry 3, escalation file is written. The human resolves out of band.

`status: needs_change` is treated as `fail` for the autonomous loop (the executor does not have the discretion to accept "needs change but proceed"). The human at the spot-check or gate 3 can downgrade `needs_change` to `pass-with-followup` and write a `RESOLVED:` line in the escalation file.

`status: error` is an audit-internal failure (e.g., `claude -p` returned non-zero, frontmatter unparseable). Always escalates immediately; no retry.

### 7.5 Post-audit verification

After every audit, the loop verifies:
- The audit response file exists at the expected path.
- The frontmatter parses.
- The diff_sha matches `git diff --no-color <prev-sha>..HEAD | sha256sum`.
- Only `claude-code-auditor` has commits in `git log <prev-task-commit>..HEAD -- <audit-path>`.
- Tripwire R1 not flagged.

Failure of any verification → escalation, no retry.

### 7.6 Migration to `/gsdr:audit` (post-INT-02)

After INT-02 (1.18.3 → 1.19.10) lands, the audit-gate wrapper switches from the bespoke prompt to the GSDR primitive:

```bash
claude -p --bare \
  --add-dir "${REPO_ROOT}" \
  --allowed-tools "Read Bash(git diff:*) Bash(git log:*) Bash(sha256sum:*) Write(${AUDIT_PATH})" \
  "/gsdr:audit ${TASK_ID} --delegation cross_model:codex --orientation investigatory --output ${AUDIT_PATH}"
```

The migration is a *post-pilot* refinement; the pilot itself runs on the bespoke wrapper because INT-02 is a human precondition.

---

## §8 Cross-Runtime Concerns

Both runtimes are present on dionysus and both must be supported. The plan does not bet entirely on one.

### 8.1 Runtime split for the pilot

| Function | Runtime | Why |
|---|---|---|
| Loop driver | Codex (`/goal` feature; `goals = true` in `~/.codex/config.toml`) | The user's primary runtime; `runtime.platform: codex` in `.planning/config.json:24` |
| Per-task audit gate | Claude Code (`claude -p --bare`) | Cross-model independence; both binaries on dionysus; Claude Code supports `--allowed-tools` (Codex doesn't) |
| Per-Claude-session enforcement | `.claude/settings.json` hooks (PostToolUse on Edit/Write → tripwire-check; Stop → event emit) | Claude Code hooks are fully supported per capability matrix |
| Per-Codex-session enforcement | Goal-prompt + bootstrap self-check + agent-events.jsonl explicit emit | Codex hooks conditional on `codex_hooks = true`; not enabled by default |
| Pre-commit | Husky → typecheck + tripwire-grep + RED-anchor warn | Runtime-agnostic; runs on git, not the runtime |
| CI | GitHub Actions on push/PR | Runtime-agnostic; the universal substrate |

### 8.2 What if `codex_hooks` is later enabled?

The plan ships `.codex/config.toml` with the hooks block commented-out and a Stop-hook stub script reference. If the user enables `codex_hooks = true` in `~/.codex/config.toml` (or per-project), the loop's Stop hook can begin emitting events natively. This is a *future enhancement*, not a pilot dependency.

### 8.3 Why the audit doesn't rely on Codex hooks

Plan-agent agreement: the capability matrix says hooks are conditional and "GSD hook installation to Codex is deferred to Phase 60." Belt-and-braces: the goal-prompt instructs the executor to write events explicitly via `bash scripts/auto-goal-event-emit.sh`. If hooks ever fire, they add a second path; if they don't, the explicit path is sufficient. This matches the VIGIL pitfall mitigation ("Codex Stop hook silently fails to fire (mitigated by goal prompt instructing the model to write events explicitly as backup)").

### 8.4 What happens if Claude Code is not available

Claude Code is present (`/home/rookslog/.local/bin/claude`, version 2.1.139, probed). If a future dionysus rebuild lacks Claude Code, the audit gate cannot run in its current form. The plan's §13 uncertainty list flags this; the recovery path is to install Claude Code (`npm install -g @anthropic-ai/claude-code` or equivalent), not to drop the cross-runtime audit.

### 8.5 What happens if the user prefers an apollo-side audit

Apollo can run Claude Code natively. A variant of the audit-gate wrapper could SSH from dionysus to apollo and invoke `claude -p` there. The plan does not adopt this for the pilot — same-host audit is simpler and the panel will not object to it given Claude is already on dionysus. If a future pilot needs apollo-side audit (e.g., for a larger model not available on dionysus), the wrapper adds an SSH path; the file-mediated independence contract is unchanged.

---

## §9 Test-Anchor Convention

### 9.1 The chosen idiom: plain failing tests + `// RED-ANCHOR:` comment

vitest's API has three pitfalls for TDD anchors:

| API | Problem |
|---|---|
| `test.fails(name, fn)` | Reports as a *pass* when the wrapped test actually fails. Inverts semantics; the audit gate cannot tell "RED test correctly fails" from "GREEN test silently breaks" |
| `test.todo(name)` | Does not run anything. Cannot serve as a done-signal because nothing executes |
| `expect.fail()` inside otherwise-passing test | Same problem as `test.fails` — the test reports as "fails as expected" which the harness reports as pass |
| Calls into not-yet-existing APIs | Causes typecheck errors; vitest doesn't get a chance to report it as a TDD anchor |

**Adopted**: a test that *actually fails* (red), marked with a `// RED-ANCHOR: <task-id>` comment line at the top of the failing test or its parent describe block. When the implementation lands and the test passes, the comment is replaced with `// RESOLVED-ANCHOR: <task-id>` (or removed entirely with the same task's commit). Done-signal: `npm test` at root is green AND `grep -rn "RED-ANCHOR" packages/ apps/` returns 0 matches without a paired `RESOLVED-ANCHOR`.

### 9.2 Worked example

A new test for INT-20 (error boundary) lands in `apps/web/src/app/__tests__/ErrorBoundary.test.tsx`:

```typescript
// RED-ANCHOR: INT-20
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("renders honest fallback when child throws", () => {
    const Throw = () => {
      throw new Error("boom");
    };
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong loading workspace data/)).toBeInTheDocument();
  });
});
```

Before the executor implements `ErrorBoundary.tsx`, both tests fail (typecheck error: module not found, then runtime error). The `RED-ANCHOR: INT-20` comment is grep-able. After the executor implements `ErrorBoundary.tsx`, both tests pass; the executor (in the same task commit) replaces `RED-ANCHOR` with `RESOLVED-ANCHOR: INT-20` (or removes the comment).

The `pre-commit` hook warns (does not block) on staged files containing `RED-ANCHOR` without paired `RESOLVED-ANCHOR`. The CI's `audit-evidence` job does not enforce; the audit gate's per-task prompt asks the auditor to verify "Are RED-ANCHOR comments either resolved or paired with a future-task entry in `.planning/auto-execution/red-anchors.txt`?"

### 9.3 Why this beats `test.fails` for this repo

The repo's existing tests load real circuit JSON and use real reduced-order solvers; "failing" can mean (a) implementation is incomplete, (b) the physics produced an unexpected number, or (c) input data is malformed. `test.fails` collapses all three into "pass." The plain-failing convention preserves the distinction: a test that fails is a test that has a real assertion error; a test that fails because the implementation does not exist yet is documented by the `RED-ANCHOR` comment.

This is sharper than the VIGIL pattern, which uses a Swift Package Manager test layout where the failing test is its own done-state signal because Swift's test runner reports per-test status more granularly. vitest doesn't, so the explicit comment carries the load.

The F1-engineer-on-the-panel concern (Plan-agent observation): "RED-ANCHOR markers may conflict with the project's existing pattern of full-circuit-load integration tests where 'failing' means 'real physics produced an unexpected number.'" The convention does not conflict — physics failures are *bugs*, not anchors; they should be fixed, not annotated. The `RED-ANCHOR` comment is reserved for "this test exists to mark a not-yet-implemented feature." If a sim-core integration test fails because of a physics regression, that's a bug to fix, not an anchor.

---

## §10 What's a Done-Signal in This Ecosystem

The TypeScript stack gives us several mechanical signals. The plan maps each to its phase-gate role.

| Signal | Mechanism | Pilot scope | Phase-3.3+ scope |
|---|---|---|---|
| `npm run typecheck` | tsc strict + `noUncheckedIndexedAccess` | Pre-commit + CI + audit gate | Same |
| `npm test` (root) | vitest in all workspaces | CI + audit gate | Same |
| `npm run build` | per-workspace bundlers (vite, tsc) | CI + audit gate | Same |
| ESLint | none yet | Out of scope (INT-13, audit Wave 2) | Required |
| Prettier / Biome | none yet | Out of scope | Optional |
| Axe-core a11y | none yet | Out of scope (INT-15, Phase 3.3 entry) | Required pre-3.3-substrate |
| Benchmark envelope check | none yet (VA-TD-08) | Stub harness only (see §10.1) | Required pre-3.3-substrate |
| Cross-model audit | `claude -p` per task | Per-task | Same |
| Cross-phase regression | implicit; CI runs root tests | CI | Same |
| Browser-safe boundary | bundler default; no lint rule yet | Implicit | INT-13 ESLint rule |
| Visible fidelity labeling | manual; audit-gate prompt R2 check | Implicit (pilot doesn't touch fidelity surfaces) | INT-10 honesty-auditor subagent |
| Vision-alignment checkpoint | manual; audit-gate prompt | Implicit | INT-11 vision-alignment-auditor subagent |
| Tech-debt registry update | template enforcement (low-medium per audit) | None this pilot | Required on any plan touching a registered seam |
| Tripwire-no-modify | bootstrap self-check + pre-commit + post-tool-use hook + audit gate | Required | Same |

### 10.1 Benchmark stub for VA-TD-08

The audit calls VA-TD-08 "an active process failure" because no benchmark harness exists. The pilot ships a *stub*: empty `packages/sim-core/__bench__/`, `packages/visuals/__bench__/`, and `scripts/bench.sh` placeholder so the requirement has a place to live. The stub does not assert anything; it makes the *absence* of benchmark evidence visible at code-review time.

```
packages/sim-core/__bench__/
├── README.md           # "Benchmark stubs. Phase 3.3 plan 3.3-05 fills these in. See VA-TD-08."
└── envelope.json       # Empty {} placeholder. 3.3-05 supplies real envelope numbers.

packages/visuals/__bench__/
├── README.md           # idem
└── envelope.json       # idem

scripts/bench.sh
#!/usr/bin/env bash
# Placeholder. The benchmark harness (VA-TD-08) is Phase 3.3 work.
echo "Benchmark harness not implemented (VA-TD-08; Phase 3.3-05). See packages/*/__bench__/README.md."
exit 0
```

Stub work is intentionally cheap: the pilot is not Phase 3.3, and stubbing is not implementation. The stub creates the directory shape so the next pilot (or the real Phase 3.3-05 plan) can drop content in without scaffolding.

### 10.2 Implicit-fidelity regression detection

Audit `D.2` flagged the race-simulation web UI silently falling through to `PlaceholderRunView` — a typecheck-passing honesty regression. The pilot does not touch this surface. The audit gate's R2 check is structured to detect this *class* of bug: any new code path that returns a UI representation without surfacing fidelity metadata is flagged. INT-25 (race-simulation web view or honest placeholder) is post-pilot work.

---

## §11 What This Plan Does NOT Cover

Naming the omissions because the panel will check.

| Out of scope | Why | Doctrine reference |
|---|---|---|
| Phase 3.3 substrate work (`AccessibleChartContract`, `AnchorRegistry` as code) | Phase 3.3 planning gates per CLAUDE.md and VA-TD-09/-10 | `CLAUDE.md` "Phase 4 contract completion"; `VA-TD-09`, `VA-TD-10` |
| Cloud compute migration | v4+ per LONG-ARC.md:43-44 | `LONG-ARC.md:43-44` |
| Multi-regulation expansion (2022-2025 ground-effect, etc.) | v2 initiative seed (INT-39); first non-2026 family deferred | `LONG-ARC.md:51` future shape; INT-39 |
| Future RL work | After calibration; v3+ per layered-stack doctrine | `LONG-ARC.md:33`; INT-43 |
| Calibration against telemetry imports | Phase 6 + 7; pilot does not touch the import path | `ROADMAP.md` Phase 6/7 |
| iOS / mobile clients | Not in vision; thin-client baseline is apollo-over-Tailscale | `CLAUDE.md` "Thin-client baseline" |
| Real-time strategy capability | Vision pillar without v1 path; INT-40 seed | `VISION.md:14, 40`; INT-40 |
| Refactor of `runService.ts` (VA-TD-01) | Phase 3.2 work; pilot does not touch sim-core or local-api services | `VA-TD-01`; Phase 3.2 plans |
| Refactor of `RunSummaryPanel.tsx` (legacy SVG freeze) | VA-TD-05 freeze; pilot adds error boundary in `main.tsx`, outside the freeze zone | `VA-TD-05` |
| New visualization features | VA-TD-05 freeze plus Phase 3.3 prerequisite | `VA-TD-05`; VA-TD-09/-10 |
| `/gsdr:upgrade-project` (INT-02) | Human precondition; not autonomous | §5.2 |
| `/gsdr:reflect`, `/gsdr:health-check`, KB index refresh, memory updates (INT-03/04/07/08) | Human post-conditions; require human review of GSDR output | §5.5 |
| ESLint / Prettier / Biome (INT-13) | Post-pilot Wave-2 audit work | INT-13 audit sequencing |
| Honesty-auditor / vision-alignment-auditor / audit-pre-flight subagents (INT-10/11/12) | Post-pilot Wave-2; subagent work needs Claude Code agent definitions in `.claude/agents/` which the pilot does not author | INT-10/11/12 audit sequencing |
| Axe-core a11y test infra (INT-15) | Phase 3.3 entry gate | INT-15 audit sequencing |
| Benchmark envelopes (INT-36) | Phase 3.3 plan 3.3-05; pilot ships stub only | INT-36 audit sequencing |
| `LessonUnit` / `LearningPath` schemas | Phase 3.4 work | `ROADMAP.md` Phase 3.4 |
| Replanning Phase 4 CONTEXT/RESEARCH | v1-close work (INT-37) | INT-37 audit sequencing |

---

## §12 Pitfalls and Mitigations

The pitfall table is the panel's spot-check substrate. Each row: detection signal, mitigation in this plan, escalation procedure if mitigation fails.

| # | Pitfall | Detection signal | Mitigation | If mitigation fails |
|---|---|---|---|---|
| P1 | Codex inherits global `danger-full-access` if project untrusted | `codex` log line at session start | `~/.codex/config.toml [projects."<repo>"] trust_level = "trusted"` already set (probe confirmed); `.codex/config.toml` adds project-level sandbox cap | Bootstrap self-check B7 fails; loop refuses to start |
| P2 | Codex Stop hook silently fails to fire | Empty `agent-events.jsonl` after a task | Goal-prompt instructs explicit `bash scripts/auto-goal-event-emit.sh` call after every task event; explicit calls don't depend on Codex hooks | Audit gate parses `agent-events.jsonl` and fails if `task_complete` event missing for the audited task |
| P3 | `/gsdr:reapply-patches` conflicts on existing patches | INT-02 (human precondition) reports conflict | Human runs INT-02 interactively; pilot does not start until reapply-patches succeeds | Pilot delayed; debug INT-02 manually |
| P4 | Codex `tool_permissions` not enforced (capability gap) | Executor writes to forbidden path | R8/R9 + audit gate's git-log post-check + `.claude/settings.json` deny-rules (effective only when Claude Code session does the writing) + pre-commit hook tripwire-block | HARD STOP on the audit immediately following the violation |
| P5 | Audit gate rubber-stamps (silent agreement) | Audit returns `pass` for everything for 3+ tasks in a row | Negative-find prompt + canary at task 5 + human spot-check at task 3 | Loop halts; human reviews entire audit chain |
| P6 | Self-modifying runtime mid-pilot | INT-02 inside the loop scope | INT-02 lifted *out* as human precondition (§5.2); pilot uses the file-pattern audit primitive, not `/gsdr:audit`, until upgrade lands | Pilot does not start until INT-02 succeeds; not a runtime-during-pilot issue |
| P7 | Context-window exhaustion mid-task | Codex `/goal` session ends mid-task | `EXECUTION-MODEL.md` SESSION-END protocol writes `SESSION-SUMMARY-{sid}-{ts}.md` declaring active task, subtask boundary, git SHA, pending state; SESSION-RESUME on next launch verifies SHA and resumes from declared boundary | If git SHA mismatches on resume (someone changed state outside the loop), HARD STOP; human reconciles |
| P8 | Test flakiness from path-walking helpers | CI test job intermittent fail | Pilot does not add new tests that path-walk; INT-20 ErrorBoundary tests are deterministic | If pilot test is flaky, escalate; do not retry past 3 |
| P9 | Goal-prompt misinterpreted | Executor takes wrong action at task N | Goal-prompt is small (§6.7); explicit bootstrap order; AGENTS.md HARD-RULES re-read at every audit gate | Audit gate catches; if not, human spot-check at task 3 catches |
| P10 | Embedded YAML duplication source-vs-resources | A future YAML schema gets out of sync between repo source and runtime materialization | FAPH manifest already SHA-locks; pilot does not duplicate any YAML | N/A for pilot |
| P11 | Weekly quota exhaustion mid-run | Codex/Claude session ends from quota | SESSION-END protocol (P7); user resumes after quota reset | Same as P7 |
| P12 | Pre-commit blocks legitimate WIP commit | `husky pre-commit` rejects | Pre-commit only runs `npm run typecheck` + greps; if blocked, fix the typecheck error or add `--no-verify` (not auto, but allowed for *human* commits — never for auto-loop) | Audit gate's grep for `--no-verify` in commit message catches if loop bypassed |
| P13 | Branch protection refuses merge despite green CI | CI passes but `audit-evidence` job fails | The `audit-evidence` job is *exactly* the structural enforcement of audit-gate-at-merge; a fail means a commit lacks paired audit response. Loop should not have merged anyway. | Human at gate 3 reviews; either fixes the audit chain or aborts the PR |
| P14 | `verify-future-aware-harness.sh` reports drift | FAPH overlay no longer matches manifest | Bootstrap self-check B4 catches; loop refuses to start | Human runs `setup-future-aware-harness.sh --restore` and re-verifies |
| P15 | Tripwire file edited via `.claude/` PostToolUse hook bypass (e.g., shell command writes a tripwire) | Pre-commit hook tripwire-grep catches | Pre-commit blocks; audit gate's tripwire check catches if pre-commit was somehow bypassed | HARD STOP; human reviews |
| P16 | Race-simulation web UI silently falls through to PlaceholderRunView (audit D.2 honesty regression) | Pilot does not touch this surface; future pilots must catch via R2 audit-gate check | R2 check explicitly looks for "any new code path that returns a UI representation without surfacing fidelity metadata" | Audit returns fail; remediation required |
| P17 | Regulation hardcoding by autonomous "while I'm here" cleanup | Audit-gate R3 check looks for new numeric constants from regulation domain | R3 check; pilot does not touch sim-core | Audit fail; rollback |
| P18 | Future-aware harness collision (apply.sh touches FAPH-managed surface) | Bootstrap B4 + R8 + tripwire | apply.sh is empty for this pilot; no home-dir mutations | Pilot scaffold deliberately empty; future pilots add with great care |
| P19 | Auto-loop edits AGENTS.md outside the HARD-RULES block | Audit gate parses AGENTS.md and asserts only the HARD-RULES block changed | Tripwire check (AGENTS.md is in tripwire list) blocks ALL edits to AGENTS.md from the loop. Hmm — but INT-18 (task 4) is supposed to edit AGENTS.md for the hooks-doctrine update. Resolution: INT-18 task is hand-listed as a tripwire EXCEPTION in the goal-prompt, with an explicit one-time pass token. Audit gate verifies the diff is only inside the GSD:BEGIN…GSD:END block and is exactly the INT-18 mechanism content. | If audit detects out-of-block edit, HARD STOP |
| P20 | The Apollo↔dionysus latency turns the UI smoke step into a synchronous block | Loop attempts to "verify UI" autonomously and gets stuck | R-not-explicit but covered by §5.4 end-state: loop pushes branch and opens PR; UI smoke is human gate 3 work | Loop never attempts UI verification; gate 3 covers it |
| P21 | Reduced-Guarantee No-Context Rule violated by the autonomous loop | A pilot task is planned without context citation | Pilot tasks are pre-defined (§5.3) with explicit citations. The pilot does not invoke `/gsdr:plan-phase`; it executes pre-cited interventions. | N/A for pilot scope; rule applies to *human* planning sessions, which the loop is not. |
| P22 | Network-egress sandbox blocks `npm install` | Loop attempts `npm install` | R10 forbids; goal-prompt forbids; `.claude/settings.json` denies. Pilot tasks deliberately avoid lockfile changes (INT-09 may add a CI-only dev dep but only as a manual follow-on, not in pilot) | If task needs install, escalate |
| P23 | The first canary at task 5 produces a false positive | Auditor catches a real bug, not the seeded one | Both fine — auditor is doing its job. The seeded error is removable in a follow-up commit | If auditor catches both, log both findings and proceed |
| P24 | A worktree-agent-* branch has unmerged changes that get lost in INT-05 | INT-05 task should `git worktree remove <name>` (not `--force`); resists if uncommitted changes exist | If resists, escalate; human inspects | If forced removal happens (it shouldn't), human-side `git fsck` and `git reflog` recovery |

The pitfall table is intentionally long. The panel will read it; rows 1-20 are the load-bearing ones. Rows 21-24 are project-specific and added because the originating prompt named them.

---

## §13 Key Uncertainties

The numbered list. Each uncertainty is a thing the plan does not fully resolve and that may break execution.

**UNCERTAINTY-U1.** The exact UI/contract of the codex `/goal` feature is not fully verifiable from this plan-mode probe. `codex --help` shows `codex exec` subcommands; the `/goal` feature is enabled (`goals = true` in `~/.codex/config.toml`) but its TUI prompt-and-loop semantics, its session-end behavior, and its resume mechanism are not documented in the probe output. The plan's `EXECUTION-MODEL.md` design assumes a session-end / session-resume contract that may not match the actual feature.

- *Recovery if wrong*: Test the `/goal` feature on a throwaway scratch repo before pasting the GOAL-PROMPT.md into the f1-modeling Codex TUI. If `/goal` cannot be paused mid-session with state preserved, the M=3 spot-check checkpoint becomes a hard halt that the human must restart from scratch (re-paste GOAL-PROMPT). That's annoying but not damaging.
- *Falsification*: A 5-minute test at gate 1 with a dummy single-task goal-prompt confirms the basic `/goal` lifecycle.

**UNCERTAINTY-U2.** Whether GitHub branch protection on `origin/main` is enabled. The probe confirmed the remote exists but did not query `gh api repos/:owner/:repo/branches/main/protection`. If protection is not on, the `audit-evidence` CI job runs but does not gate the merge.

- *Recovery if wrong*: Human enables branch protection at gate 1. Single CLI call: `gh api -X PUT repos/loganrooks/f1-modeling/branches/main/protection --input .planning/auto-execution/staging/branch-protection.json`. The plan should include a `staging/branch-protection.json` template; this plan does not yet specify its contents because the GitHub API shape varies by Pro/Free.
- *Falsification*: `gh api repos/loganrooks/f1-modeling/branches/main/protection 2>&1` at gate 1.

**UNCERTAINTY-U3.** The exact behavior of `claude -p --bare` with `--allowed-tools` and `Write(<path>)` allow-list. The Claude Code CLI semantics for `--allowed-tools` parameter formatting (comma-separated vs space-separated; per-tool argument syntax) may differ from the plan's `auto-goal-audit-gate.sh` invocation.

- *Recovery if wrong*: The audit-gate wrapper has a unit test that pins the exact `claude -p` invocation; failure at gate 0 surfaces immediately. Adjust the wrapper.
- *Falsification*: `claude --help | grep -A5 allowed-tools`.

**UNCERTAINTY-U4.** Whether `/gsdr:audit` (the post-INT-02 canonical primitive) supports the `--output <path>` flag the migration in §7.6 assumes. The 1.19.4 release notes (cited in audit Section E) describe the 3-axis taxonomy but the exact CLI shape is not in the probe.

- *Recovery if wrong*: After INT-02, read `~/.codex/get-shit-done-reflect/workflows/` (post-upgrade) for the actual `/gsdr:audit` skill spec. Update the audit-gate wrapper accordingly.
- *Falsification*: Post-INT-02, run `/gsdr:audit --help` from a Claude Code session.

**UNCERTAINTY-U5.** Codex's exact session token-budget at quality profile (`gpt-5.5` per `~/.codex/config.toml`, `model_reasoning_effort = "medium"`). The 90-min retry signal indicates a real failure mode at high reasoning effort; the pilot operates at default `medium` for the codex executor and `xhigh` for the auditor (per `~/.codex/config.toml plan_mode_reasoning_effort = "xhigh"` for plan mode, but the goal-prompt does not invoke plan mode).

- *Recovery if wrong*: SESSION-END / SESSION-RESUME protocol covers the failure mode if it appears. If it doesn't appear in the pilot, the next pilot can leave the protocol in place as cheap insurance.
- *Falsification*: Run the pilot end-to-end and observe `agent-events.jsonl` for `session_end` events.

**UNCERTAINTY-U6.** The dual-implementation tension between `scripts/setup-future-aware-harness.sh` (bash) and `packages/future-aware-harness-cli/` (typed CLI). INT-17 logs the reconciliation as future-work but the pilot's bootstrap calls only the bash script. If the typed CLI has been silently designated as authoritative since INT-17 was written, the bash script may be stale.

- *Recovery if wrong*: At gate 1, the human runs *both* `bash scripts/verify-future-aware-harness.sh` and `npx fa-harness verify` (or equivalent CLI invocation). If they disagree, the pilot does not start; the disagreement is itself an INT-17 finding to escalate.
- *Falsification*: The two verifiers either agree (pilot proceeds) or disagree (escalate).

**UNCERTAINTY-U7.** Whether the `git worktree remove` command in INT-05 will succeed cleanly on the 7 stale worktrees. They are from late-March operations and may have uncommitted scratch.

- *Recovery if wrong*: Loop escalates; human inspects with `git -C <worktree-path> status` and decides to `git stash` or `git reset --hard` (human action, not loop).
- *Falsification*: `git -C .claude/worktrees/agent-a4ae8d31 status` and similar at gate 1, before the loop runs.

**UNCERTAINTY-U8.** Whether `.claude/worktrees/` should remain after pruning, or should be removed entirely from the repo (it's an artifact of the agent-worktree feature). The pilot only empties it of agent-* worktrees; the directory remains for future use.

- *Recovery if wrong*: Trivial to remove the directory in a follow-up commit.

**UNCERTAINTY-U9.** Whether the `audit-evidence` GitHub Actions job will work when triggered by a PR from a `gsd/auto-goal-*` branch — specifically, whether `git log origin/main..HEAD` evaluates correctly inside the GHA runner's checkout depth.

- *Recovery if wrong*: Add `fetch-depth: 0` to the `actions/checkout@v4` step. The plan should include this; updating §6.10 yaml.
- *Falsification*: First PR run.

**UNCERTAINTY-U10.** Whether the panel persona "F1 engineer" finds R2-R5 sufficient for their concerns. The plan-agent observed that the F1 engineer is silent on autonomous-loop architecture (correctly), but R2-R5 are pre-loaded for *future* pilots that touch sim-core / fidelity / regulation surfaces. Whether the rules as stated catch what an F1 engineer would catch is uncertain.

- *Recovery if wrong*: The plan's §14 reviewer-panel section asks the F1 engineer to inspect R2-R5 and the audit-gate prompt for those rules. If they would refine, refinement happens before the *next* pilot, not this one.

**UNCERTAINTY-U11.** Whether `claude -p --bare` correctly strips ALL contextual leakage (including the parent process's environment variables that may carry telemetry or session ids). If a Claude session inherits `CLAUDE_*` env vars from the codex parent, audit independence is partially compromised.

- *Recovery if wrong*: Wrap the `claude -p` call in `env -i bash -c '...'` to start with a clean env, only passing the variables the auditor explicitly needs (`HOME`, `PATH`, etc.).
- *Falsification*: Run `claude -p --bare "echo \$ANTHROPIC_AUTH_TOKEN_LENGTH"` in a child of a Claude Code session. (Probe at gate 1.)

**UNCERTAINTY-U12.** Whether `.codex/config.toml` (project-level) actually overrides `~/.codex/config.toml` (global) for the `network_access` and `sandbox_mode` settings the pilot depends on. The capability matrix and codex-cli docs are clearer on the global file than the project file.

- *Recovery if wrong*: Move the settings to the goal-prompt as `-c key=value` overrides on the codex invocation. The goal prompt is the human's paste, so this is fine — the human just pastes a slightly different command.
- *Falsification*: At gate 1, run `cd <repo>; codex -c "show config"` (or equivalent introspection) and verify `sandbox_mode` and `network_access` are the project-level values.

The pattern: every uncertainty has a falsification probe that runs at gate 0, gate 1, or the first iteration of the loop. The plan's pilot is *robust to* the uncertainties because every recovery is small-scope.

### §13.5 Probe results — run 2026-05-12 (pre-commit)

Three probes were attempted before this PLAN.md landed in the repo. Two ran; one was deferred. Results modify the plan as noted.

#### U2 — branch protection on `origin/main`

Probe: `gh api repos/loganrooks/f1-modeling/branches/main/protection`

**Result**: branch protection IS enabled, but **only minimally**:

```json
{
  "required_signatures": {"enabled": false},
  "enforce_admins": {"enabled": false},
  "required_linear_history": {"enabled": true},
  "allow_force_pushes": {"enabled": false},
  "allow_deletions": {"enabled": false},
  "required_conversation_resolution": {"enabled": false},
  "lock_branch": {"enabled": false}
}
```

`gh api repos/loganrooks/f1-modeling/branches/main/protection/required_status_checks` returns HTTP 404 ("Required status checks not enabled").

**Plan impact**: §3.5 and §10 assume status checks gate merge. Currently they do not. The `audit-evidence` job (§6.10) will *run* on PRs but will *not block merge* until required_status_checks is configured.

**Required action before pilot starts**: human enables required status checks at human gate 1 with one CLI call:

```bash
gh api -X PATCH repos/loganrooks/f1-modeling/branches/main/protection/required_status_checks \
  -f strict=true \
  -f 'contexts[]=quality / quality' \
  -f 'contexts[]=audit-evidence / audit-evidence'
```

(Job names per §6.10's quality-gate.yml; verify after first CI run that the actual job names match.)

**Existing protection that IS useful**: linear history required (no merge commits via `gh pr merge --merge`); force-push disabled; branch deletion disabled. Squash and rebase merges are allowed. The pilot's PR will use squash merge.

**Repo metadata bonus**: visibility is `public` (`gh api repos/loganrooks/f1-modeling --jq .visibility` returns `"public"`). The pilot's PR is therefore externally visible; the panel may wish to know this for any disclosure considerations.

#### U11 — `claude -p --bare` env-var inheritance

Probe sequence (run 2026-05-12):

```bash
# Baseline confirms TEST_VAR_AUTOGOAL_PROBE is set in the parent shell
TEST_VAR_AUTOGOAL_PROBE=hello-from-parent bash -c 'echo "in-shell: $TEST_VAR_AUTOGOAL_PROBE"'
# → "in-shell: hello-from-parent"

# Test 1: claude -p --bare (the plan's design)
TEST_VAR_AUTOGOAL_PROBE=hello-from-parent claude -p --bare --allowed-tools "Bash" \
  <<<"Run: echo PROBE_RESULT=\$TEST_VAR_AUTOGOAL_PROBE; report output"
# → "Not logged in · Please run /login"

# Test 2: claude -p (without --bare, control)
TEST_VAR_AUTOGOAL_PROBE=hello-from-parent claude -p --allowed-tools "Bash" \
  <<<"Run: echo PROBE_RESULT=\$TEST_VAR_AUTOGOAL_PROBE; report output"
# → "PROBE_RESULT=hello-from-parent"
```

Two important findings:

1. **WITHOUT `--bare`, env vars DO leak through to Bash tool calls.** `PROBE_RESULT=hello-from-parent` came back, confirming the U11 concern is real for non-`--bare` invocations. **Dropping `--bare` is therefore not a safe alternative** — the auditor would inherit the executor's environment.

2. **WITH `--bare`, Anthropic auth is restricted to `ANTHROPIC_API_KEY` env var** (or `apiKeyHelper` via `--settings`). The probe failed because `ANTHROPIC_API_KEY` is not in the shell; the user's Claude Code is OAuth-authenticated and `--bare` explicitly disables OAuth and keychain reads. From `claude --help`:

   > `--bare`: Minimal mode: skip hooks, LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and CLAUDE.md auto-discovery. Sets `CLAUDE_CODE_SIMPLE=1`. Anthropic auth is strictly `ANTHROPIC_API_KEY` or apiKeyHelper via --settings (OAuth and keychain are never read).

**Plan impact**: §6.11's `auto-goal-audit-gate.sh` as written will fail because (a) it doesn't source `ANTHROPIC_API_KEY` and the user's primary auth is OAuth, and (b) it doesn't strip the parent env. The wrapper needs a dual fix:

```bash
# Source ANTHROPIC_API_KEY from ~/.env (per CLAUDE.md "Credentials: ~/.env only" convention)
[ -f "${HOME}/.env" ] && set -a && . "${HOME}/.env" && set +a

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "ERROR: ANTHROPIC_API_KEY not set; --bare cannot authenticate. Add it to ~/.env."
  exit 5
fi

# Wrap with env -i to strip codex parent's env, only passing what the auditor needs
env -i \
  HOME="${HOME}" \
  PATH="${PATH}" \
  ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
  CLAUDE_CONFIG_DIR="${HOME}/.claude" \
  TERM="${TERM:-dumb}" \
  claude -p --bare \
    --add-dir "${REPO_ROOT}" \
    --allowed-tools "Read Bash(git diff:*) Bash(git log:*) Bash(sha256sum:*) Write(${AUDIT_PATH})" \
    --append-system-prompt "..." \
    --effort xhigh \
    < "${PROMPT_FILE}"
```

The `env -i` wrapping plus explicit pass-through is the recommended pattern. The plan's §6.11 should be read by the scaffold-executor with this §13.5 finding folded in — the executor's authoring of the wrapper script must match this contract.

**Required action before pilot starts**: confirm `ANTHROPIC_API_KEY` exists in `~/.env` (per CLAUDE.md convention). If not, the audit-gate cannot fire and the loop's first task halts at the first audit invocation. One-line check:

```bash
grep -q "^ANTHROPIC_API_KEY=" ~/.env && echo "present" || echo "ABSENT — set before pilot"
```

#### U1 — codex `/goal` lifecycle semantics

**Status**: deferred. The probe requires an interactive Codex TUI session, which cannot be reliably scripted from the current Claude Code session. The plan's recommended path holds: at human gate 1, the user runs a 5-minute throwaway-repo `/goal` test with a one-task prompt and observes the lifecycle (session-end behavior, resume, state preservation).

#### U2/U11 net effect on plan

Neither probe falsifies the plan's architecture. Both surface concrete pre-pilot human actions for human gate 1:

1. Configure required status checks on `origin/main` (one-line `gh api -X PATCH`).
2. Confirm `ANTHROPIC_API_KEY` available in `~/.env` (one-line `grep` check).
3. The scaffold-executor agent must implement `auto-goal-audit-gate.sh` per the §13.5 contract above (sourcing `~/.env`, `env -i` wrapping, explicit env pass-through), not the `claude -p --bare` invocation as bare-flag-named in §6.11.

This §13.5 result is the contract the scaffold-executor must satisfy when implementing §6.11. If the executor reads §6.11 first and authors the script without §13.5, the script will fail at first audit invocation. The CONTEXT/PLAN read order should be: §1 → §2 → §3 → §4 → §13.5 → §6 → §7 → … so §13.5's findings inform §6 implementation.

---

## §14 Reviewer-Panel Addressed Responses

### 14.1 What the senior software engineers will scrutinize, and how the plan answers it

**SWE concern: "Are preconditions and postconditions explicit on every task?"**
The pilot task table (§5.3) gives one row per task with explicit verification commands. Each task's audit-gate prompt (assembled by `auto-goal-audit-gate.sh`) feeds the auditor a literal task spec from `phases/pilot-2026-05.md`. The verification cells in §5.3 are the reviewable contract.

**SWE concern: "Are failure modes mapped to recovery procedures?"**
The pitfall table (§12) is one row per known failure with detection signal, mitigation, and escalation. The escalation procedure is uniform: write `escalations/ESCALATION-{reason}-{ts}.md`; halt; human resolves out of band.

**SWE concern: "Is anything one-shot that should be replayable?"**
The bootstrap self-check is idempotent. The audit gate is per-task and replayable (each invocation creates a new timestamped file; the loop reads only the latest). `apply.sh` is no-op for the pilot. The migration to `/gsdr:audit` post-INT-02 is described in §7.6 as a runtime-only change to the wrapper script. Nothing one-shot mutates state irreversibly during the pilot. Branch creation is one-shot per pilot, but pilot-renaming would just create a new branch.

**SWE concern: "No orphaned scripts?"**
Every script created (`auto-goal-bootstrap-selfcheck.sh`, `auto-goal-audit-gate.sh`, `auto-goal-event-emit.sh`, `auto-goal-tripwire-check.sh`) is invoked by the loop or hook system. The benchmark stub `bench.sh` is intentionally empty pending Phase 3.3.

**SWE concern: "No `apply.sh` that mutates global state without backup-and-restore."**
`apply.sh` is empty for the pilot. The user's `~/.codex/config.toml` changes (project trust, `goals = true`) are pre-existing and not modified by the pilot. The plan does not touch global state; FAPH owns the `~/.codex/get-shit-done-reflect/` surface and has its own backup-and-restore (`setup-future-aware-harness.sh --restore` per `tooling/future-aware-harness/README.md:55-57`).

**SWE concern: "Would the verbatim commands work if a Sonnet-class executor ran them cold?"**
The bash scripts in §6.11-§6.13 are written to be run cold. Each uses `set -euo pipefail`, defines its variables with explicit names, has guard clauses, and uses well-known tools (`git`, `yq`, `sha256sum`, `bash`). The `claude -p` invocation is a bit denser; the flag set is documented in §6.11 with rationale per flag.

**SWE concern: "The PR will be 8-13 commits. Is a 13-commit PR reviewable?"**
For the pilot (8 commits), yes. For Phase 3.2 (~13), yes but unwieldy. The plan's UNCERTAINTY-U10 / §3.5 cost-flag names this for the next pilot; the per-`/goal`-branch contract may need refinement (e.g., per-plan branches inside a per-pilot epic) before the second run.

### 14.2 What the senior AI systems engineers will scrutinize, and how the plan answers it

**AI sys eng concern: "Is state file-mediated with explicit invariants?"**
`.planning/auto-execution/STATE.md` is YAML-frontmatter parseable; the schema is in §6.4. Updates are atomic (write-temp-then-rename per R14). Bootstrap self-check verifies the file parses and the loop_state is not paused/escalated before advancing. The audit gate parses the latest `AUDIT-task-N-*.md` frontmatter, never trusts exit codes.

**AI sys eng concern: "Bounded retry semantics?"**
3 retries per task (per `EXECUTION-MODEL.md`); after retry 3, escalate. Audit `error` status escalates immediately (no retry).

**AI sys eng concern: "HARD-STOP escalation paths?"**
Per §6.5 stop conditions S1-S10. Each writes an explicit escalation file. The loop halts and waits; it does not silently continue.

**AI sys eng concern: "How is context-window pressure handled across sessions?"**
SESSION-END protocol (per §6.6 driver pseudocode): writes SESSION-SUMMARY with active task, subtask boundary, git SHA, and pending state. SESSION-RESUME on next launch verifies SHA matches; mismatch → HARD STOP. UNCERTAINTY-U1 names that the codex `/goal` feature's actual lifecycle may differ from this design; the recovery is to validate at gate 1 with a throwaway prompt.

**AI sys eng concern: "What counts as a done-signal vs what looks like one?"**
Done-signal table (§10). Audit gate parses `status: pass` from the audit response, not a model's free-form claim of "task done." Only `status: pass` advances the loop. The audit gate's diff_sha post-check (§7.5) ensures the auditor saw what the executor produced.

**AI sys eng concern: "Is cross-model audit independence structural or only nominal?"**
Structural; §7.2 enumerates seven dimensions (different runtime, different model family, different process tree, different input, different tools, different working memory, output uncontaminated by post-execution git-log check). The plan-agent agreed on the input-layer independence and pressed on the judgment-layer; §7.2 mitigations 1-3 (negative-find prompt, canary at task 5, human spot-check at task 3) address the judgment layer.

**AI sys eng concern: "Prompt-injection and guardrail-laundering risks when the loop reads user-controlled markdown?"**
The autonomous loop reads only files under `.planning/`, `apps/`, `packages/`, `tooling/`, and `scripts/` — files that are git-tracked and human-reviewable. The audit gate's `--bare` flag strips auto-loaded memory and CLAUDE.md auto-discovery, so a hostile CLAUDE.md edit cannot directly manipulate the auditor's behavior. Hard rule R1's tripwire check protects the doctrine layer (CLAUDE.md is not strictly a tripwire because INT-19 task explicitly modifies it; the audit gate verifies the diff is only the documented architecture-drift fix, not an injection-style modification).

**AI sys eng concern: "Observability — can a human reconstruct what the loop did from the artifacts alone?"**
Yes. `agent-events.jsonl` (append-only, with `commit_sha` per event), per-task audit responses (with `diff_sha`), per-session SESSION-SUMMARY, per-checkpoint CHECKPOINT-*, per-escalation ESCALATION-*. Plus git history (8 conventional commits, one per task). A reader with no model in the loop can answer: what tasks ran, in what order, with what audits, with what verdict, with what file changes.

### 14.3 What the F1 engineers will scrutinize, and how the plan answers it

**F1 engineer concern: "Does this preserve engineer-grade honesty about model fidelity?"**
The pilot does not touch fidelity-bearing surfaces (sim-core, run records, visualizations beyond the error boundary at app root). Hard rule R2 is the doctrinal commitment for *future* pilots; the audit gate's R2 check is the mechanical instantiation. The pilot leaves the existing fidelity layer (Zod-validated run records, deepFreeze, `kind: "engineering-inference"` provenance per audit `D.1`) entirely intact.

**F1 engineer concern: "Does it protect against the simulator becoming convincing for the wrong reasons?"**
R2 specifically asks the auditor to "Identify any change that newly implies fidelity, validation, or comparability that the underlying artifact does not actually carry." The pilot does not exercise this check (no fidelity surfaces touched), but the structure is loaded for the next pilot. The audit's `D.2` flagged the `RunSummaryPanel.tsx` race-simulation silent-fallthrough as exactly this kind of issue; the plan does not fix it (out of scope) but the autonomous loop's R2 check is designed to catch the *next* such regression before it ships.

**F1 engineer concern: "Does the regulation-family abstraction remain genuine across eras?"**
R3 forbids 2026 hardcoding in runtime paths. The pilot does not touch any regulation runtime code. The audit gate's R3 check is loaded for the next pilot, particularly Phase 3.2's 03.2-05 plan ("Compile canonical regulation data into execution snapshots and remove raw-preset and hardcoded runtime assumptions") — a future Codex `/goal` running that plan will be checked against R3 mechanically.

**F1 engineer concern: "Does the layered modeling stack (plant+sensor → observer → MPC → later RL) keep its ordering discipline?"**
R4 forbids out-of-order stack-layer additions. The pilot does not touch sim-core. Future pilots that touch Phase 4.1 (observer), Phase 5 (control), or any RL work will be checked against R4. The audit gate's prompt for any sim-core or apps/web change includes the R4 check.

**F1 engineer concern: "Does the visualization layer remain a faithful surface for what the math actually says, with provenance visible?"**
R5 (legacy renderer freeze) and R2 (fidelity honesty) together cover this. The pilot's INT-20 (error boundary at app root) is outside the freeze zone and cannot regress visualization fidelity. Future pilots touching `packages/visuals/` will be checked against R5 (no new SVG features in frozen panels) and R2 (any new fidelity-bearing surface must surface fidelity visibly).

**F1 engineer concern: "If your `/goal` infrastructure lets an autonomous agent silently violate any of those, the F1 engineer on the panel will object loudly, and your software-engineer colleagues should already have caught it."**
The audit gate is the structural backstop. R1-R15 are the rules; R2/R3/R4/R5 are the F1-domain rules. Each has a mechanical check. The audit gate fires per task. The CI's `audit-evidence` job blocks merge if any commit lacks an audit. Branch protection blocks merge if CI is red. The human at gate 3 sees the whole PR plus all 8 audits plus CI plus the diff. The human is the final structural gate.

The honest acknowledgement: the F1-domain rules R2-R4 are *not exercised by the pilot scope*. They are pre-loaded for the next pilot. The panel may correctly object that "you have not actually proven the audit gate catches an F1-domain violation." The mitigation: the canary at task 5 (§7.2) is a *generic* canary (a copy-paste duplication in CLAUDE.md), not an F1-domain canary. A future pilot that touches sim-core should add an F1-domain canary at the equivalent slot. The plan acknowledges the gap and recommends it as the first refinement before the second pilot.

### 14.4 The most likely objection from each persona, named honestly

| Persona | Most likely objection | This plan's honest response |
|---|---|---|
| Senior SWE | "13-commit auto-PRs do not scale to Phase 3.2." | Acknowledged, UNCERTAINTY-U10. Per-`/goal`-branch contract refinement before the next pilot. |
| Senior AI sys eng | "Auditor silent agreement is not fully solved by one canary at task 5." | Acknowledged. The plan mitigates with three layers (negative-find prompt, canary, spot-check) but the panel is right that one canary is the minimum, not the maximum. The first pilot's debrief should add F1-domain canaries. |
| F1 engineer | "R2-R5 are not exercised by the pilot. You haven't proven anything about F1-domain protection." | Acknowledged. The pilot's purpose is to prove the *infrastructure*; R2-R5 enforcement is the next pilot's burden. The plan does not pretend otherwise. |

### 14.5 Plan-agent observation the panel might miss

The plan-agent observation that the F1 engineer is silent on autonomous-loop architecture is structurally correct. The audit's #1 finding (doctrine-vs-enforcement) is SWE territory. The cross-runtime independence question is AI-sys-eng territory. The regulation-honesty question is F1 territory. The personas do not overlap, and the plan should not pretend they do.

The plan-agent's recommendation to swap F1 engineer for release engineer is a panel-composition argument, not a plan-content argument. This plan does not adopt it; the originating prompt names the F1 engineer explicitly and the F1 engineer's value is at the rule-design level (R2-R5) even if not at the infrastructure-design level. Future pilots that touch sim-core / regulation will exercise the F1-engineer's review surface; this pilot does not.

---

## End notes

Word/line count discipline: the plan is substantial because the panel is reading it. Sharper choices and tighter preconditions would produce a shorter document; this draft is closer to 2000 lines than 1500 because every hard rule and every script gets verbatim content the executor can run cold.

The plan is for a **first** pilot. The second pilot's plan will be shorter because this plan establishes the conventions; it will not need to re-defend the audit-gate mechanism, the test-anchor convention, the FAPH coexistence model, or the scaffold layout. It will need to defend the *new* scope (likely Phase 3.2 or a chunk of it) and any refinements (per-plan sub-branches, F1-domain canaries, ESLint integration).

Recommended final placement: `.planning/initiatives/autonomous-goal-pilot-2026-05/PLAN.md`. The plans directory `/home/rookslog/.claude/plans/prompt-design-the-hazy-cocoa.md` is the plan-mode artifact; the user is expected to copy this content to the recommended location and commit it as the initiative's PLAN.md after approval.
