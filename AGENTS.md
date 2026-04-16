# Planning Routing

This file is the narrow repo-root runtime entrypoint. For planning work, read:

1. `.planning/AGENTS.md`
2. `.planning/STATE.md`
3. `.planning/LONG-ARC.md`
4. `.planning/PROJECT.md`
5. `.planning/ROADMAP.md`
6. `.planning/TECH-DEBT.md`
7. the active phase or initiative files named by `.planning/STATE.md` and the current task

If the current phase directory has not been scaffolded yet, fall back to the live initiative, review, or spec files that established the current planning obligation.

`WORKFLOW.md` defines the operating procedure. `.planning/ARTIFACT-GOVERNANCE.md` defines artifact roles, authority boundaries, and supersession.

Do not treat this root file as the place for detailed planning doctrine. It routes planning work into `.planning/AGENTS.md` and the `.planning/` doctrine stack above.

<!-- GSD:BEGIN (get-shit-done-reflect-cc) -->
# GSD Workflow System

GSD (Get Shit Done) is installed as Codex skills for structured project planning and execution.

## Available Commands

Use `/skills` or type `$gsdr-` to discover GSD commands:

| Command | Purpose |
|---------|---------|
| `$gsdr-help` | Show all commands and usage |
| `$gsdr-new-project` | Initialize a new project |
| `$gsdr-plan-phase` | Plan a project phase |
| `$gsdr-execute-phase` | Execute a planned phase |
| `$gsdr-resume-work` | Resume from last session |
| `$gsdr-pause-work` | Save state for later |
| `$gsdr-progress` | Show project progress |
| `$gsdr-signal` | Record a signal (insight, mistake, etc.) |

## Workflow Conventions

- All project state lives in `.planning/` (git-committed, runtime-agnostic)
- Follow existing ROADMAP.md phases in order
- Verify each task before marking complete
- Use atomic git commits per completed task
- Read `~/.gsd/knowledge/index.md` before starting work for relevant lessons

## Runtime Capabilities

This runtime differs from Claude Code in a few important ways:
- **Task tool support is available via Codex subagents/threads** -- Codex can delegate bounded subtasks and run them in parallel, but the control surface differs from Claude's `Task()`-style spawning. Some GSD workflows may still fall back to sequential execution until they are adapted to Codex-native delegation patterns.
- **No hooks support** -- pre-commit hooks and other lifecycle hooks are unavailable in Codex
- **No tool restrictions** -- Codex does not support allowed-tools filtering, so all tools are always available to skills

For full runtime comparison, read the file at `$HOME/.codex/get-shit-done-reflect/references/capability-matrix.md`.

## Non-interactive Usage (codex exec)

For scripted or CI environments, use `codex exec` to run GSD skills non-interactively:

```
codex exec "Run $gsdr-progress to show current project status"
codex exec "Run $gsdr-execute-phase 3"
```

This bypasses the interactive prompt and executes directly.
<!-- GSD:END (get-shit-done-reflect-cc) -->
