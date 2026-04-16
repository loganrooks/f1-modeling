# Validation Report A: Coverage And Neglect

**Status:** Completed on 2026-04-16.
**Source spec:** `spec-validation-A-coverage-and-neglect.md`

## Coverage Inventory

| Evidence class | Status | Evidence units | What was actually reviewed | Coverage consequence |
| --- | --- | --- | --- | --- |
| Hardened lane manifests | `reviewed` | 9 files | `coverage-report.json`, `query-manifest.json`, and `neglect-report.json` for `claude-chat`, `codex-chat`, and `cross-model-and-agent-usage` | This is the strongest basis for counting what the transcript pipeline selected, emitted, and still flags as a miss risk. |
| Hardened transcript extracts | `reviewed` | 3 files, 34 emitted moments, 32 selected windows, 15 unique source paths | `extracts/claude-chat-extract.md`, `extracts/codex-chat-extract.md`, `extracts/cross-model-and-agent-usage-extract.md` | These are auditable selected samples, not a reread of the full session corpus. |
| Transcript neglect summary | `reviewed` | 1 file | `NEGLECT-REVIEW.md` | Useful as a compact rollup, but it inherits the limits of the per-lane reports and is not a recall guarantee. |
| Current debrief prose making transcript-scope claims | `reviewed` | 6 files | `INTERACTION-REVIEW.md`, `DEBRIEF-SUMMARY.md`, `TIMELINE.md`, `EVIDENCE-INDEX.md`, `FINDINGS.md`, `EPISTEMIC-AND-CONTRACT-REVIEW.md` | Enough to validate wording posture, not enough to re-prove every upstream substantive judgment. |
| Legacy LLM sweep lane reports cited by refreshed prose | `unreviewed` | 6 cited report references in current prose | Referenced in `INTERACTION-REVIEW.md:12-15`, `:22-27`, but not reopened in this validation pass | Claims that lean on those reports are directionally supported, but they were not independently revalidated here. |
| Project-scoped raw transcript stores | `unreviewed` | 15 source files; normalized corpus shows 14,266 total turns | The query manifests name 5 Claude sources, 9 Codex sources, and 1 initiative log source; no raw reread was performed | This is the main reason transcript-derived conclusions must stay qualified rather than corpus-exhaustive. |
| Global history stores | `unreviewed` | 3 evidence classes | `~/.claude/history.jsonl`, `~/.codex/history.jsonl`, and broader session trees named in `EVIDENCE-INDEX.md:49-65` were not opened | Any claim that depends on global-session completeness remains unsupported by this pass. |
| Wrapper and launch-semantics evidence | `sampled` | 1 lane with explicit inclusion | The cross-model lane downranks notifications and includes subagent launch prompts; the Claude and Codex chat lanes suppress them | Delegation-scope evidence exists, but it is intentionally underrepresented in the two chat lanes. |
| Heavy deterministic intermediates | `not available` | 3 evidence classes | `normalized/*`, candidate-hit dumps, and excerpt-window dumps are no longer retained as canonical outputs | Deep replay of selection decisions would require rerunning the pipeline locally rather than reading the committed record. |
| Canonical adversarial closeout output | `not available` | 1 top-level debrief output | `NEGLECT-AND-COUNTEREVIDENCE.md` does not exist yet | The H-lane challenge has not yet been promoted into canonical debrief prose. |

## Overclaimed Coverage

- `INTERACTION-REVIEW.md:8` currently compresses sampled interaction evidence into a corpus-level contrast: "the weakest moments were process-boundary failures, not deep disagreement about the architecture." The reviewed evidence supports that as the clearest pattern in the retained sample, but not as a full-universe exclusion claim.  
  Recommendation: `soften` to "In the reviewed interaction evidence, the clearest failures were process-boundary failures rather than architectural disagreement."
- `INTERACTION-REVIEW.md:12-15` uses stronger record-wide phrasing than this validation pass can support: "The record repeatedly shows", "came primarily", and "only became reliable after it was written down." Those claims are plausible and often well supported, but they lean partly on unreviewed sweep reports and a sampled transcript substrate.  
  Recommendation: `soften` to reviewed-evidence language, for example "The reviewed evidence repeatedly shows" or "The retained evidence suggests."
- `TIMELINE.md:8` says "The recommended core pack covered most of the sequence." This is stronger than the current validation can verify, because the omitted transcript universe and unreviewed global histories were not tested against that sentence.  
  Recommendation: `soften` to "The recommended core pack was sufficient to reconstruct the main sequence for this timeline draft."

## Unreviewed Or Under-Reviewed Evidence Classes

| Evidence class | Status | Why it matters | Current risk |
| --- | --- | --- | --- |
| Full Claude and Codex session JSONL stores | `unreviewed` | These are the underlying universe from which the deterministic pipeline selected 34 emitted moments | Magnitude claims about trust erosion, steering burden, or absence of architectural disagreement remain under-measured. |
| Global history files and non-project session spillover | `unreviewed` | `EVIDENCE-INDEX.md:49-65` still names them as relevant evidence classes | The current debrief cannot claim cross-session completeness beyond the project-scoped slices in the query manifests. |
| Suppressed notification wrappers in chat lanes | `sampled` | Launch and ownership semantics are only directly surfaced in the cross-model lane | Delegation claims are strong enough for workflow lessons, but not for exhaustive accounting of orchestration behavior. |
| Legacy sweep reports still cited by `INTERACTION-REVIEW.md` | `unreviewed` | Several refreshed interaction claims rely on those narrative reports as secondary support | The report is still partially second-hand until Spec H or Validation B revisits those citations. |
| Heavy transcript intermediates | `not available` | They would allow a deeper replay of candidate-to-window selection and missed-coverage analysis | The retained record supports audit-grade accounting of selected outputs, not a full replay of all suppressed or unselected transcript material. |
| Canonical Spec G and H top-level outputs | `not available` | `MODEL-ROLE-AND-DIVISION-OF-LABOR.md` and `NEGLECT-AND-COUNTEREVIDENCE.md` do not yet exist as canonical debrief outputs | The current debrief has not yet promoted model-role comparison or adversarial counterevidence into the top-level canon. |

## Claim Dispositions

| Claim | Evidence posture | Disposition | Reason |
| --- | --- | --- | --- |
| The hardened transcript outputs are useful but non-exhaustive. | `reviewed` | `verified` | `INTERACTION-REVIEW.md:16`, `:31-34`, `DEBRIEF-SUMMARY.md:22`, and `NEGLECT-REVIEW.md` all align with the manifests: the extracts are useful, selected, and explicitly non-exhaustive. |
| The interaction layer is safe to use for synthesis if it stays qualified. | `reviewed` | `verified` | The manifests show no missing selected families/providers/stages, no trimmed windows, and explicit neglect findings; that is enough to support bounded synthesis use. |
| The initiative's interaction quality was uneven but net-positive. | `sampled` | `soften` | Directionally supported, but still a summary judgment over a sampled transcript substrate plus unreviewed sweep reports. Qualify it as the conclusion of the reviewed evidence, not the whole session universe. |
| Trust erosion came primarily from process-boundary failures rather than architectural disagreement. | `sampled` | `soften` | Process-boundary failures are the strongest reviewed pattern, but the "rather than" clause overstates what sampled evidence can exclude. |
| The role split only became reliable after it was written down. | `sampled` | `soften` | The handoff record strongly supports improved clarity after explicit role writing, but "only became reliable" is stronger than this pass can prove from the retained interaction sample. |
| The recommended core pack covered most of the sequence. | `sampled` | `soften` | The timeline is well supported, but this pass did not test omitted transcript evidence against that sentence. |
| No strong blind-spot claim should be made from the current transcript tooling alone. | `reviewed` | `verified` | This is exactly what the hardened artifacts now say. |

## Reopen Recommendations

1. `reopen` any later claim that tries to quantify total user steering burden or the magnitude of trust erosion from the current transcript pack alone. The reviewed evidence is selected and directionally strong, but the raw session corpus remains unreviewed and the cross-model lane is family-concentrated.
2. `reopen` any later claim that tries to treat process-boundary failures as the exhaustive dominant interaction problem across the full corpus. The current debrief can support "clearest reviewed failure mode," not a full exclusion of under-sampled architectural tension.
3. `reopen` any attempt to treat model-role and adversarial coverage as canonically closed before `MODEL-ROLE-AND-DIVISION-OF-LABOR.md` and `NEGLECT-AND-COUNTEREVIDENCE.md` exist and are checked against the hardened artifacts.

## Confidence And Limits

Confidence is high on the evidence-accounting question and medium on the remaining miss question.

- High confidence: the current retained transcript substrate is accurately described as selected, auditable, and non-exhaustive. That judgment is directly supported by the 9 lane artifact files, the 3 extract files, and `NEGLECT-REVIEW.md`.
- Medium confidence: the current debrief summary judgments about interaction quality, trust erosion, and role stability are directionally right, but some of their wording still outruns the reviewed universe.
- Main limits: this pass did not reopen raw session stores, global history files, heavy transcript intermediates, or the legacy sweep reports cited by refreshed prose.
- Net result: no transcript-driven conclusion needs to be discarded, but several interaction-summary sentences should be softened before final debrief closeout.
