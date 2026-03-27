export {
  circuitCornerSchema,
  circuitDocumentSchema,
  circuitPointSchema,
  circuitSectorSchema,
} from "./schema.js";
export type {
  CircuitCorner,
  CircuitDocument,
  CircuitPoint,
  CircuitSector,
} from "./schema.js";

export { getCircuitById, groupCircuitCatalog } from "./registry.js";
