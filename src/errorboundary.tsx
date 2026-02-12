import React from "react";

interface ErrorBoundaryProps {
  name: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
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

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Error caught by ${this.props.name}:`, error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? <h2>{this.props.name} encountered an error.</h2>
      );
    }
    return this.props.fallback ?? this.props.children;
  }
}

export default ErrorBoundary;