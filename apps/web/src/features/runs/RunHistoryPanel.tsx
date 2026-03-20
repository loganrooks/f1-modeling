import { type RunRecord } from "@f1-modeling/domain";

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type RunHistoryPanelProps = {
  runs: RunRecord[];
  selectedRunId: string | null;
  isCreatingRun?: boolean;
  onCreateRun: () => void;
  onSelectRun: (runId: string) => void;
};

export function RunHistoryPanel({
  runs,
  selectedRunId,
  isCreatingRun = false,
  onCreateRun,
  onSelectRun,
}: RunHistoryPanelProps) {
  return (
    <section className="workspace-stack">
      <div className="workspace-row workspace-row--between">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Run history</p>
          <h3>Append-only placeholder runs</h3>
        </div>
        <button
          className="workspace-button"
          type="button"
          disabled={isCreatingRun}
          onClick={onCreateRun}
        >
          {isCreatingRun ? "Creating run..." : "Create placeholder run"}
        </button>
      </div>

      {runs.length > 0 ? (
        <div className="workspace-saved-list">
          {runs.map((run) => {
            const isSelected = run.runId === selectedRunId;

            return (
              <button
                key={run.runId}
                className={
                  isSelected
                    ? "workspace-history-card workspace-history-card--selected"
                    : "workspace-history-card"
                }
                type="button"
                onClick={() => onSelectRun(run.runId)}
              >
                <div className="workspace-row workspace-row--between">
                  <strong>{run.scenarioSnapshot.name}</strong>
                  <span className="workspace-token workspace-token--warning">
                    placeholder
                  </span>
                </div>
                <p className="workspace-copy">{run.runId}</p>
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
            );
          })}
        </div>
      ) : (
        <div className="workspace-card workspace-card--muted">
          <p className="workspace-copy">
            No runs saved yet. The Phase 1 browser workspace will save the current scenario first,
            then append a deterministic placeholder run through the local API.
          </p>
        </div>
      )}
    </section>
  );
}
