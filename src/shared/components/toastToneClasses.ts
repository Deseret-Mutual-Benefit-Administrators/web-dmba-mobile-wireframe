/**
 * Pure tone → class-pair map behind `Toast.tsx` — see `buttonClasses.ts` for
 * why this lives in a React-Native-free sibling module.
 */
import type { ToastTone } from "@/src/shared/stores/toastStore";

export interface ToastToneClasses {
  container: string;
  text: string;
}

export const toastToneClasses: Record<ToastTone, ToastToneClasses> = {
  neutral: { container: "bg-brand-primary", text: "text-white" },
  success: { container: "bg-success", text: "text-white" },
  error: { container: "bg-error", text: "text-white" },
};
