import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../src/errorboundary.js";

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    const child = React.createElement("div", null, "All good");
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      children: child,
    });
    boundary.state = { hasError: false };

    const rendered = boundary.render();
    expect(rendered).toBe(child);
  });

  it("renders fallback when hasError is true", () => {
    const fallback = React.createElement("div", null, "Fallback UI");
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      fallback,
      children: React.createElement("div", null, "Child"),
    });
    boundary.state = { hasError: true };

    const rendered = boundary.render();
    expect(rendered).toBe(fallback);
  });

  it("renders children when no error occurs even if fallback exists", () => {
    const child = React.createElement("div", null, "Child");
    const fallback = React.createElement("div", null, "Fallback UI");
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      children: child,
      fallback,
    });
    boundary.state = { hasError: false };

    const rendered = boundary.render();
    expect(rendered).toBe(child);
  });

  it("renders default fallback message when no fallback is provided", () => {
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      children: React.createElement("div", null, "Child"),
    });
    boundary.state = { hasError: true };

    const rendered = boundary.render();
    expect(React.isValidElement(rendered)).toBe(true);
    if (React.isValidElement(rendered)) {
      const text = Array.isArray(rendered.props.children)
        ? rendered.props.children.join("")
        : rendered.props.children;
      expect(text).toBe("TestBoundary encountered an error.");
    }
  });

  it("sets error state via getDerivedStateFromError", () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({ hasError: true });
  });

  it("reports captured errors through analytics-compatible clients", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const reportError = vi.fn();
    const onErrorCaptured = vi.fn();
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      children: React.createElement("div", null, "Child"),
      analyticsClient: { reportError },
      errorContext: { feature: "checkout", email: "sensitive@example.com" },
      onErrorCaptured,
    });

    const error = new Error("boom");
    const info = {
      componentStack: "\n at Checkout",
    } as React.ErrorInfo;

    boundary.componentDidCatch(error, info);

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        boundary: "TestBoundary",
        error,
        componentStack: "\n at Checkout",
        handled: true,
        severity: "error",
        context: {
          feature: "checkout",
          email: "sensitive@example.com",
        },
      })
    );
    expect(onErrorCaptured).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
});
