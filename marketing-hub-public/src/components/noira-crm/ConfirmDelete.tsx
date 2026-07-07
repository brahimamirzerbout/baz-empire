// ============================================================================
// ConfirmDelete — inline confirmation for destructive actions
// ============================================================================
// One-button-tap pattern: the user taps a delete button; the button changes
// to a "Confirm?" state with a 3-second window. Tapping again commits.
// Tapping elsewhere cancels.
//
// This is faster than opening a modal for every delete, and prevents the
// "fat-finger delete" problem. For HIGH-stakes deletes (e.g. a deal worth
// >$100K) the parent can opt into the full `ConfirmModal` instead.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { Trash, Check, Close } from "./svgs";
import { cn } from "@/lib/utils";

interface ConfirmDeleteProps {
  /** What the delete affects; shown to the user for context. */
  label: string;
  /** Commit the deletion. Should resolve when the mutation succeeds. */
  onConfirm: () => void | Promise<void>;
  /** Optional: skip confirm step (use for low-stakes deletes). */
  instant?: boolean;
  /** Optional icon-only mode (no label text). */
  iconOnly?: boolean;
  className?: string;
}

export function ConfirmDelete({
  label,
  onConfirm,
  instant = false,
  iconOnly = false,
  className,
}: ConfirmDeleteProps) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cancel after 3 seconds.
  useEffect(() => {
    if (!confirming) return;
    timerRef.current = setTimeout(() => setConfirming(false), 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [confirming]);

  // Click outside to cancel.
  useEffect(() => {
    if (!confirming) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [confirming]);

  const handleClick = async () => {
    if (instant || confirming) {
      setPending(true);
      try {
        await onConfirm();
      } finally {
        setPending(false);
        setConfirming(false);
      }
    } else {
      setConfirming(true);
    }
  };

  if (confirming) {
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-1", className)}>
        <button
          type="button"
          disabled={pending}
          onClick={handleClick}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500 text-white text-[11px] hover:bg-rose-600 disabled:opacity-50"
          aria-label={`Confirm delete ${label}`}
        >
          <Check className="h-3 w-3" />
          {pending ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex items-center px-1.5 py-1 rounded-md text-light-3 hover:text-light-1 text-[11px]"
          aria-label="Cancel delete"
        >
          <Close className="h-3 w-3" />
        </button>
        {!iconOnly && <span className="text-[10px] text-light-3 ml-1">deleting {label}…</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 text-rose-300 hover:text-rose-200 text-[11px]",
        className,
      )}
      aria-label={`Delete ${label}`}
      title={`Delete ${label}`}
    >
      <Trash className="h-3.5 w-3.5" />
      {!iconOnly && <span>Delete</span>}
    </button>
  );
}
