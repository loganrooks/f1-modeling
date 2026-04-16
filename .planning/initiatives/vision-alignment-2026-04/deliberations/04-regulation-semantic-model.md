# 04 Regulation Semantic Model

## Metadata

- Date: 2026-04-11
- Mode: Deliberation
- Reasoning effort: xhigh
- Inputs consumed:
  - `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md`
  - `.planning/initiatives/vision-alignment-2026-04/BOUNDARY-CONTRACT-MEMO.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/01-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/02-decision-anchor.md`
  - `.planning/initiatives/vision-alignment-2026-04/deliberations/03-decision-anchor.md`
  - `.planning/VISION.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`
  - `.planning/initiatives/vision-alignment-2026-04/research/06-performance-envelopes.md`
  - `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md`
  - `.planning/initiatives/vision-alignment-2026-04/reviews/review-wave-2-structure-decisions.md`
- Supporting reads for grounding:
  - `packages/domain/src/presets/schema.ts`
  - `packages/domain/src/runs/schema.ts`
  - `packages/domain/src/scenario/schema.ts`
  - `apps/local-api/src/services/runService.ts`
  - `packages/sim-core/src/stintModel/electricalModel.ts`

## Question

Close Ontology 2: the regulation identity / version / capability model that the platform should treat as canonical for multi-era regulation semantics.

The question is not "which TypeScript or Zod pattern should be used?" The real closure target is deeper: what the stable semantic axes are, what counts as family identity, what counts as capability presence, how schema evolution stays separate from semantic identity, how cross-era comparability is represented honestly, and what minimum semantic information must survive compilation into D1's `ExecutionRegulationSnapshot`.

## Stakes

- This decision determines whether the platform's multi-regulation scope in `VISION.md` remains a real architectural commitment or degrades into 2026-shaped casts plus ad hoc historical exceptions.
- D1 already closed the execution-flow side. If D5 leaves the semantic side vague, Phase 4 will silently encode family identity, capability presence, and comparability rules inside compilers, renderers, and lessons instead of in one ontology.
- D2 and D3 already depend on honest cross-era states. If D5 closes badly, their comparison surfaces and lesson bindings will either overstate equivalence or fragment into bespoke per-era exceptions.
- `DESN-01`, `VISU-03`, `VISU-04`, `EDU-01`, `EDU-02`, `EDU-03`, and `VAL-01` all depend on regulation semantics being explicit enough to compare, explain, and label honestly.
- What remains intentionally open is implementation syntax: exact schema files, exact Zod composition, full metric registry breadth, and exact patch grammar.

## Option Space

R5 already mapped the meaningful options. This deliberation does not re-invent them; it narrows them against D1/D2/D3's now-closed constraints.

- Option A, the loose `record<string, unknown>` model, is no longer viable. It already leaks into `runService` casts and leaves `sim-core` hardcoded to 2026 electrical semantics.
- Option B, era-family discriminated unions, is necessary but insufficient by itself. Family identity is required for runtime discrimination, but family labels alone do not tell D2 or D3 what is directly comparable, derived, family-specific, or non-comparable.
- Option C, shared base plus extensions, is useful as an implementation tactic inside families, but it is too easy for the "base" to become a false-common-core ontology.
- Option D, version-first documents plus migrations, is necessary for storage evolution, but it is not a semantic organizing axis. It answers "how is this file encoded?" not "what ruleset is this?" or "what comparison claims are honest?"
- Option E, capability-first structural typing, is strong on comparability and future rule experimentation, but weak as the sole runtime identity because execution formulas, provenance, and lesson framing still need family-level semantics.
- Option F, branded helper types, remains downstream ergonomics only.
- Option G, the hybrid model, is the viable center. The remaining work is to state the hybrid precisely enough that it closes at ontology level rather than at label level.

The narrowed option space is therefore: family identity must be first-class, capability topology must be explicit, and document schema version must remain independent. The real choice is whether one of those becomes the sole primary axis. My conclusion is no: the ontology should be hybrid, but not flatly so. Family identity should be primary for semantic identity and runtime discrimination, while capability semantics should be first-class for comparability and applicability.

## Tradeoffs

### 1-year horizon

- A family-primary hybrid gives D1 a clean compiler target immediately and stops the current pattern where regulation meaning is reconstructed from loose preset bags and hardcoded sim-core defaults.
- The cost is near-term modeling work: at least one canonical family catalog, explicit capability modules, and a comparability vocabulary must exist before Phase 4 planning is honest.
- This is still cheaper than deferral, because deferral would force D1, D2, and D3 to each create local substitutes for the same ontology.

### 3-year horizon

- A family-primary hybrid preserves historical-family growth without pretending that year labels alone are stable semantic identities.
- Explicit capability presence keeps the project from collapsing into "2022 vs 2026 as two opaque blobs," which would be too weak for `DESN-01`, educational comparisons, and future mixed-regulation exploration.
- The main risk is taxonomy drift: if family boundaries are drawn too coarsely, comparisons lie; if drawn too finely, preset authoring and migration fragment.

### 5-year horizon

- The hybrid model keeps both the historical-regulation and hypothetical-regulation doors open. That matters because the vision includes future-rule modeling and regulation impact assessment, not just archival playback.
- Pure family-first would eventually push hypothetical rulesets into awkward pseudo-years. Pure capability-first would eventually under-specify formula families and provenance.
- Stable semantic identifiers introduce some ontology overhead now, but without them rename/restructure pressure will later break comparisons, lessons, and migration history.

### Dependency tradeoff

- D5 is only loose-to-moderately coupled to R1.5 performance work, but not uncoupled. A comparison ontology that requires bespoke pairwise adapters for every family pair would create D2/D3 branch pressure and likely fail the performance and usability envelope.
- The chosen ontology should therefore compress downstream complexity by expressing comparability through stable semantic IDs and small explicit relation classes, not through one-off per-view logic.

## Gray Areas Still Unresolved

### [FOLLOW-AND-MARK] D2's `semanticApplicability` label is narrower than the ontology D5 needs

- Why load-bearing: D2 needs a visible slot for honest comparison surfacing, but D5 needs to distinguish per-family applicability from pairwise comparison relation.
- Response in this deliberation: keep D2's accepted surface contract intact, but treat it as a presentation slot that can be populated from a richer internal distinction rather than as the entire ontology.
- Implication: Phase 4 planning should avoid implementing `semanticApplicability` as the only internal semantic field.

### [REVISIT-LATER] Exact family catalog boundaries outside the near-horizon families

- Why load-bearing: "family" cannot silently mean "calendar year," but the exact family partition for 2017-2021, 2022-2025, 2026, and later eras is not fully settled by the current evidence.
- Why not closed here: D5 can close the ontology rules for what a family is without enumerating every family the project may eventually support.
- Future closure criterion: enough domain review to decide where formula and capability grammar truly change rather than merely parameter values.

### [REVISIT-LATER] The full metric and derivation registry

- Why load-bearing: D5.C needs stable comparison semantics, but a complete registry of every future metric is too large for this round.
- Why not closed here: the ontology can close the rule for how metrics become direct, derived, family-specific, or non-comparable without enumerating every metric now.
- Future closure criterion: Phase 4 planning should name the first comparison-critical semantic IDs and derivation rules needed for strategy and subsystem views.

### [DEFER] Hypothetical regulation design-sweeps as first-class authored objects

- Why deferred: the vision clearly includes future-rule exploration, but D5 does not need to decide whether long-horizon speculative rulesets are stored as family variants, generated experiments, or a separate design-exploration artifact type.
- Recommended pickup: D4 and later Phase 8 planning, once the first historical-family implementation exists.

## Closure Analysis

O2 is ready to close at ontology level, but not as a fully enumerated taxonomy. The evidence is strong enough now for three reasons.

First, R5 already mapped the option space and explicitly surfaced the independent axes: family identity, capability presence, schema evolution, override posture, and comparability. Second, D1 fixed the execution-flow contract and therefore removed the largest ambiguity about where the ontology must handshake with execution. Third, D2 and D3 fixed the downstream honesty burden: the semantic model must be able to drive visible direct / derived / family-specific / non-comparable states and explicit regulation applicability without false equivalence.

What is not ready to close is the exhaustive registry layer: exact family list, every semantic metric ID, exact patch syntax, and whether the canonical semantic form itself deserves a separately persisted public version right away. Those are implementation- and inventory-level questions, not blockers to axis selection.

The correct closure shape is therefore a provisional recommendation: close the ontology's primary axes, minimum runtime shape, migration posture, comparison semantics, and override obligations now; defer exhaustive registries and exact encoding forms to D4 / Phase 4 planning.

## Outcome

O2 closes as a **provisional recommendation**: use a family-primary hybrid ontology with explicit capability modules, independent document schema versioning, explicit comparison relations, and field-aware family variants that compile into D1's execution snapshot without collapsing comparison honesty into execution convenience.

### D5.A: Primary organizing axis and canonical runtime shape

The primary organizing axis should be **regulation family identity inside a hybrid ontology**, not pure era labels, not pure capability bags, and not schema version. "Family" here means the smallest durable ruleset grouping that shares both a core execution grammar and a comparison grammar. Calendar year is evidence, not identity. A family may span multiple years if the platform's execution and comparison semantics remain materially the same; it may split within a year if the semantics change enough that a single family would hide non-comparability.

The minimum viable canonical runtime model should contain five semantic parts:

1. A stable `familyId`, plus an optional `familyVariantId` for a named baseline or override lineage within that family.
2. Source-document provenance: source preset identity, raw document hash, and document `schemaVersion`.
3. Explicit capability modules with presence encoded deliberately, not inferred from missing fields. Presence should be represented as a capability kind or explicit `"none"` state, because omission is too ambiguous for comparison and overrides.
4. Stable semantic identifiers for the concepts and metrics that comparisons, lessons, and migrations must survive across renames or shape refactors.
5. Override lineage describing which baseline and which typed patches were applied before execution.

Runtime discrimination should therefore work in two steps: family identity selects the core semantic grammar; capability module kinds and parameters refine how that family behaves and what comparisons are even meaningful. `schemaVersion` is never allowed to select physics or comparison meaning. This is ontology-shaped rather than implementation-shaped because the durable decision is which semantic layers exist and what role each one plays; a discriminated union, module registry, or compiler pipeline is only an implementation of those layers.

### D5.B: Schema versioning and migration posture

`schemaVersion` must remain **independent** from semantic family identity. A file can migrate from one storage shape to another while still naming the same family, and a family can add or change capabilities without requiring a new storage-version concept. Collapsing schema version into family identity would make migrations look like semantic changes and semantic changes look like serialization upgrades.

Both raw documents and canonicalized forms matter, but for different reasons. Raw authored preset documents matter for provenance, auditability, author intent, and upgrade tooling. Canonicalized semantic forms matter because D1's compiler and D2/D3's downstream honesty rules should not depend on whatever incidental key layout the authored file happened to use. The project should therefore assume a pipeline of `raw authored document -> migrated raw document -> canonical semantic form -> D1 execution snapshot`, with the raw and compiled artifacts both preserved where D1 already requires reproducibility.

The compatibility posture should be asymmetric:

- Authored preset files should receive an explicit forward-migration promise within a declared support window, because they remain editable assets.
- Historical run snapshots do **not** need the same promise. They need durable readability and reproducibility via the stored raw snapshot plus the compiled execution snapshot that actually powered the run. They do not need to be silently re-authored into the newest preset document shape every time they are read.

Near-term posture: prefer additive compatible changes where possible, ship explicit migrations where not, and keep the canonical semantic form as an internal compiler target unless and until the project decides it must be stored or exchanged as a first-class public document in its own right.

### D5.C: Comparability, applicability, and non-comparability semantics

The ontology must distinguish **applicability** from **comparison relation**, while keeping fidelity and validation orthogonal to both.

Required regulation-aware comparison states:

- `direct`: both sides instantiate the same stable semantic metric or concept with the same meaning, same measurement intent, and no required semantic translation. Family identity may differ; the semantic contract does not.
- `derived`: the compared value is only honest after an explicit declared transformation or normalization from family-local metrics into a shared semantic metric. Derived comparisons must remain visibly marked as derived.
- `family-specific`: the concept is meaningful only within one family or family cluster. Same-family comparison may be honest; cross-family comparison is not.
- `non-comparable`: no honest shared semantic exists, or one side lacks the capability or interpretive frame required to make the comparison meaningful.

Applicability is the precondition layer under that vocabulary. A capability or metric may be `applicable` to one family and `not-applicable` to another before any pairwise comparison happens at all. D2's accepted `semanticApplicability` slot can surface these outcomes, and D3's lesson applicability / binding semantics can reuse the same four visible relation classes, but D5 should not force either layer to collapse "does this concept exist here?" and "what relation holds between these two artifacts?" into the same internal rule.

Comparability therefore belongs to a **combination**:

- family capability profiles declare whether a concept can exist at all
- metric semantic definitions declare which cross-family relations are direct or derived
- artifact pairings compute the surfaced relation for a given view or lesson binding

This is also where the honesty constraint matters most. A metric can be directly comparable and still only `placeholder` or `reduced-order`. A metric can be high-fidelity and still non-comparable across families. D5 should pass relation classes to D2/D3, not a false scalar of "comparable enough."

### D5.D: Override model, semantic identifiers, and compile-to-execution handshake

The override model should be **field-aware and family-aware**, not a shallow merge and not an unconstrained deep merge. Shallow merge is too weak because many regulation changes are module-local rather than top-level replacements. Unconstrained deep merge is too dangerous because it can silently produce impossible hybrids or mutate capability topology without changing identity.

The correct override posture is a typed variant patch anchored to a declared baseline family or family variant. A valid patch may change parameters, select among family-allowed capability kinds, or explicitly disable a capability where that family semantics allows it. If a patch changes the core semantic grammar or capability topology enough that the baseline family's comparison and execution rules no longer hold, that is no longer "an override"; it is a new family or an experimental ruleset family.

Stable semantic identifiers are required beyond property names, but not for every implementation field immediately. The required minimum is:

- stable `familyId`
- stable capability identifiers
- stable semantic metric or concept identifiers for any item that must survive rename/restructure and appear in comparisons, lessons, or migrations

Property names alone are not durable enough for long-lived comparisons or lesson bindings, especially once migrations and renames begin.

The ontology-side handshake to D1 should be:

`raw regulation preset -> migrate -> canonical semantic model -> validate/apply typed variant patch -> project execution-relevant modules into ExecutionRegulationSnapshot`

D1's snapshot does not need the full comparison registry, but it must preserve enough semantic identity to keep later artifacts, lessons, and comparison surfaces honest. At minimum that means source preset identity and hash, `familyId`, `familyVariantId` or equivalent override lineage, a canonical semantic hash or reference, and the explicit execution-relevant capability states actually used at runtime. That requirement does not reopen D1's contract shape; it defines what D5 obligates the compiler to carry through it.

## Implications if Closed / Implications if Deferred

### Implications if Closed

- D4 should treat regulation work as four separate but connected roadmap threads: family cataloging, migration/canonicalization, execution compilation, and comparability/applicability registry work. Those are different tasks and should not be hidden under "type the presets."
- Phase 4 planning should not start from raw preset document typing alone. It should include a canonicalization/compiler step, removal of 2026-hardcoded execution semantics, and a first semantic ID / comparability inventory for the strategy and subsystem views most likely to ship first.
- D2 can assume comparison artifacts and anchor resolution will have stable relation classes rather than requiring renderer-local heuristics.
- D3 can assume lesson bindings are allowed to be direct, derived, family-specific, or non-comparable without inventing a separate regulation ontology.

### Implications if Deferred

- D1 would likely compile whatever seems convenient for execution, which would silently make the execution snapshot the de facto ontology.
- D2 and D3 would each need their own ad hoc comparability logic to satisfy already-accepted honesty obligations.
- The project would remain vulnerable to "2026 is the default, everything else is an exception," which is exactly the shape the audit and R5 both warned against.

## Dependencies and Relations

- **Depends on D1 strongly:** D1 fixed that regulation semantics are canonicalized before execution and compiled into `ExecutionRegulationSnapshot`. D5 depends on that contract boundary being fixed so it can state what must cross it.
- **Constrains D1 strongly:** D5 requires family identity, variant lineage, and explicit capability state to survive compilation. Execution convenience is not allowed to erase semantic identity.
- **Constrains D2 strongly:** comparison surfaces, badges, legends, and anchor fallback behavior need explicit direct / derived / family-specific / non-comparable outcomes, plus applicability states that are not recoverable only from prose.
- **Constrains D3 strongly:** lesson bindings and regulation applicability rules must reuse the same semantic relations rather than inventing a separate content-side equivalence model.
- **Affects D4 strongly:** roadmap synthesis must keep family identity, migration, comparability, and execution compilation as distinct work items with explicit sequencing.
- **Adjacent to R1.5 loosely-to-moderately:** the ontology should reduce downstream branch pressure, but D5 is not itself blocked on exact benchmark values.

## Path of Deliberation

Entry point: R5 left the core question as "era-family-first vs capability-first, with schema versioning independent," and the boundary memo plus structure review asked D5 to close the semantic-model slice without reopening D1.

Branches considered:

- pure family-first
- pure capability-first
- version-first
- hybrid with no primary axis
- family-primary hybrid

Branches abandoned:

- Pure family-first was abandoned because it would make comparison honesty too dependent on family labels and would under-specify partial similarity across families.
- Pure capability-first was abandoned because execution, provenance, and lesson framing still need stable family semantics that capability bags alone do not supply.
- Version-first was abandoned because it confuses storage evolution with semantic identity.
- Flat hybrid with no primary axis was abandoned because D1 still needs a stable identity handle for runtime discrimination and provenance.

Branch pursued:

- Family-primary hybrid was the only branch that compiled cleanly to D1, honored D2/D3's honesty states, and kept long-horizon design-exploration doors open.

Unexpected branch:

- D2's `semanticApplicability` terminology surfaced a mild modeling tension: the UI surface can stay as accepted, but the ontology underneath should distinguish applicability from pairwise comparison relation rather than force one label to do both jobs.

Push-back:

- No push-back on D1's ownership split or on the boundary memo's classification of O2 as ontology-shaped.
- Mild push-back on downstream terminology only: D2 and D3 should avoid treating "applicability" as the full internal semantic model for cross-era relation states. That is a Phase 4 planning caution, not a request to reopen their accepted contracts.

## Open Sub-questions

- What is the first explicit family catalog the project should adopt for near-horizon support: only 2026 plus one historical family, or a broader set?
- Which semantic metric IDs and derivation rules are required for the first strategy and subsystem comparison surfaces?
- Does the canonical semantic form need its own persisted schema version once it becomes a durable artifact, or is document schema version plus D1 snapshot version enough for the first implementation?
- What exact authoring and validation UX should typed family-variant patches use?
- Which capability modules are mandatory in the first family catalog beyond aero, electrical, refueling, and session/race-operation rules?

## Decision Record

### Ontology 2 (regulation identity / version / capability model)
- **Decision:** Accept as provisional recommendation
- **Rationale:** D5 closes at the right architectural layer — on axes + rules rather than on TypeScript interfaces, and it deliberately stops before family catalog enumeration, full metric registry, exact patch grammar, or canonical-form persistence. That restraint is correct: those items are Phase 4 planning and D4 roadmap synthesis work, not initiative-level deliberation. The "provisional" grade is therefore an active architectural choice (close the axes, defer the inventory), not an incompleteness. D5.A's explicit statement that *"a discriminated union, module registry, or compiler pipeline is only an implementation of those layers"* navigates the exact contract-vs-ontology drift risk the label-trap cross-cutting constraint was designed to prevent. The family-primary hybrid framing is the correct synthesis of the R5 option space: pure era-family-first underspecifies comparison honesty, pure capability-first underspecifies runtime identity and provenance, pure version-first confuses storage evolution with semantic identity, and flat hybrid underspecifies runtime discrimination. Family identity being primary for semantic identity and runtime discrimination, with capability semantics first-class for comparability and applicability, is the only synthesis that compiles cleanly to D1's `ExecutionRegulationSnapshot` while honoring D2's visible comparison semantics and D3's lesson binding applicability. Implementation commitment acknowledged: removing loose `record<string, unknown>` preset handling from `runService.ts` casts; removing 2026-hardcoded constants from `packages/sim-core/src/stintModel/electricalModel.ts` per D1 C4; introducing a canonicalization step between raw preset documents and D1 execution snapshot compilation; adopting stable semantic identifiers (familyId, capability IDs, metric/concept IDs) as part of the canonical semantic form.
- **Open question accepted (deferred):** First explicit family catalog boundaries — addressed at Phase 4 planning or D4 roadmap synthesis once the first historical-family implementation is concretely scoped. Calendar year is evidence, not identity; family boundaries should be drawn where execution grammar and comparison grammar materially change, not at arbitrary year boundaries.
- **Open question accepted (deferred):** First metric and derivation registry — Phase 4 planning must name the first comparison-critical semantic IDs and derivation rules for strategy and subsystem views. Exhaustive enumeration is not load-bearing for ontology closure.
- **Open question accepted (deferred):** Hypothetical regulation design-sweeps as first-class authored objects — not load-bearing for v1; D4 and later Phase 8 planning can decide whether to store them as family variants, generated experiments, or a separate design-exploration artifact type.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D5.A (primary organizing axis and canonical runtime shape)
- **Decision / Scope disposition:** Accept — primary axis is regulation family identity inside a family-primary hybrid ontology; minimum viable canonical runtime shape has five semantic parts (stable `familyId` + optional `familyVariantId`, source-document provenance including hash and `schemaVersion`, explicit capability modules with presence encoded as kind or `"none"` rather than inferred from absence, stable semantic identifiers, override lineage).
- **Rationale:** D5.A avoids two bad extremes cleanly: pure family-first would hide partial similarity across families and push comparability into ad hoc exceptions, while pure capability-first would under-specify the family semantics that execution, provenance, and lesson framing actually need. The correct synthesis is family identity primary for runtime discrimination and provenance, with capability topology first-class for comparability and applicability, and `schemaVersion` explicitly not allowed to carry semantic meaning. This is the right ontology answer and D5.A explicitly names the ontology-vs-implementation distinction: *"a discriminated union, module registry, or compiler pipeline is only an implementation of those layers."* The five-part runtime shape is minimal and each part has a specific role: `familyId` for semantic identity, source provenance for audit and reproducibility, capability modules with deliberate presence encoding for comparison and override (omission is too ambiguous), stable semantic identifiers for rename/restructure survival, and override lineage for variant tracking. Runtime discrimination flows in two steps: family selects the core semantic grammar, and capability module kinds + parameters refine how that family behaves. Family boundaries are drawn by the durable rule *"smallest grouping sharing both core execution grammar and comparison grammar,"* with calendar year as evidence, not identity. Implementation commitment acknowledged: introducing `familyId` as a first-class domain type; defining capability modules as explicit presence with kind or `"none"` state; enumerating the stable semantic identifiers needed for the first family(ies) the project commits to supporting.
- **Handoff to:** Phase 4 planning — first family catalog scope, exact capability module enumeration for 2026 baseline, first stable semantic identifier set. D4 roadmap synthesis should sequence family cataloging, migration/canonicalization, execution compilation, and comparability registry as distinct work items rather than one undifferentiated "regulation typing" phase.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D5.B (schema versioning and migration posture)
- **Decision / Scope disposition:** Accept — `schemaVersion` is independent from semantic family identity; migration posture is asymmetric (preset files forward-compatible within a declared support window, historical run snapshots durable-readable via stored raw + compiled artifacts without silent re-authoring into the newest preset form).
- **Rationale:** D5.B closes on one of the most important confusions cleanly: **storage evolution is not semantic identity.** Collapsing schema version into family identity would make migrations look like regulation changes and regulation changes look like serialization churn — both corrupt audit, reproducibility, and honesty stories. The asymmetric migration posture is the right cut for this project: it respects D1's reproducibility needs without overcommitting to a stronger compatibility guarantee than the project actually needs. Preset files remain editable/auditable assets that benefit from forward-migration tooling within a declared support window, while historical run snapshots need durable reproducibility through stored raw + compiled lineage (which D1's C3 artifact envelope already provides — run records store both raw and compiled forms). The near-term posture preferring additive-compatible changes where possible, explicit migrations where not, and keeping the canonical semantic form as an internal compiler target (not a separately-versioned public document) is the right calibration for the initial implementation; it can evolve to a first-class public schema later if the project decides to publish canonical semantic snapshots. Implementation commitment acknowledged: defining `schemaVersion` as a document-level field independent from `familyId`; implementing forward migration for preset files; storing raw preset document hash + compiled execution snapshot alongside every run record per D1 C3; treating the canonical semantic form as compiler-internal until and unless a separate publication need emerges.
- **Handoff to:** Phase 4 planning — exact `schemaVersion` evolution mechanism, migration tooling, declared support window for preset forward migration. The decision about whether the canonical semantic form eventually needs its own public schema version is deferred to a later milestone when durable external exchange becomes a real product requirement.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D5.C (comparability, applicability, and non-comparability semantics)
- **Decision / Commitment level:** Accept as provisional recommendation — the four-class comparison vocabulary (`direct | derived | family-specific | non-comparable`) is binding and maps directly onto D2's `semanticApplicability` slot and D3's `Applicability` enum; the exhaustive metric and derivation registry is deferred to Phase 4 planning.
- **Rationale:** D5.C is graded provisional for two specific reasons: (1) the four-class relation vocabulary closes cleanly, but the first concrete metric and derivation registry does not — naming which metrics count as direct, derived, family-specific, or non-comparable requires Phase 4 inventory work; (2) the applicability-vs-relation two-layer distinction is correctly articulated at the ontology level, but the distinction still needs Phase 4 operationalization into actual computation logic. The four relation classes reuse the vocabulary D2 and D3 already accepted, which is the right outcome — no silent drift, no parallel enum. The subtle but load-bearing distinction D5 introduces is that **applicability is a precondition layer separate from pairwise comparison relation**: a capability or metric may be `applicable` to family A and `not-applicable` to family B before any pairwise comparison happens, and pairwise comparisons compute the visible relation class only when applicability preconditions are satisfied. Collapsing these two layers into one rule would either silently fragment compatible metrics or silently coerce non-equivalent metrics into false equivalence. Comparability therefore belongs to a combination: family capability profiles declare whether a concept can exist at all; metric semantic definitions declare which cross-family relations are direct or derived; artifact pairings compute the surfaced relation for a given view or lesson binding. Honesty is preserved orthogonally: relation classes are independent from fidelity/validation states; a metric can be directly comparable and still placeholder, or high-fidelity and still non-comparable. Implementation commitment acknowledged: Phase 4 planning must define the first metric/derivation registry required for strategy and subsystem views; canonical semantic form must support the applicability-vs-relation layering rather than collapsing them.
- **Downstream implication for D2/D3:** D2's accepted `semanticApplicability` surface slot is the correct UI vocabulary (the four relation classes map directly), and D3's `RegulationApplicability.applicability` field is already aligned. Phase 4 implementers should understand that those surface states are populated by a **two-layer computation** (applicability precondition + pairwise relation computation) and should not design comparison logic that assumes a single scalar "comparability" score or that uses `semanticApplicability` as the entire internal ontology for cross-era relation states. D2 comparison surfaces, legend states, anchor fallback behavior, and D3 lesson bindings can all consume the same four visible relation classes honestly — they just shouldn't conflate the visible output with the internal computation model. This is a Phase 4 planning caution, not a request to reopen D2 or D3.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks

### D5.D (override model, semantic identifiers, and compile-to-execution handshake)
- **Decision / Commitment level:** Accept as provisional recommendation — override model is field-aware and family-aware typed patches anchored to a declared baseline family or family variant; stable semantic identifiers required beyond property names for `familyId`, capability IDs, and comparison-surviving metric/concept IDs; compile-to-execution handshake preserves semantic identity into D1's `ExecutionRegulationSnapshot` without reopening D1's contract shape.
- **Rationale:** D5.D closes the **architectural posture** but not the **implementation-facing detail**. The posture that is closed: shallow merge is too weak (many regulation changes are module-local rather than top-level replacements); unconstrained deep merge is too dangerous (can silently produce impossible hybrids or mutate capability topology without changing identity); the correct answer is family-aware typed patches anchored to a declared baseline. The implementation-facing detail that is still open (and keeps D5.D provisional rather than fully accepted) is threefold: (1) the exact typed patch grammar is still open; (2) the exact authoring and validation UX for typed variant patches is still open; (3) the precise shape of the "canonical semantic reference" that survives into or alongside D1's `ExecutionRegulationSnapshot` is still open. Each of these is Phase 4 implementation work, not ontology closure. A valid patch may change parameters, select among family-allowed capability kinds, or explicitly disable a capability where family semantics allows it, while a patch that changes core semantic grammar or capability topology is no longer an "override" but a new family or experimental ruleset family — this rule bounds override expression correctly without forcing implausible variants through merge semantics. Stable semantic identifiers beyond property names are required at minimum for `familyId`, capability IDs, and semantic metric/concept identifiers that must survive rename/restructure and appear in comparisons, lessons, or migrations. The compile-to-execution handshake pipeline is `raw preset → migrate → canonical semantic model → validate/apply typed variant patch → project execution-relevant modules into ExecutionRegulationSnapshot`, and D1's snapshot must preserve source preset identity and hash, `familyId`, `familyVariantId` (or equivalent override lineage), a canonical semantic hash or reference, and the explicit execution-relevant capability states actually used at runtime. Implementation commitment acknowledged: introducing typed variant patch grammar in the canonicalization layer; defining the stable semantic identifier scheme (minimum: `familyId`, capability IDs, metric/concept IDs); ensuring D1 `ExecutionRegulationSnapshot` compilation carries source hash + `familyId` + variant lineage + canonical semantic reference + capability state.
- **Constraint on D1 / Phase 4 planning:** D1's C3 artifact envelope and C4 regulation execution-flow contract remain closed. D5 imposes on D1 **implementation** (not contract): the compiler that produces `ExecutionRegulationSnapshot` must preserve semantic identity through the handshake — source preset identity and hash, `familyId`, `familyVariantId` or override lineage, canonical semantic hash/reference, and explicit execution-relevant capability states used at runtime. This constraint does not reopen D1's contract shape; it defines what D5 obligates the compiler to carry. Phase 4 planning should scope the canonicalization step, the typed variant patch grammar, and the stable semantic identifier scheme as distinct implementation tracks rather than bundling them into generic "regulation typing" work.
- **Date:** 2026-04-11
- **Decider:** Logan Rooks
