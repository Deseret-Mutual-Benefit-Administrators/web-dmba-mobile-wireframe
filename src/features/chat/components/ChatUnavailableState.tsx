import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Label } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import type { ChatErrorKind } from "../services/chatCore";

interface ChatUnavailableStateProps {
  kind: "notAvailable" | "rateLimited";
}

/** Calm, no-Try-Again copy for the two chat states that aren't an outage. */
export function ChatUnavailableState({ kind }: ChatUnavailableStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 items-center justify-center px-8">
      <Icon name="chatbubble-ellipses-outline" size={40} color={colors.neutral[500]} />
      <Label className="text-center mt-3">{t(kind === "notAvailable" ? "chat.unavailable" : "chat.rateLimited")}</Label>
    </div>
  );
}

export type ChatUnavailableKind = Extract<ChatErrorKind, "notAvailable" | "rateLimited">;
