import { useTranslation } from "@/src/shared/i18n";
import { Caption } from "@/src/shared/components/Typography";

/** The standing disclaimer above the first turn of every conversation (plan §1.8). */
export function DisclaimerLine() {
  const { t } = useTranslation();

  return <Caption className="text-center mb-3 px-2">{t("chat.disclaimer")}</Caption>;
}
