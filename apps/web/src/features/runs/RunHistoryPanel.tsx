import { type RunRecord } from "@f1-modeling/domain";

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getHarnessId(run: RunRecord): string {
  const id = run.summaryMetrics.harnessId;
  return typeof id === "string" ? id : "";
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds - mins * 60;
  return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
}

function getRunBadge(run: RunRecord): { label: string; className: string } {
  const harnessId = getHarnessId(run);
  if (harnessId === "stint-model") {
    return { label: "Stint Model", className: "workspace-token workspace-token--accent" };
  }
  if (harnessId === "qss-lap-model") {
    return { label: "Lap Model", className: "workspace-token workspace-token--accent" };
  }
  return { label: "Placeholder", className: "workspace-token workspace-token--warning" };
}

function getRunMetricDisplay(run: RunRecord): string {
  const harnessId = getHarnessId(run);
  if (harnessId === "stint-model") {
    const totalLaps = run.summaryMetrics.totalLaps;
    const totalTime = run.summaryMetrics.totalTime;
    if (typeof totalLaps === "number" && typeof totalTime === "number") {
      const mins = Math.floor(totalTime / 60);
      const secs = totalTime - mins * 60;
      return `${totalLaps} laps · ${mins}:${secs.toFixed(1).padStart(4, "0")}`;
    }
    return "stint";
  }
  if (harnessId === "qss-lap-model") {
    const lapTime = run.summaryMetrics.lapTime;
    if (typeof lapTime === "number") {
      return formatLapTime(lapTime);
    }
    return "no lap time";
  }

  const score = run.summaryMetrics.placeholderScore;
  return typeof score === "number" ? `score: ${score.toFixed(0)}` : "placeholder";
}

type RunHistoryPanelProps = {
  runs: RunRecord[];
  selectedRunId: string | null;
  comparisonRunId?: string | null;
  isCreatingRun?: boolean;
  onCreateRun: () => void;
  onCreateStintRun?: () => void;
  onSelectRun: (runId: string) => void;
  onSelectComparisonRun?: (runId: string | null) => void;
};

export function RunHistoryPanel({
  runs,
  selectedRunId,
  comparisonRunId,
  isCreatingRun = false,
  onCreateRun,
  onCreateStintRun,
  onSelectRun,
  onSelectComparisonRun,
}: RunHistoryPanelProps) {
  return (
    <section className="workspace-stack">
      <div className="workspace-row workspace-row--between">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Run history</p>
          <h3>Runs</h3>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="workspace-button"
            type="button"
            disabled={isCreatingRun}
            onClick={onCreateRun}
          >
            {isCreatingRun ? "Creating..." : "Lap run"}
          </button>
          {onCreateStintRun ? (
            <button
              className="workspace-button"
              type="button"
              disabled={isCreatingRun}
              onClick={onCreateStintRun}
            >
              {isCreatingRun ? "Creating..." : "Stint run"}
            </button>
          ) : null}
        </div>
      </div>

      {runs.length > 0 ? (
        <div className="workspace-saved-list">
          {runs.map((run) => {
            const isSelected = run.runId === selectedRunId;
            const isComparison = run.runId === comparisonRunId;
            const badge = getRunBadge(run);
            const metricDisplay = getRunMetricDisplay(run);

            return (
              <div
                key={run.runId}
                style={{
                  display: "grid",
                  gap: 0,
                  border: isComparison
                    ? "2px solid rgba(11, 111, 120, 0.4)"
                    : "1px solid transparent",
                  borderRadius: 18,
                }}
              >
                <button
                  className={
                    isSelected
                      ? "workspace-history-card workspace-history-card--selected"
                      : "workspace-history-card"
                  }
                  type="button"
                  onClick={() => onSelectRun(run.runId)}
                  style={isComparison ? { borderRadius: "16px 16px 0 0" } : undefined}
                >
                  <div className="workspace-row workspace-row--between">
                    <strong>{run.scenarioSnapshot.name}</strong>
                    <span className={badge.className}>{badge.label}</span>
                  </div>
                  <div className="workspace-row workspace-row--between">
                    <p className="workspace-copy" style={{ margin: 0 }}>{run.runId}</p>
                    <span style={{
                      fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: getHarnessId(run) === "qss-lap-model" ? "#0d6770" : "#8e5517",
                    }}>
                      {metricDisplay}
                    </span>
                  </div>
                  <div className="workspace-token-row">
                    <span className="workspace-token workspace-token--muted">
                      {run.modelVersion}
                    </span>
                    <span className="workspace-token">{run.status}</span>
                    <span className="workspace-token workspace-token--muted">
                      {formatTimestamp(run.createdAt)}
                    </span>
                  </div>
                </button>

                {/* Compare button for non-selected runs */}
                {onSelectComparisonRun && !isSelected ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComparisonRun(isComparison ? null : run.runId);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 14px",
                      border: "none",
                      borderTop: "1px solid rgba(26, 56, 74, 0.1)",
                      borderRadius: "0 0 16px 16px",
                      background: isComparison
                        ? "rgba(11, 111, 120, 0.08)"
                        : "rgba(255, 255, 255, 0.5)",
                      color: isComparison ? "#0d6770" : "#5a6d7c",
                      fontSize: "0.78rem",
                      fontFamily: '"IBM Plex Mono", "Fira Code", "SFMono-Regular", monospace',
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {isComparison ? "Remove comparison" : "Compare"}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="workspace-card workspace-card--muted">
          <p className="workspace-copy">
            No runs saved yet. Select a circuit, configure vehicle parameters, and create a run to
            see lap model output with speed profiles and sector breakdowns.
          </p>
        </div>
      )}
    </section>
  );
}
