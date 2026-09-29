/**
 * Shared amber informational banner for FA-2 clarity guardrails — use-it-or-lose-it
 * notices, HSA+FSA conflict warnings, and similar plan-rule callouts (ADR-099).
 */
interface GuardrailBannerProps {
  message: string;
  accessibilityLabel?: string;
}

export function GuardrailBanner({ message, accessibilityLabel }: GuardrailBannerProps) {
  return (
    <div className="bg-amber-50 rounded-xl px-4 py-3 mt-3" role="note" aria-label={accessibilityLabel ?? message}>
      <p className="text-xs text-amber-700">{message}</p>
    </div>
  );
}
