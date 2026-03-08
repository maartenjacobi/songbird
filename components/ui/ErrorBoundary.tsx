"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SongBird error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center space-y-3 max-w-sm">
            <div className="text-2xl">:/</div>
            <h2 className="text-sm font-medium text-zinc-300">
              Er ging iets mis
            </h2>
            <p className="text-xs text-zinc-500">
              {this.state.error?.message || "Onbekende fout"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
            >
              Probeer opnieuw
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
