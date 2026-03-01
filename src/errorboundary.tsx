import React from "react";

export type ErrorBoundarySeverity = "error" | "fatal";

export interface ErrorBoundaryReport {
  boundary: string;
  error: unknown;
  componentStack?: string;
  handled?: boolean;
  severity?: ErrorBoundarySeverity;
  context?: Record<string, unknown>;
  timestamp?: number;
}

export interface ErrorBoundaryAnalyticsClient {
  reportError: (report: ErrorBoundaryReport) => void;
}

interface ErrorBoundaryProps {
  name: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  analyticsClient?: ErrorBoundaryAnalyticsClient;
  errorContext?: Record<string, unknown>;
  severity?: ErrorBoundarySeverity;
  onErrorCaptured?: (report: ErrorBoundaryReport, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  private buildErrorReport(error: Error, info: React.ErrorInfo): ErrorBoundaryReport {
    return {
      boundary: this.props.name,
      error,
      componentStack: info.componentStack ?? undefined,
      handled: true,
      severity: this.props.severity ?? "error",
      context: this.props.errorContext,
      timestamp: Date.now(),
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    const report = this.buildErrorReport(error, info);
    this.props.analyticsClient?.reportError(report);
    this.props.onErrorCaptured?.(report, info);
    console.error(`Error caught by ${this.props.name}:`, error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? <h2>{this.props.name} encountered an error.</h2>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
