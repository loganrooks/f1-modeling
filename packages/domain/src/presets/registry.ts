import type {
  PresetDocument,
  RegulationPresetDocument,
  SessionPresetDocument,
  WeatherPresetDocument,
} from "./schema.js";

const presetTypeOrder = ["regulation", "session", "weather"] as const;

export interface PresetCatalog {
  regulation: RegulationPresetDocument[];
  session: SessionPresetDocument[];
  weather: WeatherPresetDocument[];
}

function isRegulationPresetDocument(
  document: PresetDocument,
): document is RegulationPresetDocument {
  return document.presetType === "regulation";
}

function isSessionPresetDocument(
  document: PresetDocument,
): document is SessionPresetDocument {
  return document.presetType === "session";
}

function isWeatherPresetDocument(
  document: PresetDocument,
): document is WeatherPresetDocument {
  return document.presetType === "weather";
}

function sortPresetDocuments<T extends PresetDocument>(documents: T[]): T[] {
  return [...documents].sort(
    (left, right) =>
      left.name.localeCompare(right.name) ||
      left.presetId.localeCompare(right.presetId),
  );
}

export function groupPresetCatalog(
  documents: readonly PresetDocument[],
): PresetCatalog {
  const catalog: PresetCatalog = {
    regulation: [],
    session: [],
    weather: [],
  };

  for (const document of documents) {
    if (isRegulationPresetDocument(document)) {
      catalog.regulation.push(document);
      continue;
    }

    if (isSessionPresetDocument(document)) {
      catalog.session.push(document);
      continue;
    }

    if (isWeatherPresetDocument(document)) {
      catalog.weather.push(document);
    }
  }

  return {
    regulation: sortPresetDocuments(catalog.regulation),
    session: sortPresetDocuments(catalog.session),
    weather: sortPresetDocuments(catalog.weather),
  };
}

export function getPresetById(
  catalog: PresetCatalog,
  presetId: string,
): PresetDocument | undefined {
  for (const presetType of presetTypeOrder) {
    const match = catalog[presetType].find(
      (document) => document.presetId === presetId,
    );

    if (match) {
      return match;
    }
  }

  return undefined;
}
