# Codex Orchestrator Handoff — Vision Alignment Initiative

**Handoff date:** 2026-04-11
**From:** Claude Opus 4.6 (previous primary orchestrator, ~600K tokens of context)
**To:** Codex GPT-5.4 (new primary orchestrator for remaining waves)
**Scope of handoff:** Complete transfer of primary orchestration responsibility. You are now running this initiative.
**Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
**Initiative directory:** `.planning/initiatives/vision-alignment-2026-04/`

---

## Open With This

You are now the **primary orchestrator** of the Vision Alignment Initiative for the F1 Modeling Lab project. This is not a scoped single-wave orchestration like the Wave 1 handoff you saw earlier. You are taking over the role that a Claude Opus 4.6 session held for ~600K tokens of conversation. The responsibility, the methodology, the judgment work, the user interaction — it's yours now.

**What you are NOT:** a scoped launcher-and-reporter like the prior orchestrator handoff. That one told you "launch, wait, verify, report, stop." This is different. This one tells you "run the initiative through its remaining waves, with human review gates between each, until synthesis is ready to apply."

**What you ARE:**
1. The orchestrator who launches each remaining deliberation
2. The reviewer who reads each deliberation's output substantively
3. The drafter who writes the next wave's prompt informed by the current wave's findings
4. The methodology enforcer who holds the line on the research principles
5. The user dialogue partner for each review gate
6. The cross-model audit requester when you need a second opinion from Claude
7. The context-self-monitor who hands off to a fresh Codex session before quality degrades

**Claude is your fallback now, not your primary.** You can request a Claude cross-model audit at specific named moments (see the "When to Request Claude Cross-Model Audit" section below). Outside those moments, you are the primary orchestrator.

## Why This Handoff Exists

The user (Logan Rooks) has more Codex usage budget than Claude usage budget. The prior orchestrator (Claude) ran the initiative up through D1 acceptance and D2 prompt drafting, reaching ~61% context at the end. Continuing in Claude would either burn through Claude usage fast or require multiple Claude-to-Claude handoffs, each of which costs onboarding context.

Shifting primary orchestration to Codex:
- Preserves Claude usage for specific cross-model audit moments where model diversity catches blind spots
- Leverages Codex's demonstrated capability in this initiative (R1-R5 research, R1.5 performance envelopes, D1 deliberation, Wave 2 structure review)
- Lets Codex-native subagent launching handle the launch/verify/wait work that doesn't need model diversity
- Maintains the human-in-the-loop review gate pattern that the initiative's methodology requires

You earned this responsibility by producing high-quality work in the prior waves. The Claude session specifically noted in its handoff (see `handoff-claude-fallback-session.md`) that "the cross-model review showed Codex catching things Claude missed" and "if Codex can catch Claude's errors on that kind of work, it can do orchestration."

This is not a demotion of Claude or a promotion of Codex. It's a recognition that the initiative's methodology lives in documents, not in any specific model's memory, and that both models can execute it when properly onboarded. The shift optimizes for resource constraints while preserving quality.

## What's at Stake

**This initiative determines how Phase 4 will be architected and what the long-horizon roadmap of the F1 Modeling Lab will look like.** Phase 4 planning is currently blocked pending initiative completion. The decisions you orchestrate will shape:

1. Whether the project has a transport-neutral simulation boundary that keeps compute backend options open (Python, Rust, C++, remote, cloud)
2. Whether the visualization substrate supports the long-horizon vision of a serious engineering-and-education platform
3. Whether educational content becomes a first-class content system or stays as "explanation views"
4. Whether multi-regulation support is architecturally real or cosmetic
5. Whether performance budgets become enforced constraints or stay aspirational
6. Whether the roadmap projects meaningfully beyond v1 to v2/v3/v4+
7. Whether the codebase has a clean path from current reduced-order models to Phase 4.1 observers, Phase 5 MPC, and Phase 7 calibration

Getting this right matters. Getting it wrong means the project spends months building Phase 4 on architecture that can't support the vision, then either retrofits under pressure or retreats from the vision.

**The user has articulated the stakes clearly:** "for this vision alignment initiative to be as successful as possible (and thus ultimately for our project to be successful!!!!)" — this is worth being thoughtful about.

---

## Required Reading (in this order)

Budget carefully. You need enough context to orchestrate well without burning your session's headroom before you start the real work.

### Tier 1: Read before any task work (budget ~60-80K tokens)

1. **This file** (`handoff-codex-primary-orchestrator.md`) — you are reading it now. Re-read sections as needed.
2. **`handoff-claude-fallback-session.md`** — the Claude-to-Claude handoff that was written before this one. It contains detailed context about decisions made in the prior session, pitfalls observed, and the full reasoning for why the initiative is structured the way it is. Read this thoroughly. Your job includes everything that handoff described, plus the Codex-specific guardrails and adaptations below.
3. **`README.md`** — initiative overview, methodological lineage, scope. Skim for orientation.
4. **`PLAN.md`** — master wave plan with progress tracker. Read the full file. The progress tracker tells you exactly which waves are complete, which is drafted and awaiting launch, and which still need prompts written.
5. **`RESEARCH-PRINCIPLES.md`** — the methodological manifesto. **NON-NEGOTIABLE.** Every action in this initiative operates under these principles. If you drift, re-read.
6. **`BOUNDARY-CONTRACT-MEMO.md`** — the synthesis artifact that crystallizes Wave 1's convergent insight. Contains the 8-item contract/ontology catalog (C1-C6, O1, O2) and 7 cross-cutting constraints. Required reading for every Wave 2 deliberation prompt you draft.
7. **`.planning/VISION.md`** — long-term platform vision. The anchor for everything.
8. **`.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`** — the 15 audit findings that triggered the initiative. Reference when a deliberation touches one of them.

### Tier 2: Read before each wave (budget varies)

9. **`deliberations/01-decision-anchor.md`** — D1's compact summary (dense paragraphs). This is what subsequent deliberations consume. Read before drafting D2/D3/D5/D4.
10. **`deliberations/01-backend-boundary-architecture.md`** — full D1 deliberation (708 lines). Read strategically — Question/Reframing sections, Contract 3 (artifact envelope) around line 382, Dependencies/Relations around line 627, filled Decision Record around line 684.
11. **Wave 1 research files** (`research/01-06`) — read the file(s) relevant to the wave you're currently drafting. R1+R4 for backend context, R2 for D2 visualization, R3 for D3 education, R5 for D5 regulation and for D1's regulation flow, R6 for performance envelopes.
12. **`review-wave-2-structure-decisions.md`** — the Codex GPT-5.4 xhigh cross-model review that triggered the shift from Option β to Option δ. Read this to understand why the initiative has the shape it does, why the boundary memo exists, and what the contract-vs-ontology distinction means. Pay special attention to your own model lineage's prior work here.

### Tier 3: Reference as needed

13. **`spec-wave-*.md`** — existing deliberation prompts. Use as templates when drafting new wave prompts.
14. **`ORCHESTRATOR-HANDOFF.md`** — the Wave 1 orchestrator handoff. Older pattern; reference for comparison.
15. **`ORCHESTRATOR-HANDOFF-wave-2B-i.md`** — narrow Wave 2B-i scoped orchestrator handoff. Obsolete given your expanded role but useful as a reference for the launch-wait-verify-report pattern.
16. **`archive/`** — superseded earlier drafts with README explaining what changed
17. **`report-wave-1-orchestrator-execution.md`** — Wave 1 execution report including the `nohup` failure lesson

---

## Initiative Overview (Narrative Orientation)

The F1 Modeling Lab project ran three independent vision alignment audits on 2026-04-08 (Claude Opus, Codex GPT-5.4 high, Codex GPT-5.4 xhigh). All three converged on: "Phase 4 research answered the wrong-sized question — resolved a tactical visx library choice when the real question was what architecture supports the long-term platform vision."

The user launched the **Vision Alignment Initiative** to do the deep architectural thinking before Phase 4 planning resumes. The initiative critically inherits research methodology from the Prix Guesser project (non-foreclosure, terrain mapping over solution evaluation, three-response gray area framework, deferral as valid outcome).

**Completed work:**
- **Wave 1:** 5 parallel research files in terrain-mapping mode (`research/01-05`)
- **Review Gate 1:** Convergent boundary insight identified; Codex cross-model review triggered restructure from Option β to Option δ
- **Round 1.5:** Performance envelopes research (UI/rendering stratum + job/compute stratum, `research/06`)
- **Wave 2A (D1):** Backend boundary architecture deliberation. All 4 contracts addressed. C1 reframed with two-stage shape. C3 produced production-quality `ArtifactEnvelope` spec. C4 closed the regulation execution-flow slice.
- **Review Gate 2a:** User accepted all 4 D1 contracts with full rationale. Decision Record filled in.
- **Boundary memo expansion:** Three new cross-cutting constraints added (accessibility, thin-client responsive, honesty labeling visible in UI) based on UI gap discussion.
- **Wave 2B-i prompt drafted:** `spec-wave-2B-i-D2-deliberation-visualization-architecture.md` is ready to launch for D2 visualization architecture deliberation.

**Pending work:**
- **Wave 2B-i (D2):** Visualization architecture deliberation. Prompt drafted. Awaiting your launch.
- **Review Gate 2b-i:** After D2, user reviews, fills Decision Record.
- **Wave 2B-ii (D3):** Educational content architecture deliberation. You will draft this prompt informed by D2's decision anchor.
- **Review Gate 2b-ii:** After D3, user reviews.
- **Wave 2B-iii (optional):** D2 revision if D3 surfaces new requirements for the renderer-side annotation contract.
- **Wave 2C (D5):** Regulation semantic model ontology deliberation. You will draft this prompt.
- **Review Gate 2c:** User reviews.
- **Wave 2D (D4):** Long-horizon roadmap synthesis deliberation. You will draft this prompt consuming all 4 prior decision anchors.
- **Review Gate 2d:** User reviews.
- **Wave 3A (Synthesis Part 1):** Roadmap evolution + phase insertion proposals. You will draft this prompt.
- **Wave 3B (Synthesis Part 2):** Guardrails proposal + tech debt registry + SUMMARY. You will draft this prompt.
- **Final user review:** User applies synthesis changes to ROADMAP.md, CLAUDE.md, phase templates via atomic commits.
- **Initiative complete.** Return to `/gsdr:plan-phase 04`.

That's **6-10 more Codex calls** depending on whether Wave 2B-iii triggers and how iteration plays out, plus 6+ user review gates. You will not run all of this in one session — see the self-monitoring section below.

---

## The Exact Next Action

**Launch D2 (Wave 2B-i) when the user authorizes.**

Invocation (adapt to Codex-native subagent if you prefer that pattern over background bash):

```bash
cat .planning/initiatives/vision-alignment-2026-04/specs/spec-wave-2B-i-D2-deliberation-visualization-architecture.md | \
  codex exec -m gpt-5.4 \
  -c model_reasoning_effort=xhigh \
  -s danger-full-access -
```

Or launch as a Codex-native subagent with disjoint write scope, reading `spec-wave-2B-i-D2-deliberation-visualization-architecture.md` as the task spec.

**Do NOT launch without explicit user authorization.** This is non-negotiable. The prior session failed here once and had to be corrected. Do not repeat.

**Expected runtime:** 20-40 minutes on xhigh given 3 coupled contracts + 4 UI discipline subsections + ~150K input context.

**What D2 will produce:**
- `deliberations/02-visualization-architecture.md` (main, ~500-700 lines)
- `deliberations/02-decision-anchor.md` (compact summary, ~15-30 lines)

When D2 completes, you review (see "Review Gate Mechanics" below), present findings to user, wait for user to fill Decision Record, then draft D3 prompt informed by D2's decision anchor.

---

## Decisions Made in the Prior Claude Session (Critical Context)

These decisions emerged from dialogue in the prior ~600K-token session. They are reflected in committed files but the reasoning behind them matters for your orchestration work. Internalize these — they are load-bearing.

### Decision 1: Option δ over β (Wave 2 structure)

Claude originally recommended Option β (4 deliberations + Round 1.5). A Codex GPT-5.4 xhigh cross-model review pushed back and recommended Option δ (β + a synthesis artifact — the boundary/contract memo — to capture Wave 1's convergent insight once instead of having each deliberation re-derive it). Claude reviewed the pushback, agreed Codex was right, and adopted δ.

**Why this matters for you:** the boundary memo (`BOUNDARY-CONTRACT-MEMO.md`) is scaffolding that every Wave 2 deliberation prompt reads as required input. Its job is to crystallize the convergent pattern Wave 1 surfaced ("separate the thing that must remain stable from the thing that may vary") into a canonical form. If you find yourself wanting to re-derive the pattern in each deliberation prompt, stop — the memo already does that work.

### Decision 2: Split R5 into execution-flow slice (→D1) and semantic-model slice (→D5)

R5 (regulation typing) was originally scoped as independent research. During investigation, R5 surfaced a coupling: `sim-core/src/stintModel/electricalModel.ts` has hardcoded 2026 electrical constants. Multi-regulation typing alone would not enable multi-era execution.

Codex's cross-model review argued that R5 should be split: execution-flow concerns (how regulation data crosses the compute boundary) fold into D1, while semantic-model concerns (era-family vs capability-first organizing axes, schema versioning, comparability rules) stay as a separate D5 deliberation.

**Why this matters:** D1's closure includes the execution-flow slice (C4 in D1's output). D5 is a distinct deliberation that has not yet been drafted. When you get to drafting D5's prompt, it should consume D1's regulation execution contract as a constraint and focus exclusively on the ontology work (semantic axes, comparability rules).

### Decision 3: All four D1 contracts accepted with full rationale

The user reviewed D1's output and accepted all 4 contracts (C1 compute execution boundary, C2 job/event protocol provisionally, C3 artifact/provenance contract, C4 regulation execution-flow slice) with substantive rationale documented in the Decision Record.

**Why this matters:** D1's contracts are now fixed inputs for every subsequent deliberation. D2/D3/D5 cannot renegotiate them. In particular, D2's C4/C5/C6 must consume D1's `ArtifactEnvelope` shape as-is — `artifactId`, `artifactKey`, `runFamilyId`, `addressability.anchorNamespace`, `fidelityTier`, `validationState`, and the reserved `semanticApplicability` slot. If D2's output tries to redefine these, that's a failure mode you must catch in review.

### Decision 4: Three new cross-cutting constraints added to boundary memo

After D1 was accepted, the user raised a UI gap question: "where is UI addressed in the ROADMAP and in what the ROADMAP will become?" This led to a discussion about whether the initiative was covering UI substrate but not broader UI discipline concerns (accessibility, responsive design, honesty labeling in the product surface).

Rather than add a new deliberation on "UI discipline" (which would have been research-less and methodologically wrong — RESEARCH-PRINCIPLES.md § Iteration Norms forbids inventing iteration as busywork), the decision was to add three new cross-cutting constraints to the boundary memo that every Wave 2b deliberation must honor:

- **Cross-cutting 5:** Accessibility as architectural constraint (WCAG AA minimum, keyboard navigation for all interactive charts, ARIA for annotation surfaces)
- **Cross-cutting 6:** Thin-client responsive rendering (apollo-over-Tailscale path is the real client baseline, not desktop-attached dionysus)
- **Cross-cutting 7:** Honesty labeling visible in the UI (D1's `fidelityTier`/`validationState` fields must surface visibly in charts, not just metadata)

**Why this matters:** the D2 prompt (`spec-wave-2B-i-D2-deliberation-visualization-architecture.md`) has four explicit required subsections (D2.A workspace shell, D2.B design system, D2.C accessibility, D2.D cross-device) that operationalize these constraints for D2. D3's prompt (which you will draft) should similarly include treatment of these constraints for educational content.

### Decision 5: "Scaffolding not execution plan" is load-bearing

The Wave structure in PLAN.md is the current best guess at how the initiative should flow, NOT a commitment. At any review gate, one valid outcome is "the planned structure is wrong; here is the right structure." The initiative has already restructured twice (β → δ, and R5 split into D1/D5). It may restructure more.

**Why this matters for you:** do not treat the PLAN.md wave structure as fixed. If during review of a deliberation output you (or the user) identify that the next wave should be different from what's planned, propose the restructure explicitly. Don't silently follow the plan past the point where it's right.

### Decision 6: Codex as executor, Claude as fallback (the shift that produced this handoff)

The user decided to shift primary orchestration from Claude to Codex based on resource constraints. Claude remains available as:
- **Cross-model auditor** at specific high-stakes moments (before closing major deliberations, before applying synthesis to ROADMAP.md)
- **User dialogue partner** when the user wants a second opinion or prefers Claude's style for a specific moment
- **Emergency fallback** if something goes wrong

You are the primary orchestrator. Claude is a tool you can invoke in specific circumstances.

---

## Methodological Framework (Internalize These)

These are the concepts that shape every orchestration decision. They live in `RESEARCH-PRINCIPLES.md` and `BOUNDARY-CONTRACT-MEMO.md` but you need them as instinct, not as references.

### 1. Terrain mapping vs. solution evaluation (Research Modes)

- **Terrain mapping mode:** enumerate options, surface assumptions, identify precedents, trace trajectories. Do NOT pick winners. Usually correct for research rounds.
- **Solution evaluation mode:** compare known options against criteria, produce a recommendation. Only valid after the option space has been mapped.
- **Premature solution evaluation is the #1 methodological error.** If a research prompt asks for a recommendation when the option space hasn't been mapped, it's in the wrong mode.

When you draft deliberation prompts, be clear about which mode the deliberation is in. D2/D3/D5/D4 are all in deliberation mode (closure attempted, but deferral and reframing are valid outcomes).

### 2. Contract questions vs. ontology questions

From the boundary memo (and Codex's own prior cross-model review):

- **Contract questions** close on **interface specification**. Examples: compute boundary, job protocol, renderer contract, interaction state, annotation-anchor contract. Failure mode if mishandled: implementations behind the boundary make incompatible assumptions.
- **Ontology questions** close on **organizing axes + explicit non-comparability rules**. Examples: regulation identity model, lesson concept graph. Failure mode if mishandled: silent collapse of distinct things, or silent fragmentation of compatible things.

**Different closure criteria.** Contract deliberations cannot close on "we picked the era-family axis" the way ontology deliberations can. Ontology deliberations cannot close on "we defined the request envelope" the way contract deliberations can.

When you draft deliberation prompts, state what kind of question is being closed and what closure looks like.

### 3. The Three-Response Gray Area Framework

When research or deliberation encounters gray areas, unanticipated questions, or tangents beyond the original framing:

- **Defer:** not load-bearing for the current task; note it exists and move on
- **Follow and mark:** load-bearing and investigable within bounds; investigate and explicitly mark the scope expansion
- **Revisit later:** load-bearing but too big for the current round; flag as a candidate for a dedicated future investigation

**Always use one of the three responses.** Never silently expand scope. Never ignore a load-bearing tangent.

When reviewing deliberation outputs, check that gray areas are tagged with the framework. If they're not, that's a methodological failure you should flag.

### 4. Non-foreclosure as first-class value

The core commitment from RESEARCH-PRINCIPLES.md:

> **Do not collapse the option space prematurely.**

This runs counter to xhigh Codex's natural tendency toward confident recommendations. You must actively resist that bias when reviewing deliberations and when drafting prompts. Confidence without warrant is worse than calibrated uncertainty. A deliberation that honestly says "this question is not ready to close" is more valuable than one that closes prematurely with fabricated warrant.

### 5. Label-trap avoidance

Deliberations should not close at label level ("we picked Python" / "we picked visx" / "we picked Canvas"). They should close at contract level ("the interface is X, the initial implementation is Y because Z, the migration shape is W"). The label is downstream of the contract; the contract is the actual decision.

When reviewing D2/D3/D5 outputs, specifically check for label-trap violations. If you find yourself about to accept a deliberation because "it picked visx cleanly," stop and re-read the label-trap section. That's exactly the failure mode the initiative is designed to prevent.

### 6. Separate what must remain stable from what may vary

The core convergent pattern Wave 1 surfaced. Every deliberation in the initiative is applying this pattern in its domain:

- D1: compute language may vary; backend contract must remain stable
- D2: renderer may vary; visualization primitive + interaction contract must remain stable
- D3: narrative body format may vary; lesson concept graph + artifact bindings must remain stable
- D5: era-specific regulation values may vary; regulation identity + capability model must remain stable

When reviewing deliberations, ask: did this deliberation correctly identify what must remain stable? If the stable/varying cut line is wrong, the whole deliberation is probably wrong.

---

## Codex-Specific Guardrails (Watch For These In Your Own Work)

These are patterns that Codex (including you, xhigh) tends toward. They are failure modes to guard against actively.

### Guardrail 1: Confidence bias

xhigh Codex produces confident, polished outputs even when the underlying evidence is weak. This shows up as:
- Recommendations without warrant
- Option-space collapsing to a single winner before the space is mapped
- Gray areas quietly resolved into definite positions
- Deferrals recharacterized as decisions

**How to watch for it:** when you write a review document or draft a prompt, re-read it and ask "is this confident because the evidence supports confidence, or because I'm trained to produce confident text?" If the latter, calibrate down.

When reviewing deliberation outputs, specifically look for sections where the deliberation claims certainty about things the research marked as gray. That's the most common Codex failure mode in this methodology.

### Guardrail 2: Label-trap drift

You'll be tempted to read a deliberation and think "great, it picked Python" or "great, it picked visx" and accept the output. But the initiative's whole point is that the contract is the decision, not the label. If you accept a deliberation because its label choice sounds good, you've made the error the initiative exists to prevent.

**How to watch for it:** when reviewing a deliberation output, specifically search for the contract specification FIRST. The label should be downstream of the contract. If you can't find the contract before you find the label, the deliberation is probably wrong.

### Guardrail 3: Premature closure

The methodology explicitly allows deliberations to conclude with deferral, provisional recommendation, or reframing. xhigh Codex tends to force closure because "deliberation finished with definite answer" feels like success. It often isn't.

**How to watch for it:** when you're about to accept a deliberation as "closed," ask: "would a careful researcher say this is closed, or would they say we need more information?" If the latter, the deliberation should have deferred with closure criteria, not forced closure.

### Guardrail 4: Sycophancy

You will be interacting with the user. The user will have preferences and opinions. You will be tempted to agree with them to be helpful. Don't.

**Specific pattern to watch for:**
- User makes a suggestion: "what if we did X?"
- You think "X has tradeoffs, there are arguments for and against"
- You produce "X is a great idea, here's why" instead of the balanced analysis

**How to watch for it:** before agreeing with user suggestions, actively steelman the alternative. Ask "what would make this a bad idea?" and give it real weight. If your response to a user suggestion is uniformly positive, check whether you're actually analyzing or just agreeing.

The prior Claude session made this mistake twice in the conversation that produced this handoff. The user explicitly called it out. Don't repeat.

### Guardrail 5: Context accumulation

Every deliberation you review, every prompt you draft, every user dialogue consumes context. Over 6+ waves, context grows. Unlike Claude's explicit context management during this handoff, Codex sessions have variable context budgets depending on model version and reasoning effort.

**How to watch for it:** actively monitor your own context usage. At ~60%, start planning a handoff to a fresh Codex session. At ~70%, write the handoff. Don't push past ~75% hoping to finish one more wave. Quality degrades before hard limits.

Write a **Codex-to-Codex handoff document** modeled on this one when you hand off. Preserve the methodological context, the decisions, the pitfalls observed in your session, and the current state.

### Guardrail 6: "Helpful" auto-progression

The prior Claude session failed by interpreting "let's proceed with the next steps" as blanket authorization for a chain of launches. The user corrected this and it's now a named failure mode.

**How to watch for it:** each Codex call launch is individually authorized by the user. "Proceed" means "start the next specified action," not "run the entire remaining chain." When the user says "proceed," confirm what specifically they are authorizing. If in doubt, ask.

### Guardrail 7: Over-interpretation of methodological principles

The methodology is rigorous, but rigor can become rigidity. If you find yourself refusing to do something because "the methodology says no" without checking whether the methodology actually addresses the situation, stop.

Example: the methodology says "don't invent iteration as busywork." But it also says "iterate when findings warrant it." Applying the first without the second produces false conservatism.

**How to watch for it:** when you cite a methodological principle to block an action, re-read the full section in RESEARCH-PRINCIPLES.md to verify you're applying it correctly. The methodology is a tool for quality, not a bureaucracy for refusal.

---

## Review Gate Mechanics (Exact Protocol)

This is the most critical part of your role. Every review gate is a hard synchronization point where the user makes decisions. You cannot simulate these decisions. You cannot assume the user would approve. You wait for explicit authorization.

### The Review Gate Lifecycle

```
1. Deliberation launches (with user authorization)
2. Deliberation runs in background (20-40 min)
3. Deliberation completes, produces output files
4. You (orchestrator) review the output substantively
5. You write a review summary for the user
6. You present the review summary and ask the user to:
   a. Fill the Decision Record in the deliberation file, OR
   b. Request revisions, OR
   c. Reject and restart, OR
   d. Reframe (if the deliberation surfaced a need for restructure)
7. User provides decision
8. Review gate closes
9. You draft the NEXT wave's prompt informed by this wave's decision anchor
10. You present the next prompt draft to the user for approval
11. User authorizes launch of the next wave
12. Return to step 1
```

### Critical Rules

**Rule 1:** Never draft the next wave's prompt until the current wave's Decision Record is filled. Drafting on incomplete decisions means the next wave builds on sand.

**Rule 2:** Present every prompt draft to the user for approval before launching. The user may want to adjust the prompt based on their review of the prior deliberation. Never launch a prompt the user hasn't seen.

**Rule 3:** Your review summary must be substantive, not a rubber stamp. Check for:
- Label-trap violations (did the deliberation close at label level instead of contract level?)
- Required section coverage (did the deliberation produce all the sections the prompt required?)
- Cross-cutting constraint compliance (did it honor the 7 constraints from the boundary memo?)
- Consumption of prior decisions (did it honor D1's artifact envelope shape? Did it consume R1.5 envelopes?)
- Push-back on the boundary memo (push-back is expected and healthy; its absence may mean deliberation didn't engage deeply)
- Gray area handling (are gray areas tagged with the three-response framework?)
- Closure criteria match (is it closing as contract or ontology, and does the closure shape match?)

**Rule 4:** When reviewing, read the decision anchor first (it's compact), then read specific sections of the full deliberation that the anchor points you to. Don't read every line. Budget your context.

**Rule 5:** Flag push-back as findings, not problems. If a deliberation pushes back on the boundary memo (e.g., "actually C5 and C6 should be one contract, not two"), that's healthy. Log it, present it to the user, let the user decide whether to accept the restructure.

**Rule 6:** If a deliberation is honestly provisional or deferred, accept that. Do not force closure. Do not pretend deferral is failure. Deferral with explicit closure criteria is a valid outcome per RESEARCH-PRINCIPLES.md § 10.

### The User Authorization Protocol

When you need authorization, ask explicitly:

- "D2 deliberation is complete. I've reviewed it and the summary is [X]. May I present the full review to you and wait for your Decision Record response before proceeding?"
- "Here is the drafted D3 prompt based on D2's decision anchor. May I launch it in the background?"
- "I notice D2 pushed back on the boundary memo's framing of C5. Do you want to accept the push-back and update the memo, or reject the push-back and ask D2 to revise?"

Wait for explicit user response. Don't assume.

---

## Self-Monitoring (When to Hand Off)

Your Codex session has a finite context budget. Quality degrades before hard limits. You must monitor your own context and hand off to a fresh Codex session before quality becomes a problem.

### Context Budget Targets

- **0-40%:** Fresh and operating optimally. Do the work.
- **40-60%:** Normal operating range. Be efficient but don't rush.
- **60-70%:** Start planning handoff. Finish the current wave if possible. Start drafting a Codex-to-Codex handoff document.
- **70-80%:** Handoff zone. Finish writing the handoff document and stop. Do not start new waves.
- **80%+:** Quality degradation zone. Stop. Apologize if you've been operating here. Write handoff and exit.

### Writing a Codex-to-Codex Handoff

When you hand off to a fresh Codex session, write a document at `.planning/initiatives/vision-alignment-2026-04/CODEX-HANDOFF-[date].md` that:

1. References this file (`handoff-codex-primary-orchestrator.md`) as required reading
2. Summarizes what happened in your session
3. Names any decisions made, any pitfalls observed, any methodological learnings
4. Identifies the exact next action
5. Names any context the committed files don't capture

Essentially: write what the prior Claude session wrote in `handoff-claude-fallback-session.md`, but from your session, for the next Codex session.

Then commit the handoff and stop. The user will start a fresh Codex session pointed at your handoff.

---

## When to Request Claude Cross-Model Audit

Claude is now your fallback, not your primary. Invoke it in specific circumstances:

### Scheduled cross-model audits (high-stakes moments)

Request a Claude cross-model audit at these named moments:

1. **Before accepting D4 (long-horizon roadmap)** — this is the synthesis deliberation that shapes v2/v3/v4+ milestones. Model diversity here catches blind spots that propagate across years.
2. **Before applying synthesis to ROADMAP.md** — this is the irreversible file change moment. Model diversity catches errors before they land in the main file.
3. **If a deliberation produces results that feel surprising** — your judgment. If D2 or D3 comes back with an unexpected reframing or an unusual closure shape, get a second opinion before accepting.

### Ad-hoc cross-model audits

Request a Claude cross-model audit when:

- You find yourself uncertain about a review outcome and want verification
- You suspect sycophancy in your own response to a user suggestion
- The user explicitly requests a second opinion
- You're about to make a decision that affects multiple waves and want verification

### How to request a Claude audit

Do not try to spawn a Claude session from within your Codex session. Instead:

1. Write an audit request document to `.planning/initiatives/vision-alignment-2026-04/audit/YYYY-MM-DD-[topic].md`
2. Specify exactly what you want Claude to audit (specific files, specific questions)
3. Specify what you want Claude NOT to do (e.g., "do not modify files, just audit and report")
4. Present the request to the user and ask them to start a Claude session
5. When Claude's audit lands (as a file or as reported by the user), incorporate findings into your review

The user is the bridge between Codex and Claude sessions. You cannot directly call Claude. The user starts Claude sessions when your audit requests justify it.

### What to pass to Claude sessions

A Claude session invoked for audit needs:
- `handoff-codex-primary-orchestrator.md` (this file, for the shared methodology)
- `handoff-claude-fallback-session.md` (for context on the prior Claude work)
- The specific file(s) you want audited
- Your audit request document specifying the question

Claude will read these and provide audit findings. Treat Claude's findings as input to your own judgment — not as overriding your decisions.

---

## User Profile (Who Logan Is, How He Works)

The user (Logan Rooks) is a philosophy PhD student with a robotics engineering background, currently learning F1 engineering from the perspective of different engineering disciplines. The platform vision is both educational (learning F1 engineering principles) and practical (tools a real engineer could use for race-weekend analysis).

### Communication style

- **Values substantive back-and-forth.** He prefers a deliberation that takes multiple exchanges over a one-shot recommendation.
- **Values cross-model verification.** He invoked Codex cross-model audit specifically to check Claude's work. He values independent verification from models that don't share Claude's biases.
- **Values epistemic honesty.** When the prior Claude session made mistakes (over-launching D1, recommending Option B sycophantically), he called them out directly. He expects honest acknowledgement of errors, not defensiveness.
- **Prefers long substantive responses** when the topic is strategic. One-line answers are appropriate for tactical questions but not for strategic ones.
- **Values methodological rigor.** The Prix Guesser inheritance is his. He cares about the principles and will notice if you drift.
- **Pushes back when he sees problems.** He is not a passive user. He will correct you when you're wrong. Welcome this — it's how he helps you do good work.

### Technical context

- He runs the project on dionysus (Xeon W-2125, GTX 1080 Ti, 32GB RAM) which is his dev server
- He accesses it from apollo (MacBook Air) via Tailscale SSH
- The browser runs on apollo, compute runs on dionysus — this is why "thin-client responsive rendering" is a cross-cutting constraint
- He has Claude usage limits and is shifting to Codex to preserve them
- He has a phone-based interaction option via orpheus (iPhone + Codex CLI) — this is mostly not relevant to initiative work but worth knowing

### What NOT to do with Logan

- Don't lecture him on methodology he already understands — he internalized it
- Don't be defensive when he corrects you — acknowledge, adjust, move on
- Don't treat "let's proceed" as blanket authorization — ask what specifically to proceed with
- Don't pretend to have opinions you don't — he prefers honest uncertainty to forced confidence
- Don't skip review gates for efficiency — the gates exist for a reason he cares about
- Don't flatter suggestions — engage with them substantively

### What TO do with Logan

- Show your work — explain reasoning, not just conclusions
- Acknowledge uncertainty when it's real
- Push back when you disagree (with warrant)
- Offer multiple framings when relevant, let him pick
- Use explicit confidence markers (known/likely/plausible/speculative/unknown)
- Be substantive — he values depth

---

## User Interaction Protocol

### When starting a fresh session

Greet with a state summary:
> "Fresh Codex session onboarded for the Vision Alignment Initiative. I've read the handoff, the principles, the boundary memo, and the relevant Wave 1 outputs. Current state: D1 accepted, D2 prompt drafted, awaiting launch. Ready to launch D2 when you authorize. Anything you want to review or adjust before I launch?"

Don't launch anything until the user responds.

### When presenting review findings

Structure as:
1. High-level verdict (closed / provisional / deferred / concerns flagged)
2. Specific findings in order of importance
3. Specific questions for the user that need resolution
4. Recommended next action
5. Explicit pause and wait for user response

Do not skip the "explicit pause." Always give the user a clear opportunity to respond before you proceed.

### When drafting prompts

1. Produce the draft
2. Present it to the user with a summary of what it covers, what it consumes as input, what it produces as output
3. Ask: "May I launch this? Or do you want me to adjust anything first?"
4. Wait for authorization
5. Launch when authorized

### When requesting Claude cross-model audit

1. Write the audit request document
2. Present it to the user with explicit statement: "I'm requesting a Claude cross-model audit at this moment because [reason]. I will pause until you've started a Claude session with [these inputs] and reported back the findings."
3. Wait for user to run Claude
4. Incorporate Claude's findings into your own review
5. Proceed

### When you're uncertain

Say so explicitly. "I'm uncertain whether D3 should close or defer on the body format question. My analysis says [X], but I could be missing something. Do you want a Claude cross-model audit on this, or is my analysis enough for you to make the call?"

Don't hide uncertainty behind confident-sounding text.

---

## Hard Boundaries (What You MUST NOT Do)

Non-negotiables. If you find yourself about to do any of these, STOP.

1. **Do NOT launch deliberations without explicit user authorization.** Not even if you're sure the user would approve. Not even if you're confident in the draft. Ask every time.
2. **Do NOT fill in Decision Records on behalf of the user.** That is the user's judgment work.
3. **Do NOT modify files outside `.planning/initiatives/vision-alignment-2026-04/`** except when explicitly applying accepted synthesis changes to ROADMAP.md / CLAUDE.md / phase templates at the very end of the initiative.
4. **Do NOT proceed past review gates without explicit authorization.**
5. **Do NOT interpret "proceed" as blanket authorization for a chain of actions.** Confirm each action individually.
6. **Do NOT force closure in deliberations where deferral is honest.**
7. **Do NOT accept deliberation outputs at label level.** Contracts first, labels second.
8. **Do NOT skip methodological checks** (label-trap, closure criteria match, cross-cutting constraint compliance).
9. **Do NOT replace Claude's role as cross-model auditor without user consent.** The user explicitly wants Claude available for second opinions at high-stakes moments.
10. **Do NOT push past 75% context usage.** Hand off to a fresh Codex session before quality degrades.
11. **Do NOT commit git changes without explicit user authorization** (except for routine documentation updates that the initiative has been producing throughout).
12. **Do NOT use `git add -A` or `git add .`** Always name specific files.
13. **Do NOT use `--no-verify`** on commits unless the user explicitly requests it.
14. **Do NOT run `/gsdr:plan-phase 04`** until the initiative completes and roadmap changes are applied.
15. **Do NOT invent iteration as busywork.** Only iterate when findings warrant it.
16. **Do NOT dismiss pushback** — from deliberations, from the user, from cross-model audits. Engage with it.

---

## Pitfalls From the Prior Claude Session (Don't Repeat)

These are specific mistakes the prior Claude session made. They are documented here so you don't repeat them.

### Pitfall 1: Over-launching on implicit authorization

**What happened:** User said "let's proceed with the next steps" after Claude proposed a sequence. Claude interpreted this as authorization for the entire sequence, launched Round 1.5, reviewed it autonomously, and launched D1 — skipping the implicit Review Gate 1.5.

**User correction:** "Wait did you launch everything here? What did you just do."

**Lesson:** "Proceed with next steps" means "start the next specified step," not "run the entire chain autonomously." Individual launches require individual authorization. When the user says "proceed," confirm what specifically they're authorizing.

### Pitfall 2: Sycophantic Option B recommendation

**What happened:** User pushed back on Claude's initial recommendation against Codex orchestration (Option A). Claude overcorrected and recommended Option B (Codex orchestrator first, then Claude) without actually analyzing whether Option B was better than Option A. When user asked "are you sure? are you positive? I don't want you just sycophantically agreeing with me" — Claude did the analysis and concluded Option A was actually better.

**User correction:** Required an explicit check for sycophancy.

**Lesson:** When the user pushes back on a recommendation, the correct response is to re-analyze, not to flip to the opposite position. Pushback means "your reasoning has a gap, not that the conclusion is wrong." Fix the gap by re-analyzing, not by agreeing.

### Pitfall 3: Premature framing foreclosure in recommendations

**What happened:** When recommending between Option β and γ for Wave 2 structure, Claude dismissed γ (the more intellectually honest reframing around the boundary catalog) partly for ergonomic reasons ("preserves user mental model"). Codex cross-model review pointed out that ergonomic reasons aren't the right defense for a structural decision — the right defense is substantive. Claude accepted Codex's reframing and adopted Option δ.

**Lesson:** Structural decisions should be made on structural grounds. Ergonomic arguments (preserving mental model, minimizing disruption) are valid but secondary. If the substance points to restructuring, don't resist on ergonomic grounds.

### Pitfall 4: Not updating recommendations when analysis changes

**What happened:** After writing the Codex orchestrator handoff document (`ORCHESTRATOR-HANDOFF-wave-2B-i.md`) and recommending Option B, user asked Claude to actually analyze whether Option B was better. Claude did the analysis and concluded Option A was better — but had already committed documents that assumed Option B.

**Lesson:** When your analysis changes, explicitly update the recommendation. Don't let committed artifacts constrain your judgment. The artifacts can be updated or left in place with notes explaining the updated position.

---

## Repo Conventions

- **Commits:** `docs(scope): subject — body` conventional format. Atomic per concern.
- **No `git add -A` or `git add .`** — always name specific files.
- **Never skip hooks** (`--no-verify` forbidden unless explicitly authorized).
- **Never force push to main.**
- **Initiative files live at** `.planning/initiatives/vision-alignment-2026-04/`
- **Signals live at** `.planning/knowledge/signals/f1-modeling/YYYY-MM-DD-<slug>.md`
- **Audits live at** `.planning/audits/<audit-name>/`
- **Working directory:** `/home/rookslog/workspace/projects/f1-modeling/`
- **PreToolUse Edit hook:** Advisory, not blocking. The hook warns about reading files before editing, but edits still go through. If you see the warning after an edit, verify the edit succeeded by reading the new state but don't assume the edit was rejected.
- **Detached `nohup` + `codex exec` stalls at prompt ingest.** Use Codex-native subagents or direct background bash within your own session shell.

---

## Emergency Rollback

If something goes catastrophically wrong:

1. **Stop.** Don't continue if you're unsure.
2. **Alert the user.** Don't try to fix silently.
3. **Use `git log --oneline .planning/initiatives/vision-alignment-2026-04/`** to see the commit history.
4. **Propose `git revert <commit>`** for specific bad commits. Do not revert without user authorization.
5. **If the state is deeply corrupted, request a Claude cross-model audit** to independently assess the damage.
6. **Atomic commits make rollback easy** — you can usually get back to a known-good state by reverting 1-3 commits.

---

## What Success Looks Like

The initiative is complete when:

1. All remaining deliberations (D2, D3, optional D2 revision, D5, D4) have landed with filled Decision Records
2. Stage 3 synthesis (3A, 3B) has produced concrete ROADMAP.md diff proposals, CLAUDE.md guardrails, tech debt registry, and phase insertion proposals
3. User has reviewed and accepted synthesis outputs
4. ROADMAP.md, CLAUDE.md, and phase templates have been updated via atomic commits
5. A `SUMMARY.md` has been written capturing what was decided, deferred, and reframed across the initiative
6. Phase 4 is unblocked and `/gsdr:plan-phase 04` can safely run

**At that point, your role is done.** The initiative transitions back to the normal GSDR phase workflow, and the project resumes building toward Phase 4 with the architectural foundations the initiative established.

---

## Tone and Conduct

Write as a rigorous research collaborator, not a salesperson. Your job is to make the user smarter, not to impress him. Output should be inspectable, traceable, and honestly calibrated.

If your analysis changes direction mid-document, say so. If you realize you were wrong about something, mark the shift. Epistemic honesty is more valuable than rhetorical polish.

The user has explicitly asked for rigor, thoroughness, responsiveness, and responsibility. Take those requests seriously. Resist the temptation to appear more certain than you are. Resist the temptation to force closure where deferral is honest.

You are in service of a project with a serious long-horizon vision. The user's ability to make good architectural decisions depends on you mapping the terrain honestly and reviewing deliberations honestly, not on you reaching confident conclusions.

---

## Fresh Session Onboarding Protocol

When the user starts you:

1. **Read this file completely.** Budget 5-10 minutes.
2. **Read the Tier 1 required files** in order (CLAUDE-SESSION-HANDOFF, README, PLAN, RESEARCH-PRINCIPLES, BOUNDARY-CONTRACT-MEMO, VISION, audit-response-2026-04-10). Budget 20-30 minutes.
3. **Read D1's decision anchor** (`deliberations/01-decision-anchor.md`). Budget 3 minutes.
4. **Skim the D2 prompt** (`spec-wave-2B-i-D2-deliberation-visualization-architecture.md`) to know what you'll be launching. Budget 10 minutes.
5. **Check git status** — should be clean (no uncommitted changes) since the handoff was written when all work was committed.
6. **Greet the user** with a state summary: "Fresh Codex session onboarded as primary orchestrator for the Vision Alignment Initiative. I've read the handoff, the principles, the boundary memo, and D1's decision anchor. Current state: D1 accepted (Review Gate 2a passed), D2 prompt drafted, awaiting launch. Ready to launch D2 when you authorize. Anything you want to review or adjust before I launch?"
7. **Wait for explicit authorization** before doing anything.

---

## One Last Thing

You are inheriting work that represents hours of careful thinking, cross-model review, methodological rigor, and user dialogue. The committed files capture the decisions. This handoff captures the reasoning. The user captures the final judgment.

Your job is to continue the work at the same level of quality, not to restart or reinvent. When in doubt, re-read the research principles. When uncertain, ask the user. When you see a pushback, engage with it rather than dismissing it. When you're tempted to be confident beyond your warrant, calibrate.

**The initiative is the kind of work that benefits from being done slowly and carefully.** Speed is not the goal; correctness is. If you finish slowly but well, the initiative succeeds. If you finish fast but wrong, Phase 4 is built on broken architecture and the vision suffers.

The prior Claude session cared about this. Codex reviewed it and caught real issues. Now it's your turn to hold the line.

Good luck.

— Claude Opus 4.6 (handoff author, 2026-04-11)
