#!/usr/bin/env node

import process from "node:process";

import {
  inspectProject,
  inspectRuntime,
  planProjectReconcile,
  planRuntimeReconcile,
  reconcileProject,
  reconcileRuntime,
  restoreRuntime,
  verifyProject,
  verifyRuntime,
} from "./index.js";

interface ParsedArgs {
  command: string | null;
  projectRoot?: string | undefined;
  runtimeRoot?: string | undefined;
  dryRun: boolean;
  json: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    command: null,
    dryRun: false,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg) {
      continue;
    }

    if (!arg.startsWith("--") && parsed.command === null) {
      parsed.command = arg;
      continue;
    }

    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--project-root" || arg.startsWith("--project-root=")) {
      const value = arg.includes("=") ? arg.split("=", 2)[1] : argv[++index];
      parsed.projectRoot = value;
      continue;
    }

    if (arg === "--runtime-root" || arg.startsWith("--runtime-root=")) {
      const value = arg.includes("=") ? arg.split("=", 2)[1] : argv[++index];
      parsed.runtimeRoot = value;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function printHelp(): void {
  process.stdout.write(`fa-harness <command> [options]

Commands:
  onboard            Inspect runtime and project, then auto-apply install/bootstrap or upgrade.
  inspect            Inspect runtime and project state without mutating files.
  install-runtime    Install the runtime overlay from reviewed upstream targets.
  upgrade-runtime    Upgrade a mixed runtime to the current overlay.
  restore-runtime    Restore the runtime from the last recorded backup.
  verify-runtime     Verify the runtime overlay, hashes, and receipt.
  bootstrap-project  Create the project doctrine/governance baseline.
  upgrade-project    Upgrade or repair an existing project install.
  verify-project     Verify the project marker and managed files.

Options:
  --project-root <path>   Override the project root (defaults to cwd).
  --runtime-root <path>   Override the GSDR runtime root.
  --dry-run               Print the plan without mutating files.
  --json                  Emit JSON instead of human-readable text.
  --help, -h              Show this help.
`);
}

function printHuman(title: string, payload: unknown): void {
  process.stdout.write(`${title}\n${JSON.stringify(payload, null, 2)}\n`);
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.command === null) {
    printHelp();
    return;
  }

  const runtimeOptions = {
    runtimeRoot: args.runtimeRoot,
    dryRun: args.dryRun,
  };
  const projectOptions = {
    projectRoot: args.projectRoot,
    dryRun: args.dryRun,
  };

  switch (args.command) {
    case "inspect": {
      const runtime = await inspectRuntime(runtimeOptions);
      const project = await inspectProject(projectOptions);
      const result = { runtime, project };
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Inspection", result);
      }
      return;
    }

    case "install-runtime": {
      const result = await reconcileRuntime("install", runtimeOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Runtime install", result);
      }
      return;
    }

    case "upgrade-runtime": {
      const result = await reconcileRuntime("upgrade", runtimeOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Runtime upgrade", result);
      }
      return;
    }

    case "restore-runtime": {
      const result = await restoreRuntime(runtimeOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Runtime restore", result);
      }
      return;
    }

    case "verify-runtime": {
      const result = await verifyRuntime(runtimeOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Runtime verification", result);
      }
      if (!result.ok) {
        process.exitCode = 1;
      }
      return;
    }

    case "bootstrap-project": {
      const result = await reconcileProject("bootstrap", projectOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Project bootstrap", result);
      }
      return;
    }

    case "upgrade-project": {
      const result = await reconcileProject("upgrade", projectOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Project upgrade", result);
      }
      return;
    }

    case "verify-project": {
      const result = await verifyProject(projectOptions);
      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Project verification", result);
      }
      if (!result.ok) {
        process.exitCode = 1;
      }
      return;
    }

    case "onboard": {
      const runtimeInspection = await inspectRuntime(runtimeOptions);
      const projectInspection = await inspectProject(projectOptions);

      const runtimeMode =
        runtimeInspection.recommendedAction === "install-runtime"
          ? "install"
          : runtimeInspection.recommendedAction === "upgrade-runtime"
            ? "upgrade"
            : null;
      const projectMode =
        projectInspection.recommendedAction === "bootstrap-project"
          ? "bootstrap"
          : projectInspection.recommendedAction === "upgrade-project"
            ? "upgrade"
            : null;

      if (
        runtimeInspection.recommendedAction === "manual-review" ||
        projectInspection.recommendedAction === "manual-review"
      ) {
        throw new Error(
          "Onboard cannot proceed automatically because runtime or project inspection requires manual review.",
        );
      }

      const runtime =
        runtimeMode === null
          ? null
          : args.dryRun
            ? await planRuntimeReconcile(runtimeMode, runtimeOptions)
            : await reconcileRuntime(runtimeMode, runtimeOptions);
      const project =
        projectMode === null
          ? null
          : args.dryRun
            ? await planProjectReconcile(projectMode, projectOptions)
            : await reconcileProject(projectMode, projectOptions);
      const verification =
        args.dryRun
          ? null
          : {
              runtime: await verifyRuntime(runtimeOptions),
              project: await verifyProject(projectOptions),
            };

      const result = {
        runtimeInspection,
        projectInspection,
        runtime,
        project,
        verification,
      };

      if (args.json) {
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      } else {
        printHuman("Onboard", result);
      }

      if (verification && (!verification.runtime.ok || !verification.project.ok)) {
        process.exitCode = 1;
      }
      return;
    }

    default:
      throw new Error(`Unknown command: ${args.command}`);
  }
}

run().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown fa-harness failure";
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
