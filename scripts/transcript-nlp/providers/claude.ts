import { basename, dirname, extname, join } from "node:path";

import { listFilesRecursive, readJsonLines, resolveWorkspacePath } from "../io";
import { buildTurn, inferStageId } from "../text";
import type {
  ClaudeProjectSourceDefinition,
  NormalizedTurn,
  SessionManifestEntry,
  StageDefinition,
} from "../types";

function inDateRange(timestamp: string | null, startDate: string, endDate: string): boolean {
  if (!timestamp) {
    return false;
  }
  const day = timestamp.slice(0, 10);
  return day >= startDate && day <= endDate;
}

function flattenUnknown(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => flattenUnknown(item)).filter(Boolean).join(" ");
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => flattenUnknown(item))
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function flattenClaudeContent(
  content: unknown,
): { text: string; actorOverride?: "tool" } {
  if (typeof content === "string") {
    return { text: content };
  }
  if (!Array.isArray(content)) {
    return { text: flattenUnknown(content) };
  }
  const chunks: string[] = [];
  let toolResultOnly = content.length > 0;
  for (const entry of content) {
    if (!entry || typeof entry !== "object") {
      chunks.push(flattenUnknown(entry));
      toolResultOnly = false;
      continue;
    }
    const typed = entry as Record<string, unknown>;
    const entryType = typeof typed.type === "string" ? typed.type : "unknown";
    if (entryType !== "tool_result") {
      toolResultOnly = false;
    }
    if (entryType === "text" && typeof typed.text === "string") {
      chunks.push(typed.text);
      continue;
    }
    if (entryType === "tool_use") {
      const name = typeof typed.name === "string" ? typed.name : "unknown-tool";
      chunks.push(`[tool_use:${name}]`);
      continue;
    }
    if (entryType === "tool_result") {
      chunks.push(`[tool_result] ${flattenUnknown(typed.content)}`);
      continue;
    }
    chunks.push(flattenUnknown(typed));
  }
  return {
    text: chunks.filter(Boolean).join(" "),
    actorOverride: toolResultOnly ? "tool" : undefined,
  };
}

async function collectClaudeFiles(
  definition: ClaudeProjectSourceDefinition,
  cwd: string,
): Promise<string[]> {
  const basePath = resolveWorkspacePath(cwd, definition.basePath);
  const topLevelFiles = definition.includeTopLevelSessions
    ? (await listFilesRecursive(basePath, (path) => {
        const parent = dirname(path);
        return parent === basePath && path.endsWith(".jsonl");
      }))
    : [];
  const subagentFiles = definition.includeSubagentSessions
    ? (await listFilesRecursive(basePath, (path) =>
        path.includes("/subagents/") && path.endsWith(".jsonl"),
      ))
    : [];
  return [...new Set([...topLevelFiles, ...subagentFiles])].sort();
}

export async function indexClaudeProject(
  definition: ClaudeProjectSourceDefinition,
  cwd: string,
  stages: StageDefinition[],
): Promise<{ manifestEntries: SessionManifestEntry[]; turns: NormalizedTurn[] }> {
  const files = await collectClaudeFiles(definition, cwd);
  const manifestEntries: SessionManifestEntry[] = [];
  const turns: NormalizedTurn[] = [];

  for (const path of files) {
    const stat = await import("node:fs/promises").then((fs) => fs.stat(path));
    const parts = path.split("/");
    const isSubagent = path.includes("/subagents/");
    const sessionStem = basename(path, extname(path));
    const parentSession = isSubagent ? parts[parts.length - 3] : sessionStem;
    const sessionId = isSubagent ? `${parentSession}/${sessionStem}` : sessionStem;
    const agentId = isSubagent ? sessionStem : null;
    let indexedTurns = 0;
    let usableTurns = 0;
    let firstTimestamp: string | null = null;
    let lastTimestamp: string | null = null;

    for await (const row of readJsonLines(path)) {
      const entryType = typeof row.value.type === "string" ? row.value.type : "unknown";
      let built: NormalizedTurn | null = null;

      if (entryType === "assistant" || entryType === "user") {
        const message =
          row.value.message && typeof row.value.message === "object"
            ? (row.value.message as Record<string, unknown>)
            : {};
        const flattened = flattenClaudeContent(message.content);
        const actor =
          flattened.actorOverride ??
          (entryType === "assistant" ? "assistant" : "user");
        const timestamp =
          typeof row.value.timestamp === "string" ? row.value.timestamp : null;
        if (!inDateRange(timestamp, definition.startDate, definition.endDate)) {
          continue;
        }
        built = buildTurn({
          provider: "claude",
          sourceId: definition.id,
          sessionId,
          turnId: typeof row.value.uuid === "string" ? row.value.uuid : `${sessionId}:${row.lineNumber}`,
          timestamp,
          actor,
          model:
            typeof message.model === "string"
              ? message.model
              : null,
          agentId,
          cwd:
            typeof row.value.cwd === "string" ? row.value.cwd : null,
          eventType: entryType,
          text: flattened.text,
          stageId: inferStageId(timestamp, stages),
          sourcePath: path,
          sourceLine: row.lineNumber,
          metadata: {
            role: typeof message.role === "string" ? message.role : entryType,
          },
        });
      } else if (entryType === "system") {
        const timestamp =
          typeof row.value.timestamp === "string" ? row.value.timestamp : null;
        if (!inDateRange(timestamp, definition.startDate, definition.endDate)) {
          continue;
        }
        built = buildTurn({
          provider: "claude",
          sourceId: definition.id,
          sessionId,
          turnId: typeof row.value.uuid === "string" ? row.value.uuid : `${sessionId}:${row.lineNumber}`,
          timestamp,
          actor: "system",
          model: null,
          agentId,
          cwd:
            typeof row.value.cwd === "string" ? row.value.cwd : null,
          eventType:
            typeof row.value.subtype === "string"
              ? `system:${row.value.subtype}`
              : "system",
          text:
            typeof row.value.content === "string"
              ? row.value.content
              : flattenUnknown(row.value.content),
          stageId: inferStageId(timestamp, stages),
          sourcePath: path,
          sourceLine: row.lineNumber,
          metadata: {},
        });
      } else if (entryType === "attachment") {
        const timestamp =
          typeof row.value.timestamp === "string" ? row.value.timestamp : null;
        if (!inDateRange(timestamp, definition.startDate, definition.endDate)) {
          continue;
        }
        const attachment =
          row.value.attachment && typeof row.value.attachment === "object"
            ? (row.value.attachment as Record<string, unknown>)
            : {};
        const attachmentType =
          typeof attachment.type === "string" ? attachment.type : "attachment";
        built = buildTurn({
          provider: "claude",
          sourceId: definition.id,
          sessionId,
          turnId: typeof row.value.uuid === "string" ? row.value.uuid : `${sessionId}:${row.lineNumber}`,
          timestamp,
          actor: "attachment",
          model: null,
          agentId,
          cwd:
            typeof row.value.cwd === "string" ? row.value.cwd : null,
          eventType: `attachment:${attachmentType}`,
          text: flattenUnknown(attachment),
          stageId: inferStageId(timestamp, stages),
          sourcePath: path,
          sourceLine: row.lineNumber,
          metadata: {},
        });
      } else if (entryType === "file-history-snapshot") {
        built = buildTurn({
          provider: "claude",
          sourceId: definition.id,
          sessionId,
          turnId:
            typeof row.value.messageId === "string"
              ? row.value.messageId
              : `${sessionId}:${row.lineNumber}`,
          timestamp: null,
          actor: "system",
          model: null,
          agentId,
          cwd: null,
          eventType: "file-history-snapshot",
          text: "Snapshot update",
          stageId: null,
          sourcePath: path,
          sourceLine: row.lineNumber,
          metadata: {},
        });
      }

      if (!built) {
        continue;
      }
      indexedTurns += 1;
      if (!built.noise) {
        usableTurns += 1;
      }
      if (built.timestamp) {
        firstTimestamp ??= built.timestamp;
        lastTimestamp = built.timestamp;
      }
      turns.push(built);
    }

    manifestEntries.push({
      provider: "claude",
      sourceId: definition.id,
      sessionId,
      sourcePath: path,
      bytes: stat.size,
      estimatedTokens: Math.ceil(stat.size / 4),
      indexedTurns,
      usableTurns,
      firstTimestamp,
      lastTimestamp,
    });
  }

  return { manifestEntries, turns };
}
