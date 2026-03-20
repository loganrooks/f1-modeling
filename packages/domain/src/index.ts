export {
  documentIdSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  presetDocumentSchemaVersion,
  runRecordSchemaVersion,
  schemaVersion,
  schemaVersionSchema,
  scenarioDocumentSchemaVersion,
} from "./common/schemaVersion.js";
export type {
  DocumentId,
  IsoTimestamp,
  SchemaVersion,
} from "./common/schemaVersion.js";

export {
  assumptionNoteSchema,
  placeholderProvenanceSchema,
  provenanceSchema,
  sourceTypeSchema,
} from "./common/provenance.js";
export type {
  AssumptionNote,
  PlaceholderProvenance,
  Provenance,
  SourceType,
} from "./common/provenance.js";

export { createDefaultScenario } from "./scenario/defaultScenario.js";
export type { CreateDefaultScenarioOptions } from "./scenario/defaultScenario.js";

export {
  circuitSelectionSchema,
  driverProfilePlaceholderSchema,
  presetReferenceSchema,
  reservedExtensionPointSchema,
  scenarioDocumentSchema,
} from "./scenario/schema.js";
export type {
  CircuitSelection,
  DriverProfilePlaceholder,
  PresetReference,
  ReservedExtensionPoint,
  ScenarioDocument,
} from "./scenario/schema.js";

export {
  presetDocumentSchema,
  presetTypeSchema,
  regulationPresetDocumentSchema,
  sessionPresetDocumentSchema,
  weatherPresetDocumentSchema,
} from "./presets/schema.js";
export type {
  PresetDocument,
  PresetType,
  RegulationPresetDocument,
  SessionPresetDocument,
  WeatherPresetDocument,
} from "./presets/schema.js";

export {
  getPresetById,
  groupPresetCatalog,
} from "./presets/registry.js";
export type { PresetCatalog } from "./presets/registry.js";

export {
  presetSnapshotSchema,
  presetSnapshotsSchema,
  runArtifactSchema,
  runRecordSchema,
  runStatusSchema,
} from "./runs/schema.js";
export type {
  PresetSnapshot,
  PresetSnapshots,
  RunArtifact,
  RunRecord,
  RunStatus,
} from "./runs/schema.js";
