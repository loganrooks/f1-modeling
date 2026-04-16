<trigger>
Use this workflow when:
- starting a new session on an existing project
- the user says "continue", "what's next", "where were we", or "resume"
- any planning operation when `.planning/` already exists
- the user returns after time away from the project
</trigger>

<purpose>
Instantly restore project context so "Where were we?" has an immediate answer, with the `STATE.md` routing digest kept visible before offering next actions.
</purpose>

<required_reading>
@$HOME/.codex/get-shit-done-reflect/references/continuation-format.md
</required_reading>

<process>

<step name="initialize">
Load all context in one call:

```bash
INIT=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs init resume)
```

Parse JSON for:
- `state_exists`
- `roadmap_exists`
- `project_exists`
- `planning_exists`
- `has_interrupted_agent`
- `interrupted_agent_id`
- `commit_docs`
- `dual_install`

If `state_exists` is true:
- proceed to `load_state`

If `state_exists` is false but `roadmap_exists` or `project_exists` is true:
- offer to reconstruct `STATE.md`

If `planning_exists` is false:
- this is a new project
- route to `$gsdr-new-project`
</step>

<step name="detect_runtime">
Detect which runtime this workflow is executing in by examining the path prefix used in this file.

Runtime detection from path prefix:
- `~/.claude/` paths -> Claude Code (command prefix: `/gsdr:`)
- `~/.config/opencode/` paths -> OpenCode (command prefix: `/gsdr-`)
- `~/.gemini/` paths -> Gemini CLI (command prefix: `/gsdr:`)
- `~/.codex/` paths -> Codex CLI (command prefix: `$gsdr-`)

Store the detected command prefix for use when rendering command suggestions.
</step>

<step name="load_state">
Read and parse `STATE.md`, then `PROJECT.md`:

```bash
cat .planning/STATE.md
cat .planning/PROJECT.md
```

From `STATE.md` extract:
- **Project Reference** — core value and current focus
- **Current Position** — phase, plan, status, progress
- **Routing Digest** — active doctrine refs, active tech-debt ids, active carry-forward items, reduced-guarantee status
- **Decision Pointers**
- **Pending Todos**
- **Blockers/Concerns**
- **Session Continuity**

Treat the `Routing Digest` as authoritative when it exists.

If the state file is still legacy-shaped and has no routing digest:
- say so
- do not invent doctrine or debt pointers from other files in this workflow
- treat reduced-guarantee status as unknown unless it is explicit in `STATE.md`

From `PROJECT.md` extract:
- **What This Is**
- **Requirements**
- **Key Decisions**
- **Constraints**
</step>

<step name="check_incomplete_work">
Look for incomplete work that needs attention:

```bash
cat .planning/HANDOFF.json 2>/dev/null || true
ls .planning/phases/*/.continue-here*.md 2>/dev/null || true
ls .planning/.continue-here.md 2>/dev/null || true

for plan in .planning/phases/*/*-PLAN.md; do
  [ -e "$plan" ] || continue
  summary="${plan/PLAN/SUMMARY}"
  [ ! -f "$summary" ] && echo "Incomplete: $plan"
done 2>/dev/null || true

if [ "$has_interrupted_agent" = "true" ]; then
  echo "Interrupted agent: $interrupted_agent_id"
fi
```

If a `.continue-here` file exists:
- read it for specific resumption context
- if `<next_action>` already contains command syntax, display it as-is for context
- flag: `Found mid-plan checkpoint`

If a `PLAN.md` exists without a matching `SUMMARY.md`:
- flag: `Found incomplete plan execution`

If an interrupted agent is found:
- read `agent-history.json` for task details
- flag: `Found interrupted agent`

After loading `.continue-here` context, delete the file:

```bash
rm -f "$CONTINUE_HERE_PATH"
```

Do not read `CONTEXT.md` directly in this workflow. Routing in this wave should use the state digest plus lightweight context-existence checks only.
</step>

<step name="present_status">
Present complete project status to the user:

```text
╔══════════════════════════════════════════════════════════════╗
║  PROJECT STATUS                                             ║
╠══════════════════════════════════════════════════════════════╣
║  Building: [one-liner from PROJECT.md "What This Is"]       ║
║                                                              ║
║  Phase: [X] of [Y] - [Phase name]                           ║
║  Plan:  [A] of [B] - [Status]                               ║
║  Progress: [██████░░░░] XX%                                 ║
║                                                              ║
║  Last activity: [date] - [what happened]                    ║
╚══════════════════════════════════════════════════════════════╝

Routing digest:
- Doctrine refs: [paths or "none recorded"]
- Tech-debt ids: [ids or "none recorded"]
- Carry-forward: [items or "none active"]
- Reduced-guarantee: [status]
```

If `dual_install.detected` is true:

```text
Dual GSD installation detected:
  Local: v[dual_install.local.version] (this project — active)
  Global: v[dual_install.global.version] (baseline)
  See: references/dual-installation.md
```

If incomplete work is found:

```text
Incomplete work detected:
- [.continue-here file or incomplete plan]
```

If an interrupted agent is found:

```text
Interrupted agent detected:
Agent ID: [id]
Task: [task description]
Interrupted: [timestamp]

Resume with: Task tool (resume parameter with agent ID)
```

If pending todos exist:

```text
[N] pending todos — $gsdr-check-todos to review
```

If blockers exist:

```text
Carried concerns:
- [blocker 1]
- [blocker 2]
```

If reduced-guarantee planning is active, add a caution block:

```text
Caution:
Reduced-guarantee planning is still active. Route back to $gsdr-discuss-phase or a full-context $gsdr-plan-phase before more execution when possible.
```
</step>

<step name="determine_next_action">
Based on project state, determine the most logical next action.

If reduced-guarantee planning is active, it outranks normal execute-next routing. Clear the caution when possible before more execution.

Use a lightweight context-existence check for the current phase when needed:

```bash
node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs roadmap analyze
```

or by checking whether the current phase directory contains `*-CONTEXT.md`.

Do not parse `CONTEXT.md` itself in this workflow.

Routing order:

1. If reduced-guarantee planning is active:
   - If the current phase has no `CONTEXT.md`:
     - Primary: discuss the current phase to restore the full-context path
     - Secondary: plan directly if the user intentionally wants to skip discussion
   - If the current phase already has `CONTEXT.md`:
     - Primary: run a full-context replan for the current phase
     - Secondary: refresh context first with discuss-phase
   - Keep incomplete plans or checkpoints visible, but do not make straight execution the silent default.

2. If interrupted agent exists:
   - Primary: resume interrupted agent
   - Option: start fresh

3. If `.continue-here` file exists:
   - Primary: resume from checkpoint
   - Option: start fresh on current plan

4. If incomplete plan exists:
   - Primary: complete the incomplete plan
   - Option: abandon and move on

5. If phase in progress and all plans are complete:
   - Primary: transition to next phase
   - Option: review completed work

6. If phase is ready to plan:
   - If `CONTEXT.md` is missing:
     - Primary: discuss phase vision
     - Secondary: plan directly
   - If `CONTEXT.md` exists:
     - Primary: plan the phase
     - Option: review the roadmap

7. If phase is ready to execute:
   - Primary: execute next plan
   - Option: review the plan first
</step>

<step name="offer_options">
When presenting command suggestions below, use the command prefix detected in `detect_runtime`.

If reduced-guarantee planning is active and the current phase has no context:

```text
What would you like to do?

1. Discuss the current phase to restore the full-context path ({prefix}discuss-phase {phase})
2. Plan the current phase directly ({prefix}plan-phase {phase})
3. Review the current phase status
4. Check pending todos
5. Something else
```

If reduced-guarantee planning is active and the current phase already has context:

```text
What would you like to do?

1. Replan the current phase with full context ({prefix}plan-phase {phase})
2. Refresh context first ({prefix}discuss-phase {phase})
3. Review the current phase status
4. Check pending todos
5. Something else
```

Otherwise, present the normal contextual options:

```text
What would you like to do?

1. [Primary action based on state]
2. Review current phase status
3. Check pending todos
4. Review brief alignment
5. Something else
```
</step>

<step name="route_to_workflow">
Based on user selection, route to the appropriate workflow:

- **Execute plan**

  ```text
  ---

  ## ▶ Next Up

  **{phase}-{plan}: [Plan Name]** — [objective from PLAN.md]

  `{prefix}execute-phase {phase}`

  <sub>`/clear` first → fresh context window</sub>

  ---
  ```

- **Plan phase**

  ```text
  ---

  ## ▶ Next Up

  **Phase [N]: [Name]** — [Goal from ROADMAP.md]

  `{prefix}plan-phase [phase-number]`

  <sub>`/clear` first → fresh context window</sub>

  ---

  **Also available:**
  - `{prefix}discuss-phase [N]` — gather context first
  - `{prefix}research-phase [N]` — investigate unknowns

  ---
  ```

- **Discuss phase**

  ```text
  ---

  ## ▶ Next Up

  **Phase [N]: [Name]** — restore the full-context path

  `{prefix}discuss-phase [phase-number]`

  <sub>`/clear` first → fresh context window</sub>

  ---
  ```

- **Transition** → `./transition.md`
- **Check todos** → read `.planning/todos/pending/`, then present a summary
- **Review alignment** → read `PROJECT.md` and compare to the current state
- **Something else** → ask what the user needs
</step>

<step name="update_session">
Before proceeding to the routed workflow, update session continuity:

```markdown
## Session Continuity

Last session: [now]
Stopped at: Session resumed, proceeding to [action]
Resume file: [updated if applicable]
```

This ensures the next resume starts from truthful state.
</step>

</process>

<reconstruction>
If `STATE.md` is missing but other artifacts exist:

`STATE.md missing. Reconstructing from artifacts...`

1. Read `PROJECT.md` → extract "What This Is" and core value
2. Read `ROADMAP.md` → determine phases and current position
3. Read `.planning/LONG-ARC.md` and `.planning/TECH-DEBT.md` → rebuild a minimal routing digest
4. Scan `*-SUMMARY.md` files → extract decision pointers and concerns
5. Count pending todos in `.planning/todos/pending/`
6. Check for `.continue-here` files → restore session continuity
7. If reduced-guarantee planning is known from live artifacts, record it explicitly; otherwise say `None active.`

Then write a compact `STATE.md` and proceed normally.
</reconstruction>

<quick_resume>
If the user says "continue" or "go":
- load state silently
- determine the primary action
- if reduced-guarantee planning is active, route to discuss or plan instead of jumping straight to execution
- otherwise execute the normal primary next step

Example:

```text
Continuing from [state]... [action]
```
</quick_resume>

<success_criteria>
Resume is complete when:

- [ ] `STATE.md` loaded (or reconstructed)
- [ ] Incomplete work detected and flagged
- [ ] Routing digest surfaced in status presentation
- [ ] Reduced-guarantee planning, when active, routes to discuss/replan instead of staying silent
- [ ] Clear next actions offered
- [ ] User knows exactly where the project stands

</success_criteria>
