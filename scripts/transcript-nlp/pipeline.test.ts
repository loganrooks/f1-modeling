import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { readJsonFromFile } from "./io";
import { runCandidates, runExtract, runIndex, runPipeline, runWindows } from "./pipeline";
import { buildTurn } from "./text";
import type {
  CoverageReport,
  LaneDefinition,
  NeglectReport,
  NormalizedTurn,
  PipelineConfig,
} from "./types";

async function writeJsonl(path: string, rows: unknown[]): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
}

async function writeText(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text, "utf8");
}

function buildLane(
  overrides: Partial<LaneDefinition> & Pick<LaneDefinition, "id" | "label" | "outputPath">,
): LaneDefinition {
  return {
    id: overrides.id,
    label: overrides.label,
    outputPath: overrides.outputPath,
    providerAllowlist: overrides.providerAllowlist ?? ["codex"],
    familyIds: overrides.familyIds ?? ["frustration_pushback", "authorization_delegation"],
    requiredFamilies: overrides.requiredFamilies ?? ["frustration_pushback"],
    requiredProviders: overrides.requiredProviders ?? ["codex"],
    requiredActors: overrides.requiredActors ?? [],
    requiredStages: overrides.requiredStages ?? [],
    contextBefore: overrides.contextBefore ?? 1,
    contextAfter: overrides.contextAfter ?? 1,
    maxMoments: overrides.maxMoments ?? 4,
    softTokenCap: overrides.softTokenCap ?? 160,
    preferredTokenTarget: overrides.preferredTokenTarget ?? 120,
    preferredOutputTokenTarget: overrides.preferredOutputTokenTarget ?? 600,
    notificationPolicy: overrides.notificationPolicy ?? "suppress",
    includeSubagentLaunchPrompts: overrides.includeSubagentLaunchPrompts ?? false,
    maxSelectedHitsPerFingerprint: overrides.maxSelectedHitsPerFingerprint ?? 1,
    maxSelectedHitsPerSession: overrides.maxSelectedHitsPerSession ?? 4,
  };
}

function buildConfig(
  lanes: LaneDefinition[],
  sourceOverrides?: Partial<PipelineConfig>,
): PipelineConfig {
  return {
    id: sourceOverrides?.id ?? "fixture",
    label: sourceOverrides?.label ?? "Fixture",
    outputRoot: sourceOverrides?.outputRoot ?? "artifacts/transcript-nlp",
    neglectReviewOutputPath:
      sourceOverrides?.neglectReviewOutputPath ?? "artifacts/extracts/NEGLECT-REVIEW.md",
    anchorTerms:
      sourceOverrides?.anchorTerms ?? ["formal audit", "boundary contract", "codex", "claude", "review gate"],
    stageDefinitions:
      sourceOverrides?.stageDefinitions ?? [
        {
          id: "trigger",
          label: "Trigger",
          start: "2026-04-10T00:00:00.000Z",
          end: "2026-04-10T23:59:59.999Z",
        },
      ],
    sources:
      sourceOverrides?.sources ?? [
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
    lanes,
  };
}

async function buildFixtureFiles(cwd: string): Promise<void> {
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
          message: "Make them all xhigh and compare Codex with Claude for the formal audit path.",
        },
      },
      {
        type: "response_item",
        timestamp: "2026-04-10T10:05:02.000Z",
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
        timestamp: "2026-04-10T10:05:02.000Z",
        payload: {
          type: "agent_message",
          message: "Codex can parallelize across agents while Claude handles the fallback audit review.",
        },
      },
      {
        type: "event_msg",
        timestamp: "2026-04-10T10:05:04.000Z",
        payload: {
          type: "agent_message",
          message: "<subagent_notification>{\"status\":\"completed\"}</subagent_notification> worker completed formal audit handoff.",
        },
      },
    ],
  );

  await writeText(
    join(cwd, "fixtures/logs/wave.log"),
    "2026-04-10 formal audit passed\n2026-04-10 positive collaboration noted between codex and claude\n",
  );
}

function manualTurn(
  overrides: Partial<NormalizedTurn> & Pick<NormalizedTurn, "provider" | "actor" | "eventType" | "text" | "sourcePath" | "sourceLine" | "sessionId" | "turnId">,
): NormalizedTurn {
  return buildTurn({
    provider: overrides.provider,
    sourceId: overrides.sourceId ?? "fixture",
    sessionId: overrides.sessionId,
    turnId: overrides.turnId,
    timestamp: overrides.timestamp ?? "2026-04-10T12:00:00.000Z",
    actor: overrides.actor,
    model: overrides.model ?? "gpt-5.4",
    agentId: overrides.agentId ?? null,
    cwd: overrides.cwd ?? null,
    eventType: overrides.eventType,
    text: overrides.text,
    stageId: overrides.stageId ?? "trigger",
    sourcePath: overrides.sourcePath,
    sourceLine: overrides.sourceLine,
    metadata: overrides.metadata ?? {},
  });
}

describe("transcript NLP pipeline", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })));
  });

  it("indexes fixture transcripts, dedupes codex pairs, and writes coverage plus neglect artifacts", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "transcript-nlp-"));
    tempDirs.push(cwd);
    await buildFixtureFiles(cwd);

    const lane = buildLane({
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
      requiredActors: ["user", "assistant"],
      notificationPolicy: "downrank",
      includeSubagentLaunchPrompts: true,
    });
    const config = buildConfig([lane]);

    const { manifestEntries, turns } = await runIndex(config, cwd);
    expect(manifestEntries).toHaveLength(3);
    const dedupedCodexTurn = turns.find((turn) =>
      turn.text.includes("Codex can parallelize across agents while Claude handles the fallback audit review."),
    );
    expect(dedupedCodexTurn).toBeDefined();
    expect(dedupedCodexTurn?.sourceRefs).toHaveLength(2);

    const { hits, coverage: candidateCoverage } = await runCandidates(config, "combined", cwd, turns);
    expect(candidateCoverage.candidateCoverage.missingFamilies).toEqual([]);
    expect(candidateCoverage.candidateCoverage.missingProviders).toEqual([]);

    const { windows, coverage: windowCoverage } = await runWindows(
      config,
      "combined",
      cwd,
      turns,
      hits,
    );
    expect(windows.length).toBeGreaterThan(0);
    expect(windowCoverage.totalWindowTokens).toBeLessThanOrEqual(160);
    expect(windowCoverage.selectedCoverage.missingActors).toEqual([]);

    const { outputPath } = await runExtract(config, "combined", cwd, windows, hits);
    const extract = await readFile(outputPath, "utf8");
    expect(extract).toContain("## Neglect Notes");
    expect(extract).toContain("notification policy");

    const queryManifest = await readJsonFromFile<{
      totalWindows: number;
      providers: string[];
      notificationPolicy: string;
    }>(join(cwd, "artifacts/transcript-nlp/lanes/combined/query-manifest.json"));
    expect(queryManifest.totalWindows).toBe(windows.length);
    expect(queryManifest.providers).toEqual(["claude", "codex", "initiative-log"]);
    expect(queryManifest.notificationPolicy).toBe("downrank");

    const neglectReport = await readJsonFromFile<NeglectReport>(
      join(cwd, "artifacts/transcript-nlp/lanes/combined/neglect-report.json"),
    );
    expect(neglectReport.findings.length).toBeGreaterThan(0);
    expect(
      neglectReport.findings.some((finding) => finding.code === "candidate-duplicate-fingerprints"),
    ).toBe(false);

    await runPipeline(config, cwd);
    const neglectReview = await readFile(join(cwd, "artifacts/extracts/NEGLECT-REVIEW.md"), "utf8");
    expect(neglectReview).toContain("# Transcript Neglect Review");
    expect(neglectReview).toContain("combined");
  });

  it("applies lane-specific notification and subagent-launch handling", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "transcript-nlp-"));
    tempDirs.push(cwd);

    const turns = [
      manualTurn({
        provider: "codex",
        actor: "assistant",
        eventType: "event_msg:agent_message",
        text: "<subagent_notification>{\"status\":\"completed\"}</subagent_notification> worker completed formal audit handoff.",
        sourcePath: "/tmp/codex.jsonl",
        sourceLine: 1,
        sessionId: "codex-session",
        turnId: "codex-1",
      }),
      manualTurn({
        provider: "claude",
        actor: "user",
        eventType: "user",
        text: "Delegate the subagent for the formal audit.",
        sourcePath: "/tmp/project/subagents/agent-1.jsonl",
        sourceLine: 1,
        sessionId: "claude-subagent",
        turnId: "claude-1",
      }),
    ];

    const config = buildConfig([
      buildLane({
        id: "suppress-notification",
        label: "Suppress Notification",
        outputPath: "artifacts/extracts/suppress.md",
        familyIds: ["authorization_delegation", "audit_protocol"],
        requiredFamilies: ["authorization_delegation"],
        notificationPolicy: "suppress",
      }),
      buildLane({
        id: "downrank-notification",
        label: "Downrank Notification",
        outputPath: "artifacts/extracts/downrank.md",
        familyIds: ["authorization_delegation", "audit_protocol"],
        requiredFamilies: ["authorization_delegation"],
        notificationPolicy: "downrank",
      }),
      buildLane({
        id: "include-launch",
        label: "Include Launch Prompt",
        outputPath: "artifacts/extracts/include-launch.md",
        providerAllowlist: ["claude"],
        requiredProviders: ["claude"],
        familyIds: ["authorization_delegation", "audit_protocol"],
        requiredFamilies: ["authorization_delegation"],
        includeSubagentLaunchPrompts: true,
        notificationPolicy: "include",
      }),
    ]);

    const suppressed = await runCandidates(config, "suppress-notification", cwd, turns);
    expect(suppressed.hits).toHaveLength(0);

    const downranked = await runCandidates(config, "downrank-notification", cwd, turns);
    expect(downranked.hits).toHaveLength(1);
    expect(downranked.hits[0]?.whyMatched.some((reason) => reason.includes("downranked"))).toBe(true);

    const launchIncluded = await runCandidates(config, "include-launch", cwd, turns);
    expect(launchIncluded.hits).toHaveLength(1);
    expect(launchIncluded.hits[0]?.noiseReasons).toContain("subagent-launch-prompt");
  });

  it("reports selected and emitted coverage gaps when session caps hide required actors", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "transcript-nlp-"));
    tempDirs.push(cwd);

    const turns = [
      manualTurn({
        provider: "codex",
        actor: "user",
        eventType: "event_msg:user_message",
        text: "This is sloppy and too narrow. Do the formal audit.",
        sourcePath: "/tmp/session.jsonl",
        sourceLine: 1,
        sessionId: "shared-session",
        turnId: "user-1",
      }),
      manualTurn({
        provider: "codex",
        actor: "assistant",
        eventType: "response_item:message",
        text: "You're right, let's do the formal audit.",
        sourcePath: "/tmp/session.jsonl",
        sourceLine: 2,
        sessionId: "shared-session",
        turnId: "assistant-1",
      }),
    ];
    const config = buildConfig([
      buildLane({
        id: "actor-gap",
        label: "Actor Gap",
        outputPath: "artifacts/extracts/actor-gap.md",
        familyIds: ["positive_collaboration", "frustration_pushback", "audit_protocol"],
        requiredFamilies: ["frustration_pushback"],
        requiredActors: ["user", "assistant"],
        maxSelectedHitsPerSession: 1,
      }),
    ]);

    const { hits, coverage: candidateCoverage } = await runCandidates(config, "actor-gap", cwd, turns);
    expect(candidateCoverage.candidateCoverage.missingActors).toEqual([]);

    const { windows } = await runWindows(config, "actor-gap", cwd, turns, hits);
    const { coverage } = await runExtract(config, "actor-gap", cwd, windows, hits);
    expect(coverage.selectedCoverage.missingActors).toEqual(["assistant"]);
    expect(coverage.emittedCoverage.missingActors).toEqual(["assistant"]);

    const neglectReport = await readJsonFromFile<NeglectReport>(
      join(cwd, "artifacts/transcript-nlp/lanes/actor-gap/neglect-report.json"),
    );
    expect(
      neglectReport.findings.some((finding) => finding.code === "selected-missing-actors"),
    ).toBe(true);
    expect(
      neglectReport.findings.some((finding) => finding.code === "emitted-missing-actors"),
    ).toBe(true);
  });

  it("records explicit neglect findings when budget trimming removes windows", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "transcript-nlp-"));
    tempDirs.push(cwd);

    const longText = "formal audit ".repeat(20);
    const turns = [
      manualTurn({
        provider: "codex",
        actor: "user",
        eventType: "event_msg:user_message",
        text: longText,
        sourcePath: "/tmp/session-a.jsonl",
        sourceLine: 1,
        sessionId: "session-a",
        turnId: "a-1",
      }),
      manualTurn({
        provider: "codex",
        actor: "assistant",
        eventType: "response_item:message",
        text: `You're right. ${longText}`,
        sourcePath: "/tmp/session-b.jsonl",
        sourceLine: 1,
        sessionId: "session-b",
        turnId: "b-1",
      }),
    ];
    const config = buildConfig([
      buildLane({
        id: "trimmed",
        label: "Trimmed",
        outputPath: "artifacts/extracts/trimmed.md",
        familyIds: ["positive_collaboration", "frustration_pushback", "audit_protocol"],
        requiredFamilies: ["positive_collaboration", "frustration_pushback"],
        requiredActors: ["user", "assistant"],
        softTokenCap: 100,
        maxSelectedHitsPerSession: 1,
      }),
    ]);

    const { hits } = await runCandidates(config, "trimmed", cwd, turns);
    const { windows } = await runWindows(config, "trimmed", cwd, turns, hits);
    expect(windows.length).toBe(1);

    await runExtract(config, "trimmed", cwd, windows, hits);
    const coverage = await readJsonFromFile<CoverageReport>(
      join(cwd, "artifacts/transcript-nlp/lanes/trimmed/coverage-report.json"),
    );
    expect(coverage.trimmedWindowCount).toBeGreaterThan(0);

    const neglectReport = await readJsonFromFile<NeglectReport>(
      join(cwd, "artifacts/transcript-nlp/lanes/trimmed/neglect-report.json"),
    );
    expect(
      neglectReport.findings.some((finding) => finding.code === "budget-trimming"),
    ).toBe(true);
  });
});
