import { basename, extname, join } from "node:path";

import {
  dateRangeDays,
  fileStem,
  listFilesRecursive,
  readJsonLines,
  resolveWorkspacePath,
} from "../io";
import { buildTurn, inferStageId } from "../text";
import type {
  CodexSessionsSourceDefinition,
  NormalizedTurn,
  SessionManifestEntry,
  StageDefinition,
} from "../types";

function extractCodexText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return "";
      }
      const typed = entry as Record<string, unknown>;
      if (typeof typed.text === "string") {
        return typed.text;
      }
      if (typeof typed.type === "string" && typed.type === "tool_use") {
        const name = typeof typed.name === "string" ? typed.name : "tool";
        return `[tool_use:${name}]`;
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

function collectCodexFiles(
  definition: CodexSessionsSourceDefinition,
  cwd: string,
): Promise<string[]> {
  const basePath = resolveWorkspacePath(cwd, definition.basePath);
  const days = dateRangeDays(definition.startDate, definition.endDate);
  return Promise.all(
    days.map(async (day) => {
      const [year, month, date] = day.split("-");
      const dir = join(basePath, year, month, date);
      try {
        return await listFilesRecursive(dir, (path) => path.endsWith(".jsonl"));
      } catch {
        return [];
      }
    }),
  ).then((groups) => groups.flat().sort());
}

function matchesWorkspace(targetWorkspace: string | null, sessionCwd: string | null): boolean {
  if (!targetWorkspace) {
    return true;
  }
  if (!sessionCwd) {
    return false;
  }
  return sessionCwd === targetWorkspace || sessionCwd.startsWith(`${targetWorkspace}/`);
}

export async function indexCodexSessions(
  definition: CodexSessionsSourceDefinition,
  cwd: string,
  stages: StageDefinition[],
): Promise<{ manifestEntries: SessionManifestEntry[]; turns: NormalizedTurn[] }> {
  const files = await collectCodexFiles(definition, cwd);
  const manifestEntries: SessionManifestEntry[] = [];
  const turns: NormalizedTurn[] = [];
  const targetWorkspace = definition.workspacePath
    ? resolveWorkspacePath(cwd, definition.workspacePath)
    : null;

  for (const path of files) {
    const stat = await import("node:fs/promises").then((fs) => fs.stat(path));
    const sessionId = fileStem(path);
    let indexedTurns = 0;
    let usableTurns = 0;
    let firstTimestamp: string | null = null;
    let lastTimestamp: string | null = null;
    let currentModel: string | null = null;
    let sessionAgentNickname: string | null = null;
    let sessionIncluded = targetWorkspace === null;

    for await (const row of readJsonLines(path)) {
      const entryType = typeof row.value.type === "string" ? row.value.type : "unknown";
      let built: NormalizedTurn | null = null;

      if (entryType === "session_meta") {
        const payload =
          row.value.payload && typeof row.value.payload === "object"
            ? (row.value.payload as Record<string, unknown>)
            : {};
        sessionAgentNickname =
          typeof payload.agent_nickname === "string"
            ? payload.agent_nickname
            : null;
        const sessionCwd =
          typeof payload.cwd === "string"
            ? resolveWorkspacePath(cwd, payload.cwd)
            : null;
        sessionIncluded = matchesWorkspace(targetWorkspace, sessionCwd);
        if (!sessionIncluded) {
          break;
        }
        continue;
      }

      if (!sessionIncluded) {
        continue;
      }

      if (entryType === "turn_context") {
        const payload =
          row.value.payload && typeof row.value.payload === "object"
            ? (row.value.payload as Record<string, unknown>)
            : {};
        currentModel = typeof payload.model === "string" ? payload.model : currentModel;
        continue;
      }

      if (entryType === "response_item") {
        const payload =
          row.value.payload && typeof row.value.payload === "object"
            ? (row.value.payload as Record<string, unknown>)
            : {};
        if (payload.type === "reasoning") {
          continue;
        }
        const role =
          typeof payload.role === "string" ? payload.role : "assistant";
        const actor =
          role === "developer"
            ? "developer"
            : role === "assistant"
            ? "assistant"
            : "user";
        built = buildTurn({
          provider: "codex",
          sourceId: definition.id,
          sessionId,
          turnId:
            typeof payload.id === "string"
              ? payload.id
              : `${sessionId}:${row.lineNumber}`,
          timestamp:
            typeof row.value.timestamp === "string" ? row.value.timestamp : null,
          actor,
          model: currentModel,
          agentId: sessionAgentNickname,
          cwd: null,
          eventType:
            typeof payload.type === "string"
              ? `response_item:${payload.type}`
              : "response_item",
          text: extractCodexText(payload.content),
          stageId: inferStageId(
            typeof row.value.timestamp === "string" ? row.value.timestamp : null,
            stages,
          ),
          sourcePath: path,
          sourceLine: row.lineNumber,
          metadata: {
            role,
          },
        });
      } else if (entryType === "event_msg") {
        const payload =
          row.value.payload && typeof row.value.payload === "object"
            ? (row.value.payload as Record<string, unknown>)
            : {};
        const message =
          typeof payload.message === "string" ? payload.message : "";
        const textElements = Array.isArray(payload.text_elements)
          ? payload.text_elements.filter((item): item is string => typeof item === "string")
          : [];
        const combined = [message, ...textElements].filter(Boolean).join(" ");
        if (!combined.trim()) {
          continue;
        }
        const eventTypeName =
          typeof payload.type === "string" ? payload.type : "event_msg";
        const actor =
          eventTypeName === "user_message"
            ? "user"
            : eventTypeName === "agent_message"
            ? "assistant"
            : "system";
        built = buildTurn({
          provider: "codex",
          sourceId: definition.id,
          sessionId,
          turnId: `${sessionId}:${row.lineNumber}`,
          timestamp:
            typeof row.value.timestamp === "string" ? row.value.timestamp : null,
          actor,
          model: currentModel,
          agentId: sessionAgentNickname,
          cwd: null,
          eventType: `event_msg:${eventTypeName}`,
          text: combined,
          stageId: inferStageId(
            typeof row.value.timestamp === "string" ? row.value.timestamp : null,
            stages,
          ),
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

    if (!sessionIncluded) {
      continue;
    }

    manifestEntries.push({
      provider: "codex",
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
