# Run Specs

This directory is the canonical runbook/meta-spec layer for debrief runs.

It turns the shape first exercised in `../../runs/2026-04-16-llm-sweep/` into reusable doctrine for later bounded LLM or agent sweeps.

Run-specific artifacts still live under `../../runs/<run-id>/`.

## Files

- `run-manifest-template.md` - canonical shape for `runs/<run-id>/RUN-MANIFEST.md`
- `lane-report-template.md` - canonical invariant scaffold for worker-owned report outputs
- `agent-orchestration-runbook.md` - operating procedure for instantiating, launching, and validating a run

## Canonical Run Shape

- `runs/<run-id>/README.md`
- `runs/<run-id>/RUN-MANIFEST.md`
- `runs/<run-id>/specs/`
- `runs/<run-id>/reports/`

## Authority Boundary

This layer defines:

- the stable run contract
- the minimum schema for run manifests and lane specs
- the worker/report invariants
- the orchestration rules for multi-lane execution

This layer does not define:

- run-specific lane questions
- run-specific evidence packs
- final debrief synthesis judgments
- raw transcript or session-reading policy beyond the run-level defaults

## Stable Run Contract

- Keep every lane evidence-first and compact.
- Cite exact file paths for every substantive claim.
- Give each lane exactly one owned output file under `reports/`.
- Treat lane specs as the authority for lane-specific questions and required middle sections.
- Keep workers out of top-level debrief outputs; synthesis happens after lane review.
- Require every lane report to distinguish what the deterministic pipeline already captured from what it likely missed.
- End every lane report with deterministic implications and confidence/limits.
- Use existing initiative/debrief artifacts as the default retrieval substrate. Expand to raw session stores only when the manifest or lane spec explicitly allows it.
- Verify that every relative source path resolves from the file that declares it before launch.

## Minimum Lane-Spec Schema

Every run-specific lane spec under `runs/<run-id>/specs/` should include:

- `Objective`
- `Core Sources`
- `Budget`
- `Questions`
- `Output`
- `Required Sections`

If a lane needs non-default permissions, broader evidence classes, or a mixed-model review path, state that explicitly in the spec instead of implying it.

## Preferred Naming

- Prefer run ids in the form `YYYY-MM-DD-<slug>`.
- Prefer single-letter lane ids (`A`, `B`, `C`) when the run is a bounded parallel sweep.
- Name spec files `spec-lane-<ID>-<slug>.md`.
- Name report files `<ID>-<slug>.md`.

## Instantiation Flow

1. Create `runs/<run-id>/` with `README.md`, `RUN-MANIFEST.md`, `specs/`, and `reports/`.
2. Copy `run-manifest-template.md` into the new run root and fill in the run-level rules, budgets, and downstream targets.
3. Write one lane spec per report owner using the minimum schema above.
4. Launch and monitor workers using `agent-orchestration-runbook.md`.
5. Synthesize reviewed reports into the top-level debrief files after lane closeout.
