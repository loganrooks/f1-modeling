import {
  regulationPresetDocumentSchema,
  runRecordSchema,
  scenarioDocumentSchema,
  sessionPresetDocumentSchema,
  weatherPresetDocumentSchema,
  type PresetCatalog,
  type RunRecord,
  type ScenarioDocument,
} from "@f1-modeling/domain";

type ApiErrorPayload = {
  message?: string;
  issues?: Array<{
    path?: string;
    message?: string;
  }>;
};

export class WorkspaceApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WorkspaceApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePresetCatalog(payload: unknown): PresetCatalog {
  if (!isRecord(payload)) {
    throw new Error("Expected grouped preset catalog payload.");
  }

  return {
    regulation: Array.isArray(payload.regulation)
      ? payload.regulation.map((entry) =>
          regulationPresetDocumentSchema.parse(entry),
        )
      : [],
    session: Array.isArray(payload.session)
      ? payload.session.map((entry) => sessionPresetDocumentSchema.parse(entry))
      : [],
    weather: Array.isArray(payload.weather)
      ? payload.weather.map((entry) => weatherPresetDocumentSchema.parse(entry))
      : [],
  };
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;

    if (payload.issues?.length) {
      return payload.issues
        .map((issue) =>
          issue.path ? `${issue.path}: ${issue.message ?? "Invalid value"}` : issue.message,
        )
        .filter(Boolean)
        .join("; ");
    }

    if (payload.message) {
      return payload.message;
    }
  } catch {
    return `${response.status} ${response.statusText}`;
  }

  return `${response.status} ${response.statusText}`;
}

async function requestJson(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new WorkspaceApiError(
      await parseErrorMessage(response),
      response.status,
    );
  }

  return response.json();
}

export async function fetchPresetCatalog(): Promise<PresetCatalog> {
  const payload = await requestJson("/api/presets");
  return parsePresetCatalog(payload);
}

export async function listScenarioDocuments(): Promise<ScenarioDocument[]> {
  const payload = await requestJson("/api/scenarios");

  if (!Array.isArray(payload)) {
    throw new Error("Expected scenario list response.");
  }

  return payload.map((entry) => scenarioDocumentSchema.parse(entry));
}

export async function loadScenarioDocument(
  scenarioId: string,
): Promise<ScenarioDocument> {
  const payload = await requestJson(`/api/scenarios/${scenarioId}`);
  return scenarioDocumentSchema.parse(payload);
}

export async function saveScenarioDocument(
  scenario: ScenarioDocument,
): Promise<ScenarioDocument> {
  const payload = await requestJson("/api/scenarios", {
    method: "POST",
    body: JSON.stringify(scenarioDocumentSchema.parse(scenario)),
  });

  return scenarioDocumentSchema.parse(payload);
}

export async function listRunHistory(): Promise<RunRecord[]> {
  const payload = await requestJson("/api/runs");

  if (!Array.isArray(payload)) {
    throw new Error("Expected run history response.");
  }

  return payload.map((entry) => runRecordSchema.parse(entry));
}

export async function createPlaceholderRun(
  scenarioId: string,
): Promise<RunRecord> {
  const payload = await requestJson("/api/runs", {
    method: "POST",
    body: JSON.stringify({ scenarioId }),
  });

  return runRecordSchema.parse(payload);
}
