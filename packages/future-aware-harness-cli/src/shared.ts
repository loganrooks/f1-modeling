import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export function sha256Text(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export async function sha256File(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return createHash("sha256").update(content).digest("hex");
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export async function writeJsonFile(
  filePath: string,
  value: unknown,
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeTextFile(
  filePath: string,
  content: string,
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function copyFileEnsureDir(
  sourcePath: string,
  destinationPath: string,
): Promise<void> {
  await ensureDir(path.dirname(destinationPath));
  await fs.copyFile(sourcePath, destinationPath);
}

export function expandHome(inputPath: string): string {
  const home = process.env.HOME;
  if (!home) {
    return inputPath;
  }

  if (inputPath.startsWith("$HOME/")) {
    return path.join(home, inputPath.slice("$HOME/".length));
  }

  if (inputPath === "$HOME") {
    return home;
  }

  if (inputPath.startsWith("~/")) {
    return path.join(home, inputPath.slice(2));
  }

  if (inputPath === "~") {
    return home;
  }

  return inputPath;
}

export function isoTimestamp(date = new Date()): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function compactTimestamp(date = new Date()): string {
  return isoTimestamp(date)
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function renderTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, rawKey: string) => {
    const value = variables[rawKey];
    return value === undefined ? match : value;
  });
}

export function markerBegin(sectionId: string): string {
  return `<!-- future-aware-harness:begin ${sectionId} -->`;
}

export function markerEnd(sectionId: string): string {
  return `<!-- future-aware-harness:end ${sectionId} -->`;
}

export function buildManagedSection(sectionId: string, body: string): string {
  return `${markerBegin(sectionId)}\n${body.trimEnd()}\n${markerEnd(sectionId)}`;
}

export function normalizeNewlines(content: string): string {
  return content.replace(/\r\n/g, "\n");
}

export function todayDate(date = new Date()): string {
  return isoTimestamp(date).slice(0, 10);
}
