import { useEffect, useState } from "react";
import { toastStore, useToastQueue } from "@/src/shared/stores/toastStore";
import type { ToastTone } from "@/src/shared/stores/toastStore";
import { toastToneClasses } from "./toastToneClasses";

export { toastToneClasses } from "./toastToneClasses";

/** `useToast().show(message, opts)` queues a transient snackbar. No provider needed. */
export function useToast() {
  return {
    show: (message: string, opts?: { tone?: ToastTone; duration?: number }) => {
      toastStore.enqueue(message, opts);
    },
  };
}

/**
 * Renders the queue one at a time as a bottom pill above the tab bar
 * (bottom = safe-area 34 + 80). Mount once inside the phone frame. 200ms fade.
 */
export function ToastHost() {
  const queue = useToastQueue();
  const current = queue[0] ?? null;
  const currentId = current?.id ?? null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (current === null) return undefined;
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => setVisible(false), current.duration);
    const done = setTimeout(() => toastStore.dequeue(), current.duration + 200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      clearTimeout(done);
    };
    // Re-run only when the visible toast changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  if (current === null) return null;
  const classes = toastToneClasses[current.tone];

  return (
    <div
      className="pointer-events-none"
      style={{ position: "absolute", left: 16, right: 16, bottom: 34 + 80, opacity: visible ? 1 : 0, transition: "opacity 200ms", zIndex: 60 }}
      role="status"
      aria-live="polite"
    >
      <div className={`rounded-full px-4 py-3 shadow-sm self-center ${classes.container}`}>
        <span className={`text-sm font-medium font-sans text-center ${classes.text}`}>{current.message}</span>
      </div>
    </div>
  );
}
