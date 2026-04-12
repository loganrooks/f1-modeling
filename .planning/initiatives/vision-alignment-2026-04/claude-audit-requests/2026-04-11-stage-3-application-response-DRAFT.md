# DRAFT — Stage 3 Application Audit (Pre-Formal-Request Working Notes)

## ⚠️ DRAFT STATUS — READ THIS FIRST

**This is a DRAFT audit, not the formal response.** It was produced in a Claude Opus 4.6 session **before** Codex wrote the formal audit request at `2026-04-11-stage-3-application-request.md`. The sequence was:

1. User asked Claude for a review of all Stage 3 artifacts to help decide what to implement
2. Claude performed a substantive review in-conversation (informal advisory mode)
3. Claude noted at the end of the review that Stage 3 application is a scheduled formal audit moment per `CODEX-ORCHESTRATOR-HANDOFF.md` and recommended treating the review as the formal audit or writing a proactive response file
4. User relayed this to Codex, who then wrote the formal audit request per the protocol
5. This DRAFT was saved so the fresh Claude session performing the formal audit can use it as input rather than re-deriving findings from scratch

**Fresh Claude session performing the formal audit:** treat this DRAFT as an input working document, not as authoritative output. Read the formal request at `2026-04-11-stage-3-application-request.md`, read the Stage 3 artifacts fresh, apply your own judgment, and write the formal response to `2026-04-11-stage-3-application-response.md` (without the `-DRAFT` suffix). The formal response may agree with this draft, disagree with it, or reach different conclusions — the point of the formal audit is independent judgment.

**Do not apply the Stage 3 proposals to project files based on this draft.** The draft is not a protocol-level artifact. Only the formal response (after it is written per the request's instructions) is authoritative for the Stage 3 application gate.

---

## Bottom Line (from the informal review)

**Stage 3 is application-ready with three minor refinements.** The synthesis honors D1-D5 accepted commitments, incorporates the D4 post-hoc audit corrections (Phase 4.1 framing + `AccessibleChartContract` + `packages/visuals` zero-tests), produces actionable diff guidance for ROADMAP.md + CLAUDE.md, and reconciles all three required tech-debt sources (D4.D, audit-response registry, D2 underspec signal) into a clean 11-entry registry.

Confidence at draft time: **high** on application-readiness; **high** on the minor refinements being minor.

## What the informal review confirmed (Stage 3 got these right)

### Stage 3A roadmap structure
1. **Three-insertion pre-Phase-4 structure** — `3.2` (Backend Execution + Regulation Execution Flow), `3.3` (Viz Substrate + Shell + Performance), `3.4` (Educational Foundation + Minimal Regulation Semantics). Matches D4.A's binding (distinct insertions, not folded foundation wave). Plan breakdowns are granular (5 plans each) without over-specifying.
2. **Dependency chain is explicit and correct** — `3.1 → 3.2 → 3.3 → 3.4 → 4 → 4.1 → 5 → 5.1 → 6 → 7 → 8 → v2 → v3 → v4+`. Each boundary has explicit reasoning.
3. **Phase 3.4 packaged as single phase** — correctly defers to D3's `[FOLLOW-AND-MARK]` gray area ("one phase vs two adjacent decimals") and picks one phase with explicit dual-lane plan breakdown.
4. **Phase 4.1 corrected framing applied** — `roadmap-evolution.md:98-111` explicitly uses the post-hoc-audit-corrected framing ("current Phase 4.1 already spans synthetic sensors, observer work, and observer-aware timeline/learning surfaces... the rewrite needed is 'make Phase 4.1 consume D1 checkpointed artifacts, D2 linked temporal interaction, and D3 guided overlays'"). The "broadened from 'EKF later'" framing is explicitly marked as wrong.
5. **Phase 5 formal split to 5 + 5.1** — D4.B left this as Stage 3A's judgment call (formal decimal or explicit sub-waves). Formal decimal is defensible and makes the optimization/trajectory dependency more visible.
6. **Phase 8 narrowing** — "First Regulation and Design Exploration Wave" with explicit scope-out of full multi-era breadth to v2+. Matches D4.B.
7. **v2/v3/v4+ thematic projection** — names the themes but explicitly refuses to fabricate plan counts or exact sub-phase trees. Matches D4.C discipline.
8. **"Open Packaging Choices Reserved for User"** section (`roadmap-evolution.md:210-217`) — Stage 3A explicitly flags four specific choices where the user may diverge from its recommendation. Good epistemic hygiene.

### Stage 3B guardrails
9. **CLAUDE.md diff text is concrete and patch-ready** — `guardrails-proposal.md:54-85` shows actual diff syntax, not prose. Can be applied mechanically.
10. **All eight accepted commitments covered** — WCAG AA (accessibility gate), Apollo-over-Tailscale (thin-client gate), legacy SVG freeze (migration gate), vision-alignment checkpoint (D4.D phase-gate question), benchmark evidence (D4.D reporting path), `AccessibleChartContract` + `AnchorRegistry` obligation (interface-completeness gate), visible honesty labeling (honesty gate), semantic relation vocabulary (semantic honesty gate).
11. **10-item phase-gate checklist** covers the full substrate discipline without duplication.
12. **CONTEXT.md/PLAN.md template additions** (Vision Impact, Honesty Surface, Accessibility and Thin-Client, Performance Budget, Migration Discipline, Phase-4 Contract Completion) operationalize the guardrails at planning time.

### Stage 3B tech-debt registry
13. **11 entries with explicit reconciliation** — all three required sources covered per the Reconciliation Summary section (D4.D's 7 rewrite triggers, audit-response's 8 initial items, D2 underspec signal). `AccessibleChartContract` (VA-TD-09) and `packages/visuals` zero-tests (VA-TD-06) are present as their own entries per the post-hoc audit's explicit carry-forward requirement.
14. **Each entry has severity + source traceability + phase/milestone target** — registry is scannable and load-bearing fields are consistent.
15. **Computational core entry** (VA-TD-07) correctly targeted to `milestone_target: v2 numerical deepening` rather than a v1 phase — matches D4.C's trigger-gated framing.

### SUMMARY.md
16. **Names the right next-step artifacts** — `SUMMARY.md:19-29` lists the nine files that matter most for onboarding and the four categories of downstream modifications needed.
17. **Concise accepted-outcome recap** for D1/D2/D3/D5/D4 without re-litigating anything.

## Minor refinements identified in the informal review

Three items, none blocking. These are cleanup suggestions for the application step, not corrections to Stage 3 outputs themselves.

### 1. Stale "deliberation pending" language in CLAUDE.md not updated by Stage 3B diff

Current `CLAUDE.md` bullet:

> `**Progressive visualization:** Visual components grow with model complexity. Don't build ahead of what the model justifies. Adopt a proper visualization library for Phase 4+ (deliberation pending).`

The `(deliberation pending)` parenthetical is now stale because D2 happened and closed. The Stage 3B diff at `guardrails-proposal.md:61` preserves this bullet unchanged while adding new bullets below it.

**Fix suggested:** in the applied CLAUDE.md edit, replace `(deliberation pending)` with something like `(see .planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md for D2 accepted closure)` or simply drop the parenthetical.

**Impact:** cosmetic; leaves a stale note if not fixed.

### 2. Tech-debt registry home not specified

`tech-debt-registry.md:7` says *"Status: proposal artifact for later maintenance"* but doesn't recommend where the durable registry lives after the initiative completes. Options:
- `.planning/TECH-DEBT.md` — standalone top-level planning file
- Inside the initiative directory as historical artifact
- Inside `.planning/` as a directory with per-item files

**Recommendation:** Apply as `.planning/TECH-DEBT.md` — matches the existing top-level planning convention (ROADMAP.md, REQUIREMENTS.md, PROJECT.md, STATE.md, VISION.md, CLAUDE.md all at that level). Reference it from the Stage 3B guardrails "Registry gate" so planning phases know where to look.

### 3. Current ROADMAP.md Phase 4 "Prerequisite" line needs removal

Current `ROADMAP.md:125`:

> *"**Prerequisite:** Visualization architecture deliberation must be completed before Phase 4 planning begins. See audit-response-2026-04-07.md finding #9."*

When Phase 4 is rewritten per Stage 3A guidance, this prerequisite note should be removed — the visualization deliberation (D2) has completed, and the real prerequisite is now the 3.2/3.3/3.4 insertions. Stage 3A's Phase 4 rewrite guidance doesn't explicitly call out removing this line.

**Fix suggested:** when patching ROADMAP.md, remove the stale prerequisite line and replace it with `**Depends on:** Phase 3.4` per Stage 3A's proposed dependency.

**Impact:** cleanup; Stage 3A probably assumed it was implicit in the Phase 4 rewrite.

## Concerns the informal review deliberately did NOT raise

For the record, these were considered but decided not to be concerns:

- **`VA-TD-02` "phase_target: 3.2-3.4 corridor" is vague** — it's deliberately a corridor because the regulation work spans execution cleanup (3.2) and semantic canonicalization (3.4). Splitting would duplicate the entry. Keeping as corridor is the right call.
- **10 phase-gate checklist items is long** — each is load-bearing and non-duplicative. Trimming would remove substance.
- **Stage 3A gives "diff guidance" not actual ROADMAP.md patch text** — this is correct per D4's "do not rewrite ROADMAP.md inside D4" discipline. The user will do the ROADMAP.md translation step at application time.
- **Phase 5.1 formal split vs sub-waves** — both options are defensible per D4.B. Stage 3A picked formal split with rationale. User can override to sub-waves if preferred without re-running any synthesis.
- **`RACE-02` / `RACE-03` requirement references in Phase 3.2 requirements mapping** — initially flagged as needing verification, then verified present at `REQUIREMENTS.md:81` and `:83`, both mapped to Phase 3.1 (already complete). Stage 3A's reference to them as "Direct continuity with existing typed-run and artifact work" for Phase 3.2 is accurate.

## Recommended application plan (from the informal review)

### Step 1 — Apply ROADMAP.md changes
Patch `ROADMAP.md` based on `synthesis/roadmap-evolution.md` and `synthesis/phase-insertion-proposals.md`. Specific edits:
1. Add three new phase entries after Phase 3.1 (3.2, 3.3, 3.4 with plan breakdowns)
2. Rewrite Phase 4 ("Strategy Workbench and Session Workflows", remove stale "deliberation pending" line, `Depends on: Phase 3.4`)
3. Rewrite Phase 4.1 ("Observer and Replay Workbench", using corrected framing)
4. Split Phase 5 into 5 and 5.1
5. Preserve Phase 6 → 7 with added honesty-labeling note
6. Narrow Phase 8 to "First Regulation and Design Exploration Wave"
7. Add v2/v3/v4+ milestone section
8. Update execution order table

### Step 2 — Apply CLAUDE.md guardrails
Patch `CLAUDE.md` using `synthesis/guardrails-proposal.md:54-85` diff text. Also update the stale `(deliberation pending)` parenthetical on the existing "Progressive visualization" bullet.

### Step 3 — Create `.planning/TECH-DEBT.md`
Copy the 11-entry registry from `synthesis/tech-debt-registry.md` to a new standalone top-level file.

### Step 4 — Update phase planning template / CLAUDE.md conventions
Add the six template sections from `guardrails-proposal.md:102-126` to the CONTEXT.md / PLAN.md expectations.

### Step 5 — Resume `/gsdr:plan-phase 04` against the revised sequence

## Things the fresh formal audit should verify independently

The informal review reached these conclusions without cross-checking every detail. Items to verify in the formal audit:

1. **Read the D2 decision anchor and D2 full deliberation fresh.** The informal review leaned on in-session memory of D2's content. Verify that Stage 3A's Phase 4.1 rewrite framing matches D2's actual outputs and the post-hoc D4 audit corrections.

2. **Read `ROADMAP.md` fresh against the Stage 3A diff guidance.** Verify that the structural mis-cut findings (Phase 4 too broad, Phase 5 too broad, Phase 8 implies full multi-era) are grounded in actual current ROADMAP.md content, not just Stage 3A's assertion.

3. **Check whether the Stage 3B diff has any other stale-language issues beyond the "deliberation pending" one.** The informal review only spotted that one.

4. **Verify the tech-debt registry covers all audit-response tech-debt items.** The informal review trusted Stage 3B's reconciliation summary. The formal audit should actually cross-check the 8 items in `audit-response-2026-04-10.md:305-314` against the 11 registry entries.

5. **Check whether any Stage 3 artifacts over-assert conclusions the user has not yet accepted.** The informal review trusted Stage 3 to stay within D4's scope; the formal audit should look for drift.

6. **Check whether Stage 3A's dependency chain reasoning contradicts any accepted D1-D5 Decision Record.** The informal review did not systematically cross-check each insertion's claims against the decision anchors.

## Files the informal review consulted

- `synthesis/roadmap-evolution.md` (full)
- `synthesis/phase-insertion-proposals.md` (full)
- `synthesis/guardrails-proposal.md` (full)
- `synthesis/tech-debt-registry.md` (full)
- `SUMMARY.md` (full)
- `REQUIREMENTS.md` (grep for RACE-* — verified line 81, 83)
- In-session memory of D1/D2/D3/D5/D4 decision anchors
- In-session memory of D4 post-hoc audit response and in-place corrections

## Files the formal audit should also consult that the informal review did NOT re-read fresh

- `.planning/ROADMAP.md` (current state — only relied on in-session memory from the D4 audit)
- `CLAUDE.md` (current state — only relied on memory of structure)
- `deliberations/01-decision-anchor.md`, `02-decision-anchor.md`, `03-decision-anchor.md`, `04-decision-anchor.md`, `05-decision-anchor.md` (only in-session memory)
- `deliberations/02-visualization-architecture.md` (full, for cross-check of Stage 3A Phase 4.1 framing)
- `BOUNDARY-CONTRACT-MEMO.md` (for cross-cutting constraint coverage check)
- `audit-response-2026-04-10.md` (full, for tech-debt registry reconciliation check)
- `sig-2026-04-11-d2-underspecified-interface-types.md` (full)
- `claude-audit-requests/2026-04-11-d4-acceptance-response.md` (full, for carry-forward check)

## Draft Confidence Calibration

- **Application-readiness verdict:** high confidence (informal review matched Codex orchestrator position)
- **Minor refinement identification:** high confidence (each traceable to specific lines in the synthesis files)
- **Completeness of the review:** medium-high confidence (in-session memory was relied on in places; formal audit should re-verify)
- **Formal response independence from this draft:** fresh session should produce independent judgment, not transcribe this draft

---

*Draft produced by Claude Opus 4.6 (1M) during the session where Wave 2 deliberations were completed and Stage 3 synthesis was reviewed. Draft saved 2026-04-11 for the fresh session performing the formal audit per `2026-04-11-stage-3-application-request.md`. The formal response should supersede this draft and be written to `2026-04-11-stage-3-application-response.md` (without `-DRAFT` suffix).*
