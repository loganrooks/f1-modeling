---
document: CODEX-PROMPT
status: ready-to-delegate
type: design-proposal-task-prompt
created: 2026-05-16
purpose: Brief Codex to investigate the GSD-1 mainline codebase and propose precise, auditable patches that make the local f1-modeling install LONG-ARC / VISION aware
target_executor: Codex CLI (deep-reasoning model preferred — gpt-5.4 or equivalent)
expected_runtime: 2-4 hours (investigation + drafting)
predecessor: codex-prompt.md (the GSD-local migration). This prompt does not require the migration to be complete first.
successor: codex-prompt-uplift-execution.md (does not exist yet; written after the proposal is approved)
---

# Codex Task — Design Proposal for LONG-ARC-Aware GSD Patches

## Who is asking, and why

You are being delegated to by a Claude session working with the user — a philosophy PhD student with a robotics-engineering background, building the F1 Modeling Lab as a research/learning tool. The user has accumulated a substantial doctrine in `CLAUDE.md` (in `/home/rookslog/workspace/projects/f1-modeling/`) that mandates specific sections in every phase `CONTEXT.md` and `PLAN.md`: **Vision Impact**, **Vision Alignment Checkpoint**, **Honesty Surface**, **Accessibility and Thin-Client**, **Performance Budget**, **Migration Discipline**, **Phase-4 Contract Completion**, plus a "Future Awareness" convention and a Vision Alignment Checkpoint question.

Today, GSD-1 (mainline `get-shit-done-cc`) does NOT know about any of this. The planner agent does not enforce these sections. The plan-checker does not validate them. The pattern-mapper does not understand long-arc-protected seams (`disposition: preserved_seam`). The verifier does not check whether claimed Vision Impact was actually delivered.

The user is doing this work in two phases:

1. **Migration** (other Codex prompt, `codex-prompt.md`): install GSD-1 locally in the repo at `./.claude/get-shit-done/` so patches can live in version control.
2. **Uplift** (THIS prompt): propose precise patches that make the local install LONG-ARC and VISION aware. Then — after user review and approval — apply them.

**This prompt is the proposal phase only.** Investigate, design, write a structured proposal document. Do NOT apply patches. The user will read the proposal, possibly request revisions, and then a separate execution prompt will land the patches.

The user's own framing: *"the proposal must be auditable, all claims must be grounded in the get-shit-done-upstream codebase. The one thing we need to be careful about is making sure we consider all the different potential uplift surfaces and then second-order effects and changes we will need to make as a result, because if you change one artifact or node in the workflow, one side of a contract, you need to change the other as well, else it might be ignored or used improperly."*

## Critical constraints — read carefully

### Scope of the codebase to uplift

- **Target:** GSD-1 mainline (`get-shit-done-cc`, the npm package at `github.com/gsd-build/get-shit-done`). This is the canonical upstream.
- **NOT GSD-2.** GSD-2 is a completely separate project the user has explicitly rejected as "a failure." It lives at `/home/rookslog/workspace/projects/gsd-2-explore/` and `gsd-2-uplift/`. **Do not read, cite, draw from, or compare against GSD-2.** It is not just out of scope — it is anti-scope. If you find yourself in those directories, leave immediately.
- **NOT GSDR.** GSDR (`get-shit-done-reflect`) was a partial rewrite the user partially rolled back on 2026-05-15. It lives at `/home/rookslog/workspace/projects/get-shit-done-reflect/` and is also referenced as the `fork` remote on the upstream clone. Four GSDR add-on commands survive at the user-scope level (`gsdr:deliberate`, `gsdr:signal`, `gsdr:reflect`, `gsdr:collect-signals`) and stay alive, but no GSDR-style enforcement should re-enter the mainline. Do not draw patches from the GSDR fork branch or codebase.
- **NOT the older snapshot.** `/home/rookslog/workspace/projects/get-shit-done-upstream-v1.36.0/` is a frozen prior-version snapshot. Informational only — do not cite.

### Output shape

- The deliverable is a **single markdown proposal document** at `.planning/initiatives/gsd-local-migration-2026-05/UPLIFT-PROPOSAL.md` in the f1-modeling repo.
- No code changes. No patches to `./.claude/get-shit-done/`. No edits to upstream. No PRs to upstream.
- One coherent commit on a branch named `docs/gsd-uplift-proposal-2026-05` (NOT `main`; the user will review before approving execution).

### Auditability — every claim must be grounded

- **Citation discipline:** every factual claim about GSD's current behavior must be backed by either (a) source citation `path/to/file:line` against the upstream clone, or (b) doc citation `path/to/doc.md` with a note that this is documentation (which can drift). When source and docs disagree, **trust source and call out the drift in an annotation block**.
- **No hand-waving.** "The planner does X" is not allowed unless followed by `(agents/gsd-planner.md:42-58)` or equivalent.
- **Differentiate observed vs. inferred.** If you observed a behavior in source, cite it. If you inferred a behavior from naming or partial reading, flag with `[inferred]`.

### Contract integrity — every change has obligations

- For every proposed change to a single surface, the proposal **MUST enumerate** all other surfaces that touch the same contract and either (a) propose a coordinated change to them, or (b) explicitly justify why no coordinated change is needed.
- A "contract" here is any handoff point: template ↔ agent ↔ workflow ↔ checker ↔ verifier ↔ test ↔ docs.
- Missing a contract dependency is the highest-severity failure mode. Better to over-enumerate (note something that "probably doesn't need to change") than to miss something.

## Background — the doctrine to encode

The patches we will design must teach GSD to enforce these sections per CLAUDE.md "Phase Planning Expectations" (`/home/rookslog/workspace/projects/f1-modeling/CLAUDE.md`, lines ~65-83):

| Doctrine section | What it requires | Where mandated |
|---|---|---|
| `Future Awareness` | architectural constraints from downstream phases shaping current implementation | CLAUDE.md "Key Conventions" |
| `Vision alignment checkpoint` | answer "Does this serve the long-horizon vision, or only the immediate milestone?" with justification if milestone-only | CLAUDE.md "Key Conventions" |
| `Vision Impact` | what long-horizon capability the phase protects or unlocks, and what milestone-only temptation it is resisting | CLAUDE.md "Phase Planning Expectations" |
| `Honesty Surface` | which artifacts/panels must show fidelity, validation, and comparability state visibly | CLAUDE.md "Phase Planning Expectations" |
| `Accessibility and Thin-Client` | keyboard interactions, accessible labels/summaries, Apollo-over-Tailscale responsiveness | CLAUDE.md "Phase Planning Expectations" |
| `Performance Budget` | envelope targets, benchmark/measurement path, what counts as a trigger to revisit | CLAUDE.md "Phase Planning Expectations" |
| `Migration Discipline` | legacy SVG touches, shared primitive coverage, registry items | CLAUDE.md "Phase Planning Expectations" |
| `Phase-4 Contract Completion` | when relevant, define `AccessibleChartContract` and `AnchorRegistry` before substrate code | CLAUDE.md "Phase Planning Expectations" |

Plus two cross-cutting concepts:

- **VISION.md awareness** — `.planning/VISION.md` exists; planner should read it as input for Vision Impact section authorship.
- **LONG-ARC.md awareness** — `.planning/LONG-ARC.md` exists with a list of "Protected Seams" using a notation like `disposition: preserved_seam`. Pattern-mapper should recognize these; planner should reference them; checker should verify plans don't violate them.

**Important:** VISION.md and LONG-ARC.md are NOT standard GSD project docs. GSD's canonical doc set is PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md. The uplift must add VISION/LONG-ARC as *optional inputs* that GSD reads when present, without breaking projects that do not have them.

Examples of the doctrine in actual repo use are at:

- `.planning/phases/03.2-backend-execution-job-artifacts-and-regulation-execution-flow/03.2-CONTEXT.md` (the model CONTEXT)
- `.planning/phases/03.2-.../03.2-01-PLAN.md` through `03.2-05-PLAN.md` (5 model plans, each with a `<doctrine_alignment>` block)
- `.planning/VISION.md`
- `.planning/LONG-ARC.md`
- `.planning/HANDOFF-2026-05-15-phase-3.2.md` (context on the recent work)

## Source materials and how to use them

### Primary — the upstream clone

Path: `/home/rookslog/workspace/projects/get-shit-done-upstream/`

```bash
cd /home/rookslog/workspace/projects/get-shit-done-upstream
git remote -v        # confirm origin = gsd-build/get-shit-done
git fetch origin     # update from canonical upstream
git status           # confirm clean
git log --oneline -5 # check current state — likely 1.37.x, stale vs installed 1.42.2
```

**You must update the clone before investigating.** The user has it at v1.37.1; the installed version is v1.42.2. Check out the tag matching the installed version:

```bash
git tag -l | grep "1.42" | sort -V
git checkout v1.42.2     # or whichever exact tag matches ./.claude/get-shit-done/VERSION
```

If no tag matches exactly, check out the closest tag and note the discrepancy in the proposal's audit section.

**Layout of upstream (relative to its root):**
- `agents/` — subagent definitions (`.md` files), e.g., `gsd-planner.md`, `gsd-plan-checker.md`
- `commands/` — slash-command entry files
- `get-shit-done/workflows/` — workflow files invoked by slash commands
- `get-shit-done/templates/` — output templates (CONTEXT.md, PLAN.md, AI-SPEC.md, etc.)
- `get-shit-done/references/` — long-form reference docs (artifact-types, agent-contracts, etc.)
- `get-shit-done/contexts/` — context-mode definitions (dev, research, review)
- `sdk/` — TypeScript SDK source, prompts, types
- `bin/` — executable infrastructure (CLI entry, latest-version check, etc.)
- `docs/` — published documentation
- `hooks/` — git/session hooks
- `tests/` — vitest suite

**The upstream test suite is a key resource.** Run it once before designing changes:

```bash
cd /home/rookslog/workspace/projects/get-shit-done-upstream
npm install
npm test
```

This tells you what contracts are explicitly tested today. Any contract you propose to change must have a corresponding test update — note the test file in your contract dependency list.

### Secondary — the installed version in f1-modeling

Path: `/home/rookslog/.claude/get-shit-done/` (today, user-scope) or `/home/rookslog/workspace/projects/f1-modeling/.claude/get-shit-done/` (after migration lands).

Use this for sanity-checking that the installed shipped form matches what the upstream source produces. If they diverge, the install is authoritative for behavior; flag the divergence.

### Tertiary — the f1-modeling repo

Path: `/home/rookslog/workspace/projects/f1-modeling/`

This is the **canonical source of doctrine**. CLAUDE.md is authoritative for what doctrine GSD must learn to enforce. The `.planning/` tree provides realized examples of the doctrine applied.

Note: `.planning/` is actively being modified by a parallel Claude session running `/gsd:execute-phase 3.2 --auto`. Read-only access only. Do not edit anything outside `.planning/initiatives/gsd-local-migration-2026-05/`.

### Fenced-off sources (do not read or cite)

- `/home/rookslog/workspace/projects/gsd-2-explore/`
- `/home/rookslog/workspace/projects/gsd-2-uplift/`
- `/home/rookslog/workspace/projects/get-shit-done-reflect/` (GSDR fork)
- `/home/rookslog/workspace/projects/get-shit-done-reflect-phase-59/`
- `/home/rookslog/workspace/projects/get-shit-done-upstream-v1.36.0/` (frozen prior snapshot)
- The `fork` remote on `get-shit-done-upstream` (it points to GSDR)

If you accidentally end up in any of these, leave and restart in the right tree.

## Investigation methodology

**Source > docs > inference.** Always.

When source and docs disagree, source wins. Annotate the drift like this:

```markdown
> **Doc-source drift:** `docs/agents/gsd-planner.md` claims the planner reads `STATE.md`, but the agent system prompt at `agents/gsd-planner.md:78-95` does not include STATE.md in its read-list. Source wins. Drift filed for upstream attention.
```

**Read the agent system prompts as if they were code.** They are. The behavior of `gsd-planner` is whatever the prompt in `agents/gsd-planner.md` tells it to do. If the prompt does not mention Vision Impact, the planner will not emit Vision Impact — full stop.

**Read templates as schemas.** Templates in `get-shit-done/templates/` are the canonical shape of agent outputs. If the template does not have a section, downstream readers will not look for one.

**Read workflow files as orchestration.** Workflow `.md` files in `get-shit-done/workflows/` are the procedural glue. They name which agent runs when and what arguments it gets.

**Run tests where possible.** A failing test is the best documentation. A passing test confirms a contract is in force.

## Required surface inventory

Your proposal MUST enumerate the following surface families and identify every file within each that is touched or must be touched. If a family is not touched, say so explicitly (and justify).

1. **Workflows** (`get-shit-done/workflows/*.md`) — at minimum `plan-phase.md`, `discuss-phase.md`, `execute-phase.md`, `verify-phase.md`. Probably also `add-phase.md`, `new-project.md`.
2. **Agents** (`agents/gsd-*.md`) — at minimum `gsd-planner.md`, `gsd-plan-checker.md`, `gsd-pattern-mapper.md`, `gsd-verifier.md`, `gsd-phase-researcher.md`, `gsd-executor.md`. Probably also `gsd-roadmapper.md`, `gsd-project-researcher.md`.
3. **Templates** (`get-shit-done/templates/*`) — at minimum the CONTEXT template, the PLAN template, and the VERIFICATION/SUMMARY template if separate. Plus `claude-md.md` if it ships a starter CLAUDE.md.
4. **References** (`get-shit-done/references/*.md`) — at minimum `agent-contracts.md`, `artifact-types.md`. Update reference docs to describe the new mandatory sections.
5. **Commands** (`commands/*.md`) — slash-command entries that may need updated help text or new entries (e.g., `/gsd:check-doctrine`).
6. **Contexts** (`get-shit-done/contexts/*.md`) — if dev/research/review modes need to know about doctrine.
7. **SDK** (`sdk/src/...`) — if there are TypeScript types representing plans/contexts, they must learn the new shape.
8. **Hooks** (`hooks/*`) — if session hooks need to surface doctrine state.
9. **Tests** (`tests/...`) — every contract change must have a corresponding test change. Identify which tests assert on the old shape.
10. **Docs** (`docs/...`) — published documentation should reflect the new doctrine requirements.

If your investigation reveals a surface I haven't named, add it. Inventory completeness is a hard requirement.

## Per-change record format

For each proposed change, write a self-contained block in the proposal:

```markdown
### UPLIFT-XX — One-line title

- **Surface:** `path/to/file` (or multiple — group by tight cohesion only)
- **Current behavior:**
  > <quote-or-summary> (cite: `path/to/file:line-range`)
- **Proposed behavior:**
  > <what changes>
- **Doctrine requirement implemented:** Vision Impact / Honesty Surface / etc. (cite CLAUDE.md line range)
- **Patch sketch:** prose or diff-ish pseudocode — enough to convey intent, NOT actual diff lines.
- **Contract dependencies:**
  - `UPLIFT-YY` — must land together because <reason>
  - `agents/gsd-other.md:line` — must be updated because <reason>
  - `tests/foo.test.ts:line` — must be updated because <reason>
- **Upstream-compatible?** Yes (could PR back) / No (f1-modeling-specific overlay) / Configurable (gate behind a config flag)
- **Risk:** Low / Medium / High, with one-line rationale
- **Testability:** how to verify after applying
- **Rollback strategy:** how to revert if the patch causes regression
```

Number changes UPLIFT-01, UPLIFT-02, ... in topological order of dependency where possible (a change with no contract dependencies first).

## Cross-cutting deliverables in the proposal

The proposal document must contain the following sections, in this order:

1. **Executive summary** — 200-400 words. What we are changing, why, expected outcome.
2. **Scope and constraints recap** — short, mirror this prompt's hard scope rules so future readers can audit context.
3. **Investigation log** — what you read, what you ran, what surprised you, doc-source drift findings.
4. **Doctrine coverage matrix** — table mapping each CLAUDE.md doctrine requirement to one or more UPLIFT-XX changes. Empty cells are failures of completeness — explain or fill.
5. **Surface inventory** — the 10 surface families above, each filled with affected files (or marked "no change, because...").
6. **Per-change records** — UPLIFT-01 through UPLIFT-NN.
7. **Contract dependency graph** — text or Mermaid diagram showing which UPLIFT-XX changes depend on which others. The reader must be able to see the wave structure at a glance.
8. **Implementation order** — explicit ordered list of UPLIFT-XX changes that respects the dependency graph. This becomes the input to the execution prompt.
9. **Test plan** — beyond the per-change "Testability" notes, an overall plan: does the upstream test suite still pass? are new tests needed? where would integration tests live?
10. **Upstream-compatible vs. f1-modeling-specific split** — categorize each UPLIFT-XX as upstreamable, overlay-only, or configurable. The user may eventually upstream the upstreamable ones.
11. **Rollback strategy (overall)** — how to back out the entire uplift if it proves problematic.
12. **Open questions for the reviewing Claude session** — explicit questions you want resolved before execution begins.
13. **Out-of-scope items observed during investigation** — things you noticed that need attention but are not in this uplift's scope. The user will triage these.

## Approval gating

After you finish the proposal document:

1. Commit on branch `docs/gsd-uplift-proposal-2026-05`:
   ```
   docs(gsd-uplift): propose LONG-ARC / VISION-aware patches to local GSD
   ```
2. Push the branch if a remote exists.
3. **Stop. Do not execute any UPLIFT-XX patches.**
4. Surface back to the orchestrating Claude session: "Proposal ready at `.planning/initiatives/gsd-local-migration-2026-05/UPLIFT-PROPOSAL.md` on branch `docs/gsd-uplift-proposal-2026-05`. NN changes proposed across MM surfaces. Awaiting review."

The user will then either:
- **Approve as-is** → orchestrator generates the execution prompt and re-delegates to a fresh Codex session.
- **Approve with revisions** → orchestrator amends the proposal or sends it back with specific revisions.
- **Reject in part or whole** → orchestrator articulates why and either revises scope or terminates.

## Out of scope — do not do these

- **Do not apply any UPLIFT-XX patches.** Proposal only.
- **Do not modify `~/.claude/get-shit-done/`** (the user-scope install).
- **Do not modify `./.claude/get-shit-done/`** in f1-modeling (the local install, post-migration).
- **Do not modify the upstream clone source** other than `git fetch && git checkout <tag>` to align with installed version.
- **Do not open upstream PRs** against `gsd-build/get-shit-done` even for clearly upstreamable changes — note them in the upstreamable category for later.
- **Do not modify f1-modeling repo files outside `.planning/initiatives/gsd-local-migration-2026-05/`.**
- **Do not touch the parallel session's work tree** (`.planning/phases/03.2-*/`).
- **Do not propose patches that re-introduce GSDR-style enforcement** (validators, typed-claim notation enforcement, etc.). Even where they would solve a doctrine gap, find an alternative pathway that does not mirror GSDR's pivoted-and-failed approach.
- **Do not propose modifying the surviving GSDR add-ons** (`gsdr:deliberate`, `gsdr:signal`, `gsdr:reflect`, `gsdr:collect-signals`). They are stable user-scope tools.
- **Do not branch off into AI-SPEC.md, UI-SPEC.md, debug, security, or other GSD modes** unless they are central to the doctrine encoding. Stay focused on planning / context / verification.

## Stop-and-ask conditions

Stop and surface back if:

- The upstream clone fails to fetch (network/auth/permission issue).
- The upstream test suite fails on a fresh checkout of v1.42.2 (this means the upstream is in a broken state and your contract assumptions are unreliable).
- You discover that the upstream package has been renamed, deprecated, or significantly refactored in a way that invalidates the doctrine-encoding strategy.
- More than 30 distinct UPLIFT-XX changes would be needed. (If so, you are likely over-scoping — recommend a phased uplift with a tier-1 minimum-viable subset and tier-2/3 follow-ups.)
- You find a contract that is fundamentally incompatible with one of the doctrine requirements (e.g., GSD has no slot for any kind of per-phase mandated section). This is unlikely but possible.
- You suspect the user-scope install at `~/.claude/get-shit-done/` is from a fork or modified source, not pristine mainline (would mean your upstream comparisons are off).

## Success criteria

- `UPLIFT-PROPOSAL.md` exists, complete per the structure above, committed on `docs/gsd-uplift-proposal-2026-05`.
- Every UPLIFT-XX change has a source citation (or marked `[inferred]`), a contract dependency list, and a testability note.
- Surface inventory is exhaustive (10 families covered).
- Doctrine coverage matrix has no empty cells (or each empty cell is explained).
- Implementation order is a valid topological sort of the dependency graph.
- Upstream-compatible vs. overlay-only split is articulated for every change.
- No code changes outside the proposal document.
- Parallel Claude session's `.planning/phases/03.2-*/` work tree is untouched.

## Final guidance

The user has said *"work without stopping for clarifying questions; make the reasonable call and continue"* — apply that within the scope of investigation and drafting. The stop-and-ask conditions above are the explicit exceptions. When in doubt about the doctrine itself, **re-read CLAUDE.md** — it is the authoritative source. When in doubt about GSD behavior, **re-read the source** at the relevant upstream path — it is the authoritative source. When source and docs disagree, source wins.

The deliverable is a document that a reviewer can read end-to-end and either approve, request revisions on, or reject — **without needing to re-investigate the codebase themselves**. Auditability and contract integrity are the two qualities that make this possible.
