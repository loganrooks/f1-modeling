import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  loadProjectTemplate,
} from "../assets.js";
import {
  planProjectReconcile,
  reconcileProject,
  verifyProject,
} from "../index.js";

async function makeProjectRoot(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "fa-harness-project-"));
}

describe("project reconcile", () => {
  it("bootstraps a fresh project", async () => {
    const projectRoot = await makeProjectRoot();

    await reconcileProject("bootstrap", { projectRoot });

    expect(
      await fs.readFile(path.join(projectRoot, ".planning", "LONG-ARC.md"), "utf8"),
    ).toMatch(/Long-Arc Planning Doctrine/);
    expect(
      await fs.readFile(path.join(projectRoot, "WORKFLOW.md"), "utf8"),
    ).toMatch(/Standard Planning Loop/);
    expect(
      await fs.readFile(path.join(projectRoot, ".planning", ".future-aware-framework.json"), "utf8"),
    ).toMatch(/future-aware-harness/);

    const verification = await verifyProject({ projectRoot });
    expect(verification.ok).toBe(true);
  });

  it("upgrades a partial repo and wraps the legacy root routing block", async () => {
    const projectRoot = await makeProjectRoot();
    await fs.mkdir(path.join(projectRoot, ".planning"), { recursive: true });
    const rootRouting = await loadProjectTemplate("root-agents-routing.md");
    await fs.writeFile(
      path.join(projectRoot, "AGENTS.md"),
      `${rootRouting}\n\n# Existing Guidance\n`,
      "utf8",
    );

    await reconcileProject("upgrade", { projectRoot });

    const content = await fs.readFile(path.join(projectRoot, "AGENTS.md"), "utf8");
    expect(content).toMatch(/future-aware-harness:begin root-planning-routing/);
    expect(content).toMatch(/# Existing Guidance/);

    const verification = await verifyProject({ projectRoot });
    expect(verification.ok).toBe(true);
  });

  it("blocks unmanaged conflicts on framework-owned files", async () => {
    const projectRoot = await makeProjectRoot();
    await fs.mkdir(path.join(projectRoot, ".planning"), { recursive: true });
    await fs.writeFile(
      path.join(projectRoot, ".planning", "AGENTS.md"),
      "local custom planning agents\n",
      "utf8",
    );

    const plan = await planProjectReconcile("upgrade", { projectRoot });
    expect(plan.blockedReason).toMatch(/conflicting managed file/);
    expect(
      plan.actions.find((action) => action.id === "planning-agents")?.action,
    ).toBe("blocked");
  });
});
