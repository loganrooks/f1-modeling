---
id: sig-2026-04-09-workflow-files-exceed-read-tool-token-limit
type: signal
project: f1-modeling
tags: [token-limit, workflow-file, chunked-reads, repeated-reads, discuss-phase, plan-phase]
created: 2026-04-09T03:01:50Z
updated: 2026-04-09T03:01:50Z
durability: convention
status: active
severity: notable
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
    - "discuss-phase.md is 12642 tokens, exceeding the 10000-token Read tool limit and requiring 6 chunked offset reads per invocation"
    - "plan-phase.md required 4 chunked reads per invocation"
    - "gsd-tools init produced a 20040-token JSON blob; Read failed twice before a jq workaround was applied"
    - "Pattern observed across multiple sessions -- every workflow invocation incurs 6-8 extra reads just for file loading"
  counter:
    - "Chunked reads are a supported pattern -- the Read tool's offset/limit parameters exist precisely for this use case"
    - "The overhead is predictable and bounded; workflows complete despite the extra reads"
confidence: high
confidence_basis: "Direct log evidence showing repeated offset reads across multiple sessions with specific token counts."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-sonnet-4-6
gsd_version: "1.19.1+dev"
---

# GSD workflow files exceed the 10000-token Read tool limit, requiring 6-8 chunked reads per file on every invocation

## What Happened

Core GSD workflow files (discuss-phase.md at 12642 tokens, plan-phase.md) exceed the Read tool's effective 10000-token limit, requiring multiple chunked reads with offset parameters on every workflow invocation. The gsd-tools init command produces a 20040-token JSON output that caused two Read failures before a jq workaround was applied. This overhead is incurred on every session that uses these workflows, adding 6-8 tool calls of pure loading friction before any substantive work begins.

## Context

- Phase: 03.1 (Race State, Typed Artifacts, and Branchable Runs) -- observed across multiple sessions
- discuss-phase.md: 12642 tokens, requires 6 chunked reads
- plan-phase.md: requires 4 chunked reads
- gsd-tools init JSON: 20040 tokens, required jq extraction workaround
- The friction compounds across every session that loads these workflows

## Potential Cause

The GSD workflow files have grown organically across phases without token budget awareness. Each phase adds examples, edge cases, and cross-references to workflow files, pushing them past the Read tool's practical limit. The files were likely within limit when first authored and crossed the threshold incrementally. The gsd-tools init JSON includes full content of multiple planning files concatenated, which compounds the size issue. Splitting workflow files into a concise dispatch document plus referenced detail sections would eliminate the chunking overhead.
