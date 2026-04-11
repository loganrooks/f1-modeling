# 05 Multi-Regulation Typing

## 1. Metadata

- Date: 2026-04-10
- Wave / Call: Wave 1C
- Mode: Terrain mapping
- Overall confidence: Medium
- Scope: Regulation preset typing strategies for multi-era F1 support, with bounded attention to schema evolution, overrides, comparison shape, and execution coupling where load-bearing

## 2. Executive Summary

The current regulation preset contract is intentionally loose at persistence time, but that looseness now leaks into execution: `values` is stored as `z.record(z.string(), z.unknown())`, then re-cast inside `runService`, while some regulation semantics are still hardcoded in `sim-core` rather than flowing from the preset system. That means the problem is not only "how should preset JSON be typed?" but also "what should be the authoritative identity and evolution model for regulation families across storage, run snapshots, and simulation execution?" The option space is not one-dimensional: era-tagged unions, base-plus-extension models, versioned documents with migrations, capability-first structural typing, and hybrid models each open different long-horizon doors. My current read is that the viable space centers on explicit runtime discrimination plus explicit schema-version handling, but it is too early to close on whether era-family or capability modules should be the primary organizing axis.

## 3. Question as Received

`packages/domain/src/presets/schema.ts` currently uses `values: z.record(z.string(), z.unknown())` for regulation presets. This worked for 2026 but will not scale to historical regulation eras (2022-2025 ground effect, 2017-2021 high downforce, V8 era, etc.) that the vision promises. How should multi-era regulation typing actually work?

## 4. Reframing

The effective question broadened during investigation:

How should the platform model regulation identity, capability presence, and schema evolution so that:

- preset files are typed and migratable,
- scenarios and runs can reference and snapshot them safely,
- execution code can consume them without ad-hoc casts, and
- cross-era comparison does not pretend non-equivalent subsystems are directly comparable?

Justification: answering only the storage-shape question would miss the currently load-bearing execution boundary, where regulation semantics are split between preset JSON and hardcoded sim-core assumptions.

## 5. Assumptions Surfaced

- [Load-bearing] A single preset-document shape should be able to represent all regulation eras without additional type identity beyond `presetType`.
- [Load-bearing] "Era" is the natural primary discriminator for regulation typing, rather than capability presence, simulation family, or document version.
- [Load-bearing] Typing the domain schema will by itself enable multi-era support, even if execution code still hardcodes 2026-only regulation constants.
- Cross-era comparison can be treated as ordinary field-by-field comparison rather than requiring explicit comparability semantics.
- Team-specific or scenario-specific overrides will remain shallow enough for ordinary object merging.
- Zod 4 and TypeScript are expressive enough for the domain contract; no external schema registry is required just to reach a sound v1/v2 design.

## 6. Option Space

### Option A: Keep the current loose runtime-validated map

Mechanics:

- Keep `values: z.record(z.string(), z.unknown())`.
- Push typing outward to use sites via casts, helper readers, or hand-written guards.
- Treat new eras as new JSON conventions, not new first-class schemas.

What it optimizes for:

- Fast file evolution.
- Minimal migration cost today.
- High tolerance for incomplete understanding of future eras.

What it pushes downstream:

- Semantic drift between files and code.
- Repeated casts and fallback defaults in execution code.
- Weak guarantees for snapshots, overrides, and comparisons.

### Option B: Era-tagged discriminated union

Mechanics:

- Add a discriminator such as `regulationFamily` or `eraFamily`.
- Each family gets its own Zod object and TypeScript type.
- Examples: `f1-2026-active-aero`, `f1-2022-ground-effect`, `f1-2017-high-downforce`, `f1-v8-refueling`.
- Zod fit: this maps directly to `z.discriminatedUnion()` in Zod 4.

What it optimizes for:

- Strong runtime narrowing.
- Strong compile-time ergonomics in service code.
- Honest modeling of subsystem presence and absence by family.

Primary risk:

- Era-family choices can become too coarse if multiple subfamilies or mid-era rule revisions matter.

### Option C: Shared base schema with era-specific extensions

Mechanics:

- Define a common `RegulationBase` for concepts likely to persist across eras.
- Layer era modules on top: aero, electrical, tire allocation, fuel-flow, pit, session rules.
- Extensions may be optional or family-constrained.

What it optimizes for:

- Reuse of stable concepts.
- Smaller diffs across adjacent eras.
- More graceful growth than fully separate families when overlap is real.

Primary risk:

- The base can become a junk drawer of pseudo-common fields if similarity is overstated.

### Option D: Version-first document schemas with migrations

Mechanics:

- Treat `schemaVersion` as a real evolution axis, not just a literal.
- Preserve logical regulation identity separately from document format version.
- Use migrations or parse-time transforms to normalize older documents into a canonical runtime shape.
- Zod fit: `z.preprocess()` and `.transform()` are the obvious parse-time normalization tools; `z.toJSONSchema()` can externalize the contract for documentation or validation tooling.

What it optimizes for:

- Backward compatibility for saved presets and run snapshots.
- Explicit migration boundaries.
- Safer long-term storage evolution.

Primary risk:

- Solves format evolution, not semantic family modeling, unless paired with another option.

### Option E: Capability-first structural typing

Mechanics:

- Model regulation capabilities as modules with explicit presence states.
- Example: `aeroControl: { kind: "none" | "drs" | "active-aero" }`, `electricalSystem: { kind: "ers-k-only" | "ers-k-plus-h" | "none" }`, `tireAllocation`, `fuelFlow`, `refueling`, `sessionFlags`.
- Era becomes metadata or a preset label, not the dominant type key.

What it optimizes for:

- Honest cross-era comparison by feature presence.
- Better handling of partial similarity across eras.
- Better support for hypothetical or future rulesets that mix familiar modules in new ways.

Primary risk:

- More work up front to define capability ontology and compatibility semantics.

### Option F: Branded compile-time views on top of runtime schemas

Mechanics:

- Use one of the runtime options above, then add branded helper types for execution paths.
- Example: `GroundEffectRegulation`, `ActiveAeroRegulation`, `HasElectricalDeployment`.

What it optimizes for:

- Safer internal APIs once data is parsed.
- Better ergonomics for simulation modules and visual layers.

Primary risk:

- Brands do not replace runtime discrimination; they only improve downstream safety.

### Option G: Hybrid two-axis model

Mechanics:

- Use an explicit regulation-family discriminator for runtime narrowing.
- Keep an independent document `schemaVersion`.
- Represent subsystem presence using capability modules within each family.
- Add migrations to canonicalize older documents into the newest runtime shape.
- Zod fit: metadata attached through `.meta()` / `z.globalRegistry` could carry stable schema IDs, human descriptions, or comparison annotations without forcing them into the raw runtime payload.

What it optimizes for:

- Separation between semantic identity and storage evolution.
- Better support for comparison and overrides than era-only typing.
- Cleaner path from preset storage to execution contracts.

Primary risk:

- More design work now because it refuses to collapse era, capability, and version into one field.

### Cross-cutting design axes

- Primary identity axis: era-family, capability-set, or document version.
- Subsystem absence model: omitted field, `null`, explicit `{ kind: "none" }`, or union branch with no subsystem.
- Override model: shallow object merge, deep merge, path-based patch, or field-specific resolver.
- Snapshot model: raw source document, canonicalized runtime form, or both.
- Comparison model: raw diff, normalized comparable subset, or comparability-tagged metric registry.

## 7. Trajectory Analysis

| Option | 1-year trajectory | 3-year trajectory | 5-year trajectory | Doors opened | Doors closed |
|---|---|---|---|---|---|
| A. Loose map | Minimal immediate work; current pattern persists | More casts, drift, and duplicated guards as eras multiply | High risk of ad-hoc forks in services and sim-core | Fast experimentation with uncertain future eras | Closes reliable multi-era comparison, clean API contracts, and trustworthy migrations |
| B. Era-tagged union | Strong improvement to preset loading and service narrowing | Works well if eras stay coarse and distinct | Can strain if rules mutate within eras or future regulations remix capabilities | Opens explicit family-based typing and absence modeling | Closes some flexibility for hybrid/hypothetical rulesets unless family taxonomy expands |
| C. Base + extensions | Reasonable near-term if 2022/2026 share enough structure | Useful when adjacent eras share many modules | Can degrade if the shared base becomes over-generalized | Opens reuse and smaller migrations between adjacent eras | Closes conceptual clarity if "common core" is mostly imagined |
| D. Version-first + migrations | Valuable immediately for preserving saved artifacts | Essential once multiple preset generations coexist | Remains necessary regardless of family strategy | Opens safe persistence evolution and explicit upgrade paths | Closes nothing by itself, but also does not solve semantic typing alone |
| E. Capability-first structural model | Slower to define, but comparison semantics become cleaner early | Strong fit for cross-era studies and future-rule experimentation | Strong long-horizon fit if platform becomes regulation-design sandbox | Opens hypothetical regulations, subsystem comparability, and richer education tooling | Closes simplicity; requires more ontology work before implementation |
| F. Brands on top | Small internal win once a runtime model exists | Good for simulation and visualization API hygiene | Still secondary to runtime design | Opens compile-time safety in execution modules | Closes nothing, but cannot rescue a weak runtime schema |
| G. Hybrid two-axis | Highest design cost now, but most explicit separation of concerns | Likely the most resilient once multiple eras and migrations exist | Strong long-horizon fit if platform spans historical, current, and speculative rules | Opens clean boundaries among storage, runtime semantics, and comparison | Closes simplicity and may be premature if the ontology is not yet understood |

## 8. Precedent Analysis

### OpenFisca

- Named project: OpenFisca
- Relevant pattern: legislation parameters change over time via dated parameter values, while reforms overlay targeted modifications onto a baseline tax-benefit system.
- Why it matters here: it separates "the concept persists" from "the value changes by period," and it treats reforms as explicit overlays rather than anonymous edits.
- Transferable lesson: some regulation changes are value changes inside persistent concepts, while others are true semantic family changes that need different formulas or capability sets.
- Caution: OpenFisca is period-native and law-centric; F1 regulation comparison also needs subsystem-presence semantics and simulation-specific execution contracts.

### Pokemon Showdown ecosystem

- Named projects: `smogon/damage-calc` and `pkmn/ps`
- Relevant pattern: `smogon/damage-calc` requires a `Generation` object to select the correct mechanics and data layer, while `pkmn/ps` exposes modular `dex`, `sim`, and `mods` packages for rule variants and modifications.
- Why it matters here: generation/ruleset identity is not inferred from raw move data; it is an explicit input to both data lookup and execution semantics.
- Transferable lesson: era identity should be first-class at the contract boundary, not reconstructed ad hoc from a bag of values.
- Caution: Pokémon generations are cleaner, community-stabilized buckets than F1 regulation evolution, which may require more fine-grained family or capability modeling.

### Confluent Schema Registry / Avro compatibility model

- Named project: Confluent Schema Registry
- Relevant pattern: schema evolution is governed by explicit compatibility modes such as backward, forward, full, and transitive variants; adding fields safely often depends on defaults.
- Why it matters here: saved preset files and run snapshots need a declared compatibility posture rather than assuming every future shape can parse every past shape.
- Transferable lesson: "can old runs still be read?" is a separate decision from "what is the best current runtime shape?"
- Caution: compatibility rules govern serialized schema evolution, not domain semantics; they complement family typing but do not replace it.

### Apache Iceberg

- Named project: Apache Iceberg
- Relevant pattern: schema evolution relies on stable field IDs so rename/reorder operations do not silently reinterpret old data.
- Why it matters here: if regulation comparison or migration ever involves renamed concepts, stable semantic identifiers may matter more than field names alone.
- Transferable lesson: if the platform expects long-lived historical presets, semantic identity should not depend solely on current property names.
- Caution: Iceberg solves tabular data evolution, not subsystem absence or domain ontology.

## 9. Gray Areas Encountered

### Gray area 1: execution semantics live partly outside the preset schema

- Response: Follow and mark
- Why load-bearing: typing only the preset document would leave `sim-core` still hardcoded to 2026 electrical limits, which would make any multi-era typing answer incomplete at the execution boundary.
- What I found: `runService` currently narrows only `aero` from the regulation preset, while `sim-core` electrical defaults and capacity initialization still reference a hardcoded `REGULATION_2026`.
- Implication: regulation typing and execution-contract design are coupled earlier than the call framing suggested.

### Gray area 2: cross-era comparability ontology

- Response: Revisit later
- Why load-bearing: "compare 2022 vs 2026" requires a rule for what counts as comparable when subsystems exist in one era and not another.
- Why not resolved here: this expands into metric ontology, visualization semantics, and educational honesty, which exceeds a bounded typing-only round.
- Proposed future framing: "How should regulation-aware comparison artifacts encode comparable, non-comparable, and derived-equivalence metrics across eras?"

### Gray area 3: direct sports-analytics precedents for rule-versioned engineering models

- Response: Defer
- Why deferred: structurally relevant precedents were available in legal/compliance, schema-evolution, and game-rules systems; a deeper hunt for sports-specific analogs would likely add effort without changing the main option space.
- Follow-up context if needed: revisit only if later deliberation needs a domain-specific legitimacy check beyond the current analogies.

## 10. Scope Expansion Notes

**Scope expansion encountered.**
Original framing: How should multi-era regulation preset typing work in the domain schema?
Expansion observed: Regulation semantics are split between domain preset files, `apps/local-api` extraction code, and hardcoded `sim-core` constants.
Response: Follow-and-mark
Justification: ignoring the execution split would produce a storage-only answer that looks complete but is not actually implementable for multi-era simulation.

## 11. Path of Inquiry

1. Read initiative method and project context to confirm this was terrain mapping, not schema selection.
2. Inspect current domain and API files to see whether the problem was only theoretical; it was not.
3. Trace actual consumption paths and found the current regulation preset is only lightly interpreted in `runService`.
4. Check whether regulation semantics already flow cleanly into sim-core; they do not, because electrical behavior remains 2026-hardcoded.
5. Branch into precedent search for adjacent systems with explicit rule-versioning or schema-evolution strategies.
6. Reframe from "pick a schema" to "map identity, evolution, and execution boundary options."

Abandoned branch:

- I did not pursue a deep survey of sports-analytics-specific projects after the general precedent set was sufficient to map the design space.

## 12. Dependencies and Relations

- Mostly independent from compute-backend and streaming research at the initiative level.
- Coupled to execution architecture through the preset-to-sim-core contract, because multi-era typing is incomplete if regulation semantics remain duplicated or hardcoded.
- Coupled to visualization research through regulation comparison views and the need to represent absent subsystems honestly.
- Coupled to educational-content research because "why eras differ" is partly a content and explanation problem, not just a data-model problem.
- Coupled to roadmap evolution because Phase 8 regulation/design exploration assumes some notion of comparable regulation artifacts.

## 13. Provisional Position

Known:

- The current preset contract is too loose for multi-era growth, and that looseness already causes casts in execution code.
- Storage shape alone is not the whole problem because execution semantics are split across layers.

Likely:

- Any viable long-horizon design will need both explicit runtime discrimination and explicit schema-evolution handling.
- A pure version-first strategy is insufficient without a semantic family or capability model.

Plausible:

- The most resilient eventual design space is a hybrid one: semantic family identity plus document schema version plus explicit capability modeling for subsystem presence and absence.

Unknown:

- Whether era-family or capability modules should be the dominant first-class axis in the canonical runtime form.
- Whether stable semantic field IDs are worth the cost for this project's scale.

This is not ready for closure on a winning schema design. It is ready for deliberation on the primary organizing axis: era-family-first versus capability-first, with schema versioning treated as an independent concern.

## 14. Confidence Ledger

1. Known: the current regulation preset schema stores `values` as `z.record(z.string(), z.unknown())`. Confidence: High.
2. Known: `runService` re-casts regulation values and currently only derives aero configuration from them. Confidence: High.
3. Known: multi-era support is a stated platform vision, not optional future nice-to-have. Confidence: High.
4. Known: `sim-core` still contains hardcoded 2026 electrical regulation constants, so preset typing alone will not enable multi-era execution. Confidence: High.
5. Likely: explicit runtime discrimination is necessary; helper functions over an untyped map will not scale cleanly once multiple eras coexist. Confidence: Medium-high.
6. Likely: schema-version handling should be separated from regulation-family identity. Confidence: Medium.
7. Plausible: capability-first modeling may better support cross-era comparison and future-rule experimentation than era-family alone. Confidence: Medium-low.
8. Unknown: the exact canonical shape that best balances ergonomics, migrations, and comparison semantics. Confidence: Unknown by design.

## 15. Unresolved Questions

- Should the canonical runtime discriminator be `regulationFamily`, a capability graph, or both?
- What is the minimum stable base concept set that genuinely persists across 2017, 2022, 2026, and future eras?
- How should absence be encoded: omitted fields, `null`, or explicit `kind: "none"` modules?
- Should run snapshots store the raw preset source, the canonicalized migrated form, or both?
- What compatibility promise should the project make for old preset files and historical run snapshots?
- How should override resolution work for regulation patches: shallow merge, deep merge, or field-aware patch logic?
- Which metrics are inherently cross-era comparable, and which require derived normalization or explicit "not comparable" tagging?

## 16. References

### Project files

- `.planning/VISION.md:47-56` — multi-regulation scope and requirement that presets not be hardcoded to 2026.
- `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md:35-36,101-109` — accepted finding that regulation typing is under-specified and should move toward typed families.
- `packages/domain/src/presets/schema.ts:12-27` — current preset schema and regulation specialization.
- `packages/domain/src/scenario/schema.ts:65-85` — scenarios reference regulation presets by ID only.
- `packages/domain/src/runs/schema.ts:30-78` — runs snapshot regulation presets using the same loose document shape.
- `apps/local-api/src/services/runService.ts:512-545` and `apps/local-api/src/services/runService.ts:756-786` — regulation values are re-cast and only the aero subtree is consumed.
- `packages/sim-core/src/stintModel/electricalModel.ts:1-77` — 2026-specific electrical regulation constants remain hardcoded in sim-core.
- `presets/regulations/fia-2026-baseline.json:22-53` — current regulation preset shape, including `era`, `electrical`, and `aero`.
- `package.json:18-23` and `npm view zod version --json` run on 2026-04-10 — project uses Zod `^4.3.6`, npm currently reports `4.3.6`.

### External references

- Zod docs: https://zod.dev/api?id=preprocess
- Zod metadata and registries: https://zod.dev/metadata
- Zod JSON Schema support: https://zod.dev/json-schema
- OpenFisca parameters: https://openfisca.org/doc/key-concepts/parameters.html
- OpenFisca legislation evolutions: https://openfisca.org/doc/coding-the-legislation/40_legislation_evolutions.html
- OpenFisca reforms: https://openfisca.org/doc/openfisca-python-api/reforms.html
- `smogon/damage-calc` README: https://github.com/smogon/damage-calc
- `pkmn/ps` README: https://github.com/pkmn/ps
- Confluent Schema Registry evolution and compatibility: https://docs.confluent.io/platform/7.7/schema-registry/fundamentals/schema-evolution.html
- Apache Iceberg schema evolution: https://iceberg.apache.org/docs/1.4.0/evolution/
