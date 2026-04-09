---
id: sig-2026-04-08-config-runtime-platform-mismatch-codex-vs-claude
type: signal
project: f1-modeling
tags: [config-mismatch, runtime-mismatch, model-profile, codex, claude-code]
created: 2026-04-08T00:00:00Z
updated: 2026-04-08T00:00:00Z
durability: convention
status: active
severity: notable
signal_type: config-mismatch
signal_category: negative
polarity: negative
phase: "03.1"
plan: null
source: auto
occurrence_count: 1
related_signals: []
lifecycle_state: detected
lifecycle_log:
  - "created -> detected by gsdr-signal-synthesizer at 2026-04-08T00:00:00Z"
evidence:
  supporting:
    - "config.json sets runtime.platform: codex and default_model: gpt-5.4 with agent_overrides for codex-native models"
    - "config.json has model_overrides.gsdr-executor: sonnet suggesting a sonnet-class executor was intended"
    - "All four SUMMARY.md files record model: claude-opus-4-6, indicating claude-code runtime was used instead"
    - "The config also contains model_profile: quality, which maps to opus-class in the claude-code context"
  counter:
    - "Execution quality was high: 6/6 verification criteria met, 400 tests passing, zero gaps"
    - "The quality profile intent note in config explicitly documents mapping Claude-era quality to Codex-native GPT-5.4 settings"
    - "claude-opus-4-6 satisfies the quality profile expectation for opus-class models"
confidence: high
confidence_basis: "Direct comparison of config.json runtime.platform/default_model fields against SUMMARY.md model fields across all four plans."
triage: {}
remediation: {}
verification: {}
recurrence_of: ""
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.1+dev"
---

# config.json declares codex/gpt-5.4 runtime but execution ran on claude-code with claude-opus-4-6

## What Happened

The project's `.planning/config.json` declares `runtime.platform: codex` and `default_model: gpt-5.4` with per-agent overrides keyed to Codex-native models. Despite this, all four Phase 3.1 plans executed under the claude-code runtime with `claude-opus-4-6`, as recorded in each SUMMARY.md. The config also contains a `model_overrides.gsdr-executor: sonnet` entry, suggesting a lower-cost executor was intended for the codex path, yet opus-class execution occurred throughout.

## Context

- Phase: 03.1 (Race State, Typed Artifacts, and Branchable Runs)
- Source file: `.planning/config.json`
- All four plan summaries (plans 01-04) record model: claude-opus-4-6
- The config's `quality_profile_intent` field documents the mapping as intentional for Codex, but the runtime diverged

## Potential Cause

The project was configured for Codex CLI usage but the phase was executed in claude-code instead. The config is stale relative to the actual runtime in use. This is a persistent config drift issue -- the config declares codex intent but execution consistently lands on claude-code. Execution quality was unaffected since claude-opus-4-6 meets the quality profile expectation for opus-class work.
