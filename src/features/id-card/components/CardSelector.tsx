import { useTranslation } from "@/src/shared/i18n";
import type { CachedIdCard } from "../types";

/**
 * Horizontal pill/tab selector for multiple ID cards.
 * Shows "Medical" | "Dental" etc. when the member has more than one card.
 * Returns null if there's only one card (or none).
 */

function getCardLabel(cardType: string, t: (key: string) => string): string {
  const lower = cardType.toLowerCase();
  if (lower.includes("medical")) return t("idCard.medical");
  if (lower.includes("dental")) return t("idCard.dental");
  return cardType;
}

export function CardSelector({
  cards,
  selectedIndex,
  onSelect,
}: {
  cards: CachedIdCard[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useTranslation();

  if (cards.length <= 1) return null;

  return (
    <div className="flex-row justify-center px-4 py-2">
      <div className="flex-row bg-gray-100 rounded-full p-1" role="tablist">
        {cards.map((card, index) => {
          const isActive = index === selectedIndex;
          return (
            <button
              type="button"
              key={card.id}
              onClick={() => onSelect(index)}
              className={`px-5 py-2 rounded-full ${isActive ? "bg-brand-accent" : ""}`}
              role="tab"
              aria-selected={isActive}
              aria-label={getCardLabel(card.cardType, t)}
            >
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-600"}`}>
                {getCardLabel(card.cardType, t)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
