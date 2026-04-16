# Boundary and Contract Memo

**Date:** 2026-04-11
**Updated:** 2026-04-11 — expanded Cross-Cutting Constraints to add entries 5-7 (accessibility as architectural constraint, thin-client responsive rendering, honesty labeling visible in the UI). Reason: review of D1 outputs and discussion of UI gap scope identified that broader UI discipline concerns (accessibility, cross-device rendering, honesty-in-the-UI) need to be cross-cutting constraints that every Wave 2b deliberation honors, NOT their own separate deliberation. These additions are policy commitments that D2, D3, and downstream deliberations must treat as binding. They represent the memo doing its job: when research or review surfaces a gap, the memo gets updated to reflect it.
**Author:** Claude Opus 4.6 (synthesizing Wave 1 research outputs)
**Status:** Synthesis input for Wave 2 prompt drafting — NOT a closed decision
**Required reading for:** All Wave 2 deliberation prompts (and any future synthesis work that consumes Wave 1 research)

---

## What This Document Is

This memo crystallizes the convergent architectural insight Wave 1 research surfaced across all five research files. It is **synthesis, not deliberation.** It does not close decisions. It does not have closure criteria. It exists to make a pattern legible so subsequent deliberations consume a canonical version rather than each re-deriving it (or quietly drifting into different versions).

The memo names:

1. The convergent pattern Wave 1 surfaced
2. The contracts and ontologies the platform actually needs (descriptive, from research)
3. Tentative ownership assignments for which deliberation should close which contract or ontology
4. Cross-cutting concerns no single deliberation can own alone
5. The contract-vs-ontology distinction that determines closure criteria

**Tentative-not-prescriptive:** The ownership assignments below are starting points based on the natural fit between each deliberation's scope and each contract. If a deliberation discovers a better owner for a contract, it should push back on the memo's assignment rather than silently reassigning. Pushback is logged, not punished.

**What this memo is NOT:**
- A list of decisions made
- A constraint that prevents reframing
- A commitment to the 5-deliberation Wave 2 structure (the structure is still scaffolding)
- A replacement for reading the actual research files

---

## The Core Convergent Pattern

All five Wave 1 research files refuse the original "pick one implementation artifact" framing. Each surfaces, in its own domain, the same architectural pattern:

> **Separate the thing that must remain stable from the thing that may vary.**

(Phrasing critically inherited from the Codex GPT-5.4 xhigh review of Wave 2 structure decisions, 2026-04-11.)

What is stable: the contract, the identity, the boundary semantics, the typed envelope, the schema.

What may vary: the implementation, the language, the renderer, the body format, the era-specific values.

Why this pattern: the platform's vision spans multiple regulation eras, multiple compute backends (local/remote/cloud), progressive visualization complexity, evolving educational content, and possibly multiple rendering strategies. **No single implementation choice can remain correct across that horizon.** The architectural move that preserves vision optionality is to define what must remain stable (the boundary) and let implementations behind it evolve.

This is not "hybrid wins because hybrid is always best." It is "the option space contains many viable implementations, and the durable architectural decision is the boundary that allows them to coexist or replace each other cleanly."

### How each research file expresses the pattern

- **R1 (compute backends):** "establish an async transport-neutral backend contract, then keep multiple backend languages viable behind it" (research/01-compute-backends.md, §13 Provisional Position)
- **R4 (streaming):** "introduce a transport-neutral job protocol with typed event unions and fetchable artifacts" rather than picking a streaming library (research/04-streaming-architectures.md, §13 Provisional Position)
- **R2 (visualization):** "define a renderer-agnostic surface made of typed artifacts, shared interaction state, and stable annotation anchors, then allow multiple renderer families under that surface" (research/02-visualization-at-scale.md, §Provisional Position)
- **R3 (education):** "make lesson identity, prerequisites, role tags, artifact bindings, and overlay semantics first-class typed objects, while keeping the narrative body format separately swappable" (research/03-educational-content-architectures.md, §Provisional Position)
- **R5 (regulations):** "the resilient design space is semantic family identity plus document schema version plus explicit capability modeling for subsystem presence and absence" (research/05-multi-regulation-typing.md, §13 Provisional Position)

Five files. Five domains. One pattern.

---

## Two Kinds of Questions

The pattern manifests differently depending on what kind of question is being asked. The Codex review surfaced this distinction and it is load-bearing for closure criteria:

### Contract questions
- Closure shape: interface specification
- Examples: compute boundary, job protocol, renderer contract, interaction state contract, annotation-anchor contract
- What "good closure" looks like: typed interfaces, explicit semantics for cross-boundary calls, clear ownership of state and events
- Failure mode if mishandled: implementations behind the boundary make incompatible assumptions

### Ontology questions
- Closure shape: organizing axes plus explicit non-comparability rules
- Examples: regulation identity model, lesson concept graph
- What "good closure" looks like: which axis is primary, what counts as comparable across instances, what counts as explicitly non-comparable, what schema evolution looks like
- Failure mode if mishandled: silent collapse of distinct things into the same category, or silent fragmentation of compatible things into different categories

**Implication for Wave 2 prompt drafting:** Each deliberation prompt must declare what kind of question it is closing and what kind of answer counts. Contract deliberations cannot close on "we picked the era-family axis" the way ontology deliberations can; ontology deliberations cannot close on "we defined the request envelope" the way contract deliberations can. Wrong closure criteria = wrong-shaped output.

---

## The Catalog: Contracts and Ontologies Wave 1 Surfaced

Eight items, distinguished by question type. Each entry includes a description, the research file(s) that surfaced it, and a tentative ownership assignment.

### Contract 1: Compute execution boundary

**Question type:** Contract
**Description:** The interface separating "what compute to run" from "how compute happens." Concretely: how a client (browser, API) submits a simulation request; how the system dispatches the request to in-process or out-of-process execution; how results return; how cancellation works; how errors propagate. This boundary is the abstraction that lets the computational backend evolve from current TypeScript through Python sidecars, Rust services, or remote/cloud execution without rewriting the rest of the platform.
**Research source:** research/01-compute-backends.md (§4 Reframing, §6 Option Space, §13 Provisional Position); research/04-streaming-architectures.md (§4 Reframing, §6 Option Space)
**Tentative owner:** D1 (backend boundary deliberation)
**Closure criteria:** Interface specification + initial implementation choice + migration shape

### Contract 2: Job/event protocol

**Question type:** Contract
**Description:** The protocol for submit/observe/fetch/cancel job lifecycle. Typed event unions (job-submitted, progress, artifact-ready, completed, failed, cancelled). Subscription model. Reconnection and replay semantics. This is the "how" layer underneath the compute boundary — what events exist, how clients subscribe, how partial results delivered. Distinct from the compute boundary because the same protocol can wrap different compute implementations.
**Research source:** research/04-streaming-architectures.md (§6 Protocol Design Space, §13 Provisional Position)
**Tentative owner:** D1 (backend boundary deliberation) — coupled tightly enough to compute boundary to belong with it
**Closure criteria:** Event union shape + subscription semantics + cancellation/replay model

### Contract 3: Artifact / provenance contract

**Question type:** Contract
**Description:** **The cross-lane contract Codex's review identified as missing from Claude's original synthesis.** Defines: what counts as a typed artifact, how artifacts are identified (stable IDs across sessions and runs), what provenance fields each artifact carries, how artifact schemas evolve, how artifacts are fetched separately from live events, how artifacts reference each other (parent runs, branch lineage, regulation snapshots).

This contract is referenced by **four of five research files** but owned by none in the original deliberation plan:
- R1 §4 (Reframing): "what boundary should own simulation execution, artifacts, and progress"
- R4 §6 (Protocol Design Space): "emit progress events and durable artifact-available events separately"
- R2 §Provisional Position: "renderer-agnostic surface made of typed artifacts"
- R3 §Integration patterns: "artifact-relative anchors: bind to stable ids such as `strategy/baseline/stint/2/event/pit-in`"

**Failure mode if no deliberation owns this:** D1 picks an artifact envelope shape, D2 picks a different one for renderer consumption, D3 picks a third for lesson binding. Synthesis stage discovers the incompatibilities or worse — the deliberations close around incompatible assumptions and the conflict surfaces during implementation.
**Research source:** R1, R2, R3, R4 (cross-cutting)
**Tentative owner:** D1 (with explicit constraint that D2 and D3 must consume the contract D1 produces, not redefine it)
**Closure criteria:** Typed artifact envelope shape + ID semantics + provenance fields + evolution rules

### Contract 4: Renderer-agnostic visualization surface

**Question type:** Contract
**Description:** The interface that lets visualization implementations (visx-based SVG primitives, Canvas, WebGL, hybrid) coexist behind a common API. Defines: what data shape charts consume, what interaction state they expose, how renderer choice is made per-view-family, how migration between renderer families happens incrementally. Distinct from "which library to use" — the contract is what makes library choice replaceable.
**Research source:** research/02-visualization-at-scale.md (§Reframing, §Option Space Option D, §Provisional Position)
**Tentative owner:** D2 (visualization deliberation)
**Closure criteria:** Data shape contract + interaction state shape + renderer-family selection mechanism

### Contract 5: Shared interaction state contract

**Question type:** Contract
**Description:** Shared cursor position, brush window, selected branch, pinned annotation, focused lesson step. The state that links multiple panels (linked brushing across 4+ views) and that lessons can step through. Distinct from the renderer contract because the same interaction state can be consumed by different renderer families. Codex's review surfaced this as a separate item from the renderer contract.
**Research source:** research/02-visualization-at-scale.md (§F1-specific demand map, §Provisional Position)
**Tentative owner:** D2 (visualization deliberation) — naturally co-owned with renderer contract
**Closure criteria:** State shape + propagation semantics + ownership rules (which component sets each piece)

### Contract 6: Annotation-anchor / view-recipe contract

**Question type:** Contract
**Description:** How annotations attach to chart marks or artifact states. Stable anchors (artifact-relative IDs like `strategy/baseline/stint/2/event/pit-in`) that don't break when chart layouts change. View recipes (canonical panel arrangements + focused artifacts) that lessons can target. Fallback semantics when bound artifacts are absent. This contract is the integration point between visualization and educational content — it's what lets lessons compose over engineering views without duplicating chart infrastructure.
**Research source:** research/02-visualization-at-scale.md (§F1-specific demand map); research/03-educational-content-architectures.md (§Integration patterns with engineering visualization, §Provisional Position)
**Tentative owner:** D2 owns the renderer-side anchor specification; D3 consumes it. Unless deliberation discovers the right owner is the other way around.
**Closure criteria:** Anchor identity scheme + binding/resolution semantics + fallback rules

### Ontology 1: Lesson concept graph and artifact-binding model

**Question type:** Ontology
**Description:** The structured content model: LessonUnit identity (lessonId, conceptId, role tags, difficulty), prerequisite edges, scenario context, artifact bindings, pedagogical scaffolding, assessment hooks, display contracts. Distinct from the body format (Markdown, MDX, notebook, TS module) — the ontology defines what a lesson IS independent of how its narrative is authored. Closure shape is "axes and structure," not "interface."
**Research source:** research/03-educational-content-architectures.md (§Reframing, §Option Space Option F, §Schema dimensions, §Provisional Position)
**Tentative owner:** D3 (educational content deliberation)
**Closure criteria:** Primary axes (concept graph + artifact graph) + minimum viable schema + body-format adapter pattern

### Ontology 2: Regulation identity / version / capability model

**Question type:** Ontology
**Description:** How regulations are organized as first-class typed objects across multiple eras. Three independent axes Codex's analysis surfaced: (1) regulation family identity (era-family vs capability-first), (2) document schema version (handled independently, with migrations), (3) capability presence (active aero / DRS / electrical deployment / refueling / etc). Plus comparability semantics: which metrics are inherently cross-era comparable, which require derived normalization, which are explicitly non-comparable. Closure shape is "axes and rules," not "interface."

**Coupling note:** R5 surfaced an unplanned coupling between regulation typing and execution architecture — `sim-core` has hardcoded 2026 electrical constants. This means *part* of the regulation question is contract-shaped (how does typed regulation data flow through the execution boundary?) and *part* is ontology-shaped (what are the organizing axes for multi-era regulation modeling?). The boundary memo and the deliberation structure should respect this split.
**Research source:** research/05-multi-regulation-typing.md (§4 Reframing, §6 Option Space, §9 Gray Areas Encountered, §13 Provisional Position)
**Tentative owners (split per Codex review):**
- **Execution-flow slice → D1** (regulation flow contract: where regulation documents are canonicalized, what crosses the backend request boundary, how artifacts reference regulation family/version, which sim-core hardcodings must end)
- **Semantic-model slice → D5** (organizing axes, schema evolution, comparability rules, override model, semantic identifiers)
**Closure criteria:**
- D1 portion: contract — interface specification for regulation data crossing the compute boundary
- D5 portion: ontology — primary axis choice + schema versioning approach + comparability rules

---

## Cross-Cutting Constraints (Things Multiple Deliberations Must Honor)

These are not contracts owned by single deliberations. They are constraints that propagate across multiple deliberations and that the Wave 2 prompt drafting should make explicit:

### Cross-cutting 1: Performance envelope (subject to Round 1.5)

The Codex review and the research files agree that compute (D1), streaming (within D1), and visualization (D2) closure are blocked without measurable performance targets. Round 1.5 will produce `research/06-performance-envelopes.md` covering UI/rendering envelope AND job/compute envelope. D1 and D2 prompts must consume the Round 1.5 output as a constraint. D3 and D5 are not equally blocked; their prompts may reference performance considerations but should not treat them as primary closure criteria.

### Cross-cutting 2: Cross-era comparability affordance

R5's gray area 2 + R2's F1-specific demand map + R3's integration patterns together imply that views and lessons may need explicit non-equivalence affordances when comparing across regulation eras. D2's prompt must include an instruction: "your visualization architecture must accommodate non-comparable, derived-equivalence, and family-specific states across regulation eras." D3's prompt similarly: "your lesson architecture must accommodate scenarios where bound artifacts don't exist or don't apply in a given regulation era." Without these constraints up front, D2 and D3 will design comparison surfaces and lessons assuming all eras collapse into the same axis system, silently reintroducing false clarity.

### Cross-cutting 3: Honesty constraints on placeholder vs. real fidelity

CLAUDE.md already encodes the convention: "Never imply model fidelity the current phase doesn't support." The audit response added "confidence labeling on placeholder outputs" as a Phase 4 success criterion. Each Wave 2 deliberation prompt should reference this constraint and require its outcomes to support honesty labeling — visualization (provenance markers on chart marks), education (clear distinction between explanatory content and validated claims), regulation comparison (explicit non-comparability tags), compute (clear separation between reduced-order outputs and high-fidelity results when both eventually coexist).

### Cross-cutting 4: The label-trap

Codex's final cross-cutting observation: "the strongest Wave 1 convergence is do-not-decide-at-the-label level yet." R1 is not really a Python-vs-Rust prompt. R2 is not really a visx-vs-Canvas prompt. R3 is not really an MDX-vs-notebook prompt. R5 is not really a discriminated-union-vs-versioning prompt. Each Wave 2 prompt should explicitly forbid label-level closure ("we picked Python" / "we picked visx") and require closure at the deeper unit of analysis ("the backend boundary contract is X, the initial implementation is Python because Y, the migration shape is Z"). The label is downstream of the contract; the contract is the actual decision.

### Cross-cutting 5: Accessibility as architectural constraint (added 2026-04-11)

The platform vision describes a "serious platform that up-and-coming racing engineers would use" and explicitly includes education scope. Accessibility is a first-class constraint for serious engineering and educational tools — WCAG AA is the minimum level expected for engineering software in most institutional contexts, keyboard navigation is non-optional for engineers using the platform in high-pressure race-weekend environments, and ARIA annotations are required for screen reader users as well as for programmatic introspection of chart content.

**How this constrains Wave 2b deliberations:**

- **D2 (C4 renderer contract):** must support keyboard navigation for all interactive chart elements, not just mouse/touch. The renderer-agnostic surface must preserve focus management and accessible name/role/value semantics across whichever rendering family is active.
- **D2 (C5 shared interaction state):** must be keyboard-driven, not mouse-only. Shared cursor, brush, selection state must be reachable and modifiable via keyboard.
- **D2 (C6 annotation anchors, renderer side):** anchors must carry accessible labels that screen readers can announce. Visual annotations without accessible text equivalents are not conformant.
- **D3 (O1 lesson graph, C6 anchor content side):** every lesson unit must specify accessible text for guided content. Audio/video content (if any) requires captions and transcripts. Guided tours must work with keyboard-only navigation.
- **If a deliberation proposes a visualization primitive or content pattern that cannot be made accessible** (e.g., purely-visual pattern recognition, color-only information encoding, mouse-hover-only interaction), it must either propose an accessible alternative or explicitly defer with closure criteria.

This is not asking each deliberation to redesign for accessibility. It is asking them to treat accessibility as a constraint on which substrate options are viable. Some options (hand-rolled Canvas with mouse-only interaction) may be ruled out by this constraint; some options (visx SVG with proper ARIA) may be preferred.

**Why cross-cutting and not a separate deliberation:** accessibility is not option-space-shaped. There are no competing alternatives to deliberate between — you commit to a level (WCAG AA minimum) or you don't. The commitment lives in the memo so it binds every deliberation uniformly.

### Cross-cutting 6: Thin-client responsive rendering (added 2026-04-11)

The development model is browser on apollo (MacBook Air, thin client) connected to backend on dionysus (Xeon W-2125 dev server) over Tailscale. **The browser runs on the weaker machine.** Visualization performance and rendering must be acceptable on apollo, not just on a desktop browser attached directly to dionysus. R1.5's performance envelopes already explicitly distinguish dionysus (compute baseline) from apollo (client/render baseline); this memo entry elevates that distinction to a standing constraint.

**How this constrains Wave 2b deliberations:**

- **D2 (C4/C5/C6):** performance envelope closure must be on the real client path, not on headless browsers running on the server. The renderer-agnostic surface must remain responsive under apollo's constraints — MacBook Air CPU/GPU, 8-16GB RAM, Safari/Chrome/Firefox on macOS.
- **D2:** the hardcoded three-zone `App.tsx` workspace layout is not enough even for the current dev scenario. Responsive layout for different viewport sizes is a commitment, even if the primary target remains desktop browsers.
- **D2:** touch support is not a v1 requirement, but the renderer contract and interaction state contract should not preclude adding touch handlers later. No mouse-only APIs baked into the substrate.
- **D3 (O1 + C6 content side):** lesson rendering must work on the same thin-client path. Guided tours must degrade gracefully if bandwidth or latency varies. Content payloads should be bounded — no massive lesson blobs that hang the client.
- **Tailscale latency characteristics** (typically 20-80ms round-trip for nearby nodes) should be assumed, not ignored. Every live-update pattern must be viable under that latency.

**Why cross-cutting:** this is a deployment-model constraint, not a deliberation choice. Every viz and content decision inherits it.

### Cross-cutting 7: Honesty labeling visible in the UI (added 2026-04-11)

Cross-cutting 3 already addresses honesty constraints conceptually, but framed them as "the constraint exists" rather than "the constraint manifests visibly in the product." This expansion makes the visible surfacing explicit: D1's artifact contract (C3) already includes `fidelityTier` and `validationState` fields with values `placeholder | reduced-order | benchmarked | calibrated | validated`. Those fields being present in metadata is NOT sufficient. **They must surface in the UI visibly so users can see the fidelity state of every output they are looking at.**

This closes the loophole that the contract-level work D1 did is only useful if the UI actually honors it.

**How this constrains Wave 2b deliberations:**

- **D2 (C4 renderer contract):** must support visible fidelity markers on every chart. The marker form factor is a design question (icon, color ribbon, corner label, status badge) but presence is mandatory. `placeholder` state must be visually distinct from `validated` state in a way the user can recognize without hover or click.
- **D2 (C5/C6):** comparison views that mix artifacts across different fidelity tiers must make the mixing explicit, not hide it. A chart comparing a `reduced-order` simulation with a `calibrated` reference must visibly indicate which is which.
- **D3 (O1 + C6 content side):** lessons that reference artifacts must display the artifact's fidelity state to the learner. Lessons built on `placeholder` or `reduced-order` artifacts must frame their claims with appropriate epistemic humility — no lesson should teach "this is how F1 works" when the underlying artifact is explicitly labeled as reduced-order or placeholder.
- **D3:** lesson-level validation should treat fidelity-tier mismatches as authoring errors. A lesson claiming "calibration results" based on a `placeholder` artifact should fail content validation.

**Why this expansion, given Cross-cutting 3 already exists:** cross-cutting 3 addresses the architectural commitment to honesty labeling. Cross-cutting 7 addresses the product-surface commitment to making it visible. Both are needed. Without cross-cutting 7, an architecturally-correct design could ship an artifact model with rich fidelity metadata that the UI silently discards, producing a product that looks confident while the underlying data is honestly provisional.

---

## How Wave 2 Prompts Should Use This Memo

Each Wave 2 deliberation prompt should:

1. **Read this memo before any task work** (alongside RESEARCH-PRINCIPLES.md and the relevant research files).
2. **Declare which contracts/ontologies it is empowered to close.** Reference the catalog above by item number.
3. **Declare which contracts/ontologies it must consume but cannot close.** These are constraints inherited from other deliberations or from this memo.
4. **Declare the closure criteria appropriate to its question type** (contract = interface specification; ontology = axes + rules).
5. **Acknowledge cross-cutting constraints** the deliberation must honor: performance envelope (Round 1.5), cross-era comparability affordance, honesty constraints, label-trap, accessibility as architectural constraint, thin-client responsive rendering, and honesty labeling visible in the UI. Each constraint applies differently to different deliberations — D2 inherits all seven; D3 inherits six (all except the label-trap's compute framing); D5 inherits four (performance, comparability, honesty constraints, label-trap).
6. **Explicitly invite push-back on the memo.** If the deliberation discovers a better ownership assignment, naming a different cross-cutting concern, or finding the contract-vs-ontology classification wrong, it should mark this as a finding for synthesis, not silently reorganize.

The memo is scaffolding. The deliberations are where decisions actually happen. The memo's job is to make sure the deliberations don't drift apart on shared concerns.

---

## Tentative Wave 2 Structure (For Reference, Not Commitment)

Based on this memo, the Wave 2 deliberation structure looks like:

| Wave | Deliberation | Closes (contracts/ontologies from catalog) | Question type |
|------|--------------|--------------------------------------------|---------------|
| 2a | **D1: Backend boundary architecture** | C1 (compute exec boundary), C2 (job/event protocol), C3 (artifact/provenance contract), regulation execution-flow slice from O2 | Contract |
| 2b-i | **D2: Visualization architecture** | C4 (renderer-agnostic surface), C5 (shared interaction state), C6 (annotation anchor — renderer side) | Contract |
| 2b-ii | **D3: Educational content architecture** | O1 (lesson concept graph + artifact binding), C6 (annotation anchor — content side) | Ontology + contract |
| 2b-iii (optional) | **D2 revision** | If D3 surfaces new requirements for C5/C6 | Contract |
| 2c | **D5: Regulation semantic model** | O2 semantic-model slice (organizing axes, schema versioning, comparability rules) | Ontology |
| 2d | **D4: Long-horizon roadmap synthesis** | None (synthesizes all above into roadmap projection) | Synthesis |

Plus pre-Wave-2:
- **Round 1.5: Performance envelopes research** — produces `research/06-performance-envelopes.md` covering UI/rendering AND job/compute envelopes

This structure is the current best guess at how the catalog maps onto deliberations. If during deliberation drafting the assignments turn out to be wrong, the memo and the structure both adjust.

---

## What This Memo Does NOT Do

Repeating to be explicit:

- It does not close any decisions
- It does not commit to the 5-deliberation Wave 2 shape
- It does not constrain the deliberations to its tentative ownership assignments
- It does not replace reading the actual research files
- It does not predict the deliberation outcomes — it only frames the questions

If the memo is wrong about what Wave 1 surfaced, the right response is to fix the memo, not to ignore it. If the memo is right about what Wave 1 surfaced but wrong about the ownership assignments, the right response is for the affected deliberations to push back during their work.

---

## References

- All five Wave 1 research files in `research/`
- `audit-response-2026-04-10.md` (consolidated audit findings)
- `review-wave-2-structure-decisions.md` (Codex GPT-5.4 xhigh review of Wave 2 structure decisions, 2026-04-11) — origin of the contract-vs-ontology distinction, the artifact contract finding, and the label-trap warning
- `RESEARCH-PRINCIPLES.md` (methodological foundation for the initiative)
- `VISION.md` (long-term platform vision — the anchor for everything)
