import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating && rating - i >= 0.5;
    return { index: i, filled, half };
  });

  return (
    <div className="flex-row items-center">
      {stars.map(({ index, filled, half }) => (
        <Icon key={index} name={filled ? "star" : half ? "star-half" : "star-outline"} size={14} color={colors.highlight.base} />
      ))}
      {reviewCount != null && <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>}
    </div>
  );
}
