---
id: sig-2026-04-08-log-sensor-skipped-wrong-session-log-paths
type: signal
project: f1-modeling
tags: [log-sensor, session-logs, path-resolution, collect-signals, orchestrator]
created: "2026-04-09T03:15:00Z"
updated: "2026-04-09T03:15:00Z"
durability: workaround
status: active
severity: notable
signal_type: struggle
phase: "03.1"
plan: null
polarity: negative
source: manual
occurrence_count: 1
related_signals: []
runtime: claude-code
model: claude-opus-4-6
gsd_version: "1.19.1+dev"
origin: local
---

## What Happened

During Phase 03.1 signal collection, the log sensor was skipped because the orchestrator searched incorrect paths for Claude Code session log JSONL files. The paths tried were `/tmp/claude-*/*.jsonl` and `~/.claude/logs/*.jsonl`, both returning no results. The actual session logs (8 files, totaling ~10MB) were at `~/.claude/projects/-home-rookslog-workspace-projects-f1-modeling/*.jsonl`.

## Context

The collect-signals workflow discovers sensors via file-backed agent specs (`gsdr-*-sensor.md`), but has no session log path-finding logic. The orchestrator was left to guess paths rather than having a deterministic discovery mechanism. The log sensor agent spec itself does not declare where to find session logs — it expects them to be provided or discoverable.

The user caught the error after seeing "No session logs found" in the sensor skip reasoning.

## Potential Cause

1. The collect-signals workflow delegates path resolution to the orchestrator but provides no hints about Claude Code's session log directory structure (`~/.claude/projects/{encoded-project-path}/{uuid}.jsonl`).
2. The log sensor agent spec lacks a `log_path` config field or discovery script that could resolve the correct path per-runtime.
3. The orchestrator (Claude) guessed plausible-but-wrong paths instead of searching `~/.claude/` recursively for JSONL files.
