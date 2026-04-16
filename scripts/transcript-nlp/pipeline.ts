import { basename, dirname, join, relative, resolve } from "node:path";

import { ensureDir, readJsonFromFile, readJsonlFromFile, writeJson, writeJsonl } from "./io";
import { QUERY_FAMILIES, QUERY_FAMILY_MAP } from "./queryFamilies";
import { approxTokensForText, buildPreview } from "./text";
import type {
  CandidateHit,
  CoverageReport,
  ExcerptWindow,
  ExcerptWindowTurn,
  LaneDefinition,
  NormalizedTurn,
  PipelineConfig,
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

function extractOutputPath(config: PipelineConfig, lane: LaneDefinition, cwd: string): string {
  return resolve(cwd, lane.outputPath);
}

function pickFamilySummary(familyIds: string[]): QueryFamily | undefined {
  return familyIds
    .map((id) => QUERY_FAMILY_MAP.get(id))
    .filter((family): family is QueryFamily => Boolean(family))[0];
}

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function buildFamilyCoverage(
  hits: CandidateHit[],
  lane: LaneDefinition,
): Pick<CoverageReport, "countsByFamily" | "missingFamilies"> {
  const familyValues = hits.flatMap((hit) => hit.matchedFamilies);
  const countsByFamily = countBy(familyValues);
  const missingFamilies = lane.requiredFamilies.filter(
    (familyId) => !countsByFamily[familyId],
  );
  return { countsByFamily, missingFamilies };
}

function anchorMatches(text: string, anchorTerms: string[]): string[] {
  const lowered = text.toLowerCase();
  return anchorTerms.filter((term) => lowered.includes(term.toLowerCase()));
}

function evaluateTurnAgainstFamilies(
  turn: NormalizedTurn,
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
    score += Math.min(4, matchedAnchors.length);
    whyMatched.push(
      `${matchedAnchors.length} anchor term${matchedAnchors.length === 1 ? "" : "s"}`,
    );
  }
  if (turn.actor === "user" && matchedFamilies.includes("frustration_pushback")) {
    score += 1;
  }
  return { score, matchedFamilies, matchedAnchors, whyMatched };
}

function isNearDuplicate(left: CandidateHit, right: CandidateHit): boolean {
  return (
    left.provider === right.provider &&
    left.sessionId === right.sessionId &&
    Math.abs(left.sourceLine - right.sourceLine) <= 1 &&
    left.textPreview === right.textPreview
  );
}

function selectHitsForLane(
  hits: CandidateHit[],
  lane: LaneDefinition,
): CandidateHit[] {
  const sorted = [...hits].sort((left, right) => right.score - left.score || left.sourceLine - right.sourceLine);
  const selected: CandidateHit[] = [];
  const seenIds = new Set<string>();

  const pushIfUseful = (candidate: CandidateHit | undefined) => {
    if (!candidate || seenIds.has(candidate.id)) {
      return;
    }
    if (selected.some((existing) => isNearDuplicate(existing, candidate))) {
      return;
    }
    selected.push(candidate);
    seenIds.add(candidate.id);
  };

  for (const familyId of lane.requiredFamilies) {
    pushIfUseful(sorted.find((candidate) => candidate.matchedFamilies.includes(familyId)));
  }
  for (const provider of lane.requiredProviders) {
    pushIfUseful(sorted.find((candidate) => candidate.provider === provider));
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
      prior.turns = [...turnMap.values()].sort(
        (left, right) => left.sourceLine - right.sourceLine,
      );
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
): { windows: ExcerptWindow[]; blindSpots: string[] } {
  const blindSpots: string[] = [];
  const totalTokens = () =>
    windows.reduce((sum, window) => sum + window.estimatedTokens, 0);
  const working = [...windows].sort((left, right) => right.hitScore - left.hitScore);
  while (working.length > 0 && totalTokens() > lane.softTokenCap) {
    const removed = working.pop();
    if (removed) {
      blindSpots.push(
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
    blindSpots,
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
  const momentType = matchedSummaries.length > 1
    ? matchedSummaries
        .slice(0, 2)
        .map((entry) => entry.label)
        .join(" + ")
    : family?.label ?? "Interaction Moment";
  const actorLabel = `${hit.actor[0].toUpperCase()}${hit.actor.slice(1)}`;
  const preview = hit.textPreview || buildPreview("");
  return {
    momentType,
    summary: `${actorLabel}: ${preview}`,
    whyItMatters: family?.importance ?? "Relevant interaction evidence for later synthesis.",
  };
}

function formatEvidencePath(cwd: string, sourcePath: string, line: number): string {
  const rel = relative(cwd, sourcePath);
  return rel && !rel.startsWith("..") ? `${rel}:${line}` : `${sourcePath}:${line}`;
}

function renderExtractMarkdown(
  config: PipelineConfig,
  lane: LaneDefinition,
  windows: ExcerptWindow[],
  hits: CandidateHit[],
  coverage: CoverageReport,
  cwd: string,
): string {
  const hitsById = new Map(hits.map((hit) => [hit.id, hit]));
  const sourcePaths = [...new Set(windows.map((window) => window.sourcePath))];
  const sessionIds = [...new Set(windows.map((window) => window.sessionId))];
  const selectedHits: CandidateHit[] = [];
  const seenHitIds = new Set<string>();
  for (const window of windows) {
    for (const hitId of window.hitIds) {
      const hit = hitsById.get(hitId);
      if (!hit || seenHitIds.has(hitId)) {
        continue;
      }
      selectedHits.push(hit);
      seenHitIds.add(hitId);
    }
  }
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
  };

  const title = lane.label;
  const rows = selectedHits
    .map((hit) => {
      const { momentType, summary, whyItMatters } = renderMomentSummary(hit);
      const dateOrSession = hit.timestamp?.slice(0, 10) ?? hit.sessionId;
      const evidence = formatEvidencePath(cwd, hit.sourcePath, hit.sourceLine);
      return `| ${dateOrSession} | ${momentType} | ${summary.replace(/\|/g, "\\|")} | \`${evidence}\` | ${whyItMatters.replace(/\|/g, "\\|")} |`;
    })
    .join("\n");

  const blindSpots = coverage.blindSpots.length
    ? coverage.blindSpots.map((item) => `- ${item}`).join("\n")
    : "- No major blind spots were detected by the deterministic coverage checks.";

  return [
    `# ${title}`,
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
    "",
    "## Extract Table",
    "",
    "| Date or session | Moment type | Summary | Evidence | Why it matters |",
    "| --- | --- | --- | --- | --- |",
    rows || "| none | none | No interaction windows selected. | n/a | Coverage failure. |",
    "",
    "## Blind Spots",
    "",
    blindSpots,
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
  await writeJsonl(
    turnsPath(config, cwd),
    allTurns as unknown as Iterable<Record<string, unknown>>,
  );

  return { manifestEntries: allManifestEntries, turns: allTurns };
}

export async function loadIndexArtifacts(
  config: PipelineConfig,
  cwd: string,
): Promise<IndexArtifacts> {
  const manifest = await readJsonFromFile<{
    sessions: SessionManifestEntry[];
  }>(manifestPath(config, cwd));
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

  const hits: CandidateHit[] = [];
  for (const turn of turns) {
    if (turn.noise || !lane.providerAllowlist.includes(turn.provider)) {
      continue;
    }
    const evaluation = evaluateTurnAgainstFamilies(turn, families, config.anchorTerms);
    if (evaluation.matchedFamilies.length === 0) {
      continue;
    }
    hits.push({
      id: `${lane.id}:${turn.sessionId}:${turn.turnId}`,
      laneId: lane.id,
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
    });
  }

  const sortedHits = hits.sort(
    (left, right) => right.score - left.score || left.sourceLine - right.sourceLine,
  );
  const familyCoverage = buildFamilyCoverage(sortedHits, lane);
  const coverage: CoverageReport = {
    configId: config.id,
    laneId: lane.id,
    generatedAt: new Date().toISOString(),
    totalTurns: turns.length,
    usableTurns: turns.filter(
      (turn) => !turn.noise && lane.providerAllowlist.includes(turn.provider),
    ).length,
    candidateHits: sortedHits.length,
    selectedWindows: 0,
    selectedMoments: 0,
    totalWindowTokens: 0,
    countsByFamily: familyCoverage.countsByFamily,
    countsByProvider: countBy(sortedHits.map((hit) => hit.provider)),
    countsByActor: countBy(sortedHits.map((hit) => hit.actor)),
    missingFamilies: familyCoverage.missingFamilies,
    missingProviders: lane.requiredProviders.filter(
      (provider) => !sortedHits.some((hit) => hit.provider === provider),
    ),
    blindSpots: [],
  };

  await ensureDir(laneDir(config, lane.id, cwd));
  await writeJsonl(
    candidateHitsPath(config, lane.id, cwd),
    sortedHits as unknown as Iterable<Record<string, unknown>>,
  );
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
  const hits =
    inputHits ?? (await readJsonlFromFile<CandidateHit>(candidateHitsPath(config, lane.id, cwd)));
  const selectedHits = selectHitsForLane(hits, lane);
  const turnsBySession = new Map<string, NormalizedTurn[]>();
  for (const turn of turns.filter(
    (entry) => !entry.noise && lane.providerAllowlist.includes(entry.provider),
  )) {
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
          matchedFamilies:
            hitFamilies.get(`${turn.provider}:${turn.sessionId}:${turn.turnId}`) ?? [],
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
  const totalWindowTokens = windows.reduce(
    (sum, window) => sum + window.estimatedTokens,
    0,
  );
  const coverage: CoverageReport = {
    ...priorCoverage,
    selectedWindows: windows.length,
    selectedMoments: selectedHits.length,
    totalWindowTokens,
    blindSpots: [
      ...priorCoverage.blindSpots,
      ...trimmed.blindSpots,
    ],
  };
  await writeJsonl(
    windowsPath(config, lane.id, cwd),
    windows as unknown as Iterable<Record<string, unknown>>,
  );
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
  const windows =
    inputWindows ?? (await readJsonlFromFile<ExcerptWindow>(windowsPath(config, lane.id, cwd)));
  const hits =
    inputHits ?? (await readJsonlFromFile<CandidateHit>(candidateHitsPath(config, lane.id, cwd)));
  const coverage = await readJsonFromFile<CoverageReport>(coveragePath(config, lane.id, cwd));
  const markdown = renderExtractMarkdown(config, lane, windows, hits, coverage, cwd);
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
  };

  const outputPath = extractOutputPath(config, lane, cwd);
  await ensureDir(dirname(outputPath));
  await import("node:fs/promises").then((fs) => fs.writeFile(outputPath, markdown, "utf8"));
  await writeJson(queryManifestPath(config, lane.id, cwd), queryManifest);
  return { outputPath, coverage };
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
}
