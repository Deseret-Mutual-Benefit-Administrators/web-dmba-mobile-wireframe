import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { useFinancialContent, categoryPillClasses, safeReadMinutes } from "../placeholder";
import { colors } from "@/src/shared/theme/colors";
import { Spinner } from "@/src/shared/components/Spinner";

const HERO_SIZE = 88;

/**
 * Financial Planning content cards — the dashboard carousel's CMS filtered to
 * this placement. Tapping opens the article reader. Renders nothing on error
 * or empty.
 */
export function FinancialContentCards() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: cards, isLoading, isError } = useFinancialContent();

  if (isLoading) {
    return (
      <div className="items-center py-4">
        <Spinner size="small" tone="accent" />
      </div>
    );
  }

  if (isError || !cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      {cards.map((card) => {
        const pill = categoryPillClasses(card.category.colorToken);
        const minutes = safeReadMinutes(card.readMinutes);
        return (
          <button
            type="button"
            key={card.id}
            onClick={() => navigate(`/article/${card.slug}`)}
            className="bg-brand-surface rounded-2xl shadow-sm overflow-hidden mb-2 flex-row active:opacity-80"
            aria-label={t("carousel.cardLabel", {
              title: card.title,
              category: card.category.displayName,
              readMinutes: minutes,
            })}
          >
            {card.hero != null ? (
              <img
                src={card.hero.url}
                style={{ width: HERO_SIZE, height: HERO_SIZE, objectFit: "cover" }}
                alt={card.hero.altText}
              />
            ) : (
              <div style={{ width: HERO_SIZE, height: HERO_SIZE }} className="bg-slate-200" aria-hidden="true" />
            )}
            <div className="flex-1 p-3">
              <div className={`self-start px-2 py-0.5 rounded-full mb-1 ${pill.bg}`}>
                <span className={`text-[10px] font-semibold ${pill.text}`}>{card.category.displayName}</span>
              </div>
              <span className="text-brand-primary font-semibold text-sm line-clamp-2">{card.title}</span>
              <div className="flex-row items-center mt-1">
                <Icon name="time-outline" size={12} color={colors.brand.secondary} />
                <span className="text-[11px] text-gray-500 ml-1">{t("carousel.readTime", { count: minutes })}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
