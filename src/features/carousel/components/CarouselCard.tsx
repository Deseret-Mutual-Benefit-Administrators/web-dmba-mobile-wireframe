import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { lines } from "@/src/features/dashboard/webText";
import type { CarouselCard as CarouselCardData } from "../types";
import { categoryPillClasses, safeReadMinutes } from "../services/carouselTransforms";
import { HeroPlaceholder } from "./HeroPlaceholder";

interface CarouselCardProps {
  card: CarouselCardData;
  onPress: (slug: string) => void;
  /** Card width from the horizontal pager (pixels, not %-based class). */
  cardWidth: number;
}

/** Fixed hero height for the dashboard carousel card (`h-32` = 128px). */
const HERO_HEIGHT = 128;

/**
 * A single card in the dashboard carousel horizontal pager: hero, meta row
 * (category pill + read time), title, 2-line excerpt. The hero image is drawn
 * as a neutral gradient block with the title (wireframe rule: no remote images).
 */
export function CarouselCard({ card, onPress, cardWidth }: CarouselCardProps) {
  const { t } = useTranslation();
  const pill = categoryPillClasses(card.category.colorToken);
  const minutes = safeReadMinutes(card.readMinutes);

  return (
    <button
      type="button"
      onClick={() => onPress(card.slug)}
      className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm active:opacity-80"
      style={{ width: cardWidth }}
      aria-label={t("carousel.cardLabel", {
        title: card.title,
        category: card.category.displayName,
        readMinutes: minutes,
      })}
    >
      {/* Hero */}
      <HeroPlaceholder title={card.title} width={cardWidth} height={HERO_HEIGHT} />

      {/* Card body */}
      <div className="p-4">
        {/* Meta row — category pill (left) + read-time (right) */}
        <div className="flex-row items-center justify-between mb-2">
          <div className={`px-2.5 py-1 rounded-full ${pill.bg}`}>
            <span className={`text-xs font-semibold ${pill.text}`}>{card.category.displayName}</span>
          </div>

          <div className="flex-row items-center ml-2">
            <Icon name="time-outline" size={13} color={colors.brand.secondary} />
            <span className="text-xs text-gray-500 ml-1">{t("carousel.readTime", { count: minutes })}</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-brand-primary font-bold text-base leading-snug mb-1" style={lines(2)}>
          {card.title}
        </p>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 leading-snug" style={lines(2)}>
          {card.excerpt}
        </p>
      </div>
    </button>
  );
}
