import { join } from "node:path";

import { documentIdSchema, scenarioDocumentSchema } from "@f1-modeling/domain";
import type { FastifyPluginAsync } from "fastify";
import { ZodError } from "zod";

import type { LocalApiPaths } from "../app.js";
import { listJsonFiles, readJsonFile, writeJsonFile } from "../persistence/fileStore.js";

interface ScenarioRouteOptions {
  paths: LocalApiPaths;
}

function getScenarioFilePath(paths: LocalApiPaths, scenarioId: string): string {
  return join(paths.scenariosDir, `${scenarioId}.json`);
}

function buildValidationError(error: ZodError) {
  return {
    message: "Scenario document validation failed.",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

export const registerScenarioRoutes: FastifyPluginAsync<
  ScenarioRouteOptions
> = async (app, { paths }) => {
  app.get("/scenarios", async () => {
    const documents = await listJsonFiles<unknown>(paths.scenariosDir);
    return documents.map((document) => scenarioDocumentSchema.parse(document));
  });

  app.get<{ Params: { scenarioId: string } }>(
    "/scenarios/:scenarioId",
    async (request, reply) => {
      let scenarioId: string;

      try {
        scenarioId = documentIdSchema.parse(request.params.scenarioId);
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send(buildValidationError(error));
        }

        throw error;
      }

      const document = await readJsonFile<unknown>(
        getScenarioFilePath(paths, scenarioId),
      );

      if (!document) {
        return reply.code(404).send({
          message: `Scenario "${scenarioId}" was not found.`,
        });
      }

      return scenarioDocumentSchema.parse(document);
    },
  );

  app.post("/scenarios", async (request, reply) => {
    try {
      const scenario = scenarioDocumentSchema.parse(request.body);
      const filePath = getScenarioFilePath(paths, scenario.scenarioId);
      const existingScenario = await readJsonFile(filePath);

      await writeJsonFile(filePath, scenario);

      reply.code(existingScenario ? 200 : 201);
      return scenario;
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send(buildValidationError(error));
      }

      throw error;
    }
  });
};

export default registerScenarioRoutes;
