# Call 1C: Multi-Regulation Typing Research

**Wave:** 1 (Research Round 1)
**Model:** gpt-5.4
**Reasoning effort:** high
**Mode:** Terrain mapping (see RESEARCH-PRINCIPLES.md § Research Modes)
**Task:** R5 (multi-regulation typing strategies) — standalone call because this research is genuinely independent of the other lanes (no strong coupling to compute, streaming, visualization, or education).

---

## MANDATORY: Read RESEARCH-PRINCIPLES.md first

Before doing ANY task work, read `.planning/initiatives/vision-alignment-2026-04/RESEARCH-PRINCIPLES.md` completely. You are in **terrain mapping** mode. Do not pick a winning schema design — map the option space.

---

## Context files (read in this order)

1. `.planning/VISION.md` — especially the multi-regulation scope section
2. `.planning/PROJECT.md` — current project definition, decisions around regulation presets
3. `.planning/ROADMAP.md` — current milestone context
4. `.planning/audits/vision-audit-2026-04-08/audit-response-2026-04-10.md` — Finding #6 (multi-regulation under-typed)
5. `.planning/initiatives/vision-alignment-2026-04/README.md`
6. `.planning/initiatives/vision-alignment-2026-04/PLAN.md`

## Code files relevant to this research

Read to understand the current preset/regulation typing state:

- `packages/domain/src/presets/schema.ts` — the current `z.record(z.string(), z.unknown())` preset shape
- `packages/domain/src/scenario/schema.ts` — scenario document schema referencing regulations
- `packages/domain/src/runs/schema.ts` — run records with preset snapshots
- `presets/regulations/` — list files, read 1-2 representative regulation preset JSONs (e.g., fia-2026-baseline)
- `apps/local-api/src/services/runService.ts` — how regulation values are currently consumed (look for loose casts and ad-hoc extraction)
- Root `package.json` for Zod version

## Shell commands to run (as needed)

- `find presets/ -name '*.json' | head -20` — list available preset files
- `grep -rn 'regulationValues\|regulation.values\|z.record' packages/domain/src/ apps/local-api/src/` — find current regulation handling
- `npm view zod version --json` — current Zod version
- `curl -s <url>` — fetch TypeScript/Zod documentation on discriminated unions, schema evolution patterns

## Research task

### Task R5: Multi-Regulation Typing Strategies

**Research question (as received):** `packages/domain/src/presets/schema.ts` currently uses `values: z.record(z.string(), z.unknown())` for regulation presets. This worked for 2026 but will not scale to historical regulation eras (2022-2025 ground effect, 2017-2021 high downforce, V8 era, etc.) that the vision promises. How should multi-era regulation typing actually work?

**Reminder: you are in terrain mapping mode.** Map the option space without picking a winner.

### Option space to map

**1. Typing approaches**
- Discriminated unions in TypeScript + Zod (how to structure era-specific fields)
- Generic base + era-specific extensions
- Versioned schemas (schema v1, v2, v3 with migrations)
- Tagged unions with `regulationEra` discriminator
- Branded types for compile-time era safety
- Structural typing (era-agnostic shape, era-marked values)
- Runtime-validated loose typing (current approach, as baseline)

**2. Schema evolution patterns**
- How to add a new era without breaking existing presets
- Migration scripts from older preset formats
- Zod's `.transform()` and `.preprocess()` for migration
- Backward compatibility guarantees
- Semver or era-based versioning

**3. Preset inheritance and overrides**
- Base regulation + team-specific overrides
- Regulation diff visualization (cross-era comparison)
- Partial override patterns
- Override resolution (flat merge, deep merge, field-specific rules)

**4. Regulation comparison data shapes**
- If a user wants to run "same scenario under 2022 vs 2026 regulations," what does the data model look like?
- Cross-regulation equivalence (what's comparable, what isn't)
- Era-specific subsystem presence (active aero exists in 2026, not in 2022)
- How to represent "this subsystem doesn't exist in this era" cleanly

### Reference domain-modeling projects

Find and analyze precedents where applicable:
- Sports analytics projects handling rule versioning
- Tax software / legal compliance projects handling regulation versioning
- Game engines handling version-dependent physics (e.g., chess variant rules, Pokemon generation rules)
- Scientific modeling tools handling parameter evolution across experiments
- Data pipeline tools handling schema evolution

Cite specific named projects with specific documented approaches, not generalities.

### F1-specific constraints to surface

- 2026 regulations introduce active aero (not in 2022-2025)
- 2022-2025 ground effect era has different tire philosophies
- Electrical deployment rules vary across eras
- Some eras have DRS, some don't
- Tire compound allocations differ
- Weight limits, fuel flow limits, and other constraints evolve

How should the typing capture "this preset is for era X, which means these subsystems apply and those don't"?

---

## Required output

Write to `.planning/initiatives/vision-alignment-2026-04/research/05-multi-regulation-typing.md`.

**Output file format** — follow RESEARCH-PRINCIPLES.md § Required Output Sections for research files.

Mandatory sections:
1. Metadata
2. Executive Summary
3. Question as Received
4. Reframing (if any)
5. Assumptions Surfaced
6. Option Space (map, do not rank)
7. Trajectory Analysis (1/3/5-year per option)
8. Precedent Analysis (specific named projects)
9. Gray Areas Encountered (three-response framework)
10. Scope Expansion Notes
11. Path of Inquiry
12. Dependencies and Relations (note: this task is mostly independent, but if you find couplings to compute backend, streaming, viz, or education, mark them)
13. Provisional Position
14. Confidence Ledger
15. Unresolved Questions
16. References

**Use cat heredoc** to write the file.

## Completion signal

At the end of the call, print:

```
Wave 1C complete.
- research/05-multi-regulation-typing.md (XXX lines)
```

Report any gray areas escalated via the three-response framework. Report any reframings that surfaced. Report any scope expansions.

## Reminders

- **Terrain mapping mode** — map, don't rank
- **Precedent analysis must cite specific named projects**
- **Gray areas via three-response framework**
- **If you find unexpected couplings to other research lanes, mark them** — R5 was expected to be independent, but if investigation shows otherwise, that's a valuable finding
- **Zod's specific capabilities should be cited with documentation URLs** — this is a TypeScript+Zod-specific investigation
