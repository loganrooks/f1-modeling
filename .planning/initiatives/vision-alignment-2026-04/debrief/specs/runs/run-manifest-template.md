# Run Manifest

**Run ID:** `<YYYY-MM-DD-run-slug>`
**Purpose:** `<short purpose>`
**Primary model:** `<default model or mixed>`
**Reasoning effort:** `<low|medium|high|xhigh>`
**Run date:** `<YYYY-MM-DD>`

## Run Rules

- Use existing initiative and debrief artifacts as the primary retrieval substrate.
- Do not rewrite the top-level debrief files directly from worker lanes.
- Each lane owns exactly one file under `reports/`.
- Preferred pack size is `<preferred token range>` estimated tokens.
- Soft cap is `<soft cap>`; stretch cap is `<stretch cap>` only when the lane explains why.
- Workers should note evidence gaps rather than padding claims.
- Verify every source/output path in the lane specs before launch.
- If any lane may expand into raw transcript/session stores, say so explicitly in its spec.

## Lane Map

| Lane | Focus | Core evidence pack | Estimated input | Spec | Output |
| --- | --- | --- | ---: | --- | --- |
| `A` | `<focus>` | `<path1>`, `<path2>`, `<path3>` | `<60K-80K>` | `specs/spec-lane-A-<slug>.md` | `reports/A-<slug>.md` |
| `B` | `<focus>` | `<path1>`, `<path2>`, `<path3>` | `<65K-85K>` | `specs/spec-lane-B-<slug>.md` | `reports/B-<slug>.md` |
| `C` | `<focus>` | `<path1>`, `<path2>`, `<path3>` | `<70K-90K>` | `specs/spec-lane-C-<slug>.md` | `reports/C-<slug>.md` |

Add or remove rows to match the real lane count. Prefer one owner and one report per lane.

## Expected Downstream Use

These reports feed:

- `<../../INTERACTION-REVIEW.md>`
- `<../../FINDINGS.md>`
- `<../../DEBRIEF-SUMMARY.md>`

Replace this list with the actual downstream artifacts for the run.

## Notes

- If the run mixes models, state the default in the header and any per-lane overrides in the lane specs or lane map.
- If the run is adversarial or audit-like, make the non-default burden of proof explicit in the relevant lane spec.
- If the run depends on curated extracts or generated evidence packs, cite those artifacts directly instead of vague directory references.
