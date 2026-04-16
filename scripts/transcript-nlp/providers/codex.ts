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

function mergeSourceRefs(turns: NormalizedTurn[]): NormalizedTurn["sourceRefs"] {
  const merged = new Map<string, NormalizedTurn["sourceRefs"][number]>();
  for (const turn of turns) {
    for (const ref of turn.sourceRefs) {
      merged.set(`${ref.sourceLine}:${ref.eventType}`, ref);
    }
  }
  return [...merged.values()].sort((left, right) => left.sourceLine - right.sourceLine);
}

function isResponseItem(turn: NormalizedTurn): boolean {
  return turn.eventType.startsWith("response_item:");
}

function isEventMessage(turn: NormalizedTurn): boolean {
  return turn.eventType.startsWith("event_msg:");
}

function areDuplicateCodexTurns(left: NormalizedTurn, right: NormalizedTurn): boolean {
  if (left.sessionId !== right.sessionId || left.actor !== right.actor || left.text !== right.text) {
    return false;
  }
  const crossKind =
    (isResponseItem(left) && isEventMessage(right)) ||
    (isEventMessage(left) && isResponseItem(right));
  if (!crossKind) {
    return false;
  }
  if (left.timestamp && right.timestamp && left.timestamp === right.timestamp) {
    return true;
  }
  return Math.abs(left.sourceLine - right.sourceLine) <= 2;
}

function mergeDuplicateCodexTurns(left: NormalizedTurn, right: NormalizedTurn): NormalizedTurn {
  const canonical =
    isResponseItem(left) && !isResponseItem(right)
      ? left
      : isResponseItem(right) && !isResponseItem(left)
      ? right
      : left;
  const secondary = canonical === left ? right : left;
  return {
    ...canonical,
    sourceRefs: mergeSourceRefs([canonical, secondary]),
    noise: canonical.noise && secondary.noise,
    noiseReasons: [...new Set([...canonical.noiseReasons, ...secondary.noiseReasons])],
  };
}

function dedupeCodexTurns(turns: NormalizedTurn[]): NormalizedTurn[] {
  const deduped: NormalizedTurn[] = [];
  for (const turn of turns) {
    const prior = deduped[deduped.length - 1];
    if (prior && areDuplicateCodexTurns(prior, turn)) {
      deduped[deduped.length - 1] = mergeDuplicateCodexTurns(prior, turn);
      continue;
    }
    deduped.push(turn);
  }
  return deduped;
}

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
    let currentModel: string | null = null;
    let sessionAgentNickname: string | null = null;
    let sessionIncluded = targetWorkspace === null;
    const sessionTurns: NormalizedTurn[] = [];

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
      sessionTurns.push(built);
    }

    if (!sessionIncluded) {
      continue;
    }

    const dedupedTurns = dedupeCodexTurns(sessionTurns);
    const indexedTurns = dedupedTurns.length;
    const usableTurns = dedupedTurns.filter((turn) => !turn.noise).length;
    const firstTimestamp = dedupedTurns.find((turn) => turn.timestamp)?.timestamp ?? null;
    const lastTimestamp = [...dedupedTurns]
      .reverse()
      .find((turn) => turn.timestamp)?.timestamp ?? null;
    turns.push(...dedupedTurns);

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
