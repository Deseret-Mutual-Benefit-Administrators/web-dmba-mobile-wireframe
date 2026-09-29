interface LoginErrorBannerProps {
  message: string;
  /** Extra spacing classes — each login step places the banner differently. */
  className?: string;
}

/**
 * The one error banner for every step of the login flow. `role="alert"` stands
 * in for the app's alert role + explicit screen-reader announcement.
 * Renders nothing for an empty message.
 */
export function LoginErrorBanner({ message, className = "" }: LoginErrorBannerProps) {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl px-4 py-3 ${className}`} role="alert" aria-live="assertive">
      <span className="text-error text-sm">{message}</span>
    </div>
  );
}
