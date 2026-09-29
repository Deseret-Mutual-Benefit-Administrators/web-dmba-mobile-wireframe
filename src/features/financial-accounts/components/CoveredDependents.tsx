import { useTranslation } from "@/src/shared/i18n";
import { useDependents } from "../api/accountsQueries";
import { getDependentRelationshipLabelKey, getDependentStatusLabelKey } from "../services/accountTransforms";
import type { CoveredDependent as CoveredDependentType } from "../types";

/**
 * "Covered on your account" section at the bottom of the benefit-cards list —
 * read-only. Hidden entirely on loading/empty/error.
 */
export function CoveredDependents() {
  const { t } = useTranslation();
  const { data: dependents, isLoading, isError } = useDependents();

  if (isLoading || isError || !dependents || dependents.length === 0) return null;

  return (
    <div className="mt-2">
      <span className="text-sm font-semibold text-gray-500 mb-2 mt-2">
        {t("financialAccounts.dependents.title")}
      </span>
      {dependents.map((dependent) => (
        <DependentRow key={dependent.id} dependent={dependent} />
      ))}
    </div>
  );
}

interface DependentRowProps {
  dependent: CoveredDependentType;
}

function DependentRow({ dependent }: DependentRowProps) {
  const { t } = useTranslation();
  const name =
    [dependent.firstName, dependent.lastName].filter(Boolean).join(" ") ||
    t("financialAccounts.dependents.unnamed");
  const relationshipLabel = t(getDependentRelationshipLabelKey(dependent.relationship));
  const statusLabel = t(getDependentStatusLabelKey(dependent.status));
  const showStatusTag = dependent.status !== "active";

  const rowLabel = showStatusTag
    ? t("financialAccounts.dependents.rowWithStatus", {
        name,
        relationship: relationshipLabel,
        status: statusLabel,
      })
    : t("financialAccounts.dependents.row", { name, relationship: relationshipLabel });

  return (
    <div
      className="bg-brand-surface rounded-2xl px-4 py-3 mb-2 flex-row items-center justify-between shadow-sm"
      role="text"
      aria-label={rowLabel}
    >
      <div className="flex-1 mr-3">
        <span className="text-sm font-medium text-brand-primary">{name}</span>
        <span className="text-xs text-gray-500 mt-0.5">{relationshipLabel}</span>
      </div>
      {showStatusTag && (
        <div className="bg-gray-100 rounded-full px-2 py-0.5">
          <span className="text-xs font-medium text-gray-600">{statusLabel}</span>
        </div>
      )}
    </div>
  );
}
