export type Provider = "claude" | "codex" | "initiative-log";
export type NotificationPolicy = "suppress" | "downrank" | "include";

export type Actor =
  | "user"
  | "assistant"
  | "system"
  | "developer"
  | "tool"
  | "attachment"
  | "log";

export interface StageDefinition {
  id: string;
  label: string;
  start: string;
  end: string;
}

interface BaseSourceDefinition {
  id: string;
  provider: Provider;
}

export interface ClaudeProjectSourceDefinition extends BaseSourceDefinition {
  kind: "claude-project";
  basePath: string;
  startDate: string;
  endDate: string;
  includeTopLevelSessions: boolean;
  includeSubagentSessions: boolean;
}

export interface CodexSessionsSourceDefinition extends BaseSourceDefinition {
  kind: "codex-sessions";
  basePath: string;
  startDate: string;
  endDate: string;
  workspacePath?: string;
}

export interface PlainLogSourceDefinition extends BaseSourceDefinition {
  kind: "plain-log";
  filePaths: string[];
  defaultStageId?: string;
}

export type SourceDefinition =
  | ClaudeProjectSourceDefinition
  | CodexSessionsSourceDefinition
  | PlainLogSourceDefinition;

export interface LaneDefinition {
  id: string;
  label: string;
  outputPath: string;
  providerAllowlist: Provider[];
  familyIds: string[];
  requiredFamilies: string[];
  requiredProviders: Provider[];
  requiredActors?: Actor[];
  requiredStages?: string[];
  contextBefore: number;
  contextAfter: number;
  maxMoments: number;
  softTokenCap: number;
  preferredTokenTarget: number;
  preferredOutputTokenTarget: number;
  notificationPolicy?: NotificationPolicy;
  includeSubagentLaunchPrompts?: boolean;
  maxSelectedHitsPerFingerprint?: number;
  maxSelectedHitsPerSession?: number;
}

export interface PipelineConfig {
  id: string;
  label: string;
  outputRoot: string;
  neglectReviewOutputPath?: string;
  anchorTerms: string[];
  stageDefinitions: StageDefinition[];
  sources: SourceDefinition[];
  lanes: LaneDefinition[];
}

export interface SourceRef {
  sourceLine: number;
  eventType: string;
  timestamp: string | null;
}

export interface NormalizedTurn {
  provider: Provider;
  sourceId: string;
  sessionId: string;
  turnId: string;
  timestamp: string | null;
  actor: Actor;
  model: string | null;
  agentId: string | null;
  cwd: string | null;
  eventType: string;
  text: string;
  textLength: number;
  noise: boolean;
  noiseReasons: string[];
  stageId: string | null;
  sourcePath: string;
  sourceLine: number;
  sourceRefs: SourceRef[];
  metadata: Record<string, string>;
}

export interface SessionManifestEntry {
  provider: Provider;
  sourceId: string;
  sessionId: string;
  sourcePath: string;
  bytes: number;
  estimatedTokens: number;
  indexedTurns: number;
  usableTurns: number;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

export interface CandidateHit {
  id: string;
  laneId: string;
  fingerprint: string;
  provider: Provider;
  sessionId: string;
  turnId: string;
  timestamp: string | null;
  actor: Actor;
  stageId: string | null;
  sourcePath: string;
  sourceLine: number;
  score: number;
  matchedFamilies: string[];
  matchedAnchors: string[];
  textPreview: string;
  whyMatched: string[];
  noiseReasons: string[];
  sourceRefs: SourceRef[];
}

export interface ExcerptWindowTurn {
  turnId: string;
  actor: Actor;
  eventType: string;
  timestamp: string | null;
  sourceLine: number;
  text: string;
  matchedFamilies: string[];
}

export interface ExcerptWindow {
  id: string;
  laneId: string;
  provider: Provider;
  sessionId: string;
  sourcePath: string;
  estimatedTokens: number;
  hitIds: string[];
  hitScore: number;
  turns: ExcerptWindowTurn[];
}

export interface CoverageReport {
  configId: string;
  laneId: string;
  generatedAt: string;
  totalTurns: number;
  usableTurns: number;
  candidateHits: number;
  selectedWindows: number;
  selectedMoments: number;
  emittedMoments: number;
  totalWindowTokens: number;
  trimmedWindowCount: number;
  candidateCoverage: CoverageSlice;
  selectedCoverage: CoverageSlice;
  emittedCoverage: CoverageSlice;
  structuralBlindSpots: string[];
}

export interface CoverageSlice {
  totalHits: number;
  countsByFamily: Record<string, number>;
  countsByProvider: Record<string, number>;
  countsByActor: Record<string, number>;
  countsByStage: Record<string, number>;
  missingFamilies: string[];
  missingProviders: string[];
  missingActors: string[];
  missingStages: string[];
}

export interface NeglectFinding {
  code: string;
  severity: "info" | "warning";
  message: string;
}

export interface DuplicateFingerprintGroup {
  fingerprintPreview: string;
  count: number;
}

export interface NeglectReport {
  configId: string;
  laneId: string;
  generatedAt: string;
  totalWindowTokens: number;
  duplicateFingerprintGroups: DuplicateFingerprintGroup[];
  emittedSessionCounts: Record<string, number>;
  emittedPrimaryFamilyCounts: Record<string, number>;
  findings: NeglectFinding[];
  candidateCoverage: CoverageSlice;
  selectedCoverage: CoverageSlice;
  emittedCoverage: CoverageSlice;
}

export interface QueryFamily {
  id: string;
  label: string;
  description: string;
  importance: string;
  patterns: RegExp[];
  actorAllowlist?: Actor[];
  providerAllowlist?: Provider[];
  baseScore: number;
}

export interface QueryManifest {
  configId: string;
  laneId: string;
  generatedAt: string;
  providers: Provider[];
  families: string[];
  sessionIds: string[];
  sourcePaths: string[];
  totalWindows: number;
  totalWindowTokens: number;
  notificationPolicy?: NotificationPolicy;
  includeSubagentLaunchPrompts?: boolean;
  maxSelectedHitsPerFingerprint?: number;
  maxSelectedHitsPerSession?: number;
}
