---
document: CODEX-PROMPT
status: ready-to-delegate
type: proposal-revision-task-prompt
created: 2026-05-16
purpose: Apply paired-review revisions to UPLIFT-PROPOSAL.md, add a propagation-path analysis (Revision D), and run a scoped discovery pass for source-level second-order effects with hard caps
target_executor: Codex CLI (deep-reasoning model preferred — gpt-5.4 or equivalent)
expected_runtime: 60-120 min (most of it is the scoped discovery, not the surgical edits)
predecessor: UPLIFT-PROPOSAL.md @ commit 85d0f00, UPLIFT-REVIEW-2026-05-16.md @ commit d3a0328
successor: codex-prompt-uplift-execution.md (does not exist yet; written after this round + user answers to open Q8/Q9)
branch: docs/gsd-uplift-proposal-2026-05 (commit on this branch — do not create new branches, do not merge)
---

# Codex Task — Revise UPLIFT-PROPOSAL Per Paired Review + Scoped Source-Layer Discovery

## Who is asking, and why

You are being delegated to by the same Claude session that orchestrated the original proposal investigation. The user (a philosophy PhD student building the F1 Modeling Lab) and the orchestrating Claude session have done a paired review of UPLIFT-PROPOSAL.md. The review is at `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/UPLIFT-REVIEW-2026-05-16.md` (committed `d3a0328`).

Outcome of review: **APPROVE all 11 UPLIFTs with revisions**. Three revisions are surgical edits (A, B, C). One revision (D) requires fresh investigation because the original proposal investigated the workflows/agents/templates/SDK-source layer thoroughly but did NOT drill into the *compiled* runtime layer at `bin/lib/*.cjs` and did not articulate how SDK-source patches propagate to the installed runtime.

This prompt asks for three deliverables in order: (1) apply surgical revisions A/B/C; (2) investigate and add Revision D; (3) run a tightly-scoped source-layer discovery pass with hard caps on what becomes a new UPLIFT versus a catalog item.

## Read these first

1. `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/UPLIFT-REVIEW-2026-05-16.md` — the disposition with rationale and patches already articulated for A, B, C. **The patches are spelled out as find-and-replace operations.** Do not re-derive them.
2. `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/UPLIFT-PROPOSAL.md` — the proposal to revise.
3. `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/CLAUDE-DESIGN-GUIDE.md` — already incorporated; do not re-investigate.
4. `/home/rookslog/workspace/projects/f1-modeling/CLAUDE.md` — doctrine source. Re-read only if Revision B's Vision Alignment Checkpoint vs. Vision Impact distinction is unclear.

## Source materials (unchanged from prior prompt)

- Upstream clone: `/home/rookslog/workspace/projects/get-shit-done-upstream/` — already checked out at `v1.42.2`, commit `a7f0af2c`. Confirm before investigating; do not switch tags.
- Installed user-scope GSD: `~/.claude/get-shit-done/` (v1.42.2, source of compiled `.cjs` runtime layout).
- f1-modeling repo: `/home/rookslog/workspace/projects/f1-modeling/` — read-only outside this initiative directory.

## Fenced-off sources (unchanged from prior prompt — do not draw from)

- `/home/rookslog/workspace/projects/gsd-2-explore/`
- `/home/rookslog/workspace/projects/gsd-2-uplift/`
- `/home/rookslog/workspace/projects/get-shit-done-reflect/`
- `/home/rookslog/workspace/projects/get-shit-done-reflect-phase-59/`
- `/home/rookslog/workspace/projects/get-shit-done-upstream-v1.36.0/`
- The `fork` remote on `get-shit-done-upstream` (points to GSDR)

## Deliverable 1 — Apply Surgical Revisions A, B, C

The review's Revisions A, B, and C are specified as patches in `UPLIFT-REVIEW-2026-05-16.md` §"Required revisions". Apply them as-given.

### Revision A — Missing contract edge UPLIFT-02 → UPLIFT-06

In `UPLIFT-PROPOSAL.md`:

- **Line 158** (UPLIFT-06 `Contract dependencies`):
  - Find: `Depends on UPLIFT-05; feeds UPLIFT-07 and UPLIFT-08.`
  - Replace with: `Depends on UPLIFT-02 and UPLIFT-05; feeds UPLIFT-07 and UPLIFT-08.`
- **Contract dependency graph section** (around lines 239-275): add an explicit edge so that UPLIFT-02 flows directly to UPLIFT-06 in addition to UPLIFT-03/04. Either redraw the diagram with the additional edge or add a one-line annotation that UPLIFT-02 also feeds UPLIFT-06 directly.

### Revision B — Split Vision Alignment Checkpoint from Vision Impact

In `UPLIFT-PROPOSAL.md`:

1. **Doctrine coverage matrix** (lines 48-60): add a new row immediately under the "Vision Impact" row:

```markdown
| Vision Alignment Checkpoint | `CLAUDE.md:82` (Key Conventions) | None — no upstream mechanism asks the question | UPLIFT-02 (CONTEXT generation includes a one-line Vision Alignment Checkpoint with justification when milestone-only), UPLIFT-06 (plan-checker verifies the Checkpoint is present and answered when doctrine is expected) |
```

2. **UPLIFT-02 "Proposed behavior"** (line 96): append to the end of that bullet:
   > Additionally, when `VISION.md` exists or `workflow.project_doctrine` is enabled, the generated CONTEXT must include a one-line `## Vision Alignment Checkpoint` answering "Does this phase serve the long-horizon vision, or only the immediate milestone?", and if milestone-only, record why the work is still justified.

3. **UPLIFT-06 "Proposed behavior"** (lines 151-155): add a fifth bullet to the checked-items list:
   > - the Vision Alignment Checkpoint is present in CONTEXT and answered (one-line question + justification if milestone-only) whenever doctrine is expected.

### Revision C — Three minor UPLIFT-11 additions (apply all three; they are small)

In UPLIFT-11 (line 220-235):

1. **DESIGN-SYSTEM.md schema** (line 225 — the `DESIGN-SYSTEM.md` bullet): append: *"Includes an explicit `source_of_truth_rule` field naming which system wins when the Claude Design design system and any future external design source (Figma library, brand-kit, etc.) disagree. Default for projects without a competing source-of-truth: `Claude Design system is exploratory; CLAUDE.md and .planning/VISION.md honesty + accessibility constraints are canonical.`"*

2. **DESIGN-HANDOFF.md schema** (line 227 — the `DESIGN-HANDOFF.md` bullet): append: *"Includes an explicit `expected_drift` field documenting that hi-fi Claude Design output is not 1:1 with the production component library — naming the drift areas typically observed (spacing tokens, component variants, placeholder copy) and how each will be reconciled at implementation time."*

3. **Patch sketch** (line 230): add at the end: *"Document the compact-view save-error workaround alongside the disappearing-comment workaround."*

### Verify after applying A/B/C

- Read the modified file end-to-end.
- Confirm no broken cross-references (the matrix row's UPLIFT references must resolve to existing per-change records).
- Confirm the contract dependency graph in §"Contract dependency graph" is internally consistent after Revision A.
- Citations introduced by A/B/C should remain in the same `path/to/file:line` style as the rest of the proposal.

## Deliverable 2 — Revision D: Propagation Path Analysis

The original proposal investigates `sdk/src/*.ts` (TypeScript source) but the installed local GSD ships **compiled `.cjs`** at `./.claude/get-shit-done/bin/lib/`. There is no articulated path from "edit TypeScript in upstream-clone" to "patch lands in local install and survives `gsd-update`."

### Investigation steps

1. **Map the upstream build pipeline.** Read `package.json` (root + `sdk/package.json`), any TypeScript config, and any build scripts. Identify: where does the package "build" output go? Which `bin/` files are hand-authored CJS vs. compiled from TS? Cite source.

2. **Map the install pipeline.** Read `bin/install.js` end-to-end. What does the installer copy into `./.claude/get-shit-done/`? Does it copy TS source, compiled CJS, or both? Where does `verify-reapply-patches.cjs` (`bin/verify-reapply-patches.cjs` — read this file fully) fit in? Cite source.

3. **Map the update pipeline.** Read `get-shit-done/workflows/update.md` fully (especially the install / verify-reapply-patches steps). What survives across `gsd-update`? What gets overwritten?

4. **Identify the SDK-source-to-runtime path.** For UPLIFT-01's specific edits at `sdk/src/query/init.ts:500-539` and `sdk/src/types.ts:870-882`, trace where the equivalent code lives in the installed `bin/lib/*.cjs`. Likely targets: `bin/lib/core.cjs`, `bin/lib/artifacts.cjs`, or a compiled-from-TS sibling. Open the relevant `.cjs` and confirm or correct.

### Options to evaluate

For each, capture: scope of work, fragility, `gsd-update` survival, upstream compatibility, rollback shape.

- **Option D-1: Fork-then-build.** Fork `gsd-build/get-shit-done`, apply patches to `sdk/src/*.ts`, run upstream's build, copy compiled output into `./.claude/get-shit-done/`. Re-fork & rebuild on each upstream version.
- **Option D-2: In-place `.cjs` patch.** Patch the relevant `bin/lib/*.cjs` files directly in `./.claude/get-shit-done/`. Register patches with `verify-reapply-patches.cjs` so they re-apply after `gsd-update`. (Investigate whether `verify-reapply-patches.cjs` has a public API for registering external patches.)
- **Option D-3: Overlay adapter.** Add a thin wrapper at `./.claude/get-shit-done/bin/lib/overlays/` (or similar) that monkey-patches SDK init results post-call, leaving shipped files untouched. Most fragile but lowest blast radius.
- **Option D-4: Upstream-PR-first.** Land UPLIFT-01..10 in `gsd-build/get-shit-done` as configurable behavior, then pull mainline. Slowest, cleanest. Tier-2 only.
- **Option D-5: Hybrid (recommend if applicable).** E.g., D-1 for SDK/template changes, D-3 for runtime-only behavior changes.

### Output: a new section in `UPLIFT-PROPOSAL.md` titled `## Revision D — SDK propagation path`

Place after the existing `## Rollback strategy overall` section, before `## Open questions`. Structure:

1. **Current state observed** — source-cited findings about the build/install/update pipeline.
2. **Options evaluated** — table comparing D-1 through D-5.
3. **Recommendation** — one option (or hybrid) with rationale tied to the user's constraints (solo maintainer, long-arc patches survive `gsd-update`, minimal upstream coordination, F1-modeling overlay character).
4. **Implications for existing UPLIFTs** — does the recommendation change UPLIFT-01's surface (e.g., from "edit `sdk/src/*.ts`" to "patch `bin/lib/core.cjs` + register with verify-reapply-patches")? If so, update UPLIFT-01's "Surface" and "Patch sketch" lines accordingly.
5. **`verify-reapply-patches.cjs` integration** — explicit answer: do our patches need to be registered with it, and if so, how?

## Deliverable 3 — Scoped Source-Layer Discovery (Hard Caps Apply)

While investigating the propagation path (Deliverable 2), you will read substantial source under `bin/`, `bin/lib/`, `bin/shared/`, and `scripts/`. **Use this read pass to also surface source-level findings the original investigation missed** — but with strict guardrails to prevent scope bloat.

### What counts as a finding worth elevating to a new UPLIFT

A finding becomes a new UPLIFT (UPLIFT-12, UPLIFT-13, UPLIFT-14) only if it meets one of these bars:

- **Bar 1 — Required second-order effect.** UPLIFT-01..11 cannot land cleanly without this change. Example: UPLIFT-06 introduces `workflow.project_doctrine_gate` config — if `bin/lib/config-schema.cjs` does not allow this config key, the gate config will be rejected at load time. This is a required second-order effect and must become a new UPLIFT.
- **Bar 2 — Underweight doctrine row.** A row in CLAUDE.md's doctrine list (Vision Impact, Honesty Surface, Accessibility, Performance Budget, Migration Discipline, Phase-4 Contract Completion, Vision Alignment Checkpoint, Future Awareness) is currently mapped to only one or two UPLIFTs in a way that creates a brittle single-point implementation, and a source-layer change would distribute the coverage more robustly.
- **Bar 3 — Minimal-cost, maximal-impact additive.** A change small enough to be specified in 5-10 lines of patch sketch, with categorical-new impact (not a refinement of an existing UPLIFT), where the impact is *load-bearing* for the doctrine encoding's working-as-intended behavior. Example candidate: extending `bin/lib/drift.cjs` to detect doctrine-field drift across artifacts (CONTEXT → PLAN → SUMMARY → VERIFICATION).

### Hard caps

- **Maximum 3 new UPLIFTs (UPLIFT-12 through UPLIFT-14).** If you have more candidates than that, the lowest-bar ones go to the catalog instead.
- **No new UPLIFT may reopen UPLIFT-02..10.** Refinements to those go via the revision pattern (A/B/C/D), not new UPLIFTs.
- **No new UPLIFT may touch fenced surfaces.** Hooks, generic context profiles, GSDR-style signal/reflection/knowledge-base machinery, GSD-2 anything — all still fenced.
- **No new UPLIFT may add new slash commands or new GSD modes** (AI-SPEC, UI-SPEC, debug, security beyond what already exists). The proposal's "no new command surface" stance holds.
- **Each new UPLIFT must cite source** at file:line precision (same discipline as UPLIFT-01..11) and must enumerate contract dependencies.

### Catalog format for findings that did not meet the bar

After the new UPLIFT records (if any), add a `## Catalog — observed but not proposed as UPLIFT` section. For each cataloged finding:

```markdown
### CATALOG-NN — One-line title

- **Surface:** `path/to/file:line`
- **Observation:** what you saw (cited)
- **Why it's not an UPLIFT:** which bar it failed (e.g., "would require reopening UPLIFT-05's scope", "speculative — no concrete second-order chain to UPLIFT-01..14", "small but not load-bearing")
- **Severity:** Low / Medium / High (severity for the local install's correctness, not for upstream)
- **Effort to address if revisited:** Hours / Days / Weeks
- **Trigger to revisit:** what future condition would make this worth elevating
```

Aim for completeness on the catalog — better to list 10 cataloged items the user can triage than to silently drop them.

### Where to put new UPLIFTs in the proposal

- Insert UPLIFT-12..14 records (if any) after UPLIFT-11 and before `## Contract dependency graph`.
- Update the **Contract dependency graph** section to include the new UPLIFTs and their dependencies on UPLIFT-01..11.
- Update the **Implementation order** section to slot the new UPLIFTs into the topological order. New UPLIFTs that are *required* second-order effects (Bar 1) should land near their dependent UPLIFT in the order, not at the end.
- Update the **Doctrine coverage matrix** if any new UPLIFT covers a previously underweight row.
- Update the **Upstream-compatible vs f1-modeling-specific split** to categorize each new UPLIFT.

## Stop-and-ask conditions

- The propagation path investigation reveals that **no minimal-cost local-patch path exists** — i.e., the only viable option is full fork-then-build (D-1). This is a substantial commitment and the user should hear about it before you write the recommendation.
- The scoped discovery surfaces a finding that would **force a Bar 1 (required second-order) change of more than 50 lines of patch sketch**. This may indicate UPLIFT-01..11 needs scope revisiting, not just a new addition.
- More than 5 candidate findings meet Bar 1 (required second-order). This means the original surface inventory missed substantial scope — surface back rather than picking three.
- You find that `verify-reapply-patches.cjs` does NOT support registering external patches, and the only path to surviving `gsd-update` requires changes to that script itself. (Per fence, that script is currently not in any UPLIFT — be deliberate about adding it.)
- You find that the user-scope `~/.claude/get-shit-done/` install does not match upstream `v1.42.2` source in unexpected ways (suggests the user's install is modified or from a fork, which would invalidate proposal assumptions).

## Out of scope (do not do these)

- Do not apply any patches to upstream, the local install, or user-scope GSD.
- Do not modify f1-modeling repo files outside `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/`.
- Do not modify the proposal's existing UPLIFT-01..11 records beyond what Revisions A/B/C/D require.
- Do not modify any of the fenced surfaces (hooks for doctrine, context profiles for doctrine, slash command surface).
- Do not propose changes that would reintroduce GSDR-style enforcement (validators, typed-claim notation, signal/knowledge-base machinery).
- Do not open upstream PRs.
- Do not answer Open Questions 8 and 9 in the proposal — those are deferred to user input and will be resolved separately.
- Do not draft the execution prompt; that's a later step after user countersign.

## Commit and verify

1. All changes must land on branch `docs/gsd-uplift-proposal-2026-05` (already the current branch). Do not create new branches. Do not merge.

2. Commit in two coherent chunks:

   **Commit 1 — Surgical revisions (A/B/C):**
   ```
   docs(gsd-uplift): apply revisions A/B/C from paired review

   - Revision A: add UPLIFT-02 → UPLIFT-06 contract edge
   - Revision B: split Vision Alignment Checkpoint from Vision Impact
   - Revision C: three minor UPLIFT-11 additions (source-of-truth rule,
     expected hi-fi drift, compact-view workaround)
   ```

   **Commit 2 — Propagation path + scoped discovery:**
   ```
   docs(gsd-uplift): add Revision D propagation path + new UPLIFTs/catalog

   - Revision D: SDK-source-to-runtime propagation path analysis,
     [N] options evaluated, recommendation [option-id]
   - [N new UPLIFTs, if any: UPLIFT-12 through UPLIFT-NN]
   - [M cataloged findings, if any]
   - Implementation order and dependency graph updated
   ```

3. After commits, verify:
   - `git status` shows clean tree on `docs/gsd-uplift-proposal-2026-05`.
   - `git log --oneline -5` shows your two commits on top.
   - Read the final `UPLIFT-PROPOSAL.md` end-to-end and confirm internal consistency (no broken UPLIFT-XX references, dependency graph reflects new edges, implementation order is a valid topological sort, surface inventory mentions any newly-touched bin/scripts/ files, doctrine coverage matrix has no orphaned cells).

4. Stop. Surface back to the orchestrating Claude session:
   - Number of revisions applied (always 4: A, B, C, D — note if any partial)
   - Number of new UPLIFTs proposed (0 to 3)
   - Number of cataloged findings (any count)
   - Recommended propagation option (D-1..D-5 or hybrid)
   - Any stop-and-ask conditions hit

## Success criteria

- Revisions A, B, C applied as specified.
- Revision D investigated and added as a new section, with source-cited findings and one recommended option (or hybrid).
- 0 to 3 new UPLIFTs added that meet the bars; catalog populated with everything that didn't.
- Surface inventory, doctrine coverage matrix, contract dependency graph, implementation order, and upstream-compatibility split all updated coherently to reflect the additions.
- Two coherent commits on `docs/gsd-uplift-proposal-2026-05` branch.
- No code changes outside the proposal document.
- Parallel Claude session's work tree (`.planning/phases/03.2-*/`) untouched.

## Final guidance

The original proposal investigation was thorough at the surface-family level. This revision pass is meant to (a) close the small per-UPLIFT gaps that paired review surfaced and (b) drill one level deeper — into the actual compiled runtime — so the execution prompt that follows has a clean propagation story.

The hard caps exist because we are *days* from drafting the execution prompt, not weeks. Three new UPLIFTs maximum. A catalog of cataloged findings is more useful than a sprawl of new UPLIFTs that get cut later.

When in doubt about whether a finding clears Bar 1/2/3, default to cataloging. Cataloging preserves the discovery; an UPLIFT that gets cut later wastes review cycles.

The user has said *"work without stopping for clarifying questions; make the reasonable call and continue"* — apply that here too within the scope above. The stop-and-ask conditions are the explicit exceptions.
