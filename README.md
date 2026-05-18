# @plasius/error

[![npm version](https://img.shields.io/npm/v/@plasius/error.svg)](https://www.npmjs.com/package/@plasius/error)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/error/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/error/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/error)](https://codecov.io/gh/Plasius-LTD/error)
[![License](https://img.shields.io/github/license/Plasius-LTD/error)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

Public package containing shared error boundary and error-handling utilities for Plasius React applications.


## Install

```bash
npm install @plasius/error
```

## Module formats

`@plasius/error` ships dual module outputs:

- ESM via `exports.import` (`dist/index.js`)
- CJS via `exports.require` (`dist-cjs/index.js`, explicitly marked CommonJS)

## Usage

```ts
import { ErrorBoundary } from "@plasius/error";
```

### Error reporting with `@plasius/analytics`

`ErrorBoundary` can forward captured errors into an analytics-compatible client:

```tsx
import { ErrorBoundary } from "@plasius/error";
import { createFrontendAnalyticsClient } from "@plasius/analytics";

const analytics = createFrontendAnalyticsClient({
  source: "sharedcomponents",
  endpoint: "https://analytics.example.com/collect",
});

<ErrorBoundary
  name="CheckoutBoundary"
  analyticsClient={analytics}
  errorContext={{ feature: "checkout" }}
>
  <CheckoutPage />
</ErrorBoundary>;
```

The boundary forwards a minimal report (`boundary`, `error`, component stack, severity, context), and `@plasius/analytics` handles sanitization and secure transport rules.

### Whole application crash capture

`installGlobalCrashReporter` captures crashes outside React boundaries where available:
- browser: `window.error`, `window.unhandledrejection`
- server/runtime: `process.uncaughtException`, `process.unhandledRejection`

```ts
import {
  ErrorBoundary,
  installGlobalCrashReporter,
} from "@plasius/error";

const crashReporter = installGlobalCrashReporter({
  boundaryName: "GlobalApplication",
  analyticsClient: analytics,
  errorContext: { app: "frontend" },
});

// later during teardown
crashReporter.dispose();
```

## Development

```bash
npm ci
npm run typecheck
npm run build
npm test
```

## Governance

- Security policy: [SECURITY.md](./SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- ADRs: [docs/adrs](./docs/adrs)
- Legal docs: [legal](./legal)

## License

MIT
