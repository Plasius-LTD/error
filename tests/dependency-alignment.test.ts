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

    const packageLock = JSON.parse(
      readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
    ) as { packages?: Record<string, { version?: string }> };
    const resolvedReact = packageLock.packages?.["node_modules/react"]?.version;
    const resolvedReactDom =
      packageLock.packages?.["node_modules/react-dom"]?.version;

    expect(resolvedReact).toBeDefined();
    expect(resolvedReactDom).toBe(resolvedReact);
  });
});
