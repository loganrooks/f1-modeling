<purpose>
Check project progress, summarize recent work and what's ahead, then intelligently route to the next action. The routing digest in `STATE.md` should stay visible before any next-step recommendation.
</purpose>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.
</required_reading>

<process>

<step name="init_context">
**Load progress context (with file contents to avoid redundant reads):**

```bash
INIT=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs init progress --include state,roadmap,project,config)
```

Extract from init JSON:
- `project_exists`
- `roadmap_exists`
- `state_exists`
- `phases`
- `current_phase`
- `next_phase`
- `milestone_version`
- `completed_count`
- `phase_count`
- `paused_at`

**File contents (from `--include`):**
- `state_content`
- `roadmap_content`
- `project_content`
- `config_content`

If `project_exists` is false:

```text
No planning structure found.

Run $gsdr-new-project to start a new project.
```

Exit.

If missing `STATE.md`: suggest `$gsdr-new-project`.

If `ROADMAP.md` is missing but `PROJECT.md` exists:
- this means a milestone was completed and archived
- go to **Route F**

If missing both `ROADMAP.md` and `PROJECT.md`: suggest `$gsdr-new-project`.
</step>

<step name="load">
**Use project context from INIT:**

All file contents are already loaded via `--include` in `init_context`:
- `state_content` — routing memory and session continuity
- `roadmap_content` — phase structure and objectives
- `project_content` — what this project is and why it exists
- `config_content` — model profile and workflow toggles

No additional file reads are needed for these files.
</step>

<step name="analyze_roadmap">
**Get comprehensive roadmap analysis (replaces manual parsing):**

```bash
ROADMAP=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs roadmap analyze)
```

Use this for:
- all phases with disk status
- goal and dependencies per phase
- plan and summary counts per phase
- aggregated stats
- current and next phase identification
- current phase `has_context` and `has_research` flags
</step>

<step name="recent">
**Gather recent work context:**

- Find the 2-3 most recent `SUMMARY.md` files
- Use `summary-extract` for efficient parsing:

  ```bash
  node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs summary-extract <path> --fields one_liner
  ```

- Use this to summarize what changed recently
</step>

<step name="position">
**Parse current position from init context and roadmap analysis:**

- use `current_phase` and `next_phase`
- use the phase-level `has_context` and `has_research` flags
- note `paused_at` if work was paused
- count pending todos with `init todos` or `list-todos`
- check for active debug sessions:

  ```bash
  (ls .planning/debug/*.md 2>/dev/null || true) | grep -v resolved | wc -l
  ```

**Parse the routing digest from `state_content` when present:**

- `Active Doctrine Refs`
- `Active Tech-Debt Ids`
- `Active Carry-Forward`
- `Reduced-Guarantee Status`

Treat the `Routing Digest` section as authoritative when it exists.

If the state file is still legacy-shaped and no digest exists:
- say that the digest is not yet present
- do not invent extra doctrine or debt pointers from other files inside this workflow
- treat reduced-guarantee status as unknown unless it is stated explicitly in `STATE.md`

Do not read `CONTEXT.md` directly in this workflow. Routing stays state-driven in this wave.
</step>

<step name="report">
**Generate the progress bar, then present a compact status report:**

```bash
PROGRESS_BAR=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs progress bar --raw)
```

Present:

```text
# [Project Name]

**Progress:** {PROGRESS_BAR}
**Profile:** [quality/balanced/budget]

## Recent Work
- [Phase X, Plan Y]: [one-line accomplishment]
- [Phase X, Plan Z]: [one-line accomplishment]

## Current Position
Phase [N] of [total]: [phase-name]
Plan [M] of [phase-total]: [status]
CONTEXT: [✓ if has_context | - if not]

## Routing Digest
- Doctrine refs: [paths or "none recorded"]
- Tech-debt ids: [ids or "none recorded"]
- Carry-forward: [items or "none active"]
- Reduced-guarantee: [status]

## Key Decisions Made
- [decision pointer 1]
- [decision pointer 2]

## Blockers/Concerns
- [active blocker 1]
- [active blocker 2]

## Pending Todos
- [count] pending — $gsdr-check-todos to review

## Active Debug Sessions
- [count] active — $gsdr-debug to continue
(Show only if count > 0)

## What's Next
[Next phase/plan objective from roadmap analyze]
```

If reduced-guarantee planning is active, add a short caution block before routing:

```text
## Caution
Reduced-guarantee planning is still active. Route back to $gsdr-discuss-phase or a full-context $gsdr-plan-phase before more execution when possible.
```
</step>

<step name="route">
**Determine next action based on verified counts.**

Before the standard count-based routing, check `Reduced-Guarantee Status` from `STATE.md`.

If reduced-guarantee planning is still active:
- keep the caution visible
- do not silently route straight to execution
- use the current phase `has_context` flag only; do not parse `CONTEXT.md`

**Route RG1: Reduced-guarantee planning active, no current context**

```text
---

## ⚠ Reduced-Guarantee Planning Active

The current phase is still carrying reduced-guarantee planning status and has no full `CONTEXT.md`.

## ▶ Next Up

**Phase {N}: {Name}** — restore the full-context path before more execution

`$gsdr-discuss-phase {phase}`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-plan-phase {phase}` — if you already have the needed context in mind
- `$gsdr-execute-phase {phase}` — continue only if you are intentionally accepting the caution state

---
```

Stop after presenting this route.

**Route RG2: Reduced-guarantee planning active, context exists**

```text
---

## ⚠ Reduced-Guarantee Planning Active

The current phase is still carrying reduced-guarantee planning status. Clear it with a full-context replan before more execution when possible.

## ▶ Next Up

**Phase {N}: {Name}** — replan against the current context and digest

`$gsdr-plan-phase {phase}`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-discuss-phase {phase}` — refresh the context first
- `$gsdr-execute-phase {phase}` — continue only if you are intentionally accepting the caution state

---
```

Stop after presenting this route.

If reduced-guarantee planning is not active, continue with the standard routing below.

**Step 1: Count plans, summaries, and issues in current phase**

```bash
(ls -1 .planning/phases/[current-phase-dir]/*-PLAN.md 2>/dev/null || true) | wc -l
(ls -1 .planning/phases/[current-phase-dir]/*-SUMMARY.md 2>/dev/null || true) | wc -l
(ls -1 .planning/phases/[current-phase-dir]/*-UAT.md 2>/dev/null || true) | wc -l
```

State:

```text
This phase has {X} plans, {Y} summaries.
```

**Step 1.5: Check for unaddressed UAT gaps**

```bash
grep -l "status: diagnosed\|status: partial" .planning/phases/[current-phase-dir]/*-UAT.md 2>/dev/null || true
```

Track:
- `uat_with_gaps` — UAT files with gaps that need fix plans

**Step 2: Route based on counts**

| Condition | Meaning | Action |
|-----------|---------|--------|
| `uat_with_gaps > 0` | UAT gaps need fix plans | Go to **Route E** |
| `summaries < plans` | Unexecuted plans exist | Go to **Route A** |
| `summaries = plans AND plans > 0` | Phase complete | Go to Step 3 |
| `plans = 0` | Phase not yet planned | Go to **Route B** |

**Route A: Unexecuted plan exists**

Find the first `PLAN.md` without a matching `SUMMARY.md`.
Read its `<objective>` section.

```text
---

## ▶ Next Up

**{phase}-{plan}: [Plan Name]** — [objective summary from PLAN.md]

`$gsdr-execute-phase {phase}`

<sub>`/clear` first → fresh context window</sub>

---
```

**Route B: Phase needs planning**

Check if `{phase}-CONTEXT.md` exists in the phase directory.

If `CONTEXT.md` exists:

```text
---

## ▶ Next Up

**Phase {N}: {Name}** — {Goal from ROADMAP.md}
<sub>✓ Context gathered, ready to plan</sub>

`$gsdr-plan-phase {phase-number}`

<sub>`/clear` first → fresh context window</sub>

---
```

If `CONTEXT.md` does not exist:

```text
---

## ▶ Next Up

**Phase {N}: {Name}** — {Goal from ROADMAP.md}

`$gsdr-discuss-phase {phase}` — gather context and clarify approach

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-plan-phase {phase}` — skip discussion, plan directly
- `$gsdr-list-phase-assumptions {phase}` — inspect assumptions before planning

---
```

**Route E: UAT gaps need fix plans**

```text
---

## ⚠ UAT Gaps Found

**{phase}-UAT.md** has {N} gaps requiring fixes.

`$gsdr-plan-phase {phase} --gaps`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-execute-phase {phase}` — execute existing plans
- `$gsdr-verify-work {phase}` — run more UAT testing

---
```

**Step 3: Check milestone status (only when phase complete)**

Read `ROADMAP.md` and identify:
1. current phase number
2. all phase numbers in the current milestone section

Count total phases and identify the highest phase number.

State:

```text
Current phase is {X}. Milestone has {N} phases (highest: {Y}).
```

| Condition | Meaning | Action |
|-----------|---------|--------|
| `current phase < highest phase` | More phases remain | Go to **Route C** |
| `current phase = highest phase` | Milestone complete | Go to **Route D** |

**Route C: Phase complete, more phases remain**

```text
---

## ✓ Phase {Z} Complete

## ▶ Next Up

**Phase {Z+1}: {Name}** — {Goal from ROADMAP.md}

`$gsdr-discuss-phase {Z+1}` — gather context and clarify approach

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-plan-phase {Z+1}` — skip discussion, plan directly
- `$gsdr-verify-work {Z}` — user acceptance test before continuing

---
```

**Route D: Milestone complete**

```text
---

## 🎉 Milestone Complete

All {N} phases finished.

## ▶ Next Up

**Complete Milestone** — archive and prepare for next

`$gsdr-complete-milestone`

<sub>`/clear` first → fresh context window</sub>

---

**Also available:**
- `$gsdr-verify-work` — user acceptance test before completing the milestone

---
```

**Route F: Between milestones (`ROADMAP.md` missing, `PROJECT.md` exists)**

Read `MILESTONES.md` to find the last completed milestone version.

```text
---

## ✓ Milestone v{X.Y} Complete

Ready to plan the next milestone.

## ▶ Next Up

**Start Next Milestone** — questioning → research → requirements → roadmap

`$gsdr-new-milestone`

<sub>`/clear` first → fresh context window</sub>

---
```
</step>

<step name="edge_cases">
**Handle edge cases:**

- Phase complete but next phase not planned → offer `$gsdr-plan-phase [next]`
- All work complete → offer milestone completion
- Blockers present → highlight before offering to continue
- Handoff file exists → mention it and offer `$gsdr-resume-work`
</step>

</process>

<success_criteria>

- [ ] Rich context provided (recent work, decisions, issues)
- [ ] Current position clear with visual progress
- [ ] Routing digest surfaced before next-action recommendation
- [ ] Reduced-guarantee planning, when active, routes to discuss/replan instead of staying silent
- [ ] Smart routing still distinguishes execute, plan, discuss, and milestone transitions
- [ ] User confirms before any action

</success_criteria>
