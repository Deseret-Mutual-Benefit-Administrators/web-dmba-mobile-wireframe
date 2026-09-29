import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface SendMessageCtaProps {
  /** i18n key for the primary CTA's label. */
  labelKey: string;
  /** The message topic this Care Navigation pane maps to (`messaging.topics.*`). */
  topic: string;
}

/** "Send a secure message" primary CTA plus a "Call DMBA" link to the Contact screen. */
export function SendMessageCta({ labelKey, topic }: SendMessageCtaProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => navigate(`/messages/compose?topic=${encodeURIComponent(topic)}`)}
        className="flex-row items-center justify-center bg-info-tint rounded-xl py-2.5 active:opacity-80"
        aria-label={t(labelKey)}
        title={t("common.hints.opensNewMessage")}
      >
        <Icon name="chatbubble-ellipses-outline" size={16} color={colors.brand.accent} />
        <span className="text-brand-accent font-semibold ml-1.5">{t(labelKey)}</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/contact")}
        className="flex-row items-center justify-center mt-2 py-1.5 active:opacity-80"
        aria-label={t("careNavigation.messaging.callDmba")}
      >
        <Icon name="call-outline" size={16} color={colors.brand.accent} />
        <span className="text-brand-accent font-semibold ml-1.5">{t("careNavigation.messaging.callDmba")}</span>
      </button>
    </div>
  );
}
