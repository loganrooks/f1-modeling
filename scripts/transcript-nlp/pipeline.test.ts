import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { readJsonFromFile } from "./io";
import { runCandidates, runExtract, runIndex, runWindows } from "./pipeline";
import type { PipelineConfig } from "./types";

async function writeJsonl(path: string, rows: unknown[]): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
}

async function writeText(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text, "utf8");
}

function buildFixtureConfig(): PipelineConfig {
  return {
    id: "fixture",
    label: "Fixture",
    outputRoot: "artifacts/transcript-nlp",
    anchorTerms: ["formal audit", "boundary contract", "codex", "claude", "review gate"],
    stageDefinitions: [
      {
        id: "trigger",
        label: "Trigger",
        start: "2026-04-10T00:00:00.000Z",
        end: "2026-04-10T23:59:59.999Z",
      },
    ],
    sources: [
      {
        id: "claude-source",
        kind: "claude-project",
        provider: "claude",
        basePath: "fixtures/claude",
        startDate: "2026-04-10",
        endDate: "2026-04-10",
        includeTopLevelSessions: true,
        includeSubagentSessions: false,
      },
      {
        id: "codex-source",
        kind: "codex-sessions",
        provider: "codex",
        basePath: "fixtures/codex",
        startDate: "2026-04-10",
        endDate: "2026-04-10",
        workspacePath: ".",
      },
      {
        id: "log-source",
        kind: "plain-log",
        provider: "initiative-log",
        filePaths: ["fixtures/logs/wave.log"],
        defaultStageId: "trigger",
      },
    ],
    lanes: [
      {
        id: "combined",
        label: "Combined Interaction Extract",
        outputPath: "artifacts/extracts/combined.md",
        providerAllowlist: ["claude", "codex", "initiative-log"],
        familyIds: [
          "positive_collaboration",
          "frustration_pushback",
          "authorization_delegation",
          "audit_protocol",
          "review_gate_restructure",
          "model_role_shift",
          "agent_usage",
        ],
        requiredFamilies: [
          "positive_collaboration",
          "frustration_pushback",
          "audit_protocol",
          "model_role_shift",
        ],
        requiredProviders: ["claude", "codex"],
        contextBefore: 1,
        contextAfter: 1,
        maxMoments: 6,
        softTokenCap: 160,
        preferredTokenTarget: 120,
        preferredOutputTokenTarget: 600,
      },
    ],
  };
}

async function buildFixtures(cwd: string): Promise<void> {
  await writeJsonl(join(cwd, "fixtures/claude/session-main.jsonl"), [
    {
      type: "file-history-snapshot",
      files: [],
    },
    {
      type: "user",
      timestamp: "2026-04-10T10:00:00.000Z",
      uuid: "claude-user-1",
      cwd,
      message: {
        role: "user",
        content: "This feels sloppy and too narrow. We need a formal audit and a boundary contract.",
      },
    },
    {
      type: "system",
      timestamp: "2026-04-10T10:00:10.000Z",
      uuid: "claude-system-1",
      cwd,
      subtype: "local_command",
      content: "<local-command-caveat>noop</local-command-caveat>",
    },
    {
      type: "assistant",
      timestamp: "2026-04-10T10:01:00.000Z",
      uuid: "claude-assistant-1",
      cwd,
      message: {
        role: "assistant",
        model: "claude-3-7-sonnet",
        content: [
          { type: "text", text: "You're right. Let's do that and add a review gate." },
          { type: "tool_use", name: "search_query" },
          { type: "tool_result", content: "formal audit references collected" },
        ],
      },
    },
  ]);

  await writeJsonl(
    join(cwd, "fixtures/codex/2026/04/10/rollout-2026-04-10T10-05-00.jsonl"),
    [
      {
        type: "session_meta",
        timestamp: "2026-04-10T10:05:00.000Z",
        payload: {
          id: "codex-session-1",
          agent_nickname: "Nash",
          cwd,
        },
      },
      {
        type: "turn_context",
        timestamp: "2026-04-10T10:05:00.000Z",
        payload: {
          model: "gpt-5.4-mini",
        },
      },
      {
        type: "event_msg",
        timestamp: "2026-04-10T10:05:01.000Z",
        payload: {
          type: "user_message",
          message: "Make them all xhigh and compare Codex with Claude for the audit path.",
        },
      },
      {
        type: "event_msg",
        timestamp: "2026-04-10T10:05:01.500Z",
        payload: {
          type: "token_count",
          info: "ignore me",
        },
      },
      {
        type: "response_item",
        timestamp: "2026-04-10T10:05:02.000Z",
        payload: {
          type: "reasoning",
          summary: [],
          content: [],
        },
      },
      {
        type: "response_item",
        timestamp: "2026-04-10T10:05:03.000Z",
        payload: {
          id: "codex-response-1",
          type: "message",
          role: "assistant",
          content: [
            {
              text: "Codex can parallelize across agents while Claude handles the fallback audit review.",
            },
          ],
        },
      },
      {
        type: "event_msg",
        timestamp: "2026-04-10T10:05:04.000Z",
        payload: {
          type: "agent_message",
          message: "Nash completed spec A handoff.",
        },
      },
    ],
  );

  await writeJsonl(
    join(cwd, "fixtures/codex/2026/04/10/rollout-2026-04-10T10-06-00.jsonl"),
    [
      {
        type: "session_meta",
        timestamp: "2026-04-10T10:06:00.000Z",
        payload: {
          id: "codex-session-other",
          agent_nickname: "Other",
          cwd: "/tmp/another-project",
        },
      },
      {
        type: "event_msg",
        timestamp: "2026-04-10T10:06:01.000Z",
        payload: {
          type: "user_message",
          message: "This should be excluded by the workspace filter.",
        },
      },
    ],
  );

  await writeText(
    join(cwd, "fixtures/logs/wave.log"),
    "2026-04-10 formal audit passed\n2026-04-10 positive collaboration noted between codex and claude\n",
  );
}

describe("transcript NLP pipeline", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })));
  });

  it("indexes fixture transcripts and renders compact extract artifacts", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "transcript-nlp-"));
    tempDirs.push(cwd);
    await buildFixtures(cwd);

    const config = buildFixtureConfig();
    const { manifestEntries, turns } = await runIndex(config, cwd);
    expect(manifestEntries).toHaveLength(3);
    expect(turns.some((turn) => turn.provider === "claude")).toBe(true);
    expect(turns.some((turn) => turn.provider === "codex")).toBe(true);
    expect(turns.some((turn) => turn.provider === "initiative-log")).toBe(true);
    expect(turns.some((turn) => turn.text.includes("excluded by the workspace filter"))).toBe(false);
    expect(turns.some((turn) => turn.noiseReasons.includes("file-history-snapshot"))).toBe(true);
    expect(turns.some((turn) => turn.eventType.includes("token_count"))).toBe(false);

    const { hits, coverage: candidateCoverage } = await runCandidates(
      config,
      "combined",
      cwd,
      turns,
    );
    expect(hits.some((hit) => hit.provider === "claude")).toBe(true);
    expect(hits.some((hit) => hit.provider === "codex")).toBe(true);
    expect(candidateCoverage.missingFamilies).toEqual([]);
    expect(candidateCoverage.missingProviders).toEqual([]);

    const { windows, coverage: windowCoverage } = await runWindows(
      config,
      "combined",
      cwd,
      turns,
      hits,
    );
    expect(windows.length).toBeGreaterThan(0);
    expect(windowCoverage.totalWindowTokens).toBeLessThanOrEqual(160);
    expect(windowCoverage.selectedMoments).toBeGreaterThan(0);

    const { outputPath } = await runExtract(config, "combined", cwd, windows, hits);
    const extract = await readFile(outputPath, "utf8");
    expect(extract).toContain("# Combined Interaction Extract");
    expect(extract).toContain("## Query Manifest");
    expect(extract).toContain("formal audit");
    expect(extract).toContain("Why it matters");

    const queryManifest = await readJsonFromFile<{
      totalWindows: number;
      providers: string[];
    }>(join(cwd, "artifacts/transcript-nlp/lanes/combined/query-manifest.json"));
    expect(queryManifest.totalWindows).toBe(windows.length);
    expect(queryManifest.providers).toEqual(["claude", "codex", "initiative-log"]);
  });
});
