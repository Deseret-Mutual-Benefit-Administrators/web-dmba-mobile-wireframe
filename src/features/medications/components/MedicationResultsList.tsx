import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Spinner } from "@/src/shared/components/Spinner";
import { MedicationCard } from "./MedicationCard";
import { colors } from "@/src/shared/theme/colors";
import type { MedicationSummary } from "../types";

export interface MedicationResultsListProps {
  medications: MedicationSummary[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

/**
 * The medication search results list — rows and the loading/error/empty
 * states, with no search bar of its own. A failed read renders
 * `InlineErrorState`, never an empty list.
 */
export function MedicationResultsList({ medications, isLoading, isFetching, isError }: MedicationResultsListProps) {
  const { t } = useTranslation();

  const empty = (() => {
    if (isLoading || isFetching) {
      return (
        <div className="items-center py-8">
          <Spinner size="large" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="py-8 px-6">
          <InlineErrorState message={t("common.error")} />
        </div>
      );
    }
    return (
      <EmptyState icon={<Icon name="medkit-outline" size={48} color={colors.neutral[500]} />} title={t("search.noResults")} />
    );
  })();

  return (
    <div className="flex-1 bg-brand-surface overflow-y-auto scrollbar-none" style={{ minHeight: 0 }}>
      <div style={{ paddingBottom: 32, flexGrow: 1 }}>
        {medications.length === 0
          ? empty
          : medications.map((item) => (
              <div key={item.ndcCode} className="px-4">
                <MedicationCard medication={item} />
              </div>
            ))}
      </div>
    </div>
  );
}
