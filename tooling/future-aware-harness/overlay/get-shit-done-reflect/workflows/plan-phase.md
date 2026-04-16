<purpose>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification. Default flow: Research (if needed) -> Plan -> Verify -> Done. Orchestrates gsdr-phase-researcher, gsdr-planner, and gsdr-plan-checker agents with a revision loop (max 3 iterations).
</purpose>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.

@$HOME/.codex/get-shit-done-reflect/references/ui-brand.md
</required_reading>

<process>

## 1. Initialize

Load all context in one call (include file contents to avoid redundant reads):

```bash
INIT=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs init plan-phase "$PHASE" --include state,roadmap,requirements,context,research,verification,uat)
```

Parse JSON for: `researcher_model`, `planner_model`, `checker_model`, `research_enabled`, `plan_checker_enabled`, `commit_docs`, `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `has_research`, `has_context`, `has_plans`, `plan_count`, `planning_exists`, `roadmap_exists`.

**File contents (from --include):** `state_content`, `roadmap_content`, `requirements_content`, `context_content`, `research_content`, `verification_content`, `uat_content`. These are null if files don't exist.

**If `planning_exists` is false:** Error — run `\$gsdr-new-project` first.

## 2. Parse and Normalize Arguments

Extract from {{GSD_ARGS}}: phase number (integer or decimal like `2.1`), flags (`--research`, `--skip-research`, `--gaps`, `--skip-verify`, `--allow-no-context`).

Set `ALLOW_NO_CONTEXT=true` when `--allow-no-context` is present. Otherwise set `ALLOW_NO_CONTEXT=false`.

**If no phase number:** Detect next unplanned phase from roadmap.

**If `phase_found` is false:** Validate phase exists in ROADMAP.md. If valid, create the directory using `phase_slug` and `padded_phase` from init:
```bash
mkdir -p ".planning/phases/${padded_phase}-${phase_slug}"
```

**Existing artifacts from init:** `has_research`, `has_plans`, `plan_count`.

## 3. Validate Phase

```bash
PHASE_INFO=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs roadmap get-phase "${PHASE}")
```

**If `found` is false:** Error with available phases. **If `found` is true:** Extract `phase_number`, `phase_name`, `goal` from JSON.

## 4. Load CONTEXT.md

Use `context_content` from init JSON (already loaded via `--include context`).

**CRITICAL:** Use `context_content` from INIT — pass to researcher, planner, checker, and revision agents.

Resolve `CONTEXT_PATH` from the phase directory:

```bash
CONTEXT_PATH=$(ls ".planning/phases/${padded_phase}-${phase_slug}"/*-CONTEXT.md 2>/dev/null | head -n 1)
```

Track `CONTEXT_MODE` for downstream plan frontmatter:

- `full_context` — normalized context with `Canonical References` and `Future Awareness`
- `legacy_context` — context exists, but it predates the normalized future-aware structure
- `reduced_guarantee_no_context` — no context file; allowed only with `--allow-no-context`

If `context_content` is not null:

- Display: `Using phase context from: ${CONTEXT_PATH}`
- Set `CONTEXT_MODE=legacy_context` by default
- If `context_content` contains both `## Canonical References` and `## Future Awareness`, set `CONTEXT_MODE=full_context`

If `context_content` is null and `ALLOW_NO_CONTEXT` is `false`:

- Hard stop.
- Tell the operator that planning now requires `CONTEXT.md` by default because future-aware preservation and canonical references are part of the planning input.
- Route to:
  ```
  $gsdr-discuss-phase {X}
  ```
- Mention the explicit bypass:
  ```
  $gsdr-plan-phase {X} --allow-no-context
  ```
- State plainly that `--allow-no-context` reduces planning guarantees because there is no steering brief, no canonical-ref carrier, and no structured future-awareness input.
- Exit workflow.

If `context_content` is null and `ALLOW_NO_CONTEXT` is `true`:

- Display a warning before proceeding:
  ```
  Proceeding without CONTEXT.md because --allow-no-context was supplied.
  Planning will run in reduced-guarantee mode: no steering brief, no canonical refs from context, and no future-awareness capture to map forward.
  ```
- Set `CONTEXT_MODE=reduced_guarantee_no_context`

If `CONTEXT_MODE` is `full_context`, resolve canonical refs before spawning any downstream agent:

1. locate the `## Canonical References` section
2. extract the first backtick-wrapped repo-relative path from each bullet
3. de-duplicate in file order
4. verify each referenced file exists
5. read them in deterministic order into `CONTEXT_CANONICAL_REF_CONTENT`

Compatibility rule:

- missing `Canonical References` in a `legacy_context` is allowed
- a missing or unreadable canonical-ref path in `full_context` is a hard workflow error

Always load `.planning/TECH-DEBT.md` when it exists. This remains a standard planner/checker input even though routing-digest updates are deferred to a later wave.

If the current `STATE.md` includes an `Active tech-debt ids` digest subsection, extract those ids into `ACTIVE_TECH_DEBT_IDS`. If no such digest exists yet, leave `ACTIVE_TECH_DEBT_IDS` empty and infer relevant debt ids from the phase context, research, canonical refs, and `.planning/TECH-DEBT.md`.

<capability_check name="agent_spawning">
Check the runtime capability matrix (get-shit-done-reflect/references/capability-matrix.md):

If has_capability("task_tool"):
  Spawn gsdr-phase-researcher and gsdr-planner via Task() as designed in steps 5 and 8.

Else:
  Note (first occurrence): "Note: Running without parallel agents -- research and planning happen sequentially in this context."
  Instead of spawning agents:
  1. Read the researcher agent spec and perform research inline
  2. Read the planner agent spec and perform planning inline
  3. Continue with plan creation in the same context
</capability_check>

## 5. Handle Research

**Skip if:** `--gaps` flag, `--skip-research` flag, or `research_enabled` is false (from init) without `--research` override.

**If `has_research` is true (from init) AND no `--research` flag:** Use existing, skip to step 6.

**If RESEARCH.md missing OR `--research` flag:**

Display banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSDR ► RESEARCHING PHASE {X}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning researcher...
```

### Spawn gsdr-phase-researcher

```bash
PHASE_DESC=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs roadmap get-phase "${PHASE}" | jq -r '.section')
# Use requirements_content from INIT (already loaded via --include requirements)
REQUIREMENTS=$(echo "$INIT" | jq -r '.requirements_content // empty' | grep -A100 "## Requirements" | head -50)
STATE_SNAP=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs state-snapshot)
# Extract decisions from state-snapshot JSON: jq '.decisions[] | "\(.phase): \(.summary) - \(.rationale)"'
```

Research prompt:

```markdown
<objective>
Research how to implement Phase {phase_number}: {phase_name}
Answer: "What do I need to know to PLAN this phase well?"
Treat CONTEXT.md as a steering brief, not just a list of locked choices.
</objective>

<files_to_read>
- {context_path} (Phase steering brief from /gsdr-discuss-phase — if present)
- .planning/REQUIREMENTS.md (Project requirements)
- .planning/STATE.md (Project decisions and history)
- {context_canonical_refs} (Resolved files from CONTEXT.md `Canonical References` — MUST be read when present)
</files_to_read>

<phase_context>
IMPORTANT: If CONTEXT.md exists below, it contains user decisions from \$gsdr-discuss-phase.
- **Decisions** = Locked — research THESE deeply, no alternatives
- **Claude's Discretion** = Freedom areas — research options, recommend
- **Deferred Ideas** = Out of scope — ignore

{context_content}
</phase_context>

<additional_context>
**Phase description:** {phase_description}
**Requirements:** {requirements}
**Prior decisions:** {decisions}

Research guidance:
- Investigate, validate, or narrow items in `<working_model>` and `<questions>`
- Treat `<constraints>` and `<future_awareness>` as implementation guardrails
- Treat `Protected Seams` as things research should preserve unless evidence forces a different conclusion
- Treat `Explicit Non-Decisions` as intentionally open rather than accidentally missing
- Treat `Current Posture` as a real trust, visibility, or service constraint
- Use `Future Shape Notes` to inform seams and interfaces without pulling future scope into the current phase
- Keep `RESEARCH.md` on `Genuine Gaps` and `Still Open`; do not invent a separate research-disposition layer in this wave
</additional_context>

<output>
Write to: {phase_dir}/{phase}-RESEARCH.md
</output>
```

```
Task(
  prompt="First, read $HOME/.codex/agents/gsdr-phase-researcher.md for your role and instructions.\n\n" + research_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Research Phase {phase}"
)
```

### Handle Researcher Return

- **`## RESEARCH COMPLETE`:** Display confirmation, continue to step 5.5
- **`## RESEARCH BLOCKED`:** Display blocker, offer: 1) Provide context, 2) Skip research, 3) Abort

## 5.5. Handle Spike Decision Point

**Skip if:** `--gaps` flag is set (gap closure mode does not use spike integration) OR `--skip-research` flag is set (no RESEARCH.md to parse for gaps).

**Fork-compatibility guard:** Check if `get-shit-done-reflect/references/spike-integration.md` exists. If not (upstream GSD), skip this step entirely and proceed to step 6.

```bash
if [ ! -f "get-shit-done-reflect/references/spike-integration.md" ]; then
  # Upstream GSD -- skip spike decision point
  # Proceed to step 6
fi
```

**Check for genuine gaps:**

Read `{PHASE_DIR}/*-RESEARCH.md`. Look for a "### Genuine Gaps" section.

If no Genuine Gaps section or section is empty: proceed to step 6.

If Genuine Gaps exist:

1. **Parse gaps from the table:**
   ```
   For each gap in Genuine Gaps table:
     - question: the question text
     - criticality: Critical | Medium | Low
     - recommendation: Spike | Defer | Accept-risk
   ```

2. **Read spike config from `.planning/config.json`:**
   ```
   spike.enabled    (default: true)   -- whether the spike system is active
   spike.sensitivity (default: "balanced") -- which criticalities trigger spikes
   spike.auto_trigger (default: false)  -- whether to auto-trigger or advise only
   ```

   If `spike.enabled` is false: skip spike processing, proceed to step 6.

3. **Apply sensitivity filter:**
   ```
   sensitivity = config.spike.sensitivity OR derive from config.granularity:
     - granularity: coarse    -> conservative
     - granularity: standard  -> balanced
     - granularity: fine      -> aggressive

   Explicit spike.sensitivity overrides derivation.

   - conservative: only process Critical gaps with Spike recommendation
   - balanced: process Critical + Medium gaps with Spike recommendation
   - aggressive: process all gaps with Spike recommendation
   ```

4. **Apply auto_trigger setting:**

   If `spike.auto_trigger` is **false** (default): Present gaps as advisory only.
   ```
   Display filtered gaps and suggest:
   "These gaps could benefit from a spike investigation via \$gsdr-spike"
   ```
   Do NOT auto-execute spikes. Proceed to step 6.

   If `spike.auto_trigger` is **true**: Apply autonomy mode:
   ```
   mode = config.mode

   - interactive: present filtered gaps, ask user which to spike
   - yolo: auto-spike all filtered gaps
   ```

   For each approved spike, invoke `get-shit-done-reflect/workflows/run-spike.md` with:
   - question: gap.question
   - phase: current phase number

5. **Proceed to step 6** with RESEARCH.md updated (if spikes were run, "Resolved by Spike" entries added).

## 6. Check Existing Plans

```bash
ls "${PHASE_DIR}"/*-PLAN.md 2>/dev/null || true
```

**If exists:** Offer: 1) Add more plans, 2) View existing, 3) Replan from scratch.

## 7. Use Context Files from INIT

All file contents are already loaded via `--include` in step 1 (`@` syntax doesn't work across Task() boundaries):

```bash
# Extract from INIT JSON (no need to re-read files)
STATE_CONTENT=$(echo "$INIT" | jq -r '.state_content // empty')
ROADMAP_CONTENT=$(echo "$INIT" | jq -r '.roadmap_content // empty')
REQUIREMENTS_CONTENT=$(echo "$INIT" | jq -r '.requirements_content // empty')
RESEARCH_CONTENT=$(echo "$INIT" | jq -r '.research_content // empty')
VERIFICATION_CONTENT=$(echo "$INIT" | jq -r '.verification_content // empty')
UAT_CONTENT=$(echo "$INIT" | jq -r '.uat_content // empty')
CONTEXT_CONTENT=$(echo "$INIT" | jq -r '.context_content // empty')
TECH_DEBT_CONTENT=$(cat .planning/TECH-DEBT.md 2>/dev/null || true)
```

If `STATE_CONTENT` has a routing digest section for active debt ids, extract those ids into `ACTIVE_TECH_DEBT_IDS`.

If no routing digest exists yet, leave `ACTIVE_TECH_DEBT_IDS` empty and treat the relevant debt set as:

- ids explicitly named in `CONTEXT.md`
- ids surfaced by research
- ids implicated by canonical refs or `.planning/LONG-ARC.md`
- ids whose rewrite triggers are directly touched by the phase goal

## 7b. Load Triaged Signals

**Skip if:** `--gaps` flag is set (gap closure mode does not use signal awareness).

**Skip if:** KB index does not exist (`.planning/knowledge/index.md` and `~/.gsd/knowledge/index.md` both missing -- project may not have run signal collection yet). Set `TRIAGED_SIGNALS=""` and continue.

Load active triaged signals for the current project to pass to the planner:

```bash
# Read KB index and filter for triaged "address" signals
# Guard against missing KB -- not all projects use signal collection
# KB path resolution -- project-local primary, user-global fallback
if [ -d ".planning/knowledge" ]; then KB_DIR=".planning/knowledge"; else KB_DIR="$HOME/.gsd/knowledge"; fi
KB_INDEX=$(cat $KB_DIR/index.md 2>/dev/null)
if [ -z "$KB_INDEX" ]; then
  TRIAGED_SIGNALS=""
  # Skip signal loading -- no KB index exists
else
  PROJECT_NAME=$(basename "$(pwd)")
  # ... continue with filtering
fi
```

1. Parse the KB index table for signals matching:
   - Project = current project name
   - Lifecycle = "triaged"
   - Status = "active"
2. For matching signals, read the full signal files (max 10, prioritized by severity: critical > notable > minor):
   ```bash
   # Example: read top signal files
   cat $KB_DIR/signals/{project}/{date}-{slug}.md
   ```
3. From each signal file, extract: `id`, `severity`, `signal_type`, `tags`, `triage.decision`, `triage.remediation_suggestion`
4. Filter to signals with `triage.decision: address` only (skip dismiss/defer/investigate)
5. Format as `<triaged_signals>` context block:
   ```markdown
   <triaged_signals>
   {N} triaged signals with decision "address" for project {project_name}:

   - **{sig-id}** ({severity}): {summary}
     Root cause: {from triage or evidence}
     Remediation suggestion: {triage.remediation_suggestion}
     Tags: {tags}
   ...
   </triaged_signals>
   ```

**If no matching signals:** Set `TRIAGED_SIGNALS=""` (empty). The planner will omit resolves_signals.

**Context budget note:** Reading 10 signal files costs ~5-10% context. This is acceptable because signal loading replaces the need for the planner to independently discover these issues.

## 8. Spawn gsdr-planner Agent

Display banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSDR ► PLANNING PHASE {X}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning planner...
```

Planner prompt:

```markdown
<planning_context>
**Phase:** {phase_number}
**Mode:** {standard | gap_closure}
**Planning posture:** {context_mode}

<files_to_read>
- {context_path} (Phase steering brief from /gsdr-discuss-phase — if present)
- {context_canonical_refs} (Resolved files from CONTEXT.md `Canonical References` — MUST be read when present)
- .planning/ROADMAP.md (Roadmap)
- .planning/REQUIREMENTS.md (Requirements)
- .planning/STATE.md (Routing digest and decisions)
- .planning/TECH-DEBT.md (Live tech-debt registry)
</files_to_read>

**Project State:** {state_content}
**Roadmap:** {roadmap_content}
**Requirements:** {requirements_content}
**Tech Debt Registry:** {tech_debt_content}
**Active tech-debt ids from state digest:** {active_tech_debt_ids}

**Phase Context:**
IMPORTANT: If context exists below, it contains USER DECISIONS from \$gsdr-discuss-phase.
- **Decisions** = LOCKED — honor exactly, do not revisit
- **Claude's Discretion** = Freedom — make implementation choices
- **Deferred Ideas** = Out of scope — do NOT include

{context_content}

**Research:** {research_content}

**Triaged Signals:**
{TRIAGED_SIGNALS}

**Gap Closure (if --gaps):** {verification_content} {uat_content}
</planning_context>

<planning_contract>
Every new or revised plan created in this run must carry:

- `planning_posture`
  - `context_mode: full_context | legacy_context | reduced_guarantee_no_context`
  - `context_path: .planning/phases/.../*-CONTEXT.md | null`
  - `canonical_refs_resolved: true | false`
- `future_preservation`
  - one entry for every material item in `Future Awareness` when context mode is `full_context`
  - each entry maps exactly one source item to exactly one disposition:
    - `preserved_seam`
    - `sequencing_choice`
    - `validation_task`
    - `non_action_rationale`
- `tech_debt_disposition`
  - one entry for every relevant debt id from the active state digest, or from context/research/canonical refs when the digest does not exist yet
  - allowed statuses:
    - `trigger_fired`
    - `retired`
    - `intentionally_deferred`
    - `not_applicable`
</planning_contract>

<downstream_consumer>
Output consumed by \$gsdr-execute-phase. Plans need:
- Frontmatter (wave, depends_on, files_modified, autonomous)
- `planning_posture` frontmatter capturing whether planning used full context, legacy context, or explicit reduced-guarantee bypass
- `future_preservation` frontmatter capturing preserved seams, non-decisions, and posture assumptions when context future-awareness is material
- `tech_debt_disposition` frontmatter for relevant debt ids
- Tasks in XML format
- Verification criteria
- must_haves for goal-backward verification
</downstream_consumer>

<planning_guidance>
- Treat `<decisions>` as locked unless the context explicitly marks them as provisional
- Treat `<working_model>` as the current best model, not confirmed truth
- Convert `<questions>` into research dependencies, explicit validation work, or early plan tasks rather than silently ignoring them
- Treat `<constraints>` and `<future_awareness>` as architectural guardrails that should shape interfaces, data models, abstractions, and sequencing now
- For every material item in `<future_awareness>`, map it exactly once to: preserved seam, sequencing choice, validation task, or explicit non-action rationale
- Do not silently collapse an `Explicit Non-Decision` into a decision unless the context or research justifies it
- `Current Posture` is a real operating constraint, not branding copy
- Use `Future Shape Notes` to inform seams and interfaces without importing later-phase scope
- When `CONTEXT_MODE` is `legacy_context`, preserve material future-facing constraints you can identify from the raw context plus doctrine shell and record that this was legacy-context planning
- When `CONTEXT_MODE` is `reduced_guarantee_no_context`, set `planning_posture.context_mode` accordingly and do not pretend the plan had future-awareness coverage it never received
- Relevant tech-debt ids must be dispositioned explicitly. Do not leave rewrite triggers implicit.
</planning_guidance>

<quality_gate>
- [ ] PLAN.md files created in phase directory
- [ ] Each plan has valid frontmatter
- [ ] Each plan has `planning_posture`
- [ ] Tasks are specific and actionable
- [ ] Dependencies correctly identified
- [ ] Waves assigned for parallel execution
- [ ] must_haves derived from phase goal
- [ ] If context future-awareness is material, each plan includes non-generic `future_preservation`
- [ ] Relevant tech-debt ids are covered by `tech_debt_disposition`
</quality_gate>
```

```
Task(
  prompt="First, read $HOME/.codex/agents/gsdr-planner.md for your role and instructions.\n\n" + filled_prompt,
  subagent_type="general-purpose",
  model="{planner_model}",
  description="Plan Phase {phase}"
)
```

## 9. Handle Planner Return

- **`## PLANNING COMPLETE`:** Display plan count. If `--skip-verify` or `plan_checker_enabled` is false (from init): skip to step 13. Otherwise: step 10.
- **`## CHECKPOINT REACHED`:** Present to user, get response, spawn continuation (step 12)
- **`## PLANNING INCONCLUSIVE`:** Show attempts, offer: Add context / Retry / Manual

## 10. Spawn gsdr-plan-checker Agent

Display banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSDR ► VERIFYING PLANS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning plan checker...
```

```bash
PLANS_CONTENT=$(cat "${PHASE_DIR}"/*-PLAN.md 2>/dev/null)
```

Checker prompt:

```markdown
<verification_context>
**Phase:** {phase_number}
**Phase Goal:** {goal from ROADMAP}
**Planning posture expected:** {context_mode}

<files_to_read>
- {phase_dir}/*-PLAN.md (Plans to verify)
- {context_path} (Phase steering brief from /gsdr-discuss-phase — if present)
- {context_canonical_refs} (Resolved files from CONTEXT.md `Canonical References` — MUST be read when present)
- .planning/ROADMAP.md (Roadmap)
- .planning/REQUIREMENTS.md (Requirements)
- .planning/TECH-DEBT.md (Live tech-debt registry)
- {research_content} (Technical research — if present)
</files_to_read>

**Plans to verify:** {plans_content}
**Requirements:** {requirements_content}
**Tech Debt Registry:** {tech_debt_content}
**Active tech-debt ids from state digest:** {active_tech_debt_ids}

**Phase Context:**
IMPORTANT: Plans MUST honor user decisions. Flag as issue if plans contradict.
- **Decisions** = LOCKED — plans must implement exactly
- **Claude's Discretion** = Freedom areas — plans can choose approach
- **Deferred Ideas** = Out of scope — plans must NOT include

{context_content}
</verification_context>

<verification_guidance>
- Fail plans that ignore material `<questions>` without resolving, sequencing, or explicitly validating them
- Fail plans that violate `<constraints>` or `<future_awareness>`
- If context future-awareness is material, fail plans whose `future_preservation` is missing, empty, or generic enough to be non-auditable
- Fail plans that drop a material future-awareness item instead of preserving it, sequencing it, validating it, or explicitly justifying non-action now
- Fail plans that omit relevant debt ids from `tech_debt_disposition`
- Fail plans whose `tech_debt_disposition` notes are generic enough that an auditor cannot tell what happened to the trigger
- `legacy_context` plans may be more inferential, but they still need concrete preservation/debt entries when the phase clearly touches those surfaces
- `reduced_guarantee_no_context` plans must record that posture honestly rather than pretending they had full steering coverage
</verification_guidance>

<expected_output>
- ## VERIFICATION PASSED — all checks pass
- ## ISSUES FOUND — structured issue list
</expected_output>
```

```
Task(
  prompt=checker_prompt,
  subagent_type="gsdr-plan-checker",
  model="{checker_model}",
  description="Verify Phase {phase} plans"
)
```

## 11. Handle Checker Return

- **`## VERIFICATION PASSED`:** Display confirmation, proceed to step 13.
- **`## ISSUES FOUND`:** Display issues, check iteration count, proceed to step 12.

## 12. Revision Loop (Max 3 Iterations)

Track `iteration_count` (starts at 1 after initial plan + check).

**If iteration_count < 3:**

Display: `Sending back to planner for revision... (iteration {N}/3)`

```bash
PLANS_CONTENT=$(cat "${PHASE_DIR}"/*-PLAN.md 2>/dev/null)
```

Revision prompt:

```markdown
<revision_context>
**Phase:** {phase_number}
**Mode:** revision

**Existing plans:** {plans_content}
**Checker issues:** {structured_issues_from_checker}
**Tech Debt Registry:** {tech_debt_content}
**Active tech-debt ids from state digest:** {active_tech_debt_ids}

**Phase Context:**
Revisions MUST still honor user decisions.
{context_content}

**Canonical refs to preserve:** {context_canonical_refs}
</revision_context>

<instructions>
Make targeted updates to address checker issues.
Do NOT replan from scratch unless issues are fundamental.
Keep `planning_posture`, `future_preservation`, and `tech_debt_disposition` aligned with the actual planning inputs.
Return what changed.
</instructions>
```

```
Task(
  prompt="First, read $HOME/.codex/agents/gsdr-planner.md for your role and instructions.\n\n" + revision_prompt,
  subagent_type="general-purpose",
  model="{planner_model}",
  description="Revise Phase {phase} plans"
)
```

After planner returns -> spawn checker again (step 10), increment iteration_count.

**If iteration_count >= 3:**

Display: `Max iterations reached. {N} issues remain:` + issue list

Offer: 1) Force proceed, 2) Provide guidance and retry, 3) Abandon

## 13. Present Final Status

Route to `<offer_next>`.

</process>

<offer_next>
Output this markdown directly (not as a code block):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSDR ► PHASE {X} PLANNED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase {X}: {Name}** — {N} plan(s) in {M} wave(s)

| Wave | Plans | What it builds |
|------|-------|----------------|
| 1    | 01, 02 | [objectives] |
| 2    | 03     | [objective]  |

Research: {Completed | Used existing | Skipped}
Verification: {Passed | Passed with override | Skipped}

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Execute Phase {X}** — run all {N} plans

\$gsdr-execute-phase {X}

<sub>/clear first → fresh context window</sub>

───────────────────────────────────────────────────────────────

**Also available:**
- cat .planning/phases/{phase-dir}/*-PLAN.md — review plans
- \$gsdr-plan-phase {X} --research — re-research first

───────────────────────────────────────────────────────────────
</offer_next>

<success_criteria>
- [ ] .planning/ directory validated
- [ ] Phase validated against roadmap
- [ ] Phase directory created if needed
- [ ] CONTEXT.md required by default; no-context runs only when `--allow-no-context` is explicit
- [ ] `CONTEXT_MODE` recorded as `full_context`, `legacy_context`, or `reduced_guarantee_no_context`
- [ ] Canonical refs resolved and read when present in normalized context
- [ ] `.planning/TECH-DEBT.md` loaded for planning and checking
- [ ] Research completed (unless --skip-research or --gaps or exists)
- [ ] gsdr-phase-researcher spawned with CONTEXT.md and canonical refs when available
- [ ] Spike decision point evaluated (step 5.5) if spike-integration.md exists
- [ ] Existing plans checked
- [ ] gsdr-planner spawned with CONTEXT.md + RESEARCH.md + tech-debt context
- [ ] Plans created (PLANNING COMPLETE or CHECKPOINT handled)
- [ ] New/revised plans include `planning_posture`
- [ ] Material future-awareness items are mapped in `future_preservation` when applicable
- [ ] Relevant debt ids are covered by `tech_debt_disposition`
- [ ] gsdr-plan-checker spawned with CONTEXT.md, canonical refs, and tech-debt context
- [ ] Verification passed OR user override OR max iterations with user decision
- [ ] User sees status between agent spawns
- [ ] User knows next steps
</success_criteria>
