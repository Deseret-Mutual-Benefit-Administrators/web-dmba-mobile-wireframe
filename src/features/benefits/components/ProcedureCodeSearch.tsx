import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { Label } from "@/src/shared/components/Typography";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { colors } from "@/src/shared/theme/colors";
import { ProcedureCodeCard } from "./ProcedureCodeCard";
import type { ProcedureCode } from "../types";

interface ProcedureCodeSearchProps {
  searchInput: string;
  onSearchChange: (text: string) => void;
  codes: ProcedureCode[];
  totalCount: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  isLoading: boolean;
}

/**
 * Procedure code search panel — search input, result count, and list.
 * (The app's FlatList pages on end-reached; the sample list has one page.)
 */
export function ProcedureCodeSearch({
  searchInput,
  onSearchChange,
  codes,
  totalCount,
  isLoading,
}: ProcedureCodeSearchProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      {/* Search bar */}
      <div className="mx-4 mt-4 mb-3 flex-row items-center bg-brand-surface rounded-xl px-3 py-2 border border-gray-200">
        <Icon name="search-outline" size={20} color={colors.neutral[500]} />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("benefits.procedureCodes.searchPlaceholder")}
          className="flex-1 ml-2 text-base text-brand-primary placeholder:text-gray-500"
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="search"
          aria-label={t("benefits.procedureCodes.searchPlaceholder")}
        />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="items-center justify-center py-12">
          <Spinner size="large" tone="accent" />
          <Label className="mt-2">{t("common.loading")}</Label>
        </div>
      )}

      {/* Results list */}
      {!isLoading && (
        <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          {searchInput.length > 0 && codes.length > 0 ? (
            <span className="text-xs text-gray-500 mb-3">
              {t("benefits.procedureCodes.totalResults", { count: totalCount })}
            </span>
          ) : null}
          {codes.map((item) => (
            <ProcedureCodeCard key={item.id} code={item} />
          ))}
          {codes.length === 0 &&
            (searchInput.length > 0 ? (
              <div className="items-center justify-center py-16 px-6">
                <EmptyState
                  icon={<Icon name="search-outline" size={48} color={colors.neutral[500]} />}
                  title={t("benefits.procedureCodes.noResults")}
                />
              </div>
            ) : (
              <div className="items-center justify-center py-16 px-6">
                <EmptyState
                  icon={<Icon name="code-slash-outline" size={48} color={colors.neutral[500]} />}
                  title={t("benefits.procedureCodes.title")}
                  message={t("benefits.procedureCodes.searchPlaceholder")}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
