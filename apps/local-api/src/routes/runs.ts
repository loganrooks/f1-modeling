import { documentIdSchema } from "@f1-modeling/domain";
import type { FastifyPluginAsync } from "fastify";
import { z, ZodError } from "zod";

import type { LocalApiPaths } from "../app.js";
import {
  createLapModelRun,
  createPhase1Run,
  createRaceSimulationRun,
  createStintModelRun,
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
    harnessId: z.enum(["qss-lap-model", "phase1-placeholder", "stint-model", "race-simulation"]).optional(),
    experimentTag: z.string().optional(),
    parentRunId: z.string().optional(),
    branchPoint: z.object({
      stintIndex: z.number(),
      raceLap: z.number(),
      branchType: z.enum(["stint-boundary"]),
    }).optional(),
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

      let runRecord;

      if (body.harnessId === "phase1-placeholder") {
        runRecord = await createPhase1Run(paths, body);
      } else if (body.harnessId === "stint-model") {
        runRecord = await createStintModelRun(paths, body);
      } else if (body.harnessId === "race-simulation") {
        runRecord = await createRaceSimulationRun(paths, body);
      } else if (body.harnessId === "qss-lap-model") {
        runRecord = await createLapModelRun(paths, body);
      } else {
        // No explicit harnessId: try lap model, fall back to placeholder
        // if the circuit cannot be resolved.
        try {
          runRecord = await createLapModelRun(paths, body);
        } catch (lapError) {
          if (lapError instanceof RunDependencyError) {
            runRecord = await createPhase1Run(paths, body);
          } else {
            throw lapError;
          }
        }
      }

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
