import {
  type PresetCatalog,
  type PresetDocument,
  type ScenarioDocument,
} from "@f1-modeling/domain";

type ScenarioPresetField =
  | "regulationPreset"
  | "sessionPreset"
  | "weatherPreset";

type PresetGroupConfig = {
  catalogKey: keyof PresetCatalog;
  field: ScenarioPresetField;
  label: string;
  helper: string;
};

const PRESET_GROUPS: PresetGroupConfig[] = [
  {
    catalogKey: "regulation",
    field: "regulationPreset",
    label: "Regulation preset",
    helper: "Keep rule-era assumptions explicit instead of hard-coded in the UI.",
  },
  {
    catalogKey: "session",
    field: "sessionPreset",
    label: "Session preset",
    helper: "Session choice stays metadata-only in Phase 1 and does not imply strategy logic yet.",
  },
  {
    catalogKey: "weather",
    field: "weatherPreset",
    label: "Weather preset",
    helper: "Weather selection is reproducible context, not a calibrated dynamics model yet.",
  },
];

function summarizePresetValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .slice(0, 2)
      .map(([key, entryValue]) => `${key}: ${String(entryValue)}`)
      .join(", ");
  }

  return "n/a";
}

function getSelectedPreset(
  presets: readonly PresetDocument[],
  presetId: string,
): PresetDocument | null {
  return presets.find((entry) => entry.presetId === presetId) ?? presets[0] ?? null;
}

type PresetSelectorsProps = {
  presetCatalog: PresetCatalog | null;
  scenario: ScenarioDocument;
  disabled?: boolean;
  onScenarioChange: (next: ScenarioDocument) => void;
};

export function PresetSelectors({
  presetCatalog,
  scenario,
  disabled = false,
  onScenarioChange,
}: PresetSelectorsProps) {
  if (!presetCatalog) {
    return (
      <section className="workspace-card workspace-card--muted">
        <div className="workspace-section-heading">
          <p className="workspace-kicker">Preset registry</p>
          <h3>Loading preset catalog</h3>
        </div>
        <p className="workspace-copy">
          The browser workspace reads regulation, session, and weather presets from the local API only.
        </p>
      </section>
    );
  }

  function applyPresetSelection(
    field: ScenarioPresetField,
    presets: readonly PresetDocument[],
    presetId: string,
  ) {
    const preset = getSelectedPreset(presets, presetId);

    if (!preset) {
      return;
    }

    onScenarioChange({
      ...scenario,
      [field]: {
        presetId: preset.presetId,
        label: preset.name,
      },
    });
  }

  return (
    <section className="workspace-stack">
      <div className="workspace-section-heading">
        <p className="workspace-kicker">Preset registry</p>
        <h3>Scenario selectors and preset provenance</h3>
      </div>

      <div className="preset-grid">
        {PRESET_GROUPS.map((group) => {
          const presets = presetCatalog[group.catalogKey] as readonly PresetDocument[];
          const selectedPreset = getSelectedPreset(
            presets,
            scenario[group.field].presetId,
          );

          return (
            <article key={group.field} className="workspace-card">
              <label className="workspace-field">
                <span className="workspace-label">{group.label}</span>
                <select
                  aria-label={group.label}
                  className="workspace-select"
                  value={selectedPreset?.presetId ?? ""}
                  disabled={disabled}
                  onChange={(event) =>
                    applyPresetSelection(group.field, presets, event.target.value)
                  }
                >
                  {presets.map((preset) => (
                    <option key={preset.presetId} value={preset.presetId}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </label>

              <p className="workspace-copy">{group.helper}</p>

              {selectedPreset ? (
                <div className="workspace-stack workspace-stack--tight">
                  <p className="workspace-copy">{selectedPreset.description}</p>
                  <div className="workspace-token-row">
                    <span className="workspace-token">{selectedPreset.provenance.sourceType}</span>
                    <span className="workspace-token workspace-token--muted">
                      {selectedPreset.presetId}
                    </span>
                  </div>
                  <dl className="workspace-metadata-list">
                    {Object.entries(selectedPreset.values)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt>{key}</dt>
                          <dd>{summarizePresetValue(value)}</dd>
                        </div>
                      ))}
                  </dl>
                  {selectedPreset.assumptionNotes.length > 0 ? (
                    <ul className="workspace-list">
                      {selectedPreset.assumptionNotes.map((note) => (
                        <li key={note.note}>{note.note}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
