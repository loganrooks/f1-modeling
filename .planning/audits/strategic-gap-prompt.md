# Strategic Gap Audit Prompt

**Date:** 2026-04-07
**Model:** gpt-5.4 (high reasoning)
**Purpose:** Evaluate whether the roadmap, requirements, and architecture are the right thing to build

---

You are auditing this F1 Modeling Lab project for strategic gaps. Read the files listed, then write a single comprehensive analysis.

## Files to read

Read each of these with cat:
1. .planning/PROJECT.md
2. .planning/ROADMAP.md
3. .planning/REQUIREMENTS.md
4. packages/sim-core/src/stintModel/stintRunner.ts
5. packages/sim-core/src/stintModel/electricalModel.ts
6. packages/sim-core/src/stintModel/aeroModel.ts
7. packages/sim-core/src/lapModel/forwardBackward.ts
8. packages/domain/src/scenario/schema.ts
9. presets/regulations/fia-2026-baseline.json
10. ls -la packages/visuals/src/traces/ packages/visuals/src/workspace/ packages/visuals/src/cards/ packages/visuals/src/inspectors/

## Report to write

After reading all files, write a strategic gap analysis to .planning/audits/strategic-gap-audit-2026-04-07.md using a heredoc. The report must cover:

1. **Executive Summary**: Top 5 strategic concerns ranked by impact
2. **Roadmap Ordering**: Are the 8 phases in the right order? Are there dependency inversions where something needed earlier is planned later? Are implicit dependencies documented?
3. **Requirements Gaps**: What F1 concepts, use cases, or user workflows are missing from requirements? What would a performance engineer or strategy engineer actually need?
4. **Architecture Scalability**: Will StintRunner's lap-loop-with-state-updates scale to Phase 4 strategy (multi-stint, pit stops)? To Phase 5 driver/control (MPC)? What architectural commitments from early phases will cause problems?
5. **Electrical Model Assessment**: Is the 2026 electrical model appropriate? Missing power unit behaviors? Is the single-energy-pool simplification adequate?
6. **Visualization Strategy**: Is hand-rolled SVG sustainable for Phase 4+ complexity (strategy timelines, multi-stint views, policy overlays)? When and how do racing lines happen?
7. **Educational Value**: Does the current system actually teach F1 engineering? Can users explore what-if scenarios meaningfully? Are role-based learning paths (performance engineer, strategy engineer, vehicle dynamics) achievable with the current architecture?
8. **Data Model Extensibility**: Is the scenario schema ready for Phase 4+ (strategy configs, driver profiles, observer settings)? Will run records scale to multi-stint comparisons?
9. **Missing Features**: What should be on the roadmap that is not? What low-hanging fruit have we overlooked?
10. **Gap Matrix**: | Gap | Impact (High/Med/Low) | Urgency | Phase Affected | Recommendation |
11. **Proposed Roadmap Amendments**: Specific changes to phase ordering, scope, or plan counts

Be constructive but unsparing. Think like a principal engineer reviewing before a major milestone. Cite specific code, schemas, and planning decisions as evidence.
