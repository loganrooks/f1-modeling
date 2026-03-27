---
created: 2026-03-27T06:48:09.869Z
title: Add context-appropriate comparison modes for same-track and cross-track analysis
area: ui
priority: MEDIUM
source: conversation
status: pending
files:
  - packages/visuals/src/inspectors/SensitivityWaterfall.tsx
  - apps/web/src/features/runs/RunSummaryPanel.tsx
  - apps/web/src/app/useWorkspace.ts
---

## Problem

Run comparison currently uses the same visualization regardless of whether runs are on the same circuit or different circuits. Overlaying speed-vs-distance profiles across different track lengths is misleading. Cross-track comparison is a valid engineering workflow (e.g., performance engineer benchmarking a car setup across circuits) but needs different visualization than same-track parameter sensitivity.

## Solution

Design two comparison modes with context-appropriate visualizations:
- **Same-track sensitivity:** Overlaid speed profiles, per-sector waterfall delta, mechanism attribution (current approach works here)
- **Cross-track benchmarking:** Normalized views — sector time deltas, limiting factor distribution, aero efficiency comparison, aggregate performance metrics rather than raw speed profile overlay

Auto-detect mode from circuit IDs of compared runs. Consider whether users should be able to force a mode. Think from the perspective of different F1 engineering roles — what would a performance engineer, strategy engineer, or vehicle dynamics engineer want to compare across circuits?
