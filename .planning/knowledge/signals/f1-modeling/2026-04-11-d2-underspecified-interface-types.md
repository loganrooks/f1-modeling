---
id: sig-2026-04-11-d2-underspecified-interface-types
type: signal
project: f1-modeling
tags: [deliberation, vision-alignment, contract-completeness, phase-4-obligation, accessibility, visualization]
created: 2026-04-11T00:00:00Z
updated: 2026-04-11T00:00:00Z
durability: convention
status: active
severity: major
signal_type: design-gap
signal_category: negative
polarity: negative
phase: null
plan: null
source: claude
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by claude advisory review of D2 visualization architecture deliberation at 2026-04-11T00:00:00Z"
evidence:
  supporting:
    - "D2 02-visualization-architecture.md closes C4 on a three-layer substrate whose RenderSurfaceProps type references AccessibleChartContract without defining it anywhere in the deliberation"
    - "D2 02-visualization-architecture.md closes C6 by stating 'Each renderer registers anchors into an AnchorRegistry as it renders a panel' without specifying the AnchorRegistry register/lookup/update/remove/subscribe semantics"
    - "D2 D2.C commits to WCAG AA minimum as a hard viability filter; that commitment is only testable once AccessibleChartContract has a concrete shape that panel code can be checked against"
    - "D3 educational content deliberation will bind lesson anchors through the AnchorRegistry; without a defined registry API, D3 cannot close C6 on the content side without inventing its own assumption"
    - "Codex orchestrator review at 2026-04-11T09:19Z rated D2 'no blocking findings' — the missing types are not blocking for deliberation closure, only for phase-4 code-readiness"
  counter:
    - "Phase 4 planning will almost certainly surface these gaps as implementation tasks even without an explicit signal, since any attempt to code the substrate will reveal them immediately"
    - "The D2 Decision Record rationale for C4, C6, and D2.C now explicitly names these gaps as Phase 4 obligations, providing a passive reminder mechanism through the Decision Record consumption pattern"
    - "These are not architecture gaps — they are interface-completeness gaps within already-accepted contracts. The contracts are correct; the internal types are missing."
confidence: high
confidence_basis: "Direct reading of D2 deliberation content. AccessibleChartContract and AnchorRegistry are literally named in the deliberation without accompanying type definitions, and their absence is load-bearing for the D2.C WCAG AA commitment and D3's C6 content-side consumption respectively."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.4+dev"
---

# D2 visualization deliberation closes contracts that reference AccessibleChartContract and AnchorRegistry types without defining them

## What Happened

During advisory review of D2 (Wave 2B-i visualization architecture deliberation) on 2026-04-11, Claude identified that D2 closes three coupled contracts (C4 renderer-agnostic surface, C5 shared interaction state, C6 annotation-anchor / view-recipe) with interface-level closures that include field references to two types that are named but never defined in the deliberation:

1. **`AccessibleChartContract`** — referenced as a field on `RenderSurfaceProps<TViewModel>` in C4's closure. The D2.C UI discipline section commits to WCAG AA minimum as a hard viability filter, and that commitment is only testable once `AccessibleChartContract` has a concrete shape that panel code can be checked against.
2. **`AnchorRegistry`** — referenced in C6's closure as the mechanism through which renderers register anchors during panel rendering, and the mechanism through which D3 will eventually bind lesson anchors. The register/lookup/update/remove/subscribe semantics are not specified.

These gaps did not appear in the Codex orchestrator's own review of D2 at 2026-04-11T09:19Z, which rated D2 "no blocking findings" and recommended acceptance without revision. Both reviews are defensible: Codex was reviewing for deliberation closure (which is the right bar for the review gate); Claude was reviewing for code-readiness of the internal contract types (which is a Phase 4 planning bar).

The user accepted D2 contracts as written and filled the Decision Record with explicit notes under C4, C6, and D2.C rationale sections flagging these types as obligations that must be closed during Phase 4 planning before substrate code lands against the contracts.

## Why This Matters

The passive "Decision Record rationale" mechanism is a reminder, not a forcing mechanism. Phase 4 planning context-loading will pick up the notes when `/gsdr:plan-phase 04` eventually runs, but nothing in the GSDR workflow actively blocks the phase from closing without resolving them. Two specific risks:

1. **Silent accessibility drift.** If Phase 4 planning accepts the D2 substrate without closing `AccessibleChartContract`, the WCAG AA commitment stays nominal. Panels get built. Nobody notices the contract was never written. The accessibility claim silently becomes aspirational rather than testable.
2. **D3 content-side C6 reopening.** If D3 tries to bind lesson anchors without a specified `AnchorRegistry` API, D3 will either (a) invent its own registry assumption and drift from D2, or (b) flag D3 as blocked pending a D2 revision pass (Wave 2B-iii). The signal exists so the first outcome is less likely.

This signal is a belt-and-suspenders backup to the Decision Record rationale. It ensures the gap survives into the knowledge store even if future context-loading misses the Decision Record prose.

## Potential Remediation

Two possible paths, in order of preference:

1. **Phase 4 planning closes both types inline.** When `/gsdr:plan-phase 04` runs, its context-gathering should read this signal (along with the D2 Decision Record) and scope a specific planning task: define `AccessibleChartContract` and `AnchorRegistry` with concrete register/lookup/resolve semantics before any C4/C6 implementation work begins. Both types are small in scope; closing them is a matter of hours of planning work, not days.
2. **Optional Wave 2B-iii D2 revision pass.** If D3 discovers that the `AnchorRegistry` API is load-bearing for its closure, trigger the optional D2 revision wave already scaffolded in the initiative PLAN.md. This path is more expensive but ensures the revision happens at initiative time rather than phase-planning time.

Recommended remediation is (1) unless D3 explicitly surfaces a blocker.

## Context

- **Initiative:** vision-alignment-2026-04
- **Deliberation:** 02-visualization-architecture.md
- **Decision Record commits:** Accept C4 (provisional on semantic-SVG package binding), Accept C5, Accept C6 (provisional on additive D3 recipe metadata)
- **User decision point:** 2026-04-11, filled after receiving advisory review from Claude and independent review from Codex orchestrator
- **Related deliberation downstream:** D3 (Wave 2B-ii) educational content architecture; D5 (Wave 2C) regulation semantic model
- **Phase dependency:** Phase 4 (visualization substrate implementation) is downstream consumer
