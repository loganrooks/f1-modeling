---
id: sig-2026-04-09-codex-audit-14-retry-90-minute-struggle
type: signal
project: f1-modeling
tags: [codex-cli, audit-workflow, retry-loop, external-tool, authentication, output-truncation]
created: 2026-04-09T03:01:50Z
updated: 2026-04-09T03:01:50Z
durability: convention
status: active
severity: critical
signal_type: struggle
signal_category: negative
polarity: negative
phase: "03.1"
plan: null
source: auto
detection_method: sensor-log
origin: gsdr-log-sensor
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by gsdr-signal-synthesizer at 2026-04-09T03:01:50Z"
evidence:
  supporting:
    - "8x conformance audit attempts and 6x strategic gap audit attempts across 90 minutes (session 7ba47151-6b99-4f49-8941-90a0cd936676.jsonl)"
    - "codex login status returned: Not logged in (exit code 1) -- auth was never initialized"
    - "exit code 2 on -a flag indicating invalid flag usage for exec mode; flag discovery required via --help"
    - "audit output files were 0 lines after 3 runs post-auth, indicating output truncation from open-ended prompts"
    - "User expressed frustration twice and escalated effort to max (~56 minutes in)"
    - "Root causes fully identified: unauthenticated credentials, invalid -a flag, open-ended prompts exhausting reasoning budget, -o flag capturing only last message not file writes"
  counter:
    - "The audit eventually succeeded -- all four root causes were identified and the final runs produced valid audit output"
    - "Root causes are all fixable via documented workflow changes (authenticate first, use correct flags, constrain prompts, use --save-to for file output)"
    - "The cross-model audit itself, once completed, provided independent verification value"
confidence: high
confidence_basis: "Direct log evidence: 14 codex exec calls across 90 minutes, 3 distinct error types, 2 user frustration expressions verbatim in session log."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-sonnet-4-6
gsd_version: "1.19.1+dev"
---

# Codex CLI audit required 14+ retries over 90 minutes due to cascading auth, flag, and output-capture failures

## What Happened

The Phase 3.1 cross-model Codex audit, a required quality gate per CLAUDE.md, required 14 separate `codex exec` invocations across 90 minutes before producing valid output. The struggle cascaded through four distinct root causes: (1) Codex CLI was not authenticated, causing silent failures; (2) the `-a` flag was invalid for exec mode (exit code 2), requiring flag discovery via `--help`; (3) open-ended audit prompts caused gpt-5.4 at xhigh reasoning to exhaust its output budget planning rather than writing; (4) the `-o` flag captures only the last message, not file writes, so audit results were not persisted. The user expressed strong frustration and escalated effort to max approximately 56 minutes into the struggle.

## Context

- Phase: 03.1 (Race State, Typed Artifacts, and Branchable Runs)
- Session: 7ba47151-6b99-4f49-8941-90a0cd936676.jsonl
- The Codex cross-model audit is explicitly required by CLAUDE.md Quality Gates section
- 8 conformance audit attempts and 6 strategic gap audit attempts were made
- The codex-cli runtime had never been authenticated in this environment before the session

## Potential Cause

The Codex audit workflow in CLAUDE.md does not document prerequisites (authentication state, correct flag set, prompt structure constraints, file-write mechanism). The executing agent had no reference for `codex exec` invocation patterns and had to discover them experimentally under time pressure. The combination of an unauthenticated CLI, undocumented flag behavior, and a high-reasoning model that over-planned rather than wrote created a compounding failure cascade. The audit workflow needs a documented invocation recipe (authenticate, use `--save-to`, constrain prompt scope) to prevent recurrence.
