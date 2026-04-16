# Agent Orchestration Runbook

This runbook codifies the orchestration lessons exposed by `../../runs/2026-04-16-llm-sweep/`, especially the need for bounded ownership, observable execution, and explicit gate handling.

Use it when a debrief run needs multiple bounded workers or repeated model passes that write into `debrief/runs/<run-id>/`.

## Goal

Produce lane-owned reports without hidden state, ambiguous ownership, or uncontrolled evidence expansion.

## Default Role Split

- Run orchestrator: authors the run manifest and lane specs, launches workers, answers scope questions, validates outputs, and owns later synthesis into top-level debrief files.
- Lane worker: reads one spec, one evidence pack, and writes exactly one report file.
- User: authorizes run start, resolves cross-lane boundary changes, and closes any review or acceptance gate.
- Secondary model or auditor: optional; use for named review or adversarial passes only, not as ambient parallel chatter.

## Preflight

Before launching any worker:

1. Create the run root with `README.md`, `RUN-MANIFEST.md`, `specs/`, and `reports/`.
2. Fill in the run manifest and every lane spec.
3. Verify that every source path resolves from the file that declares it.
4. Verify one report path and one owner per lane.
5. Record model/reasoning choices and estimated token budgets per lane.
6. State whether raw transcript/session stores are allowed. Default is no.
7. State who owns review-gate closure and final synthesis.

If any of those items is unclear, do not launch the lane yet.

## Recommended Launch Pattern

1. Launch bounded workers, not free-roaming agents.
Each worker should receive:

- the run id
- the lane spec path
- the allowed write path
- the run-level rules from `RUN-MANIFEST.md`
- any curated evidence-pack notes the manifest depends on

2. Keep write scopes disjoint.
A worker should never share an output file with another worker and should not edit top-level debrief files.

3. Prefer observable agent execution.
Use worker patterns that can be monitored, waited on, and interrupted cleanly.

4. Treat the lane spec as the contract.
If a worker discovers missing evidence, it should note the gap or request a spec change rather than silently broadening scope.

5. Validate before synthesis.
Check each report against its spec before any top-level debrief file consumes it.

## Required Worker Instructions

Every worker launch should make these four things explicit up front:

- user authorization for this lane launch
- owned output file
- review-gate owner
- commit or closeout responsibility

This prevents the uncommitted-output and hidden-ownership ambiguity seen in the LLM sweep evidence.

## Prohibited Patterns

- detached `nohup ... codex exec ...` launches or any other background pattern that obscures live state or completion status
- interpreting `proceed` or similar generic language as blanket authorization for multi-lane fanout
- multiple workers writing the same report file
- workers rewriting top-level debrief synthesis files directly
- silently expanding from curated evidence packs into raw session stores
- treating an advisory review pass as equivalent to a required audit or named gate

## Failure Handling

- `Spec path or source path is wrong:` fix the manifest/spec first, then relaunch. Do not compensate inside the report.
- `Lane exceeds budget:` split the lane, narrow the evidence pack, or explicitly raise the budget in the manifest/spec.
- `Worker stalls or ownership becomes ambiguous:` stop new launches, inspect the owned output path, and relaunch with explicit ownership.
- `Needed evidence sits outside the approved substrate:` amend the manifest/spec and note the new evidence class before re-running.

## Closeout Checklist

- Every report cites exact files for substantive claims.
- Every report matches the lane spec's required sections.
- Every report includes `Bottom Line`, `What The Current Pipeline Already Captured`, `What It Likely Missed`, `Deterministic Implications`, and `Confidence And Limits`.
- No worker edited files outside its declared run scope.
- Downstream debrief synthesis happens only after report review.

## When To Escalate

Escalate from a simple run to a more formal or audit-heavy protocol when:

- lanes disagree materially on a core claim
- a lane needs raw session stores or much larger token budgets
- the run is being used to justify live planning or governance changes
- the user asks for formal adversarial or audit treatment
