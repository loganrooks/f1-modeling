import {
  createDefaultScenario,
  type PresetCatalog,
  type RunRecord,
  type ScenarioDocument,
} from "@f1-modeling/domain";
import { startTransition, useEffect, useState } from "react";

import {
  createPlaceholderRun,
  fetchPresetCatalog,
  listRunHistory,
  listScenarioDocuments,
  loadScenarioDocument,
  saveScenarioDocument,
} from "../features/workspace/api";

type WorkspaceNoticeTone = "neutral" | "success" | "error";

export interface WorkspaceNotice {
  tone: WorkspaceNoticeTone;
  text: string;
}

function sortScenarios(documents: ScenarioDocument[]): ScenarioDocument[] {
  return [...documents].sort(
    (left, right) =>
      left.name.localeCompare(right.name) ||
      left.scenarioId.localeCompare(right.scenarioId),
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown workspace error.";
}

export function useWorkspace() {
  const [presetCatalog, setPresetCatalog] = useState<PresetCatalog | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioDocument>(() =>
    createDefaultScenario(),
  );
  const [savedScenarios, setSavedScenarios] = useState<ScenarioDocument[]>([]);
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isSavingScenario, setIsSavingScenario] = useState(false);
  const [isCreatingRun, setIsCreatingRun] = useState(false);
  const [notice, setNotice] = useState<WorkspaceNotice>({
    tone: "neutral",
    text: "Loading local presets, saved scenarios, and placeholder run history...",
  });

  async function refreshWorkspace() {
    setIsBooting(true);

    try {
      const [catalog, scenarios, runs] = await Promise.all([
        fetchPresetCatalog(),
        listScenarioDocuments(),
        listRunHistory(),
      ]);
      const orderedScenarios = sortScenarios(scenarios);

      startTransition(() => {
        setPresetCatalog(catalog);
        setSavedScenarios(orderedScenarios);
        setRunHistory(runs);
        setCurrentScenario((draft) => {
          const persistedDraft = orderedScenarios.find(
            (entry) => entry.scenarioId === draft.scenarioId,
          );

          return persistedDraft ?? draft;
        });
        setSelectedRunId((current) => {
          if (current && runs.some((entry) => entry.runId === current)) {
            return current;
          }

          return runs[0]?.runId ?? null;
        });
        setNotice({
          tone: "success",
          text:
            orderedScenarios.length > 0
              ? `Loaded ${orderedScenarios.length} saved scenarios and ${runs.length} placeholder runs.`
              : "Workspace ready. Start editing a Phase 1 scenario and save it locally.",
        });
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setIsBooting(false);
    }
  }

  useEffect(() => {
    void refreshWorkspace();
  }, []);

  async function reloadCollections() {
    const [scenarios, runs] = await Promise.all([
      listScenarioDocuments(),
      listRunHistory(),
    ]);

    return {
      scenarios: sortScenarios(scenarios),
      runs,
    };
  }

  async function saveCurrentScenario() {
    setIsSavingScenario(true);

    try {
      const savedScenario = await saveScenarioDocument(currentScenario);
      const { scenarios, runs } = await reloadCollections();

      startTransition(() => {
        setCurrentScenario(savedScenario);
        setSavedScenarios(scenarios);
        setRunHistory(runs);
        setNotice({
          tone: "success",
          text: `Saved "${savedScenario.name}" to the local Phase 1 workspace.`,
        });
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setIsSavingScenario(false);
    }
  }

  async function loadScenario(scenarioId: string) {
    try {
      const loadedScenario = await loadScenarioDocument(scenarioId);

      startTransition(() => {
        setCurrentScenario(loadedScenario);
        setNotice({
          tone: "success",
          text: `Loaded "${loadedScenario.name}" from the local API.`,
        });
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error),
      });
    }
  }

  async function createRun() {
    setIsCreatingRun(true);

    try {
      const savedScenario = await saveScenarioDocument(currentScenario);
      const createdRun = await createPlaceholderRun(savedScenario.scenarioId);
      const { scenarios, runs } = await reloadCollections();

      startTransition(() => {
        setCurrentScenario(savedScenario);
        setSavedScenarios(scenarios);
        setRunHistory(runs);
        setSelectedRunId(createdRun.runId);
        setNotice({
          tone: "success",
          text: `Saved "${savedScenario.name}" and appended placeholder run "${createdRun.runId}".`,
        });
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setIsCreatingRun(false);
    }
  }

  return {
    presetCatalog,
    currentScenario,
    savedScenarios,
    runHistory,
    selectedRunId,
    selectedRun:
      runHistory.find((entry) => entry.runId === selectedRunId) ?? runHistory[0] ?? null,
    isBooting,
    isSavingScenario,
    isCreatingRun,
    notice,
    updateScenario: setCurrentScenario,
    refreshWorkspace,
    saveCurrentScenario,
    loadScenario,
    reloadCurrentScenario: () => loadScenario(currentScenario.scenarioId),
    createRun,
    selectRun: setSelectedRunId,
  };
}
