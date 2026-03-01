# ADR-0003: Dual ESM and CJS Runtime Compatibility

- Date: 2026-03-01
- Status: Accepted

## Context

`@plasius/error` is published with `type: module` and dual exports for ESM and CJS
consumers. The CJS build artifacts are emitted under `dist-cjs/*.js`, and Node
can interpret those files as ESM unless that directory is explicitly marked as
CommonJS.

This caused Node `require("@plasius/error")` consumers to fail at runtime with:
`exports is not defined in ES module scope`.

## Decision

Keep dual output and explicitly mark the `dist-cjs/` build directory with a
generated `dist-cjs/package.json` containing:

```json
{
  "type": "commonjs"
}
```

Add publish verification checks to ensure this metadata exists and is included
in the packed artifact.

## Consequences

- CJS consumers resolve and execute `@plasius/error` reliably.
- ESM consumers remain unchanged (`dist/index.js`).
- Packaging safety improves by preventing accidental regressions during release.
