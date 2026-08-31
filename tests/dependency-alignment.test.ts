import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("development dependency alignment", () => {
  it("keeps React and React DOM on the same version range", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as { devDependencies?: Record<string, string> };

    expect(packageJson.devDependencies?.react).toBeDefined();
    expect(packageJson.devDependencies?.["react-dom"]).toBe(
      packageJson.devDependencies?.react,
    );
  });
});
