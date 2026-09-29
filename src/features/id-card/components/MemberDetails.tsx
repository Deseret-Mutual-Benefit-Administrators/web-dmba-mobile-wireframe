import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Label } from "@/src/shared/components/Typography";
import type { CachedIdCard } from "../types";

/**
 * Member details panel — shows key card data with copy-to-clipboard.
 * Tapping copies the value and briefly shows a "Copied!" indicator.
 */

function DetailRow({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // clipboard unavailable (e.g. headless); the indicator still shows
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <div className="flex-1">
        <Label>{label}</Label>
        <span className="text-sm text-brand-primary font-medium">{value}</span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-3 p-1 active:opacity-80"
        aria-label={t("idCard.copyField", { field: label })}
      >
        {copied ? (
          <div className="flex-row items-center">
            <Icon name="checkmark-circle" size={18} color={colors.success} />
            <span className="text-xs text-success ml-1">{t("idCard.copied")}</span>
          </div>
        ) : (
          <Icon name="copy-outline" size={18} color={colors.brand.secondary} />
        )}
      </button>
    </div>
  );
}

export function MemberDetails({ card }: { card: CachedIdCard | null }) {
  const { t } = useTranslation();

  if (!card) return null;

  return (
    <div className="bg-brand-surface rounded-2xl mx-4 px-4 py-2 shadow-sm">
      <DetailRow label={t("idCard.memberId")} value={card.policyId} />
      <DetailRow label={t("idCard.groupNumber")} value={card.groupNumber} />
      <DetailRow label={t("idCard.plan")} value={card.planDisplayName} />
      <DetailRow label={t("idCard.effectiveDate")} value={card.cardIssueDate} />
    </div>
  );
}
