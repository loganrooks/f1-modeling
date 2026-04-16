# Validation Report: C - Skipped Branches And Non-Events

**Status:** Completed on 2026-04-16.
**Source spec:** `spec-validation-C-skipped-branches-and-non-events.md`

## Planned But Unexecuted

### 1. Additional Round 1.5 follow-up calls beyond the executed R1.5 research never ran

- **Branch type:** optional and intentionally unused
- **Planned branch:** `PLAN.md` defined Wave 1.5 as optional `0-N` targeted follow-up calls.
- **What happened:** the initiative executed one Round 1.5 research call (`spec-wave-1-5-R6-research-performance-envelopes.md`) and did not commission further follow-up research.
- **Evidence class forgone:** narrower follow-up research on any remaining Review Gate 1 uncertainties.
- **Consequence:** limited. The executed R1.5 branch already covered the main newly surfaced performance-envelope question, and the later deliberation/synthesis chain does not point back to a missing second follow-up research lane as the reason for any major weakness.
- **Classification:** `immaterial`

### 2. Wave 2B-iii, the optional D2 revision branch, was not launched

- **Branch type:** optional, intentionally unused after gate review
- **Planned branch:** `PLAN.md` defined `2B-iii` as a D2 revision if D3 surfaced renderer-side requirements D2 had missed.
- **What happened:** `TIMELINE.md` records that D2 and D3 were accepted together at Review Gate 2b and the initiative proceeded directly to D5. `SPEC-INDEX.md` explicitly says no separate `2B-iii` spec was authored.
- **Evidence class forgone:** an intra-initiative correction pass on the visualization architecture after D3 clarified education-side binding needs.
- **Consequence:** this is the most material skipped branch. The initiative did not use the optional revision loop to tighten the visualization-side interface closure after D3. Instead, `SUMMARY.md` shows that `AccessibleChartContract` and `AnchorRegistry` remained explicit later obligations. That means the initiative preserved the right architecture direction, but some interface-completeness work moved out of the coupled D2/D3 loop and into later carry-forward artifacts.
- **Classification:** `soften`

### 3. The general "possible research loopback" path was never exercised after later review gates

- **Branch type:** optional and intentionally unused
- **Planned branch:** `PLAN.md` allows any stage to trigger a loopback to earlier research if later work reveals genuine evidence gaps.
- **What happened:** no later review gate launched a loopback; the initiative continued from D1 through Stage 3 without returning to research.
- **Evidence class forgone:** fresh terrain-mapping on any later-surfacing ambiguity.
- **Consequence:** worth noting, but not a debrief-level reversal. The one place where a loopback might have reduced later burden is the D2/D3 interface under-specification, but the record shows that issue was carried forward explicitly as debt/planning work rather than ignored.
- **Classification:** `worth noting`

## Collapsed Or Substituted Follow-Ups

### 1. The Final Review application branch was narrower than the historical scaffold anticipated

- **Branch type:** collapsed/substituted follow-up
- **Planned branch:** `PLAN.md` and the main orchestrator handoff described Final Review as applying accepted synthesis changes to `.planning/ROADMAP.md`, `CLAUDE.md`, and phase templates.
- **What happened:** `APPLICATION-LEDGER.md` records live application only to `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, `CLAUDE.md`, and then `.planning/STATE.md`. `TIMELINE.md` explicitly notes that no phase-template edits are evidenced in the application ledger.
- **Substitute that did happen:** the initiative created a durable live tech-debt home and synchronized `.planning/STATE.md`, which are meaningful live effects, but they are not the same thing as template-level propagation.
- **Evidence class forgone:** default propagation of the accepted guardrails into future planning-template scaffolds.
- **Consequence:** this does not undo the live planning consequences of the initiative, but it does narrow what can honestly be claimed about how broadly the guardrails were operationalized at closeout.
- **Classification:** `soften`

### 2. The "follow-up registry-home or planning-context updates" step from `SUMMARY.md` collapsed into the existing application chain rather than becoming a separate follow-up branch

- **Branch type:** collapsed/substituted follow-up
- **Planned branch:** `SUMMARY.md` suggested a fourth manual commit for registry-home or planning-context follow-up wiring.
- **What happened:** the live application chain already gave the registry a durable home in `.planning/TECH-DEBT.md` and then synced `.planning/STATE.md`.
- **Evidence class forgone:** a separate explicit follow-up commit for additional wiring.
- **Consequence:** no meaningful debrief consequence. The substance of the follow-up was absorbed into the existing application chain.
- **Classification:** `immaterial`

## Materiality Assessment

| Branch or non-event | Outcome type | Evidence class forgone | Consequence | Classification |
| --- | --- | --- | --- | --- |
| Additional Round 1.5 calls beyond R1.5 | optional and intentionally unused | extra targeted research | No later output depends on a missing second follow-up research lane | `immaterial` |
| Wave 2B-iii D2 revision | optional and intentionally unused after gate review | intra-initiative interface correction pass | Visualization/education coupling stayed directionally right, but some interface closure moved into later carry-forward work | `soften` |
| General research loopback | optional and intentionally unused | renewed terrain mapping at later gates | Missed one chance to reduce later carry-forward burden, but the issue was tracked rather than lost | `worth noting` |
| Final Review phase-template application | collapsed/substituted | template-level propagation of accepted guardrails | Live-file application was real, but narrower than the scaffold implied | `soften` |
| Separate registry-home/planning-context follow-up commit | collapsed/substituted | extra explicit wiring commit | Already absorbed by `.planning/TECH-DEBT.md` plus `.planning/STATE.md` sync | `immaterial` |

## Consequences For Current Debrief Claims

### Claims that should be softened

1. **Any claim that the D2/D3 coupled loop fully closed the visualization and education interface surface inside the initiative.**
   The skipped `2B-iii` branch does not invalidate the accepted architecture, but it does mean the initiative chose carry-forward over a dedicated in-initiative D2 tightening pass. Debrief prose should say the coupling was resolved enough to proceed, while some interface-completeness obligations were intentionally left for later planning and debt tracking.

2. **Any claim that accepted Stage 3 guardrails were already propagated into phase templates or planning templates at closeout.**
   The retained application trail proves live edits to `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, `CLAUDE.md`, and `.planning/STATE.md`. It does not prove template updates. Where the debrief discusses template expectations, it should frame them as accepted carry-forward or audit-cleared recommendations unless separate live-file evidence is cited.

### Claims that do not need reopening

- The initiative corrected the Phase 4 framing and changed the live roadmap/governance state.
- The research and deliberation chain was still sufficient to justify the accepted architecture direction.
- The initiative's application to live planning files was real; the skipped branches narrowed scope, but did not negate the committed roadmap, guardrail, tech-debt, and state changes.

## Disposition Recommendations

- **Wave 2B-iii skipped D2 revision:** `soften`
  Explain in top-level debrief prose that the initiative accepted the substrate direction while carrying forward `AccessibleChartContract` and `AnchorRegistry` closure rather than using a dedicated revision wave.

- **Missing additional Round 1.5 calls:** `immaterial`
  No debrief correction needed beyond keeping the timeline accurate.

- **No later research loopback:** `worth noting`
  Mention only if the debrief discusses how the initiative handled under-specification or deferred closure.

- **No evidenced phase-template application at Final Review:** `soften`
  Patch any wording that implies template updates were already applied. Keep template changes as carry-forward or audit-cleared recommendations unless direct application evidence is added.

- **No separate follow-up wiring commit after Stage 3 application:** `immaterial`
  No debrief correction needed.
