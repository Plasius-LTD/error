import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../src/errorboundary.js";
import {
  errorBoundaryTranslationKeys,
  translateErrorBoundaryText,
} from "../src/i18n.js";
import * as publicApi from "../src/index.js";

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

  it("renders translated default fallback text when a translator is provided", () => {
    const translate = vi.fn((key, args) => {
      if (key === errorBoundaryTranslationKeys.defaultFallback) {
        return `Localized fallback for ${String(args?.boundary)}`;
      }

      return undefined;
    });
    const boundary = new ErrorBoundary({
      name: "TestBoundary",
      children: React.createElement("div", null, "Child"),
      translate,
    });
    boundary.state = { hasError: true };

    const rendered = boundary.render();
    expect(React.isValidElement(rendered)).toBe(true);
    if (React.isValidElement(rendered)) {
      expect(rendered.props.children).toBe("Localized fallback for TestBoundary");
    }
    expect(translate).toHaveBeenCalledWith(
      errorBoundaryTranslationKeys.defaultFallback,
      { boundary: "TestBoundary" }
    );
  });

  it("falls back to bundled en-GB translations when translator returns a key", () => {
    const message = translateErrorBoundaryText(
      errorBoundaryTranslationKeys.defaultFallback,
      { boundary: "AccountBoundary" },
      (key) => key
    );

    expect(message).toBe("AccountBoundary encountered an error.");
  });

  it("exports translation helpers from the package entrypoint", () => {
    expect(publicApi.errorBoundaryTranslationKeys.defaultFallback).toBe(
      errorBoundaryTranslationKeys.defaultFallback
    );
    expect(publicApi.translateErrorBoundaryText).toBe(translateErrorBoundaryText);
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
