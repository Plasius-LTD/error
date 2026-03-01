import { describe, expect, it, vi } from "vitest";
import { installGlobalCrashReporter } from "../src/globalcrash.js";

describe("installGlobalCrashReporter", () => {
  it("captures browser unhandled errors and promise rejections", () => {
    const reportError = vi.fn();
    const listeners = new Map<string, Array<(event: unknown) => void>>();

    const windowMock = {
      addEventListener: vi.fn((eventName: string, handler: (event: unknown) => void) => {
        const existing = listeners.get(eventName) ?? [];
        existing.push(handler);
        listeners.set(eventName, existing);
      }),
      removeEventListener: vi.fn((eventName: string, handler: (event: unknown) => void) => {
        const existing = listeners.get(eventName) ?? [];
        listeners.set(
          eventName,
          existing.filter((candidate) => candidate !== handler)
        );
      }),
    };

    const previousWindow = (globalThis as { window?: unknown }).window;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: windowMock,
    });

    const reporter = installGlobalCrashReporter({
      boundaryName: "AppRoot",
      analyticsClient: { reportError },
      errorContext: { app: "frontend" },
      captureProcessErrors: false,
    });

    const errorHandler = listeners.get("error")?.[0];
    const rejectionHandler = listeners.get("unhandledrejection")?.[0];

    errorHandler?.({
      error: new Error("uncaught"),
      filename: "https://example.com/main.js",
      lineno: 77,
      colno: 9,
    });

    rejectionHandler?.({
      reason: "async failure",
    });

    expect(reportError).toHaveBeenCalledTimes(2);

    expect(reportError.mock.calls[0]?.[0]).toMatchObject({
      boundary: "AppRoot",
      handled: false,
      severity: "fatal",
      context: {
        app: "frontend",
        crashOrigin: "window.error",
        filename: "https://example.com/main.js",
        lineno: 77,
        colno: 9,
      },
    });

    expect(reportError.mock.calls[1]?.[0]).toMatchObject({
      boundary: "AppRoot",
      handled: false,
      severity: "fatal",
      context: {
        app: "frontend",
        crashOrigin: "window.unhandledrejection",
      },
    });

    reporter.dispose();
    expect(windowMock.removeEventListener).toHaveBeenCalledTimes(2);

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: previousWindow,
    });
  });

  it("captures process-level uncaught exceptions and unhandled rejections", () => {
    const reportError = vi.fn();

    const capturedHandlers = new Map<string, (...args: unknown[]) => void>();

    const onSpy = vi.spyOn(process, "on").mockImplementation((eventName, handler) => {
      capturedHandlers.set(String(eventName), handler as (...args: unknown[]) => void);
      return process;
    });

    const offSpy = vi.spyOn(process, "off").mockImplementation((eventName) => {
      capturedHandlers.delete(String(eventName));
      return process;
    });

    const reporter = installGlobalCrashReporter({
      analyticsClient: { reportError },
      captureBrowserErrors: false,
      captureBrowserRejections: false,
      errorContext: { app: "backend" },
    });

    const uncaughtHandler = capturedHandlers.get("uncaughtException");
    const rejectionHandler = capturedHandlers.get("unhandledRejection");

    uncaughtHandler?.(new Error("server crash"));
    rejectionHandler?.("promise crash");

    expect(reportError).toHaveBeenCalledTimes(2);

    expect(reportError.mock.calls[0]?.[0]).toMatchObject({
      boundary: "GlobalApplication",
      handled: false,
      severity: "fatal",
      context: {
        app: "backend",
        crashOrigin: "process.uncaughtException",
      },
    });

    expect(reportError.mock.calls[1]?.[0]).toMatchObject({
      boundary: "GlobalApplication",
      handled: false,
      severity: "fatal",
      context: {
        app: "backend",
        crashOrigin: "process.unhandledRejection",
      },
    });

    reporter.dispose();
    expect(offSpy).toHaveBeenCalledWith("uncaughtException", expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith("unhandledRejection", expect.any(Function));

    onSpy.mockRestore();
    offSpy.mockRestore();
  });
});
