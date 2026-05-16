---
document: UPLIFT-REVIEW
status: APPROVE-WITH-REVISIONS
date: 2026-05-16
reviewer: Claude (Opus 4.7) — paired review session
reviewed_artifact: .planning/initiatives/gsd-local-migration-plus-uplift-2026-05/UPLIFT-PROPOSAL.md
reviewed_commit: 85d0f00 (docs(gsd-uplift): incorporate Claude Design research guide)
proposal_authored_by: Codex CLI, prompted by codex-prompt-uplift-proposal.md + CLAUDE-DESIGN-GUIDE.md
branch: docs/gsd-uplift-proposal-2026-05
prerequisites_for_execution:
  - Required revisions A, B, C below applied (or explicitly declined with rationale)
  - Open questions 8 and 9 answered by user
companion_artifacts:
  - UPLIFT-PROPOSAL.md (the proposal under review)
  - CLAUDE-DESIGN-GUIDE.md (authoritative source for UPLIFT-11 design-tool guidance)
  - codex-prompt.md (sibling prompt for migration phase, separate scope)
  - codex-prompt-uplift-proposal.md (prompt that produced this proposal)
---

# Uplift Proposal Review — Paired Review Disposition

## Headline

**APPROVE ALL 11 UPLIFTs with three concrete revisions.** The proposal is structurally complete, citation-disciplined, fence-respecting, and faithful to both the encoding goal (LONG-ARC / VISION awareness in local GSD) and the CLAUDE-DESIGN-GUIDE.md source you commissioned for UPLIFT-11. Three minor revisions close a missing contract edge, a semantic conflation in the doctrine coverage matrix, and three guide-derived gaps in UPLIFT-11. Two open questions (8 and 9) need user input before execution.

## Per-UPLIFT disposition

| ID | Disposition | Notes |
|---|---|---|
| UPLIFT-01 | APPROVE | SDK init exposes optional doctrine paths; foundational, backward-compatible. |
| UPLIFT-02 | APPROVE | CONTEXT template adds Future-Aware Planning blocks; cites `.planning/AGENTS.md:26-31` correctly. |
| UPLIFT-03 | APPROVE | Researcher extends "Project Constraints" pattern to doctrine cleanly. |
| UPLIFT-04 | APPROVE | Pattern-mapper "seam vs. task" distinction is exactly the right framing. |
| UPLIFT-05 | APPROVE | PLAN frontmatter `future_preservation` / `tech_debt_disposition` / `doctrine_alignment` — load-bearing. |
| UPLIFT-06 | APPROVE WITH REVISION A | Add explicit dependency on UPLIFT-02. |
| UPLIFT-07 | APPROVE | SUMMARY doctrine-preservation closeout. |
| UPLIFT-08 | APPROVE | Verifier doctrine-outcome checks against named evidence classes — right antidote to subjective verification. |
| UPLIFT-09 | APPROVE (sequence last) | New-project / add-phase docs; low priority for this repo but harmless and upstreamable. |
| UPLIFT-10 | APPROVE (sequence first) | References / docs / regression boundary. Implementation order correctly puts it first to manage prompt-size budget. |
| UPLIFT-11 | APPROVE WITH OPTIONAL REVISION C | Guide-incorporated cleanly. Three minor guide-derived gaps optional. |

## Required revisions

### Revision A — Add missing contract edge: UPLIFT-02 → UPLIFT-06

**Where:** UPLIFT-06's `Contract dependencies` line and the proposal's `Contract dependency graph` section.

**Current text (proposal:158):**
> Depends on UPLIFT-05; feeds UPLIFT-07 and UPLIFT-08.

**Replace with:**
> Depends on UPLIFT-02 and UPLIFT-05; feeds UPLIFT-07 and UPLIFT-08.

**Rationale:** The plan-checker's doctrine-coverage dimension (UPLIFT-06) must read the `Protected Seams` / `Explicit Non-Decisions` / `Current Posture` / `Future Shape Notes` blocks that UPLIFT-02 introduces into CONTEXT — that is how the checker knows what counts as a "material Future Awareness item" requiring a `future_preservation` disposition in PLAN frontmatter. Without that input, UPLIFT-06's first listed check ("each material Future Awareness item has exactly one disposition in PLAN frontmatter") has no canonical source for "material."

**Graph diff:** in `Contract dependency graph` section, change the edge from UPLIFT-02 so it also flows directly to UPLIFT-06 (currently the edge only flows to UPLIFT-03 and UPLIFT-04). Add a direct line `UPLIFT-02 → UPLIFT-06` or restructure the diagram so the routing is explicit.

**Implementation order impact:** none — UPLIFT-02 already precedes UPLIFT-06 in the order.

### Revision B — Separate Vision Alignment Checkpoint from Vision Impact

**Where:** doctrine coverage matrix, and UPLIFT-02 / UPLIFT-05 prose.

**Current state:** The matrix has one row "Vision Impact" with sources `CLAUDE.md:84-87`. The local CLAUDE.md treats `Vision alignment checkpoint` (the one-line question "Does this serve the long-horizon vision, or only the immediate milestone?") and `Vision Impact` (the structured section describing what long-horizon capability is protected) as related-but-distinct doctrine items. They are mentioned in different places in CLAUDE.md and serve different functions: the Checkpoint is a self-interrogation prompt; Vision Impact is a structured section.

**Fix:** Add a row to the doctrine coverage matrix:

| Doctrine requirement | Local source | Current upstream coverage | Proposed coverage |
| --- | --- | --- | --- |
| Vision Alignment Checkpoint | `CLAUDE.md:82` (Key Conventions) | None — no upstream mechanism asks the question | UPLIFT-02 (CONTEXT generation includes a one-line Vision Alignment Checkpoint with justification when milestone-only), UPLIFT-06 (plan-checker verifies the Checkpoint is present and answered when doctrine is expected) |

Update UPLIFT-02's proposed behavior to add: *"When `VISION.md` exists or `workflow.project_doctrine` is enabled, the generated CONTEXT must include a one-line Vision Alignment Checkpoint answering 'Does this phase serve the long-horizon vision, or only the immediate milestone?', and if milestone-only, record why the work is still justified."*

Update UPLIFT-06's proposed behavior to add the Checkpoint as a checked item.

**Rationale:** Conflating these makes the encoding lossier than the doctrine. The Checkpoint catches phases that are milestone-only-without-justification; Vision Impact prevents bare assertions of vision relevance. Both are needed.

### Revision C — Three minor guide-derived additions to UPLIFT-11 (optional)

These are derived from CLAUDE-DESIGN-GUIDE.md content that UPLIFT-11 captured incompletely. Marked optional because UPLIFT-11 is already strong; the user may decide these belong in execution-phase refinements or follow-up PRs.

#### C.1 — Add `source_of_truth_rule:` field to DESIGN-SYSTEM.md schema

**Guide source:** CLAUDE-DESIGN-GUIDE.md §12 ("When the design system in Claude Design and our Figma library disagree, which wins?") and §3 ("Use Claude Design before the Figma file exists; use Figma when the design system is the source of truth").

**Why:** Without an explicit source-of-truth rule, drift between the two systems is a slow-running failure mode that surfaces only at handoff time. Recording the rule once, alongside owner, prevents per-phase rediscovery.

**Patch:** in UPLIFT-11's DESIGN-SYSTEM.md schema description (proposal:225), add `source_of_truth_rule` (e.g., "Claude Design system is exploratory; Figma library is canonical for production tokens" — or the inverse if Claude Design becomes canonical for this project).

#### C.2 — Make hi-fi component drift an explicit DESIGN-HANDOFF.md expectation

**Guide source:** CLAUDE-DESIGN-GUIDE.md §7.2 ("Even with codebase connection, hi-fi output isn't 1:1 with our component library — spacing drifts, components don't always match") and §11 ("Hi-fi components are not pixel-perfect against production libraries. Expect drift; correct in Code, not in Design").

**Why:** UPLIFT-11 implicitly handles this via "handoff code is reference-only," but a downstream reader could easily read "reference-only" as "use as-is" without the explicit drift expectation. The guide treats drift as a known-and-expected condition, not a defect.

**Patch:** in UPLIFT-11's DESIGN-HANDOFF.md schema description (proposal:227), add a required field documenting expected drift from production component library and how the handoff will be reconciled (e.g., "spacing tokens to normalize to repo's design tokens; placeholder copy to be rewritten; component variants may need adaptation").

#### C.3 — Add compact-view save-error workaround to UPLIFT-11 docs

**Guide source:** CLAUDE-DESIGN-GUIDE.md §10 ("Compact view triggers save errors on certain layouts. Switch to full view if a save fails").

**Why:** Operational bug workaround that's easy to forget. Belongs in the docs touched by UPLIFT-10 + UPLIFT-11.

**Patch:** in UPLIFT-11's patch sketch (proposal:230), add: *"Document the compact-view save-error workaround as an operational note alongside the disappearing-comment workaround."*

## Open question dispositions

Numbering matches `UPLIFT-PROPOSAL.md` §"Open questions" (proposal:328-336).

| # | Question | Disposition |
|---|---|---|
| 1 | Feature name: `project_doctrine` / `future_awareness` / `planning_doctrine`? | **AGREE with proposal recommendation: `project_doctrine`.** Generic, upstream-friendly, doesn't lock the term to one project's vocabulary. |
| 2 | File-presence vs. config opt-in for gates? | **AGREE: file presence enables section generation; `.planning/config.json` controls blocking gates.** Sensible safety valve — projects can opt into doctrine awareness without opting into blocking enforcement. |
| 3 | When to read VISION.md? | **AGREE: default to LONG-ARC.md + TECH-DEBT.md; load VISION.md when CONTEXT/ROADMAP/CLAUDE.md cites it or when phase is about product identity.** Avoids over-importing future scope into routine phases. |
| 4 | Tech-debt disposition required for all plans or only when intersecting registered seams? | **AGREE: only when files / interventions intersect registered seams.** Otherwise plans bloat with `tech_debt_disposition: []` noise. |
| 5 | Phase-4 Contract Completion naming? | **AGREE: upstream as "named future contract completion" (generic); F1 overlay keeps the literal "Phase-4" label.** One of the few overlay-specific labels worth preserving in this repo. |
| 6 | Plan-check doctrine failures: block by default or warn? | **AGREE: block on dropped explicit Protected Seams and missing tech-debt dispositions when files intersect registered seams; warn on softer Vision Impact wording, Honesty Surface, Accessibility, Performance Budget.** This is the only sustainable default — block on objective violations, warn on subjective ones. |
| 7 | Claude Design intake: first-class workflow flag or artifact convention? | **AGREE: start as artifact convention.** Avoids new command surface while Claude Design remains research preview. Promote to flag after a successful pilot or after Anthropic ships the public API. |
| 8 | Who owns Claude Design design system and source-of-truth sync? | **NEEDS USER INPUT.** For this repo, you are the sole maintainer — the question collapses to "what cadence do you set for refreshing the Claude Design design system as the F1 Modeling Lab UI evolves?" Suggest documenting in DESIGN-SYSTEM.md as `owner: Logan Rooks`, `review_cadence: quarterly or on substantive UI doctrine change`. The source-of-truth question is separate — see Revision C.1; the proposed default for this repo is *"Claude Design system is exploratory; CLAUDE.md / `.planning/VISION.md` honesty + accessibility constraints are canonical."* |
| 9 | Codex vs. Claude Code handoff: pilot first? | **NEEDS USER INPUT.** Guide §8 treats Codex handoff as extrapolation, not documented practice. Pilot recommendation: pick one upcoming UI-heavy plan (e.g., a future Phase 4+ visualization plan), do the design in Claude Design, do the handoff via both Claude Code (proper path) and Codex (extrapolated path), compare fidelity, document in `.planning/initiatives/gsd-local-migration-plus-uplift-2026-05/HANDOFF-PILOT-NOTES.md`. Until the pilot lands, treat Codex handoff as best-effort reference-only. Question for you: are you willing to spend the Claude Design quota on a deliberate pilot before broader adoption, or is it acceptable to learn handoff fidelity through normal use? |

## Pre-conditions for the execution prompt

The execution prompt (`codex-prompt-uplift-execution.md` — does not yet exist) should be written only after:

1. **Revision A applied** (UPLIFT-02 → UPLIFT-06 contract edge documented in proposal).
2. **Revision B applied** (Vision Alignment Checkpoint split from Vision Impact in coverage matrix, UPLIFT-02 and UPLIFT-06 prose updated).
3. **Revision C decided** (apply, defer to follow-up, or decline with rationale).
4. **Questions 8 and 9 answered** (so the execution prompt can name an owner and a pilot scope for UPLIFT-11).
5. **Execution branch chosen** — likely `chore/gsd-uplift-2026-05` or similar; the execution prompt should explicitly forbid the docs branch this review is on.
6. **Execution-target install confirmed** — patches should land on the *local* `./.claude/get-shit-done/` post-migration, NOT on `~/.claude/get-shit-done/` (user-scope). The migration prompt (`codex-prompt.md` in this same folder) should run before or alongside the execution prompt; if not yet run, the execution prompt must inherit migration as a prerequisite.

## Audit trail / prior-review corrections

For transparency in the record (and so a future agent reading this can avoid the same errors):

1. **Stale-version review error.** My initial reading was against commit `c162d88` of UPLIFT-PROPOSAL.md (the original 11-UPLIFT version). Commit `85d0f00 docs(gsd-uplift): incorporate Claude Design research guide` landed after that read, expanding UPLIFT-11 substantively. The folder was also renamed in `4baaab5 feat(gsd): add migration and uplift proposals for GSD-1` (`gsd-local-migration-2026-05` → `gsd-local-migration-plus-uplift-2026-05`). My initial review missed both because I did not re-read or re-check git log between proposal generation and assessment. **Mitigation for future paired reviews:** always re-read the proposal file and check `git log --oneline -10 <path>` for any updates between the original read and the disposition draft.

2. **UPLIFT-11 scope-creep claim retracted.** I initially flagged UPLIFT-11 (Claude Design intake) as scope creep, asserting it was not in the original ask. The user (correctly) pointed out they had explicitly requested it and had commissioned `CLAUDE-DESIGN-GUIDE.md` as authoritative input to Codex. Codex did exactly what was asked. **Mitigation for future paired reviews:** when assessing scope, baseline against the user's full ask (including out-of-band channel additions, attached references, briefing artifacts) — not solely against the orchestrator-authored prompt. Files that exist in the initiative directory at proposal-generation time are presumed in-scope input unless explicitly excluded.

3. **My migration prompts now sit at a renamed path.** Commits `e079d23` and `a53685b` reference `.planning/initiatives/gsd-local-migration-2026-05/codex-prompt.md` and `codex-prompt-uplift-proposal.md`. Those files now live under `gsd-local-migration-plus-uplift-2026-05/` per the rename. Not a defect — git history is intact — but worth knowing if anyone follows commit references.

## What still stands from prior review (unchanged)

- **Citation discipline: A.** 8/8 spot-checks held on first review (`.planning/AGENTS.md:26-31`, `.planning/LONG-ARC.md:70-75`, `agents/gsd-phase-researcher.md:79`, `templates/context.md:23-73`, `agents/gsd-planner.md:421-456`, `agents/gsd-plan-checker.md:300-312`, `sdk/src/types.ts:865-882`, grep for `preserved_seam|future_preservation|doctrine_alignment` → no upstream hits).
- **Structural conformance: A.** All 13 required sections present and substantive.
- **Surface inventory: A.** All 10 families covered; hooks and contexts actively excluded with rationale (real fences, not oversights).
- **Fenceposts: A.** GSD-2, GSDR fork, v1.36.0 snapshot, `fork` remote — none cited or drawn from.
- **Investigation rigor: A.** Upstream tests 9211/9211 pass; doctrine grep zero hits; version metadata drift surfaced (`v1.42.2` tag with `1.50.0-canary.0` banner); npm audit vulnerabilities flagged.
- **Implementation order: A.** Honors DAG; references-first manages prompt-size budget (`tests/agent-size-budget.test.cjs` is a real constraint).
- **Upstreamability split: A.** Most changes are file-presence/config gated; PRable upstream after pilot.

## Sign-off

- **Reviewer (Claude Opus 4.7, paired review session):** APPROVE with Revisions A, B, and (optionally) C, conditional on user answers to Questions 8 and 9.
- **User countersign (required before execution prompt drafting):** \_\_\_\_\_\_\_\_\_\_\_ (date / decision on Revisions / answers to Q8 + Q9)
