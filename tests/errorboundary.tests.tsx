import React from "react";
import { describe, expect, it } from "vitest";
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
});
