# Changelog

All notable changes to this project will be documented in this file.

The format is based on **[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)**, and this project adheres to **[Semantic Versioning](https://semver.org/spec/v2.0.0.html)**.

---

## [Unreleased]

- **Added**
  - (placeholder)

- **Changed**
  - Removed the unused React Router development dependency and refreshed transitive resolutions to clear the current npm audit findings.

- **Fixed**
  - (placeholder)

- **Security**
  - Added fail-closed source and npm-package admission for the administrative contributor registry and pinned the CI/CD runtime to Node.js 24.18.0 LTS.
  - (placeholder)

## [1.0.22] - 2026-07-13

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)
  - Consume the RFC-remediated `@plasius/translations` release (task #36).

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.21] - 2026-06-28

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed the published `@plasius/translations` dependency to `1.0.22`.
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.20] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.19] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.18] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.17] - 2026-05-31

- **Added**
  - Added bundled `en-GB` translation keys for the default `ErrorBoundary` fallback text.

- **Changed**
  - Routed `ErrorBoundary` default fallback copy through `@plasius/translations` with an optional consumer translator override.
  - Exposed `npm run typecheck` as the canonical TypeScript validation gate and routed audit/workflow checks through the same command.
  - Removed the unused `react-router-dom` peer dependency so the published package contract only advertises the React runtime it actually consumes.

- **Fixed**
  - Added pack-time validation that the published tarball includes the root `dist/index.d.ts` declaration entry.
  - Restored the package CD workflow so protected `main` releases are prepared by PR and published without direct branch pushes.

- **Security**
  - (placeholder)

## [1.0.15] - 2026-05-13

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed dependencies to the latest stable published versions.
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.14] - 2026-05-13

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.13] - 2026-04-21

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.12] - 2026-04-21

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.11] - 2026-04-02

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.10] - 2026-03-04

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.6] - 2026-03-01

- **Added**
  - Error-boundary analytics integration hooks (`analyticsClient`, `errorContext`, `onErrorCaptured`).
  - Exported `ErrorBoundaryReport` contract for forwarding boundary crashes to analytics clients.
  - `installGlobalCrashReporter` for browser and process-level crash capture outside React boundaries.

- **Changed**
  - `ErrorBoundary` now forwards captured errors to an injected analytics-compatible client.
  - Corrected render behavior so `fallback` is displayed only after an error is captured.

- **Fixed**
  - Enforced CommonJS runtime compatibility for dual-build output by generating and validating `dist-cjs/package.json` (`type: commonjs`) during build and package verification.
  - Added tests covering analytics forwarding and no-error render behavior with fallback props.
  - Added tests validating global crash capture (`window.error`, `window.unhandledrejection`, process exception/rejection handlers).
  - Fixed CommonJS runtime compatibility by marking `dist-cjs/` output as `type: commonjs`, preventing `exports is not defined in ES module scope` when required by Node consumers.

- **Security**
  - Boundary reporting payload is constrained to essential debugging fields and delegated to analytics sanitization policies.

## [1.0.5] - 2026-02-28

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.4] - 2026-02-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.3] - 2026-02-12

- **Added**
  - Standalone public package scaffold at repository root with independent CI/CD, ADRs, and legal governance assets.

- **Changed**
  - Add dual ESM + CJS build outputs with `exports` entries and CJS artifacts in `dist-cjs/`.

- **Fixed**
  - Removed monorepo-relative TypeScript configuration coupling for standalone builds.

- **Security**
  - Added baseline public package governance and CLA documentation.

---

## Release process (maintainers)

1. Update `CHANGELOG.md` under **Unreleased** with user-visible changes.
2. Bump version in `package.json` following SemVer (major/minor/patch).
3. Move entries from **Unreleased** to a new version section with the current date.
4. Tag the release in Git (`vX.Y.Z`) and push tags.
5. Publish to npm (via CI/CD or `npm publish`).

> Tip: Use Conventional Commits in PR titles/bodies to make changelog updates easier.

---

[Unreleased]: https://github.com/Plasius-LTD/error/compare/v1.0.22...HEAD
[1.0.17]: https://github.com/Plasius-LTD/error/compare/v1.0.15...v1.0.17

## [1.0.0] - 2026-02-11

- **Added**
  - Initial release.

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)
[1.0.3]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.3
[1.0.4]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.4
[1.0.5]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.5
[1.0.6]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.6
[1.0.10]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.10
[1.0.11]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.11
[1.0.12]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.12
[1.0.13]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.13
[1.0.14]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.14
[1.0.15]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.15
[1.0.18]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.18
[1.0.19]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.19
[1.0.20]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.20
[1.0.21]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.21
[1.0.22]: https://github.com/Plasius-LTD/error/releases/tag/v1.0.22
