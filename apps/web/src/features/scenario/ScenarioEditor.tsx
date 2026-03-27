import {
  type CircuitDocument,
  type PresetCatalog,
  type ScenarioDocument,
  type VehicleParamsInput,
} from "@f1-modeling/domain";

import { PresetSelectors } from "../presets/PresetSelectors";

const EDITOR_ASSUMPTION_PROVENANCE = {
  sourceType: "placeholder" as const,
  source: "Phase 1 browser workspace",
  notes:
    "Workspace-authored assumption notes remain explicit placeholders until later phases add richer provenance editing.",
};

function sanitizeDocumentId(value: string, fallback: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || fallback;
}

function parseLineList(value: string): string[] {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function rebuildAssumptionNotes(
  value: string,
  scenario: ScenarioDocument,
): ScenarioDocument["assumptionNotes"] {
  const lines = parseLineList(value);

  return lines.map((note, index) => ({
    note,
    provenance:
      scenario.assumptionNotes[index]?.provenance ?? EDITOR_ASSUMPTION_PROVENANCE,
  }));
}

const DEFAULT_VEHICLE_PARAMS: VehicleParamsInput = {
  mass: 798,
  dragFactor: 1.05,
  downforceFactor: 3.8,
  peakPower: 735_000,
  gripCoefficient: 1.7,
};

const VEHICLE_PARAM_FIELDS: {
  key: keyof VehicleParamsInput;
  label: string;
  unit: string;
  step: number;
  min: number;
}[] = [
  { key: "mass", label: "Mass", unit: "kg", step: 1, min: 1 },
  { key: "dragFactor", label: "Drag factor", unit: "kx", step: 0.01, min: 0 },
  { key: "downforceFactor", label: "Downforce factor", unit: "kz", step: 0.01, min: 0 },
  { key: "peakPower", label: "Peak power", unit: "W", step: 1000, min: 1 },
  { key: "gripCoefficient", label: "Grip coefficient", unit: "mu", step: 0.01, min: 0.01 },
];

type ScenarioEditorProps = {
  scenario: ScenarioDocument;
  presetCatalog: PresetCatalog | null;
  circuitCatalog: CircuitDocument[];
  savedScenarios: ScenarioDocument[];
  isBooting?: boolean;
  isSaving?: boolean;
  onScenarioChange: (next: ScenarioDocument) => void;
  onSaveScenario: () => void;
  onLoadScenario: (scenarioId: string) => void;
};

export function ScenarioEditor({
  scenario,
  presetCatalog,
  circuitCatalog,
  savedScenarios,
  isBooting = false,
  isSaving = false,
  onScenarioChange,
  onSaveScenario,
  onLoadScenario,
}: ScenarioEditorProps) {
  const savedScenario = savedScenarios.find(
    (entry) => entry.scenarioId === scenario.scenarioId,
  );
  const hasUnsavedChanges = savedScenario
    ? JSON.stringify(savedScenario) !== JSON.stringify(scenario)
    : true;

  return (
    <section className="workspace-stack">
      <div className="workspace-section-heading">
        <p className="workspace-kicker">Scenario editor</p>
        <h3>Editable Phase 1 scenario document</h3>
        <p className="workspace-copy">
          Everything here stays schema-backed, local-first, and explicit about placeholder fidelity.
        </p>
      </div>

      <div className="workspace-action-bar">
        <button
          className="workspace-button"
          type="button"
          disabled={isBooting || isSaving}
          onClick={onSaveScenario}
        >
          {isSaving ? "Saving scenario..." : "Save scenario"}
        </button>
        <button
          className="workspace-button workspace-button--ghost"
          type="button"
          disabled={!savedScenario || isBooting || isSaving}
          onClick={() => onLoadScenario(scenario.scenarioId)}
        >
          Reload current from API
        </button>
        <span
          className={
            hasUnsavedChanges
              ? "workspace-token workspace-token--warning"
              : "workspace-token workspace-token--success"
          }
        >
          {hasUnsavedChanges ? "Unsaved local edits" : "Draft matches saved copy"}
        </span>
      </div>

      <div className="workspace-form-grid">
        <label className="workspace-field">
          <span className="workspace-label">Scenario name</span>
          <input
            aria-label="Scenario name"
            className="workspace-input"
            type="text"
            value={scenario.name}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                name: event.target.value,
              })
            }
          />
        </label>

        <label className="workspace-field">
          <span className="workspace-label">Local document id</span>
          <input
            aria-label="Local document id"
            className="workspace-input"
            type="text"
            value={scenario.scenarioId}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                scenarioId: sanitizeDocumentId(
                  event.target.value,
                  scenario.scenarioId,
                ),
              })
            }
          />
        </label>

        <label className="workspace-field">
          <span className="workspace-label">Circuit</span>
          {circuitCatalog.length > 0 ? (
            <select
              aria-label="Circuit"
              className="workspace-input"
              value={scenario.circuit.circuitId}
              onChange={(event) => {
                const selected = circuitCatalog.find(
                  (c) => c.circuitId === event.target.value,
                );
                if (selected) {
                  onScenarioChange({
                    ...scenario,
                    circuit: {
                      circuitId: selected.circuitId,
                      name: selected.name,
                      configuration: selected.configuration,
                    },
                  });
                }
              }}
            >
              {!circuitCatalog.some((c) => c.circuitId === scenario.circuit.circuitId) && (
                <option value={scenario.circuit.circuitId}>
                  {scenario.circuit.name} (not in catalog)
                </option>
              )}
              {circuitCatalog.map((circuit) => (
                <option key={circuit.circuitId} value={circuit.circuitId}>
                  {circuit.name}{circuit.configuration ? ` (${circuit.configuration})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <input
              aria-label="Circuit"
              className="workspace-input"
              type="text"
              value={scenario.circuit.name}
              onChange={(event) =>
                onScenarioChange({
                  ...scenario,
                  circuit: {
                    ...scenario.circuit,
                    name: event.target.value,
                  },
                })
              }
            />
          )}
        </label>

        <label className="workspace-field">
          <span className="workspace-label">Configuration</span>
          <input
            aria-label="Configuration"
            className="workspace-input"
            type="text"
            value={scenario.circuit.configuration ?? ""}
            readOnly={circuitCatalog.length > 0}
          />
        </label>

        <label className="workspace-field">
          <span className="workspace-label">Seed</span>
          <input
            aria-label="Seed"
            className="workspace-input"
            type="number"
            min="0"
            step="1"
            value={scenario.seed}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                seed: Math.max(0, Number.parseInt(event.target.value || "0", 10) || 0),
              })
            }
          />
        </label>
      </div>

      <PresetSelectors
        presetCatalog={presetCatalog}
        scenario={scenario}
        disabled={isBooting}
        onScenarioChange={onScenarioChange}
      />

      <div className="workspace-section-heading">
        <p className="workspace-kicker">Vehicle parameters</p>
        <h3>QSS model inputs</h3>
        <p className="workspace-copy">
          These parameters feed the quasi-steady-state lap model. Default values are engineering-inference from 2026 FIA baseline.
        </p>
      </div>

      {scenario.vehicleParams ? (
        <div
          className="workspace-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {VEHICLE_PARAM_FIELDS.map((field) => (
            <label key={field.key} className="workspace-field">
              <span className="workspace-label">
                {field.label} ({field.unit})
              </span>
              <input
                aria-label={`${field.label} (${field.unit})`}
                className="workspace-input"
                type="number"
                step={field.step}
                min={field.min}
                value={scenario.vehicleParams![field.key]}
                onChange={(event) => {
                  const raw = parseFloat(event.target.value);
                  const value = Number.isFinite(raw) ? Math.max(field.min, raw) : field.min;
                  onScenarioChange({
                    ...scenario,
                    vehicleParams: {
                      ...scenario.vehicleParams!,
                      [field.key]: value,
                    },
                  });
                }}
              />
              <span className="workspace-token workspace-token--muted" style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>
                Engineering inference - 2026 FIA baseline
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="workspace-action-bar">
          <button
            className="workspace-button"
            type="button"
            onClick={() =>
              onScenarioChange({
                ...scenario,
                vehicleParams: { ...DEFAULT_VEHICLE_PARAMS },
              })
            }
          >
            Add vehicle parameters (use 2026 defaults)
          </button>
          <span className="workspace-token workspace-token--muted">
            No vehicle parameters set - Phase 1 scenario
          </span>
        </div>
      )}

      <div className="workspace-form-grid">
        <label className="workspace-field">
          <span className="workspace-label">Driver placeholder label</span>
          <input
            aria-label="Driver placeholder label"
            className="workspace-input"
            type="text"
            value={scenario.driverProfile.label}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                driverProfile: {
                  ...scenario.driverProfile,
                  label: event.target.value,
                },
              })
            }
          />
        </label>

        <label className="workspace-field">
          <span className="workspace-label">Driver placeholder id</span>
          <input
            aria-label="Driver placeholder id"
            className="workspace-input"
            type="text"
            value={scenario.driverProfile.profileId}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                driverProfile: {
                  ...scenario.driverProfile,
                  profileId: sanitizeDocumentId(
                    event.target.value,
                    scenario.driverProfile.profileId,
                  ),
                },
              })
            }
          />
        </label>
      </div>

      <label className="workspace-field">
        <span className="workspace-label">Driver placeholder description</span>
        <textarea
          aria-label="Driver placeholder description"
          className="workspace-textarea"
          rows={3}
          value={scenario.driverProfile.description}
          onChange={(event) =>
            onScenarioChange({
              ...scenario,
              driverProfile: {
                ...scenario.driverProfile,
                description: event.target.value,
              },
            })
          }
        />
      </label>

      <div className="workspace-form-grid">
        <label className="workspace-field workspace-field--wide">
          <span className="workspace-label">Notes</span>
          <textarea
            aria-label="Notes"
            className="workspace-textarea"
            rows={4}
            value={scenario.notes.join("\n")}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                notes: parseLineList(event.target.value),
              })
            }
          />
        </label>

        <label className="workspace-field workspace-field--wide">
          <span className="workspace-label">Assumptions</span>
          <textarea
            aria-label="Assumptions"
            className="workspace-textarea"
            rows={4}
            value={scenario.assumptionNotes.map((note) => note.note).join("\n")}
            onChange={(event) =>
              onScenarioChange({
                ...scenario,
                assumptionNotes: rebuildAssumptionNotes(event.target.value, scenario),
              })
            }
          />
        </label>
      </div>

      <section className="workspace-card workspace-card--muted">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Saved scenarios</p>
          <h3>Reload local workspace documents</h3>
        </div>
        {savedScenarios.length > 0 ? (
          <div className="workspace-saved-list">
            {savedScenarios.map((entry) => (
              <article
                key={entry.scenarioId}
                className={
                  entry.scenarioId === scenario.scenarioId
                    ? "workspace-card workspace-card--selected"
                    : "workspace-card"
                }
              >
                <div className="workspace-row workspace-row--between">
                  <div>
                    <strong>{entry.name}</strong>
                    <p className="workspace-copy">
                      {entry.circuit.name} · {entry.sessionPreset.label ?? entry.sessionPreset.presetId}
                    </p>
                  </div>
                  <button
                    className="workspace-button workspace-button--ghost"
                    type="button"
                    disabled={isBooting}
                    onClick={() => onLoadScenario(entry.scenarioId)}
                  >
                    Load
                  </button>
                </div>
                <div className="workspace-token-row">
                  <span className="workspace-token workspace-token--muted">
                    {entry.scenarioId}
                  </span>
                  <span className="workspace-token">
                    {entry.weatherPreset.label ?? entry.weatherPreset.presetId}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="workspace-copy">
            No scenarios are saved yet. Save the current draft to start building a local comparison history.
          </p>
        )}
      </section>
    </section>
  );
}
