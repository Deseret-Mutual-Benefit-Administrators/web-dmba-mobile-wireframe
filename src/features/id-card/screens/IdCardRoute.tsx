import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { OfflineBanner } from "@/src/shared/components/OfflineBanner";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { Label, Caption } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import { useScreenState } from "@/src/features/settings/useScreenState";
import { CardSelector } from "../components/CardSelector";
import { CardImage } from "../components/CardImage";
import { MemberDetails } from "../components/MemberDetails";
import { CardActions } from "../components/CardActions";
import { tollFreePhone } from "@/src/features/contact/data/departments";
import { placeholderCards } from "../placeholder";

/**
 * Stand-in for `useIdCards`. `?state=loading|error`; `?state=empty` keeps the
 * card data but drops both faces, which shows the "Card image unavailable" +
 * Try Again placeholder.
 */
function useIdCards() {
  const screenState = useScreenState();
  const cards =
    screenState === "empty"
      ? placeholderCards.map((c) => ({ ...c, frontImagePath: null, backImagePath: null }))
      : placeholderCards;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  return {
    cards,
    selectedCard: screenState === "error" ? null : cards[selectedIndex] ?? null,
    selectedIndex,
    selectCard: (index: number) => {
      setSelectedIndex(index);
      setShowBack(false);
    },
    showBack,
    toggleFlip: () => setShowBack((prev) => !prev),
    isLoading: screenState === "loading",
    isRefreshing: false,
    error: screenState === "error" ? new Error("unavailable") : null,
    refetch: () => undefined,
  };
}

/**
 * ID Card screen — modal presentation showing the member's insurance card.
 * For .NET devs: this is a thin route file that composes feature components.
 */
export function IdCardRoute() {
  const { t } = useTranslation();
  const { cards, selectedCard, selectedIndex, selectCard, showBack, toggleFlip, isLoading, isRefreshing, error, refetch } =
    useIdCards();

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background items-center justify-center">
        <Spinner size="large" />
        <Label className="mt-3">{t("common.loading")}</Label>
      </div>
    );
  }

  if (error && !selectedCard) {
    return (
      <div className="flex-1 bg-brand-background items-center justify-center px-8">
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <span className="text-brand-primary text-lg font-semibold mt-3 text-center">{t("common.error")}</span>
        <Button label={t("common.retry")} onPress={() => refetch()} size="sm" className="mt-4" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-background">
      <OfflineBanner />

      <div className="flex-1 overflow-y-auto scrollbar-none" style={{ paddingBottom: 40 }}>
        {/* Card type selector (if multiple cards) */}
        <CardSelector cards={cards} selectedIndex={selectedIndex} onSelect={selectCard} />

        {/* Card image */}
        <div className="mt-3">
          <CardImage card={selectedCard} showBack={showBack} onFlip={toggleFlip} onRetry={() => refetch()} isRefreshing={isRefreshing} />
        </div>

        {/* Member details */}
        <div className="mt-4">
          <MemberDetails card={selectedCard} />
        </div>

        {/* Action buttons */}
        <div className="mt-4">
          <CardActions card={selectedCard} showBack={showBack} onFlip={toggleFlip} />
        </div>

        {/* Support section */}
        <div className="mt-6 mx-4 items-center pb-4">
          <Label>{t("idCard.support")}</Label>
          <a
            href={tollFreePhone.number}
            className="mt-1 px-4 py-2.5 min-h-[44px] justify-center active:opacity-80"
            aria-label={t("idCard.supportPhone")}
            aria-description={t("common.hints.callsPhone")}
          >
            <span className="text-brand-accent text-base font-semibold">{t("idCard.supportPhone")}</span>
          </a>
          <Caption className="mt-0.5">{t("idCard.supportHours")}</Caption>
        </div>
      </div>
    </div>
  );
}
