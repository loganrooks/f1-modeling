import type { PipelineConfig } from "../types";
import { visionAlignment202604Config } from "./visionAlignment202604";

const CONFIG_MAP = new Map<string, PipelineConfig>([
  [visionAlignment202604Config.id, visionAlignment202604Config],
]);

export function getConfig(configId: string): PipelineConfig {
  const config = CONFIG_MAP.get(configId);
  if (!config) {
    throw new Error(
      `Unknown transcript pipeline config "${configId}". Known configs: ${[
        ...CONFIG_MAP.keys(),
      ].join(", ")}`,
    );
  }
  return config;
}
