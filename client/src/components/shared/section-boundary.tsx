"use client";

import { RefreshCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TSectionBoundaryProps = {
  children: ReactNode;
  /** Used in the console report and the fallback label. */
  name: string;
};

type TSectionBoundaryState = { hasError: boolean };

/**
 * Isolates a homepage section: if one section throws while rendering, the rest
 * of the page stays up and the visitor gets a retry button instead of the
 * whole-page error screen.
 */
export class SectionBoundary extends Component<TSectionBoundaryProps, TSectionBoundaryState> {
  state: TSectionBoundaryState = { hasError: false };

  static getDerivedStateFromError(): TSectionBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SectionBoundary] "${this.props.name}" failed to render`, error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="container-custom py-16 text-center">
        <p className="text-sm text-muted">The {this.props.name} section couldn&apos;t be displayed.</p>
        <button
          type="button"
          onClick={() => this.setState({ hasError: false })}
          className={cn(buttonVariants({ variant: "glass", size: "sm" }), "mt-4 gap-2")}
        >
          <RefreshCcw size={14} />
          Try again
        </button>
      </div>
    );
  }
}
