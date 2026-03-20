import { documentIdSchema } from "@f1-modeling/domain";
import type { FastifyPluginAsync } from "fastify";
import { z, ZodError } from "zod";

import type { LocalApiPaths } from "../app.js";
import {
  createPhase1Run,
  listRuns,
  RunDependencyError,
  ScenarioNotFoundError,
} from "../services/runService.js";

interface RunRouteOptions {
  paths: LocalApiPaths;
}

const createRunRequestSchema = z
  .object({
    scenarioId: documentIdSchema,
  })
  .strict();

function buildValidationError(error: ZodError) {
  return {
    message: "Run request validation failed.",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

export const registerRunRoutes: FastifyPluginAsync<RunRouteOptions> = async (
  app,
  { paths },
) => {
  app.get("/runs", async () => listRuns(paths));

  app.post("/runs", async (request, reply) => {
    try {
      const body = createRunRequestSchema.parse(request.body);
      const runRecord = await createPhase1Run(paths, body);

      reply.code(201);
      return runRecord;
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send(buildValidationError(error));
      }

      if (error instanceof ScenarioNotFoundError) {
        return reply.code(404).send({ message: error.message });
      }

      if (error instanceof RunDependencyError) {
        return reply.code(400).send({ message: error.message });
      }

      throw error;
    }
  });
};

export default registerRunRoutes;
