# State Template

Template for `.planning/STATE.md` — the project's compact routing digest and session memory.

---

## File Template

```markdown
---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 01
current_phase_name: Example Phase
current_plan: 0
status: ready_for_context
stopped_at: [one-line truth about what just happened and what is next]
last_updated: "[YYYY-MM-DDTHH:MM:SSZ]"
last_activity: YYYY-MM-DD
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated [date])

**Core value:** [one-line value statement from PROJECT.md]
**Current focus:** [short pointer to the active planning or execution focus]

## Current Position

Phase: [X] of [Y] ([Phase name])
Plan: [A] of [B]

**Status:** [Ready for context / Planning / Ready to execute / In progress / Phase complete]
**Last Activity:** [YYYY-MM-DD] — [one-line truth about the latest material change]
**Progress:** [███░░░░░░░] 0% ([completed]/[total] roadmap plans complete)

## Routing Digest

### Active Doctrine Refs

- `.planning/LONG-ARC.md` — [why it is active now]
- `[decision anchor or initiative artifact path]` — [only when it materially constrains the current work]

### Active Tech-Debt Ids

- `VA-TD-01` — [why this debt is active in the current corridor]
- `VA-TD-02` — [omit if not active]

### Active Carry-Forward

- [live planning-system or roadmap-reset carry-forward item, only when still actionable]

### Reduced-Guarantee Status

- None active.

## Accumulated Context

### Decision Pointers

- [3-5 recent planning-significant decisions; full log stays in PROJECT.md]

### Pending Todos

- [pending todo summary or "None yet."]

### Blockers/Concerns

- [only active issues that still affect upcoming work]

## Session Continuity

**Last session:** [YYYY-MM-DDTHH:MM:SSZ]
**Stopped At:** [what completed and what is next]
**Resume File:** [path or "None yet."]
```

<purpose>

STATE.md is the routing memory for the repo.

It is not a second doctrine file, a second roadmap, or a long-form decision archive.

Its job is to keep the active planning posture visible to `progress`, `resume`, and live sessions by pointing to:

- the doctrine that currently constrains the work
- the tech-debt ids that must be dispositioned soon
- any carry-forward item that still needs a destination
- any reduced-guarantee planning status that should not become invisible normal mode

</purpose>

<lifecycle>

**Creation:** After ROADMAP.md is created
- Reference PROJECT.md for the core value and current focus
- Initialize a minimal routing digest
- Start with reduced-guarantee status set explicitly to `None active.`

**Reading:** Early in every workflow
- `progress` uses it for routing digest and next-action context
- `resume` uses it for status restoration and caution routing
- planning and audit workflows use it as the current routing memory, not as a doctrine substitute

**Writing:** After material planning or execution changes
- Update current position and last activity
- Refresh active doctrine refs when the constraining files change
- Refresh active tech-debt ids when the current corridor changes
- Keep active carry-forward items explicit only while they still need action
- Record reduced-guarantee planning when it is used, and clear it only after a full-context replan replaces it

</lifecycle>

<sections>

### Project Reference

Keep this short. It should point back to PROJECT.md rather than restating requirements or long decision logs.

### Current Position

Say where the project actually is now. One phase line, one plan line, one status line, one last-activity line, one progress line.

### Routing Digest

This is the new load-bearing section for Stage 3 routing.

- `Active Doctrine Refs` should list only the files that materially constrain the next planning or execution move.
- `Active Tech-Debt Ids` should list only the debt entries that are live for the current corridor or immediate follow-through.
- `Active Carry-Forward` is optional and should stay short.
- `Reduced-Guarantee Status` must say either `None active.` or describe the caution that still needs to be cleared.

Prefer file paths and debt ids over prose. Add a short reason, not a full explanation.

### Accumulated Context

Keep only the recent pointers that help resume work quickly:

- 3-5 decision pointers max
- pending todos in digest form
- only active blockers or concerns

### Session Continuity

Keep one truthful line about the last material action and the next expected move. Do not point to a resume file that does not exist.

</sections>

<size_constraint>

Keep STATE.md compact and pointer-heavy.

Target:
- under 120 lines
- no copied doctrine blocks
- no long performance tables
- no full decision history

If a section starts turning into an archive, replace it with a pointer to the authoritative file.

</size_constraint>
