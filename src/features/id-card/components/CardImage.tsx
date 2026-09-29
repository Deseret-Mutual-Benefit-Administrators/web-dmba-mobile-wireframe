import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Caption } from "@/src/shared/components/Typography";
import { Button } from "@/src/shared/components/Button";
import type { CachedIdCard } from "../types";
import { IdCardFace } from "./IdCardFace";

/**
 * Card image display — shows front or back of an ID card. Pressable to flip.
 * The app decrypts a cached PNG; the wireframe draws `IdCardFace` instead.
 * A missing face path renders the unavailable placeholder with Try Again.
 */
export function CardImage({
  card,
  showBack,
  onFlip,
  onRetry,
  isRefreshing = false,
}: {
  card: CachedIdCard | null;
  showBack: boolean;
  onFlip: () => void;
  /** Refetch the cards; renders a Try Again button on the unavailable placeholder. */
  onRetry?: () => void;
  isRefreshing?: boolean;
}) {
  const { t } = useTranslation();

  const imagePath = card ? (showBack ? card.backImagePath : card.frontImagePath) : null;

  if (!card || isRefreshing) {
    return (
      <div className="bg-brand-surface rounded-2xl mx-4 h-52 items-center justify-center shadow-sm">
        <Icon name="card-outline" size={48} color={colors.brand.secondary} />
        <Caption className="mt-2">{t("common.loading")}</Caption>
      </div>
    );
  }

  if (!imagePath) {
    return (
      <div className="bg-brand-surface rounded-2xl mx-4 h-52 items-center justify-center shadow-sm">
        <Icon name="image-outline" size={48} color={colors.brand.secondary} />
        <Caption className="mt-2">{t("idCard.imageUnavailable")}</Caption>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            label={t("common.retry")}
            onPress={onRetry}
            className="mt-2"
            accessibilityHint={t("idCard.retryHint")}
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onFlip}
      className="mx-4 active:opacity-90"
      aria-label={t("idCard.flip")}
      aria-description={t(showBack ? "idCard.flipHintBack" : "idCard.flipHintFront")}
    >
      <div className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm">
        <div
          className="w-full h-52 justify-center"
          role="img"
          aria-label={`${card.planDisplayName} ${showBack ? t("idCard.back") : t("idCard.front")}`}
        >
          <IdCardFace card={card} showBack={showBack} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/40 rounded-full px-2 py-1 flex-row items-center">
          <Icon name="sync-outline" size={12} color={colors.brand.surface} />
          <span className="text-white text-xs ml-1">{showBack ? t("idCard.back") : t("idCard.front")}</span>
        </div>
      </div>
    </button>
  );
}
