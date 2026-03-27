import type { CircuitDocument } from "@f1-modeling/domain";
import { loadCircuitCatalogFromDisk } from "@f1-modeling/domain/node/circuit-catalog";
import type { FastifyPluginAsync } from "fastify";
import { join } from "node:path";

import type { LocalApiPaths } from "../app.js";

interface CircuitRouteOptions {
  paths: LocalApiPaths;
}

export const registerCircuitRoutes: FastifyPluginAsync<CircuitRouteOptions> = async (
  app,
  { paths },
) => {
  app.get("/circuits", async (): Promise<CircuitDocument[]> => {
    return loadCircuitCatalogFromDisk(join(paths.presetsRoot, "circuits"));
  });
};

export default registerCircuitRoutes;
