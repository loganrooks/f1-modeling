# Validation Report: B - Synthesis Flattening Checks

**Status:** Completed on 2026-04-16.
**Source spec:** `spec-validation-B-synthesis-flattening-checks.md`

Most of the previously risky summary compression has already been corrected in the current debrief corpus. `INTERACTION-REVIEW.md:8,12-16`, `TIMELINE.md:8`, and `PATTERNS-TO-KEEP.md:25` now preserve the reviewed-sample, file-scoped, and carry-forward qualifiers that Validations A and D required. The remaining material flattening is concentrated in `DEBRIEF-SUMMARY.md:8`.

## Flattened Claims

| Later claim | Upstream evidence or limit | Compression status | Disposition | Assessment |
| --- | --- | --- | --- | --- |
| `DEBRIEF-SUMMARY.md:8` says the initiative "inserted the missing foundation work before Phase 4." | `TIMELINE.md:53-54` and Validation D (`report-validation-D-live-file-application-verification.md:39-43,47-54`) verify roadmap reshaping, tech-debt creation, `CLAUDE.md` guardrails, and state routing. They do not verify that the underlying 3.2/3.3/3.4 foundation work itself was completed. | `flattening problem` | `soften` | This line collapses sequencing/application work into delivered implementation. The accurate claim is that the initiative inserted the missing foundation **phases** before Phase 4 and made that work unavoidable in the live roadmap. |
| `DEBRIEF-SUMMARY.md:8` says the initiative "succeeded because" strong research/deliberation were paired with explicit recovery mechanisms. | `FINDINGS.md:42-68,85-132` and `TIMELINE.md:37-54` show real recoveries and later forcing mechanisms, but Lane H (`debrief/runs/2026-04-16-llm-sweep/reports/H-neglect-and-counterevidence.md`) explicitly warns that "method caused the success" is stronger than the current record proves. | `flattening problem` | `soften` | The record supports "the initiative produced durable outcomes despite several slips, with explicit recoveries helping contain them." It does not support a dominant-cause claim that method/recovery pairings are the demonstrated reason success occurred. |
| `INTERACTION-REVIEW.md:8,12-16` now says "reviewed interaction evidence," "retained sample," and "suggests." | Validation A (`report-validation-A-coverage-and-neglect.md:21-29,45-50`) required exactly these softenings. The current file keeps the reviewed-evidence posture visible at the point of claim. | `acceptable compression` | `verified` | This is now the strongest accurate phrasing that survives the sampled transcript substrate. No further softening is needed unless later prose removes the reviewed-sample qualifiers again. |
| `TIMELINE.md:8` now says the core pack was "sufficient to reconstruct the main sequence for this timeline draft." | Validation A (`report-validation-A-coverage-and-neglect.md:27-28,50`) already narrowed the older "covered most of the sequence" wording. | `acceptable compression` | `verified` | The current phrasing keeps the draft-scope condition that was previously missing. |
| `PATTERNS-TO-KEEP.md:25` now scopes live application to `CLAUDE.md` and treats broader template propagation as carry-forward. | Validation D (`report-validation-D-live-file-application-verification.md:31-33,43,47-50`) and Validation C (`report-validation-C-skipped-branches-and-non-events.md:37-45,73-75,93-94`) both required this distinction. | `acceptable compression` | `verified` | The current wording no longer upgrades proposed planning-template propagation into same-day application fact. |
| `DEBRIEF-SUMMARY.md:15` says cross-model work added real value "when it was explicit and document-governed." | `MODEL-ROLE-AND-DIVISION-OF-LABOR.md:8,74-90` supports this exact conditional shape and keeps the named preconditions visible. | `acceptable compression` | `verified` | This line compresses the actor-by-actor analysis, but it does not drop the condition that made the pattern valid. |

## Dropped Distinctions

| Distinction | Where it is lost | Why it matters | Disposition |
| --- | --- | --- | --- |
| `roadmap insertion / routing change` vs `foundation work completed` | `DEBRIEF-SUMMARY.md:8` | The initiative changed the live plan and governance state. It did not land the actual 3.2/3.3/3.4 implementation work. Losing that distinction upgrades sequencing into delivery. | `soften` |
| `durable outcome achieved with recoveries` vs `method/recovery pair was the demonstrated dominant cause` | `DEBRIEF-SUMMARY.md:8` | The record contains failed launch mechanics, authorization overrun, a post-hoc D4 audit repair, and later file-application forcing steps. The cleanest supported claim is about contained recovery, not comparative causal proof. | `soften` |
| `heterogeneous convergence with uneven blocker structure` vs `one neat universal convergence story` | Most visible risk remains `SUMMARY.md:5-19` when read without `review-wave-2-structure-decisions.md:385-388,407-426,465-503` | The structure review explicitly says R5 is not the same kind of boundary object as R1/R2/R3/R4, and performance budgets are cross-cutting for compute/streaming/visualization closure, not equally for R3/R5. Current debrief prose mostly avoids reasserting the overstated form, but this distinction is easier to lose in executive-summary reuse. | `reopen` |

## Outcome Vs Causal Claim Drift

- `DEBRIEF-SUMMARY.md:8` is the only current line that materially drifts from supported outcome language into stronger causal language. It should say the initiative produced durable planning/governance outcomes despite several slips, with explicit recoveries and later forcing mechanisms helping contain them.
- `PATTERNS-TO-KEEP.md:22` uses causal language ("That made Stage 3 synthesis and live-file application possible"), but here the inference is acceptable compression rather than drift. `TIMELINE.md:38-54` shows the accepted-decision chain stayed intact without reopening D1/D2/D3/D5, so the causal shorthand is reasonable and initiative-scoped.
- `DEBRIEF-SUMMARY.md:15` is also acceptable compression rather than causal drift because it keeps the condition that mattered: cross-model work added value when role contracts and protocol discipline were explicit.

## Recommended Wording Corrections

- For `DEBRIEF-SUMMARY.md:8`, replace "inserted the missing foundation work before Phase 4" with: "made the missing foundation work explicit as Phases `3.2`, `3.3`, and `3.4` before Phase `4`."
- For `DEBRIEF-SUMMARY.md:8`, replace "it succeeded because" with: "it still produced durable planning and governance changes through strong research and deliberation plus several explicit recoveries and later forcing mechanisms when the process slipped."
- If a shorter closeout sentence is preferred, the strongest compact version is: "The initiative was not smooth, but it corrected the live roadmap/governance state and did so through several explicit recoveries rather than by pretending the slips never happened."

## Residual Uncertainty

- The transcript layer still requires reviewed-evidence language. Validation A remains the governing limit for any later claim about interaction quality, trust drag, or blind spots.
- The D2/D3 branch outcome still requires "resolved enough to proceed" wording, not "fully closed inside the initiative." Validation C remains the governing limit there.
- Live application claims remain diff-proven only for `.planning/ROADMAP.md`, `.planning/TECH-DEBT.md`, `CLAUDE.md`, and `.planning/STATE.md`. Validation D remains the governing limit for any broader planning-template or operating-doctrine claim.
- `SUMMARY.md` is still a Stage 3 synthesis snapshot, not a substitute for the full nuance in `review-wave-2-structure-decisions.md`. Reopen any future executive summary that leans on `SUMMARY.md` alone to assert homogeneous convergence or a universal performance-budget blocker.
