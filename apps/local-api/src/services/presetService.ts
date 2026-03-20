import {
  type PresetCatalog,
  type RegulationPresetDocument,
  type ScenarioDocument,
  type SessionPresetDocument,
  type WeatherPresetDocument,
} from "@f1-modeling/domain";
import { loadPresetCatalogFromDisk } from "@f1-modeling/domain/node/preset-catalog";

export interface ScenarioPresetDocuments {
  regulation: RegulationPresetDocument;
  session: SessionPresetDocument;
  weather: WeatherPresetDocument;
}

export function listPresets(presetsRoot: string): PresetCatalog {
  return loadPresetCatalogFromDisk(presetsRoot);
}

function findPresetOrThrow<T extends { presetId: string }>(
  documents: readonly T[],
  presetId: string,
  presetType: "regulation" | "session" | "weather",
): T {
  const document = documents.find((entry) => entry.presetId === presetId);

  if (!document) {
    throw new Error(
      `Missing ${presetType} preset "${presetId}" in ${presetType} catalog.`,
    );
  }

  return document;
}

export function resolveScenarioPresetDocuments(
  presetsRoot: string,
  scenario: ScenarioDocument,
): ScenarioPresetDocuments {
  const catalog = listPresets(presetsRoot);

  return {
    regulation: findPresetOrThrow(
      catalog.regulation,
      scenario.regulationPreset.presetId,
      "regulation",
    ),
    session: findPresetOrThrow(
      catalog.session,
      scenario.sessionPreset.presetId,
      "session",
    ),
    weather: findPresetOrThrow(
      catalog.weather,
      scenario.weatherPreset.presetId,
      "weather",
    ),
  };
}
