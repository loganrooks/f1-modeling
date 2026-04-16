import { describe, expect, it } from "vitest";

import { approxTokensForBytes, approxTokensForText, buildTurn, inferStageId } from "./text";
import type { StageDefinition } from "./types";

const stages: StageDefinition[] = [
  {
    id: "wave-1",
    label: "Wave 1",
    start: "2026-04-10T00:00:00.000Z",
    end: "2026-04-10T23:59:59.999Z",
  },
  {
    id: "wave-2",
    label: "Wave 2",
    start: "2026-04-11T00:00:00.000Z",
    end: "2026-04-11T23:59:59.999Z",
  },
];

describe("transcript NLP text helpers", () => {
  it("approximates token counts conservatively", () => {
    expect(approxTokensForText("12345678")).toBe(2);
    expect(approxTokensForBytes(9)).toBe(3);
  });

  it("infers the matching stage from timestamps", () => {
    expect(inferStageId("2026-04-10T12:00:00.000Z", stages)).toBe("wave-1");
    expect(inferStageId("2026-04-12T12:00:00.000Z", stages, "fallback")).toBe("fallback");
  });

  it("marks known transcript noise without dropping meaningful user content", () => {
    const developerTurn = buildTurn({
      provider: "codex",
      sourceId: "fixture",
      sessionId: "session-1",
      turnId: "turn-1",
      timestamp: "2026-04-10T12:00:00.000Z",
      actor: "developer",
      model: "gpt-5.4",
      agentId: null,
      cwd: null,
      eventType: "response_item:message",
      text: "Developer instructions.",
      stageId: "wave-1",
      sourcePath: "/tmp/session.jsonl",
      sourceLine: 1,
      metadata: {},
    });
    expect(developerTurn.noise).toBe(true);
    expect(developerTurn.noiseReasons).toContain("developer-instructions");

    const commandTurn = buildTurn({
      provider: "claude",
      sourceId: "fixture",
      sessionId: "session-2",
      turnId: "turn-2",
      timestamp: "2026-04-10T12:00:00.000Z",
      actor: "system",
      model: null,
      agentId: null,
      cwd: null,
      eventType: "system:local_command",
      text: "<local-command-caveat>noop</local-command-caveat>",
      stageId: "wave-1",
      sourcePath: "/tmp/session.jsonl",
      sourceLine: 2,
      metadata: {},
    });
    expect(commandTurn.noise).toBe(true);
    expect(commandTurn.noiseReasons).toContain("local-command-caveat");

    const notificationTurn = buildTurn({
      provider: "codex",
      sourceId: "fixture",
      sessionId: "session-2",
      turnId: "turn-2b",
      timestamp: "2026-04-10T12:00:00.000Z",
      actor: "user",
      model: null,
      agentId: null,
      cwd: null,
      eventType: "event_msg:user_message",
      text: "<subagent_notification> completed",
      stageId: "wave-1",
      sourcePath: "/tmp/session.jsonl",
      sourceLine: 2,
      metadata: {},
    });
    expect(notificationTurn.noise).toBe(false);
    expect(notificationTurn.noiseReasons).toContain("subagent-notification");

    const subagentPromptTurn = buildTurn({
      provider: "claude",
      sourceId: "fixture",
      sessionId: "session-2/subagent-1",
      turnId: "turn-2c",
      timestamp: "2026-04-10T12:00:00.000Z",
      actor: "user",
      model: null,
      agentId: "subagent-1",
      cwd: null,
      eventType: "user",
      text: "Do the delegated task.",
      stageId: "wave-1",
      sourcePath: "/tmp/project/subagents/agent-1.jsonl",
      sourceLine: 1,
      metadata: {},
    });
    expect(subagentPromptTurn.noise).toBe(false);
    expect(subagentPromptTurn.noiseReasons).toContain("subagent-launch-prompt");

    const userTurn = buildTurn({
      provider: "claude",
      sourceId: "fixture",
      sessionId: "session-3",
      turnId: "turn-3",
      timestamp: "2026-04-10T12:00:00.000Z",
      actor: "user",
      model: null,
      agentId: null,
      cwd: null,
      eventType: "user",
      text: "This feels sloppy and too narrow. We need a formal audit.",
      stageId: "wave-1",
      sourcePath: "/tmp/session.jsonl",
      sourceLine: 3,
      metadata: {},
    });
    expect(userTurn.noise).toBe(false);
    expect(userTurn.text).toContain("formal audit");
  });
});
