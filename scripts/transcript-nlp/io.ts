import { createReadStream, promises as fs } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createInterface } from "node:readline";

export function expandHomePath(value: string): string {
  if (!value.startsWith("~/")) {
    return value;
  }
  const home = process.env.HOME;
  if (!home) {
    throw new Error("HOME is not set; cannot expand '~' paths.");
  }
  return join(home, value.slice(2));
}

export function resolveWorkspacePath(cwd: string, value: string): string {
  if (value.startsWith("~/")) {
    return expandHomePath(value);
  }
  return resolve(cwd, value);
}

export async function ensureDir(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true });
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function* readJsonLines(
  path: string,
): AsyncGenerator<{ lineNumber: number; value: Record<string, unknown> }> {
  const stream = createReadStream(path, { encoding: "utf8" });
  const reader = createInterface({ input: stream, crlfDelay: Infinity });
  let lineNumber = 0;
  for await (const line of reader) {
    lineNumber += 1;
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    try {
      yield {
        lineNumber,
        value: JSON.parse(trimmed) as Record<string, unknown>,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse JSONL at ${path}:${lineNumber}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

export async function readText(path: string): Promise<string> {
  return fs.readFile(path, "utf8");
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await ensureDir(dirname(path));
  await fs.writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeJsonl(
  path: string,
  rows: Iterable<Record<string, unknown>>,
): Promise<void> {
  await ensureDir(dirname(path));
  const chunks: string[] = [];
  for (const row of rows) {
    chunks.push(JSON.stringify(row));
  }
  await fs.writeFile(path, `${chunks.join("\n")}\n`, "utf8");
}

export async function readJsonFromFile<T>(path: string): Promise<T> {
  return JSON.parse(await readText(path)) as T;
}

export async function readJsonlFromFile<T>(path: string): Promise<T[]> {
  const rows: T[] = [];
  for await (const row of readJsonLines(path)) {
    rows.push(row.value as unknown as T);
  }
  return rows;
}

export async function listFilesRecursive(
  basePath: string,
  predicate: (path: string) => boolean,
): Promise<string[]> {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = join(basePath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursive(fullPath, predicate)));
      continue;
    }
    if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

export function fileStem(path: string): string {
  return basename(path, extname(path));
}

export function dateRangeDays(startDate: string, endDate: string): string[] {
  const values: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  while (cursor <= end) {
    values.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return values;
}
