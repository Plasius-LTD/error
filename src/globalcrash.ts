import type {
  ErrorBoundaryAnalyticsClient,
  ErrorBoundaryReport,
  ErrorBoundarySeverity,
} from "./errorboundary.js";

export type GlobalCrashOrigin =
  | "window.error"
  | "window.unhandledrejection"
  | "process.uncaughtException"
  | "process.unhandledRejection";

export interface GlobalCrashReporterOptions {
  boundaryName?: string;
  analyticsClient?: ErrorBoundaryAnalyticsClient;
  errorContext?: Record<string, unknown>;
  severity?: ErrorBoundarySeverity;
  onErrorCaptured?: (report: ErrorBoundaryReport, origin: GlobalCrashOrigin) => void;
  captureBrowserErrors?: boolean;
  captureBrowserRejections?: boolean;
  captureProcessErrors?: boolean;
}

export interface GlobalCrashReporterController {
  dispose: () => void;
}

type BrowserEventTarget = {
  addEventListener: (eventName: string, handler: (event: unknown) => void) => void;
  removeEventListener: (eventName: string, handler: (event: unknown) => void) => void;
};

type NodeProcessTarget = {
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  off: (eventName: string, handler: (...args: unknown[]) => void) => void;
};

function isBrowserEventTarget(value: unknown): value is BrowserEventTarget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BrowserEventTarget>;
  return (
    typeof candidate.addEventListener === "function" &&
    typeof candidate.removeEventListener === "function"
  );
}

function isNodeProcessTarget(value: unknown): value is NodeProcessTarget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<NodeProcessTarget>;
  return typeof candidate.on === "function" && typeof candidate.off === "function";
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  if (error === null || error === undefined) {
    return new Error("Unknown crash reason");
  }

  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error(String(error));
  }
}

function extractErrorEventContext(event: unknown): {
  error: unknown;
  details: Record<string, unknown>;
} {
  const details: Record<string, unknown> = {};

  if (!event || typeof event !== "object") {
    return {
      error: event,
      details,
    };
  }

  const record = event as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim()) {
    details.message = record.message;
  }

  if (typeof record.filename === "string" && record.filename.trim()) {
    details.filename = record.filename;
  }

  if (typeof record.lineno === "number") {
    details.lineno = record.lineno;
  }

  if (typeof record.colno === "number") {
    details.colno = record.colno;
  }

  return {
    error: record.error ?? record.reason ?? record,
    details,
  };
}

export function installGlobalCrashReporter(
  options: GlobalCrashReporterOptions = {}
): GlobalCrashReporterController {
  const boundaryName = options.boundaryName?.trim() || "GlobalApplication";
  const severity = options.severity ?? "fatal";
  const baseContext = {
    ...(options.errorContext ?? {}),
  };

  const disposers: Array<() => void> = [];

  const emitReport = (
    origin: GlobalCrashOrigin,
    rawError: unknown,
    contextDetails: Record<string, unknown> = {}
  ) => {
    const error = normalizeError(rawError);
    const report: ErrorBoundaryReport = {
      boundary: boundaryName,
      error,
      handled: false,
      severity,
      context: {
        ...baseContext,
        crashOrigin: origin,
        ...contextDetails,
      },
      timestamp: Date.now(),
    };

    options.analyticsClient?.reportError(report);
    options.onErrorCaptured?.(report, origin);
  };

  const browserGlobal =
    typeof window !== "undefined" ? window : (globalThis as { window?: unknown }).window;

  if (isBrowserEventTarget(browserGlobal)) {
    if (options.captureBrowserErrors !== false) {
      const handleBrowserError = (event: unknown) => {
        const { error, details } = extractErrorEventContext(event);
        emitReport("window.error", error, details);
      };

      browserGlobal.addEventListener("error", handleBrowserError);
      disposers.push(() => {
        browserGlobal.removeEventListener("error", handleBrowserError);
      });
    }

    if (options.captureBrowserRejections !== false) {
      const handleUnhandledRejection = (event: unknown) => {
        const { error, details } = extractErrorEventContext(event);
        emitReport("window.unhandledrejection", error, details);
      };

      browserGlobal.addEventListener("unhandledrejection", handleUnhandledRejection);
      disposers.push(() => {
        browserGlobal.removeEventListener("unhandledrejection", handleUnhandledRejection);
      });
    }
  }

  const processGlobal = (globalThis as { process?: unknown }).process;

  if (options.captureProcessErrors !== false && isNodeProcessTarget(processGlobal)) {
    const handleUncaughtException = (error: unknown) => {
      emitReport("process.uncaughtException", error);
    };

    const handleUnhandledRejection = (reason: unknown) => {
      emitReport("process.unhandledRejection", reason);
    };

    processGlobal.on("uncaughtException", handleUncaughtException);
    processGlobal.on("unhandledRejection", handleUnhandledRejection);

    disposers.push(() => {
      processGlobal.off("uncaughtException", handleUncaughtException);
      processGlobal.off("unhandledRejection", handleUnhandledRejection);
    });
  }

  let disposed = false;

  return {
    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;
      for (const dispose of disposers) {
        dispose();
      }
      disposers.length = 0;
    },
  };
}
