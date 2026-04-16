import type { Actor, NormalizedTurn, StageDefinition } from "./types";

const INDEX_TEXT_LIMIT = 2_000;
const PREVIEW_TEXT_LIMIT = 180;
const HARD_NOISE_REASONS = new Set([
  "empty-text",
  "developer-instructions",
  "file-history-snapshot",
  "local-command-caveat",
  "command-shell-noise",
  "local-command-stdout",
  "environment-context",
  "agents-instructions",
  "permissions-instructions",
  "task-notification",
  "token-count",
]);

export function approxTokensForText(text: string): number {
  return Math.ceil(text.length / 4);
}

export function approxTokensForBytes(bytes: number): number {
  return Math.ceil(bytes / 4);
}

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function clipForIndex(value: string): string {
  return value.length <= INDEX_TEXT_LIMIT ? value : `${value.slice(0, INDEX_TEXT_LIMIT - 1)}…`;
}

export function buildPreview(value: string, limit = PREVIEW_TEXT_LIMIT): string {
  const collapsed = collapseWhitespace(value);
  return collapsed.length <= limit ? collapsed : `${collapsed.slice(0, limit - 1)}…`;
}

export function detectNoise(
  actor: Actor,
  eventType: string,
  text: string,
): string[] {
  const reasons: string[] = [];
  if (!text.trim()) {
    reasons.push("empty-text");
  }
  if (actor === "developer") {
    reasons.push("developer-instructions");
  }
  if (eventType === "file-history-snapshot") {
    reasons.push("file-history-snapshot");
  }
  if (/^<local-command-caveat>/i.test(text)) {
    reasons.push("local-command-caveat");
  }
  if (/^<command-name>\/(clear|exit)<\/command-name>/i.test(text)) {
    reasons.push("command-shell-noise");
  }
  if (/^<local-command-stdout>/i.test(text)) {
    reasons.push("local-command-stdout");
  }
  if (/^<environment_context>/i.test(text)) {
    reasons.push("environment-context");
  }
  if (/^# AGENTS\.md instructions/i.test(text)) {
    reasons.push("agents-instructions");
  }
  if (/^<permissions instructions>/i.test(text)) {
    reasons.push("permissions-instructions");
  }
  if (/^<task-notification>/i.test(text)) {
    reasons.push("task-notification");
  }
  if (/^<subagent_notification>/i.test(text)) {
    reasons.push("subagent-notification");
  }
  if (eventType.endsWith(":token_count")) {
    reasons.push("token-count");
  }
  return reasons;
}

export function inferStageId(
  timestamp: string | null,
  stages: StageDefinition[],
  fallbackStageId?: string,
): string | null {
  if (!timestamp) {
    return fallbackStageId ?? null;
  }
  const millis = Date.parse(timestamp);
  if (Number.isNaN(millis)) {
    return fallbackStageId ?? null;
  }
  for (const stage of stages) {
    const start = Date.parse(stage.start);
    const end = Date.parse(stage.end);
    if (millis >= start && millis <= end) {
      return stage.id;
    }
  }
  return fallbackStageId ?? null;
}

export function buildTurn(
  turn: Omit<NormalizedTurn, "textLength" | "noise" | "noiseReasons" | "sourceRefs">,
): NormalizedTurn {
  const cleaned = clipForIndex(collapseWhitespace(turn.text));
  const noiseReasons = detectNoise(turn.actor, turn.eventType, cleaned);
  if (
    turn.actor === "user" &&
    turn.sourceLine === 1 &&
    turn.sourcePath.includes("/subagents/")
  ) {
    noiseReasons.push("subagent-launch-prompt");
  }
  return {
    ...turn,
    text: cleaned,
    textLength: cleaned.length,
    noise: noiseReasons.some((reason) => HARD_NOISE_REASONS.has(reason)),
    noiseReasons,
    sourceRefs: [
      {
        sourceLine: turn.sourceLine,
        eventType: turn.eventType,
        timestamp: turn.timestamp,
      },
    ],
  };
}
