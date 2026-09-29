import { useTranslation } from "@/src/shared/i18n";
import { colors } from "@/src/shared/theme/colors";

const DOT_COUNT = 3;
const PULSE_DURATION_MS = 400;
const DOT_STAGGER_MS = 150;

/**
 * Three-dot "the assistant is composing a reply" indicator. The app's
 * Animated opacity loop becomes a CSS animation; `prefers-reduced-motion`
 * stops it, as `usePrefersReducedMotion` does in the app.
 */
export function TypingIndicator() {
  const { t } = useTranslation();

  return (
    <div
      className="flex-row items-center gap-1 rounded-2xl px-4 py-3 bg-brand-surface border border-gray-100 self-start mb-3"
      role="status"
      aria-label={t("chat.typing")}
      aria-live="polite"
    >
      <style>{`@keyframes wf-typing-pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { .wf-typing-dot { animation: none !important; opacity: 1 !important; } }`}</style>
      {Array.from({ length: DOT_COUNT }).map((_, index) => (
        <div
          key={index}
          className="wf-typing-dot"
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.neutral[500],
            opacity: 0.3,
            animation: `wf-typing-pulse ${PULSE_DURATION_MS * 2}ms ease-in-out ${index * DOT_STAGGER_MS}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}
