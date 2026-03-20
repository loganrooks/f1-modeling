import { type RunRecord, type ScenarioDocument, type SourceType } from "@f1-modeling/domain";
import {
  AssumptionPanel,
  TrackContextPlaceholder,
  WorkbenchShell,
  type AssumptionEntry,
  type WorkbenchShellZone,
} from "@f1-modeling/visuals";

import { RunHistoryPanel } from "../features/runs/RunHistoryPanel";
import { RunSummaryPanel } from "../features/runs/RunSummaryPanel";
import { ScenarioEditor } from "../features/scenario/ScenarioEditor";
import { useWorkspace } from "./useWorkspace";

type AssumptionEntryInput = {
  id: string;
  label: string;
  kind: AssumptionEntry["kind"];
  summary: string;
  detail?: string | undefined;
  provenance?: string | undefined;
  confidence?: AssumptionEntry["confidence"] | undefined;
};

function createAssumptionEntry(
  entry: AssumptionEntryInput,
): AssumptionEntry {
  return {
    id: entry.id,
    label: entry.label,
    kind: entry.kind,
    summary: entry.summary,
    ...(entry.detail ? { detail: entry.detail } : {}),
    ...(entry.provenance ? { provenance: entry.provenance } : {}),
    ...(entry.confidence ? { confidence: entry.confidence } : {}),
  };
}

function confidenceForSourceType(sourceType: SourceType) {
  switch (sourceType) {
    case "documented-fact":
      return "high" as const;
    case "engineering-inference":
      return "medium" as const;
    case "placeholder":
      return "low" as const;
  }
}

function buildAssumptionEntries(
  scenario: ScenarioDocument,
  selectedRun: RunRecord | null,
): AssumptionEntry[] {
  const scenarioEntries = scenario.assumptionNotes.map((note, index) =>
    createAssumptionEntry({
      id: `scenario-assumption-${index}`,
      label: `Scenario assumption ${index + 1}`,
      kind: note.provenance.sourceType,
      summary: note.note,
      detail: note.provenance.notes,
      provenance: note.provenance.source,
      confidence: confidenceForSourceType(note.provenance.sourceType),
    }),
  );

  const entries: AssumptionEntry[] = [
    ...scenarioEntries,
    createAssumptionEntry({
      id: "driver-placeholder",
      label: `Driver placeholder · ${scenario.driverProfile.label}`,
      kind: scenario.driverProfile.provenance.sourceType,
      summary: scenario.driverProfile.description,
      detail: scenario.driverProfile.provenance.notes,
      provenance: scenario.driverProfile.provenance.source,
      confidence: "low",
    }),
  ];

  if (selectedRun) {
    entries.push(
      createAssumptionEntry({
        id: "regulation-provenance",
        label: `Regulation snapshot · ${selectedRun.presetSnapshots.regulation.name}`,
        kind: selectedRun.presetSnapshots.regulation.provenance.sourceType,
        summary: selectedRun.presetSnapshots.regulation.description,
        detail: selectedRun.presetSnapshots.regulation.provenance.notes,
        provenance: selectedRun.presetSnapshots.regulation.provenance.source,
        confidence: confidenceForSourceType(
          selectedRun.presetSnapshots.regulation.provenance.sourceType,
        ),
      }),
      createAssumptionEntry({
        id: "weather-provenance",
        label: `Weather snapshot · ${selectedRun.presetSnapshots.weather.name}`,
        kind: selectedRun.presetSnapshots.weather.provenance.sourceType,
        summary: selectedRun.presetSnapshots.weather.description,
        detail: selectedRun.presetSnapshots.weather.provenance.notes,
        provenance: selectedRun.presetSnapshots.weather.provenance.source,
        confidence: confidenceForSourceType(
          selectedRun.presetSnapshots.weather.provenance.sourceType,
        ),
      }),
      ...selectedRun.assumptionNotes.map((note, index) =>
        createAssumptionEntry({
          id: `run-assumption-${index}`,
          label: `Run assumption ${index + 1}`,
          kind: note.provenance.sourceType,
          summary: note.note,
          detail: note.provenance.notes,
          provenance: note.provenance.source,
          confidence: confidenceForSourceType(note.provenance.sourceType),
        }),
      ),
    );
  }

  return entries.slice(0, 7);
}

function statusClassName(
  isBooting: boolean,
  tone: "neutral" | "success" | "error",
): string {
  if (isBooting) {
    return "app-status-pill app-status-pill--busy";
  }

  if (tone === "error") {
    return "app-status-pill app-status-pill--error";
  }

  if (tone === "success") {
    return "app-status-pill app-status-pill--success";
  }

  return "app-status-pill";
}

export function App() {
  const workspace = useWorkspace();
  const assumptionEntries = buildAssumptionEntries(
    workspace.currentScenario,
    workspace.selectedRun,
  );
  const assumptionPanelProps = {
    eyebrow: "Assumptions",
    description:
      "Shared provenance panel reused so facts, engineering inference, and placeholders stay visibly distinct.",
    modelLabel: workspace.selectedRun
      ? "Phase 1 placeholder harness"
      : "Phase 1 scenario workspace",
    modelVersion:
      workspace.selectedRun?.modelVersion ?? "phase1-workspace/draft",
    entries: assumptionEntries,
    notes: [
      {
        label: "Scenario id",
        value: workspace.currentScenario.scenarioId,
      },
      {
        label: "Saved scenarios",
        value: workspace.savedScenarios.length,
      },
      {
        label: "Run history",
        value: workspace.runHistory.length,
      },
      {
        label: "API target",
        value: "127.0.0.1:8787",
      },
    ],
    footer: (
      <p className="workspace-copy">
        Observer, controller, and imported-data fields remain explicit placeholders on the
        scenario document until later roadmap phases activate them.
      </p>
    ),
    ...(workspace.selectedRun
      ? { updatedAt: workspace.selectedRun.createdAt }
      : {}),
  };
  const zones: [WorkbenchShellZone, WorkbenchShellZone, WorkbenchShellZone] = [
    {
      id: "scenario-editor",
      eyebrow: "Left lane",
      title: "Scenario editing and local persistence",
      description:
        "Edit the shared Phase 1 scenario contract, inspect preset provenance, and save or reload local drafts through the API.",
      tone: "default",
      content: (
        <ScenarioEditor
          scenario={workspace.currentScenario}
          presetCatalog={workspace.presetCatalog}
          savedScenarios={workspace.savedScenarios}
          isBooting={workspace.isBooting}
          isSaving={workspace.isSavingScenario}
          onScenarioChange={workspace.updateScenario}
          onSaveScenario={workspace.saveCurrentScenario}
          onLoadScenario={workspace.loadScenario}
        />
      ),
      footer: (
        <div className="workspace-token-row">
          <span className="workspace-token workspace-token--muted">
            {workspace.currentScenario.scenarioId}
          </span>
          <span className="workspace-token">
            {workspace.currentScenario.sessionPreset.label ??
              workspace.currentScenario.sessionPreset.presetId}
          </span>
          <span className="workspace-token workspace-token--warning">
            local-first
          </span>
        </div>
      ),
    },
    {
      id: "run-surface",
      eyebrow: "Center lane",
      title: "Run summaries, comparison, and trace seams",
      description:
        "Create deterministic placeholder runs, compare recent history side by side, and keep the Phase 1 output surface honest about its limits.",
      tone: "featured",
      content: (
        <div className="workspace-stack">
          <RunSummaryPanel
            runs={workspace.runHistory}
            selectedRunId={workspace.selectedRunId}
          />
          <RunHistoryPanel
            runs={workspace.runHistory}
            selectedRunId={workspace.selectedRunId}
            isCreatingRun={workspace.isCreatingRun}
            onCreateRun={workspace.createRun}
            onSelectRun={workspace.selectRun}
          />
        </div>
      ),
      footer: (
        <p className="workspace-copy">
          Placeholder runs are saved through <code>/api/runs</code> after persisting the current
          scenario through <code>/api/scenarios</code>.
        </p>
      ),
    },
    {
      id: "assumptions-and-context",
      eyebrow: "Right lane",
      title: "Assumptions, provenance, and track honesty",
      description:
        "The right lane keeps explicit boundaries around Phase 1 claims while preserving the visual seams later phases will need.",
      tone: "muted",
      content: (
        <div className="workspace-stack">
          <AssumptionPanel {...assumptionPanelProps} />
          <TrackContextPlaceholder
            eyebrow="Track context"
            circuitLabel={workspace.currentScenario.circuit.name}
            state={workspace.selectedRun ? "overlay-reserved" : "coarse-context-only"}
            plannedLayers={[
              "Circuit framing once Phase 2 owns stable geometry semantics.",
              "Overlay hooks for future traces, scenario deltas, and policy context.",
            ]}
            limitations={[
              "No racing line, telemetry, or controller path is implied in Phase 1.",
              "Track context remains a reserved surface until the simulator justifies richer overlays.",
            ]}
            footer={
              <p className="workspace-copy">
                Current circuit selection: {workspace.currentScenario.circuit.name}
                {workspace.currentScenario.circuit.configuration
                  ? ` (${workspace.currentScenario.circuit.configuration})`
                  : ""}
              </p>
            }
          />
        </div>
      ),
      footer: (
        <div className="workspace-token-row">
          <span className="workspace-token workspace-token--muted">
            observer placeholder
          </span>
          <span className="workspace-token workspace-token--muted">
            controller placeholder
          </span>
          <span className="workspace-token workspace-token--warning">
            no lap fidelity claim
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="app-shell">
      <WorkbenchShell
        eyebrow="F1 Modeling Lab"
        title="Phase 1 scenario workbench"
        description="Local browser workspace for editing Phase 1 scenarios, saving them through the local API, and reviewing placeholder run history with shared visual primitives."
        status={
          <div className="app-status-stack">
            <span className={statusClassName(workspace.isBooting, workspace.notice.tone)}>
              {workspace.notice.text}
            </span>
            <div className="app-status-grid">
              <div className="app-status-card">
                <span>Draft circuit</span>
                <strong>{workspace.currentScenario.circuit.name}</strong>
              </div>
              <div className="app-status-card">
                <span>Saved scenarios</span>
                <strong>{workspace.savedScenarios.length}</strong>
              </div>
              <div className="app-status-card">
                <span>Run history</span>
                <strong>{workspace.runHistory.length}</strong>
              </div>
            </div>
          </div>
        }
        headerMeta={
          <div className="app-header-grid">
            <article className="app-header-card">
              <span>Scenario draft</span>
              <strong>{workspace.currentScenario.name}</strong>
              <p>{workspace.currentScenario.scenarioId}</p>
            </article>
            <article className="app-header-card">
              <span>Preset stack</span>
              <strong>
                {workspace.currentScenario.regulationPreset.label ??
                  workspace.currentScenario.regulationPreset.presetId}
              </strong>
              <p>
                {workspace.currentScenario.sessionPreset.label ??
                  workspace.currentScenario.sessionPreset.presetId}
                {" · "}
                {workspace.currentScenario.weatherPreset.label ??
                  workspace.currentScenario.weatherPreset.presetId}
              </p>
            </article>
            <article className="app-header-card">
              <span>Ports</span>
              <strong>127.0.0.1:5173 / 127.0.0.1:8787</strong>
              <p>Deterministic localhost targets from Phase 1 scaffolding.</p>
            </article>
          </div>
        }
        zones={zones}
        footer={
          <div className="app-footer-grid">
            <div className="app-footer-card">
              <span>Phase boundary</span>
              <strong>Foundation only</strong>
              <p>
                This workspace validates schema flow, persistence, and visual composition. It does
                not claim lap, telemetry, controller, or racing-line fidelity.
              </p>
            </div>
            <div className="app-footer-card">
              <span>Comparison seam</span>
              <strong>Shared visuals in use</strong>
              <p>
                Comparison cards, trace panels, assumption surfaces, and the workbench shell all
                come from <code>@f1-modeling/visuals</code>.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
