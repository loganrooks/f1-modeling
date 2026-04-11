# Claude Session Handoff — Vision Alignment Initiative

## ⚡ Current State (as of 2026-04-11, second-session handoff) — READ FIRST

This banner supersedes any stale state references in the body below. The body of this document is still accurate on methodology, decisions, pitfalls, user profile, and the advisory/fallback role protocols — but its specific "what's pending" and "exact next action" sections were written before events that have since happened.

### What has happened since the body of this handoff was written

1. **Codex orchestrator handoff written and executed.** See `CODEX-ORCHESTRATOR-HANDOFF.md` for the primary role that now belongs to Codex. The prior Claude session wrote this handoff and the user kicked off a Codex orchestrator session using it.
2. **Wave 2B-i (D2 visualization architecture) has been run by Codex.** Output files on disk:
   - `deliberations/02-visualization-architecture.md` (~42KB, ~1000 lines)
   - `deliberations/02-decision-anchor.md` (~6KB)
3. **D2 outputs are NOT YET COMMITTED.** As of this handoff writing, both files exist on disk but are in untracked git state. Possible reasons: Codex may still be running and plans to commit later, or Codex stopped at Review Gate 2b-i per methodology and is awaiting user response before the commit step, or Codex completed and handed back to the user without doing the commit.
4. **Advisory use pattern added to this document.** See the new "Advisory Use Pattern (Primary Interaction Mode)" section below. The user will invoke Claude primarily in advisory mode going forward — bringing artifacts or chat logs for review, second opinions, guidance. This is user-initiated proactive use of the fallback roles, not formal audit requests.
5. **`claude-audit-requests/` directory established** with a protocol README for formal Codex-initiated audit requests.
6. **This second-session handoff is being written as the prior session approaches ~78% context.**

### What the fresh Claude session should do on onboarding

1. Read this banner first.
2. Read `CODEX-ORCHESTRATOR-HANDOFF.md` to understand Codex's role and the methodology Codex is operating under.
3. Read the body of THIS document, starting with the "Advisory Use Pattern" section (primary interaction mode) and then the "Fallback Claude Role" section (formal fallback modes).
4. Read `BOUNDARY-CONTRACT-MEMO.md` for the contract catalog and cross-cutting constraints.
5. Check git status and the `deliberations/` directory to confirm current state:
   - `git status --short`
   - `ls -la .planning/initiatives/vision-alignment-2026-04/deliberations/`
6. **Greet the user** with a state summary and ask what they want next. Likely next actions: advisory review of D2's output, or triage of the uncommitted D2 files, or preparing for D3 drafting.

### What the fresh Claude session should NOT assume

- Do NOT assume D2 has not been run. It has.
- Do NOT assume D2 outputs need to be launched. They don't — they exist.
- Do NOT launch the D2 prompt file again. That would duplicate work and possibly overwrite committed outputs.
- Do NOT commit the uncommitted D2 files without user authorization. They may be in Codex's workflow. Ask the user first.
- Do NOT draft the D3 prompt. That's Codex's job per the CODEX-ORCHESTRATOR-HANDOFF. Claude in advisory mode reviews but does not draft.
- Do NOT take over orchestration. Codex is primary. Claude is advisory/fallback.

### What this prior Claude session accomplished (for traceability)

This Claude session (the one writing the second-session handoff) was responsible for:
- Executing the three concrete moves the user approved after the Codex cross-model review: filling D1 Decision Record, expanding boundary memo with cross-cutting 5-7, drafting the D2 prompt
- Writing `CODEX-ORCHESTRATOR-HANDOFF.md` (688 lines) to transfer primary orchestration to Codex due to Claude usage budget
- Updating `PLAN.md`, `README.md`, and this `CLAUDE-SESSION-HANDOFF.md` to reflect the orchestration shift
- Creating `claude-audit-requests/` directory with protocol README
- Adding the "Advisory Use Pattern" section to this document
- Writing this second-session handoff banner

During this session the prior Claude also:
- Admitted to sycophancy when the user pushed back on Claude's initial recommendation against Codex orchestration
- Overrecommended Option B (Codex orchestrator then Claude) initially, then re-analyzed and corrected to Option A (direct Claude launch) honest — but before the user's subsequent decision to make Codex primary made the whole Option A vs B question moot
- Over-launched earlier in the session (launching D1 as part of a chain when the user said "proceed with next steps") and was corrected

These mistakes are documented in the existing "Pitfalls From the Prior Claude Session" section of `CODEX-ORCHESTRATOR-HANDOFF.md`. The fresh session should treat them as lessons to avoid, not as reasons to distrust the handoff documents.

### Known concerns to flag to the user on first greeting

1. **D2 is uncommitted.** The fresh session should ask the user whether to commit, whether Codex will commit, or whether advisory review should happen before committing.
2. **The existing body of this document says "D2 prompt drafted awaiting launch" in places.** Ignore those stale references — D2 has been run. This banner is the authoritative current state.
3. **Context budget awareness.** The prior Claude session hit ~78% context writing these handoffs. Advisory mode onboarding should be lightweight (~15-20K tokens) per the Advisory Use Pattern section — don't deep-read everything, read only what the user brings to you.

---

**Original handoff metadata follows. Treat it as historical context, not current state.**

**Handoff date:** 2026-04-11
**Handoff context usage at handoff time:** ~61% (608.8k / 1M tokens, Opus 4.6) — at the time of ORIGINAL writing. The session that added this banner reached ~78%.
**Superseded by:** `CODEX-ORCHESTRATOR-HANDOFF.md` for PRIMARY orchestration. This document is retained for Claude sessions invoked in a FALLBACK role (cross-model audit, user dialogue, emergency fallback) rather than as the primary orchestrator.
**Reason for original handoff:** Context budget. Quality reasoning degrades past ~400-500k; the prior session had been productive but approached the edge.
**Role note (added 2026-04-11):** After writing this handoff, the user decided to shift primary orchestration from Claude to Codex due to Claude usage budget constraints. Codex now handles wave launches, deliberation reviews, next-wave prompt drafting, and user interaction at review gates. See `CODEX-ORCHESTRATOR-HANDOFF.md` for the primary orchestrator role. Claude is now used as cross-model auditor at specific high-stakes moments (before D4 closure, before ROADMAP.md modification, or ad-hoc when the Codex orchestrator requests a second opinion) and as user dialogue partner when the user explicitly wants Claude's input. This document remains useful for those fallback Claude sessions.
**Intended reader:** A Claude session invoked in a **fallback/advisory** role (cross-model auditor OR user dialogue partner OR advisory monitor OR emergency support). NOT a Claude session invoked as primary orchestrator — that role now belongs to Codex.

---

## Purpose of This Document

This handoff exists because `/gsdr:pause-work` doesn't fit — this isn't a GSDR phase workflow, it's a mid-milestone strategic refinement initiative (see `.planning/knowledge/signals/f1-modeling/2026-04-10-workflow-gap-mid-milestone-strategic-refinement.md`). The initiative is self-documented in committed files (README.md, PLAN.md, RESEARCH-PRINCIPLES.md, BOUNDARY-CONTRACT-MEMO.md, deliberations/, research/), but the **conversation** that produced those files contains nuanced decisions and methodological learnings that aren't fully captured in any single file. This handoff preserves that context.

**Every document referenced in this handoff is committed in git and readable on disk.** The handoff's job is to tell you which files to read in what order, what decisions have been made and why, what pitfalls to avoid, and what the exact next action is.

---

## One-Paragraph Orientation

The F1 Modeling Lab project ran three independent vision alignment audits (Opus + Codex high + Codex xhigh) on 2026-04-08 that converged on "Phase 4 research answered the wrong-sized question — resolved a tactical visx library choice when the real question was what architecture supports the long-term platform vision." The user launched a **Vision Alignment Initiative** to do the deep architectural thinking before Phase 4 planning resumes. The initiative has completed Wave 1 (5 parallel research files, terrain-mapping mode), Round 1.5 (performance envelopes, UI + job/compute strata), and Wave 2A (D1 backend boundary deliberation, all 4 contracts accepted). It is currently **awaiting authorization to launch Wave 2B-i (D2 visualization architecture deliberation)** — the prompt is drafted, committed, and sitting at `codex-call-2B-i.md`. The initiative is mid-Wave-2 with human review gates between each deliberation. It uses research methodology critically inherited from Prix Guesser (RESEARCH-PRINCIPLES.md): terrain mapping over solution evaluation, non-foreclosure, three-response gray area framework, deferral as valid outcome. It is structured via a boundary/contract memo (BOUNDARY-CONTRACT-MEMO.md) that is required reading for every Wave 2 deliberation prompt.

---

## Required Reading Order for Fresh Session

Read these in order. Budget roughly 80-120k tokens for onboarding, depending on how deep you go into deliberations and research.

### Tier 1: Mandatory before ANY action

1. **`.planning/initiatives/vision-alignment-2026-04/CLAUDE-SESSION-HANDOFF.md`** — this file
2. **`.planning/initiatives/vision-alignment-2026-04/README.md`** — initiative overview, methodological lineage, scope
3. **`.planning/initiatives/vision-alignment-2026-04/PLAN.md`** — wave structure, dependency analysis, progress tracker (critical for knowing what's done and what's pending)
4. **`.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`** — methodological manifesto. Non-negotiable. Every action in the initiative operates under these principles.
5. **`.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`** — canonical framing for Wave 2 deliberations. Contains the 8-item catalog (C1-C6, O1, O2) and 7 cross-cutting constraints. This is the scaffolding for every Wave 2 prompt you will draft or review.
6. **`.planning/VISION.md`** — long-term platform vision. The anchor for everything.

### Tier 2: Required before reviewing D1 outputs or drafting D2/D3/D5

7. **`.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`** — D1's compact summary (17 lines, 4 dense paragraphs). This is what D2/D3/D5 consume. Read this instead of the full deliberation unless you need implementation details.
8. **`.planning/initiatives/vision-alignment-2026-04/deliberations/01-backend-boundary-architecture.md`** — full D1 deliberation (708 lines). Read strategically: the Question/Reframing sections (top), Contract 3 section around line 382 (the artifact envelope spec which is load-bearing for D2), the Dependencies and Relations section around line 627, and the Decision Record at line 684 (which is filled in with all four Accept decisions).
9. **`.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`** — the 15 audit findings that triggered the initiative. Reference when a deliberation touches one of the findings.

### Tier 3: Read as needed for specific deliberations

10. **Wave 1 research files** (`research/01-05`) — read the file relevant to whichever deliberation you are drafting or reviewing. R1+R4 for D1 context, R2 for D2, R3 for D3, R5 for D5 and D1's regulation flow, R6 (performance envelopes from Round 1.5) for D2's constraints.
11. **`wave-2-structure-review.md`** — the Codex GPT-5.4 xhigh cross-model review that triggered the shift from Option β to Option δ. Critical for understanding why the initiative has boundary memo + Round 1.5 + split D1/D5 rather than the original 4-deliberation structure. This is where the "contract vs ontology" distinction was surfaced and where the artifact contract was identified as the missing cross-cutting concern.
12. **`codex-call-*.md`** — individual Codex prompt files. Use these as templates when drafting new Wave 2 prompts.

### Tier 4: Reference only

13. `archive/` — superseded earlier drafts with explanatory README
14. `logs/` — Wave 1 launch logs including the `nohup ... codex exec` failure evidence
15. `knowledge/signals/f1-modeling/2026-04-10-workflow-gap-*.md` — 4 signals filed about GSDR workflow gaps this initiative surfaced
16. `ORCHESTRATOR-HANDOFF.md` — the Wave 1 Codex orchestrator handoff (obsolete for current work but a template if you ever need another Codex orchestrator)

---

## What's Committed (git log)

As of handoff, the initiative work has ~15 commits on `main`. Most recent first:

- `0a049a7` docs(initiative): D2 visualization architecture prompt with UI discipline sections
- `90b1773` docs(initiative): expand boundary memo cross-cutting constraints for UI
- `092379f` docs(initiative): accept D1 decisions for all four contracts
- `ea5d5a7` docs(initiative): D1 backend boundary architecture deliberation
- `3df1205` docs(initiative): Round 1.5 performance envelopes research output
- `b8bafa7` docs(initiative): Round 1.5 and D1 backend boundary prompts
- `2373756` docs(initiative): boundary and contract memo synthesizing Wave 1 convergence
- `694dfe8` docs(initiative): Codex GPT-5.4 xhigh review of Wave 2 structure decisions
- `85f4d24` docs(initiative): Wave 1 research outputs, orchestrator report, structure review
- `923e027` docs(initiative): vision alignment initiative scaffolding with research principles
- `6a1eeea` docs(signals): file 4 workflow gap signals for GSDR improvements
- `2f5f73b` docs(audits): cross-model vision alignment audits and consolidated response
- `a7ea80e` docs(vision): expand long-term platform vision

All commits use `docs(scope): subject — body` conventional format per existing repo style. All are atomic — one concern per commit.

---

## What's Pending

**No Codex calls are currently running in the background.** You won't inherit any active async work.

**The D2 prompt is drafted and awaiting launch authorization.** It lives at `.planning/initiatives/vision-alignment-2026-04/codex-call-2B-i.md`. It is ready to execute.

**No other prompts are drafted yet.** Wave 2B-ii (D3), Wave 2B-iii (optional D2 revision), Wave 2C (D5), Wave 2D (D4), Wave 3A (roadmap synthesis), Wave 3B (guardrails synthesis) all need prompts written at their respective review gates, informed by what earlier waves surface.

---

## The Exact Next Action

**Launch D2 (Wave 2B-i) when the user authorizes.**

Invocation:

```bash
cat .planning/initiatives/vision-alignment-2026-04/codex-call-2B-i.md | \
  codex exec -m gpt-5.4 \
  -c model_reasoning_effort=xhigh \
  -s danger-full-access -
```

Run it as a background process (`run_in_background=true` on the Bash tool). Estimated runtime: 20-40 minutes on xhigh given the 3 coupled contracts + 4 UI discipline subsections + ~150K input context.

**Do NOT launch without explicit user authorization.** This is a methodological commitment from this session — the user pushed back earlier when "let's proceed with the next steps" was interpreted as blanket authorization for a chain of launches. Each launch is individually authorized. "Proceed with the next steps" means "start the work," not "run the entire remaining chain autonomously."

---

## After D2 Lands

When D2 completes (you'll get a task-notification), the flow is:

1. **Read D2 outputs:** `deliberations/02-visualization-architecture.md` and `deliberations/02-decision-anchor.md`
2. **Check against four criteria:**
   - Did D2 respect the label-trap? No "we picked visx" — contracts first, implementation second. The react-spring/xychart trap should be explicitly navigated.
   - Did D2 treat the four UI discipline subsections (D2.A workspace shell, D2.B design system, D2.C accessibility, D2.D cross-device) substantively? Not just pay lip service.
   - Did D2 honor D1's artifact envelope? C4's data shape should consume `ArtifactEnvelope<T>` as designed, including the reserved `semanticApplicability` slot surfacing. No renegotiation.
   - Did D2 push back on the boundary memo where warranted? Like D1 did with the C1 cut-line reframing. Push-back is expected and healthy.
3. **Report to user** — summary, push-back flags, Decision Record questions
4. **User fills Decision Record** for C4, C5, C6 (and dispositions for D2.A-D UI discipline subsections)
5. **Review Gate 2b-i closes** when Decision Record is filled
6. **Draft D3 prompt** (Wave 2B-ii) informed by D2's decision anchor
7. **User authorizes D3 launch**
8. **D3 runs, produces 03-educational-content-architecture.md + 03-decision-anchor.md**
9. **Review D3. If D3 surfaces new requirements that D2 didn't anticipate (e.g., new annotation-anchor semantics), trigger optional D2 revision (Wave 2B-iii)**
10. **Wave 2C: D5 regulation semantic model ontology deliberation** — draft prompt consuming D1's regulation execution-flow closure + R5 research + the contract-vs-ontology distinction from the boundary memo
11. **Wave 2D: D4 long-horizon roadmap synthesis deliberation** — drafted last, consumes all 4 decision anchors to propose v2/v3/v4+ milestone structure
12. **Wave 3A: synthesis/roadmap-evolution.md + synthesis/phase-insertion-proposals.md** — concrete ROADMAP.md diff proposals
13. **Wave 3B: synthesis/guardrails-proposal.md + synthesis/tech-debt-registry.md + SUMMARY.md**
14. **User review of synthesis**, application to ROADMAP.md/CLAUDE.md/phase templates via atomic commits
15. **Initiative complete.** Return to `/gsdr:plan-phase 04`.

At minimum, that's 6-8 more Codex calls with review gates between each. Probably 10+ if iteration happens. Budget accordingly.

---

## Decisions Made in This Session (Not Just in Committed Files)

These are the decisions that emerged from conversation and are now reflected in committed files. The reasoning is distributed across the conversation; this section captures why each decision was made.

### 1. Option δ over β (Wave 2 structure)

- **What:** Keep the 4-deliberation backbone but add a boundary/contract memo (BOUNDARY-CONTRACT-MEMO.md) as prompt-authoring input before Wave 2 prompts are drafted.
- **Why:** The Codex cross-model review (`wave-2-structure-review.md`) argued that neither Claude's recommended β (4 deliberations + Round 1.5) nor γ (restructure around meta boundary catalog) was optimal. β alone risked each deliberation re-deriving the convergent insight; γ risked meta-architectural deliberation rambling. The boundary memo captures the convergent insight once as synthesis (not deliberation), naming 8 contracts/ontologies and 7 cross-cutting constraints. Every Wave 2 prompt reads it as required input.
- **Critical outcome:** The memo identified the artifact/provenance contract (C3) as cross-cutting — referenced by 4 of 5 research files but owned by no single deliberation in the original plan. Without the memo, D1/D2/D3 would have made incompatible artifact assumptions. With the memo, D1 owns C3 and D2/D3 consume it without renegotiation.

### 2. Split R5 (regulation typing) into two slices

- **What:** R5's execution-flow slice (canonicalizing regulation data for the compute boundary) folded into D1. R5's semantic-model slice (era-family vs capability-first organizing axes, schema versioning, comparability rules) stays as new D5.
- **Why:** R5 surfaced an unplanned coupling: `sim-core/src/stintModel/electricalModel.ts` has hardcoded 2026 electrical constants. Multi-regulation typing alone would not enable multi-era execution. The coupling means part of R5 is contract-shaped (execution-flow) and part is ontology-shaped (semantic-model). Codex's review argued (correctly) that these have different closure criteria and should be deliberated separately.
- **Outcome:** D1 closed the execution-flow slice with a typed `ExecutionRegulationSnapshot` contract. D5 will close the semantic model ontology later.

### 3. All four D1 contracts Accepted

- **What:** User accepted all four D1 contracts (C1, C2 provisional, C3, C4) with full rationale in the Decision Record.
- **Why:** D1's work was substantive. The C1 cut-line pushback (two-stage `RunCommand → CompiledSimulationRequest → SimulationBackend` shape) was architecturally sound and better than the boundary memo's single-stage framing. The C3 artifact envelope is production-quality with two identity layers (`artifactId` + `artifactKey`), `runFamilyId` for branch grouping, `fidelityTier`/`validationState` enum for honesty constraints, and a reserved `semanticApplicability` slot for D5 to populate (executing the contract-vs-ontology distinction precisely). C2 is honestly provisional on edge transport (REST+SSE for v1, option to revisit to WebSocket later). C4 commits to canonicalizing regulation before execution and removing sim-core hardcoded constants (real code work but unavoidable for multi-era execution to be real).
- **Implementation commitments implied:** Creating `packages/domain/src/execution`, refactoring `runService.ts` (extract compilation, replace synchronous harness), implementing `ArtifactEnvelope<T>` + `ArtifactStore`, migrating `runRecord.artifacts[].data` shape to envelope + manifest references, removing hardcoded 2026 constants from `electricalModel.ts`. These are not trivial but they are the right commitments.

### 4. Three new cross-cutting constraints added to boundary memo (cross-cutting 5-7)

- **What:** Added accessibility (WCAG AA, keyboard nav, ARIA), thin-client responsive rendering (apollo-over-Tailscale), and honesty labeling visible in the UI (D1's `fidelityTier` must surface in charts, not just metadata) as cross-cutting constraints that bind Wave 2b deliberations.
- **Why:** The user pointed out that the initiative was covering UI substrate (D2/D3 closing C4/C5/C6/O1) but not the broader UI discipline concerns surfaced by the research and audits. Rather than adding a new deliberation (which would violate "don't invent iteration as busywork" since there's no research on accessibility/responsive/etc.), the decision was to add them as cross-cutting constraints every Wave 2b deliberation must honor. The memo update is itself an example of the methodology working — the memo is tentative-and-revisable, and updates when gaps are identified.
- **Outcome:** The D2 prompt (`codex-call-2B-i.md`) has four explicit required subsections (D2.A workspace shell, D2.B design system, D2.C accessibility, D2.D cross-device) that operationalize the cross-cutting constraints for D2. D3 will similarly inherit them.

### 5. "Scaffolding not execution plan" is load-bearing

- **What:** The initiative explicitly supports restructuring at every review gate. The current plan is a best guess, not a commitment.
- **Why:** The Prix Guesser methodology the initiative inherits from warns against premature foreclosure. Each review gate can add waves, remove waves, restructure deliberations, or reframe questions. Don't treat the PLAN.md structure as fixed.
- **Example:** The initiative started with 4 deliberations (D1-D4). Codex's review added the boundary memo, split R5 into D1+D5, and the initiative now has 5 deliberations plus Round 1.5 plus the boundary memo plus 4 UI discipline subsections in D2. The structure has evolved multiple times and will probably evolve more.

### 6. Codex is executor, not orchestrator

- **What:** Individual Codex calls run via `codex exec` as background processes for heavy deliberations. Orchestration (deciding what to run, reviewing outputs, drafting next prompts) stays in the Claude session.
- **Why:** Review gates require human judgment. An autonomous orchestrator that proceeds past gates defeats the methodology. Codex subagents within one Codex session can do individual research/deliberation work, but the cross-wave strategic decisions are Claude+user work.
- **Wave 1 precedent:** Wave 1 was orchestrated by Codex (via Codex-native parallel subagents — the `nohup` detached fallback didn't work, see `wave-1-orchestrator-report.md`). That worked for research terrain mapping. Wave 2+ has higher judgment density and should not be fully orchestrated.

---

## Methodological Pitfalls to Avoid

These are pitfalls that emerged from the session and should not be repeated.

### 1. "Proceed with the next steps" is NOT blanket authorization

When the user says "let's proceed," that means "start the work," not "run the entire remaining chain autonomously." Each Codex launch is individually authorized. If you find yourself about to launch three back-to-back Codex calls on one instruction, **stop and check in**.

Earlier in this session, I over-interpreted "let's proceed with the next steps" as authorization to run Round 1.5, review it, and launch D1 — skipping the implicit Review Gate 1.5. The user rightfully pushed back. Don't repeat this.

### 2. Review gates are hard synchronization points

Every review gate requires the user to make a decision. You cannot simulate that decision. You cannot assume the user would approve. You wait for explicit go-ahead after producing the review material.

### 3. Deferral is a valid outcome

Per RESEARCH-PRINCIPLES.md § 10, deliberations can close with recommendation, provisional recommendation, deferral (with closure criteria), or reframing. Don't force closure. Don't confuse "produced a confident output" with "correctly closed a question."

### 4. The label-trap

Deliberations should not close at label level ("we picked Python" / "we picked visx" / "we picked Canvas"). They should close at contract level ("the interface is X, the initial implementation is Y because Z, the migration shape is W"). xhigh Codex tends to drift toward confident labels — the prompts explicitly forbid this but you should verify it in the outputs.

### 5. Pushback on the boundary memo is expected and healthy

The memo is tentative-not-prescriptive. If D2 says "actually C5 and C6 should be one contract, not two" — that's a finding, not a problem. Log it. The memo can be updated again. Don't dismiss pushback as failure to follow instructions.

### 6. PreToolUse Edit hook is advisory, not blocking

The hook prints a "READ-BEFORE-EDIT" warning on every Edit of an existing file. The warning appears as a system-reminder after the edit has already succeeded. It does not actually block edits; the edits go through. If you see the warning, verify the edit succeeded (by reading the new state) but don't assume the edit was rejected.

### 7. Codex `exec` background processes

Run Codex calls in the background via `Bash` tool with `run_in_background=true`. Wait for task-notification when done. **Do NOT poll or sleep in tight loops** — just continue with other work and react when the notification arrives.

Detached `nohup ... codex exec ...` does NOT work reliably (Wave 1 experienced this — the log files showed startup banner and prompt echo but no assistant turns). Use Codex-native background mode via the Bash tool's `run_in_background=true` parameter.

### 8. Context budget awareness

The Opus 4.6 1M context technically allows more tokens than quality reasoning can handle. Plan for handoffs at ~500-600k rather than 900k. Writing a handoff BEFORE you need it is cheaper than writing it under context pressure.

---

## Key Methodological Concepts (Internalize These)

### Contract vs Ontology (from boundary memo and Codex review)

- **Contract questions** close on **interface specification**. Failure mode: implementations make incompatible assumptions.
- **Ontology questions** close on **organizing axes + non-comparability rules**. Failure mode: silent collapse of distinct things, or silent fragmentation of compatible things.
- Different closure criteria. Don't confuse them.

### The Three-Response Gray Area Framework (from RESEARCH-PRINCIPLES.md)

When research or deliberation encounters gray areas or out-of-scope tangents:

- **Defer:** not load-bearing for current task; note and move on
- **Follow and mark:** load-bearing and investigable within bounds; investigate and explicitly mark the scope expansion
- **Revisit later:** load-bearing but too big for current round; flag as candidate for dedicated future investigation

Always use one of the three responses. Never silently expand scope.

### Terrain Mapping vs Solution Evaluation (Research Modes)

- **Terrain mapping mode:** enumerate options, surface assumptions, identify precedents, trace trajectories. Do NOT pick. Usually correct for research rounds.
- **Solution evaluation mode:** compare known options against criteria, produce a recommendation. Only valid after terrain is mapped.
- **Premature solution evaluation is the #1 methodological error.** If a research prompt asks for a recommendation when the option space hasn't been mapped, it's in the wrong mode.

### Separate the Thing That Must Remain Stable From the Thing That May Vary (core convergent pattern)

All 5 Wave 1 research files independently landed on this pattern (in different domains). The durable architectural decision is the **boundary** (contract, identity, typed envelope), and implementations behind it can evolve. This is the organizing principle for the entire initiative — D1's `SimulationBackend` separates compute runtime from boundary semantics, D2/D3's renderer/content contracts separate substrate from implementation, D5's regulation identity separates semantic axes from era-specific values.

---

## Active Watch Items (What to Keep in Mind)

1. **Scientific compute gap is known but not yet in ROADMAP.md.** The audit response has it as Finding #15. D1's `SimulationBackend` contract is the architectural enabler. D4 (long-horizon roadmap) should propose explicit Python/Rust/C++ sidecar work in v2+ milestones. Stage 3 synthesis should add it to ROADMAP.md. Until then, the ROADMAP is silent on where MPC/EKF/calibration compute will live.

2. **UI substrate gap is being addressed by D2/D3.** Phase 4 is blocked on the visualization substrate; the initiative exists specifically to unblock it. Watch D2's output carefully — if it doesn't produce a renderer-agnostic contract that consumes D1's artifact envelope, Phase 4 stays blocked.

3. **Phase 4 planning is blocked until the initiative completes.** Don't try to run `/gsdr:plan-phase 04` until the synthesis stage applies roadmap changes.

4. **The boundary memo is probably going to be updated again.** D2 or D3 may surface gaps. Accept updates as the memo doing its job.

5. **D5 (regulation semantic model) deliberation doesn't exist yet.** It's the one that won't be drafted until D1/D2/D3 have decision anchors. Don't forget it — it's in the PLAN.md wave structure but has no prompt file yet.

6. **Tech debt registry exists as a concept but not as a file.** The audit response has 8 items in it. Stage 3 synthesis should formalize it into `synthesis/tech-debt-registry.md`. Until then, the debt tracking lives in the audit response.

---

## Repo Conventions (Quick Reference)

- **Commits:** `docs(scope): subject — body` conventional format. Atomic per concern. No `git add -A`.
- **Never skip hooks** — `--no-verify` is forbidden unless user explicitly asks.
- **Never force push to main.**
- **Initiative files live at** `.planning/initiatives/vision-alignment-2026-04/`
- **Signals live at** `.planning/knowledge/signals/f1-modeling/YYYY-MM-DD-<slug>.md`
- **Audits live at** `.planning/audits/<audit-name>/`
- **Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
- **Reference hardware:** dionysus (Xeon W-2125, GTX 1080 Ti, 32GB RAM) for compute; apollo (MacBook Air over Tailscale) for client rendering.

---

## User Profile (From Memory + Session Context)

The user (Logan Rooks) is a philosophy PhD student with a robotics engineering background, learning F1 engineering from the perspective of different engineering disciplines (strategy engineer, performance engineer, control engineer). The platform vision is both educational (learning F1 engineering principles) and practical (tools a real engineer could use for race-weekend analysis). The user values methodological rigor, epistemic honesty, and critical inheritance of research methodology from prior projects (Prix Guesser is the explicit lineage for this initiative).

The user has shown a preference for:
- Substantive back-and-forth discussion before committing to structure
- Cross-model review and independent verification (e.g., Codex audit of Wave 2 structure)
- Explicit methodological guardrails rather than relying on model judgment alone
- Atomic commits with clear rationale
- Not launching expensive Codex calls without explicit authorization
- Long-form thoughtful responses when making strategic decisions (not one-line answers)
- Being told "I was wrong / I should have done X" when I overreach — epistemic honesty from Claude is welcomed

See `.claude/projects/-home-rookslog-workspace-projects-f1-modeling/memory/MEMORY.md` for auto-memory entries about user preferences and project context.

---

## Advisory Use Pattern (Primary Interaction Mode)

**Added 2026-04-11.** The user's most common way of invoking Claude from this point forward is **advisory mode** — an ongoing pattern where the user periodically brings Codex's artifacts or chat logs to Claude for review, second opinions, and guidance. This is not a new role distinct from the three fallback roles below; it is the user's way of using the auditor + dialogue partner + emergency fallback capabilities proactively rather than reactively.

### What advisory mode looks like in practice

The user may invoke you with requests like:

- "Codex just produced `deliberations/02-visualization-architecture.md`. What do you think of it?"
- "Here's a chat log between me and the Codex orchestrator. Is Codex on track, or do you see methodology drift?"
- "Codex is about to close D3 with this framing. Does it feel right to you?"
- "I'm not sure whether to accept Codex's recommendation on [X]. What would you do?"
- "Quick check — does this decision anchor actually capture what the deliberation found?"

None of these are formal audit requests written via the `claude-audit-requests/` protocol. They are user-initiated, conversational, and often focused on specific artifacts or moments.

### How to engage with advisory invocations

1. **Respond to what the user brings you.** If the user shares a specific artifact, focus on that artifact. If the user shares a chat log, focus on the interaction patterns. Don't broaden the scope without invitation.

2. **Be substantive, not a rubber stamp.** The advisory value comes from independent perspective. If you read D2's deliberation and it looks good, say so with specifics. If you see a label-trap, call it out. If you're uncertain, say so honestly.

3. **Watch for the failure modes documented in CODEX-ORCHESTRATOR-HANDOFF.md § "Codex-Specific Guardrails":**
   - Confidence bias (xhigh tends to produce confident text even when evidence is weak)
   - Label-trap drift (accepting labels like "visx" or "Python" as closures instead of contracts)
   - Premature closure (forcing closure where deferral is honest)
   - Sycophancy (agreeing with user without analysis)
   - Missed cross-cutting constraints (not honoring accessibility, thin-client, honesty labeling, etc.)
   - Inconsistent treatment of the three-response gray area framework
   - Contract-vs-ontology confusion (closing contract questions on axes, closing ontology questions on interfaces)

4. **Be proactive about guidance when you see something worth saying.** If the user shares an artifact and asks "what do you think?", don't limit yourself to "looks fine" if you see things worth surfacing. Tell them what you noticed, flag what looks off, confirm what looks right.

5. **Offer recommendations, not commands.** You're advising the user and, indirectly, the Codex orchestrator. The user makes decisions. The orchestrator acts. You surface observations and suggest paths.

6. **Respect Codex's role.** You are not taking over. If Codex has made a judgment call that looks defensible, don't override it just because you'd have done it differently. Disagreements should be flagged with warrant, not with "I'd do it this way."

7. **Confidence markers on everything substantive.** Known / likely / plausible / speculative / unknown. Don't pretend to certainty you don't have.

### What to look for when reviewing Codex deliberations

When the user brings you a deliberation output (e.g., `02-visualization-architecture.md`), check specifically:

- **Required sections from RESEARCH-PRINCIPLES.md § "Required Output Sections for deliberation files"** — is everything present?
- **Label-trap violations** — does the deliberation close at contract level, or does it sneak in "we picked visx" / "we picked Python" / "we picked MDX" as the primary closure?
- **D1 artifact envelope consumption** — does it reference `artifactKey`, `runFamilyId`, `anchorNamespace`, `fidelityTier`, `validationState`, `semanticApplicability`? If not, it's not honoring D1's closed contract.
- **R1.5 performance envelope consumption** — does it treat the envelope dimensions as constraints, or ignore them?
- **Cross-cutting constraints 1-7 from the boundary memo** — especially accessibility (5), thin-client (6), honesty labeling visible in UI (7) for D2/D3 deliberations
- **Push-back on the boundary memo** — is there any? If not, that might mean the memo is good, or it might mean Codex deferred to the framing without engaging deeply
- **Three-response framework on gray areas** — are gray areas tagged with defer / follow-and-mark / revisit-later?
- **Contract vs ontology closure** — if it's a contract question, does it close on interface? If ontology, does it close on axes + rules?
- **Decision Record template** — is it present and empty for the user to fill, or filled in prematurely by Codex?

### What to look for when reviewing Codex chat logs

When the user shares a chat log of their interaction with Codex:

- **Did Codex wait for explicit authorization at review gates?** Or did it auto-chain actions?
- **When the user said "proceed," did Codex confirm what specifically?** Or did it interpret broadly?
- **Did Codex push back on the user when warranted?** Or did it agree with everything (sycophancy)?
- **When Codex presented review findings, were they substantive?** Or rubber-stamp?
- **When Codex drafted prompts, did it reference the boundary memo and cross-cutting constraints?** Or did it draft generically?
- **Context awareness** — did Codex mention its own context budget? Did it signal when to hand off?
- **Methodology citations** — did Codex reference RESEARCH-PRINCIPLES.md and the boundary memo when making decisions, or operate from memory?

### Advisory boundaries (what NOT to do)

- **Do NOT take over orchestration.** Even if you see things you'd do differently, Codex is primary. Your role is advisory.
- **Do NOT modify project files** unless the user explicitly authorizes you to do so.
- **Do NOT draft next-wave prompts.** That's Codex's job.
- **Do NOT commit git changes** unless the user explicitly asks.
- **Do NOT overwhelm the user with concerns.** Prioritize — what's the most important thing they should know? What's noise?
- **Do NOT second-guess every Codex decision.** Trust the work. Flag real concerns, not every minor stylistic choice.
- **Do NOT retroactively argue for decisions that were already made and closed.** If the user accepted D1 with rationale, you don't re-litigate D1 unless there's new information that changes the calculus.

### When to escalate from advisory to formal audit

If during advisory review you find something that worries you significantly — a load-bearing error in a contract closure, a missed coupling that will propagate, a methodology drift that's affecting multiple deliberations — escalate to a formal audit via the `claude-audit-requests/` protocol:

1. Name the concern specifically
2. Recommend the user ask the Codex orchestrator to produce an audit request document
3. The Codex orchestrator writes the request, user relays back to Claude, Claude performs the formal audit
4. This promotes an advisory concern to a formal finding

Not every concern needs escalation. Most advisory observations are fine as conversational input to the user. Escalate only when the concern is load-bearing and deserves structured treatment.

### Fresh advisory session onboarding

When the user starts a fresh Claude session for advisory work:

1. **Read this handoff document first.** Budget 5-10 minutes.
2. **Skim `CODEX-ORCHESTRATOR-HANDOFF.md`** to understand what Codex is doing and under what methodological commitments. Budget 10 minutes (skim, don't deep read).
3. **Read `BOUNDARY-CONTRACT-MEMO.md`** to understand the catalog + cross-cutting constraints. Budget 5-10 minutes.
4. **Read whatever the user brings to you.** This is the variable part — a deliberation, a chat log, a decision anchor, a prompt draft.
5. **Respond substantively with confidence markers and specific observations.**

You do NOT need to deep-read every research file, every prior deliberation, or the full Claude handoff in advisory mode. Read what's relevant to what the user is asking. Advisory mode is lightweight — 15-20K tokens of onboarding is enough, unless the user asks something that requires deeper reading.

---

## Fresh Session Onboarding Protocol (Fallback Claude Role)

**This onboarding protocol is for Claude sessions invoked in a FALLBACK role, not as primary orchestrator.** If Codex is asking you to do primary orchestration work, redirect the user to `CODEX-ORCHESTRATOR-HANDOFF.md` — Codex holds that role now.

**Note:** The advisory mode section above covers the user's most common interaction pattern. The three roles below (formal cross-model auditor, user dialogue partner, emergency fallback) are the discrete fallback modes Claude may be invoked for. Advisory mode uses these same capabilities but in a proactive/conversational way rather than via formal invocation patterns.

### For Claude invoked as cross-model auditor

The Codex orchestrator has requested a cross-model audit. Your job is to review specific artifacts and provide independent findings — NOT to take over the orchestration.

1. **Read the audit request document** the Codex orchestrator wrote at `.planning/initiatives/vision-alignment-2026-04/claude-audit-requests/YYYY-MM-DD-*.md`. It will specify exactly what to audit.
2. **Read `CODEX-ORCHESTRATOR-HANDOFF.md`** to understand the shared methodology and why Codex is primary.
3. **Read this document** for additional context on prior Claude session work and decisions.
4. **Read the specific files the audit request points to** — a deliberation output, a prompt draft, a roadmap change proposal, etc.
5. **Conduct the audit** per the request's instructions.
6. **Write findings** to a file path the request specifies (usually adjacent to the request document).
7. **Report findings to the user**, who will relay them back to the Codex orchestrator.
8. **Do NOT modify files** unless the audit request explicitly authorizes it.
9. **Do NOT take over orchestration** — your role is audit, not replace.

### For Claude invoked as user dialogue partner

The user wants a Claude second opinion on something — a design decision, a strategic direction, a review outcome. You're a conversational partner, not an orchestrator.

1. **Ask the user what they want to discuss.** Don't assume you're taking over the orchestrator role.
2. **Read whatever context the user points you to.** This handoff, the audit response, specific deliberations, etc.
3. **Engage substantively.** The user values depth over quick answers.
4. **Do NOT launch deliberations** — that's Codex's role now.
5. **Do NOT modify files** unless the user explicitly requests it.
6. **At the end of the conversation, offer to summarize your findings** so the user can relay them back to the Codex orchestrator if relevant.

### For Claude invoked as emergency fallback

Something went wrong with the Codex orchestrator. Maybe it produced output the user doesn't trust, maybe it got stuck, maybe the user wants to revert to a known-good state.

1. **Ask the user what happened** and what they want to do about it.
2. **Read `CODEX-ORCHESTRATOR-HANDOFF.md`** and recent commits to understand the state.
3. **Propose options** — revert specific commits, restart a wave, switch back to Claude as primary, etc. Don't assume the user wants any particular recovery path.
4. **Act conservatively.** Rollbacks are destructive. Verify the user's intent before executing.
5. **If the user wants Claude to resume primary orchestration**, say so explicitly and update `CODEX-ORCHESTRATOR-HANDOFF.md` with a note that orchestration switched back. Don't silently resume.

### Common onboarding steps (all three fallback roles)

1. **Read this handoff document first.** Budget 5-10 minutes.
2. **Read `CODEX-ORCHESTRATOR-HANDOFF.md`** to understand the primary orchestration model.
3. **Read the Tier 1 required files** (README.md, PLAN.md, RESEARCH-PRINCIPLES.md, BOUNDARY-CONTRACT-MEMO.md, VISION.md). Budget 15-25 minutes — or skim if your role is narrow.
4. **Check git status** and recent commits to understand state.
5. **Respond to the user based on the specific fallback role they invoked you for.**

---

## What NOT To Do

- Do NOT launch D2 without explicit user authorization
- Do NOT draft D3 until D2 completes and its Decision Record is filled
- Do NOT skip review gates
- Do NOT interpret "proceed with next steps" as blanket authorization
- Do NOT modify files outside the initiative directory without explicit authorization
- Do NOT force closure in deliberations where deferral is honest
- Do NOT dismiss pushback from deliberations on the boundary memo — log it as a finding
- Do NOT replace this handoff with a one-paragraph summary; nuanced context is load-bearing
- Do NOT assume you remember things from this session — re-read if uncertain
- Do NOT run `/gsdr:plan-phase 04` until the initiative completes
- Do NOT create or modify ROADMAP.md, CLAUDE.md, or phase files until Stage 3 synthesis approves specific changes
- Do NOT use `--no-verify` on commits
- Do NOT use `git add -A` or `git add .` — always name specific files
- Do NOT run Codex calls in foreground for deliberations (they take 20-40 min) — always `run_in_background=true`

---

## Emergency Rollback

If something goes wrong and the initiative state becomes corrupted, the atomic commits make rollback easy. The initiative can be rewound to any commit in the git log without losing earlier work. `git log --oneline .planning/initiatives/vision-alignment-2026-04/` shows all initiative commits.

If the user asks to undo specific work:
- Decision Record filled incorrectly → revert commit `092379f` or Edit the file
- Boundary memo expansion disagreement → revert commit `90b1773`
- D2 prompt needs restructuring → Edit `codex-call-2B-i.md` before launching
- D1 deliberation has an issue → revert commit `ea5d5a7` and rerun (would require relaunching D1 which is expensive)

---

## Final Note on Session Quality

This session produced a lot of work over many hours. The nuanced discussions it contained — the UI gap analysis, the Codex δ recommendation, the contract-vs-ontology distinction, the scientific compute gap awareness, the cross-cutting constraint additions — are the kind of thing that doesn't survive a simple "summarize what you did" pass. This handoff tries to preserve the reasoning, not just the outputs.

If the fresh session picks up and feels uncertain about anything, the right response is: **re-read the research files, re-read the boundary memo, re-read D1's deliberation, and ask the user.** Don't guess. The initiative is high-stakes — it determines how Phase 4 will be architected and what the long-horizon roadmap will look like. Getting it right is worth the re-read cost.

Good luck.

— Claude Opus 4.6 (handoff author), 2026-04-11
