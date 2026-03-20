import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function normalizeJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJsonValue(entry));
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((normalized, key) => {
        normalized[key] = normalizeJsonValue(
          (value as Record<string, unknown>)[key],
        );
        return normalized;
      }, {});
  }

  return value;
}

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });

  const normalized = normalizeJsonValue(value);
  const contents = `${JSON.stringify(normalized, null, 2)}\n`;

  await writeFile(filePath, contents, "utf8");
}

export async function listJsonFiles<T>(directoryPath: string): Promise<T[]> {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const fileNames = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));

    const documents = await Promise.all(
      fileNames.map((fileName) => readJsonFile<T>(join(directoryPath, fileName))),
    );

    const existingDocuments: T[] = [];

    for (const document of documents) {
      if (document !== null) {
        existingDocuments.push(document);
      }
    }

    return existingDocuments;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}
