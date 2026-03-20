export {
  documentIdSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
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
