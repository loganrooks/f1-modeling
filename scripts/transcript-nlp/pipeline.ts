import { dirname, join, relative, resolve } from "node:path";

import { ensureDir, readJsonFromFile, readJsonlFromFile, writeJson, writeJsonl } from "./io";
import { QUERY_FAMILY_MAP } from "./queryFamilies";
import { approxTokensForText, buildPreview, collapseWhitespace } from "./text";
import type {
  Actor,
  CandidateHit,
  CoverageReport,
  CoverageSlice,
  ExcerptWindow,
  ExcerptWindowTurn,
  LaneDefinition,
  NeglectFinding,
  NeglectReport,
  NormalizedTurn,
  PipelineConfig,
  Provider,
  QueryFamily,
  QueryManifest,
  SessionManifestEntry,
} from "./types";
import { indexClaudeProject } from "./providers/claude";
import { indexCodexSessions } from "./providers/codex";
import { indexPlainLogs } from "./providers/log";

interface IndexArtifacts {
  manifestEntries: SessionManifestEntry[];
  turns: NormalizedTurn[];
}

const PROGRESS_CHATTER_PATTERNS = [
  /\bi(?:'|’)m dispatching\b/i,
  /\bi(?:'|’)m now checking\b/i,
  /\bi(?:'|’)m patching\b/i,
  /\bi(?:'|’)m reading\b/i,
  /\bone more structural improvement\b/i,
  /\bi(?:'|’)ll wait for\b/i,
];

function laneById(config: PipelineConfig, laneId: string): LaneDefinition {
  const lane = config.lanes.find((entry) => entry.id === laneId);
  if (!lane) {
    throw new Error(
      `Unknown lane "${laneId}" for config "${config.id}". Known lanes: ${config.lanes
        .map((entry) => entry.id)
        .join(", ")}`,
    );
  }
  return lane;
}

function normalizedDir(config: PipelineConfig, cwd: string): string {
  return resolve(cwd, config.outputRoot, "normalized");
}

function laneDir(config: PipelineConfig, laneId: string, cwd: string): string {
  return resolve(cwd, config.outputRoot, "lanes", laneId);
}

function manifestPath(config: PipelineConfig, cwd: string): string {
  return join(normalizedDir(config, cwd), "manifest.json");
}

function turnsPath(config: PipelineConfig, cwd: string): string {
  return join(normalizedDir(config, cwd), "turns.jsonl");
}

function candidateHitsPath(config: PipelineConfig, laneId: string, cwd: string): string {
  return join(laneDir(config, laneId, cwd), "candidate-hits.jsonl");
}

function windowsPath(config: PipelineConfig, laneId: string, cwd: string): string {
  return join(laneDir(config, laneId, cwd), "excerpt-windows.jsonl");
}

function coveragePath(config: PipelineConfig, laneId: string, cwd: string): string {
  return join(laneDir(config, laneId, cwd), "coverage-report.json");
}

function queryManifestPath(config: PipelineConfig, laneId: string, cwd: string): string {
  return join(laneDir(config, laneId, cwd), "query-manifest.json");
}

function neglectPath(config: PipelineConfig, laneId: string, cwd: string): string {
  return join(laneDir(config, laneId, cwd), "neglect-report.json");
}

function extractOutputPath(config: PipelineConfig, lane: LaneDefinition, cwd: string): string {
  return resolve(cwd, lane.outputPath);
}

function neglectReviewPath(config: PipelineConfig, cwd: string): string | null {
  return config.neglectReviewOutputPath
    ? resolve(cwd, config.neglectReviewOutputPath)
    : null;
}

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function emptyCoverageSlice(lane: LaneDefinition): CoverageSlice {
  return {
    totalHits: 0,
    countsByFamily: {},
    countsByProvider: {},
    countsByActor: {},
    countsByStage: {},
    missingFamilies: [...lane.requiredFamilies],
    missingProviders: [...lane.requiredProviders],
    missingActors: [...(lane.requiredActors ?? [])],
    missingStages: [...(lane.requiredStages ?? [])],
  };
}

function buildCoverageSlice(hits: CandidateHit[], lane: LaneDefinition): CoverageSlice {
  const countsByFamily = countBy(hits.flatMap((hit) => hit.matchedFamilies));
  const countsByProvider = countBy(hits.map((hit) => hit.provider));
  const countsByActor = countBy(hits.map((hit) => hit.actor));
  const countsByStage = countBy(hits.map((hit) => hit.stageId ?? "unassigned"));
  return {
    totalHits: hits.length,
    countsByFamily,
    countsByProvider,
    countsByActor,
    countsByStage,
    missingFamilies: lane.requiredFamilies.filter((familyId) => !countsByFamily[familyId]),
    missingProviders: lane.requiredProviders.filter((provider) => !countsByProvider[provider]),
    missingActors: (lane.requiredActors ?? []).filter((actor) => !countsByActor[actor]),
    missingStages: (lane.requiredStages ?? []).filter((stageId) => !countsByStage[stageId]),
  };
}

function anchorMatches(text: string, anchorTerms: string[]): string[] {
  const lowered = text.toLowerCase();
  return anchorTerms.filter((term) => lowered.includes(term.toLowerCase()));
}

function notificationPolicy(lane: LaneDefinition): NonNullable<LaneDefinition["notificationPolicy"]> {
  return lane.notificationPolicy ?? "suppress";
}

function shouldSuppressTurnForLane(turn: NormalizedTurn, lane: LaneDefinition): boolean {
  if (turn.noise || !lane.providerAllowlist.includes(turn.provider)) {
    return true;
  }
  if (
    turn.noiseReasons.includes("subagent-notification") &&
    notificationPolicy(lane) === "suppress"
  ) {
    return true;
  }
  if (
    turn.noiseReasons.includes("subagent-launch-prompt") &&
    !lane.includeSubagentLaunchPrompts
  ) {
    return true;
  }
  return false;
}

function evaluateTurnPenalty(
  turn: NormalizedTurn,
  lane: LaneDefinition,
): { penalty: number; reasons: string[] } {
  let penalty = 0;
  const reasons: string[] = [];
  if (
    turn.noiseReasons.includes("subagent-notification") &&
    notificationPolicy(lane) === "downrank"
  ) {
    penalty += 2;
    reasons.push("downranked subagent notification");
  }
  if (turn.noiseReasons.includes("subagent-launch-prompt") && lane.includeSubagentLaunchPrompts) {
    penalty += 1;
    reasons.push("downranked subagent launch prompt");
  }
  if (PROGRESS_CHATTER_PATTERNS.some((pattern) => pattern.test(turn.text))) {
    penalty += 2;
    reasons.push("downranked generic progress chatter");
  }
  return { penalty, reasons };
}

function evaluateTurnAgainstFamilies(
  turn: NormalizedTurn,
  lane: LaneDefinition,
  families: QueryFamily[],
  anchorTerms: string[],
): {
  score: number;
  matchedFamilies: string[];
  matchedAnchors: string[];
  whyMatched: string[];
} {
  let score = 0;
  const matchedFamilies: string[] = [];
  const whyMatched: string[] = [];
  for (const family of families) {
    if (family.actorAllowlist && !family.actorAllowlist.includes(turn.actor)) {
      continue;
    }
    if (family.providerAllowlist && !family.providerAllowlist.includes(turn.provider)) {
      continue;
    }
    const matches = family.patterns.filter((pattern) => pattern.test(turn.text));
    if (!matches.length) {
      continue;
    }
    matchedFamilies.push(family.id);
    score += family.baseScore + matches.length - 1;
    whyMatched.push(`${family.id} (${matches.length} match${matches.length === 1 ? "" : "es"})`);
  }
  const matchedAnchors = anchorMatches(turn.text, anchorTerms);
  if (matchedAnchors.length > 0) {
    score += Math.min(2, matchedAnchors.length);
    whyMatched.push(
      `${matchedAnchors.length} anchor term${matchedAnchors.length === 1 ? "" : "s"}`,
    );
  }
  if (turn.actor === "user" && matchedFamilies.includes("frustration_pushback")) {
    score += 1;
  }
  const penalty = evaluateTurnPenalty(turn, lane);
  if (penalty.penalty > 0) {
    score = Math.max(1, score - penalty.penalty);
    whyMatched.push(...penalty.reasons);
  }
  return { score, matchedFamilies, matchedAnchors, whyMatched };
}

function buildCandidateFingerprint(turn: NormalizedTurn): string {
  return `${turn.provider}:${turn.sessionId}:${turn.actor}:${collapseWhitespace(turn.text).toLowerCase()}`;
}

function sessionKeyForHit(hit: CandidateHit): string {
  return `${hit.provider}:${hit.sessionId}`;
}

function selectHitsForLane(hits: CandidateHit[], lane: LaneDefinition): CandidateHit[] {
  const sorted = [...hits].sort((left, right) => right.score - left.score || left.sourceLine - right.sourceLine);
  const selected: CandidateHit[] = [];
  const seenIds = new Set<string>();
  const selectedFingerprints = new Map<string, number>();
  const selectedSessions = new Map<string, number>();
  const maxPerFingerprint = lane.maxSelectedHitsPerFingerprint ?? 1;
  const maxPerSession = lane.maxSelectedHitsPerSession ?? Number.MAX_SAFE_INTEGER;

  const canSelect = (candidate: CandidateHit): boolean => {
    if (seenIds.has(candidate.id)) {
      return false;
    }
    if ((selectedFingerprints.get(candidate.fingerprint) ?? 0) >= maxPerFingerprint) {
      return false;
    }
    if ((selectedSessions.get(sessionKeyForHit(candidate)) ?? 0) >= maxPerSession) {
      return false;
    }
    return true;
  };

  const pushIfUseful = (candidate: CandidateHit | undefined) => {
    if (!candidate || !canSelect(candidate)) {
      return;
    }
    selected.push(candidate);
    seenIds.add(candidate.id);
    selectedFingerprints.set(
      candidate.fingerprint,
      (selectedFingerprints.get(candidate.fingerprint) ?? 0) + 1,
    );
    const sessionKey = sessionKeyForHit(candidate);
    selectedSessions.set(sessionKey, (selectedSessions.get(sessionKey) ?? 0) + 1);
  };

  for (const familyId of lane.requiredFamilies) {
    pushIfUseful(sorted.find((candidate) => candidate.matchedFamilies.includes(familyId)));
  }
  for (const provider of lane.requiredProviders) {
    pushIfUseful(sorted.find((candidate) => candidate.provider === provider));
  }
  for (const actor of lane.requiredActors ?? []) {
    pushIfUseful(sorted.find((candidate) => candidate.actor === actor));
  }
  for (const stageId of lane.requiredStages ?? []) {
    pushIfUseful(sorted.find((candidate) => candidate.stageId === stageId));
  }
  for (const hit of sorted) {
    if (selected.length >= lane.maxMoments) {
      break;
    }
    pushIfUseful(hit);
  }
  return selected;
}

function mergeWindows(windows: ExcerptWindow[]): ExcerptWindow[] {
  const sorted = [...windows].sort((left, right) => {
    if (left.provider !== right.provider) {
      return left.provider.localeCompare(right.provider);
    }
    if (left.sessionId !== right.sessionId) {
      return left.sessionId.localeCompare(right.sessionId);
    }
    return left.turns[0].sourceLine - right.turns[0].sourceLine;
  });
  const merged: ExcerptWindow[] = [];
  for (const window of sorted) {
    const prior = merged[merged.length - 1];
    if (
      prior &&
      prior.provider === window.provider &&
      prior.sessionId === window.sessionId &&
      prior.sourcePath === window.sourcePath &&
      prior.turns[prior.turns.length - 1].sourceLine >= window.turns[0].sourceLine - 1
    ) {
      const turnMap = new Map<string, ExcerptWindowTurn>();
      for (const turn of [...prior.turns, ...window.turns]) {
        turnMap.set(turn.turnId, turn);
      }
      prior.turns = [...turnMap.values()].sort((left, right) => left.sourceLine - right.sourceLine);
      prior.hitIds = [...new Set([...prior.hitIds, ...window.hitIds])];
      prior.hitScore = Math.max(prior.hitScore, window.hitScore);
      prior.estimatedTokens = approxTokensForText(
        prior.turns.map((turn) => turn.text).join(" "),
      );
      continue;
    }
    merged.push(window);
  }
  return merged;
}

function trimWindowsToBudget(
  windows: ExcerptWindow[],
  lane: LaneDefinition,
): { windows: ExcerptWindow[]; structuralBlindSpots: string[]; trimmedWindowCount: number } {
  const structuralBlindSpots: string[] = [];
  const working = [...windows].sort((left, right) => right.hitScore - left.hitScore);
  const totalTokens = () => working.reduce((sum, window) => sum + window.estimatedTokens, 0);
  let trimmedWindowCount = 0;
  while (working.length > 0 && totalTokens() > lane.softTokenCap) {
    const removed = working.pop();
    if (removed) {
      trimmedWindowCount += 1;
      structuralBlindSpots.push(
        `Dropped low-priority window ${removed.id} to stay under the ${lane.softTokenCap} token cap.`,
      );
    }
  }
  return {
    windows: working.sort((left, right) => {
      if (left.provider !== right.provider) {
        return left.provider.localeCompare(right.provider);
      }
      if (left.sessionId !== right.sessionId) {
        return left.sessionId.localeCompare(right.sessionId);
      }
      return left.turns[0].sourceLine - right.turns[0].sourceLine;
    }),
    structuralBlindSpots,
    trimmedWindowCount,
  };
}

function renderMomentSummary(hit: CandidateHit): {
  momentType: string;
  summary: string;
  whyItMatters: string;
} {
  const matchedSummaries = hit.matchedFamilies
    .map((id) => QUERY_FAMILY_MAP.get(id))
    .filter((family): family is QueryFamily => Boolean(family));
  const family = matchedSummaries[0];
  const momentType =
    matchedSummaries.length > 1
      ? matchedSummaries
          .slice(0, 2)
          .map((entry) => entry.label)
          .join(" + ")
      : family?.label ?? "Interaction Moment";
  const actorLabel = `${hit.actor[0].toUpperCase()}${hit.actor.slice(1)}`;
  return {
    momentType,
    summary: `${actorLabel}: ${hit.textPreview || buildPreview("")}`,
    whyItMatters: family?.importance ?? "Relevant interaction evidence for later synthesis.",
  };
}

function formatEvidencePath(cwd: string, sourcePath: string, line: number): string {
  const rel = relative(cwd, sourcePath);
  return rel && !rel.startsWith("..") ? `${rel}:${line}` : `${sourcePath}:${line}`;
}

function emittedHitsFromWindows(windows: ExcerptWindow[], hits: CandidateHit[]): CandidateHit[] {
  const hitsById = new Map(hits.map((hit) => [hit.id, hit]));
  const emitted: CandidateHit[] = [];
  const seen = new Set<string>();
  for (const window of windows) {
    for (const hitId of window.hitIds) {
      const hit = hitsById.get(hitId);
      if (!hit || seen.has(hitId)) {
        continue;
      }
      emitted.push(hit);
      seen.add(hitId);
    }
  }
  return emitted;
}

function buildNeglectReport(
  config: PipelineConfig,
  lane: LaneDefinition,
  hits: CandidateHit[],
  emittedHits: CandidateHit[],
  coverage: CoverageReport,
): NeglectReport {
  const findings: NeglectFinding[] = [];
  const candidateFingerprintCounts = countBy(hits.map((hit) => hit.fingerprint));
  const duplicateFingerprints = Object.entries(candidateFingerprintCounts)
    .filter(([, count]) => count > 1)
    .sort((left, right) => right[1] - left[1]);
  const duplicateFingerprintGroups = duplicateFingerprints
    .slice(0, 10)
    .map(([fingerprint, count]) => ({
      fingerprintPreview:
        hits.find((hit) => hit.fingerprint === fingerprint)?.textPreview ?? fingerprint.slice(0, 180),
      count,
    }));
  const emittedSessionCounts = countBy(emittedHits.map((hit) => sessionKeyForHit(hit)));
  const emittedPrimaryFamilyCounts = countBy(
    emittedHits.map((hit) => hit.matchedFamilies[0] ?? "unclassified"),
  );

  if (coverage.selectedCoverage.missingFamilies.length > 0) {
    findings.push({
      code: "selected-missing-families",
      severity: "warning",
      message: `Selected-hit coverage missed required families: ${coverage.selectedCoverage.missingFamilies.join(", ")}.`,
    });
  }
  if (coverage.selectedCoverage.missingProviders.length > 0) {
    findings.push({
      code: "selected-missing-providers",
      severity: "warning",
      message: `Selected-hit coverage missed required providers: ${coverage.selectedCoverage.missingProviders.join(", ")}.`,
    });
  }
  if (coverage.selectedCoverage.missingActors.length > 0) {
    findings.push({
      code: "selected-missing-actors",
      severity: "warning",
      message: `Selected-hit coverage missed required actors: ${coverage.selectedCoverage.missingActors.join(", ")}.`,
    });
  }
  if (coverage.selectedCoverage.missingStages.length > 0) {
    findings.push({
      code: "selected-missing-stages",
      severity: "warning",
      message: `Selected-hit coverage missed required stages: ${coverage.selectedCoverage.missingStages.join(", ")}.`,
    });
  }
  if (coverage.emittedCoverage.missingFamilies.length > 0) {
    findings.push({
      code: "emitted-missing-families",
      severity: "warning",
      message: `Emitted extract coverage missed required families: ${coverage.emittedCoverage.missingFamilies.join(", ")}.`,
    });
  }
  if (coverage.emittedCoverage.missingProviders.length > 0) {
    findings.push({
      code: "emitted-missing-providers",
      severity: "warning",
      message: `Emitted extract coverage missed required providers: ${coverage.emittedCoverage.missingProviders.join(", ")}.`,
    });
  }
  if (coverage.emittedCoverage.missingActors.length > 0) {
    findings.push({
      code: "emitted-missing-actors",
      severity: "warning",
      message: `Emitted extract coverage missed required actors: ${coverage.emittedCoverage.missingActors.join(", ")}.`,
    });
  }
  if (coverage.emittedCoverage.missingStages.length > 0) {
    findings.push({
      code: "emitted-missing-stages",
      severity: "warning",
      message: `Emitted extract coverage missed required stages: ${coverage.emittedCoverage.missingStages.join(", ")}.`,
    });
  }
  if (coverage.trimmedWindowCount > 0) {
    findings.push({
      code: "budget-trimming",
      severity: "warning",
      message: `Budget trimming removed ${coverage.trimmedWindowCount} window${coverage.trimmedWindowCount === 1 ? "" : "s"} before emission.`,
    });
  }
  if (duplicateFingerprints.length > 0) {
    findings.push({
      code: "candidate-duplicate-fingerprints",
      severity: "info",
      message: `Candidate pool still contains ${duplicateFingerprints.length} duplicate fingerprint group${duplicateFingerprints.length === 1 ? "" : "s"}.`,
    });
  }
  if (emittedHits.length > 0) {
    const topSessionCount = Math.max(...Object.values(emittedSessionCounts));
    if (topSessionCount / emittedHits.length > 0.5 && emittedHits.length >= 4) {
      findings.push({
        code: "session-concentration",
        severity: "warning",
        message: `More than half of emitted evidence came from one session (${topSessionCount}/${emittedHits.length}).`,
      });
    }
    const topFamilyCount = Math.max(...Object.values(emittedPrimaryFamilyCounts), 0);
    if (topFamilyCount / emittedHits.length > 0.6 && emittedHits.length >= 5) {
      findings.push({
        code: "family-concentration",
        severity: "info",
        message: `One family dominates the emitted evidence (${topFamilyCount}/${emittedHits.length}).`,
      });
    }
  }
  if (findings.length === 0) {
    findings.push({
      code: "no-structural-findings",
      severity: "info",
      message: "No structural neglect findings were triggered. This is not a recall guarantee.",
    });
  }

  return {
    configId: config.id,
    laneId: lane.id,
    generatedAt: new Date().toISOString(),
    totalWindowTokens: coverage.totalWindowTokens,
    duplicateFingerprintGroups,
    emittedSessionCounts,
    emittedPrimaryFamilyCounts,
    findings,
    candidateCoverage: coverage.candidateCoverage,
    selectedCoverage: coverage.selectedCoverage,
    emittedCoverage: coverage.emittedCoverage,
  };
}

function renderExtractMarkdown(
  config: PipelineConfig,
  lane: LaneDefinition,
  windows: ExcerptWindow[],
  hits: CandidateHit[],
  coverage: CoverageReport,
  neglectReport: NeglectReport,
  cwd: string,
): string {
  const emittedHits = emittedHitsFromWindows(windows, hits);
  const sourcePaths = [...new Set(windows.map((window) => window.sourcePath))];
  const sessionIds = [...new Set(windows.map((window) => window.sessionId))];
  const manifest: QueryManifest = {
    configId: config.id,
    laneId: lane.id,
    generatedAt: new Date().toISOString(),
    providers: lane.providerAllowlist,
    families: lane.familyIds,
    sessionIds,
    sourcePaths,
    totalWindows: windows.length,
    totalWindowTokens: coverage.totalWindowTokens,
    notificationPolicy: notificationPolicy(lane),
    includeSubagentLaunchPrompts: lane.includeSubagentLaunchPrompts,
    maxSelectedHitsPerFingerprint: lane.maxSelectedHitsPerFingerprint,
    maxSelectedHitsPerSession: lane.maxSelectedHitsPerSession,
  };

  const rows = emittedHits
    .map((hit) => {
      const { momentType, summary, whyItMatters } = renderMomentSummary(hit);
      const dateOrSession = hit.timestamp?.slice(0, 10) ?? hit.sessionId;
      const evidence = formatEvidencePath(cwd, hit.sourcePath, hit.sourceLine);
      return `| ${dateOrSession} | ${momentType} | ${summary.replace(/\|/g, "\\|")} | \`${evidence}\` | ${whyItMatters.replace(/\|/g, "\\|")} |`;
    })
    .join("\n");

  const neglectNotes = neglectReport.findings.map((finding) => `- ${finding.message}`).join("\n");

  return [
    `# ${lane.label}`,
    "",
    `**Status:** Generated by transcript NLP pipeline.`,
    `**Lane:** \`${lane.id}\``,
    "",
    "## Query Manifest",
    "",
    `- config: \`${manifest.configId}\``,
    `- providers: ${manifest.providers.map((provider) => `\`${provider}\``).join(", ")}`,
    `- families: ${manifest.families.map((family) => `\`${family}\``).join(", ")}`,
    `- sessions touched: ${manifest.sessionIds.length}`,
    `- source files touched: ${manifest.sourcePaths.length}`,
    `- selected windows: ${manifest.totalWindows}`,
    `- estimated input tokens: ${manifest.totalWindowTokens}`,
    `- notification policy: \`${manifest.notificationPolicy}\``,
    `- include subagent launch prompts: ${manifest.includeSubagentLaunchPrompts ? "`yes`" : "`no`"}`,
    "",
    "## Coverage Summary",
    "",
    `- candidate hits: ${coverage.candidateHits}`,
    `- selected moments before trimming: ${coverage.selectedMoments}`,
    `- emitted moments: ${coverage.emittedMoments}`,
    `- selected windows: ${coverage.selectedWindows}`,
    `- trimmed windows: ${coverage.trimmedWindowCount}`,
    "",
    "## Extract Table",
    "",
    "| Date or session | Moment type | Summary | Evidence | Why it matters |",
    "| --- | --- | --- | --- | --- |",
    rows || "| none | none | No interaction windows selected. | n/a | Coverage failure. |",
    "",
    "## Neglect Notes",
    "",
    neglectNotes,
    "",
  ].join("\n");
}

function renderNeglectReviewMarkdown(config: PipelineConfig, reports: NeglectReport[]): string {
  const rows = reports
    .map((report) => {
      const warningCount = report.findings.filter((finding) => finding.severity === "warning").length;
      const infoCount = report.findings.filter((finding) => finding.severity === "info").length;
      return `| \`${report.laneId}\` | ${report.selectedCoverage.totalHits} | ${report.emittedCoverage.totalHits} | ${warningCount} warning${warningCount === 1 ? "" : "s"}, ${infoCount} info |`;
    })
    .join("\n");
  const findings = reports
    .map((report) => {
      const reportFindings = report.findings.map((finding) => `- ${finding.message}`).join("\n");
      return `### ${report.laneId}\n\n${reportFindings}`;
    })
    .join("\n\n");

  return [
    "# Transcript Neglect Review",
    "",
    `**Status:** Generated by transcript NLP pipeline for \`${config.id}\`.`,
    "",
    "This report summarizes structural neglect checks from the transcript pipeline. It is not a guarantee of full recall.",
    "",
    "## Lane Summary",
    "",
    "| Lane | Selected hits | Emitted hits | Finding mix |",
    "| --- | --- | --- | --- |",
    rows || "| none | 0 | 0 | No lane reports available. |",
    "",
    "## Lane Findings",
    "",
    findings || "- No lane findings available.",
    "",
  ].join("\n");
}

export async function runIndex(config: PipelineConfig, cwd: string): Promise<IndexArtifacts> {
  const allManifestEntries: SessionManifestEntry[] = [];
  const allTurns: NormalizedTurn[] = [];

  for (const source of config.sources) {
    if (source.kind === "claude-project") {
      const { manifestEntries, turns } = await indexClaudeProject(source, cwd, config.stageDefinitions);
      allManifestEntries.push(...manifestEntries);
      allTurns.push(...turns);
    } else if (source.kind === "codex-sessions") {
      const { manifestEntries, turns } = await indexCodexSessions(source, cwd, config.stageDefinitions);
      allManifestEntries.push(...manifestEntries);
      allTurns.push(...turns);
    } else if (source.kind === "plain-log") {
      const { manifestEntries, turns } = await indexPlainLogs(source, cwd);
      allManifestEntries.push(...manifestEntries);
      allTurns.push(...turns);
    }
  }

  const manifest = {
    configId: config.id,
    generatedAt: new Date().toISOString(),
    totalSessions: allManifestEntries.length,
    totalTurns: allTurns.length,
    usableTurns: allTurns.filter((turn) => !turn.noise).length,
    sessions: allManifestEntries,
  };

  await ensureDir(normalizedDir(config, cwd));
  await writeJson(manifestPath(config, cwd), manifest);
  await writeJsonl(turnsPath(config, cwd), allTurns as unknown as Iterable<Record<string, unknown>>);

  return { manifestEntries: allManifestEntries, turns: allTurns };
}

export async function loadIndexArtifacts(
  config: PipelineConfig,
  cwd: string,
): Promise<IndexArtifacts> {
  const manifest = await readJsonFromFile<{ sessions: SessionManifestEntry[] }>(manifestPath(config, cwd));
  const turns = await readJsonlFromFile<NormalizedTurn>(turnsPath(config, cwd));
  return {
    manifestEntries: manifest.sessions,
    turns,
  };
}

export async function runCandidates(
  config: PipelineConfig,
  laneId: string,
  cwd: string,
  inputTurns?: NormalizedTurn[],
): Promise<{ hits: CandidateHit[]; coverage: CoverageReport }> {
  const lane = laneById(config, laneId);
  const turns = inputTurns ?? (await loadIndexArtifacts(config, cwd)).turns;
  const families = lane.familyIds.map((familyId) => {
    const family = QUERY_FAMILY_MAP.get(familyId);
    if (!family) {
      throw new Error(`Unknown query family "${familyId}" in lane "${lane.id}".`);
    }
    return family;
  });

  const laneTurns = turns.filter((turn) => !shouldSuppressTurnForLane(turn, lane));
  const hits: CandidateHit[] = [];
  for (const turn of laneTurns) {
    const evaluation = evaluateTurnAgainstFamilies(turn, lane, families, config.anchorTerms);
    if (evaluation.matchedFamilies.length === 0) {
      continue;
    }
    hits.push({
      id: `${lane.id}:${turn.sessionId}:${turn.turnId}`,
      laneId: lane.id,
      fingerprint: buildCandidateFingerprint(turn),
      provider: turn.provider,
      sessionId: turn.sessionId,
      turnId: turn.turnId,
      timestamp: turn.timestamp,
      actor: turn.actor,
      stageId: turn.stageId,
      sourcePath: turn.sourcePath,
      sourceLine: turn.sourceLine,
      score: evaluation.score,
      matchedFamilies: evaluation.matchedFamilies,
      matchedAnchors: evaluation.matchedAnchors,
      textPreview: buildPreview(turn.text),
      whyMatched: evaluation.whyMatched,
      noiseReasons: turn.noiseReasons,
      sourceRefs: turn.sourceRefs,
    });
  }

  const sortedHits = hits.sort((left, right) => right.score - left.score || left.sourceLine - right.sourceLine);
  const coverage: CoverageReport = {
    configId: config.id,
    laneId: lane.id,
    generatedAt: new Date().toISOString(),
    totalTurns: turns.length,
    usableTurns: laneTurns.length,
    candidateHits: sortedHits.length,
    selectedWindows: 0,
    selectedMoments: 0,
    emittedMoments: 0,
    totalWindowTokens: 0,
    trimmedWindowCount: 0,
    candidateCoverage: buildCoverageSlice(sortedHits, lane),
    selectedCoverage: emptyCoverageSlice(lane),
    emittedCoverage: emptyCoverageSlice(lane),
    structuralBlindSpots: [],
  };

  await ensureDir(laneDir(config, lane.id, cwd));
  await writeJsonl(candidateHitsPath(config, lane.id, cwd), sortedHits as unknown as Iterable<Record<string, unknown>>);
  await writeJson(coveragePath(config, lane.id, cwd), coverage);
  return { hits: sortedHits, coverage };
}

export async function runWindows(
  config: PipelineConfig,
  laneId: string,
  cwd: string,
  inputTurns?: NormalizedTurn[],
  inputHits?: CandidateHit[],
): Promise<{ windows: ExcerptWindow[]; coverage: CoverageReport }> {
  const lane = laneById(config, laneId);
  const turns = inputTurns ?? (await loadIndexArtifacts(config, cwd)).turns;
  const hits = inputHits ?? (await readJsonlFromFile<CandidateHit>(candidateHitsPath(config, lane.id, cwd)));
  const selectedHits = selectHitsForLane(hits, lane);
  const turnsBySession = new Map<string, NormalizedTurn[]>();
  for (const turn of turns.filter((entry) => !shouldSuppressTurnForLane(entry, lane))) {
    const key = `${turn.provider}:${turn.sessionId}`;
    const list = turnsBySession.get(key) ?? [];
    list.push(turn);
    turnsBySession.set(key, list);
  }
  for (const list of turnsBySession.values()) {
    list.sort((left, right) => left.sourceLine - right.sourceLine);
  }

  const hitFamilies = new Map<string, string[]>(
    hits.map((hit) => [`${hit.provider}:${hit.sessionId}:${hit.turnId}`, hit.matchedFamilies]),
  );

  let contextBefore = lane.contextBefore;
  let contextAfter = lane.contextAfter;
  let windows: ExcerptWindow[] = [];

  const buildWindowsOnce = (): ExcerptWindow[] =>
    mergeWindows(
      selectedHits.map((hit) => {
        const key = `${hit.provider}:${hit.sessionId}`;
        const sessionTurns = turnsBySession.get(key) ?? [];
        const hitIndex = sessionTurns.findIndex((turn) => turn.turnId === hit.turnId);
        const start = Math.max(0, hitIndex - contextBefore);
        const end = hitIndex >= 0 ? Math.min(sessionTurns.length, hitIndex + contextAfter + 1) : 0;
        const windowTurns = sessionTurns.slice(start, end).map<ExcerptWindowTurn>((turn) => ({
          turnId: turn.turnId,
          actor: turn.actor,
          eventType: turn.eventType,
          timestamp: turn.timestamp,
          sourceLine: turn.sourceLine,
          text: turn.text,
          matchedFamilies: hitFamilies.get(`${turn.provider}:${turn.sessionId}:${turn.turnId}`) ?? [],
        }));
        return {
          id: `${lane.id}:${hit.provider}:${hit.sessionId}:${windowTurns[0]?.sourceLine ?? 0}-${windowTurns[windowTurns.length - 1]?.sourceLine ?? 0}`,
          laneId: lane.id,
          provider: hit.provider,
          sessionId: hit.sessionId,
          sourcePath: hit.sourcePath,
          estimatedTokens: approxTokensForText(windowTurns.map((turn) => turn.text).join(" ")),
          hitIds: [hit.id],
          hitScore: hit.score,
          turns: windowTurns,
        };
      }),
    );

  windows = buildWindowsOnce();
  while (
    windows.reduce((sum, window) => sum + window.estimatedTokens, 0) > lane.softTokenCap &&
    (contextBefore > 0 || contextAfter > 0)
  ) {
    contextBefore = Math.max(0, contextBefore - 1);
    contextAfter = Math.max(0, contextAfter - 1);
    windows = buildWindowsOnce();
  }

  const trimmed = trimWindowsToBudget(windows, lane);
  windows = trimmed.windows;

  const priorCoverage = await readJsonFromFile<CoverageReport>(coveragePath(config, lane.id, cwd));
  const emittedHits = emittedHitsFromWindows(windows, hits);
  const totalWindowTokens = windows.reduce((sum, window) => sum + window.estimatedTokens, 0);
  const coverage: CoverageReport = {
    ...priorCoverage,
    selectedWindows: windows.length,
    selectedMoments: selectedHits.length,
    emittedMoments: emittedHits.length,
    totalWindowTokens,
    trimmedWindowCount: trimmed.trimmedWindowCount,
    selectedCoverage: buildCoverageSlice(selectedHits, lane),
    emittedCoverage: buildCoverageSlice(emittedHits, lane),
    structuralBlindSpots: [...priorCoverage.structuralBlindSpots, ...trimmed.structuralBlindSpots],
  };
  await writeJsonl(windowsPath(config, lane.id, cwd), windows as unknown as Iterable<Record<string, unknown>>);
  await writeJson(coveragePath(config, lane.id, cwd), coverage);
  return { windows, coverage };
}

export async function runExtract(
  config: PipelineConfig,
  laneId: string,
  cwd: string,
  inputWindows?: ExcerptWindow[],
  inputHits?: CandidateHit[],
): Promise<{ outputPath: string; coverage: CoverageReport }> {
  const lane = laneById(config, laneId);
  const windows = inputWindows ?? (await readJsonlFromFile<ExcerptWindow>(windowsPath(config, lane.id, cwd)));
  const hits = inputHits ?? (await readJsonlFromFile<CandidateHit>(candidateHitsPath(config, lane.id, cwd)));
  const coverage = await readJsonFromFile<CoverageReport>(coveragePath(config, lane.id, cwd));
  const neglectReport = buildNeglectReport(
    config,
    lane,
    hits,
    emittedHitsFromWindows(windows, hits),
    coverage,
  );
  const markdown = renderExtractMarkdown(config, lane, windows, hits, coverage, neglectReport, cwd);
  const queryManifest: QueryManifest = {
    configId: config.id,
    laneId: lane.id,
    generatedAt: new Date().toISOString(),
    providers: lane.providerAllowlist,
    families: lane.familyIds,
    sessionIds: [...new Set(windows.map((window) => window.sessionId))],
    sourcePaths: [...new Set(windows.map((window) => window.sourcePath))],
    totalWindows: windows.length,
    totalWindowTokens: coverage.totalWindowTokens,
    notificationPolicy: notificationPolicy(lane),
    includeSubagentLaunchPrompts: lane.includeSubagentLaunchPrompts,
    maxSelectedHitsPerFingerprint: lane.maxSelectedHitsPerFingerprint,
    maxSelectedHitsPerSession: lane.maxSelectedHitsPerSession,
  };

  const outputPath = extractOutputPath(config, lane, cwd);
  await ensureDir(dirname(outputPath));
  await import("node:fs/promises").then((fs) => fs.writeFile(outputPath, markdown, "utf8"));
  await writeJson(queryManifestPath(config, lane.id, cwd), queryManifest);
  await writeJson(neglectPath(config, lane.id, cwd), neglectReport);
  return { outputPath, coverage };
}

async function writeNeglectReview(config: PipelineConfig, cwd: string, laneIds: string[]): Promise<void> {
  const outputPath = neglectReviewPath(config, cwd);
  if (!outputPath) {
    return;
  }
  const reports = await Promise.all(
    laneIds.map(async (laneId) => readJsonFromFile<NeglectReport>(neglectPath(config, laneId, cwd))),
  );
  await ensureDir(dirname(outputPath));
  await import("node:fs/promises").then((fs) =>
    fs.writeFile(outputPath, renderNeglectReviewMarkdown(config, reports), "utf8"),
  );
}

export async function runPipeline(
  config: PipelineConfig,
  cwd: string,
  laneId?: string,
): Promise<void> {
  const { turns } = await runIndex(config, cwd);
  const laneIds = laneId ? [laneId] : config.lanes.map((lane) => lane.id);
  for (const currentLaneId of laneIds) {
    const { hits } = await runCandidates(config, currentLaneId, cwd, turns);
    const { windows } = await runWindows(config, currentLaneId, cwd, turns, hits);
    await runExtract(config, currentLaneId, cwd, windows, hits);
  }
  await writeNeglectReview(config, cwd, laneIds);
}
