/**
 * Module-level toast queue — the web stand-in for the app's Zustand
 * `toastStore`. No provider needed: `useToast()` enqueues from anywhere and the
 * single mounted `ToastHost` renders the queue. Built on React's
 * `useSyncExternalStore`, so it adds no dependency.
 */
import { useSyncExternalStore } from "react";

export type ToastTone = "neutral" | "success" | "error";

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
}

let queue: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export const toastStore = {
  enqueue(message: string, opts?: { tone?: ToastTone; duration?: number }) {
    queue = [...queue, { id: nextId++, message, tone: opts?.tone ?? "neutral", duration: opts?.duration ?? 3000 }];
    emit();
  },
  dequeue() {
    queue = queue.slice(1);
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getQueue() {
    return queue;
  },
};

export function useToastQueue(): ToastItem[] {
  return useSyncExternalStore(toastStore.subscribe, toastStore.getQueue, toastStore.getQueue);
}
