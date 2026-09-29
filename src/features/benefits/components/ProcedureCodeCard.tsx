import { useTranslation } from "@/src/shared/i18n";
import { Badge } from "@/src/shared/components/Badge";
import { getCodeTypeBadgeTone } from "../services/benefitsTransforms";
import type { ProcedureCode } from "../types";

interface ProcedureCodeCardProps {
  code: ProcedureCode;
}

/**
 * Displays a single procedure code search result.
 * Shows code, type badge, description, and prior auth indicator.
 */
export function ProcedureCodeCard({ code }: ProcedureCodeCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className="bg-brand-surface rounded-xl p-4 mb-2"
      aria-label={`${code.code}, ${code.description}${code.requiresPreauth ? `, ${t("benefits.procedureCodes.priorAuth")}` : ""}`}
    >
      {/* Top row: code + type badge */}
      <div className="flex-row items-center mb-2">
        <span className="text-sm font-bold text-brand-primary font-mono mr-2">{code.code}</span>
        <Badge tone={getCodeTypeBadgeTone(code.codeType)} label={code.codeType} />
      </div>

      {/* Description */}
      <span className="text-sm text-gray-600 leading-5">{code.description}</span>

      {/* Prior auth badge */}
      {code.requiresPreauth && (
        <div className="mt-2">
          <Badge tone="warning" label={t("benefits.procedureCodes.priorAuth")} />
        </div>
      )}
    </div>
  );
}
