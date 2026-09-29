import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface DetailActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  hint?: string;
}

/**
 * A single circular icon action button with a label underneath, used in the
 * action row on the provider and facility detail screens (Call / Directions /
 * Share / Add Contact).
 */
export function DetailActionButton({ icon, label, onPress, hint }: DetailActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex-1 items-center active:opacity-80"
      aria-label={label}
      aria-description={hint}
    >
      <div className="w-14 h-14 rounded-full border border-brand-accent items-center justify-center">
        <Icon name={icon} size={22} color={colors.brand.accent} />
      </div>
      <span className="text-xs text-brand-accent font-semibold mt-1.5 text-center">{label}</span>
    </button>
  );
}
