"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

type StatusToggleProps = {
  isEnabled: boolean;
  onToggle: (newState: boolean) => Promise<void> | void;
  label?: string;
  disabled?: boolean;
};

export function StatusToggle({
  isEnabled,
  onToggle,
  label,
  disabled = false
}: StatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    try {
      setIsLoading(true);
      await onToggle(!isEnabled);
    } catch (error) {
      console.error("Failed to toggle status", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-xs font-medium cursor-pointer transition ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          isEnabled ? "bg-(--color-accent)" : "bg-neutral-700"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            isEnabled ? "translate-x-4.5" : "translate-x-1"
          }`}
        />
      </div>
      {isLoading ? (
        <Loader2 size={12} className="animate-spin text-normal" />
      ) : label ? (
        <span className={isEnabled ? "text-accent" : "text-normal"}>
          {label}
        </span>
      ) : (
        <span className={isEnabled ? "text-accent" : "text-normal"}>
          {isEnabled ? "Active" : "Disabled"}
        </span>
      )}
    </button>
  );
}
