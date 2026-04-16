<purpose>
Research how to implement a phase. Spawns `gsdr-phase-researcher` with the steering brief, canonical references, and future-aware constraints that planning is expected to preserve.

Standalone research command. For most workflows, use `\$gsdr-plan-phase` which integrates research automatically.
</purpose>

<process>

## Step 0: Resolve Model Profile

@$HOME/.codex/get-shit-done-reflect/references/model-profile-resolution.md

Resolve model for:
- `gsdr-phase-researcher`

## Step 1: Normalize and Validate Phase

@$HOME/.codex/get-shit-done-reflect/references/phase-argument-parsing.md

```bash
PHASE_INFO=$(node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs roadmap get-phase "${PHASE}")
```

If `found` is false: error and exit.

## Step 2: Check Existing Research

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null || true
```

If research already exists: offer update / view / skip options.

## Step 3: Gather Phase Context

```bash
# Phase section from roadmap (already loaded in PHASE_INFO)
echo "$PHASE_INFO" | jq -r '.section'
cat .planning/REQUIREMENTS.md 2>/dev/null || true
CONTEXT_PATH=$(ls .planning/phases/${PHASE}-*/*-CONTEXT.md 2>/dev/null | head -n 1)
if [ -n "$CONTEXT_PATH" ]; then
  cat "$CONTEXT_PATH"
fi
# Decisions from state-snapshot (structured JSON)
node $HOME/.codex/get-shit-done-reflect/bin/gsd-tools.cjs state-snapshot | jq '.decisions'
```

If `CONTEXT_PATH` exists:

1. Treat `CONTEXT.md` as the steering brief for research, not just a list of locked choices.
2. Resolve `Canonical References` before the researcher prompt:
   - locate the `## Canonical References` section
   - extract the first backtick-wrapped repo-relative path from each bullet
   - de-duplicate in file order
   - verify each file exists
   - read the resolved files before spawning the researcher
3. Pass both the raw `CONTEXT.md` content and the resolved canonical-ref contents into the researcher prompt.
4. Treat `Future Awareness` as planning constraints, not optional background:
   - preserve `Protected Seams` unless evidence forces a different conclusion
   - treat `Explicit Non-Decisions` as intentionally open rather than accidentally missing
   - respect `Current Posture` as a real operating constraint
   - use `Future Shape Notes` to inform seams and interfaces without importing future scope

If `CONTEXT_PATH` does not exist: continue with requirements plus prior decisions only. Do not invent a separate research-disposition schema in this wave.

## Step 4: Spawn Researcher

```
Task(
  prompt="<objective>
Research implementation approach for Phase {phase}: {name}
Answer: What do I need to know to PLAN this phase well?
Treat CONTEXT.md as a steering brief, not just a list of locked choices.
</objective>

<files_to_read>
- {context_path} (Phase steering brief from /gsdr-discuss-phase — if present)
- .planning/REQUIREMENTS.md (Project requirements)
- .planning/STATE.md (Project decisions and history)
- {context_canonical_refs} (Resolved files from CONTEXT.md `Canonical References` — MUST be read when present)
</files_to_read>

<context>
Phase description: {description}
Requirements: {requirements}
Prior decisions: {decisions}
Phase context: {context_md}
</context>

<research_guidance>
- Respect locked decisions in `<decisions>`
- Investigate, validate, or narrow items in `<working_model>` and `<questions>`
- Treat `<constraints>` and `<future_awareness>` as implementation guardrails
- Treat `Protected Seams` as things research should preserve unless evidence forces a different conclusion
- Treat `Explicit Non-Decisions` as intentionally open rather than accidentally missing
- Treat `Current Posture` as a real trust, visibility, or service constraint
- Use `Future Shape Notes` to inform seams and interfaces without pulling future scope into the current phase
- Keep `RESEARCH.md` on `Genuine Gaps` and `Still Open`; do not invent a new research-disposition layer in this wave
</research_guidance>

<output>
Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</output>",
  subagent_type="gsdr-phase-researcher",
  model="{researcher_model}"
)
```

## Step 5: Handle Return

- `## RESEARCH COMPLETE` — display summary, offer: Plan / Dig deeper / Review / Done
- `## CHECKPOINT REACHED` — present to user, then continue
- `## RESEARCH BLOCKED` or `## RESEARCH INCONCLUSIVE` — show blocker/attempts, offer: Add context / Try different mode / Manual

When research preserves non-decisions or leaves named uncertainty in `Genuine Gaps` or `Still Open`, do not treat that as failure by default. Carry those items forward into planning as explicit consequences rather than forcing fake closure.

</process>
