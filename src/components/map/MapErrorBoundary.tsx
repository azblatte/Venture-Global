"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">Map failed to load</p>
              <p className="mt-1 text-xs text-slate-400">Please refresh the page</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
