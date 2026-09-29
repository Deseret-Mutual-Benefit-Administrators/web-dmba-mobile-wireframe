import type { ReactNode } from "react";
import { colors } from "@/src/shared/theme/colors";

interface FormFieldShellProps {
  /** Visible label, already resolved by the caller (may be vendor copy). */
  label: string;
  required?: boolean;
  /** Resolved error message, or null when the field is valid. */
  error?: string | null;
  /** Optional guidance under the field. */
  helpText?: string | null;
  children: ReactNode;
}

/** Label, required asterisk, help text and inline error — one shell for every field. */
export function FormFieldShell({ label, required = false, error = null, helpText = null, children }: FormFieldShellProps) {
  return (
    <div className="mb-4">
      {label !== "" && (
        <div className="flex-row items-center mb-1.5">
          <span className="text-sm font-medium text-brand-primary">{label}</span>
          {required && (
            <span className="text-sm ml-0.5" style={{ color: colors.error }} aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <span className="text-xs mt-1.5" style={{ color: colors.error }} role="alert">
          {error}
        </span>
      ) : (
        helpText !== null && helpText !== "" && <span className="text-xs text-gray-500 mt-1.5">{helpText}</span>
      )}
    </div>
  );
}
