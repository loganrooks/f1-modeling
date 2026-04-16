import { resolve } from "node:path";

import { getConfig } from "./configs";
import {
  loadIndexArtifacts,
  runCandidates,
  runExtract,
  runIndex,
  runPipeline,
  runWindows,
} from "./pipeline";

interface ParsedArgs {
  command: string;
  configId: string;
  laneId?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  if (!command) {
    throw new Error("Usage: tsx scripts/transcript-nlp/cli.ts <index|candidates|windows|extract|run> [--config ID] [--lane ID]");
  }
  let configId = "vision-alignment-2026-04";
  let laneId: string | undefined;
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === "--config") {
      configId = rest[index + 1] ?? configId;
      index += 1;
      continue;
    }
    if (token === "--lane") {
      laneId = rest[index + 1];
      index += 1;
    }
  }
  return { command, configId, laneId };
}

function printSummary(message: string): void {
  process.stdout.write(`${message}\n`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const config = getConfig(args.configId);
  const laneLabel = args.laneId ? ` lane=${args.laneId}` : "";

  if (args.command === "index") {
    const { manifestEntries, turns } = await runIndex(config, cwd);
    printSummary(
      `Indexed config=${config.id} sessions=${manifestEntries.length} turns=${turns.length}`,
    );
    return;
  }

  if (args.command === "candidates") {
    const { turns } = await loadIndexArtifacts(config, cwd);
    const laneIds = args.laneId ? [args.laneId] : config.lanes.map((lane) => lane.id);
    for (const laneId of laneIds) {
      const { hits, coverage } = await runCandidates(config, laneId, cwd, turns);
      printSummary(
        `Candidates config=${config.id} lane=${laneId} hits=${hits.length} missingFamilies=${coverage.candidateCoverage.missingFamilies.join(",") || "none"}`,
      );
    }
    return;
  }

  if (args.command === "windows") {
    const { turns } = await loadIndexArtifacts(config, cwd);
    const laneIds = args.laneId ? [args.laneId] : config.lanes.map((lane) => lane.id);
    for (const laneId of laneIds) {
      const { windows, coverage } = await runWindows(config, laneId, cwd, turns);
      printSummary(
        `Windows config=${config.id} lane=${laneId} windows=${windows.length} tokens=${coverage.totalWindowTokens}`,
      );
    }
    return;
  }

  if (args.command === "extract") {
    const laneIds = args.laneId ? [args.laneId] : config.lanes.map((lane) => lane.id);
    for (const laneId of laneIds) {
      const { outputPath, coverage } = await runExtract(config, laneId, cwd);
      printSummary(
        `Extract config=${config.id} lane=${laneId} output=${resolve(outputPath)} tokens=${coverage.totalWindowTokens}`,
      );
    }
    return;
  }

  if (args.command === "run") {
    await runPipeline(config, cwd, args.laneId);
    printSummary(`Run complete config=${config.id}${laneLabel}`);
    return;
  }

  throw new Error(`Unknown command "${args.command}".`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
