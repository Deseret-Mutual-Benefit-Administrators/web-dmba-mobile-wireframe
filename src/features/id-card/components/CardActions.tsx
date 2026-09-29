import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Button } from "@/src/shared/components/Button";
import type { CachedIdCard } from "../types";

/**
 * Card action buttons — flip, download/share, request new.
 * Layout: 2-column grid for flip + share, full-width for request new.
 * Download opens the system share sheet in the app; inert in the wireframe.
 */
export function CardActions({
  card,
  showBack,
  onFlip,
}: {
  card: CachedIdCard | null;
  showBack: boolean;
  onFlip: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleShare() {
    // The app decrypts the face to a temp PNG and opens the share sheet.
  }

  // A new-card request is an ordinary secure message with a pre-filled subject (ADR-199).
  function handleRequestNew() {
    const params = new URLSearchParams({ topic: "idCard", subject: t("idCard.requestNewSubject") });
    navigate(`/messages/compose?${params.toString()}`);
  }

  return (
    <div className="mx-4">
      {/* 2-column grid: Flip + Share/Download */}
      <div className="flex-row gap-3 mb-3">
        <button
          type="button"
          onClick={onFlip}
          className="flex-1 bg-brand-surface rounded-2xl py-3 flex-row items-center justify-center shadow-sm active:opacity-80"
          aria-label={t("idCard.flip")}
          aria-description={t(showBack ? "idCard.flipHintBack" : "idCard.flipHintFront")}
        >
          <Icon name="sync-outline" size={20} color={colors.brand.accent} />
          <span className="text-brand-accent font-semibold ml-2">{t("idCard.flip")}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={!card}
          className="flex-1 bg-brand-surface rounded-2xl py-3 flex-row items-center justify-center shadow-sm active:opacity-80"
          aria-label={t("idCard.download")}
          aria-description={t("common.hints.opensShareSheet")}
        >
          <Icon name="share-outline" size={20} color={colors.brand.accent} />
          <span className="text-brand-accent font-semibold ml-2">{t("idCard.download")}</span>
        </button>
      </div>

      {/* Request New Card */}
      <Button
        label={t("idCard.requestNew")}
        onPress={handleRequestNew}
        fullWidth
        icon={<Icon name="add-circle-outline" size={20} color={colors.brand.surface} />}
      />
    </div>
  );
}
