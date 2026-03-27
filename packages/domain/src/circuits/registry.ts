import type { CircuitDocument } from "./schema.js";

/**
 * Groups an array of circuit documents into a Map keyed by circuitId.
 * If multiple documents share a circuitId, the last one wins.
 */
export function groupCircuitCatalog(
  documents: readonly CircuitDocument[],
): Map<string, CircuitDocument> {
  const catalog = new Map<string, CircuitDocument>();

  for (const document of documents) {
    catalog.set(document.circuitId, document);
  }

  return catalog;
}

/**
 * Finds a single circuit document by circuitId from an array of documents.
 */
export function getCircuitById(
  catalog: readonly CircuitDocument[],
  circuitId: string,
): CircuitDocument | undefined {
  return catalog.find((document) => document.circuitId === circuitId);
}
