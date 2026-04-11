# Stage 3B Tech-Debt Registry

## Registry Notes

- Date: 2026-04-11
- Scope: accepted carry-forward debt and rewrite triggers from D4.D, the 2026-04-10 audit-response registry, the 2026-04-11 D2 underspec signal, and Stage 3B synthesis reconciliation
- Status: proposal artifact for later maintenance
- Severity scale: `medium`, `high`, `critical`
- Targeting rule: `phase_target` is used when the trigger is expected inside v1 sequencing; `milestone_target` is used when the debt is expected to stay open until a later milestone theme

## Entries

| id | title | current_state | rewrite_trigger | severity | source | phase_target or milestone_target | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `VA-TD-01` | `runService.ts` orchestration split | `apps/local-api/src/services/runService.ts` still represents compilation, execution dispatch, and persistence in one service-shaped seam. D1 and the 2026-04-10 audit both treat this as transitional. | Rewrite when `SimulationBackend` job/artifact flow lands and the local worker path becomes the first backend implementation. | `high` | `audit-response-2026-04-10.md`; D4.D; D1 C1-C3 | `phase_target: 3.2` | Reconciles the audit-response god-service item with D4.D's "runService split" trigger. This is not a standalone cleanup ticket; it is debt that should be paid while landing the backend boundary. |
| `VA-TD-02` | Regulation preset typing and execution canonicalization gap | Regulation data still carries the accepted risk from `packages/domain/src/presets/schema.ts` loose value typing and raw-preset-driven runtime assumptions. D5 closed the semantic direction, but the code path has not been brought into that shape yet. | Rewrite before adding a second regulation family, and in v1 no later than the phase that compiles canonical regulation semantics into `ExecutionRegulationSnapshot`. | `high` | `audit-response-2026-04-10.md`; D1 C4; D5.A-D; D4.D | `phase_target: 3.2-3.4 corridor` | This reconciles the audit's "`values` as record" item with D4.D's regulation execution dependency cleanup. One entry is enough because both sources describe the same debt: loose semantics leaking into execution. |
| `VA-TD-03` | Synchronous `SimulationHarness` contract | `packages/sim-core/src/contracts.ts` still reflects a synchronous harness shape with no durable job/progress/artifact semantics. | Rewrite once async job submission, partial artifacts, cancellation, and replay-safe progress are implemented. | `high` | `audit-response-2026-04-10.md`; D1 C1-C3; D4.D | `phase_target: 3.2` | Kept separate from `VA-TD-01` because the prompt requires the execution-contract concern to stay explicit. The service split and the harness contract are coupled but not identical debts. |
| `VA-TD-04` | `App.tsx` / three-zone shell retirement | The current workspace shell is still organized around a hardcoded three-zone layout that cannot honestly host recipe-driven Phase 4 and 4.1 workflows. | Rewrite when D2 recipe-driven shell work begins or when a new panel family would otherwise require further hardcoded layout branching. | `medium` | `audit-response-2026-04-10.md`; D2.A; D4.D | `phase_target: 3.3` | This entry covers both `App.tsx` and the broader three-zone shell assumption. The rewrite is triggered by shell replacement, not by cosmetic UI cleanup. |
| `VA-TD-05` | Legacy bespoke SVG migration discipline | Existing hand-rolled SVG panels remain in the repo without shared primitive contracts, interaction semantics, or migration boundaries. | Freeze immediately for bug fixes only; rewrite or migrate when a panel needs linked interaction, shared tokens, or substrate-native features. | `medium` | `audit-response-2026-04-10.md`; D2 C4-C6; D4.D | `phase_target: 3.3 onward` | This is governance-sensitive debt: allowing new features here recreates the dual-renderer permanence risk the initiative rejected. |
| `VA-TD-06` | `packages/visuals` zero-test coverage | `packages/visuals` has accepted architecture weight but the audit-response registry recorded zero tests for the package. | Add tests as shared primitives, recipes, and renderer contracts land; treat new D2-era substrate work without tests as a trigger, not a later nice-to-have. | `medium` | `audit-response-2026-04-10.md`; post-hoc D4 audit response | `phase_target: 3.3 onward` | This explicit entry is mandatory Stage 3B carry-forward from the post-hoc D4 audit. It should not be buried under the broader renderer migration item. |
| `VA-TD-07` | Computational core TypeScript long-term limit | The current TypeScript compute core is acceptable for reduced-order v1 work but remains an accepted bridge architecture rather than a final numerical backend answer. | Revisit when observer, optimization, calibration, or batch workloads violate the accepted performance envelopes strongly enough that the bridge architecture stops being credible. | `high` | `audit-response-2026-04-10.md`; D4 outcome; D4.C-D | `milestone_target: v2 numerical deepening` | This is a milestone-level trigger, not a fixed v1 rewrite. The guardrail is empirical: latency, batch, or authoring-workflow thresholds, not language ideology. |
| `VA-TD-08` | Missing performance instrumentation and benchmark reporting path | The repo does not yet have a durable benchmark harness or reporting path for linked-view rendering, progress cadence, and thin-client responsiveness. | Rewrite when Phase 3.3 performance foundation starts, and treat any visualization or async execution work without benchmark evidence as an active process failure. | `high` | `audit-response-2026-04-10.md`; D2.D; D4.D | `phase_target: 3.3` | This registry entry carries the R1.5 enforcement obligation forward. It covers both measurement infrastructure and durable reporting, not only one-off benchmark runs. |
| `VA-TD-09` | `AccessibleChartContract` completion | D2 accepted a renderer substrate that references `AccessibleChartContract`, but the type was left implicit. That makes the WCAG AA commitment difficult to test. | Define before any C4 substrate implementation closes and before panel code relies on accessibility claims that are not contract-checked. | `high` | `sig-2026-04-11-d2-underspecified-interface-types.md`; D2 C4 and D2.C; post-hoc D4 audit response | `phase_target: 3.3 planning gate` | Mandatory explicit Stage 3B carry-forward. This is intentionally separate from general accessibility guidance because the signal identified a specific missing interface, not a vague principle. |
| `VA-TD-10` | `AnchorRegistry` completion | D2 and D3 both rely on an `AnchorRegistry` concept, but the register/resolve/update/remove/subscribe surface is not yet specified concretely. | Define before lesson bindings or renderer registration code lands against C6, or earlier if D3 planning would otherwise invent its own registry assumptions. | `high` | `sig-2026-04-11-d2-underspecified-interface-types.md`; D2 C6; D3 C6; D4.D | `phase_target: 3.3 planning gate` | This is both a visualization and educational debt item. It remains separate because D3 depends on it and the D2 signal named it directly. |
| `VA-TD-11` | Visible fidelity / validation / comparability marker surfacing | Accepted artifact and semantic contracts now include fidelity, validation, applicability, and relation-state semantics, but the repo does not yet have a durable UI pattern that makes them visible. | Rewrite when Phase 4 comparison or lesson surfaces are planned without explicit visible marker behavior, or when metadata is present but not surfaced in panel chrome or legends. | `high` | D2 C4-C6; D3.D; D5.C; D4.D | `phase_target: 3.3-4 corridor` | This is a distinct D4.D rewrite trigger and should stay explicit. It is governance debt because the initiative treated honesty labeling as a product-surface commitment, not optional decoration. |

## Reconciliation Summary

- D4.D rewrite triggers covered:
  - `runService.ts` split -> `VA-TD-01`
  - synchronous harness replacement -> `VA-TD-03`
  - `App.tsx` / three-zone shell retirement -> `VA-TD-04`
  - legacy SVG freeze + migration -> `VA-TD-05`
  - regulation execution dependency cleanup -> `VA-TD-02`
  - `AnchorRegistry` completion -> `VA-TD-10`
  - visible fidelity / validation / comparability markers -> `VA-TD-11`
  - benchmark reporting path -> `VA-TD-08`
- Audit-response initial registry covered:
  - all eight initial items are represented, with the regulation typing item merged into the broader canonicalization/execution entry `VA-TD-02`
- D2 underspec signal covered:
  - `AccessibleChartContract` -> `VA-TD-09`
  - `AnchorRegistry` -> `VA-TD-10`
- Explicit carry-forward items required by the post-hoc D4 audit:
  - `AccessibleChartContract` present as its own entry
  - `packages/visuals` zero tests present as its own entry
