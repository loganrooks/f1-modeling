import type { FastifyPluginAsync } from "fastify";

import type { LocalApiPaths } from "../app.js";
import { listPresets } from "../services/presetService.js";

interface PresetRouteOptions {
  paths: LocalApiPaths;
}

export const registerPresetRoutes: FastifyPluginAsync<PresetRouteOptions> = async (
  app,
  { paths },
) => {
  app.get("/presets", async () => listPresets(paths.presetsRoot));
};

export default registerPresetRoutes;
