"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirm dialog action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              destructive ? "bg-red-500/10 text-red-400" : "bg-(--color-accent)/10 text-accent"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-highlight">{title}</h3>
            <p className="text-xs text-normal mt-0.5">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-semibold ${
              destructive
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-(--color-accent) text-white"
            }`}
          >
            {isLoading && <Loader2 size={14} className="mr-2 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
