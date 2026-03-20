import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { groupPresetCatalog, type PresetCatalog } from "../presets/registry.js";
import {
  presetDocumentSchema,
  type PresetDocument,
  type PresetType,
} from "../presets/schema.js";

const presetDirectories: Record<PresetType, string> = {
  regulation: "regulations",
  session: "sessions",
  weather: "weather",
};

function loadPresetDocumentsForType(
  presetsRoot: string,
  presetType: PresetType,
): PresetDocument[] {
  const directoryPath = join(presetsRoot, presetDirectories[presetType]);

  return readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      const filePath = join(directoryPath, entry.name);
      const rawDocument = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
      const presetDocument = presetDocumentSchema.parse(rawDocument);

      if (presetDocument.presetType !== presetType) {
        throw new Error(
          `Preset ${filePath} declared "${presetDocument.presetType}" but was loaded from the ${presetType} catalog.`,
        );
      }

      return presetDocument;
    });
}

export function loadPresetCatalogFromDisk(presetsRoot: string): PresetCatalog {
  const documents = (
    Object.keys(presetDirectories) as PresetType[]
  ).flatMap((presetType) => loadPresetDocumentsForType(presetsRoot, presetType));

  return groupPresetCatalog(documents);
}
