import { basename } from "node:path";

import { readText, resolveWorkspacePath } from "../io";
import { buildTurn } from "../text";
import type {
  NormalizedTurn,
  PlainLogSourceDefinition,
  SessionManifestEntry,
} from "../types";

export async function indexPlainLogs(
  definition: PlainLogSourceDefinition,
  cwd: string,
): Promise<{ manifestEntries: SessionManifestEntry[]; turns: NormalizedTurn[] }> {
  const manifestEntries: SessionManifestEntry[] = [];
  const turns: NormalizedTurn[] = [];

  for (const filePath of definition.filePaths) {
    const resolved = resolveWorkspacePath(cwd, filePath);
    const text = await readText(resolved);
    const lines = text.split(/\r?\n/);
    const sessionId = basename(resolved);
    let indexedTurns = 0;
    let usableTurns = 0;

    lines.forEach((line, index) => {
      if (!line.trim()) {
        return;
      }
      const turn = buildTurn({
        provider: "initiative-log",
        sourceId: definition.id,
        sessionId,
        turnId: `${sessionId}:${index + 1}`,
        timestamp: null,
        actor: "log",
        model: null,
        agentId: null,
        cwd: cwd,
        eventType: "log-line",
        text: line,
        stageId: definition.defaultStageId ?? null,
        sourcePath: resolved,
        sourceLine: index + 1,
        metadata: {},
      });
      indexedTurns += 1;
      if (!turn.noise) {
        usableTurns += 1;
      }
      turns.push(turn);
    });

    manifestEntries.push({
      provider: "initiative-log",
      sourceId: definition.id,
      sessionId,
      sourcePath: resolved,
      bytes: text.length,
      estimatedTokens: Math.ceil(text.length / 4),
      indexedTurns,
      usableTurns,
      firstTimestamp: null,
      lastTimestamp: null,
    });
  }

  return { manifestEntries, turns };
}
