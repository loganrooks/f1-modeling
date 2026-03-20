import { z } from "zod";

const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const schemaVersionPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\/v[1-9]\d*$/;

export const nonEmptyStringSchema = z.string().trim().min(1);

export const documentIdSchema = z.string().trim().regex(identifierPattern, {
  message: "Expected a lowercase hyphenated identifier.",
});

export const schemaVersionSchema = z.string().trim().regex(schemaVersionPattern, {
  message: "Expected schema version in the form family/v1.",
});

export const isoTimestampSchema = z.string().datetime({ offset: true });

export function schemaVersion(family: string, version: number): string {
  if (!identifierPattern.test(family)) {
    throw new Error(
      `Invalid schema family "${family}". Expected a lowercase hyphenated identifier.`,
    );
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error(
      `Invalid schema version "${version}". Expected a positive integer.`,
    );
  }

  return `${family}/v${version}`;
}

export const scenarioDocumentSchemaVersion = schemaVersion(
  "scenario-document",
  1,
);
export const presetDocumentSchemaVersion = schemaVersion("preset-document", 1);
export const runRecordSchemaVersion = schemaVersion("run-record", 1);

export type DocumentId = z.infer<typeof documentIdSchema>;
export type IsoTimestamp = z.infer<typeof isoTimestampSchema>;
export type SchemaVersion = z.infer<typeof schemaVersionSchema>;
