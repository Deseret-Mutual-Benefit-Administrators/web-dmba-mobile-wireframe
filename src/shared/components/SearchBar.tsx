import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onClear: () => void;
}

export function SearchBar({ value, onChangeText, placeholder, onClear }: SearchBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex-row items-stretch bg-brand-surface rounded-2xl px-3 py-3.5 shadow-sm border border-gray-100">
      <div className="justify-center">
        <Icon name="search-outline" size={20} color={colors.neutral[500]} />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 ml-2 text-base text-brand-primary placeholder:text-gray-500"
        autoCapitalize="none"
        autoCorrect="off"
        enterKeyHint="search"
        aria-label={placeholder}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="p-1 active:opacity-80 justify-center"
          aria-label={t("search.clearSearch")}
        >
          <Icon name="close-circle" size={18} color={colors.neutral[500]} />
        </button>
      )}
    </div>
  );
}
