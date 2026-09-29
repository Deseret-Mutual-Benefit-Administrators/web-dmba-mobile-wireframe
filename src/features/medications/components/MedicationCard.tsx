import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import type { MedicationSummary } from "../types";
import { TierBadge } from "./TierBadge";
import { Caption } from "@/src/shared/components/Typography";
import { formatCopay, hasMedicationValue, requirementState } from "../services/medicationTransforms";

interface MedicationCardProps {
  medication: MedicationSummary;
}

export function MedicationCard({ medication }: MedicationCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const unavailable = t("common.unavailableValue");
  const copay = formatCopay(medication.copayDisplay, unavailable);
  const hasCopay = copay !== unavailable;
  const priorAuth = requirementState(medication.requiresPriorAuth);

  return (
    <button
      type="button"
      onClick={() => navigate(`/medication/${encodeURIComponent(medication.name)}`)}
      className="bg-brand-surface rounded-2xl p-4 shadow-sm mb-3 active:opacity-80"
      aria-label={`${medication.genericName}, ${hasMedicationValue(medication.tier) ? medication.tier : unavailable}`}
    >
      <div className="flex-row items-start justify-between">
        <div className="flex-1 mr-2">
          <span className="text-base font-bold text-brand-primary">{medication.genericName}</span>
          {medication.brandName && <span className="text-sm text-gray-500 mt-0.5">{medication.brandName}</span>}
        </div>
        <TierBadge tier={medication.tier} />
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 flex-row items-center justify-between">
        {hasCopay ? (
          <span className="text-sm font-semibold text-brand-accent">{copay}</span>
        ) : (
          <Caption>{copay}</Caption>
        )}
        {priorAuth === "required" && (
          <div className="bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
            <span className="text-xs text-orange-700 font-medium">{t("benefits.priorAuthRequired")}</span>
          </div>
        )}
        {priorAuth === "unknown" && <Caption>{t("search.medications.priorAuthUnavailable")}</Caption>}
      </div>
    </button>
  );
}
