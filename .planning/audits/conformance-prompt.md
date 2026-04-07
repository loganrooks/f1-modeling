# Internal Conformance Audit Prompt

**Date:** 2026-04-07
**Model:** gpt-5.4 (high reasoning)
**Purpose:** Verify implementation faithfully executes committed plans across Phases 1-3

---

You are auditing this F1 Modeling Lab project for internal conformance. Read the files listed, run the checks specified, then write a single comprehensive report.

## Files to read

Read each of these with cat:
1. .planning/ROADMAP.md
2. .planning/REQUIREMENTS.md
3. .planning/phases/01-foundations-and-scenario-schema/01-CONTEXT.md
4. .planning/phases/02-reduced-order-lap-model/02-CONTEXT.md
5. .planning/phases/03-tire-electrical-weather-environment-and-energy-dynamics/03-CONTEXT.md
6. .planning/phases/03-tire-electrical-weather-environment-and-energy-dynamics/03-VERIFICATION.md
7. packages/sim-core/src/contracts.ts
8. packages/sim-core/src/stintModel/stintRunner.ts
9. packages/sim-core/src/stintModel/tireModel.ts
10. packages/sim-core/src/stintModel/electricalModel.ts
11. packages/domain/src/scenario/schema.ts

## Checks to run

Run each of these shell commands:
1. npm test 2>&1 | tail -10
2. npm run typecheck 2>&1 | tail -5
3. grep -rn 'as any' packages/ apps/ --include='*.ts' --include='*.tsx' | wc -l
4. grep -rn '@ts-ignore\|@ts-expect-error\|eslint-disable' packages/ apps/ --include='*.ts' --include='*.tsx' | wc -l
5. git log --oneline -50
6. wc -l packages/sim-core/src/__tests__/*.test.ts

## Report to write

After reading all files and running all checks, write a report to .planning/audits/conformance-audit-2026-04-07.md using a heredoc. The report must cover:

1. **Test Health**: Pass/fail counts, test file sizes, whether tests verify success criteria or just check existence
2. **Type Safety**: Number of `as any` casts, suppressions, whether noUncheckedIndexedAccess is enforced
3. **Git Hygiene**: Commit convention adherence, whether planning and code commits are separated
4. **Phase 1 Conformance**: Were foundation decisions from 01-CONTEXT.md honored?
5. **Phase 2 Conformance**: Were lap model decisions from 02-CONTEXT.md honored?
6. **Phase 3 Conformance**: Were all 7 success criteria verified? What did VERIFICATION.md find?
7. **Requirements Traceability**: For PLAT-01, PLAT-02, PLAT-03, MODL-01, MODL-02, MODL-03, MODL-04, ENVR-01, ENVR-02, ELEC-01, ELEC-02 — is each actually implemented?
8. **Findings Table**: | Finding | Severity (Critical/Major/Minor/Info) | Evidence | Recommendation |
9. **Overall Assessment**: Pass/Fail with conditions

Be honest and evidence-based. Cite file paths and line numbers.
