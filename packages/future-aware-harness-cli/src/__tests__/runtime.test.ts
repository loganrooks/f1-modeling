import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  inspectRuntime,
  reconcileRuntime,
  restoreRuntime,
  verifyRuntime,
} from "../index.js";

const packageRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "..",
);
const generatedRoot = path.join(packageRoot, "generated-assets", "runtime");

async function writeSyntheticRuntimeAssets(): Promise<void> {
  await fs.rm(generatedRoot, { recursive: true, force: true });
  await fs.mkdir(
    path.join(generatedRoot, "overlay", "get-shit-done-reflect", "workflows"),
    { recursive: true },
  );

  const overlayContent = "overlay progress\n";
  await fs.writeFile(
    path.join(
      generatedRoot,
      "overlay",
      "get-shit-done-reflect",
      "workflows",
      "progress.md",
    ),
    overlayContent,
    "utf8",
  );

  const { createHash } = await import("node:crypto");
  const hash = (value: string) =>
    createHash("sha256").update(value).digest("hex");

  await fs.writeFile(
    path.join(generatedRoot, "manifest.json"),
    `${JSON.stringify(
      {
        manifestVersion: 1,
        frameworkName: "future-aware-harness",
        frameworkVersion: "0.1.0",
        runtimeRootDefault: "$HOME/.codex/get-shit-done-reflect",
        receiptDirname: ".future-aware-harness",
        legacyReceiptDirnames: [".legacy-harness"],
        compatibilityProfiles: [
          {
            id: "synthetic",
            label: "Synthetic profile",
            targets: [
              {
                relativePath: "workflows/progress.md",
                role: "progress workflow",
                expectedUpstreamSha256: hash("upstream progress\n"),
                overlaySha256: hash(overlayContent),
              },
            ],
          },
        ],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

async function makeRuntimeRoot(): Promise<string> {
  const runtimeRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "fa-harness-runtime-"),
  );
  await fs.mkdir(path.join(runtimeRoot, "workflows"), { recursive: true });
  await fs.writeFile(
    path.join(runtimeRoot, "workflows", "progress.md"),
    "upstream progress\n",
    "utf8",
  );
  return runtimeRoot;
}

afterEach(async () => {
  await fs.rm(generatedRoot, { recursive: true, force: true });
});

describe.sequential("runtime reconcile", () => {
  it("installs overlay content and verifies it", async () => {
    await writeSyntheticRuntimeAssets();
    const runtimeRoot = await makeRuntimeRoot();

    const inspection = await inspectRuntime({ runtimeRoot });
    expect(inspection.state).toBe("upstream_current");
    expect(inspection.recommendedAction).toBe("install-runtime");

    await reconcileRuntime("install", { runtimeRoot });
    const content = await fs.readFile(
      path.join(runtimeRoot, "workflows", "progress.md"),
      "utf8",
    );
    expect(content).toBe("overlay progress\n");

    const verification = await verifyRuntime({ runtimeRoot });
    expect(verification.ok).toBe(true);
  });

  it("restores from the recorded backup", async () => {
    await writeSyntheticRuntimeAssets();
    const runtimeRoot = await makeRuntimeRoot();

    await reconcileRuntime("install", { runtimeRoot });
    await restoreRuntime({ runtimeRoot });

    const content = await fs.readFile(
      path.join(runtimeRoot, "workflows", "progress.md"),
      "utf8",
    );
    expect(content).toBe("upstream progress\n");
  });

  it("fails verification on runtime drift", async () => {
    await writeSyntheticRuntimeAssets();
    const runtimeRoot = await makeRuntimeRoot();

    await reconcileRuntime("install", { runtimeRoot });
    await fs.writeFile(
      path.join(runtimeRoot, "workflows", "progress.md"),
      "drifted progress\n",
      "utf8",
    );

    const verification = await verifyRuntime({ runtimeRoot });
    expect(verification.ok).toBe(false);
    expect(verification.issues[0]).toMatch(/Runtime state is drift/);
  });
});
