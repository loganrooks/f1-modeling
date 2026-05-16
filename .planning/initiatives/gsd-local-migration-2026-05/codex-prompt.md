---
document: CODEX-PROMPT
status: ready-to-delegate
type: migration-task-prompt
created: 2026-05-16
purpose: Brief Codex to migrate GSD-1 v1.42.2 from user-level to repo-local install
target_executor: Codex CLI (any recent model, gpt-5.4 preferred)
expected_runtime: ~30-60 min
---

# Codex Task — Migrate GSD-1 from User-Level (Global) to Repo-Local Install

## Who is asking, and why

You are being delegated to by a parallel Claude session working with the user (a philosophy PhD student with a robotics-engineering background, building the F1 Modeling Lab as a research/learning tool). The Claude session is busy stewarding active phase planning. This GSD migration is **parallel work** the user explicitly asked Claude to delegate to you so both tracks can move at once.

**The goal:** install GSD-1 v1.42.2 locally inside the f1-modeling repo at `./.claude/get-shit-done/` so that long-arc-aware patches (custom planner/checker logic that enforces this repo's doctrine — Vision Impact / Vision Alignment Checkpoint / Honesty Surface headers) can be committed alongside the repo. Today, GSD lives in `~/.claude/` (user scope) so any patch is invisible to the repo.

**The user's own words:** *"this is why I wanted a local gsd installation not a user level, so we could have patched it to support the long-arc stuff."*

This task does NOT include writing those patches. Land the local install on a branch, open a PR, stop.

## Repo and environment

- Repo: `/home/rookslog/workspace/projects/f1-modeling` (TypeScript monorepo, npm workspaces, branch `main`).
- Workstation: dionysus (Ubuntu 24.04, Tailscale-accessible).
- Current GSD install: `~/.claude/get-shit-done/` v1.42.2 (verify with `cat ~/.claude/get-shit-done/VERSION`).
- Current install scope: GLOBAL (per the `update.md` detection logic at lines 178-256 — local takes precedence when both exist and validate).
- Active work-in-flight: a separate Claude session is running `/gsd:execute-phase 3.2 --auto` on `main` against the 5 plans in `.planning/phases/03.2-.../`. Your work MUST sit on a feature branch and MUST NOT merge to `main` without user review.

## Read these before acting

In order:

1. `/home/rookslog/workspace/projects/f1-modeling/CLAUDE.md` — repo doctrine, quality gates, planning expectations.
2. `/home/rookslog/workspace/projects/f1-modeling/.planning/HANDOFF-2026-05-15-phase-3.2.md` — what the parallel session is doing; the "Parallel work in the originating session" section names you.
3. `/home/rookslog/workspace/projects/f1-modeling/.planning/STATE.md` — read the "GSD Ecosystem Pivot (2026-05-15)" section under Blockers/Concerns. Context on why GSDR was rolled back and mainline GSD-1 reinstated.
4. `~/.claude/get-shit-done/workflows/update.md` lines 178-256 (scope detection) and lines 517-536 (install command per scope). This is the canonical reference for how the toolchain itself decides local-vs-global.
5. `~/.claude/get-shit-done/VERSION` — confirm `1.42.2` matches what your install produces.

## Current install layout (for comparison)

The user-level install at `~/.claude/get-shit-done/` contains:

```
VERSION              # plain text, e.g. "1.42.2"
bin/                 # check-latest-version.cjs, gsd-tools.cjs, lib/, shared/
contexts/            # dev.md, research.md, review.md
references/          # agent-contracts.md, artifact-types.md, ... (many)
templates/           # AI-SPEC.md, DEBUG.md, SECURITY.md, claude-md.md, ...
workflows/           # add-backlog.md, plan-phase.md, execute-phase.md, ... (many)
```

The associated subagents live separately at `~/.claude/agents/gsd-*.md` (NOT inside `get-shit-done/`). Commands live at `~/.claude/commands/`. Surviving GSDR commands at `~/.claude/commands/gsdr/`.

A `--local` install should mirror the package tree at `./.claude/get-shit-done/` and likely also drop agents and commands under `./.claude/agents/gsd-*.md` and `./.claude/commands/gsd*.md`. **Verify this empirically** — do not assume.

## Approach

### Phase 1 — Investigate (read-only, ~10 min)

1. `cd /home/rookslog/workspace/projects/f1-modeling`
2. Confirm clean tree on `main`: `git status` should show nothing dirty except possibly `.planning/measurement/session-meta-postlude/session-meta-postlude.jsonl` (telemetry, leave alone).
3. Run `npx -y --package=get-shit-done-cc@latest -- get-shit-done-cc --help` and capture the output. Identify the exact flags. Confirm `--claude` and `--local` are supported.
4. Read `~/.claude/get-shit-done/workflows/update.md` lines 442-535. Note the canonical install command for LOCAL scope:
   ```bash
   npx -y --package=get-shit-done-cc@latest -- get-shit-done-cc --claude --local
   ```
5. Tabulate the expected files the installer will create (or modify) in the repo. Reasoned guess:
   - `./.claude/get-shit-done/` (package tree, mirror of global)
   - `./.claude/agents/gsd-*.md` (subagent definitions)
   - `./.claude/commands/gsd*.md` (slash command registrations)
   - Possibly `./.claude/settings.json` or `./.claude/settings.local.json`
   - Possibly `.gitignore` entries

### Phase 2 — Branch and migrate

1. Create branch: `git checkout -b chore/gsd-local-install-2026-05`
2. Run installer:
   ```bash
   npx -y --package=get-shit-done-cc@latest -- get-shit-done-cc --claude --local
   ```
   Capture full stdout/stderr.
3. Run `git status` and review the diff. Confirm:
   - Only paths under `./.claude/` were created or modified (plus maybe `.gitignore`).
   - No paths under `~/.claude/` were touched.
   - No paths under `apps/`, `packages/`, `presets/`, `workspace-data/`, `CLAUDE.md`, or `.planning/` were touched.
4. Verify version match: `cat ./.claude/get-shit-done/VERSION` should equal `1.42.2`. If the installer pulls a newer version, stop and surface — the user has not authorized a version upgrade as part of this migration.
5. Inspect `./.claude/settings.json` or `./.claude/settings.local.json` if either was created. The user-level `~/.claude/settings.json` already provides session-state and update-check hooks (the project-level file should NOT duplicate them). Trim any duplicates introduced by the installer.
6. Update `.gitignore` if the installer creates caches, locks, or state files that should not be committed. Reasonable candidates: `./.claude/get-shit-done/.cache/`, `./.claude/settings.local.json`, `./.claude/get-shit-done/state/`. **Only ignore what is actually created and clearly machine-local.** Do not preemptively ignore the install tree itself.

### Phase 3 — Commit in coherent chunks

Use Conventional Commits style. Pass commit messages via HEREDOC. Do NOT skip hooks; do NOT amend if a hook fails (create a new commit).

Suggested staging:

```
chore(gsd): install GSD-1 v1.42.2 to ./.claude/ for repo-local toolchain

Mirrors the user-level GSD install into the repo so long-arc-aware
patches (planner/checker enforcing CLAUDE.md doctrine headers) can be
committed alongside repo code rather than living invisibly at ~/.claude/.

Installer: npx -y --package=get-shit-done-cc@latest -- get-shit-done-cc --claude --local
Version:   1.42.2 (matches the prior user-level install)
Scope:     LOCAL (takes precedence over GLOBAL per workflows/update.md:178-190)
```

If the installer also created project-scoped settings or registered agents/commands:

```
chore(gsd): register local-scope agents and commands
```

If `.gitignore` changed:

```
chore(gsd): ignore machine-local GSD state
```

Keep each commit focused. If the installer drops everything in one shot and there is no clean way to split, a single commit is acceptable — note that in the body.

### Phase 4 — Verify

Run from repo root (`/home/rookslog/workspace/projects/f1-modeling`):

1. **Install integrity:**
   - `test -f ./.claude/get-shit-done/VERSION && cat ./.claude/get-shit-done/VERSION`
   - `test -f ./.claude/get-shit-done/workflows/update.md` (the precedence-detector marker file)
   - `ls ./.claude/get-shit-done/workflows/ | wc -l` — expect a non-trivial count (>30).
2. **Precedence sanity:** the `update.md` detection at lines 178-190 requires both `VERSION` and `workflows/update.md` to count a directory as a valid GSD install. Confirm both present.
3. **No regression in the product code:**
   - `npm run typecheck` at root
   - `npm test` at root
   - `npm run build` at root
   All three must pass. If any fail and the failure is correlated with the migration, stop and surface — the user has strict quality gates (see CLAUDE.md § Quality Gates).
4. **No user-scope contamination:** `ls -la ~/.claude/get-shit-done/` — confirm it still exists, untouched (same mtime / file count as before).
5. **GSDR add-ons preserved:** the four surviving GSDR commands (`/gsdr:deliberate`, `/gsdr:signal`, `/gsdr:reflect`, `/gsdr:collect-signals`) live at `~/.claude/commands/gsdr/` and must remain unaffected. They are user-scope cross-project utilities; do not localize them.
6. **Clean tree:** `git status` should show only intended files on the branch.

### Phase 5 — Hand back

1. Push the branch: `git push -u origin chore/gsd-local-install-2026-05` (only if the repo has a remote; if not, leave it local).
2. If pushed: open a draft PR titled `chore(gsd): migrate GSD-1 to repo-local install`. Body must include:
   - **Approach taken** — A (installer with `--local`) or B (fallback manual copy), with rationale.
   - **Files added/modified** — `tree -L 3 .claude/` output (or `git diff --stat main`).
   - **Verification log** — pass/fail of each step in Phase 4.
   - **Any deviations** from this prompt.
   - **Mark as Draft.** Do not merge.
3. If no remote, write a `.planning/initiatives/gsd-local-migration-2026-05/OUTCOME.md` containing the same information.
4. Stop. Long-arc-aware patches land in a subsequent PR by the user.

## Stop-and-ask conditions (surface, do not proceed)

- The installer wants to modify `~/.claude/statusline.sh`, `~/.claude/settings.json`, or any other user-scope file. **The custom statusline in particular is sacred — never touch.**
- The installer pulls a version other than `1.42.2`.
- The installer drops files outside `./.claude/` (e.g., into `node_modules/`, repo-root `package.json`, or anywhere else in the repo).
- `npm run typecheck` / `npm test` / `npm run build` fails after the migration in ways correlated with the install. (Pre-existing failures unrelated to the migration are not a blocker — note them.)
- The installer does not support a `--local` flag at all.
- `.planning/` files appear in your diff. (Active in the parallel session.)
- You are unsure whether a created file is repo-scope or machine-local.

## Out of scope (do not do these)

- Writing the long-arc-aware patches to planner/checker (subsequent PR).
- Touching the surviving GSDR add-ons (`gsdr:deliberate`, `gsdr:signal`, `gsdr:reflect`, `gsdr:collect-signals`).
- Modifying `.planning/config.json` orphan fields (`gsd_reflect_version`, `runtime.agent_overrides` referencing pruned agents) — deferred per the handoff doc.
- Removing or downgrading the user-level install at `~/.claude/get-shit-done/`. Keep as fallback for other projects.
- Touching `~/.claude/settings.json` — already de-duplicated 2026-05-15.
- Touching the user's auto-memory directory at `~/.claude/projects/-home-rookslog-workspace-projects-f1-modeling/memory/`.
- Anything in `.planning/` (active in the parallel Claude session).
- Force-pushing. Skipping hooks. Amending commits. Resetting hard.

## Success criteria

- `./.claude/get-shit-done/` exists with v1.42.2 contents, structurally complete (VERSION + workflows/update.md both present).
- A coherent, reviewable, **unmerged** PR (or OUTCOME.md if no remote) is ready for the user.
- Repo typecheck/test/build still green.
- No user-scope files were modified.
- The parallel Claude session running `/gsd:execute-phase 3.2 --auto` on `main` is unaffected (your work sits on a branch).

## Branch hygiene reminder

Per the user's global doctrine: branch name must equal work unit. `chore/gsd-local-install-2026-05` is fine. If you find yourself doing anything beyond installing GSD locally, stop — that work belongs on a different branch.

## When in doubt

The user has explicitly told the Claude orchestrator: *"work without stopping for clarifying questions; make the reasonable call and continue."* Apply that here too — but the "stop-and-ask conditions" above are the exceptions where stopping IS the reasonable call. Use judgment.
