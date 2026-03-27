import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  circuitDocumentSchema,
  type CircuitDocument,
} from "../circuits/schema.js";

/**
 * Loads all circuit document JSON files from a directory and validates
 * each against the circuit document schema.
 *
 * @param circuitsDir Absolute path to the directory containing circuit JSON files.
 * @returns Array of validated CircuitDocument objects.
 * @throws Error if any JSON file fails schema validation.
 */
export function loadCircuitCatalogFromDisk(
  circuitsDir: string,
): CircuitDocument[] {
  return readdirSync(circuitsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      const filePath = join(circuitsDir, entry.name);
      const rawDocument = JSON.parse(
        readFileSync(filePath, "utf8"),
      ) as unknown;
      const result = circuitDocumentSchema.safeParse(rawDocument);

      if (!result.success) {
        throw new Error(
          `Circuit file ${filePath} failed validation: ${result.error.message}`,
        );
      }

      return result.data;
    });
}
