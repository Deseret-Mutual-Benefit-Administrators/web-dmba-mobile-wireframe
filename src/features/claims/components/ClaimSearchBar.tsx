import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface ClaimSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

/**
 * Search input for filtering claims by provider, description, or claim number.
 * Debouncing is handled in the hook, not here — this is a controlled input.
 */
export function ClaimSearchBar({ value, onChangeText }: ClaimSearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-4 mb-3 flex-row items-center bg-brand-surface rounded-xl px-3 py-2 border border-gray-200">
      <Icon name="search-outline" size={20} color={colors.neutral[500]} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={t("claims.searchPlaceholder")}
        className="flex-1 ml-2 text-base text-brand-primary bg-transparent outline-none placeholder:text-neutral-500"
        autoCapitalize="none"
        autoCorrect="off"
        enterKeyHint="search"
        aria-label={t("claims.searchPlaceholder")}
      />
    </div>
  );
}
