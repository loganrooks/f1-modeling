import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import Fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";

import healthRoutes from "./routes/health.js";
import registerPresetRoutes from "./routes/presets.js";
import registerRunRoutes from "./routes/runs.js";
import registerScenarioRoutes from "./routes/scenarios.js";

const REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export interface LocalApiPaths {
  workspaceRoot: string;
  presetsRoot: string;
  scenariosDir: string;
  runsDir: string;
}

export interface BuildAppOptions {
  workspaceRoot?: string;
  presetsRoot?: string;
  logger?: FastifyServerOptions["logger"];
}

function resolvePaths(options: BuildAppOptions): LocalApiPaths {
  const workspaceRoot = options.workspaceRoot
    ? resolve(options.workspaceRoot)
    : process.env.F1_MODELING_WORKSPACE_ROOT
      ? resolve(process.env.F1_MODELING_WORKSPACE_ROOT)
      : REPO_ROOT;

  const presetsRoot = options.presetsRoot
    ? resolve(options.presetsRoot)
    : process.env.F1_MODELING_PRESETS_ROOT
      ? resolve(process.env.F1_MODELING_PRESETS_ROOT)
      : join(REPO_ROOT, "presets");

  return {
    workspaceRoot,
    presetsRoot,
    scenariosDir: join(workspaceRoot, "workspace-data", "scenarios"),
    runsDir: join(workspaceRoot, "workspace-data", "runs"),
  };
}

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const paths = resolvePaths(options);
  const app = Fastify({
    logger: options.logger ?? {
      level: "info",
    },
  });

  app.register(healthRoutes);
  app.register(registerPresetRoutes, { prefix: "/api", paths });
  app.register(registerRunRoutes, { prefix: "/api", paths });
  app.register(registerScenarioRoutes, { prefix: "/api", paths });

  return app;
}
